
// "use client";

// // app/admin/layout.tsx
// import { useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { usePathname } from "next/navigation";
// import {
//     LayoutDashboard, Users, Calendar, CreditCard,
//     MessageSquare, BarChart2, Settings, ChevronLeft,
//     ChevronRight, Bell, LogOut, Menu, X, Tags,
//     Building2,
//     Inbox,
//     FileText,
//     ShieldCheck,
// } from "lucide-react";

// const NAV = [
//     { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
//     { href: "/admin/patients", icon: Users, label: "Patients" },
//     { href: "/admin/appointments", icon: Calendar, label: "Appointments" },
//     { href: "/admin/payments", icon: CreditCard, label: "Payments" },
//     { href: "/admin/communications", icon: MessageSquare, label: "Communications" },
//     { href: "/admin/analytics", icon: BarChart2, label: "Analytics" },
//     { href: "/admin/articles", icon: FileText, label: "Articles" },
//     { href: "/admin/seo-report", icon: Tags, label: "SEO Dashboard" },
//     { href: "/admin/volunteer-verifications", icon: ShieldCheck, label: "Volunteer Verifications" },
//     { href: "/admin/contact", icon: Inbox, label: "Contact" },
//     { href: "/admin/settings", icon: Settings, label: "Settings" },
//     { href: "/admin/companies", icon: Building2, label: "EAP Companies" },
// ];

// export default function AdminLayout({ children }: { children: React.ReactNode }) {
//     const path = usePathname();
//     const [collapsed, setCollapsed] = useState(false);
//     const [mobileOpen, setMobileOpen] = useState(false);

//     return (
//         <div className="min-h-screen bg-[#f0f4f2] flex" style={{ fontFamily: "'DM Sans', sans-serif" }}>
//             <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,500;1,400&display=swap');
//         * { box-sizing: border-box; }
//         ::-webkit-scrollbar { width: 4px; }
//         ::-webkit-scrollbar-track { background: transparent; }
//         ::-webkit-scrollbar-thumb { background: #c8ddd2; border-radius: 99px; }
//       `}</style>

//             {/* Mobile overlay */}
//             {mobileOpen && (
//                 <div className="fixed inset-0 bg-black/40 z-[150] md:hidden" onClick={() => setMobileOpen(false)} />
//             )}

//             {/* Sidebar */}
//             <aside className={`
//         fixed top-0 left-0 h-full z-[200] flex flex-col bg-[#1a3030] transition-all duration-300 ease-in-out
//         ${collapsed ? "w-[68px]" : "w-[220px]"}
//         ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
//       `}>
//                 {/* Logo */}
//                 <div className={`flex items-center h-[60px] border-b border-white/10 shrink-0 ${collapsed ? "justify-center px-2" : "px-5"}`}>
//                     {!collapsed ? (
//                         <div className="flex items-center gap-2 min-w-0">
//                             <div className="w-7 h-7 rounded-lg bg-[#4e8c6a] flex items-center justify-center shrink-0">
//                                 <span className="text-white text-[11px] font-bold">M</span>
//                             </div>
//                             <span className="text-white font-semibold text-[15px] tracking-tight truncate">Mentel Admin</span>
//                         </div>
//                     ) : (
//                         <div className="w-7 h-7 rounded-lg bg-[#4e8c6a] flex items-center justify-center">
//                             <span className="text-white text-[11px] font-bold">M</span>
//                         </div>
//                     )}
//                 </div>

//                 {/* Nav links */}
//                 <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
//                     {NAV.map(({ href, icon: Icon, label }) => {
//                         const active = path === href || (href !== "/admin" && path.startsWith(href));
//                         return (
//                             <Link key={href} href={href}
//                                 onClick={() => setMobileOpen(false)}
//                                 title={label}
//                                 className={`flex items-center gap-3 mx-2 mb-0.5 rounded-xl transition-all duration-150 min-w-0 ${collapsed ? "justify-center px-0 py-3" : "px-3 py-2.5"} ${active ? "bg-white/15 text-white" : "text-white/55 hover:text-white/90 hover:bg-white/8"}`}>
//                                 <Icon size={16} className="shrink-0" />
//                                 {!collapsed && <span className="text-[13px] font-medium truncate min-w-0 flex-1">{label}</span>}
//                             </Link>
//                         );
//                     })}
//                 </nav>

