// // app/cmhc/page.tsx
// //
// // Requires: npm i react-hook-form @hookform/resolvers zod lucide-react
// // No shadcn/Radix — every element here is plain Tailwind, consistent with the rest of the site.

// import { Metadata } from "next";
// import {
//     CheckCircle2,
//     Users,
//     BookOpen,
//     ShieldCheck,
//     Award,
//     ArrowRight,
//     Download,
// } from "lucide-react";
// import { RegistrationDialog } from "@/components/cmhc/registration-dialog-v2";
// import { Accordion } from "@/components/cmhc/accordion";
// import { CMHC_PLANS } from "@/lib/cmhc/pricing";

// export const metadata: Metadata = {
//     title: "Mentel Certified Mental Health Coach (CMHC) | Mentel",
//     description:
//         "An 8-week, live-online certification for anyone who wants to coach others through stress, burnout, and everyday mental wellbeing — with supervised practice and a recognised credential.",
// };

// // ── Static content — replace `cohorts` with a real Prisma query once you wire this up ──
// const cohorts = [
//     { id: "sept-2026", name: "September 2026 Cohort", startDate: "2026-09-07", seatsRemaining: 14 },
//     { id: "nov-2026", name: "November 2026 Cohort", startDate: "2026-11-02", seatsRemaining: 40 },
// ];

// const AUDIENCE = [
//     "Life Coaches", "HR Professionals", "Teachers", "Healthcare Workers",
//     "Church Leaders", "NGO Workers", "Entrepreneurs", "Wellness Professionals",
//     "Students", "Anyone passionate about mental wellbeing",
// ];

// const OUTCOMES = [
//     "Conduct professional coaching sessions",
//     "Support clients experiencing stress and burnout",
//     "Use evidence-informed coaching techniques",
//     "Recognise mental health warning signs",
//     "Know when — and how — to refer clients",
//     "Build a coaching practice from the ground up",
//     "Maintain ethical boundaries",
//     "Develop emotional intelligence",
// ];

// const MODULES = [
//     {
//         n: "01", title: "Foundations of Mental Health & Professional Coaching",
//         topics: ["Mental health", "Mental wellbeing", "Stress", "Mental health continuum", "Coaching vs therapy", "Ethics", "Confidentiality", "Professional boundaries", "Cultural competence", "Duty of care"],
//         outcomes: ["Understand coaching scope", "Apply ethics", "Understand confidentiality", "Recognise professional boundaries"],
//     },
//     {
//         n: "02", title: "Mental Health Literacy",
//         topics: ["Stress", "Burnout", "Anxiety", "Depression", "Trauma", "Grief", "ADHD overview", "Substance misuse overview", "Sleep", "Referral pathways"],
//         outcomes: ["Recognise common presentations", "Know referral boundaries", "Support clients safely"],
//     },
//     {
//         n: "03", title: "Core Coaching Skills",
//         topics: ["Active listening", "Powerful questioning", "Building trust", "Coaching presence", "Rapport", "SMART goals", "GROW model", "OSKAR model", "Strength-based coaching", "Accountability"],
//         outcomes: ["Conduct coaching sessions", "Develop coaching relationships", "Create action plans", "Improve client accountability"],
//     },
//     {
//         n: "04", title: "Evidence-Informed Coaching",
//         topics: ["Positive psychology", "Growth mindset", "Motivational interviewing", "Behaviour change", "Habit formation", "Mindfulness", "CBT-informed tools", "Acceptance & commitment principles"],
//         outcomes: ["Use evidence-informed coaching", "Support behaviour change", "Increase resilience"],
//     },
//     {
//         n: "05", title: "Psychological First Aid",
//         topics: ["Supporting distressed clients", "Panic attacks", "Suicide warning signs", "Safety planning", "Emergency response", "Referral procedures"],
//         outcomes: ["Respond calmly", "Recognise crisis situations", "Refer appropriately"],
//     },
//     {
//         n: "06", title: "Lifestyle & Wellbeing Coaching",
//         topics: ["Sleep", "Nutrition", "Exercise", "Stress", "Digital wellbeing", "Relationships", "Work-life balance", "Burnout recovery"],
//         outcomes: ["Coach healthier habits", "Develop wellbeing plans"],
//     },
//     {
//         n: "07", title: "Supervised Coaching Practicum",
//         topics: ["20–30 coaching hours", "Peer coaching", "Case studies", "Recorded coaching", "Faculty supervision", "Reflection journal"],
//         outcomes: [],
//     },
//     {
//         n: "08", title: "Building Your Coaching Practice",
//         topics: ["Personal branding", "Pricing", "Marketing", "Discovery calls", "Client onboarding", "Contracts", "Documentation", "AI tools", "Corporate wellness"],
//         outcomes: ["Launch a coaching business", "Find clients", "Operate professionally"],
//     },
// ];

