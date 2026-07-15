// // app/api/paystack/webhook/route.ts
// //
// // ── How it works ──────────────────────────────────────────────────────────────
// // 1. Paystack sends a POST to this URL the moment a payment is confirmed on
// //    their servers — completely independent of the user's browser.
// // 2. We verify the HMAC-SHA512 signature using your secret key so only real
// //    Paystack events are processed (not forged requests).
// // 3. On `charge.success` we extract the booking metadata and send two emails:
// //    - Client: personalised booking confirmation with session details
// //    - Admin:  full payment receipt with all metadata
// //
// // ── Setup in Paystack dashboard ───────────────────────────────────────────────
// // Settings → API Keys & Webhooks → Webhook URL:
// //   https://yourdomain.com/api/paystack/webhook
// // That's it. No extra config needed.
// // ─────────────────────────────────────────────────────────────────────────────

// import { NextResponse } from "next/server";
// import { createHmac } from "crypto";
// import { Resend } from "resend";
// import { withRateLimit } from "@/lib/withRateLimit";
// import { sendFbConversionEvent } from "@/lib/fbConversion";
// import { recordPayment } from "@/lib/payments/record-payment";

// const resend = new Resend(process.env.RESEND_API_KEY);
// const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!; // sk_live_...
// const ADMIN_EMAIL = "hello@mail.trymentel.com";
// const FROM_EMAIL = "Mentel <hello@mail.trymentel.com>";
// const BOOKING_URL = "https://trymentel.com/#book";

// // ── HTML sanitizer ─────────────────────────────────────────────────────────────
// function s(str: unknown): string {
//   return String(str ?? "")
//     .replace(/&/g, "&amp;")
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;")
//     .replace(/"/g, "&quot;");
// }

// // ── Format NGN amount (Paystack sends kobo) ────────────────────────────────────
// function formatNGN(kobo: number): string {
//   return new Intl.NumberFormat("en-NG", {
//     style: "currency",
//     currency: "NGN",
//     minimumFractionDigits: 0,
//   }).format(kobo / 100);
// }

// // ── CLIENT CONFIRMATION EMAIL ─────────────────────────────────────────────────
// function buildClientEmail(data: {
//   name: string;
//   email: string;
//   plan: string;
//   reason: string;
//   amount: string;
//   reference: string;
//   date: string;
// }): string {
//   const { name, plan, reason, amount, reference, date } = data;
//   const firstName = name.split(" ")[0] || name;
//   const isMonthly = plan.toLowerCase().includes("monthly");

//   const perks = isMonthly
//     ? [
//         "4 therapy sessions this month",
//         "Priority therapist matching",
//         "Dedicated support channel",
//         "Progress tracking",
//       ]
//     : [
//         "1 full therapy session",
//         "Licensed & verified therapist",
//         "Response within 24 hours",
//         "Confidential & judgment-free",
//       ];

//   const perkRows = perks
//     .map(
//       (p) => `
//     <tr>
//       <td width="24" style="padding:5px 0;vertical-align:top;">
//         <table cellpadding="0" cellspacing="0"><tr>
//           <td width="16" height="16" align="center" valign="middle"
//             style="width:16px;height:16px;border-radius:50%;background:linear-gradient(135deg,#7ba98b,#3d8b8b);font-size:0;">&nbsp;</td>
//         </tr></table>
//       </td>
//       <td style="padding:5px 0 5px 10px;vertical-align:middle;">
//         <span style="font-size:13px;color:#5a7264;line-height:1.5;">${p}</span>
//       </td>
//     </tr>`,
//     )
//     .join("");

//   return `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8"/>
//   <meta name="viewport" content="width=device-width,initial-scale=1"/>
//   <title>Booking Confirmed — Mentel</title>
// </head>
// <body style="margin:0;padding:0;background:#f4f7f5;font-family:Georgia,serif;">

//   <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f5;padding:40px 16px;">
//     <tr><td align="center">
//       <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

//         <!-- Logo -->
//         <tr>
//           <td align="center" style="padding-bottom:28px;">
//             <table cellpadding="0" cellspacing="0"><tr>
//               <td width="32" height="32" style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#7ba98b,#3d8b8b);font-size:0;">&nbsp;</td>
//               <td style="padding-left:8px;vertical-align:middle;">
//                 <span style="font-family:Georgia,serif;font-size:22px;color:#2a3d30;letter-spacing:-0.5px;">Mentel</span>
//               </td>
//             </tr></table>
//           </td>
//         </tr>

//         <!-- Hero confirmation banner -->
//         <tr>
//           <td align="center" style="background:linear-gradient(135deg,#4e7a5e,#3d8b8b);border-radius:24px 24px 0 0;padding:44px 32px 36px;">
//             <!-- Checkmark circle -->
//             <table cellpadding="0" cellspacing="0" align="center" style="margin-bottom:20px;"><tr>
//               <td width="64" height="64" align="center" valign="middle"
//                 style="width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,0.2);font-size:28px;text-align:center;line-height:64px;">
//                 ✓
//               </td>
//             </tr></table>
//             <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:3px;color:rgba(255,255,255,0.7);font-family:Georgia,serif;">Payment Confirmed</p>
//             <h1 style="margin:0 0 10px;font-family:Georgia,serif;font-size:34px;font-weight:400;color:#fff;line-height:1.2;">You're booked in, ${s(firstName)}</h1>
//             <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.8);line-height:1.6;font-family:Georgia,serif;">Your therapist will reach out within 24 hours<br/>to schedule your first session.</p>
//           </td>
//         </tr>

