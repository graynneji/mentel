// // app/api/hr/analytics/route.ts
// // GET: Returns anonymised aggregate EAP data for the authenticated company.
// // CRITICAL: Never returns individual employee PII. Only population-level stats.
// // Minimum cohort size of 5 enforced for any sub-group to prevent re-identification.

// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { getHRSession } from "@/lib/hr-auth";

// const MIN_COHORT = 5;

// // ── Types for internal use ─────────────────────────────────────────────────────

// interface AssessmentSnapshot {
//   totalScore: number;
//   riskBand: string;
//   stressScore: number | null;
//   anxietyScore: number | null;
//   depressionScore: number | null;
//   burnoutScore: number | null;
//   sleepScore: number | null;
//   selfEsteemScore: number | null;
//   relationshipScore: number | null;
//   createdAt: Date;
// }

// interface EmployeeWithLatest {
//   department: string | null;
//   riskBand: string | null;
//   overallScore: number | null;
//   improvementPct: number | null;
//   sessionsUsed: number;
//   assessments: AssessmentSnapshot[];
// }

// interface PrevAssessment {
//   employeeId: string;
//   stressScore: number | null;
//   anxietyScore: number | null;
//   depressionScore: number | null;
//   burnoutScore: number | null;
//   sleepScore: number | null;
//   selfEsteemScore: number | null;
// }

// type DomainKey = keyof Pick<
//   AssessmentSnapshot,
//   | "stressScore"
//   | "anxietyScore"
//   | "depressionScore"
//   | "burnoutScore"
//   | "sleepScore"
//   | "selfEsteemScore"
// >;

// export async function GET(req: NextRequest) {
//   try {
//     const companyId = await getHRSession(req);
//     if (!companyId) {
//       return NextResponse.json(
//         { error: "Please log in with your access code." },
//         { status: 401 },
//       );
//     }

//     const company = await db.company.findUnique({
//       where: { id: companyId },
//       select: {
//         id: true,
//         name: true,
//         plan: true,
//         planSeats: true,
//         sessionCap: true,
//         planRenewAt: true,
//         status: true,
//         focusAreas: true,
//       },
//     });

//     if (!company) {
//       return NextResponse.json(
//         { error: "Company not found." },
//         { status: 404 },
//       );
//     }

//     // Fetch all active employees with their latest assessment
//     const employees: EmployeeWithLatest[] = await db.companyEmployee.findMany({
//       where: { companyId, status: "active" },
//       include: {
//         assessments: {
//           orderBy: { createdAt: "desc" },
//           take: 1,
//           select: {
//             totalScore: true,
//             riskBand: true,
//             stressScore: true,
//             anxietyScore: true,
//             depressionScore: true,
//             burnoutScore: true,
//             sleepScore: true,
//             selfEsteemScore: true,
//             relationshipScore: true,
//             createdAt: true,
//           },
//         },
//       },
//     });

//     const assessed = employees.filter((e) => e.assessments.length > 0);
//     const totalEnrolled = employees.length;
//     const assessedCount = assessed.length;

//     // Risk band distribution
//     const bandCounts: Record<string, number> = {};
//     assessed.forEach((e) => {
//       const band = e.riskBand ?? "Unknown";
//       bandCounts[band] = (bandCounts[band] ?? 0) + 1;
//     });

//     const bandOrder = ["Low", "Mild", "Moderate", "High", "Critical"];
//     const riskDistribution = Object.entries(bandCounts)
//       .map(([band, count]) => ({
//         band,
//         count,
//         pct: assessedCount > 0 ? Math.round((count / assessedCount) * 100) : 0,
//       }))
//       .sort((a, b) => bandOrder.indexOf(a.band) - bandOrder.indexOf(b.band));

//     // Domain averages
//     const domainKeys: { key: DomainKey; label: string }[] = [
//       { key: "stressScore", label: "Stress" },
//       { key: "anxietyScore", label: "Anxiety" },
//       { key: "depressionScore", label: "Low Mood" },
//       { key: "burnoutScore", label: "Burnout" },
//       { key: "sleepScore", label: "Sleep" },
//       { key: "selfEsteemScore", label: "Self-esteem" },
//     ];

//     // Fetch previous month assessments for trend comparison
//     const oneMonthAgo = new Date();
//     oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

//     const prevAssessments: PrevAssessment[] = await db.eAPAssessment.findMany({
//       where: {
//         employee: { companyId },
//         createdAt: { lte: oneMonthAgo },
//       },
//       orderBy: [{ employeeId: "asc" }, { createdAt: "desc" }],
//       distinct: ["employeeId"],
//       select: {
//         employeeId: true,
//         stressScore: true,
//         anxietyScore: true,
//         depressionScore: true,
//         burnoutScore: true,
//         sleepScore: true,
//         selfEsteemScore: true,
//       },
//     });

//     const prevByEmployee: Record<string, PrevAssessment> = {};
//     prevAssessments.forEach((a) => {
//       prevByEmployee[a.employeeId] = a;
//     });

//     const domainAverages = domainKeys.map(({ key, label }) => {
//       const vals = assessed
//         .map((e) => e.assessments[0]?.[key] ?? null)
//         .filter((v): v is number => v !== null);

//       const avg =
//         vals.length > 0
//           ? Math.round(vals.reduce((s, v) => s + v, 0) / vals.length)
//           : 0;

//       const prevVals = Object.values(prevByEmployee)
//         .map((a) => a[key] ?? null)
//         .filter((v): v is number => v !== null);

//       const prevAvg =
//         prevVals.length > 0
//           ? Math.round(prevVals.reduce((s, v) => s + v, 0) / prevVals.length)
//           : avg;

//       const trend = avg - prevAvg; // negative = improving

