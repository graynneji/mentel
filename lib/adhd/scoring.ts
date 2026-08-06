// // lib/adhd/scoring.ts
// //
// // Scoring is deliberately conservative in its language. Nothing here should
// // ever be surfaced to a user as "you have ADHD" or a percentage/probability
// // of diagnosis. It produces domain bands and a plain-language pattern
// // summary intended to support a conversation with a clinician, not replace one.

// import { Domain, domainMeta, questions } from "./questions";

// export type Answers = Record<string, number>;

// export type Band = "minimal" | "mild" | "moderate" | "significant";

// export interface DomainResult {
//   domain: Domain;
//   label: string;
//   score: number;
//   maxScore: number;
//   percent: number;
//   band: Band;
// }

// export interface AssessmentResult {
//   domainResults: DomainResult[];
//   overallPercent: number;
//   overallBand: Band;
//   inattentivePercent: number;
//   hyperactivePercent: number;
//   leaningLabel: string; // plain-language leaning, never a subtype diagnosis
//   strengths: DomainResult[]; // lowest-scoring domains (fewer difficulties)
//   challenges: DomainResult[]; // highest-scoring domains (more difficulties)
// }

// const INATTENTIVE_DOMAINS: Domain[] = [
//   "attention",
//   "working_memory",
//   "organisation",
//   "daily_impact",
// ];
// const HYPERACTIVE_DOMAINS: Domain[] = [
//   "impulsivity",
//   "hyperactivity",
//   "emotional_regulation",
// ];

// function bandFor(percent: number): Band {
//   if (percent < 25) return "minimal";
//   if (percent < 50) return "mild";
//   if (percent < 75) return "moderate";
//   return "significant";
// }

// export function scoreAssessment(answers: Answers): AssessmentResult {
//   const byDomain = new Map<Domain, { sum: number; max: number }>();

//   for (const q of questions) {
//     const val = answers[q.id] ?? 0;
//     const entry = byDomain.get(q.domain) ?? { sum: 0, max: 0 };
//     entry.sum += val;
//     entry.max += 4;
//     byDomain.set(q.domain, entry);
//   }

//   const domainResults: DomainResult[] = Array.from(byDomain.entries()).map(
//     ([domain, { sum, max }]) => {
//       const percent = max === 0 ? 0 : Math.round((sum / max) * 100);
//       return {
//         domain,
//         label: domainMeta[domain].label,
//         score: sum,
//         maxScore: max,
//         percent,
//         band: bandFor(percent),
//       };
//     }
//   );

//   const totalSum = domainResults.reduce((a, d) => a + d.score, 0);
//   const totalMax = domainResults.reduce((a, d) => a + d.maxScore, 0);
//   const overallPercent = totalMax === 0 ? 0 : Math.round((totalSum / totalMax) * 100);

//   const inattentiveResults = domainResults.filter((d) => INATTENTIVE_DOMAINS.includes(d.domain));
//   const hyperactiveResults = domainResults.filter((d) => HYPERACTIVE_DOMAINS.includes(d.domain));

//   const inattentivePercent = avgPercent(inattentiveResults);
//   const hyperactivePercent = avgPercent(hyperactiveResults);

//   const diff = inattentivePercent - hyperactivePercent;
//   let leaningLabel = "a mixed pattern across attention and activity-related domains";
//   if (Math.abs(diff) <= 8) {
//     leaningLabel = "a fairly even pattern across attention and activity-related domains";
//   } else if (diff > 8) {
//     leaningLabel = "a pattern that leans more toward attention and organisation-related domains";
//   } else {
//     leaningLabel = "a pattern that leans more toward activity and impulse-related domains";
//   }

//   const sorted = [...domainResults].sort((a, b) => a.percent - b.percent);
//   const strengths = sorted.slice(0, 3);
//   const challenges = [...sorted].reverse().slice(0, 3);

//   return {
//     domainResults,
//     overallPercent,
//     overallBand: bandFor(overallPercent),
//     inattentivePercent,
//     hyperactivePercent,
//     leaningLabel,
//     strengths,
//     challenges,
//   };
// }

// function avgPercent(results: DomainResult[]): number {
//   if (results.length === 0) return 0;
//   return Math.round(results.reduce((a, d) => a + d.percent, 0) / results.length);
// }

