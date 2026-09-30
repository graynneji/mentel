import { NextResponse } from "next/server";
import { PARTNER_PORTAL_COOKIE } from "@/lib/partner/portal-auth";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(PARTNER_PORTAL_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
