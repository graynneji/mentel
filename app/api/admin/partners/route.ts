// app/api/admin/partners/route.ts
// GET:  list all partners with aggregate stats (mirrors app/api/admin/companies)
// POST: create a new partner + issue its API key (mirrors scripts/create-partner.ts,
//       so onboarding doesn't require shell access — the key is returned ONCE in
//       the response and never stored in plaintext).

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateApiKey, hashApiKey } from "@/lib/partner/auth";
import crypto from "crypto";

function requireAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("mentel_admin_session")?.value;
  return session === process.env.ADMIN_SESSION_SECRET;
}

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const partners = await db.partner.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { beneficiaries: true, sessions: true } },
      beneficiaries: { select: { riskBand: true, status: true, sessionsUsed: true } },
      webhookEvents: {
        select: { status: true },
        orderBy: { createdAt: "desc" },
        take: 50,
      },
    },
  });

  const formatted = partners.map((p) => {
    const active = p.beneficiaries.filter((b) => b.status === "active");
    const atRisk = active.filter((b) => b.riskBand === "High" || b.riskBand === "Critical");
    const sessionsUsed = active.reduce((s, b) => s + b.sessionsUsed, 0);
    const recentWebhooks = p.webhookEvents;
    const failedRecent = recentWebhooks.filter((w) => w.status === "failed").length;

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      status: p.status,
      contactName: p.contactName,
      contactEmail: p.contactEmail,
      sessionCap: p.sessionCap,
      keyPrefix: p.keyPrefix,
      webhookUrl: p.webhookUrl,
      beneficiaryCount: p._count.beneficiaries,
      atRiskCount: atRisk.length,
      sessionsUsed,
      webhookHealth: recentWebhooks.length === 0 ? null : failedRecent === 0 ? "healthy" : "degraded",
      createdAt: p.createdAt,
    };
  });

  return NextResponse.json({ partners: formatted });
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, slug, contactName, contactEmail, sessionCap, webhookUrl } = body as {
    name?: string; slug?: string; contactName?: string; contactEmail?: string;
    sessionCap?: number; webhookUrl?: string;
  };

  if (!name || !slug || !contactName || !contactEmail) {
    return NextResponse.json({ error: "name, slug, contactName and contactEmail are required." }, { status: 400 });
  }

  const { fullKey, keyPrefix } = generateApiKey();
  const keyHash = await hashApiKey(fullKey);
  const webhookSecret = webhookUrl?.trim() ? crypto.randomBytes(32).toString("hex") : null;

  const partner = await db.partner.create({
    data: {
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim(),
      sessionCap: sessionCap ?? 6,
      keyPrefix,
      keyHash,
      webhookUrl: webhookUrl?.trim() || null,
      webhookSecret,
    },
  });

  // fullKey/webhookSecret are returned ONLY in this response — they are not
  // recoverable afterwards (only bcrypt hashes / the secret itself are stored).
  return NextResponse.json(
    { partner: { id: partner.id, name: partner.name, slug: partner.slug }, apiKey: fullKey, webhookSecret },
    { status: 201 },
  );
}
