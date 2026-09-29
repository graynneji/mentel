// app/api/flutterwave/booking/webhook/route.ts
//
// Authoritative server-to-server confirmation for international bookings —
// mirrors app/api/flutterwave/webhook/route.ts (the ADHD product's
// webhook) but calls verifyFlutterwaveBooking() instead, which records the
// payment via the shared recordPayment() (same Payment/Package tables the
// Paystack path writes to) and sends the USD confirmation emails.
//
// NOTE: point this at its own endpoint in the Flutterwave dashboard
// (Settings > Webhooks), separate from the ADHD product's webhook URL —
// both can share the same secret hash env var (FLUTTERWAVE_WEBHOOK_SECRET_HASH)
// since that's a per-account, not per-endpoint, secret.

import { NextResponse } from "next/server";
import { verifyFlutterwaveBooking } from "@/lib/payments/flutterwave-booking-verify";

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

  if (event === "charge.completed" && data?.status === "successful" && data?.tx_ref?.startsWith("MENTEL-BOOK-")) {
    // Re-verify with Flutterwave's API rather than trusting the webhook
    // body alone, and this also records the payment — idempotent, so it's
    // safe for both this webhook and the redirect-verify route to fire for
    // the same transaction.
    await verifyFlutterwaveBooking({ txRef: data.tx_ref });
  }

  return NextResponse.json({ success: true });
}

export const POST = POST_HANDLER;
