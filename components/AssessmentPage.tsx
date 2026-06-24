


// "use client";

// import { useState, useEffect, Fragment, useRef, useCallback } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import {
//     ArrowRight,
//     ArrowLeft,
//     CheckCircle,
//     Mail,
//     Shield,
//     Lock,
//     Sparkles,
//     AlertTriangle,
//     Menu,
//     Activity,
//     X,
//     type LucideIcon,
// } from "lucide-react";

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

// interface Result {
//     band: string;
//     gradient: string;
//     headline: string;
//     summary: string;
//     cta: string;
// }

// interface FormErrors {
//     name?: string;
//     email?: string;
//     phone?: string;
// }

// type Step = "intro" | "quiz" | "email" | "result";
// type LoadPhase = "a" | "b" | "c" | "done";

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

// // ── Helpers ────────────────────────────────────────────────────────────────────

// function getResult(score: number): Result {
//     if (score <= 6) {
//         return {
//             band: "Thriving",
//             gradient: "linear-gradient(135deg, #1a3a2e 0%, #234d3d 100%)",
//             headline: "You're in a good place",
//             summary:
//                 "Your responses suggest you're managing well overall. Many people reach out proactively to build resilience, develop self-awareness, or navigate life transitions — therapy can be valuable even when you're not in crisis.",
//             cta: "Chat us on WhatsApp",
//         };
//     }
//     if (score <= 12) {
//         return {
//             band: "Mild Concern",
//             gradient: "linear-gradient(135deg, #0f2d2d 0%, #1a4040 100%)",
//             headline: "Some areas could use support",
//             summary:
//                 "Your responses suggest you're experiencing some difficulties worth exploring. A therapist can help you build practical tools and understand patterns before they become harder to manage.",
//             cta: "Chat us on WhatsApp",
//         };
//     }
//     if (score <= 18) {
//         return {
//             band: "Moderate",
//             gradient: "linear-gradient(135deg, #1c2e3d 0%, #243a4d 100%)",
//             headline: "You deserve real support",
//             summary:
//                 "Your responses suggest you're going through a genuinely difficult time. You're not alone — what you're feeling is valid, and speaking with a licensed therapist can make a significant difference.",
//             cta: "Chat us on WhatsApp",
//         };
//     }
//     return {
//         band: "High Concern",
//         gradient: "linear-gradient(135deg, #3a0f12 0%, #4d1519 100%)",
//         headline: "Please reach out — you matter",
//         summary:
//             "Your responses suggest you're struggling significantly right now. We strongly encourage you to speak with a professional as soon as possible. Our therapists are here for you, without judgment.",
//         cta: "Chat us on WhatsApp",
//     };
// }

// interface BandIntel {
//     typeName: string;
//     percentile: string;
//     accentColor: string;
//     accentLight: string;
//     hook: string;
//     cliffhanger: string;
//     lockedLabel: string;
//     lockedTeaser: string;
//     tip: string;
//     tipLabel: string;
//     urgency: boolean;
// }

// function getBandIntel(score: number): BandIntel {
//     if (score <= 6)
//         return {
//             typeName: "Latent Drift Pattern",
//             percentile: "Top 12% of stable individuals in our network",
//             accentColor: "#2d7a5a",
//             accentLight: "rgba(45,122,90,0.08)",
//             hook: "You appear stable — but stable and thriving are not the same thing.",
//             cliffhanger:
//                 "Your data shows one specific low-grade pattern that quietly drains mental energy in high-functioning people. It rarely feels like a problem — until it becomes one. Most people only recognise it in hindsight.",
//             lockedLabel: "Your Latent Drift Profile + 6-Month Forecast",
//             lockedTeaser:
//                 "We've identified the one silent habit in your routine keeping your baseline lower than it needs to be. Your full profile names it — and shows you the 3-step correction.",
//             tip: "Start a 5-minute evening wind-down — no screens, just one honest question: 'What did I avoid feeling today?' People in your band who do this consistently report a measurable shift in clarity within 2 weeks.",
//             tipLabel: "One thing worth trying this week",
//             urgency: false,
//         };
//     if (score <= 12)
//         return {
//             typeName: "Cortisol Stall Pattern",
//             percentile: "Top 28% of high-stress individuals we've assessed",
//             accentColor: "#1e6b6b",
//             accentLight: "rgba(30,107,107,0.08)",
//             hook: "Your results suggest a Type 2 Cortisol Stall — not burnout, but the stage just before it.",
//             cliffhanger:
//                 "This isn't just tiredness. There's a specific neurological pattern in your responses that affects decision-making and your capacity to feel motivated — even when you're technically resting. Most people try to fix this with more rest. For this pattern, rest alone makes the fog worse.",
//             lockedLabel: "Your 3 Daily Triggers + Reverse-Reset Protocol",
//             lockedTeaser:
//                 "We've identified 3 specific habits in your routine that are actively reinforcing this pattern. Your full profile names each one — and shows the sequence to interrupt them.",
//             tip: "When mental fog hits, try the 4-7-8 breath: inhale 4 counts, hold 7, exhale 8. It directly activates your parasympathetic system and interrupts the cortisol loop within minutes — not hours.",
//             tipLabel: "One thing worth trying this week",
//             urgency: false,
//         };
//     if (score <= 18)
//         return {
//             typeName: "Functional Freeze Pattern",
//             percentile: "Top 41% of moderate-severity cases we see monthly",
//             accentColor: "#2d4a6e",
//             accentLight: "rgba(45,74,110,0.08)",
//             hook: "To the outside world you're still functioning. Internally, something has quietly shifted.",
//             cliffhanger:
//                 "Your data shows what we call a Functional Freeze — where the gap between how you appear and how you actually feel has been widening for some time. There is one specific energy leak driving this. No amount of rest, holidays, or willpower closes it without addressing the root.",
//             lockedLabel: "Your Energy Leak Report + 30-Day Recovery Protocol",
//             lockedTeaser:
//                 "We've pinpointed the single biggest drain in your mental energy based on your answers. Your full profile names it — and gives you the 30-day protocol our therapists use to close it.",
//             tip: "When everything feels heavy: name 5 things you can see, 4 you can touch, 3 you can hear. This grounding technique interrupts a mental spiral within 60 seconds — not by solving the problem, but by returning you to the present.",
//             tipLabel: "One thing worth trying this week",
//             urgency: false,
//         };
//     return {
//         typeName: "Critical Threshold Pattern",
//         percentile: "Top 15% of high-distress cases — this needs attention",
//         accentColor: "#a33030",
//         accentLight: "rgba(163,48,48,0.07)",
//         hook: "What you're experiencing is real — and it's unlikely to resolve without the right support.",
//         cliffhanger:
//             "Your responses place you in what we call a Critical Threshold state. People at this stage describe feeling like they're disappearing behind a functional exterior. Pushing through alone doesn't work — not because of weakness, but because of how the nervous system responds to sustained high-stress load.",
//         lockedLabel: "Your Personal Crisis-to-Clarity Roadmap",
//         lockedTeaser:
//             "A licensed Mentel therapist has been flagged to review your profile directly. Your full report includes the first 3 steps specifically for your pattern — and a same-week session option.",
//         tip: "Tell one person how you're actually feeling today — not the edited version. You don't need the right words. Just letting someone in creates a neurological shift that changes the trajectory of the day.",
//         tipLabel: "One thing to do today — not tomorrow",
//         urgency: true,
//     };
// }

// // ── Nav ────────────────────────────────────────────────────────────────────────

// function AssessmentNav({ step }: { step: Step }) {
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
//                 style={{
//                     position: "fixed",
//                     top: 0,
//                     left: 0,
//                     right: 0,
//                     zIndex: 100,
//                     transition: "background 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease",
//                     background: scrolled ? "rgba(250,249,246,0.92)" : "transparent",
//                     backdropFilter: scrolled ? "blur(18px) saturate(1.6)" : "none",
//                     WebkitBackdropFilter: scrolled ? "blur(18px) saturate(1.6)" : "none",
//                     boxShadow: scrolled ? "0 1px 0 rgba(28,40,36,0.08)" : "none",
//                 }}
//                 aria-label="Site navigation"
//             >
//                 <div
//                     style={{
//                         maxWidth: 1100,
//                         margin: "0 auto",
//                         padding: "0 24px",
//                         height: 68,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                     }}
//                 >
//                     <Link
//                         href="/"
//                         style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
//                         aria-label="Mentel — home"
//                     >
//                         <div
//                             style={{
//                                 width: 32,
//                                 height: 32,
//                                 borderRadius: 10,
//                                 // background: "linear-gradient(135deg, #2d7a5a, #1e6b6b)",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 overflow: "hidden",
//                             }}
//                         >
//                             <Image src="/logo-assessment.png" alt="Mentel logo" width={32} height={32} style={{ objectFit: "cover" }} />
//                         </div>
//                         <span
//                             style={{
//                                 fontFamily: "'Cormorant Garamond', Georgia, serif",
//                                 fontSize: 22,
//                                 fontWeight: 600,
//                                 letterSpacing: "-0.02em",
//                                 color: "#1c2820",
//                             }}
//                         >
//                             Mentel
//                         </span>
//                     </Link>

