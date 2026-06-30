// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";
// import {
//     ArrowRight,
//     CheckCircle,
//     Lock,
//     AlertTriangle,
//     Shield,
//     BadgeCheck,
//     Menu,
//     X,
//     Star,
// } from "lucide-react";
// import { useLiveCounter } from "@/hooks/use-live-counter";

// // ── Types ──────────────────────────────────────────────────────────────────────

// interface ResultData {
//     name: string;
//     email: string;
//     score: number;
//     answers: Record<string, number>;
// }

// interface Result {
//     band: string;
//     gradient: string;
//     headline: string;
//     summary: string;
//     cta: string;
// }

// interface BandIntel {
//     typeName: string;
//     percentile: string;
//     accentColor: string;
//     accentLight: string;
//     hook: string;
//     cliffhanger: string;
//     lockedLabel: string;
//     lockedTeaser: string;
//     tip: string;
//     tipLabel: string;
//     urgency: boolean;
// }

// interface TherapistProfile {
//     name: string;
//     title: string;
//     photo: string;
//     specialty: string;
//     experience: string;
//     rating: number;
//     sessions: string;
//     matchReason: string;
// }

// type LoadPhase = "a" | "b" | "c" | "done";

// // ── Data helpers ───────────────────────────────────────────────────────────────

// function getResult(score: number): Result {
//     if (score <= 6)
//         return {
//             band: "Thriving",
//             gradient: "linear-gradient(135deg, #1a3a2e 0%, #234d3d 100%)",
//             headline: "You're in a good place",
//             summary:
//                 "Your responses suggest you're managing well overall. Many people reach out proactively to build resilience, develop self-awareness, or navigate life transitions, therapy can be valuable even when you're not in crisis.",
//             cta: "Chat us on WhatsApp",
//         };
//     if (score <= 12)
//         return {
//             band: "Mild Concern",
//             gradient: "linear-gradient(135deg, #0f2d2d 0%, #1a4040 100%)",
//             headline: "Some areas could use support",
//             summary:
//                 "Your responses suggest you're experiencing some difficulties worth exploring. A therapist can help you build practical tools and understand patterns before they become harder to manage.",
//             cta: "Chat us on WhatsApp",
//         };
//     if (score <= 18)
//         return {
//             band: "Moderate",
//             gradient: "linear-gradient(135deg, #1c2e3d 0%, #243a4d 100%)",
//             headline: "You deserve real support",
//             summary:
//                 "Your responses suggest you're going through a genuinely difficult time. You're not alone, what you're feeling is valid, and speaking with a licensed therapist can make a significant difference.",
//             cta: "Chat us on WhatsApp",
//         };
//     return {
//         band: "High Concern",
//         gradient: "linear-gradient(135deg, #3a0f12 0%, #4d1519 100%)",
//         headline: "Please reach out, you matter",
//         summary:
//             "Your responses suggest you're struggling significantly right now. We strongly encourage you to speak with a professional as soon as possible. Our therapists are here for you, without judgment.",
//         cta: "Chat us on WhatsApp",
//     };
// }

// function getBandIntel(score: number): BandIntel {
//     if (score <= 6)
//         return {
//             typeName: "Latent Drift Pattern",
//             percentile: "Top 12% of stable individuals in our network",
//             accentColor: "#2d7a5a",
//             accentLight: "rgba(45,122,90,0.08)",
//             hook: "You appear stable but stable and thriving are not the same thing.",
//             cliffhanger:
//                 "Your data shows one specific low-grade pattern that quietly drains mental energy in high-functioning people. It rarely feels like a problem, until it becomes one. Most people only recognise it in hindsight.",
//             lockedLabel: "Your Latent Drift Profile + 6-Month Forecast",
//             lockedTeaser:
//                 "We've identified the one silent habit in your routine keeping your baseline lower than it needs to be. Your full profile names it and shows you the 3-step correction.",
//             tip: "Start a 5-minute evening wind-down, no screens, just one honest question: 'What did I avoid feeling today?' People in your band who do this consistently report a measurable shift in clarity within 2 weeks.",
//             tipLabel: "One thing worth trying this week",
//             urgency: false,
//         };
//     if (score <= 12)
//         return {
//             typeName: "Cortisol Stall Pattern",
//             percentile: "Top 28% of high-stress individuals we've assessed",
//             accentColor: "#1e6b6b",
//             accentLight: "rgba(30,107,107,0.08)",
//             hook: "Your results suggest a Type 2 Cortisol Stall, not burnout, but the stage just before it.",
//             cliffhanger:
//                 "This isn't just tiredness. There's a specific neurological pattern in your responses that affects decision-making and your capacity to feel motivated even when you're technically resting. Most people try to fix this with more rest. For this pattern, rest alone makes the fog worse.",
//             lockedLabel: "Your 3 Daily Triggers + Reverse-Reset Protocol",
//             lockedTeaser:
//                 "We've identified 3 specific habits in your routine that are actively reinforcing this pattern. Your full profile names each one and shows the sequence to interrupt them.",
//             tip: "When mental fog hits, try the 4-7-8 breath: inhale 4 counts, hold 7, exhale 8. It directly activates your parasympathetic system and interrupts the cortisol loop within minutes, not hours.",
//             tipLabel: "One thing worth trying this week",
//             urgency: false,
//         };
//     if (score <= 18)
//         return {
//             typeName: "Functional Freeze Pattern",
//             percentile: "Top 41% of moderate-severity cases we see monthly",
//             accentColor: "#2d4a6e",
//             accentLight: "rgba(45,74,110,0.08)",
//             hook: "To the outside world you're still functioning. Internally, something has quietly shifted.",
//             cliffhanger:
//                 "Your data shows what we call a Functional Freeze, where the gap between how you appear and how you actually feel has been widening for some time. There is one specific energy leak driving this. No amount of rest, holidays, or willpower closes it without addressing the root.",
//             lockedLabel: "Your Energy Leak Report + 30-Day Recovery Protocol",
//             lockedTeaser:
//                 "We've pinpointed the single biggest drain in your mental energy based on your answers. Your full profile names it and gives you the 30-day protocol our therapists use to close it.",
//             tip: "When everything feels heavy: name 5 things you can see, 4 you can touch, 3 you can hear. This grounding technique interrupts a mental spiral within 60 seconds, not by solving the problem, but by returning you to the present.",
//             tipLabel: "One thing worth trying this week",
//             urgency: false,
//         };
//     return {
//         typeName: "Critical Threshold Pattern",
//         percentile: "Top 15% of high-distress cases, this needs attention",
//         accentColor: "#a33030",
//         accentLight: "rgba(163,48,48,0.07)",
//         hook: "What you're experiencing is real and it's unlikely to resolve without the right support.",
//         cliffhanger:
//             "Your responses place you in what we call a Critical Threshold state. People at this stage describe feeling like they're disappearing behind a functional exterior. Pushing through alone doesn't work, not because of weakness, but because of how the nervous system responds to sustained high-stress load.",
//         lockedLabel: "Your Personal Crisis-to-Clarity Roadmap",
//         lockedTeaser:
//             "A licensed Mentel therapist has been flagged to review your profile directly. Your full report includes the first 3 steps specifically for your pattern and a same-week session option.",
//         tip: "Tell one person how you're actually feeling today, not the edited version. You don't need the right words. Just letting someone in creates a neurological shift that changes the trajectory of the day.",
//         tipLabel: "One thing to do today, not tomorrow",
//         urgency: true,
//     };
// }

