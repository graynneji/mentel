// "use client";

// // app/eap/assessment/page.tsx
// // Multi-domain EAP assessment — stress, anxiety, depression, sleep,
// // burnout, relationships (conditional), self-esteem, substance risk.
// // Personalized by relationship status. Shows social proof ("others feel this too").

// import { useState, useEffect, useRef } from "react";
// import {
//     Brain, Heart, Flame, Moon, Users, Star, Shield,
//     ChevronRight, ChevronLeft, CheckCircle, AlertTriangle,
//     Leaf, BarChart2, Lock, ArrowRight,
// } from "lucide-react";

// // ─── Types ───────────────────────────────────────────────────────────────────

// interface Option {
//     value: number;
//     label: string;
//     socialProof?: string; // "42% of employees feel this"
// }

// interface Question {
//     id: string;
//     domain: string;
//     text: string;
//     subtext?: string;
//     options: Option[];
//     conditional?: string; // only show if answer to this question id has value >= threshold
//     conditionalMin?: number;
// }

// interface Domain {
//     id: string;
//     title: string;
//     icon: React.ElementType;
//     color: string;
//     colorLight: string;
//     description: string;
// }

// // ─── Domain Config ────────────────────────────────────────────────────────────

// const DOMAINS: Domain[] = [
//     { id: "context", title: "About You", icon: Users, color: "#4e8c6a", colorLight: "rgba(78,140,106,0.12)", description: "Help us personalise your assessment" },
//     { id: "stress", title: "Stress", icon: Brain, color: "#3d8b8b", colorLight: "rgba(61,139,139,0.12)", description: "How pressure is affecting you" },
//     { id: "anxiety", title: "Anxiety", icon: Brain, color: "#7b6fa9", colorLight: "rgba(123,111,169,0.12)", description: "Worry, tension and physical symptoms" },
//     { id: "depression", title: "Low Mood", icon: Moon, color: "#4e7a5e", colorLight: "rgba(78,122,94,0.12)", description: "Energy, motivation and outlook" },
//     { id: "burnout", title: "Work & Burnout", icon: Flame, color: "#8b6e3d", colorLight: "rgba(139,110,61,0.12)", description: "Work pressure and exhaustion" },
//     { id: "sleep", title: "Sleep", icon: Moon, color: "#3d5e8b", colorLight: "rgba(61,94,139,0.12)", description: "Rest and recovery quality" },
//     { id: "relationships", title: "Relationships", icon: Heart, color: "#b94a4f", colorLight: "rgba(185,74,79,0.12)", description: "Personal and intimate connections" },
//     { id: "selfesteem", title: "Self & Identity", icon: Star, color: "#6e4e8b", colorLight: "rgba(110,78,139,0.12)", description: "Self-worth and confidence" },
// ];

// const SCALE_5 = (labels: [string, string, string, string, string], proofs: string[]): Option[] =>
//     labels.map((label, i) => ({ value: i, label, socialProof: proofs[i] }));

// // ─── Questions ────────────────────────────────────────────────────────────────

// const ALL_QUESTIONS: Question[] = [
//     // CONTEXT
//     {
//         id: "rel_status",
//         domain: "context",
//         text: "What best describes your current relationship status?",
//         subtext: "This helps us personalise questions about relationships and home life.",
//         options: [
//             { value: 0, label: "Single / not in a relationship", socialProof: "38% of respondents" },
//             { value: 1, label: "In a relationship (dating / partnered)", socialProof: "27% of respondents" },
//             { value: 2, label: "Married or in a civil partnership", socialProof: "29% of respondents" },
//             { value: 3, label: "Separated, divorced or widowed", socialProof: "6% of respondents" },
//         ],
//     },
//     {
//         id: "has_children",
//         domain: "context",
//         text: "Do you have children or dependants you care for?",
//         options: [
//             { value: 0, label: "No", socialProof: "45% of respondents" },
//             { value: 1, label: "Yes — it's manageable", socialProof: "33% of respondents" },
//             { value: 2, label: "Yes — it's quite demanding", socialProof: "22% of respondents" },
//         ],
//     },

//     // STRESS
//     {
//         id: "stress_freq",
//         domain: "stress",
//         text: "Over the past 2 weeks, how often have you felt overwhelmed or unable to cope?",
//         options: SCALE_5(
//             ["Never", "Rarely", "Sometimes", "Often", "Almost every day"],
//             ["11% of employees", "23% of employees", "34% of employees", "24% of employees", "8% of employees"]
//         ),
//     },
//     {
//         id: "stress_physical",
//         domain: "stress",
//         text: "How often do you experience physical signs of stress — headaches, tight chest, racing heart, or stomach problems?",
//         options: SCALE_5(
//             ["Never", "Rarely", "Sometimes", "Often", "Almost every day"],
//             ["15% of employees", "28% of employees", "31% of employees", "19% of employees", "7% of employees"]
//         ),
//     },
//     {
//         id: "stress_control",
//         domain: "stress",
//         text: "How much control do you feel you have over the stressors in your life right now?",
//         options: [
//             { value: 0, label: "A lot — I feel in control", socialProof: "14% feel this way" },
//             { value: 1, label: "Mostly in control, with some struggles", socialProof: "38% feel this way" },
//             { value: 2, label: "Partly — many things feel out of my hands", socialProof: "31% feel this way" },
//             { value: 3, label: "Very little — I feel powerless", socialProof: "17% feel this way" },
//         ],
//     },

//     // ANXIETY
//     {
//         id: "anxiety_worry",
//         domain: "anxiety",
//         text: "How often do you find yourself worrying excessively about things that may not happen?",
//         options: SCALE_5(
//             ["Never", "Rarely", "Sometimes", "Often", "Almost constantly"],
//             ["9% of employees", "21% of employees", "36% of employees", "25% of employees", "9% of employees"]
//         ),
//     },
//     {
//         id: "anxiety_restless",
//         domain: "anxiety",
//         text: "How often do you feel restless, keyed up, or on edge?",
//         options: SCALE_5(
//             ["Never", "Rarely", "Sometimes", "Often", "Almost every day"],
//             ["12% of employees", "26% of employees", "33% of employees", "21% of employees", "8% of employees"]
//         ),
//     },
//     {
//         id: "anxiety_avoidance",
//         domain: "anxiety",
//         text: "Do you avoid situations, places or conversations because they make you anxious?",
//         options: [
//             { value: 0, label: "No — I face things head-on", socialProof: "22% of employees" },
//             { value: 1, label: "Occasionally, for specific things", socialProof: "41% of employees" },
//             { value: 2, label: "Yes — I often avoid to prevent anxiety", socialProof: "27% of employees" },
//             { value: 3, label: "Yes — it significantly limits my life", socialProof: "10% of employees" },
//         ],
//     },
//     {
//         id: "anxiety_panic",
//         domain: "anxiety",
//         text: "In the past month, have you experienced sudden rushes of intense fear or discomfort (panic attacks)?",
//         options: [
//             { value: 0, label: "No", socialProof: "71% of employees" },
//             { value: 1, label: "Once or twice", socialProof: "17% of employees" },
//             { value: 2, label: "Several times", socialProof: "9% of employees" },
//             { value: 3, label: "Frequently — multiple times a week", socialProof: "3% of employees" },
//         ],
//     },

//     // DEPRESSION / LOW MOOD
//     {
//         id: "dep_interest",
//         domain: "depression",
//         text: "How often have you had little interest or pleasure in things you normally enjoy?",
//         options: SCALE_5(
//             ["Not at all", "Several days", "More than half the days", "Nearly every day", "Every day"],
//             ["23% of employees", "31% of employees", "22% of employees", "16% of employees", "8% of employees"]
//         ),
//     },
//     {
//         id: "dep_hopeless",
//         domain: "depression",
//         text: "How often have you felt hopeless about the future?",
//         options: SCALE_5(
//             ["Not at all", "Rarely", "Sometimes", "Often", "Almost constantly"],
//             ["29% of employees", "28% of employees", "24% of employees", "13% of employees", "6% of employees"]
//         ),
//     },
//     {
//         id: "dep_fatigue",
//         domain: "depression",
//         text: "How often do you feel so fatigued that even small tasks feel difficult?",
//         options: SCALE_5(
//             ["Not at all", "Several days", "More than half the days", "Nearly every day", "Every single day"],
//             ["17% of employees", "30% of employees", "26% of employees", "19% of employees", "8% of employees"]
//         ),
//     },
//     {
//         id: "dep_selfworth",
//         domain: "depression",
//         text: "How often have you felt worthless or excessively guilty about things?",
//         options: SCALE_5(
//             ["Not at all", "Rarely", "Sometimes", "Often", "Almost constantly"],
//             ["31% of employees", "27% of employees", "22% of employees", "14% of employees", "6% of employees"]
//         ),
//     },
//     {
//         id: "dep_thoughts",
//         domain: "depression",
//         text: "In the past two weeks, have you had thoughts of harming yourself or that you would be better off not being here?",
//         subtext: "Your answer is completely confidential and helps us ensure you get appropriate support.",
//         options: [
//             { value: 0, label: "No — not at all", socialProof: "84% of employees" },
//             { value: 1, label: "Fleeting thoughts, not acted on", socialProof: "10% of employees" },
//             { value: 2, label: "Yes, more than once", socialProof: "4% of employees" },
//             { value: 3, label: "Yes — I'm struggling with this now", socialProof: "2% of employees" },
//         ],
//     },

