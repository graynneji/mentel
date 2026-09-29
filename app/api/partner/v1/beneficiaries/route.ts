// app/api/partner/v1/beneficiaries/route.ts
//
// POST: enrol a beneficiary (idempotent on externalRef — safe to call again
//       for the same person; updates contact fields rather than erroring).
// GET:  list a partner's beneficiaries (paginated, cursor-based).

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { withPartnerAuth } from "@/lib/partner/with-auth";
import { partnerError } from "@/lib/partner/errors";

function hashEmail(email: string): string {
  return crypto
    .createHash("sha256")
    .update(email.toLowerCase().trim())
    .digest("hex");
}

function serialize(b: {
  externalRef: string;
  status: string;
  anonymous: boolean;
  name: string | null;
  email: string | null;
  phone: string | null;
  sessionsUsed: number;
  riskBand: string | null;
  overallScore: number | null;
  lastAssessmentAt: Date | null;
  createdAt: Date;
}, sessionCap: number) {
  return {
    externalRef: b.externalRef,
    status: b.status,
    anonymous: b.anonymous,
    name: b.name,
    email: b.email,
    phone: b.phone,
    sessionsUsed: b.sessionsUsed,
    sessionsRemaining: Math.max(sessionCap - b.sessionsUsed, 0),
    sessionCap,
    riskBand: b.riskBand,
    overallScore: b.overallScore,
    lastAssessmentAt: b.lastAssessmentAt,
    enrolledAt: b.createdAt,
  };
}

export const POST = withPartnerAuth(async (req, partner) => {
  let body: {
    externalRef?: string;
    name?: string;
    email?: string;
    phone?: string;
    anonymous?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return partnerError(400, "invalid_json", "Request body must be valid JSON.");
  }

  const externalRef = body.externalRef?.trim();
  if (!externalRef) {
    return partnerError(
      400,
      "missing_external_ref",
      "externalRef is required — your own stable ID for this beneficiary.",
    );
  }
  if (externalRef.length > 200) {
    return partnerError(400, "invalid_external_ref", "externalRef is too long (max 200 chars).");
  }

  const anonymous = body.anonymous ?? false;
  const email = anonymous ? null : body.email?.trim() || null;

  const beneficiary = await db.partnerBeneficiary.upsert({
    where: { partnerId_externalRef: { partnerId: partner.id, externalRef } },
    create: {
      partnerId: partner.id,
      externalRef,
      name: anonymous ? null : body.name?.trim() || null,
      email,
      emailHash: email ? hashEmail(email) : null,
      phone: anonymous ? null : body.phone?.trim() || null,
      anonymous,
    },
    update: {
      // Enrolment is idempotent: re-POSTing updates contact details rather
      // than erroring, so a partner can safely retry or sync profile edits.
      ...(anonymous
        ? {}
        : {
            ...(body.name !== undefined ? { name: body.name?.trim() || null } : {}),
            ...(body.email !== undefined
              ? { email, emailHash: email ? hashEmail(email) : null }
              : {}),
            ...(body.phone !== undefined ? { phone: body.phone?.trim() || null } : {}),
          }),
    },
  });

  return NextResponse.json(
    { success: true, beneficiary: serialize(beneficiary, partner.sessionCap) },
    { status: 201 },
  );
});

export const GET = withPartnerAuth(async (req, partner) => {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get("limit")) || 25, 100);
  const cursor = searchParams.get("cursor") || undefined;

  const beneficiaries = await db.partnerBeneficiary.findMany({
    where: { partnerId: partner.id },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const hasMore = beneficiaries.length > limit;
  const page = beneficiaries.slice(0, limit);

  return NextResponse.json({
    success: true,
    beneficiaries: page.map((b) => serialize(b, partner.sessionCap)),
    nextCursor: hasMore ? page[page.length - 1].id : null,
  });
});
