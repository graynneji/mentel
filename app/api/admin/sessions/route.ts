// app/api/admin/sessions/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withRateLimit } from "@/lib/withRateLimit";

// ── GET /api/admin/sessions ────────────────────────────────────────────────────
export async function GET_HANDLER(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get("leadId");
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
      ...(therapist ? { therapist } : {}),
      ...(from || to
        ? {
            conductedAt: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
    };

    const [sessions, total] = await Promise.all([
      db.session.findMany({
        where,
        include: {
          lead: { select: { id: true, name: true, email: true, band: true } },
          appointment: true,
          payment: true,
        },
        orderBy: { conductedAt: "desc" },
        skip,
        take: limit,
      }),
      db.session.count({ where }),
    ]);

    // Aggregate: total sessions per therapist, avg mood, total duration
    const [therapistStats, moodAvg] = await Promise.all([
      db.session.groupBy({
        by: ["therapist"],
        _count: { id: true },
        _sum: { durationMin: true },
      }),
      db.session.aggregate({
        _avg: { mood: true },
        where: { mood: { not: null } },
      }),
    ]);

    return NextResponse.json({
      success: true,
      sessions,
      analytics: {
        total,
        page,
        pages: Math.ceil(total / limit),
        avgMood: moodAvg._avg.mood,
        therapistStats: therapistStats.map((t) => ({
          therapist: t.therapist,
          sessions: t._count.id,
          totalMinutes: t._sum.durationMin ?? 0,
        })),
      },
    });
  } catch (error) {
    console.error("GET sessions error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}

// ── POST /api/admin/sessions ───────────────────────────────────────────────────
// Called when marking an appointment as completed (creates a session record)
export async function POST_HANDLER(req: Request): Promise<NextResponse> {
  try {
    const body = (await req.json()) as {
      leadId: string;
      appointmentId?: string;
      conductedAt: string;
      therapist: string;
      type?: string;
      durationMin?: number;
      notes?: string;
      progress?: string;
      mood?: number;
      // Payment details
      amountKobo: number;
      paymentMethod?: string;
      paymentRef?: string;
      paymentStatus?: string;
    };

    if (
      !body.leadId ||
      !body.conductedAt ||
      !body.therapist ||
      body.amountKobo === undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "leadId, conductedAt, therapist and amountKobo are required",
        },
        { status: 400 },
      );
    }

    // Create session + payment in a transaction
    const result = await db.$transaction(async (tx) => {
      const session = await tx.session.create({
        data: {
          leadId: body.leadId,
          appointmentId: body.appointmentId ?? null,
          conductedAt: new Date(body.conductedAt),
          therapist: body.therapist,
          type: body.type ?? "individual",
          durationMin: body.durationMin ?? 50,
          notes: body.notes,
          progress: body.progress,
          mood: body.mood ?? null,
        },
      });

      const payment = await tx.payment.create({
        data: {
          leadId: body.leadId,
          sessionId: session.id,
          amountKobo: body.amountKobo,
          method: body.paymentMethod ?? "transfer",
          reference: body.paymentRef ?? null,
          status: body.paymentStatus ?? "paid",
          paidAt:
            body.paymentStatus !== "pending"
              ? new Date(body.conductedAt)
              : null,
        },
      });

      // If linked to appointment, mark it completed
      if (body.appointmentId) {
        await tx.appointment.update({
          where: { id: body.appointmentId },
          data: { status: "completed" },
        });
      }

      return { session, payment };
    });

    return NextResponse.json({ success: true, ...result }, { status: 201 });
  } catch (error) {
    console.error("POST session error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}

// ── PATCH /api/admin/sessions ──────────────────────────────────────────────────
export async function PATCH_HANDLER(req: Request): Promise<NextResponse> {
  try {
    const body = (await req.json()) as {
      id: string;
      notes?: string;
      progress?: string;
      mood?: number;
      durationMin?: number;
    };

    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Missing id" },
        { status: 400 },
      );
    }

    const session = await db.session.update({
      where: { id: body.id },
      data: {
        ...(body.notes !== undefined ? { notes: body.notes } : {}),
        ...(body.progress !== undefined ? { progress: body.progress } : {}),
        ...(body.mood !== undefined ? { mood: body.mood } : {}),
        ...(body.durationMin !== undefined
          ? { durationMin: body.durationMin }
          : {}),
      },
      include: { payment: true },
    });

    return NextResponse.json({ success: true, session });
  } catch (error) {
    console.error("PATCH session error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}

export const GET = withRateLimit(GET_HANDLER);
export const POST = withRateLimit(POST_HANDLER);
export const PATCH = withRateLimit(PATCH_HANDLER);
