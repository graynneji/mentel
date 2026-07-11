// app/api/admin/active-sessions/route.ts
// GET: how many admin sessions are online right now, plus the list of
// sessions with IP/user-agent/last-seen for the security-conscious view.

import { NextRequest, NextResponse } from "next/server";
import { listActiveSessions, countOnline, isOnline } from "@/lib/admin/sessions";

function requireAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("mentel_admin_session")?.value;
  return session === process.env.ADMIN_SESSION_SECRET;
}

export async function GET(req: Request) {
  const nextReq = req as NextRequest;
  if (!requireAdmin(nextReq)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const sessions = await listActiveSessions();
    const onlineCount = countOnline(sessions);

    return NextResponse.json({
      success: true,
      onlineCount,
      totalLoggedIn: sessions.length, // logged in within the last 8h, even if idle right now
      sessions: sessions.map((s) => ({ ...s, online: isOnline(s) })),
    });
  } catch (err) {
    console.error("[Admin Active Sessions GET]", err);
    return NextResponse.json({ success: false, error: "Failed to load sessions." }, { status: 500 });
  }
}
