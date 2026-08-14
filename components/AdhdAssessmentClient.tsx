

// "use client";

// import { useState, useEffect, useRef, useCallback, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";
// import {
//     ArrowRight,
//     Mail,
//     Shield,
//     Lock,
//     Brain,
//     Menu,
//     X,
//     Loader2,
//     Clock,
//     CheckCircle2,
// } from "lucide-react";
// import { questions, domainMeta, TOTAL_QUESTIONS } from "@/lib/adhd/questions";
// import { scoreAssessment } from "@/lib/adhd/scoring";
// import { SocialProofBar, AsSeenOn, ClinicalTrustBar, TrustSection, Testimonials } from "@/components/adhd/TrustAndProof";
// import { socialProofStats, testimonials, pressOutlets, clinicallyReviewed, hipaaAligned } from "@/lib/adhd/social-proof-config";
// import { analytics } from "@/lib/analytics/client";

// // ── Constants ─────────────────────────────────────────────────────────────────

// const STORAGE_KEY = "mentel_adhd_assessment_v1";
// // Separate from STORAGE_KEY above on purpose: STORAGE_KEY tracks in-progress
// // quiz answers and gets cleared the moment the quiz finishes. This one
// // tracks a *completed* assessment that hasn't been paid for yet, so someone
// // who finishes the quiz, sees their free results, and closes the tab
// // without paying can come back later (even days later, this is
// // localStorage, not sessionStorage, so it survives closing the tab/browser)
// // and pick up exactly where they left off instead of retaking the whole
// // 20-question quiz.
// export const COMPLETED_STORAGE_KEY = "mentel_adhd_completed_v1";
// const SECONDS_PER_QUESTION = 11; // used only for the estimated-time display

// type Step = "intro" | "quiz" | "contact" | "analysing";
// type LoadPhase = number; // index into analysingSteps below

// const analysingSteps = [
//     "Reviewing attention patterns",
//     "Analyzing executive function",
//     "Comparing symptom domains",
//     "Building recommendations",
//     "Generating report",
//     "Preparing PDF",
// ];

// interface FormErrors { name?: string; email?: string; phone?: string; }

// interface SavedState {
//     current: number;
//     answers: Record<string, number>;
//     savedAt: number;
// }

// // interface CompletedPointer {
// //     leadId: string;
// //     name: string;
// //     completedAt: number;
// // }
// export interface CompletedPointer {
//     leadId?: string | undefined;
//     name?: string | undefined;
//     txRef?: string | undefined;
//     status?: string | undefined;
//     transactionId?: string | null;
//     completedAt?: number | undefined;

// }

// // ── Storage helpers ──────────────────────────────────────────────────────────

// function loadSaved(): SavedState | null {
//     if (typeof window === "undefined") return null;
//     try {
//         const raw = window.localStorage.getItem(STORAGE_KEY);
//         if (!raw) return null;
//         const parsed = JSON.parse(raw) as SavedState;
//         if (!parsed || typeof parsed.current !== "number") return null;
//         return parsed;
//     } catch {
//         return null;
//     }
// }

// function persist(state: SavedState) {
//     try {
//         window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
//     } catch {
//         // best-effort autosave only — never block the UX on storage failures
//     }
// }

// function clearSaved() {
//     try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
// }

// export function loadCompletedPointer(): CompletedPointer | null {
//     if (typeof window === "undefined") return null;
//     try {
//         const raw = window.localStorage.getItem(COMPLETED_STORAGE_KEY);
//         if (!raw) return null;
//         const parsed = JSON.parse(raw) as CompletedPointer;
//         if (!parsed || !parsed.leadId) return null;
//         return parsed;
//     } catch {
//         return null;
//     }
// }

// export function persistCompletedPointer(pointer: CompletedPointer) {
//     try {
//         window.localStorage.setItem(COMPLETED_STORAGE_KEY, JSON.stringify(pointer));
//     } catch {
//         // best-effort only, worst case they just retake the assessment
//     }
// }

// function clearCompletedPointer() {
//     try { window.localStorage.removeItem(COMPLETED_STORAGE_KEY); } catch { /* noop */ }
// }

// // Encouraging microcopy shown at a few milestones during the quiz, not on
// // every question, per the brief: acknowledge progress without being noisy.
// function microcopyFor(current: number, total: number): string | null {
//     const quarter = Math.round(total * 0.25);
//     const half = Math.round(total * 0.5);
//     const threeQuarter = Math.round(total * 0.75);
//     if (current === quarter) return "Thanks, this helps us build a more accurate picture.";
//     if (current === half) return "You're halfway there.";
//     if (current === threeQuarter) return "Just a few more questions.";
//     return null;
// }

// // ── Nav ───────────────────────────────────────────────────────────────────────

// function AdhdNav() {
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
//                     : "bg-transparent"}`}
//                 aria-label="Site navigation"
//             >
//                 <div className="max-w-[1100px] mx-auto px-6 h-[68px] flex items-center justify-between">
//                     <Link href="/" className="flex items-center gap-2.5 no-underline" aria-label="Mentel — home">
//                         <div className="w-8 h-8 rounded-[10px] flex items-center justify-center overflow-hidden">
//                             <Image src="/logo-assessment.png" alt="Mentel logo" width={32} height={32} className="object-cover" />
//                         </div>
//                         <span className="font-['Cormorant_Garamond',Georgia,serif] text-[22px] font-semibold tracking-[-0.02em] text-[#1c2820]">
//                             Mentel
//                         </span>
//                     </Link>
//                     <div className="hidden md:flex items-center gap-8">
//                         <Link href="/about" className="text-sm font-[450] text-[#4a5a52] no-underline tracking-[0.01em] hover:text-[#1c2820] transition-colors">About</Link>
//                         <Link href="/services" className="text-sm font-[450] text-[#4a5a52] no-underline tracking-[0.01em] hover:text-[#1c2820] transition-colors">Services</Link>
//                         <Link href="/book" className="text-[13px] font-medium text-white bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] px-5 py-2.5 rounded-full no-underline shadow-[0_2px_12px_rgba(30,107,107,0.25)] hover:opacity-90 transition-opacity">
//                             Book a session
//                         </Link>
//                     </div>
//                     <button type="button" onClick={() => setMenuOpen((v) => !v)}
//                         aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}
//                         className="md:hidden bg-transparent border-0 cursor-pointer p-2 text-[#1c2820]">
//                         {menuOpen ? <X size={22} /> : <Menu size={22} />}
//                     </button>
//                 </div>
//                 {menuOpen && (
//                     <div className="md:hidden bg-[rgba(250,249,246,0.98)] backdrop-blur-xl border-t border-[rgba(28,40,36,0.08)] px-6 pt-4 pb-6">
//                         <Link href="/about" className="block py-3 text-base text-[#1c2820] no-underline border-b border-[rgba(28,40,36,0.06)]" onClick={() => setMenuOpen(false)}>About</Link>
//                         <Link href="/services" className="block py-3 text-base text-[#1c2820] no-underline" onClick={() => setMenuOpen(false)}>Services</Link>
//                         <Link href="/book" className="block mt-4 text-center text-sm font-medium text-white bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] py-3.5 px-5 rounded-full no-underline" onClick={() => setMenuOpen(false)}>Book a session</Link>
//                     </div>
//                 )}
//             </nav>

//             <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,450;9..40,500;9..40,600&display=swap');
//         *, *::before, *::after { box-sizing: border-box; }
//         body { font-family: 'DM Sans', -apple-system, sans-serif; background: #faf9f6; -webkit-font-smoothing: antialiased; overscroll-behavior-y: contain; }
//         @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
//         @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
//         @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
//         @keyframes spin { to { transform: rotate(360deg); } }
//         @keyframes slideInRight { from { opacity: 0; transform: translateX(28px); } to { opacity: 1; transform: translateX(0); } }
//         @keyframes slideOutLeft { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(-28px); } }
//         @keyframes pulseRing { 0% { box-shadow: 0 0 0 0 rgba(45,122,90,0.35); } 100% { box-shadow: 0 0 0 10px rgba(45,122,90,0); } }
//         .fade-up { animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both; }
//         .fade-in { animation: fadeIn 0.4s ease both; }
//         .q-enter { animation: slideInRight 0.32s cubic-bezier(0.22,1,0.36,1) both; }
//         .q-exit { animation: slideOutLeft 0.22s cubic-bezier(0.4,0,1,1) both; }
//         .option-btn { transition: all 0.18s cubic-bezier(0.22,1,0.36,1); }
//         .option-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(45,122,90,0.12) !important; border-color: #2d7a5a !important; }
//         .option-btn:active:not(:disabled) { transform: scale(0.99); }
//         .option-btn.selected { animation: pulseRing 0.5s ease-out; }
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
//         kbd { font-family: 'DM Sans', sans-serif; }
//       `}</style>
//         </>
//     );
// }

// function PageWrapper({ children }: { children: React.ReactNode }) {
//     return (
//         <div className="min-h-screen bg-[#faf9f6] font-['DM_Sans',sans-serif]">
//             <AdhdNav />
//             {children}
//         </div>
//     );
// }

// // ── Main ──────────────────────────────────────────────────────────────────────

