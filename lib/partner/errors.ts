// lib/partner/errors.ts
// Consistent error envelope for the partner API: { error: { code, message } }.

import { NextResponse } from "next/server";

export function partnerError(
  status: number,
  code: string,
  message: string,
  extra?: Record<string, unknown>,
) {
  return NextResponse.json(
    { error: { code, message, ...extra } },
    { status },
  );
}
