import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requirePartnerPortalUser } from "@/lib/partner/portal-auth";

export async function GET(req: NextRequest) {
  const auth = await requirePartnerPortalUser(req);
  if (!auth.ok) return NextResponse.json({ error: { message: auth.message } }, { status: auth.status });

  const events = await db.partnerWebhookEvent.findMany({
    where: { partnerId: auth.partnerId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({
    events: events.map((w) => ({
      id: w.id,
      eventType: w.eventType,
      status: w.status,
      attempts: w.attempts,
      responseStatus: w.responseStatus,
      lastError: w.lastError,
      createdAt: w.createdAt,
      deliveredAt: w.deliveredAt,
    })),
  });
}
