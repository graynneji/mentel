// // app/api/flutterwave/verify/route.ts
// //
// // Confirms a transaction directly with Flutterwave's API before treating
// // the report as unlocked. Never trust the `redirect_url` / client callback
// // alone, always re-verify server-side. The actual logic lives in
// // lib/payments/flutterwave-verify.ts so the PDF route can call it directly
// // too, rather than making an HTTP request back to this route.

// import { NextResponse } from "next/server";
// import { withRateLimit } from "@/lib/withRateLimit";
// import { verifyFlutterwaveTransaction } from "@/lib/payments/flutterwave-verify";

// export async function GET_HANDLER(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const result = await verifyFlutterwaveTransaction({
//     txRef: searchParams.get("tx_ref"),
//     transactionId: searchParams.get("transaction_id"),
//   });
//   return NextResponse.json(result, {
//     status: result.status ?? (result.success ? 200 : 500),
//   });
// }

// export const GET = withRateLimit(GET_HANDLER);

import { NextResponse } from "next/server";
import { withRateLimit } from "@/lib/withRateLimit";
import { verifyFlutterwaveTransaction } from "@/lib/payments/flutterwave-verify";

export async function GET_HANDLER(req: Request) {
  const { searchParams } = new URL(req.url);

  // Read Meta/browser identifiers from the browser request.
  // These are optional because this function may also be called from
  // places that don't have browser cookies, such as a webhook.

  const cookieHeader = req.headers.get("cookie") ?? "";

  const getCookie = (name: string) =>
    cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))?.[1] ??
    undefined;

  const eventSourceUrl =
    req.headers.get("referer") ?? req.headers.get("origin") ?? undefined;

  // x-forwarded-for can contain multiple IPs.
  // The first one is normally the original client IP.
  const forwardedFor = req.headers.get("x-forwarded-for");
  const clientIp = forwardedFor?.split(",")[0]?.trim() || undefined;

  const result = await verifyFlutterwaveTransaction({
    txRef: searchParams.get("tx_ref"),
    transactionId: searchParams.get("transaction_id"),

    // Meta CAPI browser matching data
    fbp: getCookie("_fbp"),
    fbc: getCookie("_fbc"),
    clientIp,
    userAgent: req.headers.get("user-agent") ?? undefined,
    eventSourceUrl,
  });

  return NextResponse.json(result, {
    status: result.status ?? (result.success ? 200 : 500),
  });
}

export const GET = withRateLimit(GET_HANDLER);
