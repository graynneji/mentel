"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Search, Filter, Send, FileText, ChevronDown, ChevronUp,
    Mail, MessageSquare, User, TrendingUp, Clock, CheckCircle,
    AlertCircle, X, MoreVertical, RefreshCw, Eye, Edit3,
    ArrowUpRight, Inbox, Users, Activity, Menu,
} from "lucide-react";
import AdminLogout from "@/components/Logout";
import Link from "next/link";
import Image from "next/image";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Message {
    id: string;
    createdAt: string;
    subject: string;
    body: string;
    type: string;
    sentBy: string;
}

interface Lead {
    id: string;
    createdAt: string;
    name: string;
    email: string;
    phone: string | null;
    score: number;
    band: string;
    severity: string;
    answers: Record<string, number>;
    status: string;
    notes: string | null;
    seq1SentAt: string | null;
    seq2SentAt: string | null;
    seq3SentAt: string | null;
    messages: Message[];
}

type ModalType = "detail" | "message" | "notes" | null;

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
    new: { bg: "#edf7f1", text: "#3a7a58", dot: "#7ba98b" },
    contacted: { bg: "#e8f4f8", text: "#2a5a7a", dot: "#6fb8b8" },
    booked: { bg: "#f0edf7", text: "#5a3a7a", dot: "#a88bcf" },
    inactive: { bg: "#f5f5f5", text: "#7a7a7a", dot: "#b0b0b0" },
};

const BAND_COLORS: Record<string, string> = {
    Low: "#4e8c6a",
    Mild: "#3d8b8b",
    Moderate: "#5a6e8a",
    High: "#b94a4f",
};

const QUESTION_LABELS: Record<string, string> = {
    q1: "Mood", q2: "Anxiety", q3: "Energy", q4: "Sleep",
    q5: "Relationships", q6: "Stress", q7: "Self-worth", q8: "Support",
};

// ── Stat card ──────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color }: {
    icon: React.ElementType; label: string; value: string | number;
    sub?: string; color: string;
}) {
    return (
        <div className="bg-white rounded-2xl border border-[var(--border)] shadow-[0_1px_8px_rgba(28,58,58,0.05)] flex items-start gap-3.5 px-[22px] py-5">
            <div
                className="w-10 h-10 rounded-[10px] shrink-0 flex items-center justify-center"
                style={{ background: `${color}18` }}
            >
                <Icon size={18} style={{ color }} />
            </div>
            <div>
                <div className="text-[22px] font-semibold text-[var(--deep)] leading-tight">{value}</div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">{label}</div>
                {sub && <div className="text-[11px] mt-0.5 font-medium" style={{ color }}>{sub}</div>}
            </div>
        </div>
    );
}