// const LEARNING_EXPERIENCE = [
//     { icon: Users, title: "Live Classes", desc: "Real-time sessions with facilitators, not pre-recorded lectures." },
//     { icon: BookOpen, title: "Assignments", desc: "Applied work between sessions to cement each module." },
//     { icon: Users, title: "Role Plays", desc: "Practice coaching conversations in a safe, guided setting." },
//     { icon: BookOpen, title: "Case Studies", desc: "Work through real-world coaching scenarios in groups." },
//     { icon: Users, title: "Peer Coaching", desc: "Coach and be coached by classmates, with feedback." },
//     { icon: ShieldCheck, title: "Faculty Feedback", desc: "Direct feedback on your coaching from experienced faculty." },
//     { icon: Award, title: "Practicum", desc: "20–30 supervised hours before you graduate." },
//     { icon: CheckCircle2, title: "Final Assessment", desc: "A comprehensive assessment of skill and ethics." },
// ];

// const RESOURCES = [
//     "Training Manual", "Workbook", "Worksheets", "Client Intake Forms", "Consent Forms",
//     "Session Notes Templates", "Referral Guide", "Marketing Toolkit", "Digital Badge", "Certificate",
// ];

// const CAREERS = [
//     "Mental Health Coach", "Corporate Wellness Coach", "Community Wellness Facilitator",
//     "School Wellbeing Coach", "NGO Programme Officer", "Wellness Consultant", "Employee Wellbeing Coach",
// ];

// const PRICING_FEATURES: Record<string, boolean[]> = {
//     "8-week live programme": [true, true, true],
//     "Training manual & workbook": [true, true, true],
//     "Peer coaching & role plays": [true, true, true],
//     "Supervised practicum (20–30 hrs)": [true, true, true],
//     "1:1 faculty mentorship session": [false, true, true],
//     "Marketing toolkit": [false, true, true],
//     "Corporate wellness add-on module": [false, false, true],
//     "Priority practicum scheduling": [false, false, true],
//     "3 months post-certification support": [false, false, true],
// };

// const FAQS = [
//     { q: "Do I need prior experience?", a: "No. The programme is designed to take you from foundational mental health literacy through to a full coaching skill set — many successful applicants have no prior coaching background." },
//     { q: "Will I become a therapist?", a: "No. This programme certifies you as a Mental Health Coach. It does not qualify you as a psychologist, psychiatrist, psychotherapist, or licensed counsellor. You'll learn coaching, wellbeing support, mental health literacy, and referral skills." },
//     { q: "Is certification included?", a: "Yes. Graduates who meet all certification requirements receive the Mentel Certified Mental Health Coach credential and digital badge." },
//     { q: "How are classes delivered?", a: "Entirely live online, in interactive sessions with facilitators and classmates — not pre-recorded video." },
//     { q: "Are recordings available?", a: "Yes, every live session is recorded and made available to you for the duration of the programme." },
//     { q: "What if I miss a class?", a: "You can catch up via the recording. Attendance still counts toward the 85% requirement, so plan around live sessions where possible." },
//     { q: "Can I pay in installments?", a: "Yes. Professional and Premium plans support a 3-part installment plan; Starter supports 2." },
//     { q: "What are the certification requirements?", a: "85% attendance, a 70% minimum pass mark, passing the ethics exam, passing the practicum, completing your coaching hours, and completing the final assessment." },
//     { q: "Who teaches the programme?", a: "Experienced mental health and coaching faculty who supervise your practicum and give direct feedback throughout." },
//     { q: "Can I start my own coaching practice after this?", a: "Yes — Module 8 is dedicated to building a coaching practice, covering branding, pricing, marketing, and client onboarding." },
//     { q: "Is this recognised outside Nigeria?", a: "The CMHC is a Mentel credential recognised by employers and clients who value structured, ethics-first coaching training. It is not a government-issued clinical license in any jurisdiction." },
//     { q: "What happens if I don't pass?", a: "You'll get faculty feedback on what to strengthen, with the option to retake the relevant assessment or practicum component in a later cohort." },
// ];

