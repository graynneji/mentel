// // lib/validations/cmhc.ts
// import { z } from "zod";

// // ── Step 1 — Personal Information ────────────────────────────────────────────
// export const cmhcStep1Schema = z.object({
//   firstName: z.string().trim().min(2, "First name is required"),
//   lastName: z.string().trim().min(2, "Last name is required"),
//   email: z.string().trim().email("Enter a valid email address"),
//   phone: z.string().trim().min(7, "Enter a valid phone number"),
//   country: z.string().trim().min(2, "Country is required"),
//   state: z.string().trim().min(2, "State is required"),
//   city: z.string().trim().min(2, "City is required"),
//   gender: z.string().optional(),
//   ageRange: z.string().optional(),
//   occupation: z.string().optional(),
//   linkedin: z
//     .string()
//     .trim()
//     .url("Enter a valid URL")
//     .optional()
//     .or(z.literal("")),
// });

// // ── Step 2 — Professional Background ─────────────────────────────────────────
// export const cmhcStep2Schema = z.object({
//   highestEducation: z.string().trim().min(1, "Required"),
//   currentRole: z.string().trim().min(1, "Required"),
//   yearsExperience: z.string().trim().min(1, "Required"),
//   whyJoining: z
//     .string()
//     .trim()
//     .min(10, "Tell us a bit more (min 10 characters)"),
//   hasCoachedBefore: z.boolean(),
//   emergencyContactName: z.string().trim().min(2, "Required"),
//   emergencyContactPhone: z.string().trim().min(7, "Enter a valid phone number"),
// });

// // ── Step 3 — Programme Details ────────────────────────────────────────────────
// export const CMHC_PRICING_PLANS = [
//   "starter",
//   "professional",
//   "premium",
// ] as const;
// export const CMHC_PAYMENT_PLANS = ["full", "installment"] as const;

// export const cmhcStep3Schema = z.object({
//   cohortId: z.string().min(1, "Please select a cohort"),
//   pricingPlan: z.enum(CMHC_PRICING_PLANS),
//   paymentPlan: z.enum(CMHC_PAYMENT_PLANS),
//   couponCode: z.string().trim().optional().or(z.literal("")),
//   acceptedCodeOfEthics: z.boolean().refine((v) => v === true, {
//     message: "You must accept the Code of Ethics",
//   }),
//   acceptedScopeOfPractice: z.boolean().refine((v) => v === true, {
//     message: "You must accept the Scope of Practice",
//   }),
//   agreedToTerms: z.boolean().refine((v) => v === true, {
//     message: "You must agree to the Terms",
//   }),
// });

// // ── Combined payload sent to POST /api/cmhc/register ─────────────────────────
// // Steps 1–3 are submitted together when the user reaches the Review step;
// // step 4 (Review) has no new fields, it just re-displays this payload.
// export const cmhcRegistrationSchema = cmhcStep1Schema
//   .merge(cmhcStep2Schema)
//   .merge(cmhcStep3Schema);

// export type CMHCStep1Input = z.infer<typeof cmhcStep1Schema>;
// export type CMHCStep2Input = z.infer<typeof cmhcStep2Schema>;
// export type CMHCStep3Input = z.infer<typeof cmhcStep3Schema>;
// export type CMHCRegistrationInput = z.infer<typeof cmhcRegistrationSchema>;

// // ── Payment initiation payload sent to POST /api/cmhc/payment/initialize ─────
// export const cmhcPaymentInitSchema = z.object({
//   registrationId: z.string().min(1),
//   installmentNumber: z.number().int().min(1).max(3).optional(), // omit = full payment
// });
