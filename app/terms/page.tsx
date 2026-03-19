import BgBlobs from "@/components/BgBlobs";
import { Metadata } from "next";
import { Leaf, FileText } from "lucide-react";

export const metadata: Metadata = {
    title: "Terms of Service",
    description:
        "Read Mentel's terms of service. Understand your rights and responsibilities when using our mental health platform.",
    alternates: {
        canonical: "/terms",
    },
    openGraph: {
        title: "Terms of Service | Mentel",
        description: "Read Mentel's terms of service and understand your rights when using our platform.",
        url: "https://trymentel.com/terms",
        images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Mentel Terms of Service" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Terms of Service | Mentel",
        description: "Read Mentel's terms of service and understand your rights when using our platform.",
        images: ["/og-image.png"],
    },
};

const sections = [
    {
        title: "Acceptance of Terms",
        content: [
            "By accessing or using Mentel's website or services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.",
            "We reserve the right to update these terms at any time. Continued use of Mentel after changes are posted constitutes acceptance of the revised terms.",
        ],
    },
    {
        title: "Our Services",
        content: [
            "Mentel is a mental health platform that connects individuals with licensed therapists for online therapy sessions. We facilitate the booking and delivery of therapy but are not a medical provider ourselves.",
            "Our services are intended for individuals aged 18 and above. Mentel is not a crisis service. If you are experiencing a mental health emergency, please contact your local emergency services immediately.",
        ],
    },
    {
        title: "Not a Crisis Service",
        content: [
            "Mentel is not equipped to handle psychiatric emergencies or immediate crises. If you are in danger or experiencing a mental health crisis, please call your local emergency number or a crisis helpline immediately.",
            "By using Mentel, you acknowledge that it is not a substitute for emergency mental health care.",
        ],
    },
    {
        title: "Therapist Relationship",
        content: [
            "Therapists on Mentel are independent licensed professionals. The therapeutic relationship is between you and your therapist. Mentel facilitates access to these professionals but is not responsible for the specific advice or treatment you receive.",
            "You have the right to change therapists at any time. We encourage you to communicate openly with your therapist about your needs.",
        ],
    },
    {
        title: "Booking & Cancellations",
        content: [
            "Sessions must be booked in advance through our platform. We ask that you provide at least 24 hours' notice if you need to cancel or reschedule a session.",
            "Late cancellations or no-shows may be subject to a cancellation fee as outlined during the booking process. Repeated no-shows may result in suspension of your account.",
        ],
    },
    {
        title: "Payments & Refunds",
        content: [
            "Payment is due at the time of booking. We accept major debit and credit cards. All transactions are processed securely through our payment provider.",
            "Refunds are issued for sessions cancelled with sufficient notice. Sessions that have already taken place are non-refundable. If you experience a technical issue during a session, please contact us and we will review your case.",
        ],
    },
    {
        title: "User Conduct",
        content: [
            "You agree to use Mentel respectfully and lawfully. You must not use the platform to harass, threaten, or harm others, share false information, or engage in any activity that violates applicable law.",
            "We reserve the right to suspend or terminate your account if you violate these terms or engage in conduct that is harmful to other users or our therapists.",
        ],
    },
    {
        title: "Intellectual Property",
        content: [
            "All content on the Mentel platform, including text, design, logos, and software, is owned by Mentel or its licensors. You may not reproduce, distribute, or create derivative works without our express written permission.",
        ],
    },
    {
        title: "Limitation of Liability",
        content: [
            "To the fullest extent permitted by law, Mentel shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services.",
            "Our total liability to you for any claim arising from these terms or your use of the platform shall not exceed the amount you paid us in the 3 months prior to the claim.",
        ],
    },
    {
        title: "Governing Law",
        content: [
            "These terms are governed by the laws of the Federal Republic of Nigeria. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Lagos State.",
        ],
    },
];

export default function TermsPage() {
    return (
        <div className="relative">
            <BgBlobs />
            <div className="relative z-10 max-w-3xl mx-auto px-6 pt-28 pb-20">

                {/* Header */}
                <div className="max-w-xl mb-14">
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-6 border"
                        style={{ background: "rgba(123,169,139,0.10)", borderColor: "rgba(123,169,139,0.25)", color: "var(--sage-dark)" }}
                    >
                        <Leaf size={12} />
                        Legal
                    </div>
                    <h1 className="font-cormorant text-5xl font-light mb-5 leading-tight" style={{ color: "var(--deep)" }}>
                        Terms of<br />
                        <em className="italic" style={{ color: "var(--teal)" }}>Service</em>.
                    </h1>
                    <p className="text-base font-light leading-relaxed" style={{ color: "var(--text-muted)" }}>
                        Last updated: June 2025. Please read these terms carefully before using Mentel.
                    </p>
                </div>

                {/* Sections */}
                <div className="flex flex-col gap-6">
                    {sections.map(({ title, content }, i) => (
                        <div
                            key={title}
                            className="p-6 md:p-8 rounded-2xl border"
                            style={{ background: "white", borderColor: "var(--border)" }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium"
                                    style={{ background: "rgba(123,169,139,0.12)", color: "var(--sage-dark)" }}
                                >
                                    {i + 1}
                                </div>
                                <h2 className="font-cormorant text-xl font-semibold" style={{ color: "var(--deep)" }}>
                                    {title}
                                </h2>
                            </div>
                            <div className="flex flex-col gap-3">
                                {content.map((para, j) => (
                                    <p key={j} className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                                        {para}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact note */}
                <div
                    className="mt-8 rounded-3xl p-8 text-center border"
                    style={{ background: "white", borderColor: "var(--border)" }}
                >
                    <div
                        className="w-10 h-1 rounded-full mx-auto mb-5"
                        style={{ background: "linear-gradient(90deg, var(--sage), var(--teal))" }}
                    />
                    <FileText size={22} className="mx-auto mb-3" style={{ color: "var(--sage-dark)" }} />
                    <h2 className="font-cormorant text-2xl font-light mb-2" style={{ color: "var(--deep)" }}>
                        Questions about these terms?
                    </h2>
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                        Reach us at{" "}
                        <a href="mailto:hello@trymentel.com" className="underline underline-offset-2" style={{ color: "var(--teal)" }}>
                            hello@trymentel.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}