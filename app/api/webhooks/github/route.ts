// app/api/webhooks/github/route.ts
//
// A real webhook, in the literal sense: GitHub calls this URL the instant
// someone forks your repository, and hands you their actual GitHub
// identity (username, avatar, profile URL) — because forking is a GitHub
// action tied to a GitHub account, unlike an anonymous `git clone`.
//
// ── Important honesty note ───────────────────────────────────────────────
// A plain `git clone` of a public repo is, by design, completely anonymous
// — Git and GitHub don't (and can't) tell you who ran it, no IP, no
// identity, nothing. That's true of every public git host, not a Mentel
// limitation. What GitHub CAN tell you is:
//   - Forks (this webhook) — a real, attributable GitHub account, instantly
//   - Clone/traffic COUNTS (repo Insights → Traffic tab, or the Traffic
//     API) — a number, with zero identity, and only for the last 14 days
// If your repo is private, nobody can clone or fork it who isn't already
// a collaborator — so your collaborators list is the actual source of
// truth for "who has access," not this webhook.
//
// ── Setup ─────────────────────────────────────────────────────────────────
// 1. On GitHub: your repo → Settings → Webhooks → Add webhook
// 2. Payload URL: https://www.trymentel.com/api/webhooks/github
// 3. Content type: application/json
// 4. Secret: generate one (e.g. `openssl rand -hex 32`) and put it in your
//    .env as GITHUB_WEBHOOK_SECRET — GitHub signs every request with it,
//    so this route can verify the request genuinely came from GitHub.
// 5. "Which events would you like to trigger this webhook?" → Let me
//    select individual events → check "Forks" (and "Star" too, if you
//    also want to know about stars — handled below either way).

import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Mentel Security <hello@mail.trymentel.com>";
const TO = process.env.SECURITY_ALERT_EMAIL ?? "graynneji405@gmail.com";

function verifySignature(
  payload: string,
  signature: string | null,
  secret: string,
): boolean {
  if (!signature) return false;
  const expected =
    "sha256=" + createHmac("sha256", secret).update(payload).digest("hex");
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return false;
  return timingSafeEqual(sigBuf, expBuf);
}

export async function POST(req: Request) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    console.error(
      "[GitHub webhook] GITHUB_WEBHOOK_SECRET not set — rejecting to be safe.",
    );
    return NextResponse.json({ error: "Not configured" }, { status: 501 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-hub-signature-256");

  if (!verifySignature(rawBody, signature, secret)) {
    console.warn(
      "[GitHub webhook] Signature mismatch — request did not come from GitHub (or secret is wrong).",
    );
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = req.headers.get("x-github-event");
  const payload = JSON.parse(rawBody);

  try {
    if (event === "fork") {
      const forker = payload.sender;
      const forkee = payload.forkee;
      await resend.emails.send({
        from: FROM,
        to: [TO],
        subject: `🔱 Your repo "${payload.repository?.full_name}" was just forked`,
        html: `
          <div style="font-family:sans-serif;font-size:14px;color:#1c3a3a;max-width:520px;">
            <h2 style="font-size:16px;">Someone forked your repository</h2>
            <table style="border-collapse:collapse;">
              <tr><td style="padding:4px 12px 4px 0;color:#7a9088;">GitHub user</td><td><a href="${forker?.html_url}">${forker?.login}</a></td></tr>
              <tr><td style="padding:4px 12px 4px 0;color:#7a9088;">Their fork</td><td><a href="${forkee?.html_url}">${forkee?.full_name}</a></td></tr>
              <tr><td style="padding:4px 12px 4px 0;color:#7a9088;">Original repo</td><td>${payload.repository?.full_name}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;color:#7a9088;">Time</td><td>${new Date().toUTCString()}</td></tr>
            </table>
            <p style="color:#a0b8ac;font-size:12px;margin-top:16px;">
              Note: forking a public repo is normal GitHub behavior and isn't
              necessarily bad-faith copying — this is just visibility, not an accusation.
            </p>
          </div>
        `,
      });
    } else if (event === "star" && payload.action === "created") {
      // Optional — stars are a much weaker signal than forks, but cheap to include.
      await resend.emails.send({
        from: FROM,
        to: [TO],
        subject: `⭐ ${payload.sender?.login} starred ${payload.repository?.full_name}`,
        html: `<p style="font-family:sans-serif;font-size:14px;">
          <a href="${payload.sender?.html_url}">${payload.sender?.login}</a> starred your repo.
        </p>`,
      });
    }
    // Other event types (push, etc.) are ignored — add more `else if`
    // branches here if you configure additional events in the webhook.
  } catch (err) {
    console.error("[GitHub webhook] notification failed", err);
    // Still return 200 below — GitHub retries aggressively on non-2xx,
    // and a failed email shouldn't trigger repeated redelivery storms.
  }

  return NextResponse.json({ received: true });
}
