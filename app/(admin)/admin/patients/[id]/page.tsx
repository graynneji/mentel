"use client";

// app/admin/patients/[id]/page.tsx
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft, Mail, Phone, Calendar, FileText, DollarSign,
    Edit3, MessageSquare, CheckCircle, AlertCircle, X, Send,
    Clock, Activity, TrendingUp, User, Tag, RefreshCw,
    Plus, Trash2, ChevronRight,
} from "lucide-react";

interface Message { id: string; createdAt: string; subject: string; type: string; }
interface Payment { id: string; amountKobo: number; status: string; method: string; paidAt: string | null; createdAt: string; }
interface Session {
    id: string; conductedAt: string; therapist: string; type: string;
    durationMin: number; notes: string | null; mood: number | null; progress: string | null;
    payment: Payment | null;
}
interface Appointment {
    id: string; scheduledAt: string; durationMin: number; therapist: string;
    type: string; status: string; notes: string | null; createdAt: string;
    session: Session | null;
}
interface Lead {
    id: string; createdAt: string; updatedAt: string;
    name: string; email: string; phone: string | null;
    score: number; band: string; severity: string; answers: Record<string, number>;
    status: string; notes: string | null; source: string | null; therapist: string | null; tags: string[];
    seq1SentAt: string | null; seq2SentAt: string | null; seq3SentAt: string | null;
    messages: Message[];
    appointments: Appointment[];
    sessions: Session[];
    payments: Payment[];
    _count?: { appointments: number; sessions: number; payments: number };
}

const BAND_COLORS: Record<string, string> = {
    Low: "#4e8c6a", Mild: "#3d8b8b", Moderate: "#8b6e3d", High: "#b94a4f",
};
const STATUS_CFG: Record<string, { bg: string; text: string; dot: string }> = {
    new: { bg: "#edf7f1", text: "#3a7a58", dot: "#7ba98b" },
    contacted: { bg: "#e8f4f8", text: "#2a5a7a", dot: "#6fb8b8" },
    booked: { bg: "#f0edf7", text: "#5a3a7a", dot: "#a88bcf" },
    inactive: { bg: "#f5f5f5", text: "#7a7a7a", dot: "#b0b0b0" },
    churned: { bg: "#fff0f0", text: "#7a3a3a", dot: "#cf8b8b" },
};
const Q_LABELS: Record<string, string> = {
    q1: "Mood", q2: "Anxiety", q3: "Energy", q4: "Sleep",
    q5: "Relationships", q6: "Stress", q7: "Self-worth", q8: "Support",
};

const fmtNaira = (kobo: number) => `₦${(kobo / 100).toLocaleString("en-NG")}`;
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