// ── Score mini bar ────────────────────────────────────────────────────────────
function MiniBar({ value, max = 3, color }: { value: number; max?: number; color: string }) {
    return (
        <div className="flex items-center gap-1.5">
            <div className="flex-1 h-[5px] bg-[#e8eeea] rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full"
                    style={{ width: `${Math.round((value / max) * 100)}%`, background: color }}
                />
            </div>
            <span className="text-[11px] text-[var(--text-muted)] shrink-0">{value}/{max}</span>
        </div>
    );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function AdminPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [bandFilter, setBandFilter] = useState("all");
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [modal, setModal] = useState<ModalType>(null);
    const [notes, setNotes] = useState("");
    const [savingNotes, setSavingNotes] = useState(false);
    const [customSubject, setCustomSubject] = useState("");
    const [customBody, setCustomBody] = useState("");
    const [sending, setSending] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const showToast = (msg: string, ok = true) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchLeads = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.set("search", search);
            if (statusFilter !== "all") params.set("status", statusFilter);
            if (bandFilter !== "all") params.set("band", bandFilter);
            const res = await fetch(`/api/admin/leads?${params.toString()}`);
            const data = await res.json() as { success: boolean; leads: Lead[] };
            if (data.success) setLeads(data.leads);
        } catch {
            showToast("Failed to load leads", false);
        } finally {
            setLoading(false);
        }
    }, [search, statusFilter, bandFilter]);

    useEffect(() => {
        const t = setTimeout(fetchLeads, 300);
        return () => clearTimeout(t);
    }, [fetchLeads]);

    async function updateStatus(id: string, status: string) {
        await fetch("/api/admin/leads", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status }),
        });
        setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l));
        showToast("Status updated");
    }

    async function saveNotes() {
        if (!selectedLead) return;
        setSavingNotes(true);
        await fetch("/api/admin/leads", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: selectedLead.id, notes }),
        });
        setLeads((prev) => prev.map((l) => l.id === selectedLead.id ? { ...l, notes } : l));
        setSavingNotes(false);
        showToast("Notes saved");
        setModal(null);
    }

    async function sendMessage(leadId: string, type: string, customSubj?: string, customBod?: string) {
        setSending(type);
        try {
            const res = await fetch("/api/admin/message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    leadId,
                    type,
                    ...(type === "custom" ? { customSubject: customSubj, customBody: customBod } : {}),
                }),
            });
            const data = await res.json() as { success: boolean };
            if (data.success) {
                showToast("Message sent successfully");
                setCustomSubject("");
                setCustomBody("");
                setModal(null);
                fetchLeads();
            } else {
                showToast("Failed to send message", false);
            }
        } catch {
            showToast("Failed to send message", false);
        } finally {
            setSending(null);
        }
    }

    const stats = {
        total: leads.length,
        new: leads.filter((l) => l.status === "new").length,
        contacted: leads.filter((l) => l.status === "contacted").length,
        booked: leads.filter((l) => l.status === "booked").length,
        high: leads.filter((l) => l.band === "High").length,
    };

    const openDetail = (lead: Lead) => { setSelectedLead(lead); setNotes(lead.notes ?? ""); setModal("detail"); };
    const openNotes = (lead: Lead) => { setSelectedLead(lead); setNotes(lead.notes ?? ""); setModal("notes"); };
    const openMessage = (lead: Lead) => { setSelectedLead(lead); setModal("message"); };

    return (
        <div className="min-h-screen bg-[#f2f6f3] font-[DM_Sans,sans-serif]">

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
                @keyframes slideIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
                @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
                @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
                .modal-bg { animation: fadeIn 0.18s ease; }
                .modal-card { animation: slideUp 0.22s ease; }
                select { appearance: none; -webkit-appearance: none; }
                textarea, input { font-family: inherit; }
                .lead-row:hover { background: #f7faf8 !important; }
                .btn-ghost:hover { background: rgba(123,169,139,0.1) !important; }
                .seq-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                .seq-btn:disabled { opacity: 0.5; cursor: not-allowed; }
                ::-webkit-scrollbar { width: 5px; height: 5px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: #c8ddd2; border-radius: 99px; }
            `}</style>

            {/* Toast */}
            {toast && (
                <div
                    className="fixed top-5 right-5 z-[9999] text-white px-5 py-3 rounded-xl text-[13px] font-medium shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex items-center gap-2"
                    style={{ background: toast.ok ? "#1c3a3a" : "#b94a4f", animation: "slideIn 0.2s ease" }}
                >
                    {toast.ok ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                    {toast.msg}
                </div>
            )}

            {/* ── Header ── */}
            <div className="bg-white border-b border-[var(--border)] px-6 sticky top-0 z-[100] shadow-[0_1px_8px_rgba(28,58,58,0.05)]">
                <div className="max-w-[1280px] mx-auto flex items-center justify-between h-[60px]">

                    {/* Left: logo + badge */}
                    <div className="flex items-center gap-2.5">
                        <Link href="/" className="flex items-center gap-2.5">
                            <Image src="/logo.png" alt="Mentel logo" width={108} height={61} className="object-contain" priority />
                        </Link>
                        <span className="text-[11px] font-semibold text-[var(--sage-dark)] bg-[#edf7f1] border border-[#c8ddd2] rounded-full px-2.5 py-0.5 ml-1 uppercase tracking-[0.06em]">
                            Admin
                        </span>
                    </div>

                    {/* Desktop actions */}
                    <div className="hidden sm:flex items-center gap-2">
                        <button
                            onClick={fetchLeads}
                            className="btn-ghost flex items-center gap-1.5 px-3.5 py-[7px] rounded-[10px] border border-[var(--border)] bg-white text-[var(--text-muted)] text-xs font-medium cursor-pointer transition-all duration-150"
                        >
                            <RefreshCw size={13} style={{ color: loading ? "var(--sage)" : undefined }} />
                            Refresh
                        </button>
                        <AdminLogout />
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="sm:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--border)] bg-white text-[var(--text-muted)] cursor-pointer"
                        onClick={() => setMobileMenuOpen((o) => !o)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>

                {/* Mobile dropdown */}
                {mobileMenuOpen && (
                    <div className="sm:hidden border-t border-[var(--border)] py-3 flex flex-col gap-2">
                        <button
                            onClick={() => { fetchLeads(); setMobileMenuOpen(false); }}
                            className="btn-ghost flex items-center gap-2 w-full px-4 py-2.5 rounded-[10px] border border-[var(--border)] bg-white text-[var(--text-muted)] text-sm font-medium cursor-pointer transition-all duration-150"
                        >
                            <RefreshCw size={14} style={{ color: loading ? "var(--sage)" : undefined }} />
                            Refresh
                        </button>
                        <AdminLogout />
                    </div>
                )}
            </div>

            <div className="max-w-[1280px] mx-auto px-4 py-6">

                {/* Stats row */}
                <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
                    <StatCard icon={Users} label="Total leads" value={stats.total} color="#4e7a5e" />
                    <StatCard icon={Inbox} label="New" value={stats.new} color="#7ba98b" sub={stats.new > 0 ? "Needs attention" : undefined} />
                    <StatCard icon={Mail} label="Contacted" value={stats.contacted} color="#3d8b8b" />
                    <StatCard icon={CheckCircle} label="Booked" value={stats.booked} color="#7b6fa9" />
                    <StatCard icon={AlertCircle} label="High severity" value={stats.high} color="#b94a4f" sub={stats.high > 0 ? "Priority follow-up" : undefined} />
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl border border-[var(--border)] px-[18px] py-3.5 mb-4 flex flex-wrap gap-2.5 items-center shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
                    {/* Search */}
                    <div className="relative flex-[1_1_200px] min-w-[180px]">
                        <Search size={14} className="absolute left-[11px] top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                        <input
                            type="text"
                            placeholder="Search name, email, phone…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full py-[9px] pr-3 pl-8 border-[1.5px] border-[var(--border)] rounded-[10px] text-base text-[var(--text)] bg-[#f7faf8] outline-none transition-[border-color] duration-150"
                            onFocus={(e) => (e.target.style.borderColor = "var(--sage)")}
                            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                        />
                    </div>

                    {/* Status filter */}
                    <div className="relative">
                        <Filter size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="py-[9px] pl-7 pr-7 border-[1.5px] border-[var(--border)] rounded-[10px] text-[13px] text-[var(--text)] bg-[#f7faf8] cursor-pointer outline-none"
                        >
                            <option value="all">All statuses</option>
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="booked">Booked</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Band filter */}
                    <div className="relative">
                        <Activity size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                        <select
                            value={bandFilter}
                            onChange={(e) => setBandFilter(e.target.value)}
                            className="py-[9px] pl-7 pr-7 border-[1.5px] border-[var(--border)] rounded-[10px] text-[13px] text-[var(--text)] bg-[#f7faf8] cursor-pointer outline-none"
                        >
                            <option value="all">All severities</option>
                            <option value="Low">Low</option>
                            <option value="Mild">Mild</option>
                            <option value="Moderate">Moderate</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    <span className="text-xs text-[var(--text-muted)] ml-auto">
                        {leads.length} result{leads.length !== 1 ? "s" : ""}
                    </span>
                </div>

                {/* Leads list */}
                <div className="flex flex-col gap-2">
                    {loading && (
                        <div className="text-center py-12 text-[var(--text-muted)] text-sm">
                            Loading leads…
                        </div>
                    )}
                    {!loading && leads.length === 0 && (
                        <div className="text-center py-14 bg-white rounded-2xl border border-[var(--border)]">
                            <Users size={32} className="text-[var(--border)] mb-3 mx-auto" />
                            <p className="text-[var(--text-muted)] text-sm">No leads found</p>
                        </div>
                    )}
                    {!loading && leads.map((lead) => {
                        const sc = STATUS_COLORS[lead.status] ?? STATUS_COLORS.new;
                        const bc = BAND_COLORS[lead.band] ?? "#7ba98b";
                        const isExpanded = expandedId === lead.id;
                        const seqDone = [lead.seq1SentAt, lead.seq2SentAt, lead.seq3SentAt].filter(Boolean).length;

                        return (
                            <div
                                key={lead.id}
                                className="bg-white rounded-[14px] border border-[var(--border)] shadow-[0_1px_6px_rgba(28,58,58,0.04)] overflow-hidden transition-shadow duration-150"
                            >
                                {/* Main row */}
                                <div
                                    className="lead-row grid gap-3 px-4 py-3.5 cursor-pointer transition-[background] duration-[120ms]"
                                    style={{ gridTemplateColumns: "1fr auto" }}
                                    onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        {/* Avatar */}
                                        <div
                                            className="w-[38px] h-[38px] rounded-full shrink-0 flex items-center justify-center text-sm font-semibold"
                                            style={{ background: `${bc}22`, color: bc }}
                                        >
                                            {lead.name.charAt(0).toUpperCase()}
                                        </div>

                                        {/* Name + email */}
                                        <div className="min-w-0">
                                            <div className="text-sm font-semibold text-[var(--deep)] whitespace-nowrap overflow-hidden text-ellipsis">
                                                {lead.name}
                                            </div>
                                            <div className="text-xs text-[var(--text-muted)] whitespace-nowrap overflow-hidden text-ellipsis">
                                                {lead.email}
                                            </div>
                                        </div>

                                        {/* Badges */}
                                        <div className="flex gap-1.5 flex-wrap ml-1">
                                            <span
                                                className="text-[11px] font-semibold px-2.5 py-[3px] rounded-full"
                                                style={{ background: `${bc}18`, color: bc }}
                                            >{lead.band}</span>
                                            <span
                                                className="text-[11px] font-semibold px-2.5 py-[3px] rounded-full flex items-center gap-1"
                                                style={{ background: sc.bg, color: sc.text }}
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: sc.dot }} />
                                                {lead.status}
                                            </span>
                                            {seqDone > 0 && (
                                                <span className="text-[11px] px-2.5 py-[3px] rounded-full bg-[#f0edf7] text-[#7b6fa9] font-semibold">
                                                    {seqDone}/3 sent
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right side */}
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <span className="text-xs text-[var(--text-muted)] mr-1">Score {lead.score}/24</span>
                                        {isExpanded
                                            ? <ChevronUp size={16} className="text-[var(--text-muted)]" />
                                            : <ChevronDown size={16} className="text-[var(--text-muted)]" />}
                                    </div>
                                </div>

                                {/* Expanded panel */}
                                {isExpanded && (
                                    <div className="border-t border-[var(--border)] px-4 pt-4 pb-[18px]">
                                        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>

                                            {/* Left — details */}
                                            <div>
                                                <p className="text-[11px] font-semibold text-[var(--sage-dark)] uppercase tracking-[0.08em] mb-2.5">Details</p>
                                                <div className="flex flex-col gap-1.5 text-[13px] text-[var(--text-muted)]">
                                                    <div><strong className="text-[var(--text)]">Phone:</strong> {lead.phone || "—"}</div>
                                                    <div><strong className="text-[var(--text)]">Submitted:</strong> {new Date(lead.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
                                                    <div><strong className="text-[var(--text)]">Severity:</strong> {lead.severity}</div>
                                                    {lead.notes && (
                                                        <div className="mt-1 px-3 py-2 bg-[#f7faf8] rounded-lg border border-[var(--border)] text-xs italic text-[var(--text-muted)]">
                                                            {lead.notes}
                                                        </div>
                                                    )}
                                                </div>

                                                <p className="text-[11px] font-semibold text-[var(--sage-dark)] uppercase tracking-[0.08em] mt-3.5 mb-2">Breakdown</p>
                                                <div className="flex flex-col gap-[5px]">
                                                    {Object.entries(lead.answers).map(([k, v]) => (
                                                        <div key={k} className="grid items-center gap-2" style={{ gridTemplateColumns: "90px 1fr" }}>
                                                            <span className="text-xs text-[var(--text-muted)]">{QUESTION_LABELS[k] ?? k}</span>
                                                            <MiniBar value={v} color={bc} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Right — actions */}
                                            <div>
                                                <p className="text-[11px] font-semibold text-[var(--sage-dark)] uppercase tracking-[0.08em] mb-2">Update Status</p>
                                                <div className="flex flex-wrap gap-1.5 mb-4">
                                                    {["new", "contacted", "booked", "inactive"].map((s) => (
                                                        <button
                                                            key={s}
                                                            onClick={(e) => { e.stopPropagation(); updateStatus(lead.id, s); }}
                                                            className="px-3.5 py-[5px] rounded-full text-xs font-semibold cursor-pointer transition-all duration-150"
                                                            style={{
                                                                border: lead.status === s ? `2px solid ${STATUS_COLORS[s].dot}` : "1.5px solid var(--border)",
                                                                background: lead.status === s ? STATUS_COLORS[s].bg : "white",
                                                                color: lead.status === s ? STATUS_COLORS[s].text : "var(--text-muted)",
                                                            }}
                                                        >
                                                            {s}
                                                        </button>
                                                    ))}
                                                </div>

                                                <p className="text-[11px] font-semibold text-[var(--sage-dark)] uppercase tracking-[0.08em] mb-2">Marketing Sequence</p>
                                                <div className="flex flex-col gap-1.5 mb-4">
                                                    {[
                                                        { key: "seq1", label: "Email 1 — Value nudge", sent: lead.seq1SentAt },
                                                        { key: "seq2", label: "Email 2 — Check-in", sent: lead.seq2SentAt },
                                                        { key: "seq3", label: "Email 3 — Booking push", sent: lead.seq3SentAt },
                                                    ].map(({ key, label, sent }) => (
                                                        <div key={key} className="flex items-center justify-between gap-2">
                                                            <div className="flex-1">
                                                                <div className="text-xs text-[var(--text)] font-medium">{label}</div>
                                                                {sent && (
                                                                    <div className="text-[11px] text-[var(--sage-dark)]">
                                                                        Sent {new Date(sent).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <button
                                                                className="seq-btn px-3.5 py-[5px] rounded-full text-xs font-semibold cursor-pointer border-none transition-all duration-150 flex items-center gap-[5px]"
                                                                disabled={!!sent || sending === key}
                                                                onClick={(e) => { e.stopPropagation(); sendMessage(lead.id, key); }}
                                                                style={{
                                                                    background: sent ? "#edf7f1" : "linear-gradient(135deg,#4e7a5e,#3d8b8b)",
                                                                    color: sent ? "var(--sage-dark)" : "white",
                                                                }}
                                                            >
                                                                {sent ? <><CheckCircle size={11} /> Sent</> : sending === key ? "Sending…" : <><Send size={11} /> Send</>}
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>

                                                <p className="text-[11px] font-semibold text-[var(--sage-dark)] uppercase tracking-[0.08em] mb-2">Quick Actions</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); openDetail(lead); }}
                                                        className="btn-ghost flex items-center gap-[5px] px-3.5 py-[7px] rounded-[10px] text-xs font-medium cursor-pointer border border-[var(--border)] bg-white text-[var(--text-muted)] transition-all duration-150"
                                                    >
                                                        <Eye size={12} /> Full view
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); openNotes(lead); }}
                                                        className="btn-ghost flex items-center gap-[5px] px-3.5 py-[7px] rounded-[10px] text-xs font-medium cursor-pointer border border-[var(--border)] bg-white text-[var(--text-muted)] transition-all duration-150"
                                                    >
                                                        <Edit3 size={12} /> Notes
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); openMessage(lead); }}
                                                        className="flex items-center gap-[5px] px-3.5 py-[7px] rounded-[10px] text-xs font-medium cursor-pointer border-none text-white transition-all duration-150"
                                                        style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" }}
                                                    >
                                                        <MessageSquare size={12} /> Custom message
                                                    </button>
                                                </div>

                                                {/* Message history */}
                                                {lead.messages.length > 0 && (
                                                    <div className="mt-3.5">
                                                        <p className="text-[11px] font-semibold text-[var(--sage-dark)] uppercase tracking-[0.08em] mb-2">Message History</p>
                                                        <div className="flex flex-col gap-1 max-h-[120px] overflow-y-auto">
                                                            {lead.messages.map((m) => (
                                                                <div key={m.id} className="px-2.5 py-[7px] bg-[#f7faf8] rounded-lg border border-[var(--border)]">
                                                                    <div className="text-xs font-medium text-[var(--text)]">{m.subject}</div>
                                                                    <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                                                                        {new Date(m.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                                                        {" · "}{m.type === "custom" ? "Custom" : `Sequence ${m.type.replace("seq", "")}`}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── MODAL: Full detail ── */}
            {modal === "detail" && selectedLead && (
                <div
                    className="modal-bg fixed inset-0 bg-[rgba(28,58,58,0.4)] z-[200] flex items-center justify-center p-4"
                    onClick={() => setModal(null)}
                >
                    <div
                        className="modal-card bg-white rounded-[20px] w-full max-w-[600px] max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-6 py-5 border-b border-[var(--border)] flex items-center justify-between sticky top-0 bg-white z-[1]">
                            <div>
                                <div className="text-[18px] font-[Cormorant_Garamond,serif] font-normal text-[var(--deep)]">{selectedLead.name}</div>
                                <div className="text-xs text-[var(--text-muted)]">{selectedLead.email}</div>
                            </div>
                            <button onClick={() => setModal(null)} className="bg-transparent border-none cursor-pointer text-[var(--text-muted)]">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Severity banner */}
                            <div
                                className="px-5 py-4 rounded-[14px] mb-5"
                                style={{
                                    background: `${BAND_COLORS[selectedLead.band] ?? "#7ba98b"}14`,
                                    border: `1px solid ${BAND_COLORS[selectedLead.band] ?? "#7ba98b"}28`,
                                }}
                            >
                                <div className="text-[11px] uppercase tracking-[0.1em] font-bold mb-1" style={{ color: BAND_COLORS[selectedLead.band] }}>
                                    {selectedLead.severity}
                                </div>
                                <div className="text-[22px] font-bold" style={{ color: BAND_COLORS[selectedLead.band] }}>
                                    {selectedLead.score} <span className="text-sm font-normal text-[var(--text-muted)]">/ 24</span>
                                </div>
                            </div>

                            {/* Info grid */}
                            <div className="grid grid-cols-2 gap-2.5 mb-5">
                                {[
                                    { label: "Email", value: selectedLead.email },
                                    { label: "Phone", value: selectedLead.phone || "—" },
                                    { label: "Status", value: selectedLead.status },
                                    { label: "Submitted", value: new Date(selectedLead.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) },
                                ].map(({ label, value }) => (
                                    <div key={label} className="px-3.5 py-3 bg-[#f7faf8] rounded-[10px] border border-[var(--border)]">
                                        <div className="text-[10px] uppercase tracking-[0.08em] text-[var(--sage-dark)] font-semibold mb-1">{label}</div>
                                        <div className="text-[13px] text-[var(--text)] break-words">{value}</div>
                                    </div>
                                ))}
                            </div>

                            <p className="text-[11px] font-semibold text-[var(--sage-dark)] uppercase tracking-[0.08em] mb-2.5">Area Breakdown</p>
                            <div className="flex flex-col gap-2 mb-5">
                                {Object.entries(selectedLead.answers).map(([k, v]) => (
                                    <div key={k} className="grid items-center gap-2.5" style={{ gridTemplateColumns: "110px 1fr" }}>
                                        <span className="text-[13px] text-[var(--text-muted)]">{QUESTION_LABELS[k] ?? k}</span>
                                        <MiniBar value={v} color={BAND_COLORS[selectedLead.band] ?? "#7ba98b"} />
                                    </div>
                                ))}
                            </div>

                            {selectedLead.notes && (
                                <>
                                    <p className="text-[11px] font-semibold text-[var(--sage-dark)] uppercase tracking-[0.08em] mb-2">Notes</p>
                                    <div className="px-3.5 py-3 bg-[#f7faf8] rounded-[10px] border border-[var(--border)] text-[13px] text-[var(--text-muted)] italic mb-5">
                                        {selectedLead.notes}
                                    </div>
                                </>
                            )}

                            {selectedLead.messages.length > 0 && (
                                <>
                                    <p className="text-[11px] font-semibold text-[var(--sage-dark)] uppercase tracking-[0.08em] mb-2">All Messages Sent</p>
                                    <div className="flex flex-col gap-1.5">
                                        {selectedLead.messages.map((m) => (
                                            <div key={m.id} className="px-3.5 py-2.5 bg-[#f7faf8] rounded-[10px] border border-[var(--border)]">
                                                <div className="text-[13px] font-medium text-[var(--text)]">{m.subject}</div>
                                                <div className="text-[11px] text-[var(--text-muted)] mt-[3px]">
                                                    {new Date(m.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                                    {" · "}{m.sentBy === "admin" ? "Sent by you" : "System"} · {m.type}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── MODAL: Notes ── */}
            {modal === "notes" && selectedLead && (
                <div
                    className="modal-bg fixed inset-0 bg-[rgba(28,58,58,0.4)] z-[200] flex items-center justify-center p-4"
                    onClick={() => setModal(null)}
                >
                    <div
                        className="modal-card bg-white rounded-[20px] w-full max-w-[480px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-[22px] py-[18px] border-b border-[var(--border)] flex items-center justify-between">
                            <div className="text-base font-semibold text-[var(--deep)]">Notes — {selectedLead.name}</div>
                            <button onClick={() => setModal(null)} className="bg-transparent border-none cursor-pointer text-[var(--text-muted)]"><X size={18} /></button>
                        </div>
                        <div className="p-[22px]">
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add your notes here — observations, follow-up reminders, context…"
                                rows={6}
                                className="w-full px-3.5 py-3 border-[1.5px] border-[var(--border)] rounded-xl text-base text-[var(--text)] resize-y outline-none bg-[#f7faf8] leading-[1.7]"
                                onFocus={(e) => (e.target.style.borderColor = "var(--sage)")}
                                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                            />
                            <div className="flex gap-2 mt-3.5 justify-end">
                                <button
                                    onClick={() => setModal(null)}
                                    className="px-[18px] py-[9px] rounded-full border border-[var(--border)] bg-white text-[var(--text-muted)] text-[13px] font-medium cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveNotes}
                                    disabled={savingNotes}
                                    className="px-[22px] py-[9px] rounded-full border-none text-white text-[13px] font-semibold cursor-pointer flex items-center gap-1.5"
                                    style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" }}
                                >
                                    <FileText size={13} />
                                    {savingNotes ? "Saving…" : "Save notes"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── MODAL: Custom message ── */}
            {modal === "message" && selectedLead && (
                <div
                    className="modal-bg fixed inset-0 bg-[rgba(28,58,58,0.4)] z-[200] flex items-center justify-center p-4"
                    onClick={() => setModal(null)}
                >
                    <div
                        className="modal-card bg-white rounded-[20px] w-full max-w-[520px] max-h-[90vh] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-[22px] py-[18px] border-b border-[var(--border)] flex items-center justify-between">
                            <div className="text-base font-semibold text-[var(--deep)]">Send message to {selectedLead.name}</div>
                            <button onClick={() => setModal(null)} className="bg-transparent border-none cursor-pointer text-[var(--text-muted)]"><X size={18} /></button>
                        </div>
                        <div className="p-[22px] overflow-y-auto max-h-[calc(90vh-60px)]">
                            <div className="mb-3.5">
                                <label className="block text-[11px] font-semibold text-[var(--sage-dark)] uppercase tracking-[0.08em] mb-1.5">Subject</label>
                                <input
                                    type="text"
                                    placeholder="Email subject…"
                                    value={customSubject}
                                    onChange={(e) => setCustomSubject(e.target.value)}
                                    className="w-full px-3.5 py-2.5 border-[1.5px] border-[var(--border)] rounded-[10px] text-base text-[var(--text)] outline-none bg-[#f7faf8]"
                                    onFocus={(e) => (e.target.style.borderColor = "var(--sage)")}
                                    onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-[11px] font-semibold text-[var(--sage-dark)] uppercase tracking-[0.08em] mb-1.5">Message</label>
                                <textarea
                                    placeholder={`Write your message to ${selectedLead.name}…`}
                                    value={customBody}
                                    onChange={(e) => setCustomBody(e.target.value)}
                                    rows={7}
                                    className="w-full px-3.5 py-2.5 border-[1.5px] border-[var(--border)] rounded-[10px] text-base text-[var(--text)] resize-y outline-none bg-[#f7faf8] leading-[1.7]"
                                    onFocus={(e) => (e.target.style.borderColor = "var(--sage)")}
                                    onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                                />
                                <p className="text-[11px] text-[var(--text-muted)] mt-[5px]">Your message will be wrapped in a clean branded email.</p>
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button
                                    onClick={() => setModal(null)}
                                    className="px-[18px] py-[9px] rounded-full border border-[var(--border)] bg-white text-[var(--text-muted)] text-[13px] font-medium cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => sendMessage(selectedLead.id, "custom", customSubject, customBody)}
                                    disabled={!customSubject.trim() || !customBody.trim() || sending === "custom"}
                                    className="px-[22px] py-[9px] rounded-full border-none text-white text-[13px] font-semibold cursor-pointer flex items-center gap-1.5 transition-opacity"
                                    style={{
                                        background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)",
                                        opacity: !customSubject.trim() || !customBody.trim() ? 0.5 : 1,
                                    }}
                                >
                                    <Send size={13} />
                                    {sending === "custom" ? "Sending…" : "Send message"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}