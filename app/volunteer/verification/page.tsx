import { Metadata } from "next";
import VolunteerVerification from "@/components/VolunteerVerificationPage";

export const metadata: Metadata = {
    title: "Volunteer Verification",
    description: "Verify your identity and, where applicable, your professional credentials to complete your Mentel volunteer application.",
    robots: {
        index: false, // an intake form with no unique content for search — keep it out of the index
        follow: false,
    },
};

export default function VolunteerVerificationRoute() {
    return <VolunteerVerification />;
}
