// app/api/partner/v1/health/route.ts
// Unauthenticated status check — standard practice so a partner's monitoring
// can distinguish "Mentel is down" from "my API key/network is broken"
// without spending a rate-limited, authenticated request to find out.

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "ok", time: new Date().toISOString() });
}
