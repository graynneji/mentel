"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Leaf } from "lucide-react";
import Image from "next/image";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-white/90 backdrop-blur-md border-b border-border shadow-sm"
                : "bg-transparent"
                }`}
        >
            <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    {/* <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sage to-teal flex items-center justify-center shadow-sm">
                        <Leaf size={16} color="white" strokeWidth={2} />
                    </div>
                    <span
                        className="font-cormorant text-2xl font-semibold tracking-tight"
                        style={{ color: "var(--deep)" }}
                    >
                        Mentel
                    </span> */}
                    <Image
                        src="/logo.png"
                        alt="Mentel logo"
                        width={108}
                        height={61}
                        className="object-contain"
                        priority
                    />

                </Link>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-dm transition-colors duration-200 ${pathname === link.href
                                ? "text-sage-dark font-medium"
                                : "text-text-muted hover:text-deep"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/#book"
                        className="text-sm font-medium text-white px-5 py-2 rounded-full transition-all duration-200 hover:opacity-90 hover:shadow-md"
                        style={{
                            background: "linear-gradient(135deg, var(--sage-dark), var(--teal))",
                        }}
                    >
                        Book Now
                    </Link>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden p-2 rounded-lg transition-colors hover:bg-mist"
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle menu"
                >
                    {open ? (
                        <X size={20} style={{ color: "var(--deep)" }} />
                    ) : (
                        <Menu size={20} style={{ color: "var(--deep)" }} />
                    )}
                </button>
            </nav>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden bg-white border-t border-border px-6 py-4 flex flex-col gap-4 shadow-lg">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm py-1 transition-colors ${pathname === link.href
                                ? "text-sage-dark font-medium"
                                : "text-text-muted"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/#book"
                        className="text-sm font-medium text-white px-5 py-2.5 rounded-full text-center mt-1"
                        style={{
                            background: "linear-gradient(135deg, var(--sage-dark), var(--teal))",
                        }}
                    >
                        Book Now
                    </Link>
                </div>
            )}
        </header>
    );
}
