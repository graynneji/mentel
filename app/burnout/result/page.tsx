"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, Lock, AlertTriangle, Flame, Star, Phone } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface BurnoutBand {
    band: string;
    label: string;
    gradient: string;
    accentColor: string;
    accentLight: string;
    hook: string;
    cliffhanger: string;
    tip: string;
    tipLabel: string;
    lockedLabel: string;
    lockedTeaser: string;
    urgency: boolean;
}

// ── Therapist profiles — one per band ─────────────────────────────────────────

interface TherapistProfile {
    name: string;
    title: string;
    experience: string;
    specialisms: string[];
    note: string;
    initials: string;
    avatarGradient: string;
}

function getTherapist(band: string): TherapistProfile {
    const profiles: Record<string, TherapistProfile> = {
        "Low Burnout Risk": {
            name: "Dr. Amara Osei",
            title: "Clinical Psychologist",
            experience: "9 years",
            specialisms: ["Resilience building", "Preventive mental wellness", "Career transitions"],
            note: "Amara specialises in helping high-functioning individuals build sustainable mental habits before stress accumulates.",
            initials: "AO",
            avatarGradient: "linear-gradient(135deg, #3d8b8b, #6fb8b8)",
        },
        "Mild Burnout Signs": {
            name: "Funke Adeyemi",
            title: "Counselling Psychologist",
            experience: "7 years",
            specialisms: ["Early burnout intervention", "Workplace stress", "Work-life balance"],
            note: "Funke works primarily with professionals in the early stages of burnout, helping them course-correct before it compounds.",
            initials: "FA",
            avatarGradient: "linear-gradient(135deg, #4e7a5e, #7ba98b)",
        },
        "Moderate Burnout": {
            name: "Emeka Nwachukwu",
            title: "Psychotherapist",
            experience: "11 years",
            specialisms: ["Burnout recovery", "Emotional depletion", "Occupational stress"],
            note: "Emeka has extensive experience helping clients in active burnout rebuild capacity and re-engage with their lives.",
            initials: "EN",
            avatarGradient: "linear-gradient(135deg, #5a6fa8, #8fa4d6)",
        },
        "High Burnout Risk": {
            name: "Dr. Chioma Eze",
            title: "Clinical Psychologist & Burnout Specialist",
            experience: "13 years",
            specialisms: ["Severe burnout", "Trauma-informed recovery", "Executive burnout"],
            note: "Chioma works with clients experiencing significant burnout, guiding structured, evidence-based recovery at their own pace.",
            initials: "CE",
            avatarGradient: "linear-gradient(135deg, #a97b3d, #d4b87b)",
        },
        "Severe Burnout": {
            name: "Dr. Chioma Eze",
            title: "Clinical Psychologist & Burnout Specialist",
            experience: "13 years",
            specialisms: ["Severe burnout", "Crisis recovery", "Trauma-informed care"],
            note: "Chioma has been flagged to review your profile. She specialises in severe burnout cases and offers same-week availability.",
            initials: "CE",
            avatarGradient: "linear-gradient(135deg, #a97b3d, #d4b87b)",
        },
    };
    return profiles[band] ?? profiles["Moderate Burnout"]!;
}

// ── Band logic ─────────────────────────────────────────────────────────────────

