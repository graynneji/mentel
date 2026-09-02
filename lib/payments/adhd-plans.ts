// // lib/payments/adhd-plans.ts
// //
// // Pricing for the ADHD self-assessment report product. Mirrors the
// // conventions in lib/payments/plans.ts (single source of truth for price,
// // read by the checkout component, the Flutterwave initialize call, and the
// // webhook/verify handler — never trust a client-sent amount).

// export interface AdhdPlanDefinition {
//   key: string;
//   label: string; // sent as tx_ref prefix / metadata, matched back on verify
//   amountNGN: number;
//   description: string;
//   features: string[];
// }

// export const ADHD_PLANS: Record<string, AdhdPlanDefinition> = {
//   report: {
//     key: "report",
//     label: "ADHD Full Report",
//     amountNGN: 14_500, // ≈ $19 self-guided tier — adjust to live FX as needed
//     description: "Your full personalised report",
//     features: [
//       "Complete domain-by-domain breakdown",
//       "Executive function pattern map",
//       "Personalised, practical strategies",
//       "Doctor-ready discussion summary (PDF)",
//     ],
//   },
//   toolkit: {
//     key: "toolkit",
//     label: "ADHD Report + Toolkit",
//     amountNGN: 34_500, // ≈ $47 comprehensive tier
//     description: "Full report plus planning toolkit",
//     features: [
//       "Everything in the Full Report",
//       "Executive function workbook",
//       "Weekly planning templates",
//       "Priority-booked intro call with a licensed professional",
//     ],
//   },
// };

// export function resolveAdhdPlan(key: string): AdhdPlanDefinition {
//   return ADHD_PLANS[key] ?? ADHD_PLANS.report;
// }

// lib/payments/adhd-plans.ts
//
// Pricing for the ADHD self-assessment report product. Mirrors the
// conventions in lib/payments/plans.ts (single source of truth for price,
// read by the checkout component, the Flutterwave initialize call, and the
// webhook/verify handler — never trust a client-sent amount).

export interface AdhdPlanDefinition {
  key: string;
  label: string; // sent as tx_ref prefix / metadata, matched back on verify
  amountUSD: number; // authoritative unit — Flutterwave charged in USD per request
  description: string;
  features: string[];
}

export const ADHD_PLAN_CURRENCY = "USD" as const;

export const ADHD_PLANS: Record<string, AdhdPlanDefinition> = {
  report: {
    key: "report",
    label: "ADHD Full Report",
    amountUSD: 5, // ≈ $19 self-guided tier — adjust to live FX as needed
    // amountUSD: 19,
    description: "Your full personalised report",
    features: [
      "Complete domain-by-domain breakdown",
      "Executive function pattern map",
      "Personalised, practical strategies",
      "Doctor-ready discussion summary (PDF)",
    ],
  },
  toolkit: {
    key: "toolkit",
    label: "ADHD Report + Toolkit",
    amountUSD: 19, // ≈ $47 comprehensive tier
    // amountUSD: 47,
    description: "Full report plus planning toolkit",
    features: [
      "Everything in the Full Report",
      "Executive function workbook",
      "Weekly planning templates",
      "Priority-booked intro call with a licensed professional",
    ],
  },
};

export function resolveAdhdPlan(key: string): AdhdPlanDefinition {
  return ADHD_PLANS[key] ?? ADHD_PLANS.report;
}
