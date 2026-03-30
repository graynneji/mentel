// // app/api/admin/leads/route.ts
// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import type { Lead, Message } from "@/generated/prisma/client";

// export type LeadWithMessages = Lead & { messages: Message[] };

// // GET /api/admin/leads?status=new&band=High&search=john
// export async function GET(req: Request): Promise<NextResponse> {
//   try {
//     const { searchParams } = new URL(req.url);
//     const status = searchParams.get("status");
//     const band = searchParams.get("band");
//     const search = searchParams.get("search");

//     const leads = await db.lead.findMany({
//       where: {
//         ...(status && status !== "all" ? { status } : {}),
//         ...(band && band !== "all" ? { band } : {}),
//         ...(search
//           ? {
//               OR: [
//                 { name: { contains: search, mode: "insensitive" } },
//                 { email: { contains: search, mode: "insensitive" } },
//                 { phone: { contains: search, mode: "insensitive" } },
//               ],
//             }
//           : {}),
//       },
//       include: {
//         messages: { orderBy: { createdAt: "desc" } },
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     return NextResponse.json({ success: true, leads });
//   } catch (error) {
//     console.error("GET leads error:", error);
//     return NextResponse.json(
//       { success: false, error: "Server error" },
//       { status: 500 },
//     );
//   }
// }

// // PATCH /api/admin/leads — update status or notes
// export async function PATCH(req: Request): Promise<NextResponse> {
//   try {
//     const body = (await req.json()) as {
//       id: string;
//       status?: string;
//       notes?: string;
//     };

//     const updated = await db.lead.update({
//       where: { id: body.id },
//       data: {
//         ...(body.status !== undefined ? { status: body.status } : {}),
//         ...(body.notes !== undefined ? { notes: body.notes } : {}),
//       },
//     });

//     return NextResponse.json({ success: true, lead: updated });
//   } catch (error) {
//     console.error("PATCH lead error:", error);
//     return NextResponse.json(
//       { success: false, error: "Server error" },
//       { status: 500 },
//     );
//   }
// }

// app/api/admin/leads/route.ts
// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import type { Lead, Message } from "@/generated/prisma/client";

// export type LeadWithMessages = Lead & { messages: Message[] };

// // ── GET /api/admin/leads ───────────────────────────────────────────────────────
// export async function GET(req: Request): Promise<NextResponse> {
//   try {
//     const { searchParams } = new URL(req.url);
//     const status = searchParams.get("status");
//     const band = searchParams.get("band");
//     const source = searchParams.get("source");
//     const therapist = searchParams.get("therapist");
//     const search = searchParams.get("search");
//     const sort = searchParams.get("sort") ?? "createdAt";
//     const order = searchParams.get("order") ?? "desc";
//     const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
//     const limit = Math.min(
//       100,
//       Math.max(1, parseInt(searchParams.get("limit") ?? "50")),
//     );
//     const skip = (page - 1) * limit;

//     const where = {
//       ...(status && status !== "all" ? { status } : {}),
//       ...(band && band !== "all" ? { band } : {}),
//       ...(source && source !== "all" ? { source } : {}),
//       ...(therapist && therapist !== "all" ? { therapist } : {}),
//       ...(search
//         ? {
//             OR: [
//               { name: { contains: search, mode: "insensitive" as const } },
//               { email: { contains: search, mode: "insensitive" as const } },
//               { phone: { contains: search, mode: "insensitive" as const } },
//             ],
//           }
//         : {}),
//     };

//     const orderByMap: Record<string, object> = {
//       createdAt: { createdAt: order },
//       score: { score: order },
//       name: { name: order },
//     };
//     const orderBy = orderByMap[sort] ?? { createdAt: "desc" };

//     const [leads, total] = await Promise.all([
//       db.lead.findMany({
//         where,
//         include: {
//           messages: { orderBy: { createdAt: "desc" } },
//           _count: {
//             select: { appointments: true, sessions: true, payments: true },
//           },
//         },
//         orderBy,
//         skip,
//         take: limit,
//       }),
//       db.lead.count({ where }),
//     ]);

//     const [statusCounts, bandCounts, sourceCounts] = await Promise.all([
//       db.lead.groupBy({ by: ["status"], _count: { id: true } }),
//       db.lead.groupBy({ by: ["band"], _count: { id: true } }),
//       db.lead.groupBy({ by: ["source"], _count: { id: true } }),
//     ]);

