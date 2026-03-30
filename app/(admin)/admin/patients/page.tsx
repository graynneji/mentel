// "use client";

// // app/admin/patients/page.tsx
// import { useState, useEffect, useCallback } from "react";
// import Link from "next/link";
// import {
//     Search, Filter, Users, Eye, Edit3, MessageSquare,
//     Calendar, Send, CheckCircle, AlertCircle, X,
//     ChevronDown, ChevronUp, RefreshCw, Plus, Tag,
//     Activity, Phone, Mail, Clock, TrendingUp,
// } from "lucide-react";
// import { SessionTypes } from "../settings/page";

// // ── Types ──────────────────────────────────────────────────────────────────────
// interface Message { id: string; createdAt: string; subject: string; type: string; }
// interface Lead {
//     id: string; createdAt: string; updatedAt: string;
//     name: string; email: string; phone: string | null;
//     score: number; band: string; severity: string; answers: Record<string, number>;
//     status: string; notes: string | null; source: string | null; therapist: string | null; tags: string[];
//     seq1SentAt: string | null; seq2SentAt: string | null; seq3SentAt: string | null;
//     messages: Message[];
//     _count?: { appointments: number; sessions: number; payments: number };
// }

// // ── Constants ──────────────────────────────────────────────────────────────────
// const STATUS_CFG: Record<string, { bg: string; text: string; dot: string }> = {
//     new: { bg: "#edf7f1", text: "#3a7a58", dot: "#7ba98b" },
//     contacted: { bg: "#e8f4f8", text: "#2a5a7a", dot: "#6fb8b8" },
//     booked: { bg: "#f0edf7", text: "#5a3a7a", dot: "#a88bcf" },
//     inactive: { bg: "#f5f5f5", text: "#7a7a7a", dot: "#b0b0b0" },
//     churned: { bg: "#fff0f0", text: "#7a3a3a", dot: "#cf8b8b" },
// };
// const BAND_COLORS: Record<string, string> = {
//     Low: "#4e8c6a", Mild: "#3d8b8b", Moderate: "#8b6e3d", High: "#b94a4f",
// };
// const Q_LABELS: Record<string, string> = {
//     q1: "Mood", q2: "Anxiety", q3: "Energy", q4: "Sleep",
//     q5: "Relationships", q6: "Stress", q7: "Self-worth", q8: "Support",
// };
// const THERAPISTS = ["Yetunde"];

// // ── Helpers ────────────────────────────────────────────────────────────────────
// const daysSince = (iso: string) => Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);

// function MiniBar({ value, max = 3, color }: { value: number; max?: number; color: string }) {
//     return (
//         <div className="flex items-center gap-1.5">
//             <div className="flex-1 h-[3px] bg-[#e8eeea] rounded-full overflow-hidden">
//                 <div className="h-full rounded-full" style={{ width: `${(value / max) * 100}%`, background: color }} />
//             </div>
//             <span className="text-[9px] text-[#7a9088] w-5">{value}/{max}</span>
//         </div>
//     );
// }

// function ScoreRing({ score, color, size = 44 }: { score: number; color: string; size?: number }) {
//     const max = 24, r = (size - 8) / 2, circ = 2 * Math.PI * r, dash = circ * (score / max);
//     return (
//         <div className="relative shrink-0" style={{ width: size, height: size }}>
//             <svg width={size} height={size} className="-rotate-90">
//                 <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e8eeea" strokeWidth={4} />
//                 <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={4}
//                     strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
//             </svg>
//             <div className="absolute inset-0 flex items-center justify-center">
//                 <span className="text-[10px] font-bold text-[#1c3a3a]">{score}</span>
//             </div>
//         </div>
//     );
// }

// // ── Patients page ──────────────────────────────────────────────────────────────
// export default function PatientsPage() {
//     const [leads, setLeads] = useState<Lead[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [total, setTotal] = useState(0);
//     const [search, setSearch] = useState("");
//     const [statusFilter, setStatus] = useState("all");
//     const [bandFilter, setBand] = useState("all");
//     const [expandedId, setExpanded] = useState<string | null>(null);
//     const [modal, setModal] = useState<"notes" | "message" | "book" | null>(null);
//     const [selected, setSelected] = useState<Lead | null>(null);
//     const [notes, setNotes] = useState("");
//     const [saving, setSaving] = useState(false);
//     const [sending, setSending] = useState<string | null>(null);
//     const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
//     // Book appointment form
//     const [bookDate, setBookDate] = useState("");
//     const [bookTime, setBookTime] = useState("09:00");
//     const [bookTherapist, setBookTherapist] = useState(THERAPISTS[0]);
//     const [bookType, setBookType] = useState("initial");
//     const [bookDuration, setBookDuration] = useState("50");
//     const [bookNotes, setBookNotes] = useState("");
//     const [booking, setBooking] = useState(false);
//     // Custom message
//     const [msgSubject, setMsgSubject] = useState("");
//     const [msgBody, setMsgBody] = useState("");
//     const { sessionTypes } = SessionTypes();

//     const showToast = (msg: string, ok = true) => {
//         setToast({ msg, ok }); setTimeout(() => setToast(null), 3500);
//     };

//     const fetchLeads = useCallback(async () => {
//         setLoading(true);
//         const params = new URLSearchParams();
//         if (search) params.set("search", search);
//         if (statusFilter !== "all") params.set("status", statusFilter);
//         if (bandFilter !== "all") params.set("band", bandFilter);
//         params.set("limit", "100");
//         try {
//             const res = await fetch(`/api/admin/leads?${params.toString()}`);
//             const data = await res.json();
//             if (data.success) { setLeads(data.leads); setTotal(data.leads.length); }
//         } finally { setLoading(false); }
//     }, [search, statusFilter, bandFilter]);

//     useEffect(() => { const t = setTimeout(fetchLeads, 300); return () => clearTimeout(t); }, [fetchLeads]);

//     const updateStatus = async (id: string, status: string) => {
//         await fetch("/api/admin/leads", {
//             method: "PATCH", headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ id, status }),
//         });
//         setLeads(p => p.map(l => l.id === id ? { ...l, status } : l));
//         showToast("Status updated");
//     };

//     const updateTherapist = async (id: string, therapist: string) => {
//         await fetch("/api/admin/leads", {
//             method: "PATCH", headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ id, therapist }),
//         });
//         setLeads(p => p.map(l => l.id === id ? { ...l, therapist } : l));
//         showToast("Therapist assigned");
//     };

//     const saveNotes = async () => {
//         if (!selected) return;
//         setSaving(true);
//         await fetch("/api/admin/leads", {
//             method: "PATCH", headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ id: selected.id, notes }),
//         });
//         setLeads(p => p.map(l => l.id === selected.id ? { ...l, notes } : l));
//         setSaving(false); showToast("Notes saved"); setModal(null);
//     };

