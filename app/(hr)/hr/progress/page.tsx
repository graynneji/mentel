// "use client";

// // app/hr/progress/page.tsx
// // Shows population-level improvement trends over time.
// // Anonymised — cohort-level only, no individual data.

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { TrendingDown, TrendingUp, CheckCircle, Shield } from "lucide-react";

// interface TrendPoint { month: string; avgScore: number; enrolled: number }
// interface DomainPoint { domain: string; label: string; score: number; trend: number }

// const BAND_COLORS: Record<string, string> = {
//     Low: "#4e8c6a", Mild: "#3d8b8b", Moderate: "#8b6e3d", High: "#b94a4f", Critical: "#8b1a1a",
// };

// export default function HRProgressPage() {
//     const router = useRouter();
//     const [trend, setTrend] = useState<TrendPoint[]>([]);
//     const [domains, setDomains] = useState<DomainPoint[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [company, setCompany] = useState<{ name: string } | null>(null);

//     useEffect(() => {
//         fetch("/api/hr/analytics")
//             .then(r => { if (r.status === 401) { router.push("/hr/access"); return null; } return r.json(); })
//             .then(j => {
//                 if (j?.success) {
//                     setTrend(j.trend ?? []);
//                     setDomains(j.domainAverages ?? []);
//                     setCompany(j.company);
//                 }
//             })
//             .finally(() => setLoading(false));
//     }, [router]);

//     if (loading) return <div className="flex flex-col gap-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="animate-pulse rounded-2xl h-40 bg-[#e8f0ec]" />)}</div>;

//     const hasImprovingTrend = trend.length >= 2
//         && (trend[trend.length - 1]?.avgScore ?? 0) < (trend[0]?.avgScore ?? 0);
//     const totalReduction = trend.length >= 2
//         ? (trend[0]?.avgScore ?? 0) - (trend[trend.length - 1]?.avgScore ?? 0)
//         : 0;

//     return (
//         <div className="flex flex-col gap-4 sm:gap-5 max-w-4xl pb-8">
//             <div>
//                 <h1 className="text-[18px] sm:text-[20px] font-bold" style={{ color: "#1c3a3a" }}>Progress Tracking</h1>
//                 <p className="text-[12px] mt-0.5" style={{ color: "#7a9088" }}>
//                     {company?.name} — anonymised population improvement data
//                 </p>
//             </div>

//             {/* Headline improvement */}
//             {totalReduction > 0 && (
//                 <div className="rounded-2xl p-4 sm:p-6 flex items-start gap-4"
//                     style={{ background: "rgba(78,140,106,0.06)", border: "1px solid rgba(78,140,106,0.2)" }}>
//                     <CheckCircle size={20} style={{ color: "#4e8c6a", flexShrink: 0 }} />
//                     <div>
//                         <p className="text-[15px] font-semibold mb-1" style={{ color: "#1c3a3a" }}>
//                             Average risk score reduced by {totalReduction} points since programme launch
//                         </p>
//                         <p className="text-[12px] font-light" style={{ color: "#7a9088" }}>
//                             This represents a measurable improvement in your organisation's overall mental health and resilience.
//                             Industry benchmark for effective EAPs is a 15–25% score reduction over 6 months.
//                         </p>
//                     </div>
//                 </div>
//             )}

//             {/* 6-month trend chart */}
//             <div className="bg-white rounded-2xl border p-4 sm:p-6" style={{ borderColor: "#e4eee8" }}>
//                 <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
//                     <div>
//                         <div className="text-[14px] font-semibold" style={{ color: "#1c3a3a" }}>6-Month Population Trend</div>
//                         <div className="text-[11px]" style={{ color: "#7a9088" }}>Average composite risk score across all assessed employees</div>
//                     </div>
//                     <span className={`text-[12px] font-semibold flex items-center gap-1 ${hasImprovingTrend ? "text-[#4e8c6a]" : "text-[#b94a4f]"}`}>
//                         {hasImprovingTrend ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
//                         {hasImprovingTrend ? "Improving trajectory" : "Monitor closely"}
//                     </span>
//                 </div>

