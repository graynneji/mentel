// app/api/admin/heartbeat/route.ts
// POST: called periodically by the admin layout while a tab is open, to
// keep this session's "last seen" timestamp fresh for the active-sessions
// count. Self-heals sessions that predate this feature (no mentel_admin_sid
// cookie yet) by registering one on the spot.

import { NextRequest, NextResponse } from "next/server";
import { touchSession, registerSession } from "@/lib/admin/sessions";

const SID_COOKIE = "mentel_admin_sid";

function requireAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("mentel_admin_session")?.value;
  return session === process.env.ADMIN_SESSION_SECRET;
}

function getIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: Request) {
  const nextReq = req as NextRequest;
  if (!requireAdmin(nextReq)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const sid = nextReq.cookies.get(SID_COOKIE)?.value;

    if (sid) {
      await touchSession(sid);
      return NextResponse.json({ success: true });
    }

    // No session id yet (logged in before this feature existed) — register
    // one now so it starts showing up in the count going forward.
    const newSid = await registerSession(getIp(nextReq), nextReq.headers.get("user-agent") ?? "unknown");
    const res = NextResponse.json({ success: true });
    res.cookies.set(SID_COOKIE, newSid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return res;
  } catch (err) {
    console.error("[Admin Heartbeat]", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
