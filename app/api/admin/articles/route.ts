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

// async function GET_HANDLER(req: Request) {
//   const nextReq = req as NextRequest;
//   if (!requireAdmin(nextReq))
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   try {
//     const { searchParams } = new URL(nextReq.url);
//     const status = searchParams.get("status");
//     const search = searchParams.get("search");

//     const articles = await db.article.findMany({
//       where: {
//         ...(status && status !== "all" ? { status } : {}),
//         ...(search
//           ? {
//               OR: [
//                 { title: { contains: search, mode: "insensitive" as const } },
//                 { slug: { contains: search, mode: "insensitive" as const } },
//               ],
//             }
//           : {}),
//       },
//       orderBy: { updatedAt: "desc" },
//     });

//     return NextResponse.json({ success: true, articles });
//   } catch (err) {
//     console.error("[Admin Articles GET]", err);
//     return NextResponse.json(
//       { success: false, error: "Failed to load articles." },
//       { status: 500 },
//     );
//   }
// }

// async function POST_HANDLER(req: Request) {
//   const nextReq = req as NextRequest;
//   if (!requireAdmin(nextReq))
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   try {
//     const body = await nextReq.json();
//     const title = String(body.title ?? "").trim();
//     const content = String(body.content ?? "").trim();

//     if (!title || title.length < 3) {
//       return NextResponse.json(
//         { success: false, errors: { title: "Title is required." } },
//         { status: 400 },
//       );
//     }
//     if (!content || content.length < 20) {
//       return NextResponse.json(
//         { success: false, errors: { content: "Content is required." } },
//         { status: 400 },
//       );
//     }

//     const slugInput = String(body.slug ?? "").trim() || title;
//     const slug = slugify(slugInput);

//     const existing = await db.article.findUnique({ where: { slug } });
//     if (existing) {
//       return NextResponse.json(
//         {
//           success: false,
//           errors: { slug: "An article with this slug already exists." },
//         },
//         { status: 400 },
//       );
//     }

//     const status = body.status === "published" ? "published" : "draft";

//     const article = await db.article.create({
//       data: {
//         slug,
//         title,
//         excerpt: String(body.excerpt ?? "").trim() || content.slice(0, 160),
//         category: String(body.category ?? "General").trim(),
//         tags: Array.isArray(body.tags)
//           ? body.tags.filter((t: unknown) => typeof t === "string")
//           : [],
//         keywords: Array.isArray(body.keywords)
//           ? body.keywords.filter((k: unknown) => typeof k === "string")
//           : [],
//         image: body.image ? String(body.image).trim() : null,
//         tldr: body.tldr ? String(body.tldr).trim() : null,
//         readMin: Number.isFinite(body.readMin)
//           ? Math.max(1, Math.round(body.readMin))
//           : Math.max(1, Math.round(content.split(/\s+/).length / 200)),
//         featured: !!body.featured,
//         content,
//         metaTitle: body.metaTitle ? String(body.metaTitle).trim() : null,
//         metaDescription: body.metaDescription
//           ? String(body.metaDescription).trim()
//           : null,
//         status,
//         publishedAt: status === "published" ? new Date() : null,
//       },
//     });

//     return NextResponse.json({ success: true, article });
//   } catch (err) {
//     console.error("[Admin Articles POST]", err);
//     return NextResponse.json(
//       { success: false, error: "Failed to create article." },
//       { status: 500 },
//     );
//   }
// }

// export const GET = withRateLimit(GET_HANDLER);
// export const POST = withRateLimit(POST_HANDLER);

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withRateLimit } from "@/lib/withRateLimit";
import { sanitizeFaq } from "@/lib/articles/faq";
import { Prisma } from "@/generated/prisma/client";

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

async function GET_HANDLER(req: Request) {
  const nextReq = req as NextRequest;
  if (!requireAdmin(nextReq))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(nextReq.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const articles = await db.article.findMany({
      where: {
        ...(status && status !== "all" ? { status } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" as const } },
                { slug: { contains: search, mode: "insensitive" as const } },
              ],
            }
          : {}),
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ success: true, articles });
  } catch (err) {
    console.error("[Admin Articles GET]", err);
    return NextResponse.json(
      { success: false, error: "Failed to load articles." },
      { status: 500 },
    );
  }
}

async function POST_HANDLER(req: Request) {
  const nextReq = req as NextRequest;
  if (!requireAdmin(nextReq))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await nextReq.json();
    const title = String(body.title ?? "").trim();
    const content = String(body.content ?? "").trim();

    if (!title || title.length < 3) {
      return NextResponse.json(
        { success: false, errors: { title: "Title is required." } },
        { status: 400 },
      );
    }
    if (!content || content.length < 20) {
      return NextResponse.json(
        { success: false, errors: { content: "Content is required." } },
        { status: 400 },
      );
    }

    const slugInput = String(body.slug ?? "").trim() || title;
    const slug = slugify(slugInput);

    const existing = await db.article.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          errors: { slug: "An article with this slug already exists." },
        },
        { status: 400 },
      );
    }

    const status = body.status === "published" ? "published" : "draft";

    const article = await db.article.create({
      data: {
        slug,
        title,
        excerpt: String(body.excerpt ?? "").trim() || content.slice(0, 160),
        category: String(body.category ?? "General").trim(),
        tags: Array.isArray(body.tags)
          ? body.tags.filter((t: unknown) => typeof t === "string")
          : [],
        keywords: Array.isArray(body.keywords)
          ? body.keywords.filter((k: unknown) => typeof k === "string")
          : [],
        image: body.image ? String(body.image).trim() : null,
        // tldr: body.tldr ? String(body.tldr).trim() : null,
        // faq: sanitizeFaq(body.faq),
        tldr: body.tldr ? String(body.tldr).trim() : null,
        faq: sanitizeFaq(body.faq) as unknown as Prisma.InputJsonValue,
        readMin: Number.isFinite(body.readMin)
          ? Math.max(1, Math.round(body.readMin))
          : Math.max(1, Math.round(content.split(/\s+/).length / 200)),
        featured: !!body.featured,
        content,
        metaTitle: body.metaTitle ? String(body.metaTitle).trim() : null,
        metaDescription: body.metaDescription
          ? String(body.metaDescription).trim()
          : null,
        status,
        publishedAt: status === "published" ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true, article });
  } catch (err) {
    console.error("[Admin Articles POST]", err);
    return NextResponse.json(
      { success: false, error: "Failed to create article." },
      { status: 500 },
    );
  }
}

export const GET = withRateLimit(GET_HANDLER);
export const POST = withRateLimit(POST_HANDLER);
