// // lib/payments/record-payment.ts
// //
// // The missing piece: previously, a successful Paystack payment only ever
// // triggered analytics events and confirmation emails — nothing was ever
// // written to the Lead/Payment tables, so paying clients were completely
// // invisible in /admin/payments and /admin/patients. This is the one place
// // that actually persists a confirmed payment, called from both:
// //   - app/api/paystack/webhook/route.ts (server-to-server, authoritative,
// //     fires even if the client's browser never redirects back)
// //   - app/api/paystack/verify/route.ts (the browser redirect — kept as a
// //     second, redundant call site so a payment still gets recorded even
// //     if the webhook is slow or briefly misconfigured)
// //
// // Both call sites pass the same Paystack `reference`, and this function
// // is idempotent on that reference — whichever call lands first creates
// // the record, the second is a safe no-op. No duplicate payments, no
// // double-booked session packages, regardless of which route fires first
// // or whether both fire.

// import { db } from "@/lib/db";

// export interface RecordPaymentInput {
//   reference: string;
//   email: string;
//   name: string;
//   phone?: string;
//   amountKobo: number;
//   currency: string;
//   method: string; // Paystack "channel": card | bank | ussd | ...
//   plan: string; // "Monthly" | "Single session" | whatever your metadata sends
//   reason?: string; // what they're seeking support for, if collected
//   paidAt: Date;
// }

// export interface RecordPaymentResult {
//   created: boolean; // false if this reference was already recorded (idempotent replay)
//   paymentId: string;
//   leadId: string;
//   packageId: string | null;
// }

// function isMonthlyPlan(plan: string): boolean {
//   return plan.toLowerCase().includes("month");
// }

// export async function recordPayment(input: RecordPaymentInput): Promise<RecordPaymentResult> {
//   // Idempotency guard — the webhook and the browser-redirect verify route
//   // can both call this for the same payment; only the first should do
//   // anything.
//   const existing = await db.payment.findUnique({
//     where: { reference: input.reference },
//     include: { package: true },
//   });
//   if (existing) {
//     return {
//       created: false,
//       paymentId: existing.id,
//       leadId: existing.leadId,
//       packageId: existing.package?.id ?? null,
//     };
//   }

//   // Find or create the Lead. Someone can pay without ever having taken
//   // the assessment (a cold booking), so the assessment-only fields get
//   // safe defaults rather than being required — this keeps the existing
//   // Lead schema untouched instead of loosening it to nullable, which
//   // would ripple into every place that already assumes a non-null score.
//   let lead = await db.lead.findFirst({ where: { email: input.email } });
//   if (!lead) {
//     lead = await db.lead.create({
//       data: {
//         name: input.name || input.email.split("@")[0],
//         email: input.email,
//         phone: input.phone || null,
//         score: 0,
//         band: "Unknown",
//         severity: "unknown",
//         answers: {},
//         status: "active",
//         source: "direct",
//       },
//     });
//   } else if (lead.status === "new" || lead.status === "contacted") {
//     await db.lead.update({ where: { id: lead.id }, data: { status: "active" } });
//   }

//   const payment = await db.payment.create({
//     data: {
//       leadId: lead.id,
//       amountKobo: input.amountKobo,
//       currency: input.currency,
//       status: "paid",
//       method: input.method || "card",
//       reference: input.reference,
//       paidAt: input.paidAt,
//       notes: input.reason ? `Plan: ${input.plan} — ${input.reason}` : `Plan: ${input.plan}`,
//     },
//   });

//   // Unlock the session package this payment pays for. "Monthly" = 4
//   // sessions over 30 days; anything else = a single session. Adjust here
//   // if you introduce more plan tiers later.
//   const totalSessions = isMonthlyPlan(input.plan) ? 4 : 1;
//   const periodStart = input.paidAt;
//   const periodEnd = new Date(periodStart);
//   periodEnd.setDate(periodEnd.getDate() + 30);

//   const pkg = await db.package.create({
//     data: {
//       leadId: lead.id,
//       paymentId: payment.id,
//       planType: isMonthlyPlan(input.plan) ? "monthly" : "single",
//       totalSessions,
//       usedSessions: 0,
//       periodStart,
//       periodEnd,
//       status: "active",
//     },
//   });

//   // Ensure a client-portal login exists for this lead, so they can log in
//   // to schedule sessions/renew without any separate signup step.
//   await db.clientAccount.upsert({
//     where: { leadId: lead.id },
//     create: { leadId: lead.id, email: input.email },
//     update: {},
//   });

//   return { created: true, paymentId: payment.id, leadId: lead.id, packageId: pkg.id };
// }

// lib/payments/record-payment.ts
//
// The missing piece: previously, a successful Paystack payment only ever
// triggered analytics events and confirmation emails — nothing was ever
// written to the Lead/Payment tables, so paying clients were completely
// invisible in /admin/payments and /admin/patients. This is the one place
// that actually persists a confirmed payment, called from both:
//   - app/api/paystack/webhook/route.ts (server-to-server, authoritative,
//     fires even if the client's browser never redirects back)
//   - app/api/paystack/verify/route.ts (the browser redirect — kept as a
//     second, redundant call site so a payment still gets recorded even
//     if the webhook is slow or briefly misconfigured)
//
// Both call sites pass the same Paystack `reference`, and this function
// is idempotent on that reference — whichever call lands first creates
// the record, the second is a safe no-op. No duplicate payments, no
// double-booked session packages, regardless of which route fires first
// or whether both fire.

