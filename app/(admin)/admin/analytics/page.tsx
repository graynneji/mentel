// "use client";

// // app/admin/analytics/page.tsx
// import { useState, useEffect, useCallback } from "react";
// import { RefreshCw, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";

// // ── Types ──────────────────────────────────────────────────────────────────────
// interface AnalyticsData {
//     overview: {
//         totalLeads: number; newLeads: number; bookedLeads: number;
//         conversionRate: number; totalSessions: number; thisMonthSessions: number;
//         sessionGrowth: number | null; noShows: number; noShowRate: number;
//         totalPaidKobo: number; thisMonthPaidKobo: number; lastMonthPaidKobo: number;
//         revenueGrowth: number | null; arpu: number; upcomingCount: number;
//         avgMood: number | null; pendingKobo: number;
//     };
//     distributions: {
//         band: Record<string, number>;
//         status: Record<string, number>;
//         source: Record<string, number>;
//         therapist: { name: string; sessions: number; totalMinutes: number }[];
//     };
//     charts: {
//         monthlyRevenue: { month: string; amountKobo: number; sessions: number }[];
//         monthlyLeads: { month: string; count: number }[];
//     };
//     alerts: { highSeverityLeads: { id: string; name: string; score: number; band: string }[] };
// }

// // ── Helpers ────────────────────────────────────────────────────────────────────
// const fmtNaira = (kobo: number) => {
//     const n = kobo / 100;
//     if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(2)}M`;
//     if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}K`;
//     return `₦${n.toFixed(0)}`;
// };

// const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// const shortMonth = (ym: string) => MONTHS[parseInt(ym.split("-")[1]) - 1] ?? ym;

// const BAND_COLORS: Record<string, string> = { Low: "#4e8c6a", Mild: "#3d8b8b", Moderate: "#8b6e3d", High: "#b94a4f" };
// const STATUS_COLORS: Record<string, string> = { new: "#7ba98b", contacted: "#3d8b8b", booked: "#7b6fa9", inactive: "#b0b0b0", churned: "#b94a4f" };
// const SOURCE_COLORS = ["#4e8c6a", "#3d8b8b", "#7b6fa9", "#8b6e3d", "#b94a4f"];

// const Q_LABELS: Record<string, string> = {
//     q1: "Mood", q2: "Anxiety", q3: "Energy", q4: "Sleep",
//     q5: "Relationships", q6: "Stress", q7: "Self-worth", q8: "Support",
// };

// // ── Chart components ───────────────────────────────────────────────────────────
// function AreaLine({ data, color = "#4e7a5e", height = 100 }: {
//     data: number[]; color?: string; height?: number;
// }) {
//     if (!data.length) return <div className="flex items-center justify-center text-[#b0c8bc] text-sm" style={{ height }}>No data</div>;
//     const W = 400, H = height, PAD = 8;
//     const max = Math.max(...data, 1);
//     const pts = data.map((v, i) => ({
//         x: PAD + (i / Math.max(data.length - 1, 1)) * (W - PAD * 2),
//         y: H - PAD - ((v / max) * (H - PAD * 2)),
//     }));
//     const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
//     const area = `${line} L${pts[pts.length - 1].x},${H - PAD} L${pts[0].x},${H - PAD} Z`;
//     return (
//         <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }}>
//             <defs>
//                 <linearGradient id={`ag${color}`} x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="0%" stopColor={color} stopOpacity="0.18" />
//                     <stop offset="100%" stopColor={color} stopOpacity="0.01" />
//                 </linearGradient>
//             </defs>
//             <path d={area} fill={`url(#ag${color})`} />
//             <path d={line} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
//             <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r={3} fill={color} />
//         </svg>
//     );
// }

// function HBar({ label, value, max, color, sub }: { label: string; value: number; max: number; color: string; sub?: string }) {
//     return (
//         <div className="mb-2.5">
//             <div className="flex justify-between mb-1">
//                 <span className="text-[11px] text-[#7a9088]">{label}</span>
//                 <div className="flex items-center gap-2">
//                     {sub && <span className="text-[10px]" style={{ color }}>{sub}</span>}
//                     <span className="text-[11px] font-bold text-[#1c3a3a]">{value}</span>
//                 </div>
//             </div>
//             <div className="h-2 bg-[#f0f4f2] rounded-full overflow-hidden">
//                 <div className="h-full rounded-full transition-all duration-700" style={{ width: `${max > 0 ? (value / max) * 100 : 0}%`, background: color }} />
//             </div>
//         </div>
//     );
// }

