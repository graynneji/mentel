// app/api/admin/partners/[id]/route.ts
// GET:   partner detail — beneficiaries, recent sessions, recent webhook events
// PATCH: update sessionCap / webhookUrl / status (suspend/reactivate)

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

function requireAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("mentel_admin_session")?.value;
  return session === process.env.ADMIN_SESSION_SECRET;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const partner = await db.partner.findUnique({
    where: { id },
    include: {
      beneficiaries: { orderBy: { createdAt: "desc" }, take: 200 },
      sessions: { orderBy: { createdAt: "desc" }, take: 50, include: { beneficiary: { select: { externalRef: true } } } },
      webhookEvents: { orderBy: { createdAt: "desc" }, take: 50 },
    },
  });

  if (!partner) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    partner: {
      id: partner.id,
      name: partner.name,
      slug: partner.slug,
      status: partner.status,
      contactName: partner.contactName,
      contactEmail: partner.contactEmail,
      sessionCap: partner.sessionCap,
      keyPrefix: partner.keyPrefix,
      webhookUrl: partner.webhookUrl,
      createdAt: partner.createdAt,
    },
    beneficiaries: partner.beneficiaries.map((b) => ({
      externalRef: b.externalRef,
      status: b.status,
      anonymous: b.anonymous,
      name: b.name,
      riskBand: b.riskBand,
      overallScore: b.overallScore,
      sessionsUsed: b.sessionsUsed,
      sessionsRemaining: Math.max(partner.sessionCap - b.sessionsUsed, 0),
      lastAssessmentAt: b.lastAssessmentAt,
      enrolledAt: b.createdAt,
    })),
    sessions: partner.sessions.map((s) => ({
      id: s.id,
      externalRef: s.beneficiary.externalRef,
      scheduledAt: s.scheduledAt,
      type: s.type,
      status: s.status,
      booked: Boolean(s.calBookingUid),
      createdAt: s.createdAt,
    })),
    webhookEvents: partner.webhookEvents.map((w) => ({
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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const { status, sessionCap, webhookUrl } = body as {
    status?: string; sessionCap?: number; webhookUrl?: string | null;
  };

  if (status && !["active", "suspended", "revoked"].includes(status)) {
    return NextResponse.json({ error: "status must be active, suspended, or revoked." }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  if (status) data.status = status;
  if (sessionCap !== undefined) data.sessionCap = sessionCap;
  if (webhookUrl !== undefined) {
    const trimmed = webhookUrl?.trim() || null;
    data.webhookUrl = trimmed;
    // Rotate the webhook secret whenever the URL changes so a partner can't
    // be left signing against a secret for an endpoint that's no longer theirs.
    const current = await db.partner.findUnique({ where: { id }, select: { webhookUrl: true } });
    if (trimmed !== current?.webhookUrl) {
      data.webhookSecret = trimmed ? crypto.randomBytes(32).toString("hex") : null;
    }
  }

  const partner = await db.partner.update({ where: { id }, data });

  return NextResponse.json({
    partner: { id: partner.id, status: partner.status, sessionCap: partner.sessionCap, webhookUrl: partner.webhookUrl },
    // Only surfaced here, once, if it was just rotated — same "shown once" rule as key creation.
    newWebhookSecret: data.webhookSecret ?? undefined,
  });
}