//     // BURNOUT
//     {
//         id: "burnout_exhaustion",
//         domain: "burnout",
//         text: "How often do you feel emotionally drained by your work?",
//         options: SCALE_5(
//             ["Never", "Rarely", "Sometimes", "Often", "Every single day"],
//             ["8% of employees", "19% of employees", "35% of employees", "27% of employees", "11% of employees"]
//         ),
//     },
//     {
//         id: "burnout_cynicism",
//         domain: "burnout",
//         text: "How often do you feel cynical or detached from your work and colleagues?",
//         options: SCALE_5(
//             ["Never", "Rarely", "Sometimes", "Often", "Almost always"],
//             ["11% of employees", "23% of employees", "33% of employees", "23% of employees", "10% of employees"]
//         ),
//     },
//     {
//         id: "burnout_effectiveness",
//         domain: "burnout",
//         text: "How often do you feel like you're not performing as well as you should, despite the effort you put in?",
//         options: SCALE_5(
//             ["Never — I feel effective", "Rarely", "Sometimes", "Often", "Almost always"],
//             ["9% of employees", "24% of employees", "36% of employees", "22% of employees", "9% of employees"]
//         ),
//     },
//     {
//         id: "burnout_boundary",
//         domain: "burnout",
//         text: "How easy is it for you to switch off from work during evenings and weekends?",
//         options: [
//             { value: 0, label: "Easy — I fully disconnect", socialProof: "12% of employees" },
//             { value: 1, label: "Mostly — I switch off with some effort", socialProof: "29% of employees" },
//             { value: 2, label: "Difficult — work follows me home", socialProof: "37% of employees" },
//             { value: 3, label: "Impossible — I'm always 'on'", socialProof: "22% of employees" },
//         ],
//     },

//     // SLEEP
//     {
//         id: "sleep_quality",
//         domain: "sleep",
//         text: "How would you rate your overall sleep quality over the past 2 weeks?",
//         options: [
//             { value: 0, label: "Very good — I sleep well", socialProof: "16% of employees" },
//             { value: 1, label: "Fairly good", socialProof: "33% of employees" },
//             { value: 2, label: "Fairly poor", socialProof: "31% of employees" },
//             { value: 3, label: "Very poor — I barely sleep", socialProof: "20% of employees" },
//         ],
//     },
//     {
//         id: "sleep_onset",
//         domain: "sleep",
//         text: "How often does it take you more than 30 minutes to fall asleep?",
//         options: SCALE_5(
//             ["Never", "Rarely", "Sometimes", "Often", "Almost every night"],
//             ["18% of employees", "25% of employees", "29% of employees", "19% of employees", "9% of employees"]
//         ),
//     },
//     {
//         id: "sleep_daytime",
//         domain: "sleep",
//         text: "How often does poor sleep affect your ability to concentrate or function during the day?",
//         options: SCALE_5(
//             ["Never", "Rarely", "Sometimes", "Often", "Every day"],
//             ["14% of employees", "24% of employees", "30% of employees", "22% of employees", "10% of employees"]
//         ),
//     },

//     // RELATIONSHIPS — shown to all, but deeper questions conditional on status
//     {
//         id: "rel_support",
//         domain: "relationships",
//         text: "How supported do you feel by the people in your personal life?",
//         options: [
//             { value: 0, label: "Very supported — I have strong connections", socialProof: "27% of employees" },
//             { value: 1, label: "Somewhat supported", socialProof: "38% of employees" },
//             { value: 2, label: "Limited support — I feel mostly alone", socialProof: "24% of employees" },
//             { value: 3, label: "Very isolated — I have no one to turn to", socialProof: "11% of employees" },
//         ],
//     },
//     {
//         id: "rel_conflict",
//         domain: "relationships",
//         text: "How often do conflicts in your personal relationships cause you distress?",
//         options: SCALE_5(
//             ["Never", "Rarely", "Sometimes", "Often", "Very frequently"],
//             ["19% of employees", "29% of employees", "30% of employees", "16% of employees", "6% of employees"]
//         ),
//         conditional: "rel_status",
//         conditionalMin: 0, // show for everyone
//     },

//     // MARRIAGE / PARTNERSHIP — only for rel_status >= 1 (in relationship)
//     {
//         id: "rel_partner_comm",
//         domain: "relationships",
//         text: "How well do you and your partner communicate when there are problems?",
//         subtext: "These questions only apply if you're currently in a relationship.",
//         options: [
//             { value: 0, label: "Very well — we talk openly", socialProof: "22% of partnered employees" },
//             { value: 1, label: "Usually well, with occasional breakdowns", socialProof: "36% of partnered employees" },
//             { value: 2, label: "Poorly — we often avoid difficult topics", socialProof: "28% of partnered employees" },
//             { value: 3, label: "Very poorly — communication has broken down", socialProof: "14% of partnered employees" },
//         ],
//         conditional: "rel_status",
//         conditionalMin: 1,
//     },
//     {
//         id: "rel_intimacy",
//         domain: "relationships",
//         text: "How satisfied are you with the level of emotional intimacy and closeness in your relationship?",
//         options: [
//             { value: 0, label: "Very satisfied", socialProof: "21% of partnered employees" },
//             { value: 1, label: "Mostly satisfied", socialProof: "33% of partnered employees" },
//             { value: 2, label: "Somewhat unsatisfied", socialProof: "29% of partnered employees" },
//             { value: 3, label: "Very unsatisfied — we feel like strangers", socialProof: "17% of partnered employees" },
//         ],
//         conditional: "rel_status",
//         conditionalMin: 1,
//     },
//     {
//         id: "rel_trust",
//         domain: "relationships",
//         text: "Is there anything in your relationship (such as infidelity, dishonesty, or past hurt) that is currently affecting your trust?",
//         options: [
//             { value: 0, label: "No — trust is solid", socialProof: "51% of partnered employees" },
//             { value: 1, label: "There have been issues but we're working on it", socialProof: "26% of partnered employees" },
//             { value: 2, label: "Yes — trust is significantly damaged", socialProof: "23% of partnered employees" },
//         ],
//         conditional: "rel_status",
//         conditionalMin: 1,
//     },

//     // MARRIAGE SPECIFIC — rel_status === 2
//     {
//         id: "rel_marriage_stress",
//         domain: "relationships",
//         text: "How much would you say your marriage is a source of stress in your life right now?",
//         options: [
//             { value: 0, label: "It's a source of strength and support", socialProof: "28% of married employees" },
//             { value: 1, label: "Neutral — not a major stressor", socialProof: "31% of married employees" },
//             { value: 2, label: "Mildly stressful", socialProof: "24% of married employees" },
//             { value: 3, label: "A significant source of stress or conflict", socialProof: "17% of married employees" },
//         ],
//         conditional: "rel_status",
//         conditionalMin: 2,
//     },
//     {
//         id: "rel_sex",
//         domain: "relationships",
//         text: "How satisfied are you with the physical intimacy in your relationship?",
//         subtext: "This is a sensitive but important aspect of wellbeing. Your answer is fully confidential.",
//         options: [
//             { value: 0, label: "Very satisfied", socialProof: "18% of married employees" },
//             { value: 1, label: "Mostly satisfied", socialProof: "29% of married employees" },
//             { value: 2, label: "Somewhat unsatisfied", socialProof: "31% of married employees" },
//             { value: 3, label: "Very unsatisfied or not active", socialProof: "22% of married employees" },
//         ],
//         conditional: "rel_status",
//         conditionalMin: 2,
//     },

