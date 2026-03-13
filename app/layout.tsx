// import type { Metadata } from "next";
// import "./globals.css";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";

// export const metadata: Metadata = {
//   title: {
//     default: "Mentel — Mental Health & Therapy Services",
//     template: "%s | Mentel",
//   },
//   description:
//     "Mentel connects you with licensed therapists who genuinely listen. Evidence-based therapy for anxiety, depression, relationships, and more.",
//   keywords: [
//     "mental health",
//     "therapy",
//     "online therapy",
//     "licensed therapist",
//     "anxiety treatment",
//     "depression help",
//     "relationship counseling",
//     "mental wellness",
//     "teletherapy",
//     "CBT",
//   ],
//   authors: [{ name: "Mentel", url: "https://trymentel.com" }],
//   creator: "Mentel",
//   publisher: "Mentel",
//   metadataBase: new URL("https://trymentel.com"),
//   alternates: {
//     canonical: "/",
//   },
//   openGraph: {
//     type: "website",
//     locale: "en_US",
//     url: "https://trymentel.com",
//     siteName: "Mentel",
//     title: "Mentel — Mental Health & Therapy Services",
//     description:
//       "Connect with licensed therapists who genuinely listen. Evidence-based therapy for anxiety, depression, relationships, and more.",
//     images: [
//       {
//         url: "/og-image.png",
//         width: 1200,
//         height: 630,
//         alt: "Mentel — Mental Health & Therapy Services",
//       },
//     ],
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Mentel — Mental Health & Therapy Services",
//     description:
//       "Connect with licensed therapists who genuinely listen. Evidence-based therapy for anxiety, depression, relationships, and more.",
//     images: ["/og-image.png"],
//     creator: "@mentel",
//     site: "@mentel",
//   },
//   robots: {
//     index: true,
//     follow: true,
//     googleBot: {
//       index: true,
//       follow: true,
//       "max-image-preview": "large",
//       "max-snippet": -1,
//     },
//   },
//   icons: {
//     icon: [
//       { url: "/favicon.ico" },
//       { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
//       { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
//     ],
//     apple: [{ url: "/apple-touch-icon.png" }],
//   },
//   category: "health",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className="bg-off-white min-h-screen flex flex-col" suppressHydrationWarning>
//         <Navbar />
//         <main className="flex-1">{children}</main>
//         <Footer />
//       </body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Mentel — Mental Health & Therapy Services",
    template: "%s | Mentel",
  },
  description:
    "Mentel connects you with licensed therapists who genuinely listen. Evidence-based therapy for anxiety, depression, relationships, and more.",
  keywords: [
    "mental health",
    "therapy",
    "online therapy",
    "licensed therapist",
    "anxiety treatment",
    "depression help",
    "relationship counseling",
    "mental wellness",
    "teletherapy",
    "CBT",
  ],
  authors: [{ name: "Mentel", url: "https://trymentel.com" }],
  creator: "Mentel",
  publisher: "Mentel",
  metadataBase: new URL("https://trymentel.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://trymentel.com",
    siteName: "Mentel",
    title: "Mentel — Mental Health & Therapy Services",
    description:
      "Connect with licensed therapists who genuinely listen. Evidence-based therapy for anxiety, depression, relationships, and more.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mentel — Mental Health & Therapy Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mentel — Mental Health & Therapy Services",
    description:
      "Connect with licensed therapists who genuinely listen. Evidence-based therapy for anxiety, depression, relationships, and more.",
    images: ["/og-image.png"],
    creator: "@mentel",
    site: "@mentel",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  category: "health",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Mentel",
  url: "https://trymentel.com",
  logo: "https://trymentel.com/logo.png",
  description:
    "Mentel connects you with licensed therapists who genuinely listen. Evidence-based therapy for anxiety, depression, relationships, and more.",
  email: "hello@trymentel.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lagos",
    addressCountry: "NG",
  },
  sameAs: [
    "https://instagram.com/mentel_ltd",
    "https://tiktok.com/@mentelltd",
    "https://wa.me/+254734527573",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Mentel",
  url: "https://trymentel.com",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://trymentel.com/?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

const siteLinksSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Mentel — Mental Health & Therapy Services",
  url: "https://trymentel.com",
  description:
    "Mentel connects you with licensed therapists who genuinely listen.",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://trymentel.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "About",
        item: "https://trymentel.com/about",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Services",
        item: "https://trymentel.com/services",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Contact",
        item: "https://trymentel.com/contact",
      },
    ],
  },
};

const medicalBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "Mentel",
  url: "https://trymentel.com",
  logo: "https://trymentel.com/logo.png",
  description:
    "Licensed therapy and mental health services online. Evidence-based care for anxiety, depression, relationships, trauma, and more.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lagos",
    addressCountry: "NG",
  },
  email: "hello@trymentel.com",
  medicalSpecialty: [
    "Psychiatry",
    "Psychology",
    "Mental Health",
    "clinical psychology",
    "counseling psychology",
    "counsellor",
    "therapist"
  ],
  availableService: [
    { "@type": "MedicalTherapy", name: "Individual Therapy" },
    { "@type": "MedicalTherapy", name: "Couples Therapy" },
    { "@type": "MedicalTherapy", name: "Trauma Therapy" },
    { "@type": "MedicalTherapy", name: "Anxiety Treatment" },
    { "@type": "MedicalTherapy", name: "Depression Support" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteLinksSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalBusinessSchema) }}
        />
      </head>
      <body
        className="bg-off-white min-h-screen flex flex-col"
        suppressHydrationWarning
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}