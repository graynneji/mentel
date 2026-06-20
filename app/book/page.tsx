import { Metadata } from "next";
import BookingPage from "@/components/BookingPage";

export const metadata: Metadata = {
    title: "Book a Therapy Session - Mentel",
    description:
        "Book a 50-minute session with a licensed Nigerian therapist from ₦8,500. Matched to your needs within 24 hours. Confidential, evidence-based care. No commitment required.",
    alternates: {
        canonical: "/book",
    },
    openGraph: {
        title: "Book a Therapy Session - Mentel",
        description:
            "Connect with a licensed therapist in Nigeria. Sessions from ₦8,500. Response within 24 hours.",
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
            "Licensed therapists in Nigeria. Sessions from ₦8,500. Confidential and evidence-based.",
        images: ["/book-og.jpg"],
    },
};

export default function Book() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Service",
                        name: "Online Therapy Session - Mentel",
                        url: "https://www.trymentel.com/book",
                        description:
                            "Book a 50-minute online therapy session with a licensed Nigerian therapist. Matched to your needs within 24 hours.",
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
                        areaServed: {
                            "@type": "Country",
                            name: "Nigeria",
                        },
                        offers: {
                            "@type": "Offer",
                            price: "8500",
                            priceCurrency: "NGN",
                            availability: "https://schema.org/InStock",
                            description: "Single 50-minute therapy session",
                        },
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
            <BookingPage />
        </>
    );
}