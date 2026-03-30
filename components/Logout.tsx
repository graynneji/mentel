"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";

export default function AdminLogout() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleLogout() {
        setLoading(true);
        await fetch("/api/admin/auth", { method: "DELETE" });
        router.push("/login");
        router.refresh();
    }

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 14px", borderRadius: 10,
                border: "1px solid #e8ddd2",
                background: "white", color: "#b94a4f",
                fontSize: 12, fontWeight: 500,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
                transition: "all 0.15s",
                fontFamily: "DM Sans, sans-serif",
            }}
        >
            <LogOut size={13} />
            {loading ? "Signing out…" : "Sign out"}
        </button>
    );
}