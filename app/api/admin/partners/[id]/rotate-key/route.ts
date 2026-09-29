// app/api/admin/partners/[id]/rotate-key/route.ts
// POST: issue a fresh API key for a partner, invalidating the old one
// immediately. The new key is returned ONCE — same rule as creation.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateApiKey, hashApiKey } from "@/lib/partner/auth";

function requireAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("mentel_admin_session")?.value;
  return session === process.env.ADMIN_SESSION_SECRET;
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const { fullKey, keyPrefix } = generateApiKey();
  const keyHash = await hashApiKey(fullKey);

  const partner = await db.partner.update({
    where: { id },
    data: { keyPrefix, keyHash, keyRevokedAt: null },
  });

  return NextResponse.json({ partner: { id: partner.id }, apiKey: fullKey });
}
