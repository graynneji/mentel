import ArticleEditor from "@/components/ArticleEditor";

export default function NewArticlePage() {
    return (
        <div>
            <div className="mb-5">
                <h1 className="text-xl font-semibold text-[#1c3a3a]">New Article</h1>
                <p className="text-sm text-[#7a9088]">Write in Markdown — save as a draft or publish immediately.</p>
            </div>
            <ArticleEditor />
        </div>
    );
}
