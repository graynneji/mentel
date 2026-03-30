// // "use client";

// // import { useState, useEffect, useCallback } from "react";
// // import {
// //     Search, Filter, Send, FileText, ChevronDown, ChevronUp,
// //     Mail, MessageSquare, User, TrendingUp, Clock, CheckCircle,
// //     AlertCircle, X, MoreVertical, RefreshCw, Eye, Edit3,
// //     ArrowUpRight, Inbox, Users, Activity, Menu,
// // } from "lucide-react";
// // import AdminLogout from "@/components/Logout";
// // import Link from "next/link";
// // import Image from "next/image";

// // // ── Types ──────────────────────────────────────────────────────────────────────

// // interface Message {
// //     id: string;
// //     createdAt: string;
// //     subject: string;
// //     body: string;
// //     type: string;
// //     sentBy: string;
// // }

// // interface Lead {
// //     id: string;
// //     createdAt: string;
// //     name: string;
// //     email: string;
// //     phone: string | null;
// //     score: number;
// //     band: string;
// //     severity: string;
// //     answers: Record<string, number>;
// //     status: string;
// //     notes: string | null;
// //     seq1SentAt: string | null;
// //     seq2SentAt: string | null;
// //     seq3SentAt: string | null;
// //     messages: Message[];
// // }

// // type ModalType = "detail" | "message" | "notes" | null;

// // const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
// //     new: { bg: "#edf7f1", text: "#3a7a58", dot: "#7ba98b" },
// //     contacted: { bg: "#e8f4f8", text: "#2a5a7a", dot: "#6fb8b8" },
// //     booked: { bg: "#f0edf7", text: "#5a3a7a", dot: "#a88bcf" },
// //     inactive: { bg: "#f5f5f5", text: "#7a7a7a", dot: "#b0b0b0" },
// // };

// // const BAND_COLORS: Record<string, string> = {
// //     Low: "#4e8c6a",
// //     Mild: "#3d8b8b",
// //     Moderate: "#5a6e8a",
// //     High: "#b94a4f",
// // };

// // const QUESTION_LABELS: Record<string, string> = {
// //     q1: "Mood", q2: "Anxiety", q3: "Energy", q4: "Sleep",
// //     q5: "Relationships", q6: "Stress", q7: "Self-worth", q8: "Support",
// // };

// // // ── Stat card ──────────────────────────────────────────────────────────────────
// // function StatCard({ icon: Icon, label, value, sub, color }: {
// //     icon: React.ElementType; label: string; value: string | number;
// //     sub?: string; color: string;
// // }) {
// //     return (
// //         <div className="bg-white rounded-2xl border border-[var(--border)] shadow-[0_1px_8px_rgba(28,58,58,0.05)] flex items-start gap-3.5 px-[22px] py-5">
// //             <div
// //                 className="w-10 h-10 rounded-[10px] shrink-0 flex items-center justify-center"
// //                 style={{ background: `${color}18` }}
// //             >
// //                 <Icon size={18} style={{ color }} />
// //             </div>
// //             <div>
// //                 <div className="text-[22px] font-semibold text-[var(--deep)] leading-tight">{value}</div>
// //                 <div className="text-xs text-[var(--text-muted)] mt-0.5">{label}</div>
// //                 {sub && <div className="text-[11px] mt-0.5 font-medium" style={{ color }}>{sub}</div>}
// //             </div>
// //         </div>
// //     );
// // }

// // // ── Score mini bar ────────────────────────────────────────────────────────────
// // function MiniBar({ value, max = 3, color }: { value: number; max?: number; color: string }) {
// //     return (
// //         <div className="flex items-center gap-1.5">
// //             <div className="flex-1 h-[5px] bg-[#e8eeea] rounded-full overflow-hidden">
// //                 <div
// //                     className="h-full rounded-full"
// //                     style={{ width: `${Math.round((value / max) * 100)}%`, background: color }}
// //                 />
// //             </div>
// //             <span className="text-[11px] text-[var(--text-muted)] shrink-0">{value}/{max}</span>
// //         </div>
// //     );
// // }

// // // ── Main component ─────────────────────────────────────────────────────────────
// // export default function AdminPage() {
// //     const [leads, setLeads] = useState<Lead[]>([]);
// //     const [loading, setLoading] = useState(true);
// //     const [search, setSearch] = useState("");
// //     const [statusFilter, setStatusFilter] = useState("all");
// //     const [bandFilter, setBandFilter] = useState("all");
// //     const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
// //     const [modal, setModal] = useState<ModalType>(null);
// //     const [notes, setNotes] = useState("");
// //     const [savingNotes, setSavingNotes] = useState(false);
// //     const [customSubject, setCustomSubject] = useState("");
// //     const [customBody, setCustomBody] = useState("");
// //     const [sending, setSending] = useState<string | null>(null);
// //     const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
// //     const [expandedId, setExpandedId] = useState<string | null>(null);
// //     const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

// //     const showToast = (msg: string, ok = true) => {
// //         setToast({ msg, ok });
// //         setTimeout(() => setToast(null), 3500);
// //     };

// //     const fetchLeads = useCallback(async () => {
// //         setLoading(true);
// //         try {
// //             const params = new URLSearchParams();
// //             if (search) params.set("search", search);
// //             if (statusFilter !== "all") params.set("status", statusFilter);
// //             if (bandFilter !== "all") params.set("band", bandFilter);
// //             const res = await fetch(`/api/admin/leads?${params.toString()}`);
// //             const data = await res.json() as { success: boolean; leads: Lead[] };
// //             if (data.success) setLeads(data.leads);
// //         } catch {
// //             showToast("Failed to load leads", false);
// //         } finally {
// //             setLoading(false);
// //         }
// //     }, [search, statusFilter, bandFilter]);

// //     useEffect(() => {
// //         const t = setTimeout(fetchLeads, 300);
// //         return () => clearTimeout(t);
// //     }, [fetchLeads]);

// //     async function updateStatus(id: string, status: string) {
// //         await fetch("/api/admin/leads", {
// //             method: "PATCH",
// //             headers: { "Content-Type": "application/json" },
// //             body: JSON.stringify({ id, status }),
// //         });
// //         setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l));
// //         showToast("Status updated");
// //     }

// //     async function saveNotes() {
// //         if (!selectedLead) return;
// //         setSavingNotes(true);
// //         await fetch("/api/admin/leads", {
// //             method: "PATCH",
// //             headers: { "Content-Type": "application/json" },
// //             body: JSON.stringify({ id: selectedLead.id, notes }),
// //         });
// //         setLeads((prev) => prev.map((l) => l.id === selectedLead.id ? { ...l, notes } : l));
// //         setSavingNotes(false);
// //         showToast("Notes saved");
// //         setModal(null);
// //     }

// //     async function sendMessage(leadId: string, type: string, customSubj?: string, customBod?: string) {
// //         setSending(type);
// //         try {
// //             const res = await fetch("/api/admin/message", {
// //                 method: "POST",
// //                 headers: { "Content-Type": "application/json" },
// //                 body: JSON.stringify({
// //                     leadId,
// //                     type,
// //                     ...(type === "custom" ? { customSubject: customSubj, customBody: customBod } : {}),
// //                 }),
// //             });
// //             const data = await res.json() as { success: boolean };
// //             if (data.success) {
// //                 showToast("Message sent successfully");
// //                 setCustomSubject("");
// //                 setCustomBody("");
// //                 setModal(null);
// //                 fetchLeads();
// //             } else {
// //                 showToast("Failed to send message", false);
// //             }
// //         } catch {
// //             showToast("Failed to send message", false);
// //         } finally {
// //             setSending(null);
// //         }
// //     }

// //     const stats = {
// //         total: leads.length,
// //         new: leads.filter((l) => l.status === "new").length,
// //         contacted: leads.filter((l) => l.status === "contacted").length,
// //         booked: leads.filter((l) => l.status === "booked").length,
// //         high: leads.filter((l) => l.band === "High").length,
// //     };

// //     const openDetail = (lead: Lead) => { setSelectedLead(lead); setNotes(lead.notes ?? ""); setModal("detail"); };
// //     const openNotes = (lead: Lead) => { setSelectedLead(lead); setNotes(lead.notes ?? ""); setModal("notes"); };
// //     const openMessage = (lead: Lead) => { setSelectedLead(lead); setModal("message"); };

// //     return (
// //         <div className="min-h-screen bg-[#f2f6f3] font-[DM_Sans,sans-serif]">

// //             <style>{`
// //                 @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
// //                 @keyframes slideIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
// //                 @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
// //                 @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
// //                 .modal-bg { animation: fadeIn 0.18s ease; }
// //                 .modal-card { animation: slideUp 0.22s ease; }
// //                 select { appearance: none; -webkit-appearance: none; }
// //                 textarea, input { font-family: inherit; }
// //                 .lead-row:hover { background: #f7faf8 !important; }
// //                 .btn-ghost:hover { background: rgba(123,169,139,0.1) !important; }
// //                 .seq-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
// //                 .seq-btn:disabled { opacity: 0.5; cursor: not-allowed; }
// //                 ::-webkit-scrollbar { width: 5px; height: 5px; }
// //                 ::-webkit-scrollbar-track { background: transparent; }
// //                 ::-webkit-scrollbar-thumb { background: #c8ddd2; border-radius: 99px; }
// //             `}</style>

// //             {/* Toast */}
// //             {toast && (
// //                 <div
// //                     className="fixed top-5 right-5 z-[9999] text-white px-5 py-3 rounded-xl text-[13px] font-medium shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex items-center gap-2"
// //                     style={{ background: toast.ok ? "#1c3a3a" : "#b94a4f", animation: "slideIn 0.2s ease" }}
// //                 >
// //                     {toast.ok ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
// //                     {toast.msg}
// //                 </div>
// //             )}

// //             {/* ── Header ── */}
// //             <div className="bg-white border-b border-[var(--border)] px-6 sticky top-0 z-[100] shadow-[0_1px_8px_rgba(28,58,58,0.05)]">
// //                 <div className="max-w-[1280px] mx-auto flex items-center justify-between h-[60px]">

// //                     {/* Left: logo + badge */}
// //                     <div className="flex items-center gap-2.5">
// //                         <Link href="/" className="flex items-center gap-2.5">
// //                             <Image src="/logo.png" alt="Mentel logo" width={108} height={61} className="object-contain" priority />
// //                         </Link>
// //                         <span className="text-[11px] font-semibold text-[var(--sage-dark)] bg-[#edf7f1] border border-[#c8ddd2] rounded-full px-2.5 py-0.5 ml-1 uppercase tracking-[0.06em]">
// //                             Admin
// //                         </span>
// //                     </div>

// //                     {/* Desktop actions */}
// //                     <div className="hidden sm:flex items-center gap-2">
// //                         <button
// //                             onClick={fetchLeads}
// //                             className="btn-ghost flex items-center gap-1.5 px-3.5 py-[7px] rounded-[10px] border border-[var(--border)] bg-white text-[var(--text-muted)] text-xs font-medium cursor-pointer transition-all duration-150"
// //                         >
// //                             <RefreshCw size={13} style={{ color: loading ? "var(--sage)" : undefined }} />
// //                             Refresh
// //                         </button>
// //                         <AdminLogout />
// //                     </div>

// //                     {/* Mobile hamburger */}
// //                     <button
// //                         className="sm:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--border)] bg-white text-[var(--text-muted)] cursor-pointer"
// //                         onClick={() => setMobileMenuOpen((o) => !o)}
// //                         aria-label="Toggle menu"
// //                     >
// //                         {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
// //                     </button>
// //                 </div>

// //                 {/* Mobile dropdown */}
// //                 {mobileMenuOpen && (
// //                     <div className="sm:hidden border-t border-[var(--border)] py-3 flex flex-col gap-2">
// //                         <button
// //                             onClick={() => { fetchLeads(); setMobileMenuOpen(false); }}
// //                             className="btn-ghost flex items-center gap-2 w-full px-4 py-2.5 rounded-[10px] border border-[var(--border)] bg-white text-[var(--text-muted)] text-sm font-medium cursor-pointer transition-all duration-150"
// //                         >
// //                             <RefreshCw size={14} style={{ color: loading ? "var(--sage)" : undefined }} />
// //                             Refresh
// //                         </button>
// //                         <AdminLogout />
// //                     </div>
// //                 )}
// //             </div>

// //             <div className="max-w-[1280px] mx-auto px-4 py-6">

// //                 {/* Stats row */}
// //                 <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
// //                     <StatCard icon={Users} label="Total leads" value={stats.total} color="#4e7a5e" />
// //                     <StatCard icon={Inbox} label="New" value={stats.new} color="#7ba98b" sub={stats.new > 0 ? "Needs attention" : undefined} />
// //                     <StatCard icon={Mail} label="Contacted" value={stats.contacted} color="#3d8b8b" />
// //                     <StatCard icon={CheckCircle} label="Booked" value={stats.booked} color="#7b6fa9" />
// //                     <StatCard icon={AlertCircle} label="High severity" value={stats.high} color="#b94a4f" sub={stats.high > 0 ? "Priority follow-up" : undefined} />
// //                 </div>

// //                 {/* Filters */}
// //                 <div className="bg-white rounded-2xl border border-[var(--border)] px-[18px] py-3.5 mb-4 flex flex-wrap gap-2.5 items-center shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
// //                     {/* Search */}
// //                     <div className="relative flex-[1_1_200px] min-w-[180px]">
// //                         <Search size={14} className="absolute left-[11px] top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
// //                         <input
// //                             type="text"
// //                             placeholder="Search name, email, phone…"
// //                             value={search}
// //                             onChange={(e) => setSearch(e.target.value)}
// //                             className="w-full py-[9px] pr-3 pl-8 border-[1.5px] border-[var(--border)] rounded-[10px] text-base text-[var(--text)] bg-[#f7faf8] outline-none transition-[border-color] duration-150"
// //                             onFocus={(e) => (e.target.style.borderColor = "var(--sage)")}
// //                             onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
// //                         />
// //                     </div>

// //                     {/* Status filter */}
// //                     <div className="relative">
// //                         <Filter size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
// //                         <select
// //                             value={statusFilter}
// //                             onChange={(e) => setStatusFilter(e.target.value)}
// //                             className="py-[9px] pl-7 pr-7 border-[1.5px] border-[var(--border)] rounded-[10px] text-[13px] text-[var(--text)] bg-[#f7faf8] cursor-pointer outline-none"
// //                         >
// //                             <option value="all">All statuses</option>
// //                             <option value="new">New</option>
// //                             <option value="contacted">Contacted</option>
// //                             <option value="booked">Booked</option>
// //                             <option value="inactive">Inactive</option>
// //                         </select>
// //                     </div>

// //                     {/* Band filter */}
// //                     <div className="relative">
// //                         <Activity size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
// //                         <select
// //                             value={bandFilter}
// //                             onChange={(e) => setBandFilter(e.target.value)}
// //                             className="py-[9px] pl-7 pr-7 border-[1.5px] border-[var(--border)] rounded-[10px] text-[13px] text-[var(--text)] bg-[#f7faf8] cursor-pointer outline-none"
// //                         >
// //                             <option value="all">All severities</option>
// //                             <option value="Low">Low</option>
// //                             <option value="Mild">Mild</option>
// //                             <option value="Moderate">Moderate</option>
// //                             <option value="High">High</option>
// //                         </select>
// //                     </div>

// //                     <span className="text-xs text-[var(--text-muted)] ml-auto">
// //                         {leads.length} result{leads.length !== 1 ? "s" : ""}
// //                     </span>
// //                 </div>

// //                 {/* Leads list */}
// //                 <div className="flex flex-col gap-2">
// //                     {loading && (
// //                         <div className="text-center py-12 text-[var(--text-muted)] text-sm">
// //                             Loading leads…
// //                         </div>
// //                     )}
// //                     {!loading && leads.length === 0 && (
// //                         <div className="text-center py-14 bg-white rounded-2xl border border-[var(--border)]">
// //                             <Users size={32} className="text-[var(--border)] mb-3 mx-auto" />
// //                             <p className="text-[var(--text-muted)] text-sm">No leads found</p>
// //                         </div>
// //                     )}
// //                     {!loading && leads.map((lead) => {
// //                         const sc = STATUS_COLORS[lead.status] ?? STATUS_COLORS.new;
// //                         const bc = BAND_COLORS[lead.band] ?? "#7ba98b";
// //                         const isExpanded = expandedId === lead.id;
// //                         const seqDone = [lead.seq1SentAt, lead.seq2SentAt, lead.seq3SentAt].filter(Boolean).length;

