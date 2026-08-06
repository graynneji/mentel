// // // app/api/flutterwave/verify/route.ts
// // //
// // // Confirms a transaction directly with Flutterwave's API before treating
// // // the report as unlocked. Never trust the `redirect_url` / client callback
// // // alone — always re-verify server-side, same principle as the Paystack
// // // verify route.

// // import { NextResponse } from "next/server";
// // import { withRateLimit } from "@/lib/withRateLimit";
// // import { ADHD_PLANS } from "@/lib/payments/adhd-plans";

// // const FLW_SECRET = process.env.FLUTTERWAVE_SECRET_KEY!;

// // export async function GET_HANDLER(req: Request) {
// //   try {
// //     const { searchParams } = new URL(req.url);
// //     const txRef = searchParams.get("tx_ref");
// //     const transactionId = searchParams.get("transaction_id");

// //     if (!txRef && !transactionId) {
// //       return NextResponse.json({ success: false, error: "Missing transaction reference." }, { status: 400 });
// //     }

// //     // Flutterwave's "verify by tx_ref" endpoint is the safest lookup since
// //     // it doesn't depend on a client-supplied numeric transaction_id.
// //     const url = transactionId
// //       ? `https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transactionId)}/verify`
// //       : `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${encodeURIComponent(txRef!)}`;

// //     const flwRes = await fetch(url, {
// //       headers: { Authorization: `Bearer ${FLW_SECRET}` },
// //       cache: "no-store",
// //     });

// //     if (!flwRes.ok) {
// //       return NextResponse.json({ success: false, error: "Could not verify payment." }, { status: 502 });
// //     }

// //     const data = await flwRes.json();
// //     const tx = data?.data;

// //     if (data?.status !== "success" || tx?.status !== "successful") {
// //       return NextResponse.json({ success: false, error: "Payment not completed." }, { status: 402 });
// //     }

// //     // Confirm the charged amount matches a known plan price exactly —
// //     // never rely on the redirect alone to decide the report is paid for.
// //     const matchedPlan = Object.values(ADHD_PLANS).find(
// //       (p) => p.amountNGN === Math.round(tx.amount) && tx.currency === "NGN"
// //     );
// //     if (!matchedPlan) {
// //       console.error("Flutterwave verify: amount mismatch", { amount: tx.amount, currency: tx.currency });
// //       return NextResponse.json({ success: false, error: "Payment amount mismatch." }, { status: 402 });
// //     }

// //     // TODO: mark the payment/report record as unlocked in the DB here,
// //     // keyed by tx_ref, mirroring recordPayment()'s idempotency handling
// //     // (webhook and this verify call can both fire — dedupe on tx_ref).

// //     return NextResponse.json({
// //       success: true,
// //       txRef: tx.tx_ref,
// //       planKey: matchedPlan.key,
// //       email: tx.customer?.email,
// //     });
// //   } catch (error) {
// //     console.error("Flutterwave verify error:", error);
// //     return NextResponse.json({ success: false, error: "Server error. Please try again." }, { status: 500 });
// //   }
// // }

// // export const GET = withRateLimit(GET_HANDLER);

// // app/api/flutterwave/verify/route.ts
// //
// // Confirms a transaction directly with Flutterwave's API before treating
// // the report as unlocked. Never trust the `redirect_url` / client callback
// // alone — always re-verify server-side, same principle as the Paystack
// // verify route.

// import { NextResponse } from "next/server";
// import { withRateLimit } from "@/lib/withRateLimit";
// import { ADHD_PLANS } from "@/lib/payments/adhd-plans";

// const FLW_SECRET = process.env.FLUTTERWAVE_SECRET_KEY!;

// export async function GET_HANDLER(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const txRef = searchParams.get("tx_ref");
//     const transactionId = searchParams.get("transaction_id");

//     if (!txRef && !transactionId) {
//       return NextResponse.json(
//         { success: false, error: "Missing transaction reference." },
//         { status: 400 },
//       );
//     }

//     // Flutterwave's "verify by tx_ref" endpoint is the safest lookup since
//     // it doesn't depend on a client-supplied numeric transaction_id.
//     const url = transactionId
//       ? `https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transactionId)}/verify`
//       : `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${encodeURIComponent(txRef!)}`;

//     const flwRes = await fetch(url, {
//       headers: { Authorization: `Bearer ${FLW_SECRET}` },
//       cache: "no-store",
//     });

//     if (!flwRes.ok) {
//       return NextResponse.json(
//         { success: false, error: "Could not verify payment." },
//         { status: 502 },
//       );
//     }

//     const data = await flwRes.json();
//     const tx = data?.data;

//     if (data?.status !== "success" || tx?.status !== "successful") {
//       return NextResponse.json(
//         { success: false, error: "Payment not completed." },
//         { status: 402 },
//       );
//     }

//     // Confirm the charged amount matches a known plan price exactly —
//     // never rely on the redirect alone to decide the report is paid for.
//     const matchedPlan = Object.values(ADHD_PLANS).find(
//       (p) => p.amountUSD === Math.round(tx.amount) && tx.currency === "USD",
//     );
//     if (!matchedPlan) {
//       console.error("Flutterwave verify: amount mismatch", {
//         amount: tx.amount,
//         currency: tx.currency,
//       });
//       return NextResponse.json(
//         { success: false, error: "Payment amount mismatch." },
//         { status: 402 },
//       );
//     }

//     // TODO: mark the payment/report record as unlocked in the DB here,
//     // keyed by tx_ref, mirroring recordPayment()'s idempotency handling
//     // (webhook and this verify call can both fire — dedupe on tx_ref).

//     return NextResponse.json({
//       success: true,
//       txRef: tx.tx_ref,
//       planKey: matchedPlan.key,
//       email: tx.customer?.email,
//     });
//   } catch (error) {
//     console.error("Flutterwave verify error:", error);
//     return NextResponse.json(
//       { success: false, error: "Server error. Please try again." },
//       { status: 500 },
//     );
//   }
// }

// export const GET = withRateLimit(GET_HANDLER);

// app/api/flutterwave/verify/route.ts
//
// Confirms a transaction directly with Flutterwave's API before treating
// the report as unlocked. Never trust the `redirect_url` / client callback
// alone, always re-verify server-side. The actual logic lives in
// lib/payments/flutterwave-verify.ts so the PDF route can call it directly
// too, rather than making an HTTP request back to this route.

import { NextResponse } from "next/server";
import { withRateLimit } from "@/lib/withRateLimit";
import { verifyFlutterwaveTransaction } from "@/lib/payments/flutterwave-verify";

export async function GET_HANDLER(req: Request) {
  const { searchParams } = new URL(req.url);
  const result = await verifyFlutterwaveTransaction({
    txRef: searchParams.get("tx_ref"),
    transactionId: searchParams.get("transaction_id"),
  });
  return NextResponse.json(result, {
    status: result.status ?? (result.success ? 200 : 500),
  });
}

export const GET = withRateLimit(GET_HANDLER);
