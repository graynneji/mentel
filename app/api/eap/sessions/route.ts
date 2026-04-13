// app/api/eap/sessions/route.ts
// Employee view of their own EAP sessions.
// GET:   Returns upcoming and past sessions for the authenticated employee.
//        Never returns progressNotes (therapist-only field).
// PATCH: Employee can submit their pre/post session mood ratings.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verify } from "jsonwebtoken";

const EMPLOYEE_SECRET = process.env.EMPLOYEE_SESSION_SECRET ?? "change-me";

function getAuthEmployee(
  req: NextRequest,
): { employeeId: string; companyId: string } | null {
  const token =
    req.cookies.get("mentel_eap_token")?.value ??
    req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  try {
    return verify(token, EMPLOYEE_SECRET) as {
      employeeId: string;
      companyId: string;
    };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthEmployee(req);
    if (!auth) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 },
      );
    }

    const sessions = await db.eAPSession.findMany({
      where: { employeeId: auth.employeeId },
      orderBy: { scheduledAt: "desc" },
      select: {
        id: true,
        scheduledAt: true,
        conductedAt: true,
        durationMin: true,
        therapist: true,
        type: true,
        modality: true,
        status: true,
        moodPre: true,
        moodPost: true,
        domains: true,
        // progressNotes deliberately excluded — therapist-only
      },
    });

    // Separate upcoming vs past
    const now = new Date();
    const upcoming = sessions.filter(
      (s) => new Date(s.scheduledAt) >= now && s.status === "scheduled",
    );
    const past = sessions.filter(
      (s) => s.status === "completed" || new Date(s.scheduledAt) < now,
    );

    // Employee's session count
    const employee = await db.companyEmployee.findUnique({
      where: { id: auth.employeeId },
      select: { sessionsUsed: true, sessionsRemaining: true },
    });

    return NextResponse.json({
      success: true,
      upcoming,
      past,
      sessionsUsed: employee?.sessionsUsed ?? 0,
      sessionsRemaining: employee?.sessionsRemaining ?? null,
    });
  } catch (err) {
    console.error("[EAP sessions GET]", err);
    return NextResponse.json(
      { error: "Failed to fetch sessions." },
      { status: 500 },
    );
  }
}

// Employee submits mood rating (pre or post session)
export async function PATCH(req: NextRequest) {
  try {
    const auth = getAuthEmployee(req);
    if (!auth) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 },
      );
    }

    const body = (await req.json()) as {
      sessionId: string;
      moodPre?: number;
      moodPost?: number;
    };

    if (!body.sessionId) {
      return NextResponse.json(
        { error: "sessionId is required." },
        { status: 400 },
      );
    }

    // Confirm session belongs to this employee
    const session = await db.eAPSession.findFirst({
      where: { id: body.sessionId, employeeId: auth.employeeId },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session not found." },
        { status: 404 },
      );
    }

    // Validate mood values (1–10)
    const moodPre =
      body.moodPre !== undefined
        ? Math.max(1, Math.min(10, Math.round(body.moodPre)))
        : undefined;
    const moodPost =
      body.moodPost !== undefined
        ? Math.max(1, Math.min(10, Math.round(body.moodPost)))
        : undefined;

    const updated = await db.eAPSession.update({
      where: { id: body.sessionId },
      data: {
        ...(moodPre !== undefined ? { moodPre } : {}),
        ...(moodPost !== undefined ? { moodPost } : {}),
      },
      select: {
        id: true,
        moodPre: true,
        moodPost: true,
        status: true,
      },
    });

    return NextResponse.json({ success: true, session: updated });
  } catch (err) {
    console.error("[EAP sessions PATCH]", err);
    return NextResponse.json(
      { error: "Failed to update session." },
      { status: 500 },
    );
  }
}
