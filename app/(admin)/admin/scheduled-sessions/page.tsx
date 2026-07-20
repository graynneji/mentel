"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
    Loader2, Calendar, CheckCircle2, XCircle, Ban, RefreshCcw, Gift,
    Search, X as XIcon, Phone, Mail, ChevronDown, ChevronUp, Clock,
} from "lucide-react";

interface SessionRow {
    id: string;
    scheduledAt: string;
    status: string;
    therapist: string | null;
    notes: string | null;
    calBookingUid: string | null;
    cancelledBy: string | null;
    cancelReason: string | null;
    lead: { id: string; name: string; email: string; phone: string | null };
    package: { id: string; planType: string; totalSessions: number; usedSessions: number };
}

interface ClientGroup {
    lead: SessionRow["lead"];
    sessions: SessionRow[];
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
    scheduled: { bg: "rgba(61,139,139,0.1)", color: "#3d8b8b" },
    completed: { bg: "rgba(78,140,106,0.12)", color: "#4e8c6a" },
    cancelled: { bg: "rgba(150,150,150,0.1)", color: "#888" },
    "no-show": { bg: "rgba(185,74,79,0.1)", color: "#b94a4f" },
};

export default function ScheduledSessionsAdminPage() {
    const [sessions, setSessions] = useState<SessionRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("all");
    const [search, setSearch] = useState("");
    const [expandedLead, setExpandedLead] = useState<string | null>(null);
    const [actingId, setActingId] = useState<string | null>(null);
    const [cancelModal, setCancelModal] = useState<SessionRow | null>(null);
    const [rescheduleModal, setRescheduleModal] = useState<SessionRow | null>(null);
    const [grantModal, setGrantModal] = useState<SessionRow | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (status !== "all") params.set("status", status);
            if (search) params.set("search", search);
            const res = await fetch(`/api/admin/scheduled-sessions?${params}`);
            const data = await res.json();
            if (data.success) setSessions(data.sessions);
        } finally {
            setLoading(false);
        }
    }, [status, search]);

    useEffect(() => { load(); }, [load]);

    // Group flat sessions into one card per client — this is the "individual
    // with all his scheduled sessions together" view, instead of one long
    // mixed list of everyone's sessions interleaved chronologically.
    const groups = useMemo<ClientGroup[]>(() => {
        const map = new Map<string, ClientGroup>();
        for (const s of sessions) {
            const existing = map.get(s.lead.id);
            if (existing) existing.sessions.push(s);
            else map.set(s.lead.id, { lead: s.lead, sessions: [s] });
        }
        return [...map.values()].sort((a, b) => {
            const aLatest = Math.max(...a.sessions.map((s) => new Date(s.scheduledAt).getTime()));
            const bLatest = Math.max(...b.sessions.map((s) => new Date(s.scheduledAt).getTime()));
            return bLatest - aLatest;
        });
    }, [sessions]);

    async function act(id: string, action: string, extra: Record<string, unknown> = {}) {
        setActingId(id);
        try {
            const res = await fetch(`/api/admin/scheduled-sessions/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, ...extra }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                alert(data.error ?? "Action failed.");
                return;
            }
            setCancelModal(null);
            setRescheduleModal(null);
            await load();
        } finally {
            setActingId(null);
        }
    }

    async function grantSession(leadId: string, reason: string, sessionCount: number) {
        setActingId(leadId);
        try {
            const res = await fetch(`/api/admin/leads/${leadId}/grant-session`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason, sessions: sessionCount }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                alert(data.error ?? "Failed to grant session.");
                return;
            }
            setGrantModal(null);
            await load();
        } finally {
            setActingId(null);
        }
    }

    return (
        <div>
            <div className="mb-5">
                <h1 className="text-xl font-semibold text-[#1c3a3a] flex items-center gap-2">
                    <Calendar size={18} /> Scheduled Sessions
                </h1>
                <p className="text-sm text-[#7a9088]">
                    Grouped by client — every session they've ever had, in one place. Complete, cancel,
                    reschedule (including giving a no-show client a real second chance), or grant a free session.
                </p>
            </div>

            <div className="flex items-center gap-3 mb-5 flex-wrap">
                <div className="relative flex-1 min-w-[220px]">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0b8ac]" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by client name or email..."
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm outline-none bg-white"
                        style={{ borderColor: "#e4eee8" }}
                    />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                    {["all", "scheduled", "completed", "cancelled", "no-show"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatus(s)}
                            className="px-3.5 py-2 rounded-full text-xs font-medium capitalize cursor-pointer border"
                            style={{
                                borderColor: status === s ? "var(--sage)" : "#e4eee8",
                                background: status === s ? "rgba(123,169,139,0.10)" : "white",
                                color: status === s ? "var(--sage-dark)" : "#7a9088",
                            }}
                        >
                            {s}
                        </button>
                    ))}
                </div>
                <p className="text-xs text-[#a0b8ac] w-full">
                    Filtering by status still groups by client — it just hides clients with no sessions
                    matching that status. Use "all" to see everyone's full history together.
                </p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16 text-[#a0b8ac]">
                    <Loader2 size={20} className="animate-spin" />
                </div>
            ) : groups.length === 0 ? (
                <div className="text-center py-16 rounded-2xl border bg-white" style={{ borderColor: "#e4eee8" }}>
                    <Calendar size={28} className="mx-auto mb-3 text-[#c8ddd2]" />
                    <p className="text-sm text-[#7a9088]">No sessions in this view.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {groups.map((g) => {
                        const isOpen = expandedLead === g.lead.id;
                        const scheduledCount = g.sessions.filter((s) => s.status === "scheduled").length;
                        return (
                            <div key={g.lead.id} className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: "#e4eee8" }}>
                                <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => setExpandedLead(isOpen ? null : g.lead.id)}
                                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setExpandedLead(isOpen ? null : g.lead.id); } }}
                                    className="w-full flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-[#f7faf8] transition-colors text-left"
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="text-sm font-medium text-[#1c3a3a] truncate min-w-0">{g.lead.name}</span>
                                            {scheduledCount > 0 && (
                                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0" style={{ background: STATUS_COLORS.scheduled.bg, color: STATUS_COLORS.scheduled.color }}>
                                                    {scheduledCount} upcoming
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-[#a0b8ac] mt-0.5 truncate">
                                            {g.lead.email}{g.lead.phone && ` · ${g.lead.phone}`} · {g.sessions.length} session{g.sessions.length !== 1 ? "s" : ""} total
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setGrantModal(g.sessions[0]); }}
                                        className="text-xs font-medium px-3 py-1.5 rounded-full border flex items-center gap-1 shrink-0"
                                        style={{ borderColor: "#e4eee8", color: "#cf9f5e" }}
                                    >
                                        <Gift size={12} /> Grant free session
                                    </button>
                                    {isOpen ? <ChevronUp size={14} className="text-[#a0b8ac] shrink-0" /> : <ChevronDown size={14} className="text-[#a0b8ac] shrink-0" />}
                                </div>

                                {isOpen && (
                                    <div className="border-t" style={{ borderColor: "#eef3f0" }}>
                                        {g.sessions
                                            .slice()
                                            .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())
                                            .map((s) => {
                                                const sc = STATUS_COLORS[s.status] ?? STATUS_COLORS.scheduled;
                                                const remaining = s.package.totalSessions - s.package.usedSessions;
                                                const canReschedule = ["scheduled", "no-show", "cancelled"].includes(s.status);
                                                return (
                                                    <div key={s.id} className="flex flex-col gap-2 px-5 py-4 border-b last:border-b-0" style={{ borderColor: "#f3f7f5" }}>
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <Clock size={13} className="text-[#a0b8ac] shrink-0" />
                                                            <span className="text-sm text-[#1c3a3a]">
                                                                {new Date(s.scheduledAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                                                            </span>
                                                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize" style={{ background: sc.bg, color: sc.color }}>
                                                                {s.status}
                                                            </span>
                                                            <span className="text-[10px] px-2 py-0.5 rounded-full capitalize" style={{ background: "#f7faf8", color: "#7a9088" }}>
                                                                {s.package.planType} plan · {remaining}/{s.package.totalSessions} remaining
                                                            </span>
                                                        </div>
                                                        {s.cancelReason && (
                                                            <p className="text-xs" style={{ color: "#b94a4f" }}>Cancelled ({s.cancelledBy}): {s.cancelReason}</p>
                                                        )}
                                                        <div className="flex flex-wrap gap-2">
                                                            {s.status === "scheduled" && (
                                                                <>
                                                                    <button
                                                                        onClick={() => act(s.id, "complete")}
                                                                        disabled={actingId === s.id}
                                                                        className="text-xs font-medium px-3 py-1.5 rounded-full border flex items-center gap-1 disabled:opacity-50"
                                                                        style={{ borderColor: "#e4eee8", color: "#4e8c6a" }}
                                                                    >
                                                                        <CheckCircle2 size={12} /> Mark completed
                                                                    </button>
                                                                    <button
                                                                        onClick={() => act(s.id, "no_show")}
                                                                        disabled={actingId === s.id}
                                                                        className="text-xs font-medium px-3 py-1.5 rounded-full border flex items-center gap-1 disabled:opacity-50"
                                                                        style={{ borderColor: "#e4eee8", color: "#b94a4f" }}
                                                                    >
                                                                        <XCircle size={12} /> No-show
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setCancelModal(s)}
                                                                        className="text-xs font-medium px-3 py-1.5 rounded-full border flex items-center gap-1"
                                                                        style={{ borderColor: "#e4eee8", color: "#888" }}
                                                                    >
                                                                        <Ban size={12} /> Cancel
                                                                    </button>
                                                                </>
                                                            )}
                                                            {canReschedule && (
                                                                <button
                                                                    onClick={() => setRescheduleModal(s)}
                                                                    className="text-xs font-medium px-3 py-1.5 rounded-full border flex items-center gap-1"
                                                                    style={{ borderColor: "#e4eee8", color: "#3d8b8b" }}
                                                                >
                                                                    <RefreshCcw size={12} />
                                                                    {s.status === "scheduled" ? "Reschedule" : "Reschedule (give another chance)"}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        <div className="flex items-center gap-3 px-5 py-3" style={{ background: "#fbfdfc" }}>
                                            <a href={`mailto:${g.lead.email}`} className="text-xs flex items-center gap-1 text-[#a0b8ac] hover:text-[#3d8b8b]">
                                                <Mail size={12} /> Email
                                            </a>
                                            {g.lead.phone && (
                                                <a href={`tel:${g.lead.phone}`} className="text-xs flex items-center gap-1 text-[#a0b8ac] hover:text-[#3d8b8b]">
                                                    <Phone size={12} /> Call
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {cancelModal && (
                <CancelModal
                    session={cancelModal}
                    busy={actingId === cancelModal.id}
                    onClose={() => setCancelModal(null)}
                    onConfirm={(reason, grantFree) => act(cancelModal.id, "cancel", { reason, grantFreeSession: grantFree })}
                />
            )}

            {rescheduleModal && (
                <RescheduleModal
                    session={rescheduleModal}
                    busy={actingId === rescheduleModal.id}
                    onClose={() => setRescheduleModal(null)}
                    onConfirm={(start, reason) => act(rescheduleModal.id, "reschedule", { start, reason })}
                />
            )}

            {grantModal && (
                <GrantModal
                    session={grantModal}
                    busy={actingId === grantModal.lead.id}
                    onClose={() => setGrantModal(null)}
                    onConfirm={(reason, count) => grantSession(grantModal.lead.id, reason, count)}
                />
            )}
        </div>
    );
}

function ModalShell({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-[#1c3a3a]">{title}</h3>
                    <button onClick={onClose} className="text-[#a0b8ac] hover:text-[#1c3a3a]"><XIcon size={16} /></button>
                </div>
                {children}
            </div>
        </div>
    );
}

function CancelModal({ session, busy, onClose, onConfirm }: {
    session: SessionRow; busy: boolean; onClose: () => void; onConfirm: (reason: string, grantFree: boolean) => void;
}) {
    const [reason, setReason] = useState("");
    const [grantFree, setGrantFree] = useState(false);

    return (
        <ModalShell title={`Cancel session — ${session.lead.name}`} onClose={onClose}>
            <p className="text-xs text-[#7a9088] mb-3">
                This returns the session to their remaining balance. The client gets an email (and SMS, if we have their number).
            </p>
            <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason (shown to the client, optional)"
                rows={2}
                className="w-full px-3 py-2 rounded-xl border text-sm outline-none mb-3"
                style={{ borderColor: "#e4eee8" }}
            />
            <label className="flex items-center gap-2 text-xs text-[#5a7a6e] mb-4 cursor-pointer">
                <input type="checkbox" checked={grantFree} onChange={(e) => setGrantFree(e.target.checked)} />
                This was our fault — also grant a free bonus session
            </label>
            <button
                onClick={() => onConfirm(reason, grantFree)}
                disabled={busy}
                className="w-full py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
            >
                {busy ? "Cancelling…" : "Confirm cancellation"}
            </button>
        </ModalShell>
    );
}

interface SlotsByDate { [date: string]: { time: string }[] }

function RescheduleModal({ session, busy, onClose, onConfirm }: {
    session: SessionRow; busy: boolean; onClose: () => void; onConfirm: (start: string, reason: string) => void;
}) {
    const [slotsByDate, setSlotsByDate] = useState<SlotsByDate>({});
    const [loadingSlots, setLoadingSlots] = useState(true);
    const [slotsError, setSlotsError] = useState("");
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [reason, setReason] = useState("");

    const dates = Object.keys(slotsByDate).sort();

    useEffect(() => {
        (async () => {
            setLoadingSlots(true);
            setSlotsError("");
            try {
                const start = new Date();
                const end = new Date();
                end.setDate(end.getDate() + 14);
                const res = await fetch(`/api/admin/cal/slots?start=${start.toISOString()}&end=${end.toISOString()}`);
                const data = await res.json();
                if (!res.ok) {
                    setSlotsError(data.error ?? "Couldn't load availability.");
                    return;
                }
                const raw: Record<string, { time?: string; start?: string }[]> = data.data ?? {};
                const normalized: SlotsByDate = {};
                for (const [dateKey, arr] of Object.entries(raw)) {
                    normalized[dateKey] = (arr ?? []).map((s) => {
                        const t = s.time ?? s.start ?? "";
                        const full = t.includes("T") || t.includes("-") ? t : `${dateKey}T${t}:00`;
                        return { time: full };
                    });
                }
                setSlotsByDate(normalized);
                const first = Object.keys(normalized).sort()[0];
                if (first) setSelectedDate(first);
            } catch {
                setSlotsError("Network error loading availability.");
            } finally {
                setLoadingSlots(false);
            }
        })();
    }, []);

    return (
        <ModalShell title={`Reschedule — ${session.lead.name}`} onClose={onClose}>
            <p className="text-xs text-[#7a9088] mb-3">
                Currently: {new Date(session.scheduledAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                {session.status !== "scheduled" && (
                    <span> — was <strong>{session.status}</strong>; rescheduling gives this session back to the client.</span>
                )}
            </p>

            {loadingSlots ? (
                <div className="flex items-center justify-center py-8"><Loader2 size={18} className="animate-spin text-[#a0b8ac]" /></div>
            ) : slotsError ? (
                <p className="text-sm text-[#b94a4f] text-center py-4">{slotsError}</p>
            ) : dates.length === 0 ? (
                <p className="text-sm text-[#a0b8ac] text-center py-4">No availability in the next two weeks.</p>
            ) : (
                <>
                    <div className="flex gap-2 overflow-x-auto pb-1 mb-3">
                        {dates.map((date) => {
                            const active = date === selectedDate;
                            return (
                                <button
                                    key={date}
                                    onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}
                                    className="shrink-0 px-3 py-1.5 rounded-lg border text-xs"
                                    style={{ borderColor: active ? "var(--sage)" : "#e4eee8", background: active ? "rgba(123,169,139,0.1)" : "white", color: active ? "var(--sage-dark)" : "#7a9088", fontWeight: active ? 600 : 400 }}
                                >
                                    {new Date(date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                                </button>
                            );
                        })}
                    </div>
                    {selectedDate && (
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {(slotsByDate[selectedDate] ?? []).map((slot) => {
                                const active = slot.time === selectedSlot;
                                return (
                                    <button
                                        key={slot.time}
                                        onClick={() => setSelectedSlot(slot.time)}
                                        className="px-2 py-2 rounded-lg border text-xs"
                                        style={{ borderColor: active ? "var(--sage)" : "#e4eee8", background: active ? "rgba(123,169,139,0.1)" : "white", color: active ? "var(--sage-dark)" : "#7a9088", fontWeight: active ? 600 : 400 }}
                                    >
                                        {new Date(slot.time).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason (shown to the client, optional)"
                rows={2}
                className="w-full px-3 py-2 rounded-xl border text-sm outline-none mb-4"
                style={{ borderColor: "#e4eee8" }}
            />
            <button
                onClick={() => selectedSlot && onConfirm(selectedSlot, reason)}
                disabled={busy || !selectedSlot}
                className="w-full py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
            >
                {busy ? "Rescheduling…" : "Confirm new time"}
            </button>
        </ModalShell>
    );
}

function GrantModal({ session, busy, onClose, onConfirm }: {
    session: SessionRow; busy: boolean; onClose: () => void; onConfirm: (reason: string, count: number) => void;
}) {
    const [reason, setReason] = useState("");
    const [count, setCount] = useState(1);

    return (
        <ModalShell title={`Grant free session — ${session.lead.name}`} onClose={onClose}>
            <p className="text-xs text-[#7a9088] mb-3">Adds a no-charge session to their account, valid for 30 days. They'll get an email letting them know.</p>
            <div className="flex items-center gap-2 mb-3">
                <label className="text-xs text-[#5a7a6e]">Number of sessions</label>
                <input type="number" min={1} max={10} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-16 px-2 py-1.5 rounded-lg border text-sm" style={{ borderColor: "#e4eee8" }} />
            </div>
            <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason (shown to the client, optional)"
                rows={2}
                className="w-full px-3 py-2 rounded-xl border text-sm outline-none mb-4"
                style={{ borderColor: "#e4eee8" }}
            />
            <button
                onClick={() => onConfirm(reason, count)}
                disabled={busy}
                className="w-full py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
            >
                {busy ? "Granting…" : "Grant session"}
            </button>
        </ModalShell>
    );
}
