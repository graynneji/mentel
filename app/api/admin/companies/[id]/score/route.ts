// // app/api/admin/companies/[id]/score/route.ts
// // PATCH: Admin/therapist updates an employee's domain scores after therapy sessions.
// // This is the KEY endpoint that drives the HR company chart improvements.
// // When admin reduces anxiety/depression scores → employee.overallScore updates →
// // company aggregate recomputes → HR dashboard shows improvement trend.

// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { scoreToBand } from "@/lib/eap-scoring";

// function requireAdmin(req: NextRequest): boolean {
//   const session = req.cookies.get("mentel_admin_session")?.value;
//   return session === process.env.ADMIN_SESSION_SECRET;
// }

// interface ScoreUpdateBody {
//   employeeId: string;
//   assessmentId?: string; // If provided, update that assessment; else create a new progress entry
//   // Domain scores — all optional, only pass what changed
//   stressScore?: number;
//   anxietyScore?: number;
//   depressionScore?: number;
//   burnoutScore?: number;
//   sleepScore?: number;
//   relationshipScore?: number;
//   selfEsteemScore?: number;
//   // Admin notes
//   therapistNotes?: string;
//   reviewedBy?: string;
//   // Optional: domains addressed in this update (for logging)
//   domainsAddressed?: string[];
//   sessionNotes?: string;
// }

// // Weighted composite recomputation (must mirror lib/eap-scoring.ts weights)
// const WEIGHTS: Record<string, number> = {
//   stress: 1.1,
//   anxiety: 1.2,
//   depression: 1.5,
//   burnout: 1.0,
//   sleep: 0.8,
//   relationships: 0.8,
//   selfesteem: 0.9,
// };

// type RouteContext = {
//   params: Promise<{ id: string }>;
// };

// function recomputeComposite(scores: {
//   stressScore: number;
//   anxietyScore: number;
//   depressionScore: number;
//   burnoutScore: number;
//   sleepScore: number;
//   relationshipScore: number | null;
//   selfEsteemScore: number;
// }): number {
//   const map: [string, number | null][] = [
//     ["stress", scores.stressScore],
//     ["anxiety", scores.anxietyScore],
//     ["depression", scores.depressionScore],
//     ["burnout", scores.burnoutScore],
//     ["sleep", scores.sleepScore],
//     ["relationships", scores.relationshipScore],
//     ["selfesteem", scores.selfEsteemScore],
//   ];
//   let totalW = 0,
//     totalS = 0;
//   for (const [key, score] of map) {
//     if (score !== null && score !== undefined) {
//       const w = WEIGHTS[key] ?? 1;
//       totalS += score * w;
//       totalW += w;
//     }
//   }
//   return totalW > 0 ? Math.round(totalS / totalW) : 0;
// }

// export async function PATCH(req: NextRequest, { params }: RouteContext) {
//   if (!requireAdmin(req))
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   const { id } = await params;
//   try {
//     const body: ScoreUpdateBody = await req.json();
//     const {
//       employeeId,
//       assessmentId,
//       therapistNotes,
//       reviewedBy,
//       domainsAddressed,
//       sessionNotes,
//     } = body;

//     if (!employeeId) {
//       return NextResponse.json(
//         { error: "employeeId is required." },
//         { status: 400 },
//       );
//     }

//     // Validate employee belongs to this company
//     const employee = await db.companyEmployee.findFirst({
//       where: { id: employeeId, companyId: id },
//       include: {
//         assessments: { orderBy: { createdAt: "desc" }, take: 1 },
//       },
//     });

//     if (!employee) {
//       return NextResponse.json(
//         { error: "Employee not found in this company." },
//         { status: 404 },
//       );
//     }

//     // Get the assessment to update (latest if not specified)
//     const latestAssessment = assessmentId
//       ? await db.eAPAssessment.findUnique({ where: { id: assessmentId } })
//       : employee.assessments[0];

//     if (!latestAssessment) {
//       return NextResponse.json(
//         { error: "No assessment found for this employee." },
//         { status: 404 },
//       );
//     }