export default function PatientDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [lead, setLead] = useState<Lead | null>(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
    const [activeTab, setActiveTab] = useState<"overview" | "appointments" | "sessions" | "payments" | "messages">("overview");

    // Modals
    const [modal, setModal] = useState<"notes" | "message" | "book" | "status" | null>(null);
    const [notes, setNotes] = useState("");
    const [saving, setSaving] = useState(false);
    const [sending, setSending] = useState<string | null>(null);
    const [booking, setBooking] = useState(false);

    // Book form
    const [bookDate, setBookDate] = useState("");
    const [bookTime, setBookTime] = useState("09:00");
    const [bookTherapist, setBookTherapist] = useState("");
    const [bookType, setBookType] = useState("initial");
    const [bookDuration, setBookDuration] = useState("50");
    const [bookNotes, setBookNotes] = useState("");
    const [sendBookingEmail, setSendBookingEmail] = useState(true);

    // Message form
    const [msgSubject, setMsgSubject] = useState("");
    const [msgBody, setMsgBody] = useState("");

    // Settings data
    const [therapists, setTherapists] = useState<{ id: string; name: string; title: string; color: string }[]>([]);
    const [sessionTypes, setSessionTypes] = useState<{ id: string; name: string; durationMin: number; priceKobo: number }[]>([]);

    const showToast = (msg: string, ok = true) => {
        setToast({ msg, ok }); setTimeout(() => setToast(null), 3500);
    };

    // const fetchLead = useCallback(async () => {
    //     setLoading(true);
    //     try {
    //         const res = await fetch(`/api/admin/leads/${id}`);
    //         const data = await res.json();
    //         console.log(data, "leads detail data");
    //         if (data.success) {
    //             setLead(data.lead);
    //             setNotes(data.lead.notes ?? "");
    //         }
    //     } finally { setLoading(false); }
    // }, [id]);

    const fetchLead = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/leads/${id}`);
            if (!res.ok) {
                const errorData = await res.json();
                console.error("API Error:", errorData.error);
                return;
            }
            const data = await res.json();
            if (data.success) {
                setLead(data.lead);
                setNotes(data.lead.notes ?? "");
            }
        } catch (err) {
            console.error("Fetch failed:", err);
        } finally { setLoading(false); }
    }, [id]);

    const fetchSettings = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/settings");
            const data = await res.json();
            if (data.success) {
                setTherapists(data.therapists ?? []);
                setSessionTypes(data.sessionTypes ?? []);
                if (data.therapists?.length) setBookTherapist(data.therapists[0].id);
                if (data.sessionTypes?.length) setBookType(data.sessionTypes[0].id);
            }
        } catch { /* ignore */ }
    }, []);

    useEffect(() => { fetchLead(); fetchSettings(); }, [fetchLead, fetchSettings]);

    const updateStatus = async (status: string) => {
        if (!lead) return;
        await fetch("/api/admin/leads", {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: lead.id, status }),
        });
        setLead(l => l ? { ...l, status } : l);
        showToast("Status updated");
    };

    const updateTherapist = async (therapist: string) => {
        if (!lead) return;
        await fetch("/api/admin/leads", {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: lead.id, therapist }),
        });
        setLead(l => l ? { ...l, therapist } : l);
        showToast("Therapist assigned");
    };

    const saveNotes = async () => {
        if (!lead) return;
        setSaving(true);
        await fetch("/api/admin/leads", {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: lead.id, notes }),
        });
        setLead(l => l ? { ...l, notes } : l);
        setSaving(false); showToast("Notes saved"); setModal(null);
    };

    const sendMsg = async (type: string) => {
        if (!lead) return;
        setSending(type);
        try {
            const res = await fetch("/api/admin/message", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    leadId: lead.id, type,
                    ...(type === "custom" ? { customSubject: msgSubject, customBody: msgBody } : {}),
                }),
            });
            const data = await res.json();
            if (data.success) { showToast("Message sent!"); setModal(null); setMsgSubject(""); setMsgBody(""); fetchLead(); }
            else showToast("Failed to send", false);
        } catch { showToast("Failed to send", false); }
        finally { setSending(null); }
    };

    const bookAppointment = async () => {
        if (!lead || !bookDate) return;
        setBooking(true);
        try {
            const res = await fetch("/api/admin/appointments", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    leadId: lead.id,
                    scheduledAt: `${bookDate}T${bookTime}:00`,
                    therapist: bookTherapist,
                    type: bookType,
                    durationMin: parseInt(bookDuration),
                    notes: bookNotes || undefined,
                    sendEmail: sendBookingEmail,
                }),
            });
            const data = await res.json();
            if (data.success) {
                showToast("Appointment booked!" + (sendBookingEmail ? " Email sent." : ""));
                setModal(null); setBookDate(""); setBookNotes("");
                fetchLead();
            } else showToast("Failed to book", false);
        } finally { setBooking(false); }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-7 h-7 rounded-full border-2 border-[#4e8c6a] border-t-transparent animate-spin" />
        </div>
    );

    if (!lead) return (
        <div className="text-center py-20">
            <p className="text-[#7a9088]">Patient not found</p>
            <Link href="/admin/patients" className="mt-3 inline-block text-[#4e7a5e] text-sm underline">Back to patients</Link>
        </div>
    );

    const bc = BAND_COLORS[lead.band] ?? "#7ba98b";
    const sc = STATUS_CFG[lead.status] ?? STATUS_CFG.new;
    const totalPaid = lead.payments.filter(p => p.status === "paid").reduce((s, p) => s + p.amountKobo, 0);
    const seqDone = [lead.seq1SentAt, lead.seq2SentAt, lead.seq3SentAt].filter(Boolean).length;

    const TABS = [
        { id: "overview", label: "Overview" },
        { id: "appointments", label: `Appointments (${lead.appointments?.length ?? 0})` },
        { id: "sessions", label: `Sessions (${lead.sessions?.length ?? 0})` },
        { id: "payments", label: `Payments (${lead.payments?.length ?? 0})` },
        { id: "messages", label: `Messages (${lead.messages?.length ?? 0})` },
    ] as const;

    return (
        <div className="flex flex-col gap-5 max-w-full">
            <style>{`
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        .modal-bg { animation: fadeIn 0.18s ease; }
        .modal-card { animation: slideUp 0.22s ease; }
      `}</style>

            {toast && (
                <div className="fixed top-5 right-5 z-[9999] flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-[13px] font-medium shadow-lg"
                    style={{ background: toast.ok ? "#1c3a3a" : "#b94a4f", animation: "slideIn 0.2s ease" }}>
                    {toast.ok ? <CheckCircle size={14} /> : <AlertCircle size={14} />} {toast.msg}
                </div>
            )}

            {/* Back + header */}
            <div className="flex items-start gap-4">
                <button onClick={() => router.back()} className="mt-1 p-2 rounded-xl border border-[#ddeae2] bg-white text-[#7a9088] cursor-pointer hover:bg-[#f7faf8] shrink-0">
                    <ArrowLeft size={14} />
                </button>
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
                            style={{ background: `${bc}20`, color: bc }}>
                            {lead.name.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-[20px] font-bold text-[#1c3a3a]">{lead.name}</h1>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className="text-[11px] px-2 py-[2px] rounded-full font-semibold" style={{ background: `${bc}18`, color: bc }}>{lead.band}</span>
                                <span className="text-[11px] px-2 py-[2px] rounded-full font-semibold flex items-center gap-1" style={{ background: sc.bg, color: sc.text }}>
                                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: sc.dot }} />{lead.status}
                                </span>
                                {lead.therapist && <span className="text-[11px] px-2 py-[2px] rounded-full bg-[#edf7f1] text-[#4e7a5e] font-medium">{lead.therapist}</span>}
                            </div>
                        </div>
                        <div className="ml-auto flex flex-wrap gap-2">
                            <button onClick={() => setModal("book")}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold text-white border-none cursor-pointer"
                                style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" }}>
                                <Calendar size={12} /> Book Appointment
                            </button>
                            <button onClick={() => setModal("message")}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium cursor-pointer border border-[#ddeae2] bg-white text-[#7a9088] hover:bg-[#f7faf8]">
                                <MessageSquare size={12} /> Message
                            </button>
                            <button onClick={() => { setNotes(lead.notes ?? ""); setModal("notes"); }}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium cursor-pointer border border-[#ddeae2] bg-white text-[#7a9088] hover:bg-[#f7faf8]">
                                <Edit3 size={12} /> Notes
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats strip */}
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))" }}>
                {[
                    { label: "Score", value: `${lead.score}/24`, color: bc, icon: Activity },
                    { label: "Sessions", value: lead.sessions?.length ?? 0, color: "#3d8b8b", icon: Calendar },
                    { label: "Total Paid", value: fmtNaira(totalPaid), color: "#4e8c6a", icon: DollarSign },
                    { label: "Emails Sent", value: `${seqDone}/3`, color: "#7b6fa9", icon: Mail },
                ].map(({ label, value, color, icon: Icon }) => (
                    <div key={label} className="bg-white rounded-2xl border border-[#ddeae2] px-4 py-3 shadow-[0_1px_6px_rgba(28,58,58,0.04)]">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
                                <Icon size={13} style={{ color }} />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wide text-[#7a9088]">{label}</span>
                        </div>
                        <div className="text-[18px] font-bold text-[#1c3a3a]">{value}</div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-[#ddeae2] overflow-hidden shadow-[0_1px_8px_rgba(28,58,58,0.04)]">
                <div className="flex overflow-x-auto border-b border-[#ddeae2]">
                    {TABS.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className="px-4 py-3 text-[12px] font-semibold whitespace-nowrap cursor-pointer border-none transition-colors shrink-0"
                            style={{
                                background: "transparent",
                                color: activeTab === tab.id ? "#4e7a5e" : "#7a9088",
                                borderBottom: activeTab === tab.id ? "2px solid #4e7a5e" : "2px solid transparent",
                            }}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-5">
                    {/* OVERVIEW TAB */}
                    {activeTab === "overview" && (
                        <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
                            {/* Contact + details */}
                            <div>
                                <p className="text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-3">Contact Info</p>
                                <div className="flex flex-col gap-2 mb-5">
                                    {[
                                        { icon: Mail, label: lead.email },
                                        { icon: Phone, label: lead.phone || "—" },
                                        { icon: Calendar, label: `Joined ${fmtDate(lead.createdAt)}` },
                                        { icon: Tag, label: lead.source || "organic" },
                                    ].map(({ icon: Icon, label }) => (
                                        <div key={label} className="flex items-center gap-2 text-[12px] text-[#7a9088]">
                                            <Icon size={13} className="text-[#4e7a5e] shrink-0" />
                                            {label}
                                        </div>
                                    ))}
                                </div>

                                <p className="text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-3">Symptom Scores</p>
                                <div className="flex flex-col gap-2">
                                    {Object.entries(lead.answers).map(([k, v]) => (
                                        <div key={k} className="grid items-center gap-2" style={{ gridTemplateColumns: "90px 1fr auto" }}>
                                            <span className="text-[11px] text-[#7a9088]">{Q_LABELS[k] ?? k}</span>
                                            <div className="h-1.5 bg-[#e8eeea] rounded-full overflow-hidden">
                                                <div className="h-full rounded-full" style={{ width: `${(v / 3) * 100}%`, background: bc }} />
                                            </div>
                                            <span className="text-[10px] text-[#7a9088]">{v}/3</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Status + therapist + notes */}
                            <div>
                                <p className="text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-2">Update Status</p>
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {["new", "contacted", "booked", "inactive", "churned"].map(s => (
                                        <button key={s} onClick={() => updateStatus(s)}
                                            className="px-3 py-[5px] rounded-full text-[11px] font-semibold cursor-pointer transition-all"
                                            style={{
                                                border: lead.status === s ? `2px solid ${STATUS_CFG[s]?.dot}` : "1.5px solid #ddeae2",
                                                background: lead.status === s ? STATUS_CFG[s]?.bg : "white",
                                                color: lead.status === s ? STATUS_CFG[s]?.text : "#7a9088",
                                            }}>
                                            {s}
                                        </button>
                                    ))}
                                </div>

                                <p className="text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-2">Assign Therapist</p>
                                <select value={lead.therapist ?? ""} onChange={e => updateTherapist(e.target.value)}
                                    className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] cursor-pointer outline-none text-[#1c3a3a] mb-4"
                                    style={{ fontFamily: "inherit", appearance: "none" }}>
                                    <option value="">— Unassigned —</option>
                                    {therapists.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                                </select>

                                {lead.notes && (
                                    <>
                                        <p className="text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-2">Notes</p>
                                        <div className="px-3 py-2.5 bg-[#f7faf8] rounded-xl border border-[#e8f0ec] text-[12px] italic text-[#7a9088] leading-relaxed">
                                            {lead.notes}
                                        </div>
                                    </>
                                )}

                                {/* Email sequence */}
                                <p className="text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-2 mt-4">Email Sequence</p>
                                <div className="flex flex-col gap-1.5">
                                    {[
                                        { key: "seq1", label: "Email 1 — Value nudge", sent: lead.seq1SentAt },
                                        { key: "seq2", label: "Email 2 — Check-in", sent: lead.seq2SentAt },
                                        { key: "seq3", label: "Email 3 — Booking push", sent: lead.seq3SentAt },
                                    ].map(({ key, label, sent }) => (
                                        <div key={key} className="flex items-center justify-between gap-2 px-3 py-2 bg-[#f7faf8] rounded-lg border border-[#e8f0ec]">
                                            <div className="flex-1">
                                                <div className="text-[11px] text-[#1c3a3a]">{label}</div>
                                                {sent && <div className="text-[10px] text-[#4e7a5e]">Sent {fmtDate(sent)}</div>}
                                            </div>
                                            <button disabled={!!sent || sending === key} onClick={() => sendMsg(key)}
                                                className="px-3 py-[4px] rounded-full text-[11px] font-semibold border-none cursor-pointer flex items-center gap-1"
                                                style={{ background: sent ? "#edf7f1" : "linear-gradient(135deg,#4e7a5e,#3d8b8b)", color: sent ? "#4e7a5e" : "white", cursor: sent ? "not-allowed" : "pointer" }}>
                                                {sent ? <><CheckCircle size={10} /> Sent</> : sending === key ? "Sending…" : <><Send size={10} /> Send</>}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* APPOINTMENTS TAB */}
                    {activeTab === "appointments" && (
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[12px] text-[#7a9088]">{lead.appointments?.length ?? 0} total</span>
                                <button onClick={() => setModal("book")}
                                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold text-white border-none cursor-pointer"
                                    style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" }}>
                                    <Plus size={12} /> Book New
                                </button>
                            </div>
                            {(lead.appointments ?? []).length === 0 ? (
                                <div className="text-center py-10 text-[#7a9088] text-sm">No appointments yet</div>
                            ) : (
                                [...(lead.appointments ?? [])].sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()).map(appt => (
                                    <div key={appt.id} className="flex items-start gap-3 p-4 bg-[#f7faf8] rounded-xl border border-[#e8f0ec]">
                                        <div className="shrink-0 text-center w-12">
                                            <div className="text-[13px] font-bold text-[#1c3a3a]">{fmtTime(appt.scheduledAt)}</div>
                                            <div className="text-[9px] text-[#7a9088]">{appt.durationMin}min</div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-[12px] font-semibold text-[#1c3a3a]">{appt.type}</span>
                                                <span className="text-[10px] font-medium px-2 py-[1px] rounded-full"
                                                    style={{
                                                        background: appt.status === "completed" ? "#edf7f1" : appt.status === "scheduled" ? "#e8f4f8" : "#f5f5f5",
                                                        color: appt.status === "completed" ? "#3a7a58" : appt.status === "scheduled" ? "#2a5a7a" : "#7a7a7a",
                                                    }}>
                                                    {appt.status}
                                                </span>
                                                {appt.session && <span className="text-[10px] font-semibold px-1.5 py-[1px] rounded-full bg-[#edf7f1] text-[#4e7a5e]">✓ Logged</span>}
                                            </div>
                                            <div className="text-[11px] text-[#7a9088] mt-0.5">{fmtDate(appt.scheduledAt)} · {appt.therapist}</div>
                                            {appt.notes && <div className="text-[11px] italic text-[#7a9088] mt-1">{appt.notes}</div>}
                                            {appt.session?.payment && (
                                                <div className="mt-1.5 text-[11px] font-semibold text-[#4e7a5e]">
                                                    {fmtNaira(appt.session.payment.amountKobo)} · {appt.session.payment.method}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* SESSIONS TAB */}
                    {activeTab === "sessions" && (
                        <div className="flex flex-col gap-3">
                            {(lead.sessions ?? []).length === 0 ? (
                                <div className="text-center py-10 text-[#7a9088] text-sm">No sessions logged yet</div>
                            ) : (
                                [...(lead.sessions ?? [])].sort((a, b) => new Date(b.conductedAt).getTime() - new Date(a.conductedAt).getTime()).map(s => (
                                    <div key={s.id} className="p-4 bg-[#f7faf8] rounded-xl border border-[#e8f0ec]">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="text-[13px] font-semibold text-[#1c3a3a]">{fmtDate(s.conductedAt)} at {fmtTime(s.conductedAt)}</div>
                                                <div className="text-[11px] text-[#7a9088] mt-0.5">{s.therapist} · {s.type} · {s.durationMin}min</div>
                                            </div>
                                            {s.mood && (
                                                <div className="shrink-0 w-9 h-9 rounded-full bg-[#edf7f1] flex items-center justify-center text-[12px] font-bold text-[#4e7a5e]">
                                                    {s.mood}/5
                                                </div>
                                            )}
                                        </div>
                                        {s.notes && <div className="mt-2 text-[11px] italic text-[#7a9088]">{s.notes}</div>}
                                        {s.progress && <div className="mt-1 text-[11px] text-[#1c3a3a]">{s.progress}</div>}
                                        {s.payment && (
                                            <div className="mt-2 pt-2 border-t border-[#e8f0ec] flex items-center justify-between">
                                                <span className="text-[11px] text-[#7a9088]">Payment</span>
                                                <span className="text-[12px] font-bold" style={{ color: s.payment.status === "paid" ? "#4e7a5e" : "#8b6e3d" }}>
                                                    {fmtNaira(s.payment.amountKobo)} · {s.payment.status}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* PAYMENTS TAB */}
                    {activeTab === "payments" && (
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="px-4 py-2 bg-[#edf7f1] rounded-xl text-[12px] font-semibold text-[#4e7a5e]">
                                    Total: {fmtNaira(totalPaid)}
                                </div>
                                <div className="px-4 py-2 bg-[#fff8f0] rounded-xl text-[12px] font-semibold text-[#8b6e3d]">
                                    Pending: {fmtNaira(lead.payments.filter(p => p.status === "pending").reduce((s, p) => s + p.amountKobo, 0))}
                                </div>
                            </div>
                            {lead.payments.length === 0 ? (
                                <div className="text-center py-10 text-[#7a9088] text-sm">No payments yet</div>
                            ) : (
                                [...lead.payments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(p => (
                                    <div key={p.id} className="flex items-center gap-3 p-4 bg-[#f7faf8] rounded-xl border border-[#e8f0ec]">
                                        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                                            style={{ background: p.status === "paid" ? "#edf7f1" : "#fff8f0" }}>
                                            <DollarSign size={14} style={{ color: p.status === "paid" ? "#4e7a5e" : "#8b6e3d" }} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-[13px] font-bold text-[#1c3a3a]">{fmtNaira(p.amountKobo)}</div>
                                            <div className="text-[11px] text-[#7a9088]">{p.method} · {fmtDate(p.createdAt)}</div>
                                        </div>
                                        <span className="text-[11px] font-semibold px-2 py-[3px] rounded-full"
                                            style={{
                                                background: p.status === "paid" ? "#edf7f1" : "#fff8f0",
                                                color: p.status === "paid" ? "#3a7a58" : "#8b6e3d",
                                            }}>
                                            {p.status}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* MESSAGES TAB */}
                    {activeTab === "messages" && (
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-end mb-1">
                                <button onClick={() => setModal("message")}
                                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold text-white border-none cursor-pointer"
                                    style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" }}>
                                    <Plus size={12} /> New Message
                                </button>
                            </div>
                            {lead.messages.length === 0 ? (
                                <div className="text-center py-10 text-[#7a9088] text-sm">No messages sent yet</div>
                            ) : (
                                [...lead.messages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(m => (
                                    <div key={m.id} className="flex items-center gap-3 p-4 bg-[#f7faf8] rounded-xl border border-[#e8f0ec]">
                                        <div className="w-8 h-8 rounded-full bg-[#e8f4f8] flex items-center justify-center shrink-0">
                                            <Mail size={13} className="text-[#3d8b8b]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[12px] font-semibold text-[#1c3a3a] truncate">{m.subject}</div>
                                            <div className="text-[10px] text-[#7a9088]">{m.type} · {fmtDate(m.createdAt)}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL: Book Appointment */}
            {modal === "book" && (
                <div className="modal-bg fixed inset-0 bg-[rgba(28,58,58,0.45)] z-[200] flex items-center justify-center p-4 overflow-y-auto" onClick={() => setModal(null)}>
                    <div className="modal-card bg-white rounded-2xl w-full max-w-[480px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden my-4" onClick={e => e.stopPropagation()}>
                        <div className="px-5 py-4 border-b border-[#ddeae2] flex items-center justify-between">
                            <div>
                                <div className="text-[15px] font-semibold text-[#1c3a3a]">Book Appointment</div>
                                <div className="text-[11px] text-[#7a9088]">{lead.name}</div>
                            </div>
                            <button onClick={() => setModal(null)} className="bg-transparent border-none cursor-pointer text-[#7a9088]"><X size={18} /></button>
                        </div>
                        <div className="p-5 flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-1.5">Date</label>
                                    <input type="date" value={bookDate} onChange={e => setBookDate(e.target.value)} min={new Date().toISOString().split("T")[0]}
                                        className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-1.5">Time</label>
                                    <input type="time" value={bookTime} onChange={e => setBookTime(e.target.value)}
                                        className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-1.5">Therapist</label>
                                <select value={bookTherapist} onChange={e => setBookTherapist(e.target.value)}
                                    className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit", appearance: "none" }}>
                                    <option value="">— Select therapist —</option>
                                    {therapists.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-1.5">Type</label>
                                    <select value={bookType} onChange={e => setBookType(e.target.value)}
                                        className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit", appearance: "none" }}>
                                        {sessionTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-1.5">Duration (min)</label>
                                    <select value={bookDuration} onChange={e => setBookDuration(e.target.value)}
                                        className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit", appearance: "none" }}>
                                        {["30", "45", "50", "60", "90"].map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-1.5">Notes (optional)</label>
                                <textarea value={bookNotes} onChange={e => setBookNotes(e.target.value)} rows={2} placeholder="Any notes…"
                                    className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7fal8] outline-none text-[#1c3a3a] resize-none leading-relaxed" style={{ fontFamily: "inherit" }} />
                            </div>
                            {/* Email option */}
                            <label className="flex items-center gap-2 cursor-pointer px-3 py-2.5 bg-[#f7faf8] rounded-xl border border-[#e8f0ec]">
                                <input type="checkbox" checked={sendBookingEmail} onChange={e => setSendBookingEmail(e.target.checked)}
                                    className="w-4 h-4 rounded accent-[#4e7a5e]" />
                                <span className="text-[12px] text-[#1c3a3a]">Send confirmation email to client</span>
                            </label>
                            <div className="flex gap-2 justify-end mt-1">
                                <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-[#ddeae2] bg-white text-[#7a9088] text-[12px] cursor-pointer">Cancel</button>
                                <button onClick={bookAppointment} disabled={!bookDate || booking}
                                    className="px-5 py-2 rounded-xl border-none text-white text-[12px] font-semibold cursor-pointer flex items-center gap-1.5"
                                    style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)", opacity: !bookDate ? 0.5 : 1 }}>
                                    <Calendar size={13} /> {booking ? "Booking…" : "Book"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: Notes */}
            {modal === "notes" && (
                <div className="modal-bg fixed inset-0 bg-[rgba(28,58,58,0.45)] z-[200] flex items-center justify-center p-4" onClick={() => setModal(null)}>
                    <div className="modal-card bg-white rounded-2xl w-full max-w-[440px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="px-5 py-4 border-b border-[#ddeae2] flex items-center justify-between">
                            <div className="text-[15px] font-semibold text-[#1c3a3a]">Clinical Notes — {lead.name}</div>
                            <button onClick={() => setModal(null)} className="bg-transparent border-none cursor-pointer text-[#7a9088]"><X size={18} /></button>
                        </div>
                        <div className="p-5">
                            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={6} placeholder="Add clinical notes, follow-up reminders…"
                                className="w-full px-3 py-2.5 border border-[#ddeae2] rounded-xl text-[12px] text-[#1c3a3a] resize-y outline-none bg-[#f7faf8] leading-relaxed" style={{ fontFamily: "inherit" }} />
                            <div className="flex gap-2 justify-end mt-3">
                                <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-[#ddeae2] bg-white text-[#7a9088] text-[12px] cursor-pointer">Cancel</button>
                                <button onClick={saveNotes} disabled={saving}
                                    className="px-5 py-2 rounded-xl border-none text-white text-[12px] font-semibold cursor-pointer"
                                    style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" }}>
                                    {saving ? "Saving…" : "Save Notes"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: Custom message */}
            {modal === "message" && (
                <div className="modal-bg fixed inset-0 bg-[rgba(28,58,58,0.45)] z-[200] flex items-center justify-center p-4" onClick={() => setModal(null)}>
                    <div className="modal-card bg-white rounded-2xl w-full max-w-[480px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="px-5 py-4 border-b border-[#ddeae2] flex items-center justify-between">
                            <div className="text-[15px] font-semibold text-[#1c3a3a]">Message — {lead.name}</div>
                            <button onClick={() => setModal(null)} className="bg-transparent border-none cursor-pointer text-[#7a9088]"><X size={18} /></button>
                        </div>
                        <div className="p-5 flex flex-col gap-3">
                            <div>
                                <label className="block text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-1.5">Subject</label>
                                <input type="text" value={msgSubject} onChange={e => setMsgSubject(e.target.value)} placeholder="Email subject…"
                                    className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-[#4e7a5e] uppercase tracking-wide mb-1.5">Message</label>
                                <textarea value={msgBody} onChange={e => setMsgBody(e.target.value)} rows={6} placeholder={`Write to ${lead.name}…`}
                                    className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-[#f7faf8] outline-none text-[#1c3a3a] resize-y leading-relaxed" style={{ fontFamily: "inherit" }} />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-[#ddeae2] bg-white text-[#7a9088] text-[12px] cursor-pointer">Cancel</button>
                                <button onClick={() => sendMsg("custom")} disabled={!msgSubject.trim() || !msgBody.trim() || sending === "custom"}
                                    className="px-5 py-2 rounded-xl border-none text-white text-[12px] font-semibold cursor-pointer flex items-center gap-1.5"
                                    style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)", opacity: !msgSubject.trim() || !msgBody.trim() ? 0.5 : 1 }}>
                                    <Send size={12} /> {sending === "custom" ? "Sending…" : "Send"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}