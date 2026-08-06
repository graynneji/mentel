

// // lib/adhd/pdf-report.tsx
// //
// // v2 redesign. The v1 report was well-written but read like "an article
// // split into pages", every page had the same layout, same card, same
// // typography, nothing made someone stop and think this looked like
// // something worth paying $19 for. This version varies the layout
// // page-to-page (a hero score page, a two-column profile page, a real
// // table, a real radar chart instead of a tiny four-point shape), adds
// // traffic-light severity coloring, and adds a dedicated disclaimer page,
// // while keeping every clinical-safety guardrail from v1 intact: nothing
// // here states or implies a diagnosis, a likelihood of ADHD, or a DSM
// // subtype. See lib/adhd/report-extras.ts for the reasoning on what was
// // deliberately left out.

// import React from "react";
// import { Document, Page, Text, View, StyleSheet, Font, Svg, Rect, Path, Circle } from "@react-pdf/renderer";
// import { AssessmentResult, Band, DomainResult, bandCopy } from "./scoring";
// import { domainStrategies, doctorSummaryIntro, reportDisclaimer } from "./report-content";
// import { domainInterpretations } from "./interpretations";
// import { challengesPool, doctorQuestions, buildRecommendations, describeConsistency, severityWord } from "./report-extras";
// import { Domain } from "./questions";

// // ── Fonts ─────────────────────────────────────────────────────────────────

// // Both families ship as variable-axis-only in the Google Fonts repo (no
// // static per-weight cuts), so @react-pdf/renderer resolves everything
// // against a single instance per family. If you want true multi-weight
// // rendering later, self-host static TTF cuts (e.g. via fontsource) in
// // /public/fonts and point these src values at your own domain instead.
// export function registerReportFonts() {
//   Font.register({
//     family: "Cormorant Garamond",
//     src: "https://raw.githubusercontent.com/google/fonts/main/ofl/cormorantgaramond/CormorantGaramond%5Bwght%5D.ttf",
//   });
//   Font.register({
//     family: "DM Sans",
//     src: "https://raw.githubusercontent.com/google/fonts/main/ofl/dmsans/DMSans%5Bopsz%2Cwght%5D.ttf",
//   });
// }

// // ── Brand tokens ──────────────────────────────────────────────────────────

// const brand = {
//   emerald: "#0E5C3D",
//   emeraldLight: "#e7f0eb",
//   ink: "#1c2820",
//   muted: "#5a6b5e",
//   faint: "#6a7a6e",
//   border: "#e4e9e5",
//   paper: "#fdfcfa",
// };

// const styles = StyleSheet.create({
//   page: {
//     fontFamily: "DM Sans",
//     fontSize: 10.5,
//     color: brand.ink,
//     backgroundColor: "#ffffff",
//     paddingTop: 56,
//     paddingBottom: 56,
//     paddingHorizontal: 52,
//   },
//   coverPage: {
//     fontFamily: "DM Sans",
//     backgroundColor: brand.emerald,
//     color: "#ffffff",
//     paddingHorizontal: 56,
//     paddingVertical: 72,
//     height: "100%",
//     justifyContent: "space-between",
//   },
//   h1: { fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 26, color: brand.ink, marginBottom: 4 },
//   h2: { fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 18, color: brand.ink, marginBottom: 10 },
//   eyebrow: { fontSize: 8.5, fontWeight: 600, letterSpacing: 1.2, color: brand.emerald, textTransform: "uppercase", marginBottom: 6 },
//   body: { fontSize: 10.5, color: brand.muted, lineHeight: 1.6 },
//   small: { fontSize: 8.5, color: brand.faint, lineHeight: 1.5 },
//   footer: {
//     position: "absolute",
//     bottom: 26,
//     left: 52,
//     right: 52,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     fontSize: 7.5,
//     color: brand.faint,
//     borderTopWidth: 0.5,
//     borderTopColor: brand.border,
//     paddingTop: 8,
//   },
//   card: {
//     borderWidth: 1,
//     borderColor: brand.border,
//     borderRadius: 6,
//     padding: 16,
//     backgroundColor: brand.paper,
//     marginBottom: 12,
//   },
// });

// // ── Shared bits ───────────────────────────────────────────────────────────

// function ReportFooter({ confidentialFor }: { confidentialFor: string }) {
//   return (
//     <View style={styles.footer} fixed>
//       <Text>Confidential, prepared for {confidentialFor}</Text>
//       <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
//     </View>
//   );
// }

// function SeverityBadge({ band, size = "md" }: { band: Band; size?: "sm" | "md" | "lg" }) {
//   const c = bandCopy[band];
//   const dims = size === "lg" ? { px: 16, py: 8, fs: 12 } : size === "sm" ? { px: 8, py: 3, fs: 8 } : { px: 12, py: 5, fs: 9.5 };
//   return (
//     <View style={{ backgroundColor: `${c.fill}1a`, borderColor: c.color, borderWidth: 1, borderRadius: 99, paddingHorizontal: dims.px, paddingVertical: dims.py, alignSelf: "flex-start" }}>
//       <Text style={{ color: c.color, fontSize: dims.fs, fontWeight: 600 }}>{c.label.replace(" difficulty", "")}</Text>
//     </View>
//   );
// }

// function StarRating({ count }: { count: number }) {
//   return (
//     <Svg width={70} height={12}>
//       {[0, 1, 2, 3, 4].map((i) => (
//         <Path
//           key={i}
//           d={starPath(7 + i * 14, 6, 5)}
//           fill={i < count ? brand.emerald : brand.border}
//         />
//       ))}
//     </Svg>
//   );
// }

// function starPath(cx: number, cy: number, r: number): string {
//   const points: string[] = [];
//   for (let i = 0; i < 10; i++) {
//     const angle = (Math.PI / 5) * i - Math.PI / 2;
//     const radius = i % 2 === 0 ? r : r * 0.42;
//     points.push(`${(cx + radius * Math.cos(angle)).toFixed(1)},${(cy + radius * Math.sin(angle)).toFixed(1)}`);
//   }
//   return `M${points.join(" L")} Z`;
// }

// function DomainBar({ label, percent, band }: { label: string; percent: number; band: Band }) {
//   const barWidth = 340;
//   const c = bandCopy[band];
//   return (
//     <View style={{ marginBottom: 10 }}>
//       <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 3 }}>
//         <Text style={{ fontSize: 9.5, color: brand.ink }}>{label}</Text>
//         <Text style={{ fontSize: 8.5, color: c.color, fontWeight: 600 }}>{percent}%</Text>
//       </View>
//       <Svg width={barWidth} height={7}>
//         <Rect x={0} y={0} width={barWidth} height={7} rx={3.5} fill={brand.border} />
//         <Rect x={0} y={0} width={(barWidth * percent) / 100} height={7} rx={3.5} fill={c.fill} />
//       </Svg>
//     </View>
//   );
// }

// // Full 6-axis radar chart, mirrors components/adhd/RadarChart.tsx on the
// // web (same axes, same visual language), rebuilt with react-pdf's Svg
// // primitives since the web version uses a plain <svg> DOM element that
// // can't be reused server-side. Replaces the old 4-point shape that
// // rendered as an unlabeled, illegible blob at small sizes.
// const RADAR_DOMAINS: { domain: Domain; label: string }[] = [
//   { domain: "attention", label: "Attention" },
//   { domain: "working_memory", label: "Memory" },
//   { domain: "executive_function", label: "Executive" },
//   { domain: "organisation", label: "Planning" },
//   { domain: "emotional_regulation", label: "Emotional Reg." },
//   { domain: "hyperactivity", label: "Hyperactivity" },
// ];

