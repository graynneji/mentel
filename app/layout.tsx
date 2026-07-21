

// import type { Metadata } from "next";
// import "./globals.css";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import Script from "next/script";
// import { Nunito, DM_Sans } from "next/font/google";
// import ConditionalShell from "@/components/Conditionalshell";
// import { Analytics } from "@vercel/analytics/next";
// import FacebookPixel from "@/components/FacebookPixel";
// import GoogleAdsTag from "@/components/GoogleAdsTag";
// import OneSignalInit from "@/components/OneSignalInit";
// import WhatsAppButton from "@/components/WhatsAppButton";

// const dmSans = DM_Sans({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "600", "700"],
//   variable: "--font-dm-sans",
//   display: "swap",
// });

// const nunito = Nunito({
//   subsets: ["latin"],
//   weight: ["300", "400", "500"],
//   variable: "--font-nunito", // Fixed variable name
//   display: "swap",
// });

// export const metadata: Metadata = {
//   title: {
//     default: "Mentel - Mental Health & Therapy Services",
//     template: "%s - Mentel",
//   },
//   applicationName: "Mentel",
//   description:
//     "Mentel connects you with licensed therapists who genuinely listen. Evidence-based therapy for anxiety, depression, relationships, and more.",
//   keywords: [
//     "online therapy Nigeria",
//     "licensed therapist Nigeria",
//     "mental health Nigeria",
//     "therapy Lagos",
//     "therapy Abuja",
//     "therapy Port Harcourt",
//     "anxiety therapy",
//     "depression therapy",
//     "trauma therapy",
//     "relationship counselling Nigeria",
//     "couples therapy Nigeria",
//     "psychologist Nigeria",
//     "CBT therapy",
//     "mental wellness",
//     "burnout recovery",
//     "online counselling",
//     "affordable therapy Nigeria",
//     "therapy near me",
//     "find a therapist",
//     "mental health support",
//   ],
//   authors: [{ name: "Mentel", url: "https://www.trymentel.com" }],
//   creator: "Mentel",
//   publisher: "Mentel",
//   metadataBase: new URL("https://www.trymentel.com"),
//   alternates: {
//     canonical: "/",
//   },
//   openGraph: {
//     type: "website",
//     locale: "en_NG",
//     url: "https://www.trymentel.com",
//     siteName: "Mentel",
//     title: "Mentel - Mental Health & Therapy Services",
//     description:
//       "Find licensed therapists in Nigeria for anxiety, depression, trauma, burnout, stress, and relationship challenges. Secure online therapy sessions from ₦8,500.",
//     images: [
//       {
//         url: "https://www.trymentel.com/og-image.jpg",
//         // url: "https://www.trymentel.com/og-image.png",
//         width: 1200,
//         height: 630,
//         alt: "Mentel - Mental Health & Therapy Services",
//       },
//     ],
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Mentel - Mental Health & Therapy Services",
//     description:
//       "Connect with licensed therapists who genuinely listen. Evidence-based therapy for anxiety, depression, relationships, and more.",
//     images: ["https://www.trymentel.com/og-image.jpg"],
//     // images: ["/og-image.png"],
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
//       { url: "/favicon.png", sizes: "48x48", type: "image/png" },
//     ],
//     apple: [{ url: "/apple-touch-icon.png" }],
//   },
//   category: "health",
// };

// /* ─────────────────────────────────────────────
//    UNIFIED STRUCTURED DATA (JSON-LD @graph)
//    Combined into a single schema graph to prevent 
//    conflicting entity IDs and resolve AI parsing issues.
// ───────────────────────────────────────────── */