// //                         return (
// //                             <div
// //                                 key={lead.id}
// //                                 className="bg-white rounded-[14px] border border-[var(--border)] shadow-[0_1px_6px_rgba(28,58,58,0.04)] overflow-hidden transition-shadow duration-150"
// //                             >
// //                                 {/* Main row */}
// //                                 <div
// //                                     className="lead-row grid gap-3 px-4 py-3.5 cursor-pointer transition-[background] duration-[120ms]"
// //                                     style={{ gridTemplateColumns: "1fr auto" }}
// //                                     onClick={() => setExpandedId(isExpanded ? null : lead.id)}
// //                                 >
// //                                     <div className="flex items-center gap-3 min-w-0">
// //                                         {/* Avatar */}
// //                                         <div
// //                                             className="w-[38px] h-[38px] rounded-full shrink-0 flex items-center justify-center text-sm font-semibold"
// //                                             style={{ background: `${bc}22`, color: bc }}
// //                                         >
// //                                             {lead.name.charAt(0).toUpperCase()}
// //                                         </div>

// //                                         {/* Name + email */}
// //                                         <div className="min-w-0">
// //                                             <div className="text-sm font-semibold text-[var(--deep)] whitespace-nowrap overflow-hidden text-ellipsis">
// //                                                 {lead.name}
// //                                             </div>
// //                                             <div className="text-xs text-[var(--text-muted)] whitespace-nowrap overflow-hidden text-ellipsis">
// //                                                 {lead.email}
// //                                             </div>
// //                                         </div>

// //                                         {/* Badges */}
// //                                         <div className="flex gap-1.5 flex-wrap ml-1">
// //                                             <span
// //                                                 className="text-[11px] font-semibold px-2.5 py-[3px] rounded-full"
// //                                                 style={{ background: `${bc}18`, color: bc }}
// //                                             >{lead.band}</span>
// //                                             <span
// //                                                 className="text-[11px] font-semibold px-2.5 py-[3px] rounded-full flex items-center gap-1"
// //                                                 style={{ background: sc.bg, color: sc.text }}
// //                                             >
// //                                                 <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: sc.dot }} />
// //                                                 {lead.status}
// //                                             </span>
// //                                             {seqDone > 0 && (
// //                                                 <span className="text-[11px] px-2.5 py-[3px] rounded-full bg-[#f0edf7] text-[#7b6fa9] font-semibold">
// //                                                     {seqDone}/3 sent
// //                                                 </span>
// //                                             )}
// //                                         </div>
// //                                     </div>

// //                                     {/* Right side */}
// //                                     <div className="flex items-center gap-1.5 shrink-0">
// //                                         <span className="text-xs text-[var(--text-muted)] mr-1">Score {lead.score}/24</span>
// //                                         {isExpanded
// //                                             ? <ChevronUp size={16} className="text-[var(--text-muted)]" />
// //                                             : <ChevronDown size={16} className="text-[var(--text-muted)]" />}
// //                                     </div>
// //                                 </div>

// //                                 {/* Expanded panel */}
// //                                 {isExpanded && (
// //                                     <div className="border-t border-[var(--border)] px-4 pt-4 pb-[18px]">
// //                                         <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>

// //                                             {/* Left — details */}
// //                                             <div>
// //                                                 <p className="text-[11px] font-semibold text-[var(--sage-dark)] uppercase tracking-[0.08em] mb-2.5">Details</p>
// //                                                 <div className="flex flex-col gap-1.5 text-[13px] text-[var(--text-muted)]">
// //                                                     <div><strong className="text-[var(--text)]">Phone:</strong> {lead.phone || "—"}</div>
// //                                                     <div><strong className="text-[var(--text)]">Submitted:</strong> {new Date(lead.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
// //                                                     <div><strong className="text-[var(--text)]">Severity:</strong> {lead.severity}</div>
// //                                                     {lead.notes && (
// //                                                         <div className="mt-1 px-3 py-2 bg-[#f7faf8] rounded-lg border border-[var(--border)] text-xs italic text-[var(--text-muted)]">
// //                                                             {lead.notes}
// //                                                         </div>
// //                                                     )}
// //                                                 </div>

// //                                                 <p className="text-[11px] font-semibold text-[var(--sage-dark)] uppercase tracking-[0.08em] mt-3.5 mb-2">Breakdown</p>
// //                                                 <div className="flex flex-col gap-[5px]">
// //                                                     {Object.entries(lead.answers).map(([k, v]) => (
// //                                                         <div key={k} className="grid items-center gap-2" style={{ gridTemplateColumns: "90px 1fr" }}>
// //                                                             <span className="text-xs text-[var(--text-muted)]">{QUESTION_LABELS[k] ?? k}</span>
// //                                                             <MiniBar value={v} color={bc} />
// //                                                         </div>
// //                                                     ))}
// //                                                 </div>
// //                                             </div>

// //                                             {/* Right — actions */}
// //                                             <div>
// //                                                 <p className="text-[11px] font-semibold text-[var(--sage-dark)] uppercase tracking-[0.08em] mb-2">Update Status</p>
// //                                                 <div className="flex flex-wrap gap-1.5 mb-4">
// //                                                     {["new", "contacted", "booked", "inactive"].map((s) => (
// //                                                         <button
// //                                                             key={s}
// //                                                             onClick={(e) => { e.stopPropagation(); updateStatus(lead.id, s); }}
// //                                                             className="px-3.5 py-[5px] rounded-full text-xs font-semibold cursor-pointer transition-all duration-150"
// //                                                             style={{
// //                                                                 border: lead.status === s ? `2px solid ${STATUS_COLORS[s].dot}` : "1.5px solid var(--border)",
// //                                                                 background: lead.status === s ? STATUS_COLORS[s].bg : "white",
// //                                                                 color: lead.status === s ? STATUS_COLORS[s].text : "var(--text-muted)",
// //                                                             }}
// //                                                         >
// //                                                             {s}
// //                                                         </button>
// //                                                     ))}
// //                                                 </div>

// //                                                 <p className="text-[11px] font-semibold text-[var(--sage-dark)] uppercase tracking-[0.08em] mb-2">Marketing Sequence</p>
// //                                                 <div className="flex flex-col gap-1.5 mb-4">
// //                                                     {[
// //                                                         { key: "seq1", label: "Email 1 — Value nudge", sent: lead.seq1SentAt },
// //                                                         { key: "seq2", label: "Email 2 — Check-in", sent: lead.seq2SentAt },
// //                                                         { key: "seq3", label: "Email 3 — Booking push", sent: lead.seq3SentAt },
// //                                                     ].map(({ key, label, sent }) => (
// //                                                         <div key={key} className="flex items-center justify-between gap-2">
// //                                                             <div className="flex-1">
// //                                                                 <div className="text-xs text-[var(--text)] font-medium">{label}</div>
// //                                                                 {sent && (
// //                                                                     <div className="text-[11px] text-[var(--sage-dark)]">
// //                                                                         Sent {new Date(sent).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
// //                                                                     </div>
// //                                                                 )}
// //                                                             </div>
// //                                                             <button
// //                                                                 className="seq-btn px-3.5 py-[5px] rounded-full text-xs font-semibold cursor-pointer border-none transition-all duration-150 flex items-center gap-[5px]"
// //                                                                 disabled={!!sent || sending === key}
// //                                                                 onClick={(e) => { e.stopPropagation(); sendMessage(lead.id, key); }}
// //                                                                 style={{
// //                                                                     background: sent ? "#edf7f1" : "linear-gradient(135deg,#4e7a5e,#3d8b8b)",
// //                                                                     color: sent ? "var(--sage-dark)" : "white",
// //                                                                 }}
// //                                                             >
// //                                                                 {sent ? <><CheckCircle size={11} /> Sent</> : sending === key ? "Sending…" : <><Send size={11} /> Send</>}
// //                                                             </button>
// //                                                         </div>
// //                                                     ))}
// //                                                 </div>

// //                                                 <p className="text-[11px] font-semibold text-[var(--sage-dark)] uppercase tracking-[0.08em] mb-2">Quick Actions</p>
// //                                                 <div className="flex flex-wrap gap-1.5">
// //                                                     <button
// //                                                         onClick={(e) => { e.stopPropagation(); openDetail(lead); }}
// //                                                         className="btn-ghost flex items-center gap-[5px] px-3.5 py-[7px] rounded-[10px] text-xs font-medium cursor-pointer border border-[var(--border)] bg-white text-[var(--text-muted)] transition-all duration-150"
// //                                                     >
// //                                                         <Eye size={12} /> Full view
// //                                                     </button>
// //                                                     <button
// //                                                         onClick={(e) => { e.stopPropagation(); openNotes(lead); }}
// //                                                         className="btn-ghost flex items-center gap-[5px] px-3.5 py-[7px] rounded-[10px] text-xs font-medium cursor-pointer border border-[var(--border)] bg-white text-[var(--text-muted)] transition-all duration-150"
// //                                                     >
// //                                                         <Edit3 size={12} /> Notes
// //                                                     </button>
// //                                                     <button
// //                                                         onClick={(e) => { e.stopPropagation(); openMessage(lead); }}
// //                                                         className="flex items-center gap-[5px] px-3.5 py-[7px] rounded-[10px] text-xs font-medium cursor-pointer border-none text-white transition-all duration-150"
// //                                                         style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" }}
// //                                                     >
// //                                                         <MessageSquare size={12} /> Custom message
// //                                                     </button>
// //                                                 </div>

// //                                                 {/* Message history */}
// //                                                 {lead.messages.length > 0 && (
// //                                                     <div className="mt-3.5">
// //                                                         <p className="text-[11px] font-semibold text-[var(--sage-dark)] uppercase tracking-[0.08em] mb-2">Message History</p>
// //                                                         <div className="flex flex-col gap-1 max-h-[120px] overflow-y-auto">
// //                                                             {lead.messages.map((m) => (
// //                                                                 <div key={m.id} className="px-2.5 py-[7px] bg-[#f7faf8] rounded-lg border border-[var(--border)]">
// //                                                                     <div className="text-xs font-medium text-[var(--text)]">{m.subject}</div>
// //                                                                     <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
// //                                                                         {new Date(m.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
// //                                                                         {" · "}{m.type === "custom" ? "Custom" : `Sequence ${m.type.replace("seq", "")}`}
// //                                                                     </div>
// //                                                                 </div>
// //                                                             ))}
// //                                                         </div>
// //                                                     </div>
// //                                                 )}
// //                                             </div>
// //                                         </div>
// //                                     </div>
// //                                 )}
// //                             </div>
// //                         );
// //                     })}
// //                 </div>
// //             </div>

// //             {/* ── MODAL: Full detail ── */}
// //             {modal === "detail" && selectedLead && (
// //                 <div
// //                     className="modal-bg fixed inset-0 bg-[rgba(28,58,58,0.4)] z-[200] flex items-center justify-center p-4"
// //                     onClick={() => setModal(null)}
// //                 >
// //                     <div
// //                         className="modal-card bg-white rounded-[20px] w-full max-w-[600px] max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
// //                         onClick={(e) => e.stopPropagation()}
// //                     >
// //                         <div className="px-6 py-5 border-b border-[var(--border)] flex items-center justify-between sticky top-0 bg-white z-[1]">
// //                             <div>
// //                                 <div className="text-[18px] font-[Cormorant_Garamond,serif] font-normal text-[var(--deep)]">{selectedLead.name}</div>
// //                                 <div className="text-xs text-[var(--text-muted)]">{selectedLead.email}</div>
// //                             </div>
// //                             <button onClick={() => setModal(null)} className="bg-transparent border-none cursor-pointer text-[var(--text-muted)]">
// //                                 <X size={20} />
// //                             </button>
// //                         </div>

// //                         <div className="p-6">
// //                             {/* Severity banner */}
// //                             <div
// //                                 className="px-5 py-4 rounded-[14px] mb-5"
// //                                 style={{
// //                                     background: `${BAND_COLORS[selectedLead.band] ?? "#7ba98b"}14`,
// //                                     border: `1px solid ${BAND_COLORS[selectedLead.band] ?? "#7ba98b"}28`,
// //                                 }}
// //                             >
// //                                 <div className="text-[11px] uppercase tracking-[0.1em] font-bold mb-1" style={{ color: BAND_COLORS[selectedLead.band] }}>
// //                                     {selectedLead.severity}
// //                                 </div>
// //                                 <div className="text-[22px] font-bold" style={{ color: BAND_COLORS[selectedLead.band] }}>
// //                                     {selectedLead.score} <span className="text-sm font-normal text-[var(--text-muted)]">/ 24</span>
// //                                 </div>
// //                             </div>

// //                             {/* Info grid */}
// //                             <div className="grid grid-cols-2 gap-2.5 mb-5">
// //                                 {[
// //                                     { label: "Email", value: selectedLead.email },
// //                                     { label: "Phone", value: selectedLead.phone || "—" },
// //                                     { label: "Status", value: selectedLead.status },
// //                                     { label: "Submitted", value: new Date(selectedLead.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) },
// //                                 ].map(({ label, value }) => (
// //                                     <div key={label} className="px-3.5 py-3 bg-[#f7faf8] rounded-[10px] border border-[var(--border)]">
// //                                         <div className="text-[10px] uppercase tracking-[0.08em] text-[var(--sage-dark)] font-semibold mb-1">{label}</div>
// //                                         <div className="text-[13px] text-[var(--text)] break-words">{value}</div>
// //                                     </div>
// //                                 ))}
// //                             </div>

// //                             <p className="text-[11px] font-semibold text-[var(--sage-dark)] uppercase tracking-[0.08em] mb-2.5">Area Breakdown</p>
// //                             <div className="flex flex-col gap-2 mb-5">
// //                                 {Object.entries(selectedLead.answers).map(([k, v]) => (
// //                                     <div key={k} className="grid items-center gap-2.5" style={{ gridTemplateColumns: "110px 1fr" }}>
// //                                         <span className="text-[13px] text-[var(--text-muted)]">{QUESTION_LABELS[k] ?? k}</span>
// //                                         <MiniBar value={v} color={BAND_COLORS[selectedLead.band] ?? "#7ba98b"} />
// //                                     </div>
// //                                 ))}
// //                             </div>

// //                             {selectedLead.notes && (
// //                                 <>
// //                                     <p className="text-[11px] font-semibold text-[var(--sage-dark)] uppercase tracking-[0.08em] mb-2">Notes</p>
// //                                     <div className="px-3.5 py-3 bg-[#f7faf8] rounded-[10px] border border-[var(--border)] text-[13px] text-[var(--text-muted)] italic mb-5">
// //                                         {selectedLead.notes}
// //                                     </div>
// //                                 </>
// //                             )}

// //                             {selectedLead.messages.length > 0 && (
// //                                 <>
// //                                     <p className="text-[11px] font-semibold text-[var(--sage-dark)] uppercase tracking-[0.08em] mb-2">All Messages Sent</p>
// //                                     <div className="flex flex-col gap-1.5">
// //                                         {selectedLead.messages.map((m) => (
// //                                             <div key={m.id} className="px-3.5 py-2.5 bg-[#f7faf8] rounded-[10px] border border-[var(--border)]">
// //                                                 <div className="text-[13px] font-medium text-[var(--text)]">{m.subject}</div>
// //                                                 <div className="text-[11px] text-[var(--text-muted)] mt-[3px]">
// //                                                     {new Date(m.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
// //                                                     {" · "}{m.sentBy === "admin" ? "Sent by you" : "System"} · {m.type}
// //                                                 </div>
// //                                             </div>
// //                                         ))}
// //                                     </div>
// //                                 </>
// //                             )}
// //                         </div>
// //                     </div>
// //                 </div>
// //             )}

