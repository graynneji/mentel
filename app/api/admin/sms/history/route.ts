// app/api/admin/sms/history/route.ts
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
    const messages = await db.smsMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json({ success: true, messages });
  } catch (err) {
    console.error("[Admin SMS History GET]", err);
    return NextResponse.json({ success: false, error: "Failed to load SMS history." }, { status: 500 });
  }
}
