import BgBlobs from "@/components/BgBlobs";
import Link from "next/link";
import { Brain, Heart, Users, Flame, Sun, Anchor, ArrowRight, Leaf, ClipboardCheck } from "lucide-react";

const services = [
    {
        icon: Brain,
        title: "Anxiety & Stress",
        desc: "Learn practical, evidence-based tools to manage racing thoughts, worry, and the physical toll of chronic stress.",
        tags: ["CBT", "Mindfulness", "Breathing Techniques"],
    },
    {
        icon: Heart,
        title: "Depression",
        desc: "Work through low mood, lack of motivation, and persistent sadness with a therapist who truly understands.",
        tags: ["Behavioural Activation", "Talk Therapy"],
    },
    {
        icon: Users,
        title: "Marriage & Couples",
        desc: "Strengthen communication, rebuild trust, and navigate conflict with skilled relationship therapy.",
        tags: ["Gottman Method", "EFT", "Conflict Resolution"],
    },
    {
        icon: Anchor,
        title: "Trauma & PTSD",
        desc: "Heal from past experiences in a safe, trauma-informed space using approaches proven to work.",
        tags: ["EMDR", "Somatic Therapy", "Narrative Therapy"],
    },
    {
        icon: Flame,
        title: "Burnout & Life Transitions",
        desc: "Reclaim your energy, identity, and direction when life feels overwhelming or in flux.",
        tags: ["Life Coaching", "Values Work", "Goal Setting"],
    },
    {
        icon: Sun,
        title: "Self-Esteem & Growth",
        desc: "Build a healthier relationship with yourself, challenge inner criticism, and grow into your full potential.",
        tags: ["Schema Therapy", "ACT", "Compassion Work"],
    },
    { icon: ClipboardCheck, title: "Free Assessment", desc: "Not sure where to start? Take our 2-minute mental health check.", tags: ["Free Mental Health Assessment", "Depression Assessment", "Check Anxiety"], }
];

export default function ServicesPage() {
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
                        What We Offer
                    </div>
                    <h1 className="font-cormorant text-5xl font-light mb-5 leading-tight" style={{ color: "var(--deep)" }}>
                        Therapy tailored<br />
                        <em className="italic" style={{ color: "var(--teal)" }}>to your life</em>.
                    </h1>
                    <p className="text-base leading-relaxed font-light" style={{ color: "var(--text-muted)" }}>
                        Every person&apos;s journey is different. Our licensed therapists bring the right
                        tools and compassion to meet your specific needs.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
                    {services.map(({ icon: Icon, title, desc, tags }) => (
                        <div
                            key={title}
                            className="p-6 rounded-2xl border group transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                            style={{ background: "white", borderColor: "var(--border)" }}
                        >
                            <div
                                className="w-9 h-9 rounded-full flex items-center justify-center mb-4"
                                style={{ background: "rgba(123,169,139,0.12)" }}
                            >
                                <Icon size={17} style={{ color: "var(--sage-dark)" }} />
                            </div>
                            <h3 className="font-cormorant text-xl font-semibold mb-2" style={{ color: "var(--deep)" }}>
                                {title}
                            </h3>
                            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>{desc}</p>
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-xs px-2.5 py-1 rounded-full"
                                        style={{ background: "var(--mist)", color: "var(--sage-dark)" }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div
                    className="rounded-3xl p-8 md:p-10 text-center border"
                    style={{ background: "white", borderColor: "var(--border)" }}
                >
                    <div
                        className="w-10 h-1 rounded-full mx-auto mb-5"
                        style={{ background: "linear-gradient(90deg, var(--sage), var(--teal))" }}
                    />
                    <h2 className="font-cormorant text-3xl font-light mb-3" style={{ color: "var(--deep)" }}>
                        Not sure where to start?
                    </h2>
                    <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: "var(--text-muted)" }}>
                        Book a consultation and we&apos;ll match you with the right therapist for your situation.
                    </p>
                    <Link
                        href="/#book"
                        className="inline-flex items-center gap-2 text-sm font-medium text-white px-6 py-3 rounded-full transition-all hover:-translate-y-0.5 hover:shadow-lg duration-200"
                        style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                    >
                        Book a Consultation
                        <ArrowRight size={15} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