// function RadarChartPdf({ result, size = 260 }: { result: AssessmentResult; size?: number }) {
//   const center = size / 2;
//   const maxR = size * 0.34;
//   const labelR = size * 0.46;
//   const points = RADAR_DOMAINS.map(({ domain }) => result.domainResults.find((d) => d.domain === domain)?.percent ?? 0);
//   const n = points.length;
//   const angleFor = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;

//   const polygonPoints = points
//     .map((p, i) => {
//       const angle = angleFor(i);
//       const r = (Math.max(4, p) / 100) * maxR;
//       return `${(center + r * Math.cos(angle)).toFixed(1)},${(center + r * Math.sin(angle)).toFixed(1)}`;
//     })
//     .join(" L");

//   return (
//     <Svg width={size} height={size}>
//       {[0.33, 0.66, 1].map((f) => (
//         <Circle key={f} cx={center} cy={center} r={maxR * f} fill="none" stroke={brand.border} strokeWidth={0.75} />
//       ))}
//       {RADAR_DOMAINS.map((_, i) => {
//         const angle = angleFor(i);
//         return (
//           <Path
//             key={i}
//             d={`M${center},${center} L${(center + maxR * Math.cos(angle)).toFixed(1)},${(center + maxR * Math.sin(angle)).toFixed(1)}`}
//             stroke={brand.border}
//             strokeWidth={0.75}
//           />
//         );
//       })}
//       <Path d={`M${polygonPoints} Z`} fill={brand.emerald} fillOpacity={0.14} stroke={brand.emerald} strokeWidth={1.75} />
//       {points.map((p, i) => {
//         const angle = angleFor(i);
//         const r = (Math.max(4, p) / 100) * maxR;
//         return <Circle key={i} cx={center + r * Math.cos(angle)} cy={center + r * Math.sin(angle)} r={2.5} fill={brand.emerald} />;
//       })}
//       {RADAR_DOMAINS.map(({ label }, i) => {
//         const angle = angleFor(i);
//         const x = center + labelR * Math.cos(angle);
//         const y = center + labelR * Math.sin(angle);
//         return (
//           <Text key={label} x={x - 24} y={y - 4} style={{ fontSize: 7.5, fill: brand.muted }}>
//             {label}
//           </Text>
//         );
//       })}
//     </Svg>
//   );
// }

// // ── Main document ─────────────────────────────────────────────────────────

// export interface ReportProps {
//   name: string;
//   completionDate: string; // pre-formatted, e.g. "1 August 2026"
//   result: AssessmentResult;
// }

// export default function AdhdReportDocument({ name, completionDate, result }: ReportProps) {
//   const overall = bandCopy[result.overallBand];
//   const topChallenges = result.challenges.slice(0, 2);
//   const guidanceDomains = result.challenges.slice(0, 3).map((c) => c.domain);
//   const recommendations = buildRecommendations(result);
//   const consistency = describeConsistency(result);
//   const sortedByPercent = [...result.domainResults].sort((a, b) => b.percent - a.percent);

//   return (
//     <Document title={`Mentel ADHD Screening Report, ${name}`} author="Mentel LTD">
//       {/* 1. Cover */}
//       <Page size="A4" style={styles.coverPage}>
//         <View>
//           <Text style={{ fontFamily: "Cormorant Garamond", fontSize: 22, fontWeight: 600, marginBottom: 2 }}>Mentel</Text>
//           <Text style={{ fontSize: 8.5, letterSpacing: 1, opacity: 0.75 }}>MENTAL WELLNESS TECHNOLOGY</Text>
//         </View>
//         <View>
//           <Text style={{ fontSize: 9, letterSpacing: 1.5, opacity: 0.8, marginBottom: 10, textTransform: "uppercase" }}>
//             Educational ADHD Screening Report
//           </Text>
//           <Text style={{ fontFamily: "Cormorant Garamond", fontSize: 34, fontWeight: 500, lineHeight: 1.2, marginBottom: 18 }}>
//             Prepared for {name}
//           </Text>
//           <Text style={{ fontSize: 10, opacity: 0.85 }}>Completed on {completionDate}</Text>
//         </View>
//         <View>
//           <View style={{ height: 0.75, backgroundColor: "rgba(255,255,255,0.25)", marginBottom: 14 }} />
//           <Text style={{ fontSize: 8, opacity: 0.75, lineHeight: 1.6 }}>
//             Confidential. This document is intended solely for the individual named above. It contains an
//             educational self-assessment summary and does not constitute a medical diagnosis.
//           </Text>
//         </View>
//       </Page>

//       {/* 2. Contents */}
//       <Page size="A4" style={styles.page}>
//         <Text style={styles.eyebrow}>Contents</Text>
//         <Text style={styles.h1}>What's inside this report</Text>
//         <View style={{ marginTop: 12 }}>
//           {[
//             "Score Dashboard",
//             "Executive Summary",
//             "Your Profile",
//             "Clinical Interpretation",
//             "Domain Analysis",
//             "Executive Function Chart",
//             "Daily Life Insights",
//             "Personalised Action Plan",
//             "Questions for Your Clinician",
//             "Next Steps",
//             "Disclaimer",
//           ].map((section, i) => (
//             <View key={section} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 9, borderBottomWidth: 0.5, borderBottomColor: brand.border }}>
//               <Text style={{ fontSize: 9, color: brand.emerald, width: 22, fontWeight: 600 }}>{String(i + 1).padStart(2, "0")}</Text>
//               <Text style={{ fontSize: 11, color: brand.ink }}>{section}</Text>
//             </View>
//           ))}
//         </View>
//         <ReportFooter confidentialFor={name} />
//       </Page>

//       {/* 3. Score Dashboard — the hero page, deliberately spare and huge */}
//       <Page size="A4" style={[styles.page, { justifyContent: "center" }]}>
//         <Text style={styles.eyebrow}>Score dashboard</Text>
//         <Text style={styles.h1}>Your overall pattern score</Text>
//         <Text style={[styles.body, { marginBottom: 28, maxWidth: 380 }]}>
//           A single number summarising your responses across all eight domains, out of 100. Higher reflects more
//           frequent difficulty, not a likelihood of any diagnosis.
//         </Text>

//         <View style={{ flexDirection: "row", alignItems: "flex-end", marginBottom: 22 }}>
//           <Text style={{ fontFamily: "Cormorant Garamond", fontSize: 96, fontWeight: 500, color: brand.emerald, lineHeight: 1 }}>
//             {result.overallPercent}
//           </Text>
//           <Text style={{ fontSize: 20, color: brand.faint, marginBottom: 14, marginLeft: 4 }}>/ 100</Text>
//         </View>

//         <Svg width={400} height={10} style={{ marginBottom: 26 }}>
//           <Rect x={0} y={0} width={400} height={10} rx={5} fill={brand.border} />
//           <Rect x={0} y={0} width={(400 * result.overallPercent) / 100} height={10} rx={5} fill={overall.fill} />
//         </Svg>

