"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut, Network, Users, Calendar, Webhook, Settings, RefreshCw, Copy, Check, AlertTriangle } from "lucide-react";

type Tab = "overview" | "beneficiaries" | "sessions" | "webhooks" | "settings";

interface Overview {
    partner: { name: string; status: string; sessionCap: number; keyPrefix: string; webhookUrl: string | null };
    stats: { beneficiaryCount: number; atRiskCount: number; sessionsUsed: number; webhookHealth: "healthy" | "degraded" | null };
}
interface Beneficiary {
    externalRef: string; status: string; anonymous: boolean; name: string | null;
    riskBand: string | null; sessionsUsed: number; sessionsRemaining: number;
    lastAssessmentAt: string | null; enrolledAt: string;
}
interface Session { id: string; externalRef: string; scheduledAt: string | null; type: string; status: string; booked: boolean; createdAt: string; }
interface WebhookEvent { id: string; eventType: string; status: string; attempts: number; responseStatus: number | null; lastError: string | null; createdAt: string; }

const RISK_STYLE: Record<string, string> = {
    Critical: "text-[#b3261e] font-semibold", High: "text-[#b3261e]", Moderate: "text-[#a15c07]",
    Mild: "text-[#7a9088]", Low: "text-[#1f7a53]",
};

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: Network },
    { id: "beneficiaries", label: "Beneficiaries", icon: Users },
    { id: "sessions", label: "Sessions", icon: Calendar },
    { id: "webhooks", label: "Webhooks", icon: Webhook },
    { id: "settings", label: "Settings", icon: Settings },
];

export default function PartnerPortalDashboard() {
    const router = useRouter();
    const [tab, setTab] = useState<Tab>("overview");
    const [loading, setLoading] = useState(true);
    const [overview, setOverview] = useState<Overview | null>(null);
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [events, setEvents] = useState<WebhookEvent[]>([]);

    const load = useCallback(async () => {
        setLoading(true);
        const res = await fetch("/api/partner-portal/overview");
        if (res.status === 401) {
            router.push("/partner-portal/login");
            return;
        }
        const data = await res.json();
        setOverview(data);
        setLoading(false);
    }, [router]);

    useEffect(() => { load(); }, [load]);

    useEffect(() => {
        if (tab === "beneficiaries" && beneficiaries.length === 0) {
            fetch("/api/partner-portal/beneficiaries").then((r) => r.json()).then((d) => setBeneficiaries(d.beneficiaries ?? []));
        }
        if (tab === "sessions" && sessions.length === 0) {
            fetch("/api/partner-portal/sessions").then((r) => r.json()).then((d) => setSessions(d.sessions ?? []));
        }
        if (tab === "webhooks" && events.length === 0) {
            fetch("/api/partner-portal/webhook-events").then((r) => r.json()).then((d) => setEvents(d.events ?? []));
        }
    }, [tab, beneficiaries.length, sessions.length, events.length]);

    async function logout() {
        await fetch("/api/partner-portal/auth/logout", { method: "POST" });
        router.push("/partner-portal/login");
    }

    if (loading || !overview) {
        return <div className="min-h-screen flex items-center justify-center" style={{ background: "#f7fbf9" }}><Loader2 className="animate-spin" color="#a0b8ac" /></div>;
    }

    return (
        <div className="min-h-screen" style={{ background: "#f7fbf9" }}>
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                    <div>
                        <h1 className="text-xl font-semibold" style={{ color: "#1c3a3a" }}>{overview.partner.name}</h1>
                        <p className="text-sm" style={{ color: "#7a9088" }}>Mentel Partner Portal</p>
                    </div>
                    <button onClick={logout} className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border" style={{ borderColor: "#e4eee8", color: "#7a9088" }}>
                        <LogOut size={14} /> Sign out
                    </button>
                </div>

                <div className="flex gap-1 mb-6 border-b overflow-x-auto" style={{ borderColor: "#e4eee8" }}>
                    {TABS.map((t) => {
                        const Icon = t.icon;
                        return (
                            <button
                                key={t.id}
                                onClick={() => setTab(t.id)}
                                className="flex items-center gap-1.5 px-4 py-2.5 text-sm whitespace-nowrap border-b-2 -mb-px"
                                style={{
                                    borderColor: tab === t.id ? "#1c3a3a" : "transparent",
                                    color: tab === t.id ? "#1c3a3a" : "#7a9088",
                                    fontWeight: tab === t.id ? 600 : 400,
                                }}
                            >
                                <Icon size={14} /> {t.label}
                            </button>
                        );
                    })}
                </div>

                {tab === "overview" && <OverviewTab overview={overview} />}
                {tab === "beneficiaries" && <BeneficiariesTab rows={beneficiaries} />}
                {tab === "sessions" && <SessionsTab rows={sessions} />}
                {tab === "webhooks" && <WebhooksTab rows={events} />}
                {tab === "settings" && <SettingsTab overview={overview} onSaved={load} />}
            </div>
        </div>
    );
}

