// app/api/flutterwave/booking/initialize/route.ts
//
// International counterpart to app/api/paystack/initialize/route.ts.
// Mints a tx_ref and returns the AUTHORITATIVE USD amount for a plan —
// the client-side Flutterwave checkout in BookingForm.tsx never decides
// the charge amount, it only sends a plan key and gets back what to
// actually charge. Mirrors the trust boundary already used for the ADHD
// product's Flutterwave flow (app/api/flutterwave/initialize/route.ts).

import { NextResponse } from "next/server";
import { withRateLimit } from "@/lib/withRateLimit";
import { resolveIntlPlan } from "@/lib/payments/intl-plans";

function s(v: unknown) {
  return String(v ?? "").trim();
}

export async function POST_HANDLER(req: Request) {
  try {
    const body = await req.json();
    const name = s(body.name);
    const email = s(body.email);
    const phone = s(body.phone);
    const reason = s(body.reason);
    const planId = s(body.plan);

    const errors: Record<string, string> = {};
    if (!name || name.length < 2) errors.name = "Please enter your full name.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Please enter a valid email address.";
    if (phone.replace(/\D/g, "").length < 7)
      errors.phone = "Please enter a valid phone number.";
    if (!reason) errors.reason = "Please select a reason for consultation.";
    const plan = resolveIntlPlan(planId);
    if (!plan) errors.plan = "Invalid plan selected.";
    if (Object.keys(errors).length > 0)
      return NextResponse.json({ success: false, errors }, { status: 400 });

    const txRef = `MENTEL-BOOK-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      txRef,
      amountUSD: plan!.monthlyUSD,
      planLabel: plan!.label,
    });
  } catch (error) {
    console.error("Flutterwave booking initialize error:", error);
    return NextResponse.json(
      { success: false, error: "Server error. Please try again." },
      { status: 500 },
    );
  }
}

export const POST = withRateLimit(POST_HANDLER);