// const structuredData = {
//   "@context": "https://schema.org",
//   "@graph": [
//     {
//       "@type": "WebSite",
//       "@id": "https://www.trymentel.com/#website",
//       name: "Mentel",
//       alternateName: ["Mentel", "Mentel - Mental Health & Therapy Services", "Mentel Ltd"], // Crucial for Google Site Name mapping
//       url: "https://www.trymentel.com",
//       inLanguage: "en-NG",
//       description:
//         "Nigeria's online therapy platform. Licensed therapists from ₦8,500 per session.",
//       publisher: {
//         "@id": "https://www.trymentel.com/#organization",
//       },
//       potentialAction: {
//         "@type": "SearchAction",
//         target: {
//           "@type": "EntryPoint",
//           urlTemplate: "https://www.trymentel.com/?q={search_term_string}",
//         },
//         "query-input": "required name=search_term_string",
//       },
//     },
//     {
//       "@type": ["MedicalBusiness", "Organization"], // Unified types
//       "@id": "https://www.trymentel.com/#organization",
//       name: "Mentel",
//       alternateName: "Mentel - Mental Health & Therapy Services",
//       url: "https://www.trymentel.com",
//       logo: "https://www.trymentel.com/logo.png",
//       description:
//         "Licensed online therapy and mental health services for Nigerians. Evidence-based care for anxiety, depression, relationships, trauma, burnout, and more. Sessions from ₦5,500.",
//       foundingDate: "2024",
//       email: "hello@mail.trymentel.com",
//       address: {
//         "@type": "PostalAddress",
//         addressLocality: "Lagos",
//         addressRegion: "Lagos",
//         addressCountry: "NG",
//       },
//       areaServed: {
//         "@type": "Country",
//         name: "Nigeria",
//       },
//       sameAs: [
//         "https://instagram.com/mentel_ltd",
//         "https://tiktok.com/@mentelltd",
//         "https://wa.me/254734527573",
//       ],
//       priceRange: "₦₦",
//       currenciesAccepted: "NGN",
//       paymentAccepted: "Credit Card, Bank Transfer",
//       medicalSpecialty: [
//         "Psychiatry",
//         "Psychology",
//         "Mental Health",
//         "Clinical Psychology",
//         "Counseling Psychology",
//         "telehealth",
//         "Online Therapy",
//       ],
//       availableService: [
//         {
//           "@type": "MedicalTherapy",
//           name: "Individual Therapy",
//           description:
//             "One-on-one sessions with a licensed therapist via secure video call. From ₦8,500 per session.",
//         },
//         {
//           "@type": "MedicalTherapy",
//           name: "Couples Therapy",
//           description:
//             "Joint sessions for couples navigating conflict, communication breakdown, or relationship challenges.",
//         },
//         {
//           "@type": "MedicalTherapy",
//           name: "Trauma Therapy",
//           description:
//             "Specialist trauma care using EMDR, Trauma-Focused CBT, and Somatic Experiencing.",
//         },
//         {
//           "@type": "MedicalTherapy",
//           name: "Anxiety Treatment",
//           description:
//             "Evidence-based treatment for anxiety disorders using Cognitive Behavioural Therapy (CBT).",
//         },
//         {
//           "@type": "MedicalTherapy",
//           name: "Depression Support",
//           description:
//             "Structured support for depression using Behavioural Activation and CBT.",
//         },
//         {
//           "@type": "MedicalTherapy",
//           name: "Burnout Recovery",
//           description:
//             "ACT-based therapy and values work to recover from occupational burnout.",
//         },
//       ],
//     },
//     {
//       "@type": "BreadcrumbList",
//       "@id": "https://www.trymentel.com/#breadcrumb",
//       itemListElement: [
//         { "@type": "ListItem", position: 1, name: "Home", item: "https://www.trymentel.com" },
//         { "@type": "ListItem", position: 2, name: "Articles", item: "https://www.trymentel.com/articles" },
//         { "@type": "ListItem", position: 3, name: "About", item: "https://www.trymentel.com/about" },
//         { "@type": "ListItem", position: 4, name: "Services", item: "https://www.trymentel.com/services" },
//         { "@type": "ListItem", position: 5, name: "Contact", item: "https://www.trymentel.com/contact" },
//         { "@type": "ListItem", position: 6, name: "Book a Session", item: "https://www.trymentel.com/#book" },
//       ],
//     },
//   ],
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     // Injected both font variables so they actually load
//     <html lang="en" className={`${dmSans.variable} ${nunito.variable}`}>
//       <head>
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
//         />
//       </head>
//       <body
//         className="bg-off-white min-h-screen flex flex-col"
//         suppressHydrationWarning
//       >
//         <Script id="tiktok-pixel" strategy="afterInteractive">
//           {`
// !function (w, d, t) {
//   w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
// var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
// ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

