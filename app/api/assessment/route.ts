// import { NextResponse } from "next/server";
// import { Resend } from "resend";
// import { db } from "@/lib/db";
// import { retryAsync } from "@/utilz";
// import { after } from "next/server";

// const resend = new Resend(process.env.RESEND_API_KEY);

// const ADMIN_EMAIL = "hello@mail.trymentel.com";
// const FROM_EMAIL = "Mentel <hello@mail.trymentel.com>";
// const BOOKING_URL = "https://trymentel.com/#book";
// const TOTAL_QUESTIONS = 8;

// // ── Sanitizer ──────────────────────────────────────────────────────────────────
// function s(str: unknown): string {
//   return String(str ?? "")
//     .replace(/&/g, "&amp;")
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;")
//     .replace(/"/g, "&quot;");
// }

// // ── Score bar (Gmail-safe, pure table) ─────────────────────────────────────────
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
// interface BandConfig {
//   band: string;
//   severity: string;
//   headline: string;
//   color: string;
//   accentColor: string;
//   iconBg: string;
//   severityBadgeBg: string;
//   severityBadgeText: string;
//   screeningResult: string;
//   whatThisMeans: string;
//   intro: string;
//   tips: string[];
//   showUrgentResources: boolean;
//   cta: string;
// }

// function getBand(score: number): BandConfig {
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

// // ── Urgent support block ───────────────────────────────────────────────────────
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
//           <a href="${BOOKING_URL}"
//             style="display:inline-block;background:#b94a4f;color:#ffffff;text-decoration:none;font-size:13px;font-weight:600;padding:11px 24px;border-radius:99px;font-family:Georgia,serif;">
//             Talk to a Mentel therapist now
//           </a>
//         </td>
//       </tr></table>
//     </td>
//   </tr>
// </table>`;

// // ── Plain-text builder (user) ──────────────────────────────────────────────────
// function buildUserText(
//   name: string,
//   score: number,
//   band: BandConfig,
//   answers: Record<string, number>,
// ): string {
//   const intro = band.intro.replace(/\n/g, "\n\n");

//   const breakdown = Object.entries(answers)
//     .map(([qId, val]) => `  ${questionLabels[qId] ?? qId}: ${val}/3`)
//     .join("\n");

//   // Strip HTML tags from tips for plain text
//   const tips = band.tips
//     .map((tip, i) => `${i + 1}. ${tip.replace(/<[^>]+>/g, "")}`)
//     .join("\n\n");

//   const urgentBlock = band.showUrgentResources
//     ? `\n\n--- IF YOU ARE IN IMMEDIATE DISTRESS ---\nIf you are feeling unsafe right now, please reach out to someone you trust or visit your nearest hospital. You matter, and help is available.\n`
//     : "";

//   return `Hi ${name},

// Thank you for completing your Mentel wellbeing check-in.
// ${urgentBlock}
// YOUR RESULTS
// ------------
// Wellness Score: ${score} / ${TOTAL_QUESTIONS * 3}
// Severity: ${band.severity}

// ${intro}

// WHAT STOOD OUT
// --------------
// ${band.screeningResult}

// ${band.whatThisMeans}

// YOUR AREA BREAKDOWN
// -------------------
// ${breakdown}

// 3 THINGS YOU CAN TRY RIGHT NOW
// --------------------------------
// ${tips}

// TAKE THE NEXT STEP
// ------------------
// A 50-minute session with a licensed Mentel therapist, matched specifically to your results.

// Book here: ${BOOKING_URL}

// Questions? Just reply to this email — we read every one.

// ---
// This wellness check-in is for informational purposes only and is not a substitute for professional mental health advice.

// (c) ${new Date().getFullYear()} Mentel
// Privacy Policy: https://trymentel.com/privacy
// Unsubscribe: https://trymentel.com/unsubscribe

// Mentel provides access to licensed therapists and does not provide medical diagnosis or clinical treatment.`;
// }

// // ── HTML user email ────────────────────────────────────────────────────────────
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
//   <title>Your Mentel Wellbeing Results</title>
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
//                 height="40"
//                 style="display:block;height:auto;border:0;outline:none;text-decoration:none;"
//               />
//             </a>
//           </td>
//         </tr>

