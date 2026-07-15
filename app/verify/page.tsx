

// "use client";
// import { Suspense, useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import Link from "next/link";
// import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
// import BgBlobs from "@/components/BgBlobs";
// import { fireConversion } from "@/lib/tracking/pixels";
// import { markBooked } from "@/lib/personalization/profile";

// type State = "loading" | "success" | "failed";

// interface Payment {
//     name: string;
//     email: string;
//     plan: string;
//     reason: string;
//     amount: number;
//     reference: string;
//     paidAt: string;
// }

// // ── Reusable loading screen — used by both Suspense fallback and verify state ──
// function LoadingScreen() {
//     return (
//         <div className="relative min-h-screen">
//             {/* <BgBlobs /> */}
//             <section className="relative z-10 pt-32 pb-20 px-4 sm:px-6">
//                 <div className="max-w-md mx-auto text-center animate-fade-up">
//                     <div
//                         className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
//                         style={{ background: "linear-gradient(135deg, var(--sage), var(--teal))" }}
//                     >
//                         <Loader2 size={28} color="white" className="animate-spin" />
//                     </div>
//                     <h2 className="font-cormorant text-3xl font-light mb-3" style={{ color: "var(--deep)" }}>
//                         Confirming your payment
//                     </h2>
//                     <p className="text-sm" style={{ color: "var(--text-muted)" }}>
//                         Please wait while we verify your booking.
//                     </p>
//                 </div>
//             </section>
//         </div>
//     );
// }

// // ── Verify with retry ────────────────────────────────────────────────────────
// // Paystack occasionally takes a moment to settle after the popup reports
// // success client-side. Without a retry, a fast redirect can hit our /verify
// // API before Paystack's own record shows status "success", producing a false
// // "Payment not verified" screen for someone who genuinely paid. We retry a
// // few times with a short delay before treating it as a real failure.
// async function verifyWithRetry(
//     reference: string,
//     attempts = 3,
//     delayMs = 1200
// ): Promise<{ success: boolean; payment?: Payment; error?: string; status?: string }> {
//     let lastData: { success: boolean; payment?: Payment; error?: string; status?: string } = {
//         success: false,
//         error: "Payment could not be verified.",
//     };

//     for (let i = 0; i < attempts; i++) {
//         try {
//             const res = await fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`, {
//                 cache: "no-store",
//             });
//             const data = await res.json();

//             if (res.ok && data.success) {
//                 return data;
//             }

//             lastData = data;

//             // Only retry on "not completed yet" style responses (status present but
//             // not success). Don't retry on hard failures like invalid reference.
//             const isPending = data.status && data.status !== "success";
//             if (isPending && i < attempts - 1) {
//                 await new Promise((r) => setTimeout(r, delayMs));
//                 continue;
//             }
//             return data;
//         } catch {
//             lastData = { success: false, error: "Network error. Please contact support if you were charged." };
//             if (i < attempts - 1) {
//                 await new Promise((r) => setTimeout(r, delayMs));
//                 continue;
//             }
//         }
//     }

//     return lastData;
// }

// // ── Inner component — split out because useSearchParams() requires Suspense ────
// // Next.js cannot prerender pages that call useSearchParams() at build time.
// // The fix is to move the hook into a child component and wrap it in <Suspense>.
// // The parent page export (below) provides the Suspense boundary.
// function VerifyContent() {
//     const searchParams = useSearchParams();
//     const reference = searchParams.get("reference") ?? searchParams.get("trxref");

//     const [state, setState] = useState<State>("loading");
//     const [payment, setPayment] = useState<Payment | null>(null);
//     const [errorMsg, setErrorMsg] = useState("");

//     useEffect(() => {
//         if (!reference) {
//             setErrorMsg("No payment reference found.");
//             setState("failed");
//             return;
//         }

//         let cancelled = false;

//         const verify = async () => {
//             const data = await verifyWithRetry(reference);
//             if (cancelled) return;

//             if (data.success && data.payment) {
//                 setPayment(data.payment);
//                 setState("success");

//                 // Personalization: the booking is now confirmed server-side —
//                 // mark it booked and clear resume state so returning visitors
//                 // aren't shown a stale "continue booking" prompt.
//                 markBooked();

