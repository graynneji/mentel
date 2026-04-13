// "use client";

// // app/admin/companies/[id]/sessions/page.tsx
// // Admin session management for a specific EAP company.
// // Schedule sessions, mark complete, log therapist notes, track mood ratings.
// // This is what populates the EAPSession table.

// import { useState, useEffect, useCallback } from "react";
// import Link from "next/link";
// import {
//     ChevronLeft, Plus, Calendar, CheckCircle, X,
//     Clock, Video, Phone, Users, Edit2, Save,
//     RefreshCw, AlertTriangle, Loader2, ChevronDown,
// } from "lucide-react";
// import { useParams } from "next/navigation";

// // ── Types ─────────────────────────────────────────────────────────────────────

// interface EAPSession {
//     id: string;
//     scheduledAt: string;
//     conductedAt: string | null;
//     durationMin: number;
//     therapist: string;
//     type: string;
//     modality: string;
//     status: string;
//     moodPre: number | null;
//     moodPost: number | null;
//     progressNotes: string | null;
//     domains: string[];
//     employee: {
//         id: string;
//         name: string | null;
//         department: string | null;
//         anonymous: boolean;
//         riskBand: string | null;
//         sessionsUsed: number;
//         sessionsRemaining: number | null;
//     };
// }

// interface Employee {
//     id: string;
//     name: string | null;
//     department: string | null;
//     anonymous: boolean;
//     riskBand: string | null;
//     sessionsUsed: number;
//     sessionsRemaining: number | null;
// }

// const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
//     scheduled: { bg: "rgba(61,139,139,0.1)", text: "#3d8b8b", label: "Scheduled" },
//     completed: { bg: "rgba(78,140,106,0.1)", text: "#4e8c6a", label: "Completed" },
//     cancelled: { bg: "rgba(185,74,79,0.1)", text: "#b94a4f", label: "Cancelled" },
//     "no-show": { bg: "rgba(139,110,61,0.1)", text: "#8b6e3d", label: "No-show" },
//     rescheduled: { bg: "rgba(110,78,139,0.1)", text: "#6e4e8b", label: "Rescheduled" },
// };

// const TYPE_LABELS: Record<string, string> = {
//     individual: "Individual", couples: "Couples", group: "Group",
//     coaching: "Coaching", crisis: "Crisis",
// };

// const MODALITY_ICONS: Record<string, React.ElementType> = {
//     video: Video, phone: Phone, "in-person": Users,
// };

// const DOMAINS_ALL = ["Stress", "Anxiety", "Depression", "Burnout", "Sleep", "Relationships", "Self-esteem"];

// // ── Book Session Modal ─────────────────────────────────────────────────────────

// function BookSessionModal({
//     companyId,
//     employees,
//     onClose,
//     onBooked,
// }: {
//     companyId: string;
//     employees: Employee[];
//     onClose: () => void;
//     onBooked: (session: EAPSession) => void;
// }) {
//     const [form, setForm] = useState({
//         employeeId: "",
//         scheduledAt: "",
//         therapist: "",
//         type: "individual",
//         modality: "video",
//         durationMin: 50,
//     });
//     const [submitting, setSubmitting] = useState(false);
//     const [error, setError] = useState("");

