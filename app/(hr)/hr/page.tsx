

"use client";

// app/hr/page.tsx — HR Dashboard with live API data
// Fetches from /api/hr/analytics, handles loading/error states fully.
// Fully responsive (mobile-first).

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
    Users, TrendingDown, TrendingUp, AlertTriangle, CheckCircle,
    BarChart2, ChevronRight, RefreshCw, Shield, Download,
    Brain, Heart, Flame, Moon, Star, FileText,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

export interface Analytics {
    company: { name: string; plan: string; planSeats: number; sessionCap: number; planRenewAt: string; status: string };
    overview: {
        totalEnrolled: number; assessedCount: number; assessmentRate: number;
        activeThisMonth: number; sessionsUsedTotal: number; sessionsAvailable: number;
        avgImprovement: number; atRiskCount: number; atRiskPct: number;
    };
    riskDistribution: { band: string; count: number; pct: number }[];
    domainAverages: { domain: string; score: number; label: string; trend: number }[];
    trend: { month: string; avgScore: number; enrolled: number }[];
    departmentData: { department: string; avgScore: number; count: number; sessionsUsed: number; sessionsAvailable: number }[];
    privacyNote: string;
}

const BAND_COLORS: Record<string, string> = {
    Low: "#4e8c6a", Mild: "#3d8b8b", Moderate: "#8b6e3d", High: "#b94a4f", Critical: "#8b1a1a",
};

const DOMAIN_ICONS: Record<string, React.ElementType> = {
    stress: Brain, burnout: Flame, anxiety: Brain, depression: Moon,
    sleep: Moon, selfesteem: Star, relationships: Heart,
};

// ── Sub-components ────────────────────────────────────────────────────────────

function KPI({ label, value, sub, trend, href }: {
    label: string; value: string | number; sub?: string; trend?: number | null; href?: string;
}) {
    const inner = (
        <div className="bg-white rounded-2xl border p-4 sm:p-5 group hover:shadow-md transition-shadow cursor-pointer"
            style={{ borderColor: "#e4eee8" }}>
            <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-widest leading-tight"
                    style={{ color: "#7a9088" }}>{label}</span>
                {trend !== null && trend !== undefined && (
                    <span className={`text-[10px] font-semibold flex items-center gap-0.5 shrink-0 ${trend < 0 ? "text-[#4e8c6a]" : "text-[#b94a4f]"}`}>
                        {trend < 0 ? <TrendingDown size={10} /> : <TrendingUp size={10} />}
                        {Math.abs(trend)}%
                    </span>
                )}
            </div>
            <div className="text-[22px] sm:text-[26px] font-bold leading-none mb-1"
                style={{ fontFamily: "Georgia, serif", color: "#1c3a3a" }}>{value}</div>
            {sub && <div className="text-[11px]" style={{ color: "#7a9088" }}>{sub}</div>}
        </div>
    );
    return href ? <Link href={href}>{inner}</Link> : inner;
}