// //             {/* ── MODAL: Notes ── */}
// //             {modal === "notes" && selectedLead && (
// //                 <div
// //                     className="modal-bg fixed inset-0 bg-[rgba(28,58,58,0.4)] z-[200] flex items-center justify-center p-4"
// //                     onClick={() => setModal(null)}
// //                 >
// //                     <div
// //                         className="modal-card bg-white rounded-[20px] w-full max-w-[480px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden"
// //                         onClick={(e) => e.stopPropagation()}
// //                     >
// //                         <div className="px-[22px] py-[18px] border-b border-[var(--border)] flex items-center justify-between">
// //                             <div className="text-base font-semibold text-[var(--deep)]">Notes — {selectedLead.name}</div>
// //                             <button onClick={() => setModal(null)} className="bg-transparent border-none cursor-pointer text-[var(--text-muted)]"><X size={18} /></button>
// //                         </div>
// //                         <div className="p-[22px]">
// //                             <textarea
// //                                 value={notes}
// //                                 onChange={(e) => setNotes(e.target.value)}
// //                                 placeholder="Add your notes here — observations, follow-up reminders, context…"
// //                                 rows={6}
// //                                 className="w-full px-3.5 py-3 border-[1.5px] border-[var(--border)] rounded-xl text-base text-[var(--text)] resize-y outline-none bg-[#f7faf8] leading-[1.7]"
// //                                 onFocus={(e) => (e.target.style.borderColor = "var(--sage)")}
// //                                 onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
// //                             />
// //                             <div className="flex gap-2 mt-3.5 justify-end">
// //                                 <button
// //                                     onClick={() => setModal(null)}
// //                                     className="px-[18px] py-[9px] rounded-full border border-[var(--border)] bg-white text-[var(--text-muted)] text-[13px] font-medium cursor-pointer"
// //                                 >
// //                                     Cancel
// //                                 </button>
// //                                 <button
// //                                     onClick={saveNotes}
// //                                     disabled={savingNotes}
// //                                     className="px-[22px] py-[9px] rounded-full border-none text-white text-[13px] font-semibold cursor-pointer flex items-center gap-1.5"
// //                                     style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" }}
// //                                 >
// //                                     <FileText size={13} />
// //                                     {savingNotes ? "Saving…" : "Save notes"}
// //                                 </button>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>
// //             )}

// //             {/* ── MODAL: Custom message ── */}
// //             {modal === "message" && selectedLead && (
// //                 <div
// //                     className="modal-bg fixed inset-0 bg-[rgba(28,58,58,0.4)] z-[200] flex items-center justify-center p-4"
// //                     onClick={() => setModal(null)}
// //                 >
// //                     <div
// //                         className="modal-card bg-white rounded-[20px] w-full max-w-[520px] max-h-[90vh] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden"
// //                         onClick={(e) => e.stopPropagation()}
// //                     >
// //                         <div className="px-[22px] py-[18px] border-b border-[var(--border)] flex items-center justify-between">
// //                             <div className="text-base font-semibold text-[var(--deep)]">Send message to {selectedLead.name}</div>
// //                             <button onClick={() => setModal(null)} className="bg-transparent border-none cursor-pointer text-[var(--text-muted)]"><X size={18} /></button>
// //                         </div>
// //                         <div className="p-[22px] overflow-y-auto max-h-[calc(90vh-60px)]">
// //                             <div className="mb-3.5">
// //                                 <label className="block text-[11px] font-semibold text-[var(--sage-dark)] uppercase tracking-[0.08em] mb-1.5">Subject</label>
// //                                 <input
// //                                     type="text"
// //                                     placeholder="Email subject…"
// //                                     value={customSubject}
// //                                     onChange={(e) => setCustomSubject(e.target.value)}
// //                                     className="w-full px-3.5 py-2.5 border-[1.5px] border-[var(--border)] rounded-[10px] text-base text-[var(--text)] outline-none bg-[#f7faf8]"
// //                                     onFocus={(e) => (e.target.style.borderColor = "var(--sage)")}
// //                                     onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
// //                                 />
// //                             </div>
// //                             <div className="mb-4">
// //                                 <label className="block text-[11px] font-semibold text-[var(--sage-dark)] uppercase tracking-[0.08em] mb-1.5">Message</label>
// //                                 <textarea
// //                                     placeholder={`Write your message to ${selectedLead.name}…`}
// //                                     value={customBody}
// //                                     onChange={(e) => setCustomBody(e.target.value)}
// //                                     rows={7}
// //                                     className="w-full px-3.5 py-2.5 border-[1.5px] border-[var(--border)] rounded-[10px] text-base text-[var(--text)] resize-y outline-none bg-[#f7faf8] leading-[1.7]"
// //                                     onFocus={(e) => (e.target.style.borderColor = "var(--sage)")}
// //                                     onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
// //                                 />
// //                                 <p className="text-[11px] text-[var(--text-muted)] mt-[5px]">Your message will be wrapped in a clean branded email.</p>
// //                             </div>
// //                             <div className="flex gap-2 justify-end">
// //                                 <button
// //                                     onClick={() => setModal(null)}
// //                                     className="px-[18px] py-[9px] rounded-full border border-[var(--border)] bg-white text-[var(--text-muted)] text-[13px] font-medium cursor-pointer"
// //                                 >
// //                                     Cancel
// //                                 </button>
// //                                 <button
// //                                     onClick={() => sendMessage(selectedLead.id, "custom", customSubject, customBody)}
// //                                     disabled={!customSubject.trim() || !customBody.trim() || sending === "custom"}
// //                                     className="px-[22px] py-[9px] rounded-full border-none text-white text-[13px] font-semibold cursor-pointer flex items-center gap-1.5 transition-opacity"
// //                                     style={{
// //                                         background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)",
// //                                         opacity: !customSubject.trim() || !customBody.trim() ? 0.5 : 1,
// //                                     }}
// //                                 >
// //                                     <Send size={13} />
// //                                     {sending === "custom" ? "Sending…" : "Send message"}
// //                                 </button>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>
// //             )}
// //         </div>
// //     );
// // }


// "use client";

// import { useState, useEffect, useCallback, useMemo } from "react";
// import {
//     Search, Filter, Send, FileText, ChevronDown, ChevronUp,
//     Mail, MessageSquare, TrendingUp, Clock, CheckCircle,
//     AlertCircle, X, RefreshCw, Eye, Edit3, Inbox, Users,
//     Activity, Menu, DollarSign, BarChart2, Brain, Calendar,
//     ArrowUpRight, ArrowDownRight, Zap, Target, Award,
//     PieChart, LineChart, Layers, Bell, Settings, LogOut,
//     ChevronRight, Minus, Plus, Star, Hash, PhoneCall,
//     UserCheck, UserX, TrendingDown, Repeat, CreditCard,
//     BookOpen, ShieldCheck, Sparkles, Flame, AlertTriangle,
// } from "lucide-react";
// import Link from "next/link";
// import Image from "next/image";

// // ── Types ──────────────────────────────────────────────────────────────────────

// interface Message {
//     id: string;
//     createdAt: string;
//     subject: string;
//     body: string;
//     type: string;
//     sentBy: string;
// }

// interface Lead {
//     id: string;
//     createdAt: string;
//     name: string;
//     email: string;
//     phone: string | null;
//     score: number;
//     band: string;
//     severity: string;
//     answers: Record<string, number>;
//     status: string;
//     notes: string | null;
//     seq1SentAt: string | null;
//     seq2SentAt: string | null;
//     seq3SentAt: string | null;
//     messages: Message[];
//     // Extended fields for full admin
//     revenue?: number;
//     sessions?: number;
//     lastActivity?: string;
//     conversionDate?: string;
//     therapist?: string;
//     appointmentCount?: number;
//     noShowCount?: number;
//     engagementScore?: number;
//     riskScore?: number;
//     ltv?: number;
//     source?: string;
//     tags?: string[];
// }

// interface FinancialMetric {
//     label: string;
//     value: number;
//     prev: number;
//     prefix?: string;
//     suffix?: string;
// }

// type TabType = "clients" | "financial" | "behavioral" | "communications";
// type ModalType = "detail" | "message" | "notes" | "appointment" | "financial" | null;

// // ── Design tokens ──────────────────────────────────────────────────────────────

// const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
//     new: { bg: "#edf7f1", text: "#3a7a58", dot: "#7ba98b" },
//     contacted: { bg: "#e8f4f8", text: "#2a5a7a", dot: "#6fb8b8" },
//     booked: { bg: "#f0edf7", text: "#5a3a7a", dot: "#a88bcf" },
//     inactive: { bg: "#f5f5f5", text: "#7a7a7a", dot: "#b0b0b0" },
//     churned: { bg: "#fff0f0", text: "#7a3a3a", dot: "#cf8b8b" },
// };

// const BAND_COLORS: Record<string, string> = {
//     Low: "#4e8c6a",
//     Mild: "#3d8b8b",
//     Moderate: "#5a6e8a",
//     High: "#b94a4f",
// };

// const QUESTION_LABELS: Record<string, string> = {
//     q1: "Mood", q2: "Anxiety", q3: "Energy", q4: "Sleep",
//     q5: "Relationships", q6: "Stress", q7: "Self-worth", q8: "Support",
// };

// const RISK_LABELS: Record<string, { label: string; color: string; bg: string }> = {
//     low: { label: "Low Risk", color: "#4e8c6a", bg: "#edf7f1" },
//     medium: { label: "Med Risk", color: "#8b6e3d", bg: "#f7f0e8" },
//     high: { label: "High Risk", color: "#b94a4f", bg: "#fff0f0" },
// };

// // ── Mock data enricher (augments real leads with demo analytics fields) ────────
// function enrichLead(lead: Lead, i: number): Lead {
//     const sources = ["Organic", "Referral", "Social", "Direct", "Ads"];
//     const therapists = ["Dr. Adeola", "Dr. Chukwu", "Dr. Bello", "Dr. Okonkwo"];
//     const tagOptions = [["VIP"], ["Recurring"], ["At-Risk"], ["New"], ["High-Value"], ["Follow-up"]];
//     const sessions = Math.max(0, Math.floor(Math.random() * 12));
//     return {
//         ...lead,
//         revenue: sessions * 10000,
//         sessions,
//         lastActivity: new Date(Date.now() - Math.random() * 14 * 86400000).toISOString(),
//         conversionDate: lead.status === "booked" ? new Date(Date.now() - Math.random() * 30 * 86400000).toISOString() : undefined,
//         therapist: therapists[i % therapists.length],
//         appointmentCount: sessions,
//         noShowCount: Math.floor(Math.random() * 2),
//         engagementScore: Math.min(100, 40 + lead.score * 2 + Math.floor(Math.random() * 20)),
//         riskScore: lead.band === "High" ? 85 + Math.random() * 15 : 20 + Math.random() * 40,
//         ltv: (sessions + 3) * 10000,
//         source: sources[i % sources.length],
//         tags: tagOptions[i % tagOptions.length],
//     };
// }

// // ── Utility ────────────────────────────────────────────────────────────────────
// function fmtNaira(n: number) {
//     if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
//     if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}K`;
//     return `₦${n}`;
// }

// function fmtPct(curr: number, prev: number) {
//     if (prev === 0) return null;
//     const pct = ((curr - prev) / prev) * 100;
//     return { pct: Math.abs(pct).toFixed(1), up: pct >= 0 };
// }

// function daysSince(iso: string) {
//     return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
// }

// // ── Sub-components ─────────────────────────────────────────────────────────────

// function StatCard({ icon: Icon, label, value, sub, color, trend, prefix = "" }: {
//     icon: React.ElementType; label: string; value: string | number;
//     sub?: string; color: string; trend?: { pct: string; up: boolean } | null; prefix?: string;
// }) {
//     return (
//         <div className="bg-white rounded-2xl border border-[var(--border)] shadow-[0_1px_8px_rgba(28,58,58,0.05)] flex flex-col gap-2 px-[20px] py-[18px]">
//             <div className="flex items-center justify-between">
//                 <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: `${color}18` }}>
//                     <Icon size={16} style={{ color }} />
//                 </div>
//                 {trend && (
//                     <span className={`text-[11px] font-semibold flex items-center gap-0.5 ${trend.up ? "text-[#4e8c6a]" : "text-[#b94a4f]"}`}>
//                         {trend.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
//                         {trend.pct}%
//                     </span>
//                 )}
//             </div>
//             <div>
//                 <div className="text-[22px] font-bold text-[var(--deep)] leading-tight tracking-tight">
//                     {prefix}{value}
//                 </div>
//                 <div className="text-[11px] text-[var(--text-muted)] mt-0.5 font-medium">{label}</div>
//                 {sub && <div className="text-[10px] mt-0.5" style={{ color }}>{sub}</div>}
//             </div>
//         </div>
//     );
// }

// function MiniBar({ value, max = 3, color }: { value: number; max?: number; color: string }) {
//     return (
//         <div className="flex items-center gap-1.5">
//             <div className="flex-1 h-[4px] bg-[#e8eeea] rounded-full overflow-hidden">
//                 <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.round((value / max) * 100)}%`, background: color }} />
//             </div>
//             <span className="text-[10px] text-[var(--text-muted)] shrink-0 w-6">{value}/{max}</span>
//         </div>
//     );
// }

// function ScoreRing({ score, max, color, size = 56 }: { score: number; max: number; color: string; size?: number }) {
//     const pct = score / max;
//     const r = (size - 8) / 2;
//     const circ = 2 * Math.PI * r;
//     const dash = circ * pct;
//     return (
//         <div className="relative shrink-0" style={{ width: size, height: size }}>
//             <svg width={size} height={size} className="-rotate-90">
//                 <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e8eeea" strokeWidth={5} />
//                 <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={5}
//                     strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{ transition: "stroke-dasharray 0.5s ease" }} />
//             </svg>
//             <div className="absolute inset-0 flex flex-col items-center justify-center">
//                 <span className="text-[11px] font-bold text-[var(--deep)]">{score}</span>
//                 <span className="text-[8px] text-[var(--text-muted)]">/{max}</span>
//             </div>
//         </div>
//     );
// }

// function SparkLine({ data, color }: { data: number[]; color: string }) {
//     const max = Math.max(...data, 1);
//     const min = Math.min(...data);
//     const h = 32, w = 80;
//     const pts = data.map((v, i) => {
//         const x = (i / (data.length - 1)) * w;
//         const y = h - ((v - min) / (max - min + 1)) * h;
//         return `${x},${y}`;
//     }).join(" ");
//     return (
//         <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
//             <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
//             <circle cx={pts.split(" ").pop()?.split(",")[0]} cy={pts.split(" ").pop()?.split(",")[1]} r={2.5} fill={color} />
//         </svg>
//     );
// }

// function RiskBadge({ score }: { score: number }) {
//     const level = score > 70 ? "high" : score > 40 ? "medium" : "low";
//     const cfg = RISK_LABELS[level];
//     return (
//         <span className="text-[10px] font-semibold px-2 py-[2px] rounded-full" style={{ background: cfg.bg, color: cfg.color }}>
//             {cfg.label}
//         </span>
//     );
// }

// function EngagementBar({ score }: { score: number }) {
//     const color = score > 70 ? "#4e8c6a" : score > 40 ? "#8b6e3d" : "#b94a4f";
//     return (
//         <div className="flex items-center gap-1.5">
//             <div className="w-16 h-[4px] bg-[#e8eeea] rounded-full overflow-hidden">
//                 <div className="h-full rounded-full" style={{ width: `${score}%`, background: color }} />
//             </div>
//             <span className="text-[10px] text-[var(--text-muted)]">{score}</span>
//         </div>
//     );
// }

// // ── Revenue chart (SVG area chart) ─────────────────────────────────────────────
// function RevenueChart({ leads }: { leads: Lead[] }) {
//     const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//     const now = new Date();
//     const data = Array.from({ length: 6 }, (_, i) => {
//         const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
//         const total = leads.filter(l => {
//             if (!l.conversionDate) return false;
//             const ld = new Date(l.conversionDate);
//             return ld.getMonth() === d.getMonth() && ld.getFullYear() === d.getFullYear();
//         }).reduce((sum, l) => sum + (l.revenue ?? 0), 0);
//         return { month: months[d.getMonth()], total };
//     });

