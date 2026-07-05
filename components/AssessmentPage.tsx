

// "use client";

// import { useState, useEffect, Fragment, useRef, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";
// import {
//     ArrowRight,
//     ArrowLeft,
//     Mail,
//     Shield,
//     Lock,
//     Sparkles,
//     Activity,
//     Menu,
//     X,
//     Loader2,
// } from "lucide-react";
// import { useLiveCounter } from "@/hooks/use-live-counter";
// import { logger } from "@/lib/logger";
// import { analytics } from "@/lib/analytics/client";
// // ── Types ──────────────────────────────────────────────────────────────────────

// interface Option {
//     label: string;
//     value: number;
// }

// interface Question {
//     id: string;
//     category: string;
//     text: string;
//     options: Option[];
// }

// interface FormErrors {
//     name?: string;
//     email?: string;
//     phone?: string;
// }

// type Step = "intro" | "quiz" | "email" | "analysing";
// type LoadPhase = "a" | "b" | "c";

// // ── Data ───────────────────────────────────────────────────────────────────────

// const questions: Question[] = [
//     {
//         id: "q1",
//         category: "Mood",
//         text: "In the past two weeks, how often have you felt down, hopeless, or empty?",
//         options: [
//             { label: "Rarely or never", value: 0 },
//             { label: "A few days", value: 1 },
//             { label: "More than half the days", value: 2 },
//             { label: "Almost every day", value: 3 },
//         ],
//     },
//     {
//         id: "q2",
//         category: "Anxiety",
//         text: "How often have you felt nervous, anxious, or on edge?",
//         options: [
//             { label: "Rarely or never", value: 0 },
//             { label: "A few days", value: 1 },
//             { label: "More than half the days", value: 2 },
//             { label: "Almost every day", value: 3 },
//         ],
//     },
//     {
//         id: "q3",
//         category: "Energy",
//         text: "How would you describe your energy levels lately?",
//         options: [
//             { label: "Good — I feel energised most days", value: 0 },
//             { label: "Okay — some low patches but manageable", value: 1 },
//             { label: "Low — I often struggle to get going", value: 2 },
//             { label: "Very low — it's affecting my daily life", value: 3 },
//         ],
//     },
//     {
//         id: "q4",
//         category: "Sleep",
//         text: "How has your sleep been recently?",
//         options: [
//             { label: "Good — mostly restful nights", value: 0 },
//             { label: "Occasionally disrupted", value: 1 },
//             { label: "Often restless or hard to fall asleep", value: 2 },
//             { label: "Poor — it's affecting me significantly", value: 3 },
//         ],
//     },
//     {
//         id: "q5",
//         category: "Relationships",
//         text: "How are your relationships with people close to you?",
//         options: [
//             { label: "Mostly good and connected", value: 0 },
//             { label: "Some tension or distance", value: 1 },
//             { label: "Strained — communication has been hard", value: 2 },
//             { label: "Isolated or in serious conflict", value: 3 },
//         ],
//     },
//     {
//         id: "q6",
//         category: "Stress",
//         text: "How well are you coping with everyday pressure?",
//         options: [
//             { label: "Well — stress feels manageable", value: 0 },
//             { label: "Sometimes overwhelmed, but coping", value: 1 },
//             { label: "Often overwhelmed", value: 2 },
//             { label: "Constantly overwhelmed — hard to function", value: 3 },
//         ],
//     },
//     {
//         id: "q7",
//         category: "Self-worth",
//         text: "How do you feel about yourself day to day?",
//         options: [
//             { label: "Generally positive and confident", value: 0 },
//             { label: "Somewhat self-critical at times", value: 1 },
//             { label: "Often feel inadequate or worthless", value: 2 },
//             { label: "Struggling with very low self-worth", value: 3 },
//         ],
//     },
//     {
//         id: "q8",
//         category: "Support",
//         text: "What would you most like from speaking with a therapist?",
//         options: [
//             { label: "Personal growth and resilience", value: 0 },
//             { label: "Help with a specific challenge", value: 1 },
//             { label: "Support through a difficult period", value: 2 },
//             { label: "Urgent help — I'm really struggling", value: 3 },
//         ],
//     },
// ];

// // ── Nav ────────────────────────────────────────────────────────────────────────

// function AssessmentNav() {
//     const [menuOpen, setMenuOpen] = useState(false);
//     const [scrolled, setScrolled] = useState(false);

//     useEffect(() => {
//         const onScroll = () => setScrolled(window.scrollY > 12);
//         window.addEventListener("scroll", onScroll, { passive: true });
//         return () => window.removeEventListener("scroll", onScroll);
//     }, []);


//     return (
//         <>
//             <nav
//                 className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled
//                     ? "bg-[rgba(250,249,246,0.92)] backdrop-blur-[18px] shadow-[0_1px_0_rgba(28,40,36,0.08)]"
//                     : "bg-transparent"
//                     }`}
//                 aria-label="Site navigation"
//             >
//                 <div className="max-w-[1100px] mx-auto px-6 h-[68px] flex items-center justify-between">
//                     <Link
//                         href="/"
//                         className="flex items-center gap-2.5 no-underline"
//                         aria-label="Mentel — home"
//                     >
//                         <div className="w-8 h-8 rounded-[10px] flex items-center justify-center overflow-hidden">
//                             <Image
//                                 src="/logo-assessment.png"
//                                 alt="Mentel logo"
//                                 width={32}
//                                 height={32}
//                                 className="object-cover"
//                             />
//                         </div>
//                         <span className="font-['Cormorant_Garamond',Georgia,serif] text-[22px] font-semibold tracking-[-0.02em] text-[#1c2820]">
//                             Mentel
//                         </span>
//                     </Link>

//                     <div className="hidden md:flex items-center gap-8">
//                         {["About", "Services", "Articles", "Company"].map((item) => (
//                             <Link
//                                 key={item}
//                                 href={`/${item === "Company" ? "eap" : item.toLowerCase()}`}
//                                 className="text-sm font-[450] text-[#4a5a52] no-underline tracking-[0.01em] hover:text-[#1c2820] transition-colors"
//                             >
//                                 {item}
//                             </Link>
//                         ))}
//                         <Link
//                             href="/#book"
//                             className="text-[13px] font-medium text-white bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] px-5 py-2.5 rounded-full no-underline tracking-[0.01em] shadow-[0_2px_12px_rgba(30,107,107,0.25)] hover:opacity-90 transition-opacity"
//                         >
//                             Book a session
//                         </Link>
//                     </div>

//                     <button
//                         type="button"
//                         onClick={() => setMenuOpen((v) => !v)}
//                         aria-label={menuOpen ? "Close menu" : "Open menu"}
//                         aria-expanded={menuOpen}
//                         className="md:hidden bg-transparent border-0 cursor-pointer p-2 text-[#1c2820]"
//                     >
//                         {menuOpen ? <X size={22} /> : <Menu size={22} />}
//                     </button>
//                 </div>

//                 {menuOpen && (
//                     <div className="md:hidden bg-[rgba(250,249,246,0.98)] backdrop-blur-xl border-t border-[rgba(28,40,36,0.08)] px-6 pt-4 pb-6">
//                         {["About", "Services", "Therapists", "Articles"].map((item) => (
//                             <Link
//                                 key={item}
//                                 href={`/${item.toLowerCase()}`}
//                                 className="block py-3 text-base text-[#1c2820] no-underline border-b border-[rgba(28,40,36,0.06)]"
//                                 onClick={() => setMenuOpen(false)}
//                             >
//                                 {item}
//                             </Link>
//                         ))}
//                         <Link
//                             href="/#book"
//                             className="block mt-4 text-center text-sm font-medium text-white bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] py-3.5 px-5 rounded-full no-underline"
//                             onClick={() => setMenuOpen(false)}
//                         >
//                             Book a session
//                         </Link>
//                     </div>
//                 )}
//             </nav>

//             <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,450;9..40,500;9..40,600&display=swap');

//         *, *::before, *::after { box-sizing: border-box; }
//         body { font-family: 'DM Sans', -apple-system, sans-serif; background: #faf9f6; -webkit-font-smoothing: antialiased; }

//         @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
//         @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
//         @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }

//         .fade-up { animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
//         .fade-in { animation: fadeIn 0.45s ease both; }
//         .fade-up-delay-1 { animation-delay: 0.08s; }
//         .fade-up-delay-2 { animation-delay: 0.16s; }
//         .fade-up-delay-3 { animation-delay: 0.24s; }

