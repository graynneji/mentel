import { NextRequest, NextResponse } from "next/server";
import { computeFunnel } from "@/lib/analytics/funnel";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const days = Number(req.nextUrl.searchParams.get("days") ?? "30");
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const steps = await computeFunnel(since);
  return NextResponse.json({ ok: true, since, steps });
}
