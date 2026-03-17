// import { NextResponse } from "next/server";
// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// const ADMIN_EMAIL = "graynneji405@gmail.com";
// const FROM_EMAIL = "Mentel <onboarding@resend.dev>";
// const BOOKING_URL = "https://trymentel.com/#book";

// // ── Score band helper ──────────────────────────────────────────────────────────
// function getBand(score: number) {
//   if (score <= 6)
//     return {
//       band: "Thriving",
//       headline: "You're in a good place",
//       color: "#4e8c6a",
//       accentColor: "#7ba98b",
//       emoji: "🌿",
//       summary:
//         "Your responses suggest you're managing well overall. Many people reach out proactively to build resilience, develop self-awareness, or navigate life transitions — therapy can be valuable even when you're not in crisis.",
//       cta: "Explore Proactive Therapy",
//     };
//   if (score <= 12)
//     return {
//       band: "Mild Concern",
//       headline: "Some areas could use support",
//       color: "#3d8b8b",
//       accentColor: "#6fb8b8",
//       emoji: "🌤",
//       summary:
//         "Your responses suggest you're experiencing some difficulties worth exploring. A therapist can help you build practical tools and understand patterns before they become harder to manage.",
//       cta: "Book a Free Consultation",
//     };
//   if (score <= 18)
//     return {
//       band: "Moderate",
//       headline: "You deserve real support",
//       color: "#4e7a5e",
//       accentColor: "#3d8b8b",
//       emoji: "🌱",
//       summary:
//         "Your responses suggest you're going through a genuinely difficult time. You're not alone — what you're feeling is valid, and speaking with a licensed therapist can make a significant difference.",
//       cta: "Book Your First Session",
//     };
//   return {
//     band: "High Concern",
//     headline: "Please reach out — you matter",
//     color: "#b94a4f",
//     accentColor: "#d97070",
//     emoji: "💛",
//     summary:
//       "Your responses suggest you're struggling significantly. We strongly encourage you to speak with a professional as soon as possible. Our therapists are here for you, without judgment.",
//     cta: "Get Urgent Support",
//   };
// }

// const questionLabels: Record<string, string> = {
//   q1: "Mood",
//   q2: "Anxiety",
//   q3: "Energy",
//   q4: "Sleep",
//   q5: "Relationships",
//   q6: "Stress",
//   q7: "Self-worth",
//   q8: "Support needed",
// };

// // ── Gmail-safe score bar — 100% table-based, zero flexbox/divs ────────────────
// // Gmail strips all display:flex, display:inline-flex, and ignores div widths.
// // We use a two-cell <table> row: left cell = progress track, right cell = label.
// // The track itself is another nested table — filled cell + empty cell = the bar.
// function scoreBar(value: number, max = 3): string {
//   const pct = Math.round((value / max) * 100);
//   const emptyPct = 100 - pct;
//   return `<table width="100%" cellpadding="0" cellspacing="0"><tr>
//     <td style="padding-right:10px;vertical-align:middle;">
//       <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:99px;overflow:hidden;background:#e8eeea;"><tr>
//         <td width="${pct}%" height="8" style="height:8px;line-height:8px;font-size:0;background:linear-gradient(90deg,#7ba98b,#3d8b8b);">&nbsp;</td>${
//           emptyPct > 0
//             ? `<td width="${emptyPct}%" height="8" style="height:8px;line-height:8px;font-size:0;background:#e8eeea;">&nbsp;</td>`
//             : ""
//         }
//       </tr></table>
//     </td>
//     <td width="32" style="vertical-align:middle;text-align:right;white-space:nowrap;">
//       <span style="font-size:12px;color:#6b7c72;">${value}/${max}</span>
//     </td>
//   </tr></table>`;
// }

// // ── USER EMAIL ─────────────────────────────────────────────────────────────────
// function buildUserEmail(
//   name: string,
//   score: number,
//   band: ReturnType<typeof getBand>,
//   answers: Record<string, number>,
//   totalQuestions: number,
// ): string {
//   const answerRows = Object.entries(answers)
//     .map(
//       ([qId, val]) => `
//       <tr>
//         <td width="120" style="padding:11px 12px 11px 0;border-bottom:1px solid #e8eeea;vertical-align:middle;">
//           <span style="font-size:13px;color:#4a5e52;font-weight:600;">${questionLabels[qId] ?? qId}</span>
//         </td>
//         <td style="padding:11px 0;border-bottom:1px solid #e8eeea;vertical-align:middle;">
//           ${scoreBar(val)}
//         </td>
//       </tr>`,
//     )
//     .join("");

