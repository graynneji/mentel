// import { withRateLimit } from "@/lib/withRateLimit";
// import { NextResponse } from "next/server";
// import { after } from "next/server";
// import { recordEvent, ensureVisitorAndSession } from "@/lib/analytics/ingest";
// import { recordPayment } from "@/lib/payments/record-payment";

// const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;

// export async function GET_HANDLER(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const reference =
//       searchParams.get("reference") ?? searchParams.get("trxref");

//     if (!reference || !/^MENTEL-\d+-[A-Z0-9]+$/.test(reference)) {
//       return NextResponse.json(
//         { success: false, error: "Invalid reference." },
//         { status: 400 },
//       );
//     }

//     const paystackRes = await fetch(
//       `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
//       {
//         headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
//         cache: "no-store",
//       },
//     );

//     if (!paystackRes.ok) {
//       return NextResponse.json(
//         { success: false, error: "Could not verify payment." },
//         { status: 502 },
//       );
//     }

//     const data = await paystackRes.json();
//     const tx = data.data;

//     if (!data.status || tx?.status !== "success") {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Payment not completed.",
//           status: tx?.status ?? "unknown",
//         },
//         { status: 402 },
//       );
//     }

//     const meta = tx.metadata?.custom_fields ?? [];
//     const getField = (variable: string): string =>
//       meta.find(
//         (f: { variable_name: string; value: string }) =>
//           f.variable_name === variable,
//       )?.value ?? "";

//     const payment = {
//       reference: tx.reference,
//       amount: tx.amount / 100,
//       currency: tx.currency,
//       channel: tx.channel,
//       paidAt: tx.paid_at,
//       name: getField("name") || tx.customer?.first_name || "",
//       email: tx.customer?.email ?? "",
//       phone: getField("phone"),
//       plan: getField("plan"),
//       reason: getField("reason"),
//     };

//     // Redundant with the webhook (lib/payments/record-payment.ts is
//     // idempotent on `reference`, so whichever of the two fires first wins
//     // and the other is a safe no-op) — this covers the case where the
//     // webhook is slow, misconfigured, or hasn't been set up in the
//     // Paystack dashboard yet.
//     try {
//       await recordPayment({
//         reference: payment.reference,
//         email: payment.email,
//         name: payment.name,
//         phone: payment.phone || undefined,
//         amountKobo: tx.amount,
//         currency: payment.currency,
//         method: payment.channel,
//         plan: payment.plan,
//         reason: payment.reason,
//         paidAt: new Date(payment.paidAt ?? Date.now()),
//       });
//     } catch (err) {
//       console.error("[Paystack verify] recordPayment failed:", err);
//     }

//     // ── Analytics: fire PAYMENT_COMPLETED server-side ─────────────────────────
//     // This is a browser-initiated GET (Paystack redirect), so the user's
//     // mentel_vid / mentel_sid cookies are present on the request.
//     // Fire-and-forget via after() so it never delays the response.
//     const cookieHeader = req.headers.get("cookie") ?? "";
//     const getCookie = (name: string) =>
//       cookieHeader.match(new RegExp(`(?:^|; )${name}=([^;]*)`))?.[1] ?? null;

//     const visitorId = getCookie("mentel_vid");
//     const sessionId = getCookie("mentel_sid");

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
//               event: "PAYMENT_COMPLETED",
//               properties: {
//                 amount: payment.amount,
//                 currency: payment.currency,
//                 plan: payment.plan,
//                 channel: payment.channel,
//                 reference: payment.reference,
//                 email: payment.email,
//               },
//             },
//             ctx,
//           );
//         })().catch((err) =>
//           console.error("[analytics] PAYMENT_COMPLETED failed:", err),
//         ),
//       );
//     }
//     // ─────────────────────────────────────────────────────────────────────────

//     return NextResponse.json({ success: true, payment });
//   } catch (error) {
//     console.error("Verify error:", error);
//     return NextResponse.json(
//       { success: false, error: "Server error." },
//       { status: 500 },
//     );
//   }
// }

// export const GET = withRateLimit(GET_HANDLER);