function Card({ children }: { children: React.ReactNode }) {
    return <div className="rounded-xl border bg-white p-4" style={{ borderColor: "#e4eee8" }}>{children}</div>;
}
function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
    return (
        <div className="rounded-xl border bg-white overflow-x-auto" style={{ borderColor: "#e4eee8" }}>
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b bg-[#f7fbf9] text-left" style={{ borderColor: "#e4eee8", color: "#7a9088" }}>
                        {head.map((h) => <th key={h} className="px-4 py-2.5 font-medium">{h}</th>)}
                    </tr>
                </thead>
                <tbody>{children}</tbody>
            </table>
        </div>
    );
}

function OverviewTab({ overview }: { overview: Overview }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card><div className="text-xs mb-1" style={{ color: "#7a9088" }}>Beneficiaries</div><div className="text-2xl font-semibold" style={{ color: "#1c3a3a" }}>{overview.stats.beneficiaryCount}</div></Card>
            <Card><div className="text-xs mb-1" style={{ color: "#7a9088" }}>At risk</div><div className="text-2xl font-semibold" style={{ color: overview.stats.atRiskCount > 0 ? "#b3261e" : "#1c3a3a" }}>{overview.stats.atRiskCount}</div></Card>
            <Card><div className="text-xs mb-1" style={{ color: "#7a9088" }}>Sessions used</div><div className="text-2xl font-semibold" style={{ color: "#1c3a3a" }}>{overview.stats.sessionsUsed}</div></Card>
            <Card><div className="text-xs mb-1" style={{ color: "#7a9088" }}>Cap / beneficiary</div><div className="text-2xl font-semibold" style={{ color: "#1c3a3a" }}>{overview.partner.sessionCap}</div></Card>
        </div>
    );
}

