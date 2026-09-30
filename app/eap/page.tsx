import EAPLandingPage from "@/components/EAPLandingPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Employee Assistance Programme (EAP)",
    description:
        "Mentel EAP gives organisations confidential access to licensed therapists, employee wellbeing assessments, workplace mental health support, and anonymised workforce insights.",
    keywords: [
        "employee assistance programme",
        "employee assistance program",
        "EAP",
        "EAP provider",
        "employee wellbeing",
        "employee wellness programme",
        "employee mental health",
        "workplace mental health",
        "workplace wellbeing",
        "mental health support for employees",
        "employee counselling",
        "employee counseling",
        "workplace counselling",
        "workplace counseling",
        "corporate mental health support",
        "corporate wellness programme",
        "employee therapy",
        "therapy for employees",
        "mental health EAP",
        "EAP Nigeria",
        "employee assistance programme Nigeria",
        "workplace mental health Nigeria",
    ],
    alternates: {
        canonical: "https://www.trymentel.com/eap",
    },
    openGraph: {
        title: "Employee Assistance Programme (EAP)",
        description:
            "Confidential therapy, wellbeing assessments, and workplace mental health support for organisations and their employees.",
        url: "https://www.trymentel.com/eap",
        siteName: "Mentel",
        locale: "en_NG",
        type: "website",
    },
};
export default function EAPPage() {
    const eapUrl = "https://www.trymentel.com/eap";

    const eapJsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `${eapUrl}#webpage`,
                url: eapUrl,
                name: "Employee Assistance Programme (EAP)",
                description:
                    "Mentel EAP gives organisations confidential access to licensed therapists, employee wellbeing assessments, workplace mental health support, and anonymised workforce insights.",
                isPartOf: {
                    "@type": "WebSite",
                    "@id": "https://www.trymentel.com/#website",
                    name: "Mentel",
                    url: "https://www.trymentel.com",
                },
                about: {
                    "@id": `${eapUrl}#service`,
                },
            },
            {
                "@type": "Service",
                "@id": `${eapUrl}#service`,
                name: "Employee Assistance Programme",
                serviceType: "Employee Assistance Programme",
                url: eapUrl,
                description:
                    "Confidential therapy, wellbeing assessments, and workplace mental health support for organisations and their employees.",
                provider: {
                    "@type": "Organization",
                    "@id": "https://www.trymentel.com/#organization",
                    name: "Mentel",
                    url: "https://www.trymentel.com",
                },
                areaServed: [
                    {
                        "@type": "Country",
                        name: "Nigeria",
                    },
                ],
            },
        ],
    };
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(eapJsonLd),
                }}
            />
            <EAPLandingPage />
        </>
    )
}