// app/api/admin/auth/route.ts
// POST /api/admin/auth        → login (sets session cookie)
// DELETE /api/admin/auth      → logout (clears session cookie)

import { NextResponse } from "next/server";

const SESSION_COOKIE = "mentel_admin_session";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

// ── POST — login ──────────────────────────────────────────────────────────────
export async function POST(req: Request): Promise<NextResponse> {
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
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });

    return res;
  } catch {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}

// ── DELETE — logout ───────────────────────────────────────────────────────────
export async function DELETE(): Promise<NextResponse> {
  const res = NextResponse.json({ success: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
