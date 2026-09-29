// lib/payments/flutterwave-booking-verify.ts
//
// International counterpart to app/api/paystack/verify/route.ts's logic,
// using Flutterwave instead of Paystack. Confirms a transaction directly
// with Flutterwave's API (never trust the client callback/redirect alone),
// then calls the SAME recordPayment() used by the Paystack flow — that
// function is currency-agnostic (it stores whatever `currency` string and
// subunit amount you give it), so USD bookings show up in
// /admin/payments and /admin/patients exactly like NGN ones, and
// sessionsForPlanLabel()/planTypeForLabel() resolve correctly because
// lib/payments/intl-plans.ts uses the exact same plan labels as
// lib/payments/plans.ts.
//
// Called from both:
//   - app/api/flutterwave/booking/webhook/route.ts (server-to-server,
//     authoritative)
//   - app/api/flutterwave/booking/verify/route.ts (the browser
//     redirect/in-modal callback — a redundant second call site so a
//     payment still gets recorded if the webhook is slow or misconfigured)
// recordPayment() is idempotent on `reference` (here, the tx_ref), so
// whichever fires first wins and the other is a safe no-op.

import { resolveIntlPlan, INTL_PLANS } from "@/lib/payments/intl-plans";
import { recordPayment } from "@/lib/payments/record-payment";
import { sendBookingConfirmationEmails } from "@/lib/payments/booking-emails";

const FLW_SECRET = process.env.FLUTTERWAVE_SECRET_KEY!;

export interface BookingVerifyResult {
  success: boolean;
  error?: string;
  status?: number;
  payment?: {
    reference: string;
    amount: number; // major units (USD), not cents
    currency: string;
    channel: string;
    paidAt: string;
    name: string;
    email: string;
    phone: string;
    plan: string;
    reason: string;
  };
  portalLoginUrl?: string;
}

export async function verifyFlutterwaveBooking(opts: {
  txRef?: string | null;
  fbp?: string;
  fbc?: string;
  clientIp?: string;
  userAgent?: string;
  eventSourceUrl?: string;
}): Promise<BookingVerifyResult> {
  const { txRef, fbp, fbc, clientIp, userAgent, eventSourceUrl } = opts;

  if (!txRef || !/^MENTEL-BOOK-\d+-[A-Z0-9]+$/.test(txRef)) {
    return { success: false, error: "Invalid reference.", status: 400 };
  }

  let flwRes: Response;
  try {
    flwRes = await fetch(
      `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${encodeURIComponent(txRef)}`,
      { headers: { Authorization: `Bearer ${FLW_SECRET}` }, cache: "no-store" },
    );
  } catch (err) {
    console.error("Flutterwave booking verify network error:", err);
    return { success: false, error: "Could not reach Flutterwave.", status: 502 };
  }

  if (!flwRes.ok) {
    return { success: false, error: "Could not verify payment.", status: 502 };
  }

  const data = await flwRes.json();
  const tx = data?.data;

  if (data?.status !== "success" || tx?.status !== "successful") {
    return {
      success: false,
      error: "Payment not completed.",
      status: 402,
    };
  }

  // Confirm the charged amount matches a known plan price exactly — same
  // discipline as the ADHD verify flow, never trust the redirect alone.
  const planKeyFromMeta = tx.meta?.planKey as string | undefined;
  const matchedPlan =
    (planKeyFromMeta && resolveIntlPlan(planKeyFromMeta)?.monthlyUSD === Math.round(tx.amount)
      ? resolveIntlPlan(planKeyFromMeta)
      : undefined) ??
    Object.values(INTL_PLANS).find((p) => p.monthlyUSD === Math.round(tx.amount));

  if (!matchedPlan || tx.currency !== "USD") {
    console.error("Flutterwave booking verify: amount mismatch", {
      amount: tx.amount,
      currency: tx.currency,
    });
    return { success: false, error: "Payment amount mismatch.", status: 402 };
  }

  const email = tx.customer?.email ?? "";
  const name = tx.customer?.name ?? email.split("@")[0] ?? "there";
  const phone = tx.customer?.phone_number ?? "";
  const reason = (tx.meta?.reason as string | undefined) || "General Wellbeing";
  const paidAt = tx.created_at ? new Date(tx.created_at) : new Date();

  let portalLoginUrl = "https://app.trymentel.com/login";
  let justRecorded = false;
  try {
    const result = await recordPayment({
      reference: tx.tx_ref,
      email,
      name,
      phone: phone || undefined,
      amountKobo: Math.round(tx.amount * 100), // cents — recordPayment is subunit-agnostic
      currency: "USD",
      method: tx.payment_type || "card",
      plan: matchedPlan.label,
      reason,
      paidAt,
      fbp,
      fbc,
      clientIp,
      userAgent,
      eventSourceUrl,
    });
    portalLoginUrl = result.portalLoginUrl;
    justRecorded = result.created;
  } catch (err) {
    console.error(
      "[Flutterwave booking verify] recordPayment failed — payment succeeded but was NOT saved to the CRM:",
      err,
    );
  }

  // Only send the confirmation emails the first time this transaction is
  // recorded — recordPayment()'s idempotency guard means a second call
  // (webhook after verify, or vice versa) would otherwise double-send.
  if (justRecorded && email) {
    sendBookingConfirmationEmails({
      name,
      email,
      phone,
      plan: matchedPlan.label,
      reason,
      amountUSD: tx.amount,
      reference: tx.tx_ref,
      channel: tx.payment_type || "card",
      paidAt,
      portalLoginUrl,
    }).catch((err) => console.error("[Flutterwave booking] confirmation email error:", err));
  }

  return {
    success: true,
    payment: {
      reference: tx.tx_ref,
      amount: tx.amount,
      currency: "USD",
      channel: tx.payment_type || "card",
      paidAt: paidAt.toISOString(),
      name,
      email,
      phone,
      plan: matchedPlan.label,
      reason,
    },
    portalLoginUrl,
  };
}