// export default function AdhdAssessmentPage() {
//     const router = useRouter();
//     const [step, setStep] = useState<Step>("intro");
//     const [current, setCurrent] = useState(0);
//     const [answers, setAnswers] = useState<Record<string, number>>({});
//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [phone, setPhone] = useState("");
//     const [errors, setErrors] = useState<FormErrors>({});
//     const [submitting, setSubmitting] = useState(false);
//     const [transitioning, setTransitioning] = useState(false);
//     const [selectedOption, setSelectedOption] = useState<number | null>(null);
//     const [loadPhase, setLoadPhase] = useState<LoadPhase>(0);
//     const [resumeAvailable, setResumeAvailable] = useState<SavedState | null>(null);
//     const [completedAvailable, setCompletedAvailable] = useState<CompletedPointer | null>(null);
//     const transitioningRef = useRef(false);
//     const cardRef = useRef<HTMLDivElement>(null);

//     const progress = ((current + (selectedOption !== null ? 1 : 0)) / TOTAL_QUESTIONS) * 100;
//     const remainingSeconds = Math.max(0, (TOTAL_QUESTIONS - current) * SECONDS_PER_QUESTION);
//     const remainingLabel = remainingSeconds < 60
//         ? `About ${remainingSeconds}s left`
//         : `About ${Math.ceil(remainingSeconds / 60)} min left`;

//     // Check for a resumable in-progress quiz, or a completed-but-unpaid
//     // assessment, on mount. These are mutually exclusive in practice (the
//     // quiz-progress pointer is cleared the moment the quiz finishes, right
//     // before the completed pointer gets written), so at most one of these
//     // banners shows.
//     useEffect(() => {
//         const saved = loadSaved();
//         if (saved && Object.keys(saved.answers).length > 0 && saved.current < TOTAL_QUESTIONS) {
//             setResumeAvailable(saved);
//             return;
//         }
//         const completed = loadCompletedPointer();
//         if (completed) setCompletedAvailable(completed);
//         console.log("Completed", completed)
//     }, []);

//     // Autosave on every answer change
//     useEffect(() => {
//         if (step !== "quiz") return;
//         if (Object.keys(answers).length === 0) return;
//         persist({ current, answers, savedAt: Date.now() });
//     }, [answers, current, step]);

//     // ── Auto-scroll: keep the current question centered in view ──────────────
//     // Runs every time `current` (the question index) changes. This is what
//     // makes the quiz feel "guided" instead of like a form: the user never has
//     // to manually scroll to find the next question, it's already centered
//     // for them by the time the new question card finishes animating in.
//     //
//     // How it works:
//     // 1. `setSelectedOption(null)` clears the previous question's selected-
//     //    answer highlight so the new question starts unselected.
//     // 2. The 40ms `setTimeout` is a deliberate small delay, not arbitrary.
//     //    Without it, `scrollIntoView` can measure the outgoing (still-
//     //    animating-out) card's position instead of the new card's, since the
//     //    DOM update and the CSS exit/enter animation aren't perfectly
//     //    synchronous. 40ms is comfortably shorter than the ~260ms question
//     //    transition (see `goToAnswer` below) so it still feels instant, but
//     //    long enough for the new card's layout to have settled.
//     // 3. `block: "center"` (not "start" or "nearest") vertically centers the
//     //    question card in the viewport rather than snapping it to the top,
//     //    which reads as calmer and avoids the question card butting right up
//     //    against the fixed nav bar on short screens.
//     // 4. The cleanup function clears the timeout if `current` changes again
//     //    before the 40ms fires (e.g. someone answering very fast via keyboard
//     //    shortcuts), preventing a stale scroll from firing after the user has
//     //    already moved further ahead.
//     useEffect(() => {
//         if (step !== "quiz") return;
//         setSelectedOption(null);
//         // const t = setTimeout(() => {
//         //     cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
//         // }, 40);
//         // return () => clearTimeout(t);
//     }, [current, step]);

//     // Separate from the per-question auto-scroll above: this one fires on
//     // *step* changes (intro → quiz → contact → analysing), scrolling all the
//     // way back to the top of the page rather than centering on an element.
//     // Needed because, e.g., finishing the quiz on question 20 leaves the
//     // page scrolled halfway down, without this the "contact" step would
//     // render off-screen above the current scroll position.
//     useEffect(() => {
//         window.scrollTo({ top: 0, behavior: "smooth" });
//     }, [step]);

//     useEffect(() => {
//         if (step !== "analysing") return;
//         setLoadPhase(0);
//         const stepDurationMs = 1150; // 6 steps × ~1.15s ≈ 6.9s total, within the 6–8s target
//         const timers = analysingSteps.map((_, i) =>
//             setTimeout(() => setLoadPhase(i), i * stepDurationMs)
//         );
//         const finalTimer = setTimeout(() => {
//             clearSaved();
//             router.push("/adhd/result");
//         }, analysingSteps.length * stepDurationMs + 900);
//         return () => { timers.forEach(clearTimeout); clearTimeout(finalTimer); };
//     }, [step, router]);

//     const goToAnswer = useCallback((value: number) => {
//         if (transitioningRef.current) return;
//         const q = questions[current];
//         if (!q) return;
//         setAnswers((prev) => ({ ...prev, [q.id]: value }));
//         setSelectedOption(value);
//         transitioningRef.current = true;
//         setTransitioning(true);
//         setTimeout(() => {
//             setCurrent((c) => {
//                 if (c < questions.length - 1) return c + 1;
//                 setStep("contact");
//                 return c;
//             });
//             transitioningRef.current = false;
//             setTransitioning(false);
//         }, 260);
//     }, [current]);

//     // Keyboard shortcuts: 1–5 to select an option, backspace to go back
//     useEffect(() => {
//         if (step !== "quiz") return;
//         const onKey = (e: KeyboardEvent) => {
//             const q = questions[current];
//             if (!q) return;
//             const num = Number(e.key);
//             if (num >= 1 && num <= q.options.length) {
//                 goToAnswer(q.options[num - 1].value);
//             } else if (e.key === "Backspace" && current > 0 && !transitioningRef.current) {
//                 e.preventDefault();
//                 setCurrent((c) => Math.max(0, c - 1));
//             }
//         };
//         window.addEventListener("keydown", onKey);
//         return () => window.removeEventListener("keydown", onKey);
//     }, [step, current, goToAnswer]);

//     function handleResume() {
//         if (!resumeAvailable) return;
//         setAnswers(resumeAvailable.answers);
//         setCurrent(resumeAvailable.current);
//         setStep("quiz");
//     }

//     function handleStartFresh() {
//         clearSaved();
//         setResumeAvailable(null);
//         setAnswers({});
//         setCurrent(0);
//         setStep("quiz");
//     }

//     useEffect(() => {
//         analytics.track("ASSESSMENT_PAGE_VIEWED");
//     }, []);

//     // tx_ref=MENTEL-ADHD-1786182813268-85JQ8&status=successful&tx_ref=MENTEL-ADHD-1786182813268-85JQ8&transaction_id=10419725

//     function handleContinueToResults() {
//         if (!completedAvailable) return;
//         const leadId = completedAvailable.leadId;
//         const txRef = completedAvailable.txRef ?? "";
//         const status = completedAvailable.status ?? "";
//         const transactionId = completedAvailable.transactionId ?? "";
//         if (!leadId) return;
//         router.push(`/adhd/result?leadId=${encodeURIComponent(leadId)}&tx_ref=${encodeURIComponent(txRef)}&status=${encodeURIComponent(status)}&tx_ref=${encodeURIComponent(txRef)}&transaction_id=${encodeURIComponent(transactionId)}`);
//         // router.push(`/adhd/result?leadId=${encodeURIComponent(completedAvailable.leadId)}&tx_ref=${txRef}&status=successful&transaction_id=${transactionId}`);
//     }

//     function handleStartFreshFromCompleted() {
//         clearCompletedPointer();
//         setCompletedAvailable(null);
//         setAnswers({});
//         setCurrent(0);
//         setStep("quiz");
//     }

//     function validate(): boolean {
//         const next: FormErrors = {};
//         if (!name.trim() || name.trim().length < 2) next.name = "Please enter your name.";
//         if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Please enter a valid email address.";
//         if (phone.replace(/\D/g, "").length < 7) next.phone = "Please enter a valid phone number.";
//         setErrors(next);
//         return Object.keys(next).length === 0;
//     }


//     useEffect(() => {
//         if (current === 1) {
//             analytics.track("ASSESSMENT_STARTED");
//         }
//     }, [current]);


//     async function handleContactSubmit(e: React.FormEvent) {
//         e.preventDefault();
//         if (!validate()) return;
//         setSubmitting(true);
//         try {
//             const result = scoreAssessment(answers);
//             let leadId: string | null = null;
//             try {
//                 // Awaited (not fire-and-forget) because checkout later needs
//                 // leadId to attach the payment to the right row, this happens
//                 // during the "analysing" transition anyway, which already has
//                 // its own ~7s animation, so the round-trip is effectively free.
//                 const res = await fetch("/api/adhd/lead", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim(), answers, result }),
//                 });
//                 const data = await res.json();
//                 if (data?.success) leadId = data.leadId;
//             } catch { /* if this fails, checkout further down will surface its own error */ }

//             const payload = { name: name.trim(), email: email.trim(), phone: phone.trim(), answers, result, leadId, completedAt: Date.now() };
//             try {
//                 window.sessionStorage.setItem("mentel_adhd_result", JSON.stringify(payload));
//             } catch { /* sessionStorage unavailable — result page falls back to a server lookup by tx_ref once paid */ }

