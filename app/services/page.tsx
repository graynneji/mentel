
import Services from "@/components/ServicesPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Explore Mentel's Mental Health Services, Therapy, and Personalized Support Options for Your Well-Being.",
    description:
        "Explore Mentel's mental health services, including online therapy, assessments, and personalized support designed to help you understand and improve your mental well-being.",
    alternates: {
        canonical: "/services",
    },
    openGraph: {
        title: "Explore Mentel's Mental Health Services, Therapy, and Personalized Support Options for Your Well-Being.",
        description:
            "Explore Mentel's mental health services, including online therapy, assessments, and personalized support designed to help you understand and improve your mental well-being.",
        url: "https://www.trymentel.com/services",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Mentel Therapy Services",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Explore Mentel’s Mental Health Services, Therapy, and Personalized Support Options for Your Well-Being.",
        description:
            "Explore Mentel’s mental health services, including online therapy, assessments, and personalized support designed to help you understand and improve your mental well-being.",
        images: ["/og-image.png"],
    },
};

export default function ServicesPage() {
    return (
        <Services />
    )
}