//     const maxVal = Math.max(...data.map(d => d.total), 100000);
//     const W = 480, H = 120, PAD = 8;
//     const pts = data.map((d, i) => {
//         const x = PAD + (i / (data.length - 1)) * (W - PAD * 2);
//         const y = H - PAD - ((d.total / maxVal) * (H - PAD * 2));
//         return { x, y, ...d };
//     });
//     const pathD = `M${pts.map(p => `${p.x},${p.y}`).join(" L")}`;
//     const areaD = `${pathD} L${pts[pts.length - 1].x},${H - PAD} L${pts[0].x},${H - PAD} Z`;

//     return (
//         <div className="bg-white rounded-2xl border border-[var(--border)] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
//             <div className="flex items-center justify-between mb-4">
//                 <div>
//                     <div className="text-[13px] font-semibold text-[var(--deep)]">Revenue (6 months)</div>
//                     <div className="text-[11px] text-[var(--text-muted)]">From converted clients</div>
//                 </div>
//                 <div className="text-[20px] font-bold text-[var(--deep)]">
//                     {fmtNaira(data.reduce((s, d) => s + d.total, 0))}
//                 </div>
//             </div>
//             <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 120 }}>
//                 <defs>
//                     <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="0%" stopColor="#4e7a5e" stopOpacity="0.18" />
//                         <stop offset="100%" stopColor="#4e7a5e" stopOpacity="0.01" />
//                     </linearGradient>
//                 </defs>
//                 <path d={areaD} fill="url(#revGrad)" />
//                 <path d={pathD} fill="none" stroke="#4e7a5e" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
//                 {pts.map((p, i) => (
//                     <g key={i}>
//                         <circle cx={p.x} cy={p.y} r={3} fill="#4e7a5e" />
//                         <text x={p.x} y={H} textAnchor="middle" fontSize={9} fill="#8da898">{p.month}</text>
//                         {p.total > 0 && (
//                             <text x={p.x} y={p.y - 6} textAnchor="middle" fontSize={8} fill="#4e7a5e" fontWeight="600">
//                                 {fmtNaira(p.total)}
//                             </text>
//                         )}
//                     </g>
//                 ))}
//             </svg>
//         </div>
//     );
// }

// // ── Band distribution chart ────────────────────────────────────────────────────
// function BandChart({ leads }: { leads: Lead[] }) {
//     const bands = ["Low", "Mild", "Moderate", "High"];
//     const counts = bands.map(b => ({ band: b, count: leads.filter(l => l.band === b).length, color: BAND_COLORS[b] }));
//     const total = leads.length || 1;
//     let cumulative = 0;
//     const segments = counts.map(c => {
//         const pct = (c.count / total) * 100;
//         const seg = { ...c, pct, start: cumulative };
//         cumulative += pct;
//         return seg;
//     });

//     return (
//         <div className="bg-white rounded-2xl border border-[var(--border)] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
//             <div className="text-[13px] font-semibold text-[var(--deep)] mb-1">Severity Distribution</div>
//             <div className="text-[11px] text-[var(--text-muted)] mb-4">{leads.length} total leads</div>
//             <div className="h-3 rounded-full overflow-hidden flex mb-4">
//                 {segments.map(s => (
//                     <div key={s.band} style={{ width: `${s.pct}%`, background: s.color }} title={`${s.band}: ${s.count}`} />
//                 ))}
//             </div>
//             <div className="flex flex-col gap-2">
//                 {segments.map(s => (
//                     <div key={s.band} className="flex items-center justify-between">
//                         <div className="flex items-center gap-1.5">
//                             <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
//                             <span className="text-xs text-[var(--text-muted)]">{s.band}</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <SparkLine data={[1, 2, s.count, s.count + 1, s.count]} color={s.color} />
//                             <span className="text-xs font-semibold text-[var(--deep)] w-4 text-right">{s.count}</span>
//                             <span className="text-[10px] text-[var(--text-muted)] w-8 text-right">{s.pct.toFixed(0)}%</span>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// // ── Conversion funnel ──────────────────────────────────────────────────────────
// function ConversionFunnel({ leads }: { leads: Lead[] }) {
//     const stages = [
//         { label: "Leads", count: leads.length, color: "#7ba98b" },
//         { label: "Contacted", count: leads.filter(l => ["contacted", "booked"].includes(l.status)).length, color: "#3d8b8b" },
//         { label: "Booked", count: leads.filter(l => l.status === "booked").length, color: "#7b6fa9" },
//     ];
//     const max = stages[0].count || 1;

//     return (
//         <div className="bg-white rounded-2xl border border-[var(--border)] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
//             <div className="text-[13px] font-semibold text-[var(--deep)] mb-1">Conversion Funnel</div>
//             <div className="text-[11px] text-[var(--text-muted)] mb-4">Lead → Book rate</div>
//             <div className="flex flex-col gap-2.5">
//                 {stages.map((s, i) => {
//                     const pct = (s.count / max) * 100;
//                     const conv = i > 0 ? ((s.count / stages[i - 1].count) * 100).toFixed(0) : null;
//                     return (
//                         <div key={s.label}>
//                             <div className="flex items-center justify-between mb-1">
//                                 <span className="text-xs text-[var(--text-muted)]">{s.label}</span>
//                                 <div className="flex items-center gap-2">
//                                     {conv && <span className="text-[10px] font-semibold" style={{ color: s.color }}>{conv}% conv.</span>}
//                                     <span className="text-xs font-bold text-[var(--deep)]">{s.count}</span>
//                                 </div>
//                             </div>
//                             <div className="h-2.5 bg-[#f0f4f2] rounded-full overflow-hidden">
//                                 <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: s.color }} />
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//             <div className="mt-4 pt-3 border-t border-[var(--border)]">
//                 <div className="text-[11px] text-[var(--text-muted)]">Overall conversion</div>
//                 <div className="text-[20px] font-bold text-[#7b6fa9]">
//                     {leads.length > 0 ? ((stages[2].count / leads.length) * 100).toFixed(1) : 0}%
//                 </div>
//             </div>
//         </div>
//     );
// }

// // ── Behavioral heatmap ─────────────────────────────────────────────────────────
// function BehavioralHeatmap({ leads }: { leads: Lead[] }) {
//     const keys = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"];
//     const avgs = keys.map(k => {
//         const vals = leads.map(l => l.answers[k] ?? 0).filter(v => v > 0);
//         return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
//     });
//     const maxAvg = 3;

//     return (
//         <div className="bg-white rounded-2xl border border-[var(--border)] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
//             <div className="text-[13px] font-semibold text-[var(--deep)] mb-1">Avg. Symptom Scores</div>
//             <div className="text-[11px] text-[var(--text-muted)] mb-4">Across all {leads.length} leads</div>
//             <div className="grid grid-cols-4 gap-2">
//                 {keys.map((k, i) => {
//                     const val = avgs[i];
//                     const intensity = val / maxAvg;
//                     const color = intensity > 0.7 ? "#b94a4f" : intensity > 0.4 ? "#8b6e3d" : "#4e8c6a";
//                     return (
//                         <div key={k} className="rounded-[10px] p-2.5 text-center" style={{ background: `${color}${Math.round(intensity * 40 + 10).toString(16).padStart(2, "0")}` }}>
//                             <div className="text-[10px] text-[var(--text-muted)] mb-0.5">{QUESTION_LABELS[k]}</div>
//                             <div className="text-sm font-bold" style={{ color }}>{val.toFixed(1)}</div>
//                             <div className="mt-1 h-[3px] bg-white/40 rounded-full overflow-hidden">
//                                 <div className="h-full rounded-full" style={{ width: `${intensity * 100}%`, background: color }} />
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// }

// // ── LTV table ──────────────────────────────────────────────────────────────────
// function LtvTable({ leads }: { leads: Lead[] }) {
//     const top = [...leads].sort((a, b) => (b.ltv ?? 0) - (a.ltv ?? 0)).slice(0, 5);
//     return (
//         <div className="bg-white rounded-2xl border border-[var(--border)] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
//             <div className="text-[13px] font-semibold text-[var(--deep)] mb-1">Top Clients by LTV</div>
//             <div className="text-[11px] text-[var(--text-muted)] mb-3">Lifetime value estimate</div>
//             <div className="flex flex-col gap-2">
//                 {top.map((l, i) => (
//                     <div key={l.id} className="flex items-center gap-2.5">
//                         <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
//                             style={{ background: i === 0 ? "#f59e0b" : i === 1 ? "#94a3b8" : "#c27b2e" }}>
//                             {i + 1}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                             <div className="text-xs font-semibold text-[var(--deep)] truncate">{l.name}</div>
//                             <div className="text-[10px] text-[var(--text-muted)]">{l.sessions} sessions · {l.therapist}</div>
//                         </div>
//                         <div className="text-xs font-bold text-[#4e8c6a]">{fmtNaira(l.ltv ?? 0)}</div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// // ── At-risk clients ────────────────────────────────────────────────────────────
// function AtRiskPanel({ leads }: { leads: Lead[] }) {
//     const atRisk = leads.filter(l => (l.riskScore ?? 0) > 65).slice(0, 4);
//     return (
//         <div className="bg-white rounded-2xl border border-[var(--border)] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
//             <div className="flex items-center gap-1.5 mb-1">
//                 <AlertTriangle size={14} className="text-[#b94a4f]" />
//                 <div className="text-[13px] font-semibold text-[var(--deep)]">At-Risk Clients</div>
//             </div>
//             <div className="text-[11px] text-[var(--text-muted)] mb-3">High churn probability</div>
//             {atRisk.length === 0 ? (
//                 <p className="text-xs text-[var(--text-muted)] italic">No at-risk clients 🎉</p>
//             ) : (
//                 <div className="flex flex-col gap-2">
//                     {atRisk.map(l => (
//                         <div key={l.id} className="flex items-center gap-2 p-2 rounded-lg bg-[#fff8f8] border border-[#f5e0e0]">
//                             <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
//                                 style={{ background: "#b94a4f" }}>
//                                 {l.name.charAt(0)}
//                             </div>
//                             <div className="flex-1 min-w-0">
//                                 <div className="text-xs font-semibold text-[var(--deep)] truncate">{l.name}</div>
//                                 <div className="text-[10px] text-[var(--text-muted)]">
//                                     Last active {l.lastActivity ? daysSince(l.lastActivity) : "?"}d ago
//                                 </div>
//                             </div>
//                             <div className="text-[11px] font-bold text-[#b94a4f]">{Math.round(l.riskScore ?? 0)}%</div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }

// // ── Engagement tracker ─────────────────────────────────────────────────────────
// function EngagementTracker({ leads }: { leads: Lead[] }) {
//     const buckets = [
//         { label: "Highly Engaged", min: 70, color: "#4e8c6a", icon: Flame },
//         { label: "Moderate", min: 40, color: "#3d8b8b", icon: Activity },
//         { label: "Low Engagement", min: 0, color: "#b94a4f", icon: TrendingDown },
//     ];
//     return (
//         <div className="bg-white rounded-2xl border border-[var(--border)] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
//             <div className="text-[13px] font-semibold text-[var(--deep)] mb-1">Engagement Tiers</div>
//             <div className="text-[11px] text-[var(--text-muted)] mb-3">Based on session frequency & responses</div>
//             <div className="flex flex-col gap-2.5">
//                 {buckets.map((b, i) => {
//                     const next = buckets[i + 1];
//                     const count = leads.filter(l => {
//                         const s = l.engagementScore ?? 0;
//                         return s >= b.min && (next ? s < next.min + (b.min - next.min) : true);
//                     }).length;
//                     const pct = leads.length ? (count / leads.length) * 100 : 0;
//                     return (
//                         <div key={b.label} className="flex items-center gap-2.5">
//                             <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${b.color}18` }}>
//                                 <b.icon size={13} style={{ color: b.color }} />
//                             </div>
//                             <div className="flex-1">
//                                 <div className="flex items-center justify-between mb-1">
//                                     <span className="text-xs text-[var(--text-muted)]">{b.label}</span>
//                                     <span className="text-xs font-bold text-[var(--deep)]">{count}</span>
//                                 </div>
//                                 <div className="h-1.5 bg-[#f0f4f2] rounded-full overflow-hidden">
//                                     <div className="h-full rounded-full" style={{ width: `${pct}%`, background: b.color }} />
//                                 </div>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// }

// // ── Source attribution ─────────────────────────────────────────────────────────
// function SourceAttribution({ leads }: { leads: Lead[] }) {
//     const sources = ["Organic", "Referral", "Social", "Direct", "Ads"];
//     const counts = sources.map(s => ({ s, n: leads.filter(l => l.source === s).length }));
//     const total = leads.length || 1;
//     const colors = ["#4e8c6a", "#3d8b8b", "#7b6fa9", "#8b6e3d", "#b94a4f"];

//     return (
//         <div className="bg-white rounded-2xl border border-[var(--border)] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
//             <div className="text-[13px] font-semibold text-[var(--deep)] mb-1">Traffic Sources</div>
//             <div className="text-[11px] text-[var(--text-muted)] mb-3">Lead origin breakdown</div>
//             <div className="flex gap-1 h-3 rounded-full overflow-hidden mb-3">
//                 {counts.map((c, i) => (
//                     <div key={c.s} style={{ width: `${(c.n / total) * 100}%`, background: colors[i] }} />
//                 ))}
//             </div>
//             <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
//                 {counts.map((c, i) => (
//                     <div key={c.s} className="flex items-center gap-1.5">
//                         <div className="w-2 h-2 rounded-full shrink-0" style={{ background: colors[i] }} />
//                         <span className="text-[10px] text-[var(--text-muted)]">{c.s}</span>
//                         <span className="text-[10px] font-bold text-[var(--deep)] ml-auto">{c.n}</span>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// // ── Financial metrics panel ────────────────────────────────────────────────────
// function FinancialPanel({ leads }: { leads: Lead[] }) {
//     const revenue = leads.reduce((s, l) => s + (l.revenue ?? 0), 0);
//     const ltv = leads.length ? leads.reduce((s, l) => s + (l.ltv ?? 0), 0) / leads.length : 0;
//     const arpu = leads.filter(l => (l.sessions ?? 0) > 0).length
//         ? revenue / leads.filter(l => (l.sessions ?? 0) > 0).length : 0;
//     const churnRisk = leads.filter(l => (l.riskScore ?? 0) > 65).length;
//     const totalSessions = leads.reduce((s, l) => s + (l.sessions ?? 0), 0);
//     const noShows = leads.reduce((s, l) => s + (l.noShowCount ?? 0), 0);

//     const metrics: FinancialMetric[] = [
//         { label: "Total Revenue", value: revenue, prev: revenue * 0.82 },
//         { label: "Avg. LTV", value: Math.round(ltv), prev: ltv * 0.9 },
//         { label: "ARPU", value: Math.round(arpu), prev: arpu * 0.95 },
//         { label: "Total Sessions", value: totalSessions, prev: totalSessions * 0.88 },
//         { label: "No-Shows", value: noShows, prev: noShows * 1.1 },
//         { label: "Churn Risk", value: churnRisk, prev: churnRisk * 0.8 },
//     ];

//     return (
//         <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
//             {metrics.map(m => {
//                 const t = fmtPct(m.value, m.prev);
//                 const isMonetary = ["Total Revenue", "Avg. LTV", "ARPU"].includes(m.label);
//                 const isNegative = ["No-Shows", "Churn Risk"].includes(m.label);
//                 const displayVal = isMonetary ? fmtNaira(m.value) : m.value;
//                 const color = isNegative ? "#b94a4f" : "#4e8c6a";
//                 const trendUp = t?.up ?? true;
//                 const trendGood = isNegative ? !trendUp : trendUp;
//                 return (
//                     <div key={m.label} className="bg-white rounded-2xl border border-[var(--border)] p-4 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
//                         <div className="text-[11px] text-[var(--text-muted)] mb-1 font-medium">{m.label}</div>
//                         <div className="text-[20px] font-bold text-[var(--deep)]">{displayVal}</div>
//                         {t && (
//                             <div className={`flex items-center gap-0.5 text-[11px] font-semibold mt-1 ${trendGood ? "text-[#4e8c6a]" : "text-[#b94a4f]"}`}>
//                                 {trendUp ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
//                                 {t.pct}% vs last period
//                             </div>
//                         )}
//                     </div>
//                 );
//             })}
//         </div>
//     );
// }

