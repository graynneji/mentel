// app/api/partner-session/[token]/availability/route.ts
import { NextResponse } from "next/server";
import { resolveSessionToken } from "@/lib/partner/session-link";
import { getSessionSlots } from "@/lib/cal/session-booking";

export async function GET(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const r = await resolveSessionToken(token);
  if (!r.ok) return NextResponse.json({ error: { code: "invalid_link", message: "This link is no longer valid." } }, { status: r.reason === "expired" ? 410 : 401 });

  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const timeZone = searchParams.get("timeZone") ?? "Africa/Lagos";
  if (!start || !end) return NextResponse.json({ error: { code: "missing_date_range", message: "start and end are required." } }, { status: 400 });

  const result = await getSessionSlots(start, end, timeZone);
  if (!result.ok) return NextResponse.json({ error: { code: "availability_unavailable", message: "Could not load times right now." } }, { status: 502 });
  return NextResponse.json({ success: true, slots: result.data ?? {} });
}