//   ttq.load('D6QIQ5BC77U1CBCKKNS0');
//   ttq.page();
// }(window, document, 'ttq');
// `}
//         </Script>

//         <Script id="gtm-script" strategy="afterInteractive">
//           {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
// new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
// j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
// 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
// })(window,document,'script','dataLayer','GTM-52MBBZHS');`}
//         </Script>
//         <noscript>
//           <iframe
//             src="https://www.googletagmanager.com/ns.html?id=GTM-52MBBZHS"
//             height="0"
//             width="0"
//             style={{ display: "none", visibility: "hidden" }}
//           />
//         </noscript>
//         <FacebookPixel />
//         <GoogleAdsTag />
//         <OneSignalInit />
//         <WhatsAppButton />
//         <ConditionalShell>{children}</ConditionalShell>
//         <Analytics />
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
import { Analytics } from "@vercel/analytics/next";
import FacebookPixel from "@/components/FacebookPixel";
import GoogleAdsTag from "@/components/GoogleAdsTag";
import OneSignalInit from "@/components/OneSignalInit";
import IntegrityBeacon from "@/components/IntegrityBeacon";
import WhatsAppButton from "@/components/WhatsAppButton";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-nunito", // Fixed variable name
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Mentel | Online Professional Therapy & Mental Health Support",
    template: "%s - Mentel",
  },
  applicationName: "Mentel",
  description:
    "Get matched with a licensed therapist who genuinely listen. Confidential, evidence-based online therapy for anxiety, depression, relationships, trauma, burnout, and personal growth.",
  keywords: [
    "online therapy Nigeria",
    "licensed therapist Nigeria",
    "mental health Nigeria",
    "therapy Lagos",
    "therapy Abuja",
    "therapy Port Harcourt",
    "anxiety therapy",
    "depression therapy",
    "trauma therapy",
    "relationship counselling Nigeria",
    "couples therapy Nigeria",
    "psychologist Nigeria",
    "CBT therapy",
    "mental wellness",
    "burnout recovery",
    "online counselling",
    "affordable therapy Nigeria",
    "therapy near me",
    "find a therapist",
    "mental health support",
  ],
  authors: [{ name: "Mentel", url: "https://www.trymentel.com" }],
  creator: "Mentel",
  publisher: "Mentel",
  metadataBase: new URL("https://www.trymentel.com"),
  alternates: {
    canonical: "https://www.trymentel.com",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://www.trymentel.com",
    siteName: "Mentel",
    title: "Mentel | Online Professional Therapy & Mental Health Support",
    description:
      "Get matched with a licensed therapist who genuinely listen. Confidential, evidence-based online therapy for anxiety, depression, trauma, burnout, relationships, and personal growth.",
    images: [
      {
        url: "https://www.trymentel.com/og-image.jpg",
        // url: "https://www.trymentel.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mentel - Mental Health & Therapy Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mentel | Online Professional Therapy & Mental Health Support",
    description:
      "Confidential, evidence-based online therapy with licensed therapists for anxiety, depression, trauma, burnout, relationships, and personal growth.",
    images: ["https://www.trymentel.com/og-image.jpg"],
    // images: ["/og-image.png"],
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
      { url: "/favicon.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  category: "health",
};

/* ─────────────────────────────────────────────
   UNIFIED STRUCTURED DATA (JSON-LD @graph)
   Combined into a single schema graph to prevent 
   conflicting entity IDs and resolve AI parsing issues.
───────────────────────────────────────────── */

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://www.trymentel.com/#website",
      name: "Mentel",
      alternateName: ["Mentel", "Mentel | Online Professional Therapy & Mental Health Support", "Mentel Ltd"], // Crucial for Google Site Name mapping
      url: "https://www.trymentel.com",
      inLanguage: "en-NG",
      description:
        "Online therapy platform connecting people with licensed therapists for confidential, evidence-based mental health support.",
      publisher: {
        "@id": "https://www.trymentel.com/#organization",
      },
      // potentialAction: {
      //   "@type": "SearchAction",
      //   target: {
      //     "@type": "EntryPoint",
      //     urlTemplate: "https://www.trymentel.com/?q={search_term_string}",
      //   },
      //   "query-input": "required name=search_term_string",
      // },
    },
    {
      "@type": ["MedicalBusiness", "Organization"], // Unified types
      "@id": "https://www.trymentel.com/#organization",
      name: "Mentel",
      alternateName: "Mentel | Online Professional Therapy & Mental Health Support",
      url: "https://www.trymentel.com",
      logo: "https://www.trymentel.com/logo.png",
      description:
        "Confidential online therapy with licensed therapists. Evidence-based support for anxiety, depression, trauma, burnout, relationships, stress, and emotional wellbeing.",
      foundingDate: "2024",
      foundingLocation: {
        "@type": "Place",
        name: "Lagos",
      },
      email: "hello@mail.trymentel.com",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Customer Support",
        email: "hello@mail.trymentel.com",
        availableLanguage: ["English"],
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Lagos",
        addressRegion: "Lagos",
        addressCountry: "NG",
      },
      areaServed: {
        "@type": "Country",
        name: "Nigeria",
      },
      sameAs: [
        "https://instagram.com/mentel_ltd",
        "https://tiktok.com/@mentelltd",
        "https://wa.me/2347031362034",
      ],
      priceRange: "₦₦",
      currenciesAccepted: "NGN",
      paymentAccepted: "Credit Card, Bank Transfer",
      medicalSpecialty: [
        "Psychiatry",
        "Psychology",
        "Mental Health",
        "Clinical Psychology",
        "Counseling Psychology",
        "telehealth",
        "Online Therapy",
      ],
      availableService: [
        {
          "@type": "MedicalTherapy",
          name: "Individual Therapy",
          description:
            "One-on-one sessions with a licensed therapist via secure video call.",
        },
        {
          "@type": "MedicalTherapy",
          name: "Couples Therapy",
          description:
            "Joint sessions for couples navigating conflict, communication breakdown, or relationship challenges.",
        },
        {
          "@type": "MedicalTherapy",
          name: "Trauma Therapy",
          description:
            "Specialist trauma care using EMDR, Trauma-Focused CBT, and Somatic Experiencing.",
        },
        {
          "@type": "MedicalTherapy",
          name: "Anxiety Treatment",
          description:
            "Evidence-based treatment for anxiety disorders using Cognitive Behavioural Therapy (CBT).",
        },
        {
          "@type": "MedicalTherapy",
          name: "Depression Support",
          description:
            "Structured support for depression using Behavioural Activation and CBT.",
        },
        {
          "@type": "MedicalTherapy",
          name: "Burnout Recovery",
          description:
            "ACT-based therapy and values work to recover from occupational burnout.",
        },
      ],
    },
    // {
    //   "@type": "BreadcrumbList",
    //   "@id": "https://www.trymentel.com/#breadcrumb",
    //   itemListElement: [
    //     { "@type": "ListItem", position: 1, name: "Home", item: "https://www.trymentel.com" },
    //     { "@type": "ListItem", position: 2, name: "Articles", item: "https://www.trymentel.com/articles" },
    //     { "@type": "ListItem", position: 3, name: "About", item: "https://www.trymentel.com/about" },
    //     { "@type": "ListItem", position: 4, name: "Services", item: "https://www.trymentel.com/services" },
    //     { "@type": "ListItem", position: 5, name: "Contact", item: "https://www.trymentel.com/contact" },
    //     { "@type": "ListItem", position: 6, name: "Book a Session", item: "https://www.trymentel.com/book" },
    //   ],
    // },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Injected both font variables so they actually load
    <html lang="en" className={`${dmSans.variable} ${nunito.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
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
        </Script>

        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-52MBBZHS');`}
        </Script>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-52MBBZHS"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <FacebookPixel />
        <GoogleAdsTag />
        <OneSignalInit />
        <IntegrityBeacon />
        <WhatsAppButton />
        <ConditionalShell>{children}</ConditionalShell>
        <Analytics />
      </body>
    </html>
  );
}