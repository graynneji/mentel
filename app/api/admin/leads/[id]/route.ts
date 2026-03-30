// // app/api/admin/leads/[id]/route.ts
// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";

// export async function GET(
//   _req: Request,
//   { params }: { params: { id: string } },
// ): Promise<NextResponse> {
//   try {
//     const lead = await db.lead.findUnique({
//       where: { id: params.id },
//       include: {
//         messages: { orderBy: { createdAt: "desc" } },
//         appointments: {
//           include: { session: { include: { payment: true } } },
//           orderBy: { scheduledAt: "desc" },
//         },
//         sessions: {
//           include: { payment: true },
//           orderBy: { conductedAt: "desc" },
//         },
//         payments: { orderBy: { createdAt: "desc" } },
//       },
//     });

//     if (!lead) {
//       return NextResponse.json(
//         { success: false, error: "Not found" },
//         { status: 404 },
//       );
//     }

//     return NextResponse.json({ success: true, lead });
//   } catch (error) {
//     console.error("GET lead error:", error);
//     return NextResponse.json(
//       { success: false, error: "Server error" },
//       { status: 500 },
//     );
//   }
// }

// app/api/admin/leads/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;

    const lead = await db.lead.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
        },
        appointments: {
          orderBy: { scheduledAt: "desc" },
          include: {
            session: true, // Don't nest payment here to keep it light
          },
        },
        sessions: {
          orderBy: { conductedAt: "desc" },
          include: {
            payment: true, // Get payment details via the session
          },
        },
        payments: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!lead) {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, lead });
  } catch (error: unknown) {
    // This will show the EXACT Prisma error in your terminal
    const errorMessage =
      error instanceof Error ? error.message : "Server error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