//         .option-btn { transition: all 0.2s cubic-bezier(0.22,1,0.36,1); }
//         .option-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(45,122,90,0.12) !important; border-color: #2d7a5a !important; }
//         .option-btn:active:not(:disabled) { transform: scale(0.99); }

//         .cta-btn { transition: all 0.22s cubic-bezier(0.22,1,0.36,1); }
//         .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(30,107,107,0.38) !important; }
//         .cta-btn:active { transform: translateY(0); }

//         .form-input {
//           width: 100%; padding: 14px 16px;
//           border: 1.5px solid #d8dbd5; border-radius: 12px;
//           font-family: 'DM Sans', sans-serif; font-size: 15px;
//           color: #1c2820; background: #fdfcfa;
//           transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
//           outline: none; -webkit-appearance: none;
//         }
//         .form-input:focus { border-color: #2d7a5a; box-shadow: 0 0 0 4px rgba(45,122,90,0.1); background: white; }
//         .form-input::placeholder { color: #b0bab4; }
//         .form-input.error { border-color: #c0392b; box-shadow: 0 0 0 4px rgba(192,57,43,0.08); }

//         .testimonial-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
//         .testimonial-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(28,40,36,0.09) !important; }
//       `}</style>
//         </>
//     );
// }

// // ── PageWrapper ────────────────────────────────────────────────────────────────

// export function PageWrapper({ children }: { children: React.ReactNode }) {
//     return (
//         <div className="min-h-screen bg-[#faf9f6] font-['DM_Sans',sans-serif]">
//             <AssessmentNav />
//             {children}
//         </div>
//     );
// }

// // ── Main Component ─────────────────────────────────────────────────────────────

// export default function AssessmentPage() {
//     const router = useRouter();
//     const [step, setStep] = useState<Step>("intro");
//     const [current, setCurrent] = useState(0);
//     const [answers, setAnswers] = useState<Record<string, number>>({});
//     const [email, setEmail] = useState("");
//     const [phone, setPhone] = useState("");
//     const [name, setName] = useState("");
//     const [submitting, setSubmitting] = useState(false);
//     const [errors, setErrors] = useState<FormErrors>({});
//     const [transitioning, setTransitioning] = useState(false);
//     const [selectedOption, setSelectedOption] = useState<number | null>(null);
//     const [loadPhase, setLoadPhase] = useState<LoadPhase>("a");
//     const transitioningRef = useRef(false);

//     const totalScore = Object.values(answers).reduce((a, v) => a + v, 0);
//     const progress = ((current + 1) / questions.length) * 100;
//     const assessedCount = useLiveCounter(2400, "2026-06-01", 2000);
//     const CAL_EVENT_TYPE_ID: number = 6101260

//     useEffect(() => {
//         window.scrollTo({ top: 0, behavior: "smooth" });
//         setSelectedOption(null);
//     }, [current, step]);

//     useEffect(() => {
//         analytics.track("ASSESSMENT_PAGE_VIEWED");
//     }, []);


//     useEffect(() => {
//         if (current === 1) {
//             analytics.track("ASSESSMENT_STARTED");
//         }
//     }, [current]);
//     // Drives the "analysing your results" sequence shown right after the
//     // email form is submitted. Runs entirely on this page so there's only
//     // ONE continuous loading experience, then we navigate straight into a
//     // result page that can render immediately (no second spinner there).
//     useEffect(() => {
//         if (step !== "analysing") return;

//         setLoadPhase("a");
//         const t1 = setTimeout(() => setLoadPhase("b"), 1300);
//         const t2 = setTimeout(() => setLoadPhase("c"), 2600);
//         const t3 = setTimeout(() => {
//             router.push("/assessment/result");
//         }, 3600);

//         return () => {
//             clearTimeout(t1);
//             clearTimeout(t2);
//             clearTimeout(t3);
//         };
//     }, [step, router]);

//     const handleAnswerStable = useCallback(
//         (value: number): void => {
//             if (transitioningRef.current) return;

//             setAnswers((prev) => {
//                 const q = questions[current];
//                 if (!q) return prev;
//                 return { ...prev, [q.id]: value };
//             });

//             setSelectedOption(value);
//             transitioningRef.current = true;
//             setTransitioning(true);

//             setTimeout(() => {
//                 setCurrent((c) => {
//                     if (c < questions.length - 1) {
//                         return c + 1;
//                     } else {
//                         setStep("email");
//                         return c;
//                     }
//                 });
//                 transitioningRef.current = false;
//                 setTransitioning(false);
//                 setSelectedOption(null);
//             }, 380);
//         },
//         [current]
//     );

//     const handleBack = useCallback((): void => {
//         if (transitioningRef.current) return;
//         setCurrent((c) => {
//             if (c > 0) return c - 1;
//             setStep("intro");
//             return c;
//         });
//     }, []);

//     const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//         setName(e.target.value);
//         setErrors((p) => ({ ...p, name: undefined }));
//     }, []);

//     const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//         setEmail(e.target.value);
//         setErrors((p) => ({ ...p, email: undefined }));
//     }, []);

//     const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//         setPhone(e.target.value);
//         setErrors((p) => ({ ...p, phone: undefined }));
//     }, []);

//     const validate = useCallback((): boolean => {
//         const e: FormErrors = {};
//         if (!name.trim() || name.trim().length < 2) e.name = "Please enter your name.";
//         if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Please enter a valid email.";
//         if (phone.replace(/\D/g, "").length < 7) e.phone = "Please enter a valid phone number.";
//         setErrors(e);
//         return !Object.keys(e).length;
//     }, [name, email, phone]);

//     const handleEmailSubmit = useCallback(
//         async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
//             e.preventDefault();
//             if (!validate()) return;
//             setSubmitting(true);

//             try {
//                 await fetch("/api/assessment", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({
//                         name,
//                         email,
//                         phone,
//                         score: totalScore,
//                         answers,
//                     }),
//                 });
//             } catch { }

//             // Persist result data to sessionStorage so ResultPage can read it
//             if (typeof window !== "undefined") {
//                 sessionStorage.setItem(
//                     "mentel_assessment_result",
//                     JSON.stringify({ name, email, score: totalScore, answers, CAL_EVENT_TYPE_ID })
//                 );
//             }

//             // Don't reset submitting here — we move straight into the
//             // "analysing" step, which takes over the screen entirely.
//             // This avoids the old flicker (disabled → briefly enabled →
//             // disabled again) since the button is simply replaced, not
//             // re-rendered in an intermediate state.
//             setStep("analysing");
//         },
//         [validate, name, email, phone, totalScore, answers, router]
//     );

//     // ── INTRO ──────────────────────────────────────────────────────────────────

//     if (step === "intro") {

//         return (
//             <PageWrapper>
//                 <section className="pt-24 pb-20 px-6">
//                     <div className="max-w-[680px] mx-auto fade-up">

//                         {/* Social proof pill */}
//                         <div className="inline-flex items-center gap-2.5 bg-[rgba(45,122,90,0.07)] border border-[rgba(45,122,90,0.18)] rounded-full pl-2 pr-4 py-1.5 mb-9">
//                             <div className="flex">
//                                 {[
//                                     "linear-gradient(135deg,#3d8b8b,#6fb8b8)",
//                                     "linear-gradient(135deg,#a97b3d,#d4b87b)",
//                                     "linear-gradient(135deg,#4e7a5e,#7ba98b)",
//                                     "linear-gradient(135deg,#5a6fa8,#8fa4d6)",
//                                 ].map((bg, i) => (
//                                     <div
//                                         key={i}
//                                         style={{ background: bg, marginLeft: i === 0 ? 0 : -8, zIndex: 4 - i }}
//                                         className="w-8 h-8 rounded-full border-2 border-[#faf9f6] relative flex items-center justify-center text-[10px] font-semibold text-white"
//                                     >
//                                         {["A", "E", "K", "C"][i]}
//                                     </div>
//                                 ))}
//                             </div>
//                             <span className="text-[13px] font-medium text-[#2d7a5a]">
//                                 {assessedCount.toLocaleString()}+ people assessed this month
//                             </span>
//                         </div>

//                         {/* Headline */}
//                         <h1 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(48px,8.5vw,76px)] font-light leading-[1.06] tracking-[-0.03em] text-[#1c2820] mb-6 fade-up">
//                             How are you{" "}
//                             <em className="text-[#2d7a5a] italic">really</em>{" "}
//                             doing?
//                         </h1>

//                         <p className="text-[clamp(16px,2.8vw,18px)] font-light leading-[1.75] text-[#5a6b5e] max-w-[500px] mb-[52px] fade-up fade-up-delay-1">
//                             Take our confidential 1-minute check-in designed by licensed professionals and get instant clarity on your mental wellness.
//                         </p>