//     // SELF-ESTEEM
//     {
//         id: "se_worth",
//         domain: "selfesteem",
//         text: "Overall, how positively do you feel about yourself?",
//         options: [
//             { value: 0, label: "Very positively — I feel good about who I am", socialProof: "18% of employees" },
//             { value: 1, label: "Mostly positive", socialProof: "37% of employees" },
//             { value: 2, label: "Mostly negative", socialProof: "30% of employees" },
//             { value: 3, label: "Very negatively — I don't like myself much", socialProof: "15% of employees" },
//         ],
//     },
//     {
//         id: "se_criticism",
//         domain: "selfesteem",
//         text: "How often is your inner voice harsh or highly critical of yourself?",
//         options: SCALE_5(
//             ["Never", "Rarely", "Sometimes", "Often", "Almost constantly"],
//             ["8% of employees", "19% of employees", "34% of employees", "27% of employees", "12% of employees"]
//         ),
//     },
//     {
//         id: "se_comparison",
//         domain: "selfesteem",
//         text: "How often do you compare yourself unfavourably to others and feel inadequate?",
//         options: SCALE_5(
//             ["Never", "Rarely", "Sometimes", "Often", "Almost constantly"],
//             ["10% of employees", "22% of employees", "36% of employees", "23% of employees", "9% of employees"]
//         ),
//     },
// ];

// // ─── Scoring ──────────────────────────────────────────────────────────────────

// function computeScores(answers: Record<string, number>, relStatus: number): Record<string, number> {
//     const domainQuestions: Record<string, string[]> = {
//         stress: ["stress_freq", "stress_physical", "stress_control"],
//         anxiety: ["anxiety_worry", "anxiety_restless", "anxiety_avoidance", "anxiety_panic"],
//         depression: ["dep_interest", "dep_hopeless", "dep_fatigue", "dep_selfworth", "dep_thoughts"],
//         burnout: ["burnout_exhaustion", "burnout_cynicism", "burnout_effectiveness", "burnout_boundary"],
//         sleep: ["sleep_quality", "sleep_onset", "sleep_daytime"],
//         relationships: relStatus >= 1
//             ? ["rel_support", "rel_conflict", "rel_partner_comm", "rel_intimacy", "rel_trust"]
//             : ["rel_support", "rel_conflict"],
//         selfesteem: ["se_worth", "se_criticism", "se_comparison"],
//     };
//     const maxPerQ: Record<string, number> = {
//         stress: 4, anxiety: 4, depression: 4, burnout: 4, sleep: 3, relationships: 3, selfesteem: 4,
//     };

//     const scores: Record<string, number> = {};
//     for (const [domain, qids] of Object.entries(domainQuestions)) {
//         const vals = qids.map(q => answers[q] ?? 0);
//         const maxPossible = vals.length * (maxPerQ[domain] ?? 4);
//         const raw = vals.reduce((s, v) => s + v, 0);
//         scores[domain] = Math.round((raw / maxPossible) * 100);
//     }
//     // Weighted composite
//     const weights = { stress: 1.2, anxiety: 1.2, depression: 1.5, burnout: 1.0, sleep: 0.8, relationships: 0.8, selfesteem: 0.8 };
//     const total = Object.entries(scores).reduce((s, [k, v]) => s + v * (weights[k as keyof typeof weights] ?? 1), 0);
//     const wSum = Object.values(weights).reduce((s, v) => s + v, 0);
//     scores.composite = Math.round(total / wSum);
//     return scores;
// }

// function getBand(composite: number): { band: string; color: string; bg: string; advice: string } {
//     if (composite < 20) return { band: "Low", color: "#4e8c6a", bg: "rgba(78,140,106,0.12)", advice: "Your wellbeing profile looks generally healthy. A few areas may benefit from proactive attention." };
//     if (composite < 40) return { band: "Mild", color: "#3d8b8b", bg: "rgba(61,139,139,0.12)", advice: "You're experiencing some challenges that are worth addressing before they intensify." };
//     if (composite < 60) return { band: "Moderate", color: "#8b6e3d", bg: "rgba(139,110,61,0.12)", advice: "Several domains are showing meaningful strain. Speaking with a therapist would be beneficial." };
//     if (composite < 80) return { band: "High", color: "#b94a4f", bg: "rgba(185,74,79,0.12)", advice: "You're under significant pressure across multiple areas. Professional support is strongly recommended." };
//     return { band: "Critical", color: "#8b1a1a", bg: "rgba(139,26,26,0.12)", advice: "Your results indicate a need for urgent professional support. Please connect with a therapist as soon as possible." };
// }

// // ─── Progress Bar ─────────────────────────────────────────────────────────────

// function ProgressBar({ current, total }: { current: number; total: number }) {
//     const pct = Math.round((current / total) * 100);
//     return (
//         <div className="w-full">
//             <div className="flex justify-between mb-1.5">
//                 <span className="text-xs font-medium" style={{ color: "var(--sage-dark)" }}>
//                     Question {current} of {total}
//                 </span>
//                 <span className="text-xs" style={{ color: "var(--text-muted)" }}>{pct}% complete</span>
//             </div>
//             <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(123,169,139,0.15)" }}>
//                 <div
//                     className="h-full rounded-full transition-all duration-500"
//                     style={{ width: `${pct}%`, background: "linear-gradient(90deg, var(--sage-dark), var(--teal))" }}
//                 />
//             </div>
//         </div>
//     );
// }

// // ─── Domain Badge ─────────────────────────────────────────────────────────────

// function DomainBadge({ domain }: { domain: Domain }) {
//     const Icon = domain.icon;
//     return (
//         <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border mb-4"
//             style={{ background: domain.colorLight, borderColor: `${domain.color}40`, color: domain.color }}>
//             <Icon size={11} />
//             {domain.title}
//         </div>
//     );
// }

// // ─── Option Card ─────────────────────────────────────────────────────────────

// function OptionCard({
//     option, selected, onSelect,
// }: { option: Option; selected: boolean; onSelect: () => void }) {
//     return (
//         <button
//             onClick={onSelect}
//             className="w-full text-left rounded-xl border px-4 py-3.5 transition-all duration-200 group"
//             style={{
//                 background: selected ? "rgba(61,139,139,0.08)" : "white",
//                 borderColor: selected ? "var(--teal)" : "var(--border)",
//                 boxShadow: selected ? "0 0 0 2px rgba(61,139,139,0.2)" : "none",
//             }}
//         >
//             <div className="flex items-start gap-3">
//                 <div
//                     className="w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all"
//                     style={{
//                         borderColor: selected ? "var(--teal)" : "var(--border)",
//                         background: selected ? "var(--teal)" : "transparent",
//                     }}
//                 >
//                     {selected && <div className="w-2 h-2 rounded-full bg-white" />}
//                 </div>
//                 <div className="flex-1">
//                     <p className="text-sm font-medium" style={{ color: "var(--deep)" }}>{option.label}</p>
//                     {option.socialProof && (
//                         <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
//                             <Users size={9} />
//                             {option.socialProof}
//                         </p>
//                     )}
//                 </div>
//             </div>
//         </button>
//     );
// }

// // ─── Results Page ─────────────────────────────────────────────────────────────

// function ResultsPage({ answers, scores }: { answers: Record<string, number>; scores: Record<string, number> }) {
//     const composite = scores.composite ?? 0;
//     const { band, color, bg, advice } = getBand(composite);
//     const hasCrisis = (answers.dep_thoughts ?? 0) >= 2;

//     const domainScores = Object.entries(scores)
//         .filter(([k]) => k !== "composite")
//         .sort(([, a], [, b]) => b - a);

//     return (
//         <div className="max-w-2xl mx-auto px-4 py-12">
//             <div className="text-center mb-8">
//                 <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4 border"
//                     style={{ background: "rgba(123,169,139,0.10)", borderColor: "rgba(123,169,139,0.25)", color: "var(--sage-dark)" }}>
//                     <CheckCircle size={11} />
//                     Assessment Complete
//                 </div>
//                 <h1 className="font-cormorant text-3xl sm:text-4xl font-light mb-3" style={{ color: "var(--deep)" }}>
//                     Your Wellbeing <em className="italic" style={{ color }}>Profile</em>
//                 </h1>
//                 <p className="text-sm" style={{ color: "var(--text-muted)", maxWidth: "380px", margin: "0 auto" }}>
//                     Based on your responses across 8 domains of wellbeing.
//                 </p>
//             </div>