function BeneficiariesTab({ rows }: { rows: Beneficiary[] }) {
    return (
        <Table head={["External ref", "Risk", "Sessions", "Last assessment", "Enrolled"]}>
            {rows.map((b) => (
                <tr key={b.externalRef} className="border-b last:border-0" style={{ borderColor: "#e4eee8" }}>
                    <td className="px-4 py-2.5">{b.anonymous ? `${b.externalRef} (anonymous)` : b.externalRef}</td>
                    <td className={`px-4 py-2.5 ${b.riskBand ? RISK_STYLE[b.riskBand] : "text-[#a0b8ac]"}`}>{b.riskBand ?? "—"}</td>
                    <td className="px-4 py-2.5">{b.sessionsUsed} / {b.sessionsUsed + b.sessionsRemaining}</td>
                    <td className="px-4 py-2.5 text-[#7a9088]">{b.lastAssessmentAt ? new Date(b.lastAssessmentAt).toLocaleDateString() : "—"}</td>
                    <td className="px-4 py-2.5 text-[#7a9088]">{new Date(b.enrolledAt).toLocaleDateString()}</td>
                </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} className="px-4 py-6 text-center text-[#a0b8ac]">No beneficiaries yet.</td></tr>}
        </Table>
    );
}

function SessionsTab({ rows }: { rows: Session[] }) {
    return (
        <Table head={["External ref", "Type", "Status", "Booked", "Created"]}>
            {rows.map((s) => (
                <tr key={s.id} className="border-b last:border-0" style={{ borderColor: "#e4eee8" }}>
                    <td className="px-4 py-2.5">{s.externalRef}</td>
                    <td className="px-4 py-2.5">{s.type}</td>
                    <td className="px-4 py-2.5">{s.status}</td>
                    <td className="px-4 py-2.5">{s.booked ? "Yes" : "No"}</td>
                    <td className="px-4 py-2.5 text-[#7a9088]">{new Date(s.createdAt).toLocaleString()}</td>
                </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} className="px-4 py-6 text-center text-[#a0b8ac]">No sessions yet.</td></tr>}
        </Table>
    );
}

function WebhooksTab({ rows }: { rows: WebhookEvent[] }) {
    return (
        <Table head={["Event", "Status", "Attempts", "Last error", "Created"]}>
            {rows.map((w) => (
                <tr key={w.id} className="border-b last:border-0" style={{ borderColor: "#e4eee8" }}>
                    <td className="px-4 py-2.5 font-medium">{w.eventType}</td>
                    <td className={`px-4 py-2.5 ${w.status === "delivered" ? "text-[#1f7a53]" : w.status === "failed" ? "text-[#b3261e]" : "text-[#a15c07]"}`}>{w.status}</td>
                    <td className="px-4 py-2.5">{w.attempts}</td>
                    <td className="px-4 py-2.5 text-[#7a9088] max-w-xs truncate">{w.lastError ?? "—"}</td>
                    <td className="px-4 py-2.5 text-[#7a9088]">{new Date(w.createdAt).toLocaleString()}</td>
                </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} className="px-4 py-6 text-center text-[#a0b8ac]">No webhook events yet.</td></tr>}
        </Table>
    );
}

function SettingsTab({ overview, onSaved }: { overview: Overview; onSaved: () => void }) {
    const [webhookUrl, setWebhookUrl] = useState(overview.partner.webhookUrl ?? "");
    const [saving, setSaving] = useState(false);
    const [newSecret, setNewSecret] = useState<string | null>(null);
    const [rotating, setRotating] = useState(false);
    const [newKey, setNewKey] = useState<string | null>(null);
    const [copied, setCopied] = useState<"secret" | "key" | null>(null);

    async function saveWebhook(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/partner-portal/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ webhookUrl }),
            });
            const data = await res.json();
            if (res.ok) {
                if (data.newWebhookSecret) setNewSecret(data.newWebhookSecret);
                onSaved();
            } else {
                alert(data.error?.message ?? "Could not save.");
            }
        } finally {
            setSaving(false);
        }
    }

    async function rotateKey() {
        if (!confirm("This immediately invalidates your current API key and updates every server calling Mentel with it. Continue?")) return;
        setRotating(true);
        try {
            const res = await fetch("/api/partner-portal/rotate-key", { method: "POST" });
            const data = await res.json();
            if (res.ok) setNewKey(data.apiKey);
            else alert(data.error?.message ?? "Could not rotate key.");
        } finally {
            setRotating(false);
        }
    }

    function copy(value: string, which: "secret" | "key") {
        navigator.clipboard.writeText(value);
        setCopied(which);
        setTimeout(() => setCopied(null), 1500);
    }

    return (
        <div className="space-y-6 max-w-lg">
            <Card>
                <div className="text-xs mb-1" style={{ color: "#7a9088" }}>Your API key</div>
                <code className="text-sm" style={{ color: "#1c3a3a" }}>{overview.partner.keyPrefix}…</code>
                <p className="text-xs mt-2 mb-3" style={{ color: "#7a9088" }}>
                    Rotating issues a new key and invalidates the old one immediately.
                </p>
                <button onClick={rotateKey} disabled={rotating} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm" style={{ borderColor: "#e4eee8", color: "#1c3a3a" }}>
                    <RefreshCw size={13} /> {rotating ? "Rotating…" : "Rotate API key"}
                </button>
                {newKey && (
                    <div className="mt-3 rounded-lg p-3 flex items-center justify-between gap-2" style={{ background: "#fdf1de", border: "1px solid #f0d9a8" }}>
                        <div>
                            <div className="text-xs font-medium flex items-center gap-1 mb-1" style={{ color: "#a15c07" }}><AlertTriangle size={12} /> Shown once — copy now</div>
                            <code className="text-xs break-all">{newKey}</code>
                        </div>
                        <button onClick={() => copy(newKey, "key")}>{copied === "key" ? <Check size={16} /> : <Copy size={16} />}</button>
                    </div>
                )}
            </Card>

            <Card>
                <form onSubmit={saveWebhook}>
                    <div className="text-xs mb-1" style={{ color: "#7a9088" }}>Crisis webhook URL</div>
                    <input
                        type="url" placeholder="https://your-server.example.com/webhooks/mentel"
                        value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border text-sm mb-3" style={{ borderColor: "#e4eee8" }}
                    />
                    <button type="submit" disabled={saving} className="px-3 py-2 rounded-lg text-sm text-white" style={{ background: "#1c3a3a" }}>
                        {saving ? "Saving…" : "Save"}
                    </button>
                </form>
                {newSecret && (
                    <div className="mt-3 rounded-lg p-3 flex items-center justify-between gap-2" style={{ background: "#fdf1de", border: "1px solid #f0d9a8" }}>
                        <div>
                            <div className="text-xs font-medium flex items-center gap-1 mb-1" style={{ color: "#a15c07" }}><AlertTriangle size={12} /> New webhook secret — shown once</div>
                            <code className="text-xs break-all">{newSecret}</code>
                        </div>
                        <button onClick={() => copy(newSecret, "secret")}>{copied === "secret" ? <Check size={16} /> : <Copy size={16} />}</button>
                    </div>
                )}
            </Card>
        </div>
    );
}
