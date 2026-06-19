import { Metadata } from "next";
import ResultPage from "@/components/ResultPage";

export const metadata: Metadata = {
    title: "Your Wellness Results - Mentel",
    description:
        "Your personalised mental wellness assessment results from Mentel. See your pattern, matched therapist, and next steps.",
    alternates: {
        canonical: "/assessment/result",
    },
    // Prevent search engines indexing individual result pages
    robots: {
        index: false,
        follow: false,
    },
    openGraph: {
        title: "Your Mentel Wellness Results",
        description: "See your mental wellness pattern and your matched therapist.",
        url: "https://trymentel.com/assessment/result",
        images: [
            {
                url: "/assessment-og.png",
                width: 1200,
                height: 630,
                alt: "Mentel Wellness Assessment Results",
            },
        ],
    },
};

export default function Result() {
    return <ResultPage />;
}