// // app/api/paystack/verify/route.ts
// //
// // ── Why verify server-side? ───────────────────────────────────────────────────
// // After the user pays, Paystack redirects them to:
// //   /booking/verify?reference=MENTEL-xxx
// //
// // The verify page calls THIS route to confirm the payment actually succeeded
// // before showing the success screen. Without this, anyone could navigate to
// // /booking/verify?reference=anything and see the success screen for free.
// //
// // This route calls Paystack's Verify Transaction API with your secret key —
// // only a real successful payment returns status: "success".
// // ─────────────────────────────────────────────────────────────────────────────

// import { NextResponse } from "next/server";

// const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const reference = searchParams.get("reference");

//     if (!reference || !/^MENTEL-\d+-[A-Z0-9]+$/.test(reference)) {
//       return NextResponse.json(
//         { success: false, error: "Invalid reference format." },
//         { status: 400 },
//       );
//     }

//     // ── Call Paystack Verify Transaction API ──────────────────────────────────
//     const paystackRes = await fetch(
//       `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
//       {
//         headers: {
//           Authorization: `Bearer ${PAYSTACK_SECRET}`,
//         },
//         // Prevent caching — always get fresh status from Paystack
//         cache: "no-store",
//       },
//     );

//     if (!paystackRes.ok) {
//       const err = await paystackRes.json().catch(() => ({}));
//       console.error("Paystack verify error:", err);
//       return NextResponse.json(
//         { success: false, error: "Could not verify payment." },
//         { status: 502 },
//       );
//     }

//     const data = await paystackRes.json();
//     const tx = data.data;

//     // ── Only success status means they actually paid ──────────────────────────
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

//     // ── Extract metadata for the success page ────────────────────────────────
//     const meta = tx.metadata?.custom_fields ?? [];
//     const getField = (variable: string): string =>
//       meta.find(
//         (f: { variable_name: string; value: string }) =>
//           f.variable_name === variable,
//       )?.value ?? "";

//     return NextResponse.json({
//       success: true,
//       payment: {
//         reference: tx.reference,
//         amount: tx.amount / 100, // convert kobo back to naira
//         currency: tx.currency,
//         channel: tx.channel,
//         paidAt: tx.paid_at,
//         name: getField("name") || tx.customer?.first_name || "",
//         email: tx.customer?.email ?? "",
//         phone: getField("phone"),
//         plan: getField("plan"),
//         reason: getField("reason"),
//       },
//     });
//   } catch (error) {
//     console.error("Payment verify error:", error);
//     return NextResponse.json(
//       { success: false, error: "Server error." },
//       { status: 500 },
//     );
//   }
// }

// app/api/paystack/verify/route.ts

import { withRateLimit } from "@/lib/withRateLimit";
import { NextResponse } from "next/server";

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

    return NextResponse.json({
      success: true,
      payment: {
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
      },
    });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { success: false, error: "Server error." },
      { status: 500 },
    );
  }
}

export const GET = withRateLimit(GET_HANDLER);
