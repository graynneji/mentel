// app/api/admin/volunteer-verifications/[id]/route.ts
// PATCH: update status (approved/rejected/pending) and admin notes.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function requireAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("mentel_admin_session")?.value;
  return session === process.env.ADMIN_SESSION_SECRET;
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> } | any) {
  const nextReq = req as NextRequest;
  if (!requireAdmin(nextReq)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await context.params;
    const body = await nextReq.json();

    const data: Record<string, unknown> = {};
    if (typeof body.status === "string" && ["pending", "approved", "rejected"].includes(body.status)) {
      data.status = body.status;
    }
    if (typeof body.adminNotes === "string") data.adminNotes = body.adminNotes;

    const updated = await db.volunteerVerification.update({ where: { id }, data });
    return NextResponse.json({ success: true, submission: updated });
  } catch (err) {
    console.error("[Admin Volunteer Verification PATCH]", err);
    return NextResponse.json({ success: false, error: "Failed to update submission." }, { status: 500 });
  }
}
