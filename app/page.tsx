// /**
//  * Mentel — Homepage (full rewrite)
//  *
//  * Changes from audit:
//  * - Hero copy rewritten: Nigeria-anchored, professional-focused, warm
//  * - H1 contains local keyword signal ("Nigeria" / "Lagos")
//  * - Two-funnel split above fold: Individuals | Teams
//  * - WhatsApp CTA added (header strip + footer)
//  * - Crisis/safety bar added (ethical requirement)
//  * - EAP section upgraded: outcome stat, pricing signal, inline demo-request form
//  * - BottomCTA fixed: uses openBooking() context instead of broken #book scroll
//  * - SEO: metadata export added, FAQ schema stays, headings contain local keywords
//  * - UX: promo countdown persists in sessionStorage to avoid trust-destroying resets
//  */

// import BgBlobs from "@/components/BgBlobs";
// import HeroPanel from "@/components/HeroPanel";
// import BottomCTA from "@/components/BottomCTA";
// import WhatsAppCTA from "@/components/WhatsAppCTA";        // NEW
// import EAPSection from "@/components/EAPSection";           // NEW (full rewrite)
// import CrisisBar from "@/components/CrisisBar";             // NEW
// import TwoFunnelStrip from "@/components/TwoFunnelStrip";   // NEW
// import Link from "next/link";
// import type { Metadata } from "next";
// import {
//   Leaf, ArrowRight,
//   Brain, Heart, Anchor, ClipboardCheck,
//   Flame, Sun, Users, Sparkles, Quote, ChevronDown, Star, Clock, Shield,
// } from "lucide-react";

// /* ─── SEO metadata ─────────────────────────────────────────── */
// export const metadata: Metadata = {
//   title: "Mentel - Online Therapy & Mental Health Support in Nigeria",
//   description:
//     "Book a licensed therapist in Nigeria from ₦8,500. Confidential online therapy for anxiety, burnout, depression & more. NDPR-compliant. Lagos, Abuja, Port Harcourt.",
//   keywords: [
//     "online therapy Nigeria",
//     "mental health therapist Lagos",
//     "anxiety counseling Nigeria",
//     "employee mental health Nigeria",
//     "burnout support Lagos",
//     "online counseling Nigeria",
//   ],
//   openGraph: {
//     title: "Mentel - Online Therapy in Nigeria",
//     description:
//       "Connect with a licensed therapist in Nigeria. Confidential, affordable, evidence-based care from ₦8,500.",
//     url: "https://www.trymentel.com",
//     siteName: "Mentel",
//     locale: "en_NG",
//     type: "website",
//   },
//   alternates: { canonical: "https://www.trymentel.com" },
// };

// /* ─── Page-level data ───────────────────────────────────────── */
// const services = [
//   {
//     icon: Brain,
//     title: "Anxiety & Stress",
//     desc: "Learn practical, evidence-based tools to manage racing thoughts, worry, and the physical toll of chronic stress.",
//     tags: ["CBT", "Mindfulness", "Breathing Techniques"],
//   },
//   {
//     icon: Heart,
//     title: "Depression",
//     desc: "Work through low mood, lack of motivation, and persistent sadness with a therapist who truly understands.",
//     tags: ["Behavioural Activation", "Talk Therapy"],
//   },
//   {
//     icon: Users,
//     title: "Marriage & Couples",
//     desc: "Strengthen communication, rebuild trust, and navigate conflict with skilled relationship therapy.",
//     tags: ["Gottman Method", "EFT", "Conflict Resolution"],
//   },
//   {
//     icon: Anchor,
//     title: "Trauma & PTSD",
//     desc: "Heal from past experiences in a safe, trauma-informed space using approaches proven to work.",
//     tags: ["EMDR", "Somatic Therapy", "Narrative Therapy"],
//   },
//   {
//     icon: Flame,
//     title: "Burnout & Life Transitions",
//     desc: "Reclaim your energy, identity, and direction when life feels overwhelming or in flux.",
//     tags: ["Life Coaching", "Values Work", "Goal Setting"],
//   },
//   {
//     icon: Sun,
//     title: "Self-Esteem & Growth",
//     desc: "Build a healthier relationship with yourself, challenge inner criticism, and grow into your full potential.",
//     tags: ["Schema Therapy", "ACT", "Compassion Work"],
//   },
//   {
//     icon: ClipboardCheck,
//     title: "Free Assessment",
//     desc: "Not sure where to start? Take our free 2-minute mental health check and get matched to the right therapist.",
//     tags: [] as string[],
//     isCTA: true,
//   },
// ];

// const stats = [
//   { stat: "4.9★", label: "Average client rating", icon: Star },
//   { stat: "35+", label: "Licensed therapists", icon: Users },
//   { stat: "24hrs", label: "Average first response", icon: Clock },
// ];

// const testimonials = [
//   {
//     quote:
//       "I was skeptical about online therapy but Mentel made it feel completely safe and personal. My therapist genuinely listens and I've seen real changes in just 6 weeks.",
//     name: "Adaeze O.",
//     location: "Lagos",
//     stars: 5,
//   },
//   {
//     quote:
//       "After struggling with anxiety for years, I finally feel like I have real tools to manage it. Booking was so easy and the price made it accessible for me.",
//     name: "Emeka T.",
//     location: "Abuja",
//     stars: 5,
//   },
//   {
//     quote:
//       "My husband and I tried couples therapy through Mentel and it genuinely saved our marriage. The therapist was warm, professional and non-judgmental.",
//     name: "Funmi & Seun A.",
//     location: "Port Harcourt",
//     stars: 5,
//   },
// ];

// const faqs = [
//   {
//     q: "Is online therapy as effective as in-person?",
//     a: "Yes, research consistently shows online therapy produces outcomes equivalent to in-person sessions for most conditions including anxiety, depression, and relationship issues. Many clients find the privacy and convenience of online therapy actually helps them open up more.",
//   },
//   {
//     q: "How does the ₦8,500 single session work?",
//     a: "You book and pay online, then your matched therapist contacts you within 24 hours to schedule your 50-minute session via secure video call. It's a one-time charge with no commitment required.",
//   },
//   {
//     q: "Are your therapists licensed and qualified?",
//     a: "Every therapist on Mentel holds a recognised professional licence and has been individually vetted by our clinical team. You can see their qualifications and specialisations before your session.",
//   },
//   {
//     q: "Is everything I share kept confidential?",
//     a: "Absolutely. Your sessions are protected by professional confidentiality and our platform is fully NDPR-compliant. We never share your information with third parties.",
//   },
//   {
//     q: "What if I'm not happy with my therapist?",
//     a: "We offer a free rematch if you don't feel the fit is right after your first session. Getting the right match matters more to us than a quick booking.",
//   },
// ];

// /* ─── Structured data ───────────────────────────────────────── */
// const faqSchema = {
//   "@context": "https://schema.org",
//   "@type": "FAQPage",
//   mainEntity: [
//     ...faqs.map((f) => ({
//       "@type": "Question",
//       name: f.q,
//       acceptedAnswer: { "@type": "Answer", text: f.a },
//     })),
//     {
//       "@type": "Question",
//       name: "What is Mentel?",
//       acceptedAnswer: {
//         "@type": "Answer",
//         text: "Mentel is a Nigerian online therapy platform that connects people with licensed, vetted therapists via secure video call. Sessions start from ₦8,500. Mentel provides evidence-based care for anxiety, depression, burnout, trauma, couples issues, and more.",
//       },
//     },
//     {
//       "@type": "Question",
//       name: "Is online therapy available in Nigeria?",
//       acceptedAnswer: {
//         "@type": "Answer",
//         text: "Yes. Mentel provides online therapy across Nigeria, including Lagos, Abuja, Port Harcourt, and all other states.",
//       },
//     },
//     {
//       "@type": "Question",
//       name: "How do I book a therapy session in Nigeria?",
//       acceptedAnswer: {
//         "@type": "Answer",
//         text: "Visit trymentel.com, complete the intake form, and receive a therapist match within 24 hours. You can also take a free 2-minute mental health assessment before booking.",
//       },
//     },
//     // {
//     //   "@type": "Question",
//     //   name: "What types of therapy does Mentel offer?",
//     //   acceptedAnswer: {
//     //     "@type": "Answer",
//     //     text: "Mentel offers individual therapy, couples therapy, trauma therapy (including EMDR), anxiety treatment (CBT), depression support, and burnout recovery. Therapists are matched to your specific needs.",
//     //   },
//     // },
//     {
//       "@type": "Question",
//       name: "Can I get a free mental health assessment?",
//       acceptedAnswer: {
//         "@type": "Answer",
//         text: "Yes. Mentel offers a free 2-minute mental health check-in at trymentel.com/assessment. It is confidential and gives you a clear picture of what kind of support might help.",
//       },
//     },
//   ],
// };

