// import { NextResponse } from "next/server";
// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// const ADMIN_EMAIL = "graynneji405@gmail.com";
// const FROM_EMAIL = "Mentel <hello@trymentel.com>";
// const BOOKING_URL = "https://trymentel.com/#book";
// const TOTAL_QUESTIONS = 8; // hardcoded — never derived from answers length

// // ── HTML sanitizer — prevents name/email breaking email layout ─────────────────
// function s(str: unknown): string {
//   return String(str ?? "")
//     .replace(/&/g, "&amp;")
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;")
//     .replace(/"/g, "&quot;");
// }

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
// // pct=0 edge case: skip the filled cell entirely so Outlook doesn't render a phantom pixel.
// // Always render the empty background cell so the track has full width.
// function scoreBar(value: number, max = 3): string {
//   const pct = Math.round((value / max) * 100);
//   const emptyPct = 100 - pct;
//   return `<table width="100%" cellpadding="0" cellspacing="0"><tr>
//     <td style="padding-right:10px;vertical-align:middle;">
//       <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:99px;overflow:hidden;background:#e8eeea;"><tr>
//         ${pct > 0 ? `<td width="${pct}%" height="8" style="height:8px;line-height:8px;font-size:0;background:linear-gradient(90deg,#7ba98b,#3d8b8b);">&nbsp;</td>` : ""}
//         ${emptyPct > 0 ? `<td width="${emptyPct}%" height="8" style="height:8px;line-height:8px;font-size:0;background:#e8eeea;">&nbsp;</td>` : ""}
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
// ): string {
//   const answerRows = Object.entries(answers)
//     .map(
//       ([qId, val]) => `
//       <tr>
//         <td width="120" style="padding:11px 12px 11px 0;border-bottom:1px solid #e8eeea;vertical-align:middle;">
//           <span style="font-size:13px;color:#4a5e52;font-weight:600;">${questionLabels[qId] ?? s(qId)}</span>
//         </td>
//         <td style="padding:11px 0;border-bottom:1px solid #e8eeea;vertical-align:middle;">
//           ${scoreBar(val)}
//         </td>
//       </tr>`,
//     )
//     .join("");

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
//                 <span style="font-size:14px;color:rgba(255,255,255,0.95);font-family:Georgia,serif;">Score: <strong>${score}</strong> / ${TOTAL_QUESTIONS * 3}</span>
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

//             <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
//               <tr><td style="height:1px;background:#c8ddd1;font-size:0;line-height:0;">&nbsp;</td></tr>
//             </table>

//             <h3 style="margin:0 0 16px;font-size:12px;text-transform:uppercase;letter-spacing:2px;color:#7ba98b;font-family:Georgia,serif;">Your Breakdown</h3>
//             <table width="100%" cellpadding="0" cellspacing="0">
//               ${answerRows}
//             </table>

//             <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
//               <tr><td style="height:1px;background:#c8ddd1;font-size:0;line-height:0;">&nbsp;</td></tr>
//             </table>

//             <h3 style="margin:0 0 16px;font-size:12px;text-transform:uppercase;letter-spacing:2px;color:#7ba98b;font-family:Georgia,serif;">What Happens Next</h3>
//             <table cellpadding="0" cellspacing="0" width="100%">
//               ${stepRows}
//             </table>

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
// ): string {
//   const answerRows = Object.entries(answers)
//     .map(
//       ([qId, val]) => `
//       <tr>
//         <td width="120" style="padding:10px 12px;border-bottom:1px solid #e8eeea;font-size:13px;color:#4a5e52;font-weight:600;vertical-align:middle;">${questionLabels[qId] ?? s(qId)}</td>
//         <td style="padding:10px 12px;border-bottom:1px solid #e8eeea;vertical-align:middle;">${scoreBar(val)}</td>
//       </tr>`,
//     )
//     .join("");

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

//             <!-- Urgency + score row -->
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
//                     <span style="font-size:13px;color:#fff;font-weight:600;white-space:nowrap;">${band.band} &middot; ${score}/${TOTAL_QUESTIONS * 3}</span>
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
//               </tr>
//               ${answerRows}
//             </table>

//             <!-- Total score -->
//             <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;border-radius:12px;border:1px solid ${band.color}30;background:#f9fbf9;">
//               <tr>
//                 <td style="padding:14px 18px;font-size:13px;color:#2a3d30;font-weight:600;">Total Score</td>
//                 <td style="padding:14px 18px;text-align:right;">
//                   <span style="font-size:20px;font-weight:700;color:${band.color};">${score}</span>
//                   <span style="font-size:13px;color:#8da898;font-weight:400;"> / ${TOTAL_QUESTIONS * 3}</span>
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
//     const body = await req.json();
//     const { name, email, phone, answers } = body;

//     // ── Input validation — reject before touching Resend ──────────────────────
//     if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
//       return NextResponse.json(
//         { success: false, error: "Invalid email address" },
//         { status: 400 },
//       );
//     }
//     if (!name || String(name).trim().length < 2) {
//       return NextResponse.json(
//         { success: false, error: "Invalid name" },
//         { status: 400 },
//       );
//     }

//     // ── Sanitize all user-supplied strings used in HTML ───────────────────────
//     const safeName = s(name);
//     const safeEmail = s(email);
//     const safePhone = s(phone);

//     // ── Clamp score — NaN / negative / absurdly large values all map to 0 ─────
//     const rawScore = Number(body.score);
//     const score = Number.isFinite(rawScore)
//       ? Math.max(0, Math.min(rawScore, TOTAL_QUESTIONS * 3))
//       : 0;

//     const band = getBand(score);
//     const safeAnswers: Record<string, number> = {};
//     for (const [k, v] of Object.entries(answers ?? {})) {
//       const n = Number(v);
//       if (/^q\d+$/.test(k) && Number.isFinite(n))
//         safeAnswers[k] = Math.max(0, Math.min(3, n));
//     }

//     const userHtml = buildUserEmail(safeName, score, band, safeAnswers);
//     const adminHtml = buildAdminEmail(
//       safeName,
//       safeEmail,
//       safePhone,
//       score,
//       band,
//       safeAnswers,
//     );

//     // ── Promise.allSettled — one failure doesn't kill the other send ──────────
//     const [userResult, adminResult] = await Promise.allSettled([
//       resend.emails.send({
//         from: FROM_EMAIL,
//         to: [email],
//         subject: `${band.emoji} Your Mentel Wellbeing Results — ${band.band}`,
//         html: userHtml,
//       }),
//       resend.emails.send({
//         from: FROM_EMAIL,
//         to: [ADMIN_EMAIL],
//         subject: `🌿 New Assessment: ${safeName} · ${band.band} (${score}pts)`,
//         html: adminHtml,
//         replyTo: email, // Resend v2: replyTo — v3: reply_to. Check your package version.
//       }),
//     ]);

//     if (userResult.status === "rejected") {
//       console.error("User email failed:", userResult.reason);
//     }
//     if (adminResult.status === "rejected") {
//       console.error("Admin email failed:", adminResult.reason);
//     }

//     // Return success as long as at least the admin email went through
//     // (user email can fail on bad address — we still want the lead recorded)
//     if (adminResult.status === "rejected" && userResult.status === "rejected") {
//       return NextResponse.json(
//         { success: false, error: "Both emails failed to send" },
//         { status: 500 },
//       );
//     }

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Assessment route error:", error);
//     return NextResponse.json(
//       { success: false, error: "Server error" },
//       { status: 500 },
//     );
//   }
// }
///////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

// import { NextResponse } from "next/server";
// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// const ADMIN_EMAIL = "graynneji405@gmail.com";
// const FROM_EMAIL = "Mentel <hello@trymentel.com>";
// const BOOKING_URL = "https://trymentel.com/#book";
// const TOTAL_QUESTIONS = 8;

// // ── Sanitizer ─────────────────────────────────────────────────────────────────
// function s(str: unknown): string {
//   return String(str ?? "")
//     .replace(/&/g, "&amp;")
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;")
//     .replace(/"/g, "&quot;");
// }

// // ── Score bar (Gmail-safe, pure table) ────────────────────────────────────────
// function scoreBar(value: number, max = 3): string {
//   const pct = Math.round((value / max) * 100);
//   const emptyPct = 100 - pct;
//   return `<table width="100%" cellpadding="0" cellspacing="0"><tr>
//     <td style="padding-right:10px;vertical-align:middle;">
//       <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:99px;overflow:hidden;background:#e8eeea;"><tr>
//         ${pct > 0 ? `<td width="${pct}%" height="8" style="height:8px;line-height:8px;font-size:0;background:linear-gradient(90deg,#7ba98b,#3d8b8b);">&nbsp;</td>` : ""}
//         ${emptyPct > 0 ? `<td width="${emptyPct}%" height="8" style="height:8px;line-height:8px;font-size:0;background:#e8eeea;">&nbsp;</td>` : ""}
//       </tr></table>
//     </td>
//     <td width="32" style="vertical-align:middle;text-align:right;white-space:nowrap;">
//       <span style="font-size:12px;color:#6b7c72;">${value}/${max}</span>
//     </td>
//   </tr></table>`;
// }

// // ── Band config ────────────────────────────────────────────────────────────────
// // Severity labels: Low / Mild / Moderate / High  (standard screening language)
// // Condition copy uses: "Your responses suggest possible signs of..."
// // No clinical labels anywhere — legally safe, WHO/APA aligned framing
// // High severity includes urgent support resources (Nigeria-specific)

// interface BandConfig {
//   band: string; // display name e.g. "Low"
//   severity: string; // severity label shown in email header
//   headline: string; // email H2
//   color: string; // primary brand color for this band
//   accentColor: string; // lighter accent
//   iconBg: string; // icon circle background
//   severityBadgeBg: string;
//   severityBadgeText: string;
//   // Screening-language condition (not a diagnosis)
//   screeningResult: string;
//   // Practical insight shown in the "what this means" block
//   whatThisMeans: string;
//   // Conversational intro paragraphs (split on \n)
//   intro: string;
//   // 3 practical tips
//   tips: string[];
//   // Whether to show urgent resources block
//   showUrgentResources: boolean;
//   cta: string;
// }

// function getBand(score: number): BandConfig {
//   // ── LOW (score 0–6) ──────────────────────────────────────────────────────
//   if (score <= 6) {
//     return {
//       band: "Low",
//       severity: "Low Severity",
//       headline: "You appear to be in a good place",
//       color: "#4e8c6a",
//       accentColor: "#7ba98b",
//       iconBg: "#d4ede0",
//       severityBadgeBg: "#eaf4ee",
//       severityBadgeText: "#3a7a58",
//       screeningResult:
//         "Your responses suggest possible signs of low emotional stress. Your current wellbeing indicators — mood, energy, sleep, and relationships — appear to be within a healthy range.",
//       whatThisMeans:
//         "A low score does not mean everything is perfect, and it does not mean you cannot benefit from support. Many people at this level choose to speak with a therapist proactively — to build emotional resilience and self-awareness before life gets harder.",
//       intro: `First — well done for taking the time to check in with yourself. That alone says a lot.\n\nYour responses suggest you're managing well across most areas right now. This is genuinely good news. The research is clear: people who invest in their mental wellbeing when things are relatively stable tend to navigate the harder seasons of life with significantly more strength and clarity.`,
//       tips: [
//         "Start a <strong>5-minute morning check-in</strong> — write one thing you're grateful for and one thing you want to feel by the end of the day. Small, consistent reflection builds long-term emotional awareness.",
//         "Try <strong>progressive muscle relaxation</strong> before bed — tense each muscle group for 5 seconds then release, from feet to head. It deepens sleep quality and prevents stress from quietly accumulating.",
//         "Schedule one <strong>meaningful conversation</strong> this week — not small talk, but a real one. People who thrive long-term do so partly by being intentional about deep connection.",
//       ],
//       showUrgentResources: false,
//       cta: "Book a session — ₦10,000",
//     };
//   }

