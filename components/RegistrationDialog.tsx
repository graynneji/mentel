// "use client";

// // components/cmhc/registration-dialog.tsx
// //
// // Requires: npm i react-hook-form @hookform/resolvers zod lucide-react
// // Requires: <Script src="https://js.paystack.co/v2/inline.js" /> — included below via next/script.
// // No shadcn/Radix — the modal and form controls are plain Tailwind + React state.

// import { useEffect, useState } from "react";
// import Script from "next/script";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { CheckCircle2, ArrowLeft, ArrowRight, Loader2, X } from "lucide-react";
// import {
//   cmhcRegistrationSchema,
//   type CMHCRegistrationInput,
//   CMHC_PRICING_PLANS,
// } from "@/lib/validations/cmhc";
// import { CMHC_PLANS, type CMHCPricingPlanId } from "@/lib/cmhc/pricing";

// declare global {
//   interface Window {
//     PaystackPop: { resumeTransaction: (accessCode: string, opts?: unknown) => void };
//   }
// }

// type Cohort = { id: string; name: string; startDate: string; seatsRemaining: number };

// const STEP_LABELS = ["Personal", "Background", "Programme", "Review", "Payment"];

// const FIELDS_BY_STEP: (keyof CMHCRegistrationInput)[][] = [
//   ["firstName", "lastName", "email", "phone", "country", "state", "city"],
//   ["highestEducation", "currentRole", "yearsExperience", "whyJoining", "emergencyContactName", "emergencyContactPhone"],
//   ["cohortId", "pricingPlan", "paymentPlan", "acceptedCodeOfEthics", "acceptedScopeOfPractice", "agreedToTerms"],
// ];

// const inputClass =
//   "w-full rounded-md border border-[--color-dark]/15 bg-white px-3 py-2 text-sm text-[--color-dark] outline-none focus:border-[--color-sage] focus:ring-1 focus:ring-[--color-sage]";
// const labelClass = "text-xs text-[--color-dark]/70 mb-1 block";

// export function RegistrationDialog({
//   cohorts,
//   trigger,
// }: {
//   cohorts: Cohort[];
//   trigger: React.ReactNode;
// }) {
//   const [open, setOpen] = useState(false);
//   const [step, setStep] = useState(0); // 0-4
//   const [submitting, setSubmitting] = useState(false);
//   const [serverError, setServerError] = useState<string | null>(null);
//   const [registrationId, setRegistrationId] = useState<string | null>(null);
//   const [amountKobo, setAmountKobo] = useState<number | null>(null);
//   const [paid, setPaid] = useState(false);

//   // Lock body scroll while the modal is open
//   useEffect(() => {
//     document.body.style.overflow = open ? "hidden" : "";
//     return () => { document.body.style.overflow = ""; };
//   }, [open]);

//   const form = useForm<CMHCRegistrationInput>({
//     resolver: zodResolver(cmhcRegistrationSchema),
//     defaultValues: {
//       hasCoachedBefore: false,
//       pricingPlan: "professional",
//       paymentPlan: "full",
//       acceptedCodeOfEthics: false,
//       acceptedScopeOfPractice: false,
//       agreedToTerms: false,
//       country: "Nigeria",
//     },
//   });

//   const { register, handleSubmit, trigger: triggerValidation, watch, setValue, formState } = form;
//   const values = watch();

//   async function goNext() {
//     if (step < 3) {
//       const fields = FIELDS_BY_STEP[step];
//       const valid = await triggerValidation(fields);
//       if (!valid) return;
//       setStep((s) => s + 1);
//       return;
//     }
//     if (step === 3) {
//       await handleSubmit(onSaveRegistration)();
//     }
//   }

//   function goBack() {
//     setServerError(null);
//     setStep((s) => Math.max(0, s - 1));
//   }

//   async function onSaveRegistration(data: CMHCRegistrationInput) {
//     setSubmitting(true);
//     setServerError(null);
//     try {
//       const res = await fetch("/api/cmhc/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });
//       const json = await res.json();
//       if (!json.success) {
//         setServerError(json.error || "Please check the form for errors.");
//         return;
//       }
//       setRegistrationId(json.registrationId);
//       setAmountKobo(json.amountKobo);
//       setStep(4);
//     } catch {
//       setServerError("Something went wrong. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   async function payNow(installmentNumber?: number) {
//     if (!registrationId) return;
//     setSubmitting(true);
//     setServerError(null);
//     try {
//       const res = await fetch("/api/cmhc/payment/initialize", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ registrationId, installmentNumber }),
//       });
//       const json = await res.json();
//       if (!json.success) {
//         setServerError(json.error || "Could not start payment.");
//         return;
//       }
//       window.PaystackPop.resumeTransaction(json.accessCode, {
//         onSuccess: () => setPaid(true),
//       });
//     } catch {
//       setServerError("Could not start payment. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   const selectedPlan = CMHC_PLANS[values.pricingPlan as CMHCPricingPlanId];

