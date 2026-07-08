

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Loader2, Save, Trash2, Sparkles, Eye, EyeOff } from "lucide-react";
// import { marked } from "marked";

// export interface ArticleFormData {
//     id?: string;
//     title: string;
//     slug: string;
//     excerpt: string;
//     category: string;
//     tags: string;
//     keywords: string;
//     image: string;
//     readMin: number;
//     featured: boolean;
//     content: string;
//     metaTitle: string;
//     metaDescription: string;
//     status: "draft" | "published";
// }

// const emptyForm: ArticleFormData = {
//     title: "",
//     slug: "",
//     excerpt: "",
//     category: "Getting Started",
//     tags: "",
//     keywords: "",
//     image: "",
//     readMin: 5,
//     featured: false,
//     content: "",
//     metaTitle: "",
//     metaDescription: "",
//     status: "draft",
// };

// const CATEGORIES = [
//     "Access to Care", "Getting Started", "Anxiety", "Depression",
//     "Relationships", "Burnout", "Trauma", "General",
// ];

// function slugify(input: string): string {
//     return input.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
// }

// const inputClass = "w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors focus:border-[var(--sage)] bg-white";
// const labelClass = "block text-xs font-medium uppercase tracking-widest mb-1.5 text-[#7a9088]";

// export default function ArticleEditor({ initial, articleId }: { initial?: Partial<ArticleFormData>; articleId?: string }) {
//     const router = useRouter();
//     const [form, setForm] = useState<ArticleFormData>({ ...emptyForm, ...initial });
//     const [slugTouched, setSlugTouched] = useState(!!initial?.slug);
//     const [saving, setSaving] = useState(false);
//     const [deleting, setDeleting] = useState(false);
//     const [error, setError] = useState("");
//     const [errors, setErrors] = useState<Record<string, string>>({});
//     const [preview, setPreview] = useState(false);
//     const [optimizing, setOptimizing] = useState(false);
//     const [suggestions, setSuggestions] = useState<{
//         suggestedMetaTitle: string | null;
//         suggestedMetaDescription: string | null;
//         suggestedKeywordsToAdd: string[];
//         reasons: string[];
//     } | null>(null);

//     function update<K extends keyof ArticleFormData>(key: K, value: ArticleFormData[K]) {
//         setForm((f) => ({ ...f, [key]: value }));
//         setErrors((e) => ({ ...e, [key]: "" }));
//     }

//     function handleTitleChange(value: string) {
//         update("title", value);
//         if (!slugTouched) update("slug", slugify(value));
//     }

//     async function handleSave(nextStatus?: "draft" | "published") {
//         setSaving(true);
//         setError("");
//         try {
//             const payload = {
//                 title: form.title,
//                 slug: form.slug || slugify(form.title),
//                 excerpt: form.excerpt,
//                 category: form.category,
//                 tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
//                 keywords: form.keywords.split(",").map((k) => k.trim()).filter(Boolean),
//                 image: form.image || null,
//                 readMin: form.readMin,
//                 featured: form.featured,
//                 content: form.content,
//                 metaTitle: form.metaTitle || null,
//                 metaDescription: form.metaDescription || null,
//                 status: nextStatus ?? form.status,
//             };

//             const url = articleId ? `/api/admin/articles/${articleId}` : "/api/admin/articles";
//             const method = articleId ? "PATCH" : "POST";
//             const res = await fetch(url, {
//                 method,
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(payload),
//             });
//             const data = await res.json();

//             if (!res.ok || !data.success) {
//                 if (data.errors) setErrors(data.errors);
//                 setError(data.error ?? "Something went wrong.");
//                 return;
//             }

//             if (nextStatus) update("status", nextStatus);
//             router.push("/admin/articles");
//             router.refresh();
//         } catch {
//             setError("Network error. Please try again.");
//         } finally {
//             setSaving(false);
//         }
//     }

//     async function handleDelete() {
//         if (!articleId) return;
//         if (!confirm("Delete this article permanently? This can't be undone.")) return;
//         setDeleting(true);
//         try {
//             await fetch(`/api/admin/articles/${articleId}`, { method: "DELETE" });
//             router.push("/admin/articles");
//             router.refresh();
//         } finally {
//             setDeleting(false);
//         }
//     }

