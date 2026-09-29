// lib/partner/session-service.ts
//
// Shared session-creation logic — used by BOTH the API-key route
// (app/api/partner/v1/sessions) and the token-authenticated hosted-flow
// route (app/api/partner-session/[token]/book). Same reasoning as
// assessment-service.ts: one place for the cap-enforcement + Cal.com
// booking logic, so it can't drift between the two entry points.

import { db } from "@/lib/db";
import { createSessionBooking } from "@/lib/cal/session-booking";
import type { Partner, PartnerBeneficiary } from "@/generated/prisma/client";

const VALID_TYPES = ["individual", "couples", "group", "coaching", "crisis"];
const VALID_MODALITIES = ["video", "phone", "in-person"];

export interface CreateSessionInput {
  scheduledAt?: string;
  therapist?: string;
  type?: string;
  modality?: string;
  notes?: string;
  book?: boolean;
  slotStart?: string;
}

export type CreateSessionResult =
  | { ok: true; status: number; body: unknown }
  | { ok: false; status: number; code: string; message: string; extra?: Record<string, unknown> };

export function validateSessionInput(input: CreateSessionInput): CreateSessionResult | null {
  if (input.type && !VALID_TYPES.includes(input.type)) {
    return { ok: false, status: 400, code: "invalid_type", message: `type must be one of: ${VALID_TYPES.join(", ")}.` };
  }
  if (input.modality && !VALID_MODALITIES.includes(input.modality)) {
    return { ok: false, status: 400, code: "invalid_modality", message: `modality must be one of: ${VALID_MODALITIES.join(", ")}.` };
  }
  return null;
}

export async function createPartnerSession(
  partner: Pick<Partner, "id" | "sessionCap">,
  beneficiary: PartnerBeneficiary,
  input: CreateSessionInput,
): Promise<CreateSessionResult> {
  const invalid = validateSessionInput(input);
  if (invalid) return invalid;

  const sessionsRemaining = partner.sessionCap - beneficiary.sessionsUsed;
  if (sessionsRemaining <= 0) {
    return {
      ok: false,
      status: 409,
      code: "session_cap_reached",
      message: `This beneficiary has used all ${partner.sessionCap} included sessions.`,
      extra: { sessionsUsed: beneficiary.sessionsUsed, sessionCap: partner.sessionCap },
    };
  }

  let scheduledAt: Date | null = input.scheduledAt ? new Date(input.scheduledAt) : null;
  let calBookingUid: string | null = null;
  let status = "logged";

  if (input.book) {
    if (beneficiary.anonymous || !beneficiary.email) {
      return {
        ok: false,
        status: 400,
        code: "cannot_book_anonymous",
        message:
          "This beneficiary is anonymous or has no email on file, so Mentel can't book a calendar slot for them. Log the session manually instead (omit book, or set book: false) once it's arranged.",
      };
    }
    if (!input.slotStart) {
      return { ok: false, status: 400, code: "missing_slot_start", message: "slotStart is required when book is true." };
    }

    const booking = await createSessionBooking({
      start: input.slotStart,
      name: beneficiary.name ?? "Beneficiary",
      email: beneficiary.email,
      notes: input.notes,
    });
    if (!booking.ok) {
      return {
        ok: false,
        status: 502,
        code: "booking_failed",
        message: booking.error ?? "Could not book that slot — it may no longer be available.",
      };
    }
    calBookingUid = booking.uid ?? null;
    scheduledAt = new Date(input.slotStart);
    status = "scheduled";
  }

  const [session] = await db.$transaction([
    db.partnerSession.create({
      data: {
        partnerId: partner.id,
        beneficiaryId: beneficiary.id,
        scheduledAt,
        therapist: input.therapist?.trim() || null,
        type: input.type ?? "individual",
        modality: input.modality ?? "video",
        notes: input.notes?.trim() || null,
        status,
        calBookingUid,
      },
    }),
    db.partnerBeneficiary.update({
      where: { id: beneficiary.id },
      data: { sessionsUsed: { increment: 1 } },
    }),
  ]);

  return {
    ok: true,
    status: 201,
    body: {
      success: true,
      session: {
        id: session.id,
        externalRef: beneficiary.externalRef,
        scheduledAt: session.scheduledAt,
        therapist: session.therapist,
        type: session.type,
        modality: session.modality,
        status: session.status,
        booked: Boolean(calBookingUid),
      },
      sessionsUsed: beneficiary.sessionsUsed + 1,
      sessionsRemaining: sessionsRemaining - 1,
    },
  };
}
