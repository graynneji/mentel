// // app/api/eap/assessment/route.ts
// // POST: Save EAP assessment, compute scores, send emails, return results.
// // GET:  Return employee's assessment history.

// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { verify } from "jsonwebtoken";
// import { computeScores } from "@/lib/eap-scoring";
// import {
//   sendAssessmentConfirmation,
//   sendCrisisAcknowledgement,
//   sendAdminCrisisAlert,
// } from "@/lib/eap-emails";

// const EMPLOYEE_SECRET = process.env.EMPLOYEE_SESSION_SECRET ?? "change-me";

// const DOMAIN_LABELS: Record<string, string> = {
//   stress: "Stress management",
//   anxiety: "Anxiety & worry",
//   depression: "Low mood & depression",
//   burnout: "Work burnout",
//   sleep: "Sleep quality",
//   relationships: "Relationships",
//   selfesteem: "Self-esteem & confidence",
// };

// function getTopDomains(scores: ReturnType<typeof computeScores>): string[] {
//   return Object.entries({
//     "Stress management": scores.stressScore ?? 0,
//     "Anxiety & worry": scores.anxietyScore ?? 0,
//     "Low mood & depression": scores.depressionScore ?? 0,
//     "Work burnout": scores.burnoutScore ?? 0,
//     "Sleep quality": scores.sleepScore ?? 0,
//     Relationships: scores.relationshipScore ?? 0,
//     "Self-esteem": scores.selfEsteemScore ?? 0,
//   })
//     .filter(([, v]) => v >= 50)
//     .sort(([, a], [, b]) => b - a)
//     .slice(0, 3)
//     .map(([label]) => label);
// }

// function getAuthEmployee(
//   req: NextRequest,
// ): { employeeId: string; companyId: string } | null {
//   const token =
//     req.cookies.get("mentel_eap_token")?.value ??
//     req.headers.get("authorization")?.replace("Bearer ", "");
//   console.log(token, EMPLOYEE_SECRET, "Verifying employee token");
//   if (!token) return null;
//   try {
//     const payload = verify(token, EMPLOYEE_SECRET) as {
//       employeeId: string;
//       companyId: string;
//     };
//     return payload;
//   } catch {
//     return null;
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const auth = getAuthEmployee(req);
//     if (!auth) {
//       return NextResponse.json(
//         { error: "Not authenticated. Please enrol first." },
//         { status: 401 },
//       );
//     }

//     const body = await req.json();
//     const { answers, relationshipStatus, hasChildren } = body as {
//       answers: Record<string, number>;
//       relationshipStatus?: string;
//       hasChildren?: boolean;
//     };

//     if (!answers || typeof answers !== "object") {
//       return NextResponse.json({ error: "Invalid answers." }, { status: 400 });
//     }

//     // Compute scores
//     const scores = computeScores(answers);

//     // Generate recommendations
//     const recommendations = generateRecommendations(scores);

//     // Save to DB
//     const assessment = await db.eAPAssessment.create({
//       data: {
//         employeeId: auth.employeeId,
//         answers,
//         stressScore: scores.stressScore,
//         anxietyScore: scores.anxietyScore,
//         depressionScore: scores.depressionScore,
//         burnoutScore: scores.burnoutScore,
//         sleepScore: scores.sleepScore,
//         relationshipScore: scores.relationshipScore,
//         selfEsteemScore: scores.selfEsteemScore,
//         totalScore: scores.totalScore,
//         riskBand: scores.riskBand,
//         flags: scores.flags,
//         relationshipStatus: relationshipStatus ?? null,
//         hasChildren: hasChildren ?? null,
//         recommendations: recommendations,
//       },
//     });

//     // Update employee aggregate
//     const allAssessments = await db.eAPAssessment.findMany({
//       where: { employeeId: auth.employeeId },
//       orderBy: { createdAt: "asc" },
//       select: { totalScore: true },
//     });

//     const firstScore = allAssessments[0]?.totalScore ?? scores.totalScore;
//     const improvementPct =
//       firstScore > 0
//         ? Math.round(((firstScore - scores.totalScore) / firstScore) * 100)
//         : 0;