//     async function handleOptimize() {
//         if (!articleId) return;
//         setOptimizing(true);
//         try {
//             const res = await fetch("/api/admin/seo/optimize", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ id: articleId }),
//             });
//             const data = await res.json();
//             if (data.success) setSuggestions(data.suggestions);
//         } finally {
//             setOptimizing(false);
//         }
//     }

//     function applySuggestions() {
//         if (!suggestions) return;
//         if (suggestions.suggestedMetaTitle) update("metaTitle", suggestions.suggestedMetaTitle);
//         if (suggestions.suggestedMetaDescription) update("metaDescription", suggestions.suggestedMetaDescription);
//         if (suggestions.suggestedKeywordsToAdd.length > 0) {
//             const existing = form.keywords.split(",").map((k) => k.trim()).filter(Boolean);
//             update("keywords", [...new Set([...existing, ...suggestions.suggestedKeywordsToAdd])].join(", "));
//         }
//         setSuggestions(null);
//     }

//     return (
//         <div className="max-w-4xl">
//             <div className="grid md:grid-cols-2 gap-4 mb-4">
//                 <div>
//                     <label className={labelClass}>Title</label>
//                     <input className={inputClass} value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Article title" />
//                     {errors.title && <p className="text-xs mt-1 text-[#b94a4f]">{errors.title}</p>}
//                 </div>
//                 <div>
//                     <label className={labelClass}>Slug</label>
//                     <input
//                         className={inputClass}
//                         value={form.slug}
//                         onChange={(e) => { setSlugTouched(true); update("slug", slugify(e.target.value)); }}
//                         placeholder="article-url-slug"
//                     />
//                     {errors.slug && <p className="text-xs mt-1 text-[#b94a4f]">{errors.slug}</p>}
//                 </div>
//             </div>

//             <div className="mb-4">
//                 <label className={labelClass}>Excerpt</label>
//                 <textarea className={`${inputClass} resize-none`} rows={2} value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} placeholder="One or two sentences shown on the articles list" />
//             </div>

//             <div className="grid md:grid-cols-3 gap-4 mb-4">
//                 <div>
//                     <label className={labelClass}>Category</label>
//                     <select className={inputClass} value={form.category} onChange={(e) => update("category", e.target.value)}>
//                         {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
//                     </select>
//                 </div>
//                 <div>
//                     <label className={labelClass}>Read time (min)</label>
//                     <input type="number" min={1} className={inputClass} value={form.readMin} onChange={(e) => update("readMin", Number(e.target.value))} />
//                 </div>
//                 <div>
//                     <label className={labelClass}>Cover image path</label>
//                     <input className={inputClass} value={form.image} onChange={(e) => update("image", e.target.value)} placeholder="/my-image.jpg" />
//                 </div>
//             </div>

//             <div className="grid md:grid-cols-2 gap-4 mb-4">
//                 <div>
//                     <label className={labelClass}>Tags (comma separated)</label>
//                     <input className={inputClass} value={form.tags} onChange={(e) => update("tags", e.target.value)} placeholder="Anxiety, Culture" />
//                 </div>
//                 <div>
//                     <label className={labelClass}>Target SEO keywords (comma separated)</label>
//                     <input className={inputClass} value={form.keywords} onChange={(e) => update("keywords", e.target.value)} placeholder="online therapy Nigeria, ..." />
//                 </div>
//             </div>

