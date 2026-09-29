// app/api/partner-session/[token]/assessment/route.ts
// POST: submit answers from the hosted flow. Same scoring + crisis
// escalation as the API-key route (lib/partner/assessment-service.ts).

import { NextResponse } from "next/server";
import { resolveSessionToken } from "@/lib/partner/session-link";
import { submitAssessment } from "@/lib/partner/assessment-service";

export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const r = await resolveSessionToken(token);
  if (!r.ok) return NextResponse.json({ error: { code: r.reason === "expired" ? "link_expired" : "invalid_link", message: "This link is no longer valid." } }, { status: r.reason === "expired" ? 410 : 401 });

  let body: { answers?: Record<string, number> };
  try { body = await req.json(); } catch { return NextResponse.json({ error: { code: "invalid_json", message: "Invalid request." } }, { status: 400 }); }
  if (!body.answers || typeof body.answers !== "object") {
    return NextResponse.json({ error: { code: "missing_answers", message: "answers is required." } }, { status: 400 });
  }

  const result = await submitAssessment(r.partner, r.beneficiary, body.answers);
  // The beneficiary's browser gets scores + recommendations (their own results),
  // not internal flags/ids beyond what the results screen needs.
  return NextResponse.json({
    success: true,
    scores: result.scores,
    recommendations: result.recommendations,
    crisisEscalated: result.crisisEscalated,
  });
}