//     // Build updated domain scores — only update fields that were explicitly passed
//     const updatedScores = {
//       stressScore:
//         body.stressScore !== undefined
//           ? clamp(body.stressScore)
//           : (latestAssessment.stressScore ?? 0),
//       anxietyScore:
//         body.anxietyScore !== undefined
//           ? clamp(body.anxietyScore)
//           : (latestAssessment.anxietyScore ?? 0),
//       depressionScore:
//         body.depressionScore !== undefined
//           ? clamp(body.depressionScore)
//           : (latestAssessment.depressionScore ?? 0),
//       burnoutScore:
//         body.burnoutScore !== undefined
//           ? clamp(body.burnoutScore)
//           : (latestAssessment.burnoutScore ?? 0),
//       sleepScore:
//         body.sleepScore !== undefined
//           ? clamp(body.sleepScore)
//           : (latestAssessment.sleepScore ?? 0),
//       relationshipScore:
//         body.relationshipScore !== undefined
//           ? clamp(body.relationshipScore)
//           : latestAssessment.relationshipScore,
//       selfEsteemScore:
//         body.selfEsteemScore !== undefined
//           ? clamp(body.selfEsteemScore)
//           : (latestAssessment.selfEsteemScore ?? 0),
//     };

//     // Recompute composite
//     const newTotalScore = recomputeComposite(updatedScores);
//     const newRiskBand = scoreToBand(newTotalScore);

//     // Update the assessment record
//     await db.eAPAssessment.update({
//       where: { id: latestAssessment.id },
//       data: {
//         ...updatedScores,
//         totalScore: newTotalScore,
//         riskBand: newRiskBand,
//         therapistNotes:
//           therapistNotes !== undefined
//             ? therapistNotes
//             : latestAssessment.therapistNotes,
//         reviewedBy: reviewedBy ?? latestAssessment.reviewedBy,
//         reviewedAt: new Date(),
//       },
//     });

//     // Recompute employee-level improvement %
//     const allAssessments = await db.eAPAssessment.findMany({
//       where: { employeeId },
//       orderBy: { createdAt: "asc" },
//       select: { totalScore: true },
//     });

//     const firstScore = allAssessments[0]?.totalScore ?? newTotalScore;
//     const improvementPct =
//       firstScore > 0
//         ? Math.round(((firstScore - newTotalScore) / firstScore) * 100)
//         : 0;

//     // Update employee summary
//     await db.companyEmployee.update({
//       where: { id: employeeId },
//       data: {
//         riskBand: newRiskBand,
//         overallScore: newTotalScore,
//         improvementPct,
//       },
//     });

//     // Return updated data for optimistic UI update
//     return NextResponse.json({
//       success: true,
//       updated: {
//         assessmentId: latestAssessment.id,
//         employeeId,
//         ...updatedScores,
//         totalScore: newTotalScore,
//         riskBand: newRiskBand,
//         improvementPct,
//         reviewedAt: new Date().toISOString(),
//       },
//     });
//   } catch (err) {
//     console.error("[Admin score PATCH]", err);
//     return NextResponse.json(
//       { error: "Failed to update scores." },
//       { status: 500 },
//     );
//   }
// }

// function clamp(v: number): number {
//   return Math.max(0, Math.min(100, Math.round(v)));
// }

// app/api/admin/companies/[id]/score/route.ts
///////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { scoreToBand } from "@/lib/eap-scoring";

// function requireAdmin(req: NextRequest): boolean {
//   const session = req.cookies.get("mentel_admin_session")?.value;
//   return session === process.env.ADMIN_SESSION_SECRET;
// }

// interface ScoreUpdateBody {
//   employeeId: string;
//   assessmentId?: string;
//   stressScore?: number;
//   anxietyScore?: number;
//   depressionScore?: number;
//   burnoutScore?: number;
//   sleepScore?: number;
//   relationshipScore?: number;
//   selfEsteemScore?: number;
//   therapistNotes?: string;
//   reviewedBy?: string;
//   domainsAddressed?: string[];
//   sessionNotes?: string;
// }

// const WEIGHTS: Record<string, number> = {
//   stress: 1.1,
//   anxiety: 1.2,
//   depression: 1.5,
//   burnout: 1.0,
//   sleep: 0.8,
//   relationships: 0.8,
//   selfesteem: 0.9,
// };

