import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

// export const ratelimit = new Ratelimit({
//   redis,
//   limiter: Ratelimit.slidingWindow(60, "1 m"), // 60 requests per minute per IP
//   analytics: true,
// });

/* ─────────────────────────────
   DISTRIBUTED RATE LIMITERS
───────────────────────────── */

export const landingLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(120, "1 m"),
});

export const apiLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(120, "1 m"),
});

export const assessmentLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(120, "1 m"),
});

export const adminLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "1 m"),
});
