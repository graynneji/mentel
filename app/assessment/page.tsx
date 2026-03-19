import { Metadata } from "next";
import AssessmentPage from "@/components/AssessmentPage";

export const metadata: Metadata = {
    title: "Free Mental Health Assessment",
    description:
        "Take our free 2-minute mental health check-in to understand how you're really doing. Confidential, no sign-up required. Get matched with the right therapist for your needs.",
    alternates: {
        canonical: "/assessment",
    },
    openGraph: {
        title: "Free Mental Health Assessment | Mentel",
        description:
            "Answer 8 simple questions and get your personalised mental health result in under 2 minutes. Free, confidential, and no account needed.",
        url: "https://trymentel.com/assessment",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Free Mental Health Assessment | Mentel",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Free Mental Health Assessment | Mentel",
        description:
            "Answer 8 simple questions and get your personalised mental health result in under 2 minutes. Free, confidential, and no account needed.",
        images: ["/og-image.png"],
    },
};

export default function Assessment() {
    return <AssessmentPage />;
}