//                 // Fires Meta Pixel + Google Ads + TikTok in one call, each
//                 // deduped per payment reference so a refresh, the back
//                 // button, or React Strict Mode's double-invoke in dev never
//                 // double-counts the same conversion.
//                 fireConversion("Purchase", {
//                     value: data.payment.amount,
//                     currency: "NGN",
//                     transactionId: data.payment.reference,
//                     dedupeKey: data.payment.reference,
//                 });
//             } else {
//                 setErrorMsg(data.error ?? "Payment could not be verified.");
//                 setState("failed");
//             }
//         };

//         verify();

//         return () => {
//             cancelled = true;
//         };
//     }, [reference]);

//     if (state === "loading") return <LoadingScreen />;

//     if (state === "success" && payment) {
//         const firstName = payment.name?.split(" ")[0] || "there";
//         const formattedAmount = new Intl.NumberFormat("en-NG", {
//             style: "currency", currency: "NGN", minimumFractionDigits: 0,
//         }).format(payment.amount);
//         const formattedDate = payment.paidAt
//             ? new Date(payment.paidAt).toLocaleDateString("en-GB", { dateStyle: "long" })
//             : new Date().toLocaleDateString("en-GB", { dateStyle: "long" });


//         return (
//             <div className="relative min-h-screen">
//                 {/* <BgBlobs /> */}
//                 <section className="relative z-10 pt-24 pb-20 px-4 sm:px-6">
//                     <div className="max-w-lg mx-auto animate-fade-up">

//                         <div
//                             className="rounded-2xl sm:rounded-3xl p-8 sm:p-10 relative overflow-hidden mb-6 text-white text-center"
//                             style={{ background: "linear-gradient(135deg, #4e7a5e, #3d8b8b)" }}
//                         >
//                             <div className="absolute inset-0 opacity-10"
//                                 style={{ backgroundImage: "radial-gradient(circle at 20% 80%, white 0%, transparent 60%)" }} />
//                             <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center relative z-10"
//                                 style={{ background: "rgba(255,255,255,0.2)" }}>
//                                 <CheckCircle size={32} color="white" />
//                             </div>
//                             <p className="text-xs uppercase tracking-widest opacity-75 mb-2 relative z-10">Booking Confirmed</p>
//                             <h1 className="font-cormorant text-3xl sm:text-4xl font-light mb-2 relative z-10">
//                                 You&apos;re all set, {firstName}
//                             </h1>
//                             <p className="text-sm opacity-80 relative z-10">
//                                 Your therapist will be in touch within 24 hours.
//                             </p>
//                         </div>

//                         <div className="rounded-2xl p-6 sm:p-8 border mb-5"
//                             style={{ background: "white", borderColor: "var(--border)" }}>
//                             <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: "var(--sage-dark)" }}>
//                                 Payment Receipt
//                             </p>
//                             <div className="space-y-3">
//                                 {[
//                                     { label: "Plan", value: payment.plan },
//                                     { label: "Focus Area", value: payment.reason },
//                                     { label: "Amount Paid", value: formattedAmount },
//                                     { label: "Date", value: formattedDate },
//                                     { label: "Reference", value: payment.reference, mono: true },
//                                 ].map(({ label, value, mono }) => (
//                                     <div key={label} className="flex items-start justify-between gap-4">
//                                         <span className="text-xs uppercase tracking-wider flex-shrink-0"
//                                             style={{ color: "var(--text-muted)" }}>{label}</span>
//                                         <span
//                                             className={`text-sm text-right ${mono ? "font-mono text-xs break-all" : "font-medium"}`}
//                                             style={{ color: "var(--deep)" }}
//                                         >
//                                             {value}
//                                         </span>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         <div className="rounded-2xl p-6 border mb-6"
//                             style={{ background: "rgba(123,169,139,0.06)", borderColor: "rgba(123,169,139,0.25)" }}>
//                             <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "var(--sage-dark)" }}>
//                                 What happens next
//                             </p>
//                             <div className="space-y-2.5">
//                                 {[
//                                     `A confirmation email is on its way to ${payment.email}`,
//                                     "A licensed therapist will contact you within 24 hours",
//                                     "You'll agree on a time and format together",
//                                 ].map((item) => (
//                                     <div key={item} className="flex items-start gap-3">
//                                         <CheckCircle size={15} style={{ color: "var(--sage)", flexShrink: 0, marginTop: "2px" }} />
//                                         <span className="text-sm" style={{ color: "var(--text-muted)" }}>{item}</span>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         <div className="w-full">
//                             {/* <div className="flex flex-col sm:flex-row gap-3"> */}
//                             {/* <Link href="/"
//                                 className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-medium text-white px-6 py-3.5 rounded-full transition-all hover:-translate-y-0.5 hover:shadow-lg duration-200"
//                                 style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}>
//                                 Back to Home <ArrowRight size={15} />
//                             </Link>
//                             <Link href="/services"
//                                 className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-medium px-6 py-3.5 rounded-full border transition-all hover:-translate-y-0.5 hover:shadow-sm duration-200"
//                                 style={{ borderColor: "var(--border)", color: "var(--sage-dark)" }}>
//                                 View our services
//                             </Link> */}
//                             <Link
//                                 // href={whatsappUrl}
//                                 href="/book-call?from=verify"
//                                 // target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="cta-btn flex items-center justify-center gap-2.5 py-[17px] px-7 rounded-full text-white text-[15px] font-medium font-['DM_Sans',sans-serif] no-underline"
//                                 style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
//                             >
//                                 Schedule your session
//                                 <ArrowRight size={15} strokeWidth={2} />
//                             </Link>
//                         </div>

