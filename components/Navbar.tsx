

// "use client";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Menu, X, ClipboardCheck } from "lucide-react";
// import Image from "next/image";

// const navLinks = [
//     { href: "/", label: "Home" },
//     { href: "/about", label: "About" },
//     { href: "/services", label: "Services" },
//     { href: "/contact", label: "Contact" },
// ];

// export default function Navbar() {
//     const [open, setOpen] = useState(false);
//     const [scrolled, setScrolled] = useState(false);
//     const pathname = usePathname();

//     useEffect(() => {
//         const onScroll = () => setScrolled(window.scrollY > 20);
//         window.addEventListener("scroll", onScroll);
//         return () => window.removeEventListener("scroll", onScroll);
//     }, []);

//     useEffect(() => {
//         setOpen(false);
//     }, [pathname]);

//     return (
//         <header
//             className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
//                 ? "bg-white/90 backdrop-blur-md border-b border-border shadow-sm"
//                 : "bg-transparent"
//                 }`}
//         >

//             <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

//                 {/* Logo */}
//                 <Link href="/" className="flex items-center gap-2.5 group">
//                     <Image
//                         src="/logo.png"
//                         alt="Mentel logo"
//                         width={108}
//                         height={61}
//                         className="object-contain"
//                         priority
//                     />
//                 </Link>

//                 {/* Desktop links */}
//                 <div className="hidden md:flex items-center gap-8">
//                     {navLinks.map((link) => (
//                         <Link
//                             key={link.href}
//                             href={link.href}
//                             className={`text-sm font-dm transition-colors duration-200 ${pathname === link.href
//                                 ? "text-sage-dark font-medium"
//                                 : "text-text-muted hover:text-deep"
//                                 }`}
//                         >
//                             {link.label}
//                         </Link>
//                     ))}

//                     {/* Dual CTA — desktop */}
//                     <div className="flex items-center gap-2">
//                         <Link
//                             href="/assessment"
//                             className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
//                             style={{
//                                 borderColor: "rgba(123,169,139,0.45)",
//                                 color: "var(--sage-dark)",
//                                 background: "rgba(123,169,139,0.07)",
//                             }}
//                         >
//                             <ClipboardCheck size={13} />
//                             Free Check
//                         </Link>
//                         <Link
//                             href="/#book"
//                             className="text-sm font-medium text-white px-5 py-2 rounded-full transition-all duration-200 hover:opacity-90 hover:shadow-md hover:-translate-y-0.5"
//                             style={{
//                                 background: "linear-gradient(135deg, var(--sage-dark), var(--teal))",
//                             }}
//                         >
//                             Book Now
//                         </Link>
//                     </div>
//                 </div>

//                 {/* Mobile hamburger */}
//                 <button
//                     className="md:hidden p-2 rounded-lg transition-colors hover:bg-mist"
//                     onClick={() => setOpen(!open)}
//                     aria-label="Toggle menu"
//                 >
//                     {open ? (
//                         <X size={20} style={{ color: "var(--deep)" }} />
//                     ) : (
//                         <Menu size={20} style={{ color: "var(--deep)" }} />
//                     )}
//                 </button>
//             </nav>

//             {/* Mobile menu */}
//             {open && (
//                 <div className="md:hidden bg-white border-t border-border px-6 py-4 flex flex-col gap-4 shadow-lg">
//                     {navLinks.map((link) => (
//                         <Link
//                             key={link.href}
//                             href={link.href}
//                             className={`text-sm py-1 transition-colors ${pathname === link.href
//                                 ? "text-sage-dark font-medium"
//                                 : "text-text-muted"
//                                 }`}
//                         >
//                             {link.label}
//                         </Link>
//                     ))}

//                     {/* Assessment link — mobile (as a nav item, not a button) */}
//                     <Link
//                         href="/assessment"
//                         className={`text-sm py-1 transition-colors flex items-center gap-2 ${pathname === "/assessment"
//                             ? "text-sage-dark font-medium"
//                             : "text-text-muted"
//                             }`}
//                     >
//                         <ClipboardCheck size={13} style={{ color: "var(--sage)" }} />
//                         Free Assessment
//                     </Link>

//                     {/* Book Now — mobile (solid button, full width) */}
//                     <Link
//                         href="/#book"
//                         className="text-sm font-medium text-white px-5 py-2.5 rounded-full text-center mt-1"
//                         style={{
//                             background: "linear-gradient(135deg, var(--sage-dark), var(--teal))",
//                         }}
//                     >
//                         Book Now
//                     </Link>
//                 </div>
//             )}
//         </header>
//     );
// }