//     await db.companyEmployee.update({
//       where: { id: auth.employeeId },
//       data: {
//         riskBand: scores.riskBand,
//         overallScore: scores.totalScore,
//         lastAssessmentAt: new Date(),
//         improvementPct,
//       },
//     });

//     // Fetch employee + company for emails
//     const employee = await db.companyEmployee.findUnique({
//       where: { id: auth.employeeId },
//       include: { company: true },
//     });

//     // Send emails (non-blocking)
//     if (employee) {
//       const topDomains = getTopDomains(scores);

//       if (employee.email) {
//         if (scores.flags.includes("crisis")) {
//           // Crisis: send urgent acknowledgement
//           sendCrisisAcknowledgement({
//             to: employee.email,
//             name: employee.name,
//           });
//         } else {
//           // Normal: send confirmation
//           sendAssessmentConfirmation({
//             to: employee.email,
//             name: employee.name,
//             riskBand: scores.riskBand,
//             topDomains,
//             companyName: employee.company.name,
//           });
//         }
//       }

//       // Always alert admin for crisis flags
//       if (
//         scores.flags.includes("crisis") ||
//         scores.flags.includes("suicidal_ideation")
//       ) {
//         sendAdminCrisisAlert({
//           employeeId: employee.id,
//           companyName: employee.company.name,
//           riskBand: scores.riskBand,
//           flags: scores.flags,
//           department: employee.department ?? undefined,
//         });
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       assessmentId: assessment.id,
//       scores,
//       recommendations,
//     });
//   } catch (err) {
//     console.error("[EAP assessment]", err);
//     return NextResponse.json(
//       { error: "Failed to save assessment." },
//       { status: 500 },
//     );
//   }
// }

// export async function GET(req: NextRequest) {
//   try {
//     const auth = getAuthEmployee(req);
//     if (!auth)
//       return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

//     const assessments = await db.eAPAssessment.findMany({
//       where: { employeeId: auth.employeeId },
//       orderBy: { createdAt: "desc" },
//       select: {
//         id: true,
//         createdAt: true,
//         totalScore: true,
//         riskBand: true,
//         stressScore: true,
//         anxietyScore: true,
//         depressionScore: true,
//         burnoutScore: true,
//         sleepScore: true,
//         relationshipScore: true,
//         selfEsteemScore: true,
//         flags: true,
//         recommendations: true,
//       },
//     });

//     return NextResponse.json({ success: true, assessments });
//   } catch (err) {
//     console.error("[EAP assessment GET]", err);
//     return NextResponse.json(
//       { error: "Failed to fetch assessments." },
//       { status: 500 },
//     );
//   }
// }

// // ── Recommendations ────────────────────────────────────────────────────────────

// function generateRecommendations(scores: ReturnType<typeof computeScores>) {
//   const recs: { type: string; title: string; description: string }[] = [];

//   if (scores.depressionScore >= 40) {
//     recs.push({
//       type: "therapy",
//       title: "Individual therapy",
//       description:
//         "Talking therapy with a licensed therapist is strongly recommended to address persistent low mood and help rebuild motivation and outlook.",
//     });
//   }
//   if (scores.anxietyScore >= 40) {
//     recs.push({
//       type: "cbt",
//       title: "Cognitive Behavioural Therapy (CBT)",
//       description:
//         "CBT is highly effective for anxiety. Your therapist can teach you evidence-based tools to challenge anxious thought patterns.",
//     });
//   }
//   if (scores.burnoutScore >= 50) {
//     recs.push({
//       type: "coaching",
//       title: "Burnout coaching",
//       description:
//         "Work-focused coaching can help you set sustainable boundaries, recover your energy, and rediscover meaning in your work.",
//     });
//   }
//   if (scores.sleepScore >= 40) {
//     recs.push({
//       type: "sleep",
//       title: "Sleep hygiene programme",
//       description:
//         "CBT-I (Cognitive Behavioural Therapy for Insomnia) has strong evidence for treating chronic sleep difficulties.",
//     });
//   }
//   if ((scores.relationshipScore ?? 0) >= 50) {
//     recs.push({
//       type: "relationships",
//       title: "Relationship or couples therapy",
//       description:
//         "Our therapists include specialists in relationship dynamics, communication breakdown, and intimacy — for individuals or couples.",
//     });
//   }
//   if (scores.selfEsteemScore >= 45) {
//     recs.push({
//       type: "selfesteem",
//       title: "Self-compassion and identity work",
//       description:
//         "Schema therapy and Compassion-Focused Therapy (CFT) are particularly effective for building a healthier relationship with yourself.",
//     });
//   }

