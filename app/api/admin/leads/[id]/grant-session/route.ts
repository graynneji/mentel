// app/api/admin/leads/[id]/grant-session/route.ts
// POST: grant a free session to a lead — for goodwill, service recovery,
// or anything else that isn't tied to cancelling an existing session
// (see the "cancel" action in /api/admin/scheduled-sessions/[id] for the
// cancellation-triggered version of this).

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notifyFreeSessionGranted } from "@/lib/notifications/session-emails";

function requireAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("mentel_admin_session")?.value;
  return session === process.env.ADMIN_SESSION_SECRET;
}

export async function POST(req: Request, context: { params: Promise<{ id: string }> } | any) {
  const nextReq = req as NextRequest;
  if (!requireAdmin(nextReq)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id: leadId } = await context.params;
    const body = await nextReq.json();
    const sessionCount = Number.isFinite(body.sessions) ? Math.max(1, Math.min(10, Math.round(body.sessions))) : 1;
    const reason = typeof body.reason === "string" ? body.reason.slice(0, 300) : undefined;

    const lead = await db.lead.findUnique({ where: { id: leadId } });
    if (!lead) return NextResponse.json({ success: false, error: "Lead not found." }, { status: 404 });

    // Ensure they have a client-portal login too — a bonus session is
    // useless if they can't log in anywhere to schedule it.
    await db.clientAccount.upsert({
      where: { leadId: lead.id },
      create: { leadId: lead.id, email: lead.email },
      update: {},
    });

    const periodStart = new Date();
    const periodEnd = new Date(periodStart);
    periodEnd.setDate(periodEnd.getDate() + 30);

    const pkg = await db.package.create({
      data: {
        leadId: lead.id,
        paymentId: null,
        planType: "bonus",
        totalSessions: sessionCount,
        usedSessions: 0,
        periodStart,
        periodEnd,
        status: "active",
      },
    });

    await notifyFreeSessionGranted({ email: lead.email, phone: lead.phone, name: lead.name, reason });

    return NextResponse.json({ success: true, package: pkg });
  } catch (err) {
    console.error("[Admin Grant Session POST]", err);
    return NextResponse.json({ success: false, error: "Failed to grant session." }, { status: 500 });
  }
}