//                     </div>
//                 </section>
//             </div>
//         );
//     }

//     // Failed state
//     return (
//         <div className="relative min-h-screen">
//             {/* <BgBlobs /> */}
//             <section className="relative z-10 pt-32 pb-20 px-4 sm:px-6">
//                 <div className="max-w-md mx-auto text-center animate-fade-up">
//                     <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
//                         style={{ background: "rgba(192,85,90,0.12)" }}>
//                         <XCircle size={32} style={{ color: "var(--error)" }} />
//                     </div>
//                     <h2 className="font-cormorant text-3xl font-light mb-3" style={{ color: "var(--deep)" }}>
//                         Payment not verified
//                     </h2>
//                     <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--text-muted)" }}>
//                         {errorMsg || "We could not confirm your payment. If you were charged, please contact us and we will resolve it promptly."}
//                     </p>
//                     <div className="flex flex-col sm:flex-row gap-3 justify-center">
//                         <Link href="/#book"
//                             className="inline-flex items-center justify-center gap-2 text-sm font-medium text-white px-6 py-3.5 rounded-full transition-all hover:-translate-y-0.5 hover:shadow-lg duration-200"
//                             style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}>
//                             Try again <ArrowRight size={15} />
//                         </Link>
//                         <a href="mailto:hello@mail.trymentel.com"
//                             className="inline-flex items-center justify-center gap-2 text-sm font-medium px-6 py-3.5 rounded-full border transition-all hover:-translate-y-0.5 hover:shadow-sm duration-200"
//                             style={{ borderColor: "var(--border)", color: "var(--sage-dark)" }}>
//                             Contact support
//                         </a>
//                     </div>
//                 </div>
//             </section>
//         </div>
//     );
// }

// // ── Page export — Suspense boundary is the fix for the build error ─────────────
// // useSearchParams() cannot be called during prerender. Wrapping VerifyContent
// // in <Suspense> tells Next.js to skip prerendering and use the fallback instead.
// export default function VerifyPage() {
//     return (
//         <Suspense fallback={<LoadingScreen />}>
//             <VerifyContent />
//         </Suspense>
//     );
// }



"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
import BgBlobs from "@/components/BgBlobs";
import { fireConversion } from "@/lib/tracking/pixels";
import { markBooked } from "@/lib/personalization/profile";

type State = "loading" | "success" | "failed";

interface Payment {
    name: string;
    email: string;
    plan: string;
    reason: string;
    amount: number;
    reference: string;
    paidAt: string;
}

// ── Reusable loading screen — used by both Suspense fallback and verify state ──
function LoadingScreen() {
    return (
        <div className="relative min-h-screen">
            {/* <BgBlobs /> */}
            <section className="relative z-10 pt-32 pb-20 px-4 sm:px-6">
                <div className="max-w-md mx-auto text-center animate-fade-up">
                    <div
                        className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, var(--sage), var(--teal))" }}
                    >
                        <Loader2 size={28} color="white" className="animate-spin" />
                    </div>
                    <h2 className="font-cormorant text-3xl font-light mb-3" style={{ color: "var(--deep)" }}>
                        Confirming your payment
                    </h2>
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                        Please wait while we verify your booking.
                    </p>
                </div>
            </section>
        </div>
    );
}