//     const sendMsg = async (leadId: string, type: string, customSubj?: string, customBod?: string) => {
//         // setSending(type);
//         // try {
//         //     const body: Record<string, string> = { leadId, type };
//         //     // if (type === "custom") { body.customSubject = msgSubject; body.customBody = msgBody; }
//         //     const res = await fetch("/api/admin/message", {
//         //         method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
//         //             leadId, type,
//         //             ...(type === "custom" ? { customSubject: msgSubject, customBody: msgBody } : {}),
//         //         }),
//         //     });
//         //     const data = await res.json() as { success: boolean };
//         //     if (data.success) { showToast("Sent!"); setModal(null); setMsgSubject(""); setMsgBody(""); fetchLeads(); }
//         //     else showToast("Failed", false);
//         // } finally { setSending(null); }


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
//                 showToast("Sent!"); setModal(null); setMsgSubject(""); setMsgBody(""); fetchLeads();
//             } else showToast("Failed to send message", false);
//         } catch { showToast("Failed to send message", false); }
//         finally { setSending(null); }
//     };

//     const bookAppointment = async () => {
//         if (!selected || !bookDate) return;
//         setBooking(true);
//         try {
//             const res = await fetch("/api/admin/appointments", {
//                 method: "POST", headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     leadId: selected.id,
//                     scheduledAt: `${bookDate}T${bookTime}:00`,
//                     therapist: bookTherapist,
//                     type: bookType,
//                     durationMin: parseInt(bookDuration),
//                     notes: bookNotes || undefined,
//                 }),
//             });
//             const data = await res.json();
//             if (data.success) {
//                 showToast("Appointment booked!");
//                 setModal(null);
//                 setBookDate(""); setBookNotes("");
//                 setLeads(p => p.map(l => l.id === selected.id ? { ...l, status: "booked", therapist: bookTherapist } : l));
//             } else showToast("Failed to book", false);
//         } finally { setBooking(false); }
//     };

//     const openNotes = (l: Lead) => { setSelected(l); setNotes(l.notes ?? ""); setModal("notes"); };
//     const openMessage = (l: Lead) => { setSelected(l); setModal("message"); };
//     const openBook = (l: Lead) => { setSelected(l); setModal("book"); };

//     return (
//         <div className="flex flex-col gap-4">
//             <style>{`
//         @keyframes slideIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
//         @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
//         @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
//         .modal-bg { animation: fadeIn 0.18s ease; }
//         .modal-card { animation: slideUp 0.22s ease; }
//         .lead-row:hover { background: #f7faf8 !important; }
//       `}</style>

//             {/* Toast */}
//             {toast && (
//                 <div className="fixed top-5 right-5 z-[9999] flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-[13px] font-medium shadow-lg"
//                     style={{ background: toast.ok ? "#1c3a3a" : "#b94a4f", animation: "slideIn 0.2s ease" }}>
//                     {toast.ok ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
//                     {toast.msg}
//                 </div>
//             )}

//             {/* Header */}
//             <div className="flex items-center justify-between">
//                 <div>
//                     <h1 className="text-[18px] font-bold text-[#1c3a3a]">Patients</h1>
//                     <p className="text-[12px] text-[#7a9088]">{total} total leads in the system</p>
//                 </div>
//                 <Link href="/admin/appointments"
//                     className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold text-white border-none cursor-pointer"
//                     style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" }}>
//                     <Plus size={13} /> New Appointment
//                 </Link>
//             </div>

//             {/* Filters */}
//             <div className="bg-white rounded-2xl border border-[#ddeae2] px-4 py-3 flex flex-wrap gap-2 items-center shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
//                 <div className="relative flex-[1_1_180px] min-w-[150px]">
//                     <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a9088]" />
//                     <input type="text" placeholder="Search name, email…" value={search} onChange={e => setSearch(e.target.value)}
//                         className="w-full py-2 pr-3 pl-8 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]"
//                         style={{ fontFamily: "inherit" }} />
//                 </div>
//                 <select value={statusFilter} onChange={e => setStatus(e.target.value)}
//                     className="py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] cursor-pointer outline-none text-[#1c3a3a]"
//                     style={{ fontFamily: "inherit", appearance: "none" }}>
//                     <option value="all">All statuses</option>
//                     {["new", "contacted", "booked", "inactive", "churned"].map(s => <option key={s} value={s}>{s}</option>)}
//                 </select>
//                 <select value={bandFilter} onChange={e => setBand(e.target.value)}
//                     className="py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] cursor-pointer outline-none text-[#1c3a3a]"
//                     style={{ fontFamily: "inherit", appearance: "none" }}>
//                     <option value="all">All severities</option>
//                     {["Low", "Mild", "Moderate", "High"].map(b => <option key={b} value={b}>{b}</option>)}
//                 </select>
//                 <button onClick={() => fetchLeads()} className="ml-auto flex items-center gap-1 px-3 py-2 rounded-xl border border-[#ddeae2] bg-white text-[11px] text-[#7a9088] cursor-pointer hover:bg-[#f7faf8]">
//                     <RefreshCw size={11} className={loading ? "animate-spin" : ""} /> Refresh
//                 </button>
//                 <span className="text-[11px] text-[#7a9088]">{leads.length} results</span>
//             </div>

//             {/* Lead list */}
//             <div className="flex flex-col gap-2">
//                 {loading && (
//                     <div className="text-center py-16 text-[#7a9088] text-sm">
//                         <div className="w-6 h-6 rounded-full border-2 border-[#4e8c6a] border-t-transparent animate-spin mx-auto mb-2" />
//                         Loading patients…
//                     </div>
//                 )}
//                 {!loading && leads.length === 0 && (
//                     <div className="text-center py-16 bg-white rounded-2xl border border-[#ddeae2]">
//                         <Users size={28} className="text-[#ddeae2] mb-2 mx-auto" />
//                         <p className="text-[#7a9088] text-sm">No patients found</p>
//                     </div>
//                 )}

//                 {!loading && leads.map(lead => {
//                     const sc = STATUS_CFG[lead.status] ?? STATUS_CFG.new;
//                     const bc = BAND_COLORS[lead.band] ?? "#7ba98b";
//                     const isExp = expandedId === lead.id;
//                     const seqDone = [lead.seq1SentAt, lead.seq2SentAt, lead.seq3SentAt].filter(Boolean).length;

