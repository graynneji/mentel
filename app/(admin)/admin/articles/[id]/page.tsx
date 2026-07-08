"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import ArticleEditor, { type ArticleFormData } from "@/components/ArticleEditor";

interface DbArticle {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    tags: string[];
    keywords: string[];
    image: string | null;
    readMin: number;
    featured: boolean;
    content: string;
    metaTitle: string | null;
    metaDescription: string | null;
    status: "draft" | "published";
}

export default function EditArticlePage() {
    const params = useParams<{ id: string }>();
    const [initial, setInitial] = useState<Partial<ArticleFormData> | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`/api/admin/articles/${params.id}`);
                const data = await res.json();
                if (!data.success) {
                    setNotFound(true);
                    return;
                }
                const a: DbArticle = data.article;
                setInitial({
                    title: a.title,
                    slug: a.slug,
                    excerpt: a.excerpt,
                    category: a.category,
                    tags: a.tags.join(", "),
                    keywords: a.keywords.join(", "),
                    image: a.image ?? "",
                    readMin: a.readMin,
                    featured: a.featured,
                    content: a.content,
                    metaTitle: a.metaTitle ?? "",
                    metaDescription: a.metaDescription ?? "",
                    status: a.status,
                });
            } finally {
                setLoading(false);
            }
        })();
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16 text-[#a0b8ac]">
                <Loader2 size={20} className="animate-spin" />
            </div>
        );
    }

    if (notFound || !initial) {
        return <p className="text-sm text-[#7a9088]">Article not found.</p>;
    }

    return (
        <div>
            <div className="mb-5">
                <h1 className="text-xl font-semibold text-[#1c3a3a]">Edit Article</h1>
                <p className="text-sm text-[#7a9088]">/{initial.slug}</p>
            </div>
            <ArticleEditor initial={initial} articleId={params.id} />
        </div>
    );
}
