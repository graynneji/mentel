import EAPLandingPage from "@/components/EAPLandingPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Employee Assistance Programme (EAP) | Mentel",
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
        title: "Employee Assistance Programme (EAP) | Mentel",
        description:
            "Confidential therapy, wellbeing assessments, and workplace mental health support for organisations and their employees.",
        url: "https://www.trymentel.com/eap",
        siteName: "Mentel",
        locale: "en_NG",
        type: "website",
    },
};
export default function EAPPage() {
    return (
        <EAPLandingPage />
    )
}