//       return { domain: key.replace("Score", ""), label, score: avg, trend };
//     });

//     // 6-month trend
//     const months: { month: string; avgScore: number; enrolled: number }[] = [];
//     for (let i = 5; i >= 0; i--) {
//       const date = new Date();
//       date.setMonth(date.getMonth() - i);
//       const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
//       const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

//       const [monthAssessments, enrolledByMonth] = await Promise.all([
//         db.eAPAssessment.findMany({
//           where: {
//             employee: { companyId },
//             createdAt: { gte: monthStart, lte: monthEnd },
//           },
//           select: { totalScore: true },
//         }),
//         db.companyEmployee.count({
//           where: { companyId, enrolledAt: { lte: monthEnd } },
//         }),
//       ]);

//       const avgScore =
//         monthAssessments.length > 0
//           ? Math.round(
//               monthAssessments.reduce((s, a) => s + a.totalScore, 0) /
//                 monthAssessments.length,
//             )
//           : 0;

//       months.push({
//         month: date.toLocaleString("en", { month: "short" }),
//         avgScore,
//         enrolled: enrolledByMonth,
//       });
//     }

//     // Department breakdown — only groups with ≥ MIN_COHORT to prevent re-identification
//     const deptGroups: Record<string, { scores: number[]; sessions: number }> =
//       {};
//     employees.forEach((e) => {
//       const dept = e.department ?? "Other";
//       if (!deptGroups[dept]) deptGroups[dept] = { scores: [], sessions: 0 };
//       deptGroups[dept].sessions += e.sessionsUsed;
//       const latest = e.assessments[0];
//       if (latest) deptGroups[dept].scores.push(latest.totalScore);
//     });

//     const departmentData = Object.entries(deptGroups)
//       .filter(([, d]) => d.scores.length >= MIN_COHORT)
//       .map(([dept, d]) => ({
//         department: dept,
//         avgScore:
//           d.scores.length > 0
//             ? Math.round(d.scores.reduce((s, v) => s + v, 0) / d.scores.length)
//             : 0,
//         count: d.scores.length,
//         sessionsUsed: d.sessions,
//         // Estimated remaining based on cap minus used
//         sessionsAvailable: Math.max(
//           0,
//           d.scores.length * company.sessionCap - d.sessions,
//         ),
//       }));

//     // Overview stats
//     const atRiskCount = assessed.filter(
//       (e) => e.riskBand === "High" || e.riskBand === "Critical",
//     ).length;

//     const avgImprovement =
//       assessed.length > 0
//         ? Math.round(
//             assessed.reduce((s, e) => s + (e.improvementPct ?? 0), 0) /
//               assessed.length,
//           )
//         : 0;

//     const sessionsUsedTotal = employees.reduce((s, e) => s + e.sessionsUsed, 0);
//     const sessionsCapTotal = totalEnrolled * company.sessionCap;

//     const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
//     const activeThisMonth = assessed.filter((e) => {
//       const latest = e.assessments[0];
//       return latest && new Date(latest.createdAt) >= thirtyDaysAgo;
//     }).length;

//     return NextResponse.json({
//       success: true,
//       company: {
//         name: company.name,
//         plan: company.plan,
//         planSeats: company.planSeats,
//         sessionCap: company.sessionCap,
//         planRenewAt: company.planRenewAt,
//         status: company.status,
//       },
//       overview: {
//         totalEnrolled,
//         assessedCount,
//         assessmentRate:
//           totalEnrolled > 0
//             ? Math.round((assessedCount / totalEnrolled) * 100)
//             : 0,
//         activeThisMonth,
//         sessionsUsedTotal,
//         sessionsAvailable: Math.max(0, sessionsCapTotal - sessionsUsedTotal),
//         avgImprovement,
//         atRiskCount,
//         atRiskPct:
//           assessedCount > 0
//             ? Math.round((atRiskCount / assessedCount) * 100)
//             : 0,
//       },
//       riskDistribution,
//       domainAverages,
//       trend: months,
//       departmentData,
//       privacyNote: `Data shown for cohorts of ${MIN_COHORT}+ employees only. Individual responses are never disclosed.`,
//     });
//   } catch (err) {
//     console.error("[HR analytics]", err);
//     return NextResponse.json(
//       { error: "Failed to load analytics." },
//       { status: 500 },
//     );
//   }
// }

// app/api/hr/analytics/route.ts
// GET: Anonymised aggregate EAP data for the authenticated HR company.
//
// FIXES:
// 1. Month boundary now uses end-of-day (23:59:59) so assessments on the last
//    day of a month are included correctly.
// 2. 6-month trend queries run in parallel (Promise.all) — faster and avoids
//    sequential await waterfall.
// 3. Trend returns data even when avgScore is 0 (shows enrolled count still).
// 4. prevByEmployee lookup now correctly keyed by employeeId string.
////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { getHRSession } from "@/lib/hr-auth";

// const MIN_COHORT = 5;

// interface AssessmentSnapshot {
//   totalScore: number;
//   riskBand: string;
//   stressScore: number | null;
//   anxietyScore: number | null;
//   depressionScore: number | null;
//   burnoutScore: number | null;
//   sleepScore: number | null;
//   selfEsteemScore: number | null;
//   relationshipScore: number | null;
//   createdAt: Date;
// }

// interface EmployeeWithLatest {
//   department: string | null;
//   riskBand: string | null;
//   overallScore: number | null;
//   improvementPct: number | null;
//   sessionsUsed: number;
//   assessments: AssessmentSnapshot[];
// }

// interface PrevAssessment {
//   employeeId: string;
//   stressScore: number | null;
//   anxietyScore: number | null;
//   depressionScore: number | null;
//   burnoutScore: number | null;
//   sleepScore: number | null;
//   selfEsteemScore: number | null;
// }

