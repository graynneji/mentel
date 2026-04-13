"use client";

// app/admin/contacts/page.tsx
// Shows all contact form submissions categorised by type:
// General, HMO Booking, Corporate/EAP, Support, etc.
// Allows filtering, viewing details, and updating status.

import { useState, useEffect, useCallback } from "react";
import {
    Search, RefreshCw, Mail, Phone, Building2, Shield,
    MessageSquare, ChevronDown, CheckCircle, Clock, Tag,
} from "lucide-react";

interface Contact {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    source: string;
    status: string;
    notes: string | null;
    tags: string[];
    createdAt: string;
    messages: { subject: string; body: string; createdAt: string }[];
}

interface CategoryCount {
    [key: string]: number;
}

const CATEGORY_LABELS: Record<string, string> = {
    general: "General",
    hmo_booking: "HMO / Insurance",
    corporate_booking: "Corporate / EAP",
    support: "Support",
    partnership: "Partnership",
    press: "Press",
    other: "Other",
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    general: { bg: "rgba(61,139,139,0.1)", text: "#3d8b8b", border: "rgba(61,139,139,0.25)" },
    hmo_booking: { bg: "rgba(78,140,106,0.1)", text: "#4e8c6a", border: "rgba(78,140,106,0.25)" },
    corporate_booking: { bg: "rgba(139,110,61,0.1)", text: "#8b6e3d", border: "rgba(139,110,61,0.25)" },
    support: { bg: "rgba(185,74,79,0.1)", text: "#b94a4f", border: "rgba(185,74,79,0.25)" },
    partnership: { bg: "rgba(100,80,160,0.1)", text: "#6450a0", border: "rgba(100,80,160,0.25)" },
    press: { bg: "rgba(60,60,60,0.1)", text: "#3c3c3c", border: "rgba(60,60,60,0.25)" },
    other: { bg: "rgba(150,150,150,0.1)", text: "#888", border: "rgba(150,150,150,0.25)" },
};

const STATUS_OPTIONS = ["new", "contacted", "resolved", "closed"];

