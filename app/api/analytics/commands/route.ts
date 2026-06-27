import { NextRequest, NextResponse } from "next/server";
import { analyticsDb } from "@/lib/analytics/prisma";

export const runtime = "nodejs";

// GET /api/analytics/commands?visitorId=...  -> pending QueuedAction[] for that visitor
export async function GET(req: NextRequest) {
  const visitorId = req.nextUrl.searchParams.get("visitorId");
  if (!visitorId) {
    return NextResponse.json(
      { ok: false, error: "visitorId required" },
      { status: 400 },
    );
  }

  const actions = await analyticsDb.queuedAction.findMany({
    where: { visitorId, executed: false },
    orderBy: { createdAt: "asc" },
    take: 10,
  });

  return NextResponse.json({
    ok: true,
    actions: actions.map((a) => ({
      id: a.id,
      type: a.type,
      payload: a.payload,
    })),
  });
}

// POST /api/analytics/commands  { id }  -> mark a single action as executed
export async function POST(req: NextRequest) {
  const { id } = await req.json();
  if (!id)
    return NextResponse.json(
      { ok: false, error: "id required" },
      { status: 400 },
    );

  await analyticsDb.queuedAction.update({
    where: { id },
    data: { executed: true, executedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}

// PUT /api/analytics/commands  { visitorId, type, payload }  -> enqueue a new command
// Call this from your own server code/admin tools, e.g.:
//   await fetch("/api/analytics/commands", { method: "PUT", body: JSON.stringify({
//     visitorId, type: "SHOW_DISCOUNT", payload: { code: "WELCOME10" }
//   })})
export async function PUT(req: NextRequest) {
  const { visitorId, type, payload } = await req.json();
  if (!visitorId || !type) {
    return NextResponse.json(
      { ok: false, error: "visitorId and type required" },
      { status: 400 },
    );
  }

  const action = await analyticsDb.queuedAction.create({
    data: { visitorId, type, payload: payload ?? undefined },
  });

  return NextResponse.json({ ok: true, id: action.id });
}
