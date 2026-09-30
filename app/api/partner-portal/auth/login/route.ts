// app/api/partner-portal/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { issuePortalSessionCookie, PARTNER_PORTAL_COOKIE } from "@/lib/partner/portal-auth";

export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: { message: "Invalid request." } }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password;
  if (!email || !password) {
    return NextResponse.json({ error: { message: "Email and password are required." } }, { status: 400 });
  }

  const user = await db.partnerUser.findUnique({ where: { email }, include: { partner: true } });
  // Same generic message whether the email doesn't exist or the password is
  // wrong — don't help an attacker enumerate which partner emails exist.
  const genericError = NextResponse.json({ error: { message: "Incorrect email or password." } }, { status: 401 });

  if (!user) return genericError;
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return genericError;

  if (user.partner.status !== "active") {
    return NextResponse.json({ error: { message: "This partner account is not active. Contact Mentel." } }, { status: 403 });
  }

  await db.partnerUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

  const { value, maxAge } = issuePortalSessionCookie(user.id, user.partnerId);
  const res = NextResponse.json({
    success: true,
    mustResetPassword: user.mustResetPassword,
    name: user.name,
  });
  res.cookies.set(PARTNER_PORTAL_COOKIE, value, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge,
    path: "/",
  });
  return res;
}
