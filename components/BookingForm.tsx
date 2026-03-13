"use client";
import { useState } from "react";
import { ChevronDown, CheckCircle, Loader2 } from "lucide-react";

const REASONS = [
    "Anxiety",
    "Depression",
    "Marriage Counselling",
    "Grief & Loss",
    "Trauma & PTSD",
    "Stress Management",
    "Self-Esteem & Confidence",
    "Family Therapy",
    "Anger Management",
    "Life Transitions",
    "Relationship Issues",
    "Burnout",
];

const PLANS = [
    { id: "once", label: "Single Session", price: "₦10,000", amount: 10000, desc: "one-time" },
    { id: "monthly", label: "Monthly Plan", price: "₦35,000", amount: 35000, desc: "per month" },
];

interface FormData {
    name: string;
    email: string;
    phone: string;
    reason: string;
    plan: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
    reason?: string;
}

declare global {
    interface Window {
        PaystackPop: {
            setup: (config: Record<string, unknown>) => { openIframe: () => void };
        };
    }
}

export default function BookingForm() {
    const [form, setForm] = useState<FormData>({
        name: "", email: "", phone: "", reason: "", plan: "once",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if (!form.name.trim() || form.name.trim().length < 2) {
            newErrors.name = "Please enter your full name.";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!form.email || !emailRegex.test(form.email)) {
            newErrors.email = "Please enter a valid email address.";
        }
        const phoneDigits = form.phone.replace(/\D/g, "");
        if (!phoneDigits || phoneDigits.length < 7) {
            newErrors.phone = "Please enter a valid phone number.";
        }
        if (!form.reason) {
            newErrors.reason = "Please select a reason for consultation.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field: keyof FormData, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const selectedPlan = PLANS.find((p) => p.id === form.plan)!;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        if (typeof window !== "undefined" && window.PaystackPop) {
            const handler = window.PaystackPop.setup({
                key: "pk_live_a79ee6fe415d50537d7c7c784fdb08763e6c75a9", // Replace with your Paystack public key
                email: form.email,
                amount: selectedPlan.amount * 100,
                currency: "NGN",
                ref: "MENTEL-" + Date.now(),
                metadata: {
                    custom_fields: [
                        { display_name: "Patient Name", variable_name: "name", value: form.name },
                        { display_name: "Phone", variable_name: "phone", value: form.phone },
                        { display_name: "Consultation", variable_name: "reason", value: form.reason },
                        { display_name: "Plan", variable_name: "plan", value: selectedPlan.label },
                    ],
                },
                onClose: () => setLoading(false),
                callback: () => {
                    setLoading(false);
                    setSuccess(true);
                },
            });
            handler.openIframe();
        } else {
            // Fallback if Paystack not loaded (dev mode)
            setTimeout(() => {
                setLoading(false);
                setSuccess(true);
            }, 1500);
        }
    };

    if (success) {
        return (
            <div className="text-center py-10 animate-fade-up">
                <div
                    className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, var(--sage), var(--teal))" }}
                >
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
        <form onSubmit={handleSubmit} noValidate>
            <script src="https://js.paystack.co/v1/inline.js" async />

            {/* Name */}
            <div className="mb-4">
                <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
                    Full Name
                </label>
                <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Your full name"
                    className={`form-input ${errors.name ? "form-input-error" : ""}`}
                    autoComplete="name"
                />
                {errors.name && <p className="text-xs mt-1.5" style={{ color: "var(--error)" }}>{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="mb-4">
                <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
                    Email Address
                </label>
                <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="you@example.com"
                    className={`form-input ${errors.email ? "form-input-error" : ""}`}
                    autoComplete="email"
                />
                {errors.email && <p className="text-xs mt-1.5" style={{ color: "var(--error)" }}>{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="mb-4">
                <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
                    Phone Number
                </label>
                <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+234 000 0000 000"
                    className={`form-input ${errors.phone ? "form-input-error" : ""}`}
                    autoComplete="tel"
                />
                {errors.phone && <p className="text-xs mt-1.5" style={{ color: "var(--error)" }}>{errors.phone}</p>}
            </div>

            {/* Reason */}
            <div className="mb-5">
                <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
                    Reason for Consultation
                </label>
                <div className="relative">
                    <select
                        value={form.reason}
                        onChange={(e) => handleChange("reason", e.target.value)}
                        className={`form-input pr-10 ${errors.reason ? "form-input-error" : ""}`}
                    >
                        <option value="" disabled>Select a reason&hellip;</option>
                        {REASONS.map((r) => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                    <ChevronDown
                        size={16}
                        className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: "var(--text-muted)" }}
                    />
                </div>
                {errors.reason && <p className="text-xs mt-1.5" style={{ color: "var(--error)" }}>{errors.reason}</p>}
            </div>

            {/* Payment Plans */}
            <div
                className="rounded-2xl p-4 mb-5 border"
                style={{ background: "rgba(123,169,139,0.06)", borderColor: "var(--border)" }}
            >
                <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
                    Choose a Payment Plan
                </p>
                <div className="grid grid-cols-2 gap-2.5 mb-3">
                    {PLANS.map((plan) => (
                        <label
                            key={plan.id}
                            className="cursor-pointer"
                        >
                            <input
                                type="radio"
                                name="plan"
                                value={plan.id}
                                checked={form.plan === plan.id}
                                onChange={(e) => handleChange("plan", e.target.value)}
                                className="sr-only"
                            />
                            <div
                                className="p-3 rounded-xl border-2 transition-all duration-200"
                                style={{
                                    background: form.plan === plan.id ? "rgba(123,169,139,0.10)" : "white",
                                    borderColor: form.plan === plan.id ? "var(--sage)" : "var(--border)",
                                }}
                            >
                                <span className="block text-sm font-medium" style={{ color: "var(--deep)" }}>
                                    {plan.label}
                                </span>
                                <span className="text-xs" style={{ color: form.plan === plan.id ? "var(--sage-dark)" : "var(--text-muted)" }}>
                                    {plan.price} / {plan.desc}
                                </span>
                            </div>
                        </label>
                    ))}
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    Payments are processed securely via Paystack. Cancel anytime.
                </p>
            </div>

            {/* Legal */}
            <p className="text-center text-xs mb-4 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                By submitting you agree to our{" "}
                <a href="/terms" className="underline transition-colors hover:text-sage-dark" style={{ color: "var(--teal)" }}>
                    Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="underline transition-colors hover:text-sage-dark" style={{ color: "var(--teal)" }}>
                    Privacy Policy
                </a>.
            </p>

            {/* Submit */}
            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl text-white text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                style={{
                    background: "linear-gradient(135deg, var(--sage-dark), var(--teal))",
                    boxShadow: loading ? "none" : "0 4px 20px rgba(61,139,139,0.25)",
                }}
            >
                {loading ? (
                    <>
                        <Loader2 size={16} className="animate-spin" />
                        Processing&hellip;
                    </>
                ) : (
                    "Continue to Payment"
                )}
            </button>
        </form>
    );
}