//   // ── MILD (score 7–12) ────────────────────────────────────────────────────
//   if (score <= 12) {
//     return {
//       band: "Mild",
//       severity: "Mild Severity",
//       headline: "Some areas are worth paying attention to",
//       color: "#3d8b8b",
//       accentColor: "#6fb8b8",
//       iconBg: "#d4ecec",
//       severityBadgeBg: "#e4f4f4",
//       severityBadgeText: "#2a6b6b",
//       screeningResult:
//         "Your responses suggest possible signs of mild emotional stress or low mood in one or more areas. You may be experiencing elevated stress levels that, while manageable right now, are worth addressing early.",
//       whatThisMeans:
//         "Mild symptoms are common — but they're also the ideal time to act. Patterns that feel small now can quietly compound. A few conversations with the right therapist at this stage can prevent things from becoming significantly harder to manage.",
//       intro: `Thank you for being honest with yourself — that's genuinely the hardest part.\n\nWhat your responses are telling us is that things are mostly okay, but there are areas where you're likely carrying more than you need to be doing alone. Mild stress, occasional low mood, or some strain in your relationships can feel entirely manageable — right up until they aren't.\n\nThis is exactly the stage where early support makes the most difference.`,
//       tips: [
//         "Use the <strong>4-7-8 breathing technique</strong> when tension builds — inhale for 4 counts, hold for 7, exhale for 8. It directly activates your parasympathetic nervous system and shifts your body out of a stress response within minutes.",
//         "Try <strong>behavioural activation</strong> — choose one small activity each day that gives you a sense of achievement or pleasure (a walk, a call with a friend, finishing something you've been avoiding). Mild low mood often shrinks our world; this gently pushes it back open.",
//         "Write down <strong>3 things that are actually going well</strong> each evening for a week. This is not toxic positivity — it is actively retraining your brain's negativity bias, which tends to amplify problems when you're under stress.",
//       ],
//       showUrgentResources: false,
//       cta: "Book a session — ₦10,000",
//     };
//   }

//   // ── MODERATE (score 13–18) ───────────────────────────────────────────────
//   if (score <= 18) {
//     return {
//       band: "Moderate",
//       severity: "Moderate Severity",
//       headline: "You deserve real support — and it's closer than you think",
//       color: "#5a6e8a",
//       accentColor: "#8aaabf",
//       iconBg: "#dae4ee",
//       severityBadgeBg: "#e8eef5",
//       severityBadgeText: "#3a5070",
//       screeningResult:
//         "Your score indicates moderate emotional difficulty. Your responses suggest possible signs of persistent low mood, elevated anxiety, or significant stress affecting multiple areas of your daily life.",
//       whatThisMeans:
//         "A moderate score means what you're experiencing is real and substantial — and it's unlikely to resolve on its own without some form of support. This is not weakness. This is how human beings work. Professional support at this stage is a practical, evidence-based decision.",
//       intro: `We want you to know — what you're going through is real, it's valid, and you are not being dramatic.\n\nYour responses suggest you've been carrying a lot, probably for longer than you've been willing to admit. When emotional difficulty shows up across multiple areas — how you sleep, how you relate to people around you, how you feel about yourself — it's a clear signal that pushing through alone isn't the answer.\n\nSpeaking with a therapist isn't a last resort. It's the same decision you'd make if a physical symptom wasn't going away on its own.`,
//       tips: [
//         "When everything feels heavy, <strong>anchor yourself in your senses</strong> — name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste. This grounding technique interrupts a mental spiral and brings you back to the present moment.",
//         "Resist the urge to <strong>isolate</strong> — even when it's the most tempting thing to do. You don't have to explain what you're going through. Simply being physically present with someone you trust helps regulate your nervous system.",
//         "Try a <strong>brain dump</strong> — set a timer for 10 minutes and write everything on your mind without editing or filtering. Don't read it back. Just externalising your thoughts onto paper reduces the psychological weight of carrying them internally.",
//       ],
//       showUrgentResources: false,
//       cta: "Book a session — ₦10,000",
//     };
//   }

//   // ── HIGH (score 19–24) ───────────────────────────────────────────────────
//   return {
//     band: "High",
//     severity: "High Severity",
//     headline: "You don't have to keep carrying this alone",
//     color: "#b94a4f",
//     accentColor: "#d97070",
//     iconBg: "#f5dede",
//     severityBadgeBg: "#fdeaea",
//     severityBadgeText: "#923a3e",
//     screeningResult:
//       "Your score indicates high severity emotional distress. Your responses suggest possible signs of significant difficulty with mood, anxiety, or daily functioning that may require professional support as soon as possible.",
//     whatThisMeans:
//       "A high score does not define you — but it does tell us that you are struggling in a way that deserves real, professional attention. This is not something to push through alone. Please reach out.",
//     intro: `We're really glad you took this check-in today. Truly.\n\nWhat your responses are telling us is that you've been struggling — significantly — and possibly for a while. The kind of struggle where getting through the day takes more than it should, where things that used to feel manageable don't anymore.\n\nWe want you to hear this clearly: you do not have to feel this way permanently. What you're experiencing is real, it's recognised, and there are people specifically trained to help you through it. Reaching out is not giving up — it is the most courageous and practical thing you can do right now.`,
//     tips: [
//       "<strong>Tell one person how you're actually feeling today</strong> — not the edited version, the real one. You don't have to have the right words. Just letting someone in creates a shift that is hard to describe until you've experienced it.",
//       "If your thoughts become overwhelming, use the <strong>STOP technique</strong> — Say 'stop' out loud or write it, Take a breath, Observe what you're feeling without judgment, Proceed with one small grounded action. It creates a pause between a thought and being consumed by it.",
//       "Drink water, eat something small, step outside for 5 minutes — not because it solves the deeper issue, but because <strong>your nervous system needs basic inputs to function</strong>. When we're struggling deeply, we often stop doing the simplest things first. Start there.",
//     ],
//     showUrgentResources: true,
//     cta: "Book a session — ₦10,000",
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

// // ── Disclaimer — one quiet line just before the footer, never in the body ────
// const DISCLAIMER_BLOCK = `
// <p style="margin:0 0 20px;font-size:11px;color:#a0b5a8;line-height:1.6;text-align:center;font-family:Georgia,serif;font-style:italic;">
//   This wellness check-in is for informational purposes only and is not a substitute for professional mental health advice.
// </p>`;

// // ── Urgent support block — legally safe, no third-party promotion ─────────────
// const URGENT_RESOURCES_BLOCK = `
// <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;border-radius:12px;border:1.5px solid #d97070;background:#fdf4f4;">
//   <tr>
//     <td style="padding:20px 22px;">
//       <p style="margin:0 0 10px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#b94a4f;font-weight:700;font-family:Georgia,serif;">If You Are in Immediate Distress</p>
//       <p style="margin:0 0 16px;font-size:14px;color:#3a2020;line-height:1.75;font-family:Georgia,serif;">
//         If you are feeling unsafe or in crisis right now, please do not wait. Reach out to someone you trust,
//         visit your nearest hospital, or contact your local emergency services immediately.
//         You matter — and help is available.
//       </p>
//       <table cellpadding="0" cellspacing="0"><tr>
//         <td>
//           <a href="https://trymentel.com/#book"
//             style="display:inline-block;background:#b94a4f;color:#fff;text-decoration:none;font-size:13px;font-weight:600;padding:11px 24px;border-radius:99px;font-family:Georgia,serif;">
//             Talk to a Mentel therapist now &rarr;
//           </a>
//         </td>
//       </tr></table>
//     </td>
//   </tr>
// </table>`;

// // ── USER EMAIL ─────────────────────────────────────────────────────────────────
// function buildUserEmail(
//   name: string,
//   score: number,
//   band: BandConfig,
//   answers: Record<string, number>,
// ): string {
//   const answerRows = Object.entries(answers)
//     .map(
//       ([qId, val]) => `
//       <tr>
//         <td width="120" style="padding:11px 12px 11px 0;border-bottom:1px solid #e8eeea;vertical-align:middle;">
//           <span style="font-size:13px;color:#4a5e52;font-weight:600;font-family:Georgia,serif;">${questionLabels[qId] ?? s(qId)}</span>
//         </td>
//         <td style="padding:11px 0;border-bottom:1px solid #e8eeea;vertical-align:middle;">
//           ${scoreBar(val)}
//         </td>
//       </tr>`,
//     )
//     .join("");

//   const tipRows = band.tips
//     .map(
//       (tip, i) => `
//       <tr>
//         <td width="36" style="padding:10px 0;vertical-align:top;">
//           <table cellpadding="0" cellspacing="0"><tr>
//             <td width="26" height="26" align="center" valign="middle"
//               style="width:26px;height:26px;border-radius:50%;background:${band.iconBg};text-align:center;vertical-align:middle;border:1.5px solid ${band.accentColor}50;">
//               <span style="font-size:11px;font-weight:700;color:${band.color};font-family:Georgia,serif;">${i + 1}</span>
//             </td>
//           </tr></table>
//         </td>
//         <td style="padding:10px 0 10px 12px;vertical-align:top;">
//           <span style="font-size:14px;color:#3a4e42;line-height:1.75;font-family:Georgia,serif;">${tip}</span>
//         </td>
//       </tr>`,
//     )
//     .join("");

//   const introParagraphs = band.intro
//     .split("\n")
//     .filter(Boolean)
//     .map(
//       (p) =>
//         `<p style="margin:0 0 16px;font-size:15px;line-height:1.8;color:#4a5e52;font-family:Georgia,serif;">${p}</p>`,
//     )
//     .join("");

//   return `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8"/>
//   <meta name="viewport" content="width=device-width,initial-scale=1"/>
//   <title>Your Mentel Personalised Mental Health Insights</title>
// </head>
// <body style="margin:0;padding:0;background:#f2f6f3;font-family:Georgia,serif;">

//   <table width="100%" cellpadding="0" cellspacing="0" style="background:#f2f6f3;padding:40px 16px;">
//     <tr><td align="center">
//       <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

//         <!-- Logo -->
//         <tr>
//           <td align="center" style="padding-bottom:24px;">
//             <a href="https://trymentel.com" style="display:inline-block;text-decoration:none;">
//               <img
//                 src="https://trymentel.com/logo.png"
//                 alt="Mentel"
//                 width="120"
//                 style="display:block;height:auto;border:0;outline:none;text-decoration:none;"
//               />
//             </a>
//           </td>
//         </tr>

//         <!-- Hero band card -->
//         <tr>
//           <td align="center"
//             style="background:linear-gradient(135deg,${band.color},${band.accentColor});border-radius:20px 20px 0 0;padding:40px 32px 36px;">
//             <!-- Severity badge -->
//             <table cellpadding="0" cellspacing="0" align="center" style="margin-bottom:16px;"><tr>
//               <td style="background:rgba(255,255,255,0.22);border-radius:99px;padding:5px 18px;">
//                 <span style="font-size:11px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:2px;font-family:Georgia,serif;">
//                   ${band.severity}
//                 </span>
//               </td>
//             </tr></table>
//             <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:3px;color:rgba(255,255,255,0.72);font-family:Georgia,serif;">
//               Personalised Mental Health Insights
//             </p>
//             <h1 style="margin:0 0 14px;font-family:Georgia,serif;font-size:30px;font-weight:400;color:#fff;line-height:1.25;">
//               ${band.headline}${name ? `, ${name}` : ""}
//             </h1>
//             <table cellpadding="0" cellspacing="0" align="center"><tr>
//               <td style="background:rgba(255,255,255,0.18);border-radius:99px;padding:6px 20px;">
//                 <span style="font-size:13px;color:rgba(255,255,255,0.92);font-family:Georgia,serif;">
//                   Wellness Score: <strong>${score}</strong> / ${TOTAL_QUESTIONS * 3}
//                 </span>
//               </td>
//             </tr></table>
//           </td>
//         </tr>

//         <!-- White body -->
//         <tr>
//           <td style="background:#fff;border-radius:0 0 20px 20px;padding:36px 36px 32px;border:1px solid #ddeae2;border-top:none;">

//             <!-- Urgent resources — High severity only -->
//             ${band.showUrgentResources ? URGENT_RESOURCES_BLOCK : ""}

//             <!-- Conversational intro -->
//             ${introParagraphs}

//             <!-- Divider -->
//             <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 28px;">
//               <tr><td style="height:1px;background:#c8ddd2;font-size:0;line-height:0;">&nbsp;</td></tr>
//             </table>

//             <!-- Screening result block -->
//             <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;border-radius:14px;border:1px solid ${band.color}28;background:${band.iconBg}70;">
//               <tr>
//                 <td style="padding:20px 22px;">
//                   <p style="margin:0 0 6px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:${band.color};font-weight:700;font-family:Georgia,serif;">
//                     Here's What Stood Out
//                   </p>
//                   <p style="margin:0 0 12px;font-size:15px;color:#2c3e35;line-height:1.7;font-family:Georgia,serif;">
//                     ${band.screeningResult}
//                   </p>
//                   <p style="margin:0;font-size:13px;color:#5a7264;line-height:1.65;font-style:italic;font-family:Georgia,serif;">
//                     ${band.whatThisMeans}
//                   </p>
//                 </td>
//               </tr>
//             </table>

