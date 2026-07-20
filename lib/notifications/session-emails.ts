// lib/notifications/session-emails.ts
//
// Every notification a client gets about their scheduled sessions —
// cancellations, reschedules, and upcoming reminders — goes through here,
// so the wording and behavior stay consistent no matter which admin
// action or cron job triggers it.

import { Resend } from "resend";
import { sendSms } from "@/lib/sms/bestbulksms";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Mentel <hello@mail.trymentel.com>";
const CLIENT_PORTAL_URL = process.env.NEXT_PUBLIC_CLIENT_PORTAL_URL ?? "https://app.trymentel.com";

function formatDateTime(d: Date): string {
  return d.toLocaleString("en-NG", { dateStyle: "full", timeStyle: "short", timeZone: "Africa/Lagos" });
}

function wrapEmail(title: string, bodyHtml: string): string {
  return `
    <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;color:#1c3a3a;">
      <div style="background:linear-gradient(135deg,#1a3030 0%,#2d6648 100%);padding:26px 32px;border-radius:12px 12px 0 0;">
        <h1 style="color:#fff;font-size:19px;margin:0;font-weight:300;">${title}</h1>
      </div>
      <div style="padding:26px 32px;border:1px solid #e4eee8;border-top:none;border-radius:0 0 12px 12px;font-size:14px;line-height:1.6;">
        ${bodyHtml}
        <p style="margin-top:22px;">
          <a href="${CLIENT_PORTAL_URL}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#4e7a5e,#3d8b8b);color:#fff;text-decoration:none;font-size:13px;font-weight:600;padding:12px 28px;border-radius:99px;">
            Go to Your Client Portal
          </a>
        </p>
      </div>
    </div>
  `;
}

async function trySendSms(phone: string | null | undefined, message: string) {
  if (!phone) return;
  try {
    await sendSms({ to: phone, message });
  } catch (err) {
    console.error("[session notification] SMS failed", err);
  }
}

export async function notifySessionCancelled(params: {
  email: string;
  phone?: string | null;
  name: string;
  scheduledAt: Date;
  cancelledByAdmin: boolean;
  reason?: string;
  freeSessionGranted: boolean;
}) {
  const { email, phone, name, scheduledAt, cancelledByAdmin, reason, freeSessionGranted } = params;
  const when = formatDateTime(scheduledAt);

  const apologyLine = cancelledByAdmin
    ? `We're sorry — we had to cancel your session on <strong>${when}</strong>${reason ? ` (${reason})` : ""}.`
    : `Your session on <strong>${when}</strong> has been cancelled as requested.`;

  const bonusLine = freeSessionGranted
    ? `<p>Since this was on us, we've added a <strong>free session</strong> to your account — no charge, ready to schedule whenever suits you.</p>`
    : `<p>This session has been returned to your remaining balance, so you haven't lost it — just schedule a new time whenever works for you.</p>`;

  try {
    await resend.emails.send({
      from: FROM,
      to: [email],
      subject: cancelledByAdmin ? "Your Mentel session was cancelled" : "Your session cancellation is confirmed",
      html: wrapEmail("Session cancelled", `<p>Hi ${name.split(" ")[0]},</p><p>${apologyLine}</p>${bonusLine}`),
    });
  } catch (err) {
    console.error("[session notification] cancellation email failed", err);
  }

  await trySendSms(
    phone,
    cancelledByAdmin
      ? `Mentel: Your session on ${when} was cancelled by us. ${freeSessionGranted ? "We've added a free session to your account." : "It's been returned to your balance."} Reschedule at ${CLIENT_PORTAL_URL}/dashboard`
      : `Mentel: Your session on ${when} has been cancelled as requested. Reschedule anytime at ${CLIENT_PORTAL_URL}/dashboard`
  );
}

export async function notifySessionRescheduled(params: {
  email: string;
  phone?: string | null;
  name: string;
  oldScheduledAt: Date;
  newScheduledAt: Date;
  reason?: string;
}) {
  const { email, phone, name, oldScheduledAt, newScheduledAt, reason } = params;
  const oldWhen = formatDateTime(oldScheduledAt);
  const newWhen = formatDateTime(newScheduledAt);

  try {
    await resend.emails.send({
      from: FROM,
      to: [email],
      subject: "Your Mentel session has been rescheduled",
      html: wrapEmail(
        "Session rescheduled",
        `<p>Hi ${name.split(" ")[0]},</p>
         <p>Your session originally set for <strong>${oldWhen}</strong> has been moved to <strong>${newWhen}</strong>${reason ? ` (${reason})` : ""}.</p>
         <p>No action needed from you — this is already reflected in your client portal.</p>`
      ),
    });
  } catch (err) {
    console.error("[session notification] reschedule email failed", err);
  }

  await trySendSms(phone, `Mentel: Your session has moved from ${oldWhen} to ${newWhen}. Details at ${CLIENT_PORTAL_URL}/dashboard`);
}

export async function notifyFreeSessionGranted(params: {
  email: string;
  phone?: string | null;
  name: string;
  reason?: string;
}) {
  const { email, phone, name, reason } = params;
  try {
    await resend.emails.send({
      from: FROM,
      to: [email],
      subject: "A free session has been added to your Mentel account",
      html: wrapEmail(
        "Free session added",
        `<p>Hi ${name.split(" ")[0]},</p>
         <p>We've added a complimentary session to your account${reason ? ` — ${reason}` : ""}. It's ready to schedule whenever suits you, no charge.</p>`
      ),
    });
  } catch (err) {
    console.error("[session notification] free session email failed", err);
  }

  await trySendSms(phone, `Mentel: We've added a free session to your account${reason ? ` (${reason})` : ""}. Schedule it at ${CLIENT_PORTAL_URL}/dashboard`);
}

export async function sendSessionReminder(params: {
  email: string;
  phone?: string | null;
  name: string;
  scheduledAt: Date;
  window: "24h" | "1h";
}) {
  const { email, phone, name, scheduledAt, window } = params;
  const when = formatDateTime(scheduledAt);
  const windowLabel = window === "24h" ? "tomorrow" : "in about an hour";

  try {
    await resend.emails.send({
      from: FROM,
      to: [email],
      subject: window === "24h" ? "Reminder: your Mentel session is tomorrow" : "Your Mentel session starts soon",
      html: wrapEmail(
        "Upcoming session reminder",
        `<p>Hi ${name.split(" ")[0]},</p>
         <p>This is a reminder that your session is scheduled for <strong>${when}</strong> (${windowLabel}).</p>
         <p>Need to reschedule or cancel? You can do that anytime from your client portal.</p>`
      ),
    });
  } catch (err) {
    console.error("[session notification] reminder email failed", err);
  }

  await trySendSms(
    phone,
    window === "24h"
      ? `Mentel: Reminder — your session is tomorrow, ${when}. Manage it at ${CLIENT_PORTAL_URL}/dashboard`
      : `Mentel: Your session starts soon (${when}). Manage it at ${CLIENT_PORTAL_URL}/dashboard`
  );
}
