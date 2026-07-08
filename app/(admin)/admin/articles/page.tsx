"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Search, ExternalLink, Loader2, FileText, Star } from "lucide-react";

interface Article {
    id: string;
    slug: string;
    title: string;
    category: string;
    status: string;
    featured: boolean;
    seoScore: number | null;
    updatedAt: string;
}

export default function AdminArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (status !== "all") params.set("status", status);
            if (search) params.set("search", search);
            const res = await fetch(`/api/admin/articles?${params}`);
            const data = await res.json();
            if (data.success) setArticles(data.articles);
        } finally {
            setLoading(false);
        }
    }, [status, search]);

    useEffect(() => { load(); }, [load]);

    return (
        <div>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div>
                    <h1 className="text-xl font-semibold text-[#1c3a3a]">Articles</h1>
                    <p className="text-sm text-[#7a9088]">Written and published from here — no more hardcoding.</p>
                </div>
                <Link
                    href="/admin/articles/new"
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-white cursor-pointer"
                    style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                >
                    <Plus size={14} /> New article
                </Link>
            </div>

            <div className="flex items-center gap-3 mb-5 flex-wrap">
                <div className="relative flex-1 min-w-[220px]">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0b8ac]" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by title or slug..."
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm outline-none bg-white"
                        style={{ borderColor: "#e4eee8" }}
                    />
                </div>
                <div className="flex gap-1.5">
                    {["all", "published", "draft"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatus(s)}
                            className="px-3.5 py-2 rounded-full text-xs font-medium capitalize cursor-pointer border"
                            style={{
                                borderColor: status === s ? "var(--sage)" : "#e4eee8",
                                background: status === s ? "rgba(123,169,139,0.10)" : "white",
                                color: status === s ? "var(--sage-dark)" : "#7a9088",
                            }}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16 text-[#a0b8ac]">
                    <Loader2 size={20} className="animate-spin" />
                </div>
            ) : articles.length === 0 ? (
                <div className="text-center py-16 rounded-2xl border bg-white" style={{ borderColor: "#e4eee8" }}>
                    <FileText size={28} className="mx-auto mb-3 text-[#c8ddd2]" />
                    <p className="text-sm text-[#7a9088] mb-4">No articles yet.</p>
                    <Link href="/admin/articles/new" className="text-sm font-medium text-[#3d8b8b]">Write your first article →</Link>
                </div>
            ) : (
                <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: "#e4eee8" }}>
                    {articles.map((a) => (
                        <Link
                            key={a.id}
                            href={`/admin/articles/${a.id}`}
                            className="flex items-center gap-4 px-5 py-4 border-b last:border-b-0 hover:bg-[#f7faf8] transition-colors"
                            style={{ borderColor: "#eef3f0" }}
                        >
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    {a.featured && <Star size={12} className="text-[#cf9f5e] fill-[#cf9f5e] shrink-0" />}
                                    <span className="text-sm font-medium text-[#1c3a3a] truncate">{a.title}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-xs text-[#a0b8ac]">
                                    <span>{a.category}</span>
                                    <span>·</span>
                                    <span>/{a.slug}</span>
                                </div>
                            </div>
                            <span
                                className="text-xs font-medium px-2.5 py-1 rounded-full capitalize shrink-0"
                                style={{
                                    background: a.status === "published" ? "rgba(78,140,106,0.1)" : "rgba(150,150,150,0.1)",
                                    color: a.status === "published" ? "#4e8c6a" : "#888",
                                }}
                            >
                                {a.status}
                            </span>
                            {a.seoScore !== null && (
                                <span
                                    className="text-xs font-semibold shrink-0"
                                    style={{ color: a.seoScore >= 80 ? "#4e8c6a" : a.seoScore >= 60 ? "#cf9f5e" : "#b94a4f" }}
                                >
                                    {a.seoScore}
                                </span>
                            )}
                            {a.status === "published" && (
                                <a
                                    href={`/articles/${a.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-[#a0b8ac] hover:text-[#3d8b8b] shrink-0"
                                >
                                    <ExternalLink size={14} />
                                </a>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