//                 {/* Bottom */}
//                 <div className="border-t border-white/10 p-3 shrink-0">
//                     {!collapsed && (
//                         <div className="flex items-center gap-2.5 px-1 mb-2">
//                             <div className="w-7 h-7 rounded-full bg-[#4e8c6a] flex items-center justify-center shrink-0">
//                                 <span className="text-white text-[10px] font-bold">A</span>
//                             </div>
//                             <div className="min-w-0">
//                                 <div className="text-white text-[11px] font-semibold truncate">Admin</div>
//                                 <div className="text-white/40 text-[10px] truncate">admin@mentel.com</div>
//                             </div>
//                         </div>
//                     )}
//                     <button
//                         onClick={() => setCollapsed(c => !c)}
//                         className="hidden md:flex w-full items-center justify-center gap-1.5 py-2 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/8 text-[11px] transition-colors border-none bg-transparent cursor-pointer">
//                         {collapsed ? <ChevronRight size={14} /> : <><ChevronLeft size={14} /><span>Collapse</span></>}
//                     </button>
//                 </div>
//             </aside>

//             {/* Main content */}
//             <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${collapsed ? "md:ml-[68px]" : "md:ml-[220px]"}`}>
//                 {/* Top bar */}
//                 <header className="h-[60px] bg-white border-b border-[#ddeae2] flex items-center justify-between px-5 sticky top-0 z-[100] shadow-[0_1px_8px_rgba(28,58,58,0.05)]">
//                     <div className="flex items-center gap-3">
//                         <button className="md:hidden text-[#7a9088] border-none bg-transparent cursor-pointer" onClick={() => setMobileOpen(o => !o)}>
//                             {mobileOpen ? <X size={18} /> : <Menu size={18} />}
//                         </button>
//                         <div>
//                             <span className="text-[14px] font-semibold text-[#1c3a3a] capitalize">
//                                 {NAV.find(n => n.href === path || (n.href !== "/admin" && path.startsWith(n.href)))?.label ?? "Dashboard"}
//                             </span>
//                         </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                         <button className="relative w-8 h-8 rounded-lg border border-[#ddeae2] bg-[#f7faf8] flex items-center justify-center text-[#7a9088] cursor-pointer hover:bg-[#edf7f1] transition-colors border-none">
//                             <Bell size={14} />
//                             <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#b94a4f] rounded-full text-[8px] text-white font-bold flex items-center justify-center">!</span>
//                         </button>
//                     </div>
//                 </header>

//                 {/* Page content */}
//                 <main className="admin-main flex-1 p-5 overflow-y-auto overflow-x-hidden min-w-0">
//                     {children}
//                 </main>
//             </div>
//         </div>
//     );
// }


"use client";

// app/admin/layout.tsx
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import OnlineAdminsIndicator from "@/components/OnlineAdminsIndicator";
import {
    LayoutDashboard, Users, Calendar, CreditCard,
    MessageSquare, BarChart2, Settings, ChevronLeft,
    ChevronRight, Bell, LogOut, Menu, X, Tags,
    Building2,
    Inbox,
    FileText,
    ShieldCheck,
    ShieldAlert,
    MessageSquareText,
    CalendarClock,
    Brain,
} from "lucide-react";