//                     <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="desktop-nav">
//                         {["About", "Services", "Articles", "Company"].map((item) => (
//                             <Link
//                                 key={item}
//                                 href={`/${item === "Company" ? "eap" : item.toLowerCase()}`}
//                                 style={{
//                                     fontSize: 14,
//                                     fontWeight: 450,
//                                     color: "#4a5a52",
//                                     textDecoration: "none",
//                                     letterSpacing: "0.01em",
//                                     transition: "color 0.15s",
//                                 }}
//                             >
//                                 {item}
//                             </Link>
//                         ))}
//                         <Link
//                             href="/#book"
//                             style={{
//                                 fontSize: 13,
//                                 fontWeight: 500,
//                                 color: "white",
//                                 background: "linear-gradient(135deg, #2d7a5a, #1e6b6b)",
//                                 padding: "9px 20px",
//                                 borderRadius: 99,
//                                 textDecoration: "none",
//                                 letterSpacing: "0.01em",
//                                 boxShadow: "0 2px 12px rgba(30,107,107,0.25)",
//                                 transition: "opacity 0.15s",
//                             }}
//                         >
//                             Book a session
//                         </Link>
//                     </div>

//                     <button
//                         type="button"
//                         onClick={() => setMenuOpen((v) => !v)}
//                         aria-label={menuOpen ? "Close menu" : "Open menu"}
//                         aria-expanded={menuOpen}
//                         style={{
//                             display: "none",
//                             background: "none",
//                             border: "none",
//                             cursor: "pointer",
//                             padding: 8,
//                             color: "#1c2820",
//                         }}
//                         className="mobile-menu-btn"
//                     >
//                         {menuOpen ? <X size={22} /> : <Menu size={22} />}
//                     </button>
//                 </div>

//                 {menuOpen && (
//                     <div
//                         style={{
//                             background: "rgba(250,249,246,0.98)",
//                             backdropFilter: "blur(20px)",
//                             borderTop: "1px solid rgba(28,40,36,0.08)",
//                             padding: "16px 24px 24px",
//                         }}
//                     >
//                         {["About", "Services", "Therapists", "Articles"].map((item) => (
//                             <Link
//                                 key={item}
//                                 href={`/${item.toLowerCase()}`}
//                                 style={{
//                                     display: "block",
//                                     padding: "12px 0",
//                                     fontSize: 16,
//                                     color: "#1c2820",
//                                     textDecoration: "none",
//                                     borderBottom: "1px solid rgba(28,40,36,0.06)",
//                                 }}
//                                 onClick={() => setMenuOpen(false)}
//                             >
//                                 {item}
//                             </Link>
//                         ))}
//                         <Link
//                             href="/#book"
//                             style={{
//                                 display: "block",
//                                 marginTop: 16,
//                                 textAlign: "center",
//                                 fontSize: 14,
//                                 fontWeight: 500,
//                                 color: "white",
//                                 background: "linear-gradient(135deg, #2d7a5a, #1e6b6b)",
//                                 padding: "13px 20px",
//                                 borderRadius: 99,
//                                 textDecoration: "none",
//                             }}
//                             onClick={() => setMenuOpen(false)}
//                         >
//                             Book a session
//                         </Link>
//                     </div>
//                 )}
//             </nav>

//             <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,450;9..40,500;9..40,600&display=swap');

//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//         body {
//           font-family: 'DM Sans', -apple-system, sans-serif;
//           background: #faf9f6;
//           color: #1c2820;
//           -webkit-font-smoothing: antialiased;
//         }

//         .cormorant {
//           font-family: 'Cormorant Garamond', 'EB Garamond', Georgia, serif;
//         }

//         @media (max-width: 768px) {
//           .desktop-nav { display: none !important; }
//           .mobile-menu-btn { display: flex !important; }
//         }

//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }
//         @keyframes float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-6px); }
//         }
//         @keyframes shimmer {
//           0% { background-position: -400px 0; }
//           100% { background-position: 400px 0; }
//         }

//         .fade-up {
//           animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
//         }
//         .fade-in {
//           animation: fadeIn 0.45s ease both;
//         }
//         .fade-up-delay-1 { animation-delay: 0.08s; }
//         .fade-up-delay-2 { animation-delay: 0.16s; }
//         .fade-up-delay-3 { animation-delay: 0.24s; }

//         .option-btn {
//           transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
//           position: relative;
//         }
//         .option-btn:hover:not(:disabled) {
//           transform: translateY(-2px);
//           box-shadow: 0 6px 20px rgba(45,122,90,0.12) !important;
//           border-color: #2d7a5a !important;
//         }
//         .option-btn:active:not(:disabled) {
//           transform: scale(0.99);
//         }

//         .cta-btn {
//           transition: all 0.22s cubic-bezier(0.22, 1, 0.36, 1);
//         }
//         .cta-btn:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 10px 32px rgba(30,107,107,0.38) !important;
//         }
//         .cta-btn:active {
//           transform: translateY(0);
//         }

//         .trust-grid {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 12px;
//         }
//         @media (max-width: 500px) {
//           .trust-grid { grid-template-columns: 1fr; gap: 10px; }
//         }

//         .form-field input {
//           width: 100%;
//           padding: 14px 16px;
//           border: 1.5px solid #d8dbd5;
//           border-radius: 12px;
//           font-family: 'DM Sans', sans-serif;
//           font-size: 15px;
//           color: #1c2820;
//           background: #fdfcfa;
//           transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
//           outline: none;
//           -webkit-appearance: none;
//         }
//         .form-field input:focus {
//           border-color: #2d7a5a;
//           box-shadow: 0 0 0 4px rgba(45,122,90,0.1);
//           background: white;
//         }
//         .form-field input::placeholder {
//           color: #b0bab4;
//         }
//         .form-field input.error {
//           border-color: #c0392b;
//           box-shadow: 0 0 0 4px rgba(192,57,43,0.08);
//         }

//         .locked-blur {
//           filter: blur(5px);
//           user-select: none;
//           pointer-events: none;
//         }

//         .progress-ring-track {
//           stroke: rgba(45,122,90,0.12);
//         }
//         .progress-ring-fill {
//           stroke: #2d7a5a;
//           stroke-linecap: round;
//           transition: stroke-dashoffset 0.5s cubic-bezier(0.22, 1, 0.36, 1);
//           transform-origin: center;
//           transform: rotate(-90deg);
//         }

//         .testimonial-card {
//           transition: transform 0.2s ease, box-shadow 0.2s ease;
//         }
//         .testimonial-card:hover {
//           transform: translateY(-3px);
//           box-shadow: 0 8px 24px rgba(28,40,36,0.09) !important;
//         }
//       `}</style>
//         </>
//     );
// }
// // ─── PageWrapper extracted OUTSIDE AssessmentPage ────────────────────────────
// // This is the root cause fix. When PageWrapper was defined inside the component,
// // React treated it as a new component type on every render, causing full unmounts:
// //   - answer clicks → state update → PageWrapper recreated → inputs lost focus
// //   - form keystrokes → state update → PageWrapper recreated → input blurred
// // Now it's stable across renders.

// function PageWrapper({ children, step }: { children: React.ReactNode; step: Step }) {
//     return (
//         <div style={{ minHeight: "100vh", background: "#faf9f6", fontFamily: "'DM Sans', sans-serif" }}>
//             <AssessmentNav step={step} />
//             {children}
//         </div>
//     );
// }

