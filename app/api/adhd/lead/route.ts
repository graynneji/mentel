// // app/api/adhd/lead/route.ts
// //
// // POST: capture a completed assessment (name/email/phone + scored result),
// // called right before the "analysing" step so we have the lead even if the
// // visitor never pays. Persisted via Prisma to the AdhdAssessmentLead model,
// // see prisma/adhd-schema-addition.prisma for the schema, append it to your
// // main prisma/schema.prisma and run a migration before this will work.
// //
// // GET ?txRef=... or ?leadId=...: used by the result page and the PDF route
// // to rebuild state from the database when sessionStorage is unavailable.
// // txRef covers the post-payment case: a redirect-based payment flow can
// // land back on the result page in a way that lost the original tab's
// // session storage. leadId covers a second, earlier gap: someone who
// // finished the assessment, reached the free results, but never paid, then
// // closed the tab. Payment/session state doesn't survive a closed tab, but
// // the lead row (created right after the email-capture step, before payment
// // even starts) does. The intro page keeps a durable localStorage pointer
// // to leadId (not sessionStorage, specifically so it survives closing the
// // tab), and offers "continue to your results" instead of making them redo
// // the 20-question quiz.

// import { after, NextResponse } from "next/server";
// import { withRateLimit } from "@/lib/withRateLimit";
// import { db } from "@/lib/db";
// import { EVENTS, getMentelIds } from "@/utilz";
// import { logger } from "@/lib/logger";
// import { ensureVisitorAndSession, recordEvent } from "@/lib/analytics/ingest";

// export async function POST_HANDLER(req: Request) {
//   try {
//     const body = await req.json();
//     const { name, email, phone, answers, result } = body ?? {};
//     if (!email || !answers || !result) {
//       return NextResponse.json(
//         { success: false, error: "Missing required fields." },
//         { status: 400 },
//       );
//     }

//     const lead = await db.adhdAssessmentLead.create({
//       data: {
//         name: String(name ?? "").trim(),
//         email: String(email).trim(),
//         phone: phone ? String(phone).trim() : null,
//         answers,
//         overallPercent: result.overallPercent,
//         overallBand: result.overallBand,
//       },
//     });

//     return NextResponse.json({ success: true, leadId: lead.id });
//   } catch (error) {
//     console.error("ADHD lead capture error:", error);
//     // Non-blocking by design on the client side, the assessment flow
//     // doesn't wait on this response, but we still want it to actually work.
//     return NextResponse.json({ success: false }, { status: 500 });
//   }
// }

// export const POST = withRateLimit(POST_HANDLER);

// export async function GET_HANDLER(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const txRef = searchParams.get("txRef");
//     const leadId = searchParams.get("leadId");
//     if (!txRef && !leadId) {
//       return NextResponse.json(
//         { success: false, error: "Missing txRef or leadId." },
//         { status: 400 },
//       );
//     }

//     const lead = txRef
//       ? await db.adhdAssessmentLead.findUnique({ where: { txRef } })
//       : await db.adhdAssessmentLead.findUnique({ where: { id: leadId! } });
//     if (!lead) {
//       return NextResponse.json(
//         { success: false, error: "Not found." },
//         { status: 404 },
//       );
//     }

//     logger.business(EVENTS.LEAD_CAPTURED, {
//       meta: {
//         email: lead.email,
//         name: lead.name,
//         answers: lead.answers,
//         status: lead.status,
//       },
//     });

//     logger.business(EVENTS.ASSESSMENT_COMPLETED, {
//       meta: {
//         email: lead.email,
//         name: lead.name,
//         answers: lead.answers,
//         status: lead.status,
//       },
//     });

//     logger.business(EVENTS.ASSESSMENT_COMPLETED, {
//       meta: {
//         email: lead.email,
//         name: lead.name,
//         answers: lead.answers,
//         status: lead.status,
//       },
//     });

//     // ── Analytics event — fire and forget, never blocks the response ──────────
//     const { visitorId, sessionId } = getMentelIds(req);
//     if (visitorId && sessionId) {
//       after(
//         (async () => {
//           const ctx = {
//             visitorId,
//             sessionId,
//             userId: null,
//             isNewSession: false,
//             utm: {},
//             referrer: req.headers.get("referer"),
//             landingPage: null,
//           };
//           await ensureVisitorAndSession(req.headers, ctx);
//           await recordEvent(
//             {
//               event: "ASSESSMENT_COMPLETED",
//               properties: { answers: lead.answers, status: lead.status },
//             },
//             ctx,
//           );
//         })().catch((err) =>
//           console.error("[analytics] ASSESSMENT_COMPLETED failed:", err),
//         ),
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       leadId: lead.id,
//       name: lead.name,
//       email: lead.email,
//       phone: lead.phone,
//       answers: lead.answers,
//       status: lead.status,
//       txRef: lead.txRef,
//     });
//   } catch (error) {
//     console.error("ADHD lead lookup error:", error);
//     return NextResponse.json(
//       { success: false, error: "Server error." },
//       { status: 500 },
//     );
//   }
// }

