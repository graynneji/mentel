// "use client";

// // app/admin/appointments/page.tsx
// import { useState, useEffect, useCallback } from "react";
// import {
//     Calendar, Clock, CheckCircle, X, Plus, AlertCircle,
//     RefreshCw, Filter, ChevronDown, ChevronUp, DollarSign,
//     User, Edit3, Trash2, FileText,
// } from "lucide-react";
// import { Therapists } from "../settings/page";

// // ── Types ──────────────────────────────────────────────────────────────────────
// interface Appointment {
//     id: string; createdAt: string;
//     leadId: string;
//     lead: { id: string; name: string; email: string; phone: string | null; band: string };
//     scheduledAt: string; durationMin: number; therapist: string;
//     type: string; status: string; notes: string | null;
//     session: Session | null;
// }

// interface Session {
//     id: string; conductedAt: string; therapist: string; type: string;
//     durationMin: number; notes: string | null; mood: number | null; progress: string | null;
//     payment: Payment | null;
// }

// interface Payment {
//     id: string; amountKobo: number; status: string; method: string; paidAt: string | null;
// }

// const STATUS_CFG: Record<string, { bg: string; text: string; label: string }> = {
//     scheduled: { bg: "#e8f4f8", text: "#2a5a7a", label: "Scheduled" },
//     completed: { bg: "#edf7f1", text: "#3a7a58", label: "Completed" },
//     cancelled: { bg: "#f5f5f5", text: "#7a7a7a", label: "Cancelled" },
//     "no-show": { bg: "#fff0f0", text: "#7a3a3a", label: "No-Show" },
// };
// const BAND_COLORS: Record<string, string> = {
//     Low: "#4e8c6a", Mild: "#3d8b8b", Moderate: "#8b6e3d", High: "#b94a4f",
// };
// // const THERAPISTS = ["Dr. Adeola", "Dr. Chukwu", "Dr. Bello", "Dr. Okonkwo"];

// const fmtNaira = (kobo: number) => `₦${(kobo / 100).toLocaleString("en-NG")}`;
// const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
// const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

// // ── Main page ──────────────────────────────────────────────────────────────────
// export default function AppointmentsPage() {
//     const [appts, setAppts] = useState<Appointment[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [total, setTotal] = useState(0);
//     const [upcoming, setUpcoming] = useState(0);
//     const [statusFilter, setStatusFilter] = useState("all");
//     const [therapistFilter, setTherapistFilter] = useState("all");
//     const [expandedId, setExpanded] = useState<string | null>(null);
//     const [modal, setModal] = useState<"log" | "status" | null>(null);
//     const [selected, setSelected] = useState<Appointment | null>(null);
//     const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
//     const { therapists: THERAPISTS } = Therapists();

//     // Log session form
//     const [logDate, setLogDate] = useState("");
//     const [logTime, setLogTime] = useState("09:00");
//     const [logDuration, setLogDuration] = useState("50");
//     const [logMood, setLogMood] = useState("3");
//     const [logNotes, setLogNotes] = useState("");
//     const [logProgress, setLogProgress] = useState("");
//     const [logAmount, setLogAmount] = useState("");
//     const [logMethod, setLogMethod] = useState("transfer");
//     const [logPayStatus, setLogPayStatus] = useState("paid");
//     const [logRef, setLogRef] = useState("");
//     const [logging, setLogging] = useState(false);

//     const showToast = (msg: string, ok = true) => {
//         setToast({ msg, ok }); setTimeout(() => setToast(null), 3500);
//     };

//     const fetchAppts = useCallback(async () => {
//         setLoading(true);
//         const params = new URLSearchParams({ limit: "100" });
//         if (statusFilter !== "all") params.set("status", statusFilter);
//         if (therapistFilter !== "all") params.set("therapist", therapistFilter);
//         try {
//             const res = await fetch(`/api/admin/appointments?${params}`);
//             const data = await res.json();
//             if (data.success) {
//                 setAppts(data.appointments);
//                 setTotal(data.analytics.total);
//                 setUpcoming(data.analytics.upcoming);
//             }
//         } finally { setLoading(false); }
//     }, [statusFilter, therapistFilter]);

//     useEffect(() => { fetchAppts(); }, [fetchAppts]);

//     const updateStatus = async (id: string, status: string) => {
//         const res = await fetch("/api/admin/appointments", {
//             method: "PATCH", headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ id, status }),
//         });
//         const data = await res.json();
//         if (data.success) {
//             setAppts(p => p.map(a => a.id === id ? { ...a, status } : a));
//             showToast("Status updated");
//         }
//     };

//     const logSession = async () => {
//         if (!selected || !logDate || !logAmount) return;
//         setLogging(true);
//         try {
//             const amountKobo = Math.round(parseFloat(logAmount) * 100);
//             const res = await fetch("/api/admin/sessions", {
//                 method: "POST", headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     leadId: selected.leadId,
//                     appointmentId: selected.id,
//                     conductedAt: `${logDate}T${logTime}:00`,
//                     therapist: selected.therapist,
//                     type: selected.type,
//                     durationMin: parseInt(logDuration),
//                     mood: parseInt(logMood),
//                     notes: logNotes || undefined,
//                     progress: logProgress || undefined,
//                     amountKobo,
//                     paymentMethod: logMethod,
//                     paymentRef: logRef || undefined,
//                     paymentStatus: logPayStatus,
//                 }),
//             });
//             const data = await res.json();
//             if (data.success) {
//                 showToast("Session logged & payment recorded!");
//                 setModal(null);
//                 setLogDate(""); setLogNotes(""); setLogProgress(""); setLogAmount(""); setLogRef("");
//                 fetchAppts();
//             } else showToast("Failed to log session", false);
//         } finally { setLogging(false); }
//     };