// const localBusinessSchema = {
//   "@context": "https://schema.org",
//   "@type": "MedicalBusiness",
//   name: "Mentel",
//   url: "https://www.trymentel.com",
//   description:
//     "Online therapy and mental health support for individuals and teams in Nigeria.",
//   address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" },
//   areaServed: "Nigeria",
//   medicalSpecialty: "Psychiatry",
//   priceRange: "₦₦",
// };

// /* ─── Component ─────────────────────────────────────────────── */
// export default function HomePage() {
//   return (
//     <>
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
//       />
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
//       />

//       {/* Skip to content (WCAG AA) */}
//       {/* <a href="#main-content" className="skip-to-content">
//         Skip to main content
//       </a> */}

//       {/* ── Crisis / Safety Bar ── */}
//       {/* <CrisisBar /> */}

//       <div className="relative overflow-x-hidden">
//         <BgBlobs />

//         <main id="main-content">

//           {/* ── Hero ── */}
//           <section className="relative z-10 pt-16 sm:pt-20 pb-12 sm:pb-16">
//             <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//               <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-14 lg:items-start">

//                 {/* LEFT copy */}
//                 <div className="lg:order-1 animate-fade-up pt-4 w-full">
//                   <div
//                     className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-5 border"
//                     style={{
//                       background: "rgba(123,169,139,0.12)",
//                       borderColor: "rgba(123,169,139,0.3)",
//                       color: "var(--sage-dark)",
//                     }}
//                   >
//                     <span
//                       className="w-1.5 h-1.5 rounded-full animate-pulse-dot flex-shrink-0"
//                       style={{ background: "var(--sage)" }}
//                     />
//                     <span>Certified &bull; Confidential &bull; Nigeria-based</span>
//                   </div>

//                   {/*
//                                      * H1 — rewritten:
//                                      * Old: "You don't have to carry this alone."
//                                      * New: anchors Nigeria + professional context while keeping warmth.
//                                      * Local keyword ("Nigeria") appears naturally in sub-copy.
//                                      */}
//                   <h2
//                     className="font-cormorant text-4xl sm:text-5xl lg:text-6xl font-light leading-tight mb-5"
//                     style={{ color: "var(--deep)", letterSpacing: "-0.02em" }}
//                   >
//                     Real support for<br />
//                     real life in{" "}
//                     <em className="italic" style={{ color: "var(--sage-dark)" }}>Nigeria</em>.
//                   </h2>

//                   <p
//                     className="sm:text-base leading-relaxed mb-6 font-light"
//                     style={{ color: "var(--text-muted)", maxWidth: "420px" }}
//                   >
//                     Whether you&apos;re burning out at work, carrying anxiety alone, or watching
//                     a relationship fray, Mentel connects you with a licensed therapist who
//                     genuinely listens. Culturally grounded, evidence-based care, from ₦8,500.
//                   </p>

//                   {/* Two-funnel micro-strip */}
//                   <TwoFunnelStrip />

//                   {/* Trust signals */}
//                   <div className="flex flex-col gap-3 mt-6">
//                     {[
//                       { icon: Shield, text: "NDPR-compliant & fully confidential" },
//                       { icon: Star, text: "Licensed, empathetic professionals" },
//                       { icon: Clock, text: "First session response within 24 hours" },
//                     ].map(({ icon: Icon, text }) => (
//                       <div key={text} className="flex items-center gap-3">
//                         <div
//                           className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
//                           style={{ background: "linear-gradient(135deg, #4e7a5e, #3d8b8b)" }}
//                         >
//                           <Icon size={16} color="white" />
//                         </div>
//                         <span className="text-sm" style={{ color: "var(--text-muted)" }}>{text}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* RIGHT panel */}
//                 <div className="lg:order-2 animate-fade-up-delay w-full mt-10 lg:mt-0">
//                   <div
//                     className="rounded-2xl px-5 py-4 mb-4 flex items-center gap-4 border"
//                     style={{
//                       background: "rgba(255,255,255,0.7)",
//                       borderColor: "var(--border)",
//                       backdropFilter: "blur(8px)",
//                     }}
//                   >
//                     <div className="flex -space-x-2 flex-shrink-0">
//                       {[
//                         { initials: "AO", bg: "linear-gradient(135deg,#7ba98b,#4e7a5e)" },
//                         { initials: "KI", bg: "linear-gradient(135deg,#3d8b8b,#2a6666)" },
//                         { initials: "FN", bg: "linear-gradient(135deg,#a8c4b0,#7ba98b)" },
//                         { initials: "EB", bg: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" },
//                       ].map(({ initials, bg }) => (
//                         <div
//                           key={initials}
//                           className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-white border-2 flex-shrink-0"
//                           style={{ background: bg, borderColor: "white" }}
//                           aria-hidden="true"
//                         >
//                           {initials}
//                         </div>
//                       ))}
//                     </div>
//                     <div>
//                       <div className="flex items-center gap-1 mb-0.5">
//                         {[1, 2, 3, 4, 5].map((i) => (
//                           <Star key={i} size={11} fill="var(--sage)" style={{ color: "var(--sage)" }} />
//                         ))}
//                         <span className="text-xs font-medium ml-1" style={{ color: "var(--deep)" }}>4.9</span>
//                       </div>
//                       <p className="text-xs" style={{ color: "var(--text-muted)" }}>
//                         35+ licensed therapists ready to help you
//                       </p>
//                     </div>
//                   </div>
//                   <HeroPanel />
//                 </div>
//               </div>
//             </div>
//           </section>

// {/* ── Stats Strip ── */}
// <section className="relative z-10" aria-label="Platform statistics">
//   <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//     <div className="h-px w-full" style={{ background: "var(--border)" }} />
//     <div
//       className="grid grid-cols-1 sm:grid-cols-3"
//       style={{ background: "linear-gradient(135deg, rgba(61,139,139,0.06) 0%, rgba(123,169,139,0.09) 100%)" }}
//     >
//       {stats.map(({ stat, label, icon: Icon }, i) => (
//         <div
//           key={label}
//           className="flex flex-col items-center justify-center py-6 sm:py-8 px-4 text-center relative"
//         >
//           {i < stats.length - 1 && (
//             <div className="hidden sm:block absolute right-0 top-1/4 h-1/2 w-px" style={{ background: "var(--border)" }} />
//           )}
//           {i < stats.length - 1 && (
//             <div className="sm:hidden absolute bottom-0 left-8 right-8 h-px" style={{ background: "var(--border)" }} />
//           )}
//           <div
//             className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
//             style={{ background: "linear-gradient(135deg, #4e7a5e, #3d8b8b)" }}
//           >
//             <Icon size={20} color="white" />
//           </div>
//           <p
//             className="font-cormorant font-semibold leading-none mb-1.5"
//             style={{ color: "var(--deep)", fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)", letterSpacing: "-0.02em" }}
//           >
//             {stat}
//           </p>
//           <p className="text-xs uppercase tracking-widest leading-snug" style={{ color: "var(--text-muted)" }}>
//             {label}
//           </p>
//         </div>
//       ))}
//     </div>
//     <div className="h-px w-full" style={{ background: "var(--border)" }} />
//   </div>
// </section>

//           {/* ── Assessment Banner ── */}
//           <section className="relative z-10 py-6 sm:py-8 px-4 sm:px-6 lg:px-8" aria-label="Free assessment">
//             <div className="max-w-6xl mx-auto">
//               <Link
//                 href="/assessment"
//                 className="group block rounded-2xl sm:rounded-3xl p-7 sm:p-10 relative overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-xl duration-300"
//                 style={{
//                   background: "linear-gradient(135deg, rgba(61,139,139,0.08) 0%, rgba(123,169,139,0.12) 100%)",
//                   borderColor: "rgba(123,169,139,0.35)",
//                 }}
//               >
//                 <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg, var(--sage), var(--teal), var(--sage-light))" }} />
//                 <div className="absolute right-0 top-0 bottom-0 w-48 sm:w-72 pointer-events-none opacity-10" style={{ background: "radial-gradient(ellipse at right center, var(--teal) 0%, transparent 70%)" }} />
//                 <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-10">
//                   <div
//                     className="rounded-2xl flex items-center justify-center flex-shrink-0"
//                     style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))", width: "52px", height: "52px" }}
//                   >
//                     <Sparkles size={24} color="white" />
//                   </div>
//                   <div className="flex-1">
//                     <div
//                       className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-widest mb-2 border"
//                       style={{ background: "rgba(123,169,139,0.14)", borderColor: "rgba(123,169,139,0.3)", color: "var(--sage-dark)" }}
//                     >
//                       <Leaf size={10} />
//                       Free · 2 Minutes · Confidential
//                     </div>
//                     <h2 className="font-cormorant text-2xl sm:text-3xl font-light mb-1" style={{ color: "var(--deep)" }}>
//                       Not sure where to start?{" "}
//                       <em className="italic" style={{ color: "var(--sage-dark)" }}>Take the free assessment.</em>
//                     </h2>
//                     <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)", maxWidth: "520px" }}>
//                       Answer 8 simple questions and get a personalised mental health snapshot, matched to the right support for you.
//                     </p>
//                   </div>
//                   <div
//                     className="inline-flex items-center gap-2 text-sm font-medium text-white px-6 py-3 rounded-full flex-shrink-0"
//                     style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
//                   >
//                     Start Free Check
//                     <ArrowRight size={15} className="transition-transform group-hover:translate-x-1 duration-200" />
//                   </div>
//                 </div>
//               </Link>
//             </div>
//           </section>

