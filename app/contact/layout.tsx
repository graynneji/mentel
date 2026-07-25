import type { Metadata } from "next";

const SITE_URL = "https://trymentel.com";

export const metadata: Metadata = {
    title: "Contact Mentel | Online Therapy in Nigeria",
    description:
        "Get in touch with Mentel for questions about online therapy in Nigeria. Reach us by email, WhatsApp, or our contact form. We respond within one business day.",
    keywords: [
        "contact Mentel",
        "Mentel therapy Nigeria contact",
        "mental health support Lagos",
    ],
    alternates: { canonical: `${SITE_URL}/contact` },
    openGraph: {
        title: "Contact Mentel | Online Therapy in Nigeria",
        description:
            "Get in touch with Mentel for questions about online therapy in Nigeria. We respond within one business day.",
        url: `${SITE_URL}/contact`,
        siteName: "Mentel",
        type: "website",
    },
};

const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: "Mentel LTD",
    alternateName: "Mentel Limited",
    url: SITE_URL,
    email: "hello@mail.trymentel.com",
    telephone: "+2347031362034",
    address: {
        "@type": "PostalAddress",
        addressLocality: "Lagos",
        addressCountry: "NG",
    },
    areaServed: "Nigeria",
    sameAs: [
        "https://www.facebook.com/profile.php?id=61589294892050",
        "https://instagram.com/mentel_ltd",
        "https://tiktok.com/@mentelltd",
    ],
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
            />
            {children}
        </>
    );
}