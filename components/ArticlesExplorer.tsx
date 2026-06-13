"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, TrendingUp } from "lucide-react";
import type { articles as ArticlesType } from "../app/articles/page";
import { ArticleCard } from "./ArticleCard";
import { ArticleCover, getCategoryStyle } from "./ArticleVisuals";

type Article = (typeof ArticlesType)[number];

export default function ArticlesExplorer({
    rest,
    trending,
    categories,
}: {
    rest: Article[];
    trending: Article[];
    categories: string[];
}) {
    const [active, setActive] = useState("All");
    const filtered = active === "All" ? rest : rest.filter((a) => a.category === active);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 lg:gap-10">
            {/* Main column */}
            <div>
                {/* Category pills */}
                <div className="flex gap-2 overflow-x-auto pb-1 mb-6 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
                    {["All", ...categories].map((cat) => {
                        const isActive = active === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => setActive(cat)}
                                className="text-xs px-3.5 py-1.5 rounded-full border font-medium whitespace-nowrap transition-all flex-shrink-0"
                                style={
                                    isActive
                                        ? { background: "var(--sage-dark)", borderColor: "var(--sage-dark)", color: "white" }
                                        : { borderColor: "var(--border)", color: "var(--text-muted)", background: "white" }
                                }
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>

                {/* Grid */}
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {filtered.map((article) => (
                            <ArticleCard key={article.slug} article={article} />
                        ))}
                    </div>
                ) : (
                    <p className="text-sm py-12 text-center" style={{ color: "var(--text-muted)" }}>
                        No articles in this category yet.
                    </p>
                )}
            </div>

            {/* Trending sidebar */}
            <aside className="lg:sticky lg:top-24 self-start">
                <div className="rounded-2xl border p-5" style={{ background: "white", borderColor: "var(--border)" }}>
                    <p
                        className="text-xs font-medium uppercase tracking-widest mb-4 flex items-center gap-1.5"
                        style={{ color: "var(--sage-dark)" }}
                    >
                        <TrendingUp size={12} />
                        Most read
                    </p>
                    <div className="flex flex-col gap-4">
                        {trending.map((article, i) => {
                            const style = getCategoryStyle(article.category);
                            return (
                                <Link
                                    key={article.slug}
                                    href={`/articles/${article.slug}`}
                                    className="group flex items-start gap-3"
                                >
                                    <span
                                        className="font-cormorant font-semibold text-xl leading-none flex-shrink-0 w-6 pt-0.5"
                                        style={{ color: style.accent }}
                                    >
                                        {i + 1}
                                    </span>
                                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                        <ArticleCover image={article.image} category={article.category} title={article.title} iconSize={32} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p
                                            className="text-sm font-medium leading-snug line-clamp-2 transition-colors duration-200 group-hover:text-[var(--teal)]"
                                            style={{ color: "var(--deep)" }}
                                        >
                                            {article.title}
                                        </p>
                                        <span className="flex items-center gap-1 text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                                            <Clock size={10} />
                                            {article.readMin} min read
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </aside>
        </div>
    );
}