//         <!-- White card -->
//         <tr>
//           <td style="background:#fff;border-radius:0 0 24px 24px;padding:32px;border:1px solid #e0ebe4;border-top:none;">

//             <!-- Booking summary -->
//             <h3 style="margin:0 0 14px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#7ba98b;font-family:Georgia,serif;">Booking Summary</h3>
//             <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;border:1px solid #e4ede7;margin-bottom:28px;">
//               <tr>
//                 <td width="130" style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;">Plan</td>
//                 <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:14px;color:#2a3d30;font-weight:600;">${s(plan)}</td>
//               </tr>
//               <tr>
//                 <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;">Focus Area</td>
//                 <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:14px;color:#2a3d30;">${s(reason)}</td>
//               </tr>
//               <tr>
//                 <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;">Amount Paid</td>
//                 <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;">
//                   <span style="font-size:16px;font-weight:700;color:#4e7a5e;font-family:Georgia,serif;">${s(amount)}</span>
//                 </td>
//               </tr>
//               <tr>
//                 <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;">Reference</td>
//                 <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:13px;color:#2a3d30;font-family:monospace,Georgia,serif;">${s(reference)}</td>
//               </tr>
//               <tr>
//                 <td style="padding:12px 16px;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;">Date</td>
//                 <td style="padding:12px 16px;font-size:14px;color:#2a3d30;">${s(date)}</td>
//               </tr>
//             </table>

//             <!-- Divider -->
//             <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
//               <tr><td style="height:1px;background:#c8ddd1;font-size:0;">&nbsp;</td></tr>
//             </table>

//             <!-- What's included -->
//             <h3 style="margin:0 0 14px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#7ba98b;font-family:Georgia,serif;">What's Included</h3>
//             <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:28px;">
//               ${perkRows}
//             </table>

//             <!-- Divider -->
//             <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
//               <tr><td style="height:1px;background:#c8ddd1;font-size:0;">&nbsp;</td></tr>
//             </table>

//             <!-- What happens next -->
//             <h3 style="margin:0 0 14px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#7ba98b;font-family:Georgia,serif;">What Happens Next</h3>
//             <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:32px;">
//               ${[
//                 "We match you with a licensed therapist suited to your needs",
//                 "Your therapist contacts you within 24 hours via email or phone",
//                 "You agree on a time and format — video, voice, or chat",
//                 "Your first session begins on your terms, at your pace",
//               ]
//                 .map(
//                   (item, i) => `
//               <tr>
//                 <td width="32" style="padding:8px 0;vertical-align:top;">
//                   <table cellpadding="0" cellspacing="0"><tr>
//                     <td width="22" height="22" align="center" valign="middle"
//                       style="width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,#7ba98b,#3d8b8b);font-size:10px;color:#fff;font-weight:bold;text-align:center;font-family:Georgia,serif;">
//                       ${i + 1}
//                     </td>
//                   </tr></table>
//                 </td>
//                 <td style="padding:8px 0 8px 10px;vertical-align:middle;">
//                   <span style="font-size:13px;color:#5a7264;line-height:1.5;">${item}</span>
//                 </td>
//               </tr>`,
//                 )
//                 .join("")}
//             </table>

//             <!-- CTA -->
//             <table width="100%" cellpadding="0" cellspacing="0">
//               <tr><td align="center">
//                 <a href="${BOOKING_URL}"
//                   style="display:inline-block;background:linear-gradient(135deg,#4e7a5e,#3d8b8b);color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:14px 36px;border-radius:99px;font-family:Georgia,serif;">
//                   View Our Services &rarr;
//                 </a>
//               </td></tr>
//             </table>

//           </td>
//         </tr>

//         <!-- Support note -->
//         <tr>
//           <td style="padding:20px 28px;">
//             <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(123,169,139,0.08);border-radius:14px;border:1px solid rgba(123,169,139,0.2);">
//               <tr>
//                 <td style="padding:16px 20px;">
//                   <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#4e7a5e;font-family:Georgia,serif;">Need help?</p>
//                   <p style="margin:0;font-size:13px;color:#5a7264;line-height:1.5;font-family:Georgia,serif;">
//                     Reply to this email or reach us at
//                     <a href="mailto:hello@mail.trymentel.com" style="color:#3d8b8b;text-decoration:none;font-weight:600;">hello@mail.trymentel.com</a>.
//                     We typically respond within a few hours.
//                   </p>
//                 </td>
//               </tr>
//             </table>
//           </td>
//         </tr>

