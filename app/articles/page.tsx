// app/articles/page.tsx
import Link from "next/link";
import { ArrowRight, Clock, Leaf, BookOpen, TrendingUp } from "lucide-react";

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


/* ─── Article data (hard-coded — no DB needed) ─── */
export const articles = [
    {
        slug: "mental-health-services-lagos",
        category: "Access to Care",
        title: "Mental Health Services in Lagos: A Complete Guide for 2025",
        excerpt:
            "From government hospitals to private online platforms, here is everything you need to know about finding affordable, quality mental health support in Lagos.",
        readMin: 7,
        date: "2025-06-12",
        featured: true,
        tags: ["Lagos", "Therapy", "Access"],
        image: "/Mental_Health_Services_Lagos_Guide_202606131252.jpg", // swap for a real URL later
    },
    {
        slug: "online-therapy-nigeria-how-it-works",
        category: "Getting Started",
        title: "How Online Therapy Works in Nigeria and Why It's Changing Lives",
        excerpt:
            "Stigma, distance, cost. The old barriers to mental healthcare are falling. We break down exactly how virtual therapy works, what to expect, and whether it's right for you.",
        readMin: 6,
        date: "2025-05-28",
        featured: false,
        tags: ["Online Therapy", "Nigeria"],
        image: "/recreate_202606131305.jpg",
    },
    {
        slug: "anxiety-signs-nigerians-ignore",
        category: "Anxiety",
        title: "7 Signs of Anxiety Nigerians Are Taught to Ignore",
        excerpt:
            "\"Just pray about it.\" \"You're overthinking.\" Anxiety wears many masks in Nigerian culture, here's how to recognise it before it silently takes over your life.",
        readMin: 5,
        date: "2025-05-14",
        featured: false,
        tags: ["Anxiety", "Culture", "Self-Awareness"],
        image: "/AdobeStock_309579619.webp",
    },
    {
        slug: "depression-nigeria-men-silent-struggle",
        category: "Depression",
        title: "The Silent Struggle: Depression in Nigerian Men",
        excerpt:
            "\"Men don't cry\" and \"be strong\" are phrases that cost lives. This honest guide explores how depression shows up differently in men and what the path to healing looks like.",
        readMin: 8,
        date: "2025-04-30",
        featured: false,
        tags: ["Depression", "Men", "Nigeria"],
        image: "depression.jpg",
    },
    {
        slug: "cost-therapy-nigeria-affordable-options",
        category: "Access to Care",
        title: "How Much Does Therapy Cost in Nigeria? (And How to Afford It)",
        excerpt:
            "Therapy is often seen as a luxury only the wealthy can access. We break down real costs, HMO coverage, sliding-scale options, and platforms like Mentel making it affordable.",
        readMin: 6,
        date: "2025-04-15",
        featured: false,
        tags: ["Cost", "Access", "Nigeria"],
        image: "/Black_male_and_female_in_202606131327.jpg",
    },
    {
        // will start here stoped here for indexing google
        slug: "couples-therapy-nigeria-when-to-go",
        category: "Relationships",
        title: "When Should Nigerian Couples Seek Therapy? 8 Honest Signals",
        excerpt:
            "Arguments are normal. But when do disagreements, distance, or repeated patterns signal something deeper? A couples therapist explains the real warning signs.",
        readMin: 7,
        date: "2025-03-22",
        featured: false,
        tags: ["Couples", "Marriage", "Relationships"],
        image: "/couples_therapy_in_nigeria_images_202606131329.jpg",
    },
    {
        slug: "burnout-vs-stress-difference",
        category: "Burnout",
        title: "Burnout vs. Stress: How to Tell the Difference (and Why It Matters)",
        excerpt:
            "Everyone is stressed. But burnout is something else entirely, a state that doesn't resolve with rest alone. Here's how to know which one you're dealing with.",
        readMin: 5,
        date: "2025-03-08",
        featured: false,
        tags: ["Burnout", "Stress", "Work"],
        image: "/Burnout_stress_make_it_real_202606131335.jpg",
    },
    {
        slug: "trauma-ptsd-nigeria-understanding",
        category: "Trauma",
        title: "Understanding Trauma and PTSD in a Nigerian Context",
        excerpt:
            "Road accidents, loss, violence, childhood experiences, trauma is more common than we admit. This guide explains what trauma does to the brain and how evidence-based therapies heal it.",
        readMin: 9,
        date: "2025-02-20",
        featured: false,
        tags: ["Trauma", "PTSD", "Healing"],
        image: "/trauma_ptsd_human_black_mixed_202606131357.jpg",
    },
    {
        slug: "mental-health-abuja-resources",
        category: "Access to Care",
        title: "Mental Health Resources in Abuja: Where to Get Help in the FCT",
        excerpt:
            "A practical, updated directory of therapists, hospitals, and online platforms available to residents of Abuja and the Federal Capital Territory.",
        readMin: 6,
        date: "2025-02-05",
        featured: false,
        tags: ["Abuja", "FCT", "Resources"],
        image: "/Mental_health_resource_Abuja_202606131359.jpg",
    },
    {
        slug: "how-to-find-right-therapist-nigeria",
        category: "Getting Started",
        title: "How to Find the Right Therapist in Nigeria: A Step-by-Step Guide",
        excerpt:
            "Not every therapist is the right therapist for you. This guide walks you through credentials to check, questions to ask, red flags to avoid, and how the matching process really works.",
        readMin: 7,
        date: "2025-01-18",
        featured: false,
        tags: ["Finding Therapy", "Guide"],
        image: "/Find_right_therapist_image_202606131359.jpg",
    },
];

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

