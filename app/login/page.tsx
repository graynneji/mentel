// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Eye, EyeOff, Lock, Shield } from "lucide-react";

// export default function AdminLoginPage() {
//     const router = useRouter();
//     const [password, setPassword] = useState("");
//     const [showPass, setShowPass] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//     const [shake, setShake] = useState(false);

//     async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//         e.preventDefault();
//         setError("");
//         setLoading(true);

//         try {
//             const res = await fetch("/api/admin/auth", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ password }),
//             });

//             const data = await res.json() as { success: boolean; error?: string };

//             if (data.success) {
//                 router.push("/admin");
//                 router.refresh();
//             } else {
//                 setError("Incorrect password. Please try again.");
//                 setShake(true);
//                 setPassword("");
//                 setTimeout(() => setShake(false), 600);
//             }
//         } catch {
//             setError("Something went wrong. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     }

//     return (
//         <div className="min-h-screen bg-[#f2f6f3] flex items-center justify-center px-4 py-6 font-[DM_Sans,sans-serif]">
//             <style>{`
//                 @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
//                 @keyframes fadeUp {
//                     from { opacity: 0; transform: translateY(20px); }
//                     to   { opacity: 1; transform: translateY(0); }
//                 }
//                 @keyframes shake {
//                     0%, 100% { transform: translateX(0); }
//                     20%      { transform: translateX(-8px); }
//                     40%      { transform: translateX(8px); }
//                     60%      { transform: translateX(-5px); }
//                     80%      { transform: translateX(5px); }
//                 }
//                 .card { animation: fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) both; }
//                 .shake { animation: shake 0.5s ease both; }
//                 input:-webkit-autofill {
//                     -webkit-box-shadow: 0 0 0 40px #f7faf8 inset !important;
//                     -webkit-text-fill-color: #2c3e35 !important;
//                 }
//             `}</style>

//             <div className="card w-full max-w-[400px]">

//                 {/* Logo */}
//                 <div className="text-center mb-8">
//                     <div className="inline-flex items-center gap-2.5 mb-2">
//                         <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: "linear-gradient(135deg, #4e7a5e, #3d8b8b)" }}>
//                             <Lock size={16} color="white" strokeWidth={2} />
//                         </div>
//                         <span className="font-[Cormorant_Garamond,serif] text-2xl font-normal text-[#1c3a3a] tracking-[-0.02em]">
//                             Mentel
//                         </span>
//                     </div>
//                     <p className="text-[13px] text-[#7a8a7e] font-light">
//                         Admin access only
//                     </p>
//                 </div>

//                 {/* Card */}
//                 <div
//                     className={`${shake ? "shake" : ""} bg-white rounded-[20px] border border-[#c8ddd2] shadow-[0_4px_24px_rgba(28,58,58,0.07)] overflow-hidden relative`}
//                 >
//                     {/* Top accent */}
//                     <div className="h-[2px]" style={{ background: "linear-gradient(90deg, #4e7a5e, #3d8b8b, #7ba98b)" }} />

//                     <div className="px-8 pt-8 pb-7">
//                         <h1 className="font-[Cormorant_Garamond,serif] text-[26px] font-normal text-[#1c3a3a] mb-1.5 tracking-[-0.01em]">
//                             Welcome back
//                         </h1>
//                         <p className="text-[13px] text-[#7a8a7e] font-light mb-7 leading-[1.6]">
//                             Enter your admin password to access the dashboard.
//                         </p>

//                         <form onSubmit={handleSubmit}>