//             <!-- Score breakdown -->
//             <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:${band.color};font-weight:700;font-family:Georgia,serif;">Your Area Breakdown</p>
//             <p style="margin:0 0 14px;font-size:12px;color:#8da898;font-family:Georgia,serif;">How each area scored in your self-assessment.</p>
//             <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
//               ${answerRows}
//             </table>

//             <!-- Divider -->
//             <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
//               <tr><td style="height:1px;background:#c8ddd2;font-size:0;line-height:0;">&nbsp;</td></tr>
//             </table>

//             <!-- Practical tips -->
//             <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:${band.color};font-weight:700;font-family:Georgia,serif;">3 Things You Can Try Right Now</p>
//             <p style="margin:0 0 20px;font-size:12px;color:#8da898;font-family:Georgia,serif;">Evidence-based. No apps required.</p>
//             <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:32px;">
//               ${tipRows}
//             </table>

//             <!-- Divider -->
//             <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
//               <tr><td style="height:1px;background:#c8ddd2;font-size:0;line-height:0;">&nbsp;</td></tr>
//             </table>

//             <!-- CTA block -->
//             <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:16px;background:${band.iconBg}80;border:1px solid ${band.accentColor}50;margin-bottom:24px;">
//               <tr>
//                 <td style="padding:28px 28px 24px;">
//                   <h3 style="margin:0 0 10px;font-family:Georgia,serif;font-size:20px;font-weight:400;color:#1c3a3a;">Take the next step.</h3>
//                   <p style="margin:0 0 8px;font-size:15px;line-height:1.75;color:#2c3e35;font-family:Georgia,serif;">
//                     A full 50-minute session with a licensed Mentel therapist — matched specifically to what your results showed.
//                   </p>
//                   <p style="margin:0 0 20px;font-size:14px;line-height:1.7;color:#5a7264;font-family:Georgia,serif;">
//                     You get a real conversation with someone who will actually listen, help you make sense of what you're carrying,
//                     and give you a clear direction forward. One session can shift more than you expect.
//                   </p>
//                   <!-- Price line -->
//                   <table cellpadding="0" cellspacing="0" style="margin-bottom:18px;"><tr>
//                     <td style="background:rgba(255,255,255,0.8);border-radius:10px;padding:10px 16px;border:1px solid ${band.accentColor}40;">
//                       <span style="font-size:13px;color:#8da898;text-decoration:line-through;font-family:Georgia,serif;">₦35,000</span>
//                       <span style="font-size:18px;font-weight:700;color:${band.color};margin-left:8px;font-family:Georgia,serif;">₦10,000</span>
//                       <span style="font-size:12px;color:#8da898;margin-left:6px;font-family:Georgia,serif;">· Limited offer · No recurring charge</span>
//                     </td>
//                   </tr></table>
//                   <table cellpadding="0" cellspacing="0"><tr>
//                     <td>
//                       <a href="${BOOKING_URL}"
//                         style="display:inline-block;background:linear-gradient(135deg,${band.color},${band.accentColor});color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:13px 32px;border-radius:99px;font-family:Georgia,serif;">
//                         ${band.cta} &rarr;
//                       </a>
//                     </td>
//                   </tr></table>
//                 </td>
//               </tr>
//             </table>

//             <p style="margin:0;font-size:13px;line-height:1.7;color:#8da898;font-family:Georgia,serif;text-align:center;">
//               Questions? Just reply to this email — we read every one.
//             </p>

//           </td>
//         </tr>

//         <!-- Quiet disclaimer — between card and footer -->
//         <tr>
//           <td style="padding:16px 24px 0;">
//             ${DISCLAIMER_BLOCK}
//           </td>
//         </tr>

//         <!-- Footer -->
//         <tr>
//           <td style="padding:24px 16px;text-align:center;">
//             <p style="margin:0 0 6px;font-size:11px;color:#aabdb3;font-family:Georgia,serif;">
//               &copy; ${new Date().getFullYear()} Mentel &middot;
//               <a href="https://trymentel.com/privacy" style="color:#7ba98b;text-decoration:none;">Privacy Policy</a>
//               &middot;
//               <a href="https://trymentel.com/unsubscribe" style="color:#7ba98b;text-decoration:none;">Unsubscribe</a>
//             </p>
//             <p style="margin:0;font-size:10px;color:#c0cfc8;font-family:Georgia,serif;">
//               Mentel provides access to licensed therapists and does not provide medical diagnosis or clinical treatment.
//               This self-assessment is for informational purposes only.
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
//   band: BandConfig,
//   answers: Record<string, number>,
// ): string {
//   const answerRows = Object.entries(answers)
//     .map(
//       ([qId, val]) => `
//       <tr>
//         <td width="120" style="padding:10px 12px;border-bottom:1px solid #e8eeea;font-size:13px;color:#4a5e52;font-weight:600;vertical-align:middle;font-family:Georgia,serif;">
//           ${questionLabels[qId] ?? s(qId)}
//         </td>
//         <td style="padding:10px 12px;border-bottom:1px solid #e8eeea;vertical-align:middle;">
//           ${scoreBar(val)}
//         </td>
//       </tr>`,
//     )
//     .join("");

//   const urgencyStyles = band.showUrgentResources
//     ? "background:#fde8e8;color:#b94a4f;"
//     : score >= 13
//       ? "background:#fdf3e8;color:#b97a30;"
//       : "background:#edf7f1;color:#4e8c6a;";

//   const urgencyText = band.showUrgentResources
//     ? "&#9888; High Severity &mdash; Follow Up Urgently"
//     : score >= 13
//       ? "Moderate &mdash; Follow Up Within 24h"
//       : "Low / Mild &mdash; Standard Follow Up";

//   return `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8"/>
//   <meta name="viewport" content="width=device-width,initial-scale=1"/>
//   <title>New Wellness Assessment &mdash; Mentel Admin</title>
// </head>
// <body style="margin:0;padding:0;background:#f0f3f1;font-family:Georgia,serif;">

//   <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f3f1;padding:40px 16px;">
//     <tr><td align="center">
//       <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

//         <!-- Admin header -->
//         <tr>
//           <td style="background:linear-gradient(135deg,#1c3a3a,#2d5c47);border-radius:16px 16px 0 0;padding:22px 28px;">
//             <table cellpadding="0" cellspacing="0" width="100%"><tr>
//               <td style="vertical-align:middle;">
//                 <span style="font-family:Georgia,serif;font-size:18px;color:#fff;">Mentel Admin</span>
//               </td>
//               <td style="text-align:right;vertical-align:middle;">
//                 <table cellpadding="0" cellspacing="0" align="right"><tr>
//                   <td style="background:rgba(255,255,255,0.15);border-radius:99px;padding:4px 12px;">
//                     <span style="font-size:10px;color:rgba(255,255,255,0.85);text-transform:uppercase;letter-spacing:1px;font-family:Georgia,serif;">New Lead</span>
//                   </td>
//                 </tr></table>
//               </td>
//             </tr></table>
//           </td>
//         </tr>

//         <!-- White body -->
//         <tr>
//           <td style="background:#fff;border-radius:0 0 16px 16px;padding:28px;border:1px solid #dde8e0;border-top:none;">

//             <!-- Urgency + score row -->
//             <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;"><tr>
//               <td style="vertical-align:middle;">
//                 <table cellpadding="0" cellspacing="0"><tr>
//                   <td style="${urgencyStyles}border-radius:99px;padding:5px 14px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;font-family:Georgia,serif;">
//                     ${urgencyText}
//                   </td>
//                 </tr></table>
//               </td>
//               <td style="text-align:right;vertical-align:middle;">
//                 <table cellpadding="0" cellspacing="0" align="right"><tr>
//                   <td style="background:linear-gradient(135deg,${band.color},${band.accentColor});border-radius:10px;padding:8px 16px;">
//                     <span style="font-size:13px;color:#fff;font-weight:600;white-space:nowrap;font-family:Georgia,serif;">
//                       ${band.severity} &middot; ${score}/${TOTAL_QUESTIONS * 3}
//                     </span>
//                   </td>
//                 </tr></table>
//               </td>
//             </tr></table>

//             <!-- Client info -->
//             <h3 style="margin:0 0 12px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#7ba98b;font-family:Georgia,serif;">Client Information</h3>
//             <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7faf8;border-radius:12px;border:1px solid #e4ede7;margin-bottom:24px;">
//               <tr>
//                 <td width="100" style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;font-family:Georgia,serif;">Name</td>
//                 <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:14px;color:#1c3a3a;font-weight:600;font-family:Georgia,serif;">${name}</td>
//               </tr>
//               <tr>
//                 <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;font-family:Georgia,serif;">Email</td>
//                 <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;">
//                   <a href="mailto:${s(email)}" style="font-size:14px;color:#3d8b8b;text-decoration:none;font-weight:500;font-family:Georgia,serif;">${s(email)}</a>
//                 </td>
//               </tr>
//               <tr>
//                 <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;font-family:Georgia,serif;">Phone</td>
//                 <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:14px;color:#1c3a3a;font-family:Georgia,serif;">${s(phone) || "—"}</td>
//               </tr>
//               <tr>
//                 <td style="padding:12px 16px;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;font-family:Georgia,serif;">Submitted</td>
//                 <td style="padding:12px 16px;font-size:14px;color:#1c3a3a;font-family:Georgia,serif;">${new Date().toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short" })}</td>
//               </tr>
//             </table>

//             <!-- Answer breakdown -->
//             <h3 style="margin:0 0 12px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#7ba98b;font-family:Georgia,serif;">Answer Breakdown</h3>
//             <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;border:1px solid #e4ede7;margin-bottom:14px;">
//               <tr style="background:#f7faf8;">
//                 <th width="120" style="padding:10px 12px;text-align:left;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;font-weight:500;font-family:Georgia,serif;">Area</th>
//                 <th style="padding:10px 12px;text-align:left;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;font-weight:500;font-family:Georgia,serif;">Score</th>
//               </tr>
//               ${answerRows}
//             </table>

//             <!-- Total -->
//             <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;border:1px solid ${band.color}30;background:#f9fbf9;margin-bottom:28px;">
//               <tr>
//                 <td style="padding:14px 18px;font-size:13px;color:#1c3a3a;font-weight:600;font-family:Georgia,serif;">Total Wellness Score</td>
//                 <td style="padding:14px 18px;text-align:right;">
//                   <span style="font-size:20px;font-weight:700;color:${band.color};font-family:Georgia,serif;">${score}</span>
//                   <span style="font-size:13px;color:#8da898;font-family:Georgia,serif;"> / ${TOTAL_QUESTIONS * 3}</span>
//                 </td>
//               </tr>
//             </table>

//             <!-- Reply CTA -->
//             <table width="100%" cellpadding="0" cellspacing="0">
//               <tr><td align="center">
//                 <a href="mailto:${s(email)}?subject=Your%20Mentel%20Wellness%20Assessment%20Results&body=Hi%20${encodeURIComponent(name)}%2C%0D%0A%0D%0AThank%20you%20for%20completing%20the%20Mentel%20wellness%20check-in..."
//                   style="display:inline-block;background:linear-gradient(135deg,#1c3a3a,#3d8b8b);color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:99px;font-family:Georgia,serif;">
//                   Reply to ${name} &rarr;
//                 </a>
//               </td></tr>
//             </table>

//           </td>
//         </tr>

//         <tr>
//           <td style="padding:20px 0;text-align:center;">
//             <p style="margin:0;font-size:11px;color:#9aada3;font-family:Georgia,serif;">Mentel Admin &middot; Internal use only</p>
//           </td>
//         </tr>

//       </table>
//     </td></tr>
//   </table>
// </body>
// </html>`;
// }

// // ── API Route ──────────────────────────────────────────────────────────────────
// export async function POST(req: Request): Promise<NextResponse> {
//   try {
//     const body: unknown = await req.json();
//     const { name, email, phone, answers } = body as {
//       name: unknown;
//       email: unknown;
//       phone: unknown;
//       answers: unknown;
//     };

//     if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
//       return NextResponse.json(
//         { success: false, error: "Invalid email address" },
//         { status: 400 },
//       );
//     }
//     if (!name || String(name).trim().length < 2) {
//       return NextResponse.json(
//         { success: false, error: "Invalid name" },
//         { status: 400 },
//       );
//     }

//     const safeName = s(name);
//     const safeEmail = s(email);
//     const safePhone = s(phone);

//     const rawScore = Number((body as Record<string, unknown>).score);
//     const score = Number.isFinite(rawScore)
//       ? Math.max(0, Math.min(rawScore, TOTAL_QUESTIONS * 3))
//       : 0;

