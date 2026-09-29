// import { Metadata } from "next";
// import AssessmentPage from "@/components/AssessmentPage";
// import Script from "next/script";

// export const metadata: Metadata = {
//     title: "Free Mental Health Assessment Test (1-Minute Check) - Mentel",
//     description:
//         "Take a free 1-minute mental health assessment in Nigeria. Check anxiety, stress, and emotional well-being instantly. No sign-up required. 100% confidential.",
//     alternates: {
//         canonical: "/assessment",
//     },
//     openGraph: {
//         title: "Free Mental Health Test (1 Minute) - Mentel",
//         description:
//             "Answer 8 questions and understand your mental state instantly. Private, fast, and free.",
//         url: "https://www.trymentel.com/assessment",
//         images: [
//             {
//                 url: "/assessment-og.png",
//                 width: 1200,
//                 height: 630,
//                 alt: "Free Mental Health Assessment",
//             },
//         ],
//     },
//     twitter: {
//         card: "summary_large_image",
//         title: "Free Mental Health Test (1 Minute)",
//         description:
//             "Check your mental health in under 1 minute. Free and confidential.",
//         images: ["/assessment-og.jpg"],
//         // images: ["/assessment-og.png"],
//     },
// };

// export default function Assessment() {
//     return (
//         <>
//             {/* <Script
//                 id="assessment-schema"
//                 type="application/ld+json"
//                 strategy="beforeInteractive"
//                 dangerouslySetInnerHTML={{
//                     __html: JSON.stringify({
//                         "@context": "https://schema.org",
//                         "@type": "WebPage",
//                         url: "https://www.trymentel.com/assessment",
//                         name: "Free Mental Health Assessment Test (1-Minute Check) | Mentel Nigeria",
//                         description:
//                             "A quick mental health assessment to evaluate anxiety, stress, and emotional well-being.",
//                         audience: {
//                             "@type": "Audience",
//                             geographicArea: {
//                                 "@type": "Country",
//                                 name: "Nigeria",
//                             },
//                         },
//                     }),
//                 }}
//             /> */}
//             <Script
//                 id="assessment-schema"
//                 type="application/ld+json"
//                 strategy="beforeInteractive"
//                 dangerouslySetInnerHTML={{
//                     __html: JSON.stringify({
//                         "@context": "https://schema.org",
//                         "@type": "WebPage",
//                         url: "https://www.trymentel.com/assessment",
//                         name: "Free Mental Health Assessment Test (1-Minute Check) | Mentel",
//                         description:
//                             "A quick mental health assessment to evaluate mood, anxiety, stress, sleep, relationships, energy, and self-worth.",
//                     }),
//                 }}
//             />
//             <AssessmentPage />
//         </>
//     );
// }
///////////////////////////////////////////
///////////////////////////////////////////
////////////////////////////////////////////
//////////////////////////////////////////////////
/////////////////////////////////////////////////
////////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////////////
//////////////////////////////////////////////////////

// import { Metadata } from "next";
// import AssessmentPage from "@/components/AssessmentPage";
// import Script from "next/script";

// export const metadata: Metadata = {
//     title: "Free Mental Health Assessment | 1-Minute Mental Health Test | Mentel",

//     description:
//         "Take a free 1-minute mental health assessment online. Check your mood, anxiety, stress, sleep, and emotional well-being. No sign-up required. Confidential and easy to complete.",

//     keywords: [
//         "mental health assessment",
//         "free mental health assessment",
//         "mental health test",
//         "free mental health test",
//         "online mental health assessment",
//         "1-minute mental health assessment",
//         "mental health check",
//         "mental wellness assessment",
//         "mental health screening",
//         "anxiety assessment",
//         "stress assessment",
//         "emotional well-being assessment",
//         "mood assessment",
//         "wellness assessment"
//     ],

//     alternates: {
//         canonical: "https://www.trymentel.com/assessment",
//     },

//     openGraph: {
//         title: "Free Mental Health Assessment | 1-Minute Test | Mentel",
//         description:
//             "Take a free online mental health assessment in about 1 minute. Check your mood, anxiety, stress, sleep, and emotional well-being. Free and confidential.",
//         url: "https://www.trymentel.com/assessment",
//         type: "website",
//         images: [
//             {
//                 url: "https://www.trymentel.com/assessment-og.png",
//                 width: 1200,
//                 height: 630,
//                 alt: "Free Mental Health Assessment - Mentel",
//             },
//         ],
//     },

