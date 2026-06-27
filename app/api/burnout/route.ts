import { NextResponse } from "next/server";
import { Resend } from "resend";
import { db } from "@/lib/db";
import { retryAsync } from "@/utilz";
import { after } from "next/server";
import { logger } from "@/lib/logger";
import { EVENTS } from "@/utilz";

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = "hello@mail.trymentel.com";
const FROM_EMAIL = "Mentel <hello@mail.trymentel.com>";
const WHATSAPP_URL = "https://wa.me/254734527573";
const TOTAL_QUESTIONS = 8;
const MAX_SCORE = TOTAL_QUESTIONS * 3; // 24

// ── Sanitizer ──────────────────────────────────────────────────────────────────
function s(str: unknown): string {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── Question labels ────────────────────────────────────────────────────────────
const questionLabels: Record<string, string> = {
  b1: "Emotional Exhaustion",
  b2: "Mental Fatigue",
  b3: "Motivation",
  b4: "Work-Related Stress",
  b5: "Recovery & Sleep",
  b6: "Cynicism & Detachment",
  b7: "Physical Symptoms",
  b8: "Productivity & Performance",
};

// ── Valid question keys ────────────────────────────────────────────────────────
const VALID_KEYS = new Set(Object.keys(questionLabels));

// ── Server-side score recalculation ───────────────────────────────────────────
// Never trust the client-sent score. Recalculate from answers.
function recalculateScore(answers: Record<string, number>): number {
  return Object.entries(answers)
    .filter(([k]) => VALID_KEYS.has(k))
    .reduce((sum, [, v]) => sum + v, 0);
}

// ── Band config ────────────────────────────────────────────────────────────────
interface BandConfig {
  band: string;
  severity: string;
  headline: string;
  color: string;
  accentColor: string;
  iconBg: string;
  hook: string;
  cliffhanger: string;
  tip: string;
  tipLabel: string;
  lockedLabel: string;
  lockedTeaser: string;
  therapistName: string;
  showUrgentResources: boolean;
}

function getBurnoutBand(score: number): BandConfig {
  if (score <= 5) {
    return {
      band: "Low Burnout Risk",
      severity: "Low Risk",
      headline: "You appear to be managing well",
      color: "#2d7a5a",
      accentColor: "#3d9e78",
      iconBg: "#d4ede0",
      hook: "Your stress levels appear manageable — but staying ahead of burnout is easier than recovering from it.",
      cliffhanger:
        "Your responses show one subtle pattern that high-functioning people often overlook. It rarely surfaces as a problem until cumulative pressure tips the scale. Knowing it now is the advantage.",
      tip: "Schedule a genuine 'off' period each week — no productivity, no catch-up. People with your profile who protect even 90 minutes of unstructured time weekly show measurably lower burnout markers over three months.",
      tipLabel: "One thing worth doing this week",
      lockedLabel: "Your Personal Burnout Prevention Blueprint",
      lockedTeaser:
        "We've identified the one low-grade pattern in your routine that slowly erodes resilience in people who score well on paper. Your full profile names it — and shows the 3-step protection sequence.",
      therapistName: "Dr. Amara Osei",
      showUrgentResources: false,
    };
  }
  if (score <= 10) {
    return {
      band: "Mild Burnout Signs",
      severity: "Mild Signs",
      headline: "Early signals worth paying attention to",
      color: "#3d7a45",
      accentColor: "#4e9a5a",
      iconBg: "#d4ead6",
      hook: "You're not burned out yet — but your responses carry signals that typically precede it.",
      cliffhanger:
        "Mild burnout signs are easy to rationalise as 'just a busy period.' The risk is that they compound quietly. There's one specific pattern in your answers that, if left unaddressed, tends to accelerate into the next stage faster than people expect.",
      tip: "Try a daily 10-minute 'energy audit': at the end of each day, note what drained you and what gave energy. Within two weeks, a clear pattern emerges — and that pattern is what determines whether this stays mild or compounds.",
      tipLabel: "One thing worth doing this week",
      lockedLabel: "Your Early Warning Pattern + Prevention Protocol",
      lockedTeaser:
        "We've mapped the specific compounding pattern in your responses — the one that separates people who stay mild from those who tip into burnout within 90 days. Your full profile names it and gives you the 3-step sequence to interrupt it.",
      therapistName: "Funke Adeyemi",
      showUrgentResources: false,
    };
  }
  if (score <= 15) {
    return {
      band: "Moderate Burnout",
      severity: "Moderate Burnout",
      headline: "Clear burnout indicators — real support recommended",
      color: "#4a8c3f",
      accentColor: "#5aaa4e",
      iconBg: "#d8ecd4",
      hook: "Your results suggest you're in active moderate burnout — not approaching it, already experiencing it.",
      cliffhanger:
        "There's a specific depletion cycle in your responses that doesn't respond to 'just taking a break.' Rest alone won't reset it. Understanding the actual driver is what changes the trajectory before it becomes harder to recover from.",
      tip: "Name the one responsibility you can legitimately reduce or delegate this week — not indefinitely, just this week. People in moderate burnout who take one concrete action to reduce load begin recovering measurably faster than those who wait for a 'right time'.",
      tipLabel: "One action for this week",
      lockedLabel: "Your Depletion Cycle Report + 3-Week Reset Protocol",
      lockedTeaser:
        "We've mapped the 3 specific habits in your daily routine actively feeding this cycle. Your full profile names each one — and shows the exact sequence to interrupt them before they compound further.",
      therapistName: "Emeka Nwachukwu",
      showUrgentResources: false,
    };
  }
  if (score <= 19) {
    return {
      band: "High Burnout Risk",
      severity: "High Risk",
      headline: "Significant burnout — please seek support",
      color: "#b07a1a",
      accentColor: "#c98e20",
      iconBg: "#f0e0b8",
      hook: "You're showing the hallmarks of high-level burnout — the fog, the detachment, the performance drop.",
      cliffhanger:
        "What you're experiencing is a predictable physiological response to sustained overload. The inability to recover even during rest, the reduced effectiveness, the cynicism — these are symptoms of a specific burnout stage that has a mapped recovery path. But it doesn't resolve on its own.",
      tip: "Tell one person today how you're actually doing — not the edited version. The act of being witnessed by even one trusted person activates a neurological shift that begins to interrupt the isolation that high burnout creates.",
      tipLabel: "One action for today",
      lockedLabel: "Your Burnout Stage + 30-Day Recovery Roadmap",
      lockedTeaser:
        "A licensed Mentel therapist has been flagged to review your profile. Your full report identifies which of the 4 burnout stages you're in — and maps the exact 30-day protocol our clinicians use at this stage.",
      therapistName: "Dr. Chioma Eze",
      showUrgentResources: false,
    };
  }
  return {
    band: "Severe Burnout",
    severity: "Severe — Act Now",
    headline: "You don't have to keep carrying this alone",
    color: "#a33030",
    accentColor: "#c03838",
    iconBg: "#f5dede",
    hook: "Your responses indicate severe burnout. What you're carrying right now is not sustainable.",
    cliffhanger:
      "People at this stage often describe feeling like they're watching themselves from a distance — still functioning on the outside, collapsing on the inside. The nervous system has been in overdrive for too long. This isn't about trying harder. It requires structured support, and it's available to you now.",
    tip: "Tell one person today how you're actually feeling — not the managed version. You don't need the right words. Letting someone in creates a neurological shift that changes the trajectory of the day.",
    tipLabel: "One thing to do today — not tomorrow",
    lockedLabel: "Your Severe Burnout Profile + Same-Week Session",
    lockedTeaser:
      "A licensed Mentel therapist has been flagged to review your profile directly. Your full report includes your specific burnout stage, the 3 primary drivers from your answers, and a same-week session option.",
    therapistName: "Dr. Chioma Eze",
    showUrgentResources: true,
  };
}

// ── Score bar (Gmail-safe) ─────────────────────────────────────────────────────
function scoreBar(value: number, max = 3, color = "#2d7a5a"): string {
  const pct = Math.round((value / max) * 100);
  return `<table width="100%" cellpadding="0" cellspacing="0"><tr>
    <td style="padding-right:10px;vertical-align:middle;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:99px;background:#e8eeea;"><tr>
        ${pct > 0 ? `<td width="${pct}%" height="7" style="height:7px;line-height:7px;font-size:0;background:${color};">&nbsp;</td>` : ""}
        ${100 - pct > 0 ? `<td width="${100 - pct}%" height="7" style="height:7px;line-height:7px;font-size:0;background:#e8eeea;">&nbsp;</td>` : ""}
      </tr></table>
    </td>
    <td width="32" style="vertical-align:middle;text-align:right;white-space:nowrap;">
      <span style="font-size:12px;color:#6b7c72;">${value}/${max}</span>
    </td>
  </tr></table>`;
}

// ── Urgent block ───────────────────────────────────────────────────────────────
const URGENT_BLOCK = `
<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border-radius:12px;border:1.5px solid #d97070;background:#fdf4f4;">
  <tr><td style="padding:18px 20px;">
    <p style="margin:0 0 8px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#b94a4f;font-weight:700;font-family:Georgia,serif;">If You Are in Immediate Distress</p>
    <p style="margin:0;font-size:14px;color:#3a2020;line-height:1.75;font-family:Georgia,serif;">
      If you feel unsafe right now, please reach out to someone you trust or visit your nearest hospital. You matter — help is available immediately.
    </p>
  </td></tr>
</table>`;

// ── User email HTML ────────────────────────────────────────────────────────────
function buildUserEmail(
  name: string,
  score: number,
  band: BandConfig,
  answers: Record<string, number>,
): string {
  const urgentBlock = band.showUrgentResources ? URGENT_BLOCK : "";
  const scorePct = Math.round((score / MAX_SCORE) * 100);

  const breakdownRows = Object.entries(answers)
    .filter(([k]) => VALID_KEYS.has(k))
    .sort((a, b) => b[1] - a[1])
    .map(
      ([k, v]) => `
      <tr>
        <td width="140" style="padding:9px 12px;border-bottom:1px solid #e8eeea;font-size:12px;color:#4a5e52;font-weight:500;vertical-align:middle;font-family:Georgia,serif;">
          ${questionLabels[k] ?? k}
        </td>
        <td style="padding:9px 12px;border-bottom:1px solid #e8eeea;vertical-align:middle;">
          ${scoreBar(v, 3, band.color)}
        </td>
      </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Your Burnout Score — Mentel</title></head>
<body style="margin:0;padding:0;background:#f5f7f5;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7f5;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

        <!-- Logo -->
        <tr>
          <td align="center" style="padding-bottom:20px;">
            <a href="https://trymentel.com" style="font-family:Georgia,serif;font-size:22px;font-weight:600;color:#1c2820;text-decoration:none;letter-spacing:-0.02em;">Mentel</a>
          </td>
        </tr>

        <!-- Hero banner -->
        <tr>
          <td style="background:${band.color};border-radius:20px 20px 0 0;padding:36px 32px 32px;text-align:center;">
            <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:3px;color:rgba(255,255,255,0.6);font-family:Georgia,serif;">Burnout Calculator Result</p>
            <p style="margin:0 0 4px;font-family:Georgia,serif;font-size:64px;font-weight:300;color:#ffffff;line-height:1;">${score}</p>
            <p style="margin:0 0 16px;font-size:13px;color:rgba(255,255,255,0.55);font-family:Georgia,serif;">out of ${MAX_SCORE}</p>
            <!-- Score bar -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;"><tr>
              <td style="background:rgba(255,255,255,0.15);border-radius:99px;height:8px;line-height:8px;font-size:0;">
                <table width="${scorePct}%" cellpadding="0" cellspacing="0"><tr>
                  <td style="background:rgba(255,255,255,0.7);border-radius:99px;height:8px;line-height:8px;font-size:0;">&nbsp;</td>
                </tr></table>
              </td>
            </tr></table>
            <p style="margin:0 0 6px;font-family:Georgia,serif;font-size:24px;font-weight:400;color:#ffffff;line-height:1.2;">${s(band.band)}</p>
            <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.65);font-family:Georgia,serif;">${s(band.severity)}${name ? ` · ${s(name)}` : ""}</p>
          </td>
        </tr>

        <!-- White body -->
        <tr>
          <td style="background:#ffffff;border-radius:0 0 20px 20px;padding:32px;border:1px solid #dde8e2;border-top:none;">

            ${urgentBlock}

            <!-- Hook -->
            <p style="margin:0 0 6px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:${band.color};font-weight:700;font-family:Georgia,serif;">What your score is telling us</p>
            <p style="margin:0 0 10px;font-family:Georgia,serif;font-size:20px;font-weight:400;color:#1c3a3a;line-height:1.3;">${s(band.hook)}</p>
            <p style="margin:0 0 24px;font-size:15px;color:#4a5e52;line-height:1.8;font-family:Georgia,serif;">${s(band.cliffhanger)}</p>

            <!-- Score breakdown -->
            <p style="margin:0 0 10px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:${band.color};font-weight:700;font-family:Georgia,serif;">Your Score Breakdown</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border-radius:12px;border:1px solid #e4ede7;">
              ${breakdownRows}
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" style="height:1px;background:#c8ddd2;margin-bottom:24px;"><tr><td></td></tr></table>

            <!-- Locked -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border-radius:14px;border:1px solid ${band.color}28;background:${band.iconBg}80;">
              <tr><td style="padding:20px 22px;">
                <p style="margin:0 0 6px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:${band.color};font-weight:700;font-family:Georgia,serif;">🔒 ${s(band.lockedLabel)}</p>
                <p style="margin:0 0 8px;font-size:15px;color:#2c3e35;line-height:1.7;font-family:Georgia,serif;">${s(band.lockedTeaser)}</p>
                <p style="margin:0;font-size:13px;color:${band.color};font-style:italic;font-family:Georgia,serif;">Unlocked in your free intro call.</p>
              </td></tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" style="height:1px;background:#c8ddd2;margin-bottom:24px;"><tr><td></td></tr></table>

            <!-- Tip -->
            <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:${band.color};font-weight:700;font-family:Georgia,serif;">${s(band.tipLabel)}</p>
            <p style="margin:0 0 24px;font-size:15px;color:#4a5e52;line-height:1.8;font-family:Georgia,serif;">${s(band.tip)}</p>

            <table width="100%" cellpadding="0" cellspacing="0" style="height:1px;background:#c8ddd2;margin-bottom:24px;"><tr><td></td></tr></table>

            <!-- Therapist + free call CTA -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:16px;border:1px solid ${band.color}30;background:${band.iconBg}60;margin-bottom:20px;">
              <tr><td style="padding:24px;">
                <p style="margin:0 0 6px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:${band.color};font-weight:700;font-family:Georgia,serif;">Your matched therapist</p>
                <p style="margin:0 0 4px;font-family:Georgia,serif;font-size:18px;font-weight:500;color:#1c3a3a;">${s(band.therapistName)}</p>
                <p style="margin:0 0 16px;font-size:13px;color:#6b7c72;font-family:Georgia,serif;">Licensed Mentel Therapist · Burnout specialist</p>
                <p style="margin:0 0 20px;font-size:14px;color:#2c3e35;line-height:1.7;font-family:Georgia,serif;">
                  <strong>Free 30-minute intro call</strong> — meet your therapist, understand your full burnout profile, and decide if you'd like to continue. No commitment required.
                </p>
                <table cellpadding="0" cellspacing="0"><tr>
                  <td>
                    <a href="${WHATSAPP_URL}?text=${encodeURIComponent(`Hello Mentel, I'd like to book my free intro call with ${band.therapistName}. My burnout score was ${score}/${MAX_SCORE} (${band.band}).`)}"
                      style="display:inline-block;background:${band.color};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:13px 28px;border-radius:99px;font-family:Georgia,serif;">
                      Book Free Intro Call
                    </a>
                  </td>
                </tr></table>
              </td></tr>
            </table>

            <p style="margin:0;font-size:13px;color:#8da898;text-align:center;font-family:Georgia,serif;">Questions? Reply to this email — we read every one.</p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 0;text-align:center;">
            <p style="margin:0 0 6px;font-size:11px;color:#aabdb3;font-family:Georgia,serif;">
              &copy; ${new Date().getFullYear()} Mentel &middot;
              <a href="https://trymentel.com/privacy" style="color:#7ba98b;text-decoration:none;">Privacy</a> &middot;
              <a href="https://trymentel.com/unsubscribe" style="color:#7ba98b;text-decoration:none;">Unsubscribe</a>
            </p>
            <p style="margin:0;font-size:10px;color:#c0cfc8;font-family:Georgia,serif;">
              This is for informational purposes only and is not a clinical diagnosis or medical advice.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body></html>`;
}

// ── Admin email HTML ───────────────────────────────────────────────────────────
function buildAdminEmail(
  name: string,
  email: string,
  phone: string,
  score: number,
  band: BandConfig,
  answers: Record<string, number>,
): string {
  const answerRows = Object.entries(answers)
    .filter(([k]) => VALID_KEYS.has(k))
    .map(
      ([k, v]) => `
      <tr>
        <td width="160" style="padding:9px 12px;border-bottom:1px solid #e8eeea;font-size:13px;color:#4a5e52;font-weight:500;font-family:Georgia,serif;">${questionLabels[k] ?? k}</td>
        <td style="padding:9px 12px;border-bottom:1px solid #e8eeea;">${scoreBar(v, 3, band.color)}</td>
      </tr>`,
    )
    .join("");

  const urgency = band.showUrgentResources
    ? "SEVERE — RESPOND SAME DAY"
    : score >= 16
      ? "High — Follow Up Within 4h"
      : score >= 11
        ? "Moderate — Follow Up Within 24h"
        : "Low/Mild — Standard Follow Up";
  const urgencyColor = band.showUrgentResources
    ? "#b94a4f"
    : score >= 16
      ? "#b97a30"
      : "#4e8c6a";

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f0f3f1;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f3f1;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
        <tr>
          <td style="background:linear-gradient(135deg,#1c3a3a,#2d5c47);border-radius:16px 16px 0 0;padding:20px 26px;">
            <table width="100%"><tr>
              <td><span style="font-size:17px;color:#fff;font-family:Georgia,serif;">Mentel Admin · Burnout Lead</span></td>
              <td style="text-align:right;"><span style="background:rgba(255,255,255,0.15);border-radius:99px;padding:4px 12px;font-size:10px;color:rgba(255,255,255,0.85);text-transform:uppercase;letter-spacing:1px;font-family:Georgia,serif;">New</span></td>
            </tr></table>
          </td>
        </tr>
        <tr>
          <td style="background:#fff;border-radius:0 0 16px 16px;padding:26px;border:1px solid #dde8e0;border-top:none;">
            <table width="100%" style="margin-bottom:20px;"><tr>
              <td><span style="background:${urgencyColor}20;color:${urgencyColor};border-radius:99px;padding:5px 14px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;font-family:Georgia,serif;">${urgency}</span></td>
              <td style="text-align:right;"><span style="background:${band.color};color:#fff;border-radius:10px;padding:7px 14px;font-size:13px;font-weight:600;font-family:Georgia,serif;">${s(band.band)} · ${score}/${MAX_SCORE}</span></td>
            </tr></table>

            <h3 style="margin:0 0 10px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#7ba98b;font-family:Georgia,serif;">Client</h3>
            <table width="100%" style="background:#f7faf8;border-radius:12px;border:1px solid #e4ede7;margin-bottom:20px;">
              <tr><td width="100" style="padding:10px 14px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;font-family:Georgia,serif;">Name</td><td style="padding:10px 14px;border-bottom:1px solid #e4ede7;font-size:14px;color:#1c3a3a;font-weight:600;font-family:Georgia,serif;">${s(name)}</td></tr>
              <tr><td style="padding:10px 14px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;font-family:Georgia,serif;">Email</td><td style="padding:10px 14px;border-bottom:1px solid #e4ede7;"><a href="mailto:${s(email)}" style="font-size:14px;color:#3d8b8b;text-decoration:none;font-family:Georgia,serif;">${s(email)}</a></td></tr>
              <tr><td style="padding:10px 14px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;font-family:Georgia,serif;">Phone</td><td style="padding:10px 14px;border-bottom:1px solid #e4ede7;font-size:14px;color:#1c3a3a;font-family:Georgia,serif;">${s(phone) || "—"}</td></tr>
              <tr><td style="padding:10px 14px;font-size:11px;color:#8da898;text-transform:uppercase;font-family:Georgia,serif;">Matched to</td><td style="padding:10px 14px;font-size:14px;color:#1c3a3a;font-family:Georgia,serif;">${s(band.therapistName)}</td></tr>
            </table>

            <h3 style="margin:0 0 10px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#7ba98b;font-family:Georgia,serif;">Dimension Breakdown</h3>
            <table width="100%" style="border-radius:12px;border:1px solid #e4ede7;margin-bottom:10px;">
              <tr style="background:#f7faf8;">
                <th width="160" style="padding:9px 12px;text-align:left;font-size:11px;color:#8da898;text-transform:uppercase;font-weight:500;font-family:Georgia,serif;">Dimension</th>
                <th style="padding:9px 12px;text-align:left;font-size:11px;color:#8da898;text-transform:uppercase;font-weight:500;font-family:Georgia,serif;">Score</th>
              </tr>
              ${answerRows}
            </table>
            <table width="100%" style="border-radius:10px;border:1px solid ${band.color}30;background:#f9fbf9;margin-bottom:24px;">
              <tr>
                <td style="padding:12px 16px;font-size:13px;color:#1c3a3a;font-weight:600;font-family:Georgia,serif;">Total Burnout Score</td>
                <td style="padding:12px 16px;text-align:right;"><span style="font-size:22px;font-weight:700;color:${band.color};font-family:Georgia,serif;">${score}</span><span style="font-size:13px;color:#8da898;font-family:Georgia,serif;"> / ${MAX_SCORE}</span></td>
              </tr>
            </table>
            <table width="100%"><tr><td align="center">
              <a href="mailto:${s(email)}" style="display:inline-block;background:linear-gradient(135deg,#1c3a3a,#3d8b8b);color:#fff;text-decoration:none;font-size:13px;font-weight:600;padding:11px 26px;border-radius:99px;font-family:Georgia,serif;">Reply to ${s(name)}</a>
            </td></tr></table>
          </td>
        </tr>
        <tr><td style="padding:16px 0;text-align:center;"><p style="margin:0;font-size:11px;color:#9aada3;font-family:Georgia,serif;">Mentel Admin · Burnout · Internal only</p></td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

// ── Plain text builders ────────────────────────────────────────────────────────
function buildUserText(
  name: string,
  score: number,
  band: BandConfig,
  answers: Record<string, number>,
): string {
  const breakdown = Object.entries(answers)
    .filter(([k]) => VALID_KEYS.has(k))
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `  ${questionLabels[k]}: ${v}/3`)
    .join("\n");

  return `Hi ${name},

Your Mentel Burnout Score: ${score} / ${MAX_SCORE}
Result: ${band.band}

WHAT YOUR SCORE IS TELLING YOU
${band.hook}

${band.cliffhanger}

YOUR BREAKDOWN
${breakdown}

${band.tipLabel.toUpperCase()}
${band.tip}

LOCKED: ${band.lockedLabel}
${band.lockedTeaser}
→ Unlocked in your free intro call.

YOUR MATCHED THERAPIST: ${band.therapistName}
Book your free 30-minute intro call: ${WHATSAPP_URL}

Questions? Reply to this email.

---
For informational purposes only. Not a clinical diagnosis.
© ${new Date().getFullYear()} Mentel · https://trymentel.com/privacy`;
}

function buildAdminText(
  name: string,
  email: string,
  phone: string,
  score: number,
  band: BandConfig,
  answers: Record<string, number>,
): string {
  const breakdown = Object.entries(answers)
    .filter(([k]) => VALID_KEYS.has(k))
    .map(([k, v]) => `  ${questionLabels[k]}: ${v}/3`)
    .join("\n");
  return `MENTEL BURNOUT LEAD
Band: ${band.band} · Score: ${score}/${MAX_SCORE}
Name: ${name} | Email: ${email} | Phone: ${phone || "—"}
Matched therapist: ${band.therapistName}

BREAKDOWN:
${breakdown}

Reply: mailto:${email}`;
}

// ── API Route ──────────────────────────────────────────────────────────────────
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: unknown = await req.json();
    const { name, email, phone, answers } = body as {
      name: unknown;
      email: unknown;
      phone: unknown;
      answers: unknown;
    };

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return NextResponse.json(
        { success: false, error: "Invalid email" },
        { status: 400 },
      );
    }
    if (!name || String(name).trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Invalid name" },
        { status: 400 },
      );
    }

    const safeName = s(name);
    const safeEmail = s(email);
    const safePhone = s(phone);

    // Sanitise answers — only burnout question keys (b1–b8), values 0–3
    const safeAnswers: Record<string, number> = {};
    for (const [k, v] of Object.entries(
      (answers as Record<string, unknown>) ?? {},
    )) {
      const n = Number(v);
      if (VALID_KEYS.has(k) && Number.isFinite(n)) {
        safeAnswers[k] = Math.max(0, Math.min(3, n));
      }
    }

    // Recalculate score server-side — never trust client
    const score = Math.min(recalculateScore(safeAnswers), MAX_SCORE);
    const band = getBurnoutBand(score);

    const userHtml = buildUserEmail(safeName, score, band, safeAnswers);
    const userText = buildUserText(safeName, score, band, safeAnswers);
    const adminHtml = buildAdminEmail(
      safeName,
      String(email),
      String(phone ?? ""),
      score,
      band,
      safeAnswers,
    );
    const adminText = buildAdminText(
      safeName,
      String(email),
      String(phone ?? ""),
      score,
      band,
      safeAnswers,
    );

    const [userResult] = await Promise.allSettled([
      resend.emails.send({
        from: FROM_EMAIL,
        to: [String(email)],
        subject: `Your Burnout Score: ${score}/${MAX_SCORE} — ${band.band}`,
        html: userHtml,
        text: userText,
      }),
      resend.emails.send({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject: `Burnout Lead: ${safeName} — ${band.band} (${score}pts)`,
        html: adminHtml,
        text: adminText,
        replyTo: String(email),
      }),
    ]);

    after(
      retryAsync(
        () =>
          db.lead.create({
            data: {
              name: safeName,
              email: String(email),
              phone: safePhone || null,
              score,
              band: band.band,
              severity: band.severity,
              answers: safeAnswers,
              status: "new",
              source: "burnout",
            },
          }),
        5,
        500,
      ).catch((err: unknown) =>
        console.error("[DB] Burnout lead save failed:", err),
      ),
    );

    logger.business(EVENTS.LEAD_CAPTURED, {
      meta: { email: safeEmail, name: safeName, score, source: "burnout", ip },
    });

    if (userResult.status === "rejected") {
      console.error("Burnout user email failed:", userResult.reason);
      return NextResponse.json(
        { success: false, error: "Email failed" },
        { status: 500 },
      );
    }

    logger.business(EVENTS.ASSESSMENT_COMPLETED, {
      meta: { email: safeEmail, score, band: band.band, source: "burnout", ip },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Burnout route error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}
