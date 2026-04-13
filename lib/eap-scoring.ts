// lib/eap-scoring.ts
// Canonical scoring logic shared between API routes and client components.
// DO NOT duplicate this anywhere — import it.

export type RiskBand = "Low" | "Mild" | "Moderate" | "High" | "Critical";

export interface DomainScore {
  domain: string;
  label: string;
  score: number; // 0-100, higher = more distress
}

export interface ScoringResult {
  stressScore: number;
  anxietyScore: number;
  depressionScore: number;
  burnoutScore: number;
  sleepScore: number;
  relationshipScore: number | null;
  selfEsteemScore: number;
  totalScore: number;
  riskBand: RiskBand;
  flags: string[];
}

const DOMAIN_QUESTIONS: Record<string, string[]> = {
  stress: ["stress_freq", "stress_physical", "stress_control"],
  anxiety: [
    "anxiety_worry",
    "anxiety_restless",
    "anxiety_avoidance",
    "anxiety_panic",
  ],
  depression: [
    "dep_interest",
    "dep_hopeless",
    "dep_fatigue",
    "dep_selfworth",
    "dep_thoughts",
  ],
  burnout: [
    "burnout_exhaustion",
    "burnout_cynicism",
    "burnout_effectiveness",
    "burnout_boundary",
  ],
  sleep: ["sleep_quality", "sleep_onset", "sleep_daytime"],
  selfesteem: ["se_worth", "se_criticism", "se_comparison"],
};

const RELATIONSHIP_QUESTIONS_BASE = ["rel_support", "rel_conflict"];
const RELATIONSHIP_QUESTIONS_PARTNER = [
  "rel_partner_comm",
  "rel_intimacy",
  "rel_trust",
];
const RELATIONSHIP_QUESTIONS_MARRIED = ["rel_marriage_stress", "rel_sex"];

const MAX_PER_Q: Record<string, number> = {
  stress: 4,
  anxiety: 4,
  depression: 4,
  burnout: 4,
  sleep: 3,
  selfesteem: 4,
  relationships: 3,
};

// Weighted for clinical importance (depression/anxiety weighted highest)
const WEIGHTS: Record<string, number> = {
  stress: 1.1,
  anxiety: 1.2,
  depression: 1.5,
  burnout: 1.0,
  sleep: 0.8,
  relationships: 0.8,
  selfesteem: 0.9,
};

function domainScore(
  qids: string[],
  answers: Record<string, number>,
  maxPerQ: number,
): number {
  if (!qids.length) return 0;
  const vals = qids.map((q) => answers[q] ?? 0);
  const raw = vals.reduce((s, v) => s + v, 0);
  const maxPossible = qids.length * maxPerQ;
  return Math.round((raw / maxPossible) * 100);
}

export function computeScores(answers: Record<string, number>): ScoringResult {
  const relStatus = answers.rel_status ?? -1;

  // Build relationship question list based on relationship status
  let relQuestions = [...RELATIONSHIP_QUESTIONS_BASE];
  if (relStatus >= 1)
    relQuestions = [...relQuestions, ...RELATIONSHIP_QUESTIONS_PARTNER];
  if (relStatus >= 2)
    relQuestions = [...relQuestions, ...RELATIONSHIP_QUESTIONS_MARRIED];

  const scores = {
    stress: domainScore(DOMAIN_QUESTIONS.stress, answers, MAX_PER_Q.stress),
    anxiety: domainScore(DOMAIN_QUESTIONS.anxiety, answers, MAX_PER_Q.anxiety),
    depression: domainScore(
      DOMAIN_QUESTIONS.depression,
      answers,
      MAX_PER_Q.depression,
    ),
    burnout: domainScore(DOMAIN_QUESTIONS.burnout, answers, MAX_PER_Q.burnout),
    sleep: domainScore(DOMAIN_QUESTIONS.sleep, answers, MAX_PER_Q.sleep),
    selfesteem: domainScore(
      DOMAIN_QUESTIONS.selfesteem,
      answers,
      MAX_PER_Q.selfesteem,
    ),
    relationships:
      relStatus >= 0
        ? domainScore(relQuestions, answers, MAX_PER_Q.relationships)
        : null,
  };

  // Weighted composite
  let totalWeighted = 0,
    totalWeight = 0;
  for (const [key, weight] of Object.entries(WEIGHTS)) {
    const score = scores[key as keyof typeof scores];
    if (score !== null && score !== undefined) {
      totalWeighted += score * weight;
      totalWeight += weight;
    }
  }
  const totalScore =
    totalWeight > 0 ? Math.round(totalWeighted / totalWeight) : 0;

  // Flags
  const flags: string[] = [];
  if ((answers.dep_thoughts ?? 0) >= 2) flags.push("suicidal_ideation");
  if ((answers.dep_thoughts ?? 0) >= 3) flags.push("crisis");
  if (scores.burnout >= 75) flags.push("burnout_severe");
  if (scores.depression >= 80) flags.push("depression_severe");
  if (scores.anxiety >= 80) flags.push("anxiety_severe");

  // Band
  let riskBand: RiskBand = "Low";
  if (totalScore >= 75 || flags.includes("crisis")) riskBand = "Critical";
  else if (totalScore >= 55) riskBand = "High";
  else if (totalScore >= 38) riskBand = "Moderate";
  else if (totalScore >= 20) riskBand = "Mild";

  return {
    stressScore: scores.stress,
    anxietyScore: scores.anxiety,
    depressionScore: scores.depression,
    burnoutScore: scores.burnout,
    sleepScore: scores.sleep,
    relationshipScore: scores.relationships,
    selfEsteemScore: scores.selfesteem,
    totalScore,
    riskBand,
    flags,
  };
}

export function getBandColor(band: RiskBand | string): string {
  const colors: Record<string, string> = {
    Low: "#4e8c6a",
    Mild: "#3d8b8b",
    Moderate: "#8b6e3d",
    High: "#b94a4f",
    Critical: "#8b1a1a",
  };
  return colors[band] ?? "#8da898";
}

export function scoreToBand(score: number): RiskBand {
  if (score >= 75) return "Critical";
  if (score >= 55) return "High";
  if (score >= 38) return "Moderate";
  if (score >= 20) return "Mild";
  return "Low";
}
