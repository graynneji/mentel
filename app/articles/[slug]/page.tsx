

// // app/articles/[slug]/page.tsx
// import type { ReactNode } from "react";
// import Link from "next/link";
// import { notFound } from "next/navigation";
// import { ArrowLeft, ArrowRight, Clock, Leaf, Share2 } from "lucide-react";
// import { articleContent, articles } from "@/utilz/articles";
// import { getAllPublishedArticles, getPublishedDbArticleBySlug } from "@/lib/articles/data";
// import { markdownToSections } from "@/lib/articles/markdown-to-sections";
// import { ArticleCover, getCategoryStyle } from "../../../components/ArticleVisuals";
// import { ArticleCard } from "../../../components/ArticleCard";

// // Re-fetch on every request rather than caching indefinitely — CMS
// // articles are published dynamically and should show up immediately,
// // not only after the next full rebuild/deploy.
// export const dynamic = "force-dynamic";

// // Body/intro/list text is stored as plain strings (matching the original
// // hard-coded article shape), but authors can still insert links to other
// // articles via the editor's "Insert article link" picker — those arrive
// // as literal `[text](url)` Markdown syntax. This renders that piece as a
// // real clickable link while leaving everything else as plain text, so
// // the visual output stays identical to the legacy articles except where
// // a link was deliberately added.
// function renderInlineText(text: string): ReactNode {
//     const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
//     const nodes: ReactNode[] = [];
//     let lastIndex = 0;
//     let match: RegExpExecArray | null;
//     let key = 0;

//     while ((match = linkPattern.exec(text)) !== null) {
//         if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
//         const [, label, href] = match;
//         const isInternal = href.startsWith("/");
//         nodes.push(
//             isInternal ? (
//                 <Link key={key++} href={href} className="underline underline-offset-2 hover:opacity-80" style={{ color: "var(--teal)" }}>
//                     {label}
//                 </Link>
//             ) : (
//                 <a
//                     key={key++}
//                     href={href}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="underline underline-offset-2 hover:opacity-80"
//                     style={{ color: "var(--teal)" }}
//                 >
//                     {label}
//                 </a>
//             )
//         );
//         lastIndex = match.index + match[0].length;
//     }
//     if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
//     return nodes.length > 0 ? nodes : text;
// }

// export async function generateStaticParams() {
//     // Static params for the legacy hard-coded articles only — DB-authored
//     // articles are rendered on-demand.
//     return articles.map((a) => ({ slug: a.slug }));
// }

// export async function generateMetadata({ params }: { params: { slug: string } }) {
//     const param = await params;
//     const article = articles.find((a) => a.slug === param.slug);

//     if (!article) {
//         const dbArticle = await getPublishedDbArticleBySlug(param.slug);
//         if (!dbArticle) return {};
//         return {
//             title: dbArticle.metaTitle || `${dbArticle.title} - Mentel`,
//             description: dbArticle.metaDescription || dbArticle.excerpt,
//             keywords: dbArticle.keywords?.join(", "),
//             alternates: { canonical: `/articles/${dbArticle.slug}` },
//             openGraph: {
//                 title: dbArticle.metaTitle || `${dbArticle.title} - Mentel`,
//                 description: dbArticle.metaDescription || dbArticle.excerpt,
//                 url: `https://www.trymentel.com/articles/${dbArticle.slug}`,
//                 type: "article",
//                 publishedTime: (dbArticle.publishedAt ?? dbArticle.createdAt).toISOString(),
//                 authors: ["Mentel Clinical Team"],
//                 tags: dbArticle.tags,
//                 images: dbArticle.image
//                     ? [{ url: `https://www.trymentel.com${dbArticle.image}`, width: 1200, height: 630, alt: dbArticle.title }]
//                     : undefined,
//             },
//             twitter: {
//                 card: "summary_large_image",
//                 title: dbArticle.metaTitle || `${dbArticle.title} - Mentel`,
//                 description: dbArticle.metaDescription || dbArticle.excerpt,
//             },
//         };
//     }

