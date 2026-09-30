// app/api/admin/partners/[id]/users/route.ts
// GET:  list a partner's portal staff logins (no password data ever returned)
// POST: invite a new staff login — generates a temp password, shown ONCE
// in the response. The partner is forced to change it on first login
// (mustResetPassword) so it doesn't sit around as a long-lived shared secret
// Gray also knows.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, generateTempPassword } from "@/lib/partner/portal-auth";

function requireAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("mentel_admin_session")?.value;
  return session === process.env.ADMIN_SESSION_SECRET;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const users = await db.partnerUser.findMany({
    where: { partnerId: id },
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, name: true, role: true, mustResetPassword: true, lastLoginAt: true, createdAt: true },
  });
  return NextResponse.json({ users });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const body = await req.json();
  const email = (body.email as string | undefined)?.trim().toLowerCase();
  const name = (body.name as string | undefined)?.trim();
  if (!email || !name) {
    return NextResponse.json({ error: "email and name are required." }, { status: 400 });
  }

  const partner = await db.partner.findUnique({ where: { id } });
  if (!partner) return NextResponse.json({ error: "Partner not found." }, { status: 404 });

  const existing = await db.partnerUser.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "That email is already a portal login (for this or another partner)." }, { status: 409 });

  const tempPassword = generateTempPassword();
  const user = await db.partnerUser.create({
    data: {
      partnerId: id,
      email,
      name,
      passwordHash: await hashPassword(tempPassword),
      mustResetPassword: true,
    },
  });

  return NextResponse.json(
    {
      user: { id: user.id, email: user.email, name: user.name },
      tempPassword,
      portalUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://trymentel.com"}/partner-portal/login`,
    },
    { status: 201 },
  );
}