// export default function AssessmentPage() {
//     const [step, setStep] = useState<Step>("intro");
//     const [current, setCurrent] = useState(0);
//     const [answers, setAnswers] = useState<Record<string, number>>({});
//     const [email, setEmail] = useState("");
//     const [phone, setPhone] = useState("");
//     const [name, setName] = useState("");
//     const [submitting, setSubmitting] = useState(false);
//     const [errors, setErrors] = useState<FormErrors>({});
//     const [transitioning, setTransitioning] = useState(false);
//     const [loadPhase, setLoadPhase] = useState<LoadPhase>("a");
//     const [selectedOption, setSelectedOption] = useState<number | null>(null);

//     const totalScore = Object.values(answers).reduce((a, v) => a + v, 0);
//     const result = getResult(totalScore);
//     const intel = getBandIntel(totalScore);
//     const progress = ((current + 1) / questions.length) * 100;

//     useEffect(() => {
//         if (step !== "result") return;
//         setLoadPhase("a");
//         const t1 = setTimeout(() => setLoadPhase("b"), 1800);
//         const t2 = setTimeout(() => setLoadPhase("c"), 3600);
//         const t3 = setTimeout(() => setLoadPhase("done"), 5400);
//         return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
//     }, [step]);

//     useEffect(() => {
//         window.scrollTo({ top: 0, behavior: "smooth" });
//         setSelectedOption(null);
//     }, [current, step]);

//     // ── Stable callbacks (useCallback prevents unnecessary child re-renders) ──

//     const handleAnswer = useCallback((value: number): void => {
//         setTransitioning((isTransitioning) => {
//             if (isTransitioning) return isTransitioning;
//             // Run side-effects outside of the setter — but we need the guard above
//             return isTransitioning;
//         });
//         // Re-check transitioning synchronously via a ref to avoid stale closure
//         setTransitioning((prev) => prev); // no-op read trick won't work; use ref below
//     }, []);

//     // Use a ref to track transitioning so the callback isn't stale
//     const transitioningRef = useRef(false);

//     const handleAnswerStable = useCallback((value: number): void => {
//         if (transitioningRef.current) return;

//         setAnswers((prev) => {
//             const q = questions[current]; // `current` captured — but we also need it stable
//             if (!q) return prev;
//             return { ...prev, [q.id]: value };
//         });

//         setSelectedOption(value);
//         transitioningRef.current = true;
//         setTransitioning(true);

//         setTimeout(() => {
//             setCurrent((c) => {
//                 if (c < questions.length - 1) {
//                     return c + 1;
//                 } else {
//                     setStep("email");
//                     return c;
//                 }
//             });
//             transitioningRef.current = false;
//             setTransitioning(false);
//             setSelectedOption(null);
//         }, 380);
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [current]); // current must be a dep so q = questions[current] is correct

//     const handleBack = useCallback((): void => {
//         if (transitioningRef.current) return;
//         setCurrent((c) => {
//             if (c > 0) return c - 1;
//             setStep("intro");
//             return c;
//         });
//     }, []);

//     // Stable individual field setters — defined once, never recreated
//     // Using useCallback with empty deps so the input components never re-mount
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

//     const handleEmailSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
//         e.preventDefault();
//         if (!validate()) return;
//         setSubmitting(true);
//         try {
//             await fetch("/api/assessment", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ name, email, phone, score: totalScore, band: result.band, answers }),
//             });
//         } catch { }
//         setSubmitting(false);
//         setStep("result");
//     }, [validate, name, email, phone, totalScore, result.band, answers]);

//     function buildWhatsAppUrl(score: number): string {
//         const r = getResult(score);
//         const num = "254734527573";
//         const msgs: Record<string, string> = {
//             "High Concern": "I need urgent support and would like to speak with a professional as soon as possible.",
//             "Thriving": "I'm interested in proactive therapy and building resilience.",
//         };
//         const note = msgs[r.band] ?? "I'd like to discuss these results and see how therapy can help me.";
//         return `https://wa.me/${num}?text=${encodeURIComponent(`Hello Mentel, I just completed my Private Wellness Assessment.\nResult: *${r.band}*\n${note}`)}`;
//     }

//     const whatsappUrl = buildWhatsAppUrl(totalScore);


//     function useLiveCounter(baseValue: number, startDate: string, perDay: number) {
//         const calculate = () => {
//             const start = new Date(startDate).getTime();
//             const now = Date.now();
//             const secondsElapsed = (now - start) / 1000;

//             // perDay items per day -> convert to per second
//             const perSecond = perDay / (24 * 60 * 60);

//             // base growth from elapsed seconds
//             const growth = secondsElapsed * perSecond;

//             // small deterministic jitter based on current second, so it's not perfectly linear
//             // but still purely a function of "now" — same input -> same output, always increasing
//             const secondSeed = Math.floor(now / 1000);
//             const jitter = Math.sin(secondSeed * 0.017) * 0.5 + 0.5; // 0-1, oscillates smoothly
//             const jitterAmount = jitter * (perSecond * 30); // small wobble, doesn't dominate growth

//             return Math.floor(baseValue + growth + jitterAmount);
//         };

//         const [count, setCount] = useState(calculate);

//         useEffect(() => {
//             const interval = setInterval(() => {
//                 setCount(calculate()); // add a small random 0-10 to make it feel more dynamic, but still mostly driven by time
//             }, 1000); // recalculate every second — always monotonically non-decreasing

//             return () => clearInterval(interval);
//         }, []);

//         return count;
//     }




//     // Usage
//     const assessedCount = useLiveCounter(2400, "2026-06-01", 2000); // base 2400, started June 1, ~35/day


//     // ── INTRO ──────────────────────────────────────────────────────────────────

//     if (step === "intro") {
//         return (
//             <PageWrapper step={step}>
//                 {/* Hero */}
//                 <section style={{ paddingTop: 96, paddingBottom: 80, paddingLeft: 24, paddingRight: 24 }}>
//                     <div style={{ maxWidth: 680, margin: "0 auto" }} className="fade-up">

//                         {/* Social proof pill */}
//                         <div
//                             style={{
//                                 display: "inline-flex",
//                                 alignItems: "center",
//                                 gap: 10,
//                                 background: "rgba(45,122,90,0.07)",
//                                 border: "1px solid rgba(45,122,90,0.18)",
//                                 borderRadius: 99,
//                                 padding: "7px 16px 7px 8px",
//                                 marginBottom: 36,
//                             }}
//                         >
//                             <div style={{ display: "flex" }}>
//                                 {["linear-gradient(135deg, #3d8b8b, #6fb8b8)", "linear-gradient(135deg, #a97b3d, #d4b87b)", "linear-gradient(135deg, #4e7a5e, #7ba98b)", "linear-gradient(135deg, #5a6fa8, #8fa4d6)"].map((bg, i) => (
//                                     <div
//                                         key={i}
//                                         style={{
//                                             width: 32,
//                                             height: 32,
//                                             borderRadius: "50%",
//                                             background: bg,
//                                             border: "2px solid #faf9f6",
//                                             marginLeft: i === 0 ? 0 : -8,
//                                             zIndex: 4 - i,
//                                             position: "relative",
//                                             display: "flex",
//                                             alignItems: "center",
//                                             justifyContent: "center",
//                                             fontSize: 10,
//                                             fontWeight: 600,
//                                             color: "#fff",
//                                         }}
//                                     >
//                                         {["A", "E", "K", "C"][i]}
//                                     </div>
//                                 ))}
//                             </div>
//                             {/* <span style={{ fontSize: 13, fontWeight: 500, color: "#2d7a5a" }}>
//                                 2,400+ people assessed this month
//                             </span> */}
//                             <span style={{ fontSize: 13, fontWeight: 500, color: "#2d7a5a" }}>
//                                 {assessedCount.toLocaleString()}+ people assessed this month
//                             </span>
//                         </div>

//                         {/* Headline */}
//                         <h1
//                             className="cormorant fade-up"
//                             style={{
//                                 fontSize: "clamp(48px, 8.5vw, 76px)",
//                                 fontWeight: 300,
//                                 lineHeight: 1.06,
//                                 letterSpacing: "-0.03em",
//                                 color: "#1c2820",
//                                 marginBottom: 24,
//                             }}
//                         >


//                             How are you{" "}
//                             <em style={{ color: "#2d7a5a", fontStyle: "italic" }}>really</em>{" "}
//                             doing?
//                         </h1>