//             <div className="mb-2 flex items-center justify-between">
//                 <label className={labelClass}>Content (Markdown)</label>
//                 <button
//                     type="button"
//                     onClick={() => setPreview((p) => !p)}
//                     className="flex items-center gap-1.5 text-xs font-medium text-[#3d8b8b] hover:opacity-70 cursor-pointer"
//                 >
//                     {preview ? <EyeOff size={13} /> : <Eye size={13} />}
//                     {preview ? "Edit" : "Preview"}
//                 </button>
//             </div>
//             {preview ? (
//                 <div
//                     className="article-content border rounded-xl p-4 mb-1 min-h-[300px] bg-white"
//                     style={{ borderColor: "#e4eee8" }}
//                     dangerouslySetInnerHTML={{ __html: marked.parse(form.content || "*Nothing to preview yet.*", { async: false }) as string }}
//                 />
//             ) : (
//                 <textarea
//                     className={`${inputClass} font-mono text-[13px] leading-relaxed`}
//                     rows={16}
//                     value={form.content}
//                     onChange={(e) => update("content", e.target.value)}
//                     placeholder={"## A section heading\n\nWrite your article body in Markdown — headings, **bold**, lists, [links](/path), etc."}
//                 />
//             )}
//             {errors.content && <p className="text-xs mt-1 text-[#b94a4f]">{errors.content}</p>}

//             <div className="grid md:grid-cols-2 gap-4 mt-4 mb-4">
//                 <div>
//                     <label className={labelClass}>Meta title <span className="normal-case font-normal">(optional — overrides title in search results)</span></label>
//                     <input className={inputClass} value={form.metaTitle} onChange={(e) => update("metaTitle", e.target.value)} placeholder={form.title || "Falls back to Title"} />
//                 </div>
//                 <div>
//                     <label className={labelClass}>Meta description <span className="normal-case font-normal">(optional)</span></label>
//                     <input className={inputClass} value={form.metaDescription} onChange={(e) => update("metaDescription", e.target.value)} placeholder={form.excerpt || "Falls back to Excerpt"} />
//                 </div>
//             </div>

//             {articleId && (
//                 <div className="mb-6 rounded-xl border p-4" style={{ borderColor: "#e4eee8", background: "#f7faf8" }}>
//                     <div className="flex items-center justify-between mb-2">
//                         <span className="text-xs font-semibold uppercase tracking-widest text-[#4e8c6a] flex items-center gap-1.5">
//                             <Sparkles size={13} /> SEO auto-optimize
//                         </span>
//                         <button
//                             type="button"
//                             onClick={handleOptimize}
//                             disabled={optimizing}
//                             className="text-xs font-medium text-[#3d8b8b] hover:opacity-70 cursor-pointer disabled:opacity-50"
//                         >
//                             {optimizing ? "Analyzing…" : "Get suggestions"}
//                         </button>
//                     </div>
//                     {suggestions && (
//                         suggestions.reasons.length > 0 ? (
//                             <div>
//                                 <ul className="text-xs text-[#5a7a6e] list-disc ml-4 space-y-1 mb-3">
//                                     {suggestions.reasons.map((r, i) => <li key={i}>{r}</li>)}
//                                 </ul>
//                                 <button
//                                     type="button"
//                                     onClick={applySuggestions}
//                                     className="text-xs font-semibold px-3 py-1.5 rounded-full text-white cursor-pointer"
//                                     style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
//                                 >
//                                     Apply suggestions to form
//                                 </button>
//                             </div>
//                         ) : (
//                             <p className="text-xs text-[#5a7a6e]">Looking good — no obvious gaps found.</p>
//                         )
//                     )}
//                 </div>
//             )}

//             {error && <p className="text-sm mb-4 text-[#b94a4f]">{error}</p>}

//             <div className="flex items-center gap-3 flex-wrap">
//                 <button
//                     type="button"
//                     disabled={saving}
//                     onClick={() => handleSave("draft")}
//                     className="px-4 py-2.5 rounded-xl text-sm font-medium border cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
//                     style={{ borderColor: "#e4eee8", color: "#5a7a6e" }}
//                 >
//                     {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
//                     Save draft
//                 </button>
//                 <button
//                     type="button"
//                     disabled={saving}
//                     onClick={() => handleSave("published")}
//                     className="px-4 py-2.5 rounded-xl text-sm font-medium text-white cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
//                     style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
//                 >
//                     {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
//                     {form.status === "published" ? "Update & keep published" : "Publish"}
//                 </button>
//                 {articleId && (
//                     <button
//                         type="button"
//                         disabled={deleting}
//                         onClick={handleDelete}
//                         className="ml-auto px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer disabled:opacity-60 flex items-center gap-1.5 text-[#b94a4f] hover:bg-[#fdf2f2]"
//                     >
//                         {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
//                         Delete
//                     </button>
//                 )}
//             </div>
//         </div>
//     );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Trash2, Sparkles, Eye, EyeOff, ImagePlus } from "lucide-react";
import { marked } from "marked";