// export default function CMHCPage() {
//     return (
//         <main className="bg-[--color-cream] text-[--color-dark]">
//             {/* ── Hero ─────────────────────────────────────────────────────────── */}
//             <section className="relative overflow-hidden px-6 pt-28 pb-20 sm:pt-36 sm:pb-28">
//                 <div className="mx-auto max-w-4xl text-center">
//                     <span className="inline-block mb-6 rounded-full border border-[--color-sage]/40 px-4 py-1 text-xs text-[--color-sage]">
//                         Enrolling now · {cohorts[0].name}
//                     </span>
//                     <h1 className="font-serif text-4xl sm:text-6xl leading-[1.05] tracking-tight text-[--color-dark]">
//                         Become a Certified Mental Health Coach.
//                     </h1>
//                     <p className="mt-6 text-lg sm:text-xl text-[--color-dark]/70 max-w-2xl mx-auto">
//                         An 8-week, live-online certification that gives you the skills, ethics, and
//                         supervised practice to coach others through stress, burnout, and everyday
//                         mental wellbeing — and the credential to prove it.
//                     </p>
//                     <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
//                         <RegistrationDialog
//                             cohorts={cohorts}
//                             trigger={
//                                 <button className="flex items-center justify-center gap-2 rounded-md bg-[--color-sage] px-8 py-3 text-white font-medium hover:bg-[--color-teal] transition-colors">
//                                     Enroll Now <ArrowRight className="h-4 w-4" />
//                                 </button>
//                             }
//                         />
//                         <button className="flex items-center justify-center gap-2 rounded-md border border-[--color-dark]/20 px-8 py-3 font-medium hover:bg-[--color-dark]/5 transition-colors">
//                             <Download className="h-4 w-4" /> Download Curriculum
//                         </button>
//                     </div>
//                     <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-[--color-dark]/60">
//                         {["Live Training", "Practical Certification", "Industry-Informed Curriculum", "Expert Facilitators"].map((t) => (
//                             <span key={t} className="flex items-center gap-2">
//                                 <CheckCircle2 className="h-4 w-4 text-[--color-sage]" /> {t}
//                             </span>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             {/* ── Who this is for ──────────────────────────────────────────────── */}
//             <Section eyebrow="Who this is for" title="Built for people who already care for others">
//                 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
//                     {AUDIENCE.map((a) => (
//                         <div key={a} className="rounded-lg border border-[--color-dark]/10 bg-white/60 p-5 text-center">
//                             <p className="text-sm font-medium">{a}</p>
//                         </div>
//                     ))}
//                 </div>
//             </Section>

//             {/* ── What you'll become ───────────────────────────────────────────── */}
//             <Section eyebrow="Outcomes" title="What you'll become" dark>
//                 <div className="grid sm:grid-cols-2 gap-4">
//                     {OUTCOMES.map((o) => (
//                         <div key={o} className="flex items-start gap-3">
//                             <CheckCircle2 className="h-5 w-5 text-[--color-sage] mt-0.5 shrink-0" />
//                             <p className="text-[--color-dark]/85">{o}</p>
//                         </div>
//                     ))}
//                 </div>
//             </Section>