//     const deleteAppt = async (id: string) => {
//         if (!confirm("Delete this appointment?")) return;
//         const res = await fetch(`/api/admin/appointments?id=${id}`, { method: "DELETE" });
//         const data = await res.json();
//         if (data.success) { setAppts(p => p.filter(a => a.id !== id)); showToast("Deleted"); }
//     };

//     // Group by date
//     const groups: Record<string, Appointment[]> = {};
//     appts.forEach(a => {
//         const key = new Date(a.scheduledAt).toDateString();
//         groups[key] = [...(groups[key] ?? []), a];
//     });

//     return (
//         <div className="flex flex-col gap-4 max-w-full">
//             <style>{`
//         @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
//         @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
//         @keyframes slideIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
//         .modal-bg { animation: fadeIn 0.18s ease; }
//         .modal-card { animation: slideUp 0.22s ease; }
//       `}</style>

//             {toast && (
//                 <div className="fixed top-5 right-5 z-[9999] flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-[13px] font-medium shadow-lg"
//                     style={{ background: toast.ok ? "#1c3a3a" : "#b94a4f", animation: "slideIn 0.2s ease" }}>
//                     {toast.ok ? <CheckCircle size={14} /> : <AlertCircle size={14} />} {toast.msg}
//                 </div>
//             )}

//             {/* Header */}
//             <div className="flex items-center justify-between">
//                 <div>
//                     <h1 className="text-[18px] font-bold text-[#1c3a3a]">Appointments</h1>
//                     <p className="text-[12px] text-[#7a9088]">{upcoming} upcoming · {total} total</p>
//                 </div>
//                 <button onClick={fetchAppts} className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#ddeae2] rounded-xl text-[12px] text-[#7a9088] cursor-pointer hover:bg-[#f7faf8]">
//                     <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
//                 </button>
//             </div>

//             {/* Filters */}
//             <div className="bg-white rounded-2xl border border-[#ddeae2] px-4 py-3 flex flex-wrap gap-2 items-center shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
//                 <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
//                     className="py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a] cursor-pointer" style={{ fontFamily: "inherit", appearance: "none" }}>
//                     <option value="all">All statuses</option>
//                     <option value="scheduled">Scheduled</option>
//                     <option value="completed">Completed</option>
//                     <option value="cancelled">Cancelled</option>
//                     <option value="no-show">No-Show</option>
//                 </select>
//                 <select value={therapistFilter} onChange={e => setTherapistFilter(e.target.value)}
//                     className="py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a] cursor-pointer" style={{ fontFamily: "inherit", appearance: "none" }}>
//                     <option value="all">All therapists</option>
//                     {THERAPISTS?.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
//                 </select>
//                 <span className="ml-auto text-[11px] text-[#7a9088]">{appts.length} appointments</span>
//             </div>

//             {/* Appointment list grouped by date */}
//             {loading ? (
//                 <div className="text-center py-16 text-[#7a9088] text-sm">
//                     <div className="w-6 h-6 rounded-full border-2 border-[#4e8c6a] border-t-transparent animate-spin mx-auto mb-2" />
//                     Loading…
//                 </div>
//             ) : appts.length === 0 ? (
//                 <div className="text-center py-16 bg-white rounded-2xl border border-[#ddeae2]">
//                     <Calendar size={28} className="text-[#ddeae2] mb-2 mx-auto" />
//                     <p className="text-[#7a9088] text-sm">No appointments found</p>
//                 </div>
//             ) : (
//                 Object.entries(groups).map(([dateKey, dayAppts]) => (
//                     <div key={dateKey}>
//                         <div className="text-[11px] font-bold text-[#7a9088] uppercase tracking-[0.08em] mb-2 px-1">
//                             {new Date(dateKey).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
//                         </div>
//                         <div className="flex flex-col gap-2">
//                             {dayAppts.map(appt => {
//                                 const sc = STATUS_CFG[appt.status] ?? STATUS_CFG.scheduled;
//                                 const bc = BAND_COLORS[appt.lead.band] ?? "#7ba98b";
//                                 const isExp = expandedId === appt.id;
//                                 const isPast = new Date(appt.scheduledAt) < new Date();