// // Therapist matched to each band
// function getMatchedTherapist(score: number): TherapistProfile {
//     return {
//         name: "Oridupa Susan",
//         title: "Clinical Psychologist",
//         photo: "/yetunde.jpeg",
//         specialty: "Resilience & Personal Growth",
//         experience: "9 years",
//         rating: 4.9,
//         sessions: "1,200+",
//         matchReason:
//             "Specialises in proactive wellness and high-functioning clients who want to go from good to exceptional.",
//     };
//     // if (score <= 6)
//     //     return {
//     //         name: "Dr. Amara Osei",
//     //         title: "Clinical Psychologist",
//     //         photo: "/therapists/amara-osei.jpg",
//     //         specialty: "Resilience & Personal Growth",
//     //         experience: "9 years",
//     //         rating: 4.9,
//     //         sessions: "1,200+",
//     //         matchReason:
//     //             "Specialises in proactive wellness and high-functioning clients who want to go from good to exceptional.",
//     //     };
//     // if (score <= 12)
//     //     return {
//     //         name: "Chidi Nwosu",
//     //         title: "Licensed Psychotherapist",
//     //         photo: "/therapists/chidi-nwosu.jpg",
//     //         specialty: "Stress & Burnout Recovery",
//     //         experience: "7 years",
//     //         rating: 4.8,
//     //         sessions: "940+",
//     //         matchReason:
//     //             "Expert in cortisol regulation patterns and cognitive-behavioural approaches to sustained stress.",
//     //     };
//     // if (score <= 18)
//     //     return {
//     //         name: "Funmilayo Adeyemi",
//     //         title: "Counselling Psychologist",
//     //         photo: "/therapists/funmilayo-adeyemi.jpg",
//     //         specialty: "Emotional Processing & Trauma",
//     //         experience: "11 years",
//     //         rating: 4.9,
//     //         sessions: "1,500+",
//     //         matchReason:
//     //             "Highly experienced with functional freeze states and the gap between external performance and inner wellbeing.",
//     //     };
//     // return {
//     //     name: "Dr. Emeka Okafor",
//     //     title: "Consultant Psychiatrist",
//     //     photo: "/therapists/emeka-okafor.jpg",
//     //     specialty: "Crisis Intervention & Recovery",
//     //     experience: "14 years",
//     //     rating: 5.0,
//     //     sessions: "2,000+",
//     //     matchReason:
//     //         "Leads our high-distress response team. Specialises in rapid stabilisation and compassionate crisis care.",
//     // };
// }

// function buildWhatsAppUrl(score: number, name: string): string {
//     const r = getResult(score);
//     const num = "254734527573";
//     const msgs: Record<string, string> = {
//         "High Concern": "I need urgent support and would like to speak with a professional as soon as possible.",
//         Thriving: "I'm interested in proactive therapy and building resilience.",
//     };
//     const note =
//         msgs[r.band] ??
//         "I'd like to discuss these results and see how therapy can help me.";
//     return `https://wa.me/${num}?text=${encodeURIComponent(
//         `Hello Mentel, I just completed my Private Wellness Assessment.\nName: *${name}*\nResult: *${r.band}*\n${note}`
//     )}`;
// }

// // ── Nav (same pattern as AssessmentPage) ──────────────────────────────────────

// function ResultNav() {
//     const [menuOpen, setMenuOpen] = useState(false);
//     const [scrolled, setScrolled] = useState(false);

//     useEffect(() => {
//         const onScroll = () => setScrolled(window.scrollY > 12);
//         window.addEventListener("scroll", onScroll, { passive: true });
//         return () => window.removeEventListener("scroll", onScroll);
//     }, []);

//     return (
//         <nav
//             className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled
//                 ? "bg-[rgba(250,249,246,0.92)] backdrop-blur-[18px] shadow-[0_1px_0_rgba(28,40,36,0.08)]"
//                 : "bg-transparent"
//                 }`}
//             aria-label="Site navigation"
//         >
//             <div className="max-w-[1100px] mx-auto px-6 h-[68px] flex items-center justify-between">
//                 <Link href="/" className="flex items-center gap-2.5 no-underline" aria-label="Mentel, home">
//                     <div className="w-8 h-8 rounded-[10px] flex items-center justify-center overflow-hidden">
//                         <Image src="/logo-assessment.png" alt="Mentel logo" width={32} height={32} className="object-cover" />
//                     </div>
//                     <span className="font-['Cormorant_Garamond',Georgia,serif] text-[22px] font-semibold tracking-[-0.02em] text-[#1c2820]">
//                         Mentel
//                     </span>
//                 </Link>

//                 <div className="hidden md:flex items-center gap-8">
//                     {["About", "Services", "Articles", "Company"].map((item) => (
//                         <Link
//                             key={item}
//                             href={`/${item === "Company" ? "eap" : item.toLowerCase()}`}
//                             className="text-sm font-[450] text-[#4a5a52] no-underline tracking-[0.01em] hover:text-[#1c2820] transition-colors"
//                         >
//                             {item}
//                         </Link>
//                     ))}
//                     <Link
//                         href="/#book"
//                         className="text-[13px] font-medium text-white bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] px-5 py-2.5 rounded-full no-underline shadow-[0_2px_12px_rgba(30,107,107,0.25)] hover:opacity-90 transition-opacity"
//                     >
//                         Book a session
//                     </Link>
//                 </div>

//                 <button
//                     type="button"
//                     onClick={() => setMenuOpen((v) => !v)}
//                     aria-label={menuOpen ? "Close menu" : "Open menu"}
//                     className="md:hidden bg-transparent border-0 cursor-pointer p-2 text-[#1c2820]"
//                 >
//                     {menuOpen ? <X size={22} /> : <Menu size={22} />}
//                 </button>
//             </div>

//             {menuOpen && (
//                 <div className="md:hidden bg-[rgba(250,249,246,0.98)] backdrop-blur-xl border-t border-[rgba(28,40,36,0.08)] px-6 pt-4 pb-6">
//                     {["About", "Services", "Therapists", "Articles"].map((item) => (
//                         <Link
//                             key={item}
//                             href={`/${item.toLowerCase()}`}
//                             className="block py-3 text-base text-[#1c2820] no-underline border-b border-[rgba(28,40,36,0.06)]"
//                             onClick={() => setMenuOpen(false)}
//                         >
//                             {item}
//                         </Link>
//                     ))}
//                     <Link
//                         href="/#book"
//                         className="block mt-4 text-center text-sm font-medium text-white bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] py-3.5 px-5 rounded-full no-underline"
//                         onClick={() => setMenuOpen(false)}
//                     >
//                         Book a session
//                     </Link>
//                 </div>
//             )}
//         </nav>
//     );
// }

// // ── Therapist Card ─────────────────────────────────────────────────────────────

// function TherapistCard({
//     therapist,
//     accentColor,
//     accentLight,
//     whatsappUrl,
// }: {
//     therapist: TherapistProfile;
//     accentColor: string;
//     accentLight: string;
//     whatsappUrl: string;
// }) {
//     return (
//         <div
//             className="rounded-[20px] overflow-hidden border mb-4"
//             style={{
//                 borderColor: `${accentColor}22`,
//                 background: "white",
//                 boxShadow: "0 4px 24px rgba(28,40,36,0.06)",
//             }}
//         >
//             {/* Top accent bar */}
//             <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)` }} />

//             <div className="p-6">
//                 {/* Label */}
//                 <p
//                     className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-5"
//                     style={{ color: accentColor }}
//                 >
//                     Your matched therapist
//                 </p>

//                 {/* Profile row */}
//                 <div className="flex items-start gap-4 mb-5">
//                     {/* Avatar */}
//                     <div className="relative flex-shrink-0">
//                         <div
//                             className="w-[72px] h-[72px] rounded-2xl overflow-hidden border-2"
//                             style={{ borderColor: `${accentColor}30` }}
//                         >
//                             {/* Fallback initials avatar if photo not found */}
//                             {/* <div
//                                 className="w-full h-full flex items-center justify-center text-xl font-semibold text-white"
//                                 style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)` }}
//                             >
//                                 {therapist.name
//                                     .split(" ")
//                                     .map((n) => n[0])
//                                     .slice(0, 2)
//                                     .join("")}
//                             </div> */}
//                             {/* Uncomment below and remove div above once real photos are in /public/therapists/ */}

