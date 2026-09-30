// app/api/partner-portal/settings/route.ts
// PATCH: self-service webhook URL update. Rotates the webhook secret
// whenever the URL changes, same rule as the admin route, so a partner
// can't be left signing against a secret for an endpoint that's no
// longer theirs.
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { requirePartnerPortalUser } from "@/lib/partner/portal-auth";

export async function PATCH(req: NextRequest) {
  const auth = await requirePartnerPortalUser(req);
  if (!auth.ok) return NextResponse.json({ error: { message: auth.message } }, { status: auth.status });

  const body = await req.json();
  const webhookUrl = (body.webhookUrl as string | undefined)?.trim() || null;
  if (webhookUrl && !/^https:\/\//.test(webhookUrl)) {
    return NextResponse.json({ error: { message: "Webhook URL must start with https://." } }, { status: 400 });
  }

  const current = await db.partner.findUnique({ where: { id: auth.partnerId }, select: { webhookUrl: true } });
  const data: Record<string, unknown> = { webhookUrl };
  if (webhookUrl !== current?.webhookUrl) {
    data.webhookSecret = webhookUrl ? crypto.randomBytes(32).toString("hex") : null;
  }

  const partner = await db.partner.update({ where: { id: auth.partnerId }, data });

  return NextResponse.json({
    success: true,
    webhookUrl: partner.webhookUrl,
    // Only present when it was just (re)generated — shown once, same rule as an API key.
    newWebhookSecret: data.webhookSecret ?? undefined,
  });
}
