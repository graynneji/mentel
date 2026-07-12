// lib/admin/sessions.ts
//
// "How many people are logged into my admin" tracking.
//
// Important design choice: your current admin login (app/api/admin/auth/
// route.ts) gives every login the exact same cookie value — the shared
// ADMIN_SESSION_SECRET. That's fine for authorization (it works), but it
// means there's no way to tell two different logins apart at all — they
// look byte-for-byte identical to the server. Rather than rework that
// (touching auth used by every single admin API route is high-risk to do
// blind), this adds a SEPARATE, parallel per-login identifier used only
// for presence tracking. It grants no access on its own — the real
// authorization check is untouched.
//
// Sessions live in Redis (you already have Upstash configured) with a
// TTL matching the login cookie's 8-hour lifetime, so stale entries expire
// on their own even if someone closes the tab without logging out.

import { redis } from "@/lib/redis";

const SESSION_TTL_SECONDS = 60 * 60 * 8; // matches the admin login cookie's maxAge
const ONLINE_WINDOW_SECONDS = 90; // no heartbeat in this long = treated as "gone", not just "idle"
const INDEX_KEY = "admin_sessions_index";

export interface AdminSessionInfo {
  sessionId: string;
  createdAt: number;
  lastSeenAt: number;
  ip: string;
  userAgent: string;
}

function sessionKey(id: string) {
  return `admin_session:${id}`;
}

export async function registerSession(
  ip: string,
  userAgent: string,
): Promise<string> {
  const sessionId = crypto.randomUUID();
  const now = Date.now();
  const info: AdminSessionInfo = {
    sessionId,
    createdAt: now,
    lastSeenAt: now,
    ip,
    userAgent,
  };

  await redis.set(sessionKey(sessionId), JSON.stringify(info), {
    ex: SESSION_TTL_SECONDS,
  });
  await redis.sadd(INDEX_KEY, sessionId);

  return sessionId;
}

export async function touchSession(sessionId: string): Promise<void> {
  const raw = await redis.get<string>(sessionKey(sessionId));
  if (!raw) {
    // Expired or never registered — nothing to touch. The caller
    // (heartbeat route) re-registers a fresh one in this case.
    return;
  }
  const info: AdminSessionInfo =
    typeof raw === "string"
      ? JSON.parse(raw)
      : (raw as unknown as AdminSessionInfo);
  info.lastSeenAt = Date.now();
  await redis.set(sessionKey(sessionId), JSON.stringify(info), {
    ex: SESSION_TTL_SECONDS,
  });
}

export async function removeSession(sessionId: string): Promise<void> {
  await redis.del(sessionKey(sessionId));
  await redis.srem(INDEX_KEY, sessionId);
}

/** All sessions with a still-live Redis entry, self-healing the index as it goes. */
export async function listActiveSessions(): Promise<AdminSessionInfo[]> {
  const ids = await redis.smembers(INDEX_KEY);
  if (!ids || ids.length === 0) return [];

  const results: AdminSessionInfo[] = [];
  const staleIds: string[] = [];

  for (const id of ids) {
    const raw = await redis.get<string>(sessionKey(id));
    if (!raw) {
      staleIds.push(id); // expired in Redis but index still references it
      continue;
    }
    results.push(
      typeof raw === "string"
        ? JSON.parse(raw)
        : (raw as unknown as AdminSessionInfo),
    );
  }

  if (staleIds.length > 0) {
    await redis.srem(INDEX_KEY, ...staleIds);
  }

  return results.sort((a, b) => b.lastSeenAt - a.lastSeenAt);
}

/** Sessions that have sent a heartbeat recently — i.e. genuinely "online now", not just "logged in at some point today". */
export function countOnline(sessions: AdminSessionInfo[]): number {
  const cutoff = Date.now() - ONLINE_WINDOW_SECONDS * 1000;
  return sessions.filter((s) => s.lastSeenAt >= cutoff).length;
}

export function isOnline(session: AdminSessionInfo): boolean {
  return session.lastSeenAt >= Date.now() - ONLINE_WINDOW_SECONDS * 1000;
}
