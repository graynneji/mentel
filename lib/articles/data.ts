// lib/articles/data.ts
//
// Single accessor point for "all articles the public site should show".
// Merges the new database-backed articles (written from /admin/articles)
// with the legacy hard-coded array in utilz/articles/index.ts, so nothing
// breaks while you gradually move content into the CMS.
//
// New articles should be written through the admin CMS going forward —
// the static array is treated as read-only legacy content.

import { db } from "@/lib/db";
import { articles as staticArticles } from "@/utilz/articles";

export interface ArticleSummary {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readMin: number;
  date: string;
  featured: boolean;
  tags: string[];
  image: string;
  keywords: string[];
  source: "db" | "static";
}

function dbArticleToSummary(a: {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readMin: number;
  publishedAt: Date | null;
  createdAt: Date;
  featured: boolean;
  tags: string[];
  image: string | null;
  keywords: string[];
}): ArticleSummary {
  return {
    slug: a.slug,
    category: a.category,
    title: a.title,
    excerpt: a.excerpt,
    readMin: a.readMin,
    date: (a.publishedAt ?? a.createdAt).toISOString().slice(0, 10),
    featured: a.featured,
    tags: a.tags,
    image: a.image ?? "/og-image.png",
    keywords: a.keywords,
    source: "db",
  };
}

/** All publicly-visible articles (published DB articles + legacy static ones), newest first. */
export async function getAllPublishedArticles(): Promise<ArticleSummary[]> {
  let dbArticles: ArticleSummary[] = [];
  try {
    const rows = await db.article.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
    });
    dbArticles = rows.map(dbArticleToSummary);
  } catch (err) {
    // Table might not exist yet if migrations haven't run — degrade to
    // static-only rather than breaking the articles page.
    console.error("[getAllPublishedArticles] DB unavailable, falling back to static articles", err);
  }

  const staticSummaries: ArticleSummary[] = staticArticles.map((a) => ({
    slug: a.slug,
    category: a.category,
    title: a.title,
    excerpt: a.excerpt,
    readMin: a.readMin,
    date: a.date,
    featured: a.featured,
    tags: a.tags,
    image: a.image,
    keywords: a.keywords,
    source: "static" as const,
  }));

  return [...dbArticles, ...staticSummaries].sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** A single published DB article with full markdown content, or null if not found/not published. */
export async function getPublishedDbArticleBySlug(slug: string) {
  try {
    const article = await db.article.findUnique({ where: { slug } });
    if (!article || article.status !== "published") return null;
    return article;
  } catch (err) {
    console.error("[getPublishedDbArticleBySlug]", err);
    return null;
  }
}