// type DomainKey = keyof Pick<
//   AssessmentSnapshot,
//   | "stressScore"
//   | "anxietyScore"
//   | "depressionScore"
//   | "burnoutScore"
//   | "sleepScore"
//   | "selfEsteemScore"
// >;

// // Returns start of a day (00:00:00.000) for a given date
// function startOfDay(d: Date): Date {
//   return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
// }

// // Returns end of a day (23:59:59.999) for a given date
// function endOfDay(d: Date): Date {
//   return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
// }

// // Last day of a given month, at end of day
// function endOfMonth(year: number, month: number): Date {
//   // month is 0-indexed; month+1 day 0 = last day of month
//   const lastDay = new Date(year, month + 1, 0);
//   return endOfDay(lastDay);
// }

// // First day of a given month, at start of day
// function startOfMonth(year: number, month: number): Date {
//   return startOfDay(new Date(year, month, 1));
// }

// export async function GET(req: NextRequest) {
//   try {
//     const companyId = await getHRSession(req);
//     if (!companyId) {
//       return NextResponse.json(
//         { error: "Please log in with your access code." },
//         { status: 401 },
//       );
//     }

//     const company = await db.company.findUnique({
//       where: { id: companyId },
//       select: {
//         id: true,
//         name: true,
//         plan: true,
//         planSeats: true,
//         sessionCap: true,
//         planRenewAt: true,
//         status: true,
//         focusAreas: true,
//       },
//     });

//     if (!company) {
//       return NextResponse.json(
//         { error: "Company not found." },
//         { status: 404 },
//       );
//     }

//     // ── All active employees with their latest assessment ──────────────────────

//     const employees: EmployeeWithLatest[] = await db.companyEmployee.findMany({
//       where: { companyId, status: "active" },
//       include: {
//         assessments: {
//           orderBy: { createdAt: "desc" },
//           take: 1,
//           select: {
//             totalScore: true,
//             riskBand: true,
//             stressScore: true,
//             anxietyScore: true,
//             depressionScore: true,
//             burnoutScore: true,
//             sleepScore: true,
//             selfEsteemScore: true,
//             relationshipScore: true,
//             createdAt: true,
//           },
//         },
//       },
//     });

//     const assessed = employees.filter((e) => e.assessments.length > 0);
//     const totalEnrolled = employees.length;
//     const assessedCount = assessed.length;

//     // ── Risk band distribution ────────────────────────────────────────────────

//     const bandCounts: Record<string, number> = {};
//     assessed.forEach((e) => {
//       const band = e.riskBand ?? "Unknown";
//       bandCounts[band] = (bandCounts[band] ?? 0) + 1;
//     });

//     const bandOrder = ["Low", "Mild", "Moderate", "High", "Critical"];
//     const riskDistribution = Object.entries(bandCounts)
//       .map(([band, count]) => ({
//         band,
//         count,
//         pct: assessedCount > 0 ? Math.round((count / assessedCount) * 100) : 0,
//       }))
//       .sort((a, b) => bandOrder.indexOf(a.band) - bandOrder.indexOf(b.band));

//     // ── Domain averages + month-on-month trend ────────────────────────────────

//     const domainKeys: { key: DomainKey; label: string }[] = [
//       { key: "stressScore", label: "Stress" },
//       { key: "anxietyScore", label: "Anxiety" },
//       { key: "depressionScore", label: "Low Mood" },
//       { key: "burnoutScore", label: "Burnout" },
//       { key: "sleepScore", label: "Sleep" },
//       { key: "selfEsteemScore", label: "Self-esteem" },
//     ];

//     // Previous month's latest assessment per employee (for trend delta)
//     const oneMonthAgo = new Date();
//     oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

//     const prevAssessments: PrevAssessment[] = await db.eAPAssessment.findMany({
//       where: {
//         employee: { companyId },
//         createdAt: { lte: oneMonthAgo },
//       },
//       orderBy: [{ employeeId: "asc" }, { createdAt: "desc" }],
//       distinct: ["employeeId"],
//       select: {
//         employeeId: true,
//         stressScore: true,
//         anxietyScore: true,
//         depressionScore: true,
//         burnoutScore: true,
//         sleepScore: true,
//         selfEsteemScore: true,
//       },
//     });

//     // Key by employeeId string for O(1) lookup
//     const prevByEmployee: Record<string, PrevAssessment> = {};
//     for (const a of prevAssessments) {
//       prevByEmployee[a.employeeId] = a;
//     }

//     const domainAverages = domainKeys.map(({ key, label }) => {
//       const vals = assessed
//         .map((e) => e.assessments[0]?.[key] ?? null)
//         .filter((v): v is number => v !== null);

//       const avg =
//         vals.length > 0
//           ? Math.round(vals.reduce((s, v) => s + v, 0) / vals.length)
//           : 0;

//       const prevVals = Object.values(prevByEmployee)
//         .map((a) => a[key] ?? null)
//         .filter((v): v is number => v !== null);

//       const prevAvg =
//         prevVals.length > 0
//           ? Math.round(prevVals.reduce((s, v) => s + v, 0) / prevVals.length)
//           : avg; // No previous data → trend = 0

//       return {
//         domain: key.replace("Score", ""),
//         label,
//         score: avg,
//         trend: avg - prevAvg, // negative = improving
//       };
//     });

//     // ── 6-month trend (parallel queries — much faster) ────────────────────────

//     const now = new Date();

//     // Build month ranges for the last 6 months
//     const monthRanges = Array.from({ length: 6 }, (_, idx) => {
//       const d = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
//       return {
//         label: d.toLocaleString("en", { month: "short" }),
//         year: d.getFullYear(),
//         month: d.getMonth(), // 0-indexed
//         monthStart: startOfMonth(d.getFullYear(), d.getMonth()),
//         monthEnd: endOfMonth(d.getFullYear(), d.getMonth()),
//       };
//     });