//         <!-- Footer -->
//         <tr>
//           <td style="padding:16px 16px 32px;text-align:center;">
//             <p style="margin:0 0 6px;font-size:12px;color:#8da898;font-family:Georgia,serif;">
//               All sessions are fully confidential and handled by licensed professionals.
//             </p>
//             <p style="margin:0;font-size:11px;color:#aabdb3;font-family:Georgia,serif;">
//               &copy; ${new Date().getFullYear()} Mentel &middot;
//               <a href="https://trymentel.com/privacy" style="color:#7ba98b;text-decoration:none;">Privacy Policy</a>
//               &middot;
//               <a href="https://trymentel.com/terms" style="color:#7ba98b;text-decoration:none;">Terms</a>
//             </p>
//           </td>
//         </tr>

//       </table>
//     </td></tr>
//   </table>
// </body>
// </html>`;
// }

// // ── ADMIN PAYMENT NOTIFICATION EMAIL ─────────────────────────────────────────
// function buildAdminEmail(data: {
//   name: string;
//   email: string;
//   phone: string;
//   plan: string;
//   reason: string;
//   amount: string;
//   reference: string;
//   channel: string;
//   date: string;
// }): string {
//   const { name, email, phone, plan, reason, amount, reference, channel, date } =
//     data;

//   return `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8"/>
//   <meta name="viewport" content="width=device-width,initial-scale=1"/>
//   <title>New Booking &mdash; Mentel Admin</title>
// </head>
// <body style="margin:0;padding:0;background:#f0f3f1;font-family:Georgia,serif;">

//   <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f3f1;padding:40px 16px;">
//     <tr><td align="center">
//       <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

//         <!-- Header -->
//         <tr>
//           <td style="background:linear-gradient(135deg,#2a3d30,#3d5c47);border-radius:20px 20px 0 0;padding:22px 28px;">
//             <table cellpadding="0" cellspacing="0"><tr>
//               <td width="28" height="28" style="width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.2);font-size:0;">&nbsp;</td>
//               <td style="padding-left:10px;vertical-align:middle;">
//                 <span style="font-family:Georgia,serif;font-size:18px;color:#fff;">Mentel Admin</span>
//               </td>
//               <td style="padding-left:10px;vertical-align:middle;">
//                 <table cellpadding="0" cellspacing="0"><tr>
//                   <td style="background:#4e8c6a;border-radius:99px;padding:3px 12px;">
//                     <span style="font-size:10px;color:#fff;text-transform:uppercase;letter-spacing:1px;font-weight:700;">&#9679; Payment Received</span>
//                   </td>
//                 </tr></table>
//               </td>
//             </tr></table>
//           </td>
//         </tr>

//         <!-- Body -->
//         <tr>
//           <td style="background:#fff;border-radius:0 0 20px 20px;padding:28px;border:1px solid #dde8e0;border-top:none;">

//             <!-- Amount hero -->
//             <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;background:linear-gradient(135deg,#edf7f1,#e4f2ec);border-radius:14px;border:1px solid #c8ddd1;">
//               <tr>
//                 <td style="padding:20px 24px;">
//                   <table width="100%" cellpadding="0" cellspacing="0"><tr>
//                     <td style="vertical-align:middle;">
//                       <p style="margin:0 0 2px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#7ba98b;">Amount Received</p>
//                       <span style="font-family:Georgia,serif;font-size:32px;font-weight:600;color:#2a3d30;">${s(amount)}</span>
//                     </td>
//                     <td style="text-align:right;vertical-align:middle;">
//                       <table cellpadding="0" cellspacing="0" align="right"><tr>
//                         <td style="background:linear-gradient(135deg,#4e7a5e,#3d8b8b);border-radius:10px;padding:8px 16px;">
//                           <span style="font-size:13px;color:#fff;font-weight:600;white-space:nowrap;">${s(plan)}</span>
//                         </td>
//                       </tr></table>
//                     </td>
//                   </tr></table>
//                 </td>
//               </tr>
//             </table>

//             <!-- Client info -->
//             <h3 style="margin:0 0 12px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#7ba98b;font-family:Georgia,serif;">Client Details</h3>
//             <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7faf8;border-radius:12px;border:1px solid #e4ede7;margin-bottom:24px;">
//               <tr>
//                 <td width="110" style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;">Name</td>
//                 <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:14px;color:#2a3d30;font-weight:600;">${s(name)}</td>
//               </tr>
//               <tr>
//                 <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;">Email</td>
//                 <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;">
//                   <a href="mailto:${s(email)}" style="font-size:14px;color:#3d8b8b;text-decoration:none;font-weight:500;">${s(email)}</a>
//                 </td>
//               </tr>
//               <tr>
//                 <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;">Phone</td>
//                 <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:14px;color:#2a3d30;">${s(phone) || "—"}</td>
//               </tr>
//               <tr>
//                 <td style="padding:12px 16px;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;">Focus Area</td>
//                 <td style="padding:12px 16px;font-size:14px;color:#2a3d30;">${s(reason)}</td>
//               </tr>
//             </table>

