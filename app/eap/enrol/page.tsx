"use client";

// app/eap/enrol/page.tsx
// 3-step employee enrolment: access code → personal details → go to assessment.
// Collects phone number for therapist to reach employee via call/WhatsApp
// if email fails or for urgent crisis follow-up.

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    Shield, Lock, ArrowRight, Loader2, Eye, EyeOff,
    CheckCircle, ChevronDown, ChevronUp, Users, Heart, Phone,
} from "lucide-react";

type Step = "code" | "details" | "done";

interface CompanyInfo {
    name: string;
    plan: string;
    sessionCap: number;
    allowAnonymous: boolean;
}

// ── Step indicator ─────────────────────────────────────────────────────────────

function Steps({ current }: { current: Step }) {
    const steps = [
        { id: "code", label: "Access code" },
        { id: "details", label: "Your details" },
        { id: "done", label: "Assessment" },
    ] as const;
    const idx = steps.findIndex((s) => s.id === current);
    return (
        <div className="flex items-center justify-center gap-0 mb-8">
            {steps.map((step, i) => (
                <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                        <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300"
                            style={{
                                background: i <= idx
                                    ? "linear-gradient(135deg, var(--sage-dark), var(--teal))"
                                    : "rgba(123,169,139,0.12)",
                                color: i <= idx ? "white" : "var(--text-muted)",
                            }}
                        >
                            {i < idx ? <CheckCircle size={13} /> : i + 1}
                        </div>
                        <span
                            className="text-[12px] mt-1 font-medium hidden sm:block"
                            style={{ color: i <= idx ? "var(--sage-dark)" : "var(--text-muted)" }}
                        >
                            {step.label}
                        </span>
                    </div>
                    {i < steps.length - 1 && (
                        <div
                            className="h-px w-10 sm:w-14 mx-1 mb-4 sm:mb-5 transition-all duration-500"
                            style={{
                                background: i < idx
                                    ? "linear-gradient(90deg, var(--sage-dark), var(--teal))"
                                    : "rgba(123,169,139,0.2)",
                            }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

// ── Field ─────────────────────────────────────────────────────────────────────

function Field({
    label, value, onChange, placeholder, type = "text", required = false, hint,
}: {
    label: string; value: string; onChange: (v: string) => void;
    placeholder?: string; type?: string; required?: boolean; hint?: string;
}) {
    return (
        <div>
            <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--deep)" }}>
                {label}{required && <span className="ml-0.5" style={{ color: "var(--sage-dark)" }}>*</span>}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                className="w-full px-4 py-3 rounded-xl border text-[14px] outline-none transition-all"
                style={{ borderColor: "var(--border)", color: "var(--deep)", background: "white" }}
                onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--teal)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(61,139,139,0.1)";
                }}
                onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.boxShadow = "none";
                }}
            />
            {hint && (
                <p className="text-[12px] mt-1.5 font-normal" style={{ color: "var(--text-muted)" }}>{hint}</p>
            )}
        </div>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function EAPEnrolPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("code");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Step 1
    const [accessCode, setAccessCode] = useState("");
    const [showCode, setShowCode] = useState(false);
    const [company, setCompany] = useState<CompanyInfo | null>(null);

    // Step 2
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [department, setDepartment] = useState("");
    const [anonymous, setAnonymous] = useState(false);
    const [showWhyEmail, setShowWhyEmail] = useState(false);
    const [showWhyPhone, setShowWhyPhone] = useState(false);

    const codeInputRef = useRef<HTMLInputElement>(null);
    useEffect(() => { codeInputRef.current?.focus(); }, []);

    // ── Step 1: verify code ───────────────────────────────────────────────────

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!accessCode.trim()) return;
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/eap/enrol/check", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accessCode: accessCode.trim().toUpperCase() }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                setError(data.error ?? "Invalid access code. Please check with your HR team.");
                return;
            }
            setCompany(data.company);
            setStep("details");
        } catch {
            setError("Connection error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // ── Step 2: enrol ─────────────────────────────────────────────────────────

    const handleEnrol = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!anonymous && !name.trim()) {
            setError("Please enter your name, or choose to enrol anonymously.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/eap/enrol", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    accessCode: accessCode.trim().toUpperCase(),
                    name: anonymous ? undefined : name.trim() || undefined,
                    email: anonymous ? undefined : email.trim() || undefined,
                    phone: anonymous ? undefined : phone.trim() || undefined,
                    department: department.trim() || undefined,
                    anonymous,
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                setError(data.error ?? "Enrolment failed. Please try again.");
                return;
            }
            setStep("done");
        } catch {
            setError("Connection error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse at 20% 20%, rgba(123,169,139,0.06) 0%, transparent 60%), " +
                        "radial-gradient(ellipse at 80% 80%, rgba(61,139,139,0.04) 0%, transparent 60%)",
                }}
            />

            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Nav */}
                <div className="px-4 sm:px-6 py-5 flex items-center justify-between max-w-6xl mx-auto w-full">
                    <a href="/" className="flex items-center gap-2">
                        <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center overflow-hidden" // Added overflow-hidden
                            style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                        >
                            <Image
                                src="/hr-logo.png"
                                alt="Mentel logo"
                                width={28} // Match container width
                                height={28} // Match container height
                                className="w-full h-full object-cover" // Ensures it fills the div completely
                            />
                        </div>
                        <span className="text-[14px] font-semibold" style={{ color: "var(--deep)" }}>Mentel</span>
                    </a>
                    <div
                        className="flex items-center gap-1.5 text-[12px] px-2.5 py-1.5 rounded-full"
                        style={{ background: "rgba(78,140,106,0.08)", color: "var(--sage-dark)", border: "1px solid rgba(78,140,106,0.2)" }}
                    >
                        <Lock size={10} /> Confidential
                    </div>
                </div>

                <div className="flex-1 flex items-start sm:items-center justify-center px-4 py-8">
                    <div className="w-full max-w-md">

                        {/* Header */}
                        <div className="text-center mb-8">
                            <div
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium uppercase tracking-widest mb-4 border"
                                style={{ background: "rgba(123,169,139,0.10)", borderColor: "rgba(123,169,139,0.25)", color: "var(--sage-dark)" }}
                            >
                                <Heart size={20} color="orange" fill="orange" />
                                Employee Wellbeing Programme
                            </div>
                            <h1
                                className="font-cormorant text-3xl sm:text-4xl font-light mb-2"
                                style={{ color: "var(--deep)", letterSpacing: "-0.02em" }}
                            >
                                {/* {step === "done" ? "You're enrolled." : "Join your company's wellbeing programme"} */}
                                {step === "done" ? (
                                    "You're enrolled."
                                ) : (
                                    <>
                                        Join your company's{" "}
                                        <em className="italic" style={{ color: "var(--sage-dark)" }}>
                                            Wellbeing
                                        </em>{" "}
                                        Programme
                                    </>
                                )}
                            </h1>
                            {step === "code" && (
                                <p className="text-[13px] font-light sm:text-[14px] sm:font-normal" style={{ color: "var(--text-muted)" }}>
                                    Your HR team has given you a code. Enter it below to get started.
                                </p>
                            )}
                            {step === "details" && company && (
                                <p className="text-[14px] font-normal" style={{ color: "var(--text-muted)" }}>
                                    You're joining <strong style={{ color: "var(--deep)" }}>{company.name}</strong>'s EAP programme.{" "}
                                    {company.sessionCap} therapy sessions included.
                                </p>
                            )}
                        </div>

                        <Steps current={step} />

                        {/* ── STEP 1: Code ── */}
                        {step === "code" && (
                            <form onSubmit={handleVerifyCode} className="space-y-4">
                                <div>
                                    <label
                                        className="block text-[12px] font-medium mb-1.5 uppercase tracking-widest"
                                        style={{ color: "var(--text-muted)" }}
                                    >
                                        Company Access Code
                                    </label>
                                    <div className="relative">
                                        <input
                                            ref={codeInputRef}
                                            type={showCode ? "text" : "password"}
                                            value={accessCode}
                                            onChange={(e) =>
                                                setAccessCode(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""))
                                            }
                                            placeholder="e.g. ZNB-A3F2C1"
                                            autoComplete="off"
                                            spellCheck={false}
                                            className="w-full px-4 py-4 rounded-xl border text-[18px] font-mono font-semibold tracking-[3px] outline-none transition-all"
                                            style={{
                                                borderColor: error ? "rgba(185,74,79,0.5)" : "var(--border)",
                                                color: "var(--deep)",
                                                caretColor: "var(--teal)",
                                            }}
                                            onFocus={(e) => {
                                                e.currentTarget.style.borderColor = "var(--teal)";
                                                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(61,139,139,0.1)";
                                            }}
                                            onBlur={(e) => {
                                                e.currentTarget.style.borderColor = error ? "rgba(185,74,79,0.5)" : "var(--border)";
                                                e.currentTarget.style.boxShadow = "none";
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCode((s) => !s)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2"
                                            style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}
                                        >
                                            {showCode ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    {error && <p className="mt-2 text-[12px]" style={{ color: "#b94a4f" }}>{error}</p>}
                                    <p className="text-[12px] mt-2 font-normal" style={{ color: "var(--text-muted)" }}>
                                        Your access code was shared by your HR or People team.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!accessCode.trim() || loading}
                                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-[14px] font-semibold text-white transition-all disabled:opacity-40"
                                    style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                                >
                                    {loading
                                        ? <><Loader2 size={16} className="animate-spin" /> Verifying…</>
                                        : <>Continue <ArrowRight size={16} /></>
                                    }
                                </button>

                                <div className="space-y-2.5 pt-2">
                                    {[
                                        { icon: Shield, text: "Your employer never sees your individual answers." },
                                        // { icon: Shield, text: "Your employer never sees your individual answers - only anonymised group data." },
                                        { icon: Lock, text: "Clinical-grade privacy. NDPR and healthcare standards." },
                                        { icon: Users, text: "Your sessions are with a licensed therapist, not an AI." },
                                    ].map(({ icon: Icon, text }) => (
                                        <div key={text} className="flex items-start gap-2.5">
                                            <Icon size={20} style={{ color: "var(--sage-dark)", flexShrink: 0, marginTop: 2 }} />
                                            <p className="text-[12px] font-light sm:font-normal" style={{ color: "var(--text-muted)" }}>{text}</p>
                                        </div>
                                    ))}
                                </div>
                            </form>
                        )}

                        {/* ── STEP 2: Details ── */}
                        {step === "details" && (
                            <form onSubmit={handleEnrol} className="space-y-4">

                                {/* Anonymous toggle — only show if company allows it */}
                                {(company?.allowAnonymous ?? true) && (
                                    <div
                                        className="flex items-center justify-between px-4 py-3.5 rounded-xl border cursor-pointer transition-all"
                                        style={{
                                            background: anonymous ? "rgba(78,140,106,0.06)" : "white",
                                            borderColor: anonymous ? "rgba(78,140,106,0.4)" : "var(--border)",
                                        }}
                                        onClick={() => { setAnonymous((a) => !a); setError(""); }}
                                    >
                                        <div>
                                            <p className="text-[14px] font-semibold" style={{ color: "var(--deep)" }}>
                                                Enrol anonymously
                                            </p>
                                            <p className="text-[12px] font-normal" style={{ color: "var(--text-muted)" }}>
                                                Take the assessment without sharing your name, email, or phone
                                            </p>
                                        </div>
                                        <div
                                            className="w-10 h-6 rounded-full transition-all duration-200 relative flex-shrink-0"
                                            style={{ background: anonymous ? "var(--sage-dark)" : "rgba(123,169,139,0.2)" }}
                                        >
                                            <div
                                                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
                                                style={{ left: anonymous ? "22px" : "2px" }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Personal details — hidden when anonymous */}
                                {!anonymous && (
                                    <>
                                        <Field
                                            label="Your name"
                                            value={name}
                                            onChange={setName}
                                            placeholder="Ngozi Adeola"
                                            required
                                        />

                                        {/* Email */}
                                        <div>
                                            <Field
                                                label="Work email"
                                                value={email}
                                                onChange={setEmail}
                                                placeholder="ngozi@company.com"
                                                type="email"
                                                hint="So your matched therapist can contact you within 24 hours."
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowWhyEmail((s) => !s)}
                                                className="flex items-center gap-1 mt-1.5 text-[12px]"
                                                style={{ color: "var(--sage-dark)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                                            >
                                                Why do we need this? {showWhyEmail ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                                            </button>
                                            {showWhyEmail && (
                                                <div
                                                    className="mt-2 px-3 py-2.5 rounded-xl text-[12px] font-normal leading-relaxed"
                                                    style={{ background: "rgba(123,169,139,0.07)", color: "var(--text-muted)", border: "1px solid rgba(123,169,139,0.15)" }}
                                                >
                                                    Your email is used only to send your assessment results and connect you with your therapist.
                                                    It is <strong style={{ color: "var(--deep)" }}>never</strong> shared with your employer.
                                                </div>
                                            )}
                                        </div>

                                        {/* Phone — new field */}
                                        <div>
                                            <div>
                                                <label className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--deep)" }}>
                                                    Phone number
                                                    <span className="ml-1.5 text-[11px] font-normal px-1.5 py-0.5 rounded" style={{ background: "rgba(123,169,139,0.1)", color: "var(--sage-dark)" }}>
                                                        Recommended
                                                    </span>
                                                </label>
                                                <div className="relative">
                                                    <Phone
                                                        size={14}
                                                        className="absolute left-3.5 top-1/2 -translate-y-1/2"
                                                        style={{ color: "var(--text-muted)" }}
                                                    />
                                                    <input
                                                        type="tel"
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        placeholder="+234 800 000 0000"
                                                        className="w-full pl-9 pr-4 py-3 rounded-xl border text-[14px] outline-none transition-all"
                                                        style={{ borderColor: "var(--border)", color: "var(--deep)", background: "white" }}
                                                        onFocus={(e) => {
                                                            e.currentTarget.style.borderColor = "var(--teal)";
                                                            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(61,139,139,0.1)";
                                                        }}
                                                        onBlur={(e) => {
                                                            e.currentTarget.style.borderColor = "var(--border)";
                                                            e.currentTarget.style.boxShadow = "none";
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setShowWhyPhone((s) => !s)}
                                                className="flex items-center gap-1 mt-1.5 text-[12px]"
                                                style={{ color: "var(--sage-dark)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                                            >
                                                Why do we need this? {showWhyPhone ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                                            </button>
                                            {showWhyPhone && (
                                                <div
                                                    className="mt-2 px-3 py-2.5 rounded-xl text-[12px] font-normal leading-relaxed"
                                                    style={{ background: "rgba(123,169,139,0.07)", color: "var(--text-muted)", border: "1px solid rgba(123,169,139,0.15)" }}
                                                >
                                                    Your therapist may reach you via call or WhatsApp to schedule your session,
                                                    especially if email delivery is delayed. Your phone number is{" "}
                                                    <strong style={{ color: "var(--deep)" }}>never</strong> shared with your employer
                                                    and is only used by the clinical team.
                                                    {" "}It is entirely optional.
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* Department — shown to everyone */}
                                <Field
                                    label="Department"
                                    value={department}
                                    onChange={setDepartment}
                                    placeholder="e.g. Finance, Operations, Technology"
                                    hint="Optional. Helps your HR team see anonymous department-level trends."
                                />

                                {error && <p className="text-[12px]" style={{ color: "#b94a4f" }}>{error}</p>}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-[14px] font-semibold text-white transition-all disabled:opacity-40"
                                    style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                                >
                                    {loading
                                        ? <><Loader2 size={16} className="animate-spin" /> Enrolling…</>
                                        : <>Enrol & Start Assessment <ArrowRight size={16} /></>
                                    }
                                </button>

                                <p className="text-center text-[12px]" style={{ color: "var(--text-muted)" }}>
                                    <Shield size={20} style={{ display: "inline", marginRight: 4 }} />
                                    NDPR-compliant. Your data is encrypted and never sold or shared with your employer.
                                </p>
                            </form>
                        )}

                        {/* ── STEP 3: Done ── */}
                        {step === "done" && (
                            <div className="text-center space-y-6">
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                                    style={{ background: "rgba(78,140,106,0.12)" }}
                                >
                                    <CheckCircle size={32} style={{ color: "var(--sage-dark)" }} />
                                </div>

                                <div>
                                    <p className="text-[15px] font-light mb-1" style={{ color: "var(--deep)" }}>
                                        You're enrolled in <strong>{company?.name}</strong>'s EAP programme.
                                    </p>
                                    <p className="text-[14px] font-normal" style={{ color: "var(--text-muted)" }}>
                                        Next: take your wellbeing assessment. It takes about 8 minutes and helps us
                                        match you with the right therapist.
                                    </p>
                                </div>

                                <div
                                    className="rounded-2xl p-4 text-left space-y-2.5"
                                    style={{ background: "rgba(123,169,139,0.06)", border: "1px solid rgba(123,169,139,0.2)" }}
                                >
                                    {[
                                        "8 domains of wellbeing covered",
                                        "Personalised to your situation and relationship status",
                                        "Your employer won't see your individual answers",
                                        `${company?.sessionCap ?? 6} therapy sessions included`,
                                    ].map((item) => (
                                        <div key={item} className="flex items-center gap-2">
                                            <CheckCircle size={12} style={{ color: "var(--sage-dark)", flexShrink: 0 }} />
                                            <span className="text-[12px] font-normal" style={{ color: "var(--text-muted)" }}>{item}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => router.push("/eap/assessment")}
                                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-[13px] font-semibold text-white"
                                    style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                                >
                                    Begin My Wellbeing Assessment
                                    <ArrowRight size={16} />
                                </button>

                                <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                                    You can return and complete this later - your progress is saved.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}