//     return {
//         title: `${article.title} - Mentel`,
//         description: article.excerpt,
//         keywords: article.keywords?.join(", "),
//         alternates: {
//             canonical: `/articles/${article.slug}`,
//         },
//         openGraph: {
//             title: `${article.title} - Mentel`,
//             description: article.excerpt,
//             url: `https://www.trymentel.com/articles/${article.slug}`,
//             type: "article",
//             publishedTime: article.date,
//             authors: ["Mentel Clinical Team"],
//             tags: article.tags,
//             images: [
//                 {
//                     url: `https://www.trymentel.com${article.image}`,
//                     width: 1200,
//                     height: 630,
//                     alt: article.title,
//                 },
//             ],
//         },
//         twitter: {
//             card: "summary_large_image",
//             title: `${article.title} - Mentel`,
//             description: article.excerpt,
//             images: [`https://www.trymentel.com${article.image}`],
//         },
//     };
// }


// export default async function ArticlePage({ params }: { params: { slug: string } }) {
//     const param = await params;
//     const staticArticle = articles.find((a) => a.slug === param.slug);

//     // ── Normalize both sources into one shared shape ────────────────────────
//     // article: { slug, title, category, excerpt, date, readMin, image, tags }
//     // content: { intro, sections: [{ heading, body, list? }], tldr?, faq? }
//     // Whichever source it came from, everything below renders identically —
//     // there is no separate "database article" layout.
//     let article: {
//         slug: string;
//         title: string;
//         category: string;
//         excerpt: string;
//         date: string;
//         readMin: number;
//         image: string | null;
//         tags: string[];
//         keywords: string[];
//     };
//     let content: {
//         intro: string;
//         sections: { heading: string; body: string; list?: { label?: string; value: string }[] }[];
//         tldr?: string;
//         faq?: { q: string; a: string }[];
//     } | undefined;

//     if (staticArticle) {
//         article = staticArticle;
//         content = articleContent[staticArticle.slug];
//     } else {
//         const dbArticle = await getPublishedDbArticleBySlug(param.slug);
//         if (!dbArticle) notFound();

//         article = {
//             slug: dbArticle.slug,
//             title: dbArticle.title,
//             category: dbArticle.category,
//             excerpt: dbArticle.excerpt,
//             date: (dbArticle.publishedAt ?? dbArticle.createdAt).toISOString(),
//             readMin: dbArticle.readMin,
//             image: dbArticle.image,
//             tags: dbArticle.tags,
//             keywords: dbArticle.keywords,
//         };
//         content = markdownToSections(dbArticle.content);
//         const tldr = (dbArticle as { tldr?: string }).tldr;
//         if (tldr) content.tldr = tldr;
//     }

//     const allArticles = staticArticle ? null : await getAllPublishedArticles();
//     const articleIndex = articles.findIndex((a) => a.slug === param.slug);
//     const prev = staticArticle ? (articles[articleIndex - 1] ?? null) : null;
//     const next = staticArticle ? (articles[articleIndex + 1] ?? null) : null;

//     // Related: same category, excluding current article, max 3
//     const related = staticArticle
//         ? articles.filter((a) => a.slug !== article.slug && a.category === article.category).slice(0, 3)
//         : (allArticles ?? []).filter((a) => a.slug !== article.slug && a.category === article.category).slice(0, 3);

//     const style = getCategoryStyle(article.category);

//     /* ...articleSchema, seoScore, faqSchema unchanged... */

//     return (
//         <>
//             {/* JSON-LD scripts unchanged */}

//             <div className="relative overflow-x-hidden">
//                 {/* Back nav */}
//                 <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">
//                     <Link
//                         href="/articles"
//                         className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--teal)]"
//                         style={{ color: "var(--text-muted)" }}
//                     >
//                         <ArrowLeft size={14} />
//                         All Articles
//                     </Link>
//                 </div>