//                         <p
//                             className="fade-up fade-up-delay-1"
//                             style={{
//                                 fontSize: "clamp(16px, 2.8vw, 18px)",
//                                 fontWeight: 300,
//                                 lineHeight: 1.75,
//                                 color: "var(--text-secondary)",
//                                 // color: "#5a6b5e",
//                                 maxWidth: 500,
//                                 marginBottom: 52,
//                             }}
//                         >
//                             {/* A confidential 2-minute check-in designed by licensed professionals. */}
//                             {/* A confidential 1-minute check-in designed by licensed professionals. */}
//                             {/* Understand where you are and get matched with the right support. */}
//                             Take our confidential 1-minute check-in designed by licensed professionals and get instant clarity on your mental wellness.
//                         </p>

//                         {/* Stats row */}
//                         <div
//                             className="fade-up fade-up-delay-1"
//                             style={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: 28,
//                                 marginBottom: 52,
//                                 flexWrap: "wrap",
//                             }}
//                         >
//                             {[
//                                 { num: `${assessedCount.toLocaleString()}+`, label: "People assessed" },
//                                 // { num: "2 min", label: "Average time" },
//                                 { num: "1 min", label: "Average time" },
//                                 { num: "97%", label: "Found it helpful" },
//                             ].map((stat, i) => (
//                                 <Fragment key={stat.num}>
//                                     <div style={{ textAlign: "left" }}>
//                                         <div
//                                             className="cormorant"
//                                             style={{ fontSize: 28, fontWeight: 500, color: "#1c2820", lineHeight: 1 }}
//                                         >
//                                             {stat.num}
//                                         </div>
//                                         {/* <div style={{ fontSize: 11, color: "#8a9a8e", marginTop: 4, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 500 }}> */}
//                                         <div style={{ fontSize: 11, color: "#5a6b5e", marginTop: 4, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 500 }}>
//                                             {stat.label}
//                                         </div>
//                                     </div>
//                                     {i < 2 && (
//                                         <div style={{ width: 1, height: 32, background: "rgba(28,40,36,0.1)" }} />
//                                     )}
//                                 </Fragment>
//                             ))}
//                         </div>


//                         {/* CTA */}
//                         <div className="fade-up fade-up-delay-3" style={{ marginBottom: 44 }}>
//                             <button
//                                 type="button"
//                                 onClick={() => { setStep("quiz"); (window as any).ttq?.track("Start trial"); }}
//                                 className="cta-btn"
//                                 style={{
//                                     display: "inline-flex",
//                                     alignItems: "center",
//                                     justifyContent: "center",
//                                     gap: 10,
//                                     background: "linear-gradient(135deg, #2d7a5a 0%, #1e6b6b 100%)",
//                                     color: "white",
//                                     border: "none",
//                                     borderRadius: 99,
//                                     padding: "19px 40px",
//                                     fontSize: "clamp(14px, 4vw, 17px)",
//                                     // fontSize: "clamp(13px, 3vw, 15px)",
//                                     fontWeight: 500,
//                                     fontFamily: "'DM Sans', sans-serif",
//                                     cursor: "pointer",
//                                     boxShadow: "0 6px 28px rgba(30,107,107,0.32)",
//                                     letterSpacing: "0.01em",
//                                 }}
//                             >
//                                 <Activity size={17} strokeWidth={3} color="#a8e6cf" />
//                                 {/* Start free Mental Health Check */}
//                                 Get My Wellness Score
//                                 {/* Start your free 1-Minute Check */}
//                                 <ArrowRight size={17} strokeWidth={2} style={{ opacity: 0.55 }} />
//                             </button>

//                             {/* <p style={{ fontSize: 12, color: "#a0aba3", marginTop: 16, fontWeight: 300 }}> */}
//                             <p style={{ fontSize: 12, color: "#5a6b5e", marginTop: 16, fontWeight: 300 }}>
//                                 Takes 1 minute · No account needed · Completely confidential
//                                 {/* Takes 2 minutes · No account needed · Completely confidential */}
//                             </p>
//                         </div>


//                         {/* Trust grid */}
//                         <div className="trust-grid fade-up fade-up-delay-2" >
//                             {[
//                                 { icon: Lock, title: "Confidential", desc: "Your answers are private and never stored anywhere" },
//                                 { icon: Sparkles, title: "Free", desc: "No hidden costs, no subscription required" },
//                                 { icon: Shield, title: "NDPR Compliant", desc: "Fully compliant with Nigerian data regulations" },
//                             ].map(({ icon: Icon, title, desc }) => (
//                                 <div
//                                     key={title}
//                                     style={{
//                                         background: "white",
//                                         border: "1px solid #e4e9e5",
//                                         borderRadius: 18,
//                                         padding: "20px 18px",
//                                         display: "flex",
//                                         flexDirection: "column",
//                                         gap: 10,
//                                         boxShadow: "0 1px 8px rgba(28,40,36,0.04)",
//                                     }}
//                                 >
//                                     <div
//                                         style={{
//                                             width: 38,
//                                             height: 38,
//                                             borderRadius: 11,
//                                             background: "rgba(45,122,90,0.08)",
//                                             display: "flex",
//                                             alignItems: "center",
//                                             justifyContent: "center",
//                                         }}
//                                     >
//                                         <Icon size={17} stroke="#2d7a5a" strokeWidth={1.8} />
//                                     </div>
//                                     <div style={{ fontSize: 14, fontWeight: 500, color: "#1c2820" }}>{title}</div>
//                                     <div style={{ fontSize: 12, fontWeight: 300, color: "#5a6b5e", lineHeight: 1.6 }}>{desc}</div>
//                                 </div>
//                             ))}
//                         </div>


//                     </div>
//                 </section>

//                 {/* Social proof strip */}
//                 <div
//                     style={{
//                         background: "white",
//                         borderTop: "1px solid #ebebeb",
//                         borderBottom: "1px solid #ebebeb",
//                         padding: "48px 24px",
//                     }}
//                 >
//                     <div style={{ maxWidth: 760, margin: "0 auto" }}>
//                         <p
//                             style={{
//                                 fontSize: 11,
//                                 letterSpacing: "0.12em",
//                                 textTransform: "uppercase",
//                                 color: "#5a6b5e",
//                                 // color: "#b0bab4",
//                                 fontWeight: 600,
//                                 textAlign: "center",
//                                 marginBottom: 36,
//                             }}
//                         >
//                             What people say
//                         </p>
//                         <div
//                             style={{
//                                 display: "grid",
//                                 gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
//                                 gap: 20,
//                             }}
//                         >
//                             {[
//                                 { text: "Finally understood what I was feeling — and felt truly seen.", name: "Adaeze O.", tag: "Lagos" },
//                                 { text: "The assessment was more honest than I expected. In a good way.", name: "Emeka T.", tag: "Abuja" },
//                                 { text: "The matched therapist was perfect. First session was transformative.", name: "Kemi A.", tag: "Port Harcourt" },
//                             ].map((t) => (
//                                 <div
//                                     key={t.name}
//                                     className="testimonial-card"
//                                     style={{
//                                         background: "#faf9f6",
//                                         border: "1px solid #e8ede9",
//                                         borderRadius: 18,
//                                         padding: "22px",
//                                         boxShadow: "0 2px 8px rgba(28,40,36,0.04)",
//                                     }}
//                                 >
//                                     {/* Stars */}
//                                     <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
//                                         {[...Array(5)].map((_, si) => (
//                                             <svg key={si} width="12" height="12" viewBox="0 0 12 12" fill="#f0c040">
//                                                 <path d="M6 1l1.5 3 3.3.5-2.4 2.3.6 3.2L6 8.5l-3 1.5.6-3.2L1.2 4.5l3.3-.5z" />
//                                             </svg>
//                                         ))}
//                                     </div>
//                                     <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.72, color: "#3a4a3e", marginBottom: 16, fontStyle: "italic" }}>
//                                         &ldquo;{t.text}&rdquo;
//                                     </p>
//                                     <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                                         <div
//                                             style={{
//                                                 width: 32,
//                                                 height: 32,
//                                                 borderRadius: "50%",
//                                                 background: "linear-gradient(135deg, #c8e6d8, #a8c5b2)",
//                                                 display: "flex",
//                                                 alignItems: "center",
//                                                 justifyContent: "center",
//                                                 fontSize: 12,
//                                                 fontWeight: 600,
//                                                 color: "#1c3a28",
//                                             }}
//                                         >
//                                             {t.name[0]}
//                                         </div>
//                                         <div>
//                                             <div style={{ fontSize: 13, fontWeight: 500, color: "#1c2820" }}>{t.name}</div>
//                                             <div style={{ fontSize: 11, color: "#a0aba3" }}>{t.tag}</div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </PageWrapper >
//         );
//     }

