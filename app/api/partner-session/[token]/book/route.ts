// app/api/partner-session/[token]/book/route.ts
// POST: book a slot from the hosted flow. Always book:true here; the token
// already pins partner + beneficiary, so the browser never sends an externalRef.

import { NextResponse } from "next/server";
import { resolveSessionToken } from "@/lib/partner/session-link";
import { createPartnerSession } from "@/lib/partner/session-service";

export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const r = await resolveSessionToken(token);
  if (!r.ok) return NextResponse.json({ error: { code: "invalid_link", message: "This link is no longer valid." } }, { status: r.reason === "expired" ? 410 : 401 });

  let body: { slotStart?: string; notes?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: { code: "invalid_json", message: "Invalid request." } }, { status: 400 }); }

  const result = await createPartnerSession(r.partner, r.beneficiary, {
    book: true,
    slotStart: body.slotStart,
    notes: body.notes,
    type: "individual",
  });
  if (!result.ok) {
    return NextResponse.json({ error: { code: result.code, message: result.message } }, { status: result.status });
  }
  return NextResponse.json(result.body, { status: result.status });
}
