import BgBlobs from "@/components/BgBlobs";
import { Metadata } from "next";
import { Leaf, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Acceptable Use Policy",
    description:
        "Read Mentel's Acceptable Use Policy — the rules and standards for using our mental health platform, for both clients and therapists.",
    alternates: {
        canonical: "/acceptable-use",
    },
    openGraph: {
        title: "Acceptable Use Policy - Mentel",
        description: "The rules and standards for using Mentel's platform, for both clients and therapists.",
        url: "https://www.trymentel.com/acceptable-use",
        images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Mentel Acceptable Use Policy" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Acceptable Use Policy | Mentel",
        description: "The rules and standards for using Mentel's platform, for both clients and therapists.",
        images: ["/og-image.png"],
    },
};

const sections: { title: string; content: string[] }[] = [
    {
        title: "Permitted Use",
        content: [
            "You may use Mentel only for lawful purposes and in accordance with this Policy. You agree to use the Services responsibly and respectfully.",
            "You may create an account using accurate and truthful information, book and attend therapy or mental health support sessions, communicate respectfully with therapists and Mentel staff, access educational and wellness resources we provide, and use the platform only for your personal or authorized professional purposes.",
        ],
    },
    {
        title: "Prohibited Activities",
        content: [
            "You agree not to provide false, misleading, or fraudulent information during registration or while using the Services, impersonate another individual or organization, or use another person's account without permission.",
            "You also agree not to upload or submit forged identification or professional credentials, attempt to gain unauthorized access to the platform, user accounts, or systems, or introduce viruses, malware, or other harmful software.",
            "Harassing, threatening, intimidating, or abusing therapists, clients, Mentel staff, or other users is strictly prohibited, as is using the platform for illegal, fraudulent, deceptive, or harmful activities, or sharing content that is defamatory, abusive, discriminatory, hateful, obscene, or otherwise unlawful.",
            "You may not record, distribute, or publish therapy sessions without the consent of all participants, or use Mentel to advertise or promote unauthorized products or services.",
        ],
    },
    {
        title: "Professional Standards for Therapists",
        content: [
            "Therapists and mental health professionals using Mentel agree to provide accurate professional information during onboarding, maintain all required professional qualifications and licenses where applicable, and deliver services within the scope of their professional competence.",
            "Therapists must maintain client confidentiality in accordance with applicable laws and ethical standards, notify Mentel promptly if their professional registration, license, or eligibility changes, and provide services professionally, ethically, and respectfully.",
            "Mentel reserves the right to verify professional qualifications and request additional documentation at any time.",
        ],
    },
    {
        title: "Identity Verification",
        content: [
            "To help protect users and maintain trust, Mentel may request identity verification and supporting documentation from clients, therapists, or other users.",
            "Failure to provide requested information may result in delayed onboarding, restricted access, suspension, or termination of an account.",
        ],
    },
    {
        title: "Payments",
        content: [
            "Payments for services booked through Mentel must be made using approved payment methods available on the platform.",
            "Users must not use stolen or unauthorized payment methods, attempt to reverse legitimate payments fraudulently, or engage in payment fraud or abuse of refunds.",
            "Refunds and cancellations are governed by the Payments & Refunds section of our Terms of Service.",
        ],
    },
    {
        title: "Intellectual Property",
        content: [
            "All content, branding, software, graphics, text, logos, and materials available through Mentel are owned by Mentel or its licensors.",
            "You may not reproduce, copy, modify, distribute, or commercially exploit any part of the Services without our prior written permission.",
        ],
    },
    {
        title: "Reporting Misuse",
        content: [
            "If you believe a user has violated this Policy, please report the matter to Mentel through our official support channels. We review reports in good faith and may investigate suspected violations where appropriate.",
        ],
    },
    {
        title: "Enforcement",
        content: [
            "Mentel may investigate suspected violations of this Policy. Where necessary, we may issue warnings, request additional information or verification, restrict or suspend access to the Services, remove content that violates this Policy, permanently terminate accounts, or report unlawful activities to the appropriate authorities where required by law.",
        ],
    },
    {
        title: "Changes to This Policy",
        content: [
            "Mentel may update this Acceptable Use Policy from time to time to reflect changes in our Services, legal obligations, or operational requirements.",
            "The latest version will always be available on our website. Continued use of the Services after updates become effective constitutes acceptance of the revised Policy.",
        ],
    },
];

export default function AcceptableUsePage() {
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
                        Acceptable<br />
                        <em className="italic" style={{ color: "var(--sage-dark)" }}>Use Policy</em>.
                    </h1>
                    <p className="text-base font-light leading-relaxed" style={{ color: "var(--text-muted)" }}>
                        Effective date: January 2026. This Policy explains the rules and standards that apply when you
                        access or use Mentel, for both people seeking support and licensed professionals providing
                        care. It works alongside our{" "}
                        <Link href="/terms" className="underline underline-offset-2" style={{ color: "var(--sage-dark)" }}>
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="underline underline-offset-2" style={{ color: "var(--sage-dark)" }}>
                            Privacy Policy
                        </Link>.
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
                    <ShieldCheck size={22} className="mx-auto mb-3" style={{ color: "var(--sage-dark)" }} />
                    <h2 className="font-cormorant text-2xl font-light mb-2" style={{ color: "var(--deep)" }}>
                        Questions about this Policy?
                    </h2>
                    <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
                        Reach us at{" "}
                        <a href="mailto:hello@mail.trymentel.com" className="underline underline-offset-2" style={{ color: "var(--sage-dark)" }}>
                            hello@mail.trymentel.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
