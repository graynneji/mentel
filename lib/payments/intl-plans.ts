// lib/payments/intl-plans.ts
//
// USD pricing shown to non-Nigerian visitors and charged via Flutterwave.
// Nigerian visitors are unaffected — they keep seeing/paying the NGN
// prices in lib/payments/plans.ts via Paystack, exactly as before.
//
// Plan keys (once/care/plus) are the same ones used across the NGN side
// so a single `form.plan` value works for both currencies — only the
// price lookup differs based on visitor country.
//
// NOTE ON THE PLUS/"EXTENSIVE CARE" NUMBERS: only the Care tier's price
// ($45/week, $160/month, save $20) was specified explicitly. The Plus
// figures below scale that same ratio (2x the sessions -> 2x the price,
// same ~11% monthly discount) to $90/week, $320/month, save $40. This is
// a placeholder assumption, not a quoted price — change monthlyUSD /
// weeklyEquivalentUSD below to whatever you actually want to charge and
// everything (checkout amount, plan cards, confirmation emails) follows.
export interface IntlPlanDefinition {
  key: string;
  label: string; // must match the NGN plan label 1:1 (see lib/payments/plans.ts) — record-payment.ts resolves session count/plan type from this string regardless of currency
  monthlyUSD: number; // the actual amount charged for care/plus (once is a flat one-time charge, no weekly/monthly framing)
  weeklyEquivalentUSD: number | null; // informational only ("that's $45/week") — never charged directly
  savingsUSD: number | null; // monthlyUSD saved vs. paying weeklyEquivalentUSD x 4, shown as a badge
  sessions: number;
  description: string;
  features: string[];
}

export const INTL_PLAN_CURRENCY = "USD" as const;

export const INTL_PLANS: Record<string, IntlPlanDefinition> = {
  once: {
    key: "once",
    label: "One Session",
    monthlyUSD: 15,
    weeklyEquivalentUSD: null,
    savingsUSD: null,
    sessions: 1,
    description: "Pay as you go",
    features: ["Pay as you go", "Standard booking", "45-minute session"],
  },
  care: {
    key: "care",
    label: "Mentel Care",
    monthlyUSD: 160,
    weeklyEquivalentUSD: 45,
    savingsUSD: 20,
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
    monthlyUSD: 320,
    weeklyEquivalentUSD: 90,
    savingsUSD: 40,
    sessions: 8,
    description: "8 sessions/month — intensive support",
    features: [
      "8 therapy sessions/month (ideal for intensive support)",
      "Same-day or next-day appointment access",
      "Everything in Care, plus premium 24/7 support",
    ],
  },
};

export function resolveIntlPlan(key: string): IntlPlanDefinition | undefined {
  return INTL_PLANS[key];
}

/** Amount actually charged, in cents — the only number the Flutterwave initialize route trusts. */
export function intlPlanAmountCents(key: string): number {
  const plan = resolveIntlPlan(key);
  return Math.round((plan?.monthlyUSD ?? INTL_PLANS.once.monthlyUSD) * 100);
}
