// app/api/partner-session/[token]/route.ts
// GET: state for the hosted flow — authenticated ONLY by the short-lived
// session token in the URL (never the partner's API key).

import { NextResponse } from "next/server";
import { resolveSessionToken } from "@/lib/partner/session-link";

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const r = await resolveSessionToken(token);
  if (!r.ok) {
    return NextResponse.json(
      { error: { code: r.reason === "expired" ? "link_expired" : "invalid_link", message: r.reason === "expired" ? "This link has expired. Please request a new one from the app you came from." : "This link is not valid." } },
      { status: r.reason === "expired" ? 410 : 401 },
    );
  }

  const { partner, beneficiary } = r;
  return NextResponse.json({
    success: true,
    partnerName: partner.name,
    hasAssessment: beneficiary.lastAssessmentAt !== null,
    canBookByEmail: !beneficiary.anonymous && Boolean(beneficiary.email),
    sessionsRemaining: Math.max(partner.sessionCap - beneficiary.sessionsUsed, 0),
  });
}
