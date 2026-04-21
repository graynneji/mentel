/**
 * /app/api/eap-demo/route.ts
 *
 * Handles demo-request form submissions from EAPSection.tsx.
 * Replace the stub below with your actual delivery mechanism:
 * - Loops.so / Resend for email delivery
 * - Airtable / Notion for lead capture
 * - Slack webhook for instant team notification
 *
 * Place this file at: app/api/eap-demo/route.ts
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, companySize } = body;

    if (!name || !email || !companySize) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // ── Option A: send via Resend ────────────────────────────────
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: "no-reply@trymentel.com",
    //   to: "hello@trymentel.com",
    //   subject: `New EAP demo request from ${name}`,
    //   text: `Name: ${name}\nEmail: ${email}\nTeam size: ${companySize}`,
    // });

    // ── Option B: Slack webhook ─────────────────────────────────
    // await fetch(process.env.SLACK_WEBHOOK_URL!, {
    //   method: "POST",
    //   body: JSON.stringify({
    //     text: `🏢 New EAP demo request\n*Name:* ${name}\n*Email:* ${email}\n*Team size:* ${companySize}`,
    //   }),
    // });

    // ── Option C: Airtable ──────────────────────────────────────
    // await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/EAP Leads`, {
    //   method: "POST",
    //   headers: { Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`, "Content-Type": "application/json" },
    //   body: JSON.stringify({ fields: { Name: name, Email: email, "Team Size": companySize } }),
    // });

    console.log("EAP demo request:", { name, email, companySize });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("EAP demo route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