//   // Numbered steps — nested table instead of inline-flex div
//   const stepItems = [
//     "A therapist will review your results and reach out within 24 hours",
//     "Your first consultation is completely free and judgment-free",
//     "All your data is confidential and never shared",
//   ];
//   const stepRows = stepItems
//     .map(
//       (item, i) => `
//     <tr>
//       <td width="32" style="padding:8px 0;vertical-align:top;">
//         <table cellpadding="0" cellspacing="0"><tr>
//           <td width="22" height="22" align="center" valign="middle"
//             style="width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,#7ba98b,#3d8b8b);text-align:center;vertical-align:middle;">
//             <span style="font-size:10px;color:#fff;font-weight:bold;line-height:22px;font-family:Georgia,serif;">${i + 1}</span>
//           </td>
//         </tr></table>
//       </td>
//       <td style="padding:8px 0 8px 10px;vertical-align:middle;">
//         <span style="font-size:14px;color:#5a7264;line-height:1.6;">${item}</span>
//       </td>
//     </tr>`,
//     )
//     .join("");

//   return `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8"/>
//   <meta name="viewport" content="width=device-width,initial-scale=1"/>
//   <title>Your Mentel Assessment Results</title>
// </head>
// <body style="margin:0;padding:0;background:#f4f7f5;font-family:Georgia,serif;">

//   <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f5;padding:40px 16px;">
//     <tr><td align="center">
//       <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

//         <!-- Logo header -->
//         <tr>
//           <td align="center" style="padding-bottom:28px;">
//             <table cellpadding="0" cellspacing="0"><tr>
//               <td width="32" height="32" align="center" valign="middle"
//                 style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#7ba98b,#3d8b8b);font-size:0;line-height:0;">&nbsp;</td>
//               <td style="padding-left:8px;vertical-align:middle;">
//                 <span style="font-family:Georgia,serif;font-size:22px;color:#2a3d30;letter-spacing:-0.5px;">Mentel</span>
//               </td>
//             </tr></table>
//           </td>
//         </tr>

//         <!-- Hero score card -->
//         <tr>
//           <td align="center" style="background:linear-gradient(135deg,${band.color},${band.accentColor});border-radius:24px 24px 0 0;padding:40px 32px 32px;">
//             <p style="margin:0 0 6px;font-size:36px;line-height:1;">${band.emoji}</p>
//             <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:3px;color:rgba(255,255,255,0.75);font-family:Georgia,serif;">Your Wellbeing Assessment</p>
//             <h1 style="margin:0 0 12px;font-family:Georgia,serif;font-size:36px;font-weight:400;color:#fff;line-height:1.2;">${band.band}</h1>
//             <table cellpadding="0" cellspacing="0" align="center"><tr>
//               <td style="background:rgba(255,255,255,0.2);border-radius:99px;padding:6px 20px;">
//                 <span style="font-size:14px;color:rgba(255,255,255,0.95);font-family:Georgia,serif;">Score: <strong>${score}</strong> / ${totalQuestions * 3}</span>
//               </td>
//             </tr></table>
//           </td>
//         </tr>

//         <!-- White content card -->
//         <tr>
//           <td style="background:#fff;border-radius:0 0 24px 24px;padding:32px;border:1px solid #e0ebe4;border-top:none;">

//             <h2 style="margin:0 0 12px;font-family:Georgia,serif;font-size:24px;font-weight:400;color:#2a3d30;">
//               ${band.headline}${name ? `, ${name}` : ""}
//             </h2>
//             <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#5a7264;">
//               ${band.summary}
//             </p>

//             <!-- Divider -->
//             <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
//               <tr><td style="height:1px;background:#c8ddd1;font-size:0;line-height:0;">&nbsp;</td></tr>
//             </table>

//             <!-- Score breakdown -->
//             <h3 style="margin:0 0 16px;font-size:12px;text-transform:uppercase;letter-spacing:2px;color:#7ba98b;font-family:Georgia,serif;">Your Breakdown</h3>
//             <table width="100%" cellpadding="0" cellspacing="0">
//               ${answerRows}
//             </table>

//             <!-- Divider -->
//             <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
//               <tr><td style="height:1px;background:#c8ddd1;font-size:0;line-height:0;">&nbsp;</td></tr>
//             </table>

//             <!-- What happens next -->
//             <h3 style="margin:0 0 16px;font-size:12px;text-transform:uppercase;letter-spacing:2px;color:#7ba98b;font-family:Georgia,serif;">What Happens Next</h3>
//             <table cellpadding="0" cellspacing="0" width="100%">
//               ${stepRows}
//             </table>

