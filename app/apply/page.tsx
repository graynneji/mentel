import { Metadata } from "next";
import ProfessionalApplicationPage from "@/components/Apply";

export const metadata: Metadata = {
    title: "Professional Application",
    description: "Complete your application to work with Mentel as a professional.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function Apply() {
    return <ProfessionalApplicationPage />;
}