//   function closeAndReset() {
//     setOpen(false);
//     setStep(0);
//     setPaid(false);
//     setServerError(null);
//   }

//   return (
//     <>
//       <Script src="https://js.paystack.co/v2/inline.js" strategy="lazyOnload" />
//       <span onClick={() => setOpen(true)}>{trigger}</span>

//       {open && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
//           onClick={(e) => { if (e.target === e.currentTarget) closeAndReset(); }}
//         >
//           <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-[--color-cream] shadow-xl">
//             <button
//               onClick={closeAndReset}
//               aria-label="Close"
//               className="absolute right-4 top-4 text-[--color-dark]/40 hover:text-[--color-dark]"
//             >
//               <X className="h-5 w-5" />
//             </button>

//             {paid ? (
//               <div className="p-10 text-center space-y-4">
//                 <CheckCircle2 className="mx-auto h-12 w-12 text-[--color-sage]" />
//                 <h3 className="font-serif text-2xl text-[--color-dark]">Congratulations!</h3>
//                 <p className="text-[--color-dark]/70">
//                   Welcome to the Mentel Certified Mental Health Coach programme. A confirmation
//                   email with your cohort schedule, onboarding checklist, and access to the student
//                   portal is on its way to your inbox.
//                 </p>
//                 <button
//                   onClick={closeAndReset}
//                   className="w-full rounded-md bg-[--color-sage] py-2.5 text-white font-medium hover:bg-[--color-teal]"
//                 >
//                   Done
//                 </button>
//               </div>
//             ) : (
//               <div className="p-6 sm:p-8">
//                 <div className="h-1 w-full rounded-full bg-[--color-dark]/10 mb-1 overflow-hidden">
//                   <div
//                     className="h-full bg-[--color-sage] transition-all"
//                     style={{ width: `${((step + 1) / 5) * 100}%` }}
//                   />
//                 </div>
//                 <p className="text-xs uppercase tracking-wide text-[--color-dark]/50 mb-6">
//                   Step {step + 1} of 5 — {STEP_LABELS[step]}
//                 </p>

//                 {step === 0 && (
//                   <div className="space-y-4">
//                     <h3 className="font-serif text-xl text-[--color-dark]">Personal information</h3>
//                     <div className="grid grid-cols-2 gap-3">
//                       <Field label="First name" error={formState.errors.firstName?.message}>
//                         <input className={inputClass} {...register("firstName")} />
//                       </Field>
//                       <Field label="Last name" error={formState.errors.lastName?.message}>
//                         <input className={inputClass} {...register("lastName")} />
//                       </Field>
//                     </div>
//                     <Field label="Email" error={formState.errors.email?.message}>
//                       <input type="email" className={inputClass} {...register("email")} />
//                     </Field>
//                     <Field label="Phone" error={formState.errors.phone?.message}>
//                       <input className={inputClass} {...register("phone")} />
//                     </Field>
//                     <div className="grid grid-cols-3 gap-3">
//                       <Field label="Country" error={formState.errors.country?.message}>
//                         <input className={inputClass} {...register("country")} />
//                       </Field>
//                       <Field label="State" error={formState.errors.state?.message}>
//                         <input className={inputClass} {...register("state")} />
//                       </Field>
//                       <Field label="City" error={formState.errors.city?.message}>
//                         <input className={inputClass} {...register("city")} />
//                       </Field>
//                     </div>
//                     <div className="grid grid-cols-2 gap-3">
//                       <Field label="Gender">
//                         <input className={inputClass} {...register("gender")} />
//                       </Field>
//                       <Field label="Age range">
//                         <input placeholder="25–34" className={inputClass} {...register("ageRange")} />
//                       </Field>
//                     </div>
//                     <Field label="Occupation">
//                       <input className={inputClass} {...register("occupation")} />
//                     </Field>
//                     <Field label="LinkedIn (optional)" error={formState.errors.linkedin?.message}>
//                       <input placeholder="https://linkedin.com/in/..." className={inputClass} {...register("linkedin")} />
//                     </Field>
//                   </div>
//                 )}

