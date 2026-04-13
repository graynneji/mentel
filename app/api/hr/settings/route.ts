// app/api/hr/settings/route.ts
// GET:   Returns current company settings for HR portal.
// PATCH: Allows HR to update focusAreas and allowAnonymous only.
//        Seats, sessionCap, plan — admin-only, rejected here.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getHRSession } from "@/lib/hr-auth";

export async function GET(req: NextRequest) {
  try {
    const companyId = await getHRSession(req);
    if (!companyId) {
      return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
    }

    const company = await db.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        name: true,
        plan: true,
        planSeats: true,
        sessionCap: true,
        planRenewAt: true,
        billingStatus: true,
        status: true,
        hrEmail: true,
        contactName: true,
        contactEmail: true,
        focusAreas: true,
        allowAnonymous: true,
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Company not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, settings: company });
  } catch (err) {
    console.error("[HR settings GET]", err);
    return NextResponse.json(
      { error: "Failed to load settings." },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const companyId = await getHRSession(req);
    if (!companyId) {
      return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
    }

    const body = await req.json();

    // HR can only update these two fields — everything else is admin-only
    const updates: { focusAreas?: string[]; allowAnonymous?: boolean } = {};

    if (Array.isArray(body.focusAreas)) {
      updates.focusAreas = body.focusAreas;
    }

    if (typeof body.allowAnonymous === "boolean") {
      updates.allowAnonymous = body.allowAnonymous;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No updatable fields provided." },
        { status: 400 },
      );
    }

    const company = await db.company.update({
      where: { id: companyId },
      data: updates,
      select: {
        focusAreas: true,
        allowAnonymous: true,
      },
    });

    return NextResponse.json({ success: true, updated: company });
  } catch (err) {
    console.error("[HR settings PATCH]", err);
    return NextResponse.json(
      { error: "Failed to save settings." },
      { status: 500 },
    );
  }
}