//             <!-- CTA button -->
//             <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
//               <tr><td align="center">
//                 <a href="${BOOKING_URL}"
//                   style="display:inline-block;background:linear-gradient(135deg,#4e7a5e,#3d8b8b);color:#fff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 36px;border-radius:99px;letter-spacing:0.3px;font-family:Georgia,serif;">
//                   ${band.cta} &rarr;
//                 </a>
//               </td></tr>
//             </table>

//           </td>
//         </tr>

//         <!-- Footer -->
//         <tr>
//           <td style="padding:28px 16px;text-align:center;">
//             <p style="margin:0 0 8px;font-size:12px;color:#8da898;font-family:Georgia,serif;">
//               This is not a clinical diagnosis. If you are in crisis, please contact emergency services immediately.
//             </p>
//             <p style="margin:0;font-size:11px;color:#aabdb3;font-family:Georgia,serif;">
//               &copy; ${new Date().getFullYear()} Mentel &middot;
//               <a href="https://trymentel.com/privacy" style="color:#7ba98b;text-decoration:none;">Privacy Policy</a>
//               &middot;
//               <a href="https://trymentel.com/unsubscribe" style="color:#7ba98b;text-decoration:none;">Unsubscribe</a>
//             </p>
//           </td>
//         </tr>

//       </table>
//     </td></tr>
//   </table>
// </body>
// </html>`;
// }

// // ── ADMIN EMAIL ────────────────────────────────────────────────────────────────
// function buildAdminEmail(
//   name: string,
//   email: string,
//   phone: string,
//   score: number,
//   band: ReturnType<typeof getBand>,
//   answers: Record<string, number>,
//   totalQuestions: number,
// ): string {
//   const answerRows = Object.entries(answers)
//     .map(
//       ([qId, val]) => `
//       <tr>
//         <td width="120" style="padding:10px 12px;border-bottom:1px solid #e8eeea;font-size:13px;color:#4a5e52;font-weight:600;vertical-align:middle;">${questionLabels[qId] ?? qId}</td>
//         <td style="padding:10px 12px;border-bottom:1px solid #e8eeea;vertical-align:middle;">${scoreBar(val)}</td>
//         <td width="40" style="padding:10px 12px;border-bottom:1px solid #e8eeea;text-align:right;font-size:13px;color:#6b7c72;vertical-align:middle;">${val}/3</td>
//       </tr>`,
//     )
//     .join("");

//   // Urgency badge — table cell based, no wrapping div
//   const urgencyStyles =
//     score >= 19
//       ? "background:#fde8e8;color:#b94a4f;"
//       : score >= 13
//         ? "background:#fdf3e8;color:#b97a30;"
//         : "background:#edf7f1;color:#4e8c6a;";
//   const urgencyText =
//     score >= 19
//       ? "&#9888; High Concern &mdash; Follow Up Urgently"
//       : score >= 13
//         ? "Follow Up Within 24h"
//         : "Standard Follow Up";

//   return `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8"/>
//   <meta name="viewport" content="width=device-width,initial-scale=1"/>
//   <title>New Assessment &mdash; Mentel Admin</title>
// </head>
// <body style="margin:0;padding:0;background:#f0f3f1;font-family:Georgia,serif;">

//   <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f3f1;padding:40px 16px;">
//     <tr><td align="center">
//       <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

//         <!-- Admin header bar -->
//         <tr>
//           <td style="background:linear-gradient(135deg,#2a3d30,#3d5c47);border-radius:20px 20px 0 0;padding:22px 28px;">
//             <table cellpadding="0" cellspacing="0"><tr>
//               <td width="28" height="28" style="width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.2);font-size:0;">&nbsp;</td>
//               <td style="padding-left:10px;vertical-align:middle;">
//                 <span style="font-family:Georgia,serif;font-size:18px;color:#fff;">Mentel Admin</span>
//               </td>
//               <td style="padding-left:10px;vertical-align:middle;">
//                 <table cellpadding="0" cellspacing="0"><tr>
//                   <td style="background:rgba(255,255,255,0.15);border-radius:99px;padding:3px 10px;">
//                     <span style="font-size:10px;color:rgba(255,255,255,0.85);text-transform:uppercase;letter-spacing:1px;">New Lead</span>
//                   </td>
//                 </tr></table>
//               </td>
//             </tr></table>
//           </td>
//         </tr>

//         <!-- White body -->
//         <tr>
//           <td style="background:#fff;border-radius:0 0 20px 20px;padding:28px;border:1px solid #dde8e0;border-top:none;">