//             // Durable pointer (localStorage, survives closing the tab),
//             // separate from the sessionStorage write above. If leadId is
//             // null (the POST above failed), there's nothing to point to,
//             // silently skip rather than write a broken pointer.
//             if (leadId) {
//                 persistCompletedPointer({ leadId, name: name.trim(), completedAt: Date.now() });
//             }
//             clearSaved(); // the in-progress quiz pointer is no longer relevant, the quiz is done

//             setStep("analysing");
//         } finally {
//             setSubmitting(false);
//         }
//     }

//     // ── INTRO ─────────────────────────────────────────────────────────────────

//     if (step === "intro") {
//         return (
//             <PageWrapper>
//                 {/* Mobile-vs-desktop spacing note: the whole block below the nav
//                     down to the CTA button is deliberately tighter on mobile
//                     (smaller top padding, smaller margins, second helper
//                     paragraph and half the trust tags hidden below `sm:`) so
//                     that "Start Free Assessment" lands inside the first
//                     viewport on a typical phone without scrolling. Desktop gets
//                     the fuller, more spacious version since there's room. */}
//                 <section className="pt-[84px] sm:pt-[112px] pb-24 px-6 min-h-screen">
//                     <div className="max-w-[620px] mx-auto text-center fade-up">
//                         <h1 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(32px,8vw,54px)] font-light tracking-[-0.025em] text-[#1c2820] leading-[1.14] mb-3 sm:mb-5">
//                             Understand your attention.
//                             <br />Discover your <span className="text-[#0E5C3D]">patterns</span>.
//                         </h1>
//                         <p className="text-[15.5px] sm:text-[16.5px] font-light text-[#3a4a3e] leading-[1.7] max-w-[500px] mx-auto mb-2 sm:mb-3">
//                             ADHD often affects far more than focus. It can shape organisation, memory, time
//                             management, impulsivity, and daily functioning in ways that are easy to overlook.
//                         </p>
//                         {/* Hidden on mobile: nice-to-have context, not essential to acting on the CTA */}
//                         <p className="hidden sm:block text-[14px] font-light text-[#4a5a52] leading-[1.7] max-w-[440px] mx-auto mb-8">
//                             A calm, guided self-assessment built around recognised ADHD symptom domains.
//                         </p>

//                         <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-4 sm:mb-8">
//                             {["3\u20134 minutes", "Private", "Evidence-informed", "Not a diagnosis", "No signup required"].map((tag, i) => (
//                                 <span key={tag} className={`text-[12px] text-[#4a6a56] font-medium items-center gap-1.5 ${i < 3 ? "flex" : "hidden sm:flex"}`}>
//                                     <span className="w-1 h-1 rounded-full bg-[#2d7a5a]" /> {tag}
//                                 </span>
//                             ))}
//                         </div>

//                         {resumeAvailable ? (
//                             <div className="bg-[#f2f7f3] border border-[#d5e5da] rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-center gap-4 justify-between max-w-[480px] mx-auto">
//                                 <p className="text-[13.5px] text-[#3a4a3e] font-light text-left">
//                                     You have an assessment in progress ({resumeAvailable.current} of {TOTAL_QUESTIONS} answered).
//                                 </p>
//                                 <div className="flex gap-2 flex-shrink-0">
//                                     <button onClick={handleStartFresh} className="text-[13px] text-[#4a5a52] px-4 py-2 rounded-full border border-[#d8dbd5] bg-white hover:bg-[#f5f5f2] transition-colors">Start fresh</button>
//                                     <button onClick={handleResume} className="text-[13px] font-medium text-white bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] px-4 py-2 rounded-full">Resume</button>
//                                 </div>
//                             </div>
//                         ) : completedAvailable ? (
//                             // Someone who finished the quiz and saw their free
//                             // results, but never paid, then came back (even
//                             // days later, on this or another visit to this
//                             // tab). Their answers already exist server-side
//                             // (see the leadId pointer written in
//                             // handleContactSubmit), so send them straight to
//                             // results instead of making them redo the quiz.
//                             <div className="bg-[#f2f7f3] border border-[#d5e5da] rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-center gap-4 justify-between max-w-[480px] mx-auto">
//                                 <p className="text-[13.5px] text-[#3a4a3e] font-light text-left">
//                                     Welcome back{completedAvailable.name ? `, ${completedAvailable.name.split(" ")[0]}` : ""}. Your results are ready.
//                                 </p>
//                                 <div className="flex gap-2 flex-shrink-0">
//                                     <button onClick={handleStartFreshFromCompleted} className="text-[13px] text-[#4a5a52] px-4 py-2 rounded-full border border-[#d8dbd5] bg-white hover:bg-[#f5f5f2] transition-colors">Start fresh</button>
//                                     <button onClick={handleContinueToResults} className="text-[13px] font-medium text-white bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] px-4 py-2 rounded-full">View results</button>
//                                 </div>
//                             </div>
//                         ) : (
//                             <>
//                                 <button onClick={() => setStep("quiz")}
//                                     className="cta-btn w-full sm:w-auto py-[18px] px-11 bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] text-white border-0 rounded-full text-[15.5px] font-medium flex items-center justify-center gap-2 mx-auto shadow-[0_6px_26px_rgba(30,107,107,0.32)]">
//                                     Start Free Assessment
//                                     <ArrowRight size={16} strokeWidth={2} />
//                                 </button>
//                                 <p className="text-[12px] text-[#4a5a52] mt-3">No credit card &middot; 4 minutes &middot; {TOTAL_QUESTIONS} questions</p>
//                             </>
//                         )}

//                         {/* Social proof: renders an honest trust-pill row until real stats/testimonials exist.
//                             Pass real numbers here once you're tracking them, see TrustAndProof.tsx. */}
//                         <div className="flex flex-wrap items-center justify-center gap-x-9 gap-y-4 py-6">
//                             <Image
//                                 src="/HIPAA.svg"
//                                 alt="HIPAA Compliant"
//                                 width={143}
//                                 height={33}
//                                 className="w-[135px] sm:w-[143px] text-center h-auto object-contain"
//                             />
//                         </div>
//                         <SocialProofBar stats={socialProofStats} />
//                         {/* <ClinicalTrustBar clinicallyReviewed={clinicallyReviewed} hipaaAligned={hipaaAligned} /> */}
//                         {/* <AsSeenOn outlets={pressOutlets} /> */}

//                         <div className="h-px bg-[#e4e9e5] my-8 max-w-[200px] mx-auto" />

//                         {/* What you'll receive, reframed from "20 questions" to outcomes */}
//                         <div className="text-left bg-white rounded-3xl border border-[#e4e9e5] p-8 mb-8 shadow-[0_6px_40px_rgba(28,40,36,0.06)]">
//                             <p className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#4a6a56] mb-5 text-center">You'll receive</p>
//                             <div className="grid sm:grid-cols-2 gap-3">
//                                 {[
//                                     "Overall attention pattern",
//                                     "Executive function overview",
//                                     "Memory pattern",
//                                     "Time management pattern",
//                                     "Hyperactivity indicators",
//                                     "Emotional regulation insight",
//                                     "Practical recommendations",
//                                     "Professional discussion guide",
//                                 ].map((item) => (
//                                     <div key={item} className="flex items-center gap-2.5">
//                                         <CheckCircle2 size={15} className="text-[#2d7a5a] flex-shrink-0" />
//                                         <span className="text-[13.5px] text-[#3a4a3e] font-[450]">{item}</span>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         <TrustSection clinicallyReviewed={clinicallyReviewed} />
//                         <Testimonials items={testimonials} />

//                         {!resumeAvailable && !completedAvailable && (
//                             <button onClick={() => setStep("quiz")}
//                                 className="cta-btn w-full sm:w-auto py-[17px] px-10 bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] text-white border-0 rounded-full text-[15px] font-medium flex items-center justify-center gap-2 mx-auto shadow-[0_4px_22px_rgba(30,107,107,0.3)] mt-4">
//                                 Start Free Assessment
//                                 <ArrowRight size={16} strokeWidth={2} />
//                             </button>
//                         )}

//                         <p className="text-center text-[12px] text-[#6a7a6e] mt-6 max-w-[380px] mx-auto leading-[1.6]">
//                             This is an educational screening tool. It does not diagnose ADHD or any other condition,
//                             and is not a substitute for evaluation by a qualified healthcare professional.
//                         </p>
//                     </div>
//                 </section>
//             </PageWrapper>
//         );
//     }

//     // ── QUIZ ──────────────────────────────────────────────────────────────────

//     if (step === "quiz") {
//         const q = questions[current];
//         return (
//             <PageWrapper>
//                 <section className="pt-[100px] pb-16 px-6 min-h-screen flex flex-col">
//                     <div className="max-w-[560px] mx-auto w-full flex-1 flex flex-col">
//                         {/* Progress */}
//                         <div className="mb-8">
//                             <div className="flex items-center justify-between mb-2.5">
//                                 <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#4a6a56]">
//                                     Question {current + 1} of {TOTAL_QUESTIONS}
//                                 </span>
//                                 <span className="text-[12px] text-[#6a7a6e] font-light">{remainingLabel}</span>
//                             </div>
//                             <div className="h-[5px] bg-[#e8ede9] rounded-full overflow-hidden">
//                                 <div className="h-full rounded-full bg-gradient-to-r from-[#2d7a5a] to-[#5da885] transition-[width] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
//                                     style={{ width: `${progress}%` }} />
//                             </div>
//                         </div>

