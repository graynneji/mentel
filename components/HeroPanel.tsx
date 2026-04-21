"use client";
import Link from "next/link";
import {
    Shield, Clock, Star, ArrowRight, ClipboardCheck,
    Users, CheckCircle, Lock, ArrowLeft, Leaf,
} from "lucide-react";
import BookingForm from "@/components/BookingForm";
import { useBooking } from "@/app/context/BookingContext";
// import { useBooking } from "@/context/BookingContext";

const trustItems = [
    { icon: Shield, text: "NDPR-compliant & fully confidential" },
    { icon: Star, text: "Licensed, empathetic professionals" },
    { icon: Clock, text: "First session response within 24 hours" },
];

const microTrust = [
    { icon: Lock, label: "Secure payment", sub: "Paystack-encrypted" },
    { icon: CheckCircle, label: "Free rematch", sub: "If you don't connect" },
    { icon: Users, label: "500+ sessions", sub: "98% satisfaction" },
];

export default function HeroPanel() {
    const { showForm, openBooking, closeBooking } = useBooking();


    const trustBadges = [
        { name: "A", gradient: "linear-gradient(135deg, #3d8b8b, #6fb8b8)" }, // teal
        { name: "E", gradient: "linear-gradient(135deg, #a97b3d, #d4b87b)" }, // warm gold
        { name: "F", gradient: "linear-gradient(135deg, #4e7a5e, #7ba98b)" }, // sage
        { name: "K", gradient: "linear-gradient(135deg, #5a6fa8, #8fa4d6)" }, // calm blue
        { name: "T", gradient: "linear-gradient(135deg, #8b5e7a, #c08fa4)" }, // soft plum
    ];
    return (
        <>
            <div id="hero-panel">
                <div
                    className="rounded-2xl sm:rounded-3xl relative overflow-hidden w-full"
                    style={{
                        background: "rgba(255,255,255,0.92)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(200,221,210,0.6)",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.02), 0 20px 60px rgba(61,139,139,0.08)",
                    }}
                >
                    <div
                        className="absolute top-0 left-0 right-0 h-0.5 z-10"
                        style={{ background: "linear-gradient(90deg, var(--sage), var(--teal), var(--sage-light))" }}
                    />

                    {/* ── TRUST PANEL ── */}
                    <div
                        className="p-6 sm:p-8 md:p-10"
                        style={{
                            transition: "opacity 0.3s ease, transform 0.35s cubic-bezier(0.4,0,0.2,1)",
                            opacity: showForm ? 0 : 1,
                            transform: showForm ? "translateX(-24px)" : "translateX(0)",
                            pointerEvents: showForm ? "none" : "auto",
                            position: showForm ? "absolute" : "relative",
                            inset: showForm ? "0" : "auto",
                        }}
                    >
                        <div
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border mb-5"
                            style={{
                                background: "rgba(192,85,90,0.07)",
                                borderColor: "rgba(192,85,90,0.22)",
                                color: "var(--error)",
                            }}
                        >
                            <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ background: "var(--error)" }} />
                            Single session - ₦8,500 limited offer
                        </div>

                        <div className="flex flex-col gap-3 mb-7">
                            {trustItems.map(({ icon: Icon, text }) => (
                                <div key={text} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(123,169,139,0.14)" }}>
                                        <Icon size={15} style={{ color: "var(--sage-dark)" }} />
                                    </div>
                                    <span className="text-sm" style={{ color: "var(--text-muted)" }}>{text}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 mb-7 pb-6 border-b" style={{ borderColor: "rgba(123,169,139,0.15)" }}>
                            <div className="flex -space-x-2">
                                {trustBadges.map((badge) => (
                                    <div
                                        key={badge.name}
                                        className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-semibold text-white"
                                        style={{
                                            background: badge.gradient,
                                            borderColor: "white",
                                        }}
                                    >
                                        {badge.name}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div className="flex gap-0.5 mb-0.5">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} size={11} fill="#c7a86b" style={{ color: "#c7a86b", opacity: 0.9 }} />
                                        // <Star key={i} size={11} fill="var(--sage)" style={{ color: "var(--sage)" }} />
                                    ))}
                                </div>
                                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Trusted by 500+ clients across Nigeria</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-7">
                            {microTrust.map(({ icon: Icon, label, sub }) => (
                                <div
                                    key={label}
                                    className="flex flex-col items-center text-center gap-1 rounded-xl p-2.5"
                                    style={{ background: "rgba(123,169,139,0.05)", border: "1px solid rgba(123,169,139,0.12)" }}
                                >
                                    <Icon size={14} style={{ color: "var(--sage-dark)" }} />
                                    <span className="text-xs font-medium leading-tight" style={{ color: "var(--deep)" }}>{label}</span>
                                    <span style={{ color: "var(--text-muted)", fontSize: "10px" }} className="leading-tight">{sub}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={openBooking}
                            className="w-full py-4 rounded-2xl text-white text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 cursor-pointer"
                            style={{
                                background: "linear-gradient(135deg, var(--sage-dark), var(--teal))",
                                boxShadow: "0 4px 20px rgba(61,139,139,0.28)",
                            }}
                        >
                            Book a Session
                            <ArrowRight size={15} />
                        </button>

                        <p className="text-center text-xs mt-2.5" style={{ color: "var(--text-muted)" }}>
                            No commitment · Cancel anytime · 2 min to book
                        </p>
                    </div>

                    {/* ── BOOKING FORM ── */}
                    <div
                        className="p-6 sm:p-8 md:p-10"
                        style={{
                            transition: "opacity 0.3s ease 0.05s, transform 0.35s cubic-bezier(0.4,0,0.2,1)",
                            opacity: showForm ? 1 : 0,
                            transform: showForm ? "translateX(0)" : "translateX(24px)",
                            pointerEvents: showForm ? "auto" : "none",
                            position: showForm ? "relative" : "absolute",
                            inset: showForm ? "auto" : "0",
                        }}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                                <Leaf size={18} style={{ color: "var(--sage)" }} />
                                <h2 className="font-cormorant text-xl sm:text-2xl font-semibold" style={{ color: "var(--deep)" }}>
                                    Book Your Session
                                </h2>
                            </div>
                            <button
                                onClick={closeBooking}
                                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full transition-all hover:-translate-x-0.5 cursor-pointer"
                                style={{ color: "var(--text-muted)", background: "rgba(123,169,139,0.08)", border: "1px solid rgba(123,169,139,0.18)" }}
                            >
                                <ArrowLeft size={12} />
                                Back
                            </button>
                        </div>

                        <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
                            Takes 2 minutes · No commitment required
                        </p>

                        <BookingForm />
                    </div>
                </div>
            </div>

            {/* Assessment nudge */}
            <div
                style={{
                    transition: "opacity 0.3s ease, transform 0.3s ease",
                    opacity: showForm ? 0 : 1,
                    transform: showForm ? "translateY(6px)" : "translateY(0)",
                    pointerEvents: showForm ? "none" : "auto",
                }}
            >
                <Link
                    href="/assessment"
                    className="group mt-4 flex items-center gap-3 px-5 py-3.5 rounded-2xl border transition-all hover:-translate-y-0.5 hover:shadow-sm duration-200 w-full"
                    style={{ background: "rgba(123,169,139,0.07)", borderColor: "rgba(123,169,139,0.3)" }}
                >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}>
                        <ClipboardCheck size={15} color="white" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-medium" style={{ color: "var(--deep)" }}>Not sure where to start?</p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Take our free 2-min mental health check</p>
                    </div>
                    <ArrowRight size={14} style={{ color: "var(--sage-dark)" }} className="transition-transform group-hover:translate-x-1 duration-200" />
                </Link>
            </div>
        </>
    );
}