

// "use client";

// // app/admin/companies/[id]/page.tsx — Production version
// // Full employee progress with EDITABLE domain scores.
// // Admin reduces anxiety/depression/burnout scores after therapy sessions.
// // This triggers recomputation → employee.overallScore updates → HR charts improve.

// import { useState, useEffect, useCallback } from "react";
// import Link from "next/link";
// import {
//     ChevronLeft, Users, Shield, CheckCircle, AlertTriangle,
//     Edit2, Save, X, ChevronDown, ChevronUp, RefreshCw,
//     TrendingDown, TrendingUp, Info,
// } from "lucide-react";
// import { useParams } from "next/navigation";

// // ── Types ─────────────────────────────────────────────────────────────────────

// interface DomainScores {
//     stressScore: number;
//     anxietyScore: number;
//     depressionScore: number;
//     burnoutScore: number;
//     sleepScore: number;
//     relationshipScore: number | null;
//     selfEsteemScore: number;
//     totalScore: number;
//     riskBand: string;
// }

// interface AssessmentHistory {
//     id: string;
//     createdAt: string;
//     totalScore: number;
//     riskBand: string;
// }

// interface Employee {
//     id: string;
//     name: string | null;
//     department: string | null;
//     anonymous: boolean;
//     enrolledAt: string;
//     riskBand: string | null;
//     overallScore: number | null;
//     improvementPct: number | null;
//     sessionsUsed: number;
//     sessionsRemaining: number | null;
//     lastAssessmentAt: string | null;
//     assessments: (AssessmentHistory & DomainScores & { therapistNotes?: string; flags: string[] })[];
// }

// interface CompanyDetail {
//     id: string; name: string; industry: string; plan: string;
//     planSeats: number; sessionCap: number; accessCode: string;
//     hrEmail: string; contactName: string; contactEmail: string;
//     status: string; planRenewAt: string;
//     employees: Employee[];
// }

// const BAND_COLORS: Record<string, string> = {
//     Low: "#4e8c6a", Mild: "#3d8b8b", Moderate: "#8b6e3d", High: "#b94a4f", Critical: "#8b1a1a",
// };

// const DOMAINS = [
//     { key: "stressScore", label: "Stress" },
//     { key: "anxietyScore", label: "Anxiety" },
//     { key: "depressionScore", label: "Depression / Low Mood" },
//     { key: "burnoutScore", label: "Work Burnout" },
//     { key: "sleepScore", label: "Sleep Quality" },
//     { key: "selfEsteemScore", label: "Self-Esteem" },
//     { key: "relationshipScore", label: "Relationships" },
// ] as const;

// // ── Score Editor ─────────────────────────────────────────────────────────────

// function ScoreSlider({
//     label, value, onChange, disabled,
// }: { label: string; value: number | null; onChange: (v: number) => void; disabled: boolean }) {
//     if (value === null) return (
//         <div className="opacity-40">
//             <div className="flex justify-between mb-1">
//                 <span className="text-[11px]" style={{ color: "#7a9088" }}>{label}</span>
//                 <span className="text-[11px]" style={{ color: "#b0c8bc" }}>N/A</span>
//             </div>
//         </div>
//     );

//     const level = value < 30 ? "Low" : value < 50 ? "Mild" : value < 70 ? "Moderate" : "High";
//     const color = BAND_COLORS[level];

//     return (
//         <div>
//             <div className="flex items-center justify-between mb-1.5">
//                 <span className="text-[11px] font-medium" style={{ color: "#1c3a3a" }}>{label}</span>
//                 <div className="flex items-center gap-1.5">
//                     <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
//                         style={{ background: `${color}18`, color }}>{level}</span>
//                     <span className="text-[13px] font-bold w-8 text-right" style={{ color }}>{value}</span>
//                 </div>
//             </div>
//             <input
//                 type="range" min={0} max={100} step={1}
//                 value={value}
//                 onChange={e => onChange(parseInt(e.target.value))}
//                 disabled={disabled}
//                 className="w-full h-2 rounded-full outline-none cursor-pointer disabled:cursor-default"
//                 style={{
//                     appearance: "none",
//                     background: `linear-gradient(to right, ${color} ${value}%, #f0f7f3 ${value}%)`,
//                 }}
//             />
//             <div className="flex justify-between mt-0.5">
//                 <span className="text-[9px]" style={{ color: "#b0c8bc" }}>0 — None</span>
//                 <span className="text-[9px]" style={{ color: "#b0c8bc" }}>100 — Severe</span>
//             </div>
//         </div>
//     );
// }

// // ── Employee Card ────────────────────────────────────────────────────────────

// function EmployeeCard({
//     employee, companyId, onUpdated,
// }: { employee: Employee; companyId: string; onUpdated: (updated: Partial<Employee>) => void }) {
//     const [expanded, setExpanded] = useState(
//         employee.riskBand === "Critical" || employee.riskBand === "High"
//     );
//     const [editing, setEditing] = useState(false);
//     const [saving, setSaving] = useState(false);
//     const [saveError, setSaveError] = useState("");

//     const latest = employee.assessments[0];

//     // Editable scores state (initialised from latest assessment)
//     const [scores, setScores] = useState<DomainScores>({
//         stressScore: latest?.stressScore ?? 0,
//         anxietyScore: latest?.anxietyScore ?? 0,
//         depressionScore: latest?.depressionScore ?? 0,
//         burnoutScore: latest?.burnoutScore ?? 0,
//         sleepScore: latest?.sleepScore ?? 0,
//         relationshipScore: latest?.relationshipScore ?? null,
//         selfEsteemScore: latest?.selfEsteemScore ?? 0,
//         totalScore: latest?.totalScore ?? 0,
//         riskBand: latest?.riskBand ?? "Mild",
//     });
//     const [therapistNotes, setTherapistNotes] = useState(latest?.therapistNotes ?? "");

//     const handleSave = async () => {
//         setSaving(true);
//         setSaveError("");
//         try {
//             const res = await fetch(`/api/admin/companies/${companyId}/score`, {
//                 method: "PATCH",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     employeeId: employee.id,
//                     assessmentId: latest?.id,
//                     stressScore: scores.stressScore,
//                     anxietyScore: scores.anxietyScore,
//                     depressionScore: scores.depressionScore,
//                     burnoutScore: scores.burnoutScore,
//                     sleepScore: scores.sleepScore,
//                     selfEsteemScore: scores.selfEsteemScore,
//                     relationshipScore: scores.relationshipScore,
//                     therapistNotes,
//                     reviewedBy: "admin",
//                 }),
//             });
//             const data = await res.json();
//             if (!res.ok || !data.success) {
//                 setSaveError(data.error ?? "Failed to save.");
//                 return;
//             }
//             // Optimistic UI update
//             onUpdated({
//                 riskBand: data.updated.riskBand,
//                 overallScore: data.updated.totalScore,
//                 improvementPct: data.updated.improvementPct,
//             });
//             setScores(s => ({ ...s, totalScore: data.updated.totalScore, riskBand: data.updated.riskBand }));
//             setEditing(false);
//         } catch {
//             setSaveError("Network error. Please try again.");
//         } finally {
//             setSaving(false);
//         }
//     };

//     const bandColor = BAND_COLORS[scores.riskBand] ?? "#8da898";
//     const improving = (employee.improvementPct ?? 0) > 0;

//     return (
//         <div className="bg-white rounded-2xl border mb-3 overflow-hidden"
//             style={{
//                 borderColor: scores.riskBand === "Critical" ? "rgba(185,74,79,0.4)" : "#e4eee8",
//                 boxShadow: scores.riskBand === "Critical" ? "0 0 0 2px rgba(185,74,79,0.08)" : "none",
//             }}>

//             {/* Header */}
//             <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4">
//                 <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0"
//                     style={{ background: bandColor }}>
//                     {employee.anonymous ? "A" : (employee.name?.charAt(0) ?? "?")}
//                 </div>

//                 <div className="flex-1 min-w-0">
//                     <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
//                         <span className="text-[13px] font-semibold" style={{ color: "#1c3a3a" }}>
//                             {employee.anonymous ? `Anonymous — ${employee.department ?? "Unknown dept"}` : employee.name ?? "Unknown"}
//                         </span>
//                         <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
//                             style={{ background: `${bandColor}18`, color: bandColor }}>
//                             {scores.riskBand}
//                         </span>
//                         {(latest?.flags ?? []).map((f: string) => (
//                             <span key={f} className="text-[10px] px-2 py-0.5 rounded-full"
//                                 style={{ background: "rgba(185,74,79,0.1)", color: "#b94a4f" }}>
//                                 ⚠ {f.replace(/_/g, " ")}
//                             </span>
//                         ))}
//                     </div>
//                     <div className="text-[11px]" style={{ color: "#7a9088" }}>
//                         {employee.department && `${employee.department} · `}
//                         Enrolled {new Date(employee.enrolledAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
//                         {employee.lastAssessmentAt && ` · Last assessed ${new Date(employee.lastAssessmentAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`}
//                     </div>
//                 </div>

