// app/api/volunteer-verification/route.ts
// POST: validates a volunteer verification (KYC) submission, saves it to
// the database (document URLs need a durable, reviewable record — unlike
// the simple /volunteer form, this can't be email-only), and emails the
// team a summary so nothing sits unnoticed in the admin queue.

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { db } from "@/lib/db";
import { withRateLimit } from "@/lib/withRateLimit";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Mentel Volunteers <hello@mail.trymentel.com>";
const TO = process.env.VOLUNTEER_NOTIFICATION_EMAIL ?? "hello@trymentel.com";

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Nigerian NIN is 11 digits.
function isValidNin(value: string): boolean {
  return /^\d{11}$/.test(value.trim());
}

async function POST_HANDLER(req: Request) {
  const nextReq = req as NextRequest;

  try {
    const body = await nextReq.json();

    const fullName = String(body.fullName ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const city = String(body.city ?? "").trim();
    const role = String(body.role ?? "").trim();
    const isLicensedProfessional = !!body.isLicensedProfessional;
    const licenseBody = body.licenseBody ? String(body.licenseBody).trim() : null;
    const licenseNumber = body.licenseNumber ? String(body.licenseNumber).trim() : null;
    const licenseDocumentUrl = body.licenseDocumentUrl ? String(body.licenseDocumentUrl).trim() : null;
    const ninNumber = String(body.ninNumber ?? "").trim();
    const ninDocumentUrl = body.ninDocumentUrl ? String(body.ninDocumentUrl).trim() : null;
    const cvDocumentUrl = String(body.cvDocumentUrl ?? "").trim();

    const errors: Record<string, string> = {};
    if (!fullName || fullName.length < 2) errors.fullName = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email address.";
    if (!phone || phone.replace(/\D/g, "").length < 7) errors.phone = "Please enter a valid phone number.";
    if (!city) errors.city = "Please tell us your city.";
    if (!role) errors.role = "Please select what you'd like to volunteer for.";
    if (!ninNumber || !isValidNin(ninNumber)) errors.ninNumber = "Please enter a valid 11-digit NIN.";
    if (!cvDocumentUrl) errors.cvDocumentUrl = "Please upload your CV.";
    if (isLicensedProfessional && !licenseDocumentUrl) {
      errors.licenseDocumentUrl = "Please upload your professional license or registration document.";
    }
    if (isLicensedProfessional && !licenseBody) {
      errors.licenseBody = "Please tell us which body licensed you.";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const record = await db.volunteerVerification.create({
      data: {
        fullName,
        email,
        phone,
        city,
        role,
        isLicensedProfessional,
        licenseBody,
        licenseNumber,
        licenseDocumentUrl,
        ninNumber,
        ninDocumentUrl,
        cvDocumentUrl,
        status: "pending",
      },
    });

    // Best-effort notification — the record is already safely saved above,
    // so an email failure here shouldn't fail the whole submission.
    try {
      const html = `
        <div style="font-family:'Georgia',serif;max-width:580px;margin:0 auto;color:#1c3a3a;">
          <div style="background:linear-gradient(135deg,#1a3030 0%,#2d6648 100%);padding:28px 36px;border-radius:12px 12px 0 0;">
            <h1 style="color:#ffffff;font-size:20px;margin:0;font-weight:300;">New Volunteer Verification Submitted</h1>
          </div>
          <div style="padding:28px 36px;border:1px solid #e4eee8;border-top:none;border-radius:0 0 12px 12px;">
            <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%;">
              <tr><td style="padding:6px 0;color:#7a9088;width:160px;"><strong>Name</strong></td><td>${escapeHtml(fullName)}</td></tr>
              <tr><td style="padding:6px 0;color:#7a9088;"><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
              <tr><td style="padding:6px 0;color:#7a9088;"><strong>Phone</strong></td><td>${escapeHtml(phone)}</td></tr>
              <tr><td style="padding:6px 0;color:#7a9088;"><strong>City</strong></td><td>${escapeHtml(city)}</td></tr>
              <tr><td style="padding:6px 0;color:#7a9088;"><strong>Role</strong></td><td>${escapeHtml(role)}</td></tr>
              <tr><td style="padding:6px 0;color:#7a9088;"><strong>Licensed professional</strong></td><td>${isLicensedProfessional ? "Yes" : "No"}</td></tr>
              ${isLicensedProfessional ? `<tr><td style="padding:6px 0;color:#7a9088;"><strong>License body</strong></td><td>${escapeHtml(licenseBody ?? "")}</td></tr>` : ""}
            </table>
            <p style="margin-top:20px;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.trymentel.com"}/admin/volunteer-verifications" style="color:#3d8b8b;">Review this submission in the admin dashboard →</a>
            </p>
            <p style="color:#b0c8bc;font-size:12px;margin-top:16px;">CV and identity documents are stored securely and linked from the admin dashboard — not included in this email.</p>
          </div>
        </div>
      `;
      await resend.emails.send({
        from: FROM,
        to: [TO],
        replyTo: email,
        subject: `New Volunteer Verification — ${fullName}`,
        html,
      });
    } catch (emailErr) {
      console.error("[Volunteer Verification email]", emailErr);
    }

    return NextResponse.json({ success: true, id: record.id });
  } catch (err) {
    console.error("[Volunteer Verification POST]", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(POST_HANDLER);
