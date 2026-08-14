import type { Metadata } from "next";
import AdhdAssessmentClient from "@/components/AdhdAssessmentClient";

const BASE_URL = "https://www.trymentel.com"; // Replace with your production domain
const PAGE_PATH = "/adhd-assessment"; // Path for the ADHD assessment page
const CANONICAL_URL = `${BASE_URL}${PAGE_PATH}`;
const OG_IMAGE = `${BASE_URL}/assessmentadhd.jpg`; // Replace with your actual Open Graph image URL

// High-volume, intent-focused Title & Description for CTR
const TITLE = "Free Adult ADHD Test Online | 3-Minute Symptom Assessment";
const DESCRIPTION =
    "Take a free, confidential Adult ADHD self-assessment based on WHO ASRS v1.1 criteria. Screen for executive dysfunction, focus, and memory patterns in 3 minutes.";

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: CANONICAL_URL },
    keywords: [
        "ADHD test",
        "adult ADHD test online",
        "free ADHD quiz",
        "ADHD self assessment",
        "ASRS v1.1 screener",
        "ADHD symptom checker adults",
        "do I have ADHD test",
        "executive dysfunction test",
    ],
    openGraph: {
        title: TITLE,
        description: DESCRIPTION,
        url: CANONICAL_URL,
        siteName: "Mentel",
        type: "website",
        locale: "en_US",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Mentel Free Adult ADHD Symptom Self-Assessment",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: TITLE,
        description: DESCRIPTION,
        images: [OG_IMAGE],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

// Rich Structured Data (Schema Graph) for YMYL & Medical Search
const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "MedicalWebPage",
            "@id": `${CANONICAL_URL}#webpage`,
            "url": CANONICAL_URL,
            "name": TITLE,
            "description": DESCRIPTION,
            "isPartOf": {
                "@type": "WebSite",
                "@id": `${BASE_URL}/#website`,
                "name": "Mentel",
                "url": BASE_URL,
            },
            "medicalAudience": {
                "@type": "MedicalAudience",
                "audienceType": "Patient",
            },
            "about": [
                {
                    "@type": "MedicalCondition",
                    "name": "Attention Deficit Hyperactivity Disorder",
                    "alternateName": ["ADHD", "ADD"],
                    "code": {
                        "@type": "MedicalCode",
                        "code": "F90",
                        "codingSystem": "ICD-10",
                    },
                },
            ],
            "aspect": ["Screening", "Diagnosis support"],
            "lastReviewed": "2026-08-01",
            "mainEntity": {
                "@type": "Quiz",
                "@id": `${CANONICAL_URL}#quiz`,
                "name": "Adult ADHD Self-Assessment Screening",
                "description": "A 20-question self-report tool measuring adult ADHD symptoms across attention, executive function, and impulsivity domains.",
                "educationalUse": "Assessment",
                "typicalAgeRange": "18-65+",
                "about": {
                    "@type": "MedicalCondition",
                    "name": "Attention Deficit Hyperactivity Disorder",
                },
            },
        },
        {
            "@type": "FAQPage",
            "@id": `${CANONICAL_URL}#faq`,
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "Is this online ADHD assessment accurate?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "This assessment uses symptom criteria aligned with validated screeners like the WHO Adult ADHD Self-Report Scale (ASRS v1.1). While accurate as a preliminary screening tool, it does not constitute a formal medical diagnosis.",
                    },
                },
                {
                    "@type": "Question",
                    "name": "How long does the ADHD screening take?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "The 20-question self-assessment takes approximately 3 to 4 minutes to complete.",
                    },
                },
                {
                    "@type": "Question",
                    "name": "Is this ADHD test free and private?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes, the screening is 100% free and your responses are evaluated confidentially.",
                    },
                },
            ],
        },
    ],
};

export default function Page() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <main id="main-content">
                <AdhdAssessmentClient />
            </main>
        </>
    );
}