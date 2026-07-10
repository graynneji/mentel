"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    ShieldCheck, Upload, Loader2, CheckCircle2, FileText, X,
} from "lucide-react";

const ROLES = [
    "Peer Support",
    "Event & Community Outreach",
    "Content & Social Media",
    "Admin & Operations",
    "Tech & Design",
    "Mental Health Advocacy",
    "Clinical / Therapy Support",
];

const LICENSE_BODIES = ["AHPCN", "NACP", "APROCON", "MDCN", "Other"];

interface FormState {
    fullName: string;
    email: string;
    phone: string;
    city: string;
    role: string;
    isLicensedProfessional: boolean;
    licenseBody: string;
    licenseNumber: string;
    licenseDocumentUrl: string;
    ninNumber: string;
    ninDocumentUrl: string;
    cvDocumentUrl: string;
}

const initialForm: FormState = {
    fullName: "",
    email: "",
    phone: "",
    city: "",
    role: "",
    isLicensedProfessional: false,
    licenseBody: "",
    licenseNumber: "",
    licenseDocumentUrl: "",
    ninNumber: "",
    ninDocumentUrl: "",
    cvDocumentUrl: "",
};

/** A single file upload slot: pick a file, it uploads immediately, shows the result. */
function DocumentUpload({
    label,
    hint,
    kind,
    value,
    onChange,
    required,
}: {
    label: string;
    hint?: string;
    kind: "cv" | "license" | "nin";
    value: string;
    onChange: (url: string) => void;
    required?: boolean;
}) {
    const [uploading, setUploading] = useState(false);
    const [fileName, setFileName] = useState("");
    const [error, setError] = useState("");

    async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;

        setUploading(true);
        setError("");
        try {
            const body = new FormData();
            body.append("file", file);
            body.append("kind", kind);
            const res = await fetch("/api/volunteer-verification/upload", { method: "POST", body });
            const data = await res.json();
            if (!res.ok || !data.success) {
                setError(data.error ?? "Upload failed. Please try again.");
                return;
            }
            onChange(data.url);
            setFileName(file.name);
        } catch {
            setError("Network error uploading file.");
        } finally {
            setUploading(false);
        }
    }

    return (
        <div>
            <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
                {label} {required && <span style={{ color: "var(--error)" }}>*</span>}
            </label>
            {hint && <p className="text-xs mb-2" style={{ color: "var(--text-muted)", opacity: 0.8 }}>{hint}</p>}

            {value ? (
                <div
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border"
                    style={{ borderColor: "var(--sage)", background: "var(--mist, #f2f7f4)" }}
                >
                    <FileText size={15} style={{ color: "var(--sage-dark)" }} />
                    <span className="text-sm flex-1 truncate min-w-0" style={{ color: "var(--sage-dark)" }}>
                        {fileName || "Document uploaded"}
                    </span>
                    <button type="button" onClick={() => { onChange(""); setFileName(""); }} className="shrink-0">
                        <X size={14} style={{ color: "var(--sage-dark)" }} />
                    </button>
                </div>
            ) : (
                <label
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer text-sm transition-colors"
                    style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                >
                    {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                    {uploading ? "Uploading…" : "Click to upload (PDF, DOC, or image, max 8MB)"}
                    <input type="file" accept=".pdf,.doc,.docx,image/jpeg,image/png,image/webp" className="hidden" disabled={uploading} onChange={handleFile} />
                </label>
            )}
            {error && <p className="text-xs mt-1" style={{ color: "var(--error)" }}>{error}</p>}
        </div>
    );
}

