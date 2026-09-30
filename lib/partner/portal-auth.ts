// lib/partner/portal-auth.ts
//
// Auth for /partner-portal — a partner's own staff logging in with
// email + password (distinct from the API key, and distinct from a
// beneficiary's single-use hosted-session token). Session is a signed
// JWT in an httpOnly cookie, scoped to one partnerId + partnerUserId.

import { sign, verify } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import { db } from "@/lib/db";

const COOKIE_NAME = "mentel_partner_portal_session";
const SESSION_TTL_SECONDS = 12 * 60 * 60; // 12h

function getSecret(): string {
  const s = process.env.PARTNER_PORTAL_SESSION_SECRET;
  if (!s || s.length < 32) {
    throw new Error("PARTNER_PORTAL_SESSION_SECRET must be set (32+ chars) to use the partner portal.");
  }
  return s;
}

export const PARTNER_PORTAL_COOKIE = COOKIE_NAME;

export function issuePortalSessionCookie(partnerUserId: string, partnerId: string): { value: string; maxAge: number } {
  const token = sign({ partnerUserId, partnerId, purpose: "partner_portal" }, getSecret(), {
    expiresIn: SESSION_TTL_SECONDS,
    algorithm: "HS256",
  });
  return { value: token, maxAge: SESSION_TTL_SECONDS };
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export function generateTempPassword(): string {
  // Human-typeable, not ambiguous-character-heavy — this is shown once to
  // Gray to hand to the partner, who is required to change it on first login.
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < 14; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export type PortalAuthResult =
  | { ok: true; partnerId: string; partnerUserId: string }
  | { ok: false; status: number; code: string; message: string };

export async function requirePartnerPortalUser(req: NextRequest): Promise<PortalAuthResult> {
  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  if (!cookie) {
    return { ok: false, status: 401, code: "not_authenticated", message: "Please log in." };
  }
  try {
    const decoded = verify(cookie, getSecret(), { algorithms: ["HS256"] }) as {
      partnerUserId: string;
      partnerId: string;
      purpose: string;
    };
    if (decoded.purpose !== "partner_portal") {
      return { ok: false, status: 401, code: "not_authenticated", message: "Please log in." };
    }

    // Re-check the account and partner are still active on every request —
    // a revoked staff account or a suspended partner shouldn't keep working
    // for the lifetime of an already-issued 12h cookie.
    const [user, partner] = await Promise.all([
      db.partnerUser.findUnique({ where: { id: decoded.partnerUserId } }),
      db.partner.findUnique({ where: { id: decoded.partnerId } }),
    ]);
    if (!user || !partner || partner.status !== "active" || user.partnerId !== partner.id) {
      return { ok: false, status: 401, code: "not_authenticated", message: "Please log in again." };
    }

    return { ok: true, partnerId: decoded.partnerId, partnerUserId: decoded.partnerUserId };
  } catch {
    return { ok: false, status: 401, code: "not_authenticated", message: "Please log in." };
  }
}
