// app/api/volunteer/route.ts
// POST: validate a volunteer application and email it straight to the team
// via Resend. Deliberately NOT persisted to the database — per request,
// this is an email-only form.

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { withRateLimit } from "@/lib/withRateLimit";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Mentel Volunteers <hello@mail.trymentel.com>";
const TO = process.env.VOLUNTEER_NOTIFICATION_EMAIL ?? "hello@trymentel.com";

const AREAS_OF_INTEREST = [
  "Peer Support",
  "Event & Community Outreach",
  "Content & Social Media",
  "Admin & Operations",
  "Tech & Design",
  "Mental Health Advocacy",
] as const;

const AVAILABILITY = [
  "Weekdays",
  "Weekends",
  "Evenings",
  "Flexible / Anytime",
] as const;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function POST_HANDLER(req: Request) {
  const nextReq = req as NextRequest;

  try {
    const body = await nextReq.json();

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const city = String(body.city ?? "").trim();
    const areasOfInterest: string[] = Array.isArray(body.areasOfInterest)
      ? body.areasOfInterest.filter((a: unknown) => typeof a === "string")
      : [];
    const availability = String(body.availability ?? "").trim();
    const experience = String(body.experience ?? "").trim();
    const motivation = String(body.motivation ?? "").trim();

    // ── Validation ──────────────────────────────────────────────────────────
    const errors: Record<string, string> = {};
    if (!name || name.length < 2) errors.name = "Please enter your full name.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Please enter a valid email address.";
    if (!phone || phone.replace(/\D/g, "").length < 7)
      errors.phone = "Please enter a valid phone number.";
    if (!city) errors.city = "Please tell us your city.";
    if (areasOfInterest.length === 0)
      errors.areasOfInterest = "Please select at least one area of interest.";
    if (!availability) errors.availability = "Please select your availability.";
    if (!motivation || motivation.length < 20)
      errors.motivation =
        "Tell us a little more about why you'd like to volunteer (min 20 characters).";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const safeAreas = areasOfInterest
      .filter((a) => (AREAS_OF_INTEREST as readonly string[]).includes(a))
      .map(escapeHtml);
    const safeAvailability = (AVAILABILITY as readonly string[]).includes(
      availability,
    )
      ? availability
      : escapeHtml(availability);

    const html = `
      <div style="font-family:'Georgia',serif;max-width:580px;margin:0 auto;color:#1c3a3a;">
        <div style="background:linear-gradient(135deg,#1a3030 0%,#2d6648 100%);padding:28px 36px;border-radius:12px 12px 0 0;">
          <h1 style="color:#ffffff;font-size:20px;margin:0;font-weight:300;letter-spacing:-0.3px;">
            New Volunteer Application
          </h1>
        </div>
        <div style="padding:28px 36px;border:1px solid #e4eee8;border-top:none;border-radius:0 0 12px 12px;">
          <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%;">
            <tr><td style="padding:6px 0;color:#7a9088;width:150px;vertical-align:top;"><strong>Name</strong></td><td>${escapeHtml(name)}</td></tr>
            <tr><td style="padding:6px 0;color:#7a9088;vertical-align:top;"><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
            <tr><td style="padding:6px 0;color:#7a9088;vertical-align:top;"><strong>Phone</strong></td><td>${escapeHtml(phone)}</td></tr>
            <tr><td style="padding:6px 0;color:#7a9088;vertical-align:top;"><strong>City</strong></td><td>${escapeHtml(city)}</td></tr>
            <tr><td style="padding:6px 0;color:#7a9088;vertical-align:top;"><strong>Areas of interest</strong></td><td>${safeAreas.join(", ")}</td></tr>
            <tr><td style="padding:6px 0;color:#7a9088;vertical-align:top;"><strong>Availability</strong></td><td>${safeAvailability}</td></tr>
            ${experience ? `<tr><td style="padding:6px 0;color:#7a9088;vertical-align:top;"><strong>Experience</strong></td><td style="white-space:pre-wrap;">${escapeHtml(experience)}</td></tr>` : ""}
            <tr><td style="padding:6px 0;color:#7a9088;vertical-align:top;"><strong>Why they want to volunteer</strong></td><td style="white-space:pre-wrap;">${escapeHtml(motivation)}</td></tr>
          </table>
          <p style="color:#b0c8bc;font-size:12px;margin-top:24px;">Submitted via trymentel.com/volunteer</p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: email,
      subject: `New Volunteer Application — ${name}`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Volunteer POST]", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

export const POST = withRateLimit(POST_HANDLER);
