// app/api/partner-portal/overview/route.ts
// GET: the partner's own summary — scoped strictly to their own partnerId,
// never any other partner's data.
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requirePartnerPortalUser } from "@/lib/partner/portal-auth";

export async function GET(req: NextRequest) {
  const auth = await requirePartnerPortalUser(req);
  if (!auth.ok) return NextResponse.json({ error: { message: auth.message } }, { status: auth.status });

  const partner = await db.partner.findUnique({
    where: { id: auth.partnerId },
    include: {
      beneficiaries: { select: { riskBand: true, status: true, sessionsUsed: true } },
      webhookEvents: { select: { status: true }, orderBy: { createdAt: "desc" }, take: 50 },
    },
  });
  if (!partner) return NextResponse.json({ error: { message: "Not found." } }, { status: 404 });

  const active = partner.beneficiaries.filter((b) => b.status === "active");
  const atRisk = active.filter((b) => b.riskBand === "High" || b.riskBand === "Critical");
  const sessionsUsed = active.reduce((s, b) => s + b.sessionsUsed, 0);
  const failedRecent = partner.webhookEvents.filter((w) => w.status === "failed").length;

  return NextResponse.json({
    partner: {
      name: partner.name,
      status: partner.status,
      sessionCap: partner.sessionCap,
      keyPrefix: partner.keyPrefix,
      webhookUrl: partner.webhookUrl,
    },
    stats: {
      beneficiaryCount: partner.beneficiaries.length,
      atRiskCount: atRisk.length,
      sessionsUsed,
      webhookHealth: partner.webhookEvents.length === 0 ? null : failedRecent === 0 ? "healthy" : "degraded",
    },
  });
}
