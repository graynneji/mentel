
// "use client";

// import { useEffect, useState, Suspense } from "react";
// import { useSearchParams } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";
// import { CheckCircle2, ShieldCheck, FileText, ArrowRight, ChevronDown, Sparkles, X as XIcon } from "lucide-react";
// import { AssessmentResult, bandCopy, scoreAssessment, Answers } from "@/lib/adhd/scoring";
// import { Domain } from "@/lib/adhd/questions";
// import { domainInterpretations, strengthsPool, whatThisMeans, faqItems } from "@/lib/adhd/interpretations";
// import { ADHD_PLANS } from "@/lib/payments/adhd-plans";
// import FlutterwaveCheckout from "@/components/payments/FlutterwaveCheckout";
// import RadarChart from "@/components/adhd/RadarChart";
// import ReportPreviewMock from "@/components/adhd/ReportPreviewMock";
// import { Testimonials } from "@/components/adhd/TrustAndProof";
// import { testimonials } from "@/lib/adhd/social-proof-config";

// interface StoredResult {
//     name: string;
//     email: string;
//     phone: string;
//     answers: Answers;
//     result: AssessmentResult;
//     leadId: string | null;
//     completedAt: number;
// }

// // The single plan shown on this page, per the "one centered pricing
// // section, not ecommerce cards" brief. The toolkit upsell tier still
// // exists in lib/payments/adhd-plans.ts if you want to reintroduce it as a
// // post-purchase upsell later, it's just not the primary offer here.
// const PRIMARY_PLAN = ADHD_PLANS.report;

// // Radar axes per the brief: Attention, Memory, Executive, Planning,
// // Emotional Regulation, Hyperactivity.
// const RADAR_DOMAINS: { domain: Domain; label: string }[] = [
//     { domain: "attention", label: "Attention" },
//     { domain: "working_memory", label: "Memory" },
//     { domain: "executive_function", label: "Executive" },
//     { domain: "organisation", label: "Planning" },
//     { domain: "emotional_regulation", label: "Emotional\nRegulation" },
//     { domain: "hyperactivity", label: "Hyperactivity" },
// ];

// function AdhdResultContent() {
//     const searchParams = useSearchParams();
//     const txRef = searchParams.get("tx_ref");
//     const [stored, setStored] = useState<StoredResult | null>(null);
//     const [recovering, setRecovering] = useState(!!txRef);
//     const [notFound, setNotFound] = useState(false);
//     const [unlocked, setUnlocked] = useState(false);
//     const [showSuccessModal, setShowSuccessModal] = useState(false);
//     const [verifying, setVerifying] = useState(!!txRef);
//     // Show immediately rather than gating behind a scroll threshold: the
//     // point of this bar is that pricing is visible without having to
//     // scroll to find it, gating it behind scrollY defeated that.
//     const [showMobileBar, setShowMobileBar] = useState(true);
//     const [mobileBarDismissed, setMobileBarDismissed] = useState(false);
//     const [successBarDismissed, setSuccessBarDismissed] = useState(false);

//     useEffect(() => {
//         // Primary path: the assessment flow wrote this to sessionStorage right
//         // before redirecting here (see app/adhd/page.tsx). Fast, no network
//         // round trip, works for the vast majority of visits.
//         let foundInSession = false;
//         try {
//             const raw = window.sessionStorage.getItem("mentel_adhd_result");
//             if (raw) {
//                 setStored(JSON.parse(raw));
//                 foundInSession = true;
//             }
//         } catch { /* sessionStorage unavailable, fall through to recovery below */ }

//         if (foundInSession) {
//             setRecovering(false);
//             return;
//         }

//         // Recovery path: sessionStorage can legitimately be gone by the time
//         // we land back here, some payment methods route through a redirect
//         // (3D Secure, bank transfer, USSD) that can involve a fresh tab or
//         // navigation context depending on the browser, which doesn't always
//         // preserve the original tab's sessionStorage. If we have a tx_ref in
//         // the URL, that's proof a checkout was actually started, so look the
//         // lead up server-side instead of showing "we couldn't find a recent
//         // result" for something that's really just a client storage quirk.
//         if (!txRef) {
//             setRecovering(false);
//             return;
//         }
//         fetch(`/api/adhd/lead?txRef=${encodeURIComponent(txRef)}`)
//             .then((r) => r.json())
//             .then((data) => {
//                 if (!data?.success) { setNotFound(true); return; }
//                 const answers = data.answers as Answers;
//                 const result = scoreAssessment(answers);
//                 const recovered: StoredResult = {
//                     name: data.name ?? "",
//                     email: data.email ?? "",
//                     phone: data.phone ?? "",
//                     answers,
//                     result,
//                     leadId: null, // not needed again, this lead already has a tx_ref attached
//                     completedAt: Date.now(),
//                 };
//                 setStored(recovered);
//                 // Re-seed sessionStorage so the rest of this visit behaves
//                 // exactly like the normal (non-recovery) path.
//                 try { window.sessionStorage.setItem("mentel_adhd_result", JSON.stringify(recovered)); } catch { /* best effort */ }
//             })
//             .catch(() => setNotFound(true))
//             .finally(() => setRecovering(false));
//     }, [txRef]);

//     useEffect(() => {
//         if (!txRef) return;
//         fetch(`/api/flutterwave/verify?tx_ref=${encodeURIComponent(txRef)}`)
//             .then((r) => r.json())
//             .then((data) => {
//                 const success = !!data?.success;
//                 setUnlocked(success);
//                 if (!success) return;

//                 // If this tx_ref matches one we flagged as "checkout in
//                 // progress" right before opening Flutterwave's modal (see
//                 // components/payments/FlutterwaveCheckout.tsx), this is a
//                 // genuine just-completed payment landing back here via
//                 // redirect, not someone revisiting an old paid link, show
//                 // the same success confirmation the in-page callback path
//                 // shows. Clear the flag either way so a later reload of
//                 // this same URL doesn't re-trigger it.
//                 try {
//                     const pending = window.sessionStorage.getItem("mentel_adhd_pending_tx_ref");
//                     if (pending && pending === txRef) {
//                         setShowSuccessModal(true);
//                         window.sessionStorage.removeItem("mentel_adhd_pending_tx_ref");
//                     }
//                 } catch { /* best effort */ }
//             })
//             .finally(() => setVerifying(false));
//     }, [txRef]);

//     // Called from PricingCard the moment Flutterwave confirms payment.
//     // Deliberately separate from the mount-time verify effect above: that
//     // effect also sets `unlocked`, but for someone reloading a link to a
//     // report they already paid for, which shouldn't re-trigger a "payment
//     // successful!" celebration. This handler is only ever called right
//     // after an actual just-completed checkout, which is exactly when the
//     // person needs an unmissable confirmation, previously the only signal
//     // was a small "Confirming your payment…" line inside the pricing card
//     // itself, easy to miss if they'd scrolled away from it or the card was
//     // off-screen (the sidebar on desktop, for instance).
//     function handlePaymentSuccess() {
//         setUnlocked(true);
//         setShowSuccessModal(true);
//     }

//     if (recovering) {
//         return (
//             <PageShell>
//                 <div className="max-w-[400px] mx-auto text-center pt-32 px-6">
//                     <div className="w-9 h-9 border-[2.5px] border-[#2d7a5a]/20 border-t-[#2d7a5a] rounded-full mx-auto animate-spin mb-5" />
//                     <p className="text-[13.5px] text-[#4a5a52]">Loading your results…</p>
//                 </div>
//             </PageShell>
//         );
//     }

//     if (!stored || notFound) {
//         return (
//             <PageShell>
//                 <div className="max-w-[440px] mx-auto text-center pt-32 px-6">
//                     <h1 className="font-['Cormorant_Garamond',Georgia,serif] text-[28px] font-light text-[#1c2820] mb-3">
//                         We couldn't find a recent result
//                     </h1>
//                     <p className="text-[14px] text-[#4a5a52] mb-7">
//                         Your session may have expired. Let's take the assessment again, it only takes a few minutes.
//                     </p>
//                     <Link href="/adhd" className="cta-btn inline-flex items-center gap-2 py-3.5 px-8 bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] text-white rounded-full text-[14px] font-medium no-underline">
//                         Start the assessment <ArrowRight size={15} />
//                     </Link>
//                 </div>
//             </PageShell>
//         );
//     }

//     const { result, name } = stored;
//     const firstName = name ? name.split(" ")[0] : "there";
//     const orderedDomains = [...result.domainResults].sort((a, b) => b.percent - a.percent);

//     return (
//         <PageShell>
//             {/* Wide desktop container: content column + sticky sidebar, so the
//                 page spreads out on large screens instead of a narrow centered
//                 column with big empty margins either side. */}
//             <div className="max-w-[1180px] mx-auto px-6 lg:px-10 pt-[104px] pb-20 lg:grid lg:grid-cols-[1fr_360px] lg:gap-12 lg:items-start">
//                 <main className="min-w-0">
//                     {/* ── Header, kept to one brief line, the detail lives in the
//                         domain breakdown further down for anyone who wants it ── */}
//                     <section className="pb-2">
//                         <div className="fade-up">
//                             <div className="inline-flex items-center gap-1.5 bg-[#f2f7f3] text-[#2d7a5a] text-[11px] font-semibold tracking-[0.08em] uppercase px-3.5 py-1.5 rounded-full mb-5">
//                                 <CheckCircle2 size={12} aria-hidden="true" /> Assessment complete
//                             </div>
//                             <h1 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(28px,5.5vw,40px)] font-light text-[#1c2820] leading-[1.16] mb-3">
//                                 Here's what stood out, {firstName}.
//                             </h1>
//                             <p className="text-[15px] text-[#3a4a3e] leading-[1.7] max-w-[560px]">
//                                 Your responses suggest a {bandCopy[result.overallBand].label.toLowerCase()} pattern, more in some areas
//                                 than others. This isn't a diagnosis, just a starting point for understanding it.
//                             </p>
//                         </div>
//                     </section>

//                     {/* Radar chart, bold and prominent, this is the visual
//                         centerpiece of the free result, mobile/tablet only,
//                         desktop shows the same chart in the sticky sidebar
//                         instead so it's paired with the CTA while scrolling. */}
//                     <section className="pt-6 pb-2 lg:hidden">
//                         <div className="bg-white rounded-3xl border border-[#e4e9e5] p-7 shadow-[0_10px_50px_rgba(28,40,36,0.07)] flex flex-col items-center">
//                             <RadarChart points={radarPoints(result)} size={260} />
//                         </div>
//                     </section>

//                     {/* ── Strengths, only rendered if any domain actually
//                         qualifies as minimal/mild, otherwise this would show
//                         the heading with nothing underneath it ── */}
//                     {result.strengths.length > 0 && (
//                         <section className="py-6">
//                             <div className="bg-gradient-to-br from-[#f2f7f3] to-white rounded-3xl border border-[#d5e5da] p-8 text-center">
//                                 <p className="text-[15px] text-[#3a4a3e] mb-5">Your responses also suggest strengths.</p>
//                                 <div className="flex flex-wrap justify-center gap-2.5">
//                                     {result.strengths.map((s) => (
//                                         <span key={s.domain} className="text-[13px] font-medium text-[#2d7a5a] bg-white border border-[#d5e5da] px-4 py-2 rounded-full">
//                                             {strengthsPool[s.domain]}
//                                         </span>
//                                     ))}
//                                 </div>
//                             </div>
//                         </section>
//                     )}

//                     {/* ── What this means, collapsible to keep the page scannable ── */}
//                     <section className="py-4">
//                         <WhatThisMeansSection />
//                     </section>

//                     {/* ── Real testimonials, only render if configured ────────────── */}
//                     {testimonials.length > 0 && (
//                         <section className="py-4">
//                             <h2 className="text-[13px] font-semibold tracking-[0.06em] uppercase text-[#4a6a56] mb-4 text-center">
//                                 What others found
//                             </h2>
//                             <Testimonials items={testimonials} />
//                         </section>
//                     )}

//                     {/* ── Domain-by-domain breakdown, now a single collapsed
//                         toggle instead of 8 accordions taking up space near the
//                         top. Detail is still all there for anyone who wants it,
//                         it's just opt-in now instead of the default view. ── */}
//                     <section className="py-4">
//                         <DomainBreakdownToggle orderedDomains={orderedDomains} />
//                     </section>

//                     {unlocked ? (
//                         <section id="pricing-anchor" className="py-8">
//                             <UnlockedReport stored={stored} txRef={txRef} />
//                         </section>
//                     ) : (
//                         <>
//                             {/* ── Report preview, blurred pages create curiosity ────── */}
//                             <section className="py-8">
//                                 <div className="bg-white border border-[#e4e9e5] rounded-3xl p-8 lg:p-10 text-center">
//                                     <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#2d7a5a] mb-3">Your complete report</p>
//                                     <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(24px,4.5vw,30px)] font-light text-[#1c2820] mb-8">
//                                         Unlock your complete personalized report
//                                     </h2>
//                                     <ReportPreviewMock name={firstName} result={result} />
//                                     <div className="grid sm:grid-cols-2 gap-2.5 mt-9 text-left max-w-[440px] mx-auto">
//                                         {[
//                                             "18+ pages",
//                                             "Detailed explanation of every domain",
//                                             "Visual charts",
//                                             "Practical strategies",
//                                             "Professional discussion guide",
//                                             "Lifestyle recommendations",
//                                             "Personalized next steps",
//                                             "Printable, instant download",
//                                         ].map((f) => (
//                                             <div key={f} className="flex items-center gap-2">
//                                                 <CheckCircle2 size={14} className="text-[#2d7a5a] flex-shrink-0" aria-hidden="true" />
//                                                 <span className="text-[13px] text-[#3a4a3e]">{f}</span>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </section>

