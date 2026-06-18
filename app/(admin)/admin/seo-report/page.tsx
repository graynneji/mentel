// app/admin/seo-report/page.tsx
// SEO Audit Dashboard for Mentel Articles (Internal Tool)

import { scorePageSEO } from "@/lib/seo-scoring-engine";
import { articles } from "@/utilz/articles";

export default function SEOReportPage() {
    const report = articles.map((article) => {
        // NOTE: In real production, you'd fetch articleContent via shared util/db
        const content = (globalThis as any)?.articleContent?.[article.slug];

        const score = scorePageSEO({
            title: article.title,
            description: article.excerpt,
            keywords: article.tags,
            content: content
                ? [
                    content.intro,
                    content.sections?.map((s: any) => s.body).join(" "),
                    content.tldr,
                ].join(" ")
                : "",
            schemaTypes: ["Article", "MedicalBusiness"],
            internalLinks: 3,
            headings: content?.sections?.map((s: any) => `h2-${s.heading}`) || [],
        });

        return {
            slug: article.slug,
            title: article.title,
            category: article.category,
            score,
        };
    });

    const sorted = [...report].sort(
        (a, b) => b.score.overallScore - a.score.overallScore
    );

    const avgScore =
        sorted.reduce((acc, r) => acc + r.score.overallScore, 0) / sorted.length;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-2">SEO Audit Dashboard</h1>
            <p className="text-gray-500 mb-6">
                Average Score: {avgScore.toFixed(1)} / 100
            </p>

            <div className="space-y-4">
                {sorted.map((item) => (
                    <div
                        key={item.slug}
                        className="p-4 border rounded-lg flex justify-between items-center"
                    >
                        <div>
                            <p className="font-semibold">{item.title}</p>
                            <p className="text-sm text-gray-500">
                                {item.category} • {item.slug}
                            </p>

                            {item.score.suggestions.length > 0 && (
                                <ul className="text-xs text-gray-500 mt-2 list-disc ml-4">
                                    {item.score.suggestions.map((s: string, i: number) => (
                                        <li key={i}>{s}</li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="text-right">
                            <p
                                className={`text-2xl font-bold ${item.score.overallScore >= 80
                                    ? "text-green-600"
                                    : item.score.overallScore >= 60
                                        ? "text-yellow-600"
                                        : "text-red-600"
                                    }`}
                            >
                                {item.score.overallScore}
                            </p>
                            <p className="text-xs text-gray-400">SEO Score</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