//                 {trend.length === 0 ? (
//                     <div className="h-32 flex items-center justify-center text-[12px]" style={{ color: "#b0c8bc" }}>
//                         Trend data will appear here as assessments accumulate over time.
//                     </div>
//                 ) : (
//                     <div className="overflow-x-auto">
//                         <div style={{ minWidth: 320 }}>
//                             {(() => {
//                                 const W = 500, H = 140, PAD = 20;
//                                 const validPoints = trend.filter(t => t.avgScore > 0);
//                                 if (validPoints.length < 2) return (
//                                     <div className="h-32 flex items-center justify-center text-[12px]" style={{ color: "#b0c8bc" }}>
//                                         Collecting data — need at least 2 months of assessments.
//                                     </div>
//                                 );
//                                 const maxV = Math.max(...validPoints.map(t => t.avgScore));
//                                 const pts = trend.map((t, i) => ({
//                                     x: PAD + (i / Math.max(trend.length - 1, 1)) * (W - PAD * 2),
//                                     y: t.avgScore > 0 ? H - PAD - (t.avgScore / maxV) * (H - PAD * 2) : H - PAD,
//                                     ...t,
//                                 }));
//                                 const activePts = pts.filter(p => p.avgScore > 0);
//                                 const line = activePts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
//                                 const area = `${line} L${activePts[activePts.length - 1].x},${H - PAD} L${activePts[0].x},${H - PAD} Z`;
//                                 const color = hasImprovingTrend ? "#4e8c6a" : "#b94a4f";
//                                 return (
//                                     <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 140 }}>
//                                         <defs>
//                                             <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
//                                                 <stop offset="0%" stopColor={color} stopOpacity="0.18" />
//                                                 <stop offset="100%" stopColor={color} stopOpacity="0.01" />
//                                             </linearGradient>
//                                         </defs>
//                                         <path d={area} fill="url(#pg)" />
//                                         <path d={line} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
//                                         {pts.map((p, i) => (
//                                             <g key={i}>
//                                                 {p.avgScore > 0 && (
//                                                     <>
//                                                         <circle cx={p.x} cy={p.y} r={4} fill={color} />
//                                                         <text x={p.x} y={p.y - 10} textAnchor="middle" style={{ fontSize: 10, fill: color, fontWeight: 600 }}>
//                                                             {p.avgScore}
//                                                         </text>
//                                                     </>
//                                                 )}
//                                                 <text x={p.x} y={H} textAnchor="middle" style={{ fontSize: 9, fill: "#8da898" }}>{p.month}</text>
//                                                 {p.enrolled > 0 && (
//                                                     <text x={p.x} y={H - 8} textAnchor="middle" style={{ fontSize: 7, fill: "#c8ddd2" }}>
//                                                         n={p.enrolled}
//                                                     </text>
//                                                 )}
//                                             </g>
//                                         ))}
//                                     </svg>
//                                 );
//                             })()}
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Domain improvements */}
//             <div className="bg-white rounded-2xl border p-4 sm:p-6" style={{ borderColor: "#e4eee8" }}>
//                 <div className="text-[14px] font-semibold mb-1" style={{ color: "#1c3a3a" }}>Domain Improvements</div>
//                 <div className="text-[11px] mb-5" style={{ color: "#7a9088" }}>Change in each wellbeing area vs. previous month</div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     {domains.map(d => {
//                         const improving = d.trend < 0;
//                         return (
//                             <div key={d.domain} className="flex items-center gap-3 p-3 rounded-xl"
//                                 style={{
//                                     background: improving ? "rgba(78,140,106,0.04)" : "rgba(185,74,79,0.04)",
//                                     border: `1px solid ${improving ? "rgba(78,140,106,0.15)" : "rgba(185,74,79,0.15)"}`
//                                 }}>
//                                 <div className="flex-1">
//                                     <p className="text-[12px] font-semibold mb-0.5" style={{ color: "#1c3a3a" }}>{d.label}</p>
//                                     <p className="text-[11px]" style={{ color: "#7a9088" }}>
//                                         Current avg score: <strong style={{ color: "#1c3a3a" }}>{d.score}</strong>/100
//                                     </p>
//                                 </div>
//                                 <div className="text-right">
//                                     <div className={`text-[16px] font-bold flex items-center gap-1 ${improving ? "text-[#4e8c6a]" : "text-[#b94a4f]"}`}>
//                                         {improving ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
//                                         {Math.abs(d.trend)}%
//                                     </div>
//                                     <div className="text-[9px]" style={{ color: "#b0c8bc" }}>vs last month</div>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>

