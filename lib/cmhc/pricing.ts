// // lib/cmhc/pricing.ts
// //
// // All CMHC pricing lives here, server-side only. The client never sends a
// // price — it sends a plan id and the server looks up the amount, exactly
// // like your existing app/api/paystack/initialize/route.ts pattern.

// export type CMHCPricingPlanId = "starter" | "professional" | "premium";

// export const CMHC_PLANS: Record<
//   CMHCPricingPlanId,
//   { label: string; priceNaira: number; installments: number }
// > = {
//   starter: { label: "Starter", priceNaira: 180_000, installments: 2 },
//   professional: { label: "Professional", priceNaira: 280_000, installments: 3 },
//   premium: { label: "Premium", priceNaira: 420_000, installments: 3 },
// };

// // Simple fixed coupon table. Move to the `Setting` model if you want these
// // editable from an admin UI without a redeploy.
// const COUPONS: Record<string, { percentOff: number; expiresAt?: string }> = {
//   EARLYBIRD10: { percentOff: 10 },
//   MENTELSTAFF: { percentOff: 100 },
// };

// export function nairaToKobo(naira: number) {
//   return Math.round(naira * 100);
// }

// /** Resolves the final full-programme price in kobo, applying a coupon if valid. */
// export function resolveCMHCAmountKobo(
//   planId: CMHCPricingPlanId,
//   couponCode?: string | null,
// ): { amountKobo: number; appliedCoupon: string | null } {
//   const plan = CMHC_PLANS[planId];
//   let priceNaira = plan.priceNaira;
//   let appliedCoupon: string | null = null;

//   if (couponCode) {
//     const coupon = COUPONS[couponCode.trim().toUpperCase()];
//     if (
//       coupon &&
//       (!coupon.expiresAt || new Date(coupon.expiresAt) > new Date())
//     ) {
//       priceNaira = priceNaira * (1 - coupon.percentOff / 100);
//       appliedCoupon = couponCode.trim().toUpperCase();
//     }
//   }

//   return { amountKobo: nairaToKobo(priceNaira), appliedCoupon };
// }

// /**
//  * Splits a full amount into N installments. Any rounding remainder is added
//  * to the final installment so the sum always equals the full amount exactly.
//  */
// export function splitIntoInstallments(
//   amountKobo: number,
//   count: number,
// ): number[] {
//   const base = Math.floor(amountKobo / count);
//   const installments = Array(count).fill(base);
//   const remainder = amountKobo - base * count;
//   installments[count - 1] += remainder;
//   return installments;
// }

// /** Amount due for a specific installment number (1-indexed), or the full amount if installmentNumber is omitted. */
// export function resolveDueAmountKobo(
//   planId: CMHCPricingPlanId,
//   couponCode: string | null | undefined,
//   installmentNumber?: number,
// ): {
//   amountKobo: number;
//   appliedCoupon: string | null;
//   totalInstallments: number;
// } {
//   const { amountKobo: fullAmount, appliedCoupon } = resolveCMHCAmountKobo(
//     planId,
//     couponCode,
//   );
//   const plan = CMHC_PLANS[planId];

//   if (!installmentNumber) {
//     return { amountKobo: fullAmount, appliedCoupon, totalInstallments: 1 };
//   }

//   const parts = splitIntoInstallments(fullAmount, plan.installments);
//   const idx = Math.min(installmentNumber, plan.installments) - 1;
//   return {
//     amountKobo: parts[idx],
//     appliedCoupon,
//     totalInstallments: plan.installments,
//   };
// }