//             {/* ── Curriculum ───────────────────────────────────────────────────── */}
//             <Section eyebrow="Curriculum" title="What you'll learn — 8 modules">
//                 <Accordion
//                     items={MODULES.map((m) => ({
//                         id: m.n,
//                         trigger: (
//                             <span>
//                                 <span className="text-[--color-sage] font-serif mr-3">{m.n}</span>
//                                 {m.title}
//                             </span>
//                         ),
//                         content: (
//                             <div className="grid sm:grid-cols-2 gap-6 pt-1">
//                                 <div>
//                                     <p className="text-xs uppercase tracking-wide text-[--color-dark]/50 mb-2">Topics</p>
//                                     <ul className="space-y-1 text-sm text-[--color-dark]/80">
//                                         {m.topics.map((t) => <li key={t}>{t}</li>)}
//                                     </ul>
//                                 </div>
//                                 {m.outcomes.length > 0 && (
//                                     <div>
//                                         <p className="text-xs uppercase tracking-wide text-[--color-dark]/50 mb-2">Learning outcomes</p>
//                                         <ul className="space-y-1 text-sm text-[--color-dark]/80">
//                                             {m.outcomes.map((o) => <li key={o}>{o}</li>)}
//                                         </ul>
//                                     </div>
//                                 )}
//                             </div>
//                         ),
//                     }))}
//                 />
//             </Section>

//             {/* ── Learning experience ──────────────────────────────────────────── */}
//             <Section eyebrow="Learning experience" title="More than lectures" dark>
//                 <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                     {LEARNING_EXPERIENCE.map(({ icon: Icon, title, desc }) => (
//                         <div key={title} className="rounded-lg border border-[--color-dark]/10 bg-white/60 p-6">
//                             <Icon className="h-6 w-6 text-[--color-sage] mb-3" />
//                             <p className="font-medium mb-1">{title}</p>
//                             <p className="text-sm text-[--color-dark]/60">{desc}</p>
//                         </div>
//                     ))}
//                 </div>
//             </Section>

//             {/* ── Included resources ───────────────────────────────────────────── */}
//             <Section eyebrow="Included" title="Everything you need, included">
//                 <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
//                     {RESOURCES.map((r) => (
//                         <div key={r} className="flex items-center gap-2 text-sm text-[--color-dark]/80">
//                             <CheckCircle2 className="h-4 w-4 text-[--color-sage] shrink-0" /> {r}
//                         </div>
//                     ))}
//                 </div>
//             </Section>

//             {/* ── Certification requirements ───────────────────────────────────── */}
//             <Section eyebrow="Certification" title="What it takes to graduate" dark>
//                 <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-center">
//                     {[
//                         "85% attendance", "70% minimum pass mark", "Pass the ethics exam",
//                         "Pass the practicum", "Complete coaching hours", "Complete final assessment",
//                     ].map((r) => (
//                         <div key={r} className="flex flex-col items-center gap-2">
//                             <ShieldCheck className="h-6 w-6 text-[--color-sage]" />
//                             <p className="text-sm text-[--color-dark]/80">{r}</p>
//                         </div>
//                     ))}
//                 </div>
//             </Section>

//             {/* ── Careers ───────────────────────────────────────────────────────── */}
//             <Section eyebrow="Where it leads" title="Career opportunities">
//                 <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                     {CAREERS.map((c) => (
//                         <div key={c} className="rounded-lg border border-[--color-dark]/10 bg-white/60 p-5 text-center">
//                             <Award className="h-5 w-5 text-[--color-sage] mx-auto mb-2" />
//                             <p className="text-sm font-medium">{c}</p>
//                         </div>
//                     ))}
//                 </div>
//             </Section>

