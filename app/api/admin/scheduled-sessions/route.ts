// app/api/admin/scheduled-sessions/route.ts
//
// Lists sessions booked through the client portal's package-scheduling
// system (the ScheduledSession/Package models). Deliberately a separate
// path from the pre-existing /api/admin/sessions, which manages the
// older Session (completed clinical record) model — different feature,
// different table, kept apart intentionally.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function requireAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("mentel_admin_session")?.value;
  return session === process.env.ADMIN_SESSION_SECRET;
}

export async function GET(req: Request) {
  const nextReq = req as NextRequest;
  if (!requireAdmin(nextReq)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(nextReq.url);
    const status = searchParams.get("status"); // scheduled | completed | cancelled | no-show | all
    const search = searchParams.get("search");

    const sessions = await db.scheduledSession.findMany({
      where: {
        ...(status && status !== "all" ? { status } : {}),
        ...(search
          ? {
              package: {
                lead: {
                  OR: [
                    { name: { contains: search, mode: "insensitive" as const } },
                    { email: { contains: search, mode: "insensitive" as const } },
                  ],
                },
              },
            }
          : {}),
      },
      include: {
        package: { include: { lead: true } },
      },
      orderBy: { scheduledAt: "desc" },
      take: 300,
    });

    return NextResponse.json({
      success: true,
      sessions: sessions.map((s: (typeof sessions)[number]) => ({
        id: s.id,
        scheduledAt: s.scheduledAt,
        status: s.status,
        therapist: s.therapist,
        notes: s.notes,
        calBookingUid: s.calBookingUid,
        cancelledBy: s.cancelledBy,
        cancelReason: s.cancelReason,
        lead: {
          id: s.package.lead.id,
          name: s.package.lead.name,
          email: s.package.lead.email,
          phone: s.package.lead.phone,
        },
        package: {
          id: s.package.id,
          planType: s.package.planType,
          totalSessions: s.package.totalSessions,
          usedSessions: s.package.usedSessions,
        },
      })),
    });
  } catch (err) {
    console.error("[Admin Scheduled Sessions GET]", err);
    return NextResponse.json({ success: false, error: "Failed to load sessions." }, { status: 500 });
  }
}
