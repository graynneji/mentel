// // app/api/admin/articles/[id]/route.ts
// // GET: fetch one article by id.
// // PATCH: update fields (partial).
// // DELETE: remove an article.

// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { withRateLimit } from "@/lib/withRateLimit";

// function requireAdmin(req: NextRequest): boolean {
//   const session = req.cookies.get("mentel_admin_session")?.value;
//   return session === process.env.ADMIN_SESSION_SECRET;
// }

// function slugify(input: string): string {
//   return input
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9\s-]/g, "")
//     .replace(/\s+/g, "-")
//     .replace(/-+/g, "-");
// }

// async function GET_HANDLER(req: Request, context: { params: Promise<{ id: string }> } | any) {
//   const nextReq = req as NextRequest;
//   if (!requireAdmin(nextReq)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   try {
//     const { id } = await context.params;
//     const article = await db.article.findUnique({ where: { id } });
//     if (!article) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
//     return NextResponse.json({ success: true, article });
//   } catch (err) {
//     console.error("[Admin Article GET]", err);
//     return NextResponse.json({ success: false, error: "Failed to load article." }, { status: 500 });
//   }
// }

// async function PATCH_HANDLER(req: Request, context: { params: Promise<{ id: string }> } | any) {
//   const nextReq = req as NextRequest;
//   if (!requireAdmin(nextReq)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   try {
//     const { id } = await context.params;
//     const body = await nextReq.json();
//     const existing = await db.article.findUnique({ where: { id } });
//     if (!existing) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

//     const data: Record<string, unknown> = {};

//     if (typeof body.title === "string") data.title = body.title.trim();
//     if (typeof body.excerpt === "string") data.excerpt = body.excerpt.trim();
//     if (typeof body.category === "string") data.category = body.category.trim();
//     if (typeof body.content === "string") data.content = body.content;
//     if (Array.isArray(body.tags)) data.tags = body.tags.filter((t: unknown) => typeof t === "string");
//     if (Array.isArray(body.keywords)) data.keywords = body.keywords.filter((k: unknown) => typeof k === "string");
//     if (typeof body.image === "string" || body.image === null) data.image = body.image;
//     if (Number.isFinite(body.readMin)) data.readMin = Math.max(1, Math.round(body.readMin));
//     if (typeof body.featured === "boolean") data.featured = body.featured;
//     if (typeof body.metaTitle === "string" || body.metaTitle === null) data.metaTitle = body.metaTitle;
//     if (typeof body.metaDescription === "string" || body.metaDescription === null) data.metaDescription = body.metaDescription;
//     if (Number.isFinite(body.seoScore)) data.seoScore = body.seoScore;
//     if (body.seoScore !== undefined) data.seoLastChecked = new Date();
//     if (body.lastIndexedAt === "now") data.lastIndexedAt = new Date();

//     if (typeof body.slug === "string" && body.slug.trim() && slugify(body.slug) !== existing.slug) {
//       const newSlug = slugify(body.slug);
//       const clash = await db.article.findUnique({ where: { slug: newSlug } });
//       if (clash && clash.id !== id) {
//         return NextResponse.json({ success: false, errors: { slug: "That slug is already taken." } }, { status: 400 });
//       }
//       data.slug = newSlug;
//     }

//     if (typeof body.status === "string" && ["draft", "published"].includes(body.status)) {
//       data.status = body.status;
//       if (body.status === "published" && !existing.publishedAt) data.publishedAt = new Date();
//       if (body.status === "draft") data.publishedAt = null;
//     }

//     const article = await db.article.update({ where: { id }, data });
//     return NextResponse.json({ success: true, article });
//   } catch (err) {
//     console.error("[Admin Article PATCH]", err);
//     return NextResponse.json({ success: false, error: "Failed to update article." }, { status: 500 });
//   }
// }

// async function DELETE_HANDLER(req: Request, context: { params: Promise<{ id: string }> } | any) {
//   const nextReq = req as NextRequest;
//   if (!requireAdmin(nextReq)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   try {
//     const { id } = await context.params;
//     await db.article.delete({ where: { id } });
//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error("[Admin Article DELETE]", err);
//     return NextResponse.json({ success: false, error: "Failed to delete article." }, { status: 500 });
//   }
// }