//                         {/* Stats row */}
//                         <div className="flex items-center gap-7 mb-[52px] flex-wrap fade-up fade-up-delay-1">
//                             {[
//                                 { num: `${assessedCount.toLocaleString()}+`, label: "People assessed" },
//                                 { num: "1 min", label: "Average time" },
//                                 { num: "97%", label: "Found it helpful" },
//                             ].map((stat, i) => (
//                                 <Fragment key={stat.num}>
//                                     <div className="text-left">
//                                         <div className="font-['Cormorant_Garamond',Georgia,serif] text-[28px] font-medium text-[#1c2820] leading-none">
//                                             {stat.num}
//                                         </div>
//                                         <div className="text-[11px] text-[#5a6b5e] mt-1 tracking-[0.06em] uppercase font-medium">
//                                             {stat.label}
//                                         </div>
//                                     </div>
//                                     {i < 2 && <div className="w-px h-8 bg-[rgba(28,40,36,0.1)]" />}
//                                 </Fragment>
//                             ))}
//                         </div>

//                         {/* CTA */}
//                         <div className="fade-up fade-up-delay-3 mb-11">
//                             <button
//                                 type="button"
//                                 onClick={() => {
//                                     setStep("quiz");
//                                     (window as any).ttq?.track("Start trial");

//                                     // fire and forget (BEST UX)
//                                     fetch("/api/events/assessment-started", {
//                                         method: "POST",
//                                         keepalive: true,
//                                     });

//                                     analytics.track("ASSESSMENT_CLICKED")
//                                 }}
//                                 className="cta-btn inline-flex items-center justify-center gap-2.5 bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] text-white border-0 rounded-full px-10 py-[19px] text-[clamp(14px,4vw,17px)] font-medium font-['DM_Sans',sans-serif] cursor-pointer shadow-[0_6px_28px_rgba(30,107,107,0.32)] tracking-[0.01em]"
//                             >
//                                 <Activity size={17} strokeWidth={3} color="#a8e6cf" />
//                                 Get My Wellness Score
//                                 <ArrowRight size={17} strokeWidth={2} className="opacity-55" />
//                             </button>
//                             <p className="text-[12px] text-[#5a6b5e] mt-4 font-light">
//                                 Takes 1 minute · No account needed · Completely confidential
//                             </p>
//                         </div>

//                         {/* Trust grid */}
//                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 fade-up fade-up-delay-2">
//                             {[
//                                 { icon: Lock, title: "Confidential", desc: "Your answers are private and never stored anywhere" },
//                                 { icon: Sparkles, title: "Free", desc: "No hidden costs, no subscription required" },
//                                 { icon: Shield, title: "NDPR Compliant", desc: "Fully compliant with Nigerian data regulations" },
//                             ].map(({ icon: Icon, title, desc }) => (
//                                 <div
//                                     key={title}
//                                     className="bg-white border border-[#e4e9e5] rounded-[18px] p-5 flex flex-col gap-2.5 shadow-[0_1px_8px_rgba(28,40,36,0.04)]"
//                                 >
//                                     <div className="w-[38px] h-[38px] rounded-[11px] bg-[rgba(45,122,90,0.08)] flex items-center justify-center">
//                                         <Icon size={17} stroke="#2d7a5a" strokeWidth={1.8} />
//                                     </div>
//                                     <div className="text-sm font-medium text-[#1c2820]">{title}</div>
//                                     <div className="text-[12px] font-light text-[#5a6b5e] leading-[1.6]">{desc}</div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </section>

//                 {/* Testimonials */}
//                 <div className="bg-white border-t border-b border-[#ebebeb] py-12 px-6">
//                     <div className="max-w-[760px] mx-auto">
//                         <p className="text-[11px] tracking-[0.12em] uppercase text-[#5a6b5e] font-semibold text-center mb-9">
//                             What people say
//                         </p>
//                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
//                             {[
//                                 { text: "Finally understood what I was feeling — and felt truly seen.", name: "Adaeze O.", tag: "Lagos" },
//                                 { text: "The assessment was more honest than I expected. In a good way.", name: "Emeka T.", tag: "Abuja" },
//                                 { text: "The matched therapist was perfect. First session was transformative.", name: "Kemi A.", tag: "Port Harcourt" },
//                             ].map((t) => (
//                                 <div
//                                     key={t.name}
//                                     className="testimonial-card bg-[#faf9f6] border border-[#e8ede9] rounded-[18px] p-[22px] shadow-[0_2px_8px_rgba(28,40,36,0.04)]"
//                                 >
//                                     <div className="flex gap-0.5 mb-3.5">
//                                         {[...Array(5)].map((_, si) => (
//                                             <svg key={si} width="12" height="12" viewBox="0 0 12 12" fill="#f0c040">
//                                                 <path d="M6 1l1.5 3 3.3.5-2.4 2.3.6 3.2L6 8.5l-3 1.5.6-3.2L1.2 4.5l3.3-.5z" />
//                                             </svg>
//                                         ))}
//                                     </div>
//                                     <p className="text-sm font-light leading-[1.72] text-[#3a4a3e] mb-4 italic">
//                                         &ldquo;{t.text}&rdquo;
//                                     </p>
//                                     <div className="flex items-center gap-2.5">
//                                         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c8e6d8] to-[#a8c5b2] flex items-center justify-center text-[12px] font-semibold text-[#1c3a28]">
//                                             {t.name[0]}
//                                         </div>
//                                         <div>
//                                             <div className="text-[13px] font-medium text-[#1c2820]">{t.name}</div>
//                                             <div className="text-[11px] text-[#a0aba3]">{t.tag}</div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </PageWrapper>
//         );
//     }

//     // ── QUIZ ───────────────────────────────────────────────────────────────────

//     if (step === "quiz") {
//         const q = questions[current];
//         if (!q) return null;

//         const r = 18;
//         const circ = 2 * Math.PI * r;
//         const filled = circ - circ * (current / questions.length);

//         return (
//             <PageWrapper>
//                 <section className="pt-24 pb-20 px-6 min-h-screen">
//                     <div className="max-w-[560px] mx-auto fade-up">

//                         {/* Progress header */}
//                         <div className="mb-[52px]">
//                             <div className="flex items-center gap-3.5 mb-5">
//                                 <button
//                                     type="button"
//                                     onClick={handleBack}
//                                     disabled={transitioning}
//                                     aria-label="Go back"
//                                     className="w-10 h-10 rounded-full border-[1.5px] border-[#dce5df] bg-white cursor-pointer flex items-center justify-center text-[#5a6b5e] flex-shrink-0 transition-all shadow-[0_1px_6px_rgba(28,40,36,0.06)] hover:border-[#2d7a5a] hover:text-[#2d7a5a]"
//                                 >
//                                     <ArrowLeft size={15} strokeWidth={2} />
//                                 </button>

//                                 <div className="flex-1 h-[3px] bg-[#e8ede9] rounded-full overflow-hidden">
//                                     <div
//                                         className="h-full bg-gradient-to-r from-[#2d7a5a] to-[#1e6b6b] rounded-full transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
//                                         style={{ width: `${progress}%` }}
//                                     />
//                                 </div>

//                                 <div className="relative w-11 h-11 flex-shrink-0">
//                                     <svg width="44" height="44" viewBox="0 0 44 44">
//                                         <circle cx="22" cy="22" r={r} fill="none" strokeWidth="2.5" stroke="rgba(45,122,90,0.12)" />
//                                         <circle
//                                             cx="22" cy="22" r={r}
//                                             fill="none"
//                                             strokeWidth="2.5"
//                                             stroke="#2d7a5a"
//                                             strokeLinecap="round"
//                                             strokeDasharray={circ}
//                                             strokeDashoffset={filled}
//                                             style={{
//                                                 transform: "rotate(-90deg)",
//                                                 transformOrigin: "center",
//                                                 transition: "stroke-dashoffset 0.5s cubic-bezier(0.22,1,0.36,1)",
//                                             }}
//                                         />
//                                     </svg>
//                                     <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-[#2d7a5a]">
//                                         {current + 1}/{questions.length}
//                                     </span>
//                                 </div>
//                             </div>

//                             <span className="inline-block bg-[rgba(45,122,90,0.08)] text-[#2d7a5a] text-[11px] font-semibold tracking-[0.1em] uppercase px-3.5 py-[5px] rounded-full">
//                                 {q.category}
//                             </span>
//                         </div>

//                         <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(28px,5.5vw,38px)] font-light leading-[1.28] text-[#1c2820] tracking-[-0.018em] mb-10">
//                             {q.text}
//                         </h2>

