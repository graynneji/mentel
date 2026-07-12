// utils/trackEvent.ts
"use client";

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) | undefined;
  }
}

export function trackConversionEvent(
  eventName: string,
  data: { value?: number; currency?: string; email?: string; phone?: string },
) {
  const eventId = crypto.randomUUID();

  // 1. Browser pixel (instant, for ads optimization UI feedback)
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, data, { eventID: eventId });
  }

  // 2. Server CAPI (reliable, survives blockers/iOS webviews)
  fetch("/api/fb-capi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventName, eventId, ...data }),
  }).catch((err) => console.error("CAPI send failed:", err));
}
