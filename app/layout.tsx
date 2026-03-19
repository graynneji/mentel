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
import Script from "next/script";
import { Nunito, DM_Sans } from "next/font/google";
import ConditionalShell from "@/components/Conditionalshell";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm",   // keep same variable name so nothing else breaks
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Mentel | Mental Health & Therapy Services",
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
    title: "Mentel | Mental Health & Therapy Services",
    description:
      "Connect with licensed therapists who genuinely listen. Evidence-based therapy for anxiety, depression, relationships, and more.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mentel | Mental Health & Therapy Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mentel | Mental Health & Therapy Services",
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
  name: "Mentel | Mental Health & Therapy Services",
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
    "therapist",
    "therapy",
    "marriage counselor",
    "healing",
    "mental care"
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
    <html lang="en" className={`${dmSans.variable}`}>
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

        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};


  ttq.load('D6QIQ5BC77U1CBCKKNS0');
  ttq.page();
}(window, document, 'ttq');
`}
          {/* D6QNLCRC77UC2AGO0N7G */}

          {/* 99544c37f1353c900f98b4723bbf6ef54d324dd1 */}

          {/* ttq.load('D6QIQ5BC77U1CBCKKNS0'); */}
          {`


!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};


  ttq.load('D6RG97BC77U4MV0OAVVG');
  ttq.page();
}(window, document, 'ttq');

`}
          {/* d733375f77e934f7bc47b20a412804f278a8c2ee */}
        </Script>
        {/* ttq.load('D6QIQ5BC77U1CBCKKNS0'); */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-52MBBZHS');`}
        </Script>

        {/* Your existing schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-52MBBZHS"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* ConditionalShell hides Navbar + Footer on /admin routes */}
        <ConditionalShell>{children}</ConditionalShell>
      </body>
    </html>
  );
}