//                                 return (
//                                     <div key={appt.id} className="bg-white rounded-2xl border border-[#ddeae2] shadow-[0_1px_6px_rgba(28,58,58,0.04)] overflow-hidden">
//                                         <div className="grid gap-3 px-4 py-3 cursor-pointer hover:bg-[#f7faf8] transition-colors"
//                                             style={{ gridTemplateColumns: "1fr auto" }}
//                                             onClick={() => setExpanded(isExp ? null : appt.id)}>
//                                             <div className="flex items-center gap-3">
//                                                 {/* Time block */}
//                                                 <div className="shrink-0 w-14 text-center">
//                                                     <div className="text-[13px] font-bold text-[#1c3a3a]">{fmtTime(appt.scheduledAt)}</div>
//                                                     <div className="text-[9px] text-[#7a9088]">{appt.durationMin}min</div>
//                                                 </div>
//                                                 {/* Patient */}
//                                                 <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ background: `${bc}20`, color: bc }}>
//                                                     {appt.lead.name.charAt(0)}
//                                                 </div>
//                                                 <div className="min-w-0">
//                                                     <div className="flex items-center gap-2">
//                                                         <span className="text-[13px] font-semibold text-[#1c3a3a]">{appt.lead.name}</span>
//                                                         <span className="text-[10px] font-medium px-2 py-[1px] rounded-full" style={{ background: sc.bg, color: sc.text }}>{sc.label}</span>
//                                                         {appt.session && <span className="text-[10px] font-semibold px-1.5 py-[1px] rounded-full bg-[#edf7f1] text-[#4e7a5e]">✓ Logged</span>}
//                                                         {appt.session?.payment && (
//                                                             <span className="text-[10px] font-semibold px-1.5 py-[1px] rounded-full" style={{
//                                                                 background: appt.session.payment.status === "paid" ? "#edf7f1" : "#fff8f0",
//                                                                 color: appt.session.payment.status === "paid" ? "#4e7a5e" : "#8b6e3d",
//                                                             }}>
//                                                                 {fmtNaira(appt.session.payment.amountKobo)}
//                                                             </span>
//                                                         )}
//                                                     </div>
//                                                     <div className="text-[11px] text-[#7a9088] mt-0.5">
//                                                         {appt.therapist} · {appt.type} · {appt.lead.email}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="flex items-center gap-1.5 shrink-0">
//                                                 {/* Quick status buttons for scheduled past appointments */}
//                                                 {appt.status === "scheduled" && isPast && (
//                                                     <div className="hidden sm:flex gap-1" onClick={e => e.stopPropagation()}>
//                                                         <button onClick={() => { setSelected(appt); setLogDate(appt.scheduledAt.split("T")[0]); setModal("log"); }}
//                                                             className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-white border-none cursor-pointer"
//                                                             style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" }}>
//                                                             Log Session
//                                                         </button>
//                                                         <button onClick={() => updateStatus(appt.id, "no-show")}
//                                                             className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border border-[#f5e0e0] bg-[#fff8f8] text-[#b94a4f] cursor-pointer">
//                                                             No-show
//                                                         </button>
//                                                     </div>
//                                                 )}
//                                                 {isExp ? <ChevronUp size={14} className="text-[#7a9088]" /> : <ChevronDown size={14} className="text-[#7a9088]" />}
//                                             </div>
//                                         </div>

//                                         {isExp && (
//                                             <div className="border-t border-[#f0f4f2] px-4 pt-4 pb-4">
//                                                 <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
//                                                     {/* Details */}
//                                                     <div>
//                                                         <p className="text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-2">Appointment Details</p>
//                                                         <div className="grid grid-cols-2 gap-1.5 mb-3">
//                                                             {[
//                                                                 { l: "Date", v: fmtDate(appt.scheduledAt) },
//                                                                 { l: "Time", v: fmtTime(appt.scheduledAt) },
//                                                                 { l: "Therapist", v: appt.therapist },
//                                                                 { l: "Type", v: appt.type },
//                                                                 { l: "Duration", v: `${appt.durationMin} min` },
//                                                                 { l: "Band", v: appt.lead.band },
//                                                             ].map(({ l, v }) => (
//                                                                 <div key={l} className="px-2.5 py-2 bg-[#f7faf8] rounded-lg border border-[#e8f0ec]">
//                                                                     <div className="text-[9px] font-bold uppercase tracking-wide text-[#4e7a5e]">{l}</div>
//                                                                     <div className="text-[12px] text-[#1c3a3a] font-semibold mt-0.5 capitalize">{v}</div>
//                                                                 </div>
//                                                             ))}
//                                                         </div>
//                                                         {appt.notes && (
//                                                             <div className="px-3 py-2 bg-[#f7faf8] rounded-lg border border-[#e8f0ec] text-[11px] text-[#7a9088] italic">{appt.notes}</div>
//                                                         )}
//                                                         {/* Session summary if logged */}
//                                                         {appt.session && (
//                                                             <div className="mt-3 p-3 bg-[#edf7f1] rounded-xl border border-[#c8ddd2]">
//                                                                 <div className="text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-1.5">Session Logged</div>
//                                                                 {appt.session.mood && <div className="text-[11px] text-[#7a9088]">Mood: {appt.session.mood}/5 · {appt.session.durationMin}min</div>}
//                                                                 {appt.session.progress && <div className="text-[11px] text-[#7a9088] mt-0.5">{appt.session.progress}</div>}
//                                                                 {appt.session.payment && (
//                                                                     <div className="mt-1.5 pt-1.5 border-t border-[#c8ddd2] flex items-center justify-between">
//                                                                         <span className="text-[11px] text-[#7a9088]">Payment</span>
//                                                                         <span className="text-[12px] font-bold text-[#4e7a5e]">{fmtNaira(appt.session.payment.amountKobo)} · {appt.session.payment.method}</span>
//                                                                     </div>
//                                                                 )}
//                                                             </div>
//                                                         )}
//                                                     </div>