function getBurnoutBand(score: number): BurnoutBand {
    if (score <= 5) {
        return {
            band: "Low Burnout Risk",
            label: "You're managing well",
            gradient: "linear-gradient(135deg, #1a3a2e 0%, #234d3d 100%)",
            accentColor: "#2d7a5a",
            accentLight: "rgba(45,122,90,0.06)",
            hook: "Your stress levels appear manageable — but staying ahead of burnout is easier than recovering from it.",
            cliffhanger: "Your responses show one subtle pattern that high-functioning people often overlook. It rarely surfaces as a problem until cumulative pressure tips the scale. Knowing it now is the advantage.",
            tip: "Schedule a genuine 'off' period each week — no productivity, no catch-up. People with your profile who protect even 90 minutes of unstructured time weekly show measurably lower burnout markers over three months.",
            tipLabel: "One thing worth doing this week",
            lockedLabel: "Your Personal Burnout Prevention Blueprint",
            lockedTeaser: "We've identified the one low-grade pattern in your routine that slowly erodes resilience in people who score well on paper. Your full profile names it — and shows the 3-step protection sequence.",
            urgency: false,
        };
    }
    if (score <= 10) {
        return {
            band: "Mild Burnout Signs",
            label: "Early signals worth paying attention to",
            gradient: "linear-gradient(135deg, #1e3520 0%, #2c4a2e 100%)",
            accentColor: "#3d7a45",
            accentLight: "rgba(61,122,69,0.06)",
            hook: "You're not burned out yet — but your responses carry signals that typically precede it.",
            cliffhanger: "Mild burnout signs are easy to rationalise away as 'just a busy period.' The risk is that they compound quietly. There's one specific pattern in your answers that, if left unaddressed, tends to accelerate into the next stage faster than people expect.",
            tip: "Try a daily 10-minute 'energy audit': at the end of each day, note what drained you and what gave energy. Within two weeks, a clear pattern emerges — and that pattern is what determines whether this stays mild or compounds.",
            tipLabel: "One thing worth doing this week",
            lockedLabel: "Your Early Warning Pattern + Prevention Protocol",
            lockedTeaser: "We've mapped the specific compounding pattern in your responses — the one that separates people who stay mild from those who tip into burnout within 90 days. Your full profile names it and gives you the 3-step sequence to interrupt it.",
            urgency: false,
        };
    }
    if (score <= 15) {
        return {
            band: "Moderate Burnout",
            label: "Clear burnout indicators present",
            gradient: "linear-gradient(135deg, #1c2e1a 0%, #2a4228 100%)",
            accentColor: "#4a8c3f",
            accentLight: "rgba(74,140,63,0.06)",
            hook: "Your results suggest you're in active moderate burnout — not approaching it, already experiencing it.",
            cliffhanger: "There's a specific depletion cycle in your responses that doesn't respond to 'just taking a break.' Rest alone won't reset it. Understanding the actual driver is what changes the trajectory before it becomes harder to recover from.",
            tip: "Name the one responsibility you can legitimately reduce or delegate this week — not indefinitely, just this week. People in moderate burnout who take one concrete action to reduce load begin recovering measurably faster than those who wait for a 'right time'.",
            tipLabel: "One action for this week",
            lockedLabel: "Your Depletion Cycle Report + 3-Week Reset Protocol",
            lockedTeaser: "We've mapped the 3 specific habits in your daily routine that are actively feeding this cycle. Your full profile names each one — and shows the exact sequence to interrupt them before they compound further.",
            urgency: false,
        };
    }
    if (score <= 19) {
        return {
            band: "High Burnout Risk",
            label: "Significant burnout — support recommended",
            gradient: "linear-gradient(135deg, #2a1f0a 0%, #3d2e10 100%)",
            accentColor: "#b07a1a",
            accentLight: "rgba(176,122,26,0.06)",
            hook: "You're showing the hallmarks of high-level burnout — the fog, the detachment, the performance drop. These aren't personal failings.",
            cliffhanger: "What you're experiencing is a predictable physiological response to sustained overload. The inability to recover even during rest, the reduced effectiveness, the cynicism — these are symptoms of a specific burnout stage that has a mapped recovery path. But it doesn't resolve on its own.",
            tip: "Tell one person today how you're actually doing — not the edited version. The act of being witnessed by even one trusted person activates a neurological shift that begins to interrupt the isolation that high burnout creates.",
            tipLabel: "One action for today",
            lockedLabel: "Your Burnout Stage + 30-Day Recovery Roadmap",
            lockedTeaser: "A licensed Mentel therapist has been flagged to review your profile. Your full report identifies which of the 4 burnout stages you're in — and maps the exact 30-day protocol our clinicians use at this stage.",
            urgency: false,
        };
    }
    return {
        band: "Severe Burnout",
        label: "Immediate support recommended",
        gradient: "linear-gradient(135deg, #3a0f0f 0%, #4d1515 100%)",
        accentColor: "#a33030",
        accentLight: "rgba(163,48,48,0.06)",
        hook: "Your responses indicate severe burnout. What you're carrying right now is not sustainable — and you already know that.",
        cliffhanger: "People at this stage often describe feeling like they're watching themselves from a distance — still functioning on the outside, collapsing on the inside. The nervous system has been in overdrive for too long. This isn't about trying harder. It requires structured support, and it's available to you now.",
        tip: "Tell one person today how you're actually feeling — not the managed version. You don't need the right words. Letting someone in creates a neurological shift that changes the trajectory of the day.",
        tipLabel: "One thing to do today — not tomorrow",
        lockedLabel: "Your Severe Burnout Profile + Same-Week Session",
        lockedTeaser: "A licensed Mentel therapist has been flagged to review your profile directly. Your full report includes your specific burnout stage, the 3 primary drivers identified from your answers, and a same-week session option.",
        urgency: true,
    };
}

