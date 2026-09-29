// lib/partner/idempotency.ts
// See the comment on PartnerIdempotencyKey in prisma/schema.prisma for why
// this exists. Wrap any mutating handler body in this; pass the raw request
// text (read once, before JSON.parse) so it can be hashed.

import crypto from "crypto";
import { db } from "@/lib/db";

export async function withIdempotency(
  partnerId: string,
  key: string | null,
  rawBody: string,
  compute: () => Promise<{ status: number; body: unknown }>,
): Promise<{ status: number; body: unknown }> {
  if (!key) {
    return compute();
  }
  if (key.length > 200) {
    return {
      status: 400,
      body: {
        error: {
          code: "invalid_idempotency_key",
          message: "Idempotency-Key is too long (max 200 chars).",
        },
      },
    };
  }

  const requestHash = crypto.createHash("sha256").update(rawBody).digest("hex");

  const existing = await db.partnerIdempotencyKey.findUnique({
    where: { partnerId_key: { partnerId, key } },
  });

  if (existing) {
    if (existing.requestHash !== requestHash) {
      return {
        status: 422,
        body: {
          error: {
            code: "idempotency_key_conflict",
            message:
              "This Idempotency-Key was already used with a different request body.",
          },
        },
      };
    }
    return { status: existing.statusCode, body: existing.responseBody };
  }

  const result = await compute();

  // Only cache non-5xx outcomes — a transient server error shouldn't be
  // permanently replayed on the next honest retry.
  if (result.status < 500) {
    await db.partnerIdempotencyKey
      .create({
        data: {
          partnerId,
          key,
          requestHash,
          statusCode: result.status,
          responseBody: result.body as object,
        },
      })
      // Best-effort: a race against a concurrent identical request just
      // means no caching happened, not a failure of the actual request.
      .catch(() => {});
  }

  return result;
}
