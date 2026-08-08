// // app/api/adhd/lead/route.ts
// //
// // POST: capture a completed assessment (name/email/phone + scored result),
// // called right before the "analysing" step so we have the lead even if the
// // visitor never pays. Persisted via Prisma to the AdhdAssessmentLead model,
// // see prisma/adhd-schema-addition.prisma for the schema, append it to your
// // main prisma/schema.prisma and run a migration before this will work.
// //
// // GET ?txRef=...: used by the result page and the PDF route to rebuild
// // state from the database when sessionStorage is unavailable (e.g. after a
// // redirect-based payment flow lands back on the result page in a way that
// // lost the original tab's session storage). This is the actual fix for the
// // "we couldn't find a recent result" bug, relying on sessionStorage alone
// // for anything post-payment isn't robust enough, the database is now the
// // source of truth once a tx_ref exists.

// import { NextResponse } from "next/server";
// import { withRateLimit } from "@/lib/withRateLimit";
// import { db } from "@/lib/db";

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
//     if (!txRef) {
//       return NextResponse.json(
//         { success: false, error: "Missing txRef." },
//         { status: 400 },
//       );
//     }

//     const lead = await db.adhdAssessmentLead.findUnique({ where: { txRef } });
//     if (!lead) {
//       return NextResponse.json(
//         { success: false, error: "Not found." },
//         { status: 404 },
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       name: lead.name,
//       email: lead.email,
//       phone: lead.phone,
//       answers: lead.answers,
//       status: lead.status,
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