// ── Verify with retry ────────────────────────────────────────────────────────
// Paystack occasionally takes a moment to settle after the popup reports
// success client-side. Without a retry, a fast redirect can hit our /verify
// API before Paystack's own record shows status "success", producing a false
// "Payment not verified" screen for someone who genuinely paid. We retry a
// few times with a short delay before treating it as a real failure.
async function verifyWithRetry(
    reference: string,
    attempts = 3,
    delayMs = 1200
): Promise<{ success: boolean; payment?: Payment; error?: string; status?: string; portalLoginUrl?: string }> {
    let lastData: { success: boolean; payment?: Payment; error?: string; status?: string; portalLoginUrl?: string } = {
        success: false,
        error: "Payment could not be verified.",
    };

    for (let i = 0; i < attempts; i++) {
        try {
            const res = await fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`, {
                cache: "no-store",
            });
            const data = await res.json();

            if (res.ok && data.success) {
                return data;
            }

            lastData = data;

            // Only retry on "not completed yet" style responses (status present but
            // not success). Don't retry on hard failures like invalid reference.
            const isPending = data.status && data.status !== "success";
            if (isPending && i < attempts - 1) {
                await new Promise((r) => setTimeout(r, delayMs));
                continue;
            }
            return data;
        } catch {
            lastData = { success: false, error: "Network error. Please contact support if you were charged." };
            if (i < attempts - 1) {
                await new Promise((r) => setTimeout(r, delayMs));
                continue;
            }
        }
    }

    return lastData;
}

// ── Inner component — split out because useSearchParams() requires Suspense ────
// Next.js cannot prerender pages that call useSearchParams() at build time.
// The fix is to move the hook into a child component and wrap it in <Suspense>.
// The parent page export (below) provides the Suspense boundary.
function VerifyContent() {
    const searchParams = useSearchParams();
    const reference = searchParams.get("reference") ?? searchParams.get("trxref");

    const [state, setState] = useState<State>("loading");
    const [payment, setPayment] = useState<Payment | null>(null);
    const [portalLoginUrl, setPortalLoginUrl] = useState<string>("https://app.trymentel.com/login");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (!reference) {
            setErrorMsg("No payment reference found.");
            setState("failed");
            return;
        }

        let cancelled = false;

        const verify = async () => {
            const data = await verifyWithRetry(reference);
            if (cancelled) return;

            if (data.success && data.payment) {
                setPayment(data.payment);
                if (data.portalLoginUrl) setPortalLoginUrl(data.portalLoginUrl);
                setState("success");

                // Personalization: the booking is now confirmed server-side —
                // mark it booked and clear resume state so returning visitors
                // aren't shown a stale "continue booking" prompt.
                markBooked();

                // Fires Meta Pixel + Google Ads + TikTok in one call, each
                // deduped per payment reference so a refresh, the back
                // button, or React Strict Mode's double-invoke in dev never
                // double-counts the same conversion.
                fireConversion("Purchase", {
                    value: data.payment.amount,
                    currency: "NGN",
                    transactionId: data.payment.reference,
                    dedupeKey: data.payment.reference,
                });
            } else {
                setErrorMsg(data.error ?? "Payment could not be verified.");
                setState("failed");
            }
        };

        verify();

        return () => {
            cancelled = true;
        };
    }, [reference]);

    if (state === "loading") return <LoadingScreen />;

    if (state === "success" && payment) {
        const firstName = payment.name?.split(" ")[0] || "there";
        const formattedAmount = new Intl.NumberFormat("en-NG", {
            style: "currency", currency: "NGN", minimumFractionDigits: 0,
        }).format(payment.amount);
        const formattedDate = payment.paidAt
            ? new Date(payment.paidAt).toLocaleDateString("en-GB", { dateStyle: "long" })
            : new Date().toLocaleDateString("en-GB", { dateStyle: "long" });


        return (
            <div className="relative min-h-screen">
                {/* <BgBlobs /> */}
                <section className="relative z-10 pt-24 pb-20 px-4 sm:px-6">
                    <div className="max-w-lg mx-auto animate-fade-up">

                        <div
                            className="rounded-2xl sm:rounded-3xl p-8 sm:p-10 relative overflow-hidden mb-6 text-white text-center"
                            style={{ background: "linear-gradient(135deg, #4e7a5e, #3d8b8b)" }}
                        >
                            <div className="absolute inset-0 opacity-10"
                                style={{ backgroundImage: "radial-gradient(circle at 20% 80%, white 0%, transparent 60%)" }} />
                            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center relative z-10"
                                style={{ background: "rgba(255,255,255,0.2)" }}>
                                <CheckCircle size={32} color="white" />
                            </div>
                            <p className="text-xs uppercase tracking-widest opacity-75 mb-2 relative z-10">Booking Confirmed</p>
                            <h1 className="font-cormorant text-3xl sm:text-4xl font-light mb-2 relative z-10">
                                You&apos;re all set, {firstName}
                            </h1>
                            <p className="text-sm opacity-80 relative z-10">
                                Your therapist will be in touch within 24 hours.
                            </p>
                        </div>

                        <div className="rounded-2xl p-6 sm:p-8 border mb-5"
                            style={{ background: "white", borderColor: "var(--border)" }}>
                            <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: "var(--sage-dark)" }}>
                                Payment Receipt
                            </p>
                            <div className="space-y-3">
                                {[
                                    { label: "Plan", value: payment.plan },
                                    { label: "Focus Area", value: payment.reason },
                                    { label: "Amount Paid", value: formattedAmount },
                                    { label: "Date", value: formattedDate },
                                    { label: "Reference", value: payment.reference, mono: true },
                                ].map(({ label, value, mono }) => (
                                    <div key={label} className="flex items-start justify-between gap-4">
                                        <span className="text-xs uppercase tracking-wider flex-shrink-0"
                                            style={{ color: "var(--text-muted)" }}>{label}</span>
                                        <span
                                            className={`text-sm text-right ${mono ? "font-mono text-xs break-all" : "font-medium"}`}
                                            style={{ color: "var(--deep)" }}
                                        >
                                            {value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl p-6 border mb-6"
                            style={{ background: "rgba(123,169,139,0.06)", borderColor: "rgba(123,169,139,0.25)" }}>
                            <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "var(--sage-dark)" }}>
                                What happens next
                            </p>
                            <div className="space-y-2.5">
                                {[
                                    `A confirmation email is on its way to ${payment.email}`,
                                    "A licensed therapist will contact you within 24 hours",
                                    "You'll agree on a time and format together",
                                ].map((item) => (
                                    <div key={item} className="flex items-start gap-3">
                                        <CheckCircle size={15} style={{ color: "var(--sage)", flexShrink: 0, marginTop: "2px" }} />
                                        <span className="text-sm" style={{ color: "var(--text-muted)" }}>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="w-full flex flex-col gap-3">
                            <a
                                href={portalLoginUrl}
                                className="cta-btn flex items-center justify-center gap-2.5 py-[17px] px-7 rounded-full text-white text-[15px] font-medium font-['DM_Sans',sans-serif] no-underline"
                                style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                            >
                                Go to Your Client Portal
                                <ArrowRight size={15} strokeWidth={2} />
                            </a>
                            <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
                                Schedule your session{payment.plan?.toLowerCase().includes("month") ? "s" : ""} and manage your plan there.
                            </p>
                        </div>

                    </div>
                </section>
            </div>
        );
    }

    // Failed state
    return (
        <div className="relative min-h-screen">
            {/* <BgBlobs /> */}
            <section className="relative z-10 pt-32 pb-20 px-4 sm:px-6">
                <div className="max-w-md mx-auto text-center animate-fade-up">
                    <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                        style={{ background: "rgba(192,85,90,0.12)" }}>
                        <XCircle size={32} style={{ color: "var(--error)" }} />
                    </div>
                    <h2 className="font-cormorant text-3xl font-light mb-3" style={{ color: "var(--deep)" }}>
                        Payment not verified
                    </h2>
                    <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--text-muted)" }}>
                        {errorMsg || "We could not confirm your payment. If you were charged, please contact us and we will resolve it promptly."}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link href="/#book"
                            className="inline-flex items-center justify-center gap-2 text-sm font-medium text-white px-6 py-3.5 rounded-full transition-all hover:-translate-y-0.5 hover:shadow-lg duration-200"
                            style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}>
                            Try again <ArrowRight size={15} />
                        </Link>
                        <a href="mailto:hello@mail.trymentel.com"
                            className="inline-flex items-center justify-center gap-2 text-sm font-medium px-6 py-3.5 rounded-full border transition-all hover:-translate-y-0.5 hover:shadow-sm duration-200"
                            style={{ borderColor: "var(--border)", color: "var(--sage-dark)" }}>
                            Contact support
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}

// ── Page export — Suspense boundary is the fix for the build error ─────────────
// useSearchParams() cannot be called during prerender. Wrapping VerifyContent
// in <Suspense> tells Next.js to skip prerendering and use the fallback instead.
export default function VerifyPage() {
    return (
        <Suspense fallback={<LoadingScreen />}>
            <VerifyContent />
        </Suspense>
    );
}