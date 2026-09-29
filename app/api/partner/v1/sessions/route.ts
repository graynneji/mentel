// app/api/partner/v1/sessions/route.ts
//
// POST: consume one of a beneficiary's included sessions (API-key
//       authenticated). See lib/partner/session-service.ts for the actual
//       cap-enforcement + Cal.com booking logic — the same function backs
//       the hosted flow's booking step at app/api/partner-session/[token]/book.
//       book: true books the real calendar slot (requires slotStart and a
//       non-anonymous beneficiary with an email); omitted/false logs a
//       session arranged elsewhere so the cap stays accurate.
// Idempotency-Key header (optional but recommended) makes retries safe —
// see lib/partner/idempotency.ts.
// GET: list sessions for a beneficiary (?externalRef=... required).

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withPartnerAuth } from "@/lib/partner/with-auth";
import { partnerError } from "@/lib/partner/errors";
import { withIdempotency } from "@/lib/partner/idempotency";
import {
  createPartnerSession,
  CreateSessionInput,
} from "@/lib/partner/session-service";

export const POST = withPartnerAuth(async (req, partner) => {
  const rawBody = await req.text();
  let body: CreateSessionInput & { externalRef?: string };
  try {
    body = JSON.parse(rawBody || "{}");
  } catch {
    return partnerError(
      400,
      "invalid_json",
      "Request body must be valid JSON.",
    );
  }

  const idempotencyKey = req.headers.get("idempotency-key");

  const { status, body: responseBody } = await withIdempotency(
    partner.id,
    idempotencyKey,
    rawBody,
    async () => {
      const externalRef = body.externalRef?.trim();
      if (!externalRef) {
        return {
          status: 400,
          body: {
            error: {
              code: "missing_external_ref",
              message: "externalRef is required.",
            },
          },
        };
      }

      const beneficiary = await db.partnerBeneficiary.findUnique({
        where: {
          partnerId_externalRef: { partnerId: partner.id, externalRef },
        },
      });
      if (!beneficiary) {
        return {
          status: 404,
          body: {
            error: {
              code: "beneficiary_not_found",
              message: `No beneficiary found with externalRef "${externalRef}". Enrol them first via POST /beneficiaries.`,
            },
          },
        };
      }

      const result = await createPartnerSession(partner, beneficiary, body);
      if (!result.ok) {
        return {
          status: result.status,
          body: {
            error: {
              code: result.code,
              message: result.message,
              ...result.extra,
            },
          },
        };
      }
      return { status: result.status, body: result.body };
    },
  );

  return NextResponse.json(responseBody, { status });
});

export const GET = withPartnerAuth(async (req, partner) => {
  const { searchParams } = new URL(req.url);
  const externalRef = searchParams.get("externalRef")?.trim();
  if (!externalRef) {
    return partnerError(
      400,
      "missing_external_ref",
      "?externalRef=<your beneficiary id> query param is required.",
    );
  }

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

  const sessions = await db.partnerSession.findMany({
    where: { beneficiaryId: beneficiary.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    success: true,
    sessions: sessions.map((s) => ({
      id: s.id,
      scheduledAt: s.scheduledAt,
      therapist: s.therapist,
      type: s.type,
      modality: s.modality,
      status: s.status,
      notes: s.notes,
      booked: Boolean(s.calBookingUid),
      createdAt: s.createdAt,
    })),
    sessionsUsed: beneficiary.sessionsUsed,
    sessionsRemaining: Math.max(
      partner.sessionCap - beneficiary.sessionsUsed,
      0,
    ),
  });
});