// type RouteContext = {
//   params: Promise<{ id: string }>;
// };

// function recomputeComposite(scores: {
//   stressScore: number;
//   anxietyScore: number;
//   depressionScore: number;
//   burnoutScore: number;
//   sleepScore: number;
//   relationshipScore: number | null;
//   selfEsteemScore: number;
// }): number {
//   const map: [string, number | null][] = [
//     ["stress", scores.stressScore],
//     ["anxiety", scores.anxietyScore],
//     ["depression", scores.depressionScore],
//     ["burnout", scores.burnoutScore],
//     ["sleep", scores.sleepScore],
//     ["relationships", scores.relationshipScore],
//     ["selfesteem", scores.selfEsteemScore],
//   ];

//   let totalW = 0,
//     totalS = 0;

//   for (const [key, score] of map) {
//     if (score !== null && score !== undefined) {
//       const w = WEIGHTS[key] ?? 1;
//       totalS += score * w;
//       totalW += w;
//     }
//   }

//   return totalW > 0 ? Math.round(totalS / totalW) : 0;
// }

// export async function PATCH(req: NextRequest, { params }: RouteContext) {
//   if (!requireAdmin(req)) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const { id } = await params;

//   try {
//     const body: ScoreUpdateBody = await req.json();
//     const { employeeId, assessmentId, therapistNotes, reviewedBy } = body;

//     if (!employeeId) {
//       return NextResponse.json(
//         { error: "employeeId is required." },
//         { status: 400 },
//       );
//     }

//     // ✅ Ensure employee belongs to company
//     const employee = await db.companyEmployee.findFirst({
//       where: { id: employeeId, companyId: id },
//       include: {
//         assessments: { orderBy: { createdAt: "desc" }, take: 1 },
//       },
//     });

//     if (!employee) {
//       return NextResponse.json(
//         { error: "Employee not found in this company." },
//         { status: 404 },
//       );
//     }

//     // ✅ Get assessment safely
//     const latestAssessment = assessmentId
//       ? await db.eAPAssessment.findFirst({
//           where: { id: assessmentId, employeeId },
//         })
//       : employee.assessments[0];

//     if (!latestAssessment) {
//       return NextResponse.json(
//         { error: "No assessment found for this employee." },
//         { status: 404 },
//       );
//     }

//     // ✅ CAPTURE OLD SCORE BEFORE UPDATE
//     const previousScore = latestAssessment.totalScore ?? 0;

//     // ✅ Build updated scores
//     const updatedScores = {
//       stressScore:
//         body.stressScore !== undefined
//           ? clamp(body.stressScore)
//           : (latestAssessment.stressScore ?? 0),

//       anxietyScore:
//         body.anxietyScore !== undefined
//           ? clamp(body.anxietyScore)
//           : (latestAssessment.anxietyScore ?? 0),

//       depressionScore:
//         body.depressionScore !== undefined
//           ? clamp(body.depressionScore)
//           : (latestAssessment.depressionScore ?? 0),

//       burnoutScore:
//         body.burnoutScore !== undefined
//           ? clamp(body.burnoutScore)
//           : (latestAssessment.burnoutScore ?? 0),

//       sleepScore:
//         body.sleepScore !== undefined
//           ? clamp(body.sleepScore)
//           : (latestAssessment.sleepScore ?? 0),

//       relationshipScore:
//         body.relationshipScore !== undefined
//           ? clamp(body.relationshipScore)
//           : latestAssessment.relationshipScore,

//       selfEsteemScore:
//         body.selfEsteemScore !== undefined
//           ? clamp(body.selfEsteemScore)
//           : (latestAssessment.selfEsteemScore ?? 0),
//     };

//     // ✅ Compute new score
//     const newTotalScore = recomputeComposite(updatedScores);
//     const newRiskBand = scoreToBand(newTotalScore);

//     // ✅ IMPROVEMENT CALCULATION
//     const improvementPct =
//       previousScore > 0
//         ? Math.round(((previousScore - newTotalScore) / previousScore) * 100)
//         : 0;

