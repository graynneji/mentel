// "use client";

// // app/eap/page.tsx
// // Company EAP landing page — distinct from homepage.
// // Targets HR directors / decision-makers. Professional, authoritative tone.
// // Companies enquire → get onboarded by admin → get access code → employees self-enrol.

// import Link from "next/link";
// import {
//     Shield, BarChart2, Users, Brain, Heart, Flame,
//     CheckCircle, ArrowRight, Building2, Star, Clock,
//     TrendingDown, Lock, Leaf, ChevronDown, Globe, Phone,
//     Mail, Sparkles,
// } from "lucide-react";
// import { useState } from "react";

// // ─── Data ─────────────────────────────────────────────────────────────────────

// const PLANS = [
//     {
//         id: "starter",
//         name: "Starter",
//         tag: "For teams up to 50",
//         priceMonth: 180_000,
//         priceLabel: "₦180,000",
//         seats: 50,
//         sessions: 4,
//         features: [
//             "Up to 50 employee seats",
//             "4 therapy sessions per employee / year",
//             "Comprehensive multi-domain assessment",
//             "Monthly aggregate HR reports",
//             "Email support",
//         ],
//         cta: "Get Started",
//         highlight: false,
//     },
//     {
//         id: "growth",
//         name: "Growth",
//         tag: "Most popular",
//         priceMonth: 420_000,
//         priceLabel: "₦420,000",
//         seats: 150,
//         sessions: 6,
//         features: [
//             "Up to 150 employee seats",
//             "6 therapy sessions per employee / year",
//             "Comprehensive multi-domain assessment",
//             "Real-time HR dashboard + progress tracking",
//             "Couples & relationship support included",
//             "Dedicated account manager",
//             "Quarterly strategy review",
//         ],
//         cta: "Start Free Trial",
//         highlight: true,
//     },
//     {
//         id: "enterprise",
//         name: "Enterprise",
//         tag: "For 150+ employees",
//         priceMonth: null,
//         priceLabel: "Custom pricing",
//         seats: 999,
//         sessions: 12,
//         features: [
//             "Unlimited employee seats",
//             "Up to 12 sessions per employee / year",
//             "Custom assessment domains",
//             "White-labelled HR portal",
//             "On-site workshops & group sessions",
//             "API access & HRIS integration",
//             "24/7 crisis support line",
//             "SLA guarantee",
//         ],
//         cta: "Book a Demo",
//         highlight: false,
//     },
// ];

// const OUTCOMES = [
//     { stat: "32%", label: "Reduction in absenteeism", sub: "Average across client companies in year 1" },
//     { stat: "4.1×", label: "ROI on EAP spend", sub: "Every ₦1 invested returns ₦4.10 in productivity" },
//     { stat: "89%", label: "Employee satisfaction", sub: "With Mentel therapists specifically" },
//     { stat: "48hrs", label: "First session turnaround", sub: "From assessment completion to therapist contact" },
// ];

// const DOMAINS_COVERED = [
//     { icon: Brain, label: "Stress & Anxiety", desc: "GAD-7 and PSS validated instruments" },
//     { icon: Brain, label: "Depression", desc: "PHQ-9 aligned screening" },
//     { icon: Flame, label: "Burnout", desc: "MBI-aligned occupational burnout" },
//     { icon: Heart, label: "Relationships", desc: "Marriage, partnership, intimacy — personalised" },
//     { icon: Star, label: "Self-esteem", desc: "Identity, confidence and inner criticism" },
//     { icon: Clock, label: "Sleep quality", desc: "PSQI-informed sleep disruption screening" },
// ];

// const TESTIMONIALS = [
//     {
//         quote: "Our 6-month data showed a 28% drop in sick days and our engagement scores went up 19 points. The HR dashboard is genuinely useful, not just a vanity metric board.",
//         name: "Ngozi A.",
//         role: "Head of People, Fintech startup — Lagos",
//         stars: 5,
//     },
//     {
//         quote: "What sold us was the confidentiality architecture. Employees actually trust it because they can see their data is protected. Uptake was 71% in month one.",
//         name: "Emeka O.",
//         role: "HR Director, Manufacturing firm — Abuja",
//         stars: 5,
//     },
//     {
//         quote: "The couples support module surprised us. We didn't expect employees to use it but 18% did in Q1. It clearly addresses a real need.",
//         name: "Funmi B.",
//         role: "Chief People Officer, FMCG company — PH",
//         stars: 5,
//     },
// ];

// const FAQS = [
//     { q: "Can employees use it anonymously?", a: "Yes. Companies can enable anonymous mode. Employees complete the assessment without providing their name and are matched to a therapist via a reference code. HR sees only aggregate data at all times." },
//     { q: "What does HR actually see in the dashboard?", a: "HR sees anonymised population-level data: risk band distribution, domain scores, session utilisation, trend over time, and improvement percentages. No individual employee data is ever shown." },
//     { q: "Are your therapists qualified for occupational/EAP work?", a: "Yes. All Mentel therapists are licensed and those assigned to EAP accounts have additional training in occupational and workplace mental health." },
//     { q: "Can we customise which assessment domains are shown?", a: "On Growth and Enterprise plans, you can select focus areas relevant to your workforce (e.g. turn off the relationship domain for a preference, or add custom questions with admin approval)." },
//     { q: "How does billing work?", a: "Monthly subscriptions billed in NGN. Enterprise plans can be invoiced quarterly or annually. All plans include a 14-day free trial." },
//     { q: "What if an employee is in crisis?", a: "The assessment flags crisis indicators automatically. Flagged employees are contacted within hours by a clinical team member, not left to wait. Enterprise plans include a 24/7 crisis line." },
// ];

// // ─── Sub-components ───────────────────────────────────────────────────────────

