import { apiLimit } from "../lib/rateLimit";
import { NextResponse } from "next/server";

// ── Retry helper — exponential backoff, fully silent ──────────────────────────
export async function retryAsync<T>(
  fn: () => Promise<T>,
  attempts = 3,
  baseDelayMs = 300,
): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < attempts - 1) {
        await new Promise((res) =>
          setTimeout(res, baseDelayMs * Math.pow(2, i)),
        );
      }
    }
  }
  throw lastError;
}

export const EVENTS = {
  ASSESSMENT_STARTED: "ASSESSMENT_STARTED",
  ASSESSMENT_COMPLETED: "ASSESSMENT_COMPLETED",
  REPORT_GENERATED: "REPORT_GENERATED",
  PAYMENT_COMPLETED: "PAYMENT_COMPLETED",
  USER_REGISTERED: "USER_REGISTERED",
  LEAD_CAPTURED: "LEAD_CAPTURED",
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

// ── Check API Rate Limit RATE LIMITER HELPER───────────────────────────────────────────────────────
export async function checkApiLimit(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { success } = await apiLimit.limit(ip);

  if (!success) {
    return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
  }
  return null; // Return null if allowed
}

export function getMentelIds(req: Request) {
  const cookieHeader = req.headers.get("cookie") ?? "";
  const get = (name: string) =>
    cookieHeader.match(new RegExp(`(?:^|; )${name}=([^;]*)`))?.[1] ?? null;
  return {
    visitorId: get("mentel_vid"),
    sessionId: get("mentel_sid"),
  };
}
