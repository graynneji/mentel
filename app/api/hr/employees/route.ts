// app/api/hr/employees/route.ts
// GET: Returns anonymised employee list for the authenticated company's HR portal.
// Never returns names, emails, or individual assessment answers.
// Returns: department, risk band, sessions used, enrolment date, improvement %.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getHRSession } from "@/lib/hr-auth";

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
        name: true,
        accessCode: true,
        planSeats: true,
        sessionCap: true,
        status: true,
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Company not found." },
        { status: 404 },
      );
    }

    // Fetch employees — deliberately exclude name, email, emailHash, answers
    const employees = await db.companyEmployee.findMany({
      where: { companyId, status: "active" },
      select: {
        id: true,
        department: true, // included — used for dept-level aggregation in HR view
        anonymous: true,
        enrolledAt: true,
        riskBand: true,
        overallScore: true,
        improvementPct: true,
        sessionsUsed: true,
        sessionsRemaining: true,
        lastAssessmentAt: true,
        // Only check if assessment exists — never return answers
        assessments: {
          take: 1,
          select: { id: true },
        },
      },
      orderBy: { enrolledAt: "desc" },
    });

    const formatted = employees.map((e) => ({
      id: e.id,
      department: e.department,
      anonymous: e.anonymous,
      enrolledAt: e.enrolledAt,
      riskBand: e.riskBand,
      overallScore: e.overallScore,
      improvementPct: e.improvementPct,
      sessionsUsed: e.sessionsUsed,
      sessionsRemaining: e.sessionsRemaining,
      lastAssessmentAt: e.lastAssessmentAt,
      hasAssessment: e.assessments.length > 0,
      // Deliberately NOT included: name, email, emailHash, answers, therapistNotes
    }));

    return NextResponse.json({
      success: true,
      company: {
        name: company.name,
        accessCode: company.accessCode,
        planSeats: company.planSeats,
        sessionCap: company.sessionCap,
      },
      employees: formatted,
    });
  } catch (err) {
    console.error("[HR employees]", err);
    return NextResponse.json(
      { error: "Failed to load employees." },
      { status: 500 },
    );
  }
}
