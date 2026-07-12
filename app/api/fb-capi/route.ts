// app/api/fb-capi/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sendFbConversionEvent } from "@/lib/fbConversion";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventName, eventId, value, currency, email, phone } = body;

    const cookies = req.cookies;
    const fbp = cookies.get("_fbp")?.value;
    const fbc = cookies.get("_fbc")?.value;

    const result = await sendFbConversionEvent({
      eventName,
      eventId,
      email,
      phone,
      fbp,
      fbc,
      clientIp: req.headers.get("x-forwarded-for") ?? undefined,
      userAgent: req.headers.get("user-agent") ?? undefined,
      eventSourceUrl: req.headers.get("referer") ?? undefined,
      value,
      currency,
    });

    return NextResponse.json({ success: true, result });
  } catch (err) {
    console.error("FB CAPI error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
