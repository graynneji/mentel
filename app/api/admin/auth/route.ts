// // app/api/admin/auth/route.ts
// // POST /api/admin/auth        → login (sets session cookie)
// // DELETE /api/admin/auth      → logout (clears session cookie)

// import { withRateLimit } from "@/lib/withRateLimit";
// import { NextResponse } from "next/server";

// const SESSION_COOKIE = "mentel_admin_session";
// const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET!;
// const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

// // ── POST — login ──────────────────────────────────────────────────────────────
// export async function POST_HANDLER(req: Request): Promise<NextResponse> {
//   try {
//     const { password } = (await req.json()) as { password: string };

//     if (!password || password !== ADMIN_PASSWORD) {
//       // Same error message whether user or password is wrong — don't leak info
//       return NextResponse.json(
//         { success: false, error: "Invalid credentials" },
//         { status: 401 },
//       );
//     }

//     const res = NextResponse.json({ success: true });

//     // HttpOnly cookie — JS cannot read it, protects against XSS
//     res.cookies.set(SESSION_COOKIE, SESSION_SECRET, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       path: "/",
//       maxAge: 60 * 60 * 8, // 8 hours
//     });

//     return res;
//   } catch {
//     return NextResponse.json(
//       { success: false, error: "Server error" },
//       { status: 500 },
//     );
//   }
// }

// // ── DELETE — logout ───────────────────────────────────────────────────────────
// export async function DELETE_HANDLER(): Promise<NextResponse> {
//   const res = NextResponse.json({ success: true });
//   res.cookies.delete(SESSION_COOKIE);
//   return res;
// }

// export const POST = withRateLimit(POST_HANDLER);
// export const DELETE = withRateLimit(DELETE_HANDLER);

// app/api/admin/auth/route.ts
// POST /api/admin/auth        → login (sets session cookie)
// DELETE /api/admin/auth      → logout (clears session cookie)

import { withRateLimit } from "@/lib/withRateLimit";
import { NextRequest, NextResponse } from "next/server";
import { registerSession, removeSession } from "@/lib/admin/sessions";

const SESSION_COOKIE = "mentel_admin_session";
const SID_COOKIE = "mentel_admin_sid"; // separate id used only for "who's online" tracking — grants no access on its own
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

function getIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

// ── POST — login ──────────────────────────────────────────────────────────────
export async function POST_HANDLER(req: Request): Promise<NextResponse> {
  try {
    const { password } = (await req.json()) as { password: string };

    if (!password || password !== ADMIN_PASSWORD) {
      // Same error message whether user or password is wrong — don't leak info
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const res = NextResponse.json({ success: true });

    // HttpOnly cookie — JS cannot read it, protects against XSS
    res.cookies.set(SESSION_COOKIE, SESSION_SECRET, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });

    // Separate, additive session id purely for the "who's logged in" admin
    // panel feature — doesn't change authorization at all, so it can't
    // break any existing admin route.
    try {
      const sessionId = await registerSession(
        getIp(req),
        req.headers.get("user-agent") ?? "unknown",
      );
      res.cookies.set(SID_COOKIE, sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 8,
      });
    } catch (err) {
      // Session-presence tracking is a nice-to-have — never block login over it.
      console.error("[admin auth] session registration failed", err);
    }

    return res;
  } catch {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}

// ── DELETE — logout ───────────────────────────────────────────────────────────
export async function DELETE_HANDLER(req: Request): Promise<NextResponse> {
  const nextReq = req as NextRequest;
  const res = NextResponse.json({ success: true });
  res.cookies.delete(SESSION_COOKIE);

  const sid = nextReq.cookies.get(SID_COOKIE)?.value;
  res.cookies.delete(SID_COOKIE);
  if (sid) {
    try {
      await removeSession(sid);
    } catch (err) {
      console.error("[admin auth] session removal failed", err);
    }
  }

  return res;
}

export const POST = withRateLimit(POST_HANDLER);
export const DELETE = withRateLimit(DELETE_HANDLER);
