

// "use client";
// import { useState } from "react";
// import Script from "next/script";
// import { ChevronDown, CheckCircle, Loader2, Zap, Calendar, ArrowLeft } from "lucide-react";

// const REASONS = [
//     "Anxiety", "Depression", "Marriage Counselling", "Grief & Loss",
//     "Trauma & PTSD", "Stress Management", "Self-Esteem & Confidence",
//     "Family Therapy", "Anger Management", "Life Transitions",
//     "Relationship Issues", "Burnout", "Others",
// ];

// const PLANS = [
//     {
//         id: "once",
//         label: "Single Session",
//         price: "₦5,500",
//         originalPrice: "₦35,000",
//         desc: "One-time · Limited offer",
//         badge: "🔥 Limited",
//         badgeStyle: { background: "rgba(192,85,90,0.10)", color: "var(--error)", borderColor: "rgba(192,85,90,0.25)" },
//         perks: ["1 therapy session", "Licensed therapist", "Response within 24hrs"],
//         icon: Zap,
//     },
//     {
//         id: "monthly",
//         label: "Monthly Plan",
//         price: "₦35,000",
//         originalPrice: null,
//         desc: "4 sessions/month",
//         badge: "⭐ Best value",
//         badgeStyle: { background: "rgba(123,169,139,0.12)", color: "var(--sage-dark)", borderColor: "rgba(123,169,139,0.3)" },
//         perks: ["4 sessions/month", "Priority therapist match", "Progress tracking"],
//         icon: Calendar,
//     },
// ];

// interface FormData { name: string; email: string; phone: string; reason: string; plan: string; }
// interface FormErrors { name?: string; email?: string; phone?: string; reason?: string; form?: string; }

// declare global {
//     interface Window {
//         PaystackPop: {
//             setup: (config: {
//                 key: string;
//                 email: string;
//                 firstname?: string;
//                 lastname?: string;
//                 phone?: string;
//                 access_code?: string;
//                 amount?: number;
//                 currency?: string;
//                 ref?: string;
//                 callback: (response: { reference: string }) => void;
//                 onClose: () => void;
//             }) => { openIframe: () => void };
//         };
//         ttq?: { track: (event: string, data?: Record<string, unknown>) => void };
//     }
// }

// const STEP_LABELS = ["Your details", "Choose a plan", "Payment"];

// export default function BookingForm() {
//     const [step, setStep] = useState<1 | 2 | 3>(1);
//     const [form, setForm] = useState<FormData>({ name: "", email: "", phone: "", reason: "", plan: "once" });
//     const [errors, setErrors] = useState<FormErrors>({});
//     const [loading, setLoading] = useState(false);
//     const [success, setSuccess] = useState(false);
//     const [paystackReady, setPaystackReady] = useState(false);

//     const validateStep1 = (): boolean => {
//         const e: FormErrors = {};
//         if (!form.name.trim() || form.name.trim().length < 2) e.name = "Please enter your full name.";
//         if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Please enter a valid email address.";
//         if ((form.phone.replace(/\D/g, "")).length < 7) e.phone = "Please enter a valid phone number.";
//         if (!form.reason) e.reason = "Please select a reason for consultation.";
//         setErrors(e);
//         return Object.keys(e).length === 0;
//     };

//     const handleChange = (field: keyof FormData, value: string) => {
//         setForm((prev) => ({ ...prev, [field]: value }));
//         setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }));
//     };

//     const handleNext = () => {
//         if (step === 1 && validateStep1()) setStep(2);
//         if (step === 2) setStep(3);
//     };

//     const handleBack = () => {
//         if (step === 2) setStep(1);
//         if (step === 3) setStep(2);
//     };

//     const selectedPlan = PLANS.find((p) => p.id === form.plan)!;

//     const handleSubmit = async () => {
//         if (!paystackReady || !window.PaystackPop) {
//             setErrors({ form: "Payment provider is still loading. Please try again." });
//             return;
//         }

//         setLoading(true);

//         try {
//             const res = await fetch("/api/paystack/initialize", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     name: form.name,
//                     email: form.email,
//                     phone: form.phone,
//                     reason: form.reason,
//                     plan: form.plan,
//                 }),
//             });

//             const data = await res.json();

//             if (!res.ok || !data.success) {
//                 setErrors(data.errors ?? { form: data.error ?? "Something went wrong. Please try again." });
//                 setLoading(false);
//                 return;
//             }

//             const handler = window.PaystackPop.setup({
//                 key: process.env.NEXT_PUBLIC_PAYSTACK_KEY!,
//                 email: form.email,
//                 firstname: form.name.split(" ")[0],
//                 lastname: form.name.split(" ").slice(1).join(" ") || undefined,
//                 phone: form.phone,
//                 amount: data.amount,
//                 ref: data.reference,
//                 access_code: data.accessCode,
//                 callback: () => {
//                     setLoading(false);
//                     setSuccess(true);
//                     window.ttq?.track("Place an Order", {
//                         value: data.amount,
//                         currency: "NGN",
//                     });
//                 },
//                 onClose: () => {
//                     setLoading(false);
//                 },
//             });

