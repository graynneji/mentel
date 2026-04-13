"use client";

// app/hr/settings/page.tsx
// HR programme settings — view plan details, adjust focus areas,
// toggle anonymous mode, contact Mentel support.
// HR cannot change seats or session cap (admin only) — those show as read-only with a request button.

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Shield, CheckCircle, Loader2, Mail,
    Calendar, Users, RefreshCw, Lock, Info,
    ChevronRight, LogOut,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface CompanySettings {
    id: string;
    name: string;
    plan: string;
    planSeats: number;
    sessionCap: number;
    planRenewAt: string | null;
    billingStatus: string;
    status: string;
    hrEmail: string;
    contactName: string;
    contactEmail: string;
    focusAreas: string[];
    allowAnonymous: boolean;
}

const ALL_FOCUS_AREAS = [
    "Stress & Anxiety",
    "Depression & Low Mood",
    "Work Burnout",
    "Relationships & Marriage",
    "Sleep Quality",
    "Self-esteem & Identity",
];

const PLAN_LABELS: Record<string, string> = {
    starter: "Starter", growth: "Growth", enterprise: "Enterprise", trial: "Free Trial",
};

const PLAN_COLORS: Record<string, string> = {
    starter: "#8b6e3d", growth: "#3d8b8b", enterprise: "#7b6fa9", trial: "#8da898",
};

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({ title, description, children }: {
    title: string; description?: string; children: React.ReactNode;
}) {
    return (
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#e4eee8" }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: "#f0f7f3" }}>
                <div className="text-[14px] font-semibold" style={{ color: "#1c3a3a" }}>{title}</div>
                {description && (
                    <div className="text-[11px] mt-0.5" style={{ color: "#7a9088" }}>{description}</div>
                )}
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}

// ── Read-only field ───────────────────────────────────────────────────────────

function ReadOnlyField({ label, value, locked }: { label: string; value: string; locked?: boolean }) {
    return (
        <div className="flex items-center justify-between py-2.5 border-b last:border-0"
            style={{ borderColor: "#f0f7f3" }}>
            <div>
                <div className="text-[12px] font-medium" style={{ color: "#1c3a3a" }}>{label}</div>
            </div>
            <div className="flex items-center gap-1.5">
                {locked && <Lock size={11} style={{ color: "#b0c8bc" }} />}
                <span className="text-[12px] font-semibold" style={{ color: "#7a9088" }}>{value}</span>
            </div>
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function HRSettingsPage() {
    const router = useRouter();
    const [settings, setSettings] = useState<CompanySettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    // Editable local state
    const [focusAreas, setFocusAreas] = useState<string[]>([]);
    const [allowAnonymous, setAllowAnonymous] = useState(true);
    const [requestSent, setRequestSent] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    useEffect(() => {
        fetch("/api/hr/settings")
            .then((r) => {
                if (r.status === 401) { router.push("/hr/access"); return null; }
                return r.json();
            })
            .then((j) => {
                if (j?.success) {
                    setSettings(j.settings);
                    setFocusAreas(j.settings.focusAreas ?? []);
                    setAllowAnonymous(j.settings.allowAnonymous ?? true);
                }
            })
            .finally(() => setLoading(false));
    }, [router]);

    const handleSave = async () => {
        setSaving(true);
        setError("");
        setSaved(false);
        try {
            const res = await fetch("/api/hr/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ focusAreas, allowAnonymous }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                setError(data.error ?? "Failed to save settings.");
            } else {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch {
            setError("Connection error. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        setLoggingOut(true);
        await fetch("/api/hr/auth", { method: "DELETE" });
        router.push("/hr/access");
    };

    const handleRequestChange = () => {
        setRequestSent(true);
        // In production: POST to /api/hr/support with the request details
        setTimeout(() => setRequestSent(false), 4000);
    };

    if (loading) {
        return (
            <div className="flex flex-col gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse rounded-2xl h-40 bg-[#e8f0ec]" />
                ))}
            </div>
        );
    }

    if (!settings) {
        return (
            <div className="text-center py-20">
                <p style={{ color: "#7a9088" }}>Failed to load settings.</p>
            </div>
        );
    }

    const planRenew = settings.planRenewAt
        ? new Date(settings.planRenewAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
        : "—";

    return (
        <div className="flex flex-col gap-4 sm:gap-5 max-w-2xl pb-10">
            {/* Header */}
            <div>
                <h1 className="text-[18px] sm:text-[20px] font-bold" style={{ color: "#1c3a3a" }}>
                    Programme Settings
                </h1>
                <p className="text-[12px] mt-0.5" style={{ color: "#7a9088" }}>
                    {settings.name} · {PLAN_LABELS[settings.plan] ?? settings.plan} plan
                </p>
            </div>

            {/* Plan overview */}
            <Section title="Your Plan" description="Contact Mentel to upgrade or modify seats and sessions.">
                <div>
                    <div className="flex items-center gap-2.5 mb-4">
                        <span
                            className="px-3 py-1 rounded-full text-[12px] font-semibold"
                            style={{
                                background: `${PLAN_COLORS[settings.plan] ?? "#8da898"}18`,
                                color: PLAN_COLORS[settings.plan] ?? "#8da898",
                            }}
                        >
                            {PLAN_LABELS[settings.plan] ?? settings.plan}
                        </span>
                        <span
                            className="px-3 py-1 rounded-full text-[12px] font-semibold capitalize"
                            style={{
                                background: settings.billingStatus === "active" ? "rgba(78,140,106,0.1)" : "rgba(185,74,79,0.1)",
                                color: settings.billingStatus === "active" ? "#4e8c6a" : "#b94a4f",
                            }}
                        >
                            {settings.billingStatus}
                        </span>
                    </div>
                    <ReadOnlyField label="Maximum employee seats" value={`${settings.planSeats} employees`} locked />
                    <ReadOnlyField label="Sessions per employee / year" value={`${settings.sessionCap} sessions`} locked />
                    <ReadOnlyField label="Plan renewal date" value={planRenew} />
                    <ReadOnlyField label="HR portal email" value={settings.hrEmail} />
                </div>
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                    <button
                        onClick={handleRequestChange}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-medium border transition-all"
                        style={{ borderColor: "#ddeae2", color: requestSent ? "#4e8c6a" : "#7a9088", background: "white" }}
                    >
                        {requestSent ? <CheckCircle size={13} /> : <Mail size={13} />}
                        {requestSent ? "Request sent to Mentel" : "Request seat or session increase"}
                    </button>
                    <a
                        href="mailto:eap@mentel.com"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-medium border"
                        style={{ borderColor: "#ddeae2", color: "#7a9088", background: "white" }}
                    >
                        <Mail size={13} />
                        eap@mentel.com
                    </a>
                </div>
            </Section>

            {/* Focus areas */}
            <Section
                title="Assessment Focus Areas"
                description="Select which wellbeing domains are included in your employees' assessments. Leave all selected to use the full 8-domain assessment."
            >
                <div className="flex flex-wrap gap-2 mb-4">
                    {ALL_FOCUS_AREAS.map((area) => {
                        const active = focusAreas.length === 0 || focusAreas.includes(area);
                        return (
                            <button
                                key={area}
                                type="button"
                                onClick={() => {
                                    setFocusAreas((prev) => {
                                        // If currently all selected (empty = all), switching one off means
                                        // we explicitly select all others
                                        const allSelected = prev.length === 0;
                                        if (allSelected) {
                                            return ALL_FOCUS_AREAS.filter((a) => a !== area);
                                        }
                                        if (prev.includes(area)) {
                                            const next = prev.filter((a) => a !== area);
                                            return next.length === 0 ? [] : next;
                                        }
                                        const next = [...prev, area];
                                        return next.length === ALL_FOCUS_AREAS.length ? [] : next;
                                    });
                                }}
                                className="px-3 py-1.5 rounded-full text-[12px] border transition-all"
                                style={{
                                    background: active ? "rgba(61,139,139,0.08)" : "white",
                                    borderColor: active ? "#3d8b8b" : "#ddeae2",
                                    color: active ? "#3d8b8b" : "#b0c8bc",
                                }}
                            >
                                {active ? <CheckCircle size={11} style={{ display: "inline", marginRight: 4 }} /> : null}
                                {area}
                            </button>
                        );
                    })}
                </div>
                <div
                    className="flex items-start gap-2 text-[11px] p-3 rounded-xl"
                    style={{ background: "#f7faf8", color: "#7a9088" }}
                >
                    <Info size={12} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>
                        Changes apply to new assessments only — employees who have already completed an assessment
                        are not affected. Deselecting an area removes those questions for future assessments.
                    </span>
                </div>
            </Section>

            {/* Anonymous enrolment */}
            <Section
                title="Anonymous Enrolment"
                description="Control whether employees can take the assessment without sharing their name or email."
            >
                <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setAllowAnonymous((a) => !a)}
                >
                    <div className="flex-1 pr-4">
                        <div className="text-[13px] font-semibold mb-0.5" style={{ color: "#1c3a3a" }}>
                            Allow anonymous enrolment
                        </div>
                        <div className="text-[11px] font-light" style={{ color: "#7a9088" }}>
                            When enabled, employees can complete the assessment without sharing their name or email.
                            This typically increases participation rates significantly.
                        </div>
                    </div>
                    <div
                        className="w-11 h-6 rounded-full transition-all duration-200 relative flex-shrink-0"
                        style={{ background: allowAnonymous ? "var(--sage-dark, #4e8c6a)" : "#ddeae2" }}
                    >
                        <div
                            className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
                            style={{ left: allowAnonymous ? "23px" : "2px" }}
                        />
                    </div>
                </div>
                {!allowAnonymous && (
                    <div
                        className="mt-3 flex items-start gap-2 text-[11px] p-3 rounded-xl"
                        style={{ background: "rgba(139,110,61,0.05)", color: "#8b6e3d", border: "1px solid rgba(139,110,61,0.15)" }}
                    >
                        <Info size={12} style={{ flexShrink: 0, marginTop: 1 }} />
                        <span>
                            Requiring names can reduce participation. Anonymous data is still fully useful for your
                            HR reports — only the contact information for therapist matching is affected.
                        </span>
                    </div>
                )}
            </Section>

            {/* Save button */}
            <div className="flex items-center gap-3">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-[13px] font-semibold text-white transition-all disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, #4e8c6a, #3d8b8b)" }}
                >
                    {saving ? (
                        <><Loader2 size={14} className="animate-spin" /> Saving…</>
                    ) : saved ? (
                        <><CheckCircle size={14} /> Saved</>
                    ) : (
                        "Save Settings"
                    )}
                </button>
                {error && <p className="text-[12px]" style={{ color: "#b94a4f" }}>{error}</p>}
                {saved && !saving && (
                    <p className="text-[12px]" style={{ color: "#4e8c6a" }}>Settings updated successfully.</p>
                )}
            </div>

            {/* Privacy & compliance */}
            <Section title="Privacy & Compliance">
                <div className="space-y-3">
                    {[
                        {
                            icon: Shield,
                            title: "NDPR compliant",
                            desc: "All data is processed in accordance with the Nigerian Data Protection Regulation.",
                        },
                        {
                            icon: Lock,
                            title: "Individual data never disclosed",
                            desc: "Your HR portal only shows anonymised aggregate data. Individual employee answers, therapy notes, and personal details are never visible to any employer representative.",
                        },
                        {
                            icon: Users,
                            title: "Minimum cohort protection",
                            desc: "Data for sub-groups of fewer than 5 employees is suppressed in all reports to prevent re-identification.",
                        },
                    ].map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="flex items-start gap-3">
                            <div
                                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ background: "rgba(78,140,106,0.1)" }}
                            >
                                <Icon size={13} style={{ color: "#4e8c6a" }} />
                            </div>
                            <div>
                                <div className="text-[12px] font-semibold mb-0.5" style={{ color: "#1c3a3a" }}>{title}</div>
                                <div className="text-[11px] font-light leading-relaxed" style={{ color: "#7a9088" }}>{desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 pt-4 border-t" style={{ borderColor: "#f0f7f3" }}>
                    <a
                        href="mailto:eap@mentel.com?subject=Data%20Processing%20Agreement%20Request"
                        className="text-[12px] flex items-center gap-1.5 w-fit"
                        style={{ color: "#4e8c6a" }}
                    >
                        Request a copy of our Data Processing Agreement
                        <ChevronRight size={13} />
                    </a>
                </div>
            </Section>

            {/* Sign out */}
            <div className="flex justify-end pt-2">
                <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] border transition-all"
                    style={{ borderColor: "#f5d5d5", color: "#b94a4f", background: "white" }}
                >
                    {loggingOut ? <Loader2 size={13} className="animate-spin" /> : <LogOut size={13} />}
                    Sign out of HR portal
                </button>
            </div>
        </div>
    );
}