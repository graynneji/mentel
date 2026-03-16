"use client";

import { useState } from "react";
import Link from "next/link";
import BgBlobs from "@/components/BgBlobs";
import { ArrowRight, ArrowLeft, Leaf, CheckCircle, Mail, Shield } from "lucide-react";

// ── Question bank ──────────────────────────────────────────────────────────────
// Blends PHQ-9 + GAD-7 inspired items, kept conversational and non-clinical.
const questions = [
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

// ── Result bands ───────────────────────────────────────────────────────────────
function getResult(score: number) {
    if (score <= 6) {
        return {
            band: "Thriving",
            color: "var(--sage)",
            gradient: "linear-gradient(135deg, #7ba98b, #a8c4b0)",
            headline: "You're in a good place",
            summary:
                "Your responses suggest you're managing well overall. Many people reach out proactively to build resilience, develop self-awareness, or navigate life transitions — therapy can be valuable even when you're not in crisis.",
            cta: "Explore proactive therapy",
        };
    } else if (score <= 12) {
        return {
            band: "Mild concern",
            color: "var(--teal)",
            gradient: "linear-gradient(135deg, #3d8b8b, #6fb8b8)",
            headline: "Some areas could use support",
            summary:
                "Your responses suggest you're experiencing some difficulties that are worth exploring. A therapist can help you build practical tools and understand patterns before they become harder to manage.",
            cta: "Book a free consultation",
        };
    } else if (score <= 18) {
        return {
            band: "Moderate",
            color: "var(--sage-dark)",
            gradient: "linear-gradient(135deg, #4e7a5e, #3d8b8b)",
            headline: "You deserve real support",
            summary:
                "Your responses suggest you're going through a genuinely difficult time. You're not alone — what you're feeling is valid, and speaking with a licensed therapist can make a significant difference.",
            cta: "Book your first session",
        };
    } else {
        return {
            band: "High concern",
            color: "#c0555a",
            gradient: "linear-gradient(135deg, #c0555a, #e07a7f)",
            headline: "Please reach out — you matter",
            summary:
                "Your responses suggest you're struggling significantly. We strongly encourage you to speak with a professional as soon as possible. Our therapists are here for you, without judgment.",
            cta: "Get urgent support",
        };
    }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AssessmentPage() {
    const [step, setStep] = useState<"intro" | "quiz" | "email" | "result">("intro");
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [emailError, setEmailError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
    const result = getResult(totalScore);
    const progress = ((current + 1) / questions.length) * 100;

    function handleAnswer(value: number) {
        const q = questions[current];
        setAnswers((prev) => ({ ...prev, [q.id]: value }));
        setTimeout(() => {
            if (current < questions.length - 1) {
                setCurrent((c) => c + 1);
            } else {
                setStep("email");
            }
        }, 320);
    }

    function handleBack() {
        if (current > 0) setCurrent((c) => c - 1);
        else setStep("intro");
    }

    async function handleEmailSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email.includes("@")) {
            setEmailError("Please enter a valid email address.");
            return;
        }
        setEmailError("");
        setSubmitting(true);

        // ── Send to your waitlist / CRM here ──────────────────────────────────────
        // Example: await fetch("/api/waitlist", {
        //   method: "POST",
        //   body: JSON.stringify({ name, email, score: totalScore, band: result.band, answers }),
        // });
        const res = await fetch("/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, score: totalScore, band: result.band, answers }),
        });
        // ─────────────────────────────────────────────────────────────────────────

        // await new Promise((r) => setTimeout(r, 900)); // simulate network
        setSubmitting(false);
        setStep("result");
    }

    // ── INTRO ──────────────────────────────────────────────────────────────────
    if (step === "intro") {
        return (
            <div className="relative min-h-screen">
                <BgBlobs />
                <section className="relative z-10 pt-24 pb-20 px-4 sm:px-6">
                    <div className="max-w-xl mx-auto text-center animate-fade-up">

                        <div
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-6 border"
                            style={{ background: "rgba(123,169,139,0.12)", borderColor: "rgba(123,169,139,0.3)", color: "var(--sage-dark)" }}
                        >
                            <Leaf size={11} />
                            Free · 2 Minutes · Confidential
                        </div>

                        <h1
                            className="font-cormorant text-4xl sm:text-5xl font-light leading-tight mb-5"
                            style={{ color: "var(--deep)", letterSpacing: "-0.02em" }}
                        >
                            How are you{" "}
                            <em className="italic" style={{ color: "var(--sage-dark)" }}>really</em>{" "}
                            doing?
                        </h1>

                        <p className="text-sm sm:text-base leading-relaxed mb-8 font-light" style={{ color: "var(--text-muted)", maxWidth: "400px", margin: "0 auto 2rem" }}>
                            This short, confidential check-in helps us understand where you are right now — so we can match you with the right support.
                        </p>

                        <div
                            className="rounded-2xl p-6 mb-8 border text-left"
                            style={{ background: "white", borderColor: "var(--border)" }}
                        >
                            <div className="space-y-3">
                                {[
                                    "8 simple questions about how you've been feeling",
                                    "Your personalised result in under 2 minutes",
                                    "No account needed — completely confidential",
                                    "Matched to the right therapist for your needs",
                                ].map((item) => (
                                    <div key={item} className="flex items-start gap-3">
                                        <CheckCircle size={16} style={{ color: "var(--sage)", flexShrink: 0, marginTop: "2px" }} />
                                        <span className="text-sm" style={{ color: "var(--text-muted)" }}>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => setStep("quiz")}
                            className="inline-flex items-center gap-2 text-sm font-medium text-white px-8 py-4 rounded-full transition-all hover:-translate-y-0.5 hover:shadow-lg duration-200 cursor-pointer"
                            style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                        >
                            Start Free Assessment
                            <ArrowRight size={16} />
                        </button>

                        <p className="text-xs mt-4" style={{ color: "var(--text-muted)" }}>
                            This is not a clinical diagnosis. For emergencies, please contact emergency services.
                        </p>
                    </div>
                </section>
            </div>
        );
    }

    // ── QUIZ ───────────────────────────────────────────────────────────────────
    if (step === "quiz") {
        const q = questions[current];
        const answered = answers[q.id];

        return (
            <div className="relative min-h-screen">
                <BgBlobs />
                <section className="relative z-10 pt-20 pb-20 px-4 sm:px-6">
                    <div className="max-w-lg mx-auto animate-fade-up">

                        {/* Progress bar */}
                        <div className="flex items-center gap-3 mb-10">
                            <button
                                onClick={handleBack}
                                className="w-8 h-8 rounded-full border flex items-center justify-center transition-all hover:bg-mist duration-150 flex-shrink-0"
                                style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                            >
                                <ArrowLeft size={14} />
                            </button>
                            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                                <div
                                    className="h-full rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${progress}%`, background: "linear-gradient(90deg, var(--sage), var(--teal))" }}
                                />
                            </div>
                            <span className="text-xs font-medium flex-shrink-0" style={{ color: "var(--text-muted)" }}>
                                {current + 1} / {questions.length}
                            </span>
                        </div>

                        {/* Category chip */}
                        <div
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-widest mb-4 border"
                            style={{ background: "rgba(123,169,139,0.10)", borderColor: "rgba(123,169,139,0.25)", color: "var(--sage-dark)" }}
                        >
                            {q.category}
                        </div>

                        {/* Question */}
                        <h2
                            className="font-cormorant text-2xl sm:text-3xl font-light leading-snug mb-8"
                            style={{ color: "var(--deep)" }}
                        >
                            {q.text}
                        </h2>

                        {/* Options */}
                        <div className="space-y-3">
                            {q.options.map((opt) => {
                                const isSelected = answered === opt.value;
                                return (
                                    <button
                                        key={opt.value}
                                        onClick={() => handleAnswer(opt.value)}
                                        className="w-full text-left px-5 py-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm cursor-pointer"
                                        style={{
                                            background: isSelected ? "rgba(123,169,139,0.12)" : "white",
                                            borderColor: isSelected ? "var(--sage)" : "var(--border)",
                                            color: isSelected ? "var(--sage-dark)" : "var(--text)",
                                            boxShadow: isSelected ? "0 0 0 3px rgba(123,169,139,0.15)" : "none",
                                        }}
                                    >
                                        <span className="text-sm sm:text-base font-light">{opt.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                    </div>
                </section>
            </div>
        );
    }

    // ── EMAIL CAPTURE (Waitlist) ────────────────────────────────────────────────
    if (step === "email") {
        return (
            <div className="relative min-h-screen">
                <BgBlobs />
                <section className="relative z-10 pt-24 pb-20 px-4 sm:px-6">
                    <div className="max-w-md mx-auto animate-fade-up">

                        <div className="text-center mb-8">
                            <div
                                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                                style={{ background: "linear-gradient(135deg, var(--sage), var(--teal))" }}
                            >
                                <Mail size={24} color="white" />
                            </div>
                            <h2
                                className="font-cormorant text-3xl sm:text-4xl font-light mb-3"
                                style={{ color: "var(--deep)" }}
                            >
                                Almost there
                            </h2>
                            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                                Enter your details to receive your personalised results and a follow-up from one of our therapists.
                            </p>
                        </div>

                        <div
                            className="rounded-2xl p-6 sm:p-8 border relative overflow-hidden"
                            style={{ background: "rgba(255,255,255,0.92)", borderColor: "var(--border)", backdropFilter: "blur(20px)" }}
                        >
                            <div
                                className="absolute top-0 left-0 right-0 h-0.5"
                                style={{ background: "linear-gradient(90deg, var(--sage), var(--teal), var(--sage-light))" }}
                            />

                            <form onSubmit={handleEmailSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "var(--sage-dark)" }}>
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="First name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "var(--sage-dark)" }}>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`form-input ${emailError ? "form-input-error" : ""}`}
                                        required
                                    />
                                    {emailError && (
                                        <p className="text-xs mt-1.5" style={{ color: "var(--error)" }}>{emailError}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="cursor-pointer w-full inline-flex items-center justify-center gap-2 text-sm font-medium text-white px-6 py-3.5 rounded-full transition-all hover:-translate-y-0.5 hover:shadow-lg duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                                    style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                                >
                                    {submitting ? "Saving your results…" : "See My Results"}
                                    {!submitting && <ArrowRight size={15} />}
                                </button>
                            </form>

                            <div className="flex items-center gap-2 mt-4 justify-center">
                                <Shield size={12} style={{ color: "var(--sage)" }} />
                                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                                    We never share your data. Unsubscribe any time.
                                </p>
                            </div>
                        </div>

                        <p className="text-center text-xs mt-4" style={{ color: "var(--text-muted)" }}>
                            By continuing you agree to our{" "}
                            <Link href="/privacy" className="underline underline-offset-2" style={{ color: "var(--sage-dark)" }}>
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
        <div className="relative min-h-screen">
            <BgBlobs />
            <section className="relative z-10 pt-24 pb-20 px-4 sm:px-6">
                <div className="max-w-lg mx-auto animate-fade-up">

                    {/* Score card */}
                    <div
                        className="rounded-2xl sm:rounded-3xl p-8 sm:p-10 relative overflow-hidden mb-6 text-white text-center"
                        style={{ background: result.gradient }}
                    >
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, white 0%, transparent 60%)" }} />
                        <p className="text-xs uppercase tracking-widest opacity-80 mb-2 relative z-10">Your result</p>
                        <p className="font-cormorant text-3xl sm:text-4xl font-semibold mb-1 relative z-10">{result.band}</p>
                        <div className="flex items-center justify-center gap-2 relative z-10">
                            <div className="h-px flex-1 opacity-30" style={{ background: "white" }} />
                            <p className="text-xs opacity-70">Score {totalScore} / {questions.length * 3}</p>
                            <div className="h-px flex-1 opacity-30" style={{ background: "white" }} />
                        </div>
                    </div>

                    {/* Summary */}
                    <div
                        className="rounded-2xl p-6 sm:p-8 border mb-5"
                        style={{ background: "white", borderColor: "var(--border)" }}
                    >
                        <h2
                            className="font-cormorant text-2xl sm:text-3xl font-light mb-3"
                            style={{ color: "var(--deep)" }}
                        >
                            {result.headline}
                            {name ? `, ${name}` : ""}
                        </h2>
                        <p className="text-sm sm:text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
                            {result.summary}
                        </p>
                    </div>

                    {/* Next steps */}
                    <div
                        className="rounded-2xl p-6 border mb-6"
                        style={{ background: "rgba(123,169,139,0.06)", borderColor: "rgba(123,169,139,0.25)" }}
                    >
                        <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "var(--sage-dark)" }}>
                            What happens next
                        </p>
                        <div className="space-y-2.5">
                            {[
                                "We'll email your full results summary shortly",
                                "A therapist will reach out within 24 hours",
                                "Your first consultation is free and judgment-free",
                            ].map((item) => (
                                <div key={item} className="flex items-start gap-3">
                                    <CheckCircle size={15} style={{ color: "var(--sage)", flexShrink: 0, marginTop: "2px" }} />
                                    <span className="text-sm" style={{ color: "var(--text-muted)" }}>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                            href="/#book"
                            className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-medium text-white px-6 py-3.5 rounded-full transition-all hover:-translate-y-0.5 hover:shadow-lg duration-200"
                            style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                        >
                            {result.cta}
                            <ArrowRight size={15} />
                        </Link>
                        <Link
                            href="/services"
                            className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-medium px-6 py-3.5 rounded-full border transition-all hover:-translate-y-0.5 hover:shadow-sm duration-200"
                            style={{ borderColor: "var(--border)", color: "var(--sage-dark)" }}
                        >
                            View our services
                        </Link>
                    </div>

                    <p className="text-center text-xs mt-6" style={{ color: "var(--text-muted)" }}>
                        This is not a clinical diagnosis. If you are in crisis, please contact{" "}
                        <a href="tel:112" className="underline underline-offset-2" style={{ color: "var(--sage-dark)" }}>
                            emergency services
                        </a>
                        .
                    </p>

                </div>
            </section>
        </div>
    );
}