//           {/* ── Services Preview ── */}
//           <section
//             className="relative z-10 py-12 sm:py-16 border-t"
//             style={{ borderColor: "var(--border)" }}
//             aria-labelledby="services-heading"
//           >
//             <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//               <div className="text-center mb-8 sm:mb-12">
//                 <div
//                   className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4 border"
//                   style={{ background: "rgba(123,169,139,0.10)", borderColor: "rgba(123,169,139,0.25)", color: "var(--sage-dark)" }}
//                 >
//                   <Leaf size={11} />
//                   What We Offer
//                 </div>
//                 {/* H2 now contains local SEO keyword */}
//                 <h2 id="services-heading" className="font-cormorant text-3xl sm:text-4xl font-light mb-3" style={{ color: "var(--deep)" }}>
//                   Therapy Services in Nigeria
//                 </h2>
//                 <p className="text-sm sm:text-base max-w-xs sm:max-w-sm mx-auto" style={{ color: "var(--text-muted)" }}>
//                   Professional, licensed therapy tailored to your specific needs, available online across Nigeria.
//                 </p>
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//                 {services.map(({ icon: Icon, title, desc, tags, isCTA }) =>
//                   isCTA ? (
//                     <Link
//                       key={title}
//                       href="/assessment"
//                       className="sm:col-span-2 lg:col-span-3 rounded-2xl p-6 sm:p-8 border transition-all hover:-translate-y-1 hover:shadow-md duration-200 flex flex-col sm:flex-row sm:items-center gap-5 group"
//                       style={{
//                         background: "linear-gradient(135deg, rgba(123,169,139,0.10), rgba(61,139,139,0.08))",
//                         borderColor: "rgba(123,169,139,0.35)",
//                       }}
//                     >
//                       <div
//                         className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
//                         style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
//                       >
//                         <Icon size={20} color="white" />
//                       </div>
//                       <div className="flex-1">
//                         <h3 className="font-cormorant text-xl font-semibold mb-1" style={{ color: "var(--deep)" }}>{title}</h3>
//                         <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{desc}</p>
//                       </div>
//                       <div
//                         className="inline-flex items-center gap-2 text-sm font-medium text-white px-5 py-2.5 rounded-full flex-shrink-0"
//                         style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
//                       >
//                         Start Free
//                         <ArrowRight size={14} className="transition-transform group-hover:translate-x-1 duration-200" />
//                       </div>
//                     </Link>
//                   ) : (
//                     <div
//                       key={title}
//                       className="rounded-2xl p-5 sm:p-6 border transition-all hover:-translate-y-1 hover:shadow-md duration-200 flex flex-col"
//                       style={{ background: "white", borderColor: "var(--border)" }}
//                     >
//                       <div
//                         className="w-9 h-9 rounded-full flex items-center justify-center mb-4"
//                         style={{ background: "linear-gradient(135deg, #4e7a5e, #3d8b8b)" }}
//                       >
//                         <Icon size={18} color="white" />
//                       </div>
//                       <h3 className="font-cormorant text-xl font-semibold mb-2" style={{ color: "var(--deep)" }}>{title}</h3>
//                       <p className="text-sm sm:text-base leading-relaxed mb-4 flex-1" style={{ color: "var(--text-muted)" }}>{desc}</p>
//                       {tags && tags.length > 0 && (
//                         <div className="flex flex-wrap gap-1.5">
//                           {tags.map((tag) => (
//                             <span
//                               key={tag}
//                               className="text-xs px-2 py-0.5 rounded-full border"
//                               style={{
//                                 borderColor: "rgba(123,169,139,0.3)",
//                                 color: "var(--sage-dark)",
//                                 background: "rgba(123,169,139,0.07)",
//                               }}
//                             >
//                               {tag}
//                             </span>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   )
//                 )}
//               </div>
//               <div className="text-center mt-8">
//                 <Link
//                   href="/services"
//                   className="inline-flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-full border transition-all hover:shadow-sm hover:-translate-y-0.5 duration-200"
//                   style={{ borderColor: "var(--border)", color: "var(--sage-dark)" }}
//                 >
//                   View All Services
//                   <ArrowRight size={14} />
//                 </Link>
//               </div>
//             </div>
//           </section>

//           {/* ── EAP / For Employers ── (full rewrite — see EAPSection.tsx) */}
//           <EAPSection />

//           {/* ── WhatsApp CTA strip ── */}
//           <WhatsAppCTA />

//           {/* ── Testimonials ── */}
//           <section
//             className="relative z-10 py-12 sm:py-16 border-t"
//             style={{ borderColor: "var(--border)" }}
//             aria-labelledby="testimonials-heading"
//           >
//             <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//               <div className="text-center mb-8 sm:mb-12">
//                 <div
//                   className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4 border"
//                   style={{ background: "rgba(123,169,139,0.10)", borderColor: "rgba(123,169,139,0.25)", color: "var(--sage-dark)" }}
//                 >
//                   <Star size={11} />
//                   Client Stories
//                 </div>
//                 <h2 id="testimonials-heading" className="font-cormorant text-3xl sm:text-4xl font-light mb-3" style={{ color: "var(--deep)" }}>
//                   Real people, real{" "}
//                   <em className="italic" style={{ color: "var(--sage-dark)" }}>progress</em>
//                 </h2>
//                 <div className="flex items-center justify-center gap-2 mt-2">
//                   <div className="flex gap-0.5">
//                     {[1, 2, 3, 4, 5].map((i) => (
//                       <Star key={i} size={14} fill="var(--sage)" style={{ color: "var(--sage)" }} />
//                     ))}
//                   </div>
//                   <span className="text-sm font-medium" style={{ color: "var(--deep)" }}>4.9</span>
//                   <span className="text-sm" style={{ color: "var(--text-muted)" }}>from 140+ client reviews</span>
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
//                 {testimonials.map((t) => (
//                   <div key={t.name} className="rounded-2xl p-6 border flex flex-col" style={{ background: "white", borderColor: "var(--border)" }}>
//                     <div className="mb-3">
//                       <Quote size={20} style={{ color: "var(--sage-light)" }} aria-hidden="true" />
//                     </div>
//                     <div className="flex gap-0.5 mb-3" aria-label={`${t.stars} out of 5 stars`}>
//                       {Array.from({ length: t.stars }).map((_, i) => (
//                         <Star key={i} size={12} fill="var(--sage)" style={{ color: "var(--sage)" }} aria-hidden="true" />
//                       ))}
//                     </div>
//                     <p className="text-sm leading-relaxed mb-5 font-light flex-1" style={{ color: "var(--text)" }}>
//                       &ldquo;{t.quote}&rdquo;
//                     </p>
//                     <div className="flex items-center gap-2 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
//                       <div
//                         className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
//                         style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
//                         aria-hidden="true"
//                       >
//                         {t.name.charAt(0)}
//                       </div>
//                       <div>
//                         <p className="text-xs font-medium" style={{ color: "var(--deep)" }}>{t.name}</p>
//                         <p className="text-xs" style={{ color: "var(--text-muted)" }}>{t.location}</p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </section>

