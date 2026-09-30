// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useParams } from "next/navigation";
// import Link from "next/link";
// import { ArrowLeft, Loader2, RefreshCw, AlertTriangle } from "lucide-react";

// interface Detail {
//     partner: {
//         id: string; name: string; slug: string; status: string; contactName: string;
//         contactEmail: string; sessionCap: number; keyPrefix: string; webhookUrl: string | null; createdAt: string;
//     };
//     beneficiaries: {
//         externalRef: string; status: string; anonymous: boolean; name: string | null;
//         riskBand: string | null; overallScore: number | null; sessionsUsed: number;
//         sessionsRemaining: number; lastAssessmentAt: string | null; enrolledAt: string;
//     }[];
//     sessions: { id: string; externalRef: string; scheduledAt: string | null; type: string; status: string; booked: boolean; createdAt: string }[];
//     webhookEvents: { id: string; eventType: string; status: string; attempts: number; responseStatus: number | null; lastError: string | null; createdAt: string }[];
// }

// const RISK_STYLE: Record<string, string> = {
//     Critical: "text-[#b3261e] font-semibold",
//     High: "text-[#b3261e]",
//     Moderate: "text-[#a15c07]",
//     Mild: "text-[#7a9088]",
//     Low: "text-[#1f7a53]",
// };

// export default function PartnerDetailPage() {
//     const { id } = useParams<{ id: string }>();
//     const [data, setData] = useState<Detail | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [saving, setSaving] = useState(false);
//     const [rotated, setRotated] = useState<string | null>(null);

//     const load = useCallback(async () => {
//         setLoading(true);
//         try {
//             const res = await fetch(`/api/admin/partners/${id}`);
//             const json = await res.json();
//             if (res.ok) setData(json);
//         } finally {
//             setLoading(false);
//         }
//     }, [id]);

//     useEffect(() => { load(); }, [load]);

//     async function updateStatus(status: string) {
//         setSaving(true);
//         try {
//             await fetch(`/api/admin/partners/${id}`, {
//                 method: "PATCH",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ status }),
//             });
//             load();
//         } finally {
//             setSaving(false);
//         }
//     }

//     async function rotateKey() {
//         if (!confirm("This immediately invalidates the partner's current API key. Continue?")) return;
//         setSaving(true);
//         try {
//             const res = await fetch(`/api/admin/partners/${id}/rotate-key`, { method: "POST" });
//             const json = await res.json();
//             if (res.ok) setRotated(json.apiKey);
//         } finally {
//             setSaving(false);
//         }
//     }

//     if (loading) return <div className="flex justify-center py-20"><Loader2 size={20} className="animate-spin text-[#a0b8ac]" /></div>;
//     if (!data) return <div className="text-sm text-[#7a9088] py-10">Partner not found.</div>;

//     const { partner, beneficiaries, sessions, webhookEvents } = data;

//     return (
//         <div>
//             <Link href="/admin/partners" className="inline-flex items-center gap-1.5 text-sm text-[#7a9088] mb-4">
//                 <ArrowLeft size={14} /> Partners
//             </Link>

//             <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
//                 <div>
//                     <h1 className="text-xl font-semibold text-[#1c3a3a]">{partner.name}</h1>
//                     <p className="text-sm text-[#7a9088]">{partner.contactName} · {partner.contactEmail} · key {partner.keyPrefix}…</p>
//                 </div>
//                 <div className="flex gap-2">
//                     {partner.status === "active" ? (
//                         <button disabled={saving} onClick={() => updateStatus("suspended")}
//                             className="px-3 py-2 rounded-lg border text-sm text-[#a15c07]" style={{ borderColor: "#e4eee8" }}>
//                             Suspend
//                         </button>
//                     ) : (
//                         <button disabled={saving} onClick={() => updateStatus("active")}
//                             className="px-3 py-2 rounded-lg border text-sm text-[#1f7a53]" style={{ borderColor: "#e4eee8" }}>
//                             Reactivate
//                         </button>
//                     )}
//                     <button disabled={saving} onClick={rotateKey}
//                         className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm text-[#1c3a3a]" style={{ borderColor: "#e4eee8" }}>
//                         <RefreshCw size={13} /> Rotate key
//                     </button>
//                 </div>
//             </div>

