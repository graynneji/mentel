// app/api/admin/sms/send/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendSms } from "@/lib/sms/bestbulksms";

function requireAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("mentel_admin_session")?.value;
  return session === process.env.ADMIN_SESSION_SECRET;
}

// Nigerian numbers: accepts 0803..., 803..., or 234803... and normalizes to 234XXXXXXXXXX
function normalizeNumber(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("234") && digits.length === 13) return digits;
  if (digits.startsWith("0") && digits.length === 11) return `234${digits.slice(1)}`;
  if (digits.length === 10) return `234${digits}`;
  return null;
}

export async function POST(req: Request) {
  const nextReq = req as NextRequest;
  if (!requireAdmin(nextReq)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await nextReq.json();
    const rawRecipients: string[] = Array.isArray(body.to) ? body.to : [body.to];
    const message = String(body.message ?? "").trim();
    const senderId = body.senderId ? String(body.senderId).trim() : undefined;
    const route = body.route ? String(body.route) : undefined;

    if (!message) {
      return NextResponse.json({ success: false, error: "Message is required." }, { status: 400 });
    }

    const normalized = rawRecipients.map((r) => normalizeNumber(String(r))).filter(Boolean) as string[];
    if (normalized.length === 0) {
      return NextResponse.json({ success: false, error: "No valid phone numbers provided." }, { status: 400 });
    }

    const result = await sendSms({ to: normalized, message, senderId, route });

    // Log every attempt — successes and failures — so /admin/sms has a
    // real history instead of relying on BestBulkSMS's own dashboard.
    await db.smsMessage.create({
      data: {
        providerId: result.smsMessageId ?? null,
        senderId: senderId ?? "BESTBULKSMS",
        recipients: normalized,
        message,
        route: route ?? "standard",
        segments: result.segments ?? null,
        unitsBilled: result.unitsBilled ?? null,
        costBilled: result.costBilled ?? null,
        status: result.success ? "sent" : "failed",
        errorMessage: result.success ? null : result.error ?? "Unknown error",
      },
    }).catch((err: unknown) => console.error("[SMS send] failed to log message", err));

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      smsMessageId: result.smsMessageId,
      segments: result.segments,
      unitsBilled: result.unitsBilled,
      costBilled: result.costBilled,
      invalidRecipients: result.invalidRecipients,
    });
  } catch (err) {
    console.error("[Admin SMS Send]", err);
    return NextResponse.json({ success: false, error: "Failed to send SMS." }, { status: 500 });
  }
}
