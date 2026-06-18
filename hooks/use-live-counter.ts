// ── Live counter hook ──────────────────────────────────────────────────────────

import { useCallback, useState, useEffect } from "react";

export function useLiveCounter(
  baseValue: number,
  startDate: string,
  perDay: number,
) {
  const calculate = useCallback(() => {
    const start = new Date(startDate).getTime();
    const now = Date.now();
    const secondsElapsed = (now - start) / 1000;
    const perSecond = perDay / (24 * 60 * 60);
    const growth = secondsElapsed * perSecond;
    const secondSeed = Math.floor(now / 1000);
    const jitter =
      (Math.sin(secondSeed * 0.017) * 0.5 + 0.5) * (perSecond * 30);
    return Math.floor(baseValue + growth + jitter);
  }, [baseValue, startDate, perDay]);

  const [count, setCount] = useState(calculate);

  useEffect(() => {
    const interval = setInterval(() => setCount(calculate()), 1000);
    return () => clearInterval(interval);
  }, [calculate]);

  return count;
}