export interface ArticleFormData {
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    tags: string;
    keywords: string;
    image: string;
    readMin: number;
    featured: boolean;
    content: string;
    metaTitle: string;
    metaDescription: string;
    status: "draft" | "published";
}

const emptyForm: ArticleFormData = {
    title: "",
    slug: "",
    excerpt: "",
    category: "Getting Started",
    tags: "",
    keywords: "",
    image: "",
    readMin: 5,
    featured: false,
    content: "",
    metaTitle: "",
    metaDescription: "",
    status: "draft",
};

const CATEGORIES = [
    "Access to Care", "Getting Started", "Anxiety", "Depression",
    "Relationships", "Burnout", "Trauma", "General",
];

function slugify(input: string): string {
    return input.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

const inputClass = "w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors focus:border-[var(--sage)] bg-white";
const labelClass = "block text-xs font-medium uppercase tracking-widest mb-1.5 text-[#7a9088]";

export default function ArticleEditor({ initial, articleId }: { initial?: Partial<ArticleFormData>; articleId?: string }) {
    const router = useRouter();
    const [form, setForm] = useState<ArticleFormData>({ ...emptyForm, ...initial });
    const [slugTouched, setSlugTouched] = useState(!!initial?.slug);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [preview, setPreview] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [optimizing, setOptimizing] = useState(false);
    const [applying, setApplying] = useState(false);
    const [suggestions, setSuggestions] = useState<{
        suggestedMetaTitle: string | null;
        suggestedMetaDescription: string | null;
        suggestedKeywordsToAdd: string[];
        reasons: string[];
    } | null>(null);

    function update<K extends keyof ArticleFormData>(key: K, value: ArticleFormData[K]) {
        setForm((f) => ({ ...f, [key]: value }));
        setErrors((e) => ({ ...e, [key]: "" }));
    }

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        e.target.value = ""; // allow re-selecting the same file later
        if (!file) return;

        setUploading(true);
        setUploadError("");
        try {
            const body = new FormData();
            body.append("file", file);
            const res = await fetch("/api/admin/upload", { method: "POST", body });
            const data = await res.json();
            if (!res.ok || !data.success) {
                setUploadError(data.error ?? "Upload failed. Please try again.");
                return;
            }
            update("image", data.url);
        } catch {
            setUploadError("Network error uploading image.");
        } finally {
            setUploading(false);
        }
    }

    function handleTitleChange(value: string) {
        update("title", value);
        if (!slugTouched) update("slug", slugify(value));
    }

    async function handleSave(nextStatus?: "draft" | "published") {
        setSaving(true);
        setError("");
        try {
            const payload = {
                title: form.title,
                slug: form.slug || slugify(form.title),
                excerpt: form.excerpt,
                category: form.category,
                tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
                keywords: form.keywords.split(",").map((k) => k.trim()).filter(Boolean),
                image: form.image || null,
                readMin: form.readMin,
                featured: form.featured,
                content: form.content,
                metaTitle: form.metaTitle || null,
                metaDescription: form.metaDescription || null,
                status: nextStatus ?? form.status,
            };

            const url = articleId ? `/api/admin/articles/${articleId}` : "/api/admin/articles";
            const method = articleId ? "PATCH" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (!res.ok || !data.success) {
                if (data.errors) setErrors(data.errors);
                setError(data.error ?? "Something went wrong.");
                return;
            }

            if (nextStatus) update("status", nextStatus);
            router.push("/admin/articles");
            router.refresh();
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!articleId) return;
        if (!confirm("Delete this article permanently? This can't be undone.")) return;
        setDeleting(true);
        try {
            await fetch(`/api/admin/articles/${articleId}`, { method: "DELETE" });
            router.push("/admin/articles");
            router.refresh();
        } finally {
            setDeleting(false);
        }
    }

    async function handleOptimize() {
        if (!articleId) return;
        setOptimizing(true);
        try {
            const res = await fetch("/api/admin/seo/optimize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: articleId }),
            });
            const data = await res.json();
            if (data.success) setSuggestions(data.suggestions);
        } finally {
            setOptimizing(false);
        }
    }

    async function applySuggestions() {
        if (!suggestions || !articleId) return;
        setApplying(true);
        try {
            // Actually persist the change — previously this only updated local
            // form state, so re-running "Get suggestions" re-read the
            // unchanged database record and showed the exact same suggestion
            // again. Passing apply:true writes it straight to the article.
            const res = await fetch("/api/admin/seo/optimize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: articleId, apply: true }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                setError(data.error ?? "Failed to apply suggestions.");
                return;
            }
            const applied = data.article;
            update("metaTitle", applied.metaTitle ?? "");
            update("metaDescription", applied.metaDescription ?? "");
            update("keywords", (applied.keywords ?? []).join(", "));
            setSuggestions(null);
        } finally {
            setApplying(false);
        }
    }

    return (
        <div className="max-w-4xl">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className={labelClass}>Title</label>
                    <input className={inputClass} value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Article title" />
                    {errors.title && <p className="text-xs mt-1 text-[#b94a4f]">{errors.title}</p>}
                </div>
                <div>
                    <label className={labelClass}>Slug</label>
                    <input
                        className={inputClass}
                        value={form.slug}
                        onChange={(e) => { setSlugTouched(true); update("slug", slugify(e.target.value)); }}
                        placeholder="article-url-slug"
                    />
                    {errors.slug && <p className="text-xs mt-1 text-[#b94a4f]">{errors.slug}</p>}
                </div>
            </div>

            <div className="mb-4">
                <label className={labelClass}>Excerpt</label>
                <textarea className={`${inputClass} resize-none`} rows={2} value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} placeholder="One or two sentences shown on the articles list" />
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className={labelClass}>Category</label>
                    <select className={inputClass} value={form.category} onChange={(e) => update("category", e.target.value)}>
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label className={labelClass}>Read time (min)</label>
                    <input type="number" min={1} className={inputClass} value={form.readMin} onChange={(e) => update("readMin", Number(e.target.value))} />
                </div>
            </div>

            <div className="mb-4">
                <label className={labelClass}>Cover image</label>
                <div className="flex items-start gap-3">
                    {form.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={form.image}
                            alt=""
                            className="w-20 h-20 rounded-xl object-cover border shrink-0"
                            style={{ borderColor: "#e4eee8" }}
                        />
                    )}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <label
                                className="text-xs font-medium px-3 py-2 rounded-lg border cursor-pointer inline-flex items-center gap-1.5"
                                style={{ borderColor: "#e4eee8", color: "#3d8b8b" }}
                            >
                                {uploading ? <Loader2 size={13} className="animate-spin" /> : <ImagePlus size={13} />}
                                {uploading ? "Uploading…" : "Upload image"}
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                                    className="hidden"
                                    disabled={uploading}
                                    onChange={handleImageUpload}
                                />
                            </label>
                            {form.image && (
                                <button
                                    type="button"
                                    onClick={() => update("image", "")}
                                    className="text-xs font-medium text-[#b94a4f] cursor-pointer"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                        <input
                            className={`${inputClass} mt-2 text-xs`}
                            value={form.image}
                            onChange={(e) => update("image", e.target.value)}
                            placeholder="Or paste an image URL / /public path directly"
                        />
                        {uploadError && <p className="text-xs mt-1 text-[#b94a4f]">{uploadError}</p>}
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className={labelClass}>Tags (comma separated)</label>
                    <input className={inputClass} value={form.tags} onChange={(e) => update("tags", e.target.value)} placeholder="Anxiety, Culture" />
                </div>
                <div>
                    <label className={labelClass}>Target SEO keywords (comma separated)</label>
                    <input className={inputClass} value={form.keywords} onChange={(e) => update("keywords", e.target.value)} placeholder="online therapy Nigeria, ..." />
                </div>
            </div>

            <div className="mb-2 flex items-center justify-between">
                <label className={labelClass}>Content (Markdown)</label>
                <button
                    type="button"
                    onClick={() => setPreview((p) => !p)}
                    className="flex items-center gap-1.5 text-xs font-medium text-[#3d8b8b] hover:opacity-70 cursor-pointer"
                >
                    {preview ? <EyeOff size={13} /> : <Eye size={13} />}
                    {preview ? "Edit" : "Preview"}
                </button>
            </div>
            {preview ? (
                <div
                    className="article-content border rounded-xl p-4 mb-1 min-h-[300px] bg-white"
                    style={{ borderColor: "#e4eee8" }}
                    dangerouslySetInnerHTML={{ __html: marked.parse(form.content || "*Nothing to preview yet.*", { async: false }) as string }}
                />
            ) : (
                <textarea
                    className={`${inputClass} font-mono text-[13px] leading-relaxed`}
                    rows={16}
                    value={form.content}
                    onChange={(e) => update("content", e.target.value)}
                    placeholder={"## A section heading\n\nWrite your article body in Markdown — headings, **bold**, lists, [links](/path), etc."}
                />
            )}
            {errors.content && <p className="text-xs mt-1 text-[#b94a4f]">{errors.content}</p>}

            <div className="grid md:grid-cols-2 gap-4 mt-4 mb-4">
                <div>
                    <label className={labelClass}>Meta title <span className="normal-case font-normal">(optional — overrides title in search results)</span></label>
                    <input className={inputClass} value={form.metaTitle} onChange={(e) => update("metaTitle", e.target.value)} placeholder={form.title || "Falls back to Title"} />
                </div>
                <div>
                    <label className={labelClass}>Meta description <span className="normal-case font-normal">(optional)</span></label>
                    <input className={inputClass} value={form.metaDescription} onChange={(e) => update("metaDescription", e.target.value)} placeholder={form.excerpt || "Falls back to Excerpt"} />
                </div>
            </div>

            {articleId && (
                <div className="mb-6 rounded-xl border p-4" style={{ borderColor: "#e4eee8", background: "#f7faf8" }}>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold uppercase tracking-widest text-[#4e8c6a] flex items-center gap-1.5">
                            <Sparkles size={13} /> SEO auto-optimize
                        </span>
                        <button
                            type="button"
                            onClick={handleOptimize}
                            disabled={optimizing}
                            className="text-xs font-medium text-[#3d8b8b] hover:opacity-70 cursor-pointer disabled:opacity-50"
                        >
                            {optimizing ? "Analyzing…" : "Get suggestions"}
                        </button>
                    </div>
                    {suggestions && (
                        suggestions.reasons.length > 0 ? (
                            <div>
                                <ul className="text-xs text-[#5a7a6e] list-disc ml-4 space-y-1 mb-3">
                                    {suggestions.reasons.map((r, i) => <li key={i}>{r}</li>)}
                                </ul>
                                <button
                                    type="button"
                                    onClick={applySuggestions}
                                    disabled={applying}
                                    className="text-xs font-semibold px-3 py-1.5 rounded-full text-white cursor-pointer disabled:opacity-60"
                                    style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                                >
                                    {applying ? "Saving…" : "Apply & save suggestions"}
                                </button>
                            </div>
                        ) : (
                            <p className="text-xs text-[#5a7a6e]">Looking good — no obvious gaps found.</p>
                        )
                    )}
                </div>
            )}

            {error && <p className="text-sm mb-4 text-[#b94a4f]">{error}</p>}

            <div className="flex items-center gap-3 flex-wrap">
                <button
                    type="button"
                    disabled={saving}
                    onClick={() => handleSave("draft")}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium border cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
                    style={{ borderColor: "#e4eee8", color: "#5a7a6e" }}
                >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    Save draft
                </button>
                <button
                    type="button"
                    disabled={saving}
                    onClick={() => handleSave("published")}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium text-white cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
                    style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    {form.status === "published" ? "Update & keep published" : "Publish"}
                </button>
                {articleId && (
                    <button
                        type="button"
                        disabled={deleting}
                        onClick={handleDelete}
                        className="ml-auto px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer disabled:opacity-60 flex items-center gap-1.5 text-[#b94a4f] hover:bg-[#fdf2f2]"
                    >
                        {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
}