//                             {/* Pricing, mobile/tablet inline, desktop shows it in the sticky sidebar instead */}
//                             <section id="pricing-anchor" className="py-8 lg:hidden">
//                                 <PricingCard stored={stored} verifying={verifying} onSuccess={handlePaymentSuccess} />
//                             </section>

//                             {/* ── FAQ ─────────────────────────────────────────────────── */}
//                             <section className="py-10 border-t border-[#e4e9e5]">
//                                 <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-[24px] font-light text-[#1c2820] mb-6">
//                                     Common questions
//                                 </h2>
//                                 <div className="flex flex-col gap-2.5">
//                                     {faqItems.map((f) => (
//                                         <FaqRow key={f.q} q={f.q} a={f.a} />
//                                     ))}
//                                 </div>
//                             </section>

//                             {/* ── Final CTA ──────────────────────────────────────────── */}
//                             <section className="py-14 text-center">
//                                 <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(22px,4.5vw,28px)] font-light text-[#1c2820] mb-6 leading-[1.3]">
//                                     Still wondering why focus feels difficult?
//                                 </h2>
//                                 <ScrollToPricingButton />
//                             </section>
//                         </>
//                     )}
//                 </main>

//                 {/* ── Sticky sidebar, desktop only: radar chart + pricing always in view ── */}
//                 <aside className="hidden lg:block lg:sticky lg:top-[100px] lg:self-start">
//                     <div className="bg-white rounded-3xl border border-[#e4e9e5] p-6 pb-5 shadow-[0_10px_50px_rgba(28,40,36,0.07)] flex flex-col items-center mb-5">
//                         <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#4a6a56] mb-3 self-start">Your pattern at a glance</p>
//                         <RadarChart points={radarPoints(result)} size={230} />
//                     </div>
//                     {unlocked ? (
//                         <UnlockedReport stored={stored} txRef={txRef} compact />
//                     ) : (
//                         <PricingCard stored={stored} verifying={verifying} onSuccess={handlePaymentSuccess} compact />
//                     )}
//                 </aside>
//             </div>

//             {/* ── Mobile sticky bar: pricing prompt before payment, a
//                 persistent success confirmation after. Previously this bar
//                 just vanished entirely once `unlocked` became true, meaning
//                 a mobile visitor who dismissed or missed the success modal
//                 had zero on-screen confirmation their payment went through
//                 or that the report was emailed, without scrolling all the
//                 way down to the report card. Now it flips to a success
//                 state instead of disappearing. ── */}
//             {!unlocked && showMobileBar && !mobileBarDismissed && (
//                 <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[90] bg-white border-t border-[#e4e9e5] shadow-[0_-8px_30px_rgba(28,40,36,0.1)] px-4 py-3 flex items-center gap-3">
//                     <div className="flex-1 min-w-0">
//                         <p className="text-[15px] font-semibold text-[#1c2820] leading-none mb-0.5">${PRIMARY_PLAN.amountUSD} report</p>
//                         <p className="text-[11px] text-[#4a5a52] truncate">Instant access, money-back guarantee</p>
//                     </div>
//                     <ScrollToPricingButton compact />
//                     <button
//                         onClick={() => setMobileBarDismissed(true)}
//                         aria-label="Dismiss"
//                         className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-[#4a5a52] hover:bg-[#f5f5f2]"
//                     >
//                         <XIcon size={16} />
//                     </button>
//                 </div>
//             )}

//             {unlocked && stored && !successBarDismissed && (
//                 <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[90] bg-[#0E5C3D] shadow-[0_-8px_30px_rgba(14,92,61,0.25)] px-4 py-3 flex items-center gap-3">
//                     <CheckCircle2 size={20} color="white" className="flex-shrink-0" aria-hidden="true" />
//                     <div className="flex-1 min-w-0">
//                         <p className="text-[13px] font-semibold text-white leading-tight">Paid, sent to your email</p>
//                         <p className="text-[10.5px] text-white/70 truncate">{stored.email}</p>
//                     </div>
//                     <a
//                         href={`/api/adhd/report/pdf?tx_ref=${encodeURIComponent(txRef ?? "")}`}
//                         className="flex-shrink-0 inline-flex items-center gap-1.5 py-2 px-4 bg-white text-[#0E5C3D] rounded-full text-[12.5px] font-semibold no-underline"
//                     >
//                         <FileText size={13} aria-hidden="true" /> Download
//                     </a>
//                     <button
//                         onClick={() => setSuccessBarDismissed(true)}
//                         aria-label="Dismiss"
//                         className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-white/70 hover:bg-white/10"
//                     >
//                         <XIcon size={15} />
//                     </button>
//                 </div>
//             )}

//             {/* ── Payment success modal: fixed overlay, so it's visible the
//                 instant payment completes regardless of scroll position.
//                 Previously the only confirmation was a small "Confirming
//                 your payment…" line inside the pricing card itself, easy to
//                 miss entirely if that card was scrolled out of view (e.g.
//                 the sidebar on desktop, or the mobile inline card after
//                 they've scrolled past it). ── */}
//             {showSuccessModal && stored && (
//                 <PaymentSuccessModal
//                     email={stored.email}
//                     txRef={txRef}
//                     onClose={() => setShowSuccessModal(false)}
//                 />
//             )}
//         </PageShell>
//     );
// }

// function PaymentSuccessModal({ email, txRef, onClose }: { email: string; txRef: string | null; onClose: () => void }) {
//     const downloadHref = `/api/adhd/report/pdf?tx_ref=${encodeURIComponent(txRef ?? "")}`;
//     return (
//         <div
//             className="fixed inset-0 z-[200] bg-[#0E5C3D]/40 backdrop-blur-[2px] flex items-center justify-center p-5"
//             role="dialog"
//             aria-modal="true"
//             aria-labelledby="payment-success-title"
//         >
//             <div className="relative bg-white rounded-[28px] max-w-[420px] w-full p-8 text-center shadow-[0_30px_90px_rgba(14,92,61,0.3)] fade-up-modal">
//                 <button
//                     onClick={onClose}
//                     aria-label="Close"
//                     className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#4a5a52] hover:bg-[#f5f5f2]"
//                 >
//                     <XIcon size={16} />
//                 </button>
//                 <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] inline-flex items-center justify-center mb-5">
//                     <CheckCircle2 size={30} color="white" aria-hidden="true" />
//                 </div>
//                 <h2 id="payment-success-title" className="font-['Cormorant_Garamond',Georgia,serif] text-[26px] font-light text-[#1c2820] mb-2.5">
//                     Payment successful
//                 </h2>
//                 <p className="text-[14px] text-[#3a4a3e] leading-[1.65] mb-1">
//                     Your full report has been sent to
//                 </p>
//                 <p className="text-[14px] font-semibold text-[#1c2820] mb-6">{email}</p>
//                 <a
//                     href={downloadHref}
//                     className="cta-btn w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] text-white rounded-full text-[14px] font-medium no-underline mb-3"
//                 >
//                     <FileText size={15} aria-hidden="true" /> Download your report now
//                 </a>
//                 <button
//                     onClick={() => {
//                         onClose();
//                         // Give the modal a moment to unmount before scrolling,
//                         // otherwise the scroll target's position is measured
//                         // while the modal (and its scroll-lock-adjacent
//                         // layout) is still in the DOM.
//                         setTimeout(() => document.getElementById("pricing-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
//                     }}
//                     className="text-[13px] text-[#4a5a52] hover:text-[#1c2820] py-1"
//                 >
//                     View my results page
//                 </button>
//                 <p className="text-[11px] text-[#4a5a52] mt-5 leading-[1.5]">
//                     Didn't get the email? Check spam, or use the download button above, your report is also always
//                     available from this page.
//                 </p>
//             </div>
//         </div>
//     );
// }

// function radarPoints(result: AssessmentResult) {
//     return RADAR_DOMAINS.map(({ domain, label }) => ({
//         label,
//         percent: result.domainResults.find((d) => d.domain === domain)?.percent ?? 0,
//     }));
// }

// function ScrollToPricingButton({ compact = false }: { compact?: boolean }) {
//     return (
//         <a
//             href="#pricing-anchor"
//             onClick={(e) => { e.preventDefault(); document.getElementById("pricing-anchor")?.scrollIntoView({ behavior: "smooth", block: "center" }); }}
//             className={
//                 compact
//                     ? "cta-btn inline-flex items-center gap-1.5 py-2.5 px-5 bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] text-white rounded-full text-[13px] font-medium no-underline flex-shrink-0"
//                     : "cta-btn inline-flex items-center gap-2 py-4 px-9 bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] text-white rounded-full text-[15px] font-medium no-underline shadow-[0_6px_26px_rgba(30,107,107,0.32)]"
//             }
//         >
//             <Sparkles size={compact ? 13 : 15} aria-hidden="true" /> {compact ? "Unlock" : "Unlock My Full Report"}
//         </a>
//     );
// }

// // Wraps all 8 per-domain accordions behind one collapsed toggle. Previously
// // these rendered directly under the header as 8 separate open/closed
// // accordions, which made the page feel front-loaded with detail before
// // anyone had a reason to care yet. Now it's an explicit, optional deep-dive:
// // closed by default, one click reveals the same per-domain detail as before.
// function DomainBreakdownToggle({ orderedDomains }: { orderedDomains: { domain: Domain; label: string; band: keyof typeof bandCopy; percent: number }[] }) {
//     const [open, setOpen] = useState(false);
//     const panelId = "domain-breakdown-panel";
//     return (
//         <div className="bg-white rounded-2xl border border-[#e4e9e5] overflow-hidden">
//             <button
//                 onClick={() => setOpen((v) => !v)}
//                 aria-expanded={open}
//                 aria-controls={panelId}
//                 className="w-full flex items-center justify-between gap-3 px-6 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2d7a5a] focus-visible:outline-offset-[-2px]"
//             >
//                 <span>
//                     <span className="block text-[14px] font-semibold text-[#1c2820]">View your full domain-by-domain breakdown</span>
//                     <span className="block text-[12.5px] text-[#4a5a52] mt-0.5">All 8 areas, explained one at a time</span>
//                 </span>
//                 <ChevronDown size={18} aria-hidden="true" className="text-[#4a5a52] flex-shrink-0 transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "none" }} />
//             </button>
//             {open && (
//                 <div id={panelId} className="px-6 pb-6 flex flex-col gap-3">
//                     {orderedDomains.map((d, i) => (
//                         <DomainAccordion key={d.domain} domain={d.domain} label={d.label} band={d.band} defaultOpen={i === 0} />
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }

// function DomainAccordion({ domain, label, band, defaultOpen }: { domain: Domain; label: string; band: keyof typeof bandCopy; defaultOpen: boolean }) {
//     const [open, setOpen] = useState(defaultOpen);
//     const panelId = `domain-panel-${domain}`;
//     return (
//         <div className="bg-white rounded-2xl border border-[#e4e9e5] overflow-hidden">
//             <h3>
//                 <button
//                     onClick={() => setOpen((v) => !v)}
//                     aria-expanded={open}
//                     aria-controls={panelId}
//                     className="w-full flex items-center justify-between gap-3 px-6 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2d7a5a] focus-visible:outline-offset-[-2px]"
//                 >
//                     <span className="text-[13px] font-semibold tracking-[0.03em] text-[#2d7a5a]">{label}</span>
//                     <ChevronDown size={17} aria-hidden="true" className="text-[#4a5a52] flex-shrink-0 transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "none" }} />
//                 </button>
//             </h3>
//             {open && (
//                 <div id={panelId} role="region" className="px-6 pb-5">
//                     <p className="text-[14px] text-[#3a4a3e] leading-[1.75]">{domainInterpretations[domain][band]}</p>
//                 </div>
//             )}
//         </div>
//     );
// }

// function WhatThisMeansSection() {
//     const [open, setOpen] = useState(false);
//     const panelId = "what-this-means-panel";
//     return (
//         <div className="bg-white rounded-3xl border border-[#e4e9e5] overflow-hidden">
//             <h2>
//                 <button
//                     onClick={() => setOpen((v) => !v)}
//                     aria-expanded={open}
//                     aria-controls={panelId}
//                     className="w-full flex items-center justify-between gap-3 px-7 py-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2d7a5a] focus-visible:outline-offset-[-2px]"
//                 >
//                     <span className="font-['Cormorant_Garamond',Georgia,serif] text-[22px] font-light text-[#1c2820]">
//                         What this means
//                     </span>
//                     <ChevronDown size={19} aria-hidden="true" className="text-[#4a5a52] flex-shrink-0 transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "none" }} />
//                 </button>
//             </h2>
//             {!open && (
//                 <p className="px-7 pb-6 -mt-3 text-[13.5px] text-[#4a5a52] leading-[1.7]">
//                     What ADHD is, what this screening does not mean, and why symptoms like these can overlap with
//                     stress, burnout, anxiety, or sleep. Tap to read the full explanation.
//                 </p>
//             )}
//             {open && (
//                 <div id={panelId} className="px-7 pb-7 flex flex-col gap-5">
//                     <InfoBlock title="What ADHD is" text={whatThisMeans.whatItIs} />
//                     <InfoBlock title="What this screening does not mean" text={whatThisMeans.whatItIsNot} />
//                     <InfoBlock title="Why symptoms overlap" text={whatThisMeans.overlap} />
//                     <div className="bg-[#0E5C3D] rounded-2xl p-6 text-center">
//                         <p className="text-[14px] text-white leading-[1.75]">{whatThisMeans.encouragement}</p>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// function InfoBlock({ title, text }: { title: string; text: string }) {
//     return (
//         <div className="bg-[#faf9f6] rounded-2xl border border-[#e4e9e5] p-6">
//             <p className="text-[13.5px] font-semibold text-[#1c2820] mb-2">{title}</p>
//             <p className="text-[13.5px] text-[#3a4a3e] leading-[1.75]">{text}</p>
//         </div>
//     );
// }