//                     return (
//                         <div key={lead.id} className="bg-white rounded-2xl border border-[#ddeae2] shadow-[0_1px_6px_rgba(28,58,58,0.04)] overflow-hidden">
//                             {/* Row */}
//                             <div className="lead-row grid gap-3 px-4 py-3 cursor-pointer transition-colors"
//                                 style={{ gridTemplateColumns: "1fr auto" }}
//                                 onClick={() => setExpanded(isExp ? null : lead.id)}>
//                                 <div className="flex items-center gap-3 min-w-0">
//                                     <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-sm font-bold"
//                                         style={{ background: `${bc}20`, color: bc }}>
//                                         {lead.name.charAt(0).toUpperCase()}
//                                     </div>
//                                     <div className="min-w-0 flex-1">
//                                         <div className="flex items-center gap-2 flex-wrap">
//                                             <span className="text-[13px] font-semibold text-[#1c3a3a] truncate">{lead.name}</span>
//                                             {lead.therapist && <span className="text-[10px] font-medium px-1.5 py-[1px] rounded-full bg-[#edf7f1] text-[#4e7a5e]">{lead.therapist}</span>}
//                                             {(lead.tags ?? []).map(tag => (
//                                                 <span key={tag} className="text-[9px] font-bold px-1.5 py-[1px] rounded-full bg-[#f0edf7] text-[#7b6fa9]">{tag}</span>
//                                             ))}
//                                         </div>
//                                         <div className="flex items-center gap-2 mt-0.5 flex-wrap">
//                                             <span className="text-[11px] text-[#7a9088] flex items-center gap-0.5"><Mail size={9} /> {lead.email}</span>
//                                             {lead.phone && <span className="text-[11px] text-[#7a9088] flex items-center gap-0.5"><Phone size={9} /> {lead.phone}</span>}
//                                         </div>
//                                     </div>
//                                     <div className="hidden sm:flex gap-1.5 flex-wrap ml-1 shrink-0">
//                                         <span className="text-[10px] font-semibold px-2 py-[2px] rounded-full" style={{ background: `${bc}18`, color: bc }}>{lead.band}</span>
//                                         <span className="text-[10px] font-semibold px-2 py-[2px] rounded-full flex items-center gap-1" style={{ background: sc.bg, color: sc.text }}>
//                                             <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: sc.dot }} />{lead.status}
//                                         </span>
//                                         {seqDone > 0 && <span className="text-[10px] px-2 py-[2px] rounded-full bg-[#f0edf7] text-[#7b6fa9] font-semibold">{seqDone}/3 emails</span>}
//                                     </div>
//                                 </div>
//                                 <div className="flex items-center gap-2 shrink-0">
//                                     <div className="hidden sm:flex flex-col items-end gap-0.5">
//                                         <span className="text-[10px] text-[#7a9088]">{daysSince(lead.createdAt)}d ago</span>
//                                     </div>
//                                     <ScoreRing score={lead.score} color={bc} />
//                                     {isExp ? <ChevronUp size={14} className="text-[#7a9088]" /> : <ChevronDown size={14} className="text-[#7a9088]" />}
//                                 </div>
//                             </div>