//                             <Image
//                                 src={therapist.photo}
//                                 alt={therapist.name}
//                                 width={72}
//                                 height={72}
//                                 className="w-full h-full object-cover"
//                             />

//                         </div>

//                         {/* Verified badge — bottom-right of avatar */}
//                         <div
//                             className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-[0_1px_6px_rgba(28,40,36,0.15)]"
//                             title="Licensed & verified by Mentel"
//                         >
//                             <BadgeCheck size={16} style={{ color: accentColor }} strokeWidth={2} fill={accentLight} />
//                         </div>
//                     </div>

//                     {/* Name + title + specialty */}
//                     <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-2 flex-wrap mb-0.5">
//                             <h3 className="text-[17px] font-semibold text-[#1c2820] leading-tight">
//                                 {therapist.name}
//                             </h3>
//                             <span
//                                 className="text-[10px] font-semibold tracking-[0.06em] uppercase px-2 py-0.5 rounded-full"
//                                 style={{ background: accentLight, color: accentColor }}
//                             >
//                                 Verified
//                             </span>
//                         </div>
//                         <p className="text-[13px] text-[#5a6b5e] font-light mb-1">{therapist.title}</p>
//                         <p
//                             className="text-[12px] font-medium"
//                             style={{ color: accentColor }}
//                         >
//                             {therapist.specialty}
//                         </p>
//                     </div>
//                 </div>

//                 {/* Stats row */}
//                 <div
//                     className="grid grid-cols-3 gap-3 rounded-2xl p-4 mb-5"
//                     style={{ background: accentLight }}
//                 >
//                     {[
//                         { label: "Experience", value: therapist.experience },
//                         { label: "Sessions", value: therapist.sessions },
//                         {
//                             label: "Rating",
//                             value: (
//                                 <span className="flex items-center gap-1 justify-center">
//                                     <Star size={11} fill={accentColor} stroke="none" />
//                                     {therapist.rating.toFixed(1)}
//                                 </span>
//                             ),
//                         },
//                     ].map(({ label, value }) => (
//                         <div key={label} className="text-center">
//                             <div
//                                 className="font-['Cormorant_Garamond',Georgia,serif] text-[18px] font-medium leading-none mb-1 flex items-center justify-center"
//                                 style={{ color: accentColor }}
//                             >
//                                 {value}
//                             </div>
//                             <div className="text-[10px] text-[#8a9a8e] uppercase tracking-[0.08em] font-medium">
//                                 {label}
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Match reason */}
//                 <div className="flex items-start gap-3 mb-5 p-3.5 rounded-xl bg-[#faf9f6] border border-[#e8ede9]">
//                     <CheckCircle size={15} fill={accentColor} stroke="white" strokeWidth={2.5} className="flex-shrink-0 mt-0.5" />
//                     <p className="text-[13px] font-light text-[#4a5a52] leading-[1.65] italic">
//                         {therapist.matchReason}
//                     </p>
//                 </div>

//                 {/* Book CTA */}
//                 <Link
//                     // href={whatsappUrl}
//                     href="/book"
//                     // target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center justify-center gap-2 w-full py-[14px] px-6 rounded-full text-white text-[14px] font-medium font-['DM_Sans',sans-serif] no-underline transition-all hover:-translate-y-0.5"
//                     style={{
//                         background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
//                         boxShadow: `0 4px 18px ${accentColor}44`,
//                     }}
//                 >
//                     Book a session with {therapist.name.split(" ")[0]}
//                     <ArrowRight size={14} strokeWidth={2} />
//                 </Link>
//             </div>
//         </div>
//     );
// }

// // ── Loading screen ─────────────────────────────────────────────────────────────

// function LoadingScreen({ score }: { score: number }) {
//     const [phase, setPhase] = useState<LoadPhase>("a");
//     const assessedCount = useLiveCounter(2400, "2026-06-01", 2000);

//     useEffect(() => {
//         const t1 = setTimeout(() => setPhase("b"), 1800);
//         const t2 = setTimeout(() => setPhase("c"), 3600);
//         return () => { clearTimeout(t1); clearTimeout(t2); };
//     }, []);

//     const isHigh = score > 18;
//     const color = isHigh && phase === "c" ? "#a33030" : "#05673e";

//     const messages = {
//         a: { text: "Analysing your 18 data points…", sub: "Cross-referencing mood, stress, sleep and relational patterns", pct: 33 },
//         b: { text: `Comparing against ${assessedCount}+ profiles…`, sub: "Identifying your specific pattern type", pct: 66 },
//         c: {
//             text: isHigh ? "Elevated threshold detected." : "Pattern identified.",
//             sub: isHigh ? "Your results require careful review" : "Your personalised profile is ready",
//             pct: 90,
//         },
//         done: { text: "", sub: "", pct: 100 },
//     };

//     const msg = messages[phase];

//     return (
//         <div className="min-h-screen flex items-center justify-center px-6">
//             <div className="text-center max-w-[380px]" style={{ animation: "fadeIn 0.45s ease both" }}>
//                 <div
//                     className="w-16 h-16 rounded-full mx-auto mb-9"
//                     style={{
//                         border: `3px solid ${color}20`,
//                         borderTopColor: color,
//                         animation: "spin 0.85s linear infinite",
//                     }}
//                 />
//                 <h2
//                     className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(22px,5vw,30px)] font-light leading-[1.3] mb-3.5"
//                     style={{ color }}
//                 >
//                     {msg.text}
//                 </h2>
//                 <p className="text-sm font-light leading-[1.65] mb-10" style={{ color: "var(--text-muted)" }}>
//                     {msg.sub}
//                 </p>

//                 <div className="h-[3px] bg-[#e8ede9] rounded-full overflow-hidden mb-7">
//                     <div
//                         className="h-full rounded-full transition-[width] duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
//                         style={{ width: `${msg.pct}%`, background: `linear-gradient(90deg, ${color}, ${color}88)` }}
//                     />
//                 </div>

//                 <div className="flex justify-center gap-2">
//                     {(["a", "b", "c"] as LoadPhase[]).map((p) => (
//                         <div
//                             key={p}
//                             className="w-[7px] h-[7px] rounded-full transition-all duration-300"
//                             style={{
//                                 background: p === phase ? color : "#d8dbd5",
//                                 transform: p === phase ? "scale(1.3)" : "scale(1)",
//                             }}
//                         />
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }

// // ── Main ResultPage ────────────────────────────────────────────────────────────

// export default function ResultPage() {
//     const router = useRouter();
//     const [data, setData] = useState<ResultData | null>(null);
//     const [loadPhase, setLoadPhase] = useState<LoadPhase>("a");
//     const [hydrated, setHydrated] = useState(false);

//     useEffect(() => {
//         if (typeof window === "undefined") return;
//         const raw = sessionStorage.getItem("mentel_assessment_result");
//         if (!raw) {
//             // No result data — send back to assessment
//             router.replace("/assessment");
//             return;
//         }
//         try {
//             setData(JSON.parse(raw));
//         } catch {
//             router.replace("/assessment");
//             return;
//         }
//         setHydrated(true);

//         // Loading phases
//         const t1 = setTimeout(() => setLoadPhase("b"), 1800);
//         const t2 = setTimeout(() => setLoadPhase("c"), 3600);
//         const t3 = setTimeout(() => setLoadPhase("done"), 5200);
//         return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
//     }, [router]);

//     useEffect(() => {
//         if (typeof window !== "undefined" && (window as any).fbq) {
//             (window as any).fbq('track', 'Lead');
//         }
//     }, []);


//     if (!hydrated || !data) return null;

