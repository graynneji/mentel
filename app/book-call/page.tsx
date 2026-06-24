"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Menu, X, Shield, CheckCircle, Clock, Video,
    ArrowLeft, ChevronLeft, ChevronRight, ChevronDown, Loader2, CalendarCheck,
} from "lucide-react";
import { PageWrapper } from "@/components/AssessmentPage";
import { useSearchParams } from "next/navigation";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// HOW TO FIND YOUR EVENT TYPE ID:
//   1. Go to app.cal.com → Event Types
//   2. Click Edit on your event
//   3. Look at the URL: /event-types/1234567  ← that number is your ID
// ─────────────────────────────────────────────────────────────────────────────
// const CAL_EVENT_TYPE_ID: number = 6101260; // ← replace with your numeric ID e.g. 1234567
const TIMEZONE = "Africa/Lagos";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface AssessmentData {
    name: string;
    email: string;
    score: number;
    CAL_EVENT_TYPE_ID: number;
}

interface BandMeta {
    label: string;
    accentColor: string;
    accentLight: string;
}

type BookingStep = "calendar" | "confirm" | "success";
type SlotMap = Record<string, string[]>;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
// NOTE: gradients removed from band meta — severity-band color is now used only
// as a small, quiet accent (badge, checkmark, button) rather than as a large
// colored surface. A page that says "critical" should not also feel alarming
// to look at right before someone books a supportive call.

function getBandMeta(score: number): BandMeta {
    if (score <= 6)
        return { label: "Latent Drift Pattern", accentColor: "#2d7a5a", accentLight: "rgba(45,122,90,0.07)" };
    if (score <= 12)
        return { label: "Cortisol Stall Pattern", accentColor: "#1e6b6b", accentLight: "rgba(30,107,107,0.07)" };
    if (score <= 18)
        return { label: "Functional Freeze Pattern", accentColor: "#2d4a6e", accentLight: "rgba(45,74,110,0.07)" };
    return { label: "Critical Threshold Pattern", accentColor: "#a33030", accentLight: "rgba(163,48,48,0.06)" };
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toDateKey(d: Date) { return d.toISOString().slice(0, 10); }

function formatTime(iso: string, tz: string) {
    return new Date(iso).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: tz });
}

