"use client";
import { useState } from "react";
import BgBlobs from "@/components/BgBlobs";
import { Mail, Phone, MapPin, Send, Leaf, Loader2 } from "lucide-react";
function WhatsAppIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    );
}

function InstagramIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
    );
}

function TikTokIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.16 8.16 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z" />
        </svg>
    );
}

const contactInfo = [
    { icon: Mail, label: "Email", value: "hello@trymentel.com", href: "mailto:hello@trymentel.com" },
    { icon: Phone, label: "Phone", value: "+254 734 527 573", href: "tel:+254 734 527 573" },
    { icon: MapPin, label: "Location", value: "Lagos, Nigeria", href: "#" },
];

const socials = [
    { icon: WhatsAppIcon, label: "WhatsApp", href: "https://wa.me/+254734527573" },
    { icon: InstagramIcon, label: "Instagram", href: "https://instagram.com/mentel_ltd" },
    { icon: TikTokIcon, label: "TikTok", href: "https://tiktok.com/@mentelltd" },
];

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.name.trim()) e.name = "Name is required.";
        if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            e.email = "Valid email is required.";
        if (!form.message.trim() || form.message.trim().length < 10)
            e.message = "Please enter a message (at least 10 characters).";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        const res = await fetch("/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        });

        setLoading(false);

        if (res.ok) {
            setSent(true);
            setForm({ name: "", email: "", message: "" });
        }
    };

    return (
        <div className="relative">
            <BgBlobs />
            <div className="relative z-10 max-w-5xl mx-auto px-6 pt-28 pb-20">

                {/* Header */}
                <div className="max-w-xl mb-14">
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-6 border"
                        style={{ background: "rgba(123,169,139,0.10)", borderColor: "rgba(123,169,139,0.25)", color: "var(--sage-dark)" }}
                    >
                        <Leaf size={12} />
                        Get in Touch
                    </div>
                    <h1 className="font-cormorant text-5xl font-light mb-5 leading-tight" style={{ color: "var(--deep)" }}>
                        We&apos;re here<br />
                        <em className="italic" style={{ color: "var(--sage-dark)" }}>when you need us</em>.
                    </h1>
                    <p className="text-base font-light leading-relaxed" style={{ color: "var(--text-muted)" }}>
                        Have a question before booking? Reach out and our team will respond within one business day.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

                    {/* Left: contact info + socials */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div
                            className="rounded-2xl p-6 border"
                            style={{ background: "white", borderColor: "var(--border)" }}
                        >
                            <h3 className="font-cormorant text-xl font-semibold mb-5" style={{ color: "var(--deep)" }}>
                                Contact Info
                            </h3>
                            <div className="flex flex-col gap-4">
                                {contactInfo.map(({ icon: Icon, label, value, href }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        className="flex items-center gap-3 group"
                                    >
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                            style={{ background: "var(--mist)" }}
                                        >
                                            <Icon size={15} style={{ color: "var(--sage-dark)" }} />
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{label}</p>
                                            <p className="text-sm font-medium transition-colors group-hover:text-sage-dark" style={{ color: "var(--text)" }}>
                                                {value}
                                            </p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div
                            className="rounded-2xl p-6 border"
                            style={{ background: "white", borderColor: "var(--border)" }}
                        >
                            <h3 className="font-cormorant text-xl font-semibold mb-4" style={{ color: "var(--deep)" }}>
                                Social Media
                            </h3>
                            <div className="flex gap-3">
                                {socials.map(({ icon: Icon, label, href }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        className="w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:border-sage hover:bg-mist duration-200"
                                        style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                                    >
                                        <Icon />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Contact form */}
                    <div className="lg:col-span-3">
                        <div
                            className="rounded-2xl p-6 md:p-8 border relative overflow-hidden"
                            style={{ background: "white", borderColor: "var(--border)" }}
                        >
                            <div
                                className="absolute top-0 left-0 right-0 h-0.5"
                                style={{ background: "linear-gradient(90deg, var(--sage), var(--teal), var(--sage-light))" }}
                            />

                            {sent ? (
                                <div className="py-10 text-center animate-fade-up">
                                    <div
                                        className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                                        style={{ background: "linear-gradient(135deg, var(--sage), var(--teal))" }}
                                    >
                                        <Send size={20} color="white" />
                                    </div>
                                    <h3 className="font-cormorant text-2xl font-semibold mb-2" style={{ color: "var(--deep)" }}>
                                        Message Sent
                                    </h3>
                                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                                        We&apos;ll get back to you within one business day.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} noValidate>
                                    <h3 className="font-cormorant text-2xl font-semibold mb-5" style={{ color: "var(--deep)" }}>
                                        Send a Message
                                    </h3>

                                    <div className="mb-4">
                                        <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: "" }); }}
                                            placeholder="Your name"
                                            className={`form-input ${errors.name ? "form-input-error" : ""}`}
                                        />
                                        {errors.name && <p className="text-xs mt-1" style={{ color: "var(--error)" }}>{errors.name}</p>}
                                    </div>

                                    <div className="mb-4">
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

                                    <div className="mb-6">
                                        <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
                                            Message
                                        </label>
                                        <textarea
                                            value={form.message}
                                            onChange={(e) => { setForm({ ...form, message: e.target.value }); setErrors({ ...errors, message: "" }); }}
                                            placeholder="How can we help you?"
                                            rows={5}
                                            className={`form-input resize-none ${errors.message ? "form-input-error" : ""}`}
                                        />
                                        {errors.message && <p className="text-xs mt-1" style={{ color: "var(--error)" }}>{errors.message}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3.5 rounded-2xl text-white text-sm font-medium flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none duration-200"
                                        style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                                    >
                                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
                                        {loading ? "Sending…" : "Send Message"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
