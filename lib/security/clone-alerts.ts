// lib/security/clone-alerts.ts
import { redis } from "@/lib/redis";

const DEDUPE_TTL_SECONDS = 60 * 60 * 24; // one notification per cloned domain per day

/** True the first time a given foreign host is seen today; false on repeats (so we don't email per page view). */
export async function shouldNotifyForHost(host: string): Promise<boolean> {
  const key = `clone_alert_notified:${host}`;
  // Upstash's set with nx returns null if the key already existed —
  // this is an atomic "claim it or don't" check, no race condition.
  const result = await redis.set(key, "1", { nx: true, ex: DEDUPE_TTL_SECONDS });
  return result !== null;
}