// function StatPill({ stat, label, sub }: { stat: string; label: string; sub: string }) {
//     return (
//         <div className="text-center px-4">
//             <p className="font-cormorant font-semibold mb-1" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--deep)", letterSpacing: "-0.02em" }}>
//                 {stat}
//             </p>
//             <p className="text-sm font-medium mb-1" style={{ color: "var(--deep)" }}>{label}</p>
//             <p className="text-xs font-light" style={{ color: "var(--text-muted)", maxWidth: 160, margin: "0 auto" }}>{sub}</p>
//         </div>
//     );
// }

// // ─── Enquiry Form ─────────────────────────────────────────────────────────────

// function EnquiryForm() {
//     const [submitted, setSubmitted] = useState(false);
//     const [form, setForm] = useState({ companyName: "", contactName: "", email: "", phone: "", size: "", plan: "growth", planSeats: 150, sessionCap: 6, focusAreas: DOMAINS_COVERED.map(d => d.label) });

//  const handleCreate = async () => {
//         setSubmitting(true);
//         setError("");
//         try {
//             const res = await fetch("/api/admin/companies", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ ...form, focusAreas }),
//             });
//             const data = await res.json();
//             if (!res.ok || !data.success) { setError(data.error ?? "Failed to create."); return; }
//             onCreated(data.company);
//             onClose();
//         } catch { setError("Network error. Please try again."); }
//         finally { setSubmitting(false); }
//     };

//     if (submitted) {
//         return (
//             <div className="text-center py-10">
//                 <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
//                     style={{ background: "rgba(78,140,106,0.15)" }}>
//                     <CheckCircle size={28} style={{ color: "var(--sage-dark)" }} />
//                 </div>
//                 <h3 className="font-cormorant text-2xl font-light mb-2" style={{ color: "var(--deep)" }}>
//                     Enquiry received!
//                 </h3>
//                 <p className="text-sm font-light" style={{ color: "var(--text-muted)" }}>
//                     Our enterprise team will reach out within one business day to walk you through onboarding and your free trial.
//                 </p>
//             </div>
//         );
//     }

//     return (
//         <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 {[
//                     { key: "companyName", label: "Company name", placeholder: "Zenith Bank PLC" },
//                     { key: "contactName", label: "Your name", placeholder: "Ngozi Adeola" },
//                 ].map(({ key, label, placeholder }) => (
//                     <div key={key}>
//                         <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--deep)" }}>{label}</label>
//                         <input
//                             required
//                             value={form[key as keyof typeof form]}
//                             onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
//                             placeholder={placeholder}
//                             className="w-full text-sm px-3.5 py-2.5 rounded-xl border outline-none focus:ring-2 transition-all"
//                             style={{ borderColor: "var(--border)", color: "var(--deep)", background: "white" }}
//                         />
//                     </div>
//                 ))}
//             </div>
//             <div>
//                 <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--deep)" }}>Work email</label>
//                 <input
//                     required type="email"
//                     value={form.email}
//                     onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
//                     placeholder="ngozi@company.com"
//                     className="w-full text-sm px-3.5 py-2.5 rounded-xl border outline-none transition-all"
//                     style={{ borderColor: "var(--border)", color: "var(--deep)", background: "white" }}
//                 />
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                     <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--deep)" }}>Phone (optional)</label>
//                     <input
//                         value={form.phone}
//                         onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
//                         placeholder="+234 800 000 0000"
//                         className="w-full text-sm px-3.5 py-2.5 rounded-xl border outline-none transition-all"
//                         style={{ borderColor: "var(--border)", color: "var(--deep)", background: "white" }}
//                     />
//                 </div>
//                 <div>
//                     <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--deep)" }}>Company size</label>
//                     <select
//                         required
//                         value={form.size}
//                         onChange={e => setForm(f => ({ ...f, size: e.target.value }))}
//                         className="w-full text-sm px-3.5 py-2.5 rounded-xl border outline-none transition-all"
//                         style={{ borderColor: "var(--border)", color: "var(--deep)", background: "white" }}
//                     >
//                         <option value="">Select size…</option>
//                         {["1–50", "51–150", "151–500", "501–1,000", "1,000+"].map(s => (
//                             <option key={s} value={s}>{s} employees</option>
//                         ))}
//                     </select>
//                 </div>
//             </div>
//             <div>
//                 <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--deep)" }}>Plan of interest</label>
//                 <div className="grid grid-cols-3 gap-2">
//                     {PLANS.map(p => (
//                         <button key={p.id} type="button"
//                             onClick={() => setForm(f => ({ ...f, plan: p.id }))}
//                             className="py-2.5 rounded-xl text-xs font-medium border transition-all"
//                             style={{
//                                 background: form.plan === p.id ? "rgba(61,139,139,0.1)" : "white",
//                                 borderColor: form.plan === p.id ? "var(--teal)" : "var(--border)",
//                                 color: form.plan === p.id ? "var(--teal)" : "var(--text-muted)",
//                             }}>
//                             {p.name}
//                         </button>
//                     ))}
//                 </div>
//             </div>
//             <button type="submit"
//                 className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white py-3.5 rounded-xl"
//                 style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}>
//                 Request Demo & Free Trial
//                 <ArrowRight size={15} />
//             </button>
//             <p className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
//                 <Lock size={10} style={{ display: "inline", marginRight: 4 }} />
//                 Your information is handled in accordance with NDPR. No spam, ever.
//             </p>
//         </form>
//     );
// }

// // ─── Page ─────────────────────────────────────────────────────────────────────

// export default function EAPLandingPage() {
//     const [openFaq, setOpenFaq] = useState<number | null>(null);

//     return (
//         <div className="relative overflow-x-hidden">
//             {/* ── Hero ── */}
//             <section className="relative z-10 pt-20 pb-16 sm:pt-24 sm:pb-20 border-b" style={{ borderColor: "var(--border)" }}>
//                 <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-16 lg:items-start">

//                         {/* Left: copy */}
//                         <div className="lg:pt-4">
//                             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-5 border"
//                                 style={{ background: "rgba(123,169,139,0.12)", borderColor: "rgba(123,169,139,0.3)", color: "var(--sage-dark)" }}>
//                                 <Building2 size={10} />
//                                 Employee Assistance Programme
//                             </div>

