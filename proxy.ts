// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// const ADMIN_COOKIE = "mentel_admin_session";
// const HR_COOKIE = "mentel_hr_session";

// export async function proxy(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // ── Admin protection (existing logic, unchanged) ─────────────────────────
//   if (pathname.startsWith("/admin")) {
//     // Allow login page and auth API through
//     if (pathname === "/login" || pathname.startsWith("/api/admin/auth")) {
//       return NextResponse.next();
//     }
//     const session = req.cookies.get(ADMIN_COOKIE)?.value;
//     if (!session || session !== process.env.ADMIN_SESSION_SECRET) {
//       const url = new URL("/login", req.url);
//       url.searchParams.set("from", pathname);
//       return NextResponse.redirect(url);
//     }
//   }

//   // ── HR portal protection ─────────────────────────────────────────────────
//   if (pathname.startsWith("/hr")) {
//     // Allow the access page (login) and auth API through
//     if (pathname === "/hr/access" || pathname.startsWith("/api/hr/auth")) {
//       return NextResponse.next();
//     }
//     // Check HR session cookie
//     const hrSession = req.cookies.get(HR_COOKIE)?.value;
//     if (!hrSession) {
//       const url = new URL("/hr/access", req.url);
//       url.searchParams.set("from", pathname);
//       return NextResponse.redirect(url);
//     }
//     // Note: Full signature verification happens in getHRSession() in API routes.
//     // Middleware just checks cookie exists (fast path); API routes do full verification.
//   }

//   // ── EAP employee area — just needs enrol token ───────────────────────────
//   if (pathname.startsWith("/eap/assessment")) {
//     const token = req.cookies.get("mentel_eap_token")?.value;
//     if (!token) {
//       return NextResponse.redirect(new URL("/eap/enrol", req.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/admin/:path*",
//     "/hr/:path*",
//     "/eap/assessment/:path*",
//     // Exclude static assets and Next.js internals
//     "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|ico|css|js)$).*)",
//   ],
// };
//////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  adminLimit,
  // apiLimit,
  assessmentLimit,
  landingLimit,
} from "./lib/rateLimit";

const ADMIN_COOKIE = "mentel_admin_session";
const HR_COOKIE = "mentel_hr_session";

/* ─────────────────────────────────────────────
   BOT SCAN BLOCKING
───────────────────────────────────────────── */

const blockedPaths = [
  "/wp-admin",
  "/wp-login.php",
  "/wp-content",
  "/wp-includes",
  "/xmlrpc.php",
  "/phpmyadmin",
  "/administrator",
  // "/admin",
  "/login.php",
  "/config.php",
];

const blockedPatterns = [
  /\.env/,
  /\.git/,
  /\.svn/,
  /\.bak/,
  /\.sql/,
  /\.zip/,
  /\.tar/,
];

type MemoryRecord = {
  count: number;
  ts: number;
};

/* ─────────────────────────────
   SEPARATED MEMORY BUCKETS
───────────────────────────── */

const memoryStore = {
  landing: new Map<string, MemoryRecord>(),
  // api: new Map<string, MemoryRecord>(),
  assessment: new Map<string, MemoryRecord>(),
  admin: new Map<string, MemoryRecord>(),
};

const WINDOW_MS = 60 * 1000;
const MEMORY_LIMITS = {
  landing: 120,
  // api: 120,
  assessment: 120,
  admin: 10,
};

function memoryRateLimit(
  bucket: keyof typeof memoryStore,
  key: string,
): boolean {
  const store = memoryStore[bucket];
  const now = Date.now();

  const limit = MEMORY_LIMITS[bucket];

  const record = store.get(key);

  if (!record) {
    store.set(key, { count: 1, ts: now });
    return false;
  }

  if (now - record.ts > WINDOW_MS) {
    store.set(key, { count: 1, ts: now });
    return false;
  }

  record.count++;

  return record.count > limit;
}

