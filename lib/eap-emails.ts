// lib/eap-emails.ts
// Resend-based email templates for the EAP programme.
// All emails are optional — wrap calls in try/catch, never block UX on email failure.

import { Resend } from "resend";
import type { RiskBand } from "./eap-scoring";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM ?? "Mentel EAP <eap@mentel.com>";
const ENABLED = !!process.env.RESEND_API_KEY;

// ── Helper ─────────────────────────────────────────────────────────────────────

async function send(to: string, subject: string, html: string): Promise<void> {
  if (!ENABLED) {
    console.log(
      `[EAP Email skipped — no RESEND_API_KEY] To: ${to} | ${subject}`,
    );
    return;
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (err) {
    console.error("[EAP Email failed]", err);
    // Never throw — email failure must not break the user flow
  }
}

const baseStyle = `
  font-family: 'Georgia', serif;
  max-width: 580px;
  margin: 0 auto;
  background: #ffffff;
  color: #1c3a3a;
`;

const headerStyle = `
  background: linear-gradient(135deg, #1a3030 0%, #2d6648 100%);
  padding: 32px 40px;
  border-radius: 12px 12px 0 0;
`;

const bodyStyle = `
  padding: 32px 40px;
  border: 1px solid #e4eee8;
  border-top: none;
  border-radius: 0 0 12px 12px;
`;

const btnStyle = `
  display: inline-block;
  background: linear-gradient(135deg, #2d6648, #3d8b8b);
  color: #ffffff;
  text-decoration: none;
  padding: 14px 28px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.3px;
  margin: 20px 0;
`;

const mutedStyle = `color: #7a9088; font-size: 13px; line-height: 1.7;`;
const dividerStyle = `border: none; border-top: 1px solid #e4eee8; margin: 24px 0;`;

// ── 1. Employee: Assessment completion confirmation ────────────────────────────

export async function sendAssessmentConfirmation(opts: {
  to: string;
  name: string | null;
  riskBand: RiskBand;
  topDomains: string[];
  companyName: string;
}): Promise<void> {
  const greeting = opts.name ? `Hi ${opts.name.split(" ")[0]},` : "Hello,";
  const domainList = opts.topDomains
    .map((d) => `<li style="margin-bottom:6px;">${d}</li>`)
    .join("");

  const html = `
    <div style="${baseStyle}">
      <div style="${headerStyle}">
        <img src="https://mentel.com/logo-white.png" alt="Mentel" width="100" style="margin-bottom:16px;" />
        <h1 style="color:#ffffff; font-size:22px; margin:0; font-weight:300; letter-spacing:-0.5px;">
          Your wellbeing assessment is complete.
        </h1>
      </div>
      <div style="${bodyStyle}">
        <p style="font-size:15px; line-height:1.7; color:#1c3a3a;">${greeting}</p>
        <p style="font-size:15px; line-height:1.7; color:#1c3a3a;">
          Thank you for completing your EAP wellbeing assessment through <strong>${opts.companyName}</strong>'s programme. 
          That first step takes courage, and we want you to know you're in good hands.
        </p>
        <div style="background:#f7faf8; border-left:3px solid #4e8c6a; border-radius:0 8px 8px 0; padding:16px 20px; margin:20px 0;">
          <p style="margin:0 0 8px; font-size:13px; font-weight:600; color:#2d6648; text-transform:uppercase; letter-spacing:1px;">
            Your overall profile
          </p>
          <p style="margin:0; font-size:24px; font-weight:600; color:#1c3a3a;">${opts.riskBand} concern level</p>
        </div>
        ${
          opts.topDomains.length > 0
            ? `
        <p style="${mutedStyle}">Your responses suggest these areas are most affecting you right now:</p>
        <ul style="${mutedStyle} padding-left:20px;">${domainList}</ul>
        `
            : ""
        }
        <p style="font-size:15px; line-height:1.7; color:#1c3a3a;">
          A licensed therapist matched to your profile will reach out within <strong>24 hours</strong> to 
          schedule your first session.
        </p>
        <hr style="${dividerStyle}" />
        <p style="${mutedStyle}">
          <strong style="color:#1c3a3a;">Your privacy is protected.</strong> Your individual answers and this email 
          are never shared with your employer. ${opts.companyName} receives only anonymised, aggregated data 
          across all employees — never your personal responses.
        </p>
        <p style="${mutedStyle}">
          If you need immediate support before your therapist contacts you, please call a crisis line or 
          reach out to a trusted person.
        </p>
        <hr style="${dividerStyle}" />
        <p style="${mutedStyle} font-size:11px;">
          This email was sent as part of the Mentel EAP programme provided by your employer. 
          Questions? Reply to this email or contact eap@mentel.com.
        </p>
      </div>
    </div>
  `;

  await send(
    opts.to,
    "Your Mentel wellbeing assessment — what happens next",
    html,
  );
}

// ── 2. Employee: Crisis immediate response ────────────────────────────────────

export async function sendCrisisAcknowledgement(opts: {
  to: string;
  name: string | null;
}): Promise<void> {
  const greeting = opts.name ? `Hi ${opts.name.split(" ")[0]},` : "Hello,";

  const html = `
    <div style="${baseStyle}">
      <div style="${headerStyle}; background: linear-gradient(135deg, #4a1212 0%, #8b1a1a 100%);">
        <img src="https://mentel.com/logo-white.png" alt="Mentel" width="100" style="margin-bottom:16px;" />
        <h1 style="color:#ffffff; font-size:22px; margin:0; font-weight:300;">
          We're here. You don't have to face this alone.
        </h1>
      </div>
      <div style="${bodyStyle}">
        <p style="font-size:15px; line-height:1.7; color:#1c3a3a;">${greeting}</p>
        <p style="font-size:15px; line-height:1.7; color:#1c3a3a;">
          Your assessment indicated you may be going through an extremely difficult time right now. 
          We want you to know that someone from our clinical team will contact you <strong>within the next few hours</strong> — not tomorrow, today.
        </p>
        <div style="background:#fff8f8; border:1px solid #f5d5d5; border-radius:8px; padding:20px; margin:20px 0;">
          <p style="margin:0 0 12px; font-size:13px; font-weight:600; color:#8b1a1a;">If you need support right now:</p>
          <p style="margin:0; font-size:14px; line-height:1.8; color:#1c3a3a;">
            Nigeria Suicide Prevention Lifeline: <strong>0800-800-2000</strong><br />
            Mentally Aware Nigeria Initiative: <strong>+234 808 210 6493</strong><br />
            Or go to your nearest emergency department.
          </p>
        </div>
        <p style="font-size:15px; line-height:1.7; color:#1c3a3a;">
          Your feelings are valid, and getting support is the right thing to do. What you're going through is real, 
          and you deserve care.
        </p>
        <p style="${mutedStyle}">This message is confidential and has not been shared with your employer.</p>
      </div>
    </div>
  `;

  await send(
    opts.to,
    "We've received your assessment — support is coming",
    html,
  );
}

// ── 3. Admin: Crisis alert ────────────────────────────────────────────────────

export async function sendAdminCrisisAlert(opts: {
  employeeId: string;
  companyName: string;
  riskBand: RiskBand;
  flags: string[];
  department?: string;
}): Promise<void> {
  const adminEmail = process.env.ADMIN_ALERT_EMAIL ?? "clinical@mentel.com";
  const flagList = opts.flags
    .map((f) => `<li>${f.replace(/_/g, " ")}</li>`)
    .join("");

  const html = `
    <div style="${baseStyle}">
      <div style="${headerStyle}; background: #8b1a1a;">
        <h1 style="color:#ffffff; font-size:20px; margin:0; font-weight:600;">⚠ CRISIS FLAG — Immediate Action Required</h1>
      </div>
      <div style="${bodyStyle}">
        <p style="font-size:14px; color:#1c3a3a;"><strong>Company:</strong> ${opts.companyName}</p>
        <p style="font-size:14px; color:#1c3a3a;"><strong>Department:</strong> ${opts.department ?? "Unknown"}</p>
        <p style="font-size:14px; color:#1c3a3a;"><strong>Risk Band:</strong> ${opts.riskBand}</p>
        <p style="font-size:14px; color:#1c3a3a;"><strong>Flags:</strong></p>
        <ul style="font-size:14px; color:#8b1a1a;">${flagList}</ul>
        <p style="font-size:14px; color:#1c3a3a;">
          Employee ID: <code>${opts.employeeId}</code> — Please review in the admin dashboard immediately.
        </p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/companies" style="${btnStyle} background:#8b1a1a;">
          Open Admin Dashboard
        </a>
        <p style="${mutedStyle}">This alert was generated automatically. A crisis acknowledgement email has already been sent to the employee.</p>
      </div>
    </div>
  `;

  await send(
    adminEmail,
    `[URGENT] Crisis flag — ${opts.companyName} EAP`,
    html,
  );
}

// ── 4. Company: Welcome + access code ─────────────────────────────────────────

export async function sendCompanyWelcome(opts: {
  to: string;
  contactName: string;
  companyName: string;
  accessCode: string;
  plan: string;
  planSeats: number;
  hrPortalUrl: string;
}): Promise<void> {
  const html = `
    <div style="${baseStyle}">
      <div style="${headerStyle}">
        <img src="https://mentel.com/logo-white.png" alt="Mentel" width="100" style="margin-bottom:16px;" />
        <h1 style="color:#ffffff; font-size:22px; margin:0; font-weight:300;">
          Welcome to Mentel EAP, ${opts.companyName}.
        </h1>
      </div>
      <div style="${bodyStyle}">
        <p style="font-size:15px; line-height:1.7; color:#1c3a3a;">Hi ${opts.contactName},</p>
        <p style="font-size:15px; line-height:1.7; color:#1c3a3a;">
          Your ${opts.plan} plan is now active. Here's everything you need to get started.
        </p>
        
        <div style="background:#f7faf8; border:1px solid #c8ddd2; border-radius:12px; padding:24px; margin:24px 0;">
          <p style="margin:0 0 8px; font-size:12px; font-weight:600; color:#4e8c6a; text-transform:uppercase; letter-spacing:1px;">Employee Access Code</p>
          <p style="margin:0; font-size:36px; font-weight:700; letter-spacing:4px; color:#1c3a3a; font-family:monospace;">
            ${opts.accessCode}
          </p>
          <p style="margin:8px 0 0; font-size:12px; color:#7a9088;">
            Share this code with your employees so they can enrol in the programme.
          </p>
        </div>

        <h3 style="color:#1c3a3a; font-size:16px; font-weight:600;">Getting started — 3 steps</h3>
        <ol style="font-size:14px; line-height:1.8; color:#7a9088; padding-left:20px;">
          <li><strong style="color:#1c3a3a;">Share the access code</strong> with your employees via email, Slack, or internal comms.</li>
          <li><strong style="color:#1c3a3a;">Employees visit</strong> <a href="${process.env.NEXT_PUBLIC_APP_URL}/eap/enrol" style="color:#4e8c6a;">${process.env.NEXT_PUBLIC_APP_URL}/eap/enrol</a> and enter the code.</li>
          <li><strong style="color:#1c3a3a;">Monitor progress</strong> in your HR portal — anonymised aggregate data only.</li>
        </ol>

        <a href="${opts.hrPortalUrl}" style="${btnStyle}">Access Your HR Dashboard</a>
        
        <hr style="${dividerStyle}" />
        <p style="${mutedStyle}">
          <strong style="color:#1c3a3a;">Plan details:</strong> ${opts.plan} · ${opts.planSeats} seats<br/>
          Your dedicated account manager will reach out within 24 hours to onboard your team.
        </p>
        <p style="${mutedStyle} font-size:11px;">Mentel EAP · NDPR-compliant · All employee data is encrypted and anonymised before any employer reporting.</p>
      </div>
    </div>
  `;

  await send(opts.to, `Your Mentel EAP is live — access code inside`, html);
}

// ── 5. HR: Monthly progress report notification ───────────────────────────────

export async function sendMonthlyReportReady(opts: {
  to: string;
  contactName: string;
  companyName: string;
  month: string;
  enrolled: number;
  avgImprovement: number;
  atRiskCount: number;
  reportUrl: string;
}): Promise<void> {
  const html = `
    <div style="${baseStyle}">
      <div style="${headerStyle}">
        <img src="https://mentel.com/logo-white.png" alt="Mentel" width="100" style="margin-bottom:16px;" />
        <h1 style="color:#ffffff; font-size:22px; margin:0; font-weight:300;">
          ${opts.month} EAP Report — ${opts.companyName}
        </h1>
      </div>
      <div style="${bodyStyle}">
        <p style="font-size:15px; line-height:1.7; color:#1c3a3a;">Hi ${opts.contactName},</p>
        <p style="font-size:15px; line-height:1.7; color:#1c3a3a;">
          Your monthly anonymised wellbeing report is ready. Here are the headline figures:
        </p>

        <table style="width:100%; border-collapse:collapse; margin:20px 0;">
          ${[
            ["Enrolled employees", `${opts.enrolled}`],
            [
              "Average improvement",
              `${opts.avgImprovement}% vs first assessment`,
            ],
            [
              "Employees in High/Critical band",
              `${opts.atRiskCount} (being supported by clinical team)`,
            ],
          ]
            .map(
              ([label, value]) => `
            <tr>
              <td style="padding:12px 0; border-bottom:1px solid #e4eee8; font-size:13px; color:#7a9088;">${label}</td>
              <td style="padding:12px 0; border-bottom:1px solid #e4eee8; font-size:13px; font-weight:600; color:#1c3a3a; text-align:right;">${value}</td>
            </tr>
          `,
            )
            .join("")}
        </table>

        <a href="${opts.reportUrl}" style="${btnStyle}">View Full Report + Download PDF</a>

        <hr style="${dividerStyle}" />
        <p style="${mutedStyle} font-size:11px;">
          All data in this report is fully anonymised. Individual employee data is never shared. 
          NDPR-compliant. Mentel EAP.
        </p>
      </div>
    </div>
  `;

  await send(
    opts.to,
    `${opts.month} wellbeing report ready — ${opts.companyName}`,
    html,
  );
}