//     const { name, score } = data;
//     const result = getResult(score);
//     const intel = getBandIntel(score);
//     const therapist = getMatchedTherapist(score);
//     const isHigh = score > 18;
//     const whatsappUrl = buildWhatsAppUrl(score, name);
//     const totalQuestions = 8;

//     if (loadPhase !== "done") {
//         return (
//             <div
//                 className="min-h-screen bg-[#faf9f6] font-['DM_Sans',sans-serif]"
//                 style={{ fontFamily: "'DM Sans', sans-serif" }}
//             >
//                 <ResultNav />
//                 <LoadingScreen score={score} />
//                 <style>{globalStyles}</style>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-[#faf9f6] font-['DM_Sans',sans-serif]">
//             <ResultNav />
//             <style>{globalStyles}</style>

//             <section className="pt-24 pb-20 px-6">
//                 <div className="max-w-[600px] mx-auto" style={{ animation: "fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both" }}>

//                     {/* ── Pattern banner ── */}
//                     <div
//                         className="rounded-3xl overflow-hidden mb-5 relative text-white px-8 py-10"
//                         style={{ background: result.gradient }}
//                     >
//                         {/* Subtle radial overlays */}
//                         <div
//                             className="absolute inset-0 pointer-events-none"
//                             style={{
//                                 backgroundImage:
//                                     "radial-gradient(circle at 85% 15%, rgba(255,255,255,0.09) 0%, transparent 55%), radial-gradient(circle at 10% 85%, rgba(255,255,255,0.05) 0%, transparent 45%)",
//                             }}
//                         />
//                         <div className="relative z-10">
//                             <div className="inline-block bg-[rgba(255,255,255,0.14)] rounded-full px-4 py-1.5 text-[12px] mb-4 backdrop-blur-sm tracking-[0.02em]">
//                                 {intel.percentile}
//                             </div>
//                             <div className="text-[10px] tracking-[0.14em] uppercase opacity-55 mb-2">Your pattern</div>
//                             <h1 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(30px,6vw,44px)] font-light leading-[1.1] tracking-[-0.025em] mb-3">
//                                 {intel.typeName}
//                             </h1>
//                             <div className="opacity-65 text-[13px] font-light">
//                                 {result.band} · Score {score}/{totalQuestions * 3}
//                                 {name ? ` · ${name}` : ""}
//                             </div>
//                         </div>
//                     </div>

//                     {/* ── Hook card ── */}
//                     <div className="bg-white border border-[#e4e9e5] rounded-[20px] p-7 mb-4 shadow-[0_2px_16px_rgba(28,40,36,0.04)]">
//                         <div
//                             className="text-[10px] font-semibold tracking-[0.12em] uppercase mb-4"
//                             style={{ color: intel.accentColor }}
//                         >
//                             What your results are telling us
//                         </div>
//                         <p className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(20px,4.5vw,27px)] font-light leading-[1.32] text-[#1c2820] mb-4">
//                             {intel.hook}
//                         </p>
//                         <p className="text-[15px] font-light text-[#5a6b5e] leading-[1.78]">
//                             {intel.cliffhanger}
//                         </p>
//                     </div>

//                     {/* ── Therapist match card — placed here for maximum conversion impact ── */}
//                     <TherapistCard
//                         therapist={therapist}
//                         accentColor={intel.accentColor}
//                         accentLight={intel.accentLight}
//                         whatsappUrl={whatsappUrl}
//                     />

//                     {/* ── Locked insight ── */}
//                     <div
//                         className="rounded-[20px] p-6 mb-4 relative overflow-hidden border"
//                         style={{
//                             background: intel.accentLight,
//                             borderColor: `${intel.accentColor}22`,
//                         }}
//                     >
//                         <div className="flex items-center gap-2.5 mb-4">
//                             <div
//                                 className="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center"
//                                 style={{ background: `${intel.accentColor}18` }}
//                             >
//                                 <Lock size={13} stroke={intel.accentColor} strokeWidth={2} />
//                             </div>
//                             <span
//                                 className="text-[10px] font-semibold tracking-[0.12em] uppercase"
//                                 style={{ color: intel.accentColor }}
//                             >
//                                 {intel.lockedLabel}
//                             </span>
//                         </div>

//                         <div className="relative">
//                             <p
//                                 className="text-[15px] font-light text-[#5a6b5e] leading-[1.78]"
//                                 style={{ filter: "blur(5px)", userSelect: "none", pointerEvents: "none" }}
//                                 aria-hidden="true"
//                             >
//                                 {intel.lockedTeaser}
//                             </p>
//                             <div className="absolute inset-0 flex items-center justify-center">
//                                 <span
//                                     className="text-[13px] font-medium bg-white px-5 py-1.5 rounded-full border whitespace-nowrap shadow-[0_2px_14px_rgba(0,0,0,0.07)]"
//                                     style={{ color: intel.accentColor, borderColor: `${intel.accentColor}28` }}
//                                 >
//                                     Revealed in your session
//                                 </span>
//                             </div>
//                         </div>
//                     </div>

//                     {/* ── Tip card ── */}
//                     <div className="bg-white border border-[#e4e9e5] rounded-[20px] p-6 mb-4 shadow-[0_1px_8px_rgba(28,40,36,0.03)]">
//                         <div
//                             className="text-[10px] font-semibold tracking-[0.12em] uppercase mb-4"
//                             style={{ color: intel.accentColor }}
//                         >
//                             {intel.tipLabel}
//                         </div>
//                         <p className="text-[15px] font-light text-[#5a6b5e] leading-[1.78] mb-3.5">
//                             {intel.tip}
//                         </p>
//                         <p className="text-[13px] font-medium" style={{ color: intel.accentColor }}>
//                             Your full recovery protocol is covered in your first session.
//                         </p>
//                     </div>

//                     {/* ── Urgency alert (high concern only) ── */}
//                     {isHigh && (
//                         <div className="bg-[#fff8f8] border border-[#f0b4b4] rounded-[20px] p-5 mb-4 flex gap-3.5">
//                             <AlertTriangle size={17} stroke="#a33030" strokeWidth={2} className="flex-shrink-0 mt-0.5" />
//                             <div>
//                                 <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#a33030] mb-2">
//                                     If you are in immediate distress
//                                 </p>
//                                 <p className="text-sm font-light text-[#4a2020] leading-[1.72]">
//                                     If you feel unsafe right now, please reach out to someone you trust or visit your nearest hospital. You matter, help is available immediately.
//                                 </p>
//                             </div>
//                         </div>
//                     )}

//                     {/* ── Main CTA block ── */}
//                     <div
//                         className="rounded-3xl p-8 mb-5 border"
//                         style={{ background: intel.accentLight, borderColor: `${intel.accentColor}18` }}
//                     >
//                         <h3 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(22px,4.5vw,28px)] font-light text-[#1c2820] leading-[1.28] mb-3">
//                             A therapist matched to your pattern
//                         </h3>
//                         <p className="text-sm font-light text-[#5a6b5e] leading-[1.72] mb-7">
//                             One 60-minute session, built around what your results showed. We'll explain your full pattern, name your specific triggers, and give you a concrete next step.
//                         </p>
//                         <div className="flex flex-col gap-3">
//                             <Link
//                                 href={whatsappUrl}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="cta-btn flex items-center justify-center gap-2.5 py-[17px] px-7 rounded-full text-white text-[15px] font-medium font-['DM_Sans',sans-serif] no-underline"
//                                 style={{
//                                     background: `linear-gradient(135deg, ${intel.accentColor}, ${isHigh ? "#7a1f1f" : "#1e6b6b"})`,
//                                     boxShadow: `0 6px 24px ${intel.accentColor}45`,
//                                 }}
//                             >
//                                 {result.cta}
//                                 <ArrowRight size={15} strokeWidth={2} />
//                             </Link>
//                             <Link
//                                 href="/services"
//                                 className="flex items-center justify-center gap-2 py-4 px-7 bg-white border-[1.5px] border-[#dce5df] text-[#3a4a3e] rounded-full no-underline text-[15px] font-[400] font-['DM_Sans',sans-serif] transition-all hover:border-[#2d7a5a] shadow-[0_1px_6px_rgba(28,40,36,0.05)]"
//                             >
//                                 View our services
//                             </Link>
//                         </div>
//                     </div>