//         <!-- Hero band card -->
//         <tr>
//           <td align="center"
//             style="background:linear-gradient(135deg,${band.color},${band.accentColor});border-radius:20px 20px 0 0;padding:40px 32px 36px;">
//             <table cellpadding="0" cellspacing="0" align="center" style="margin-bottom:16px;"><tr>
//               <td style="background:rgba(255,255,255,0.22);border-radius:99px;padding:5px 18px;">
//                 <span style="font-size:11px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:2px;font-family:Georgia,serif;">
//                   ${band.severity}
//                 </span>
//               </td>
//             </tr></table>
//             <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:3px;color:rgba(255,255,255,0.72);font-family:Georgia,serif;">
//               Your Wellbeing Results
//             </p>
//             <h1 style="margin:0 0 14px;font-family:Georgia,serif;font-size:28px;font-weight:400;color:#ffffff;line-height:1.25;">
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
//           <td style="background:#ffffff;border-radius:0 0 20px 20px;padding:36px 36px 32px;border:1px solid #ddeae2;border-top:none;">

//             ${band.showUrgentResources ? URGENT_RESOURCES_BLOCK : ""}

//             ${introParagraphs}

//             <!-- Divider -->
//             <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 28px;">
//               <tr><td style="height:1px;background:#c8ddd2;font-size:0;line-height:0;">&nbsp;</td></tr>
//             </table>

//             <!-- Screening result -->
//             <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;border-radius:14px;border:1px solid ${band.color}28;background:${band.iconBg}70;">
//               <tr>
//                 <td style="padding:20px 22px;">
//                   <p style="margin:0 0 6px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:${band.color};font-weight:700;font-family:Georgia,serif;">
//                     Here is What Stood Out
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

//             <!-- Tips -->
//             <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:${band.color};font-weight:700;font-family:Georgia,serif;">3 Things You Can Try Right Now</p>
//             <p style="margin:0 0 20px;font-size:12px;color:#8da898;font-family:Georgia,serif;">Evidence-based. No apps required.</p>
//             <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:32px;">
//               ${tipRows}
//             </table>

//             <!-- Divider -->
//             <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
//               <tr><td style="height:1px;background:#c8ddd2;font-size:0;line-height:0;">&nbsp;</td></tr>
//             </table>

//             <!-- CTA block — no pricing, no discount language -->
//             <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:16px;background:${band.iconBg}80;border:1px solid ${band.accentColor}50;margin-bottom:24px;">
//               <tr>
//                 <td style="padding:28px 28px 24px;">
//                   <h3 style="margin:0 0 10px;font-family:Georgia,serif;font-size:20px;font-weight:400;color:#1c3a3a;">Take the next step.</h3>
//                   <p style="margin:0 0 20px;font-size:15px;line-height:1.8;color:#2c3e35;font-family:Georgia,serif;">
//                     A 50-minute session with a licensed Mentel therapist, matched specifically to what your results showed.
//                     One conversation can shift more than you expect.
//                   </p>
//                   <table cellpadding="0" cellspacing="0"><tr>
//                     <td>
//                       <a href="${BOOKING_URL}"
//                         style="display:inline-block;background:linear-gradient(135deg,${band.color},${band.accentColor});color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:13px 32px;border-radius:99px;font-family:Georgia,serif;">
//                         ${band.cta}
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

//         <!-- Disclaimer -->
//         <tr>
//           <td style="padding:16px 24px 0;">
//             <p style="margin:0 0 20px;font-size:11px;color:#a0b5a8;line-height:1.6;text-align:center;font-family:Georgia,serif;">
//               This wellness check-in is for informational purposes only and is not a substitute for professional mental health advice.
//             </p>
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
//             </p>
//           </td>
//         </tr>

//       </table>
//     </td></tr>
//   </table>
// </body>
// </html>`;
// }

// // ── Plain-text builder (admin) ─────────────────────────────────────────────────
// function buildAdminText(
//   name: string,
//   email: string,
//   phone: string,
//   score: number,
//   band: BandConfig,
//   answers: Record<string, number>,
// ): string {
//   const breakdown = Object.entries(answers)
//     .map(([qId, val]) => `  ${questionLabels[qId] ?? qId}: ${val}/3`)
//     .join("\n");

//   const urgency = band.showUrgentResources
//     ? "HIGH SEVERITY — FOLLOW UP URGENTLY"
//     : score >= 13
//       ? "Moderate — Follow Up Within 24h"
//       : "Low / Mild — Standard Follow Up";

//   return `MENTEL ADMIN — NEW LEAD
// ========================
// ${urgency}

// CLIENT INFORMATION
// ------------------
// Name:      ${name}
// Email:     ${email}
// Phone:     ${phone || "—"}
// Submitted: ${new Date().toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short" })}

