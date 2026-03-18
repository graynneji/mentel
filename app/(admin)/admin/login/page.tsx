"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Shield } from "lucide-react";

export default function AdminLoginPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [shake, setShake] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/admin/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const data = await res.json() as { success: boolean; error?: string };

            if (data.success) {
                router.push("/admin");
                router.refresh();
            } else {
                setError("Incorrect password. Please try again.");
                setShake(true);
                setPassword("");
                setTimeout(() => setShake(false), 600);
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{
            minHeight: "100vh",
            background: "#f2f6f3",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px 16px",
            fontFamily: "DM Sans, sans-serif",
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20%      { transform: translateX(-8px); }
                    40%      { transform: translateX(8px); }
                    60%      { transform: translateX(-5px); }
                    80%      { transform: translateX(5px); }
                }
                .card { animation: fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) both; }
                .shake { animation: shake 0.5s ease both; }
                input:-webkit-autofill {
                    -webkit-box-shadow: 0 0 0 40px #f7faf8 inset !important;
                    -webkit-text-fill-color: #2c3e35 !important;
                }
            `}</style>

            <div className="card" style={{ width: "100%", maxWidth: 400 }}>

                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <div style={{
                        display: "inline-flex", alignItems: "center",
                        gap: 10, marginBottom: 8,
                    }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: "linear-gradient(135deg, #4e7a5e, #3d8b8b)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <Lock size={16} color="white" strokeWidth={2} />
                        </div>
                        <span style={{
                            fontFamily: "Cormorant Garamond, serif",
                            fontSize: 24, fontWeight: 400,
                            color: "#1c3a3a", letterSpacing: "-0.02em",
                        }}>
                            Mentel
                        </span>
                    </div>
                    <p style={{ fontSize: 13, color: "#7a8a7e", fontWeight: 300 }}>
                        Admin access only
                    </p>
                </div>

                {/* Card */}
                <div
                    className={shake ? "shake" : ""}
                    style={{
                        background: "white",
                        borderRadius: 20,
                        border: "1px solid #c8ddd2",
                        boxShadow: "0 4px 24px rgba(28,58,58,0.07)",
                        overflow: "hidden",
                        position: "relative",
                    }}
                >
                    {/* Top accent */}
                    <div style={{
                        height: 2,
                        background: "linear-gradient(90deg, #4e7a5e, #3d8b8b, #7ba98b)",
                    }} />

                    <div style={{ padding: "32px 32px 28px" }}>
                        <h1 style={{
                            fontFamily: "Cormorant Garamond, serif",
                            fontSize: 26, fontWeight: 400,
                            color: "#1c3a3a", marginBottom: 6,
                            letterSpacing: "-0.01em",
                        }}>
                            Welcome back
                        </h1>
                        <p style={{
                            fontSize: 13, color: "#7a8a7e",
                            fontWeight: 300, marginBottom: 28,
                            lineHeight: 1.6,
                        }}>
                            Enter your admin password to access the dashboard.
                        </p>

                        <form onSubmit={handleSubmit}>

                            {/* Password field */}
                            <div style={{ marginBottom: 20 }}>
                                <label style={{
                                    display: "block",
                                    fontSize: 11, fontWeight: 600,
                                    color: "#4e7a5e",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                    marginBottom: 8,
                                }}>
                                    Password
                                </label>
                                <div style={{ position: "relative" }}>
                                    <input
                                        type={showPass ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (error) setError("");
                                        }}
                                        placeholder="Enter admin password"
                                        autoFocus
                                        required
                                        style={{
                                            width: "100%",
                                            padding: "13px 44px 13px 16px",
                                            border: `1.5px solid ${error ? "#c0555a" : "#c8ddd2"}`,
                                            borderRadius: 12,
                                            fontSize: 14,
                                            color: "#2c3e35",
                                            background: "#f7faf8",
                                            outline: "none",
                                            fontFamily: "DM Sans, sans-serif",
                                            transition: "border-color 0.15s, background 0.15s",
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = "#4e7a5e";
                                            e.target.style.background = "white";
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = error ? "#c0555a" : "#c8ddd2";
                                            e.target.style.background = "#f7faf8";
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass((p) => !p)}
                                        style={{
                                            position: "absolute", right: 12,
                                            top: "50%", transform: "translateY(-50%)",
                                            background: "none", border: "none",
                                            cursor: "pointer", color: "#7a8a7e",
                                            padding: 4, display: "flex",
                                            alignItems: "center",
                                        }}
                                        tabIndex={-1}
                                    >
                                        {showPass
                                            ? <EyeOff size={16} strokeWidth={1.8} />
                                            : <Eye size={16} strokeWidth={1.8} />
                                        }
                                    </button>
                                </div>

                                {/* Error message */}
                                {error && (
                                    <div style={{
                                        display: "flex", alignItems: "center", gap: 6,
                                        marginTop: 8, fontSize: 12, color: "#c0555a",
                                    }}>
                                        <div style={{
                                            width: 5, height: 5, borderRadius: "50%",
                                            background: "#c0555a", flexShrink: 0,
                                        }} />
                                        {error}
                                    </div>
                                )}
                            </div>

                            {/* Submit button */}
                            <button
                                type="submit"
                                disabled={loading || !password.trim()}
                                style={{
                                    width: "100%",
                                    padding: "14px 24px",
                                    borderRadius: 99,
                                    border: "none",
                                    background: loading || !password.trim()
                                        ? "#c8ddd2"
                                        : "linear-gradient(135deg, #4e7a5e, #3d8b8b)",
                                    color: loading || !password.trim() ? "#7a8a7e" : "white",
                                    fontSize: 14, fontWeight: 600,
                                    cursor: loading || !password.trim() ? "not-allowed" : "pointer",
                                    fontFamily: "DM Sans, sans-serif",
                                    transition: "all 0.2s",
                                    boxShadow: loading || !password.trim()
                                        ? "none"
                                        : "0 4px 16px rgba(61,139,139,0.28)",
                                    display: "flex", alignItems: "center",
                                    justifyContent: "center", gap: 8,
                                }}
                            >
                                {loading ? (
                                    <>
                                        <svg
                                            width="15" height="15"
                                            viewBox="0 0 15 15"
                                            style={{ animation: "spin 0.7s linear infinite" }}
                                        >
                                            <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
                                            <circle cx="7.5" cy="7.5" r="6"
                                                fill="none" stroke="white"
                                                strokeWidth="2" strokeDasharray="28"
                                                strokeDashoffset="10"
                                            />
                                        </svg>
                                        Verifying…
                                    </>
                                ) : (
                                    "Sign in to Admin"
                                )}
                            </button>

                        </form>
                    </div>
                </div>

                {/* Footer note */}
                <div style={{
                    textAlign: "center", marginTop: 20,
                    display: "flex", alignItems: "center",
                    justifyContent: "center", gap: 5,
                }}>
                    <Shield size={12} style={{ color: "#a8c4b0" }} />
                    <span style={{ fontSize: 11, color: "#a8c4b0" }}>
                        Secured · Mentel Internal Dashboard
                    </span>
                </div>

            </div>
        </div>
    );
}