//                             <h1 className="font-cormorant text-4xl sm:text-5xl lg:text-6xl font-light leading-tight mb-5"
//                                 style={{ color: "var(--deep)", letterSpacing: "-0.02em" }}>
//                                 Your people are your<br />
//                                 greatest <em className="italic" style={{ color: "var(--sage-dark)" }}>asset</em>.
//                             </h1>

//                             <p className="text-base sm:text-lg leading-relaxed mb-6 font-light" style={{ color: "var(--text-muted)", maxWidth: 460 }}>
//                                 Mentel EAP gives your employees confidential access to licensed therapists, a comprehensive wellbeing assessment, and a clear path to recovery — while giving your HR team the anonymised insights they need to build a healthier organisation.
//                             </p>

//                             <div className="flex flex-col gap-3 mb-8">
//                                 {[
//                                     "Comprehensive 8-domain assessment — stress, anxiety, depression, burnout, sleep, relationships, self-esteem",
//                                     "Individual-to-therapist matching within 24 hours",
//                                     "HR dashboard with population-level trend analytics",
//                                     "Employee data never disclosed to employer",
//                                 ].map(item => (
//                                     <div key={item} className="flex items-start gap-3">
//                                         <CheckCircle size={16} style={{ color: "var(--sage-dark)", flexShrink: 0, marginTop: 2 }} />
//                                         <span className="text-sm font-light" style={{ color: "var(--text-muted)" }}>{item}</span>
//                                     </div>
//                                 ))}
//                             </div>

//                             <div className="flex flex-wrap gap-3">
//                                 <a href="#enquire"
//                                     className="inline-flex items-center gap-2 text-sm font-medium text-white px-6 py-3 rounded-full"
//                                     style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}>
//                                     Book a Demo
//                                     <ArrowRight size={14} />
//                                 </a>
//                                 <a href="#pricing"
//                                     className="inline-flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-full border"
//                                     style={{ borderColor: "var(--border)", color: "var(--sage-dark)" }}>
//                                     View Pricing
//                                 </a>
//                             </div>
//                         </div>

//                         {/* Right: social proof + trust */}
//                         <div className="pt-12 lg:pt-0">
//                             <div className="rounded-2xl border p-6 sm:p-8" style={{ background: "white", borderColor: "var(--border)" }}>
//                                 <div className="text-xs uppercase tracking-widest font-medium mb-4" style={{ color: "var(--sage-dark)" }}>
//                                     How it works for employees
//                                 </div>
//                                 {[
//                                     { step: "1", title: "Employee receives access code from HR", desc: "Unique per company. Takes 2 minutes to enrol." },
//                                     { step: "2", title: "Complete the 8-domain assessment", desc: "Personalised questions. Anonymous option available." },
//                                     { step: "3", title: "Matched to a licensed therapist", desc: "Within 24 hours. Based on their specific profile." },
//                                     { step: "4", title: "Sessions begin. Progress is tracked.", desc: "Improvement visible over time. HR sees aggregate data only." },
//                                 ].map((s, i) => (
//                                     <div key={i} className="flex gap-4 mb-5 last:mb-0">
//                                         <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
//                                             style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}>
//                                             {s.step}
//                                         </div>
//                                         <div>
//                                             <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--deep)" }}>{s.title}</p>
//                                             <p className="text-xs font-light" style={{ color: "var(--text-muted)" }}>{s.desc}</p>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>

//                             {/* Logos / trust */}
//                             <div className="mt-4 flex items-center gap-3 px-2">
//                                 <Shield size={14} style={{ color: "var(--sage-dark)" }} />
//                                 <span className="text-xs font-light" style={{ color: "var(--text-muted)" }}>
//                                     NDPR-compliant · End-to-end encrypted · Licensed therapists only
//                                 </span>
//                             </div>
//                         </div>

//                     </div>
//                 </div>
//             </section>

//             {/* ── Outcomes strip ── */}
//             <section className="relative z-10">
//                 <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="grid grid-cols-2 sm:grid-cols-4 py-10 gap-6">
//                         {OUTCOMES.map(o => <StatPill key={o.stat} {...o} />)}
//                     </div>
//                     <div className="h-px w-full" style={{ background: "var(--border)" }} />
//                 </div>
//             </section>

