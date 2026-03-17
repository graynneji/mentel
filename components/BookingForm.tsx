"use client";
import { useState } from "react";
import Script from "next/script";
import { ChevronDown, CheckCircle, Loader2, Zap, Calendar } from "lucide-react";

const REASONS = [
    "Anxiety", "Depression", "Marriage Counselling", "Grief & Loss",
    "Trauma & PTSD", "Stress Management", "Self-Esteem & Confidence",
    "Family Therapy", "Anger Management", "Life Transitions",
    "Relationship Issues", "Burnout", "Others",
];

// ── No `amount` here — amount lives only on the server ───────────────────────
const PLANS = [
    {
        id: "once",
        label: "Single Session",
        price: "₦10,000",
        originalPrice: "₦35,000",
        desc: "One-time · Limited offer",
        badge: "🔥 Limited",
        badgeStyle: { background: "rgba(192,85,90,0.10)", color: "var(--error)", borderColor: "rgba(192,85,90,0.25)" },
        perks: ["1 therapy session", "Licensed therapist", "Response within 24hrs"],
        icon: Zap,
    },
    {
        id: "monthly",
        label: "Monthly Plan",
        price: "₦35,000",
        originalPrice: null,
        desc: "4 sessions/month",
        badge: "⭐ Best value",
        badgeStyle: { background: "rgba(123,169,139,0.12)", color: "var(--sage-dark)", borderColor: "rgba(123,169,139,0.3)" },
        perks: ["4 sessions/month", "Priority therapist match", "Progress tracking"],
        icon: Calendar,
    },
];

interface FormData { name: string; email: string; phone: string; reason: string; plan: string; }
interface FormErrors { name?: string; email?: string; phone?: string; reason?: string; form?: string; }

declare global {
    interface Window {
        PaystackPop: {
            // resumeTransaction — opens the popup using a server-generated access_code.
            // No public key, no amount, no config in the browser at all.
            resumeTransaction: (
                accessCode: string,
                callbacks: {
                    onSuccess: (transaction: { reference: string }) => void;
                    onCancel: () => void;
                }
            ) => void;
        };
        ttq?: { track: (event: string, data?: Record<string, unknown>) => void };
    }
}

