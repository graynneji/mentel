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
    Flame,
    Activity,
    Menu,
    X,
    Loader2,
    CheckCircle,
    Star,
} from "lucide-react";
import { useLiveCounter } from "@/hooks/use-live-counter";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Option { label: string; value: number; }
interface Question { id: string; category: string; text: string; options: Option[]; }
interface FormErrors { name?: string; email?: string; phone?: string; }
type Step = "intro" | "quiz" | "email" | "analysing";
type LoadPhase = "a" | "b" | "c";

// ── Questions — tightened, clinically sound ────────────────────────────────────

const questions: Question[] = [
    {
        id: "b1",
        category: "Emotional Exhaustion",
        text: "How often do you feel emotionally drained by your work or daily responsibilities?",
        options: [
            { label: "Rarely — I recover well", value: 0 },
            { label: "Sometimes — a few days a week", value: 1 },
            { label: "Often — most days I'm depleted", value: 2 },
            { label: "Almost always — running on empty", value: 3 },
        ],
    },
    {
        id: "b2",
        category: "Mental Fatigue",
        text: "How difficult is it to concentrate or make decisions right now?",
        options: [
            { label: "Not difficult — my mind is clear", value: 0 },
            { label: "Slightly — occasional brain fog", value: 1 },
            { label: "Moderately — I make avoidable mistakes", value: 2 },
            { label: "Very — I can barely think straight", value: 3 },
        ],
    },
    {
        id: "b3",
        category: "Motivation",
        text: "How is your motivation toward work or goals that once interested you?",
        options: [
            { label: "Strong — still engaged and driven", value: 0 },
            { label: "Inconsistent — some days better", value: 1 },
            { label: "Low — going through the motions", value: 2 },
            { label: "Gone — I feel detached from everything", value: 3 },
        ],
    },
    {
        id: "b4",
        category: "Work-Related Stress",
        text: "How often do you feel overwhelmed by your responsibilities?",
        options: [
            { label: "Rarely — workload feels manageable", value: 0 },
            { label: "Sometimes — busy spells I handle", value: 1 },
            { label: "Often — I feel behind or buried", value: 2 },
            { label: "Constantly — I can't see a way out", value: 3 },
        ],
    },
    {
        id: "b5",
        category: "Recovery & Sleep",
        text: "When you rest or sleep, how restored do you actually feel?",
        options: [
            { label: "Very — I wake up refreshed", value: 0 },
            { label: "Mostly — occasional restless nights", value: 1 },
            { label: "Poor — I wake up still exhausted", value: 2 },
            { label: "Not at all — rest doesn't help", value: 3 },
        ],
    },
    {
        id: "b6",
        category: "Cynicism & Detachment",
        text: "How often do you feel indifferent or emotionally distant from your work or people around you?",
        options: [
            { label: "Rarely — I still feel connected", value: 0 },
            { label: "Sometimes — I notice the pull away", value: 1 },
            { label: "Often — I've become noticeably withdrawn", value: 2 },
            { label: "Almost always — numb or resentful", value: 3 },
        ],
    },
    {
        id: "b7",
        category: "Physical Symptoms",
        text: "How often do you experience physical exhaustion, tension, or stress-related symptoms that affect your day?",
        options: [
            { label: "Rarely — my body feels okay", value: 0 },
            { label: "Occasionally — manageable and passing", value: 1 },
            { label: "Regularly — they affect daily function", value: 2 },
            { label: "Almost constantly — hard to push through", value: 3 },
        ],
    },
    {
        id: "b8",
        category: "Productivity & Performance",
        text: "Compared with a few months ago, how is your ability to stay productive and perform?",
        options: [
            { label: "About the same as usual", value: 0 },
            { label: "Slightly reduced — I notice a difference", value: 1 },
            { label: "Noticeably reduced — tasks take much longer", value: 2 },
            { label: "Significantly reduced — barely keeping up", value: 3 },
        ],
    },
];

// ── Band logic (used only in loading copy — canonical logic is in result page + API) ──

function getLoadingColor(score: number): string {
    if (score > 19) return "#a33030";
    if (score > 15) return "#b07a1a";
    return "#05673e";
}

// ── Nav ────────────────────────────────────────────────────────────────────────

