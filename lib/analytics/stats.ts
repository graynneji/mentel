import { analyticsDb } from "./prisma";

export async function getOverviewStats(since: Date) {
  const [
    visitorsToday,
    sessionsToday,
    totalEvents,
    avgSessionRaw,
    returningVisitors,
  ] = await Promise.all([
    analyticsDb.visitor.count({ where: { lastSeenAt: { gte: since } } }),
    analyticsDb.session.count({ where: { startedAt: { gte: since } } }),
    analyticsDb.event.count({ where: { createdAt: { gte: since } } }),
    analyticsDb.session.aggregate({
      where: { startedAt: { gte: since }, durationSec: { not: null } },
      _avg: { durationSec: true },
    }),
    analyticsDb.visitor.count({
      where: { firstSeenAt: { lt: since }, lastSeenAt: { gte: since } },
    }),
  ]);

  return {
    visitorsToday,
    sessionsToday,
    totalEvents,
    avgSessionSec: Math.round(avgSessionRaw._avg.durationSec ?? 0),
    returningVisitors,
  };
}

export async function getTopPages(since: Date, limit = 10) {
  const rows = await analyticsDb.pageView.groupBy({
    by: ["path"],
    where: { createdAt: { gte: since } },
    _count: { _all: true },
    orderBy: { _count: { path: "desc" } },
    take: limit,
  });
  return rows.map((r: (typeof rows)[0]) => ({
    path: r.path,
    views: r._count._all,
  }));
}

export async function getTopReferrers(since: Date, limit = 10) {
  const rows = await analyticsDb.session.groupBy({
    by: ["referrer"],
    where: { startedAt: { gte: since }, referrer: { not: null } },
    _count: { _all: true },
    orderBy: { _count: { referrer: "desc" } },
    take: limit,
  });
  return rows.map((r: (typeof rows)[0]) => ({
    referrer: r.referrer ?? "(direct)",
    count: r._count._all,
  }));
}

export async function getRecentVisitors(limit = 50) {
  return analyticsDb.visitor.findMany({
    orderBy: { lastSeenAt: "desc" },
    take: limit,
    include: {
      sessions: { orderBy: { startedAt: "desc" }, take: 1 },
    },
  });
}

export async function getRecentErrors(limit = 50) {
  return analyticsDb.errorLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getPerformanceAverages(since: Date) {
  const agg = await analyticsDb.performanceMetric.aggregate({
    where: { createdAt: { gte: since } },
    _avg: {
      cls: true,
      fid: true,
      lcp: true,
      inp: true,
      ttfb: true,
      domContentLoadedMs: true,
    },
    _count: { _all: true },
  });
  return { ...agg._avg, sampleSize: agg._count._all };
}

export async function getBounceRate(since: Date): Promise<number> {
  const sessions: Array<{ id: string; _count: { pageViews: number } }> =
    await analyticsDb.session.findMany({
      where: { startedAt: { gte: since } },
      select: { id: true, _count: { select: { pageViews: true } } },
    });
  if (sessions.length === 0) return 0;
  const bounced = sessions.filter((s) => s._count.pageViews <= 1).length;
  return Math.round((bounced / sessions.length) * 1000) / 10;
}
