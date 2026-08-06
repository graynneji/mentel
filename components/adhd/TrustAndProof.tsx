// components/adhd/TrustAndProof.tsx
//
// ============================================================================
// READ BEFORE EDITING
// ============================================================================
// The design brief for this page asked for specific numbers ("72,000+
// people", "4.9/5", "97% said the report helped") and named testimonials
// ("Emma, 31", "Michael, 42"). Those weren't included as written because
// they're fabricated, specific factual claims about real users. If shipped
// as-is to real visitors, that's false advertising (the FTC has taken
// action against exactly this pattern of fake ratings/testimonials), and
// separately it undercuts the clinical credibility this whole redesign is
// trying to build for a mental wellness company.
//
// What's below is built to slot real numbers/testimonials in the moment
// you have them (from actual completions, actual review collection, actual
// press coverage). Until then, each component below degrades gracefully to
// an honest, non-specific version rather than showing nothing or lying.
// ============================================================================

import { ReactNode } from "react";
import { Shield, ShieldCheck, Lock, Users } from "lucide-react";

// ── Social proof bar ────────────────────────────────────────────────────
// Swap `stats` below with real numbers once you're tracking them (e.g. real
// completions from the AdhdAssessmentLead table). Until then this renders
// a values statement instead of a number, which is honest either way.

export interface SocialProofStats {
    completions?: number; // real count only, e.g. from your DB
    ratingOutOf5?: number; // real average only, e.g. from actual review collection
    helpfulPercent?: number; // real survey result only
}

export function SocialProofBar({ stats }: { stats?: SocialProofStats }) {
    const hasRealStats = stats && (stats.completions || stats.ratingOutOf5 || stats.helpfulPercent);

    if (!hasRealStats) {
        return (
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-5">
                <TrustPill icon={<ShieldCheck size={14} />} text="Evidence-informed screening" />
                <TrustPill icon={<Lock size={14} />} text="Private and encrypted" />
                <TrustPill icon={<Users size={14} />} text="Built with licensed clinicians" />
            </div>
        );
    }

    return (
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 py-5">
            {stats!.completions && (
                <Stat value={`${stats!.completions.toLocaleString()}+`} label="assessments completed" />
            )}
            {stats!.ratingOutOf5 && (
                <Stat value={`${stats!.ratingOutOf5.toFixed(1)}/5`} label="average rating" />
            )}
            {stats!.helpfulPercent && (
                <Stat value={`${stats!.helpfulPercent}%`} label="said the report helped them" />
            )}
        </div>
    );
}

function Stat({ value, label }: { value: string; label: string }) {
    return (
        <div className="text-center">
            <p className="font-['Cormorant_Garamond',Georgia,serif] text-[26px] font-medium text-[#0E5C3D] leading-none mb-1">{value}</p>
            <p className="text-[11px] text-[#6a7a6e] font-light">{label}</p>
        </div>
    );
}

function TrustPill({ icon, text }: { icon: ReactNode; text: ReactNode }) {
    return (
        <div className="flex items-center gap-2 text-[#4a6a56]">
            {icon}
            <span className="text-[12.5px] font-medium">{text}</span>
        </div>
    );
}

// ── "As seen on" press logos ────────────────────────────────────────────
// Renders nothing unless you pass real outlets you've actually been
// covered by. Don't populate this with placeholder logos, an empty section
// is invisible; a fake press mention is a false endorsement claim.

export function AsSeenOn({ outlets }: { outlets?: string[] }) {
    if (!outlets || outlets.length === 0) return null;
    return (
        <div className="text-center py-6">
            <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#6a7a6e] mb-4">As seen on</p>
            <div className="flex items-center justify-center gap-10 flex-wrap">
                {outlets.map((o) => (
                    <span key={o} className="text-[15px] font-semibold text-[#5a6b5e]">{o}</span>
                ))}
            </div>
        </div>
    );
}

// ── Testimonials ─────────────────────────────────────────────────────────
// Renders nothing until real testimonials exist (collect these post-launch
// via a follow-up email asking completers for permission to quote them).
// Shape matches what you'd store: quote, first name, and an optional
// detail like age or context, only ever from a real person who consented.

export interface Testimonial {
    quote: string;
    name: string;
    detail?: string;
    /** Optional. Square image, ≥200x200px. See social-proof-config.ts for
     * where to store it. Falls back to an initials avatar when omitted. */
    photoUrl?: string;
}

function InitialsAvatar({ name }: { name: string }) {
    const initial = name.trim().charAt(0).toUpperCase();
    return (
        <div
            className="w-11 h-11 rounded-full bg-[#e7f0eb] text-[#0E5C3D] flex items-center justify-center text-[15px] font-semibold flex-shrink-0"
            aria-hidden="true"
        >
            {initial}
        </div>
    );
}

export function Testimonials({ items }: { items?: Testimonial[] }) {
    if (!items || items.length === 0) return null;
    return (
        <div className="grid sm:grid-cols-3 gap-4 py-6">
            {items.map((t) => (
                <figure key={t.name} className="bg-white rounded-2xl border border-[#e4e9e5] p-6">
                    <blockquote className="text-[14px] text-[#3a4a3e] font-normal leading-[1.65] mb-5">
                        &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <figcaption className="flex items-center gap-3">
                        {t.photoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={t.photoUrl}
                                alt=""
                                width={44}
                                height={44}
                                className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                            />
                        ) : (
                            <InitialsAvatar name={t.name} />
                        )}
                        <span className="text-[13px] text-[#4a5a52] font-medium">
                            {t.name}{t.detail ? `, ${t.detail}` : ""}
                        </span>
                    </figcaption>
                </figure>
            ))}
        </div>
    );
}

// ── Trust section ────────────────────────────────────────────────────────
// These are process claims, not statistics, so they're fine to ship as
// static copy PROVIDED they're true. Specifically: only enable
// "Reviewed by mental health professionals" once the question bank and
// interpretation copy in lib/adhd/interpretations.ts has actually been
// reviewed by your Clinical Director.

export function TrustSection({ clinicallyReviewed = false }: { clinicallyReviewed?: boolean }) {
    const items = [
        { icon: <ShieldCheck size={16} />, text: "Built from established ADHD screening principles" },
        { icon: <Shield size={16} />, text: "Educational only, never a diagnosis" },
        { icon: <Lock size={16} />, text: "Private and encrypted" },
        ...(clinicallyReviewed ? [{ icon: <Users size={16} />, text: "Reviewed by Mentel's clinical team" }] : []),
        { icon: <ShieldCheck size={16} />, text: "We never sell your data" },
    ];
    return (
        <div className="grid sm:grid-cols-2 gap-3 py-6">
            {items.map((item) => (
                <div key={item.text} className="flex items-center gap-3 bg-white rounded-xl border border-[#e4e9e5] px-4 py-3.5">
                    <span className="text-[#2d7a5a] flex-shrink-0">{item.icon}</span>
                    <span className="text-[13px] text-[#3a4a3e] font-[450]">{item.text}</span>
                </div>
            ))}
        </div>
    );
}
