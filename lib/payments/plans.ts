// lib/payments/plans.ts
//
// Single source of truth for pricing. Update prices/session counts here
// only — everything else (Paystack initialize, session-count-on-payment
// logic, email wording) reads from this instead of guessing from a plan
// name string.
//
// IMPORTANT: this must be mirrored exactly in the client portal's
// equivalent file (client-portal/lib/payments/plans.ts) — both apps need
// to agree on what each plan is worth in sessions. If you change a price
// or session count, update both.

export interface PlanDefinition {
  key: string;
  label: string; // exact string sent to Paystack metadata and matched back on webhook/verify
  amountKobo: number;
  sessions: number;
  description: string;
  features: string[];
}

export const PLANS: Record<string, PlanDefinition> = {
  once: {
    key: "once",
    label: "One Session",
    amountKobo: 10_000 * 100,
    sessions: 1,
    description: "Pay as you go",
    features: ["Pay as you go", "Standard booking", "45-minute session"],
  },
  care: {
    key: "care",
    label: "Mentel Care",
    amountKobo: 35_000 * 100,
    sessions: 4,
    description: "4 sessions/month",
    features: [
      "4 therapy sessions/month",
      "Priority booking calendar",
      "Between-session therapist messaging",
      "Digital progress tracking",
    ],
  },
  plus: {
    key: "plus",
    label: "Mentel Plus",
    amountKobo: 65_000 * 100,
    sessions: 8,
    description: "8 sessions/month — intensive support",
    features: [
      "8 therapy sessions/month (ideal for intensive support)",
      "Same-day or next-day appointment access",
      "Everything in Care, plus premium 24/7 support",
    ],
  },
};

/** Resolves a plan's session count from the label stored on the payment (Paystack metadata / Payment.notes), not a fuzzy substring guess. */
export function sessionsForPlanLabel(planLabel: string): number {
  const match = Object.values(PLANS).find((p) => p.label.toLowerCase() === planLabel.toLowerCase());
  if (match) return match.sessions;
  // Fallback for anything that doesn't exactly match (old payments made
  // before this pricing change, e.g. "Monthly Plan") — best-effort guess
  // rather than silently defaulting everyone to 1 session.
  const lower = planLabel.toLowerCase();
  if (lower.includes("plus")) return 8;
  if (lower.includes("care") || lower.includes("month")) return 4;
  return 1;
}

/** Resolves the Package.planType value ("single" | "care" | "plus") from a plan label. */
export function planTypeForLabel(planLabel: string): string {
  const match = Object.values(PLANS).find((p) => p.label.toLowerCase() === planLabel.toLowerCase());
  if (match) return match.key === "once" ? "single" : match.key;
  const lower = planLabel.toLowerCase();
  if (lower.includes("plus")) return "plus";
  if (lower.includes("care") || lower.includes("month")) return "care";
  return "single";
}