// function FaqRow({ q, a }: { q: string; a: string }) {
//     const [open, setOpen] = useState(false);
//     const panelId = `faq-${q.replace(/\W+/g, "-").toLowerCase()}`;
//     return (
//         <div className="bg-white rounded-xl border border-[#e4e9e5] overflow-hidden">
//             <h3>
//                 <button
//                     onClick={() => setOpen((v) => !v)}
//                     aria-expanded={open}
//                     aria-controls={panelId}
//                     className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2d7a5a] focus-visible:outline-offset-[-2px]"
//                 >
//                     <span className="text-[13.5px] font-medium text-[#1c2820]">{q}</span>
//                     <ChevronDown size={16} aria-hidden="true" className="text-[#4a5a52] flex-shrink-0 transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "none" }} />
//                 </button>
//             </h3>
//             {open && (
//                 <div id={panelId} className="px-5 pb-4">
//                     <p className="text-[13px] text-[#3a4a3e] leading-[1.7]">{a}</p>
//                 </div>
//             )}
//         </div>
//     );
// }

// function PricingCard({ stored, verifying, onSuccess, compact = false }: { stored: StoredResult; verifying: boolean; onSuccess: () => void; compact?: boolean }) {
//     return (
//         <div className={`bg-white rounded-[28px] border border-[#e4e9e5] shadow-[0_16px_60px_rgba(28,40,36,0.1)] overflow-hidden ${compact ? "" : "max-w-[440px] mx-auto text-center"}`}>
//             <div className="h-[3px] bg-gradient-to-r from-[#2d7a5a] via-[#1e6b6b] to-[#5da885]" />
//             <div className={compact ? "p-6 text-center" : "p-9"}>
//                 <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#2d7a5a] mb-2">Your full report</p>
//                 <p className={`font-['Cormorant_Garamond',Georgia,serif] font-light text-[#1c2820] leading-none mb-1 ${compact ? "text-[38px]" : "text-[52px]"}`}>
//                     ${PRIMARY_PLAN.amountUSD}
//                 </p>
//                 <p className="text-[13px] text-[#4a5a52] mb-4">One purchase. Instant access.</p>

//                 {/* Three short lines, not a long feature list, enough to
//                     justify the price without turning the card into a wall of
//                     checkmarks (the full 8-item list lives in the report
//                     preview section above, this is just a reminder). */}
//                 <ul className="text-left inline-flex flex-col gap-1.5 mb-5">
//                     {["Full domain breakdown", "Personalized strategies", "Doctor discussion guide"].map((f) => (
//                         <li key={f} className="flex items-center gap-2 text-[12.5px] text-[#3a4a3e]">
//                             <CheckCircle2 size={13} className="text-[#2d7a5a] flex-shrink-0" aria-hidden="true" /> {f}
//                         </li>
//                     ))}
//                 </ul>

//                 <FlutterwaveCheckout
//                     planKey={PRIMARY_PLAN.key}
//                     leadId={stored.leadId}
//                     amountUSD={PRIMARY_PLAN.amountUSD}
//                     label={PRIMARY_PLAN.label}
//                     customer={{ name: stored.name, email: stored.email, phone: stored.phone }}
//                     onSuccess={onSuccess}
//                 />
//                 {verifying && <p className="text-[12px] text-[#4a5a52] mt-3">Confirming your payment…</p>}

//                 <div className={`flex items-center gap-3 mt-5 flex-wrap ${compact ? "justify-center" : "justify-center gap-4"}`}>
//                     <span className="flex items-center gap-1.5 text-[11px] text-[#4a5a52]"><ShieldCheck size={12} aria-hidden="true" /> Money-back guarantee</span>
//                     <span className="flex items-center gap-1.5 text-[11px] text-[#4a5a52]"><FileText size={12} aria-hidden="true" /> Secure checkout</span>
//                 </div>
//             </div>
//         </div>
//     );
// }

// function UnlockedReport({ stored, txRef, compact = false }: { stored: StoredResult; txRef: string | null; compact?: boolean }) {
//     const downloadHref = `/api/adhd/report/pdf?tx_ref=${encodeURIComponent(txRef ?? "")}`;

//     return (
//         <div className={`bg-white rounded-[28px] border border-[#2d7a5a]/30 text-center shadow-[0_10px_50px_rgba(28,40,36,0.08)] ${compact ? "p-6" : "p-8 max-w-[560px] mx-auto"}`}>
//             <div className={`rounded-2xl bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] inline-flex items-center justify-center mb-5 ${compact ? "w-11 h-11" : "w-14 h-14"}`}>
//                 <CheckCircle2 size={compact ? 20 : 26} color="white" aria-hidden="true" />
//             </div>
//             <h2 className={`font-['Cormorant_Garamond',Georgia,serif] font-light text-[#1c2820] mb-2 ${compact ? "text-[19px]" : "text-[26px]"}`}>Your full report is ready</h2>
//             <p className="text-[13px] text-[#4a5a52] mb-5">
//                 We've sent it to {stored.email}. You can also download it directly below.
//             </p>
//             <a href={downloadHref} className="cta-btn inline-flex items-center gap-2 py-3 px-6 bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] text-white rounded-full text-[13.5px] font-medium no-underline">
//                 <FileText size={14} aria-hidden="true" /> Download your report
//             </a>
//         </div>
//     );
// }

// function PageShell({ children }: { children?: React.ReactNode }) {
//     return (
//         <div className="min-h-screen bg-[#faf9f6] font-['DM_Sans',sans-serif]">
//             <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:bg-white focus:text-[#1c2820] focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg">
//                 Skip to results
//             </a>
//             <nav className="fixed top-0 left-0 right-0 z-[100] bg-[rgba(250,249,246,0.92)] backdrop-blur-[18px] shadow-[0_1px_0_rgba(28,40,36,0.08)]">
//                 <div className="max-w-[1180px] mx-auto px-6 lg:px-10 h-[68px] flex items-center">
//                     <Link href="/" className="flex items-center gap-2.5 no-underline">
//                         <Image src="/logo-assessment.png" alt="Mentel logo" width={32} height={32} className="rounded-[10px] object-cover" />
//                         <span className="font-['Cormorant_Garamond',Georgia,serif] text-[22px] font-semibold tracking-[-0.02em] text-[#1c2820]">Mentel</span>
//                     </Link>
//                 </div>
//             </nav>
//             <div id="main-content" />
//             <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,450;9..40,500;9..40,600&display=swap');
//         *, *::before, *::after { box-sizing: border-box; }
//         body { font-family: 'DM Sans', -apple-system, sans-serif; background: #faf9f6; -webkit-font-smoothing: antialiased; }
//         @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
//         .fade-up { animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both; }
//         @keyframes fadeUpModal { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
//         .fade-up-modal { animation: fadeUpModal 0.35s cubic-bezier(0.22,1,0.36,1) both; }
//         .cta-btn { transition: all 0.25s cubic-bezier(0.22,1,0.36,1); }
//         .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(30,107,107,0.38) !important; }
//         .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
//         .focus\\:not-sr-only:focus { position: fixed; width: auto; height: auto; padding: inherit; margin: inherit; overflow: visible; clip: auto; white-space: normal; }
//         a:focus-visible, button:focus-visible { outline: 2px solid #2d7a5a; outline-offset: 2px; }
//       `}</style>
//             {children}
//         </div>
//     );
// }


// export default function AdhdResultPage() {
//     return (
//         <Suspense fallback={<PageShell />}>
//             <AdhdResultContent />
//         </Suspense>
//     );
// }
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
// "use client";

// import { useEffect, useState, Suspense } from "react";
// import { useSearchParams } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";
// import { CheckCircle2, ShieldCheck, FileText, ArrowRight, ChevronDown, Sparkles, X as XIcon } from "lucide-react";
// import { AssessmentResult, bandCopy, scoreAssessment, Answers } from "@/lib/adhd/scoring";
// import { Domain } from "@/lib/adhd/questions";
// import { domainInterpretations, strengthsPool, whatThisMeans, faqItems } from "@/lib/adhd/interpretations";
// import { ADHD_PLANS } from "@/lib/payments/adhd-plans";
// import FlutterwaveCheckout from "@/components/payments/FlutterwaveCheckout";
// import RadarChart from "@/components/adhd/RadarChart";
// import ReportPreviewMock from "@/components/adhd/ReportPreviewMock";
// import { Testimonials } from "@/components/adhd/TrustAndProof";
// import { testimonials } from "@/lib/adhd/social-proof-config";
// import { CompletedPointer, loadCompletedPointer, persistCompletedPointer } from "../page";

// interface StoredResult {
//     name: string;
//     email: string;
//     phone: string;
//     answers: Answers;
//     result: AssessmentResult;
//     leadId: string | null;
//     completedAt: number;
// }

// // The single plan shown on this page, per the "one centered pricing
// // section, not ecommerce cards" brief. The toolkit upsell tier still
// // exists in lib/payments/adhd-plans.ts if you want to reintroduce it as a
// // post-purchase upsell later, it's just not the primary offer here.
// const PRIMARY_PLAN = ADHD_PLANS.report;

// // Radar axes per the brief: Attention, Memory, Executive, Planning,
// // Emotional Regulation, Hyperactivity.
// const RADAR_DOMAINS: { domain: Domain; label: string }[] = [
//     { domain: "attention", label: "Attention" },
//     { domain: "working_memory", label: "Memory" },
//     { domain: "executive_function", label: "Executive" },
//     { domain: "organisation", label: "Planning" },
//     { domain: "emotional_regulation", label: "Emotional\nRegulation" },
//     { domain: "hyperactivity", label: "Hyperactivity" },
// ];

// function AdhdResultContent() {
//     const searchParams = useSearchParams();
//     const txRef = searchParams.get("tx_ref");
//     const leadIdParam = searchParams.get("leadId");
//     const transactionId = searchParams.get("transaction_id");
//     const paymentStatus = searchParams.get("status");
//     const [stored, setStored] = useState<StoredResult | null>(null);
//     const [recovering, setRecovering] = useState(!!txRef || !!leadIdParam);
//     const [notFound, setNotFound] = useState(false);
//     const [unlocked, setUnlocked] = useState(false);
//     // Holds the tx_ref discovered via a leadId-only recovery (see below),
//     // for when someone arrives at /adhd/result?leadId=... having already
//     // paid on a previous visit, there's no tx_ref in *this* URL, but the
//     // download link and the unlocked-report UI both need one. Everywhere
//     // that needs "the tx_ref for this visit" should use effectiveTxRef,
//     // not the raw txRef URL param, below.
//     const [recoveredTxRef, setRecoveredTxRef] = useState<string | null>(null);
//     const effectiveTxRef = txRef ?? recoveredTxRef;
//     const [showSuccessModal, setShowSuccessModal] = useState(false);
//     const [verifying, setVerifying] = useState(!!txRef);
//     // Show immediately rather than gating behind a scroll threshold: the
//     // point of this bar is that pricing is visible without having to
//     // scroll to find it, gating it behind scrollY defeated that.
//     const [showMobileBar, setShowMobileBar] = useState(true);
//     const [mobileBarDismissed, setMobileBarDismissed] = useState(false);
//     const [successBarDismissed, setSuccessBarDismissed] = useState(false);

//     useEffect(() => {
//         // Primary path: the assessment flow wrote this to sessionStorage right
//         // before redirecting here (see app/adhd/page.tsx). Fast, no network
//         // round trip, works for the vast majority of visits.
//         let foundInSession = false;
//         try {
//             const raw = window.sessionStorage.getItem("mentel_adhd_result");
//             if (raw) {
//                 setStored(JSON.parse(raw));
//                 foundInSession = true;
//             }
//         } catch { /* sessionStorage unavailable, fall through to recovery below */ }

//         if (foundInSession) {
//             setRecovering(false);
//             return;
//         }

//         // Recovery path: sessionStorage can legitimately be gone by the time
//         // we land back here. Two different reasons someone might arrive
//         // this way, both handled by the same server lookup:
//         //   - tx_ref in the URL: some payment methods (3D Secure, bank
//         //     transfer, USSD) route through a redirect that can involve a
//         //     fresh tab or navigation context depending on the browser,
//         //     which doesn't always preserve the original tab's
//         //     sessionStorage.
//         //   - leadId in the URL: someone who completed the free assessment,
//         //     never paid, closed the tab, and came back later via the
//         //     "welcome back, view results" banner on the intro page (see
//         //     app/adhd/page.tsx's completedAvailable flow). sessionStorage
//         //     from that original visit is long gone by design in this case,
//         //     that's the whole point of that flow existing.
//         const recoveryKey = txRef ? `txRef=${encodeURIComponent(txRef)}` : leadIdParam ? `leadId=${encodeURIComponent(leadIdParam)}` : null;
//         if (!recoveryKey) {
//             setRecovering(false);
//             return;
//         }
//         fetch(`/api/adhd/lead?${recoveryKey}`)
//             .then((r) => r.json())
//             .then((data) => {
//                 if (!data?.success) { setNotFound(true); return; }
//                 const answers = data.answers as Answers;
//                 const result = scoreAssessment(answers);
//                 const recovered: StoredResult = {
//                     name: data.name ?? "",
//                     email: data.email ?? "",
//                     phone: data.phone ?? "",
//                     answers,
//                     result,
//                     leadId: data.leadId ?? null,
//                     completedAt: Date.now(),
//                 };
//                 setStored(recovered);

