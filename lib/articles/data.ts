// // lib/articles/data.ts
// //
// // Single accessor point for "all articles the public site should show".
// // Merges the new database-backed articles (written from /admin/articles)
// // with the legacy hard-coded array in utilz/articles/index.ts, so nothing
// // breaks while you gradually move content into the CMS.
// //
// // New articles should be written through the admin CMS going forward —
// // the static array is treated as read-only legacy content.

// import { db } from "@/lib/db";
// import { articles as staticArticles } from "@/utilz/articles";

// export interface ArticleSummary {
//   slug: string;
//   category: string;
//   title: string;
//   excerpt: string;
//   readMin: number;
//   date: string;
//   featured: boolean;
//   tags: string[];
//   image: string;
//   keywords: string[];
//   source: "db" | "static";
// }

// function dbArticleToSummary(a: {
//   slug: string;
//   category: string;
//   title: string;
//   excerpt: string;
//   readMin: number;
//   publishedAt: Date | null;
//   createdAt: Date;
//   featured: boolean;
//   tags: string[];
//   image: string | null;
//   keywords: string[];
// }): ArticleSummary {
//   return {
//     slug: a.slug,
//     category: a.category,
//     title: a.title,
//     excerpt: a.excerpt,
//     readMin: a.readMin,
//     date: (a.publishedAt ?? a.createdAt).toISOString().slice(0, 10),
//     featured: a.featured,
//     tags: a.tags,
//     image: a.image ?? "/og-image.png",
//     keywords: a.keywords,
//     source: "db",
//   };
// }

// /** All publicly-visible articles (published DB articles + legacy static ones), newest first. */
// export async function getAllPublishedArticles(): Promise<ArticleSummary[]> {
//   let dbArticles: ArticleSummary[] = [];
//   try {
//     const rows = await db.article.findMany({
//       where: { status: "published" },
//       orderBy: { publishedAt: "desc" },
//     });
//     dbArticles = rows.map(dbArticleToSummary);
//   } catch (err) {
//     // Table might not exist yet if migrations haven't run — degrade to
//     // static-only rather than breaking the articles page.
//     console.error("[getAllPublishedArticles] DB unavailable, falling back to static articles", err);
//   }

//   const staticSummaries: ArticleSummary[] = staticArticles.map((a) => ({
//     slug: a.slug,
//     category: a.category,
//     title: a.title,
//     excerpt: a.excerpt,
//     readMin: a.readMin,
//     date: a.date,
//     featured: a.featured,
//     tags: a.tags,
//     image: a.image,
//     keywords: a.keywords,
//     source: "static" as const,
//   }));

//   return [...dbArticles, ...staticSummaries].sort((a, b) => (a.date < b.date ? 1 : -1));
// }

// /** A single published DB article with full markdown content, or null if not found/not published. */
// export async function getPublishedDbArticleBySlug(slug: string) {
//   try {
//     const article = await db.article.findUnique({ where: { slug } });
//     if (!article || article.status !== "published") return null;
//     return article;
//   } catch (err) {
//     console.error("[getPublishedDbArticleBySlug]", err);
//     return null;
//   }
// }

// lib/articles/data.ts

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

