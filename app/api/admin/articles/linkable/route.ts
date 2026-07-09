// app/api/admin/articles/linkable/route.ts
// GET: a lightweight list of every published article (database + legacy
// static) for the "insert a link to another article" picker in the editor.
// Deliberately small (title/slug/category only) since it's just for
// building markdown links, not full article data.

import { NextRequest, NextResponse } from "next/server";
import { getAllPublishedArticles } from "@/lib/articles/data";

function requireAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("mentel_admin_session")?.value;
  return session === process.env.ADMIN_SESSION_SECRET;
}

export async function GET(req: Request) {
  const nextReq = req as NextRequest;
  if (!requireAdmin(nextReq)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const articles = await getAllPublishedArticles();
    return NextResponse.json({
      success: true,
      articles: articles.map((a) => ({ title: a.title, slug: a.slug, category: a.category })),
    });
  } catch (err) {
    console.error("[Linkable Articles GET]", err);
    return NextResponse.json({ success: false, error: "Failed to load articles." }, { status: 500 });
  }
}