//             <!-- Transaction info -->
//             <h3 style="margin:0 0 12px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#7ba98b;font-family:Georgia,serif;">Transaction Details</h3>
//             <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7faf8;border-radius:12px;border:1px solid #e4ede7;margin-bottom:24px;">
//               <tr>
//                 <td width="110" style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;">Reference</td>
//                 <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:13px;color:#2a3d30;font-family:monospace,Georgia,serif;">${s(reference)}</td>
//               </tr>
//               <tr>
//                 <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;">Channel</td>
//                 <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:14px;color:#2a3d30;">${s(channel)}</td>
//               </tr>
//               <tr>
//                 <td style="padding:12px 16px;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;">Date</td>
//                 <td style="padding:12px 16px;font-size:14px;color:#2a3d30;">${s(date)}</td>
//               </tr>
//             </table>

//             <!-- Quick action -->
//             <table width="100%" cellpadding="0" cellspacing="0">
//               <tr><td align="center">
//                 <a href="mailto:${s(email)}?subject=Your%20Mentel%20Session%20is%20Confirmed%20%E2%80%94%20Let%27s%20Get%20Started&body=Hi%20${encodeURIComponent(name)}%2C%0D%0A%0D%0AWelcome%20to%20Mentel!%20I%27m%20your%20assigned%20therapist..."
//                   style="display:inline-block;background:linear-gradient(135deg,#4e7a5e,#3d8b8b);color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:99px;font-family:Georgia,serif;">
//                   Contact ${s(name.split(" ")[0])} &rarr;
//                 </a>
//               </td></tr>
//             </table>

//           </td>
//         </tr>

//         <!-- Footer -->
//         <tr>
//           <td style="padding:20px 0;text-align:center;">
//             <p style="margin:0;font-size:11px;color:#9aada3;font-family:Georgia,serif;">
//               Mentel Admin &middot; Internal notification &middot; Do not forward
//             </p>
//           </td>
//         </tr>

//       </table>
//     </td></tr>
//   </table>
// </body>
// </html>`;
// }

// // ── WEBHOOK HANDLER ───────────────────────────────────────────────────────────
// export async function POST_HANDLER(req: Request) {
//   try {
//     const rawBody = await req.text();
//     const signature = req.headers.get("x-paystack-signature") ?? "";

//     // ── 1. Verify HMAC signature — reject anything not from Paystack ──────────
//     const hash = createHmac("sha512", PAYSTACK_SECRET)
//       .update(rawBody)
//       .digest("hex");

//     if (hash !== signature) {
//       console.warn("Paystack webhook: invalid signature — request rejected");
//       return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
//     }

//     const event = JSON.parse(rawBody);

//     // ── 2. Only process successful charges ────────────────────────────────────
//     if (event.event !== "charge.success") {
//       // Acknowledge other events without acting on them
//       return NextResponse.json({ received: true });
//     }

//     const data = event.data;
//     const meta = data.metadata?.custom_fields ?? [];

//     // Helper to pull values from Paystack custom_fields array
//     const getField = (variable: string): string =>
//       meta.find(
//         (f: { variable_name: string; value: string }) =>
//           f.variable_name === variable,
//       )?.value ?? "";

//     const clientName = getField("name") || data.customer?.first_name || "there";
//     const clientEmail = data.customer?.email ?? "";
//     const clientPhone = getField("phone");
//     const plan = getField("plan") || "Session";
//     const reason = getField("reason") || "General Wellbeing";
//     // Raw numeric value for FB CAPI — Paystack amount is in kobo
//     const rawAmount = data.amount / 100;
//     // ── Meta tracking signals captured at checkout ─────────────────────────────
//     const fbp = getField("fbp");
//     const fbc = getField("fbc");
//     const clientIp = getField("client_ip");
//     const userAgent = getField("user_agent");

//     // Formatted display string for the emails
//     const amount = formatNGN(data.amount);
//     const reference = data.reference ?? "";
//     const channel = data.channel ?? "card";
//     const date = new Date(data.paid_at ?? Date.now()).toLocaleString("en-GB", {
//       dateStyle: "full",
//       timeStyle: "short",
//     });

//     // ── Fire Meta Conversions API — Purchase event ─────────────────────────────
//     try {
//       await sendFbConversionEvent({
//         eventName: "Purchase",
//         eventId: reference, // must match client-side eventID if you also fire client-side
//         email: clientEmail,
//         phone: clientPhone,
//         fbp,
//         fbc,
//         clientIp,
//         userAgent,
//         value: rawAmount,
//         currency: data.currency ?? "NGN", // Paystack sends this in data.currency
//       });
//     } catch (fbError) {
//       // Never let a Meta API failure block email delivery or the webhook ack
//       console.error("FB Conversions API error:", fbError);
//     }

//     if (!clientEmail) {
//       console.error(
//         "Paystack webhook: no email on charge.success — skipping email send",
//       );
//       return NextResponse.json({ received: true });
//     }

