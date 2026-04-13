// app/api/admin/companies/route.ts
// GET:  List all companies with aggregate EAP stats
// POST: Create a new company client

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendCompanyWelcome } from "@/lib/eap-emails";
import crypto from "crypto";
import bcrypt from "bcryptjs";

// ── Admin auth guard ───────────────────────────────────────────────────────────

function requireAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("mentel_admin_session")?.value;
  return session === process.env.ADMIN_SESSION_SECRET;
}

function generateAccessCode(companyName: string): string {
  const prefix = companyName
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 3)
    .toUpperCase();
  const suffix = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `${prefix}-${suffix}`;
}

// ── GET: List all companies ────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  if (!requireAdmin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const companies = await db.company.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { employees: true, eapSessions: true } },
        employees: {
          select: {
            riskBand: true,
            overallScore: true,
            improvementPct: true,
            sessionsUsed: true,
            status: true,
          },
        },
      },
    });

    const formatted = companies.map((c) => {
      const active = c.employees.filter((e) => e.status === "active");
      const assessed = active.filter((e) => e.riskBand !== null);
      const atRisk = active.filter(
        (e) => e.riskBand === "High" || e.riskBand === "Critical",
      );
      const avgImprovement =
        assessed.length > 0
          ? Math.round(
              assessed.reduce((s, e) => s + (e.improvementPct ?? 0), 0) /
                assessed.length,
            )
          : 0;
      const avgScore =
        assessed.length > 0
          ? Math.round(
              assessed.reduce((s, e) => s + (e.overallScore ?? 0), 0) /
                assessed.length,
            )
          : 0;
      const sessionsUsed = active.reduce((s, e) => s + e.sessionsUsed, 0);

      return {
        id: c.id,
        name: c.name,
        industry: c.industry,
        contactName: c.contactName,
        contactEmail: c.contactEmail,
        hrEmail: c.hrEmail,
        accessCode: c.accessCode,
        plan: c.plan,
        planSeats: c.planSeats,
        sessionCap: c.sessionCap,
        status: c.status,
        billingStatus: c.billingStatus,
        planRenewAt: c.planRenewAt,
        createdAt: c.createdAt,
        enrolled: active.length,
        assessed: assessed.length,
        avgScore,
        avgImprovement,
        atRiskCount: atRisk.length,
        sessionsUsed,
      };
    });

    return NextResponse.json({ success: true, companies: formatted });
  } catch (err) {
    console.error("[Admin companies GET]", err);
    return NextResponse.json(
      { error: "Failed to fetch companies." },
      { status: 500 },
    );
  }
}

// ── POST: Create company ───────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!requireAdmin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const {
      name,
      industry,
      sizeRange,
      country,
      contactName,
      contactEmail,
      contactPhone,
      hrEmail,
      plan,
      planSeats,
      sessionCap,
      focusAreas,
      allowAnonymous,
    } = body;

    // Validation
    if (!name || !contactName || !contactEmail || !hrEmail || !plan) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 },
      );
    }

    // Check HR email not already in use
    const existing = await db.company.findUnique({ where: { hrEmail } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this HR email already exists." },
        { status: 409 },
      );
    }

    // Generate access code (unique)
    let accessCode = generateAccessCode(name);
    let collision = await db.company.findUnique({ where: { accessCode } });
    while (collision) {
      accessCode = generateAccessCode(name);
      collision = await db.company.findUnique({ where: { accessCode } });
    }

    // Generate slug
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    let slug = baseSlug;
    let slugCollision = await db.company.findUnique({ where: { slug } });
    let slugSuffix = 1;
    while (slugCollision) {
      slug = `${baseSlug}-${slugSuffix++}`;
      slugCollision = await db.company.findUnique({ where: { slug } });
    }

    // Hash a temporary HR password (they'll use access code, but having a hash is good practice)
    const tempPassword = crypto.randomBytes(16).toString("hex");
    const hrPasswordHash = await bcrypt.hash(tempPassword, 12);

    const planRenewAt = new Date();
    planRenewAt.setDate(planRenewAt.getDate() + (plan === "trial" ? 14 : 365));

    const company = await db.company.create({
      data: {
        name,
        slug,
        industry: industry ?? null,
        sizeRange: sizeRange ?? null,
        country: country ?? "NG",
        contactName,
        contactEmail,
        contactPhone: contactPhone ?? null,
        hrEmail,
        hrPasswordHash,
        accessCode,
        plan,
        planSeats: planSeats ?? 50,
        sessionCap: sessionCap ?? 6,
        focusAreas: focusAreas ?? [],
        allowAnonymous: allowAnonymous ?? true,
        billingStatus: "active",
        status: plan === "trial" ? "trial" : "active",
        planStartAt: new Date(),
        planRenewAt,
      },
    });

    // Send welcome email with access code (non-blocking)
    sendCompanyWelcome({
      to: contactEmail,
      contactName,
      companyName: name,
      accessCode,
      plan,
      planSeats: planSeats ?? 50,
      hrPortalUrl: `${process.env.NEXT_PUBLIC_APP_URL}/hr/access`,
    });

    return NextResponse.json(
      {
        success: true,
        company: {
          // id: company.id,
          // name: company.name,
          // accessCode: company.accessCode,
          // hrEmail: company.hrEmail,
          // plan: company.plan,
          // status: company.status,
          id: company.id,
          name: company.name,
          industry: company.industry,
          contactName: company.contactName,
          contactEmail: company.contactEmail,
          hrEmail: company.hrEmail,
          accessCode: company.accessCode,
          plan: company.plan,
          planSeats: company.planSeats,
          sessionCap: company.sessionCap,
          status: company.status,
          billingStatus: company.billingStatus,
          planRenewAt: company.planRenewAt,

          // ✅ CRITICAL DEFAULTS
          enrolled: 0,
          assessed: 0,
          avgScore: 0,
          avgImprovement: 0,
          atRiskCount: 0,
          sessionsUsed: 0,
        },
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("[Admin companies POST]", err);
    return NextResponse.json(
      { error: "Failed to create company." },
      { status: 500 },
    );
  }
}