import { db } from "@/lib/db";
import { randomBytes } from "crypto";

const CLIENT_PORTAL_URL =
  process.env.NEXT_PUBLIC_CLIENT_PORTAL_URL ?? "https://app.trymentel.com";
const LOGIN_TOKEN_TTL_MINUTES = 60 * 24 * 3; // 3 days — this link sits in an email, give it more room than the in-app "send me a link" flow (15 min)

export interface RecordPaymentInput {
  reference: string;
  email: string;
  name: string;
  phone?: string;
  amountKobo: number;
  currency: string;
  method: string; // Paystack "channel": card | bank | ussd | ...
  plan: string; // "Monthly" | "Single session" | whatever your metadata sends
  reason?: string; // what they're seeking support for, if collected
  paidAt: Date;
}

export interface RecordPaymentResult {
  created: boolean; // false if this reference was already recorded (idempotent replay)
  paymentId: string;
  leadId: string;
  packageId: string | null;
  portalLoginUrl: string; // one-click link straight into the client portal dashboard
}

function isMonthlyPlan(plan: string): boolean {
  return plan.toLowerCase().includes("month");
}

/** Creates a fresh single-use login token and returns the full magic-link URL into the client portal. */
async function createPortalLoginLink(clientAccountId: string): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + LOGIN_TOKEN_TTL_MINUTES * 60 * 1000);
  await db.clientLoginToken.create({
    data: { clientAccountId, token, expiresAt },
  });
  return `${CLIENT_PORTAL_URL}/api/auth/verify?token=${token}`;
}

export async function recordPayment(
  input: RecordPaymentInput,
): Promise<RecordPaymentResult> {
  // Idempotency guard — the webhook and the browser-redirect verify route
  // can both call this for the same payment; only the first should do
  // anything (beyond generating a fresh login link either way, which is
  // harmless and cheap to do twice).
  const existing = await db.payment.findUnique({
    where: { reference: input.reference },
    include: { package: true },
  });
  if (existing) {
    const account = await db.clientAccount.findUnique({
      where: { leadId: existing.leadId },
    });
    const portalLoginUrl = account
      ? await createPortalLoginLink(account.id)
      : `${CLIENT_PORTAL_URL}/login`;
    return {
      created: false,
      paymentId: existing.id,
      leadId: existing.leadId,
      packageId: existing.package?.id ?? null,
      portalLoginUrl,
    };
  }

  // Find or create the Lead. Someone can pay without ever having taken
  // the assessment (a cold booking), so the assessment-only fields get
  // safe defaults rather than being required — this keeps the existing
  // Lead schema untouched instead of loosening it to nullable, which
  // would ripple into every place that already assumes a non-null score.
  let lead = await db.lead.findFirst({ where: { email: input.email } });
  if (!lead) {
    lead = await db.lead.create({
      data: {
        name: input.name || input.email.split("@")[0],
        email: input.email,
        phone: input.phone || null,
        score: 0,
        band: "Unknown",
        severity: "unknown",
        answers: {},
        status: "active",
        source: "direct",
      },
    });
  } else if (lead.status === "new" || lead.status === "contacted") {
    await db.lead.update({
      where: { id: lead.id },
      data: { status: "active" },
    });
  }

  const payment = await db.payment.create({
    data: {
      leadId: lead.id,
      amountKobo: input.amountKobo,
      currency: input.currency,
      status: "paid",
      method: input.method || "card",
      reference: input.reference,
      paidAt: input.paidAt,
      notes: input.reason
        ? `Plan: ${input.plan} — ${input.reason}`
        : `Plan: ${input.plan}`,
    },
  });

  // Unlock the session package this payment pays for. "Monthly" = 4
  // sessions over 30 days; anything else = a single session. Adjust here
  // if you introduce more plan tiers later.
  const totalSessions = isMonthlyPlan(input.plan) ? 4 : 1;
  const periodStart = input.paidAt;
  const periodEnd = new Date(periodStart);
  periodEnd.setDate(periodEnd.getDate() + 30);

  const pkg = await db.package.create({
    data: {
      leadId: lead.id,
      paymentId: payment.id,
      planType: isMonthlyPlan(input.plan) ? "monthly" : "single",
      totalSessions,
      usedSessions: 0,
      periodStart,
      periodEnd,
      status: "active",
    },
  });

  // Ensure a client-portal login exists for this lead, so they can log in
  // to schedule sessions/renew without any separate signup step.
  const account = await db.clientAccount.upsert({
    where: { leadId: lead.id },
    create: { leadId: lead.id, email: input.email },
    update: {},
  });

  const portalLoginUrl = await createPortalLoginLink(account.id);

  return {
    created: true,
    paymentId: payment.id,
    leadId: lead.id,
    packageId: pkg.id,
    portalLoginUrl,
  };
}