//                             {/* Expanded */}
//                             {isExp && (
//                                 <div className="border-t border-[#f0f4f2] px-4 pt-4 pb-4">
//                                     <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
//                                         {/* Details */}
//                                         <div>
//                                             <p className="text-[10px] font-bold text-[#4e7a5e] uppercase tracking-[0.1em] mb-2">Details</p>
//                                             <div className="grid grid-cols-2 gap-1.5 mb-3">
//                                                 {[
//                                                     { l: "Phone", v: lead.phone || "—" },
//                                                     { l: "Source", v: lead.source || "—" },
//                                                     { l: "Joined", v: new Date(lead.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" }) },
//                                                     { l: "Severity", v: lead.severity },
//                                                 ].map(({ l, v }) => (
//                                                     <div key={l} className="px-2.5 py-2 bg-[#f7faf8] rounded-lg border border-[#e8f0ec]">
//                                                         <div className="text-[9px] font-bold uppercase tracking-wide text-[#4e7a5e]">{l}</div>
//                                                         <div className="text-[12px] text-[#1c3a3a] font-semibold mt-0.5 capitalize">{v}</div>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                             {/* Symptom breakdown */}
//                                             <p className="text-[10px] font-bold text-[#4e7a5e] uppercase tracking-[0.1em] mb-1.5">Symptom Scores</p>
//                                             <div className="flex flex-col gap-[4px]">
//                                                 {Object.entries(lead.answers).map(([k, v]) => (
//                                                     <div key={k} className="grid items-center gap-2" style={{ gridTemplateColumns: "80px 1fr" }}>
//                                                         <span className="text-[10px] text-[#7a9088]">{Q_LABELS[k] ?? k}</span>
//                                                         <MiniBar value={v} color={bc} />
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                             {lead.notes && (
//                                                 <div className="mt-3 px-3 py-2 bg-[#f7faf8] rounded-lg border border-[#e8f0ec] text-[11px] italic text-[#7a9088]">
//                                                     {lead.notes}
//                                                 </div>
//                                             )}
//                                         </div>

//                                         {/* Actions */}
//                                         <div>
//                                             {/* Status */}
//                                             <p className="text-[10px] font-bold text-[#4e7a5e] uppercase tracking-[0.1em] mb-2">Status</p>
//                                             <div className="flex flex-wrap gap-1.5 mb-4">
//                                                 {["new", "contacted", "booked", "inactive"].map(s => (
//                                                     <button key={s} onClick={() => updateStatus(lead.id, s)}
//                                                         className="px-3 py-[5px] rounded-full text-[11px] font-semibold cursor-pointer transition-all"
//                                                         style={{
//                                                             border: lead.status === s ? `2px solid ${STATUS_CFG[s].dot}` : "1.5px solid #ddeae2",
//                                                             background: lead.status === s ? STATUS_CFG[s].bg : "white",
//                                                             color: lead.status === s ? STATUS_CFG[s].text : "#7a9088",
//                                                         }}>
//                                                         {s}
//                                                     </button>
//                                                 ))}
//                                             </div>

//                                             {/* Therapist assignment */}
//                                             <p className="text-[10px] font-bold text-[#4e7a5e] uppercase tracking-[0.1em] mb-2">Assign Therapist</p>
//                                             <select value={lead.therapist ?? ""} onChange={e => updateTherapist(lead.id, e.target.value)}
//                                                 className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] cursor-pointer outline-none text-[#1c3a3a] mb-4"
//                                                 style={{ fontFamily: "inherit", appearance: "none" }}>
//                                                 <option value="">— Unassigned —</option>
//                                                 {THERAPISTS.map(t => <option key={t} value={t}>{t}</option>)}
//                                             </select>

//                                             {/* Sequence */}
//                                             <p className="text-[10px] font-bold text-[#4e7a5e] uppercase tracking-[0.1em] mb-2">Email Sequence</p>
//                                             <div className="flex flex-col gap-1.5 mb-4">
//                                                 {[
//                                                     { key: "seq1", label: "Email 1 — Value nudge", sent: lead.seq1SentAt },
//                                                     { key: "seq2", label: "Email 2 — Check-in", sent: lead.seq2SentAt },
//                                                     { key: "seq3", label: "Email 3 — Booking push", sent: lead.seq3SentAt },
//                                                 ].map(({ key, label, sent }) => (
//                                                     <div key={key} className="flex items-center justify-between gap-2">
//                                                         <div className="flex-1">
//                                                             <div className="text-[11px] text-[#1c3a3a]">{label}</div>
//                                                             {sent && <div className="text-[10px] text-[#4e7a5e]">Sent {new Date(sent).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</div>}
//                                                         </div>
//                                                         <button disabled={!!sent || sending === key}
//                                                             onClick={() => sendMsg(lead.id, key)}
//                                                             className="px-3 py-[4px] rounded-full text-[11px] font-semibold border-none cursor-pointer flex items-center gap-1 transition-all"
//                                                             style={{ background: sent ? "#edf7f1" : "linear-gradient(135deg,#4e7a5e,#3d8b8b)", color: sent ? "#4e7a5e" : "white", opacity: sent ? 1 : undefined, cursor: sent ? "not-allowed" : "pointer" }}>
//                                                             {sent ? <><CheckCircle size={10} /> Sent</> : sending === key ? "Sending…" : <><Send size={10} /> Send</>}
//                                                         </button>
//                                                     </div>
//                                                 ))}
//                                             </div>

//                                             {/* Quick actions */}
//                                             <div className="flex flex-wrap gap-1.5">
//                                                 <button onClick={() => openBook(lead)}
//                                                     className="flex items-center gap-1 px-3 py-[6px] rounded-xl text-[11px] font-semibold text-white border-none cursor-pointer"
//                                                     style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" }}>
//                                                     <Calendar size={11} /> Book Appointment
//                                                 </button>
//                                                 <button onClick={() => openNotes(lead)}
//                                                     className="flex items-center gap-1 px-3 py-[6px] rounded-xl text-[11px] font-medium cursor-pointer border border-[#ddeae2] bg-white text-[#7a9088] hover:bg-[#f7faf8]">
//                                                     <Edit3 size={11} /> Notes
//                                                 </button>
//                                                 <button onClick={() => openMessage(lead)}
//                                                     className="flex items-center gap-1 px-3 py-[6px] rounded-xl text-[11px] font-medium cursor-pointer border border-[#ddeae2] bg-white text-[#7a9088] hover:bg-[#f7faf8]">
//                                                     <MessageSquare size={11} /> Custom msg
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     );
//                 })}
//             </div>

//             {/* ── MODAL: Book Appointment ── */}
//             {modal === "book" && selected && (
//                 <div className="modal-bg fixed inset-0 bg-[rgba(28,58,58,0.45)] z-[200] flex items-center justify-center p-4" onClick={() => setModal(null)}>
//                     <div className="modal-card bg-white rounded-2xl w-full max-w-[480px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden" onClick={e => e.stopPropagation()}>
//                         <div className="px-5 py-4 border-b border-[#ddeae2] flex items-center justify-between">
//                             <div>
//                                 <div className="text-[15px] font-semibold text-[#1c3a3a]">Book Appointment</div>
//                                 <div className="text-[11px] text-[#7a9088]">{selected.name}</div>
//                             </div>
//                             <button onClick={() => setModal(null)} className="bg-transparent border-none cursor-pointer text-[#7a9088]"><X size={18} /></button>
//                         </div>
//                         <div className="p-5 flex flex-col gap-3">
//                             <div className="grid grid-cols-2 gap-3">
//                                 <div>
//                                     <label className="block text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-1.5">Date</label>
//                                     <input type="date" value={bookDate} onChange={e => setBookDate(e.target.value)} min={new Date().toISOString().split("T")[0]}
//                                         className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
//                                 </div>
//                                 <div>
//                                     <label className="block text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-1.5">Time</label>
//                                     <input type="time" value={bookTime} onChange={e => setBookTime(e.target.value)}
//                                         className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
//                                 </div>
//                             </div>
//                             <div>
//                                 <label className="block text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-1.5">Therapist</label>
//                                 <select value={bookTherapist} onChange={e => setBookTherapist(e.target.value)}
//                                     className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit", appearance: "none" }}>
//                                     {THERAPISTS.map(t => <option key={t} value={t}>{t}</option>)}
//                                 </select>
//                             </div>
//                             <div className="grid grid-cols-2 gap-3">
//                                 <div>
//                                     <label className="block text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-1.5">Type</label>
//                                     <select value={bookType} onChange={e => setBookType(e.target.value)}
//                                         className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit", appearance: "none" }}>
//                                         {sessionTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
//                                     </select>
//                                 </div>
//                                 <div>
//                                     <label className="block text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-1.5">Duration (min)</label>
//                                     <select value={bookDuration} onChange={e => setBookDuration(e.target.value)}
//                                         className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit", appearance: "none" }}>
//                                         {sessionTypes.map(d => <option key={d.id} value={d.id}>{d.durationMin} min</option>)}
//                                     </select>
//                                 </div>
//                             </div>
//                             <div>
//                                 <label className="block text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-1.5">Notes (optional)</label>
//                                 <textarea value={bookNotes} onChange={e => setBookNotes(e.target.value)} rows={2} placeholder="Any notes for the therapist…"
//                                     className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7fal8] outline-none text-[#1c3a3a] resize-none leading-relaxed" style={{ fontFamily: "inherit" }} />
//                             </div>
//                             <div className="flex gap-2 justify-end mt-1">
//                                 <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-[#ddeae2] bg-white text-[#7a9088] text-[12px] font-medium cursor-pointer">Cancel</button>
//                                 <button onClick={bookAppointment} disabled={!bookDate || booking}
//                                     className="px-5 py-2 rounded-xl border-none text-white text-[12px] font-semibold cursor-pointer flex items-center gap-1.5"
//                                     style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)", opacity: !bookDate ? 0.5 : 1 }}>
//                                     <Calendar size={13} /> {booking ? "Booking…" : "Book"}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* ── MODAL: Notes ── */}
//             {modal === "notes" && selected && (
//                 <div className="modal-bg fixed inset-0 bg-[rgba(28,58,58,0.45)] z-[200] flex items-center justify-center p-4" onClick={() => setModal(null)}>
//                     <div className="modal-card bg-white rounded-2xl w-full max-w-[440px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden" onClick={e => e.stopPropagation()}>
//                         <div className="px-5 py-4 border-b border-[#ddeae2] flex items-center justify-between">
//                             <div className="text-[15px] font-semibold text-[#1c3a3a]">Notes — {selected.name}</div>
//                             <button onClick={() => setModal(null)} className="bg-transparent border-none cursor-pointer text-[#7a9088]"><X size={18} /></button>
//                         </div>
//                         <div className="p-5">
//                             <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={6} placeholder="Add clinical notes, follow-up reminders…"
//                                 className="w-full px-3 py-2.5 border border-[#ddeae2] rounded-xl text-[12px] text-[#1c3a3a] resize-y outline-none bg-[#f7faf8] leading-relaxed" style={{ fontFamily: "inherit" }} />
//                             <div className="flex gap-2 justify-end mt-3">
//                                 <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-[#ddeae2] bg-white text-[#7a9088] text-[12px] cursor-pointer">Cancel</button>
//                                 <button onClick={saveNotes} disabled={saving}
//                                     className="px-5 py-2 rounded-xl border-none text-white text-[12px] font-semibold cursor-pointer"
//                                     style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" }}>
//                                     {saving ? "Saving…" : "Save notes"}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* ── MODAL: Custom message ── */}
//             {modal === "message" && selected && (
//                 <div className="modal-bg fixed inset-0 bg-[rgba(28,58,58,0.45)] z-[200] flex items-center justify-center p-4" onClick={() => setModal(null)}>
//                     <div className="modal-card bg-white rounded-2xl w-full max-w-[480px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden" onClick={e => e.stopPropagation()}>
//                         <div className="px-5 py-4 border-b border-[#ddeae2] flex items-center justify-between">
//                             <div className="text-[15px] font-semibold text-[#1c3a3a]">Message — {selected.name}</div>
//                             <button onClick={() => setModal(null)} className="bg-transparent border-none cursor-pointer text-[#7a9088]"><X size={18} /></button>
//                         </div>
//                         <div className="p-5 flex flex-col gap-3">
//                             <div>
//                                 <label className="block text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-1.5">Subject</label>
//                                 <input type="text" value={msgSubject} onChange={e => setMsgSubject(e.target.value)} placeholder="Email subject…"
//                                     className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
//                             </div>
//                             <div>
//                                 <label className="block text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-1.5">Message</label>
//                                 <textarea value={msgBody} onChange={e => setMsgBody(e.target.value)} rows={6} placeholder={`Write to ${selected.name}…`}
//                                     className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a] resize-y leading-relaxed" style={{ fontFamily: "inherit" }} />
//                             </div>
//                             <div className="flex gap-2 justify-end">
//                                 <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-[#ddeae2] bg-white text-[#7a9088] text-[12px] cursor-pointer">Cancel</button>
//                                 <button onClick={() => sendMsg(selected.id, "custom")} disabled={!msgSubject.trim() || !msgBody.trim() || sending === "custom"}
//                                     className="px-5 py-2 rounded-xl border-none text-white text-[12px] font-semibold cursor-pointer flex items-center gap-1.5"
//                                     style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)", opacity: !msgSubject.trim() || !msgBody.trim() ? 0.5 : 1 }}>
//                                     <Send size={12} /> {sending === "custom" ? "Sending…" : "Send"}
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

// app/admin/patients/page.tsx
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
    Search, Users, Eye, Edit3, MessageSquare, Calendar,
    Send, CheckCircle, AlertCircle, X, ChevronDown, ChevronUp,
    RefreshCw, Plus, Mail, Phone, ChevronLeft, ChevronRight as ChevronRightIcon,
} from "lucide-react";

