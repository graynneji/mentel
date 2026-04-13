"use client";

// app/hr/analytics/page.tsx
// Full analytics detail — all domain charts, trend data, department breakdowns.
// Download report button. Everything anonymised.

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Download, RefreshCw, Shield, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";

interface Analytics {
    company: { name: string; plan: string };
    overview: { totalEnrolled: number; assessedCount: number; avgImprovement: number; sessionsUsedTotal: number };
    domainAverages: { domain: string; label: string; score: number; trend: number }[];
    trend: { month: string; avgScore: number }[];
    riskDistribution: { band: string; count: number; pct: number }[];
    departmentData: { department: string; avgScore: number; count: number; sessionsUsed: number }[];
}

const BAND_COLORS: Record<string, string> = {
    Low: "#4e8c6a", Mild: "#3d8b8b", Moderate: "#8b6e3d", High: "#b94a4f", Critical: "#8b1a1a",
};

export default function HRAnalyticsPage() {
    const router = useRouter();
    const [data, setData] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        fetch("/api/hr/analytics")
            .then(r => {
                if (r.status === 401) { router.push("/hr/access"); return null; }
                return r.json();
            })
            .then(j => { if (j?.success) setData(j); })
            .finally(() => setLoading(false));
    }, [router]);

    const handleDownload = async () => {
        setDownloading(true);
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
        setDownloading(false);
    };

    if (loading) {
        return (
            <div className="flex flex-col gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="animate-pulse rounded-2xl h-32 bg-[#e8f0ec]" />
                ))}
            </div>
        );
    }

    if (!data) return (
        <div className="text-center py-20">
            <p style={{ color: "#7a9088" }}>Failed to load analytics.</p>
        </div>
    );

    return (
        <div className="flex flex-col gap-4 sm:gap-5 pb-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-[18px] sm:text-[20px] font-bold" style={{ color: "#1c3a3a" }}>Full Analytics</h1>
                    <p className="text-[12px] mt-0.5" style={{ color: "#7a9088" }}>{data.company.name} · Anonymised aggregate data</p>
                </div>
                <button onClick={handleDownload} disabled={downloading}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-medium text-white self-start sm:self-auto"
                    style={{ background: "linear-gradient(135deg, #4e8c6a, #3d8b8b)" }}>
                    {downloading ? <RefreshCw size={13} className="animate-spin" /> : <Download size={13} />}
                    Download PDF Report
                </button>
            </div>

            {/* Domain deep-dive */}
            <div className="bg-white rounded-2xl border p-4 sm:p-6" style={{ borderColor: "#e4eee8" }}>
                <div className="text-[14px] font-semibold mb-1" style={{ color: "#1c3a3a" }}>Domain Score Detail</div>
                <div className="text-[11px] mb-5" style={{ color: "#7a9088" }}>
                    Population average per wellbeing domain. Numbers represent distress level (0–100, lower is better).
                </div>
                <div className="space-y-5">
                    {data.domainAverages.map(d => {
                        const level = d.score < 30 ? "Low" : d.score < 50 ? "Mild" : d.score < 70 ? "Moderate" : "High";
                        const color = BAND_COLORS[level];
                        const improving = d.trend < 0;
                        return (
                            <div key={d.domain}>
                                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[13px] font-semibold" style={{ color: "#1c3a3a" }}>{d.label}</span>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                                            style={{ background: `${color}18`, color }}>{level}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[12px] font-semibold flex items-center gap-0.5 ${improving ? "text-[#4e8c6a]" : "text-[#b94a4f]"}`}>
                                            {improving ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                                            {Math.abs(d.trend)}% vs last month
                                        </span>
                                        <span className="text-[16px] font-bold" style={{ fontFamily: "Georgia", color }}>{d.score}</span>
                                    </div>
                                </div>
                                <div className="h-3 rounded-full overflow-hidden" style={{ background: "#f0f7f3" }}>
                                    <div className="h-full rounded-full transition-all duration-700"
                                        style={{ width: `${d.score}%`, background: `linear-gradient(90deg, ${color}99, ${color})` }} />
                                </div>
                                <div className="flex justify-between mt-1">
                                    <span className="text-[9px]" style={{ color: "#b0c8bc" }}>0 — No concern</span>
                                    <span className="text-[9px]" style={{ color: "#b0c8bc" }}>100 — Severe</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Risk breakdown table */}
            <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#e4eee8" }}>
                <div className="p-4 sm:p-5 border-b" style={{ borderColor: "#f0f7f3" }}>
                    <div className="text-[14px] font-semibold" style={{ color: "#1c3a3a" }}>Risk Band Breakdown</div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr style={{ background: "#f7faf8" }}>
                                {["Band", "Employees", "Proportion", "Status"].map(h => (
                                    <th key={h} className="text-left px-4 sm:px-5 py-3 text-[10px] uppercase tracking-widest"
                                        style={{ color: "#7a9088" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.riskDistribution.map((d, i) => (
                                <tr key={d.band} style={{ background: i % 2 === 0 ? "white" : "#f9fdfb" }}>
                                    <td className="px-4 sm:px-5 py-3">
                                        <span className="text-[12px] font-semibold" style={{ color: BAND_COLORS[d.band] }}>{d.band}</span>
                                    </td>
                                    <td className="px-4 sm:px-5 py-3 text-[12px]" style={{ color: "#1c3a3a" }}>{d.count}</td>
                                    <td className="px-4 sm:px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 sm:w-28 h-2 rounded-full overflow-hidden" style={{ background: "#f0f7f3" }}>
                                                <div className="h-full rounded-full" style={{ width: `${d.pct}%`, background: BAND_COLORS[d.band] }} />
                                            </div>
                                            <span className="text-[12px]" style={{ color: "#7a9088" }}>{d.pct}%</span>
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-5 py-3 text-[11px]" style={{ color: "#7a9088" }}>
                                        {d.band === "High" || d.band === "Critical"
                                            ? "Clinical team contacted"
                                            : d.band === "Low" ? "Healthy — monitoring"
                                                : "Support available"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Department comparison */}
            {data.departmentData.length > 0 && (
                <div className="bg-white rounded-2xl border p-4 sm:p-5" style={{ borderColor: "#e4eee8" }}>
                    <div className="text-[14px] font-semibold mb-1" style={{ color: "#1c3a3a" }}>Department Comparison</div>
                    <div className="text-[11px] mb-4" style={{ color: "#7a9088" }}>
                        Average risk score per department (shown for teams of 5+)
                    </div>
                    <div className="space-y-3">
                        {data.departmentData
                            .sort((a, b) => b.avgScore - a.avgScore)
                            .map(d => {
                                const level = d.avgScore < 30 ? "Low" : d.avgScore < 50 ? "Mild" : d.avgScore < 70 ? "Moderate" : "High";
                                const color = BAND_COLORS[level];
                                return (
                                    <div key={d.department} className="flex items-center gap-3">
                                        <div className="w-24 sm:w-32 text-[11px] truncate" style={{ color: "#7a9088" }}>{d.department}</div>
                                        <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: "#f0f7f3" }}>
                                            <div className="h-full rounded-full" style={{ width: `${d.avgScore}%`, background: color }} />
                                        </div>
                                        <span className="text-[11px] font-bold w-8 text-right" style={{ color }}>{d.avgScore}</span>
                                        <span className="text-[10px] w-16 text-right hidden sm:block" style={{ color: "#b0c8bc" }}>
                                            {d.count} employees
                                        </span>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}

            {/* Privacy footer */}
            <div className="flex items-start gap-2 px-1">
                <Shield size={12} style={{ color: "#b0c8bc", flexShrink: 0, marginTop: 2 }} />
                <p className="text-[11px]" style={{ color: "#b0c8bc" }}>
                    All data shown is anonymised aggregate only. Individual employee responses, assessment answers,
                    and therapy notes are never accessible to HR or employer representatives.
                    Department data is suppressed for groups smaller than 5 employees.
                </p>
            </div>
        </div>
    );
}