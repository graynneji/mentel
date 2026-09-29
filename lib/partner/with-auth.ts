// lib/partner/with-auth.ts
// Wraps a partner API route: authenticates the API key, enforces the
// per-partner rate limit, and hands the resolved Partner to the handler.
// Keeps every route file free of repeated auth/rate-limit boilerplate.

import { NextRequest, NextResponse } from "next/server";
import type { Partner } from "@/generated/prisma/client";
import { authenticatePartner } from "./auth";
import { checkPartnerRateLimit } from "./rate-limit";
import { partnerError } from "./errors";

export function withPartnerAuth<
  Ctx extends { params: Promise<Record<string, string>> },
>(handler: (req: NextRequest, partner: Partner, ctx: Ctx) => Promise<Response>) {
  return async function (req: NextRequest, ctx: Ctx): Promise<Response> {
    const auth = await authenticatePartner(req);
    if (!auth.ok) {
      return partnerError(auth.status, auth.code, auth.message);
    }

    const { success, remaining, reset } = await checkPartnerRateLimit(
      auth.partner.id,
    );
    if (!success) {
      return NextResponse.json(
        {
          error: {
            code: "rate_limited",
            message: "Too many requests. Please slow down.",
          },
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": String(remaining),
            "X-RateLimit-Reset": String(reset),
          },
        },
      );
    }

    return handler(req, auth.partner, ctx);
  };
}