//   // Always include mindfulness as a complement
//   recs.push({
//     type: "mindfulness",
//     title: "Mindfulness and stress regulation",
//     description:
//       "Even 10 minutes of daily practice can measurably reduce cortisol levels. Your therapist can recommend a structured programme.",
//   });

//   return recs;
// }

// app/api/eap/assessment/route.ts
// POST: Save EAP assessment, compute scores, send emails, return results.
// GET:  Return employee's assessment history.
//
// KEY FIX: improvementPct is now computed by fetching the FIRST assessment
// BEFORE saving the new one, so firstScore is never the current assessment.

// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { verify } from "jsonwebtoken";
// import { computeScores } from "@/lib/eap-scoring";
// import {
//   sendAssessmentConfirmation,
//   sendCrisisAcknowledgement,
//   sendAdminCrisisAlert,
// } from "@/lib/eap-emails";

// const EMPLOYEE_SECRET = process.env.EMPLOYEE_SESSION_SECRET ?? "change-me";

// function getAuthEmployee(
//   req: NextRequest,
// ): { employeeId: string; companyId: string } | null {
//   const token =
//     req.cookies.get("mentel_eap_token")?.value ??
//     req.headers.get("authorization")?.replace("Bearer ", "");
//   if (!token) return null;
//   try {
//     return verify(token, EMPLOYEE_SECRET) as {
//       employeeId: string;
//       companyId: string;
//     };
//   } catch {
//     return null;
//   }
// }

// function getTopDomains(scores: ReturnType<typeof computeScores>): string[] {
//   return Object.entries({
//     "Stress management": scores.stressScore ?? 0,
//     "Anxiety & worry": scores.anxietyScore ?? 0,
//     "Low mood & depression": scores.depressionScore ?? 0,
//     "Work burnout": scores.burnoutScore ?? 0,
//     "Sleep quality": scores.sleepScore ?? 0,
//     Relationships: scores.relationshipScore ?? 0,
//     "Self-esteem": scores.selfEsteemScore ?? 0,
//   })
//     .filter(([, v]) => v >= 50)
//     .sort(([, a], [, b]) => b - a)
//     .slice(0, 3)
//     .map(([label]) => label);
// }

// export async function POST(req: NextRequest) {
//   try {
//     const auth = getAuthEmployee(req);
//     if (!auth) {
//       return NextResponse.json(
//         { error: "Not authenticated. Please enrol first." },
//         { status: 401 },
//       );
//     }

//     const body = await req.json();
//     const { answers, relationshipStatus, hasChildren } = body as {
//       answers: Record<string, number>;
//       relationshipStatus?: string;
//       hasChildren?: boolean;
//     };

//     if (!answers || typeof answers !== "object") {
//       return NextResponse.json({ error: "Invalid answers." }, { status: 400 });
//     }

//     // ── STEP 1: Fetch the FIRST existing assessment BEFORE saving the new one ──
//     // This is critical — if we fetch after saving, the new assessment IS the first
//     // and improvement always computes as 0.
//     const firstExistingAssessment = await db.eAPAssessment.findFirst({
//       where: { employeeId: auth.employeeId },
//       orderBy: { createdAt: "asc" },
//       select: { totalScore: true },
//     });

//     // ── STEP 2: Compute scores ─────────────────────────────────────────────────
//     const scores = computeScores(answers);
//     const recommendations = generateRecommendations(scores);