// ── Score dimension labels ─────────────────────────────────────────────────────

const dimensionLabels: Record<string, string> = {
    b1: "Emotional Exhaustion",
    b2: "Mental Fatigue",
    b3: "Motivation",
    b4: "Work-Related Stress",
    b5: "Recovery & Sleep",
    b6: "Cynicism & Detachment",
    b7: "Physical Symptoms",
    b8: "Productivity",
};

// ── Component ──────────────────────────────────────────────────────────────────

export default function BurnoutResultPage() {
    const [data, setData] = useState<{ name: string; score: number; answers?: Record<string, number> } | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        try {
            const raw = sessionStorage.getItem("mentel_burnout_result");
            if (raw) setData(JSON.parse(raw));
        } catch { }
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const score = data?.score ?? 0;
    const name = data?.name ?? "";
    const answers = data?.answers ?? {};
    const band = getBurnoutBand(score);
    const therapist = getTherapist(band.band);
    const maxScore = 24;
    const isHigh = score > 19;

    const whatsappNum = "254734527573";
    const waMsg = encodeURIComponent(`Hello Mentel, I just completed the Burnout Calculator.\nResult: *${band.band}* (Score ${score}/${maxScore})\nI'd like to book a free intro call.`);
    const whatsappUrl = `https://wa.me/${whatsappNum}?text=${waMsg}`;

    // Breakdown bars — sort by score descending for visual impact
    const breakdown = Object.entries(answers)
        .filter(([k]) => dimensionLabels[k])
        .sort((a, b) => b[1] - a[1]);

    return (
        <div className="min-h-screen bg-[#faf9f6] font-['DM_Sans',sans-serif]">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,450;9..40,500;9..40,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { font-family: 'DM Sans', -apple-system, sans-serif; background: #faf9f6; -webkit-font-smoothing: antialiased; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes barGrow { from { width: 0; } to { width: var(--bar-w); } }
        .fade-up { animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .cta-btn { transition: all 0.22s cubic-bezier(0.22,1,0.36,1); }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(30,107,107,0.38) !important; }
        .locked-blur { filter: blur(5px); user-select: none; pointer-events: none; }
        .bar-fill { animation: barGrow 1s cubic-bezier(0.22,1,0.36,1) both; animation-delay: 0.3s; }
      `}</style>

            {/* Nav */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-[rgba(250,249,246,0.92)] backdrop-blur-[18px] shadow-[0_1px_0_rgba(28,40,36,0.08)]">
                <div className="max-w-[1100px] mx-auto px-6 h-[64px] flex items-center justify-between">
                    <Link href="/" className="font-['Cormorant_Garamond',Georgia,serif] text-[20px] font-semibold text-[#1c2820] no-underline tracking-[-0.02em]">
                        Mentel
                    </Link>
                    <Link href="/burnout" className="text-[13px] text-[#5a6b5e] no-underline hover:text-[#1c2820] transition-colors">
                        Retake calculator
                    </Link>
                </div>
            </div>

            <section className="pt-24 pb-16 px-6">
                <div className="max-w-[600px] mx-auto fade-up">

                    {/* Score banner */}
                    <div className="rounded-3xl overflow-hidden mb-5 relative" style={{ background: band.gradient, color: "white", padding: "40px 32px 36px" }}>
                        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 15% 80%, rgba(255,255,255,0.05) 0%, transparent 40%)" }} />
                        <div style={{ position: "relative", zIndex: 1 }}>
                            <div className="flex items-center gap-2 mb-5">
                                <Flame size={14} strokeWidth={2} className="opacity-60" />
                                <span className="text-[11px] tracking-[0.14em] uppercase opacity-60">Burnout Calculator Result</span>
                            </div>
                            <div className="flex items-end gap-4 mb-4">
                                <div className="font-['Cormorant_Garamond',Georgia,serif] text-[80px] font-light leading-none tracking-[-0.04em]">{score}</div>
                                <div className="pb-3">
                                    <div className="text-[15px] opacity-50 mb-1">out of {maxScore}</div>
                                    {name && <div className="text-[13px] opacity-40 font-light">{name}</div>}
                                </div>
                            </div>
                            {/* Graduated score bar with band markers */}
                            <div className="mb-5">
                                <div className="h-2 bg-[rgba(255,255,255,0.15)] rounded-full overflow-hidden mb-2">
                                    <div className="h-full bg-white rounded-full bar-fill" style={{ "--bar-w": `${(score / maxScore) * 100}%`, width: `${(score / maxScore) * 100}%`, opacity: 0.75 } as React.CSSProperties} />
                                </div>
                                <div className="flex justify-between text-[10px] opacity-40">
                                    <span>Low</span><span>Mild</span><span>Moderate</span><span>High</span><span>Severe</span>
                                </div>
                            </div>
                            <h1 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(26px,5vw,38px)] font-light leading-[1.15] tracking-[-0.02em] mb-2">{band.band}</h1>
                            <p className="text-[14px] opacity-60 font-light">{band.label}</p>
                        </div>
                    </div>

                    {/* Score breakdown */}
                    {breakdown.length > 0 && (
                        <div className="bg-white border border-[#e4e9e5] rounded-2xl p-6 mb-4 shadow-[0_1px_8px_rgba(28,40,36,0.03)]">
                            <div className="text-[10px] font-semibold tracking-[0.12em] uppercase mb-5" style={{ color: band.accentColor }}>
                                Your score breakdown
                            </div>
                            <div className="flex flex-col gap-3">
                                {breakdown.map(([key, val]) => (
                                    <div key={key}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-[12px] font-medium text-[#3a4a3e]">{dimensionLabels[key]}</span>
                                            <span className="text-[11px] text-[#8a9a8e]">{val}/3</span>
                                        </div>
                                        <div className="h-[5px] bg-[#f0f0ee] rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full bar-fill"
                                                style={{
                                                    "--bar-w": `${(val / 3) * 100}%`,
                                                    width: `${(val / 3) * 100}%`,
                                                    background: val === 3 ? band.accentColor : val === 2 ? `${band.accentColor}99` : val === 1 ? `${band.accentColor}55` : "#e8ede9",
                                                } as React.CSSProperties}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Hook card */}
                    <div className="bg-white border border-[#e4e9e5] rounded-2xl p-7 mb-4 shadow-[0_2px_16px_rgba(28,40,36,0.04)]">
                        <div className="text-[10px] font-semibold tracking-[0.12em] uppercase mb-4" style={{ color: band.accentColor }}>What your score is telling us</div>
                        <p className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(20px,4vw,26px)] font-light leading-[1.35] text-[#1c2820] mb-4">{band.hook}</p>
                        <p className="text-[15px] font-light text-[#5a6b5e] leading-[1.78]">{band.cliffhanger}</p>
                    </div>

                    {/* Locked insight */}
                    <div className="rounded-2xl p-6 mb-4 relative overflow-hidden" style={{ background: band.accentLight, border: `1px solid ${band.accentColor}20` }}>
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-7 h-7 rounded-[8px] flex items-center justify-center" style={{ background: `${band.accentColor}18` }}>
                                <Lock size={12} stroke={band.accentColor} strokeWidth={2} />
                            </div>
                            <span className="text-[10px] font-semibold tracking-[0.12em] uppercase" style={{ color: band.accentColor }}>{band.lockedLabel}</span>
                        </div>
                        <div className="relative">
                            <p className="locked-blur text-[15px] font-light text-[#5a6b5e] leading-[1.78]" aria-hidden="true">{band.lockedTeaser}</p>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[13px] font-medium px-5 py-2 rounded-full border bg-white shadow-[0_2px_14px_rgba(0,0,0,0.07)] whitespace-nowrap" style={{ color: band.accentColor, borderColor: `${band.accentColor}28` }}>
                                    Unlocked in your intro call
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tip */}
                    <div className="bg-white border border-[#e4e9e5] rounded-2xl p-6 mb-4 shadow-[0_1px_8px_rgba(28,40,36,0.03)]">
                        <div className="text-[10px] font-semibold tracking-[0.12em] uppercase mb-4" style={{ color: band.accentColor }}>{band.tipLabel}</div>
                        <p className="text-[15px] font-light text-[#5a6b5e] leading-[1.78] mb-3">{band.tip}</p>
                        <p className="text-[13px] font-medium" style={{ color: band.accentColor }}>Your full recovery protocol is covered in your intro call.</p>
                    </div>

                    {/* Urgency */}
                    {isHigh && (
                        <div className="bg-[#fff8f8] border border-[#f0b4b4] rounded-2xl p-5 mb-4 flex gap-3.5">
                            <AlertTriangle size={17} stroke="#a33030" strokeWidth={2} className="flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#a33030] mb-2">If you are in immediate distress</p>
                                <p className="text-[14px] font-light text-[#4a2020] leading-[1.72]">If you feel unsafe right now, please reach out to someone you trust or visit your nearest hospital. You matter — help is available immediately.</p>
                            </div>
                        </div>
                    )}

                    {/* Therapist match card */}
                    <div className="bg-white border border-[#e4e9e5] rounded-2xl p-6 mb-4 shadow-[0_2px_16px_rgba(28,40,36,0.05)]">
                        <div className="text-[10px] font-semibold tracking-[0.12em] uppercase mb-5" style={{ color: band.accentColor }}>
                            Your matched therapist
                        </div>
                        <div className="flex items-start gap-4 mb-5">
                            {/* Avatar */}
                            <div className="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-[16px] font-semibold text-white shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
                                style={{ background: therapist.avatarGradient }}>
                                {therapist.initials}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                    <h3 className="text-[16px] font-semibold text-[#1c2820]">{therapist.name}</h3>
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="#f0c040" stroke="none" />)}
                                    </div>
                                </div>
                                <p className="text-[13px] text-[#5a6b5e] mb-0.5">{therapist.title}</p>
                                <p className="text-[12px] text-[#8a9a8e]">{therapist.experience} experience</p>
                            </div>
                        </div>

                        {/* Specialisms */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {therapist.specialisms.map((s) => (
                                <span key={s} className="text-[11px] font-medium px-3 py-1 rounded-full" style={{ background: band.accentLight, color: band.accentColor }}>
                                    {s}
                                </span>
                            ))}
                        </div>

                        {/* Therapist note */}
                        <p className="text-[13px] font-light text-[#5a6b5e] leading-[1.7] mb-5 italic border-l-2 pl-3" style={{ borderColor: `${band.accentColor}40` }}>
                            &ldquo;{therapist.note}&rdquo;
                        </p>

                        {/* Availability badge */}
                        <div className="flex items-center gap-2 mb-5">
                            <div className="w-2 h-2 rounded-full bg-[#2d7a5a]" style={{ boxShadow: "0 0 0 3px rgba(45,122,90,0.2)" }} />
                            <span className="text-[12px] text-[#2d7a5a] font-medium">
                                {isHigh ? "Same-week availability" : "Available this week"}
                            </span>
                        </div>

                        {/* Free intro call CTA */}
                        <div className="bg-[#faf9f6] border border-[#e4e9e5] rounded-xl p-4 mb-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: band.accentLight }}>
                                    <Phone size={14} stroke={band.accentColor} strokeWidth={2} />
                                </div>
                                <div>
                                    <p className="text-[13px] font-semibold text-[#1c2820] mb-0.5">Free 30-minute intro call</p>
                                    <p className="text-[12px] font-light text-[#5a6b5e] leading-[1.6]">
                                        Meet {therapist.name.split(" ")[0]}, understand your burnout profile in full, and decide if you'd like to continue — no commitment required.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cta-btn flex items-center justify-center gap-2.5 w-full py-[17px] px-7 text-white rounded-full text-[15px] font-medium font-['DM_Sans',sans-serif] no-underline"
                            style={{
                                background: `linear-gradient(135deg, ${band.accentColor}, ${isHigh ? "#7a1f1f" : "#1e6b6b"})`,
                                boxShadow: `0 6px 24px ${band.accentColor}40`,
                            }}
                        >
                            Book Free Intro Call with {therapist.name.split(" ")[0]}
                            <ArrowRight size={15} strokeWidth={2} />
                        </a>
                        <p className="text-center text-[11px] text-[#a0aba3] mt-3 font-light">
                            Via WhatsApp · Usually responds within 2 hours
                        </p>
                    </div>

                    {/* What happens next */}
                    <div className="rounded-2xl p-6 mb-6" style={{ background: "rgba(45,122,90,0.05)", border: "1px solid rgba(45,122,90,0.14)" }}>
                        <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#2d7a5a] mb-5">What happens next</p>
                        <div className="flex flex-col gap-4">
                            {[
                                "Check your email — your burnout score report is on its way",
                                `${therapist.name.split(" ")[0]} will reach out within 2 hours to schedule your free intro call`,
                                "Your full burnout profile and recovery plan are covered in the call",
                            ].map((item) => (
                                <div key={item} className="flex items-start gap-3">
                                    <CheckCircle size={16} fill="#2d7a5a" stroke="white" strokeWidth={2.5} className="flex-shrink-0 mt-0.5" />
                                    <span className="text-[14px] font-light text-[#4a5a52] leading-[1.65]">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-center text-[12px] font-light text-[#a0aba3] leading-[1.7]">
                        If you're in crisis, please contact{" "}
                        <a href="tel:112" className="text-[#2d7a5a] underline underline-offset-[2px]">emergency services</a>.
                    </p>
                </div>
            </section>
        </div>
    );
}