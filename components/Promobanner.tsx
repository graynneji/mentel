"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, X, Zap } from "lucide-react";

// ── Set your offer deadline here ─────────────────────────────────────────────
const DEADLINE = new Date("2025-04-30T23:59:59"); // change to your actual end date
// ─────────────────────────────────────────────────────────────────────────────

function getTimeLeft() {
    const diff = DEADLINE.getTime() - Date.now();
    if (diff <= 0) return null;
    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / (1000 * 60)) % 60),
        secs: Math.floor((diff / 1000) % 60),
    };
}

function pad(n: number) {
    return String(n).padStart(2, "0");
}

export default function PromoBanner() {
    const [timeLeft, setTimeLeft] = useState(getTimeLeft());
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Check sessionStorage so it stays dismissed during the session
        if (sessionStorage.getItem("promo-banner-dismissed") === "true") {
            setDismissed(true);
            return;
        }
        const interval = setInterval(() => {
            const t = getTimeLeft();
            setTimeLeft(t);
            if (!t) clearInterval(interval);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    function handleDismiss() {
        setDismissed(true);
        sessionStorage.setItem("promo-banner-dismissed", "true");
    }

    // Hide if dismissed or offer has expired
    if (dismissed || !timeLeft) return null;

    return (
        <div
            className="relative z-50 w-full px-4 py-2.5 flex items-center justify-center gap-3 sm:gap-6 text-white text-xs sm:text-sm overflow-hidden"
            style={{
                background: "linear-gradient(135deg, var(--deep) 0%, #1a4a4a 50%, var(--teal) 100%)",
            }}
        >
            {/* Subtle shimmer line */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    background:
                        "repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.15) 40px, rgba(255,255,255,0.15) 41px)",
                }}
            />

            {/* Flash icon + offer text */}
            <div className="flex items-center gap-2 flex-shrink-0">
                <Zap size={13} className="opacity-80 flex-shrink-0" fill="currentColor" />
                <span className="font-light opacity-90 hidden sm:inline">Limited offer —</span>
                <span className="font-medium">
                    Sessions from{" "}
                    <span
                        className="line-through opacity-50 font-normal"
                        style={{ textDecorationColor: "rgba(255,255,255,0.5)" }}
                    >
                        ₦35,000
                    </span>{" "}
                    <span className="font-semibold text-white">₦5,500</span>
                </span>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-4 opacity-20" style={{ background: "white" }} />

            {/* Countdown */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
                {timeLeft.days > 0 && (
                    <>
                        <Digit value={pad(timeLeft.days)} label="d" />
                        <Colon />
                    </>
                )}
                <Digit value={pad(timeLeft.hours)} label="h" />
                <Colon />
                <Digit value={pad(timeLeft.mins)} label="m" />
                <Colon />
                <Digit value={pad(timeLeft.secs)} label="s" />
            </div>

            {/* CTA */}
            <Link
                href="/#book"
                className="hidden sm:flex items-center gap-1 font-medium underline underline-offset-2 opacity-90 hover:opacity-100 transition-opacity flex-shrink-0"
            >
                Claim offer
                <ArrowRight size={12} />
            </Link>

            {/* Dismiss */}
            <button
                onClick={handleDismiss}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity p-1"
                aria-label="Dismiss banner"
            >
                <X size={14} />
            </button>
        </div>
    );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function Digit({ value, label }: { value: string; label: string }) {
    return (
        <div className="flex items-baseline gap-0.5">
            <span
                className="font-cormorant text-base sm:text-lg font-semibold tabular-nums leading-none"
                style={{ letterSpacing: "-0.02em" }}
            >
                {value}
            </span>
            <span className="text-xs opacity-60">{label}</span>
        </div>
    );
}

function Colon() {
    return (
        <span className="text-sm opacity-40 font-light leading-none" style={{ marginTop: "-2px" }}>
            :
        </span>
    );
}