// components/WhatsAppButton.tsx
"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

// Set this in your .env file:
// NEXT_PUBLIC_WHATSAPP_NUMBER=2348012345678   (no + or leading zeros, country code first)
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
const DEFAULT_MESSAGE = "Hi, I'd like to know more about booking a session with Mentel.";

// Hide the button on internal/admin/app routes; show it everywhere else
// (landing page, /about, /contact, /articles/*, /services, etc.).
// A prefix deny-list means new marketing pages just work automatically —
// you only need to remember to add a prefix here if you add a new
// internal area, not every time you add a new public page.
const BLOCKED_PREFIXES = ["/admin", "/assessment", "/book", "/marketing"];

export default function WhatsAppButton() {
    const pathname = usePathname();
    const isBlocked = BLOCKED_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );
    if (isBlocked) {
        return null;
    }

    if (!WHATSAPP_NUMBER) {
        // Fails loudly in dev instead of silently rendering a dead button.
        if (process.env.NODE_ENV !== "production") {
            console.warn(
                "WhatsAppButton: NEXT_PUBLIC_WHATSAPP_NUMBER is not set. Add it to your .env file."
            );
        }
        return null;
    }

    const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
            className="whatsapp-fab"
        >
            <span className="whatsapp-fab-ring" aria-hidden="true" />
            <MessageCircle size={26} color="white" strokeWidth={2} />

            <style jsx>{`
                .whatsapp-fab {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 50;
                    width: 56px;
                    height: 56px;
                    border-radius: 9999px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, var(--sage-dark), var(--teal));
                    box-shadow: 0 6px 24px rgba(61, 139, 139, 0.35);
                    text-decoration: none;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .whatsapp-fab:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 28px rgba(61, 139, 139, 0.42);
                }
                .whatsapp-fab-ring {
                    position: absolute;
                    inset: 0;
                    border-radius: 9999px;
                    background: var(--sage);
                    opacity: 0.5;
                    animation: whatsapp-pulse 2.4s ease-out infinite;
                }
                @keyframes whatsapp-pulse {
                    0% {
                        transform: scale(1);
                        opacity: 0.45;
                    }
                    70% {
                        transform: scale(1.6);
                        opacity: 0;
                    }
                    100% {
                        transform: scale(1.6);
                        opacity: 0;
                    }
                }
                @media (prefers-reduced-motion: reduce) {
                    .whatsapp-fab-ring {
                        animation: none;
                        display: none;
                    }
                }
                @media (max-width: 480px) {
                    .whatsapp-fab {
                        bottom: 16px;
                        right: 16px;
                        width: 52px;
                        height: 52px;
                    }
                }
            `}</style>
        </a>
    );
}