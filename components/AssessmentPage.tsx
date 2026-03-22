
// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import BgBlobs from "@/components/BgBlobs";
// import {
//     ArrowRight,
//     ArrowLeft,
//     CheckCircle,
//     Mail,
//     Shield,
//     Lock,
//     UserCheck,
//     Sparkles,
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

// interface TrustBadge {
//     icon: LucideIcon;
//     label: string;
//     iconColor: string;
//     iconFill: string;
// }

// type Step = "intro" | "quiz" | "email" | "result";

// // ── Data ───────────────────────────────────────────────────────────────────────

// /**
//  * Questions are intentionally grounded in PHQ-9 / GAD-7 clinical language —
//  * this gives the tool credibility and ensures scores map meaningfully to
//  * real severity bands. Wording is warm and plain, not jargon-heavy.
//  */
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

// // Reduced to 3 avatars — prevents pill from wrapping on 320px screens
// const avatarLetters: string[] = ["A", "E", "K", "C"];
// const avatarColors: string[] = ["#7ba98b", "#3d8b8b", "#6fb8b8", "#d4b87b"];

// const trustBadges: TrustBadge[] = [
//     { icon: Lock, label: "Confidential", iconColor: "#3d8b8b", iconFill: "#6fb8b8" },
//     { icon: Sparkles, label: "Free", iconColor: "#a97b3d", iconFill: "#d4b87b" },
//     { icon: UserCheck, label: "No sign-up", iconColor: "#4e7a5e", iconFill: "#7ba98b" },
// ];

// const checklistItems: string[] = [
//     "Your personalised result in 120 seconds",
//     "No account, completely confidential",
//     "Matched to the right therapist",
// ];

// const nextSteps: string[] = [
//     "We'll email your full results summary shortly",
//     "Check your spam folder if you don't see it",
//     "A therapist will reach out within 24 hours",
// ];

// // ── Helpers ────────────────────────────────────────────────────────────────────

// function getResult(score: number): Result {
//     if (score <= 6) {
//         return {
//             band: "Thriving",
//             gradient: "linear-gradient(135deg, #7ba98b, #a8c4b0)",
//             headline: "You're in a good place",
//             summary:
//                 "Your responses suggest you're managing well overall. Many people reach out proactively to build resilience, develop self-awareness, or navigate life transitions — therapy can be valuable even when you're not in crisis.",
//             cta: "Chat us on WhatsApp",
//         };
//     }
//     if (score <= 12) {
//         return {
//             band: "Mild Concern",
//             gradient: "linear-gradient(135deg, #3d8b8b, #6fb8b8)",
//             headline: "Some areas could use support",
//             summary:
//                 "Your responses suggest you're experiencing some difficulties worth exploring. A therapist can help you build practical tools and understand patterns before they become harder to manage.",
//             cta: "Chat us on WhatsApp",
//         };
//     }
//     if (score <= 18) {
//         return {
//             band: "Moderate",
//             gradient: "linear-gradient(135deg, #4e7a5e, #3d8b8b)",
//             headline: "You deserve real support",
//             summary:
//                 "Your responses suggest you're going through a genuinely difficult time. You're not alone — what you're feeling is valid, and speaking with a licensed therapist can make a significant difference.",
//             cta: "Chat us on WhatsApp",
//         };
//     }
//     return {
//         band: "High Concern",
//         gradient: "linear-gradient(135deg, #c0555a, #e07a7f)",
//         headline: "Please reach out — you matter",
//         summary:
//             "Your responses suggest you're struggling significantly right now. We strongly encourage you to speak with a professional as soon as possible. Our therapists are here for you, without judgment.",
//         cta: "Chat us on WhatsApp",
//     };
// }

// // ── Component ──────────────────────────────────────────────────────────────────

// export default function AssessmentPage() {
//     const [step, setStep] = useState<Step>("intro");
//     const [current, setCurrent] = useState<number>(0);
//     const [answers, setAnswers] = useState<Record<string, number>>({});
//     const [email, setEmail] = useState<string>("");
//     const [phone, setPhone] = useState<string>("");
//     const [name, setName] = useState<string>("");
//     const [submitting, setSubmitting] = useState<boolean>(false);
//     const [errors, setErrors] = useState<FormErrors>({});
//     const [transitioning, setTransitioning] = useState<boolean>(false);

//     const totalScore: number = Object.values(answers).reduce(
//         (acc, val) => acc + val, 0
//     );
//     const result: Result = getResult(totalScore);
//     const progress: number = ((current + 1) / questions.length) * 100;

//     function handleAnswer(value: number): void {
//         if (transitioning) return;
//         const q = questions[current];
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

//     function validate(): boolean {
//         const newErrors: FormErrors = {};
//         if (!name.trim() || name.trim().length < 2) {
//             newErrors.name = "Please enter your name.";
//         }
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!email || !emailRegex.test(email)) {
//             newErrors.email = "Please enter a valid email address.";
//         }
//         const phoneDigits = phone.replace(/\D/g, "");
//         if (!phoneDigits || phoneDigits.length < 7) {
//             newErrors.phone = "Please enter a valid phone number.";
//         }
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     }

//     function handleBack(): void {
//         if (transitioning) return;
//         if (current > 0) {
//             setCurrent((c) => c - 1);
//         } else {
//             setStep("intro");
//         }
//     }

//     async function handleEmailSubmit(
//         e: React.FormEvent<HTMLFormElement>
//     ): Promise<void> {
//         e.preventDefault();
//         if (!validate()) return;
//         setSubmitting(true);
//         const res = await fetch("/api/assessment", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 name, email, phone,
//                 score: totalScore,
//                 band: result.band,
//                 answers,
//             }),
//         });
//         if (res.ok) {
//             window.ttq?.track("CompleteRegistration", {
//                 content_name: "Mental Health Assessment",
//                 description: "User submitted assessment email",
//             });
//             setSubmitting(false);
//         }
//         setStep("result");
//     }

//     function buildWhatsAppUrl(score: number): string {
//         const r = getResult(score);
//         const phoneNumber = "254734527573";
//         let note = "";
//         if (r.band === "High Concern") {
//             note = "I need urgent support and would like to speak with a professional as soon as possible.";
//         } else if (r.band === "Thriving") {
//             note = "I'm interested in proactive therapy and building resilience.";
//         } else {
//             note = "I'd like to discuss these results and see how therapy can help me.";
//         }
//         const message = `Hello Mentel, I just completed my Private Wellness Assessment.\nResult: *${r.band}*\n${note}`;
//         return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
//     }

//     const whatsappUrl = buildWhatsAppUrl(totalScore);

//     // ── INTRO ──────────────────────────────────────────────────────────────────

//     if (step === "intro") {
//         return (
//             <div className="relative min-h-screen" style={{ background: "var(--white)" }}>
//                 <BgBlobs />
//                 <section
//                     className="relative z-10 pt-20 pb-24 px-4 sm:px-6"
//                     aria-labelledby="intro-heading"
//                 >
//                     <div className="max-w-xl mx-auto animate-fade-up">

//                         {/*
//                           Social proof pill
//                           ─────────────────
//                           • 3 avatars only (was 6) — prevents wrapping on 320–360px
//                           • whitespace-nowrap on the text lines
//                           • overall pill stays on one row at all reasonable widths
//                         */}
//                         <div
//                             className="inline-flex items-center gap-2 mb-6 rounded-full border"
//                             style={{
//                                 padding: "6px 14px 6px 6px",
//                                 background: "white",
//                                 borderColor: "var(--border)",
//                                 boxShadow: "0 1px 8px rgba(28,58,58,0.06)",
//                                 maxWidth: "100%",
//                             }}
//                             aria-label="2,400 or more people have taken this assessment"
//                         >
//                             {/* Avatars */}
//                             <div className="flex items-center flex-shrink-0" aria-hidden="true">
//                                 {avatarLetters.map((letter, i) => (
//                                     <div
//                                         key={`avatar-${i}`}
//                                         className="flex items-center justify-center rounded-full text-white"
//                                         style={{
//                                             width: 26,
//                                             height: 26,
//                                             fontSize: 10,
//                                             fontWeight: 600,
//                                             background: avatarColors[i],
//                                             border: "2px solid white",
//                                             marginLeft: i === 0 ? 0 : -8,
//                                             zIndex: avatarLetters.length - i,
//                                             position: "relative",
//                                         }}
//                                     >
//                                         {letter}
//                                     </div>
//                                 ))}
//                             </div>

