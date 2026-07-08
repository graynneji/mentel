// app/(admin)/admin/seo-report/page.tsx
// SEO Dashboard — real scores computed from actual article content (DB +
// legacy static), on-page keyword gap analysis, and one-click Google
// Indexing API submission. See components/admin/SeoDashboard.tsx for the
// interactive UI and app/api/admin/seo/* for the underlying endpoints.

import SeoDashboard from "@/components/SeoDashboard";

export default function SEOReportPage() {
    return <SeoDashboard />;
}