//                         <div className="flex flex-col gap-3">
//                             {q.options.map((opt, idx) => {
//                                 const isSelected =
//                                     selectedOption === opt.value || answers[q.id] === opt.value;
//                                 return (
//                                     <button
//                                         key={opt.value}
//                                         type="button"
//                                         onClick={() => handleAnswerStable(opt.value)}
//                                         disabled={transitioning}
//                                         className="option-btn w-full text-left px-5 py-[18px] rounded-2xl border-[1.5px] flex items-center gap-4 font-['DM_Sans',sans-serif]"
//                                         style={{
//                                             border: isSelected ? "1.5px solid #2d7a5a" : "1.5px solid #e4e9e5",
//                                             background: isSelected ? "rgba(45,122,90,0.06)" : "white",
//                                             cursor: transitioning ? "default" : "pointer",
//                                             boxShadow: isSelected
//                                                 ? "0 0 0 4px rgba(45,122,90,0.08), 0 2px 12px rgba(45,122,90,0.1)"
//                                                 : "0 1px 4px rgba(28,40,36,0.04)",
//                                         }}
//                                     >
//                                         <div
//                                             className="w-[30px] h-[30px] rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-[220ms]"
//                                             style={{
//                                                 background: isSelected ? "#2d7a5a" : "#f0f4f1",
//                                                 border: isSelected ? "none" : "1.5px solid #dce5df",
//                                             }}
//                                         >
//                                             {isSelected ? (
//                                                 <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
//                                                     <path d="M2.5 6.5l3 3L10.5 3" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
//                                                 </svg>
//                                             ) : (
//                                                 <span className="text-[11px] font-bold text-[#a0b0a8]">
//                                                     {["A", "B", "C", "D"][idx]}
//                                                 </span>
//                                             )}
//                                         </div>
//                                         <span
//                                             className="text-[15px] leading-[1.5] transition-all duration-200"
//                                             style={{
//                                                 fontWeight: isSelected ? 400 : 300,
//                                                 color: isSelected ? "#1c2820" : "#3a4a3e",
//                                             }}
//                                         >
//                                             {opt.label}
//                                         </span>
//                                     </button>
//                                 );
//                             })}
//                         </div>

//                         <p className="text-center text-[12px] text-[#b0bab4] mt-8 flex items-center justify-center gap-1.5">
//                             <Lock size={11} stroke="#b0bab4" strokeWidth={2} />
//                             Your answers are private and never shared
//                         </p>
//                     </div>
//                 </section>
//             </PageWrapper>
//         );
//     }

//     // ── EMAIL CAPTURE ──────────────────────────────────────────────────────────

//     if (step === "email") {
//         return (
//             <PageWrapper>
//                 <section className="pt-[108px] pb-20 px-6 min-h-screen">
//                     <div className="max-w-[460px] mx-auto fade-up">

//                         <div className="text-center mb-9">
//                             <div
//                                 className="w-[68px] h-[68px] rounded-[22px] bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] inline-flex items-center justify-center shadow-[0_10px_30px_rgba(30,107,107,0.28)] mb-6"
//                                 style={{ animation: "float 3s ease-in-out infinite" }}
//                             >
//                                 <Mail size={28} color="white" strokeWidth={1.6} />
//                             </div>
//                             <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(32px,7vw,46px)] font-light tracking-[-0.025em] text-[#1c2820] leading-[1.12] mb-3.5">
//                                 Almost there
//                             </h2>
//                             <p className="text-[15px] font-light text-[#5a6b5e] leading-[1.7] max-w-[340px] mx-auto">
//                                 Enter your details to see your personalised results and be matched with the right therapist.
//                             </p>
//                         </div>

//                         <div className="bg-white rounded-3xl border border-[#e4e9e5] overflow-hidden shadow-[0_6px_40px_rgba(28,40,36,0.08)]">
//                             <div className="h-[3px] bg-gradient-to-r from-[#2d7a5a] via-[#1e6b6b] to-[#5da885]" />

//                             <div className="p-8 pt-8">
//                                 <form onSubmit={handleEmailSubmit} noValidate className="flex flex-col gap-5">

//                                     {/* Name */}
//                                     <div>
//                                         <label
//                                             htmlFor="field-name"
//                                             className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-[#4a6a56] mb-2"
//                                         >
//                                             Your Name
//                                         </label>
//                                         <input
//                                             id="field-name"
//                                             type="text"
//                                             placeholder="First name"
//                                             value={name}
//                                             autoFocus
//                                             autoComplete="name"
//                                             onChange={handleNameChange}
//                                             className={`form-input${errors.name ? " error" : ""}`}
//                                             aria-invalid={!!errors.name}
//                                         />
//                                         {errors.name && (
//                                             <p className="text-[12px] text-[#c0392b] mt-1.5 flex items-center gap-1">
//                                                 <span>⚠</span> {errors.name}
//                                             </p>
//                                         )}
//                                     </div>

//                                     {/* Email */}
//                                     <div>
//                                         <label
//                                             htmlFor="field-email"
//                                             className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-[#4a6a56] mb-2"
//                                         >
//                                             Email Address
//                                         </label>
//                                         <input
//                                             id="field-email"
//                                             type="email"
//                                             placeholder="you@example.com"
//                                             value={email}
//                                             autoComplete="email"
//                                             onChange={handleEmailChange}
//                                             className={`form-input${errors.email ? " error" : ""}`}
//                                             aria-invalid={!!errors.email}
//                                         />
//                                         {errors.email && (
//                                             <p className="text-[12px] text-[#c0392b] mt-1.5 flex items-center gap-1">
//                                                 <span>⚠</span> {errors.email}
//                                             </p>
//                                         )}
//                                     </div>

//                                     {/* Phone */}
//                                     <div>
//                                         <label
//                                             htmlFor="field-phone"
//                                             className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-[#4a6a56] mb-2"
//                                         >
//                                             Phone Number
//                                         </label>
//                                         <input
//                                             id="field-phone"
//                                             type="tel"
//                                             placeholder="+234 000 000 0000"
//                                             value={phone}
//                                             autoComplete="tel"
//                                             onChange={handlePhoneChange}
//                                             className={`form-input${errors.phone ? " error" : ""}`}
//                                             aria-invalid={!!errors.phone}
//                                         />
//                                         {errors.phone && (
//                                             <p className="text-[12px] text-[#c0392b] mt-1.5 flex items-center gap-1">
//                                                 <span>⚠</span> {errors.phone}
//                                             </p>
//                                         )}
//                                     </div>

//                                     <button
//                                         type="submit"
//                                         disabled={submitting}
//                                         className="cta-btn w-full py-[17px] px-7 bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] text-white border-0 rounded-full text-[15px] font-medium font-['DM_Sans',sans-serif] flex items-center justify-center gap-2 mt-1 shadow-[0_4px_22px_rgba(30,107,107,0.3)]"
//                                         style={{
//                                             cursor: submitting ? "not-allowed" : "pointer",
//                                             opacity: submitting ? 0.7 : 1,
//                                         }}
//                                     >
//                                         {submitting && (
//                                             <Loader2 size={15} strokeWidth={2.5} className="animate-spin" />
//                                         )}
//                                         {submitting ? "Saving your results…" : "See My Results"}
//                                         {!submitting && <ArrowRight size={15} strokeWidth={2} />}
//                                     </button>
//                                 </form>

//                                 <div className="flex items-center justify-center gap-1.5 mt-5">
//                                     <Shield size={12} stroke="#2d7a5a" strokeWidth={1.8} />
//                                     <p className="text-[12px] text-[#a0aba3] font-light">We never share your data · Unsubscribe any time</p>
//                                 </div>
//                             </div>
//                         </div>

//                         <p className="text-center text-[12px] text-[#a0aba3] mt-4.5">
//                             By continuing you agree to our{" "}
//                             <Link href="/privacy" className="text-[#2d7a5a] underline underline-offset-[3px]">
//                                 Privacy Policy
//                             </Link>
//                         </p>
//                     </div>
//                 </section>
//             </PageWrapper>
//         );
//     }

//     // ── ANALYSING (loading sequence run here, then we navigate to the result page) ──