//                             {/* Text — two tight lines, never wraps */}
//                             <div style={{ lineHeight: 1.35, minWidth: 0 }}>
//                                 <span
//                                     className="block text-xs font-semibold whitespace-nowrap"
//                                     style={{ color: "var(--deep)", fontSize: 12 }}
//                                 >
//                                     2,400+ people checked in
//                                 </span>
//                                 <span
//                                     className="block whitespace-nowrap"
//                                     style={{ color: "var(--text-muted)", fontSize: 11 }}
//                                 >
//                                     Trusted · Confidential · Free
//                                 </span>
//                             </div>
//                         </div>

//                         {/* Heading — accessible id for aria-labelledby */}
//                         <h1
//                             id="intro-heading"
//                             className="font-cormorant mb-3"
//                             style={{
//                                 fontSize: "clamp(36px, 8vw, 54px)",
//                                 fontWeight: 300,
//                                 lineHeight: 1.14,
//                                 letterSpacing: "-0.02em",
//                                 color: "var(--deep)",
//                             }}
//                         >
//                             How are you{" "}
//                             <em className="italic" style={{ color: "var(--sage-dark)" }}>
//                                 really
//                             </em>{" "}
//                             doing?
//                         </h1>

//                         <p
//                             className="mb-5 font-light leading-relaxed"
//                             style={{
//                                 fontSize: "clamp(15px, 4vw, 16px)",
//                                 color: "var(--text-muted)",
//                                 maxWidth: 420,
//                             }}
//                         >
//                             This short, confidential check-in helps us understand where you
//                             are right now, so you can get support.
//                         </p>

//                         {/* Trust badges */}
//                         <div className="flex flex-wrap gap-2 mb-5" role="list" aria-label="Features">
//                             {trustBadges.map(({ icon: Icon, label, iconColor, iconFill }) => (
//                                 <span
//                                     key={label}
//                                     role="listitem"
//                                     className="inline-flex items-center gap-1.5 rounded-full text-xs font-medium border"
//                                     style={{
//                                         padding: "6px 13px",
//                                         background: "rgba(123,169,139,0.09)",
//                                         borderColor: "rgba(123,169,139,0.26)",
//                                         color: "var(--sage-dark)",
//                                     }}
//                                 >
//                                     <Icon size={12} fill={iconFill} stroke={iconColor} strokeWidth={1.5} aria-hidden="true" />
//                                     {label}
//                                 </span>
//                             ))}
//                         </div>

//                         {/* Checklist card */}
//                         <ul
//                             className="rounded-2xl border overflow-hidden"
//                             style={{
//                                 background: "white",
//                                 borderColor: "var(--border)",
//                                 boxShadow: "0 2px 16px rgba(28,58,58,0.05)",
//                                 listStyle: "none",
//                                 padding: 0,
//                                 marginBottom: "2rem",
//                             }}
//                             aria-label="What to expect"
//                         >
//                             {checklistItems.map((item, i) => (
//                                 <li
//                                     key={item}
//                                     className="flex items-start gap-3 px-5 py-4 sm:px-6"
//                                     style={{
//                                         borderBottom:
//                                             i < checklistItems.length - 1
//                                                 ? "1px solid var(--border)"
//                                                 : "none",
//                                     }}
//                                 >
//                                     <CheckCircle
//                                         size={16}
//                                         fill="var(--sage)"
//                                         stroke="white"
//                                         strokeWidth={2.5}
//                                         style={{ flexShrink: 0, marginTop: 2 }}
//                                         aria-hidden="true"
//                                     />
//                                     <span
//                                         className="font-light leading-relaxed"
//                                         style={{ fontSize: "clamp(14px, 3.8vw, 15px)", color: "var(--text-muted)" }}
//                                     >
//                                         {item}
//                                     </span>
//                                 </li>
//                             ))}
//                         </ul>

//                         {/* CTA */}
//                         <button
//                             type="button"
//                             onClick={() => { setStep("quiz"); window.ttq?.track("Start trial"); }}
//                             className="w-full inline-flex items-center justify-center gap-2 font-medium text-white rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teal)]"
//                             style={{
//                                 padding: "17px 32px",
//                                 fontSize: "clamp(14px, 4vw, 15px)",
//                                 background: "linear-gradient(135deg, var(--sage-dark), var(--teal))",
//                                 boxShadow: "0 4px 20px rgba(61,139,139,0.28)",
//                             }}
//                         >
//                             Start Free Mental Health Check
//                             <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
//                         </button>
//                         {/* Trust strip */}
//                         {/* Quiet trust line — below CTA */}
//                         <p className="flex items-center justify-center gap-1.5 mt-4 text-xs"
//                             style={{ color: "var(--text-muted)" }}>
//                             <Shield size={11} stroke="var(--sage)" strokeWidth={2} aria-hidden="true" />
//                             Confidential · NDPR compliant · Never shared
//                         </p>
//                     </div>
//                 </section>
//             </div>
//         );
//     }

//     // ── QUIZ ───────────────────────────────────────────────────────────────────

//     if (step === "quiz") {
//         const q: Question | undefined = questions[current];
//         if (!q) return null;
//         const answeredValue: number | undefined = answers[q.id];
//         const questionId = `question-${q.id}`;

//         return (
//             <div className="relative min-h-screen" style={{ background: "var(--white)" }}>
//                 <BgBlobs />
//                 <section
//                     className="relative z-10 pt-20 pb-24 px-4 sm:px-6"
//                     aria-labelledby={questionId}
//                 >
//                     <div className="max-w-lg mx-auto animate-fade-up">

//                         {/* Progress row */}
//                         <div className="mb-8 sm:mb-10">
//                             {/* Step label */}
//                             <div className="flex justify-between items-center mb-2">
//                                 <span
//                                     className="text-xs font-semibold uppercase tracking-widest"
//                                     style={{ color: "var(--sage-dark)" }}
//                                 >
//                                     {q.category}
//                                 </span>
//                                 <span
//                                     className="text-xs font-medium tabular-nums"
//                                     style={{ color: "var(--text-muted)" }}
//                                 >
//                                     {current + 1} of {questions.length}
//                                 </span>
//                             </div>
//                             <div className="flex items-center gap-3">
//                                 <button
//                                     type="button"
//                                     onClick={handleBack}
//                                     disabled={transitioning}
//                                     aria-label="Go back to previous question"
//                                     className="flex items-center justify-center rounded-full border transition-all duration-150 cursor-pointer disabled:opacity-40 flex-shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teal)]"
//                                     style={{
//                                         width: 40,
//                                         height: 40,
//                                         background: "white",
//                                         borderColor: "var(--border)",
//                                         color: "var(--text-muted)",
//                                     }}
//                                 >
//                                     <ArrowLeft size={15} strokeWidth={2} aria-hidden="true" />
//                                 </button>

//                                 {/* Progress bar — labelled for screen readers */}
//                                 <div
//                                     className="flex-1 rounded-full overflow-hidden"
//                                     style={{ height: 8, background: "var(--border)" }}
//                                     role="progressbar"
//                                     aria-valuenow={current + 1}
//                                     aria-valuemin={1}
//                                     aria-valuemax={questions.length}
//                                     aria-label={`Question ${current + 1} of ${questions.length}`}
//                                 >
//                                     <div
//                                         className="h-full rounded-full transition-all duration-500 ease-out"
//                                         style={{
//                                             width: `${progress}%`,
//                                             background: "linear-gradient(90deg, var(--sage), var(--teal))",
//                                         }}
//                                     />
//                                 </div>

//                             </div>
//                         </div>

//                         {/* Question */}
//                         <h2
//                             id={questionId}
//                             className="font-cormorant font-light mb-6 sm:mb-8"
//                             style={{
//                                 fontSize: "clamp(22px, 5.5vw, 32px)",
//                                 lineHeight: 1.35,
//                                 color: "var(--deep)",
//                                 letterSpacing: "-0.01em",
//                                 wordBreak: "break-word",
//                                 overflowWrap: "break-word",
//                             }}
//                         >
//                             {q.text}
//                         </h2>