//     // ── QUIZ ───────────────────────────────────────────────────────────────────

//     if (step === "quiz") {
//         const q = questions[current];
//         if (!q) return null;

//         const r = 18;
//         const circ = 2 * Math.PI * r;
//         const filled = circ - (circ * (current / questions.length));

//         return (
//             <PageWrapper step={step}>
//                 <section style={{ paddingTop: 96, paddingBottom: 80, paddingLeft: 24, paddingRight: 24, minHeight: "100vh" }}>
//                     <div style={{ maxWidth: 560, margin: "0 auto" }} className="fade-up">

//                         {/* Progress header */}
//                         <div style={{ marginBottom: 52 }}>
//                             <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
//                                 <button
//                                     type="button"
//                                     onClick={handleBack}
//                                     disabled={transitioning}
//                                     aria-label="Go back"
//                                     style={{
//                                         width: 40,
//                                         height: 40,
//                                         borderRadius: "50%",
//                                         border: "1.5px solid #dce5df",
//                                         background: "white",
//                                         cursor: "pointer",
//                                         display: "flex",
//                                         alignItems: "center",
//                                         justifyContent: "center",
//                                         color: "#5a6b5e",
//                                         flexShrink: 0,
//                                         transition: "all 0.15s",
//                                         boxShadow: "0 1px 6px rgba(28,40,36,0.06)",
//                                     }}
//                                 >
//                                     <ArrowLeft size={15} strokeWidth={2} />
//                                 </button>

//                                 {/* Slim progress bar */}
//                                 <div
//                                     style={{
//                                         flex: 1,
//                                         height: 3,
//                                         background: "#e8ede9",
//                                         borderRadius: 99,
//                                         overflow: "hidden",
//                                     }}
//                                 >
//                                     <div
//                                         style={{
//                                             height: "100%",
//                                             width: `${progress}%`,
//                                             background: "linear-gradient(90deg, #2d7a5a, #1e6b6b)",
//                                             borderRadius: 99,
//                                             transition: "width 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
//                                         }}
//                                     />
//                                 </div>

//                                 {/* Circular counter */}
//                                 <div style={{ position: "relative", width: 44, height: 44, flexShrink: 0 }}>
//                                     <svg width="44" height="44" viewBox="0 0 44 44">
//                                         <circle cx="22" cy="22" r={r} fill="none" strokeWidth="2.5" className="progress-ring-track" />
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
//                                                 transition: "stroke-dashoffset 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
//                                             }}
//                                         />
//                                     </svg>
//                                     <span
//                                         style={{
//                                             position: "absolute",
//                                             inset: 0,
//                                             display: "flex",
//                                             alignItems: "center",
//                                             justifyContent: "center",
//                                             fontSize: 11,
//                                             fontWeight: 600,
//                                             color: "#2d7a5a",
//                                         }}
//                                     >
//                                         {current + 1}/{questions.length}
//                                     </span>
//                                 </div>
//                             </div>

//                             {/* Category pill */}
//                             <span
//                                 style={{
//                                     display: "inline-block",
//                                     background: "rgba(45,122,90,0.08)",
//                                     color: "#2d7a5a",
//                                     fontSize: 11,
//                                     fontWeight: 600,
//                                     letterSpacing: "0.1em",
//                                     textTransform: "uppercase",
//                                     padding: "5px 14px",
//                                     borderRadius: 99,
//                                 }}
//                             >
//                                 {q.category}
//                             </span>
//                         </div>

//                         {/* Question */}
//                         <h2
//                             className="cormorant"
//                             style={{
//                                 fontSize: "clamp(28px, 5.5vw, 38px)",
//                                 fontWeight: 300,
//                                 lineHeight: 1.28,
//                                 color: "#1c2820",
//                                 letterSpacing: "-0.018em",
//                                 marginBottom: 40,
//                             }}
//                         >
//                             {q.text}
//                         </h2>

//                         {/* Options */}
//                         <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//                             {q.options.map((opt, idx) => {
//                                 const isSelected = selectedOption === opt.value || answers[q.id] === opt.value;
//                                 return (
//                                     <button
//                                         key={opt.value}
//                                         type="button"
//                                         onClick={() => handleAnswerStable(opt.value)}
//                                         disabled={transitioning}
//                                         className="option-btn"
//                                         style={{
//                                             width: "100%",
//                                             textAlign: "left",
//                                             padding: "18px 20px",
//                                             borderRadius: 16,
//                                             border: isSelected ? "1.5px solid #2d7a5a" : "1.5px solid #e4e9e5",
//                                             background: isSelected ? "rgba(45,122,90,0.06)" : "white",
//                                             cursor: transitioning ? "default" : "pointer",
//                                             display: "flex",
//                                             alignItems: "center",
//                                             gap: 16,
//                                             boxShadow: isSelected ? "0 0 0 4px rgba(45,122,90,0.08), 0 2px 12px rgba(45,122,90,0.1)" : "0 1px 4px rgba(28,40,36,0.04)",
//                                             fontFamily: "'DM Sans', sans-serif",
//                                         }}
//                                     >
//                                         {/* Letter/check dot */}
//                                         <div
//                                             style={{
//                                                 width: 30,
//                                                 height: 30,
//                                                 borderRadius: "50%",
//                                                 background: isSelected ? "#2d7a5a" : "#f0f4f1",
//                                                 border: isSelected ? "none" : "1.5px solid #dce5df",
//                                                 flexShrink: 0,
//                                                 display: "flex",
//                                                 alignItems: "center",
//                                                 justifyContent: "center",
//                                                 transition: "all 0.22s cubic-bezier(0.22, 1, 0.36, 1)",
//                                             }}
//                                         >
//                                             {isSelected ? (
//                                                 <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
//                                                     <path d="M2.5 6.5l3 3L10.5 3" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
//                                                 </svg>
//                                             ) : (
//                                                 <span style={{ fontSize: 11, fontWeight: 700, color: "#a0b0a8" }}>
//                                                     {["A", "B", "C", "D"][idx]}
//                                                 </span>
//                                             )}
//                                         </div>

//                                         <span
//                                             style={{
//                                                 fontSize: 15,
//                                                 fontWeight: isSelected ? 400 : 300,
//                                                 lineHeight: 1.5,
//                                                 color: isSelected ? "#1c2820" : "#3a4a3e",
//                                                 transition: "all 0.2s",
//                                             }}
//                                         >
//                                             {opt.label}
//                                         </span>
//                                     </button>
//                                 );
//                             })}
//                         </div>

//                         <p style={{ textAlign: "center", fontSize: 12, color: "#b0bab4", marginTop: 32, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
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
//             <PageWrapper step={step}>
//                 <section style={{ paddingTop: 108, paddingBottom: 80, paddingLeft: 24, paddingRight: 24, minHeight: "100vh" }}>
//                     <div style={{ maxWidth: 460, margin: "0 auto" }} className="fade-up">

//                         {/* Icon + heading */}
//                         <div style={{ textAlign: "center", marginBottom: 36 }}>
//                             <div
//                                 style={{
//                                     width: 68,
//                                     height: 68,
//                                     borderRadius: 22,
//                                     background: "linear-gradient(135deg, #2d7a5a, #1e6b6b)",
//                                     display: "inline-flex",
//                                     alignItems: "center",
//                                     justifyContent: "center",
//                                     boxShadow: "0 10px 30px rgba(30,107,107,0.28)",
//                                     marginBottom: 24,
//                                     animation: "float 3s ease-in-out infinite",
//                                 }}
//                             >
//                                 <Mail size={28} color="white" strokeWidth={1.6} />
//                             </div>
//                             <h2
//                                 className="cormorant"
//                                 style={{
//                                     fontSize: "clamp(32px, 7vw, 46px)",
//                                     fontWeight: 300,
//                                     letterSpacing: "-0.025em",
//                                     color: "#1c2820",
//                                     lineHeight: 1.12,
//                                     marginBottom: 14,
//                                 }}
//                             >
//                                 Almost there
//                             </h2>
//                             <p style={{ fontSize: 15, fontWeight: 300, color: "#5a6b5e", lineHeight: 1.7, maxWidth: 340, margin: "0 auto" }}>
//                                 Enter your details to see your personalised results and be matched with the right therapist.
//                             </p>
//                         </div>

