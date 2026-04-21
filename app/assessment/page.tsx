import { Metadata } from "next";
import AssessmentPage from "@/components/AssessmentPage";
import Script from "next/script";

export const metadata: Metadata = {
    title: "Free Mental Health Assessment Test (2-Minute Check) - Mentel",
    description:
        "Take a free 2-minute mental health assessment in Nigeria. Check anxiety, stress, and emotional well-being instantly. No sign-up required. 100% confidential.",
    alternates: {
        canonical: "/assessment",
    },
    openGraph: {
        title: "Free Mental Health Test (2 Minutes) - Mentel",
        description:
            "Answer 8 questions and understand your mental state instantly. Private, fast, and free.",
        url: "https://trymentel.com/assessment",
        images: [
            {
                url: "/assessment-og.png",
                width: 1200,
                height: 630,
                alt: "Free Mental Health Assessment",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Free Mental Health Test (2 Minutes)",
        description:
            "Check your mental health in under 2 minutes. Free and confidential.",
        images: ["/assessment-og.png"],
    },
};

export default function Assessment() {
    return (
        <>
            <Script
                id="assessment-schema"
                type="application/ld+json"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        url: "https://trymentel.com/assessment",
                        name: "Free Mental Health Assessment Test (2-Minute Check) | Mentel Nigeria",
                        description:
                            "A quick mental health assessment to evaluate anxiety, stress, and emotional well-being.",
                        audience: {
                            "@type": "Audience",
                            geographicArea: {
                                "@type": "Country",
                                name: "Nigeria",
                            },
                        },
                    }),
                }}
            />
            <AssessmentPage />
        </>
    );
}