//     // ── This is the fix: previously nothing here ever wrote to the
//     // database, so paying clients never showed up in /admin/payments or
//     // /admin/patients — the money went through, but the CRM had no idea.
//     // Also unlocks their session package (4 for Monthly, 1 otherwise) so
//     // they can log into the client portal and schedule.
//     try {
//       await recordPayment({
//         reference,
//         email: clientEmail,
//         name: clientName,
//         phone: clientPhone || undefined,
//         amountKobo: data.amount,
//         currency: data.currency ?? "NGN",
//         method: channel,
//         plan,
//         reason,
//         paidAt: new Date(data.paid_at ?? Date.now()),
//       });
//     } catch (err) {
//       // Never let a DB hiccup block the confirmation emails below — but
//       // this is exactly the kind of failure you want to know about, since
//       // it means a real payment silently didn't get recorded.
//       console.error(
//         "[Paystack webhook] recordPayment failed — payment succeeded but was NOT saved to the CRM:",
//         err,
//       );
//     }

//     const clientHtml = buildClientEmail({
//       name: clientName,
//       email: clientEmail,
//       plan,
//       reason,
//       amount,
//       reference,
//       date,
//     });
//     const adminHtml = buildAdminEmail({
//       name: clientName,
//       email: clientEmail,
//       phone: clientPhone,
//       plan,
//       reason,
//       amount,
//       reference,
//       channel,
//       date,
//     });

//     // ── 3. Send both emails — allSettled so one failure won't block the other ──
//     const [clientResult, adminResult] = await Promise.allSettled([
//       resend.emails.send({
//         from: FROM_EMAIL,
//         to: [clientEmail],
//         subject: `✅ Booking Confirmed — ${plan} | Mentel`,
//         html: clientHtml,
//       }),
//       resend.emails.send({
//         from: FROM_EMAIL,
//         to: [ADMIN_EMAIL],
//         subject: `💳 New Booking: ${clientName} · ${plan} · ${amount}`,
//         html: adminHtml,
//         replyTo: clientEmail,
//       }),
//     ]);

//     if (clientResult.status === "rejected")
//       console.error("Client email failed:", clientResult.reason);
//     if (adminResult.status === "rejected")
//       console.error("Admin email failed:", adminResult.reason);

//     // ── 4. Always return 200 to Paystack — they retry on non-2xx ─────────────
//     return NextResponse.json({ received: true });
//   } catch (error) {
//     console.error("Webhook error:", error);
//     // Still return 200 — a 500 causes Paystack to retry endlessly
//     return NextResponse.json({ received: true });
//   }
// }

// export const POST = withRateLimit(POST_HANDLER);

// app/api/paystack/webhook/route.ts
//
// ── How it works ──────────────────────────────────────────────────────────────
// 1. Paystack sends a POST to this URL the moment a payment is confirmed on
//    their servers — completely independent of the user's browser.
// 2. We verify the HMAC-SHA512 signature using your secret key so only real
//    Paystack events are processed (not forged requests).
// 3. On `charge.success` we extract the booking metadata and send two emails:
//    - Client: personalised booking confirmation with session details
//    - Admin:  full payment receipt with all metadata
//
// ── Setup in Paystack dashboard ───────────────────────────────────────────────
// Settings → API Keys & Webhooks → Webhook URL:
//   https://yourdomain.com/api/paystack/webhook
// That's it. No extra config needed.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { Resend } from "resend";
import { withRateLimit } from "@/lib/withRateLimit";
import { recordPayment } from "@/lib/payments/record-payment";

const resend = new Resend(process.env.RESEND_API_KEY);
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!; // sk_live_...
const ADMIN_EMAIL = "hello@mail.trymentel.com";
const FROM_EMAIL = "Mentel <hello@mail.trymentel.com>";

