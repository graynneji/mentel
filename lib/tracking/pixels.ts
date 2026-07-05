"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Single call-site for firing marketing conversion events. Instead of
// scattering `fbq(...)`, `gtag(...)`, `ttq.track(...)` calls (and their
// dedupe logic) across components, funnel code calls `fireConversion(...)`
// once and it fans out to whichever pixels are actually loaded.
//
// Every event is deduped per-key via sessionStorage so refreshes, the back
// button, or a re-render never double-count a conversion (this mirrors the
// existing dedupe pattern already used for the Paystack "Purchase" event).
// ─────────────────────────────────────────────────────────────────────────────

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    ttq?: { track: (event: string, data?: Record<string, unknown>) => void };
  }
}

export type ConversionEvent =
  | "ViewContent" // landed on assessment / booking
  | "Lead" // completed assessment, submitted contact details
  | "InitiateCheckout" // reached the payment step
  | "Purchase" // payment confirmed
  | "Contact" // clicked WhatsApp / contact CTA
  | "Schedule"; // booked a free call

interface ConversionParams {
  value?: number;
  currency?: string;
  contentName?: string;
  transactionId?: string;
  /** Unique key for this exact conversion instance (e.g. a payment reference).
   * When provided, the event fires at most once per key per browser. */
  dedupeKey?: string;
}

const GOOGLE_ADS_CONVERSION_LABELS: Partial<Record<ConversionEvent, string>> = {
  Lead: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_LEAD ?? "",
  Purchase: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_PURCHASE ?? "",
  Schedule: process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_SCHEDULE ?? "",
};

const TIKTOK_EVENT_MAP: Partial<Record<ConversionEvent, string>> = {
  ViewContent: "ViewContent",
  Lead: "SubmitForm",
  InitiateCheckout: "InitiateCheckout",
  Purchase: "Place an Order",
  Contact: "Contact",
  Schedule: "Schedule",
};

function alreadyFired(key: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(`mentel_px_${key}`) === "1";
  } catch {
    return false;
  }
}

function markFired(key: string) {
  try {
    sessionStorage.setItem(`mentel_px_${key}`, "1");
  } catch {
    /* ignore — dedupe is best-effort, never block tracking */
  }
}

export function fireConversion(event: ConversionEvent, params: ConversionParams = {}) {
  if (typeof window === "undefined") return;

  const dedupeKey = params.dedupeKey ? `${event}_${params.dedupeKey}` : null;
  if (dedupeKey && alreadyFired(dedupeKey)) return;

  // Meta Pixel
  window.fbq?.("track", event, {
    value: params.value,
    currency: params.currency ?? "NGN",
    content_name: params.contentName,
  });

  // Google Ads (gtag) — conversion events need an ad account/label pair, so
  // we only fire `conversion` when a label has been configured for this
  // event; otherwise we still send a GA4-style event so it's visible in
  // reporting without double-firing an unconfigured conversion.
  const label = GOOGLE_ADS_CONVERSION_LABELS[event];
  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  if (adsId && label) {
    window.gtag?.("event", "conversion", {
      send_to: `${adsId}/${label}`,
      value: params.value,
      currency: params.currency ?? "NGN",
      transaction_id: params.transactionId,
    });
  } else {
    window.gtag?.("event", event, {
      value: params.value,
      currency: params.currency ?? "NGN",
    });
  }

  // TikTok (existing pixel already on the page)
  const ttEvent = TIKTOK_EVENT_MAP[event];
  if (ttEvent) {
    window.ttq?.track(ttEvent, { value: params.value, currency: params.currency ?? "NGN" });
  }

  if (dedupeKey) markFired(dedupeKey);
}
