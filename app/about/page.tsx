
import About from "@/components/AboutPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us",
    description:
        "Learn about Mentel's mission to make quality mental health care accessible. Meet the team of licensed therapists dedicated to your wellbeing.",
    alternates: {
        canonical: "/about",
    },
    openGraph: {
        title: "About Us | Mentel",
        description:
            "Mentel was built on one belief — everyone deserves access to quality mental health care. Meet the team behind the mission.",
        url: "https://www.trymentel.com/about",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "About Mentel — Mental Health & Therapy Services",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "About Us | Mentel",
        description:
            "Mentel was built on one belief — everyone deserves access to quality mental health care. Meet the team behind the mission.",
        images: ["/og-image.png"],
    },
};

export default function AboutPage() {
    return (
        <About />
    )
}