//                         {/* Form card */}
//                         <div
//                             style={{
//                                 background: "white",
//                                 borderRadius: 24,
//                                 border: "1px solid #e4e9e5",
//                                 overflow: "hidden",
//                                 boxShadow: "0 6px 40px rgba(28,40,36,0.08)",
//                             }}
//                         >
//                             {/* Top gradient accent */}
//                             <div style={{ height: 3, background: "linear-gradient(90deg, #2d7a5a, #1e6b6b, #5da885)" }} />

//                             <div style={{ padding: "32px 28px 28px" }}>
//                                 {/*
//                                   * KEY FIX: Each input has its own stable onChange handler (handleNameChange,
//                                   * handleEmailChange, handlePhoneChange) defined with useCallback + empty deps.
//                                   * This means React never sees a new function reference → never unmounts the input
//                                   * → focus is never lost between keystrokes.
//                                   *
//                                   * We also avoid the .map() pattern over field config objects that contained
//                                   * inline arrow functions (onChange: (v) => ...) — those created new function
//                                   * references on every render, causing input remounts.
//                                   */}
//                                 <form onSubmit={handleEmailSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 20 }}>

//                                     {/* Name */}
//                                     <div className="form-field">
//                                         <label
//                                             htmlFor="field-name"
//                                             style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4a6a56", marginBottom: 8 }}
//                                         >
//                                             Your Name
//                                         </label>
//                                         <input
//                                             id="field-name"
//                                             type="name"
//                                             placeholder="First name"
//                                             value={name}
//                                             autoFocus
//                                             autoComplete="name"
//                                             onChange={handleNameChange}
//                                             className={errors.name ? "error" : ""}
//                                             aria-invalid={!!errors.name}
//                                         />
//                                         {errors.name && (
//                                             <p style={{ fontSize: 12, color: "#c0392b", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
//                                                 <span>⚠</span> {errors.name}
//                                             </p>
//                                         )}
//                                     </div>

//                                     {/* Email */}
//                                     <div className="form-field">
//                                         <label
//                                             htmlFor="field-email"
//                                             style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4a6a56", marginBottom: 8 }}
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
//                                             className={errors.email ? "error" : ""}
//                                             aria-invalid={!!errors.email}
//                                         />
//                                         {errors.email && (
//                                             <p style={{ fontSize: 12, color: "#c0392b", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
//                                                 <span>⚠</span> {errors.email}
//                                             </p>
//                                         )}
//                                     </div>

//                                     {/* Phone */}
//                                     <div className="form-field">
//                                         <label
//                                             htmlFor="field-phone"
//                                             style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4a6a56", marginBottom: 8 }}
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
//                                             className={errors.phone ? "error" : ""}
//                                             aria-invalid={!!errors.phone}
//                                         />
//                                         {errors.phone && (
//                                             <p style={{ fontSize: 12, color: "#c0392b", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
//                                                 <span>⚠</span> {errors.phone}
//                                             </p>
//                                         )}
//                                     </div>

//                                     <button
//                                         type="submit"
//                                         disabled={submitting}
//                                         className="cta-btn"
//                                         style={{
//                                             width: "100%",
//                                             padding: "17px 28px",
//                                             background: "linear-gradient(135deg, #2d7a5a, #1e6b6b)",
//                                             color: "white",
//                                             border: "none",
//                                             borderRadius: 99,
//                                             fontSize: 15,
//                                             fontWeight: 500,
//                                             fontFamily: "'DM Sans', sans-serif",
//                                             cursor: submitting ? "not-allowed" : "pointer",
//                                             opacity: submitting ? 0.7 : 1,
//                                             display: "flex",
//                                             alignItems: "center",
//                                             justifyContent: "center",
//                                             gap: 8,
//                                             marginTop: 4,
//                                             boxShadow: "0 4px 22px rgba(30,107,107,0.3)",
//                                         }}
//                                     >
//                                         {submitting ? "Saving your results…" : "See My Results"}
//                                         {!submitting && <ArrowRight size={15} strokeWidth={2} />}
//                                     </button>
//                                 </form>

//                                 <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginTop: 20 }}>
//                                     <Shield size={12} stroke="#2d7a5a" strokeWidth={1.8} />
//                                     <p style={{ fontSize: 12, color: "#a0aba3", fontWeight: 300 }}>We never share your data · Unsubscribe any time</p>
//                                 </div>
//                             </div>
//                         </div>

//                         <p style={{ textAlign: "center", fontSize: 12, color: "#a0aba3", marginTop: 18 }}>
//                             By continuing you agree to our{" "}
//                             <Link href="/privacy" style={{ color: "#2d7a5a", textDecoration: "underline", textUnderlineOffset: 3 }}>
//                                 Privacy Policy
//                             </Link>
//                         </p>
//                     </div>
//                 </section>
//             </PageWrapper>
//         );
//     }

//     // ── LOADING ────────────────────────────────────────────────────────────────

//     if (loadPhase !== "done") {
//         // const phases = {
//         //     a: { text: "Analysing your 18 data points…", sub: "Cross-referencing mood, stress, sleep and relational patterns", pct: 33 },
//         //     b: { text: "Comparing against 2,400+ profiles…", sub: "Identifying your specific pattern type", pct: 66 },
//         //     c: { text: totalScore > 18 ? "Elevated threshold detected." : "Pattern identified.", sub: totalScore > 18 ? "Your results require careful review" : "Your personalised profile is ready", pct: 90 },
//         //     done: { text: "", sub: "", pct: 100 },
//         // };
//         const profilesCount = useLiveCounter(2400, "2026-06-01", 35);

//         const phases = {
//             a: { text: "Analysing your 18 data points…", sub: "Cross-referencing mood, stress, sleep and relational patterns", pct: 33 },
//             b: { text: `Comparing against ${profilesCount.toLocaleString()}+ profiles…`, sub: "Identifying your specific pattern type", pct: 66 },
//             c: { text: totalScore > 18 ? "Elevated threshold detected." : "Pattern identified.", sub: totalScore > 18 ? "Your results require careful review" : "Your personalised profile is ready", pct: 90 },
//             done: { text: "", sub: "", pct: 100 },
//         };
//         const msg = phases[loadPhase];
//         const color = totalScore > 18 && loadPhase === "c" ? "#a33030" : "#2d7a5a";

//         return (
//             <PageWrapper step={step}>
//                 <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
//                     <div style={{ textAlign: "center", maxWidth: 380 }} className="fade-in">
//                         <div
//                             style={{
//                                 width: 64,
//                                 height: 64,
//                                 borderRadius: "50%",
//                                 border: `3px solid ${color}20`,
//                                 borderTopColor: color,
//                                 animation: "spin 0.85s linear infinite",
//                                 margin: "0 auto 36px",
//                             }}
//                         />
//                         <h2
//                             className="cormorant"
//                             style={{
//                                 fontSize: "clamp(22px, 5vw, 30px)",
//                                 fontWeight: 300,
//                                 color,
//                                 lineHeight: 1.3,
//                                 marginBottom: 14,
//                             }}
//                         >
//                             {msg.text}
//                         </h2>
//                         <p style={{ fontSize: 14, fontWeight: 300, color: "#8a9a8e", lineHeight: 1.65, marginBottom: 40 }}>
//                             {msg.sub}
//                         </p>

//                         {/* Progress bar */}
//                         <div style={{ height: 3, background: "#e8ede9", borderRadius: 99, overflow: "hidden", marginBottom: 28 }}>
//                             <div
//                                 style={{
//                                     height: "100%",
//                                     width: `${msg.pct}%`,
//                                     background: `linear-gradient(90deg, ${color}, ${color}88)`,
//                                     borderRadius: 99,
//                                     transition: "width 1.6s cubic-bezier(0.22, 1, 0.36, 1)",
//                                 }}
//                             />
//                         </div>

//                         {/* Dots */}
//                         <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
//                             {(["a", "b", "c"] as LoadPhase[]).map((p) => (
//                                 <div
//                                     key={p}
//                                     style={{
//                                         width: 7,
//                                         height: 7,
//                                         borderRadius: "50%",
//                                         background: p === loadPhase ? color : "#d8dbd5",
//                                         transition: "background 0.4s, transform 0.4s",
//                                         transform: p === loadPhase ? "scale(1.3)" : "scale(1)",
//                                     }}
//                                 />
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </PageWrapper>
//         );
//     }

