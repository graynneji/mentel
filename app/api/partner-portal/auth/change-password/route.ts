// app/api/partner-portal/auth/change-password/route.ts
// Required on first login (mustResetPassword) and available any time after.
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { requirePartnerPortalUser, hashPassword } from "@/lib/partner/portal-auth";

export async function POST(req: NextRequest) {
  const auth = await requirePartnerPortalUser(req);
  if (!auth.ok) return NextResponse.json({ error: { message: auth.message } }, { status: auth.status });

  let body: { currentPassword?: string; newPassword?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: { message: "Invalid request." } }, { status: 400 });
  }

  if (!body.newPassword || body.newPassword.length < 10) {
    return NextResponse.json({ error: { message: "New password must be at least 10 characters." } }, { status: 400 });
  }

  const user = await db.partnerUser.findUnique({ where: { id: auth.partnerUserId } });
  if (!user) return NextResponse.json({ error: { message: "Account not found." } }, { status: 404 });

  // Skip the current-password check only on the forced first-login reset —
  // after that, changing a password always requires the current one.
  if (!user.mustResetPassword) {
    if (!body.currentPassword) {
      return NextResponse.json({ error: { message: "Current password is required." } }, { status: 400 });
    }
    const valid = await bcrypt.compare(body.currentPassword, user.passwordHash);
    if (!valid) return NextResponse.json({ error: { message: "Current password is incorrect." } }, { status: 401 });
  }

  await db.partnerUser.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(body.newPassword), mustResetPassword: false },
  });

  return NextResponse.json({ success: true });
}
