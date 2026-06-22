// app/api/paystack/initialize/route.ts

import { NextResponse } from "next/server";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://trymentel.com";

// ── Amounts defined server-side only — client never sees or sends a price ─────
const PLANS: Record<string, { label: string; amountKobo: number }> = {
  once: { label: "Single Session", amountKobo: 8_500 * 100 },
  monthly: { label: "Monthly Plan", amountKobo: 35_000 * 100 },
};

function s(v: unknown) {
  return String(v ?? "").trim();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = s(body.name);
    const email = s(body.email);
    const phone = s(body.phone);
    const reason = s(body.reason);
    const planId = s(body.plan);

    // ── Validation ────────────────────────────────────────────────────────────
    const errors: Record<string, string> = {};
    if (!name || name.length < 2) errors.name = "Please enter your full name.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Please enter a valid email address.";
    if (phone.replace(/\D/g, "").length < 7)
      errors.phone = "Please enter a valid phone number.";
    if (!reason) errors.reason = "Please select a reason for consultation.";
    if (!PLANS[planId]) errors.plan = "Invalid plan selected.";
    if (Object.keys(errors).length > 0)
      return NextResponse.json({ success: false, errors }, { status: 400 });

    const plan = PLANS[planId];
    const reference = `MENTEL-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

    // ── Call Paystack Initialize Transaction ──────────────────────────────────
    const paystackRes = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: plan.amountKobo,
          currency: "NGN",
          reference,
          // callback_url only used if user somehow ends up on the hosted page
          // callback_url: `${BASE_URL}/?payment=success`,
          callback_url: `${BASE_URL}/verify`,
          metadata: {
            custom_fields: [
              {
                display_name: "Patient Name",
                variable_name: "name",
                value: name,
              },
              { display_name: "Phone", variable_name: "phone", value: phone },
              {
                display_name: "Consultation",
                variable_name: "reason",
                value: reason,
              },
              {
                display_name: "Plan",
                variable_name: "plan",
                value: plan.label,
              },
            ],
          },
        }),
      },
    );

    if (!paystackRes.ok) {
      const err = await paystackRes.json().catch(() => ({}));
      console.error("Paystack initialize error:", err);
      return NextResponse.json(
        { success: false, error: "Payment provider error. Please try again." },
        { status: 502 },
      );
    }

    const paystackData = await paystackRes.json();

    if (!paystackData.status || !paystackData.data?.access_code) {
      console.error("Paystack unexpected response:", paystackData);
      return NextResponse.json(
        { success: false, error: "Could not create payment session." },
        { status: 502 },
      );
    }

    // ── Return access_code to the client — this is all the browser needs ──────
    // The client calls window.PaystackPop.resumeTransaction(accessCode)
    // which opens the popup UI. No public key, no amount, no config on the client.
    return NextResponse.json({
      success: true,
      accessCode: paystackData.data.access_code,
      reference: paystackData.data.reference,
      amount: plan.amountKobo,
    });
  } catch (error) {
    console.error("Payment initialize error:", error);
    return NextResponse.json(
      { success: false, error: "Server error. Please try again." },
      { status: 500 },
    );
  }
}
