// app/api/partner-portal/rotate-key/route.ts
// POST: a partner rotating their OWN API key, from their OWN portal login
// (not the admin panel). Old key stops working immediately.
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requirePartnerPortalUser } from "@/lib/partner/portal-auth";
import { generateApiKey, hashApiKey } from "@/lib/partner/auth";

export async function POST(req: NextRequest) {
  const auth = await requirePartnerPortalUser(req);
  if (!auth.ok) return NextResponse.json({ error: { message: auth.message } }, { status: auth.status });

  const { fullKey, keyPrefix } = generateApiKey();
  const keyHash = await hashApiKey(fullKey);

  await db.partner.update({
    where: { id: auth.partnerId },
    data: { keyPrefix, keyHash, keyRevokedAt: null },
  });

  return NextResponse.json({ success: true, apiKey: fullKey });
}
