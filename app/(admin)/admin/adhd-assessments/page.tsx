"use client";

// app/(admin)/admin/adhd-assessments/page.tsx
//
// Mirrors the layout/data-fetching conventions of app/(admin)/admin/payments/page.tsx.

import { useState, useEffect, useCallback } from "react";
import { Brain, CheckCircle, Clock, XCircle, Search, Eye, X, TrendingUp } from "lucide-react";

interface AdhdLead {
    id: string;
    createdAt: string;
    name: string;
    email: string;
    phone: string | null;
    answers: Record<string, number>;
    overallPercent: number;
    overallBand: string;
    txRef: string | null;
    planKey: string | null;
    amountCents: number | null;
    currency: string | null;
    status: string;
    paidAt: string | null;
    reportSentAt: string | null;
}

interface Analytics {
    total: number;
    page: number;
    pages: number;
    totalLeads: number;
    paidCount: number;
    paidRevenueCents: number;
    conversionRate: number;
}

const STATUS_CFG: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    lead: { bg: "#f0f4f2", text: "#4a5a52", dot: "#8da898", label: "Assessment only" },
    pending_payment: { bg: "#fff8f0", text: "#7a5a2a", dot: "#c8963d", label: "Checkout started" },
    paid: { bg: "#edf7f1", text: "#3a7a58", dot: "#7ba98b", label: "Paid" },
    failed: { bg: "#fff0f0", text: "#7a3a3a", dot: "#cf8b8b", label: "Failed" },
};

