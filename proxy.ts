// // middleware.ts — place in project ROOT (same level as app/ and package.json)
// // Runs on every /admin request and checks for a valid session cookie.
// // If no valid cookie → redirect to /admin/login
// // /admin/login itself is excluded so you don't get an infinite redirect loop.

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// const SESSION_COOKIE = "mentel_admin_session";
// const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET!;

// export function proxy(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // Always allow the login page and the auth API route through
//   if (pathname === "/login" || pathname.startsWith("/api/admin/auth")) {
//     return NextResponse.next();
//   }

//   // Protect everything else under /admin
//   if (pathname.startsWith("/admin")) {
//     const session = req.cookies.get(SESSION_COOKIE)?.value;

//     if (!session || session !== SESSION_SECRET) {
//       const loginUrl = new URL("/login", req.url);
//       return NextResponse.redirect(loginUrl);
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/admin/:path*"],
// };

// middleware.ts — place in project ROOT (same level as app/ and package.json)
// Handles BOTH admin auth (existing) AND HR portal auth (new).
// HR uses access-code-based session cookie; admin uses env var secret.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE = "mentel_admin_session";
const HR_COOKIE = "mentel_hr_session";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Admin protection (existing logic, unchanged) ─────────────────────────
  if (pathname.startsWith("/admin")) {
    // Allow login page and auth API through
    if (pathname === "/login" || pathname.startsWith("/api/admin/auth")) {
      return NextResponse.next();
    }
    const session = req.cookies.get(ADMIN_COOKIE)?.value;
    if (!session || session !== process.env.ADMIN_SESSION_SECRET) {
      const url = new URL("/login", req.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  // ── HR portal protection ─────────────────────────────────────────────────
  if (pathname.startsWith("/hr")) {
    // Allow the access page (login) and auth API through
    if (pathname === "/hr/access" || pathname.startsWith("/api/hr/auth")) {
      return NextResponse.next();
    }
    // Check HR session cookie
    const hrSession = req.cookies.get(HR_COOKIE)?.value;
    if (!hrSession) {
      const url = new URL("/hr/access", req.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
    // Note: Full signature verification happens in getHRSession() in API routes.
    // Middleware just checks cookie exists (fast path); API routes do full verification.
  }

  // ── EAP employee area — just needs enrol token ───────────────────────────
  if (pathname.startsWith("/eap/assessment")) {
    const token = req.cookies.get("mentel_eap_token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/eap/enrol", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/hr/:path*",
    "/eap/assessment/:path*",
    // Exclude static assets and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|ico|css|js)$).*)",
  ],
};
