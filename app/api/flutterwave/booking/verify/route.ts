// app/api/flutterwave/booking/verify/route.ts
//
// International counterpart to app/api/paystack/verify/route.ts. Returns
// the same { success, payment, portalLoginUrl } shape (with payment.amount
// in major units and payment.currency = "USD") so app/verify/page.tsx can
// render either currency from one code path.

import { NextResponse } from "next/server";
import { withRateLimit } from "@/lib/withRateLimit";
import { verifyFlutterwaveBooking } from "@/lib/payments/flutterwave-booking-verify";

export async function GET_HANDLER(req: Request) {
  const { searchParams } = new URL(req.url);

  const cookieHeader = req.headers.get("cookie") ?? "";
  const getCookie = (name: string) =>
    cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))?.[1] ?? undefined;

  const eventSourceUrl = req.headers.get("referer") ?? req.headers.get("origin") ?? undefined;
  const forwardedFor = req.headers.get("x-forwarded-for");
  const clientIp = forwardedFor?.split(",")[0]?.trim() || undefined;

  const result = await verifyFlutterwaveBooking({
    txRef: searchParams.get("tx_ref"),
    fbp: getCookie("_fbp"),
    fbc: getCookie("_fbc"),
    clientIp,
    userAgent: req.headers.get("user-agent") ?? undefined,
    eventSourceUrl,
  });

  return NextResponse.json(result, { status: result.status ?? (result.success ? 200 : 500) });
}

export const GET = withRateLimit(GET_HANDLER);
