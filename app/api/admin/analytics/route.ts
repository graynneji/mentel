// app/api/admin/analytics/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkApiLimit } from "@/utilz";
import { withRateLimit } from "@/lib/withRateLimit";

export const revalidate = 300;
// ── GET /api/admin/analytics — dashboard-level aggregates ─────────────────────
export async function GET_HANDLER(req: Request): Promise<NextResponse> {
  const limitError = await checkApiLimit(req);
  if (limitError) return limitError;
  try {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
    );
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [
      // Lead counts
      totalLeads,
      newLeads,
      newLeadsLastMonth,
      bookedLeads,

      // Session counts
      totalSessions,
      thisMonthSessions,
      lastMonthSessions,
      noShows,

      // Revenue
      totalPaidKobo,
      thisMonthPaidKobo,
      lastMonthPaidKobo,
      pendingKobo,

      // Distributions
      bandCounts,
      statusCounts,
      sourceCounts,
      therapistCounts,

      // Monthly revenue (6 months)
      monthlyRevenue,

      // Monthly new leads (6 months)
      monthlyLeads,

      // High-severity leads
      highSeverityLeads,

      // Upcoming appointments
      upcomingCount,

      // Avg session mood
      avgMood,
    ] = await Promise.all([
      db.lead.count(),
      db.lead.count({ where: { createdAt: { gte: thisMonthStart } } }),
      db.lead.count({
        where: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } },
      }),
      db.lead.count({ where: { status: "booked" } }),

      db.session.count(),
      db.session.count({ where: { conductedAt: { gte: thisMonthStart } } }),
      db.session.count({
        where: { conductedAt: { gte: lastMonthStart, lte: lastMonthEnd } },
      }),
      db.appointment.count({ where: { status: "no-show" } }),

      db.payment.aggregate({
        _sum: { amountKobo: true },
        where: { status: "paid" },
      }),
      db.payment.aggregate({
        _sum: { amountKobo: true },
        where: { status: "paid", paidAt: { gte: thisMonthStart } },
      }),
      db.payment.aggregate({
        _sum: { amountKobo: true },
        where: {
          status: "paid",
          paidAt: { gte: lastMonthStart, lte: lastMonthEnd },
        },
      }),
      db.payment.aggregate({
        _sum: { amountKobo: true },
        where: { status: "pending" },
      }),

      db.lead.groupBy({ by: ["band"], _count: { id: true } }),
      db.lead.groupBy({ by: ["status"], _count: { id: true } }),
      db.lead.groupBy({ by: ["source"], _count: { id: true } }),
      db.session.groupBy({
        by: ["therapist"],
        _count: { id: true },
        _sum: { durationMin: true },
      }),

      db.$queryRaw<{ month: string; amount: bigint; count: bigint }[]>`
        SELECT
          TO_CHAR(DATE_TRUNC('month', paid_at), 'YYYY-MM') AS month,
          SUM(amount_kobo) AS amount,
          COUNT(*) AS count
        FROM payments
        WHERE status = 'paid' AND paid_at >= ${sixMonthsAgo}
        GROUP BY DATE_TRUNC('month', paid_at)
        ORDER BY DATE_TRUNC('month', paid_at) ASC
      `,

      db.$queryRaw<{ month: string; count: bigint }[]>`
        SELECT
          TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') AS month,
          COUNT(*) AS count
        FROM leads
        WHERE created_at >= ${sixMonthsAgo}
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY DATE_TRUNC('month', created_at) ASC
      `,

      db.lead.findMany({
        where: { band: "High", status: { in: ["new", "contacted"] } },
        select: {
          id: true,
          name: true,
          email: true,
          band: true,
          score: true,
          createdAt: true,
        },
        orderBy: { score: "desc" },
        take: 10,
      }),

      db.appointment.count({
        where: { status: "scheduled", scheduledAt: { gte: now } },
      }),

      db.session.aggregate({
        _avg: { mood: true },
        where: { mood: { not: null } },
      }),
    ]);

    // ── Derived metrics ────────────────────────────────────────────────────────
    const thisMonthKobo = thisMonthPaidKobo._sum.amountKobo ?? 0;
    const lastMonthKobo = lastMonthPaidKobo._sum.amountKobo ?? 0;
    const revenueGrowth =
      lastMonthKobo > 0
        ? ((thisMonthKobo - lastMonthKobo) / lastMonthKobo) * 100
        : null;

    const sessionGrowth =
      lastMonthSessions > 0
        ? ((thisMonthSessions - lastMonthSessions) / lastMonthSessions) * 100
        : null;

    const conversionRate =
      totalLeads > 0 ? (bookedLeads / totalLeads) * 100 : 0;
    const arpu =
      totalSessions > 0
        ? (totalPaidKobo._sum.amountKobo ?? 0) / totalSessions
        : 0;

    return NextResponse.json({
      success: true,
      overview: {
        totalLeads,
        newLeads,
        newLeadsLastMonth,
        bookedLeads,
        conversionRate,
        totalSessions,
        thisMonthSessions,
        lastMonthSessions,
        sessionGrowth,
        noShows,
        noShowRate:
          totalSessions > 0 ? (noShows / (totalSessions + noShows)) * 100 : 0,
        totalPaidKobo: totalPaidKobo._sum.amountKobo ?? 0,
        thisMonthPaidKobo: thisMonthKobo,
        lastMonthPaidKobo: lastMonthKobo,
        pendingKobo: pendingKobo._sum.amountKobo ?? 0,
        revenueGrowth,
        arpu,
        upcomingCount,
        avgMood: avgMood._avg.mood,
      },
      distributions: {
        band: Object.fromEntries(bandCounts.map((r) => [r.band, r._count.id])),
        status: Object.fromEntries(
          statusCounts.map((r) => [r.status, r._count.id]),
        ),
        source: Object.fromEntries(
          sourceCounts.map((r) => [r.source ?? "unknown", r._count.id]),
        ),
        therapist: therapistCounts.map((t) => ({
          name: t.therapist,
          sessions: t._count.id,
          totalMinutes: t._sum.durationMin ?? 0,
        })),
      },
      charts: {
        monthlyRevenue: monthlyRevenue.map((r) => ({
          month: r.month,
          amountKobo: Number(r.amount),
          sessions: Number(r.count),
        })),
        monthlyLeads: monthlyLeads.map((r) => ({
          month: r.month,
          count: Number(r.count),
        })),
      },
      alerts: {
        highSeverityLeads,
      },
    });
  } catch (error) {
    console.error("GET analytics error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}

export const GET = withRateLimit(GET_HANDLER);