//             {hasCrisis && (
//                 <div className="rounded-2xl p-5 mb-6 border-l-4" style={{ background: "rgba(185,74,79,0.06)", borderLeftColor: "#b94a4f", border: "1px solid rgba(185,74,79,0.25)" }}>
//                     <div className="flex items-start gap-3">
//                         <AlertTriangle size={18} style={{ color: "#b94a4f", flexShrink: 0, marginTop: 2 }} />
//                         <div>
//                             <p className="text-sm font-semibold mb-1" style={{ color: "#b94a4f" }}>We noticed you may be struggling</p>
//                             <p className="text-sm font-light" style={{ color: "var(--text-muted)" }}>
//                                 Your answers suggest you may be having difficult thoughts. Please know that support is available right now. A therapist will be in touch with you within hours. If you need immediate support, please call a crisis line.
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Overall band */}
//             <div className="rounded-2xl p-6 mb-6 text-center" style={{ background: bg, border: `1px solid ${color}40` }}>
//                 <div className="text-5xl font-bold mb-2" style={{ fontFamily: "var(--font-cormorant)", color }}>
//                     {band}
//                 </div>
//                 <div className="text-xs uppercase tracking-widest mb-3" style={{ color }}>Overall Risk Band</div>
//                 <div className="w-full rounded-full overflow-hidden mb-3" style={{ background: "rgba(255,255,255,0.4)", height: 8 }}>
//                     <div className="h-full rounded-full" style={{ width: `${composite}%`, background: color }} />
//                 </div>
//                 <p className="text-sm font-light" style={{ color: "var(--text-muted)", maxWidth: "400px", margin: "0 auto" }}>{advice}</p>
//             </div>

//             {/* Domain breakdown */}
//             <div className="bg-white rounded-2xl border mb-6 overflow-hidden" style={{ borderColor: "var(--border)" }}>
//                 <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
//                     <div className="flex items-center gap-2">
//                         <BarChart2 size={14} style={{ color: "var(--sage-dark)" }} />
//                         <span className="text-sm font-semibold" style={{ color: "var(--deep)" }}>Domain Breakdown</span>
//                     </div>
//                 </div>
//                 <div className="divide-y" style={{ borderColor: "var(--border)" }}>
//                     {domainScores.map(([domain, score]) => {
//                         const def = DOMAINS.find(d => d.id === domain);
//                         if (!def) return null;
//                         const Icon = def.icon;
//                         const { band: db } = getBand(score);
//                         const bandColors: Record<string, string> = { Low: "#4e8c6a", Mild: "#3d8b8b", Moderate: "#8b6e3d", High: "#b94a4f", Critical: "#8b1a1a" };
//                         const dc = bandColors[db] ?? "#8da898";
//                         return (
//                             <div key={domain} className="flex items-center gap-4 px-5 py-3">
//                                 <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
//                                     style={{ background: def.colorLight }}>
//                                     <Icon size={13} style={{ color: def.color }} />
//                                 </div>
//                                 <div className="flex-1">
//                                     <div className="flex justify-between mb-1">
//                                         <span className="text-xs font-medium" style={{ color: "var(--deep)" }}>{def.title}</span>
//                                         <span className="text-xs font-semibold" style={{ color: dc }}>{db}</span>
//                                     </div>
//                                     <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
//                                         <div className="h-full rounded-full transition-all duration-700"
//                                             style={{ width: `${score}%`, background: dc }} />
//                                     </div>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>

//             {/* Confidentiality note */}
//             <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6"
//                 style={{ background: "rgba(123,169,139,0.07)", border: "1px solid rgba(123,169,139,0.2)" }}>
//                 <Lock size={14} style={{ color: "var(--sage-dark)", flexShrink: 0 }} />
//                 <p className="text-xs font-light" style={{ color: "var(--text-muted)" }}>
//                     Your individual answers are never visible to your employer. Only anonymised, aggregated data is shared with your HR team.
//                 </p>
//             </div>

//             {/* CTA */}
//             <div className="text-center">
//                 <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
//                     A matched therapist will contact you within 24 hours to discuss your results and next steps.
//                 </p>
//                 <button
//                     className="inline-flex items-center gap-2 text-sm font-medium text-white px-7 py-3.5 rounded-full"
//                     style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
//                 >
//                     Done — I'll wait for my therapist
//                     <CheckCircle size={15} />
//                 </button>
//             </div>
//         </div>
//     );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────

// export default function EAPAssessmentPage() {
//     const [answers, setAnswers] = useState<Record<string, number>>({});
//     const [currentIdx, setCurrentIdx] = useState(0);
//     const [completed, setCompleted] = useState(false);
//     const [scores, setScores] = useState<Record<string, number>>({});
//     const topRef = useRef<HTMLDivElement>(null);

//     const relStatus = answers.rel_status ?? -1;

//     // Filter visible questions based on conditional logic
//     const visibleQuestions = ALL_QUESTIONS.filter(q => {
//         if (!q.conditional) return true;
//         const condAnswer = answers[q.conditional];
//         if (condAnswer === undefined) return false;
//         return condAnswer >= (q.conditionalMin ?? 0);
//     });

//     const current = visibleQuestions[currentIdx];
//     const totalQ = visibleQuestions.length;
//     const currentDomain = DOMAINS.find(d => d.id === current?.domain);
//     const isAnswered = current && answers[current.id] !== undefined;

//     const handleAnswer = (qid: string, value: number) => {
//         setAnswers(prev => ({ ...prev, [qid]: value }));
//     };

//     const handleNext = () => {
//         if (!isAnswered) return;
//         if (currentIdx >= visibleQuestions.length - 1) {
//             const finalScores = computeScores(answers, relStatus);
//             setScores(finalScores);
//             setCompleted(true);
//         } else {
//             setCurrentIdx(i => i + 1);
//             topRef.current?.scrollIntoView({ behavior: "smooth" });
//         }
//     };

//     const handleBack = () => {
//         if (currentIdx > 0) {
//             setCurrentIdx(i => i - 1);
//             topRef.current?.scrollIntoView({ behavior: "smooth" });
//         }
//     };

//     if (completed) {
//         return <ResultsPage answers={answers} scores={scores} />;
//     }

//     return (
//         <div className="min-h-screen" ref={topRef}>
//             {/* Header */}
//             <div className="sticky top-0 z-20 border-b px-4 py-4" style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderColor: "var(--border)" }}>
//                 <div className="max-w-2xl mx-auto">
//                     <div className="flex items-center gap-3 mb-3">
//                         <Leaf size={16} style={{ color: "var(--sage-dark)" }} />
//                         <span className="text-sm font-semibold" style={{ color: "var(--deep)" }}>EAP Wellbeing Assessment</span>
//                         <div className="ml-auto flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
//                             <Lock size={11} />
//                             Confidential
//                         </div>
//                     </div>
//                     <ProgressBar current={currentIdx + 1} total={totalQ} />
//                 </div>
//             </div>

//             <div className="max-w-2xl mx-auto px-4 py-8">
//                 {/* Domain label */}
//                 {currentDomain && <DomainBadge domain={currentDomain} />}

//                 {/* Question */}
//                 <div className="mb-6">
//                     <h2 className="font-cormorant text-2xl sm:text-3xl font-light mb-2" style={{ color: "var(--deep)", lineHeight: 1.3 }}>
//                         {current?.text}
//                     </h2>
//                     {current?.subtext && (
//                         <p className="text-xs mt-2 font-light italic" style={{ color: "var(--text-muted)" }}>
//                             {current.subtext}
//                         </p>
//                     )}
//                 </div>

//                 {/* Social proof banner */}
//                 <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-4 text-xs font-light"
//                     style={{ background: "rgba(123,169,139,0.07)", color: "var(--text-muted)" }}>
//                     <Users size={11} style={{ color: "var(--sage-dark)" }} />
//                     You&apos;re not alone — many employees across companies have felt similar things. There are no wrong answers.
//                 </div>

//                 {/* Options */}
//                 <div className="flex flex-col gap-2.5 mb-8">
//                     {current?.options.map(option => (
//                         <OptionCard
//                             key={option.value}
//                             option={option}
//                             selected={answers[current.id] === option.value}
//                             onSelect={() => handleAnswer(current.id, option.value)}
//                         />
//                     ))}
//                 </div>

//                 {/* Navigation */}
//                 <div className="flex items-center justify-between">
//                     <button
//                         onClick={handleBack}
//                         disabled={currentIdx === 0}
//                         className="flex items-center gap-1.5 text-sm px-4 py-2.5 rounded-full border transition-all disabled:opacity-30"
//                         style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
//                     >
//                         <ChevronLeft size={15} />
//                         Back
//                     </button>

//                     <button
//                         onClick={handleNext}
//                         disabled={!isAnswered}
//                         className="flex items-center gap-2 text-sm font-medium px-6 py-2.5 rounded-full text-white transition-all duration-200 disabled:opacity-40"
//                         style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
//                     >
//                         {currentIdx >= visibleQuestions.length - 1 ? "See My Results" : "Next"}
//                         <ChevronRight size={15} />
//                     </button>
//                 </div>

//                 {/* Reassurance */}
//                 <div className="mt-8 text-center">
//                     <p className="text-xs font-light" style={{ color: "var(--text-muted)" }}>
//                         <Shield size={10} style={{ display: "inline", marginRight: 4 }} />
//                         Your answers are encrypted and your employer sees only anonymised aggregate data — never your individual responses.
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// }

