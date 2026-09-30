import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requirePartnerPortalUser } from "@/lib/partner/portal-auth";

export async function GET(req: NextRequest) {
  const auth = await requirePartnerPortalUser(req);
  if (!auth.ok) return NextResponse.json({ error: { message: auth.message } }, { status: auth.status });

  const partner = await db.partner.findUnique({ where: { id: auth.partnerId }, select: { sessionCap: true } });
  if (!partner) return NextResponse.json({ error: { message: "Not found." } }, { status: 404 });

  const beneficiaries = await db.partnerBeneficiary.findMany({
    where: { partnerId: auth.partnerId },
    orderBy: { createdAt: "desc" },
    take: 300,
  });

  return NextResponse.json({
    beneficiaries: beneficiaries.map((b) => ({
      externalRef: b.externalRef,
      status: b.status,
      anonymous: b.anonymous,
      name: b.anonymous ? null : b.name,
      riskBand: b.riskBand,
      sessionsUsed: b.sessionsUsed,
      sessionsRemaining: Math.max(partner.sessionCap - b.sessionsUsed, 0),
      lastAssessmentAt: b.lastAssessmentAt,
      enrolledAt: b.createdAt,
    })),
  });
}