// function KpiCard({ label, value, sub, color, trend }: {
//     label: string; value: string | number; sub?: string; color: string;
//     trend?: { pct: string; up: boolean } | null;
// }) {
//     return (
//         <div className="bg-white rounded-2xl border border-[#ddeae2] p-4 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
//             <div className="flex items-center justify-between mb-2">
//                 <div className="w-2 h-2 rounded-full" style={{ background: color }} />
//                 {trend && (
//                     <span className={`text-[11px] font-semibold flex items-center gap-0.5 ${trend.up ? "text-[#4e8c6a]" : "text-[#b94a4f]"}`}>
//                         {trend.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}{trend.pct}%
//                     </span>
//                 )}
//             </div>
//             <div className="text-[20px] font-bold text-[#1c3a3a] leading-tight">{value}</div>
//             <div className="text-[11px] text-[#7a9088] mt-0.5">{label}</div>
//             {sub && <div className="text-[10px] mt-0.5 font-medium" style={{ color }}>{sub}</div>}
//         </div>
//     );
// }

// // ── Conversion funnel ──────────────────────────────────────────────────────────
// function ConversionFunnel({ dist }: { dist: Record<string, number> }) {
//     const stages = [
//         { label: "Total Leads", count: Object.values(dist).reduce((a, b) => a + b, 0), color: "#7ba98b" },
//         { label: "Contacted", count: (dist.contacted ?? 0) + (dist.booked ?? 0), color: "#3d8b8b" },
//         { label: "Booked", count: dist.booked ?? 0, color: "#7b6fa9" },
//     ];
//     const max = stages[0].count || 1;
//     return (
//         <div className="flex flex-col gap-3">
//             {stages.map((s, i) => {
//                 const pct = (s.count / max) * 100;
//                 const conv = i > 0 ? ((s.count / Math.max(stages[i - 1].count, 1)) * 100).toFixed(1) : null;
//                 return (
//                     <div key={s.label}>
//                         <div className="flex justify-between mb-1">
//                             <span className="text-[12px] text-[#7a9088]">{s.label}</span>
//                             <div className="flex items-center gap-2">
//                                 {conv && <span className="text-[10px] font-semibold" style={{ color: s.color }}>{conv}% →</span>}
//                                 <span className="text-[12px] font-bold text-[#1c3a3a]">{s.count}</span>
//                             </div>
//                         </div>
//                         <div className="h-3 bg-[#f0f4f2] rounded-full overflow-hidden">
//                             <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: s.color }} />
//                         </div>
//                     </div>
//                 );
//             })}
//             <div className="pt-3 border-t border-[#f0f4f2] flex items-center justify-between">
//                 <span className="text-[11px] text-[#7a9088]">Overall conversion rate</span>
//                 <span className="text-[18px] font-bold text-[#7b6fa9]">
//                     {max > 0 ? ((stages[2].count / max) * 100).toFixed(1) : 0}%
//                 </span>
//             </div>
//         </div>
//     );
// }

// // ── Symptom heatmap (from leads answers — aggregated server side would be ideal,
// //    here we show avg per band from distributions as a proxy) ───────────────────
// function BandHeatmap({ dist }: { dist: Record<string, number> }) {
//     const bands = ["Low", "Mild", "Moderate", "High"];
//     const total = Object.values(dist).reduce((a, b) => a + b, 0) || 1;
//     return (
//         <div className="grid grid-cols-2 gap-2">
//             {bands.map(b => {
//                 const count = dist[b] ?? 0;
//                 const pct = (count / total) * 100;
//                 const color = BAND_COLORS[b];
//                 const intensity = pct / 100;
//                 return (
//                     <div key={b} className="rounded-xl p-3 text-center" style={{ background: `${color}${Math.round(intensity * 50 + 10).toString(16).padStart(2, "0")}` }}>
//                         <div className="text-[10px] text-[#7a9088] mb-0.5">{b}</div>
//                         <div className="text-[18px] font-bold" style={{ color }}>{count}</div>
//                         <div className="text-[10px] mt-0.5" style={{ color }}>{pct.toFixed(0)}%</div>
//                         <div className="mt-1.5 h-[2px] bg-white/40 rounded-full overflow-hidden">
//                             <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// }

// // ── Revenue vs sessions dual chart ────────────────────────────────────────────
// function DualChart({ data }: { data: { month: string; amountKobo: number; sessions: number }[] }) {
//     if (!data.length) return <div className="h-[100px] flex items-center justify-center text-[#b0c8bc] text-sm">No data</div>;
//     const maxRev = Math.max(...data.map(d => d.amountKobo), 1);
//     const maxSess = Math.max(...data.map(d => d.sessions), 1);
//     const W = 460, H = 100, PAD = 10;