// // ── Main component ─────────────────────────────────────────────────────────────
// export default function AdminPage() {
//     const [leads, setLeads] = useState<Lead[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [search, setSearch] = useState("");
//     const [statusFilter, setStatusFilter] = useState("all");
//     const [bandFilter, setBandFilter] = useState("all");
//     const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
//     const [modal, setModal] = useState<ModalType>(null);
//     const [notes, setNotes] = useState("");
//     const [savingNotes, setSavingNotes] = useState(false);
//     const [customSubject, setCustomSubject] = useState("");
//     const [customBody, setCustomBody] = useState("");
//     const [sending, setSending] = useState<string | null>(null);
//     const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
//     const [expandedId, setExpandedId] = useState<string | null>(null);
//     const [activeTab, setActiveTab] = useState<TabType>("clients");
//     const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//     const [notifOpen, setNotifOpen] = useState(false);

//     const showToast = (msg: string, ok = true) => {
//         setToast({ msg, ok });
//         setTimeout(() => setToast(null), 3500);
//     };

//     const fetchLeads = useCallback(async () => {
//         setLoading(true);
//         try {
//             const params = new URLSearchParams();
//             if (search) params.set("search", search);
//             if (statusFilter !== "all") params.set("status", statusFilter);
//             if (bandFilter !== "all") params.set("band", bandFilter);
//             const res = await fetch(`/api/admin/leads?${params.toString()}`);
//             const data = await res.json() as { success: boolean; leads: Lead[] };
//             if (data.success) setLeads(data.leads.map((l, i) => enrichLead(l, i)));
//         } catch {
//             showToast("Failed to load leads", false);
//         } finally {
//             setLoading(false);
//         }
//     }, [search, statusFilter, bandFilter]);

//     useEffect(() => {
//         const t = setTimeout(fetchLeads, 300);
//         return () => clearTimeout(t);
//     }, [fetchLeads]);

//     async function updateStatus(id: string, status: string) {
//         await fetch("/api/admin/leads", {
//             method: "PATCH",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ id, status }),
//         });
//         setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
//         showToast("Status updated");
//     }

//     async function saveNotes() {
//         if (!selectedLead) return;
//         setSavingNotes(true);
//         await fetch("/api/admin/leads", {
//             method: "PATCH",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ id: selectedLead.id, notes }),
//         });
//         setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, notes } : l));
//         setSavingNotes(false);
//         showToast("Notes saved");
//         setModal(null);
//     }

//     async function sendMessage(leadId: string, type: string, customSubj?: string, customBod?: string) {
//         setSending(type);
//         try {
//             const res = await fetch("/api/admin/message", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     leadId, type,
//                     ...(type === "custom" ? { customSubject: customSubj, customBody: customBod } : {}),
//                 }),
//             });
//             const data = await res.json() as { success: boolean };
//             if (data.success) {
//                 showToast("Message sent successfully");
//                 setCustomSubject(""); setCustomBody(""); setModal(null);
//                 fetchLeads();
//             } else showToast("Failed to send message", false);
//         } catch { showToast("Failed to send message", false); }
//         finally { setSending(null); }
//     }

//     const enrichedLeads = useMemo(() => leads, [leads]);

//     const stats = {
//         total: enrichedLeads.length,
//         new: enrichedLeads.filter(l => l.status === "new").length,
//         contacted: enrichedLeads.filter(l => l.status === "contacted").length,
//         booked: enrichedLeads.filter(l => l.status === "booked").length,
//         high: enrichedLeads.filter(l => l.band === "High").length,
//         revenue: enrichedLeads.reduce((s, l) => s + (l.revenue ?? 0), 0),
//         atRisk: enrichedLeads.filter(l => (l.riskScore ?? 0) > 65).length,
//     };

//     const openDetail = (lead: Lead) => { setSelectedLead(lead); setNotes(lead.notes ?? ""); setModal("detail"); };
//     const openNotes = (lead: Lead) => { setSelectedLead(lead); setNotes(lead.notes ?? ""); setModal("notes"); };
//     const openMessage = (lead: Lead) => { setSelectedLead(lead); setModal("message"); };

//     const TABS: { id: TabType; label: string; icon: React.ElementType }[] = [
//         { id: "clients", label: "Clients", icon: Users },
//         { id: "financial", label: "Financial", icon: DollarSign },
//         { id: "behavioral", label: "Behavioral", icon: Brain },
//         { id: "communications", label: "Comms", icon: Mail },
//     ];

//     return (
//         <div className="min-h-screen bg-[#f2f6f3] font-[DM_Sans,sans-serif]" style={{ "--border": "#ddeae2", "--deep": "#1c3a3a", "--sage": "#7ba98b", "--sage-dark": "#4e7a5e", "--text": "#2c3e35", "--text-muted": "#7a9088" } as React.CSSProperties}>

//             <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');
//         @keyframes slideIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
//         @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
//         @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
//         @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.4; } }
//         .modal-bg { animation: fadeIn 0.18s ease; }
//         .modal-card { animation: slideUp 0.22s ease; }
//         select { appearance:none; -webkit-appearance:none; }
//         textarea, input { font-family:inherit; }
//         .lead-row:hover { background:#f7faf8 !important; }
//         .btn-ghost:hover { background:rgba(123,169,139,0.1) !important; }
//         .seq-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 4px 12px rgba(0,0,0,0.1); }
//         .seq-btn:disabled { opacity:0.5; cursor:not-allowed; }
//         .tab-active { background:#fff; box-shadow:0 1px 8px rgba(28,58,58,0.08); }
//         ::-webkit-scrollbar { width:4px; height:4px; }
//         ::-webkit-scrollbar-track { background:transparent; }
//         ::-webkit-scrollbar-thumb { background:#c8ddd2; border-radius:99px; }
//         .pulse-dot { animation:pulse 2s infinite; }
//       `}</style>

//             {/* Toast */}
//             {toast && (
//                 <div className="fixed top-5 right-5 z-[9999] text-white px-5 py-3 rounded-xl text-[13px] font-medium shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex items-center gap-2"
//                     style={{ background: toast.ok ? "#1c3a3a" : "#b94a4f", animation: "slideIn 0.2s ease" }}>
//                     {toast.ok ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
//                     {toast.msg}
//                 </div>
//             )}

//             {/* ── Header ── */}
//             <div className="bg-white border-b border-[var(--border)] px-4 sticky top-0 z-[100] shadow-[0_1px_8px_rgba(28,58,58,0.05)]">
//                 <div className="max-w-[1400px] mx-auto flex items-center justify-between h-[60px]">
//                     <div className="flex items-center gap-2.5">
//                         <Link href="/" className="flex items-center gap-2">
//                             <Image src="/logo.png" alt="Mentel" width={108} height={61} className="object-contain" priority />
//                         </Link>
//                         <span className="text-[10px] font-bold text-[var(--sage-dark)] bg-[#edf7f1] border border-[#c8ddd2] rounded-full px-2 py-0.5 uppercase tracking-[0.08em]">
//                             Admin
//                         </span>
//                     </div>

//                     {/* Tab nav — desktop */}
//                     <div className="hidden md:flex items-center bg-[#f2f6f3] rounded-[12px] p-1 gap-0.5">
//                         {TABS.map(t => (
//                             <button key={t.id} onClick={() => setActiveTab(t.id)}
//                                 className={`flex items-center gap-1.5 px-3.5 py-[7px] rounded-[9px] text-[12px] font-semibold cursor-pointer transition-all duration-150 border-none ${activeTab === t.id ? "tab-active text-[var(--deep)]" : "text-[var(--text-muted)] bg-transparent hover:text-[var(--deep)]"}`}>
//                                 <t.icon size={13} />
//                                 {t.label}
//                             </button>
//                         ))}
//                     </div>

//                     <div className="flex items-center gap-2">
//                         <button onClick={() => setNotifOpen(!notifOpen)} className="relative btn-ghost w-8 h-8 rounded-lg flex items-center justify-center border border-[var(--border)] bg-white text-[var(--text-muted)] cursor-pointer">
//                             <Bell size={14} />
//                             {stats.atRisk > 0 && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#b94a4f] rounded-full flex items-center justify-center text-[8px] text-white font-bold pulse-dot">{stats.atRisk}</span>}
//                         </button>
//                         <button onClick={fetchLeads} className="btn-ghost hidden sm:flex items-center gap-1.5 px-3 py-[7px] rounded-[10px] border border-[var(--border)] bg-white text-[var(--text-muted)] text-xs font-medium cursor-pointer">
//                             <RefreshCw size={12} />
//                             Refresh
//                         </button>
//                         <button className="sm:hidden btn-ghost w-8 h-8 rounded-lg flex items-center justify-center border border-[var(--border)] bg-white text-[var(--text-muted)] cursor-pointer"
//                             onClick={() => setMobileMenuOpen(o => !o)}>
//                             {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
//                         </button>
//                     </div>
//                 </div>

//                 {/* Mobile tab nav */}
//                 {mobileMenuOpen && (
//                     <div className="md:hidden border-t border-[var(--border)] py-2 flex flex-wrap gap-1.5">
//                         {TABS.map(t => (
//                             <button key={t.id} onClick={() => { setActiveTab(t.id); setMobileMenuOpen(false); }}
//                                 className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border-none ${activeTab === t.id ? "bg-white text-[var(--deep)]" : "text-[var(--text-muted)] bg-transparent"}`}>
//                                 <t.icon size={12} /> {t.label}
//                             </button>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             {/* Notification dropdown */}
//             {notifOpen && stats.atRisk > 0 && (
//                 <div className="modal-bg fixed top-[68px] right-4 z-[150] bg-white border border-[var(--border)] rounded-[14px] shadow-[0_8px_32px_rgba(28,58,58,0.15)] w-72 overflow-hidden">
//                     <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
//                         <div className="text-xs font-semibold text-[var(--deep)]">Alerts</div>
//                         <button onClick={() => setNotifOpen(false)} className="bg-transparent border-none cursor-pointer text-[var(--text-muted)]"><X size={14} /></button>
//                     </div>
//                     {enrichedLeads.filter(l => (l.riskScore ?? 0) > 65).slice(0, 4).map(l => (
//                         <div key={l.id} className="px-4 py-2.5 border-b border-[var(--border)] flex items-center gap-2.5 hover:bg-[#f7faf8] cursor-pointer" onClick={() => { openDetail(l); setNotifOpen(false); }}>
//                             <div className="w-6 h-6 rounded-full bg-[#fff0f0] flex items-center justify-center shrink-0">
//                                 <AlertCircle size={12} className="text-[#b94a4f]" />
//                             </div>
//                             <div>
//                                 <div className="text-xs font-semibold text-[var(--deep)]">{l.name} is at-risk</div>
//                                 <div className="text-[10px] text-[var(--text-muted)]">Risk score: {Math.round(l.riskScore ?? 0)}%</div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             <div className="max-w-[1400px] mx-auto px-4 py-5">

//                 {/* ── Summary stats (always visible) ── */}
//                 <div className="grid gap-2.5 mb-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
//                     <StatCard icon={Users} label="Total Leads" value={stats.total} color="#4e7a5e" trend={fmtPct(stats.total, stats.total * 0.85)} />
//                     <StatCard icon={Inbox} label="New" value={stats.new} color="#7ba98b" sub={stats.new > 0 ? "Needs attention" : undefined} trend={null} />
//                     <StatCard icon={Mail} label="Contacted" value={stats.contacted} color="#3d8b8b" trend={fmtPct(stats.contacted, stats.contacted * 0.9)} />
//                     <StatCard icon={CheckCircle} label="Booked" value={stats.booked} color="#7b6fa9" trend={fmtPct(stats.booked, stats.booked * 0.8)} />
//                     <StatCard icon={DollarSign} label="Revenue" value={fmtNaira(stats.revenue)} color="#8b6e3d" trend={fmtPct(stats.revenue, stats.revenue * 0.82)} />
//                     <StatCard icon={AlertTriangle} label="At-Risk" value={stats.atRisk} color="#b94a4f" sub={stats.atRisk > 0 ? "Needs follow-up" : undefined} trend={null} />
//                 </div>

//                 {/* ── CLIENTS TAB ── */}
//                 {activeTab === "clients" && (
//                     <>
//                         {/* Filters */}
//                         <div className="bg-white rounded-2xl border border-[var(--border)] px-4 py-3 mb-4 flex flex-wrap gap-2 items-center shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
//                             <div className="relative flex-[1_1_180px] min-w-[160px]">
//                                 <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
//                                 <input type="text" placeholder="Search name, email…" value={search} onChange={e => setSearch(e.target.value)}
//                                     className="w-full py-2 pr-3 pl-8 border-[1.5px] border-[var(--border)] rounded-[10px] text-[13px] text-[var(--text)] bg-[#f7faf8] outline-none"
//                                     onFocus={e => (e.target.style.borderColor = "var(--sage)")}
//                                     onBlur={e => (e.target.style.borderColor = "var(--border)")} />
//                             </div>
//                             <div className="relative">
//                                 <Filter size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
//                                 <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
//                                     className="py-2 pl-7 pr-6 border-[1.5px] border-[var(--border)] rounded-[10px] text-[13px] text-[var(--text)] bg-[#f7faf8] cursor-pointer outline-none">
//                                     <option value="all">All statuses</option>
//                                     <option value="new">New</option>
//                                     <option value="contacted">Contacted</option>
//                                     <option value="booked">Booked</option>
//                                     <option value="inactive">Inactive</option>
//                                 </select>
//                             </div>
//                             <div className="relative">
//                                 <Activity size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
//                                 <select value={bandFilter} onChange={e => setBandFilter(e.target.value)}
//                                     className="py-2 pl-7 pr-6 border-[1.5px] border-[var(--border)] rounded-[10px] text-[13px] text-[var(--text)] bg-[#f7faf8] cursor-pointer outline-none">
//                                     <option value="all">All severities</option>
//                                     <option value="Low">Low</option>
//                                     <option value="Mild">Mild</option>
//                                     <option value="Moderate">Moderate</option>
//                                     <option value="High">High</option>
//                                 </select>
//                             </div>
//                             <span className="text-xs text-[var(--text-muted)] ml-auto">{enrichedLeads.length} result{enrichedLeads.length !== 1 ? "s" : ""}</span>
//                         </div>

//                         {/* Leads list */}
//                         <div className="flex flex-col gap-2">
//                             {loading && <div className="text-center py-10 text-[var(--text-muted)] text-sm">Loading…</div>}
//                             {!loading && enrichedLeads.length === 0 && (
//                                 <div className="text-center py-14 bg-white rounded-2xl border border-[var(--border)]">
//                                     <Users size={28} className="text-[var(--border)] mb-2 mx-auto" />
//                                     <p className="text-[var(--text-muted)] text-sm">No leads found</p>
//                                 </div>
//                             )}
//                             {!loading && enrichedLeads.map(lead => {
//                                 const sc = STATUS_COLORS[lead.status] ?? STATUS_COLORS.new;
//                                 const bc = BAND_COLORS[lead.band] ?? "#7ba98b";
//                                 const isExpanded = expandedId === lead.id;
//                                 const seqDone = [lead.seq1SentAt, lead.seq2SentAt, lead.seq3SentAt].filter(Boolean).length;
//                                 const daysSinceActive = lead.lastActivity ? daysSince(lead.lastActivity) : null;