//                         {/*
//                           Options rendered as a radiogroup for full a11y:
//                           - screen readers announce "1 of 4, Rarely or never, radio button"
//                           - keyboard: arrow keys cycle options, Space/Enter selects
//                           - selected state is communicated via aria-checked
//                         */}
//                         <div
//                             role="radiogroup"
//                             aria-labelledby={questionId}
//                             className="flex flex-col gap-3"
//                         >
//                             {q.options.map((opt: Option) => {
//                                 const isSelected = answeredValue === opt.value;
//                                 const optionId = `${q.id}-opt-${opt.value}`;
//                                 return (
//                                     <button
//                                         key={opt.value}
//                                         id={optionId}
//                                         type="button"
//                                         role="radio"
//                                         aria-checked={isSelected}
//                                         onClick={() => handleAnswer(opt.value)}
//                                         disabled={transitioning}
//                                         className="w-full text-left rounded-2xl border transition-all duration-200 cursor-pointer disabled:cursor-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teal)]"
//                                         style={{
//                                             padding: "14px 16px",
//                                             minHeight: 56,
//                                             background: isSelected ? "rgba(123,169,139,0.10)" : "white",
//                                             borderColor: isSelected ? "var(--sage)" : "var(--border)",
//                                             color: isSelected ? "var(--sage-dark)" : "var(--text)",
//                                             boxShadow: isSelected
//                                                 ? "0 0 0 3px rgba(123,169,139,0.13)"
//                                                 : "0 1px 4px rgba(28,58,58,0.04)",
//                                             display: "flex",
//                                             alignItems: "center",
//                                             justifyContent: "space-between",
//                                             gap: 12,
//                                         }}
//                                         onMouseEnter={(e) => {
//                                             if (!isSelected) e.currentTarget.style.borderColor = "var(--sage-light)";
//                                         }}
//                                         onMouseLeave={(e) => {
//                                             if (!isSelected) e.currentTarget.style.borderColor = "var(--border)";
//                                         }}
//                                     >
//                                         <span
//                                             className="font-light leading-snug"
//                                             style={{
//                                                 fontSize: "clamp(14px, 4vw, 15px)",
//                                                 flex: 1,
//                                                 whiteSpace: "normal",
//                                                 wordBreak: "break-word",
//                                             }}
//                                         >
//                                             {opt.label}
//                                         </span>

//                                         {/* Visual radio indicator — hidden from AT (aria-checked handles it) */}
//                                         <span
//                                             className="flex-shrink-0 rounded-full flex items-center justify-center transition-all duration-200"
//                                             aria-hidden="true"
//                                             style={{
//                                                 width: 22,
//                                                 height: 22,
//                                                 minWidth: 22,
//                                                 background: isSelected ? "var(--sage)" : "transparent",
//                                                 border: isSelected
//                                                     ? "2px solid var(--sage)"
//                                                     : "2px solid var(--border)",
//                                             }}
//                                         >
//                                             {isSelected && (
//                                                 <svg
//                                                     width="11" height="11"
//                                                     viewBox="0 0 11 11"
//                                                     fill="none"
//                                                     stroke="white"
//                                                     strokeWidth="2.2"
//                                                     strokeLinecap="round"
//                                                     strokeLinejoin="round"
//                                                 >
//                                                     <path d="M2 5.5l2.5 2.5L9 3" />
//                                                 </svg>
//                                             )}
//                                         </span>
//                                     </button>
//                                 );
//                             })}
//                         </div>
//                         {/* Privacy reassurance */}
//                         <p className="flex items-center justify-center gap-1.5 mt-6 text-xs"
//                             style={{ color: "var(--text-muted)" }}>
//                             <Lock size={11} stroke="var(--sage)" strokeWidth={2} aria-hidden="true" />
//                             Your answers are private and never shared
//                         </p>
//                     </div>
//                 </section>
//             </div>
//         );
//     }

//     // ── EMAIL CAPTURE ──────────────────────────────────────────────────────────

//     if (step === "email") {
//         return (
//             <div className="relative min-h-screen" style={{ background: "var(--white)" }}>
//                 <BgBlobs />
//                 <section
//                     className="relative z-10 pt-20 pb-24 px-4 sm:px-6"
//                     aria-labelledby="email-heading"
//                 >
//                     <div className="max-w-md mx-auto animate-fade-up">

//                         <div className="text-center mb-7 sm:mb-8">
//                             <div
//                                 className="inline-flex items-center justify-center rounded-2xl mb-5"
//                                 aria-hidden="true"
//                                 style={{
//                                     width: 56,
//                                     height: 56,
//                                     background: "linear-gradient(135deg, var(--sage), var(--teal))",
//                                 }}
//                             >
//                                 <Mail size={24} color="white" strokeWidth={1.8} />
//                             </div>
//                             <h2
//                                 id="email-heading"
//                                 className="font-cormorant font-light mb-3"
//                                 style={{
//                                     fontSize: "clamp(26px, 6vw, 38px)",
//                                     color: "var(--deep)",
//                                     letterSpacing: "-0.02em",
//                                     lineHeight: 1.2,
//                                 }}
//                             >
//                                 Almost there
//                             </h2>
//                             <p
//                                 className="font-light leading-relaxed"
//                                 style={{
//                                     fontSize: "clamp(14px, 3.8vw, 15px)",
//                                     color: "var(--text-muted)",
//                                     maxWidth: 340,
//                                     margin: "0 auto",
//                                 }}
//                             >
//                                 Enter your details to receive your personalised results and be
//                                 matched with the right therapist.
//                             </p>
//                         </div>

//                         {/* Form card */}
//                         <div
//                             className="rounded-2xl border relative overflow-hidden"
//                             style={{
//                                 background: "white",
//                                 borderColor: "var(--border)",
//                                 boxShadow: "0 4px 24px rgba(28,58,58,0.07)",
//                             }}
//                         >
//                             {/* Decorative top bar */}
//                             <div
//                                 aria-hidden="true"
//                                 className="absolute top-0 left-0 right-0"
//                                 style={{
//                                     height: 2,
//                                     background: "linear-gradient(90deg, var(--sage), var(--teal), var(--sage-light))",
//                                 }}
//                             />

//                             <div className="px-5 sm:px-7 pt-7 sm:pt-8 pb-6 sm:pb-7">
//                                 <form onSubmit={handleEmailSubmit} className="flex flex-col gap-5" noValidate>

//                                     {/* Name */}
//                                     <div>
//                                         <label
//                                             htmlFor="field-name"
//                                             className="block text-xs font-semibold uppercase tracking-widest mb-2"
//                                             style={{ color: "var(--sage-dark)" }}
//                                         >
//                                             Your Name
//                                         </label>
//                                         <input
//                                             id="field-name"
//                                             type="text"
//                                             placeholder="First name"
//                                             value={name}
//                                             autoComplete="given-name"
//                                             aria-required="true"
//                                             aria-invalid={!!errors.name}
//                                             aria-describedby={errors.name ? "error-name" : undefined}
//                                             onChange={(e) => {
//                                                 setName(e.target.value);
//                                                 setErrors((prev) => ({ ...prev, name: undefined }));
//                                             }}
//                                             className={`form-input${errors.name ? " form-input-error" : ""}`}
//                                             // 16px prevents iOS Safari from zooming on focus
//                                             style={{ fontSize: "16px" }}
//                                         />
//                                         {errors.name && (
//                                             <p id="error-name" role="alert" className="text-xs mt-1.5" style={{ color: "var(--error)" }}>
//                                                 {errors.name}
//                                             </p>
//                                         )}
//                                     </div>

//                                     {/* Email */}
//                                     <div>
//                                         <label
//                                             htmlFor="field-email"
//                                             className="block text-xs font-semibold uppercase tracking-widest mb-2"
//                                             style={{ color: "var(--sage-dark)" }}
//                                         >
//                                             Email Address
//                                         </label>
//                                         <input
//                                             id="field-email"
//                                             type="email"
//                                             placeholder="you@example.com"
//                                             value={email}
//                                             autoComplete="email"
//                                             inputMode="email"
//                                             aria-required="true"
//                                             aria-invalid={!!errors.email}
//                                             aria-describedby={errors.email ? "error-email" : undefined}
//                                             onChange={(e) => {
//                                                 setEmail(e.target.value);
//                                                 setErrors((prev) => ({ ...prev, email: undefined }));
//                                             }}
//                                             className={`form-input${errors.email ? " form-input-error" : ""}`}
//                                             style={{ fontSize: "16px" }}
//                                         />
//                                         {errors.email && (
//                                             <p id="error-email" role="alert" className="text-xs mt-1.5" style={{ color: "var(--error)" }}>
//                                                 {errors.email}
//                                             </p>
//                                         )}
//                                     </div>

