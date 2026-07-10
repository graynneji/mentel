"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, FileText, ShieldCheck, ExternalLink, Check, X as XIcon } from "lucide-react";

interface Submission {
    id: string;
    createdAt: string;
    fullName: string;
    email: string;
    phone: string;
    city: string;
    role: string;
    isLicensedProfessional: boolean;
    licenseBody: string | null;
    licenseNumber: string | null;
    licenseDocumentUrl: string | null;
    ninNumber: string;
    ninDocumentUrl: string | null;
    cvDocumentUrl: string;
    status: "pending" | "approved" | "rejected";
    adminNotes: string | null;
}

// NIN is sensitive — show only the last 4 digits in the list view.
function maskNin(nin: string) {
    return `••••••• ${nin.slice(-4)}`;
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
    pending: { bg: "rgba(207,159,94,0.12)", color: "#cf9f5e" },
    approved: { bg: "rgba(78,140,106,0.12)", color: "#4e8c6a" },
    rejected: { bg: "rgba(185,74,79,0.1)", color: "#b94a4f" },
};

export default function VolunteerVerificationsAdminPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("pending");
    const [expanded, setExpanded] = useState<string | null>(null);
    const [updating, setUpdating] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (statusFilter !== "all") params.set("status", statusFilter);
            const res = await fetch(`/api/admin/volunteer-verifications?${params}`);
            const data = await res.json();
            if (data.success) setSubmissions(data.submissions);
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => { load(); }, [load]);

    async function updateStatus(id: string, status: "approved" | "rejected") {
        setUpdating(id);
        try {
            await fetch(`/api/admin/volunteer-verifications/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            await load();
        } finally {
            setUpdating(null);
        }
    }

    return (
        <div>
            <div className="mb-5">
                <h1 className="text-xl font-semibold text-[#1c3a3a] flex items-center gap-2">
                    <ShieldCheck size={18} /> Volunteer Verifications
                </h1>
                <p className="text-sm text-[#7a9088]">
                    Review identity documents, CVs, and professional licenses submitted by volunteer applicants.
                </p>
            </div>

            <div className="flex gap-1.5 mb-5">
                {["pending", "approved", "rejected", "all"].map((s) => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className="px-3.5 py-2 rounded-full text-xs font-medium capitalize cursor-pointer border"
                        style={{
                            borderColor: statusFilter === s ? "var(--sage)" : "#e4eee8",
                            background: statusFilter === s ? "rgba(123,169,139,0.10)" : "white",
                            color: statusFilter === s ? "var(--sage-dark)" : "#7a9088",
                        }}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16 text-[#a0b8ac]">
                    <Loader2 size={20} className="animate-spin" />
                </div>
            ) : submissions.length === 0 ? (
                <div className="text-center py-16 rounded-2xl border bg-white" style={{ borderColor: "#e4eee8" }}>
                    <FileText size={28} className="mx-auto mb-3 text-[#c8ddd2]" />
                    <p className="text-sm text-[#7a9088]">No submissions in this view.</p>
                </div>
            ) : (
                <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: "#e4eee8" }}>
                    {submissions.map((s) => {
                        const isOpen = expanded === s.id;
                        const sc = STATUS_COLORS[s.status];
                        return (
                            <div key={s.id} className="border-b last:border-b-0" style={{ borderColor: "#eef3f0" }}>
                                <button
                                    onClick={() => setExpanded(isOpen ? null : s.id)}
                                    className="w-full flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-[#f7faf8] transition-colors text-left min-w-0"
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="text-sm font-medium text-[#1c3a3a] truncate min-w-0">{s.fullName}</span>
                                            {s.isLicensedProfessional && (
                                                <span className="text-[10px] font-bold px-2 py-[2px] rounded-full shrink-0" style={{ background: "rgba(61,139,139,0.12)", color: "#3d8b8b" }}>
                                                    LICENSED
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-[#a0b8ac] mt-0.5 truncate">{s.role} · {s.city} · {new Date(s.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className="text-xs font-medium px-2.5 py-1 rounded-full capitalize shrink-0" style={{ background: sc.bg, color: sc.color }}>
                                        {s.status}
                                    </span>
                                </button>

                                {isOpen && (
                                    <div className="px-5 pb-5">
                                        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-xs mb-4" style={{ color: "#5a7a6e" }}>
                                            <p><strong>Email:</strong> {s.email}</p>
                                            <p><strong>Phone:</strong> {s.phone}</p>
                                            <p><strong>NIN:</strong> {maskNin(s.ninNumber)}</p>
                                            {s.isLicensedProfessional && (
                                                <>
                                                    <p><strong>License body:</strong> {s.licenseBody}</p>
                                                    {s.licenseNumber && <p><strong>License #:</strong> {s.licenseNumber}</p>}
                                                </>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <a href={s.cvDocumentUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium px-3 py-1.5 rounded-full border flex items-center gap-1" style={{ borderColor: "#e4eee8", color: "#3d8b8b" }}>
                                                <FileText size={11} /> View CV <ExternalLink size={10} />
                                            </a>
                                            {s.licenseDocumentUrl && (
                                                <a href={s.licenseDocumentUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium px-3 py-1.5 rounded-full border flex items-center gap-1" style={{ borderColor: "#e4eee8", color: "#3d8b8b" }}>
                                                    <FileText size={11} /> View License <ExternalLink size={10} />
                                                </a>
                                            )}
                                            {s.ninDocumentUrl && (
                                                <a href={s.ninDocumentUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium px-3 py-1.5 rounded-full border flex items-center gap-1" style={{ borderColor: "#e4eee8", color: "#3d8b8b" }}>
                                                    <FileText size={11} /> View NIN Document <ExternalLink size={10} />
                                                </a>
                                            )}
                                        </div>

                                        {s.status === "pending" && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => updateStatus(s.id, "approved")}
                                                    disabled={updating === s.id}
                                                    className="text-xs font-semibold px-3.5 py-2 rounded-full text-white cursor-pointer disabled:opacity-50 flex items-center gap-1"
                                                    style={{ background: "#4e8c6a" }}
                                                >
                                                    <Check size={12} /> Approve
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(s.id, "rejected")}
                                                    disabled={updating === s.id}
                                                    className="text-xs font-semibold px-3.5 py-2 rounded-full cursor-pointer disabled:opacity-50 flex items-center gap-1"
                                                    style={{ background: "rgba(185,74,79,0.1)", color: "#b94a4f" }}
                                                >
                                                    <XIcon size={12} /> Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