//                 {/* Stats */}
//                 <div className="flex items-center gap-4 sm:gap-5 ml-0 sm:ml-auto">
//                     <div className="text-center">
//                         <div className="text-[15px] font-bold" style={{ color: improving ? "#4e8c6a" : employee.improvementPct === 0 ? "#8da898" : "#b94a4f" }}>
//                             {improving ? "▼" : employee.improvementPct === 0 ? "—" : "▲"} {Math.abs(employee.improvementPct ?? 0)}%
//                         </div>
//                         <div className="text-[9px] uppercase tracking-widest" style={{ color: "#b0c8bc" }}>progress</div>
//                     </div>
//                     <div className="text-center">
//                         <div className="text-[15px] font-bold" style={{ color: "#1c3a3a" }}>
//                             {employee.sessionsUsed}/{employee.sessionsRemaining !== null ? employee.sessionsUsed + employee.sessionsRemaining : "—"}
//                         </div>
//                         <div className="text-[9px] uppercase tracking-widest" style={{ color: "#b0c8bc" }}>sessions</div>
//                     </div>
//                     <div className="text-center">
//                         <div className="text-[15px] font-bold" style={{ color: bandColor }}>{scores.totalScore}</div>
//                         <div className="text-[9px] uppercase tracking-widest" style={{ color: "#b0c8bc" }}>score</div>
//                     </div>
//                     <button onClick={() => setExpanded(e => !e)}
//                         className="p-2 rounded-xl border" style={{ borderColor: "#ddeae2", color: "#7a9088" }}>
//                         {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
//                     </button>
//                 </div>
//             </div>

//             {/* Score bar */}
//             <div className="px-4 pb-3">
//                 <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#f0f7f3" }}>
//                     <div className="h-full rounded-full transition-all duration-500"
//                         style={{ width: `${scores.totalScore}%`, background: bandColor }} />
//                 </div>
//             </div>

//             {/* Expanded */}
//             {expanded && (
//                 <div className="border-t px-4 py-4 flex flex-col gap-5" style={{ borderColor: "#f0f7f3" }}>

//                     {/* Assessment history */}
//                     {employee.assessments.length > 0 && (
//                         <div>
//                             <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: "#7a9088" }}>
//                                 Assessment History
//                             </p>
//                             <div className="flex gap-2 flex-wrap">
//                                 {employee.assessments.map((a, i) => {
//                                     const prev = employee.assessments[i + 1];
//                                     const delta = prev ? a.totalScore - prev.totalScore : 0;
//                                     const bc = BAND_COLORS[a.riskBand] ?? "#8da898";
//                                     return (
//                                         <div key={a.id} className="flex flex-col items-center rounded-xl p-3 min-w-[76px] border"
//                                             style={{ background: `${bc}08`, borderColor: `${bc}30` }}>
//                                             <span className="text-[9px] text-center" style={{ color: "#7a9088" }}>
//                                                 {new Date(a.createdAt).toLocaleDateString("en-GB", { month: "short", day: "numeric" })}
//                                             </span>
//                                             <span className="text-[20px] font-bold my-1" style={{ color: bc, fontFamily: "Georgia" }}>
//                                                 {a.totalScore}
//                                             </span>
//                                             <span className="text-[10px]" style={{ color: bc }}>{a.riskBand}</span>
//                                             {delta !== 0 && (
//                                                 <span className={`text-[9px] font-semibold mt-0.5 ${delta < 0 ? "text-[#4e8c6a]" : "text-[#b94a4f]"}`}>
//                                                     {delta < 0 ? "▼" : "▲"}{Math.abs(delta)}
//                                                 </span>
//                                             )}
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         </div>
//                     )}

//                     {/* Domain scores with sliders */}
//                     <div>
//                         <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
//                             <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#7a9088" }}>
//                                 Domain Scores {editing && <span style={{ color: "#3d8b8b" }}>(editing)</span>}
//                             </p>
//                             {!editing ? (
//                                 <button onClick={() => { if (!latest) return; setEditing(true); }}
//                                     disabled={!latest}
//                                     className="flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-lg border disabled:opacity-40"
//                                     style={{ borderColor: "#ddeae2", color: "#4e8c6a" }}>
//                                     <Edit2 size={11} /> Update Scores After Therapy
//                                 </button>
//                             ) : (
//                                 <div className="flex items-center gap-2 flex-wrap">
//                                     {saveError && <span className="text-[11px]" style={{ color: "#b94a4f" }}>{saveError}</span>}
//                                     <button onClick={() => { setEditing(false); setSaveError(""); }}
//                                         className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg border"
//                                         style={{ borderColor: "#ddeae2", color: "#7a9088" }}>
//                                         <X size={10} /> Cancel
//                                     </button>
//                                     <button onClick={handleSave} disabled={saving}
//                                         className="flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-lg text-white"
//                                         style={{ background: "#4e8c6a" }}>
//                                         {saving ? <RefreshCw size={10} className="animate-spin" /> : <Save size={10} />}
//                                         {saving ? "Saving…" : "Save & Update Charts"}
//                                     </button>
//                                 </div>
//                             )}
//                         </div>

//                         {editing && (
//                             <div className="mb-3 p-3 rounded-xl flex items-start gap-2"
//                                 style={{ background: "rgba(61,139,139,0.06)", border: "1px solid rgba(61,139,139,0.2)" }}>
//                                 <Info size={13} style={{ color: "#3d8b8b", flexShrink: 0 }} />
//                                 <p className="text-[11px]" style={{ color: "#4a6260" }}>
//                                     Drag sliders to reflect progress after therapy sessions. Saving updates the employee's
//                                     composite score and the HR company dashboard will reflect the improvement in real-time.
//                                 </p>
//                             </div>
//                         )}

//                         <div className="flex flex-col gap-4">
//                             {DOMAINS.map(({ key, label }) => (
//                                 <ScoreSlider
//                                     key={key}
//                                     label={label}
//                                     value={scores[key] as number | null}
//                                     onChange={v => setScores(s => ({ ...s, [key]: v }))}
//                                     disabled={!editing}
//                                 />
//                             ))}
//                         </div>

//                         {editing && (
//                             <div className="mt-4 p-3 rounded-xl"
//                                 style={{ background: "#f7faf8", border: "1px solid #ddeae2" }}>
//                                 <p className="text-[11px] font-medium mb-1" style={{ color: "#1c3a3a" }}>Recomputed composite</p>
//                                 <p className="text-[11px]" style={{ color: "#7a9088" }}>
//                                     Will update automatically on save. Current total: <strong style={{ color: "#1c3a3a" }}>{scores.totalScore}</strong>
//                                 </p>
//                             </div>
//                         )}
//                     </div>

//                     {/* Therapist notes */}
//                     <div>
//                         <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#7a9088" }}>
//                             Therapist / Admin Notes
//                         </p>
//                         {editing ? (
//                             <textarea
//                                 value={therapistNotes}
//                                 onChange={e => setTherapistNotes(e.target.value)}
//                                 rows={4}
//                                 className="w-full text-[12px] px-3 py-2.5 rounded-xl border outline-none resize-y"
//                                 style={{ borderColor: "#ddeae2", color: "#1c3a3a", background: "#f9fdfb" }}
//                                 placeholder="Clinical notes, therapy approach, next steps, risk observations…"
//                             />
//                         ) : (
//                             <div className="rounded-xl px-3 py-2.5 text-[12px] font-light leading-relaxed"
//                                 style={{ background: "#f7faf8", color: "#4a6260", borderLeft: "3px solid #4e8c6a" }}>
//                                 {therapistNotes || <span style={{ color: "#b0c8bc" }}>No notes yet. Click "Update Scores" to add.</span>}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// // ── Main Page ─────────────────────────────────────────────────────────────────

// export default function AdminCompanyDetailPage() {
//     // export default function AdminCompanyDetailPage({ params }: { params: { id: string } }) {
//     const params = useParams()
//     const companyId = params.id as string | undefined;
//     const [company, setCompany] = useState<CompanyDetail | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");
//     const [filterBand, setFilterBand] = useState("all");
//     const [sortBy, setSortBy] = useState<"score" | "improvement" | "enrolled">("score");
//     const [copied, setCopied] = useState(false);

//     const load = useCallback(async () => {
//         if (!companyId) {
//             setError("Company ID is missing.");
//             setLoading(false);
//             return;
//         }
//         setLoading(true);
//         try {
//             const res = await fetch(`/api/admin/companies/${companyId}`);
//             const json = await res.json();
//             if (json.success) setCompany(json.company);
//             else setError(json.error ?? "Failed to load.");
//         } catch { setError("Network error."); }
//         finally { setLoading(false); }
//     }, [companyId]);

//     useEffect(() => { load(); }, [load]);

//     const handleCopyCode = () => {
//         if (!company) return;
//         navigator.clipboard.writeText(company.accessCode).catch(() => { });
//         setCopied(true);
//         setTimeout(() => setCopied(false), 2000);
//     };

//     const handleEmployeeUpdated = (id: string, patch: Partial<Employee>) => {
//         setCompany(c => c ? {
//             ...c,
//             employees: c.employees.map(e => e.id === id ? { ...e, ...patch } : e),
//         } : c);
//     };

//     if (loading) return (
//         <div className="flex flex-col gap-4">{Array.from({ length: 4 }).map((_, i) => (
//             <div key={i} className="animate-pulse rounded-2xl h-20 bg-[#e8f0ec]" />
//         ))}</div>
//     );

//     if (error || !company) return (
//         <div className="text-center py-20">
//             <AlertTriangle size={32} style={{ color: "#b94a4f" }} className="mx-auto mb-3" />
//             <p style={{ color: "#7a9088" }}>{error || "Company not found."}</p>
//             <Link href="/admin/companies" className="text-[12px] mt-4 block" style={{ color: "#4e8c6a" }}>← Back</Link>
//         </div>
//     );

//     const active = company.employees.filter(e => !e.anonymous || true);
//     const atRisk = active.filter(e => e.riskBand === "High" || e.riskBand === "Critical");

//     const filtered = active
//         .filter(e => filterBand === "all" || e.riskBand === filterBand)
//         .sort((a, b) => {
//             if (sortBy === "score") return (b.overallScore ?? 0) - (a.overallScore ?? 0);
//             if (sortBy === "improvement") return (b.improvementPct ?? 0) - (a.improvementPct ?? 0);
//             return new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime();
//         });

