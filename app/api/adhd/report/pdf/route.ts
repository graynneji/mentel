// // app/api/adhd/report/pdf/route.ts
// //
// // Renders the branded ADHD screening PDF on demand. Requires a verified
// // tx_ref (same verification the result page already does against
// // /api/flutterwave/verify) so the report can't be pulled without payment.
// //
// // Runtime note: @react-pdf/renderer needs the Node runtime, not Edge.

// export const runtime = "nodejs";

// import { NextResponse } from "next/server";
// import { renderToBuffer } from "@react-pdf/renderer";
// import AdhdReportDocument, { registerReportFonts } from "@/lib/adhd/pdf-report";
// import { scoreAssessment, Answers } from "@/lib/adhd/scoring";

// let fontsRegistered = false;

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const txRef = searchParams.get("tx_ref");
//     if (!txRef) {
//       return NextResponse.json({ error: "Missing tx_ref." }, { status: 400 });
//     }

//     // Re-verify payment server-side rather than trusting that the client
//     // already showed an "unlocked" state, mirrors the same check on the
//     // result page so this URL can't be shared/guessed to skip payment.
//     const verifyRes = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_URL ?? "https://trymentel.com"}/api/flutterwave/verify?tx_ref=${encodeURIComponent(txRef)}`,
//       { cache: "no-store" }
//     );
//     const verify = await verifyRes.json();
//     if (!verify?.success) {
//       return NextResponse.json({ error: "Payment not verified." }, { status: 402 });
//     }

//     // TODO: once the lead/payment Prisma models exist, load the stored
//     // name + answers by tx_ref/email instead of requiring the client to
//     // resend them. For now this expects them as query params from the
//     // result page, which already has them in sessionStorage.
//     const name = searchParams.get("name") ?? "there";
//     const answersRaw = searchParams.get("answers");
//     if (!answersRaw) {
//       return NextResponse.json({ error: "Missing assessment answers." }, { status: 400 });
//     }

//     let answers: Answers;
//     try {
//       answers = JSON.parse(answersRaw);
//     } catch {
//       return NextResponse.json({ error: "Malformed answers payload." }, { status: 400 });
//     }

//     const result = scoreAssessment(answers);
//     const completionDate = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

//     if (!fontsRegistered) {
//       registerReportFonts();
//       fontsRegistered = true;
//     }

//     const buffer = await renderToBuffer(
//       AdhdReportDocument({ name, completionDate, result }) as Parameters<typeof renderToBuffer>[0]
//     );

//     return new NextResponse(new Uint8Array(buffer), {
//       status: 200,
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": `attachment; filename="Mentel-ADHD-Report-${name.replace(/\s+/g, "-")}.pdf"`,
//         "Cache-Control": "private, no-store",
//       },
//     });
//   } catch (error) {
//     console.error("ADHD PDF report error:", error);
//     return NextResponse.json({ error: "Could not generate report." }, { status: 500 });
//   }
// }
// app/api/adhd/report/pdf/route.ts
//
// Renders the branded ADHD screening PDF on demand. This used to verify
// payment by fetching this app's own /api/flutterwave/verify endpoint over
// HTTP, using `NEXT_PUBLIC_BASE_URL ?? "https://trymentel.com"` as the base
// URL. On localhost (or anywhere that env var isn't set), that silently
// called production instead of the local server, which either 404'd or
// returned something unparseable, throwing inside the try block and
// surfacing as the generic "Could not generate report" error, exactly the
// bug reported after a local test purchase. Fixed two ways:
//   1. Verification now calls verifyFlutterwaveTransaction() directly, no
//      HTTP round trip, no URL to get wrong.
//   2. Name and answers are now read from the database by tx_ref instead of
//      being passed through the URL by the client, more robust (works even
//      if the visitor's sessionStorage didn't survive the payment redirect)
//      and safer (can't be tampered with via query string).
//
// Runtime note: @react-pdf/renderer needs the Node runtime, not Edge.

export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import AdhdReportDocument, { registerReportFonts } from "@/lib/adhd/pdf-report";
import { scoreAssessment, Answers } from "@/lib/adhd/scoring";
import { verifyFlutterwaveTransaction } from "@/lib/payments/flutterwave-verify";
import { db } from "@/lib/db";

let fontsRegistered = false;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const txRef = searchParams.get("tx_ref");
    if (!txRef) {
      return NextResponse.json({ error: "Missing tx_ref." }, { status: 400 });
    }

    const verify = await verifyFlutterwaveTransaction({ txRef });
    if (!verify.success) {
      return NextResponse.json(
        { error: verify.error ?? "Payment not verified." },
        { status: verify.status ?? 402 },
      );
    }

    const lead = await db.adhdAssessmentLead.findUnique({ where: { txRef } });
    if (!lead) {
      return NextResponse.json(
        { error: "No assessment found for this payment." },
        { status: 404 },
      );
    }

    const answers = lead.answers as Answers;
    const result = scoreAssessment(answers);
    const completionDate = lead.createdAt.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const name = lead.name || "there";

    if (!fontsRegistered) {
      registerReportFonts();
      fontsRegistered = true;
    }

    const buffer = await renderToBuffer(
      AdhdReportDocument({ name, completionDate, result }) as Parameters<
        typeof renderToBuffer
      >[0],
    );

    // Fire-and-forget: record that the report was actually downloaded,
    // useful in the admin log to distinguish "paid" from "paid and
    // received their report".
    db.adhdAssessmentLead
      .update({ where: { txRef }, data: { reportSentAt: new Date() } })
      .catch(() => {
        /* non-critical */
      });

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Mentel-ADHD-Report-${name.replace(/\s+/g, "-")}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    // Log the real error server-side. The client-facing message stays
    // generic, but if this fires again, check the server logs, not the
    // network tab, the useful detail is here now, not swallowed by a
    // failed self-fetch like before.
    console.error("ADHD PDF report error:", error);
    return NextResponse.json(
      { error: "Could not generate report." },
      { status: 500 },
    );
  }
}
