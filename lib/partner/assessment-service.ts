// lib/partner/assessment-service.ts
//
// Shared assessment-submission logic — used by BOTH the API-key-authenticated
// route (app/api/partner/v1/beneficiaries/[externalRef]/assessments) and the
// token-authenticated hosted-flow route (app/api/partner-session/[token]/assessment).
// Deliberately factored out so crisis-escalation logic exists in exactly one
// place: whichever way a beneficiary's answers reach Mentel, the same scoring,
// the same webhook, and the same internal admin alert fire. Two copies of this
// would be the kind of thing that quietly drifts and someone finds out during
// an actual crisis, which is the one place that can't happen.

import { db } from "@/lib/db";
import { computeScores } from "@/lib/eap-scoring";
import { sendAdminCrisisAlert } from "@/lib/eap-emails";
import { dispatchWebhookEvent } from "@/lib/partner/webhooks";
import type { Partner, PartnerBeneficiary } from "@/generated/prisma/client";

export async function submitAssessment(
  partner: Pick<Partner, "id" | "name">,
  beneficiary: PartnerBeneficiary,
  answers: Record<string, number>,
) {
  const isFirstAssessment = beneficiary.baselineScore === null;
  const scores = computeScores(answers);
  const recommendations = generateRecommendations(scores);

  const assessment = await db.partnerAssessment.create({
    data: {
      beneficiaryId: beneficiary.id,
      answers,
      stressScore: scores.stressScore,
      anxietyScore: scores.anxietyScore,
      depressionScore: scores.depressionScore,
      burnoutScore: scores.burnoutScore,
      sleepScore: scores.sleepScore,
      relationshipScore: scores.relationshipScore,
      selfEsteemScore: scores.selfEsteemScore,
      totalScore: scores.totalScore,
      riskBand: scores.riskBand,
      flags: scores.flags,
      recommendations,
    },
  });

  const baselineScore = isFirstAssessment
    ? scores.totalScore
    : (beneficiary.baselineScore ?? scores.totalScore);
  const improvementPct =
    baselineScore > 0 && !isFirstAssessment
      ? Math.round(((baselineScore - scores.totalScore) / baselineScore) * 100)
      : 0;

  await db.partnerBeneficiary.update({
    where: { id: beneficiary.id },
    data: {
      riskBand: scores.riskBand,
      overallScore: scores.totalScore,
      lastAssessmentAt: new Date(),
      ...(isFirstAssessment
        ? { baselineScore: scores.totalScore, baselineAssessmentId: assessment.id }
        : {}),
    },
  });

  const isCrisis =
    scores.flags.includes("crisis") || scores.flags.includes("suicidal_ideation");

  if (isCrisis) {
    await Promise.allSettled([
      dispatchWebhookEvent(partner.id, "crisis.detected", {
        externalRef: beneficiary.externalRef,
        name: beneficiary.anonymous ? null : beneficiary.name,
        email: beneficiary.anonymous ? null : beneficiary.email,
        phone: beneficiary.anonymous ? null : beneficiary.phone,
        riskBand: scores.riskBand,
        flags: scores.flags,
        assessmentId: assessment.id,
        occurredAt: assessment.createdAt,
      }),
      sendAdminCrisisAlert({
        employeeId: beneficiary.id,
        companyName: `[Partner] ${partner.name}`,
        riskBand: scores.riskBand,
        flags: scores.flags,
        department: beneficiary.externalRef,
        partner: true,
      }),
    ]);
  }

  return {
    assessmentId: assessment.id,
    scores,
    recommendations,
    improvementPct,
    isFirstAssessment,
    crisisEscalated: isCrisis,
  };
}

// Mirrors app/api/eap/assessment/route.ts — kept as a local copy so
// partner-facing wording can diverge later without touching the internal
// EAP flow's own copy.
function generateRecommendations(scores: ReturnType<typeof computeScores>) {
  const recs: { type: string; title: string; description: string }[] = [];
  if (scores.depressionScore >= 40)
    recs.push({
      type: "therapy",
      title: "Individual therapy",
      description:
        "Talking therapy with a licensed therapist is strongly recommended to address persistent low mood and help rebuild motivation and outlook.",
    });
  if (scores.anxietyScore >= 40)
    recs.push({
      type: "cbt",
      title: "Cognitive Behavioural Therapy (CBT)",
      description:
        "CBT is highly effective for anxiety. Your therapist can teach you evidence-based tools to challenge anxious thought patterns.",
    });
  if (scores.burnoutScore >= 50)
    recs.push({
      type: "coaching",
      title: "Burnout coaching",
      description:
        "Work-focused coaching can help you set sustainable boundaries, recover your energy, and rediscover meaning in your work.",
    });
  if (scores.sleepScore >= 40)
    recs.push({
      type: "sleep",
      title: "Sleep hygiene programme",
      description:
        "CBT-I (Cognitive Behavioural Therapy for Insomnia) has strong evidence for treating chronic sleep difficulties.",
    });
  if ((scores.relationshipScore ?? 0) >= 50)
    recs.push({
      type: "relationships",
      title: "Relationship or couples therapy",
      description:
        "Our therapists include specialists in relationship dynamics, communication breakdown, and intimacy — for individuals or couples.",
    });
  if (scores.selfEsteemScore >= 45)
    recs.push({
      type: "selfesteem",
      title: "Self-compassion and identity work",
      description:
        "Schema therapy and Compassion-Focused Therapy (CFT) are particularly effective for building a healthier relationship with yourself.",
    });
  recs.push({
    type: "mindfulness",
    title: "Mindfulness and stress regulation",
    description:
      "Even 10 minutes of daily practice can measurably reduce cortisol levels. Your therapist can recommend a structured programme.",
  });
  return recs;
}