//             {/* ── Pricing ───────────────────────────────────────────────────────── */}
//             <Section eyebrow="Investment" title="Choose your plan" dark>
//                 <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
//                     {(Object.keys(CMHC_PLANS) as (keyof typeof CMHC_PLANS)[]).map((id) => {
//                         const plan = CMHC_PLANS[id];
//                         const idx = id === "starter" ? 0 : id === "professional" ? 1 : 2;
//                         const popular = id === "professional";
//                         return (
//                             <div
//                                 key={id}
//                                 className={`flex flex-col rounded-xl bg-white p-8 ${popular ? "border-2 border-[--color-sage] shadow-lg sm:scale-[1.03]" : "border border-[--color-dark]/10"}`}
//                             >
//                                 {popular && (
//                                     <span className="self-start mb-4 rounded-full bg-[--color-sage] px-3 py-1 text-xs text-white">
//                                         Most Popular
//                                     </span>
//                                 )}
//                                 <p className="font-serif text-2xl mb-1">{plan.label}</p>
//                                 <p className="text-3xl font-serif text-[--color-sage] mb-6">
//                                     ₦{plan.priceNaira.toLocaleString()}
//                                 </p>
//                                 <ul className="space-y-3 flex-1 mb-6">
//                                     {Object.entries(PRICING_FEATURES).map(([feature, included]) => (
//                                         <li key={feature} className="flex items-start gap-2 text-sm">
//                                             <CheckCircle2
//                                                 className={`h-4 w-4 mt-0.5 shrink-0 ${included[idx] ? "text-[--color-sage]" : "text-[--color-dark]/20"}`}
//                                             />
//                                             <span className={included[idx] ? "text-[--color-dark]/85" : "text-[--color-dark]/35 line-through"}>
//                                                 {feature}
//                                             </span>
//                                         </li>
//                                     ))}
//                                 </ul>
//                                 <RegistrationDialog
//                                     cohorts={cohorts}
//                                     trigger={
//                                         <button
//                                             className={`w-full rounded-md py-2.5 font-medium transition-colors ${popular
//                                                     ? "bg-[--color-sage] text-white hover:bg-[--color-teal]"
//                                                     : "border border-[--color-dark]/20 hover:bg-[--color-dark]/5"
//                                                 }`}
//                                         >
//                                             Enroll — {plan.label}
//                                         </button>
//                                     }
//                                 />
//                             </div>
//                         );
//                     })}
//                 </div>
//             </Section>

//             {/* ── FAQ ───────────────────────────────────────────────────────────── */}
//             <Section eyebrow="Questions" title="Frequently asked questions">
//                 <Accordion
//                     items={FAQS.map((f, i) => ({
//                         id: String(i),
//                         trigger: f.q,
//                         content: <p className="text-[--color-dark]/70">{f.a}</p>,
//                     }))}
//                 />
//             </Section>

//             {/* ── Final CTA ─────────────────────────────────────────────────────── */}
//             <section className="px-6 py-24 bg-[--color-dark] text-[--color-cream] text-center">
//                 <h2 className="font-serif text-3xl sm:text-5xl max-w-2xl mx-auto leading-tight">
//                     Start your journey as a Certified Mental Health Coach.
//                 </h2>
//                 <div className="mt-8">
//                     <RegistrationDialog
//                         cohorts={cohorts}
//                         trigger={
//                             <button className="inline-flex items-center gap-2 rounded-md bg-[--color-sage] px-10 py-3 text-white font-medium hover:opacity-90 transition-opacity">
//                                 Enroll Today <ArrowRight className="h-4 w-4" />
//                             </button>
//                         }
//                     />
//                 </div>
//             </section>
//         </main>
//     );
// }

// function Section({
//     eyebrow, title, children, dark = false,
// }: {
//     eyebrow: string; title: string; children: React.ReactNode; dark?: boolean;
// }) {
//     return (
//         <section className={`px-6 py-20 ${dark ? "bg-[--color-dark]/[0.03]" : ""}`}>
//             <div className="mx-auto max-w-6xl">
//                 <p className="text-xs uppercase tracking-wide text-[--color-sage] mb-2 text-center">{eyebrow}</p>
//                 <h2 className="font-serif text-3xl sm:text-4xl text-center mb-12">{title}</h2>
//                 {children}
//             </div>
//         </section>
//     );
// }