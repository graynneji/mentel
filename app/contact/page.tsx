
import { Metadata } from "next";
import Contact from "@/components/ContactPage";

export const metadata: Metadata = {
    title: "Contact Us",
    description:
        "Get in touch with the Mentel team. We respond within one business day, reach us by email, phone, or send a message directly.",
    alternates: {
        canonical: "/contact",
    },
    openGraph: {
        title: "Contact Us | Mentel",
        description:
            "Have a question before booking? Reach out to Mentel and our team will respond within one business day.",
        url: "https://trymentel.com/contact",
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
        title: "Contact Us | Mentel",
        description:
            "Have a question before booking? Reach out to Mentel and our team will respond within one business day.",
        images: ["/og-image.png"],
    },
};

export default function ContactPage() {
    return (
        <Contact />
    )
}