//     // ✅ UPDATE ASSESSMENT
//     await db.eAPAssessment.update({
//       where: { id: latestAssessment.id },
//       data: {
//         ...updatedScores,
//         totalScore: newTotalScore,
//         riskBand: newRiskBand,
//         therapistNotes:
//           therapistNotes !== undefined
//             ? therapistNotes
//             : latestAssessment.therapistNotes,
//         reviewedBy: reviewedBy ?? latestAssessment.reviewedBy,
//         reviewedAt: new Date(),
//       },
//     });

//     // ✅ UPDATE EMPLOYEE SUMMARY
//     await db.companyEmployee.update({
//       where: { id: employeeId },
//       data: {
//         riskBand: newRiskBand,
//         overallScore: newTotalScore,
//         improvementPct,
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       updated: {
//         assessmentId: latestAssessment.id,
//         employeeId,
//         ...updatedScores,
//         totalScore: newTotalScore,
//         riskBand: newRiskBand,
//         improvementPct,
//         reviewedAt: new Date().toISOString(),
//       },
//     });
//   } catch (err) {
//     console.error("[Admin score PATCH]", err);

//     return NextResponse.json(
//       { error: "Failed to update scores." },
//       { status: 500 },
//     );
//   }
// }

// function clamp(v: number): number {
//   return Math.max(0, Math.min(100, Math.round(v)));
// }

// app/api/admin/companies/[id]/score/route.ts
// PATCH: Admin updates domain scores after therapy.
//
// KEY FIX: improvementPct now uses employee.baselineScore (set once on first
// assessment, stored on the employee record, never changed) instead of
// fetching allAssessments[0].totalScore — which breaks when the admin edits
// the first assessment's scores.
//
// reviewed_at is set by this route on every save — it's a timestamp of when
// the admin last reviewed/edited this assessment, not a calculation input.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { scoreToBand } from "@/lib/eap-scoring";

function requireAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("mentel_admin_session")?.value;
  return session === process.env.ADMIN_SESSION_SECRET;
}

interface ScoreUpdateBody {
  employeeId: string;
  assessmentId?: string;
  stressScore?: number;
  anxietyScore?: number;
  depressionScore?: number;
  burnoutScore?: number;
  sleepScore?: number;
  relationshipScore?: number;
  selfEsteemScore?: number;
  therapistNotes?: string;
  reviewedBy?: string;
}

const WEIGHTS: Record<string, number> = {
  stress: 1.1,
  anxiety: 1.2,
  depression: 1.5,
  burnout: 1.0,
  sleep: 0.8,
  relationships: 0.8,
  selfesteem: 0.9,
};

function recomputeComposite(scores: {
  stressScore: number;
  anxietyScore: number;
  depressionScore: number;
  burnoutScore: number;
  sleepScore: number;
  relationshipScore: number | null;
  selfEsteemScore: number;
}): number {
  const map: [string, number | null][] = [
    ["stress", scores.stressScore],
    ["anxiety", scores.anxietyScore],
    ["depression", scores.depressionScore],
    ["burnout", scores.burnoutScore],
    ["sleep", scores.sleepScore],
    ["relationships", scores.relationshipScore],
    ["selfesteem", scores.selfEsteemScore],
  ];
  let totalW = 0,
    totalS = 0;
  for (const [key, score] of map) {
    if (score !== null && score !== undefined) {
      const w = WEIGHTS[key] ?? 1;
      totalS += score * w;
      totalW += w;
    }
  }
  return totalW > 0 ? Math.round(totalS / totalW) : 0;
}

