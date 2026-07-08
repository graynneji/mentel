// app/api/admin/upload/route.ts
// POST: accepts an image file (multipart/form-data, field name "file") and
// uploads it to Vercel Blob storage, returning the public URL. The image
// itself never touches the database or your git repo — only the URL
// string gets saved on the Article record.

import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

function requireAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("mentel_admin_session")?.value;
  return session === process.env.ADMIN_SESSION_SECRET;
}

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export async function POST(req: Request) {
  const nextReq = req as NextRequest;
  if (!requireAdmin(nextReq)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Image upload isn't set up yet. In your Vercel project, go to Storage → Create Database → Blob, then connect it to this project (this adds BLOB_READ_WRITE_TOKEN automatically). Locally, pull it with `vercel env pull`.",
      },
      { status: 400 }
    );
  }

  try {
    const formData = await nextReq.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: "No file provided." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Unsupported file type. Use JPG, PNG, WEBP, GIF, or AVIF." },
        { status: 400 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ success: false, error: "Image is too large (max 5MB)." }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `articles/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false,
    });

    return NextResponse.json({ success: true, url: blob.url });
  } catch (err) {
    console.error("[Admin Upload POST]", err);
    return NextResponse.json({ success: false, error: "Upload failed. Please try again." }, { status: 500 });
  }
}
