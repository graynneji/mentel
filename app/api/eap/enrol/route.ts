// // app/api/eap/enrol/route.ts
// // Employee self-enrolment using company access code.
// // POST: validate access code → create/find CompanyEmployee → return employee token.

// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { sign } from "jsonwebtoken";
// import crypto from "crypto";
// const EMPLOYEE_SECRET = process.env.EMPLOYEE_SESSION_SECRET ?? "change-me";

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { accessCode, name, email, department, anonymous } = body as {
//       accessCode: string;
//       name?: string;
//       email?: string;
//       department?: string;
//       anonymous?: boolean;
//     };

//     if (!accessCode?.trim()) {
//       return NextResponse.json(
//         { error: "Access code is required." },
//         { status: 400 },
//       );
//     }

//     // Find company by access code
//     const company = await db.company.findUnique({
//       where: { accessCode: accessCode.trim().toUpperCase() },
//     });

//     if (!company) {
//       return NextResponse.json(
//         { error: "Invalid access code. Please check with your HR team." },
//         { status: 404 },
//       );
//     }

//     if (company.status !== "active" && company.status !== "trial") {
//       return NextResponse.json(
//         { error: "Your company's EAP programme is not currently active." },
//         { status: 403 },
//       );
//     }

//     // Check seat capacity
//     const enrolledCount = await db.companyEmployee.count({
//       where: { companyId: company.id, status: "active" },
//     });

//     if (enrolledCount >= company.planSeats) {
//       return NextResponse.json(
//         {
//           error:
//             "Your company's EAP programme has reached its capacity. Please contact your HR team.",
//         },
//         { status: 429 },
//       );
//     }

//     // Dedup by email hash if email provided
//     let emailHash: string | null = null;
//     if (email) {
//       emailHash = crypto
//         .createHash("sha256")
//         .update(email.toLowerCase().trim())
//         .digest("hex");
//       const existing = await db.companyEmployee.findFirst({
//         where: { companyId: company.id, emailHash },
//       });
//       if (existing) {
//         // Return existing employee token
//         const token = sign(
//           { employeeId: existing.id, companyId: company.id },
//           EMPLOYEE_SECRET,
//           { expiresIn: "90d" },
//         );
//         return NextResponse.json({
//           success: true,
//           employeeId: existing.id,
//           companyName: company.name,
//           token,
//           alreadyEnrolled: true,
//         });
//       }
//     }

//     // Create employee record
//     const employee = await db.companyEmployee.create({
//       data: {
//         companyId: company.id,
//         name: anonymous ? null : (name ?? null),
//         email: anonymous ? null : (email ?? null),
//         emailHash: emailHash,
//         department: department ?? null,
//         anonymous: anonymous ?? false,
//         status: "active",
//         sessionsUsed: 0,
//         sessionsRemaining: company.sessionCap,
//       },
//     });

//     // Issue employee JWT (stored client-side, used for assessment submission)
//     const token = sign(
//       { employeeId: employee.id, companyId: company.id },
//       EMPLOYEE_SECRET,
//       { expiresIn: "90d" },
//     );

//     const res = NextResponse.json({
//       success: true,
//       employeeId: employee.id,
//       companyName: company.name,
//       sessionCap: company.sessionCap,
//       token,
//     });

//     // Store in httpOnly cookie too for SSR pages
//     res.cookies.set("mentel_eap_token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       maxAge: 90 * 24 * 60 * 60,
//       path: "/",
//     });

//     return res;
//   } catch (err) {
//     console.error("[EAP enrol]", err);
//     return NextResponse.json(
//       { error: "Something went wrong. Please try again." },
//       { status: 500 },
//     );
//   }
// }

// app/api/eap/enrol/route.ts
// POST: validate access code → create/find CompanyEmployee → return employee token.
// Phone number collected here for therapist outreach via call/WhatsApp if email fails.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sign } from "jsonwebtoken";
import crypto from "crypto";

const EMPLOYEE_SECRET = process.env.EMPLOYEE_SESSION_SECRET ?? "change-me";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { accessCode, name, email, phone, department, anonymous } = body as {
      accessCode: string;
      name?: string;
      email?: string;
      phone?: string; // ← new
      department?: string;
      anonymous?: boolean;
    };

    if (!accessCode?.trim()) {
      return NextResponse.json(
        { error: "Access code is required." },
        { status: 400 },
      );
    }

    const company = await db.company.findUnique({
      where: { accessCode: accessCode.trim().toUpperCase() },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Invalid access code. Please check with your HR team." },
        { status: 404 },
      );
    }

    if (company.status !== "active" && company.status !== "trial") {
      return NextResponse.json(
        { error: "Your company's EAP programme is not currently active." },
        { status: 403 },
      );
    }

    // Check seat capacity
    const enrolledCount = await db.companyEmployee.count({
      where: { companyId: company.id, status: "active" },
    });

    if (enrolledCount >= company.planSeats) {
      return NextResponse.json(
        {
          error:
            "Your company's EAP programme has reached its capacity. Please contact your HR team.",
        },
        { status: 429 },
      );
    }

    // Dedup by email hash if email provided
    let emailHash: string | null = null;
    if (email && !anonymous) {
      emailHash = crypto
        .createHash("sha256")
        .update(email.toLowerCase().trim())
        .digest("hex");

      const existing = await db.companyEmployee.findFirst({
        where: { companyId: company.id, emailHash },
      });

      if (existing) {
        // Already enrolled — update phone if now provided and wasn't before
        if (phone && !existing.phone) {
          await db.companyEmployee.update({
            where: { id: existing.id },
            data: { phone: phone.trim() },
          });
        }
        const token = sign(
          { employeeId: existing.id, companyId: company.id },
          EMPLOYEE_SECRET,
          { expiresIn: "90d" },
        );
        const res = NextResponse.json({
          success: true,
          employeeId: existing.id,
          companyName: company.name,
          sessionCap: company.sessionCap,
          token,
          alreadyEnrolled: true,
        });
        res.cookies.set("mentel_eap_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 90 * 24 * 60 * 60,
          path: "/",
        });
        return res;
      }
    }

    // Sanitise phone — strip spaces, keep + prefix
    const cleanPhone = phone?.trim().replace(/\s+/g, "") || null;

    // Create employee record
    const employee = await db.companyEmployee.create({
      data: {
        companyId: company.id,
        name: anonymous ? null : name?.trim() || null,
        email: anonymous ? null : email?.trim() || null,
        phone: anonymous ? null : cleanPhone, // ← stored on employee
        emailHash: anonymous ? null : emailHash,
        department: department?.trim() || null,
        anonymous: anonymous ?? false,
        status: "active",
        sessionsUsed: 0,
        sessionsRemaining: company.sessionCap,
      },
    });

    const token = sign(
      { employeeId: employee.id, companyId: company.id },
      EMPLOYEE_SECRET,
      { expiresIn: "90d" },
    );

    const res = NextResponse.json({
      success: true,
      employeeId: employee.id,
      companyName: company.name,
      sessionCap: company.sessionCap,
      token,
    });

    res.cookies.set("mentel_eap_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 90 * 24 * 60 * 60,
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("[EAP enrol]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