//     const revPts = data.map((d, i) => ({
//         x: PAD + (i / Math.max(data.length - 1, 1)) * (W - PAD * 2),
//         y: H - PAD - ((d.amountKobo / maxRev) * (H - PAD * 2)),
//     }));
//     const sessPts = data.map((d, i) => ({
//         x: PAD + (i / Math.max(data.length - 1, 1)) * (W - PAD * 2),
//         y: H - PAD - ((d.sessions / maxSess) * (H - PAD * 2)),
//     }));

//     const revLine = revPts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
//     const sessLine = sessPts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

//     return (
//         <div>
//             <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 100 }}>
//                 <path d={revLine} fill="none" stroke="#4e7a5e" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
//                 <path d={sessLine} fill="none" stroke="#7b6fa9" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 2" />
//                 {data.map((d, i) => (
//                     <text key={i} x={revPts[i].x} y={H} textAnchor="middle" fontSize={9} fill="#8da898">{shortMonth(d.month)}</text>
//                 ))}
//             </svg>
//             <div className="flex gap-4 mt-1">
//                 <div className="flex items-center gap-1.5"><div className="w-8 h-[2px] bg-[#4e7a5e] rounded" /><span className="text-[10px] text-[#7a9088]">Revenue</span></div>
//                 <div className="flex items-center gap-1.5"><div className="w-8 h-[2px] bg-[#7b6fa9] rounded" style={{ backgroundImage: "repeating-linear-gradient(90deg,#7b6fa9 0,#7b6fa9 4px,transparent 4px,transparent 6px)" }} /><span className="text-[10px] text-[#7a9088]">Sessions</span></div>
//             </div>
//         </div>
//     );
// }

// // ── Main page ──────────────────────────────────────────────────────────────────
// export default function AnalyticsPage() {
//     const [data, setData] = useState<AnalyticsData | null>(null);
//     const [loading, setLoading] = useState(true);

//     const fetchData = useCallback(async () => {
//         setLoading(true);
//         try {
//             const res = await fetch("/api/admin/analytics");
//             const json = await res.json();
//             if (json.success) setData(json);
//         } finally { setLoading(false); }
//     }, []);

//     useEffect(() => { fetchData(); }, [fetchData]);

//     if (loading) return (
//         <div className="flex items-center justify-center h-64">
//             <div className="w-8 h-8 rounded-full border-2 border-[#4e8c6a] border-t-transparent animate-spin" />
//         </div>
//     );

//     const ov = data?.overview;
//     const dist = data?.distributions;
//     const ch = data?.charts;

//     const fmtTrend = (n: number | null | undefined) => {
//         if (n === null || n === undefined) return null;
//         return { pct: Math.abs(n).toFixed(1), up: n >= 0 };
//     };

//     const totalLeads = Object.values(dist?.band ?? {}).reduce((a, b) => a + b, 0);

//     return (
//         <div className="flex flex-col gap-5 max-w-[1300px]">
//             {/* Header */}
//             <div className="flex items-center justify-between">
//                 <div>
//                     <h1 className="text-[18px] font-bold text-[#1c3a3a]">Analytics</h1>
//                     <p className="text-[12px] text-[#7a9088]">Deep insights across your practice</p>
//                 </div>
//                 <button onClick={fetchData} className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#ddeae2] rounded-xl text-[12px] text-[#7a9088] cursor-pointer hover:bg-[#f7faf8]">
//                     <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
//                 </button>
//             </div>

//             {/* KPI row */}
//             <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
//                 <KpiCard label="Conversion Rate" value={`${(ov?.conversionRate ?? 0).toFixed(1)}%`} color="#7b6fa9" sub="leads → booked" trend={null} />
//                 <KpiCard label="Revenue Growth" value={ov?.revenueGrowth != null ? `${ov.revenueGrowth > 0 ? "+" : ""}${ov.revenueGrowth.toFixed(1)}%` : "—"} color="#4e7a5e" sub="vs last month" trend={fmtTrend(ov?.revenueGrowth)} />
//                 <KpiCard label="Avg. Session Revenue" value={fmtNaira(ov?.arpu ?? 0)} color="#8b6e3d" sub="per session" trend={null} />
//                 <KpiCard label="No-Show Rate" value={`${(ov?.noShowRate ?? 0).toFixed(1)}%`} color={(ov?.noShowRate ?? 0) > 15 ? "#b94a4f" : "#4e7a5e"} sub={`${ov?.noShows ?? 0} total`} trend={null} />
//                 <KpiCard label="Avg. Client Mood" value={ov?.avgMood ? `${ov.avgMood.toFixed(1)}/5` : "—"} color="#3d8b8b" sub="post-session" trend={null} />
//                 <KpiCard label="Total Revenue" value={fmtNaira(ov?.totalPaidKobo ?? 0)} color="#4e7a5e" sub="all time paid" trend={fmtTrend(ov?.revenueGrowth)} />
//             </div>