//     const band = getBand(score);

//     const safeAnswers: Record<string, number> = {};
//     for (const [k, v] of Object.entries(
//       (answers as Record<string, unknown>) ?? {},
//     )) {
//       const n = Number(v);
//       if (/^q\d+$/.test(k) && Number.isFinite(n)) {
//         safeAnswers[k] = Math.max(0, Math.min(3, n));
//       }
//     }

//     const userHtml = buildUserEmail(safeName, score, band, safeAnswers);
//     const adminHtml = buildAdminEmail(
//       safeName,
//       safeEmail,
//       safePhone,
//       score,
//       band,
//       safeAnswers,
//     );

//     const [userResult, adminResult] = await Promise.allSettled([
//       resend.emails.send({
//         from: FROM_EMAIL,
//         to: [String(email)],
//         subject: `💛 Your Mentel Wellness Assessment — ${band.severity}`,
//         html: userHtml,
//       }),
//       resend.emails.send({
//         from: FROM_EMAIL,
//         to: [ADMIN_EMAIL],
//         subject: `🌿 New Assessment: ${safeName} · ${band.severity} (${score}pts)`,
//         html: adminHtml,
//         replyTo: String(email),
//       }),
//     ]);

//     if (userResult.status === "rejected") {
//       console.error("User email failed:", userResult.reason);
//     }
//     if (adminResult.status === "rejected") {
//       console.error("Admin email failed:", adminResult.reason);
//     }

//     if (adminResult.status === "rejected" && userResult.status === "rejected") {
//       return NextResponse.json(
//         { success: false, error: "Both emails failed to send" },
//         { status: 500 },
//       );
//     }

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Assessment route error:", error);
//     return NextResponse.json(
//       { success: false, error: "Server error" },
//       { status: 500 },
//     );
//   }
// }
/////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
// import { NextResponse } from "next/server";
// import { Resend } from "resend";
// import { db } from "@/lib/db";

// const resend = new Resend(process.env.RESEND_API_KEY);

// const ADMIN_EMAIL = "graynneji405@gmail.com";
// const FROM_EMAIL = "Mentel <hello@trymentel.com>";
// const BOOKING_URL = "https://trymentel.com/#book";
// const TOTAL_QUESTIONS = 8;

// // ── Sanitizer ─────────────────────────────────────────────────────────────────
// function s(str: unknown): string {
//   return String(str ?? "")
//     .replace(/&/g, "&amp;")
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;")
//     .replace(/"/g, "&quot;");
// }

// // ── Score bar (Gmail-safe, pure table) ────────────────────────────────────────
// function scoreBar(value: number, max = 3): string {
//   const pct = Math.round((value / max) * 100);
//   const emptyPct = 100 - pct;
//   return `<table width="100%" cellpadding="0" cellspacing="0"><tr>
//     <td style="padding-right:10px;vertical-align:middle;">
//       <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:99px;overflow:hidden;background:#e8eeea;"><tr>
//         ${pct > 0 ? `<td width="${pct}%" height="8" style="height:8px;line-height:8px;font-size:0;background:linear-gradient(90deg,#7ba98b,#3d8b8b);">&nbsp;</td>` : ""}
//         ${emptyPct > 0 ? `<td width="${emptyPct}%" height="8" style="height:8px;line-height:8px;font-size:0;background:#e8eeea;">&nbsp;</td>` : ""}
//       </tr></table>
//     </td>
//     <td width="32" style="vertical-align:middle;text-align:right;white-space:nowrap;">
//       <span style="font-size:12px;color:#6b7c72;">${value}/${max}</span>
//     </td>
//   </tr></table>`;
// }

// // ── Band config ────────────────────────────────────────────────────────────────
// // Severity labels: Low / Mild / Moderate / High  (standard screening language)
// // Condition copy uses: "Your responses suggest possible signs of..."
// // No clinical labels anywhere — legally safe, WHO/APA aligned framing
// // High severity includes urgent support resources (Nigeria-specific)

// interface BandConfig {
//   band: string; // display name e.g. "Low"
//   severity: string; // severity label shown in email header
//   headline: string; // email H2
//   color: string; // primary brand color for this band
//   accentColor: string; // lighter accent
//   iconBg: string; // icon circle background
//   severityBadgeBg: string;
//   severityBadgeText: string;
//   // Screening-language condition (not a diagnosis)
//   screeningResult: string;
//   // Practical insight shown in the "what this means" block
//   whatThisMeans: string;
//   // Conversational intro paragraphs (split on \n)
//   intro: string;
//   // 3 practical tips
//   tips: string[];
//   // Whether to show urgent resources block
//   showUrgentResources: boolean;
//   cta: string;
// }

// function getBand(score: number): BandConfig {
//   // ── LOW (score 0–6) ──────────────────────────────────────────────────────
//   if (score <= 6) {
//     return {
//       band: "Low",
//       severity: "Low Severity",
//       headline: "You appear to be in a good place",
//       color: "#4e8c6a",
//       accentColor: "#7ba98b",
//       iconBg: "#d4ede0",
//       severityBadgeBg: "#eaf4ee",
//       severityBadgeText: "#3a7a58",
//       screeningResult:
//         "Your responses suggest possible signs of low emotional stress. Your current wellbeing indicators — mood, energy, sleep, and relationships — appear to be within a healthy range.",
//       whatThisMeans:
//         "A low score does not mean everything is perfect, and it does not mean you cannot benefit from support. Many people at this level choose to speak with a therapist proactively — to build emotional resilience and self-awareness before life gets harder.",
//       intro: `First — well done for taking the time to check in with yourself. That alone says a lot.\n\nYour responses suggest you're managing well across most areas right now. This is genuinely good news. The research is clear: people who invest in their mental wellbeing when things are relatively stable tend to navigate the harder seasons of life with significantly more strength and clarity.`,
//       tips: [
//         "Start a <strong>5-minute morning check-in</strong> — write one thing you're grateful for and one thing you want to feel by the end of the day. Small, consistent reflection builds long-term emotional awareness.",
//         "Try <strong>progressive muscle relaxation</strong> before bed — tense each muscle group for 5 seconds then release, from feet to head. It deepens sleep quality and prevents stress from quietly accumulating.",
//         "Schedule one <strong>meaningful conversation</strong> this week — not small talk, but a real one. People who thrive long-term do so partly by being intentional about deep connection.",
//       ],
//       showUrgentResources: false,
//       cta: "Book a session",
//     };
//   }

//   // ── MILD (score 7–12) ────────────────────────────────────────────────────
//   if (score <= 12) {
//     return {
//       band: "Mild",
//       severity: "Mild Severity",
//       headline: "Some areas are worth paying attention to",
//       color: "#3d8b8b",
//       accentColor: "#6fb8b8",
//       iconBg: "#d4ecec",
//       severityBadgeBg: "#e4f4f4",
//       severityBadgeText: "#2a6b6b",
//       screeningResult:
//         "Your responses suggest possible signs of mild emotional stress or low mood in one or more areas. You may be experiencing elevated stress levels that, while manageable right now, are worth addressing early.",
//       whatThisMeans:
//         "Mild symptoms are common — but they're also the ideal time to act. Patterns that feel small now can quietly compound. A few conversations with the right therapist at this stage can prevent things from becoming significantly harder to manage.",
//       intro: `Thank you for being honest with yourself — that's genuinely the hardest part.\n\nWhat your responses are telling us is that things are mostly okay, but there are areas where you're likely carrying more than you need to be doing alone. Mild stress, occasional low mood, or some strain in your relationships can feel entirely manageable — right up until they aren't.\n\nThis is exactly the stage where early support makes the most difference.`,
//       tips: [
//         "Use the <strong>4-7-8 breathing technique</strong> when tension builds — inhale for 4 counts, hold for 7, exhale for 8. It directly activates your parasympathetic nervous system and shifts your body out of a stress response within minutes.",
//         "Try <strong>behavioural activation</strong> — choose one small activity each day that gives you a sense of achievement or pleasure (a walk, a call with a friend, finishing something you've been avoiding). Mild low mood often shrinks our world; this gently pushes it back open.",
//         "Write down <strong>3 things that are actually going well</strong> each evening for a week. This is not toxic positivity — it is actively retraining your brain's negativity bias, which tends to amplify problems when you're under stress.",
//       ],
//       showUrgentResources: false,
//       cta: "Book a session",
//     };
//   }

//   // ── MODERATE (score 13–18) ───────────────────────────────────────────────
//   if (score <= 18) {
//     return {
//       band: "Moderate",
//       severity: "Moderate Severity",
//       headline: "You deserve real support — and it's closer than you think",
//       color: "#5a6e8a",
//       accentColor: "#8aaabf",
//       iconBg: "#dae4ee",
//       severityBadgeBg: "#e8eef5",
//       severityBadgeText: "#3a5070",
//       screeningResult:
//         "Your score indicates moderate emotional difficulty. Your responses suggest possible signs of persistent low mood, elevated anxiety, or significant stress affecting multiple areas of your daily life.",
//       whatThisMeans:
//         "A moderate score means what you're experiencing is real and substantial — and it's unlikely to resolve on its own without some form of support. This is not weakness. This is how human beings work. Professional support at this stage is a practical, evidence-based decision.",
//       intro: `We want you to know — what you're going through is real, it's valid, and you are not being dramatic.\n\nYour responses suggest you've been carrying a lot, probably for longer than you've been willing to admit. When emotional difficulty shows up across multiple areas — how you sleep, how you relate to people around you, how you feel about yourself — it's a clear signal that pushing through alone isn't the answer.\n\nSpeaking with a therapist isn't a last resort. It's the same decision you'd make if a physical symptom wasn't going away on its own.`,
//       tips: [
//         "When everything feels heavy, <strong>anchor yourself in your senses</strong> — name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste. This grounding technique interrupts a mental spiral and brings you back to the present moment.",
//         "Resist the urge to <strong>isolate</strong> — even when it's the most tempting thing to do. You don't have to explain what you're going through. Simply being physically present with someone you trust helps regulate your nervous system.",
//         "Try a <strong>brain dump</strong> — set a timer for 10 minutes and write everything on your mind without editing or filtering. Don't read it back. Just externalising your thoughts onto paper reduces the psychological weight of carrying them internally.",
//       ],
//       showUrgentResources: false,
//       cta: "Book a session",
//     };
//   }

//   // ── HIGH (score 19–24) ───────────────────────────────────────────────────
//   return {
//     band: "High",
//     severity: "High Severity",
//     headline: "You don't have to keep carrying this alone",
//     color: "#b94a4f",
//     accentColor: "#d97070",
//     iconBg: "#f5dede",
//     severityBadgeBg: "#fdeaea",
//     severityBadgeText: "#923a3e",
//     screeningResult:
//       "Your score indicates high severity emotional distress. Your responses suggest possible signs of significant difficulty with mood, anxiety, or daily functioning that may require professional support as soon as possible.",
//     whatThisMeans:
//       "A high score does not define you — but it does tell us that you are struggling in a way that deserves real, professional attention. This is not something to push through alone. Please reach out.",
//     intro: `We're really glad you took this check-in today. Truly.\n\nWhat your responses are telling us is that you've been struggling — significantly — and possibly for a while. The kind of struggle where getting through the day takes more than it should, where things that used to feel manageable don't anymore.\n\nWe want you to hear this clearly: you do not have to feel this way permanently. What you're experiencing is real, it's recognised, and there are people specifically trained to help you through it. Reaching out is not giving up — it is the most courageous and practical thing you can do right now.`,
//     tips: [
//       "<strong>Tell one person how you're actually feeling today</strong> — not the edited version, the real one. You don't have to have the right words. Just letting someone in creates a shift that is hard to describe until you've experienced it.",
//       "If your thoughts become overwhelming, use the <strong>STOP technique</strong> — Say 'stop' out loud or write it, Take a breath, Observe what you're feeling without judgment, Proceed with one small grounded action. It creates a pause between a thought and being consumed by it.",
//       "Drink water, eat something small, step outside for 5 minutes — not because it solves the deeper issue, but because <strong>your nervous system needs basic inputs to function</strong>. When we're struggling deeply, we often stop doing the simplest things first. Start there.",
//     ],
//     showUrgentResources: true,
//     cta: "Book a session",
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

// // ── Disclaimer — one quiet line just before the footer, never in the body ────
// const DISCLAIMER_BLOCK = `
// <p style="margin:0 0 20px;font-size:11px;color:#a0b5a8;line-height:1.6;text-align:center;font-family:Georgia,serif;font-style:italic;">
//   This wellness check-in is for informational purposes only and is not a substitute for professional mental health advice.
// </p>`;

