// import { getPerformanceAverages } from "@/lib/analytics/stats";

// export const dynamic = "force-dynamic";

// export default async function PerformancePage() {
//   const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
//   const avg = await getPerformanceAverages(since);

//   return (
//     <div>
//       <h1 className="mta-h1">Performance — last 7 days</h1>
//       {avg.sampleSize === 0 ? (
//         <div className="mta-empty">No performance samples yet.</div>
//       ) : (
//         <div className="mta-grid">
//           <Card label="LCP" value={fmt(avg.lcp, "ms")} good={avg.lcp != null && avg.lcp < 2500} />
//           <Card label="CLS" value={fmt(avg.cls, "", 3)} good={avg.cls != null && avg.cls < 0.1} />
//           <Card label="INP" value={fmt(avg.inp, "ms")} good={avg.inp != null && avg.inp < 200} />
//           <Card label="TTFB" value={fmt(avg.ttfb, "ms")} good={avg.ttfb != null && avg.ttfb < 800} />
//           <Card label="DOM loaded" value={fmt(avg.domContentLoadedMs, "ms")} />
//           <Card label="Samples" value={avg.sampleSize} />
//         </div>
//       )}
//       <p style={{ color: "#6b7280", fontSize: 13 }}>
//         Thresholds shown are Core Web Vitals "good" cutoffs (LCP &lt; 2.5s, CLS &lt; 0.1, INP &lt; 200ms, TTFB
//         &lt; 800ms).
//       </p>
//     </div>
//   );
// }

// function fmt(v: number | null | undefined, unit: string, decimals = 0) {
//   if (v == null) return "—";
//   return `${v.toFixed(decimals)}${unit}`;
// }

// function Card({ label, value, good }: { label: string; value: string | number; good?: boolean }) {
//   return (
//     <div className="mta-card">
//       <div className="mta-card-label">{label}</div>
//       <div className="mta-card-value" style={{ color: good === false ? "#dc2626" : good ? "#16a34a" : undefined }}>
//         {value}
//       </div>
//     </div>
//   );
// }

import { getPerformanceAverages } from "@/lib/analytics/stats";

export const dynamic = "force-dynamic";

export default async function PerformancePage() {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const avg = await getPerformanceAverages(since);
  return (
    <div>
      <h1 className="mta-h1">Performance — last 7 days</h1>
      {avg.sampleSize === 0 ? (
        <div className="mta-empty">No performance samples yet.</div>
      ) : (
        <div className="mta-grid">
          <Card label="LCP" value={fmt(avg.lcp, "ms")} good={avg.lcp != null && avg.lcp < 2500} />
          <Card label="CLS" value={fmt(avg.cls, "", 3)} good={avg.cls != null && avg.cls < 0.1} />
          <Card label="INP" value={fmt(avg.inp, "ms")} good={avg.inp != null && avg.inp < 200} />
          <Card label="TTFB" value={fmt(avg.ttfb, "ms")} good={avg.ttfb != null && avg.ttfb < 800} />
          <Card label="DOM loaded" value={fmt(avg.domContentLoadedMs, "ms")} />
          <Card label="Samples" value={avg.sampleSize} />
        </div>
      )}
      <p style={{ color: "#6b7280", fontSize: 13 }}>
        Thresholds shown are Core Web Vitals &quot;good&quot; cutoffs (LCP &lt; 2.5s, CLS &lt; 0.1, INP &lt; 200ms,
        TTFB &lt; 800ms).
      </p>
    </div>
  );
}

function fmt(v: number | null | undefined, unit: string, decimals = 0) {
  if (v == null) return "—";
  return `${v.toFixed(decimals)}${unit}`;
}

function Card({ label, value, good }: { label: string; value: string | number; good?: boolean }) {
  return (
    <div className="mta-card">
      <div className="mta-card-label">{label}</div>
      <div className="mta-card-value" style={{ color: good === false ? "#dc2626" : good ? "#16a34a" : undefined }}>
        {value}
      </div>
    </div>
  );
}