//                     {/* ── What happens next ── */}
//                     <div className="bg-[rgba(45,122,90,0.05)] border border-[rgba(45,122,90,0.14)] rounded-[20px] p-6 mb-6">
//                         <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#2d7a5a] mb-5">
//                             What happens next
//                         </p>
//                         <div className="flex flex-col gap-4">
//                             {[
//                                 "Check your email, your full results summary is on its way",
//                                 "Check your spam folder if you don't see it within 2 minutes",
//                                 "A therapist matched to your pattern will reach out within 24 hours",
//                             ].map((item) => (
//                                 <div key={item} className="flex items-start gap-3">
//                                     <CheckCircle size={16} fill="#2d7a5a" stroke="white" strokeWidth={2.5} className="flex-shrink-0 mt-0.5" />
//                                     <span className="text-sm font-light text-[#4a5a52] leading-[1.65]">{item}</span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* ── Privacy note ── */}
//                     <div className="flex items-center justify-center gap-1.5 mb-5">
//                         <Shield size={12} stroke="#a0aba3" strokeWidth={1.8} />
//                         <p className="text-[12px] font-light text-[#a0aba3]">
//                             Your results are private and never shared with third parties
//                         </p>
//                     </div>

//                     <p className="text-center text-[12px] font-light text-[#a0aba3] leading-[1.7]">
//                         If you're in crisis, please contact{" "}
//                         <a href="tel:112" className="text-[#2d7a5a] underline underline-offset-[2px]">
//                             emergency services
//                         </a>
//                         .
//                     </p>
//                 </div>
//             </section>
//         </div>
//     );
// }

// // ── Global styles (inlined so the page is self-contained) ─────────────────────

// const globalStyles = `
//   @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,450;9..40,500;9..40,600&display=swap');

//   *, *::before, *::after { box-sizing: border-box; }
//   body { font-family: 'DM Sans', -apple-system, sans-serif; background: #faf9f6; -webkit-font-smoothing: antialiased; }

//   @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
//   @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
//   @keyframes spin { to { transform: rotate(360deg); } }

//   .cta-btn { transition: all 0.22s cubic-bezier(0.22,1,0.36,1); }
//   .cta-btn:hover { transform: translateY(-2px); filter: brightness(1.06); }
//   .cta-btn:active { transform: translateY(0); }
// `;





"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowRight,
    CheckCircle,
    Lock,
    AlertTriangle,
    Shield,
    BadgeCheck,
    Menu,
    X,
    Star,
} from "lucide-react";
import { PageWrapper } from "./AssessmentPage";

// ── Types ──────────────────────────────────────────────────────────────────────

interface ResultData {
    name: string;
    email: string;
    score: number;
    answers: Record<string, number>;
}

interface Result {
    band: string;
    gradient: string;
    headline: string;
    summary: string;
    cta: string;
}

interface BandIntel {
    typeName: string;
    percentile: string;
    accentColor: string;
    accentLight: string;
    hook: string;
    cliffhanger: string;
    lockedLabel: string;
    lockedTeaser: string;
    tip: string;
    tipLabel: string;
    urgency: boolean;
}

interface TherapistProfile {
    name: string;
    title: string;
    photo: string;
    specialty: string;
    experience: string;
    rating: number;
    sessions: string;
    matchReason: string;
}

// ── Data helpers ───────────────────────────────────────────────────────────────

function getResult(score: number): Result {
    if (score <= 6)
        return {
            band: "Thriving",
            gradient: "linear-gradient(135deg, #1a3a2e 0%, #234d3d 100%)",
            headline: "You're in a good place",
            summary:
                "Your responses suggest you're managing well overall. Many people reach out proactively to build resilience, develop self-awareness, or navigate life transitions, therapy can be valuable even when you're not in crisis.",
            // cta: "Book your free into call",
            cta: "Chat us on WhatsApp",
        };
    if (score <= 12)
        return {
            band: "Mild Concern",
            gradient: "linear-gradient(135deg, #0f2d2d 0%, #1a4040 100%)",
            headline: "Some areas could use support",
            summary:
                "Your responses suggest you're experiencing some difficulties worth exploring. A therapist can help you build practical tools and understand patterns before they become harder to manage.",
            // cta: "Book your free into call",
            cta: "Chat us on WhatsApp",
        };
    if (score <= 18)
        return {
            band: "Moderate",
            gradient: "linear-gradient(135deg, #1c2e3d 0%, #243a4d 100%)",
            headline: "You deserve real support",
            summary:
                "Your responses suggest you're going through a genuinely difficult time. You're not alone, what you're feeling is valid, and speaking with a licensed therapist can make a significant difference.",
            // cta: "Book your free into call",
            cta: "Chat us on WhatsApp",
        };
    return {
        band: "High Concern",
        gradient: "linear-gradient(135deg, #3a0f12 0%, #4d1519 100%)",
        headline: "Please reach out, you matter",
        summary:
            "Your responses suggest you're struggling significantly right now. We strongly encourage you to speak with a professional as soon as possible. Our therapists are here for you, without judgment.",
        // cta: "Book your free into call",
        cta: "Chat us on WhatsApp",
    };
}

function getBandIntel(score: number): BandIntel {
    if (score <= 6)
        return {
            typeName: "Latent Drift Pattern",
            percentile: "Top 12% of stable individuals in our network",
            accentColor: "#2d7a5a",
            accentLight: "rgba(45,122,90,0.08)",
            hook: "You appear stable, but stable and thriving are not the same thing.",
            cliffhanger:
                "Your data shows one specific low-grade pattern that quietly drains mental energy in high-functioning people. It rarely feels like a problem, until it becomes one. Most people only recognise it in hindsight.",
            lockedLabel: "Your Latent Drift Profile + 6-Month Forecast",
            lockedTeaser:
                "We've identified the one silent habit in your routine keeping your baseline lower than it needs to be. Your full profile names it, and shows you the 3-step correction.",
            tip: "Start a 5-minute evening wind-down, no screens, just one honest question: 'What did I avoid feeling today?' People in your band who do this consistently report a measurable shift in clarity within 2 weeks.",
            tipLabel: "One thing worth trying this week",
            urgency: false,
        };
    if (score <= 12)
        return {
            typeName: "Cortisol Stall Pattern",
            percentile: "Top 28% of high-stress individuals we've assessed",
            accentColor: "#1e6b6b",
            accentLight: "rgba(30,107,107,0.08)",
            hook: "Your results suggest a Type 2 Cortisol Stall, not burnout, but the stage just before it.",
            cliffhanger:
                "This isn't just tiredness. There's a specific neurological pattern in your responses that affects decision-making and your capacity to feel motivated, even when you're technically resting. Most people try to fix this with more rest. For this pattern, rest alone makes the fog worse.",
            lockedLabel: "Your 3 Daily Triggers + Reverse-Reset Protocol",
            lockedTeaser:
                "We've identified 3 specific habits in your routine that are actively reinforcing this pattern. Your full profile names each one, and shows the sequence to interrupt them.",
            tip: "When mental fog hits, try the 4-7-8 breath: inhale 4 counts, hold 7, exhale 8. It directly activates your parasympathetic system and interrupts the cortisol loop within minutes, not hours.",
            tipLabel: "One thing worth trying this week",
            urgency: false,
        };
    if (score <= 18)
        return {
            typeName: "Functional Freeze Pattern",
            percentile: "Top 41% of moderate-severity cases we see monthly",
            accentColor: "#2d4a6e",
            accentLight: "rgba(45,74,110,0.08)",
            hook: "To the outside world you're still functioning. Internally, something has quietly shifted.",
            cliffhanger:
                "Your data shows what we call a Functional Freeze, where the gap between how you appear and how you actually feel has been widening for some time. There is one specific energy leak driving this. No amount of rest, holidays, or willpower closes it without addressing the root.",
            lockedLabel: "Your Energy Leak Report + 30-Day Recovery Protocol",
            lockedTeaser:
                "We've pinpointed the single biggest drain in your mental energy based on your answers. Your full profile names it, and gives you the 30-day protocol our therapists use to close it.",
            tip: "When everything feels heavy: name 5 things you can see, 4 you can touch, 3 you can hear. This grounding technique interrupts a mental spiral within 60 seconds, not by solving the problem, but by returning you to the present.",
            tipLabel: "One thing worth trying this week",
            urgency: false,
        };
    return {
        typeName: "Critical Threshold Pattern",
        percentile: "Top 15% of high-distress cases, this needs attention",
        accentColor: "#a33030",
        accentLight: "rgba(163,48,48,0.07)",
        hook: "What you're experiencing is real, and it's unlikely to resolve without the right support.",
        cliffhanger:
            "Your responses place you in what we call a Critical Threshold state. People at this stage describe feeling like they're disappearing behind a functional exterior. Pushing through alone doesn't work, not because of weakness, but because of how the nervous system responds to sustained high-stress load.",
        lockedLabel: "Your Personal Crisis-to-Clarity Roadmap",
        lockedTeaser:
            "A licensed Mentel therapist has been flagged to review your profile directly. Your full report includes the first 3 steps specifically for your pattern, and a same-week session option.",
        tip: "Tell one person how you're actually feeling today, not the edited version. You don't need the right words. Just letting someone in creates a neurological shift that changes the trajectory of the day.",
        tipLabel: "One thing to do today, not tomorrow",
        urgency: true,
    };
}

