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
  leaningLabel: string; // plain-language leaning, never a subtype diagnosis
  strengths: DomainResult[]; // lowest-scoring domains (fewer difficulties)
  challenges: DomainResult[]; // highest-scoring domains (more difficulties)
}

const INATTENTIVE_DOMAINS: Domain[] = [
  "attention",
  "working_memory",
  "organisation",
  "daily_impact",
];
const HYPERACTIVE_DOMAINS: Domain[] = [
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

  const inattentiveResults = domainResults.filter((d) =>
    INATTENTIVE_DOMAINS.includes(d.domain),
  );
  const hyperactiveResults = domainResults.filter((d) =>
    HYPERACTIVE_DOMAINS.includes(d.domain),
  );

  const inattentivePercent = avgPercent(inattentiveResults);
  const hyperactivePercent = avgPercent(hyperactiveResults);

  const diff = inattentivePercent - hyperactivePercent;
  let leaningLabel =
    "a mixed pattern across attention and activity-related domains";
  if (Math.abs(diff) <= 8) {
    leaningLabel =
      "a fairly even pattern across attention and activity-related domains";
  } else if (diff > 8) {
    leaningLabel =
      "a pattern that leans more toward attention and organisation-related domains";
  } else {
    leaningLabel =
      "a pattern that leans more toward activity and impulse-related domains";
  }

  const sorted = [...domainResults].sort((a, b) => a.percent - b.percent);
  const strengths = sorted.slice(0, 3);
  const challenges = [...sorted].reverse().slice(0, 3);

  return {
    domainResults,
    overallPercent,
    overallBand: bandFor(overallPercent),
    inattentivePercent,
    hyperactivePercent,
    leaningLabel,
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
