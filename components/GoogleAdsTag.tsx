// components/GoogleAdsTag.tsx
"use client";

import Script from "next/script";

// Set in .env:
//   NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXX
// Find it in Google Ads → Tools → Conversions → your conversion action, or
// Google Ads → Settings → Account access → Conversion ID.
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

/**
 * Loads gtag.js and configures it for the Google Ads account, which enables:
 *  - Remarketing to past visitors on the Google Display Network and YouTube
 *  - Conversion tracking (see lib/tracking/pixels.ts for how conversions fire)
 *
 * Renders nothing if NEXT_PUBLIC_GOOGLE_ADS_ID isn't set, so it's safe to
 * mount unconditionally in the root layout.
 */
export default function GoogleAdsTag() {
  if (!GOOGLE_ADS_ID) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "GoogleAdsTag: NEXT_PUBLIC_GOOGLE_ADS_ID is not set. Add it to your .env file to enable Google Ads remarketing."
      );
    }
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-gtag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          // allow_enhanced_conversions helps match conversions back to the ad
          // click even with cookie restrictions; conversion linker keeps
          // Google click IDs (gclid) working across the visitor's session.
          gtag('config', '${GOOGLE_ADS_ID}', { allow_enhanced_conversions: true });
        `}
      </Script>
    </>
  );
}
