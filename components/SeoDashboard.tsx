"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
    Loader2, RefreshCw, Send, CheckCircle2, AlertTriangle, ExternalLink,
    Sparkles, Search, ChevronDown, ChevronUp,
} from "lucide-react";

interface ScoredArticle {
    id: string;
    slug: string;
    title: string;
    category: string;
    status: string;
    source: "db" | "static";
    url: string;
    score: {
        overallScore: number;
        keywordScore: number;
        contentScore: number;
        technicalScore: number;
        structureScore: number;
        readabilityScore: number;
        suggestions: string[];
    };
    keywordAnalysis: {
        missingTargetKeywords: string[];
        suggestedKeywords: { phrase: string; count: number }[];
    };
    lastIndexedAt: string | null;
    updatedAt: string | null;
    editable: boolean;
}

interface StaticPage {
    path: string;
    label: string;
    url: string;
}

function scoreColor(score: number) {
    if (score >= 80) return "#4e8c6a";
    if (score >= 60) return "#cf9f5e";
    return "#b94a4f";
}

export default function SeoDashboard() {
    const [articles, setArticles] = useState<ScoredArticle[]>([]);
    const [staticPages, setStaticPages] = useState<StaticPage[]>([]);
    const [avgScore, setAvgScore] = useState(0);
    const [googleConfigured, setGoogleConfigured] = useState(false);
    const [baseUrl, setBaseUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [indexing, setIndexing] = useState<Record<string, "pending" | "done" | "error">>({});
    const [bulkIndexing, setBulkIndexing] = useState(false);
    const [indexMessage, setIndexMessage] = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/seo/pages");
            const data = await res.json();
            if (data.success) {
                setArticles(data.articles);
                setStaticPages(data.staticPages);
                setAvgScore(data.avgScore);
                setGoogleConfigured(data.googleIndexingConfigured);
                setBaseUrl(data.baseUrl);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    async function submitForIndexing(paths: string[], key: string) {
        setIndexing((s) => ({ ...s, [key]: "pending" }));
        setIndexMessage("");
        try {
            const res = await fetch("/api/admin/seo/index-url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paths }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                setIndexing((s) => ({ ...s, [key]: "error" }));
                setIndexMessage(data.error ?? "Indexing submission failed.");
                return;
            }
            const failed = data.results.filter((r: { success: boolean }) => !r.success);
            setIndexing((s) => ({ ...s, [key]: failed.length === 0 ? "done" : "error" }));
            if (failed.length > 0) {
                setIndexMessage(`${data.results.length - failed.length}/${data.results.length} submitted. First error: ${failed[0].error}`);
            }
        } catch {
            setIndexing((s) => ({ ...s, [key]: "error" }));
            setIndexMessage("Network error submitting to Google.");
        }
    }

    async function submitAllPublished() {
        setBulkIndexing(true);
        const paths = [
            ...articles.filter((a) => a.status === "published").map((a) => a.url),
            ...staticPages.map((p) => p.url),
        ];
        await submitForIndexing(paths, "__all__");
        setBulkIndexing(false);
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16 text-[#a0b8ac]">
                <Loader2 size={20} className="animate-spin" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div>
                    <h1 className="text-xl font-semibold text-[#1c3a3a]">SEO Dashboard</h1>
                    <p className="text-sm text-[#7a9088]">Live scores from your actual content, keyword gaps, and one-click Google indexing.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={load}
                        className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium border cursor-pointer"
                        style={{ borderColor: "#e4eee8", color: "#5a7a6e" }}
                    >
                        <RefreshCw size={13} /> Refresh
                    </button>
                    <button
                        onClick={submitAllPublished}
                        disabled={bulkIndexing || !googleConfigured}
                        className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-white cursor-pointer disabled:opacity-50"
                        style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                        title={!googleConfigured ? "Add GOOGLE_INDEXING_CLIENT_EMAIL / GOOGLE_INDEXING_PRIVATE_KEY to .env first" : ""}
                    >
                        {bulkIndexing ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                        Submit all published for indexing
                    </button>
                </div>
            </div>

            {!googleConfigured && (
                <div className="mb-5 rounded-xl border p-4 flex items-start gap-2.5 text-sm" style={{ borderColor: "rgba(207,159,94,0.3)", background: "rgba(207,159,94,0.08)", color: "#8b6e3d" }}>
                    <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                    <span>
                        Google Indexing isn&apos;t connected yet. Add <code className="font-mono text-xs">GOOGLE_INDEXING_CLIENT_EMAIL</code> and{" "}
                        <code className="font-mono text-xs">GOOGLE_INDEXING_PRIVATE_KEY</code> to your <code className="font-mono text-xs">.env</code> (service account with Search Console access) — see <code className="font-mono text-xs">lib/seo/google-indexing.ts</code> for setup steps.
                    </span>
                </div>
            )}

            {indexMessage && (
                <div className="mb-5 rounded-xl border p-3 text-sm" style={{ borderColor: "#e4eee8", background: "#f7faf8", color: "#5a7a6e" }}>
                    {indexMessage}
                </div>
            )}

            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="rounded-2xl border bg-white p-4" style={{ borderColor: "#e4eee8" }}>
                    <p className="text-2xl font-bold" style={{ color: scoreColor(avgScore) }}>{avgScore}</p>
                    <p className="text-xs text-[#a0b8ac] mt-1">Average SEO score</p>
                </div>
                <div className="rounded-2xl border bg-white p-4" style={{ borderColor: "#e4eee8" }}>
                    <p className="text-2xl font-bold text-[#1c3a3a]">{articles.length}</p>
                    <p className="text-xs text-[#a0b8ac] mt-1">Articles tracked</p>
                </div>
                <div className="rounded-2xl border bg-white p-4" style={{ borderColor: "#e4eee8" }}>
                    <p className="text-2xl font-bold text-[#1c3a3a]">{articles.filter((a) => a.status === "published").length}</p>
                    <p className="text-xs text-[#a0b8ac] mt-1">Published</p>
                </div>
                <div className="rounded-2xl border bg-white p-4" style={{ borderColor: "#e4eee8" }}>
                    <p className="text-2xl font-bold text-[#1c3a3a]">{articles.filter((a) => a.lastIndexedAt).length}</p>
                    <p className="text-xs text-[#a0b8ac] mt-1">Submitted to Google</p>
                </div>
            </div>

            {/* Static marketing pages */}
            <p className="text-xs font-medium uppercase tracking-widest mb-2.5 text-[#7a9088]">Marketing pages</p>
            <div className="rounded-2xl border bg-white overflow-hidden mb-6" style={{ borderColor: "#e4eee8" }}>
                {staticPages.map((p) => (
                    <div key={p.path} className="flex items-center gap-3 px-5 py-3 border-b last:border-b-0" style={{ borderColor: "#eef3f0" }}>
                        <span className="text-sm font-medium text-[#1c3a3a] flex-1">{p.label}</span>
                        <span className="text-xs text-[#a0b8ac]">{p.path}</span>
                        <Link href={`${baseUrl}${p.path}`} target="_blank" rel="noopener noreferrer" className="text-[#a0b8ac] hover:text-[#3d8b8b]">
                            <ExternalLink size={14} />
                        </Link>
                        <button
                            onClick={() => submitForIndexing([p.path], p.path)}
                            disabled={indexing[p.path] === "pending" || !googleConfigured}
                            className="text-xs font-medium px-3 py-1.5 rounded-full border cursor-pointer disabled:opacity-50 flex items-center gap-1"
                            style={{ borderColor: "#e4eee8", color: "#3d8b8b" }}
                        >
                            {indexing[p.path] === "pending" ? <Loader2 size={11} className="animate-spin" /> : indexing[p.path] === "done" ? <CheckCircle2 size={11} /> : <Send size={11} />}
                            {indexing[p.path] === "done" ? "Submitted" : "Index"}
                        </button>
                    </div>
                ))}
            </div>

            {/* Articles */}
            <p className="text-xs font-medium uppercase tracking-widest mb-2.5 text-[#7a9088]">Articles (lowest score first)</p>
            <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: "#e4eee8" }}>
                {articles.map((a) => {
                    const isOpen = expanded === a.id;
                    return (
                        <div key={a.id} className="border-b last:border-b-0" style={{ borderColor: "#eef3f0" }}>
                            <button
                                onClick={() => setExpanded(isOpen ? null : a.id)}
                                className="w-full flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-[#f7faf8] transition-colors text-left"
                            >
                                <span className="text-lg font-bold w-9 shrink-0" style={{ color: scoreColor(a.score.overallScore) }}>
                                    {a.score.overallScore}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-[#1c3a3a] truncate">{a.title}</p>
                                    <div className="flex items-center gap-2 mt-0.5 text-xs text-[#a0b8ac]">
                                        <span>{a.category}</span>
                                        <span>·</span>
                                        <span className="capitalize">{a.status}</span>
                                        {a.source === "static" && <><span>·</span><span>legacy (not editable here)</span></>}
                                        {a.lastIndexedAt && <><span>·</span><span>indexed {new Date(a.lastIndexedAt).toLocaleDateString()}</span></>}
                                    </div>
                                </div>
                                {a.editable && (
                                    <Link href={`/admin/articles/${a.id}`} onClick={(e) => e.stopPropagation()} className="text-xs font-medium text-[#3d8b8b] shrink-0">
                                        Edit
                                    </Link>
                                )}
                                {isOpen ? <ChevronUp size={14} className="text-[#a0b8ac] shrink-0" /> : <ChevronDown size={14} className="text-[#a0b8ac] shrink-0" />}
                            </button>

                            {isOpen && (
                                <div className="px-5 pb-5">
                                    <div className="grid sm:grid-cols-5 gap-2 mb-4">
                                        {[
                                            ["Keywords", a.score.keywordScore],
                                            ["Content", a.score.contentScore],
                                            ["Technical", a.score.technicalScore],
                                            ["Structure", a.score.structureScore],
                                            ["Readability", a.score.readabilityScore],
                                        ].map(([label, value]) => (
                                            <div key={label as string} className="rounded-lg p-2.5 text-center" style={{ background: "#f7faf8" }}>
                                                <p className="text-sm font-bold" style={{ color: scoreColor(value as number) }}>{value}</p>
                                                <p className="text-[10px] text-[#a0b8ac] uppercase tracking-wide">{label}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {a.score.suggestions.length > 0 && (
                                        <div className="mb-3">
                                            <p className="text-xs font-semibold text-[#5a7a6e] mb-1.5 flex items-center gap-1"><Sparkles size={11} /> On-page suggestions</p>
                                            <ul className="text-xs text-[#7a9088] list-disc ml-4 space-y-1">
                                                {a.score.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                                            </ul>
                                        </div>
                                    )}

                                    {(a.keywordAnalysis.missingTargetKeywords.length > 0 || a.keywordAnalysis.suggestedKeywords.length > 0) && (
                                        <div className="mb-4">
                                            <p className="text-xs font-semibold text-[#5a7a6e] mb-1.5 flex items-center gap-1"><Search size={11} /> Keyword check</p>
                                            {a.keywordAnalysis.missingTargetKeywords.length > 0 && (
                                                <p className="text-xs text-[#b94a4f] mb-1">
                                                    Target but not found in content: {a.keywordAnalysis.missingTargetKeywords.join(", ")}
                                                </p>
                                            )}
                                            {a.keywordAnalysis.suggestedKeywords.length > 0 && (
                                                <p className="text-xs text-[#7a9088]">
                                                    Frequent in your content but not targeted: {a.keywordAnalysis.suggestedKeywords.map((k) => `${k.phrase} (${k.count}×)`).join(", ")}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2">
                                        <Link href={`${baseUrl}${a.url}`} target="_blank" rel="noopener noreferrer" className="text-xs font-medium px-3 py-1.5 rounded-full border text-[#5a7a6e]" style={{ borderColor: "#e4eee8" }}>
                                            View page
                                        </Link>
                                        <button
                                            onClick={() => submitForIndexing([a.url], a.id)}
                                            disabled={indexing[a.id] === "pending" || !googleConfigured || a.status !== "published"}
                                            className="text-xs font-medium px-3 py-1.5 rounded-full border cursor-pointer disabled:opacity-50 flex items-center gap-1"
                                            style={{ borderColor: "#e4eee8", color: "#3d8b8b" }}
                                        >
                                            {indexing[a.id] === "pending" ? <Loader2 size={11} className="animate-spin" /> : indexing[a.id] === "done" ? <CheckCircle2 size={11} /> : <Send size={11} />}
                                            {indexing[a.id] === "done" ? "Submitted" : "Submit for indexing"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
