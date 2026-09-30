
// import { Metadata } from "next";
// import Contact from "@/components/ContactPage";

// export const metadata: Metadata = {
//     title: "Contact Mentel for questions or concerns",
//     description:
//         "Get in touch with the Mentel team. We respond within one business day. Reach us by email, phone, or send us a message directly.",
//     alternates: {
//         canonical: "/contact",
//     },
//     openGraph: {
//         title: "Contact Mentel for questions or concerns",
//         description:
//             "Get in touch with the Mentel team. We respond within one business day. Reach us by email, phone, or send us a message directly.",
//         url: "https://www.trymentel.com/contact",
//         images: [
//             {
//                 url: "/og-image.png",
//                 width: 1200,
//                 height: 630,
//                 alt: "Contact Mentel | Mental Health & Therapy Services",
//             },
//         ],
//     },
//     twitter: {
//         card: "summary_large_image",
//         title: "Contact Mentel for questions or concerns",
//         description:
//             "Get in touch with the Mentel team. We respond within one business day. Reach us by email, phone, or send us a message directly.",
//         images: ["/og-image.png"],
//     },
// };

// export default function ContactPage() {
//     return (
//         <Contact />
//     )
// }

import type { Metadata } from "next";
import Contact from "@/components/ContactPage";

export const metadata: Metadata = {
    title: "Contact Mentel",
    description:
        "Get in touch with Mentel. Reach us by email, phone, WhatsApp, or our contact form. We respond within one business day.",
    alternates: {
        canonical: "/contact",
    },
    openGraph: {
        title: "Contact Mentel",
        description:
            "Get in touch with Mentel by email, phone, WhatsApp, or our contact form. We respond within one business day.",
        url: "https://www.trymentel.com/contact",
        type: "website",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Contact Mentel",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Contact Mentel",
        description:
            "Get in touch with Mentel by email, phone, WhatsApp, or our contact form. We respond within one business day.",
        images: ["/og-image.png"],
    },
};

export default function ContactPage() {
    return (
        <Contact />
    )
}