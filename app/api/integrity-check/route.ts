// app/api/integrity-check/route.ts
//
// Receives a small "phone home" ping from components/IntegrityBeacon.tsx,
// which is mounted on every page and calls this exact endpoint via an
// ABSOLUTE, hardcoded URL back to trymentel.com — so even if someone
// copies your entire rendered HTML/JS and hosts it on another domain,
// the browser executing that copied code still tries to reach this same
// endpoint, and reports what domain it's actually running on.
//
// ── What this can tell you ───────────────────────────────────────────────
// - That your front-end code is live on a domain that isn't yours
// - The IP address and browser of whoever is VISITING that clone right now
//   (not necessarily whoever created it — the clone's creator only shows
//   up here if they themselves load the page to check it)
// - Roughly how often it's being hit
//
// ── What this can't tell you ─────────────────────────────────────────────
// - Any identity ("who" cloned it) — there's no such thing as a "git
//   profile" for a scraped static site; that concept only applies to an
//   actual GitHub fork (see app/api/webhooks/github/route.ts for that)
// - Anything, if the person who cloned it notices and deletes this script
//   from their copy — a few minutes of effort defeats this entirely. This
//   catches lazy/naive clones, not a determined one.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";
import { shouldNotifyForHost } from "@/lib/security/clone-alerts";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Mentel Security <hello@mail.trymentel.com>";
const TO = process.env.SECURITY_ALERT_EMAIL ?? "graynneji405@gmail.com";

// Every hostname this site is legitimately expected to run on. Add any
// preview/staging domains (e.g. Vercel preview URLs) here too, or you'll
// get false-positive alerts every time you deploy a preview.
const ALLOWED_HOSTS = [
  "trymentel.com",
  "www.trymentel.com",
  "localhost",
  "127.0.0.1",
];

function isAllowedHost(host: string): boolean {
  const clean = host.toLowerCase().replace(/:\d+$/, ""); // strip port for localhost:3000 etc.
  if (ALLOWED_HOSTS.includes(clean)) return true;
  // Allow Vercel's own preview deployment domains for this project so
  // every preview/staging build doesn't fire a false alarm.
  if (clean.endsWith(".vercel.app")) return true;
  return false;
}

function getIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const host = String(body.host ?? "").trim();
    const pageUrl = String(body.url ?? "")
      .trim()
      .slice(0, 500);

    if (!host || isAllowedHost(host)) {
      // Normal visit to the real site — nothing to do.
      return NextResponse.json({ ok: true });
    }

    const ip = getIp(req);
    const userAgent = req.headers.get("user-agent") ?? "unknown";

    // Save every hit for the admin history view, even repeats — but only
    // email once per cloned domain per day, so this can't spam your inbox.
    try {
      await db.cloneAlert.create({
        data: { detectedHost: host, pageUrl, ip, userAgent },
      });
    } catch (err) {
      console.error("[integrity-check] failed to log clone alert", err);
    }

    const shouldEmail = await shouldNotifyForHost(host).catch(() => true);
    if (shouldEmail) {
      try {
        await resend.emails.send({
          from: FROM,
          to: [TO],
          subject: `⚠️ Your site's code appears to be running on ${host}`,
          html: `
            <div style="font-family:sans-serif;font-size:14px;color:#1c3a3a;max-width:520px;">
              <h2 style="font-size:16px;">Possible site clone detected</h2>
              <p>Your front-end code just phoned home from a domain that isn't yours.</p>
              <table style="border-collapse:collapse;">
                <tr><td style="padding:4px 12px 4px 0;color:#7a9088;">Detected on</td><td><strong>${host}</strong></td></tr>
                <tr><td style="padding:4px 12px 4px 0;color:#7a9088;">Page</td><td>${pageUrl}</td></tr>
                <tr><td style="padding:4px 12px 4px 0;color:#7a9088;">Visitor IP</td><td>${ip}</td></tr>
                <tr><td style="padding:4px 12px 4px 0;color:#7a9088;">Browser</td><td>${userAgent}</td></tr>
                <tr><td style="padding:4px 12px 4px 0;color:#7a9088;">Time</td><td>${new Date().toUTCString()}</td></tr>
              </table>
              <p style="color:#a0b8ac;font-size:12px;margin-top:16px;">
                This is the IP of whoever is currently viewing that page, not necessarily
                whoever copied the code. You won't get another email for this same domain
                for 24 hours — check /admin/security for the full history.
              </p>
            </div>
          `,
        });
      } catch (err) {
        console.error("[integrity-check] notification email failed", err);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[integrity-check]", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