//             <!-- Urgency + score row — two-column table -->
//             <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;"><tr>
//               <td style="vertical-align:middle;">
//                 <table cellpadding="0" cellspacing="0"><tr>
//                   <td style="${urgencyStyles}border-radius:99px;padding:5px 12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;white-space:nowrap;">
//                     ${urgencyText}
//                   </td>
//                 </tr></table>
//               </td>
//               <td style="text-align:right;vertical-align:middle;">
//                 <table cellpadding="0" cellspacing="0" align="right"><tr>
//                   <td style="background:linear-gradient(135deg,${band.color},${band.accentColor});border-radius:10px;padding:8px 16px;">
//                     <span style="font-size:13px;color:#fff;font-weight:600;white-space:nowrap;">${band.band} &middot; ${score}/${totalQuestions * 3}</span>
//                   </td>
//                 </tr></table>
//               </td>
//             </tr></table>

//             <!-- Client info -->
//             <h3 style="margin:0 0 12px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#7ba98b;font-family:Georgia,serif;">Client Information</h3>
//             <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7faf8;border-radius:12px;border:1px solid #e4ede7;margin-bottom:24px;">
//               <tr>
//                 <td width="110" style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;">Name</td>
//                 <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:14px;color:#2a3d30;font-weight:600;">${name}</td>
//               </tr>
//               <tr>
//                 <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;">Email</td>
//                 <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;">
//                   <a href="mailto:${email}" style="font-size:14px;color:#3d8b8b;text-decoration:none;font-weight:500;">${email}</a>
//                 </td>
//               </tr>
//               <tr>
//                 <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;">Phone</td>
//                 <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:14px;color:#2a3d30;">${phone || "—"}</td>
//               </tr>
//               <tr>
//                 <td style="padding:12px 16px;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;">Submitted</td>
//                 <td style="padding:12px 16px;font-size:14px;color:#2a3d30;">${new Date().toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short" })}</td>
//               </tr>
//             </table>

//             <!-- Answer breakdown -->
//             <h3 style="margin:0 0 12px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#7ba98b;font-family:Georgia,serif;">Answer Breakdown</h3>
//             <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;border:1px solid #e4ede7;">
//               <tr style="background:#f7faf8;">
//                 <th width="120" style="padding:10px 12px;text-align:left;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;font-weight:500;">Category</th>
//                 <th style="padding:10px 12px;text-align:left;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;font-weight:500;">Score</th>
//                 <th width="40" style="padding:10px 12px;text-align:right;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;font-weight:500;">Val</th>
//               </tr>
//               ${answerRows}
//             </table>

//             <!-- Total score — table two-column -->
//             <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;border-radius:12px;border:1px solid ${band.color}30;background:#f9fbf9;">
//               <tr>
//                 <td style="padding:14px 18px;font-size:13px;color:#2a3d30;font-weight:600;">Total Score</td>
//                 <td style="padding:14px 18px;text-align:right;">
//                   <span style="font-size:20px;font-weight:700;color:${band.color};">${score}</span>
//                   <span style="font-size:13px;color:#8da898;font-weight:400;"> / ${totalQuestions * 3}</span>
//                 </td>
//               </tr>
//             </table>

//             <!-- Reply button -->
//             <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
//               <tr><td align="center">
//                 <a href="mailto:${email}?subject=Your%20Mentel%20Results%20%E2%80%94%20Let%27s%20Talk&body=Hi%20${encodeURIComponent(name)}%2C%0D%0A%0D%0AThank%20you%20for%20completing%20our%20wellbeing%20assessment..."
//                   style="display:inline-block;background:linear-gradient(135deg,#4e7a5e,#3d8b8b);color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:99px;font-family:Georgia,serif;">
//                   Reply to ${name} &rarr;
//                 </a>
//               </td></tr>
//             </table>

//           </td>
//         </tr>

//         <!-- Footer -->
//         <tr>
//           <td style="padding:20px 0;text-align:center;">
//             <p style="margin:0;font-size:11px;color:#9aada3;font-family:Georgia,serif;">
//               Mentel Admin Dashboard &middot; This email is for internal use only.
//             </p>
//           </td>
//         </tr>

//       </table>
//     </td></tr>
//   </table>
// </body>
// </html>`;
// }

// // ── API Route ──────────────────────────────────────────────────────────────────
// export async function POST(req: Request) {
//   try {
//     const { name, email, phone, score, answers } = await req.json();

//     const totalQuestions = Object.keys(answers ?? {}).length || 8;
//     const band = getBand(score ?? 0);

//     const userHtml = buildUserEmail(
//       name,
//       score,
//       band,
//       answers ?? {},
//       totalQuestions,
//     );
//     const adminHtml = buildAdminEmail(
//       name,
//       email,
//       phone,
//       score,
//       band,
//       answers ?? {},
//       totalQuestions,
//     );

