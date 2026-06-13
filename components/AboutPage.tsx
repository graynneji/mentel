import BgBlobs from "@/components/BgBlobs";
import { Heart, Award, Users, Leaf } from "lucide-react";

const values = [
    {
        icon: Heart,
        title: "Compassionate Care",
        desc: "Every session is held with deep empathy. We meet you exactly where you are.",
    },
    {
        icon: Award,
        title: "Evidence-Based Practice",
        desc: "Our therapists use clinically proven methods, CBT, EMDR, and more.",
    },
    {
        icon: Users,
        title: "Inclusive & Affirming",
        desc: "We serve all backgrounds, identities, and lived experiences without judgment.",
    },
];

const team = [
    { name: "Dr. Amara Osei", role: "Clinical Psychologist, 12 yrs", initials: "AO" },
    { name: "Chidi Nwosu", role: "Marriage & Family Therapist", initials: "CN" },
    { name: "Fatima Bello", role: "Trauma-Informed Counsellor", initials: "FB" },
];

export default function AboutPage() {
    return (
        <div className="relative">
            <BgBlobs />
            <div className="relative z-10 max-w-5xl mx-auto px-6 pt-28 pb-20">

                {/* Header */}
                <div className="max-w-xl mb-16">
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-6 border"
                        style={{ background: "rgba(123,169,139,0.10)", borderColor: "rgba(123,169,139,0.25)", color: "var(--sage-dark)" }}
                    >
                        <Leaf size={12} />
                        Our Story
                    </div>
                    <h1 className="font-cormorant text-5xl font-light mb-5 leading-tight" style={{ color: "var(--deep)" }}>
                        {/* The "Eyebrow" - visually small, but feeds Google the exact keywords */}
                        <span className="block text-sm uppercase tracking-widest font-sans mb-4 font-medium" style={{ color: "var(--sage-dark)" }}>
                            About Mentel
                        </span>

                        {/* Your poetic branding */}
                        Rooted in care,<br />
                        <em className="italic" style={{ color: "var(--sage-dark)" }}>guided by science</em>.
                    </h1>

                    <p className="text-base leading-relaxed font-light" style={{ color: "var(--text-muted)" }}>
                        Mentel was founded on a simple belief: that every person deserves access to
                        high-quality, compassionate mental health support. We built a team of licensed
                        professionals committed to meeting you where you are, and walking with you toward
                        lasting change.
                    </p>
                </div>

                {/* Divider */}
                <div className="w-16 h-0.5 rounded-full mb-16" style={{ background: "linear-gradient(90deg, var(--sage), var(--teal))" }} />

                {/* Values */}
                <div className="mb-20">
                    <h2 className="font-cormorant text-3xl font-light mb-8" style={{ color: "var(--deep)" }}>What guides us</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {values.map(({ icon: Icon, title, desc }) => (
                            <div
                                key={title}
                                className="p-6 rounded-2xl border"
                                style={{ background: "white", borderColor: "var(--border)" }}
                            >
                                <div
                                    className="w-9 h-9 rounded-full flex items-center justify-center mb-4"
                                    style={{ background: "rgba(123,169,139,0.12)" }}
                                >
                                    <Icon size={17} style={{ color: "var(--sage-dark)" }} />
                                </div>
                                <h3 className="font-cormorant text-xl font-semibold mb-2" style={{ color: "var(--deep)" }}>{title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team */}
                <div>
                    <h2 className="font-cormorant text-3xl font-light mb-8" style={{ color: "var(--deep)" }}>Our Therapists</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {team.map(({ name, role, initials }) => (
                            <div
                                key={name}
                                className="flex items-center gap-4 p-5 rounded-2xl border"
                                style={{ background: "white", borderColor: "var(--border)" }}
                            >
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-cormorant text-lg font-semibold"
                                    style={{ background: "linear-gradient(135deg, var(--sage-light), var(--teal-light))", color: "var(--deep)" }}
                                >
                                    {initials}
                                </div>
                                <div>
                                    <p className="text-sm font-medium" style={{ color: "var(--deep)" }}>{name}</p>
                                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