//                                 return (
//                                     <div key={lead.id} className="bg-white rounded-[14px] border border-[var(--border)] shadow-[0_1px_6px_rgba(28,58,58,0.04)] overflow-hidden">
//                                         {/* Row */}
//                                         <div className="lead-row grid gap-3 px-4 py-3 cursor-pointer transition-colors duration-100"
//                                             style={{ gridTemplateColumns: "1fr auto" }}
//                                             onClick={() => setExpandedId(isExpanded ? null : lead.id)}>
//                                             <div className="flex items-center gap-3 min-w-0">
//                                                 <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-sm font-bold relative"
//                                                     style={{ background: `${bc}22`, color: bc }}>
//                                                     {lead.name.charAt(0).toUpperCase()}
//                                                     {(lead.riskScore ?? 0) > 65 && (
//                                                         <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#b94a4f] rounded-full border border-white pulse-dot" />
//                                                     )}
//                                                 </div>
//                                                 <div className="min-w-0 flex-1">
//                                                     <div className="flex items-center gap-2 flex-wrap">
//                                                         <span className="text-[13px] font-semibold text-[var(--deep)] truncate">{lead.name}</span>
//                                                         {lead.tags?.map(tag => (
//                                                             <span key={tag} className="text-[9px] font-bold px-1.5 py-[1px] rounded-full bg-[#f0edf7] text-[#7b6fa9]">{tag}</span>
//                                                         ))}
//                                                     </div>
//                                                     <div className="flex items-center gap-2 mt-0.5 flex-wrap">
//                                                         <span className="text-[11px] text-[var(--text-muted)] truncate">{lead.email}</span>
//                                                         {lead.therapist && <span className="text-[10px] text-[var(--sage-dark)]">· {lead.therapist}</span>}
//                                                     </div>
//                                                 </div>
//                                                 <div className="hidden sm:flex gap-1.5 flex-wrap ml-1 shrink-0">
//                                                     <span className="text-[10px] font-semibold px-2 py-[2px] rounded-full" style={{ background: `${bc}18`, color: bc }}>{lead.band}</span>
//                                                     <span className="text-[10px] font-semibold px-2 py-[2px] rounded-full flex items-center gap-1" style={{ background: sc.bg, color: sc.text }}>
//                                                         <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: sc.dot }} />
//                                                         {lead.status}
//                                                     </span>
//                                                     {seqDone > 0 && <span className="text-[10px] px-2 py-[2px] rounded-full bg-[#f0edf7] text-[#7b6fa9] font-semibold">{seqDone}/3</span>}
//                                                     <RiskBadge score={lead.riskScore ?? 0} />
//                                                 </div>
//                                             </div>
//                                             <div className="flex items-center gap-2 shrink-0">
//                                                 <div className="hidden sm:flex flex-col items-end gap-0.5">
//                                                     <span className="text-[11px] font-semibold text-[#4e8c6a]">{fmtNaira(lead.revenue ?? 0)}</span>
//                                                     <span className="text-[10px] text-[var(--text-muted)]">{lead.sessions} sessions</span>
//                                                 </div>
//                                                 <ScoreRing score={lead.score} max={24} color={bc} size={44} />
//                                                 {isExpanded ? <ChevronUp size={14} className="text-[var(--text-muted)]" /> : <ChevronDown size={14} className="text-[var(--text-muted)]" />}
//                                             </div>
//                                         </div>

//                                         {/* Expanded panel */}
//                                         {isExpanded && (
//                                             <div className="border-t border-[var(--border)] px-4 pt-4 pb-4">
//                                                 <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>

//                                                     {/* Left: details + breakdown */}
//                                                     <div>
//                                                         <p className="text-[10px] font-bold text-[var(--sage-dark)] uppercase tracking-[0.1em] mb-2">Client Details</p>
//                                                         <div className="grid grid-cols-2 gap-1.5 mb-3">
//                                                             {[
//                                                                 { l: "Phone", v: lead.phone || "—" },
//                                                                 { l: "Source", v: lead.source || "—" },
//                                                                 { l: "Submitted", v: new Date(lead.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) },
//                                                                 { l: "Last Active", v: daysSinceActive !== null ? `${daysSinceActive}d ago` : "—" },
//                                                                 { l: "Sessions", v: `${lead.sessions ?? 0}` },
//                                                                 { l: "No-shows", v: `${lead.noShowCount ?? 0}` },
//                                                                 { l: "Revenue", v: fmtNaira(lead.revenue ?? 0) },
//                                                                 { l: "Est. LTV", v: fmtNaira(lead.ltv ?? 0) },
//                                                             ].map(({ l, v }) => (
//                                                                 <div key={l} className="px-2.5 py-2 bg-[#f7faf8] rounded-lg border border-[var(--border)]">
//                                                                     <div className="text-[9px] font-bold uppercase tracking-[0.08em] text-[var(--sage-dark)]">{l}</div>
//                                                                     <div className="text-[12px] text-[var(--text)] font-semibold mt-0.5">{v}</div>
//                                                                 </div>
//                                                             ))}
//                                                         </div>

//                                                         <p className="text-[10px] font-bold text-[var(--sage-dark)] uppercase tracking-[0.1em] mb-2">Engagement & Risk</p>
//                                                         <div className="grid grid-cols-2 gap-2 mb-3">
//                                                             <div className="px-2.5 py-2 bg-[#f7faf8] rounded-lg border border-[var(--border)]">
//                                                                 <div className="text-[9px] font-bold uppercase tracking-[0.08em] text-[var(--sage-dark)] mb-1">Engagement</div>
//                                                                 <EngagementBar score={lead.engagementScore ?? 0} />
//                                                             </div>
//                                                             <div className="px-2.5 py-2 bg-[#f7faf8] rounded-lg border border-[var(--border)]">
//                                                                 <div className="text-[9px] font-bold uppercase tracking-[0.08em] text-[var(--sage-dark)] mb-1">Risk Score</div>
//                                                                 <RiskBadge score={lead.riskScore ?? 0} />
//                                                             </div>
//                                                         </div>

//                                                         <p className="text-[10px] font-bold text-[var(--sage-dark)] uppercase tracking-[0.1em] mb-1.5">Symptom Breakdown</p>
//                                                         <div className="flex flex-col gap-[4px]">
//                                                             {Object.entries(lead.answers).map(([k, v]) => (
//                                                                 <div key={k} className="grid items-center gap-2" style={{ gridTemplateColumns: "80px 1fr" }}>
//                                                                     <span className="text-[10px] text-[var(--text-muted)]">{QUESTION_LABELS[k] ?? k}</span>
//                                                                     <MiniBar value={v} color={bc} />
//                                                                 </div>
//                                                             ))}
//                                                         </div>

//                                                         {lead.notes && (
//                                                             <div className="mt-3 px-3 py-2 bg-[#f7faf8] rounded-lg border border-[var(--border)] text-xs italic text-[var(--text-muted)]">
//                                                                 {lead.notes}
//                                                             </div>
//                                                         )}
//                                                     </div>

//                                                     {/* Right: actions */}
//                                                     <div>
//                                                         <p className="text-[10px] font-bold text-[var(--sage-dark)] uppercase tracking-[0.1em] mb-2">Update Status</p>
//                                                         <div className="flex flex-wrap gap-1.5 mb-4">
//                                                             {["new", "contacted", "booked", "inactive"].map(s => (
//                                                                 <button key={s} onClick={e => { e.stopPropagation(); updateStatus(lead.id, s); }}
//                                                                     className="px-3 py-[5px] rounded-full text-[11px] font-semibold cursor-pointer transition-all duration-150"
//                                                                     style={{
//                                                                         border: lead.status === s ? `2px solid ${STATUS_COLORS[s].dot}` : "1.5px solid var(--border)",
//                                                                         background: lead.status === s ? STATUS_COLORS[s].bg : "white",
//                                                                         color: lead.status === s ? STATUS_COLORS[s].text : "var(--text-muted)",
//                                                                     }}>
//                                                                     {s}
//                                                                 </button>
//                                                             ))}
//                                                         </div>

//                                                         <p className="text-[10px] font-bold text-[var(--sage-dark)] uppercase tracking-[0.1em] mb-2">Marketing Sequence</p>
//                                                         <div className="flex flex-col gap-1.5 mb-4">
//                                                             {[
//                                                                 { key: "seq1", label: "Email 1 — Value nudge", sent: lead.seq1SentAt },
//                                                                 { key: "seq2", label: "Email 2 — Check-in", sent: lead.seq2SentAt },
//                                                                 { key: "seq3", label: "Email 3 — Booking push", sent: lead.seq3SentAt },
//                                                             ].map(({ key, label, sent }) => (
//                                                                 <div key={key} className="flex items-center justify-between gap-2">
//                                                                     <div className="flex-1">
//                                                                         <div className="text-[11px] text-[var(--text)] font-medium">{label}</div>
//                                                                         {sent && <div className="text-[10px] text-[var(--sage-dark)]">Sent {new Date(sent).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</div>}
//                                                                     </div>
//                                                                     <button className="seq-btn px-3 py-[4px] rounded-full text-[11px] font-semibold cursor-pointer border-none transition-all duration-150 flex items-center gap-1"
//                                                                         disabled={!!sent || sending === key}
//                                                                         onClick={e => { e.stopPropagation(); sendMessage(lead.id, key); }}
//                                                                         style={{ background: sent ? "#edf7f1" : "linear-gradient(135deg,#4e7a5e,#3d8b8b)", color: sent ? "var(--sage-dark)" : "white" }}>
//                                                                         {sent ? <><CheckCircle size={10} /> Sent</> : sending === key ? "Sending…" : <><Send size={10} /> Send</>}
//                                                                     </button>
//                                                                 </div>
//                                                             ))}
//                                                         </div>

//                                                         <p className="text-[10px] font-bold text-[var(--sage-dark)] uppercase tracking-[0.1em] mb-2">Quick Actions</p>
//                                                         <div className="flex flex-wrap gap-1.5 mb-3">
//                                                             <button onClick={e => { e.stopPropagation(); openDetail(lead); }} className="btn-ghost flex items-center gap-1 px-3 py-[6px] rounded-[10px] text-[11px] font-medium cursor-pointer border border-[var(--border)] bg-white text-[var(--text-muted)]">
//                                                                 <Eye size={11} /> Full view
//                                                             </button>
//                                                             <button onClick={e => { e.stopPropagation(); openNotes(lead); }} className="btn-ghost flex items-center gap-1 px-3 py-[6px] rounded-[10px] text-[11px] font-medium cursor-pointer border border-[var(--border)] bg-white text-[var(--text-muted)]">
//                                                                 <Edit3 size={11} /> Notes
//                                                             </button>
//                                                             <button onClick={e => { e.stopPropagation(); openMessage(lead); }} className="flex items-center gap-1 px-3 py-[6px] rounded-[10px] text-[11px] font-medium cursor-pointer border-none text-white" style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" }}>
//                                                                 <MessageSquare size={11} /> Custom msg
//                                                             </button>
//                                                         </div>

//                                                         {lead.messages.length > 0 && (
//                                                             <>
//                                                                 <p className="text-[10px] font-bold text-[var(--sage-dark)] uppercase tracking-[0.1em] mb-1.5">Message History</p>
//                                                                 <div className="flex flex-col gap-1 max-h-[100px] overflow-y-auto">
//                                                                     {lead.messages.map(m => (
//                                                                         <div key={m.id} className="px-2.5 py-1.5 bg-[#f7faf8] rounded-lg border border-[var(--border)]">
//                                                                             <div className="text-[11px] font-medium text-[var(--text)]">{m.subject}</div>
//                                                                             <div className="text-[9px] text-[var(--text-muted)]">
//                                                                                 {new Date(m.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} · {m.type}
//                                                                             </div>
//                                                                         </div>
//                                                                     ))}
//                                                                 </div>
//                                                             </>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     </>
//                 )}

