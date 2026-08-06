// // lib/payments/flutterwave-verify.ts
// //
// // The actual verification logic, factored out so it can be called directly
// // as a function rather than over HTTP. This matters: the PDF report route
// // used to re-verify payment by fetching its own /api/flutterwave/verify
// // endpoint over HTTP using a hardcoded fallback domain
// // (`NEXT_PUBLIC_BASE_URL ?? "https://trymentel.com"`). On localhost, or any
// // environment where that env var isn't set, this silently called production
// // instead of the local server, the fetch would fail or return something
// // unexpected, and the route's catch-all would surface as the generic
// // "Could not generate report" error with no useful detail. Calling this
// // function directly removes the whole class of bug, there's no URL to get
// // wrong.

// import { ADHD_PLANS } from "./adhd-plans";
// import { db } from "@/lib/db";

// const FLW_SECRET = process.env.FLUTTERWAVE_SECRET_KEY!;

// export interface VerifyResult {
//   success: boolean;
//   error?: string;
//   status?: number;
//   txRef?: string;
//   planKey?: string;
//   email?: string;
// }

// export async function verifyFlutterwaveTransaction(opts: {
//   txRef?: string | null;
//   transactionId?: string | null;
// }): Promise<VerifyResult> {
//   const { txRef, transactionId } = opts;
//   if (!txRef && !transactionId) {
//     return {
//       success: false,
//       error: "Missing transaction reference.",
//       status: 400,
//     };
//   }

//   // Flutterwave's "verify by tx_ref" endpoint is the safest lookup since it
//   // doesn't depend on a client-supplied numeric transaction_id.
//   const url = transactionId
//     ? `https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transactionId)}/verify`
//     : `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${encodeURIComponent(txRef!)}`;

//   let flwRes: Response;
//   try {
//     flwRes = await fetch(url, {
//       headers: { Authorization: `Bearer ${FLW_SECRET}` },
//       cache: "no-store",
//     });
//   } catch (err) {
//     console.error("Flutterwave verify network error:", err);
//     return {
//       success: false,
//       error: "Could not reach Flutterwave.",
//       status: 502,
//     };
//   }

//   if (!flwRes.ok) {
//     return { success: false, error: "Could not verify payment.", status: 502 };
//   }

//   const data = await flwRes.json();
//   const tx = data?.data;

//   if (data?.status !== "success" || tx?.status !== "successful") {
//     return { success: false, error: "Payment not completed.", status: 402 };
//   }

//   // Confirm the charged amount matches a known plan price exactly, never
//   // rely on the redirect alone to decide the report is paid for.
//   const matchedPlan = Object.values(ADHD_PLANS).find(
//     (p) => p.amountUSD === Math.round(tx.amount) && tx.currency === "USD",
//   );
//   if (!matchedPlan) {
//     console.error("Flutterwave verify: amount mismatch", {
//       amount: tx.amount,
//       currency: tx.currency,
//     });
//     return { success: false, error: "Payment amount mismatch.", status: 402 };
//   }

//   // Mark the lead as paid, idempotent by design (an update, not a create),
//   // so it's safe for this to run from both the webhook and this
//   // redirect-verify path without creating duplicate records.
//   try {
//     const trnx = await db.adhdAssessmentLead.updateMany({
//       where: { txRef: tx.tx_ref, status: { not: "paid" } },
//       data: { status: "paid", paidAt: new Date() },
//     });
//     console.log(
//       "successfully marked ADHD lead as paid for tx_ref:",
//       tx.tx_ref,
//       trnx,
//     );
//   } catch (dbError) {
//     console.log("Could not mark ADHD lead as paid:", dbError);
//     console.error("Could not mark ADHD lead as paid:", dbError);
//     // Don't fail verification over a logging-table write, the payment is
//     // real either way, surface success and let the admin log catch up.
//   }

//   return {
//     success: true,
//     txRef: tx.tx_ref,
//     planKey: matchedPlan.key,
//     email: tx.customer?.email,
//   };
// }

