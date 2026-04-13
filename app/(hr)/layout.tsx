// "use client";

// // app/hr/layout.tsx
// // Separate HR portal layout — completely distinct from admin.
// // Companies log in here to view their EAP data.

// import { useCallback, useEffect, useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//     LayoutDashboard, Users, BarChart2, TrendingUp,
//     Settings, LogOut, Menu, X, Bell, ChevronRight,
//     Shield, Building2,
// } from "lucide-react";
// import { Analytics } from "./hr/page";
// import Image from "next/image";

// const NAV = [
//     { href: "/hr", icon: LayoutDashboard, label: "Overview" },
//     { href: "/hr/employees", icon: Users, label: "Employees" },
//     { href: "/hr/analytics", icon: BarChart2, label: "Analytics" },
//     { href: "/hr/progress", icon: TrendingUp, label: "Progress" },
//     { href: "/hr/settings", icon: Settings, label: "Settings" },
// ];

// export default function HRLayout({ children }: { children: React.ReactNode }) {
//     const path = usePathname();
//     const [mobileOpen, setMobileOpen] = useState(false);
//     const pathname = usePathname();
//     const isHrAccess = pathname.startsWith("/hr/access");

//     const [data, setData] = useState<Analytics | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");
//     const [refreshing, setRefreshing] = useState(false);

//     const load = useCallback(async (silent = false) => {
//         if (!silent) setLoading(true);
//         setError("");
//         try {
//             const res = await fetch("/api/hr/analytics", {
//                 cache: 'no-store', // Forces the browser to bypass cache
//                 headers: {
//                     'Cache-Control': 'no-cache'
//                 }
//             });

//             const json = await res.json();
//             if (json.success) setData(json);
//             else setError(json.error ?? "Failed to load data.");
//         } catch {
//             setError("Connection error. Please refresh.");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     useEffect(() => { load(); }, [load]);


//     if (isHrAccess) {
//         return <>{children}</>;
//     }

//     return (
//         <div className="min-h-screen flex" style={{ background: "#f7faf8", fontFamily: "'DM Sans', sans-serif" }}>
//             <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,500;1,300&display=swap');
//         * { box-sizing: border-box; }
//         ::-webkit-scrollbar { width: 4px; }
//         ::-webkit-scrollbar-thumb { background: #c8ddd2; border-radius: 99px; }
//       `}</style>

//             {mobileOpen && (
//                 <div className="fixed inset-0 bg-black/30 z-[150] md:hidden" onClick={() => setMobileOpen(false)} />
//             )}

//             {/* Sidebar */}
//             <aside className={`fixed top-0 left-0 h-full z-[200] flex flex-col bg-white border-r transition-all duration-300
//         w-[220px] ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
//                 style={{ borderColor: "#e4eee8" }}>

//                 {/* Brand */}
//                 <div className="h-[60px] flex items-center gap-2.5 px-5 border-b" style={{ borderColor: "#e4eee8" }}>
//                     <div className="w-7 h-7 rounded-lg flex items-center justify-center"
//                         style={{ background: "linear-gradient(135deg, #4e8c6a, #3d8b8b)" }}>
//                         <Image
//                             src="/hr-logo.png"
//                             alt="Mentel logo"
//                             width={28} // Match container width
//                             height={28} // Match container height
//                             className="w-full h-full object-cover" // Ensures it fills the div completely
//                         />
//                     </div>
//                     <div>
//                         <div className="text-[13px] font-semibold" style={{ color: "#1c3a3a" }}>Mentel EAP</div>
//                         <div className="text-[10px]" style={{ color: "#7a9088" }}>HR Portal</div>
//                     </div>
//                 </div>