//                         {/* Encouraging microcopy at a few milestones, not on every question */}
//                         {microcopyFor(current, TOTAL_QUESTIONS) && (
//                             <p key={`mc-${current}`} className="fade-in text-center text-[13px] text-[#2d7a5a] font-medium mb-5">
//                                 {microcopyFor(current, TOTAL_QUESTIONS)}
//                             </p>
//                         )}

//                         <div ref={cardRef} key={q.id} className={transitioning ? "q-exit" : "q-enter"}>
//                             <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#7a9a86] mb-3">
//                                 {domainMeta[q.domain].label}
//                             </p>
//                             <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(22px,5vw,30px)] font-light text-[#1c2820] leading-[1.32] mb-2">
//                                 {q.text}
//                             </h2>
//                             {q.helper && (
//                                 <p className="text-[13px] text-[#6a7a6e] font-light leading-[1.6] mb-6">{q.helper}</p>
//                             )}
//                             {!q.helper && <div className="mb-6" />}

//                             <div className="flex flex-col gap-2.5" role="radiogroup" aria-label={q.text}>
//                                 {q.options.map((opt, idx) => {
//                                     const isSelected = selectedOption === opt.value;
//                                     return (
//                                         <button key={opt.value} type="button" disabled={transitioning}
//                                             onClick={() => goToAnswer(opt.value)}
//                                             role="radio" aria-checked={isSelected}
//                                             className={`option-btn flex items-center gap-3.5 w-full text-left rounded-2xl px-5 py-4 ${isSelected ? "selected" : ""}`}
//                                             style={{
//                                                 border: isSelected ? "1.5px solid #2d7a5a" : "1.5px solid #e4e9e5",
//                                                 background: isSelected ? "rgba(45,122,90,0.06)" : "white",
//                                                 cursor: transitioning ? "default" : "pointer",
//                                                 boxShadow: isSelected ? "0 0 0 4px rgba(45,122,90,0.08), 0 2px 12px rgba(45,122,90,0.1)" : "0 1px 4px rgba(28,40,36,0.04)",
//                                             }}>
//                                             <div className="w-[30px] h-[30px] rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-[200ms]"
//                                                 style={{ background: isSelected ? "#2d7a5a" : "#f0f4f1", border: isSelected ? "none" : "1.5px solid #dce5df" }}>
//                                                 {isSelected ? (
//                                                     <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
//                                                         <path d="M2.5 6.5l3 3L10.5 3" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
//                                                     </svg>
//                                                 ) : (
//                                                     <span className="text-[11px] font-bold text-[#a0b0a8]">{idx + 1}</span>
//                                                 )}
//                                             </div>
//                                             <span className="text-[14.5px] leading-[1.5] flex-1 transition-all duration-200"
//                                                 style={{ fontWeight: isSelected ? 400 : 300, color: isSelected ? "#1c2820" : "#3a4a3e" }}>
//                                                 {opt.label}
//                                             </span>
//                                             <kbd className="hidden sm:flex w-5 h-5 rounded-[6px] border border-[#e4e9e5] bg-[#faf9f6] text-[10px] text-[#6a7a6e] items-center justify-center flex-shrink-0">
//                                                 {idx + 1}
//                                             </kbd>
//                                         </button>
//                                     );
//                                 })}
//                             </div>

//                             {current > 0 && (
//                                 <button onClick={() => setCurrent((c) => Math.max(0, c - 1))}
//                                     className="text-[13px] text-[#6a7a6e] mt-6 hover:text-[#4a6a56] transition-colors">
//                                     ← Back
//                                 </button>
//                             )}
//                         </div>

//                         <p className="text-center text-[12px] text-[#b0bab4] mt-auto pt-10 flex items-center justify-center gap-1.5">
//                             <Lock size={11} stroke="#b0bab4" strokeWidth={2} />
//                             Your answers are private, autosaved, and never shared
//                         </p>
//                     </div>
//                 </section>
//             </PageWrapper>
//         );
//     }

//     // ── CONTACT CAPTURE ──────────────────────────────────────────────────────

//     if (step === "contact") {
//         return (
//             <PageWrapper>
//                 <section className="pt-[108px] pb-20 px-6 min-h-screen">
//                     <div className="max-w-[460px] mx-auto fade-up">
//                         <div className="text-center mb-9">
//                             <div className="w-[68px] h-[68px] rounded-[22px] bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] inline-flex items-center justify-center shadow-[0_10px_30px_rgba(30,107,107,0.28)] mb-6"
//                                 style={{ animation: "float 3s ease-in-out infinite" }}>
//                                 <Mail size={28} color="white" strokeWidth={1.6} />
//                             </div>
//                             <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(30px,7vw,44px)] font-light tracking-[-0.025em] text-[#1c2820] leading-[1.12] mb-3.5">
//                                 Your results are ready
//                             </h2>
//                             <p className="text-[15px] font-light text-[#5a6b5e] leading-[1.7] max-w-[340px] mx-auto">
//                                 Where should we send your personalized report?
//                             </p>
//                         </div>

//                         <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 mb-6">
//                             {["Save results", "Access anytime", "Download PDF", "Private"].map((b) => (
//                                 <span key={b} className="text-[11.5px] text-[#4a6a56] font-medium flex items-center gap-1.5">
//                                     <CheckCircle2 size={11} /> {b}
//                                 </span>
//                             ))}
//                         </div>

//                         <div className="bg-white rounded-3xl border border-[#e4e9e5] overflow-hidden shadow-[0_6px_40px_rgba(28,40,36,0.08)]">
//                             <div className="h-[3px] bg-gradient-to-r from-[#2d7a5a] via-[#1e6b6b] to-[#5da885]" />
//                             <div className="p-8 pt-8">
//                                 <form onSubmit={handleContactSubmit} noValidate className="flex flex-col gap-5">
//                                     <div>
//                                         <label htmlFor="a-name" className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-[#4a6a56] mb-2">Your Name</label>
//                                         <input id="a-name" type="text" placeholder="First name" value={name} autoFocus autoComplete="name"
//                                             onChange={(e) => setName(e.target.value)} className={`form-input${errors.name ? " error" : ""}`} aria-invalid={!!errors.name} />
//                                         {errors.name && <p className="text-[12px] text-[#c0392b] mt-1.5">{errors.name}</p>}
//                                     </div>
//                                     <div>
//                                         <label htmlFor="a-email" className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-[#4a6a56] mb-2">Email Address</label>
//                                         <input id="a-email" type="email" placeholder="you@example.com" value={email} autoComplete="email"
//                                             onChange={(e) => setEmail(e.target.value)} className={`form-input${errors.email ? " error" : ""}`} aria-invalid={!!errors.email} />
//                                         {errors.email && <p className="text-[12px] text-[#c0392b] mt-1.5">{errors.email}</p>}
//                                     </div>
//                                     <div>
//                                         <label htmlFor="a-phone" className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-[#4a6a56] mb-2">Phone Number</label>
//                                         <input id="a-phone" type="tel" placeholder="+1 555 555 5555" value={phone} autoComplete="tel"
//                                             onChange={(e) => setPhone(e.target.value)} className={`form-input${errors.phone ? " error" : ""}`} aria-invalid={!!errors.phone} />
//                                         {errors.phone && <p className="text-[12px] text-[#c0392b] mt-1.5">{errors.phone}</p>}
//                                     </div>
//                                     <button type="submit" disabled={submitting}
//                                         className="cta-btn w-full py-[17px] px-7 bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] text-white border-0 rounded-full text-[15px] font-medium flex items-center justify-center gap-2 mt-1 shadow-[0_4px_22px_rgba(30,107,107,0.3)]"
//                                         style={{ cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1 }}>
//                                         {submitting && <Loader2 size={15} strokeWidth={2.5} className="animate-spin" />}
//                                         {submitting ? "Preparing…" : "Continue"}
//                                         {!submitting && <ArrowRight size={15} strokeWidth={2} />}
//                                     </button>
//                                 </form>
//                                 <div className="flex items-center justify-center gap-1.5 mt-5">
//                                     <Shield size={12} stroke="#2d7a5a" strokeWidth={1.8} />
//                                     <p className="text-[12px] text-[#6a7a6e] font-light">We never share your data · Unsubscribe any time</p>
//                                 </div>
//                             </div>
//                         </div>
//                         <p className="text-center text-[12px] text-[#6a7a6e] mt-4">
//                             By continuing you agree to our{" "}
//                             <Link href="/privacy" className="text-[#2d7a5a] underline underline-offset-[3px]">Privacy Policy</Link>
//                         </p>
//                     </div>
//                 </section>
//             </PageWrapper>
//         );
//     }

//     // ── ANALYSING ─────────────────────────────────────────────────────────────

//     const phaseColor = "#2d7a5a";
//     const pct = Math.round(((loadPhase + 1) / analysingSteps.length) * 100);