//             {/* Privacy */}
//             <div className="flex items-start gap-2">
//                 <Shield size={12} style={{ color: "#b0c8bc", flexShrink: 0, marginTop: 2 }} />
//                 <p className="text-[11px]" style={{ color: "#b0c8bc" }}>
//                     Progress data reflects population-level trends only. Individual employee trajectories are never visible to HR.
//                 </p>
//             </div>
//         </div>
//     );
// }
"use client";

// app/hr/progress/page.tsx
// Shows population-level improvement trends over time.
// Anonymised — cohort-level only, no individual data.

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TrendingDown, TrendingUp, CheckCircle, Shield } from "lucide-react";

interface TrendPoint { month: string; avgScore: number; enrolled: number }
interface DomainPoint { domain: string; label: string; score: number; trend: number }

const BAND_COLORS: Record<string, string> = {
    Low: "#4e8c6a", Mild: "#3d8b8b", Moderate: "#8b6e3d", High: "#b94a4f", Critical: "#8b1a1a",
};

export default function HRProgressPage() {
    const router = useRouter();
    const [trend, setTrend] = useState<TrendPoint[]>([]);
    const [domains, setDomains] = useState<DomainPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [company, setCompany] = useState<{ name: string } | null>(null);


    console.log(trend, "Trends")

    useEffect(() => {
        fetch("/api/hr/analytics")
            .then(r => { if (r.status === 401) { router.push("/hr/access"); return null; } return r.json(); })
            .then(j => {
                if (j?.success) {
                    setTrend(j.trend ?? []);
                    setDomains(j.domainAverages ?? []);
                    setCompany(j.company);
                }
            })
            .finally(() => setLoading(false));
    }, [router]);

    if (loading) return <div className="flex flex-col gap-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="animate-pulse rounded-2xl h-40 bg-[#e8f0ec]" />)}</div>;

    const validTrend = trend.filter(t => t.avgScore > 0);
    const hasImprovingTrend = validTrend.length >= 2
        && (validTrend[validTrend.length - 1]?.avgScore ?? 0) < (validTrend[0]?.avgScore ?? 0);
    const totalReduction = validTrend.length >= 2
        ? (validTrend[0]?.avgScore ?? 0) - (validTrend[validTrend.length - 1]?.avgScore ?? 0)
        : 0;

    return (
        <div className="flex flex-col gap-4 sm:gap-5 pb-8">
            <div>
                <h1 className="text-[18px] sm:text-[20px] font-bold" style={{ color: "#1c3a3a" }}>Progress Tracking</h1>
                <p className="text-[12px] mt-0.5" style={{ color: "#7a9088" }}>
                    {company?.name} — anonymised population improvement data
                </p>
            </div>

            {/* Headline improvement */}
            {totalReduction > 0 && (
                <div className="rounded-2xl p-4 sm:p-6 flex items-start gap-4"
                    style={{ background: "rgba(78,140,106,0.06)", border: "1px solid rgba(78,140,106,0.2)" }}>
                    <CheckCircle size={20} style={{ color: "#4e8c6a", flexShrink: 0 }} />
                    <div>
                        <p className="text-[15px] font-semibold mb-1" style={{ color: "#1c3a3a" }}>
                            Average risk score reduced by {totalReduction} points since programme launch
                        </p>
                        <p className="text-[12px] font-light" style={{ color: "#7a9088" }}>
                            This represents a measurable improvement in your organisation's overall mental health and resilience.
                            Industry benchmark for effective EAPs is a 15–25% score reduction over 6 months.
                        </p>
                    </div>
                </div>
            )}

            {/* 6-month trend chart */}
            <div className="bg-white rounded-2xl border p-4 sm:p-6" style={{ borderColor: "#e4eee8" }}>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <div>
                        <div className="text-[14px] font-semibold" style={{ color: "#1c3a3a" }}>6-Month Population Trend</div>
                        <div className="text-[11px]" style={{ color: "#7a9088" }}>Average composite risk score across all assessed employees</div>
                    </div>
                    <span className={`text-[12px] font-semibold flex items-center gap-1 ${hasImprovingTrend ? "text-[#4e8c6a]" : "text-[#b94a4f]"}`}>
                        {hasImprovingTrend ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                        {hasImprovingTrend ? "Improving trajectory" : "Monitor closely"}
                    </span>
                </div>

                {trend.length === 0 ? (
                    <div className="h-32 flex items-center justify-center text-[12px]" style={{ color: "#b0c8bc" }}>
                        Trend data will appear here as assessments accumulate over time.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <div style={{ minWidth: 320 }}>
                            {(() => {
                                const W = 500, H = 140, PAD = 20;
                                const validPoints = trend.filter(t => t.avgScore > 0);
                                if (validPoints.length < 2) return (
                                    <div className="h-32 flex items-center justify-center text-[12px]" style={{ color: "#b0c8bc" }}>
                                        Collecting data — need at least 2 months of assessments.
                                    </div>
                                );
                                const maxV = Math.max(...validPoints.map(t => t.avgScore));
                                const pts = trend.map((t, i) => ({
                                    x: PAD + (i / Math.max(trend.length - 1, 1)) * (W - PAD * 2),
                                    y: t.avgScore > 0 ? H - PAD - (t.avgScore / maxV) * (H - PAD * 2) : H - PAD,
                                    ...t,
                                }));
                                const activePts = pts.filter(p => p.avgScore > 0);
                                const line = activePts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
                                const area = `${line} L${activePts[activePts.length - 1].x},${H - PAD} L${activePts[0].x},${H - PAD} Z`;
                                const color = hasImprovingTrend ? "#4e8c6a" : "#b94a4f";
                                return (
                                    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 140 }}>
                                        <defs>
                                            <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor={color} stopOpacity="0.18" />
                                                <stop offset="100%" stopColor={color} stopOpacity="0.01" />
                                            </linearGradient>
                                        </defs>
                                        <path d={area} fill="url(#pg)" />
                                        <path d={line} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                                        {pts.map((p, i) => (
                                            <g key={i}>
                                                {p.avgScore > 0 && (
                                                    <>
                                                        <circle cx={p.x} cy={p.y} r={4} fill={color} />
                                                        <text x={p.x} y={p.y - 10} textAnchor="middle" style={{ fontSize: 10, fill: color, fontWeight: 600 }}>
                                                            {p.avgScore}
                                                        </text>
                                                    </>
                                                )}
                                                <text x={p.x} y={H} textAnchor="middle" style={{ fontSize: 9, fill: "#8da898" }}>{p.month}</text>
                                                {p.enrolled > 0 && (
                                                    <text x={p.x} y={H - 8} textAnchor="middle" style={{ fontSize: 7, fill: "#c8ddd2" }}>
                                                        n={p.enrolled}
                                                    </text>
                                                )}
                                            </g>
                                        ))}
                                    </svg>
                                );
                            })()}
                        </div>
                    </div>
                )}
            </div>

            {/* Domain improvements */}
            <div className="bg-white rounded-2xl border p-4 sm:p-6" style={{ borderColor: "#e4eee8" }}>
                <div className="text-[14px] font-semibold mb-1" style={{ color: "#1c3a3a" }}>Domain Improvements</div>
                <div className="text-[11px] mb-5" style={{ color: "#7a9088" }}>Change in each wellbeing area vs. previous month</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {domains.map(d => {
                        const improving = d.trend < 0;
                        return (
                            <div key={d.domain} className="flex items-center gap-3 p-3 rounded-xl"
                                style={{
                                    background: improving ? "rgba(78,140,106,0.04)" : "rgba(185,74,79,0.04)",
                                    border: `1px solid ${improving ? "rgba(78,140,106,0.15)" : "rgba(185,74,79,0.15)"}`
                                }}>
                                <div className="flex-1">
                                    <p className="text-[12px] font-semibold mb-0.5" style={{ color: "#1c3a3a" }}>{d.label}</p>
                                    <p className="text-[11px]" style={{ color: "#7a9088" }}>
                                        Current avg score: <strong style={{ color: "#1c3a3a" }}>{d.score}</strong>/100
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className={`text-[16px] font-bold flex items-center gap-1 ${improving ? "text-[#4e8c6a]" : "text-[#b94a4f]"}`}>
                                        {improving ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                                        {Math.abs(d.trend)}%
                                    </div>
                                    <div className="text-[9px]" style={{ color: "#b0c8bc" }}>vs last month</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Privacy */}
            <div className="flex items-start gap-2">
                <Shield size={12} style={{ color: "#b0c8bc", flexShrink: 0, marginTop: 2 }} />
                <p className="text-[11px]" style={{ color: "#b0c8bc" }}>
                    Progress data reflects population-level trends only. Individual employee trajectories are never visible to HR.
                </p>
            </div>
        </div>
    );
}