// app/api/admin/leads/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { Lead, Message } from "@/generated/prisma/client";

export type LeadWithMessages = Lead & { messages: Message[] };

// GET /api/admin/leads?status=new&band=High&search=john
export async function GET(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const band = searchParams.get("band");
    const search = searchParams.get("search");

    const leads = await db.lead.findMany({
      where: {
        ...(status && status !== "all" ? { status } : {}),
        ...(band && band !== "all" ? { band } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { phone: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        messages: { orderBy: { createdAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, leads });
  } catch (error) {
    console.error("GET leads error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}

// PATCH /api/admin/leads — update status or notes
export async function PATCH(req: Request): Promise<NextResponse> {
  try {
    const body = (await req.json()) as {
      id: string;
      status?: string;
      notes?: string;
    };

    const updated = await db.lead.update({
      where: { id: body.id },
      data: {
        ...(body.status !== undefined ? { status: body.status } : {}),
        ...(body.notes !== undefined ? { notes: body.notes } : {}),
      },
    });

    return NextResponse.json({ success: true, lead: updated });
  } catch (error) {
    console.error("PATCH lead error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}
