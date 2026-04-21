/**
 * WhatsAppCTA — a warm, prominent WhatsApp contact strip.
 *
 * Rationale: Nigerian users heavily prefer WhatsApp-first communication.
 * This strip sits between EAPSection and Testimonials in the page flow,
 * giving users a frictionless chat entry point without being pushy.
 *
 * For B2C users it routes to a pre-filled message asking about therapy.
 * For B2B users who missed the EAP section, it routes to an EAP enquiry.
 *
 * ⚠️  Replace the wa.me number with your actual WhatsApp Business number.
 *     Format: country code + number, no +, no spaces.
 *     Nigerian example: 2348012345678
 *
 * Usage (in page.tsx, after <EAPSection />):
 *   import WhatsAppCTA from "@/components/WhatsAppCTA";
 *   <WhatsAppCTA />
 */

import { MessageCircle, ArrowRight } from "lucide-react";

const WA_NUMBER = "2348000000000"; // ← replace with real number

const OPTIONS = [
    {
        label: "I need support for myself",
        href: `https://wa.me/${WA_NUMBER}?text=Hi%2C+I%27d+like+to+learn+more+about+individual+therapy+at+Mentel.`,
        sub: "Talk to our intake team",
    },
    {
        label: "I want mental health support for my team",
        href: `https://wa.me/${WA_NUMBER}?text=Hi%2C+I%27d+like+to+enquire+about+Mentel+EAP+for+my+organisation.`,
        sub: "Get EAP pricing & info",
    },
];

export default function WhatsAppCTA() {
    return (
        <section
            className="relative z-10 py-8 sm:py-10 px-4 sm:px-6 lg:px-8 border-t border-b"
            style={{ borderColor: "var(--border)", background: "rgba(37,211,102,0.03)" }}
            aria-label="Chat with us on WhatsApp"
        >
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">

                    {/* Label */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ background: "#25D366" }}
                        >
                            <MessageCircle size={20} color="white" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold" style={{ color: "var(--deep)" }}>
                                Prefer to chat first?
                            </p>
                            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                                We&apos;re on WhatsApp — usually respond within the hour.
                            </p>
                        </div>
                    </div>

                    {/* Two intent buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 flex-1 sm:justify-end">
                        {OPTIONS.map(({ label, href, sub }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border transition-all hover:-translate-y-0.5 hover:shadow-sm duration-200"
                                style={{
                                    borderColor: "rgba(37,211,102,0.3)",
                                    background: "rgba(37,211,102,0.06)",
                                }}
                            >
                                <div>
                                    <p className="text-xs font-medium" style={{ color: "var(--deep)" }}>{label}</p>
                                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{sub}</p>
                                </div>
                                <ArrowRight
                                    size={13}
                                    className="flex-shrink-0 transition-transform group-hover:translate-x-1 duration-200"
                                    style={{ color: "#25D366" }}
                                />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}