//         <View style={{ flexDirection: "row", gap: 14 }}>
//           <ScoreStat label="Severity" value={severityWord(result.overallPercent)} accent={overall.color} />
//           <ScoreStat label="Pattern emphasis" value={result.leaningLabel.includes("attention") ? "Attention-leaning" : result.leaningLabel.includes("activity") ? "Activity-leaning" : "Mixed"} />
//           <ScoreStat label="Response pattern" value={consistency} />
//         </View>

//         <View style={[styles.card, { marginTop: 30, backgroundColor: brand.emeraldLight, borderColor: brand.emerald }]}>
//           <Text style={{ fontSize: 9.5, color: brand.emerald, lineHeight: 1.6, fontWeight: 500 }}>
//             This score reflects your self-reported responses only. It is not a diagnosis, a percentile, or a
//             likelihood of having ADHD. Only a qualified healthcare professional can make that determination.
//           </Text>
//         </View>
//         <ReportFooter confidentialFor={name} />
//       </Page>

//       {/* 4. Executive summary */}
//       <Page size="A4" style={styles.page}>
//         <Text style={styles.eyebrow}>Executive summary</Text>
//         <Text style={styles.h1}>Your overall pattern</Text>
//         <Text style={styles.body}>
//           Based on your responses across eight domains, your overall pattern falls in the range Mentel
//           describes as {overall.label.toLowerCase()}. {result.leaningLabel.charAt(0).toUpperCase() + result.leaningLabel.slice(1)}.
//         </Text>
//         <View style={[styles.card, { marginTop: 16 }]}>
//           <Text style={{ fontSize: 9.5, fontWeight: 600, marginBottom: 8 }}>At a glance</Text>
//           {sortedByPercent.slice(0, 3).map((d) => (
//             <View key={d.domain} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
//               <Text style={{ fontSize: 9.5, color: brand.ink }}>{d.label}</Text>
//               <SeverityBadge band={d.band} size="sm" />
//             </View>
//           ))}
//         </View>
//         <ReportFooter confidentialFor={name} />
//       </Page>

//       {/* 5. Your Profile — two-column: pattern emphasis + strengths/challenges */}
//       <Page size="A4" style={styles.page}>
//         <Text style={styles.eyebrow}>Your profile</Text>
//         <Text style={styles.h1}>How your responses pattern together</Text>
//         <Text style={[styles.body, { marginBottom: 18 }]}>
//           Not a subtype or diagnosis, just a plain-language summary of where your responses leaned.
//         </Text>

//         <View style={{ flexDirection: "row", gap: 14 }}>
//           <View style={{ flex: 1 }}>
//             <Text style={{ fontSize: 9.5, fontWeight: 600, color: brand.emerald, marginBottom: 8 }}>STRENGTHS</Text>
//             {result.strengths.map((s) => (
//               <View key={s.domain} style={{ flexDirection: "row", alignItems: "center", marginBottom: 7 }}>
//                 <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: brand.emerald, marginRight: 7 }} />
//                 <Text style={{ fontSize: 10, color: brand.ink }}>{s.label}</Text>
//               </View>
//             ))}
//           </View>
//           <View style={{ flex: 1 }}>
//             <Text style={{ fontSize: 9.5, fontWeight: 600, color: "#9c4f0d", marginBottom: 8 }}>CHALLENGES</Text>
//             {result.challenges.map((c) => (
//               <View key={c.domain} style={{ flexDirection: "row", alignItems: "center", marginBottom: 7 }}>
//                 <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: "#9c4f0d", marginRight: 7 }} />
//                 <Text style={{ fontSize: 10, color: brand.ink }}>{challengesPool[c.domain]}</Text>
//               </View>
//             ))}
//           </View>
//         </View>

//         <View style={[styles.card, { marginTop: 20 }]}>
//           <Text style={{ fontSize: 9.5, fontWeight: 600, marginBottom: 6 }}>Pattern emphasis</Text>
//           <Text style={styles.body}>
//             Your responses showed {result.leaningLabel}. This describes the shape of your answers, not a
//             clinical subtype, only a full evaluation can determine that.
//           </Text>
//         </View>
//         <ReportFooter confidentialFor={name} />
//       </Page>

//       {/* 6. Clinical interpretation */}
//       <Page size="A4" style={styles.page}>
//         <Text style={styles.eyebrow}>Clinical interpretation</Text>
//         <Text style={styles.h1}>Domain by domain</Text>
//         <Text style={[styles.body, { marginBottom: 14 }]}>
//           The interpretations below describe patterns in your responses, not a diagnosis. Only a qualified
//           healthcare professional can determine whether these relate to ADHD or another explanation.
//         </Text>
//         {result.domainResults.map((d) => (
//           <View key={d.domain} style={styles.card}>
//             <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
//               <Text style={{ fontSize: 10.5, fontWeight: 600, color: brand.emerald }}>{d.label}</Text>
//               <SeverityBadge band={d.band} size="sm" />
//             </View>
//             <Text style={styles.body}>{domainInterpretations[d.domain][d.band]}</Text>
//           </View>
//         ))}
//         <ReportFooter confidentialFor={name} />
//       </Page>

//       {/* 7. Domain analysis: bars + clinical summary table */}
//       <Page size="A4" style={styles.page}>
//         <Text style={styles.eyebrow}>Domain analysis</Text>
//         <Text style={styles.h1}>Symptom domain overview</Text>
//         <View style={[styles.card, { marginTop: 8 }]}>
//           {result.domainResults.map((d) => (
//             <DomainBar key={d.domain} label={d.label} percent={d.percent} band={d.band} />
//           ))}
//         </View>

//         <Text style={{ fontSize: 9.5, fontWeight: 600, color: brand.ink, marginTop: 6, marginBottom: 8 }}>Clinical summary table</Text>
//         <View style={{ borderWidth: 1, borderColor: brand.border, borderRadius: 6, overflow: "hidden" }}>
//           <View style={{ flexDirection: "row", backgroundColor: brand.emeraldLight, paddingVertical: 6, paddingHorizontal: 10 }}>
//             <Text style={{ flex: 2, fontSize: 8.5, fontWeight: 600, color: brand.emerald }}>DOMAIN</Text>
//             <Text style={{ flex: 1, fontSize: 8.5, fontWeight: 600, color: brand.emerald }}>SCORE</Text>
//             <Text style={{ flex: 1, fontSize: 8.5, fontWeight: 600, color: brand.emerald }}>SEVERITY</Text>
//           </View>
//           {result.domainResults.map((d, i) => (
//             <View
//               key={d.domain}
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 paddingVertical: 7,
//                 paddingHorizontal: 10,
//                 backgroundColor: i % 2 === 0 ? "#ffffff" : brand.paper,
//                 borderTopWidth: 0.5,
//                 borderTopColor: brand.border,
//               }}
//             >
//               <Text style={{ flex: 2, fontSize: 9, color: brand.ink }}>{d.label}</Text>
//               <Text style={{ flex: 1, fontSize: 9, color: brand.ink }}>{d.percent}%</Text>
//               <SeverityBadge band={d.band} size="sm" />
//             </View>
//           ))}
//         </View>
//         <ReportFooter confidentialFor={name} />
//       </Page>