//     return (
//         <div className="flex flex-col gap-4 sm:gap-5 pb-8">
//             {/* Back */}
//             <Link href="/admin/companies" className="flex items-center gap-1 text-[12px] w-fit hover:underline"
//                 style={{ color: "#7a9088" }}>
//                 <ChevronLeft size={13} /> All Companies
//             </Link>

//             {/* Company card */}
//             <div className="bg-white rounded-2xl border p-4 sm:p-5" style={{ borderColor: "#e4eee8" }}>
//                 <div className="flex flex-col sm:flex-row sm:items-start gap-4">
//                     <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold shrink-0"
//                         style={{ background: "linear-gradient(135deg, #4e8c6a, #3d8b8b)", fontSize: 18 }}>
//                         {company.name.charAt(0)}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                         <div className="flex flex-wrap items-center gap-2 mb-1">
//                             <h1 className="text-[17px] font-bold" style={{ color: "#1c3a3a" }}>{company.name}</h1>
//                             <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
//                                 style={{ background: "rgba(61,139,139,0.1)", color: "#3d8b8b" }}>{company.plan}</span>
//                             <span className="text-[11px] px-2 py-0.5 rounded-full"
//                                 style={{ background: "rgba(78,140,106,0.1)", color: "#4e8c6a" }}>{company.status}</span>
//                         </div>
//                         <p className="text-[12px]" style={{ color: "#7a9088" }}>
//                             {company.industry} · HR: {company.hrEmail} · Renews {company.planRenewAt ? new Date(company.planRenewAt).toLocaleDateString("en-GB") : "—"}
//                         </p>
//                     </div>
//                     <button onClick={handleCopyCode}
//                         className="flex items-center gap-2 px-3 py-2 rounded-xl border text-[12px] font-mono self-start"
//                         style={{ borderColor: "#ddeae2", color: copied ? "#4e8c6a" : "#1c3a3a" }}>
//                         {copied ? <CheckCircle size={12} /> : null}
//                         {copied ? "Copied!" : company.accessCode}
//                     </button>
//                 </div>

//                 {/* Plan stats */}
//                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t" style={{ borderColor: "#f0f7f3" }}>
//                     {[
//                         { label: "Enrolled", value: `${active.length}/${company.planSeats}` },
//                         { label: "Assessed", value: active.filter(e => e.lastAssessmentAt).length },
//                         { label: "Sessions used", value: `${active.reduce((s, e) => s + e.sessionsUsed, 0)}` },
//                         { label: "At risk (High+)", value: atRisk.length, urgent: atRisk.length > 0 },
//                     ].map(k => (
//                         <div key={k.label} className="text-center">
//                             <div className="text-[18px] font-bold" style={{ fontFamily: "Georgia", color: (k as { urgent?: boolean }).urgent ? "#b94a4f" : "#1c3a3a" }}>
//                                 {k.value}
//                             </div>
//                             <div className="text-[10px] uppercase tracking-widest" style={{ color: "#b0c8bc" }}>{k.label}</div>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* Employee list controls */}
//             <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
//                 <h2 className="text-[15px] font-semibold" style={{ color: "#1c3a3a" }}>
//                     Employee Progress ({active.length})
//                 </h2>
//                 <div className="flex flex-wrap gap-2">
//                     {["all", "Low", "Mild", "Moderate", "High", "Critical"].map(b => (
//                         <button key={b} onClick={() => setFilterBand(b)}
//                             className="px-2.5 py-1.5 rounded-xl text-[11px] border transition-all"
//                             style={{
//                                 background: filterBand === b ? `${BAND_COLORS[b] ?? "#3d8b8b"}18` : "white",
//                                 borderColor: filterBand === b ? (BAND_COLORS[b] ?? "#3d8b8b") : "#ddeae2",
//                                 color: filterBand === b ? (BAND_COLORS[b] ?? "#3d8b8b") : "#7a9088",
//                             }}>
//                             {b === "all" ? "All" : b}
//                         </button>
//                     ))}
//                     <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
//                         className="px-2.5 py-1.5 rounded-xl text-[11px] border outline-none"
//                         style={{ borderColor: "#ddeae2", color: "#7a9088" }}>
//                         <option value="score">Sort: Risk score</option>
//                         <option value="improvement">Sort: Improvement</option>
//                         <option value="enrolled">Sort: Newest</option>
//                     </select>
//                 </div>
//             </div>

//             {/* Score editing info */}
//             <div className="flex items-start gap-2 p-3 rounded-xl"
//                 style={{ background: "rgba(61,139,139,0.05)", border: "1px solid rgba(61,139,139,0.15)" }}>
//                 <Info size={13} style={{ color: "#3d8b8b", flexShrink: 0, marginTop: 1 }} />
//                 <p className="text-[11px]" style={{ color: "#4a6260" }}>
//                     <strong>Updating scores:</strong> Expand any employee → click "Update Scores After Therapy" →
//                     drag domain score sliders to reflect improvement → save. The HR company dashboard updates automatically.
//                 </p>
//             </div>

//             {/* Employees */}
//             {filtered.length === 0 ? (
//                 <div className="text-center py-12 text-[12px]" style={{ color: "#7a9088" }}>
//                     No employees match this filter.
//                 </div>
//             ) : (
//                 filtered.map(e => (
//                     <EmployeeCard
//                         key={e.id}
//                         employee={e}
//                         companyId={companyId || ""}
//                         onUpdated={patch => handleEmployeeUpdated(e.id, patch)}
//                     />
//                 ))
//             )}
//         </div>
//     );
// }
////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
// "use client";

// // app/admin/companies/[id]/page.tsx
// // Company detail — Employee Progress tab.
// // Tab bar links to /sessions for session management.