//                 <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:pb-20">
//                     <header className="mb-8">
//                         <div className="flex items-center gap-2 mb-4">
//                             <span
//                                 className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
//                                 style={{ background: "rgba(123,169,139,0.12)", color: "var(--sage-dark)" }}
//                             >
//                                 <Leaf size={9} />
//                                 {article.category}
//                             </span>
//                         </div>

//                         <h1
//                             className="font-cormorant text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight mb-5"
//                             style={{ color: "var(--deep)", letterSpacing: "-0.02em" }}
//                         >
//                             {article.title}
//                         </h1>

//                         <p className="text-base sm:text-lg font-normal leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>
//                             {article.excerpt}
//                         </p>

//                         <div className="flex items-center justify-between pb-6 border-b" style={{ borderColor: "var(--border)" }}>
//                             <div className="flex items-center gap-4">
//                                 <div
//                                     className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-white"
//                                     style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
//                                 >
//                                     M
//                                 </div>
//                                 <div>
//                                     <p className="text-sm font-medium" style={{ color: "var(--deep)" }}>
//                                         Mentel Clinical Team
//                                     </p>
//                                     <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
//                                         <span>
//                                             {new Date(article.date).toLocaleDateString("en-NG", {
//                                                 day: "numeric",
//                                                 month: "long",
//                                                 year: "numeric",
//                                             })}
//                                         </span>
//                                         <span>·</span>
//                                         <span className="flex items-center gap-1">
//                                             <Clock size={11} />
//                                             {article.readMin} min read
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>
//                             <button
//                                 className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all hover:shadow-sm"
//                                 style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
//                             >
//                                 <Share2 size={12} />
//                                 Share
//                             </button>
//                         </div>
//                     </header>

//                     {/* ── Hero cover image ── */}
//                     <div className="relative w-full aspect-[16/9] sm:aspect-[16/7] rounded-2xl overflow-hidden mb-10">
//                         <ArticleCover image={article.image} category={article.category} title={article.title} iconSize={160} />
//                     </div>

//                     {/* TL;DR box */}
//                     {content?.tldr && (
//                         <div
//                             className="mb-10 rounded-xl p-5 border"
//                             style={{
//                                 background: "rgba(123,169,139,0.06)",
//                                 border: "1px solid rgba(123,169,139,0.2)",
//                                 borderLeft: "4px solid var(--sage)",
//                             }}
//                         >
//                             <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "var(--sage-dark)" }}>
//                                 TL;DR — Key takeaways
//                             </p>
//                             <p className="text-sm leading-relaxed font-normal" style={{ color: "var(--text)" }}>
//                                 {content.tldr}
//                             </p>

//                         </div>
//                     )}

//                     {content && content.sections.length >= 5 && (
//                         <nav className="mb-10 rounded-xl p-5 border" style={{ borderColor: "var(--border)", background: "white" }} aria-label="Table of contents">
//                             <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--sage-dark)" }}>
//                                 In this article
//                             </p>
//                             <ol className="space-y-2">
//                                 {content.sections.map((section, i) => (
//                                     <li key={i}>
//                                         <Link
//                                             href={`#section-${i}`}
//                                             className="text-sm hover:text-[var(--teal)] transition-colors"
//                                             style={{ color: "var(--text-muted)" }}
//                                         >
//                                             {i + 1}. {section.heading}
//                                         </Link>
//                                     </li>
//                                 ))}
//                             </ol>
//                         </nav>
//                     )}