//             {/* ── Assessment domains ── */}
//             <section className="relative z-10 py-14 border-b" style={{ borderColor: "var(--border)" }}>
//                 <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="text-center mb-10">
//                         <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4 border"
//                             style={{ background: "rgba(123,169,139,0.10)", borderColor: "rgba(123,169,139,0.25)", color: "var(--sage-dark)" }}>
//                             <Sparkles size={11} />
//                             The Assessment
//                         </div>
//                         <h2 className="font-cormorant text-3xl sm:text-4xl font-light mb-3" style={{ color: "var(--deep)" }}>
//                             Not a quick quiz. A clinical-grade<br />
//                             <em className="italic" style={{ color: "var(--sage-dark)" }}>employee wellbeing profile.</em>
//                         </h2>
//                         <p className="text-sm sm:text-base max-w-md mx-auto font-light" style={{ color: "var(--text-muted)" }}>
//                             Our assessment covers 8 interconnected domains, adapts based on relationship status, and flags crisis indicators in real-time.
//                         </p>
//                     </div>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                         {DOMAINS_COVERED.map(({ icon: Icon, label, desc }) => (
//                             <div key={label} className="flex items-start gap-4 rounded-2xl p-5 border"
//                                 style={{ background: "white", borderColor: "var(--border)" }}>
//                                 <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
//                                     style={{ background: "rgba(123,169,139,0.12)" }}>
//                                     <Icon size={17} style={{ color: "var(--sage-dark)" }} />
//                                 </div>
//                                 <div>
//                                     <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--deep)" }}>{label}</p>
//                                     <p className="text-xs font-light" style={{ color: "var(--text-muted)" }}>{desc}</p>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                     <div className="mt-6 rounded-2xl p-5 sm:p-6 border-l-4 flex flex-col sm:flex-row gap-4 items-start"
//                         style={{ background: "rgba(123,169,139,0.05)", borderLeftColor: "var(--sage)", border: "1px solid rgba(123,169,139,0.2)" }}>
//                         <Lock size={16} style={{ color: "var(--sage-dark)", flexShrink: 0, marginTop: 2 }} />
//                         <div>
//                             <p className="text-sm font-semibold mb-1" style={{ color: "var(--deep)" }}>Privacy by design — not by policy</p>
//                             <p className="text-sm font-light" style={{ color: "var(--text-muted)" }}>
//                                 Individual answers are encrypted at rest. HR dashboards show only population aggregates. Relationship and intimacy questions are specifically excluded from any employer-visible report. Your employees can trust the process.
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* ── Pricing ── */}
//             <section id="pricing" className="relative z-10 py-14 border-b" style={{ borderColor: "var(--border)" }}>
//                 <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="text-center mb-10">
//                         <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4 border"
//                             style={{ background: "rgba(123,169,139,0.10)", borderColor: "rgba(123,169,139,0.25)", color: "var(--sage-dark)" }}>
//                             <Leaf size={11} />
//                             Pricing
//                         </div>
//                         <h2 className="font-cormorant text-3xl sm:text-4xl font-light" style={{ color: "var(--deep)" }}>
//                             Simple, transparent plans
//                         </h2>
//                     </div>
//                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
//                         {PLANS.map(plan => (
//                             <div key={plan.id}
//                                 className="relative rounded-2xl border p-6 flex flex-col"
//                                 style={{
//                                     background: plan.highlight ? "linear-gradient(135deg, rgba(61,139,139,0.06), rgba(123,169,139,0.06))" : "white",
//                                     borderColor: plan.highlight ? "var(--teal)" : "var(--border)",
//                                     boxShadow: plan.highlight ? "0 4px 24px rgba(61,139,139,0.12)" : "none",
//                                 }}>
//                                 {plan.highlight && (
//                                     <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold text-white"
//                                         style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}>
//                                         {plan.tag}
//                                     </div>
//                                 )}
//                                 {!plan.highlight && (
//                                     <div className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>{plan.tag}</div>
//                                 )}
//                                 <h3 className="font-cormorant text-2xl font-semibold mb-1" style={{ color: "var(--deep)" }}>{plan.name}</h3>
//                                 <div className="mb-4">
//                                     <span className="text-2xl font-bold" style={{ color: "var(--deep)" }}>{plan.priceLabel}</span>
//                                     {plan.priceMonth && <span className="text-xs ml-1" style={{ color: "var(--text-muted)" }}>/month</span>}
//                                 </div>
//                                 <div className="flex-1 space-y-2.5 mb-6">
//                                     {plan.features.map(f => (
//                                         <div key={f} className="flex items-start gap-2">
//                                             <CheckCircle size={13} style={{ color: "var(--sage-dark)", flexShrink: 0, marginTop: 2 }} />
//                                             <span className="text-xs font-light" style={{ color: "var(--text-muted)" }}>{f}</span>
//                                         </div>
//                                     ))}
//                                 </div>
//                                 <a href="#enquire"
//                                     className="flex items-center justify-center gap-2 text-sm font-medium py-3 rounded-xl text-white transition-all"
//                                     style={{ background: plan.highlight ? "linear-gradient(135deg, var(--sage-dark), var(--teal))" : "var(--deep)" }}>
//                                     {plan.cta}
//                                     <ArrowRight size={13} />
//                                 </a>
//                             </div>
//                         ))}
//                     </div>
//                     <p className="text-center text-xs mt-4 font-light" style={{ color: "var(--text-muted)" }}>
//                         All plans include a 14-day free trial. No credit card required to start.
//                     </p>
//                 </div>
//             </section>