// export const GET = withRateLimit(GET_HANDLER);

// app/api/adhd/lead/route.ts
//
// POST: capture a completed assessment (name/email/phone + scored result),
// called right before the "analysing" step so we have the lead even if the
// visitor never pays. Persisted via Prisma to the AdhdAssessmentLead model,
// see prisma/adhd-schema-addition.prisma for the schema, append it to your
// main prisma/schema.prisma and run a migration before this will work.
//
// GET ?txRef=... or ?leadId=...: used by the result page and the PDF route
// to rebuild state from the database when sessionStorage is unavailable.
// txRef covers the post-payment case: a redirect-based payment flow can
// land back on the result page in a way that lost the original tab's
// session storage. leadId covers a second, earlier gap: someone who
// finished the assessment, reached the free results, but never paid, then
// closed the tab. Payment/session state doesn't survive a closed tab, but
// the lead row (created right after the email-capture step, before payment
// even starts) does. The intro page keeps a durable localStorage pointer
// to leadId (not sessionStorage, specifically so it survives closing the
// tab), and offers "continue to your results" instead of making them redo
// the 20-question quiz.

import { NextResponse } from "next/server";
import { withRateLimit } from "@/lib/withRateLimit";
import { db } from "@/lib/db";
import { sendFbConversionEvent } from "@/lib/fbConversion";

export async function POST_HANDLER(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, answers, result } = body ?? {};
    if (!email || !answers || !result) {
      return NextResponse.json(
        { success: false, error: "Missing required fields." },
        { status: 400 },
      );
    }

    const lead = await db.adhdAssessmentLead.create({
      data: {
        name: String(name ?? "").trim(),
        email: String(email).trim(),
        phone: phone ? String(phone).trim() : null,
        answers,
        overallPercent: result.overallPercent,
        overallBand: result.overallBand,
      },
    });

    // Server-side CAPI, the actually-reliable half of tracking this event:
    // unlike the client Pixel call in app/adhd/page.tsx, this isn't
    // affected by ad blockers, iOS ITP, or third-party cookie restrictions.
    // Deliberately generic (`contentName: "self_assessment"`, no ADHD
    // wording anywhere in the payload): Meta's Business Tools Terms
    // prohibit sending data that reveals a health condition or interest in
    // one, and eventId matches the leadId used for the client-side fire
    // above so Meta dedupes them into one Lead rather than counting twice.
    // Fire-and-forget — a tracking failure should never block lead
    // creation from succeeding.
    //
    // Note: this route's handler is typed as a plain `Request`, not
    // Next.js's `NextRequest`, so `req.cookies` (a NextRequest-only
    // convenience API) isn't available here even though the actual
    // runtime object is a NextRequest — parsing the raw `Cookie` header
    // avoids depending on a type the function signature doesn't declare.
    const cookieHeader = req.headers.get("cookie") ?? "";
    const getCookie = (name: string) =>
      cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))?.[1];

    sendFbConversionEvent({
      eventName: "Lead",
      eventId: lead.id,
      email: lead.email,
      phone: lead.phone ?? undefined,
      fbp: getCookie("_fbp"),
      fbc: getCookie("_fbc"),
      clientIp: req.headers.get("x-forwarded-for") ?? undefined,
      userAgent: req.headers.get("user-agent") ?? undefined,
      eventSourceUrl: req.headers.get("referer") ?? undefined,
    }).catch((err) => console.error("FB CAPI Lead event error:", err));

    return NextResponse.json({ success: true, leadId: lead.id });
  } catch (error) {
    console.error("ADHD lead capture error:", error);
    // Non-blocking by design on the client side, the assessment flow
    // doesn't wait on this response, but we still want it to actually work.
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export const POST = withRateLimit(POST_HANDLER);

export async function GET_HANDLER(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const txRef = searchParams.get("txRef");
    const leadId = searchParams.get("leadId");
    if (!txRef && !leadId) {
      return NextResponse.json(
        { success: false, error: "Missing txRef or leadId." },
        { status: 400 },
      );
    }

    const lead = txRef
      ? await db.adhdAssessmentLead.findUnique({ where: { txRef } })
      : await db.adhdAssessmentLead.findUnique({ where: { id: leadId! } });
    if (!lead) {
      return NextResponse.json(
        { success: false, error: "Not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      answers: lead.answers,
      status: lead.status,
      txRef: lead.txRef,
    });
  } catch (error) {
    console.error("ADHD lead lookup error:", error);
    return NextResponse.json(
      { success: false, error: "Server error." },
      { status: 500 },
    );
  }
}

export const GET = withRateLimit(GET_HANDLER);