//                 {/* Company badge */}
//                 <div className="mx-3 mt-3 mb-1 px-3 py-2.5 rounded-xl" style={{ background: "#f0f7f3" }}>
//                     <div className="flex items-center gap-2">
//                         <Building2 size={13} style={{ color: "#4e8c6a" }} />
//                         <div className="min-w-0">
//                             <div className="text-[11px] font-semibold truncate" style={{ color: "#1c3a3a" }}>{data?.company.name || "Company Name"}</div>
//                             <div className="text-[10px]" style={{ color: "#7a9088" }}>{data?.company.plan || "No"} Plan · {data?.company.planSeats || 0} employees</div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Nav */}
//                 <nav className="flex-1 py-3 overflow-y-auto">
//                     {NAV.map(({ href, icon: Icon, label }) => {
//                         const active = path === href || (href !== "/hr" && path.startsWith(href));
//                         return (
//                             <Link key={href} href={href} onClick={() => setMobileOpen(false)}
//                                 className="flex items-center gap-3 mx-2 mb-0.5 px-3 py-2.5 rounded-xl transition-all"
//                                 style={{
//                                     background: active ? "rgba(78,140,106,0.1)" : "transparent",
//                                     color: active ? "#2d6648" : "#7a9088",
//                                     fontWeight: active ? 500 : 400,
//                                 }}>
//                                 <Icon size={15} className="shrink-0" />
//                                 <span className="text-[13px]">{label}</span>
//                             </Link>
//                         );
//                     })}
//                 </nav>

//                 {/* Footer */}
//                 <div className="border-t p-3" style={{ borderColor: "#e4eee8" }}>
//                     <div className="flex items-center gap-2 px-1 mb-2">
//                         <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
//                             style={{ background: "linear-gradient(135deg, #4e8c6a, #3d8b8b)" }}>
//                             N
//                         </div>
//                         <div className="min-w-0">
//                             <div className="text-[11px] font-semibold truncate" style={{ color: "#1c3a3a" }}>Ngozi Adeola</div>
//                             <div className="text-[10px]" style={{ color: "#7a9088" }}>Head of People</div>
//                         </div>
//                     </div>
//                     <div className="flex items-center gap-1.5 px-2 py-1.5 text-[11px] cursor-pointer rounded-lg hover:bg-red-50 transition-colors"
//                         style={{ color: "#b94a4f" }}>
//                         <LogOut size={12} />
//                         Sign out
//                     </div>
//                 </div>
//             </aside>

//             {/* Main */}
//             <div className="flex-1 flex flex-col min-h-screen md:ml-[220px]">
//                 {/* Topbar */}
//                 <header className="h-[60px] bg-white border-b flex items-center justify-between px-5 sticky top-0 z-[100]"
//                     style={{ borderColor: "#e4eee8" }}>
//                     <div className="flex items-center gap-3">
//                         <button className="md:hidden" onClick={() => setMobileOpen(o => !o)}
//                             style={{ color: "#7a9088", background: "none", border: "none", cursor: "pointer" }}>
//                             {mobileOpen ? <X size={18} /> : <Menu size={18} />}
//                         </button>
//                         <div>
//                             <span className="text-[14px] font-semibold capitalize" style={{ color: "#1c3a3a" }}>
//                                 {NAV.find(n => n.href === path || (n.href !== "/hr" && path.startsWith(n.href)))?.label ?? "Overview"}
//                             </span>
//                         </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                         <div className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full"
//                             style={{ background: "rgba(78,140,106,0.1)", color: "#2d6648" }}>
//                             <Shield size={11} />
//                             Anonymised data only
//                         </div>
//                         <button className="w-8 h-8 rounded-lg border flex items-center justify-center"
//                             style={{ borderColor: "#e4eee8", color: "#7a9088", background: "#f7faf8" }}>
//                             <Bell size={14} />
//                         </button>
//                     </div>
//                 </header>

//                 <main className="flex-1 p-5 overflow-auto">
//                     {children}
//                 </main>
//             </div>
//         </div>
//     );
// }

"use client";

