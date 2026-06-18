import Link from "next/link";
import { ArrowRight, Clock, Leaf } from "lucide-react";
import type { articles } from "@/utilz/articles";
import { ArticleCover, getCategoryStyle } from "./ArticleVisuals";

type Article = (typeof articles)[number];

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

/* ── Standard grid card — image-led ── */
export function ArticleCard({ article }: { article: Article }) {
    const style = getCategoryStyle(article.category);
    return (
        <Link
            href={`/articles/${article.slug}`}
            className="group block rounded-2xl border overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg duration-300"
            style={{ background: "white", borderColor: "var(--border)" }}
        >
            <div className="relative aspect-[16/10] overflow-hidden">
                <ArticleCover image={article.image} category={article.category} title={article.title} iconSize={56} />
                <span
                    className="absolute top-3 left-3 inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full backdrop-blur-sm"
                    style={{ background: "rgba(255,255,255,0.9)", color: style.accent }}
                >
                    <Leaf size={9} />
                    {article.category}
                </span>
            </div>

            <div className="p-5 flex flex-col">
                <h2
                    className="font-cormorant font-semibold leading-snug mb-2 text-xl transition-colors duration-200 group-hover:text-[var(--teal)]"
                    style={{ color: "var(--deep)" }}
                >
                    {article.title}
                </h2>
                <p className="text-sm leading-relaxed font-normal mb-4 line-clamp-2" style={{ color: "var(--text-muted)" }}>
                    {article.excerpt}
                </p>
                <div className="flex items-center justify-between mt-auto pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                            <Clock size={11} />
                            {article.readMin} min
                        </span>
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>{formatDate(article.date)}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-medium transition-colors duration-200" style={{ color: "var(--sage-dark)" }}>
                        Read
                        <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                </div>
            </div>
        </Link>
    );
}

/* ── Featured hero card — Apple-News-style image lead with overlay text ── */
export function FeaturedCard({ article }: { article: Article }) {
    const style = getCategoryStyle(article.category);
    return (
        <Link
            href={`/articles/${article.slug}`}
            className="group relative block rounded-3xl overflow-hidden transition-all hover:shadow-xl duration-300"
            style={{ height: "clamp(340px, 48vw, 460px)" }}
        >
            <ArticleCover image={article.image} category={article.category} title={article.title} iconSize={180} className="absolute inset-0" />
            {/* Readability gradient */}
            <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(180deg, rgba(20,30,26,0) 35%, rgba(15,25,21,0.55) 75%, rgba(10,18,15,0.85) 100%)" }}
            />

            <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-9">
                <span
                    className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full mb-4 w-fit"
                    style={{ background: "rgba(255,255,255,0.92)", color: style.accent }}
                >
                    <Leaf size={9} />
                    {article.category}
                </span>
                <h2
                    className="font-cormorant font-semibold leading-tight mb-3 text-2xl sm:text-4xl max-w-2xl text-white transition-colors duration-200 group-hover:text-[#cfe8db]"
                >
                    {article.title}
                </h2>
                <p className="text-sm sm:text-[15px] leading-relaxed font-normal mb-5 max-w-xl" style={{ color: "rgba(255,255,255,0.78)" }}>
                    {article.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
                    <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {article.readMin} min read
                    </span>
                    <span>{formatDate(article.date)}</span>
                    <span className="inline-flex items-center gap-1 font-medium ml-auto text-white">
                        Read article
                        <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                </div>
            </div>
        </Link>
    );
}