//                                                     {/* Actions */}
//                                                     <div>
//                                                         <p className="text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-2">Update Status</p>
//                                                         <div className="flex flex-wrap gap-1.5 mb-4">
//                                                             {Object.entries(STATUS_CFG).map(([s, cfg]) => (
//                                                                 <button key={s} onClick={() => updateStatus(appt.id, s)}
//                                                                     className="px-3 py-[5px] rounded-full text-[11px] font-semibold cursor-pointer"
//                                                                     style={{
//                                                                         border: appt.status === s ? `2px solid ${cfg.text}` : "1.5px solid #ddeae2",
//                                                                         background: appt.status === s ? cfg.bg : "white",
//                                                                         color: appt.status === s ? cfg.text : "#7a9088",
//                                                                     }}>
//                                                                     {cfg.label}
//                                                                 </button>
//                                                             ))}
//                                                         </div>
//                                                         {!appt.session && (
//                                                             <>
//                                                                 <p className="text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-2">Actions</p>
//                                                                 <div className="flex flex-wrap gap-1.5">
//                                                                     <button onClick={() => { setSelected(appt); setLogDate(appt.scheduledAt.split("T")[0]); setModal("log"); }}
//                                                                         className="flex items-center gap-1 px-3 py-[6px] rounded-xl text-[11px] font-semibold text-white border-none cursor-pointer"
//                                                                         style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" }}>
//                                                                         <FileText size={11} /> Log Session
//                                                                     </button>
//                                                                     <button onClick={() => deleteAppt(appt.id)}
//                                                                         className="flex items-center gap-1 px-3 py-[6px] rounded-xl text-[11px] font-medium cursor-pointer border border-[#f5e0e0] bg-[#fff8f8] text-[#b94a4f]">
//                                                                         <Trash2 size={11} /> Delete
//                                                                     </button>
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
//                     </div>
//                 ))
//             )}

//             {/* ── MODAL: Log Session ── */}
//             {modal === "log" && selected && (
//                 <div className="modal-bg fixed inset-0 bg-[rgba(28,58,58,0.45)] z-[200] flex items-center justify-center p-4 overflow-y-auto" onClick={() => setModal(null)}>
//                     <div className="modal-card bg-white rounded-2xl w-full max-w-[520px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden my-4" onClick={e => e.stopPropagation()}>
//                         <div className="px-5 py-4 border-b border-[#ddeae2] flex items-center justify-between sticky top-0 bg-white z-[1]">
//                             <div>
//                                 <div className="text-[15px] font-semibold text-[#1c3a3a]">Log Session</div>
//                                 <div className="text-[11px] text-[#7a9088]">{selected.lead.name} · {selected.therapist}</div>
//                             </div>
//                             <button onClick={() => setModal(null)} className="bg-transparent border-none cursor-pointer text-[#7a9088]"><X size={18} /></button>
//                         </div>
//                         <div className="p-5 flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-140px)]">
//                             {/* Session details */}
//                             <p className="text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide">Session Details</p>
//                             <div className="grid grid-cols-3 gap-3">
//                                 <div>
//                                     <label className="block text-[10px] text-[#7a9088] mb-1">Date</label>
//                                     <input type="date" value={logDate} onChange={e => setLogDate(e.target.value)}
//                                         className="w-full py-2 px-2.5 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
//                                 </div>
//                                 <div>
//                                     <label className="block text-[10px] text-[#7a9088] mb-1">Time</label>
//                                     <input type="time" value={logTime} onChange={e => setLogTime(e.target.value)}
//                                         className="w-full py-2 px-2.5 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
//                                 </div>
//                                 <div>
//                                     <label className="block text-[10px] text-[#7a9088] mb-1">Duration (min)</label>
//                                     <select value={logDuration} onChange={e => setLogDuration(e.target.value)}
//                                         className="w-full py-2 px-2.5 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit", appearance: "none" }}>
//                                         {["30", "45", "50", "60", "90"].map(d => <option key={d} value={d}>{d}</option>)}
//                                     </select>
//                                 </div>
//                             </div>
//                             <div>
//                                 <label className="block text-[10px] text-[#7a9088] mb-1">Client mood (1–5)</label>
//                                 <div className="flex gap-2">
//                                     {[1, 2, 3, 4, 5].map(n => (
//                                         <button key={n} onClick={() => setLogMood(String(n))}
//                                             className="w-9 h-9 rounded-xl text-[13px] font-bold cursor-pointer border-2 transition-all"
//                                             style={{
//                                                 borderColor: logMood === String(n) ? "#4e7a5e" : "#ddeae2",
//                                                 background: logMood === String(n) ? "#edf7f1" : "white",
//                                                 color: logMood === String(n) ? "#4e7a5e" : "#7a9088",
//                                             }}>
//                                             {n}
//                                         </button>
//                                     ))}
//                                 </div>
//                             </div>
//                             <div>
//                                 <label className="block text-[10px] text-[#7a9088] mb-1">Session notes</label>
//                                 <textarea value={logNotes} onChange={e => setLogNotes(e.target.value)} rows={2} placeholder="What was discussed…"
//                                     className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a] resize-none leading-relaxed" style={{ fontFamily: "inherit" }} />
//                             </div>
//                             <div>
//                                 <label className="block text-[10px] text-[#7a9088] mb-1">Progress notes</label>
//                                 <textarea value={logProgress} onChange={e => setLogProgress(e.target.value)} rows={2} placeholder="Therapist progress observations…"
//                                     className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a] resize-none leading-relaxed" style={{ fontFamily: "inherit" }} />
//                             </div>