//             {/* ── Testimonials ── */}
//             <section className="relative z-10 py-14 border-b" style={{ borderColor: "var(--border)" }}>
//                 <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="text-center mb-10">
//                         <h2 className="font-cormorant text-3xl sm:text-4xl font-light" style={{ color: "var(--deep)" }}>
//                             What HR leaders say
//                         </h2>
//                     </div>
//                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
//                         {TESTIMONIALS.map(t => (
//                             <div key={t.name} className="rounded-2xl p-6 border" style={{ background: "white", borderColor: "var(--border)" }}>
//                                 <div className="flex gap-0.5 mb-3">
//                                     {Array.from({ length: t.stars }).map((_, i) => (
//                                         <Star key={i} size={12} fill="var(--sage)" style={{ color: "var(--sage)" }} />
//                                     ))}
//                                 </div>
//                                 <p className="text-sm leading-relaxed mb-5 font-light italic" style={{ color: "var(--text)" }}>
//                                     &ldquo;{t.quote}&rdquo;
//                                 </p>
//                                 <div className="border-t pt-4" style={{ borderColor: "var(--border)" }}>
//                                     <p className="text-xs font-semibold" style={{ color: "var(--deep)" }}>{t.name}</p>
//                                     <p className="text-xs font-light" style={{ color: "var(--text-muted)" }}>{t.role}</p>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             {/* ── FAQ ── */}
//             <section className="relative z-10 py-14 border-b" style={{ borderColor: "var(--border)" }}>
//                 <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="text-center mb-10">
//                         <h2 className="font-cormorant text-3xl sm:text-4xl font-light" style={{ color: "var(--deep)" }}>
//                             Questions from HR teams
//                         </h2>
//                     </div>
//                     <div className="space-y-3">
//                         {FAQS.map((faq, i) => (
//                             <div key={i} className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)", background: "white" }}>
//                                 <button
//                                     onClick={() => setOpenFaq(openFaq === i ? null : i)}
//                                     className="w-full flex items-center justify-between px-5 py-4 text-left"
//                                     style={{ color: "var(--deep)" }}>
//                                     <span className="text-sm font-medium pr-4">{faq.q}</span>
//                                     <ChevronDown size={16} style={{ color: "var(--sage-dark)", flexShrink: 0, transform: openFaq === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
//                                 </button>
//                                 {openFaq === i && (
//                                     <div className="px-5 pb-5">
//                                         <p className="text-sm leading-relaxed font-light" style={{ color: "var(--text-muted)" }}>{faq.a}</p>
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             {/* ── Enquiry Form ── */}
//             <section id="enquire" className="relative z-10 py-14">
//                 <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="text-center mb-8">
//                         <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4 border"
//                             style={{ background: "rgba(123,169,139,0.10)", borderColor: "rgba(123,169,139,0.25)", color: "var(--sage-dark)" }}>
//                             <Building2 size={11} />
//                             Get Started
//                         </div>
//                         <h2 className="font-cormorant text-3xl sm:text-4xl font-light mb-3" style={{ color: "var(--deep)" }}>
//                             Ready to invest in your<br />
//                             <em className="italic" style={{ color: "var(--sage-dark)" }}>people&apos;s wellbeing?</em>
//                         </h2>
//                         <p className="text-sm font-light" style={{ color: "var(--text-muted)" }}>
//                             Fill in your details and our enterprise team will contact you within one business day.
//                         </p>
//                     </div>
//                     <div className="rounded-2xl border p-6 sm:p-8" style={{ background: "white", borderColor: "var(--border)" }}>
//                         <EnquiryForm />
//                     </div>
//                     <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
//                         <a href="mailto:eap@mentel.com" className="flex items-center gap-1.5 hover:underline">
//                             <Mail size={12} />
//                             eap@mentel.com
//                         </a>
//                         <a href="tel:+2341234567890" className="flex items-center gap-1.5 hover:underline">
//                             <Phone size={12} />
//                             +234 123 456 7890
//                         </a>
//                     </div>
//                 </div>
//             </section>
//         </div>
//     );
// }

"use client";

import Link from "next/link";
import {
    Shield, BarChart2, Users, Brain, Heart, Flame,
    CheckCircle, ArrowRight, Building2, Star, Clock,
    TrendingDown, Lock, Leaf, ChevronDown, Globe, Phone,
    Mail, Sparkles,
} from "lucide-react";
import { useState } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLANS = [
    {
        id: "starter",
        name: "Starter",
        tag: "For teams up to 50",
        priceMonth: 180_000,
        priceLabel: "₦180,000",
        seats: 50,
        sessions: 4,
        features: [
            "Up to 50 employee seats",
            "4 therapy sessions per employee / year",
            "Comprehensive multi-domain assessment",
            "Monthly aggregate HR reports",
            "Email support",
        ],
        cta: "Get Started",
        highlight: false,
    },
    {
        id: "growth",
        name: "Growth",
        tag: "Most popular",
        priceMonth: 420_000,
        priceLabel: "₦420,000",
        seats: 150,
        sessions: 6,
        features: [
            "Up to 150 employee seats",
            "6 therapy sessions per employee / year",
            "Comprehensive multi-domain assessment",
            "Real-time HR dashboard + progress tracking",
            "Couples & relationship support included",
            "Dedicated account manager",
            "Quarterly strategy review",
        ],
        cta: "Start Free Trial",
        highlight: true,
    },
    {
        id: "enterprise",
        name: "Enterprise",
        tag: "For 150+ employees",
        priceMonth: null,
        priceLabel: "Custom pricing",
        seats: 999,
        sessions: 12,
        features: [
            "Unlimited employee seats",
            "Up to 12 sessions per employee / year",
            "Custom assessment domains",
            "White-labelled HR portal",
            "On-site workshops & group sessions",
            "API access & HRIS integration",
            "24/7 crisis support line",
            "SLA guarantee",
        ],
        cta: "Book a Demo",
        highlight: false,
    },
];

const OUTCOMES = [
    { stat: "32%", label: "Reduction in absenteeism", sub: "Average across client companies in year 1" },
    { stat: "4.1×", label: "ROI on EAP spend", sub: "Every ₦1 invested returns ₦4.10 in productivity" },
    { stat: "89%", label: "Employee satisfaction", sub: "With Mentel therapists specifically" },
    { stat: "48hrs", label: "First session turnaround", sub: "From assessment completion to therapist contact" },
];

const DOMAINS_COVERED = [
    { icon: Brain, label: "Stress & Anxiety", desc: "GAD-7 and PSS validated instruments" },
    { icon: Brain, label: "Depression", desc: "PHQ-9 aligned screening" },
    { icon: Flame, label: "Burnout", desc: "MBI-aligned occupational burnout" },
    { icon: Heart, label: "Relationships", desc: "Marriage, partnership, intimacy — personalised" },
    { icon: Star, label: "Self-esteem", desc: "Identity, confidence and inner criticism" },
    { icon: Clock, label: "Sleep quality", desc: "PSQI-informed sleep disruption screening" },
];

const TESTIMONIALS = [
    {
        quote: "Our 6-month data showed a 28% drop in sick days and our engagement scores went up 19 points. The HR dashboard is genuinely useful, not just a vanity metric board.",
        name: "Ngozi A.",
        role: "Head of People, Fintech startup — Lagos",
        stars: 5,
    },
    {
        quote: "What sold us was the confidentiality architecture. Employees actually trust it because they can see their data is protected. Uptake was 71% in month one.",
        name: "Emeka O.",
        role: "HR Director, Manufacturing firm — Abuja",
        stars: 5,
    },
    {
        quote: "The couples support module surprised us. We didn't expect employees to use it but 18% did in Q1. It clearly addresses a real need.",
        name: "Funmi B.",
        role: "Chief People Officer, FMCG company — PH",
        stars: 5,
    },
];

