// lib/captureFbc.ts
"use client";

export function captureFbcFromUrl() {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const fbclid = params.get("fbclid");
  if (!fbclid) return;

  // Meta's own _fbc format: fb.{subdomain_index}.{creation_time}.{fbclid}
  const fbc = `fb.1.${Date.now()}.${fbclid}`;

  // Only set if not already present — don't overwrite an existing valid _fbc
  const hasFbc = document.cookie.split("; ").some((c) => c.startsWith("_fbc="));

  if (!hasFbc) {
    document.cookie = `_fbc=${fbc}; path=/; max-age=${60 * 60 * 24 * 90}; SameSite=Lax`;
  }
}