//                             {/* Payment section */}
//                             <div className="pt-3 border-t border-[#f0f4f2]">
//                                 <p className="text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-2">Payment</p>
//                                 <div className="grid grid-cols-2 gap-3">
//                                     <div>
//                                         <label className="block text-[10px] text-[#7a9088] mb-1">Amount (₦)</label>
//                                         <input type="number" value={logAmount} onChange={e => setLogAmount(e.target.value)} placeholder="e.g. 15000"
//                                             className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
//                                     </div>
//                                     <div>
//                                         <label className="block text-[10px] text-[#7a9088] mb-1">Method</label>
//                                         <select value={logMethod} onChange={e => setLogMethod(e.target.value)}
//                                             className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit", appearance: "none" }}>
//                                             {["transfer", "card", "cash", "pos"].map(m => <option key={m} value={m}>{m}</option>)}
//                                         </select>
//                                     </div>
//                                     <div>
//                                         <label className="block text-[10px] text-[#7a9088] mb-1">Payment status</label>
//                                         <select value={logPayStatus} onChange={e => setLogPayStatus(e.target.value)}
//                                             className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit", appearance: "none" }}>
//                                             <option value="paid">Paid</option>
//                                             <option value="pending">Pending</option>
//                                         </select>
//                                     </div>
//                                     <div>
//                                         <label className="block text-[10px] text-[#7a9088] mb-1">Reference (optional)</label>
//                                         <input type="text" value={logRef} onChange={e => setLogRef(e.target.value)} placeholder="Paystack ref, etc."
//                                             className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="flex gap-2 justify-end mt-1 sticky bottom-0 bg-white pt-3 border-t border-[#f0f4f2]">
//                                 <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-[#ddeae2] bg-white text-[#7a9088] text-[12px] cursor-pointer">Cancel</button>
//                                 <button onClick={logSession} disabled={!logDate || !logAmount || logging}
//                                     className="px-5 py-2 rounded-xl border-none text-white text-[12px] font-semibold cursor-pointer flex items-center gap-1.5"
//                                     style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)", opacity: !logDate || !logAmount ? 0.5 : 1 }}>
//                                     <CheckCircle size={13} /> {logging ? "Saving…" : "Log Session"}
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

// app/admin/appointments/page.tsx
import { useState, useEffect, useCallback } from "react";
import {
    Calendar, CheckCircle, X, AlertCircle,
    RefreshCw, ChevronDown, ChevronUp,
    FileText, Trash2,
} from "lucide-react";

interface Appointment {
    id: string; createdAt: string;
    leadId: string;
    lead: { id: string; name: string; email: string; phone: string | null; band: string };
    scheduledAt: string; durationMin: number; therapist: string;
    type: string; status: string; notes: string | null;
    session: Session | null;
}
interface Session {
    id: string; conductedAt: string; therapist: string; type: string;
    durationMin: number; notes: string | null; mood: number | null; progress: string | null;
    payment: Payment | null;
}
interface Payment {
    id: string; amountKobo: number; status: string; method: string; paidAt: string | null;
}

const STATUS_CFG: Record<string, { bg: string; text: string; label: string }> = {
    scheduled: { bg: "#e8f4f8", text: "#2a5a7a", label: "Scheduled" },
    completed: { bg: "#edf7f1", text: "#3a7a58", label: "Completed" },
    cancelled: { bg: "#f5f5f5", text: "#7a7a7a", label: "Cancelled" },
    "no-show": { bg: "#fff0f0", text: "#7a3a3a", label: "No-Show" },
};
const BAND_COLORS: Record<string, string> = {
    Low: "#4e8c6a", Mild: "#3d8b8b", Moderate: "#8b6e3d", High: "#b94a4f",
};

const fmtNaira = (kobo: number) => `₦${(kobo / 100).toLocaleString("en-NG")}`;
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