//                 {step === 1 && (
//                   <div className="space-y-4">
//                     <h3 className="font-serif text-xl text-[--color-dark]">Professional background</h3>
//                     <Field label="Highest education" error={formState.errors.highestEducation?.message}>
//                       <input className={inputClass} {...register("highestEducation")} />
//                     </Field>
//                     <Field label="Current role" error={formState.errors.currentRole?.message}>
//                       <input className={inputClass} {...register("currentRole")} />
//                     </Field>
//                     <Field label="Years of experience" error={formState.errors.yearsExperience?.message}>
//                       <input className={inputClass} {...register("yearsExperience")} />
//                     </Field>
//                     <Field label="Why are you joining?" error={formState.errors.whyJoining?.message}>
//                       <textarea rows={3} className={inputClass} {...register("whyJoining")} />
//                     </Field>
//                     <Field label="Have you coached before?">
//                       <select
//                         className={inputClass}
//                         onChange={(e) => setValue("hasCoachedBefore", e.target.value === "yes")}
//                         defaultValue="no"
//                       >
//                         <option value="no">No</option>
//                         <option value="yes">Yes</option>
//                       </select>
//                     </Field>
//                     <div className="grid grid-cols-2 gap-3">
//                       <Field label="Emergency contact name" error={formState.errors.emergencyContactName?.message}>
//                         <input className={inputClass} {...register("emergencyContactName")} />
//                       </Field>
//                       <Field label="Emergency contact phone" error={formState.errors.emergencyContactPhone?.message}>
//                         <input className={inputClass} {...register("emergencyContactPhone")} />
//                       </Field>
//                     </div>
//                   </div>
//                 )}

//                 {step === 2 && (
//                   <div className="space-y-4">
//                     <h3 className="font-serif text-xl text-[--color-dark]">Programme details</h3>
//                     <Field label="Cohort" error={formState.errors.cohortId?.message}>
//                       <select
//                         className={inputClass}
//                         defaultValue=""
//                         onChange={(e) => setValue("cohortId", e.target.value)}
//                       >
//                         <option value="" disabled>Choose a cohort</option>
//                         {cohorts.map((c) => (
//                           <option key={c.id} value={c.id} disabled={c.seatsRemaining <= 0}>
//                             {c.name} — {c.seatsRemaining} seats left
//                           </option>
//                         ))}
//                       </select>
//                     </Field>
//                     <Field label="Pricing plan">
//                       <select
//                         className={inputClass}
//                         defaultValue="professional"
//                         onChange={(e) => setValue("pricingPlan", e.target.value as CMHCRegistrationInput["pricingPlan"])}
//                       >
//                         {CMHC_PRICING_PLANS.map((p) => (
//                           <option key={p} value={p}>
//                             {CMHC_PLANS[p].label} — ₦{CMHC_PLANS[p].priceNaira.toLocaleString()}
//                           </option>
//                         ))}
//                       </select>
//                     </Field>
//                     <Field label="Payment plan">
//                       <select
//                         className={inputClass}
//                         defaultValue="full"
//                         onChange={(e) => setValue("paymentPlan", e.target.value as CMHCRegistrationInput["paymentPlan"])}
//                       >
//                         <option value="full">Pay in full</option>
//                         <option value="installment">Pay in {selectedPlan.installments} installments</option>
//                       </select>
//                     </Field>
//                     <Field label="Coupon code (optional)">
//                       <input className={inputClass} {...register("couponCode")} />
//                     </Field>
//                     <div className="space-y-2 pt-2 border-t border-[--color-dark]/10">
//                       <Checkbox
//                         label="I accept the Code of Ethics"
//                         error={formState.errors.acceptedCodeOfEthics?.message}
//                         onChange={(v) => setValue("acceptedCodeOfEthics", v)}
//                       />
//                       <Checkbox
//                         label="I accept the Scope of Practice"
//                         error={formState.errors.acceptedScopeOfPractice?.message}
//                         onChange={(v) => setValue("acceptedScopeOfPractice", v)}
//                       />
//                       <Checkbox
//                         label="I agree to the Terms & Conditions"
//                         error={formState.errors.agreedToTerms?.message}
//                         onChange={(v) => setValue("agreedToTerms", v)}
//                       />
//                     </div>
//                   </div>
//                 )}

