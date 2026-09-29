// lib/partner/webhooks.ts
//
// Outbound event delivery to a partner's webhookUrl. Every event is written
// to PartnerWebhookEvent first (so a crisis event is never lost even if the
// partner's endpoint is down), then delivery is attempted immediately.
// Failed/pending events are retried by app/api/cron/partner-webhook-retry
// with backoff, up to MAX_ATTEMPTS.
//
// Signature: HMAC-SHA256 of the raw JSON body, using the partner's
// webhookSecret, sent as `X-Mentel-Signature: sha256=<hex>` — same pattern
// partners will recognise from Stripe/GitHub webhooks.

import crypto from "crypto";
import { db } from "@/lib/db";

export const MAX_WEBHOOK_ATTEMPTS = 6;

export type PartnerEventType =
  | "crisis.detected"
  | "session.logged"
  | "session.cancelled";

function signPayload(secret: string, rawBody: string): string {
  return crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
}

async function attemptDelivery(
  webhookUrl: string,
  webhookSecret: string,
  eventType: string,
  rawBody: string,
): Promise<{ delivered: boolean; responseStatus?: number; error?: string }> {
  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Mentel-Event": eventType,
        "X-Mentel-Signature": `sha256=${signPayload(webhookSecret, rawBody)}`,
      },
      body: rawBody,
      signal: AbortSignal.timeout(10_000),
    });
    return { delivered: res.ok, responseStatus: res.status };
  } catch (err) {
    return {
      delivered: false,
      error: err instanceof Error ? err.message : "network error",
    };
  }
}

/**
 * Records an event and attempts immediate delivery. Always call this for
 * crisis.detected — never let a missing/misconfigured webhookUrl silently
 * drop a crisis signal; it's still recorded and visible in the admin/cron
 * retry queue either way.
 */
export async function dispatchWebhookEvent(
  partnerId: string,
  eventType: PartnerEventType,
  payload: Record<string, unknown>,
): Promise<void> {
  const event = await db.partnerWebhookEvent.create({
    data: { partnerId, eventType, payload },
  });

  const partner = await db.partner.findUnique({ where: { id: partnerId } });
  if (!partner?.webhookUrl || !partner?.webhookSecret) {
    // No webhook configured — leave the event as "pending" so it's visible
    // for manual follow-up (crisis events must never disappear silently).
    return;
  }

  const rawBody = JSON.stringify({
    id: event.id,
    type: eventType,
    createdAt: event.createdAt,
    data: payload,
  });

  const result = await attemptDelivery(
    partner.webhookUrl,
    partner.webhookSecret,
    eventType,
    rawBody,
  );

  await db.partnerWebhookEvent.update({
    where: { id: event.id },
    data: {
      attempts: { increment: 1 },
      lastAttemptAt: new Date(),
      status: result.delivered ? "delivered" : "failed",
      deliveredAt: result.delivered ? new Date() : undefined,
      responseStatus: result.responseStatus,
      lastError: result.error,
    },
  });
}

/** Used by the retry cron. Skips events with no webhook configured or past MAX_WEBHOOK_ATTEMPTS. */
export async function retryPendingWebhookEvents(): Promise<{
  attempted: number;
  delivered: number;
}> {
  const events = await db.partnerWebhookEvent.findMany({
    where: {
      status: { in: ["pending", "failed"] },
      attempts: { lt: MAX_WEBHOOK_ATTEMPTS },
    },
    include: { partner: true },
    orderBy: { createdAt: "asc" },
    take: 200,
  });

  let attempted = 0;
  let delivered = 0;

  for (const event of events) {
    if (!event.partner.webhookUrl || !event.partner.webhookSecret) continue;

    attempted++;
    const rawBody = JSON.stringify({
      id: event.id,
      type: event.eventType,
      createdAt: event.createdAt,
      data: event.payload,
    });

    const result = await attemptDelivery(
      event.partner.webhookUrl,
      event.partner.webhookSecret,
      event.eventType,
      rawBody,
    );

    if (result.delivered) delivered++;

    await db.partnerWebhookEvent.update({
      where: { id: event.id },
      data: {
        attempts: { increment: 1 },
        lastAttemptAt: new Date(),
        status: result.delivered ? "delivered" : "failed",
        deliveredAt: result.delivered ? new Date() : undefined,
        responseStatus: result.responseStatus,
        lastError: result.error,
      },
    });
  }

  return { attempted, delivered };
}