// lib/payments/flutterwave-verify.ts
//
// The actual verification logic, factored out so it can be called directly
// as a function rather than over HTTP. This matters: the PDF report route
// used to re-verify payment by fetching its own /api/flutterwave/verify
// endpoint over HTTP using a hardcoded fallback domain
// (`NEXT_PUBLIC_BASE_URL ?? "https://trymentel.com"`). On localhost, or any
// environment where that env var isn't set, this silently called production
// instead of the local server, the fetch would fail or return something
// unexpected, and the route's catch-all would surface as the generic
// "Could not generate report" error with no useful detail. Calling this
// function directly removes the whole class of bug, there's no URL to get
// wrong.

import { ADHD_PLANS } from "./adhd-plans";
import { db } from "@/lib/db";
import { sendAdhdReportEmail } from "@/lib/adhd/report-email";

const FLW_SECRET = process.env.FLUTTERWAVE_SECRET_KEY!;

export interface VerifyResult {
  success: boolean;
  error?: string;
  status?: number;
  txRef?: string;
  planKey?: string;
  email?: string;
}

export async function verifyFlutterwaveTransaction(opts: {
  txRef?: string | null;
  transactionId?: string | null;
}): Promise<VerifyResult> {
  const { txRef, transactionId } = opts;
  if (!txRef && !transactionId) {
    return {
      success: false,
      error: "Missing transaction reference.",
      status: 400,
    };
  }

  // Flutterwave's "verify by tx_ref" endpoint is the safest lookup since it
  // doesn't depend on a client-supplied numeric transaction_id.
  const url = transactionId
    ? `https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transactionId)}/verify`
    : `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${encodeURIComponent(txRef!)}`;

  let flwRes: Response;
  try {
    flwRes = await fetch(url, {
      headers: { Authorization: `Bearer ${FLW_SECRET}` },
      cache: "no-store",
    });
  } catch (err) {
    console.error("Flutterwave verify network error:", err);
    return {
      success: false,
      error: "Could not reach Flutterwave.",
      status: 502,
    };
  }

  if (!flwRes.ok) {
    return { success: false, error: "Could not verify payment.", status: 502 };
  }

  const data = await flwRes.json();
  const tx = data?.data;

  if (data?.status !== "success" || tx?.status !== "successful") {
    return { success: false, error: "Payment not completed.", status: 402 };
  }

  // Confirm the charged amount matches a known plan price exactly, never
  // rely on the redirect alone to decide the report is paid for.
  const matchedPlan = Object.values(ADHD_PLANS).find(
    (p) => p.amountUSD === Math.round(tx.amount) && tx.currency === "USD",
  );
  if (!matchedPlan) {
    console.error("Flutterwave verify: amount mismatch", {
      amount: tx.amount,
      currency: tx.currency,
    });
    return { success: false, error: "Payment amount mismatch.", status: 402 };
  }

  // Mark the lead as paid, idempotent by design (an update, not a create),
  // so it's safe for this to run from both the webhook and this
  // redirect-verify path without creating duplicate records. The updateMany
  // count is also what guards the email below: it's only > 0 the *first*
  // time this transaction gets marked paid, whichever caller (webhook or
  // client-triggered verify) gets there first sends the email, the other
  // is a no-op.
  let justMarkedPaid = false;
  try {
    const updated = await db.adhdAssessmentLead.updateMany({
      where: { txRef: tx.tx_ref, status: { not: "paid" } },
      data: { status: "paid", paidAt: new Date() },
    });
    justMarkedPaid = updated.count > 0;
  } catch (dbError) {
    console.error("Could not mark ADHD lead as paid:", dbError);
    // Don't fail verification over a logging-table write, the payment is
    // real either way, surface success and let the admin log catch up.
  }

  if (justMarkedPaid) {
    try {
      const lead = await db.adhdAssessmentLead.findUnique({
        where: { txRef: tx.tx_ref },
      });
      if (lead) {
        await sendAdhdReportEmail({
          email: lead.email,
          name: lead.name,
          answers: lead.answers as Record<string, number>,
          completionDate: lead.createdAt,
        });
        await db.adhdAssessmentLead.update({
          where: { txRef: tx.tx_ref },
          data: { reportSentAt: new Date() },
        });
      }
    } catch (emailError) {
      // The payment and the DB update both already succeeded above, a
      // failed email shouldn't turn into a failed verification, the report
      // is also downloadable directly from the result page as a fallback.
      console.error("Could not send ADHD report email:", emailError);
    }
  }

  return {
    success: true,
    txRef: tx.tx_ref,
    planKey: matchedPlan.key,
    email: tx.customer?.email,
  };
}
