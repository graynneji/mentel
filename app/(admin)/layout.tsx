// app/admin/layout.tsx
// Overrides root layout for all /admin routes.
// No nav, no footer, no sidebar — just renders children directly.

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}