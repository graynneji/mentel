// import type { Metadata } from "next";

// const SITE_URL = "https://www.trymentel.com"; // matches metadataBase in app/layout.tsx — was non-www, conflicting with the sitemap and canonicalization sitewide

// export const metadata: Metadata = {
//     title: "Online Therapy in Nigeria | Contact Mentel",
//     description:
//         "Get in touch with Mentel for questions about online therapy in Nigeria. Reach us by email, WhatsApp, or our contact form. We respond within one business day.",
//     keywords: [
//         "contact Mentel",
//         "Mentel therapy Nigeria contact",
//         "mental health support Lagos",
//     ],
//     alternates: { canonical: `${SITE_URL}/contact` },
//     openGraph: {
//         title: "Online Therapy in Nigeria | Contact Mentel",
//         description:
//             "Get in touch with Mentel for questions about online therapy in Nigeria. We respond within one business day.",
//         url: `${SITE_URL}/contact`,
//         siteName: "Mentel",
//         type: "website",
//     },
// };

// const localBusinessJsonLd = {
//     "@context": "https://schema.org",
//     "@type": "MedicalBusiness",
//     name: "Mentel LTD",
//     alternateName: "Mentel Limited",
//     url: SITE_URL,
//     email: "hello@mail.trymentel.com",
//     telephone: "+2347031362034",
//     // address: {
//     //     "@type": "PostalAddress",
//     //     addressLocality: "Lagos",
//     //     addressCountry: "NG",
//     // },
//     areaServed: "Nigeria",
//     sameAs: [
//         "https://www.facebook.com/profile.php?id=61589294892050",
//         "https://instagram.com/mentel_ltd",
//         "https://tiktok.com/@mentelltd",
//     ],
// };

// const organizationJsonLd = {
//     "@context": "https://schema.org",
//     "@type": "Organization",
//     "@id": `${SITE_URL}/#organization`,
//     name: "Mentel LTD",
//     alternateName: "Mentel Limited",
//     url: SITE_URL,
//     email: "hello@mail.trymentel.com",
//     telephone: "+2347031362034",
//     areaServed: {
//         "@type": "Country",
//         name: "Nigeria",
//     },
//     sameAs: [
//         "https://www.facebook.com/profile.php?id=61589294892050",
//         "https://instagram.com/mentel_ltd",
//         "https://tiktok.com/@mentelltd",
//     ],
// };

// export default function ContactLayout({ children }: { children: React.ReactNode }) {
//     return (
//         <>
//             <script
//                 type="application/ld+json"
//                 dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
//             />
//             {children}
//         </>
//     );
// }

import React from "react";

const SITE_URL = "https://www.trymentel.com";

const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Mentel LTD",
    alternateName: "Mentel Limited",
    url: SITE_URL,
    email: "hello@mail.trymentel.com",
    telephone: "+2347031362034",
    areaServed: {
        "@type": "Country",
        name: "Nigeria",
    },
    sameAs: [
        "https://www.facebook.com/profile.php?id=61589294892050",
        "https://instagram.com/mentel_ltd",
        "https://tiktok.com/@mentelltd",
    ],
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(organizationJsonLd),
                }}
            />
            {children}
        </>
    );
}