//           {/* ── FAQ ── */}
//           <section
//             className="relative z-10 py-12 sm:py-16 border-t"
//             style={{ borderColor: "var(--border)" }}
//             aria-labelledby="faq-heading"
//           >
//             <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
//               <div className="text-center mb-8 sm:mb-12">
//                 <div
//                   className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4 border"
//                   style={{ background: "rgba(123,169,139,0.10)", borderColor: "rgba(123,169,139,0.25)", color: "var(--sage-dark)" }}
//                 >
//                   <Leaf size={11} />
//                   Common Questions
//                 </div>
//                 <h2 id="faq-heading" className="font-cormorant text-3xl sm:text-4xl font-light" style={{ color: "var(--deep)" }}>
//                   Questions & Answers
//                 </h2>
//               </div>
//               <div className="space-y-3">
//                 {faqs.map((faq, i) => (
//                   <details
//                     key={i}
//                     className="group rounded-2xl border overflow-hidden"
//                     style={{ borderColor: "var(--border)", background: "white" }}
//                   >
//                     <summary
//                       className="flex items-center justify-between px-5 py-4 cursor-pointer list-none select-none"
//                       style={{ color: "var(--deep)" }}
//                     >
//                       <span className="text-sm font-medium pr-4">{faq.q}</span>
//                       <ChevronDown
//                         size={16}
//                         className="flex-shrink-0 transition-transform duration-200 group-open:rotate-180"
//                         style={{ color: "var(--sage-dark)" }}
//                         aria-hidden="true"
//                       />
//                     </summary>
//                     <div className="px-5 pb-5">
//                       <p className="text-sm leading-relaxed font-light" style={{ color: "var(--text-muted)" }}>{faq.a}</p>
//                     </div>
//                   </details>
//                 ))}
//               </div>
//             </div>
//           </section>

//           {/* ── Bottom CTA ── */}
//           <BottomCTA />

//         </main>
//       </div>
//     </>
//   );
// }

/**
 * Mentel — Homepage (full rewrite)
 *
 * Changes from audit:
 * - Hero copy rewritten: Nigeria-anchored, professional-focused, warm
 * - H1 contains local keyword signal ("Nigeria" / "Lagos")
 * - Two-funnel split above fold: Individuals | Teams
 * - WhatsApp CTA added (header strip + footer)
 * - Crisis/safety bar added (ethical requirement)
 * - EAP section upgraded: outcome stat, pricing signal, inline demo-request form
 * - BottomCTA fixed: uses openBooking() context instead of broken #book scroll
 * - SEO: metadata export added, FAQ schema stays, headings contain local keywords
 * - UX: promo countdown persists in sessionStorage to avoid trust-destroying resets
 * - NEW: "How It Works" image section with generous mobile spacing
 */

import BgBlobs from "@/components/BgBlobs";
import HeroPanel from "@/components/HeroPanel";
import BottomCTA from "@/components/BottomCTA";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import EAPSection from "@/components/EAPSection";
import CrisisBar from "@/components/CrisisBar";
import TwoFunnelStrip from "@/components/TwoFunnelStrip";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Leaf, ArrowRight,
  Brain, Heart, Anchor, ClipboardCheck,
  Flame, Sun, Users, Sparkles, Quote, ChevronDown, Star, Clock, Shield,
  CheckCircle2, Calendar, Lock
} from "lucide-react";

/* ─── SEO metadata ─────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Mentel | Online Professional Therapy & Mental Health Support",
  description:
    "Get matched with a licensed therapist who genuinely listen. Confidential, evidence-based online therapy for anxiety, depression, relationships, trauma, burnout, and personal growth.",
  keywords: [
    "online therapy Nigeria",
    "mental health therapist Lagos",
    "anxiety counseling Nigeria",
    "employee mental health Nigeria",
    "burnout support Lagos",
    "online counseling Nigeria",
    "How much does therapy cost",
    "cheap therapy services Nigeria",
    "affordable marriage counseling",
    "marriage counseling Nigeria",
    "how to overcome depression",
    "how to manage stress",
    "therapy for trauma Nigeria",
    "PTSD therapy online",
    "EMDR therapy Nigeria",
    "cognitive behavioral therapy Nigeria",
    "mindfulness therapy Nigeria",
    "self-esteem therapy Nigeria",
    "mental health support Nigeria",
    "online therapy for couples Nigeria",
    "relationship counseling Nigeria",
    "anxiety symptoms",
    "how to overcome anxiety",
  ],
  openGraph: {
    title: "Mentel | Online Professional Therapy & Mental Health Support",
    description:
      "Get matched with a licensed therapist who genuinely listen. Confidential, evidence-based online therapy for anxiety, depression, trauma, burnout, relationships, and personal growth.",
    url: "https://www.trymentel.com",
    siteName: "Mentel",
    locale: "en_NG",
    type: "website",
  },
  alternates: { canonical: "https://www.trymentel.com" },
};

/* ─── Page-level data ───────────────────────────────────────── */
// const services = [
//   {
//     icon: Brain,
//     title: "Anxiety & Stress",
//     desc: "Learn practical, evidence-based tools to manage racing thoughts, worry, and the physical toll of chronic stress.",
//     tags: ["CBT", "Mindfulness", "Breathing Techniques"],
//   },
//   {
//     icon: Heart,
//     title: "Depression",
//     desc: "Work through low mood, lack of motivation, and persistent sadness with a therapist who truly understands.",
//     tags: ["Behavioural Activation", "Talk Therapy"],
//   },
//   {
//     icon: Users,
//     title: "Marriage & Couples",
//     desc: "Strengthen communication, rebuild trust, and navigate conflict with skilled relationship therapy.",
//     tags: ["Gottman Method", "EFT", "Conflict Resolution"],
//   },
//   {
//     icon: Anchor,
//     title: "Trauma & PTSD",
//     desc: "Heal from past experiences in a safe, trauma-informed space using approaches proven to work.",
//     tags: ["EMDR", "Somatic Therapy", "Narrative Therapy"],
//   },
//   {
//     icon: Flame,
//     title: "Burnout & Life Transitions",
//     desc: "Reclaim your energy, identity, and direction when life feels overwhelming or in flux.",
//     tags: ["Life Coaching", "Values Work", "Goal Setting"],
//   },
//   {
//     icon: Sun,
//     title: "Self-Esteem & Growth",
//     desc: "Build a healthier relationship with yourself, challenge inner criticism, and grow into your full potential.",
//     tags: ["Schema Therapy", "ACT", "Compassion Work"],
//   },
//   {
//     icon: ClipboardCheck,
//     title: "Free Assessment",
//     desc: "Not sure where to start? Take our free 2-minute mental health check and get matched to the right therapist.",
//     tags: [] as string[],
//     isCTA: true,
//   },
// ];

const services = [
  {
    icon: Brain,
    title: "Anxiety & Stress",
    desc: "Learn practical, evidence-based tools to manage racing thoughts, worry, and the physical toll of chronic stress.",
    tags: ["CBT", "Mindfulness", "Breathing Techniques"],
    color: { bg: "rgba(109,143,214,0.10)", icon: "#5a7fd1" },
  },
  {
    icon: Heart,
    title: "Depression",
    desc: "Work through low mood, lack of motivation, and persistent sadness with a therapist who truly understands.",
    tags: ["Behavioural Activation", "Talk Therapy"],
    color: { bg: "rgba(214,139,158,0.10)", icon: "#c4748b" },
  },
  {
    icon: Users,
    title: "Marriage & Couples",
    desc: "Strengthen communication, rebuild trust, and navigate conflict with skilled relationship therapy.",
    tags: ["Gottman Method", "EFT", "Conflict Resolution"],
    color: { bg: "rgba(224,164,88,0.10)", icon: "#c4914a" },
  },
  {
    icon: Anchor,
    title: "Trauma & PTSD",
    desc: "Heal from past experiences in a safe, trauma-informed space using approaches proven to work.",
    tags: ["EMDR", "Somatic Therapy", "Narrative Therapy"],
    color: { bg: "rgba(123,148,168,0.10)", icon: "#647d92" },
  },
  {
    icon: Flame,
    title: "Burnout & Life Transitions",
    desc: "Reclaim your energy, identity, and direction when life feels overwhelming or in flux.",
    tags: ["Life Coaching", "Values Work", "Goal Setting"],
    color: { bg: "rgba(212,130,90,0.10)", icon: "#c66f47" },
  },
  {
    icon: Sun,
    title: "Self-Esteem & Growth",
    desc: "Build a healthier relationship with yourself, challenge inner criticism, and grow into your full potential.",
    tags: ["Schema Therapy", "ACT", "Compassion Work"],
    color: { bg: "rgba(123,169,139,0.10)", icon: "var(--sage-dark)" },
  },
  {
    icon: ClipboardCheck,
    title: "Free Assessment",
    desc: "Not sure where to start? Take our free 2-minute mental health check and get matched to the right therapist.",
    tags: [] as string[],
    isCTA: true,
    color: { bg: "", icon: "" },
  },
];



const stats = [
  { stat: "4.9★", label: "Average client rating", icon: Star },
  { stat: "35+", label: "Licensed therapists", icon: Users },
  { stat: "24hrs", label: "Average first response", icon: Clock },
];

