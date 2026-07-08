// app/api/admin/seo/optimize/route.ts
// POST: given a DB article id, return rule-based optimization suggestions.
// Pass { apply: true } to write the suggested metaTitle/metaDescription/
// keywords straight to the article instead of just returning them.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { suggestOptimizations } from "@/lib/seo/auto-optimize";

function requireAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("mentel_admin_session")?.value;
  return session === process.env.ADMIN_SESSION_SECRET;
}

async function POST_HANDLER(req: Request) {
  const nextReq = req as NextRequest;
  if (!requireAdmin(nextReq)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await nextReq.json();
    const id = String(body.id ?? "");
    if (!id) return NextResponse.json({ success: false, error: "Missing article id." }, { status: 400 });

    const article = await db.article.findUnique({ where: { id } });
    if (!article) return NextResponse.json({ success: false, error: "Article not found." }, { status: 404 });

    const suggestions = suggestOptimizations(article);

    if (body.apply === true) {
      const data: Record<string, unknown> = {};
      if (suggestions.suggestedMetaTitle) data.metaTitle = suggestions.suggestedMetaTitle;
      if (suggestions.suggestedMetaDescription) data.metaDescription = suggestions.suggestedMetaDescription;
      if (suggestions.suggestedKeywordsToAdd.length > 0) {
        data.keywords = [...new Set([...article.keywords, ...suggestions.suggestedKeywordsToAdd])];
      }
      const updated = await db.article.update({ where: { id }, data });
      return NextResponse.json({ success: true, applied: true, article: updated, suggestions });
    }

    return NextResponse.json({ success: true, applied: false, suggestions });
  } catch (err) {
    console.error("[SEO optimize POST]", err);
    return NextResponse.json({ success: false, error: "Failed to generate suggestions." }, { status: 500 });
  }
}

export const POST = POST_HANDLER;