export default function BookingForm() {
    const [form, setForm] = useState<FormData>({ name: "", email: "", phone: "", reason: "", plan: "once" });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const validate = (): boolean => {
        const e: FormErrors = {};
        if (!form.name.trim() || form.name.trim().length < 2) e.name = "Please enter your full name.";
        if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Please enter a valid email address.";
        if ((form.phone.replace(/\D/g, "")).length < 7) e.phone = "Please enter a valid phone number.";
        if (!form.reason) e.reason = "Please select a reason for consultation.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleChange = (field: keyof FormData, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }));
    };

    const selectedPlan = PLANS.find((p) => p.id === form.plan)!;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        try {
            // ── Step 1: Ask server to initialize the transaction ──────────────
            // Server creates the transaction with the correct amount via Paystack API.
            // Returns access_code — a one-time token that opens the popup UI.
            // The browser never sees the amount, public key, or any payment config.
            const res = await fetch("/api/paystack/initialize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    reason: form.reason,
                    plan: form.plan,   // just the ID — server maps this to the real amount
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                setErrors(data.errors ?? { form: data.error ?? "Something went wrong. Please try again." });
                setLoading(false);
                return;
            }

            // ── Step 2: Open Paystack popup with the server's access_code ─────
            // resumeTransaction pops the same Paystack UI the user knows,
            // but initialized entirely from the server — nothing leaked client-side.
            window.PaystackPop.resumeTransaction(data.accessCode, {
                onSuccess: () => {
                    setLoading(false);
                    setSuccess(true);
                    // Webhook fires independently — emails sent there regardless of this
                    window.ttq?.track("CompletePayment");
                    window.ttq?.track("Schedule");
                    window.ttq?.track("CompleteRegistration");
                },
                onCancel: () => {
                    // User closed popup without paying — just reset the button
                    setLoading(false);
                },
            });

        } catch (err) {
            console.error("Payment init error:", err);
            setErrors({ form: "Network error. Please check your connection and try again." });
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center py-10 animate-fade-up">
                <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, var(--sage), var(--teal))" }}>
                    <CheckCircle size={30} color="white" />
                </div>
                <h3 className="font-cormorant text-2xl font-semibold mb-2" style={{ color: "var(--deep)" }}>
                    Booking Confirmed
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    Thank you, {form.name.split(" ")[0]}. Your therapist will reach out<br />
                    within 24 hours to schedule your session.
                </p>
            </div>
        );
    }

    return (
        <>
            {/* Load Paystack inline JS — needed for resumeTransaction */}
            <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />

            <form onSubmit={handleSubmit} noValidate>

                {/* Name */}
                <div className="mb-4">
                    <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
                        Full Name
                    </label>
                    <input type="text" value={form.name} onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Your full name" autoComplete="name"
                        className={`form-input ${errors.name ? "form-input-error" : ""}`} />
                    {errors.name && <p className="text-xs mt-1.5" style={{ color: "var(--error)" }}>{errors.name}</p>}
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
                        Email Address
                    </label>
                    <input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="you@example.com" autoComplete="email"
                        className={`form-input ${errors.email ? "form-input-error" : ""}`} />
                    {errors.email && <p className="text-xs mt-1.5" style={{ color: "var(--error)" }}>{errors.email}</p>}
                </div>

                {/* Phone */}
                <div className="mb-4">
                    <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
                        Phone Number
                    </label>
                    <input type="tel" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="+234 000 0000 000" autoComplete="tel"
                        className={`form-input ${errors.phone ? "form-input-error" : ""}`} />
                    {errors.phone && <p className="text-xs mt-1.5" style={{ color: "var(--error)" }}>{errors.phone}</p>}
                </div>

                {/* Reason */}
                <div className="mb-5">
                    <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
                        Reason for Consultation
                    </label>
                    <div className="relative">
                        <select value={form.reason} onChange={(e) => handleChange("reason", e.target.value)}
                            className={`form-input pr-10 ${errors.reason ? "form-input-error" : ""}`}>
                            <option value="" disabled>Select a reason&hellip;</option>
                            {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ color: "var(--text-muted)" }} />
                    </div>
                    {errors.reason && <p className="text-xs mt-1.5" style={{ color: "var(--error)" }}>{errors.reason}</p>}
                </div>

                {/* Plans */}
                <div className="mb-5">
                    <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
                        Choose a Plan
                    </p>
                    <div className="flex flex-col gap-2.5">
                        {PLANS.map((plan) => {
                            const isSelected = form.plan === plan.id;
                            const Icon = plan.icon;
                            return (
                                <label key={plan.id} className="cursor-pointer block">
                                    <input type="radio" name="plan" value={plan.id} checked={isSelected}
                                        onChange={(e) => handleChange("plan", e.target.value)} className="sr-only" />
                                    <div className="rounded-2xl border-2 p-4 transition-all duration-200 hover:-translate-y-0.5"
                                        style={{
                                            background: isSelected ? "rgba(123,169,139,0.08)" : "white",
                                            borderColor: isSelected ? "var(--sage)" : "var(--border)",
                                            boxShadow: isSelected ? "0 0 0 3px rgba(123,169,139,0.12)" : "none",
                                        }}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                                                style={{ background: isSelected ? "linear-gradient(135deg, var(--sage-dark), var(--teal))" : "rgba(123,169,139,0.10)" }}>
                                                <Icon size={16} color={isSelected ? "white" : "var(--sage-dark)"} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-sm font-semibold" style={{ color: "var(--deep)" }}>{plan.label}</span>
                                                    <span className="text-xs px-2 py-0.5 rounded-full border font-medium" style={plan.badgeStyle}>{plan.badge}</span>
                                                </div>
                                                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{plan.desc}</p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <span className="font-cormorant text-xl font-semibold block"
                                                    style={{ color: isSelected ? "var(--sage-dark)" : "var(--deep)" }}>{plan.price}</span>
                                                {plan.originalPrice && (
                                                    <span className="text-xs line-through opacity-40" style={{ color: "var(--text-muted)" }}>{plan.originalPrice}</span>
                                                )}
                                            </div>
                                        </div>
                                        {isSelected && (
                                            <div className="mt-3 pt-3 flex flex-wrap gap-2" style={{ borderTop: "1px solid rgba(123,169,139,0.2)" }}>
                                                {plan.perks.map((perk) => (
                                                    <span key={perk} className="text-xs px-2.5 py-1 rounded-full"
                                                        style={{ background: "rgba(123,169,139,0.10)", color: "var(--sage-dark)" }}>
                                                        ✓ {perk}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* General error */}
                {errors.form && (
                    <div className="rounded-xl px-4 py-3 mb-4 text-sm"
                        style={{ background: "rgba(192,85,90,0.08)", color: "var(--error)", border: "1px solid rgba(192,85,90,0.2)" }}>
                        {errors.form}
                    </div>
                )}

                {/* Legal */}
                <p className="text-center text-xs mb-4 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    By submitting you agree to our{" "}
                    <a href="/terms" className="underline transition-colors" style={{ color: "var(--teal)" }}>Terms of Service</a>{" "}
                    and{" "}
                    <a href="/privacy" className="underline transition-colors" style={{ color: "var(--teal)" }}>Privacy Policy</a>.
                </p>

                {/* Submit */}
                <button type="submit" disabled={loading}
                    className="w-full py-4 rounded-2xl text-white text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                    style={{
                        background: "linear-gradient(135deg, var(--sage-dark), var(--teal))",
                        boxShadow: loading ? "none" : "0 4px 20px rgba(61,139,139,0.25)",
                    }}>
                    {loading ? <><Loader2 size={16} className="animate-spin" />Preparing payment&hellip;</> : <>Continue to Payment — {selectedPlan.price}</>}
                </button>

            </form>
        </>
    );
}