// app/api/admin/sms/balance/route.ts
import { NextRequest, NextResponse } from "next/server";
import { checkBalance } from "@/lib/sms/bestbulksms";

function requireAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("mentel_admin_session")?.value;
  return session === process.env.ADMIN_SESSION_SECRET;
}

export async function GET(req: Request) {
  const nextReq = req as NextRequest;
  if (!requireAdmin(nextReq))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await checkBalance();
  console.log("Balance check result:", result);
  if (!result.success) {
    return NextResponse.json(
      { success: false, error: result.error },
      { status: 502 },
    );
  }
  return NextResponse.json(result);
}