// // ── Urgent support block — legally safe, no third-party promotion ─────────────
// const URGENT_RESOURCES_BLOCK = `
// <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;border-radius:12px;border:1.5px solid #d97070;background:#fdf4f4;">
//   <tr>
//     <td style="padding:20px 22px;">
//       <p style="margin:0 0 10px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#b94a4f;font-weight:700;font-family:Georgia,serif;">If You Are in Immediate Distress</p>
//       <p style="margin:0 0 16px;font-size:14px;color:#3a2020;line-height:1.75;font-family:Georgia,serif;">
//         If you are feeling unsafe or in crisis right now, please do not wait. Reach out to someone you trust,
//         visit your nearest hospital, or contact your local emergency services immediately.
//         You matter — and help is available.
//       </p>
//       <table cellpadding="0" cellspacing="0"><tr>
//         <td>
//           <a href="https://trymentel.com/#book"
//             style="display:inline-block;background:#b94a4f;color:#fff;text-decoration:none;font-size:13px;font-weight:600;padding:11px 24px;border-radius:99px;font-family:Georgia,serif;">
//             Talk to a Mentel therapist now &rarr;
//           </a>
//         </td>
//       </tr></table>
//     </td>
//   </tr>
// </table>`;

// // ── USER EMAIL ─────────────────────────────────────────────────────────────────
// function buildUserEmail(
//   name: string,
//   score: number,
//   band: BandConfig,
//   answers: Record<string, number>,
// ): string {
//   const answerRows = Object.entries(answers)
//     .map(
//       ([qId, val]) => `
//       <tr>
//         <td width="120" style="padding:11px 12px 11px 0;border-bottom:1px solid #e8eeea;vertical-align:middle;">
//           <span style="font-size:13px;color:#4a5e52;font-weight:600;font-family:Georgia,serif;">${questionLabels[qId] ?? s(qId)}</span>
//         </td>
//         <td style="padding:11px 0;border-bottom:1px solid #e8eeea;vertical-align:middle;">
//           ${scoreBar(val)}
//         </td>
//       </tr>`,
//     )
//     .join("");

//   const tipRows = band.tips
//     .map(
//       (tip, i) => `
//       <tr>
//         <td width="36" style="padding:10px 0;vertical-align:top;">
//           <table cellpadding="0" cellspacing="0"><tr>
//             <td width="26" height="26" align="center" valign="middle"
//               style="width:26px;height:26px;border-radius:50%;background:${band.iconBg};text-align:center;vertical-align:middle;border:1.5px solid ${band.accentColor}50;">
//               <span style="font-size:11px;font-weight:700;color:${band.color};font-family:Georgia,serif;">${i + 1}</span>
//             </td>
//           </tr></table>
//         </td>
//         <td style="padding:10px 0 10px 12px;vertical-align:top;">
//           <span style="font-size:14px;color:#3a4e42;line-height:1.75;font-family:Georgia,serif;">${tip}</span>
//         </td>
//       </tr>`,
//     )
//     .join("");

//   const introParagraphs = band.intro
//     .split("\n")
//     .filter(Boolean)
//     .map(
//       (p) =>
//         `<p style="margin:0 0 16px;font-size:15px;line-height:1.8;color:#4a5e52;font-family:Georgia,serif;">${p}</p>`,
//     )
//     .join("");

//   return `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8"/>
//   <meta name="viewport" content="width=device-width,initial-scale=1"/>
//   <title>Your Mentel Personalised Mental Health Insights</title>
// </head>
// <body style="margin:0;padding:0;background:#f2f6f3;font-family:Georgia,serif;">

//   <table width="100%" cellpadding="0" cellspacing="0" style="background:#f2f6f3;padding:40px 16px;">
//     <tr><td align="center">
//       <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

//         <!-- Logo -->
//         <tr>
//           <td align="center" style="padding-bottom:24px;">
//             <a href="https://trymentel.com" style="display:inline-block;text-decoration:none;">
//               <img
//                 src="https://trymentel.com/logo.png"
//                 alt="Mentel"
//                 width="120"
//                 style="display:block;height:auto;border:0;outline:none;text-decoration:none;"
//               />
//             </a>
//           </td>
//         </tr>

//         <!-- Hero band card -->
//         <tr>
//           <td align="center"
//             style="background:linear-gradient(135deg,${band.color},${band.accentColor});border-radius:20px 20px 0 0;padding:40px 32px 36px;">
//             <!-- Severity badge -->
//             <table cellpadding="0" cellspacing="0" align="center" style="margin-bottom:16px;"><tr>
//               <td style="background:rgba(255,255,255,0.22);border-radius:99px;padding:5px 18px;">
//                 <span style="font-size:11px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:2px;font-family:Georgia,serif;">
//                   ${band.severity}
//                 </span>
//               </td>
//             </tr></table>
//             <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:3px;color:rgba(255,255,255,0.72);font-family:Georgia,serif;">
//               Personalised Mental Health Insights
//             </p>
//             <h1 style="margin:0 0 14px;font-family:Georgia,serif;font-size:30px;font-weight:400;color:#fff;line-height:1.25;">
//               ${band.headline}${name ? `, ${name}` : ""}
//             </h1>
//             <table cellpadding="0" cellspacing="0" align="center"><tr>
//               <td style="background:rgba(255,255,255,0.18);border-radius:99px;padding:6px 20px;">
//                 <span style="font-size:13px;color:rgba(255,255,255,0.92);font-family:Georgia,serif;">
//                   Wellness Score: <strong>${score}</strong> / ${TOTAL_QUESTIONS * 3}
//                 </span>
//               </td>
//             </tr></table>
//           </td>
//         </tr>

//         <!-- White body -->
//         <tr>
//           <td style="background:#fff;border-radius:0 0 20px 20px;padding:36px 36px 32px;border:1px solid #ddeae2;border-top:none;">

//             <!-- Urgent resources — High severity only -->
//             ${band.showUrgentResources ? URGENT_RESOURCES_BLOCK : ""}

//             <!-- Conversational intro -->
//             ${introParagraphs}

//             <!-- Divider -->
//             <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 28px;">
//               <tr><td style="height:1px;background:#c8ddd2;font-size:0;line-height:0;">&nbsp;</td></tr>
//             </table>

//             <!-- Screening result block -->
//             <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;border-radius:14px;border:1px solid ${band.color}28;background:${band.iconBg}70;">
//               <tr>
//                 <td style="padding:20px 22px;">
//                   <p style="margin:0 0 6px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:${band.color};font-weight:700;font-family:Georgia,serif;">
//                     Here's What Stood Out
//                   </p>
//                   <p style="margin:0 0 12px;font-size:15px;color:#2c3e35;line-height:1.7;font-family:Georgia,serif;">
//                     ${band.screeningResult}
//                   </p>
//                   <p style="margin:0;font-size:13px;color:#5a7264;line-height:1.65;font-style:italic;font-family:Georgia,serif;">
//                     ${band.whatThisMeans}
//                   </p>
//                 </td>
//               </tr>
//             </table>

//             <!-- Score breakdown -->
//             <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:${band.color};font-weight:700;font-family:Georgia,serif;">Your Area Breakdown</p>
//             <p style="margin:0 0 14px;font-size:12px;color:#8da898;font-family:Georgia,serif;">How each area scored in your self-assessment.</p>
//             <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
//               ${answerRows}
//             </table>

//             <!-- Divider -->
//             <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
//               <tr><td style="height:1px;background:#c8ddd2;font-size:0;line-height:0;">&nbsp;</td></tr>
//             </table>

//             <!-- Practical tips -->
//             <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:${band.color};font-weight:700;font-family:Georgia,serif;">3 Things You Can Try Right Now</p>
//             <p style="margin:0 0 20px;font-size:12px;color:#8da898;font-family:Georgia,serif;">Evidence-based. No apps required.</p>
//             <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:32px;">
//               ${tipRows}
//             </table>

//             <!-- Divider -->
//             <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
//               <tr><td style="height:1px;background:#c8ddd2;font-size:0;line-height:0;">&nbsp;</td></tr>
//             </table>

//             <!-- CTA block -->
//             <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:16px;background:${band.iconBg}80;border:1px solid ${band.accentColor}50;margin-bottom:24px;">
//               <tr>
//                 <td style="padding:28px 28px 24px;">
//                   <h3 style="margin:0 0 10px;font-family:Georgia,serif;font-size:20px;font-weight:400;color:#1c3a3a;">Take the next step.</h3>
//                   <p style="margin:0 0 8px;font-size:15px;line-height:1.75;color:#2c3e35;font-family:Georgia,serif;">
//                     A full 50-minute session with a licensed Mentel therapist — matched specifically to what your results showed.
//                   </p>
//                   <p style="margin:0 0 20px;font-size:14px;line-height:1.7;color:#5a7264;font-family:Georgia,serif;">
//                     You get a real conversation with someone who will actually listen, help you make sense of what you're carrying,
//                     and give you a clear direction forward. One session can shift more than you expect.
//                   </p>

//                   <table cellpadding="0" cellspacing="0"><tr>
//                     <td>
//                       <a href="${BOOKING_URL}"
//                         style="display:inline-block;background:linear-gradient(135deg,${band.color},${band.accentColor});color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:13px 32px;border-radius:99px;font-family:Georgia,serif;">
//                         ${band.cta} &rarr;
//                       </a>
//                     </td>
//                   </tr></table>
//                 </td>
//               </tr>
//             </table>

//             <p style="margin:0;font-size:13px;line-height:1.7;color:#8da898;font-family:Georgia,serif;text-align:center;">
//               Questions? Just reply to this email — we read every one.
//             </p>

//           </td>
//         </tr>

//         <!-- Quiet disclaimer — between card and footer -->
//         <tr>
//           <td style="padding:16px 24px 0;">
//             ${DISCLAIMER_BLOCK}
//           </td>
//         </tr>

//         <!-- Footer -->
//         <tr>
//           <td style="padding:24px 16px;text-align:center;">
//             <p style="margin:0 0 6px;font-size:11px;color:#aabdb3;font-family:Georgia,serif;">
//               &copy; ${new Date().getFullYear()} Mentel &middot;
//               <a href="https://trymentel.com/privacy" style="color:#7ba98b;text-decoration:none;">Privacy Policy</a>
//               &middot;
//               <a href="https://trymentel.com/unsubscribe" style="color:#7ba98b;text-decoration:none;">Unsubscribe</a>
//             </p>
//             <p style="margin:0;font-size:10px;color:#c0cfc8;font-family:Georgia,serif;">
//               Mentel provides access to licensed therapists and does not provide medical diagnosis or clinical treatment.
//               This self-assessment is for informational purposes only.
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
//   band: BandConfig,
//   answers: Record<string, number>,
// ): string {
//   const answerRows = Object.entries(answers)
//     .map(
//       ([qId, val]) => `
//       <tr>
//         <td width="120" style="padding:10px 12px;border-bottom:1px solid #e8eeea;font-size:13px;color:#4a5e52;font-weight:600;vertical-align:middle;font-family:Georgia,serif;">
//           ${questionLabels[qId] ?? s(qId)}
//         </td>
//         <td style="padding:10px 12px;border-bottom:1px solid #e8eeea;vertical-align:middle;">
//           ${scoreBar(val)}
//         </td>
//       </tr>`,
//     )
//     .join("");

//   const urgencyStyles = band.showUrgentResources
//     ? "background:#fde8e8;color:#b94a4f;"
//     : score >= 13
//       ? "background:#fdf3e8;color:#b97a30;"
//       : "background:#edf7f1;color:#4e8c6a;";

//   const urgencyText = band.showUrgentResources
//     ? "&#9888; High Severity &mdash; Follow Up Urgently"
//     : score >= 13
//       ? "Moderate &mdash; Follow Up Within 24h"
//       : "Low / Mild &mdash; Standard Follow Up";

//   return `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8"/>
//   <meta name="viewport" content="width=device-width,initial-scale=1"/>
//   <title>New Wellness Assessment &mdash; Mentel Admin</title>
// </head>
// <body style="margin:0;padding:0;background:#f0f3f1;font-family:Georgia,serif;">

//   <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f3f1;padding:40px 16px;">
//     <tr><td align="center">
//       <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

