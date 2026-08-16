
// import About from "@/components/AboutPage";
// import { Metadata } from "next";

// export const metadata: Metadata = {
//     title: "About Us",
//     description:
//         "Learn about Mentel's mission to make quality mental health care accessible. Meet the team of licensed therapists dedicated to your wellbeing.",
//     alternates: {
//         canonical: "/about",
//     },
//     openGraph: {
//         title: "About Us - Mentel",
//         description:
//             "Mentel was built on one belief — everyone deserves access to quality mental health care. Meet the team behind the mission.",
//         url: "https://www.trymentel.com/about",
//         images: [
//             {
//                 url: "/og-image.png",
//                 width: 1200,
//                 height: 630,
//                 alt: "About Mentel — Mental Health & Therapy Services",
//             },
//         ],
//     },
//     twitter: {
//         card: "summary_large_image",
//         title: "About Us | Mentel",
//         description:
//             "Mentel was built on one belief — everyone deserves access to quality mental health care. Meet the team behind the mission.",
//         images: ["/og-image.png"],
//     },
// };

// export default function AboutPage() {
//     return (
//         <About />
//     )
// }

import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Award, Users, Leaf, ShieldCheck, Globe2, ArrowRight } from "lucide-react";

const SITE_URL = "https://trymentel.com";

export const metadata: Metadata = {
    title: "About Mentel and Our Mission to Make Mental Health Care More Accessible, Convenient, and Affordable",
    description:
        "Mentel LTD is a Nigerian mental wellness company connecting people with licensed therapists for confidential, evidence-based online therapy. Learn our story, mission and approach.",
    keywords: [
        "about Mentel",
        "mental health company Nigeria",
        "online therapy Nigeria",
        "licensed therapists Lagos",
    ],
    alternates: { canonical: `${SITE_URL}/about` },
    openGraph: {
        title: "About Mentel and Our Mission to Make Mental Health Care More Accessible, Convenient, and Affordable",
        description:
            "Mentel LTD is a Nigerian mental wellness company connecting people with licensed therapists for confidential, evidence-based online therapy.",
        url: `${SITE_URL}/about`,
        siteName: "Mentel",
        type: "website",
    },
};

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

const differentiators = [
    {
        icon: ShieldCheck,
        title: "Licensed, Vetted Therapists",
        desc: "Every therapist on Mentel is licensed and screened before joining our network, so you can trust the person on the other end of the call.",
    },
    {
        icon: Globe2,
        title: "Built for the Nigerian Context",
        desc: "Our therapists understand the cultural, family, and workplace pressures unique to living and working in Nigeria, not a generic global template.",
    },
    {
        icon: Leaf,
        title: "Non-Diagnostic Screening First",
        desc: "Our free assessment helps you understand what you are experiencing and points you to the right kind of support, before you ever commit to a session.",
    },
];

const faqs = [
    {
        q: "Is Mentel a registered company?",
        a: "Yes. Mentel LTD is a registered Nigerian company (also registered as Mentel Limited, RC 9116334) operating trymentel.com.",
    },
    {
        q: "Are Mentel's therapists licensed?",
        a: "Yes. Every therapist in the Mentel network is a licensed mental health professional, vetted before being added to our platform.",
    },
    {
        q: "Does Mentel offer in-person therapy or only online?",
        a: "Mentel currently offers online therapy, so you can access licensed support from anywhere in Nigeria without needing to travel to a clinic.",
    },
    {
        q: "Is my information kept confidential?",
        a: "Yes. Everything you share with your therapist and through our assessment tools is kept confidential and is never shared without your consent.",
    },
];

const team = [
    { name: "Dr. Amara Osei", role: "Clinical Psychologist, 12 yrs", initials: "AO" },
    { name: "Chidi Nwosu", role: "Marriage & Family Therapist", initials: "CN" },
    { name: "Fatima Bello", role: "Trauma-Informed Counsellor", initials: "FB" },
];

