/**
 * CrisisBar — sticky top bar (below navbar) showing crisis resources.
 * Ethical requirement for any mental health platform.
 * Dismissible per session. Accessible: role="alert" for screen readers.
 *
 * Place this ABOVE <BgBlobs /> in page.tsx, outside the relative wrapper,
 * so it stacks just below the navbar.
 *
 * Usage:
 *   import CrisisBar from "@/components/CrisisBar";
 *   <CrisisBar />
 */

"use client";
import { useState, useEffect } from "react";
import { Phone, X } from "lucide-react";

const CRISIS_LINES = [
    { label: "SURPIN (suicide prevention)", number: "0800-567-7890" },
    { label: "LASUTH Emergency", number: "08060601114" },
];

export default function CrisisBar() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Only show once per session to avoid compassion fatigue
        if (!sessionStorage.getItem("crisis-bar-dismissed")) {
            setVisible(true);
        }
    }, []);

    function dismiss() {
        setVisible(false);
        sessionStorage.setItem("crisis-bar-dismissed", "true");
    }

    if (!visible) return null;

    return (
        <div
            role="alert"
            aria-live="polite"
            className="relative z-40 w-full px-4 py-2.5 flex items-center justify-between gap-4 flex-wrap"
            style={{
                background: "linear-gradient(90deg, rgba(61,139,139,0.10) 0%, rgba(123,169,139,0.12) 100%)",
                borderBottom: "1px solid rgba(123,169,139,0.22)",
            }}
        >
            <div className="flex items-center gap-2 flex-wrap">
                <div
                    className="flex items-center gap-1.5 text-xs font-medium flex-shrink-0"
                    style={{ color: "var(--sage-dark)" }}
                >
                    <Phone size={12} />
                    <span className="font-semibold">In crisis?</span>
                </div>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Reach out immediately —
                </span>
                <div className="flex items-center gap-3 flex-wrap">
                    {CRISIS_LINES.map(({ label, number }) => (
                        <a
                            key={number}
                            href={`tel:${number.replace(/\D/g, "")}`}
                            className="inline-flex items-center gap-1 text-xs font-medium underline underline-offset-2 transition-opacity hover:opacity-70"
                            style={{ color: "var(--sage-dark)" }}
                        >
                            {label}: <span className="font-bold">{number}</span>
                        </a>
                    ))}
                </div>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    · or go to your nearest emergency room.
                </span>
            </div>
            <button
                onClick={dismiss}
                aria-label="Dismiss crisis bar"
                className="flex-shrink-0 p-1 rounded-full transition-opacity hover:opacity-60"
                style={{ color: "var(--text-muted)" }}
            >
                <X size={13} />
            </button>
        </div>
    );
}