import { withRateLimit } from "@/lib/withRateLimit";
import { NextResponse } from "next/server";
import { after } from "next/server";
import { recordEvent, ensureVisitorAndSession } from "@/lib/analytics/ingest";
import { recordPayment } from "@/lib/payments/record-payment";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;

export async function GET_HANDLER(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const reference =
      searchParams.get("reference") ?? searchParams.get("trxref");

    if (!reference || !/^MENTEL-\d+-[A-Z0-9]+$/.test(reference)) {
      return NextResponse.json(
        { success: false, error: "Invalid reference." },
        { status: 400 },
      );
    }

    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
        cache: "no-store",
      },
    );

    if (!paystackRes.ok) {
      return NextResponse.json(
        { success: false, error: "Could not verify payment." },
        { status: 502 },
      );
    }

    const data = await paystackRes.json();
    const tx = data.data;

    if (!data.status || tx?.status !== "success") {
      return NextResponse.json(
        {
          success: false,
          error: "Payment not completed.",
          status: tx?.status ?? "unknown",
        },
        { status: 402 },
      );
    }

    const meta = tx.metadata?.custom_fields ?? [];
    const getField = (variable: string): string =>
      meta.find(
        (f: { variable_name: string; value: string }) =>
          f.variable_name === variable,
      )?.value ?? "";

    const payment = {
      reference: tx.reference,
      amount: tx.amount / 100,
      currency: tx.currency,
      channel: tx.channel,
      paidAt: tx.paid_at,
      name: getField("name") || tx.customer?.first_name || "",
      email: tx.customer?.email ?? "",
      phone: getField("phone"),
      plan: getField("plan"),
      reason: getField("reason"),
    };

    // Redundant with the webhook (lib/payments/record-payment.ts is
    // idempotent on `reference`, so whichever of the two fires first wins
    // and the other is a safe no-op) — this covers the case where the
    // webhook is slow, misconfigured, or hasn't been set up in the
    // Paystack dashboard yet.
    let portalLoginUrl = "https://app.trymentel.com/login";
    try {
      const result = await recordPayment({
        reference: payment.reference,
        email: payment.email,
        name: payment.name,
        phone: payment.phone || undefined,
        amountKobo: tx.amount,
        currency: payment.currency,
        method: payment.channel,
        plan: payment.plan,
        reason: payment.reason,
        paidAt: new Date(payment.paidAt ?? Date.now()),
      });
      portalLoginUrl = result.portalLoginUrl;
    } catch (err) {
      console.error("[Paystack verify] recordPayment failed:", err);
    }

    // ── Analytics: fire PAYMENT_COMPLETED server-side ─────────────────────────
    // This is a browser-initiated GET (Paystack redirect), so the user's
    // mentel_vid / mentel_sid cookies are present on the request.
    // Fire-and-forget via after() so it never delays the response.
    const cookieHeader = req.headers.get("cookie") ?? "";
    const getCookie = (name: string) =>
      cookieHeader.match(new RegExp(`(?:^|; )${name}=([^;]*)`))?.[1] ?? null;

    const visitorId = getCookie("mentel_vid");
    const sessionId = getCookie("mentel_sid");

    if (visitorId && sessionId) {
      after(
        (async () => {
          const ctx = {
            visitorId,
            sessionId,
            userId: null,
            isNewSession: false,
            utm: {},
            referrer: req.headers.get("referer"),
            landingPage: null,
          };
          await ensureVisitorAndSession(req.headers, ctx);
          await recordEvent(
            {
              event: "PAYMENT_COMPLETED",
              properties: {
                amount: payment.amount,
                currency: payment.currency,
                plan: payment.plan,
                channel: payment.channel,
                reference: payment.reference,
                email: payment.email,
              },
            },
            ctx,
          );
        })().catch((err) =>
          console.error("[analytics] PAYMENT_COMPLETED failed:", err),
        ),
      );
    }
    // ─────────────────────────────────────────────────────────────────────────

    return NextResponse.json({ success: true, payment, portalLoginUrl });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { success: false, error: "Server error." },
      { status: 500 },
    );
  }
}

export const GET = withRateLimit(GET_HANDLER);
