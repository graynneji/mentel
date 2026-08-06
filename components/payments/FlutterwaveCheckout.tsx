

// "use client";

// // components/payments/FlutterwaveCheckout.tsx
// //
// // Loads Flutterwave's inline checkout script once, detects the visitor's
// // platform, and opens the modal with the most relevant payment method
// // offered first (Apple Pay on iOS/Safari, Google Pay on Android/Chrome,
// // card + bank options everywhere else — including laptops/desktops, or
// // any device where the wallet API isn't actually available). Card is
// // always included as a guaranteed fallback.
// //
// // Amounts are resolved server-side from lib/payments/adhd-plans.ts — this
// // component only ever sends a plan `key`, never a client-computed price.

// import { useEffect, useRef, useState } from "react";
// import { Loader2, Lock } from "lucide-react";

// declare global {
//     interface Window {
//         FlutterwaveCheckout?: (config: Record<string, unknown>) => void;
//     }
// }

// type Platform = "ios" | "android" | "desktop";

// export interface FlutterwaveCustomer {
//     name: string;
//     email: string;
//     phone?: string;
// }

// interface FlutterwaveCheckoutProps {
//     planKey: string; // e.g. "report" | "toolkit" — see lib/payments/adhd-plans.ts
//     leadId: string | null; // links this payment back to the AdhdAssessmentLead row created at email-capture
//     amountUSD: number; // display-only; the real charge amount is set server-side on /api/flutterwave/initialize
//     label: string;
//     customer: FlutterwaveCustomer;
//     onSuccess: (transactionRef: string) => void;
//     onClose?: () => void;
//     className?: string;
//     children?: React.ReactNode;
// }

// const SCRIPT_SRC = "https://checkout.flutterwave.com/v3.js";
// let scriptLoadPromise: Promise<void> | null = null;

// function loadFlutterwaveScript(): Promise<void> {
//     if (typeof window === "undefined") return Promise.resolve();
//     if (window.FlutterwaveCheckout) return Promise.resolve();
//     if (scriptLoadPromise) return scriptLoadPromise;

//     scriptLoadPromise = new Promise((resolve, reject) => {
//         const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
//         if (existing) {
//             existing.addEventListener("load", () => resolve());
//             existing.addEventListener("error", () => reject(new Error("Failed to load Flutterwave script")));
//             return;
//         }
//         const script = document.createElement("script");
//         script.src = SCRIPT_SRC;
//         script.async = true;
//         script.onload = () => resolve();
//         script.onerror = () => reject(new Error("Failed to load Flutterwave script"));
//         document.body.appendChild(script);
//     });
//     return scriptLoadPromise;
// }

// function detectPlatform(): Platform {
//     if (typeof navigator === "undefined") return "desktop";
//     const ua = navigator.userAgent || "";
//     const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
//     // iPadOS 13+ reports as "MacIntel" with touch support — catch that too
//     const isIPadOS = navigator.platform === "MacIntel" && ((navigator as unknown as { maxTouchPoints?: number }).maxTouchPoints ?? 0) > 1;
//     if (isIOS || isIPadOS) return "ios";
//     if (/Android/.test(ua)) return "android";
//     return "desktop";
// }

// async function applePayIsUsable(): Promise<boolean> {
//     try {
//         const w = window as unknown as { ApplePaySession?: { canMakePayments: () => boolean } };
//         return !!w.ApplePaySession && w.ApplePaySession.canMakePayments();
//     } catch {
//         return false;
//     }
// }

// async function googlePayIsUsable(): Promise<boolean> {
//     try {
//         // Google Pay availability is best detected via the standard PaymentRequest API.
//         if (!("PaymentRequest" in window)) return false;
//         const supportedInstruments = [{
//             supportedMethods: "https://google.com/pay",
//         }];
//         const details = { total: { label: "Check", amount: { currency: "USD", value: "0.01" } } };
//         const request = new PaymentRequest(supportedInstruments, details);
//         const canMake = await request.canMakePayment();
//         return !!canMake;
//     } catch {
//         return false;
//     }
// }

