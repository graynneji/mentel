
// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import BgBlobs from "@/components/BgBlobs";
// import { ArrowRight, ArrowLeft, Leaf, CheckCircle, Mail, Shield } from "lucide-react";

// interface FormErrors {
//     name?: string;
//     email?: string;
//     phone?: string;
// }

// const questions = [
//     {
//         id: "q1",
//         category: "Mood",
//         text: "Over the past two weeks, how often have you felt down, hopeless, or empty?",
//         options: [
//             { label: "Rarely or never", value: 0 },
//             { label: "Several days", value: 1 },
//             { label: "More than half the days", value: 2 },
//             { label: "Nearly every day", value: 3 },
//         ],
//     },
//     {
//         id: "q2",
//         category: "Anxiety",
//         text: "How often have you felt nervous, anxious, or on edge lately?",
//         options: [
//             { label: "Rarely or never", value: 0 },
//             { label: "Several days", value: 1 },
//             { label: "More than half the days", value: 2 },
//             { label: "Nearly every day", value: 3 },
//         ],
//     },
//     {
//         id: "q3",
//         category: "Energy",
//         text: "How would you describe your energy and motivation day-to-day?",
//         options: [
//             { label: "Good — I feel energised most days", value: 0 },
//             { label: "Okay — some low days but manageable", value: 1 },
//             { label: "Low — I often struggle to get going", value: 2 },
//             { label: "Very low — it's affecting my daily life", value: 3 },
//         ],
//     },
//     {
//         id: "q4",
//         category: "Sleep",
//         text: "How has your sleep been recently?",
//         options: [
//             { label: "Good — I sleep well most nights", value: 0 },
//             { label: "Occasionally disrupted", value: 1 },
//             { label: "Often restless or hard to fall asleep", value: 2 },
//             { label: "Poor most nights — it's affecting me significantly", value: 3 },
//         ],
//     },
//     {
//         id: "q5",
//         category: "Relationships",
//         text: "How are your relationships with people close to you feeling right now?",
//         options: [
//             { label: "Mostly good and connected", value: 0 },
//             { label: "Some tension or distance", value: 1 },
//             { label: "Strained — communication has been difficult", value: 2 },
//             { label: "Isolated or experiencing serious conflict", value: 3 },
//         ],
//     },
//     {
//         id: "q6",
//         category: "Stress",
//         text: "How well are you managing stress and everyday demands?",
//         options: [
//             { label: "Well — stress feels manageable", value: 0 },
//             { label: "Sometimes overwhelmed, but coping", value: 1 },
//             { label: "Often overwhelmed", value: 2 },
//             { label: "Constantly overwhelmed — it's hard to function", value: 3 },
//         ],
//     },
//     {
//         id: "q7",
//         category: "Self-worth",
//         text: "How do you feel about yourself and your sense of self-worth lately?",
//         options: [
//             { label: "Generally positive and confident", value: 0 },
//             { label: "Somewhat self-critical at times", value: 1 },
//             { label: "Often feel inadequate or worthless", value: 2 },
//             { label: "Constantly struggle with very low self-worth", value: 3 },
//         ],
//     },
//     {
//         id: "q8",
//         category: "Support",
//         text: "What are you hoping to get from speaking with a therapist?",
//         options: [
//             { label: "General wellbeing and personal growth", value: 0 },
//             { label: "Help managing a specific challenge", value: 1 },
//             { label: "Support through a difficult period", value: 2 },
//             { label: "Urgent help — I'm really struggling", value: 3 },
//         ],
//     },
// ];

// function getResult(score: number) {
//     if (score <= 6) {
//         return {
//             band: "Thriving",
//             color: "var(--sage)",
//             gradient: "linear-gradient(135deg, #7ba98b, #a8c4b0)",
//             headline: "You're in a good place",
//             summary:
//                 "Your responses suggest you're managing well overall. Many people reach out proactively to build resilience, develop self-awareness, or navigate life transitions — therapy can be valuable even when you're not in crisis.",
//             cta: "Explore proactive therapy",
//         };
//     } else if (score <= 12) {
//         return {
//             band: "Mild concern",
//             color: "var(--teal)",
//             gradient: "linear-gradient(135deg, #3d8b8b, #6fb8b8)",
//             headline: "Some areas could use support",
//             summary:
//                 "Your responses suggest you're experiencing some difficulties that are worth exploring. A therapist can help you build practical tools and understand patterns before they become harder to manage.",
//             cta: "Book a free consultation",
//         };
//     } else if (score <= 18) {
//         return {
//             band: "Moderate",
//             color: "var(--sage-dark)",
//             gradient: "linear-gradient(135deg, #4e7a5e, #3d8b8b)",
//             headline: "You deserve real support",
//             summary:
//                 "Your responses suggest you're going through a genuinely difficult time. You're not alone — what you're feeling is valid, and speaking with a licensed therapist can make a significant difference.",
//             cta: "Book your first session",
//         };
//     } else {
//         return {
//             band: "High concern",
//             color: "#c0555a",
//             gradient: "linear-gradient(135deg, #c0555a, #e07a7f)",
//             headline: "Please reach out — you matter",
//             summary:
//                 "Your responses suggest you're struggling significantly. We strongly encourage you to speak with a professional as soon as possible. Our therapists are here for you, without judgment.",
//             cta: "Get urgent support",
//         };
//     }
// }

// export default function AssessmentPage() {
//     const [step, setStep] = useState<"intro" | "quiz" | "email" | "result">("intro");
//     const [current, setCurrent] = useState(0);
//     const [answers, setAnswers] = useState<Record<string, number>>({});
//     const [email, setEmail] = useState("");
//     const [phone, setPhone] = useState("");
//     const [name, setName] = useState("");
//     const [submitting, setSubmitting] = useState(false);
//     const [errors, setErrors] = useState<FormErrors>({});
//     // 🛡 Prevents double-firing when user clicks options rapidly
//     const [transitioning, setTransitioning] = useState(false);

//     const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
//     const result = getResult(totalScore);
//     const progress = ((current + 1) / questions.length) * 100;

