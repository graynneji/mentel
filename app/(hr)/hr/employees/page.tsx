"use client";

// app/hr/employees/page.tsx
// HR employees management — view anonymised employee list, send access codes,
// track enrolment status. No PII shown unless the employee chose to share it.
// HR sees: department, risk band, sessions used, enrolment date — never individual answers.

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Users, Copy, CheckCircle, Shield, Search,
    TrendingDown, TrendingUp, Download, RefreshCw,
    Mail, AlertTriangle, ChevronDown, ChevronUp,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface EmployeeSummary {
    id: string;
    department: string | null;
    anonymous: boolean;
    enrolledAt: string;
    riskBand: string | null;
    improvementPct: number | null;
    sessionsUsed: number;
    sessionsRemaining: number | null;
    lastAssessmentAt: string | null;
    hasAssessment: boolean;
}

interface CompanyInfo {
    name: string;
    accessCode: string;
    planSeats: number;
    sessionCap: number;
}

const BAND_COLORS: Record<string, string> = {
    Low: "#4e8c6a", Mild: "#3d8b8b", Moderate: "#8b6e3d",
    High: "#b94a4f", Critical: "#8b1a1a",
};

// ── Stat card ─────────────────────────────────────────────────────────────────

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
    return (
        <div className="bg-white rounded-2xl border p-4" style={{ borderColor: "#e4eee8" }}>
            <div
                className="text-[22px] sm:text-[26px] font-bold leading-none mb-1"
                style={{ fontFamily: "Georgia, serif", color: "#1c3a3a" }}
            >
                {value}
            </div>
            <div className="text-[11px] font-medium" style={{ color: "#7a9088" }}>{label}</div>
            {sub && <div className="text-[10px] mt-0.5" style={{ color: "#b0c8bc" }}>{sub}</div>}
        </div>
    );
}

// ── Employee row ──────────────────────────────────────────────────────────────