// app/hr/layout.tsx
// FIXES:
// 1. Removed broken import of Analytics type from ./hr/page (circular dep / race condition).
// 2. Layout now fetches minimal company info from a dedicated lightweight endpoint
//    rather than the full analytics — faster, no competition with page data.
// 3. Company name in sidebar updates immediately on first load with no refresh needed.
// 4. Sign out now calls DELETE /api/hr/auth to clear the session cookie properly.

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard, Users, BarChart2, TrendingUp,
    Settings, LogOut, Menu, X, Bell, Shield, Building2,
} from "lucide-react";
import Image from "next/image";

const NAV = [
    { href: "/hr", icon: LayoutDashboard, label: "Overview" },
    { href: "/hr/employees", icon: Users, label: "Employees" },
    { href: "/hr/analytics", icon: BarChart2, label: "Analytics" },
    { href: "/hr/progress", icon: TrendingUp, label: "Progress" },
    { href: "/hr/settings", icon: Settings, label: "Settings" },
];

// Minimal company info — just what the sidebar needs
interface CompanyBadge {
    name: string;
    plan: string;
    planSeats: number;
}

export default function HRLayout({ children }: { children: React.ReactNode }) {
    const path = usePathname();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [company, setCompany] = useState<CompanyBadge | null>(null);
    const [hrName, setHrName] = useState<string>("HR User");

    // Skip the layout chrome for the access (login) page
    const isAccessPage = path === "/hr/access";

    // Fetch minimal company info for the sidebar badge.
    // Uses the settings endpoint which is lighter than full analytics.
    const loadCompany = useCallback(async () => {
        // First try sessionStorage (set after successful login — instant)
        try {
            const stored = sessionStorage.getItem("hr_company");
            if (stored) {
                const parsed = JSON.parse(stored) as CompanyBadge;
                setCompany(parsed);
                return; // Don't hit the network if we already have it
            }
        } catch {
            // sessionStorage unavailable (SSR context) — fall through to fetch
        }

        // Fallback: fetch from settings API
        try {
            const res = await fetch("/api/hr/settings");
            if (res.status === 401) return; // Not logged in — middleware will redirect
            const json = await res.json();
            if (json.success && json.settings) {
                const badge: CompanyBadge = {
                    name: json.settings.name,
                    plan: json.settings.plan,
                    planSeats: json.settings.planSeats,
                };
                setCompany(badge);
                setHrName(json.settings.contactName ?? "HR User");
                // Cache it so sidebar is instant on subsequent page navigations
                try { sessionStorage.setItem("hr_company", JSON.stringify(badge)); } catch { /* ignore */ }
            }
        } catch {
            // Network error — sidebar will show placeholder, not a blocker
        }
    }, []);

    useEffect(() => {
        if (!isAccessPage) loadCompany();
    }, [isAccessPage, loadCompany]);

    const handleSignOut = async () => {
        try {
            await fetch("/api/hr/auth", { method: "DELETE" });
            sessionStorage.removeItem("hr_company");
        } finally {
            router.push("/hr/access");
        }
    };

    // Render children only (no sidebar) on the access page
    if (isAccessPage) {
        return <>{children}</>;
    }

    return (
        <div
            className="min-h-screen flex"
            style={{ background: "#f7faf8", fontFamily: "'DM Sans', sans-serif" }}
        >
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,500;1,300&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #c8ddd2; border-radius: 99px; }
      `}</style>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-[150] md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full z-[200] flex flex-col bg-white border-r transition-all duration-300
          w-[220px] ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
                style={{ borderColor: "#e4eee8" }}
            >
                {/* Brand */}
                <div className="h-[60px] flex items-center gap-2.5 px-5 border-b" style={{ borderColor: "#e4eee8" }}>
                    <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center overflow-hidden"
                        style={{ background: "linear-gradient(135deg, #4e8c6a, #3d8b8b)" }}
                    >
                        <Image
                            src="/hr-logo.png"
                            alt="Mentel"
                            width={28}
                            height={28}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                // Fallback if logo doesn't exist — show "M" text
                                (e.currentTarget as HTMLImageElement).style.display = "none";
                            }}
                        />
                    </div>
                    <div>
                        <div className="text-[13px] font-semibold" style={{ color: "#1c3a3a" }}>Mentel EAP</div>
                        <div className="text-[10px]" style={{ color: "#7a9088" }}>HR Portal</div>
                    </div>
                </div>

                {/* Company badge */}
                <div className="mx-3 mt-3 mb-1 px-3 py-2.5 rounded-xl" style={{ background: "#f0f7f3" }}>
                    <div className="flex items-center gap-2">
                        <Building2 size={13} style={{ color: "#4e8c6a" }} />
                        <div className="min-w-0">
                            {company ? (
                                <>
                                    <div className="text-[11px] font-semibold truncate" style={{ color: "#1c3a3a" }}>
                                        {company.name}
                                    </div>
                                    <div className="text-[10px]" style={{ color: "#7a9088" }}>
                                        {company.plan} plan · {company.planSeats} seats
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="h-3 w-24 rounded bg-[#ddeae2] animate-pulse mb-1" />
                                    <div className="h-2 w-16 rounded bg-[#e8f0ec] animate-pulse" />
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 py-3 overflow-y-auto">
                    {NAV.map(({ href, icon: Icon, label }) => {
                        const active = path === href || (href !== "/hr" && path.startsWith(href));
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-3 mx-2 mb-0.5 px-3 py-2.5 rounded-xl transition-all"
                                style={{
                                    background: active ? "rgba(78,140,106,0.1)" : "transparent",
                                    color: active ? "#2d6648" : "#7a9088",
                                    fontWeight: active ? 500 : 400,
                                }}
                            >
                                <Icon size={15} className="shrink-0" />
                                <span className="text-[13px]">{label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="border-t p-3" style={{ borderColor: "#e4eee8" }}>
                    <div className="flex items-center gap-2 px-1 mb-2">
                        <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                            style={{ background: "linear-gradient(135deg, #4e8c6a, #3d8b8b)" }}
                        >
                            {hrName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <div className="text-[11px] font-semibold truncate" style={{ color: "#1c3a3a" }}>
                                {hrName}
                            </div>
                            <div className="text-[10px]" style={{ color: "#7a9088" }}>HR Portal</div>
                        </div>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-1.5 px-2 py-1.5 text-[11px] cursor-pointer rounded-lg hover:bg-red-50 transition-colors"
                        style={{ color: "#b94a4f", background: "none", border: "none" }}
                    >
                        <LogOut size={12} />
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-h-screen md:ml-[220px]">
                {/* Topbar */}
                <header
                    className="h-[60px] bg-white border-b flex items-center justify-between px-5 sticky top-0 z-[100]"
                    style={{ borderColor: "#e4eee8" }}
                >
                    <div className="flex items-center gap-3">
                        <button
                            className="md:hidden"
                            onClick={() => setMobileOpen((o) => !o)}
                            style={{ color: "#7a9088", background: "none", border: "none", cursor: "pointer" }}
                        >
                            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                        <span className="text-[14px] font-semibold capitalize" style={{ color: "#1c3a3a" }}>
                            {NAV.find((n) => n.href === path || (n.href !== "/hr" && path.startsWith(n.href)))?.label ?? "Overview"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div
                            className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full"
                            style={{ background: "rgba(78,140,106,0.1)", color: "#2d6648" }}
                        >
                            <Shield size={11} />
                            <span className="hidden sm:inline">Anonymised data only</span>
                        </div>
                        <button
                            className="w-8 h-8 rounded-lg border flex items-center justify-center"
                            style={{ borderColor: "#e4eee8", color: "#7a9088", background: "#f7faf8" }}
                        >
                            <Bell size={14} />
                        </button>
                    </div>
                </header>

                <main className="flex-1 p-5 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}