//     function handleAnswer(value: number) {
//         // 🛡 Ignore any click that fires during the 320ms transition
//         if (transitioning) return;

//         const q = questions[current];
//         // 🛡 Bail if current has somehow gone out of bounds
//         if (!q) return;

//         setTransitioning(true);
//         setAnswers((prev) => ({ ...prev, [q.id]: value }));

//         setTimeout(() => {
//             if (current < questions.length - 1) {
//                 setCurrent((c) => c + 1);
//             } else {
//                 setStep("email");
//             }
//             setTransitioning(false);
//         }, 320);
//     }

//     const validate = (): boolean => {
//         const newErrors: FormErrors = {};
//         if (!name.trim() || name.trim().length < 2)
//             newErrors.name = "Please enter your full name.";
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!email || !emailRegex.test(email))
//             newErrors.email = "Please enter a valid email address.";
//         const phoneDigits = phone.replace(/\D/g, "");
//         if (!phoneDigits || phoneDigits.length < 7)
//             newErrors.phone = "Please enter a valid phone number.";
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     function handleBack() {
//         if (transitioning) return; // 🛡 also block back during transition
//         if (current > 0) setCurrent((c) => c - 1);
//         else setStep("intro");
//     }

//     async function handleEmailSubmit(e: React.FormEvent) {
//         e.preventDefault();
//         if (!validate()) return;

//         setSubmitting(true);

//         const res = await fetch("/api/assessment", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ name, email, phone, score: totalScore, band: result.band, answers }),
//         });

//         setSubmitting(false);
//         setStep("result");
//     }

//     // ── INTRO ──────────────────────────────────────────────────────────────────
//     if (step === "intro") {
//         return (
//             <div className="relative min-h-screen">
//                 <BgBlobs />
//                 <section className="relative z-10 pt-24 pb-20 px-4 sm:px-6">
//                     <div className="max-w-xl mx-auto text-center animate-fade-up">

//                         <div
//                             className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-6 border"
//                             style={{ background: "rgba(123,169,139,0.12)", borderColor: "rgba(123,169,139,0.3)", color: "var(--sage-dark)" }}
//                         >
//                             <Leaf size={11} />
//                             Free · 2 Minutes · Confidential
//                         </div>

//                         <h1
//                             className="font-cormorant text-4xl sm:text-5xl font-light leading-tight mb-5"
//                             style={{ color: "var(--deep)", letterSpacing: "-0.02em" }}
//                         >
//                             How are you{" "}
//                             <em className="italic" style={{ color: "var(--sage-dark)" }}>really</em>{" "}
//                             doing?
//                         </h1>

//                         <p className="text-sm sm:text-base leading-relaxed mb-8 font-light" style={{ color: "var(--text-muted)", maxWidth: "400px", margin: "0 auto 2rem" }}>
//                             This short, confidential check-in helps us understand where you are right now — so we can match you with the right support.
//                         </p>

//                         <div
//                             className="rounded-2xl p-6 mb-8 border text-left"
//                             style={{ background: "white", borderColor: "var(--border)" }}
//                         >
//                             <div className="space-y-3">
//                                 {[
//                                     "8 simple questions about how you've been feeling",
//                                     "Your personalised result in under 2 minutes",
//                                     "No account needed — completely confidential",
//                                     "Matched to the right therapist for your needs",
//                                 ].map((item) => (
//                                     <div key={item} className="flex items-start gap-3">
//                                         <CheckCircle size={16} style={{ color: "var(--sage)", flexShrink: 0, marginTop: "2px" }} />
//                                         <span className="text-sm" style={{ color: "var(--text-muted)" }}>{item}</span>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         <button
//                             onClick={() => setStep("quiz")}
//                             className="inline-flex items-center gap-2 text-sm font-medium text-white px-8 py-4 rounded-full transition-all hover:-translate-y-0.5 hover:shadow-lg duration-200 cursor-pointer"
//                             style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
//                         >
//                             Start Free Assessment
//                             <ArrowRight size={16} />
//                         </button>

//                         <p className="text-xs mt-4" style={{ color: "var(--text-muted)" }}>
//                             This is not a clinical diagnosis. For emergencies, please contact emergency services.
//                         </p>
//                     </div>
//                 </section>
//             </div>
//         );
//     }

//     // ── QUIZ ───────────────────────────────────────────────────────────────────
//     if (step === "quiz") {
//         const q = questions[current];

//         // 🛡 Safety net — if current overshoots during a rapid-click transition,
//         // render nothing rather than crashing on q.id / q.text / q.options
//         if (!q) return null;

//         const answered = answers[q.id];

//         return (
//             <div className="relative min-h-screen">
//                 <BgBlobs />
//                 <section className="relative z-10 pt-20 pb-20 px-4 sm:px-6">
//                     <div className="max-w-lg mx-auto animate-fade-up">

//                         {/* Progress bar */}
//                         <div className="flex items-center gap-3 mb-10">
//                             <button
//                                 onClick={handleBack}
//                                 disabled={transitioning}
//                                 className="w-8 h-8 rounded-full border flex items-center justify-center transition-all hover:bg-mist duration-150 flex-shrink-0 disabled:opacity-40"
//                                 style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
//                             >
//                                 <ArrowLeft size={14} />
//                             </button>
//                             <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
//                                 <div
//                                     className="h-full rounded-full transition-all duration-500 ease-out"
//                                     style={{ width: `${progress}%`, background: "linear-gradient(90deg, var(--sage), var(--teal))" }}
//                                 />
//                             </div>
//                             <span className="text-xs font-medium flex-shrink-0" style={{ color: "var(--text-muted)" }}>
//                                 {current + 1} / {questions.length}
//                             </span>
//                         </div>

//                         {/* Category chip */}
//                         <div
//                             className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-widest mb-4 border"
//                             style={{ background: "rgba(123,169,139,0.10)", borderColor: "rgba(123,169,139,0.25)", color: "var(--sage-dark)" }}
//                         >
//                             {q.category}
//                         </div>

//                         {/* Question */}
//                         <h2
//                             className="font-cormorant text-2xl sm:text-3xl font-light leading-snug mb-8"
//                             style={{ color: "var(--deep)" }}
//                         >
//                             {q.text}
//                         </h2>

//                         {/* Options */}
//                         <div className="space-y-3">
//                             {q.options.map((opt) => {
//                                 const isSelected = answered === opt.value;
//                                 return (
//                                     <button
//                                         key={opt.value}
//                                         onClick={() => handleAnswer(opt.value)}
//                                         // 🛡 Visually and functionally disabled mid-transition
//                                         disabled={transitioning}
//                                         className="w-full text-left px-5 py-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm cursor-pointer disabled:cursor-default disabled:hover:translate-y-0"
//                                         style={{
//                                             background: isSelected ? "rgba(123,169,139,0.12)" : "white",
//                                             borderColor: isSelected ? "var(--sage)" : "var(--border)",
//                                             color: isSelected ? "var(--sage-dark)" : "var(--text)",
//                                             boxShadow: isSelected ? "0 0 0 3px rgba(123,169,139,0.15)" : "none",
//                                         }}
//                                     >
//                                         <span className="text-sm sm:text-base font-light">{opt.label}</span>
//                                     </button>
//                                 );
//                             })}
//                         </div>

//                     </div>
//                 </section>
//             </div>
//         );
//     }

//     // ── EMAIL CAPTURE ──────────────────────────────────────────────────────────
//     if (step === "email") {
//         return (
//             <div className="relative min-h-screen">
//                 <BgBlobs />
//                 <section className="relative z-10 pt-24 pb-20 px-4 sm:px-6">
//                     <div className="max-w-md mx-auto animate-fade-up">

//                         <div className="text-center mb-8">
//                             <div
//                                 className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
//                                 style={{ background: "linear-gradient(135deg, var(--sage), var(--teal))" }}
//                             >
//                                 <Mail size={24} color="white" />
//                             </div>
//                             <h2
//                                 className="font-cormorant text-3xl sm:text-4xl font-light mb-3"
//                                 style={{ color: "var(--deep)" }}
//                             >
//                                 Almost there
//                             </h2>
//                             <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
//                                 Enter your details to receive your personalised results and a follow-up from one of our therapists.
//                             </p>
//                         </div>

//                         <div
//                             className="rounded-2xl p-6 sm:p-8 border relative overflow-hidden"
//                             style={{ background: "rgba(255,255,255,0.92)", borderColor: "var(--border)", backdropFilter: "blur(20px)" }}
//                         >
//                             <div
//                                 className="absolute top-0 left-0 right-0 h-0.5"
//                                 style={{ background: "linear-gradient(90deg, var(--sage), var(--teal), var(--sage-light))" }}
//                             />

//                             <form onSubmit={handleEmailSubmit} className="space-y-4">
//                                 <div>
//                                     <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "var(--sage-dark)" }}>
//                                         Your Name
//                                     </label>
//                                     <input
//                                         type="text"
//                                         placeholder="First name"
//                                         value={name}
//                                         onChange={(e) => { setName(e.target.value); setErrors((prev) => ({ ...prev, name: undefined })); }}
//                                         className={`form-input ${errors.name ? "form-input-error" : ""}`}
//                                         required
//                                     />
//                                     {errors.name && (
//                                         <p className="text-xs mt-1.5" style={{ color: "var(--error)" }}>{errors.name}</p>
//                                     )}
//                                 </div>

//                                 <div>
//                                     <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "var(--sage-dark)" }}>
//                                         Email Address
//                                     </label>
//                                     <input
//                                         type="email"
//                                         placeholder="you@example.com"
//                                         value={email}
//                                         onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: undefined })); }}
//                                         className={`form-input ${errors.email ? "form-input-error" : ""}`}
//                                         required
//                                     />
//                                     {errors.email && (
//                                         <p className="text-xs mt-1.5" style={{ color: "var(--error)" }}>{errors.email}</p>
//                                     )}
//                                 </div>

//                                 <div>
//                                     <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "var(--sage-dark)" }}>
//                                         Phone
//                                     </label>
//                                     <input
//                                         type="tel"
//                                         placeholder="+234 000 000 0000"
//                                         value={phone}
//                                         onChange={(e) => { setPhone(e.target.value); setErrors((prev) => ({ ...prev, phone: undefined })); }}
//                                         className={`form-input ${errors.phone ? "form-input-error" : ""}`}
//                                         required
//                                     />
//                                     {errors.phone && (
//                                         <p className="text-xs mt-1.5" style={{ color: "var(--error)" }}>{errors.phone}</p>
//                                     )}
//                                 </div>

//                                 <button
//                                     type="submit"
//                                     disabled={submitting}
//                                     className="cursor-pointer w-full inline-flex items-center justify-center gap-2 text-sm font-medium text-white px-6 py-3.5 rounded-full transition-all hover:-translate-y-0.5 hover:shadow-lg duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
//                                     style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
//                                 >
//                                     {submitting ? "Saving your results…" : "See My Results"}
//                                     {!submitting && <ArrowRight size={15} />}
//                                 </button>
//                             </form>

//                             <div className="flex items-center gap-2 mt-4 justify-center">
//                                 <Shield size={12} style={{ color: "var(--sage)" }} />
//                                 <p className="text-xs" style={{ color: "var(--text-muted)" }}>
//                                     We never share your data. Unsubscribe any time.
//                                 </p>
//                             </div>
//                         </div>

//                         <p className="text-center text-xs mt-4" style={{ color: "var(--text-muted)" }}>
//                             By continuing you agree to our{" "}
//                             <Link href="/privacy" className="underline underline-offset-2" style={{ color: "var(--sage-dark)" }}>
//                                 Privacy Policy
//                             </Link>
//                         </p>
//                     </div>
//                 </section>
//             </div>
//         );
//     }

//     // ── RESULT ─────────────────────────────────────────────────────────────────
//     return (
//         <div className="relative min-h-screen">
//             <BgBlobs />
//             <section className="relative z-10 pt-24 pb-20 px-4 sm:px-6">
//                 <div className="max-w-lg mx-auto animate-fade-up">

//                     {/* Score card */}
//                     <div
//                         className="rounded-2xl sm:rounded-3xl p-8 sm:p-10 relative overflow-hidden mb-6 text-white text-center"
//                         style={{ background: result.gradient }}
//                     >
//                         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, white 0%, transparent 60%)" }} />
//                         <p className="text-xs uppercase tracking-widest opacity-80 mb-2 relative z-10">Your result</p>
//                         <p className="font-cormorant text-3xl sm:text-4xl font-semibold mb-1 relative z-10">{result.band}</p>
//                         <div className="flex items-center justify-center gap-2 relative z-10">
//                             <div className="h-px flex-1 opacity-30" style={{ background: "white" }} />
//                             <p className="text-xs opacity-70">Score {totalScore} / {questions.length * 3}</p>
//                             <div className="h-px flex-1 opacity-30" style={{ background: "white" }} />
//                         </div>
//                     </div>

//                     {/* Summary */}
//                     <div
//                         className="rounded-2xl p-6 sm:p-8 border mb-5"
//                         style={{ background: "white", borderColor: "var(--border)" }}
//                     >
//                         <h2
//                             className="font-cormorant text-2xl sm:text-3xl font-light mb-3"
//                             style={{ color: "var(--deep)" }}
//                         >
//                             {result.headline}
//                             {name ? `, ${name}` : ""}
//                         </h2>
//                         <p className="text-sm sm:text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
//                             {result.summary}
//                         </p>
//                     </div>

//                     {/* Next steps */}
//                     <div
//                         className="rounded-2xl p-6 border mb-6"
//                         style={{ background: "rgba(123,169,139,0.06)", borderColor: "rgba(123,169,139,0.25)" }}
//                     >
//                         <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "var(--sage-dark)" }}>
//                             What happens next
//                         </p>
//                         <div className="space-y-2.5">
//                             {[
//                                 "We'll email your full results summary shortly",
//                                 "A therapist will reach out within 24 hours",
//                                 "Your first consultation is free and judgment-free",
//                             ].map((item) => (
//                                 <div key={item} className="flex items-start gap-3">
//                                     <CheckCircle size={15} style={{ color: "var(--sage)", flexShrink: 0, marginTop: "2px" }} />
//                                     <span className="text-sm" style={{ color: "var(--text-muted)" }}>{item}</span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* CTAs */}
//                     <div className="flex flex-col sm:flex-row gap-3">
//                         <Link
//                             href="/#book"
//                             className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-medium text-white px-6 py-3.5 rounded-full transition-all hover:-translate-y-0.5 hover:shadow-lg duration-200"
//                             style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
//                         >
//                             {result.cta}
//                             <ArrowRight size={15} />
//                         </Link>
//                         <Link
//                             href="/services"
//                             className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-medium px-6 py-3.5 rounded-full border transition-all hover:-translate-y-0.5 hover:shadow-sm duration-200"
//                             style={{ borderColor: "var(--border)", color: "var(--sage-dark)" }}
//                         >
//                             View our services
//                         </Link>
//                     </div>

//                     <p className="text-center text-xs mt-6" style={{ color: "var(--text-muted)" }}>
//                         This is not a clinical diagnosis. If you are in crisis, please contact{" "}
//                         <a href="tel:112" className="underline underline-offset-2" style={{ color: "var(--sage-dark)" }}>
//                             emergency services
//                         </a>
//                         .
//                     </p>

//                 </div>
//             </section>
//         </div>
//     );
// }

"use client";

import { useState } from "react";
import Link from "next/link";
import BgBlobs from "@/components/BgBlobs";
import {
    ArrowRight,
    ArrowLeft,
    CheckCircle,
    Mail,
    Shield,
    Lock,
    UserCheck,
    Clock,
    Sparkles,
    type LucideIcon,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Option {
    label: string;
    value: number;
}

interface Question {
    id: string;
    category: string;
    text: string;
    options: Option[];
}

interface Result {
    band: string;
    gradient: string;
    headline: string;
    summary: string;
    cta: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
}

interface TrustBadge {
    icon: LucideIcon;
    label: string;
    iconColor: string;
    iconFill: string;
}

type Step = "intro" | "quiz" | "email" | "result";

// ── Data ───────────────────────────────────────────────────────────────────────

const questions: Question[] = [
    {
        id: "q1",
        category: "Mood",
        text: "Over the past two weeks, how often have you felt down, hopeless, or empty?",
        options: [
            { label: "Rarely or never", value: 0 },
            { label: "Several days", value: 1 },
            { label: "More than half the days", value: 2 },
            { label: "Nearly every day", value: 3 },
        ],
    },
    {
        id: "q2",
        category: "Anxiety",
        text: "How often have you felt nervous, anxious, or on edge lately?",
        options: [
            { label: "Rarely or never", value: 0 },
            { label: "Several days", value: 1 },
            { label: "More than half the days", value: 2 },
            { label: "Nearly every day", value: 3 },
        ],
    },
    {
        id: "q3",
        category: "Energy",
        text: "How would you describe your energy and motivation day-to-day?",
        options: [
            { label: "Good — I feel energised most days", value: 0 },
            { label: "Okay — some low days but manageable", value: 1 },
            { label: "Low — I often struggle to get going", value: 2 },
            { label: "Very low — it's affecting my daily life", value: 3 },
        ],
    },
    {
        id: "q4",
        category: "Sleep",
        text: "How has your sleep been recently?",
        options: [
            { label: "Good — I sleep well most nights", value: 0 },
            { label: "Occasionally disrupted", value: 1 },
            { label: "Often restless or hard to fall asleep", value: 2 },
            { label: "Poor most nights — it's affecting me significantly", value: 3 },
        ],
    },
    {
        id: "q5",
        category: "Relationships",
        text: "How are your relationships with people close to you feeling right now?",
        options: [
            { label: "Mostly good and connected", value: 0 },
            { label: "Some tension or distance", value: 1 },
            { label: "Strained — communication has been difficult", value: 2 },
            { label: "Isolated or experiencing serious conflict", value: 3 },
        ],
    },
    {
        id: "q6",
        category: "Stress",
        text: "How well are you managing stress and everyday demands?",
        options: [
            { label: "Well — stress feels manageable", value: 0 },
            { label: "Sometimes overwhelmed, but coping", value: 1 },
            { label: "Often overwhelmed", value: 2 },
            { label: "Constantly overwhelmed — it's hard to function", value: 3 },
        ],
    },
    {
        id: "q7",
        category: "Self-worth",
        text: "How do you feel about yourself and your sense of self-worth lately?",
        options: [
            { label: "Generally positive and confident", value: 0 },
            { label: "Somewhat self-critical at times", value: 1 },
            { label: "Often feel inadequate or worthless", value: 2 },
            { label: "Constantly struggle with very low self-worth", value: 3 },
        ],
    },
    {
        id: "q8",
        category: "Support",
        text: "What are you hoping to get from speaking with a therapist?",
        options: [
            { label: "General wellbeing and personal growth", value: 0 },
            { label: "Help managing a specific challenge", value: 1 },
            { label: "Support through a difficult period", value: 2 },
            { label: "Urgent help — I'm really struggling", value: 3 },
        ],
    },
];

const avatarLetters: string[] = ["A", "E", "F", "K", "T", "R"];
const avatarColors: string[] = [
    "#7ba98b",
    "#3d8b8b",
    "#4e7a5e",
    "#6fb8b8",
    "#a8c4b0",
    "#5a8a7a",
];

const trustBadges: TrustBadge[] = [
    { icon: Lock, label: "Confidential", iconColor: "#3d8b8b", iconFill: "#6fb8b8" },
    { icon: Clock, label: "2 Minutes", iconColor: "#7b6fa9", iconFill: "#b8a8d4" },
    { icon: Sparkles, label: "Free", iconColor: "#a97b3d", iconFill: "#d4b87b" },
    { icon: UserCheck, label: "No Sign Up", iconColor: "#4e7a5e", iconFill: "#7ba98b" },
];

const checklistItems: string[] = [
    "8 simple questions about how you've been feeling",
    "Your personalised result in under 2 minutes",
    "No account needed — completely confidential",
    "Matched to the right therapist for your needs",
];

const nextSteps: string[] = [
    "We'll email your full results summary shortly",
    "Check your spam or junk folder if you don't see it",
    "A therapist will reach out within 24 hours",
    "Your first consultation is free and judgment-free",
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function getResult(score: number): Result {
    if (score <= 6) {
        return {
            band: "Thriving",
            gradient: "linear-gradient(135deg, #7ba98b, #a8c4b0)",
            headline: "You're in a good place",
            summary:
                "Your responses suggest you're managing well overall. Many people reach out proactively to build resilience, develop self-awareness, or navigate life transitions — therapy can be valuable even when you're not in crisis.",
            cta: "Explore proactive therapy",
        };
    }
    if (score <= 12) {
        return {
            band: "Mild Concern",
            gradient: "linear-gradient(135deg, #3d8b8b, #6fb8b8)",
            headline: "Some areas could use support",
            summary:
                "Your responses suggest you're experiencing some difficulties worth exploring. A therapist can help you build practical tools and understand patterns before they become harder to manage.",
            cta: "Book a free consultation",
        };
    }
    if (score <= 18) {
        return {
            band: "Moderate",
            gradient: "linear-gradient(135deg, #4e7a5e, #3d8b8b)",
            headline: "You deserve real support",
            summary:
                "Your responses suggest you're going through a genuinely difficult time. You're not alone — what you're feeling is valid, and speaking with a licensed therapist can make a significant difference.",
            cta: "Book your first session",
        };
    }
    return {
        band: "High Concern",
        gradient: "linear-gradient(135deg, #c0555a, #e07a7f)",
        headline: "Please reach out — you matter",
        summary:
            "Your responses suggest you're struggling significantly. We strongly encourage you to speak with a professional as soon as possible. Our therapists are here for you, without judgment.",
        cta: "Get urgent support",
    };
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function AssessmentPage() {
    const [step, setStep] = useState<Step>("intro");
    const [current, setCurrent] = useState<number>(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [transitioning, setTransitioning] = useState<boolean>(false);

    const totalScore: number = Object.values(answers).reduce(
        (acc: number, val: number) => acc + val,
        0
    );
    const result: Result = getResult(totalScore);
    const progress: number = ((current + 1) / questions.length) * 100;

    function handleAnswer(value: number): void {
        if (transitioning) return;
        const q = questions[current];
        if (!q) return;
        setTransitioning(true);
        setAnswers((prev) => ({ ...prev, [q.id]: value }));
        setTimeout(() => {
            if (current < questions.length - 1) {
                setCurrent((c) => c + 1);
            } else {
                setStep("email");
            }
            setTransitioning(false);
        }, 320);
    }

    function validate(): boolean {
        const newErrors: FormErrors = {};
        if (!name.trim() || name.trim().length < 2) {
            newErrors.name = "Please enter your name.";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            newErrors.email = "Please enter a valid email address.";
        }
        const phoneDigits = phone.replace(/\D/g, "");
        if (!phoneDigits || phoneDigits.length < 7) {
            newErrors.phone = "Please enter a valid phone number.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleBack(): void {
        if (transitioning) return;
        if (current > 0) {
            setCurrent((c) => c - 1);
        } else {
            setStep("intro");
        }
    }

    async function handleEmailSubmit(
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        await fetch("/api/assessment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                email,
                phone,
                score: totalScore,
                band: result.band,
                answers,
            }),
        });
        setSubmitting(false);
        setStep("result");
    }

    // ── INTRO ──────────────────────────────────────────────────────────────────

    if (step === "intro") {
        return (
            <div className="relative min-h-screen" style={{ background: "var(--white)" }}>
                <BgBlobs />
                <section className="relative z-10 pt-20 pb-24 px-4 sm:px-6">
                    <div className="max-w-xl mx-auto animate-fade-up">

                        {/* Social proof */}
                        <div
                            className="inline-flex items-center gap-3 mb-8 rounded-full border"
                            style={{
                                padding: "7px 16px 7px 7px",
                                background: "white",
                                borderColor: "var(--border)",
                                boxShadow: "0 1px 8px rgba(28,58,58,0.06)",
                            }}
                        >
                            <div className="flex items-center">
                                {avatarLetters.map((letter, i) => (
                                    <div
                                        key={`avatar-${i}`}
                                        className="flex items-center justify-center rounded-full text-white"
                                        style={{
                                            width: 28,
                                            height: 28,
                                            fontSize: 11,
                                            fontWeight: 500,
                                            background: avatarColors[i],
                                            border: "2px solid white",
                                            marginLeft: i === 0 ? 0 : -9,
                                            zIndex: avatarLetters.length - i,
                                            position: "relative",
                                        }}
                                    >
                                        {letter}
                                    </div>
                                ))}
                            </div>
                            <div style={{ lineHeight: 1.4 }}>
                                <span className="block text-xs font-medium" style={{ color: "var(--deep)" }}>
                                    2,400+ people have taken this check-in
                                </span>
                                <span className="block text-xs" style={{ color: "var(--text-muted)" }}>
                                    Trusted · Confidential · Free
                                </span>
                            </div>
                        </div>

                        {/* Headline */}
                        <h1
                            className="font-cormorant mb-5"
                            style={{
                                fontSize: "clamp(38px, 6vw, 54px)",
                                fontWeight: 300,
                                lineHeight: 1.14,
                                letterSpacing: "-0.02em",
                                color: "var(--deep)",
                            }}
                        >
                            How are you{" "}
                            <em className="italic" style={{ color: "var(--sage-dark)" }}>
                                really
                            </em>{" "}
                            doing?
                        </h1>

                        <p
                            className="mb-8 font-light leading-relaxed"
                            style={{ fontSize: 16, color: "var(--text-muted)", maxWidth: 420 }}
                        >
                            This short, confidential check-in helps us understand where you are
                            right now — so we can match you with the right support.
                        </p>

                        {/* Trust badges */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            {trustBadges.map(({ icon: Icon, label, iconColor, iconFill }) => (
                                <span
                                    key={label}
                                    className="inline-flex items-center gap-1.5 rounded-full text-xs font-medium border"
                                    style={{
                                        padding: "6px 14px",
                                        background: "rgba(123,169,139,0.09)",
                                        borderColor: "rgba(123,169,139,0.26)",
                                        color: "var(--sage-dark)",
                                    }}
                                >
                                    <Icon
                                        size={12}
                                        fill={iconFill}
                                        stroke={iconColor}
                                        strokeWidth={1.5}
                                    />
                                    {label}
                                </span>
                            ))}
                        </div>

                        {/* Checklist card */}
                        <div
                            className="rounded-2xl border mb-8 overflow-hidden"
                            style={{
                                background: "white",
                                borderColor: "var(--border)",
                                boxShadow: "0 2px 16px rgba(28,58,58,0.05)",
                            }}
                        >
                            {checklistItems.map((item, i) => (
                                <div
                                    key={item}
                                    className="flex items-start gap-3 px-6 py-4"
                                    style={{
                                        borderBottom:
                                            i < checklistItems.length - 1
                                                ? "1px solid var(--border)"
                                                : "none",
                                    }}
                                >
                                    <CheckCircle
                                        size={16}
                                        fill="var(--sage)"
                                        stroke="white"
                                        strokeWidth={2.5}
                                        style={{ flexShrink: 0, marginTop: 2 }}
                                    />
                                    <span className="text-sm font-light" style={{ color: "var(--text-muted)" }}>
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <button
                            type="button"
                            onClick={() => setStep("quiz")}
                            className="w-full inline-flex items-center justify-center gap-2 text-sm font-medium text-white rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
                            style={{
                                padding: "16px 32px",
                                background: "linear-gradient(135deg, var(--sage-dark), var(--teal))",
                                boxShadow: "0 4px 20px rgba(61,139,139,0.28)",
                            }}
                        >
                            Start Free Assessment
                            <ArrowRight size={16} strokeWidth={2} />
                        </button>

                    </div>
                </section>
            </div>
        );
    }

    // ── QUIZ ───────────────────────────────────────────────────────────────────

    if (step === "quiz") {
        const q: Question | undefined = questions[current];
        if (!q) return null;
        const answeredValue: number | undefined = answers[q.id];

        return (
            <div className="relative min-h-screen" style={{ background: "var(--white)" }}>
                <BgBlobs />
                <section className="relative z-10 pt-20 pb-24 px-4 sm:px-6">
                    <div className="max-w-lg mx-auto animate-fade-up">

                        {/* Progress row */}
                        <div className="flex items-center gap-3 mb-10">
                            <button
                                type="button"
                                onClick={handleBack}
                                disabled={transitioning}
                                className="flex items-center justify-center rounded-full border transition-all duration-150 cursor-pointer disabled:opacity-40"
                                style={{
                                    width: 36,
                                    height: 36,
                                    background: "white",
                                    borderColor: "var(--border)",
                                    color: "var(--text-muted)",
                                    flexShrink: 0,
                                }}
                                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) =>
                                    (e.currentTarget.style.borderColor = "var(--sage)")
                                }
                                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) =>
                                    (e.currentTarget.style.borderColor = "var(--border)")
                                }
                            >
                                <ArrowLeft size={14} strokeWidth={2} />
                            </button>

                            <div
                                className="flex-1 rounded-full overflow-hidden"
                                style={{ height: 3, background: "var(--border)" }}
                            >
                                <div
                                    className="h-full rounded-full transition-all duration-500 ease-out"
                                    style={{
                                        width: `${progress}%`,
                                        background: "linear-gradient(90deg, var(--sage), var(--teal))",
                                    }}
                                />
                            </div>

                            <span
                                className="text-xs font-medium flex-shrink-0"
                                style={{ color: "var(--text-muted)" }}
                            >
                                {current + 1} / {questions.length}
                            </span>
                        </div>

                        {/* Category chip */}
                        <div
                            className="inline-flex items-center rounded-full border mb-5 text-xs font-medium uppercase tracking-widest"
                            style={{
                                padding: "4px 13px",
                                background: "rgba(123,169,139,0.09)",
                                borderColor: "rgba(123,169,139,0.24)",
                                color: "var(--sage-dark)",
                            }}
                        >
                            {q.category}
                        </div>

                        {/* Question */}
                        <h2
                            className="font-cormorant font-light mb-8"
                            style={{
                                fontSize: "clamp(24px, 4vw, 32px)",
                                lineHeight: 1.3,
                                color: "var(--deep)",
                                letterSpacing: "-0.01em",
                            }}
                        >
                            {q.text}
                        </h2>

                        {/* Options */}
                        <div className="flex flex-col gap-3">
                            {q.options.map((opt: Option) => {
                                const isSelected: boolean = answeredValue === opt.value;
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => handleAnswer(opt.value)}
                                        disabled={transitioning}
                                        className="w-full text-left rounded-2xl border transition-all duration-200 cursor-pointer disabled:cursor-default"
                                        style={{
                                            padding: "16px 20px",
                                            background: isSelected ? "rgba(123,169,139,0.10)" : "white",
                                            borderColor: isSelected ? "var(--sage)" : "var(--border)",
                                            color: isSelected ? "var(--sage-dark)" : "var(--text)",
                                            boxShadow: isSelected
                                                ? "0 0 0 3px rgba(123,169,139,0.13)"
                                                : "0 1px 4px rgba(28,58,58,0.04)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: 12,
                                        }}
                                        onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                                            if (!isSelected)
                                                e.currentTarget.style.borderColor = "var(--sage-light)";
                                        }}
                                        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                                            if (!isSelected)
                                                e.currentTarget.style.borderColor = "var(--border)";
                                        }}
                                    >
                                        <span className="text-sm font-light leading-relaxed">
                                            {opt.label}
                                        </span>
                                        <span
                                            className="flex-shrink-0 rounded-full flex items-center justify-center transition-all duration-200"
                                            style={{
                                                width: 22,
                                                height: 22,
                                                background: isSelected ? "var(--sage)" : "transparent",
                                                border: isSelected
                                                    ? "2px solid var(--sage)"
                                                    : "2px solid var(--border)",
                                            }}
                                        >
                                            {isSelected && (
                                                <svg
                                                    width="11"
                                                    height="11"
                                                    viewBox="0 0 11 11"
                                                    fill="none"
                                                    stroke="white"
                                                    strokeWidth="2.2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M2 5.5l2.5 2.5L9 3" />
                                                </svg>
                                            )}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                    </div>
                </section>
            </div>
        );
    }

    // ── EMAIL CAPTURE ──────────────────────────────────────────────────────────

    if (step === "email") {
        return (
            <div className="relative min-h-screen" style={{ background: "var(--white)" }}>
                <BgBlobs />
                <section className="relative z-10 pt-20 pb-24 px-4 sm:px-6">
                    <div className="max-w-md mx-auto animate-fade-up">

                        <div className="text-center mb-8">
                            <div
                                className="inline-flex items-center justify-center rounded-2xl mb-5"
                                style={{
                                    width: 56,
                                    height: 56,
                                    background: "linear-gradient(135deg, var(--sage), var(--teal))",
                                }}
                            >
                                <Mail size={24} color="white" strokeWidth={1.8} />
                            </div>
                            <h2
                                className="font-cormorant font-light mb-3"
                                style={{
                                    fontSize: "clamp(28px, 5vw, 38px)",
                                    color: "var(--deep)",
                                    letterSpacing: "-0.02em",
                                    lineHeight: 1.2,
                                }}
                            >
                                Almost there
                            </h2>
                            <p
                                className="text-sm font-light leading-relaxed"
                                style={{ color: "var(--text-muted)", maxWidth: 340, margin: "0 auto" }}
                            >
                                Enter your details to receive your personalised results and be
                                matched with the right therapist.
                            </p>
                        </div>

                        {/* Form card */}
                        <div
                            className="rounded-2xl border relative overflow-hidden"
                            style={{
                                background: "white",
                                borderColor: "var(--border)",
                                boxShadow: "0 4px 24px rgba(28,58,58,0.07)",
                            }}
                        >
                            <div
                                className="absolute top-0 left-0 right-0"
                                style={{
                                    height: 2,
                                    background: "linear-gradient(90deg, var(--sage), var(--teal), var(--sage-light))",
                                }}
                            />

                            <div className="px-7 pt-8 pb-7">
                                <form onSubmit={handleEmailSubmit} className="flex flex-col gap-5">

                                    <div>
                                        <label
                                            htmlFor="field-name"
                                            className="block text-xs font-medium uppercase tracking-widest mb-2"
                                            style={{ color: "var(--sage-dark)" }}
                                        >
                                            Your Name
                                        </label>
                                        <input
                                            id="field-name"
                                            type="text"
                                            placeholder="First name"
                                            value={name}
                                            autoComplete="given-name"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setName(e.target.value);
                                                setErrors((prev) => ({ ...prev, name: undefined }));
                                            }}
                                            className={`form-input${errors.name ? " form-input-error" : ""}`}
                                        />
                                        {errors.name && (
                                            <p className="text-xs mt-1.5" style={{ color: "var(--error)" }}>
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="field-email"
                                            className="block text-xs font-medium uppercase tracking-widest mb-2"
                                            style={{ color: "var(--sage-dark)" }}
                                        >
                                            Email Address
                                        </label>
                                        <input
                                            id="field-email"
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            autoComplete="email"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setEmail(e.target.value);
                                                setErrors((prev) => ({ ...prev, email: undefined }));
                                            }}
                                            className={`form-input${errors.email ? " form-input-error" : ""}`}
                                        />
                                        {errors.email && (
                                            <p className="text-xs mt-1.5" style={{ color: "var(--error)" }}>
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="field-phone"
                                            className="block text-xs font-medium uppercase tracking-widest mb-2"
                                            style={{ color: "var(--sage-dark)" }}
                                        >
                                            Phone Number
                                        </label>
                                        <input
                                            id="field-phone"
                                            type="tel"
                                            placeholder="+234 000 000 0000"
                                            value={phone}
                                            autoComplete="tel"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setPhone(e.target.value);
                                                setErrors((prev) => ({ ...prev, phone: undefined }));
                                            }}
                                            className={`form-input${errors.phone ? " form-input-error" : ""}`}
                                        />
                                        {errors.phone && (
                                            <p className="text-xs mt-1.5" style={{ color: "var(--error)" }}>
                                                {errors.phone}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full inline-flex items-center justify-center gap-2 text-sm font-medium text-white rounded-full transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-1"
                                        style={{
                                            padding: "15px 28px",
                                            background: "linear-gradient(135deg, var(--sage-dark), var(--teal))",
                                            boxShadow: "0 4px 18px rgba(61,139,139,0.25)",
                                        }}
                                    >
                                        {submitting ? "Saving your results…" : "See My Results"}
                                        {!submitting && <ArrowRight size={15} strokeWidth={2} />}
                                    </button>

                                </form>

                                <div className="flex items-center justify-center gap-2 mt-5">
                                    <Shield
                                        size={12}
                                        fill="#6fb8b8"
                                        stroke="#3d8b8b"
                                        strokeWidth={1.5}
                                    />
                                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                                        We never share your data. Unsubscribe any time.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <p className="text-center text-xs mt-4" style={{ color: "var(--text-muted)" }}>
                            By continuing you agree to our{" "}
                            <Link
                                href="/privacy"
                                className="underline underline-offset-2"
                                style={{ color: "var(--sage-dark)" }}
                            >
                                Privacy Policy
                            </Link>
                        </p>

                    </div>
                </section>
            </div>
        );
    }

    // ── RESULT ─────────────────────────────────────────────────────────────────

    return (
        <div className="relative min-h-screen" style={{ background: "var(--white)" }}>
            <BgBlobs />
            <section className="relative z-10 pt-20 pb-24 px-4 sm:px-6">
                <div className="max-w-lg mx-auto animate-fade-up">

                    {/* Score banner */}
                    <div
                        className="rounded-3xl relative overflow-hidden mb-5 text-white text-center"
                        style={{ padding: "44px 36px", background: result.gradient }}
                    >
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{
                                backgroundImage:
                                    "radial-gradient(circle at 20% 80%, white 0%, transparent 60%)",
                            }}
                        />
                        <p
                            className="text-xs uppercase tracking-widest opacity-75 mb-2 relative z-10"
                            style={{ letterSpacing: "0.14em" }}
                        >
                            Your result
                        </p>
                        <p
                            className="font-cormorant font-light relative z-10"
                            style={{ fontSize: "clamp(30px, 5vw, 42px)", lineHeight: 1.15 }}
                        >
                            {result.band}
                        </p>
                        <div className="flex items-center justify-center gap-3 mt-2 relative z-10">
                            <div className="h-px flex-1 opacity-25" style={{ background: "white" }} />
                            <p className="text-xs opacity-60">
                                Score {totalScore} / {questions.length * 3}
                            </p>
                            <div className="h-px flex-1 opacity-25" style={{ background: "white" }} />
                        </div>
                    </div>

                    {/* Headline + summary */}
                    <div
                        className="rounded-2xl border p-7 mb-4"
                        style={{
                            background: "white",
                            borderColor: "var(--border)",
                            boxShadow: "0 2px 12px rgba(28,58,58,0.05)",
                        }}
                    >
                        <h2
                            className="font-cormorant font-light mb-3"
                            style={{
                                fontSize: "clamp(22px, 4vw, 28px)",
                                color: "var(--deep)",
                                letterSpacing: "-0.01em",
                                lineHeight: 1.25,
                            }}
                        >
                            {result.headline}
                            {name ? `, ${name}` : ""}
                        </h2>
                        <p className="text-sm font-light leading-relaxed" style={{ color: "var(--text-muted)" }}>
                            {result.summary}
                        </p>
                    </div>

                    {/* What happens next */}
                    <div
                        className="rounded-2xl border p-6 mb-6"
                        style={{
                            background: "rgba(123,169,139,0.06)",
                            borderColor: "rgba(123,169,139,0.22)",
                        }}
                    >
                        <p
                            className="text-xs font-medium uppercase tracking-widest mb-4"
                            style={{ color: "var(--sage-dark)", letterSpacing: "0.1em" }}
                        >
                            What happens next
                        </p>
                        <div className="flex flex-col gap-3">
                            {nextSteps.map((item) => (
                                <div key={item} className="flex items-start gap-3">
                                    <CheckCircle
                                        size={15}
                                        fill="var(--sage)"
                                        stroke="white"
                                        strokeWidth={2.5}
                                        style={{ flexShrink: 0, marginTop: 2 }}
                                    />
                                    <span className="text-sm font-light" style={{ color: "var(--text-muted)" }}>
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                            href="/#book"
                            className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-medium text-white rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                            style={{
                                padding: "15px 24px",
                                background: "linear-gradient(135deg, var(--sage-dark), var(--teal))",
                                boxShadow: "0 4px 18px rgba(61,139,139,0.25)",
                            }}
                        >
                            {result.cta}
                            <ArrowRight size={15} strokeWidth={2} />
                        </Link>
                        <Link
                            href="/services"
                            className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-medium rounded-full border transition-all duration-200 hover:-translate-y-0.5"
                            style={{
                                padding: "15px 24px",
                                borderColor: "var(--border)",
                                color: "var(--sage-dark)",
                                background: "white",
                            }}
                        >
                            View our services
                        </Link>
                    </div>

                    {/* Spam notice + crisis line */}
                    <p className="text-center text-xs mt-5" style={{ color: "var(--text-muted)" }}>
                        Didn&apos;t receive your email?{" "}
                        <span style={{ color: "var(--sage-dark)", fontWeight: 500 }}>
                            Check your spam or junk folder
                        </span>
                        {" "}— it may have landed there.
                        {" "}If you&apos;re in crisis, please contact{" "}
                        <a
                            href="tel:112"
                            className="underline underline-offset-2"
                            style={{ color: "var(--sage-dark)" }}
                        >
                            emergency services
                        </a>
                        .
                    </p>

                </div>
            </section>
        </div>
    );
}