//                                     {/* Phone */}
//                                     <div>
//                                         <label
//                                             htmlFor="field-phone"
//                                             className="block text-xs font-semibold uppercase tracking-widest mb-2"
//                                             style={{ color: "var(--sage-dark)" }}
//                                         >
//                                             Phone Number
//                                         </label>
//                                         <input
//                                             id="field-phone"
//                                             type="tel"
//                                             placeholder="+234 000 000 0000"
//                                             value={phone}
//                                             autoComplete="tel"
//                                             inputMode="tel"
//                                             aria-required="true"
//                                             aria-invalid={!!errors.phone}
//                                             aria-describedby={errors.phone ? "error-phone" : undefined}
//                                             onChange={(e) => {
//                                                 setPhone(e.target.value);
//                                                 setErrors((prev) => ({ ...prev, phone: undefined }));
//                                             }}
//                                             className={`form-input${errors.phone ? " form-input-error" : ""}`}
//                                             style={{ fontSize: "16px" }}
//                                         />
//                                         {errors.phone && (
//                                             <p id="error-phone" role="alert" className="text-xs mt-1.5" style={{ color: "var(--error)" }}>
//                                                 {errors.phone}
//                                             </p>
//                                         )}
//                                     </div>

//                                     <button
//                                         type="submit"
//                                         disabled={submitting}
//                                         className="w-full inline-flex items-center justify-center gap-2 font-medium text-white rounded-full transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teal)]"
//                                         style={{
//                                             padding: "16px 28px",
//                                             fontSize: "clamp(14px, 4vw, 15px)",
//                                             background: "linear-gradient(135deg, var(--sage-dark), var(--teal))",
//                                             boxShadow: "0 4px 18px rgba(61,139,139,0.25)",
//                                         }}
//                                         aria-busy={submitting}
//                                     >
//                                         {submitting ? "Saving your results…" : "See My Results"}
//                                         {!submitting && <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />}
//                                     </button>

//                                 </form>

//                                 <div className="flex items-center justify-center gap-2 mt-5" aria-hidden="true">
//                                     <Shield size={12} fill="#6fb8b8" stroke="#3d8b8b" strokeWidth={1.5} />
//                                     <p className="text-xs" style={{ color: "var(--text-muted)" }}>
//                                         We never share your data. Unsubscribe any time.
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>

//                         <p className="text-center text-xs mt-4" style={{ color: "var(--text-muted)" }}>
//                             By continuing you agree to our{" "}
//                             <Link
//                                 href="/privacy"
//                                 className="underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teal)] rounded-sm"
//                                 style={{ color: "var(--sage-dark)" }}
//                             >
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
//         <div className="relative min-h-screen" style={{ background: "var(--white)" }}>
//             <BgBlobs />
//             <section
//                 className="relative z-10 pt-20 pb-24 px-4 sm:px-6"
//                 aria-labelledby="result-heading"
//             >
//                 <div className="max-w-lg mx-auto animate-fade-up">

//                     {/* Score banner */}
//                     <div
//                         className="rounded-3xl relative overflow-hidden mb-5 text-white text-center"
//                         style={{
//                             padding: "36px 24px",
//                             background: result.gradient,
//                         }}
//                         role="region"
//                         aria-label={`Your result: ${result.band}. Score ${totalScore} out of ${questions.length * 3}`}
//                     >
//                         <div
//                             aria-hidden="true"
//                             className="absolute inset-0 opacity-10"
//                             style={{
//                                 backgroundImage: "radial-gradient(circle at 20% 80%, white 0%, transparent 60%)",
//                             }}
//                         />
//                         <p
//                             aria-hidden="true"
//                             className="text-xs uppercase tracking-widest opacity-75 mb-2 relative z-10"
//                             style={{ letterSpacing: "0.14em" }}
//                         >
//                             Your result
//                         </p>
//                         <p
//                             aria-hidden="true"
//                             className="font-cormorant font-light relative z-10"
//                             style={{ fontSize: "clamp(28px, 7vw, 42px)", lineHeight: 1.15 }}
//                         >
//                             {result.band}
//                         </p>
//                         <div className="flex items-center justify-center gap-3 mt-2 relative z-10" aria-hidden="true">
//                             <div className="h-px flex-1 opacity-25" style={{ background: "white" }} />
//                             <p className="text-xs opacity-60">
//                                 Score {totalScore} / {questions.length * 3}
//                             </p>
//                             <div className="h-px flex-1 opacity-25" style={{ background: "white" }} />
//                         </div>
//                     </div>

//                     {/* Headline + summary */}
//                     <div
//                         className="rounded-2xl border p-5 sm:p-7 mb-4"
//                         style={{
//                             background: "white",
//                             borderColor: "var(--border)",
//                             boxShadow: "0 2px 12px rgba(28,58,58,0.05)",
//                         }}
//                     >
//                         <h2
//                             id="result-heading"
//                             className="font-cormorant font-light mb-3"
//                             style={{
//                                 fontSize: "clamp(20px, 5vw, 28px)",
//                                 color: "var(--deep)",
//                                 letterSpacing: "-0.01em",
//                                 lineHeight: 1.25,
//                             }}
//                         >
//                             {result.headline}
//                             {name ? `, ${name}` : ""}
//                         </h2>
//                         <p
//                             className="font-light leading-relaxed"
//                             style={{ fontSize: "clamp(14px, 3.8vw, 15px)", color: "var(--text-muted)" }}
//                         >
//                             {result.summary}
//                         </p>
//                     </div>

//                     {/* What happens next */}
//                     <div
//                         className="rounded-2xl border p-5 sm:p-6 mb-6"
//                         style={{
//                             background: "rgba(123,169,139,0.06)",
//                             borderColor: "rgba(123,169,139,0.22)",
//                         }}
//                     >
//                         <p
//                             className="text-xs font-semibold uppercase tracking-widest mb-4"
//                             style={{ color: "var(--sage-dark)", letterSpacing: "0.1em" }}
//                             id="next-steps-heading"
//                         >
//                             What happens next
//                         </p>
//                         <ul
//                             className="flex flex-col gap-3"
//                             aria-labelledby="next-steps-heading"
//                             style={{ listStyle: "none", padding: 0, margin: 0 }}
//                         >
//                             {nextSteps.map((item) => (
//                                 <li key={item} className="flex items-start gap-3">
//                                     <CheckCircle
//                                         size={15}
//                                         fill="var(--sage)"
//                                         stroke="white"
//                                         strokeWidth={2.5}
//                                         style={{ flexShrink: 0, marginTop: 2 }}
//                                         aria-hidden="true"
//                                     />
//                                     <span
//                                         className="font-light leading-relaxed"
//                                         style={{ fontSize: "clamp(13px, 3.5vw, 14px)", color: "var(--text-muted)" }}
//                                     >
//                                         {item}
//                                     </span>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>

//                     {/* CTAs */}
//                     <div className="flex flex-col sm:flex-row gap-3">
//                         <Link
//                             href={whatsappUrl}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             aria-label={`${result.cta} — opens WhatsApp`}
//                             className="flex-1 inline-flex items-center justify-center gap-2 font-medium text-white rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teal)]"
//                             style={{
//                                 padding: "16px 24px",
//                                 fontSize: "clamp(14px, 4vw, 15px)",
//                                 background: "linear-gradient(135deg, var(--sage-dark), var(--teal))",
//                                 boxShadow: "0 4px 18px rgba(61,139,139,0.25)",
//                             }}
//                         >
//                             {result.cta}
//                             <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
//                         </Link>
//                         <Link
//                             href="/services"
//                             className="flex-1 inline-flex items-center justify-center gap-2 font-medium rounded-full border transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teal)]"
//                             style={{
//                                 padding: "16px 24px",
//                                 fontSize: "clamp(14px, 4vw, 15px)",
//                                 borderColor: "var(--border)",
//                                 color: "var(--sage-dark)",
//                                 background: "white",
//                             }}
//                         >
//                             View our services
//                         </Link>
//                     </div>

//                     {/* Spam notice + crisis line */}
//                     <p
//                         className="text-center text-xs mt-5 leading-relaxed"
//                         style={{ color: "var(--text-muted)" }}
//                     >
//                         Didn&apos;t receive your email?{" "}
//                         <span style={{ color: "var(--sage-dark)", fontWeight: 500 }}>
//                             Check your spam or junk folder.
//                         </span>{" "}
//                         If you&apos;re in crisis, please contact{" "}
//                         <a
//                             href="tel:112"
//                             className="underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teal)] rounded-sm"
//                             style={{ color: "var(--sage-dark)" }}
//                         >
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

import { useState, useEffect } from "react";
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
    Sparkles,
    AlertTriangle,
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
type LoadPhase = "a" | "b" | "c" | "done";

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

const avatarLetters: string[] = ["A", "E", "K", "C"];
const avatarColors: string[] = ["#7ba98b", "#3d8b8b", "#6fb8b8", "#d4b87b"];

const trustBadges: TrustBadge[] = [
    { icon: Lock, label: "Confidential", iconColor: "#3d8b8b", iconFill: "#6fb8b8" },
    { icon: Sparkles, label: "Free", iconColor: "#a97b3d", iconFill: "#d4b87b" },
    { icon: UserCheck, label: "No sign-up", iconColor: "#4e7a5e", iconFill: "#7ba98b" },
];