// /** Builds the Flutterwave `payment_options` string, native wallet first, card always included as fallback. */
// async function resolvePaymentOptions(platform: Platform): Promise<string> {
//     const options: string[] = [];
//     if (platform === "ios") {
//         if (await applePayIsUsable()) options.push("applepay");
//     } else if (platform === "android") {
//         if (await googlePayIsUsable()) options.push("googlepay");
//     }
//     // Card + local bank options are always offered, both as the desktop/laptop
//     // default and as a guaranteed fallback if a device claims wallet support
//     // it can't actually complete (e.g. no card on file with the wallet).
//     options.push("card", "banktransfer", "ussd");
//     return options.join(",");
// }

// export default function FlutterwaveCheckout({
//     planKey,
//     leadId,
//     amountUSD,
//     label,
//     customer,
//     onSuccess,
//     onClose,
//     className,
//     children,
// }: FlutterwaveCheckoutProps) {
//     const [ready, setReady] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [platform, setPlatform] = useState<Platform>("desktop");
//     const [walletLabel, setWalletLabel] = useState<string | null>(null);
//     const mounted = useRef(true);

//     useEffect(() => {
//         mounted.current = true;
//         const p = detectPlatform();
//         setPlatform(p);

//         loadFlutterwaveScript()
//             .then(() => { if (mounted.current) setReady(true); })
//             .catch(() => { if (mounted.current) setReady(false); });

//         (async () => {
//             if (p === "ios" && (await applePayIsUsable())) setWalletLabel("Apple Pay");
//             else if (p === "android" && (await googlePayIsUsable())) setWalletLabel("Google Pay");
//         })();

//         return () => { mounted.current = false; };
//     }, []);

//     async function handlePay() {
//         if (!window.FlutterwaveCheckout || loading) return;
//         setLoading(true);
//         try {
//             // Ask our own API to mint a tx_ref and confirm the authoritative
//             // amount server-side — never trust amountUSD from props for the
//             // real charge, it's display-only.
//             const initRes = await fetch("/api/flutterwave/initialize", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ planKey, leadId, customer }),
//             });
//             const init = await initRes.json();
//             if (!initRes.ok || !init?.txRef) {
//                 throw new Error(init?.error || "Could not start checkout");
//             }

//             const paymentOptions = await resolvePaymentOptions(platform);
//             const publicKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY;

//             window.FlutterwaveCheckout({
//                 public_key: publicKey,
//                 tx_ref: init.txRef,
//                 amount: init.amountUSD,
//                 currency: "USD",
//                 payment_options: paymentOptions,
//                 redirect_url: `${window.location.origin}/adhd/result?tx_ref=${encodeURIComponent(init.txRef)}`,
//                 customer: {
//                     email: customer.email,
//                     name: customer.name,
//                     phone_number: customer.phone,
//                 },
//                 customizations: {
//                     title: "Mentel — ADHD Report",
//                     description: label,
//                     logo: `${window.location.origin}/logo-assessment.png`,
//                 },
//                 callback: (response: { status?: string; transaction_id?: string | number }) => {
//                     if (response?.status === "successful" || response?.status === "completed") {
//                         onSuccess(init.txRef);
//                     }
//                 },
//                 onclose: () => {
//                     setLoading(false);
//                     onClose?.();
//                 },
//             });
//         } catch {
//             setLoading(false);
//         }
//     }

//     return (
//         <button
//             type="button"
//             onClick={handlePay}
//             disabled={!ready || loading}
//             className={className ?? "cta-btn w-full py-[17px] px-7 bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] text-white border-0 rounded-full text-[15px] font-medium flex items-center justify-center gap-2 shadow-[0_4px_22px_rgba(30,107,107,0.3)]"}
//             style={{ cursor: !ready || loading ? "not-allowed" : "pointer", opacity: !ready || loading ? 0.75 : 1 }}
//         >
//             {loading ? (
//                 <Loader2 size={16} strokeWidth={2.5} className="animate-spin" />
//             ) : (
//                 <Lock size={14} strokeWidth={2} />
//             )}
//             {children ?? (
//                 <span>
//                     {loading ? "Opening secure checkout…" : `Pay $${amountUSD.toLocaleString()}${walletLabel ? ` with ${walletLabel}` : ""}`}
//                 </span>
//             )}
//         </button>
//     );
// }


"use client";

