// middleware.ts — place in project ROOT (same level as app/ and package.json)
// Runs on every /admin request and checks for a valid session cookie.
// If no valid cookie → redirect to /admin/login
// /admin/login itself is excluded so you don't get an infinite redirect loop.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "mentel_admin_session";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET!;

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow the login page and the auth API route through
  if (pathname === "/login" || pathname.startsWith("/api/admin/auth")) {
    return NextResponse.next();
  }

  // Protect everything else under /admin
  if (pathname.startsWith("/admin")) {
    const session = req.cookies.get(SESSION_COOKIE)?.value;

    if (!session || session !== SESSION_SECRET) {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
