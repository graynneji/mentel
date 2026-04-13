"use client";

// app/(hr)/hr/access/page.tsx
// HR "login" — the access code IS the credential.
// No username/password. Professional, reassuring design.
// After auth: redirect to /hr dashboard.

import { Suspense, useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Lock, Building2, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";

// ── Fallback shown while useSearchParams resolves ─────────────────────────────
function AccessFallback() {
    return (
        <div
            className="min-h-screen flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #0d1f1f 0%, #1a3030 50%, #0f2420 100%)" }}
        >
            <Loader2 size={28} style={{ color: "#4e8c6a", animation: "spin 1s linear infinite" }} />
        </div>
    );
}

// ── Inner component — useSearchParams() must live here, not in the page export ─
// Next.js cannot prerender pages that call useSearchParams() directly.
// The fix: move the hook into a child and wrap it in <Suspense> in the export.
function HRAccessContent() {
    const router = useRouter();
    const params = useSearchParams();
    const from = params.get("from") ?? "/hr";

    const [code, setCode] = useState("");
    const [showCode, setShowCode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { inputRef.current?.focus(); }, []);

    const handleCodeChange = (raw: string) => {
        const upper = raw.toUpperCase().replace(/[^A-Z0-9-]/g, "");
        setCode(upper);
        if (error) setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) return;
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/hr/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accessCode: code }),
            });
            const data = await res.json();

            if (!res.ok || !data.success) {
                setError(data.error ?? "Invalid access code. Please check with your HR contact.");
                setLoading(false);
                return;
            }

            sessionStorage.setItem("hr_company", JSON.stringify(data.company));
            router.push(from === "/hr/access" ? "/hr" : from);

        } catch {
            setError("Connection error. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ background: "linear-gradient(135deg, #0d1f1f 0%, #1a3030 50%, #0f2420 100%)" }}
        >
            {/* Subtle background texture */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div style={{
                    position: "absolute", top: "20%", right: "10%",
                    width: 400, height: 400, borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(78,140,106,0.06) 0%, transparent 70%)",
                }} />
                <div style={{
                    position: "absolute", bottom: "20%", left: "5%",
                    width: 300, height: 300, borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(61,139,139,0.05) 0%, transparent 70%)",
                }} />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Top bar */}
                <div className="px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden"
                            style={{ background: "linear-gradient(135deg, #4e8c6a, #3d8b8b)" }}>
                            <Image
                                src="/hr-logo.png"
                                alt="Mentel logo"
                                width={28}
                                height={28}
                                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                            />
                        </div>
                        <div>
                            <div className="text-white text-[14px] font-semibold">Mentel EAP</div>
                            <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>HR Portal</div>
                        </div>
                    </div>
                    <a href="/eap" className="text-[12px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                        Not an HR user?
                    </a>
                </div>

                {/* Main card */}
                <div className="flex-1 flex items-center justify-center px-4 py-12">
                    <div className="w-full max-w-sm">
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                                style={{ background: "rgba(78,140,106,0.15)", border: "1px solid rgba(78,140,106,0.25)" }}>
                                <Building2 size={28} style={{ color: "#4e8c6a" }} />
                            </div>
                        </div>

                        <h1 className="text-white text-center text-[24px] font-light mb-2"
                            style={{ fontFamily: "Georgia, serif", letterSpacing: "-0.3px" }}>
                            HR Portal Access
                        </h1>
                        <p className="text-center text-[14px] mb-8" style={{ color: "rgba(255,255,255,0.5)" }}>
                            Enter your company EAP access code to view your organisation's anonymised wellbeing data.
                        </p>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-5">
                                <label className="block text-[11px] font-medium mb-2 uppercase tracking-widest"
                                    style={{ color: "rgba(255,255,255,0.5)" }}>
                                    Company Access Code
                                </label>
                                <div className="relative">
                                    <input
                                        ref={inputRef}
                                        type={showCode ? "text" : "password"}
                                        value={code}
                                        onChange={e => handleCodeChange(e.target.value)}
                                        placeholder="ABC-XXXXXX"
                                        autoComplete="off"
                                        spellCheck={false}
                                        className="w-full px-4 py-4 rounded-xl text-[18px] font-mono font-semibold tracking-[4px] outline-none transition-all"
                                        style={{
                                            background: "rgba(255,255,255,0.07)",
                                            border: error ? "1px solid rgba(185,74,79,0.6)" : "1px solid rgba(255,255,255,0.12)",
                                            color: "#ffffff",
                                            caretColor: "#4e8c6a",
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCode(s => !s)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2"
                                        style={{ color: "rgba(255,255,255,0.35)", background: "none", border: "none", cursor: "pointer" }}>
                                        {showCode ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {error && (
                                    <p className="mt-2 text-[12px]" style={{ color: "#f08080" }}>{error}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={!code.trim() || loading}
                                className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl text-[14px] font-semibold text-white transition-all disabled:opacity-40"
                                style={{ background: "linear-gradient(135deg, #4e8c6a, #3d8b8b)" }}>
                                {loading ? (
                                    <><Loader2 size={16} className="animate-spin" /> Verifying…</>
                                ) : (
                                    <>Access Dashboard <ArrowRight size={16} /></>
                                )}
                            </button>
                        </form>

                        {/* Trust signals */}
                        <div className="mt-8 space-y-2.5">
                            {[
                                { icon: Shield, text: "You will only see anonymised aggregate data - never individual employee information." },
                                { icon: Lock, text: "This session is encrypted and expires after 24 hours." },
                            ].map(({ icon: Icon, text }) => (
                                <div key={text} className="flex items-start gap-2.5">
                                    <Icon size={20} style={{ color: "#4e8c6a", flexShrink: 0, marginTop: 2 }} />
                                    <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{text}</p>
                                </div>
                            ))}
                        </div>

                        <p className="mt-8 text-center text-[12px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                            Don't have an access code?{" "}
                            <a href="mailto:eap@trymentel.com" className="underline" style={{ color: "rgba(255,255,255,0.4)" }}>
                                Contact Mentel
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Page export — Suspense boundary is required for useSearchParams() at build ─
export default function HRAccessPage() {
    return (
        <Suspense fallback={<AccessFallback />}>
            <HRAccessContent />
        </Suspense>
    );
}