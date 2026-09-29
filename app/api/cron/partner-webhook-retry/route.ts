// app/api/cron/partner-webhook-retry/route.ts
// Runs on a schedule (see vercel.json) and retries any partner webhook
// event (crisis.detected, session.cancelled, ...) that hasn't been
// delivered yet — e.g. because the partner's endpoint was briefly down.
// Same auth pattern as app/api/cron/session-reminders.

import { NextRequest, NextResponse } from "next/server";
import { retryPendingWebhookEvents } from "@/lib/partner/webhooks";

function requireCron(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret) return false; // fail closed if not configured
  return auth === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!requireCron(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await retryPendingWebhookEvents();
  return NextResponse.json({ success: true, ...result });
}