export default function AppointmentsPage() {
    const [appts, setAppts] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [upcoming, setUpcoming] = useState(0);
    const [statusFilter, setStatusFilter] = useState("all");
    const [therapistFilter, setTherapistFilter] = useState("all");
    const [expandedId, setExpanded] = useState<string | null>(null);
    const [modal, setModal] = useState<"log" | null>(null);
    const [selected, setSelected] = useState<Appointment | null>(null);
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

    // Settings data
    const [therapists, setTherapists] = useState<{ id: string; name: string }[]>([]);

    // Log session form
    const [logDate, setLogDate] = useState("");
    const [logTime, setLogTime] = useState("09:00");
    const [logDuration, setLogDuration] = useState("50");
    const [logMood, setLogMood] = useState("3");
    const [logNotes, setLogNotes] = useState("");
    const [logProgress, setLogProgress] = useState("");
    const [logAmount, setLogAmount] = useState("");
    const [logMethod, setLogMethod] = useState("transfer");
    const [logPayStatus, setLogPayStatus] = useState("paid");
    const [logRef, setLogRef] = useState("");
    const [sendSessionEmail, setSendSessionEmail] = useState(false);
    const [logging, setLogging] = useState(false);

    const showToast = (msg: string, ok = true) => {
        setToast({ msg, ok }); setTimeout(() => setToast(null), 3500);
    };

    // Fetch settings
    useEffect(() => {
        fetch("/api/admin/settings").then(r => r.json()).then(data => {
            if (data.success) setTherapists(data.therapists ?? []);
        }).catch(() => { });
    }, []);

    const fetchAppts = useCallback(async () => {
        setLoading(true);
        const params = new URLSearchParams({ limit: "100" });
        if (statusFilter !== "all") params.set("status", statusFilter);
        if (therapistFilter !== "all") params.set("therapist", therapistFilter);
        try {
            const res = await fetch(`/api/admin/appointments?${params}`);
            const data = await res.json();
            if (data.success) {
                setAppts(data.appointments);
                setTotal(data.analytics.total);
                setUpcoming(data.analytics.upcoming);
            }
        } finally { setLoading(false); }
    }, [statusFilter, therapistFilter]);

    useEffect(() => { fetchAppts(); }, [fetchAppts]);

    const updateStatus = async (id: string, status: string) => {
        const res = await fetch("/api/admin/appointments", {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status }),
        });
        const data = await res.json();
        if (data.success) {
            setAppts(p => p.map(a => a.id === id ? { ...a, status } : a));
            showToast("Status updated");
        }
    };

    const logSession = async () => {
        if (!selected || !logDate || !logAmount) return;
        setLogging(true);
        try {
            const amountKobo = Math.round(parseFloat(logAmount) * 100);
            const res = await fetch("/api/admin/sessions", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    leadId: selected.leadId,
                    appointmentId: selected.id,
                    conductedAt: `${logDate}T${logTime}:00`,
                    therapist: selected.therapist,
                    type: selected.type,
                    durationMin: parseInt(logDuration),
                    mood: parseInt(logMood),
                    notes: logNotes || undefined,
                    progress: logProgress || undefined,
                    amountKobo,
                    paymentMethod: logMethod,
                    paymentRef: logRef || undefined,
                    paymentStatus: logPayStatus,
                    sendEmail: sendSessionEmail,
                }),
            });
            const data = await res.json();
            if (data.success) {
                showToast("Session logged!" + (sendSessionEmail ? " Email sent." : ""));
                setModal(null);
                setLogDate(""); setLogNotes(""); setLogProgress(""); setLogAmount(""); setLogRef("");
                fetchAppts();
            } else showToast("Failed to log session", false);
        } finally { setLogging(false); }
    };

    const deleteAppt = async (id: string) => {
        if (!confirm("Delete this appointment?")) return;
        const res = await fetch(`/api/admin/appointments?id=${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) { setAppts(p => p.filter(a => a.id !== id)); showToast("Deleted"); }
    };

    // Group by date
    const groups: Record<string, Appointment[]> = {};
    appts.forEach(a => {
        const key = new Date(a.scheduledAt).toDateString();
        groups[key] = [...(groups[key] ?? []), a];
    });

    return (
        <div className="flex flex-col gap-4 max-w-full">
            <style>{`
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        .modal-bg { animation: fadeIn 0.18s ease; }
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
                    <h1 className="text-[18px] font-bold text-[#1c3a3a]">Appointments</h1>
                    <p className="text-[12px] text-[#7a9088]">{upcoming} upcoming · {total} total</p>
                </div>
                <button onClick={fetchAppts} className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#ddeae2] rounded-xl text-[12px] text-[#7a9088] cursor-pointer hover:bg-[#f7faf8]">
                    <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-[#ddeae2] px-4 py-3 flex flex-wrap gap-2 items-center shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                    className="py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a] cursor-pointer" style={{ fontFamily: "inherit", appearance: "none" }}>
                    <option value="all">All statuses</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no-show">No-Show</option>
                </select>
                <select value={therapistFilter} onChange={e => setTherapistFilter(e.target.value)}
                    className="py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a] cursor-pointer" style={{ fontFamily: "inherit", appearance: "none" }}>
                    <option value="all">All therapists</option>
                    {therapists.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                </select>
                <span className="ml-auto text-[11px] text-[#7a9088]">{appts.length} appointments</span>
            </div>

            {/* Appointment list */}
            {loading ? (
                <div className="text-center py-16 text-[#7a9088] text-sm">
                    <div className="w-6 h-6 rounded-full border-2 border-[#4e8c6a] border-t-transparent animate-spin mx-auto mb-2" />
                    Loading…
                </div>
            ) : appts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-[#ddeae2]">
                    <Calendar size={28} className="text-[#ddeae2] mb-2 mx-auto" />
                    <p className="text-[#7a9088] text-sm">No appointments found</p>
                </div>
            ) : (
                Object.entries(groups).map(([dateKey, dayAppts]) => (
                    <div key={dateKey}>
                        <div className="text-[11px] font-bold text-[#7a9088] uppercase tracking-[0.08em] mb-2 px-1">
                            {new Date(dateKey).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
                        </div>
                        <div className="flex flex-col gap-2">
                            {dayAppts.map(appt => {
                                const sc = STATUS_CFG[appt.status] ?? STATUS_CFG.scheduled;
                                const bc = BAND_COLORS[appt.lead.band] ?? "#7ba98b";
                                const isExp = expandedId === appt.id;
                                const isPast = new Date(appt.scheduledAt) < new Date();

                                return (
                                    <div key={appt.id} className="bg-white rounded-2xl border border-[#ddeae2] shadow-[0_1px_6px_rgba(28,58,58,0.04)] overflow-hidden">
                                        <div className="grid gap-3 px-4 py-3 cursor-pointer hover:bg-[#f7faf8] transition-colors"
                                            style={{ gridTemplateColumns: "1fr auto" }}
                                            onClick={() => setExpanded(isExp ? null : appt.id)}>
                                            <div className="flex items-center gap-3">
                                                <div className="shrink-0 w-14 text-center">
                                                    <div className="text-[13px] font-bold text-[#1c3a3a]">{fmtTime(appt.scheduledAt)}</div>
                                                    <div className="text-[9px] text-[#7a9088]">{appt.durationMin}min</div>
                                                </div>
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ background: `${bc}20`, color: bc }}>
                                                    {appt.lead.name.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-[13px] font-semibold text-[#1c3a3a]">{appt.lead.name}</span>
                                                        <span className="text-[10px] font-medium px-2 py-[1px] rounded-full" style={{ background: sc.bg, color: sc.text }}>{sc.label}</span>
                                                        {appt.session && <span className="text-[10px] font-semibold px-1.5 py-[1px] rounded-full bg-[#edf7f1] text-[#4e7a5e]">✓ Logged</span>}
                                                        {appt.session?.payment && (
                                                            <span className="text-[10px] font-semibold px-1.5 py-[1px] rounded-full"
                                                                style={{ background: appt.session.payment.status === "paid" ? "#edf7f1" : "#fff8f0", color: appt.session.payment.status === "paid" ? "#4e7a5e" : "#8b6e3d" }}>
                                                                {fmtNaira(appt.session.payment.amountKobo)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-[11px] text-[#7a9088] mt-0.5">{appt.therapist} · {appt.type} · {appt.lead.email}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                {appt.status === "scheduled" && isPast && (
                                                    <div className="hidden sm:flex gap-1" onClick={e => e.stopPropagation()}>
                                                        <button onClick={() => { setSelected(appt); setLogDate(appt.scheduledAt.split("T")[0]); setLogTime(fmtTime(appt.scheduledAt).replace(":", ":")); setModal("log"); }}
                                                            className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-white border-none cursor-pointer"
                                                            style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" }}>
                                                            Log Session
                                                        </button>
                                                        <button onClick={() => updateStatus(appt.id, "no-show")}
                                                            className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border border-[#f5e0e0] bg-[#fff8f8] text-[#b94a4f] cursor-pointer">
                                                            No-show
                                                        </button>
                                                    </div>
                                                )}
                                                {isExp ? <ChevronUp size={14} className="text-[#7a9088]" /> : <ChevronDown size={14} className="text-[#7a9088]" />}
                                            </div>
                                        </div>

                                        {isExp && (
                                            <div className="border-t border-[#f0f4f2] px-4 pt-4 pb-4">
                                                <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-2">Appointment Details</p>
                                                        <div className="grid grid-cols-2 gap-1.5 mb-3">
                                                            {[
                                                                { l: "Date", v: fmtDate(appt.scheduledAt) },
                                                                { l: "Time", v: fmtTime(appt.scheduledAt) },
                                                                { l: "Therapist", v: appt.therapist },
                                                                { l: "Type", v: appt.type },
                                                                { l: "Duration", v: `${appt.durationMin} min` },
                                                                { l: "Band", v: appt.lead.band },
                                                            ].map(({ l, v }) => (
                                                                <div key={l} className="px-2.5 py-2 bg-[#f7faf8] rounded-lg border border-[#e8f0ec]">
                                                                    <div className="text-[9px] font-bold uppercase tracking-wide text-[#4e7a5e]">{l}</div>
                                                                    <div className="text-[12px] text-[#1c3a3a] font-semibold mt-0.5 capitalize">{v}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        {appt.notes && (
                                                            <div className="px-3 py-2 bg-[#f7faf8] rounded-lg border border-[#e8f0ec] text-[11px] text-[#7a9088] italic">{appt.notes}</div>
                                                        )}
                                                        {appt.session && (
                                                            <div className="mt-3 p-3 bg-[#edf7f1] rounded-xl border border-[#c8ddd2]">
                                                                <div className="text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-1.5">Session Logged</div>
                                                                {appt.session.mood && <div className="text-[11px] text-[#7a9088]">Mood: {appt.session.mood}/5 · {appt.session.durationMin}min</div>}
                                                                {appt.session.progress && <div className="text-[11px] text-[#7a9088] mt-0.5">{appt.session.progress}</div>}
                                                                {appt.session.payment && (
                                                                    <div className="mt-1.5 pt-1.5 border-t border-[#c8ddd2] flex items-center justify-between">
                                                                        <span className="text-[11px] text-[#7a9088]">Payment</span>
                                                                        <span className="text-[12px] font-bold text-[#4e7a5e]">{fmtNaira(appt.session.payment.amountKobo)} · {appt.session.payment.method}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <p className="text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-2">Update Status</p>
                                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                                            {Object.entries(STATUS_CFG).map(([s, cfg]) => (
                                                                <button key={s} onClick={() => updateStatus(appt.id, s)}
                                                                    className="px-3 py-[5px] rounded-full text-[11px] font-semibold cursor-pointer"
                                                                    style={{
                                                                        border: appt.status === s ? `2px solid ${cfg.text}` : "1.5px solid #ddeae2",
                                                                        background: appt.status === s ? cfg.bg : "white",
                                                                        color: appt.status === s ? cfg.text : "#7a9088",
                                                                    }}>
                                                                    {cfg.label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                        {!appt.session && (
                                                            <>
                                                                <p className="text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-2">Actions</p>
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    <button onClick={() => { setSelected(appt); setLogDate(appt.scheduledAt.split("T")[0]); setModal("log"); }}
                                                                        className="flex items-center gap-1 px-3 py-[6px] rounded-xl text-[11px] font-semibold text-white border-none cursor-pointer"
                                                                        style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" }}>
                                                                        <FileText size={11} /> Log Session
                                                                    </button>
                                                                    <button onClick={() => deleteAppt(appt.id)}
                                                                        className="flex items-center gap-1 px-3 py-[6px] rounded-xl text-[11px] font-medium cursor-pointer border border-[#f5e0e0] bg-[#fff8f8] text-[#b94a4f]">
                                                                        <Trash2 size={11} /> Delete
                                                                    </button>
                                                                </div>
                                                            </>
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
                ))
            )}

            {/* MODAL: Log Session */}
            {modal === "log" && selected && (
                <div className="modal-bg fixed inset-0 bg-[rgba(28,58,58,0.45)] z-[200] flex items-center justify-center p-4 overflow-y-auto" onClick={() => setModal(null)}>
                    <div className="modal-card bg-white rounded-2xl w-full max-w-[520px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden my-4" onClick={e => e.stopPropagation()}>
                        <div className="px-5 py-4 border-b border-[#ddeae2] flex items-center justify-between sticky top-0 bg-white z-[1]">
                            <div>
                                <div className="text-[15px] font-semibold text-[#1c3a3a]">Log Session</div>
                                <div className="text-[11px] text-[#7a9088]">{selected.lead.name} · {selected.therapist}</div>
                            </div>
                            <button onClick={() => setModal(null)} className="bg-transparent border-none cursor-pointer text-[#7a9088]"><X size={18} /></button>
                        </div>
                        <div className="p-5 flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-140px)]">
                            <p className="text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide">Session Details</p>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-[10px] text-[#7a9088] mb-1">Date</label>
                                    <input type="date" value={logDate} onChange={e => setLogDate(e.target.value)}
                                        className="w-full py-2 px-2.5 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-[#7a9088] mb-1">Time</label>
                                    <input type="time" value={logTime} onChange={e => setLogTime(e.target.value)}
                                        className="w-full py-2 px-2.5 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-[#7a9088] mb-1">Duration (min)</label>
                                    <select value={logDuration} onChange={e => setLogDuration(e.target.value)}
                                        className="w-full py-2 px-2.5 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit", appearance: "none" }}>
                                        {["30", "45", "50", "60", "90"].map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] text-[#7a9088] mb-1">Client mood (1–5)</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(n => (
                                        <button key={n} onClick={() => setLogMood(String(n))}
                                            className="w-9 h-9 rounded-xl text-[13px] font-bold cursor-pointer border-2 transition-all"
                                            style={{
                                                borderColor: logMood === String(n) ? "#4e7a5e" : "#ddeae2",
                                                background: logMood === String(n) ? "#edf7f1" : "white",
                                                color: logMood === String(n) ? "#4e7a5e" : "#7a9088",
                                            }}>
                                            {n}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] text-[#7a9088] mb-1">Session notes</label>
                                <textarea value={logNotes} onChange={e => setLogNotes(e.target.value)} rows={2} placeholder="What was discussed…"
                                    className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a] resize-none leading-relaxed" style={{ fontFamily: "inherit" }} />
                            </div>
                            <div>
                                <label className="block text-[10px] text-[#7a9088] mb-1">Progress notes</label>
                                <textarea value={logProgress} onChange={e => setLogProgress(e.target.value)} rows={2} placeholder="Therapist progress observations…"
                                    className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a] resize-none leading-relaxed" style={{ fontFamily: "inherit" }} />
                            </div>

                            <div className="pt-3 border-t border-[#f0f4f2]">
                                <p className="text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-2">Payment</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[10px] text-[#7a9088] mb-1">Amount (₦)</label>
                                        <input type="number" value={logAmount} onChange={e => setLogAmount(e.target.value)} placeholder="e.g. 15000"
                                            className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-[#7a9088] mb-1">Method</label>
                                        <select value={logMethod} onChange={e => setLogMethod(e.target.value)}
                                            className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit", appearance: "none" }}>
                                            {["transfer", "card", "cash", "pos"].map(m => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-[#7a9088] mb-1">Payment status</label>
                                        <select value={logPayStatus} onChange={e => setLogPayStatus(e.target.value)}
                                            className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit", appearance: "none" }}>
                                            <option value="paid">Paid</option>
                                            <option value="pending">Pending</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-[#7a9088] mb-1">Reference (optional)</label>
                                        <input type="text" value={logRef} onChange={e => setLogRef(e.target.value)} placeholder="Paystack ref, etc."
                                            className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
                                    </div>
                                </div>
                            </div>

                            {/* Email option */}
                            <label className="flex items-center gap-2 cursor-pointer px-3 py-2.5 bg-[#f7faf8] rounded-xl border border-[#e8f0ec]">
                                <input type="checkbox" checked={sendSessionEmail} onChange={e => setSendSessionEmail(e.target.checked)}
                                    className="w-4 h-4 rounded accent-[#4e7a5e]" />
                                <span className="text-[12px] text-[#1c3a3a]">Send session summary email to client</span>
                            </label>

                            <div className="flex gap-2 justify-end mt-1 sticky bottom-0 bg-white pt-3 border-t border-[#f0f4f2]">
                                <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-[#ddeae2] bg-white text-[#7a9088] text-[12px] cursor-pointer">Cancel</button>
                                <button onClick={logSession} disabled={!logDate || !logAmount || logging}
                                    className="px-5 py-2 rounded-xl border-none text-white text-[12px] font-semibold cursor-pointer flex items-center gap-1.5"
                                    style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)", opacity: !logDate || !logAmount ? 0.5 : 1 }}>
                                    <CheckCircle size={13} /> {logging ? "Saving…" : "Log Session"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}