function BurnoutNav() {
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
                        {["About", "Services", "Articles", "Company"].map((item) => (
                            <Link key={item} href={`/${item === "Company" ? "eap" : item.toLowerCase()}`}
                                className="text-sm font-[450] text-[#4a5a52] no-underline tracking-[0.01em] hover:text-[#1c2820] transition-colors">
                                {item}
                            </Link>
                        ))}
                        <Link href="/book"
                            className="text-[13px] font-medium text-white bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] px-5 py-2.5 rounded-full no-underline shadow-[0_2px_12px_rgba(30,107,107,0.25)] hover:opacity-90 transition-opacity">
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
                        {["About", "Services", "Articles"].map((item) => (
                            <Link key={item} href={`/${item.toLowerCase()}`}
                                className="block py-3 text-base text-[#1c2820] no-underline border-b border-[rgba(28,40,36,0.06)]"
                                onClick={() => setMenuOpen(false)}>
                                {item}
                            </Link>
                        ))}
                        <Link href="/book"
                            className="block mt-4 text-center text-sm font-medium text-white bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] py-3.5 px-5 rounded-full no-underline"
                            onClick={() => setMenuOpen(false)}>
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
        @keyframes spin { to { transform: rotate(360deg); } }
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
        .measure-row { display: flex; align-items: center; gap: 10px; padding: 9px 0; border-bottom: 1px solid #f0f0ee; }
        .measure-row:last-child { border-bottom: none; }
      `}</style>
        </>
    );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#faf9f6] font-['DM_Sans',sans-serif]">
            <BurnoutNav />
            {children}
        </div>
    );
}

// ── Main ───────────────────────────────────────────────────────────────────────

export default function BurnoutCalculatorPage() {
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
    const assessedCount = useLiveCounter(50_000, "2026-01-01", 4000);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setSelectedOption(null);
    }, [current, step]);

    useEffect(() => {
        if (step !== "analysing") return;
        setLoadPhase("a");
        const t1 = setTimeout(() => setLoadPhase("b"), 1400);
        const t2 = setTimeout(() => setLoadPhase("c"), 2800);
        const t3 = setTimeout(() => router.push("/burnout/result"), 3800);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, [step, router]);

    const handleAnswerStable = useCallback((value: number): void => {
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
                if (c < questions.length - 1) return c + 1;
                setStep("email");
                return c;
            });
            transitioningRef.current = false;
            setTransitioning(false);
            setSelectedOption(null);
        }, 380);
    }, [current]);

    const handleBack = useCallback((): void => {
        if (transitioningRef.current) return;
        setCurrent((c) => {
            if (c > 0) return c - 1;
            setStep("intro");
            return c;
        });
    }, []);

    const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }, []);
    const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }, []);
    const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: undefined })); }, []);

    const validate = useCallback((): boolean => {
        const e: FormErrors = {};
        if (!name.trim() || name.trim().length < 2) e.name = "Please enter your name.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Please enter a valid email.";
        if (phone.replace(/\D/g, "").length < 7) e.phone = "Please enter a valid phone number.";
        setErrors(e);
        return !Object.keys(e).length;
    }, [name, email, phone]);

    const handleEmailSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        try {
            await fetch("/api/burnout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, phone, score: totalScore, answers }),
            });
        } catch { }
        if (typeof window !== "undefined") {
            sessionStorage.setItem("mentel_burnout_result", JSON.stringify({ name, email, score: totalScore, answers }));
        }
        setStep("analysing");
    }, [validate, name, email, phone, totalScore, answers]);

    // ── INTRO ──────────────────────────────────────────────────────────────────

    if (step === "intro") {
        return (
            <PageWrapper>
                <section className="pt-24 pb-20 px-6">
                    <div className="max-w-[680px] mx-auto">

                        {/* Badge row */}
                        <div className="flex flex-wrap items-center gap-3 mb-8 fade-up">
                            <div className="inline-flex items-center gap-2 bg-[rgba(163,48,48,0.07)] border border-[rgba(163,48,48,0.18)] rounded-full px-3 py-1.5">
                                <Flame size={13} stroke="#a33030" strokeWidth={2} />
                                <span className="text-[12px] font-semibold text-[#a33030] tracking-[0.04em]">Burnout Calculator</span>
                            </div>
                            <div className="inline-flex items-center gap-2 bg-[rgba(45,122,90,0.07)] border border-[rgba(45,122,90,0.15)] rounded-full px-3 py-1.5">
                                <span className="text-[12px] text-[#2d7a5a] font-medium">2-minute · Free</span>
                            </div>
                            <div className="inline-flex items-center gap-2 bg-white border border-[#e4e9e5] rounded-full px-3 py-1.5">
                                <Lock size={11} stroke="#5a6b5e" strokeWidth={2} />
                                <span className="text-[12px] text-[#5a6b5e] font-medium">Confidential</span>
                            </div>
                        </div>

                        {/* Headline */}
                        <h1 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(42px,8vw,70px)] font-light leading-[1.06] tracking-[-0.03em] text-[#1c2820] mb-5 fade-up fade-up-delay-1">
                            Are you experiencing{" "}
                            <em className="text-[#a33030] not-italic">burnout</em>{" "}
                            or just{" "}
                            <em className="text-[#b07a1a] not-italic">temporary stress?</em>
                        </h1>

                        <p className="text-[clamp(15px,2.6vw,17px)] font-light leading-[1.78] text-[#5a6b5e] max-w-[520px] mb-9 fade-up fade-up-delay-1">
                            8 questions. Based on the same burnout indicators used by licensed mental health professionals. Get your score and a matched therapist — free.
                        </p>

                        {/* CTA — above the fold */}
                        <div className="fade-up fade-up-delay-2 mb-10">
                            <button
                                type="button"
                                onClick={() => setStep("quiz")}
                                className="cta-btn inline-flex items-center justify-center gap-3 bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] text-white border-0 rounded-full px-10 py-[19px] text-[clamp(14px,3.5vw,16px)] font-medium font-['DM_Sans',sans-serif] cursor-pointer shadow-[0_6px_28px_rgba(30,107,107,0.32)] tracking-[0.01em]"
                            >
                                <Flame size={16} strokeWidth={2.5} color="#a8e6cf" />
                                Calculate My Burnout Score
                                <ArrowRight size={16} strokeWidth={2} className="opacity-55" />
                            </button>
                            <p className="text-[12px] text-[#8a9a8e] mt-3.5 font-light">
                                Takes 2 minutes · No account needed · 100% confidential
                            </p>
                        </div>

                        {/* Stats card */}
                        <div className="bg-white border border-[#e4e9e5] rounded-2xl p-5 mb-6 shadow-[0_2px_16px_rgba(28,40,36,0.05)] fade-up fade-up-delay-2">
                            <div className="grid grid-cols-3 divide-x divide-[#f0f0ee]">
                                {[
                                    { num: `${assessedCount.toLocaleString()}+`, label: "People assessed" },
                                    { num: "2 min", label: "Average time" },
                                    { num: "93%", label: "Found it helpful" },
                                ].map((s) => (
                                    <div key={s.label} className="px-4 first:pl-0 last:pr-0 text-center">
                                        <div className="font-['Cormorant_Garamond',Georgia,serif] text-[26px] font-medium text-[#1c2820] leading-none mb-1">{s.num}</div>
                                        <div className="text-[11px] text-[#8a9a8e] leading-[1.4]">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Measures + trust */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 fade-up fade-up-delay-3">
                            <div className="bg-white border border-[#e4e9e5] rounded-2xl p-5 shadow-[0_1px_8px_rgba(28,40,36,0.04)]">
                                <div className="flex items-center gap-2 mb-3">
                                    <CheckCircle size={14} stroke="#2d7a5a" strokeWidth={2.5} />
                                    <span className="text-[13px] font-semibold text-[#1c2820]">This assessment measures</span>
                                </div>
                                {["Emotional exhaustion", "Mental fatigue & brain fog", "Reduced motivation & detachment", "Work-related stress & overload", "Sleep quality & recovery", "Physical stress symptoms", "Productivity & performance drop"].map((item) => (
                                    <div key={item} className="measure-row">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#2d7a5a] flex-shrink-0" />
                                        <span className="text-[12px] font-light text-[#4a5a52]">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white border border-[#e4e9e5] rounded-2xl p-5 shadow-[0_1px_8px_rgba(28,40,36,0.04)]">
                                <div className="flex items-center gap-2 mb-3">
                                    <CheckCircle size={14} stroke="#2d7a5a" strokeWidth={2.5} />
                                    <span className="text-[13px] font-semibold text-[#1c2820]">What you get</span>
                                </div>
                                {[
                                    { icon: Flame, label: "Your burnout score (0–24)" },
                                    { icon: Activity, label: "Your specific burnout pattern" },
                                    { icon: Shield, label: "A matched therapist profile" },
                                    { icon: Star, label: "Free 30-min intro call" },
                                    { icon: Lock, label: "100% confidential & NDPR compliant" },
                                ].map(({ icon: Icon, label }) => (
                                    <div key={label} className="measure-row">
                                        <Icon size={12} stroke="#2d7a5a" strokeWidth={2} className="flex-shrink-0" />
                                        <span className="text-[12px] font-light text-[#4a5a52]">{label}</span>
                                    </div>
                                ))}
                                <div className="mt-3 pt-3 border-t border-[#f0f0ee]">
                                    <p className="text-[11px] font-light text-[#8a9a8e] leading-[1.6]">
                                        Based on validated burnout indicators. Not a diagnosis — a clinical starting point.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <div className="bg-white border-t border-b border-[#ebebeb] py-12 px-6">
                    <div className="max-w-[760px] mx-auto">
                        <p className="text-[11px] tracking-[0.12em] uppercase text-[#8a9a8e] font-semibold text-center mb-8">What people found out</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            {[
                                { text: "I thought I was just tired. Turns out it was full burnout. Knowing changed everything.", name: "Tunde A.", tag: "Lagos · Finance" },
                                { text: "The results were uncomfortably accurate. Finally had the language to explain it to my doctor.", name: "Ngozi E.", tag: "Abuja · HR Director" },
                                { text: "I scored moderate and ignored it. Six weeks later I crashed. Wish I'd acted sooner.", name: "Kola B.", tag: "Port Harcourt · Tech" },
                            ].map((t) => (
                                <div key={t.name} className="testimonial-card bg-[#faf9f6] border border-[#e8ede9] rounded-[18px] p-[22px] shadow-[0_2px_8px_rgba(28,40,36,0.04)]">
                                    <div className="flex gap-0.5 mb-3.5">
                                        {[...Array(5)].map((_, si) => (
                                            <svg key={si} width="12" height="12" viewBox="0 0 12 12" fill="#f0c040">
                                                <path d="M6 1l1.5 3 3.3.5-2.4 2.3.6 3.2L6 8.5l-3 1.5.6-3.2L1.2 4.5l3.3-.5z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-sm font-light leading-[1.72] text-[#3a4a3e] mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c8e6d8] to-[#a8c5b2] flex items-center justify-center text-[12px] font-semibold text-[#1c3a28]">{t.name[0]}</div>
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

                        <div className="mb-[52px]">
                            <div className="flex items-center gap-3.5 mb-5">
                                <button type="button" onClick={handleBack} disabled={transitioning} aria-label="Go back"
                                    className="w-10 h-10 rounded-full border-[1.5px] border-[#dce5df] bg-white cursor-pointer flex items-center justify-center text-[#5a6b5e] flex-shrink-0 transition-all shadow-[0_1px_6px_rgba(28,40,36,0.06)] hover:border-[#2d7a5a] hover:text-[#2d7a5a]">
                                    <ArrowLeft size={15} strokeWidth={2} />
                                </button>
                                <div className="flex-1 h-[3px] bg-[#e8ede9] rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-[#2d7a5a] to-[#1e6b6b] rounded-full transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ width: `${progress}%` }} />
                                </div>
                                <div className="relative w-11 h-11 flex-shrink-0">
                                    <svg width="44" height="44" viewBox="0 0 44 44">
                                        <circle cx="22" cy="22" r={r} fill="none" strokeWidth="2.5" stroke="rgba(45,122,90,0.12)" />
                                        <circle cx="22" cy="22" r={r} fill="none" strokeWidth="2.5" stroke="#2d7a5a" strokeLinecap="round"
                                            strokeDasharray={circ} strokeDashoffset={filled}
                                            style={{ transform: "rotate(-90deg)", transformOrigin: "center", transition: "stroke-dashoffset 0.5s cubic-bezier(0.22,1,0.36,1)" }} />
                                    </svg>
                                    <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-[#2d7a5a]">
                                        {current + 1}/{questions.length}
                                    </span>
                                </div>
                            </div>
                            <span className="inline-block bg-[rgba(163,48,48,0.07)] text-[#a33030] text-[11px] font-semibold tracking-[0.1em] uppercase px-3.5 py-[5px] rounded-full border border-[rgba(163,48,48,0.15)]">
                                {q.category}
                            </span>
                        </div>

                        <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(24px,5vw,34px)] font-light leading-[1.32] text-[#1c2820] tracking-[-0.018em] mb-10">
                            {q.text}
                        </h2>

                        <div className="flex flex-col gap-3">
                            {q.options.map((opt, idx) => {
                                const isSelected = selectedOption === opt.value || answers[q.id] === opt.value;
                                return (
                                    <button key={opt.value} type="button" onClick={() => handleAnswerStable(opt.value)} disabled={transitioning}
                                        className="option-btn w-full text-left px-5 py-[17px] rounded-2xl flex items-center gap-4 font-['DM_Sans',sans-serif]"
                                        style={{
                                            border: isSelected ? "1.5px solid #2d7a5a" : "1.5px solid #e4e9e5",
                                            background: isSelected ? "rgba(45,122,90,0.06)" : "white",
                                            cursor: transitioning ? "default" : "pointer",
                                            boxShadow: isSelected ? "0 0 0 4px rgba(45,122,90,0.08), 0 2px 12px rgba(45,122,90,0.1)" : "0 1px 4px rgba(28,40,36,0.04)",
                                        }}>
                                        <div className="w-[30px] h-[30px] rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-[220ms]"
                                            style={{ background: isSelected ? "#2d7a5a" : "#f0f4f1", border: isSelected ? "none" : "1.5px solid #dce5df" }}>
                                            {isSelected ? (
                                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                                    <path d="M2.5 6.5l3 3L10.5 3" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            ) : (
                                                <span className="text-[11px] font-bold text-[#a0b0a8]">{["A", "B", "C", "D"][idx]}</span>
                                            )}
                                        </div>
                                        <span className="text-[14px] leading-[1.5] transition-all duration-200"
                                            style={{ fontWeight: isSelected ? 400 : 300, color: isSelected ? "#1c2820" : "#3a4a3e" }}>
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
                            <div className="w-[68px] h-[68px] rounded-[22px] bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] inline-flex items-center justify-center shadow-[0_10px_30px_rgba(30,107,107,0.28)] mb-6"
                                style={{ animation: "float 3s ease-in-out infinite" }}>
                                <Mail size={28} color="white" strokeWidth={1.6} />
                            </div>
                            <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(30px,7vw,44px)] font-light tracking-[-0.025em] text-[#1c2820] leading-[1.12] mb-3.5">
                                Your score is ready
                            </h2>
                            <p className="text-[15px] font-light text-[#5a6b5e] leading-[1.7] max-w-[340px] mx-auto">
                                Enter your details to see your burnout score and get matched with a therapist for a free intro call.
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl border border-[#e4e9e5] overflow-hidden shadow-[0_6px_40px_rgba(28,40,36,0.08)]">
                            <div className="h-[3px] bg-gradient-to-r from-[#2d7a5a] via-[#1e6b6b] to-[#5da885]" />
                            <div className="p-8 pt-8">
                                <form onSubmit={handleEmailSubmit} noValidate className="flex flex-col gap-5">
                                    <div>
                                        <label htmlFor="b-name" className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-[#4a6a56] mb-2">Your Name</label>
                                        <input id="b-name" type="text" placeholder="First name" value={name} autoFocus autoComplete="name" onChange={handleNameChange} className={`form-input${errors.name ? " error" : ""}`} aria-invalid={!!errors.name} />
                                        {errors.name && <p className="text-[12px] text-[#c0392b] mt-1.5 flex items-center gap-1"><span>⚠</span> {errors.name}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="b-email" className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-[#4a6a56] mb-2">Email Address</label>
                                        <input id="b-email" type="email" placeholder="you@example.com" value={email} autoComplete="email" onChange={handleEmailChange} className={`form-input${errors.email ? " error" : ""}`} aria-invalid={!!errors.email} />
                                        {errors.email && <p className="text-[12px] text-[#c0392b] mt-1.5 flex items-center gap-1"><span>⚠</span> {errors.email}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="b-phone" className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-[#4a6a56] mb-2">Phone Number</label>
                                        <input id="b-phone" type="tel" placeholder="+234 000 000 0000" value={phone} autoComplete="tel" onChange={handlePhoneChange} className={`form-input${errors.phone ? " error" : ""}`} aria-invalid={!!errors.phone} />
                                        {errors.phone && <p className="text-[12px] text-[#c0392b] mt-1.5 flex items-center gap-1"><span>⚠</span> {errors.phone}</p>}
                                    </div>
                                    <button type="submit" disabled={submitting}
                                        className="cta-btn w-full py-[17px] px-7 bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] text-white border-0 rounded-full text-[15px] font-medium font-['DM_Sans',sans-serif] flex items-center justify-center gap-2 mt-1 shadow-[0_4px_22px_rgba(30,107,107,0.3)]"
                                        style={{ cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1 }}>
                                        {submitting && <Loader2 size={15} strokeWidth={2.5} className="animate-spin" />}
                                        {submitting ? "Calculating…" : "See My Burnout Score"}
                                        {!submitting && <ArrowRight size={15} strokeWidth={2} />}
                                    </button>
                                </form>
                                <div className="flex items-center justify-center gap-1.5 mt-5">
                                    <Shield size={12} stroke="#2d7a5a" strokeWidth={1.8} />
                                    <p className="text-[12px] text-[#a0aba3] font-light">We never share your data · Unsubscribe any time</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-center text-[12px] text-[#a0aba3] mt-4">
                            By continuing you agree to our{" "}
                            <Link href="/privacy" className="text-[#2d7a5a] underline underline-offset-[3px]">Privacy Policy</Link>
                        </p>
                    </div>
                </section>
            </PageWrapper>
        );
    }

    // ── ANALYSING ──────────────────────────────────────────────────────────────

    const phaseColor = getLoadingColor(totalScore);
    const phaseCopy: Record<LoadPhase, { text: string; sub: string; pct: number }> = {
        a: { text: "Scoring your 8 responses…", sub: "Measuring exhaustion, detachment, recovery and performance dimensions", pct: 35 },
        b: { text: `Matching against ${assessedCount.toLocaleString()}+ profiles…`, sub: "Identifying your burnout stage and pattern type", pct: 70 },
        c: {
            text: totalScore > 19 ? "Elevated burnout markers detected." : "Burnout profile identified.",
            sub: totalScore > 19 ? "Your results indicate a level that needs prompt attention" : "Your personalised burnout score is ready",
            pct: 95,
        },
    };
    const msg = phaseCopy[loadPhase];

    return (
        <PageWrapper>
            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="text-center max-w-[380px] fade-in">
                    <div className="w-16 h-16 rounded-full mx-auto mb-9"
                        style={{ border: `3px solid ${phaseColor}20`, borderTopColor: phaseColor, animation: "spin 0.85s linear infinite" }} />
                    <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(22px,5vw,30px)] font-light leading-[1.3] mb-3.5" style={{ color: phaseColor }}>
                        {msg.text}
                    </h2>
                    <p className="text-sm font-light text-[#8a9a8e] leading-[1.65] mb-10">{msg.sub}</p>
                    <div className="h-[3px] bg-[#e8ede9] rounded-full overflow-hidden mb-7">
                        <div className="h-full rounded-full transition-[width] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                            style={{ width: `${msg.pct}%`, background: `linear-gradient(90deg, ${phaseColor}, ${phaseColor}88)` }} />
                    </div>
                    <div className="flex justify-center gap-2">
                        {(["a", "b", "c"] as LoadPhase[]).map((p) => (
                            <div key={p} className="w-[7px] h-[7px] rounded-full transition-all duration-300"
                                style={{ background: p === loadPhase ? phaseColor : "#d8dbd5", transform: p === loadPhase ? "scale(1.3)" : "scale(1)" }} />
                        ))}
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}