//                     {/* Article body — unchanged */}
//                     {content && (
//                         <div className="prose-mentel">
//                             <p
//                                 className="text-base sm:text-lg leading-relaxed font-normal mb-10"
//                                 style={{ color: "var(--text)", lineHeight: "1.85" }}
//                             >
//                                 {renderInlineText(content.intro)}
//                             </p>
//                             <div className="space-y-10">
//                                 {content.sections.map((section, i) => (
//                                     <section key={i} id={`section-${i}`}>
//                                         <h2
//                                             className={`font-cormorant  font-semibold mb-3 scroll-mt-24 ${i === 0 ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"}`}
//                                             style={{ color: "var(--deep)" }}
//                                         >
//                                             {section.heading}
//                                         </h2>
//                                         <p
//                                             className="text-sm sm:text-base leading-relaxed font-normal"
//                                             style={{ color: "var(--text)", lineHeight: "1.85" }}
//                                         >
//                                             {renderInlineText(section.body)}
//                                         </p>
//                                         {section.list && (
//                                             <ul className="mt-4 space-y-2">
//                                                 {section.list.map((item, j) => (
//                                                     <li key={j} className="flex gap-3 text-sm sm:text-base" style={{ color: "var(--text)" }}>
//                                                         <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--sage)" }} />
//                                                         <span>
//                                                             {item.label && <strong style={{ color: "var(--deep)" }}>{item.label}: </strong>}
//                                                             {renderInlineText(item.value)}
//                                                         </span>
//                                                     </li>
//                                                 ))}
//                                             </ul>
//                                         )}
//                                     </section>
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     {/* Tags — unchanged */}
//                     <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t" style={{ borderColor: "var(--border)" }}>
//                         {article.tags.map((tag) => (
//                             <span
//                                 key={tag}
//                                 className="text-xs px-2.5 py-1 rounded-full border"
//                                 style={{ borderColor: "rgba(123,169,139,0.3)", color: "var(--sage-dark)", background: "rgba(123,169,139,0.07)" }}
//                             >
//                                 {tag}
//                             </span>
//                         ))}
//                     </div>

//                     {/* FAQ — unchanged */}
//                     {content?.faq && content.faq.length > 0 && (
//                         <div className="mt-12 pt-8 border-t" style={{ borderColor: "var(--border)" }}>
//                             <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--sage-dark)" }}>
//                                 Quick answers
//                             </p>
//                             <h2 className="font-cormorant text-2xl sm:text-3xl font-normal mb-6" style={{ color: "var(--deep)" }}>
//                                 Frequently asked questions
//                             </h2>
//                             <div className="space-y-4">
//                                 {content.faq.map(({ q, a }) => (
//                                     <div key={q} className="rounded-xl p-5 border" style={{ borderColor: "var(--border)", background: "white" }}>
//                                         <p className="text-sm font-semibold mb-2" style={{ color: "var(--deep)" }}>{q}</p>
//                                         <p className="text-sm font-normal leading-relaxed" style={{ color: "var(--text-muted)" }}>{a}</p>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     {/* CTA box — unchanged */}
//                     <div
//                         className="mt-12 rounded-2xl p-6 sm:p-8"
//                         style={{ background: "rgba(123,169,139,0.06)", border: "1px solid rgba(123,169,139,0.2)", borderLeft: "4px solid var(--sage)" }}
//                     >
//                         <p className="font-cormorant text-xl sm:text-2xl font-normal mb-2" style={{ color: "var(--deep)" }}>
//                             Ready to take the first step?
//                         </p>
//                         <p className="text-sm font-normal mb-5" style={{ color: "var(--text-muted)" }}>
//                             Book a session with a licensed therapist from ₦8,500. No commitment. Fully confidential.
//                         </p>
//                         <div className="flex flex-wrap gap-3">
//                             <Link
//                                 href="/book"
//                                 className="inline-flex items-center gap-2 text-sm font-medium text-white px-5 py-2.5 rounded-full"
//                                 style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
//                             >
//                                 Book a Session
//                                 <ArrowRight size={14} />
//                             </Link>
//                             <Link
//                                 href="/assessment"
//                                 className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full border"
//                                 style={{ borderColor: "var(--border)", color: "var(--sage-dark)" }}
//                             >
//                                 Free Assessment
//                             </Link>
//                         </div>
//                     </div>

