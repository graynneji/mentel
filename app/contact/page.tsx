
import { Metadata } from "next";
import Contact from "@/components/ContactPage";

export const metadata: Metadata = {
    title: "Contact Mentel if you have questions, concerns, ideas, or feedback about our mental health services, therapy, assessments, or your experience with our platform.",
    description:
        "Get in touch with the Mentel team. We respond within one business day. Reach us by email, phone, or send us a message directly.",
    alternates: {
        canonical: "/contact",
    },
    openGraph: {
        title: "Contact Mentel if you have questions, concerns, ideas, or feedback about our mental health services, therapy, assessments, or your experience with our platform.",
        description:
            "Get in touch with the Mentel team. We respond within one business day. Reach us by email, phone, or send us a message directly.",
        url: "https://www.trymentel.com/contact",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Contact Mentel | Mental Health & Therapy Services",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Contact Mentel if you have questions, concerns, ideas, or feedback about our mental health services, therapy, assessments, or your experience with our platform.",
        description:
            "Get in touch with the Mentel team. We respond within one business day. Reach us by email, phone, or send us a message directly.",
        images: ["/og-image.png"],
    },
};

export default function ContactPage() {
    return (
        <Contact />
    )
}