// ── HTML sanitizer ─────────────────────────────────────────────────────────────
function s(str: unknown): string {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── Format NGN amount (Paystack sends kobo) ────────────────────────────────────
function formatNGN(kobo: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(kobo / 100);
}

// ── CLIENT CONFIRMATION EMAIL ─────────────────────────────────────────────────
function buildClientEmail(data: {
  name: string;
  email: string;
  plan: string;
  reason: string;
  amount: string;
  reference: string;
  date: string;
  portalLoginUrl: string;
}): string {
  const { name, plan, reason, amount, reference, date, portalLoginUrl } = data;
  const firstName = name.split(" ")[0] || name;
  const isMonthly = plan.toLowerCase().includes("monthly");

  const perks = isMonthly
    ? [
        "4 therapy sessions this month",
        "Priority therapist matching",
        "Dedicated support channel",
        "Progress tracking",
      ]
    : [
        "1 full therapy session",
        "Licensed & verified therapist",
        "Response within 24 hours",
        "Confidential & judgment-free",
      ];

  const perkRows = perks
    .map(
      (p) => `
    <tr>
      <td width="24" style="padding:5px 0;vertical-align:top;">
        <table cellpadding="0" cellspacing="0"><tr>
          <td width="16" height="16" align="center" valign="middle"
            style="width:16px;height:16px;border-radius:50%;background:linear-gradient(135deg,#7ba98b,#3d8b8b);font-size:0;">&nbsp;</td>
        </tr></table>
      </td>
      <td style="padding:5px 0 5px 10px;vertical-align:middle;">
        <span style="font-size:13px;color:#5a7264;line-height:1.5;">${p}</span>
      </td>
    </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Booking Confirmed — Mentel</title>
</head>
<body style="margin:0;padding:0;background:#f4f7f5;font-family:Georgia,serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f5;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

        <!-- Logo -->
        <tr>
          <td align="center" style="padding-bottom:28px;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td width="32" height="32" style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#7ba98b,#3d8b8b);font-size:0;">&nbsp;</td>
              <td style="padding-left:8px;vertical-align:middle;">
                <span style="font-family:Georgia,serif;font-size:22px;color:#2a3d30;letter-spacing:-0.5px;">Mentel</span>
              </td>
            </tr></table>
          </td>
        </tr>

        <!-- Hero confirmation banner -->
        <tr>
          <td align="center" style="background:linear-gradient(135deg,#4e7a5e,#3d8b8b);border-radius:24px 24px 0 0;padding:44px 32px 36px;">
            <!-- Checkmark circle -->
            <table cellpadding="0" cellspacing="0" align="center" style="margin-bottom:20px;"><tr>
              <td width="64" height="64" align="center" valign="middle"
                style="width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,0.2);font-size:28px;text-align:center;line-height:64px;">
                ✓
              </td>
            </tr></table>
            <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:3px;color:rgba(255,255,255,0.7);font-family:Georgia,serif;">Payment Confirmed</p>
            <h1 style="margin:0 0 10px;font-family:Georgia,serif;font-size:34px;font-weight:400;color:#fff;line-height:1.2;">You're booked in, ${s(firstName)}</h1>
            <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.8);line-height:1.6;font-family:Georgia,serif;">Your therapist will reach out within 24 hours<br/>to schedule your first session.</p>
          </td>
        </tr>

        <!-- White card -->
        <tr>
          <td style="background:#fff;border-radius:0 0 24px 24px;padding:32px;border:1px solid #e0ebe4;border-top:none;">

            <!-- Booking summary -->
            <h3 style="margin:0 0 14px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#7ba98b;font-family:Georgia,serif;">Booking Summary</h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;border:1px solid #e4ede7;margin-bottom:28px;">
              <tr>
                <td width="130" style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;">Plan</td>
                <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:14px;color:#2a3d30;font-weight:600;">${s(plan)}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;">Focus Area</td>
                <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:14px;color:#2a3d30;">${s(reason)}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;">Amount Paid</td>
                <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;">
                  <span style="font-size:16px;font-weight:700;color:#4e7a5e;font-family:Georgia,serif;">${s(amount)}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;">Reference</td>
                <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:13px;color:#2a3d30;font-family:monospace,Georgia,serif;">${s(reference)}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;">Date</td>
                <td style="padding:12px 16px;font-size:14px;color:#2a3d30;">${s(date)}</td>
              </tr>
            </table>

            <!-- Divider -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr><td style="height:1px;background:#c8ddd1;font-size:0;">&nbsp;</td></tr>
            </table>

            <!-- What's included -->
            <h3 style="margin:0 0 14px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#7ba98b;font-family:Georgia,serif;">What's Included</h3>
            <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:28px;">
              ${perkRows}
            </table>

            <!-- Divider -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr><td style="height:1px;background:#c8ddd1;font-size:0;">&nbsp;</td></tr>
            </table>

            <!-- What happens next -->
            <h3 style="margin:0 0 14px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#7ba98b;font-family:Georgia,serif;">What Happens Next</h3>
            <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:32px;">
              ${[
                "We match you with a licensed therapist suited to your needs",
                "Your therapist contacts you within 24 hours via email or phone",
                "You agree on a time and format — video, voice, or chat",
                "Your first session begins on your terms, at your pace",
              ]
                .map(
                  (item, i) => `
              <tr>
                <td width="32" style="padding:8px 0;vertical-align:top;">
                  <table cellpadding="0" cellspacing="0"><tr>
                    <td width="22" height="22" align="center" valign="middle"
                      style="width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,#7ba98b,#3d8b8b);font-size:10px;color:#fff;font-weight:bold;text-align:center;font-family:Georgia,serif;">
                      ${i + 1}
                    </td>
                  </tr></table>
                </td>
                <td style="padding:8px 0 8px 10px;vertical-align:middle;">
                  <span style="font-size:13px;color:#5a7264;line-height:1.5;">${item}</span>
                </td>
              </tr>`,
                )
                .join("")}
            </table>

            <!-- CTA -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center">
                <a href="${portalLoginUrl}"
                  style="display:inline-block;background:linear-gradient(135deg,#4e7a5e,#3d8b8b);color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:14px 36px;border-radius:99px;font-family:Georgia,serif;">
                  Go to Your Client Portal &rarr;
                </a>
              </td></tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center" style="padding-top:10px;">
                <span style="font-size:11px;color:#a3bcae;">Schedule your session${plan.toLowerCase().includes("month") ? "s" : ""} and manage your plan there.</span>
              </td></tr>
            </table>

          </td>
        </tr>

        <!-- Support note -->
        <tr>
          <td style="padding:20px 28px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(123,169,139,0.08);border-radius:14px;border:1px solid rgba(123,169,139,0.2);">
              <tr>
                <td style="padding:16px 20px;">
                  <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#4e7a5e;font-family:Georgia,serif;">Need help?</p>
                  <p style="margin:0;font-size:13px;color:#5a7264;line-height:1.5;font-family:Georgia,serif;">
                    Reply to this email or reach us at
                    <a href="mailto:hello@mail.trymentel.com" style="color:#3d8b8b;text-decoration:none;font-weight:600;">hello@mail.trymentel.com</a>.
                    We typically respond within a few hours.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:16px 16px 32px;text-align:center;">
            <p style="margin:0 0 6px;font-size:12px;color:#8da898;font-family:Georgia,serif;">
              All sessions are fully confidential and handled by licensed professionals.
            </p>
            <p style="margin:0;font-size:11px;color:#aabdb3;font-family:Georgia,serif;">
              &copy; ${new Date().getFullYear()} Mentel &middot;
              <a href="https://trymentel.com/privacy" style="color:#7ba98b;text-decoration:none;">Privacy Policy</a>
              &middot;
              <a href="https://trymentel.com/terms" style="color:#7ba98b;text-decoration:none;">Terms</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── ADMIN PAYMENT NOTIFICATION EMAIL ─────────────────────────────────────────
function buildAdminEmail(data: {
  name: string;
  email: string;
  phone: string;
  plan: string;
  reason: string;
  amount: string;
  reference: string;
  channel: string;
  date: string;
}): string {
  const { name, email, phone, plan, reason, amount, reference, channel, date } =
    data;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>New Booking &mdash; Mentel Admin</title>
</head>
<body style="margin:0;padding:0;background:#f0f3f1;font-family:Georgia,serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f3f1;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#2a3d30,#3d5c47);border-radius:20px 20px 0 0;padding:22px 28px;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td width="28" height="28" style="width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.2);font-size:0;">&nbsp;</td>
              <td style="padding-left:10px;vertical-align:middle;">
                <span style="font-family:Georgia,serif;font-size:18px;color:#fff;">Mentel Admin</span>
              </td>
              <td style="padding-left:10px;vertical-align:middle;">
                <table cellpadding="0" cellspacing="0"><tr>
                  <td style="background:#4e8c6a;border-radius:99px;padding:3px 12px;">
                    <span style="font-size:10px;color:#fff;text-transform:uppercase;letter-spacing:1px;font-weight:700;">&#9679; Payment Received</span>
                  </td>
                </tr></table>
              </td>
            </tr></table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#fff;border-radius:0 0 20px 20px;padding:28px;border:1px solid #dde8e0;border-top:none;">

            <!-- Amount hero -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;background:linear-gradient(135deg,#edf7f1,#e4f2ec);border-radius:14px;border:1px solid #c8ddd1;">
              <tr>
                <td style="padding:20px 24px;">
                  <table width="100%" cellpadding="0" cellspacing="0"><tr>
                    <td style="vertical-align:middle;">
                      <p style="margin:0 0 2px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#7ba98b;">Amount Received</p>
                      <span style="font-family:Georgia,serif;font-size:32px;font-weight:600;color:#2a3d30;">${s(amount)}</span>
                    </td>
                    <td style="text-align:right;vertical-align:middle;">
                      <table cellpadding="0" cellspacing="0" align="right"><tr>
                        <td style="background:linear-gradient(135deg,#4e7a5e,#3d8b8b);border-radius:10px;padding:8px 16px;">
                          <span style="font-size:13px;color:#fff;font-weight:600;white-space:nowrap;">${s(plan)}</span>
                        </td>
                      </tr></table>
                    </td>
                  </tr></table>
                </td>
              </tr>
            </table>

            <!-- Client info -->
            <h3 style="margin:0 0 12px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#7ba98b;font-family:Georgia,serif;">Client Details</h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7faf8;border-radius:12px;border:1px solid #e4ede7;margin-bottom:24px;">
              <tr>
                <td width="110" style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;">Name</td>
                <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:14px;color:#2a3d30;font-weight:600;">${s(name)}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;">Email</td>
                <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;">
                  <a href="mailto:${s(email)}" style="font-size:14px;color:#3d8b8b;text-decoration:none;font-weight:500;">${s(email)}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;">Phone</td>
                <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:14px;color:#2a3d30;">${s(phone) || "—"}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;">Focus Area</td>
                <td style="padding:12px 16px;font-size:14px;color:#2a3d30;">${s(reason)}</td>
              </tr>
            </table>

            <!-- Transaction info -->
            <h3 style="margin:0 0 12px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#7ba98b;font-family:Georgia,serif;">Transaction Details</h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7faf8;border-radius:12px;border:1px solid #e4ede7;margin-bottom:24px;">
              <tr>
                <td width="110" style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;">Reference</td>
                <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:13px;color:#2a3d30;font-family:monospace,Georgia,serif;">${s(reference)}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;">Channel</td>
                <td style="padding:12px 16px;border-bottom:1px solid #e4ede7;font-size:14px;color:#2a3d30;">${s(channel)}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;font-size:11px;color:#8da898;text-transform:uppercase;letter-spacing:1px;">Date</td>
                <td style="padding:12px 16px;font-size:14px;color:#2a3d30;">${s(date)}</td>
              </tr>
            </table>

            <!-- Quick action -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center">
                <a href="mailto:${s(email)}?subject=Your%20Mentel%20Session%20is%20Confirmed%20%E2%80%94%20Let%27s%20Get%20Started&body=Hi%20${encodeURIComponent(name)}%2C%0D%0A%0D%0AWelcome%20to%20Mentel!%20I%27m%20your%20assigned%20therapist..."
                  style="display:inline-block;background:linear-gradient(135deg,#4e7a5e,#3d8b8b);color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:99px;font-family:Georgia,serif;">
                  Contact ${s(name.split(" ")[0])} &rarr;
                </a>
              </td></tr>
            </table>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 0;text-align:center;">
            <p style="margin:0;font-size:11px;color:#9aada3;font-family:Georgia,serif;">
              Mentel Admin &middot; Internal notification &middot; Do not forward
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── WEBHOOK HANDLER ───────────────────────────────────────────────────────────
export async function POST_HANDLER(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature") ?? "";

    // ── 1. Verify HMAC signature — reject anything not from Paystack ──────────
    const hash = createHmac("sha512", PAYSTACK_SECRET)
      .update(rawBody)
      .digest("hex");

    if (hash !== signature) {
      console.warn("Paystack webhook: invalid signature — request rejected");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    // ── 2. Only process successful charges ────────────────────────────────────
    if (event.event !== "charge.success") {
      // Acknowledge other events without acting on them
      return NextResponse.json({ received: true });
    }

    const data = event.data;
    const meta = data.metadata?.custom_fields ?? [];

    // Helper to pull values from Paystack custom_fields array
    const getField = (variable: string): string =>
      meta.find(
        (f: { variable_name: string; value: string }) =>
          f.variable_name === variable,
      )?.value ?? "";

    const clientName = getField("name") || data.customer?.first_name || "there";
    const clientEmail = data.customer?.email ?? "";
    const clientPhone = getField("phone");
    const plan = getField("plan") || "Session";
    const reason = getField("reason") || "General Wellbeing";
    const amount = formatNGN(data.amount);
    const reference = data.reference ?? "";
    const channel = data.channel ?? "card";
    const date = new Date(data.paid_at ?? Date.now()).toLocaleString("en-GB", {
      dateStyle: "full",
      timeStyle: "short",
    });

    if (!clientEmail) {
      console.error(
        "Paystack webhook: no email on charge.success — skipping email send",
      );
      return NextResponse.json({ received: true });
    }

    // ── This is the fix: previously nothing here ever wrote to the
    // database, so paying clients never showed up in /admin/payments or
    // /admin/patients — the money went through, but the CRM had no idea.
    // Also unlocks their session package (4 for Monthly, 1 otherwise) so
    // they can log into the client portal and schedule, and generates a
    // one-click login link straight into it for the confirmation email.
    let portalLoginUrl = "https://app.trymentel.com/login";
    try {
      const result = await recordPayment({
        reference,
        email: clientEmail,
        name: clientName,
        phone: clientPhone || undefined,
        amountKobo: data.amount,
        currency: data.currency ?? "NGN",
        method: channel,
        plan,
        reason,
        paidAt: new Date(data.paid_at ?? Date.now()),
      });
      portalLoginUrl = result.portalLoginUrl;
    } catch (err) {
      // Never let a DB hiccup block the confirmation emails below — but
      // this is exactly the kind of failure you want to know about, since
      // it means a real payment silently didn't get recorded.
      console.error(
        "[Paystack webhook] recordPayment failed — payment succeeded but was NOT saved to the CRM:",
        err,
      );
    }

    const clientHtml = buildClientEmail({
      portalLoginUrl,
      name: clientName,
      email: clientEmail,
      plan,
      reason,
      amount,
      reference,
      date,
    });
    const adminHtml = buildAdminEmail({
      name: clientName,
      email: clientEmail,
      phone: clientPhone,
      plan,
      reason,
      amount,
      reference,
      channel,
      date,
    });

    // ── 3. Send both emails — allSettled so one failure won't block the other ──
    const [clientResult, adminResult] = await Promise.allSettled([
      resend.emails.send({
        from: FROM_EMAIL,
        to: [clientEmail],
        subject: `✅ Booking Confirmed — ${plan} | Mentel`,
        html: clientHtml,
      }),
      resend.emails.send({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject: `💳 New Booking: ${clientName} · ${plan} · ${amount}`,
        html: adminHtml,
        replyTo: clientEmail,
      }),
    ]);

    if (clientResult.status === "rejected")
      console.error("Client email failed:", clientResult.reason);
    if (adminResult.status === "rejected")
      console.error("Admin email failed:", adminResult.reason);

    // ── 4. Always return 200 to Paystack — they retry on non-2xx ─────────────
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    // Still return 200 — a 500 causes Paystack to retry endlessly
    return NextResponse.json({ received: true });
  }
}

export const POST = withRateLimit(POST_HANDLER);
