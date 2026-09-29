// import { Metadata } from "next";
// import BookingPage from "@/components/BookingPage";



// export const metadata: Metadata = {
//     title: "Book a Therapy Session - Mentel",
//     description:
//         "Book a 50-minute session with a licensed therapist. Matched to your needs within 24 hours. Confidential, evidence-based care. No commitment required.",
//     keywords: [
//         "book online therapy",
//         "book a therapist online",
//         "online therapy booking",
//         "book therapy session",
//         "book an online therapist",
//         "schedule online therapy",
//         "schedule a therapy session",
//         "online therapist appointment",
//         "therapy appointment online",
//         "book counseling online",
//         "book counselling online",
//         "online counseling appointment",
//         "online counselling appointment",
//         "private online therapy",
//         "confidential online therapy",
//         "licensed therapist online",
//         "online therapy UK",
//         "online counselling UK",
//         "online therapy USA",
//         "online counseling USA",
//         "online therapy Nigeria",
//     ],
//     alternates: {
//         canonical: "/book",
//     },
//     openGraph: {
//         title: "Book a Therapy Session - Mentel",
//         description:
//             "Connect with a licensed therapist in Nigeria. Sessions from ₦8,500. Response within 24 hours.",
//         url: "https://www.trymentel.com/book",
//         images: [
//             {
//                 url: "/book-og.jpg",
//                 width: 1200,
//                 height: 630,
//                 alt: "Book a therapy session with Mentel",
//             },
//         ],
//     },
//     twitter: {
//         card: "summary_large_image",
//         title: "Book a Therapy Session - Mentel",
//         description:
//             "Licensed therapists in Nigeria. Sessions from ₦8,500. Confidential and evidence-based.",
//         images: ["/book-og.jpg"],
//     },
// };

// export default function Book() {
//     return (
//         <>
//             <script
//                 type="application/ld+json"
//                 dangerouslySetInnerHTML={{
//                     __html: JSON.stringify({
//                         "@context": "https://schema.org",
//                         "@type": "Service",
//                         name: "Online Therapy Session - Mentel",
//                         url: "https://www.trymentel.com/book",
//                         description:
//                             "Book a 50-minute online therapy session with a licensed Nigerian therapist. Matched to your needs within 24 hours.",
//                         provider: {
//                             "@type": "MedicalBusiness",
//                             name: "Mentel",
//                             url: "https://www.trymentel.com",
//                             address: {
//                                 "@type": "PostalAddress",
//                                 addressLocality: "Lagos",
//                                 addressCountry: "NG",
//                             },
//                         },
//                         areaServed: {
//                             "@type": "Country",
//                             name: "Nigeria",
//                         },
//                         offers: {
//                             "@type": "Offer",
//                             price: "8500",
//                             priceCurrency: "NGN",
//                             availability: "https://schema.org/InStock",
//                             description: "Single 50-minute therapy session",
//                         },
//                         audience: {
//                             "@type": "Audience",
//                             geographicArea: {
//                                 "@type": "Country",
//                                 name: "Nigeria",
//                             },
//                         },
//                     }),
//                 }}
//             />
//             <BookingPage />
//         </>
//     );
// }

import { Metadata } from "next";
import BookingPage from "@/components/BookingPage";
import { getAudience } from "@/lib/location/geolocation";



