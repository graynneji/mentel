// // components/OneSignalInit.tsx
// "use client";

// import Script from "next/script";
// import { useEffect } from "react";
// import { getVisitorId } from "@/lib/analytics/client";
// import { getProfile } from "@/lib/personalization/profile";

// // Set in .env:
// //   NEXT_PUBLIC_ONESIGNAL_APP_ID=your-onesignal-app-id
// // From OneSignal → Settings → Keys & IDs.
// const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

// declare global {
//   interface Window {
//     OneSignalDeferred?: Array<(OneSignal: any) => void>;
//   }
// }

// /**
//  * Loads the OneSignal Web SDK and:
//  *  - Ties the push subscription to our own visitor id (mentel_vid) via
//  *    OneSignal's `login`, so a returning visitor's push subscription lines
//  *    up with the same identity used across analytics/personalization.
//  *  - Tags the subscriber with their last known interest/funnel stage so
//  *    notification campaigns can be segmented (e.g. "reached payment page
//  *    but didn't book" → send a nudge).
//  *  - Does NOT auto-prompt on page load. OneSignal's own slide-down prompt
//  *    (configured in the OneSignal dashboard, or the promptForPushNotifications
//  *    call below) asks for permission after a short delay, so it never
//  *    interrupts someone mid-assessment or mid-checkout.
//  *
//  * Renders nothing if NEXT_PUBLIC_ONESIGNAL_APP_ID isn't set.
//  */
// export default function OneSignalInit() {
//   useEffect(() => {
//     if (!ONESIGNAL_APP_ID) return;

//     window.OneSignalDeferred = window.OneSignalDeferred || [];
//     window.OneSignalDeferred.push(async (OneSignal) => {
//       await OneSignal.init({
//         appId: ONESIGNAL_APP_ID,
//         allowLocalhostAsSecureOrigin: process.env.NODE_ENV !== "production",
//         notifyButton: { enable: false }, // we use our own soft-prompt timing, not the bell widget
//       });

//       const visitorId = getVisitorId();
//       if (visitorId) {
//         try {
//           await OneSignal.login(visitorId);
//         } catch {
//           /* not fatal — push still works without external_id linkage */
//         }
//       }

//       const profile = getProfile();
//       const tags: Record<string, string> = {};
//       if (profile.interest) tags.interest = profile.interest;
//       if (profile.reachedPaymentPage && !profile.booked) tags.funnel_stage = "payment_page_no_booking";
//       else if (profile.assessmentResult && !profile.booked) tags.funnel_stage = "assessment_no_booking";
//       else if (profile.booked) tags.funnel_stage = "booked";
//       if (Object.keys(tags).length) {
//         try {
//           await OneSignal.User.addTags(tags);
//         } catch {
//           /* best-effort */
//         }
//       }

//       // Ask permission only after the visitor has shown some engagement —
//       // never on first paint. 20s or a scroll past the hero, whichever
//       // first; simplest reliable proxy here is a short delay.
//       setTimeout(() => {
//         OneSignal.Slidedown?.promptPush?.();
//       }, 20_000);
//     });
//   }, []);

//   if (!ONESIGNAL_APP_ID) return null;

//   return (
//     <Script
//       src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
//       strategy="afterInteractive"
//       async
//     />
//   );
// }


"use client";

import Script from "next/script";
import { useEffect, useRef } from "react"; // 1. Import useRef
import { getVisitorId } from "@/lib/analytics/client";
import { getProfile } from "@/lib/personalization/profile";

declare global {
  interface Window {
    // OneSignalDeferred is an array of functions that take the OneSignal object
    OneSignalDeferred: Array<(OneSignal: any) => void>;
  }
}
const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;


export default function OneSignalInit() {
  // 2. Create a ref to track if init has already run
  const isInitialized = useRef(false);

  useEffect(() => {
    // 3. Exit if already initialized or no APP_ID
    if (!ONESIGNAL_APP_ID || isInitialized.current) return;

    isInitialized.current = true;

    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async (OneSignal) => {
      // Check if already initialized internally by the SDK to be safe
      if (OneSignal.isInitialized?.()) return;

      await OneSignal.init({
        appId: ONESIGNAL_APP_ID,
        allowLocalhostAsSecureOrigin: process.env.NODE_ENV !== "production",
        notifyButton: { enable: false },
      });

      // ... keep your existing logic below (login, tagging, timeout)
      const visitorId = getVisitorId();
      if (visitorId) {
        try { await OneSignal.login(visitorId); } catch { }
      }

      const profile = getProfile();
      const tags: Record<string, string> = {};
      // ... (your existing profile tag logic)
      if (Object.keys(tags).length) {
        try { await OneSignal.User.addTags(tags); } catch { }
      }

      setTimeout(() => {
        OneSignal.Slidedown?.promptPush?.();
      }, 1_000);
    });
  }, []);

  if (!ONESIGNAL_APP_ID) return null;

  return (
    <Script
      src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
      strategy="afterInteractive"
      async
    />
  );
}