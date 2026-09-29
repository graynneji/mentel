// lib/partner/auth.ts
//
// API-key auth for the partner-facing API (app/api/partner/v1/*).
// Key format: "mtl_live_<32 url-safe chars>". The first 16 characters after
// the prefix ("mtl_live_XXXXXXXXXXXXXXXX") are stored in the clear as
// `keyPrefix` for a fast indexed lookup; the full key is only ever verified
// against a bcrypt hash, and is shown to the partner exactly once at
// creation (see scripts/create-partner.ts). Losing the DB never leaks a
// usable key.

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import type { Partner } from "@/generated/prisma/client";

const KEY_PREFIX = "mtl_live_";
const PREFIX_LOOKUP_LENGTH = 16; // chars of the random part stored unhashed

export function generateApiKey(): {
  fullKey: string;
  keyPrefix: string;
} {
  const random = crypto.randomBytes(24).toString("base64url"); // 32 chars
  const fullKey = `${KEY_PREFIX}${random}`;
  const keyPrefix = fullKey.slice(0, KEY_PREFIX.length + PREFIX_LOOKUP_LENGTH);
  return { fullKey, keyPrefix };
}

export async function hashApiKey(fullKey: string): Promise<string> {
  return bcrypt.hash(fullKey, 12);
}

export type PartnerAuthResult =
  | { ok: true; partner: Partner }
  | { ok: false; status: number; code: string; message: string };

export async function authenticatePartner(
  req: NextRequest,
): Promise<PartnerAuthResult> {
  const header = req.headers.get("authorization") ?? "";
  const key = header.startsWith("Bearer ") ? header.slice(7).trim() : null;

  if (!key) {
    return {
      ok: false,
      status: 401,
      code: "missing_api_key",
      message: "Missing Authorization header. Expected: Bearer <api key>.",
    };
  }

  if (!key.startsWith(KEY_PREFIX)) {
    return {
      ok: false,
      status: 401,
      code: "invalid_api_key",
      message: "Malformed API key.",
    };
  }

  const lookupPrefix = key.slice(0, KEY_PREFIX.length + PREFIX_LOOKUP_LENGTH);

  const partner = await db.partner.findUnique({
    where: { keyPrefix: lookupPrefix },
  });

  if (!partner || partner.keyRevokedAt) {
    return {
      ok: false,
      status: 401,
      code: "invalid_api_key",
      message: "Invalid or revoked API key.",
    };
  }

  const valid = await bcrypt.compare(key, partner.keyHash);
  if (!valid) {
    return {
      ok: false,
      status: 401,
      code: "invalid_api_key",
      message: "Invalid or revoked API key.",
    };
  }

  if (partner.status !== "active") {
    return {
      ok: false,
      status: 403,
      code: "partner_suspended",
      message: `This partner account is ${partner.status}. Contact Mentel support.`,
    };
  }

  return { ok: true, partner };
}