//                 // The actual fix for "reload /adhd, still asks me to pay
//                 // even though I already did": previously this branch never
//                 // looked at payment status at all, unlocked only ever got
//                 // set by the separate verify effect below, which requires a
//                 // tx_ref in *this* URL. Arriving via leadId (e.g. from the
//                 // intro page's "welcome back" banner, which links to
//                 // /adhd/result?leadId=... with no tx_ref) meant unlocked
//                 // could never become true no matter what the database said.
//                 // Trusting `status` here directly (no second round-trip to
//                 // Flutterwave) is safe: this data came from our own
//                 // database, which only ever gets marked "paid" after a real
//                 // verified Flutterwave transaction, see
//                 // lib/payments/flutterwave-verify.ts.
//                 if (data.status === "paid" && data.txRef) {
//                     setUnlocked(true);
//                     setRecoveredTxRef(data.txRef);
//                     setVerifying(false);
//                 }
//                 // Re-seed sessionStorage so the rest of this visit behaves
//                 // exactly like the normal (non-recovery) path.
//                 try { window.sessionStorage.setItem("mentel_adhd_result", JSON.stringify(recovered)); } catch { /* best effort */ }
//             })
//             .catch(() => setNotFound(true))
//             .finally(() => setRecovering(false));
//     }, [txRef]);

//     useEffect(() => {
//         if (!txRef) return;
//         fetch(`/api/flutterwave/verify?tx_ref=${encodeURIComponent(txRef)}`)
//             .then((r) => r.json())
//             .then((data) => {
//                 const success = !!data?.success;
//                 setUnlocked(success);
//                 if (!success) return;


//                 // Payment has been genuinely verified by our server.
//                 // Update the existing completed pointer with the payment details.
//                 try {
//                     const completed = loadCompletedPointer();

//                     persistCompletedPointer({
//                         ...(completed ?? {}),
//                         txRef,
//                         status: paymentStatus ?? "successful",
//                         transactionId,
//                         completedAt: Date.now(),
//                     });
//                 } catch {
//                     /* best effort */
//                 }

//                 // If this tx_ref matches one we flagged as "checkout in
//                 // progress" right before opening Flutterwave's modal (see
//                 // components/payments/FlutterwaveCheckout.tsx), this is a
//                 // genuine just-completed payment landing back here via
//                 // redirect, not someone revisiting an old paid link, show
//                 // the same success confirmation the in-page callback path
//                 // shows. Clear the flag either way so a later reload of
//                 // this same URL doesn't re-trigger it.
//                 try {
//                     const pending = window.sessionStorage.getItem("mentel_adhd_pending_tx_ref");
//                     if (pending && pending === txRef) {
//                         setShowSuccessModal(true);
//                         window.sessionStorage.removeItem("mentel_adhd_pending_tx_ref");
//                     }
//                 } catch { /* best effort */ }
//             })
//             .finally(() => setVerifying(false));
//     }, [txRef, paymentStatus, transactionId]);

//     // Called from PricingCard the moment Flutterwave confirms payment.
//     // Deliberately separate from the mount-time verify effect above: that
//     // effect also sets `unlocked`, but for someone reloading a link to a
//     // report they already paid for, which shouldn't re-trigger a "payment
//     // successful!" celebration. This handler is only ever called right
//     // after an actual just-completed checkout, which is exactly when the
//     // person needs an unmissable confirmation, previously the only signal
//     // was a small "Confirming your payment…" line inside the pricing card
//     // itself, easy to miss if they'd scrolled away from it or the card was
//     // off-screen (the sidebar on desktop, for instance).
//     function handlePaymentSuccess() {
//         setUnlocked(true);
//         setShowSuccessModal(true);
//     }

//     if (recovering) {
//         return (
//             <PageShell>
//                 <div className="max-w-[400px] mx-auto text-center pt-32 px-6">
//                     <div className="w-9 h-9 border-[2.5px] border-[#2d7a5a]/20 border-t-[#2d7a5a] rounded-full mx-auto animate-spin mb-5" />
//                     <p className="text-[13.5px] text-[#4a5a52]">Loading your results…</p>
//                 </div>
//             </PageShell>
//         );
//     }

//     // Previously the only sign that a payment was being confirmed was a
//     // small "Confirming your payment…" line inside the pricing card, easy
//     // to miss (the card might be scrolled out of view), and the free
//     // result content rendered normally underneath it regardless, which
//     // could read as "did my payment even register?" Now, landing here with
//     // a tx_ref shows a dedicated, unmissable verifying screen instead of
//     // the page underneath, until we actually know whether it succeeded.
//     if (txRef && verifying && !unlocked) {
//         return (
//             <PageShell>
//                 <div className="max-w-[400px] mx-auto text-center pt-32 px-6">
//                     <div className="w-12 h-12 border-[3px] border-[#2d7a5a]/20 border-t-[#2d7a5a] rounded-full mx-auto animate-spin mb-6" />
//                     <h1 className="font-['Cormorant_Garamond',Georgia,serif] text-[24px] font-light text-[#1c2820] mb-2">
//                         Verifying your payment
//                     </h1>
//                     <p className="text-[13.5px] text-[#4a5a52]">This only takes a moment, please don't close this page.</p>
//                 </div>
//             </PageShell>
//         );
//     }

//     if (!stored || notFound) {
//         return (
//             <PageShell>
//                 <div className="max-w-[440px] mx-auto text-center pt-32 px-6">
//                     <h1 className="font-['Cormorant_Garamond',Georgia,serif] text-[28px] font-light text-[#1c2820] mb-3">
//                         We couldn't find a recent result
//                     </h1>
//                     <p className="text-[14px] text-[#4a5a52] mb-7">
//                         Your session may have expired. Let's take the assessment again, it only takes a few minutes.
//                     </p>
//                     <Link href="/adhd" className="cta-btn inline-flex items-center gap-2 py-3.5 px-8 bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] text-white rounded-full text-[14px] font-medium no-underline">
//                         Start the assessment <ArrowRight size={15} />
//                     </Link>
//                 </div>
//             </PageShell>
//         );
//     }

//     const { result, name } = stored;
//     const firstName = name ? name.split(" ")[0] : "there";
//     const orderedDomains = [...result.domainResults].sort((a, b) => b.percent - a.percent);

//     return (
//         <PageShell>
//             {/* Wide desktop container: content column + sticky sidebar, so the
//                 page spreads out on large screens instead of a narrow centered
//                 column with big empty margins either side. */}
//             <div className="max-w-[1180px] mx-auto px-6 lg:px-10 pt-[104px] pb-20 lg:grid lg:grid-cols-[1fr_360px] lg:gap-12 lg:items-start">
//                 <main className="min-w-0">
//                     {/* ── Header, kept to one brief line, the detail lives in the
//                         domain breakdown further down for anyone who wants it ── */}
//                     <section className="pb-2">
//                         <div className="fade-up">
//                             <div className="inline-flex items-center gap-1.5 bg-[#f2f7f3] text-[#2d7a5a] text-[11px] font-semibold tracking-[0.08em] uppercase px-3.5 py-1.5 rounded-full mb-5">
//                                 <CheckCircle2 size={12} aria-hidden="true" /> Assessment complete
//                             </div>
//                             <h1 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(28px,5.5vw,40px)] font-light text-[#1c2820] leading-[1.16] mb-3">
//                                 Here's what stood out, <span className="text-[#2d7a5a] font-bold">{firstName}</span>.
//                             </h1>
//                             <p className="text-[15px] text-[#3a4a3e] leading-[1.7] max-w-[560px]">
//                                 Your responses suggest a {bandCopy[result.overallBand].label.toLowerCase()} pattern, more in some areas
//                                 than others. This isn't a diagnosis, just a starting point for understanding it.
//                             </p>
//                         </div>
//                     </section>

//                     {/* Radar chart, bold and prominent, this is the visual
//                         centerpiece of the free result, mobile/tablet only,
//                         desktop shows the same chart in the sticky sidebar
//                         instead so it's paired with the CTA while scrolling. */}
//                     <section className="pt-6 pb-2 lg:hidden">
//                         <div className="bg-white rounded-3xl border border-[#e4e9e5] p-7 shadow-[0_10px_50px_rgba(28,40,36,0.07)] flex flex-col items-center">
//                             <RadarChart points={radarPoints(result)} size={260} />
//                         </div>
//                     </section>

//                     {/* ── Strengths, only rendered if any domain actually
//                         qualifies as minimal/mild, otherwise this would show
//                         the heading with nothing underneath it ── */}
//                     {result.strengths.length > 0 && (
//                         <section className="py-6">
//                             <div className="bg-gradient-to-br from-[#f2f7f3] to-white rounded-3xl border border-[#d5e5da] p-8 text-center">
//                                 <p className="text-[15px] text-[#3a4a3e] mb-5">Your responses also suggest strengths.</p>
//                                 <div className="flex flex-wrap justify-center gap-2.5">
//                                     {result.strengths.map((s) => (
//                                         <span key={s.domain} className="text-[13px] font-medium text-[#2d7a5a] bg-white border border-[#d5e5da] px-4 py-2 rounded-full">
//                                             {strengthsPool[s.domain]}
//                                         </span>
//                                     ))}
//                                 </div>
//                             </div>
//                         </section>
//                     )}

//                     {/* ── What this means, collapsible to keep the page scannable ── */}
//                     <section className="py-4">
//                         <WhatThisMeansSection />
//                     </section>

//                     {/* ── Real testimonials, only render if configured ────────────── */}
//                     {testimonials.length > 0 && (
//                         <section className="py-4">
//                             <h2 className="text-[13px] font-semibold tracking-[0.06em] uppercase text-[#4a6a56] mb-4 text-center">
//                                 What others found
//                             </h2>
//                             <Testimonials items={testimonials} />
//                         </section>
//                     )}

//                     {/* ── Domain-by-domain breakdown, now a single collapsed
//                         toggle instead of 8 accordions taking up space near the
//                         top. Detail is still all there for anyone who wants it,
//                         it's just opt-in now instead of the default view. ── */}
//                     <section className="py-4">
//                         <DomainBreakdownToggle orderedDomains={orderedDomains} />
//                     </section>

//                     {unlocked ? (
//                         <section id="pricing-anchor" className="py-8">
//                             <UnlockedReport stored={stored} txRef={effectiveTxRef} />
//                         </section>
//                     ) : (
//                         <>
//                             {/* ── Report preview, blurred pages create curiosity ────── */}
//                             <section className="py-8">
//                                 <div className="bg-white border border-[#e4e9e5] rounded-3xl p-8 lg:p-10 text-center">
//                                     <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#2d7a5a] mb-3">Your complete report</p>
//                                     <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(24px,4.5vw,30px)] font-light text-[#1c2820] mb-8">
//                                         Unlock your complete personalized report
//                                     </h2>
//                                     <ReportPreviewMock name={firstName} result={result} />
//                                     <div className="grid sm:grid-cols-2 gap-2.5 mt-9 text-left max-w-[440px] mx-auto">
//                                         {[
//                                             "18+ pages",
//                                             "Detailed explanation of every domain",
//                                             "Visual charts",
//                                             "Practical strategies",
//                                             "Professional discussion guide",
//                                             "Lifestyle recommendations",
//                                             "Personalized next steps",
//                                             "Printable, instant download",
//                                         ].map((f) => (
//                                             <div key={f} className="flex items-center gap-2">
//                                                 <CheckCircle2 size={14} className="text-[#2d7a5a] flex-shrink-0" aria-hidden="true" />
//                                                 <span className="text-[13px] text-[#3a4a3e]">{f}</span>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </section>

//                             {/* Pricing, mobile/tablet inline, desktop shows it in the sticky sidebar instead */}
//                             <section id="pricing-anchor" className="py-8 lg:hidden">
//                                 <PricingCard stored={stored} verifying={verifying} onSuccess={handlePaymentSuccess} />
//                             </section>

//                             {/* ── FAQ ─────────────────────────────────────────────────── */}
//                             <section className="py-10 border-t border-[#e4e9e5]">
//                                 <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-[24px] font-light text-[#1c2820] mb-6">
//                                     Common questions
//                                 </h2>
//                                 <div className="flex flex-col gap-2.5">
//                                     {faqItems.map((f) => (
//                                         <FaqRow key={f.q} q={f.q} a={f.a} />
//                                     ))}
//                                 </div>
//                             </section>

//                             {/* ── Final CTA ──────────────────────────────────────────── */}
//                             <section className="py-14 text-center">
//                                 <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(22px,4.5vw,28px)] font-light text-[#1c2820] mb-6 leading-[1.3]">
//                                     Still wondering why focus feels difficult?
//                                 </h2>
//                                 <ScrollToPricingButton />
//                             </section>
//                         </>
//                     )}
//                 </main>

//                 {/* ── Sticky sidebar, desktop only: radar chart + pricing always in view ── */}
//                 <aside className="hidden lg:block lg:sticky lg:top-[100px] lg:self-start">
//                     <div className="bg-white rounded-3xl border border-[#e4e9e5] p-6 pb-5 shadow-[0_10px_50px_rgba(28,40,36,0.07)] flex flex-col items-center mb-5">
//                         <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#4a6a56] mb-3 self-start">Your pattern at a glance</p>
//                         <RadarChart points={radarPoints(result)} size={230} />
//                     </div>
//                     {unlocked ? (
//                         <UnlockedReport stored={stored} txRef={effectiveTxRef} compact />
//                     ) : (
//                         <PricingCard stored={stored} verifying={verifying} onSuccess={handlePaymentSuccess} compact />
//                     )}
//                 </aside>
//             </div>