export default function VolunteerVerificationPage() {
    const [form, setForm] = useState<FormState>(initialForm);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [serverError, setServerError] = useState("");

    function set<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((f) => ({ ...f, [key]: value }));
        setErrors((e) => ({ ...e, [key]: "" }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setServerError("");

        const nextErrors: Record<string, string> = {};
        if (!form.fullName || form.fullName.trim().length < 2) nextErrors.fullName = "Please enter your full name.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = "Please enter a valid email address.";
        if (form.phone.replace(/\D/g, "").length < 7) nextErrors.phone = "Please enter a valid phone number.";
        if (!form.city.trim()) nextErrors.city = "Please tell us your city.";
        if (!form.role) nextErrors.role = "Please select what you'd like to volunteer for.";
        if (!/^\d{11}$/.test(form.ninNumber.trim())) nextErrors.ninNumber = "Please enter a valid 11-digit NIN.";
        if (!form.cvDocumentUrl) nextErrors.cvDocumentUrl = "Please upload your CV.";
        if (form.isLicensedProfessional && !form.licenseBody) nextErrors.licenseBody = "Please select your licensing body.";
        if (form.isLicensedProfessional && !form.licenseDocumentUrl) nextErrors.licenseDocumentUrl = "Please upload your license document.";

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/volunteer-verification", {
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
        } catch {
            setServerError("Network error. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen" style={{ background: "var(--bg, #fbfdfc)" }}>
            {/* Minimal header — just the logo, no site navigation. This is a
                focused intake flow, not a page for browsing the rest of the site. */}
            {/* <header className="w-full px-6 py-5 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="max-w-2xl mx-auto flex items-center gap-2.5">
                    <Link href="/" className="flex items-center gap-2.5">
                        <Image src="/logo.png" alt="Mentel" width={36} height={20} className="object-contain" priority />
                        <span className="font-cormorant text-lg font-semibold" style={{ color: "var(--deep)" }}>Mentel</span>
                    </Link>
                    <span className="text-xs px-2 py-0.5 rounded-full ml-1" style={{ background: "rgba(123,169,139,0.12)", color: "var(--sage-dark)" }}>
                        Volunteer Verification
                    </span>
                </div>
            </header> */}

            <div className="px-4 py-12 md:py-16">
                <div className="max-w-2xl mx-auto">
                    {sent ? (
                        <div className="text-center py-16 animate-fade-up">
                            <div
                                className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center"
                                style={{ background: "linear-gradient(135deg, var(--sage), var(--teal))" }}
                            >
                                <CheckCircle2 size={24} color="white" />
                            </div>
                            <h1 className="font-cormorant text-3xl font-semibold mb-3" style={{ color: "var(--deep)" }}>
                                Verification submitted
                            </h1>
                            <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: "var(--text-muted)" }}>
                                Thank you. Our team will review your documents and get back to you at{" "}
                                <strong>{form.email}</strong> within a few business days.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-10">
                                <div
                                    className="w-12 h-12 rounded-full mx-auto mb-5 flex items-center justify-center"
                                    style={{ background: "linear-gradient(135deg, var(--sage), var(--teal))" }}
                                >
                                    <ShieldCheck size={20} color="white" />
                                </div>
                                <h1 className="font-cormorant text-3xl md:text-4xl font-light mb-3" style={{ color: "var(--deep)" }}>
                                    Verify your volunteer application
                                </h1>
                                <p className="text-sm max-w-lg mx-auto leading-relaxed" style={{ color: "var(--text-muted)" }}>
                                    To keep our community safe, we ask every volunteer to verify their identity and,
                                    where relevant, their professional credentials. This takes a few minutes.
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

                                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>Full Name</label>
                                            <input className={`form-input ${errors.fullName ? "form-input-error" : ""}`} value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Your full legal name" />
                                            {errors.fullName && <p className="text-xs mt-1" style={{ color: "var(--error)" }}>{errors.fullName}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>Email</label>
                                            <input type="email" className={`form-input ${errors.email ? "form-input-error" : ""}`} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" />
                                            {errors.email && <p className="text-xs mt-1" style={{ color: "var(--error)" }}>{errors.email}</p>}
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>Phone Number</label>
                                            <input type="tel" className={`form-input ${errors.phone ? "form-input-error" : ""}`} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="080..." />
                                            {errors.phone && <p className="text-xs mt-1" style={{ color: "var(--error)" }}>{errors.phone}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>City</label>
                                            <input className={`form-input ${errors.city ? "form-input-error" : ""}`} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Lagos, Abuja, ..." />
                                            {errors.city && <p className="text-xs mt-1" style={{ color: "var(--error)" }}>{errors.city}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>What would you like to volunteer for?</label>
                                        <div className="grid sm:grid-cols-2 gap-2">
                                            {ROLES.map((r) => {
                                                const active = form.role === r;
                                                return (
                                                    <button
                                                        type="button"
                                                        key={r}
                                                        onClick={() => set("role", r)}
                                                        className="text-left text-sm px-3.5 py-2.5 rounded-xl border transition-all duration-150 cursor-pointer"
                                                        style={{
                                                            borderColor: active ? "var(--sage)" : "var(--border)",
                                                            background: active ? "var(--mist, #f2f7f4)" : "white",
                                                            color: active ? "var(--sage-dark)" : "var(--text-muted)",
                                                            fontWeight: active ? 600 : 400,
                                                        }}
                                                    >
                                                        {r}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {errors.role && <p className="text-xs mt-1.5" style={{ color: "var(--error)" }}>{errors.role}</p>}
                                    </div>

                                    {/* Licensed professional toggle */}
                                    <div className="pt-2 border-t" style={{ borderColor: "var(--border)" }}>
                                        <label className="block text-xs font-medium uppercase tracking-widest mb-2 mt-4" style={{ color: "var(--text-muted)" }}>
                                            Are you a licensed mental health professional?
                                        </label>
                                        <div className="flex gap-2">
                                            {[
                                                { label: "Yes", value: true },
                                                { label: "No", value: false },
                                            ].map((opt) => {
                                                const active = form.isLicensedProfessional === opt.value;
                                                return (
                                                    <button
                                                        type="button"
                                                        key={opt.label}
                                                        onClick={() => set("isLicensedProfessional", opt.value)}
                                                        className="px-5 py-2 rounded-full border text-sm cursor-pointer transition-all"
                                                        style={{
                                                            borderColor: active ? "var(--sage)" : "var(--border)",
                                                            background: active ? "var(--mist, #f2f7f4)" : "white",
                                                            color: active ? "var(--sage-dark)" : "var(--text-muted)",
                                                            fontWeight: active ? 600 : 400,
                                                        }}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {form.isLicensedProfessional && (
                                        <div className="flex flex-col gap-4 pl-4 border-l-2" style={{ borderColor: "var(--sage-light)" }}>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>Licensing body</label>
                                                    <select className={`form-input ${errors.licenseBody ? "form-input-error" : ""}`} value={form.licenseBody} onChange={(e) => set("licenseBody", e.target.value)}>
                                                        <option value="">Select...</option>
                                                        {LICENSE_BODIES.map((b) => <option key={b} value={b}>{b}</option>)}
                                                    </select>
                                                    {errors.licenseBody && <p className="text-xs mt-1" style={{ color: "var(--error)" }}>{errors.licenseBody}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
                                                        License / registration number <span className="normal-case font-normal">(optional)</span>
                                                    </label>
                                                    <input className="form-input" value={form.licenseNumber} onChange={(e) => set("licenseNumber", e.target.value)} placeholder="e.g. AHPCN/2024/00123" />
                                                </div>
                                            </div>
                                            <DocumentUpload
                                                label="License / registration document"
                                                kind="license"
                                                value={form.licenseDocumentUrl}
                                                onChange={(url) => set("licenseDocumentUrl", url)}
                                                required
                                            />
                                            {errors.licenseDocumentUrl && <p className="text-xs -mt-2" style={{ color: "var(--error)" }}>{errors.licenseDocumentUrl}</p>}
                                        </div>
                                    )}

                                    {/* Identity verification */}
                                    <div className="pt-2 border-t flex flex-col gap-4" style={{ borderColor: "var(--border)" }}>
                                        <p className="text-xs font-medium uppercase tracking-widest mt-4" style={{ color: "var(--text-muted)" }}>Identity verification</p>
                                        <div>
                                            <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
                                                National Identification Number (NIN)
                                            </label>
                                            <input
                                                inputMode="numeric"
                                                maxLength={11}
                                                className={`form-input ${errors.ninNumber ? "form-input-error" : ""}`}
                                                value={form.ninNumber}
                                                onChange={(e) => set("ninNumber", e.target.value.replace(/\D/g, ""))}
                                                placeholder="11-digit NIN"
                                            />
                                            {errors.ninNumber && <p className="text-xs mt-1" style={{ color: "var(--error)" }}>{errors.ninNumber}</p>}
                                            <p className="text-xs mt-1" style={{ color: "var(--text-muted)", opacity: 0.75 }}>
                                                Your NIN is used for identity verification only and is kept strictly confidential.
                                            </p>
                                        </div>
                                        <DocumentUpload
                                            label="NIN slip or ID document"
                                            hint="Optional, but speeds up verification."
                                            kind="nin"
                                            value={form.ninDocumentUrl}
                                            onChange={(url) => set("ninDocumentUrl", url)}
                                        />
                                    </div>

                                    {/* CV */}
                                    <div className="pt-2 border-t" style={{ borderColor: "var(--border)" }}>
                                        <div className="mt-4">
                                            <DocumentUpload
                                                label="CV / Resume"
                                                kind="cv"
                                                value={form.cvDocumentUrl}
                                                onChange={(url) => set("cvDocumentUrl", url)}
                                                required
                                            />
                                            {errors.cvDocumentUrl && <p className="text-xs mt-1" style={{ color: "var(--error)" }}>{errors.cvDocumentUrl}</p>}
                                        </div>
                                    </div>

                                    {serverError && (
                                        <p className="text-sm text-center" style={{ color: "var(--error)" }}>{serverError}</p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3.5 rounded-2xl text-white text-sm font-medium flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none duration-200 cursor-pointer"
                                        style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                                    >
                                        {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={15} />}
                                        {loading ? "Submitting…" : "Submit for Verification"}
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
