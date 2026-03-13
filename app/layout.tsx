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
  manifest: "/site.webmanifest",
  category: "health",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-off-white min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