//       {/* 8. Executive function radar chart, full page, centered */}
//       <Page size="A4" style={[styles.page, { alignItems: "center", justifyContent: "center" }]}>
//         <View style={{ position: "absolute", top: 56, left: 52 }}>
//           <Text style={styles.eyebrow}>Executive function chart</Text>
//           <Text style={styles.h1}>Your pattern across six domains</Text>
//         </View>
//         <RadarChartPdf result={result} size={300} />
//         <Text style={[styles.small, { marginTop: 20, maxWidth: 320, textAlign: "center" }]}>
//           Each axis reflects the percentage of maximum possible difficulty in that domain, based on your
//           responses. A larger shape indicates more domains showing frequent difficulty.
//         </Text>
//         <ReportFooter confidentialFor={name} />
//       </Page>

//       {/* 9. Daily life insights */}
//       <Page size="A4" style={styles.page}>
//         <Text style={styles.eyebrow}>Daily life insights</Text>
//         <Text style={styles.h1}>How this may show up day to day</Text>
//         <Text style={[styles.body, { marginBottom: 14 }]}>
//           {domainInterpretations.daily_impact[result.domainResults.find((d) => d.domain === "daily_impact")?.band ?? result.overallBand]}
//         </Text>
//         <View style={[styles.card, { backgroundColor: brand.emeraldLight, borderColor: brand.emerald }]}>
//           <Text style={{ fontSize: 9.5, color: brand.emerald, lineHeight: 1.6 }}>
//             Attention, memory, and energy difficulties don't only come from ADHD. Chronic stress, burnout,
//             anxiety, poor sleep, depression, and unresolved trauma can all produce very similar day-to-day
//             patterns, which is exactly why a conversation with a professional is the right next step.
//           </Text>
//         </View>
//         <View style={{ marginTop: 12 }}>
//           <Text style={{ fontSize: 10.5, fontWeight: 600, color: brand.ink, marginBottom: 8 }}>Where this showed up most in your responses</Text>
//           {topChallenges.map((c) => (
//             <View key={c.domain} style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 8 }}>
//               <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: brand.emerald, marginTop: 5, marginRight: 8 }} />
//               <Text style={[styles.body, { flex: 1 }]}>{c.label}</Text>
//             </View>
//           ))}
//         </View>
//         <ReportFooter confidentialFor={name} />
//       </Page>

//       {/* 10. Personalised action plan, now with priority stars */}
//       <Page size="A4" style={styles.page}>
//         <Text style={styles.eyebrow}>Personalised action plan</Text>
//         <Text style={styles.h1}>Recommended next steps, in priority order</Text>
//         <Text style={[styles.body, { marginBottom: 14 }]}>
//           Priority is based on how strongly the related domain showed up in your own responses, start with the
//           highest-priority item rather than all of them at once.
//         </Text>
//         {recommendations.map((r) => (
//           <View key={r.title} style={[styles.card, { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}>
//             <Text style={{ fontSize: 10.5, color: brand.ink, flex: 1 }}>{r.title}</Text>
//             <StarRating count={r.priorityStars} />
//           </View>
//         ))}

//         <Text style={{ fontSize: 10.5, fontWeight: 600, color: brand.ink, marginTop: 14, marginBottom: 10 }}>Practical strategies</Text>
//         {guidanceDomains.map((domain) => {
//           const label = result.domainResults.find((d) => d.domain === domain)?.label ?? "";
//           return (
//             <View key={domain} style={styles.card}>
//               <Text style={{ fontSize: 10, fontWeight: 600, color: brand.emerald, marginBottom: 5 }}>{label}</Text>
//               {domainStrategies[domain].slice(0, 2).map((s, i) => (
//                 <Text key={i} style={[styles.body, { marginBottom: 4, fontSize: 9.5 }]}>{"\u2022"} {s}</Text>
//               ))}
//             </View>
//           );
//         })}
//         <ReportFooter confidentialFor={name} />
//       </Page>

//       {/* 11. Doctor discussion summary, now with sample questions */}
//       <Page size="A4" style={styles.page}>
//         <Text style={styles.eyebrow}>For your healthcare provider</Text>
//         <Text style={styles.h1}>Questions for your clinician</Text>
//         <Text style={[styles.body, { marginBottom: 14 }]}>{doctorSummaryIntro}</Text>

//         <View style={styles.card}>
//           <Text style={{ fontSize: 9.5, fontWeight: 600, marginBottom: 8 }}>Summary of domain scores</Text>
//           {result.domainResults.map((d) => (
//             <View key={d.domain} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
//               <Text style={{ fontSize: 9.5, color: brand.ink }}>{d.label}</Text>
//               <SeverityBadge band={d.band} size="sm" />
//             </View>
//           ))}
//         </View>

//         <Text style={{ fontSize: 10.5, fontWeight: 600, color: brand.ink, marginTop: 12, marginBottom: 8 }}>Sample questions to bring with you</Text>
//         {doctorQuestions.map((q, i) => (
//           <View key={i} style={{ flexDirection: "row", marginBottom: 7 }}>
//             <Text style={{ fontSize: 9.5, color: brand.emerald, width: 16 }}>{i + 1}.</Text>
//             <Text style={[styles.body, { flex: 1, fontSize: 9.5 }]}>{q}</Text>
//           </View>
//         ))}
//         <ReportFooter confidentialFor={name} />
//       </Page>

//       {/* 12. Next steps / resources */}
//       <Page size="A4" style={styles.page}>
//         <Text style={styles.eyebrow}>Recommended resources</Text>
//         <Text style={styles.h1}>Next steps</Text>
//         <View style={styles.card}>
//           <Text style={{ fontSize: 10.5, fontWeight: 600, marginBottom: 6 }}>Talk to a licensed professional</Text>
//           <Text style={styles.body}>
//             If you would like to discuss this report or explore further evaluation, Mentel can connect you with
//             a licensed mental health professional for an initial session.
//           </Text>
//         </View>
//         <View style={styles.card}>
//           <Text style={{ fontSize: 10.5, fontWeight: 600, marginBottom: 6 }}>Keep learning</Text>
//           <Text style={styles.body}>
//             Visit trymentel.com/articles for further reading on attention, executive function, and daily
//             strategies grounded in current research.
//           </Text>
//         </View>
//         <Text style={[styles.small, { marginTop: 20 }]}>
//           Mentel LTD (RC 9116334). This report was generated on {completionDate} and reflects your responses at
//           that time. Copyright Mentel LTD, all rights reserved.
//         </Text>
//         <ReportFooter confidentialFor={name} />
//       </Page>

//       {/* 13. Disclaimer, dedicated final page */}
//       <Page size="A4" style={styles.page}>
//         <Text style={styles.eyebrow}>Disclaimer</Text>
//         <Text style={styles.h1}>Important information about this report</Text>
//         <View style={[styles.card, { marginTop: 10 }]}>
//           <Text style={styles.body}>{reportDisclaimer}</Text>
//         </View>
//         <Text style={[styles.body, { marginTop: 14 }]}>
//           This report was generated from your self-reported answers to an educational screening questionnaire.
//           It has not been reviewed by a clinician on an individual basis, and no clinician-patient relationship
//           is created by receiving it. The scores, charts, and language throughout describe patterns in your own
//           responses only, they are not measures of clinical severity, diagnostic likelihood, or risk, and they
//           have not been validated as a diagnostic instrument.
//         </Text>
//         <Text style={[styles.body, { marginTop: 10 }]}>
//           If you are experiencing distress, or if these patterns are significantly affecting your daily life,
//           please speak with a qualified healthcare professional. If you are in crisis, please contact your
//           local emergency services or a crisis helpline.
//         </Text>
//         <ReportFooter confidentialFor={name} />
//       </Page>
//     </Document>
//   );
// }

