// components/ArticlesPreview.tsx
// Drop this component into your home page, below Services and above Testimonials.
// It shows 3 recent articles with a "View All" link.

import Link from "next/link";
import { ArrowRight, Clock, BookOpen, Leaf } from "lucide-react";
import { articles } from "@/utilz/articles";

export default function ArticlesPreview() {
    // Show the 3 most recent articles
    const preview = articles.slice(0, 3);

    return (
        <section
            className="relative z-10 py-12 sm:py-16 border-t"
            style={{ borderColor: "var(--border)" }}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
                    <div>
                        <div
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4 border"
                            style={{
                                background: "rgba(123,169,139,0.10)",
                                borderColor: "rgba(123,169,139,0.25)",
                                color: "var(--sage-dark)",
                            }}
                        >
                            <BookOpen size={11} />
                            Resources
                        </div>
                        <h2
                            className="font-cormorant text-3xl sm:text-4xl font-normal"
                            style={{ color: "var(--deep)" }}
                        >
                            Guides &amp;{" "}
                            <em className="italic" style={{ color: "var(--sage-dark)" }}>
                                insights
                            </em>
                        </h2>
                        <p
                            className="text-sm sm:text-base mt-2 font-normal max-w-sm"
                            style={{ color: "var(--text-muted)" }}
                        >
                            Expert-written mental health content for Nigerians, backed by evidence.
                        </p>
                    </div>
                    <Link
                        href="/articles"
                        className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full border transition-all hover:shadow-sm hover:-translate-y-0.5 duration-200 flex-shrink-0"
                        style={{ borderColor: "var(--border)", color: "var(--sage-dark)" }}
                    >
                        View All Articles
                        <ArrowRight size={14} />
                    </Link>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    {preview.map((article, i) => (
                        <Link
                            key={article.slug}
                            href={`/articles/${article.slug}`}
                            className="group block rounded-2xl border overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg duration-300"
                            style={{ background: "white", borderColor: "var(--border)" }}
                        >
                            {/* top accent */}
                            <div
                                className="h-1 w-full"
                                style={{
                                    background:
                                        i === 0
                                            ? "linear-gradient(90deg, var(--sage-dark), var(--teal))"
                                            : i === 1
                                                ? "linear-gradient(90deg, var(--teal), var(--sage-light))"
                                                : "linear-gradient(90deg, var(--sage-light), var(--sage))",
                                }}
                            />
                            <div className="p-5 sm:p-6 flex flex-col h-full">
                                <div className="flex items-center gap-2 mb-3">
                                    <span
                                        className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                                        style={{
                                            background: "rgba(123,169,139,0.10)",
                                            color: "var(--sage-dark)",
                                        }}
                                    >
                                        <Leaf size={9} />
                                        {article.category}
                                    </span>
                                </div>

                                <h3
                                    className="font-cormorant text-xl font-semibold leading-snug mb-3 transition-colors duration-200 group-hover:text-[var(--teal)]"
                                    style={{ color: "var(--deep)" }}
                                >
                                    {article.title}
                                </h3>

                                <p
                                    className="text-sm leading-relaxed font-normal flex-1 line-clamp-3"
                                    style={{ color: "var(--text-muted)" }}
                                >
                                    {article.excerpt}
                                </p>

                                <div
                                    className="flex items-center justify-between mt-5 pt-4 border-t"
                                    style={{ borderColor: "var(--border)" }}
                                >
                                    <span
                                        className="flex items-center gap-1 text-xs"
                                        style={{ color: "var(--text-muted)" }}
                                    >
                                        <Clock size={11} />
                                        {article.readMin} min read
                                    </span>
                                    <span
                                        className="inline-flex items-center gap-1 text-xs font-medium transition-colors duration-200"
                                        style={{ color: "var(--sage-dark)" }}
                                    >
                                        Read
                                        <ArrowRight
                                            size={12}
                                            className="transition-transform duration-200 group-hover:translate-x-1"
                                        />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}