//                 {step === 3 && (
//                   <div className="space-y-3">
//                     <h3 className="font-serif text-xl text-[--color-dark]">Review your details</h3>
//                     <SummaryRow label="Name" value={`${values.firstName} ${values.lastName}`} onEdit={() => setStep(0)} />
//                     <SummaryRow label="Email" value={values.email} onEdit={() => setStep(0)} />
//                     <SummaryRow label="Phone" value={values.phone} onEdit={() => setStep(0)} />
//                     <SummaryRow label="Location" value={`${values.city}, ${values.state}, ${values.country}`} onEdit={() => setStep(0)} />
//                     <SummaryRow label="Current role" value={values.currentRole} onEdit={() => setStep(1)} />
//                     <SummaryRow
//                       label="Plan"
//                       value={`${CMHC_PLANS[values.pricingPlan as CMHCPricingPlanId].label} · ${values.paymentPlan === "full" ? "Full payment" : "Installments"}`}
//                       onEdit={() => setStep(2)}
//                     />
//                     {serverError && <p className="text-sm text-red-600">{serverError}</p>}
//                   </div>
//                 )}

//                 {step === 4 && registrationId && amountKobo !== null && (
//                   <div className="space-y-4 text-center">
//                     <h3 className="font-serif text-xl text-[--color-dark]">Complete your payment</h3>
//                     <p className="text-3xl font-serif text-[--color-sage]">
//                       ₦{(amountKobo / 100).toLocaleString()}
//                     </p>
//                     <p className="text-sm text-[--color-dark]/60">
//                       {values.paymentPlan === "installment"
//                         ? `Installment 1 of ${selectedPlan.installments} — the rest will be invoiced by email.`
//                         : "One-time payment, secured via Paystack."}
//                     </p>
//                     {serverError && <p className="text-sm text-red-600">{serverError}</p>}
//                     <button
//                       disabled={submitting}
//                       onClick={() => payNow(values.paymentPlan === "installment" ? 1 : undefined)}
//                       className="w-full flex items-center justify-center gap-2 rounded-md bg-[--color-sage] py-2.5 text-white font-medium hover:bg-[--color-teal] disabled:opacity-60"
//                     >
//                       {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Pay with Paystack"}
//                     </button>
//                   </div>
//                 )}

//                 {step < 4 && (
//                   <div className="flex justify-between mt-8">
//                     <button
//                       onClick={goBack}
//                       disabled={step === 0}
//                       className="flex items-center gap-1 text-sm text-[--color-dark]/60 disabled:opacity-30 hover:text-[--color-dark]"
//                     >
//                       <ArrowLeft className="h-4 w-4" /> Back
//                     </button>
//                     <button
//                       onClick={goNext}
//                       disabled={submitting}
//                       className="flex items-center gap-1 rounded-md bg-[--color-sage] px-5 py-2.5 text-sm font-medium text-white hover:bg-[--color-teal] disabled:opacity-60"
//                     >
//                       {submitting ? (
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                       ) : step === 3 ? (
//                         "Confirm & continue to payment"
//                       ) : (
//                         <>Next <ArrowRight className="h-4 w-4" /></>
//                       )}
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// function Field({
//   label,
//   error,
//   children,
// }: {
//   label: string;
//   error?: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <div>
//       <label className={labelClass}>{label}</label>
//       {children}
//       {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
//     </div>
//   );
// }

// function Checkbox({
//   label,
//   error,
//   onChange,
// }: {
//   label: string;
//   error?: string;
//   onChange: (v: boolean) => void;
// }) {
//   return (
//     <div>
//       <label className="flex items-start gap-2 text-sm text-[--color-dark]/80 cursor-pointer">
//         <input type="checkbox" className="mt-1" onChange={(e) => onChange(e.target.checked)} />
//         {label}
//       </label>
//       {error && <p className="text-xs text-red-600 ml-6">{error}</p>}
//     </div>
//   );
// }

// function SummaryRow({ label, value, onEdit }: { label: string; value?: string; onEdit: () => void }) {
//   return (
//     <div className="flex items-center justify-between border-b border-[--color-dark]/10 py-2">
//       <div>
//         <p className="text-xs text-[--color-dark]/50">{label}</p>
//         <p className="text-sm text-[--color-dark]">{value || "—"}</p>
//       </div>
//       <button onClick={onEdit} className="text-xs text-[--color-sage] underline underline-offset-2">
//         Edit
//       </button>
//     </div>
//   );
// }