function clamp(v: number): number {
  return Math.max(0, Math.min(100, Math.round(v)));
}

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: companyId } = await params;

  try {
    const body: ScoreUpdateBody = await req.json();
    const { employeeId, assessmentId, therapistNotes, reviewedBy } = body;

    if (!employeeId) {
      return NextResponse.json(
        { error: "employeeId is required." },
        { status: 400 },
      );
    }

    // Verify employee belongs to this company and fetch baseline
    const employee = await db.companyEmployee.findFirst({
      where: { id: employeeId, companyId },
      select: {
        id: true,
        baselineScore: true, // ← the immutable first-assessment score
        baselineAssessmentId: true,
        assessments: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { id: true, totalScore: true },
        },
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found in this company." },
        { status: 404 },
      );
    }

    // Get the assessment to update
    const targetAssessmentId = assessmentId ?? employee.assessments[0]?.id;
    if (!targetAssessmentId) {
      return NextResponse.json(
        { error: "No assessment found for this employee." },
        { status: 404 },
      );
    }

    const latestAssessment = await db.eAPAssessment.findUnique({
      where: { id: targetAssessmentId },
    });

    if (!latestAssessment) {
      return NextResponse.json(
        { error: "Assessment not found." },
        { status: 404 },
      );
    }

    // Build updated scores — only apply fields explicitly passed
    const updatedScores = {
      stressScore:
        body.stressScore !== undefined
          ? clamp(body.stressScore)
          : (latestAssessment.stressScore ?? 0),
      anxietyScore:
        body.anxietyScore !== undefined
          ? clamp(body.anxietyScore)
          : (latestAssessment.anxietyScore ?? 0),
      depressionScore:
        body.depressionScore !== undefined
          ? clamp(body.depressionScore)
          : (latestAssessment.depressionScore ?? 0),
      burnoutScore:
        body.burnoutScore !== undefined
          ? clamp(body.burnoutScore)
          : (latestAssessment.burnoutScore ?? 0),
      sleepScore:
        body.sleepScore !== undefined
          ? clamp(body.sleepScore)
          : (latestAssessment.sleepScore ?? 0),
      relationshipScore:
        body.relationshipScore !== undefined
          ? clamp(body.relationshipScore)
          : latestAssessment.relationshipScore,
      selfEsteemScore:
        body.selfEsteemScore !== undefined
          ? clamp(body.selfEsteemScore)
          : (latestAssessment.selfEsteemScore ?? 0),
    };

    // Recompute composite from the new domain scores
    const newTotalScore = recomputeComposite(updatedScores);
    const newRiskBand = scoreToBand(newTotalScore);

    // Save the updated assessment
    // reviewed_at is simply "when admin last touched this" — a timestamp, not a calculation input
    await db.eAPAssessment.update({
      where: { id: targetAssessmentId },
      data: {
        ...updatedScores,
        totalScore: newTotalScore,
        riskBand: newRiskBand,
        therapistNotes:
          therapistNotes !== undefined
            ? therapistNotes
            : latestAssessment.therapistNotes,
        reviewedBy: reviewedBy ?? latestAssessment.reviewedBy,
        reviewedAt: new Date(), // just a timestamp — admin last reviewed this assessment
      },
    });

    // ── Compute improvementPct using baselineScore ─────────────────────────────
    // baselineScore is the totalScore from the employee's FIRST assessment,
    // stored on the employee record when they first submitted, never overwritten.
    //
    // Why not use allAssessments[0].totalScore?
    // Because if the admin edits the first assessment's domain scores (which updates
    // its totalScore), then allAssessments[0].totalScore changes — and the baseline
    // comparison collapses to 0% improvement forever.
    //
    // baselineScore is immune to admin edits because we never update it.
    const baselineScore = employee.baselineScore;

    const improvementPct =
      baselineScore !== null &&
      baselineScore > 0 &&
      newTotalScore !== baselineScore
        ? Math.round(((baselineScore - newTotalScore) / baselineScore) * 100)
        : 0;

    // Update the employee's aggregate — but NEVER touch baselineScore here
    await db.companyEmployee.update({
      where: { id: employeeId },
      data: {
        riskBand: newRiskBand,
        overallScore: newTotalScore,
        improvementPct,
        // baselineScore and baselineAssessmentId are intentionally NOT updated here
      },
    });

    return NextResponse.json({
      success: true,
      updated: {
        assessmentId: targetAssessmentId,
        employeeId,
        ...updatedScores,
        totalScore: newTotalScore,
        riskBand: newRiskBand,
        improvementPct,
        baselineScore, // return so UI can display it
        reviewedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("[Admin score PATCH]", err);
    return NextResponse.json(
      { error: "Failed to update scores." },
      { status: 500 },
    );
  }
}
