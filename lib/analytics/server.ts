// Server-side enrichment helpers used by the /api/track route.
// Deliberately dependency-free (no ua-parser-js) to keep this drop-in.

export interface ParsedUA {
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  device: "mobile" | "tablet" | "desktop";
}

export function parseUserAgent(ua: string | null): ParsedUA {
  const s = ua ?? "";

  let browser = "Unknown";
  let browserVersion = "";
  if (/Edg\//.test(s)) [browser, browserVersion] = ["Edge", match(s, /Edg\/([\d.]+)/)];
  else if (/OPR\//.test(s)) [browser, browserVersion] = ["Opera", match(s, /OPR\/([\d.]+)/)];
  else if (/Chrome\//.test(s)) [browser, browserVersion] = ["Chrome", match(s, /Chrome\/([\d.]+)/)];
  else if (/Firefox\//.test(s)) [browser, browserVersion] = ["Firefox", match(s, /Firefox\/([\d.]+)/)];
  else if (/Version\/.*Safari/.test(s)) [browser, browserVersion] = ["Safari", match(s, /Version\/([\d.]+)/)];

  let os = "Unknown";
  let osVersion = "";
  if (/Windows NT ([\d.]+)/.test(s)) [os, osVersion] = ["Windows", match(s, /Windows NT ([\d.]+)/)];
  else if (/Mac OS X ([\d_.]+)/.test(s)) [os, osVersion] = ["macOS", match(s, /Mac OS X ([\d_.]+)/).replace(/_/g, ".")];
  else if (/Android ([\d.]+)/.test(s)) [os, osVersion] = ["Android", match(s, /Android ([\d.]+)/)];
  else if (/iPhone OS ([\d_]+)/.test(s)) [os, osVersion] = ["iOS", match(s, /iPhone OS ([\d_]+)/).replace(/_/g, ".")];
  else if (/Linux/.test(s)) [os, osVersion] = ["Linux", ""];

  let device: ParsedUA["device"] = "desktop";
  if (/iPad|Tablet/.test(s)) device = "tablet";
  else if (/Mobi|iPhone|Android/.test(s)) device = "mobile";

  return { browser, browserVersion, os, osVersion, device };
}

function match(s: string, re: RegExp): string {
  const m = s.match(re);
  return m?.[1] ?? "";
}

export interface GeoInfo {
  country: string | null;
  city: string | null;
}

/** Reads Vercel's edge-injected geo headers. Falls back to nulls off-platform. */
export function geoFromHeaders(headers: Headers): GeoInfo {
  return {
    country: headers.get("x-vercel-ip-country") ?? null,
    city: headers.get("x-vercel-ip-city") ?? null,
  };
}

/**
 * Truncates an IP to /24 (IPv4) or /48 (IPv6) so you keep rough geo/abuse
 * signal without storing a precisely identifying address. Store this, not
 * the raw IP, unless you have a specific fraud/abuse reason and a retention
 * policy to match.
 */
export function anonymizeIp(ip: string | null): string | null {
  if (!ip) return null;
  if (ip.includes(":")) {
    return ip.split(":").slice(0, 3).join(":") + "::";
  }
  const parts = ip.split(".");
  if (parts.length === 4) {
    parts[3] = "0";
    return parts.join(".");
  }
  return null;
}

export function getClientIp(headers: Headers): string | null {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return headers.get("x-real-ip");
}
