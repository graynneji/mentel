// lib/partner/session-link.ts
//
// Short-lived, single-beneficiary tokens for the hosted assessment+booking
// flow (app/partner-session/[token]). This is deliberately NOT the
// partner's API key: that key must never reach a beneficiary's browser
// (it's a bearer credential for the partner's whole account — putting it
// in client-side JS would leak it to anyone who opens devtools). Instead,
// a partner calls POST /beneficiaries/{externalRef}/session-link (with
// their real API key, server-to-server) to mint one of these per
// beneficiary session; that token is what goes in the link/iframe src.
//
// Scope is deliberately narrow: one partner, one beneficiary, short expiry
// (default 30 min), and the token itself is the only "auth" the hosted
// routes accept — verified server-side, never trusted from the client
// beyond that.

import { sign, verify, JwtPayload } from "jsonwebtoken";

// Fail closed: no hardcoded fallback secret. If PARTNER_SESSION_SECRET is
// missing, tokens can neither be issued nor verified (anyone knowing a
// default secret could forge a link for any beneficiary).
function getSecret(): string {
  const s = process.env.PARTNER_SESSION_SECRET;
  if (!s || s.length < 32) {
    throw new Error("PARTNER_SESSION_SECRET must be set (32+ chars) to use hosted partner sessions.");
  }
  return s;
}
const DEFAULT_TTL_SECONDS = 30 * 60;

export interface PartnerSessionTokenPayload {
  partnerId: string;
  beneficiaryId: string;
  externalRef: string;
  purpose: "partner_session";
}

export function issueSessionToken(
  payload: Omit<PartnerSessionTokenPayload, "purpose">,
  ttlSeconds: number = DEFAULT_TTL_SECONDS,
): { token: string; expiresAt: Date } {
  const token = sign({ ...payload, purpose: "partner_session" }, getSecret(), {
    expiresIn: ttlSeconds,
  });
  return { token, expiresAt: new Date(Date.now() + ttlSeconds * 1000) };
}

export type VerifyResult =
  | { ok: true; payload: PartnerSessionTokenPayload }
  | { ok: false; reason: "expired" | "invalid" };

export function verifySessionToken(token: string): VerifyResult {
  try {
    const decoded = verify(token, getSecret(), { algorithms: ["HS256"] }) as JwtPayload & PartnerSessionTokenPayload;
    if (decoded.purpose !== "partner_session") {
      return { ok: false, reason: "invalid" };
    }
    return {
      ok: true,
      payload: {
        partnerId: decoded.partnerId,
        beneficiaryId: decoded.beneficiaryId,
        externalRef: decoded.externalRef,
        purpose: "partner_session",
      },
    };
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("PARTNER_SESSION_SECRET")) throw err;
    const isExpired = err instanceof Error && err.name === "TokenExpiredError";
    return { ok: false, reason: isExpired ? "expired" : "invalid" };
  }
}

export function buildSessionLinkUrl(token: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://trymentel.com";
  return `${base}/partner-session/${token}`;
}

// Resolves a token to live DB records for the hosted-flow routes, re-checking
// partner status (a partner suspended after the link was issued shouldn't
// still let the link work) — the token proves the link was legitimately
// issued, not that it's still valid to act on.
export async function resolveSessionToken(token: string) {
  const result = verifySessionToken(token);
  if (!result.ok) return { ok: false as const, reason: result.reason };

  const { db } = await import("@/lib/db");
  const [partner, beneficiary] = await Promise.all([
    db.partner.findUnique({ where: { id: result.payload.partnerId } }),
    db.partnerBeneficiary.findUnique({ where: { id: result.payload.beneficiaryId } }),
  ]);

  if (!partner || partner.status !== "active" || !beneficiary || beneficiary.partnerId !== partner.id) {
    return { ok: false as const, reason: "invalid" as const };
  }

  return { ok: true as const, partner, beneficiary };
}