//     // Run all 12 queries (assessments + enrolment count) in parallel
//     const monthResults = await Promise.all(
//       monthRanges.map(async (m) => {
//         const [assessmentsInMonth, enrolledByMonth] = await Promise.all([
//           db.eAPAssessment.findMany({
//             where: {
//               employee: { companyId },
//               createdAt: { gte: m.monthStart, lte: m.monthEnd },
//             },
//             select: { totalScore: true },
//           }),
//           db.companyEmployee.count({
//             where: {
//               companyId,
//               enrolledAt: { lte: m.monthEnd },
//               status: "active",
//             },
//           }),
//         ]);

//         const avgScore =
//           assessmentsInMonth.length > 0
//             ? Math.round(
//                 assessmentsInMonth.reduce((s, a) => s + a.totalScore, 0) /
//                   assessmentsInMonth.length,
//               )
//             : 0;

//         return {
//           month: m.label,
//           avgScore,
//           enrolled: enrolledByMonth,
//           hasData: assessmentsInMonth.length > 0,
//         };
//       }),
//     );

//     // ── Department breakdown ───────────────────────────────────────────────────

//     const deptGroups: Record<string, { scores: number[]; sessions: number }> =
//       {};
//     employees.forEach((e) => {
//       const dept = e.department ?? "Other";
//       if (!deptGroups[dept]) deptGroups[dept] = { scores: [], sessions: 0 };
//       deptGroups[dept].sessions += e.sessionsUsed;
//       const latest = e.assessments[0];
//       if (latest) deptGroups[dept].scores.push(latest.totalScore);
//     });

//     const departmentData = Object.entries(deptGroups)
//       .filter(([, d]) => d.scores.length >= MIN_COHORT)
//       .map(([dept, d]) => ({
//         department: dept,
//         avgScore:
//           d.scores.length > 0
//             ? Math.round(d.scores.reduce((s, v) => s + v, 0) / d.scores.length)
//             : 0,
//         count: d.scores.length,
//         sessionsUsed: d.sessions,
//         sessionsAvailable: Math.max(
//           0,
//           d.scores.length * company.sessionCap - d.sessions,
//         ),
//       }));

//     // ── Overview stats ────────────────────────────────────────────────────────

//     const atRiskCount = assessed.filter(
//       (e) => e.riskBand === "High" || e.riskBand === "Critical",
//     ).length;

//     const avgImprovement =
//       assessed.length > 0
//         ? Math.round(
//             assessed.reduce((s, e) => s + (e.improvementPct ?? 0), 0) /
//               assessed.length,
//           )
//         : 0;

//     const sessionsUsedTotal = employees.reduce((s, e) => s + e.sessionsUsed, 0);
//     const sessionsCapTotal = totalEnrolled * company.sessionCap;

//     const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
//     const activeThisMonth = assessed.filter((e) => {
//       const latest = e.assessments[0];
//       return latest && new Date(latest.createdAt) >= thirtyDaysAgo;
//     }).length;

//     return NextResponse.json({
//       success: true,
//       company: {
//         name: company.name,
//         plan: company.plan,
//         planSeats: company.planSeats,
//         sessionCap: company.sessionCap,
//         planRenewAt: company.planRenewAt,
//         status: company.status,
//       },
//       overview: {
//         totalEnrolled,
//         assessedCount,
//         assessmentRate:
//           totalEnrolled > 0
//             ? Math.round((assessedCount / totalEnrolled) * 100)
//             : 0,
//         activeThisMonth,
//         sessionsUsedTotal,
//         sessionsAvailable: Math.max(0, sessionsCapTotal - sessionsUsedTotal),
//         avgImprovement,
//         atRiskCount,
//         atRiskPct:
//           assessedCount > 0
//             ? Math.round((atRiskCount / assessedCount) * 100)
//             : 0,
//       },
//       riskDistribution,
//       domainAverages,
//       trend: monthResults, // includes hasData flag so UI can differentiate "no data" from score=0
//       departmentData,
//       privacyNote: `Data shown for cohorts of ${MIN_COHORT}+ employees only. Individual responses are never disclosed.`,
//     });
//   } catch (err) {
//     console.error("[HR analytics]", err);
//     return NextResponse.json(
//       { error: "Failed to load analytics." },
//       { status: 500 },
//     );
//   }
// }
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getHRSession } from "@/lib/hr-auth";

const MIN_COHORT = 5;

interface AssessmentSnapshot {
  totalScore: number;
  riskBand: string;
  stressScore: number | null;
  anxietyScore: number | null;
  depressionScore: number | null;
  burnoutScore: number | null;
  sleepScore: number | null;
  selfEsteemScore: number | null;
  relationshipScore: number | null;
  createdAt: Date;
}

interface EmployeeWithLatest {
  department: string | null;
  riskBand: string | null;
  overallScore: number | null;
  improvementPct: number | null;
  sessionsUsed: number;
  assessments: AssessmentSnapshot[];
}

interface PrevAssessment {
  employeeId: string;
  stressScore: number | null;
  anxietyScore: number | null;
  depressionScore: number | null;
  burnoutScore: number | null;
  sleepScore: number | null;
  selfEsteemScore: number | null;
}

type DomainKey = keyof Pick<
  AssessmentSnapshot,
  | "stressScore"
  | "anxietyScore"
  | "depressionScore"
  | "burnoutScore"
  | "sleepScore"
  | "selfEsteemScore"
>;

// Returns start of a day (00:00:00.000) for a given date
function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

// Returns end of a day (23:59:59.999) for a given date
function endOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