//             handler.openIframe();

//         } catch (err) {
//             console.error("Payment init error:", err);
//             setErrors({ form: "Network error. Please check your connection and try again." });
//             setLoading(false);
//         }
//     };

//     if (success) {
//         return (
//             <div className="text-center py-10 animate-fade-up">
//                 <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
//                     style={{ background: "linear-gradient(135deg, var(--sage), var(--teal))" }}>
//                     <CheckCircle size={30} color="white" />
//                 </div>
//                 <h3 className="font-cormorant text-2xl font-semibold mb-2" style={{ color: "var(--deep)" }}>
//                     Booking Confirmed
//                 </h3>
//                 <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
//                     Thank you, {form.name.split(" ")[0]}. Your therapist will reach out<br />
//                     within 24 hours to schedule your session.
//                 </p>
//             </div>
//         );
//     }

//     return (
//         <div>
//             <Script
//                 src="https://js.paystack.co/v1/inline.js"
//                 strategy="afterInteractive"
//                 onLoad={() => setPaystackReady(true)}
//             />

//             {/* Step indicator */}
//             <div className="flex items-center gap-0 mb-6">
//                 {STEP_LABELS.map((label, i) => {
//                     const num = i + 1;
//                     const isActive = step === num;
//                     const isDone = step > num;
//                     return (
//                         <div key={num} className="flex items-center" style={{ flex: num < STEP_LABELS.length ? 1 : "none" }}>
//                             <div className="flex flex-col items-center gap-1">
//                                 <div
//                                     className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300"
//                                     style={{
//                                         background: isDone
//                                             ? "linear-gradient(135deg, var(--sage-dark), var(--teal))"
//                                             : isActive
//                                                 ? "linear-gradient(135deg, var(--sage-dark), var(--teal))"
//                                                 : "rgba(123,169,139,0.12)",
//                                         color: isActive || isDone ? "white" : "var(--text-muted)",
//                                     }}
//                                 >
//                                     {isDone ? <CheckCircle size={13} /> : num}
//                                 </div>
//                                 <span
//                                     className="text-xs whitespace-nowrap"
//                                     style={{
//                                         color: isActive ? "var(--sage-dark)" : "var(--text-muted)",
//                                         fontWeight: isActive ? 600 : 400,
//                                     }}
//                                 >
//                                     {label}
//                                 </span>
//                             </div>

//                             {num < STEP_LABELS.length && (
//                                 <div
//                                     className="flex-1 h-px mx-2 mb-5 transition-all duration-500"
//                                     style={{
//                                         background: isDone
//                                             ? "linear-gradient(90deg, var(--sage-dark), var(--teal))"
//                                             : "rgba(123,169,139,0.2)",
//                                     }}
//                                 />
//                             )}
//                         </div>
//                     );
//                 })}
//             </div>

//             {/* ── STEP 1: Personal details ── */}
//             {step === 1 && (
//                 <div className="animate-fade-up">
//                     {/* Name */}
//                     <div className="mb-4">
//                         <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
//                             Full Name
//                         </label>
//                         <input type="text" value={form.name} onChange={(e) => handleChange("name", e.target.value)}
//                             placeholder="Your full name" autoComplete="name"
//                             className={`form-input ${errors.name ? "form-input-error" : ""}`} />
//                         {errors.name && <p className="text-xs mt-1.5" style={{ color: "var(--error)" }}>{errors.name}</p>}
//                     </div>

//                     {/* Email */}
//                     <div className="mb-4">
//                         <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
//                             Email Address
//                         </label>
//                         <input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)}
//                             placeholder="you@example.com" autoComplete="email"
//                             className={`form-input ${errors.email ? "form-input-error" : ""}`} />
//                         {errors.email && <p className="text-xs mt-1.5" style={{ color: "var(--error)" }}>{errors.email}</p>}
//                     </div>

//                     {/* Phone */}
//                     <div className="mb-4">
//                         <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
//                             Phone Number
//                         </label>
//                         <input type="tel" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)}
//                             placeholder="+234 000 0000 000" autoComplete="tel"
//                             className={`form-input ${errors.phone ? "form-input-error" : ""}`} />
//                         {errors.phone && <p className="text-xs mt-1.5" style={{ color: "var(--error)" }}>{errors.phone}</p>}
//                     </div>

//                     {/* Reason */}
//                     <div className="mb-6">
//                         <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
//                             Reason for Consultation
//                         </label>
//                         <div className="relative">
//                             <select value={form.reason} onChange={(e) => handleChange("reason", e.target.value)}
//                                 className={`form-input pr-10 ${errors.reason ? "form-input-error" : ""}`}>
//                                 <option value="" disabled>Select a reason&hellip;</option>
//                                 {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
//                             </select>
//                             <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
//                                 style={{ color: "var(--text-muted)" }} />
//                         </div>
//                         {errors.reason && <p className="text-xs mt-1.5" style={{ color: "var(--error)" }}>{errors.reason}</p>}
//                     </div>

