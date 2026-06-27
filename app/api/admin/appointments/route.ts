// app/api/admin/appointments/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withRateLimit } from "@/lib/withRateLimit";

// ── GET /api/admin/appointments ────────────────────────────────────────────────
export async function GET_HANDLER(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get("leadId");
    const status = searchParams.get("status");
    const therapist = searchParams.get("therapist");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") ?? "50")),
    );
    const skip = (page - 1) * limit;

    const where = {
      ...(leadId ? { leadId } : {}),
      ...(status ? { status } : {}),
      ...(therapist ? { therapist } : {}),
      ...(from || to
        ? {
            scheduledAt: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
    };

    const [appointments, total] = await Promise.all([
      db.appointment.findMany({
        where,
        include: {
          lead: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              band: true,
            },
          },
          session: { include: { payment: true } },
        },
        orderBy: { scheduledAt: "desc" },
        skip,
        take: limit,
      }),
      db.appointment.count({ where }),
    ]);

    // Summary stats
    const [statusCounts, upcoming] = await Promise.all([
      db.appointment.groupBy({ by: ["status"], _count: { id: true } }),
      db.appointment.count({
        where: { status: "scheduled", scheduledAt: { gte: new Date() } },
      }),
    ]);

    return NextResponse.json({
      success: true,
      appointments,
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
  } catch (error) {
    console.error("GET appointments error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}

// ── POST /api/admin/appointments ───────────────────────────────────────────────
export async function POST_HANDLER(req: Request): Promise<NextResponse> {
  try {
    const body = (await req.json()) as {
      leadId: string;
      scheduledAt: string;
      therapist: string;
      type?: string;
      durationMin?: number;
      notes?: string;
    };

    if (!body.leadId || !body.scheduledAt || !body.therapist) {
      return NextResponse.json(
        {
          success: false,
          error: "leadId, scheduledAt and therapist are required",
        },
        { status: 400 },
      );
    }

    const appointment = await db.appointment.create({
      data: {
        leadId: body.leadId,
        scheduledAt: new Date(body.scheduledAt),
        therapist: body.therapist,
        type: body.type ?? "initial",
        durationMin: body.durationMin ?? 50,
        notes: body.notes,
        status: "scheduled",
      },
      include: {
        lead: { select: { id: true, name: true, email: true } },
      },
    });

    // Auto-update lead status to booked if it was new/contacted
    await db.lead.updateMany({
      where: { id: body.leadId, status: { in: ["new", "contacted"] } },
      data: { status: "booked" },
    });

    return NextResponse.json({ success: true, appointment }, { status: 201 });
  } catch (error) {
    console.error("POST appointment error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}

// ── PATCH /api/admin/appointments ──────────────────────────────────────────────
export async function PATCH_HANDLER(req: Request): Promise<NextResponse> {
  try {
    const body = (await req.json()) as {
      id: string;
      status?: string;
      scheduledAt?: string;
      therapist?: string;
      type?: string;
      durationMin?: number;
      notes?: string;
    };

    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Missing id" },
        { status: 400 },
      );
    }

    const appointment = await db.appointment.update({
      where: { id: body.id },
      data: {
        ...(body.status !== undefined ? { status: body.status } : {}),
        ...(body.scheduledAt !== undefined
          ? { scheduledAt: new Date(body.scheduledAt) }
          : {}),
        ...(body.therapist !== undefined ? { therapist: body.therapist } : {}),
        ...(body.type !== undefined ? { type: body.type } : {}),
        ...(body.durationMin !== undefined
          ? { durationMin: body.durationMin }
          : {}),
        ...(body.notes !== undefined ? { notes: body.notes } : {}),
      },
      include: {
        lead: { select: { id: true, name: true, email: true } },
        session: { include: { payment: true } },
      },
    });

    return NextResponse.json({ success: true, appointment });
  } catch (error) {
    console.error("PATCH appointment error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}

// ── DELETE /api/admin/appointments ─────────────────────────────────────────────
export async function DELETE_HANDLER(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing id" },
        { status: 400 },
      );
    }

    // Perform the delete once and capture the result
    const deleted = await db.appointment
      .delete({
        where: { id },
      })
      .catch(() => null);

    // If 'deleted' is null, the ID didn't exist in the database
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Appointment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, deleted: true });
  } catch (error) {
    console.error("DELETE appointment error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}

export const GET = withRateLimit(GET_HANDLER);
export const POST = withRateLimit(POST_HANDLER);
export const PATCH = withRateLimit(PATCH_HANDLER);
export const DELETE = withRateLimit(DELETE_HANDLER);