//                             {/* Password field */}
//                             <div className="mb-5">
//                                 <label className="block text-[11px] font-semibold text-[#4e7a5e] uppercase tracking-[0.08em] mb-2">
//                                     Password
//                                 </label>
//                                 <div className="relative">
//                                     <input
//                                         type={showPass ? "text" : "password"}
//                                         value={password}
//                                         onChange={(e) => {
//                                             setPassword(e.target.value);
//                                             if (error) setError("");
//                                         }}
//                                         placeholder="Enter admin password"
//                                         autoFocus
//                                         required
//                                         className="w-full py-[13px] pl-4 pr-11 rounded-xl text-base text-[#2c3e35] bg-[#f7faf8] outline-none font-[DM_Sans,sans-serif] transition-[border-color,background] duration-150"
//                                         style={{
//                                             border: `1.5px solid ${error ? "#c0555a" : "#c8ddd2"}`,
//                                         }}
//                                         onFocus={(e) => {
//                                             e.target.style.borderColor = "#4e7a5e";
//                                             e.target.style.background = "white";
//                                         }}
//                                         onBlur={(e) => {
//                                             e.target.style.borderColor = error ? "#c0555a" : "#c8ddd2";
//                                             e.target.style.background = "#f7faf8";
//                                         }}
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => setShowPass((p) => !p)}
//                                         className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[#7a8a7e] p-1 flex items-center"
//                                         tabIndex={-1}
//                                     >
//                                         {showPass
//                                             ? <EyeOff size={16} strokeWidth={1.8} />
//                                             : <Eye size={16} strokeWidth={1.8} />
//                                         }
//                                     </button>
//                                 </div>

//                                 {/* Error message */}
//                                 {error && (
//                                     <div className="flex items-center gap-1.5 mt-2 text-xs text-[#c0555a]">
//                                         <div className="w-[5px] h-[5px] rounded-full bg-[#c0555a] shrink-0" />
//                                         {error}
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Submit button */}
//                             <button
//                                 type="submit"
//                                 disabled={loading || !password.trim()}
//                                 className="w-full py-[14px] px-6 rounded-full border-none text-sm font-semibold font-[DM_Sans,sans-serif] transition-all duration-200 flex items-center justify-center gap-2"
//                                 style={{
//                                     background: loading || !password.trim() ? "#c8ddd2" : "linear-gradient(135deg, #4e7a5e, #3d8b8b)",
//                                     color: loading || !password.trim() ? "#7a8a7e" : "white",
//                                     cursor: loading || !password.trim() ? "not-allowed" : "pointer",
//                                     boxShadow: loading || !password.trim() ? "none" : "0 4px 16px rgba(61,139,139,0.28)",
//                                 }}
//                             >
//                                 {loading ? (
//                                     <>
//                                         <svg
//                                             width="15" height="15"
//                                             viewBox="0 0 15 15"
//                                             style={{ animation: "spin 0.7s linear infinite" }}
//                                         >
//                                             <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
//                                             <circle cx="7.5" cy="7.5" r="6"
//                                                 fill="none" stroke="white"
//                                                 strokeWidth="2" strokeDasharray="28"
//                                                 strokeDashoffset="10"
//                                             />
//                                         </svg>
//                                         Verifying…
//                                     </>
//                                 ) : (
//                                     "Sign in to Admin"
//                                 )}
//                             </button>

//                         </form>
//                     </div>
//                 </div>

//                 {/* Footer note */}
//                 <div className="text-center mt-5 flex items-center justify-center gap-[5px]">
//                     <Shield size={12} style={{ color: "#a8c4b0" }} />
//                     <span className="text-[11px] text-[#a8c4b0]">
//                         Secured · Mentel Internal Dashboard
//                     </span>
//                 </div>