//         <!-- Admin header -->
//         <tr>
//           <td style="background:linear-gradient(135deg,#1c3a3a,#2d5c47);border-radius:16px 16px 0 0;padding:22px 28px;">
//             <table cellpadding="0" cellspacing="0" width="100%"><tr>
//               <td style="vertical-align:middle;">
//                 <span style="font-family:Georgia,serif;font-size:18px;color:#fff;">Mentel Admin</span>
//               </td>
//               <td style="text-align:right;vertical-align:middle;">
//                 <table cellpadding="0" cellspacing="0" align="right"><tr>
//                   <td style="background:rgba(255,255,255,0.15);border-radius:99px;padding:4px 12px;">
//                     <span style="font-size:10px;color:rgba(255,255,255,0.85);text-transform:uppercase;letter-spacing:1px;font-family:Georgia,serif;">New Lead</span>
//                   </td>
//                 </tr></table>
//               </td>
//             </tr></table>
//           </td>
//         </tr>

//         <!-- White body -->
//         <tr>
//           <td style="background:#fff;border-radius:0 0 16px 16px;padding:28px;border:1px solid #dde8e0;border-top:none;">

//             <!-- Urgency + score row -->
//             <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;"><tr>
//               <td style="vertical-align:middle;">
//                 <table cellpadding="0" cellspacing="0"><tr>
//                   <td style="${urgencyStyles}border-radius:99px;padding:5px 14px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;font-family:Georgia,serif;">
//                     ${urgencyText}
//                   </td>
//                 </tr></table>
//               </td>
//               <td style="text-align:right;vertical-align:middle;">
//                 <table cellpadding="0" cellspacing="0" align="right"><tr>
//                   <td style="background:linear-gradient(135deg,${band.color},${band.accentColor});border-radius:10px;padding:8px 16px;">
//                     <span style="font-size:13px;color:#fff;font-weight:600;white-space:nowrap;font-family:Georgia,serif;">
//                       ${band.severity} &middot; ${score}/${TOTAL_QUESTIONS * 3}
//                     </span>
//                   </td>
//                 </tr></table>
//               </td>
//             </tr></table>

//             <!-- Client info -->
//             <h3 style="margin:0 0 12px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#7ba98b;font-family:Georgia,serif;">Client Information</h3>
//             <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7faf8;border-radius:12px;border:1px solid #e4ede7;margin-bottom:24px;">
//               <tr>
//                 <td width="100" style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;font-family:Georgia,serif;">Name</td>
//                 <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:14px;color:#1c3a3a;font-weight:600;font-family:Georgia,serif;">${name}</td>
//               </tr>
//               <tr>
//                 <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;font-family:Georgia,serif;">Email</td>
//                 <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;">
//                   <a href="mailto:${s(email)}" style="font-size:14px;color:#3d8b8b;text-decoration:none;font-weight:500;font-family:Georgia,serif;">${s(email)}</a>
//                 </td>
//               </tr>
//               <tr>
//                 <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;font-family:Georgia,serif;">Phone</td>
//                 <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:14px;color:#1c3a3a;font-family:Georgia,serif;">${s(phone) || "—"}</td>
//               </tr>
//               <tr>
//                 <td style="padding:12px 16px;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;font-family:Georgia,serif;">Submitted</td>
//                 <td style="padding:12px 16px;font-size:14px;color:#1c3a3a;font-family:Georgia,serif;">${new Date().toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short" })}</td>
//               </tr>
//             </table>

//             <!-- Answer breakdown -->
//             <h3 style="margin:0 0 12px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#7ba98b;font-family:Georgia,serif;">Answer Breakdown</h3>
//             <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;border:1px solid #e4ede7;margin-bottom:14px;">
//               <tr style="background:#f7faf8;">
//                 <th width="120" style="padding:10px 12px;text-align:left;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;font-weight:500;font-family:Georgia,serif;">Area</th>
//                 <th style="padding:10px 12px;text-align:left;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;font-weight:500;font-family:Georgia,serif;">Score</th>
//               </tr>
//               ${answerRows}
//             </table>

//             <!-- Total -->
//             <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;border:1px solid ${band.color}30;background:#f9fbf9;margin-bottom:28px;">
//               <tr>
//                 <td style="padding:14px 18px;font-size:13px;color:#1c3a3a;font-weight:600;font-family:Georgia,serif;">Total Wellness Score</td>
//                 <td style="padding:14px 18px;text-align:right;">
//                   <span style="font-size:20px;font-weight:700;color:${band.color};font-family:Georgia,serif;">${score}</span>
//                   <span style="font-size:13px;color:#8da898;font-family:Georgia,serif;"> / ${TOTAL_QUESTIONS * 3}</span>
//                 </td>
//               </tr>
//             </table>

//             <!-- Reply CTA -->
//             <table width="100%" cellpadding="0" cellspacing="0">
//               <tr><td align="center">
//                 <a href="mailto:${s(email)}?subject=Your%20Mentel%20Wellness%20Assessment%20Results&body=Hi%20${encodeURIComponent(name)}%2C%0D%0A%0D%0AThank%20you%20for%20completing%20the%20Mentel%20wellness%20check-in..."
//                   style="display:inline-block;background:linear-gradient(135deg,#1c3a3a,#3d8b8b);color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:99px;font-family:Georgia,serif;">
//                   Reply to ${name} &rarr;
//                 </a>
//               </td></tr>
//             </table>

//           </td>
//         </tr>

//         <tr>
//           <td style="padding:20px 0;text-align:center;">
//             <p style="margin:0;font-size:11px;color:#9aada3;font-family:Georgia,serif;">Mentel Admin &middot; Internal use only</p>
//           </td>
//         </tr>

//       </table>
//     </td></tr>
//   </table>
// </body>
// </html>`;
// }

// // ── API Route ──────────────────────────────────────────────────────────────────
// export async function POST(req: Request): Promise<NextResponse> {
//   try {
//     const body: unknown = await req.json();
//     const { name, email, phone, answers } = body as {
//       name: unknown;
//       email: unknown;
//       phone: unknown;
//       answers: unknown;
//     };

//     if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
//       return NextResponse.json(
//         { success: false, error: "Invalid email address" },
//         { status: 400 },
//       );
//     }
//     if (!name || String(name).trim().length < 2) {
//       return NextResponse.json(
//         { success: false, error: "Invalid name" },
//         { status: 400 },
//       );
//     }

//     const safeName = s(name);
//     const safeEmail = s(email);
//     const safePhone = s(phone);

//     const rawScore = Number((body as Record<string, unknown>).score);
//     const score = Number.isFinite(rawScore)
//       ? Math.max(0, Math.min(rawScore, TOTAL_QUESTIONS * 3))
//       : 0;

//     const band = getBand(score);

//     const safeAnswers: Record<string, number> = {};
//     for (const [k, v] of Object.entries(
//       (answers as Record<string, unknown>) ?? {},
//     )) {
//       const n = Number(v);
//       if (/^q\d+$/.test(k) && Number.isFinite(n)) {
//         safeAnswers[k] = Math.max(0, Math.min(3, n));
//       }
//     }

//     const userHtml = buildUserEmail(safeName, score, band, safeAnswers);
//     const adminHtml = buildAdminEmail(
//       safeName,
//       safeEmail,
//       safePhone,
//       score,
//       band,
//       safeAnswers,
//     );

//     const [userResult, adminResult] = await Promise.allSettled([
//       resend.emails.send({
//         from: FROM_EMAIL,
//         to: [String(email)],
//         subject: `Your Mentel Wellness Assessment — ${band.severity}`,
//         html: userHtml,
//       }),
//       resend.emails.send({
//         from: FROM_EMAIL,
//         to: [ADMIN_EMAIL],
//         subject: `New Assessment: ${safeName} · ${band.severity} (${score}pts)`,
//         html: adminHtml,
//         replyTo: String(email),
//       }),
//     ]);

//     if (userResult.status === "rejected") {
//       console.error("User email failed:", userResult.reason);
//     }
//     if (adminResult.status === "rejected") {
//       console.error("Admin email failed:", adminResult.reason);
//     }

//     // ── Silent DB save — fire-and-forget, never blocks the response ──────
//     db.lead
//       .create({
//         data: {
//           name: safeName,
//           email: String(email),
//           phone: safePhone || null,
//           score,
//           band: band.band,
//           severity: band.severity,
//           answers: safeAnswers,
//           status: "new",
//         },
//       })
//       .catch((err: unknown) => {
//         console.error("DB save failed (non-fatal):", err);
//       });

//     if (adminResult.status === "rejected" && userResult.status === "rejected") {
//       return NextResponse.json(
//         { success: false, error: "Both emails failed to send" },
//         { status: 500 },
//       );
//     }

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Assessment route error:", error);
//     return NextResponse.json(
//       { success: false, error: "Server error" },
//       { status: 500 },
//     );
//   }
// }

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { db } from "@/lib/db";
import { retryAsync } from "@/utilz";

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = "hello@mail.trymentel.com";
const FROM_EMAIL = "Mentel <hello@mail.trymentel.com>";
const BOOKING_URL = "https://trymentel.com/#book";
const TOTAL_QUESTIONS = 8;