export const metadata: Metadata = {
    title: "Book Online Therapy with a Licensed Therapist | Mentel",
    description:
        "Book a 50-minute session with a licensed therapist. Matched to your needs within 24 hours. Confidential, evidence-based care. No commitment required.",
    keywords: [
        "book online therapy",
        "book a therapist online",
        "online therapy booking",
        "book therapy session",
        "book an online therapist",
        "schedule online therapy",
        "schedule a therapy session",
        "online therapist appointment",
        "therapy appointment online",
        "book counseling online",
        "book counselling online",
        "online counseling appointment",
        "online counselling appointment",
        "private online therapy",
        "confidential online therapy",
        "licensed therapist online",
        "online therapy UK",
        "online counselling UK",
        "online therapy USA",
        "online counseling USA",
        "online therapy Nigeria",
    ],
    alternates: {
        canonical: "/book",
    },
    openGraph: {
        title: "Book a Therapy Session - Mentel",
        description:
            "Connect with a licensed therapist, Response within 24 hours.",
        url: "https://www.trymentel.com/book",
        images: [
            {
                url: "/book-og.jpg",
                width: 1200,
                height: 630,
                alt: "Book a therapy session with Mentel",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Book a Therapy Session - Mentel",
        description:
            "Licensed therapists, Confidential and evidence-based.",
        images: ["/book-og.jpg"],
    },
};

export default async function Book() {
    // Server-side, from Vercel's IP geolocation header — used to route
    // Nigerian visitors to Paystack/NGN (unchanged) and everyone else to
    // Flutterwave/USD. Falls back to the Nigerian/Paystack experience
    // whenever the header isn't present (e.g. local dev), which is the
    // safe default since that's the existing, unchanged behaviour.
    const { country } = await getAudience();
    const bookUrl = "https://www.trymentel.com/book";

    const serviceJsonLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${bookUrl}#service`,
        name: "Online Therapy Session - Mentel",
        url: bookUrl,
        description:
            "Book a 50-minute online therapy session with a licensed therapist. Get matched to your needs within 24 hours with confidential, evidence-based online care.",
        provider: {
            "@type": "MedicalBusiness",
            "@id": "https://www.trymentel.com/#organization",
            name: "Mentel",
            url: "https://www.trymentel.com",
            address: {
                "@type": "PostalAddress",
                addressLocality: "Lagos",
                addressCountry: "NG",
            },
        },
        areaServed: [
            { "@type": "Country", name: "Nigeria" },
            { "@type": "Country", name: "United States" },
            { "@type": "Country", name: "United Kingdom" },
            { "@type": "Country", name: "Canada" },
            { "@type": "Country", name: "Australia" },
        ],
        offers: {
            "@type": "Offer",
            availability: "https://schema.org/InStock",
            description: "Single 50-minute therapy session",
        },
    };

    const webPageJsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${bookUrl}#webpage`,
        url: bookUrl,
        name: "Book a Therapy Session - Mentel",
        description:
            "Book a 50-minute session with a licensed therapist. Matched to your needs within 24 hours. Confidential, evidence-based care. No commitment required.",
        isPartOf: {
            "@type": "WebSite",
            "@id": "https://www.trymentel.com/#website",
            name: "Mentel",
            url: "https://www.trymentel.com",
        },
        about: {
            "@type": "Thing",
            name: "Online therapy",
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
                item: "https://www.trymentel.com",
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Book a Therapy Session",
                item: bookUrl,
            },
        ],
    };

    return (
        <>
            {/* <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Service",
                        name: "Online Therapy Session - Mentel",
                        url: "https://www.trymentel.com/book",
                        description:
                            "Book a 50-minute online therapy session with a licensed therapist. Get matched to your needs within 24 hours with confidential, evidence-based online care.",
                        provider: {
                            "@type": "MedicalBusiness",
                            name: "Mentel",
                            url: "https://www.trymentel.com",
                            address: {
                                "@type": "PostalAddress",
                                addressLocality: "Lagos",
                                addressCountry: "NG",
                            },
                        },
                        // areaServed: {
                        //     "@type": "Country",
                        //     name: "Nigeria",
                        // },
                        areaServed: [
                            { "@type": "Country", name: "Nigeria" },
                            { "@type": "Country", name: "United States" },
                            { "@type": "Country", name: "United Kingdom" },
                            { "@type": "Country", name: "Australia" },
                        ],

                        offers: {
                            "@type": "Offer",
                            // price: "8500",
                            // priceCurrency: "NGN",
                            availability: "https://schema.org/InStock",
                            description: "Single 50-minute therapy session",
                        },
                        // audience: {
                        //     "@type": "Audience",
                        //     geographicArea: {
                        //         "@type": "Country",
                        //         name: "Nigeria",
                        //     },
                        // },
                    }),
                }}
            /> */}

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(serviceJsonLd),
                }}
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(webPageJsonLd),
                }}
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbJsonLd),
                }}
            />
            <BookingPage country={country} />
        </>
    );
}