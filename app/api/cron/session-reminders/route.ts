// app/api/cron/session-reminders/route.ts
//
// Runs on a schedule (see vercel.json) and sends reminder SMS/email for
// any scheduled session entering its 24-hour or 1-hour reminder window
// that hasn't had that reminder sent yet. Each reminder only ever goes
// out once per session, per window — tracked via reminder24hSentAt /
// reminder1hSentAt so re-running the cron (or Vercel retrying a slow
// invocation) can't double-send.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendSessionReminder } from "@/lib/notifications/session-emails";

function requireCron(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret) return false; // fail closed if not configured
  return auth === `Bearer ${secret}`;
}

async function sendWindow(window: "24h" | "1h", windowStartHours: number, windowEndHours: number) {
  const now = Date.now();
  const windowStart = new Date(now + windowStartHours * 60 * 60 * 1000);
  const windowEnd = new Date(now + windowEndHours * 60 * 60 * 1000);
  const field = window === "24h" ? "reminder24hSentAt" : "reminder1hSentAt";

  const sessions = await db.scheduledSession.findMany({
    where: {
      status: "scheduled",
      scheduledAt: { gte: windowStart, lte: windowEnd },
      [field]: null,
    },
    include: { package: { include: { lead: true } } },
    take: 200,
  });

  let sent = 0;
  for (const session of sessions) {
    const lead = session.package.lead;
    try {
      await sendSessionReminder({
        email: lead.email,
        phone: lead.phone,
        name: lead.name,
        scheduledAt: session.scheduledAt,
        window,
      });
      await db.scheduledSession.update({ where: { id: session.id }, data: { [field]: new Date() } });
      sent++;
    } catch (err) {
      console.error(`[session-reminders] failed to send ${window} reminder for session`, session.id, err);
    }
  }
  return sent;
}

export async function GET(req: Request) {
  const nextReq = req as NextRequest;
  if (!requireCron(nextReq)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // 24h window: sessions 23-25 hours out — a 2-hour band so a cron
    // running every 30-60 minutes can't skip a session between runs.
    const sent24h = await sendWindow("24h", 23, 25);
    // 1h window: sessions 45min-1h15min out.
    const sent1h = await sendWindow("1h", 0.75, 1.25);

    return NextResponse.json({ success: true, sent24h, sent1h });
  } catch (err) {
    console.error("[session-reminders]", err);
    return NextResponse.json({ success: false, error: "Reminder run failed." }, { status: 500 });
  }
}