// ── Sanitizer ──────────────────────────────────────────────────────────────────
function s(str: unknown): string {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── Score bar (Gmail-safe, pure table) ─────────────────────────────────────────
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

// ── Band config ────────────────────────────────────────────────────────────────
interface BandConfig {
  band: string;
  severity: string;
  headline: string;
  color: string;
  accentColor: string;
  iconBg: string;
  severityBadgeBg: string;
  severityBadgeText: string;
  screeningResult: string;
  whatThisMeans: string;
  intro: string;
  tips: string[];
  showUrgentResources: boolean;
  cta: string;
}

function getBand(score: number): BandConfig {
  if (score <= 6) {
    return {
      band: "Low",
      severity: "Low Severity",
      headline: "You appear to be in a good place",
      color: "#4e8c6a",
      accentColor: "#7ba98b",
      iconBg: "#d4ede0",
      severityBadgeBg: "#eaf4ee",
      severityBadgeText: "#3a7a58",
      screeningResult:
        "Your responses suggest possible signs of low emotional stress. Your current wellbeing indicators — mood, energy, sleep, and relationships — appear to be within a healthy range.",
      whatThisMeans:
        "A low score does not mean everything is perfect, and it does not mean you cannot benefit from support. Many people at this level choose to speak with a therapist proactively — to build emotional resilience and self-awareness before life gets harder.",
      intro: `First — well done for taking the time to check in with yourself. That alone says a lot.\n\nYour responses suggest you're managing well across most areas right now. This is genuinely good news. The research is clear: people who invest in their mental wellbeing when things are relatively stable tend to navigate the harder seasons of life with significantly more strength and clarity.`,
      tips: [
        "Start a <strong>5-minute morning check-in</strong> — write one thing you're grateful for and one thing you want to feel by the end of the day. Small, consistent reflection builds long-term emotional awareness.",
        "Try <strong>progressive muscle relaxation</strong> before bed — tense each muscle group for 5 seconds then release, from feet to head. It deepens sleep quality and prevents stress from quietly accumulating.",
        "Schedule one <strong>meaningful conversation</strong> this week — not small talk, but a real one. People who thrive long-term do so partly by being intentional about deep connection.",
      ],
      showUrgentResources: false,
      cta: "Book a session",
    };
  }

  if (score <= 12) {
    return {
      band: "Mild",
      severity: "Mild Severity",
      headline: "Some areas are worth paying attention to",
      color: "#3d8b8b",
      accentColor: "#6fb8b8",
      iconBg: "#d4ecec",
      severityBadgeBg: "#e4f4f4",
      severityBadgeText: "#2a6b6b",
      screeningResult:
        "Your responses suggest possible signs of mild emotional stress or low mood in one or more areas. You may be experiencing elevated stress levels that, while manageable right now, are worth addressing early.",
      whatThisMeans:
        "Mild symptoms are common — but they're also the ideal time to act. Patterns that feel small now can quietly compound. A few conversations with the right therapist at this stage can prevent things from becoming significantly harder to manage.",
      intro: `Thank you for being honest with yourself — that's genuinely the hardest part.\n\nWhat your responses are telling us is that things are mostly okay, but there are areas where you're likely carrying more than you need to be doing alone. Mild stress, occasional low mood, or some strain in your relationships can feel entirely manageable — right up until they aren't.\n\nThis is exactly the stage where early support makes the most difference.`,
      tips: [
        "Use the <strong>4-7-8 breathing technique</strong> when tension builds — inhale for 4 counts, hold for 7, exhale for 8. It directly activates your parasympathetic nervous system and shifts your body out of a stress response within minutes.",
        "Try <strong>behavioural activation</strong> — choose one small activity each day that gives you a sense of achievement or pleasure (a walk, a call with a friend, finishing something you've been avoiding). Mild low mood often shrinks our world; this gently pushes it back open.",
        "Write down <strong>3 things that are actually going well</strong> each evening for a week. This is not toxic positivity — it is actively retraining your brain's negativity bias, which tends to amplify problems when you're under stress.",
      ],
      showUrgentResources: false,
      cta: "Book a session",
    };
  }

  if (score <= 18) {
    return {
      band: "Moderate",
      severity: "Moderate Severity",
      headline: "You deserve real support — and it's closer than you think",
      color: "#5a6e8a",
      accentColor: "#8aaabf",
      iconBg: "#dae4ee",
      severityBadgeBg: "#e8eef5",
      severityBadgeText: "#3a5070",
      screeningResult:
        "Your score indicates moderate emotional difficulty. Your responses suggest possible signs of persistent low mood, elevated anxiety, or significant stress affecting multiple areas of your daily life.",
      whatThisMeans:
        "A moderate score means what you're experiencing is real and substantial — and it's unlikely to resolve on its own without some form of support. This is not weakness. This is how human beings work. Professional support at this stage is a practical, evidence-based decision.",
      intro: `We want you to know — what you're going through is real, it's valid, and you are not being dramatic.\n\nYour responses suggest you've been carrying a lot, probably for longer than you've been willing to admit. When emotional difficulty shows up across multiple areas — how you sleep, how you relate to people around you, how you feel about yourself — it's a clear signal that pushing through alone isn't the answer.\n\nSpeaking with a therapist isn't a last resort. It's the same decision you'd make if a physical symptom wasn't going away on its own.`,
      tips: [
        "When everything feels heavy, <strong>anchor yourself in your senses</strong> — name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste. This grounding technique interrupts a mental spiral and brings you back to the present moment.",
        "Resist the urge to <strong>isolate</strong> — even when it's the most tempting thing to do. You don't have to explain what you're going through. Simply being physically present with someone you trust helps regulate your nervous system.",
        "Try a <strong>brain dump</strong> — set a timer for 10 minutes and write everything on your mind without editing or filtering. Don't read it back. Just externalising your thoughts onto paper reduces the psychological weight of carrying them internally.",
      ],
      showUrgentResources: false,
      cta: "Book a session",
    };
  }

  return {
    band: "High",
    severity: "High Severity",
    headline: "You don't have to keep carrying this alone",
    color: "#b94a4f",
    accentColor: "#d97070",
    iconBg: "#f5dede",
    severityBadgeBg: "#fdeaea",
    severityBadgeText: "#923a3e",
    screeningResult:
      "Your score indicates high severity emotional distress. Your responses suggest possible signs of significant difficulty with mood, anxiety, or daily functioning that may require professional support as soon as possible.",
    whatThisMeans:
      "A high score does not define you — but it does tell us that you are struggling in a way that deserves real, professional attention. This is not something to push through alone. Please reach out.",
    intro: `We're really glad you took this check-in today. Truly.\n\nWhat your responses are telling us is that you've been struggling — significantly — and possibly for a while. The kind of struggle where getting through the day takes more than it should, where things that used to feel manageable don't anymore.\n\nWe want you to hear this clearly: you do not have to feel this way permanently. What you're experiencing is real, it's recognised, and there are people specifically trained to help you through it. Reaching out is not giving up — it is the most courageous and practical thing you can do right now.`,
    tips: [
      "<strong>Tell one person how you're actually feeling today</strong> — not the edited version, the real one. You don't have to have the right words. Just letting someone in creates a shift that is hard to describe until you've experienced it.",
      "If your thoughts become overwhelming, use the <strong>STOP technique</strong> — Say 'stop' out loud or write it, Take a breath, Observe what you're feeling without judgment, Proceed with one small grounded action. It creates a pause between a thought and being consumed by it.",
      "Drink water, eat something small, step outside for 5 minutes — not because it solves the deeper issue, but because <strong>your nervous system needs basic inputs to function</strong>. When we're struggling deeply, we often stop doing the simplest things first. Start there.",
    ],
    showUrgentResources: true,
    cta: "Book a session",
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

// ── Urgent support block ───────────────────────────────────────────────────────
const URGENT_RESOURCES_BLOCK = `
<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;border-radius:12px;border:1.5px solid #d97070;background:#fdf4f4;">
  <tr>
    <td style="padding:20px 22px;">
      <p style="margin:0 0 10px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#b94a4f;font-weight:700;font-family:Georgia,serif;">If You Are in Immediate Distress</p>
      <p style="margin:0 0 16px;font-size:14px;color:#3a2020;line-height:1.75;font-family:Georgia,serif;">
        If you are feeling unsafe or in crisis right now, please do not wait. Reach out to someone you trust,
        visit your nearest hospital, or contact your local emergency services immediately.
        You matter — and help is available.
      </p>
      <table cellpadding="0" cellspacing="0"><tr>
        <td>
          <a href="${BOOKING_URL}"
            style="display:inline-block;background:#b94a4f;color:#ffffff;text-decoration:none;font-size:13px;font-weight:600;padding:11px 24px;border-radius:99px;font-family:Georgia,serif;">
            Talk to a Mentel therapist now
          </a>
        </td>
      </tr></table>
    </td>
  </tr>
</table>`;

// ── Plain-text builder (user) ──────────────────────────────────────────────────
function buildUserText(
  name: string,
  score: number,
  band: BandConfig,
  answers: Record<string, number>,
): string {
  const intro = band.intro.replace(/\n/g, "\n\n");

  const breakdown = Object.entries(answers)
    .map(([qId, val]) => `  ${questionLabels[qId] ?? qId}: ${val}/3`)
    .join("\n");

  // Strip HTML tags from tips for plain text
  const tips = band.tips
    .map((tip, i) => `${i + 1}. ${tip.replace(/<[^>]+>/g, "")}`)
    .join("\n\n");

  const urgentBlock = band.showUrgentResources
    ? `\n\n--- IF YOU ARE IN IMMEDIATE DISTRESS ---\nIf you are feeling unsafe right now, please reach out to someone you trust or visit your nearest hospital. You matter, and help is available.\n`
    : "";

  return `Hi ${name},

Thank you for completing your Mentel wellbeing check-in.
${urgentBlock}
YOUR RESULTS
------------
Wellness Score: ${score} / ${TOTAL_QUESTIONS * 3}
Severity: ${band.severity}

${intro}

WHAT STOOD OUT
--------------
${band.screeningResult}

${band.whatThisMeans}

YOUR AREA BREAKDOWN
-------------------
${breakdown}

3 THINGS YOU CAN TRY RIGHT NOW
--------------------------------
${tips}

TAKE THE NEXT STEP
------------------
A 50-minute session with a licensed Mentel therapist, matched specifically to your results.

Book here: ${BOOKING_URL}

Questions? Just reply to this email — we read every one.

---
This wellness check-in is for informational purposes only and is not a substitute for professional mental health advice.

(c) ${new Date().getFullYear()} Mentel
Privacy Policy: https://trymentel.com/privacy
Unsubscribe: https://trymentel.com/unsubscribe

Mentel provides access to licensed therapists and does not provide medical diagnosis or clinical treatment.`;
}

// ── HTML user email ────────────────────────────────────────────────────────────
function buildUserEmail(
  name: string,
  score: number,
  band: BandConfig,
  answers: Record<string, number>,
): string {
  const answerRows = Object.entries(answers)
    .map(
      ([qId, val]) => `
      <tr>
        <td width="120" style="padding:11px 12px 11px 0;border-bottom:1px solid #e8eeea;vertical-align:middle;">
          <span style="font-size:13px;color:#4a5e52;font-weight:600;font-family:Georgia,serif;">${questionLabels[qId] ?? s(qId)}</span>
        </td>
        <td style="padding:11px 0;border-bottom:1px solid #e8eeea;vertical-align:middle;">
          ${scoreBar(val)}
        </td>
      </tr>`,
    )
    .join("");

  const tipRows = band.tips
    .map(
      (tip, i) => `
      <tr>
        <td width="36" style="padding:10px 0;vertical-align:top;">
          <table cellpadding="0" cellspacing="0"><tr>
            <td width="26" height="26" align="center" valign="middle"
              style="width:26px;height:26px;border-radius:50%;background:${band.iconBg};text-align:center;vertical-align:middle;border:1.5px solid ${band.accentColor}50;">
              <span style="font-size:11px;font-weight:700;color:${band.color};font-family:Georgia,serif;">${i + 1}</span>
            </td>
          </tr></table>
        </td>
        <td style="padding:10px 0 10px 12px;vertical-align:top;">
          <span style="font-size:14px;color:#3a4e42;line-height:1.75;font-family:Georgia,serif;">${tip}</span>
        </td>
      </tr>`,
    )
    .join("");

  const introParagraphs = band.intro
    .split("\n")
    .filter(Boolean)
    .map(
      (p) =>
        `<p style="margin:0 0 16px;font-size:15px;line-height:1.8;color:#4a5e52;font-family:Georgia,serif;">${p}</p>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Your Mentel Wellbeing Results</title>
</head>
<body style="margin:0;padding:0;background:#f2f6f3;font-family:Georgia,serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f2f6f3;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

        <!-- Logo -->
        <tr>
          <td align="center" style="padding-bottom:24px;">
            <a href="https://trymentel.com" style="display:inline-block;text-decoration:none;">
              <img
                src="https://trymentel.com/logo.png"
                alt="Mentel"
                width="120"
                height="40"
                style="display:block;height:auto;border:0;outline:none;text-decoration:none;"
              />
            </a>
          </td>
        </tr>

        <!-- Hero band card -->
        <tr>
          <td align="center"
            style="background:linear-gradient(135deg,${band.color},${band.accentColor});border-radius:20px 20px 0 0;padding:40px 32px 36px;">
            <table cellpadding="0" cellspacing="0" align="center" style="margin-bottom:16px;"><tr>
              <td style="background:rgba(255,255,255,0.22);border-radius:99px;padding:5px 18px;">
                <span style="font-size:11px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:2px;font-family:Georgia,serif;">
                  ${band.severity}
                </span>
              </td>
            </tr></table>
            <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:3px;color:rgba(255,255,255,0.72);font-family:Georgia,serif;">
              Your Wellbeing Results
            </p>
            <h1 style="margin:0 0 14px;font-family:Georgia,serif;font-size:28px;font-weight:400;color:#ffffff;line-height:1.25;">
              ${band.headline}${name ? `, ${name}` : ""}
            </h1>
            <table cellpadding="0" cellspacing="0" align="center"><tr>
              <td style="background:rgba(255,255,255,0.18);border-radius:99px;padding:6px 20px;">
                <span style="font-size:13px;color:rgba(255,255,255,0.92);font-family:Georgia,serif;">
                  Wellness Score: <strong>${score}</strong> / ${TOTAL_QUESTIONS * 3}
                </span>
              </td>
            </tr></table>
          </td>
        </tr>

        <!-- White body -->
        <tr>
          <td style="background:#ffffff;border-radius:0 0 20px 20px;padding:36px 36px 32px;border:1px solid #ddeae2;border-top:none;">

            ${band.showUrgentResources ? URGENT_RESOURCES_BLOCK : ""}

            ${introParagraphs}

            <!-- Divider -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 28px;">
              <tr><td style="height:1px;background:#c8ddd2;font-size:0;line-height:0;">&nbsp;</td></tr>
            </table>

            <!-- Screening result -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;border-radius:14px;border:1px solid ${band.color}28;background:${band.iconBg}70;">
              <tr>
                <td style="padding:20px 22px;">
                  <p style="margin:0 0 6px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:${band.color};font-weight:700;font-family:Georgia,serif;">
                    Here is What Stood Out
                  </p>
                  <p style="margin:0 0 12px;font-size:15px;color:#2c3e35;line-height:1.7;font-family:Georgia,serif;">
                    ${band.screeningResult}
                  </p>
                  <p style="margin:0;font-size:13px;color:#5a7264;line-height:1.65;font-style:italic;font-family:Georgia,serif;">
                    ${band.whatThisMeans}
                  </p>
                </td>
              </tr>
            </table>

            <!-- Score breakdown -->
            <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:${band.color};font-weight:700;font-family:Georgia,serif;">Your Area Breakdown</p>
            <p style="margin:0 0 14px;font-size:12px;color:#8da898;font-family:Georgia,serif;">How each area scored in your self-assessment.</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              ${answerRows}
            </table>

            <!-- Divider -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr><td style="height:1px;background:#c8ddd2;font-size:0;line-height:0;">&nbsp;</td></tr>
            </table>

            <!-- Tips -->
            <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:${band.color};font-weight:700;font-family:Georgia,serif;">3 Things You Can Try Right Now</p>
            <p style="margin:0 0 20px;font-size:12px;color:#8da898;font-family:Georgia,serif;">Evidence-based. No apps required.</p>
            <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:32px;">
              ${tipRows}
            </table>

            <!-- Divider -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr><td style="height:1px;background:#c8ddd2;font-size:0;line-height:0;">&nbsp;</td></tr>
            </table>

            <!-- CTA block — no pricing, no discount language -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:16px;background:${band.iconBg}80;border:1px solid ${band.accentColor}50;margin-bottom:24px;">
              <tr>
                <td style="padding:28px 28px 24px;">
                  <h3 style="margin:0 0 10px;font-family:Georgia,serif;font-size:20px;font-weight:400;color:#1c3a3a;">Take the next step.</h3>
                  <p style="margin:0 0 20px;font-size:15px;line-height:1.8;color:#2c3e35;font-family:Georgia,serif;">
                    A 50-minute session with a licensed Mentel therapist, matched specifically to what your results showed.
                    One conversation can shift more than you expect.
                  </p>
                  <table cellpadding="0" cellspacing="0"><tr>
                    <td>
                      <a href="${BOOKING_URL}"
                        style="display:inline-block;background:linear-gradient(135deg,${band.color},${band.accentColor});color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:13px 32px;border-radius:99px;font-family:Georgia,serif;">
                        ${band.cta}
                      </a>
                    </td>
                  </tr></table>
                </td>
              </tr>
            </table>

            <p style="margin:0;font-size:13px;line-height:1.7;color:#8da898;font-family:Georgia,serif;text-align:center;">
              Questions? Just reply to this email — we read every one.
            </p>

          </td>
        </tr>

        <!-- Disclaimer -->
        <tr>
          <td style="padding:16px 24px 0;">
            <p style="margin:0 0 20px;font-size:11px;color:#a0b5a8;line-height:1.6;text-align:center;font-family:Georgia,serif;">
              This wellness check-in is for informational purposes only and is not a substitute for professional mental health advice.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 16px;text-align:center;">
            <p style="margin:0 0 6px;font-size:11px;color:#aabdb3;font-family:Georgia,serif;">
              &copy; ${new Date().getFullYear()} Mentel &middot;
              <a href="https://trymentel.com/privacy" style="color:#7ba98b;text-decoration:none;">Privacy Policy</a>
              &middot;
              <a href="https://trymentel.com/unsubscribe" style="color:#7ba98b;text-decoration:none;">Unsubscribe</a>
            </p>
            <p style="margin:0;font-size:10px;color:#c0cfc8;font-family:Georgia,serif;">
              Mentel provides access to licensed therapists and does not provide medical diagnosis or clinical treatment.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Plain-text builder (admin) ─────────────────────────────────────────────────
function buildAdminText(
  name: string,
  email: string,
  phone: string,
  score: number,
  band: BandConfig,
  answers: Record<string, number>,
): string {
  const breakdown = Object.entries(answers)
    .map(([qId, val]) => `  ${questionLabels[qId] ?? qId}: ${val}/3`)
    .join("\n");

  const urgency = band.showUrgentResources
    ? "HIGH SEVERITY — FOLLOW UP URGENTLY"
    : score >= 13
      ? "Moderate — Follow Up Within 24h"
      : "Low / Mild — Standard Follow Up";

  return `MENTEL ADMIN — NEW LEAD
========================
${urgency}

CLIENT INFORMATION
------------------
Name:      ${name}
Email:     ${email}
Phone:     ${phone || "—"}
Submitted: ${new Date().toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short" })}

ASSESSMENT RESULTS
------------------
Band:     ${band.band}
Severity: ${band.severity}
Score:    ${score} / ${TOTAL_QUESTIONS * 3}

ANSWER BREAKDOWN
----------------
${breakdown}

---
Reply to this lead: mailto:${email}
Mentel Admin — Internal use only`;
}

// ── HTML admin email ───────────────────────────────────────────────────────────
function buildAdminEmail(
  name: string,
  email: string,
  phone: string,
  score: number,
  band: BandConfig,
  answers: Record<string, number>,
): string {
  const answerRows = Object.entries(answers)
    .map(
      ([qId, val]) => `
      <tr>
        <td width="120" style="padding:10px 12px;border-bottom:1px solid #e8eeea;font-size:13px;color:#4a5e52;font-weight:600;vertical-align:middle;font-family:Georgia,serif;">
          ${questionLabels[qId] ?? s(qId)}
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #e8eeea;vertical-align:middle;">
          ${scoreBar(val)}
        </td>
      </tr>`,
    )
    .join("");

  const urgencyStyles = band.showUrgentResources
    ? "background:#fde8e8;color:#b94a4f;"
    : score >= 13
      ? "background:#fdf3e8;color:#b97a30;"
      : "background:#edf7f1;color:#4e8c6a;";

  const urgencyText = band.showUrgentResources
    ? "High Severity — Follow Up Urgently"
    : score >= 13
      ? "Moderate — Follow Up Within 24h"
      : "Low / Mild — Standard Follow Up";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>New Wellness Assessment — Mentel Admin</title>
</head>
<body style="margin:0;padding:0;background:#f0f3f1;font-family:Georgia,serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f3f1;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

        <!-- Admin header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1c3a3a,#2d5c47);border-radius:16px 16px 0 0;padding:22px 28px;">
            <table cellpadding="0" cellspacing="0" width="100%"><tr>
              <td style="vertical-align:middle;">
                <span style="font-family:Georgia,serif;font-size:18px;color:#ffffff;">Mentel Admin</span>
              </td>
              <td style="text-align:right;vertical-align:middle;">
                <table cellpadding="0" cellspacing="0" align="right"><tr>
                  <td style="background:rgba(255,255,255,0.15);border-radius:99px;padding:4px 12px;">
                    <span style="font-size:10px;color:rgba(255,255,255,0.85);text-transform:uppercase;letter-spacing:1px;font-family:Georgia,serif;">New Lead</span>
                  </td>
                </tr></table>
              </td>
            </tr></table>
          </td>
        </tr>

        <!-- White body -->
        <tr>
          <td style="background:#ffffff;border-radius:0 0 16px 16px;padding:28px;border:1px solid #dde8e0;border-top:none;">

            <!-- Urgency + score row -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;"><tr>
              <td style="vertical-align:middle;">
                <table cellpadding="0" cellspacing="0"><tr>
                  <td style="${urgencyStyles}border-radius:99px;padding:5px 14px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;font-family:Georgia,serif;">
                    ${urgencyText}
                  </td>
                </tr></table>
              </td>
              <td style="text-align:right;vertical-align:middle;">
                <table cellpadding="0" cellspacing="0" align="right"><tr>
                  <td style="background:linear-gradient(135deg,${band.color},${band.accentColor});border-radius:10px;padding:8px 16px;">
                    <span style="font-size:13px;color:#ffffff;font-weight:600;white-space:nowrap;font-family:Georgia,serif;">
                      ${band.severity} &middot; ${score}/${TOTAL_QUESTIONS * 3}
                    </span>
                  </td>
                </tr></table>
              </td>
            </tr></table>

            <!-- Client info -->
            <h3 style="margin:0 0 12px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#7ba98b;font-family:Georgia,serif;">Client Information</h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7faf8;border-radius:12px;border:1px solid #e4ede7;margin-bottom:24px;">
              <tr>
                <td width="100" style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;font-family:Georgia,serif;">Name</td>
                <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:14px;color:#1c3a3a;font-weight:600;font-family:Georgia,serif;">${name}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;font-family:Georgia,serif;">Email</td>
                <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;">
                  <a href="mailto:${s(email)}" style="font-size:14px;color:#3d8b8b;text-decoration:none;font-weight:500;font-family:Georgia,serif;">${s(email)}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;font-family:Georgia,serif;">Phone</td>
                <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:14px;color:#1c3a3a;font-family:Georgia,serif;">${s(phone) || "—"}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;font-family:Georgia,serif;">Submitted</td>
                <td style="padding:12px 16px;font-size:14px;color:#1c3a3a;font-family:Georgia,serif;">${new Date().toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short" })}</td>
              </tr>
            </table>

            <!-- Answer breakdown -->
            <h3 style="margin:0 0 12px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#7ba98b;font-family:Georgia,serif;">Answer Breakdown</h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;border:1px solid #e4ede7;margin-bottom:14px;">
              <tr style="background:#f7faf8;">
                <th width="120" style="padding:10px 12px;text-align:left;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;font-weight:500;font-family:Georgia,serif;">Area</th>
                <th style="padding:10px 12px;text-align:left;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;font-weight:500;font-family:Georgia,serif;">Score</th>
              </tr>
              ${answerRows}
            </table>

            <!-- Total -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;border:1px solid ${band.color}30;background:#f9fbf9;margin-bottom:28px;">
              <tr>
                <td style="padding:14px 18px;font-size:13px;color:#1c3a3a;font-weight:600;font-family:Georgia,serif;">Total Wellness Score</td>
                <td style="padding:14px 18px;text-align:right;">
                  <span style="font-size:20px;font-weight:700;color:${band.color};font-family:Georgia,serif;">${score}</span>
                  <span style="font-size:13px;color:#8da898;font-family:Georgia,serif;"> / ${TOTAL_QUESTIONS * 3}</span>
                </td>
              </tr>
            </table>

            <!-- Reply CTA -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center">
                <a href="mailto:${s(email)}?subject=Your%20Mentel%20Wellbeing%20Results&body=Hi%20${encodeURIComponent(name)}%2C%0D%0A%0D%0AThank%20you%20for%20completing%20the%20Mentel%20wellbeing%20check-in..."
                  style="display:inline-block;background:linear-gradient(135deg,#1c3a3a,#3d8b8b);color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:99px;font-family:Georgia,serif;">
                  Reply to ${name}
                </a>
              </td></tr>
            </table>

          </td>
        </tr>

        <tr>
          <td style="padding:20px 0;text-align:center;">
            <p style="margin:0;font-size:11px;color:#9aada3;font-family:Georgia,serif;">Mentel Admin &middot; Internal use only</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
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

    const safeName = s(name);
    const safeEmail = s(email);
    const safePhone = s(phone);

    const rawScore = Number((body as Record<string, unknown>).score);
    const score = Number.isFinite(rawScore)
      ? Math.max(0, Math.min(rawScore, TOTAL_QUESTIONS * 3))
      : 0;

    const band = getBand(score);

    const safeAnswers: Record<string, number> = {};
    for (const [k, v] of Object.entries(
      (answers as Record<string, unknown>) ?? {},
    )) {
      const n = Number(v);
      if (/^q\d+$/.test(k) && Number.isFinite(n)) {
        safeAnswers[k] = Math.max(0, Math.min(3, n));
      }
    }

    const userHtml = buildUserEmail(safeName, score, band, safeAnswers);
    const userText = buildUserText(safeName, score, band, safeAnswers);

    const adminHtml = buildAdminEmail(
      safeName,
      safeEmail,
      safePhone,
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

    const [userResult, adminResult] = await Promise.allSettled([
      resend.emails.send({
        from: FROM_EMAIL,
        to: [String(email)],
        subject: `Your Mentel Wellbeing Results — ${band.severity}`,
        html: userHtml,
        text: userText,
      }),
      resend.emails.send({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject: `New Assessment: ${safeName} — ${band.severity} (${score}pts)`,
        html: adminHtml,
        text: adminText,
        replyTo: String(email),
      }),
    ]);

    if (userResult.status === "rejected") {
      console.error("User email failed:", userResult.reason);
    }
    if (adminResult.status === "rejected") {
      console.error("Admin email failed:", adminResult.reason);
    }

    // // ── Silent DB save — fire-and-forget ──────────────────────────────────
    // db.lead
    //   .create({
    //     data: {
    //       name: safeName,
    //       email: String(email),
    //       phone: safePhone || null,
    //       score,
    //       band: band.band,
    //       severity: band.severity,
    //       answers: safeAnswers,
    //       status: "new",
    //     },
    //   })
    //   .catch((err: unknown) => {
    //     console.error("DB save failed (non-fatal):", err);
    //   });

    // if (adminResult.status === "rejected" && userResult.status === "rejected") {
    //   return NextResponse.json(
    //     { success: false, error: "Both emails failed to send" },
    //     { status: 500 },
    //   );
    // }

    // ── Silent DB save — 3 attempts with backoff, never blocks the response ───────
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
          },
        }),
      3, // attempts
      300, // 300ms → 600ms → 1200ms
    ).catch((err: unknown) => {
      console.error("DB save failed after 3 retries (non-fatal):", err);
    });

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