//     // ── RESULT ─────────────────────────────────────────────────────────────────

//     const isHigh = totalScore > 18;

//     return (
//         <PageWrapper step={step}>
//             <section style={{ paddingTop: 96, paddingBottom: 80, paddingLeft: 24, paddingRight: 24 }}>
//                 <div style={{ maxWidth: 600, margin: "0 auto" }} className="fade-up">

//                     {/* Pattern banner */}
//                     <div
//                         style={{
//                             borderRadius: 24,
//                             overflow: "hidden",
//                             marginBottom: 20,
//                             position: "relative",
//                             background: result.gradient,
//                             color: "white",
//                             padding: "40px 32px 36px",
//                         }}
//                     >
//                         <div
//                             style={{
//                                 position: "absolute",
//                                 inset: 0,
//                                 backgroundImage: "radial-gradient(circle at 85% 15%, rgba(255,255,255,0.09) 0%, transparent 55%), radial-gradient(circle at 10% 85%, rgba(255,255,255,0.05) 0%, transparent 45%)",
//                             }}
//                         />
//                         <div style={{ position: "relative", zIndex: 1 }}>
//                             <div
//                                 style={{
//                                     display: "inline-block",
//                                     background: "rgba(255,255,255,0.14)",
//                                     borderRadius: 99,
//                                     padding: "5px 16px",
//                                     fontSize: 12,
//                                     marginBottom: 18,
//                                     backdropFilter: "blur(4px)",
//                                     letterSpacing: "0.02em",
//                                 }}
//                             >
//                                 {intel.percentile}
//                             </div>
//                             <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.55, marginBottom: 8 }}>
//                                 Your pattern
//                             </div>
//                             <h1
//                                 className="cormorant"
//                                 style={{
//                                     fontSize: "clamp(30px, 6vw, 44px)",
//                                     fontWeight: 300,
//                                     lineHeight: 1.1,
//                                     letterSpacing: "-0.025em",
//                                     marginBottom: 12,
//                                 }}
//                             >
//                                 {intel.typeName}
//                             </h1>
//                             <div style={{ opacity: 0.65, fontSize: 13, fontWeight: 300 }}>
//                                 {result.band} · Score {totalScore}/{questions.length * 3}
//                                 {name ? ` · ${name}` : ""}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Hook card */}
//                     <div
//                         style={{
//                             background: "white",
//                             border: "1px solid #e4e9e5",
//                             borderRadius: 20,
//                             padding: "28px",
//                             marginBottom: 16,
//                             boxShadow: "0 2px 16px rgba(28,40,36,0.04)",
//                         }}
//                     >
//                         <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: intel.accentColor, marginBottom: 16 }}>
//                             What your results are telling us
//                         </div>
//                         <p
//                             className="cormorant"
//                             style={{
//                                 fontSize: "clamp(20px, 4.5vw, 27px)",
//                                 fontWeight: 300,
//                                 lineHeight: 1.32,
//                                 color: "#1c2820",
//                                 marginBottom: 16,
//                             }}
//                         >
//                             {intel.hook}
//                         </p>
//                         <p style={{ fontSize: 15, fontWeight: 300, color: "#5a6b5e", lineHeight: 1.78 }}>
//                             {intel.cliffhanger}
//                         </p>
//                     </div>

//                     {/* Locked insight */}
//                     <div
//                         style={{
//                             background: intel.accentLight,
//                             border: `1px solid ${intel.accentColor}22`,
//                             borderRadius: 20,
//                             padding: "24px 28px",
//                             marginBottom: 16,
//                             position: "relative",
//                             overflow: "hidden",
//                         }}
//                     >
//                         <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
//                             <div
//                                 style={{
//                                     width: 30,
//                                     height: 30,
//                                     borderRadius: 9,
//                                     background: `${intel.accentColor}18`,
//                                     display: "flex",
//                                     alignItems: "center",
//                                     justifyContent: "center",
//                                 }}
//                             >
//                                 <Lock size={13} stroke={intel.accentColor} strokeWidth={2} />
//                             </div>
//                             <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: intel.accentColor }}>
//                                 {intel.lockedLabel}
//                             </span>
//                         </div>

//                         <div style={{ position: "relative" }}>
//                             <p className="locked-blur" style={{ fontSize: 15, fontWeight: 300, color: "#5a6b5e", lineHeight: 1.78 }} aria-hidden="true">
//                                 {intel.lockedTeaser}
//                             </p>
//                             <div
//                                 style={{
//                                     position: "absolute",
//                                     inset: 0,
//                                     display: "flex",
//                                     alignItems: "center",
//                                     justifyContent: "center",
//                                 }}
//                             >
//                                 <span
//                                     style={{
//                                         fontSize: 13,
//                                         fontWeight: 500,
//                                         color: intel.accentColor,
//                                         background: "white",
//                                         padding: "7px 20px",
//                                         borderRadius: 99,
//                                         border: `1px solid ${intel.accentColor}28`,
//                                         boxShadow: "0 2px 14px rgba(0,0,0,0.07)",
//                                         whiteSpace: "nowrap",
//                                     }}
//                                 >
//                                     Revealed in your session
//                                 </span>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Tip card */}
//                     <div
//                         style={{
//                             background: "white",
//                             border: "1px solid #e4e9e5",
//                             borderRadius: 20,
//                             padding: "24px 28px",
//                             marginBottom: 16,
//                             boxShadow: "0 1px 8px rgba(28,40,36,0.03)",
//                         }}
//                     >
//                         <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: intel.accentColor, marginBottom: 16 }}>
//                             {intel.tipLabel}
//                         </div>
//                         <p style={{ fontSize: 15, fontWeight: 300, color: "#5a6b5e", lineHeight: 1.78, marginBottom: 14 }}>
//                             {intel.tip}
//                         </p>
//                         <p style={{ fontSize: 13, fontWeight: 400, color: intel.accentColor }}>
//                             Your full recovery protocol is covered in your first session.
//                         </p>
//                     </div>

//                     {/* Urgency alert */}
//                     {isHigh && (
//                         <div
//                             style={{
//                                 background: "#fff8f8",
//                                 border: "1px solid #f0b4b4",
//                                 borderRadius: 20,
//                                 padding: "20px 24px",
//                                 marginBottom: 16,
//                                 display: "flex",
//                                 gap: 14,
//                             }}
//                         >
//                             <AlertTriangle size={17} stroke="#a33030" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
//                             <div>
//                                 <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#a33030", marginBottom: 8 }}>
//                                     If you are in immediate distress
//                                 </p>
//                                 <p style={{ fontSize: 14, fontWeight: 300, color: "#4a2020", lineHeight: 1.72 }}>
//                                     If you feel unsafe right now, please reach out to someone you trust or visit your nearest hospital. You matter — help is available immediately.
//                                 </p>
//                             </div>
//                         </div>
//                     )}

//                     {/* CTA */}
//                     <div
//                         style={{
//                             background: intel.accentLight,
//                             border: `1px solid ${intel.accentColor}18`,
//                             borderRadius: 24,
//                             padding: "32px",
//                             marginBottom: 20,
//                         }}
//                     >
//                         <h3
//                             className="cormorant"
//                             style={{
//                                 fontSize: "clamp(22px, 4.5vw, 28px)",
//                                 fontWeight: 300,
//                                 color: "#1c2820",
//                                 lineHeight: 1.28,
//                                 marginBottom: 12,
//                             }}
//                         >
//                             A therapist matched to your pattern
//                         </h3>
//                         <p style={{ fontSize: 14, fontWeight: 300, color: "#5a6b5e", lineHeight: 1.72, marginBottom: 28 }}>
//                             One 50-minute session, built around what your results showed. We'll explain your full pattern, name your specific triggers, and give you a concrete next step.
//                         </p>
//                         <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//                             <Link
//                                 href={whatsappUrl}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="cta-btn"
//                                 style={{
//                                     display: "flex",
//                                     alignItems: "center",
//                                     justifyContent: "center",
//                                     gap: 10,
//                                     padding: "17px 28px",
//                                     background: `linear-gradient(135deg, ${intel.accentColor}, ${isHigh ? "#7a1f1f" : "#1e6b6b"})`,
//                                     color: "white",
//                                     borderRadius: 99,
//                                     textDecoration: "none",
//                                     fontSize: 15,
//                                     fontWeight: 500,
//                                     fontFamily: "'DM Sans', sans-serif",
//                                     boxShadow: `0 6px 24px ${intel.accentColor}45`,
//                                 }}
//                             >
//                                 {result.cta}
//                                 <ArrowRight size={15} strokeWidth={2} />
//                             </Link>
//                             <Link
//                                 href="/services"
//                                 style={{
//                                     display: "flex",
//                                     alignItems: "center",
//                                     justifyContent: "center",
//                                     gap: 8,
//                                     padding: "16px 28px",
//                                     background: "white",
//                                     border: "1.5px solid #dce5df",
//                                     color: "#3a4a3e",
//                                     borderRadius: 99,
//                                     textDecoration: "none",
//                                     fontSize: 15,
//                                     fontWeight: 400,
//                                     fontFamily: "'DM Sans', sans-serif",
//                                     transition: "all 0.15s",
//                                     boxShadow: "0 1px 6px rgba(28,40,36,0.05)",
//                                 }}
//                             >
//                                 View our services
//                             </Link>
//                         </div>
//                     </div>

