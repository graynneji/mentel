
import Services from "@/components/ServicesPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Our Services",
    description:
        "Explore Mentel's therapy services, individual counseling, couples therapy, anxiety treatment, depression support, and more. Evidence-based care from licensed therapists.",
    alternates: {
        canonical: "/services",
    },
    openGraph: {
        title: "Our Services | Mentel",
        description:
            "From anxiety and depression to relationships and burnout, explore evidence-based therapy services tailored to your needs.",
        url: "https://mentel.com/services",
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
        title: "Our Services | Mentel",
        description:
            "From anxiety and depression to relationships and burnout, explore evidence-based therapy services tailored to your needs.",
        images: ["/og-image.png"],
    },
};

export default function ServicesPage() {
    return (
        <Services />
    )
}