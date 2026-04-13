// // app/api/admin/companies/[id]/route.ts
// // GET:    Full company detail with all employee data (admin only)
// // PATCH:  Update company plan, status, billing, contact details
// // DELETE: Soft-delete — sets status + billingStatus to "cancelled"

// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db";

// function requireAdmin(req: NextRequest): boolean {
//   const session = req.cookies.get("mentel_admin_session")?.value;
//   return session === process.env.ADMIN_SESSION_SECRET;
// }

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { id: string } },
// ) {
//   if (!requireAdmin(req)) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const company = await db.company.findUnique({
//       where: { id: params.id },
//       include: {
//         employees: {
//           where: { status: "active" },
//           include: {
//             assessments: {
//               orderBy: { createdAt: "asc" },
//               select: {
//                 id: true,
//                 createdAt: true,
//                 totalScore: true,
//                 riskBand: true,
//                 stressScore: true,
//                 anxietyScore: true,
//                 depressionScore: true,
//                 burnoutScore: true,
//                 sleepScore: true,
//                 relationshipScore: true,
//                 selfEsteemScore: true,
//                 flags: true,
//                 therapistNotes: true,
//               },
//             },
//             eapSessions: {
//               orderBy: { scheduledAt: "desc" },
//               select: {
//                 id: true,
//                 scheduledAt: true,
//                 status: true,
//                 therapist: true,
//                 type: true,
//                 domains: true,
//               },
//             },
//           },
//           orderBy: { overallScore: "desc" },
//         },
//         eapSessions: {
//           where: { status: "completed" },
//           select: { id: true, conductedAt: true, employeeId: true },
//         },
//       },
//     });

//     if (!company) {
//       return NextResponse.json(
//         { error: "Company not found." },
//         { status: 404 },
//       );
//     }

//     return NextResponse.json({ success: true, company });
//   } catch (err) {
//     console.error("[Admin company GET]", err);
//     return NextResponse.json(
//       { error: "Failed to fetch company." },
//       { status: 500 },
//     );
//   }
// }

// export async function PATCH(
//   req: NextRequest,
//   { params }: { params: { id: string } },
// ) {
//   if (!requireAdmin(req)) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const body = await req.json();

//     // Whitelist updatable fields — never allow hrPasswordHash or accessCode via this route
//     const allowed = [
//       "plan",
//       "planSeats",
//       "sessionCap",
//       "status",
//       "billingStatus",
//       "focusAreas",
//       "contactName",
//       "contactEmail",
//       "contactPhone",
//       "allowAnonymous",
//       "planRenewAt",
//     ] as const;

//     const updates: Partial<Record<(typeof allowed)[number], unknown>> = {};
//     for (const key of allowed) {
//       if (body[key] !== undefined) updates[key] = body[key];
//     }

//     if (Object.keys(updates).length === 0) {
//       return NextResponse.json(
//         { error: "No valid fields to update." },
//         { status: 400 },
//       );
//     }

//     const company = await db.company.update({
//       where: { id: params.id },
//       data: updates as Record<string, unknown>,
//       select: {
//         id: true,
//         name: true,
//         plan: true,
//         planSeats: true,
//         sessionCap: true,
//         status: true,
//         billingStatus: true,
//         contactName: true,
//         contactEmail: true,
//         focusAreas: true,
//         planRenewAt: true,
//       },
//     });

//     return NextResponse.json({ success: true, company });
//   } catch (err) {
//     console.error("[Admin company PATCH]", err);
//     return NextResponse.json(
//       { error: "Failed to update company." },
//       { status: 500 },
//     );
//   }
// }

// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { id: string } },
// ) {
//   if (!requireAdmin(req)) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     await db.company.update({
//       where: { id: params.id },
//       data: { status: "cancelled", billingStatus: "cancelled" },
//     });
//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error("[Admin company DELETE]", err);
//     return NextResponse.json(
//       { error: "Failed to cancel company." },
//       { status: 500 },
//     );
//   }
// }
/////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db";

// function requireAdmin(req: NextRequest): boolean {
//   const session = req.cookies.get("mentel_admin_session")?.value;
//   return session === process.env.ADMIN_SESSION_SECRET;
// }

// // Update the type to reflect that params is now a Promise
// type RouteContext = {
//   params: Promise<{ id: string }>;
// };

// export async function GET(req: NextRequest, { params }: RouteContext) {
//   if (!requireAdmin(req)) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     // Await the params object
//     const { id } = await params;

//     const company = await db.company.findUnique({
//       where: { id },
//       include: {
//         employees: {
//           where: { status: "active" },
//           include: {
//             assessments: {
//               orderBy: { createdAt: "asc" },
//               select: {
//                 id: true,
//                 createdAt: true,
//                 totalScore: true,
//                 riskBand: true,
//                 stressScore: true,
//                 anxietyScore: true,
//                 depressionScore: true,
//                 burnoutScore: true,
//                 sleepScore: true,
//                 relationshipScore: true,
//                 selfEsteemScore: true,
//                 flags: true,
//                 therapistNotes: true,
//               },
//             },
//             eapSessions: {
//               orderBy: { scheduledAt: "desc" },
//               select: {
//                 id: true,
//                 scheduledAt: true,
//                 status: true,
//                 therapist: true,
//                 type: true,
//                 domains: true,
//               },
//             },
//           },
//           orderBy: { overallScore: "desc" },
//         },
//         eapSessions: {
//           where: { status: "completed" },
//           select: { id: true, conductedAt: true, employeeId: true },
//         },
//       },
//     });