// Last day of a given month, at end of day
function endOfMonth(year: number, month: number): Date {
  // month is 0-indexed; month+1 day 0 = last day of month
  const lastDay = new Date(year, month + 1, 0);
  return endOfDay(lastDay);
}

// First day of a given month, at start of day
function startOfMonth(year: number, month: number): Date {
  return startOfDay(new Date(year, month, 1));
}

export async function GET(req: NextRequest) {
  try {
    const companyId = await getHRSession(req);
    if (!companyId) {
      return NextResponse.json(
        { error: "Please log in with your access code." },
        { status: 401 },
      );
    }

    const company = await db.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        name: true,
        plan: true,
        planSeats: true,
        sessionCap: true,
        planRenewAt: true,
        status: true,
        focusAreas: true,
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Company not found." },
        { status: 404 },
      );
    }

    // ── All active employees with their latest assessment ──────────────────────

    const employees: EmployeeWithLatest[] = await db.companyEmployee.findMany({
      where: { companyId, status: "active" },
      select: {
        department: true,
        riskBand: true,
        overallScore: true,
        improvementPct: true,
        sessionsUsed: true,
        assessments: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            totalScore: true,
            riskBand: true,
            stressScore: true,
            anxietyScore: true,
            depressionScore: true,
            burnoutScore: true,
            sleepScore: true,
            selfEsteemScore: true,
            relationshipScore: true,
            createdAt: true,
          },
        },
      },
    });

    const assessed = employees.filter((e) => e.assessments.length > 0);
    const totalEnrolled = employees.length;
    const assessedCount = assessed.length;

    // ── Risk band distribution ────────────────────────────────────────────────

    const bandCounts: Record<string, number> = {};
    assessed.forEach((e) => {
      const band = e.riskBand ?? "Unknown";
      bandCounts[band] = (bandCounts[band] ?? 0) + 1;
    });

    const bandOrder = ["Low", "Mild", "Moderate", "High", "Critical"];
    const riskDistribution = Object.entries(bandCounts)
      .map(([band, count]) => ({
        band,
        count,
        pct: assessedCount > 0 ? Math.round((count / assessedCount) * 100) : 0,
      }))
      .sort((a, b) => bandOrder.indexOf(a.band) - bandOrder.indexOf(b.band));

    // ── Domain averages + month-on-month trend ────────────────────────────────

    const domainKeys: { key: DomainKey; label: string }[] = [
      { key: "stressScore", label: "Stress" },
      { key: "anxietyScore", label: "Anxiety" },
      { key: "depressionScore", label: "Low Mood" },
      { key: "burnoutScore", label: "Burnout" },
      { key: "sleepScore", label: "Sleep" },
      { key: "selfEsteemScore", label: "Self-esteem" },
    ];

    // Previous month's latest assessment per employee (for trend delta)
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const prevAssessments: PrevAssessment[] = await db.eAPAssessment.findMany({
      where: {
        employee: { companyId },
        createdAt: { lte: oneMonthAgo },
      },
      orderBy: [{ employeeId: "asc" }, { createdAt: "desc" }],
      distinct: ["employeeId"],
      select: {
        employeeId: true,
        stressScore: true,
        anxietyScore: true,
        depressionScore: true,
        burnoutScore: true,
        sleepScore: true,
        selfEsteemScore: true,
      },
    });

    // Key by employeeId string for O(1) lookup
    const prevByEmployee: Record<string, PrevAssessment> = {};
    for (const a of prevAssessments) {
      prevByEmployee[a.employeeId] = a;
    }

    const domainAverages = domainKeys.map(({ key, label }) => {
      const vals = assessed
        .map((e) => e.assessments[0]?.[key] ?? null)
        .filter((v): v is number => v !== null);

      const avg =
        vals.length > 0
          ? Math.round(vals.reduce((s, v) => s + v, 0) / vals.length)
          : 0;

      const prevVals = Object.values(prevByEmployee)
        .map((a) => a[key] ?? null)
        .filter((v): v is number => v !== null);

      const prevAvg =
        prevVals.length > 0
          ? Math.round(prevVals.reduce((s, v) => s + v, 0) / prevVals.length)
          : avg; // No previous data → trend = 0

      return {
        domain: key.replace("Score", ""),
        label,
        score: avg,
        trend: avg - prevAvg, // negative = improving
      };
    });

    // ── 6-month trend (parallel queries — much faster) ────────────────────────

    const now = new Date();

    // Build month ranges for the last 6 months
    const monthRanges = Array.from({ length: 6 }, (_, idx) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
      return {
        label: d.toLocaleString("en", { month: "short" }),
        year: d.getFullYear(),
        month: d.getMonth(), // 0-indexed
        monthStart: startOfMonth(d.getFullYear(), d.getMonth()),
        monthEnd: endOfMonth(d.getFullYear(), d.getMonth()),
      };
    });

    // Run all 12 queries (assessments + enrolment count) in parallel
    const monthResults = await Promise.all(
      monthRanges.map(async (m) => {
        const [assessmentsInMonth, enrolledByMonth] = await Promise.all([
          db.eAPAssessment.findMany({
            where: {
              employee: { companyId },
              createdAt: { gte: m.monthStart, lte: m.monthEnd },
            },
            select: { totalScore: true },
          }),
          db.companyEmployee.count({
            where: {
              companyId,
              enrolledAt: { lte: m.monthEnd },
              status: "active",
            },
          }),
        ]);

        const avgScore =
          assessmentsInMonth.length > 0
            ? Math.round(
                assessmentsInMonth.reduce((s, a) => s + a.totalScore, 0) /
                  assessmentsInMonth.length,
              )
            : 0;

        return {
          month: m.label,
          avgScore,
          enrolled: enrolledByMonth,
          hasData: assessmentsInMonth.length > 0,
        };
      }),
    );

    // ── Department breakdown ───────────────────────────────────────────────────

    const deptGroups: Record<string, { scores: number[]; sessions: number }> =
      {};
    employees.forEach((e) => {
      const dept = e.department ?? "Other";
      if (!deptGroups[dept]) deptGroups[dept] = { scores: [], sessions: 0 };
      deptGroups[dept].sessions += e.sessionsUsed;
      const latest = e.assessments[0];
      if (latest) deptGroups[dept].scores.push(latest.totalScore);
    });

    const departmentData = Object.entries(deptGroups)
      .filter(([, d]) => d.scores.length >= MIN_COHORT)
      .map(([dept, d]) => ({
        department: dept,
        avgScore:
          d.scores.length > 0
            ? Math.round(d.scores.reduce((s, v) => s + v, 0) / d.scores.length)
            : 0,
        count: d.scores.length,
        sessionsUsed: d.sessions,
        sessionsAvailable: Math.max(
          0,
          d.scores.length * company.sessionCap - d.sessions,
        ),
      }));

    // ── Overview stats ────────────────────────────────────────────────────────

    const atRiskCount = assessed.filter(
      (e) => e.riskBand === "High" || e.riskBand === "Critical",
    ).length;

    const avgImprovement =
      assessed.length > 0
        ? Math.round(
            assessed.reduce((s, e) => s + (e.improvementPct ?? 0), 0) /
              assessed.length,
          )
        : 0;

    const sessionsUsedTotal = employees.reduce((s, e) => s + e.sessionsUsed, 0);
    const sessionsCapTotal = totalEnrolled * company.sessionCap;

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activeThisMonth = assessed.filter((e) => {
      const latest = e.assessments[0];
      return latest && new Date(latest.createdAt) >= thirtyDaysAgo;
    }).length;

    return NextResponse.json({
      success: true,
      company: {
        name: company.name,
        plan: company.plan,
        planSeats: company.planSeats,
        sessionCap: company.sessionCap,
        planRenewAt: company.planRenewAt,
        status: company.status,
      },
      overview: {
        totalEnrolled,
        assessedCount,
        assessmentRate:
          totalEnrolled > 0
            ? Math.round((assessedCount / totalEnrolled) * 100)
            : 0,
        activeThisMonth,
        sessionsUsedTotal,
        sessionsAvailable: Math.max(0, sessionsCapTotal - sessionsUsedTotal),
        avgImprovement,
        atRiskCount,
        atRiskPct:
          assessedCount > 0
            ? Math.round((atRiskCount / assessedCount) * 100)
            : 0,
      },
      riskDistribution,
      domainAverages,
      trend: monthResults, // includes hasData flag so UI can differentiate "no data" from score=0
      departmentData,
      privacyNote: `Data shown for cohorts of ${MIN_COHORT}+ employees only. Individual responses are never disclosed.`,
    });
  } catch (err) {
    console.error("[HR analytics]", err);
    return NextResponse.json(
      { error: "Failed to load analytics." },
      { status: 500 },
    );
  }
}