//             {/* Revenue + sessions dual chart */}
//             <div className="grid gap-4" style={{ gridTemplateColumns: "2fr 1fr" }}>
//                 <div className="bg-white rounded-2xl border border-[#ddeae2] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
//                     <div className="text-[13px] font-semibold text-[#1c3a3a] mb-1">Revenue vs Sessions</div>
//                     <div className="text-[11px] text-[#7a9088] mb-4">6-month trend overlay</div>
//                     <DualChart data={ch?.monthlyRevenue ?? []} />
//                 </div>

//                 {/* Conversion funnel */}
//                 <div className="bg-white rounded-2xl border border-[#ddeae2] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
//                     <div className="text-[13px] font-semibold text-[#1c3a3a] mb-1">Conversion Funnel</div>
//                     <div className="text-[11px] text-[#7a9088] mb-4">Lead journey stages</div>
//                     <ConversionFunnel dist={dist?.status ?? {}} />
//                 </div>
//             </div>

//             {/* Band heatmap + Status + Source */}
//             <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
//                 <div className="bg-white rounded-2xl border border-[#ddeae2] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
//                     <div className="text-[13px] font-semibold text-[#1c3a3a] mb-1">Severity Distribution</div>
//                     <div className="text-[11px] text-[#7a9088] mb-4">{totalLeads} total leads</div>
//                     <BandHeatmap dist={dist?.band ?? {}} />
//                 </div>

//                 <div className="bg-white rounded-2xl border border-[#ddeae2] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
//                     <div className="text-[13px] font-semibold text-[#1c3a3a] mb-1">Status Breakdown</div>
//                     <div className="text-[11px] text-[#7a9088] mb-4">Current pipeline</div>
//                     {Object.entries(dist?.status ?? {}).map(([s, n]) => (
//                         <HBar key={s} label={s} value={n} max={totalLeads} color={STATUS_COLORS[s] ?? "#8da898"} />
//                     ))}
//                     {!Object.keys(dist?.status ?? {}).length && <p className="text-[11px] text-[#b0c8bc] italic">No data</p>}
//                 </div>

//                 <div className="bg-white rounded-2xl border border-[#ddeae2] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
//                     <div className="text-[13px] font-semibold text-[#1c3a3a] mb-1">Lead Sources</div>
//                     <div className="text-[11px] text-[#7a9088] mb-4">Acquisition channels</div>
//                     {Object.entries(dist?.source ?? {}).sort(([, a], [, b]) => b - a).map(([src, n], i) => (
//                         <HBar key={src} label={src} value={n} max={totalLeads} color={SOURCE_COLORS[i % SOURCE_COLORS.length]} />
//                     ))}
//                     {!Object.keys(dist?.source ?? {}).length && <p className="text-[11px] text-[#b0c8bc] italic">No data</p>}
//                 </div>
//             </div>

//             {/* Therapist performance */}
//             <div className="bg-white rounded-2xl border border-[#ddeae2] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
//                 <div className="text-[13px] font-semibold text-[#1c3a3a] mb-1">Therapist Performance</div>
//                 <div className="text-[11px] text-[#7a9088] mb-4">Sessions, hours, and output</div>
//                 {(dist?.therapist ?? []).length === 0 ? (
//                     <p className="text-[11px] text-[#b0c8bc] italic">No session data yet</p>
//                 ) : (
//                     <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
//                         {(dist?.therapist ?? []).sort((a, b) => b.sessions - a.sessions).map((t, i) => {
//                             const colors = ["#4e8c6a", "#3d8b8b", "#7b6fa9", "#8b6e3d"];
//                             const c = colors[i % colors.length];
//                             const hours = Math.round((t.totalMinutes / 60) * 10) / 10;
//                             return (
//                                 <div key={t.name} className="p-4 rounded-xl border border-[#e8f0ec] bg-[#f7faf8]">
//                                     <div className="flex items-center gap-2 mb-3">
//                                         <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white" style={{ background: c }}>
//                                             {t.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
//                                         </div>
//                                         <div>
//                                             <div className="text-[12px] font-semibold text-[#1c3a3a]">{t.name}</div>
//                                             <div className="text-[10px] text-[#7a9088]">Therapist</div>
//                                         </div>
//                                     </div>
//                                     <div className="grid grid-cols-2 gap-2">
//                                         <div className="text-center">
//                                             <div className="text-[18px] font-bold" style={{ color: c }}>{t.sessions}</div>
//                                             <div className="text-[9px] text-[#7a9088] uppercase tracking-wide">Sessions</div>
//                                         </div>
//                                         <div className="text-center">
//                                             <div className="text-[18px] font-bold text-[#1c3a3a]">{hours}h</div>
//                                             <div className="text-[9px] text-[#7a9088] uppercase tracking-wide">Total hrs</div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 )}
//             </div>

