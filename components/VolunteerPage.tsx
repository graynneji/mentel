"use client";

import { useEffect, useState } from "react";
import { Send, Loader2, HeartHandshake, CheckCircle2 } from "lucide-react";

const AREAS_OF_INTEREST = [
    "Peer Support",
    "Event & Community Outreach",
    "Content & Social Media",
    "Admin & Operations",
    "Tech & Design",
    "Mental Health Advocacy",
];

const AVAILABILITY_OPTIONS = ["Weekdays", "Weekends", "Evenings", "Flexible / Anytime"];

interface FormState {
    name: string;
    email: string;
    phone: string;
    city: string;
    areasOfInterest: string[];
    availability: string;
    experience: string;
    motivation: string;
}

const initialForm: FormState = {
    name: "",
    email: "",
    phone: "",
    city: "",
    areasOfInterest: [],
    availability: "",
    experience: "",
    motivation: "",
};

export default function VolunteerPage() {
    const [form, setForm] = useState<FormState>(initialForm);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [serverError, setServerError] = useState("");

    function toggleArea(area: string) {
        setForm((prev) => ({
            ...prev,
            areasOfInterest: prev.areasOfInterest.includes(area)
                ? prev.areasOfInterest.filter((a) => a !== area)
                : [...prev.areasOfInterest, area],
        }));
        setErrors((prev) => ({ ...prev, areasOfInterest: "" }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setServerError("");

        // Lightweight client-side validation mirroring the server checks —
        // keeps the round trip fast for obviously-incomplete submissions.
        const nextErrors: Record<string, string> = {};
        if (!form.name || form.name.trim().length < 2) nextErrors.name = "Please enter your full name.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = "Please enter a valid email address.";
        if (form.phone.replace(/\D/g, "").length < 7) nextErrors.phone = "Please enter a valid phone number.";
        if (!form.city.trim()) nextErrors.city = "Please tell us your city.";
        if (form.areasOfInterest.length === 0) nextErrors.areasOfInterest = "Select at least one area.";
        if (!form.availability) nextErrors.availability = "Please select your availability.";
        if (form.motivation.trim().length < 20) nextErrors.motivation = "Tell us a little more (min 20 characters).";

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/volunteer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                if (data.errors) setErrors(data.errors);
                else setServerError(data.error ?? "Something went wrong. Please try again.");
                return;
            }
            setSent(true);

            // (window as any).fbq('track', 'Lead');
            window.fbq?.("track", "Lead", {
                content_name: "Volunteer Application",
            });

        } catch {
            setServerError("Network error. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    }

    if (sent) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg, #fbfdfc)" }}>
                <div className="max-w-md w-full text-center py-16 animate-fade-up">
                    <div
                        className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, var(--sage), var(--teal))" }}
                    >
                        <CheckCircle2 size={24} color="white" />
                    </div>
                    <h1 className="font-cormorant text-3xl font-semibold mb-3" style={{ color: "var(--deep)" }}>
                        Thank you for stepping up
                    </h1>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                        We&apos;ve received your volunteer application. Our team will reach out to{" "}
                        <strong>{form.email}</strong> within a few business days with next steps.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-4 py-16 md:py-24" style={{ background: "var(--bg, #fbfdfc)" }}>
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <div
                        className="w-12 h-12 rounded-full mx-auto mb-5 flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, var(--sage), var(--teal))" }}
                    >
                        <HeartHandshake size={20} color="white" />
                    </div>
                    <h1 className="font-cormorant text-4xl md:text-5xl font-light mb-3" style={{ color: "var(--deep)" }}>
                        Volunteer With Mentel
                    </h1>
                    <p className="text-sm md:text-base max-w-xl mx-auto leading-relaxed" style={{ color: "var(--text-muted)" }}>
                        Help us make mental health support more accessible across Nigeria. Tell us a bit
                        about yourself and how you&apos;d like to get involved.
                    </p>
                </div>

                <div
                    className="rounded-2xl p-6 md:p-10 border relative overflow-hidden"
                    style={{ background: "white", borderColor: "var(--border)" }}
                >
                    <div
                        className="absolute top-0 left-0 right-0 h-0.5"
                        style={{ background: "linear-gradient(90deg, var(--sage), var(--teal), var(--sage-light))" }}
                    />

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: "" }); }}
                                    placeholder="Your full name"
                                    className={`form-input ${errors.name ? "form-input-error" : ""}`}
                                />
                                {errors.name && <p className="text-xs mt-1" style={{ color: "var(--error)" }}>{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: "" }); }}
                                    placeholder="you@example.com"
                                    className={`form-input ${errors.email ? "form-input-error" : ""}`}
                                />
                                {errors.email && <p className="text-xs mt-1" style={{ color: "var(--error)" }}>{errors.email}</p>}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) => { setForm({ ...form, phone: e.target.value }); setErrors({ ...errors, phone: "" }); }}
                                    placeholder="080..."
                                    className={`form-input ${errors.phone ? "form-input-error" : ""}`}
                                />
                                {errors.phone && <p className="text-xs mt-1" style={{ color: "var(--error)" }}>{errors.phone}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
                                    City
                                </label>
                                <input
                                    type="text"
                                    value={form.city}
                                    onChange={(e) => { setForm({ ...form, city: e.target.value }); setErrors({ ...errors, city: "" }); }}
                                    placeholder="Lagos, Abuja, ..."
                                    className={`form-input ${errors.city ? "form-input-error" : ""}`}
                                />
                                {errors.city && <p className="text-xs mt-1" style={{ color: "var(--error)" }}>{errors.city}</p>}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-xs font-medium uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
                                Areas of Interest
                            </label>
                            <div className="grid sm:grid-cols-2 gap-2">
                                {AREAS_OF_INTEREST.map((area) => {
                                    const active = form.areasOfInterest.includes(area);
                                    return (
                                        <button
                                            type="button"
                                            key={area}
                                            onClick={() => toggleArea(area)}
                                            className="text-left text-sm px-3.5 py-2.5 rounded-xl border transition-all duration-150 cursor-pointer"
                                            style={{
                                                borderColor: active ? "var(--sage)" : "var(--border)",
                                                background: active ? "var(--mist, #f2f7f4)" : "white",
                                                color: active ? "var(--sage-dark)" : "var(--text-muted)",
                                                fontWeight: active ? 600 : 400,
                                            }}
                                        >
                                            {area}
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.areasOfInterest && <p className="text-xs mt-1.5" style={{ color: "var(--error)" }}>{errors.areasOfInterest}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-xs font-medium uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
                                Availability
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {AVAILABILITY_OPTIONS.map((option) => {
                                    const active = form.availability === option;
                                    return (
                                        <button
                                            type="button"
                                            key={option}
                                            onClick={() => { setForm({ ...form, availability: option }); setErrors({ ...errors, availability: "" }); }}
                                            className="text-sm px-4 py-2 rounded-full border transition-all duration-150 cursor-pointer"
                                            style={{
                                                borderColor: active ? "var(--sage)" : "var(--border)",
                                                background: active ? "var(--mist, #f2f7f4)" : "white",
                                                color: active ? "var(--sage-dark)" : "var(--text-muted)",
                                                fontWeight: active ? 600 : 400,
                                            }}
                                        >
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.availability && <p className="text-xs mt-1.5" style={{ color: "var(--error)" }}>{errors.availability}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
                                Relevant Experience <span className="normal-case font-normal">(optional)</span>
                            </label>
                            <textarea
                                value={form.experience}
                                onChange={(e) => setForm({ ...form, experience: e.target.value })}
                                placeholder="Any relevant skills, past volunteering, or professional background"
                                rows={3}
                                className="form-input resize-none"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
                                Why do you want to volunteer with us?
                            </label>
                            <textarea
                                value={form.motivation}
                                onChange={(e) => { setForm({ ...form, motivation: e.target.value }); setErrors({ ...errors, motivation: "" }); }}
                                placeholder="Tell us what draws you to this work"
                                rows={4}
                                className={`form-input resize-none ${errors.motivation ? "form-input-error" : ""}`}
                            />
                            {errors.motivation && <p className="text-xs mt-1" style={{ color: "var(--error)" }}>{errors.motivation}</p>}
                        </div>

                        {serverError && (
                            <p className="text-sm mb-4 text-center" style={{ color: "var(--error)" }}>{serverError}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-2xl text-white text-sm font-medium flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none duration-200 cursor-pointer"
                            style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
                            {loading ? "Submitting…" : "Submit Application"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
