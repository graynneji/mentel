// app/api/admin/leads/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params; // await is correct here

    const lead = await db.lead.findUnique({
      where: { id },
      include: {
        messages: { orderBy: { createdAt: "desc" } },
        appointments: {
          orderBy: { scheduledAt: "desc" },
          include: { session: true },
        },
        sessions: {
          orderBy: { conductedAt: "desc" },
          include: { payment: true },
        },
        payments: { orderBy: { createdAt: "desc" } },
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
    const errorMessage =
      error instanceof Error ? error.message : "Server error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