"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ClipboardCheck, ArrowRight, Zap, Clock } from "lucide-react";
import Image from "next/image";


const now = new Date()

const DEADLINE = new Date(now);
DEADLINE.setSeconds(59);
DEADLINE.setMilliseconds(999);
// const DEADLINE = new Date("2026-03-18T23:59:59");

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
];

function getTimeLeft() {
    // const diff = DEADLINE.getTime() - Date.now();
    const diff =
        new Date(
            new Date().setMinutes(
                new Date().getMinutes() < 30 ? 30 : 60,
                0,
                0
            )
        ).getTime() - Date.now();
    console.log(diff, "Difference")
    if (diff <= 0) return null;
    return {
        // days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / (1000 * 60)) % 60),
        secs: Math.floor((diff / 1000) % 60),
    };
}

function pad(n: number) {
    return String(n).padStart(2, "0");
}

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(null);
    const [bannerDismissed, setBannerDismissed] = useState(true);
    const [mounted, setMounted] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    // ── Measure wrapper height and push a CSS variable onto <html> ──────────
    // Every page uses `padding-top: var(--navbar-h)` instead of a fixed pt-20.
    useEffect(() => {
        function updateHeight() {
            // if (wrapperRef.current) {
            //     const h = wrapperRef.current.offsetHeight;
            //     document.documentElement.style.setProperty("--navbar-h", `${h}px`);
            // }
            if (wrapperRef.current) {
                const h = wrapperRef.current.offsetHeight;
                // Only add what's above the base navbar height (64px)
                const extra = Math.max(0, h - 64);
                document.documentElement.style.setProperty("--navbar-h", `${extra}px`);
            }
        }
        updateHeight();
        const ro = new ResizeObserver(updateHeight);
        if (wrapperRef.current) ro.observe(wrapperRef.current);
        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => { setOpen(false); }, [pathname]);

    useEffect(() => {
        setMounted(true);
        if (sessionStorage.getItem("promo-banner-dismissed") === "true") {
            setBannerDismissed(true);
            return;
        }
        setBannerDismissed(false);
        setTimeLeft(getTimeLeft());
        const interval = setInterval(() => {
            const t = getTimeLeft();
            setTimeLeft(t);
            if (!t) clearInterval(interval);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    function handleDismiss() {
        setBannerDismissed(true);
        sessionStorage.setItem("promo-banner-dismissed", "true");
    }

    const showBanner = mounted && !bannerDismissed && !!timeLeft;

    return (
        <>
            {/* Fixed wrapper — measured via ref */}
            <div ref={wrapperRef} className="fixed top-0 left-0 right-0 z-50">

                {/* ── Promo Banner ── */}
                {showBanner && (
                    <div
                        className="relative w-full overflow-hidden"
                        style={{
                            background: "linear-gradient(135deg, var(--deep) 0%, #1a4a4a 60%, var(--teal) 100%)",
                        }}
                    >
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background: "repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.04) 60px, rgba(255,255,255,0.04) 61px)",
                            }}
                        />

                        {/* Mobile */}
                        <div className="flex sm:hidden items-center justify-between px-4 py-2 gap-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                                <Zap size={11} className="text-white opacity-80 flex-shrink-0" fill="currentColor" />
                                <span className="text-white text-xs font-medium truncate">
                                    Single session —{" "}
                                    <span className="line-through opacity-40 font-normal">₦35k</span>{" "}
                                    <span className="font-bold">₦10,000</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0 text-white text-xs tabular-nums opacity-80">
                                <Clock size={10} className="opacity-60" />
                                <span>{pad(timeLeft!.hours)}h {pad(timeLeft!.mins)}m {pad(timeLeft!.secs)}s </span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <Link
                                    href="#book"
                                    className="text-xs font-semibold text-white bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-full transition-all whitespace-nowrap"
                                >
                                    Book now
                                </Link>
                                <button onClick={handleDismiss} className="text-white opacity-50 hover:opacity-100 transition-opacity p-0.5" aria-label="Dismiss">
                                    <X size={13} />
                                </button>
                            </div>
                        </div>

                        {/* Desktop */}
                        <div className="hidden sm:flex items-center justify-center gap-5 px-12 py-2.5 text-white text-sm">
                            <div className="flex items-center gap-2">
                                <Zap size={13} fill="currentColor" className="opacity-80" />
                                <span className="font-light opacity-80">Introductory offer —</span>
                                <span className="font-medium">
                                    Book a single session for{" "}
                                    <span className="line-through opacity-40 font-normal">₦35,000</span>{" "}
                                    <span className="font-bold text-white text-base">₦10,000</span>
                                </span>
                            </div>
                            <div className="w-px h-4 bg-white opacity-20" />
                            <div className="flex items-center gap-2 font-light">
                                <Clock size={13} className="opacity-60" />
                                <span className="opacity-70 text-xs">Offer ends in</span>
                                <div className="flex items-center gap-1">
                                    {/* {timeLeft!.days > 0 && (
                                        <>
                                            <span className="font-cormorant text-lg font-semibold tabular-nums" style={{ letterSpacing: "-0.02em" }}>{pad(timeLeft!.days)}</span>
                                            <span className="text-xs opacity-60 mr-1">d</span>
                                        </>
                                    )} */}
                                    <span className="font-cormorant text-lg font-semibold tabular-nums">{pad(timeLeft!.hours)}</span>
                                    <span className="text-xs opacity-60 mr-1">h</span>
                                    <span className="font-cormorant text-lg font-semibold tabular-nums">{pad(timeLeft!.mins)}</span>
                                    <span className="text-xs opacity-60 mr-1">m</span>
                                    <span className="font-cormorant text-lg font-semibold tabular-nums">{pad(timeLeft!.secs)}</span>
                                    <span className="text-xs opacity-60">s</span>
                                </div>
                            </div>
                            <div className="w-px h-4 bg-white opacity-20" />
                            <Link
                                href="#book"
                                className="flex items-center gap-1.5 text-xs font-semibold bg-white/15 hover:bg-white/25 border border-white/20 px-4 py-1.5 rounded-full transition-all duration-200 hover:-translate-y-0.5"
                            >
                                Claim offer
                                <ArrowRight size={11} />
                            </Link>
                        </div>

                        <button
                            onClick={handleDismiss}
                            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 text-white opacity-40 hover:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-white/10"
                            aria-label="Dismiss banner"
                        >
                            <X size={13} />
                        </button>
                    </div>
                )}

                {/* ── Navbar ── */}
                <header
                    className={`w-full transition-all duration-300 ${scrolled
                        ? "bg-white/95 backdrop-blur-md border-b shadow-sm"
                        : "bg-white/80 backdrop-blur-sm"
                        }`}
                    style={{ borderColor: scrolled ? "var(--border)" : "transparent" }}
                >
                    <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2.5">
                            <Image src="/logo.png" alt="Mentel logo" width={108} height={61} className="object-contain" priority />
                        </Link>

                        <div className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-sm transition-colors duration-200 ${pathname === link.href ? "font-medium" : "hover:opacity-70"}`}
                                    style={{ color: pathname === link.href ? "var(--sage-dark)" : "var(--text-muted)" }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/assessment"
                                    className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
                                    style={{ borderColor: "rgba(123,169,139,0.45)", color: "var(--sage-dark)", background: "rgba(123,169,139,0.07)" }}
                                >
                                    <ClipboardCheck size={13} />
                                    Free Check
                                </Link>
                                <Link
                                    href="#book"
                                    className="text-sm font-medium text-white px-5 py-2 rounded-full transition-all duration-200 hover:opacity-90 hover:shadow-md hover:-translate-y-0.5"
                                    style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                                >
                                    Book Now
                                </Link>
                            </div>
                        </div>

                        <button
                            className="md:hidden p-2 rounded-lg"
                            style={{ color: "var(--deep)" }}
                            onClick={() => setOpen(!open)}
                            aria-label="Toggle menu"
                        >
                            {open ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </nav>

                    {open && (
                        <div className="md:hidden bg-white border-t px-6 py-4 flex flex-col gap-4 shadow-lg" style={{ borderColor: "var(--border)" }}>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-sm py-1 ${pathname === link.href ? "font-medium" : ""}`}
                                    style={{ color: pathname === link.href ? "var(--sage-dark)" : "var(--text-muted)" }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link
                                href="/assessment"
                                className={`text-sm py-1 flex items-center gap-2 ${pathname === "/assessment" ? "font-medium" : ""}`}
                                style={{ color: pathname === "/assessment" ? "var(--sage-dark)" : "var(--text-muted)" }}
                            >
                                <ClipboardCheck size={13} style={{ color: "var(--sage)" }} />
                                Free Assessment
                            </Link>
                            <Link
                                href="#book"
                                className="text-sm font-medium text-white px-5 py-2.5 rounded-full text-center mt-1"
                                style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                            >
                                Book Now — ₦10,000
                            </Link>
                        </div>
                    )}
                </header>
            </div>

            {/* ── Spacer div — always matches the fixed wrapper's real height ── */}
            {/* This is what actually pushes page content down correctly */}
            <div style={{ height: "var(--navbar-h, 0px)" }} aria-hidden="true" />
        </>
    );
}