// // app/api/hr/analytics/route.ts
// // GET: Anonymised aggregate EAP data for the authenticated HR company.
// //
// // ROOT CAUSE FIXES for all the 0% / empty chart bugs:
// //
// // 1. domainAverages trend (0% vs last month):
// //    The previous code called db.eAPAssessment.findMany with
// //    `distinct: ["employeeId"]` — but Prisma only supports distinct on scalar
// //    fields, and employeeId IS a scalar, so that works. The REAL bug was that
// //    prevByEmployee was keyed by employeeId but the assessed[] array iterated
// //    e.assessments[0] without an employeeId field (because the include only
// //    fetched assessment fields, not the parent employee id). So the lookup
// //    always returned undefined → prevAvg = avg → trend = 0.
// //    FIX: fetch prevAssessments with employeeId, then build the lookup correctly,
// //    and look up by iterating assessed employees (which DO have their own id).
// //
// // 2. improvementPct always 0:
// //    The employee query used `include` which doesn't expose improvementPct from
// //    the employee record itself — only from nested assessments. Fixed by using
// //    `select` and explicitly listing the fields we need.
// //
// // 3. 6-month trend empty:
// //    The enrolledAt filter used `{ lte: monthEnd }` but active employees enrolled
// //    AFTER a month are excluded correctly. The real issue: months with 0
// //    assessments returned avgScore=0, and the front-end filtered them out with
// //    `filter(d => d.avgScore > 0)` before checking if there were >=2 points,
// //    causing "Collecting data…" to show even with data. Fixed by keeping all
// //    months in the trend array (the UI handles 0-score months as gaps).
// //
// // 4. Session utilisation 0:
// //    departmentData.sessionsAvailable was computed as
// //    `d.scores.length * company.sessionCap - d.sessions` — but d.scores only
// //    counts employees with assessments (assessed subset), not all enrolled.
// //    This gave wrong totals. Fixed by counting all employees per dept, not just
// //    assessed ones.

// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { getHRSession } from "@/lib/hr-auth";

// const MIN_COHORT = 5;

// interface AssessmentSnapshot {
//   totalScore: number;
//   riskBand: string;
//   stressScore: number | null;
//   anxietyScore: number | null;
//   depressionScore: number | null;
//   burnoutScore: number | null;
//   sleepScore: number | null;
//   selfEsteemScore: number | null;
//   relationshipScore: number | null;
//   createdAt: Date;
// }

// interface EmployeeWithLatest {
//   id: string; // ← CRITICAL: need the employee's own id for the prevByEmployee lookup
//   department: string | null;
//   riskBand: string | null;
//   overallScore: number | null;
//   improvementPct: number | null;
//   sessionsUsed: number;
//   assessments: AssessmentSnapshot[];
// }