//     return NextResponse.json({
//       success: true,
//       leads,
//       analytics: {
//         total,
//         page,
//         pages: Math.ceil(total / limit),
//         statusCounts: Object.fromEntries(
//           statusCounts.map((r) => [r.status, r._count.id]),
//         ),
//         bandCounts: Object.fromEntries(
//           bandCounts.map((r) => [r.band, r._count.id]),
//         ),
//         sourceCounts: Object.fromEntries(
//           sourceCounts.map((r) => [r.source ?? "unknown", r._count.id]),
//         ),
//       },
//     });
//   } catch (error) {
//     console.error("GET leads error:", error);
//     return NextResponse.json(
//       { success: false, error: "Server error" },
//       { status: 500 },
//     );
//   }
// }

// // ── PATCH /api/admin/leads ─────────────────────────────────────────────────────
// export async function PATCH(req: Request): Promise<NextResponse> {
//   try {
//     const body = (await req.json()) as {
//       id: string;
//       status?: string;
//       notes?: string;
//       source?: string;
//       therapist?: string;
//       tags?: string[];
//     };

//     if (!body.id) {
//       return NextResponse.json(
//         { success: false, error: "Missing id" },
//         { status: 400 },
//       );
//     }

//     const updated = await db.lead.update({
//       where: { id: body.id },
//       data: {
//         ...(body.status !== undefined ? { status: body.status } : {}),
//         ...(body.notes !== undefined ? { notes: body.notes } : {}),
//         ...(body.source !== undefined ? { source: body.source } : {}),
//         ...(body.therapist !== undefined ? { therapist: body.therapist } : {}),
//         ...(body.tags !== undefined ? { tags: body.tags } : {}),
//       },
//     });

//     return NextResponse.json({ success: true, lead: updated });
//   } catch (error) {
//     console.error("PATCH lead error:", error);
//     return NextResponse.json(
//       { success: false, error: "Server error" },
//       { status: 500 },
//     );
//   }
// }

// // ── DELETE /api/admin/leads ────────────────────────────────────────────────────
// export async function DELETE(req: Request): Promise<NextResponse> {
//   try {
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get("id");
//     const hard = searchParams.get("hard") === "true";

//     if (!id) {
//       return NextResponse.json(
//         { success: false, error: "Missing id" },
//         { status: 400 },
//       );
//     }

//     if (hard) {
//       await db.lead.delete({ where: { id } });
//       return NextResponse.json({ success: true, deleted: true });
//     }

//     const updated = await db.lead.update({
//       where: { id },
//       data: { status: "inactive" },
//     });

//     return NextResponse.json({ success: true, lead: updated });
//   } catch (error) {
//     console.error("DELETE lead error:", error);
//     return NextResponse.json(
//       { success: false, error: "Server error" },
//       { status: 500 },
//     );
//   }
// }

//////////////////////////////////////////////////////////////////////////////
// app/api/admin/leads/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ── GET /api/admin/leads ───────────────────────────────────────────────────────
export async function GET(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const band = searchParams.get("band");
    const therapist = searchParams.get("therapist");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") ?? "20")),
    );
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status) where.status = status;
    if (band) where.band = band;
    if (therapist) where.therapist = therapist;

    const [leads, total] = await Promise.all([
      db.lead.findMany({
        where,
        include: {
          messages: {
            select: { id: true, createdAt: true, subject: true, type: true },
            orderBy: { createdAt: "desc" },
          },
          _count: {
            select: { appointments: true, sessions: true, payments: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.lead.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      leads,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET leads error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}

// ── PATCH /api/admin/leads ─────────────────────────────────────────────────────
export async function PATCH(req: Request): Promise<NextResponse> {
  try {
    const body = (await req.json()) as {
      id: string;
      status?: string;
      notes?: string;
      therapist?: string;
      tags?: string[];
    };

    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Missing id" },
        { status: 400 },
      );
    }

    const lead = await db.lead.update({
      where: { id: body.id },
      data: {
        ...(body.status !== undefined ? { status: body.status } : {}),
        ...(body.notes !== undefined ? { notes: body.notes } : {}),
        ...(body.therapist !== undefined
          ? { therapist: body.therapist || null }
          : {}),
        ...(body.tags !== undefined ? { tags: body.tags } : {}),
      },
    });

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("PATCH lead error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}