//                     <button
//                         type="button"
//                         onClick={handleNext}
//                         className="w-full py-4 rounded-2xl text-white text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 cursor-pointer"
//                         style={{
//                             background: "linear-gradient(135deg, var(--sage-dark), var(--teal))",
//                             boxShadow: "0 4px 20px rgba(61,139,139,0.25)",
//                         }}
//                     >
//                         Continue to Plans
//                     </button>
//                 </div>
//             )}

//             {/* ── STEP 2: Plan selection ── */}
//             {step === 2 && (
//                 <div className="animate-fade-up">
//                     <div className="flex flex-col gap-2.5 mb-6">
//                         {PLANS.map((plan) => {
//                             const isSelected = form.plan === plan.id;
//                             const Icon = plan.icon;
//                             return (
//                                 <label key={plan.id} className="cursor-pointer block">
//                                     <input type="radio" name="plan" value={plan.id} checked={isSelected}
//                                         onChange={(e) => handleChange("plan", e.target.value)} className="sr-only" />
//                                     <div className="rounded-2xl border-2 p-4 transition-all duration-200 hover:-translate-y-0.5"
//                                         style={{
//                                             background: isSelected ? "rgba(123,169,139,0.08)" : "white",
//                                             borderColor: isSelected ? "var(--sage)" : "var(--border)",
//                                             boxShadow: isSelected ? "0 0 0 3px rgba(123,169,139,0.12)" : "none",
//                                         }}>
//                                         <div className="flex items-center gap-3">
//                                             <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
//                                                 style={{ background: isSelected ? "linear-gradient(135deg, var(--sage-dark), var(--teal))" : "rgba(123,169,139,0.10)" }}>
//                                                 <Icon size={16} color={isSelected ? "white" : "var(--sage-dark)"} />
//                                             </div>
//                                             <div className="flex-1 min-w-0">
//                                                 <div className="flex items-center gap-2 flex-wrap">
//                                                     <span className="text-sm font-semibold" style={{ color: "var(--deep)" }}>{plan.label}</span>
//                                                     <span className="text-xs px-2 py-0.5 rounded-full border font-medium" style={plan.badgeStyle}>{plan.badge}</span>
//                                                 </div>
//                                                 <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{plan.desc}</p>
//                                             </div>
//                                             <div className="text-right flex-shrink-0">
//                                                 <span className="font-cormorant text-xl font-semibold block"
//                                                     style={{ color: isSelected ? "var(--sage-dark)" : "var(--deep)" }}>{plan.price}</span>
//                                                 {plan.originalPrice && (
//                                                     <span className="text-xs line-through opacity-40" style={{ color: "var(--text-muted)" }}>{plan.originalPrice}</span>
//                                                 )}
//                                             </div>
//                                         </div>
//                                         {isSelected && (
//                                             <div className="mt-3 pt-3 flex flex-wrap gap-2" style={{ borderTop: "1px solid rgba(123,169,139,0.2)" }}>
//                                                 {plan.perks.map((perk) => (
//                                                     <span key={perk} className="text-xs px-2.5 py-1 rounded-full"
//                                                         style={{ background: "rgba(123,169,139,0.10)", color: "var(--sage-dark)" }}>
//                                                         ✓ {perk}
//                                                     </span>
//                                                 ))}
//                                             </div>
//                                         )}
//                                     </div>
//                                 </label>
//                             );
//                         })}
//                     </div>

//                     <div className="flex gap-3">
//                         <button
//                             type="button"
//                             onClick={handleBack}
//                             className="flex items-center justify-center gap-1.5 px-4 py-4 rounded-2xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
//                             style={{
//                                 border: "1.5px solid var(--border)",
//                                 color: "var(--text-muted)",
//                                 background: "transparent",
//                             }}
//                         >
//                             <ArrowLeft size={15} />
//                             Back
//                         </button>
//                         <button
//                             type="button"
//                             onClick={handleNext}
//                             className="flex-1 py-4 rounded-2xl text-white text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 cursor-pointer"
//                             style={{
//                                 background: "linear-gradient(135deg, var(--sage-dark), var(--teal))",
//                                 boxShadow: "0 4px 20px rgba(61,139,139,0.25)",
//                             }}
//                         >
//                             Continue — {selectedPlan.price}
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {/* ── STEP 3: Review & pay ── */}
//             {step === 3 && (
//                 <div className="animate-fade-up">
//                     {/* Summary card */}
//                     <div className="rounded-2xl p-4 mb-5"
//                         style={{ background: "rgba(123,169,139,0.06)", border: "1px solid rgba(123,169,139,0.18)" }}>
//                         <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
//                             Booking summary
//                         </p>
//                         <div className="flex flex-col gap-2">
//                             <div className="flex justify-between items-center">
//                                 <span className="text-sm" style={{ color: "var(--text-muted)" }}>Name</span>
//                                 <span className="text-sm font-medium" style={{ color: "var(--deep)" }}>{form.name}</span>
//                             </div>
//                             <div className="flex justify-between items-center">
//                                 <span className="text-sm" style={{ color: "var(--text-muted)" }}>Reason</span>
//                                 <span className="text-sm font-medium" style={{ color: "var(--deep)" }}>{form.reason}</span>
//                             </div>
//                             <div style={{ height: "1px", background: "rgba(123,169,139,0.15)", margin: "4px 0" }} />
//                             <div className="flex justify-between items-center">
//                                 <span className="text-sm" style={{ color: "var(--text-muted)" }}>{selectedPlan.label}</span>
//                                 <div className="text-right">
//                                     <span className="font-cormorant text-lg font-semibold block" style={{ color: "var(--sage-dark)" }}>
//                                         {selectedPlan.price}
//                                     </span>
//                                     {selectedPlan.originalPrice && (
//                                         <span className="text-xs line-through opacity-40" style={{ color: "var(--text-muted)" }}>
//                                             {selectedPlan.originalPrice}
//                                         </span>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* General error */}
//                     {errors.form && (
//                         <div className="rounded-xl px-4 py-3 mb-4 text-sm"
//                             style={{ background: "rgba(192,85,90,0.08)", color: "var(--error)", border: "1px solid rgba(192,85,90,0.2)" }}>
//                             {errors.form}
//                         </div>
//                     )}

