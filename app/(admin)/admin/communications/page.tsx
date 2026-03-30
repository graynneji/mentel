"use client";

// app/admin/communications/page.tsx
import { useState, useEffect, useCallback } from "react";
import {
    Mail, Send, CheckCircle, AlertCircle, X, RefreshCw,
    MessageSquare, Filter, Search, Clock, Users, Zap,
    ChevronDown, ChevronUp, BarChart2,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Message {
    id: string; createdAt: string; subject: string; body: string;
    type: string; sentBy: string;
    lead: { id: string; name: string; email: string; band: string };
}

interface MsgAnalytics {
    total: number; page: number; pages: number;
    typeCounts: Record<string, number>;
    sentByCounts: Record<string, number>;
    dailySends: { date: string; count: number }[];
}

interface Lead {
    id: string; name: string; email: string; band: string; status: string;
    seq1SentAt: string | null; seq2SentAt: string | null; seq3SentAt: string | null;
}

interface LeadAnalytics {
    total: number;
    statusCounts: Record<string, number>;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

const TYPE_CFG: Record<string, { bg: string; color: string; label: string }> = {
    seq1: { bg: "#edf7f1", color: "#4e7a5e", label: "Email 1" },
    seq2: { bg: "#e8f4f8", color: "#2a5a7a", label: "Email 2" },
    seq3: { bg: "#f0edf7", color: "#5a3a7a", label: "Email 3" },
    custom: { bg: "#fff8f0", color: "#7a5a2a", label: "Custom" },
};

const BAND_COLORS: Record<string, string> = {
    Low: "#4e8c6a", Mild: "#3d8b8b", Moderate: "#8b6e3d", High: "#b94a4f",
};

// ── Daily sends sparkline ──────────────────────────────────────────────────────
function DailySpark({ data }: { data: { date: string; count: number }[] }) {
    if (!data.length) return null;
    const max = Math.max(...data.map(d => d.count), 1);
    const W = 200, H = 40;
    const pts = data.map((d, i) => ({
        x: (i / Math.max(data.length - 1, 1)) * W,
        y: H - ((d.count / max) * H * 0.8) - 4,
        ...d,
    }));
    const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
    const areaPath = `${linePath} L${pts[pts.length - 1].x},${H} L0,${H} Z`;
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 40 }}>
            <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4e7a5e" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#4e7a5e" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#sg)" />
            <path d={linePath} fill="none" stroke="#4e7a5e" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            {pts.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r={2} fill="#4e7a5e" />
            ))}
        </svg>
    );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function CommunicationsPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [msgAnalytics, setMsgAnalytics] = useState<MsgAnalytics | null>(null);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [leadAnalytics, setLeadAnalytics] = useState<LeadAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [sending, setSending] = useState<string | null>(null);
    const [modal, setModal] = useState<"compose" | null>(null);
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
    const [expandedMsg, setExpandedMsg] = useState<string | null>(null);

    // Compose form
    const [composeLeadId, setComposeLeadId] = useState("");
    const [composeSubject, setComposeSubject] = useState("");
    const [composeBody, setComposeBody] = useState("");
    const [composing, setComposing] = useState(false);

    const showToast = (msg: string, ok = true) => {
        setToast({ msg, ok }); setTimeout(() => setToast(null), 3500);
    };

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const [msgRes, leadRes] = await Promise.all([
                fetch(`/api/admin/message?limit=100${typeFilter !== "all" ? `&type=${typeFilter}` : ""}`),
                fetch("/api/admin/leads?limit=200&status=new"),
            ]);
            const [msgData, leadData] = await Promise.all([msgRes.json(), leadRes.json()]);
            if (msgData.success) { setMessages(msgData.messages); setMsgAnalytics(msgData.analytics); }
            if (leadData.success) { setLeads(leadData.leads); setLeadAnalytics(leadData.analytics); }
        } finally { setLoading(false); }
    }, [typeFilter]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const sendSeq = async (leadId: string, type: string) => {
        setSending(`${leadId}-${type}`);
        try {
            const res = await fetch("/api/admin/message", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ leadId, type }),
            });
            const data = await res.json();
            if (data.success) { showToast("Sent!"); fetchAll(); }
            else showToast("Failed to send", false);
        } finally { setSending(null); }
    };

    const sendCustom = async () => {
        if (!composeLeadId || !composeSubject.trim() || !composeBody.trim()) return;
        setComposing(true);
        try {
            const res = await fetch("/api/admin/message", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ leadId: composeLeadId, type: "custom", customSubject: composeSubject, customBody: composeBody }),
            });
            const data = await res.json();
            if (data.success) {
                showToast("Message sent!"); setModal(null);
                setComposeLeadId(""); setComposeSubject(""); setComposeBody("");
                fetchAll();
            } else showToast("Failed", false);
        } finally { setComposing(false); }
    };

    const filteredMsgs = messages.filter(m =>
        !search || m.lead.name.toLowerCase().includes(search.toLowerCase()) ||
        m.lead.email.toLowerCase().includes(search.toLowerCase()) ||
        m.subject.toLowerCase().includes(search.toLowerCase())
    );

    // Leads needing first contact
    const uncontacted = leads.filter(l => !l.seq1SentAt && l.status === "new");

    const seqStats = [
        { key: "seq1", label: "Email 1 — Value nudge", color: "#4e7a5e", count: msgAnalytics?.typeCounts?.seq1 ?? 0 },
        { key: "seq2", label: "Email 2 — Check-in", color: "#3d8b8b", count: msgAnalytics?.typeCounts?.seq2 ?? 0 },
        { key: "seq3", label: "Email 3 — Booking push", color: "#7b6fa9", count: msgAnalytics?.typeCounts?.seq3 ?? 0 },
        { key: "custom", label: "Custom messages", color: "#8b6e3d", count: msgAnalytics?.typeCounts?.custom ?? 0 },
    ];
    const totalSent = seqStats.reduce((s, e) => s + e.count, 0);

    return (
        <div className="flex flex-col gap-4">
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
                    <h1 className="text-[18px] font-bold text-[#1c3a3a]">Communications</h1>
                    <p className="text-[12px] text-[#7a9088]">{totalSent} messages sent · {uncontacted.length} leads uncontacted</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchAll} className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#ddeae2] rounded-xl text-[12px] text-[#7a9088] cursor-pointer hover:bg-[#f7faf8]">
                        <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
                    </button>
                    <button onClick={() => setModal("compose")}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold text-white border-none cursor-pointer"
                        style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" }}>
                        <MessageSquare size={13} /> Compose
                    </button>
                </div>
            </div>

            {/* Sequence performance cards */}
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
                {seqStats.map(s => (
                    <div key={s.key} className="bg-white rounded-2xl border border-[#ddeae2] p-4 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
                        <div className="flex items-center justify-between mb-2">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${s.color}18` }}>
                                <Mail size={13} style={{ color: s.color }} />
                            </div>
                            <span className="text-[10px] font-semibold px-2 py-[2px] rounded-full" style={{ background: `${s.color}18`, color: s.color }}>
                                {totalSent > 0 ? `${((s.count / totalSent) * 100).toFixed(0)}%` : "0%"}
                            </span>
                        </div>
                        <div className="text-[22px] font-bold text-[#1c3a3a]">{s.count}</div>
                        <div className="text-[11px] text-[#7a9088] mt-0.5">{s.label}</div>
                        <div className="mt-2 h-1.5 bg-[#f0f4f2] rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700"
                                style={{ width: `${totalSent > 0 ? (s.count / totalSent) * 100 : 0}%`, background: s.color }} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Activity + uncontacted */}
            <div className="grid gap-4" style={{ gridTemplateColumns: "2fr 1fr" }}>
                {/* Daily activity */}
                <div className="bg-white rounded-2xl border border-[#ddeae2] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <div className="text-[13px] font-semibold text-[#1c3a3a]">Send Activity</div>
                            <div className="text-[11px] text-[#7a9088]">Last 14 days</div>
                        </div>
                        <span className="text-[20px] font-bold text-[#1c3a3a]">{totalSent}</span>
                    </div>
                    <DailySpark data={msgAnalytics?.dailySends ?? []} />
                    {(!msgAnalytics?.dailySends?.length) && (
                        <div className="h-[40px] flex items-center justify-center text-[11px] text-[#b0c8bc]">No activity yet</div>
                    )}
                </div>

                {/* Uncontacted leads */}
                <div className="bg-white rounded-2xl border border-[#ddeae2] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
                    <div className="flex items-center gap-1.5 mb-3">
                        <Zap size={14} className="text-[#8b6e3d]" />
                        <div className="text-[13px] font-semibold text-[#1c3a3a]">Quick Outreach</div>
                    </div>
                    {uncontacted.length === 0 ? (
                        <div className="flex items-center gap-2 py-3">
                            <CheckCircle size={16} className="text-[#4e8c6a]" />
                            <p className="text-[12px] text-[#7a9088]">All new leads have been contacted 🎉</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto">
                            {uncontacted.slice(0, 6).map(l => {
                                const bc = BAND_COLORS[l.band] ?? "#7ba98b";
                                const key = `${l.id}-seq1`;
                                return (
                                    <div key={l.id} className="flex items-center gap-2 p-2 bg-[#f7faf8] rounded-xl border border-[#e8f0ec]">
                                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0" style={{ background: bc }}>
                                            {l.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[12px] font-semibold text-[#1c3a3a] truncate">{l.name}</div>
                                            <div className="text-[10px] text-[#7a9088]">{l.band} severity</div>
                                        </div>
                                        <button onClick={() => sendSeq(l.id, "seq1")} disabled={sending === key}
                                            className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-white border-none cursor-pointer shrink-0 flex items-center gap-1"
                                            style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)", opacity: sending === key ? 0.6 : 1 }}>
                                            <Send size={10} /> {sending === key ? "…" : "Send"}
                                        </button>
                                    </div>
                                );
                            })}
                            {uncontacted.length > 6 && (
                                <p className="text-[11px] text-[#7a9088] text-center pt-1">+{uncontacted.length - 6} more</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Message log */}
            <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-[0_1px_8px_rgba(28,58,58,0.04)] overflow-hidden">
                {/* Log header + filters */}
                <div className="px-5 py-4 border-b border-[#f0f4f2] flex flex-wrap gap-2 items-center">
                    <div className="text-[13px] font-semibold text-[#1c3a3a]">Message Log</div>
                    <div className="ml-auto flex flex-wrap gap-2 items-center">
                        <div className="relative">
                            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7a9088]" />
                            <input type="text" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}
                                className="pl-7 pr-3 py-1.5 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a] w-40"
                                style={{ fontFamily: "inherit" }} />
                        </div>
                        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                            className="py-1.5 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a] cursor-pointer"
                            style={{ fontFamily: "inherit", appearance: "none" }}>
                            <option value="all">All types</option>
                            <option value="seq1">Email 1</option>
                            <option value="seq2">Email 2</option>
                            <option value="seq3">Email 3</option>
                            <option value="custom">Custom</option>
                        </select>
                        <span className="text-[11px] text-[#7a9088]">{filteredMsgs.length} messages</span>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-[#7a9088] text-sm">
                        <div className="w-6 h-6 rounded-full border-2 border-[#4e8c6a] border-t-transparent animate-spin mx-auto mb-2" />
                        Loading…
                    </div>
                ) : filteredMsgs.length === 0 ? (
                    <div className="text-center py-14">
                        <Mail size={28} className="text-[#ddeae2] mb-2 mx-auto" />
                        <p className="text-[#7a9088] text-sm">No messages found</p>
                    </div>
                ) : (
                    <div className="flex flex-col divide-y divide-[#f7faf8]">
                        {filteredMsgs.map(m => {
                            console.log(m, "message log item");
                            const tc = TYPE_CFG[m.type] ?? TYPE_CFG.custom;
                            const isExp = expandedMsg === m.id;
                            return (
                                <div key={m.id} className="hover:bg-[#f7faf8] transition-colors">
                                    <div className="flex items-start gap-3 px-5 py-3 cursor-pointer" onClick={() => setExpandedMsg(isExp ? null : m.id)}>
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: tc.bg }}>
                                            <Mail size={13} style={{ color: tc.color }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-[13px] font-semibold text-[#1c3a3a] truncate">{m.subject}</span>
                                                <span className="text-[10px] font-bold px-2 py-[2px] rounded-full" style={{ background: tc.bg, color: tc.color }}>{tc.label}</span>
                                            </div>
                                            <div className="text-[11px] text-[#7a9088] mt-0.5">
                                                To: <span className="font-medium text-[#1c3a3a]">{m.lead.name}</span> · {m.lead.email}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-[11px] text-[#7a9088]">{fmtDate(m.createdAt)}</span>
                                            {isExp ? <ChevronUp size={13} className="text-[#7a9088]" /> : <ChevronDown size={13} className="text-[#7a9088]" />}
                                        </div>
                                    </div>
                                    {isExp && m.body && (
                                        <div className="px-16 pb-4">
                                            <div className="px-4 py-3 bg-[#f7faf8] rounded-xl border border-[#e8f0ec] text-[12px] text-[#1c3a3a] leading-relaxed whitespace-pre-wrap">
                                                {m.body}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── MODAL: Compose ── */}
            {modal === "compose" && (
                <div className="modal-bg fixed inset-0 bg-[rgba(28,58,58,0.45)] z-[200] flex items-center justify-center p-4" onClick={() => setModal(null)}>
                    <div className="modal-card bg-white rounded-2xl w-full max-w-[500px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="px-5 py-4 border-b border-[#ddeae2] flex items-center justify-between">
                            <div className="text-[15px] font-semibold text-[#1c3a3a]">Compose Message</div>
                            <button onClick={() => setModal(null)} className="bg-transparent border-none cursor-pointer text-[#7a9088]"><X size={18} /></button>
                        </div>
                        <div className="p-5 flex flex-col gap-3">
                            <div>
                                <label className="block text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-1.5">Recipient</label>
                                <select value={composeLeadId} onChange={e => setComposeLeadId(e.target.value)}
                                    className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]"
                                    style={{ fontFamily: "inherit", appearance: "none" }}>
                                    <option value="">— Select a patient —</option>
                                    {leads.map(l => <option key={l.id} value={l.id}>{l.name} · {l.email}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-1.5">Subject</label>
                                <input type="text" value={composeSubject} onChange={e => setComposeSubject(e.target.value)} placeholder="Email subject…"
                                    className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]"
                                    style={{ fontFamily: "inherit" }} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-1.5">Message</label>
                                <textarea value={composeBody} onChange={e => setComposeBody(e.target.value)} rows={6} placeholder="Write your message…"
                                    className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a] resize-y leading-relaxed"
                                    style={{ fontFamily: "inherit" }} />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-[#ddeae2] bg-white text-[#7a9088] text-[12px] cursor-pointer">Cancel</button>
                                <button onClick={sendCustom} disabled={!composeLeadId || !composeSubject.trim() || !composeBody.trim() || composing}
                                    className="px-5 py-2 rounded-xl border-none text-white text-[12px] font-semibold cursor-pointer flex items-center gap-1.5"
                                    style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)", opacity: !composeLeadId || !composeSubject.trim() || !composeBody.trim() ? 0.5 : 1 }}>
                                    <Send size={12} /> {composing ? "Sending…" : "Send Message"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}