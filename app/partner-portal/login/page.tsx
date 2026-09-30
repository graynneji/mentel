"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function PartnerPortalLoginPage() {
    const router = useRouter();
    const [step, setStep] = useState<"login" | "reset">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch("/api/partner-portal/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error?.message ?? "Could not log in.");
                return;
            }
            if (data.mustResetPassword) {
                setStep("reset");
            } else {
                router.push("/partner-portal");
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleReset(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        if (newPassword !== confirmPassword) {
            setError("Passwords don't match.");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/partner-portal/auth/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newPassword }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error?.message ?? "Could not set a new password.");
                return;
            }
            router.push("/partner-portal");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#f7fbf9" }}>
            <div className="w-full max-w-sm rounded-2xl bg-white border p-7" style={{ borderColor: "#e4eee8" }}>
                <h1 className="text-xl font-semibold mb-1" style={{ color: "#1c3a3a" }}>Partner Portal</h1>
                <p className="text-sm mb-6" style={{ color: "#7a9088" }}>Mentel API partner sign in</p>

                {step === "login" ? (
                    <form onSubmit={handleLogin} className="space-y-3">
                        <input
                            required type="email" placeholder="Email" value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ borderColor: "#e4eee8" }}
                        />
                        <input
                            required type="password" placeholder="Password" value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ borderColor: "#e4eee8" }}
                        />
                        {error && <p className="text-sm text-[#b3261e]">{error}</p>}
                        <button
                            type="submit" disabled={loading}
                            className="w-full py-2.5 rounded-xl bg-[#1c3a3a] text-white text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {loading && <Loader2 size={14} className="animate-spin" />} Sign in
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleReset} className="space-y-3">
                        <p className="text-sm mb-2" style={{ color: "#7a9088" }}>
                            First login — please set a new password (10+ characters).
                        </p>
                        <input
                            required type="password" placeholder="New password" value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ borderColor: "#e4eee8" }}
                        />
                        <input
                            required type="password" placeholder="Confirm new password" value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ borderColor: "#e4eee8" }}
                        />
                        {error && <p className="text-sm text-[#b3261e]">{error}</p>}
                        <button
                            type="submit" disabled={loading}
                            className="w-full py-2.5 rounded-xl bg-[#1c3a3a] text-white text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {loading && <Loader2 size={14} className="animate-spin" />} Set password &amp; continue
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
