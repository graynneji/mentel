// app/api/admin/adhd-assessments/route.ts
//
// Mirrors the pattern in app/api/admin/payments/route.ts: paginated list +
// aggregates, filterable by status and a free-text search over name/email.

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withRateLimit } from "@/lib/withRateLimit";

export async function GET_HANDLER(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // lead | pending_payment | paid | failed
    const search = searchParams.get("search")?.trim();
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") ?? "50")),
    );
    const skip = (page - 1) * limit;

    const where = {
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [leads, total, paidCount, paidRevenueAgg] = await Promise.all([
      db.adhdAssessmentLead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.adhdAssessmentLead.count({ where }),
      db.adhdAssessmentLead.count({ where: { status: "paid" } }),
      db.adhdAssessmentLead.aggregate({
        where: { status: "paid" },
        _sum: { amountCents: true },
      }),
    ]);

    const totalLeads = await db.adhdAssessmentLead.count();

    return NextResponse.json({
      success: true,
      leads,
      analytics: {
        total,
        page,
        pages: Math.max(1, Math.ceil(total / limit)),
        totalLeads,
        paidCount,
        paidRevenueCents: paidRevenueAgg._sum.amountCents ?? 0,
        conversionRate:
          totalLeads > 0 ? Math.round((paidCount / totalLeads) * 100) : 0,
      },
    });
  } catch (error) {
    console.error("Admin ADHD assessments fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Server error." },
      { status: 500 },
    );
  }
}

export const GET = withRateLimit(GET_HANDLER);