//             {/* Monthly leads trend */}
//             <div className="bg-white rounded-2xl border border-[#ddeae2] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
//                 <div className="flex items-center justify-between mb-4">
//                     <div>
//                         <div className="text-[13px] font-semibold text-[#1c3a3a]">Lead Acquisition Trend</div>
//                         <div className="text-[11px] text-[#7a9088]">New leads per month</div>
//                     </div>
//                     <div className="text-[18px] font-bold text-[#1c3a3a]">
//                         {(ch?.monthlyLeads ?? []).reduce((s, d) => s + d.count, 0)} leads (6mo)
//                     </div>
//                 </div>
//                 <AreaLine data={(ch?.monthlyLeads ?? []).map(d => d.count)} color="#3d8b8b" height={90} />
//                 <div className="flex justify-between mt-1">
//                     {(ch?.monthlyLeads ?? []).map((d, i) => (
//                         <span key={i} className="text-[9px] text-[#8da898]">{shortMonth(d.month)}</span>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }

"use client";

// app/admin/analytics/page.tsx
import { useState, useEffect, useCallback } from "react";
import { RefreshCw, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface AnalyticsData {
    overview: {
        totalLeads: number; newLeads: number; bookedLeads: number;
        conversionRate: number; totalSessions: number; thisMonthSessions: number;
        sessionGrowth: number | null; noShows: number; noShowRate: number;
        totalPaidKobo: number; thisMonthPaidKobo: number; lastMonthPaidKobo: number;
        revenueGrowth: number | null; arpu: number; upcomingCount: number;
        avgMood: number | null; pendingKobo: number;
    };
    distributions: {
        band: Record<string, number>;
        status: Record<string, number>;
        source: Record<string, number>;
        therapist: { name: string; sessions: number; totalMinutes: number }[];
    };
    charts: {
        monthlyRevenue: { month: string; amountKobo: number; sessions: number }[];
        monthlyLeads: { month: string; count: number }[];
    };
    alerts: { highSeverityLeads: { id: string; name: string; score: number; band: string }[] };
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmtNaira = (kobo: number) => {
    const n = kobo / 100;
    if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}K`;
    return `₦${n.toFixed(0)}`;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const shortMonth = (ym: string) => MONTHS[parseInt(ym.split("-")[1]) - 1] ?? ym;

const BAND_COLORS: Record<string, string> = { Low: "#4e8c6a", Mild: "#3d8b8b", Moderate: "#8b6e3d", High: "#b94a4f" };
const STATUS_COLORS: Record<string, string> = { new: "#7ba98b", contacted: "#3d8b8b", booked: "#7b6fa9", inactive: "#b0b0b0", churned: "#b94a4f" };
const SOURCE_COLORS = ["#4e8c6a", "#3d8b8b", "#7b6fa9", "#8b6e3d", "#b94a4f"];

const Q_LABELS: Record<string, string> = {
    q1: "Mood", q2: "Anxiety", q3: "Energy", q4: "Sleep",
    q5: "Relationships", q6: "Stress", q7: "Self-worth", q8: "Support",
};

// ── Chart components ───────────────────────────────────────────────────────────
function AreaLine({ data, color = "#4e7a5e", height = 100 }: {
    data: number[]; color?: string; height?: number;
}) {
    if (!data.length) return <div className="flex items-center justify-center text-[#b0c8bc] text-sm" style={{ height }}>No data</div>;
    const W = 400, H = height, PAD = 8;
    const max = Math.max(...data, 1);
    const pts = data.map((v, i) => ({
        x: PAD + (i / Math.max(data.length - 1, 1)) * (W - PAD * 2),
        y: H - PAD - ((v / max) * (H - PAD * 2)),
    }));
    const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
    const area = `${line} L${pts[pts.length - 1].x},${H - PAD} L${pts[0].x},${H - PAD} Z`;
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }}>
            <defs>
                <linearGradient id={`ag${color}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.18" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.01" />
                </linearGradient>
            </defs>
            <path d={area} fill={`url(#ag${color})`} />
            <path d={line} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r={3} fill={color} />
        </svg>
    );
}