export interface PaginatedArticles {
  articles: ArticleSummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Explicit column selection — never pull `content` (or anything else heavy)
// for listing purposes. Add fields here if the card/summary needs them.
const SUMMARY_SELECT = {
  slug: true,
  category: true,
  title: true,
  excerpt: true,
  readMin: true,
  publishedAt: true,
  createdAt: true,
  featured: true,
  tags: true,
  image: true,
  keywords: true,
} as const;

type DbSummaryRow = {
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
};

function dbRowToSummary(a: DbSummaryRow): ArticleSummary {
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

function staticToSummary(a: (typeof staticArticles)[number]): ArticleSummary {
  return {
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
    source: "static",
  };
}

/**
 * One page of published articles, newest first, optionally filtered by category.
 *
 * Two-phase fetch so we never load full article data (title/excerpt/image/etc.)
 * for anything outside the requested page:
 *   1. Lightweight index (slug + date only) from DB, merged with the static
 *      array's index in memory, to work out which slugs land on this page
 *      across BOTH sources combined.
 *   2. Full row data fetched only for the DB slugs that landed on this page.
 */
export async function getPublishedArticlesPage({
  page = 1,
  pageSize = 8,
  category,
}: {
  page?: number;
  pageSize?: number;
  category?: string;
}): Promise<PaginatedArticles> {
  const categoryFilter = category && category !== "All" ? category : undefined;

  let dbIndex: { slug: string; date: string }[] = [];
  try {
    const rows = await db.article.findMany({
      where: {
        status: "published",
        ...(categoryFilter ? { category: categoryFilter } : {}),
      },
      select: { slug: true, publishedAt: true, createdAt: true },
    });
    dbIndex = rows.map((r) => ({
      slug: r.slug,
      date: (r.publishedAt ?? r.createdAt).toISOString().slice(0, 10),
    }));
  } catch (err) {
    console.error(
      "[getPublishedArticlesPage] DB index unavailable, falling back to static-only",
      err,
    );
  }

  const staticIndex = staticArticles
    .filter((a) => !categoryFilter || a.category === categoryFilter)
    .map((a) => ({ slug: a.slug, date: a.date }));

  const merged = [
    ...dbIndex.map((d) => ({ ...d, isStatic: false as const })),
    ...staticIndex.map((s) => ({ ...s, isStatic: true as const })),
  ].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  const total = merged.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const pageSlice = merged.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  const dbSlugsNeeded = pageSlice.filter((s) => !s.isStatic).map((s) => s.slug);

  let dbFull: DbSummaryRow[] = [];
  if (dbSlugsNeeded.length > 0) {
    try {
      dbFull = await db.article.findMany({
        where: { slug: { in: dbSlugsNeeded } },
        select: SUMMARY_SELECT,
      });
    } catch (err) {
      console.error("[getPublishedArticlesPage] DB page fetch failed", err);
    }
  }

  const dbBySlug = new Map(dbFull.map((a) => [a.slug, dbRowToSummary(a)]));
  const staticBySlug = new Map(staticArticles.map((a) => [a.slug, a]));

  const articles = pageSlice
    .map((s) =>
      s.isStatic
        ? (() => {
            const a = staticBySlug.get(s.slug);
            return a ? staticToSummary(a) : null;
          })()
        : (dbBySlug.get(s.slug) ?? null),
    )
    .filter((a): a is ArticleSummary => a !== null);

  return { articles, total, page: safePage, pageSize, totalPages };
}

/**
 * Top N articles overall (for the featured hero + trending sidebar).
 * Only pulls `take` rows from the DB, not the full table — correct because
 * nothing outside a source's own top-N can appear in the merged top-N.
 */
export async function getFeaturedAndTrending(
  count = 6,
): Promise<ArticleSummary[]> {
  let dbTop: DbSummaryRow[] = [];
  try {
    dbTop = await db.article.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      take: count,
      select: SUMMARY_SELECT,
    });
  } catch (err) {
    console.error(
      "[getFeaturedAndTrending] DB unavailable, falling back to static-only",
      err,
    );
  }

  const combined = [
    ...dbTop.map(dbRowToSummary),
    ...staticArticles.map(staticToSummary),
  ].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  return combined.slice(0, count);
}

/** Distinct categories across both sources, for the filter pills. */
export async function getArticleCategories(): Promise<string[]> {
  let dbCategories: string[] = [];
  try {
    const rows = await db.article.findMany({
      where: { status: "published" },
      distinct: ["category"],
      select: { category: true },
    });
    dbCategories = rows.map((r) => r.category);
  } catch (err) {
    console.error(
      "[getArticleCategories] DB unavailable, falling back to static-only",
      err,
    );
  }

  const staticCategories = staticArticles.map((a) => a.category);
  return Array.from(new Set([...dbCategories, ...staticCategories]));
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

export async function getRelatedArticles(
  category: string,
  excludeSlug: string,
  limit = 3,
): Promise<ArticleSummary[]> {
  let dbRelated: DbSummaryRow[] = [];
  try {
    dbRelated = await db.article.findMany({
      where: { status: "published", category, slug: { not: excludeSlug } },
      orderBy: { publishedAt: "desc" },
      take: limit,
      select: SUMMARY_SELECT,
    });
  } catch (err) {
    console.error(
      "[getRelatedArticles] DB unavailable, falling back to static-only",
      err,
    );
  }

  const staticRelated = staticArticles
    .filter((a) => a.category === category && a.slug !== excludeSlug)
    .map(staticToSummary);

  return [...dbRelated.map(dbRowToSummary), ...staticRelated]
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .slice(0, limit);
}
