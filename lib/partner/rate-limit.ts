// lib/partner/rate-limit.ts
// Per-partner rate limiting (not per-IP — a partner integrates from their
// own backend, often behind a shared egress IP, so IP-based limiting from
// utilz/checkApiLimit would be wrong here). 60 requests/minute per partner,
// sliding window, backed by the same Upstash Redis instance already used
// elsewhere in this project.

import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "1 m"),
  prefix: "partner_api",
});

export async function checkPartnerRateLimit(
  partnerId: string,
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const { success, remaining, reset } = await ratelimit.limit(partnerId);
  return { success, remaining, reset };
}
