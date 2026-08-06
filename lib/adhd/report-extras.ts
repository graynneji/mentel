// lib/adhd/report-extras.ts
//
// Content for the score-dashboard, profile, and action-plan pages added to
// the PDF redesign. Kept separate from interpretations.ts (which is the
// file flagged for clinical review) since everything here is structural/
// non-clinical: short trait labels, question prompts, and priority
// ordering, not language interpreting someone's specific responses.
//
// Deliberately NOT included, on purpose, not an oversight:
//   - A "likelihood of ADHD" percentage or risk score. This screening
//     cannot support that claim, presenting one would be exactly the kind
//     of diagnostic-weight language the rest of this report is built to
//     avoid.
//   - A "primary/secondary pattern" framed as a DSM subtype (Inattentive /
//     Hyperactive / Combined). That's a clinical determination this tool
//     doesn't make. What's here instead is a plain-language "pattern
//     emphasis" using the same leaning logic already in scoring.ts.
//   - A comparison against "the general population". There's no real
//     normative dataset behind this screening to compare against, a bar
//     chart implying one would be fabricated statistics.

import { AssessmentResult, DomainResult } from "./scoring";
import { Domain } from "./questions";

export const challengesPool: Record<Domain, string> = {
  attention: "Losing focus on routine tasks",
  working_memory: "Forgetfulness",
  executive_function: "Task initiation and switching",
  organisation: "Time blindness",
  impulsivity: "Acting before thinking it through",
  emotional_regulation: "Frustration building quickly",
  hyperactivity: "Internal restlessness",
  daily_impact: "Day-to-day interference",
};

export const doctorQuestions: string[] = [
  "Could my symptoms be explained by ADHD, or by something else, such as anxiety, depression, sleep issues, or stress?",
  "What would a full evaluation for ADHD actually involve?",
  "Are there strategies I could try in the meantime, while I wait for an appointment or evaluation?",
  "Could any medications or health conditions I already have be contributing to these patterns?",
  "If a diagnosis isn't ADHD, what else should we rule out first?",
];

export interface Recommendation {
  title: string;
  priorityStars: 1 | 2 | 3 | 4 | 5;
}

/**
 * Priority-ranked, non-diagnostic next steps. Priority is derived from how
 * severe the relevant domain(s) came through in the person's own responses,
 * not from any calculated likelihood of a condition.
 */
export function buildRecommendations(result: AssessmentResult): Recommendation[] {
  const byDomain = (d: Domain) => result.domainResults.find((r) => r.domain === d)?.percent ?? 0;
  const starsFor = (percent: number): Recommendation["priorityStars"] => {
    if (percent >= 75) return 5;
    if (percent >= 55) return 4;
    if (percent >= 35) return 3;
    if (percent >= 15) return 2;
    return 1;
  };

  return [
    { title: "Speak with a licensed clinician", priorityStars: starsFor(result.overallPercent) },
    { title: "Build daily structure and routines", priorityStars: starsFor(byDomain("organisation")) },
    { title: "Address sleep and stress factors first", priorityStars: starsFor(byDomain("emotional_regulation")) },
    { title: "Try an external memory system (notes, reminders)", priorityStars: starsFor(byDomain("working_memory")) },
    { title: "Explore coaching or accountability support", priorityStars: starsFor(byDomain("executive_function")) },
  ].sort((a, b) => b.priorityStars - a.priorityStars);
}

/**
 * A genuinely computed (not fabricated) descriptor of how consistent the
 * difficulty level was across domains, this is just the spread of the
 * person's own domain scores, not a statement about diagnostic confidence.
 * Framed carefully so it can't be misread as "confidence this is ADHD".
 */
export function describeConsistency(result: AssessmentResult): string {
  const percents = result.domainResults.map((d) => d.percent);
  const mean = percents.reduce((a, b) => a + b, 0) / percents.length;
  const variance = percents.reduce((a, b) => a + (b - mean) ** 2, 0) / percents.length;
  const stdDev = Math.sqrt(variance);
  if (stdDev < 15) return "Consistent across domains";
  if (stdDev < 28) return "Somewhat varied by domain";
  return "Highly varied by domain";
}

export function severityWord(percent: number): string {
  if (percent >= 75) return "Significant";
  if (percent >= 50) return "Moderate";
  if (percent >= 25) return "Mild";
  return "Minimal";
}