// ASSESSMENT RESULTS
// ------------------
// Band:     ${band.band}
// Severity: ${band.severity}
// Score:    ${score} / ${TOTAL_QUESTIONS * 3}

// ANSWER BREAKDOWN
// ----------------
// ${breakdown}

// ---
// Reply to this lead: mailto:${email}
// Mentel Admin — Internal use only`;
// }

// // ── HTML admin email ───────────────────────────────────────────────────────────
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
//     ? "High Severity — Follow Up Urgently"
//     : score >= 13
//       ? "Moderate — Follow Up Within 24h"
//       : "Low / Mild — Standard Follow Up";

//   return `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8"/>
//   <meta name="viewport" content="width=device-width,initial-scale=1"/>
//   <title>New Wellness Assessment — Mentel Admin</title>
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
//                 <span style="font-family:Georgia,serif;font-size:18px;color:#ffffff;">Mentel Admin</span>
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
//           <td style="background:#ffffff;border-radius:0 0 16px 16px;padding:28px;border:1px solid #dde8e0;border-top:none;">

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
//                     <span style="font-size:13px;color:#ffffff;font-weight:600;white-space:nowrap;font-family:Georgia,serif;">
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
//                 <a href="mailto:${s(email)}?subject=Your%20Mentel%20Wellbeing%20Results&body=Hi%20${encodeURIComponent(name)}%2C%0D%0A%0D%0AThank%20you%20for%20completing%20the%20Mentel%20wellbeing%20check-in..."
//                   style="display:inline-block;background:linear-gradient(135deg,#1c3a3a,#3d8b8b);color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:99px;font-family:Georgia,serif;">
//                   Reply to ${name}
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
//     const userText = buildUserText(safeName, score, band, safeAnswers);

//     const adminHtml = buildAdminEmail(
//       safeName,
//       safeEmail,
//       safePhone,
//       score,
//       band,
//       safeAnswers,
//     );
//     const adminText = buildAdminText(
//       safeName,
//       String(email),
//       String(phone ?? ""),
//       score,
//       band,
//       safeAnswers,
//     );

//     const [userResult, adminResult] = await Promise.allSettled([
//       resend.emails.send({
//         from: FROM_EMAIL,
//         to: [String(email)],
//         subject: `Your Mentel Wellbeing Results — ${band.severity}`,
//         html: userHtml,
//         text: userText,
//       }),
//       resend.emails.send({
//         from: FROM_EMAIL,
//         to: [ADMIN_EMAIL],
//         subject: `New Assessment: ${safeName} — ${band.severity} (${score}pts)`,
//         html: adminHtml,
//         text: adminText,
//         replyTo: String(email),
//       }),
//     ]);

//     if (userResult.status === "rejected") {
//       console.error("User email failed:", userResult.reason);
//     }
//     if (adminResult.status === "rejected") {
//       console.error("Admin email failed:", adminResult.reason);
//     }

//     // // ── Silent DB save — fire-and-forget ──────────────────────────────────
//     // db.lead
//     //   .create({
//     //     data: {
//     //       name: safeName,
//     //       email: String(email),
//     //       phone: safePhone || null,
//     //       score,
//     //       band: band.band,
//     //       severity: band.severity,
//     //       answers: safeAnswers,
//     //       status: "new",
//     //     },
//     //   })
//     //   .catch((err: unknown) => {
//     //     console.error("DB save failed (non-fatal):", err);
//     //   });

//     // if (adminResult.status === "rejected" && userResult.status === "rejected") {
//     //   return NextResponse.json(
//     //     { success: false, error: "Both emails failed to send" },
//     //     { status: 500 },
//     //   );
//     // }

//     // inside your POST handler, replace the retryAsync block with:
//     after(
//       retryAsync(
//         () =>
//           db.lead.create({
//             data: {
//               name: safeName,
//               email: String(email),
//               phone: safePhone || null,
//               score,
//               band: band.band,
//               severity: band.severity,
//               answers: safeAnswers,
//               status: "new",
//             },
//           }),
//         5,
//         500,
//       ).catch((err: unknown) => {
//         console.error("[DB] Lead save failed after all retries:", err);
//       }),
//     );

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
import { after } from "next/server";
import { logger } from "@/lib/logger";
import { EVENTS } from "@/utilz";

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = "hello@mail.trymentel.com";
const FROM_EMAIL = "Mentel <hello@mail.trymentel.com>";
const BOOKING_URL = "https://www.trymentel.com/book";
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