//     const isHighScore = totalScore > 18;
//     const phaseColor = isHighScore && loadPhase === "c" ? "#a33030" : "#05673e";
//     const phaseCopy: Record<LoadPhase, { text: string; sub: string; pct: number }> = {
//         a: {
//             text: "Analysing your 8 responses…",
//             sub: "Cross-referencing mood, stress, sleep and relational patterns",
//             pct: 35,
//         },
//         b: {
//             text: `Comparing against ${assessedCount.toLocaleString()}+ profiles…`,
//             sub: "Identifying your specific pattern type",
//             pct: 70,
//         },
//         c: {
//             text: isHighScore ? "Elevated threshold detected." : "Pattern identified.",
//             sub: isHighScore ? "Your results require careful review" : "Your personalised profile is ready",
//             pct: 95,
//         },
//     };
//     const msg = phaseCopy[loadPhase];

//     return (
//         <PageWrapper>
//             <div className="min-h-screen flex items-center justify-center px-6">
//                 <div className="text-center max-w-[380px] fade-in">
//                     <div
//                         className="w-16 h-16 rounded-full mx-auto mb-9"
//                         style={{
//                             border: `3px solid ${phaseColor}20`,
//                             borderTopColor: phaseColor,
//                             animation: "spin 0.85s linear infinite",
//                         }}
//                     />
//                     <h2
//                         className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(22px,5vw,30px)] font-light leading-[1.3] mb-3.5"
//                         style={{ color: phaseColor }}
//                     >
//                         {msg.text}
//                     </h2>
//                     <p className="text-sm font-light text-[#8a9a8e] leading-[1.65] mb-10">
//                         {msg.sub}
//                     </p>

//                     <div className="h-[3px] bg-[#e8ede9] rounded-full overflow-hidden mb-7">
//                         <div
//                             className="h-full rounded-full transition-[width] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
//                             style={{ width: `${msg.pct}%`, background: `linear-gradient(90deg, ${phaseColor}, ${phaseColor}88)` }}
//                         />
//                     </div>

//                     <div className="flex justify-center gap-2">
//                         {(["a", "b", "c"] as LoadPhase[]).map((p) => (
//                             <div
//                                 key={p}
//                                 className="w-[7px] h-[7px] rounded-full transition-all duration-300"
//                                 style={{
//                                     background: p === loadPhase ? phaseColor : "#d8dbd5",
//                                     transform: p === loadPhase ? "scale(1.3)" : "scale(1)",
//                                 }}
//                             />
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </PageWrapper>
//     );
// }




"use client";

import { useState, useEffect, Fragment, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowRight,
    ArrowLeft,
    Mail,
    Shield,
    Lock,
    Sparkles,
    Activity,
    Menu,
    X,
    Loader2,
} from "lucide-react";
import { useLiveCounter } from "@/hooks/use-live-counter";
import { logger } from "@/lib/logger";
import { analytics } from "@/lib/analytics/client";
import {
    getProfile,
    saveAssessmentProgress,
    saveAssessmentResult,
} from "@/lib/personalization/profile";
import { fireConversion } from "@/lib/tracking/pixels";
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

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
}

type Step = "intro" | "quiz" | "email" | "analysing";
type LoadPhase = "a" | "b" | "c";

// ── Data ───────────────────────────────────────────────────────────────────────

const questions: Question[] = [
    {
        id: "q1",
        category: "Mood",
        text: "In the past two weeks, how often have you felt down, hopeless, or empty?",
        options: [
            { label: "Rarely or never", value: 0 },
            { label: "A few days", value: 1 },
            { label: "More than half the days", value: 2 },
            { label: "Almost every day", value: 3 },
        ],
    },
    {
        id: "q2",
        category: "Anxiety",
        text: "How often have you felt nervous, anxious, or on edge?",
        options: [
            { label: "Rarely or never", value: 0 },
            { label: "A few days", value: 1 },
            { label: "More than half the days", value: 2 },
            { label: "Almost every day", value: 3 },
        ],
    },
    {
        id: "q3",
        category: "Energy",
        text: "How would you describe your energy levels lately?",
        options: [
            { label: "Good — I feel energised most days", value: 0 },
            { label: "Okay — some low patches but manageable", value: 1 },
            { label: "Low — I often struggle to get going", value: 2 },
            { label: "Very low — it's affecting my daily life", value: 3 },
        ],
    },
    {
        id: "q4",
        category: "Sleep",
        text: "How has your sleep been recently?",
        options: [
            { label: "Good — mostly restful nights", value: 0 },
            { label: "Occasionally disrupted", value: 1 },
            { label: "Often restless or hard to fall asleep", value: 2 },
            { label: "Poor — it's affecting me significantly", value: 3 },
        ],
    },
    {
        id: "q5",
        category: "Relationships",
        text: "How are your relationships with people close to you?",
        options: [
            { label: "Mostly good and connected", value: 0 },
            { label: "Some tension or distance", value: 1 },
            { label: "Strained — communication has been hard", value: 2 },
            { label: "Isolated or in serious conflict", value: 3 },
        ],
    },
    {
        id: "q6",
        category: "Stress",
        text: "How well are you coping with everyday pressure?",
        options: [
            { label: "Well — stress feels manageable", value: 0 },
            { label: "Sometimes overwhelmed, but coping", value: 1 },
            { label: "Often overwhelmed", value: 2 },
            { label: "Constantly overwhelmed — hard to function", value: 3 },
        ],
    },
    {
        id: "q7",
        category: "Self-worth",
        text: "How do you feel about yourself day to day?",
        options: [
            { label: "Generally positive and confident", value: 0 },
            { label: "Somewhat self-critical at times", value: 1 },
            { label: "Often feel inadequate or worthless", value: 2 },
            { label: "Struggling with very low self-worth", value: 3 },
        ],
    },
    {
        id: "q8",
        category: "Support",
        text: "What would you most like from speaking with a therapist?",
        options: [
            { label: "Personal growth and resilience", value: 0 },
            { label: "Help with a specific challenge", value: 1 },
            { label: "Support through a difficult period", value: 2 },
            { label: "Urgent help — I'm really struggling", value: 3 },
        ],
    },
];

// ── Nav ────────────────────────────────────────────────────────────────────────

function AssessmentNav() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);


    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled
                    ? "bg-[rgba(250,249,246,0.92)] backdrop-blur-[18px] shadow-[0_1px_0_rgba(28,40,36,0.08)]"
                    : "bg-transparent"
                    }`}
                aria-label="Site navigation"
            >
                <div className="max-w-[1100px] mx-auto px-6 h-[68px] flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2.5 no-underline"
                        aria-label="Mentel — home"
                    >
                        <div className="w-8 h-8 rounded-[10px] flex items-center justify-center overflow-hidden">
                            <Image
                                src="/logo-assessment.png"
                                alt="Mentel logo"
                                width={32}
                                height={32}
                                className="object-cover"
                            />
                        </div>
                        <span className="font-['Cormorant_Garamond',Georgia,serif] text-[22px] font-semibold tracking-[-0.02em] text-[#1c2820]">
                            Mentel
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        {["About", "Services", "Articles", "Company"].map((item) => (
                            <Link
                                key={item}
                                href={`/${item === "Company" ? "eap" : item.toLowerCase()}`}
                                className="text-sm font-[450] text-[#4a5a52] no-underline tracking-[0.01em] hover:text-[#1c2820] transition-colors"
                            >
                                {item}
                            </Link>
                        ))}
                        <Link
                            href="/#book"
                            className="text-[13px] font-medium text-white bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] px-5 py-2.5 rounded-full no-underline tracking-[0.01em] shadow-[0_2px_12px_rgba(30,107,107,0.25)] hover:opacity-90 transition-opacity"
                        >
                            Book a session
                        </Link>
                    </div>

                    <button
                        type="button"
                        onClick={() => setMenuOpen((v) => !v)}
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                        className="md:hidden bg-transparent border-0 cursor-pointer p-2 text-[#1c2820]"
                    >
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>

                {menuOpen && (
                    <div className="md:hidden bg-[rgba(250,249,246,0.98)] backdrop-blur-xl border-t border-[rgba(28,40,36,0.08)] px-6 pt-4 pb-6">
                        {["About", "Services", "Therapists", "Articles"].map((item) => (
                            <Link
                                key={item}
                                href={`/${item.toLowerCase()}`}
                                className="block py-3 text-base text-[#1c2820] no-underline border-b border-[rgba(28,40,36,0.06)]"
                                onClick={() => setMenuOpen(false)}
                            >
                                {item}
                            </Link>
                        ))}
                        <Link
                            href="/#book"
                            className="block mt-4 text-center text-sm font-medium text-white bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] py-3.5 px-5 rounded-full no-underline"
                            onClick={() => setMenuOpen(false)}
                        >
                            Book a session
                        </Link>
                    </div>
                )}
            </nav>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,450;9..40,500;9..40,600&display=swap');

        *, *::before, *::after { box-sizing: border-box; }
        body { font-family: 'DM Sans', -apple-system, sans-serif; background: #faf9f6; -webkit-font-smoothing: antialiased; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }

        .fade-up { animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .fade-in { animation: fadeIn 0.45s ease both; }
        .fade-up-delay-1 { animation-delay: 0.08s; }
        .fade-up-delay-2 { animation-delay: 0.16s; }
        .fade-up-delay-3 { animation-delay: 0.24s; }

        .option-btn { transition: all 0.2s cubic-bezier(0.22,1,0.36,1); }
        .option-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(45,122,90,0.12) !important; border-color: #2d7a5a !important; }
        .option-btn:active:not(:disabled) { transform: scale(0.99); }

        .cta-btn { transition: all 0.22s cubic-bezier(0.22,1,0.36,1); }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(30,107,107,0.38) !important; }
        .cta-btn:active { transform: translateY(0); }

        .form-input {
          width: 100%; padding: 14px 16px;
          border: 1.5px solid #d8dbd5; border-radius: 12px;
          font-family: 'DM Sans', sans-serif; font-size: 15px;
          color: #1c2820; background: #fdfcfa;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
          outline: none; -webkit-appearance: none;
        }
        .form-input:focus { border-color: #2d7a5a; box-shadow: 0 0 0 4px rgba(45,122,90,0.1); background: white; }
        .form-input::placeholder { color: #b0bab4; }
        .form-input.error { border-color: #c0392b; box-shadow: 0 0 0 4px rgba(192,57,43,0.08); }

        .testimonial-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .testimonial-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(28,40,36,0.09) !important; }
      `}</style>
        </>
    );
}