//     twitter: {
//         card: "summary_large_image",
//         title: "Free Mental Health Assessment | 1-Minute Test",
//         description:
//             "Take a free online mental health assessment in about 1 minute. Check your mood, anxiety, stress, and emotional well-being.",
//         images: ["https://www.trymentel.com/assessment-og.png"],
//     },
// };

// export default function Assessment() {
//     return (
//         <>
//             <Script
//                 id="assessment-schema"
//                 type="application/ld+json"
//                 strategy="beforeInteractive"
//                 dangerouslySetInnerHTML={{
//                     __html: JSON.stringify({
//                         "@context": "https://schema.org",
//                         "@type": "WebPage",
//                         "@id": "https://www.trymentel.com/assessment#webpage",
//                         url: "https://www.trymentel.com/assessment",
//                         name: "Free Mental Health Assessment | 1-Minute Mental Health Test | Mentel",
//                         description:
//                             "A free online mental health assessment that helps you check your mood, anxiety, stress, sleep, relationships, energy, and emotional well-being.",
//                         isPartOf: {
//                             "@type": "WebSite",
//                             name: "Mentel",
//                             url: "https://www.trymentel.com",
//                         },
//                         about: {
//                             "@type": "Thing",
//                             name: "Mental health assessment",
//                         },
//                     }),
//                 }}
//             />

//             <AssessmentPage />
//         </>
//     );
// }

import { Metadata } from "next";
import AssessmentPage from "@/components/AssessmentPage";
import Script from "next/script";

const SITE_URL = "https://www.trymentel.com";
const ASSESSMENT_URL = `${SITE_URL}/assessment`;

export const metadata: Metadata = {
    title: "Free Mental Health Assessment | 1-Minute Mental Health Test | Mentel",

    description:
        "Take a free 1-minute mental health assessment online. Check your mood, anxiety, stress, sleep, and emotional well-being. No sign-up required. Confidential and easy to complete.",

    keywords: [
        "mental health assessment",
        "free mental health assessment",
        "mental health test",
        "free mental health test",
        "online mental health assessment",
        "1-minute mental health assessment",
        "mental health check",
        "mental wellness assessment",
        "mental health screening",
        "anxiety assessment",
        "stress assessment",
        "emotional well-being assessment",
        "mood assessment",
        "wellness assessment",
    ],

    alternates: {
        canonical: ASSESSMENT_URL,
    },

    openGraph: {
        title: "Free Mental Health Assessment | 1-Minute Test | Mentel",
        description:
            "Take a free online mental health assessment in about 1 minute. Check your mood, anxiety, stress, sleep, and emotional well-being. Free and confidential.",
        url: ASSESSMENT_URL,
        type: "website",
        images: [
            {
                url: `${SITE_URL}/assessment-og.png`,
                width: 1200,
                height: 630,
                alt: "Free Mental Health Assessment - Mentel",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "Free Mental Health Assessment | 1-Minute Test",
        description:
            "Take a free online mental health assessment in about 1 minute. Check your mood, anxiety, stress, and emotional well-being.",
        images: [`${SITE_URL}/assessment-og.png`],
    },
};

export default function Assessment() {
    const assessmentJsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${ASSESSMENT_URL}#webpage`,
        url: ASSESSMENT_URL,
        name: "Free Mental Health Assessment | 1-Minute Mental Health Test | Mentel",
        description:
            "A free online mental health assessment that helps you check your mood, anxiety, stress, sleep, relationships, energy, and emotional well-being.",

        isPartOf: {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            name: "Mentel",
            url: SITE_URL,
        },

        about: {
            "@type": "Thing",
            name: "Mental health assessment",
        },
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: SITE_URL,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Mental Health Assessment",
                item: ASSESSMENT_URL,
            },
        ],
    };

    return (
        <>
            <Script
                id="assessment-schema"
                type="application/ld+json"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(assessmentJsonLd),
                }}
            />

            <Script
                id="assessment-breadcrumb-schema"
                type="application/ld+json"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbJsonLd),
                }}
            />

            <AssessmentPage />
        </>
    );
}