// ── Pattern names & intelligence (mirrors page.tsx getBandIntel) ───────────────
const patternNames: Record<string, string> = {
  Low: "Latent Drift Pattern",
  Mild: "Cortisol Stall Pattern",
  Moderate: "Functional Freeze Pattern",
  High: "Critical Threshold Pattern",
};

const percentiles: Record<string, string> = {
  Low: "top 12% of stable individuals in our network",
  Mild: "top 28% of high-stress individuals we've assessed",
  Moderate: "top 41% of moderate-severity cases we see monthly",
  High: "top 15% of high-distress cases — this needs attention",
};

const hooks: Record<string, string> = {
  Low: "You appear stable — but stable and thriving are not the same thing.",
  Mild: "Your results suggest a Type 2 Cortisol Stall — not burnout, but the stage just before it.",
  Moderate:
    "To the outside world you're still functioning. Internally, something has quietly shifted.",
  High: "What you're experiencing is real — and it's unlikely to resolve without the right support.",
};

const cliffhangers: Record<string, string> = {
  Low: "Your data shows one specific low-grade pattern that quietly drains mental energy in high-functioning people. It rarely feels like a problem — until it becomes one. Most people only recognise it in hindsight.",
  Mild: "This isn't just tiredness. There's a specific neurological pattern in your responses that affects decision-making and motivation — even when you're technically resting. Most people try to fix this with more rest. For this pattern, rest alone makes the fog worse.",
  Moderate:
    "Your data shows what we call a Functional Freeze — where the gap between how you appear and how you actually feel has been widening for some time. There is one specific energy leak driving this. No amount of rest, holidays, or willpower closes it without addressing the root.",
  High: "Your responses place you in a Critical Threshold state. People at this stage describe feeling like they're disappearing behind a functional exterior. Pushing through alone doesn't work — not because of weakness, but because of how the nervous system responds to sustained high-stress load.",
};

const lockedLabels: Record<string, string> = {
  Low: "Your Latent Drift Profile + 6-Month Forecast",
  Mild: "Your 3 Daily Triggers + Reverse-Reset Protocol",
  Moderate: "Your Energy Leak Report + 30-Day Recovery Protocol",
  High: "Your Personal Crisis-to-Clarity Roadmap",
};

const lockedTeasers: Record<string, string> = {
  Low: "We've identified the one silent habit in your routine keeping your baseline lower than it needs to be. Your full profile names it — and shows you the 3-step correction.",
  Mild: "We've identified 3 specific habits in your routine actively reinforcing this pattern. Your full profile names each one — and shows the sequence to interrupt them.",
  Moderate:
    "We've pinpointed the single biggest drain in your mental energy based on your answers. Your full profile names it — and gives you the 30-day protocol our therapists use to close it.",
  High: "A licensed Mentel therapist has been flagged to review your profile directly. Your full report includes the first 3 steps specifically for your pattern — and a same-week session option.",
};

const tipLabels: Record<string, string> = {
  Low: "One thing worth trying this week",
  Mild: "One thing worth trying this week",
  Moderate: "One thing worth trying this week",
  High: "One thing to do today — not tomorrow",
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
  const patternName = patternNames[band.band] ?? band.severity;
  const percentile = percentiles[band.band] ?? "";
  const hook = hooks[band.band] ?? band.headline;
  const cliffhanger = cliffhangers[band.band] ?? band.screeningResult;
  const lockedLabel = lockedLabels[band.band] ?? "";
  const lockedTeaser = lockedTeasers[band.band] ?? "";
  const tipLabel = tipLabels[band.band] ?? "One thing worth trying";
  const tip = band.tips[0]?.replace(/<[^>]+>/g, "") ?? "";

  const urgentBlock = band.showUrgentResources
    ? `\n⚠ IF YOU ARE IN IMMEDIATE DISTRESS\nIf you feel unsafe right now, please reach out to someone you trust or visit your nearest hospital. You matter — help is available immediately.\n`
    : "";

  return `Hi ${name},

Your Mentel results are in.
${urgentBlock}
YOUR PATTERN
------------
${patternName} · ${band.severity}
${percentile}
Score: ${score} / ${TOTAL_QUESTIONS * 3}

WHAT YOUR RESULTS ARE TELLING US
---------------------------------
${hook}

${cliffhanger}

WHAT THIS MEANS (LOCKED)
-------------------------
🔒 ${lockedLabel}
${lockedTeaser}

This is covered in full during your first session.

${tipLabel.toUpperCase()}
${"-".repeat(tipLabel.length)}
${tip}

Your full recovery protocol is covered in your first session.

TAKE THE NEXT STEP
------------------
One 50-minute session with a licensed Mentel therapist, matched to your specific pattern.
We'll name your triggers, explain your profile in full, and give you a concrete next step.

Book here: ${BOOKING_URL}

Questions? Just reply to this email — we read every one.

---
This wellness check-in is for informational purposes only and is not a substitute for professional mental health advice.

(c) ${new Date().getFullYear()} Mentel
Privacy Policy: https://www.trymentel.com/privacy
Unsubscribe: https://www.trymentel.com/unsubscribe

Mentel provides access to licensed therapists and does not provide medical diagnosis or clinical treatment.`;
}