function HBar({ label, value, max, color, sub }: { label: string; value: number; max: number; color: string; sub?: string }) {
    return (
        <div className="mb-2.5">
            <div className="flex justify-between mb-1">
                <span className="text-[11px] text-[#7a9088]">{label}</span>
                <div className="flex items-center gap-2">
                    {sub && <span className="text-[10px]" style={{ color }}>{sub}</span>}
                    <span className="text-[11px] font-bold text-[#1c3a3a]">{value}</span>
                </div>
            </div>
            <div className="h-2 bg-[#f0f4f2] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${max > 0 ? (value / max) * 100 : 0}%`, background: color }} />
            </div>
        </div>
    );
}

function KpiCard({ label, value, sub, color, trend }: {
    label: string; value: string | number; sub?: string; color: string;
    trend?: { pct: string; up: boolean } | null;
}) {
    return (
        <div className="bg-white rounded-2xl border border-[#ddeae2] p-4 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
            <div className="flex items-center justify-between mb-2">
                <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                {trend && (
                    <span className={`text-[11px] font-semibold flex items-center gap-0.5 ${trend.up ? "text-[#4e8c6a]" : "text-[#b94a4f]"}`}>
                        {trend.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}{trend.pct}%
                    </span>
                )}
            </div>
            <div className="text-[20px] font-bold text-[#1c3a3a] leading-tight">{value}</div>
            <div className="text-[11px] text-[#7a9088] mt-0.5">{label}</div>
            {sub && <div className="text-[10px] mt-0.5 font-medium" style={{ color }}>{sub}</div>}
        </div>
    );
}

// ── Conversion funnel ──────────────────────────────────────────────────────────
function ConversionFunnel({ dist }: { dist: Record<string, number> }) {
    const stages = [
        { label: "Total Leads", count: Object.values(dist).reduce((a, b) => a + b, 0), color: "#7ba98b" },
        { label: "Contacted", count: (dist.contacted ?? 0) + (dist.booked ?? 0), color: "#3d8b8b" },
        { label: "Booked", count: dist.booked ?? 0, color: "#7b6fa9" },
    ];
    const max = stages[0].count || 1;
    return (
        <div className="flex flex-col gap-3">
            {stages.map((s, i) => {
                const pct = (s.count / max) * 100;
                const conv = i > 0 ? ((s.count / Math.max(stages[i - 1].count, 1)) * 100).toFixed(1) : null;
                return (
                    <div key={s.label}>
                        <div className="flex justify-between mb-1">
                            <span className="text-[12px] text-[#7a9088]">{s.label}</span>
                            <div className="flex items-center gap-2">
                                {conv && <span className="text-[10px] font-semibold" style={{ color: s.color }}>{conv}% →</span>}
                                <span className="text-[12px] font-bold text-[#1c3a3a]">{s.count}</span>
                            </div>
                        </div>
                        <div className="h-3 bg-[#f0f4f2] rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: s.color }} />
                        </div>
                    </div>
                );
            })}
            <div className="pt-3 border-t border-[#f0f4f2] flex items-center justify-between">
                <span className="text-[11px] text-[#7a9088]">Overall conversion rate</span>
                <span className="text-[18px] font-bold text-[#7b6fa9]">
                    {max > 0 ? ((stages[2].count / max) * 100).toFixed(1) : 0}%
                </span>
            </div>
        </div>
    );
}

