// "use client";

// // app/admin/companies/page.tsx
// // Admin view for managing all EAP company clients.
// // Add new companies, update plan details, view their aggregate EAP data,
// // update employee progress notes, resend access codes.

// import { useState, useCallback, useEffect } from "react";
// import Link from "next/link";
// import {
//     Building2, Plus, Search, ChevronRight, Users, Calendar,
//     CheckCircle, AlertTriangle, TrendingUp, TrendingDown,
//     Shield, Copy, RefreshCw, Edit2, Eye, MoreHorizontal,
//     Mail, Phone, BarChart2, Star, Clock, X,
// } from "lucide-react";

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface Company {
//     id: string;
//     name: string;
//     industry: string;
//     contactName: string;
//     contactEmail: string;
//     hrEmail: string;
//     accessCode: string;
//     plan: string;
//     planSeats: number;
//     sessionCap: number;
//     status: string;
//     billingStatus: string;
//     planRenewAt: string;
//     enrolled: number;
//     assessed: number;
//     avgScore: number;
//     avgImprovement: number;
//     atRiskCount: number;
//     sessionsUsed: number;
//     lastActivity: string;
// }

// // ─── Mock data ─────────────────────────────────────────────────────────────────

// const MOCK_COMPANIES: Company[] = [
//     {
//         id: "c1", name: "Zenith Bank PLC", industry: "Banking & Finance",
//         contactName: "Ngozi Adeola", contactEmail: "ngozi@zenithbank.com", hrEmail: "hr@zenithbank.com",
//         accessCode: "ZNB-2024", plan: "growth", planSeats: 150, sessionCap: 6,
//         status: "active", billingStatus: "active", planRenewAt: "2025-12-01",
//         enrolled: 98, assessed: 87, avgScore: 46, avgImprovement: 22, atRiskCount: 8,
//         sessionsUsed: 234, lastActivity: "2025-01-15",
//     },
//     {
//         id: "c2", name: "Dangote Industries", industry: "Manufacturing",
//         contactName: "Emeka Okafor", contactEmail: "emeka@dangote.com", hrEmail: "hr@dangote.com",
//         accessCode: "DNG-2024", plan: "enterprise", planSeats: 999, sessionCap: 12,
//         status: "active", billingStatus: "active", planRenewAt: "2025-06-01",
//         enrolled: 412, assessed: 388, avgScore: 51, avgImprovement: 17, atRiskCount: 31,
//         sessionsUsed: 1820, lastActivity: "2025-01-14",
//     },
//     {
//         id: "c3", name: "Andela Nigeria", industry: "Technology",
//         contactName: "Funmi Balogun", contactEmail: "funmi@andela.com", hrEmail: "hr@andela.com",
//         accessCode: "AND-2024", plan: "starter", planSeats: 50, sessionCap: 4,
//         status: "active", billingStatus: "overdue", planRenewAt: "2025-02-01",
//         enrolled: 38, assessed: 29, avgScore: 38, avgImprovement: 31, atRiskCount: 2,
//         sessionsUsed: 67, lastActivity: "2025-01-10",
//     },
//     {
//         id: "c4", name: "MTN Nigeria", industry: "Telecoms",
//         contactName: "Adaeze Chukwu", contactEmail: "adaeze@mtn.ng", hrEmail: "hr@mtn.ng",
//         accessCode: "MTN-2025", plan: "growth", planSeats: 150, sessionCap: 6,
//         status: "trial", billingStatus: "active", planRenewAt: "2025-02-14",
//         enrolled: 22, assessed: 18, avgScore: 54, avgImprovement: 8, atRiskCount: 3,
//         sessionsUsed: 14, lastActivity: "2025-01-12",
//     },
// ];

// // ─── Add Company Modal ─────────────────────────────────────────────────────────

// function AddCompanyModal({ onClose, onAdd }: { onClose: () => void; onAdd: (c: Partial<Company>) => void }) {
//     const [step, setStep] = useState(1);
//     const [form, setForm] = useState({
//         name: "", industry: "", contactName: "", contactEmail: "", contactPhone: "",
//         hrEmail: "", plan: "growth", planSeats: 150, sessionCap: 6, sizeRange: "",
//         focusAreas: [] as string[],
//     });

//     const set = (k: string, v: string | number | string[]) => setForm(f => ({ ...f, [k]: v }));

//     const FOCUS_OPTIONS = ["Stress & Anxiety", "Depression", "Burnout", "Relationships", "Sleep", "Self-esteem", "Substance use"];

//     const handleSubmit = () => {
//         onAdd({
//             ...form,
//             id: `c${Date.now()}`,
//             status: "trial",
//             billingStatus: "active",
//             accessCode: `${form.name.slice(0, 3).toUpperCase()}-${new Date().getFullYear()}`,
//             planRenewAt: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
//             enrolled: 0, assessed: 0, avgScore: 0, avgImprovement: 0, atRiskCount: 0,
//             sessionsUsed: 0, lastActivity: new Date().toISOString().split("T")[0],
//         });
//         onClose();
//     };

//     return (
//         <div className="fixed inset-0 z-[300] flex items-center justify-center px-4"
//             style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }}>
//             <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
//                 {/* Header */}
//                 <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "#e4eee8" }}>
//                     <div>
//                         <h2 className="text-[15px] font-semibold" style={{ color: "#1c3a3a" }}>Add Company Client</h2>
//                         <p className="text-[11px]" style={{ color: "#7a9088" }}>Step {step} of 2</p>
//                     </div>
//                     <button onClick={onClose} style={{ color: "#7a9088", background: "none", border: "none", cursor: "pointer" }}>
//                         <X size={16} />
//                     </button>
//                 </div>

//                 <div className="px-6 py-5 overflow-y-auto" style={{ maxHeight: "65vh" }}>
//                     {step === 1 ? (
//                         <div className="space-y-4">
//                             <div className="grid grid-cols-2 gap-3">
//                                 {[
//                                     { k: "name", l: "Company name", p: "Zenith Bank PLC" },
//                                     { k: "industry", l: "Industry", p: "Banking & Finance" },
//                                     { k: "contactName", l: "HR contact name", p: "Ngozi Adeola" },
//                                     { k: "contactEmail", l: "HR contact email", p: "ngozi@company.com" },
//                                     { k: "hrEmail", l: "HR portal login email", p: "hr@company.com" },
//                                     { k: "contactPhone", l: "Phone (optional)", p: "+234 800 000 0000" },
//                                 ].map(({ k, l, p }) => (
//                                     <div key={k}>
//                                         <label className="block text-[11px] font-medium mb-1.5" style={{ color: "#1c3a3a" }}>{l}</label>
//                                         <input
//                                             value={(form as unknown as Record<string, string>)[k] ?? ""}
//                                             onChange={e => set(k, e.target.value)}
//                                             placeholder={p}
//                                             className="w-full text-[12px] px-3 py-2 rounded-xl border outline-none"
//                                             style={{ borderColor: "#ddeae2", color: "#1c3a3a" }}
//                                         />
//                                     </div>
//                                 ))}
//                             </div>
//                             <div>
//                                 <label className="block text-[11px] font-medium mb-1.5" style={{ color: "#1c3a3a" }}>Company size</label>
//                                 <select value={form.sizeRange} onChange={e => set("sizeRange", e.target.value)}
//                                     className="w-full text-[12px] px-3 py-2 rounded-xl border outline-none"
//                                     style={{ borderColor: "#ddeae2", color: "#1c3a3a" }}>
//                                     <option value="">Select…</option>
//                                     {["1–50", "51–150", "151–500", "501–1,000", "1,000+"].map(s => (
//                                         <option key={s} value={s}>{s} employees</option>
//                                     ))}
//                                 </select>
//                             </div>
//                         </div>
//                     ) : (
//                         <div className="space-y-4">
//                             <div>
//                                 <label className="block text-[11px] font-medium mb-2" style={{ color: "#1c3a3a" }}>Plan</label>
//                                 <div className="grid grid-cols-3 gap-2">
//                                     {[
//                                         { id: "starter", label: "Starter", seats: 50, sessions: 4 },
//                                         { id: "growth", label: "Growth", seats: 150, sessions: 6 },
//                                         { id: "enterprise", label: "Enterprise", seats: 999, sessions: 12 },
//                                     ].map(p => (
//                                         <button key={p.id} type="button"
//                                             onClick={() => { set("plan", p.id); set("planSeats", p.seats); set("sessionCap", p.sessions); }}
//                                             className="py-3 rounded-xl text-[11px] font-medium border transition-all"
//                                             style={{
//                                                 background: form.plan === p.id ? "rgba(61,139,139,0.08)" : "white",
//                                                 borderColor: form.plan === p.id ? "#3d8b8b" : "#ddeae2",
//                                                 color: form.plan === p.id ? "#3d8b8b" : "#7a9088",
//                                             }}>
//                                             {p.label}<br />
//                                             <span style={{ color: "#b0c8bc" }}>{p.seats === 999 ? "Unlimited" : `${p.seats} seats`}</span>
//                                         </button>
//                                     ))}
//                                 </div>
//                             </div>
//                             <div className="grid grid-cols-2 gap-3">
//                                 <div>
//                                     <label className="block text-[11px] font-medium mb-1.5" style={{ color: "#1c3a3a" }}>Max seats</label>
//                                     <input type="number" value={form.planSeats} onChange={e => set("planSeats", parseInt(e.target.value))}
//                                         className="w-full text-[12px] px-3 py-2 rounded-xl border outline-none"
//                                         style={{ borderColor: "#ddeae2", color: "#1c3a3a" }} />
//                                 </div>
//                                 <div>
//                                     <label className="block text-[11px] font-medium mb-1.5" style={{ color: "#1c3a3a" }}>Sessions / employee / year</label>
//                                     <input type="number" value={form.sessionCap} onChange={e => set("sessionCap", parseInt(e.target.value))}
//                                         className="w-full text-[12px] px-3 py-2 rounded-xl border outline-none"
//                                         style={{ borderColor: "#ddeae2", color: "#1c3a3a" }} />
//                                 </div>
//                             </div>
//                             <div>
//                                 <label className="block text-[11px] font-medium mb-2" style={{ color: "#1c3a3a" }}>Focus areas for this company</label>
//                                 <div className="flex flex-wrap gap-2">
//                                     {FOCUS_OPTIONS.map(area => {
//                                         const active = form.focusAreas.includes(area);
//                                         return (
//                                             <button key={area} type="button"
//                                                 onClick={() => set("focusAreas", active ? form.focusAreas.filter(a => a !== area) : [...form.focusAreas, area])}
//                                                 className="px-3 py-1 rounded-full text-[11px] border transition-all"
//                                                 style={{
//                                                     background: active ? "rgba(61,139,139,0.08)" : "white",
//                                                     borderColor: active ? "#3d8b8b" : "#ddeae2",
//                                                     color: active ? "#3d8b8b" : "#7a9088",
//                                                 }}>
//                                                 {area}
//                                             </button>
//                                         );
//                                     })}
//                                 </div>
//                                 <p className="text-[10px] mt-1" style={{ color: "#b0c8bc" }}>
//                                     Leave empty to include all domains.
//                                 </p>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* Footer */}
//                 <div className="flex items-center justify-between px-6 py-4 border-t" style={{ borderColor: "#e4eee8" }}>
//                     <button onClick={() => step === 1 ? onClose() : setStep(1)}
//                         className="px-4 py-2 rounded-xl text-[12px] border"
//                         style={{ borderColor: "#ddeae2", color: "#7a9088" }}>
//                         {step === 1 ? "Cancel" : "Back"}
//                     </button>
//                     <button
//                         onClick={() => step === 1 ? setStep(2) : handleSubmit()}
//                         className="px-5 py-2 rounded-xl text-[12px] font-medium text-white"
//                         style={{ background: "linear-gradient(135deg, #4e8c6a, #3d8b8b)" }}>
//                         {step === 1 ? "Next →" : "Create Company & Send Access Code"}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// // ─── Company Row ──────────────────────────────────────────────────────────────

// function CompanyRow({ company, onCopyCode }: { company: Company; onCopyCode: (code: string) => void }) {
//     const PLAN_COLORS: Record<string, string> = { starter: "#8b6e3d", growth: "#3d8b8b", enterprise: "#7b6fa9", trial: "#b0c8bc" };
//     const BILLING_COLORS: Record<string, string> = { active: "#4e8c6a", overdue: "#b94a4f", cancelled: "#8da898" };
//     const improving = company.avgImprovement > 0;

//     return (
//         <div className="bg-white rounded-2xl border mb-3 overflow-hidden hover:shadow-md transition-shadow"
//             style={{ borderColor: "#e4eee8" }}>
//             <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
//                 {/* Company info */}
//                 <div className="flex-1 min-w-0">
//                     <div className="flex items-start gap-3">
//                         <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0"
//                             style={{ background: "linear-gradient(135deg, #4e8c6a, #3d8b8b)" }}>
//                             {company.name.charAt(0)}
//                         </div>
//                         <div className="min-w-0">
//                             <div className="flex items-center gap-2 flex-wrap">
//                                 <h3 className="text-[14px] font-semibold truncate" style={{ color: "#1c3a3a" }}>{company.name}</h3>
//                                 <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
//                                     style={{ background: `${PLAN_COLORS[company.plan]}18`, color: PLAN_COLORS[company.plan] }}>
//                                     {company.plan}
//                                 </span>
//                                 {company.billingStatus === "overdue" && (
//                                     <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
//                                         style={{ background: "rgba(185,74,79,0.1)", color: "#b94a4f" }}>
//                                         Payment overdue
//                                     </span>
//                                 )}
//                             </div>
//                             <div className="flex items-center gap-3 mt-0.5 flex-wrap">
//                                 <span className="text-[11px]" style={{ color: "#7a9088" }}>{company.industry}</span>
//                                 <span className="text-[11px]" style={{ color: "#b0c8bc" }}>·</span>
//                                 <span className="text-[11px]" style={{ color: "#7a9088" }}>{company.contactName}</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Stats */}
//                 <div className="flex items-center gap-5 flex-wrap">
//                     <div className="text-center">
//                         <div className="text-[16px] font-bold" style={{ color: "#1c3a3a" }}>{company.enrolled}</div>
//                         <div className="text-[9px] uppercase tracking-widest" style={{ color: "#b0c8bc" }}>enrolled</div>
//                     </div>
//                     <div className="text-center">
//                         <div className="text-[16px] font-bold" style={{ color: "#1c3a3a" }}>{company.assessed}</div>
//                         <div className="text-[9px] uppercase tracking-widest" style={{ color: "#b0c8bc" }}>assessed</div>
//                     </div>
//                     <div className="text-center">
//                         <div className="text-[16px] font-bold" style={{ color: improving ? "#4e8c6a" : "#b94a4f" }}>
//                             {improving ? "▼" : "▲"} {company.avgImprovement}%
//                         </div>
//                         <div className="text-[9px] uppercase tracking-widest" style={{ color: "#b0c8bc" }}>improvement</div>
//                     </div>
//                     <div className="text-center">
//                         <div className="text-[16px] font-bold" style={{ color: company.atRiskCount > 0 ? "#b94a4f" : "#4e8c6a" }}>
//                             {company.atRiskCount}
//                         </div>
//                         <div className="text-[9px] uppercase tracking-widest" style={{ color: "#b0c8bc" }}>at risk</div>
//                     </div>

//                     {/* Access code */}
//                     <button onClick={() => onCopyCode(company.accessCode)}
//                         className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-mono transition-colors hover:bg-gray-50"
//                         style={{ borderColor: "#ddeae2", color: "#4e8c6a" }}>
//                         <Copy size={10} />
//                         {company.accessCode}
//                     </button>

//                     {/* Actions */}
//                     <Link href={`/admin/companies/${company.id}`}
//                         className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-medium text-white"
//                         style={{ background: "linear-gradient(135deg, #4e8c6a, #3d8b8b)" }}>
//                         Manage
//                         <ChevronRight size={12} />
//                     </Link>
//                 </div>
//             </div>

//             {/* Sub-bar: sessions used */}
//             <div className="px-5 pb-4 pt-1">
//                 <div className="flex items-center justify-between mb-1">
//                     <span className="text-[10px]" style={{ color: "#b0c8bc" }}>Sessions used</span>
//                     <span className="text-[10px]" style={{ color: "#b0c8bc" }}>
//                         {company.sessionsUsed} / {company.enrolled * company.sessionCap}
//                     </span>
//                 </div>
//                 <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#f0f7f3" }}>
//                     <div className="h-full rounded-full" style={{
//                         width: `${Math.min((company.sessionsUsed / (company.enrolled * company.sessionCap)) * 100, 100)}%`,
//                         background: "linear-gradient(90deg, #4e8c6a, #3d8b8b)",
//                     }} />
//                 </div>
//             </div>
//         </div>
//     );
// }

// // ─── Main page ─────────────────────────────────────────────────────────────────

// export default function AdminCompaniesPage() {
//     const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
//     const [showAddModal, setShowAddModal] = useState(false);
//     const [search, setSearch] = useState("");
//     const [filterPlan, setFilterPlan] = useState("all");
//     const [copiedCode, setCopiedCode] = useState<string | null>(null);

//     const handleCopyCode = (code: string) => {
//         navigator.clipboard.writeText(code).catch(() => { });
//         setCopiedCode(code);
//         setTimeout(() => setCopiedCode(null), 2000);
//     };

//     const handleAddCompany = (c: Partial<Company>) => {
//         setCompanies(prev => [c as Company, ...prev]);
//     };

//     const filtered = companies.filter(c => {
//         const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.contactEmail.toLowerCase().includes(search.toLowerCase());
//         const matchPlan = filterPlan === "all" || c.plan === filterPlan;
//         return matchSearch && matchPlan;
//     });

//     // Aggregate stats
//     const totalEnrolled = companies.reduce((s, c) => s + c.enrolled, 0);
//     const totalSessions = companies.reduce((s, c) => s + c.sessionsUsed, 0);
//     const totalAtRisk = companies.reduce((s, c) => s + c.atRiskCount, 0);
//     const avgImprovement = Math.round(companies.reduce((s, c) => s + c.avgImprovement, 0) / companies.length);

//     return (
//         <div className="flex flex-col gap-5">

//             {showAddModal && <AddCompanyModal onClose={() => setShowAddModal(false)} onAdd={handleAddCompany} />}

//             {/* Header */}
//             <div className="flex items-center justify-between">
//                 <div>
//                     <h1 className="text-[20px] font-bold" style={{ color: "#1c3a3a" }}>EAP Company Clients</h1>
//                     <p className="text-[12px] mt-0.5" style={{ color: "#7a9088" }}>
//                         Manage all subscribed companies and their employee wellbeing programmes.
//                     </p>
//                 </div>
//                 <button onClick={() => setShowAddModal(true)}
//                     className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-medium text-white"
//                     style={{ background: "linear-gradient(135deg, #4e8c6a, #3d8b8b)" }}>
//                     <Plus size={14} />
//                     Add Company
//                 </button>
//             </div>

//             {/* Aggregate KPIs */}
//             <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
//                 {[
//                     { label: "Active companies", value: companies.filter(c => c.status === "active").length, color: "#4e8c6a" },
//                     { label: "Total employees", value: totalEnrolled, color: "#3d8b8b" },
//                     { label: "Sessions delivered", value: totalSessions, color: "#8b6e3d" },
//                     { label: "Avg improvement", value: `${avgImprovement}%`, color: "#4e8c6a" },
//                     { label: "Employees at risk", value: totalAtRisk, color: totalAtRisk > 20 ? "#b94a4f" : "#4e8c6a" },
//                 ].map(k => (
//                     <div key={k.label} className="bg-white rounded-2xl border p-4" style={{ borderColor: "#e4eee8" }}>
//                         <div className="text-[22px] font-bold mb-0.5" style={{ fontFamily: "Cormorant Garamond, serif", color: "#1c3a3a" }}>{k.value}</div>
//                         <div className="text-[10px] uppercase tracking-widest" style={{ color: "#b0c8bc" }}>{k.label}</div>
//                     </div>
//                 ))}
//             </div>

//             {copiedCode && (
//                 <div className="fixed bottom-5 right-5 z-[400] px-4 py-3 rounded-xl text-[12px] font-medium text-white shadow-lg"
//                     style={{ background: "#4e8c6a" }}>
//                     <CheckCircle size={13} style={{ display: "inline", marginRight: 6 }} />
//                     Copied: {copiedCode}
//                 </div>
//             )}

//             {/* Filters */}
//             <div className="flex flex-col sm:flex-row gap-3">
//                 <div className="relative flex-1">
//                     <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#b0c8bc" }} />
//                     <input
//                         value={search}
//                         onChange={e => setSearch(e.target.value)}
//                         placeholder="Search companies…"
//                         className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-[12px] outline-none"
//                         style={{ borderColor: "#ddeae2", color: "#1c3a3a", background: "white" }}
//                     />
//                 </div>
//                 <div className="flex gap-2">
//                     {["all", "starter", "growth", "enterprise", "trial"].map(p => (
//                         <button key={p} onClick={() => setFilterPlan(p)}
//                             className="px-3.5 py-2.5 rounded-xl text-[11px] font-medium border capitalize transition-all"
//                             style={{
//                                 background: filterPlan === p ? "rgba(61,139,139,0.08)" : "white",
//                                 borderColor: filterPlan === p ? "#3d8b8b" : "#ddeae2",
//                                 color: filterPlan === p ? "#3d8b8b" : "#7a9088",
//                             }}>
//                             {p}
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             {/* Company list */}
//             <div>
//                 {filtered.length === 0 ? (
//                     <div className="text-center py-12 text-[#7a9088] text-[13px]">No companies match your filters.</div>
//                 ) : (
//                     filtered.map(c => <CompanyRow key={c.id} company={c} onCopyCode={handleCopyCode} />)
//                 )}
//             </div>
//         </div>
//     );
// }

"use client";

// app/admin/companies/page.tsx — Production version with live API
// Lists all EAP company clients, fetches real data, full CRUD.

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
    Building2, Plus, Search, ChevronRight, CheckCircle,
    Copy, RefreshCw, X, AlertTriangle, TrendingDown, TrendingUp, Loader2,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Company {
    id: string; name: string; industry: string;
    contactName: string; contactEmail: string; hrEmail: string; accessCode: string;
    plan: string; planSeats: number; sessionCap: number;
    status: string; billingStatus: string; planRenewAt: string;
    enrolled: number; assessed: number; avgScore: number;
    avgImprovement: number; atRiskCount: number; sessionsUsed: number;
}

const PLAN_COLORS: Record<string, string> = {
    starter: "#8b6e3d", growth: "#3d8b8b", enterprise: "#7b6fa9", trial: "#8da898",
};

// ── Add Company Modal ─────────────────────────────────────────────────────────

function AddCompanyModal({ onClose, onCreated }: { onClose: () => void; onCreated: (c: Company) => void }) {
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [focusAreas, setFocusAreas] = useState<string[]>([]);
    const [form, setForm] = useState({
        name: "", industry: "", sizeRange: "",
        contactName: "", contactEmail: "", contactPhone: "",
        hrEmail: "",
        plan: "growth", planSeats: 150, sessionCap: 6,
    });

    const set = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }));

    const FOCUS_OPTIONS = ["Stress & Anxiety", "Depression", "Burnout", "Relationships & Marriage", "Sleep Quality", "Self-esteem"];

    const handleCreate = async () => {
        setSubmitting(true);
        setError("");
        try {
            const res = await fetch("/api/admin/companies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, focusAreas }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) { setError(data.error ?? "Failed to create."); return; }
            onCreated(data.company);
            onClose();
        } catch { setError("Network error. Please try again."); }
        finally { setSubmitting(false); }
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center px-0 sm:px-4"
            style={{ background: "rgba(0,0,0,0.4)" }}>
            <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden flex flex-col"
                style={{ maxHeight: "92vh" }}>
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b shrink-0"
                    style={{ borderColor: "#e4eee8" }}>
                    <div>
                        <h2 className="text-[15px] font-semibold" style={{ color: "#1c3a3a" }}>Add EAP Company Client</h2>
                        <div className="flex gap-1.5 mt-1.5">
                            {[1, 2].map(s => (
                                <div key={s} className="h-1 rounded-full transition-all duration-300"
                                    style={{ width: step >= s ? 28 : 14, background: step >= s ? "#4e8c6a" : "#e4eee8" }} />
                            ))}
                        </div>
                    </div>
                    <button onClick={onClose} style={{ color: "#7a9088", background: "none", border: "none", cursor: "pointer" }}>
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-5 py-4 overflow-y-auto flex-1">
                    {step === 1 ? (
                        <div className="space-y-3.5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                {[
                                    { k: "name", l: "Company name *", p: "Zenith Bank PLC", full: true },
                                    { k: "industry", l: "Industry", p: "Banking & Finance" },
                                    { k: "contactName", l: "HR contact name *", p: "Ngozi Adeola" },
                                    { k: "contactEmail", l: "HR contact email *", p: "ngozi@company.com" },
                                    { k: "hrEmail", l: "HR portal login email *", p: "hr@company.com" },
                                    { k: "contactPhone", l: "Phone (optional)", p: "+234 800 000 0000" },
                                ].map(({ k, l, p, full }) => (
                                    <div key={k} className={full ? "sm:col-span-2" : ""}>
                                        <label className="block text-[11px] font-medium mb-1" style={{ color: "#1c3a3a" }}>{l}</label>
                                        <input
                                            value={(form as Record<string, string | number>)[k] as string}
                                            onChange={e => set(k, e.target.value)}
                                            placeholder={p}
                                            className="w-full text-[12px] px-3 py-2.5 rounded-xl border outline-none"
                                            style={{ borderColor: "#ddeae2", color: "#1c3a3a" }}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div>
                                <label className="block text-[11px] font-medium mb-1" style={{ color: "#1c3a3a" }}>Company size</label>
                                <select value={form.sizeRange} onChange={e => set("sizeRange", e.target.value)}
                                    className="w-full text-[12px] px-3 py-2.5 rounded-xl border outline-none"
                                    style={{ borderColor: "#ddeae2", color: "#1c3a3a" }}>
                                    <option value="">Select…</option>
                                    {["1–50", "51–150", "151–500", "501–1,000", "1,000+"].map(s => (
                                        <option key={s} value={s}>{s} employees</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-medium mb-2" style={{ color: "#1c3a3a" }}>Plan *</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: "starter", seats: 50, sessions: 4 },
                                        { id: "growth", seats: 150, sessions: 6 },
                                        { id: "enterprise", seats: 500, sessions: 12 },
                                    ].map(p => (
                                        <button key={p.id} type="button"
                                            onClick={() => { set("plan", p.id); set("planSeats", p.seats); set("sessionCap", p.sessions); }}
                                            className="py-3 rounded-xl text-[11px] font-medium border transition-all"
                                            style={{
                                                background: form.plan === p.id ? "rgba(61,139,139,0.08)" : "white",
                                                borderColor: form.plan === p.id ? "#3d8b8b" : "#ddeae2",
                                                color: form.plan === p.id ? "#3d8b8b" : "#7a9088",
                                            }}>
                                            <div className="font-semibold capitalize">{p.id}</div>
                                            <div style={{ color: "#b0c8bc", fontSize: 10 }}>{p.seats} seats · {p.sessions} sessions</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-medium mb-1" style={{ color: "#1c3a3a" }}>Max seats</label>
                                    <input type="number" value={form.planSeats}
                                        onChange={e => set("planSeats", parseInt(e.target.value) || 50)}
                                        className="w-full text-[12px] px-3 py-2.5 rounded-xl border outline-none"
                                        style={{ borderColor: "#ddeae2", color: "#1c3a3a" }} />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-medium mb-1" style={{ color: "#1c3a3a" }}>Sessions / employee / year</label>
                                    <input type="number" value={form.sessionCap}
                                        onChange={e => set("sessionCap", parseInt(e.target.value) || 6)}
                                        className="w-full text-[12px] px-3 py-2.5 rounded-xl border outline-none"
                                        style={{ borderColor: "#ddeae2", color: "#1c3a3a" }} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[11px] font-medium mb-2" style={{ color: "#1c3a3a" }}>Focus areas (optional)</label>
                                <div className="flex flex-wrap gap-2">
                                    {FOCUS_OPTIONS.map(area => {
                                        const active = focusAreas.includes(area);
                                        return (
                                            <button key={area} type="button"
                                                onClick={() => setFocusAreas(a => active ? a.filter(x => x !== area) : [...a, area])}
                                                className="px-2.5 py-1.5 rounded-full text-[11px] border transition-all"
                                                style={{
                                                    background: active ? "rgba(61,139,139,0.08)" : "white",
                                                    borderColor: active ? "#3d8b8b" : "#ddeae2",
                                                    color: active ? "#3d8b8b" : "#7a9088",
                                                }}>
                                                {area}
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="text-[10px] mt-1.5" style={{ color: "#b0c8bc" }}>Leave empty to include all 8 domains.</p>
                            </div>
                            <div className="p-3 rounded-xl" style={{ background: "#f0f7f3" }}>
                                <p className="text-[11px]" style={{ color: "#4a6260" }}>
                                    ✉ A welcome email with the access code will be sent to <strong>{form.contactEmail || "the contact email"}</strong> automatically.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-5 py-4 border-t shrink-0" style={{ borderColor: "#e4eee8" }}>
                    {error && <p className="text-[11px] flex-1 mr-3" style={{ color: "#b94a4f" }}>{error}</p>}
                    {!error && <div className="flex-1" />}
                    <div className="flex gap-2">
                        <button onClick={() => step === 1 ? onClose() : setStep(1)}
                            className="px-4 py-2 rounded-xl text-[12px] border"
                            style={{ borderColor: "#ddeae2", color: "#7a9088" }}>
                            {step === 1 ? "Cancel" : "Back"}
                        </button>
                        <button
                            onClick={() => step === 1 ? setStep(2) : handleCreate()}
                            disabled={submitting || (step === 1 && (!form.name || !form.contactEmail || !form.hrEmail))}
                            className="px-4 py-2 rounded-xl text-[12px] font-medium text-white flex items-center gap-1.5 disabled:opacity-40"
                            style={{ background: "linear-gradient(135deg, #4e8c6a, #3d8b8b)" }}>
                            {submitting && <Loader2 size={12} className="animate-spin" />}
                            {step === 1 ? "Next →" : submitting ? "Creating…" : "Create & Send Welcome Email"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Company Row ───────────────────────────────────────────────────────────────

function CompanyRow({ company, onCopy }: { company: Company; onCopy: (code: string) => void }) {
    const improving = company.avgImprovement > 0;
    return (
        <div className="bg-white rounded-2xl border mb-3 overflow-hidden hover:shadow-md transition-shadow"
            style={{ borderColor: "#e4eee8" }}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4">
                {/* Info */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold shrink-0"
                        style={{ background: "linear-gradient(135deg, #4e8c6a, #3d8b8b)", fontSize: 14 }}>
                        {company.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                            <span className="text-[13px] font-semibold truncate" style={{ color: "#1c3a3a" }}>{company.name}</span>
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                                style={{ background: `${PLAN_COLORS[company.plan] ?? "#8da898"}18`, color: PLAN_COLORS[company.plan] ?? "#8da898" }}>
                                {company.plan}
                            </span>
                            {company.billingStatus === "overdue" && (
                                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                                    style={{ background: "rgba(185,74,79,0.1)", color: "#b94a4f" }}>Overdue</span>
                            )}
                        </div>
                        <p className="text-[11px]" style={{ color: "#7a9088" }}>{company.industry} · {company.contactName}</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex items-center flex-wrap gap-4 sm:gap-5">
                    <div className="text-center">
                        <div className="text-[14px] font-bold" style={{ color: "#1c3a3a" }}>{company.enrolled}</div>
                        <div className="text-[9px] uppercase tracking-widest" style={{ color: "#b0c8bc" }}>enrolled</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[14px] font-bold" style={{ color: improving ? "#4e8c6a" : company.avgImprovement === 0 ? "#8da898" : "#b94a4f" }}>
                            {improving ? "▼" : "—"} {company.avgImprovement}%
                        </div>
                        <div className="text-[9px] uppercase tracking-widest" style={{ color: "#b0c8bc" }}>improvement</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[14px] font-bold" style={{ color: company.atRiskCount > 0 ? "#b94a4f" : "#4e8c6a" }}>
                            {company.atRiskCount}
                        </div>
                        <div className="text-[9px] uppercase tracking-widest" style={{ color: "#b0c8bc" }}>at risk</div>
                    </div>
                    <button onClick={() => onCopy(company.accessCode)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-mono"
                        style={{ borderColor: "#ddeae2", color: "#4e8c6a" }}>
                        <Copy size={10} /> {company.accessCode}
                    </button>
                    <Link href={`/admin/companies/${company.id}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-medium text-white shrink-0"
                        style={{ background: "linear-gradient(135deg, #4e8c6a, #3d8b8b)" }}>
                        Manage <ChevronRight size={12} />
                    </Link>
                </div>
            </div>

            {/* Session bar */}
            <div className="px-4 pb-3">
                <div className="flex justify-between mb-1">
                    <span className="text-[9px] uppercase tracking-widest" style={{ color: "#b0c8bc" }}>Sessions used</span>
                    <span className="text-[9px]" style={{ color: "#b0c8bc" }}>
                        {company.sessionsUsed} / {company.enrolled * company.sessionCap}
                    </span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: "#f0f7f3" }}>
                    <div className="h-full rounded-full" style={{
                        width: `${Math.min(company.enrolled * company.sessionCap > 0 ? (company.sessionsUsed / (company.enrolled * company.sessionCap)) * 100 : 0, 100)}%`,
                        background: "linear-gradient(90deg, #4e8c6a, #3d8b8b)",
                    }} />
                </div>
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminCompaniesPage() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState("");
    const [filterPlan, setFilterPlan] = useState("all");
    const [copied, setCopied] = useState<string | null>(null);

    const load = useCallback(async (silent = false) => {
        if (!silent) setLoading(true); else setRefreshing(true);
        try {
            const res = await fetch("/api/admin/companies");
            const j = await res.json();
            if (j.success) setCompanies(j.companies);
        } finally { setLoading(false); setRefreshing(false); }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code).catch(() => { });
        setCopied(code);
        setTimeout(() => setCopied(null), 2000);
    };

    const filtered = companies
        .filter(c => {
            const q = search.toLowerCase();
            return c.name.toLowerCase().includes(q) || c.contactEmail.toLowerCase().includes(q) || c.hrEmail.toLowerCase().includes(q);
        })
        .filter(c => filterPlan === "all" || c.plan === filterPlan);

    // const totals = {
    //     enrolled: companies.reduce((s, c) => s + c.enrolled, 0),
    //     sessions: companies.reduce((s, c) => s + c.sessionsUsed, 0),
    //     atRisk: companies.reduce((s, c) => s + c.atRiskCount, 0),
    //     avgImprov: companies.length > 0 ? Math.round(companies.reduce((s, c) => s + c.avgImprovement, 0) / companies.length) : 0,
    // };

    const totals = {
        enrolled: companies.reduce((s, c) => s + (c.enrolled || 0), 0),
        sessions: companies.reduce((s, c) => s + (c.sessionsUsed || 0), 0),
        atRisk: companies.reduce((s, c) => s + (c.atRiskCount || 0), 0),
        avgImprov: companies.length > 0
            ? Math.round(companies.reduce((s, c) => s + (c.avgImprovement || 0), 0) / companies.length)
            : 0,
    };

    return (
        <div className="flex flex-col gap-4 sm:gap-5 pb-8">
            {showModal && <AddCompanyModal onClose={() => setShowModal(false)} onCreated={c => { setCompanies(p => [c as Company, ...p]); }} />}
            {copied && (
                <div className="fixed bottom-5 right-5 z-[400] px-4 py-3 rounded-xl text-[12px] font-medium text-white shadow-lg flex items-center gap-2"
                    style={{ background: "#4e8c6a" }}>
                    <CheckCircle size={14} /> Copied: {copied}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-[18px] sm:text-[20px] font-bold" style={{ color: "#1c3a3a" }}>EAP Company Clients</h1>
                    <p className="text-[12px] mt-0.5" style={{ color: "#7a9088" }}>Manage subscribed companies and their employee wellness programmes.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => load(true)} disabled={refreshing}
                        className="p-2 rounded-xl border" style={{ borderColor: "#ddeae2", color: "#7a9088" }}>
                        <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
                    </button>
                    <button onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium text-white"
                        style={{ background: "linear-gradient(135deg, #4e8c6a, #3d8b8b)" }}>
                        <Plus size={14} /> Add Company
                    </button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                {[
                    { label: "Active companies", value: companies.filter(c => c.status === "active").length },
                    { label: "Total employees", value: totals.enrolled },
                    { label: "Sessions delivered", value: totals.sessions },
                    { label: "Avg improvement", value: `${totals.avgImprov}%` },
                ].map(k => (
                    <div key={k.label} className="bg-white rounded-2xl border p-4" style={{ borderColor: "#e4eee8" }}>
                        <div className="text-[20px] font-bold mb-0.5" style={{ fontFamily: "Georgia", color: "#1c3a3a" }}>{k.value}</div>
                        <div className="text-[10px] uppercase tracking-widest" style={{ color: "#b0c8bc" }}>{k.label}</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#b0c8bc" }} />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search companies…"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-[12px] outline-none"
                        style={{ borderColor: "#ddeae2", color: "#1c3a3a", background: "white" }} />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                    {["all", "starter", "growth", "enterprise", "trial"].map(p => (
                        <button key={p} onClick={() => setFilterPlan(p)}
                            className="px-3 py-2 rounded-xl text-[11px] font-medium border capitalize transition-all"
                            style={{
                                background: filterPlan === p ? "rgba(61,139,139,0.08)" : "white",
                                borderColor: filterPlan === p ? "#3d8b8b" : "#ddeae2",
                                color: filterPlan === p ? "#3d8b8b" : "#7a9088",
                            }}>{p}</button>
                    ))}
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex flex-col gap-3">
                    {Array.from({ length: 3 }).map((_, i) => <div key={i} className="animate-pulse rounded-2xl h-24 bg-[#e8f0ec]" />)}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-[13px]" style={{ color: "#7a9088" }}>
                    {search ? `No companies matching "${search}"` : "No companies yet. Add your first client."}
                </div>
            ) : (
                filtered.map(c => <CompanyRow key={c.id} company={c} onCopy={handleCopy} />)
            )}
        </div>
    );
}