//             {/* ── Mobile sticky bar: pricing prompt before payment, a
//                 persistent success confirmation after. Previously this bar
//                 just vanished entirely once `unlocked` became true, meaning
//                 a mobile visitor who dismissed or missed the success modal
//                 had zero on-screen confirmation their payment went through
//                 or that the report was emailed, without scrolling all the
//                 way down to the report card. Now it flips to a success
//                 state instead of disappearing. ── */}
//             {!unlocked && showMobileBar && !mobileBarDismissed && (
//                 <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[90] bg-white border-t border-[#e4e9e5] shadow-[0_-8px_30px_rgba(28,40,36,0.1)] px-4 py-3 flex items-center gap-3">
//                     <div className="flex-1 min-w-0">
//                         <p className="text-[15px] font-semibold text-[#1c2820] leading-none mb-0.5">${PRIMARY_PLAN.amountUSD} report</p>
//                         <p className="text-[11px] text-[#4a5a52] truncate">Instant access, money-back guarantee</p>
//                     </div>
//                     <ScrollToPricingButton compact />
//                     <button
//                         onClick={() => setMobileBarDismissed(true)}
//                         aria-label="Dismiss"
//                         className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-[#4a5a52] hover:bg-[#f5f5f2]"
//                     >
//                         <XIcon size={16} />
//                     </button>
//                 </div>
//             )}

//             {unlocked && stored && !successBarDismissed && (
//                 <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[90] bg-[#0E5C3D] shadow-[0_-8px_30px_rgba(14,92,61,0.25)] px-4 py-3 flex items-center gap-3">
//                     <CheckCircle2 size={20} color="white" className="flex-shrink-0" aria-hidden="true" />
//                     <div className="flex-1 min-w-0">
//                         <p className="text-[13px] font-semibold text-white leading-tight">Paid, sent to your email</p>
//                         <p className="text-[10.5px] text-white/70 truncate">{stored.email}</p>
//                     </div>
//                     <a
//                         href={`/api/adhd/report/pdf?tx_ref=${encodeURIComponent(effectiveTxRef ?? "")}`}
//                         className="flex-shrink-0 inline-flex items-center gap-1.5 py-2 px-4 bg-white text-[#0E5C3D] rounded-full text-[12.5px] font-semibold no-underline"
//                     >
//                         <FileText size={13} aria-hidden="true" /> Download
//                     </a>
//                     <button
//                         onClick={() => setSuccessBarDismissed(true)}
//                         aria-label="Dismiss"
//                         className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-white/70 hover:bg-white/10"
//                     >
//                         <XIcon size={15} />
//                     </button>
//                 </div>
//             )}

//             {/* ── Payment success modal: fixed overlay, so it's visible the
//                 instant payment completes regardless of scroll position.
//                 Previously the only confirmation was a small "Confirming
//                 your payment…" line inside the pricing card itself, easy to
//                 miss entirely if that card was scrolled out of view (e.g.
//                 the sidebar on desktop, or the mobile inline card after
//                 they've scrolled past it). ── */}
//             {showSuccessModal && stored && (
//                 <PaymentSuccessModal
//                     email={stored.email}
//                     txRef={effectiveTxRef}
//                     onClose={() => setShowSuccessModal(false)}
//                 />
//             )}
//         </PageShell>
//     );
// }

// function PaymentSuccessModal({ email, txRef, onClose }: { email: string; txRef: string | null; onClose: () => void }) {
//     const downloadHref = `/api/adhd/report/pdf?tx_ref=${encodeURIComponent(txRef ?? "")}`;
//     return (
//         <div
//             className="fixed inset-0 z-[200] bg-[#0E5C3D]/40 backdrop-blur-[2px] flex items-center justify-center p-5"
//             role="dialog"
//             aria-modal="true"
//             aria-labelledby="payment-success-title"
//         >
//             <div className="relative bg-white rounded-[28px] max-w-[420px] w-full p-8 text-center shadow-[0_30px_90px_rgba(14,92,61,0.3)] fade-up-modal">
//                 <button
//                     onClick={onClose}
//                     aria-label="Close"
//                     className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#4a5a52] hover:bg-[#f5f5f2]"
//                 >
//                     <XIcon size={16} />
//                 </button>
//                 <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] inline-flex items-center justify-center mb-5">
//                     <CheckCircle2 size={30} color="white" aria-hidden="true" />
//                 </div>
//                 <h2 id="payment-success-title" className="font-['Cormorant_Garamond',Georgia,serif] text-[26px] font-light text-[#1c2820] mb-2.5">
//                     Payment successful
//                 </h2>
//                 <p className="text-[14px] text-[#3a4a3e] leading-[1.65] mb-1">
//                     Your full report has been sent to
//                 </p>
//                 <p className="text-[14px] font-semibold text-[#1c2820] mb-6">{email}</p>
//                 <a
//                     href={downloadHref}
//                     className="cta-btn w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] text-white rounded-full text-[14px] font-medium no-underline mb-3"
//                 >
//                     <FileText size={15} aria-hidden="true" /> Download your report now
//                 </a>
//                 <button
//                     onClick={() => {
//                         onClose();
//                         // Give the modal a moment to unmount before scrolling,
//                         // otherwise the scroll target's position is measured
//                         // while the modal (and its scroll-lock-adjacent
//                         // layout) is still in the DOM.
//                         setTimeout(() => document.getElementById("pricing-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
//                     }}
//                     className="text-[13px] text-[#4a5a52] hover:text-[#1c2820] py-1"
//                 >
//                     View my results page
//                 </button>
//                 <p className="text-[11px] text-[#4a5a52] mt-5 leading-[1.5]">
//                     Didn't get the email? Check spam, or use the download button above, your report is also always
//                     available from this page.
//                 </p>
//             </div>
//         </div>
//     );
// }

// function radarPoints(result: AssessmentResult) {
//     return RADAR_DOMAINS.map(({ domain, label }) => ({
//         label,
//         percent: result.domainResults.find((d) => d.domain === domain)?.percent ?? 0,
//     }));
// }

// function ScrollToPricingButton({ compact = false }: { compact?: boolean }) {
//     return (
//         <a
//             href="#pricing-anchor"
//             onClick={(e) => { e.preventDefault(); document.getElementById("pricing-anchor")?.scrollIntoView({ behavior: "smooth", block: "center" }); }}
//             className={
//                 compact
//                     ? "cta-btn inline-flex items-center gap-1.5 py-2.5 px-5 bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] text-white rounded-full text-[13px] font-medium no-underline flex-shrink-0"
//                     : "cta-btn inline-flex items-center gap-2 py-4 px-9 bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] text-white rounded-full text-[15px] font-medium no-underline shadow-[0_6px_26px_rgba(30,107,107,0.32)]"
//             }
//         >
//             <Sparkles size={compact ? 13 : 15} aria-hidden="true" /> {compact ? "Unlock" : "Unlock My Full Report"}
//         </a>
//     );
// }

// // Wraps all 8 per-domain accordions behind one collapsed toggle. Previously
// // these rendered directly under the header as 8 separate open/closed
// // accordions, which made the page feel front-loaded with detail before
// // anyone had a reason to care yet. Now it's an explicit, optional deep-dive:
// // closed by default, one click reveals the same per-domain detail as before.
// function DomainBreakdownToggle({ orderedDomains }: { orderedDomains: { domain: Domain; label: string; band: keyof typeof bandCopy; percent: number }[] }) {
//     const [open, setOpen] = useState(false);
//     const panelId = "domain-breakdown-panel";
//     return (
//         <div className="bg-white rounded-2xl border border-[#e4e9e5] overflow-hidden">
//             <button
//                 onClick={() => setOpen((v) => !v)}
//                 aria-expanded={open}
//                 aria-controls={panelId}
//                 className="w-full flex items-center justify-between gap-3 px-6 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2d7a5a] focus-visible:outline-offset-[-2px]"
//             >
//                 <span>
//                     <span className="block text-[14px] font-semibold text-[#1c2820]">View your full domain-by-domain breakdown</span>
//                     <span className="block text-[12.5px] text-[#4a5a52] mt-0.5">All 8 areas, explained one at a time</span>
//                 </span>
//                 <ChevronDown size={18} aria-hidden="true" className="text-[#4a5a52] flex-shrink-0 transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "none" }} />
//             </button>
//             {open && (
//                 <div id={panelId} className="px-6 pb-6 flex flex-col gap-3">
//                     {orderedDomains.map((d, i) => (
//                         <DomainAccordion key={d.domain} domain={d.domain} label={d.label} band={d.band} defaultOpen={i === 0} />
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }

// function DomainAccordion({ domain, label, band, defaultOpen }: { domain: Domain; label: string; band: keyof typeof bandCopy; defaultOpen: boolean }) {
//     const [open, setOpen] = useState(defaultOpen);
//     const panelId = `domain-panel-${domain}`;
//     return (
//         <div className="bg-white rounded-2xl border border-[#e4e9e5] overflow-hidden">
//             <h3>
//                 <button
//                     onClick={() => setOpen((v) => !v)}
//                     aria-expanded={open}
//                     aria-controls={panelId}
//                     className="w-full flex items-center justify-between gap-3 px-6 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2d7a5a] focus-visible:outline-offset-[-2px]"
//                 >
//                     <span className="text-[13px] font-semibold tracking-[0.03em] text-[#2d7a5a]">{label}</span>
//                     <ChevronDown size={17} aria-hidden="true" className="text-[#4a5a52] flex-shrink-0 transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "none" }} />
//                 </button>
//             </h3>
//             {open && (
//                 <div id={panelId} role="region" className="px-6 pb-5">
//                     <p className="text-[14px] text-[#3a4a3e] leading-[1.75]">{domainInterpretations[domain][band]}</p>
//                 </div>
//             )}
//         </div>
//     );
// }

// function WhatThisMeansSection() {
//     const [open, setOpen] = useState(false);
//     const panelId = "what-this-means-panel";
//     return (
//         <div className="bg-white rounded-3xl border border-[#e4e9e5] overflow-hidden">
//             <h2>
//                 <button
//                     onClick={() => setOpen((v) => !v)}
//                     aria-expanded={open}
//                     aria-controls={panelId}
//                     className="w-full flex items-center justify-between gap-3 px-7 py-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2d7a5a] focus-visible:outline-offset-[-2px]"
//                 >
//                     <span className="font-['Cormorant_Garamond',Georgia,serif] text-[22px] font-light text-[#1c2820]">
//                         What this means
//                     </span>
//                     <ChevronDown size={19} aria-hidden="true" className="text-[#4a5a52] flex-shrink-0 transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "none" }} />
//                 </button>
//             </h2>
//             {!open && (
//                 <p className="px-7 pb-6 -mt-3 text-[13.5px] text-[#4a5a52] leading-[1.7]">
//                     What ADHD is, what this screening does not mean, and why symptoms like these can overlap with
//                     stress, burnout, anxiety, or sleep. Tap to read the full explanation.
//                 </p>
//             )}
//             {open && (
//                 <div id={panelId} className="px-7 pb-7 flex flex-col gap-5">
//                     <InfoBlock title="What ADHD is" text={whatThisMeans.whatItIs} />
//                     <InfoBlock title="What this screening does not mean" text={whatThisMeans.whatItIsNot} />
//                     <InfoBlock title="Why symptoms overlap" text={whatThisMeans.overlap} />
//                     <div className="bg-[#0E5C3D] rounded-2xl p-6 text-center">
//                         <p className="text-[14px] text-white leading-[1.75]">{whatThisMeans.encouragement}</p>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// function InfoBlock({ title, text }: { title: string; text: string }) {
//     return (
//         <div className="bg-[#faf9f6] rounded-2xl border border-[#e4e9e5] p-6">
//             <p className="text-[13.5px] font-semibold text-[#1c2820] mb-2">{title}</p>
//             <p className="text-[13.5px] text-[#3a4a3e] leading-[1.75]">{text}</p>
//         </div>
//     );
// }

// function FaqRow({ q, a }: { q: string; a: string }) {
//     const [open, setOpen] = useState(false);
//     const panelId = `faq-${q.replace(/\W+/g, "-").toLowerCase()}`;
//     return (
//         <div className="bg-white rounded-xl border border-[#e4e9e5] overflow-hidden">
//             <h3>
//                 <button
//                     onClick={() => setOpen((v) => !v)}
//                     aria-expanded={open}
//                     aria-controls={panelId}
//                     className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2d7a5a] focus-visible:outline-offset-[-2px]"
//                 >
//                     <span className="text-[13.5px] font-medium text-[#1c2820]">{q}</span>
//                     <ChevronDown size={16} aria-hidden="true" className="text-[#4a5a52] flex-shrink-0 transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "none" }} />
//                 </button>
//             </h3>
//             {open && (
//                 <div id={panelId} className="px-5 pb-4">
//                     <p className="text-[13px] text-[#3a4a3e] leading-[1.7]">{a}</p>
//                 </div>
//             )}
//         </div>
//     );
// }

// function PricingCard({ stored, verifying, onSuccess, compact = false }: { stored: StoredResult; verifying: boolean; onSuccess: () => void; compact?: boolean }) {
//     return (
//         <div className={`bg-white rounded-[28px] border border-[#e4e9e5] shadow-[0_16px_60px_rgba(28,40,36,0.1)] overflow-hidden ${compact ? "" : "max-w-[440px] mx-auto text-center"}`}>
//             <div className="h-[3px] bg-gradient-to-r from-[#2d7a5a] via-[#1e6b6b] to-[#5da885]" />
//             <div className={compact ? "p-6 text-center" : "p-9"}>
//                 <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#2d7a5a] mb-2">Your full report</p>
//                 <p className={`font-['Cormorant_Garamond',Georgia,serif] font-light text-[#1c2820] leading-none mb-1 ${compact ? "text-[38px]" : "text-[52px]"}`}>
//                     ${PRIMARY_PLAN.amountUSD}
//                 </p>
//                 <p className="text-[13px] text-[#4a5a52] mb-4">One purchase. Instant access.</p>

