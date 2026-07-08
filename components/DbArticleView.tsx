// // components/DbArticleView.tsx
// // Renders an article that was written through the admin CMS (markdown
// // content stored in the database), reusing the same visual shell as the
// // legacy static articles so the two are indistinguishable to a reader.

// import Link from "next/link";
// import { ArrowLeft, Clock, Leaf } from "lucide-react";
// import { marked } from "marked";
// import { ArticleCover, getCategoryStyle } from "./ArticleVisuals";
// import type { ArticleSummary } from "@/lib/articles/data";

// interface DbArticleViewProps {
//   article: {
//     slug: string;
//     title: string;
//     excerpt: string;
//     category: string;
//     content: string;
//     readMin: number;
//     image: string | null;
//     tags: string[];
//     publishedAt: Date | null;
//     createdAt: Date;
//   };
//   related: ArticleSummary[];
// }

// export default function DbArticleView({ article, related }: DbArticleViewProps) {
//   const style = getCategoryStyle(article.category);
//   const html = marked.parse(article.content, { async: false }) as string;
//   const date = (article.publishedAt ?? article.createdAt).toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

//   return (
//     <div className="relative overflow-x-hidden">
//       <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">
//         <Link
//           href="/articles"
//           className="inline-flex items-center gap-1.5 text-xs font-medium mb-8 hover:opacity-70 transition-opacity"
//           style={{ color: "var(--text-muted)" }}
//         >
//           <ArrowLeft size={13} />
//           All articles
//         </Link>

//         <span
//           className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full mb-4"
//           style={{ background: style.tint, color: style.accent }}
//         >
//           <Leaf size={9} />
//           {article.category}
//         </span>

//         <h1
//           className="font-cormorant text-3xl sm:text-4xl md:text-5xl font-normal leading-tight mb-4"
//           style={{ color: "var(--deep)", letterSpacing: "-0.02em" }}
//         >
//           {article.title}
//         </h1>

//         <div className="flex items-center gap-4 text-xs mb-8" style={{ color: "var(--text-muted)" }}>
//           <span>{date}</span>
//           <span className="inline-flex items-center gap-1">
//             <Clock size={12} />
//             {article.readMin} min read
//           </span>
//         </div>

//         <ArticleCover image={article.image} category={article.category} title={article.title} />
//       </div>

//       <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
//         <div
//           className="prose prose-slate max-w-none prose-headings:font-cormorant prose-headings:font-semibold prose-a:text-[var(--teal)]"
//           style={{ color: "var(--text-muted)" }}
//           dangerouslySetInnerHTML={{ __html: html }}
//         />

//         {article.tags.length > 0 && (
//           <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t" style={{ borderColor: "var(--border)" }}>
//             {article.tags.map((tag) => (
//               <span
//                 key={tag}
//                 className="text-xs px-3 py-1 rounded-full"
//                 style={{ background: "rgba(123,169,139,0.10)", color: "var(--sage-dark)" }}
//               >
//                 {tag}
//               </span>
//             ))}
//           </div>
//         )}
//       </article>

//       {related.length > 0 && (
//         <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24 border-t pt-10" style={{ borderColor: "var(--border)" }}>
//           <p className="text-xs font-medium uppercase tracking-widest mb-6" style={{ color: "var(--sage-dark)" }}>
//             Related articles
//           </p>
//           <div className="grid sm:grid-cols-3 gap-5">
//             {related.map((r) => (
//               <Link
//                 key={r.slug}
//                 href={`/articles/${r.slug}`}
//                 className="block rounded-2xl border p-5 hover:-translate-y-1 transition-transform duration-300"
//                 style={{ background: "white", borderColor: "var(--border)" }}
//               >
//                 <h3 className="font-cormorant text-lg font-semibold mb-1" style={{ color: "var(--deep)" }}>
//                   {r.title}
//                 </h3>
//                 <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
//                   {r.excerpt}
//                 </p>
//               </Link>
//             ))}
//           </div>
//         </section>
//       )}
//     </div>
//   );
// }


// components/DbArticleView.tsx
// Renders an article that was written through the admin CMS (markdown
// content stored in the database), reusing the same visual shell as the
// legacy static articles so the two are indistinguishable to a reader.

import Link from "next/link";
import { ArrowLeft, Clock, Leaf } from "lucide-react";
import { marked } from "marked";
import { ArticleCover, getCategoryStyle } from "./ArticleVisuals";
import type { ArticleSummary } from "@/lib/articles/data";

interface DbArticleViewProps {
  article: {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    content: string;
    readMin: number;
    image: string | null;
    tags: string[];
    publishedAt: Date | null;
    createdAt: Date;
  };
  related: ArticleSummary[];
}

export default function DbArticleView({ article, related }: DbArticleViewProps) {
  const style = getCategoryStyle(article.category);
  const html = marked.parse(article.content, { async: false }) as string;
  const date = (article.publishedAt ?? article.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative overflow-x-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 text-xs font-medium mb-8 hover:opacity-70 transition-opacity"
          style={{ color: "var(--text-muted)" }}
        >
          <ArrowLeft size={13} />
          All articles
        </Link>

        <span
          className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full mb-4"
          style={{ background: style.tint, color: style.accent }}
        >
          <Leaf size={9} />
          {article.category}
        </span>

        <h1
          className="font-cormorant text-3xl sm:text-4xl md:text-5xl font-normal leading-tight mb-4"
          style={{ color: "var(--deep)", letterSpacing: "-0.02em" }}
        >
          {article.title}
        </h1>

        <div className="flex items-center gap-4 text-xs mb-8" style={{ color: "var(--text-muted)" }}>
          <span>{date}</span>
          <span className="inline-flex items-center gap-1">
            <Clock size={12} />
            {article.readMin} min read
          </span>
        </div>

        <ArticleCover image={article.image} category={article.category} title={article.title} />
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t" style={{ borderColor: "var(--border)" }}>
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full"
                style={{ background: "rgba(123,169,139,0.10)", color: "var(--sage-dark)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </article>

      {related.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24 border-t pt-10" style={{ borderColor: "var(--border)" }}>
          <p className="text-xs font-medium uppercase tracking-widest mb-6" style={{ color: "var(--sage-dark)" }}>
            Related articles
          </p>
          <div className="grid sm:grid-cols-3 gap-5">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/articles/${r.slug}`}
                className="block rounded-2xl border p-5 hover:-translate-y-1 transition-transform duration-300"
                style={{ background: "white", borderColor: "var(--border)" }}
              >
                <h3 className="font-cormorant text-lg font-semibold mb-1" style={{ color: "var(--deep)" }}>
                  {r.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {r.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