interface Message { id: string; createdAt: string; subject: string; type: string; }
interface Lead {
    id: string; createdAt: string; updatedAt: string;
    name: string; email: string; phone: string | null;
    score: number; band: string; severity: string; answers: Record<string, number>;
    status: string; notes: string | null; source: string | null; therapist: string | null; tags: string[];
    seq1SentAt: string | null; seq2SentAt: string | null; seq3SentAt: string | null;
    messages: Message[];
    _count?: { appointments: number; sessions: number; payments: number };
}

const STATUS_CFG: Record<string, { bg: string; text: string; dot: string }> = {
    new: { bg: "#edf7f1", text: "#3a7a58", dot: "#7ba98b" },
    contacted: { bg: "#e8f4f8", text: "#2a5a7a", dot: "#6fb8b8" },
    booked: { bg: "#f0edf7", text: "#5a3a7a", dot: "#a88bcf" },
    inactive: { bg: "#f5f5f5", text: "#7a7a7a", dot: "#b0b0b0" },
    churned: { bg: "#fff0f0", text: "#7a3a3a", dot: "#cf8b8b" },
};
const BAND_COLORS: Record<string, string> = {
    Low: "#4e8c6a", Mild: "#3d8b8b", Moderate: "#8b6e3d", High: "#b94a4f",
};
const Q_LABELS: Record<string, string> = {
    q1: "Mood", q2: "Anxiety", q3: "Energy", q4: "Sleep",
    q5: "Relationships", q6: "Stress", q7: "Self-worth", q8: "Support",
};

const PAGE_SIZE = 20;
const daysSince = (iso: string) => Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);