// components/payments/FlutterwaveCheckout.tsx
//
// Loads Flutterwave's inline checkout script once, detects the visitor's
// platform, and opens the modal with the most relevant payment method
// offered first (Apple Pay on iOS/Safari, Google Pay on Android/Chrome,
// card + bank options everywhere else — including laptops/desktops, or
// any device where the wallet API isn't actually available). Card is
// always included as a guaranteed fallback.
//
// Amounts are resolved server-side from lib/payments/adhd-plans.ts — this
// component only ever sends a plan `key`, never a client-computed price.

import { useEffect, useRef, useState } from "react";
import { Loader2, Lock } from "lucide-react";

declare global {
    interface Window {
        FlutterwaveCheckout?: (config: Record<string, unknown>) => void;
    }
}

type Platform = "ios" | "android" | "desktop";

export interface FlutterwaveCustomer {
    name: string;
    email: string;
    phone?: string;
}

interface FlutterwaveCheckoutProps {
    planKey: string; // e.g. "report" | "toolkit" — see lib/payments/adhd-plans.ts
    leadId: string | null; // links this payment back to the AdhdAssessmentLead row created at email-capture
    amountUSD: number; // display-only; the real charge amount is set server-side on /api/flutterwave/initialize
    label: string;
    customer: FlutterwaveCustomer;
    onSuccess: (transactionRef: string) => void;
    onClose?: () => void;
    className?: string;
    children?: React.ReactNode;
}

const SCRIPT_SRC = "https://checkout.flutterwave.com/v3.js";
let scriptLoadPromise: Promise<void> | null = null;

function loadFlutterwaveScript(): Promise<void> {
    if (typeof window === "undefined") return Promise.resolve();
    if (window.FlutterwaveCheckout) return Promise.resolve();
    if (scriptLoadPromise) return scriptLoadPromise;

    scriptLoadPromise = new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
        if (existing) {
            existing.addEventListener("load", () => resolve());
            existing.addEventListener("error", () => reject(new Error("Failed to load Flutterwave script")));
            return;
        }
        const script = document.createElement("script");
        script.src = SCRIPT_SRC;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Flutterwave script"));
        document.body.appendChild(script);
    });
    return scriptLoadPromise;
}

function detectPlatform(): Platform {
    if (typeof navigator === "undefined") return "desktop";
    const ua = navigator.userAgent || "";
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    // iPadOS 13+ reports as "MacIntel" with touch support — catch that too
    const isIPadOS = navigator.platform === "MacIntel" && ((navigator as unknown as { maxTouchPoints?: number }).maxTouchPoints ?? 0) > 1;
    if (isIOS || isIPadOS) return "ios";
    if (/Android/.test(ua)) return "android";
    return "desktop";
}

async function applePayIsUsable(): Promise<boolean> {
    try {
        const w = window as unknown as { ApplePaySession?: { canMakePayments: () => boolean } };
        return !!w.ApplePaySession && w.ApplePaySession.canMakePayments();
    } catch {
        return false;
    }
}

async function googlePayIsUsable(): Promise<boolean> {
    try {
        // Google Pay availability is best detected via the standard PaymentRequest API.
        if (!("PaymentRequest" in window)) return false;
        const supportedInstruments = [{
            supportedMethods: "https://google.com/pay",
        }];
        const details = { total: { label: "Check", amount: { currency: "USD", value: "0.01" } } };
        const request = new PaymentRequest(supportedInstruments, details);
        const canMake = await request.canMakePayment();
        return !!canMake;
    } catch {
        return false;
    }
}

/** Builds the Flutterwave `payment_options` string, native wallet first, card always included as fallback. */
async function resolvePaymentOptions(platform: Platform): Promise<string> {
    const options: string[] = [];
    if (platform === "ios") {
        if (await applePayIsUsable()) options.push("applepay");
    } else if (platform === "android") {
        if (await googlePayIsUsable()) options.push("googlepay");
    }
    // Card + local bank options are always offered, both as the desktop/laptop
    // default and as a guaranteed fallback if a device claims wallet support
    // it can't actually complete (e.g. no card on file with the wallet).
    options.push("card", "banktransfer", "ussd");
    return options.join(",");
}