// function ScoreStat({ label, value, accent }: { label: string; value: string; accent?: string }) {
//   return (
//     <View style={{ flex: 1, borderWidth: 1, borderColor: brand.border, borderRadius: 8, padding: 12 }}>
//       <Text style={{ fontSize: 7.5, fontWeight: 600, letterSpacing: 0.8, color: brand.faint, textTransform: "uppercase", marginBottom: 4 }}>{label}</Text>
//       <Text style={{ fontSize: 12, fontWeight: 600, color: accent ?? brand.ink }}>{value}</Text>
//     </View>
//   );
// }

// lib/adhd/pdf-report.tsx
//
// v2 redesign. The v1 report was well-written but read like "an article
// split into pages", every page had the same layout, same card, same
// typography, nothing made someone stop and think this looked like
// something worth paying $19 for. This version varies the layout
// page-to-page (a hero score page, a two-column profile page, a real
// table, a real radar chart instead of a tiny four-point shape), adds
// traffic-light severity coloring, and adds a dedicated disclaimer page,
// while keeping every clinical-safety guardrail from v1 intact: nothing
// here states or implies a diagnosis, a likelihood of ADHD, or a DSM
// subtype. See lib/adhd/report-extras.ts for the reasoning on what was
// deliberately left out.

import React from "react";
import { Document, Page, Text, View, StyleSheet, Font, Svg, Rect, Path, Circle } from "@react-pdf/renderer";
import { AssessmentResult, Band, DomainResult, bandCopy } from "./scoring";
import { domainStrategies, doctorSummaryIntro, reportDisclaimer } from "./report-content";
import { domainInterpretations } from "./interpretations";
import { challengesPool, doctorQuestions, buildRecommendations, describeConsistency, severityWord } from "./report-extras";
import { Domain } from "./questions";

// ── Fonts ─────────────────────────────────────────────────────────────────

// Both families ship as variable-axis-only in the Google Fonts repo (no
// static per-weight cuts), so @react-pdf/renderer resolves everything
// against a single instance per family. If you want true multi-weight
// rendering later, self-host static TTF cuts (e.g. via fontsource) in
// /public/fonts and point these src values at your own domain instead.
export function registerReportFonts() {
  Font.register({
    family: "Cormorant Garamond",
    src: "https://raw.githubusercontent.com/google/fonts/main/ofl/cormorantgaramond/CormorantGaramond%5Bwght%5D.ttf",
  });
  Font.register({
    family: "DM Sans",
    src: "https://raw.githubusercontent.com/google/fonts/main/ofl/dmsans/DMSans%5Bopsz%2Cwght%5D.ttf",
  });
}

// ── Brand tokens ──────────────────────────────────────────────────────────

const brand = {
  emerald: "#0E5C3D",
  emeraldLight: "#e7f0eb",
  ink: "#1c2820",
  muted: "#5a6b5e",
  faint: "#6a7a6e",
  border: "#e4e9e5",
  paper: "#fdfcfa",
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "DM Sans",
    fontSize: 10.5,
    color: brand.ink,
    backgroundColor: "#ffffff",
    paddingTop: 56,
    paddingBottom: 56,
    paddingHorizontal: 52,
  },
  coverPage: {
    fontFamily: "DM Sans",
    backgroundColor: brand.emerald,
    color: "#ffffff",
    paddingHorizontal: 56,
    paddingVertical: 72,
    height: "100%",
    justifyContent: "space-between",
  },
  h1: { fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 26, color: brand.ink, marginBottom: 4 },
  h2: { fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: 18, color: brand.ink, marginBottom: 10 },
  eyebrow: { fontSize: 8.5, fontWeight: 600, letterSpacing: 1.2, color: brand.emerald, textTransform: "uppercase", marginBottom: 6 },
  body: { fontSize: 10.5, color: brand.muted, lineHeight: 1.6 },
  small: { fontSize: 8.5, color: brand.faint, lineHeight: 1.5 },
  footer: {
    position: "absolute",
    bottom: 26,
    left: 52,
    right: 52,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7.5,
    color: brand.faint,
    borderTopWidth: 0.5,
    borderTopColor: brand.border,
    paddingTop: 8,
  },
  card: {
    borderWidth: 1,
    borderColor: brand.border,
    borderRadius: 6,
    padding: 16,
    backgroundColor: brand.paper,
    marginBottom: 12,
  },
});

// ── Shared bits ───────────────────────────────────────────────────────────

function ReportFooter({ confidentialFor }: { confidentialFor: string }) {
  return (
    <View style={styles.footer} fixed>
      <Text>Confidential, prepared for {confidentialFor}</Text>
      <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
    </View>
  );
}

function SeverityBadge({ band, size = "md" }: { band: Band; size?: "sm" | "md" | "lg" }) {
  const c = bandCopy[band];
  const dims = size === "lg" ? { px: 16, py: 8, fs: 12 } : size === "sm" ? { px: 8, py: 3, fs: 8 } : { px: 12, py: 5, fs: 9.5 };
  return (
    <View style={{ backgroundColor: `${c.fill}1a`, borderColor: c.color, borderWidth: 1, borderRadius: 99, paddingHorizontal: dims.px, paddingVertical: dims.py, alignSelf: "flex-start" }}>
      <Text style={{ color: c.color, fontSize: dims.fs, fontWeight: 600 }}>{c.label.replace(" difficulty", "")}</Text>
    </View>
  );
}

function StarRating({ count }: { count: number }) {
  return (
    <Svg width={70} height={12}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Path
          key={i}
          d={starPath(7 + i * 14, 6, 5)}
          fill={i < count ? brand.emerald : brand.border}
        />
      ))}
    </Svg>
  );
}

function starPath(cx: number, cy: number, r: number): string {
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const radius = i % 2 === 0 ? r : r * 0.42;
    points.push(`${(cx + radius * Math.cos(angle)).toFixed(1)},${(cy + radius * Math.sin(angle)).toFixed(1)}`);
  }
  return `M${points.join(" L")} Z`;
}

function DomainBar({ label, percent, band }: { label: string; percent: number; band: Band }) {
  const barWidth = 340;
  const c = bandCopy[band];
  return (
    <View style={{ marginBottom: 10 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 3 }}>
        <Text style={{ fontSize: 9.5, color: brand.ink }}>{label}</Text>
        <Text style={{ fontSize: 8.5, color: c.color, fontWeight: 600 }}>{percent}%</Text>
      </View>
      <Svg width={barWidth} height={7}>
        <Rect x={0} y={0} width={barWidth} height={7} rx={3.5} fill={brand.border} />
        <Rect x={0} y={0} width={(barWidth * percent) / 100} height={7} rx={3.5} fill={c.fill} />
      </Svg>
    </View>
  );
}

