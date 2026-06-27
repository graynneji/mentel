import { analyticsDb } from "./prisma";
import { FUNNEL_STEPS } from "./types";

export interface FunnelStepResult {
  event: string;
  label: string;
  visitors: number;
  dropOffFromPrevious: number | null; // percent
  conversionFromStart: number; // percent
}

/**
 * Counts DISTINCT visitors that fired each funnel event within [since, now],
 * regardless of order. This is the simple/cheap funnel ("how many people did
 * each step at least once"), not a strict ordered-sequence funnel. Good
 * enough for the drop-off view in the spec; swap in a window-function query
 * if you need strict ordering across steps later.
 */
export async function computeFunnel(since: Date): Promise<FunnelStepResult[]> {
  const counts: { visitorId: string }[][] = await Promise.all(
    FUNNEL_STEPS.map((step) =>
      analyticsDb.event.findMany({
        where: { name: step.event, createdAt: { gte: since } },
        distinct: ["visitorId"],
        select: { visitorId: true },
      }),
    ),
  );

  const visitorCounts = counts.map((rows) => rows.length);
  const start = visitorCounts[0] || 1;

  return FUNNEL_STEPS.map((step, i) => ({
    event: step.event,
    label: step.label,
    visitors: visitorCounts[i],
    dropOffFromPrevious:
      i === 0
        ? null
        : visitorCounts[i - 1] === 0
          ? 0
          : round1(100 - (visitorCounts[i] / visitorCounts[i - 1]) * 100),
    conversionFromStart: round1((visitorCounts[i] / start) * 100),
  }));
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