//             {rotated && (
//                 <div className="mb-6 rounded-xl border p-4 bg-[#fdf1de]" style={{ borderColor: "#f0d9a8" }}>
//                     <div className="flex items-center gap-2 text-sm font-medium text-[#a15c07] mb-2">
//                         <AlertTriangle size={15} /> New key — shown once, send it to the partner now
//                     </div>
//                     <code className="text-xs break-all">{rotated}</code>
//                 </div>
//             )}

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//                 <Stat label="Beneficiaries" value={beneficiaries.length} />
//                 <Stat label="At risk (High/Critical)" value={beneficiaries.filter((b) => b.riskBand === "High" || b.riskBand === "Critical").length} warn />
//                 <Stat label="Session cap / beneficiary" value={partner.sessionCap} />
//             </div>

//             <Section title="Beneficiaries">
//                 <table className="w-full text-sm">
//                     <thead>
//                         <tr className="border-b bg-[#f7fbf9] text-left text-[#7a9088]" style={{ borderColor: "#e4eee8" }}>
//                             <th className="px-4 py-2.5 font-medium">External ref</th>
//                             <th className="px-4 py-2.5 font-medium">Risk</th>
//                             <th className="px-4 py-2.5 font-medium">Sessions</th>
//                             <th className="px-4 py-2.5 font-medium">Last assessment</th>
//                             <th className="px-4 py-2.5 font-medium">Enrolled</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {beneficiaries.map((b) => (
//                             <tr key={b.externalRef} className="border-b last:border-0" style={{ borderColor: "#e4eee8" }}>
//                                 <td className="px-4 py-2.5">{b.anonymous ? `${b.externalRef} (anonymous)` : b.externalRef}</td>
//                                 <td className={`px-4 py-2.5 ${b.riskBand ? RISK_STYLE[b.riskBand] : "text-[#a0b8ac]"}`}>{b.riskBand ?? "—"}</td>
//                                 <td className="px-4 py-2.5">{b.sessionsUsed} / {b.sessionsUsed + b.sessionsRemaining}</td>
//                                 <td className="px-4 py-2.5 text-[#7a9088]">{b.lastAssessmentAt ? new Date(b.lastAssessmentAt).toLocaleDateString() : "—"}</td>
//                                 <td className="px-4 py-2.5 text-[#7a9088]">{new Date(b.enrolledAt).toLocaleDateString()}</td>
//                             </tr>
//                         ))}
//                         {beneficiaries.length === 0 && (
//                             <tr><td colSpan={5} className="px-4 py-6 text-center text-[#a0b8ac]">No beneficiaries enrolled yet.</td></tr>
//                         )}
//                     </tbody>
//                 </table>
//             </Section>

//             <Section title="Recent sessions">
//                 <table className="w-full text-sm">
//                     <thead>
//                         <tr className="border-b bg-[#f7fbf9] text-left text-[#7a9088]" style={{ borderColor: "#e4eee8" }}>
//                             <th className="px-4 py-2.5 font-medium">External ref</th>
//                             <th className="px-4 py-2.5 font-medium">Type</th>
//                             <th className="px-4 py-2.5 font-medium">Status</th>
//                             <th className="px-4 py-2.5 font-medium">Booked via Cal.com</th>
//                             <th className="px-4 py-2.5 font-medium">Created</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {sessions.map((s) => (
//                             <tr key={s.id} className="border-b last:border-0" style={{ borderColor: "#e4eee8" }}>
//                                 <td className="px-4 py-2.5">{s.externalRef}</td>
//                                 <td className="px-4 py-2.5">{s.type}</td>
//                                 <td className="px-4 py-2.5">{s.status}</td>
//                                 <td className="px-4 py-2.5">{s.booked ? "Yes" : "No"}</td>
//                                 <td className="px-4 py-2.5 text-[#7a9088]">{new Date(s.createdAt).toLocaleString()}</td>
//                             </tr>
//                         ))}
//                         {sessions.length === 0 && (
//                             <tr><td colSpan={5} className="px-4 py-6 text-center text-[#a0b8ac]">No sessions yet.</td></tr>
//                         )}
//                     </tbody>
//                 </table>
//             </Section>