const VISITOR_COOKIE = "mentel_vid";
const SESSION_COOKIE = "mentel_sid";
const SESSION_MAX_AGE_MIN = 30; // rolling inactivity window for a "session"

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "ttclid",
];

/* ─────────────────────────────────────────────
   MIDDLEWARE
───────────────────────────────────────────── */

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();

  const visitorId =
    req.cookies.get(VISITOR_COOKIE)?.value || crypto.randomUUID();
  const sessionId =
    req.cookies.get(SESSION_COOKIE)?.value || crypto.randomUUID();
  const isNewVisitor = !req.cookies.has(VISITOR_COOKIE);
  const isNewSession = !req.cookies.has(SESSION_COOKIE);

  // if (!visitorId) visitorId = crypto.randomUUID();
  // if (!sessionId) sessionId = crypto.randomUUID();

  res.cookies.set(VISITOR_COOKIE, visitorId, {
    maxAge: 60 * 60 * 24 * 365 * 2, // 2 years
    httpOnly: false, // the browser SDK reads this to attach visitorId client-side
    sameSite: "lax",
    path: "/",
  });
  res.cookies.set(SESSION_COOKIE, sessionId, {
    maxAge: 60 * SESSION_MAX_AGE_MIN,
    httpOnly: false,
    sameSite: "lax",
    path: "/",
  });

  // Capture first-touch UTM/click-id params into a dedicated cookie the API
  // route can read on session creation, without polluting every page URL.
  const url = new URL(req.url);
  const hasUtm = UTM_KEYS.some((k) => url.searchParams.has(k));
  if (hasUtm && (isNewVisitor || isNewSession)) {
    const attribution: Record<string, string> = {};
    for (const k of UTM_KEYS) {
      const v = url.searchParams.get(k);
      if (v) attribution[k] = v;
    }
    res.cookies.set("mentel_utm", JSON.stringify(attribution), {
      maxAge: 60 * SESSION_MAX_AGE_MIN,
      httpOnly: false,
      sameSite: "lax",
      path: "/",
    });
  }

  /* ── REAL IP ── */

  // Add this check at the start of your rate-limiting logic
  const userAgent = req.headers.get("user-agent") || "";
  const isVerifiedBot = /Googlebot|Bingbot|Slurp|DuckDuckBot/i.test(userAgent);

  if (isVerifiedBot) {
    return res; // Skip rate limiting for search engines
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  /* ── BLOCK ATTACK SCANS FIRST ── */
  if (blockedPaths.some((p) => pathname.startsWith(p))) {
    return new NextResponse("Not Found", { status: 404 });
  }

  if (blockedPatterns.some((p) => p.test(pathname))) {
    return new NextResponse("Not Found", { status: 404 });
  }

  let allowed = true;

  try {
    if (pathname.startsWith("/admin")) {
      const { success } = await adminLimit.limit(ip);
      allowed = success;
      // } else if (pathname.startsWith("/api")) {
      //   const { success } = await apiLimit.limit(ip);
      //   allowed = success;
    } else if (pathname.startsWith("/eap/assessment")) {
      const { success } = await assessmentLimit.limit(ip);
      allowed = success;
    } else {
      const { success } = await landingLimit.limit(ip);
      allowed = success;
    }
  } catch {
    console.warn("Redis failed → using distributed memory fallback");

    if (pathname.startsWith("/admin")) {
      allowed = !memoryRateLimit("admin", ip);
      // } else if (pathname.startsWith("/api")) {
      //   allowed = !memoryRateLimit("api", ip);
    } else if (pathname.startsWith("/eap/assessment")) {
      allowed = !memoryRateLimit("assessment", ip);
    } else {
      allowed = !memoryRateLimit("landing", ip);
    }
  }

  if (!allowed) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  /* ── ADMIN PROTECTION ── */
  if (pathname.startsWith("/admin")) {
    if (pathname === "/login" || pathname.startsWith("/api/admin/auth")) {
      return res;
    }

    const session = req.cookies.get(ADMIN_COOKIE)?.value;

    if (!session || session !== process.env.ADMIN_SESSION_SECRET) {
      const url = new URL("/login", req.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  /* ── HR PORTAL ── */
  if (pathname.startsWith("/hr")) {
    if (pathname === "/hr/access" || pathname.startsWith("/api/hr/auth")) {
      return res;
    }

    const hrSession = req.cookies.get(HR_COOKIE)?.value;

    if (!hrSession) {
      const url = new URL("/hr/access", req.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  /* ── EAP PROTECTION ── */
  if (pathname.startsWith("/eap/assessment")) {
    const token = req.cookies.get("mentel_eap_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/eap/enrol", req.url));
    }
  }

  // Surface flags to the route/API handler via request headers (cookies aren't
  // readable from the request that triggered this middleware run otherwise).
  res.headers.set("x-mentel-visitor-id", visitorId);
  res.headers.set("x-mentel-session-id", sessionId);
  res.headers.set("x-mentel-new-session", String(isNewSession));

  return res;
}

/* ─────────────────────────────────────────────
   MATCHER
───────────────────────────────────────────── */

// export const config = {
//   matcher: [
//     "/admin/:path*",
//     "/hr/:path*",
//     "/eap/assessment/:path*",
//     "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|ico|css|js)$).*)",
//   ],
// };

export const config = {
  matcher: [
    /*
     * This single pattern matches everything EXCEPT the paths we explicitly exclude.
     * We exclude:
     * - api (to save Edge Requests)
     * - Internal assets (_next/static, _next/image)
     * - Public static files (favicon, robots, sitemap, extensions)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|ico|css|js)$).*)",
  ],
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import {
//   adminLimit,
//   // apiLimit,
//   assessmentLimit,
//   landingLimit,
// } from "./lib/rateLimit";

// const ADMIN_COOKIE = "mentel_admin_session";
// const HR_COOKIE = "mentel_hr_session";

// /* ─────────────────────────────────────────────
//    BOT SCAN BLOCKING
// ───────────────────────────────────────────── */

// const blockedPaths = [
//   "/wp-admin",
//   "/wp-login.php",
//   "/wp-content",
//   "/wp-includes",
//   "/xmlrpc.php",
//   "/phpmyadmin",
//   "/administrator",
//   // "/admin",
//   "/login.php",
//   "/config.php",
// ];

// const blockedPatterns = [
//   /\.env/,
//   /\.git/,
//   /\.svn/,
//   /\.bak/,
//   /\.sql/,
//   /\.zip/,
//   /\.tar/,
// ];

// type MemoryRecord = {
//   count: number;
//   ts: number;
// };

// /* ─────────────────────────────
//    SEPARATED MEMORY BUCKETS
// ───────────────────────────── */

// const memoryStore = {
//   landing: new Map<string, MemoryRecord>(),
//   // api: new Map<string, MemoryRecord>(),
//   assessment: new Map<string, MemoryRecord>(),
//   admin: new Map<string, MemoryRecord>(),
// };

// const WINDOW_MS = 60 * 1000;
// const MEMORY_LIMITS = {
//   landing: 120,
//   // api: 120,
//   assessment: 120,
//   admin: 10,
// };

// function memoryRateLimit(
//   bucket: keyof typeof memoryStore,
//   key: string,
// ): boolean {
//   const store = memoryStore[bucket];
//   const now = Date.now();

//   const limit = MEMORY_LIMITS[bucket];

//   const record = store.get(key);

//   if (!record) {
//     store.set(key, { count: 1, ts: now });
//     return false;
//   }

//   if (now - record.ts > WINDOW_MS) {
//     store.set(key, { count: 1, ts: now });
//     return false;
//   }

//   record.count++;

//   return record.count > limit;
// }

// /* ─────────────────────────────────────────────
//    MIDDLEWARE
// ───────────────────────────────────────────── */

// export async function proxy(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   /* ── REAL IP ── */

//   // Add this check at the start of your rate-limiting logic
//   const userAgent = req.headers.get("user-agent") || "";
//   const isVerifiedBot = /Googlebot|Bingbot|Slurp|DuckDuckBot/i.test(userAgent);

//   if (isVerifiedBot) {
//     return NextResponse.next(); // Skip rate limiting for search engines
//   }

//   const ip =
//     req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
//     req.headers.get("x-real-ip") ||
//     "unknown";

//   /* ── BLOCK ATTACK SCANS FIRST ── */
//   if (blockedPaths.some((p) => pathname.startsWith(p))) {
//     return new NextResponse("Not Found", { status: 404 });
//   }

//   if (blockedPatterns.some((p) => p.test(pathname))) {
//     return new NextResponse("Not Found", { status: 404 });
//   }

//   let allowed = true;

//   try {
//     if (pathname.startsWith("/admin")) {
//       const { success } = await adminLimit.limit(ip);
//       allowed = success;
//       // } else if (pathname.startsWith("/api")) {
//       //   const { success } = await apiLimit.limit(ip);
//       //   allowed = success;
//     } else if (pathname.startsWith("/eap/assessment")) {
//       const { success } = await assessmentLimit.limit(ip);
//       allowed = success;
//     } else {
//       const { success } = await landingLimit.limit(ip);
//       allowed = success;
//     }
//   } catch {
//     console.warn("Redis failed → using distributed memory fallback");

//     if (pathname.startsWith("/admin")) {
//       allowed = !memoryRateLimit("admin", ip);
//       // } else if (pathname.startsWith("/api")) {
//       //   allowed = !memoryRateLimit("api", ip);
//     } else if (pathname.startsWith("/eap/assessment")) {
//       allowed = !memoryRateLimit("assessment", ip);
//     } else {
//       allowed = !memoryRateLimit("landing", ip);
//     }
//   }

//   if (!allowed) {
//     return new NextResponse("Too Many Requests", { status: 429 });
//   }

//   /* ── ADMIN PROTECTION ── */
//   if (pathname.startsWith("/admin")) {
//     if (pathname === "/login" || pathname.startsWith("/api/admin/auth")) {
//       return NextResponse.next();
//     }

//     const session = req.cookies.get(ADMIN_COOKIE)?.value;

//     if (!session || session !== process.env.ADMIN_SESSION_SECRET) {
//       const url = new URL("/login", req.url);
//       url.searchParams.set("from", pathname);
//       return NextResponse.redirect(url);
//     }
//   }

//   /* ── HR PORTAL ── */
//   if (pathname.startsWith("/hr")) {
//     if (pathname === "/hr/access" || pathname.startsWith("/api/hr/auth")) {
//       return NextResponse.next();
//     }

//     const hrSession = req.cookies.get(HR_COOKIE)?.value;

//     if (!hrSession) {
//       const url = new URL("/hr/access", req.url);
//       url.searchParams.set("from", pathname);
//       return NextResponse.redirect(url);
//     }
//   }

//   /* ── EAP PROTECTION ── */
//   if (pathname.startsWith("/eap/assessment")) {
//     const token = req.cookies.get("mentel_eap_token")?.value;

//     if (!token) {
//       return NextResponse.redirect(new URL("/eap/enrol", req.url));
//     }
//   }

//   return NextResponse.next();
// }

// /* ─────────────────────────────────────────────
//    MATCHER
// ───────────────────────────────────────────── */

// // export const config = {
// //   matcher: [
// //     "/admin/:path*",
// //     "/hr/:path*",
// //     "/eap/assessment/:path*",
// //     "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|ico|css|js)$).*)",
// //   ],
// // };

// export const config = {
//   matcher: [
//     /*
//      * This single pattern matches everything EXCEPT the paths we explicitly exclude.
//      * We exclude:
//      * - api (to save Edge Requests)
//      * - Internal assets (_next/static, _next/image)
//      * - Public static files (favicon, robots, sitemap, extensions)
//      */
//     "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|ico|css|js)$).*)",
//   ],
// };
