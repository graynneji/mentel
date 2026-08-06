// lib/adhd/report-email.ts
//
// Sends the actual PDF as an email attachment (not just a "click here to
// download" link) — for a paid product, the report should land directly in
// the inbox. Follows the same Resend conventions as
// lib/notifications/session-emails.ts.

import { Resend } from "resend";
import { renderToBuffer } from "@react-pdf/renderer";
import AdhdReportDocument, { registerReportFonts } from "./pdf-report";
import { scoreAssessment, Answers } from "./scoring";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Mentel <hello@mail.trymentel.com>";

let fontsRegistered = false;

export async function sendAdhdReportEmail(opts: {
  email: string;
  name: string;
  answers: Answers;
  completionDate: Date;
}) {
  const { email, name, answers, completionDate } = opts;
  const result = scoreAssessment(answers);

  if (!fontsRegistered) {
    registerReportFonts();
    fontsRegistered = true;
  }

  const buffer = await renderToBuffer(
    AdhdReportDocument({
      name: name || "there",
      completionDate: completionDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
      result,
    }) as Parameters<typeof renderToBuffer>[0]
  );

  const firstName = name ? name.split(" ")[0] : "there";

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Your Mentel ADHD report is ready",
    html: wrapEmail(
      "Your report is ready",
      `
        <p>Hi ${firstName},</p>
        <p>Thank you for completing the Mentel ADHD self-assessment. Your full personalised report is attached to this email as a PDF.</p>
        <p>It includes your complete domain-by-domain breakdown, personalised strategies, and a discussion guide you can bring to a doctor or therapist if you'd like to talk it through.</p>
        <p style="color:#6a8578;font-size:12.5px;margin-top:20px;">This is an educational screening, not a diagnosis. If these patterns are affecting your daily life, we'd encourage speaking with a licensed professional.</p>
      `
    ),
    attachments: [
      {
        filename: `Mentel-ADHD-Report-${firstName.replace(/\s+/g, "-")}.pdf`,
        content: buffer,
      },
    ],
  });
}

// Same email wrapper style as lib/notifications/session-emails.ts, kept
// local here rather than imported since that file's wrapper hard-codes a
// "Go to Your Client Portal" CTA that doesn't apply to this email.
function wrapEmail(title: string, bodyHtml: string): string {
  return `
    <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;color:#1c3a3a;">
      <div style="background:linear-gradient(135deg,#0E5C3D 0%,#164a37 100%);padding:26px 32px;border-radius:12px 12px 0 0;">
        <h1 style="color:#fff;font-size:19px;margin:0;font-weight:300;">${title}</h1>
      </div>
      <div style="padding:26px 32px;border:1px solid #e4eee8;border-top:none;border-radius:0 0 12px 12px;font-size:14px;line-height:1.6;">
        ${bodyHtml}
      </div>
    </div>
  `;
}
