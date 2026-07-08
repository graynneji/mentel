import { Metadata } from "next";
import Volunteer from "@/components/VolunteerPage";

export const metadata: Metadata = {
    title: "Volunteer With Us",
    description:
        "Join the Mentel volunteer community and help make mental health support more accessible across Nigeria. Apply in minutes.",
    alternates: {
        canonical: "/volunteer",
    },
    openGraph: {
        title: "Volunteer With Us - Mentel",
        description:
            "Join the Mentel volunteer community and help make mental health support more accessible across Nigeria.",
        url: "https://www.trymentel.com/volunteer",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Volunteer with Mentel",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Volunteer With Us - Mentel",
        description:
            "Join the Mentel volunteer community and help make mental health support more accessible across Nigeria.",
        images: ["/og-image.png"],
    },
};

export default function VolunteerRoute() {
    return <Volunteer />;
}