function ScoreRing({ score, color, size = 44 }: { score: number; color: string; size?: number }) {
    const max = 24, r = (size - 8) / 2, circ = 2 * Math.PI * r, dash = circ * (score / max);
    return (
        <div className="relative shrink-0" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e8eeea" strokeWidth={4} />
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={4}
                    strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-bold text-[#1c3a3a]">{score}</span>
            </div>
        </div>
    );
}

function MiniBar({ value, max = 3, color }: { value: number; max?: number; color: string }) {
    return (
        <div className="flex items-center gap-1.5">
            <div className="flex-1 h-[3px] bg-[#e8eeea] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(value / max) * 100}%`, background: color }} />
            </div>
            <span className="text-[9px] text-[#7a9088] w-5">{value}/{max}</span>
        </div>
    );
}

export default function PatientsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatus] = useState("all");
    const [bandFilter, setBand] = useState("all");
    const [expandedId, setExpanded] = useState<string | null>(null);
    const [modal, setModal] = useState<"notes" | "message" | "book" | null>(null);
    const [selected, setSelected] = useState<Lead | null>(null);
    const [notes, setNotes] = useState("");
    const [saving, setSaving] = useState(false);
    const [sending, setSending] = useState<string | null>(null);
    const [booking, setBooking] = useState(false);
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

    // Book form
    const [bookDate, setBookDate] = useState("");
    const [bookTime, setBookTime] = useState("09:00");
    const [bookTherapist, setBookTherapist] = useState("");
    const [bookType, setBookType] = useState("initial");
    const [bookDuration, setBookDuration] = useState("50");
    const [bookNotes, setBookNotes] = useState("");
    const [sendBookingEmail, setSendBookingEmail] = useState(true);

    // Custom message
    const [msgSubject, setMsgSubject] = useState("");
    const [msgBody, setMsgBody] = useState("");

    // Settings
    const [therapists, setTherapists] = useState<{ id: string; name: string }[]>([]);
    const [sessionTypes, setSessionTypes] = useState<{ id: string; name: string; durationMin: number }[]>([]);

    const showToast = (msg: string, ok = true) => {
        setToast({ msg, ok }); setTimeout(() => setToast(null), 3500);
    };

    // Fetch settings
    useEffect(() => {
        fetch("/api/admin/settings").then(r => r.json()).then(data => {
            if (data.success) {
                setTherapists(data.therapists ?? []);
                setSessionTypes(data.sessionTypes ?? []);
                if (data.therapists?.length) setBookTherapist(data.therapists[0].name);
                if (data.sessionTypes?.length) setBookType(data.sessionTypes[0].name);
            }
        }).catch(() => { });
    }, []);

    const fetchLeads = useCallback(async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (statusFilter !== "all") params.set("status", statusFilter);
        if (bandFilter !== "all") params.set("band", bandFilter);
        params.set("limit", String(PAGE_SIZE));
        params.set("page", String(page));
        try {
            const res = await fetch(`/api/admin/leads?${params.toString()}`);
            const data = await res.json();
            if (data.success) { setLeads(data.leads); setTotal(data.total ?? data.leads.length); }
        } finally { setLoading(false); }
    }, [search, statusFilter, bandFilter, page]);

    useEffect(() => {
        setPage(1);
    }, [search, statusFilter, bandFilter]);

    useEffect(() => {
        const t = setTimeout(fetchLeads, 300);
        return () => clearTimeout(t);
    }, [fetchLeads]);

    const totalPages = Math.ceil(total / PAGE_SIZE);

    const updateStatus = async (id: string, status: string) => {
        await fetch("/api/admin/leads", {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status }),
        });
        setLeads(p => p.map(l => l.id === id ? { ...l, status } : l));
        showToast("Status updated");
    };

    const updateTherapist = async (id: string, therapist: string) => {
        await fetch("/api/admin/leads", {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, therapist }),
        });
        setLeads(p => p.map(l => l.id === id ? { ...l, therapist } : l));
        showToast("Therapist assigned");
    };

    const saveNotes = async () => {
        if (!selected) return;
        setSaving(true);
        await fetch("/api/admin/leads", {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: selected.id, notes }),
        });
        setLeads(p => p.map(l => l.id === selected.id ? { ...l, notes } : l));
        setSaving(false); showToast("Notes saved"); setModal(null);
    };

    const sendMsg = async (leadId: string, type: string) => {
        setSending(type);
        try {
            const res = await fetch("/api/admin/message", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    leadId, type,
                    ...(type === "custom" ? { customSubject: msgSubject, customBody: msgBody } : {}),
                }),
            });
            const data = await res.json() as { success: boolean };
            if (data.success) { showToast("Sent!"); setModal(null); setMsgSubject(""); setMsgBody(""); fetchLeads(); }
            else showToast("Failed to send", false);
        } catch { showToast("Failed to send", false); }
        finally { setSending(null); }
    };

    const bookAppointment = async () => {
        if (!selected || !bookDate) return;
        setBooking(true);
        try {
            const res = await fetch("/api/admin/appointments", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    leadId: selected.id,
                    scheduledAt: `${bookDate}T${bookTime}:00`,
                    therapist: bookTherapist,
                    type: bookType,
                    durationMin: parseInt(bookDuration),
                    notes: bookNotes || undefined,
                    sendEmail: sendBookingEmail,
                }),
            });
            const data = await res.json();
            if (data.success) {
                showToast("Appointment booked!" + (sendBookingEmail ? " Email sent." : ""));
                setModal(null); setBookDate(""); setBookNotes("");
                setLeads(p => p.map(l => l.id === selected.id ? { ...l, status: "booked", therapist: bookTherapist } : l));
            } else showToast("Failed to book", false);
        } finally { setBooking(false); }
    };

    return (
        <div className="flex flex-col gap-4">
            <style>{`
        @keyframes slideIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .modal-bg { animation: fadeIn 0.18s ease; }
        .modal-card { animation: slideUp 0.22s ease; }
        .lead-row:hover { background: #f7faf8 !important; }
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
                    <h1 className="text-[18px] font-bold text-[#1c3a3a]">Patients</h1>
                    <p className="text-[12px] text-[#7a9088]">{total} total leads</p>
                </div>
                <Link href="/admin/appointments"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold text-white border-none cursor-pointer"
                    style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" }}>
                    <Plus size={13} /> New Appointment
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-[#ddeae2] px-4 py-3 flex flex-wrap gap-2 items-center shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
                <div className="relative flex-[1_1_180px] min-w-[150px]">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a9088]" />
                    <input type="text" placeholder="Search name, email…" value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full py-2 pr-3 pl-8 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]"
                        style={{ fontFamily: "inherit" }} />
                </div>
                <select value={statusFilter} onChange={e => setStatus(e.target.value)}
                    className="py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] cursor-pointer outline-none text-[#1c3a3a]"
                    style={{ fontFamily: "inherit", appearance: "none" }}>
                    <option value="all">All statuses</option>
                    {["new", "contacted", "booked", "inactive", "churned"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={bandFilter} onChange={e => setBand(e.target.value)}
                    className="py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] cursor-pointer outline-none text-[#1c3a3a]"
                    style={{ fontFamily: "inherit", appearance: "none" }}>
                    <option value="all">All severities</option>
                    {["Low", "Mild", "Moderate", "High"].map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                <button onClick={() => fetchLeads()} className="ml-auto flex items-center gap-1 px-3 py-2 rounded-xl border border-[#ddeae2] bg-white text-[11px] text-[#7a9088] cursor-pointer hover:bg-[#f7faf8]">
                    <RefreshCw size={11} className={loading ? "animate-spin" : ""} /> Refresh
                </button>
                <span className="text-[11px] text-[#7a9088]">{leads.length} shown</span>
            </div>

            {/* Lead list */}
            <div className="flex flex-col gap-2">
                {loading && (
                    <div className="text-center py-16 text-[#7a9088] text-sm">
                        <div className="w-6 h-6 rounded-full border-2 border-[#4e8c6a] border-t-transparent animate-spin mx-auto mb-2" />
                        Loading patients…
                    </div>
                )}
                {!loading && leads.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl border border-[#ddeae2]">
                        <Users size={28} className="text-[#ddeae2] mb-2 mx-auto" />
                        <p className="text-[#7a9088] text-sm">No patients found</p>
                    </div>
                )}

                {!loading && leads.map(lead => {
                    const sc = STATUS_CFG[lead.status] ?? STATUS_CFG.new;
                    const bc = BAND_COLORS[lead.band] ?? "#7ba98b";
                    const isExp = expandedId === lead.id;
                    const seqDone = [lead.seq1SentAt, lead.seq2SentAt, lead.seq3SentAt].filter(Boolean).length;

                    return (
                        <div key={lead.id} className="bg-white rounded-2xl border border-[#ddeae2] shadow-[0_1px_6px_rgba(28,58,58,0.04)] overflow-hidden">
                            <div className="lead-row grid gap-3 px-4 py-3 cursor-pointer transition-colors"
                                style={{ gridTemplateColumns: "1fr auto" }}
                                onClick={() => setExpanded(isExp ? null : lead.id)}>
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-sm font-bold"
                                        style={{ background: `${bc}20`, color: bc }}>
                                        {lead.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-[13px] font-semibold text-[#1c3a3a] truncate">{lead.name}</span>
                                            {lead.therapist && <span className="text-[10px] font-medium px-1.5 py-[1px] rounded-full bg-[#edf7f1] text-[#4e7a5e]">{lead.therapist}</span>}
                                            {(lead.tags ?? []).map(tag => (
                                                <span key={tag} className="text-[9px] font-bold px-1.5 py-[1px] rounded-full bg-[#f0edf7] text-[#7b6fa9]">{tag}</span>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                            <span className="text-[11px] text-[#7a9088] flex items-center gap-0.5"><Mail size={9} /> {lead.email}</span>
                                            {lead.phone && <span className="text-[11px] text-[#7a9088] flex items-center gap-0.5"><Phone size={9} /> {lead.phone}</span>}
                                        </div>
                                    </div>
                                    <div className="hidden sm:flex gap-1.5 flex-wrap ml-1 shrink-0">
                                        <span className="text-[10px] font-semibold px-2 py-[2px] rounded-full" style={{ background: `${bc}18`, color: bc }}>{lead.band}</span>
                                        <span className="text-[10px] font-semibold px-2 py-[2px] rounded-full flex items-center gap-1" style={{ background: sc.bg, color: sc.text }}>
                                            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: sc.dot }} />{lead.status}
                                        </span>
                                        {seqDone > 0 && <span className="text-[10px] px-2 py-[2px] rounded-full bg-[#f0edf7] text-[#7b6fa9] font-semibold">{seqDone}/3 emails</span>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <div className="hidden sm:flex flex-col items-end gap-0.5">
                                        <span className="text-[10px] text-[#7a9088]">{daysSince(lead.createdAt)}d ago</span>
                                    </div>
                                    <ScoreRing score={lead.score} color={bc} />
                                    {isExp ? <ChevronUp size={14} className="text-[#7a9088]" /> : <ChevronDown size={14} className="text-[#7a9088]" />}
                                </div>
                            </div>

                            {isExp && (
                                <div className="border-t border-[#f0f4f2] px-4 pt-4 pb-4">
                                    <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
                                        {/* Details */}
                                        <div>
                                            <p className="text-[10px] font-bold text-[#4e7a5e] uppercase tracking-[0.1em] mb-2">Details</p>
                                            <div className="grid grid-cols-2 gap-1.5 mb-3">
                                                {[
                                                    { l: "Phone", v: lead.phone || "—" },
                                                    { l: "Source", v: lead.source || "—" },
                                                    { l: "Joined", v: new Date(lead.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" }) },
                                                    { l: "Severity", v: lead.severity },
                                                ].map(({ l, v }) => (
                                                    <div key={l} className="px-2.5 py-2 bg-[#f7faf8] rounded-lg border border-[#e8f0ec]">
                                                        <div className="text-[9px] font-bold uppercase tracking-wide text-[#4e7a5e]">{l}</div>
                                                        <div className="text-[12px] text-[#1c3a3a] font-semibold mt-0.5 capitalize">{v}</div>
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-[10px] font-bold text-[#4e7a5e] uppercase tracking-[0.1em] mb-1.5">Symptom Scores</p>
                                            <div className="flex flex-col gap-[4px]">
                                                {Object.entries(lead.answers).map(([k, v]) => (
                                                    <div key={k} className="grid items-center gap-2" style={{ gridTemplateColumns: "80px 1fr" }}>
                                                        <span className="text-[10px] text-[#7a9088]">{Q_LABELS[k] ?? k}</span>
                                                        <MiniBar value={v} color={bc} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div>
                                            <p className="text-[10px] font-bold text-[#4e7a5e] uppercase tracking-[0.1em] mb-2">Status</p>
                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                {["new", "contacted", "booked", "inactive"].map(s => (
                                                    <button key={s} onClick={() => updateStatus(lead.id, s)}
                                                        className="px-3 py-[5px] rounded-full text-[11px] font-semibold cursor-pointer transition-all"
                                                        style={{
                                                            border: lead.status === s ? `2px solid ${STATUS_CFG[s].dot}` : "1.5px solid #ddeae2",
                                                            background: lead.status === s ? STATUS_CFG[s].bg : "white",
                                                            color: lead.status === s ? STATUS_CFG[s].text : "#7a9088",
                                                        }}>
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>

                                            <p className="text-[10px] font-bold text-[#4e7a5e] uppercase tracking-[0.1em] mb-2">Assign Therapist</p>
                                            <select value={lead.therapist ?? ""} onChange={e => updateTherapist(lead.id, e.target.value)}
                                                className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] cursor-pointer outline-none text-[#1c3a3a] mb-4"
                                                style={{ fontFamily: "inherit", appearance: "none" }}>
                                                <option value="">— Unassigned —</option>
                                                {therapists.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                                            </select>

                                            <p className="text-[10px] font-bold text-[#4e7a5e] uppercase tracking-[0.1em] mb-2">Email Sequence</p>
                                            <div className="flex flex-col gap-1.5 mb-4">
                                                {[
                                                    { key: "seq1", label: "Email 1 — Value nudge", sent: lead.seq1SentAt },
                                                    { key: "seq2", label: "Email 2 — Check-in", sent: lead.seq2SentAt },
                                                    { key: "seq3", label: "Email 3 — Booking push", sent: lead.seq3SentAt },
                                                ].map(({ key, label, sent }) => (
                                                    <div key={key} className="flex items-center justify-between gap-2">
                                                        <div className="flex-1">
                                                            <div className="text-[11px] text-[#1c3a3a]">{label}</div>
                                                            {sent && <div className="text-[10px] text-[#4e7a5e]">Sent {new Date(sent).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</div>}
                                                        </div>
                                                        <button disabled={!!sent || sending === key}
                                                            onClick={() => sendMsg(lead.id, key)}
                                                            className="px-3 py-[4px] rounded-full text-[11px] font-semibold border-none cursor-pointer flex items-center gap-1 transition-all"
                                                            style={{ background: sent ? "#edf7f1" : "linear-gradient(135deg,#4e7a5e,#3d8b8b)", color: sent ? "#4e7a5e" : "white", cursor: sent ? "not-allowed" : "pointer" }}>
                                                            {sent ? <><CheckCircle size={10} /> Sent</> : sending === key ? "Sending…" : <><Send size={10} /> Send</>}
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex flex-wrap gap-1.5">
                                                <button onClick={() => { setSelected(lead); setModal("book"); }}
                                                    className="flex items-center gap-1 px-3 py-[6px] rounded-xl text-[11px] font-semibold text-white border-none cursor-pointer"
                                                    style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" }}>
                                                    <Calendar size={11} /> Book Appointment
                                                </button>
                                                <button onClick={() => { setSelected(lead); setNotes(lead.notes ?? ""); setModal("notes"); }}
                                                    className="flex items-center gap-1 px-3 py-[6px] rounded-xl text-[11px] font-medium cursor-pointer border border-[#ddeae2] bg-white text-[#7a9088] hover:bg-[#f7faf8]">
                                                    <Edit3 size={11} /> Notes
                                                </button>
                                                <button onClick={() => { setSelected(lead); setModal("message"); }}
                                                    className="flex items-center gap-1 px-3 py-[6px] rounded-xl text-[11px] font-medium cursor-pointer border border-[#ddeae2] bg-white text-[#7a9088] hover:bg-[#f7faf8]">
                                                    <MessageSquare size={11} /> Message
                                                </button>
                                                <Link href={`/admin/patients/${lead.id}`}
                                                    className="flex items-center gap-1 px-3 py-[6px] rounded-xl text-[11px] font-medium cursor-pointer border border-[#ddeae2] bg-white text-[#7a9088] hover:bg-[#f7faf8]">
                                                    <Eye size={11} /> View Profile
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-1 py-2">
                    <span className="text-[12px] text-[#7a9088]">
                        Page {page} of {totalPages} · {total} total
                    </span>
                    <div className="flex items-center gap-1.5">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#ddeae2] bg-white text-[#7a9088] cursor-pointer disabled:opacity-40 hover:bg-[#f7faf8] transition-colors">
                            <ChevronLeft size={13} />
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                            return (
                                <button key={p} onClick={() => setPage(p)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-[12px] font-semibold cursor-pointer transition-colors"
                                    style={{
                                        background: page === p ? "linear-gradient(135deg,#4e7a5e,#3d8b8b)" : "white",
                                        color: page === p ? "white" : "#7a9088",
                                        border: page === p ? "none" : "1px solid #ddeae2",
                                    }}>
                                    {p}
                                </button>
                            );
                        })}
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#ddeae2] bg-white text-[#7a9088] cursor-pointer disabled:opacity-40 hover:bg-[#f7faf8] transition-colors">
                            <ChevronRightIcon size={13} />
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL: Book Appointment */}
            {modal === "book" && selected && (
                <div className="modal-bg fixed inset-0 bg-[rgba(28,58,58,0.45)] z-[200] flex items-center justify-center p-4" onClick={() => setModal(null)}>
                    <div className="modal-card bg-white rounded-2xl w-full max-w-[480px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="px-5 py-4 border-b border-[#ddeae2] flex items-center justify-between">
                            <div>
                                <div className="text-[15px] font-semibold text-[#1c3a3a]">Book Appointment</div>
                                <div className="text-[11px] text-[#7a9088]">{selected.name}</div>
                            </div>
                            <button onClick={() => setModal(null)} className="bg-transparent border-none cursor-pointer text-[#7a9088]"><X size={18} /></button>
                        </div>
                        <div className="p-5 flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-1.5">Date</label>
                                    <input type="date" value={bookDate} onChange={e => setBookDate(e.target.value)} min={new Date().toISOString().split("T")[0]}
                                        className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-1.5">Time</label>
                                    <input type="time" value={bookTime} onChange={e => setBookTime(e.target.value)}
                                        className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-1.5">Therapist</label>
                                <select value={bookTherapist} onChange={e => setBookTherapist(e.target.value)}
                                    className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit", appearance: "none" }}>
                                    <option value="">— Select therapist —</option>
                                    {therapists.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-1.5">Type</label>
                                    <select value={bookType} onChange={e => setBookType(e.target.value)}
                                        className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit", appearance: "none" }}>
                                        {sessionTypes.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-1.5">Duration (min)</label>
                                    <select value={bookDuration} onChange={e => setBookDuration(e.target.value)}
                                        className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit", appearance: "none" }}>
                                        {["30", "45", "50", "60", "90"].map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-1.5">Notes (optional)</label>
                                <textarea value={bookNotes} onChange={e => setBookNotes(e.target.value)} rows={2}
                                    className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a] resize-none" style={{ fontFamily: "inherit" }} />
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer px-3 py-2.5 bg-[#f7faf8] rounded-xl border border-[#e8f0ec]">
                                <input type="checkbox" checked={sendBookingEmail} onChange={e => setSendBookingEmail(e.target.checked)}
                                    className="w-4 h-4 rounded accent-[#4e7a5e]" />
                                <span className="text-[12px] text-[#1c3a3a]">Send confirmation email to client</span>
                            </label>
                            <div className="flex gap-2 justify-end mt-1">
                                <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-[#ddeae2] bg-white text-[#7a9088] text-[12px] cursor-pointer">Cancel</button>
                                <button onClick={bookAppointment} disabled={!bookDate || booking}
                                    className="px-5 py-2 rounded-xl border-none text-white text-[12px] font-semibold cursor-pointer flex items-center gap-1.5"
                                    style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)", opacity: !bookDate ? 0.5 : 1 }}>
                                    <Calendar size={13} /> {booking ? "Booking…" : "Book"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: Notes */}
            {modal === "notes" && selected && (
                <div className="modal-bg fixed inset-0 bg-[rgba(28,58,58,0.45)] z-[200] flex items-center justify-center p-4" onClick={() => setModal(null)}>
                    <div className="modal-card bg-white rounded-2xl w-full max-w-[440px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="px-5 py-4 border-b border-[#ddeae2] flex items-center justify-between">
                            <div className="text-[15px] font-semibold text-[#1c3a3a]">Notes — {selected.name}</div>
                            <button onClick={() => setModal(null)} className="bg-transparent border-none cursor-pointer text-[#7a9088]"><X size={18} /></button>
                        </div>
                        <div className="p-5">
                            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={6} placeholder="Add clinical notes, follow-up reminders…"
                                className="w-full px-3 py-2.5 border border-[#ddeae2] rounded-xl text-[12px] text-[#1c3a3a] resize-y outline-none bg-[#f7faf8] leading-relaxed" style={{ fontFamily: "inherit" }} />
                            <div className="flex gap-2 justify-end mt-3">
                                <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-[#ddeae2] bg-white text-[#7a9088] text-[12px] cursor-pointer">Cancel</button>
                                <button onClick={saveNotes} disabled={saving}
                                    className="px-5 py-2 rounded-xl border-none text-white text-[12px] font-semibold cursor-pointer"
                                    style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" }}>
                                    {saving ? "Saving…" : "Save notes"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: Custom message */}
            {modal === "message" && selected && (
                <div className="modal-bg fixed inset-0 bg-[rgba(28,58,58,0.45)] z-[200] flex items-center justify-center p-4" onClick={() => setModal(null)}>
                    <div className="modal-card bg-white rounded-2xl w-full max-w-[480px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="px-5 py-4 border-b border-[#ddeae2] flex items-center justify-between">
                            <div className="text-[15px] font-semibold text-[#1c3a3a]">Message — {selected.name}</div>
                            <button onClick={() => setModal(null)} className="bg-transparent border-none cursor-pointer text-[#7a9088]"><X size={18} /></button>
                        </div>
                        <div className="p-5 flex flex-col gap-3">
                            <div>
                                <label className="block text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-1.5">Subject</label>
                                <input type="text" value={msgSubject} onChange={e => setMsgSubject(e.target.value)} placeholder="Email subject…"
                                    className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-1.5">Message</label>
                                <textarea value={msgBody} onChange={e => setMsgBody(e.target.value)} rows={5} placeholder={`Write to ${selected.name}…`}
                                    className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a] resize-y leading-relaxed" style={{ fontFamily: "inherit" }} />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-[#ddeae2] bg-white text-[#7a9088] text-[12px] cursor-pointer">Cancel</button>
                                <button onClick={() => sendMsg(selected.id, "custom")} disabled={!msgSubject.trim() || !msgBody.trim() || sending === "custom"}
                                    className="px-5 py-2 rounded-xl border-none text-white text-[12px] font-semibold cursor-pointer flex items-center gap-1.5"
                                    style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)", opacity: !msgSubject.trim() || !msgBody.trim() ? 0.5 : 1 }}>
                                    <Send size={12} /> {sending === "custom" ? "Sending…" : "Send"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}