//                     {/* ── Related articles ── */}
//                     {related.length > 0 && (
//                         <div className="mt-12 pt-8 border-t" style={{ borderColor: "var(--border)" }}>
//                             <p className="text-xs font-medium uppercase tracking-widest mb-6" style={{ color: style.accent }}>
//                                 More on {article.category}
//                             </p>
//                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//                                 {related.map((a) => (
//                                     <ArticleCard key={a.slug} article={a} />
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     {/* Prev / Next — unchanged */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 pt-8 border-t" style={{ borderColor: "var(--border)" }}>
//                         {prev ? (
//                             <Link href={`/articles/${prev.slug}`} className="group rounded-2xl p-5 border hover:-translate-y-0.5 hover:shadow-md transition-all duration-200" style={{ background: "white", borderColor: "var(--border)" }}>
//                                 <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>← Previous</p>
//                                 <p className="text-sm font-medium line-clamp-2 group-hover:text-[var(--teal)] transition-colors" style={{ color: "var(--deep)" }}>{prev.title}</p>
//                             </Link>
//                         ) : <div />}
//                         {next && (
//                             <Link href={`/articles/${next.slug}`} className="group rounded-2xl p-5 border hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 text-right sm:col-start-2" style={{ background: "white", borderColor: "var(--border)" }}>
//                                 <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Next →</p>
//                                 <p className="text-sm font-medium line-clamp-2 group-hover:text-[var(--teal)] transition-colors" style={{ color: "var(--deep)" }}>{next.title}</p>
//                             </Link>
//                         )}
//                     </div>
//                 </article>
//             </div>
//         </>
//     );
// }




// app/articles/[slug]/page.tsx
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Leaf, Share2 } from "lucide-react";
import { articleContent, articles } from "@/utilz/articles";
import { getAllPublishedArticles, getPublishedDbArticleBySlug } from "@/lib/articles/data";
import { markdownToSections } from "@/lib/articles/markdown-to-sections";
import { ArticleCover, getCategoryStyle } from "../../../components/ArticleVisuals";
import { ArticleCard } from "../../../components/ArticleCard";
import { AdhdTestBanner } from "@/components/AdhdTestBanner";

// Re-fetch on every request rather than caching indefinitely — CMS
// articles are published dynamically and should show up immediately,
// not only after the next full rebuild/deploy.
export const dynamic = "force-dynamic";