// export const GET = withRateLimit(GET_HANDLER);
// export const PATCH = withRateLimit(PATCH_HANDLER);
// export const DELETE = withRateLimit(DELETE_HANDLER);

// app/api/admin/articles/[id]/route.ts
// GET: fetch one article by id.
// PATCH: update fields (partial).
// DELETE: remove an article.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withRateLimit } from "@/lib/withRateLimit";

function requireAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("mentel_admin_session")?.value;
  return session === process.env.ADMIN_SESSION_SECRET;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

type RouteContext = Record<string, unknown>;
type ParamsContext = { params: { id: string } };

async function GET_HANDLER(req: Request, context: RouteContext) {
  const nextReq = req as NextRequest;
  if (!requireAdmin(nextReq))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await (context as ParamsContext).params;
    const article = await db.article.findUnique({ where: { id } });
    if (!article)
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 },
      );
    return NextResponse.json({ success: true, article });
  } catch (err) {
    console.error("[Admin Article GET]", err);
    return NextResponse.json(
      { success: false, error: "Failed to load article." },
      { status: 500 },
    );
  }
}

async function PATCH_HANDLER(req: Request, context: RouteContext) {
  const nextReq = req as NextRequest;
  if (!requireAdmin(nextReq))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await (context as ParamsContext).params;
    const body = await nextReq.json();
    const existing = await db.article.findUnique({ where: { id } });
    if (!existing)
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 },
      );

    const data: Record<string, unknown> = {};

    if (typeof body.title === "string") data.title = body.title.trim();
    if (typeof body.excerpt === "string") data.excerpt = body.excerpt.trim();
    if (typeof body.category === "string") data.category = body.category.trim();
    if (typeof body.content === "string") data.content = body.content;
    if (Array.isArray(body.tags))
      data.tags = body.tags.filter((t: unknown) => typeof t === "string");
    if (Array.isArray(body.keywords))
      data.keywords = body.keywords.filter(
        (k: unknown) => typeof k === "string",
      );
    if (typeof body.image === "string" || body.image === null)
      data.image = body.image;
    if (typeof body.tldr === "string" || body.tldr === null)
      data.tldr = body.tldr;
    if (Number.isFinite(body.readMin))
      data.readMin = Math.max(1, Math.round(body.readMin));
    if (typeof body.featured === "boolean") data.featured = body.featured;
    if (typeof body.metaTitle === "string" || body.metaTitle === null)
      data.metaTitle = body.metaTitle;
    if (
      typeof body.metaDescription === "string" ||
      body.metaDescription === null
    )
      data.metaDescription = body.metaDescription;
    if (Number.isFinite(body.seoScore)) data.seoScore = body.seoScore;
    if (body.seoScore !== undefined) data.seoLastChecked = new Date();
    if (body.lastIndexedAt === "now") data.lastIndexedAt = new Date();

    if (
      typeof body.slug === "string" &&
      body.slug.trim() &&
      slugify(body.slug) !== existing.slug
    ) {
      const newSlug = slugify(body.slug);
      const clash = await db.article.findUnique({ where: { slug: newSlug } });
      if (clash && clash.id !== id) {
        return NextResponse.json(
          { success: false, errors: { slug: "That slug is already taken." } },
          { status: 400 },
        );
      }
      data.slug = newSlug;
    }

    if (
      typeof body.status === "string" &&
      ["draft", "published"].includes(body.status)
    ) {
      data.status = body.status;
      if (body.status === "published" && !existing.publishedAt)
        data.publishedAt = new Date();
      if (body.status === "draft") data.publishedAt = null;
    }

    const article = await db.article.update({ where: { id }, data });
    return NextResponse.json({ success: true, article });
  } catch (err) {
    console.error("[Admin Article PATCH]", err);
    return NextResponse.json(
      { success: false, error: "Failed to update article." },
      { status: 500 },
    );
  }
}

async function DELETE_HANDLER(req: Request, context: RouteContext) {
  const nextReq = req as NextRequest;
  if (!requireAdmin(nextReq))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await (context as ParamsContext).params;
    await db.article.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Admin Article DELETE]", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete article." },
      { status: 500 },
    );
  }
}

export const GET = withRateLimit(GET_HANDLER);
export const PATCH = withRateLimit(PATCH_HANDLER);
export const DELETE = withRateLimit(DELETE_HANDLER);
