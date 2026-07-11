// app/api/admin/clone-alerts/route.ts
// GET: clone detection history, grouped by the foreign domain it was
// detected on, for the /admin/security page.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function requireAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("mentel_admin_session")?.value;
  return session === process.env.ADMIN_SESSION_SECRET;
}

export async function GET(req: Request) {
  const nextReq = req as NextRequest;
  if (!requireAdmin(nextReq)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const alerts = await db.cloneAlert.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
    });

    const byHost = new Map<string, { host: string; count: number; firstSeen: Date; lastSeen: Date; sampleIps: Set<string> }>();
    for (const a of alerts) {
      const existing = byHost.get(a.detectedHost);
      if (existing) {
        existing.count += 1;
        if (a.createdAt < existing.firstSeen) existing.firstSeen = a.createdAt;
        if (a.createdAt > existing.lastSeen) existing.lastSeen = a.createdAt;
        existing.sampleIps.add(a.ip);
      } else {
        byHost.set(a.detectedHost, {
          host: a.detectedHost,
          count: 1,
          firstSeen: a.createdAt,
          lastSeen: a.createdAt,
          sampleIps: new Set([a.ip]),
        });
      }
    }

    const grouped = [...byHost.values()]
      .map((g) => ({ ...g, sampleIps: [...g.sampleIps].slice(0, 5) }))
      .sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime());

    return NextResponse.json({ success: true, domains: grouped, recentRaw: alerts.slice(0, 50) });
  } catch (err) {
    console.error("[Admin Clone Alerts GET]", err);
    return NextResponse.json({ success: false, error: "Failed to load clone alerts." }, { status: 500 });
  }
}
