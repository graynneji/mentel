"use client";
import { useEffect, useRef } from "react";
import { X, Leaf } from "lucide-react";
import BookingForm from "@/components/BookingForm";

interface BookingModalProps {
    open: boolean;
    onClose: () => void;
}

export default function BookingModal({ open, onClose }: BookingModalProps) {
    const panelRef = useRef<HTMLDivElement>(null);

    // Lock body scroll when open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    // Close on Escape
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose]);

    return (
        <>
            {/* Backdrop */}
            <div
                aria-hidden="true"
                onClick={onClose}
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 50,
                    background: "rgba(10,30,24,0.55)",
                    backdropFilter: "blur(6px)",
                    transition: "opacity 0.3s ease",
                    opacity: open ? 1 : 0,
                    pointerEvents: open ? "auto" : "none",
                }}
            />

            {/* Modal panel */}
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label="Book a therapy session"
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 51,
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    pointerEvents: open ? "auto" : "none",
                    // On sm+ center vertically
                }}
                className="sm:items-center sm:px-4"
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: "480px",
                        maxHeight: "92dvh",
                        overflowY: "auto",
                        background: "rgba(255,255,255,0.98)",
                        borderRadius: "24px 24px 0 0",
                        boxShadow: "0 -8px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(200,221,210,0.5)",
                        transition: "transform 0.35s cubic-bezier(0.32,0.72,0,1), opacity 0.3s ease",
                        transform: open ? "translateY(0)" : "translateY(40px)",
                        opacity: open ? 1 : 0,
                        position: "relative",
                    }}
                    className="sm:rounded-3xl"
                >
                    {/* Top gradient accent */}
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "3px",
                            background: "linear-gradient(90deg, var(--sage), var(--teal), var(--sage-light))",
                            borderRadius: "24px 24px 0 0",
                        }}
                        className="sm:rounded-t-3xl"
                    />

                    {/* Drag handle pill — mobile only */}
                    <div className="flex justify-center pt-5 pb-1 sm:hidden">
                        <div
                            style={{
                                width: "36px",
                                height: "4px",
                                borderRadius: "2px",
                                background: "rgba(123,169,139,0.35)",
                            }}
                        />
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 sm:px-8 pt-4 sm:pt-7 pb-1">
                        <div className="flex items-center gap-2">
                            <Leaf size={18} style={{ color: "var(--sage)" }} />
                            <h2
                                className="font-cormorant text-xl sm:text-2xl font-semibold"
                                style={{ color: "var(--deep)" }}
                            >
                                Book Your Session
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            aria-label="Close booking modal"
                            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                            style={{
                                background: "rgba(123,169,139,0.10)",
                                color: "var(--text-muted)",
                            }}
                        >
                            <X size={15} />
                        </button>
                    </div>

                    <p
                        className="px-6 sm:px-8 text-xs mt-1 mb-5"
                        style={{ color: "var(--text-muted)" }}
                    >
                        Takes 2 minutes · No commitment required
                    </p>

                    {/* Form */}
                    <div className="px-6 sm:px-8 pb-8">
                        <BookingForm />
                    </div>
                </div>
            </div>
        </>
    );
}