// import { useState, useEffect, useCallback } from "react";
// import Link from "next/link";
// import { useParams, usePathname } from "next/navigation";
// import {
//     ChevronLeft, Users, Calendar, Shield, CheckCircle,
//     AlertTriangle, Edit2, Save, X, ChevronDown, ChevronUp,
//     RefreshCw, Info, Copy,
// } from "lucide-react";

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface DomainScores {
//     stressScore: number;
//     anxietyScore: number;
//     depressionScore: number;
//     burnoutScore: number;
//     sleepScore: number;
//     relationshipScore: number | null;
//     selfEsteemScore: number;
//     totalScore: number;
//     riskBand: string;
// }

// interface AssessmentHistory {
//     id: string;
//     createdAt: string;
//     totalScore: number;
//     riskBand: string;
// }

// interface Employee {
//     id: string;
//     name: string | null;
//     department: string | null;
//     anonymous: boolean;
//     enrolledAt: string;
//     riskBand: string | null;
//     overallScore: number | null;
//     improvementPct: number | null;
//     sessionsUsed: number;
//     sessionsRemaining: number | null;
//     lastAssessmentAt: string | null;
//     assessments: (AssessmentHistory & DomainScores & { therapistNotes?: string; flags: string[] })[];
// }

// interface CompanyDetail {
//     id: string;
//     name: string;
//     industry: string;
//     plan: string;
//     planSeats: number;
//     sessionCap: number;
//     accessCode: string;
//     hrEmail: string;
//     contactName: string;
//     contactEmail: string;
//     status: string;
//     planRenewAt: string;
//     employees: Employee[];
// }

// const BAND_COLORS: Record<string, string> = {
//     Low: "#4e8c6a",
//     Mild: "#3d8b8b",
//     Moderate: "#8b6e3d",
//     High: "#b94a4f",
//     Critical: "#8b1a1a",
// };

// const DOMAINS = [
//     { key: "stressScore", label: "Stress" },
//     { key: "anxietyScore", label: "Anxiety" },
//     { key: "depressionScore", label: "Depression / Low Mood" },
//     { key: "burnoutScore", label: "Work Burnout" },
//     { key: "sleepScore", label: "Sleep Quality" },
//     { key: "selfEsteemScore", label: "Self-Esteem" },
//     { key: "relationshipScore", label: "Relationships" },
// ] as const;

// // ─── Tab bar ──────────────────────────────────────────────────────────────────

// function CompanyTabs({ companyId }: { companyId: string }) {
//     const pathname = usePathname();

//     const tabs = [
//         {
//             href: `/admin/companies/${companyId}`,
//             label: "Employee Progress",
//             icon: Users,
//             active: pathname === `/admin/companies/${companyId}`,
//         },
//         {
//             href: `/admin/companies/${companyId}/sessions`,
//             label: "Sessions",
//             icon: Calendar,
//             active: pathname.startsWith(`/admin/companies/${companyId}/sessions`),
//         },
//     ];

//     return (
//         <div
//             className="flex items-center gap-1 p-1 rounded-xl self-start"
//             style={{ background: "#f0f7f3" }}
//         >
//             {tabs.map(({ href, label, icon: Icon, active }) => (
//                 <Link
//                     key={href}
//                     href={href}
//                     className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-all"
//                     style={{
//                         background: active ? "white" : "transparent",
//                         color: active ? "#1c3a3a" : "#7a9088",
//                         boxShadow: active ? "0 1px 4px rgba(28,58,58,0.08)" : "none",
//                     }}
//                 >
//                     <Icon size={14} />
//                     {label}
//                 </Link>
//             ))}
//         </div>
//     );
// }

// // ─── Score slider ─────────────────────────────────────────────────────────────

// function ScoreSlider({
//     label, value, onChange, disabled,
// }: { label: string; value: number | null; onChange: (v: number) => void; disabled: boolean }) {
//     if (value === null) return (
//         <div className="opacity-40">
//             <div className="flex justify-between mb-1">
//                 <span className="text-[11px]" style={{ color: "#7a9088" }}>{label}</span>
//                 <span className="text-[11px]" style={{ color: "#b0c8bc" }}>N/A</span>
//             </div>
//         </div>
//     );

//     const level = value < 30 ? "Low" : value < 50 ? "Mild" : value < 70 ? "Moderate" : "High";
//     const color = BAND_COLORS[level];

//     return (
//         <div>
//             <div className="flex items-center justify-between mb-1.5">
//                 <span className="text-[11px] font-medium" style={{ color: "#1c3a3a" }}>{label}</span>
//                 <div className="flex items-center gap-1.5">
//                     <span
//                         className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
//                         style={{ background: `${color}18`, color }}
//                     >
//                         {level}
//                     </span>
//                     <span className="text-[13px] font-bold w-8 text-right" style={{ color }}>{value}</span>
//                 </div>
//             </div>
//             <input
//                 type="range" min={0} max={100} step={1}
//                 value={value}
//                 onChange={(e) => onChange(parseInt(e.target.value))}
//                 disabled={disabled}
//                 className="w-full h-2 rounded-full outline-none cursor-pointer disabled:cursor-default"
//                 style={{
//                     appearance: "none",
//                     background: `linear-gradient(to right, ${color} ${value}%, #f0f7f3 ${value}%)`,
//                 }}
//             />
//             <div className="flex justify-between mt-0.5">
//                 <span className="text-[9px]" style={{ color: "#b0c8bc" }}>0 — None</span>
//                 <span className="text-[9px]" style={{ color: "#b0c8bc" }}>100 — Severe</span>
//             </div>
//         </div>
//     );
// }

// // ─── Employee card ────────────────────────────────────────────────────────────

// function EmployeeCard({
//     employee, companyId, onUpdated,
// }: { employee: Employee; companyId: string; onUpdated: (patch: Partial<Employee>) => void }) {
//     const [expanded, setExpanded] = useState(
//         employee.riskBand === "Critical" || employee.riskBand === "High",
//     );
//     const [editing, setEditing] = useState(false);
//     const [saving, setSaving] = useState(false);
//     const [saveError, setSaveError] = useState("");

//     const latest = employee.assessments[0];

//     const [scores, setScores] = useState<DomainScores>({
//         stressScore: latest?.stressScore ?? 0,
//         anxietyScore: latest?.anxietyScore ?? 0,
//         depressionScore: latest?.depressionScore ?? 0,
//         burnoutScore: latest?.burnoutScore ?? 0,
//         sleepScore: latest?.sleepScore ?? 0,
//         relationshipScore: latest?.relationshipScore ?? null,
//         selfEsteemScore: latest?.selfEsteemScore ?? 0,
//         totalScore: latest?.totalScore ?? 0,
//         riskBand: latest?.riskBand ?? "Mild",
//     });
//     const [therapistNotes, setTherapistNotes] = useState(latest?.therapistNotes ?? "");

//     const handleSave = async () => {
//         setSaving(true);
//         setSaveError("");
//         try {
//             const res = await fetch(`/api/admin/companies/${companyId}/score`, {
//                 method: "PATCH",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     employeeId: employee.id,
//                     assessmentId: latest?.id,
//                     stressScore: scores.stressScore,
//                     anxietyScore: scores.anxietyScore,
//                     depressionScore: scores.depressionScore,
//                     burnoutScore: scores.burnoutScore,
//                     sleepScore: scores.sleepScore,
//                     selfEsteemScore: scores.selfEsteemScore,
//                     relationshipScore: scores.relationshipScore,
//                     therapistNotes,
//                     reviewedBy: "admin",
//                 }),
//             });
//             const data = await res.json();
//             if (!res.ok || !data.success) {
//                 setSaveError(data.error ?? "Failed to save.");
//                 return;
//             }
//             onUpdated({
//                 riskBand: data.updated.riskBand,
//                 overallScore: data.updated.totalScore,
//                 improvementPct: data.updated.improvementPct,
//             });
//             setScores((s) => ({ ...s, totalScore: data.updated.totalScore, riskBand: data.updated.riskBand }));
//             setEditing(false);
//         } catch {
//             setSaveError("Network error. Please try again.");
//         } finally {
//             setSaving(false);
//         }
//     };

//     const bandColor = BAND_COLORS[scores.riskBand] ?? "#8da898";
//     const improving = (employee.improvementPct ?? 0) > 0;

//     return (
//         <div
//             className="bg-white rounded-2xl border mb-3 overflow-hidden"
//             style={{
//                 borderColor: scores.riskBand === "Critical" ? "rgba(185,74,79,0.4)" : "#e4eee8",
//                 boxShadow: scores.riskBand === "Critical" ? "0 0 0 2px rgba(185,74,79,0.08)" : "none",
//             }}
//         >
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4">
//                 <div
//                     className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0"
//                     style={{ background: bandColor }}
//                 >
//                     {employee.anonymous ? "A" : (employee.name?.charAt(0) ?? "?")}
//                 </div>

//                 <div className="flex-1 min-w-0">
//                     <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
//                         <span className="text-[13px] font-semibold" style={{ color: "#1c3a3a" }}>
//                             {employee.anonymous
//                                 ? `Anonymous — ${employee.department ?? "Unknown dept"}`
//                                 : (employee.name ?? "Unnamed")}
//                         </span>
//                         <span
//                             className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
//                             style={{ background: `${bandColor}18`, color: bandColor }}
//                         >
//                             {scores.riskBand}
//                         </span>
//                         {(latest?.flags ?? []).map((f: string) => (
//                             <span
//                                 key={f}
//                                 className="text-[10px] px-2 py-0.5 rounded-full"
//                                 style={{ background: "rgba(185,74,79,0.1)", color: "#b94a4f" }}
//                             >
//                                 ⚠ {f.replace(/_/g, " ")}
//                             </span>
//                         ))}
//                     </div>
//                     <div className="text-[11px]" style={{ color: "#7a9088" }}>
//                         {employee.department && `${employee.department} · `}
//                         Enrolled {new Date(employee.enrolledAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
//                         {employee.lastAssessmentAt &&
//                             ` · Last assessed ${new Date(employee.lastAssessmentAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`}
//                     </div>
//                 </div>

//                 <div className="flex items-center gap-4 sm:gap-5 shrink-0">
//                     <div className="text-center">
//                         <div
//                             className="text-[15px] font-bold"
//                             style={{ color: improving ? "#4e8c6a" : employee.improvementPct === 0 ? "#8da898" : "#b94a4f" }}
//                         >
//                             {improving ? "▼" : employee.improvementPct === 0 ? "—" : "▲"}{" "}
//                             {Math.abs(employee.improvementPct ?? 0)}%
//                         </div>
//                         <div className="text-[9px] uppercase tracking-widest" style={{ color: "#b0c8bc" }}>progress</div>
//                     </div>
//                     <div className="text-center">
//                         <div className="text-[15px] font-bold" style={{ color: "#1c3a3a" }}>
//                             {employee.sessionsUsed}/
//                             {employee.sessionsRemaining !== null
//                                 ? employee.sessionsUsed + employee.sessionsRemaining
//                                 : "—"}
//                         </div>
//                         <div className="text-[9px] uppercase tracking-widest" style={{ color: "#b0c8bc" }}>sessions</div>
//                     </div>
//                     <div className="text-center">
//                         <div className="text-[15px] font-bold" style={{ color: bandColor }}>{scores.totalScore}</div>
//                         <div className="text-[9px] uppercase tracking-widest" style={{ color: "#b0c8bc" }}>score</div>
//                     </div>
//                     <button
//                         onClick={() => setExpanded((e) => !e)}
//                         className="p-2 rounded-xl border"
//                         style={{ borderColor: "#ddeae2", color: "#7a9088" }}
//                     >
//                         {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
//                     </button>
//                 </div>
//             </div>

//             {/* Progress bar */}
//             <div className="px-4 pb-3">
//                 <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#f0f7f3" }}>
//                     <div
//                         className="h-full rounded-full transition-all duration-500"
//                         style={{ width: `${scores.totalScore}%`, background: bandColor }}
//                     />
//                 </div>
//             </div>

//             {/* Expanded */}
//             {expanded && (
//                 <div className="border-t px-4 py-4 flex flex-col gap-5" style={{ borderColor: "#f0f7f3" }}>

//                     {/* Assessment history */}
//                     {employee.assessments.length > 0 && (
//                         <div>
//                             <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: "#7a9088" }}>
//                                 Assessment History
//                             </p>
//                             <div className="flex gap-2 flex-wrap">
//                                 {employee.assessments.map((a, i) => {
//                                     const prev = employee.assessments[i + 1];
//                                     const delta = prev ? a.totalScore - prev.totalScore : 0;
//                                     const bc = BAND_COLORS[a.riskBand] ?? "#8da898";
//                                     return (
//                                         <div
//                                             key={a.id}
//                                             className="flex flex-col items-center rounded-xl p-3 min-w-[76px] border"
//                                             style={{ background: `${bc}08`, borderColor: `${bc}30` }}
//                                         >
//                                             <span className="text-[9px] text-center" style={{ color: "#7a9088" }}>
//                                                 {new Date(a.createdAt).toLocaleDateString("en-GB", { month: "short", day: "numeric" })}
//                                             </span>
//                                             <span
//                                                 className="text-[20px] font-bold my-1"
//                                                 style={{ color: bc, fontFamily: "Georgia" }}
//                                             >
//                                                 {a.totalScore}
//                                             </span>
//                                             <span className="text-[10px]" style={{ color: bc }}>{a.riskBand}</span>
//                                             {delta !== 0 && (
//                                                 <span
//                                                     className={`text-[9px] font-semibold mt-0.5 ${delta < 0 ? "text-[#4e8c6a]" : "text-[#b94a4f]"}`}
//                                                 >
//                                                     {delta < 0 ? "▼" : "▲"}{Math.abs(delta)}
//                                                 </span>
//                                             )}
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         </div>
//                     )}

//                     {/* Domain score sliders */}
//                     <div>
//                         <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
//                             <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#7a9088" }}>
//                                 Domain Scores{editing && <span style={{ color: "#3d8b8b" }}> — editing</span>}
//                             </p>
//                             {!editing ? (
//                                 <button
//                                     onClick={() => { if (!latest) return; setEditing(true); }}
//                                     disabled={!latest}
//                                     className="flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-lg border disabled:opacity-40"
//                                     style={{ borderColor: "#ddeae2", color: "#4e8c6a" }}
//                                 >
//                                     <Edit2 size={11} /> Update After Therapy
//                                 </button>
//                             ) : (
//                                 <div className="flex items-center gap-2 flex-wrap">
//                                     {saveError && <span className="text-[11px]" style={{ color: "#b94a4f" }}>{saveError}</span>}
//                                     <button
//                                         onClick={() => { setEditing(false); setSaveError(""); }}
//                                         className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg border"
//                                         style={{ borderColor: "#ddeae2", color: "#7a9088" }}
//                                     >
//                                         <X size={10} /> Cancel
//                                     </button>
//                                     <button
//                                         onClick={handleSave}
//                                         disabled={saving}
//                                         className="flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-lg text-white"
//                                         style={{ background: "#4e8c6a" }}
//                                     >
//                                         {saving ? <RefreshCw size={10} className="animate-spin" /> : <Save size={10} />}
//                                         {saving ? "Saving…" : "Save & Update Charts"}
//                                     </button>
//                                 </div>
//                             )}
//                         </div>

//                         {editing && (
//                             <div
//                                 className="mb-3 p-3 rounded-xl flex items-start gap-2"
//                                 style={{ background: "rgba(61,139,139,0.06)", border: "1px solid rgba(61,139,139,0.2)" }}
//                             >
//                                 <Info size={13} style={{ color: "#3d8b8b", flexShrink: 0 }} />
//                                 <p className="text-[11px]" style={{ color: "#4a6260" }}>
//                                     Drag sliders to reflect improvement after therapy sessions. Saving updates the HR dashboard in real-time.
//                                 </p>
//                             </div>
//                         )}

//                         <div className="flex flex-col gap-4">
//                             {DOMAINS.map(({ key, label }) => (
//                                 <ScoreSlider
//                                     key={key}
//                                     label={label}
//                                     value={scores[key] as number | null}
//                                     onChange={(v) => setScores((s) => ({ ...s, [key]: v }))}
//                                     disabled={!editing}
//                                 />
//                             ))}
//                         </div>
//                     </div>

//                     {/* Therapist notes */}
//                     <div>
//                         <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#7a9088" }}>
//                             Therapist / Admin Notes
//                         </p>
//                         {editing ? (
//                             <textarea
//                                 value={therapistNotes}
//                                 onChange={(e) => setTherapistNotes(e.target.value)}
//                                 rows={4}
//                                 className="w-full text-[12px] px-3 py-2.5 rounded-xl border outline-none resize-y"
//                                 style={{ borderColor: "#ddeae2", color: "#1c3a3a", background: "#f9fdfb" }}
//                                 placeholder="Clinical notes, therapy approach, next steps…"
//                             />
//                         ) : (
//                             <div
//                                 className="rounded-xl px-3 py-2.5 text-[12px] font-light leading-relaxed"
//                                 style={{ background: "#f7faf8", color: "#4a6260", borderLeft: "3px solid #4e8c6a" }}
//                             >
//                                 {therapistNotes || (
//                                     <span style={{ color: "#b0c8bc" }}>No notes yet. Click "Update After Therapy" to add.</span>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// // ─── Main page ─────────────────────────────────────────────────────────────────

// export default function AdminCompanyDetailPage() {
//     const [company, setCompany] = useState<CompanyDetail | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");
//     const [filterBand, setFilterBand] = useState("all");
//     const [sortBy, setSortBy] = useState<"score" | "improvement" | "enrolled">("score");
//     const [copied, setCopied] = useState(false);
//     const params = useParams();

//     const load = useCallback(async () => {
//         setLoading(true);
//         try {
//             const res = await fetch(`/api/admin/companies/${params.id}`);
//             const json = await res.json();
//             if (json.success) setCompany(json.company);
//             else setError(json.error ?? "Failed to load.");
//         } catch {
//             setError("Network error.");
//         } finally {
//             setLoading(false);
//         }
//     }, [params.id]);

//     useEffect(() => { load(); }, [load]);

//     const handleCopyCode = () => {
//         if (!company) return;
//         navigator.clipboard.writeText(company.accessCode).catch(() => { });
//         setCopied(true);
//         setTimeout(() => setCopied(false), 2000);
//     };

//     const handleEmployeeUpdated = (id: string, patch: Partial<Employee>) => {
//         setCompany((c) =>
//             c ? { ...c, employees: c.employees.map((e) => (e.id === id ? { ...e, ...patch } : e)) } : c,
//         );
//     };

//     if (loading) {
//         return (
//             <div className="flex flex-col gap-4">
//                 {Array.from({ length: 4 }).map((_, i) => (
//                     <div key={i} className="animate-pulse rounded-2xl h-20 bg-[#e8f0ec]" />
//                 ))}
//             </div>
//         );
//     }

//     if (error || !company) {
//         return (
//             <div className="text-center py-20">
//                 <AlertTriangle size={32} style={{ color: "#b94a4f" }} className="mx-auto mb-3" />
//                 <p style={{ color: "#7a9088" }}>{error || "Company not found."}</p>
//                 <Link href="/admin/companies" className="text-[12px] mt-4 block" style={{ color: "#4e8c6a" }}>
//                     ← Back to companies
//                 </Link>
//             </div>
//         );
//     }

//     const active = company.employees;
//     const atRisk = active.filter((e) => e.riskBand === "High" || e.riskBand === "Critical");
//     const assessed = active.filter((e) => e.lastAssessmentAt);
//     const sessionsUsed = active.reduce((s, e) => s + e.sessionsUsed, 0);

//     const filtered = active
//         .filter((e) => filterBand === "all" || e.riskBand === filterBand)
//         .sort((a, b) => {
//             if (sortBy === "score") return (b.overallScore ?? 0) - (a.overallScore ?? 0);
//             if (sortBy === "improvement") return (b.improvementPct ?? 0) - (a.improvementPct ?? 0);
//             return new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime();
//         });

//     return (
//         <div className="flex flex-col gap-4 sm:gap-5 max-w-5xl pb-8">
//             {/* Back */}
//             <Link
//                 href="/admin/companies"
//                 className="flex items-center gap-1 text-[12px] w-fit hover:underline"
//                 style={{ color: "#7a9088" }}
//             >
//                 <ChevronLeft size={13} /> All Companies
//             </Link>

//             {/* Company header card */}
//             <div className="bg-white rounded-2xl border p-4 sm:p-5" style={{ borderColor: "#e4eee8" }}>
//                 <div className="flex flex-col sm:flex-row sm:items-start gap-4">
//                     <div
//                         className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold shrink-0"
//                         style={{ background: "linear-gradient(135deg, #4e8c6a, #3d8b8b)", fontSize: 18 }}
//                     >
//                         {company.name.charAt(0)}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                         <div className="flex flex-wrap items-center gap-2 mb-1">
//                             <h1 className="text-[17px] font-bold" style={{ color: "#1c3a3a" }}>{company.name}</h1>
//                             <span
//                                 className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
//                                 style={{ background: "rgba(61,139,139,0.1)", color: "#3d8b8b" }}
//                             >
//                                 {company.plan}
//                             </span>
//                             <span
//                                 className="text-[11px] px-2 py-0.5 rounded-full"
//                                 style={{ background: "rgba(78,140,106,0.1)", color: "#4e8c6a" }}
//                             >
//                                 {company.status}
//                             </span>
//                         </div>
//                         <p className="text-[12px]" style={{ color: "#7a9088" }}>
//                             {company.industry} · {company.hrEmail}
//                             {company.planRenewAt &&
//                                 ` · Renews ${new Date(company.planRenewAt).toLocaleDateString("en-GB")}`}
//                         </p>
//                     </div>
//                     <button
//                         onClick={handleCopyCode}
//                         className="flex items-center gap-2 px-3 py-2 rounded-xl border text-[12px] font-mono self-start"
//                         style={{ borderColor: "#ddeae2", color: copied ? "#4e8c6a" : "#1c3a3a" }}
//                     >
//                         {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
//                         {copied ? "Copied!" : company.accessCode}
//                     </button>
//                 </div>

//                 {/* Plan stats */}
//                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t" style={{ borderColor: "#f0f7f3" }}>
//                     {[
//                         { label: "Enrolled", value: `${active.length}/${company.planSeats}` },
//                         { label: "Assessed", value: assessed.length },
//                         { label: "Sessions used", value: sessionsUsed },
//                         { label: "At risk (High+)", value: atRisk.length, urgent: atRisk.length > 0 },
//                     ].map((k) => (
//                         <div key={k.label} className="text-center">
//                             <div
//                                 className="text-[18px] font-bold"
//                                 style={{
//                                     fontFamily: "Georgia",
//                                     color: (k as { urgent?: boolean }).urgent ? "#b94a4f" : "#1c3a3a",
//                                 }}
//                             >
//                                 {k.value}
//                             </div>
//                             <div className="text-[10px] uppercase tracking-widest" style={{ color: "#b0c8bc" }}>
//                                 {k.label}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* ── TAB BAR ── */}
//             <CompanyTabs companyId={params.id as string} />

//             {/* Employee list controls */}
//             <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
//                 <h2 className="text-[15px] font-semibold" style={{ color: "#1c3a3a" }}>
//                     Employee Progress ({active.length})
//                 </h2>
//                 <div className="flex flex-wrap gap-2">
//                     {["all", "Low", "Mild", "Moderate", "High", "Critical"].map((b) => (
//                         <button
//                             key={b}
//                             onClick={() => setFilterBand(b)}
//                             className="px-2.5 py-1.5 rounded-xl text-[11px] border transition-all"
//                             style={{
//                                 background: filterBand === b ? `${BAND_COLORS[b] ?? "#3d8b8b"}18` : "white",
//                                 borderColor: filterBand === b ? (BAND_COLORS[b] ?? "#3d8b8b") : "#ddeae2",
//                                 color: filterBand === b ? (BAND_COLORS[b] ?? "#3d8b8b") : "#7a9088",
//                             }}
//                         >
//                             {b === "all" ? "All" : b}
//                         </button>
//                     ))}
//                     <select
//                         value={sortBy}
//                         onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
//                         className="px-2.5 py-1.5 rounded-xl text-[11px] border outline-none"
//                         style={{ borderColor: "#ddeae2", color: "#7a9088" }}
//                     >
//                         <option value="score">Sort: Risk score</option>
//                         <option value="improvement">Sort: Improvement</option>
//                         <option value="enrolled">Sort: Newest</option>
//                     </select>
//                 </div>
//             </div>

//             {/* Score editing hint */}
//             <div
//                 className="flex items-start gap-2 p-3 rounded-xl"
//                 style={{ background: "rgba(61,139,139,0.05)", border: "1px solid rgba(61,139,139,0.15)" }}
//             >
//                 <Info size={13} style={{ color: "#3d8b8b", flexShrink: 0, marginTop: 1 }} />
//                 <p className="text-[11px]" style={{ color: "#4a6260" }}>
//                     <strong>Updating scores:</strong> Expand any employee → click "Update After Therapy" →
//                     drag sliders to reflect progress → save. The HR dashboard updates automatically.
//                     To schedule sessions, use the <Link href={`/admin/companies/${params.id}/sessions`} className="underline" style={{ color: "#3d8b8b" }}>Sessions tab</Link>.
//                 </p>
//             </div>

//             {/* Employee cards */}
//             {filtered.length === 0 ? (
//                 <div className="text-center py-12 text-[12px]" style={{ color: "#7a9088" }}>
//                     No employees match this filter.
//                 </div>
//             ) : (
//                 filtered.map((e) => (
//                     <EmployeeCard
//                         key={e.id}
//                         employee={e}
//                         companyId={params.id as string}
//                         onUpdated={(patch) => handleEmployeeUpdated(e.id, patch)}
//                     />
//                 ))
//             )}
//         </div>
//     );
// }

"use client";

// app/admin/companies/[id]/page.tsx
// Company detail — Employee Progress tab.
// Tab bar links to /sessions for session management.

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
    ChevronLeft, Users, Calendar, Shield, CheckCircle,
    AlertTriangle, Edit2, Save, X, ChevronDown, ChevronUp,
    RefreshCw, Info, Copy, Mail, Phone, MessageCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DomainScores {
    stressScore: number;
    anxietyScore: number;
    depressionScore: number;
    burnoutScore: number;
    sleepScore: number;
    relationshipScore: number | null;
    selfEsteemScore: number;
    totalScore: number;
    riskBand: string;
}

interface AssessmentHistory {
    id: string;
    createdAt: string;
    totalScore: number;
    riskBand: string;
}

interface Employee {
    id: string;
    name: string | null;
    email: string | null;       // ← NEW
    phone: string | null;       // ← NEW
    department: string | null;
    anonymous: boolean;
    enrolledAt: string;
    riskBand: string | null;
    overallScore: number | null;
    improvementPct: number | null;
    sessionsUsed: number;
    sessionsRemaining: number | null;
    lastAssessmentAt: string | null;
    assessments: (AssessmentHistory & DomainScores & { therapistNotes?: string; flags: string[] })[];
}

interface CompanyDetail {
    id: string;
    name: string;
    industry: string;
    plan: string;
    planSeats: number;
    sessionCap: number;
    accessCode: string;
    hrEmail: string;
    contactName: string;
    contactEmail: string;
    status: string;
    planRenewAt: string;
    employees: Employee[];
}

const BAND_COLORS: Record<string, string> = {
    Low: "#4e8c6a",
    Mild: "#3d8b8b",
    Moderate: "#8b6e3d",
    High: "#b94a4f",
    Critical: "#8b1a1a",
};

const DOMAINS = [
    { key: "stressScore", label: "Stress" },
    { key: "anxietyScore", label: "Anxiety" },
    { key: "depressionScore", label: "Depression / Low Mood" },
    { key: "burnoutScore", label: "Work Burnout" },
    { key: "sleepScore", label: "Sleep Quality" },
    { key: "selfEsteemScore", label: "Self-Esteem" },
    { key: "relationshipScore", label: "Relationships" },
] as const;

// ─── Tab bar ──────────────────────────────────────────────────────────────────

function CompanyTabs({ companyId }: { companyId: string }) {
    const pathname = usePathname();

    const tabs = [
        {
            href: `/admin/companies/${companyId}`,
            label: "Employee Progress",
            icon: Users,
            active: pathname === `/admin/companies/${companyId}`,
        },
        {
            href: `/admin/companies/${companyId}/sessions`,
            label: "Sessions",
            icon: Calendar,
            active: pathname.startsWith(`/admin/companies/${companyId}/sessions`),
        },
    ];

    return (
        <div
            className="flex items-center gap-1 p-1 rounded-xl self-start"
            style={{ background: "#f0f7f3" }}
        >
            {tabs.map(({ href, label, icon: Icon, active }) => (
                <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-all"
                    style={{
                        background: active ? "white" : "transparent",
                        color: active ? "#1c3a3a" : "#7a9088",
                        boxShadow: active ? "0 1px 4px rgba(28,58,58,0.08)" : "none",
                    }}
                >
                    <Icon size={14} />
                    {label}
                </Link>
            ))}
        </div>
    );
}

// ─── Contact strip ────────────────────────────────────────────────────────────

function ContactStrip({ email, phone }: { email: string | null; phone: string | null }) {
    // For anonymous employees both will be null — render nothing
    if (!email && !phone) return null;

    // Format phone for WhatsApp link: strip spaces/dashes/parens, ensure leading +
    const waNumber = phone ? phone.replace(/[\s\-().]/g, "") : null;

    return (
        <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-2.5" style={{ color: "#7a9088" }}>
                Contact
            </p>
            <div className="flex flex-wrap gap-2">
                {email && (
                    <a
                        href={`mailto:${email}`}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all hover:border-[#3d8b8b] group"
                        style={{ borderColor: "#ddeae2", background: "#f9fdfb", textDecoration: "none" }}
                    >
                        <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: "rgba(55,138,221,0.1)" }}
                        >
                            <Mail size={13} style={{ color: "#185fa5" }} />
                        </div>
                        <div>
                            <span className="block text-[9px] uppercase tracking-wider" style={{ color: "#b0c8bc" }}>Email</span>
                            <span className="block text-[12px] font-medium" style={{ color: "#1c3a3a" }}>{email}</span>
                        </div>
                    </a>
                )}

                {phone && (
                    <a
                        href={`tel:${phone}`}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all hover:border-[#4e8c6a]"
                        style={{ borderColor: "#ddeae2", background: "#f9fdfb", textDecoration: "none" }}
                    >
                        <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: "rgba(78,140,106,0.12)" }}
                        >
                            <Phone size={13} style={{ color: "#4e8c6a" }} />
                        </div>
                        <div>
                            <span className="block text-[9px] uppercase tracking-wider" style={{ color: "#b0c8bc" }}>Phone</span>
                            <span className="block text-[12px] font-medium" style={{ color: "#1c3a3a" }}>{phone}</span>
                        </div>
                    </a>
                )}

                {waNumber && (
                    <a
                        href={`https://wa.me/${waNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all hover:border-[#1a8a40]"
                        style={{ borderColor: "#ddeae2", background: "#f9fdfb", textDecoration: "none" }}
                    >
                        <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: "rgba(37,211,102,0.1)" }}
                        >
                            {/* WhatsApp icon via inline SVG since lucide doesn't have one */}
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="#1a8a40">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.138.562 4.139 1.534 5.876L.057 23.57a.5.5 0 00.611.633l5.882-1.544A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-1.91 0-3.697-.519-5.228-1.424l-.37-.22-3.865 1.016 1.027-3.765-.241-.385A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
                            </svg>
                        </div>
                        <div>
                            <span className="block text-[9px] uppercase tracking-wider" style={{ color: "#b0c8bc" }}>WhatsApp</span>
                            <span className="block text-[12px] font-medium" style={{ color: "#1c3a3a" }}>Message directly</span>
                        </div>
                    </a>
                )}
            </div>
        </div>
    );
}

// ─── Score slider ─────────────────────────────────────────────────────────────

function ScoreSlider({
    label, value, onChange, disabled,
}: { label: string; value: number | null; onChange: (v: number) => void; disabled: boolean }) {
    if (value === null) return (
        <div className="opacity-40">
            <div className="flex justify-between mb-1">
                <span className="text-[11px]" style={{ color: "#7a9088" }}>{label}</span>
                <span className="text-[11px]" style={{ color: "#b0c8bc" }}>N/A</span>
            </div>
        </div>
    );

    const level = value < 30 ? "Low" : value < 50 ? "Mild" : value < 70 ? "Moderate" : "High";
    const color = BAND_COLORS[level];

    return (
        <div>
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-medium" style={{ color: "#1c3a3a" }}>{label}</span>
                <div className="flex items-center gap-1.5">
                    <span
                        className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
                        style={{ background: `${color}18`, color }}
                    >
                        {level}
                    </span>
                    <span className="text-[13px] font-bold w-8 text-right" style={{ color }}>{value}</span>
                </div>
            </div>
            <input
                type="range" min={0} max={100} step={1}
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                disabled={disabled}
                className="w-full h-2 rounded-full outline-none cursor-pointer disabled:cursor-default"
                style={{
                    appearance: "none",
                    background: `linear-gradient(to right, ${color} ${value}%, #f0f7f3 ${value}%)`,
                }}
            />
            <div className="flex justify-between mt-0.5">
                <span className="text-[9px]" style={{ color: "#b0c8bc" }}>0 — None</span>
                <span className="text-[9px]" style={{ color: "#b0c8bc" }}>100 — Severe</span>
            </div>
        </div>
    );
}

// ─── Employee card ────────────────────────────────────────────────────────────

function EmployeeCard({
    employee, companyId, onUpdated,
}: { employee: Employee; companyId: string; onUpdated: (patch: Partial<Employee>) => void }) {
    const [expanded, setExpanded] = useState(
        employee.riskBand === "Critical" || employee.riskBand === "High",
    );
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState("");

    const latest = employee.assessments[0];

    const [scores, setScores] = useState<DomainScores>({
        stressScore: latest?.stressScore ?? 0,
        anxietyScore: latest?.anxietyScore ?? 0,
        depressionScore: latest?.depressionScore ?? 0,
        burnoutScore: latest?.burnoutScore ?? 0,
        sleepScore: latest?.sleepScore ?? 0,
        relationshipScore: latest?.relationshipScore ?? null,
        selfEsteemScore: latest?.selfEsteemScore ?? 0,
        totalScore: latest?.totalScore ?? 0,
        riskBand: latest?.riskBand ?? "Mild",
    });
    const [therapistNotes, setTherapistNotes] = useState(latest?.therapistNotes ?? "");

    const handleSave = async () => {
        setSaving(true);
        setSaveError("");
        try {
            const res = await fetch(`/api/admin/companies/${companyId}/score`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    employeeId: employee.id,
                    assessmentId: latest?.id,
                    stressScore: scores.stressScore,
                    anxietyScore: scores.anxietyScore,
                    depressionScore: scores.depressionScore,
                    burnoutScore: scores.burnoutScore,
                    sleepScore: scores.sleepScore,
                    selfEsteemScore: scores.selfEsteemScore,
                    relationshipScore: scores.relationshipScore,
                    therapistNotes,
                    reviewedBy: "admin",
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                setSaveError(data.error ?? "Failed to save.");
                return;
            }
            onUpdated({
                riskBand: data.updated.riskBand,
                overallScore: data.updated.totalScore,
                improvementPct: data.updated.improvementPct,
            });
            setScores((s) => ({ ...s, totalScore: data.updated.totalScore, riskBand: data.updated.riskBand }));
            setEditing(false);
        } catch {
            setSaveError("Network error. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const bandColor = BAND_COLORS[scores.riskBand] ?? "#8da898";
    const improving = (employee.improvementPct ?? 0) > 0;

    return (
        <div
            className="bg-white rounded-2xl border mb-3 overflow-hidden"
            style={{
                borderColor: scores.riskBand === "Critical" ? "rgba(185,74,79,0.4)" : "#e4eee8",
                boxShadow: scores.riskBand === "Critical" ? "0 0 0 2px rgba(185,74,79,0.08)" : "none",
            }}
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4">
                <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0"
                    style={{ background: bandColor }}
                >
                    {employee.anonymous ? "A" : (employee.name?.charAt(0) ?? "?")}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                        <span className="text-[13px] font-semibold" style={{ color: "#1c3a3a" }}>
                            {employee.anonymous
                                ? `Anonymous — ${employee.department ?? "Unknown dept"}`
                                : (employee.name ?? "Unnamed")}
                        </span>
                        <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: `${bandColor}18`, color: bandColor }}
                        >
                            {scores.riskBand}
                        </span>
                        {(latest?.flags ?? []).map((f: string) => (
                            <span
                                key={f}
                                className="text-[10px] px-2 py-0.5 rounded-full"
                                style={{ background: "rgba(185,74,79,0.1)", color: "#b94a4f" }}
                            >
                                ⚠ {f.replace(/_/g, " ")}
                            </span>
                        ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px]" style={{ color: "#7a9088" }}>
                        <span>
                            {employee.department && `${employee.department} · `}
                            Enrolled {new Date(employee.enrolledAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                            {employee.lastAssessmentAt &&
                                ` · Last assessed ${new Date(employee.lastAssessmentAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`}
                        </span>
                        {/* Inline contact hints in the header for quick access */}
                        {!employee.anonymous && employee.email && (
                            <a
                                href={`mailto:${employee.email}`}
                                className="flex items-center gap-1 hover:underline"
                                style={{ color: "#3d8b8b", textDecoration: "none" }}
                                title={employee.email}
                            >
                                <Mail size={10} />
                                <span className="hidden sm:inline">{employee.email}</span>
                                <span className="sm:hidden">Email</span>
                            </a>
                        )}
                        {!employee.anonymous && employee.phone && (
                            <a
                                href={`tel:${employee.phone}`}
                                className="flex items-center gap-1 hover:underline"
                                style={{ color: "#4e8c6a", textDecoration: "none" }}
                                title={employee.phone}
                            >
                                <Phone size={10} />
                                <span>{employee.phone}</span>
                            </a>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-5 shrink-0">
                    <div className="text-center">
                        <div
                            className="text-[15px] font-bold"
                            style={{ color: improving ? "#4e8c6a" : employee.improvementPct === 0 ? "#8da898" : "#b94a4f" }}
                        >
                            {improving ? "▼" : employee.improvementPct === 0 ? "—" : "▲"}{" "}
                            {Math.abs(employee.improvementPct ?? 0)}%
                        </div>
                        <div className="text-[9px] uppercase tracking-widest" style={{ color: "#b0c8bc" }}>progress</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[15px] font-bold" style={{ color: "#1c3a3a" }}>
                            {employee.sessionsUsed}/
                            {employee.sessionsRemaining !== null
                                ? employee.sessionsUsed + employee.sessionsRemaining
                                : "—"}
                        </div>
                        <div className="text-[9px] uppercase tracking-widest" style={{ color: "#b0c8bc" }}>sessions</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[15px] font-bold" style={{ color: bandColor }}>{scores.totalScore}</div>
                        <div className="text-[9px] uppercase tracking-widest" style={{ color: "#b0c8bc" }}>score</div>
                    </div>
                    <button
                        onClick={() => setExpanded((e) => !e)}
                        className="p-2 rounded-xl border"
                        style={{ borderColor: "#ddeae2", color: "#7a9088" }}
                    >
                        {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                </div>
            </div>

            {/* Progress bar */}
            <div className="px-4 pb-3">
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#f0f7f3" }}>
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${scores.totalScore}%`, background: bandColor }}
                    />
                </div>
            </div>

            {/* Expanded */}
            {expanded && (
                <div className="border-t px-4 py-4 flex flex-col gap-5" style={{ borderColor: "#f0f7f3" }}>

                    {/* ── Contact section ── */}
                    {employee.anonymous ? (
                        <div
                            className="flex items-start gap-2 p-3 rounded-xl"
                            style={{ background: "rgba(139,110,61,0.05)", border: "1px solid rgba(139,110,61,0.15)" }}
                        >
                            <Info size={13} style={{ color: "#8b6e3d", flexShrink: 0, marginTop: 1 }} />
                            <p className="text-[11px]" style={{ color: "#6a5228" }}>
                                Anonymous employee — contact through your HR liaison only. No personal details are stored.
                            </p>
                        </div>
                    ) : (
                        <ContactStrip email={employee.email} phone={employee.phone} />
                    )}

                    {/* Assessment history */}
                    {employee.assessments.length > 0 && (
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: "#7a9088" }}>
                                Assessment History
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                {employee.assessments.map((a, i) => {
                                    const prev = employee.assessments[i + 1];
                                    const delta = prev ? a.totalScore - prev.totalScore : 0;
                                    const bc = BAND_COLORS[a.riskBand] ?? "#8da898";
                                    return (
                                        <div
                                            key={a.id}
                                            className="flex flex-col items-center rounded-xl p-3 min-w-[76px] border"
                                            style={{ background: `${bc}08`, borderColor: `${bc}30` }}
                                        >
                                            <span className="text-[9px] text-center" style={{ color: "#7a9088" }}>
                                                {new Date(a.createdAt).toLocaleDateString("en-GB", { month: "short", day: "numeric" })}
                                            </span>
                                            <span
                                                className="text-[20px] font-bold my-1"
                                                style={{ color: bc, fontFamily: "Georgia" }}
                                            >
                                                {a.totalScore}
                                            </span>
                                            <span className="text-[10px]" style={{ color: bc }}>{a.riskBand}</span>
                                            {delta !== 0 && (
                                                <span
                                                    className={`text-[9px] font-semibold mt-0.5 ${delta < 0 ? "text-[#4e8c6a]" : "text-[#b94a4f]"}`}
                                                >
                                                    {delta < 0 ? "▼" : "▲"}{Math.abs(delta)}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Domain score sliders */}
                    <div>
                        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                            <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#7a9088" }}>
                                Domain Scores{editing && <span style={{ color: "#3d8b8b" }}> — editing</span>}
                            </p>
                            {!editing ? (
                                <button
                                    onClick={() => { if (!latest) return; setEditing(true); }}
                                    disabled={!latest}
                                    className="flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-lg border disabled:opacity-40"
                                    style={{ borderColor: "#ddeae2", color: "#4e8c6a" }}
                                >
                                    <Edit2 size={11} /> Update After Therapy
                                </button>
                            ) : (
                                <div className="flex items-center gap-2 flex-wrap">
                                    {saveError && <span className="text-[11px]" style={{ color: "#b94a4f" }}>{saveError}</span>}
                                    <button
                                        onClick={() => { setEditing(false); setSaveError(""); }}
                                        className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg border"
                                        style={{ borderColor: "#ddeae2", color: "#7a9088" }}
                                    >
                                        <X size={10} /> Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-lg text-white"
                                        style={{ background: "#4e8c6a" }}
                                    >
                                        {saving ? <RefreshCw size={10} className="animate-spin" /> : <Save size={10} />}
                                        {saving ? "Saving…" : "Save & Update Charts"}
                                    </button>
                                </div>
                            )}
                        </div>

                        {editing && (
                            <div
                                className="mb-3 p-3 rounded-xl flex items-start gap-2"
                                style={{ background: "rgba(61,139,139,0.06)", border: "1px solid rgba(61,139,139,0.2)" }}
                            >
                                <Info size={13} style={{ color: "#3d8b8b", flexShrink: 0 }} />
                                <p className="text-[11px]" style={{ color: "#4a6260" }}>
                                    Drag sliders to reflect improvement after therapy sessions. Saving updates the HR dashboard in real-time.
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col gap-4">
                            {DOMAINS.map(({ key, label }) => (
                                <ScoreSlider
                                    key={key}
                                    label={label}
                                    value={scores[key] as number | null}
                                    onChange={(v) => setScores((s) => ({ ...s, [key]: v }))}
                                    disabled={!editing}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Therapist notes */}
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#7a9088" }}>
                            Therapist / Admin Notes
                        </p>
                        {editing ? (
                            <textarea
                                value={therapistNotes}
                                onChange={(e) => setTherapistNotes(e.target.value)}
                                rows={4}
                                className="w-full text-[12px] px-3 py-2.5 rounded-xl border outline-none resize-y"
                                style={{ borderColor: "#ddeae2", color: "#1c3a3a", background: "#f9fdfb" }}
                                placeholder="Clinical notes, therapy approach, next steps…"
                            />
                        ) : (
                            <div
                                className="rounded-xl px-3 py-2.5 text-[12px] font-light leading-relaxed"
                                style={{ background: "#f7faf8", color: "#4a6260", borderLeft: "3px solid #4e8c6a" }}
                            >
                                {therapistNotes || (
                                    <span style={{ color: "#b0c8bc" }}>No notes yet. Click "Update After Therapy" to add.</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function AdminCompanyDetailPage() {
    const [company, setCompany] = useState<CompanyDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filterBand, setFilterBand] = useState("all");
    const [sortBy, setSortBy] = useState<"score" | "improvement" | "enrolled">("score");
    const [copied, setCopied] = useState(false);
    const params = useParams();

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/companies/${params.id}`);
            const json = await res.json();
            if (json.success) setCompany(json.company);
            else setError(json.error ?? "Failed to load.");
        } catch {
            setError("Network error.");
        } finally {
            setLoading(false);
        }
    }, [params.id]);

    useEffect(() => { load(); }, [load]);

    const handleCopyCode = () => {
        if (!company) return;
        navigator.clipboard.writeText(company.accessCode).catch(() => { });
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleEmployeeUpdated = (id: string, patch: Partial<Employee>) => {
        setCompany((c) =>
            c ? { ...c, employees: c.employees.map((e) => (e.id === id ? { ...e, ...patch } : e)) } : c,
        );
    };

    if (loading) {
        return (
            <div className="flex flex-col gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="animate-pulse rounded-2xl h-20 bg-[#e8f0ec]" />
                ))}
            </div>
        );
    }

    if (error || !company) {
        return (
            <div className="text-center py-20">
                <AlertTriangle size={32} style={{ color: "#b94a4f" }} className="mx-auto mb-3" />
                <p style={{ color: "#7a9088" }}>{error || "Company not found."}</p>
                <Link href="/admin/companies" className="text-[12px] mt-4 block" style={{ color: "#4e8c6a" }}>
                    ← Back to companies
                </Link>
            </div>
        );
    }

    const active = company.employees;
    const atRisk = active.filter((e) => e.riskBand === "High" || e.riskBand === "Critical");
    const assessed = active.filter((e) => e.lastAssessmentAt);
    const sessionsUsed = active.reduce((s, e) => s + e.sessionsUsed, 0);

    const filtered = active
        .filter((e) => filterBand === "all" || e.riskBand === filterBand)
        .sort((a, b) => {
            if (sortBy === "score") return (b.overallScore ?? 0) - (a.overallScore ?? 0);
            if (sortBy === "improvement") return (b.improvementPct ?? 0) - (a.improvementPct ?? 0);
            return new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime();
        });

    return (
        <div className="flex flex-col gap-4 sm:gap-5 pb-8">
            {/* Back */}
            <Link
                href="/admin/companies"
                className="flex items-center gap-1 text-[12px] w-fit hover:underline"
                style={{ color: "#7a9088" }}
            >
                <ChevronLeft size={13} /> All Companies
            </Link>

            {/* Company header card */}
            <div className="bg-white rounded-2xl border p-4 sm:p-5" style={{ borderColor: "#e4eee8" }}>
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold shrink-0"
                        style={{ background: "linear-gradient(135deg, #4e8c6a, #3d8b8b)", fontSize: 18 }}
                    >
                        {company.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h1 className="text-[17px] font-bold" style={{ color: "#1c3a3a" }}>{company.name}</h1>
                            <span
                                className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                                style={{ background: "rgba(61,139,139,0.1)", color: "#3d8b8b" }}
                            >
                                {company.plan}
                            </span>
                            <span
                                className="text-[11px] px-2 py-0.5 rounded-full"
                                style={{ background: "rgba(78,140,106,0.1)", color: "#4e8c6a" }}
                            >
                                {company.status}
                            </span>
                        </div>
                        <p className="text-[12px]" style={{ color: "#7a9088" }}>
                            {company.industry} · {company.hrEmail}
                            {company.planRenewAt &&
                                ` · Renews ${new Date(company.planRenewAt).toLocaleDateString("en-GB")}`}
                        </p>
                    </div>
                    <button
                        onClick={handleCopyCode}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl border text-[12px] font-mono self-start"
                        style={{ borderColor: "#ddeae2", color: copied ? "#4e8c6a" : "#1c3a3a" }}
                    >
                        {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
                        {copied ? "Copied!" : company.accessCode}
                    </button>
                </div>

                {/* Plan stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t" style={{ borderColor: "#f0f7f3" }}>
                    {[
                        { label: "Enrolled", value: `${active.length}/${company.planSeats}` },
                        { label: "Assessed", value: assessed.length },
                        { label: "Sessions used", value: sessionsUsed },
                        { label: "At risk (High+)", value: atRisk.length, urgent: atRisk.length > 0 },
                    ].map((k) => (
                        <div key={k.label} className="text-center">
                            <div
                                className="text-[18px] font-bold"
                                style={{
                                    fontFamily: "Georgia",
                                    color: (k as { urgent?: boolean }).urgent ? "#b94a4f" : "#1c3a3a",
                                }}
                            >
                                {k.value}
                            </div>
                            <div className="text-[10px] uppercase tracking-widest" style={{ color: "#b0c8bc" }}>
                                {k.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── TAB BAR ── */}
            <CompanyTabs companyId={params.id as string} />

            {/* Employee list controls */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                <h2 className="text-[15px] font-semibold" style={{ color: "#1c3a3a" }}>
                    Employee Progress ({active.length})
                </h2>
                <div className="flex flex-wrap gap-2">
                    {["all", "Low", "Mild", "Moderate", "High", "Critical"].map((b) => (
                        <button
                            key={b}
                            onClick={() => setFilterBand(b)}
                            className="px-2.5 py-1.5 rounded-xl text-[11px] border transition-all"
                            style={{
                                background: filterBand === b ? `${BAND_COLORS[b] ?? "#3d8b8b"}18` : "white",
                                borderColor: filterBand === b ? (BAND_COLORS[b] ?? "#3d8b8b") : "#ddeae2",
                                color: filterBand === b ? (BAND_COLORS[b] ?? "#3d8b8b") : "#7a9088",
                            }}
                        >
                            {b === "all" ? "All" : b}
                        </button>
                    ))}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                        className="px-2.5 py-1.5 rounded-xl text-[11px] border outline-none"
                        style={{ borderColor: "#ddeae2", color: "#7a9088" }}
                    >
                        <option value="score">Sort: Risk score</option>
                        <option value="improvement">Sort: Improvement</option>
                        <option value="enrolled">Sort: Newest</option>
                    </select>
                </div>
            </div>

            {/* Score editing hint */}
            <div
                className="flex items-start gap-2 p-3 rounded-xl"
                style={{ background: "rgba(61,139,139,0.05)", border: "1px solid rgba(61,139,139,0.15)" }}
            >
                <Info size={13} style={{ color: "#3d8b8b", flexShrink: 0, marginTop: 1 }} />
                <p className="text-[11px]" style={{ color: "#4a6260" }}>
                    <strong>Updating scores:</strong> Expand any employee → click "Update After Therapy" →
                    drag sliders to reflect progress → save. The HR dashboard updates automatically.
                    To schedule sessions, use the <Link href={`/admin/companies/${params.id}/sessions`} className="underline" style={{ color: "#3d8b8b" }}>Sessions tab</Link>.
                </p>
            </div>

            {/* Employee cards */}
            {filtered.length === 0 ? (
                <div className="text-center py-12 text-[12px]" style={{ color: "#7a9088" }}>
                    No employees match this filter.
                </div>
            ) : (
                filtered.map((e) => (
                    <EmployeeCard
                        key={e.id}
                        employee={e}
                        companyId={params.id as string}
                        onUpdated={(patch) => handleEmployeeUpdated(e.id, patch)}
                    />
                ))
            )}
        </div>
    );
}