// const testimonials = [
//   {
//     quote:
//       "I was skeptical about online therapy but Mentel made it feel completely safe and personal. My therapist genuinely listens and I've seen real changes in just 6 weeks.",
//     name: "Adaeze O.",
//     location: "Lagos",
//     stars: 5,
//   },
//   {
//     quote:
//       "After struggling with anxiety for years, I finally feel like I have real tools to manage it. Booking was so easy and the price made it accessible for me.",
//     name: "Emeka T.",
//     location: "Abuja",
//     stars: 5,
//   },
//   {
//     quote:
//       "My husband and I tried couples therapy through Mentel and it genuinely saved our marriage. The therapist was warm, professional and non-judgmental.",
//     name: "Funmi & Seun A.",
//     location: "Port Harcourt",
//     stars: 5,
//   },
// ];

const featuredTestimonial = {
  quote:
    "I'd put off therapy for years because I didn't think I had the time or money. Mentel made it easy to find someone who actually understood what I was going through, and for the first time, I feel like I'm moving forward instead of just surviving.",
  name: "Adaeze O.",
  location: "Lagos",
  topic: "Anxiety & Stress",
  stars: 5,
  image: "/adaeze.jpg",
};

const testimonials = [
  {
    quote:
      "Booking was simple and my therapist was great. It took a few sessions before I felt comfortable opening up, but it's been worth it overall.",
    name: "Emeka T.",
    location: "Abuja",
    topic: "Burnout",
    stars: 4,
    image: "/emeka.jpg",
  },
  {
    quote:
      "My husband and I tried couples therapy through Mentel and it genuinely helped us communicate better. The therapist was warm and non-judgmental.",
    name: "Funmi & Seun A.",
    location: "Port Harcourt",
    topic: "Couples",
    stars: 5,
    image: "/funmi-seun.jpg",
  },
  {
    quote:
      "Good experience overall. The platform is easy to use and my therapist was knowledgeable, though I had to switch once before finding the right fit.",
    name: "Chidinma E.",
    location: "Texas, USA",
    // location: "Enugu",
    topic: "Depression",
    stars: 4,
    image: "/chidinma.jpg",
  },
  {
    quote:
      "Therapy helped me put words to feelings I'd carried for years. Some sessions were harder than others, but my therapist made the process feel manageable.",
    name: "Tunde A.",
    location: "Ibadan",
    topic: "Trauma",
    stars: 5,
    image: "/tunde.jpg",
  },
  {
    quote:
      "It's helped me, especially with managing stress at work. Scheduling can be a bit tricky around my hours, but the sessions have been valuable.",
    name: "Ngozi P.",
    location: "Benin City",
    topic: "Self-Esteem",
    stars: 4,
    image: "/ngozi.jpg",
  },
  {
    quote:
      "Decent first experience. My therapist was kind, though I think it'll take more sessions before I see real change. Still glad I started.",
    name: "Bola K.",
    location: "Lagos",
    topic: "Anxiety",
    stars: 3,
    image: "/bola.jpg",
  },
];

const faqs = [
  {
    // q: "What is Mentel?",
    q: "Is online therapy as effective as in-person?",
    a: "Yes, research consistently shows online therapy produces outcomes equivalent to in-person sessions for most conditions including anxiety, depression, and relationship issues. Many clients find the privacy and convenience of online therapy actually helps them open up more.",
    // a: "Mentel is a Nigerian online therapy platform that connects people with licensed, vetted therapists via secure video call. Sessions start from ₦8,500. Mentel provides evidence-based care for anxiety, depression, burnout, trauma, couples issues, and more.",
  },
  {
    // q: "Is online therapy available in Nigeria?",
    q: "How does the session work?",
    // a: "Yes. Mentel provides online therapy across Nigeria, including Lagos, Abuja, Port Harcourt, and all other states.",
    a: "You book and pay online, then your matched therapist contacts you within 24 hours to schedule your 50-minute session via secure video call. It's a one-time charge with no commitment required.",
  },
  {
    q: "Are your therapists licensed and qualified?",
    a: "Every therapist on Mentel holds a recognised professional licence and has been individually vetted by our clinical team. You can see their qualifications and specialisations before your session.",
  },
  {
    q: "Is everything I share kept confidential?",
    a: "Absolutely. Your sessions are protected by professional confidentiality and our platform is fully NDPR-compliant. We never share your information with third parties.",
  },
  {
    q: "What if I'm not happy with my therapist?",
    a: "We offer a free rematch if you don't feel the fit is right after your first session. Getting the right match matters more to us than a quick booking.",
  },
];

/* ─── How It Works steps ────────────────────────────────────── */
const howItWorksSteps = [
  {
    number: "01",
    title: "Take the free assessment",
    desc: "Answer 8 simple questions in under 2 minutes. No signup needed.",
  },
  {
    number: "02",
    title: "Get matched to a therapist",
    desc: "We surface the right licensed professional for your needs within 24 hours.",
  },
  {
    number: "03",
    title: "Book your first session",
    desc: "Choose a time that works for you. Secure video call from anywhere.",
    // desc: "Choose a time that works for you. Secure video call from anywhere in Nigeria.",
  },
];


const trustBadges = [
  { name: "A", gradient: "linear-gradient(135deg, #3d8b8b, #6fb8b8)" }, // teal
  { name: "E", gradient: "linear-gradient(135deg, #a97b3d, #d4b87b)" }, // warm gold
  { name: "F", gradient: "linear-gradient(135deg, #4e7a5e, #7ba98b)" }, // sage
  { name: "K", gradient: "linear-gradient(135deg, #5a6fa8, #8fa4d6)" }, // calm blue
  { name: "T", gradient: "linear-gradient(135deg, #8b5e7a, #c08fa4)" }, // soft plum
];
/* ─── Structured data ───────────────────────────────────────── */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    ...faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
    {
      "@type": "Question",
      name: "What is Mentel?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Mentel is a Nigerian online therapy platform that connects people with licensed, vetted therapists via secure video call. Sessions start from ₦8,500. Mentel provides evidence-based care for anxiety, depression, burnout, trauma, couples issues, and more.",
      },
    },
    {
      "@type": "Question",
      name: "Is online therapy available in Nigeria?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Mentel provides online therapy across Nigeria, including Lagos, Abuja, Port Harcourt, and all other states.",
      },
    },
    {
      "@type": "Question",
      name: "How do I book a therapy session in Nigeria?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Visit trymentel.com, complete the intake form, and receive a therapist match within 24 hours. You can also take a free 2-minute mental health assessment before booking.",
      },
    },
    {
      "@type": "Question",
      name: "Can I get a free mental health assessment?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Mentel offers a free 2-minute mental health check-in at trymentel.com/assessment. It is confidential and gives you a clear picture of what kind of support might help.",
      },
    },
  ],
};

// const faqSchema = {
//   "@context": "https://schema.org",
//   "@type": "FAQPage",
//   mainEntity: faqs.map((f) => ({
//     "@type": "Question",
//     name: f.q,
//     acceptedAnswer: {
//       "@type": "Answer",
//       text: f.a,
//     },
//   })),
// };

// const localBusinessSchema = {
//   "@context": "https://schema.org",
//   "@type": "MedicalBusiness",
//   name: "Mentel",
//   url: "https://www.trymentel.com",
//   description:
//     "Online therapy and mental health support for individuals and teams in Nigeria.",
//   address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" },
//   areaServed: "Nigeria",
//   medicalSpecialty: "Psychiatry",
//   priceRange: "₦₦",
// };

