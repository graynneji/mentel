// // app/sitemap.ts
// import type { MetadataRoute } from "next";
// import { articles as staticArticles } from "@/utilz/articles";
// import { db } from "@/lib/db";

// // Refresh hourly rather than only at build time, so newly published CMS
// // articles (and edits to existing ones) show up in the sitemap without
// // waiting for a redeploy.
// export const revalidate = 3600;

// export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
//   const staticArticleEntries: MetadataRoute.Sitemap = staticArticles.map(
//     (article) => ({
//       url: `https://www.trymentel.com/articles/${article.slug}`,
//       changeFrequency: "monthly",
//       priority: article.featured ? 0.8 : 0.6,
//       lastModified: new Date(article.date),
//     }),
//   );

//   let dbArticleEntries: MetadataRoute.Sitemap = [];
//   try {
//     const dbArticles = await db.article.findMany({
//       where: { status: "published" },
//       select: {
//         slug: true,
//         featured: true,
//         publishedAt: true,
//         updatedAt: true,
//       },
//     });
//     dbArticleEntries = dbArticles.map((a: (typeof dbArticles)[number]) => ({
//       url: `https://www.trymentel.com/articles/${a.slug}`,
//       changeFrequency: "monthly",
//       priority: a.featured ? 0.8 : 0.6,
//       lastModified: a.updatedAt ?? a.publishedAt ?? new Date(),
//     }));
//   } catch (err) {
//     // Degrade to static-only rather than breaking the whole sitemap if the
//     // DB is briefly unavailable or migrations haven't run yet.
//     console.error("[sitemap] DB unavailable, omitting CMS articles", err);
//   }

//   return [
//     {
//       url: "https://www.trymentel.com",
//       lastModified: new Date(),
//       changeFrequency: "weekly",
//       priority: 1.0,
//     },
//     {
//       url: "https://www.trymentel.com/assessment",
//       lastModified: new Date(),
//       changeFrequency: "weekly",
//       priority: 0.9,
//     },
//     {
//       url: "https://www.trymentel.com/book",
//       lastModified: new Date(),
//       changeFrequency: "weekly",
//       priority: 0.9,
//     },
//     {
//       url: "https://www.trymentel.com/articles",
//       lastModified: new Date(),
//       changeFrequency: "weekly",
//       priority: 0.8,
//     },
//     {
//       url: "https://www.trymentel.com/services",
//       lastModified: new Date(),
//       changeFrequency: "monthly",
//       priority: 0.7,
//     },
//     {
//       url: "https://www.trymentel.com/volunteer",
//       lastModified: new Date(),
//       changeFrequency: "monthly",
//       priority: 0.6,
//     },
//     {
//       url: "https://www.trymentel.com/about",
//       lastModified: new Date(),
//       changeFrequency: "monthly",
//       priority: 0.6,
//     },
//     {
//       url: "https://www.trymentel.com/contact",
//       lastModified: new Date(),
//       changeFrequency: "monthly",
//       priority: 0.6,
//     },
//     {
//       url: "https://www.trymentel.com/privacy",
//       lastModified: new Date("2026-01-01"),
//       changeFrequency: "yearly",
//       priority: 0.3,
//     },
//     {
//       url: "https://www.trymentel.com/terms",
//       lastModified: new Date("2026-01-01"),
//       changeFrequency: "yearly",
//       priority: 0.3,
//     },
//     ...staticArticleEntries,
//     ...dbArticleEntries,
//   ];
// }

// app/sitemap.ts
import type { MetadataRoute } from "next";
import { articles as staticArticles } from "@/utilz/articles";
import { db } from "@/lib/db";
import { services } from "@/lib/services-data";

// Refresh hourly rather than only at build time, so newly published CMS
// articles (and edits to existing ones) show up in the sitemap without
// waiting for a redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticArticleEntries: MetadataRoute.Sitemap = staticArticles.map(
    (article) => ({
      url: `https://www.trymentel.com/articles/${article.slug}`,
      changeFrequency: "monthly",
      priority: article.featured ? 0.8 : 0.6,
      lastModified: new Date(article.date),
    }),
  );

  const serviceEntries: MetadataRoute.Sitemap = services.map((service) => ({
    url: `https://www.trymentel.com/services/${service.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: new Date(),
  }));

  let dbArticleEntries: MetadataRoute.Sitemap = [];
  try {
    const dbArticles = await db.article.findMany({
      where: { status: "published" },
      select: {
        slug: true,
        featured: true,
        publishedAt: true,
        updatedAt: true,
      },
    });
    dbArticleEntries = dbArticles.map((a: (typeof dbArticles)[number]) => ({
      url: `https://www.trymentel.com/articles/${a.slug}`,
      changeFrequency: "monthly",
      priority: a.featured ? 0.8 : 0.6,
      lastModified: a.updatedAt ?? a.publishedAt ?? new Date(),
    }));
  } catch (err) {
    // Degrade to static-only rather than breaking the whole sitemap if the
    // DB is briefly unavailable or migrations haven't run yet.
    console.error("[sitemap] DB unavailable, omitting CMS articles", err);
  }

  return [
    {
      url: "https://www.trymentel.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.trymentel.com/assessment",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://www.trymentel.com/adhd-assessment",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://www.trymentel.com/book",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://www.trymentel.com/eap",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://www.trymentel.com/articles",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://www.trymentel.com/services",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...serviceEntries,
    {
      url: "https://www.trymentel.com/volunteer",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://www.trymentel.com/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://www.trymentel.com/contact",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://www.trymentel.com/privacy",
      lastModified: new Date("2026-01-01"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://www.trymentel.com/terms",
      lastModified: new Date("2026-01-01"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...staticArticleEntries,
    ...dbArticleEntries,
  ];
}