// ── Symptom heatmap (from leads answers — aggregated server side would be ideal,
//    here we show avg per band from distributions as a proxy) ───────────────────
function BandHeatmap({ dist }: { dist: Record<string, number> }) {
    const bands = ["Low", "Mild", "Moderate", "High"];
    const total = Object.values(dist).reduce((a, b) => a + b, 0) || 1;
    return (
        <div className="grid grid-cols-2 gap-2">
            {bands.map(b => {
                const count = dist[b] ?? 0;
                const pct = (count / total) * 100;
                const color = BAND_COLORS[b];
                const intensity = pct / 100;
                return (
                    <div key={b} className="rounded-xl p-3 text-center" style={{ background: `${color}${Math.round(intensity * 50 + 10).toString(16).padStart(2, "0")}` }}>
                        <div className="text-[10px] text-[#7a9088] mb-0.5">{b}</div>
                        <div className="text-[18px] font-bold" style={{ color }}>{count}</div>
                        <div className="text-[10px] mt-0.5" style={{ color }}>{pct.toFixed(0)}%</div>
                        <div className="mt-1.5 h-[2px] bg-white/40 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ── Revenue vs sessions dual chart ────────────────────────────────────────────
function DualChart({ data }: { data: { month: string; amountKobo: number; sessions: number }[] }) {
    if (!data.length) return <div className="h-[100px] flex items-center justify-center text-[#b0c8bc] text-sm">No data</div>;
    const maxRev = Math.max(...data.map(d => d.amountKobo), 1);
    const maxSess = Math.max(...data.map(d => d.sessions), 1);
    const W = 460, H = 100, PAD = 10;

    const revPts = data.map((d, i) => ({
        x: PAD + (i / Math.max(data.length - 1, 1)) * (W - PAD * 2),
        y: H - PAD - ((d.amountKobo / maxRev) * (H - PAD * 2)),
    }));
    const sessPts = data.map((d, i) => ({
        x: PAD + (i / Math.max(data.length - 1, 1)) * (W - PAD * 2),
        y: H - PAD - ((d.sessions / maxSess) * (H - PAD * 2)),
    }));

    const revLine = revPts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
    const sessLine = sessPts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

    return (
        <div>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 100 }}>
                <path d={revLine} fill="none" stroke="#4e7a5e" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                <path d={sessLine} fill="none" stroke="#7b6fa9" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 2" />
                {data.map((d, i) => (
                    <text key={i} x={revPts[i].x} y={H} textAnchor="middle" fontSize={9} fill="#8da898">{shortMonth(d.month)}</text>
                ))}
            </svg>
            <div className="flex gap-4 mt-1">
                <div className="flex items-center gap-1.5"><div className="w-8 h-[2px] bg-[#4e7a5e] rounded" /><span className="text-[10px] text-[#7a9088]">Revenue</span></div>
                <div className="flex items-center gap-1.5"><div className="w-8 h-[2px] bg-[#7b6fa9] rounded" style={{ backgroundImage: "repeating-linear-gradient(90deg,#7b6fa9 0,#7b6fa9 4px,transparent 4px,transparent 6px)" }} /><span className="text-[10px] text-[#7a9088]">Sessions</span></div>
            </div>
        </div>
    );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/analytics");
            const json = await res.json();
            if (json.success) setData(json);
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 rounded-full border-2 border-[#4e8c6a] border-t-transparent animate-spin" />
        </div>
    );

    const ov = data?.overview;
    const dist = data?.distributions;
    const ch = data?.charts;

    const fmtTrend = (n: number | null | undefined) => {
        if (n === null || n === undefined) return null;
        return { pct: Math.abs(n).toFixed(1), up: n >= 0 };
    };

    const totalLeads = Object.values(dist?.band ?? {}).reduce((a, b) => a + b, 0);

    return (
        <div className="flex flex-col gap-5 max-w-[1300px]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[18px] font-bold text-[#1c3a3a]">Analytics</h1>
                    <p className="text-[12px] text-[#7a9088]">Deep insights across your practice</p>
                </div>
                <button onClick={fetchData} className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#ddeae2] rounded-xl text-[12px] text-[#7a9088] cursor-pointer hover:bg-[#f7faf8]">
                    <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
                </button>
            </div>

            {/* KPI row */}
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
                <KpiCard label="Conversion Rate" value={`${(ov?.conversionRate ?? 0).toFixed(1)}%`} color="#7b6fa9" sub="leads → booked" trend={null} />
                <KpiCard label="Revenue Growth" value={ov?.revenueGrowth != null ? `${ov.revenueGrowth > 0 ? "+" : ""}${ov.revenueGrowth.toFixed(1)}%` : "—"} color="#4e7a5e" sub="vs last month" trend={fmtTrend(ov?.revenueGrowth)} />
                <KpiCard label="Avg. Session Revenue" value={fmtNaira(ov?.arpu ?? 0)} color="#8b6e3d" sub="per session" trend={null} />
                <KpiCard label="No-Show Rate" value={`${(ov?.noShowRate ?? 0).toFixed(1)}%`} color={(ov?.noShowRate ?? 0) > 15 ? "#b94a4f" : "#4e7a5e"} sub={`${ov?.noShows ?? 0} total`} trend={null} />
                <KpiCard label="Avg. Client Mood" value={ov?.avgMood ? `${ov.avgMood.toFixed(1)}/5` : "—"} color="#3d8b8b" sub="post-session" trend={null} />
                <KpiCard label="Total Revenue" value={fmtNaira(ov?.totalPaidKobo ?? 0)} color="#4e7a5e" sub="all time paid" trend={fmtTrend(ov?.revenueGrowth)} />
            </div>

            {/* Revenue + sessions dual chart */}
            <div className="grid gap-4" style={{ gridTemplateColumns: "2fr 1fr" }}>
                <div className="bg-white rounded-2xl border border-[#ddeae2] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
                    <div className="text-[13px] font-semibold text-[#1c3a3a] mb-1">Revenue vs Sessions</div>
                    <div className="text-[11px] text-[#7a9088] mb-4">6-month trend overlay</div>
                    <DualChart data={ch?.monthlyRevenue ?? []} />
                </div>

                {/* Conversion funnel */}
                <div className="bg-white rounded-2xl border border-[#ddeae2] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
                    <div className="text-[13px] font-semibold text-[#1c3a3a] mb-1">Conversion Funnel</div>
                    <div className="text-[11px] text-[#7a9088] mb-4">Lead journey stages</div>
                    <ConversionFunnel dist={dist?.status ?? {}} />
                </div>
            </div>

            {/* Band heatmap + Status + Source */}
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
                <div className="bg-white rounded-2xl border border-[#ddeae2] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
                    <div className="text-[13px] font-semibold text-[#1c3a3a] mb-1">Severity Distribution</div>
                    <div className="text-[11px] text-[#7a9088] mb-4">{totalLeads} total leads</div>
                    <BandHeatmap dist={dist?.band ?? {}} />
                </div>

                <div className="bg-white rounded-2xl border border-[#ddeae2] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
                    <div className="text-[13px] font-semibold text-[#1c3a3a] mb-1">Status Breakdown</div>
                    <div className="text-[11px] text-[#7a9088] mb-4">Current pipeline</div>
                    {Object.entries(dist?.status ?? {}).map(([s, n]) => (
                        <HBar key={s} label={s} value={n} max={totalLeads} color={STATUS_COLORS[s] ?? "#8da898"} />
                    ))}
                    {!Object.keys(dist?.status ?? {}).length && <p className="text-[11px] text-[#b0c8bc] italic">No data</p>}
                </div>

                <div className="bg-white rounded-2xl border border-[#ddeae2] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
                    <div className="text-[13px] font-semibold text-[#1c3a3a] mb-1">Lead Sources</div>
                    <div className="text-[11px] text-[#7a9088] mb-4">Acquisition channels</div>
                    {Object.entries(dist?.source ?? {}).sort(([, a], [, b]) => b - a).map(([src, n], i) => (
                        <HBar key={src} label={src} value={n} max={totalLeads} color={SOURCE_COLORS[i % SOURCE_COLORS.length]} />
                    ))}
                    {!Object.keys(dist?.source ?? {}).length && <p className="text-[11px] text-[#b0c8bc] italic">No data</p>}
                </div>
            </div>

            {/* Therapist performance */}
            <div className="bg-white rounded-2xl border border-[#ddeae2] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
                <div className="text-[13px] font-semibold text-[#1c3a3a] mb-1">Therapist Performance</div>
                <div className="text-[11px] text-[#7a9088] mb-4">Sessions, hours, and output</div>
                {(dist?.therapist ?? []).length === 0 ? (
                    <p className="text-[11px] text-[#b0c8bc] italic">No session data yet</p>
                ) : (
                    <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
                        {(dist?.therapist ?? []).sort((a, b) => b.sessions - a.sessions).map((t, i) => {
                            const colors = ["#4e8c6a", "#3d8b8b", "#7b6fa9", "#8b6e3d"];
                            const c = colors[i % colors.length];
                            const hours = Math.round((t.totalMinutes / 60) * 10) / 10;
                            return (
                                <div key={t.name} className="p-4 rounded-xl border border-[#e8f0ec] bg-[#f7faf8]">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white" style={{ background: c }}>
                                            {t.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-[12px] font-semibold text-[#1c3a3a] truncate">{t.name}</div>
                                            <div className="text-[10px] text-[#7a9088]">Therapist</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="text-center">
                                            <div className="text-[18px] font-bold" style={{ color: c }}>{t.sessions}</div>
                                            <div className="text-[9px] text-[#7a9088] uppercase tracking-wide">Sessions</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-[18px] font-bold text-[#1c3a3a]">{hours}h</div>
                                            <div className="text-[9px] text-[#7a9088] uppercase tracking-wide">Total hrs</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Monthly leads trend */}
            <div className="bg-white rounded-2xl border border-[#ddeae2] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="text-[13px] font-semibold text-[#1c3a3a]">Lead Acquisition Trend</div>
                        <div className="text-[11px] text-[#7a9088]">New leads per month</div>
                    </div>
                    <div className="text-[18px] font-bold text-[#1c3a3a]">
                        {(ch?.monthlyLeads ?? []).reduce((s, d) => s + d.count, 0)} leads (6mo)
                    </div>
                </div>
                <AreaLine data={(ch?.monthlyLeads ?? []).map(d => d.count)} color="#3d8b8b" height={90} />
                <div className="flex justify-between mt-1">
                    {(ch?.monthlyLeads ?? []).map((d, i) => (
                        <span key={i} className="text-[9px] text-[#8da898]">{shortMonth(d.month)}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}