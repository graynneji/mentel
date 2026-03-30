"use client";

// app/admin/payments/page.tsx
import { useState, useEffect, useCallback } from "react";
import {
    DollarSign, CheckCircle, Clock, AlertCircle, X,
    RefreshCw, TrendingUp, TrendingDown, ArrowUpRight,
    ArrowDownRight, Filter, Plus, Edit3,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Payment {
    id: string; createdAt: string; paidAt: string | null;
    leadId: string;
    lead: { id: string; name: string; email: string; band: string };
    session: { id: string; conductedAt: string; therapist: string; type: string } | null;
    amountKobo: number; currency: string;
    status: string; method: string; reference: string | null; notes: string | null;
}

interface Analytics {
    total: number; page: number; pages: number;
    totalRevenueKobo: number; paidRevenueKobo: number;
    pendingRevenueKobo: number;
    methodBreakdown: { method: string; count: number; amountKobo: number }[];
    monthlyRevenue: { month: string; amountKobo: number }[];
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmtNaira = (kobo: number) => {
    const n = kobo / 100;
    if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}K`;
    return `₦${n.toFixed(0)}`;
};
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const shortMonth = (ym: string) => MONTHS[parseInt(ym.split("-")[1]) - 1];

const STATUS_CFG: Record<string, { bg: string; text: string; dot: string }> = {
    paid: { bg: "#edf7f1", text: "#3a7a58", dot: "#7ba98b" },
    pending: { bg: "#fff8f0", text: "#7a5a2a", dot: "#c8963d" },
    refunded: { bg: "#f0edf7", text: "#5a3a7a", dot: "#a88bcf" },
    failed: { bg: "#fff0f0", text: "#7a3a3a", dot: "#cf8b8b" },
};
const METHOD_CFG: Record<string, string> = {
    transfer: "#3d8b8b", card: "#7b6fa9", cash: "#4e8c6a", pos: "#8b6e3d",
};

// ── Revenue bar chart ──────────────────────────────────────────────────────────
function RevChart({ data }: { data: { month: string; amountKobo: number }[] }) {
    if (!data.length) return <div className="h-[80px] flex items-center justify-center text-[#b0c8bc] text-sm">No data</div>;
    const max = Math.max(...data.map(d => d.amountKobo), 1);
    return (
        <div className="flex items-end gap-2 h-[80px]">
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-[8px] text-[#4e7a5e] font-semibold">{d.amountKobo > 0 ? fmtNaira(d.amountKobo) : ""}</div>
                    <div className="w-full rounded-t-[4px]" style={{
                        height: `${Math.max((d.amountKobo / max) * 56, 4)}px`,
                        background: "linear-gradient(180deg,#4e8c6a,#3d8b8b)",
                    }} />
                    <span className="text-[9px] text-[#8da898]">{shortMonth(d.month)}</span>
                </div>
            ))}
        </div>
    );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [methodFilter, setMethodFilter] = useState("all");
    const [modal, setModal] = useState<"edit" | "add" | null>(null);
    const [selected, setSelected] = useState<Payment | null>(null);
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

    // Edit form
    const [editStatus, setEditStatus] = useState("");
    const [editMethod, setEditMethod] = useState("");
    const [editAmount, setEditAmount] = useState("");
    const [editRef, setEditRef] = useState("");
    const [editNotes, setEditNotes] = useState("");
    const [saving, setSaving] = useState(false);

    const showToast = (msg: string, ok = true) => {
        setToast({ msg, ok }); setTimeout(() => setToast(null), 3500);
    };

    const fetchPayments = useCallback(async () => {
        setLoading(true);
        const params = new URLSearchParams({ limit: "100" });
        if (statusFilter !== "all") params.set("status", statusFilter);
        if (methodFilter !== "all") params.set("method", methodFilter);
        try {
            const res = await fetch(`/api/admin/payments?${params}`);
            const data = await res.json();
            if (data.success) { setPayments(data.payments); setAnalytics(data.analytics); }
        } finally { setLoading(false); }
    }, [statusFilter, methodFilter]);

    useEffect(() => { fetchPayments(); }, [fetchPayments]);

    const openEdit = (p: Payment) => {
        setSelected(p);
        setEditStatus(p.status);
        setEditMethod(p.method);
        setEditAmount(String(p.amountKobo / 100));
        setEditRef(p.reference ?? "");
        setEditNotes(p.notes ?? "");
        setModal("edit");
    };

    const saveEdit = async () => {
        if (!selected) return;
        setSaving(true);
        try {
            const res = await fetch("/api/admin/payments", {
                method: "PATCH", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: selected.id,
                    status: editStatus,
                    method: editMethod,
                    amountKobo: Math.round(parseFloat(editAmount) * 100),
                    reference: editRef || undefined,
                    notes: editNotes || undefined,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setPayments(p => p.map(pay => pay.id === selected.id ? data.payment : pay));
                showToast("Payment updated"); setModal(null);
            } else showToast("Failed", false);
        } finally { setSaving(false); }
    };

    // Summary
    const paid = analytics?.paidRevenueKobo ?? 0;
    const pending = analytics?.pendingRevenueKobo ?? 0;
    const total = analytics?.totalRevenueKobo ?? 0;

    return (
        <div className="flex flex-col gap-4 ">
            <style>{`
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        .modal-bg   { animation: fadeIn 0.18s ease; }
        .modal-card { animation: slideUp 0.22s ease; }
      `}</style>

            {toast && (
                <div className="fixed top-5 right-5 z-[9999] flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-[13px] font-medium shadow-lg"
                    style={{ background: toast.ok ? "#1c3a3a" : "#b94a4f", animation: "slideIn 0.2s ease" }}>
                    {toast.ok ? <CheckCircle size={14} /> : <AlertCircle size={14} />} {toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[18px] font-bold text-[#1c3a3a]">Payments</h1>
                    <p className="text-[12px] text-[#7a9088]">{analytics?.total ?? 0} records</p>
                </div>
                <button onClick={fetchPayments} className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#ddeae2] rounded-xl text-[12px] text-[#7a9088] cursor-pointer hover:bg-[#f7faf8]">
                    <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
                </button>
            </div>

            {/* KPIs */}
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
                {[
                    { icon: DollarSign, label: "Total Revenue", value: fmtNaira(paid), color: "#4e7a5e", sub: "paid sessions" },
                    { icon: Clock, label: "Pending", value: fmtNaira(pending), color: "#8b6e3d", sub: "awaiting payment" },
                    { icon: TrendingUp, label: "Total Records", value: `${analytics?.total ?? 0}`, color: "#3d8b8b", sub: "all time" },
                    { icon: DollarSign, label: "Avg. per Session", value: analytics?.total ? fmtNaira(paid / (analytics.total || 1)) : "—", color: "#7b6fa9", sub: "per paid session" },
                ].map(({ icon: Icon, label, value, color, sub }) => (
                    <div key={label} className="bg-white rounded-2xl border border-[#ddeae2] p-4 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: `${color}18` }}>
                            <Icon size={14} style={{ color }} />
                        </div>
                        <div className="text-[20px] font-bold text-[#1c3a3a]">{value}</div>
                        <div className="text-[11px] font-medium text-[#7a9088] mt-0.5">{label}</div>
                        <div className="text-[10px] mt-0.5" style={{ color }}>{sub}</div>
                    </div>
                ))}
            </div>

            {/* Charts row */}
            <div className="grid gap-4" style={{ gridTemplateColumns: "2fr 1fr" }}>
                <div className="bg-white rounded-2xl border border-[#ddeae2] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
                    <div className="text-[13px] font-semibold text-[#1c3a3a] mb-1">Monthly Revenue</div>
                    <div className="text-[11px] text-[#7a9088] mb-4">Paid sessions last 6 months</div>
                    <RevChart data={analytics?.monthlyRevenue ?? []} />
                </div>
                <div className="bg-white rounded-2xl border border-[#ddeae2] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
                    <div className="text-[13px] font-semibold text-[#1c3a3a] mb-1">Payment Methods</div>
                    <div className="text-[11px] text-[#7a9088] mb-3">Breakdown by channel</div>
                    <div className="flex flex-col gap-2">
                        {(analytics?.methodBreakdown ?? []).sort((a, b) => b.amountKobo - a.amountKobo).map(m => {
                            const pct = total > 0 ? (m.amountKobo / total) * 100 : 0;
                            const color = METHOD_CFG[m.method] ?? "#7a9088";
                            return (
                                <div key={m.method}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-[11px] text-[#7a9088] capitalize">{m.method}</span>
                                        <div className="flex gap-2">
                                            <span className="text-[10px] text-[#4e7a5e]">{fmtNaira(m.amountKobo)}</span>
                                            <span className="text-[11px] font-bold text-[#1c3a3a]">{m.count}</span>
                                        </div>
                                    </div>
                                    <div className="h-1.5 bg-[#f0f4f2] rounded-full overflow-hidden">
                                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                                    </div>
                                </div>
                            );
                        })}
                        {(!analytics?.methodBreakdown?.length) && <p className="text-[11px] text-[#b0c8bc] italic">No payments recorded yet</p>}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-[#ddeae2] px-4 py-3 flex flex-wrap gap-2 items-center shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                    className="py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a] cursor-pointer" style={{ fontFamily: "inherit", appearance: "none" }}>
                    <option value="all">All statuses</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="refunded">Refunded</option>
                    <option value="failed">Failed</option>
                </select>
                <select value={methodFilter} onChange={e => setMethodFilter(e.target.value)}
                    className="py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a] cursor-pointer" style={{ fontFamily: "inherit", appearance: "none" }}>
                    <option value="all">All methods</option>
                    {["transfer", "card", "cash", "pos"].map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <span className="ml-auto text-[11px] text-[#7a9088]">{payments.length} records</span>
            </div>

            {/* Payments table */}
            <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-[0_1px_8px_rgba(28,58,58,0.04)] overflow-hidden">
                {loading ? (
                    <div className="text-center py-12 text-[#7a9088] text-sm">
                        <div className="w-6 h-6 rounded-full border-2 border-[#4e8c6a] border-t-transparent animate-spin mx-auto mb-2" />
                        Loading…
                    </div>
                ) : payments.length === 0 ? (
                    <div className="text-center py-14">
                        <DollarSign size={28} className="text-[#ddeae2] mb-2 mx-auto" />
                        <p className="text-[#7a9088] text-sm">No payments found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-[12px]">
                            <thead>
                                <tr className="border-b border-[#f0f4f2]">
                                    {["Patient", "Amount", "Status", "Method", "Session", "Date", ""].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-[#7a9088] uppercase tracking-[0.08em]">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map(p => {
                                    const sc = STATUS_CFG[p.status] ?? STATUS_CFG.pending;
                                    return (
                                        <tr key={p.id} className="border-b border-[#f7faf8] hover:bg-[#f7faf8] transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="font-semibold text-[#1c3a3a]">{p.lead.name}</div>
                                                <div className="text-[10px] text-[#7a9088]">{p.lead.email}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="font-bold text-[#1c3a3a]">{fmtNaira(p.amountKobo)}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-[11px] font-semibold px-2 py-[3px] rounded-full flex items-center gap-1 w-fit" style={{ background: sc.bg, color: sc.text }}>
                                                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: sc.dot }} />
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-[11px] font-semibold px-2 py-[3px] rounded-full capitalize" style={{ background: `${METHOD_CFG[p.method] ?? "#7a9088"}18`, color: METHOD_CFG[p.method] ?? "#7a9088" }}>
                                                    {p.method}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-[#7a9088]">
                                                {p.session ? `${p.session.type} · ${p.session.therapist}` : "—"}
                                            </td>
                                            <td className="px-4 py-3 text-[#7a9088]">
                                                {p.paidAt ? fmtDate(p.paidAt) : fmtDate(p.createdAt)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <button onClick={() => openEdit(p)}
                                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium cursor-pointer border border-[#ddeae2] bg-white text-[#7a9088] hover:bg-[#f7faf8]">
                                                    <Edit3 size={11} /> Edit
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── MODAL: Edit payment ── */}
            {modal === "edit" && selected && (
                <div className="modal-bg fixed inset-0 bg-[rgba(28,58,58,0.45)] z-[200] flex items-center justify-center p-4" onClick={() => setModal(null)}>
                    <div className="modal-card bg-white rounded-2xl w-full max-w-[420px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="px-5 py-4 border-b border-[#ddeae2] flex items-center justify-between">
                            <div>
                                <div className="text-[15px] font-semibold text-[#1c3a3a]">Edit Payment</div>
                                <div className="text-[11px] text-[#7a9088]">{selected.lead.name}</div>
                            </div>
                            <button onClick={() => setModal(null)} className="bg-transparent border-none cursor-pointer text-[#7a9088]"><X size={18} /></button>
                        </div>
                        <div className="p-5 flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] text-[#7a9088] mb-1">Amount (₦)</label>
                                    <input type="number" value={editAmount} onChange={e => setEditAmount(e.target.value)}
                                        className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-[#7a9088] mb-1">Status</label>
                                    <select value={editStatus} onChange={e => setEditStatus(e.target.value)}
                                        className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit", appearance: "none" }}>
                                        {["paid", "pending", "refunded", "failed"].map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] text-[#7a9088] mb-1">Method</label>
                                    <select value={editMethod} onChange={e => setEditMethod(e.target.value)}
                                        className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit", appearance: "none" }}>
                                        {["transfer", "card", "cash", "pos"].map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] text-[#7a9088] mb-1">Reference</label>
                                    <input type="text" value={editRef} onChange={e => setEditRef(e.target.value)} placeholder="Payment ref"
                                        className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] text-[#7a9088] mb-1">Notes</label>
                                <textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} rows={2}
                                    className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a] resize-none leading-relaxed" style={{ fontFamily: "inherit" }} />
                            </div>
                            <div className="flex gap-2 justify-end mt-1">
                                <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-[#ddeae2] bg-white text-[#7a9088] text-[12px] cursor-pointer">Cancel</button>
                                <button onClick={saveEdit} disabled={saving}
                                    className="px-5 py-2 rounded-xl border-none text-white text-[12px] font-semibold cursor-pointer"
                                    style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" }}>
                                    {saving ? "Saving…" : "Save"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}