// // app/api/adhd/lead/route.ts
// //
// // Fire-and-forget capture of a completed assessment (name/email/phone +
// // scored result), called right before the "analysing" step so we have the
// // lead even if the visitor never pays. Wire this to Prisma the same way
// // burnout/assessment leads are stored elsewhere in the app.

// import { NextResponse } from "next/server";
// import { withRateLimit } from "@/lib/withRateLimit";

// export async function POST_HANDLER(req: Request) {
//   try {
//     const body = await req.json();
//     const { name, email, phone, result } = body ?? {};
//     if (!email) return NextResponse.json({ success: false }, { status: 400 });

//     // TODO: persist via Prisma, e.g.
//     // await prisma.adhdAssessmentLead.create({
//     //   data: { name, email, phone, overallPercent: result?.overallPercent,
//     //     overallBand: result?.overallBand, raw: result },
//     // });

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("ADHD lead capture error:", error);
//     // Non-blocking by design — the client doesn't wait on this response.
//     return NextResponse.json({ success: false }, { status: 500 });
//   }
// }

// export const POST = withRateLimit(POST_HANDLER);

// app/api/adhd/lead/route.ts
//
// POST: capture a completed assessment (name/email/phone + scored result),
// called right before the "analysing" step so we have the lead even if the
// visitor never pays. Persisted via Prisma to the AdhdAssessmentLead model,
// see prisma/adhd-schema-addition.prisma for the schema, append it to your
// main prisma/schema.prisma and run a migration before this will work.
//
// GET ?txRef=...: used by the result page and the PDF route to rebuild
// state from the database when sessionStorage is unavailable (e.g. after a
// redirect-based payment flow lands back on the result page in a way that
// lost the original tab's session storage). This is the actual fix for the
// "we couldn't find a recent result" bug, relying on sessionStorage alone
// for anything post-payment isn't robust enough, the database is now the
// source of truth once a tx_ref exists.

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
    if (!txRef) {
      return NextResponse.json(
        { success: false, error: "Missing txRef." },
        { status: 400 },
      );
    }

    const lead = await db.adhdAssessmentLead.findUnique({ where: { txRef } });
    if (!lead) {
      return NextResponse.json(
        { success: false, error: "Not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      answers: lead.answers,
      status: lead.status,
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
