// // // app/api/flutterwave/webhook/route.ts
// // //
// // // Source of truth for payment confirmation — the redirect-verify call in
// // // /api/flutterwave/verify is a fast UX confirmation, but this webhook is
// // // what should actually unlock the report and send the email, same split
// // // as the existing Paystack webhook vs. browser verify. Dedupe on tx_ref:
// // // this webhook and the browser-redirect verify call can both fire for the
// // // same transaction (this is exactly the race lib/payments/record-payment.ts
// // // already handles for Paystack — reuse that pattern/table here).

// // import { NextResponse } from "next/server";
// // import crypto from "crypto";

// // const FLW_WEBHOOK_SECRET = process.env.FLUTTERWAVE_WEBHOOK_SECRET_HASH!;

// // export async function POST_HANDLER(req: Request) {
// //   const signature = req.headers.get("verif-hash");
// //   if (!signature || signature !== FLW_WEBHOOK_SECRET) {
// //     return NextResponse.json({ success: false }, { status: 401 });
// //   }

// //   const payload = await req.json().catch(() => null);
// //   if (!payload) return NextResponse.json({ success: false }, { status: 400 });

// //   const event = payload.event;
// //   const data = payload.data;

// //   if (event === "charge.completed" && data?.status === "successful") {
// //     // Re-verify with Flutterwave's API rather than trusting webhook body
// //     // alone (standard advice from Flutterwave — webhook confirms *that*
// //     // something happened, verify confirms *what*).
// //     const verifyRes = await fetch(
// //       `https://api.flutterwave.com/v3/transactions/${data.id}/verify`,
// //       { headers: { Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}` } }
// //     );
// //     const verified = await verifyRes.json().catch(() => null);
// //     if (verified?.data?.status === "successful") {
// //       // TODO: recordAdhdPayment({ txRef: verified.data.tx_ref, ... }) —
// //       // upsert keyed on tx_ref so this and the browser verify call are idempotent.
// //       // TODO: trigger report email / unlock here.
// //     }
// //   }

// //   // Flutterwave expects a 200 quickly; do slow work (email sending, PDF
// //   // generation) after acking, same as the Paystack webhook's `after()` usage.
// //   return NextResponse.json({ success: true });
// // }

// // export const POST = POST_HANDLER;

// // // Optional: constant-time compare if you'd rather not rely on the header
// // // match above for the hash comparison.
// // export function timingSafeEqual(a: string, b: string): boolean {
// //   const bufA = Buffer.from(a);
// //   const bufB = Buffer.from(b);
// //   if (bufA.length !== bufB.length) return false;
// //   return crypto.timingSafeEqual(bufA, bufB);
// // }

// // app/api/flutterwave/webhook/route.ts
// //
// // Source of truth for payment confirmation — the redirect-verify call in
// // /api/flutterwave/verify is a fast UX confirmation, but this webhook is
// // what should actually unlock the report and send the email, same split
// // as the existing Paystack webhook vs. browser verify. Dedupe on tx_ref:
// // this webhook and the browser-redirect verify call can both fire for the
// // same transaction (this is exactly the race lib/payments/record-payment.ts
// // already handles for Paystack — reuse that pattern/table here).

// import { NextResponse } from "next/server";
// import crypto from "crypto";
// import { verifyFlutterwaveTransaction } from "@/lib/payments/flutterwave-verify";

// const FLW_WEBHOOK_SECRET = process.env.FLUTTERWAVE_WEBHOOK_SECRET_HASH!;

// export async function POST_HANDLER(req: Request) {
//   const signature = req.headers.get("verif-hash");
//   if (!signature || signature !== FLW_WEBHOOK_SECRET) {
//     return NextResponse.json({ success: false }, { status: 401 });
//   }

//   const payload = await req.json().catch(() => null);
//   if (!payload) return NextResponse.json({ success: false }, { status: 400 });

//   const event = payload.event;
//   const data = payload.data;

//   if (event === "charge.completed" && data?.status === "successful") {
//     // Re-verify with Flutterwave's API rather than trusting the webhook body
//     // alone (standard advice from Flutterwave, the webhook confirms *that*
//     // something happened, verify confirms *what*), and this call also marks
//     // the AdhdAssessmentLead row as paid, it's the same function the
//     // redirect-verify route uses, an updateMany keyed on tx_ref, so it's
//     // safe for both this webhook and that route to fire for the same
//     // transaction without creating duplicate "paid" side effects.
//     await verifyFlutterwaveTransaction({ transactionId: String(data.id) });
//     // TODO: trigger the report email here once outbound email is wired up
//     // for this flow, e.g. sendAdhdReportEmail(data.customer.email, txRef).
//   }

//   // Flutterwave expects a 200 quickly, do slow work (email sending) after
//   // acking, same as the Paystack webhook's `after()` usage.
//   return NextResponse.json({ success: true });
// }

// export const POST = POST_HANDLER;

// // Optional: constant-time compare if you'd rather not rely on the header
// // match above for the hash comparison.
// export function timingSafeEqual(a: string, b: string): boolean {
//   const bufA = Buffer.from(a);
//   const bufB = Buffer.from(b);
//   if (bufA.length !== bufB.length) return false;
//   return crypto.timingSafeEqual(bufA, bufB);
// }

// app/api/flutterwave/webhook/route.ts
//
// Source of truth for payment confirmation — the redirect-verify call in
// /api/flutterwave/verify is a fast UX confirmation, but this webhook is
// what should actually unlock the report and send the email, same split
// as the existing Paystack webhook vs. browser verify. Dedupe on tx_ref:
// this webhook and the browser-redirect verify call can both fire for the
// same transaction (this is exactly the race lib/payments/record-payment.ts
// already handles for Paystack — reuse that pattern/table here).

import { NextResponse } from "next/server";
import crypto from "crypto";
import { verifyFlutterwaveTransaction } from "@/lib/payments/flutterwave-verify";

const FLW_WEBHOOK_SECRET = process.env.FLUTTERWAVE_WEBHOOK_SECRET_HASH!;

export async function POST_HANDLER(req: Request) {
  const signature = req.headers.get("verif-hash");
  if (!signature || signature !== FLW_WEBHOOK_SECRET) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const payload = await req.json().catch(() => null);
  if (!payload) return NextResponse.json({ success: false }, { status: 400 });

  const event = payload.event;
  const data = payload.data;

  if (event === "charge.completed" && data?.status === "successful") {
    // Re-verify with Flutterwave's API rather than trusting the webhook body
    // alone (standard advice from Flutterwave, the webhook confirms *that*
    // something happened, verify confirms *what*), and this call also marks
    // the AdhdAssessmentLead row as paid, it's the same function the
    // redirect-verify route uses, an updateMany keyed on tx_ref, so it's
    // safe for both this webhook and that route to fire for the same
    // transaction without creating duplicate "paid" side effects.
    await verifyFlutterwaveTransaction({ transactionId: String(data.id) });
  }

  // Flutterwave expects a 200 quickly, do slow work (email sending) after
  // acking, same as the Paystack webhook's `after()` usage.
  return NextResponse.json({ success: true });
}

export const POST = POST_HANDLER;

// Optional: constant-time compare if you'd rather not rely on the header
// match above for the hash comparison.
export function timingSafeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}
