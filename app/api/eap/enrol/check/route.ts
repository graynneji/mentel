// app/api/eap/enrol/check/route.ts
// POST: Validates a company access code and returns company info.
// Does NOT create any employee record — that happens in /api/eap/enrol.
// Used by the enrol page step 1 to show the company name before the user
// fills in their personal details.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

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

    const company = await db.company.findUnique({
      where: { accessCode: accessCode.trim().toUpperCase() },
      select: {
        id: true,
        name: true,
        plan: true,
        sessionCap: true,
        planSeats: true,
        status: true,
        allowAnonymous: true,
        _count: { select: { employees: true } },
      },
    });

    if (!company) {
      // Deliberately vague — don't confirm whether a code exists at all
      return NextResponse.json(
        { error: "Invalid access code. Please check with your HR team." },
        { status: 404 },
      );
    }

    if (company.status === "cancelled") {
      return NextResponse.json(
        {
          error:
            "This company's EAP programme is no longer active. Please contact Mentel.",
        },
        { status: 403 },
      );
    }

    if (company.status === "paused") {
      return NextResponse.json(
        {
          error:
            "This company's EAP programme is temporarily paused. Please try again later.",
        },
        { status: 403 },
      );
    }

    // Check if programme is at capacity
    const enrolledCount = await db.companyEmployee.count({
      where: { companyId: company.id, status: "active" },
    });

    if (enrolledCount >= company.planSeats) {
      return NextResponse.json(
        {
          error:
            "This programme has reached its maximum capacity. Please contact your HR team to request additional seats.",
        },
        { status: 429 },
      );
    }

    return NextResponse.json({
      success: true,
      company: {
        name: company.name,
        plan: company.plan,
        sessionCap: company.sessionCap,
        allowAnonymous: company.allowAnonymous,
        seatsRemaining: company.planSeats - enrolledCount,
      },
    });
  } catch (err) {
    console.error("[EAP enrol check]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
