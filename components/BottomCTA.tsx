"use client";
import Link from "next/link";
import { ArrowRight, ClipboardCheck } from "lucide-react";

function scrollToBooking() {
    document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function BottomCTA() {
    return (
        <section className="relative z-10 py-14 sm:py-20 px-4 sm:px-6">

            <div className="max-w-xl mx-auto text-center">
                <div
                    className="w-10 h-1 rounded-full mx-auto mb-6"
                    style={{ background: "linear-gradient(90deg, var(--sage), var(--teal))" }}
                />
                <h2 className="font-cormorant text-3xl sm:text-4xl font-light mb-4" style={{ color: "var(--deep)" }}>
                    Ready to take the<br />
                    <em className="italic" style={{ color: "var(--sage-dark)" }}>first step</em>?
                </h2>
                <p className="text-sm sm:text-base mb-3 max-w-xs mx-auto" style={{ color: "var(--text-muted)" }}>
                    Your first consultation is the hardest part. We make it easy, safe, and judgment-free.
                </p>
                <p className="text-xs mb-8 font-medium" style={{ color: "var(--sage-dark)" }}>
                    🔥 Single session currently ₦8,500 - limited time offer
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={scrollToBooking}
                        className="inline-flex items-center justify-center gap-2 text-sm font-medium text-white px-7 py-3.5 rounded-full transition-all hover:-translate-y-0.5 hover:shadow-lg duration-200 cursor-pointer"
                        style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                    >
                        Book Your Session
                        <ArrowRight size={15} />
                    </button>
                    <Link
                        href="/assessment"
                        className="inline-flex items-center justify-center gap-2 text-sm font-medium px-7 py-3.5 rounded-full border transition-all hover:-translate-y-0.5 hover:shadow-sm duration-200"
                        style={{ borderColor: "rgba(123,169,139,0.4)", color: "var(--sage-dark)", background: "rgba(123,169,139,0.07)" }}
                    >
                        <ClipboardCheck size={15} />
                        Free Assessment
                    </Link>
                </div>
            </div>
        </section>
    );
}