// Full 6-axis radar chart, mirrors components/adhd/RadarChart.tsx on the
// web (same axes, same visual language), rebuilt with react-pdf's Svg
// primitives since the web version uses a plain <svg> DOM element that
// can't be reused server-side. Replaces the old 4-point shape that
// rendered as an unlabeled, illegible blob at small sizes.
const RADAR_DOMAINS: { domain: Domain; label: string }[] = [
  { domain: "attention", label: "Attention" },
  { domain: "working_memory", label: "Memory" },
  { domain: "executive_function", label: "Executive" },
  { domain: "organisation", label: "Planning" },
  { domain: "emotional_regulation", label: "Emotional Reg." },
  { domain: "hyperactivity", label: "Hyperactivity" },
];

function RadarChartPdf({ result, size = 260 }: { result: AssessmentResult; size?: number }) {
  const center = size / 2;
  const maxR = size * 0.34;
  const labelR = size * 0.46;
  const points = RADAR_DOMAINS.map(({ domain }) => result.domainResults.find((d) => d.domain === domain)?.percent ?? 0);
  const n = points.length;
  const angleFor = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;

  const polygonPoints = points
    .map((p, i) => {
      const angle = angleFor(i);
      const r = (Math.max(4, p) / 100) * maxR;
      return `${(center + r * Math.cos(angle)).toFixed(1)},${(center + r * Math.sin(angle)).toFixed(1)}`;
    })
    .join(" L");

  return (
    <Svg width={size} height={size}>
      {[0.33, 0.66, 1].map((f) => (
        <Circle key={f} cx={center} cy={center} r={maxR * f} fill="none" stroke={brand.border} strokeWidth={0.75} />
      ))}
      {RADAR_DOMAINS.map((_, i) => {
        const angle = angleFor(i);
        return (
          <Path
            key={i}
            d={`M${center},${center} L${(center + maxR * Math.cos(angle)).toFixed(1)},${(center + maxR * Math.sin(angle)).toFixed(1)}`}
            stroke={brand.border}
            strokeWidth={0.75}
          />
        );
      })}
      <Path d={`M${polygonPoints} Z`} fill={brand.emerald} fillOpacity={0.14} stroke={brand.emerald} strokeWidth={1.75} />
      {points.map((p, i) => {
        const angle = angleFor(i);
        const r = (Math.max(4, p) / 100) * maxR;
        return <Circle key={i} cx={center + r * Math.cos(angle)} cy={center + r * Math.sin(angle)} r={2.5} fill={brand.emerald} />;
      })}
      {RADAR_DOMAINS.map(({ label }, i) => {
        const angle = angleFor(i);
        const x = center + labelR * Math.cos(angle);
        const y = center + labelR * Math.sin(angle);
        return (
          <Text key={label} x={x - 24} y={y - 4} style={{ fontSize: 7.5, fill: brand.muted }}>
            {label}
          </Text>
        );
      })}
    </Svg>
  );
}

// ── Main document ─────────────────────────────────────────────────────────

export interface ReportProps {
  name: string;
  completionDate: string; // pre-formatted, e.g. "1 August 2026"
  result: AssessmentResult;
}

