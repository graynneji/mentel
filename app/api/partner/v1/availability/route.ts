// app/api/partner/v1/availability/route.ts
// GET: open therapist slots for the counselling-session event type, so a
// partner can offer real times in their own UI before calling
// POST /sessions with book: true.
//
// Usage: GET /availability?start=2026-10-01&end=2026-10-08&timeZone=Africa/Lagos

import { NextResponse } from "next/server";
import { withPartnerAuth } from "@/lib/partner/with-auth";
import { partnerError } from "@/lib/partner/errors";
import { getSessionSlots } from "@/lib/cal/session-booking";

export const GET = withPartnerAuth(async (req) => {
  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const timeZone = searchParams.get("timeZone") ?? "Africa/Lagos";

  if (!start || !end) {
    return partnerError(
      400,
      "missing_date_range",
      "?start and ?end query params are required (ISO date or datetime).",
    );
  }

  const result = await getSessionSlots(start, end, timeZone);
  if (!result.ok) {
    return partnerError(502, "availability_unavailable", result.error ?? "Could not fetch availability.");
  }

  return NextResponse.json({ success: true, slots: result.data ?? {} });
});