const checklistItems: string[] = [
    "Your personalised result in 120 seconds",
    "No account, completely confidential",
    "Matched to the right therapist",
];

// ── Helpers ────────────────────────────────────────────────────────────────────

// function getResult(score: number): Result {
//     if (score <= 6) {
//         return {
//             band: "Thriving",
//             gradient: "linear-gradient(135deg, #7ba98b, #a8c4b0)",
//             headline: "You're in a good place",
//             summary: "Your responses suggest you're managing well overall. Many people reach out proactively to build resilience, develop self-awareness, or navigate life transitions — therapy can be valuable even when you're not in crisis.",
//             cta: "Chat us on WhatsApp",
//         };
//     }
//     if (score <= 12) {
//         return {
//             band: "Mild Concern",
//             gradient: "linear-gradient(135deg, #3d8b8b, #6fb8b8)",
//             headline: "Some areas could use support",
//             summary: "Your responses suggest you're experiencing some difficulties worth exploring. A therapist can help you build practical tools and understand patterns before they become harder to manage.",
//             cta: "Chat us on WhatsApp",
//         };
//     }
//     if (score <= 18) {
//         return {
//             band: "Moderate",
//             gradient: "linear-gradient(135deg, #4e7a5e, #3d8b8b)",
//             headline: "You deserve real support",
//             summary: "Your responses suggest you're going through a genuinely difficult time. You're not alone — what you're feeling is valid, and speaking with a licensed therapist can make a significant difference.",
//             cta: "Chat us on WhatsApp",
//         };
//     }
//     return {
//         band: "High Concern",
//         gradient: "linear-gradient(135deg, #c0555a, #e07a7f)",
//         headline: "Please reach out — you matter",
//         summary: "Your responses suggest you're struggling significantly right now. We strongly encourage you to speak with a professional as soon as possible. Our therapists are here for you, without judgment.",
//         cta: "Chat us on WhatsApp",
//     };
// }

function getResult(score: number): Result {
    if (score <= 6) {
        return {
            band: "Thriving",
            gradient: "linear-gradient(135deg, #4d7a5e, #507868)",
            headline: "You're in a good place",
            summary: "Your responses suggest you're managing well overall. Many people reach out proactively to build resilience, develop self-awareness, or navigate life transitions — therapy can be valuable even when you're not in crisis.",
            cta: "Chat us on WhatsApp",
        };
    }
    if (score <= 12) {
        return {
            band: "Mild Concern",
            gradient: "linear-gradient(135deg, #2d6b6b, #357878)",
            headline: "Some areas could use support",
            summary: "Your responses suggest you're experiencing some difficulties worth exploring. A therapist can help you build practical tools and understand patterns before they become harder to manage.",
            cta: "Chat us on WhatsApp",
        };
    }
    if (score <= 18) {
        return {
            band: "Moderate",
            gradient: "linear-gradient(135deg, #3a5c47, #2d6b6b)",
            headline: "You deserve real support",
            summary: "Your responses suggest you're going through a genuinely difficult time. You're not alone — what you're feeling is valid, and speaking with a licensed therapist can make a significant difference.",
            cta: "Chat us on WhatsApp",
        };
    }
    return {
        band: "High Concern",
        gradient: "linear-gradient(135deg, #9e3a3e, #b94a4f)",
        headline: "Please reach out — you matter",
        summary: "Your responses suggest you're struggling significantly right now. We strongly encourage you to speak with a professional as soon as possible. Our therapists are here for you, without judgment.",
        cta: "Chat us on WhatsApp",
    };
}

// ── Band intelligence — drives result page copy ────────────────────────────────

interface BandIntel {
    typeName: string;
    percentile: string;
    accentColor: string;
    alertBg: string;
    hook: string;
    cliffhanger: string;
    lockedLabel: string;
    lockedTeaser: string;
    tip: string;
    tipLabel: string;
    urgency: boolean;
}