//     const set = (k: string, v: string | number) =>
//         setForm((f) => ({ ...f, [k]: v }));

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!form.employeeId || !form.scheduledAt || !form.therapist) {
//             setError("Employee, date/time, and therapist are required.");
//             return;
//         }
//         setSubmitting(true);
//         setError("");
//         try {
//             const res = await fetch(
//                 `/api/admin/companies/${companyId}/sessions`,
//                 {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify(form),
//                 },
//             );
//             const data = await res.json();
//             if (!res.ok || !data.success) {
//                 setError(data.error ?? "Failed to schedule session.");
//                 return;
//             }
//             onBooked(data.session);
//             onClose();
//         } catch {
//             setError("Network error. Please try again.");
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     return (
//         <div
//             className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center px-0 sm:px-4"
//             style={{ background: "rgba(0,0,0,0.35)" }}
//         >
//             <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl overflow-hidden flex flex-col"
//                 style={{ maxHeight: "92vh" }}>
//                 <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#e4eee8" }}>
//                     <h2 className="text-[15px] font-semibold" style={{ color: "#1c3a3a" }}>
//                         Schedule EAP Session
//                     </h2>
//                     <button onClick={onClose} style={{ color: "#7a9088", background: "none", border: "none", cursor: "pointer" }}>
//                         <X size={16} />
//                     </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4 overflow-y-auto flex-1">
//                     {/* Employee */}
//                     <div>
//                         <label className="block text-[11px] font-medium mb-1.5" style={{ color: "#1c3a3a" }}>
//                             Employee *
//                         </label>
//                         <select
//                             value={form.employeeId}
//                             onChange={(e) => set("employeeId", e.target.value)}
//                             className="w-full text-[12px] px-3 py-2.5 rounded-xl border outline-none"
//                             style={{ borderColor: "#ddeae2", color: "#1c3a3a" }}
//                             required
//                         >
//                             <option value="">Select employee…</option>
//                             {employees.map((emp) => (
//                                 <option key={emp.id} value={emp.id}>
//                                     {emp.anonymous
//                                         ? `Anonymous — ${emp.department ?? "Unknown dept"}`
//                                         : `${emp.name ?? "Unnamed"} (${emp.department ?? "No dept"})`}
//                                     {" "}· {emp.sessionsUsed} sessions used
//                                     {emp.sessionsRemaining !== null ? `, ${emp.sessionsRemaining} remaining` : ""}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     {/* Date/time */}
//                     <div>
//                         <label className="block text-[11px] font-medium mb-1.5" style={{ color: "#1c3a3a" }}>
//                             Date & Time *
//                         </label>
//                         <input
//                             type="datetime-local"
//                             value={form.scheduledAt}
//                             onChange={(e) => set("scheduledAt", e.target.value)}
//                             className="w-full text-[12px] px-3 py-2.5 rounded-xl border outline-none"
//                             style={{ borderColor: "#ddeae2", color: "#1c3a3a" }}
//                             required
//                         />
//                     </div>

//                     {/* Therapist */}
//                     <div>
//                         <label className="block text-[11px] font-medium mb-1.5" style={{ color: "#1c3a3a" }}>
//                             Therapist *
//                         </label>
//                         <input
//                             type="text"
//                             value={form.therapist}
//                             onChange={(e) => set("therapist", e.target.value)}
//                             placeholder="Dr. Kemi Adeyemi"
//                             className="w-full text-[12px] px-3 py-2.5 rounded-xl border outline-none"
//                             style={{ borderColor: "#ddeae2", color: "#1c3a3a" }}
//                             required
//                         />
//                     </div>

//                     {/* Type + Modality */}
//                     <div className="grid grid-cols-2 gap-3">
//                         <div>
//                             <label className="block text-[11px] font-medium mb-1.5" style={{ color: "#1c3a3a" }}>Type</label>
//                             <select
//                                 value={form.type}
//                                 onChange={(e) => set("type", e.target.value)}
//                                 className="w-full text-[12px] px-3 py-2.5 rounded-xl border outline-none"
//                                 style={{ borderColor: "#ddeae2", color: "#1c3a3a" }}
//                             >
//                                 {Object.entries(TYPE_LABELS).map(([v, l]) => (
//                                     <option key={v} value={v}>{l}</option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div>
//                             <label className="block text-[11px] font-medium mb-1.5" style={{ color: "#1c3a3a" }}>Modality</label>
//                             <select
//                                 value={form.modality}
//                                 onChange={(e) => set("modality", e.target.value)}
//                                 className="w-full text-[12px] px-3 py-2.5 rounded-xl border outline-none"
//                                 style={{ borderColor: "#ddeae2", color: "#1c3a3a" }}
//                             >
//                                 <option value="video">Video call</option>
//                                 <option value="phone">Phone</option>
//                                 <option value="in-person">In-person</option>
//                             </select>
//                         </div>
//                     </div>

//                     {/* Duration */}
//                     <div>
//                         <label className="block text-[11px] font-medium mb-1.5" style={{ color: "#1c3a3a" }}>Duration (minutes)</label>
//                         <select
//                             value={form.durationMin}
//                             onChange={(e) => set("durationMin", parseInt(e.target.value))}
//                             className="w-full text-[12px] px-3 py-2.5 rounded-xl border outline-none"
//                             style={{ borderColor: "#ddeae2", color: "#1c3a3a" }}
//                         >
//                             {[30, 45, 50, 60, 90].map((d) => (
//                                 <option key={d} value={d}>{d} minutes</option>
//                             ))}
//                         </select>
//                     </div>

//                     {error && <p className="text-[12px]" style={{ color: "#b94a4f" }}>{error}</p>}
//                 </form>

//                 <div className="flex items-center justify-between px-5 py-4 border-t" style={{ borderColor: "#e4eee8" }}>
//                     <button onClick={onClose} className="px-4 py-2 rounded-xl text-[12px] border"
//                         style={{ borderColor: "#ddeae2", color: "#7a9088" }}>
//                         Cancel
//                     </button>
//                     <button
//                         onClick={handleSubmit as unknown as React.MouseEventHandler}
//                         disabled={submitting}
//                         className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-[12px] font-medium text-white disabled:opacity-40"
//                         style={{ background: "linear-gradient(135deg, #4e8c6a, #3d8b8b)" }}
//                     >
//                         {submitting && <Loader2 size={12} className="animate-spin" />}
//                         {submitting ? "Scheduling…" : "Schedule Session"}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// // ── Session row ────────────────────────────────────────────────────────────────

// function SessionRow({
//     session,
//     companyId,
//     onUpdated,
// }: {
//     session: EAPSession;
//     companyId: string;
//     onUpdated: (updated: EAPSession) => void;
// }) {
//     const [expanded, setExpanded] = useState(false);
//     const [editing, setEditing] = useState(false);
//     const [saving, setSaving] = useState(false);
//     const [notes, setNotes] = useState(session.progressNotes ?? "");
//     const [status, setStatus] = useState(session.status);
//     const [domains, setDomains] = useState<string[]>(session.domains);
//     const [moodPre, setMoodPre] = useState<number | "">(session.moodPre ?? "");
//     const [moodPost, setMoodPost] = useState<number | "">(session.moodPost ?? "");

//     const statusInfo = STATUS_COLORS[session.status] ?? STATUS_COLORS.scheduled;
//     const ModalityIcon = MODALITY_ICONS[session.modality] ?? Video;
//     const scheduledDate = new Date(session.scheduledAt);
//     const isPast = scheduledDate < new Date();

//     const handleSave = async () => {
//         setSaving(true);
//         try {
//             const res = await fetch(`/api/admin/companies/${companyId}/sessions`, {
//                 method: "PATCH",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     sessionId: session.id,
//                     status,
//                     progressNotes: notes,
//                     domains,
//                     moodPre: moodPre !== "" ? Number(moodPre) : undefined,
//                     moodPost: moodPost !== "" ? Number(moodPost) : undefined,
//                     conductedAt: status === "completed" && !session.conductedAt
//                         ? new Date().toISOString()
//                         : undefined,
//                 }),
//             });
//             const data = await res.json();
//             if (data.success) {
//                 onUpdated(data.session);
//                 setEditing(false);
//             }
//         } finally {
//             setSaving(false);
//         }
//     };

//     const toggleDomain = (d: string) =>
//         setDomains((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);

//     return (
//         <div className="bg-white rounded-2xl border mb-3 overflow-hidden"
//             style={{ borderColor: "#e4eee8" }}>
//             {/* Header row */}
//             <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4">
//                 {/* Employee */}
//                 <div className="flex items-center gap-3 flex-1 min-w-0">
//                     <div
//                         className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
//                         style={{ background: "linear-gradient(135deg, #4e8c6a, #3d8b8b)" }}
//                     >
//                         {session.employee.anonymous ? "A" : (session.employee.name?.charAt(0) ?? "?")}
//                     </div>
//                     <div className="min-w-0">
//                         <div className="text-[13px] font-semibold truncate" style={{ color: "#1c3a3a" }}>
//                             {session.employee.anonymous
//                                 ? `Anonymous — ${session.employee.department ?? "Unknown dept"}`
//                                 : (session.employee.name ?? "Unnamed employee")}
//                         </div>
//                         <div className="text-[11px]" style={{ color: "#7a9088" }}>
//                             {session.therapist} · {TYPE_LABELS[session.type] ?? session.type}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Date + modality */}
//                 <div className="flex items-center gap-3 flex-wrap">
//                     <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "#7a9088" }}>
//                         <Calendar size={12} />
//                         {scheduledDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
//                     </div>
//                     <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "#7a9088" }}>
//                         <Clock size={12} />
//                         {scheduledDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
//                     </div>
//                     <div className="flex items-center gap-1 text-[11px]" style={{ color: "#7a9088" }}>
//                         <ModalityIcon size={12} />
//                         {session.modality}
//                     </div>
//                     <span
//                         className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
//                         style={{ background: statusInfo.bg, color: statusInfo.text }}
//                     >
//                         {statusInfo.label}
//                     </span>
//                     {session.moodPost !== null && (
//                         <span className="text-[10px] px-2 py-0.5 rounded-full"
//                             style={{ background: "rgba(78,140,106,0.1)", color: "#4e8c6a" }}>
//                             Mood {session.moodPost}/10
//                         </span>
//                     )}
//                     <button
//                         onClick={() => setExpanded((e) => !e)}
//                         className="p-1.5 rounded-lg border"
//                         style={{ borderColor: "#ddeae2", color: "#7a9088" }}
//                     >
//                         <ChevronDown size={13} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
//                     </button>
//                 </div>
//             </div>

//             {/* Expanded details */}
//             {expanded && (
//                 <div className="border-t px-4 py-4 space-y-4" style={{ borderColor: "#f0f7f3" }}>

//                     {/* Status + quick actions */}
//                     <div className="flex flex-wrap gap-2">
//                         {["scheduled", "completed", "no-show", "cancelled", "rescheduled"].map((s) => (
//                             <button
//                                 key={s}
//                                 onClick={() => { if (editing) setStatus(s); }}
//                                 disabled={!editing}
//                                 className="px-2.5 py-1.5 rounded-xl text-[11px] font-medium border transition-all disabled:opacity-50"
//                                 style={{
//                                     background: (editing ? status : session.status) === s
//                                         ? `${STATUS_COLORS[s]?.bg ?? "rgba(61,139,139,0.1)"}`
//                                         : "white",
//                                     borderColor: (editing ? status : session.status) === s
//                                         ? (STATUS_COLORS[s]?.text ?? "#3d8b8b")
//                                         : "#ddeae2",
//                                     color: (editing ? status : session.status) === s
//                                         ? (STATUS_COLORS[s]?.text ?? "#3d8b8b")
//                                         : "#7a9088",
//                                 }}
//                             >
//                                 {STATUS_COLORS[s]?.label ?? s}
//                             </button>
//                         ))}
//                     </div>

//                     {/* Mood ratings */}
//                     {editing && (
//                         <div className="grid grid-cols-2 gap-3">
//                             <div>
//                                 <label className="block text-[11px] font-medium mb-1" style={{ color: "#1c3a3a" }}>
//                                     Mood before session (1–10)
//                                 </label>
//                                 <input
//                                     type="number" min={1} max={10}
//                                     value={moodPre}
//                                     onChange={(e) => setMoodPre(e.target.value === "" ? "" : Math.max(1, Math.min(10, parseInt(e.target.value))))}
//                                     className="w-full text-[12px] px-3 py-2 rounded-xl border outline-none"
//                                     style={{ borderColor: "#ddeae2", color: "#1c3a3a" }}
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-[11px] font-medium mb-1" style={{ color: "#1c3a3a" }}>
//                                     Mood after session (1–10)
//                                 </label>
//                                 <input
//                                     type="number" min={1} max={10}
//                                     value={moodPost}
//                                     onChange={(e) => setMoodPost(e.target.value === "" ? "" : Math.max(1, Math.min(10, parseInt(e.target.value))))}
//                                     className="w-full text-[12px] px-3 py-2 rounded-xl border outline-none"
//                                     style={{ borderColor: "#ddeae2", color: "#1c3a3a" }}
//                                 />
//                             </div>
//                         </div>
//                     )}

//                     {/* Domains addressed */}
//                     <div>
//                         <p className="text-[11px] font-medium mb-2" style={{ color: "#7a9088" }}>Domains addressed</p>
//                         <div className="flex flex-wrap gap-1.5">
//                             {DOMAINS_ALL.map((d) => {
//                                 const active = (editing ? domains : session.domains).includes(d);
//                                 return (
//                                     <button
//                                         key={d}
//                                         onClick={() => { if (editing) toggleDomain(d); }}
//                                         disabled={!editing}
//                                         className="px-2.5 py-1 rounded-full text-[11px] border transition-all disabled:cursor-default"
//                                         style={{
//                                             background: active ? "rgba(78,140,106,0.1)" : "white",
//                                             borderColor: active ? "#4e8c6a" : "#ddeae2",
//                                             color: active ? "#4e8c6a" : "#b0c8bc",
//                                         }}
//                                     >
//                                         {d}
//                                     </button>
//                                 );
//                             })}
//                         </div>
//                     </div>

//                     {/* Progress notes */}
//                     <div>
//                         <p className="text-[11px] font-medium mb-1.5" style={{ color: "#7a9088" }}>
//                             Therapist / progress notes <span style={{ color: "#b0c8bc" }}>(admin only — never shown to HR)</span>
//                         </p>
//                         {editing ? (
//                             <textarea
//                                 value={notes}
//                                 onChange={(e) => setNotes(e.target.value)}
//                                 rows={4}
//                                 placeholder="Session focus, techniques used, homework assigned, next session plan…"
//                                 className="w-full text-[12px] px-3 py-2.5 rounded-xl border outline-none resize-y"
//                                 style={{ borderColor: "#ddeae2", color: "#1c3a3a", background: "#f9fdfb" }}
//                             />
//                         ) : (
//                             <div
//                                 className="rounded-xl px-3 py-2.5 text-[12px] font-light leading-relaxed"
//                                 style={{ background: "#f7faf8", color: "#4a6260", borderLeft: "3px solid #4e8c6a" }}
//                             >
//                                 {session.progressNotes || <span style={{ color: "#b0c8bc" }}>No notes yet.</span>}
//                             </div>
//                         )}
//                     </div>

//                     {/* Action buttons */}
//                     <div className="flex items-center justify-between pt-1">
//                         <div className="text-[11px]" style={{ color: "#b0c8bc" }}>
//                             Sessions: {session.employee.sessionsUsed} used
//                             {session.employee.sessionsRemaining !== null
//                                 ? `, ${session.employee.sessionsRemaining} remaining`
//                                 : ""}
//                         </div>
//                         {!editing ? (
//                             <button
//                                 onClick={() => setEditing(true)}
//                                 className="flex items-center gap-1.5 text-[12px] px-3 py-2 rounded-xl border"
//                                 style={{ borderColor: "#ddeae2", color: "#4e8c6a" }}
//                             >
//                                 <Edit2 size={12} /> Edit
//                             </button>
//                         ) : (
//                             <div className="flex gap-2">
//                                 <button
//                                     onClick={() => { setEditing(false); setNotes(session.progressNotes ?? ""); setStatus(session.status); setDomains(session.domains); }}
//                                     className="text-[12px] px-3 py-2 rounded-xl border"
//                                     style={{ borderColor: "#ddeae2", color: "#7a9088" }}
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     onClick={handleSave}
//                                     disabled={saving}
//                                     className="flex items-center gap-1.5 text-[12px] px-4 py-2 rounded-xl font-medium text-white"
//                                     style={{ background: "#4e8c6a" }}
//                                 >
//                                     {saving ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
//                                     {saving ? "Saving…" : "Save"}
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// // ── Main page ─────────────────────────────────────────────────────────────────

// export default function AdminCompanySessionsPage() {
//     // }: { params: { id: string } }) {
//     const [sessions, setSessions] = useState<EAPSession[]>([]);
//     const [employees, setEmployees] = useState<Employee[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [showBookModal, setShowBookModal] = useState(false);
//     const [filterStatus, setFilterStatus] = useState("all");
//     const [analytics, setAnalytics] = useState<{
//         total: number; upcoming: number;
//         statusCounts: Record<string, number>;
//     } | null>(null);
//     const params = useParams();
//     const load = useCallback(async () => {
//         setLoading(true);
//         try {
//             const [sessRes, empRes] = await Promise.all([
//                 fetch(`/api/admin/companies/${params.id}/sessions?limit=100`),
//                 fetch(`/api/admin/companies/${params.id}`),
//             ]);
//             const [sessData, empData] = await Promise.all([sessRes.json(), empRes.json()]);
//             if (sessData.success) {
//                 setSessions(sessData.sessions);
//                 setAnalytics(sessData.analytics);
//             }
//             if (empData.success) {
//                 setEmployees(empData.company.employees ?? []);
//             }
//         } finally {
//             setLoading(false);
//         }
//     }, [params.id]);

//     useEffect(() => { load(); }, [load]);

//     const handleSessionUpdated = (updated: EAPSession) => {
//         setSessions((prev) => prev.map((s) => s.id === updated.id ? updated : s));
//     };

//     const filtered = filterStatus === "all"
//         ? sessions
//         : sessions.filter((s) => s.status === filterStatus);

//     return (
//         <div className="flex flex-col gap-4 sm:gap-5 max-w-5xl pb-8">
//             {showBookModal && (
//                 <BookSessionModal
//                     companyId={params.id as string}
//                     employees={employees}
//                     onClose={() => setShowBookModal(false)}
//                     onBooked={(s) => { setSessions((prev) => [s, ...prev]); }}
//                 />
//             )}

//             {/* Back */}
//             <Link href={`/admin/companies/${params.id}`}
//                 className="flex items-center gap-1 text-[12px] w-fit hover:underline"
//                 style={{ color: "#7a9088" }}>
//                 <ChevronLeft size={13} /> Back to Company
//             </Link>

//             {/* Header */}
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//                 <div>
//                     <h1 className="text-[18px] sm:text-[20px] font-bold" style={{ color: "#1c3a3a" }}>
//                         EAP Sessions
//                     </h1>
//                     <p className="text-[12px] mt-0.5" style={{ color: "#7a9088" }}>
//                         Schedule, track, and document all therapy sessions for this company.
//                     </p>
//                 </div>
//                 <button
//                     onClick={() => setShowBookModal(true)}
//                     className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium text-white self-start sm:self-auto"
//                     style={{ background: "linear-gradient(135deg, #4e8c6a, #3d8b8b)" }}
//                 >
//                     <Plus size={14} /> Schedule Session
//                 </button>
//             </div>

//             {/* Stats */}
//             {analytics && (
//                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
//                     {[
//                         { label: "Total sessions", value: analytics.total },
//                         { label: "Upcoming", value: analytics.upcoming },
//                         { label: "Completed", value: analytics.statusCounts.completed ?? 0 },
//                         { label: "No-shows", value: analytics.statusCounts["no-show"] ?? 0 },
//                     ].map((k) => (
//                         <div key={k.label} className="bg-white rounded-2xl border p-4" style={{ borderColor: "#e4eee8" }}>
//                             <div className="text-[22px] font-bold mb-0.5" style={{ fontFamily: "Georgia", color: "#1c3a3a" }}>
//                                 {k.value}
//                             </div>
//                             <div className="text-[10px] uppercase tracking-widest" style={{ color: "#b0c8bc" }}>
//                                 {k.label}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {/* Filters */}
//             <div className="flex flex-wrap gap-1.5">
//                 {["all", "scheduled", "completed", "no-show", "cancelled"].map((s) => (
//                     <button
//                         key={s}
//                         onClick={() => setFilterStatus(s)}
//                         className="px-3 py-2 rounded-xl text-[11px] border capitalize transition-all"
//                         style={{
//                             background: filterStatus === s ? `${STATUS_COLORS[s]?.bg ?? "rgba(61,139,139,0.1)"}` : "white",
//                             borderColor: filterStatus === s ? (STATUS_COLORS[s]?.text ?? "#3d8b8b") : "#ddeae2",
//                             color: filterStatus === s ? (STATUS_COLORS[s]?.text ?? "#3d8b8b") : "#7a9088",
//                         }}
//                     >
//                         {s === "all" ? "All" : STATUS_COLORS[s]?.label ?? s}
//                         {s !== "all" && analytics?.statusCounts[s]
//                             ? ` (${analytics.statusCounts[s]})`
//                             : ""}
//                     </button>
//                 ))}
//             </div>

//             {/* Sessions list */}
//             {loading ? (
//                 <div className="space-y-3">
//                     {Array.from({ length: 3 }).map((_, i) => (
//                         <div key={i} className="animate-pulse rounded-2xl h-20 bg-[#e8f0ec]" />
//                     ))}
//                 </div>
//             ) : filtered.length === 0 ? (
//                 <div className="text-center py-16 text-[13px]" style={{ color: "#7a9088" }}>
//                     {sessions.length === 0
//                         ? "No sessions scheduled yet. Click 'Schedule Session' to create the first one."
//                         : "No sessions match this filter."}
//                 </div>
//             ) : (
//                 filtered.map((s) => (
//                     <SessionRow
//                         key={s.id}
//                         session={s}
//                         companyId={params.id as string}
//                         onUpdated={handleSessionUpdated}
//                     />
//                 ))
//             )}
//         </div>
//     );
// }

"use client";

// app/admin/companies/[id]/sessions/page.tsx
// Admin session management for a specific EAP company.
// Schedule sessions, mark complete, log therapist notes, track mood ratings.
// This is what populates the EAPSession table.

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
    ChevronLeft, Plus, Calendar, CheckCircle, X,
    Clock, Video, Phone, Users, Edit2, Save,
    RefreshCw, AlertTriangle, Loader2, ChevronDown,
    Mail, MessageCircle, Info,
} from "lucide-react";
import { useParams } from "next/navigation";

// ── Types ─────────────────────────────────────────────────────────────────────

interface EAPSession {
    id: string;
    scheduledAt: string;
    conductedAt: string | null;
    durationMin: number;
    therapist: string;
    type: string;
    modality: string;
    status: string;
    moodPre: number | null;
    moodPost: number | null;
    progressNotes: string | null;
    domains: string[];
    employee: {
        id: string;
        name: string | null;
        email: string | null;         // ← NEW
        phone: string | null;         // ← NEW
        department: string | null;
        anonymous: boolean;
        riskBand: string | null;
        sessionsUsed: number;
        sessionsRemaining: number | null;
    };
}

interface Employee {
    id: string;
    name: string | null;
    email: string | null;             // ← NEW
    phone: string | null;             // ← NEW
    department: string | null;
    anonymous: boolean;
    riskBand: string | null;
    sessionsUsed: number;
    sessionsRemaining: number | null;
}

const BAND_COLORS: Record<string, string> = {
    Low: "#4e8c6a",
    Mild: "#3d8b8b",
    Moderate: "#8b6e3d",
    High: "#b94a4f",
    Critical: "#8b1a1a",
};

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
    scheduled: { bg: "rgba(61,139,139,0.1)", text: "#3d8b8b", label: "Scheduled" },
    completed: { bg: "rgba(78,140,106,0.1)", text: "#4e8c6a", label: "Completed" },
    cancelled: { bg: "rgba(185,74,79,0.1)", text: "#b94a4f", label: "Cancelled" },
    "no-show": { bg: "rgba(139,110,61,0.1)", text: "#8b6e3d", label: "No-show" },
    rescheduled: { bg: "rgba(110,78,139,0.1)", text: "#6e4e8b", label: "Rescheduled" },
};

