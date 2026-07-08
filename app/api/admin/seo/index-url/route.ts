// app/api/admin/seo/index-url/route.ts
// POST: submit one or more URLs to the Google Indexing API. If a submitted
// URL matches a DB article, stamps lastIndexedAt on that article.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { submitUrlsForIndexing, isGoogleIndexingConfigured } from "@/lib/seo/google-indexing";

function requireAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("mentel_admin_session")?.value;
  return session === process.env.ADMIN_SESSION_SECRET;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.trymentel.com";

async function POST_HANDLER(req: Request) {
  const nextReq = req as NextRequest;
  if (!requireAdmin(nextReq)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!isGoogleIndexingConfigured()) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Google Indexing API isn't configured yet. Add GOOGLE_INDEXING_CLIENT_EMAIL and GOOGLE_INDEXING_PRIVATE_KEY to .env (see the SEO dashboard setup notes).",
      },
      { status: 400 }
    );
  }

  try {
    const body = await nextReq.json();
    const paths: string[] = Array.isArray(body.paths)
      ? body.paths.filter((p: unknown) => typeof p === "string")
      : typeof body.path === "string"
        ? [body.path]
        : [];

    if (paths.length === 0) {
      return NextResponse.json({ success: false, error: "No paths provided." }, { status: 400 });
    }
    if (paths.length > 50) {
      return NextResponse.json({ success: false, error: "Submit at most 50 URLs at a time." }, { status: 400 });
    }

    const urls = paths.map((p) => (p.startsWith("http") ? p : `${BASE_URL}${p}`));
    const results = await submitUrlsForIndexing(urls);

    // Best-effort: stamp lastIndexedAt on any DB article whose URL matched.
    const succeededSlugs = results
      .filter((r) => r.success)
      .map((r) => r.url.replace(BASE_URL, "").replace(/^\/articles\//, "").replace(/\/$/, ""));

    if (succeededSlugs.length > 0) {
      try {
        await db.article.updateMany({
          where: { slug: { in: succeededSlugs } },
          data: { lastIndexedAt: new Date() },
        });
      } catch (err) {
        console.error("[index-url] Failed to stamp lastIndexedAt", err);
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (err) {
    console.error("[index-url POST]", err);
    return NextResponse.json({ success: false, error: "Failed to submit URLs for indexing." }, { status: 500 });
  }
}

export const POST = POST_HANDLER;
