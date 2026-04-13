// app/api/admin/companies/[id]/sessions/route.ts
// Full session lifecycle for EAP employees under a specific company.
//
// GET:    List all sessions for the company (filterable by employee, status, date)
// POST:   Schedule a new session for an employee
// PATCH:  Update a session (reschedule, mark complete, add mood/progress notes, cancel)

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function requireAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("mentel_admin_session")?.value;
  return session === process.env.ADMIN_SESSION_SECRET;
}

// ── GET: list sessions ─────────────────────────────────────────────────────────

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get("employeeId");
    const status = searchParams.get("status");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") ?? "50")),
    );
    const skip = (page - 1) * limit;

    const where = {
      companyId: id,
      ...(employeeId ? { employeeId } : {}),
      ...(status ? { status } : {}),
      ...(from || to
        ? {
            scheduledAt: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
    };

    const [sessions, total] = await Promise.all([
      db.eAPSession.findMany({
        where,
        include: {
          employee: {
            select: {
              id: true,
              name: true,
              email: true,
              department: true,
              anonymous: true,
              riskBand: true,
              sessionsUsed: true,
              sessionsRemaining: true,
            },
          },
        },
        orderBy: { scheduledAt: "desc" },
        skip,
        take: limit,
      }),
      db.eAPSession.count({ where }),
    ]);

    // Summary stats for this company
    const [statusCounts, upcoming] = await Promise.all([
      db.eAPSession.groupBy({
        by: ["status"],
        where: { companyId: id },
        _count: { id: true },
      }),
      db.eAPSession.count({
        where: {
          companyId: id,
          status: "scheduled",
          scheduledAt: { gte: new Date() },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      sessions,
      analytics: {
        total,
        page,
        pages: Math.ceil(total / limit),
        upcoming,
        statusCounts: Object.fromEntries(
          statusCounts.map((r) => [r.status, r._count.id]),
        ),
      },
    });
  } catch (err) {
    console.error("[EAP sessions GET]", err);
    return NextResponse.json(
      { error: "Failed to fetch sessions." },
      { status: 500 },
    );
  }
}

// ── POST: schedule session ─────────────────────────────────────────────────────

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const body = (await req.json()) as {
      employeeId: string;
      scheduledAt: string;
      therapist: string;
      type?: string;
      modality?: string;
      durationMin?: number;
    };

    if (!body.employeeId || !body.scheduledAt || !body.therapist) {
      return NextResponse.json(
        { error: "employeeId, scheduledAt, and therapist are required." },
        { status: 400 },
      );
    }

    // Verify employee belongs to this company
    const employee = await db.companyEmployee.findFirst({
      where: { id: body.employeeId, companyId: id },
      select: { id: true, sessionsUsed: true, sessionsRemaining: true },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found in this company." },
        { status: 404 },
      );
    }

    // Warn (but don't block) if employee is at their session cap
    const atCap =
      employee.sessionsRemaining !== null && employee.sessionsRemaining <= 0;

    const session = await db.eAPSession.create({
      data: {
        companyId: id,
        employeeId: body.employeeId,
        scheduledAt: new Date(body.scheduledAt),
        therapist: body.therapist,
        type: body.type ?? "individual",
        modality: body.modality ?? "video",
        durationMin: body.durationMin ?? 50,
        status: "scheduled",
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            department: true,
            anonymous: true,
            sessionsUsed: true,
            sessionsRemaining: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        session,
        warning: atCap ? "Employee is at or over their session cap." : null,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("[EAP sessions POST]", err);
    return NextResponse.json(
      { error: "Failed to schedule session." },
      { status: 500 },
    );
  }
}

// ── PATCH: update session ──────────────────────────────────────────────────────

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const body = (await req.json()) as {
      sessionId: string;
      status?: string;
      scheduledAt?: string;
      conductedAt?: string;
      therapist?: string;
      type?: string;
      modality?: string;
      durationMin?: number;
      moodPre?: number;
      moodPost?: number;
      progressNotes?: string;
      domains?: string[];
    };

    if (!body.sessionId) {
      return NextResponse.json(
        { error: "sessionId is required." },
        { status: 400 },
      );
    }

    // Verify session belongs to this company
    const existing = await db.eAPSession.findFirst({
      where: { id: body.sessionId, companyId: id },
      select: { id: true, employeeId: true, status: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Session not found." },
        { status: 404 },
      );
    }

    const wasCompleted = existing.status !== "completed";
    const isNowCompleted = body.status === "completed";

    const updatedSession = await db.eAPSession.update({
      where: { id: body.sessionId },
      data: {
        ...(body.status !== undefined ? { status: body.status } : {}),
        ...(body.scheduledAt !== undefined
          ? { scheduledAt: new Date(body.scheduledAt) }
          : {}),
        ...(body.conductedAt !== undefined
          ? { conductedAt: new Date(body.conductedAt) }
          : {}),
        ...(body.therapist !== undefined ? { therapist: body.therapist } : {}),
        ...(body.type !== undefined ? { type: body.type } : {}),
        ...(body.modality !== undefined ? { modality: body.modality } : {}),
        ...(body.durationMin !== undefined
          ? { durationMin: body.durationMin }
          : {}),
        ...(body.moodPre !== undefined ? { moodPre: body.moodPre } : {}),
        ...(body.moodPost !== undefined ? { moodPost: body.moodPost } : {}),
        ...(body.progressNotes !== undefined
          ? { progressNotes: body.progressNotes }
          : {}),
        ...(body.domains !== undefined ? { domains: body.domains } : {}),
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            sessionsUsed: true,
            sessionsRemaining: true,
          },
        },
      },
    });

    // When a session is marked completed for the first time:
    // increment employee sessionsUsed, decrement sessionsRemaining
    if (wasCompleted && isNowCompleted) {
      await db.companyEmployee.update({
        where: { id: existing.employeeId },
        data: {
          sessionsUsed: { increment: 1 },
          sessionsRemaining: { decrement: 1 },
        },
      });
    }

    // When a session is un-cancelled (rescheduled back from cancelled → scheduled):
    // no counter change needed

    return NextResponse.json({ success: true, session: updatedSession });
  } catch (err) {
    console.error("[EAP sessions PATCH]", err);
    return NextResponse.json(
      { error: "Failed to update session." },
      { status: 500 },
    );
  }
}

// ── DELETE: cancel session ─────────────────────────────────────────────────────

export async function DELETE(
  req: NextRequest,
  //   { params }: { params: { id: string } },
) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required." },
        { status: 400 },
      );
    }

    // Soft delete — mark cancelled, don't hard delete (preserve history)
    const session = await db.eAPSession.update({
      where: { id: sessionId },
      data: { status: "cancelled" },
    });

    return NextResponse.json({ success: true, session });
  } catch (err) {
    console.error("[EAP sessions DELETE]", err);
    return NextResponse.json(
      { error: "Failed to cancel session." },
      { status: 500 },
    );
  }
}