const NAV = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/patients", icon: Users, label: "Patients" },
    { href: "/admin/adhd-assessments", icon: Brain, label: "ADHD Assessments" },
    { href: "/admin/appointments", icon: Calendar, label: "Appointments" },
    { href: "/admin/scheduled-sessions", icon: CalendarClock, label: "Scheduled Sessions" },
    { href: "/admin/payments", icon: CreditCard, label: "Payments" },
    { href: "/admin/communications", icon: MessageSquare, label: "Communications" },
    { href: "/admin/sms", icon: MessageSquareText, label: "SMS" },
    { href: "/admin/analytics", icon: BarChart2, label: "Analytics" },
    { href: "/admin/articles", icon: FileText, label: "Articles" },
    { href: "/admin/seo-report", icon: Tags, label: "SEO Dashboard" },
    { href: "/admin/volunteer-verifications", icon: ShieldCheck, label: "Volunteer Verifications" },
    { href: "/admin/security", icon: ShieldAlert, label: "Security" },
    { href: "/admin/contact", icon: Inbox, label: "Contact" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
    { href: "/admin/companies", icon: Building2, label: "EAP Companies" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const path = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#f0f4f2] flex" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,500;1,400&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #c8ddd2; border-radius: 99px; }
      `}</style>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 bg-black/40 z-[150] md:hidden" onClick={() => setMobileOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed top-0 left-0 h-full z-[200] flex flex-col bg-[#1a3030] transition-all duration-300 ease-in-out
        ${collapsed ? "w-[68px]" : "w-[220px]"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
                {/* Logo */}
                <div className={`flex items-center h-[60px] border-b border-white/10 shrink-0 ${collapsed ? "justify-center px-2" : "px-5"}`}>
                    {!collapsed ? (
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-[#4e8c6a] flex items-center justify-center shrink-0">
                                <span className="text-white text-[11px] font-bold">M</span>
                            </div>
                            <span className="text-white font-semibold text-[15px] tracking-tight truncate">Mentel Admin</span>
                        </div>
                    ) : (
                        <div className="w-7 h-7 rounded-lg bg-[#4e8c6a] flex items-center justify-center">
                            <span className="text-white text-[11px] font-bold">M</span>
                        </div>
                    )}
                </div>

                {/* Nav links */}
                <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
                    {NAV.map(({ href, icon: Icon, label }) => {
                        const active = path === href || (href !== "/admin" && path.startsWith(href));
                        return (
                            <Link key={href} href={href}
                                onClick={() => setMobileOpen(false)}
                                title={label}
                                className={`flex items-center gap-3 mx-2 mb-0.5 rounded-xl transition-all duration-150 min-w-0 ${collapsed ? "justify-center px-0 py-3" : "px-3 py-2.5"} ${active ? "bg-white/15 text-white" : "text-white/55 hover:text-white/90 hover:bg-white/8"}`}>
                                <Icon size={16} className="shrink-0" />
                                {!collapsed && <span className="text-[13px] font-medium truncate min-w-0 flex-1">{label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div className="border-t border-white/10 p-3 shrink-0">
                    <OnlineAdminsIndicator collapsed={collapsed} />
                    {!collapsed && (
                        <div className="flex items-center gap-2.5 px-1 mb-2">
                            <div className="w-7 h-7 rounded-full bg-[#4e8c6a] flex items-center justify-center shrink-0">
                                <span className="text-white text-[10px] font-bold">A</span>
                            </div>
                            <div className="min-w-0">
                                <div className="text-white text-[11px] font-semibold truncate">Admin</div>
                                <div className="text-white/40 text-[10px] truncate">admin@mentel.com</div>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setCollapsed(c => !c)}
                        className="hidden md:flex w-full items-center justify-center gap-1.5 py-2 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/8 text-[11px] transition-colors border-none bg-transparent cursor-pointer">
                        {collapsed ? <ChevronRight size={14} /> : <><ChevronLeft size={14} /><span>Collapse</span></>}
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${collapsed ? "md:ml-[68px]" : "md:ml-[220px]"}`}>
                {/* Top bar */}
                <header className="h-[60px] bg-white border-b border-[#ddeae2] flex items-center justify-between px-5 sticky top-0 z-[100] shadow-[0_1px_8px_rgba(28,58,58,0.05)]">
                    <div className="flex items-center gap-3">
                        <button className="md:hidden text-[#7a9088] border-none bg-transparent cursor-pointer" onClick={() => setMobileOpen(o => !o)}>
                            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                        <div>
                            <span className="text-[14px] font-semibold text-[#1c3a3a] capitalize">
                                {NAV.find(n => n.href === path || (n.href !== "/admin" && path.startsWith(n.href)))?.label ?? "Dashboard"}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="relative w-8 h-8 rounded-lg border border-[#ddeae2] bg-[#f7faf8] flex items-center justify-center text-[#7a9088] cursor-pointer hover:bg-[#edf7f1] transition-colors border-none">
                            <Bell size={14} />
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#b94a4f] rounded-full text-[8px] text-white font-bold flex items-center justify-center">!</span>
                        </button>
                    </div>
                </header>

                {/* Page content */}
                <main className="admin-main flex-1 p-5 overflow-y-auto overflow-x-hidden min-w-0">
                    {children}
                </main>
            </div>
        </div>
    );
}