const TYPE_LABELS: Record<string, string> = {
    individual: "Individual", couples: "Couples", group: "Group",
    coaching: "Coaching", crisis: "Crisis",
};

const MODALITY_ICONS: Record<string, React.ElementType> = {
    video: Video, phone: Phone, "in-person": Users,
};

const DOMAINS_ALL = ["Stress", "Anxiety", "Depression", "Burnout", "Sleep", "Relationships", "Self-esteem"];

// ── Shared: WhatsApp icon ─────────────────────────────────────────────────────

function WhatsAppIcon({ size = 13, color = "#1a8a40" }: { size?: number; color?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.138.562 4.139 1.534 5.876L.057 23.57a.5.5 0 00.611.633l5.882-1.544A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-1.91 0-3.697-.519-5.228-1.424l-.37-.22-3.865 1.016 1.027-3.765-.241-.385A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
        </svg>
    );
}

// ── Employee contact preview (used inside the modal) ──────────────────────────

function EmployeeContactPreview({ employee }: { employee: Employee }) {
    if (employee.anonymous) {
        return (
            <div
                className="flex items-start gap-2 p-3 rounded-xl"
                style={{ background: "rgba(139,110,61,0.05)", border: "1px solid rgba(139,110,61,0.15)" }}
            >
                <Info size={13} style={{ color: "#8b6e3d", flexShrink: 0, marginTop: 1 }} />
                <p className="text-[11px]" style={{ color: "#6a5228" }}>
                    Anonymous employee — contact through HR only. No personal details stored.
                </p>
            </div>
        );
    }

    const bandColor = BAND_COLORS[employee.riskBand ?? "Mild"] ?? "#8da898";
    const waNumber = employee.phone ? employee.phone.replace(/[\s\-().]/g, "") : null;

    return (
        <div
            className="rounded-xl border p-3"
            style={{ background: "#f9fdfb", borderColor: "#ddeae2" }}
        >
            {/* Employee summary row */}
            <div className="flex items-center gap-2.5 mb-2.5">
                <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                    style={{ background: bandColor }}
                >
                    {employee.name?.charAt(0) ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[13px] font-semibold" style={{ color: "#1c3a3a" }}>
                            {employee.name ?? "Unnamed"}
                        </span>
                        {employee.riskBand && (
                            <span
                                className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                                style={{ background: `${bandColor}18`, color: bandColor }}
                            >
                                {employee.riskBand}
                            </span>
                        )}
                    </div>
                    <div className="text-[11px]" style={{ color: "#7a9088" }}>
                        {employee.department ?? "No department"} ·{" "}
                        {employee.sessionsUsed} used
                        {employee.sessionsRemaining !== null ? `, ${employee.sessionsRemaining} remaining` : ""}
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px mb-2.5" style={{ background: "#e4eee8" }} />

            {/* Contact links */}
            <div className="flex flex-col gap-1.5">
                {employee.email && (
                    <a
                        href={`mailto:${employee.email}`}
                        className="flex items-center gap-2 text-[12px] hover:underline"
                        style={{ color: "#185fa5", textDecoration: "none" }}
                    >
                        <div
                            className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                            style={{ background: "rgba(55,138,221,0.1)" }}
                        >
                            <Mail size={11} style={{ color: "#185fa5" }} />
                        </div>
                        {employee.email}
                    </a>
                )}
                {employee.phone && (
                    <div className="flex items-center gap-2">
                        <a
                            href={`tel:${employee.phone}`}
                            className="flex items-center gap-2 text-[12px] hover:underline flex-1"
                            style={{ color: "#4e8c6a", textDecoration: "none" }}
                        >
                            <div
                                className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                                style={{ background: "rgba(78,140,106,0.12)" }}
                            >
                                <Phone size={11} style={{ color: "#4e8c6a" }} />
                            </div>
                            {employee.phone}
                        </a>
                        {waNumber && (
                            <a
                                href={`https://wa.me/${waNumber}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg border"
                                style={{ borderColor: "#ddeae2", color: "#1a8a40", textDecoration: "none", background: "rgba(37,211,102,0.06)" }}
                            >
                                <WhatsAppIcon size={11} />
                                WhatsApp
                            </a>
                        )}
                    </div>
                )}
                {!employee.email && !employee.phone && (
                    <p className="text-[11px]" style={{ color: "#b0c8bc" }}>No contact details on file.</p>
                )}
            </div>

            {/* Reach-out nudge */}
            {(employee.email || employee.phone) && (
                <p
                    className="mt-2.5 text-[10px] pt-2"
                    style={{ color: "#7a9088", borderTop: "0.5px solid #e4eee8" }}
                >
                    Contact to confirm availability before scheduling.
                </p>
            )}
        </div>
    );
}

// ── Book Session Modal ─────────────────────────────────────────────────────────

function BookSessionModal({
    companyId,
    employees,
    onClose,
    onBooked,
}: {
    companyId: string;
    employees: Employee[];
    onClose: () => void;
    onBooked: (session: EAPSession) => void;
}) {
    const [form, setForm] = useState({
        employeeId: "",
        scheduledAt: "",
        therapist: "",
        type: "individual",
        modality: "video",
        durationMin: 50,
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const set = (k: string, v: string | number) =>
        setForm((f) => ({ ...f, [k]: v }));

    // Derive selected employee object for the contact preview
    const selectedEmployee = employees.find((e) => e.id === form.employeeId) ?? null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.employeeId || !form.scheduledAt || !form.therapist) {
            setError("Employee, date/time, and therapist are required.");
            return;
        }
        setSubmitting(true);
        setError("");
        try {
            const res = await fetch(
                `/api/admin/companies/${companyId}/sessions`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                },
            );
            const data = await res.json();
            if (!res.ok || !data.success) {
                setError(data.error ?? "Failed to schedule session.");
                return;
            }
            onBooked(data.session);
            onClose();
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center px-0 sm:px-4"
            style={{ background: "rgba(0,0,0,0.35)" }}
        >
            <div
                className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl overflow-hidden flex flex-col"
                style={{ maxHeight: "92vh" }}
            >
                <div
                    className="flex items-center justify-between px-5 py-4 border-b"
                    style={{ borderColor: "#e4eee8" }}
                >
                    <h2 className="text-[15px] font-semibold" style={{ color: "#1c3a3a" }}>
                        Schedule EAP Session
                    </h2>
                    <button
                        onClick={onClose}
                        style={{ color: "#7a9088", background: "none", border: "none", cursor: "pointer" }}
                    >
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4 overflow-y-auto flex-1">
                    {/* Employee selector */}
                    <div>
                        <label className="block text-[11px] font-medium mb-1.5" style={{ color: "#1c3a3a" }}>
                            Employee *
                        </label>
                        <select
                            value={form.employeeId}
                            onChange={(e) => set("employeeId", e.target.value)}
                            className="w-full text-[12px] px-3 py-2.5 rounded-xl border outline-none"
                            style={{ borderColor: "#ddeae2", color: "#1c3a3a" }}
                            required
                        >
                            <option value="">Select employee…</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.anonymous
                                        ? `Anonymous — ${emp.department ?? "Unknown dept"}`
                                        : `${emp.name ?? "Unnamed"} (${emp.department ?? "No dept"})`}
                                    {" "}· {emp.sessionsUsed} used
                                    {emp.sessionsRemaining !== null ? `, ${emp.sessionsRemaining} remaining` : ""}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* ── Contact preview: appears as soon as an employee is selected ── */}
                    {selectedEmployee && (
                        <EmployeeContactPreview employee={selectedEmployee} />
                    )}

                    {/* Date/time */}
                    <div>
                        <label className="block text-[11px] font-medium mb-1.5" style={{ color: "#1c3a3a" }}>
                            Date & Time *
                        </label>
                        <input
                            type="datetime-local"
                            value={form.scheduledAt}
                            onChange={(e) => set("scheduledAt", e.target.value)}
                            className="w-full text-[12px] px-3 py-2.5 rounded-xl border outline-none"
                            style={{ borderColor: "#ddeae2", color: "#1c3a3a" }}
                            required
                        />
                    </div>

                    {/* Therapist */}
                    <div>
                        <label className="block text-[11px] font-medium mb-1.5" style={{ color: "#1c3a3a" }}>
                            Therapist *
                        </label>
                        <input
                            type="text"
                            value={form.therapist}
                            onChange={(e) => set("therapist", e.target.value)}
                            placeholder="Dr. Kemi Adeyemi"
                            className="w-full text-[12px] px-3 py-2.5 rounded-xl border outline-none"
                            style={{ borderColor: "#ddeae2", color: "#1c3a3a" }}
                            required
                        />
                    </div>

                    {/* Type + Modality */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-medium mb-1.5" style={{ color: "#1c3a3a" }}>
                                Type
                            </label>
                            <select
                                value={form.type}
                                onChange={(e) => set("type", e.target.value)}
                                className="w-full text-[12px] px-3 py-2.5 rounded-xl border outline-none"
                                style={{ borderColor: "#ddeae2", color: "#1c3a3a" }}
                            >
                                {Object.entries(TYPE_LABELS).map(([v, l]) => (
                                    <option key={v} value={v}>{l}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[11px] font-medium mb-1.5" style={{ color: "#1c3a3a" }}>
                                Modality
                            </label>
                            <select
                                value={form.modality}
                                onChange={(e) => set("modality", e.target.value)}
                                className="w-full text-[12px] px-3 py-2.5 rounded-xl border outline-none"
                                style={{ borderColor: "#ddeae2", color: "#1c3a3a" }}
                            >
                                <option value="video">Video call</option>
                                <option value="phone">Phone</option>
                                <option value="in-person">In-person</option>
                            </select>
                        </div>
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-[11px] font-medium mb-1.5" style={{ color: "#1c3a3a" }}>
                            Duration (minutes)
                        </label>
                        <select
                            value={form.durationMin}
                            onChange={(e) => set("durationMin", parseInt(e.target.value))}
                            className="w-full text-[12px] px-3 py-2.5 rounded-xl border outline-none"
                            style={{ borderColor: "#ddeae2", color: "#1c3a3a" }}
                        >
                            {[30, 45, 50, 60, 90].map((d) => (
                                <option key={d} value={d}>{d} minutes</option>
                            ))}
                        </select>
                    </div>

                    {error && <p className="text-[12px]" style={{ color: "#b94a4f" }}>{error}</p>}
                </form>

                <div
                    className="flex items-center justify-between px-5 py-4 border-t"
                    style={{ borderColor: "#e4eee8" }}
                >
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-[12px] border"
                        style={{ borderColor: "#ddeae2", color: "#7a9088" }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit as unknown as React.MouseEventHandler}
                        disabled={submitting}
                        className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-[12px] font-medium text-white disabled:opacity-40"
                        style={{ background: "linear-gradient(135deg, #4e8c6a, #3d8b8b)" }}
                    >
                        {submitting && <Loader2 size={12} className="animate-spin" />}
                        {submitting ? "Scheduling…" : "Schedule Session"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Session row ────────────────────────────────────────────────────────────────

function SessionRow({
    session,
    companyId,
    onUpdated,
}: {
    session: EAPSession;
    companyId: string;
    onUpdated: (updated: EAPSession) => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [notes, setNotes] = useState(session.progressNotes ?? "");
    const [status, setStatus] = useState(session.status);
    const [domains, setDomains] = useState<string[]>(session.domains);
    const [moodPre, setMoodPre] = useState<number | "">(session.moodPre ?? "");
    const [moodPost, setMoodPost] = useState<number | "">(session.moodPost ?? "");

    const statusInfo = STATUS_COLORS[session.status] ?? STATUS_COLORS.scheduled;
    const ModalityIcon = MODALITY_ICONS[session.modality] ?? Video;
    const scheduledDate = new Date(session.scheduledAt);

    const waNumber = session.employee.phone
        ? session.employee.phone.replace(/[\s\-().]/g, "")
        : null;

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/companies/${companyId}/sessions`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId: session.id,
                    status,
                    progressNotes: notes,
                    domains,
                    moodPre: moodPre !== "" ? Number(moodPre) : undefined,
                    moodPost: moodPost !== "" ? Number(moodPost) : undefined,
                    conductedAt: status === "completed" && !session.conductedAt
                        ? new Date().toISOString()
                        : undefined,
                }),
            });
            const data = await res.json();
            if (data.success) {
                onUpdated(data.session);
                setEditing(false);
            }
        } finally {
            setSaving(false);
        }
    };

    const toggleDomain = (d: string) =>
        setDomains((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);

    return (
        <div className="bg-white rounded-2xl border mb-3 overflow-hidden" style={{ borderColor: "#e4eee8" }}>
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4">
                {/* Employee */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                        style={{ background: "linear-gradient(135deg, #4e8c6a, #3d8b8b)" }}
                    >
                        {session.employee.anonymous ? "A" : (session.employee.name?.charAt(0) ?? "?")}
                    </div>
                    <div className="min-w-0">
                        <div className="text-[13px] font-semibold truncate" style={{ color: "#1c3a3a" }}>
                            {session.employee.anonymous
                                ? `Anonymous — ${session.employee.department ?? "Unknown dept"}`
                                : (session.employee.name ?? "Unnamed employee")}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-[11px]" style={{ color: "#7a9088" }}>
                            <span>{session.therapist} · {TYPE_LABELS[session.type] ?? session.type}</span>
                            {/* Inline contact shortcuts in the row header */}
                            {!session.employee.anonymous && session.employee.email && (
                                <a
                                    href={`mailto:${session.employee.email}`}
                                    className="flex items-center gap-1 hover:underline"
                                    style={{ color: "#3d8b8b", textDecoration: "none" }}
                                    title={session.employee.email}
                                >
                                    <Mail size={10} />
                                    <span className="hidden md:inline">{session.employee.email}</span>
                                    <span className="md:hidden">Email</span>
                                </a>
                            )}
                            {!session.employee.anonymous && session.employee.phone && (
                                <a
                                    href={`tel:${session.employee.phone}`}
                                    className="flex items-center gap-1 hover:underline"
                                    style={{ color: "#4e8c6a", textDecoration: "none" }}
                                >
                                    <Phone size={10} />
                                    {session.employee.phone}
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Date + modality + status */}
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "#7a9088" }}>
                        <Calendar size={12} />
                        {scheduledDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "#7a9088" }}>
                        <Clock size={12} />
                        {scheduledDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                    <div className="flex items-center gap-1 text-[11px]" style={{ color: "#7a9088" }}>
                        <ModalityIcon size={12} />
                        {session.modality}
                    </div>
                    <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: statusInfo.bg, color: statusInfo.text }}
                    >
                        {statusInfo.label}
                    </span>
                    {session.moodPost !== null && (
                        <span
                            className="text-[10px] px-2 py-0.5 rounded-full"
                            style={{ background: "rgba(78,140,106,0.1)", color: "#4e8c6a" }}
                        >
                            Mood {session.moodPost}/10
                        </span>
                    )}
                    <button
                        onClick={() => setExpanded((e) => !e)}
                        className="p-1.5 rounded-lg border"
                        style={{ borderColor: "#ddeae2", color: "#7a9088" }}
                    >
                        <ChevronDown
                            size={13}
                            style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
                        />
                    </button>
                </div>
            </div>

            {/* Expanded details */}
            {expanded && (
                <div className="border-t px-4 py-4 space-y-4" style={{ borderColor: "#f0f7f3" }}>

                    {/* ── Contact section ── */}
                    {!session.employee.anonymous && (session.employee.email || session.employee.phone) && (
                        <div>
                            <p
                                className="text-[11px] font-semibold uppercase tracking-widest mb-2.5"
                                style={{ color: "#7a9088" }}
                            >
                                Contact employee
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {session.employee.email && (
                                    <a
                                        href={`mailto:${session.employee.email}`}
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl border transition-all"
                                        style={{ borderColor: "#ddeae2", background: "#f9fdfb", textDecoration: "none" }}
                                    >
                                        <div
                                            className="w-6 h-6 rounded-lg flex items-center justify-center"
                                            style={{ background: "rgba(55,138,221,0.1)" }}
                                        >
                                            <Mail size={12} style={{ color: "#185fa5" }} />
                                        </div>
                                        <div>
                                            <span className="block text-[9px] uppercase tracking-wider" style={{ color: "#b0c8bc" }}>Email</span>
                                            <span className="block text-[12px] font-medium" style={{ color: "#1c3a3a" }}>{session.employee.email}</span>
                                        </div>
                                    </a>
                                )}
                                {session.employee.phone && (
                                    <a
                                        href={`tel:${session.employee.phone}`}
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl border transition-all"
                                        style={{ borderColor: "#ddeae2", background: "#f9fdfb", textDecoration: "none" }}
                                    >
                                        <div
                                            className="w-6 h-6 rounded-lg flex items-center justify-center"
                                            style={{ background: "rgba(78,140,106,0.12)" }}
                                        >
                                            <Phone size={12} style={{ color: "#4e8c6a" }} />
                                        </div>
                                        <div>
                                            <span className="block text-[9px] uppercase tracking-wider" style={{ color: "#b0c8bc" }}>Phone</span>
                                            <span className="block text-[12px] font-medium" style={{ color: "#1c3a3a" }}>{session.employee.phone}</span>
                                        </div>
                                    </a>
                                )}
                                {waNumber && (
                                    <a
                                        href={`https://wa.me/${waNumber}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl border transition-all"
                                        style={{ borderColor: "#ddeae2", background: "#f9fdfb", textDecoration: "none" }}
                                    >
                                        <div
                                            className="w-6 h-6 rounded-lg flex items-center justify-center"
                                            style={{ background: "rgba(37,211,102,0.1)" }}
                                        >
                                            <WhatsAppIcon size={12} />
                                        </div>
                                        <div>
                                            <span className="block text-[9px] uppercase tracking-wider" style={{ color: "#b0c8bc" }}>WhatsApp</span>
                                            <span className="block text-[12px] font-medium" style={{ color: "#1c3a3a" }}>Message directly</span>
                                        </div>
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Status buttons */}
                    <div className="flex flex-wrap gap-2">
                        {["scheduled", "completed", "no-show", "cancelled", "rescheduled"].map((s) => (
                            <button
                                key={s}
                                onClick={() => { if (editing) setStatus(s); }}
                                disabled={!editing}
                                className="px-2.5 py-1.5 rounded-xl text-[11px] font-medium border transition-all disabled:opacity-50"
                                style={{
                                    background: (editing ? status : session.status) === s
                                        ? `${STATUS_COLORS[s]?.bg ?? "rgba(61,139,139,0.1)"}`
                                        : "white",
                                    borderColor: (editing ? status : session.status) === s
                                        ? (STATUS_COLORS[s]?.text ?? "#3d8b8b")
                                        : "#ddeae2",
                                    color: (editing ? status : session.status) === s
                                        ? (STATUS_COLORS[s]?.text ?? "#3d8b8b")
                                        : "#7a9088",
                                }}
                            >
                                {STATUS_COLORS[s]?.label ?? s}
                            </button>
                        ))}
                    </div>

                    {/* Mood ratings */}
                    {editing && (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] font-medium mb-1" style={{ color: "#1c3a3a" }}>
                                    Mood before session (1–10)
                                </label>
                                <input
                                    type="number" min={1} max={10}
                                    value={moodPre}
                                    onChange={(e) => setMoodPre(e.target.value === "" ? "" : Math.max(1, Math.min(10, parseInt(e.target.value))))}
                                    className="w-full text-[12px] px-3 py-2 rounded-xl border outline-none"
                                    style={{ borderColor: "#ddeae2", color: "#1c3a3a" }}
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-medium mb-1" style={{ color: "#1c3a3a" }}>
                                    Mood after session (1–10)
                                </label>
                                <input
                                    type="number" min={1} max={10}
                                    value={moodPost}
                                    onChange={(e) => setMoodPost(e.target.value === "" ? "" : Math.max(1, Math.min(10, parseInt(e.target.value))))}
                                    className="w-full text-[12px] px-3 py-2 rounded-xl border outline-none"
                                    style={{ borderColor: "#ddeae2", color: "#1c3a3a" }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Domains addressed */}
                    <div>
                        <p className="text-[11px] font-medium mb-2" style={{ color: "#7a9088" }}>
                            Domains addressed
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {DOMAINS_ALL.map((d) => {
                                const active = (editing ? domains : session.domains).includes(d);
                                return (
                                    <button
                                        key={d}
                                        onClick={() => { if (editing) toggleDomain(d); }}
                                        disabled={!editing}
                                        className="px-2.5 py-1 rounded-full text-[11px] border transition-all disabled:cursor-default"
                                        style={{
                                            background: active ? "rgba(78,140,106,0.1)" : "white",
                                            borderColor: active ? "#4e8c6a" : "#ddeae2",
                                            color: active ? "#4e8c6a" : "#b0c8bc",
                                        }}
                                    >
                                        {d}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Progress notes */}
                    <div>
                        <p className="text-[11px] font-medium mb-1.5" style={{ color: "#7a9088" }}>
                            Therapist / progress notes{" "}
                            <span style={{ color: "#b0c8bc" }}>(admin only — never shown to HR)</span>
                        </p>
                        {editing ? (
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={4}
                                placeholder="Session focus, techniques used, homework assigned, next session plan…"
                                className="w-full text-[12px] px-3 py-2.5 rounded-xl border outline-none resize-y"
                                style={{ borderColor: "#ddeae2", color: "#1c3a3a", background: "#f9fdfb" }}
                            />
                        ) : (
                            <div
                                className="rounded-xl px-3 py-2.5 text-[12px] font-light leading-relaxed"
                                style={{ background: "#f7faf8", color: "#4a6260", borderLeft: "3px solid #4e8c6a" }}
                            >
                                {session.progressNotes || <span style={{ color: "#b0c8bc" }}>No notes yet.</span>}
                            </div>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-1">
                        <div className="text-[11px]" style={{ color: "#b0c8bc" }}>
                            Sessions: {session.employee.sessionsUsed} used
                            {session.employee.sessionsRemaining !== null
                                ? `, ${session.employee.sessionsRemaining} remaining`
                                : ""}
                        </div>
                        {!editing ? (
                            <button
                                onClick={() => setEditing(true)}
                                className="flex items-center gap-1.5 text-[12px] px-3 py-2 rounded-xl border"
                                style={{ borderColor: "#ddeae2", color: "#4e8c6a" }}
                            >
                                <Edit2 size={12} /> Edit
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setEditing(false);
                                        setNotes(session.progressNotes ?? "");
                                        setStatus(session.status);
                                        setDomains(session.domains);
                                    }}
                                    className="text-[12px] px-3 py-2 rounded-xl border"
                                    style={{ borderColor: "#ddeae2", color: "#7a9088" }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-1.5 text-[12px] px-4 py-2 rounded-xl font-medium text-white"
                                    style={{ background: "#4e8c6a" }}
                                >
                                    {saving ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
                                    {saving ? "Saving…" : "Save"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AdminCompanySessionsPage() {
    const [sessions, setSessions] = useState<EAPSession[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [showBookModal, setShowBookModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all");
    const [analytics, setAnalytics] = useState<{
        total: number;
        upcoming: number;
        statusCounts: Record<string, number>;
    } | null>(null);
    const params = useParams();

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [sessRes, empRes] = await Promise.all([
                fetch(`/api/admin/companies/${params.id}/sessions?limit=100`),
                fetch(`/api/admin/companies/${params.id}`),
            ]);
            const [sessData, empData] = await Promise.all([sessRes.json(), empRes.json()]);
            if (sessData.success) {
                setSessions(sessData.sessions);
                setAnalytics(sessData.analytics);
            }
            if (empData.success) {
                setEmployees(empData.company.employees ?? []);
            }
        } finally {
            setLoading(false);
        }
    }, [params.id]);

    useEffect(() => { load(); }, [load]);

    const handleSessionUpdated = (updated: EAPSession) => {
        setSessions((prev) => prev.map((s) => s.id === updated.id ? updated : s));
    };

    const filtered = filterStatus === "all"
        ? sessions
        : sessions.filter((s) => s.status === filterStatus);

    return (
        <div className="flex flex-col gap-4 sm:gap-5 pb-8">
            {showBookModal && (
                <BookSessionModal
                    companyId={params.id as string}
                    employees={employees}
                    onClose={() => setShowBookModal(false)}
                    onBooked={(s) => { setSessions((prev) => [s, ...prev]); }}
                />
            )}

            {/* Back */}
            <Link
                href={`/admin/companies/${params.id}`}
                className="flex items-center gap-1 text-[12px] w-fit hover:underline"
                style={{ color: "#7a9088" }}
            >
                <ChevronLeft size={13} /> Back to Company
            </Link>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-[18px] sm:text-[20px] font-bold" style={{ color: "#1c3a3a" }}>
                        EAP Sessions
                    </h1>
                    <p className="text-[12px] mt-0.5" style={{ color: "#7a9088" }}>
                        Schedule, track, and document all therapy sessions for this company.
                    </p>
                </div>
                <button
                    onClick={() => setShowBookModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium text-white self-start sm:self-auto"
                    style={{ background: "linear-gradient(135deg, #4e8c6a, #3d8b8b)" }}
                >
                    <Plus size={14} /> Schedule Session
                </button>
            </div>

            {/* Stats */}
            {analytics && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                    {[
                        { label: "Total sessions", value: analytics.total },
                        { label: "Upcoming", value: analytics.upcoming },
                        { label: "Completed", value: analytics.statusCounts.completed ?? 0 },
                        { label: "No-shows", value: analytics.statusCounts["no-show"] ?? 0 },
                    ].map((k) => (
                        <div key={k.label} className="bg-white rounded-2xl border p-4" style={{ borderColor: "#e4eee8" }}>
                            <div
                                className="text-[22px] font-bold mb-0.5"
                                style={{ fontFamily: "Georgia", color: "#1c3a3a" }}
                            >
                                {k.value}
                            </div>
                            <div className="text-[10px] uppercase tracking-widest" style={{ color: "#b0c8bc" }}>
                                {k.label}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-1.5">
                {["all", "scheduled", "completed", "no-show", "cancelled"].map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        className="px-3 py-2 rounded-xl text-[11px] border capitalize transition-all"
                        style={{
                            background: filterStatus === s ? `${STATUS_COLORS[s]?.bg ?? "rgba(61,139,139,0.1)"}` : "white",
                            borderColor: filterStatus === s ? (STATUS_COLORS[s]?.text ?? "#3d8b8b") : "#ddeae2",
                            color: filterStatus === s ? (STATUS_COLORS[s]?.text ?? "#3d8b8b") : "#7a9088",
                        }}
                    >
                        {s === "all" ? "All" : STATUS_COLORS[s]?.label ?? s}
                        {s !== "all" && analytics?.statusCounts[s]
                            ? ` (${analytics.statusCounts[s]})`
                            : ""}
                    </button>
                ))}
            </div>

            {/* Sessions list */}
            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="animate-pulse rounded-2xl h-20 bg-[#e8f0ec]" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-[13px]" style={{ color: "#7a9088" }}>
                    {sessions.length === 0
                        ? "No sessions scheduled yet. Click 'Schedule Session' to create the first one."
                        : "No sessions match this filter."}
                </div>
            ) : (
                filtered.map((s) => (
                    <SessionRow
                        key={s.id}
                        session={s}
                        companyId={params.id as string}
                        onUpdated={handleSessionUpdated}
                    />
                ))
            )}
        </div>
    );
}