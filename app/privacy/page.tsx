import BgBlobs from "@/components/BgBlobs";
import { Metadata } from "next";
import { Leaf, Shield } from "lucide-react";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description:
        "Learn how Mentel collects, uses, and protects your personal information. Your privacy and confidentiality are our priority.",
    alternates: {
        canonical: "/privacy",
    },
    openGraph: {
        title: "Privacy Policy | Mentel",
        description: "Learn how Mentel collects, uses, and protects your personal information.",
        url: "https://trymentel.com/privacy",
        images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Mentel Privacy Policy" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Privacy Policy | Mentel",
        description: "Learn how Mentel collects, uses, and protects your personal information.",
        images: ["/og-image.png"],
    },
};

const sections = [
    {
        title: "Information We Collect",
        content: [
            "When you use Mentel, we may collect personal information you provide directly — such as your name, email address, phone number, and any details you share when booking a session or filling out intake forms.",
            "We also collect limited technical data such as your IP address, browser type, and pages visited to help us improve our service. We do not sell or rent this data to third parties.",
        ],
    },
    {
        title: "How We Use Your Information",
        content: [
            "We use your information to match you with the right therapist, schedule and manage your sessions, send appointment reminders and follow-ups, and improve the overall quality of our platform.",
            "We may send you service-related emails such as confirmations and receipts. You may opt out of non-essential communications at any time.",
        ],
    },
    {
        title: "Confidentiality & Therapy Sessions",
        content: [
            "Everything shared in therapy sessions is strictly confidential. Our therapists are bound by professional and ethical obligations to protect what you share. Session notes are never shared with third parties without your explicit written consent.",
            "Exceptions to confidentiality apply only as required by law — for example, if there is a risk of harm to yourself or others, or where a court order compels disclosure.",
        ],
    },
    {
        title: "Data Storage & Security",
        content: [
            "Your data is stored on secure, encrypted servers. We use industry-standard security measures including SSL encryption, access controls, and regular security audits to protect your information.",
            "We retain your personal data only for as long as necessary to provide our services or as required by law. You may request deletion of your data at any time by contacting us.",
        ],
    },
    {
        title: "Cookies",
        content: [
            "We use cookies and similar technologies to keep you logged in, remember your preferences, and understand how people use our platform. You can disable cookies in your browser settings, though some features may not function properly as a result.",
        ],
    },
    {
        title: "Third-Party Services",
        content: [
            "We may use trusted third-party services for payment processing, video sessions, and analytics. These providers are contractually required to handle your data securely and only for the purposes we specify.",
            "We do not allow third parties to use your data for their own marketing purposes.",
        ],
    },
    {
        title: "Your Rights",
        content: [
            "You have the right to access, correct, or delete the personal data we hold about you. You may also request a copy of your data or withdraw consent for specific uses at any time.",
            "To exercise any of these rights, please contact us at hello@trymentel.com. We will respond within 30 days.",
        ],
    },
    {
        title: "Changes to This Policy",
        content: [
            "We may update this Privacy Policy from time to time. When we do, we will notify you by email or by posting a notice on our website. Continued use of Mentel after changes take effect constitutes your acceptance of the updated policy.",
        ],
    },
];

export default function PrivacyPage() {
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
                        Privacy<br />
                        <em className="italic" style={{ color: "var(--sage-dark)" }}>Policy</em>.
                    </h1>
                    <p className="text-base font-light leading-relaxed" style={{ color: "var(--text-muted)" }}>
                        Last updated: June 2025. Your privacy matters to us. This policy explains how we handle your information.
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
                    <Shield size={22} className="mx-auto mb-3" style={{ color: "var(--sage-dark)" }} />
                    <h2 className="font-cormorant text-2xl font-light mb-2" style={{ color: "var(--deep)" }}>
                        Questions about your privacy?
                    </h2>
                    <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
                        Reach us at{" "}
                        <a href="mailto:hello@trymentel.com" className="underline underline-offset-2" style={{ color: "var(--sage-dark)" }}>
                            hello@trymentel.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}