// export const bandCopy: Record<Band, { label: string; color: string; sentence: string }> = {
//   minimal: {
//     label: "Minimal difficulty",
//     color: "#2d7a5a",
//     sentence: "your responses suggest this area is not currently a significant source of difficulty",
//   },
//   mild: {
//     label: "Mild difficulty",
//     color: "#5da885",
//     sentence: "your responses suggest occasional difficulty in this area",
//   },
//   moderate: {
//     label: "Moderate difficulty",
//     color: "#b07a1a",
//     sentence: "your responses suggest this area shows up as a regular difficulty",
//   },
//   significant: {
//     label: "Significant difficulty",
//     color: "#a33030",
//     sentence: "your responses suggest this area is a frequent, noticeable difficulty",
//   },
// };
// lib/adhd/scoring.ts
//
// Scoring is deliberately conservative in its language. Nothing here should
// ever be surfaced to a user as "you have ADHD" or a percentage/probability
// of diagnosis. It produces domain bands and a plain-language pattern
// summary intended to support a conversation with a clinician, not replace one.

import { Domain, domainMeta, questions } from "./questions";

export type Answers = Record<string, number>;

export type Band = "minimal" | "mild" | "moderate" | "significant";

export interface DomainResult {
  domain: Domain;
  label: string;
  score: number;
  maxScore: number;
  percent: number;
  band: Band;
}

export interface AssessmentResult {
  domainResults: DomainResult[];
  overallPercent: number;
  overallBand: Band;
  inattentivePercent: number;
  hyperactivePercent: number;
  leaningLabel: string; // full-sentence fragment, always names the actual top domain, see below
  patternEmphasisShort: string; // short chip label for score-dashboard-style UI, e.g. "Working Memory-led" — derived from the SAME top domain as leaningLabel, so the two can never contradict each other
  strengths: DomainResult[]; // lowest-scoring domains (fewer difficulties)
  challenges: DomainResult[]; // highest-scoring domains (more difficulties)
}

// Renamed away from "inattentive"/"hyperactive" as user-facing labels
// (those are literally the DSM-5 ADHD subtype names, using them as a
// two-word summary reads as a subtype determination even when the intent
// was just "these four domains vs those three"). Kept as internal grouping
// names only, for the cluster-level "leans more toward X as a group"
// sentence, never surfaced verbatim to the user.
const FOCUS_ORGANISATION_DOMAINS: Domain[] = [
  "attention",
  "working_memory",
  "organisation",
  "daily_impact",
];
const ACTIVITY_IMPULSE_DOMAINS: Domain[] = [
  "impulsivity",
  "hyperactivity",
  "emotional_regulation",
];

function bandFor(percent: number): Band {
  if (percent < 25) return "minimal";
  if (percent < 50) return "mild";
  if (percent < 75) return "moderate";
  return "significant";
}