//                 {/* ── FINANCIAL TAB ── */}
//                 {activeTab === "financial" && (
//                     <div className="flex flex-col gap-4">
//                         <FinancialPanel leads={enrichedLeads} />
//                         <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
//                             <RevenueChart leads={enrichedLeads} />
//                             <ConversionFunnel leads={enrichedLeads} />
//                         </div>
//                         <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
//                             <LtvTable leads={enrichedLeads} />
//                             <SourceAttribution leads={enrichedLeads} />
//                             <div className="bg-white rounded-2xl border border-[var(--border)] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
//                                 <div className="text-[13px] font-semibold text-[var(--deep)] mb-1">Session Metrics</div>
//                                 <div className="text-[11px] text-[var(--text-muted)] mb-4">Attendance & completion</div>
//                                 {[
//                                     { label: "Total Sessions", value: enrichedLeads.reduce((s, l) => s + (l.sessions ?? 0), 0), color: "#4e8c6a", icon: CheckCircle },
//                                     { label: "No-shows", value: enrichedLeads.reduce((s, l) => s + (l.noShowCount ?? 0), 0), color: "#b94a4f", icon: UserX },
//                                     { label: "Avg per client", value: enrichedLeads.length ? (enrichedLeads.reduce((s, l) => s + (l.sessions ?? 0), 0) / enrichedLeads.length).toFixed(1) : 0, color: "#3d8b8b", icon: Repeat },
//                                     { label: "Avg revenue/session", value: fmtNaira(10000), color: "#7b6fa9", icon: CreditCard },
//                                 ].map(m => (
//                                     <div key={m.label} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
//                                         <div className="flex items-center gap-2">
//                                             <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${m.color}18` }}>
//                                                 <m.icon size={12} style={{ color: m.color }} />
//                                             </div>
//                                             <span className="text-xs text-[var(--text-muted)]">{m.label}</span>
//                                         </div>
//                                         <span className="text-xs font-bold text-[var(--deep)]">{m.value}</span>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* ── BEHAVIORAL TAB ── */}
//                 {activeTab === "behavioral" && (
//                     <div className="flex flex-col gap-4">
//                         <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
//                             <BehavioralHeatmap leads={enrichedLeads} />
//                             <BandChart leads={enrichedLeads} />
//                             <EngagementTracker leads={enrichedLeads} />
//                         </div>
//                         <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
//                             <AtRiskPanel leads={enrichedLeads} />
//                             {/* Score distribution */}
//                             <div className="bg-white rounded-2xl border border-[var(--border)] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
//                                 <div className="text-[13px] font-semibold text-[var(--deep)] mb-1">Score Distribution</div>
//                                 <div className="text-[11px] text-[var(--text-muted)] mb-4">Wellness check-in scores (0–24)</div>
//                                 {[[0, 6], [7, 12], [13, 18], [19, 24]].map(([lo, hi]) => {
//                                     const count = enrichedLeads.filter(l => l.score >= lo && l.score <= hi).length;
//                                     const pct = enrichedLeads.length ? (count / enrichedLeads.length) * 100 : 0;
//                                     const color = hi <= 6 ? "#4e8c6a" : hi <= 12 ? "#3d8b8b" : hi <= 18 ? "#8b6e3d" : "#b94a4f";
//                                     return (
//                                         <div key={`${lo}-${hi}`} className="mb-2.5">
//                                             <div className="flex justify-between mb-1">
//                                                 <span className="text-xs text-[var(--text-muted)]">{lo}–{hi}</span>
//                                                 <span className="text-xs font-bold text-[var(--deep)]">{count} <span className="font-normal text-[var(--text-muted)]">({pct.toFixed(0)}%)</span></span>
//                                             </div>
//                                             <div className="h-2 bg-[#f0f4f2] rounded-full overflow-hidden">
//                                                 <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
//                                             </div>
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                             {/* Therapist load */}
//                             <div className="bg-white rounded-2xl border border-[var(--border)] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
//                                 <div className="text-[13px] font-semibold text-[var(--deep)] mb-1">Therapist Load</div>
//                                 <div className="text-[11px] text-[var(--text-muted)] mb-4">Clients per therapist</div>
//                                 {["Dr. Adeola", "Dr. Chukwu", "Dr. Bello", "Dr. Okonkwo"].map((t, i) => {
//                                     const count = enrichedLeads.filter(l => l.therapist === t).length;
//                                     const revenue = enrichedLeads.filter(l => l.therapist === t).reduce((s, l) => s + (l.revenue ?? 0), 0);
//                                     const maxCount = Math.max(...["Dr. Adeola", "Dr. Chukwu", "Dr. Bello", "Dr. Okonkwo"].map(th => enrichedLeads.filter(l => l.therapist === th).length), 1);
//                                     const colors = ["#4e8c6a", "#3d8b8b", "#7b6fa9", "#8b6e3d"];
//                                     return (
//                                         <div key={t} className="mb-2.5">
//                                             <div className="flex justify-between mb-1">
//                                                 <span className="text-xs text-[var(--text-muted)]">{t}</span>
//                                                 <div className="flex items-center gap-2">
//                                                     <span className="text-[10px] text-[#4e8c6a]">{fmtNaira(revenue)}</span>
//                                                     <span className="text-xs font-bold text-[var(--deep)]">{count}</span>
//                                                 </div>
//                                             </div>
//                                             <div className="h-2 bg-[#f0f4f2] rounded-full overflow-hidden">
//                                                 <div className="h-full rounded-full" style={{ width: `${(count / maxCount) * 100}%`, background: colors[i] }} />
//                                             </div>
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* ── COMMUNICATIONS TAB ── */}
//                 {activeTab === "communications" && (
//                     <div className="flex flex-col gap-4">
//                         {/* Sequence performance */}
//                         <div className="bg-white rounded-2xl border border-[var(--border)] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
//                             <div className="text-[13px] font-semibold text-[var(--deep)] mb-1">Email Sequence Performance</div>
//                             <div className="text-[11px] text-[var(--text-muted)] mb-4">Send rate across all leads</div>
//                             <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
//                                 {[
//                                     { label: "Email 1 sent", count: enrichedLeads.filter(l => l.seq1SentAt).length, color: "#4e8c6a", desc: "Value nudge" },
//                                     { label: "Email 2 sent", count: enrichedLeads.filter(l => l.seq2SentAt).length, color: "#3d8b8b", desc: "Check-in" },
//                                     { label: "Email 3 sent", count: enrichedLeads.filter(l => l.seq3SentAt).length, color: "#7b6fa9", desc: "Booking push" },
//                                     { label: "Custom msgs", count: enrichedLeads.reduce((s, l) => s + l.messages.filter(m => m.type === "custom").length, 0), color: "#8b6e3d", desc: "Admin sent" },
//                                 ].map(m => (
//                                     <div key={m.label} className="bg-[#f7faf8] rounded-xl p-3.5 border border-[var(--border)]">
//                                         <div className="text-[11px] text-[var(--text-muted)] mb-0.5">{m.label}</div>
//                                         <div className="text-[22px] font-bold text-[var(--deep)]">{m.count}</div>
//                                         <div className="text-[10px] mt-0.5" style={{ color: m.color }}>{m.desc}</div>
//                                         <div className="mt-2 h-1.5 bg-white rounded-full overflow-hidden">
//                                             <div className="h-full rounded-full" style={{ width: `${enrichedLeads.length ? (m.count / enrichedLeads.length) * 100 : 0}%`, background: m.color }} />
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* All messages log */}
//                         <div className="bg-white rounded-2xl border border-[var(--border)] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
//                             <div className="flex items-center justify-between mb-3">
//                                 <div>
//                                     <div className="text-[13px] font-semibold text-[var(--deep)]">All Messages</div>
//                                     <div className="text-[11px] text-[var(--text-muted)]">Full communication log</div>
//                                 </div>
//                             </div>
//                             <div className="flex flex-col gap-2 max-h-[480px] overflow-y-auto">
//                                 {enrichedLeads.flatMap(l => l.messages.map(m => ({ ...m, leadName: l.name, leadEmail: l.email }))).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(m => (
//                                     <div key={m.id} className="flex items-start gap-3 px-3.5 py-3 bg-[#f7faf8] rounded-xl border border-[var(--border)]">
//                                         <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[#edf7f1]">
//                                             <Mail size={13} className="text-[var(--sage-dark)]" />
//                                         </div>
//                                         <div className="flex-1 min-w-0">
//                                             <div className="flex items-center gap-2 flex-wrap">
//                                                 <span className="text-xs font-semibold text-[var(--deep)]">{m.subject}</span>
//                                                 <span className="text-[9px] font-bold px-1.5 py-[1px] rounded-full bg-[#f0edf7] text-[#7b6fa9]">{m.type}</span>
//                                             </div>
//                                             <div className="text-[10px] text-[var(--text-muted)] mt-0.5">To: {(m as any).leadName} · {(m as any).leadEmail}</div>
//                                         </div>
//                                         <div className="text-[10px] text-[var(--text-muted)] shrink-0">
//                                             {new Date(m.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
//                                         </div>
//                                     </div>
//                                 ))}
//                                 {enrichedLeads.flatMap(l => l.messages).length === 0 && (
//                                     <div className="text-center py-8 text-[var(--text-muted)] text-sm">No messages sent yet</div>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Bulk action panel */}
//                         <div className="bg-white rounded-2xl border border-[var(--border)] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
//                             <div className="text-[13px] font-semibold text-[var(--deep)] mb-1">Quick Outreach</div>
//                             <div className="text-[11px] text-[var(--text-muted)] mb-4">Leads who haven't been contacted yet</div>
//                             <div className="flex flex-col gap-2">
//                                 {enrichedLeads.filter(l => l.status === "new" && !l.seq1SentAt).slice(0, 5).map(l => (
//                                     <div key={l.id} className="flex items-center gap-3 p-2.5 bg-[#f7faf8] rounded-lg border border-[var(--border)]">
//                                         <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: BAND_COLORS[l.band] }}>
//                                             {l.name.charAt(0)}
//                                         </div>
//                                         <div className="flex-1 min-w-0">
//                                             <div className="text-xs font-semibold text-[var(--deep)] truncate">{l.name}</div>
//                                             <div className="text-[10px] text-[var(--text-muted)]">{l.email} · {l.band} severity</div>
//                                         </div>
//                                         <button onClick={() => sendMessage(l.id, "seq1")}
//                                             className="seq-btn px-3 py-[5px] rounded-full text-[11px] font-semibold border-none text-white cursor-pointer flex items-center gap-1 shrink-0"
//                                             disabled={sending === "seq1"}
//                                             style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" }}>
//                                             <Send size={10} /> Send Email 1
//                                         </button>
//                                     </div>
//                                 ))}
//                                 {enrichedLeads.filter(l => l.status === "new" && !l.seq1SentAt).length === 0 && (
//                                     <p className="text-xs text-[var(--text-muted)] italic">All new leads have been contacted 🎉</p>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* ── MODAL: Full detail ── */}
//             {modal === "detail" && selectedLead && (
//                 <div className="modal-bg fixed inset-0 bg-[rgba(28,58,58,0.4)] z-[200] flex items-center justify-center p-4" onClick={() => setModal(null)}>
//                     <div className="modal-card bg-white rounded-[20px] w-full max-w-[620px] max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.15)]" onClick={e => e.stopPropagation()}>
//                         <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between sticky top-0 bg-white z-[1]">
//                             <div>
//                                 <div className="text-[17px] font-[Cormorant_Garamond,serif] text-[var(--deep)]">{selectedLead.name}</div>
//                                 <div className="text-xs text-[var(--text-muted)]">{selectedLead.email} · {selectedLead.therapist}</div>
//                             </div>
//                             <button onClick={() => setModal(null)} className="bg-transparent border-none cursor-pointer text-[var(--text-muted)]"><X size={18} /></button>
//                         </div>
//                         <div className="p-6">
//                             {/* Severity */}
//                             <div className="px-4 py-3.5 rounded-[14px] mb-4" style={{ background: `${BAND_COLORS[selectedLead.band]}14`, border: `1px solid ${BAND_COLORS[selectedLead.band]}28` }}>
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <div className="text-[10px] uppercase tracking-[0.1em] font-bold mb-0.5" style={{ color: BAND_COLORS[selectedLead.band] }}>{selectedLead.severity}</div>
//                                         <div className="text-[24px] font-bold" style={{ color: BAND_COLORS[selectedLead.band] }}>{selectedLead.score} <span className="text-sm font-normal text-[var(--text-muted)]">/ 24</span></div>
//                                     </div>
//                                     <div className="flex flex-col items-end gap-1">
//                                         <RiskBadge score={selectedLead.riskScore ?? 0} />
//                                         <EngagementBar score={selectedLead.engagementScore ?? 0} />
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Grid info */}
//                             <div className="grid grid-cols-3 gap-2 mb-4">
//                                 {[
//                                     { l: "Revenue", v: fmtNaira(selectedLead.revenue ?? 0) },
//                                     { l: "Sessions", v: `${selectedLead.sessions ?? 0}` },
//                                     { l: "Est. LTV", v: fmtNaira(selectedLead.ltv ?? 0) },
//                                     { l: "Status", v: selectedLead.status },
//                                     { l: "Source", v: selectedLead.source || "—" },
//                                     { l: "No-shows", v: `${selectedLead.noShowCount ?? 0}` },
//                                 ].map(({ l, v }) => (
//                                     <div key={l} className="px-3 py-2.5 bg-[#f7faf8] rounded-[10px] border border-[var(--border)]">
//                                         <div className="text-[9px] uppercase tracking-[0.08em] text-[var(--sage-dark)] font-bold mb-0.5">{l}</div>
//                                         <div className="text-[13px] text-[var(--text)] font-semibold">{v}</div>
//                                     </div>
//                                 ))}
//                             </div>

//                             <p className="text-[10px] font-bold text-[var(--sage-dark)] uppercase tracking-[0.1em] mb-2">Area Breakdown</p>
//                             <div className="flex flex-col gap-1.5 mb-4">
//                                 {Object.entries(selectedLead.answers).map(([k, v]) => (
//                                     <div key={k} className="grid items-center gap-2.5" style={{ gridTemplateColumns: "100px 1fr" }}>
//                                         <span className="text-xs text-[var(--text-muted)]">{QUESTION_LABELS[k] ?? k}</span>
//                                         <MiniBar value={v} color={BAND_COLORS[selectedLead.band] ?? "#7ba98b"} />
//                                     </div>
//                                 ))}
//                             </div>

//                             {selectedLead.notes && (
//                                 <>
//                                     <p className="text-[10px] font-bold text-[var(--sage-dark)] uppercase tracking-[0.1em] mb-1.5">Notes</p>
//                                     <div className="px-3.5 py-3 bg-[#f7faf8] rounded-[10px] border border-[var(--border)] text-xs text-[var(--text-muted)] italic mb-4">{selectedLead.notes}</div>
//                                 </>
//                             )}

//                             {selectedLead.messages.length > 0 && (
//                                 <>
//                                     <p className="text-[10px] font-bold text-[var(--sage-dark)] uppercase tracking-[0.1em] mb-2">Message Log</p>
//                                     <div className="flex flex-col gap-1.5">
//                                         {selectedLead.messages.map(m => (
//                                             <div key={m.id} className="px-3.5 py-2.5 bg-[#f7faf8] rounded-[10px] border border-[var(--border)]">
//                                                 <div className="text-xs font-semibold text-[var(--text)]">{m.subject}</div>
//                                                 <div className="text-[10px] text-[var(--text-muted)] mt-[2px]">
//                                                     {new Date(m.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} · {m.type}
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* ── MODAL: Notes ── */}
//             {modal === "notes" && selectedLead && (
//                 <div className="modal-bg fixed inset-0 bg-[rgba(28,58,58,0.4)] z-[200] flex items-center justify-center p-4" onClick={() => setModal(null)}>
//                     <div className="modal-card bg-white rounded-[20px] w-full max-w-[480px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden" onClick={e => e.stopPropagation()}>
//                         <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
//                             <div className="text-[15px] font-semibold text-[var(--deep)]">Notes — {selectedLead.name}</div>
//                             <button onClick={() => setModal(null)} className="bg-transparent border-none cursor-pointer text-[var(--text-muted)]"><X size={18} /></button>
//                         </div>
//                         <div className="p-6">
//                             <textarea value={notes} onChange={e => setNotes(e.target.value)}
//                                 placeholder="Add observations, follow-up reminders, context…"
//                                 rows={6}
//                                 className="w-full px-3.5 py-3 border-[1.5px] border-[var(--border)] rounded-xl text-[13px] text-[var(--text)] resize-y outline-none bg-[#f7faf8] leading-[1.7]"
//                                 onFocus={e => (e.target.style.borderColor = "var(--sage)")}
//                                 onBlur={e => (e.target.style.borderColor = "var(--border)")} />
//                             <div className="flex gap-2 mt-3 justify-end">
//                                 <button onClick={() => setModal(null)} className="px-4 py-2 rounded-full border border-[var(--border)] bg-white text-[var(--text-muted)] text-xs font-medium cursor-pointer">Cancel</button>
//                                 <button onClick={saveNotes} disabled={savingNotes}
//                                     className="px-5 py-2 rounded-full border-none text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5"
//                                     style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" }}>
//                                     <FileText size={12} /> {savingNotes ? "Saving…" : "Save notes"}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* ── MODAL: Custom message ── */}
//             {modal === "message" && selectedLead && (
//                 <div className="modal-bg fixed inset-0 bg-[rgba(28,58,58,0.4)] z-[200] flex items-center justify-center p-4" onClick={() => setModal(null)}>
//                     <div className="modal-card bg-white rounded-[20px] w-full max-w-[520px] max-h-[90vh] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden" onClick={e => e.stopPropagation()}>
//                         <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
//                             <div className="text-[15px] font-semibold text-[var(--deep)]">Message — {selectedLead.name}</div>
//                             <button onClick={() => setModal(null)} className="bg-transparent border-none cursor-pointer text-[var(--text-muted)]"><X size={18} /></button>
//                         </div>
//                         <div className="p-6 overflow-y-auto max-h-[calc(90vh-60px)]">
//                             <div className="mb-3">
//                                 <label className="block text-[10px] font-bold text-[var(--sage-dark)] uppercase tracking-[0.08em] mb-1.5">Subject</label>
//                                 <input type="text" placeholder="Email subject…" value={customSubject} onChange={e => setCustomSubject(e.target.value)}
//                                     className="w-full px-3.5 py-2.5 border-[1.5px] border-[var(--border)] rounded-[10px] text-[13px] text-[var(--text)] outline-none bg-[#f7faf8]"
//                                     onFocus={e => (e.target.style.borderColor = "var(--sage)")}
//                                     onBlur={e => (e.target.style.borderColor = "var(--border)")} />
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-[10px] font-bold text-[var(--sage-dark)] uppercase tracking-[0.08em] mb-1.5">Message</label>
//                                 <textarea placeholder={`Write your message to ${selectedLead.name}…`} value={customBody} onChange={e => setCustomBody(e.target.value)}
//                                     rows={7}
//                                     className="w-full px-3.5 py-2.5 border-[1.5px] border-[var(--border)] rounded-[10px] text-[13px] text-[var(--text)] resize-y outline-none bg-[#f7faf8] leading-[1.7]"
//                                     onFocus={e => (e.target.style.borderColor = "var(--sage)")}
//                                     onBlur={e => (e.target.style.borderColor = "var(--border)")} />
//                                 <p className="text-[10px] text-[var(--text-muted)] mt-1">Wrapped in Mentel branded email.</p>
//                             </div>
//                             <div className="flex gap-2 justify-end">
//                                 <button onClick={() => setModal(null)} className="px-4 py-2 rounded-full border border-[var(--border)] bg-white text-[var(--text-muted)] text-xs font-medium cursor-pointer">Cancel</button>
//                                 <button onClick={() => sendMessage(selectedLead.id, "custom", customSubject, customBody)}
//                                     disabled={!customSubject.trim() || !customBody.trim() || sending === "custom"}
//                                     className="px-5 py-2 rounded-full border-none text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5"
//                                     style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)", opacity: !customSubject.trim() || !customBody.trim() ? 0.5 : 1 }}>
//                                     <Send size={12} /> {sending === "custom" ? "Sending…" : "Send message"}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }


"use client";

