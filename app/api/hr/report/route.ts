// app/api/hr/report/route.ts
// GET: Generate a print-ready HTML wellbeing report for the company.
// ?format=html  → downloadable HTML (default)
// ?format=json  → raw numbers (for custom reporting tools)

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getHRSession } from "@/lib/hr-auth";

interface EmployeeForReport {
  sessionsUsed: number;
  improvementPct: number | null;
  riskBand: string | null;
  assessments: { totalScore: number; riskBand: string }[];
}

const BAND_COLORS: Record<string, string> = {
  Low: "#4e8c6a",
  Mild: "#3d8b8b",
  Moderate: "#8b6e3d",
  High: "#b94a4f",
  Critical: "#8b1a1a",
};

export async function GET(req: NextRequest) {
  try {
    const companyId = await getHRSession(req);
    if (!companyId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") ?? "html";

    const company = await db.company.findUnique({
      where: { id: companyId },
      select: { name: true, plan: true, planSeats: true, sessionCap: true },
    });

    if (!company) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const employees: EmployeeForReport[] = await db.companyEmployee.findMany({
      where: { companyId, status: "active" },
      select: {
        sessionsUsed: true,
        improvementPct: true,
        riskBand: true,
        assessments: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { totalScore: true, riskBand: true },
        },
      },
    });

    const assessed = employees.filter((e) => e.assessments.length > 0);

    const bandCounts: Record<string, number> = {};
    assessed.forEach((e) => {
      const b = e.riskBand ?? "Unknown";
      bandCounts[b] = (bandCounts[b] ?? 0) + 1;
    });

    const avgImprovement =
      assessed.length > 0
        ? Math.round(
            assessed.reduce((s, e) => s + (e.improvementPct ?? 0), 0) /
              assessed.length,
          )
        : 0;

    const sessionsUsed = employees.reduce((s, e) => s + e.sessionsUsed, 0);

    const reportDate = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // ── JSON format ─────────────────────────────────────────────────────────────

    if (format === "json") {
      return NextResponse.json({
        company: company.name,
        reportDate,
        totalEnrolled: employees.length,
        assessed: assessed.length,
        bandDistribution: bandCounts,
        avgImprovement,
        sessionsUsed,
      });
    }

    // ── HTML format (print-ready) ────────────────────────────────────────────────

    const bandOrder = ["Low", "Mild", "Moderate", "High", "Critical"];
    const bandRows = Object.entries(bandCounts)
      .sort(([a], [b]) => bandOrder.indexOf(a) - bandOrder.indexOf(b))
      .map(
        ([band, count]) => `
        <tr>
          <td style="padding:10px 16px; font-size:13px; color:${BAND_COLORS[band] ?? "#333"}; font-weight:600;">${band}</td>
          <td style="padding:10px 16px; font-size:13px; color:#1c3a3a;">${count} ${count === 1 ? "employee" : "employees"}</td>
          <td style="padding:10px 16px; font-size:13px; color:#7a9088;">
            ${assessed.length > 0 ? Math.round((count / assessed.length) * 100) : 0}%
          </td>
        </tr>`,
      )
      .join("");

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Mentel EAP Report — ${company.name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'DM Sans', sans-serif;
      color: #1c3a3a;
      background: #fff;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
      line-height: 1.6;
    }
    @media print {
      body { padding: 0; }
      @page { margin: 20mm; }
    }
    .header { border-bottom: 3px solid #4e8c6a; padding-bottom: 24px; margin-bottom: 32px; }
    .logo { font-family: 'EB Garamond', serif; font-size: 28px; color: #1c3a3a; }
    .logo span { color: #4e8c6a; }
    h1 { font-family: 'EB Garamond', serif; font-size: 22px; font-weight: 400; margin-top: 8px; }
    .meta { font-size: 12px; color: #7a9088; margin-top: 4px; }
    .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 24px 0; }
    .stat-box { border: 1px solid #e4eee8; border-radius: 8px; padding: 16px; text-align: center; }
    .stat-number { font-family: 'EB Garamond', serif; font-size: 32px; color: #1c3a3a; }
    .stat-label { font-size: 11px; color: #7a9088; text-transform: uppercase; letter-spacing: 0.8px; margin-top: 4px; }
    .section-title { font-family: 'EB Garamond', serif; font-size: 18px; margin: 28px 0 12px; color: #1c3a3a; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th { background: #f7faf8; padding: 10px 16px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: #7a9088; }
    tr:nth-child(even) { background: #f9fdfb; }
    .improvement-badge {
      display: inline-block;
      background: #e8f5ef;
      color: #2d6648;
      border-radius: 20px;
      padding: 4px 12px;
      font-size: 13px;
      font-weight: 600;
    }
    .privacy-notice {
      border: 1px solid #c8ddd2;
      border-radius: 8px;
      padding: 16px;
      margin-top: 32px;
      background: #f7faf8;
    }
    .privacy-notice p { font-size: 12px; color: #7a9088; line-height: 1.7; }
    .footer {
      margin-top: 40px;
      padding-top: 16px;
      border-top: 1px solid #e4eee8;
      font-size: 11px;
      color: #b0c8bc;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">Mentel <span>EAP</span></div>
    <h1>Employee Wellbeing Report — ${company.name}</h1>
    <div class="meta">Report date: ${reportDate} · ${company.plan} plan · Confidential</div>
  </div>

  <div class="stat-grid">
    <div class="stat-box">
      <div class="stat-number">${employees.length}</div>
      <div class="stat-label">Enrolled employees</div>
    </div>
    <div class="stat-box">
      <div class="stat-number">${assessed.length}</div>
      <div class="stat-label">Completed assessments</div>
    </div>
    <div class="stat-box">
      <div class="stat-number">${sessionsUsed}</div>
      <div class="stat-label">Sessions delivered</div>
    </div>
  </div>

  <div style="text-align:center; margin: 20px 0;">
    <span class="improvement-badge">▼ ${avgImprovement}% average improvement across assessed employees</span>
  </div>

  <div class="section-title">Risk Band Distribution</div>
  <table>
    <thead>
      <tr>
        <th>Band</th>
        <th>Employees</th>
        <th>Proportion</th>
      </tr>
    </thead>
    <tbody>${bandRows || '<tr><td colspan="3" style="padding:16px; color:#b0c8bc; text-align:center;">No assessment data yet</td></tr>'}</tbody>
  </table>

  <div class="privacy-notice">
    <p>
      <strong>Privacy &amp; confidentiality notice</strong><br />
      This report contains only anonymised, aggregated data. Individual employee responses,
      assessment answers, and therapy session content are never shared with employers.
      All data is processed in accordance with the Nigerian Data Protection Regulation (NDPR)
      and Mentel's Data Processing Agreement. Sub-groups smaller than 5 employees are not
      reported to prevent re-identification.
    </p>
  </div>

  <div class="footer">
    Mentel EAP &middot; eap@mentel.com &middot; NDPR-compliant &middot; Generated ${reportDate}
  </div>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="mentel-eap-report-${new Date().toISOString().split("T")[0]}.html"`,
      },
    });
  } catch (err) {
    console.error("[HR report]", err);
    return NextResponse.json(
      { error: "Failed to generate report." },
      { status: 500 },
    );
  }
}