//     return (
//         <PageWrapper>
//             <div className="min-h-screen flex items-center justify-center px-6">
//                 <div className="text-center max-w-[400px] fade-in w-full">
//                     <div className="w-14 h-14 rounded-full mx-auto mb-7"
//                         style={{ border: `3px solid ${phaseColor}20`, borderTopColor: phaseColor, animation: "spin 0.85s linear infinite" }} />
//                     <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(22px,5vw,28px)] font-light leading-[1.3] mb-2" style={{ color: phaseColor }}>
//                         Analyzing your responses…
//                     </h2>
//                     <p className="text-[13px] font-light text-[#6a7a6e] mb-8">{pct}%</p>

//                     <div className="h-[3px] bg-[#e8ede9] rounded-full overflow-hidden mb-8">
//                         <div className="h-full rounded-full transition-[width] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
//                             style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${phaseColor}, ${phaseColor}88)` }} />
//                     </div>

//                     <div className="flex flex-col gap-3 text-left bg-white rounded-2xl border border-[#e4e9e5] p-6">
//                         {analysingSteps.map((s, i) => {
//                             const done = i < loadPhase;
//                             const active = i === loadPhase;
//                             return (
//                                 <div key={s} className="flex items-center gap-3 transition-opacity duration-300"
//                                     style={{ opacity: done || active ? 1 : 0.35 }}>
//                                     <div className="w-[18px] h-[18px] rounded-full flex-shrink-0 flex items-center justify-center"
//                                         style={{ background: done ? phaseColor : "transparent", border: done ? "none" : `1.5px solid ${active ? phaseColor : "#d8dbd5"}` }}>
//                                         {done ? (
//                                             <svg width="10" height="10" viewBox="0 0 13 13" fill="none">
//                                                 <path d="M2.5 6.5l3 3L10.5 3" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
//                                             </svg>
//                                         ) : active ? (
//                                             <div className="w-[7px] h-[7px] rounded-full" style={{ background: phaseColor, animation: "pulseRing 1s ease-in-out infinite" }} />
//                                         ) : null}
//                                     </div>
//                                     <span className="text-[13.5px]" style={{ color: done || active ? "#1c2820" : "#6a7a6e", fontWeight: active ? 500 : 400 }}>
//                                         {s}
//                                     </span>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 </div>
//             </div>
//         </PageWrapper>
//     );
// }


"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowRight,
    Mail,
    Shield,
    Lock,
    Brain,
    Menu,
    X,
    Loader2,
    Clock,
    CheckCircle2,
} from "lucide-react";
import { questions, domainMeta, TOTAL_QUESTIONS } from "@/lib/adhd/questions";
import { scoreAssessment } from "@/lib/adhd/scoring";
import { SocialProofBar, AsSeenOn, ClinicalTrustBar, TrustSection, Testimonials } from "@/components/adhd/TrustAndProof";
import { socialProofStats, testimonials, pressOutlets, clinicallyReviewed, hipaaAligned } from "@/lib/adhd/social-proof-config";
import { fireConversion } from "@/lib/tracking/pixels";
import { analytics } from "@/lib/analytics/client";

// ── Constants ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = "mentel_adhd_assessment_v1";
// Separate from STORAGE_KEY above on purpose: STORAGE_KEY tracks in-progress
// quiz answers and gets cleared the moment the quiz finishes. This one
// tracks a *completed* assessment that hasn't been paid for yet, so someone
// who finishes the quiz, sees their free results, and closes the tab
// without paying can come back later (even days later, this is
// localStorage, not sessionStorage, so it survives closing the tab/browser)
// and pick up exactly where they left off instead of retaking the whole
// 20-question quiz.
const COMPLETED_STORAGE_KEY = "mentel_adhd_completed_v1";
const SECONDS_PER_QUESTION = 11; // used only for the estimated-time display

type Step = "intro" | "quiz" | "contact" | "analysing";
type LoadPhase = number; // index into analysingSteps below

const analysingSteps = [
    "Reviewing attention patterns",
    "Analyzing executive function",
    "Comparing symptom domains",
    "Building recommendations",
    "Generating report",
    "Preparing PDF",
];

interface FormErrors { name?: string; email?: string; phone?: string; }

interface SavedState {
    current: number;
    answers: Record<string, number>;
    savedAt: number;
}

// interface CompletedPointer {
//     leadId: string;
//     name: string;
//     completedAt: number;
// }

export interface CompletedPointer {
    leadId?: string | undefined;
    name?: string | undefined;
    txRef?: string | undefined;
    status?: string | undefined;
    transactionId?: string | null;
    completedAt?: number | undefined;

}

// ── Storage helpers ──────────────────────────────────────────────────────────

function loadSaved(): SavedState | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as SavedState;
        if (!parsed || typeof parsed.current !== "number") return null;
        return parsed;
    } catch {
        return null;
    }
}

function persist(state: SavedState) {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
        // best-effort autosave only — never block the UX on storage failures
    }
}

function clearSaved() {
    try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
}

export function loadCompletedPointer(): CompletedPointer | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = window.localStorage.getItem(COMPLETED_STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as CompletedPointer;
        if (!parsed || !parsed.leadId) return null;
        return parsed;
    } catch {
        return null;
    }
}

export function persistCompletedPointer(pointer: CompletedPointer) {
    try {
        window.localStorage.setItem(COMPLETED_STORAGE_KEY, JSON.stringify(pointer));
    } catch {
        // best-effort only, worst case they just retake the assessment
    }
}

function clearCompletedPointer() {
    try { window.localStorage.removeItem(COMPLETED_STORAGE_KEY); } catch { /* noop */ }
}

// Encouraging microcopy shown at a few milestones during the quiz, not on
// every question, per the brief: acknowledge progress without being noisy.
function microcopyFor(current: number, total: number): string | null {
    const quarter = Math.round(total * 0.25);
    const half = Math.round(total * 0.5);
    const threeQuarter = Math.round(total * 0.75);
    if (current === quarter) return "Thanks, this helps us build a more accurate picture.";
    if (current === half) return "You're halfway there.";
    if (current === threeQuarter) return "Just a few more questions.";
    return null;
}

// ── Nav ───────────────────────────────────────────────────────────────────────

