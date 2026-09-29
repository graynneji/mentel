// lib/payments/booking-emails.ts
//
// Confirmation emails for international (Flutterwave/USD) bookings.
// Deliberately simpler than the NGN templates in
// app/api/paystack/webhook/route.ts (which are Naira-specific,
// custom_fields-shaped, and tightly coupled to that route) — this is a
// small, currency-parameterized pair so a currency change or a new
// provider never means duplicating a 200-line HTML template again.

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = "hello@mail.trymentel.com";
const FROM_EMAIL = "Mentel <hello@mail.trymentel.com>";

function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

export interface BookingConfirmationInput {
  name: string;
  email: string;
  phone?: string;
  plan: string;
  reason: string;
  amountUSD: number;
  reference: string;
  channel: string;
  paidAt: Date;
  portalLoginUrl: string;
}

function shell(title: string, body: string): string {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#F2F7F3;font-family:'DM Sans',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F2F7F3;padding:32px 0;">
    <tr><td align="center">
      <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;">
        <tr><td style="background:linear-gradient(135deg,#4e7a5e,#3d8b8b);padding:28px 32px;color:#ffffff;">
          <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;opacity:0.8;">${title}</p>
        </td></tr>
        <tr><td style="padding:28px 32px;color:#22322a;font-size:14px;line-height:1.6;">
          ${body}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildClientEmail(input: BookingConfirmationInput): string {
  const firstName = input.name.split(" ")[0] || "there";
  const amount = formatUSD(input.amountUSD);
  const date = input.paidAt.toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" });
  return shell(
    "Booking Confirmed",
    `<p style="margin:0 0 16px;">Hi ${firstName},</p>
     <p style="margin:0 0 16px;">Your payment for <strong>${input.plan}</strong> was successful. A licensed therapist will be in touch within 24 hours to get you scheduled.</p>
     <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;font-size:13px;">
       <tr><td style="padding:4px 0;color:#6b7d72;">Plan</td><td style="padding:4px 0;text-align:right;">${input.plan}</td></tr>
       <tr><td style="padding:4px 0;color:#6b7d72;">Focus area</td><td style="padding:4px 0;text-align:right;">${input.reason}</td></tr>
       <tr><td style="padding:4px 0;color:#6b7d72;">Amount paid</td><td style="padding:4px 0;text-align:right;">${amount}</td></tr>
       <tr><td style="padding:4px 0;color:#6b7d72;">Date</td><td style="padding:4px 0;text-align:right;">${date}</td></tr>
       <tr><td style="padding:4px 0;color:#6b7d72;">Reference</td><td style="padding:4px 0;text-align:right;font-family:monospace;font-size:11px;">${input.reference}</td></tr>
     </table>
     <p style="margin:20px 0 0;"><a href="${input.portalLoginUrl}" style="display:inline-block;background:linear-gradient(135deg,#4e7a5e,#3d8b8b);color:#ffffff;padding:12px 24px;border-radius:24px;text-decoration:none;font-weight:600;">Go to your client portal</a></p>`,
  );
}

function buildAdminEmail(input: BookingConfirmationInput): string {
  const amount = formatUSD(input.amountUSD);
  const date = input.paidAt.toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" });
  return shell(
    "New International Booking",
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;">
       <tr><td style="padding:4px 0;color:#6b7d72;">Name</td><td style="padding:4px 0;text-align:right;">${input.name}</td></tr>
       <tr><td style="padding:4px 0;color:#6b7d72;">Email</td><td style="padding:4px 0;text-align:right;">${input.email}</td></tr>
       <tr><td style="padding:4px 0;color:#6b7d72;">Phone</td><td style="padding:4px 0;text-align:right;">${input.phone || "—"}</td></tr>
       <tr><td style="padding:4px 0;color:#6b7d72;">Plan</td><td style="padding:4px 0;text-align:right;">${input.plan}</td></tr>
       <tr><td style="padding:4px 0;color:#6b7d72;">Focus area</td><td style="padding:4px 0;text-align:right;">${input.reason}</td></tr>
       <tr><td style="padding:4px 0;color:#6b7d72;">Amount</td><td style="padding:4px 0;text-align:right;">${amount}</td></tr>
       <tr><td style="padding:4px 0;color:#6b7d72;">Channel</td><td style="padding:4px 0;text-align:right;">${input.channel}</td></tr>
       <tr><td style="padding:4px 0;color:#6b7d72;">Date</td><td style="padding:4px 0;text-align:right;">${date}</td></tr>
       <tr><td style="padding:4px 0;color:#6b7d72;">Reference</td><td style="padding:4px 0;text-align:right;font-family:monospace;font-size:11px;">${input.reference}</td></tr>
     </table>`,
  );
}

export async function sendBookingConfirmationEmails(input: BookingConfirmationInput): Promise<void> {
  const clientHtml = buildClientEmail(input);
  const adminHtml = buildAdminEmail(input);

  const [clientResult, adminResult] = await Promise.allSettled([
    resend.emails.send({
      from: FROM_EMAIL,
      to: [input.email],
      subject: `✅ Booking Confirmed — ${input.plan} | Mentel`,
      html: clientHtml,
    }),
    resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      subject: `💳 New International Booking: ${input.name} · ${input.plan} · ${formatUSD(input.amountUSD)}`,
      html: adminHtml,
      replyTo: input.email,
    }),
  ]);

  if (clientResult.status === "rejected") console.error("Client email failed:", clientResult.reason);
  if (adminResult.status === "rejected") console.error("Admin email failed:", adminResult.reason);
}