//             <Section title="Webhook deliveries">
//                 <table className="w-full text-sm">
//                     <thead>
//                         <tr className="border-b bg-[#f7fbf9] text-left text-[#7a9088]" style={{ borderColor: "#e4eee8" }}>
//                             <th className="px-4 py-2.5 font-medium">Event</th>
//                             <th className="px-4 py-2.5 font-medium">Status</th>
//                             <th className="px-4 py-2.5 font-medium">Attempts</th>
//                             <th className="px-4 py-2.5 font-medium">Last error</th>
//                             <th className="px-4 py-2.5 font-medium">Created</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {webhookEvents.map((w) => (
//                             <tr key={w.id} className="border-b last:border-0" style={{ borderColor: "#e4eee8" }}>
//                                 <td className="px-4 py-2.5 font-medium">{w.eventType}</td>
//                                 <td className={`px-4 py-2.5 ${w.status === "delivered" ? "text-[#1f7a53]" : w.status === "failed" ? "text-[#b3261e]" : "text-[#a15c07]"}`}>{w.status}</td>
//                                 <td className="px-4 py-2.5">{w.attempts}</td>
//                                 <td className="px-4 py-2.5 text-[#7a9088] max-w-xs truncate">{w.lastError ?? "—"}</td>
//                                 <td className="px-4 py-2.5 text-[#7a9088]">{new Date(w.createdAt).toLocaleString()}</td>
//                             </tr>
//                         ))}
//                         {webhookEvents.length === 0 && (
//                             <tr><td colSpan={5} className="px-4 py-6 text-center text-[#a0b8ac]">No webhook events yet.</td></tr>
//                         )}
//                     </tbody>
//                 </table>
//             </Section>
//         </div>
//     );
// }

// function Stat({ label, value, warn }: { label: string; value: number; warn?: boolean }) {
//     return (
//         <div className="rounded-xl border bg-white p-4" style={{ borderColor: "#e4eee8" }}>
//             <div className="text-xs text-[#7a9088] mb-1">{label}</div>
//             <div className={`text-2xl font-semibold ${warn && value > 0 ? "text-[#b3261e]" : "text-[#1c3a3a]"}`}>{value}</div>
//         </div>
//     );
// }

// function Section({ title, children }: { title: string; children: React.ReactNode }) {
//     return (
//         <div className="mb-6">
//             <h2 className="text-sm font-semibold text-[#1c3a3a] mb-2">{title}</h2>
//             <div className="rounded-xl border bg-white overflow-hidden overflow-x-auto" style={{ borderColor: "#e4eee8" }}>
//                 {children}
//             </div>
//         </div>
//     );
// }


"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, RefreshCw, AlertTriangle, UserPlus, Copy, Check } from "lucide-react";

interface Detail {
    partner: {
        id: string; name: string; slug: string; status: string; contactName: string;
        contactEmail: string; sessionCap: number; keyPrefix: string; webhookUrl: string | null; createdAt: string;
    };
    beneficiaries: {
        externalRef: string; status: string; anonymous: boolean; name: string | null;
        riskBand: string | null; overallScore: number | null; sessionsUsed: number;
        sessionsRemaining: number; lastAssessmentAt: string | null; enrolledAt: string;
    }[];
    sessions: { id: string; externalRef: string; scheduledAt: string | null; type: string; status: string; booked: boolean; createdAt: string }[];
    webhookEvents: { id: string; eventType: string; status: string; attempts: number; responseStatus: number | null; lastError: string | null; createdAt: string }[];
}

interface PortalUser {
    id: string; email: string; name: string; role: string;
    mustResetPassword: boolean; lastLoginAt: string | null; createdAt: string;
}

const RISK_STYLE: Record<string, string> = {
    Critical: "text-[#b3261e] font-semibold",
    High: "text-[#b3261e]",
    Moderate: "text-[#a15c07]",
    Mild: "text-[#7a9088]",
    Low: "text-[#1f7a53]",
};