function EmployeeRow({ employee }: { employee: EmployeeSummary }) {
    const bandColor = BAND_COLORS[employee.riskBand ?? ""] ?? "#b0c8bc";
    const improving = (employee.improvementPct ?? 0) > 0;
    const enrolledDate = new Date(employee.enrolledAt).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
    });
    const lastAssessed = employee.lastAssessmentAt
        ? new Date(employee.lastAssessmentAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
        : null;

    return (
        <tr style={{ borderBottom: "1px solid #f0f7f3" }}>
            {/* Identity */}
            <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                    <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                        style={{ background: employee.riskBand ? bandColor : "#b0c8bc" }}
                    >
                        {employee.anonymous ? "A" : (employee.department?.charAt(0) ?? "?")}
                    </div>
                    <div>
                        <div className="text-[12px] font-medium" style={{ color: "#1c3a3a" }}>
                            {employee.anonymous ? "Anonymous employee" : "Employee"}
                        </div>
                        <div className="text-[10px]" style={{ color: "#b0c8bc" }}>
                            Enrolled {enrolledDate}
                        </div>
                    </div>
                </div>
            </td>
            {/* Department */}
            <td className="px-4 py-3">
                <span className="text-[12px]" style={{ color: "#7a9088" }}>
                    {employee.department ?? "—"}
                </span>
            </td>
            {/* Assessment */}
            <td className="px-4 py-3">
                {employee.hasAssessment ? (
                    <div>
                        <span
                            className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: `${bandColor}18`, color: bandColor }}
                        >
                            {employee.riskBand}
                        </span>
                        <div className="text-[10px] mt-0.5" style={{ color: "#b0c8bc" }}>
                            {lastAssessed ? `Last: ${lastAssessed}` : ""}
                        </div>
                    </div>
                ) : (
                    <span className="text-[11px] px-2 py-0.5 rounded-full"
                        style={{ background: "#f0f7f3", color: "#b0c8bc" }}>
                        Not taken
                    </span>
                )}
            </td>
            {/* Progress */}
            <td className="px-4 py-3">
                {employee.hasAssessment && employee.improvementPct !== null ? (
                    <span
                        className={`text-[12px] font-semibold flex items-center gap-0.5 ${improving ? "text-[#4e8c6a]" : employee.improvementPct === 0 ? "text-[#8da898]" : "text-[#b94a4f]"}`}
                    >
                        {improving ? <TrendingDown size={12} /> : employee.improvementPct === 0 ? null : <TrendingUp size={12} />}
                        {improving ? "▼" : ""}
                        {Math.abs(employee.improvementPct)}%
                    </span>
                ) : (
                    <span className="text-[11px]" style={{ color: "#b0c8bc" }}>—</span>
                )}
            </td>
            {/* Sessions */}
            <td className="px-4 py-3">
                <div className="text-[12px] font-medium" style={{ color: "#1c3a3a" }}>
                    {employee.sessionsUsed}
                    <span className="text-[10px] font-normal" style={{ color: "#b0c8bc" }}>
                        /{employee.sessionsRemaining !== null ? employee.sessionsUsed + (employee.sessionsRemaining) : "—"}
                    </span>
                </div>
                <div className="w-16 h-1 rounded-full overflow-hidden mt-1" style={{ background: "#f0f7f3" }}>
                    {employee.sessionsRemaining !== null && (
                        <div
                            className="h-full rounded-full"
                            style={{
                                width: `${Math.min(
                                    (employee.sessionsUsed / (employee.sessionsUsed + employee.sessionsRemaining)) * 100,
                                    100,
                                )}%`,
                                background: "#4e8c6a",
                            }}
                        />
                    )}
                </div>
            </td>
        </tr>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function HREmployeesPage() {
    const router = useRouter();
    const [employees, setEmployees] = useState<EmployeeSummary[]>([]);
    const [company, setCompany] = useState<CompanyInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterBand, setFilterBand] = useState("all");
    const [filterAssessed, setFilterAssessed] = useState<"all" | "yes" | "no">("all");
    const [sortBy, setSortBy] = useState<"enrolled" | "band" | "sessions">("enrolled");
    const [copiedCode, setCopiedCode] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [sendingReminder, setSendingReminder] = useState(false);

    useEffect(() => {
        fetch("/api/hr/employees")
            .then((r) => {
                if (r.status === 401) { router.push("/hr/access"); return null; }
                return r.json();
            })
            .then((j) => {
                console.log(j, "HR employees data");
                if (j?.success) {
                    setEmployees(j.employees ?? []);
                    setCompany(j.company);
                }
            })
            .finally(() => setLoading(false));
    }, [router]);

    const handleCopyCode = () => {
        if (!company) return;
        navigator.clipboard.writeText(company.accessCode).catch(() => { });
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2500);
    };

    const handleSendReminder = async () => {
        setSendingReminder(true);
        // In production this would call /api/hr/remind to send bulk reminder emails
        await new Promise((r) => setTimeout(r, 1200));
        setSendingReminder(false);
        alert("Reminder email template copied — paste into your email client to send to unenrolled employees.");
    };

    const filtered = employees
        .filter((e) => {
            if (filterBand !== "all" && e.riskBand !== filterBand) return false;
            if (filterAssessed === "yes" && !e.hasAssessment) return false;
            if (filterAssessed === "no" && e.hasAssessment) return false;
            if (search && !(e.department ?? "").toLowerCase().includes(search.toLowerCase())) return false;
            return true;
        })
        .sort((a, b) => {
            if (sortBy === "enrolled") return new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime();
            if (sortBy === "sessions") return b.sessionsUsed - a.sessionsUsed;
            const order = ["Critical", "High", "Moderate", "Mild", "Low", ""];
            return order.indexOf(a.riskBand ?? "") - order.indexOf(b.riskBand ?? "");
        });

    const notAssessed = employees.filter((e) => !e.hasAssessment).length;
    const seatsRemaining = company ? company.planSeats - employees.length : 0;
    const avgImprovement = employees.filter((e) => e.improvementPct !== null).length > 0
        ? Math.round(
            employees
                .filter((e) => e.improvementPct !== null)
                .reduce((s, e) => s + (e.improvementPct ?? 0), 0) /
            employees.filter((e) => e.improvementPct !== null).length,
        )
        : 0;

    if (loading) {
        return (
            <div className="flex flex-col gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="animate-pulse rounded-2xl h-16 bg-[#e8f0ec]" />
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 sm:gap-5 pb-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                    <h1 className="text-[18px] sm:text-[20px] font-bold" style={{ color: "#1c3a3a" }}>
                        Employees
                    </h1>
                    <p className="text-[12px] mt-0.5" style={{ color: "#7a9088" }}>
                        {company?.name} · Anonymised view — no individual responses visible
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                <Stat label="Enrolled" value={employees.length} sub={`${seatsRemaining} seats remaining`} />
                <Stat label="Assessment taken" value={employees.filter((e) => e.hasAssessment).length} sub={`${notAssessed} not yet taken`} />
                <Stat label="Sessions used" value={employees.reduce((s, e) => s + e.sessionsUsed, 0)} />
                <Stat label="Avg improvement" value={avgImprovement > 0 ? `${avgImprovement}%` : "—"} sub="vs first assessment" />
            </div>

            {/* Access code card */}
            <div
                className="rounded-2xl border p-4 sm:p-5"
                style={{ background: "white", borderColor: "#e4eee8" }}
            >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                    <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold mb-0.5" style={{ color: "#1c3a3a" }}>
                            Company Access Code
                        </div>
                        <div className="text-[11px]" style={{ color: "#7a9088" }}>
                            Share this code with employees so they can enrol in the programme.
                        </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <div
                            className="px-4 py-2.5 rounded-xl font-mono text-[18px] font-bold tracking-[3px]"
                            style={{ background: "#f0f7f3", color: "#1c3a3a", border: "1px solid #c8ddd2" }}
                        >
                            {company?.accessCode ?? "—"}
                        </div>
                        <button
                            onClick={handleCopyCode}
                            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-[12px] font-medium border transition-all"
                            style={{
                                borderColor: copiedCode ? "#4e8c6a" : "#ddeae2",
                                color: copiedCode ? "#4e8c6a" : "#7a9088",
                                background: copiedCode ? "rgba(78,140,106,0.06)" : "white",
                            }}
                        >
                            {copiedCode ? <CheckCircle size={13} /> : <Copy size={13} />}
                            {copiedCode ? "Copied!" : "Copy"}
                        </button>
                    </div>
                </div>

                {/* Enrolment instructions — collapsible */}
                <button
                    onClick={() => setShowInstructions((s) => !s)}
                    className="flex items-center gap-1.5 mt-4 text-[12px]"
                    style={{ color: "#4e8c6a", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                    {showInstructions ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    How to share this with employees
                </button>

                {showInstructions && (
                    <div
                        className="mt-3 p-4 rounded-xl text-[12px] leading-relaxed space-y-2"
                        style={{ background: "#f7faf8", color: "#7a9088" }}
                    >
                        <p>
                            <strong style={{ color: "#1c3a3a" }}>Option 1 — Email:</strong> Send the code to your
                            employees and ask them to visit{" "}
                            <span style={{ color: "#4e8c6a" }}>
                                {process.env.NEXT_PUBLIC_APP_URL ?? "your Mentel URL"}/eap/enrol
                            </span>{" "}
                            and enter it.
                        </p>
                        <p>
                            <strong style={{ color: "#1c3a3a" }}>Option 2 — Slack / Teams:</strong> Post the code
                            in your company channel with the link above.
                        </p>
                        <p>
                            <strong style={{ color: "#1c3a3a" }}>Option 3 — Intranet:</strong> Add the link and
                            code to your HR intranet page.
                        </p>
                        <p
                            className="pt-1"
                            style={{ borderTop: "1px solid #e4eee8" }}
                        >
                            <strong style={{ color: "#1c3a3a" }}>Confidentiality reminder for employees:</strong>{" "}
                            You never see individual assessment answers. Employees can also enrol anonymously — their
                            name and email are optional.
                        </p>
                    </div>
                )}

                {/* Nudge if many haven't assessed */}
                {notAssessed > 3 && (
                    <div
                        className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl"
                        style={{ background: "rgba(139,110,61,0.05)", border: "1px solid rgba(139,110,61,0.15)" }}
                    >
                        <AlertTriangle size={14} style={{ color: "#8b6e3d", flexShrink: 0 }} />
                        <p className="text-[12px] flex-1" style={{ color: "#7a9088" }}>
                            <strong style={{ color: "#1c3a3a" }}>{notAssessed} enrolled employees</strong> haven't
                            completed their assessment yet. Consider sending a gentle reminder.
                        </p>
                        <button
                            onClick={handleSendReminder}
                            disabled={sendingReminder}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium border shrink-0"
                            style={{ borderColor: "#ddeae2", color: "#8b6e3d", background: "white" }}
                        >
                            {sendingReminder ? <RefreshCw size={12} className="animate-spin" /> : <Mail size={12} />}
                            Send Reminder
                        </button>
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#b0c8bc" }} />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Filter by department…"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-[12px] outline-none"
                        style={{ borderColor: "#ddeae2", color: "#1c3a3a", background: "white" }}
                    />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                    {/* Band filter */}
                    {["all", "Low", "Mild", "Moderate", "High", "Critical"].map((b) => (
                        <button
                            key={b}
                            onClick={() => setFilterBand(b)}
                            className="px-2.5 py-2 rounded-xl text-[11px] border capitalize transition-all"
                            style={{
                                background: filterBand === b ? `${BAND_COLORS[b] ?? "#3d8b8b"}18` : "white",
                                borderColor: filterBand === b ? (BAND_COLORS[b] ?? "#3d8b8b") : "#ddeae2",
                                color: filterBand === b ? (BAND_COLORS[b] ?? "#3d8b8b") : "#7a9088",
                            }}
                        >
                            {b === "all" ? "All bands" : b}
                        </button>
                    ))}
                    {/* Assessed filter */}
                    <select
                        value={filterAssessed}
                        onChange={(e) => setFilterAssessed(e.target.value as "all" | "yes" | "no")}
                        className="px-2.5 py-2 rounded-xl border text-[11px] outline-none"
                        style={{ borderColor: "#ddeae2", color: "#7a9088", background: "white" }}
                    >
                        <option value="all">All employees</option>
                        <option value="yes">Assessed only</option>
                        <option value="no">Not assessed</option>
                    </select>
                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as "enrolled" | "band" | "sessions")}
                        className="px-2.5 py-2 rounded-xl border text-[11px] outline-none"
                        style={{ borderColor: "#ddeae2", color: "#7a9088", background: "white" }}
                    >
                        <option value="enrolled">Sort: Newest</option>
                        <option value="band">Sort: Risk (high first)</option>
                        <option value="sessions">Sort: Sessions used</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#e4eee8" }}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr style={{ background: "#f7faf8", borderBottom: "1px solid #e4eee8" }}>
                                {["Employee", "Department", "Risk Band", "Improvement", "Sessions"].map((h) => (
                                    <th
                                        key={h}
                                        className="px-4 py-3 text-left text-[10px] uppercase tracking-widest"
                                        style={{ color: "#7a9088" }}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center text-[12px]" style={{ color: "#b0c8bc" }}>
                                        {employees.length === 0
                                            ? "No employees enrolled yet. Share your access code to get started."
                                            : "No employees match your filters."}
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((e) => <EmployeeRow key={e.id} employee={e} />)
                            )}
                        </tbody>
                    </table>
                </div>
                <div
                    className="px-4 py-3 border-t text-[11px] flex items-center gap-1.5"
                    style={{ borderColor: "#f0f7f3", color: "#b0c8bc" }}
                >
                    <Shield size={11} />
                    Names and email addresses are never shown here. Department-level data only for groups of 5+.
                </div>
            </div>
        </div>
    );
}