/* ─── Component ─────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      /> */}

      <div className="relative overflow-x-hidden">
        {/* <BgBlobs /> */}

        <main id="main-content">
          {/* ── Hero ── */}
          <section className="relative z-10 pt-20 pb-12 sm:pt-24 sm:pb-24">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">

              {/* Eyebrow */}
              <div className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border mb-6 sm:mb-8 max-w-full"
                style={{ background: "rgba(45,122,90,0.08)", borderColor: "rgba(45,122,90,0.2)" }}>
                <span className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse"
                  style={{ background: "#2d7a5a" }} />
                <span className="font-semibold uppercase tracking-widest text-center"
                  style={{ color: "#2d7a5a", fontSize: "clamp(9px, 2.6vw, 12px)", letterSpacing: "0.12em" }}>
                  Certified · Confidential · NDPR-Compliant
                </span>
              </div>

              {/* H1  */}
              <h1 className="font-cormorant font-light mb-4 sm:mb-5 w-full px-1"
                style={{
                  fontSize: "clamp(36px, 11vw, 80px)", lineHeight: 1.08,
                  letterSpacing: "-0.02em", color: "#1c2820"
                }}>
                Online therapy,{" "}
                <em className="italic" style={{ color: "#2d7a5a" }}>built for real life</em>.
              </h1>

              {/* Subhead */}
              {/* <p className="font-light mx-auto mb-8 sm:mb-9 w-full px-2"
                style={{
                  fontSize: "clamp(14px, 3.5vw, 18px)", lineHeight: 1.75,
                  color: "var(--text-muted)", maxWidth: 680
                }}>
                Whether it&apos;s anxiety, burnout, relationship strain, or a heaviness
                you can&apos;t name, Mentel connects you with a{" "}
                <strong className="font-medium" style={{ color: "#1c2820" }}>
                  licensed Nigerian therapist
                </strong>{" "}
                who genuinely listens. Culturally grounded care from{" "}
                <strong className="font-medium" style={{ color: "#1c2820" }}>₦8,500</strong>.
                No waitlists.
              </p> */}
              <p
                className="font-light mx-auto mb-8 sm:mb-9 w-full px-2"
                style={{
                  fontSize: "clamp(14px, 3.5vw, 18px)",
                  lineHeight: 1.75,
                  color: "var(--text-muted)",
                  maxWidth: 680
                }}
              >
                Connect with a{" "}
                <strong className="font-medium" style={{ color: "#1c2820" }}>
                  licensed therapist
                </strong>{" "}
                online for anxiety, burnout, relationship challenges, and more. Private,
                personalized support designed around your needs.
              </p>

              {/* CTAs */}
              <div className="flex flex-col items-center gap-3 mb-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto px-4 sm:px-0">
                  <Link
                    href="/book"
                    className="inline-flex items-center justify-center gap-2 text-white font-medium rounded-full transition-all hover:-translate-y-0.5 hover:shadow-xl duration-200 w-full sm:w-auto"
                    style={{
                      background: "linear-gradient(135deg, #2d7a5a, #1e6b6b)",
                      padding: "16px 28px",
                      fontSize: 15,
                      boxShadow: "0 6px 24px rgba(30,107,107,0.28)"
                    }}
                  >
                    <Calendar size={16} />
                    Book a session
                    <ArrowRight size={15} style={{ opacity: 0.65 }} />
                  </Link>
                  <Link href="/assessment"
                    className="inline-flex items-center justify-center gap-2 font-light rounded-full border transition-all hover:-translate-y-0.5 duration-200 w-full sm:w-auto"
                    style={{
                      padding: "15px 28px", fontSize: 15, color: "#2d7a5a",
                      borderColor: "rgba(45,122,90,0.28)", background: "white"
                    }}>
                    Free mental health check
                  </Link>
                </div>
                {/* <p className="text-xs font-light text-center px-4" style={{ color: "var(--text-muted)" }}>
                  Sessions from ₦8,500 · No commitment · Response within 24 hrs
                </p> */}
                <p className="text-xs font-light text-center px-4" style={{ color: "var(--text-muted)" }}>
                  Licensed therapists · Private and secure · No long-term commitment
                </p>
              </div>

              {/* Divider */}
              <div className="h-px mx-auto my-8 sm:my-9" style={{ background: "rgba(28,40,36,0.08)", maxWidth: 320 }} />

              {/* Trust row */}
              <div className="flex flex-col sm:flex-row w-full rounded-2xl border overflow-hidden mb-8 sm:mb-9 divide-y sm:divide-y-0 sm:divide-x"
                style={{ background: "white", borderColor: "rgba(28,40,36,0.09)" }}>
                {[
                  { icon: Lock, label: "Fully confidential", desc: "NDPR-compliant. Never shared." },
                  { icon: Users, label: "35+ licensed therapists", desc: "Individually vetted." },
                  { icon: Clock, label: "24 hr response", desc: "Book today, matched tomorrow." },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label}
                    className="flex-1 flex flex-row sm:flex-col items-center sm:items-center text-left sm:text-center px-4 sm:px-3 py-4 sm:py-5 gap-3 sm:gap-2"
                    style={{ borderColor: "rgba(28,40,36,0.08)" }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(45,122,90,0.09)", border: "1px solid rgba(45,122,90,0.18)" }}>
                      <Icon size={16} stroke="#2d7a5a" strokeWidth={1.8} />
                    </div>
                    <div className="flex flex-col sm:items-center">
                      <p className="text-xs font-medium leading-tight" style={{ color: "#1c2820" }}>{label}</p>
                      <p className="text-xs font-light" style={{ color: "var(--text-muted)" }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social proof pill */}
              <div className="flex items-center justify-center gap-3 mb-7 pb-6 border-b" style={{ borderColor: "rgba(123,169,139,0.15)" }}>
                <div className="flex -space-x-2">
                  {trustBadges.map((badge) => (
                    <div
                      key={badge.name}
                      className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-semibold text-white"
                      style={{
                        background: badge.gradient,
                        borderColor: "white",
                      }}
                    >
                      {badge.name}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5 mb-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={11} fill="#c7a86b" style={{ color: "#c7a86b", opacity: 0.9 }} />
                      // <Star key={i} size={11} fill="var(--sage)" style={{ color: "var(--sage)" }} />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Trusted by 500+ clients across globally</p>
                </div>
              </div>
            </div>

          </section>
          {/* ── Stats Strip ── */}
          <section className="relative z-10" aria-label="Platform statistics">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="h-px w-full" style={{ background: "var(--border)" }} />
              <div
                className="grid grid-cols-1 sm:grid-cols-3"
                style={{ background: "linear-gradient(135deg, rgba(61,139,139,0.06) 0%, rgba(123,169,139,0.09) 100%)" }}
              >
                {stats.map(({ stat, label, icon: Icon }, i) => (
                  <div
                    key={label}
                    className="flex flex-col items-center justify-center py-6 sm:py-8 px-4 text-center relative"
                  >
                    {i < stats.length - 1 && (
                      <div className="hidden sm:block absolute right-0 top-1/4 h-1/2 w-px" style={{ background: "var(--border)" }} />
                    )}
                    {i < stats.length - 1 && (
                      <div className="sm:hidden absolute bottom-0 left-8 right-8 h-px" style={{ background: "var(--border)" }} />
                    )}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                      style={{ background: "linear-gradient(135deg, #4e7a5e, #3d8b8b)" }}
                    >
                      <Icon size={20} color="white" />
                    </div>
                    <p
                      className="font-cormorant font-semibold leading-none mb-1.5"
                      style={{ color: "var(--deep)", fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)", letterSpacing: "-0.02em" }}
                    >
                      {stat}
                    </p>
                    <p className="text-xs uppercase tracking-widest leading-snug" style={{ color: "var(--text-muted)" }}>
                      {label}
                    </p>
                  </div>
                ))}
              </div>
              <div className="h-px w-full" style={{ background: "var(--border)" }} />
            </div>
          </section>

          {/* ── How It Works (Image Section) ── */}
          <section
            className="relative z-10 py-16 sm:py-24 border-t"
            style={{ borderColor: "var(--border)" }}
            aria-labelledby="how-it-works-heading"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">

                {/* ── Image column ── */}
                <div className="relative w-full mb-12 lg:mb-0 order-1">
                  {/* Decorative blurred blob behind image */}
                  <div
                    className="absolute -inset-4 rounded-3xl pointer-events-none"
                    style={{
                      background: "radial-gradient(ellipse at 60% 40%, rgba(123,169,139,0.18) 0%, transparent 70%)",
                      filter: "blur(24px)",
                    }}
                    aria-hidden="true"
                  />

                  {/* Main image */}
                  <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg">
                    <Image
                      src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=900&q=80&auto=format&fit=crop"
                      alt="Licensed therapist providing confidential online therapy"
                      width={900}
                      height={640}
                      className="w-full object-cover"
                      style={{ aspectRatio: "4/3", display: "block" }}
                      priority={false}
                    />
                    {/* Subtle overlay to warm up photo */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: "linear-gradient(180deg, transparent 55%, rgba(30,60,45,0.22) 100%)" }}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Floating trust badge — bottom-left of image */}
                  <div
                    className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex items-center gap-3 rounded-xl px-4 py-3 border shadow-md"
                    style={{
                      background: "rgba(255,255,255,0.92)",
                      borderColor: "rgba(123,169,139,0.3)",
                      backdropFilter: "blur(8px)",
                      maxWidth: "calc(100% - 2rem)",
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #4e7a5e, #3d8b8b)" }}
                    >
                      <CheckCircle2 size={18} color="white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: "var(--deep)" }}>
                        All therapists vetted & licensed
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        Reviewed by our clinical team
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── Copy column ── */}
                <div className="order-2">
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-5 border"
                    style={{
                      background: "rgba(123,169,139,0.10)",
                      borderColor: "rgba(123,169,139,0.25)",
                      color: "var(--sage-dark)",
                    }}
                  >
                    <Leaf size={11} />
                    Simple Process
                  </div>

                  <h2
                    id="how-it-works-heading"
                    className="font-cormorant text-3xl sm:text-4xl lg:text-5xl font-light leading-tight mb-4"
                    style={{ color: "var(--deep)", letterSpacing: "-0.02em" }}
                  >
                    Getting support<br />
                    has never been{" "}
                    <em className="italic" style={{ color: "var(--sage-dark)" }}>this simple</em>.
                  </h2>

                  <p
                    className="text-sm sm:text-base leading-relaxed mb-10 font-light"
                    style={{ color: "var(--text-muted)", maxWidth: "400px" }}
                  >
                    Three steps from curiosity to your first session. No waiting rooms,
                    no commute, no stigma, just real care that fits your life.
                  </p>

                  {/* Steps */}
                  <ol className="space-y-8" aria-label="How it works steps">
                    {howItWorksSteps.map(({ number, title, desc }, i) => (
                      <li key={number} className="flex items-start gap-5">
                        {/* Step number + connector line */}
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div
                            className="w-11 h-11 rounded-full flex items-center justify-center font-cormorant font-semibold text-lg flex-shrink-0"
                            style={{
                              background: "linear-gradient(135deg, rgba(78,122,94,0.12), rgba(61,139,139,0.12))",
                              border: "1.5px solid rgba(123,169,139,0.4)",
                              color: "var(--sage-dark)",
                            }}
                          >
                            {number}
                          </div>
                          {i < howItWorksSteps.length - 1 && (
                            <div
                              className="w-px flex-1 mt-2"
                              style={{
                                height: "2rem",
                                background: "linear-gradient(to bottom, rgba(123,169,139,0.35), transparent)",
                              }}
                              aria-hidden="true"
                            />
                          )}
                        </div>
                        <div className="pt-1.5">
                          <p className="text-sm font-semibold mb-1" style={{ color: "var(--deep)" }}>{title}</p>
                          <p className="text-sm leading-relaxed font-light" style={{ color: "var(--text-muted)" }}>{desc}</p>
                        </div>
                      </li>
                    ))}
                  </ol>

                  <div className="mt-10">
                    <Link
                      href="/assessment"
                      className="inline-flex items-center gap-2 text-sm font-medium text-white px-7 py-3.5 rounded-full transition-all hover:shadow-lg hover:-translate-y-0.5 duration-200"
                      style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                    >
                      Start Free Assessment
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* ── Assessment Banner ── */}
          <section className="relative z-10 py-6 sm:py-8 px-4 sm:px-6 lg:px-8" aria-label="Free assessment">
            <div className="max-w-6xl mx-auto">
              <Link
                href="/assessment"
                className="group block rounded-2xl sm:rounded-3xl p-7 sm:p-10 relative overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-xl duration-300"
                style={{
                  background: "linear-gradient(135deg, rgba(61,139,139,0.08) 0%, rgba(123,169,139,0.12) 100%)",
                  borderColor: "rgba(123,169,139,0.35)",
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg, var(--sage), var(--teal), var(--sage-light))" }} />
                <div className="absolute right-0 top-0 bottom-0 w-48 sm:w-72 pointer-events-none opacity-10" style={{ background: "radial-gradient(ellipse at right center, var(--teal) 0%, transparent 70%)" }} />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-10">
                  <div
                    className="rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))", width: "52px", height: "52px" }}
                  >
                    <Sparkles size={24} color="white" />
                  </div>
                  <div className="flex-1">
                    <div
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-widest mb-2 border"
                      style={{ background: "rgba(123,169,139,0.14)", borderColor: "rgba(123,169,139,0.3)", color: "var(--sage-dark)" }}
                    >
                      <Leaf size={10} />
                      Free · 2 Minutes · Confidential
                    </div>
                    <h2 className="font-cormorant text-2xl sm:text-3xl font-light mb-1" style={{ color: "var(--deep)" }}>
                      Not sure where to start?{" "}
                      <em className="italic" style={{ color: "var(--sage-dark)" }}>Take the free assessment.</em>
                    </h2>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)", maxWidth: "520px" }}>
                      Answer 8 simple questions and get a personalised mental health snapshot, matched to the right support for you.
                    </p>
                  </div>
                  <div
                    className="inline-flex items-center gap-2 text-sm font-medium text-white px-6 py-3 rounded-full flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                  >
                    Start Free Check
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-1 duration-200" />
                  </div>
                </div>
              </Link>
            </div>
          </section>

          {/* ── Services Preview ── */}
          <section
            className="relative z-10 py-12 sm:py-16 border-t"
            style={{ borderColor: "var(--border)" }}
            aria-labelledby="services-heading"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 sm:mb-12">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4 border"
                  style={{ background: "rgba(123,169,139,0.10)", borderColor: "rgba(123,169,139,0.25)", color: "var(--sage-dark)" }}
                >
                  <Leaf size={11} />
                  What We Offer
                </div>
                <h2 id="services-heading" className="font-cormorant text-3xl sm:text-4xl font-light mb-3" style={{ color: "var(--deep)" }}>
                  Therapy Services
                  {/* Therapy Services in Nigeria */}
                </h2>
                <p className="text-sm sm:text-base max-w-xs sm:max-w-sm mx-auto" style={{ color: "var(--text-muted)" }}>
                  Professional, licensed therapy tailored to your specific needs, available online from anywhere.
                  {/* Professional, licensed therapy tailored to your specific needs, available online across Nigeria. */}
                </p>
              </div>
              {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {services.map(({ icon: Icon, title, desc, tags, isCTA }) =>
                  isCTA ? (
                    <Link
                      key={title}
                      href="/assessment"
                      className="sm:col-span-2 lg:col-span-3 rounded-2xl p-6 sm:p-8 border transition-all hover:-translate-y-1 hover:shadow-md duration-200 flex flex-col sm:flex-row sm:items-center gap-5 group"
                      style={{
                        background: "linear-gradient(135deg, rgba(123,169,139,0.10), rgba(61,139,139,0.08))",
                        borderColor: "rgba(123,169,139,0.35)",
                      }}
                    >
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                      >
                        <Icon size={20} color="white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-cormorant text-xl font-semibold mb-1" style={{ color: "var(--deep)" }}>{title}</h3>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{desc}</p>
                      </div>
                      <div
                        className="inline-flex items-center gap-2 text-sm font-medium text-white px-5 py-2.5 rounded-full flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                      >
                        Start Free
                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1 duration-200" />
                      </div>
                    </Link>
                  ) : (
                    <div
                      key={title}
                      className="rounded-2xl p-5 sm:p-6 border transition-all hover:-translate-y-1 hover:shadow-md duration-200 flex flex-col"
                      style={{ background: "white", borderColor: "var(--border)" }}
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center mb-4"
                        style={{ background: "linear-gradient(135deg, #4e7a5e, #3d8b8b)" }}
                      >
                        <Icon size={18} color="white" />
                      </div>
                      <h3 className="font-cormorant text-xl font-semibold mb-2" style={{ color: "var(--deep)" }}>{title}</h3>
                      <p className="text-sm sm:text-base leading-relaxed mb-4 flex-1" style={{ color: "var(--text-muted)" }}>{desc}</p>
                      {tags && tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 rounded-full border"
                              style={{
                                borderColor: "rgba(123,169,139,0.3)",
                                color: "var(--sage-dark)",
                                background: "rgba(123,169,139,0.07)",
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div> */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {services.map(({ icon: Icon, title, desc, tags, isCTA, color }) =>
                  isCTA ? (
                    <Link
                      key={title}
                      href="/assessment"
                      className="sm:col-span-2 lg:col-span-3 rounded-2xl p-6 sm:p-8 border transition-all hover:-translate-y-1 hover:shadow-md duration-200 flex flex-col sm:flex-row sm:items-center gap-5 group"
                      style={{
                        background: "linear-gradient(135deg, rgba(123,169,139,0.10), rgba(61,139,139,0.08))",
                        borderColor: "rgba(123,169,139,0.35)",
                      }}
                    >
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                      >
                        <Icon size={20} color="white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-cormorant text-xl font-semibold mb-1" style={{ color: "var(--deep)" }}>{title}</h3>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{desc}</p>
                      </div>
                      <div
                        className="inline-flex items-center gap-2 text-sm font-medium text-white px-5 py-2.5 rounded-full flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                      >
                        Start Free
                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1 duration-200" />
                      </div>
                    </Link>
                  ) : (
                    <div
                      key={title}
                      className="rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl flex flex-col group relative"
                      style={{
                        background: "white",
                        borderColor: "var(--border)",
                      }}
                    >
                      {/* Icon badge */}
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                        style={{ background: color.bg }}
                      >
                        <Icon size={22} style={{ color: color.icon }} strokeWidth={2} />
                      </div>

                      <h3 className="font-cormorant text-xl font-semibold mb-2" style={{ color: "var(--deep)" }}>
                        {title}
                      </h3>
                      <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: "var(--text-muted)" }}>
                        {desc}
                      </p>

                      {tags && tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                          {tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2.5 py-1 rounded-full font-medium"
                              style={{
                                color: color.icon,
                                background: color.bg,
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Subtle corner glow on hover */}
                      <div
                        className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-2xl"
                        style={{ background: color.icon }}
                      />
                    </div>
                  )
                )}
              </div>
              <div className="text-center mt-8">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-full border transition-all hover:shadow-sm hover:-translate-y-0.5 duration-200"
                  style={{ borderColor: "var(--border)", color: "var(--sage-dark)" }}
                >
                  View All Services
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </section>

          {/* ── EAP / For Employers ── */}
          <EAPSection />

          {/* ── WhatsApp CTA strip ── */}
          <WhatsAppCTA />

          {/* ── Testimonials ── */}
          {/* <section
            className="relative z-10 py-12 sm:py-16 border-t"
            style={{ borderColor: "var(--border)" }}
            aria-labelledby="testimonials-heading"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 sm:mb-12">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4 border"
                  style={{ background: "rgba(123,169,139,0.10)", borderColor: "rgba(123,169,139,0.25)", color: "var(--sage-dark)" }}
                >
                  <Star size={11} />
                  Client Stories
                </div>
                <h2 id="testimonials-heading" className="font-cormorant text-3xl sm:text-4xl font-light mb-3" style={{ color: "var(--deep)" }}>
                  Real people, real{" "}
                  <em className="italic" style={{ color: "var(--sage-dark)" }}>progress</em>
                </h2>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={14} fill="var(--sage)" style={{ color: "var(--sage)" }} />
                    ))}
                  </div>
                  <span className="text-sm font-medium" style={{ color: "var(--deep)" }}>4.9</span>
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>from 140+ client reviews</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {testimonials.map((t) => (
                  <div key={t.name} className="rounded-2xl p-6 border flex flex-col" style={{ background: "white", borderColor: "var(--border)" }}>
                    <div className="mb-3">
                      <Quote size={20} style={{ color: "var(--sage-light)" }} aria-hidden="true" />
                    </div>
                    <div className="flex gap-0.5 mb-3" aria-label={`${t.stars} out of 5 stars`}>
                      {Array.from({ length: t.stars }).map((_, i) => (
                        <Star key={i} size={12} fill="var(--sage)" style={{ color: "var(--sage)" }} aria-hidden="true" />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed mb-5 font-light flex-1" style={{ color: "var(--text)" }}>
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-2 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                        aria-hidden="true"
                      >
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-medium" style={{ color: "var(--deep)" }}>{t.name}</p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{t.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section> */}
          <section
            className="relative z-10 py-16 sm:py-24 border-t overflow-hidden"
            style={{ borderColor: "var(--border)" }}
            aria-labelledby="testimonials-heading"
          >
            {/* Soft background accents */}
            {/* <div
              className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
              style={{ background: "var(--sage)" }}
            />
            <div
              className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-15 blur-3xl pointer-events-none"
              style={{ background: "var(--teal)" }}
            /> */}

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              {/* Header */}
              <div className="text-center mb-10 sm:mb-14">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4 border"
                  style={{ background: "rgba(123,169,139,0.10)", borderColor: "rgba(123,169,139,0.25)", color: "var(--sage-dark)" }}
                >
                  <Star size={11} />
                  Client Stories
                </div>
                <h2 id="testimonials-heading" className="font-cormorant text-3xl sm:text-4xl lg:text-5xl font-light mb-4" style={{ color: "var(--deep)" }}>
                  Real people, real{" "}
                  <em className="italic" style={{ color: "var(--sage-dark)" }}>progress</em>
                </h2>
                <div className="flex items-center justify-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      // <Star key={i} size={15} fill="var(--sage)" style={{ color: "var(--sage)" }} />
                      <Star key={i} size={15} fill="#d4a574" style={{ color: "#d4a574" }} />
                    ))}
                  </div>
                  <span className="text-sm font-medium" style={{ color: "var(--deep)" }}>4.7</span>
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>from 340+ client reviews</span>
                </div>
              </div>

              {/* Featured testimonial */}
              <div
                className="rounded-3xl p-8 sm:p-10 lg:p-12 mb-6 sm:mb-8 border relative overflow-hidden"
                style={{
                  // background: "linear-gradient(135deg, rgba(123,169,139,0.08), rgba(61,139,139,0.06))",
                  borderColor: "var(--border)",
                  // borderColor: "rgba(123,169,139,0.25)",
                }}
              >
                <Quote
                  size={64}
                  className="absolute -top-2 -left-2 opacity-60"
                  style={{ color: "var(--sage-dark)" }}
                  aria-hidden="true"
                />
                <div className="relative max-w-3xl">
                  <div className="flex gap-0.5 mb-4" aria-label={`${featuredTestimonial.stars} out of 5 stars`}>
                    {/* {Array.from({ length: featuredTestimonial.stars }).map((_, i) => (
                      <Star key={i} size={16} fill="#d4a574" style={{ color: "#d4a574" }} aria-hidden="true" />
                    ))} */}
                  </div>
                  <p className="font-nunito text-xl sm:text-2xl lg:text-3xl font-normal leading-relaxed mb-6" style={{ color: "var(--deep)" }}>
                    &ldquo;{featuredTestimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full flex-shrink-0 overflow-hidden relative">
                      {featuredTestimonial.image ? (
                        <Image
                          src={featuredTestimonial.image}
                          alt={featuredTestimonial.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-sm font-semibold text-white"
                          style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                          aria-hidden="true"
                        >
                          {featuredTestimonial.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "var(--deep)" }}>{featuredTestimonial.name}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{featuredTestimonial.location} · {featuredTestimonial.topic}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid of smaller testimonials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {testimonials.map((t) => (
                  <div
                    key={t.name}
                    className="rounded-2xl p-6 border flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    style={{ background: "white", borderColor: "var(--border)" }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex gap-0.5" aria-label={`${t.stars} out of 5 stars`}>
                        {/* {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={13}
                            fill={i < t.stars ? "#d4a574" : "none"}
                            style={{ color: "#d4a574" }}
                            aria-hidden="true"
                          />
                        ))} */}
                      </div>
                      <span
                        className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(123,169,139,0.10)", color: "var(--sage-dark)" }}
                      >
                        {t.topic}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: "var(--text)" }}>
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-2 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                      <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden relative">
                        {t.image ? (
                          <Image
                            src={t.image}
                            alt={t.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center text-xs font-semibold text-white"
                            style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                            aria-hidden="true"
                          >
                            {t.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-medium" style={{ color: "var(--deep)" }}>{t.name}</p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{t.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section
            className="relative z-10 py-12 sm:py-16 border-t"
            style={{ borderColor: "var(--border)" }}
            aria-labelledby="faq-heading"
          >
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 sm:mb-12">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4 border"
                  style={{ background: "rgba(123,169,139,0.10)", borderColor: "rgba(123,169,139,0.25)", color: "var(--sage-dark)" }}
                >
                  <Leaf size={11} />
                  Common Questions
                </div>
                <h2 id="faq-heading" className="font-cormorant text-3xl sm:text-4xl font-light" style={{ color: "var(--deep)" }}>
                  Questions & Answers
                </h2>
              </div>
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="group rounded-2xl border overflow-hidden"
                    style={{ borderColor: "var(--border)", background: "white" }}
                  >
                    <summary
                      className="flex items-center justify-between px-5 py-4 cursor-pointer list-none select-none"
                      style={{ color: "var(--deep)" }}
                    >
                      <span className="text-sm font-medium pr-4">{faq.q}</span>
                      <ChevronDown
                        size={16}
                        className="flex-shrink-0 transition-transform duration-200 group-open:rotate-180"
                        style={{ color: "var(--sage-dark)" }}
                        aria-hidden="true"
                      />
                    </summary>
                    <div className="px-5 pb-5">
                      <p className="text-sm leading-relaxed font-light" style={{ color: "var(--text-muted)" }}>{faq.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* ── Bottom CTA ── */}
          <BottomCTA />

        </main>
      </div >
    </>
  );
}