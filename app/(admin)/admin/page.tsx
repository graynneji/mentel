
"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Search, Filter, Send, FileText, ChevronDown, ChevronUp,
    Mail, MessageSquare, User, TrendingUp, Clock, CheckCircle,
    AlertCircle, X, MoreVertical, RefreshCw, Eye, Edit3,
    ArrowUpRight, Inbox, Users, Activity,
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
        <div style={{
            background: "white", borderRadius: 16, padding: "20px 22px",
            border: "1px solid var(--border)", boxShadow: "0 1px 8px rgba(28,58,58,0.05)",
            display: "flex", alignItems: "flex-start", gap: 14,
        }}>
            <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center",
            }}>
                <Icon size={18} style={{ color }} />
            </div>
            <div>
                <div style={{ fontSize: 22, fontWeight: 600, color: "var(--deep)", lineHeight: 1.2 }}>{value}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{label}</div>
                {sub && <div style={{ fontSize: 11, color, marginTop: 3, fontWeight: 500 }}>{sub}</div>}
            </div>
        </div>
    );
}

// ── Score mini bar ────────────────────────────────────────────────────────────
function MiniBar({ value, max = 3, color }: { value: number; max?: number; color: string }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ flex: 1, height: 5, background: "#e8eeea", borderRadius: 99, overflow: "hidden" }}>
                <div style={{
                    height: "100%", borderRadius: 99,
                    width: `${Math.round((value / max) * 100)}%`,
                    background: color,
                }} />
            </div>
            <span style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0 }}>{value}/{max}</span>
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

    // Stats
    const stats = {
        total: leads.length,
        new: leads.filter((l) => l.status === "new").length,
        contacted: leads.filter((l) => l.status === "contacted").length,
        booked: leads.filter((l) => l.status === "booked").length,
        high: leads.filter((l) => l.band === "High").length,
    };

    const openDetail = (lead: Lead) => {
        setSelectedLead(lead);
        setNotes(lead.notes ?? "");
        setModal("detail");
    };

    const openNotes = (lead: Lead) => {
        setSelectedLead(lead);
        setNotes(lead.notes ?? "");
        setModal("notes");
    };

    const openMessage = (lead: Lead) => {
        setSelectedLead(lead);
        setModal("message");
    };

    return (
        <div style={{ minHeight: "100vh", background: "#f2f6f3", fontFamily: "DM Sans, sans-serif" }}>

            {/* Toast */}
            {toast && (
                <div style={{
                    position: "fixed", top: 20, right: 20, zIndex: 9999,
                    background: toast.ok ? "#1c3a3a" : "#b94a4f",
                    color: "white", padding: "12px 20px", borderRadius: 12,
                    fontSize: 13, fontWeight: 500, boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    display: "flex", alignItems: "center", gap: 8,
                    animation: "slideIn 0.2s ease",
                }}>
                    {toast.ok ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                    {toast.msg}
                </div>
            )}

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
                :root {
                    --sage: #7ba98b; --sage-dark: #4e7a5e; --teal: #3d8b8b;
                    --deep: #1c3a3a; --mist: #edf4f0; --white: #fafcfb;
                    --text: #2c3e35; --text-muted: #4e6358; --border: #c8ddd2;
                }
                * { box-sizing: border-box; margin: 0; padding: 0; }
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

            {/* Header */}
            <div style={{
                background: "white", borderBottom: "1px solid var(--border)",
                padding: "0 24px", position: "sticky", top: 0, zIndex: 100,
                boxShadow: "0 1px 8px rgba(28,58,58,0.05)",
            }}>
                <div style={{
                    maxWidth: 1280, margin: "0 auto",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    height: 60,
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Link href="/" className="flex items-center gap-2.5">
                            <Image src="/logo.png" alt="Mentel logo" width={108} height={61} className="object-contain" priority />
                        </Link>
                        <span style={{
                            fontSize: 11, fontWeight: 600, color: "var(--sage-dark)",
                            background: "#edf7f1", border: "1px solid #c8ddd2",
                            borderRadius: 99, padding: "2px 10px", marginLeft: 4,
                            textTransform: "uppercase", letterSpacing: "0.06em",
                        }}>Admin</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button
                            onClick={fetchLeads}
                            style={{
                                display: "flex", alignItems: "center", gap: 6,
                                padding: "7px 14px", borderRadius: 10, border: "1px solid var(--border)",
                                background: "white", color: "var(--text-muted)", fontSize: 12,
                                fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
                            }}
                            className="btn-ghost"
                        >
                            <RefreshCw size={13} style={{ color: loading ? "var(--sage)" : undefined }} />
                            Refresh
                        </button>
                        <AdminLogout />
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 16px" }}>

                {/* Stats row */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: 12, marginBottom: 24,
                }}>
                    <StatCard icon={Users} label="Total leads" value={stats.total} color="#4e7a5e" />
                    <StatCard icon={Inbox} label="New" value={stats.new} color="#7ba98b" sub={stats.new > 0 ? "Needs attention" : undefined} />
                    <StatCard icon={Mail} label="Contacted" value={stats.contacted} color="#3d8b8b" />
                    <StatCard icon={CheckCircle} label="Booked" value={stats.booked} color="#7b6fa9" />
                    <StatCard icon={AlertCircle} label="High severity" value={stats.high} color="#b94a4f" sub={stats.high > 0 ? "Priority follow-up" : undefined} />
                </div>

                {/* Filters */}
                <div style={{
                    background: "white", borderRadius: 16, border: "1px solid var(--border)",
                    padding: "14px 18px", marginBottom: 16, display: "flex",
                    flexWrap: "wrap", gap: 10, alignItems: "center",
                    boxShadow: "0 1px 8px rgba(28,58,58,0.04)",
                }}>
                    {/* Search */}
                    <div style={{ position: "relative", flex: "1 1 200px", minWidth: 180 }}>
                        <Search size={14} style={{
                            position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)",
                            color: "var(--text-muted)",
                        }} />
                        <input
                            type="text"
                            placeholder="Search name, email, phone…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: "100%", padding: "9px 12px 9px 32px",
                                border: "1.5px solid var(--border)", borderRadius: 10,
                                fontSize: 13, color: "var(--text)", background: "#f7faf8",
                                outline: "none", transition: "border-color 0.15s",
                            }}
                            onFocus={(e) => (e.target.style.borderColor = "var(--sage)")}
                            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                        />
                    </div>

                    {/* Status filter */}
                    <div style={{ position: "relative" }}>
                        <Filter size={13} style={{
                            position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
                            color: "var(--text-muted)", pointerEvents: "none",
                        }} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{
                                padding: "9px 30px 9px 28px", border: "1.5px solid var(--border)",
                                borderRadius: 10, fontSize: 13, color: "var(--text)",
                                background: "#f7faf8", cursor: "pointer", outline: "none",
                            }}
                        >
                            <option value="all">All statuses</option>
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="booked">Booked</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Band filter */}
                    <div style={{ position: "relative" }}>
                        <Activity size={13} style={{
                            position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
                            color: "var(--text-muted)", pointerEvents: "none",
                        }} />
                        <select
                            value={bandFilter}
                            onChange={(e) => setBandFilter(e.target.value)}
                            style={{
                                padding: "9px 30px 9px 28px", border: "1.5px solid var(--border)",
                                borderRadius: 10, fontSize: 13, color: "var(--text)",
                                background: "#f7faf8", cursor: "pointer", outline: "none",
                            }}
                        >
                            <option value="all">All severities</option>
                            <option value="Low">Low</option>
                            <option value="Mild">Mild</option>
                            <option value="Moderate">Moderate</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: "auto" }}>
                        {leads.length} result{leads.length !== 1 ? "s" : ""}
                    </span>
                </div>

                {/* Leads list */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {loading && (
                        <div style={{ textAlign: "center", padding: 48, color: "var(--text-muted)", fontSize: 14 }}>
                            Loading leads…
                        </div>
                    )}
                    {!loading && leads.length === 0 && (
                        <div style={{
                            textAlign: "center", padding: 56,
                            background: "white", borderRadius: 16, border: "1px solid var(--border)",
                        }}>
                            <Users size={32} style={{ color: "var(--border)", marginBottom: 12 }} />
                            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No leads found</p>
                        </div>
                    )}
                    {!loading && leads.map((lead) => {
                        const sc = STATUS_COLORS[lead.status] ?? STATUS_COLORS.new;
                        const bc = BAND_COLORS[lead.band] ?? "#7ba98b";
                        const isExpanded = expandedId === lead.id;
                        const seqDone = [lead.seq1SentAt, lead.seq2SentAt, lead.seq3SentAt].filter(Boolean).length;

                        return (
                            <div key={lead.id} style={{
                                background: "white", borderRadius: 14,
                                border: "1px solid var(--border)",
                                boxShadow: "0 1px 6px rgba(28,58,58,0.04)",
                                overflow: "hidden", transition: "box-shadow 0.15s",
                            }}>
                                {/* Main row */}
                                <div
                                    className="lead-row"
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr auto",
                                        gap: 12, padding: "14px 16px",
                                        cursor: "pointer", transition: "background 0.12s",
                                    }}
                                    onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                                        {/* Avatar */}
                                        <div style={{
                                            width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                                            background: `${bc}22`, display: "flex", alignItems: "center",
                                            justifyContent: "center", fontSize: 14, fontWeight: 600, color: bc,
                                        }}>
                                            {lead.name.charAt(0).toUpperCase()}
                                        </div>

                                        {/* Name + email */}
                                        <div style={{ minWidth: 0 }}>
                                            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--deep)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                {lead.name}
                                            </div>
                                            <div style={{ fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                {lead.email}
                                            </div>
                                        </div>

                                        {/* Badges — hidden on small screens via minWidth trick */}
                                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginLeft: 4 }}>
                                            <span style={{
                                                fontSize: 11, fontWeight: 600, padding: "3px 10px",
                                                borderRadius: 99, background: `${bc}18`, color: bc,
                                            }}>{lead.band}</span>
                                            <span style={{
                                                fontSize: 11, fontWeight: 600, padding: "3px 10px",
                                                borderRadius: 99, background: sc.bg, color: sc.text,
                                                display: "flex", alignItems: "center", gap: 4,
                                            }}>
                                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc.dot, display: "inline-block" }} />
                                                {lead.status}
                                            </span>
                                            {seqDone > 0 && (
                                                <span style={{
                                                    fontSize: 11, padding: "3px 10px", borderRadius: 99,
                                                    background: "#f0edf7", color: "#7b6fa9", fontWeight: 600,
                                                }}>
                                                    {seqDone}/3 sent
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right side */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                                        <span style={{ fontSize: 12, color: "var(--text-muted)", marginRight: 4 }}>
                                            Score {lead.score}/24
                                        </span>
                                        {isExpanded ? <ChevronUp size={16} style={{ color: "var(--text-muted)" }} /> : <ChevronDown size={16} style={{ color: "var(--text-muted)" }} />}
                                    </div>
                                </div>

                                {/* Expanded panel */}
                                {isExpanded && (
                                    <div style={{ borderTop: "1px solid var(--border)", padding: "16px 16px 18px" }}>
                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>

                                            {/* Left — details */}
                                            <div>
                                                <p style={{ fontSize: 11, fontWeight: 600, color: "var(--sage-dark)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Details</p>
                                                <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: "var(--text-muted)" }}>
                                                    <div><strong style={{ color: "var(--text)" }}>Phone:</strong> {lead.phone || "—"}</div>
                                                    <div><strong style={{ color: "var(--text)" }}>Submitted:</strong> {new Date(lead.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
                                                    <div><strong style={{ color: "var(--text)" }}>Severity:</strong> {lead.severity}</div>
                                                    {lead.notes && (
                                                        <div style={{ marginTop: 4, padding: "8px 12px", background: "#f7faf8", borderRadius: 8, border: "1px solid var(--border)", fontSize: 12, fontStyle: "italic", color: "var(--text-muted)" }}>
                                                            {lead.notes}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Score breakdown */}
                                                <p style={{ fontSize: 11, fontWeight: 600, color: "var(--sage-dark)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "14px 0 8px" }}>Breakdown</p>
                                                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                                                    {Object.entries(lead.answers).map(([k, v]) => (
                                                        <div key={k} style={{ display: "grid", gridTemplateColumns: "90px 1fr", alignItems: "center", gap: 8 }}>
                                                            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{QUESTION_LABELS[k] ?? k}</span>
                                                            <MiniBar value={v} color={bc} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Right — actions */}
                                            <div>
                                                {/* Status update */}
                                                <p style={{ fontSize: 11, fontWeight: 600, color: "var(--sage-dark)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Update Status</p>
                                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                                                    {["new", "contacted", "booked", "inactive"].map((s) => (
                                                        <button
                                                            key={s}
                                                            onClick={(e) => { e.stopPropagation(); updateStatus(lead.id, s); }}
                                                            style={{
                                                                padding: "5px 14px", borderRadius: 99, fontSize: 12,
                                                                fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                                                                border: lead.status === s ? `2px solid ${STATUS_COLORS[s].dot}` : "1.5px solid var(--border)",
                                                                background: lead.status === s ? STATUS_COLORS[s].bg : "white",
                                                                color: lead.status === s ? STATUS_COLORS[s].text : "var(--text-muted)",
                                                            }}
                                                        >
                                                            {s}
                                                        </button>
                                                    ))}
                                                </div>

                                                {/* Sequence tracking */}
                                                <p style={{ fontSize: 11, fontWeight: 600, color: "var(--sage-dark)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Marketing Sequence</p>
                                                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                                                    {[
                                                        { key: "seq1", label: "Email 1 — Value nudge", sent: lead.seq1SentAt },
                                                        { key: "seq2", label: "Email 2 — Check-in", sent: lead.seq2SentAt },
                                                        { key: "seq3", label: "Email 3 — Booking push", sent: lead.seq3SentAt },
                                                    ].map(({ key, label, sent }) => (
                                                        <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                                                            <div style={{ flex: 1 }}>
                                                                <div style={{ fontSize: 12, color: "var(--text)", fontWeight: 500 }}>{label}</div>
                                                                {sent && (
                                                                    <div style={{ fontSize: 11, color: "var(--sage-dark)" }}>
                                                                        Sent {new Date(sent).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <button
                                                                className="seq-btn"
                                                                disabled={!!sent || sending === key}
                                                                onClick={(e) => { e.stopPropagation(); sendMessage(lead.id, key); }}
                                                                style={{
                                                                    padding: "5px 14px", borderRadius: 99, fontSize: 12,
                                                                    fontWeight: 600, cursor: "pointer", border: "none",
                                                                    background: sent ? "#edf7f1" : "linear-gradient(135deg,#4e7a5e,#3d8b8b)",
                                                                    color: sent ? "var(--sage-dark)" : "white",
                                                                    transition: "all 0.15s", display: "flex", alignItems: "center", gap: 5,
                                                                }}
                                                            >
                                                                {sent ? <><CheckCircle size={11} /> Sent</> : sending === key ? "Sending…" : <><Send size={11} /> Send</>}
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Quick actions */}
                                                <p style={{ fontSize: 11, fontWeight: 600, color: "var(--sage-dark)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Quick Actions</p>
                                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); openDetail(lead); }}
                                                        style={{
                                                            display: "flex", alignItems: "center", gap: 5,
                                                            padding: "7px 14px", borderRadius: 10, fontSize: 12,
                                                            fontWeight: 500, cursor: "pointer", border: "1px solid var(--border)",
                                                            background: "white", color: "var(--text-muted)", transition: "all 0.15s",
                                                        }}
                                                        className="btn-ghost"
                                                    >
                                                        <Eye size={12} /> Full view
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); openNotes(lead); }}
                                                        style={{
                                                            display: "flex", alignItems: "center", gap: 5,
                                                            padding: "7px 14px", borderRadius: 10, fontSize: 12,
                                                            fontWeight: 500, cursor: "pointer", border: "1px solid var(--border)",
                                                            background: "white", color: "var(--text-muted)", transition: "all 0.15s",
                                                        }}
                                                        className="btn-ghost"
                                                    >
                                                        <Edit3 size={12} /> Notes
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); openMessage(lead); }}
                                                        style={{
                                                            display: "flex", alignItems: "center", gap: 5,
                                                            padding: "7px 14px", borderRadius: 10, fontSize: 12,
                                                            fontWeight: 500, cursor: "pointer", border: "none",
                                                            background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)",
                                                            color: "white", transition: "all 0.15s",
                                                        }}
                                                    >
                                                        <MessageSquare size={12} /> Custom message
                                                    </button>
                                                </div>

                                                {/* Message history */}
                                                {lead.messages.length > 0 && (
                                                    <div style={{ marginTop: 14 }}>
                                                        <p style={{ fontSize: 11, fontWeight: 600, color: "var(--sage-dark)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Message History</p>
                                                        <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 120, overflowY: "auto" }}>
                                                            {lead.messages.map((m) => (
                                                                <div key={m.id} style={{
                                                                    padding: "7px 10px", background: "#f7faf8",
                                                                    borderRadius: 8, border: "1px solid var(--border)",
                                                                }}>
                                                                    <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text)" }}>{m.subject}</div>
                                                                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
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

            {/* ── MODAL: Full detail ───────────────────────────────────────────── */}
            {modal === "detail" && selectedLead && (
                <div
                    className="modal-bg"
                    onClick={() => setModal(null)}
                    style={{
                        position: "fixed", inset: 0, background: "rgba(28,58,58,0.4)",
                        zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center",
                        padding: 16,
                    }}
                >
                    <div
                        className="modal-card"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: "white", borderRadius: 20, width: "100%", maxWidth: 600,
                            maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                        }}
                    >
                        {/* Modal header */}
                        <div style={{
                            padding: "20px 24px", borderBottom: "1px solid var(--border)",
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            position: "sticky", top: 0, background: "white", zIndex: 1,
                        }}>
                            <div>
                                <div style={{ fontSize: 18, fontFamily: "Cormorant Garamond, serif", fontWeight: 400, color: "var(--deep)" }}>
                                    {selectedLead.name}
                                </div>
                                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{selectedLead.email}</div>
                            </div>
                            <button onClick={() => setModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ padding: 24 }}>
                            {/* Severity banner */}
                            <div style={{
                                padding: "16px 20px", borderRadius: 14, marginBottom: 20,
                                background: `${BAND_COLORS[selectedLead.band] ?? "#7ba98b"}14`,
                                border: `1px solid ${BAND_COLORS[selectedLead.band] ?? "#7ba98b"}28`,
                            }}>
                                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: BAND_COLORS[selectedLead.band], fontWeight: 700, marginBottom: 4 }}>
                                    {selectedLead.severity}
                                </div>
                                <div style={{ fontSize: 22, fontWeight: 700, color: BAND_COLORS[selectedLead.band] }}>
                                    {selectedLead.score} <span style={{ fontSize: 14, fontWeight: 400, color: "var(--text-muted)" }}>/ 24</span>
                                </div>
                            </div>

                            {/* Info grid */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                                {[
                                    { label: "Email", value: selectedLead.email },
                                    { label: "Phone", value: selectedLead.phone || "—" },
                                    { label: "Status", value: selectedLead.status },
                                    { label: "Submitted", value: new Date(selectedLead.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) },
                                ].map(({ label, value }) => (
                                    <div key={label} style={{ padding: "12px 14px", background: "#f7faf8", borderRadius: 10, border: "1px solid var(--border)" }}>
                                        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--sage-dark)", fontWeight: 600, marginBottom: 4 }}>{label}</div>
                                        <div style={{ fontSize: 13, color: "var(--text)", wordBreak: "break-word" }}>{value}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Full breakdown */}
                            <p style={{ fontSize: 11, fontWeight: 600, color: "var(--sage-dark)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Area Breakdown</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                                {Object.entries(selectedLead.answers).map(([k, v]) => (
                                    <div key={k} style={{ display: "grid", gridTemplateColumns: "110px 1fr", alignItems: "center", gap: 10 }}>
                                        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{QUESTION_LABELS[k] ?? k}</span>
                                        <MiniBar value={v} color={BAND_COLORS[selectedLead.band] ?? "#7ba98b"} />
                                    </div>
                                ))}
                            </div>

                            {/* Notes */}
                            {selectedLead.notes && (
                                <>
                                    <p style={{ fontSize: 11, fontWeight: 600, color: "var(--sage-dark)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Notes</p>
                                    <div style={{ padding: "12px 14px", background: "#f7faf8", borderRadius: 10, border: "1px solid var(--border)", fontSize: 13, color: "var(--text-muted)", fontStyle: "italic", marginBottom: 20 }}>
                                        {selectedLead.notes}
                                    </div>
                                </>
                            )}

                            {/* Message history */}
                            {selectedLead.messages.length > 0 && (
                                <>
                                    <p style={{ fontSize: 11, fontWeight: 600, color: "var(--sage-dark)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>All Messages Sent</p>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                        {selectedLead.messages.map((m) => (
                                            <div key={m.id} style={{ padding: "10px 14px", background: "#f7faf8", borderRadius: 10, border: "1px solid var(--border)" }}>
                                                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{m.subject}</div>
                                                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>
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

            {/* ── MODAL: Notes ────────────────────────────────────────────────── */}
            {modal === "notes" && selectedLead && (
                <div
                    className="modal-bg"
                    onClick={() => setModal(null)}
                    style={{ position: "fixed", inset: 0, background: "rgba(28,58,58,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
                >
                    <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: 20, width: "100%", maxWidth: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", overflow: "hidden" }}>
                        <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ fontSize: 16, fontWeight: 600, color: "var(--deep)" }}>Notes — {selectedLead.name}</div>
                            <button onClick={() => setModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={18} /></button>
                        </div>
                        <div style={{ padding: 22 }}>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add your notes here — observations, follow-up reminders, context…"
                                rows={6}
                                style={{
                                    width: "100%", padding: "12px 14px", border: "1.5px solid var(--border)",
                                    borderRadius: 12, fontSize: 14, color: "var(--text)", resize: "vertical",
                                    outline: "none", background: "#f7faf8", lineHeight: 1.7,
                                }}
                                onFocus={(e) => (e.target.style.borderColor = "var(--sage)")}
                                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                            />
                            <div style={{ display: "flex", gap: 8, marginTop: 14, justifyContent: "flex-end" }}>
                                <button onClick={() => setModal(null)} style={{ padding: "9px 18px", borderRadius: 99, border: "1px solid var(--border)", background: "white", color: "var(--text-muted)", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                                    Cancel
                                </button>
                                <button
                                    onClick={saveNotes}
                                    disabled={savingNotes}
                                    style={{ padding: "9px 22px", borderRadius: 99, border: "none", background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                                >
                                    <FileText size={13} />
                                    {savingNotes ? "Saving…" : "Save notes"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── MODAL: Custom message ────────────────────────────────────────── */}
            {modal === "message" && selectedLead && (
                <div
                    className="modal-bg"
                    onClick={() => setModal(null)}
                    style={{ position: "fixed", inset: 0, background: "rgba(28,58,58,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
                >
                    <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: 20, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", overflow: "hidden" }}>
                        <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ fontSize: 16, fontWeight: 600, color: "var(--deep)" }}>Send message to {selectedLead.name}</div>
                            <button onClick={() => setModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={18} /></button>
                        </div>
                        <div style={{ padding: 22, overflowY: "auto", maxHeight: "calc(90vh - 60px)" }}>
                            <div style={{ marginBottom: 14 }}>
                                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--sage-dark)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Subject</label>
                                <input
                                    type="text"
                                    placeholder="Email subject…"
                                    value={customSubject}
                                    onChange={(e) => setCustomSubject(e.target.value)}
                                    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid var(--border)", borderRadius: 10, fontSize: 13, color: "var(--text)", outline: "none", background: "#f7faf8" }}
                                    onFocus={(e) => (e.target.style.borderColor = "var(--sage)")}
                                    onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                                />
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--sage-dark)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Message</label>
                                <textarea
                                    placeholder={`Write your message to ${selectedLead.name}…`}
                                    value={customBody}
                                    onChange={(e) => setCustomBody(e.target.value)}
                                    rows={7}
                                    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid var(--border)", borderRadius: 10, fontSize: 13, color: "var(--text)", resize: "vertical", outline: "none", background: "#f7faf8", lineHeight: 1.7 }}
                                    onFocus={(e) => (e.target.style.borderColor = "var(--sage)")}
                                    onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                                />
                                <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 5 }}>Your message will be wrapped in a clean branded email.</p>
                            </div>
                            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                <button onClick={() => setModal(null)} style={{ padding: "9px 18px", borderRadius: 99, border: "1px solid var(--border)", background: "white", color: "var(--text-muted)", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                                    Cancel
                                </button>
                                <button
                                    onClick={() => sendMessage(selectedLead.id, "custom", customSubject, customBody)}
                                    disabled={!customSubject.trim() || !customBody.trim() || sending === "custom"}
                                    style={{
                                        padding: "9px 22px", borderRadius: 99, border: "none",
                                        background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)", color: "white",
                                        fontSize: 13, fontWeight: 600, cursor: "pointer",
                                        display: "flex", alignItems: "center", gap: 6,
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