function formatConfirmDate(iso: string, tz: string) {
    return new Date(iso).toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: tz });
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function BookCallPage() {
    const [assessment, setAssessment] = useState<AssessmentData | null>(null);
    const [hydrated, setHydrated] = useState(false);

    const today = new Date();
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [CAL_EVENT_TYPE_ID, setCal_EVENT_TYPE_ID] = useState<number>(0);

    const [slotMap, setSlotMap] = useState<SlotMap>({});
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [slotsError, setSlotsError] = useState<string | null>(null);

    const [step, setStep] = useState<BookingStep>("calendar");
    const [submitting, setSubmitting] = useState(false);
    const [bookingError, setBookingError] = useState<string | null>(null);

    const searchParams = useSearchParams();

    const from = searchParams.get("from");

    // Supporting copy is now an opt-in disclosure, not a competing hero block.
    // Closed by default — the person already decided to book; this is here
    // for anyone who wants reassurance, not for everyone by default.
    const [expectOpen, setExpectOpen] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [notes, setNotes] = useState("");

    // FIX: Whether event ID is configured
    const isConfigured = CAL_EVENT_TYPE_ID !== 0;

    useEffect(() => {
        if (typeof window === "undefined") return;
        const raw = sessionStorage.getItem(from === "verify" ? "mentel_booking" : "mentel_assessment_result");
        if (raw) {
            try {
                const p = JSON.parse(raw) as AssessmentData;

                setAssessment(p);
                setName(p.name ?? "");
                setEmail(p.email ?? "");
                setCal_EVENT_TYPE_ID(p.CAL_EVENT_TYPE_ID ?? 0);
            } catch { /* no-op */ }
        }
        setHydrated(true);
    }, []);

    const fetchSlots = useCallback(async (year: number, month: number) => {
        // FIX: Don't block the calendar UI — just skip the fetch silently
        if (!isConfigured) return;
        setLoadingSlots(true);
        setSlotsError(null);
        const start = new Date(year, month, 1).toISOString().slice(0, 10);
        const end = new Date(year, month + 1, 14).toISOString().slice(0, 10);
        try {
            const res = await fetch(`/api/cal/slots?eventTypeId=${CAL_EVENT_TYPE_ID}&start=${start}&end=${end}&from=${from}&timeZone=${encodeURIComponent(TIMEZONE)}`);
            const json = await res.json();

            if (!res.ok) { setSlotsError("Couldn't load available times. Please try again."); return; }
            const raw: Record<string, Array<{ start: string }>> = json.data ?? {};
            const map: SlotMap = {};
            for (const [date, slots] of Object.entries(raw)) { map[date] = slots.map(s => s.start); }
            setSlotMap(prev => ({ ...prev, ...map }));
        } catch { setSlotsError("Network error. Please refresh and try again."); }
        finally { setLoadingSlots(false); }
    }, [isConfigured]);

    useEffect(() => { if (hydrated) fetchSlots(viewYear, viewMonth); }, [hydrated, viewYear, viewMonth, fetchSlots]);

    const handleBook = useCallback(async () => {
        if (!selectedSlot || !name || !email) return;
        setSubmitting(true);
        setBookingError(null);
        try {
            const res = await fetch("/api/cal/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ eventTypeId: CAL_EVENT_TYPE_ID, start: selectedSlot, name, email, timeZone: TIMEZONE, from, notes: notes || undefined }),
            });
            const json = await res.json();
            if (!res.ok || !json.success) { setBookingError(json.error ?? "Something went wrong. Please try again."); return; }
            setStep("success");
        } catch { setBookingError("Network error. Please try again."); }
        finally { setSubmitting(false); }
    }, [selectedSlot, name, email, notes]);

    if (!hydrated) return null;

    const band = getBandMeta(assessment?.score ?? 0);
    const firstName = (assessment?.name ?? name)?.split(" ")[0] ?? "";
    const todayKey = toDateKey(today);
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    // FIX: Only block going back to a month already passed
    const isPastMonth = viewYear < today.getFullYear() || (viewYear === today.getFullYear() && viewMonth < today.getMonth());
    const slotsForDate = selectedDate ? (slotMap[selectedDate] ?? []) : [];

    function prevMonth() {
        if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); } else setViewMonth(m => m - 1);
        setSelectedDate(null); setSelectedSlot(null);
    }
    function nextMonth() {
        if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); } else setViewMonth(m => m + 1);
        setSelectedDate(null); setSelectedSlot(null);
    }

    // ── SUCCESS ──────────────────────────────────────────────────────────────
    if (step === "success") {
        return (
            <PageWrapper>
                <div className="min-h-screen bg-[#faf9f6] font-['DM_Sans',sans-serif]"><style>{globalStyles}</style>
                    <div className="min-h-screen flex items-center justify-center px-6 pt-20">
                        <div className="max-w-[480px] w-full text-center fade-up">
                            <div className="w-20 h-20 rounded-full mx-auto mb-7 flex items-center justify-center" style={{ background: band.accentLight }}>
                                <CalendarCheck size={36} stroke={band.accentColor} strokeWidth={1.6} />
                            </div>
                            <h1 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(32px,6vw,48px)] font-light leading-[1.1] text-[#1c2820] mb-4">
                                You're booked{firstName ? `, ${firstName}` : ""}
                            </h1>
                            <p className="text-[15px] font-light text-[#5a6b5e] leading-[1.78] mb-6 max-w-[360px] mx-auto">
                                A confirmation has been sent to <strong className="font-medium text-[#1c2820]">{email}</strong>. Your therapist will review your assessment before the call.
                            </p>
                            {selectedSlot && (
                                <div className="rounded-[16px] p-5 mb-8 text-left" style={{ background: band.accentLight, border: `1px solid ${band.accentColor}22` }}>
                                    <p className="text-[11px] font-semibold tracking-[0.1em] uppercase mb-2" style={{ color: band.accentColor }}>Your session</p>
                                    <p className="text-[16px] font-[450] text-[#1c2820]">{formatConfirmDate(selectedSlot, TIMEZONE)}</p>
                                    <p className="text-[14px] text-[#5a6b5e] font-light">{formatTime(selectedSlot, TIMEZONE)} {from === "verify" ? " · 60 minutes · Session" : "· 15 minutes · Free"}</p>
                                </div>
                            )}
                            <div className="flex flex-col gap-3">
                                <Link href="/services" className="flex items-center justify-center gap-2 py-4 px-7 rounded-full text-white text-[14px] font-medium no-underline transition-all hover:-translate-y-0.5" style={{ background: `linear-gradient(135deg, ${band.accentColor}, ${band.accentColor}bb)`, boxShadow: `0 4px 18px ${band.accentColor}44` }}>
                                    Explore our services
                                </Link>
                                <Link href="/" className="flex items-center justify-center gap-2 py-4 px-7 bg-white border border-[#dce5df] text-[#3a4a3e] rounded-full no-underline text-[14px] font-[400]">Back to home</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </PageWrapper>
        );
    }

    // ── CONFIRM ──────────────────────────────────────────────────────────────
    if (step === "confirm" && selectedSlot) {
        return (
            <PageWrapper>
                <div className="min-h-screen bg-[#faf9f6] font-['DM_Sans',sans-serif]"><style>{globalStyles}</style>
                    <main className="pt-[88px] pb-24 px-6">
                        <div className="max-w-[480px] mx-auto fade-up">
                            <button type="button" onClick={() => { setStep("calendar"); setBookingError(null); }} className="inline-flex items-center gap-2 text-[13px] font-[450] text-[#7a8a7e] bg-transparent border-0 cursor-pointer p-0 hover:text-[#2d7a5a] transition-colors mb-8">
                                <ArrowLeft size={14} strokeWidth={2} /> Back to calendar
                            </button>
                            <h1 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(30px,5vw,42px)] font-light leading-[1.12] text-[#1c2820] mb-2">Confirm your booking</h1>
                            <p className="text-[14px] font-light text-[#5a6b5e] mb-7">{from === "verify" ? "60-minute therapy session" : "Free 15-minute intro call"}</p>

                            <div className="rounded-[16px] p-5 mb-6" style={{ background: band.accentLight, border: `1px solid ${band.accentColor}22` }}>
                                <p className="text-[11px] font-semibold tracking-[0.1em] uppercase mb-1.5" style={{ color: band.accentColor }}>Selected time</p>
                                <p className="text-[17px] font-[450] text-[#1c2820]">{formatConfirmDate(selectedSlot, TIMEZONE)}</p>
                                <p className="text-[14px] text-[#5a6b5e] font-light">{formatTime(selectedSlot, TIMEZONE)} · West Africa Time</p>
                            </div>

                            <div className="bg-white border border-[#e4e9e5] rounded-[20px] overflow-hidden shadow-[0_2px_16px_rgba(28,40,36,0.05)] mb-5">
                                <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${band.accentColor}, ${band.accentColor}88)` }} />
                                <div className="p-6 flex flex-col gap-4">
                                    {([
                                        { id: "bc-name", label: "Your Name", type: "text", value: name, onChange: setName, placeholder: "First name" },
                                        { id: "bc-email", label: "Email Address", type: "email", value: email, onChange: setEmail, placeholder: "you@example.com" },
                                    ] as const).map(({ id, label, type, value, onChange, placeholder }) => (
                                        <div key={id}>
                                            <label htmlFor={id} className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-[#4a6a56] mb-1.5">{label}</label>
                                            <input id={id} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="bc-input" />
                                        </div>
                                    ))}
                                    <div>
                                        <label htmlFor="bc-notes" className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-[#4a6a56] mb-1.5">
                                            Anything you'd like us to know? <span className="text-[#a0aba3] normal-case tracking-normal font-normal">(optional)</span>
                                        </label>
                                        <textarea id="bc-notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Brief context, questions, anything on your mind…" rows={3} className="bc-input resize-none" />
                                    </div>
                                </div>
                            </div>

                            {bookingError && <p className="text-[13px] text-[#c0392b] mb-4">⚠ {bookingError}</p>}

                            <button type="button" onClick={handleBook} disabled={submitting || !name.trim() || !email.trim()}
                                className="w-full py-[16px] px-7 rounded-full text-white text-[15px] font-medium flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 mb-3"
                                style={{ background: `linear-gradient(135deg, ${band.accentColor}, ${band.accentColor}bb)`, boxShadow: `0 4px 18px ${band.accentColor}44` }}>
                                {submitting && <Loader2 size={15} strokeWidth={2.5} className="animate-spin" />}
                                {submitting ? "Booking…" : "Confirm booking"}
                            </button>
                            <div className="flex items-center justify-center gap-1.5">
                                <Shield size={12} stroke="#a0aba3" strokeWidth={1.8} />
                                <p className="text-[12px] font-light text-[#a0aba3]">You'll receive a confirmation email immediately</p>
                            </div>
                        </div>
                    </main>
                </div>
            </PageWrapper>
        );
    }

    // ── CALENDAR ─────────────────────────────────────────────────────────────
    // Redesign goal: calendar is the page, not a sidebar beside a hero.
    // Single column at every width. Context shrinks to one compact strip.
    // "What to expect" is an opt-in disclosure below the action, closed by
    // default, instead of a wall of copy the person has to scroll past.
    return (
        <PageWrapper>
            <div className="min-h-screen bg-[#faf9f6] font-['DM_Sans',sans-serif]"><style>{globalStyles}</style>
                <main className="pt-[88px] pb-24 px-6">
                    <div className="max-w-[600px] mx-auto">
                        <Link href="/assessment/result" className="inline-flex items-center gap-2 text-[13px] font-[450] text-[#7a8a7e] no-underline hover:text-[#2d7a5a] transition-colors mb-5 fade-up">
                            <ArrowLeft size={14} strokeWidth={2} /> Back to your results
                        </Link>

                        {/* FIX: Dev banner when event type not configured */}
                        {!isConfigured && (
                            <div className="mb-5 rounded-[12px] px-4 py-3 bg-[#fff8e6] border border-[#f0c030] text-[13px] text-[#7a5a00] font-[450] fade-up">
                                ⚙️ <strong>Dev mode:</strong> Set <code className="bg-[#f5e8b0] px-1 rounded">CAL_EVENT_TYPE_ID</code> in <code className="bg-[#f5e8b0] px-1 rounded">page.tsx</code> to load real availability.
                                Find it at: app.cal.com → Event Types → Edit → URL contains <code className="bg-[#f5e8b0] px-1 rounded">/event-types/XXXXXXX</code>
                            </div>
                        )}

                        {/* Compact context strip — replaces the old hero + bullet list + pills.
                        One line of who/what/how-long, plus the pattern badge if we have one. */}
                        <div className="flex items-center gap-3 bg-white border border-[#e4e9e5] rounded-[16px] px-4 py-3 mb-5 fade-up">
                            <div className="w-10 h-10 rounded-full bg-[#f0f3f1] flex items-center justify-center text-[14px] font-[500] text-[#5a6b5e] flex-shrink-0">
                                {firstName ? firstName[0].toUpperCase() : "•"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[14.5px] font-[500] text-[#1c2820] truncate">
                                    {firstName ? `Book your free intro call, ${firstName}` : "Book your free intro call"}
                                </p>
                                <p className="text-[12px] text-[#7a8a7e] flex items-center gap-1.5 flex-wrap">
                                    <Clock size={11} strokeWidth={2} className="inline -mt-px" /> {from === "verify" ? " · 60 minutes · Session" : "· 15 minutes · Free"}
                                    <span className="text-[#cdd5cf]">·</span>
                                    <Video size={11} strokeWidth={2} className="inline -mt-px" /> Video or phone
                                </p>
                            </div>
                            {assessment && (
                                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 whitespace-nowrap" style={{ background: band.accentLight, color: band.accentColor }}>
                                    {band.label}
                                </span>
                            )}
                        </div>

                        {/* Calendar card */}
                        <div className="fade-up">
                            <div className="rounded-t-[20px] px-6 py-4 flex items-center gap-3 bg-[#1c2820]">
                                <div className="flex-1">
                                    <p className="text-[15px] text-white font-['Cormorant_Garamond',Georgia,serif]">Pick a time that works for you</p>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-[#4ade80] shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                            </div>

                            <div className="bg-white border border-[#e4e9e5] border-t-0 rounded-b-[20px] shadow-[0_4px_24px_rgba(28,40,36,0.06)]">

                                {/* Month nav */}
                                <div className="flex items-center justify-between px-6 pt-5 pb-3">
                                    <button type="button" onClick={prevMonth} disabled={isPastMonth} className="cal-nav-btn" aria-label="Previous month"><ChevronLeft size={16} strokeWidth={2} /></button>
                                    <span className="text-[15px] font-medium text-[#1c2820]">{MONTHS[viewMonth]} {viewYear}</span>
                                    <button type="button" onClick={nextMonth} className="cal-nav-btn" aria-label="Next month"><ChevronRight size={16} strokeWidth={2} /></button>
                                </div>

                                {/* Day labels */}
                                <div className="grid grid-cols-7 px-4 pb-1">
                                    {DAYS.map(d => <div key={d} className="text-center text-[11px] font-semibold text-[#8a9a8e] tracking-[0.06em] py-1">{d}</div>)}
                                </div>

                                {loadingSlots && (
                                    <div className="flex items-center justify-center py-8 gap-2 text-[13px] text-[#8a9a8e]">
                                        <Loader2 size={16} strokeWidth={2} className="animate-spin" style={{ color: band.accentColor }} />
                                        Loading availability…
                                    </div>
                                )}
                                {slotsError && <p className="text-center text-[13px] text-[#c0392b] py-4 px-6">{slotsError}</p>}

                                {/* Calendar grid */}
                                {!loadingSlots && !slotsError && (
                                    <div className="grid grid-cols-7 gap-y-1 px-4 pb-4">
                                        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                                        {Array.from({ length: daysInMonth }).map((_, i) => {
                                            const day = i + 1;
                                            const dk = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                                            const isPast = dk < todayKey;
                                            const hasSlots = (slotMap[dk]?.length ?? 0) > 0;
                                            const isSelected = selectedDate === dk;
                                            const isToday = dk === todayKey;

                                            // FIX: Past days disabled; future days always clickable (slots show empty state if not configured)
                                            const isDisabled = isPast || (!isConfigured ? false : !hasSlots);

                                            return (
                                                <button key={dk} type="button" disabled={isDisabled}
                                                    onClick={() => { setSelectedDate(dk); setSelectedSlot(null); }}
                                                    className="cal-day-btn"
                                                    style={{
                                                        background: isSelected ? band.accentColor : isToday ? `${band.accentColor}14` : "transparent",
                                                        // FIX: Proper contrast — past/unavailable use muted #b0bbb5, available use strong #1c2820
                                                        color: isSelected ? "white" : isDisabled ? "#c0ccc5" : "#1c2820",
                                                        cursor: isDisabled ? "default" : "pointer",
                                                        fontWeight: isToday ? 600 : 400,
                                                        borderRadius: 10,
                                                        position: "relative",
                                                        opacity: isDisabled && !isPast ? 0.45 : 1,
                                                    }}>
                                                    {day}
                                                    {/* Availability dot — only when real slots exist */}
                                                    {hasSlots && !isSelected && !isPast && (
                                                        <span className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[4px] h-[4px] rounded-full" style={{ background: band.accentColor }} />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Time slots */}
                                {selectedDate && !loadingSlots && (
                                    <div className="border-t border-[#e8ede9] px-5 py-5">
                                        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase mb-3" style={{ color: band.accentColor }}>
                                            Available times · {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long" })}
                                        </p>
                                        {/* FIX: Helpful state when not configured yet */}
                                        {!isConfigured ? (
                                            <p className="text-[13px] font-light text-[#8a9a8e] leading-[1.6]">
                                                Set your <code className="text-[12px] bg-[#f0f3f1] px-1 rounded">CAL_EVENT_TYPE_ID</code> to see real available times here.
                                            </p>
                                        ) : slotsForDate.length === 0 ? (
                                            <p className="text-[13px] font-light text-[#8a9a8e]">No times available on this day.</p>
                                        ) : (
                                            <div className="grid grid-cols-3 gap-2">
                                                {slotsForDate.map(slot => {
                                                    const isActive = selectedSlot === slot;
                                                    return (
                                                        <button key={slot} type="button" onClick={() => setSelectedSlot(slot)}
                                                            className="py-2.5 px-2 rounded-[10px] text-[13px] font-[450] border transition-all duration-150 hover:-translate-y-0.5"
                                                            style={{ background: isActive ? band.accentColor : "white", color: isActive ? "white" : "#3a4a3e", borderColor: isActive ? band.accentColor : "#dce5df", boxShadow: isActive ? `0 2px 10px ${band.accentColor}44` : "none" }}>
                                                            {formatTime(slot, TIMEZONE)}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {selectedSlot && (
                                    <div className="px-5 pb-6 pt-1">
                                        <button type="button" onClick={() => setStep("confirm")}
                                            className="w-full py-[14px] px-6 rounded-full text-white text-[14px] font-medium flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                                            style={{ background: `linear-gradient(135deg, ${band.accentColor}, ${band.accentColor}bb)`, boxShadow: `0 4px 18px ${band.accentColor}44` }}>
                                            Continue with {formatTime(selectedSlot, TIMEZONE)}
                                            <ChevronRight size={15} strokeWidth={2} />
                                        </button>
                                    </div>
                                )}

                                {/* What to expect — collapsed by default. Reassurance for anyone who
                                wants it, without making everyone scroll past it to book. */}
                                <button type="button" onClick={() => setExpectOpen(v => !v)}
                                    className="w-full flex items-center justify-between px-5 py-3 border-t border-[#e8ede9] bg-transparent border-x-0 border-b-0 cursor-pointer">
                                    <span className="text-[12.5px] font-[450] text-[#5a6b5e]">What happens on the call</span>
                                    <ChevronDown size={15} strokeWidth={2} className="text-[#8a9a8e] transition-transform" style={{ transform: expectOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
                                </button>
                                {expectOpen && (
                                    <div className="px-5 pb-4 -mt-1">
                                        <div className="flex flex-col gap-2.5">
                                            {[
                                                "Your therapist reviews your results before the call — no need to repeat yourself",
                                                "They'll name your pattern and explain what it means for you specifically",
                                                "You'll leave with a clear next step. No pressure to continue.",
                                            ].map(item => (
                                                <div key={item} className="flex items-start gap-2.5">
                                                    <CheckCircle size={14} fill={band.accentColor} stroke="white" strokeWidth={2.5} className="flex-shrink-0 mt-[2px]" />
                                                    <span className="text-[13px] font-light text-[#4a5a52] leading-[1.55]">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-center gap-1.5 pb-5 pt-2 border-t border-[#e8ede9]">
                                    <Shield size={11} stroke="#c0ccc5" strokeWidth={1.8} />
                                    <p className="text-[11px] font-light text-[#c0ccc5]">Your details are never shared with third parties</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </PageWrapper>
    );
}

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,450;9..40,500;9..40,600&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  body { font-family: 'DM Sans', -apple-system, sans-serif; background: #faf9f6; -webkit-font-smoothing: antialiased; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  .fade-up { animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .animate-spin { animation: spin 0.75s linear infinite; }
  .cal-nav-btn { width:34px;height:34px;border-radius:50%;border:1.5px solid #e4e9e5;background:white;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#4a5a52;transition:all 0.15s; }
  .cal-nav-btn:hover:not(:disabled) { border-color:#2d7a5a;color:#2d7a5a; }
  .cal-nav-btn:disabled { opacity:0.3;cursor:default; }
  .cal-day-btn { aspect-ratio:1;width:100%;display:flex;align-items:center;justify-content:center;font-size:13px;border:none;transition:all 0.15s cubic-bezier(0.22,1,0.36,1);font-family:'DM Sans',sans-serif; }
  .cal-day-btn:hover:not(:disabled) { transform:scale(1.08); }
  .bc-input { width:100%;padding:13px 15px;border:1.5px solid #d8dbd5;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:15px;color:#1c2820;background:#fdfcfa;transition:border-color 0.15s,box-shadow 0.15s;outline:none; }
  .bc-input:focus { border-color:#2d7a5a;box-shadow:0 0 0 4px rgba(45,122,90,0.1);background:white; }
  .bc-input::placeholder { color:#b0bab4; }
`;