// interface PrevAssessment {
//   employeeId: string;
//   stressScore: number | null;
//   anxietyScore: number | null;
//   depressionScore: number | null;
//   burnoutScore: number | null;
//   sleepScore: number | null;
//   selfEsteemScore: number | null;
// }

// type DomainKey = keyof Pick<
//   AssessmentSnapshot,
//   | "stressScore"
//   | "anxietyScore"
//   | "depressionScore"
//   | "burnoutScore"
//   | "sleepScore"
//   | "selfEsteemScore"
// >;

// function startOfDay(d: Date): Date {
//   return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
// }
// function endOfDay(d: Date): Date {
//   return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
// }
// function endOfMonth(year: number, month: number): Date {
//   return endOfDay(new Date(year, month + 1, 0));
// }
// function startOfMonth(year: number, month: number): Date {
//   return startOfDay(new Date(year, month, 1));
// }

// export async function GET(req: NextRequest) {
//   try {
//     const companyId = await getHRSession(req);
//     if (!companyId) {
//       return NextResponse.json(
//         { error: "Please log in with your access code." },
//         { status: 401 },
//       );
//     }

//     const company = await db.company.findUnique({
//       where: { id: companyId },
//       select: {
//         id: true,
//         name: true,
//         plan: true,
//         planSeats: true,
//         sessionCap: true,
//         planRenewAt: true,
//         status: true,
//         focusAreas: true,
//       },
//     });

//     if (!company) {
//       return NextResponse.json(
//         { error: "Company not found." },
//         { status: 404 },
//       );
//     }

//     // ── All active employees with their LATEST assessment ─────────────────────
//     // IMPORTANT: select `id` so we can look up prevByEmployee[employee.id]

//     const employees: EmployeeWithLatest[] = await db.companyEmployee.findMany({
//       where: { companyId, status: "active" },
//       select: {
//         id: true, // ← was missing — caused the 0% trend bug
//         department: true,
//         riskBand: true,
//         overallScore: true,
//         improvementPct: true, // ← was missing — caused avgImprovement = 0
//         sessionsUsed: true,
//         assessments: {
//           orderBy: { createdAt: "desc" },
//           take: 1,
//           select: {
//             totalScore: true,
//             riskBand: true,
//             stressScore: true,
//             anxietyScore: true,
//             depressionScore: true,
//             burnoutScore: true,
//             sleepScore: true,
//             selfEsteemScore: true,
//             relationshipScore: true,
//             createdAt: true,
//           },
//         },
//       },
//     });

//     const assessed = employees.filter((e) => e.assessments.length > 0);
//     const totalEnrolled = employees.length;
//     const assessedCount = assessed.length;

//     // ── Risk band distribution ────────────────────────────────────────────────

//     const bandCounts: Record<string, number> = {};
//     assessed.forEach((e) => {
//       const band = e.riskBand ?? "Unknown";
//       bandCounts[band] = (bandCounts[band] ?? 0) + 1;
//     });

//     const bandOrder = ["Low", "Mild", "Moderate", "High", "Critical"];
//     const riskDistribution = Object.entries(bandCounts)
//       .map(([band, count]) => ({
//         band,
//         count,
//         pct: assessedCount > 0 ? Math.round((count / assessedCount) * 100) : 0,
//       }))
//       .sort((a, b) => bandOrder.indexOf(a.band) - bandOrder.indexOf(b.band));

//     // ── Domain averages + month-on-month trend ────────────────────────────────

//     const domainKeys: { key: DomainKey; label: string }[] = [
//       { key: "stressScore", label: "Stress" },
//       { key: "anxietyScore", label: "Anxiety" },
//       { key: "depressionScore", label: "Low Mood" },
//       { key: "burnoutScore", label: "Burnout" },
//       { key: "sleepScore", label: "Sleep" },
//       { key: "selfEsteemScore", label: "Self-esteem" },
//     ];

//     // Previous month's latest assessment per employee (for trend delta)
//     const oneMonthAgo = new Date();
//     oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

//     const prevAssessments: PrevAssessment[] = await db.eAPAssessment.findMany({
//       where: {
//         employee: { companyId },
//         createdAt: { lte: oneMonthAgo },
//       },
//       orderBy: [{ employeeId: "asc" }, { createdAt: "desc" }],
//       distinct: ["employeeId"],
//       select: {
//         employeeId: true, // ← key field for lookup
//         stressScore: true,
//         anxietyScore: true,
//         depressionScore: true,
//         burnoutScore: true,
//         sleepScore: true,
//         selfEsteemScore: true,
//       },
//     });

//     // Build O(1) lookup by employeeId (string key)
//     const prevByEmployee: Record<string, PrevAssessment> = {};
//     for (const a of prevAssessments) {
//       prevByEmployee[a.employeeId] = a;
//     }

//     const domainAverages = domainKeys.map(({ key, label }) => {
//       // Current month averages (from latest assessment per employee)
//       const vals = assessed
//         .map((e) => e.assessments[0]?.[key] ?? null)
//         .filter((v): v is number => v !== null);

//       const avg =
//         vals.length > 0
//           ? Math.round(vals.reduce((s, v) => s + v, 0) / vals.length)
//           : 0;

//       // Previous month averages
//       // FIX: iterate `assessed` employees (which have .id) and look up their
//       // previous assessment via prevByEmployee[e.id]. The old code iterated
//       // Object.values(prevByEmployee) which gives PrevAssessment objects not
//       // keyed to any particular employee in `assessed`, but more importantly
//       // the old `assessed` array didn't have employee `id` at all.
//       const prevVals = assessed
//         .map((e) => prevByEmployee[e.id]?.[key] ?? null)
//         .filter((v): v is number => v !== null);