const FAQS = [
    { q: "Can employees use it anonymously?", a: "Yes. Companies can enable anonymous mode. Employees complete the assessment without providing their name and are matched to a therapist via a reference code. HR sees only aggregate data at all times." },
    { q: "What does HR actually see in the dashboard?", a: "HR sees anonymised population-level data: risk band distribution, domain scores, session utilisation, trend over time, and improvement percentages. No individual employee data is ever shown." },
    { q: "Are your therapists qualified for occupational/EAP work?", a: "Yes. All Mentel therapists are licensed and those assigned to EAP accounts have additional training in occupational and workplace mental health." },
    { q: "Can we customise which assessment domains are shown?", a: "On Growth and Enterprise plans, you can select focus areas relevant to your workforce (e.g. turn off the relationship domain for a preference, or add custom questions with admin approval)." },
    { q: "How does billing work?", a: "Monthly subscriptions billed in NGN. Enterprise plans can be invoiced quarterly or annually. All plans include a 14-day free trial." },
    { q: "What if an employee is in crisis?", a: "The assessment flags crisis indicators automatically. Flagged employees are contacted within hours by a clinical team member, not left to wait. Enterprise plans include a 24/7 crisis line." },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatPill({ stat, label, sub }: { stat: string; label: string; sub: string }) {
    return (
        <div className="text-center px-4">
            <p className="font-cormorant font-semibold mb-1" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--deep)", letterSpacing: "-0.02em" }}>
                {stat}
            </p>
            <p className="text-sm font-medium mb-1" style={{ color: "var(--deep)" }}>{label}</p>
            <p className="text-xs font-light" style={{ color: "var(--text-muted)", maxWidth: 160, margin: "0 auto" }}>{sub}</p>
        </div>
    );
}

// ─── Enquiry Form ─────────────────────────────────────────────────────────────

