// lib/cal/session-booking.ts
//
// Cal.com operations for paid package sessions, used by the admin's
// reschedule flow. Deliberately uses CAL_SESSION_KEY (already present in
// this project, previously wired to the old /verify?from=verify booking
// flow) rather than CAL_API_KEY, which is for the free /book-call
// consultation flow — these are two different Cal.com contexts on
// purpose, so paid package sessions and free intro calls don't compete
// for the same calendar slots.
//
// IMPORTANT: CAL_SESSION_EVENT_TYPE_ID here must be the exact same value
// as the client portal's CAL_SESSION_EVENT_TYPE_ID — both apps need to be
// looking at the same event type so admin-side reschedules and the
// client's own self-service scheduling land on one calendar, not two
// disconnected ones.

const CAL_SESSION_KEY = process.env.CAL_SESSION_KEY!;
const CAL_SESSION_EVENT_TYPE_ID = process.env.CAL_SESSION_EVENT_TYPE_ID;
const CAL_API_VERSION_SLOTS = "2024-09-04";
const CAL_API_VERSION_BOOKINGS = "2024-08-13";

export interface CalSlotsByDate {
  [date: string]: { time: string }[];
}

export async function getSessionSlots(startISO: string, endISO: string, timeZone = "Africa/Lagos"): Promise<{ ok: boolean; data?: CalSlotsByDate; error?: string }> {
  if (!CAL_SESSION_EVENT_TYPE_ID) {
    return { ok: false, error: "CAL_SESSION_EVENT_TYPE_ID isn't set in .env." };
  }
  const url = new URL("https://api.cal.com/v2/slots");
  url.searchParams.set("eventTypeId", CAL_SESSION_EVENT_TYPE_ID);
  url.searchParams.set("start", startISO);
  url.searchParams.set("end", endISO);
  url.searchParams.set("timeZone", timeZone);

  try {
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${CAL_SESSION_KEY}`, "cal-api-version": CAL_API_VERSION_SLOTS },
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data?.error?.message || "Cal.com error fetching slots." };
    return { ok: true, data: data.data ?? {} };
  } catch (err) {
    console.error("[session-booking] getSessionSlots failed", err);
    return { ok: false, error: "Network error fetching availability." };
  }
}

export async function createSessionBooking(params: {
  start: string;
  name: string;
  email: string;
  notes?: string;
}): Promise<{ ok: boolean; uid?: string; error?: string }> {
  if (!CAL_SESSION_EVENT_TYPE_ID) {
    return { ok: false, error: "CAL_SESSION_EVENT_TYPE_ID isn't set in .env." };
  }
  try {
    const res = await fetch("https://api.cal.com/v2/bookings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CAL_SESSION_KEY}`,
        "cal-api-version": CAL_API_VERSION_BOOKINGS,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start: params.start,
        eventTypeId: Number(CAL_SESSION_EVENT_TYPE_ID),
        attendee: { name: params.name, email: params.email, timeZone: "Africa/Lagos" },
        ...(params.notes ? { bookingFieldsResponses: { notes: params.notes } } : {}),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("[session-booking] createSessionBooking failed", data);
      return { ok: false, error: data?.error?.message || "That time is no longer available." };
    }
    return { ok: true, uid: data?.data?.uid };
  } catch (err) {
    console.error("[session-booking] createSessionBooking network error", err);
    return { ok: false, error: "Network error creating booking." };
  }
}

export async function cancelSessionBooking(uid: string, reason: string): Promise<void> {
  try {
    await fetch(`https://api.cal.com/v2/bookings/${uid}/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CAL_SESSION_KEY}`,
        "cal-api-version": CAL_API_VERSION_BOOKINGS,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cancellationReason: reason }),
    });
  } catch (err) {
    console.error("[session-booking] cancelSessionBooking failed", uid, err);
  }
}