// export default function ArticlesPage() {
//     const [featured, ...rest] = articles;

//     const categories = Array.from(new Set(articles.map((a) => a.category)));

//     return (
//         <div className="relative overflow-x-hidden">
//             {/* Hero */}
//             <section className="relative z-10 pt-20 sm:pt-28 pb-10 sm:pb-14 border-b" style={{ borderColor: "var(--border)" }}>
//                 <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div
//                         className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-5 border"
//                         style={{ background: "rgba(123,169,139,0.10)", borderColor: "rgba(123,169,139,0.25)", color: "var(--sage-dark)" }}
//                     >
//                         <BookOpen size={11} />
//                         Resources &amp; Insights
//                     </div>
//                     <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
//                         <div>
//                             <h1
//                                 className="font-cormorant text-4xl sm:text-5xl font-light leading-tight mb-3"
//                                 style={{ color: "var(--deep)", letterSpacing: "-0.02em" }}
//                             >
//                                 Mental health,{" "}
//                                 <em className="italic" style={{ color: "var(--sage-dark)" }}>
//                                     explained.
//                                 </em>
//                             </h1>
//                             <p className="text-sm sm:text-base font-light max-w-md" style={{ color: "var(--text-muted)" }}>
//                                 Evidence-based guides written by clinicians. Real talk about anxiety, depression, relationships, and healing in a Nigerian context.
//                             </p>
//                         </div>
//                         <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
//                             <TrendingUp size={14} style={{ color: "var(--sage-dark)" }} />
//                             {articles.length} articles published
//                         </div>
//                     </div>

//                     {/* Category filter pills */}
//                     <div className="flex flex-wrap gap-2 mt-7">
//                         <span
//                             className="text-xs px-3 py-1.5 rounded-full border font-medium cursor-default"
//                             style={{ background: "var(--sage-dark)", borderColor: "var(--sage-dark)", color: "white" }}
//                         >
//                             All
//                         </span>
//                         {categories.map((cat) => (
//                             <span
//                                 key={cat}
//                                 className="text-xs px-3 py-1.5 rounded-full border font-medium cursor-pointer hover:bg-[rgba(123,169,139,0.12)] transition-colors"
//                                 style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
//                             >
//                                 {cat}
//                             </span>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             {/* Featured article */}
//             <section className="relative z-10 py-10 sm:py-12">
//                 <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: "var(--sage-dark)" }}>
//                         Featured
//                     </p>
//                     <ArticleCard article={featured} large />
//                 </div>
//             </section>

//             {/* All articles grid */}
//             <section className="relative z-10 pb-16 sm:pb-20 border-t" style={{ borderColor: "var(--border)" }}>
//                 <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
//                     <p className="text-xs font-medium uppercase tracking-widest mb-6" style={{ color: "var(--sage-dark)" }}>
//                         All Articles
//                     </p>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//                         {rest.map((article) => (
//                             <ArticleCard key={article.slug} article={article} />
//                         ))}
//                     </div>
//                 </div>
//             </section>
//         </div>
//     );
// }

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