//     // ── STEP 3: Save assessment ────────────────────────────────────────────────
//     const assessment = await db.eAPAssessment.create({
//       data: {
//         employeeId: auth.employeeId,
//         answers,
//         stressScore: scores.stressScore,
//         anxietyScore: scores.anxietyScore,
//         depressionScore: scores.depressionScore,
//         burnoutScore: scores.burnoutScore,
//         sleepScore: scores.sleepScore,
//         relationshipScore: scores.relationshipScore,
//         selfEsteemScore: scores.selfEsteemScore,
//         totalScore: scores.totalScore,
//         riskBand: scores.riskBand,
//         flags: scores.flags,
//         relationshipStatus: relationshipStatus ?? null,
//         hasChildren: hasChildren ?? null,
//         recommendations,
//       },
//     });

//     // ── STEP 4: Compute improvement % ─────────────────────────────────────────
//     // firstExistingAssessment is null if this is the employee's first assessment.
//     // In that case improvement is 0 (baseline — no comparison yet).
//     const firstScore = firstExistingAssessment?.totalScore ?? null;
//     const improvementPct =
//       firstScore !== null && firstScore > 0
//         ? Math.round(((firstScore - scores.totalScore) / firstScore) * 100)
//         : 0;

//     // ── STEP 5: Update employee aggregate ─────────────────────────────────────
//     await db.companyEmployee.update({
//       where: { id: auth.employeeId },
//       data: {
//         riskBand: scores.riskBand,
//         overallScore: scores.totalScore,
//         lastAssessmentAt: new Date(),
//         improvementPct, // now correctly non-zero after second+ assessment
//       },
//     });

//     // ── STEP 6: Send emails (fire and forget) ─────────────────────────────────
//     const employee = await db.companyEmployee.findUnique({
//       where: { id: auth.employeeId },
//       include: { company: true },
//     });

//     if (employee) {
//       const topDomains = getTopDomains(scores);

//       if (employee.email) {
//         if (scores.flags.includes("crisis")) {
//           sendCrisisAcknowledgement({
//             to: employee.email,
//             name: employee.name,
//           });
//         } else {
//           sendAssessmentConfirmation({
//             to: employee.email,
//             name: employee.name,
//             riskBand: scores.riskBand,
//             topDomains,
//             companyName: employee.company.name,
//           });
//         }
//       }

//       if (
//         scores.flags.includes("crisis") ||
//         scores.flags.includes("suicidal_ideation")
//       ) {
//         sendAdminCrisisAlert({
//           employeeId: employee.id,
//           companyName: employee.company.name,
//           riskBand: scores.riskBand,
//           flags: scores.flags,
//           department: employee.department ?? undefined,
//         });
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       assessmentId: assessment.id,
//       scores,
//       recommendations,
//       improvementPct, // included so client can show it immediately
//     });
//   } catch (err) {
//     console.error("[EAP assessment POST]", err);
//     return NextResponse.json(
//       { error: "Failed to save assessment." },
//       { status: 500 },
//     );
//   }
// }

// export async function GET(req: NextRequest) {
//   try {
//     const auth = getAuthEmployee(req);
//     if (!auth) {
//       return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
//     }

//     const assessments = await db.eAPAssessment.findMany({
//       where: { employeeId: auth.employeeId },
//       orderBy: { createdAt: "desc" },
//       select: {
//         id: true,
//         createdAt: true,
//         totalScore: true,
//         riskBand: true,
//         stressScore: true,
//         anxietyScore: true,
//         depressionScore: true,
//         burnoutScore: true,
//         sleepScore: true,
//         relationshipScore: true,
//         selfEsteemScore: true,
//         flags: true,
//         recommendations: true,
//       },
//     });

//     return NextResponse.json({ success: true, assessments });
//   } catch (err) {
//     console.error("[EAP assessment GET]", err);
//     return NextResponse.json(
//       { error: "Failed to fetch assessments." },
//       { status: 500 },
//     );
//   }
// }