// ── HTML user email ────────────────────────────────────────────────────────────
function buildUserEmail(
  name: string,
  score: number,
  band: BandConfig,
  answers: Record<string, number>,
): string {
  const patternName = patternNames[band.band] ?? band.severity;
  const percentile = percentiles[band.band] ?? "";
  const hook = hooks[band.band] ?? band.headline;
  const cliffhanger = cliffhangers[band.band] ?? band.screeningResult;
  const lockedLabel = lockedLabels[band.band] ?? "Your Full Profile";
  const lockedTeaser = lockedTeasers[band.band] ?? "";
  const tipLabel = tipLabels[band.band] ?? "One thing worth trying";
  const tip = band.tips[0] ?? "";

  const urgentBlock = band.showUrgentResources ? URGENT_RESOURCES_BLOCK : "";

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
              <img src="https://trymentel.com/logo.png" alt="Mentel" width="120" height="40" style="display:block;height:auto;border:0;outline:none;text-decoration:none;" />
            </a>
          </td>
        </tr>

        <!-- Hero: pattern name + percentile -->
        <tr>
          <td align="center" style="background:linear-gradient(135deg,${band.color},${band.accentColor});border-radius:20px 20px 0 0;padding:40px 32px 36px;">
            <table cellpadding="0" cellspacing="0" align="center" style="margin-bottom:12px;"><tr>
              <td style="background:rgba(255,255,255,0.18);border-radius:99px;padding:4px 16px;">
                <span style="font-size:11px;color:rgba(255,255,255,0.9);font-family:Georgia,serif;">${s(percentile)}</span>
              </td>
            </tr></table>
            <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:3px;color:rgba(255,255,255,0.65);font-family:Georgia,serif;">Your Pattern</p>
            <h1 style="margin:0 0 10px;font-family:Georgia,serif;font-size:28px;font-weight:400;color:#ffffff;line-height:1.2;">
              ${s(patternName)}${name ? ` — ${s(name)}` : ""}
            </h1>
            <table cellpadding="0" cellspacing="0" align="center"><tr>
              <td style="background:rgba(255,255,255,0.18);border-radius:99px;padding:5px 18px;">
                <span style="font-size:12px;color:rgba(255,255,255,0.88);font-family:Georgia,serif;">
                  ${s(band.severity)} · Score <strong>${score}</strong> / ${TOTAL_QUESTIONS * 3}
                </span>
              </td>
            </tr></table>
          </td>
        </tr>

        <!-- White body -->
        <tr>
          <td style="background:#ffffff;border-radius:0 0 20px 20px;padding:36px 36px 32px;border:1px solid #ddeae2;border-top:none;">

            ${urgentBlock}

            <!-- Hook -->
            <p style="margin:0 0 6px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:${band.color};font-weight:700;font-family:Georgia,serif;">What your results are telling us</p>
            <p style="margin:0 0 12px;font-family:Georgia,serif;font-size:20px;font-weight:400;color:#1c3a3a;line-height:1.3;">${s(hook)}</p>
            <p style="margin:0 0 28px;font-size:15px;color:#4a5e52;line-height:1.8;font-family:Georgia,serif;">${s(cliffhanger)}</p>

            <!-- Divider -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;"><tr><td style="height:1px;background:#c8ddd2;">&nbsp;</td></tr></table>

            <!-- Locked insight -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;border-radius:14px;border:1px solid ${band.color}28;background:${band.iconBg}70;">
              <tr><td style="padding:20px 22px;">
                <p style="margin:0 0 8px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:${band.color};font-weight:700;font-family:Georgia,serif;">
                  🔒 ${s(lockedLabel)}
                </p>
                <p style="margin:0 0 10px;font-size:15px;color:#2c3e35;line-height:1.7;font-family:Georgia,serif;">${s(lockedTeaser)}</p>
                <p style="margin:0;font-size:13px;color:${band.color};font-style:italic;font-family:Georgia,serif;">Revealed in full during your first session.</p>
              </td></tr>
            </table>

            <!-- Divider -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;"><tr><td style="height:1px;background:#c8ddd2;">&nbsp;</td></tr></table>

            <!-- One tip -->
            <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:${band.color};font-weight:700;font-family:Georgia,serif;">${s(tipLabel)}</p>
            <p style="margin:0 0 10px;font-size:15px;color:#4a5e52;line-height:1.8;font-family:Georgia,serif;">${tip}</p>
            <p style="margin:0 0 28px;font-size:13px;color:#8da898;font-style:italic;font-family:Georgia,serif;">
              Your full recovery protocol — including the remaining steps for your specific pattern — is covered in your first session.
            </p>

            <!-- Divider -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;"><tr><td style="height:1px;background:#c8ddd2;">&nbsp;</td></tr></table>

            <!-- CTA -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:16px;background:${band.iconBg}80;border:1px solid ${band.accentColor}50;margin-bottom:24px;">
              <tr><td style="padding:28px 28px 24px;">
                <h3 style="margin:0 0 10px;font-family:Georgia,serif;font-size:20px;font-weight:400;color:#1c3a3a;">One session. Your full picture.</h3>
                <p style="margin:0 0 8px;font-size:15px;line-height:1.8;color:#2c3e35;font-family:Georgia,serif;">
                  A 50-minute session with a licensed Mentel therapist, matched to your specific pattern.
                  We'll name your triggers, explain your profile in full, and give you a concrete next step.
                </p>
                <p style="margin:0 0 20px;font-size:13px;color:#8da898;font-family:Georgia,serif;">
                  Your ${s(lockedLabel)} is covered in your first session.
                </p>
                <table cellpadding="0" cellspacing="0"><tr>
                  <td>
                    <a href="${BOOKING_URL}" style="display:inline-block;background:linear-gradient(135deg,${band.color},${band.accentColor});color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:13px 32px;border-radius:99px;font-family:Georgia,serif;">
                      Book your session
                    </a>
                  </td>
                </tr></table>
              </td></tr>
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

// ── Plain-text builder (admin) — UNCHANGED ────────────────────────────────────
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

// ── HTML admin email — UNCHANGED ──────────────────────────────────────────────
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
        <tr>
          <td style="background:#ffffff;border-radius:0 0 16px 16px;padding:28px;border:1px solid #dde8e0;border-top:none;">
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
            <h3 style="margin:0 0 12px;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#7ba98b;font-family:Georgia,serif;">Answer Breakdown</h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;border:1px solid #e4ede7;margin-bottom:14px;">
              <tr style="background:#f7faf8;">
                <th width="120" style="padding:10px 12px;text-align:left;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;font-weight:500;font-family:Georgia,serif;">Area</th>
                <th style="padding:10px 12px;text-align:left;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;font-weight:500;font-family:Georgia,serif;">Score</th>
              </tr>
              ${answerRows}
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;border:1px solid ${band.color}30;background:#f9fbf9;margin-bottom:28px;">
              <tr>
                <td style="padding:14px 18px;font-size:13px;color:#1c3a3a;font-weight:600;font-family:Georgia,serif;">Total Wellness Score</td>
                <td style="padding:14px 18px;text-align:right;">
                  <span style="font-size:20px;font-weight:700;color:${band.color};font-family:Georgia,serif;">${score}</span>
                  <span style="font-size:13px;color:#8da898;font-family:Georgia,serif;"> / ${TOTAL_QUESTIONS * 3}</span>
                </td>
              </tr>
            </table>
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

// ── API Route — UNCHANGED ──────────────────────────────────────────────────────
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
        subject: `Your Mentel Results — ${patternNames[band.band] ?? band.severity}`,
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
            },
          }),
        5,
        500,
      ).catch((err: unknown) => {
        console.error("[DB] Lead save failed after all retries:", err);
      }),
    );

    logger.business(EVENTS.LEAD_CAPTURED, {
      meta: {
        email: safeEmail,
        name: safeName,
        score,
        ip,
      },
    });

    if (adminResult.status === "rejected" && userResult.status === "rejected") {
      return NextResponse.json(
        { success: false, error: "Both emails failed to send" },
        { status: 500 },
      );
    }

    logger.business(EVENTS.ASSESSMENT_COMPLETED, {
      meta: {
        email: safeEmail,
        score,
        band: band.band,
        severity: band.severity,
        ip,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Assessment route error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}
