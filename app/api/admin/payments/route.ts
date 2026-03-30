// app/api/admin/payments/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ── GET /api/admin/payments ────────────────────────────────────────────────────
export async function GET(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get("leadId");
    const status = searchParams.get("status");
    const method = searchParams.get("method");
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
      ...(method ? { method } : {}),
      ...(from || to
        ? {
            createdAt: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
    };

    const [payments, total] = await Promise.all([
      db.payment.findMany({
        where,
        include: {
          lead: { select: { id: true, name: true, email: true, band: true } },
          session: {
            select: {
              id: true,
              conductedAt: true,
              therapist: true,
              type: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.payment.count({ where }),
    ]);

    // Financial aggregates
    const [
      totalRevenue,
      paidRevenue,
      pendingRevenue,
      methodBreakdown,
      monthlyRevenue,
    ] = await Promise.all([
      db.payment.aggregate({ _sum: { amountKobo: true } }),
      db.payment.aggregate({
        _sum: { amountKobo: true },
        where: { status: "paid" },
      }),
      db.payment.aggregate({
        _sum: { amountKobo: true },
        where: { status: "pending" },
      }),
      db.payment.groupBy({
        by: ["method"],
        _sum: { amountKobo: true },
        _count: { id: true },
      }),
      // Last 6 months revenue by month
      db.$queryRaw<{ month: string; total: bigint }[]>`
        SELECT
          TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') AS month,
          SUM(amount_kobo) AS total
        FROM payments
        WHERE status = 'paid'
          AND created_at >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY DATE_TRUNC('month', created_at) ASC
      `,
    ]);

    return NextResponse.json({
      success: true,
      payments,
      analytics: {
        total,
        page,
        pages: Math.ceil(total / limit),
        totalRevenueKobo: totalRevenue._sum.amountKobo ?? 0,
        paidRevenueKobo: paidRevenue._sum.amountKobo ?? 0,
        pendingRevenueKobo: pendingRevenue._sum.amountKobo ?? 0,
        methodBreakdown: methodBreakdown.map((m) => ({
          method: m.method,
          count: m._count.id,
          amountKobo: m._sum.amountKobo ?? 0,
        })),
        monthlyRevenue: monthlyRevenue.map((r) => ({
          month: r.month,
          amountKobo: Number(r.total),
        })),
      },
    });
  } catch (error) {
    console.error("GET payments error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}

// ── POST /api/admin/payments — record a standalone payment ─────────────────────
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = (await req.json()) as {
      leadId: string;
      sessionId?: string;
      amountKobo: number;
      method?: string;
      reference?: string;
      status?: string;
      notes?: string;
      paidAt?: string;
    };

    if (!body.leadId || body.amountKobo === undefined) {
      return NextResponse.json(
        { success: false, error: "leadId and amountKobo are required" },
        { status: 400 },
      );
    }

    const payment = await db.payment.create({
      data: {
        leadId: body.leadId,
        sessionId: body.sessionId ?? null,
        amountKobo: body.amountKobo,
        method: body.method ?? "transfer",
        reference: body.reference ?? null,
        status: body.status ?? "paid",
        paidAt:
          body.status !== "pending"
            ? body.paidAt
              ? new Date(body.paidAt)
              : new Date()
            : null,
        notes: body.notes,
      },
      include: {
        lead: { select: { id: true, name: true, email: true } },
        session: true,
      },
    });

    return NextResponse.json({ success: true, payment }, { status: 201 });
  } catch (error) {
    console.error("POST payment error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}

// ── PATCH /api/admin/payments — update payment status / details ────────────────
export async function PATCH(req: Request): Promise<NextResponse> {
  try {
    const body = (await req.json()) as {
      id: string;
      status?: string;
      method?: string;
      reference?: string;
      amountKobo?: number;
      notes?: string;
      paidAt?: string;
    };

    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Missing id" },
        { status: 400 },
      );
    }

    const payment = await db.payment.update({
      where: { id: body.id },
      data: {
        ...(body.status !== undefined ? { status: body.status } : {}),
        ...(body.method !== undefined ? { method: body.method } : {}),
        ...(body.reference !== undefined ? { reference: body.reference } : {}),
        ...(body.amountKobo !== undefined
          ? { amountKobo: body.amountKobo }
          : {}),
        ...(body.notes !== undefined ? { notes: body.notes } : {}),
        ...(body.paidAt !== undefined ? { paidAt: new Date(body.paidAt) } : {}),
        // Auto-set paidAt when marking as paid
        ...(body.status === "paid" && !body.paidAt
          ? { paidAt: new Date() }
          : {}),
      },
      include: {
        lead: { select: { id: true, name: true, email: true } },
        session: true,
      },
    });

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    console.error("PATCH payment error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}
