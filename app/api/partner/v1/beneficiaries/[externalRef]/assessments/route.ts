// app/api/partner/v1/beneficiaries/[externalRef]/assessments/route.ts
//
// POST: submit an assessment for a beneficiary (API-key authenticated —
//       for partners driving this server-to-server, e.g. after collecting
//       answers in their own UI via GET /assessment/questions). The same
//       scoring + crisis-escalation logic backs the hosted flow at
//       app/api/partner-session/[token]/assessment — see
//       lib/partner/assessment-service.ts, which is the actual scoring/
//       webhook/alert logic; this route is just the API-key-auth wrapper
//       around it.
// GET:  assessment history for a beneficiary.

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withPartnerAuth } from "@/lib/partner/with-auth";
import { partnerError } from "@/lib/partner/errors";
import { submitAssessment } from "@/lib/partner/assessment-service";

export const POST = withPartnerAuth<{
  params: Promise<{ externalRef: string }>;
}>(async (req, partner, ctx) => {
  const { externalRef } = await ctx.params;

  const beneficiary = await db.partnerBeneficiary.findUnique({
    where: { partnerId_externalRef: { partnerId: partner.id, externalRef } },
  });
  if (!beneficiary) {
    return partnerError(
      404,
      "beneficiary_not_found",
      `No beneficiary found with externalRef "${externalRef}". Enrol them first via POST /beneficiaries.`,
    );
  }

  let body: { answers?: Record<string, number> };
  try {
    body = await req.json();
  } catch {
    return partnerError(400, "invalid_json", "Request body must be valid JSON.");
  }

  if (!body.answers || typeof body.answers !== "object") {
    return partnerError(
      400,
      "missing_answers",
      "answers is required — an object of { questionId: selectedValue }. See GET /assessment/questions for the question set.",
    );
  }

  const result = await submitAssessment(partner, beneficiary, body.answers);
  return NextResponse.json({ success: true, ...result });
});

export const GET = withPartnerAuth<{
  params: Promise<{ externalRef: string }>;
}>(async (_req, partner, ctx) => {
  const { externalRef } = await ctx.params;

  const beneficiary = await db.partnerBeneficiary.findUnique({
    where: { partnerId_externalRef: { partnerId: partner.id, externalRef } },
  });
  if (!beneficiary) {
    return partnerError(
      404,
      "beneficiary_not_found",
      `No beneficiary found with externalRef "${externalRef}".`,
    );
  }

  const assessments = await db.partnerAssessment.findMany({
    where: { beneficiaryId: beneficiary.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      totalScore: true,
      riskBand: true,
      flags: true,
      recommendations: true,
    },
  });

  return NextResponse.json({ success: true, assessments });
});
