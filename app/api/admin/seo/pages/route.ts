// // app/api/admin/seo/pages/route.ts
// // GET: everything the SEO dashboard needs in one call — every article
// // (DB + legacy static) with a real SEO score (computed from actual content,
// // unlike the old seo-report page which scored against empty content), plus
// // the static marketing routes for indexing purposes.

// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { articles as staticArticles, articleContent } from "@/utilz/articles";
// import { scorePageSEO } from "@/lib/seo-scoring-engine";
// import { analyzeKeywords } from "@/lib/seo/keyword-analysis";
// import { isGoogleIndexingConfigured } from "@/lib/seo/google-indexing";

// function requireAdmin(req: NextRequest): boolean {
//   const session = req.cookies.get("mentel_admin_session")?.value;
//   return session === process.env.ADMIN_SESSION_SECRET;
// }

// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.trymentel.com";

// // Static marketing routes that aren't articles — listed for indexing/status
// // purposes. Add/remove as the site's route map changes.
// const STATIC_PAGES = [
//   { path: "/", label: "Home" },
//   { path: "/about", label: "About" },
//   { path: "/services", label: "Services" },
//   { path: "/contact", label: "Contact" },
//   { path: "/assessment", label: "Assessment" },
//   { path: "/book-call", label: "Book a Call" },
//   { path: "/articles", label: "Articles" },
//   { path: "/volunteer", label: "Volunteer" },
//   { path: "/eap", label: "EAP" },
// ];

// async function GET_HANDLER(req: Request) {
//   const nextReq = req as NextRequest;
//   if (!requireAdmin(nextReq)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   try {
//     let dbArticles: Awaited<ReturnType<typeof db.article.findMany>> = [];
//     try {
//       dbArticles = await db.article.findMany({ orderBy: { updatedAt: "desc" } });
//     } catch (err) {
//       console.error("[SEO pages] DB unavailable", err);
//     }

//     const dbScored = dbArticles.map((a: (typeof dbArticles)[number]) => {
//       const score = scorePageSEO({
//         title: a.metaTitle || a.title,
//         description: a.metaDescription || a.excerpt,
//         keywords: a.keywords,
//         content: a.content,
//         url: `${BASE_URL}/articles/${a.slug}`,
//         headings: [...a.content.matchAll(/^#{1,3}\s+(.+)$/gm)].map((m) => m[1]),
//         internalLinks: (a.content.match(/\]\(\/[a-z-]/g) ?? []).length,
//         externalLinks: (a.content.match(/\]\(https?:\/\//g) ?? []).length,
//         imageAltTexts: [...a.content.matchAll(/!\[([^\]]*)\]/g)].map((m) => m[1]),
//         schemaTypes: ["Article"],
//       });
//       const keywordAnalysis = analyzeKeywords(a.content, a.keywords);

//       return {
//         id: a.id,
//         slug: a.slug,
//         title: a.title,
//         category: a.category,
//         status: a.status,
//         source: "db" as const,
//         url: `/articles/${a.slug}`,
//         score,
//         keywordAnalysis,
//         lastIndexedAt: a.lastIndexedAt,
//         updatedAt: a.updatedAt,
//         editable: true,
//       };
//     });

//     const staticScored = staticArticles.map((a) => {
//       const content = articleContent[a.slug];
//       const fullText = content
//         ? [content.intro, content.sections?.map((s: { body: string }) => s.body).join(" "), content.tldr]
//             .filter(Boolean)
//             .join(" ")
//         : a.excerpt;

//       const score = scorePageSEO({
//         title: a.title,
//         description: a.excerpt,
//         keywords: a.keywords,
//         content: fullText,
//         url: `${BASE_URL}/articles/${a.slug}`,
//         headings: content?.sections?.map((s: { heading: string }) => s.heading) ?? [],
//         internalLinks: 3,
//         schemaTypes: ["Article", "MedicalBusiness"],
//       });
//       const keywordAnalysis = analyzeKeywords(fullText, a.keywords);

//       return {
//         id: a.slug,
//         slug: a.slug,
//         title: a.title,
//         category: a.category,
//         status: "published" as const,
//         source: "static" as const,
//         url: `/articles/${a.slug}`,
//         score,
//         keywordAnalysis,
//         lastIndexedAt: null,
//         updatedAt: null,
//         editable: false, // legacy hard-coded articles aren't edited from this dashboard
//       };
//     });

//     const allArticles = [...dbScored, ...staticScored].sort((a, b) => a.score.overallScore - b.score.overallScore);

//     const avgScore = allArticles.length
//       ? Math.round(allArticles.reduce((acc, r) => acc + r.score.overallScore, 0) / allArticles.length)
//       : 0;

//     return NextResponse.json({
//       success: true,
//       articles: allArticles,
//       staticPages: STATIC_PAGES.map((p) => ({ ...p, url: p.path })),
//       avgScore,
//       googleIndexingConfigured: isGoogleIndexingConfigured(),
//       baseUrl: BASE_URL,
//     });
//   } catch (err) {
//     console.error("[SEO pages GET]", err);
//     return NextResponse.json({ success: false, error: "Failed to load SEO data." }, { status: 500 });
//   }
// }