//                 {/* Three short lines, not a long feature list, enough to
//                     justify the price without turning the card into a wall of
//                     checkmarks (the full 8-item list lives in the report
//                     preview section above, this is just a reminder). */}
//                 <ul className="text-left inline-flex flex-col gap-1.5 mb-5">
//                     {["Full domain breakdown", "Personalized strategies", "Doctor discussion guide"].map((f) => (
//                         <li key={f} className="flex items-center gap-2 text-[12.5px] text-[#3a4a3e]">
//                             <CheckCircle2 size={13} className="text-[#2d7a5a] flex-shrink-0" aria-hidden="true" /> {f}
//                         </li>
//                     ))}
//                 </ul>

//                 <FlutterwaveCheckout
//                     planKey={PRIMARY_PLAN.key}
//                     leadId={stored.leadId}
//                     amountUSD={PRIMARY_PLAN.amountUSD}
//                     label={PRIMARY_PLAN.label}
//                     customer={{ name: stored.name, email: stored.email, phone: stored.phone }}
//                     onSuccess={onSuccess}
//                 />
//                 {verifying && <p className="text-[12px] text-[#4a5a52] mt-3">Confirming your payment…</p>}

//                 <div className={`flex items-center gap-3 mt-5 flex-wrap ${compact ? "justify-center" : "justify-center gap-4"}`}>
//                     <span className="flex items-center gap-1.5 text-[11px] text-[#4a5a52]"><ShieldCheck size={12} aria-hidden="true" /> Money-back guarantee</span>
//                     <span className="flex items-center gap-1.5 text-[11px] text-[#4a5a52]"><FileText size={12} aria-hidden="true" /> Secure checkout</span>
//                 </div>
//             </div>
//         </div>
//     );
// }

// function UnlockedReport({ stored, txRef, compact = false }: { stored: StoredResult; txRef: string | null; compact?: boolean }) {
//     const downloadHref = `/api/adhd/report/pdf?tx_ref=${encodeURIComponent(txRef ?? "")}`;

//     return (
//         <div className={`bg-white rounded-[28px] border border-[#2d7a5a]/30 text-center shadow-[0_10px_50px_rgba(28,40,36,0.08)] ${compact ? "p-6" : "p-8 max-w-[560px] mx-auto"}`}>
//             <div className={`rounded-2xl bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] inline-flex items-center justify-center mb-5 ${compact ? "w-11 h-11" : "w-14 h-14"}`}>
//                 <CheckCircle2 size={compact ? 20 : 26} color="white" aria-hidden="true" />
//             </div>
//             <h2 className={`font-['Cormorant_Garamond',Georgia,serif] font-light text-[#1c2820] mb-2 ${compact ? "text-[19px]" : "text-[26px]"}`}>Your full report is ready</h2>
//             <p className="text-[13px] text-[#4a5a52] mb-5">
//                 We've sent it to {stored.email}. You can also download it directly below.
//             </p>
//             <a href={downloadHref} className="cta-btn inline-flex items-center gap-2 py-3 px-6 bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] text-white rounded-full text-[13.5px] font-medium no-underline">
//                 <FileText size={14} aria-hidden="true" /> Download your report
//             </a>
//         </div>
//     );
// }

// function PageShell({ children }: { children?: React.ReactNode }) {
//     return (
//         <div className="min-h-screen bg-[#faf9f6] font-['DM_Sans',sans-serif]">
//             <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:bg-white focus:text-[#1c2820] focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg">
//                 Skip to results
//             </a>
//             <nav className="fixed top-0 left-0 right-0 z-[100] bg-[rgba(250,249,246,0.92)] backdrop-blur-[18px] shadow-[0_1px_0_rgba(28,40,36,0.08)]">
//                 <div className="max-w-[1180px] mx-auto px-6 lg:px-10 h-[68px] flex items-center">
//                     <Link href="/" className="flex items-center gap-2.5 no-underline">
//                         <Image src="/logo-assessment.png" alt="Mentel logo" width={32} height={32} className="rounded-[10px] object-cover" />
//                         <span className="font-['Cormorant_Garamond',Georgia,serif] text-[22px] font-semibold tracking-[-0.02em] text-[#1c2820]">Mentel</span>
//                     </Link>
//                 </div>
//             </nav>
//             <div id="main-content" />
//             <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,450;9..40,500;9..40,600&display=swap');
//         *, *::before, *::after { box-sizing: border-box; }
//         body { font-family: 'DM Sans', -apple-system, sans-serif; background: #faf9f6; -webkit-font-smoothing: antialiased; }
//         @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
//         .fade-up { animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both; }
//         @keyframes fadeUpModal { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
//         .fade-up-modal { animation: fadeUpModal 0.35s cubic-bezier(0.22,1,0.36,1) both; }
//         .cta-btn { transition: all 0.25s cubic-bezier(0.22,1,0.36,1); }
//         .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(30,107,107,0.38) !important; }
//         .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
//         .focus\\:not-sr-only:focus { position: fixed; width: auto; height: auto; padding: inherit; margin: inherit; overflow: visible; clip: auto; white-space: normal; }
//         a:focus-visible, button:focus-visible { outline: 2px solid #2d7a5a; outline-offset: 2px; }
//       `}</style>
//             {children}
//         </div>
//     );
// }


// export default function AdhdResultPage() {
//     return (
//         <Suspense fallback={<PageShell />}>
//             <AdhdResultContent />
//         </Suspense>
//     );
// }



//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////


"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ShieldCheck, FileText, ArrowRight, ChevronDown, Sparkles, Lock, X as XIcon } from "lucide-react";
import { AssessmentResult, bandCopy, scoreAssessment, Answers } from "@/lib/adhd/scoring";
import { Domain } from "@/lib/adhd/questions";
import { domainInterpretations, strengthsPool, whatThisMeans, faqItems } from "@/lib/adhd/interpretations";
import { ADHD_PLANS } from "@/lib/payments/adhd-plans";
import FlutterwaveCheckout from "@/components/payments/FlutterwaveCheckout";
import RadarChart from "@/components/adhd/RadarChart";
import ReportPreviewMock from "@/components/adhd/ReportPreviewMock";
import { Testimonials } from "@/components/adhd/TrustAndProof";
import { testimonials } from "@/lib/adhd/social-proof-config";
import { CompletedPointer, loadCompletedPointer, persistCompletedPointer } from "../page";

interface StoredResult {
    name: string;
    email: string;
    phone: string;
    answers: Answers;
    result: AssessmentResult;
    leadId: string | null;
    completedAt: number;
}

// The single plan shown on this page, per the "one centered pricing
// section, not ecommerce cards" brief. The toolkit upsell tier still
// exists in lib/payments/adhd-plans.ts if you want to reintroduce it as a
// post-purchase upsell later, it's just not the primary offer here.
const PRIMARY_PLAN = ADHD_PLANS.report;

// Radar axes per the brief: Attention, Memory, Executive, Planning,
// Emotional Regulation, Hyperactivity.
const RADAR_DOMAINS: { domain: Domain; label: string }[] = [
    { domain: "attention", label: "Attention" },
    { domain: "working_memory", label: "Memory" },
    { domain: "executive_function", label: "Executive" },
    { domain: "organisation", label: "Planning" },
    { domain: "emotional_regulation", label: "Emotional\nRegulation" },
    { domain: "hyperactivity", label: "Hyperactivity" },
];