// Body/intro/list text is stored as plain strings (matching the original
// hard-coded article shape), but authors can still insert links to other
// articles via the editor's "Insert article link" picker — those arrive
// as literal `[text](url)` Markdown syntax. This renders that piece as a
// real clickable link while leaving everything else as plain text, so
// the visual output stays identical to the legacy articles except where
// a link was deliberately added.
function renderInlineText(text: string): ReactNode {
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    const nodes: ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let key = 0;

    while ((match = linkPattern.exec(text)) !== null) {
        if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
        const [, label, href] = match;
        const isInternal = href.startsWith("/");
        nodes.push(
            isInternal ? (
                <Link key={key++} href={href} className="underline underline-offset-2 hover:opacity-80" style={{ color: "var(--teal)" }}>
                    {label}
                </Link>
            ) : (
                <Link
                    key={key++}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:opacity-80"
                    style={{ color: "var(--teal)" }}
                >
                    {label}
                </Link>
            )
        );
        lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
    return nodes.length > 0 ? nodes : text;
}

export async function generateStaticParams() {
    // Static params for the legacy hard-coded articles only — DB-authored
    // articles are rendered on-demand.
    return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const param = await params;
    const article = articles.find((a) => a.slug === param.slug);

    if (!article) {
        const dbArticle = await getPublishedDbArticleBySlug(param.slug);
        if (!dbArticle) return {};
        return {
            title: dbArticle.metaTitle || `${dbArticle.title} - Mentel`,
            description: dbArticle.metaDescription || dbArticle.excerpt,
            keywords: dbArticle.keywords?.join(", "),
            alternates: { canonical: `/articles/${dbArticle.slug}` },
            openGraph: {
                title: dbArticle.metaTitle || `${dbArticle.title} - Mentel`,
                description: dbArticle.metaDescription || dbArticle.excerpt,
                url: `https://www.trymentel.com/articles/${dbArticle.slug}`,
                type: "article",
                publishedTime: (dbArticle.publishedAt ?? dbArticle.createdAt).toISOString(),
                authors: ["Mentel Clinical Team"],
                tags: dbArticle.tags,
                images: dbArticle.image
                    ? [{ url: `https://www.trymentel.com${dbArticle.image}`, width: 1200, height: 630, alt: dbArticle.title }]
                    : undefined,
            },
            twitter: {
                card: "summary_large_image",
                title: dbArticle.metaTitle || `${dbArticle.title} - Mentel`,
                description: dbArticle.metaDescription || dbArticle.excerpt,
            },
        };
    }

    return {
        title: `${article.title} - Mentel`,
        description: article.excerpt,
        keywords: article.keywords?.join(", "),
        alternates: {
            canonical: `/articles/${article.slug}`,
        },
        openGraph: {
            title: `${article.title} - Mentel`,
            description: article.excerpt,
            url: `https://www.trymentel.com/articles/${article.slug}`,
            type: "article",
            publishedTime: article.date,
            authors: ["Mentel Clinical Team"],
            tags: article.tags,
            images: [
                {
                    url: `https://www.trymentel.com${article.image}`,
                    width: 1200,
                    height: 630,
                    alt: article.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${article.title} - Mentel`,
            description: article.excerpt,
            images: [`https://www.trymentel.com${article.image}`],
        },
    };
}


export default async function ArticlePage({ params }: { params: { slug: string } }) {
    const param = await params;
    const staticArticle = articles.find((a) => a.slug === param.slug);

    // ── Normalize both sources into one shared shape ────────────────────────
    // article: { slug, title, category, excerpt, date, readMin, image, tags }
    // content: { intro, sections: [{ heading, body, list? }], tldr?, faq? }
    // Whichever source it came from, everything below renders identically —
    // there is no separate "database article" layout.
    let article: {
        slug: string;
        title: string;
        category: string;
        excerpt: string;
        date: string;
        readMin: number;
        image: string | null;
        tags: string[];
        keywords: string[];
    };
    let content: {
        intro: string;
        sections: { heading: string; body: string; list?: { label?: string; value: string }[] }[];
        tldr?: string;
        faq?: { q: string; a: string }[];
    } | undefined;

    if (staticArticle) {
        article = staticArticle;
        content = articleContent[staticArticle.slug];
    } else {
        const dbArticle = await getPublishedDbArticleBySlug(param.slug);
        if (!dbArticle) notFound();

        article = {
            slug: dbArticle.slug,
            title: dbArticle.title,
            category: dbArticle.category,
            excerpt: dbArticle.excerpt,
            date: (dbArticle.publishedAt ?? dbArticle.createdAt).toISOString(),
            readMin: dbArticle.readMin,
            image: dbArticle.image,
            tags: dbArticle.tags,
            keywords: dbArticle.keywords,
        };
        content = markdownToSections(dbArticle.content);
        const tldr = (dbArticle as { tldr?: string }).tldr;
        if (tldr) content.tldr = tldr;
        const faq = (dbArticle as unknown as { faq?: { q: string; a: string }[] }).faq;
        if (Array.isArray(faq) && faq.length > 0) content.faq = faq;
    }

    const allArticles = staticArticle ? null : await getAllPublishedArticles();
    const articleIndex = articles.findIndex((a) => a.slug === param.slug);
    const prev = staticArticle ? (articles[articleIndex - 1] ?? null) : null;
    const next = staticArticle ? (articles[articleIndex + 1] ?? null) : null;

    // Related: same category, excluding current article, max 3
    const related = staticArticle
        ? articles.filter((a) => a.slug !== article.slug && a.category === article.category).slice(0, 3)
        : (allArticles ?? []).filter((a) => a.slug !== article.slug && a.category === article.category).slice(0, 3);

    const style = getCategoryStyle(article.category);

    /* ...articleSchema, seoScore, faqSchema unchanged... */

    return (
        <>
            {/* JSON-LD scripts unchanged */}

            <div className="relative overflow-x-hidden">
                {/* Back nav */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">
                    <Link
                        href="/articles"
                        className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--teal)]"
                        style={{ color: "var(--text-muted)" }}
                    >
                        <ArrowLeft size={14} />
                        All Articles
                    </Link>
                </div>

                <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:pb-20">
                    <header className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <span
                                className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                                style={{ background: "rgba(123,169,139,0.12)", color: "var(--sage-dark)" }}
                            >
                                <Leaf size={9} />
                                {article.category}
                            </span>
                        </div>

                        <h1
                            className="font-cormorant text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight mb-5"
                            style={{ color: "var(--deep)", letterSpacing: "-0.02em" }}
                        >
                            {article.title}
                        </h1>

                        <p className="text-base sm:text-lg font-normal leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>
                            {article.excerpt}
                        </p>

                        <div className="flex items-center justify-between pb-6 border-b" style={{ borderColor: "var(--border)" }}>
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                                    style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                                >
                                    M
                                </div>
                                <div>
                                    <p className="text-sm font-medium" style={{ color: "var(--deep)" }}>
                                        Mentel Clinical Team
                                    </p>
                                    <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                                        <span>
                                            {new Date(article.date).toLocaleDateString("en-NG", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </span>
                                        <span>·</span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={11} />
                                            {article.readMin} min read
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all hover:shadow-sm"
                                style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                            >
                                <Share2 size={12} />
                                Share
                            </button>
                        </div>
                    </header>

                    {/* ── Hero cover image ── */}
                    <div className="relative w-full aspect-[16/9] sm:aspect-[16/7] rounded-2xl overflow-hidden mb-10">
                        <ArticleCover image={article.image} category={article.category} title={article.title} iconSize={160} />
                    </div>

                    {/* TL;DR box */}
                    {content?.tldr && (
                        <div
                            className="mb-10 rounded-xl p-5 border"
                            style={{
                                background: "rgba(123,169,139,0.06)",
                                border: "1px solid rgba(123,169,139,0.2)",
                                borderLeft: "4px solid var(--sage)",
                            }}
                        >
                            <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "var(--sage-dark)" }}>
                                TL;DR — Key takeaways
                            </p>
                            <p className="text-sm leading-relaxed font-normal" style={{ color: "var(--text)" }}>
                                {content.tldr}
                            </p>

                        </div>
                    )}

                    <AdhdTestBanner />

                    {/* Article body — unchanged */}
                    {content && (
                        <div className="prose-mentel">
                            <p
                                className="text-base sm:text-lg leading-relaxed font-normal mb-10"
                                style={{ color: "var(--text)", lineHeight: "1.85" }}
                            >
                                {renderInlineText(content.intro)}
                            </p>
                            <div className="space-y-10">
                                {content.sections.map((section, i) => (
                                    <section key={i} id={`section-${i}`}>
                                        <h2
                                            className={`font-cormorant  font-semibold mb-3 scroll-mt-24 ${i === 0 ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"}`}
                                            style={{ color: "var(--deep)" }}
                                        >
                                            {section.heading}
                                        </h2>
                                        <p
                                            className="text-sm sm:text-base leading-relaxed font-normal"
                                            style={{ color: "var(--text)", lineHeight: "1.85" }}
                                        >
                                            {renderInlineText(section.body)}
                                        </p>
                                        {section.list && (
                                            <ul className="mt-4 space-y-2">
                                                {section.list.map((item, j) => (
                                                    <li key={j} className="flex gap-3 text-sm sm:text-base" style={{ color: "var(--text)" }}>
                                                        <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--sage)" }} />
                                                        <span>
                                                            {item.label && <strong style={{ color: "var(--deep)" }}>{item.label}: </strong>}
                                                            {renderInlineText(item.value)}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </section>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tags — unchanged */}
                    <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t" style={{ borderColor: "var(--border)" }}>
                        {article.tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-xs px-2.5 py-1 rounded-full border"
                                style={{ borderColor: "rgba(123,169,139,0.3)", color: "var(--sage-dark)", background: "rgba(123,169,139,0.07)" }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* FAQ — unchanged, plus FAQPage structured data added
                        for Google's FAQ rich results, since this content
                        exists and is genuinely user-facing Q&A, ideal
                        candidate for it. */}
                    {content?.faq && content.faq.length > 0 && (
                        <>
                            <script
                                type="application/ld+json"
                                // eslint-disable-next-line react/no-danger
                                dangerouslySetInnerHTML={{
                                    __html: JSON.stringify({
                                        "@context": "https://schema.org",
                                        "@type": "FAQPage",
                                        mainEntity: content.faq.map(({ q, a }) => ({
                                            "@type": "Question",
                                            name: q,
                                            acceptedAnswer: { "@type": "Answer", text: a },
                                        })),
                                    }),
                                }}
                            />
                            <div className="mt-12 pt-8 border-t" style={{ borderColor: "var(--border)" }}>
                                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--sage-dark)" }}>
                                    Quick answers
                                </p>
                                <h2 className="font-cormorant text-2xl sm:text-3xl font-normal mb-6" style={{ color: "var(--deep)" }}>
                                    Frequently asked questions
                                </h2>
                                <div className="space-y-4">
                                    {content.faq.map(({ q, a }) => (
                                        <div key={q} className="rounded-xl p-5 border" style={{ borderColor: "var(--border)", background: "white" }}>
                                            <p className="text-sm font-semibold mb-2" style={{ color: "var(--deep)" }}>{q}</p>
                                            <p className="text-sm font-normal leading-relaxed" style={{ color: "var(--text-muted)" }}>{a}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* CTA box — unchanged */}
                    <div
                        className="mt-12 rounded-2xl p-6 sm:p-8"
                        style={{ background: "rgba(123,169,139,0.06)", border: "1px solid rgba(123,169,139,0.2)", borderLeft: "4px solid var(--sage)" }}
                    >
                        <p className="font-cormorant text-xl sm:text-2xl font-normal mb-2" style={{ color: "var(--deep)" }}>
                            Ready to take the first step?
                        </p>
                        <p className="text-sm font-normal mb-5" style={{ color: "var(--text-muted)" }}>
                            Not sure where to start? Take our free 2-minute assessment, or book a session with a licensed therapist. Fully confidential.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/book"
                                className="inline-flex items-center gap-2 text-sm font-medium text-white px-5 py-2.5 rounded-full"
                                style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                            >
                                Book a Session
                                <ArrowRight size={14} />
                            </Link>
                            <Link
                                href="/assessment"
                                className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full border"
                                style={{ borderColor: "var(--border)", color: "var(--sage-dark)" }}
                            >
                                Free Assessment
                            </Link>
                        </div>
                    </div>

                    {/* ── Related articles ── */}
                    {related.length > 0 && (
                        <div className="mt-12 pt-8 border-t" style={{ borderColor: "var(--border)" }}>
                            <p className="text-xs font-medium uppercase tracking-widest mb-6" style={{ color: style.accent }}>
                                More on {article.category}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {related.map((a) => (
                                    <ArticleCard key={a.slug} article={a} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Prev / Next — unchanged */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 pt-8 border-t" style={{ borderColor: "var(--border)" }}>
                        {prev ? (
                            <Link href={`/articles/${prev.slug}`} className="group rounded-2xl p-5 border hover:-translate-y-0.5 hover:shadow-md transition-all duration-200" style={{ background: "white", borderColor: "var(--border)" }}>
                                <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>← Previous</p>
                                <p className="text-sm font-medium line-clamp-2 group-hover:text-[var(--teal)] transition-colors" style={{ color: "var(--deep)" }}>{prev.title}</p>
                            </Link>
                        ) : <div />}
                        {next && (
                            <Link href={`/articles/${next.slug}`} className="group rounded-2xl p-5 border hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 text-right sm:col-start-2" style={{ background: "white", borderColor: "var(--border)" }}>
                                <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Next →</p>
                                <p className="text-sm font-medium line-clamp-2 group-hover:text-[var(--teal)] transition-colors" style={{ color: "var(--deep)" }}>{next.title}</p>
                            </Link>
                        )}
                    </div>
                </article>
            </div>
        </>
    );
}