// // ── Recommendations ────────────────────────────────────────────────────────────

// function generateRecommendations(scores: ReturnType<typeof computeScores>) {
//   const recs: { type: string; title: string; description: string }[] = [];

//   if (scores.depressionScore >= 40) {
//     recs.push({
//       type: "therapy",
//       title: "Individual therapy",
//       description:
//         "Talking therapy with a licensed therapist is strongly recommended to address persistent low mood and help rebuild motivation and outlook.",
//     });
//   }
//   if (scores.anxietyScore >= 40) {
//     recs.push({
//       type: "cbt",
//       title: "Cognitive Behavioural Therapy (CBT)",
//       description:
//         "CBT is highly effective for anxiety. Your therapist can teach you evidence-based tools to challenge anxious thought patterns.",
//     });
//   }
//   if (scores.burnoutScore >= 50) {
//     recs.push({
//       type: "coaching",
//       title: "Burnout coaching",
//       description:
//         "Work-focused coaching can help you set sustainable boundaries, recover your energy, and rediscover meaning in your work.",
//     });
//   }
//   if (scores.sleepScore >= 40) {
//     recs.push({
//       type: "sleep",
//       title: "Sleep hygiene programme",
//       description:
//         "CBT-I (Cognitive Behavioural Therapy for Insomnia) has strong evidence for treating chronic sleep difficulties.",
//     });
//   }
//   if ((scores.relationshipScore ?? 0) >= 50) {
//     recs.push({
//       type: "relationships",
//       title: "Relationship or couples therapy",
//       description:
//         "Our therapists include specialists in relationship dynamics, communication breakdown, and intimacy — for individuals or couples.",
//     });
//   }
//   if (scores.selfEsteemScore >= 45) {
//     recs.push({
//       type: "selfesteem",
//       title: "Self-compassion and identity work",
//       description:
//         "Schema therapy and Compassion-Focused Therapy (CFT) are particularly effective for building a healthier relationship with yourself.",
//     });
//   }

//   recs.push({
//     type: "mindfulness",
//     title: "Mindfulness and stress regulation",
//     description:
//       "Even 10 minutes of daily practice can measurably reduce cortisol levels. Your therapist can recommend a structured programme.",
//   });

//   return recs;
// }

// app/api/eap/assessment/route.ts
// KEY CHANGE: On first assessment, sets companyEmployee.baselineScore.
// All future improvementPct calculations use baselineScore, not firstAssessment.totalScore.
// This means admin can safely edit domain scores without breaking improvement %.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verify } from "jsonwebtoken";
import { computeScores } from "@/lib/eap-scoring";
import {
  sendAssessmentConfirmation,
  sendCrisisAcknowledgement,
  sendAdminCrisisAlert,
} from "@/lib/eap-emails";

const EMPLOYEE_SECRET = process.env.EMPLOYEE_SESSION_SECRET ?? "change-me";

function getAuthEmployee(
  req: NextRequest,
): { employeeId: string; companyId: string } | null {
  const token =
    req.cookies.get("mentel_eap_token")?.value ??
    req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  try {
    return verify(token, EMPLOYEE_SECRET) as {
      employeeId: string;
      companyId: string;
    };
  } catch {
    return null;
  }
}

