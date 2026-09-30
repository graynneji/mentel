import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requirePartnerPortalUser } from "@/lib/partner/portal-auth";

export async function GET(req: NextRequest) {
  const auth = await requirePartnerPortalUser(req);
  if (!auth.ok) return NextResponse.json({ error: { message: auth.message } }, { status: auth.status });

  const sessions = await db.partnerSession.findMany({
    where: { partnerId: auth.partnerId },
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { beneficiary: { select: { externalRef: true } } },
  });

  return NextResponse.json({
    sessions: sessions.map((s) => ({
      id: s.id,
      externalRef: s.beneficiary.externalRef,
      scheduledAt: s.scheduledAt,
      type: s.type,
      status: s.status,
      booked: Boolean(s.calBookingUid),
      createdAt: s.createdAt,
    })),
  });
}