export default function PartnerDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<Detail | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [rotated, setRotated] = useState<string | null>(null);
    const [users, setUsers] = useState<PortalUser[]>([]);
    const [showInvite, setShowInvite] = useState(false);
    const [inviteForm, setInviteForm] = useState({ name: "", email: "" });
    const [inviting, setInviting] = useState(false);
    const [invited, setInvited] = useState<{ email: string; tempPassword: string; portalUrl: string } | null>(null);
    const [copied, setCopied] = useState(false);

    const loadUsers = useCallback(async () => {
        const res = await fetch(`/api/admin/partners/${id}/users`);
        const json = await res.json();
        if (res.ok) setUsers(json.users);
    }, [id]);

    async function inviteUser(e: React.FormEvent) {
        e.preventDefault();
        setInviting(true);
        try {
            const res = await fetch(`/api/admin/partners/${id}/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(inviteForm),
            });
            const json = await res.json();
            if (res.ok) {
                setInvited({ email: json.user.email, tempPassword: json.tempPassword, portalUrl: json.portalUrl });
                setInviteForm({ name: "", email: "" });
                loadUsers();
            } else {
                alert(json.error ?? "Could not invite that user.");
            }
        } finally {
            setInviting(false);
        }
    }

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/partners/${id}`);
            const json = await res.json();
            if (res.ok) setData(json);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { load(); }, [load]);
    useEffect(() => { loadUsers(); }, [loadUsers]);

    async function updateStatus(status: string) {
        setSaving(true);
        try {
            await fetch(`/api/admin/partners/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            load();
        } finally {
            setSaving(false);
        }
    }

    async function rotateKey() {
        if (!confirm("This immediately invalidates the partner's current API key. Continue?")) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/partners/${id}/rotate-key`, { method: "POST" });
            const json = await res.json();
            if (res.ok) setRotated(json.apiKey);
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="flex justify-center py-20"><Loader2 size={20} className="animate-spin text-[#a0b8ac]" /></div>;
    if (!data) return <div className="text-sm text-[#7a9088] py-10">Partner not found.</div>;

    const { partner, beneficiaries, sessions, webhookEvents } = data;

    return (
        <div>
            <Link href="/admin/partners" className="inline-flex items-center gap-1.5 text-sm text-[#7a9088] mb-4">
                <ArrowLeft size={14} /> Partners
            </Link>

            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-[#1c3a3a]">{partner.name}</h1>
                    <p className="text-sm text-[#7a9088]">{partner.contactName} · {partner.contactEmail} · key {partner.keyPrefix}…</p>
                </div>
                <div className="flex gap-2">
                    {partner.status === "active" ? (
                        <button disabled={saving} onClick={() => updateStatus("suspended")}
                            className="px-3 py-2 rounded-lg border text-sm text-[#a15c07]" style={{ borderColor: "#e4eee8" }}>
                            Suspend
                        </button>
                    ) : (
                        <button disabled={saving} onClick={() => updateStatus("active")}
                            className="px-3 py-2 rounded-lg border text-sm text-[#1f7a53]" style={{ borderColor: "#e4eee8" }}>
                            Reactivate
                        </button>
                    )}
                    <button disabled={saving} onClick={rotateKey}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm text-[#1c3a3a]" style={{ borderColor: "#e4eee8" }}>
                        <RefreshCw size={13} /> Rotate key
                    </button>
                </div>
            </div>

            {rotated && (
                <div className="mb-6 rounded-xl border p-4 bg-[#fdf1de]" style={{ borderColor: "#f0d9a8" }}>
                    <div className="flex items-center gap-2 text-sm font-medium text-[#a15c07] mb-2">
                        <AlertTriangle size={15} /> New key — shown once, send it to the partner now
                    </div>
                    <code className="text-xs break-all">{rotated}</code>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Stat label="Beneficiaries" value={beneficiaries.length} />
                <Stat label="At risk (High/Critical)" value={beneficiaries.filter((b) => b.riskBand === "High" || b.riskBand === "Critical").length} warn />
                <Stat label="Session cap / beneficiary" value={partner.sessionCap} />
            </div>

            <Section title="Beneficiaries">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b bg-[#f7fbf9] text-left text-[#7a9088]" style={{ borderColor: "#e4eee8" }}>
                            <th className="px-4 py-2.5 font-medium">External ref</th>
                            <th className="px-4 py-2.5 font-medium">Risk</th>
                            <th className="px-4 py-2.5 font-medium">Sessions</th>
                            <th className="px-4 py-2.5 font-medium">Last assessment</th>
                            <th className="px-4 py-2.5 font-medium">Enrolled</th>
                        </tr>
                    </thead>
                    <tbody>
                        {beneficiaries.map((b) => (
                            <tr key={b.externalRef} className="border-b last:border-0" style={{ borderColor: "#e4eee8" }}>
                                <td className="px-4 py-2.5">{b.anonymous ? `${b.externalRef} (anonymous)` : b.externalRef}</td>
                                <td className={`px-4 py-2.5 ${b.riskBand ? RISK_STYLE[b.riskBand] : "text-[#a0b8ac]"}`}>{b.riskBand ?? "—"}</td>
                                <td className="px-4 py-2.5">{b.sessionsUsed} / {b.sessionsUsed + b.sessionsRemaining}</td>
                                <td className="px-4 py-2.5 text-[#7a9088]">{b.lastAssessmentAt ? new Date(b.lastAssessmentAt).toLocaleDateString() : "—"}</td>
                                <td className="px-4 py-2.5 text-[#7a9088]">{new Date(b.enrolledAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                        {beneficiaries.length === 0 && (
                            <tr><td colSpan={5} className="px-4 py-6 text-center text-[#a0b8ac]">No beneficiaries enrolled yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </Section>

            <Section title="Recent sessions">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b bg-[#f7fbf9] text-left text-[#7a9088]" style={{ borderColor: "#e4eee8" }}>
                            <th className="px-4 py-2.5 font-medium">External ref</th>
                            <th className="px-4 py-2.5 font-medium">Type</th>
                            <th className="px-4 py-2.5 font-medium">Status</th>
                            <th className="px-4 py-2.5 font-medium">Booked via Cal.com</th>
                            <th className="px-4 py-2.5 font-medium">Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.map((s) => (
                            <tr key={s.id} className="border-b last:border-0" style={{ borderColor: "#e4eee8" }}>
                                <td className="px-4 py-2.5">{s.externalRef}</td>
                                <td className="px-4 py-2.5">{s.type}</td>
                                <td className="px-4 py-2.5">{s.status}</td>
                                <td className="px-4 py-2.5">{s.booked ? "Yes" : "No"}</td>
                                <td className="px-4 py-2.5 text-[#7a9088]">{new Date(s.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                        {sessions.length === 0 && (
                            <tr><td colSpan={5} className="px-4 py-6 text-center text-[#a0b8ac]">No sessions yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </Section>

            <Section title="Webhook deliveries">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b bg-[#f7fbf9] text-left text-[#7a9088]" style={{ borderColor: "#e4eee8" }}>
                            <th className="px-4 py-2.5 font-medium">Event</th>
                            <th className="px-4 py-2.5 font-medium">Status</th>
                            <th className="px-4 py-2.5 font-medium">Attempts</th>
                            <th className="px-4 py-2.5 font-medium">Last error</th>
                            <th className="px-4 py-2.5 font-medium">Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        {webhookEvents.map((w) => (
                            <tr key={w.id} className="border-b last:border-0" style={{ borderColor: "#e4eee8" }}>
                                <td className="px-4 py-2.5 font-medium">{w.eventType}</td>
                                <td className={`px-4 py-2.5 ${w.status === "delivered" ? "text-[#1f7a53]" : w.status === "failed" ? "text-[#b3261e]" : "text-[#a15c07]"}`}>{w.status}</td>
                                <td className="px-4 py-2.5">{w.attempts}</td>
                                <td className="px-4 py-2.5 text-[#7a9088] max-w-xs truncate">{w.lastError ?? "—"}</td>
                                <td className="px-4 py-2.5 text-[#7a9088]">{new Date(w.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                        {webhookEvents.length === 0 && (
                            <tr><td colSpan={5} className="px-4 py-6 text-center text-[#a0b8ac]">No webhook events yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </Section>

            <Section title="Staff logins">
                <div className="p-3 flex justify-end border-b" style={{ borderColor: "#e4eee8" }}>
                    <button onClick={() => setShowInvite(true)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-white" style={{ background: "#1c3a3a" }}>
                        <UserPlus size={13} /> Invite staff login
                    </button>
                </div>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b bg-[#f7fbf9] text-left text-[#7a9088]" style={{ borderColor: "#e4eee8" }}>
                            <th className="px-4 py-2.5 font-medium">Name</th>
                            <th className="px-4 py-2.5 font-medium">Email</th>
                            <th className="px-4 py-2.5 font-medium">Status</th>
                            <th className="px-4 py-2.5 font-medium">Last login</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id} className="border-b last:border-0" style={{ borderColor: "#e4eee8" }}>
                                <td className="px-4 py-2.5">{u.name}</td>
                                <td className="px-4 py-2.5">{u.email}</td>
                                <td className="px-4 py-2.5">{u.mustResetPassword ? <span className="text-[#a15c07]">Invited (no login yet)</span> : <span className="text-[#1f7a53]">Active</span>}</td>
                                <td className="px-4 py-2.5 text-[#7a9088]">{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "—"}</td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr><td colSpan={4} className="px-4 py-6 text-center text-[#a0b8ac]">No staff logins yet — their team can only reach Mentel via the API/webhooks until you invite one.</td></tr>
                        )}
                    </tbody>
                </table>
            </Section>

            {showInvite && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        {invited ? (
                            <div>
                                <h2 className="text-lg font-semibold text-[#1c3a3a] mb-1">Invited {invited.email}</h2>
                                <p className="text-sm text-[#7a9088] mb-4">
                                    This temporary password is shown once — send it to them along with the portal URL. They&apos;ll be required to set their own password on first login.
                                </p>
                                <div className="rounded-lg bg-[#f7fbf9] border p-3 mb-3" style={{ borderColor: "#e4eee8" }}>
                                    <div className="text-xs text-[#7a9088] mb-1">Portal URL</div>
                                    <code className="text-xs break-all">{invited.portalUrl}</code>
                                </div>
                                <div className="rounded-lg bg-[#f7fbf9] border p-3 mb-4 flex items-center justify-between gap-2" style={{ borderColor: "#e4eee8" }}>
                                    <div>
                                        <div className="text-xs text-[#7a9088] mb-1">Temporary password</div>
                                        <code className="text-xs">{invited.tempPassword}</code>
                                    </div>
                                    <button onClick={() => { navigator.clipboard.writeText(invited.tempPassword); setCopied(true); }} className="shrink-0 text-[#3d8b8b]">
                                        {copied ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                </div>
                                <button onClick={() => { setInvited(null); setShowInvite(false); setCopied(false); }}
                                    className="w-full py-2.5 rounded-xl bg-[#1c3a3a] text-white text-sm font-medium">
                                    Done
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={inviteUser}>
                                <h2 className="text-lg font-semibold text-[#1c3a3a] mb-4">Invite a staff login</h2>
                                <div className="space-y-3">
                                    <input required placeholder="Name" value={inviteForm.name}
                                        onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ borderColor: "#e4eee8" }} />
                                    <input required type="email" placeholder="Email" value={inviteForm.email}
                                        onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ borderColor: "#e4eee8" }} />
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <button type="button" onClick={() => setShowInvite(false)} className="flex-1 py-2.5 rounded-xl border text-sm" style={{ borderColor: "#e4eee8", color: "#1c3a3a" }}>
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={inviting} className="flex-1 py-2.5 rounded-xl bg-[#1c3a3a] text-white text-sm font-medium disabled:opacity-60">
                                        {inviting ? "Inviting…" : "Invite"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function Stat({ label, value, warn }: { label: string; value: number; warn?: boolean }) {
    return (
        <div className="rounded-xl border bg-white p-4" style={{ borderColor: "#e4eee8" }}>
            <div className="text-xs text-[#7a9088] mb-1">{label}</div>
            <div className={`text-2xl font-semibold ${warn && value > 0 ? "text-[#b3261e]" : "text-[#1c3a3a]"}`}>{value}</div>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-6">
            <h2 className="text-sm font-semibold text-[#1c3a3a] mb-2">{title}</h2>
            <div className="rounded-xl border bg-white overflow-hidden overflow-x-auto" style={{ borderColor: "#e4eee8" }}>
                {children}
            </div>
        </div>
    );
}