//     await Promise.all([
//       resend.emails.send({
//         from: FROM_EMAIL,
//         to: [email],
//         subject: `${band.emoji} Your Mentel Wellbeing Results — ${band.band}`,
//         html: userHtml,
//       }),
//       resend.emails.send({
//         from: FROM_EMAIL,
//         to: [ADMIN_EMAIL],
//         subject: `🌿 New Assessment: ${name} · ${band.band} (${score}pts)`,
//         html: adminHtml,
//         replyTo: email,
//       }),
//     ]);

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Assessment email error:", error);
//     return NextResponse.json(
//       { success: false, error: String(error) },
//       { status: 500 },
//     );
//   }
// }

import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = "graynneji405@gmail.com";
const FROM_EMAIL = "Mentel <onboarding@resend.dev>";
const BOOKING_URL = "https://trymentel.com/#book";
const TOTAL_QUESTIONS = 8; // hardcoded — never derived from answers length

// ── HTML sanitizer — prevents name/email breaking email layout ─────────────────
function s(str: unknown): string {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── Score band helper ──────────────────────────────────────────────────────────
function getBand(score: number) {
  if (score <= 6)
    return {
      band: "Thriving",
      headline: "You're in a good place",
      color: "#4e8c6a",
      accentColor: "#7ba98b",
      emoji: "🌿",
      summary:
        "Your responses suggest you're managing well overall. Many people reach out proactively to build resilience, develop self-awareness, or navigate life transitions — therapy can be valuable even when you're not in crisis.",
      cta: "Explore Proactive Therapy",
    };
  if (score <= 12)
    return {
      band: "Mild Concern",
      headline: "Some areas could use support",
      color: "#3d8b8b",
      accentColor: "#6fb8b8",
      emoji: "🌤",
      summary:
        "Your responses suggest you're experiencing some difficulties worth exploring. A therapist can help you build practical tools and understand patterns before they become harder to manage.",
      cta: "Book a Free Consultation",
    };
  if (score <= 18)
    return {
      band: "Moderate",
      headline: "You deserve real support",
      color: "#4e7a5e",
      accentColor: "#3d8b8b",
      emoji: "🌱",
      summary:
        "Your responses suggest you're going through a genuinely difficult time. You're not alone — what you're feeling is valid, and speaking with a licensed therapist can make a significant difference.",
      cta: "Book Your First Session",
    };
  return {
    band: "High Concern",
    headline: "Please reach out — you matter",
    color: "#b94a4f",
    accentColor: "#d97070",
    emoji: "💛",
    summary:
      "Your responses suggest you're struggling significantly. We strongly encourage you to speak with a professional as soon as possible. Our therapists are here for you, without judgment.",
    cta: "Get Urgent Support",
  };
}

const questionLabels: Record<string, string> = {
  q1: "Mood",
  q2: "Anxiety",
  q3: "Energy",
  q4: "Sleep",
  q5: "Relationships",
  q6: "Stress",
  q7: "Self-worth",
  q8: "Support needed",
};

// ── Gmail-safe score bar — 100% table-based, zero flexbox/divs ────────────────
// pct=0 edge case: skip the filled cell entirely so Outlook doesn't render a phantom pixel.
// Always render the empty background cell so the track has full width.
function scoreBar(value: number, max = 3): string {
  const pct = Math.round((value / max) * 100);
  const emptyPct = 100 - pct;
  return `<table width="100%" cellpadding="0" cellspacing="0"><tr>
    <td style="padding-right:10px;vertical-align:middle;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:99px;overflow:hidden;background:#e8eeea;"><tr>
        ${pct > 0 ? `<td width="${pct}%" height="8" style="height:8px;line-height:8px;font-size:0;background:linear-gradient(90deg,#7ba98b,#3d8b8b);">&nbsp;</td>` : ""}
        ${emptyPct > 0 ? `<td width="${emptyPct}%" height="8" style="height:8px;line-height:8px;font-size:0;background:#e8eeea;">&nbsp;</td>` : ""}
      </tr></table>
    </td>
    <td width="32" style="vertical-align:middle;text-align:right;white-space:nowrap;">
      <span style="font-size:12px;color:#6b7c72;">${value}/${max}</span>
    </td>
  </tr></table>`;
}

// ── USER EMAIL ─────────────────────────────────────────────────────────────────
function buildUserEmail(
  name: string,
  score: number,
  band: ReturnType<typeof getBand>,
  answers: Record<string, number>,
): string {
  const answerRows = Object.entries(answers)
    .map(
      ([qId, val]) => `
      <tr>
        <td width="120" style="padding:11px 12px 11px 0;border-bottom:1px solid #e8eeea;vertical-align:middle;">
          <span style="font-size:13px;color:#4a5e52;font-weight:600;">${questionLabels[qId] ?? s(qId)}</span>
        </td>
        <td style="padding:11px 0;border-bottom:1px solid #e8eeea;vertical-align:middle;">
          ${scoreBar(val)}
        </td>
      </tr>`,
    )
    .join("");

  const stepItems = [
    "A therapist will review your results and reach out within 24 hours",
    "Your first consultation is completely free and judgment-free",
    "All your data is confidential and never shared",
  ];
  const stepRows = stepItems
    .map(
      (item, i) => `
    <tr>
      <td width="32" style="padding:8px 0;vertical-align:top;">
        <table cellpadding="0" cellspacing="0"><tr>
          <td width="22" height="22" align="center" valign="middle"
            style="width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,#7ba98b,#3d8b8b);text-align:center;vertical-align:middle;">
            <span style="font-size:10px;color:#fff;font-weight:bold;line-height:22px;font-family:Georgia,serif;">${i + 1}</span>
          </td>
        </tr></table>
      </td>
      <td style="padding:8px 0 8px 10px;vertical-align:middle;">
        <span style="font-size:14px;color:#5a7264;line-height:1.6;">${item}</span>
      </td>
    </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Your Mentel Assessment Results</title>
</head>
<body style="margin:0;padding:0;background:#f4f7f5;font-family:Georgia,serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f5;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

        <!-- Logo header -->
        <tr>
          <td align="center" style="padding-bottom:28px;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td width="32" height="32" align="center" valign="middle"
                style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#7ba98b,#3d8b8b);font-size:0;line-height:0;">&nbsp;</td>
              <td style="padding-left:8px;vertical-align:middle;">
                <span style="font-family:Georgia,serif;font-size:22px;color:#2a3d30;letter-spacing:-0.5px;">Mentel</span>
              </td>
            </tr></table>
          </td>
        </tr>

        <!-- Hero score card -->
        <tr>
          <td align="center" style="background:linear-gradient(135deg,${band.color},${band.accentColor});border-radius:24px 24px 0 0;padding:40px 32px 32px;">
            <p style="margin:0 0 6px;font-size:36px;line-height:1;">${band.emoji}</p>
            <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:3px;color:rgba(255,255,255,0.75);font-family:Georgia,serif;">Your Wellbeing Assessment</p>
            <h1 style="margin:0 0 12px;font-family:Georgia,serif;font-size:36px;font-weight:400;color:#fff;line-height:1.2;">${band.band}</h1>
            <table cellpadding="0" cellspacing="0" align="center"><tr>
              <td style="background:rgba(255,255,255,0.2);border-radius:99px;padding:6px 20px;">
                <span style="font-size:14px;color:rgba(255,255,255,0.95);font-family:Georgia,serif;">Score: <strong>${score}</strong> / ${TOTAL_QUESTIONS * 3}</span>
              </td>
            </tr></table>
          </td>
        </tr>

        <!-- White content card -->
        <tr>
          <td style="background:#fff;border-radius:0 0 24px 24px;padding:32px;border:1px solid #e0ebe4;border-top:none;">

            <h2 style="margin:0 0 12px;font-family:Georgia,serif;font-size:24px;font-weight:400;color:#2a3d30;">
              ${band.headline}${name ? `, ${name}` : ""}
            </h2>
            <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#5a7264;">
              ${band.summary}
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr><td style="height:1px;background:#c8ddd1;font-size:0;line-height:0;">&nbsp;</td></tr>
            </table>

            <h3 style="margin:0 0 16px;font-size:12px;text-transform:uppercase;letter-spacing:2px;color:#7ba98b;font-family:Georgia,serif;">Your Breakdown</h3>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${answerRows}
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
              <tr><td style="height:1px;background:#c8ddd1;font-size:0;line-height:0;">&nbsp;</td></tr>
            </table>

            <h3 style="margin:0 0 16px;font-size:12px;text-transform:uppercase;letter-spacing:2px;color:#7ba98b;font-family:Georgia,serif;">What Happens Next</h3>
            <table cellpadding="0" cellspacing="0" width="100%">
              ${stepRows}
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
              <tr><td align="center">
                <a href="${BOOKING_URL}"
                  style="display:inline-block;background:linear-gradient(135deg,#4e7a5e,#3d8b8b);color:#fff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 36px;border-radius:99px;letter-spacing:0.3px;font-family:Georgia,serif;">
                  ${band.cta} &rarr;
                </a>
              </td></tr>
            </table>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:28px 16px;text-align:center;">
            <p style="margin:0 0 8px;font-size:12px;color:#8da898;font-family:Georgia,serif;">
              This is not a clinical diagnosis. If you are in crisis, please contact emergency services immediately.
            </p>
            <p style="margin:0;font-size:11px;color:#aabdb3;font-family:Georgia,serif;">
              &copy; ${new Date().getFullYear()} Mentel &middot;
              <a href="https://trymentel.com/privacy" style="color:#7ba98b;text-decoration:none;">Privacy Policy</a>
              &middot;
              <a href="https://trymentel.com/unsubscribe" style="color:#7ba98b;text-decoration:none;">Unsubscribe</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── ADMIN EMAIL ────────────────────────────────────────────────────────────────
function buildAdminEmail(
  name: string,
  email: string,
  phone: string,
  score: number,
  band: ReturnType<typeof getBand>,
  answers: Record<string, number>,
): string {
  const answerRows = Object.entries(answers)
    .map(
      ([qId, val]) => `
      <tr>
        <td width="120" style="padding:10px 12px;border-bottom:1px solid #e8eeea;font-size:13px;color:#4a5e52;font-weight:600;vertical-align:middle;">${questionLabels[qId] ?? s(qId)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e8eeea;vertical-align:middle;">${scoreBar(val)}</td>
        <td width="40" style="padding:10px 12px;border-bottom:1px solid #e8eeea;text-align:right;font-size:13px;color:#6b7c72;vertical-align:middle;">${val}/3</td>
      </tr>`,
    )
    .join("");

  const urgencyStyles =
    score >= 19
      ? "background:#fde8e8;color:#b94a4f;"
      : score >= 13
        ? "background:#fdf3e8;color:#b97a30;"
        : "background:#edf7f1;color:#4e8c6a;";
  const urgencyText =
    score >= 19
      ? "&#9888; High Concern &mdash; Follow Up Urgently"
      : score >= 13
        ? "Follow Up Within 24h"
        : "Standard Follow Up";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>New Assessment &mdash; Mentel Admin</title>
</head>
<body style="margin:0;padding:0;background:#f0f3f1;font-family:Georgia,serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f3f1;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

        <!-- Admin header bar -->
        <tr>
          <td style="background:linear-gradient(135deg,#2a3d30,#3d5c47);border-radius:20px 20px 0 0;padding:22px 28px;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td width="28" height="28" style="width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.2);font-size:0;">&nbsp;</td>
              <td style="padding-left:10px;vertical-align:middle;">
                <span style="font-family:Georgia,serif;font-size:18px;color:#fff;">Mentel Admin</span>
              </td>
              <td style="padding-left:10px;vertical-align:middle;">
                <table cellpadding="0" cellspacing="0"><tr>
                  <td style="background:rgba(255,255,255,0.15);border-radius:99px;padding:3px 10px;">
                    <span style="font-size:10px;color:rgba(255,255,255,0.85);text-transform:uppercase;letter-spacing:1px;">New Lead</span>
                  </td>
                </tr></table>
              </td>
            </tr></table>
          </td>
        </tr>

        <!-- White body -->
        <tr>
          <td style="background:#fff;border-radius:0 0 20px 20px;padding:28px;border:1px solid #dde8e0;border-top:none;">

            <!-- Urgency + score row -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;"><tr>
              <td style="vertical-align:middle;">
                <table cellpadding="0" cellspacing="0"><tr>
                  <td style="${urgencyStyles}border-radius:99px;padding:5px 12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;white-space:nowrap;">
                    ${urgencyText}
                  </td>
                </tr></table>
              </td>
              <td style="text-align:right;vertical-align:middle;">
                <table cellpadding="0" cellspacing="0" align="right"><tr>
                  <td style="background:linear-gradient(135deg,${band.color},${band.accentColor});border-radius:10px;padding:8px 16px;">
                    <span style="font-size:13px;color:#fff;font-weight:600;white-space:nowrap;">${band.band} &middot; ${score}/${TOTAL_QUESTIONS * 3}</span>
                  </td>
                </tr></table>
              </td>
            </tr></table>

            <!-- Client info -->
            <h3 style="margin:0 0 12px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#7ba98b;font-family:Georgia,serif;">Client Information</h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7faf8;border-radius:12px;border:1px solid #e4ede7;margin-bottom:24px;">
              <tr>
                <td width="110" style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;">Name</td>
                <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:14px;color:#2a3d30;font-weight:600;">${name}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;">Email</td>
                <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;">
                  <a href="mailto:${email}" style="font-size:14px;color:#3d8b8b;text-decoration:none;font-weight:500;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;">Phone</td>
                <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:14px;color:#2a3d30;">${phone || "—"}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;">Submitted</td>
                <td style="padding:12px 16px;font-size:14px;color:#2a3d30;">${new Date().toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short" })}</td>
              </tr>
            </table>

            <!-- Answer breakdown -->
            <h3 style="margin:0 0 12px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#7ba98b;font-family:Georgia,serif;">Answer Breakdown</h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;border:1px solid #e4ede7;">
              <tr style="background:#f7faf8;">
                <th width="120" style="padding:10px 12px;text-align:left;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;font-weight:500;">Category</th>
                <th style="padding:10px 12px;text-align:left;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;font-weight:500;">Score</th>
                <th width="40" style="padding:10px 12px;text-align:right;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;font-weight:500;">Val</th>
              </tr>
              ${answerRows}
            </table>

            <!-- Total score -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;border-radius:12px;border:1px solid ${band.color}30;background:#f9fbf9;">
              <tr>
                <td style="padding:14px 18px;font-size:13px;color:#2a3d30;font-weight:600;">Total Score</td>
                <td style="padding:14px 18px;text-align:right;">
                  <span style="font-size:20px;font-weight:700;color:${band.color};">${score}</span>
                  <span style="font-size:13px;color:#8da898;font-weight:400;"> / ${TOTAL_QUESTIONS * 3}</span>
                </td>
              </tr>
            </table>

            <!-- Reply button -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
              <tr><td align="center">
                <a href="mailto:${email}?subject=Your%20Mentel%20Results%20%E2%80%94%20Let%27s%20Talk&body=Hi%20${encodeURIComponent(name)}%2C%0D%0A%0D%0AThank%20you%20for%20completing%20our%20wellbeing%20assessment..."
                  style="display:inline-block;background:linear-gradient(135deg,#4e7a5e,#3d8b8b);color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:99px;font-family:Georgia,serif;">
                  Reply to ${name} &rarr;
                </a>
              </td></tr>
            </table>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 0;text-align:center;">
            <p style="margin:0;font-size:11px;color:#9aada3;font-family:Georgia,serif;">
              Mentel Admin Dashboard &middot; This email is for internal use only.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── API Route ──────────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, answers } = body;

    // ── Input validation — reject before touching Resend ──────────────────────
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 },
      );
    }
    if (!name || String(name).trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Invalid name" },
        { status: 400 },
      );
    }

    // ── Sanitize all user-supplied strings used in HTML ───────────────────────
    const safeName = s(name);
    const safeEmail = s(email);
    const safePhone = s(phone);

    // ── Clamp score — NaN / negative / absurdly large values all map to 0 ─────
    const rawScore = Number(body.score);
    const score = Number.isFinite(rawScore)
      ? Math.max(0, Math.min(rawScore, TOTAL_QUESTIONS * 3))
      : 0;

    const band = getBand(score);
    const safeAnswers: Record<string, number> = {};
    for (const [k, v] of Object.entries(answers ?? {})) {
      const n = Number(v);
      if (/^q\d+$/.test(k) && Number.isFinite(n))
        safeAnswers[k] = Math.max(0, Math.min(3, n));
    }

    const userHtml = buildUserEmail(safeName, score, band, safeAnswers);
    const adminHtml = buildAdminEmail(
      safeName,
      safeEmail,
      safePhone,
      score,
      band,
      safeAnswers,
    );

    // ── Promise.allSettled — one failure doesn't kill the other send ──────────
    const [userResult, adminResult] = await Promise.allSettled([
      resend.emails.send({
        from: FROM_EMAIL,
        to: [email],
        subject: `${band.emoji} Your Mentel Wellbeing Results — ${band.band}`,
        html: userHtml,
      }),
      resend.emails.send({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject: `🌿 New Assessment: ${safeName} · ${band.band} (${score}pts)`,
        html: adminHtml,
        replyTo: email, // Resend v2: replyTo — v3: reply_to. Check your package version.
      }),
    ]);

    if (userResult.status === "rejected") {
      console.error("User email failed:", userResult.reason);
    }
    if (adminResult.status === "rejected") {
      console.error("Admin email failed:", adminResult.reason);
    }

    // Return success as long as at least the admin email went through
    // (user email can fail on bad address — we still want the lead recorded)
    if (adminResult.status === "rejected" && userResult.status === "rejected") {
      return NextResponse.json(
        { success: false, error: "Both emails failed to send" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Assessment route error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}