// Therapist matched to each band
function getMatchedTherapist(score: number): TherapistProfile {
    return {
        name: "Oridupa Susan",
        title: "Clinical Psychologist",
        photo: "/yetunde.jpeg",
        specialty: "Resilience & Personal Growth",
        experience: "9 years",
        rating: 4.9,
        sessions: "1,200+",
        matchReason:
            "Specialises in proactive wellness and high-functioning clients who want to go from good to exceptional.",
    };
    // if (score <= 6)
    //     return {
    //         name: "Dr. Amara Osei",
    //         title: "Clinical Psychologist",
    //         photo: "/therapists/amara-osei.jpg",
    //         specialty: "Resilience & Personal Growth",
    //         experience: "9 years",
    //         rating: 4.9,
    //         sessions: "1,200+",
    //         matchReason:
    //             "Specialises in proactive wellness and high-functioning clients who want to go from good to exceptional.",
    //     };
    // if (score <= 12)
    //     return {
    //         name: "Chidi Nwosu",
    //         title: "Licensed Psychotherapist",
    //         photo: "/therapists/chidi-nwosu.jpg",
    //         specialty: "Stress & Burnout Recovery",
    //         experience: "7 years",
    //         rating: 4.8,
    //         sessions: "940+",
    //         matchReason:
    //             "Expert in cortisol regulation patterns and cognitive-behavioural approaches to sustained stress.",
    //     };
    // if (score <= 18)
    //     return {
    //         name: "Funmilayo Adeyemi",
    //         title: "Counselling Psychologist",
    //         photo: "/therapists/funmilayo-adeyemi.jpg",
    //         specialty: "Emotional Processing & Trauma",
    //         experience: "11 years",
    //         rating: 4.9,
    //         sessions: "1,500+",
    //         matchReason:
    //             "Highly experienced with functional freeze states and the gap between external performance and inner wellbeing.",
    //     };
    // return {
    //     name: "Dr. Emeka Okafor",
    //     title: "Consultant Psychiatrist",
    //     photo: "/therapists/emeka-okafor.jpg",
    //     specialty: "Crisis Intervention & Recovery",
    //     experience: "14 years",
    //     rating: 5.0,
    //     sessions: "2,000+",
    //     matchReason:
    //         "Leads our high-distress response team. Specialises in rapid stabilisation and compassionate crisis care.",
    // };
}

function buildWhatsAppUrl(score: number, name: string): string {
    const r = getResult(score);
    const num = "254734527573";
    const msgs: Record<string, string> = {
        "High Concern": "I need urgent support and would like to speak with a professional as soon as possible.",
        Thriving: "I'm interested in proactive therapy and building resilience.",
    };
    const note =
        msgs[r.band] ??
        "I'd like to discuss these results and see how therapy can help me.";
    return `https://wa.me/${num}?text=${encodeURIComponent(
        `Hello Mentel, I just completed my Private Wellness Assessment.\nName: *${name}*\nResult: *${r.band}*\n${note}`
    )}`;
}

// ── Nav (same pattern as AssessmentPage) ──────────────────────────────────────

// function ResultNav() {
//     const [menuOpen, setMenuOpen] = useState(false);
//     const [scrolled, setScrolled] = useState(false);

//     useEffect(() => {
//         const onScroll = () => setScrolled(window.scrollY > 12);
//         window.addEventListener("scroll", onScroll, { passive: true });
//         return () => window.removeEventListener("scroll", onScroll);
//     }, []);

//     return (
//         <nav
//             className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled
//                 ? "bg-[rgba(250,249,246,0.92)] backdrop-blur-[18px] shadow-[0_1px_0_rgba(28,40,36,0.08)]"
//                 : "bg-transparent"
//                 }`}
//             aria-label="Site navigation"
//         >
//             <div className="max-w-[1100px] mx-auto px-6 h-[68px] flex items-center justify-between">
//                 <Link href="/" className="flex items-center gap-2.5 no-underline" aria-label="Mentel — home">
//                     <div className="w-8 h-8 rounded-[10px] flex items-center justify-center overflow-hidden">
//                         <Image src="/logo-assessment.png" alt="Mentel logo" width={32} height={32} className="object-cover" />
//                     </div>
//                     <span className="font-['Cormorant_Garamond',Georgia,serif] text-[22px] font-semibold tracking-[-0.02em] text-[#1c2820]">
//                         Mentel
//                     </span>
//                 </Link>

//                 <div className="hidden md:flex items-center gap-8">
//                     {["About", "Services", "Articles", "Company"].map((item) => (
//                         <Link
//                             key={item}
//                             href={`/${item === "Company" ? "eap" : item.toLowerCase()}`}
//                             className="text-sm font-[450] text-[#4a5a52] no-underline tracking-[0.01em] hover:text-[#1c2820] transition-colors"
//                         >
//                             {item}
//                         </Link>
//                     ))}
//                     <Link
//                         href="/book"
//                         className="text-[13px] font-medium text-white bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] px-5 py-2.5 rounded-full no-underline shadow-[0_2px_12px_rgba(30,107,107,0.25)] hover:opacity-90 transition-opacity"
//                     >
//                         Book a session
//                     </Link>
//                 </div>

//                 <button
//                     type="button"
//                     onClick={() => setMenuOpen((v) => !v)}
//                     aria-label={menuOpen ? "Close menu" : "Open menu"}
//                     className="md:hidden bg-transparent border-0 cursor-pointer p-2 text-[#1c2820]"
//                 >
//                     {menuOpen ? <X size={22} /> : <Menu size={22} />}
//                 </button>
//             </div>