const BAND_LABEL: Record<string, string> = {
    minimal: "Minimal",
    mild: "Mild",
    moderate: "Moderate",
    significant: "Significant",
};

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
const fmtUsd = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export default function AdhdAssessmentsPage() {
    const [leads, setLeads] = useState<AdhdLead[]>([]);
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<AdhdLead | null>(null);

    const fetchLeads = useCallback(async () => {
        setLoading(true);
        const params = new URLSearchParams({ limit: "100" });
        if (statusFilter !== "all") params.set("status", statusFilter);
        if (search.trim()) params.set("search", search.trim());
        try {
            const res = await fetch(`/api/admin/adhd-assessments?${params}`);
            const data = await res.json();
            if (data.success) { setLeads(data.leads); setAnalytics(data.analytics); }
        } finally { setLoading(false); }
    }, [statusFilter, search]);

    useEffect(() => {
        const t = setTimeout(fetchLeads, search ? 350 : 0); // debounce free-text search only
        return () => clearTimeout(t);
    }, [fetchLeads, search]);

    return (
        <div className="flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#1a2e28] flex items-center gap-2">
                        <Brain size={20} className="text-[#4e8c6a]" /> ADHD Assessments
                    </h1>
                    <p className="text-[13px] text-[#6a8578]">Every completed self-assessment, and whether the report was purchased.</p>
                </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard icon={<Brain size={15} />} label="Total assessments" value={analytics?.totalLeads ?? "—"} />
                <StatCard icon={<CheckCircle size={15} />} label="Reports purchased" value={analytics?.paidCount ?? "—"} />
                <StatCard icon={<TrendingUp size={15} />} label="Conversion rate" value={analytics ? `${analytics.conversionRate}%` : "—"} />
                <StatCard icon={<TrendingUp size={15} />} label="Revenue" value={analytics ? fmtUsd(analytics.paidRevenueCents) : "—"} accent />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2.5 flex-wrap">
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8da898]" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search name or email…"
                        className="pl-9 pr-3 py-2 text-[13px] rounded-lg border border-[#dce8e1] bg-white w-[220px] focus:outline-none focus:border-[#4e8c6a]"
                    />
                </div>
                {["all", "lead", "pending_payment", "paid", "failed"].map((s) => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className="px-3 py-1.5 rounded-full text-[12.5px] font-medium border transition-colors"
                        style={
                            statusFilter === s
                                ? { background: "#1a3030", color: "white", borderColor: "#1a3030" }
                                : { background: "white", color: "#4a5a52", borderColor: "#dce8e1" }
                        }
                    >
                        {s === "all" ? "All" : STATUS_CFG[s]?.label ?? s}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-[#dce8e1] overflow-hidden">
                <table className="w-full text-[13px]">
                    <thead>
                        <tr className="bg-[#f7faf8] text-left text-[11px] uppercase tracking-wide text-[#6a8578]">
                            <th className="px-4 py-3 font-semibold">Date</th>
                            <th className="px-4 py-3 font-semibold">Name</th>
                            <th className="px-4 py-3 font-semibold">Email</th>
                            <th className="px-4 py-3 font-semibold">Overall pattern</th>
                            <th className="px-4 py-3 font-semibold">Status</th>
                            <th className="px-4 py-3 font-semibold">Amount</th>
                            <th className="px-4 py-3 font-semibold"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} className="px-4 py-10 text-center text-[#8da898]">Loading…</td></tr>
                        ) : leads.length === 0 ? (
                            <tr><td colSpan={7} className="px-4 py-10 text-center text-[#8da898]">No assessments yet.</td></tr>
                        ) : (
                            leads.map((lead) => {
                                const cfg = STATUS_CFG[lead.status] ?? STATUS_CFG.lead;
                                return (
                                    <tr key={lead.id} className="border-t border-[#eef3f0] hover:bg-[#f7faf8]">
                                        <td className="px-4 py-3 text-[#4a5a52] whitespace-nowrap">
                                            {fmtDate(lead.createdAt)}<span className="text-[#a8bdb2]"> · {fmtTime(lead.createdAt)}</span>
                                        </td>
                                        <td className="px-4 py-3 font-medium text-[#1a2e28]">{lead.name || "—"}</td>
                                        <td className="px-4 py-3 text-[#4a5a52]">{lead.email}</td>
                                        <td className="px-4 py-3 text-[#4a5a52]">
                                            {BAND_LABEL[lead.overallBand] ?? lead.overallBand} ({lead.overallPercent}%)
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-medium" style={{ background: cfg.bg, color: cfg.text }}>
                                                <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} /> {cfg.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-[#4a5a52]">
                                            {lead.amountCents ? fmtUsd(lead.amountCents) : "—"}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => setSelected(lead)} className="text-[#4e8c6a] hover:text-[#3a7a58]" aria-label={`View ${lead.name}'s answers`}>
                                                <Eye size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Detail modal */}
            {selected && <LeadDetailModal lead={selected} onClose={() => setSelected(null)} />}
        </div>
    );
}

function StatCard({ icon, label, value, accent = false }: { icon: React.ReactNode; label: string; value: string | number; accent?: boolean }) {
    return (
        <div className="bg-white rounded-xl border border-[#dce8e1] p-4">
            <div className="flex items-center gap-2 mb-2 text-[#6a8578]">
                {icon}
                <span className="text-[11.5px] font-medium uppercase tracking-wide">{label}</span>
            </div>
            <p className="text-[22px] font-semibold" style={{ color: accent ? "#3a7a58" : "#1a2e28" }}>{value}</p>
        </div>
    );
}

function LeadDetailModal({ lead, onClose }: { lead: AdhdLead; onClose: () => void }) {
    const cfg = STATUS_CFG[lead.status] ?? STATUS_CFG.lead;
    return (
        <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl max-w-[520px] w-full max-h-[85vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-5">
                    <div>
                        <h2 className="text-[17px] font-semibold text-[#1a2e28]">{lead.name || "Unnamed"}</h2>
                        <p className="text-[13px] text-[#6a8578]">{lead.email}{lead.phone ? ` · ${lead.phone}` : ""}</p>
                    </div>
                    <button onClick={onClose} aria-label="Close" className="text-[#8da898] hover:text-[#4a5a52]"><X size={18} /></button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                    <DetailRow label="Completed" value={`${fmtDate(lead.createdAt)}, ${fmtTime(lead.createdAt)}`} />
                    <DetailRow label="Overall pattern" value={`${BAND_LABEL[lead.overallBand] ?? lead.overallBand} (${lead.overallPercent}%)`} />
                    <DetailRow label="Status" value={cfg.label} />
                    <DetailRow label="Plan" value={lead.planKey ?? "—"} />
                    <DetailRow label="Amount" value={lead.amountCents ? fmtUsd(lead.amountCents) : "—"} />
                    <DetailRow label="Paid at" value={lead.paidAt ? `${fmtDate(lead.paidAt)}, ${fmtTime(lead.paidAt)}` : "—"} />
                    <DetailRow label="Report downloaded" value={lead.reportSentAt ? `${fmtDate(lead.reportSentAt)}, ${fmtTime(lead.reportSentAt)}` : "Not yet"} />
                    <DetailRow label="tx_ref" value={lead.txRef ?? "—"} mono />
                </div>

                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6a8578] mb-2">Raw answers</p>
                <div className="bg-[#f7faf8] rounded-xl p-3 max-h-[180px] overflow-y-auto">
                    <pre className="text-[11px] text-[#4a5a52] whitespace-pre-wrap break-words">{JSON.stringify(lead.answers, null, 2)}</pre>
                </div>
            </div>
        </div>
    );
}

function DetailRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
    return (
        <div>
            <p className="text-[10.5px] font-medium uppercase tracking-wide text-[#8da898] mb-0.5">{label}</p>
            <p className={`text-[13px] text-[#1a2e28] ${mono ? "font-mono text-[11px]" : ""}`}>{value}</p>
        </div>
    );
}
