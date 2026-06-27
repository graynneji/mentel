// app/api/admin/logout/route.ts
// Clears the admin session cookie. Adjust cookie name to match your auth setup.
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { withRateLimit } from "@/lib/withRateLimit";

export async function POST_HANDLER(): Promise<NextResponse> {
  const cookieStore = await cookies();

  // Clear common auth cookie names — update to match yours
  const authCookies = [
    "admin_token",
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "session",
  ];
  authCookies.forEach((name) => {
    cookieStore.delete(name);
  });

  return NextResponse.json({ success: true });
}

export const POST = withRateLimit(POST_HANDLER);