//             {menuOpen && (
//                 <div className="md:hidden bg-[rgba(250,249,246,0.98)] backdrop-blur-xl border-t border-[rgba(28,40,36,0.08)] px-6 pt-4 pb-6">
//                     {["About", "Services", "Therapists", "Articles"].map((item) => (
//                         <Link
//                             key={item}
//                             href={`/${item.toLowerCase()}`}
//                             className="block py-3 text-base text-[#1c2820] no-underline border-b border-[rgba(28,40,36,0.06)]"
//                             onClick={() => setMenuOpen(false)}
//                         >
//                             {item}
//                         </Link>
//                     ))}
//                     <Link
//                         href="/book"
//                         className="block mt-4 text-center text-sm font-medium text-white bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] py-3.5 px-5 rounded-full no-underline"
//                         onClick={() => setMenuOpen(false)}
//                     >
//                         Book a session
//                     </Link>
//                 </div>
//             )}
//         </nav>
//     );
// }

// ── Therapist Card ─────────────────────────────────────────────────────────────

function TherapistCard({
    therapist,
    accentColor,
    accentLight,
    whatsappUrl,
}: {
    therapist: TherapistProfile;
    accentColor: string;
    accentLight: string;
    whatsappUrl: string;
}) {
    return (
        <div
            className="rounded-[20px] overflow-hidden border mb-4"
            style={{
                borderColor: `${accentColor}22`,
                background: "white",
                boxShadow: "0 4px 24px rgba(28,40,36,0.06)",
            }}
        >
            {/* Top accent bar */}
            <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)` }} />

            <div className="p-6">
                {/* Label */}
                <p
                    className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-5"
                    style={{ color: accentColor }}
                >
                    Your matched therapist
                </p>

                {/* Profile row */}
                <div className="flex items-start gap-4 mb-5">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        <div
                            className="w-[72px] h-[72px] rounded-2xl overflow-hidden border-2"
                            style={{ borderColor: `${accentColor}30` }}
                        >
                            {/* Fallback initials avatar if photo not found */}
                            {/* <div
                                className="w-full h-full flex items-center justify-center text-xl font-semibold text-white"
                                style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)` }}
                            >
                                {therapist.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .slice(0, 2)
                                    .join("")}
                            </div> */}
                            {/* Uncomment below and remove div above once real photos are in /public/therapists/ */}

                            <Image
                                src={therapist.photo}
                                alt={therapist.name}
                                width={72}
                                height={72}
                                className="w-full h-full object-cover"
                            />

                        </div>

                        {/* Verified badge — bottom-right of avatar */}
                        <div
                            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-[0_1px_6px_rgba(28,40,36,0.15)]"
                            title="Licensed & verified by Mentel"
                        >
                            <BadgeCheck size={16} style={{ color: accentColor }} strokeWidth={2} fill={accentLight} />
                        </div>
                    </div>

                    {/* Name + title + specialty */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <h3 className="text-[17px] font-semibold text-[#1c2820] leading-tight">
                                {therapist.name}
                            </h3>
                            <span
                                className="text-[10px] font-semibold tracking-[0.06em] uppercase px-2 py-0.5 rounded-full"
                                style={{ background: accentLight, color: accentColor }}
                            >
                                Verified
                            </span>
                        </div>
                        <p className="text-[13px] text-[#5a6b5e] font-light mb-1">{therapist.title}</p>
                        <p
                            className="text-[12px] font-medium"
                            style={{ color: accentColor }}
                        >
                            {therapist.specialty}
                        </p>
                    </div>
                </div>

                {/* Stats row */}
                <div
                    className="grid grid-cols-3 gap-3 rounded-2xl p-4 mb-5"
                    style={{ background: accentLight }}
                >
                    {[
                        { label: "Experience", value: therapist.experience },
                        { label: "Sessions", value: therapist.sessions },
                        {
                            label: "Rating",
                            value: (
                                <span className="flex items-center gap-1 justify-center">
                                    <Star size={11} fill={accentColor} stroke="none" />
                                    {therapist.rating.toFixed(1)}
                                </span>
                            ),
                        },
                    ].map(({ label, value }) => (
                        <div key={label} className="text-center">
                            <div
                                className="font-['Cormorant_Garamond',Georgia,serif] text-[18px] font-medium leading-none mb-1 flex items-center justify-center"
                                style={{ color: accentColor }}
                            >
                                {value}
                            </div>
                            <div className="text-[10px] text-[#8a9a8e] uppercase tracking-[0.08em] font-medium">
                                {label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Match reason */}
                <div className="flex items-start gap-3 mb-5 p-3.5 rounded-xl bg-[#faf9f6] border border-[#e8ede9]">
                    <CheckCircle size={15} fill={accentColor} stroke="white" strokeWidth={2.5} className="flex-shrink-0 mt-0.5" />
                    <p className="text-[13px] font-light text-[#4a5a52] leading-[1.65] italic">
                        {therapist.matchReason}
                    </p>
                </div>

                {/* Book CTA */}
                <Link
                    // href={whatsappUrl}
                    href="/book"
                    // target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-[14px] px-6 rounded-full text-white text-[14px] font-medium font-['DM_Sans',sans-serif] no-underline transition-all hover:-translate-y-0.5"
                    style={{
                        background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                        boxShadow: `0 4px 18px ${accentColor}44`,
                    }}
                >
                    Book a session with {therapist.name.split(" ")[0]}
                    <ArrowRight size={14} strokeWidth={2} />
                </Link>
            </div>
        </div>
    );
}

// ── Main ResultPage ────────────────────────────────────────────────────────────

export default function ResultPage() {
    const router = useRouter();
    const [data, setData] = useState<ResultData | null>(null);
    const [hydrated, setHydrated] = useState(false);

    // The "analysing your results" sequence now runs on AssessmentPage,
    // right before navigation here. By the time someone lands on this page,
    // the wait is already done — so we render content immediately instead
    // of showing a second loading screen back to back with the first one.
    useEffect(() => {
        if (typeof window === "undefined") return;
        const raw = sessionStorage.getItem("mentel_assessment_result");
        if (!raw) {
            // No result data — send back to assessment
            router.replace("/assessment");
            return;
        }
        try {
            setData(JSON.parse(raw));
        } catch {
            router.replace("/assessment");
            return;
        }
        setHydrated(true);
    }, [router]);

    // useEffect(() => {
    //     if (typeof window !== "undefined" && (window as any).fbq) {
    //         (window as any).fbq('track', 'Lead');
    //     }
    // }, []);

    if (!hydrated || !data) return null;


    const { name, score } = data;
    const result = getResult(score);
    const intel = getBandIntel(score);
    const therapist = getMatchedTherapist(score);
    const isHigh = score > 18;
    const whatsappUrl = buildWhatsAppUrl(score, name);
    const totalQuestions = 8;

    return (
        <PageWrapper>
            <div className="min-h-screen bg-[#faf9f6] font-['DM_Sans',sans-serif]">
                {/* <ResultNav /> */}
                <style>{globalStyles}</style>

                <section className="pt-24 pb-20 px-6">
                    <div className="max-w-[600px] mx-auto" style={{ animation: "fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both" }}>

                        {/* ── Pattern banner ── */}
                        <div
                            className="rounded-3xl overflow-hidden mb-5 relative text-white px-8 py-10"
                            style={{ background: result.gradient }}
                        >
                            {/* Subtle radial overlays */}
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    backgroundImage:
                                        "radial-gradient(circle at 85% 15%, rgba(255,255,255,0.09) 0%, transparent 55%), radial-gradient(circle at 10% 85%, rgba(255,255,255,0.05) 0%, transparent 45%)",
                                }}
                            />
                            <div className="relative z-10">
                                <div className="inline-block bg-[rgba(255,255,255,0.14)] rounded-full px-4 py-1.5 text-[12px] mb-4 backdrop-blur-sm tracking-[0.02em]">
                                    {intel.percentile}
                                </div>
                                <div className="text-[10px] tracking-[0.14em] uppercase opacity-55 mb-2">Your pattern</div>
                                <h1 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(30px,6vw,44px)] font-light leading-[1.1] tracking-[-0.025em] mb-3">
                                    {intel.typeName}
                                </h1>
                                <div className="opacity-65 text-[13px] font-light">
                                    {result.band} · Score {score}/{totalQuestions * 3}
                                    {name ? ` · ${name}` : ""}
                                </div>
                            </div>
                        </div>

                        {/* ── Hook card ── */}
                        <div className="bg-white border border-[#e4e9e5] rounded-[20px] p-7 mb-4 shadow-[0_2px_16px_rgba(28,40,36,0.04)]">
                            <div
                                className="text-[10px] font-semibold tracking-[0.12em] uppercase mb-4"
                                style={{ color: intel.accentColor }}
                            >
                                What your results are telling us
                            </div>
                            <p className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(20px,4.5vw,27px)] font-light leading-[1.32] text-[#1c2820] mb-4">
                                {intel.hook}
                            </p>
                            <p className="text-[15px] font-light text-[#5a6b5e] leading-[1.78]">
                                {intel.cliffhanger}
                            </p>
                        </div>

                        {/* ── Therapist match card — placed here for maximum conversion impact ── */}
                        <TherapistCard
                            therapist={therapist}
                            accentColor={intel.accentColor}
                            accentLight={intel.accentLight}
                            whatsappUrl={whatsappUrl}
                        />

                        {/* ── Locked insight ── */}
                        <div
                            className="rounded-[20px] p-6 mb-4 relative overflow-hidden border"
                            style={{
                                background: intel.accentLight,
                                borderColor: `${intel.accentColor}22`,
                            }}
                        >
                            <div className="flex items-center gap-2.5 mb-4">
                                <div
                                    className="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center"
                                    style={{ background: `${intel.accentColor}18` }}
                                >
                                    <Lock size={13} stroke={intel.accentColor} strokeWidth={2} />
                                </div>
                                <span
                                    className="text-[10px] font-semibold tracking-[0.12em] uppercase"
                                    style={{ color: intel.accentColor }}
                                >
                                    {intel.lockedLabel}
                                </span>
                            </div>

                            <div className="relative">
                                <p
                                    className="text-[15px] font-light text-[#5a6b5e] leading-[1.78]"
                                    style={{ filter: "blur(5px)", userSelect: "none", pointerEvents: "none" }}
                                    aria-hidden="true"
                                >
                                    {intel.lockedTeaser}
                                </p>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span
                                        className="text-[13px] font-medium bg-white px-5 py-1.5 rounded-full border whitespace-nowrap shadow-[0_2px_14px_rgba(0,0,0,0.07)]"
                                        style={{ color: intel.accentColor, borderColor: `${intel.accentColor}28` }}
                                    >
                                        Revealed in your session
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* ── Tip card ── */}
                        <div className="bg-white border border-[#e4e9e5] rounded-[20px] p-6 mb-4 shadow-[0_1px_8px_rgba(28,40,36,0.03)]">
                            <div
                                className="text-[10px] font-semibold tracking-[0.12em] uppercase mb-4"
                                style={{ color: intel.accentColor }}
                            >
                                {intel.tipLabel}
                            </div>
                            <p className="text-[15px] font-light text-[#5a6b5e] leading-[1.78] mb-3.5">
                                {intel.tip}
                            </p>
                            <p className="text-[13px] font-medium" style={{ color: intel.accentColor }}>
                                Your full recovery protocol is covered in your first session.
                            </p>
                        </div>

                        {/* ── Urgency alert (high concern only) ── */}
                        {isHigh && (
                            <div className="bg-[#fff8f8] border border-[#f0b4b4] rounded-[20px] p-5 mb-4 flex gap-3.5">
                                <AlertTriangle size={17} stroke="#a33030" strokeWidth={2} className="flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#a33030] mb-2">
                                        If you are in immediate distress
                                    </p>
                                    <p className="text-sm font-light text-[#4a2020] leading-[1.72]">
                                        If you feel unsafe right now, please reach out to someone you trust or visit your nearest hospital. You matter, help is available immediately.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* ── Main CTA block ── */}
                        <div
                            className="rounded-3xl p-8 mb-5 border"
                            style={{ background: intel.accentLight, borderColor: `${intel.accentColor}18` }}
                        >
                            <h3 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(22px,4.5vw,28px)] font-light text-[#1c2820] leading-[1.28] mb-3">
                                A therapist matched to your pattern
                            </h3>
                            <p className="text-sm font-light text-[#5a6b5e] leading-[1.72] mb-7">
                                One 50-minute session, built around what your results showed. We'll explain your full pattern, name your specific triggers, and give you a concrete next step.
                            </p>
                            <div className="flex flex-col gap-3">
                                <Link
                                    href={whatsappUrl}
                                    // href="/book-call"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cta-btn flex items-center justify-center gap-2.5 py-[17px] px-7 rounded-full text-white text-[15px] font-medium font-['DM_Sans',sans-serif] no-underline"
                                    style={{
                                        background: `linear-gradient(135deg, ${intel.accentColor}, ${isHigh ? "#7a1f1f" : "#1e6b6b"})`,
                                        boxShadow: `0 6px 24px ${intel.accentColor}45`,
                                    }}
                                >
                                    {result.cta}
                                    <ArrowRight size={15} strokeWidth={2} />
                                </Link>
                                <Link
                                    href="/services"
                                    className="flex items-center justify-center gap-2 py-4 px-7 bg-white border-[1.5px] border-[#dce5df] text-[#3a4a3e] rounded-full no-underline text-[15px] font-[400] font-['DM_Sans',sans-serif] transition-all hover:border-[#2d7a5a] shadow-[0_1px_6px_rgba(28,40,36,0.05)]"
                                >
                                    View our services
                                </Link>
                            </div>
                        </div>

                        {/* ── What happens next ── */}
                        <div className="bg-[rgba(45,122,90,0.05)] border border-[rgba(45,122,90,0.14)] rounded-[20px] p-6 mb-6">
                            <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#2d7a5a] mb-5">
                                What happens next
                            </p>
                            <div className="flex flex-col gap-4">
                                {[
                                    "Check your email, your full results summary is on its way",
                                    "Check your spam folder if you don't see it within 2 minutes",
                                    "A therapist matched to your pattern will reach out within 24 hours",
                                ].map((item) => (
                                    <div key={item} className="flex items-start gap-3">
                                        <CheckCircle size={16} fill="#2d7a5a" stroke="white" strokeWidth={2.5} className="flex-shrink-0 mt-0.5" />
                                        <span className="text-sm font-light text-[#4a5a52] leading-[1.65]">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Privacy note ── */}
                        <div className="flex items-center justify-center gap-1.5 mb-5">
                            <Shield size={12} stroke="#a0aba3" strokeWidth={1.8} />
                            <p className="text-[12px] font-light text-[#a0aba3]">
                                Your results are private and never shared with third parties
                            </p>
                        </div>

                        <p className="text-center text-[12px] font-light text-[#a0aba3] leading-[1.7]">
                            If you're in crisis, please contact{" "}
                            <a href="tel:112" className="text-[#2d7a5a] underline underline-offset-[2px]">
                                emergency services
                            </a>
                            .
                        </p>
                    </div>
                </section>
            </div>
        </PageWrapper>
    );
}

// ── Global styles (inlined so the page is self-contained) ─────────────────────

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,450;9..40,500;9..40,600&display=swap');

  *, *::before, *::after { box-sizing: border-box; }
  body { font-family: 'DM Sans', -apple-system, sans-serif; background: #faf9f6; -webkit-font-smoothing: antialiased; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes spin { to { transform: rotate(360deg); } }

  .cta-btn { transition: all 0.22s cubic-bezier(0.22,1,0.36,1); }
  .cta-btn:hover { transform: translateY(-2px); filter: brightness(1.06); }
  .cta-btn:active { transform: translateY(0); }
`;