// export const GET = GET_HANDLER;

// app/api/admin/seo/pages/route.ts
// GET: everything the SEO dashboard needs in one call — every article
// (DB + legacy static) with a real SEO score (computed from actual content,
// unlike the old seo-report page which scored against empty content), plus
// the static marketing routes for indexing purposes.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { articles as staticArticles, articleContent } from "@/utilz/articles";
import { scorePageSEO } from "@/lib/seo-scoring-engine";
import { analyzeKeywords } from "@/lib/seo/keyword-analysis";
import { markdownToPlainText } from "@/lib/articles/markdown-to-sections";
import { isGoogleIndexingConfigured } from "@/lib/seo/google-indexing";

function requireAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("mentel_admin_session")?.value;
  return session === process.env.ADMIN_SESSION_SECRET;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.trymentel.com";

// Static marketing routes that aren't articles — listed for indexing/status
// purposes. Add/remove as the site's route map changes.
const STATIC_PAGES = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/services", label: "Services" },
  { path: "/contact", label: "Contact" },
  { path: "/assessment", label: "Assessment" },
  { path: "/book-call", label: "Book a Call" },
  { path: "/articles", label: "Articles" },
  { path: "/volunteer", label: "Volunteer" },
  { path: "/eap", label: "EAP" },
];

async function GET_HANDLER(req: Request) {
  const nextReq = req as NextRequest;
  if (!requireAdmin(nextReq))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    let dbArticles: Awaited<ReturnType<typeof db.article.findMany>> = [];
    try {
      dbArticles = await db.article.findMany({
        orderBy: { updatedAt: "desc" },
      });
    } catch (err) {
      console.error("[SEO pages] DB unavailable", err);
    }

    const dbScored = dbArticles.map((a: (typeof dbArticles)[number]) => {
      const plainText = markdownToPlainText(a.content);
      const score = scorePageSEO({
        title: a.metaTitle || a.title,
        description: a.metaDescription || a.excerpt,
        keywords: a.keywords,
        content: plainText,
        url: `${BASE_URL}/articles/${a.slug}`,
        headings: [...a.content.matchAll(/^#{1,3}\s+(.+)$/gm)].map((m) => m[1]),
        internalLinks: (a.content.match(/\]\(\/[a-z-]/g) ?? []).length,
        externalLinks: (a.content.match(/\]\(https?:\/\//g) ?? []).length,
        imageAltTexts: [...a.content.matchAll(/!\[([^\]]*)\]/g)].map(
          (m) => m[1],
        ),
        schemaTypes: ["Article"],
      });
      const keywordAnalysis = analyzeKeywords(plainText, a.keywords);

      return {
        id: a.id,
        slug: a.slug,
        title: a.title,
        category: a.category,
        status: a.status,
        source: "db" as const,
        url: `/articles/${a.slug}`,
        score,
        keywordAnalysis,
        lastIndexedAt: a.lastIndexedAt,
        updatedAt: a.updatedAt,
        editable: true,
      };
    });

    const staticScored = staticArticles.map((a) => {
      const content = articleContent[a.slug];
      const fullText = content
        ? [
            content.intro,
            content.sections?.map((s: { body: string }) => s.body).join(" "),
            content.tldr,
          ]
            .filter(Boolean)
            .join(" ")
        : a.excerpt;

      const score = scorePageSEO({
        title: a.title,
        description: a.excerpt,
        keywords: a.keywords,
        content: fullText,
        url: `${BASE_URL}/articles/${a.slug}`,
        headings:
          content?.sections?.map((s: { heading: string }) => s.heading) ?? [],
        internalLinks: 3,
        schemaTypes: ["Article", "MedicalBusiness"],
      });
      const keywordAnalysis = analyzeKeywords(fullText, a.keywords);

      return {
        id: a.slug,
        slug: a.slug,
        title: a.title,
        category: a.category,
        status: "published" as const,
        source: "static" as const,
        url: `/articles/${a.slug}`,
        score,
        keywordAnalysis,
        lastIndexedAt: null,
        updatedAt: null,
        editable: false, // legacy hard-coded articles aren't edited from this dashboard
      };
    });

    const allArticles = [...dbScored, ...staticScored].sort(
      (a, b) => a.score.overallScore - b.score.overallScore,
    );

    const avgScore = allArticles.length
      ? Math.round(
          allArticles.reduce((acc, r) => acc + r.score.overallScore, 0) /
            allArticles.length,
        )
      : 0;

    return NextResponse.json({
      success: true,
      articles: allArticles,
      staticPages: STATIC_PAGES.map((p) => ({ ...p, url: p.path })),
      avgScore,
      googleIndexingConfigured: isGoogleIndexingConfigured(),
      baseUrl: BASE_URL,
    });
  } catch (err) {
    console.error("[SEO pages GET]", err);
    return NextResponse.json(
      { success: false, error: "Failed to load SEO data." },
      { status: 500 },
    );
  }
}

export const GET = GET_HANDLER;