export default function FlutterwaveCheckout({
    planKey,
    leadId,
    amountUSD,
    label,
    customer,
    onSuccess,
    onClose,
    className,
    children,
}: FlutterwaveCheckoutProps) {
    const [ready, setReady] = useState(false);
    const [loading, setLoading] = useState(false);
    const [platform, setPlatform] = useState<Platform>("desktop");
    const [walletLabel, setWalletLabel] = useState<string | null>(null);
    const mounted = useRef(true);

    useEffect(() => {
        mounted.current = true;
        const p = detectPlatform();
        setPlatform(p);

        loadFlutterwaveScript()
            .then(() => { if (mounted.current) setReady(true); })
            .catch(() => { if (mounted.current) setReady(false); });

        (async () => {
            if (p === "ios" && (await applePayIsUsable())) setWalletLabel("Apple Pay");
            else if (p === "android" && (await googlePayIsUsable())) setWalletLabel("Google Pay");
        })();

        return () => { mounted.current = false; };
    }, []);

    async function handlePay() {
        if (!window.FlutterwaveCheckout || loading) return;
        setLoading(true);
        try {
            // Ask our own API to mint a tx_ref and confirm the authoritative
            // amount server-side — never trust amountUSD from props for the
            // real charge, it's display-only.
            const initRes = await fetch("/api/flutterwave/initialize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ planKey, leadId, customer }),
            });
            const init = await initRes.json();
            if (!initRes.ok || !init?.txRef) {
                throw new Error(init?.error || "Could not start checkout");
            }

            const paymentOptions = await resolvePaymentOptions(platform);
            const publicKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY;

            window.FlutterwaveCheckout({
                public_key: publicKey,
                tx_ref: init.txRef,
                amount: init.amountUSD,
                currency: "USD",
                payment_options: paymentOptions,
                redirect_url: `${window.location.origin}/adhd/result?tx_ref=${encodeURIComponent(init.txRef)}`,
                customer: {
                    email: customer.email,
                    name: customer.name,
                    phone_number: customer.phone,
                },
                customizations: {
                    title: "Mentel — ADHD Report",
                    description: label,
                    logo: `${window.location.origin}/hr-logo.png`,
                },
                callback: async (response: { status?: string; transaction_id?: string | number }) => {
                    if (response?.status !== "successful" && response?.status !== "completed") return;
                    // This in-modal callback is the common path for card
                    // payments, Flutterwave completes them without ever
                    // navigating the browser away, so the redirect_url above
                    // (and whatever page it points at) never actually fires.
                    // Previously this just called onSuccess() locally, which
                    // only updated this component's own UI state, nothing
                    // server-side ever learned the payment happened: the lead
                    // row stayed "pending_payment" forever, and no email went
                    // out, since sending the report email is wired into the
                    // verify step, not into this callback. Calling verify
                    // directly here closes that gap regardless of whether a
                    // redirect ever happens.
                    try {
                        await fetch(`/api/flutterwave/verify?tx_ref=${encodeURIComponent(init.txRef)}`);
                    } catch {
                        // Even if this network call fails, the webhook (once
                        // it can actually reach this server, see the .env
                        // notes) is the backstop that marks it paid.
                    }
                    onSuccess(init.txRef);
                },
                onclose: () => {
                    setLoading(false);
                    onClose?.();
                },
            });
        } catch {
            setLoading(false);
        }
    }

    return (
        <button
            type="button"
            onClick={handlePay}
            disabled={!ready || loading}
            className={className ?? "cta-btn w-full py-[17px] px-7 bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] text-white border-0 rounded-full text-[15px] font-medium flex items-center justify-center gap-2 shadow-[0_4px_22px_rgba(30,107,107,0.3)]"}
            style={{ cursor: !ready || loading ? "not-allowed" : "pointer", opacity: !ready || loading ? 0.75 : 1 }}
        >
            {loading ? (
                <Loader2 size={16} strokeWidth={2.5} className="animate-spin" />
            ) : (
                <Lock size={14} strokeWidth={2} />
            )}
            {children ?? (
                <span>
                    {loading ? "Opening secure checkout…" : `Pay $${amountUSD.toLocaleString()}${walletLabel ? ` with ${walletLabel}` : ""}`}
                </span>
            )}
        </button>
    );
}