function EnquiryForm() {
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        companyName: "",
        contactName: "",
        email: "", // Added missing key
        phone: "",
        size: "",
        plan: "growth"
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const res = await fetch("/api/admin/companies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    // 1. Map frontend 'companyName' to backend 'name'
                    name: form.companyName,
                    // 2. Map frontend 'email' to both contact and hr fields
                    contactEmail: form.email,
                    hrEmail: form.email,
                    // 3. Include other required fields
                    contactName: form.contactName,
                    contactPhone: form.phone,
                    plan: form.plan,
                    // 4. Calculate seats or use defaults
                    planSeats: parseInt(form.size.split('–')[1] || "50"),
                    sizeRange: form.size,
                    // 5. Default arrays/booleans expected by the POST route
                    focusAreas: DOMAINS_COVERED.map(d => d.label),
                    allowAnonymous: true,
                    sessionCap: 6
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                // This handles the 400 (Missing fields) or 409 (Conflict) errors
                throw new Error(data.error || "Failed to create company account.");
            }

            setSubmitted(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="text-center py-10">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: "rgba(78,140,106,0.15)" }}>
                    <CheckCircle size={28} style={{ color: "var(--sage-dark)" }} />
                </div>
                <h3 className="font-cormorant text-2xl font-light mb-2" style={{ color: "var(--deep)" }}>
                    Enquiry received!
                </h3>
                <p className="text-sm font-light" style={{ color: "var(--text-muted)" }}>
                    Our enterprise team will reach out within one business day.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-3 rounded-lg text-xs bg-red-50 text-red-600 border border-red-100">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                    { key: "companyName", label: "Company name", placeholder: "Zenith Bank PLC" },
                    { key: "contactName", label: "Your name", placeholder: "Ngozi Adeola" },
                ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--deep)" }}>{label}</label>
                        <input
                            required
                            value={form[key as keyof typeof form]}
                            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                            placeholder={placeholder}
                            className="w-full text-sm px-3.5 py-2.5 rounded-xl border outline-none focus:ring-2 transition-all"
                            style={{ borderColor: "var(--border)", color: "var(--deep)", background: "white" }}
                        />
                    </div>
                ))}
            </div>

            <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--deep)" }}>Work email</label>
                <input
                    required type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="ngozi@company.com"
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border outline-none focus:ring-2 transition-all"
                    style={{ borderColor: "var(--border)", color: "var(--deep)", background: "white" }}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--deep)" }}>Phone (optional)</label>
                    <input
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+234 800 000 0000"
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border outline-none transition-all"
                        style={{ borderColor: "var(--border)", color: "var(--deep)", background: "white" }}
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--deep)" }}>Company size</label>
                    <select
                        required
                        value={form.size}
                        onChange={e => setForm(f => ({ ...f, size: e.target.value }))}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border outline-none transition-all"
                        style={{ borderColor: "var(--border)", color: "var(--deep)", background: "white" }}
                    >
                        <option value="">Select size…</option>
                        {["1–50", "51–150", "151–500", "501–1,000", "1,000+"].map(s => (
                            <option key={s} value={s}>{s} employees</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--deep)" }}>Plan of interest</label>
                <div className="grid grid-cols-3 gap-2">
                    {PLANS.map(p => (
                        <button key={p.id} type="button"
                            onClick={() => setForm(f => ({ ...f, plan: p.id }))}
                            className="py-2.5 rounded-xl text-xs font-medium border transition-all"
                            style={{
                                background: form.plan === p.id ? "rgba(61,139,139,0.1)" : "white",
                                borderColor: form.plan === p.id ? "var(--teal)" : "var(--border)",
                                color: form.plan === p.id ? "var(--teal)" : "var(--text-muted)",
                            }}>
                            {p.name}
                        </button>
                    ))}
                </div>
            </div>

            <button type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white py-3.5 rounded-xl disabled:opacity-50 transition-opacity"
                style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}>
                {isSubmitting ? "Processing..." : "Request Demo & Free Trial"}
                {!isSubmitting && <ArrowRight size={15} />}
            </button>
        </form>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EAPLandingPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div className="relative overflow-x-hidden">
            {/* ── Hero ── */}
            <section className="relative z-10 pt-20 pb-16 sm:pt-24 sm:pb-20 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-16 lg:items-start">

                        {/* Left: copy */}
                        <div className="lg:pt-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-5 border"
                                style={{ background: "rgba(123,169,139,0.12)", borderColor: "rgba(123,169,139,0.3)", color: "var(--sage-dark)" }}>
                                <Building2 size={10} />
                                Employee Assistance Programme
                            </div>

                            <h1 className="font-cormorant text-4xl sm:text-5xl lg:text-6xl font-light leading-tight mb-5"
                                style={{ color: "var(--deep)", letterSpacing: "-0.02em" }}>
                                Your people are your<br />
                                greatest <em className="italic" style={{ color: "var(--sage-dark)" }}>asset</em>.
                            </h1>

                            <p className="text-base sm:text-lg leading-relaxed mb-6 font-light" style={{ color: "var(--text-muted)", maxWidth: 460 }}>
                                Mentel EAP gives your employees confidential access to licensed therapists, a comprehensive wellbeing assessment, and a clear path to recovery — while giving your HR team the anonymised insights they need to build a healthier organisation.
                            </p>

                            <div className="flex flex-col gap-3 mb-8">
                                {[
                                    "Comprehensive 8-domain assessment — stress, anxiety, depression, burnout, sleep, relationships, self-esteem",
                                    "Individual-to-therapist matching within 24 hours",
                                    "HR dashboard with population-level trend analytics",
                                    "Employee data never disclosed to employer",
                                ].map(item => (
                                    <div key={item} className="flex items-start gap-3">
                                        <CheckCircle size={16} style={{ color: "var(--sage-dark)", flexShrink: 0, marginTop: 2 }} />
                                        <span className="text-sm font-light" style={{ color: "var(--text-muted)" }}>{item}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <a href="#enquire"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-white px-6 py-3 rounded-full"
                                    style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}>
                                    Book a Demo
                                    <ArrowRight size={14} />
                                </a>
                                <a href="#pricing"
                                    className="inline-flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-full border"
                                    style={{ borderColor: "var(--border)", color: "var(--sage-dark)" }}>
                                    View Pricing
                                </a>
                            </div>
                        </div>

                        {/* Right: social proof + trust */}
                        <div className="pt-12 lg:pt-0">
                            <div className="rounded-2xl border p-6 sm:p-8" style={{ background: "white", borderColor: "var(--border)" }}>
                                <div className="text-xs uppercase tracking-widest font-medium mb-4" style={{ color: "var(--sage-dark)" }}>
                                    How it works for employees
                                </div>
                                {[
                                    { step: "1", title: "Employee receives access code from HR", desc: "Unique per company. Takes 2 minutes to enrol." },
                                    { step: "2", title: "Complete the 8-domain assessment", desc: "Personalised questions. Anonymous option available." },
                                    { step: "3", title: "Matched to a licensed therapist", desc: "Within 24 hours. Based on their specific profile." },
                                    { step: "4", title: "Sessions begin. Progress is tracked.", desc: "Improvement visible over time. HR sees aggregate data only." },
                                ].map((s, i) => (
                                    <div key={i} className="flex gap-4 mb-5 last:mb-0">
                                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
                                            style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}>
                                            {s.step}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--deep)" }}>{s.title}</p>
                                            <p className="text-xs font-light" style={{ color: "var(--text-muted)" }}>{s.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 flex items-center gap-3 px-2">
                                <Shield size={14} style={{ color: "var(--sage-dark)" }} />
                                <span className="text-xs font-light" style={{ color: "var(--text-muted)" }}>
                                    NDPR-compliant · End-to-end encrypted · Licensed therapists only
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ── Outcomes strip ── */}
            <section className="relative z-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 sm:grid-cols-4 py-10 gap-6">
                        {OUTCOMES.map(o => <StatPill key={o.stat} {...o} />)}
                    </div>
                    <div className="h-px w-full" style={{ background: "var(--border)" }} />
                </div>
            </section>

            {/* ── Assessment domains ── */}
            <section className="relative z-10 py-14 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4 border"
                            style={{ background: "rgba(123,169,139,0.10)", borderColor: "rgba(123,169,139,0.25)", color: "var(--sage-dark)" }}>
                            <Sparkles size={11} />
                            The Assessment
                        </div>
                        <h2 className="font-cormorant text-3xl sm:text-4xl font-light mb-3" style={{ color: "var(--deep)" }}>
                            Not a quick quiz. A clinical-grade<br />
                            <em className="italic" style={{ color: "var(--sage-dark)" }}>employee wellbeing profile.</em>
                        </h2>
                        <p className="text-sm sm:text-base max-w-md mx-auto font-light" style={{ color: "var(--text-muted)" }}>
                            Our assessment covers 8 interconnected domains, adapts based on relationship status, and flags crisis indicators in real-time.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {DOMAINS_COVERED.map(({ icon: Icon, label, desc }) => (
                            <div key={label} className="flex items-start gap-4 rounded-2xl p-5 border"
                                style={{ background: "white", borderColor: "var(--border)" }}>
                                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ background: "rgba(123,169,139,0.12)" }}>
                                    <Icon size={17} style={{ color: "var(--sage-dark)" }} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--deep)" }}>{label}</p>
                                    <p className="text-xs font-light" style={{ color: "var(--text-muted)" }}>{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 rounded-2xl p-5 sm:p-6 border-l-4 flex flex-col sm:flex-row gap-4 items-start"
                        style={{ background: "rgba(123,169,139,0.05)", borderLeftColor: "var(--sage)", border: "1px solid rgba(123,169,139,0.2)" }}>
                        <Lock size={16} style={{ color: "var(--sage-dark)", flexShrink: 0, marginTop: 2 }} />
                        <div>
                            <p className="text-sm font-semibold mb-1" style={{ color: "var(--deep)" }}>Privacy by design — not by policy</p>
                            <p className="text-sm font-light" style={{ color: "var(--text-muted)" }}>
                                Individual answers are encrypted at rest. HR dashboards show only population aggregates. Relationship and intimacy questions are specifically excluded from any employer-visible report. Your employees can trust the process.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Pricing ── */}
            <section id="pricing" className="relative z-10 py-14 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4 border"
                            style={{ background: "rgba(123,169,139,0.10)", borderColor: "rgba(123,169,139,0.25)", color: "var(--sage-dark)" }}>
                            <Leaf size={11} />
                            Pricing
                        </div>
                        <h2 className="font-cormorant text-3xl sm:text-4xl font-light" style={{ color: "var(--deep)" }}>
                            Simple, transparent plans
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {PLANS.map(plan => (
                            <div key={plan.id}
                                className="relative rounded-2xl border p-6 flex flex-col"
                                style={{
                                    background: plan.highlight ? "linear-gradient(135deg, rgba(61,139,139,0.06), rgba(123,169,139,0.06))" : "white",
                                    borderColor: plan.highlight ? "var(--teal)" : "var(--border)",
                                    boxShadow: plan.highlight ? "0 4px 24px rgba(61,139,139,0.12)" : "none",
                                }}>
                                {plan.highlight && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold text-white"
                                        style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}>
                                        {plan.tag}
                                    </div>
                                )}
                                {!plan.highlight && (
                                    <div className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>{plan.tag}</div>
                                )}
                                <h3 className="font-cormorant text-2xl font-semibold mb-1" style={{ color: "var(--deep)" }}>{plan.name}</h3>
                                <div className="mb-4">
                                    <span className="text-2xl font-bold" style={{ color: "var(--deep)" }}>{plan.priceLabel}</span>
                                    {plan.priceMonth && <span className="text-xs ml-1" style={{ color: "var(--text-muted)" }}>/month</span>}
                                </div>
                                <div className="flex-1 space-y-2.5 mb-6">
                                    {plan.features.map(f => (
                                        <div key={f} className="flex items-start gap-2">
                                            <CheckCircle size={13} style={{ color: "var(--sage-dark)", flexShrink: 0, marginTop: 2 }} />
                                            <span className="text-xs font-light" style={{ color: "var(--text-muted)" }}>{f}</span>
                                        </div>
                                    ))}
                                </div>
                                <a href="#enquire"
                                    className="flex items-center justify-center gap-2 text-sm font-medium py-3 rounded-xl text-white transition-all"
                                    style={{ background: plan.highlight ? "linear-gradient(135deg, var(--sage-dark), var(--teal))" : "var(--deep)" }}>
                                    {plan.cta}
                                    <ArrowRight size={13} />
                                </a>
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-xs mt-4 font-light" style={{ color: "var(--text-muted)" }}>
                        All plans include a 14-day free trial. No credit card required to start.
                    </p>
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section className="relative z-10 py-14 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="font-cormorant text-3xl sm:text-4xl font-light" style={{ color: "var(--deep)" }}>
                            What HR leaders say
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {TESTIMONIALS.map(t => (
                            <div key={t.name} className="rounded-2xl p-6 border" style={{ background: "white", borderColor: "var(--border)" }}>
                                <div className="flex gap-0.5 mb-3">
                                    {Array.from({ length: t.stars }).map((_, i) => (
                                        <Star key={i} size={12} fill="#7BA98B" style={{ color: "var(--sage)" }} />
                                    ))}
                                </div>
                                <p className="text-sm leading-relaxed mb-5 font-light italic" style={{ color: "var(--text)" }}>
                                    &ldquo;{t.quote}&rdquo;
                                </p>
                                <div className="border-t pt-4" style={{ borderColor: "var(--border)" }}>
                                    <p className="text-xs font-semibold" style={{ color: "var(--deep)" }}>{t.name}</p>
                                    <p className="text-xs font-light" style={{ color: "var(--text-muted)" }}>{t.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section className="relative z-10 py-14 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="font-cormorant text-3xl sm:text-4xl font-light" style={{ color: "var(--deep)" }}>
                            Questions from HR teams
                        </h2>
                    </div>
                    <div className="space-y-3">
                        {FAQS.map((faq, i) => (
                            <div key={i} className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)", background: "white" }}>
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                                    style={{ color: "var(--deep)" }}>
                                    <span className="text-sm font-medium pr-4">{faq.q}</span>
                                    <ChevronDown size={16} style={{ color: "var(--sage-dark)", flexShrink: 0, transform: openFaq === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                                </button>
                                {openFaq === i && (
                                    <div className="px-5 pb-5">
                                        <p className="text-sm leading-relaxed font-light" style={{ color: "var(--text-muted)" }}>{faq.a}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Enquiry Form Section ── */}
            <section id="enquire" className="relative z-10 py-14">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4 border"
                            style={{ background: "rgba(123,169,139,0.10)", borderColor: "rgba(123,169,139,0.25)", color: "var(--sage-dark)" }}>
                            <Building2 size={11} />
                            Get Started
                        </div>
                        <h2 className="font-cormorant text-3xl sm:text-4xl font-light mb-3" style={{ color: "var(--deep)" }}>
                            Ready to invest in your<br />
                            <em className="italic" style={{ color: "var(--sage-dark)" }}>people&apos;s wellbeing?</em>
                        </h2>
                        <p className="text-sm font-light" style={{ color: "var(--text-muted)" }}>
                            Fill in your details and our enterprise team will contact you within one business day.
                        </p>
                    </div>
                    <div className="rounded-2xl border p-6 sm:p-8" style={{ background: "white", borderColor: "var(--border)" }}>
                        <EnquiryForm />
                    </div>
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
                        <a href="mailto:hello@mail.trymentel.com" className="flex items-center gap-1.5 hover:underline">
                            <Mail size={12} />
                            hello@mail.trymentel.com
                        </a>
                        <a href="tel:+2347031362034" className="flex items-center gap-1.5 hover:underline">
                            <Phone size={12} />
                            +234 703 136 2034
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}