//                     {/* Legal */}
//                     <p className="text-center text-xs mb-4 leading-relaxed" style={{ color: "var(--text-muted)" }}>
//                         By submitting you agree to our{" "}
//                         <a href="/terms" className="underline transition-colors" style={{ color: "var(--teal)" }}>Terms of Service</a>{" "}
//                         and{" "}
//                         <a href="/privacy" className="underline transition-colors" style={{ color: "var(--teal)" }}>Privacy Policy</a>.
//                     </p>

//                     <div className="flex gap-3">
//                         <button
//                             type="button"
//                             onClick={handleBack}
//                             disabled={loading}
//                             className="flex items-center justify-center gap-1.5 px-4 py-4 rounded-2xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
//                             style={{
//                                 border: "1.5px solid var(--border)",
//                                 color: "var(--text-muted)",
//                                 background: "transparent",
//                             }}
//                         >
//                             <ArrowLeft size={15} />
//                             Back
//                         </button>
//                         <button
//                             type="button"
//                             onClick={handleSubmit}
//                             disabled={loading}
//                             className="flex-1 py-4 rounded-2xl text-white text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
//                             style={{
//                                 background: "linear-gradient(135deg, var(--sage-dark), var(--teal))",
//                                 boxShadow: loading ? "none" : "0 4px 20px rgba(61,139,139,0.25)",
//                             }}
//                         >
//                             {loading
//                                 ? <><Loader2 size={16} className="animate-spin" />Preparing payment&hellip;</>
//                                 : <>Pay {selectedPlan.price} securely</>
//                             }
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