export default function AdminContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryCounts, setCategoryCounts] = useState<CategoryCount>({});
    const [total, setTotal] = useState(0);
    const [selected, setSelected] = useState<Contact | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (category !== "all") params.set("category", category);
            if (statusFilter !== "all") params.set("status", statusFilter);
            if (search) params.set("search", search);
            params.set("limit", "100");

            const res = await fetch(`/api/contact?${params}`);
            const data = await res.json();
            if (data.success) {
                setContacts(data.contacts);
                setCategoryCounts(data.categoryCounts ?? {});
                setTotal(data.pagination?.total ?? 0);
            }
        } finally {
            setLoading(false);
        }
    }, [category, statusFilter, search]);

    useEffect(() => { load(); }, [load]);

    const handleStatusUpdate = async (contactId: string, newStatus: string) => {
        setUpdatingStatus(true);
        try {
            const res = await fetch(`/api/admin/leads/${contactId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: contactId, status: newStatus }),
            });
            if (res.ok) {
                setContacts(prev => prev.map(c => c.id === contactId ? { ...c, status: newStatus } : c));
                if (selected?.id === contactId) setSelected(prev => prev ? { ...prev, status: newStatus } : null);
            }
        } finally {
            setUpdatingStatus(false);
        }
    };

    const totalContacts = Object.values(categoryCounts).reduce((s, v) => s + v, 0);

    return (
        <div className="max-w-7xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                    <h1 className="text-[20px] font-bold" style={{ color: "#1c3a3a" }}>Contact Submissions</h1>
                    <p className="text-[12px] mt-0.5" style={{ color: "#7a9088" }}>
                        {totalContacts} total · All categories
                    </p>
                </div>
                <button onClick={load} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] border"
                    style={{ borderColor: "#ddeae2", color: "#4e8c6a" }}>
                    <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
                </button>
            </div>

            {/* Category filter tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
                <button
                    onClick={() => setCategory("all")}
                    className="px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all"
                    style={{
                        background: category === "all" ? "#4e8c6a" : "white",
                        color: category === "all" ? "white" : "#7a9088",
                        borderColor: category === "all" ? "#4e8c6a" : "#ddeae2",
                    }}>
                    All ({totalContacts})
                </button>
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
                    const count = categoryCounts[key] ?? 0;
                    if (count === 0 && category !== key) return null;
                    const isActive = category === key;
                    const colors = CATEGORY_COLORS[key];
                    return (
                        <button key={key} onClick={() => setCategory(key)}
                            className="px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all"
                            style={{
                                background: isActive ? colors.text : "white",
                                color: isActive ? "white" : colors.text,
                                borderColor: isActive ? colors.text : colors.border,
                            }}>
                            {label} ({count})
                        </button>
                    );
                })}
            </div>

            {/* Search & status filter */}
            <div className="flex gap-2 mb-4 flex-wrap">
                <div className="relative flex-1 min-w-48">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#b0c8bc" }} />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search name, email, phone…"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-[12px] outline-none"
                        style={{ borderColor: "#ddeae2", color: "#1c3a3a" }}
                    />
                </div>
                <div className="relative">
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                        className="pl-3 pr-8 py-2.5 rounded-xl border text-[12px] outline-none appearance-none"
                        style={{ borderColor: "#ddeae2", color: "#1c3a3a" }}>
                        <option value="all">All statuses</option>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#b0c8bc" }} />
                </div>
            </div>

            <div className="flex gap-4">
                {/* Contact list */}
                <div className="flex-1 min-w-0">
                    {loading ? (
                        <div className="flex flex-col gap-2">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="animate-pulse h-20 rounded-2xl" style={{ background: "#e8f0ec" }} />
                            ))}
                        </div>
                    ) : contacts.length === 0 ? (
                        <div className="text-center py-16" style={{ color: "#b0c8bc" }}>
                            <MessageSquare size={32} className="mx-auto mb-3 opacity-40" />
                            <p className="text-[13px]">No contacts found</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {contacts.map(contact => {
                                const catColor = CATEGORY_COLORS[contact.source] ?? CATEGORY_COLORS.other;
                                const catLabel = CATEGORY_LABELS[contact.source] ?? contact.source;
                                const isSelected = selected?.id === contact.id;
                                return (
                                    <div key={contact.id}
                                        onClick={() => setSelected(isSelected ? null : contact)}
                                        className="bg-white rounded-2xl border p-4 cursor-pointer transition-all hover:shadow-md"
                                        style={{
                                            borderColor: isSelected ? "#4e8c6a" : "#e4eee8",
                                            boxShadow: isSelected ? "0 0 0 2px rgba(78,140,106,0.2)" : "none",
                                        }}>
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                    <span className="text-[13px] font-semibold" style={{ color: "#1c3a3a" }}>{contact.name}</span>
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium border"
                                                        style={{ background: catColor.bg, color: catColor.text, borderColor: catColor.border }}>
                                                        {catLabel}
                                                    </span>
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                                        style={{
                                                            background: contact.status === "resolved" || contact.status === "closed"
                                                                ? "rgba(78,140,106,0.1)" : "rgba(255,165,0,0.1)",
                                                            color: contact.status === "resolved" || contact.status === "closed"
                                                                ? "#4e8c6a" : "#b8760a",
                                                        }}>
                                                        {contact.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <a href={`mailto:${contact.email}`} onClick={e => e.stopPropagation()}
                                                        className="flex items-center gap-1 text-[11px]" style={{ color: "#3d8b8b" }}>
                                                        <Mail size={10} /> {contact.email}
                                                    </a>
                                                    {contact.phone && (
                                                        <a href={`tel:${contact.phone}`} onClick={e => e.stopPropagation()}
                                                            className="flex items-center gap-1 text-[11px]" style={{ color: "#4e8c6a" }}>
                                                            <Phone size={10} /> {contact.phone}
                                                        </a>
                                                    )}
                                                </div>
                                                {contact.notes && (
                                                    <p className="text-[11px] mt-1 truncate" style={{ color: "#7a9088" }}>
                                                        {contact.notes}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-[10px]" style={{ color: "#b0c8bc" }}>
                                                    {new Date(contact.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                                                </p>
                                                <p className="text-[10px]" style={{ color: "#b0c8bc" }}>
                                                    {new Date(contact.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Detail panel */}
                {selected && (
                    <div className="w-80 flex-shrink-0 hidden lg:block">
                        <div className="bg-white rounded-2xl border p-5 sticky top-4" style={{ borderColor: "#e4eee8" }}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[14px] font-semibold" style={{ color: "#1c3a3a" }}>Contact Detail</h3>
                                <button onClick={() => setSelected(null)}
                                    className="text-[11px]" style={{ color: "#b0c8bc" }}>✕ Close</button>
                            </div>

                            {/* Identity */}
                            <div className="flex flex-col gap-2 mb-4 pb-4" style={{ borderBottom: "1px solid #f0f7f3" }}>
                                <p className="text-[15px] font-semibold" style={{ color: "#1c3a3a" }}>{selected.name}</p>
                                <a href={`mailto:${selected.email}`} className="flex items-center gap-1.5 text-[12px]" style={{ color: "#3d8b8b" }}>
                                    <Mail size={12} /> {selected.email}
                                </a>
                                {selected.phone && (
                                    <a href={`tel:${selected.phone}`} className="flex items-center gap-1.5 text-[12px]" style={{ color: "#4e8c6a" }}>
                                        <Phone size={12} /> {selected.phone}
                                    </a>
                                )}
                                <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "#7a9088" }}>
                                    <Tag size={11} />
                                    <span>{CATEGORY_LABELS[selected.source] ?? selected.source}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "#7a9088" }}>
                                    <Clock size={11} />
                                    <span>{new Date(selected.createdAt).toLocaleString("en-GB")}</span>
                                </div>
                            </div>

                            {/* Message */}
                            {selected.notes && (
                                <div className="mb-4 pb-4" style={{ borderBottom: "1px solid #f0f7f3" }}>
                                    <p className="text-[10px] uppercase tracking-widest font-medium mb-2" style={{ color: "#b0c8bc" }}>Message</p>
                                    <p className="text-[12px] leading-relaxed whitespace-pre-wrap" style={{ color: "#1c3a3a" }}>{selected.notes}</p>
                                </div>
                            )}

                            {/* Status update */}
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-medium mb-2" style={{ color: "#b0c8bc" }}>Update Status</p>
                                <div className="flex flex-col gap-1.5">
                                    {STATUS_OPTIONS.map(s => (
                                        <button key={s} onClick={() => handleStatusUpdate(selected.id, s)}
                                            disabled={updatingStatus || selected.status === s}
                                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] font-medium transition-all disabled:opacity-50"
                                            style={{
                                                background: selected.status === s ? "rgba(78,140,106,0.1)" : "white",
                                                color: selected.status === s ? "#4e8c6a" : "#7a9088",
                                                border: `1px solid ${selected.status === s ? "rgba(78,140,106,0.3)" : "#e4eee8"}`,
                                            }}>
                                            {selected.status === s && <CheckCircle size={12} />}
                                            {s.charAt(0).toUpperCase() + s.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quick actions */}
                            <div className="mt-4 pt-4 flex flex-col gap-2" style={{ borderTop: "1px solid #f0f7f3" }}>
                                <a href={`mailto:${selected.email}?subject=Re: Your enquiry to Mentel`}
                                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-medium text-white"
                                    style={{ background: "linear-gradient(135deg, #4e8c6a, #3d8b8b)" }}>
                                    <Mail size={13} /> Reply by Email
                                </a>
                                {selected.phone && (
                                    <a href={`tel:${selected.phone}`}
                                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-medium border"
                                        style={{ borderColor: "#ddeae2", color: "#4e8c6a" }}>
                                        <Phone size={13} /> Call {selected.phone}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}