function AdhdNav() {
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
                    : "bg-transparent"}`}
                aria-label="Site navigation"
            >
                <div className="max-w-[1100px] mx-auto px-6 h-[68px] flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5 no-underline" aria-label="Mentel — home">
                        <div className="w-8 h-8 rounded-[10px] flex items-center justify-center overflow-hidden">
                            <Image src="/logo-assessment.png" alt="Mentel logo" width={32} height={32} className="object-cover" />
                        </div>
                        <span className="font-['Cormorant_Garamond',Georgia,serif] text-[22px] font-semibold tracking-[-0.02em] text-[#1c2820]">
                            Mentel
                        </span>
                    </Link>
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/about" className="text-sm font-[450] text-[#4a5a52] no-underline tracking-[0.01em] hover:text-[#1c2820] transition-colors">About</Link>
                        <Link href="/services" className="text-sm font-[450] text-[#4a5a52] no-underline tracking-[0.01em] hover:text-[#1c2820] transition-colors">Services</Link>
                        <Link href="/book" className="text-[13px] font-medium text-white bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] px-5 py-2.5 rounded-full no-underline shadow-[0_2px_12px_rgba(30,107,107,0.25)] hover:opacity-90 transition-opacity">
                            Book a session
                        </Link>
                    </div>
                    <button type="button" onClick={() => setMenuOpen((v) => !v)}
                        aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}
                        className="md:hidden bg-transparent border-0 cursor-pointer p-2 text-[#1c2820]">
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
                {menuOpen && (
                    <div className="md:hidden bg-[rgba(250,249,246,0.98)] backdrop-blur-xl border-t border-[rgba(28,40,36,0.08)] px-6 pt-4 pb-6">
                        <Link href="/about" className="block py-3 text-base text-[#1c2820] no-underline border-b border-[rgba(28,40,36,0.06)]" onClick={() => setMenuOpen(false)}>About</Link>
                        <Link href="/services" className="block py-3 text-base text-[#1c2820] no-underline" onClick={() => setMenuOpen(false)}>Services</Link>
                        <Link href="/book" className="block mt-4 text-center text-sm font-medium text-white bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] py-3.5 px-5 rounded-full no-underline" onClick={() => setMenuOpen(false)}>Book a session</Link>
                    </div>
                )}
            </nav>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,450;9..40,500;9..40,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { font-family: 'DM Sans', -apple-system, sans-serif; background: #faf9f6; -webkit-font-smoothing: antialiased; overscroll-behavior-y: contain; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(28px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideOutLeft { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(-28px); } }
        @keyframes pulseRing { 0% { box-shadow: 0 0 0 0 rgba(45,122,90,0.35); } 100% { box-shadow: 0 0 0 10px rgba(45,122,90,0); } }
        .fade-up { animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both; }
        .fade-in { animation: fadeIn 0.4s ease both; }
        .q-enter { animation: slideInRight 0.32s cubic-bezier(0.22,1,0.36,1) both; }
        .q-exit { animation: slideOutLeft 0.22s cubic-bezier(0.4,0,1,1) both; }
        .option-btn { transition: all 0.18s cubic-bezier(0.22,1,0.36,1); }
        .option-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(45,122,90,0.12) !important; border-color: #2d7a5a !important; }
        .option-btn:active:not(:disabled) { transform: scale(0.99); }
        .option-btn.selected { animation: pulseRing 0.5s ease-out; }
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
        kbd { font-family: 'DM Sans', sans-serif; }
      `}</style>
        </>
    );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#faf9f6] font-['DM_Sans',sans-serif]">
            <AdhdNav />
            {children}
        </div>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function AdhdAssessmentPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("intro");
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [transitioning, setTransitioning] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [loadPhase, setLoadPhase] = useState<LoadPhase>(0);
    const [resumeAvailable, setResumeAvailable] = useState<SavedState | null>(null);
    const [completedAvailable, setCompletedAvailable] = useState<CompletedPointer | null>(null);
    const transitioningRef = useRef(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const progress = ((current + (selectedOption !== null ? 1 : 0)) / TOTAL_QUESTIONS) * 100;
    const remainingSeconds = Math.max(0, (TOTAL_QUESTIONS - current) * SECONDS_PER_QUESTION);
    const remainingLabel = remainingSeconds < 60
        ? `About ${remainingSeconds}s left`
        : `About ${Math.ceil(remainingSeconds / 60)} min left`;

    // Check for a resumable in-progress quiz, or a completed-but-unpaid
    // assessment, on mount. These are mutually exclusive in practice (the
    // quiz-progress pointer is cleared the moment the quiz finishes, right
    // before the completed pointer gets written), so at most one of these
    // banners shows.
    useEffect(() => {
        const saved = loadSaved();
        if (saved && Object.keys(saved.answers).length > 0 && saved.current < TOTAL_QUESTIONS) {
            setResumeAvailable(saved);
            return;
        }
        const completed = loadCompletedPointer();
        if (completed) setCompletedAvailable(completed);
    }, []);

    // Fires once, on landing. `contentName` is deliberately generic
    // ("self_assessment", not "adhd_assessment"): Meta's Business Tools
    // Terms prohibit sending data that reveals a health condition or
    // interest in one, and a value like "adhd_assessment" sent on every
    // pageview would do exactly that. This mirrors the existing
    // ViewContent convention already used for the general
    // assessment/booking flows elsewhere in the codebase.
    useEffect(() => {
        fireConversion("ViewContent", { contentName: "self_assessment" });
    }, []);

    // Autosave on every answer change
    useEffect(() => {
        if (step !== "quiz") return;
        if (Object.keys(answers).length === 0) return;
        persist({ current, answers, savedAt: Date.now() });
    }, [answers, current, step]);

    // ── Auto-scroll: keep the current question centered in view ──────────────
    // Runs every time `current` (the question index) changes. This is what
    // makes the quiz feel "guided" instead of like a form: the user never has
    // to manually scroll to find the next question, it's already centered
    // for them by the time the new question card finishes animating in.
    //
    // How it works:
    // 1. `setSelectedOption(null)` clears the previous question's selected-
    //    answer highlight so the new question starts unselected.
    // 2. The 40ms `setTimeout` is a deliberate small delay, not arbitrary.
    //    Without it, `scrollIntoView` can measure the outgoing (still-
    //    animating-out) card's position instead of the new card's, since the
    //    DOM update and the CSS exit/enter animation aren't perfectly
    //    synchronous. 40ms is comfortably shorter than the ~260ms question
    //    transition (see `goToAnswer` below) so it still feels instant, but
    //    long enough for the new card's layout to have settled.
    // 3. `block: "center"` (not "start" or "nearest") vertically centers the
    //    question card in the viewport rather than snapping it to the top,
    //    which reads as calmer and avoids the question card butting right up
    //    against the fixed nav bar on short screens.
    // 4. The cleanup function clears the timeout if `current` changes again
    //    before the 40ms fires (e.g. someone answering very fast via keyboard
    //    shortcuts), preventing a stale scroll from firing after the user has
    //    already moved further ahead.
    useEffect(() => {
        if (step !== "quiz") return;
        setSelectedOption(null);
        // const t = setTimeout(() => {
        //     cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        // }, 40);
        // return () => clearTimeout(t);
    }, [current, step]);

    // Separate from the per-question auto-scroll above: this one fires on
    // *step* changes (intro → quiz → contact → analysing), scrolling all the
    // way back to the top of the page rather than centering on an element.
    // Needed because, e.g., finishing the quiz on question 20 leaves the
    // page scrolled halfway down, without this the "contact" step would
    // render off-screen above the current scroll position.
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [step]);

    useEffect(() => {
        if (step !== "analysing") return;
        setLoadPhase(0);
        const stepDurationMs = 1150; // 6 steps × ~1.15s ≈ 6.9s total, within the 6–8s target
        const timers = analysingSteps.map((_, i) =>
            setTimeout(() => setLoadPhase(i), i * stepDurationMs)
        );
        const finalTimer = setTimeout(() => {
            clearSaved();
            router.push("/adhd/result");
        }, analysingSteps.length * stepDurationMs + 900);
        return () => { timers.forEach(clearTimeout); clearTimeout(finalTimer); };
    }, [step, router]);

    const goToAnswer = useCallback((value: number) => {
        if (transitioningRef.current) return;
        const q = questions[current];
        if (!q) return;
        setAnswers((prev) => ({ ...prev, [q.id]: value }));
        setSelectedOption(value);
        transitioningRef.current = true;
        setTransitioning(true);
        setTimeout(() => {
            setCurrent((c) => {
                if (c < questions.length - 1) return c + 1;
                setStep("contact");
                return c;
            });
            transitioningRef.current = false;
            setTransitioning(false);
        }, 260);
    }, [current]);

    // Keyboard shortcuts: 1–5 to select an option, backspace to go back
    useEffect(() => {
        if (step !== "quiz") return;
        const onKey = (e: KeyboardEvent) => {
            const q = questions[current];
            if (!q) return;
            const num = Number(e.key);
            if (num >= 1 && num <= q.options.length) {
                goToAnswer(q.options[num - 1].value);
            } else if (e.key === "Backspace" && current > 0 && !transitioningRef.current) {
                e.preventDefault();
                setCurrent((c) => Math.max(0, c - 1));
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [step, current, goToAnswer]);

    function handleResume() {
        if (!resumeAvailable) return;
        setAnswers(resumeAvailable.answers);
        setCurrent(resumeAvailable.current);
        setStep("quiz");
    }

    function handleStartFresh() {
        clearSaved();
        setResumeAvailable(null);
        setAnswers({});
        setCurrent(0);
        setStep("quiz");
    }


    useEffect(() => {
        analytics.track("ASSESSMENT_PAGE_VIEWED");
    }, []);

    // tx_ref=MENTEL-ADHD-1786182813268-85JQ8&status=successful&tx_ref=MENTEL-ADHD-1786182813268-85JQ8&transaction_id=10419725

    function handleContinueToResults() {
        if (!completedAvailable) return;
        const leadId = completedAvailable.leadId;
        const txRef = completedAvailable.txRef ?? "";
        const status = completedAvailable.status ?? "";
        const transactionId = completedAvailable.transactionId ?? "";
        if (!leadId) return;
        router.push(`/adhd/result?leadId=${encodeURIComponent(leadId)}&tx_ref=${encodeURIComponent(txRef)}&status=${encodeURIComponent(status)}&tx_ref=${encodeURIComponent(txRef)}&transaction_id=${encodeURIComponent(transactionId)}`);
        // router.push(`/adhd/result?leadId=${encodeURIComponent(completedAvailable.leadId)}&tx_ref=${txRef}&status=successful&transaction_id=${transactionId}`);
    }


    function handleStartFreshFromCompleted() {
        clearCompletedPointer();
        setCompletedAvailable(null);
        setAnswers({});
        setCurrent(0);
        setStep("quiz");
    }

    function validate(): boolean {
        const next: FormErrors = {};
        if (!name.trim() || name.trim().length < 2) next.name = "Please enter your name.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Please enter a valid email address.";
        if (phone.replace(/\D/g, "").length < 7) next.phone = "Please enter a valid phone number.";
        setErrors(next);
        return Object.keys(next).length === 0;
    }

    async function handleContactSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        try {
            const result = scoreAssessment(answers);
            let leadId: string | null = null;
            try {
                // Awaited (not fire-and-forget) because checkout later needs
                // leadId to attach the payment to the right row, this happens
                // during the "analysing" transition anyway, which already has
                // its own ~7s animation, so the round-trip is effectively free.
                const res = await fetch("/api/adhd/lead", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim(), answers, result }),
                });
                const data = await res.json();
                if (data?.success) leadId = data.leadId;
            } catch { /* if this fails, checkout further down will surface its own error */ }

            if (leadId) {
                // dedupeKey/eventId both set to leadId so this client-side
                // fire and the server-side CAPI call fired from
                // app/api/adhd/lead/route.ts (more reliable, not affected
                // by ad blockers or iOS ITP) get deduped against each
                // other by Meta rather than double-counting one Lead.
                fireConversion("Lead", { contentName: "self_assessment", dedupeKey: leadId, eventId: leadId });
            }

            const payload = { name: name.trim(), email: email.trim(), phone: phone.trim(), answers, result, leadId, completedAt: Date.now() };
            try {
                window.sessionStorage.setItem("mentel_adhd_result", JSON.stringify(payload));
            } catch { /* sessionStorage unavailable — result page falls back to a server lookup by tx_ref once paid */ }

            // Durable pointer (localStorage, survives closing the tab),
            // separate from the sessionStorage write above. If leadId is
            // null (the POST above failed), there's nothing to point to,
            // silently skip rather than write a broken pointer.
            if (leadId) {
                persistCompletedPointer({ leadId, name: name.trim(), completedAt: Date.now() });
            }
            clearSaved(); // the in-progress quiz pointer is no longer relevant, the quiz is done

            setStep("analysing");
        } finally {
            setSubmitting(false);
        }
    }

    // ── INTRO ─────────────────────────────────────────────────────────────────

    if (step === "intro") {
        return (
            <PageWrapper>
                {/* Mobile-vs-desktop spacing note: the whole block below the nav
                    down to the CTA button is deliberately tighter on mobile
                    (smaller top padding, smaller margins, second helper
                    paragraph and half the trust tags hidden below `sm:`) so
                    that "Start Free Assessment" lands inside the first
                    viewport on a typical phone without scrolling. Desktop gets
                    the fuller, more spacious version since there's room. */}
                <section className="pt-[84px] sm:pt-[112px] pb-24 px-6 min-h-screen">
                    <div className="max-w-[620px] mx-auto text-center fade-up">
                        <h1 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(32px,8vw,54px)] font-light tracking-[-0.025em] text-[#1c2820] leading-[1.14] mb-3 sm:mb-5">
                            Understand your attention.
                            <br />Discover your <span className="text-[#0E5C3D]">patterns</span>.
                        </h1>
                        <p className="text-[15.5px] sm:text-[16.5px] font-light text-[#3a4a3e] leading-[1.7] max-w-[500px] mx-auto mb-2 sm:mb-3">
                            ADHD often affects far more than focus. It can shape organisation, memory, time
                            management, impulsivity, and daily functioning in ways that are easy to overlook.
                        </p>
                        {/* Hidden on mobile: nice-to-have context, not essential to acting on the CTA */}
                        <p className="hidden sm:block text-[14px] font-light text-[#4a5a52] leading-[1.7] max-w-[440px] mx-auto mb-8">
                            A calm, guided self-assessment built around recognised ADHD symptom domains.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-4 sm:mb-8">
                            {["3\u20134 minutes", "Private", "Evidence-informed", "No signup required"].map((tag, i) => (
                                // {["3\u20134 minutes", "Private", "Evidence-informed", "Not a diagnosis", "No signup required"].map((tag, i) => (
                                <span key={tag} className={`text-[12px] text-[#4a6a56] font-medium items-center gap-1.5 ${i < 3 ? "flex" : "hidden sm:flex"}`}>
                                    <span className="w-1 h-1 rounded-full bg-[#2d7a5a]" /> {tag}
                                </span>
                            ))}
                        </div>

                        {resumeAvailable ? (
                            <div className="bg-[#f2f7f3] border border-[#d5e5da] rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-center gap-4 justify-between max-w-[480px] mx-auto">
                                <p className="text-[13.5px] text-[#3a4a3e] font-light text-left">
                                    You have an assessment in progress ({resumeAvailable.current} of {TOTAL_QUESTIONS} answered).
                                </p>
                                <div className="flex gap-2 flex-shrink-0">
                                    <button onClick={handleStartFresh} className="text-[13px] text-[#4a5a52] px-4 py-2 rounded-full border border-[#d8dbd5] bg-white hover:bg-[#f5f5f2] transition-colors cursor-pointer">Start fresh</button>
                                    <button onClick={handleResume} className="text-[13px] font-medium text-white bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] px-4 py-2 rounded-full cursor-pointer">Resume</button>
                                </div>
                            </div>
                        ) : completedAvailable ? (
                            // Someone who finished the quiz and saw their free
                            // results, but never paid, then came back (even
                            // days later, on this or another visit to this
                            // tab). Their answers already exist server-side
                            // (see the leadId pointer written in
                            // handleContactSubmit), so send them straight to
                            // results instead of making them redo the quiz.
                            <div className="bg-[#f2f7f3] border border-[#d5e5da] rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-center gap-4 justify-between max-w-[480px] mx-auto">
                                <p className="text-[13.5px] text-[#3a4a3e] font-light text-left">
                                    Welcome back{completedAvailable.name ? `, ${completedAvailable.name.split(" ")[0]}` : ""}. Your results are ready.
                                </p>
                                <div className="flex gap-2 flex-shrink-0">
                                    <button onClick={handleStartFreshFromCompleted} className="text-[13px] text-[#4a5a52] px-4 py-2 rounded-full border border-[#d8dbd5] bg-white hover:bg-[#f5f5f2] transition-colors cursor-pointer">Start fresh</button>
                                    <button onClick={handleContinueToResults} className="text-[13px] font-medium text-white bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] px-4 py-2 rounded-full cursor-pointer">View results</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <button onClick={() => setStep("quiz")}
                                    className="cta-btn w-full sm:w-auto py-[18px] px-11 bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] text-white border-0 rounded-full text-[15.5px] font-medium flex items-center justify-center gap-2 mx-auto shadow-[0_6px_26px_rgba(30,107,107,0.32)] cursor-pointer">
                                    Start Free Assessment
                                    <ArrowRight size={16} strokeWidth={2} />
                                </button>
                                <p className="text-[12px] text-[#4a5a52] mt-3">No credit card &middot; 4 minutes &middot; {TOTAL_QUESTIONS} questions</p>
                            </>
                        )}

                        {/* Social proof: renders an honest trust-pill row until real stats/testimonials exist.                            
                         Pass real numbers here once you're tracking them, see TrustAndProof.tsx. */}
                        <div className="flex flex-wrap items-center justify-center gap-x-9 gap-y-4 py-6">
                            <Image
                                src="/HIPAA.svg"
                                alt="HIPAA Compliant"
                                width={143}
                                height={33}
                                className="w-[135px] sm:w-[143px] text-center h-auto object-contain"
                            />
                        </div>
                        <SocialProofBar stats={socialProofStats} />
                        {/* <ClinicalTrustBar clinicallyReviewed={clinicallyReviewed} hipaaAligned={hipaaAligned} /> */}
                        {/* <AsSeenOn outlets={pressOutlets} /> */}
                        {/* What you'll receive, reframed from "20 questions" to outcomes */}
                        <div className="text-left bg-white rounded-3xl border border-[#e4e9e5] p-8 mb-8 shadow-[0_6px_40px_rgba(28,40,36,0.06)]">
                            <p className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#4a6a56] mb-5 text-center">You'll receive</p>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {[
                                    "Overall attention pattern",
                                    "Executive function overview",
                                    "Memory pattern",
                                    "Time management pattern",
                                    "Hyperactivity indicators",
                                    "Emotional regulation insight",
                                    "Practical recommendations",
                                    "Professional discussion guide",
                                ].map((item) => (
                                    <div key={item} className="flex items-center gap-2.5">
                                        <CheckCircle2 size={15} className="text-[#2d7a5a] flex-shrink-0" />
                                        <span className="text-[13.5px] text-[#3a4a3e] font-[450]">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <TrustSection clinicallyReviewed={clinicallyReviewed} />
                        <Testimonials items={testimonials} />

                        {!resumeAvailable && !completedAvailable && (
                            <button onClick={() => setStep("quiz")}
                                className="cta-btn w-full sm:w-auto py-[17px] px-10 bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] text-white border-0 rounded-full text-[15px] font-medium flex items-center justify-center gap-2 mx-auto shadow-[0_4px_22px_rgba(30,107,107,0.3)] mt-4 cursor-pointer">
                                Start Free Assessment
                                <ArrowRight size={16} strokeWidth={2} />
                            </button>
                        )}

                        <p className="text-center text-[12px] text-[#6a7a6e] mt-6 max-w-[380px] mx-auto leading-[1.6]">
                            This is an educational screening tool. It does not diagnose ADHD or any other condition,
                            and is not a substitute for evaluation by a qualified healthcare professional.
                        </p>
                    </div>
                </section>
            </PageWrapper>
        );
    }

    // ── QUIZ ──────────────────────────────────────────────────────────────────

    if (step === "quiz") {
        const q = questions[current];
        return (
            <PageWrapper>
                <section className="pt-[100px] pb-16 px-6 min-h-screen flex flex-col">
                    <div className="max-w-[560px] mx-auto w-full flex-1 flex flex-col">
                        {/* Progress */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-2.5">
                                <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#4a6a56]">
                                    Question {current + 1} of {TOTAL_QUESTIONS}
                                </span>
                                <span className="text-[12px] text-[#6a7a6e] font-light">{remainingLabel}</span>
                            </div>
                            <div className="h-[5px] bg-[#e8ede9] rounded-full overflow-hidden">
                                <div className="h-full rounded-full bg-gradient-to-r from-[#2d7a5a] to-[#5da885] transition-[width] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                                    style={{ width: `${progress}%` }} />
                            </div>
                        </div>

                        {/* Encouraging microcopy at a few milestones, not on every question */}
                        {microcopyFor(current, TOTAL_QUESTIONS) && (
                            <p key={`mc-${current}`} className="fade-in text-center text-[13px] text-[#2d7a5a] font-medium mb-5">
                                {microcopyFor(current, TOTAL_QUESTIONS)}
                            </p>
                        )}

                        <div ref={cardRef} key={q.id} className={transitioning ? "q-exit" : "q-enter"}>
                            <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#7a9a86] mb-3">
                                {domainMeta[q.domain].label}
                            </p>
                            <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(22px,5vw,30px)] font-light text-[#1c2820] leading-[1.32] mb-2">
                                {q.text}
                            </h2>
                            {q.helper && (
                                <p className="text-[13px] text-[#6a7a6e] font-light leading-[1.6] mb-6">{q.helper}</p>
                            )}
                            {!q.helper && <div className="mb-6" />}

                            <div className="flex flex-col gap-2.5" role="radiogroup" aria-label={q.text}>
                                {q.options.map((opt, idx) => {
                                    const isSelected = selectedOption === opt.value;
                                    return (
                                        <button key={opt.value} type="button" disabled={transitioning}
                                            onClick={() => goToAnswer(opt.value)}
                                            role="radio" aria-checked={isSelected}
                                            className={`option-btn cursor-pointer flex items-center gap-3.5 w-full text-left rounded-2xl px-5 py-4 ${isSelected ? "selected" : ""}`}
                                            style={{
                                                border: isSelected ? "1.5px solid #2d7a5a" : "1.5px solid #e4e9e5",
                                                background: isSelected ? "rgba(45,122,90,0.06)" : "white",
                                                cursor: transitioning ? "default" : "pointer",
                                                boxShadow: isSelected ? "0 0 0 4px rgba(45,122,90,0.08), 0 2px 12px rgba(45,122,90,0.1)" : "0 1px 4px rgba(28,40,36,0.04)",
                                            }}>
                                            <div className="w-[30px] h-[30px] rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-[200ms]"
                                                style={{ background: isSelected ? "#2d7a5a" : "#f0f4f1", border: isSelected ? "none" : "1.5px solid #dce5df" }}>
                                                {isSelected ? (
                                                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                                        <path d="M2.5 6.5l3 3L10.5 3" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                ) : (
                                                    <span className="text-[11px] font-bold text-[#a0b0a8]">{idx + 1}</span>
                                                )}
                                            </div>
                                            <span className="text-[14.5px] leading-[1.5] flex-1 transition-all duration-200"
                                                style={{ fontWeight: isSelected ? 400 : 300, color: isSelected ? "#1c2820" : "#3a4a3e" }}>
                                                {opt.label}
                                            </span>
                                            <kbd className="hidden sm:flex w-5 h-5 rounded-[6px] border border-[#e4e9e5] bg-[#faf9f6] text-[10px] text-[#6a7a6e] items-center justify-center flex-shrink-0">
                                                {idx + 1}
                                            </kbd>
                                        </button>
                                    );
                                })}
                            </div>

                            {current > 0 && (
                                <button onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                                    className="text-[13px] text-[#6a7a6e] mt-6 hover:text-[#4a6a56] transition-colors cursor-pointer">
                                    ← Back
                                </button>
                            )}
                        </div>

                        <p className="text-center text-[12px] text-[#b0bab4] mt-auto pt-10 flex items-center justify-center gap-1.5">
                            <Lock size={11} stroke="#b0bab4" strokeWidth={2} />
                            Your answers are private, autosaved, and never shared
                        </p>
                    </div>
                </section>
            </PageWrapper>
        );
    }

    // ── CONTACT CAPTURE ──────────────────────────────────────────────────────

    if (step === "contact") {
        return (
            <PageWrapper>
                <section className="pt-[108px] pb-20 px-6 min-h-screen">
                    <div className="max-w-[460px] mx-auto fade-up">
                        <div className="text-center mb-9">
                            <div className="w-[68px] h-[68px] rounded-[22px] bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] inline-flex items-center justify-center shadow-[0_10px_30px_rgba(30,107,107,0.28)] mb-6"
                                style={{ animation: "float 3s ease-in-out infinite" }}>
                                <Mail size={28} color="white" strokeWidth={1.6} />
                            </div>
                            <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(30px,7vw,44px)] font-light tracking-[-0.025em] text-[#1c2820] leading-[1.12] mb-3.5">
                                Your results are ready
                            </h2>
                            <p className="text-[15px] font-light text-[#5a6b5e] leading-[1.7] max-w-[340px] mx-auto">
                                Where should we send your personalized report?
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 mb-6">
                            {["Save results", "Access anytime", "Download PDF", "Private"].map((b) => (
                                <span key={b} className="text-[11.5px] text-[#4a6a56] font-medium flex items-center gap-1.5">
                                    <CheckCircle2 size={11} /> {b}
                                </span>
                            ))}
                        </div>

                        <div className="bg-white rounded-3xl border border-[#e4e9e5] overflow-hidden shadow-[0_6px_40px_rgba(28,40,36,0.08)]">
                            <div className="h-[3px] bg-gradient-to-r from-[#2d7a5a] via-[#1e6b6b] to-[#5da885]" />
                            <div className="p-8 pt-8">
                                <form onSubmit={handleContactSubmit} noValidate className="flex flex-col gap-5">
                                    <div>
                                        <label htmlFor="a-name" className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-[#4a6a56] mb-2">Your Name</label>
                                        <input id="a-name" type="text" placeholder="First name" value={name} autoFocus autoComplete="name"
                                            onChange={(e) => setName(e.target.value)} className={`form-input${errors.name ? " error" : ""}`} aria-invalid={!!errors.name} />
                                        {errors.name && <p className="text-[12px] text-[#c0392b] mt-1.5">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="a-email" className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-[#4a6a56] mb-2">Email Address</label>
                                        <input id="a-email" type="email" placeholder="you@example.com" value={email} autoComplete="email"
                                            onChange={(e) => setEmail(e.target.value)} className={`form-input${errors.email ? " error" : ""}`} aria-invalid={!!errors.email} />
                                        {errors.email && <p className="text-[12px] text-[#c0392b] mt-1.5">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="a-phone" className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-[#4a6a56] mb-2">Phone Number</label>
                                        <input id="a-phone" type="tel" placeholder="+1 000 000 0000" value={phone} autoComplete="tel"
                                            onChange={(e) => setPhone(e.target.value)} className={`form-input${errors.phone ? " error" : ""}`} aria-invalid={!!errors.phone} />
                                        {errors.phone && <p className="text-[12px] text-[#c0392b] mt-1.5">{errors.phone}</p>}
                                    </div>
                                    <button type="submit" disabled={submitting}
                                        className="cta-btn w-full py-[17px] px-7 bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] text-white border-0 rounded-full text-[15px] font-medium flex items-center justify-center gap-2 mt-1 shadow-[0_4px_22px_rgba(30,107,107,0.3)] cursor-pointer"
                                        style={{ cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1 }}>
                                        {submitting && <Loader2 size={15} strokeWidth={2.5} className="animate-spin" />}
                                        {submitting ? "Preparing…" : "Continue"}
                                        {!submitting && <ArrowRight size={15} strokeWidth={2} />}
                                    </button>
                                </form>
                                <div className="flex items-center justify-center gap-1.5 mt-5">
                                    <Shield size={12} stroke="#2d7a5a" strokeWidth={1.8} />
                                    <p className="text-[12px] text-[#6a7a6e] font-light">We never share your data · Unsubscribe any time</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-center text-[12px] text-[#6a7a6e] mt-4">
                            By continuing you agree to our{" "}
                            <Link href="/privacy" className="text-[#2d7a5a] underline underline-offset-[3px]">Privacy Policy</Link>
                        </p>
                    </div>
                </section>
            </PageWrapper>
        );
    }

    // ── ANALYSING ─────────────────────────────────────────────────────────────

    const phaseColor = "#2d7a5a";
    const pct = Math.round(((loadPhase + 1) / analysingSteps.length) * 100);

    return (
        <PageWrapper>
            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="text-center max-w-[400px] fade-in w-full">
                    <div className="w-14 h-14 rounded-full mx-auto mb-7"
                        style={{ border: `3px solid ${phaseColor}20`, borderTopColor: phaseColor, animation: "spin 0.85s linear infinite" }} />
                    <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(22px,5vw,28px)] font-light leading-[1.3] mb-2" style={{ color: phaseColor }}>
                        Analyzing your responses…
                    </h2>
                    <p className="text-[13px] font-light text-[#6a7a6e] mb-8">{pct}%</p>

                    <div className="h-[3px] bg-[#e8ede9] rounded-full overflow-hidden mb-8">
                        <div className="h-full rounded-full transition-[width] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                            style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${phaseColor}, ${phaseColor}88)` }} />
                    </div>

                    <div className="flex flex-col gap-3 text-left bg-white rounded-2xl border border-[#e4e9e5] p-6">
                        {analysingSteps.map((s, i) => {
                            const done = i < loadPhase;
                            const active = i === loadPhase;
                            return (
                                <div key={s} className="flex items-center gap-3 transition-opacity duration-300"
                                    style={{ opacity: done || active ? 1 : 0.35 }}>
                                    <div className="w-[18px] h-[18px] rounded-full flex-shrink-0 flex items-center justify-center"
                                        style={{ background: done ? phaseColor : "transparent", border: done ? "none" : `1.5px solid ${active ? phaseColor : "#d8dbd5"}` }}>
                                        {done ? (
                                            <svg width="10" height="10" viewBox="0 0 13 13" fill="none">
                                                <path d="M2.5 6.5l3 3L10.5 3" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        ) : active ? (
                                            <div className="w-[7px] h-[7px] rounded-full" style={{ background: phaseColor, animation: "pulseRing 1s ease-in-out infinite" }} />
                                        ) : null}
                                    </div>
                                    <span className="text-[13.5px]" style={{ color: done || active ? "#1c2820" : "#6a7a6e", fontWeight: active ? 500 : 400 }}>
                                        {s}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}