function getTopDomains(scores: ReturnType<typeof computeScores>): string[] {
  return Object.entries({
    "Stress management": scores.stressScore ?? 0,
    "Anxiety & worry": scores.anxietyScore ?? 0,
    "Low mood & depression": scores.depressionScore ?? 0,
    "Work burnout": scores.burnoutScore ?? 0,
    "Sleep quality": scores.sleepScore ?? 0,
    Relationships: scores.relationshipScore ?? 0,
    "Self-esteem": scores.selfEsteemScore ?? 0,
  })
    .filter(([, v]) => v >= 50)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([label]) => label);
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthEmployee(req);
    if (!auth) {
      return NextResponse.json(
        { error: "Not authenticated. Please enrol first." },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { answers, relationshipStatus, hasChildren } = body as {
      answers: Record<string, number>;
      relationshipStatus?: string;
      hasChildren?: boolean;
    };

    if (!answers || typeof answers !== "object") {
      return NextResponse.json({ error: "Invalid answers." }, { status: 400 });
    }

    // ── Read baseline BEFORE saving the new assessment ────────────────────────
    // baselineScore is set once (on first assessment) and never changed.
    // It lives on the employee record, not on any assessment row.
    const employee = await db.companyEmployee.findUnique({
      where: { id: auth.employeeId },
      select: {
        baselineScore: true,
        baselineAssessmentId: true,
        company: true,
        email: true,
        name: true,
        department: true,
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found." },
        { status: 404 },
      );
    }

    const isFirstAssessment = employee.baselineScore === null;

    // ── Compute scores ────────────────────────────────────────────────────────
    const scores = computeScores(answers);
    const recommendations = generateRecommendations(scores);

    // ── Save assessment ───────────────────────────────────────────────────────
    const assessment = await db.eAPAssessment.create({
      data: {
        employeeId: auth.employeeId,
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
        relationshipStatus: relationshipStatus ?? null,
        hasChildren: hasChildren ?? null,
        recommendations,
      },
    });

    // ── Compute improvement % using stored baseline ───────────────────────────
    // First assessment: baseline = current score, improvement = 0 (nothing to compare)
    // Later assessments: compare against the stored baseline, which never changes
    const baselineScore = isFirstAssessment
      ? scores.totalScore
      : (employee.baselineScore ?? scores.totalScore);
    const improvementPct =
      baselineScore > 0 && !isFirstAssessment
        ? Math.round(
            ((baselineScore - scores.totalScore) / baselineScore) * 100,
          )
        : 0;

    // ── Update employee aggregate ─────────────────────────────────────────────
    await db.companyEmployee.update({
      where: { id: auth.employeeId },
      data: {
        riskBand: scores.riskBand,
        overallScore: scores.totalScore,
        lastAssessmentAt: new Date(),
        improvementPct,
        // Only set baseline on the very first assessment — never overwrite it
        ...(isFirstAssessment
          ? {
              baselineScore: scores.totalScore,
              baselineAssessmentId: assessment.id,
            }
          : {}),
      },
    });

    // ── Send emails ───────────────────────────────────────────────────────────
    if (employee.company) {
      const topDomains = getTopDomains(scores);

      if (employee.email) {
        if (scores.flags.includes("crisis")) {
          sendCrisisAcknowledgement({
            to: employee.email,
            name: employee.name,
          });
        } else {
          sendAssessmentConfirmation({
            to: employee.email,
            name: employee.name,
            riskBand: scores.riskBand,
            topDomains,
            companyName: employee.company.name,
          });
        }
      }

      if (
        scores.flags.includes("crisis") ||
        scores.flags.includes("suicidal_ideation")
      ) {
        sendAdminCrisisAlert({
          employeeId: auth.employeeId,
          companyName: employee.company.name,
          riskBand: scores.riskBand,
          flags: scores.flags,
          department: employee.department ?? undefined,
        });
      }
    }

    return NextResponse.json({
      success: true,
      assessmentId: assessment.id,
      scores,
      recommendations,
      improvementPct,
      isFirstAssessment,
    });
  } catch (err) {
    console.error("[EAP assessment POST]", err);
    return NextResponse.json(
      { error: "Failed to save assessment." },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthEmployee(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }
    const assessments = await db.eAPAssessment.findMany({
      where: { employeeId: auth.employeeId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        totalScore: true,
        riskBand: true,
        stressScore: true,
        anxietyScore: true,
        depressionScore: true,
        burnoutScore: true,
        sleepScore: true,
        relationshipScore: true,
        selfEsteemScore: true,
        flags: true,
        recommendations: true,
      },
    });
    return NextResponse.json({ success: true, assessments });
  } catch (err) {
    console.error("[EAP assessment GET]", err);
    return NextResponse.json(
      { error: "Failed to fetch assessments." },
      { status: 500 },
    );
  }
}

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
