// app/articles/page.tsx
import Link from "next/link";
import { ArrowRight, Clock, Leaf, BookOpen, TrendingUp } from "lucide-react";
import { articles } from "@/utilz/articles";
import ArticlesExplorer from "@/components/ArticlesExplorer";
import { FeaturedCard } from "@/components/ArticleCard";

export const metadata = {
    title: "Mental Health Articles & Resources - Mentel",
    description:
        "Expert-written guides on anxiety, depression, therapy in Nigeria, relationships, and wellbeing. Evidence-based mental health content for Nigerians.",
    alternates: {
        canonical: "/articles",
    },
    openGraph: {
        title: "Mental Health Articles & Resources - Mentel",
        description:
            "Expert-written guides on anxiety, depression, therapy in Nigeria, relationships, and wellbeing. Evidence-based mental health content for Nigerians.",
        url: "https://www.trymentel.com/articles",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Mental Health Articles & Resources - Mentel",
                // alt: "Mental Health Articles & Resources — Mentel",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Mental Health Articles & Resources - Mentel",
        description:
            "Expert-written guides on anxiety, depression, therapy in Nigeria, relationships, and wellbeing. Evidence-based mental health content for Nigerians.",
        images: ["/og-image.png"],
    },
};




const categoryColors: Record<string, string> = {
    "Access to Care": "rgba(61,139,139,0.10)",
    "Getting Started": "rgba(123,169,139,0.12)",
    Anxiety: "rgba(168,196,176,0.18)",
    Depression: "rgba(78,122,94,0.10)",
    Relationships: "rgba(111,184,184,0.12)",
    Burnout: "rgba(28,58,58,0.08)",
    Trauma: "rgba(200,221,210,0.25)",
};

function ArticleCard({ article, large = false }: { article: (typeof articles)[0]; large?: boolean }) {
    return (
        <Link
            href={`/articles/${article.slug}`}
            className={`group block rounded-2xl border overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg duration-300 ${large ? "sm:col-span-2 lg:col-span-2" : ""}`}
            style={{ background: "white", borderColor: "var(--border)" }}
        >
            {/* Colour-block top accent */}
            <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, var(--sage-dark), var(--teal))" }} />

            <div className={`p-5 sm:p-6 ${large ? "sm:p-8" : ""} flex flex-col h-full`}>
                {/* Category pill */}
                <div className="flex items-center gap-2 mb-3">
                    <span
                        className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{
                            background: categoryColors[article.category] ?? "rgba(123,169,139,0.10)",
                            color: "var(--sage-dark)",
                        }}
                    >
                        <Leaf size={9} />
                        {article.category}
                    </span>
                </div>

                <h2
                    className={`font-cormorant font-semibold leading-snug mb-3 transition-colors duration-200 group-hover:text-[var(--teal)] ${large ? "text-2xl sm:text-3xl" : "text-xl"}`}
                    style={{ color: "var(--deep)" }}
                >
                    {article.title}
                </h2>

                <p
                    className="text-sm leading-relaxed font-normal flex-1"
                    style={{ color: "var(--text-muted)" }}
                >
                    {article.excerpt}
                </p>

                <div className="flex items-center justify-between mt-5 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                            <Clock size={11} />
                            {article.readMin} min read
                        </span>
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                            {new Date(article.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                    </div>
                    <span
                        className="inline-flex items-center gap-1 text-xs font-medium transition-colors duration-200"
                        style={{ color: "var(--sage-dark)" }}
                    >
                        Read
                        <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                </div>
            </div>
        </Link>
    );
}


export default function ArticlesPage() {
    const [featured, ...rest] = articles;
    const categories = Array.from(new Set(articles.map((a) => a.category)));
    const trending = articles.slice(0, 5);

    return (
        <div className="relative overflow-x-hidden">
            {/* Hero */}
            <section className="relative z-10 pt-20 sm:pt-28 pb-10 sm:pb-14 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-5 border"
                        style={{ background: "rgba(123,169,139,0.10)", borderColor: "rgba(123,169,139,0.25)", color: "var(--sage-dark)" }}
                    >
                        <BookOpen size={11} />
                        Resources &amp; Insights
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <div>
                            <h1
                                className="font-cormorant text-4xl sm:text-5xl font-normal leading-tight mb-3"
                                style={{ color: "var(--deep)", letterSpacing: "-0.02em" }}
                            >
                                Mental health,{" "}
                                <em className="italic" style={{ color: "var(--sage-dark)" }}>
                                    explained.
                                </em>
                            </h1>
                            <p className="text-sm sm:text-base font-normal max-w-md" style={{ color: "var(--text-muted)" }}>
                                Evidence-based guides written by clinicians. Real talk about anxiety, depression, relationships, and healing in a Nigerian context.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                            <TrendingUp size={14} style={{ color: "var(--sage-dark)" }} />
                            {articles.length} articles published
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured hero */}
            <section className="relative z-10 py-10 sm:py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: "var(--sage-dark)" }}>
                        Featured
                    </p>
                    <FeaturedCard article={featured} />
                </div>
            </section>

            {/* Explorer: filters + grid + trending */}
            <section className="relative z-10 pb-16 sm:pb-20 border-t" style={{ borderColor: "var(--border)" }}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                    <p className="text-xs font-medium uppercase tracking-widest mb-6" style={{ color: "var(--sage-dark)" }}>
                        All Articles
                    </p>
                    <ArticlesExplorer rest={rest} trending={trending} categories={categories} />
                </div>
            </section>
        </div>
    );
}