"use client";
import { useState } from "react";
import Script from "next/script";
import { ChevronDown, CheckCircle, Loader2, Zap, Calendar, ArrowLeft, Wallet, Shield, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

const REASONS = [
    "Anxiety", "Depression", "Marriage Counselling", "Grief & Loss",
    "Trauma & PTSD", "Stress Management", "Self-Esteem & Confidence",
    "Family Therapy", "Anger Management", "Life Transitions",
    "Relationship Issues", "Burnout", "Others",
];

const PLANS = [
    {
        id: "once",
        label: "Single Session",
        price: "₦8,500",
        originalPrice: "₦35,000",
        desc: "One-time · Limited offer",
        badge: "🔥 Limited",
        badgeStyle: { background: "rgba(192,85,90,0.10)", color: "var(--error)", borderColor: "rgba(192,85,90,0.25)" },
        perks: ["1 therapy session", "Licensed therapist", "Response within 24hrs"],
        icon: Zap,
    },
    {
        id: "monthly",
        label: "Monthly Plan",
        price: "₦35,000",
        originalPrice: null,
        desc: "4 sessions/month",
        badge: "⭐ Best value",
        badgeStyle: { background: "rgba(123,169,139,0.12)", color: "var(--sage-dark)", borderColor: "rgba(123,169,139,0.3)" },
        perks: ["4 sessions/month", "Priority therapist match", "Progress tracking"],
        icon: Calendar,
    },
];

const PAYMENT_METHODS = [
    {
        id: "pocket",
        label: "Pay from Pocket",
        desc: "Pay directly with your card or bank transfer",
        icon: Wallet,
        badge: null,
        accentColor: "var(--sage-dark)",
    },
    {
        id: "hmo",
        label: "HMO / Health Insurance",
        desc: "Covered through your health maintenance organisation",
        icon: Shield,
        badge: "Check eligibility",
        accentColor: "var(--teal)",
    },
    {
        id: "corporate",
        label: "Corporate / EAP Plan",
        desc: "Covered by your employer's wellbeing programme",
        icon: Building2,
        badge: "Requires access code",
        accentColor: "#8b6e3d",
    },
];

interface FormData {
    name: string; email: string; phone: string; reason: string;
    plan: string; paymentMethod: string; corporateCode: string;
    hmoProvider: string; hmoPolicyNumber: string;
}
interface FormErrors {
    name?: string; email?: string; phone?: string; reason?: string;
    corporateCode?: string; hmoProvider?: string; hmoPolicyNumber?: string; form?: string;
}

declare global {
    interface Window {
        PaystackPop: {
            setup: (config: {
                key: string; email: string; firstname?: string; lastname?: string;
                phone?: string; access_code?: string; amount?: number; currency?: string;
                ref?: string; callback: (response: { reference: string }) => void; onClose: () => void;
            }) => { openIframe: () => void };
        };
        ttq?: { track: (event: string, data?: Record<string, unknown>) => void };
    }
}

const STEP_LABELS = ["Your details", "Payment method", "Plan & review"];

export default function BookingForm() {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [form, setForm] = useState<FormData>({
        name: "", email: "", phone: "", reason: "", plan: "once",
        paymentMethod: "", corporateCode: "", hmoProvider: "", hmoPolicyNumber: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [paystackReady, setPaystackReady] = useState(false);
    const router = useRouter()

    const validateStep1 = (): boolean => {
        const e: FormErrors = {};
        if (!form.name.trim() || form.name.trim().length < 2) e.name = "Please enter your full name.";
        if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Please enter a valid email address.";
        if ((form.phone.replace(/\D/g, "")).length < 7) e.phone = "Please enter a valid phone number.";
        if (!form.reason) e.reason = "Please select a reason for consultation.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const validateStep2 = (): boolean => {
        if (!form.paymentMethod) { setErrors({ form: "Please select a payment method." }); return false; }
        const e: FormErrors = {};
        if (form.paymentMethod === "corporate" && form.corporateCode.trim().length < 3)
            e.corporateCode = "Please enter a valid corporate access code.";
        if (form.paymentMethod === "hmo") {
            if (!form.hmoProvider.trim()) e.hmoProvider = "Please enter your HMO provider name.";
            if (!form.hmoPolicyNumber.trim()) e.hmoPolicyNumber = "Please enter your policy number.";
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleChange = (field: keyof FormData, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }));
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) setStep(2);
        else if (step === 2 && validateStep2()) setStep(3);
    };

    const handleBack = () => {
        setErrors({});
        if (step === 2) setStep(1);
        else if (step === 3) setStep(2);
    };

    const selectedPlan = PLANS.find((p) => p.id === form.plan)!;
    const selectedMethod = PAYMENT_METHODS.find(m => m.id === form.paymentMethod);
    const isPocketPay = form.paymentMethod === "pocket";

    const handleSubmitPocket = async () => {
        if (!paystackReady || !window.PaystackPop) {
            setErrors({ form: "Payment provider is still loading. Please try again." });
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/paystack/initialize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, reason: form.reason, plan: form.plan }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                setErrors(data.errors ?? { form: data.error ?? "Something went wrong. Please try again." });
                setLoading(false);
                return;
            }
            const handler = window.PaystackPop.setup({
                key: process.env.NEXT_PUBLIC_PAYSTACK_KEY!,
                email: form.email,
                firstname: form.name.split(" ")[0],
                lastname: form.name.split(" ").slice(1).join(" ") || undefined,
                phone: form.phone,
                amount: data.amount,
                ref: data.reference,
                access_code: data.accessCode,
                // callback: () => {
                //     setLoading(false);
                //     setSuccess(true);
                //     window.ttq?.track("Place an Order", { value: data.amount, currency: "NGN" });
                // },
                callback: (response) => {
                    window.ttq?.track("Place an Order", {
                        value: data.amount,
                        currency: "NGN",
                    });

                    router.push(
                        `/verify?reference=${encodeURIComponent(
                            response.reference || data.reference
                        )}`
                    );
                },
                onClose: () => { setLoading(false); },
            });
            handler.openIframe();
        } catch (err: unknown) {
            console.error("Payment init error:", err);
            setErrors({ form: err instanceof Error ? err.message : "Network error. Please check your connection and try again." });
            setLoading(false);
        }
    };

    const handleSubmitCoverage = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name, email: form.email, phone: form.phone, reason: form.reason,
                    message: form.paymentMethod === "corporate"
                        ? `Corporate EAP booking. Access code: ${form.corporateCode}`
                        : `HMO booking. Provider: ${form.hmoProvider}. Policy: ${form.hmoPolicyNumber}`,
                    source: form.paymentMethod === "corporate" ? "corporate_booking" : "hmo_booking",
                }),
            });
            if (res.ok) {
                setSuccess(true);
            } else {
                setErrors({ form: "Something went wrong. Please try again or email us directly." });
            }
        } catch {
            setErrors({ form: "Network error. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        const isCoverage = form.paymentMethod !== "pocket";
        return (
            <div className="text-center py-10 animate-fade-up">
                <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, var(--sage), var(--teal))" }}>
                    <CheckCircle size={30} color="white" />
                </div>
                <h3 className="font-cormorant text-2xl font-semibold mb-2" style={{ color: "var(--deep)" }}>
                    {isCoverage ? "Request Received" : "Booking Confirmed"}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {isCoverage
                        ? <>Thank you, {form.name.split(" ")[0]}. Our team will verify your {form.paymentMethod === "hmo" ? "HMO coverage" : "corporate plan"} and reach out within 24 hours.</>
                        : <>Thank you, {form.name.split(" ")[0]}. Your therapist will reach out<br />within 24 hours to schedule your session.</>
                    }
                </p>
            </div>
        );
    }

    return (
        <form>
            <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" onLoad={() => setPaystackReady(true)} />

            {/* Step indicator */}
            <div className="flex items-center gap-0 mb-6">
                {STEP_LABELS.map((label, i) => {
                    const num = (i + 1) as 1 | 2 | 3;
                    const isActive = step === num;
                    const isDone = step > num;
                    return (
                        <div key={num} className="flex items-center" style={{ flex: num < STEP_LABELS.length ? 1 : "none" }}>
                            <div className="flex flex-col items-center gap-1">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300"
                                    style={{
                                        background: isDone || isActive ? "linear-gradient(135deg, var(--sage-dark), var(--teal))" : "rgba(123,169,139,0.12)",
                                        color: isActive || isDone ? "white" : "var(--text-muted)",
                                    }}>
                                    {isDone ? <CheckCircle size={13} /> : num}
                                </div>
                                <span className="text-xs whitespace-nowrap"
                                    style={{ color: isActive ? "var(--sage-dark)" : "var(--text-muted)", fontWeight: isActive ? 600 : 400 }}>
                                    {label}
                                </span>
                            </div>
                            {num < STEP_LABELS.length && (
                                <div className="flex-1 h-px mx-2 mb-5 transition-all duration-500"
                                    style={{ background: isDone ? "linear-gradient(90deg, var(--sage-dark), var(--teal))" : "rgba(123,169,139,0.2)" }} />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* ── STEP 1: Personal details ── */}
            {step === 1 && (
                <div className="animate-fade-up">
                    <div className="mb-4">
                        <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>Full Name</label>
                        <input type="text" value={form.name} onChange={(e) => handleChange("name", e.target.value)}
                            placeholder="Your full name" autoComplete="name" autoFocus className={`form-input ${errors.name ? "form-input-error" : ""}`} />
                        {errors.name && <p className="text-xs mt-1.5" style={{ color: "var(--error)" }}>{errors.name}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>Email Address</label>
                        <input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)}
                            placeholder="you@example.com" autoComplete="email" className={`form-input ${errors.email ? "form-input-error" : ""}`} />
                        {errors.email && <p className="text-xs mt-1.5" style={{ color: "var(--error)" }}>{errors.email}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>Phone Number</label>
                        <input type="tel" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)}
                            placeholder="+234 000 0000 000" autoComplete="tel" className={`form-input ${errors.phone ? "form-input-error" : ""}`} />
                        {errors.phone && <p className="text-xs mt-1.5" style={{ color: "var(--error)" }}>{errors.phone}</p>}
                    </div>
                    <div className="mb-6">
                        <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>Reason for Consultation</label>
                        <div className="relative">
                            <select value={form.reason} onChange={(e) => handleChange("reason", e.target.value)}
                                className={`form-input pr-10 ${errors.reason ? "form-input-error" : ""}`}>
                                <option value="" disabled>Select a reason&hellip;</option>
                                {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-muted)" }} />
                        </div>
                        {errors.reason && <p className="text-xs mt-1.5" style={{ color: "var(--error)" }}>{errors.reason}</p>}
                    </div>
                    <button type="button" onClick={handleNext}
                        className="w-full py-4 rounded-2xl text-white text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 cursor-pointer"
                        style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))", boxShadow: "0 4px 20px rgba(61,139,139,0.25)" }}>
                        Continue
                    </button>
                </div>
            )}

            {/* ── STEP 2: Payment method ── */}
            {step === 2 && (
                <div className="animate-fade-up">
                    <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>How will you be paying?</p>
                    <div className="flex flex-col gap-2.5 mb-4">
                        {PAYMENT_METHODS.map((method) => {
                            const isSelected = form.paymentMethod === method.id;
                            const Icon = method.icon;
                            return (
                                <label key={method.id} className="cursor-pointer block">
                                    <input type="radio" name="paymentMethod" value={method.id} checked={isSelected}
                                        onChange={(e) => handleChange("paymentMethod", e.target.value)} className="sr-only" />
                                    <div className="rounded-2xl border-2 p-4 transition-all duration-200 hover:-translate-y-0.5"
                                        style={{
                                            background: isSelected ? "rgba(123,169,139,0.08)" : "white",
                                            borderColor: isSelected ? "var(--sage)" : "var(--border)",
                                            boxShadow: isSelected ? "0 0 0 3px rgba(123,169,139,0.12)" : "none",
                                        }}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                                style={{ background: isSelected ? "linear-gradient(135deg, var(--sage-dark), var(--teal))" : "rgba(123,169,139,0.10)" }}>
                                                <Icon size={17} color={isSelected ? "white" : method.accentColor} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-sm font-semibold" style={{ color: "var(--deep)" }}>{method.label}</span>
                                                    {method.badge && (
                                                        <span className="text-xs px-2 py-0.5 rounded-full border font-medium"
                                                            style={{ background: "rgba(123,169,139,0.10)", color: "var(--sage-dark)", borderColor: "rgba(123,169,139,0.25)" }}>
                                                            {method.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{method.desc}</p>
                                            </div>
                                            <div className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all"
                                                style={{ borderColor: isSelected ? "var(--sage)" : "var(--border)", background: isSelected ? "var(--sage)" : "transparent" }}>
                                                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                            </div>
                                        </div>
                                    </div>
                                </label>
                            );
                        })}
                    </div>

                    {/* HMO fields */}
                    {form.paymentMethod === "hmo" && (
                        <div className="rounded-2xl p-4 mb-4 flex flex-col gap-3"
                            style={{ background: "rgba(61,139,139,0.05)", border: "1px solid rgba(61,139,139,0.18)" }}>
                            <p className="text-xs font-semibold" style={{ color: "var(--teal)" }}>Enter your HMO details</p>
                            <div>
                                <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>HMO Provider</label>
                                <input type="text" value={form.hmoProvider} onChange={(e) => handleChange("hmoProvider", e.target.value)}
                                    placeholder="e.g. Reliance HMO, Hygeia, Avon" className={`form-input ${errors.hmoProvider ? "form-input-error" : ""}`} />
                                {errors.hmoProvider && <p className="text-xs mt-1" style={{ color: "var(--error)" }}>{errors.hmoProvider}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>Policy / Enrollee Number</label>
                                <input type="text" value={form.hmoPolicyNumber} onChange={(e) => handleChange("hmoPolicyNumber", e.target.value)}
                                    placeholder="Your policy number" className={`form-input ${errors.hmoPolicyNumber ? "form-input-error" : ""}`} />
                                {errors.hmoPolicyNumber && <p className="text-xs mt-1" style={{ color: "var(--error)" }}>{errors.hmoPolicyNumber}</p>}
                            </div>
                            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                                We'll verify your coverage and schedule your session — usually within 24 hours.
                            </p>
                        </div>
                    )}

                    {/* Corporate code field */}
                    {form.paymentMethod === "corporate" && (
                        <div className="rounded-2xl p-4 mb-4"
                            style={{ background: "rgba(139,110,61,0.05)", border: "1px solid rgba(139,110,61,0.18)" }}>
                            <label className="block text-xs font-semibold mb-2" style={{ color: "#8b6e3d" }}>Corporate / EAP Access Code</label>
                            <input type="text" value={form.corporateCode} onChange={(e) => handleChange("corporateCode", e.target.value.toUpperCase())}
                                placeholder="e.g. CORP-XXXX-XXXX" className={`form-input font-mono tracking-wider ${errors.corporateCode ? "form-input-error" : ""}`} />
                            {errors.corporateCode && <p className="text-xs mt-1" style={{ color: "var(--error)" }}>{errors.corporateCode}</p>}
                            <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                                Your employer or EAP provider will have given you this code. Can't find it? Contact your HR team.
                            </p>
                        </div>
                    )}

                    {errors.form && (
                        <div className="rounded-xl px-4 py-3 mb-4 text-sm"
                            style={{ background: "rgba(192,85,90,0.08)", color: "var(--error)", border: "1px solid rgba(192,85,90,0.2)" }}>
                            {errors.form}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button type="button" onClick={handleBack}
                            className="flex items-center justify-center gap-1.5 px-4 py-4 rounded-2xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                            style={{ border: "1.5px solid var(--border)", color: "var(--text-muted)", background: "transparent" }}>
                            <ArrowLeft size={15} /> Back
                        </button>
                        <button type="button" onClick={handleNext}
                            className="flex-1 py-4 rounded-2xl text-white text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 cursor-pointer"
                            style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))", boxShadow: "0 4px 20px rgba(61,139,139,0.25)" }}>
                            Continue
                        </button>
                    </div>
                </div>
            )}

            {/* ── STEP 3: Plan (pocket only) + Review & confirm ── */}
            {step === 3 && (
                <div className="animate-fade-up">
                    {isPocketPay && (
                        <div className="mb-5">
                            <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>Choose a Plan</p>
                            <div className="flex flex-col gap-2.5">
                                {PLANS.map((plan) => {
                                    const isSelected = form.plan === plan.id;
                                    const Icon = plan.icon;
                                    return (
                                        <label key={plan.id} className="cursor-pointer block">
                                            <input type="radio" name="plan" value={plan.id} checked={isSelected}
                                                onChange={(e) => handleChange("plan", e.target.value)} className="sr-only" />
                                            <div className="rounded-2xl border-2 p-4 transition-all duration-200 hover:-translate-y-0.5"
                                                style={{
                                                    background: isSelected ? "rgba(123,169,139,0.08)" : "white",
                                                    borderColor: isSelected ? "var(--sage)" : "var(--border)",
                                                    boxShadow: isSelected ? "0 0 0 3px rgba(123,169,139,0.12)" : "none",
                                                }}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                                                        style={{ background: isSelected ? "linear-gradient(135deg, var(--sage-dark), var(--teal))" : "rgba(123,169,139,0.10)" }}>
                                                        <Icon size={16} color={isSelected ? "white" : "var(--sage-dark)"} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="text-sm font-semibold" style={{ color: "var(--deep)" }}>{plan.label}</span>
                                                            <span className="text-xs px-2 py-0.5 rounded-full border font-medium" style={plan.badgeStyle}>{plan.badge}</span>
                                                        </div>
                                                        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{plan.desc}</p>
                                                    </div>
                                                    <div className="text-right flex-shrink-0">
                                                        <span className="font-cormorant text-xl font-semibold block"
                                                            style={{ color: isSelected ? "var(--sage-dark)" : "var(--deep)" }}>{plan.price}</span>
                                                        {plan.originalPrice && (
                                                            <span className="text-xs line-through opacity-40" style={{ color: "var(--text-muted)" }}>{plan.originalPrice}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                {isSelected && (
                                                    <div className="mt-3 pt-3 flex flex-wrap gap-2" style={{ borderTop: "1px solid rgba(123,169,139,0.2)" }}>
                                                        {plan.perks.map((perk) => (
                                                            <span key={perk} className="text-xs px-2.5 py-1 rounded-full"
                                                                style={{ background: "rgba(123,169,139,0.10)", color: "var(--sage-dark)" }}>✓ {perk}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Summary card */}
                    <div className="rounded-2xl p-4 mb-5"
                        style={{ background: "rgba(123,169,139,0.06)", border: "1px solid rgba(123,169,139,0.18)" }}>
                        <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>Booking summary</p>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm" style={{ color: "var(--text-muted)" }}>Name</span>
                                <span className="text-sm font-medium" style={{ color: "var(--deep)" }}>{form.name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm" style={{ color: "var(--text-muted)" }}>Reason</span>
                                <span className="text-sm font-medium" style={{ color: "var(--deep)" }}>{form.reason}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm" style={{ color: "var(--text-muted)" }}>Payment via</span>
                                <span className="text-sm font-medium" style={{ color: "var(--deep)" }}>{selectedMethod?.label}</span>
                            </div>
                            {form.paymentMethod === "corporate" && (
                                <div className="flex justify-between items-center">
                                    <span className="text-sm" style={{ color: "var(--text-muted)" }}>Access code</span>
                                    <span className="text-sm font-mono font-medium" style={{ color: "var(--deep)" }}>{form.corporateCode}</span>
                                </div>
                            )}
                            {form.paymentMethod === "hmo" && (
                                <div className="flex justify-between items-center">
                                    <span className="text-sm" style={{ color: "var(--text-muted)" }}>HMO provider</span>
                                    <span className="text-sm font-medium" style={{ color: "var(--deep)" }}>{form.hmoProvider}</span>
                                </div>
                            )}
                            {isPocketPay && (
                                <>
                                    <div style={{ height: "1px", background: "rgba(123,169,139,0.15)", margin: "4px 0" }} />
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm" style={{ color: "var(--text-muted)" }}>{selectedPlan.label}</span>
                                        <div className="text-right">
                                            <span className="font-cormorant text-lg font-semibold block" style={{ color: "var(--sage-dark)" }}>
                                                {selectedPlan.price}
                                            </span>
                                            {selectedPlan.originalPrice && (
                                                <span className="text-xs line-through opacity-40" style={{ color: "var(--text-muted)" }}>{selectedPlan.originalPrice}</span>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {errors.form && (
                        <div className="rounded-xl px-4 py-3 mb-4 text-sm"
                            style={{ background: "rgba(192,85,90,0.08)", color: "var(--error)", border: "1px solid rgba(192,85,90,0.2)" }}>
                            {errors.form}
                        </div>
                    )}

                    <p className="text-center text-xs mb-4 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                        By submitting you agree to our{" "}
                        <a href="/terms" className="underline" style={{ color: "var(--teal)" }}>Terms of Service</a>{" "}and{" "}
                        <a href="/privacy" className="underline" style={{ color: "var(--teal)" }}>Privacy Policy</a>.
                    </p>

                    <div className="flex gap-3">
                        <button type="button" onClick={handleBack} disabled={loading}
                            className="flex items-center justify-center gap-1.5 px-4 py-4 rounded-2xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            style={{ border: "1.5px solid var(--border)", color: "var(--text-muted)", background: "transparent" }}>
                            <ArrowLeft size={15} /> Back
                        </button>
                        <button type="button"
                            onClick={isPocketPay ? handleSubmitPocket : handleSubmitCoverage}
                            disabled={loading}
                            className="flex-1 py-4 rounded-2xl text-white text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                            style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))", boxShadow: loading ? "none" : "0 4px 20px rgba(61,139,139,0.25)" }}>
                            {loading
                                ? <><Loader2 size={16} className="animate-spin" />Please wait&hellip;</>
                                : isPocketPay ? <>Pay {selectedPlan.price} securely</> : <>Submit Request</>
                            }
                        </button>
                    </div>
                </div>
            )}
        </form>
    );
}