//                     {/* What happens next */}
//                     <div
//                         style={{
//                             background: "rgba(45,122,90,0.05)",
//                             border: "1px solid rgba(45,122,90,0.14)",
//                             borderRadius: 20,
//                             padding: "24px 28px",
//                             marginBottom: 24,
//                         }}
//                     >
//                         <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#2d7a5a", marginBottom: 20 }}>
//                             What happens next
//                         </p>
//                         <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//                             {[
//                                 "Check your email — your full results summary is on its way",
//                                 "Check your spam folder if you don't see it within 2 minutes",
//                                 "A therapist matched to your pattern will reach out within 24 hours",
//                             ].map((item) => (
//                                 <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
//                                     <CheckCircle size={16} fill="#2d7a5a" stroke="white" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 1 }} />
//                                     <span style={{ fontSize: 14, fontWeight: 300, color: "#4a5a52", lineHeight: 1.65 }}>{item}</span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     <p style={{ textAlign: "center", fontSize: 12, fontWeight: 300, color: "#a0aba3", lineHeight: 1.7 }}>
//                         If you're in crisis, please contact{" "}
//                         <a href="tel:112" style={{ color: "#2d7a5a", textDecoration: "underline", textUnderlineOffset: 2 }}>emergency services</a>.
//                     </p>

//                 </div>
//             </section>
//         </PageWrapper>
//     );
// }


///////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////


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
// } from "lucide-react";
// import { useLiveCounter } from "@/hooks/use-live-counter";

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

// type Step = "intro" | "quiz" | "email";

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
//                             href="/book"
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
//                             href="/book"
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

// function PageWrapper({ children }: { children: React.ReactNode }) {
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
//     const transitioningRef = useRef(false);

//     const totalScore = Object.values(answers).reduce((a, v) => a + v, 0);
//     const progress = ((current + 1) / questions.length) * 100;
//     const assessedCount = useLiveCounter(2400, "2026-06-01", 2000);

//     useEffect(() => {
//         window.scrollTo({ top: 0, behavior: "smooth" });
//         setSelectedOption(null);
//     }, [current, step]);

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
//                     JSON.stringify({ name, email, score: totalScore, answers })
//                 );
//             }

//             setSubmitting(false);
//             router.push("/assessment/result");
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

//     return (
//         <PageWrapper>
//             <section className="pt-[108px] pb-20 px-6 min-h-screen">
//                 <div className="max-w-[460px] mx-auto fade-up">

//                     <div className="text-center mb-9">
//                         <div
//                             className="w-[68px] h-[68px] rounded-[22px] bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] inline-flex items-center justify-center shadow-[0_10px_30px_rgba(30,107,107,0.28)] mb-6"
//                             style={{ animation: "float 3s ease-in-out infinite" }}
//                         >
//                             <Mail size={28} color="white" strokeWidth={1.6} />
//                         </div>
//                         <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(32px,7vw,46px)] font-light tracking-[-0.025em] text-[#1c2820] leading-[1.12] mb-3.5">
//                             Almost there
//                         </h2>
//                         <p className="text-[15px] font-light text-[#5a6b5e] leading-[1.7] max-w-[340px] mx-auto">
//                             Enter your details to see your personalised results and be matched with the right therapist.
//                         </p>
//                     </div>

//                     <div className="bg-white rounded-3xl border border-[#e4e9e5] overflow-hidden shadow-[0_6px_40px_rgba(28,40,36,0.08)]">
//                         <div className="h-[3px] bg-gradient-to-r from-[#2d7a5a] via-[#1e6b6b] to-[#5da885]" />

//                         <div className="p-8 pt-8">
//                             <form onSubmit={handleEmailSubmit} noValidate className="flex flex-col gap-5">

//                                 {/* Name */}
//                                 <div>
//                                     <label
//                                         htmlFor="field-name"
//                                         className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-[#4a6a56] mb-2"
//                                     >
//                                         Your Name
//                                     </label>
//                                     <input
//                                         id="field-name"
//                                         type="text"
//                                         placeholder="First name"
//                                         value={name}
//                                         autoFocus
//                                         autoComplete="name"
//                                         onChange={handleNameChange}
//                                         className={`form-input${errors.name ? " error" : ""}`}
//                                         aria-invalid={!!errors.name}
//                                     />
//                                     {errors.name && (
//                                         <p className="text-[12px] text-[#c0392b] mt-1.5 flex items-center gap-1">
//                                             <span>⚠</span> {errors.name}
//                                         </p>
//                                     )}
//                                 </div>

//                                 {/* Email */}
//                                 <div>
//                                     <label
//                                         htmlFor="field-email"
//                                         className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-[#4a6a56] mb-2"
//                                     >
//                                         Email Address
//                                     </label>
//                                     <input
//                                         id="field-email"
//                                         type="email"
//                                         placeholder="you@example.com"
//                                         value={email}
//                                         autoComplete="email"
//                                         onChange={handleEmailChange}
//                                         className={`form-input${errors.email ? " error" : ""}`}
//                                         aria-invalid={!!errors.email}
//                                     />
//                                     {errors.email && (
//                                         <p className="text-[12px] text-[#c0392b] mt-1.5 flex items-center gap-1">
//                                             <span>⚠</span> {errors.email}
//                                         </p>
//                                     )}
//                                 </div>

//                                 {/* Phone */}
//                                 <div>
//                                     <label
//                                         htmlFor="field-phone"
//                                         className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-[#4a6a56] mb-2"
//                                     >
//                                         Phone Number
//                                     </label>
//                                     <input
//                                         id="field-phone"
//                                         type="tel"
//                                         placeholder="+234 000 000 0000"
//                                         value={phone}
//                                         autoComplete="tel"
//                                         onChange={handlePhoneChange}
//                                         className={`form-input${errors.phone ? " error" : ""}`}
//                                         aria-invalid={!!errors.phone}
//                                     />
//                                     {errors.phone && (
//                                         <p className="text-[12px] text-[#c0392b] mt-1.5 flex items-center gap-1">
//                                             <span>⚠</span> {errors.phone}
//                                         </p>
//                                     )}
//                                 </div>

//                                 <button
//                                     type="submit"
//                                     disabled={submitting}
//                                     className="cta-btn w-full py-[17px] px-7 bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] text-white border-0 rounded-full text-[15px] font-medium font-['DM_Sans',sans-serif] flex items-center justify-center gap-2 mt-1 shadow-[0_4px_22px_rgba(30,107,107,0.3)]"
//                                     style={{ cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1 }}
//                                 >
//                                     {submitting ? "Saving your results…" : "See My Results"}
//                                     {!submitting && <ArrowRight size={15} strokeWidth={2} />}
//                                 </button>
//                             </form>

//                             <div className="flex items-center justify-center gap-1.5 mt-5">
//                                 <Shield size={12} stroke="#2d7a5a" strokeWidth={1.8} />
//                                 <p className="text-[12px] text-[#a0aba3] font-light">We never share your data · Unsubscribe any time</p>
//                             </div>
//                         </div>
//                     </div>

//                     <p className="text-center text-[12px] text-[#a0aba3] mt-4.5">
//                         By continuing you agree to our{" "}
//                         <Link href="/privacy" className="text-[#2d7a5a] underline underline-offset-[3px]">
//                             Privacy Policy
//                         </Link>
//                     </p>
//                 </div>
//             </section>
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
                    if (c < questions.length - 1) {
                        return c + 1;
                    } else {
                        setStep("email");
                        return c;
                    }
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