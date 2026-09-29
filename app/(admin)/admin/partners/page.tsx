"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Network, Loader2, Plus, X, Copy, Check } from "lucide-react";

interface PartnerRow {
    id: string;
    name: string;
    slug: string;
    status: string;
    contactName: string;
    contactEmail: string;
    sessionCap: number;
    keyPrefix: string;
    webhookUrl: string | null;
    beneficiaryCount: number;
    atRiskCount: number;
    sessionsUsed: number;
    webhookHealth: "healthy" | "degraded" | null;
    createdAt: string;
}

const STATUS_STYLE: Record<string, string> = {
    active: "bg-[#e6f4ee] text-[#1f7a53]",
    suspended: "bg-[#fdf1de] text-[#a15c07]",
    revoked: "bg-[#fbe9e9] text-[#b3261e]",
};

export default function PartnersAdminPage() {
    const [partners, setPartners] = useState<PartnerRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [creating, setCreating] = useState(false);
    const [issuedKey, setIssuedKey] = useState<{ apiKey: string; webhookSecret: string | null } | null>(null);
    const [copied, setCopied] = useState(false);

    const [form, setForm] = useState({
        name: "", slug: "", contactName: "", contactEmail: "", sessionCap: 6, webhookUrl: "",
    });

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/partners");
            const data = await res.json();
            if (res.ok) setPartners(data.partners);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        setCreating(true);
        try {
            const res = await fetch("/api/admin/partners", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (res.ok) {
                setIssuedKey({ apiKey: data.apiKey, webhookSecret: data.webhookSecret });
                setForm({ name: "", slug: "", contactName: "", contactEmail: "", sessionCap: 6, webhookUrl: "" });
                load();
            } else {
                alert(data.error ?? "Failed to create partner.");
            }
        } finally {
            setCreating(false);
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div>
                    <h1 className="text-xl font-semibold text-[#1c3a3a] flex items-center gap-2">
                        <Network size={18} /> Partners (API)
                    </h1>
                    <p className="text-sm text-[#7a9088]">
                        External companies integrated via the Partner API — enrolment, session caps, crisis webhooks.
                    </p>
                </div>
                <button
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1c3a3a] text-white text-sm font-medium"
                >
                    <Plus size={15} /> New partner
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 size={20} className="animate-spin text-[#a0b8ac]" />
                </div>
            ) : partners.length === 0 ? (
                <div className="text-center py-20 text-sm text-[#7a9088]">No partners yet.</div>
            ) : (
                <div className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: "#e4eee8" }}>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-[#f7fbf9] text-left text-[#7a9088]" style={{ borderColor: "#e4eee8" }}>
                                <th className="px-4 py-3 font-medium">Partner</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">Beneficiaries</th>
                                <th className="px-4 py-3 font-medium">At risk</th>
                                <th className="px-4 py-3 font-medium">Sessions used</th>
                                <th className="px-4 py-3 font-medium">Cap</th>
                                <th className="px-4 py-3 font-medium">Webhook</th>
                            </tr>
                        </thead>
                        <tbody>
                            {partners.map((p) => (
                                <tr key={p.id} className="border-b last:border-0 hover:bg-[#f7fbf9]" style={{ borderColor: "#e4eee8" }}>
                                    <td className="px-4 py-3">
                                        <Link href={`/admin/partners/${p.id}`} className="font-medium text-[#1c3a3a] hover:underline">
                                            {p.name}
                                        </Link>
                                        <div className="text-xs text-[#a0b8ac]">{p.keyPrefix}…</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[p.status] ?? ""}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">{p.beneficiaryCount}</td>
                                    <td className="px-4 py-3">
                                        {p.atRiskCount > 0 ? (
                                            <span className="text-[#b3261e] font-medium">{p.atRiskCount}</span>
                                        ) : (
                                            <span className="text-[#a0b8ac]">0</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">{p.sessionsUsed}</td>
                                    <td className="px-4 py-3">{p.sessionCap}</td>
                                    <td className="px-4 py-3">
                                        {!p.webhookUrl ? (
                                            <span className="text-[#a0b8ac]">not set</span>
                                        ) : p.webhookHealth === "degraded" ? (
                                            <span className="text-[#b3261e]">degraded</span>
                                        ) : (
                                            <span className="text-[#1f7a53]">healthy</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showCreate && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        {issuedKey ? (
                            <div>
                                <h2 className="text-lg font-semibold text-[#1c3a3a] mb-1">Partner created</h2>
                                <p className="text-sm text-[#7a9088] mb-4">
                                    This API key is shown once and can&apos;t be recovered — copy it now and send it to the partner securely.
                                </p>
                                <div className="rounded-lg bg-[#f7fbf9] border p-3 mb-3 flex items-center justify-between gap-2" style={{ borderColor: "#e4eee8" }}>
                                    <code className="text-xs break-all">{issuedKey.apiKey}</code>
                                    <button
                                        onClick={() => { navigator.clipboard.writeText(issuedKey.apiKey); setCopied(true); }}
                                        className="shrink-0 text-[#3d8b8b]"
                                    >
                                        {copied ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                </div>
                                {issuedKey.webhookSecret && (
                                    <div className="rounded-lg bg-[#f7fbf9] border p-3 mb-4" style={{ borderColor: "#e4eee8" }}>
                                        <div className="text-xs text-[#7a9088] mb-1">Webhook secret</div>
                                        <code className="text-xs break-all">{issuedKey.webhookSecret}</code>
                                    </div>
                                )}
                                <button
                                    onClick={() => { setIssuedKey(null); setShowCreate(false); setCopied(false); }}
                                    className="w-full py-2.5 rounded-xl bg-[#1c3a3a] text-white text-sm font-medium"
                                >
                                    Done
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleCreate}>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-[#1c3a3a]">New partner</h2>
                                    <button type="button" onClick={() => setShowCreate(false)} className="text-[#a0b8ac]">
                                        <X size={18} />
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    <input required placeholder="Partner name (e.g. WellaHealth)" value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ borderColor: "#e4eee8" }} />
                                    <input required placeholder="Slug (e.g. wellahealth)" value={form.slug}
                                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ borderColor: "#e4eee8" }} />
                                    <input required placeholder="Contact name" value={form.contactName}
                                        onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ borderColor: "#e4eee8" }} />
                                    <input required type="email" placeholder="Contact email" value={form.contactEmail}
                                        onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ borderColor: "#e4eee8" }} />
                                    <input required type="number" min={1} placeholder="Sessions included per beneficiary" value={form.sessionCap}
                                        onChange={(e) => setForm({ ...form, sessionCap: Number(e.target.value) })}
                                        className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ borderColor: "#e4eee8" }} />
                                    <input placeholder="Crisis webhook URL (optional)" value={form.webhookUrl}
                                        onChange={(e) => setForm({ ...form, webhookUrl: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ borderColor: "#e4eee8" }} />
                                </div>
                                <button type="submit" disabled={creating}
                                    className="w-full mt-4 py-2.5 rounded-xl bg-[#1c3a3a] text-white text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60">
                                    {creating && <Loader2 size={14} className="animate-spin" />} Create partner
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
