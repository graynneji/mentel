import { NextRequest, NextResponse } from "next/server";
import { getOverviewStats, getTopPages, getTopReferrers, getBounceRate } from "@/lib/analytics/stats";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const days = Number(req.nextUrl.searchParams.get("days") ?? "1");
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [overview, topPages, topReferrers, bounceRate] = await Promise.all([
    getOverviewStats(since),
    getTopPages(since),
    getTopReferrers(since),
    getBounceRate(since),
  ]);

  return NextResponse.json({ ok: true, since, overview, topPages, topReferrers, bounceRate });
}