//       const prevAvg =
//         prevVals.length > 0
//           ? Math.round(prevVals.reduce((s, v) => s + v, 0) / prevVals.length)
//           : avg; // No previous data → trend = 0

//       return {
//         domain: key.replace("Score", ""),
//         label,
//         score: avg,
//         trend: avg - prevAvg, // negative = improving (lower distress)
//       };
//     });

//     // ── 6-month trend (parallel queries) ──────────────────────────────────────

//     const now = new Date();
//     const monthRanges = Array.from({ length: 6 }, (_, idx) => {
//       const d = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
//       return {
//         label: d.toLocaleString("en", { month: "short" }),
//         year: d.getFullYear(),
//         month: d.getMonth(),
//         monthStart: startOfMonth(d.getFullYear(), d.getMonth()),
//         monthEnd: endOfMonth(d.getFullYear(), d.getMonth()),
//       };
//     });

//     const monthResults = await Promise.all(
//       monthRanges.map(async (m) => {
//         const [assessmentsInMonth, enrolledByMonth] = await Promise.all([
//           db.eAPAssessment.findMany({
//             where: {
//               employee: { companyId },
//               createdAt: { gte: m.monthStart, lte: m.monthEnd },
//             },
//             select: { totalScore: true },
//           }),
//           db.companyEmployee.count({
//             where: {
//               companyId,
//               enrolledAt: { lte: m.monthEnd },
//               status: "active",
//             },
//           }),
//         ]);

//         const avgScore =
//           assessmentsInMonth.length > 0
//             ? Math.round(
//                 assessmentsInMonth.reduce((s, a) => s + a.totalScore, 0) /
//                   assessmentsInMonth.length,
//               )
//             : 0;

//         return {
//           month: m.label,
//           avgScore,
//           enrolled: enrolledByMonth,
//           hasData: assessmentsInMonth.length > 0,
//           assessmentCount: assessmentsInMonth.length,
//         };
//       }),
//     );

//     // ── Department breakdown ──────────────────────────────────────────────────
//     // FIX: count ALL employees per dept (not just assessed) for correct session cap

//     const deptGroups: Record<
//       string,
//       { scores: number[]; sessions: number; totalEmployees: number }
//     > = {};

//     employees.forEach((e) => {
//       const dept = e.department ?? "Other";
//       if (!deptGroups[dept])
//         deptGroups[dept] = { scores: [], sessions: 0, totalEmployees: 0 };
//       deptGroups[dept].totalEmployees += 1;
//       deptGroups[dept].sessions += e.sessionsUsed;
//       const latest = e.assessments[0];
//       if (latest) deptGroups[dept].scores.push(latest.totalScore);
//     });

//     const departmentData = Object.entries(deptGroups)
//       .filter(([, d]) => d.scores.length >= MIN_COHORT)
//       .map(([dept, d]) => ({
//         department: dept,
//         avgScore:
//           d.scores.length > 0
//             ? Math.round(d.scores.reduce((s, v) => s + v, 0) / d.scores.length)
//             : 0,
//         count: d.scores.length,
//         totalEmployees: d.totalEmployees,
//         sessionsUsed: d.sessions,
//         // Use totalEmployees × sessionCap for correct available sessions
//         sessionsAvailable: Math.max(
//           0,
//           d.totalEmployees * company.sessionCap - d.sessions,
//         ),
//       }));

//     // ── Overview stats ────────────────────────────────────────────────────────

//     const atRiskCount = assessed.filter(
//       (e) => e.riskBand === "High" || e.riskBand === "Critical",
//     ).length;

//     // avgImprovement: average of improvementPct stored on employee records
//     // (set when assessment is submitted or admin edits scores)
//     const improvingEmployees = assessed.filter(
//       (e) => e.improvementPct !== null && e.improvementPct !== 0,
//     );
//     const avgImprovement =
//       improvingEmployees.length > 0
//         ? Math.round(
//             improvingEmployees.reduce(
//               (s, e) => s + (e.improvementPct ?? 0),
//               0,
//             ) / improvingEmployees.length,
//           )
//         : 0;

//     const sessionsUsedTotal = employees.reduce((s, e) => s + e.sessionsUsed, 0);
//     const sessionsCapTotal = totalEnrolled * company.sessionCap;

//     const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
//     const activeThisMonth = assessed.filter((e) => {
//       const latest = e.assessments[0];
//       return latest && new Date(latest.createdAt) >= thirtyDaysAgo;
//     }).length;

//     return NextResponse.json({
//       success: true,
//       company: {
//         name: company.name,
//         plan: company.plan,
//         planSeats: company.planSeats,
//         sessionCap: company.sessionCap,
//         planRenewAt: company.planRenewAt,
//         status: company.status,
//       },
//       overview: {
//         totalEnrolled,
//         assessedCount,
//         assessmentRate:
//           totalEnrolled > 0
//             ? Math.round((assessedCount / totalEnrolled) * 100)
//             : 0,
//         activeThisMonth,
//         sessionsUsedTotal,
//         sessionsAvailable: Math.max(0, sessionsCapTotal - sessionsUsedTotal),
//         avgImprovement,
//         atRiskCount,
//         atRiskPct:
//           assessedCount > 0
//             ? Math.round((atRiskCount / assessedCount) * 100)
//             : 0,
//       },
//       riskDistribution,
//       domainAverages,
//       trend: monthResults,
//       departmentData,
//       privacyNote: `Data shown for cohorts of ${MIN_COHORT}+ employees only. Individual responses are never disclosed.`,
//     });
//   } catch (err) {
//     console.error("[HR analytics]", err);
//     return NextResponse.json(
//       { error: "Failed to load analytics." },
//       { status: 500 },
//     );
//   }
// }