"use client";

// app/eap/assessment/page.tsx
// Multi-domain EAP assessment.
// On completion → POST to /api/eap/assessment → saves to DB → shows results from API response.

import { useState, useRef, useCallback } from "react";
import {
    Brain, Heart, Flame, Moon, Users, Star, Shield,
    ChevronRight, ChevronLeft, CheckCircle, AlertTriangle,
    Leaf, BarChart2, Lock, Loader2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Option {
    value: number;
    label: string;
    socialProof?: string;
}

interface Question {
    id: string;
    domain: string;
    text: string;
    subtext?: string;
    options: Option[];
    conditional?: string;
    conditionalMin?: number;
}

interface Domain {
    id: string;
    title: string;
    icon: React.ElementType;
    color: string;
    colorLight: string;
}

interface APIScores {
    stressScore: number;
    anxietyScore: number;
    depressionScore: number;
    burnoutScore: number;
    sleepScore: number;
    relationshipScore: number | null;
    selfEsteemScore: number;
    totalScore: number;
    riskBand: string;
    flags: string[];
}

interface Recommendation {
    type: string;
    title: string;
    description: string;
}

// ─── Domain config ────────────────────────────────────────────────────────────

const DOMAINS: Domain[] = [
    { id: "context", title: "About You", icon: Users, color: "#4e8c6a", colorLight: "rgba(78,140,106,0.12)" },
    { id: "stress", title: "Stress", icon: Brain, color: "#3d8b8b", colorLight: "rgba(61,139,139,0.12)" },
    { id: "anxiety", title: "Anxiety", icon: Brain, color: "#7b6fa9", colorLight: "rgba(123,111,169,0.12)" },
    { id: "depression", title: "Low Mood", icon: Moon, color: "#4e7a5e", colorLight: "rgba(78,122,94,0.12)" },
    { id: "burnout", title: "Work & Burnout", icon: Flame, color: "#8b6e3d", colorLight: "rgba(139,110,61,0.12)" },
    { id: "sleep", title: "Sleep", icon: Moon, color: "#3d5e8b", colorLight: "rgba(61,94,139,0.12)" },
    { id: "relationships", title: "Relationships", icon: Heart, color: "#b94a4f", colorLight: "rgba(185,74,79,0.12)" },
    { id: "selfesteem", title: "Self & Identity", icon: Star, color: "#6e4e8b", colorLight: "rgba(110,78,139,0.12)" },
];

const DOMAIN_MAP: Record<string, { title: string; color: string; colorLight: string; icon: React.ElementType }> =
    Object.fromEntries(DOMAINS.map(d => [d.id, d]));

const BAND_COLORS: Record<string, string> = {
    Low: "#4e8c6a", Mild: "#3d8b8b", Moderate: "#8b6e3d", High: "#b94a4f", Critical: "#8b1a1a",
};

const SCALE_5 = (labels: [string, string, string, string, string], proofs: string[]): Option[] =>
    labels.map((label, i) => ({ value: i, label, socialProof: proofs[i] }));

// ─── Questions (unchanged from original) ─────────────────────────────────────

const ALL_QUESTIONS: Question[] = [
    // CONTEXT
    {
        id: "rel_status", domain: "context",
        text: "What best describes your current relationship status?",
        subtext: "This helps us personalise questions about relationships and home life.",
        options: [
            { value: 0, label: "Single / not in a relationship", socialProof: "Around 4 in 10 people say this" },
            { value: 1, label: "In a relationship (dating / partnered)", socialProof: "About 1 in 4 people say this" },
            { value: 2, label: "Married or in a civil partnership", socialProof: "Around 3 in 10 people say this" },
            { value: 3, label: "Separated, divorced or widowed", socialProof: "About 1 in 16 people say this" },
        ],
    },
    {
        id: "has_children", domain: "context",
        text: "Do you have children or dependants you care for?",
        options: [
            { value: 0, label: "No", socialProof: "Nearly half of people say this" },
            { value: 1, label: "Yes — it's manageable", socialProof: "About 1 in 3 people say this" },
            { value: 2, label: "Yes — it's quite demanding", socialProof: "About 1 in 5 people say this" },
        ],
    },
    // STRESS
    {
        id: "stress_freq", domain: "stress",
        text: "Over the past 2 weeks, how often have you felt overwhelmed or unable to cope?",
        options: SCALE_5(
            ["Never", "Rarely", "Sometimes", "Often", "Almost every day"],
            ["1 in 9 people", "About 1 in 4", "1 in 3 people — you're not alone", "About 1 in 4", "1 in 12 people"],
        ),
    },
    {
        id: "stress_physical", domain: "stress",
        text: "How often do you experience physical signs of stress — headaches, tight chest, racing heart, or stomach problems?",
        options: SCALE_5(
            ["Never", "Rarely", "Sometimes", "Often", "Almost every day"],
            ["About 1 in 7", "More than 1 in 4", "Nearly 1 in 3", "About 1 in 5", "1 in 14 people"],
        ),
    },
    {
        id: "stress_control", domain: "stress",
        text: "How much control do you feel you have over the stressors in your life right now?",
        options: [
            { value: 0, label: "A lot — I feel in control", socialProof: "About 1 in 7 people feel this" },
            { value: 1, label: "Mostly in control, with some struggles", socialProof: "Nearly 2 in 5 people feel this" },
            { value: 2, label: "Partly — many things feel out of my hands", socialProof: "About 1 in 3 people feel this" },
            { value: 3, label: "Very little — I feel powerless", socialProof: "About 1 in 6 people feel this" },
        ],
    },
    // ANXIETY
    {
        id: "anxiety_worry", domain: "anxiety",
        text: "How often do you find yourself worrying excessively about things that may not happen?",
        options: SCALE_5(
            ["Never", "Rarely", "Sometimes", "Often", "Almost constantly"],
            ["About 1 in 11", "About 1 in 5", "More than 1 in 3 — very common", "1 in 4 people", "About 1 in 11"],
        ),
    },
    {
        id: "anxiety_restless", domain: "anxiety",
        text: "How often do you feel restless, keyed up, or on edge?",
        options: SCALE_5(
            ["Never", "Rarely", "Sometimes", "Often", "Almost every day"],
            ["About 1 in 8", "About 1 in 4", "1 in 3 people", "About 1 in 5", "1 in 12 people"],
        ),
    },
    {
        id: "anxiety_avoidance", domain: "anxiety",
        text: "Do you avoid situations, places or conversations because they make you anxious?",
        options: [
            { value: 0, label: "No — I face things head-on", socialProof: "About 1 in 5 people" },
            { value: 1, label: "Occasionally, for specific things", socialProof: "Nearly 2 in 5 people — very common" },
            { value: 2, label: "Yes — I often avoid to prevent anxiety", socialProof: "About 1 in 4 people" },
            { value: 3, label: "Yes — it significantly limits my life", socialProof: "About 1 in 10 people" },
        ],
    },
    {
        id: "anxiety_panic", domain: "anxiety",
        text: "In the past month, have you experienced sudden rushes of intense fear or discomfort (panic attacks)?",
        options: [
            { value: 0, label: "No", socialProof: "About 7 in 10 people" },
            { value: 1, label: "Once or twice", socialProof: "About 1 in 6 people" },
            { value: 2, label: "Several times", socialProof: "About 1 in 11 people" },
            { value: 3, label: "Frequently — multiple times a week", socialProof: "About 1 in 33 people" },
        ],
    },
    // DEPRESSION
    {
        id: "dep_interest", domain: "depression",
        text: "How often have you had little interest or pleasure in things you normally enjoy?",
        options: SCALE_5(
            ["Not at all", "Several days", "More than half the days", "Nearly every day", "Every day"],
            ["About 1 in 4", "Nearly 1 in 3 — you're not alone", "About 1 in 5", "About 1 in 6", "1 in 12 people"],
        ),
    },
    {
        id: "dep_hopeless", domain: "depression",
        text: "How often have you felt hopeless about the future?",
        options: SCALE_5(
            ["Not at all", "Rarely", "Sometimes", "Often", "Almost constantly"],
            ["About 3 in 10", "About 3 in 10", "About 1 in 4", "About 1 in 8", "1 in 17 people"],
        ),
    },
    {
        id: "dep_fatigue", domain: "depression",
        text: "How often do you feel so fatigued that even small tasks feel difficult?",
        options: SCALE_5(
            ["Not at all", "Several days", "More than half the days", "Nearly every day", "Every single day"],
            ["About 1 in 6", "About 3 in 10", "About 1 in 4", "About 1 in 5", "1 in 12 people"],
        ),
    },
    {
        id: "dep_selfworth", domain: "depression",
        text: "How often have you felt worthless or excessively guilty about things?",
        options: SCALE_5(
            ["Not at all", "Rarely", "Sometimes", "Often", "Almost constantly"],
            ["About 3 in 10", "About 3 in 10", "About 1 in 5", "About 1 in 7", "1 in 17 people"],
        ),
    },
    {
        id: "dep_thoughts", domain: "depression",
        text: "In the past two weeks, have you had thoughts of harming yourself or that you would be better off not being here?",
        subtext: "Your answer is completely confidential and helps us ensure you get the right support.",
        options: [
            { value: 0, label: "No — not at all", socialProof: "About 5 in 6 people" },
            { value: 1, label: "Fleeting thoughts, not acted on", socialProof: "About 1 in 10 people — please know support is here" },
            { value: 2, label: "Yes, more than once", socialProof: "About 1 in 25 people" },
            { value: 3, label: "Yes — I'm struggling with this now", socialProof: "About 1 in 50 people — you will hear from us very soon" },
        ],
    },
    // BURNOUT
    {
        id: "burnout_exhaustion", domain: "burnout",
        text: "How often do you feel emotionally drained by your work?",
        options: SCALE_5(
            ["Never", "Rarely", "Sometimes", "Often", "Every single day"],
            ["About 1 in 12", "About 1 in 5", "More than 1 in 3", "About 1 in 4", "About 1 in 9"],
        ),
    },
    {
        id: "burnout_cynicism", domain: "burnout",
        text: "How often do you feel cynical or detached from your work and colleagues?",
        options: SCALE_5(
            ["Never", "Rarely", "Sometimes", "Often", "Almost always"],
            ["About 1 in 9", "About 1 in 4", "1 in 3 people", "About 1 in 4", "About 1 in 10"],
        ),
    },
    {
        id: "burnout_effectiveness", domain: "burnout",
        text: "How often do you feel like you're not performing as well as you should, despite the effort you put in?",
        options: SCALE_5(
            ["Never — I feel effective", "Rarely", "Sometimes", "Often", "Almost always"],
            ["About 1 in 11", "About 1 in 4", "More than 1 in 3", "About 1 in 5", "About 1 in 11"],
        ),
    },
    {
        id: "burnout_boundary", domain: "burnout",
        text: "How easy is it for you to switch off from work during evenings and weekends?",
        options: [
            { value: 0, label: "Easy — I fully disconnect", socialProof: "About 1 in 8 people" },
            { value: 1, label: "Mostly — I switch off with some effort", socialProof: "About 3 in 10 people" },
            { value: 2, label: "Difficult — work follows me home", socialProof: "More than 1 in 3 — very common" },
            { value: 3, label: "Impossible — I'm always 'on'", socialProof: "About 1 in 5 people" },
        ],
    },
    // SLEEP
    {
        id: "sleep_quality", domain: "sleep",
        text: "How would you rate your overall sleep quality over the past 2 weeks?",
        options: [
            { value: 0, label: "Very good — I sleep well", socialProof: "About 1 in 6 people" },
            { value: 1, label: "Fairly good", socialProof: "About 1 in 3 people" },
            { value: 2, label: "Fairly poor", socialProof: "About 1 in 3 people" },
            { value: 3, label: "Very poor — I barely sleep", socialProof: "About 1 in 5 people" },
        ],
    },
    {
        id: "sleep_onset", domain: "sleep",
        text: "How often does it take you more than 30 minutes to fall asleep?",
        options: SCALE_5(
            ["Never", "Rarely", "Sometimes", "Often", "Almost every night"],
            ["About 1 in 6", "1 in 4 people", "About 3 in 10", "About 1 in 5", "About 1 in 11"],
        ),
    },
    {
        id: "sleep_daytime", domain: "sleep",
        text: "How often does poor sleep affect your ability to concentrate or function during the day?",
        options: SCALE_5(
            ["Never", "Rarely", "Sometimes", "Often", "Every day"],
            ["About 1 in 7", "About 1 in 4", "About 3 in 10", "About 1 in 5", "About 1 in 10"],
        ),
    },
    // RELATIONSHIPS
    {
        id: "rel_support", domain: "relationships",
        text: "How supported do you feel by the people in your personal life?",
        options: [
            { value: 0, label: "Very supported — I have strong connections", socialProof: "About 1 in 4 people" },
            { value: 1, label: "Somewhat supported", socialProof: "About 2 in 5 people" },
            { value: 2, label: "Limited support — I feel mostly alone", socialProof: "About 1 in 4 people" },
            { value: 3, label: "Very isolated — I have no one to turn to", socialProof: "About 1 in 9 people — you deserve support" },
        ],
    },
    {
        id: "rel_conflict", domain: "relationships",
        text: "How often do conflicts in your personal relationships cause you distress?",
        options: SCALE_5(
            ["Never", "Rarely", "Sometimes", "Often", "Very frequently"],
            ["About 1 in 5", "About 3 in 10", "About 3 in 10", "About 1 in 6", "About 1 in 17"],
        ),
        conditional: "rel_status", conditionalMin: 0,
    },
    // Partnership questions
    {
        id: "rel_partner_comm", domain: "relationships",
        text: "How well do you and your partner communicate when there are problems?",
        subtext: "These questions only apply if you're currently in a relationship.",
        options: [
            { value: 0, label: "Very well — we talk openly", socialProof: "About 1 in 5 couples" },
            { value: 1, label: "Usually well, with occasional breakdowns", socialProof: "More than 1 in 3 couples" },
            { value: 2, label: "Poorly — we often avoid difficult topics", socialProof: "About 3 in 10 couples" },
            { value: 3, label: "Very poorly — communication has broken down", socialProof: "About 1 in 7 couples" },
        ],
        conditional: "rel_status", conditionalMin: 1,
    },
    {
        id: "rel_intimacy", domain: "relationships",
        text: "How satisfied are you with the level of emotional intimacy and closeness in your relationship?",
        options: [
            { value: 0, label: "Very satisfied", socialProof: "About 1 in 5 people" },
            { value: 1, label: "Mostly satisfied", socialProof: "About 1 in 3 people" },
            { value: 2, label: "Somewhat unsatisfied", socialProof: "About 3 in 10 people" },
            { value: 3, label: "Very unsatisfied — we feel like strangers", socialProof: "About 1 in 6 people" },
        ],
        conditional: "rel_status", conditionalMin: 1,
    },
    {
        id: "rel_trust", domain: "relationships",
        text: "Is there anything in your relationship (such as infidelity, dishonesty, or past hurt) that is currently affecting your trust?",
        options: [
            { value: 0, label: "No — trust is solid", socialProof: "About half of people" },
            { value: 1, label: "There have been issues but we're working on it", socialProof: "About 1 in 4 people" },
            { value: 2, label: "Yes — trust is significantly damaged", socialProof: "About 1 in 4 people" },
        ],
        conditional: "rel_status", conditionalMin: 1,
    },
    // Marriage specific
    {
        id: "rel_marriage_stress", domain: "relationships",
        text: "How much would you say your marriage is a source of stress in your life right now?",
        options: [
            { value: 0, label: "It's a source of strength and support", socialProof: "About 3 in 10 married people" },
            { value: 1, label: "Neutral — not a major stressor", socialProof: "About 3 in 10 married people" },
            { value: 2, label: "Mildly stressful", socialProof: "About 1 in 4 married people" },
            { value: 3, label: "A significant source of stress or conflict", socialProof: "About 1 in 6 married people" },
        ],
        conditional: "rel_status", conditionalMin: 2,
    },
    {
        id: "rel_sex", domain: "relationships",
        text: "How satisfied are you with the physical intimacy in your relationship?",
        subtext: "This is a sensitive but important aspect of wellbeing. Your answer is fully confidential.",
        options: [
            { value: 0, label: "Very satisfied", socialProof: "About 1 in 5 people" },
            { value: 1, label: "Mostly satisfied", socialProof: "About 3 in 10 people" },
            { value: 2, label: "Somewhat unsatisfied", socialProof: "About 3 in 10 people" },
            { value: 3, label: "Very unsatisfied or not currently active", socialProof: "About 1 in 5 people" },
        ],
        conditional: "rel_status", conditionalMin: 2,
    },
    // SELF-ESTEEM
    {
        id: "se_worth", domain: "selfesteem",
        text: "Overall, how positively do you feel about yourself?",
        options: [
            { value: 0, label: "Very positively — I feel good about who I am", socialProof: "About 1 in 5 people" },
            { value: 1, label: "Mostly positive", socialProof: "About 2 in 5 people" },
            { value: 2, label: "Mostly negative", socialProof: "About 3 in 10 people" },
            { value: 3, label: "Very negatively — I don't like myself much", socialProof: "About 1 in 7 people" },
        ],
    },
    {
        id: "se_criticism", domain: "selfesteem",
        text: "How often is your inner voice harsh or highly critical of yourself?",
        options: SCALE_5(
            ["Never", "Rarely", "Sometimes", "Often", "Almost constantly"],
            ["About 1 in 12", "About 1 in 5", "About 1 in 3", "About 1 in 4", "About 1 in 8"],
        ),
    },
    {
        id: "se_comparison", domain: "selfesteem",
        text: "How often do you compare yourself unfavourably to others and feel inadequate?",
        options: SCALE_5(
            ["Never", "Rarely", "Sometimes", "Often", "Almost constantly"],
            ["About 1 in 10", "About 1 in 5", "More than 1 in 3", "About 1 in 4", "About 1 in 11"],
        ),
    },
];

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
    const pct = Math.round((current / total) * 100);
    return (
        <div className="w-full">
            <div className="flex justify-between mb-1.5">
                <span className="text-xs font-medium" style={{ color: "var(--sage-dark)" }}>
                    Question {current} of {total}
                </span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{pct}% complete</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(123,169,139,0.15)" }}>
                <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: "linear-gradient(90deg, var(--sage-dark), var(--teal))" }}
                />
            </div>
        </div>
    );
}

