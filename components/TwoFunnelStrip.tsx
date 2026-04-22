/**
 * TwoFunnelStrip — hero-section component that clearly separates the
 * B2C (individual therapy) and B2B (for employers/HR) funnels.
 *
 * Replaces the vague emotional micro-copy block in the original hero.
 * Gives each visitor a single clear next action.
 *
 * Usage (in hero section, below the subtitle):
 *   import TwoFunnelStrip from "@/components/TwoFunnelStrip";
 *   <TwoFunnelStrip />
 */

"use client";
import Link from "next/link";
import { ArrowRight, User, Building2 } from "lucide-react";
import { useBooking } from "@/app/context/BookingContext";

export default function TwoFunnelStrip() {
    const { openBooking } = useBooking();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* ── Individual funnel ── */}
            <button
                onClick={openBooking}
                className="group text-left rounded-2xl p-4 border transition-all hover:-translate-y-0.5 hover:shadow-md duration-200 cursor-pointer"
                style={{
                    background: "linear-gradient(135deg, rgba(78,122,94,0.07), rgba(61,139,139,0.07))",
                    borderColor: "rgba(123,169,139,0.35)",
                }}
            >
                <div className="flex items-start gap-3">
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: "linear-gradient(135deg, #4e7a5e, #3d8b8b)" }}
                    >
                        <User size={15} color="white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--deep)" }}>
                            For You
                        </p>
                        <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                            Individual therapy, couples sessions, trauma support, from ₦8,500.
                        </p>
                    </div>
                    <ArrowRight
                        size={14}
                        className="flex-shrink-0 mt-1 transition-transform group-hover:translate-x-1 duration-200"
                        style={{ color: "var(--sage-dark)" }}
                    />
                </div>
            </button>

            {/* ── Employer / HR funnel ── */}
            <Link
                href="/eap"
                className="group rounded-2xl p-4 border transition-all hover:-translate-y-0.5 hover:shadow-md duration-200"
                style={{
                    background: "linear-gradient(135deg, rgba(14,34,34,0.05), rgba(61,139,139,0.07))",
                    borderColor: "rgba(61,139,139,0.28)",
                }}
            >
                <div className="flex items-start gap-3">
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: "linear-gradient(135deg, #1c3a3a, #3d8b8b)" }}
                    >
                        <Building2 size={15} color="white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--deep)" }}>
                            For Your Team
                        </p>
                        <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                            Employee wellness programmes for Lagos startups &amp; enterprises.
                        </p>
                    </div>
                    <ArrowRight
                        size={14}
                        className="flex-shrink-0 mt-1 transition-transform group-hover:translate-x-1 duration-200"
                        style={{ color: "var(--sage-dark)" }}
                    />
                </div>
            </Link>
        </div>
    );
}