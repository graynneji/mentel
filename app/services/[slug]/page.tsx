import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Leaf, CheckCircle2, ArrowLeft } from "lucide-react";
import { services, getServiceBySlug } from "@/lib/services-data";

const SITE_URL = "https://trymentel.com";

export function generateStaticParams() {
    return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const service = getServiceBySlug(slug);
    if (!service) return {};

    const url = `${SITE_URL}/services/${service.slug}`;

    return {
        title: service.metaTitle,
        description: service.metaDescription,
        keywords: service.keywords,
        alternates: { canonical: url },
        openGraph: {
            title: service.metaTitle,
            description: service.metaDescription,
            url,
            siteName: "Mentel",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: service.metaTitle,
            description: service.metaDescription,
        },
    };
}

export default async function ServiceDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const service = getServiceBySlug(slug);
    if (!service) return notFound();

    const Icon = service.icon;
    const url = `${SITE_URL}/services/${service.slug}`;
    const related = services.filter((s) => s.slug !== service.slug).slice(0, 3);

    const serviceJsonLd = {
        "@context": "https://schema.org",
        "@type": "MedicalTherapy",
        name: service.title,
        description: service.metaDescription,
        url,
        provider: {
            "@type": "MedicalBusiness",
            name: "Mentel LTD",
            url: SITE_URL,
            areaServed: "Nigeria",
        },
    };

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: service.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
    };

    return (
        <div className="relative">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />

            <div className="relative z-10 max-w-5xl mx-auto px-6 pt-28 pb-20">
                {/* Breadcrumb */}
                <Link
                    href="/services"
                    className="inline-flex items-center gap-1.5 text-xs font-medium mb-8 transition-colors"
                    style={{ color: "var(--sage-dark)" }}
                >
                    <ArrowLeft size={13} />
                    All Services
                </Link>

                {/* Header */}
                <div className="mb-14">
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-6 border"
                        style={{ background: "rgba(123,169,139,0.10)", borderColor: "rgba(123,169,139,0.25)", color: "var(--sage-dark)" }}
                    >
                        <Icon size={12} />
                        {service.shortTitle}
                    </div>
                    <h1 className="font-cormorant text-5xl font-light mb-5 leading-tight" style={{ color: "var(--deep)" }}>
                        {service.title}
                    </h1>
                    <p className="text-base leading-relaxed font-light" style={{ color: "var(--text-muted)" }}>
                        {service.intro}
                    </p>
                </div>

                {/* Signs / Symptoms */}
                <section className="mb-14">
                    <h2 className="font-cormorant text-2xl font-semibold mb-6" style={{ color: "var(--deep)" }}>
                        Signs You May Benefit From {service.shortTitle} Support
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {service.symptoms.map((symptom) => (
                            <div
                                key={symptom}
                                className="flex items-start gap-3 p-4 rounded-xl border"
                                style={{ background: "white", borderColor: "var(--border)" }}
                            >
                                <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" style={{ color: "var(--sage-dark)" }} />
                                <span className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{symptom}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Approach */}
                <section className="mb-14">
                    <h2 className="font-cormorant text-2xl font-semibold mb-6" style={{ color: "var(--deep)" }}>
                        Our Approach
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        {service.approaches.map((a) => (
                            <div
                                key={a.name}
                                className="p-5 rounded-2xl border"
                                style={{ background: "white", borderColor: "var(--border)" }}
                            >
                                <h3 className="font-cormorant text-lg font-semibold mb-1.5" style={{ color: "var(--deep)" }}>
                                    {a.name}
                                </h3>
                                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{a.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* What to expect */}
                <section className="mb-14">
                    <h2 className="font-cormorant text-2xl font-semibold mb-4" style={{ color: "var(--deep)" }}>
                        What to Expect
                    </h2>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                        {service.whatToExpect}
                    </p>
                </section>

                {/* FAQ */}
                <section className="mb-16">
                    <h2 className="font-cormorant text-2xl font-semibold mb-6" style={{ color: "var(--deep)" }}>
                        Frequently Asked Questions
                    </h2>
                    <div className="flex flex-col gap-4">
                        {service.faqs.map((f) => (
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
                </section>

                {/* CTA */}
                <div
                    className="rounded-3xl p-8 md:p-10 text-center border mb-16"
                    style={{ background: "white", borderColor: "var(--border)" }}
                >
                    <div
                        className="w-10 h-1 rounded-full mx-auto mb-5"
                        style={{ background: "linear-gradient(90deg, var(--sage), var(--teal))" }}
                    />
                    <h2 className="font-cormorant text-3xl font-light mb-3" style={{ color: "var(--deep)" }}>
                        Ready to start with {service.shortTitle.toLowerCase()}?
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

                {/* Related services */}
                <section>
                    <h2 className="font-cormorant text-2xl font-semibold mb-6" style={{ color: "var(--deep)" }}>
                        Related Services
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {related.map((r) => {
                            const RIcon = r.icon;
                            return (
                                <Link
                                    key={r.slug}
                                    href={`/services/${r.slug}`}
                                    className="p-5 rounded-2xl border group transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                                    style={{ background: "white", borderColor: "var(--border)" }}
                                >
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center mb-3"
                                        style={{ background: "rgba(123,169,139,0.12)" }}
                                    >
                                        <RIcon size={15} style={{ color: "var(--sage-dark)" }} />
                                    </div>
                                    <h3 className="font-cormorant text-lg font-semibold mb-1" style={{ color: "var(--deep)" }}>
                                        {r.shortTitle}
                                    </h3>
                                    <div
                                        className="inline-flex items-center gap-1 text-xs font-medium mt-1"
                                        style={{ color: "var(--sage-dark)" }}
                                    >
                                        <Leaf size={11} />
                                        Learn more
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
}