import { NextRequest, NextResponse } from "next/server";
import { ensureVisitorAndSession, recordEvent, type IngestContext } from "@/lib/analytics/ingest";
import type { IncomingEventPayload } from "@/lib/analytics/types";

export const runtime = "nodejs"; // Prisma needs the Node runtime, not edge

const VISITOR_COOKIE = "mentel_vid";
const SESSION_COOKIE = "mentel_sid";

export async function POST(req: NextRequest) {
  let body: { events?: IncomingEventPayload[]; event?: IncomingEventPayload; userId?: string; clientHints?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const events = body.events ?? (body.event ? [body.event] : []);
  if (events.length === 0) {
    return NextResponse.json({ ok: false, error: "no events" }, { status: 400 });
  }

  const visitorId = req.cookies.get(VISITOR_COOKIE)?.value ?? req.headers.get("x-mentel-visitor-id");
  const sessionId = req.cookies.get(SESSION_COOKIE)?.value ?? req.headers.get("x-mentel-session-id");

  if (!visitorId || !sessionId) {
    // Middleware should have set these on the page request that loaded the SDK.
    // If it's genuinely missing (e.g. middleware matcher excluded this path),
    // fail soft rather than throwing — don't let analytics break the app.
    return NextResponse.json({ ok: false, error: "missing visitor/session" }, { status: 400 });
  }

  let utm: IngestContext["utm"] = {};
  const utmCookie = req.cookies.get("mentel_utm")?.value;
  if (utmCookie) {
    try {
      const parsed = JSON.parse(utmCookie);
      utm = {
        utmSource: parsed.utm_source,
        utmMedium: parsed.utm_medium,
        utmCampaign: parsed.utm_campaign,
        utmTerm: parsed.utm_term,
        utmContent: parsed.utm_content,
        gclid: parsed.gclid,
        fbclid: parsed.fbclid,
        ttclid: parsed.ttclid,
      };
    } catch {
      // ignore malformed cookie
    }
  }

  const ctx: IngestContext = {
    visitorId,
    sessionId,
    userId: body.userId ?? null,
    isNewSession: req.headers.get("x-mentel-new-session") === "true",
    utm,
    referrer: req.headers.get("referer"),
    landingPage: events[0]?.path ?? null,
  };

  try {
    await ensureVisitorAndSession(req.headers, ctx, body.clientHints);
    for (const event of events) {
      await recordEvent(event, ctx);
    }
  } catch (err) {
    console.error("[analytics] ingest failed", err);
    // Still return 2xx-ish soft failure so the client doesn't retry-storm.
    return NextResponse.json({ ok: false }, { status: 202 });
  }

  return NextResponse.json({ ok: true });
}
