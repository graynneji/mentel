"use client";

// Browser-side analytics SDK. Dependency-free. Mount <AnalyticsProvider /> once
// in your root layout and call analytics.track(...) anywhere in your app.

import type { IncomingEventPayload } from "./types";

const ENDPOINT = "/api/track";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

function send(events: IncomingEventPayload[], userId?: string | null) {
  const body = JSON.stringify({ events, userId, clientHints: getClientHints() });
  // Use sendBeacon when available so events survive page unload; fall back to fetch.
  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    const ok = navigator.sendBeacon(ENDPOINT, blob);
    if (ok) return;
  }
  fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    /* never let analytics break the app */
  });
}

function getClientHints() {
  return {
    screenWidth: window.screen?.width,
    screenHeight: window.screen?.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

let currentUserId: string | null = null;
let queue: IncomingEventPayload[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function enqueue(event: IncomingEventPayload) {
  queue.push(event);
  if (flushTimer) return;
  // Micro-batch events fired within the same tick/short window into one request.
  flushTimer = setTimeout(() => {
    const batch = queue;
    queue = [];
    flushTimer = null;
    send(batch, currentUserId);
  }, 250);
}

export const analytics = {
  identify(userId: string | null) {
    currentUserId = userId;
  },
  track(event: string, properties?: Record<string, unknown>) {
    enqueue({
      event,
      page: document.title,
      path: window.location.pathname,
      properties,
    });
  },
  /** Flush immediately, bypassing the micro-batch debounce (e.g. before navigation). */
  trackNow(event: string, properties?: Record<string, unknown>) {
    send(
      [{ event, page: document.title, path: window.location.pathname, properties }],
      currentUserId,
    );
  },
};

declare global {
  interface Window {
    analytics: typeof analytics;
  }
}
if (typeof window !== "undefined") {
  window.analytics = analytics;
}

// ───────────────────────────── Auto-instrumentation ─────────────────────────

let pageStart = Date.now();
let maxScroll = 0;
let clickCount = 0;
let rageClicks = 0;
let lastClickAt = 0;
let lastClickTarget: EventTarget | null = null;
let sameSpotClicks = 0;
let inactiveMs = 0;
let lastActivityAt = Date.now();
let visibilityChanges = 0;
let started = false;

function trackPageView() {
  pageStart = Date.now();
  maxScroll = 0;
  clickCount = 0;
  rageClicks = 0;
  inactiveMs = 0;
  lastActivityAt = Date.now();
  visibilityChanges = 0;

  analytics.track("PAGE_VIEW", {
    loadTimeMs: performance.timing
      ? performance.timing.loadEventEnd - performance.timing.navigationStart
      : undefined,
  });
}

function trackPageViewEnd() {
  const timeOnPageMs = Date.now() - pageStart;
  analytics.trackNow("PAGE_VIEW_END", {
    timeOnPageMs,
    scrollPercent: maxScroll,
    maxScrollPercent: maxScroll,
    clickCount,
    rageClicks,
    inactiveMs,
    visibilityChanges,
  });
}

function onScroll() {
  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - doc.clientHeight;
  if (scrollable <= 0) return;
  const pct = Math.min(100, Math.round((window.scrollY / scrollable) * 100));
  if (pct > maxScroll) maxScroll = pct;
  lastActivityAt = Date.now();
}

function onClick(e: MouseEvent) {
  clickCount++;
  const now = Date.now();
  const target = e.target;

  // Rage click: 3+ clicks on the same element within 1s.
  if (target === lastClickTarget && now - lastClickAt < 1000) {
    sameSpotClicks++;
    if (sameSpotClicks >= 3) rageClicks++;
  } else {
    sameSpotClicks = 1;
  }
  lastClickAt = now;
  lastClickTarget = target;
  lastActivityAt = now;

  const el = target as HTMLElement | null;
  if (!el) return;
  const clickable = el.closest("button, a, [role='button'], input[type=submit]") as HTMLElement | null;
  if (!clickable) return;

  analytics.track("CLICK", {
    text: clickable.innerText?.slice(0, 120) || clickable.getAttribute("aria-label") || undefined,
    id: clickable.id || undefined,
    className: clickable.className || undefined,
    tag: clickable.tagName.toLowerCase(),
    x: e.clientX,
    y: e.clientY,
  });
}

function onFormFocus(e: FocusEvent) {
  const el = e.target as HTMLElement;
  if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement)) return;
  analytics.track("FORM_FIELD_FOCUSED", { name: el.name || el.id, form: el.form?.id });
}

function onFormSubmit(e: SubmitEvent) {
  const form = e.target as HTMLFormElement;
  analytics.track("FORM_SUBMITTED", { formId: form.id || undefined, action: form.action || undefined });
}

function onError(e: ErrorEvent) {
  analytics.trackNow("JS_ERROR", {
    message: e.message,
    stack: e.error?.stack,
  });
}

function onUnhandledRejection(e: PromiseRejectionEvent) {
  analytics.trackNow("JS_ERROR", {
    message: String(e.reason?.message ?? e.reason ?? "Unhandled promise rejection"),
    stack: e.reason?.stack,
  });
}

function onVisibilityChange() {
  visibilityChanges++;
  if (document.visibilityState === "hidden") {
    trackPageViewEnd();
  }
}

function trackPerformance() {
  if (!("PerformanceObserver" in window)) return;
  const metrics: Record<string, number> = {};

  try {
    new PerformanceObserver((list) => {
      const last = list.getEntries().at(-1) as PerformanceEntry & { value?: number };
      if (last?.value !== undefined) metrics.cls = (metrics.cls ?? 0) + last.value;
    }).observe({ type: "layout-shift", buffered: true });
  } catch {}

  try {
    new PerformanceObserver((list) => {
      const last = list.getEntries().at(-1) as PerformanceEntry;
      metrics.lcp = last.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
  } catch {}

  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as (PerformanceEntry & { processingStart?: number })[]) {
        if (entry.processingStart) metrics.inp = entry.processingStart - entry.startTime;
      }
    }).observe({ type: "event", buffered: true });
  } catch {}

  const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  if (nav) {
    metrics.ttfb = nav.responseStart - nav.requestStart;
    metrics.domContentLoadedMs = nav.domContentLoadedEventEnd - nav.startTime;
  }

  window.addEventListener("pagehide", () => {
    analytics.trackNow("PERFORMANCE_METRIC", { performance: metrics });
  });
}

/** Call once from <AnalyticsProvider />. Idempotent. */
export function initAnalytics(userId?: string | null) {
  if (started || typeof window === "undefined") return;
  started = true;
  if (userId) analytics.identify(userId);

  trackPageView();
  trackPerformance();

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("click", onClick, true);
  window.addEventListener("focus", onFormFocus, true);
  window.addEventListener("submit", onFormSubmit, true);
  window.addEventListener("error", onError);
  window.addEventListener("unhandledrejection", onUnhandledRejection);
  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("pagehide", trackPageViewEnd);

  // Idle tracking — every 5s, if no activity in the last 5s, add to inactiveMs.
  setInterval(() => {
    if (Date.now() - lastActivityAt > 5000) inactiveMs += 5000;
  }, 5000);
}

/** Call from your router's navigation effect (App Router: usePathname effect) on route change. */
export function trackRouteChange() {
  trackPageViewEnd();
  trackPageView();
}

export function getVisitorId(): string | null {
  return getCookie("mentel_vid");
}
