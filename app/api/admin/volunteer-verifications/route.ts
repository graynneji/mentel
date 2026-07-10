// app/api/admin/volunteer-verifications/route.ts
// GET: list volunteer verification submissions for admin review.

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
    const status = searchParams.get("status");

    const submissions = await db.volunteerVerification.findMany({
      where: status && status !== "all" ? { status } : {},
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, submissions });
  } catch (err) {
    console.error("[Admin Volunteer Verifications GET]", err);
    return NextResponse.json({ success: false, error: "Failed to load submissions." }, { status: 500 });
  }
}