function RiskDonut({ dist }: { dist: { band: string; count: number; pct: number }[] }) {
    const total = dist.reduce((s, d) => s + d.count, 0) || 1;
    const R = 40, cx = 50, cy = 50, sw = 14;
    const circ = 2 * Math.PI * R;
    let offset = 0;
    return (
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
            <svg width={100} height={100} viewBox="0 0 100 100" className="shrink-0">
                <circle cx={cx} cy={cy} r={R} fill="none" stroke="#f0f7f3" strokeWidth={sw} />
                {dist.map(({ band, pct }) => {
                    const dash = circ * (pct / 100);
                    const el = (
                        <circle key={band} cx={cx} cy={cy} r={R} fill="none"
                            stroke={BAND_COLORS[band] ?? "#8da898"} strokeWidth={sw}
                            strokeDasharray={`${dash} ${circ - dash}`}
                            strokeDashoffset={-offset}
                            style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }}
                        />
                    );
                    offset += dash;
                    return el;
                })}
                <text x={cx} y={cy + 2} textAnchor="middle" dominantBaseline="middle"
                    style={{ fontSize: 14, fontWeight: 700, fill: "#1c3a3a", fontFamily: "Georgia" }}>{total}</text>
                <text x={cx} y={cy + 15} textAnchor="middle" dominantBaseline="middle"
                    style={{ fontSize: 8, fill: "#7a9088" }}>employees</text>
            </svg>
            <div className="flex flex-col gap-2 w-full">
                {dist.map(d => (
                    <div key={d.band} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: BAND_COLORS[d.band] }} />
                        <span className="text-[11px] flex-1" style={{ color: "#7a9088" }}>{d.band}</span>
                        <span className="text-[11px] font-bold" style={{ color: "#1c3a3a" }}>{d.count}</span>
                        <span className="text-[10px] w-9 text-right" style={{ color: "#b0c8bc" }}>{d.pct}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TrendChart({ data }: { data: { month: string; avgScore: number }[] }) {
    if (!data.length) return <div className="h-[80px] flex items-center justify-center text-[#b0c8bc] text-xs">No data yet</div>;
    const W = 400, H = 80, PAD = 12;
    const maxV = Math.max(...data.map(d => d.avgScore), 1);
    const pts = data.filter(d => d.avgScore > 0).map((d, i) => ({
        x: PAD + (i / Math.max(data.length - 1, 1)) * (W - PAD * 2),
        y: H - PAD - (d.avgScore / maxV) * (H - PAD * 2),
        ...d,
    }));
    if (pts.length < 2) return <div className="h-[80px] flex items-center justify-center text-[#b0c8bc] text-xs">Collecting data…</div>;
    const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
    const area = `${line} L${pts[pts.length - 1].x},${H - PAD} L${pts[0].x},${H - PAD} Z`;
    const improving = pts[pts.length - 1].avgScore < pts[0].avgScore;
    const color = improving ? "#4e8c6a" : "#b94a4f";
    return (
        <div>
            <div className="flex items-center gap-1.5 mb-1.5">
                <span className={`text-[11px] font-semibold flex items-center gap-0.5 ${improving ? "text-[#4e8c6a]" : "text-[#b94a4f]"}`}>
                    {improving ? <TrendingDown size={11} /> : <TrendingUp size={11} />}
                    {improving ? "Improving" : "Monitor closely"}
                </span>
                <span className="text-[10px]" style={{ color: "#b0c8bc" }}>average risk score (lower = better)</span>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 80 }}>
                <defs>
                    <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.15" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.01" />
                    </linearGradient>
                </defs>
                <path d={area} fill="url(#tg)" />
                <path d={line} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                {pts.map((p, i) => (
                    <g key={i}>
                        <circle cx={p.x} cy={p.y} r={3} fill={color} />
                        <text x={p.x} y={H} textAnchor="middle" style={{ fontSize: 9, fill: "#8da898" }}>{p.month}</text>
                    </g>
                ))}
            </svg>
        </div>
    );
}