//     if (!company) {
//       return NextResponse.json(
//         { error: "Company not found." },
//         { status: 404 },
//       );
//     }

//     return NextResponse.json({ success: true, company });
//   } catch (err) {
//     console.error("[Admin company GET]", err);
//     return NextResponse.json(
//       { error: "Failed to fetch company." },
//       { status: 500 },
//     );
//   }
// }

// export async function PATCH(req: NextRequest, { params }: RouteContext) {
//   if (!requireAdmin(req)) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const { id } = await params;
//     const body = await req.json();

//     const allowed = [
//       "plan",
//       "planSeats",
//       "sessionCap",
//       "status",
//       "billingStatus",
//       "focusAreas",
//       "contactName",
//       "contactEmail",
//       "contactPhone",
//       "allowAnonymous",
//       "planRenewAt",
//     ] as const;

//     const updates: Partial<Record<(typeof allowed)[number], unknown>> = {};
//     for (const key of allowed) {
//       if (body[key] !== undefined) updates[key] = body[key];
//     }

//     if (Object.keys(updates).length === 0) {
//       return NextResponse.json(
//         { error: "No valid fields to update." },
//         { status: 400 },
//       );
//     }

//     const company = await db.company.update({
//       where: { id },
//       data: updates as Record<string, unknown>,
//       select: {
//         id: true,
//         name: true,
//         plan: true,
//         planSeats: true,
//         sessionCap: true,
//         status: true,
//         billingStatus: true,
//         contactName: true,
//         contactEmail: true,
//         focusAreas: true,
//         planRenewAt: true,
//       },
//     });

//     return NextResponse.json({ success: true, company });
//   } catch (err) {
//     console.error("[Admin company PATCH]", err);
//     return NextResponse.json(
//       { error: "Failed to update company." },
//       { status: 500 },
//     );
//   }
// }

// export async function DELETE(req: NextRequest, { params }: RouteContext) {
//   if (!requireAdmin(req)) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const { id } = await params;
//     await db.company.update({
//       where: { id },
//       data: { status: "cancelled", billingStatus: "cancelled" },
//     });
//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error("[Admin company DELETE]", err);
//     return NextResponse.json(
//       { error: "Failed to cancel company." },
//       { status: 500 },
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function requireAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("mentel_admin_session")?.value;
  return session === process.env.ADMIN_SESSION_SECRET;
}

// Update the type to reflect that params is now a Promise
type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, { params }: RouteContext) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Await the params object
    const { id } = await params;

    const company = await db.company.findUnique({
      where: { id },
      include: {
        employees: {
          where: { status: "active" },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            department: true,
            jobTitle: true,
            anonymous: true,
            enrolledAt: true,
            status: true,
            riskBand: true,
            overallScore: true,
            improvementPct: true,
            baselineScore: true,
            sessionsUsed: true,
            sessionsRemaining: true,
            lastAssessmentAt: true,
            assessments: {
              orderBy: { createdAt: "asc" },
              select: {
                id: true,
                createdAt: true,
                totalScore: true,
                riskBand: true,
                stressScore: true,
                anxietyScore: true,
                depressionScore: true,
                burnoutScore: true,
                sleepScore: true,
                relationshipScore: true,
                selfEsteemScore: true,
                flags: true,
                therapistNotes: true,
                reviewedAt: true,
                reviewedBy: true,
              },
            },
            eapSessions: {
              orderBy: { scheduledAt: "desc" },
              select: {
                id: true,
                scheduledAt: true,
                conductedAt: true,
                status: true,
                therapist: true,
                type: true,
                modality: true,
                domains: true,
                moodPre: true,
                moodPost: true,
              },
            },
          },
          orderBy: { overallScore: "desc" },
        },
        eapSessions: {
          where: { status: "completed" },
          select: { id: true, conductedAt: true, employeeId: true },
        },
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Company not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, company });
  } catch (err) {
    console.error("[Admin company GET]", err);
    return NextResponse.json(
      { error: "Failed to fetch company." },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const allowed = [
      "plan",
      "planSeats",
      "sessionCap",
      "status",
      "billingStatus",
      "focusAreas",
      "contactName",
      "contactEmail",
      "contactPhone",
      "allowAnonymous",
      "planRenewAt",
    ] as const;

    const updates: Partial<Record<(typeof allowed)[number], unknown>> = {};
    for (const key of allowed) {
      if (body[key] !== undefined) updates[key] = body[key];
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update." },
        { status: 400 },
      );
    }

    const company = await db.company.update({
      where: { id },
      data: updates as Record<string, unknown>,
      select: {
        id: true,
        name: true,
        plan: true,
        planSeats: true,
        sessionCap: true,
        status: true,
        billingStatus: true,
        contactName: true,
        contactEmail: true,
        focusAreas: true,
        planRenewAt: true,
      },
    });

    return NextResponse.json({ success: true, company });
  } catch (err) {
    console.error("[Admin company PATCH]", err);
    return NextResponse.json(
      { error: "Failed to update company." },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await db.company.update({
      where: { id },
      data: { status: "cancelled", billingStatus: "cancelled" },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Admin company DELETE]", err);
    return NextResponse.json(
      { error: "Failed to cancel company." },
      { status: 500 },
    );
  }
}