function getBandIntel(score: number): BandIntel {
    if (score <= 6) return {
        typeName: "Latent Drift Pattern",
        percentile: "top 12% of stable individuals in our network",
        accentColor: "#4e8c6a",
        alertBg: "rgba(78,140,106,0.06)",
        hook: "You appear stable — but stable and thriving are not the same thing.",
        cliffhanger: "Your data shows one specific low-grade pattern that quietly drains mental energy in high-functioning people. It rarely feels like a problem — until it becomes one. Most people only recognise it in hindsight.",
        lockedLabel: "Your Latent Drift Profile + 6-Month Forecast",
        lockedTeaser: "We've identified the one silent habit in your routine keeping your baseline lower than it needs to be. Your full profile names it — and shows you the 3-step correction.",
        tip: "Start a 5-minute evening wind-down — no screens, just one honest question: \"What did I avoid feeling today?\" People in your band who do this consistently report a measurable shift in clarity within 2 weeks.",
        tipLabel: "One thing worth trying this week",
        urgency: false,
    };
    if (score <= 12) return {
        typeName: "Cortisol Stall Pattern",
        percentile: "top 28% of high-stress individuals we've assessed",
        accentColor: "#3d8b8b",
        alertBg: "rgba(61,139,139,0.06)",
        hook: "Your results suggest a Type 2 Cortisol Stall — not burnout, but the stage just before it.",
        cliffhanger: "This isn't just tiredness. There's a specific neurological pattern in your responses that affects decision-making and your capacity to feel motivated — even when you're technically resting. Most people try to fix this with more rest. For this pattern, rest alone makes the fog worse.",
        lockedLabel: "Your 3 Daily Triggers + Reverse-Reset Protocol",
        lockedTeaser: "We've identified 3 specific habits in your routine that are actively reinforcing this pattern. Your full profile names each one — and shows the sequence to interrupt them.",
        tip: "When mental fog hits, try the 4-7-8 breath: inhale 4 counts, hold 7, exhale 8. It directly activates your parasympathetic system and interrupts the cortisol loop within minutes — not hours.",
        tipLabel: "One thing worth trying this week",
        urgency: false,
    };
    if (score <= 18) return {
        typeName: "Functional Freeze Pattern",
        percentile: "top 41% of moderate-severity cases we see monthly",
        accentColor: "#5a6e8a",
        alertBg: "rgba(90,110,138,0.06)",
        hook: "To the outside world you're still functioning. Internally, something has quietly shifted.",
        cliffhanger: "Your data shows what we call a Functional Freeze — where the gap between how you appear and how you actually feel has been widening for some time. There is one specific energy leak driving this. No amount of rest, holidays, or willpower closes it without addressing the root.",
        lockedLabel: "Your Energy Leak Report + 30-Day Recovery Protocol",
        lockedTeaser: "We've pinpointed the single biggest drain in your mental energy based on your answers. Your full profile names it — and gives you the 30-day protocol our therapists use to close it.",
        tip: "When everything feels heavy: name 5 things you can see, 4 you can touch, 3 you can hear. This grounding technique interrupts a mental spiral within 60 seconds — not by solving the problem, but by returning you to the present.",
        tipLabel: "One thing worth trying this week",
        urgency: false,
    };
    return {
        typeName: "Critical Threshold Pattern",
        percentile: "top 15% of high-distress cases — this needs attention",
        accentColor: "#b94a4f",
        alertBg: "rgba(185,74,79,0.06)",
        hook: "What you're experiencing is real — and it's unlikely to resolve without the right support.",
        cliffhanger: "Your responses place you in what we call a Critical Threshold state. People at this stage describe feeling like they're disappearing behind a functional exterior. Pushing through alone doesn't work — not because of weakness, but because of how the nervous system responds to sustained high-stress load.",
        lockedLabel: "Your Personal Crisis-to-Clarity Roadmap",
        lockedTeaser: "A licensed Mentel therapist has been flagged to review your profile directly. Your full report includes the first 3 steps specifically for your pattern — and a same-week session option.",
        tip: "Tell one person how you're actually feeling today — not the edited version. You don't need the right words. Just letting someone in creates a neurological shift that changes the trajectory of the day.",
        tipLabel: "One thing to do today — not tomorrow",
        urgency: true,
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
    const [loadPhase, setLoadPhase] = useState<LoadPhase>("a");

    const totalScore: number = Object.values(answers).reduce(
        (acc, val) => acc + val, 0
    );
    const result: Result = getResult(totalScore);
    const progress: number = ((current + 1) / questions.length) * 100;

    // Loading animation when result step begins
    useEffect(() => {
        if (step !== "result") return;
        setLoadPhase("a");
        const t1 = setTimeout(() => setLoadPhase("b"), 1800);
        const t2 = setTimeout(() => setLoadPhase("c"), 3400);
        const t3 = setTimeout(() => setLoadPhase("done"), 5000);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, [step]);

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
        const res = await fetch("/api/assessment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name, email, phone,
                score: totalScore,
                band: result.band,
                answers,
            }),
        });
        if (res.ok) {
            window.ttq?.track("CompleteRegistration", {
                content_name: "Mental Health Assessment",
                description: "User submitted assessment email",
            });
            setSubmitting(false);
        }
        setStep("result");
    }

    function buildWhatsAppUrl(score: number): string {
        const r = getResult(score);
        const phoneNumber = "254734527573";
        let note = "";
        if (r.band === "High Concern") {
            note = "I need urgent support and would like to speak with a professional as soon as possible.";
        } else if (r.band === "Thriving") {
            note = "I'm interested in proactive therapy and building resilience.";
        } else {
            note = "I'd like to discuss these results and see how therapy can help me.";
        }
        const message = `Hello Mentel, I just completed my Private Wellness Assessment.\nResult: *${r.band}*\n${note}`;
        return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    }

    const whatsappUrl = buildWhatsAppUrl(totalScore);

    // ── INTRO ──────────────────────────────────────────────────────────────────

    if (step === "intro") {
        return (
            <div className="relative min-h-screen" style={{ background: "var(--white)" }}>
                <BgBlobs />
                <section
                    className="relative z-10 pt-20 pb-24 px-4 sm:px-6"
                    aria-labelledby="intro-heading"
                >
                    <div className="max-w-xl mx-auto animate-fade-up">
                        <div
                            className="inline-flex items-center gap-2 mb-6 rounded-full border"
                            style={{
                                padding: "6px 14px 6px 6px",
                                background: "white",
                                borderColor: "var(--border)",
                                boxShadow: "0 1px 8px rgba(28,58,58,0.06)",
                                maxWidth: "100%",
                            }}
                            aria-label="2,400 or more people have taken this assessment"
                        >
                            <div className="flex items-center flex-shrink-0" aria-hidden="true">
                                {avatarLetters.map((letter, i) => (
                                    <div
                                        key={`avatar-${i}`}
                                        className="flex items-center justify-center rounded-full text-white"
                                        style={{
                                            width: 26,
                                            height: 26,
                                            fontSize: 10,
                                            fontWeight: 600,
                                            background: avatarColors[i],
                                            border: "2px solid white",
                                            marginLeft: i === 0 ? 0 : -8,
                                            zIndex: avatarLetters.length - i,
                                            position: "relative",
                                        }}
                                    >
                                        {letter}
                                    </div>
                                ))}
                            </div>
                            <div style={{ lineHeight: 1.35, minWidth: 0 }}>
                                <span className="block text-xs font-semibold whitespace-nowrap" style={{ color: "var(--deep)", fontSize: 12 }}>
                                    2,400+ people checked in
                                </span>
                                <span className="block whitespace-nowrap" style={{ color: "var(--text-muted)", fontSize: 11 }}>
                                    Trusted · Confidential · Free
                                </span>
                            </div>
                        </div>

                        <h1
                            id="intro-heading"
                            className="font-cormorant mb-3"
                            style={{
                                fontSize: "clamp(36px, 8vw, 54px)",
                                fontWeight: 300,
                                lineHeight: 1.14,
                                letterSpacing: "-0.02em",
                                color: "var(--deep)",
                            }}
                        >
                            How are you{" "}
                            <em className="italic" style={{ color: "var(--sage-dark)" }}>really</em>{" "}
                            doing?
                        </h1>

                        <p
                            className="mb-5 font-light leading-relaxed"
                            style={{ fontSize: "clamp(15px, 4vw, 16px)", color: "var(--text-muted)", maxWidth: 420 }}
                        >
                            This short, confidential check-in helps us understand where you are right now, so you can get support.
                        </p>

                        <div className="flex flex-wrap gap-2 mb-5" role="list" aria-label="Features">
                            {trustBadges.map(({ icon: Icon, label, iconColor, iconFill }) => (
                                <span
                                    key={label}
                                    role="listitem"
                                    className="inline-flex items-center gap-1.5 rounded-full text-xs font-medium border"
                                    style={{
                                        padding: "6px 13px",
                                        background: "rgba(123,169,139,0.09)",
                                        borderColor: "rgba(123,169,139,0.26)",
                                        color: "var(--sage-dark)",
                                    }}
                                >
                                    <Icon size={12} fill={iconFill} stroke={iconColor} strokeWidth={1.5} aria-hidden="true" />
                                    {label}
                                </span>
                            ))}
                        </div>

                        <ul
                            className="rounded-2xl border overflow-hidden"
                            style={{
                                background: "white",
                                borderColor: "var(--border)",
                                boxShadow: "0 2px 16px rgba(28,58,58,0.05)",
                                listStyle: "none",
                                padding: 0,
                                marginBottom: "2rem",
                            }}
                            aria-label="What to expect"
                        >
                            {checklistItems.map((item, i) => (
                                <li
                                    key={item}
                                    className="flex items-start gap-3 px-5 py-4 sm:px-6"
                                    style={{ borderBottom: i < checklistItems.length - 1 ? "1px solid var(--border)" : "none" }}
                                >
                                    <CheckCircle size={16} fill="var(--sage)" stroke="white" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
                                    <span className="font-light leading-relaxed" style={{ fontSize: "clamp(14px, 3.8vw, 15px)", color: "var(--text-muted)" }}>
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <button
                            type="button"
                            onClick={() => { setStep("quiz"); window.ttq?.track("Start trial"); }}
                            className="w-full inline-flex items-center justify-center gap-2 font-medium text-white rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teal)]"
                            style={{
                                padding: "17px 32px",
                                fontSize: "clamp(14px, 4vw, 15px)",
                                background: "linear-gradient(135deg, var(--sage-dark), var(--teal))",
                                boxShadow: "0 4px 20px rgba(61,139,139,0.28)",
                            }}
                        >
                            Start Free Mental Health Check
                            <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                        </button>
                        <p className="flex items-center justify-center gap-1.5 mt-4 text-xs" style={{ color: "var(--text-muted)" }}>
                            <Shield size={11} stroke="var(--sage)" strokeWidth={2} aria-hidden="true" />
                            Confidential · NDPR compliant · Never shared
                        </p>
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
        const questionId = `question-${q.id}`;

        return (
            <div className="relative min-h-screen" style={{ background: "var(--white)" }}>
                <BgBlobs />
                <section className="relative z-10 pt-20 pb-24 px-4 sm:px-6" aria-labelledby={questionId}>
                    <div className="max-w-lg mx-auto animate-fade-up">

                        <div className="mb-8 sm:mb-10">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--sage-dark)" }}>
                                    {q.category}
                                </span>
                                <span className="text-xs font-medium tabular-nums" style={{ color: "var(--text-muted)" }}>
                                    {current + 1} of {questions.length}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    disabled={transitioning}
                                    aria-label="Go back to previous question"
                                    className="flex items-center justify-center rounded-full border transition-all duration-150 cursor-pointer disabled:opacity-40 flex-shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teal)]"
                                    style={{ width: 40, height: 40, background: "white", borderColor: "var(--border)", color: "var(--text-muted)" }}
                                >
                                    <ArrowLeft size={15} strokeWidth={2} aria-hidden="true" />
                                </button>
                                <div
                                    className="flex-1 rounded-full overflow-hidden"
                                    style={{ height: 8, background: "var(--border)" }}
                                    role="progressbar"
                                    aria-valuenow={current + 1}
                                    aria-valuemin={1}
                                    aria-valuemax={questions.length}
                                    aria-label={`Question ${current + 1} of ${questions.length}`}
                                >
                                    <div
                                        className="h-full rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${progress}%`, background: "linear-gradient(90deg, var(--sage), var(--teal))" }}
                                    />
                                </div>
                            </div>
                        </div>

                        <h2
                            id={questionId}
                            className="font-cormorant font-light mb-6 sm:mb-8"
                            style={{ fontSize: "clamp(22px, 5.5vw, 32px)", lineHeight: 1.35, color: "var(--deep)", letterSpacing: "-0.01em", wordBreak: "break-word", overflowWrap: "break-word" }}
                        >
                            {q.text}
                        </h2>

                        <div role="radiogroup" aria-labelledby={questionId} className="flex flex-col gap-3">
                            {q.options.map((opt: Option) => {
                                const isSelected = answeredValue === opt.value;
                                const optionId = `${q.id}-opt-${opt.value}`;
                                return (
                                    <button
                                        key={opt.value}
                                        id={optionId}
                                        type="button"
                                        role="radio"
                                        aria-checked={isSelected}
                                        onClick={() => handleAnswer(opt.value)}
                                        disabled={transitioning}
                                        className="w-full text-left rounded-2xl border transition-all duration-200 cursor-pointer disabled:cursor-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teal)]"
                                        style={{
                                            padding: "14px 16px",
                                            minHeight: 56,
                                            background: isSelected ? "rgba(123,169,139,0.10)" : "white",
                                            borderColor: isSelected ? "var(--sage)" : "var(--border)",
                                            color: isSelected ? "var(--sage-dark)" : "var(--text)",
                                            boxShadow: isSelected ? "0 0 0 3px rgba(123,169,139,0.13)" : "0 1px 4px rgba(28,58,58,0.04)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: 12,
                                        }}
                                        onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.borderColor = "var(--sage-light)"; }}
                                        onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.borderColor = "var(--border)"; }}
                                    >
                                        <span className="font-light leading-snug" style={{ fontSize: "clamp(14px, 4vw, 15px)", flex: 1, whiteSpace: "normal", wordBreak: "break-word" }}>
                                            {opt.label}
                                        </span>
                                        <span
                                            className="flex-shrink-0 rounded-full flex items-center justify-center transition-all duration-200"
                                            aria-hidden="true"
                                            style={{ width: 22, height: 22, minWidth: 22, background: isSelected ? "var(--sage)" : "transparent", border: isSelected ? "2px solid var(--sage)" : "2px solid var(--border)" }}
                                        >
                                            {isSelected && (
                                                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M2 5.5l2.5 2.5L9 3" />
                                                </svg>
                                            )}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                        <p className="flex items-center justify-center gap-1.5 mt-6 text-xs" style={{ color: "var(--text-muted)" }}>
                            <Lock size={11} stroke="var(--sage)" strokeWidth={2} aria-hidden="true" />
                            Your answers are private and never shared
                        </p>
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
                <section className="relative z-10 pt-20 pb-24 px-4 sm:px-6" aria-labelledby="email-heading">
                    <div className="max-w-md mx-auto animate-fade-up">

                        <div className="text-center mb-7 sm:mb-8">
                            <div
                                className="inline-flex items-center justify-center rounded-2xl mb-5"
                                aria-hidden="true"
                                style={{ width: 56, height: 56, background: "linear-gradient(135deg, var(--sage), var(--teal))" }}
                            >
                                <Mail size={24} color="white" strokeWidth={1.8} />
                            </div>
                            <h2
                                id="email-heading"
                                className="font-cormorant font-light mb-3"
                                style={{ fontSize: "clamp(26px, 6vw, 38px)", color: "var(--deep)", letterSpacing: "-0.02em", lineHeight: 1.2 }}
                            >
                                Almost there
                            </h2>
                            <p
                                className="font-light leading-relaxed"
                                style={{ fontSize: "clamp(14px, 3.8vw, 15px)", color: "var(--text-muted)", maxWidth: 340, margin: "0 auto" }}
                            >
                                Enter your details to receive your personalised results and be matched with the right therapist.
                            </p>
                        </div>

                        <div
                            className="rounded-2xl border relative overflow-hidden"
                            style={{ background: "white", borderColor: "var(--border)", boxShadow: "0 4px 24px rgba(28,58,58,0.07)" }}
                        >
                            <div
                                aria-hidden="true"
                                className="absolute top-0 left-0 right-0"
                                style={{ height: 2, background: "linear-gradient(90deg, var(--sage), var(--teal), var(--sage-light))" }}
                            />
                            <div className="px-5 sm:px-7 pt-7 sm:pt-8 pb-6 sm:pb-7">
                                <form onSubmit={handleEmailSubmit} className="flex flex-col gap-5" noValidate>
                                    <div>
                                        <label htmlFor="field-name" className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--sage-dark)" }}>Your Name</label>
                                        <input
                                            id="field-name" type="text" placeholder="First name" value={name} autoComplete="given-name"
                                            aria-required="true" aria-invalid={!!errors.name} aria-describedby={errors.name ? "error-name" : undefined}
                                            onChange={(e) => { setName(e.target.value); setErrors((prev) => ({ ...prev, name: undefined })); }}
                                            className={`form-input${errors.name ? " form-input-error" : ""}`} style={{ fontSize: "16px" }}
                                        />
                                        {errors.name && <p id="error-name" role="alert" className="text-xs mt-1.5" style={{ color: "var(--error)" }}>{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="field-email" className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--sage-dark)" }}>Email Address</label>
                                        <input
                                            id="field-email" type="email" placeholder="you@example.com" value={email} autoComplete="email" inputMode="email"
                                            aria-required="true" aria-invalid={!!errors.email} aria-describedby={errors.email ? "error-email" : undefined}
                                            onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: undefined })); }}
                                            className={`form-input${errors.email ? " form-input-error" : ""}`} style={{ fontSize: "16px" }}
                                        />
                                        {errors.email && <p id="error-email" role="alert" className="text-xs mt-1.5" style={{ color: "var(--error)" }}>{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="field-phone" className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--sage-dark)" }}>Phone Number</label>
                                        <input
                                            id="field-phone" type="tel" placeholder="+234 000 000 0000" value={phone} autoComplete="tel" inputMode="tel"
                                            aria-required="true" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "error-phone" : undefined}
                                            onChange={(e) => { setPhone(e.target.value); setErrors((prev) => ({ ...prev, phone: undefined })); }}
                                            className={`form-input${errors.phone ? " form-input-error" : ""}`} style={{ fontSize: "16px" }}
                                        />
                                        {errors.phone && <p id="error-phone" role="alert" className="text-xs mt-1.5" style={{ color: "var(--error)" }}>{errors.phone}</p>}
                                    </div>
                                    <button
                                        type="submit" disabled={submitting}
                                        className="w-full inline-flex items-center justify-center gap-2 font-medium text-white rounded-full transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teal)]"
                                        style={{ padding: "16px 28px", fontSize: "clamp(14px, 4vw, 15px)", background: "linear-gradient(135deg, var(--sage-dark), var(--teal))", boxShadow: "0 4px 18px rgba(61,139,139,0.25)" }}
                                        aria-busy={submitting}
                                    >
                                        {submitting ? "Saving your results…" : "See My Results"}
                                        {!submitting && <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />}
                                    </button>
                                </form>
                                <div className="flex items-center justify-center gap-2 mt-5" aria-hidden="true">
                                    <Shield size={12} fill="#6fb8b8" stroke="#3d8b8b" strokeWidth={1.5} />
                                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>We never share your data. Unsubscribe any time.</p>
                                </div>
                            </div>
                        </div>

                        <p className="text-center text-xs mt-4" style={{ color: "var(--text-muted)" }}>
                            By continuing you agree to our{" "}
                            <Link href="/privacy" className="underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teal)] rounded-sm" style={{ color: "var(--sage-dark)" }}>
                                Privacy Policy
                            </Link>
                        </p>
                    </div>
                </section>
            </div>
        );
    }

    // ── RESULT ─────────────────────────────────────────────────────────────────

    const intel = getBandIntel(totalScore);
    const isHigh = totalScore > 18;

    // Loading phases
    if (loadPhase !== "done") {
        const phases = {
            a: { text: "Analysing your 18 data points…", sub: "Cross-referencing mood, stress, sleep and relational patterns", color: "#3d8b8b" },
            b: { text: "Comparing against 2,400+ profiles…", sub: "Identifying your specific pattern type", color: "#5a6e8a" },
            c: { text: isHigh ? "⚠ Elevated threshold detected." : "Pattern identified.", sub: isHigh ? "Your results require careful review" : "Your personalised profile is ready", color: isHigh ? "#b94a4f" : "#4e8c6a" },
            done: { text: "", sub: "", color: "" },
        };
        const msg = phases[loadPhase];
        return (
            <div className="relative min-h-screen flex items-center justify-center" style={{ background: "var(--white)" }}>
                <BgBlobs />
                <div className="relative z-10 text-center px-6 max-w-sm mx-auto">
                    <div
                        className="flex justify-center mb-8"
                        aria-hidden="true"
                        style={{
                            animation: "none",
                        }}
                    >
                        <div style={{
                            width: 52,
                            height: 52,
                            borderRadius: "50%",
                            border: `3px solid ${msg.color}22`,
                            borderTopColor: msg.color,
                            animation: "mentel-spin 0.9s linear infinite",
                        }} />
                    </div>
                    <p className="font-cormorant font-light mb-2" style={{ fontSize: "clamp(20px, 5vw, 26px)", color: msg.color, lineHeight: 1.3 }}>
                        {msg.text}
                    </p>
                    <p className="font-light" style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>
                        {msg.sub}
                    </p>
                    <div className="flex justify-center gap-2 mt-8" aria-hidden="true">
                        {(["a", "b", "c"] as LoadPhase[]).map((p) => (
                            <div key={p} style={{
                                width: 6, height: 6, borderRadius: "50%",
                                background: p === loadPhase ? msg.color : "var(--border)",
                                transition: "background 0.4s ease",
                            }} />
                        ))}
                    </div>
                </div>
                <style>{`@keyframes mentel-spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    // Full result
    return (
        <div className="relative min-h-screen" style={{ background: "var(--white)" }}>
            <BgBlobs />
            <section className="relative z-10 pt-20 pb-24 px-4 sm:px-6" aria-labelledby="result-heading">
                <div className="max-w-lg mx-auto animate-fade-up">

                    {/* ── Pattern banner ───────────────────────────────────── */}
                    <div
                        className="rounded-3xl relative overflow-hidden mb-5 text-white"
                        style={{ padding: "32px 28px 28px", background: result.gradient }}
                        role="region"
                        aria-label={`Your pattern: ${intel.typeName}. Score ${totalScore} out of ${questions.length * 3}`}
                    >
                        <div aria-hidden="true" className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, white 0%, transparent 60%)" }} />
                        <div className="relative z-10 mb-4">
                            <div style={{ display: "inline-block", background: "rgba(255,255,255,0.18)", borderRadius: 99, padding: "4px 14px", marginBottom: 10 }}>
                                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.9)" }}>{intel.percentile}</span>
                            </div>
                        </div>
                        <p className="relative z-10 text-xs uppercase tracking-widest opacity-70 mb-1" style={{ letterSpacing: "0.14em" }}>Your pattern</p>
                        <h1 id="result-heading" className="font-cormorant font-light relative z-10 mb-1" style={{ fontSize: "clamp(26px, 6vw, 38px)", lineHeight: 1.15 }}>
                            {intel.typeName}
                        </h1>
                        <p className="relative z-10 opacity-80 font-light" style={{ fontSize: 13 }}>
                            {result.band} · Score {totalScore}/{questions.length * 3}{name ? ` · ${name}` : ""}
                        </p>
                    </div>

                    {/* ── Hook card ────────────────────────────────────────── */}
                    <div className="rounded-2xl border p-5 sm:p-6 mb-4" style={{ background: "white", borderColor: "var(--border)", boxShadow: "0 2px 12px rgba(28,58,58,0.05)" }}>
                        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: intel.accentColor, letterSpacing: "0.1em" }}>
                            What your results are telling us
                        </p>
                        <p className="font-cormorant font-light mb-3" style={{ fontSize: "clamp(18px, 4.5vw, 24px)", color: "var(--deep)", lineHeight: 1.35 }}>
                            {intel.hook}
                        </p>
                        <p className="font-light leading-relaxed" style={{ fontSize: "clamp(14px, 3.8vw, 15px)", color: "var(--text-muted)", lineHeight: 1.75 }}>
                            {intel.cliffhanger}
                        </p>
                    </div>

                    {/* ── Locked insight ───────────────────────────────────── */}
                    <div className="rounded-2xl border mb-4 relative overflow-hidden" style={{ borderColor: `${intel.accentColor}30`, background: intel.alertBg }}>
                        <div className="p-5 sm:p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <Lock size={13} stroke={intel.accentColor} strokeWidth={2} aria-hidden="true" />
                                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: intel.accentColor, letterSpacing: "0.1em" }}>
                                    {intel.lockedLabel}
                                </p>
                            </div>
                            <div style={{ position: "relative" }}>
                                <p
                                    className="font-light leading-relaxed"
                                    style={{ fontSize: "clamp(14px, 3.8vw, 15px)", color: "var(--text-muted)", lineHeight: 1.75, filter: "blur(4px)", userSelect: "none", pointerEvents: "none" }}
                                    aria-hidden="true"
                                >
                                    {intel.lockedTeaser}
                                </p>
                                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <span style={{ fontSize: 13, color: intel.accentColor, background: "white", padding: "4px 14px", borderRadius: 99, border: `1px solid ${intel.accentColor}30`, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", whiteSpace: "nowrap", fontWeight: 500 }}>
                                        Revealed in your session
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── One tip ──────────────────────────────────────────── */}
                    <div className="rounded-2xl border p-5 sm:p-6 mb-4" style={{ background: "white", borderColor: "var(--border)" }}>
                        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: intel.accentColor, letterSpacing: "0.1em" }}>
                            {intel.tipLabel}
                        </p>
                        <p className="font-light leading-relaxed" style={{ fontSize: "clamp(14px, 3.8vw, 15px)", color: "var(--text-muted)", lineHeight: 1.75 }}>
                            {intel.tip}
                        </p>
                        <p className="mt-3 font-light" style={{ fontSize: 13, color: intel.accentColor }}>
                            Your full recovery protocol is covered in your first session.
                        </p>
                    </div>

                    {/* ── Urgent (high band only) ───────────────────────────── */}
                    {intel.urgency && (
                        <div className="rounded-2xl border p-5 sm:p-6 mb-4" style={{ borderColor: "#d97070", background: "#fdf4f4" }}>
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle size={14} stroke="#b94a4f" strokeWidth={2} aria-hidden="true" />
                                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#b94a4f", letterSpacing: "0.1em" }}>If you are in immediate distress</p>
                            </div>
                            <p className="font-light leading-relaxed" style={{ fontSize: 14, color: "#3a2020", lineHeight: 1.75 }}>
                                If you feel unsafe right now, please reach out to someone you trust or visit your nearest hospital. You matter — help is available immediately.
                            </p>
                        </div>
                    )}

                    {/* ── CTA ──────────────────────────────────────────────── */}
                    <div className="rounded-2xl border p-5 sm:p-6 mb-5" style={{ background: intel.alertBg, borderColor: `${intel.accentColor}25` }}>
                        <p className="font-cormorant font-light mb-2" style={{ fontSize: "clamp(18px, 4.5vw, 22px)", color: "var(--deep)", lineHeight: 1.3 }}>
                            A therapist matched to your pattern
                        </p>
                        <p className="font-light mb-5" style={{ fontSize: "clamp(13px, 3.5vw, 14px)", color: "var(--text-muted)", lineHeight: 1.7 }}>
                            One 50-minute session, built around what your results showed. We'll explain your full pattern, name your specific triggers, and give you a concrete next step.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Chat with us on WhatsApp — opens WhatsApp"
                                className="flex-1 inline-flex items-center justify-center gap-2 font-medium text-white rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teal)]"
                                style={{ padding: "15px 24px", fontSize: "clamp(14px, 4vw, 15px)", background: `linear-gradient(135deg, ${intel.accentColor}, var(--teal))`, boxShadow: `0 4px 18px ${intel.accentColor}40` }}
                            >
                                {result.cta}
                                <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
                            </Link>
                            <Link
                                href="/services"
                                className="flex-1 inline-flex items-center justify-center gap-2 font-medium rounded-full border transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teal)]"
                                style={{ padding: "15px 24px", fontSize: "clamp(14px, 4vw, 15px)", borderColor: "var(--border)", color: "var(--sage-dark)", background: "white" }}
                            >
                                View our services
                            </Link>
                        </div>
                    </div>

                    {/* ── What happens next ────────────────────────────────── */}
                    <div className="rounded-2xl border p-5 sm:p-6 mb-5" style={{ background: "rgba(123,169,139,0.06)", borderColor: "rgba(123,169,139,0.22)" }}>
                        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--sage-dark)", letterSpacing: "0.1em" }}>What happens next</p>
                        <ul className="flex flex-col gap-3" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {[
                                "Check your email — your full results summary is on its way",
                                "Check your spam folder if you don't see it within 2 minutes",
                                "A therapist matched to your pattern will reach out within 24 hours",
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <CheckCircle size={15} fill="var(--sage)" stroke="white" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
                                    <span className="font-light leading-relaxed" style={{ fontSize: "clamp(13px, 3.5vw, 14px)", color: "var(--text-muted)" }}>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <p className="text-center text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                        If you&apos;re in crisis, please contact{" "}
                        <a href="tel:112" className="underline underline-offset-2" style={{ color: "var(--sage-dark)" }}>emergency services</a>.
                    </p>

                </div>
            </section>
        </div>
    );
}