function AdhdResultContent() {
    const searchParams = useSearchParams();
    const txRef = searchParams.get("tx_ref");
    const leadIdParam = searchParams.get("leadId");
    const transactionId = searchParams.get("transaction_id");
    const paymentStatus = searchParams.get("status");
    const [stored, setStored] = useState<StoredResult | null>(null);
    const [recovering, setRecovering] = useState(!!txRef || !!leadIdParam);
    const [notFound, setNotFound] = useState(false);
    const [unlocked, setUnlocked] = useState(false);
    // Holds the tx_ref discovered via a leadId-only recovery (see below),
    // for when someone arrives at /adhd/result?leadId=... having already
    // paid on a previous visit, there's no tx_ref in *this* URL, but the
    // download link and the unlocked-report UI both need one. Everywhere
    // that needs "the tx_ref for this visit" should use effectiveTxRef,
    // not the raw txRef URL param, below.
    const [recoveredTxRef, setRecoveredTxRef] = useState<string | null>(null);
    const effectiveTxRef = txRef ?? recoveredTxRef;
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [verifying, setVerifying] = useState(!!txRef);
    // Show immediately rather than gating behind a scroll threshold: the
    // point of this bar is that pricing is visible without having to
    // scroll to find it, gating it behind scrollY defeated that.
    const [showMobileBar, setShowMobileBar] = useState(true);
    const [mobileBarDismissed, setMobileBarDismissed] = useState(false);
    const [successBarDismissed, setSuccessBarDismissed] = useState(false);

    useEffect(() => {
        // Primary path: the assessment flow wrote this to sessionStorage right
        // before redirecting here (see app/adhd/page.tsx). Fast, no network
        // round trip, works for the vast majority of visits.
        let foundInSession = false;
        try {
            const raw = window.sessionStorage.getItem("mentel_adhd_result");
            if (raw) {
                setStored(JSON.parse(raw));
                foundInSession = true;
            }
        } catch { /* sessionStorage unavailable, fall through to recovery below */ }

        if (foundInSession) {
            setRecovering(false);
            return;
        }

        // Recovery path: sessionStorage can legitimately be gone by the time
        // we land back here. Two different reasons someone might arrive
        // this way, both handled by the same server lookup:
        //   - tx_ref in the URL: some payment methods (3D Secure, bank
        //     transfer, USSD) route through a redirect that can involve a
        //     fresh tab or navigation context depending on the browser,
        //     which doesn't always preserve the original tab's
        //     sessionStorage.
        //   - leadId in the URL: someone who completed the free assessment,
        //     never paid, closed the tab, and came back later via the
        //     "welcome back, view results" banner on the intro page (see
        //     app/adhd/page.tsx's completedAvailable flow). sessionStorage
        //     from that original visit is long gone by design in this case,
        //     that's the whole point of that flow existing.
        const recoveryKey = txRef ? `txRef=${encodeURIComponent(txRef)}` : leadIdParam ? `leadId=${encodeURIComponent(leadIdParam)}` : null;
        if (!recoveryKey) {
            setRecovering(false);
            return;
        }
        fetch(`/api/adhd/lead?${recoveryKey}`)
            .then((r) => r.json())
            .then((data) => {
                if (!data?.success) { setNotFound(true); return; }
                const answers = data.answers as Answers;
                const result = scoreAssessment(answers);
                const recovered: StoredResult = {
                    name: data.name ?? "",
                    email: data.email ?? "",
                    phone: data.phone ?? "",
                    answers,
                    result,
                    leadId: data.leadId ?? null,
                    completedAt: Date.now(),
                };
                setStored(recovered);

                // The actual fix for "reload /adhd, still asks me to pay
                // even though I already did": previously this branch never
                // looked at payment status at all, unlocked only ever got
                // set by the separate verify effect below, which requires a
                // tx_ref in *this* URL. Arriving via leadId (e.g. from the
                // intro page's "welcome back" banner, which links to
                // /adhd/result?leadId=... with no tx_ref) meant unlocked
                // could never become true no matter what the database said.
                // Trusting `status` here directly (no second round-trip to
                // Flutterwave) is safe: this data came from our own
                // database, which only ever gets marked "paid" after a real
                // verified Flutterwave transaction, see
                // lib/payments/flutterwave-verify.ts.
                if (data.status === "paid" && data.txRef) {
                    setUnlocked(true);
                    setRecoveredTxRef(data.txRef);
                    setVerifying(false);
                }
                // Re-seed sessionStorage so the rest of this visit behaves
                // exactly like the normal (non-recovery) path.
                try { window.sessionStorage.setItem("mentel_adhd_result", JSON.stringify(recovered)); } catch { /* best effort */ }
            })
            .catch(() => setNotFound(true))
            .finally(() => setRecovering(false));
    }, [txRef]);

    useEffect(() => {
        if (!txRef) return;
        fetch(`/api/flutterwave/verify?tx_ref=${encodeURIComponent(txRef)}`)
            .then((r) => r.json())
            .then((data) => {
                const success = !!data?.success;
                setUnlocked(success);
                if (!success) return;


                // Payment has been genuinely verified by our server.
                // Update the existing completed pointer with the payment details.
                try {
                    const completed = loadCompletedPointer();

                    persistCompletedPointer({
                        ...(completed ?? {}),
                        txRef,
                        status: paymentStatus ?? "successful",
                        transactionId,
                        completedAt: Date.now(),
                    });
                } catch {
                    /* best effort */
                }

                // If this tx_ref matches one we flagged as "checkout in
                // progress" right before opening Flutterwave's modal (see
                // components/payments/FlutterwaveCheckout.tsx), this is a
                // genuine just-completed payment landing back here via
                // redirect, not someone revisiting an old paid link, show
                // the same success confirmation the in-page callback path
                // shows. Clear the flag either way so a later reload of
                // this same URL doesn't re-trigger it.
                try {
                    const pending = window.sessionStorage.getItem("mentel_adhd_pending_tx_ref");
                    if (pending && pending === txRef) {
                        setShowSuccessModal(true);
                        window.sessionStorage.removeItem("mentel_adhd_pending_tx_ref");
                    }
                } catch { /* best effort */ }
            })
            .finally(() => setVerifying(false));
    }, [txRef, paymentStatus, transactionId]);

    // Called from PricingCard the moment Flutterwave confirms payment.
    // Deliberately separate from the mount-time verify effect above: that
    // effect also sets `unlocked`, but for someone reloading a link to a
    // report they already paid for, which shouldn't re-trigger a "payment
    // successful!" celebration. This handler is only ever called right
    // after an actual just-completed checkout, which is exactly when the
    // person needs an unmissable confirmation, previously the only signal
    // was a small "Confirming your payment…" line inside the pricing card
    // itself, easy to miss if they'd scrolled away from it or the card was
    // off-screen (the sidebar on desktop, for instance).
    function handlePaymentSuccess() {
        setUnlocked(true);
        setShowSuccessModal(true);
    }

    if (recovering) {
        return (
            <PageShell>
                <div className="max-w-[400px] mx-auto text-center pt-32 px-6">
                    <div className="w-9 h-9 border-[2.5px] border-[#2d7a5a]/20 border-t-[#2d7a5a] rounded-full mx-auto animate-spin mb-5" />
                    <p className="text-[13.5px] text-[#4a5a52]">Loading your results…</p>
                </div>
            </PageShell>
        );
    }

    // Previously the only sign that a payment was being confirmed was a
    // small "Confirming your payment…" line inside the pricing card, easy
    // to miss (the card might be scrolled out of view), and the free
    // result content rendered normally underneath it regardless, which
    // could read as "did my payment even register?" Now, landing here with
    // a tx_ref shows a dedicated, unmissable verifying screen instead of
    // the page underneath, until we actually know whether it succeeded.
    if (txRef && verifying && !unlocked) {
        return (
            <PageShell>
                <div className="max-w-[400px] mx-auto text-center pt-32 px-6">
                    <div className="w-12 h-12 border-[3px] border-[#2d7a5a]/20 border-t-[#2d7a5a] rounded-full mx-auto animate-spin mb-6" />
                    <h1 className="font-['Cormorant_Garamond',Georgia,serif] text-[24px] font-light text-[#1c2820] mb-2">
                        Verifying your payment
                    </h1>
                    <p className="text-[13.5px] text-[#4a5a52]">This only takes a moment, please don't close this page.</p>
                </div>
            </PageShell>
        );
    }

    if (!stored || notFound) {
        return (
            <PageShell>
                <div className="max-w-[440px] mx-auto text-center pt-32 px-6">
                    <h1 className="font-['Cormorant_Garamond',Georgia,serif] text-[28px] font-light text-[#1c2820] mb-3">
                        We couldn't find a recent result
                    </h1>
                    <p className="text-[14px] text-[#4a5a52] mb-7">
                        Your session may have expired. Let's take the assessment again, it only takes a few minutes.
                    </p>
                    <Link href="/adhd" className="cta-btn inline-flex items-center gap-2 py-3.5 px-8 bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] text-white rounded-full text-[14px] font-medium no-underline">
                        Start the assessment <ArrowRight size={15} />
                    </Link>
                </div>
            </PageShell>
        );
    }

    const { result, name } = stored;
    const firstName = name ? name.split(" ")[0] : "there";
    const orderedDomains = [...result.domainResults].sort((a, b) => b.percent - a.percent);

    return (
        <PageShell>
            {/* Wide desktop container: content column + sticky sidebar, so the
                page spreads out on large screens instead of a narrow centered
                column with big empty margins either side. */}
            <div className="max-w-[1180px] mx-auto px-6 lg:px-10 pt-[104px] pb-20 lg:grid lg:grid-cols-[1fr_360px] lg:gap-12 lg:items-start">
                <main className="min-w-0">
                    {/* ── Header, kept to one brief line, the detail lives in the
                        domain breakdown further down for anyone who wants it ── */}
                    <section className="pb-2">
                        <div className="fade-up">
                            <div className="inline-flex items-center gap-1.5 bg-[#f2f7f3] text-[#2d7a5a] text-[11px] font-semibold tracking-[0.08em] uppercase px-3.5 py-1.5 rounded-full mb-5">
                                <CheckCircle2 size={12} aria-hidden="true" /> Assessment complete
                            </div>
                            <h1 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(28px,5.5vw,40px)] font-light text-[#1c2820] leading-[1.16] mb-3">
                                Here's what stood out, <span className="text-[#2d7a5a] font-bold">{firstName}</span>.
                            </h1>
                            <p className="text-[15px] text-[#3a4a3e] leading-[1.7] max-w-[560px]">
                                Your responses suggest a {bandCopy[result.overallBand].label.toLowerCase()} pattern, more in some areas
                                than others. This isn't a diagnosis, just a starting point for understanding it.
                            </p>
                        </div>
                    </section>

                    {/* Radar chart, bold and prominent, this is the visual
                        centerpiece of the free result, mobile/tablet only,
                        desktop shows the same chart in the sticky sidebar
                        instead so it's paired with the CTA while scrolling. */}
                    <section className="pt-6 pb-2 lg:hidden">
                        <div className="bg-white rounded-3xl border border-[#e4e9e5] p-7 shadow-[0_10px_50px_rgba(28,40,36,0.07)] flex flex-col items-center">
                            <RadarChart points={radarPoints(result)} size={260} />
                        </div>
                    </section>

                    {/* ── Strengths, only rendered if any domain actually
                        qualifies as minimal/mild, otherwise this would show
                        the heading with nothing underneath it ── */}
                    {result.strengths.length > 0 && (
                        <section className="py-6">
                            <div className="bg-gradient-to-br from-[#f2f7f3] to-white rounded-3xl border border-[#d5e5da] p-8 text-center">
                                <p className="text-[15px] text-[#3a4a3e] mb-5">Your responses also suggest strengths.</p>
                                <div className="flex flex-wrap justify-center gap-2.5">
                                    {result.strengths.map((s) => (
                                        <span key={s.domain} className="text-[13px] font-medium text-[#2d7a5a] bg-white border border-[#d5e5da] px-4 py-2 rounded-full">
                                            {strengthsPool[s.domain]}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* ── What this means, collapsible to keep the page scannable ── */}
                    <section className="py-4">
                        <WhatThisMeansSection />
                    </section>

                    {/* ── Real testimonials, only render if configured ────────────── */}
                    {testimonials.length > 0 && (
                        <section className="py-4">
                            <h2 className="text-[13px] font-semibold tracking-[0.06em] uppercase text-[#4a6a56] mb-4 text-center">
                                What others found
                            </h2>
                            <Testimonials items={testimonials} />
                        </section>
                    )}

                    {/* ── Domain-by-domain breakdown, now a single collapsed
                        toggle instead of 8 accordions taking up space near the
                        top. Detail is still all there for anyone who wants it,
                        it's just opt-in now instead of the default view. ── */}
                    <section className="py-4">
                        <DomainBreakdownToggle orderedDomains={orderedDomains} />
                    </section>

                    {unlocked ? (
                        <section id="pricing-anchor" className="py-8">
                            <UnlockedReport stored={stored} txRef={effectiveTxRef} />
                        </section>
                    ) : (
                        <>
                            {/* ── Report preview, blurred pages create curiosity ────── */}
                            <section className="py-8">
                                <div className="bg-white border border-[#e4e9e5] rounded-3xl p-8 lg:p-10 text-center">
                                    <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#2d7a5a] mb-3">Your complete report</p>
                                    <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(24px,4.5vw,30px)] font-light text-[#1c2820] mb-8">
                                        Unlock your complete personalized 18+ pages report
                                    </h2>
                                    <ReportPreviewMock name={firstName} result={result} />
                                    <div className="grid sm:grid-cols-2 gap-2.5 mt-9 text-left max-w-[440px] mx-auto">
                                        {[
                                            "18+ pages",
                                            "Detailed explanation of every domain",
                                            "Visual charts",
                                            "Practical strategies",
                                            "Professional discussion guide",
                                            "Lifestyle recommendations",
                                            "Personalized next steps",
                                            "Printable, instant download",
                                        ].map((f) => (
                                            <div key={f} className="flex items-center gap-2">
                                                <CheckCircle2 size={14} className="text-[#2d7a5a] flex-shrink-0" aria-hidden="true" />
                                                <span className="text-[13px] text-[#3a4a3e]">{f}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* Pricing, mobile/tablet inline, desktop shows it in the sticky sidebar instead */}
                            <section id="pricing-anchor" className="py-8 lg:hidden">
                                <PricingCard stored={stored} verifying={verifying} onSuccess={handlePaymentSuccess} />
                            </section>

                            {/* ── FAQ ─────────────────────────────────────────────────── */}
                            <section className="py-10 border-t border-[#e4e9e5]">
                                <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-[24px] font-light text-[#1c2820] mb-6">
                                    Common questions
                                </h2>
                                <div className="flex flex-col gap-2.5">
                                    {faqItems.map((f) => (
                                        <FaqRow key={f.q} q={f.q} a={f.a} />
                                    ))}
                                </div>
                            </section>

                            {/* ── Final CTA ──────────────────────────────────────────── */}
                            <section className="py-14 text-center">
                                <h2 className="font-['Cormorant_Garamond',Georgia,serif] text-[clamp(22px,4.5vw,28px)] font-light text-[#1c2820] mb-6 leading-[1.3]">
                                    Still wondering why focus feels difficult?
                                </h2>
                                <ScrollToPricingButton />
                            </section>
                        </>
                    )}
                </main>

                {/* ── Sticky sidebar, desktop only: radar chart + pricing always in view ── */}
                <aside className="hidden lg:block lg:sticky lg:top-[100px] lg:self-start">
                    <div className="bg-white rounded-3xl border border-[#e4e9e5] p-6 pb-5 shadow-[0_10px_50px_rgba(28,40,36,0.07)] flex flex-col items-center mb-5">
                        <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#4a6a56] mb-3 self-start">Your pattern at a glance</p>
                        <RadarChart points={radarPoints(result)} size={230} />
                    </div>
                    {unlocked ? (
                        <UnlockedReport stored={stored} txRef={effectiveTxRef} compact />
                    ) : (
                        <PricingCard stored={stored} verifying={verifying} onSuccess={handlePaymentSuccess} compact />
                    )}
                </aside>
            </div>

            {/* ── Mobile sticky bar: pricing prompt before payment, a
                persistent success confirmation after. Previously this bar
                just vanished entirely once `unlocked` became true, meaning
                a mobile visitor who dismissed or missed the success modal
                had zero on-screen confirmation their payment went through
                or that the report was emailed, without scrolling all the
                way down to the report card. Now it flips to a success
                state instead of disappearing. ── */}
            {!unlocked && showMobileBar && !mobileBarDismissed && (
                <div
                    className="lg:hidden fixed bottom-0 left-0 right-0 z-[90] bg-white border-t border-[#e4e9e5] shadow-[0_-8px_30px_rgba(28,40,36,0.1)] px-4 pt-3 flex items-center gap-3"
                    style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
                >
                    <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-semibold text-[#1c2820] leading-none mb-0.5">${PRIMARY_PLAN.amountUSD} Full Report</p>
                        <p className="text-[11px] text-[#4a5a52] truncate">Instant access, private and confidential</p>
                    </div>
                    <ScrollToPricingButton compact />
                    <button
                        onClick={() => setMobileBarDismissed(true)}
                        aria-label="Dismiss"
                        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-[#4a5a52] hover:bg-[#f5f5f2]"
                    >
                        <XIcon size={16} />
                    </button>
                </div>
            )}

            {unlocked && stored && !successBarDismissed && (
                <div
                    className="lg:hidden fixed bottom-0 left-0 right-0 z-[90] bg-[#0E5C3D] shadow-[0_-8px_30px_rgba(14,92,61,0.25)] px-4 pt-3 flex items-center gap-3"
                    style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
                >
                    <CheckCircle2 size={20} color="white" className="flex-shrink-0" aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-white leading-tight">Paid, sent to your email</p>
                        <p className="text-[10.5px] text-white/70 truncate">{stored.email}</p>
                    </div>
                    <a
                        href={`/api/adhd/report/pdf?tx_ref=${encodeURIComponent(effectiveTxRef ?? "")}`}
                        className="flex-shrink-0 inline-flex items-center gap-1.5 py-2 px-4 bg-white text-[#0E5C3D] rounded-full text-[12.5px] font-semibold no-underline"
                    >
                        <FileText size={13} aria-hidden="true" /> Download
                    </a>
                    <button
                        onClick={() => setSuccessBarDismissed(true)}
                        aria-label="Dismiss"
                        className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-white/70 hover:bg-white/10"
                    >
                        <XIcon size={15} />
                    </button>
                </div>
            )}

            {/* ── Payment success modal: fixed overlay, so it's visible the
                instant payment completes regardless of scroll position.
                Previously the only confirmation was a small "Confirming
                your payment…" line inside the pricing card itself, easy to
                miss entirely if that card was scrolled out of view (e.g.
                the sidebar on desktop, or the mobile inline card after
                they've scrolled past it). ── */}
            {showSuccessModal && stored && (
                <PaymentSuccessModal
                    email={stored.email}
                    txRef={effectiveTxRef}
                    onClose={() => setShowSuccessModal(false)}
                />
            )}
        </PageShell>
    );
}

function PaymentSuccessModal({ email, txRef, onClose }: { email: string; txRef: string | null; onClose: () => void }) {
    const downloadHref = `/api/adhd/report/pdf?tx_ref=${encodeURIComponent(txRef ?? "")}`;
    return (
        <div
            className="fixed inset-0 z-[200] bg-[#0E5C3D]/40 backdrop-blur-[2px] flex items-center justify-center p-5"
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-success-title"
        >
            <div className="relative bg-white rounded-[28px] max-w-[420px] w-full p-8 text-center shadow-[0_30px_90px_rgba(14,92,61,0.3)] fade-up-modal">
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#4a5a52] hover:bg-[#f5f5f2]"
                >
                    <XIcon size={16} />
                </button>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] inline-flex items-center justify-center mb-5">
                    <CheckCircle2 size={30} color="white" aria-hidden="true" />
                </div>
                <h2 id="payment-success-title" className="font-['Cormorant_Garamond',Georgia,serif] text-[26px] font-light text-[#1c2820] mb-2.5">
                    Payment successful
                </h2>
                <p className="text-[14px] text-[#3a4a3e] leading-[1.65] mb-1">
                    Your full report has been sent to
                </p>
                <p className="text-[14px] font-semibold text-[#1c2820] mb-6">{email}</p>
                <a
                    href={downloadHref}
                    className="cta-btn w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] text-white rounded-full text-[14px] font-medium no-underline mb-3"
                >
                    <FileText size={15} aria-hidden="true" /> Download your report now
                </a>
                <button
                    onClick={() => {
                        onClose();
                        // Give the modal a moment to unmount before scrolling,
                        // otherwise the scroll target's position is measured
                        // while the modal (and its scroll-lock-adjacent
                        // layout) is still in the DOM.
                        setTimeout(() => document.getElementById("pricing-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
                    }}
                    className="text-[13px] text-[#4a5a52] hover:text-[#1c2820] py-1"
                >
                    View my results page
                </button>
                <p className="text-[11px] text-[#4a5a52] mt-5 leading-[1.5]">
                    Didn't get the email? Check spam, or use the download button above, your report is also always
                    available from this page.
                </p>
            </div>
        </div>
    );
}

function radarPoints(result: AssessmentResult) {
    return RADAR_DOMAINS.map(({ domain, label }) => ({
        label,
        percent: result.domainResults.find((d) => d.domain === domain)?.percent ?? 0,
    }));
}

function ScrollToPricingButton({ compact = false }: { compact?: boolean }) {
    return (
        <a
            href="#pricing-anchor"
            onClick={(e) => { e.preventDefault(); document.getElementById("pricing-anchor")?.scrollIntoView({ behavior: "smooth", block: "center" }); }}
            className={
                compact
                    ? "cta-btn inline-flex items-center gap-1.5 py-2.5 px-5 bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] text-white rounded-full text-[13px] font-medium no-underline flex-shrink-0"
                    : "cta-btn inline-flex items-center gap-2 py-4 px-9 bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] text-white rounded-full text-[15px] font-medium no-underline shadow-[0_6px_26px_rgba(30,107,107,0.32)]"
            }
        >
            <Sparkles size={compact ? 13 : 15} aria-hidden="true" /> {compact ? "Unlock" : "Unlock My Full Report"}
        </a>
    );
}

// Wraps all 8 per-domain accordions behind one collapsed toggle. Previously
// these rendered directly under the header as 8 separate open/closed
// accordions, which made the page feel front-loaded with detail before
// anyone had a reason to care yet. Now it's an explicit, optional deep-dive:
// closed by default, one click reveals the same per-domain detail as before.
function DomainBreakdownToggle({ orderedDomains }: { orderedDomains: { domain: Domain; label: string; band: keyof typeof bandCopy; percent: number }[] }) {
    const [open, setOpen] = useState(false);
    const panelId = "domain-breakdown-panel";
    return (
        <div className="bg-white rounded-2xl border border-[#e4e9e5] overflow-hidden">
            <button
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls={panelId}
                className="w-full flex items-center justify-between gap-3 px-6 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2d7a5a] focus-visible:outline-offset-[-2px]"
            >
                <span>
                    <span className="block text-[14px] font-semibold text-[#1c2820]">View your full domain-by-domain breakdown</span>
                    <span className="block text-[12.5px] text-[#4a5a52] mt-0.5">All 8 areas, explained one at a time</span>
                </span>
                <ChevronDown size={18} aria-hidden="true" className="text-[#4a5a52] flex-shrink-0 transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "none" }} />
            </button>
            {open && (
                <div id={panelId} className="px-6 pb-6 flex flex-col gap-3">
                    {orderedDomains.map((d, i) => (
                        <DomainAccordion key={d.domain} domain={d.domain} label={d.label} band={d.band} defaultOpen={i === 0} />
                    ))}
                </div>
            )}
        </div>
    );
}

function DomainAccordion({ domain, label, band, defaultOpen }: { domain: Domain; label: string; band: keyof typeof bandCopy; defaultOpen: boolean }) {
    const [open, setOpen] = useState(defaultOpen);
    const panelId = `domain-panel-${domain}`;
    return (
        <div className="bg-white rounded-2xl border border-[#e4e9e5] overflow-hidden">
            <h3>
                <button
                    onClick={() => setOpen((v) => !v)}
                    aria-expanded={open}
                    aria-controls={panelId}
                    className="w-full flex items-center justify-between gap-3 px-6 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2d7a5a] focus-visible:outline-offset-[-2px]"
                >
                    <span className="text-[13px] font-semibold tracking-[0.03em] text-[#2d7a5a]">{label}</span>
                    <ChevronDown size={17} aria-hidden="true" className="text-[#4a5a52] flex-shrink-0 transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "none" }} />
                </button>
            </h3>
            {open && (
                <div id={panelId} role="region" className="px-6 pb-5">
                    <p className="text-[14px] text-[#3a4a3e] leading-[1.75]">{domainInterpretations[domain][band]}</p>
                </div>
            )}
        </div>
    );
}

function WhatThisMeansSection() {
    const [open, setOpen] = useState(false);
    const panelId = "what-this-means-panel";
    return (
        <div className="bg-white rounded-3xl border border-[#e4e9e5] overflow-hidden">
            <h2>
                <button
                    onClick={() => setOpen((v) => !v)}
                    aria-expanded={open}
                    aria-controls={panelId}
                    className="w-full flex items-center justify-between gap-3 px-7 py-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2d7a5a] focus-visible:outline-offset-[-2px]"
                >
                    <span className="font-['Cormorant_Garamond',Georgia,serif] text-[22px] font-light text-[#1c2820]">
                        What this means
                    </span>
                    <ChevronDown size={19} aria-hidden="true" className="text-[#4a5a52] flex-shrink-0 transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "none" }} />
                </button>
            </h2>
            {!open && (
                <p className="px-7 pb-6 -mt-3 text-[13.5px] text-[#4a5a52] leading-[1.7]">
                    What ADHD is, what this screening does not mean, and why symptoms like these can overlap with
                    stress, burnout, anxiety, or sleep. Tap to read the full explanation.
                </p>
            )}
            {open && (
                <div id={panelId} className="px-7 pb-7 flex flex-col gap-5">
                    <InfoBlock title="What ADHD is" text={whatThisMeans.whatItIs} />
                    <InfoBlock title="What this screening does not mean" text={whatThisMeans.whatItIsNot} />
                    <InfoBlock title="Why symptoms overlap" text={whatThisMeans.overlap} />
                    <div className="bg-[#0E5C3D] rounded-2xl p-6 text-center">
                        <p className="text-[14px] text-white leading-[1.75]">{whatThisMeans.encouragement}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

function InfoBlock({ title, text }: { title: string; text: string }) {
    return (
        <div className="bg-[#faf9f6] rounded-2xl border border-[#e4e9e5] p-6">
            <p className="text-[13.5px] font-semibold text-[#1c2820] mb-2">{title}</p>
            <p className="text-[13.5px] text-[#3a4a3e] leading-[1.75]">{text}</p>
        </div>
    );
}

function FaqRow({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    const panelId = `faq-${q.replace(/\W+/g, "-").toLowerCase()}`;
    return (
        <div className="bg-white rounded-xl border border-[#e4e9e5] overflow-hidden">
            <h3>
                <button
                    onClick={() => setOpen((v) => !v)}
                    aria-expanded={open}
                    aria-controls={panelId}
                    className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2d7a5a] focus-visible:outline-offset-[-2px]"
                >
                    <span className="text-[13.5px] font-medium text-[#1c2820]">{q}</span>
                    <ChevronDown size={16} aria-hidden="true" className="text-[#4a5a52] flex-shrink-0 transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "none" }} />
                </button>
            </h3>
            {open && (
                <div id={panelId} className="px-5 pb-4">
                    <p className="text-[13px] text-[#3a4a3e] leading-[1.7]">{a}</p>
                </div>
            )}
        </div>
    );
}

function PricingCard({ stored, verifying, onSuccess, compact = false }: { stored: StoredResult; verifying: boolean; onSuccess: () => void; compact?: boolean }) {
    return (
        <div className={`bg-white rounded-[28px] border border-[#e4e9e5] shadow-[0_16px_60px_rgba(28,40,36,0.1)] overflow-hidden ${compact ? "" : "max-w-[440px] mx-auto text-center"}`}>
            <div className="h-[3px] bg-gradient-to-r from-[#2d7a5a] via-[#1e6b6b] to-[#5da885]" />
            <div className={compact ? "p-6 text-center" : "p-9"}>
                <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#2d7a5a] mb-2">Full Report</p>
                <p className={`font-['Cormorant_Garamond',Georgia,serif] font-light text-[#1c2820] leading-none mb-1 ${compact ? "text-[38px]" : "text-[52px]"}`}>
                    ${PRIMARY_PLAN.amountUSD}
                </p>
                <p className="text-[13px] text-[#4a5a52] mb-4">One purchase. Instant access.</p>

                {/* Three short lines, not a long feature list, enough to
                    justify the price without turning the card into a wall of
                    checkmarks (the full 8-item list lives in the report
                    preview section above, this is just a reminder). */}
                <ul className="text-left inline-flex flex-col gap-1.5 mb-5">
                    {["Full domain breakdown", "Personalized strategies", "Doctor discussion guide"].map((f) => (
                        <li key={f} className="flex items-center gap-2 text-[12.5px] text-[#3a4a3e]">
                            <CheckCircle2 size={13} className="text-[#2d7a5a] flex-shrink-0" aria-hidden="true" /> {f}
                        </li>
                    ))}
                </ul>

                <FlutterwaveCheckout
                    planKey={PRIMARY_PLAN.key}
                    leadId={stored.leadId}
                    amountUSD={PRIMARY_PLAN.amountUSD}
                    label={PRIMARY_PLAN.label}
                    customer={{ name: stored.name, email: stored.email, phone: stored.phone }}
                    onSuccess={onSuccess}
                />
                {verifying && <p className="text-[12px] text-[#4a5a52] mt-3">Confirming your payment…</p>}

                <div className={`flex items-center gap-3 mt-5 flex-wrap ${compact ? "justify-center" : "justify-center gap-4"}`}>
                    <span className="flex items-center gap-1.5 text-[11px] text-[#4a5a52]"><Lock size={12} aria-hidden="true" /> Private &amp; confidential</span>
                    <span className="flex items-center gap-1.5 text-[11px] text-[#4a5a52]"><FileText size={12} aria-hidden="true" /> Secure checkout</span>
                </div>
            </div>
        </div>
    );
}

function UnlockedReport({ stored, txRef, compact = false }: { stored: StoredResult; txRef: string | null; compact?: boolean }) {
    const downloadHref = `/api/adhd/report/pdf?tx_ref=${encodeURIComponent(txRef ?? "")}`;

    return (
        <div className={`bg-white rounded-[28px] border border-[#2d7a5a]/30 text-center shadow-[0_10px_50px_rgba(28,40,36,0.08)] ${compact ? "p-6" : "p-8 max-w-[560px] mx-auto"}`}>
            <div className={`rounded-2xl bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] inline-flex items-center justify-center mb-5 ${compact ? "w-11 h-11" : "w-14 h-14"}`}>
                <CheckCircle2 size={compact ? 20 : 26} color="white" aria-hidden="true" />
            </div>
            <h2 className={`font-['Cormorant_Garamond',Georgia,serif] font-light text-[#1c2820] mb-2 ${compact ? "text-[19px]" : "text-[26px]"}`}>Your full report is ready</h2>
            <p className="text-[13px] text-[#4a5a52] mb-5">
                We've sent it to {stored.email}. You can also download it directly below.
            </p>
            <a href={downloadHref} className="cta-btn inline-flex items-center gap-2 py-3 px-6 bg-gradient-to-br from-[#2d7a5a] to-[#1e6b6b] text-white rounded-full text-[13.5px] font-medium no-underline">
                <FileText size={14} aria-hidden="true" /> Download your report
            </a>
        </div>
    );
}

function PageShell({ children }: { children?: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#faf9f6] font-['DM_Sans',sans-serif]">
            <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:bg-white focus:text-[#1c2820] focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg">
                Skip to results
            </a>
            <nav className="fixed top-0 left-0 right-0 z-[100] bg-[rgba(250,249,246,0.92)] backdrop-blur-[18px] shadow-[0_1px_0_rgba(28,40,36,0.08)]">
                <div className="max-w-[1180px] mx-auto px-6 lg:px-10 h-[68px] flex items-center">
                    <Link href="/" className="flex items-center gap-2.5 no-underline">
                        <Image src="/logo-assessment.png" alt="Mentel logo" width={32} height={32} className="rounded-[10px] object-cover" />
                        <span className="font-['Cormorant_Garamond',Georgia,serif] text-[22px] font-semibold tracking-[-0.02em] text-[#1c2820]">Mentel</span>
                    </Link>
                </div>
            </nav>
            <div id="main-content" />
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,450;9..40,500;9..40,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { font-family: 'DM Sans', -apple-system, sans-serif; background: #faf9f6; -webkit-font-smoothing: antialiased; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes fadeUpModal { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .fade-up-modal { animation: fadeUpModal 0.35s cubic-bezier(0.22,1,0.36,1) both; }
        .cta-btn { transition: all 0.25s cubic-bezier(0.22,1,0.36,1); }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(30,107,107,0.38) !important; }
        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
        .focus\\:not-sr-only:focus { position: fixed; width: auto; height: auto; padding: inherit; margin: inherit; overflow: visible; clip: auto; white-space: normal; }
        a:focus-visible, button:focus-visible { outline: 2px solid #2d7a5a; outline-offset: 2px; }
      `}</style>
            {children}
        </div>
    );
}
export default function AdhdResultPage() {
    return (
        <Suspense fallback={<PageShell />}>
            <AdhdResultContent />
        </Suspense>
    );
}