function DomainBar({ domain, score, label, trend }: { domain: string; score: number; label: string; trend: number }) {
    const Icon = DOMAIN_ICONS[domain] ?? Brain;
    const level = score < 30 ? "Low" : score < 50 ? "Mild" : score < 70 ? "Moderate" : "High";
    const color = BAND_COLORS[level] ?? "#8da898";
    const improving = trend < 0;
    return (
        <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "rgba(78,140,106,0.1)" }}>
                <Icon size={12} style={{ color: "#4e8c6a" }} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1 gap-2">
                    <span className="text-[11px] font-medium truncate" style={{ color: "#1c3a3a" }}>{label}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[10px] font-semibold ${improving ? "text-[#4e8c6a]" : "text-[#b94a4f]"}`}>
                            {improving ? "▼" : "▲"}{Math.abs(trend)}%
                        </span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                            style={{ background: `${color}18`, color }}>{level}</span>
                    </div>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "#f0f7f3" }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, background: color }} />
                </div>
            </div>
        </div>
    );
}

// ── Skeleton loader ────────────────────────────────────────────────────────────

function Skeleton({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) {
    return (
        <div className={`animate-pulse rounded-xl ${className}`}
            style={{ background: "#e8f0ec", ...style }} />
    );
}

// ── Main dashboard ─────────────────────────────────────────────────────────────

export default function HRDashboard() {
    const [data, setData] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [downloadingReport, setDownloadingReport] = useState(false);

    const load = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        else setRefreshing(true);
        setError("");
        try {
            const res = await fetch("/api/hr/analytics");
            if (res.status === 401) {
                window.location.href = "/hr/access";
                return;
            }
            const json = await res.json();
            if (json.success) setData(json);
            else setError(json.error ?? "Failed to load data.");
        } catch {
            setError("Connection error. Please refresh.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleDownloadReport = async () => {
        setDownloadingReport(true);
        try {
            const res = await fetch("/api/hr/report?format=html");
            if (res.ok) {
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `mentel-eap-report-${new Date().toISOString().split("T")[0]}.html`;
                a.click();
                URL.revokeObjectURL(url);
            }
        } finally {
            setDownloadingReport(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div><Skeleton className="h-6 w-40 mb-2" /><Skeleton className="h-4 w-64" /></div>
                </div>
                <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48" />)}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <AlertTriangle size={32} style={{ color: "#b94a4f" }} />
                <p className="text-[14px]" style={{ color: "#7a9088" }}>{error}</p>
                <button onClick={() => load()} className="px-4 py-2 rounded-xl text-[12px] text-white"
                    style={{ background: "#4e8c6a" }}>
                    Try again
                </button>
            </div>
        );
    }

    if (!data) return null;
    const { company, overview: ov, riskDistribution, domainAverages, trend, departmentData } = data;

    return (
        <div className="flex flex-col gap-4 sm:gap-5 pb-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-[18px] sm:text-[20px] font-bold" style={{ color: "#1c3a3a" }}>
                        Wellbeing Overview
                    </h1>
                    <p className="text-[11px] sm:text-[12px] mt-0.5" style={{ color: "#7a9088" }}>
                        {company.name} · {company.plan} plan · Refreshed daily
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={handleDownloadReport} disabled={downloadingReport}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium border transition-colors hover:bg-gray-50 disabled:opacity-50"
                        style={{ borderColor: "#ddeae2", color: "#4e8c6a", background: "white" }}>
                        {downloadingReport ? <RefreshCw size={12} className="animate-spin" /> : <Download size={12} />}
                        <span className="hidden sm:inline">Download Report</span>
                        <span className="sm:hidden">Report</span>
                    </button>
                    <button onClick={() => load(true)} disabled={refreshing}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] border transition-colors hover:bg-gray-50"
                        style={{ borderColor: "#ddeae2", color: "#7a9088", background: "white" }}>
                        <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
                        <span className="hidden sm:inline">Refresh</span>
                    </button>
                    <div className="flex items-center gap-1.5 text-[11px] px-2.5 py-2 rounded-xl"
                        style={{ background: "rgba(78,140,106,0.08)", color: "#2d6648", border: "1px solid rgba(78,140,106,0.2)" }}>
                        <Shield size={11} />
                        <span className="hidden sm:inline">Anonymised data only</span>
                        <span className="sm:hidden">Anonymised</span>
                    </div>
                </div>
            </div>

            {/* At-risk alert */}
            {ov.atRiskCount > 0 && (
                <div className="rounded-2xl border p-3 sm:p-4 flex items-start gap-3"
                    style={{ background: "rgba(185,74,79,0.04)", borderColor: "rgba(185,74,79,0.2)" }}>
                    <AlertTriangle size={15} style={{ color: "#b94a4f", flexShrink: 0, marginTop: 1 }} />
                    <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold" style={{ color: "#1c3a3a" }}>
                            {ov.atRiskCount} {ov.atRiskCount === 1 ? "employee" : "employees"} ({ov.atRiskPct}%) in High or Critical band
                        </p>
                        <p className="text-[11px] font-light mt-0.5" style={{ color: "#7a9088" }}>
                            Mentel's clinical team has already contacted these individuals. No action needed from HR.
                        </p>
                    </div>
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full text-white shrink-0"
                        style={{ background: "#b94a4f" }}>Being supported</span>
                </div>
            )}

            {/* KPI cards — 2 columns mobile, 4 desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                <KPI label="Enrolled" value={ov.totalEnrolled} sub={`of ${company.planSeats} seats`} trend={null} href="/hr/employees" />
                <KPI label="Assessment rate" value={`${ov.assessmentRate}%`} sub={`${ov.assessedCount} completed`} trend={null} />
                <KPI label="Sessions used" value={ov.sessionsUsedTotal} sub={`${ov.sessionsAvailable} remaining`} trend={null} href="/hr/analytics" />
                <KPI label="Avg improvement" value={`${ov.avgImprovement}%`} sub="vs first assessment" trend={-ov.avgImprovement} />
            </div>

            {/* Charts grid — 1 col mobile, 2 col tablet+ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Risk distribution */}
                <div className="bg-white rounded-2xl border p-4 sm:p-5" style={{ borderColor: "#e4eee8" }}>
                    <div className="text-[13px] font-semibold mb-0.5" style={{ color: "#1c3a3a" }}>Risk Band Distribution</div>
                    <div className="text-[11px] mb-4" style={{ color: "#7a9088" }}>All enrolled employees by wellbeing level</div>
                    <RiskDonut dist={riskDistribution} />
                </div>

                {/* Score trend */}
                <div className="bg-white rounded-2xl border p-4 sm:p-5" style={{ borderColor: "#e4eee8" }}>
                    <div className="text-[13px] font-semibold mb-0.5" style={{ color: "#1c3a3a" }}>Population Risk Trend</div>
                    <div className="text-[11px] mb-4" style={{ color: "#7a9088" }}>Average composite score over 6 months (lower = better)</div>
                    <TrendChart data={trend} />
                </div>

                {/* Domain averages */}
                <div className="bg-white rounded-2xl border p-4 sm:p-5" style={{ borderColor: "#e4eee8" }}>
                    <div className="flex items-start justify-between gap-2 mb-4">
                        <div>
                            <div className="text-[13px] font-semibold" style={{ color: "#1c3a3a" }}>Domain Averages</div>
                            <div className="text-[11px]" style={{ color: "#7a9088" }}>Population mean per wellbeing area</div>
                        </div>
                        <Link href="/hr/analytics" className="text-[11px]" style={{ color: "#4e8c6a" }}>
                            Detail →
                        </Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        {domainAverages.map(d => <DomainBar key={d.domain} {...d} />)}
                    </div>
                </div>

                {/* Dept session utilisation */}
                <div className="bg-white rounded-2xl border p-4 sm:p-5" style={{ borderColor: "#e4eee8" }}>
                    <div className="text-[13px] font-semibold mb-0.5" style={{ color: "#1c3a3a" }}>Session Utilisation</div>
                    <div className="text-[11px] mb-4" style={{ color: "#7a9088" }}>By department — groups of 5+ only</div>
                    {departmentData.length === 0 ? (
                        <div className="text-[12px] text-center py-6" style={{ color: "#b0c8bc" }}>
                            Data available once departments have 5+ assessed employees.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3.5">
                            {departmentData.map(d => {
                                const total = d.sessionsUsed + Math.round(d.sessionsAvailable);
                                const pct = total > 0 ? Math.round((d.sessionsUsed / total) * 100) : 0;
                                const color = pct > 80 ? "#b94a4f" : pct > 60 ? "#8b6e3d" : "#4e8c6a";
                                return (
                                    <div key={d.department}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-[11px]" style={{ color: "#7a9088" }}>{d.department}</span>
                                            <span className="text-[11px] font-bold" style={{ color: "#1c3a3a" }}>
                                                {d.sessionsUsed} <span style={{ color: "#b0c8bc", fontWeight: 400 }}>sessions</span>
                                            </span>
                                        </div>
                                        <div className="h-2 rounded-full overflow-hidden" style={{ background: "#f0f7f3" }}>
                                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    <div className="mt-4 pt-4 border-t flex justify-between" style={{ borderColor: "#f0f7f3" }}>
                        <span className="text-[11px]" style={{ color: "#7a9088" }}>Total sessions used</span>
                        <span className="text-[13px] font-bold" style={{ color: "#1c3a3a" }}>
                            {ov.sessionsUsedTotal}
                            <span className="text-[11px] font-light ml-1" style={{ color: "#7a9088" }}>
                                of {ov.sessionsUsedTotal + ov.sessionsAvailable}
                            </span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Improvement banner */}
            {ov.avgImprovement > 0 && (
                <div className="rounded-2xl p-4 sm:p-5 border-l-4 flex items-start gap-3"
                    style={{ background: "rgba(78,140,106,0.05)", borderLeftColor: "#4e8c6a", border: "1px solid rgba(78,140,106,0.15)" }}>
                    <CheckCircle size={16} style={{ color: "#4e8c6a", flexShrink: 0 }} />
                    <div>
                        <p className="text-[13px] font-semibold mb-0.5" style={{ color: "#1c3a3a" }}>
                            {ov.avgImprovement}% average improvement across assessed employees
                        </p>
                        <p className="text-[12px] font-light" style={{ color: "#7a9088" }}>
                            Employees who completed 3+ sessions show measurably lower risk scores than their baseline.
                            This is consistent with international EAP outcome benchmarks.
                        </p>
                    </div>
                </div>
            )}

            {/* Privacy note */}
            <div className="flex items-start gap-2 px-1">
                <Shield size={12} style={{ color: "#b0c8bc", flexShrink: 0, marginTop: 2 }} />
                <p className="text-[11px]" style={{ color: "#b0c8bc" }}>{data.privacyNote}</p>
            </div>

            {/* Quick nav */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                {[
                    { label: "Manage employees", href: "/hr/employees", desc: "Access codes & enrolment" },
                    { label: "Full analytics", href: "/hr/analytics", desc: "Detailed domain charts" },
                    { label: "Progress tracking", href: "/hr/progress", desc: "Improvement over time" },
                    { label: "Programme settings", href: "/hr/settings", desc: "Seats, sessions, focus" },
                ].map(a => (
                    <Link key={a.label} href={a.href}
                        className="bg-white rounded-2xl border p-3 sm:p-4 hover:shadow-md transition-shadow group"
                        style={{ borderColor: "#e4eee8" }}>
                        <p className="text-[12px] font-semibold mb-0.5 group-hover:text-[#4e8c6a] transition-colors"
                            style={{ color: "#1c3a3a" }}>{a.label}</p>
                        <p className="text-[10px] sm:text-[11px]" style={{ color: "#7a9088" }}>{a.desc}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}