// ── PageWrapper ────────────────────────────────────────────────────────────────

export function PageWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#faf9f6] font-['DM_Sans',sans-serif]">
            <AssessmentNav />
            {children}
        </div>
    );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function AssessmentPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("intro");
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [transitioning, setTransitioning] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [loadPhase, setLoadPhase] = useState<LoadPhase>("a");
    const transitioningRef = useRef(false);

    const totalScore = Object.values(answers).reduce((a, v) => a + v, 0);
    const progress = ((current + 1) / questions.length) * 100;
    const assessedCount = useLiveCounter(2400, "2026-06-01", 2000);
    const CAL_EVENT_TYPE_ID: number = 6101260

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setSelectedOption(null);
    }, [current, step]);

    useEffect(() => {
        analytics.track("ASSESSMENT_PAGE_VIEWED");
    }, []);

    // Personalization: resume a returning visitor exactly where they left
    // off. If they already have a finished result, skip straight to it
    // instead of making them retake the quiz. Otherwise, if they were
    // partway through, restore their answers and question index.
    useEffect(() => {
        const profile = getProfile();
        if (profile.assessmentResult) {
            router.replace("/assessment/result");
            return;
        }
        if (profile.assessment && profile.assessment.step !== "done" && Object.keys(profile.assessment.answers).length > 0) {
            setAnswers(profile.assessment.answers);
            setCurrent(profile.assessment.current);
            setStep(profile.assessment.step === "email" ? "email" : "quiz");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (current === 1) {
            analytics.track("ASSESSMENT_STARTED");
        }
    }, [current]);
    // Drives the "analysing your results" sequence shown right after the
    // email form is submitted. Runs entirely on this page so there's only
    // ONE continuous loading experience, then we navigate straight into a
    // result page that can render immediately (no second spinner there).
    useEffect(() => {
        if (step !== "analysing") return;

        setLoadPhase("a");
        const t1 = setTimeout(() => setLoadPhase("b"), 1300);
        const t2 = setTimeout(() => setLoadPhase("c"), 2600);
        const t3 = setTimeout(() => {
            router.push("/assessment/result");
        }, 3600);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [step, router]);

    const handleAnswerStable = useCallback(
        (value: number): void => {
            if (transitioningRef.current) return;

            setAnswers((prev) => {
                const q = questions[current];
                if (!q) return prev;
                return { ...prev, [q.id]: value };
            });

            setSelectedOption(value);
            transitioningRef.current = true;
            setTransitioning(true);

            setTimeout(() => {
                setCurrent((c) => {
                    const nextCurrent = c < questions.length - 1 ? c + 1 : c;
                    const nextStep: "quiz" | "email" = c < questions.length - 1 ? "quiz" : "email";
                    if (nextStep === "email") setStep("email");

                    // Personalize: remember exactly which question they're on so a
                    // returning visitor resumes here instead of starting over.
                    setAnswers((latestAnswers) => {
                        saveAssessmentProgress({
                            current: nextCurrent,
                            answers: latestAnswers,
                            step: nextStep,
                        });
                        return latestAnswers;
                    });

                    return nextCurrent;
                });
                transitioningRef.current = false;
                setTransitioning(false);
                setSelectedOption(null);
            }, 380);
        },
        [current]
    );

    const handleBack = useCallback((): void => {
        if (transitioningRef.current) return;
        setCurrent((c) => {
            if (c > 0) return c - 1;
            setStep("intro");
            return c;
        });
    }, []);

    const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        setErrors((p) => ({ ...p, name: undefined }));
    }, []);

    const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setErrors((p) => ({ ...p, email: undefined }));
    }, []);

    const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(e.target.value);
        setErrors((p) => ({ ...p, phone: undefined }));
    }, []);

    const validate = useCallback((): boolean => {
        const e: FormErrors = {};
        if (!name.trim() || name.trim().length < 2) e.name = "Please enter your name.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Please enter a valid email.";
        if (phone.replace(/\D/g, "").length < 7) e.phone = "Please enter a valid phone number.";
        setErrors(e);
        return !Object.keys(e).length;
    }, [name, email, phone]);

    const handleEmailSubmit = useCallback(
        async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
            e.preventDefault();
            if (!validate()) return;
            setSubmitting(true);

            try {
                await fetch("/api/assessment", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name,
                        email,
                        phone,
                        score: totalScore,
                        answers,
                    }),
                });
            } catch { }

            // Persist result data to sessionStorage so ResultPage can read it
            if (typeof window !== "undefined") {
                sessionStorage.setItem(
                    "mentel_assessment_result",
                    JSON.stringify({ name, email, score: totalScore, answers, CAL_EVENT_TYPE_ID })
                );
            }

            // Also persist to the first-party personalization profile (cookie),
            // which — unlike sessionStorage — survives across days/tabs, so a
            // returning visitor sees their result immediately instead of being
            // asked to retake the assessment.
            const band =
                totalScore <= 6 ? "Thriving" : totalScore <= 12 ? "Mild Concern" : totalScore <= 18 ? "Moderate" : "High Concern";
            saveAssessmentResult({ name, score: totalScore, band });
            fireConversion("Lead", { contentName: "assessment_completed" });

            // Don't reset submitting here — we move straight into the
            // "analysing" step, which takes over the screen entirely.
            // This avoids the old flicker (disabled → briefly enabled →
            // disabled again) since the button is simply replaced, not
            // re-rendered in an intermediate state.
            setStep("analysing");
        },
        [validate, name, email, phone, totalScore, answers, router]
    );

    // ── INTRO ──────────────────────────────────────────────────────────────────

    if (step === "intro") {

        return (
            <PageWrapper>
                <section className="pt-24 pb-20 px-6">
                    <div className="max-w-[680px] mx-auto fade-up">

                        {/* Social proof pill */}
                        <div className="inline-flex items-center gap-2.5 bg-[rgba(45,122,90,0.07)] border border-[rgba(45,122,90,0.18)] rounded-full pl-2 pr-4 py-1.5 mb-9">
                            <div className="flex">
                                {[
                                    "linear-gradient(135deg,#3d8b8b,#6fb8b8)",
                                    "linear-gradient(135deg,#a97b3d,#d4b87b)",
                                    "linear-gradient(135deg,#4e7a5e,#7ba98b)",
                                    "linear-gradient(135deg,#5a6fa8,#8fa4d6)",
                                ].map((bg, i) => (
                                    <div
                                        key={i}
                                        style={{ background: bg, marginLeft: i === 0 ? 0 : -8, zIndex: 4 - i }}
                                        className="w-8 h-8 rounded-full border-2 border-[#faf9f6] relative flex items-center justify-center text-[10px] font-semibold text-white"
                                    >
                                        {["A", "E", "K", "C"][i]}
                                    </div>
                                ))}
                            </div>
                            <span className="text-[13px] font-medium text-[#2d7a5a]">
                                {assessedCount.toLocaleString()}+ people assessed this month
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(48px,8.5vw,76px)] font-light leading-[1.06] tracking-[-0.03em] text-[#1c2820] mb-6 fade-up">
                            How are you{" "}
                            <em className="text-[#2d7a5a] italic">really</em>{" "}
                            doing?
                        </h1>

                        <p className="text-[clamp(16px,2.8vw,18px)] font-light leading-[1.75] text-[#5a6b5e] max-w-[500px] mb-[52px] fade-up fade-up-delay-1">
                            Take our confidential 1-minute check-in designed by licensed professionals and get instant clarity on your mental wellness.
                        </p>

                        {/* Stats row */}
                        <div className="flex items-center gap-7 mb-[52px] flex-wrap fade-up fade-up-delay-1">
                            {[
                                { num: `${assessedCount.toLocaleString()}+`, label: "People assessed" },
                                { num: "1 min", label: "Average time" },
                                { num: "97%", label: "Found it helpful" },
                            ].map((stat, i) => (
                                <Fragment key={stat.num}>
                                    <div className="text-left">
                                        <div className="font-['Cormorant_Garamond',Georgia,serif] text-[28px] font-medium text-[#1c2820] leading-none">
                                            {stat.num}
                                        </div>
                                        <div className="text-[11px] text-[#5a6b5e] mt-1 tracking-[0.06em] uppercase font-medium">
                                            {stat.label}
                                        </div>
                                    </div>
                                    {i < 2 && <div className="w-px h-8 bg-[rgba(28,40,36,0.1)]" />}
                                </Fragment>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="fade-up fade-up-delay-3 mb-11">
                            <button
                                type="button"
                                onClick={() => {
                                    setStep("quiz");
                                    (window as any).ttq?.track("Start trial");

                                    // fire and forget (BEST UX)
                                    fetch("/api/events/assessment-started", {
                                        method: "POST",
                                        keepalive: true,
                                    });

                                    analytics.track("ASSESSMENT_CLICKED")
                                }}
                                className="cta-btn inline-flex items-center justify-center gap-2.5 bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] text-white border-0 rounded-full px-10 py-[19px] text-[clamp(14px,4vw,17px)] font-medium font-['DM_Sans',sans-serif] cursor-pointer shadow-[0_6px_28px_rgba(30,107,107,0.32)] tracking-[0.01em]"
                            >
                                <Activity size={17} strokeWidth={3} color="#a8e6cf" />
                                Get My Wellness Score
                                <ArrowRight size={17} strokeWidth={2} className="opacity-55" />
                            </button>
                            <p className="text-[12px] text-[#5a6b5e] mt-4 font-light">
                                Takes 1 minute · No account needed · Completely confidential
                            </p>
                        </div>

                        {/* Trust grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 fade-up fade-up-delay-2">
                            {[
                                { icon: Lock, title: "Confidential", desc: "Your answers are private and never stored anywhere" },
                                { icon: Sparkles, title: "Free", desc: "No hidden costs, no subscription required" },
                                { icon: Shield, title: "NDPR Compliant", desc: "Fully compliant with Nigerian data regulations" },
                            ].map(({ icon: Icon, title, desc }) => (
                                <div
                                    key={title}
                                    className="bg-white border border-[#e4e9e5] rounded-[18px] p-5 flex flex-col gap-2.5 shadow-[0_1px_8px_rgba(28,40,36,0.04)]"
                                >
                                    <div className="w-[38px] h-[38px] rounded-[11px] bg-[rgba(45,122,90,0.08)] flex items-center justify-center">
                                        <Icon size={17} stroke="#2d7a5a" strokeWidth={1.8} />
                                    </div>
                                    <div className="text-sm font-medium text-[#1c2820]">{title}</div>
                                    <div className="text-[12px] font-light text-[#5a6b5e] leading-[1.6]">{desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <div className="bg-white border-t border-b border-[#ebebeb] py-12 px-6">
                    <div className="max-w-[760px] mx-auto">
                        <p className="text-[11px] tracking-[0.12em] uppercase text-[#5a6b5e] font-semibold text-center mb-9">
                            What people say
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            {[
                                { text: "Finally understood what I was feeling — and felt truly seen.", name: "Adaeze O.", tag: "Lagos" },
                                { text: "The assessment was more honest than I expected. In a good way.", name: "Emeka T.", tag: "Abuja" },
                                { text: "The matched therapist was perfect. First session was transformative.", name: "Kemi A.", tag: "Port Harcourt" },
                            ].map((t) => (
                                <div
                                    key={t.name}
                                    className="testimonial-card bg-[#faf9f6] border border-[#e8ede9] rounded-[18px] p-[22px] shadow-[0_2px_8px_rgba(28,40,36,0.04)]"
                                >
                                    <div className="flex gap-0.5 mb-3.5">
                                        {[...Array(5)].map((_, si) => (
                                            <svg key={si} width="12" height="12" viewBox="0 0 12 12" fill="#f0c040">
                                                <path d="M6 1l1.5 3 3.3.5-2.4 2.3.6 3.2L6 8.5l-3 1.5.6-3.2L1.2 4.5l3.3-.5z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-sm font-light leading-[1.72] text-[#3a4a3e] mb-4 italic">
                                        &ldquo;{t.text}&rdquo;
                                    </p>
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c8e6d8] to-[#a8c5b2] flex items-center justify-center text-[12px] font-semibold text-[#1c3a28]">
                                            {t.name[0]}
                                        </div>
                                        <div>
                                            <div className="text-[13px] font-medium text-[#1c2820]">{t.name}</div>
                                            <div className="text-[11px] text-[#a0aba3]">{t.tag}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </PageWrapper>
        );
    }

    // ── QUIZ ───────────────────────────────────────────────────────────────────

    if (step === "quiz") {
        const q = questions[current];
        if (!q) return null;

        const r = 18;
        const circ = 2 * Math.PI * r;
        const filled = circ - circ * (current / questions.length);

        return (
            <PageWrapper>
                <section className="pt-24 pb-20 px-6 min-h-screen">
                    <div className="max-w-[560px] mx-auto fade-up">

                        {/* Progress header */}
                        <div className="mb-[52px]">
                            <div className="flex items-center gap-3.5 mb-5">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    disabled={transitioning}
                                    aria-label="Go back"
                                    className="w-10 h-10 rounded-full border-[1.5px] border-[#dce5df] bg-white cursor-pointer flex items-center justify-center text-[#5a6b5e] flex-shrink-0 transition-all shadow-[0_1px_6px_rgba(28,40,36,0.06)] hover:border-[#2d7a5a] hover:text-[#2d7a5a]"
                                >
                                    <ArrowLeft size={15} strokeWidth={2} />
                                </button>

                                <div className="flex-1 h-[3px] bg-[#e8ede9] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#2d7a5a] to-[#1e6b6b] rounded-full transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>

                                <div className="relative w-11 h-11 flex-shrink-0">
                                    <svg width="44" height="44" viewBox="0 0 44 44">
                                        <circle cx="22" cy="22" r={r} fill="none" strokeWidth="2.5" stroke="rgba(45,122,90,0.12)" />
                                        <circle
                                            cx="22" cy="22" r={r}
                                            fill="none"
                                            strokeWidth="2.5"
                                            stroke="#2d7a5a"
                                            strokeLinecap="round"
                                            strokeDasharray={circ}
                                            strokeDashoffset={filled}
                                            style={{
                                                transform: "rotate(-90deg)",
                                                transformOrigin: "center",
                                                transition: "stroke-dashoffset 0.5s cubic-bezier(0.22,1,0.36,1)",
                                            }}
                                        />
                                    </svg>
                                    <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-[#2d7a5a]">
                                        {current + 1}/{questions.length}
                                    </span>
                                </div>
                            </div>

                            <span className="inline-block bg-[rgba(45,122,90,0.08)] text-[#2d7a5a] text-[11px] font-semibold tracking-[0.1em] uppercase px-3.5 py-[5px] rounded-full">
                                {q.category}
                            </span>
                        </div>

                        <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(28px,5.5vw,38px)] font-light leading-[1.28] text-[#1c2820] tracking-[-0.018em] mb-10">
                            {q.text}
                        </h2>

                        <div className="flex flex-col gap-3">
                            {q.options.map((opt, idx) => {
                                const isSelected =
                                    selectedOption === opt.value || answers[q.id] === opt.value;
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => handleAnswerStable(opt.value)}
                                        disabled={transitioning}
                                        className="option-btn w-full text-left px-5 py-[18px] rounded-2xl border-[1.5px] flex items-center gap-4 font-['DM_Sans',sans-serif]"
                                        style={{
                                            border: isSelected ? "1.5px solid #2d7a5a" : "1.5px solid #e4e9e5",
                                            background: isSelected ? "rgba(45,122,90,0.06)" : "white",
                                            cursor: transitioning ? "default" : "pointer",
                                            boxShadow: isSelected
                                                ? "0 0 0 4px rgba(45,122,90,0.08), 0 2px 12px rgba(45,122,90,0.1)"
                                                : "0 1px 4px rgba(28,40,36,0.04)",
                                        }}
                                    >
                                        <div
                                            className="w-[30px] h-[30px] rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-[220ms]"
                                            style={{
                                                background: isSelected ? "#2d7a5a" : "#f0f4f1",
                                                border: isSelected ? "none" : "1.5px solid #dce5df",
                                            }}
                                        >
                                            {isSelected ? (
                                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                                    <path d="M2.5 6.5l3 3L10.5 3" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            ) : (
                                                <span className="text-[11px] font-bold text-[#a0b0a8]">
                                                    {["A", "B", "C", "D"][idx]}
                                                </span>
                                            )}
                                        </div>
                                        <span
                                            className="text-[15px] leading-[1.5] transition-all duration-200"
                                            style={{
                                                fontWeight: isSelected ? 400 : 300,
                                                color: isSelected ? "#1c2820" : "#3a4a3e",
                                            }}
                                        >
                                            {opt.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <p className="text-center text-[12px] text-[#b0bab4] mt-8 flex items-center justify-center gap-1.5">
                            <Lock size={11} stroke="#b0bab4" strokeWidth={2} />
                            Your answers are private and never shared
                        </p>
                    </div>
                </section>
            </PageWrapper>
        );
    }

    // ── EMAIL CAPTURE ──────────────────────────────────────────────────────────

    if (step === "email") {
        return (
            <PageWrapper>
                <section className="pt-[108px] pb-20 px-6 min-h-screen">
                    <div className="max-w-[460px] mx-auto fade-up">

                        <div className="text-center mb-9">
                            <div
                                className="w-[68px] h-[68px] rounded-[22px] bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] inline-flex items-center justify-center shadow-[0_10px_30px_rgba(30,107,107,0.28)] mb-6"
                                style={{ animation: "float 3s ease-in-out infinite" }}
                            >
                                <Mail size={28} color="white" strokeWidth={1.6} />
                            </div>
                            <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(32px,7vw,46px)] font-light tracking-[-0.025em] text-[#1c2820] leading-[1.12] mb-3.5">
                                Almost there
                            </h2>
                            <p className="text-[15px] font-light text-[#5a6b5e] leading-[1.7] max-w-[340px] mx-auto">
                                Enter your details to see your personalised results and be matched with the right therapist.
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl border border-[#e4e9e5] overflow-hidden shadow-[0_6px_40px_rgba(28,40,36,0.08)]">
                            <div className="h-[3px] bg-gradient-to-r from-[#2d7a5a] via-[#1e6b6b] to-[#5da885]" />

                            <div className="p-8 pt-8">
                                <form onSubmit={handleEmailSubmit} noValidate className="flex flex-col gap-5">

                                    {/* Name */}
                                    <div>
                                        <label
                                            htmlFor="field-name"
                                            className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-[#4a6a56] mb-2"
                                        >
                                            Your Name
                                        </label>
                                        <input
                                            id="field-name"
                                            type="text"
                                            placeholder="First name"
                                            value={name}
                                            autoFocus
                                            autoComplete="name"
                                            onChange={handleNameChange}
                                            className={`form-input${errors.name ? " error" : ""}`}
                                            aria-invalid={!!errors.name}
                                        />
                                        {errors.name && (
                                            <p className="text-[12px] text-[#c0392b] mt-1.5 flex items-center gap-1">
                                                <span>⚠</span> {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label
                                            htmlFor="field-email"
                                            className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-[#4a6a56] mb-2"
                                        >
                                            Email Address
                                        </label>
                                        <input
                                            id="field-email"
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            autoComplete="email"
                                            onChange={handleEmailChange}
                                            className={`form-input${errors.email ? " error" : ""}`}
                                            aria-invalid={!!errors.email}
                                        />
                                        {errors.email && (
                                            <p className="text-[12px] text-[#c0392b] mt-1.5 flex items-center gap-1">
                                                <span>⚠</span> {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label
                                            htmlFor="field-phone"
                                            className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-[#4a6a56] mb-2"
                                        >
                                            Phone Number
                                        </label>
                                        <input
                                            id="field-phone"
                                            type="tel"
                                            placeholder="+234 000 000 0000"
                                            value={phone}
                                            autoComplete="tel"
                                            onChange={handlePhoneChange}
                                            className={`form-input${errors.phone ? " error" : ""}`}
                                            aria-invalid={!!errors.phone}
                                        />
                                        {errors.phone && (
                                            <p className="text-[12px] text-[#c0392b] mt-1.5 flex items-center gap-1">
                                                <span>⚠</span> {errors.phone}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="cta-btn w-full py-[17px] px-7 bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] text-white border-0 rounded-full text-[15px] font-medium font-['DM_Sans',sans-serif] flex items-center justify-center gap-2 mt-1 shadow-[0_4px_22px_rgba(30,107,107,0.3)]"
                                        style={{
                                            cursor: submitting ? "not-allowed" : "pointer",
                                            opacity: submitting ? 0.7 : 1,
                                        }}
                                    >
                                        {submitting && (
                                            <Loader2 size={15} strokeWidth={2.5} className="animate-spin" />
                                        )}
                                        {submitting ? "Saving your results…" : "See My Results"}
                                        {!submitting && <ArrowRight size={15} strokeWidth={2} />}
                                    </button>
                                </form>

                                <div className="flex items-center justify-center gap-1.5 mt-5">
                                    <Shield size={12} stroke="#2d7a5a" strokeWidth={1.8} />
                                    <p className="text-[12px] text-[#a0aba3] font-light">We never share your data · Unsubscribe any time</p>
                                </div>
                            </div>
                        </div>

                        <p className="text-center text-[12px] text-[#a0aba3] mt-4.5">
                            By continuing you agree to our{" "}
                            <Link href="/privacy" className="text-[#2d7a5a] underline underline-offset-[3px]">
                                Privacy Policy
                            </Link>
                        </p>
                    </div>
                </section>
            </PageWrapper>
        );
    }

    // ── ANALYSING (loading sequence run here, then we navigate to the result page) ──

    const isHighScore = totalScore > 18;
    const phaseColor = isHighScore && loadPhase === "c" ? "#a33030" : "#05673e";
    const phaseCopy: Record<LoadPhase, { text: string; sub: string; pct: number }> = {
        a: {
            text: "Analysing your 8 responses…",
            sub: "Cross-referencing mood, stress, sleep and relational patterns",
            pct: 35,
        },
        b: {
            text: `Comparing against ${assessedCount.toLocaleString()}+ profiles…`,
            sub: "Identifying your specific pattern type",
            pct: 70,
        },
        c: {
            text: isHighScore ? "Elevated threshold detected." : "Pattern identified.",
            sub: isHighScore ? "Your results require careful review" : "Your personalised profile is ready",
            pct: 95,
        },
    };
    const msg = phaseCopy[loadPhase];

    return (
        <PageWrapper>
            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="text-center max-w-[380px] fade-in">
                    <div
                        className="w-16 h-16 rounded-full mx-auto mb-9"
                        style={{
                            border: `3px solid ${phaseColor}20`,
                            borderTopColor: phaseColor,
                            animation: "spin 0.85s linear infinite",
                        }}
                    />
                    <h2
                        className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(22px,5vw,30px)] font-light leading-[1.3] mb-3.5"
                        style={{ color: phaseColor }}
                    >
                        {msg.text}
                    </h2>
                    <p className="text-sm font-light text-[#8a9a8e] leading-[1.65] mb-10">
                        {msg.sub}
                    </p>

                    <div className="h-[3px] bg-[#e8ede9] rounded-full overflow-hidden mb-7">
                        <div
                            className="h-full rounded-full transition-[width] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                            style={{ width: `${msg.pct}%`, background: `linear-gradient(90deg, ${phaseColor}, ${phaseColor}88)` }}
                        />
                    </div>

                    <div className="flex justify-center gap-2">
                        {(["a", "b", "c"] as LoadPhase[]).map((p) => (
                            <div
                                key={p}
                                className="w-[7px] h-[7px] rounded-full transition-all duration-300"
                                style={{
                                    background: p === loadPhase ? phaseColor : "#d8dbd5",
                                    transform: p === loadPhase ? "scale(1.3)" : "scale(1)",
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}