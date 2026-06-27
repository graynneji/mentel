import { analyticsDb } from "./prisma";
import {
  parseUserAgent,
  geoFromHeaders,
  anonymizeIp,
  getClientIp,
} from "./server";
import type { IncomingEventPayload } from "./types";

export interface IngestContext {
  visitorId: string;
  sessionId: string;
  userId: string | null;
  isNewSession: boolean;
  utm: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmTerm?: string;
    utmContent?: string;
    gclid?: string;
    fbclid?: string;
    ttclid?: string;
  };
  referrer: string | null;
  landingPage: string | null;
}

export async function ensureVisitorAndSession(
  headers: Headers,
  ctx: IngestContext,
  clientHints?: {
    screenWidth?: number;
    screenHeight?: number;
    viewportWidth?: number;
    viewportHeight?: number;
    pixelRatio?: number;
    language?: string;
    timezone?: string;
  },
) {
  const ua = parseUserAgent(headers.get("user-agent"));
  const geo = geoFromHeaders(headers);
  const ip = anonymizeIp(getClientIp(headers));

  await analyticsDb.visitor.upsert({
    where: { id: ctx.visitorId },
    create: {
      id: ctx.visitorId,
      userId: ctx.userId ?? undefined,
      firstUtmSource: ctx.utm.utmSource,
      firstUtmMedium: ctx.utm.utmMedium,
      firstUtmCampaign: ctx.utm.utmCampaign,
      firstReferrer: ctx.referrer ?? undefined,
    },
    update: {
      userId: ctx.userId ?? undefined,
      lastSeenAt: new Date(),
    },
  });

  //   if (ctx.isNewSession) {
  //     await analyticsDb.session.create({
  //       data: {
  //         id: ctx.sessionId,
  //         visitorId: ctx.visitorId,
  //         landingPage: ctx.landingPage ?? undefined,
  //         referrer: ctx.referrer ?? undefined,
  //         ...ctx.utm,
  //         device: ua.device,
  //         browser: ua.browser,
  //         browserVersion: ua.browserVersion,
  //         os: ua.os,
  //         osVersion: ua.osVersion,
  //         country: geo.country ?? undefined,
  //         city: geo.city ?? undefined,
  //         ip: ip ?? undefined,
  //         language: clientHints?.language,
  //         timezone: clientHints?.timezone,
  //         screenWidth: clientHints?.screenWidth,
  //         screenHeight: clientHints?.screenHeight,
  //         viewportWidth: clientHints?.viewportWidth,
  //         viewportHeight: clientHints?.viewportHeight,
  //         pixelRatio: clientHints?.pixelRatio,
  //       },
  //     });
  //   }
  // }

  await analyticsDb.session.upsert({
    where: { id: ctx.sessionId },
    create: {
      id: ctx.sessionId,
      visitorId: ctx.visitorId,
      landingPage: ctx.landingPage ?? undefined,
      referrer: ctx.referrer ?? undefined,
      ...ctx.utm,
      device: ua.device,
      browser: ua.browser,
      browserVersion: ua.browserVersion,
      os: ua.os,
      osVersion: ua.osVersion,
      country: geo.country ?? undefined,
      city: geo.city ?? undefined,
      ip: ip ?? undefined,
      language: clientHints?.language,
      timezone: clientHints?.timezone,
      screenWidth: clientHints?.screenWidth,
      screenHeight: clientHints?.screenHeight,
      viewportWidth: clientHints?.viewportWidth,
      viewportHeight: clientHints?.viewportHeight,
      pixelRatio: clientHints?.pixelRatio,
    },
    update: { lastActivityAt: new Date() },
  });
}

export async function recordEvent(
  payload: IncomingEventPayload,
  ctx: IngestContext,
) {
  await analyticsDb.event.create({
    data: {
      visitorId: ctx.visitorId,
      sessionId: ctx.sessionId,
      userId: ctx.userId ?? undefined,
      name: payload.event,
      page: payload.page,
      path: payload.path,
      properties: (payload.properties as object) ?? undefined,
      browser: (payload.browser as object) ?? undefined,
      device: (payload.device as object) ?? undefined,
      performance: (payload.performance as object) ?? undefined,
      utm: ctx.utm as object,
    },
  });

  // Route a few high-value event types into dedicated, fast-to-query tables
  // in addition to the generic event stream.
  switch (payload.event) {
    case "PAGE_VIEW": {
      await analyticsDb.pageView.create({
        data: {
          visitorId: ctx.visitorId,
          sessionId: ctx.sessionId,
          path: payload.path ?? "/",
          page: payload.page,
          loadTimeMs: numberOrNull(payload.properties?.loadTimeMs),
        },
      });
      break;
    }
    case "PAGE_VIEW_END": {
      // Sent via sendBeacon on unload/route change with final engagement metrics.
      const p = payload.properties ?? {};
      await analyticsDb.pageView.updateMany({
        where: { sessionId: ctx.sessionId, path: payload.path ?? "/" },
        data: {
          timeOnPageMs: numberOrNull(p.timeOnPageMs),
          scrollPercent: numberOrNull(p.scrollPercent),
          maxScrollPercent: numberOrNull(p.maxScrollPercent),
          clickCount: numberOrNull(p.clickCount),
          rageClicks: numberOrNull(p.rageClicks),
          inactiveMs: numberOrNull(p.inactiveMs),
          visibilityChanges: numberOrNull(p.visibilityChanges),
        },
      });
      break;
    }
    case "JS_ERROR": {
      const p = payload.properties ?? {};
      await analyticsDb.errorLog.create({
        data: {
          visitorId: ctx.visitorId,
          sessionId: ctx.sessionId,
          userId: ctx.userId ?? undefined,
          message: String(p.message ?? "Unknown error"),
          stack: p.stack ? String(p.stack) : undefined,
          page: payload.page,
          browser: payload.browser
            ? JSON.stringify(payload.browser)
            : undefined,
        },
      });
      break;
    }
    case "PERFORMANCE_METRIC": {
      const p = payload.performance ?? {};
      await analyticsDb.performanceMetric.create({
        data: {
          visitorId: ctx.visitorId,
          sessionId: ctx.sessionId,
          path: payload.path,
          cls: numberOrNull(p.cls),
          fid: numberOrNull(p.fid),
          lcp: numberOrNull(p.lcp),
          inp: numberOrNull(p.inp),
          ttfb: numberOrNull(p.ttfb),
          domContentLoadedMs: numberOrNull(p.domContentLoadedMs),
        },
      });
      break;
    }
    case "SESSION_END": {
      const p = payload.properties ?? {};
      await analyticsDb.session.update({
        where: { id: ctx.sessionId },
        data: {
          endedAt: new Date(),
          exitPage: payload.page,
          durationSec: numberOrNull(p.durationSec),
        },
      });
      break;
    }
    default:
      break;
  }
}

function numberOrNull(v: unknown): number | undefined {
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}