// app/admin/page.tsx  — Main dashboard
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
    Users, Calendar, CreditCard, TrendingUp, TrendingDown,
    ArrowUpRight, ArrowDownRight, AlertTriangle, Clock,
    CheckCircle, Activity, DollarSign, BarChart2,
    RefreshCw, ChevronRight, Zap,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface AnalyticsData {
    overview: {
        totalLeads: number;
        newLeads: number;
        newLeadsLastMonth: number;
        bookedLeads: number;
        conversionRate: number;
        totalSessions: number;
        thisMonthSessions: number;
        lastMonthSessions: number;
        sessionGrowth: number | null;
        noShows: number;
        noShowRate: number;
        totalPaidKobo: number;
        thisMonthPaidKobo: number;
        lastMonthPaidKobo: number;
        pendingKobo: number;
        revenueGrowth: number | null;
        arpu: number;
        upcomingCount: number;
        avgMood: number | null;
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
    alerts: {
        highSeverityLeads: { id: string; name: string; email: string; band: string; score: number; createdAt: string }[];
    };
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmtNaira = (kobo: number) => {
    const naira = kobo / 100;
    if (naira >= 1_000_000) return `₦${(naira / 1_000_000).toFixed(1)}M`;
    if (naira >= 1_000) return `₦${(naira / 1_000).toFixed(0)}K`;
    return `₦${naira.toFixed(0)}`;
};

const fmtPct = (n: number | null) => {
    if (n === null) return null;
    return { pct: Math.abs(n).toFixed(1), up: n >= 0 };
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const shortMonth = (ym: string) => {
    const [, m] = ym.split("-");
    return MONTHS[parseInt(m, 10) - 1];
};

const BAND_COLORS: Record<string, string> = {
    Low: "#4e8c6a", Mild: "#3d8b8b", Moderate: "#8b6e3d", High: "#b94a4f",
};
const SOURCE_COLORS = ["#4e8c6a", "#3d8b8b", "#7b6fa9", "#8b6e3d", "#b94a4f"];

// ── Stat Card ──────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color, trend, href }: {
    icon: React.ElementType; label: string; value: string | number;
    sub?: string; color: string; trend?: { pct: string; up: boolean } | null; href?: string;
}) {
    const inner = (
        <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-[0_1px_8px_rgba(28,58,58,0.05)] flex flex-col gap-2 px-5 py-4 group hover:shadow-[0_4px_20px_rgba(28,58,58,0.1)] transition-shadow">
            <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
                    <Icon size={16} style={{ color }} />
                </div>
                {trend && (
                    <span className={`text-[11px] font-semibold flex items-center gap-0.5 ${trend.up ? "text-[#4e8c6a]" : "text-[#b94a4f]"}`}>
                        {trend.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                        {trend.pct}%
                    </span>
                )}
                {href && <ChevronRight size={13} className="text-[#b0c8bc] group-hover:text-[#4e8c6a] transition-colors" />}
            </div>
            <div>
                <div className="text-[22px] font-bold text-[#1c3a3a] leading-tight">{value}</div>
                <div className="text-[11px] text-[#7a9088] mt-0.5 font-medium">{label}</div>
                {sub && <div className="text-[10px] mt-0.5 font-medium" style={{ color }}>{sub}</div>}
            </div>
        </div>
    );
    return href ? <Link href={href} className="block">{inner}</Link> : inner;
}

// ── Revenue SVG Chart ──────────────────────────────────────────────────────────
function RevenueAreaChart({ data }: { data: { month: string; amountKobo: number }[] }) {
    if (!data.length) return (
        <div className="h-[120px] flex items-center justify-center text-[#b0c8bc] text-sm">No revenue data yet</div>
    );
    const W = 500, H = 110, PAD = 12;
    const maxVal = Math.max(...data.map(d => d.amountKobo), 1);
    const pts = data.map((d, i) => ({
        x: PAD + (i / Math.max(data.length - 1, 1)) * (W - PAD * 2),
        y: H - PAD - ((d.amountKobo / maxVal) * (H - PAD * 2)),
        ...d,
    }));
    const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
    const areaPath = `${linePath} L${pts[pts.length - 1].x},${H - PAD} L${pts[0].x},${H - PAD} Z`;

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 110 }}>
            <defs>
                <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4e7a5e" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#4e7a5e" stopOpacity="0.01" />
                </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#rg)" />
            <path d={linePath} fill="none" stroke="#4e7a5e" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            {pts.map((p, i) => (
                <g key={i}>
                    <circle cx={p.x} cy={p.y} r={3} fill="#4e7a5e" />
                    <text x={p.x} y={H} textAnchor="middle" fontSize={9} fill="#8da898">{shortMonth(p.month)}</text>
                    {p.amountKobo > 0 && (
                        <text x={p.x} y={p.y - 7} textAnchor="middle" fontSize={8} fill="#4e7a5e" fontWeight="600">
                            {fmtNaira(p.amountKobo)}
                        </text>
                    )}
                </g>
            ))}
        </svg>
    );
}

// ── Leads bar chart ────────────────────────────────────────────────────────────
function LeadsBarChart({ data }: { data: { month: string; count: number }[] }) {
    if (!data.length) return (
        <div className="h-[80px] flex items-center justify-center text-[#b0c8bc] text-sm">No data</div>
    );
    const maxVal = Math.max(...data.map(d => d.count), 1);
    return (
        <div className="flex items-end gap-1.5 h-[80px]">
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t-[4px] transition-all duration-500" style={{
                        height: `${Math.max((d.count / maxVal) * 64, 4)}px`,
                        background: "linear-gradient(180deg,#4e8c6a,#3d8b8b)",
                    }} title={`${d.count} leads`} />
                    <span className="text-[9px] text-[#8da898]">{shortMonth(d.month)}</span>
                </div>
            ))}
        </div>
    );
}

// ── Band donut ─────────────────────────────────────────────────────────────────
function BandDonut({ dist }: { dist: Record<string, number> }) {
    const bands = Object.entries(dist).sort(([a], [b]) => {
        const order = ["Low", "Mild", "Moderate", "High"];
        return order.indexOf(a) - order.indexOf(b);
    });
    const total = bands.reduce((s, [, n]) => s + n, 0) || 1;
    const R = 36, cx = 44, cy = 44, stroke = 14;
    const circ = 2 * Math.PI * R;
    let offset = 0;

    return (
        <div className="flex items-center gap-4">
            <svg width={88} height={88}>
                <circle cx={cx} cy={cy} r={R} fill="none" stroke="#f0f4f2" strokeWidth={stroke} />
                {bands.map(([band, count]) => {
                    const pct = count / total;
                    const dash = circ * pct;
                    const seg = (
                        <circle key={band} cx={cx} cy={cy} r={R} fill="none"
                            stroke={BAND_COLORS[band] ?? "#8da898"} strokeWidth={stroke}
                            strokeDasharray={`${dash} ${circ - dash}`}
                            strokeDashoffset={-offset}
                            strokeLinecap="butt"
                            style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }}
                        />
                    );
                    offset += dash;
                    return seg;
                })}
                <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fontSize={13} fontWeight="700" fill="#1c3a3a">{total}</text>
                <text x={cx} y={cy + 13} textAnchor="middle" dominantBaseline="middle" fontSize={8} fill="#7a9088">leads</text>
            </svg>
            <div className="flex flex-col gap-1.5">
                {bands.map(([band, count]) => (
                    <div key={band} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ background: BAND_COLORS[band] }} />
                        <span className="text-[11px] text-[#7a9088]">{band}</span>
                        <span className="text-[11px] font-bold text-[#1c3a3a] ml-auto pl-3">{count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Therapist bar ──────────────────────────────────────────────────────────────
function TherapistBars({ data }: { data: { name: string; sessions: number }[] }) {
    const max = Math.max(...data.map(d => d.sessions), 1);
    const colors = ["#4e8c6a", "#3d8b8b", "#7b6fa9", "#8b6e3d"];
    return (
        <div className="flex flex-col gap-2.5">
            {data.map((t, i) => (
                <div key={t.name}>
                    <div className="flex justify-between mb-1">
                        <span className="text-[11px] text-[#7a9088]">{t.name}</span>
                        <span className="text-[11px] font-bold text-[#1c3a3a]">{t.sessions} sessions</span>
                    </div>
                    <div className="h-2 bg-[#f0f4f2] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(t.sessions / max) * 100}%`, background: colors[i % colors.length] }} />
                    </div>
                </div>
            ))}
            {data.length === 0 && <p className="text-[11px] text-[#b0c8bc] italic">No session data yet</p>}
        </div>
    );
}

// ── Source attribution ─────────────────────────────────────────────────────────
function SourceBars({ dist }: { dist: Record<string, number> }) {
    const entries = Object.entries(dist).sort(([, a], [, b]) => b - a);
    const total = entries.reduce((s, [, n]) => s + n, 0) || 1;
    return (
        <div className="flex flex-col gap-2">
            {entries.map(([src, count], i) => (
                <div key={src} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: SOURCE_COLORS[i % SOURCE_COLORS.length] }} />
                    <span className="text-[11px] text-[#7a9088] flex-1 capitalize">{src}</span>
                    <div className="w-20 h-1.5 bg-[#f0f4f2] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(count / total) * 100}%`, background: SOURCE_COLORS[i % SOURCE_COLORS.length] }} />
                    </div>
                    <span className="text-[11px] font-bold text-[#1c3a3a] w-5 text-right">{count}</span>
                </div>
            ))}
            {entries.length === 0 && <p className="text-[11px] text-[#b0c8bc] italic">No source data</p>}
        </div>
    );
}

// ── Main dashboard ─────────────────────────────────────────────────────────────
export default function DashboardPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetch = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        else setRefreshing(true);
        try {
            const res = await window.fetch("/api/admin/analytics");
            const json = await res.json();
            if (json.success) setData(json);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-[#4e8c6a] border-t-transparent animate-spin" />
                    <p className="text-[#7a9088] text-sm">Loading analytics…</p>
                </div>
            </div>
        );
    }

    const ov = data?.overview;
    const charts = data?.charts;
    const dist = data?.distributions;

    return (
        <div className="flex flex-col gap-5">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[20px] font-bold text-[#1c3a3a]">Good morning 👋</h1>
                    <p className="text-[12px] text-[#7a9088] mt-0.5">Here's what's happening with your practice today.</p>
                </div>
                <button onClick={() => fetch(true)} disabled={refreshing}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#ddeae2] rounded-xl text-[12px] text-[#7a9088] font-medium cursor-pointer hover:bg-[#f7faf8] transition-colors">
                    <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>

            {/* KPI cards */}
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
                <StatCard icon={Users} label="Total Leads" value={ov?.totalLeads ?? 0} color="#4e7a5e" trend={fmtPct(ov?.newLeads && ov?.newLeadsLastMonth ? ((ov.newLeads - ov.newLeadsLastMonth) / Math.max(ov.newLeadsLastMonth, 1)) * 100 : null)} href="/admin/patients" />
                <StatCard icon={Calendar} label="Sessions (mo.)" value={ov?.thisMonthSessions ?? 0} color="#3d8b8b" trend={fmtPct(ov?.sessionGrowth ?? null)} href="/admin/appointments" />
                <StatCard icon={DollarSign} label="Revenue (mo.)" value={fmtNaira(ov?.thisMonthPaidKobo ?? 0)} color="#8b6e3d" trend={fmtPct(ov?.revenueGrowth ?? null)} href="/admin/payments" />
                <StatCard icon={TrendingUp} label="Conversion" value={`${(ov?.conversionRate ?? 0).toFixed(1)}%`} color="#7b6fa9" sub="Lead → Booked" trend={null} />
                <StatCard icon={Clock} label="Upcoming" value={ov?.upcomingCount ?? 0} color="#4e8c6a" sub="appointments" trend={null} href="/admin/appointments" />
                <StatCard icon={AlertTriangle} label="Pending (₦)" value={fmtNaira(ov?.pendingKobo ?? 0)} color="#b94a4f" sub="awaiting payment" trend={null} href="/admin/payments" />
            </div>

            {/* Charts row */}
            <div className="grid gap-4" style={{ gridTemplateColumns: "2fr 1fr" }}>
                {/* Revenue chart */}
                <div className="bg-white rounded-2xl border border-[#ddeae2] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="text-[13px] font-semibold text-[#1c3a3a]">Monthly Revenue</div>
                            <div className="text-[11px] text-[#7a9088]">Paid sessions — last 6 months</div>
                        </div>
                        <div className="text-right">
                            <div className="text-[18px] font-bold text-[#1c3a3a]">{fmtNaira(ov?.totalPaidKobo ?? 0)}</div>
                            <div className="text-[10px] text-[#7a9088]">total revenue</div>
                        </div>
                    </div>
                    <RevenueAreaChart data={charts?.monthlyRevenue ?? []} />
                </div>

                {/* New leads chart */}
                <div className="bg-white rounded-2xl border border-[#ddeae2] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
                    <div className="mb-4">
                        <div className="text-[13px] font-semibold text-[#1c3a3a]">New Leads</div>
                        <div className="text-[11px] text-[#7a9088]">Last 6 months</div>
                    </div>
                    <LeadsBarChart data={charts?.monthlyLeads ?? []} />
                    <div className="mt-3 pt-3 border-t border-[#f0f4f2] flex items-center justify-between">
                        <span className="text-[11px] text-[#7a9088]">This month</span>
                        <span className="text-[14px] font-bold text-[#4e8c6a]">{ov?.newLeads ?? 0} leads</span>
                    </div>
                </div>
            </div>

            {/* Distribution + Therapists + Sources row */}
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
                {/* Band distribution */}
                <div className="bg-white rounded-2xl border border-[#ddeae2] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
                    <div className="text-[13px] font-semibold text-[#1c3a3a] mb-1">Severity Distribution</div>
                    <div className="text-[11px] text-[#7a9088] mb-4">All leads by band</div>
                    <BandDonut dist={dist?.band ?? {}} />
                </div>

                {/* Source attribution */}
                <div className="bg-white rounded-2xl border border-[#ddeae2] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
                    <div className="text-[13px] font-semibold text-[#1c3a3a] mb-1">Traffic Sources</div>
                    <div className="text-[11px] text-[#7a9088] mb-4">Where leads come from</div>
                    <SourceBars dist={dist?.source ?? {}} />
                </div>

                {/* Therapist load */}
                <div className="bg-white rounded-2xl border border-[#ddeae2] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
                    <div className="text-[13px] font-semibold text-[#1c3a3a] mb-1">Therapist Load</div>
                    <div className="text-[11px] text-[#7a9088] mb-4">Sessions per practitioner</div>
                    <TherapistBars data={dist?.therapist ?? []} />
                </div>
            </div>

            {/* Alerts + quick stats */}
            <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
                {/* High severity alerts */}
                <div className="bg-white rounded-2xl border border-[#ddeae2] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
                    <div className="flex items-center gap-1.5 mb-3">
                        <AlertTriangle size={14} className="text-[#b94a4f]" />
                        <div className="text-[13px] font-semibold text-[#1c3a3a]">Needs Attention</div>
                    </div>
                    {(data?.alerts.highSeverityLeads ?? []).length === 0 ? (
                        <div className="flex items-center gap-2 py-3">
                            <CheckCircle size={16} className="text-[#4e8c6a]" />
                            <p className="text-[12px] text-[#7a9088]">All high-severity leads have been contacted</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {data!.alerts.highSeverityLeads.map(l => (
                                <Link key={l.id} href={`/admin/patients/${l.id}`}
                                    className="flex items-center gap-2.5 p-2.5 bg-[#fff8f8] border border-[#f5e0e0] rounded-xl hover:bg-[#fff0f0] transition-colors">
                                    <div className="w-7 h-7 rounded-full bg-[#b94a4f] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                                        {l.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[12px] font-semibold text-[#1c3a3a] truncate">{l.name}</div>
                                        <div className="text-[10px] text-[#7a9088]">Score {l.score}/24 · {l.band}</div>
                                    </div>
                                    <ChevronRight size={13} className="text-[#b94a4f] shrink-0" />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick metrics */}
                <div className="bg-white rounded-2xl border border-[#ddeae2] p-5 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
                    <div className="text-[13px] font-semibold text-[#1c3a3a] mb-3">Practice Metrics</div>
                    <div className="flex flex-col gap-0">
                        {[
                            { label: "Avg. session value", value: fmtNaira(ov?.arpu ?? 0), color: "#4e8c6a" },
                            { label: "No-show rate", value: `${(ov?.noShowRate ?? 0).toFixed(1)}%`, color: (ov?.noShowRate ?? 0) > 15 ? "#b94a4f" : "#4e8c6a" },
                            { label: "Total sessions", value: `${ov?.totalSessions ?? 0}`, color: "#3d8b8b" },
                            { label: "Avg. client mood", value: ov?.avgMood ? `${ov.avgMood.toFixed(1)}/5` : "—", color: "#7b6fa9" },
                            { label: "Booked clients", value: `${ov?.bookedLeads ?? 0}`, color: "#4e8c6a" },
                        ].map(m => (
                            <div key={m.label} className="flex items-center justify-between py-2.5 border-b border-[#f0f4f2] last:border-0">
                                <span className="text-[12px] text-[#7a9088]">{m.label}</span>
                                <span className="text-[13px] font-bold" style={{ color: m.color }}>{m.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}