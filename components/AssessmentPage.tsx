
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

/**
 * Questions are intentionally grounded in PHQ-9 / GAD-7 clinical language —
 * this gives the tool credibility and ensures scores map meaningfully to
 * real severity bands. Wording is warm and plain, not jargon-heavy.
 */
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

// Reduced to 3 avatars — prevents pill from wrapping on 320px screens
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

const nextSteps: string[] = [
    "We'll email your full results summary shortly",
    "Check your spam folder if you don't see it",
    "A therapist will reach out within 24 hours",
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
            cta: "Chat us on WhatsApp",
        };
    }
    if (score <= 12) {
        return {
            band: "Mild Concern",
            gradient: "linear-gradient(135deg, #3d8b8b, #6fb8b8)",
            headline: "Some areas could use support",
            summary:
                "Your responses suggest you're experiencing some difficulties worth exploring. A therapist can help you build practical tools and understand patterns before they become harder to manage.",
            cta: "Chat us on WhatsApp",
        };
    }
    if (score <= 18) {
        return {
            band: "Moderate",
            gradient: "linear-gradient(135deg, #4e7a5e, #3d8b8b)",
            headline: "You deserve real support",
            summary:
                "Your responses suggest you're going through a genuinely difficult time. You're not alone — what you're feeling is valid, and speaking with a licensed therapist can make a significant difference.",
            cta: "Chat us on WhatsApp",
        };
    }
    return {
        band: "High Concern",
        gradient: "linear-gradient(135deg, #c0555a, #e07a7f)",
        headline: "Please reach out — you matter",
        summary:
            "Your responses suggest you're struggling significantly right now. We strongly encourage you to speak with a professional as soon as possible. Our therapists are here for you, without judgment.",
        cta: "Chat us on WhatsApp",
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
        (acc, val) => acc + val, 0
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

                        {/*
                          Social proof pill
                          ─────────────────
                          • 3 avatars only (was 6) — prevents wrapping on 320–360px
                          • whitespace-nowrap on the text lines
                          • overall pill stays on one row at all reasonable widths
                        */}
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
                            {/* Avatars */}
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

                            {/* Text — two tight lines, never wraps */}
                            <div style={{ lineHeight: 1.35, minWidth: 0 }}>
                                <span
                                    className="block text-xs font-semibold whitespace-nowrap"
                                    style={{ color: "var(--deep)", fontSize: 12 }}
                                >
                                    2,400+ people checked in
                                </span>
                                <span
                                    className="block whitespace-nowrap"
                                    style={{ color: "var(--text-muted)", fontSize: 11 }}
                                >
                                    Trusted · Confidential · Free
                                </span>
                            </div>
                        </div>

                        {/* Heading — accessible id for aria-labelledby */}
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
                            <em className="italic" style={{ color: "var(--sage-dark)" }}>
                                really
                            </em>{" "}
                            doing?
                        </h1>

                        <p
                            className="mb-5 font-light leading-relaxed"
                            style={{
                                fontSize: "clamp(15px, 4vw, 16px)",
                                color: "var(--text-muted)",
                                maxWidth: 420,
                            }}
                        >
                            This short, confidential check-in helps us understand where you
                            are right now, so you can get support.
                        </p>

                        {/* Trust badges */}
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

                        {/* Checklist card */}
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
                                        aria-hidden="true"
                                    />
                                    <span
                                        className="font-light leading-relaxed"
                                        style={{ fontSize: "clamp(14px, 3.8vw, 15px)", color: "var(--text-muted)" }}
                                    >
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {/* CTA */}
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
                        {/* Trust strip */}
                        {/* Quiet trust line — below CTA */}
                        <p className="flex items-center justify-center gap-1.5 mt-4 text-xs"
                            style={{ color: "var(--text-muted)" }}>
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
                <section
                    className="relative z-10 pt-20 pb-24 px-4 sm:px-6"
                    aria-labelledby={questionId}
                >
                    <div className="max-w-lg mx-auto animate-fade-up">

                        {/* Progress row */}
                        <div className="mb-8 sm:mb-10">
                            {/* Step label */}
                            <div className="flex justify-between items-center mb-2">
                                <span
                                    className="text-xs font-semibold uppercase tracking-widest"
                                    style={{ color: "var(--sage-dark)" }}
                                >
                                    {q.category}
                                </span>
                                <span
                                    className="text-xs font-medium tabular-nums"
                                    style={{ color: "var(--text-muted)" }}
                                >
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
                                    style={{
                                        width: 40,
                                        height: 40,
                                        background: "white",
                                        borderColor: "var(--border)",
                                        color: "var(--text-muted)",
                                    }}
                                >
                                    <ArrowLeft size={15} strokeWidth={2} aria-hidden="true" />
                                </button>

                                {/* Progress bar — labelled for screen readers */}
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
                                        style={{
                                            width: `${progress}%`,
                                            background: "linear-gradient(90deg, var(--sage), var(--teal))",
                                        }}
                                    />
                                </div>

                            </div>
                        </div>

                        {/* Question */}
                        <h2
                            id={questionId}
                            className="font-cormorant font-light mb-6 sm:mb-8"
                            style={{
                                fontSize: "clamp(22px, 5.5vw, 32px)",
                                lineHeight: 1.35,
                                color: "var(--deep)",
                                letterSpacing: "-0.01em",
                                wordBreak: "break-word",
                                overflowWrap: "break-word",
                            }}
                        >
                            {q.text}
                        </h2>

                        {/*
                          Options rendered as a radiogroup for full a11y:
                          - screen readers announce "1 of 4, Rarely or never, radio button"
                          - keyboard: arrow keys cycle options, Space/Enter selects
                          - selected state is communicated via aria-checked
                        */}
                        <div
                            role="radiogroup"
                            aria-labelledby={questionId}
                            className="flex flex-col gap-3"
                        >
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
                                            boxShadow: isSelected
                                                ? "0 0 0 3px rgba(123,169,139,0.13)"
                                                : "0 1px 4px rgba(28,58,58,0.04)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: 12,
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isSelected) e.currentTarget.style.borderColor = "var(--sage-light)";
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isSelected) e.currentTarget.style.borderColor = "var(--border)";
                                        }}
                                    >
                                        <span
                                            className="font-light leading-snug"
                                            style={{
                                                fontSize: "clamp(14px, 4vw, 15px)",
                                                flex: 1,
                                                whiteSpace: "normal",
                                                wordBreak: "break-word",
                                            }}
                                        >
                                            {opt.label}
                                        </span>

                                        {/* Visual radio indicator — hidden from AT (aria-checked handles it) */}
                                        <span
                                            className="flex-shrink-0 rounded-full flex items-center justify-center transition-all duration-200"
                                            aria-hidden="true"
                                            style={{
                                                width: 22,
                                                height: 22,
                                                minWidth: 22,
                                                background: isSelected ? "var(--sage)" : "transparent",
                                                border: isSelected
                                                    ? "2px solid var(--sage)"
                                                    : "2px solid var(--border)",
                                            }}
                                        >
                                            {isSelected && (
                                                <svg
                                                    width="11" height="11"
                                                    viewBox="0 0 11 11"
                                                    fill="none"
                                                    stroke="white"
                                                    strokeWidth="2.2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M2 5.5l2.5 2.5L9 3" />
                                                </svg>
                                            )}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                        {/* Privacy reassurance */}
                        <p className="flex items-center justify-center gap-1.5 mt-6 text-xs"
                            style={{ color: "var(--text-muted)" }}>
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
                <section
                    className="relative z-10 pt-20 pb-24 px-4 sm:px-6"
                    aria-labelledby="email-heading"
                >
                    <div className="max-w-md mx-auto animate-fade-up">

                        <div className="text-center mb-7 sm:mb-8">
                            <div
                                className="inline-flex items-center justify-center rounded-2xl mb-5"
                                aria-hidden="true"
                                style={{
                                    width: 56,
                                    height: 56,
                                    background: "linear-gradient(135deg, var(--sage), var(--teal))",
                                }}
                            >
                                <Mail size={24} color="white" strokeWidth={1.8} />
                            </div>
                            <h2
                                id="email-heading"
                                className="font-cormorant font-light mb-3"
                                style={{
                                    fontSize: "clamp(26px, 6vw, 38px)",
                                    color: "var(--deep)",
                                    letterSpacing: "-0.02em",
                                    lineHeight: 1.2,
                                }}
                            >
                                Almost there
                            </h2>
                            <p
                                className="font-light leading-relaxed"
                                style={{
                                    fontSize: "clamp(14px, 3.8vw, 15px)",
                                    color: "var(--text-muted)",
                                    maxWidth: 340,
                                    margin: "0 auto",
                                }}
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
                            {/* Decorative top bar */}
                            <div
                                aria-hidden="true"
                                className="absolute top-0 left-0 right-0"
                                style={{
                                    height: 2,
                                    background: "linear-gradient(90deg, var(--sage), var(--teal), var(--sage-light))",
                                }}
                            />

                            <div className="px-5 sm:px-7 pt-7 sm:pt-8 pb-6 sm:pb-7">
                                <form onSubmit={handleEmailSubmit} className="flex flex-col gap-5" noValidate>

                                    {/* Name */}
                                    <div>
                                        <label
                                            htmlFor="field-name"
                                            className="block text-xs font-semibold uppercase tracking-widest mb-2"
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
                                            aria-required="true"
                                            aria-invalid={!!errors.name}
                                            aria-describedby={errors.name ? "error-name" : undefined}
                                            onChange={(e) => {
                                                setName(e.target.value);
                                                setErrors((prev) => ({ ...prev, name: undefined }));
                                            }}
                                            className={`form-input${errors.name ? " form-input-error" : ""}`}
                                            // 16px prevents iOS Safari from zooming on focus
                                            style={{ fontSize: "16px" }}
                                        />
                                        {errors.name && (
                                            <p id="error-name" role="alert" className="text-xs mt-1.5" style={{ color: "var(--error)" }}>
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label
                                            htmlFor="field-email"
                                            className="block text-xs font-semibold uppercase tracking-widest mb-2"
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
                                            inputMode="email"
                                            aria-required="true"
                                            aria-invalid={!!errors.email}
                                            aria-describedby={errors.email ? "error-email" : undefined}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                setErrors((prev) => ({ ...prev, email: undefined }));
                                            }}
                                            className={`form-input${errors.email ? " form-input-error" : ""}`}
                                            style={{ fontSize: "16px" }}
                                        />
                                        {errors.email && (
                                            <p id="error-email" role="alert" className="text-xs mt-1.5" style={{ color: "var(--error)" }}>
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label
                                            htmlFor="field-phone"
                                            className="block text-xs font-semibold uppercase tracking-widest mb-2"
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
                                            inputMode="tel"
                                            aria-required="true"
                                            aria-invalid={!!errors.phone}
                                            aria-describedby={errors.phone ? "error-phone" : undefined}
                                            onChange={(e) => {
                                                setPhone(e.target.value);
                                                setErrors((prev) => ({ ...prev, phone: undefined }));
                                            }}
                                            className={`form-input${errors.phone ? " form-input-error" : ""}`}
                                            style={{ fontSize: "16px" }}
                                        />
                                        {errors.phone && (
                                            <p id="error-phone" role="alert" className="text-xs mt-1.5" style={{ color: "var(--error)" }}>
                                                {errors.phone}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full inline-flex items-center justify-center gap-2 font-medium text-white rounded-full transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teal)]"
                                        style={{
                                            padding: "16px 28px",
                                            fontSize: "clamp(14px, 4vw, 15px)",
                                            background: "linear-gradient(135deg, var(--sage-dark), var(--teal))",
                                            boxShadow: "0 4px 18px rgba(61,139,139,0.25)",
                                        }}
                                        aria-busy={submitting}
                                    >
                                        {submitting ? "Saving your results…" : "See My Results"}
                                        {!submitting && <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />}
                                    </button>

                                </form>

                                <div className="flex items-center justify-center gap-2 mt-5" aria-hidden="true">
                                    <Shield size={12} fill="#6fb8b8" stroke="#3d8b8b" strokeWidth={1.5} />
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
                                className="underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teal)] rounded-sm"
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
            <section
                className="relative z-10 pt-20 pb-24 px-4 sm:px-6"
                aria-labelledby="result-heading"
            >
                <div className="max-w-lg mx-auto animate-fade-up">

                    {/* Score banner */}
                    <div
                        className="rounded-3xl relative overflow-hidden mb-5 text-white text-center"
                        style={{
                            padding: "36px 24px",
                            background: result.gradient,
                        }}
                        role="region"
                        aria-label={`Your result: ${result.band}. Score ${totalScore} out of ${questions.length * 3}`}
                    >
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 opacity-10"
                            style={{
                                backgroundImage: "radial-gradient(circle at 20% 80%, white 0%, transparent 60%)",
                            }}
                        />
                        <p
                            aria-hidden="true"
                            className="text-xs uppercase tracking-widest opacity-75 mb-2 relative z-10"
                            style={{ letterSpacing: "0.14em" }}
                        >
                            Your result
                        </p>
                        <p
                            aria-hidden="true"
                            className="font-cormorant font-light relative z-10"
                            style={{ fontSize: "clamp(28px, 7vw, 42px)", lineHeight: 1.15 }}
                        >
                            {result.band}
                        </p>
                        <div className="flex items-center justify-center gap-3 mt-2 relative z-10" aria-hidden="true">
                            <div className="h-px flex-1 opacity-25" style={{ background: "white" }} />
                            <p className="text-xs opacity-60">
                                Score {totalScore} / {questions.length * 3}
                            </p>
                            <div className="h-px flex-1 opacity-25" style={{ background: "white" }} />
                        </div>
                    </div>

                    {/* Headline + summary */}
                    <div
                        className="rounded-2xl border p-5 sm:p-7 mb-4"
                        style={{
                            background: "white",
                            borderColor: "var(--border)",
                            boxShadow: "0 2px 12px rgba(28,58,58,0.05)",
                        }}
                    >
                        <h2
                            id="result-heading"
                            className="font-cormorant font-light mb-3"
                            style={{
                                fontSize: "clamp(20px, 5vw, 28px)",
                                color: "var(--deep)",
                                letterSpacing: "-0.01em",
                                lineHeight: 1.25,
                            }}
                        >
                            {result.headline}
                            {name ? `, ${name}` : ""}
                        </h2>
                        <p
                            className="font-light leading-relaxed"
                            style={{ fontSize: "clamp(14px, 3.8vw, 15px)", color: "var(--text-muted)" }}
                        >
                            {result.summary}
                        </p>
                    </div>

                    {/* What happens next */}
                    <div
                        className="rounded-2xl border p-5 sm:p-6 mb-6"
                        style={{
                            background: "rgba(123,169,139,0.06)",
                            borderColor: "rgba(123,169,139,0.22)",
                        }}
                    >
                        <p
                            className="text-xs font-semibold uppercase tracking-widest mb-4"
                            style={{ color: "var(--sage-dark)", letterSpacing: "0.1em" }}
                            id="next-steps-heading"
                        >
                            What happens next
                        </p>
                        <ul
                            className="flex flex-col gap-3"
                            aria-labelledby="next-steps-heading"
                            style={{ listStyle: "none", padding: 0, margin: 0 }}
                        >
                            {nextSteps.map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <CheckCircle
                                        size={15}
                                        fill="var(--sage)"
                                        stroke="white"
                                        strokeWidth={2.5}
                                        style={{ flexShrink: 0, marginTop: 2 }}
                                        aria-hidden="true"
                                    />
                                    <span
                                        className="font-light leading-relaxed"
                                        style={{ fontSize: "clamp(13px, 3.5vw, 14px)", color: "var(--text-muted)" }}
                                    >
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${result.cta} — opens WhatsApp`}
                            className="flex-1 inline-flex items-center justify-center gap-2 font-medium text-white rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teal)]"
                            style={{
                                padding: "16px 24px",
                                fontSize: "clamp(14px, 4vw, 15px)",
                                background: "linear-gradient(135deg, var(--sage-dark), var(--teal))",
                                boxShadow: "0 4px 18px rgba(61,139,139,0.25)",
                            }}
                        >
                            {result.cta}
                            <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
                        </Link>
                        <Link
                            href="/services"
                            className="flex-1 inline-flex items-center justify-center gap-2 font-medium rounded-full border transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teal)]"
                            style={{
                                padding: "16px 24px",
                                fontSize: "clamp(14px, 4vw, 15px)",
                                borderColor: "var(--border)",
                                color: "var(--sage-dark)",
                                background: "white",
                            }}
                        >
                            View our services
                        </Link>
                    </div>

                    {/* Spam notice + crisis line */}
                    <p
                        className="text-center text-xs mt-5 leading-relaxed"
                        style={{ color: "var(--text-muted)" }}
                    >
                        Didn&apos;t receive your email?{" "}
                        <span style={{ color: "var(--sage-dark)", fontWeight: 500 }}>
                            Check your spam or junk folder.
                        </span>{" "}
                        If you&apos;re in crisis, please contact{" "}
                        <a
                            href="tel:112"
                            className="underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teal)] rounded-sm"
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