// app/api/hr/auth/route.ts
// POST: HR login using company access code (no username/password).
// The access code IS the credential. Sets httpOnly session cookie.
// DELETE: Logout (clear cookie).

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createHRSession, setHRCookie, clearHRCookie } from "@/lib/hr-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { accessCode } = body as { accessCode: string };

    if (!accessCode?.trim()) {
      return NextResponse.json(
        { error: "Access code is required." },
        { status: 400 },
      );
    }

    const code = accessCode.trim().toUpperCase();

    const company = await db.company.findUnique({
      where: { accessCode: code },
      select: {
        id: true,
        name: true,
        plan: true,
        planSeats: true,
        sessionCap: true,
        status: true,
        billingStatus: true,
        planRenewAt: true,
        contactName: true,
        hrEmail: true,
        industry: true,
        focusAreas: true,
        allowAnonymous: true,
      },
    });

    if (!company) {
      // Deliberate vague error to prevent enumeration
      return NextResponse.json(
        {
          error:
            "Invalid access code. Please check with your HR contact or Mentel support.",
        },
        { status: 401 },
      );
    }

    if (company.status === "cancelled") {
      return NextResponse.json(
        {
          error:
            "Your company's EAP programme has been cancelled. Please contact Mentel.",
        },
        { status: 403 },
      );
    }

    // Update last login
    await db.company.update({
      where: { id: company.id },
      data: { lastLogin: new Date() },
    });

    // Create session token
    const token = await createHRSession(company.id);

    const res = NextResponse.json({
      success: true,
      company: {
        id: company.id,
        name: company.name,
        plan: company.plan,
        planSeats: company.planSeats,
        sessionCap: company.sessionCap,
        status: company.status,
        planRenewAt: company.planRenewAt,
        contactName: company.contactName,
        hrEmail: company.hrEmail,
        industry: company.industry,
        focusAreas: company.focusAreas,
      },
    });

    setHRCookie(res, token);
    return res;
  } catch (err) {
    console.error("[HR auth POST]", err);
    return NextResponse.json(
      { error: "Authentication failed. Please try again." },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const res = NextResponse.json({ success: true });
  clearHRCookie(res);
  return res;
}
