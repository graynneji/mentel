// app/booking/page.tsx
"use client";

import Link from "next/link";
import { ArrowLeft, Leaf, ShieldCheck, Clock, HeartHandshake } from "lucide-react";
import BookingForm from "@/components/BookingForm";

const TRUST_POINTS = [
    {
        icon: ShieldCheck,
        title: "Confidential by default",
        desc: "Encrypted and only shared with your matched therapist.",
    },
    {
        icon: Clock,
        title: "24-hour response",
        desc: "A licensed therapist confirms your session within a day.",
    },
    {
        icon: HeartHandshake,
        title: "No pressure",
        desc: "Reschedule or cancel anytime before your session.",
    },
];

export default function BookingPage() {
    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ background: "linear-gradient(180deg, #FBFAF6 0%, #F2F7F3 55%, #ECF4EF 100%)" }}
        >
            {/* Minimal top bar — no nav, no footer */}
            <header className="flex items-center justify-between px-6 sm:px-10 py-5 sm:py-6">
                <Link
                    href="/"
                    className="flex items-center gap-1.5 text-sm font-medium transition-all hover:-translate-x-0.5"
                    style={{ color: "var(--text-muted)" }}
                >
                    <ArrowLeft size={16} />
                    Back to home
                </Link>
                <div className="flex items-center gap-2">
                    <Leaf size={18} style={{ color: "var(--sage)" }} />
                    <span className="font-cormorant text-lg font-semibold" style={{ color: "var(--deep)" }}>
                        Mindful Space
                    </span>
                </div>
            </header>

            {/* Centered content */}
            <main className="flex-1 flex flex-col items-center px-4 sm:px-6 pb-16 pt-4 sm:pt-8">
                <div className="w-full max-w-3xl">
                    {/* Page header */}
                    <div className="text-center mb-7 sm:mb-9">
                        <h1
                            className="font-cormorant text-3xl sm:text-4xl font-semibold leading-tight mb-2.5"
                            style={{ color: "var(--deep)" }}
                        >
                            Let's find your perfect therapist
                        </h1>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                            A few details about you and how you&apos;d like to pay, that&apos;s it.
                            <br className="hidden sm:block" />
                            Takes about two minutes, no commitment required.
                        </p>
                    </div>

                    {/* Form card */}
                    <div
                        className="rounded-3xl px-5 sm:px-9 py-7 sm:py-10"
                        style={{
                            background: "rgba(255,255,255,0.98)",
                            border: "1px solid rgba(123,169,139,0.18)",
                            boxShadow: "0 24px 70px rgba(61,139,139,0.10), 0 0 0 1px rgba(200,221,210,0.4)",
                        }}
                    >
                        <BookingForm />
                    </div>

                    {/* Trust strip — below the form */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mt-8">
                        {TRUST_POINTS.map(({ icon: Icon, title, desc }) => (
                            <div
                                key={title}
                                className="flex flex-col items-center text-center gap-2 px-3 py-1"
                            >
                                <div
                                    className="w-9 h-9 rounded-full flex items-center justify-center"
                                    style={{ background: "rgba(123,169,139,0.12)" }}
                                >
                                    <Icon size={16} style={{ color: "var(--sage-dark)" }} />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold mb-0.5" style={{ color: "var(--deep)" }}>
                                        {title}
                                    </p>
                                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                                        {desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}