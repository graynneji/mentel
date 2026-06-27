// app/api/cal/slots/route.ts
// Proxies to Cal.com v2 slots API — keeps your API key server-side only.
//
// Usage: GET /api/cal/slots?eventTypeId=YOUR_ID&start=2026-06-22&end=2026-07-22&timeZone=Africa/Lagos

import { withRateLimit } from "@/lib/withRateLimit";
import { NextResponse } from "next/server";

const CAL_API_KEY = process.env.CAL_API_KEY!;
const CAL_SESSION_KEY = process.env.CAL_SESSION_KEY!;

const CAL_API_VERSION_SLOTS = "2024-09-04";

export async function GET_HANDLER(req: Request) {
  const { searchParams } = new URL(req.url);

  const eventTypeId = searchParams.get("eventTypeId");
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const timeZone = searchParams.get("timeZone") ?? "Africa/Lagos";
  const from = searchParams.get("from") ?? "assessment";

  const CALENDAR_API_KEY = from === "verify" ? CAL_SESSION_KEY : CAL_API_KEY;

  if (!eventTypeId || !start || !end) {
    return NextResponse.json(
      { error: "Missing required params: eventTypeId, start, end" },
      { status: 400 },
    );
  }

  const url = new URL("https://api.cal.com/v2/slots");
  url.searchParams.set("eventTypeId", eventTypeId);
  url.searchParams.set("start", start);
  url.searchParams.set("end", end);
  url.searchParams.set("timeZone", timeZone);

  try {
    const res = await fetch(url.toString(), {
      headers: {
        // Authorization: `Bearer ${CAL_API_KEY}`,
        Authorization: `Bearer ${CALENDAR_API_KEY}`,
        "cal-api-version": CAL_API_VERSION_SLOTS,
      },
      next: { revalidate: 60 }, // cache slots for 60s
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("[cal/slots] Cal.com error:", data);
      return NextResponse.json(
        { error: "Cal.com error", detail: data },
        { status: res.status },
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[cal/slots] Fetch error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export const GET = withRateLimit(GET_HANDLER);
