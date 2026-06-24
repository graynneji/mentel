// app/api/cal/bookings/route.ts
// Creates a Cal.com booking — keeps your API key server-side only.

import { NextResponse } from "next/server";

const CAL_API_KEY = process.env.CAL_API_KEY!;
const CAL_SESSION_KEY = process.env.CAL_SESSION_KEY!;
const CAL_API_VERSION_BOOKINGS = "2024-08-13";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventTypeId, start, name, email, timeZone, from, notes } = body as {
      eventTypeId: number;
      start: string;
      name: string;
      email: string;
      timeZone: string;
      from: string;
      notes?: string;
    };

    const CALENDAR_API_KEY = from === "verify" ? CAL_SESSION_KEY : CAL_API_KEY;

    // Basic validation
    if (!eventTypeId || !start || !name || !email) {
      return NextResponse.json(
        { error: "Missing required fields: eventTypeId, start, name, email" },
        { status: 400 },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const payload = {
      start,
      eventTypeId,
      attendee: {
        name,
        email,
        timeZone: timeZone ?? "Africa/Lagos",
      },
      ...(notes ? { bookingFieldsResponses: { notes } } : {}),
    };

    const res = await fetch("https://api.cal.com/v2/bookings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CALENDAR_API_KEY}`,
        // Authorization: `Bearer ${CAL_API_KEY}`,
        "cal-api-version": CAL_API_VERSION_BOOKINGS,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[cal/bookings] Cal.com error:", data);
      return NextResponse.json(
        { error: "Booking failed", detail: data },
        { status: res.status },
      );
    }

    return NextResponse.json({ success: true, booking: data });
  } catch (err) {
    console.error("[cal/bookings] Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