//             </div>
//         </div>
//     );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function AdminLoginPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [shake, setShake] = useState(false);
    const [focused, setFocused] = useState(false);

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

            const data = (await res.json()) as { success: boolean; error?: string };

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
        <div
            className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 py-6 font-[DM_Sans,sans-serif]"
            style={{ background: "linear-gradient(160deg, #1c3a3a 0%, #2d5347 45%, #214a45 75%, #18302e 100%)" }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');

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
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes driftA {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50%      { transform: translate(24px, -18px) scale(1.06); }
                }
                @keyframes driftB {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50%      { transform: translate(-20px, 16px) scale(1.04); }
                }
                @keyframes ringPulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(61,139,139,0.0); }
                    50%      { box-shadow: 0 0 0 6px rgba(61,139,139,0.06); }
                }

                .card { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
                .shake { animation: shake 0.5s ease both; }
                .blob-a { animation: driftA 13s ease-in-out infinite; }
                .blob-b { animation: driftB 16s ease-in-out infinite; }
                .mark-ring { animation: ringPulse 3.2s ease-in-out infinite; }

                input:-webkit-autofill {
                    -webkit-box-shadow: 0 0 0 40px #f7faf8 inset !important;
                    -webkit-text-fill-color: #2c3e35 !important;
                }

                @media (prefers-reduced-motion: reduce) {
                    .card, .blob-a, .blob-b, .mark-ring { animation: none !important; }
                }

                .admin-input:focus-visible,
                .admin-toggle:focus-visible,
                .admin-submit:focus-visible {
                    outline: 2px solid #3d8b8b;
                    outline-offset: 2px;
                }
            `}</style>

            {/* Ambient brand glow — quiet, on-palette */}
            <div
                aria-hidden
                className="blob-a pointer-events-none absolute -top-24 -left-20 w-[380px] h-[380px] rounded-full blur-[100px] opacity-[0.45]"
                style={{ background: "radial-gradient(circle, #7ba98b, transparent 70%)" }}
            />
            <div
                aria-hidden
                className="blob-b pointer-events-none absolute -bottom-28 -right-16 w-[420px] h-[420px] rounded-full blur-[110px] opacity-[0.4]"
                style={{ background: "radial-gradient(circle, #4ea8a8, transparent 70%)" }}
            />

            <div className="card relative w-full max-w-[400px]">

                {/* Logo */}
                <div className="text-center mb-9">
                    <div className="inline-flex items-center gap-3 mb-3">
                        {/* <div
                            className="mark-ring relative w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0"
                            style={{
                                background: "linear-gradient(135deg, #4e7a5e, #3d8b8b)",
                                boxShadow: "0 6px 18px rgba(61,139,139,0.32), inset 0 1px 0 rgba(255,255,255,0.25)",
                            }}
                        > */}
                        {/* <Image
                                src="/logo.png"
                                alt="Mentel"
                                width={24}
                                height={24}
                                className="w-6 h-6 object-contain"
                            />
                        </div>
                        <span className="font-[Cormorant_Garamond,serif] text-[28px] font-normal text-white tracking-[-0.02em] leading-none">
                            Mentel
                        </span> */}
                        <Image src="/logo-white.png" alt="Mentel" width={120} height={61} className="object-contain" priority />
                        {/* </div> */}
                    </div>
                    <p className="text-[12px] text-[#9fc4b4] font-medium uppercase tracking-[0.14em]">
                        Admin Console
                    </p>
                </div>

                {/* Card */}
                <div
                    className={`${shake ? "shake" : ""} rounded-[22px] border overflow-hidden relative transition-shadow duration-300`}
                    style={{
                        background: "linear-gradient(160deg, rgba(247,250,248,0.97), rgba(232,242,236,0.94))",
                        backdropFilter: "blur(18px)",
                        WebkitBackdropFilter: "blur(18px)",
                        borderColor: "rgba(255,255,255,0.35)",
                        boxShadow: focused
                            ? "0 20px 50px rgba(8,24,22,0.45), inset 0 1px 0 rgba(255,255,255,0.5)"
                            : "0 14px 36px rgba(8,24,22,0.35), inset 0 1px 0 rgba(255,255,255,0.4)",
                    }}
                >
                    {/* Top accent */}
                    <div className="h-[3px]" style={{ background: "linear-gradient(90deg, #4e7a5e, #3d8b8b, #7ba98b)" }} />

                    <div className="px-8 pt-9 pb-8">
                        <h1 className="font-[Cormorant_Garamond,serif] text-[27px] font-medium text-[#1c3a3a] mb-1.5 tracking-[-0.01em]">
                            Welcome back
                        </h1>
                        <p className="text-[13px] text-[#7a8a7e] font-light mb-7 leading-[1.6]">
                            Enter your admin password to access the dashboard.
                        </p>

                        <form onSubmit={handleSubmit}>

                            {/* Password field */}
                            <div className="mb-6">
                                <label className="block text-[11px] font-semibold text-[#4e7a5e] uppercase tracking-[0.08em] mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock
                                        size={15}
                                        strokeWidth={1.8}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9bb3a1] pointer-events-none"
                                    />
                                    <input
                                        type={showPass ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (error) setError("");
                                        }}
                                        onFocus={() => setFocused(true)}
                                        onBlur={() => setFocused(false)}
                                        placeholder="Enter admin password"
                                        autoFocus
                                        required
                                        className="admin-input w-full py-[13px] pl-10 pr-11 rounded-xl text-base text-[#2c3e35] bg-[#f7faf8] outline-none font-[DM_Sans,sans-serif] transition-[border-color,background] duration-150"
                                        style={{
                                            border: `1.5px solid ${error ? "#c0555a" : focused ? "#4e7a5e" : "#c8ddd2"}`,
                                            background: focused ? "white" : "#f7faf8",
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass((p) => !p)}
                                        className="admin-toggle absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[#7a8a7e] p-1 flex items-center rounded-md"
                                        tabIndex={-1}
                                        aria-label={showPass ? "Hide password" : "Show password"}
                                    >
                                        {showPass ? (
                                            <EyeOff size={16} strokeWidth={1.8} />
                                        ) : (
                                            <Eye size={16} strokeWidth={1.8} />
                                        )}
                                    </button>
                                </div>

                                {/* Error message */}
                                {error && (
                                    <div className="flex items-center gap-1.5 mt-2 text-xs text-[#c0555a]">
                                        <div className="w-[5px] h-[5px] rounded-full bg-[#c0555a] shrink-0" />
                                        {error}
                                    </div>
                                )}
                            </div>

                            {/* Submit button */}
                            <button
                                type="submit"
                                disabled={loading || !password.trim()}
                                className="admin-submit w-full py-[14px] px-6 rounded-full border-none text-sm font-semibold font-[DM_Sans,sans-serif] transition-all duration-200 flex items-center justify-center gap-2"
                                style={{
                                    background:
                                        loading || !password.trim()
                                            ? "#c8ddd2"
                                            : "linear-gradient(135deg, #4e7a5e, #3d8b8b)",
                                    color: loading || !password.trim() ? "#7a8a7e" : "white",
                                    cursor: loading || !password.trim() ? "not-allowed" : "pointer",
                                    boxShadow:
                                        loading || !password.trim()
                                            ? "none"
                                            : "0 6px 20px rgba(61,139,139,0.3)",
                                }}
                                onMouseEnter={(e) => {
                                    if (!loading && password.trim()) {
                                        e.currentTarget.style.transform = "translateY(-1px)";
                                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(61,139,139,0.38)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow =
                                        loading || !password.trim() ? "none" : "0 6px 20px rgba(61,139,139,0.3)";
                                }}
                            >
                                {loading ? (
                                    <>
                                        <svg width="15" height="15" viewBox="0 0 15 15" style={{ animation: "spin 0.7s linear infinite" }}>
                                            <circle
                                                cx="7.5" cy="7.5" r="6"
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
                <div className="text-center mt-6 flex items-center justify-center gap-[5px]">
                    <ShieldCheck size={13} style={{ color: "#a8c4b0" }} />
                    <span className="text-[11px] text-[#a8c4b0] font-medium tracking-[0.02em]">
                        Secured · Mentel Internal Dashboard
                    </span>
                </div>

            </div>
        </div>
    );
}