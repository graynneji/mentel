"use client";
import Link from "next/link";
import { Leaf } from "lucide-react";
import Image from "next/image";

// Social icons as inline SVG (since lucide doesn't have brand icons)
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

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-border bg-white/60 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2.5 mb-4">
                            {/* <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sage to-teal flex items-center justify-center">
                                <Leaf size={16} color="white" strokeWidth={2} />
                            </div>
                            <span className="font-cormorant text-2xl font-semibold" style={{ color: "var(--deep)" }}>
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
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                            Professional mental health care, delivered with compassion and evidence-based practice.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
                            Navigation
                        </h4>
                        <ul className="space-y-2.5">
                            {[
                                { href: "/", label: "Home" },
                                { href: "/about", label: "About Us" },
                                { href: "/services", label: "Services" },
                                { href: "/contact", label: "Contact" },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm transition-colors hover:text-sage-dark"
                                        style={{ color: "var(--text-muted)" }}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social + Legal */}
                    <div>
                        <h4 className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
                            Connect With Us
                        </h4>
                        <div className="flex gap-3 mb-6">
                            <a
                                href="https://wa.me/2340000000000"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="WhatsApp"
                                className="w-9 h-9 rounded-full border border-border flex items-center justify-center transition-all hover:border-sage hover:bg-mist"
                                style={{ color: "var(--text-muted)" }}
                            >
                                <WhatsAppIcon />
                            </a>
                            <a
                                href="https://instagram.com/mentel"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="w-9 h-9 rounded-full border border-border flex items-center justify-center transition-all hover:border-sage hover:bg-mist"
                                style={{ color: "var(--text-muted)" }}
                            >
                                <InstagramIcon />
                            </a>
                            <a
                                href="https://tiktok.com/@mentel"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="TikTok"
                                className="w-9 h-9 rounded-full border border-border flex items-center justify-center transition-all hover:border-sage hover:bg-mist"
                                style={{ color: "var(--text-muted)" }}
                            >
                                <TikTokIcon />
                            </a>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Link href="/terms" className="text-sm transition-colors hover:text-sage-dark" style={{ color: "var(--text-muted)" }}>
                                Terms of Service
                            </Link>
                            <Link href="/privacy" className="text-sm transition-colors hover:text-sage-dark" style={{ color: "var(--text-muted)" }}>
                                Privacy Policy
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border pt-6 text-center text-xs" style={{ color: "var(--text-muted)" }}>
                    &copy; {year} Mentel. All rights reserved. &middot; Confidential &amp; Secure
                </div>
            </div>
        </footer>
    );
}