// ─── Option card ──────────────────────────────────────────────────────────────

function OptionCard({ option, selected, onSelect }: {
    option: Option; selected: boolean; onSelect: () => void;
}) {
    return (
        <button
            onClick={onSelect}
            className="w-full text-left rounded-xl border px-4 py-3.5 transition-all duration-150"
            style={{
                background: selected ? "rgba(61,139,139,0.08)" : "white",
                borderColor: selected ? "var(--teal)" : "var(--border)",
                boxShadow: selected ? "0 0 0 2px rgba(61,139,139,0.15)" : "none",
            }}
        >
            <div className="flex items-start gap-3">
                <div
                    className="w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all"
                    style={{
                        borderColor: selected ? "var(--teal)" : "var(--border)",
                        background: selected ? "var(--teal)" : "transparent",
                    }}
                >
                    {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: "var(--deep)" }}>{option.label}</p>
                    {option.socialProof && (
                        <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                            <Users size={9} />
                            {option.socialProof}
                        </p>
                    )}
                </div>
            </div>
        </button>
    );
}

// ─── Results page (uses API response scores) ──────────────────────────────────

function ResultsPage({
    scores,
    recommendations,
    hasCrisis,
}: {
    scores: APIScores;
    recommendations: Recommendation[];
    hasCrisis: boolean;
}) {
    const { totalScore, riskBand } = scores;
    const bandColor = BAND_COLORS[riskBand] ?? "#8da898";
    const bandBg = `${bandColor}18`;

    const bandAdvice: Record<string, string> = {
        Low: "Your wellbeing profile looks generally healthy. A few areas may benefit from proactive attention.",
        Mild: "You're experiencing some challenges worth addressing before they intensify.",
        Moderate: "Several domains are showing meaningful strain. Speaking with a therapist would be beneficial.",
        High: "You're under significant pressure across multiple areas. Professional support is strongly recommended.",
        Critical: "Your results indicate a need for urgent professional support. Please connect with a therapist as soon as possible.",
    };

    // const domainScores: { id: string; score: number | null }[] = [
    //     { id: "stress", score: scores.stressScore },
    //     { id: "anxiety", score: scores.anxietyScore },
    //     { id: "depression", score: scores.depressionScore },
    //     { id: "burnout", score: scores.burnoutScore },
    //     { id: "sleep", score: scores.sleepScore },
    //     { id: "relationships", score: scores.relationshipScore },
    //     { id: "selfesteem", score: scores.selfEsteemScore },
    // ].filter(d => d.score !== null) as { id: string; score: number }[];

    const domainScoresRaw = [
        { id: "stress", score: scores.stressScore },
        { id: "anxiety", score: scores.anxietyScore },
        { id: "depression", score: scores.depressionScore },
        { id: "burnout", score: scores.burnoutScore },
        { id: "sleep", score: scores.sleepScore },
        { id: "relationships", score: scores.relationshipScore },
        { id: "selfesteem", score: scores.selfEsteemScore },
    ];

    const domainScores = domainScoresRaw.filter(
        (d): d is { id: string; score: number } => d.score !== null
    );

    return (
        <div className="max-w-2xl mx-auto px-4 py-10 sm:py-12">
            {/* Header */}
            <div className="text-center mb-8">
                <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4 border"
                    style={{ background: "rgba(123,169,139,0.10)", borderColor: "rgba(123,169,139,0.25)", color: "var(--sage-dark)" }}
                >
                    <CheckCircle size={11} />
                    Assessment Complete
                </div>
                <h1 className="font-cormorant text-3xl sm:text-4xl font-light mb-2" style={{ color: "var(--deep)" }}>
                    Your Wellbeing{" "}
                    <em className="italic" style={{ color: bandColor }}>Profile</em>
                </h1>
                <p className="text-sm font-light" style={{ color: "var(--text-muted)" }}>
                    Based on your responses across 8 domains of wellbeing.
                </p>
            </div>

            {/* Crisis banner */}
            {hasCrisis && (
                <div
                    className="rounded-2xl p-5 mb-6 flex items-start gap-3"
                    style={{ background: "rgba(185,74,79,0.06)", border: "1px solid rgba(185,74,79,0.3)" }}
                >
                    <AlertTriangle size={18} style={{ color: "#b94a4f", flexShrink: 0, marginTop: 2 }} />
                    <div>
                        <p className="text-sm font-semibold mb-1" style={{ color: "#b94a4f" }}>
                            We noticed you may be struggling
                        </p>
                        <p className="text-sm font-light" style={{ color: "var(--text-muted)" }}>
                            Your answers suggest you may be having difficult thoughts. Support is on the way — a
                            therapist from our clinical team will contact you within hours. If you need someone
                            right now, please call the Mentally Aware Nigeria Initiative:{" "}
                            <strong>+234 808 210 6493</strong>.
                        </p>
                    </div>
                </div>
            )}

            {/* Overall band */}
            <div
                className="rounded-2xl p-6 mb-6 text-center"
                style={{ background: bandBg, border: `1px solid ${bandColor}30` }}
            >
                <div
                    className="text-5xl font-bold mb-1"
                    style={{ fontFamily: "var(--font-cormorant, Georgia)", color: bandColor }}
                >
                    {riskBand}
                </div>
                <div className="text-xs uppercase tracking-widest mb-3" style={{ color: bandColor }}>
                    Overall concern level
                </div>
                <div
                    className="w-full rounded-full overflow-hidden mb-3 mx-auto"
                    style={{ background: "rgba(255,255,255,0.5)", height: 8, maxWidth: 320 }}
                >
                    <div
                        className="h-full rounded-full"
                        style={{ width: `${totalScore}%`, background: bandColor }}
                    />
                </div>
                <p
                    className="text-sm font-light mx-auto"
                    style={{ color: "var(--text-muted)", maxWidth: 400 }}
                >
                    {bandAdvice[riskBand] ?? bandAdvice.Mild}
                </p>
            </div>

            {/* Domain breakdown */}
            <div
                className="bg-white rounded-2xl border mb-6 overflow-hidden"
                style={{ borderColor: "var(--border)" }}
            >
                <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: "var(--border)" }}>
                    <BarChart2 size={14} style={{ color: "var(--sage-dark)" }} />
                    <span className="text-sm font-semibold" style={{ color: "var(--deep)" }}>Domain Breakdown</span>
                </div>
                <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                    {domainScores
                        .sort((a, b) => b.score - a.score)
                        .map(({ id, score }) => {
                            const def = DOMAIN_MAP[id];
                            if (!def) return null;
                            const Icon = def.icon;
                            const level = score < 30 ? "Low" : score < 50 ? "Mild" : score < 70 ? "Moderate" : "High";
                            const dc = BAND_COLORS[level] ?? "#8da898";
                            return (
                                <div key={id} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3">
                                    <div
                                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                                        style={{ background: def.colorLight }}
                                    >
                                        <Icon size={13} style={{ color: def.color }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-xs font-medium" style={{ color: "var(--deep)" }}>{def.title}</span>
                                            <span className="text-xs font-semibold" style={{ color: dc }}>{level}</span>
                                        </div>
                                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                                            <div
                                                className="h-full rounded-full"
                                                style={{ width: `${score}%`, background: dc }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--deep)" }}>
                        Recommended for you
                    </h3>
                    <div className="space-y-2.5">
                        {recommendations.map((rec) => (
                            <div
                                key={rec.type}
                                className="flex items-start gap-3 px-4 py-3.5 rounded-xl border"
                                style={{ background: "white", borderColor: "var(--border)" }}
                            >
                                <CheckCircle size={14} style={{ color: "var(--sage-dark)", flexShrink: 0, marginTop: 2 }} />
                                <div>
                                    <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--deep)" }}>{rec.title}</p>
                                    <p className="text-xs font-light leading-relaxed" style={{ color: "var(--text-muted)" }}>
                                        {rec.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Confidentiality note */}
            <div
                className="flex items-start gap-3 px-4 py-3 rounded-xl mb-6"
                style={{ background: "rgba(123,169,139,0.07)", border: "1px solid rgba(123,169,139,0.2)" }}
            >
                <Lock size={13} style={{ color: "var(--sage-dark)", flexShrink: 0, marginTop: 2 }} />
                <p className="text-xs font-light" style={{ color: "var(--text-muted)" }}>
                    Your individual answers are <strong style={{ color: "var(--deep)" }}>never</strong> visible to
                    your employer. Your HR team sees only anonymised, aggregated data across all employees.
                </p>
            </div>

            {/* Next steps */}
            <div className="text-center">
                <p className="text-sm font-light mb-4" style={{ color: "var(--text-muted)" }}>
                    A matched therapist will contact you within 24 hours to discuss your results and schedule your first session.
                </p>
                <div
                    className="inline-flex items-center gap-2 text-sm font-medium text-white px-7 py-3.5 rounded-full"
                    style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                >
                    <CheckCircle size={15} />
                    Done — I'll wait for my therapist
                </div>
            </div>
        </div>
    );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function EAPAssessmentPage() {
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [currentIdx, setCurrentIdx] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [result, setResult] = useState<{
        scores: APIScores;
        recommendations: Recommendation[];
        hasCrisis: boolean;
    } | null>(null);
    const topRef = useRef<HTMLDivElement>(null);

    const relStatus = answers.rel_status ?? -1;

    const visibleQuestions = ALL_QUESTIONS.filter((q) => {
        if (!q.conditional) return true;
        const condAnswer = answers[q.conditional];
        if (condAnswer === undefined) return false;
        return condAnswer >= (q.conditionalMin ?? 0);
    });

    const current = visibleQuestions[currentIdx];
    const totalQ = visibleQuestions.length;
    const currentDomain = DOMAINS.find((d) => d.id === current?.domain);
    const isAnswered = current && answers[current.id] !== undefined;

    const handleAnswer = useCallback((qid: string, value: number) => {
        setAnswers((prev) => ({ ...prev, [qid]: value }));
    }, []);

    const submitToAPI = useCallback(async (finalAnswers: Record<string, number>) => {
        setSubmitting(true);
        setSubmitError("");
        try {
            const res = await fetch("/api/eap/assessment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    answers: finalAnswers,
                    relationshipStatus:
                        finalAnswers.rel_status === 0 ? "single"
                            : finalAnswers.rel_status === 1 ? "partnered"
                                : finalAnswers.rel_status === 2 ? "married"
                                    : finalAnswers.rel_status === 3 ? "separated"
                                        : undefined,
                    hasChildren: finalAnswers.has_children !== undefined
                        ? finalAnswers.has_children > 0
                        : undefined,
                }),
            });
            const data = await res.json();

            if (!res.ok || !data.success) {
                setSubmitError(data.error ?? "Failed to save your assessment. Please try again.");
                return;
            }

            setResult({
                scores: data.scores as APIScores,
                recommendations: (data.recommendations as Recommendation[]) ?? [],
                hasCrisis: (data.scores?.flags ?? []).includes("crisis") ||
                    (data.scores?.flags ?? []).includes("suicidal_ideation"),
            });
        } catch {
            setSubmitError("Connection error. Please check your internet and try again.");
        } finally {
            setSubmitting(false);
        }
    }, []);

    const handleNext = useCallback(() => {
        if (!isAnswered) return;
        if (currentIdx >= visibleQuestions.length - 1) {
            // Last question — submit to API
            submitToAPI(answers);
        } else {
            setCurrentIdx((i) => i + 1);
            topRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [isAnswered, currentIdx, visibleQuestions.length, answers, submitToAPI]);

    const handleBack = useCallback(() => {
        if (currentIdx > 0) {
            setCurrentIdx((i) => i - 1);
            topRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [currentIdx]);

    // Show results if API responded
    if (result) {
        return <ResultsPage {...result} />;
    }

    return (
        <div className="min-h-screen" ref={topRef}>
            {/* Sticky header */}
            <div
                className="sticky top-0 z-20 border-b px-4 py-3 sm:py-4"
                style={{
                    background: "rgba(255,255,255,0.96)",
                    backdropFilter: "blur(12px)",
                    borderColor: "var(--border)",
                }}
            >
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center gap-3 mb-2.5">
                        <Leaf size={15} style={{ color: "var(--sage-dark)" }} />
                        <span className="text-sm font-semibold" style={{ color: "var(--deep)" }}>
                            EAP Wellbeing Assessment
                        </span>
                        <div
                            className="ml-auto flex items-center gap-1.5 text-sm"
                            style={{ color: "var(--text-muted)" }}
                        >
                            <Lock size={11} />
                            Confidential
                        </div>
                    </div>
                    <ProgressBar current={currentIdx + 1} total={totalQ} />
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
                {/* Domain badge */}
                {currentDomain && (
                    <div
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border mb-4"
                        style={{
                            background: currentDomain.colorLight,
                            borderColor: `${currentDomain.color}40`,
                            color: currentDomain.color,
                        }}
                    >
                        <currentDomain.icon size={15} />
                        {currentDomain.title}
                    </div>
                )}

                {/* Question text */}
                <div className="mb-5 sm:mb-6">
                    <h2
                        className="font-cormorant text-2xl sm:text-3xl font-light mb-2"
                        style={{ color: "var(--deep)", lineHeight: 1.3 }}
                    >
                        {current?.text}
                    </h2>
                    {current?.subtext && (
                        <p className="text-[12px] font-light italic mt-1.5" style={{ color: "var(--text-muted)" }}>
                            {current.subtext}
                        </p>
                    )}
                </div>

                {/* Social proof */}
                <div
                    className="flex items-center gap-2 px-3 py-2 rounded-lg mb-4 text-[12px] font-normal"
                    style={{ background: "rgba(123,169,139,0.07)", color: "var(--text-muted)" }}
                >
                    <Users size={15} style={{ color: "var(--sage-dark)" }} />
                    You&apos;re not alone - many people feel exactly this way. There are no right or wrong answers.
                </div>

                {/* Options */}
                <div className="flex flex-col gap-2.5 mb-6 sm:mb-8">
                    {current?.options.map((option) => (
                        <OptionCard
                            key={`${current.id}-${option.label}`}
                            option={option}
                            selected={answers[current.id] === option.value}
                            onSelect={() => handleAnswer(current.id, option.value)}
                        />
                    ))}
                </div>

                {/* Submit error */}
                {submitError && (
                    <div
                        className="flex items-start gap-2 px-4 py-3 rounded-xl mb-4"
                        style={{ background: "rgba(185,74,79,0.06)", border: "1px solid rgba(185,74,79,0.25)" }}
                    >
                        <AlertTriangle size={14} style={{ color: "#b94a4f", flexShrink: 0, marginTop: 1 }} />
                        <p className="text-xs" style={{ color: "#b94a4f" }}>{submitError}</p>
                    </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        disabled={currentIdx === 0 || submitting}
                        className="flex items-center gap-1.5 text-sm px-4 py-2.5 rounded-full border transition-all disabled:opacity-30"
                        style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                    >
                        <ChevronLeft size={15} />
                        Back
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={!isAnswered || submitting}
                        className="flex items-center gap-2 text-sm font-medium px-6 py-2.5 rounded-full text-white transition-all disabled:opacity-40"
                        style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                    >
                        {submitting ? (
                            <><Loader2 size={15} className="animate-spin" /> Saving…</>
                        ) : currentIdx >= visibleQuestions.length - 1 ? (
                            <>See My Results <ChevronRight size={15} /></>
                        ) : (
                            <>Next <ChevronRight size={15} /></>
                        )}
                    </button>
                </div>

                {/* Reassurance */}
                <p
                    className="mt-6 sm:mt-8 text-center text-[12px] font-normal"
                    style={{ color: "var(--text-muted)" }}
                >
                    <Shield size={20} style={{ display: "inline", marginRight: 4 }} />
                    Your answers are encrypted. Your employer never sees your individual responses.
                </p>
            </div>
        </div>
    );
}