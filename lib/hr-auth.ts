// lib/hr-auth.ts
// HR authentication uses the company access code as credentials.
// No username/password — the access code IS the authentication.
// We store company_id in a signed JWT-style cookie.

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const HR_COOKIE = "mentel_hr_session";
const HR_SECRET = process.env.HR_SESSION_SECRET ?? "change-me-in-production";

// Simple HMAC-based session token (no JWT dependency needed)
// Format: base64(companyId + "." + timestamp) + "." + hmac
async function sign(payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(HR_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const sigBase64 = Buffer.from(sig).toString("base64url");
  return `${Buffer.from(payload).toString("base64url")}.${sigBase64}`;
}

async function verify(token: string): Promise<string | null> {
  try {
    const [payloadB64, sigB64] = token.split(".");
    if (!payloadB64 || !sigB64) return null;
    const payload = Buffer.from(payloadB64, "base64url").toString();
    const expected = await sign(payload);
    const [, expectedSig] = expected.split(".");
    if (sigB64 !== expectedSig) return null;
    return payload; // returns "companyId:timestamp"
  } catch {
    return null;
  }
}

export async function createHRSession(companyId: string): Promise<string> {
  const payload = `${companyId}:${Date.now()}`;
  return sign(payload);
}

export async function getHRSession(req?: NextRequest): Promise<string | null> {
  let token: string | undefined;
  if (req) {
    token = req.cookies.get(HR_COOKIE)?.value;
  } else {
    const cookieStore = await cookies();
    token = cookieStore.get(HR_COOKIE)?.value;
  }
  if (!token) return null;
  const payload = await verify(token);
  if (!payload) return null;
  const [companyId, tsStr] = payload.split(":");
  // Session expires after 24 hours
  const ts = parseInt(tsStr, 10);
  if (Date.now() - ts > 24 * 60 * 60 * 1000) return null;
  return companyId;
}

export function setHRCookie(res: NextResponse, token: string): void {
  res.cookies.set(HR_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/", // Change this from "/hr" to "/"
  });
}

export function clearHRCookie(res: NextResponse): void {
  // Ensure the path matches the one used to set it, otherwise it won't clear
  res.cookies.set(HR_COOKIE, "", { maxAge: 0, path: "/" });
}