const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: `${SITE_URL}/about`,
    mainEntity: {
        "@type": "MedicalBusiness",
        name: "Mentel LTD",
        alternateName: "Mentel Limited",
        url: SITE_URL,
        areaServed: "Nigeria",
        description:
            "Mentel LTD is a Nigerian mental wellness technology company offering non-diagnostic screening, assessment and referral to licensed therapists.",
    },
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
};

export default function AboutPage() {
    return (
        <div className="relative">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
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
                        <span className="block text-sm uppercase tracking-widest font-sans mb-4 font-medium" style={{ color: "var(--sage-dark)" }}>
                            About Mentel
                        </span>
                        Rooted in care,<br />
                        <em className="italic" style={{ color: "var(--sage-dark)" }}>guided by science</em>.
                    </h1>

                    <p className="text-base leading-relaxed font-light" style={{ color: "var(--text-muted)" }}>
                        Mentel LTD is a Nigerian mental wellness technology company built on a simple belief:
                        that every Nigerian deserves access to high-quality, compassionate, and affordable
                        mental health support. We connect you with licensed therapists through confidential,
                        online sessions, and help you understand what you are experiencing along the way,
                        so you never have to navigate it alone.
                    </p>
                </div>

                {/* Divider */}
                <div className="w-16 h-0.5 rounded-full mb-16" style={{ background: "linear-gradient(90deg, var(--sage), var(--teal))" }} />

                {/* Our Story */}
                <section className="mb-20">
                    <h2 className="font-cormorant text-3xl font-light mb-6" style={{ color: "var(--deep)" }}>Why we started Mentel</h2>
                    <div className="flex flex-col gap-4 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                        <p>
                            Mental health support in Nigeria has long been out of reach for most people, either
                            too expensive, too far from where they live, or wrapped in stigma that makes asking
                            for help feel impossible. Mentel was founded to close that gap, using technology to
                            connect Nigerians with licensed therapists in a way that is private, convenient, and
                            genuinely affordable.
                        </p>
                        <p>
                            We built Mentel around three principles: care should be evidence-based, not guesswork;
                            access should not depend on where you live in Nigeria; and getting started should
                            never feel intimidating. That is why our platform begins with free, non-diagnostic
                            screening tools, so you can understand what you are dealing with before you ever
                            commit to a session, and why every therapist in our network is licensed and vetted
                            before they see a single client.
                        </p>
                        <p>
                            Today, Mentel supports individuals, couples, and workplaces across Nigeria navigating
                            anxiety, depression, burnout, relationship strain, trauma, and everyday stress, with
                            the same standard of care you would expect anywhere in the world, delivered in a way
                            that understands the Nigerian context.
                        </p>
                    </div>
                </section>

                {/* Who we help */}
                <section className="mb-20">
                    <h2 className="font-cormorant text-3xl font-light mb-6" style={{ color: "var(--deep)" }}>Who we help</h2>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                        We work with individuals across Nigeria, from young professionals managing work
                        pressure in Lagos to students navigating academic stress, couples working to rebuild
                        their relationship, and people processing grief, trauma, or major life transitions.
                        We also partner with employers and universities to bring mental wellness support
                        directly to their teams and students through our workplace and campus programmes.
                    </p>
                </section>

                {/* What sets us apart */}
                <div className="mb-20">
                    <h2 className="font-cormorant text-3xl font-light mb-8" style={{ color: "var(--deep)" }}>What sets Mentel apart</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {differentiators.map(({ icon: Icon, title, desc }) => (
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
                {/* <div className="mb-20">
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
                </div> */}

                {/* FAQ */}
                <div className="mb-20">
                    <h2 className="font-cormorant text-3xl font-light mb-8" style={{ color: "var(--deep)" }}>Frequently Asked Questions</h2>
                    <div className="flex flex-col gap-4">
                        {faqs.map((f) => (
                            <div
                                key={f.q}
                                className="p-5 rounded-2xl border"
                                style={{ background: "white", borderColor: "var(--border)" }}
                            >
                                <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--deep)" }}>{f.q}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{f.a}</p>
                            </div>
                        ))}
                    </div>
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
                        Ready to talk to someone?
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