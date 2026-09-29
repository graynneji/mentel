// app/api/partner/v1/beneficiaries/[externalRef]/session-link/route.ts
//
// POST: mint a short-lived hosted-session link for a beneficiary. This is
// the recommended integration path — redirect or iframe-embed the
// beneficiary into the returned url and Mentel handles the actual
// assessment + booking UI (same clinical content, scoring, and crisis
// handling as Mentel's own site, kept in one place). This call is
// server-to-server (your backend, with your API key) — the returned
// token is safe to hand to the beneficiary's browser; the API key never
// is. See docs/partner-api/README.md — "Running the assessment".

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withPartnerAuth } from "@/lib/partner/with-auth";
import { partnerError } from "@/lib/partner/errors";
import { issueSessionToken, buildSessionLinkUrl } from "@/lib/partner/session-link";

export const POST = withPartnerAuth<{
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
      `No beneficiary found with externalRef "${externalRef}". Enrol them first via POST /beneficiaries.`,
    );
  }

  const { token, expiresAt } = issueSessionToken({
    partnerId: partner.id,
    beneficiaryId: beneficiary.id,
    externalRef: beneficiary.externalRef,
  });

  return NextResponse.json({
    success: true,
    url: buildSessionLinkUrl(token),
    expiresAt,
  });
});
