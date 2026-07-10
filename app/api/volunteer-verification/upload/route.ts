// app/api/volunteer-verification/upload/route.ts
// POST: uploads a CV, license, or NIN document to Vercel Blob and returns
// the URL. Unlike /api/admin/upload, this is public — the person filling
// out the verification form isn't an authenticated admin — so it's rate
// limited and strict about file type/size instead of gated by a session.

import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { withRateLimit } from "@/lib/withRateLimit";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB — CVs and scanned documents run larger than a cover image
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
];

async function POST_HANDLER(req: Request) {
  const nextReq = req as NextRequest;

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { success: false, error: "Document upload isn't set up yet. Please contact hello@trymentel.com directly for now." },
      { status: 400 }
    );
  }

  try {
    const formData = await nextReq.formData();
    const file = formData.get("file");
    const kind = String(formData.get("kind") ?? "document"); // "cv" | "license" | "nin"

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: "No file provided." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Unsupported file type. Use PDF, DOC, DOCX, JPG, PNG, or WEBP." },
        { status: 400 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ success: false, error: "File is too large (max 8MB)." }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "pdf";
    const safeKind = /^[a-z]+$/.test(kind) ? kind : "document";
    const filename = `verification/${safeKind}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const blob = await put(filename, file, { access: "public", addRandomSuffix: false });

    return NextResponse.json({ success: true, url: blob.url });
  } catch (err) {
    console.error("[Volunteer Verification Upload]", err);
    return NextResponse.json({ success: false, error: "Upload failed. Please try again." }, { status: 500 });
  }
}

export const POST = withRateLimit(POST_HANDLER);