export function scoreAssessment(answers: Answers): AssessmentResult {
  const byDomain = new Map<Domain, { sum: number; max: number }>();

  for (const q of questions) {
    const val = answers[q.id] ?? 0;
    const entry = byDomain.get(q.domain) ?? { sum: 0, max: 0 };
    entry.sum += val;
    entry.max += 4;
    byDomain.set(q.domain, entry);
  }

  const domainResults: DomainResult[] = Array.from(byDomain.entries()).map(
    ([domain, { sum, max }]) => {
      const percent = max === 0 ? 0 : Math.round((sum / max) * 100);
      return {
        domain,
        label: domainMeta[domain].label,
        score: sum,
        maxScore: max,
        percent,
        band: bandFor(percent),
      };
    },
  );

  const totalSum = domainResults.reduce((a, d) => a + d.score, 0);
  const totalMax = domainResults.reduce((a, d) => a + d.maxScore, 0);
  const overallPercent =
    totalMax === 0 ? 0 : Math.round((totalSum / totalMax) * 100);

  const focusOrgResults = domainResults.filter((d) =>
    FOCUS_ORGANISATION_DOMAINS.includes(d.domain),
  );
  const activityImpulseResults = domainResults.filter((d) =>
    ACTIVITY_IMPULSE_DOMAINS.includes(d.domain),
  );

  const inattentivePercent = avgPercent(focusOrgResults);
  const hyperactivePercent = avgPercent(activityImpulseResults);

  // The actual highest-scoring specific domain, this is what the summary
  // sentence names directly, rather than a cluster-average descriptor like
  // "attention-leaning" that can silently disagree with the domain
  // everyone can see is actually highest in the breakdown below it. If two
  // domains are close, name both rather than picking one arbitrarily.
  const sortedDesc = [...domainResults].sort((a, b) => b.percent - a.percent);
  const topDomain = sortedDesc[0];
  const secondDomain = sortedDesc[1];
  const topDomainsAreClose =
    secondDomain && topDomain.percent - secondDomain.percent <= 6;
  const topDomainPhrase = topDomainsAreClose
    ? `${topDomain.label} and ${secondDomain.label}`
    : topDomain.label;

  const diff = inattentivePercent - hyperactivePercent;
  let leaningLabel: string;
  if (Math.abs(diff) <= 8) {
    leaningLabel = `a fairly even pattern across domains, with ${topDomainPhrase} showing the most difficulty`;
  } else if (diff > 8) {
    leaningLabel = `a pattern that leans more toward focus, memory, and organisation-related domains as a group, driven most by ${topDomainPhrase}`;
  } else {
    leaningLabel = `a pattern that leans more toward activity and impulse-related domains as a group, driven most by ${topDomainPhrase}`;
  }

  // Short chip-style label for UI that needs a few words, not a sentence
  // (e.g. the PDF's score-dashboard stat card). Built from the exact same
  // topDomain the sentence above uses, never a separately-derived cluster
  // word, so the short label and the full sentence can never disagree with
  // each other or with the domain breakdown table.
  const patternEmphasisShort = topDomainsAreClose
    ? "Mixed pattern"
    : `${topDomain.label}-led`;

  // Previously this just took the 3 lowest and 3 highest domains,
  // regardless of their actual band. That meant someone scoring high
  // across every domain could still get 3 "strengths" pulled from their
  // own Moderate/Significant range, cheerfully labeled "Creativity" or
  // "Adaptability" right next to a report saying those same domains show
  // frequent difficulty, exactly the kind of internal contradiction that
  // makes a report look auto-generated rather than accurate. Now strengths
  // only include domains that are actually minimal/mild, and challenges
  // only include domains that are actually moderate/significant, if fewer
  // than 3 domains qualify on either side, fewer are shown rather than
  // padding with domains that don't genuinely belong in that bucket.
  const sorted = [...domainResults].sort((a, b) => a.percent - b.percent);
  const strengths = sorted
    .filter((d) => d.band === "minimal" || d.band === "mild")
    .slice(0, 3);
  const challenges = [...sorted]
    .reverse()
    .filter((d) => d.band === "moderate" || d.band === "significant")
    .slice(0, 3);

  return {
    domainResults,
    overallPercent,
    overallBand: bandFor(overallPercent),
    inattentivePercent,
    hyperactivePercent,
    leaningLabel,
    patternEmphasisShort,
    strengths,
    challenges,
  };
}

function avgPercent(results: DomainResult[]): number {
  if (results.length === 0) return 0;
  return Math.round(
    results.reduce((a, d) => a + d.percent, 0) / results.length,
  );
}

export const bandCopy: Record<
  Band,
  { label: string; color: string; fill: string; sentence: string }
> = {
  minimal: {
    label: "Minimal difficulty",
    color: "#2d7a5a", // green — 5.19:1 vs white
    fill: "#2d7a5a",
    sentence:
      "your responses suggest this area is not currently a significant source of difficulty",
  },
  mild: {
    label: "Mild difficulty",
    color: "#8f6300", // amber — 5.31:1 vs white, darkened from the original lighter amber so it's readable as text, not just a light background tint
    fill: "#c99a2e", // lighter, for use as a fill/bar color where text contrast doesn't apply
    sentence: "your responses suggest occasional difficulty in this area",
  },
  moderate: {
    label: "Moderate difficulty",
    color: "#9c4f0d", // orange — 5.94:1 vs white
    fill: "#c2660c",
    sentence:
      "your responses suggest this area shows up as a regular difficulty",
  },
  significant: {
    label: "Significant difficulty",
    color: "#c0392b", // red — 5.44:1 vs white
    fill: "#c0392b",
    sentence:
      "your responses suggest this area is a frequent, noticeable difficulty",
  },
};