export default function AdhdReportDocument({ name, completionDate, result }: ReportProps) {
  const overall = bandCopy[result.overallBand];
  const sortedByPercent = [...result.domainResults].sort((a, b) => b.percent - a.percent);
  // result.challenges only includes domains that are genuinely
  // moderate/significant (see scoring.ts), which can legitimately be empty
  // for a low-difficulty profile. Fall back to the highest-scoring domains
  // regardless of band so these two pages always have something to show,
  // rather than rendering a heading with nothing underneath it.
  const topChallenges = result.challenges.length > 0 ? result.challenges.slice(0, 2) : sortedByPercent.slice(0, 2);
  const guidanceDomains = (result.challenges.length > 0 ? result.challenges.slice(0, 3) : sortedByPercent.slice(0, 3)).map((c) => c.domain);
  const recommendations = buildRecommendations(result);
  const consistency = describeConsistency(result);

  return (
    <Document title={`Mentel ADHD Screening Report, ${name}`} author="Mentel LTD">
      {/* 1. Cover */}
      <Page size="A4" style={styles.coverPage}>
        <View>
          <Text style={{ fontFamily: "Cormorant Garamond", fontSize: 22, fontWeight: 600, marginBottom: 2 }}>Mentel</Text>
          <Text style={{ fontSize: 8.5, letterSpacing: 1, opacity: 0.75 }}>MENTAL WELLNESS TECHNOLOGY</Text>
        </View>
        <View>
          <Text style={{ fontSize: 9, letterSpacing: 1.5, opacity: 0.8, marginBottom: 10, textTransform: "uppercase" }}>
            Educational ADHD Screening Report
          </Text>
          <Text style={{ fontFamily: "Cormorant Garamond", fontSize: 34, fontWeight: 500, lineHeight: 1.2, marginBottom: 18 }}>
            Prepared for {name}
          </Text>
          <Text style={{ fontSize: 10, opacity: 0.85 }}>Completed on {completionDate}</Text>
        </View>
        <View>
          <View style={{ height: 0.75, backgroundColor: "rgba(255,255,255,0.25)", marginBottom: 14 }} />
          <Text style={{ fontSize: 8, opacity: 0.75, lineHeight: 1.6 }}>
            Confidential. This document is intended solely for the individual named above. It contains an
            educational self-assessment summary and does not constitute a medical diagnosis.
          </Text>
        </View>
      </Page>

      {/* 2. Contents */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.eyebrow}>Contents</Text>
        <Text style={styles.h1}>What's inside this report</Text>
        <View style={{ marginTop: 12 }}>
          {[
            "Score Dashboard",
            "Executive Summary",
            "Your Profile",
            "Clinical Interpretation",
            "Domain Analysis",
            "Executive Function Chart",
            "Daily Life Insights",
            "Personalised Action Plan",
            "Questions for Your Clinician",
            "Next Steps",
            "Disclaimer",
          ].map((section, i) => (
            <View key={section} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 9, borderBottomWidth: 0.5, borderBottomColor: brand.border }}>
              <Text style={{ fontSize: 9, color: brand.emerald, width: 22, fontWeight: 600 }}>{String(i + 1).padStart(2, "0")}</Text>
              <Text style={{ fontSize: 11, color: brand.ink }}>{section}</Text>
            </View>
          ))}
        </View>
        <ReportFooter confidentialFor={name} />
      </Page>

      {/* 3. Score Dashboard — the hero page, deliberately spare and huge */}
      <Page size="A4" style={[styles.page, { justifyContent: "center" }]}>
        <Text style={styles.eyebrow}>Score dashboard</Text>
        <Text style={styles.h1}>Your overall pattern score</Text>
        <Text style={[styles.body, { marginBottom: 28, maxWidth: 380 }]}>
          A single number summarising your responses across all eight domains, out of 100. Higher reflects more
          frequent difficulty, not a likelihood of any diagnosis.
        </Text>

        <View style={{ flexDirection: "row", alignItems: "flex-end", marginBottom: 22 }}>
          <Text style={{ fontFamily: "Cormorant Garamond", fontSize: 96, fontWeight: 500, color: brand.emerald, lineHeight: 1 }}>
            {result.overallPercent}
          </Text>
          <Text style={{ fontSize: 20, color: brand.faint, marginBottom: 14, marginLeft: 4 }}>/ 100</Text>
        </View>

        <Svg width={400} height={10} style={{ marginBottom: 26 }}>
          <Rect x={0} y={0} width={400} height={10} rx={5} fill={brand.border} />
          <Rect x={0} y={0} width={(400 * result.overallPercent) / 100} height={10} rx={5} fill={overall.fill} />
        </Svg>

        <View style={{ flexDirection: "row", gap: 14 }}>
          <ScoreStat label="Severity" value={severityWord(result.overallPercent)} accent={overall.color} />
          <ScoreStat label="Pattern emphasis" value={result.patternEmphasisShort} />
          <ScoreStat label="Response pattern" value={consistency} />
        </View>

        <View style={[styles.card, { marginTop: 30, backgroundColor: brand.emeraldLight, borderColor: brand.emerald }]}>
          <Text style={{ fontSize: 9.5, color: brand.emerald, lineHeight: 1.6, fontWeight: 500 }}>
            This score reflects your self-reported responses only. It is not a diagnosis, a percentile, or a
            likelihood of having ADHD. Only a qualified healthcare professional can make that determination.
          </Text>
        </View>
        <ReportFooter confidentialFor={name} />
      </Page>

      {/* 4. Executive summary */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.eyebrow}>Executive summary</Text>
        <Text style={styles.h1}>Your overall pattern</Text>
        <Text style={styles.body}>
          Based on your responses across eight domains, your overall pattern falls in the range Mentel
          describes as {overall.label.toLowerCase()}. {result.leaningLabel.charAt(0).toUpperCase() + result.leaningLabel.slice(1)}.
        </Text>
        <View style={[styles.card, { marginTop: 16 }]}>
          <Text style={{ fontSize: 9.5, fontWeight: 600, marginBottom: 8 }}>At a glance</Text>
          {sortedByPercent.slice(0, 3).map((d) => (
            <View key={d.domain} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <Text style={{ fontSize: 9.5, color: brand.ink }}>{d.label}</Text>
              <SeverityBadge band={d.band} size="sm" />
            </View>
          ))}
        </View>
        <ReportFooter confidentialFor={name} />
      </Page>

      {/* 5. Your Profile — two-column: pattern emphasis + strengths/challenges */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.eyebrow}>Your profile</Text>
        <Text style={styles.h1}>How your responses pattern together</Text>
        <Text style={[styles.body, { marginBottom: 18 }]}>
          Not a subtype or diagnosis, just a plain-language summary of where your responses leaned.
        </Text>

        <View style={{ flexDirection: "row", gap: 14 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 9.5, fontWeight: 600, color: brand.emerald, marginBottom: 8 }}>STRENGTHS</Text>
            {result.strengths.length > 0 ? (
              result.strengths.map((s) => (
                <View key={s.domain} style={{ flexDirection: "row", alignItems: "center", marginBottom: 7 }}>
                  <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: brand.emerald, marginRight: 7 }} />
                  <Text style={{ fontSize: 10, color: brand.ink }}>{s.label}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.small}>No domains showed minimal or mild difficulty in this assessment.</Text>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 9.5, fontWeight: 600, color: "#9c4f0d", marginBottom: 8 }}>CHALLENGES</Text>
            {result.challenges.length > 0 ? (
              result.challenges.map((c) => (
                <View key={c.domain} style={{ flexDirection: "row", alignItems: "center", marginBottom: 7 }}>
                  <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: "#9c4f0d", marginRight: 7 }} />
                  <Text style={{ fontSize: 10, color: brand.ink }}>{challengesPool[c.domain]}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.small}>No domains showed moderate or significant difficulty in this assessment.</Text>
            )}
          </View>
        </View>

        <View style={[styles.card, { marginTop: 20 }]}>
          <Text style={{ fontSize: 9.5, fontWeight: 600, marginBottom: 6 }}>Pattern emphasis</Text>
          <Text style={styles.body}>
            Your responses showed {result.leaningLabel}. This describes the shape of your answers, not a
            clinical subtype, only a full evaluation can determine that.
          </Text>
        </View>
        <ReportFooter confidentialFor={name} />
      </Page>

      {/* 6. Clinical interpretation */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.eyebrow}>Clinical interpretation</Text>
        <Text style={styles.h1}>Domain by domain</Text>
        <Text style={[styles.body, { marginBottom: 14 }]}>
          The interpretations below describe patterns in your responses, not a diagnosis. Only a qualified
          healthcare professional can determine whether these relate to ADHD or another explanation.
        </Text>
        {result.domainResults.map((d) => (
          <View key={d.domain} style={styles.card}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <Text style={{ fontSize: 10.5, fontWeight: 600, color: brand.emerald }}>{d.label}</Text>
              <SeverityBadge band={d.band} size="sm" />
            </View>
            <Text style={styles.body}>{domainInterpretations[d.domain][d.band]}</Text>
          </View>
        ))}
        <ReportFooter confidentialFor={name} />
      </Page>

      {/* 7. Domain analysis: bars + clinical summary table */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.eyebrow}>Domain analysis</Text>
        <Text style={styles.h1}>Symptom domain overview</Text>
        <View style={[styles.card, { marginTop: 8 }]}>
          {result.domainResults.map((d) => (
            <DomainBar key={d.domain} label={d.label} percent={d.percent} band={d.band} />
          ))}
        </View>

        <Text style={{ fontSize: 9.5, fontWeight: 600, color: brand.ink, marginTop: 6, marginBottom: 8 }}>Clinical summary table</Text>
        <View style={{ borderWidth: 1, borderColor: brand.border, borderRadius: 6, overflow: "hidden" }}>
          <View style={{ flexDirection: "row", backgroundColor: brand.emeraldLight, paddingVertical: 6, paddingHorizontal: 10 }}>
            <Text style={{ flex: 2, fontSize: 8.5, fontWeight: 600, color: brand.emerald }}>DOMAIN</Text>
            <Text style={{ flex: 1, fontSize: 8.5, fontWeight: 600, color: brand.emerald }}>SCORE</Text>
            <Text style={{ flex: 1, fontSize: 8.5, fontWeight: 600, color: brand.emerald }}>SEVERITY</Text>
          </View>
          {result.domainResults.map((d, i) => (
            <View
              key={d.domain}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 7,
                paddingHorizontal: 10,
                backgroundColor: i % 2 === 0 ? "#ffffff" : brand.paper,
                borderTopWidth: 0.5,
                borderTopColor: brand.border,
              }}
            >
              <Text style={{ flex: 2, fontSize: 9, color: brand.ink }}>{d.label}</Text>
              <Text style={{ flex: 1, fontSize: 9, color: brand.ink }}>{d.percent}%</Text>
              <SeverityBadge band={d.band} size="sm" />
            </View>
          ))}
        </View>
        <ReportFooter confidentialFor={name} />
      </Page>

      {/* 8. Executive function radar chart, full page, centered */}
      <Page size="A4" style={[styles.page, { alignItems: "center", justifyContent: "center" }]}>
        <View style={{ position: "absolute", top: 56, left: 52 }}>
          <Text style={styles.eyebrow}>Executive function chart</Text>
          <Text style={styles.h1}>Your pattern across six domains</Text>
        </View>
        <RadarChartPdf result={result} size={300} />
        <Text style={[styles.small, { marginTop: 20, maxWidth: 320, textAlign: "center" }]}>
          Each axis reflects the percentage of maximum possible difficulty in that domain, based on your
          responses. A larger shape indicates more domains showing frequent difficulty.
        </Text>
        <ReportFooter confidentialFor={name} />
      </Page>

      {/* 9. Daily life insights */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.eyebrow}>Daily life insights</Text>
        <Text style={styles.h1}>How this may show up day to day</Text>
        <Text style={[styles.body, { marginBottom: 14 }]}>
          {domainInterpretations.daily_impact[result.domainResults.find((d) => d.domain === "daily_impact")?.band ?? result.overallBand]}
        </Text>
        <View style={[styles.card, { backgroundColor: brand.emeraldLight, borderColor: brand.emerald }]}>
          <Text style={{ fontSize: 9.5, color: brand.emerald, lineHeight: 1.6 }}>
            Attention, memory, and energy difficulties don't only come from ADHD. Chronic stress, burnout,
            anxiety, poor sleep, depression, and unresolved trauma can all produce very similar day-to-day
            patterns, which is exactly why a conversation with a professional is the right next step.
          </Text>
        </View>
        <View style={{ marginTop: 12 }}>
          <Text style={{ fontSize: 10.5, fontWeight: 600, color: brand.ink, marginBottom: 8 }}>Where this showed up most in your responses</Text>
          {topChallenges.map((c) => (
            <View key={c.domain} style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 8 }}>
              <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: brand.emerald, marginTop: 5, marginRight: 8 }} />
              <Text style={[styles.body, { flex: 1 }]}>{c.label}</Text>
            </View>
          ))}
        </View>
        <ReportFooter confidentialFor={name} />
      </Page>

      {/* 10. Personalised action plan, now with priority stars */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.eyebrow}>Personalised action plan</Text>
        <Text style={styles.h1}>Recommended next steps, in priority order</Text>
        <Text style={[styles.body, { marginBottom: 14 }]}>
          Priority is based on how strongly the related domain showed up in your own responses, start with the
          highest-priority item rather than all of them at once.
        </Text>
        {recommendations.map((r) => (
          <View key={r.title} style={[styles.card, { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}>
            <Text style={{ fontSize: 10.5, color: brand.ink, flex: 1 }}>{r.title}</Text>
            <StarRating count={r.priorityStars} />
          </View>
        ))}

        <Text style={{ fontSize: 10.5, fontWeight: 600, color: brand.ink, marginTop: 14, marginBottom: 10 }}>Practical strategies</Text>
        {guidanceDomains.map((domain) => {
          const label = result.domainResults.find((d) => d.domain === domain)?.label ?? "";
          return (
            <View key={domain} style={styles.card}>
              <Text style={{ fontSize: 10, fontWeight: 600, color: brand.emerald, marginBottom: 5 }}>{label}</Text>
              {domainStrategies[domain].slice(0, 2).map((s, i) => (
                <Text key={i} style={[styles.body, { marginBottom: 4, fontSize: 9.5 }]}>{"\u2022"} {s}</Text>
              ))}
            </View>
          );
        })}
        <ReportFooter confidentialFor={name} />
      </Page>

      {/* 11. Doctor discussion summary, now with sample questions */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.eyebrow}>For your healthcare provider</Text>
        <Text style={styles.h1}>Questions for your clinician</Text>
        <Text style={[styles.body, { marginBottom: 14 }]}>{doctorSummaryIntro}</Text>

        <View style={styles.card}>
          <Text style={{ fontSize: 9.5, fontWeight: 600, marginBottom: 8 }}>Summary of domain scores</Text>
          {result.domainResults.map((d) => (
            <View key={d.domain} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
              <Text style={{ fontSize: 9.5, color: brand.ink }}>{d.label}</Text>
              <SeverityBadge band={d.band} size="sm" />
            </View>
          ))}
        </View>

        <Text style={{ fontSize: 10.5, fontWeight: 600, color: brand.ink, marginTop: 12, marginBottom: 8 }}>Sample questions to bring with you</Text>
        {doctorQuestions.map((q, i) => (
          <View key={i} style={{ flexDirection: "row", marginBottom: 7 }}>
            <Text style={{ fontSize: 9.5, color: brand.emerald, width: 16 }}>{i + 1}.</Text>
            <Text style={[styles.body, { flex: 1, fontSize: 9.5 }]}>{q}</Text>
          </View>
        ))}
        <ReportFooter confidentialFor={name} />
      </Page>

      {/* 12. Next steps / resources */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.eyebrow}>Recommended resources</Text>
        <Text style={styles.h1}>Next steps</Text>
        <View style={styles.card}>
          <Text style={{ fontSize: 10.5, fontWeight: 600, marginBottom: 6 }}>Talk to a licensed professional</Text>
          <Text style={styles.body}>
            If you would like to discuss this report or explore further evaluation, Mentel can connect you with
            a licensed mental health professional for an initial session.
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={{ fontSize: 10.5, fontWeight: 600, marginBottom: 6 }}>Keep learning</Text>
          <Text style={styles.body}>
            Visit trymentel.com/articles for further reading on attention, executive function, and daily
            strategies grounded in current research.
          </Text>
        </View>
        <Text style={[styles.small, { marginTop: 20 }]}>
          Mentel LTD (RC 9116334). This report was generated on {completionDate} and reflects your responses at
          that time. Copyright Mentel LTD, all rights reserved.
        </Text>
        <ReportFooter confidentialFor={name} />
      </Page>

      {/* 13. Disclaimer, dedicated final page */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.eyebrow}>Disclaimer</Text>
        <Text style={styles.h1}>Important information about this report</Text>
        <View style={[styles.card, { marginTop: 10 }]}>
          <Text style={styles.body}>{reportDisclaimer}</Text>
        </View>
        <Text style={[styles.body, { marginTop: 14 }]}>
          This report was generated from your self-reported answers to an educational screening questionnaire.
          It has not been reviewed by a clinician on an individual basis, and no clinician-patient relationship
          is created by receiving it. The scores, charts, and language throughout describe patterns in your own
          responses only, they are not measures of clinical severity, diagnostic likelihood, or risk, and they
          have not been validated as a diagnostic instrument.
        </Text>
        <Text style={[styles.body, { marginTop: 10 }]}>
          If you are experiencing distress, or if these patterns are significantly affecting your daily life,
          please speak with a qualified healthcare professional. If you are in crisis, please contact your
          local emergency services or a crisis helpline.
        </Text>
        <ReportFooter confidentialFor={name} />
      </Page>
    </Document>
  );
}

function ScoreStat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <View style={{ flex: 1, borderWidth: 1, borderColor: brand.border, borderRadius: 8, padding: 12 }}>
      <Text style={{ fontSize: 7.5, fontWeight: 600, letterSpacing: 0.8, color: brand.faint, textTransform: "uppercase", marginBottom: 4 }}>{label}</Text>
      <Text style={{ fontSize: 12, fontWeight: 600, color: accent ?? brand.ink }}>{value}</Text>
    </View>
  );
}
