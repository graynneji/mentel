// import BgBlobs from "@/components/BgBlobs";
// import HeroPanel from "@/components/HeroPanel";
// import BottomCTA from "@/components/BottomCTA";
// import Link from "next/link";
// import {
//     Leaf, ArrowRight,
//     Brain, Heart, Anchor, ClipboardCheck,
//     Flame, Sun, Users, Sparkles, Quote, ChevronDown, Star, Clock, Shield,
//     Building2,
// } from "lucide-react";

// const services = [
//     {
//         icon: Brain,
//         title: "Anxiety & Stress",
//         desc: "Learn practical, evidence-based tools to manage racing thoughts, worry, and the physical toll of chronic stress.",
//         tags: ["CBT", "Mindfulness", "Breathing Techniques"],
//     },
//     {
//         icon: Heart,
//         title: "Depression",
//         desc: "Work through low mood, lack of motivation, and persistent sadness with a therapist who truly understands.",
//         tags: ["Behavioural Activation", "Talk Therapy"],
//     },
//     {
//         icon: Users,
//         title: "Marriage & Couples",
//         desc: "Strengthen communication, rebuild trust, and navigate conflict with skilled relationship therapy.",
//         tags: ["Gottman Method", "EFT", "Conflict Resolution"],
//     },
//     {
//         icon: Anchor,
//         title: "Trauma & PTSD",
//         desc: "Heal from past experiences in a safe, trauma-informed space using approaches proven to work.",
//         tags: ["EMDR", "Somatic Therapy", "Narrative Therapy"],
//     },
//     {
//         icon: Flame,
//         title: "Burnout & Life Transitions",
//         desc: "Reclaim your energy, identity, and direction when life feels overwhelming or in flux.",
//         tags: ["Life Coaching", "Values Work", "Goal Setting"],
//     },
//     {
//         icon: Sun,
//         title: "Self-Esteem & Growth",
//         desc: "Build a healthier relationship with yourself, challenge inner criticism, and grow into your full potential.",
//         tags: ["Schema Therapy", "ACT", "Compassion Work"],
//     },
//     {
//         icon: ClipboardCheck,
//         title: "Free Assessment",
//         desc: "Not sure where to start? Take our free 2-minute mental health check and get matched to the right therapist.",
//         tags: [] as string[],
//         isCTA: true,
//     },
// ];

// const stats = [
//     { stat: "500+", label: "Sessions completed", icon: Users },
//     { stat: "98%", label: "Client satisfaction", icon: Star },
//     { stat: "24hrs", label: "Average first response", icon: Clock },
// ];

// const testimonials = [
//     {
//         quote: "I was skeptical about online therapy but Mentel made it feel completely safe and personal. My therapist genuinely listens and I've seen real changes in just 6 weeks.",
//         name: "Adaeze O.",
//         location: "Lagos",
//         stars: 5,
//     },
//     {
//         quote: "After struggling with anxiety for years, I finally feel like I have real tools to manage it. Booking was so easy and the price made it accessible for me.",
//         name: "Emeka T.",
//         location: "Abuja",
//         stars: 5,
//     },
//     {
//         quote: "My husband and I tried couples therapy through Mentel and it genuinely saved our marriage. The therapist was warm, professional and non-judgmental.",
//         name: "Funmi & Seun A.",
//         location: "Port Harcourt",
//         stars: 5,
//     },
// ];

// const faqs = [
//     {
//         q: "Is online therapy as effective as in-person?",
//         a: "Yes — research consistently shows online therapy produces outcomes equivalent to in-person sessions for most conditions including anxiety, depression, and relationship issues. Many clients find the privacy and convenience of online therapy actually helps them open up more.",
//     },
//     {
//         q: "How does the ₦5,500 single session work?",
//         a: "You book and pay online, then your matched therapist contacts you within 24 hours to schedule your 50-minute session via secure video call. It's a one-time charge with no commitment required.",
//     },
//     {
//         q: "Are your therapists licensed and qualified?",
//         a: "Every therapist on Mentel holds a recognised professional licence and has been individually vetted by our clinical team. You can see their qualifications and specialisations before your session.",
//     },
//     {
//         q: "Is everything I share kept confidential?",
//         a: "Absolutely. Your sessions are protected by professional confidentiality and our platform is fully NDPR-compliant. We never share your information with third parties.",
//     },
//     {
//         q: "What if I'm not happy with my therapist?",
//         a: "We offer a free rematch if you don't feel the fit is right after your first session. Getting the right match matters more to us than a quick booking.",
//     },
// ];


// /* ─────────────────────────────────────────────
//    GEO: Global FAQ schema
//    These are the questions AI engines surface most
//    often about Nigerian online therapy platforms.
//    Each article page adds its own topic-specific FAQ.
// ───────────────────────────────────────────── */
// const globalFaqSchema = {
//     "@context": "https://schema.org",
//     "@type": "FAQPage",
//     mainEntity: [
//         {
//             "@type": "Question",
//             name: "What is Mentel?",
//             acceptedAnswer: {
//                 "@type": "Answer",
//                 text: "Mentel is a Nigerian online therapy platform that connects people with licensed, vetted therapists via secure video call. Sessions start from ₦5,500. Mentel provides evidence-based care for anxiety, depression, burnout, trauma, couples issues, and more.",
//             },
//         },
//         // {
//         //     "@type": "Question",
//         //     name: "How much does therapy cost on Mentel?",
//         //     acceptedAnswer: {
//         //         "@type": "Answer",
//         //         text: "Sessions on Mentel start from ₦5,500. This is significantly more affordable than most private clinic rates in Nigeria (₦15,000–₦50,000), with no transport costs or waiting rooms.",
//         //     },
//         // },
//         // {
//         //     "@type": "Question",
//         //     name: "Are Mentel therapists licensed?",
//         //     acceptedAnswer: {
//         //         "@type": "Answer",
//         //         text: "Yes. All therapists on Mentel are licensed and vetted. They hold recognised qualifications in clinical or counselling psychology and are registered with Nigerian professional bodies including AHPCN, NACP, or APROCON.",
//         //     },
//         // },
//         {
//             "@type": "Question",
//             name: "Is online therapy available in Nigeria?",
//             acceptedAnswer: {
//                 "@type": "Answer",
//                 text: "Yes. Mentel provides online therapy across Nigeria, including Lagos, Abuja, Port Harcourt, and all other states. Sessions are conducted via secure video call and can be scheduled on evenings and weekends.",
//             },
//         },
//         // {
//         //     "@type": "Question",
//         //     name: "Is therapy confidential on Mentel?",
//         //     acceptedAnswer: {
//         //         "@type": "Answer",
//         //         text: "Yes. All sessions are fully confidential and conducted over encrypted video calls. No information is shared without your consent.",
//         //     },
//         // },
//         {
//             "@type": "Question",
//             name: "How do I book a therapy session in Nigeria?",
//             acceptedAnswer: {
//                 "@type": "Answer",
//                 text: "Visit trymentel.com, complete the intake form, and receive a therapist match within 24 hours. You can also take a free 2-minute mental health assessment before booking.",
//             },
//         },
//         {
//             "@type": "Question",
//             name: "What types of therapy does Mentel offer?",
//             acceptedAnswer: {
//                 "@type": "Answer",
//                 text: "Mentel offers individual therapy, couples therapy, trauma therapy (including EMDR), anxiety treatment (CBT), depression support, and burnout recovery. Therapists are matched to your specific needs.",
//             },
//         },
//         {
//             "@type": "Question",
//             name: "Can I get a free mental health assessment?",
//             acceptedAnswer: {
//                 "@type": "Answer",
//                 text: "Yes. Mentel offers a free 2-minute mental health check-in at trymentel.com/assessment. It is confidential and gives you a clear picture of what kind of support might help.",
//             },
//         },
//     ],
// };



// export default function HomePage() {
//     // const homeFaqSchema = {
//     //     "@context": "https://schema.org",
//     //     "@type": "FAQPage",
//     //     mainEntity: faqs.map((f) => ({
//     //         "@type": "Question",
//     //         name: f.q,
//     //         acceptedAnswer: {
//     //             "@type": "Answer",
//     //             text: f.a,
//     //         },
//     //     })),
//     // };
//     const combinedFaqSchema = {
//         "@context": "https://schema.org",
//         "@type": "FAQPage",
//         mainEntity: [
//             // visible page FAQs
//             ...faqs.map((f) => ({
//                 "@type": "Question",
//                 name: f.q,
//                 acceptedAnswer: { "@type": "Answer", text: f.a },
//             })),
//             // GEO-only questions (not shown in UI)
//             ...globalFaqSchema.mainEntity,
//         ],
//     };

//     return (
//         <>
//             {/* Global SEO FAQ */}
//             {/* <script
//                 type="application/ld+json"
//                 dangerouslySetInnerHTML={{
//                     __html: JSON.stringify(globalFaqSchema),
//                 }}
//             /> */}

//             {/* Page-specific FAQ */}
//             <script
//                 type="application/ld+json"
//                 dangerouslySetInnerHTML={{
//                     __html: JSON.stringify(combinedFaqSchema),
//                 }}
//             />

//             <div className="relative overflow-x-hidden">
//                 <BgBlobs />

//                 {/* ── Hero ── */}
//                 <section className="relative z-10 pt-20 sm:pt-24 pb-12 sm:pb-16">
//                     <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//                         <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-14 lg:items-start">

//                             {/* RIGHT: Trust panel + modal CTA — top on mobile */}
//                             <div className="lg:order-2 animate-fade-up-delay w-full">
//                                 <HeroPanel />
//                             </div>

//                             {/* LEFT: Copy — below panel on mobile */}
//                             <div className="lg:order-1 animate-fade-up pt-10 lg:pt-4 w-full">
//                                 <div
//                                     className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-5 border"
//                                     style={{
//                                         background: "rgba(123,169,139,0.12)",
//                                         borderColor: "rgba(123,169,139,0.3)",
//                                         color: "var(--sage-dark)",
//                                     }}
//                                 >
//                                     <span
//                                         className="w-1.5 h-1.5 rounded-full animate-pulse-dot flex-shrink-0"
//                                         style={{ background: "var(--sage)" }} />
//                                     <span>Certified &bull; Confidential &bull; Online</span>
//                                 </div>

//                                 <h1
//                                     className="font-cormorant text-4xl sm:text-5xl lg:text-6xl font-light leading-tight mb-5"
//                                     style={{ color: "var(--deep)", letterSpacing: "-0.02em" }}
//                                 >
//                                     You don&apos;t have to<br />
//                                     carry this{" "}
//                                     <em className="italic" style={{ color: "var(--sage-dark)" }}>alone</em>.
//                                 </h1>

//                                 <p
//                                     className="sm:text-base leading-relaxed mb-6 font-light"
//                                     style={{ color: "var(--text-muted)", maxWidth: "420px" }}
//                                 >
//                                     Whatever you&apos;re carrying, anxiety, grief, burnout, a relationship at a
//                                     breaking point. Mentel connects you with a licensed therapist who genuinely
//                                     listens. Evidence-based care, delivered with warmth.
//                                 </p>

//                                 {/* Emotional micro-copy */}
//                                 <div
//                                     className="rounded-2xl px-5 py-4 mb-8 border-l-4"
//                                     style={{
//                                         background: "rgba(123,169,139,0.06)",
//                                         borderLeftColor: "var(--sage)",
//                                         borderTop: "1px solid rgba(123,169,139,0.12)",
//                                         borderRight: "1px solid rgba(123,169,139,0.12)",
//                                         borderBottom: "1px solid rgba(123,169,139,0.12)",
//                                     }}
//                                 >
//                                     <p className="text-sm leading-relaxed font-light italic" style={{ color: "var(--text-muted)" }}>
//                                         &ldquo;The first session is the hardest step. After that, most people tell us
//                                         they wish they&apos;d started sooner.&rdquo;
//                                     </p>
//                                     <p className="text-xs mt-2 font-medium" style={{ color: "var(--sage-dark)" }}>
//                                         — Mentel Clinical Team
//                                     </p>
//                                 </div>

//                                 {/* Trust signals */}
//                                 <div className="flex flex-col gap-3">
//                                     {[
//                                         { icon: Shield, text: "NDPR-compliant & fully confidential" },
//                                         { icon: Star, text: "Licensed, empathetic professionals" },
//                                         { icon: Clock, text: "First session response within 24 hours" },
//                                     ].map(({ icon: Icon, text }) => (
//                                         <div key={text} className="flex items-center gap-3">
//                                             <div
//                                                 className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
//                                                 style={{ background: "rgba(123,169,139,0.14)" }}
//                                             >
//                                                 <Icon size={16} style={{ color: "var(--sage-dark)" }} />
//                                             </div>
//                                             <span className="text-sm" style={{ color: "var(--text-muted)" }}>{text}</span>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>

//                         </div>
//                     </div>
//                 </section>

//                 {/* ── Stats Strip ── */}
//                 <section className="relative z-10">
//                     <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//                         <div className="h-px w-full" style={{ background: "var(--border)" }} />
//                         <div className="grid grid-cols-1 sm:grid-cols-3">
//                             {stats.map(({ stat, label, icon: Icon }, i) => (
//                                 <div
//                                     key={label}
//                                     className="flex flex-col items-center justify-center py-6 sm:py-8 px-4 text-center relative"
//                                 >
//                                     {i < stats.length - 1 && (
//                                         <div className="hidden sm:block absolute right-0 top-1/4 h-1/2 w-px" style={{ background: "var(--border)" }} />
//                                     )}
//                                     {i < stats.length - 1 && (
//                                         <div className="sm:hidden absolute bottom-0 left-8 right-8 h-px" style={{ background: "var(--border)" }} />
//                                     )}
//                                     <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ background: "rgba(123,169,139,0.12)" }}>
//                                         <Icon size={20} style={{ color: "var(--sage-dark)" }} />
//                                     </div>
//                                     <p
//                                         className="font-cormorant font-semibold leading-none mb-1.5"
//                                         style={{ color: "var(--deep)", fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)", letterSpacing: "-0.02em" }}
//                                     >
//                                         {stat}
//                                     </p>
//                                     <p className="text-xs uppercase tracking-widest leading-snug" style={{ color: "var(--text-muted)" }}>
//                                         {label}
//                                     </p>
//                                 </div>
//                             ))}
//                         </div>
//                         <div className="h-px w-full" style={{ background: "var(--border)" }} />
//                     </div>
//                 </section>

//                 {/* ── Assessment Banner ── */}
//                 <section className="relative z-10 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
//                     <div className="max-w-6xl mx-auto">
//                         <Link
//                             href="/assessment"
//                             className="group block rounded-2xl sm:rounded-3xl p-7 sm:p-10 relative overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-xl duration-300"
//                             style={{ background: "linear-gradient(135deg, rgba(61,139,139,0.08) 0%, rgba(123,169,139,0.12) 100%)", borderColor: "rgba(123,169,139,0.35)" }}
//                         >
//                             <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg, var(--sage), var(--teal), var(--sage-light))" }} />
//                             <div className="absolute right-0 top-0 bottom-0 w-48 sm:w-72 pointer-events-none opacity-10" style={{ background: "radial-gradient(ellipse at right center, var(--teal) 0%, transparent 70%)" }} />
//                             <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-10">
//                                 <div
//                                     className="rounded-2xl flex items-center justify-center flex-shrink-0"
//                                     style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))", width: "52px", height: "52px" }}
//                                 >
//                                     <Sparkles size={24} color="white" />
//                                 </div>
//                                 <div className="flex-1">
//                                     <div
//                                         className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-widest mb-2 border"
//                                         style={{ background: "rgba(123,169,139,0.14)", borderColor: "rgba(123,169,139,0.3)", color: "var(--sage-dark)" }}
//                                     >
//                                         <Leaf size={10} />
//                                         Free · 2 Minutes · Confidential
//                                     </div>
//                                     <h2 className="font-cormorant text-2xl sm:text-3xl font-light mb-1" style={{ color: "var(--deep)" }}>
//                                         Not sure where to start?{" "}
//                                         <em className="italic" style={{ color: "var(--sage-dark)" }}>Take the free assessment.</em>
//                                     </h2>
//                                     <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)", maxWidth: "520px" }}>
//                                         Answer 8 simple questions and get a personalised mental health snapshot, matched to the right support for you.
//                                     </p>
//                                 </div>
//                                 <div
//                                     className="inline-flex items-center gap-2 text-sm font-medium text-white px-6 py-3 rounded-full flex-shrink-0"
//                                     style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
//                                 >
//                                     Start Free Check
//                                     <ArrowRight size={15} className="transition-transform group-hover:translate-x-1 duration-200" />
//                                 </div>
//                             </div>
//                         </Link>
//                     </div>
//                 </section>

//                 {/* /* ── EAP Corporate Banner ── */}
//                 <section className="relative z-10 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
//                     <div className="max-w-6xl mx-auto">
//                         <Link
//                             href="/eap"
//                             className="group block rounded-2xl sm:rounded-3xl p-7 sm:p-10 relative overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-xl duration-300"
//                             style={{
//                                 background: "linear-gradient(135deg, rgba(28,58,58,0.04) 0%, rgba(61,94,139,0.08) 100%)",
//                                 borderColor: "rgba(28,58,58,0.2)"
//                             }}
//                         >
//                             <div className="absolute top-0 left-0 right-0 h-0.5"
//                                 style={{ background: "linear-gradient(90deg, #1c3a3a, #3d5e8b, #4e8c6a)" }} />
//                             <div className="absolute right-0 top-0 bottom-0 w-48 sm:w-72 pointer-events-none opacity-10"
//                                 style={{ background: "radial-gradient(ellipse at right center, #1c3a3a 0%, transparent 70%)" }} />

//                             <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-10">
//                                 <div
//                                     className="rounded-2xl flex items-center justify-center flex-shrink-0"
//                                     style={{
//                                         background: "linear-gradient(135deg, #1c3a3a, #3d5e8b)",
//                                         width: "52px", height: "52px"
//                                     }}
//                                 >
//                                     <Building2 size={24} color="white" />
//                                 </div>

//                                 <div className="flex-1">
//                                     <div
//                                         className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-widest mb-2 border"
//                                         style={{
//                                             background: "rgba(28,58,58,0.08)",
//                                             borderColor: "rgba(28,58,58,0.2)",
//                                             color: "#1c3a3a"
//                                         }}
//                                     >
//                                         <Building2 size={10} />
//                                         For Companies · Employee Assistance Programme
//                                     </div>
//                                     <h2 className="font-cormorant text-2xl sm:text-3xl font-light mb-1" style={{ color: "var(--deep)" }}>
//                                         Does your organisation care about your people&apos;s mental health?{" "}
//                                         <em className="italic" style={{ color: "#3d5e8b" }}>We can help.</em>
//                                     </h2>
//                                     <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)", maxWidth: "520px" }}>
//                                         Mentel EAP gives your employees confidential therapy access, a clinical-grade 8-domain assessment,
//                                         and your HR team anonymised insights to build a healthier organisation.
//                                     </p>
//                                 </div>

//                                 <div
//                                     className="inline-flex items-center gap-2 text-sm font-medium text-white px-6 py-3 rounded-full flex-shrink-0 whitespace-nowrap"
//                                     style={{ background: "linear-gradient(135deg, #1c3a3a, #3d5e8b)" }}
//                                 >
//                                     Explore EAP Plans
//                                     <ArrowRight size={15} className="transition-transform group-hover:translate-x-1 duration-200" />
//                                 </div>
//                             </div>
//                         </Link>
//                     </div>
//                 </section>

//                 {/* ── Services Preview ── */}
//                 <section className="relative z-10 py-12 sm:py-16 border-t" style={{ borderColor: "var(--border)" }}>
//                     <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//                         <div className="text-center mb-8 sm:mb-12">
//                             <div
//                                 className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4 border"
//                                 style={{ background: "rgba(123,169,139,0.10)", borderColor: "rgba(123,169,139,0.25)", color: "var(--sage-dark)" }}
//                             >
//                                 <Leaf size={11} />
//                                 What We Offer
//                             </div>
//                             <h2 className="font-cormorant text-3xl sm:text-4xl font-light mb-3" style={{ color: "var(--deep)" }}>
//                                 How We Can Help
//                             </h2>
//                             <p className="text-sm sm:text-base max-w-xs sm:max-w-sm mx-auto" style={{ color: "var(--text-muted)" }}>
//                                 Professional therapy services tailored to your specific needs.
//                             </p>
//                         </div>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//                             {services.map(({ icon: Icon, title, desc, tags, isCTA }) => isCTA ? (
//                                 <Link
//                                     key={title}
//                                     href="/assessment"
//                                     className="sm:col-span-2 lg:col-span-3 rounded-2xl p-6 sm:p-8 border transition-all hover:-translate-y-1 hover:shadow-md duration-200 flex flex-col sm:flex-row sm:items-center gap-5 group"
//                                     style={{ background: "linear-gradient(135deg, rgba(123,169,139,0.10), rgba(61,139,139,0.08))", borderColor: "rgba(123,169,139,0.35)" }}
//                                 >
//                                     <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}>
//                                         <Icon size={20} color="white" />
//                                     </div>
//                                     <div className="flex-1">
//                                         <h3 className="font-cormorant text-xl font-semibold mb-1" style={{ color: "var(--deep)" }}>{title}</h3>
//                                         <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{desc}</p>
//                                     </div>
//                                     <div className="inline-flex items-center gap-2 text-sm font-medium text-white px-5 py-2.5 rounded-full flex-shrink-0" style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}>
//                                         Start Free
//                                         <ArrowRight size={14} className="transition-transform group-hover:translate-x-1 duration-200" />
//                                     </div>
//                                 </Link>
//                             ) : (
//                                 <div
//                                     key={title}
//                                     className="rounded-2xl p-5 sm:p-6 border transition-all hover:-translate-y-1 hover:shadow-md duration-200"
//                                     style={{ background: "white", borderColor: "var(--border)" }}
//                                 >
//                                     <div className="w-9 h-9 rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(123,169,139,0.12)" }}>
//                                         <Icon size={18} style={{ color: "var(--sage-dark)" }} />
//                                     </div>
//                                     <h3 className="font-cormorant text-xl font-semibold mb-2" style={{ color: "var(--deep)" }}>{title}</h3>
//                                     <p className="text-sm sm:text-base leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>{desc}</p>
//                                     {tags && tags.length > 0 && (
//                                         <div className="flex flex-wrap gap-1.5">
//                                             {tags.map((tag) => (
//                                                 <span key={tag} className="text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: "rgba(123,169,139,0.3)", color: "var(--sage-dark)", background: "rgba(123,169,139,0.07)" }}>
//                                                     {tag}
//                                                 </span>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>
//                             )
//                             )}
//                         </div>
//                         <div className="text-center mt-8">
//                             <Link
//                                 href="/services"
//                                 className="inline-flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-full border transition-all hover:shadow-sm hover:-translate-y-0.5 duration-200"
//                                 style={{ borderColor: "var(--border)", color: "var(--sage-dark)" }}
//                             >
//                                 View All Services
//                                 <ArrowRight size={14} />
//                             </Link>
//                         </div>
//                     </div>
//                 </section>

//                 {/* ── Testimonials ── */}
//                 <section className="relative z-10 py-12 sm:py-16 border-t" style={{ borderColor: "var(--border)" }}>
//                     <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//                         <div className="text-center mb-8 sm:mb-12">
//                             <div
//                                 className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4 border"
//                                 style={{ background: "rgba(123,169,139,0.10)", borderColor: "rgba(123,169,139,0.25)", color: "var(--sage-dark)" }}
//                             >
//                                 <Star size={11} />
//                                 Client Stories
//                             </div>
//                             <h2 className="font-cormorant text-3xl sm:text-4xl font-light mb-3" style={{ color: "var(--deep)" }}>
//                                 Real people, real{" "}
//                                 <em className="italic" style={{ color: "var(--sage-dark)" }}>progress</em>
//                             </h2>
//                             <p className="text-sm sm:text-base max-w-xs sm:max-w-sm mx-auto" style={{ color: "var(--text-muted)" }}>
//                                 Hear from clients who took the first step.
//                             </p>
//                         </div>
//                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
//                             {testimonials.map((t) => (
//                                 <div key={t.name} className="rounded-2xl p-6 border" style={{ background: "white", borderColor: "var(--border)" }}>
//                                     <div className="mb-3">
//                                         <Quote size={20} style={{ color: "var(--sage-light)" }} />
//                                     </div>
//                                     <div className="flex gap-0.5 mb-3">
//                                         {Array.from({ length: t.stars }).map((_, i) => (
//                                             <Star key={i} size={12} fill="var(--sage)" style={{ color: "var(--sage)" }} />
//                                         ))}
//                                     </div>
//                                     <p className="text-sm leading-relaxed mb-5 font-light" style={{ color: "var(--text)" }}>
//                                         &ldquo;{t.quote}&rdquo;
//                                     </p>
//                                     <div className="flex items-center gap-2 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
//                                         <div
//                                             className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
//                                             style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
//                                         >
//                                             {t.name.charAt(0)}
//                                         </div>
//                                         <div>
//                                             <p className="text-xs font-medium" style={{ color: "var(--deep)" }}>{t.name}</p>
//                                             <p className="text-xs" style={{ color: "var(--text-muted)" }}>{t.location}</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </section>

//                 {/* ── FAQ ── */}
//                 <section className="relative z-10 py-12 sm:py-16 border-t" style={{ borderColor: "var(--border)" }}>
//                     <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
//                         <div className="text-center mb-8 sm:mb-12">
//                             <div
//                                 className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4 border"
//                                 style={{ background: "rgba(123,169,139,0.10)", borderColor: "rgba(123,169,139,0.25)", color: "var(--sage-dark)" }}
//                             >
//                                 <Leaf size={11} />
//                                 Common Questions
//                             </div>
//                             <h2 className="font-cormorant text-3xl sm:text-4xl font-light" style={{ color: "var(--deep)" }}>
//                                 Questions & Answers
//                             </h2>
//                         </div>
//                         <div className="space-y-3">
//                             {faqs.map((faq, i) => (
//                                 <details
//                                     key={i}
//                                     className="group rounded-2xl border overflow-hidden"
//                                     style={{ borderColor: "var(--border)", background: "white" }}
//                                 >
//                                     <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none select-none" style={{ color: "var(--deep)" }}>
//                                         <span className="text-sm font-medium pr-4">{faq.q}</span>
//                                         <ChevronDown size={16} className="flex-shrink-0 transition-transform duration-200 group-open:rotate-180" style={{ color: "var(--sage-dark)" }} />
//                                     </summary>
//                                     <div className="px-5 pb-5">
//                                         <p className="text-sm leading-relaxed font-light" style={{ color: "var(--text-muted)" }}>{faq.a}</p>
//                                     </div>
//                                 </details>
//                             ))}
//                         </div>
//                     </div>
//                 </section>

//                 {/* ── Bottom CTA ── */}
//                 <BottomCTA />

//             </div></>
//     );
// }


import BgBlobs from "@/components/BgBlobs";
import HeroPanel from "@/components/HeroPanel";
import BottomCTA from "@/components/BottomCTA";
import Link from "next/link";
import {
    Leaf, ArrowRight,
    Brain, Heart, Anchor, ClipboardCheck,
    Flame, Sun, Users, Sparkles, Quote, ChevronDown, Star, Clock, Shield,
    Building2, CheckCircle2,
} from "lucide-react";

const services = [
    {
        icon: Brain,
        title: "Anxiety & Stress",
        desc: "Learn practical, evidence-based tools to manage racing thoughts, worry, and the physical toll of chronic stress.",
        tags: ["CBT", "Mindfulness", "Breathing Techniques"],
    },
    {
        icon: Heart,
        title: "Depression",
        desc: "Work through low mood, lack of motivation, and persistent sadness with a therapist who truly understands.",
        tags: ["Behavioural Activation", "Talk Therapy"],
    },
    {
        icon: Users,
        title: "Marriage & Couples",
        desc: "Strengthen communication, rebuild trust, and navigate conflict with skilled relationship therapy.",
        tags: ["Gottman Method", "EFT", "Conflict Resolution"],
    },
    {
        icon: Anchor,
        title: "Trauma & PTSD",
        desc: "Heal from past experiences in a safe, trauma-informed space using approaches proven to work.",
        tags: ["EMDR", "Somatic Therapy", "Narrative Therapy"],
    },
    {
        icon: Flame,
        title: "Burnout & Life Transitions",
        desc: "Reclaim your energy, identity, and direction when life feels overwhelming or in flux.",
        tags: ["Life Coaching", "Values Work", "Goal Setting"],
    },
    {
        icon: Sun,
        title: "Self-Esteem & Growth",
        desc: "Build a healthier relationship with yourself, challenge inner criticism, and grow into your full potential.",
        tags: ["Schema Therapy", "ACT", "Compassion Work"],
    },
    {
        icon: ClipboardCheck,
        title: "Free Assessment",
        desc: "Not sure where to start? Take our free 2-minute mental health check and get matched to the right therapist.",
        tags: [] as string[],
        isCTA: true,
    },
];

const stats = [
    { stat: "4.9★", label: "Average client rating", icon: Star },
    { stat: "35+", label: "Licensed therapists", icon: Users },
    { stat: "24hrs", label: "Average first response", icon: Clock },
];

const testimonials = [
    {
        quote: "I was skeptical about online therapy but Mentel made it feel completely safe and personal. My therapist genuinely listens and I've seen real changes in just 6 weeks.",
        name: "Adaeze O.",
        location: "Lagos",
        stars: 5,
    },
    {
        quote: "After struggling with anxiety for years, I finally feel like I have real tools to manage it. Booking was so easy and the price made it accessible for me.",
        name: "Emeka T.",
        location: "Abuja",
        stars: 5,
    },
    {
        quote: "My husband and I tried couples therapy through Mentel and it genuinely saved our marriage. The therapist was warm, professional and non-judgmental.",
        name: "Funmi & Seun A.",
        location: "Port Harcourt",
        stars: 5,
    },
];

const faqs = [
    {
        q: "Is online therapy as effective as in-person?",
        a: "Yes — research consistently shows online therapy produces outcomes equivalent to in-person sessions for most conditions including anxiety, depression, and relationship issues. Many clients find the privacy and convenience of online therapy actually helps them open up more.",
    },
    {
        q: "How does the ₦8,500 single session work?",
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

const globalFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
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
                text: "Yes. Mentel provides online therapy across Nigeria, including Lagos, Abuja, Port Harcourt, and all other states. Sessions are conducted via secure video call and can be scheduled on evenings and weekends.",
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
            name: "What types of therapy does Mentel offer?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Mentel offers individual therapy, couples therapy, trauma therapy (including EMDR), anxiety treatment (CBT), depression support, and burnout recovery. Therapists are matched to your specific needs.",
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

export default function HomePage() {
    const combinedFaqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            ...faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
            ...globalFaqSchema.mainEntity,
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedFaqSchema) }}
            />

            {/* ── Skip to content (WCAG AA) ── */}
            <a href="#main-content" className="skip-to-content">
                Skip to main content
            </a>

            <div className="relative overflow-x-hidden">
                <BgBlobs />

                <main id="main-content">

                    {/* ── Hero ── */}
                    <section className="relative z-10 pt-16 sm:pt-20 pb-12 sm:pb-16">
                        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-14 lg:items-start">

                                {/* LEFT copy — first in DOM (shows first on mobile) */}
                                <div className="lg:order-1 animate-fade-up pt-4 w-full">

                                    {/* ✅ FIXED: was purple gradient (#8b5e7a), now on-brand sage pill */}
                                    <div
                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-5 border"
                                        style={{
                                            background: "rgba(123,169,139,0.12)",
                                            borderColor: "rgba(123,169,139,0.3)",
                                            color: "var(--sage-dark)",
                                        }}
                                    >
                                        <span
                                            className="w-1.5 h-1.5 rounded-full animate-pulse-dot flex-shrink-0"
                                            style={{ background: "var(--sage)" }}
                                        />
                                        <span>Certified &bull; Confidential &bull; Online</span>
                                    </div>

                                    <h1
                                        className="font-cormorant text-4xl sm:text-5xl lg:text-6xl font-light leading-tight mb-5"
                                        style={{ color: "var(--deep)", letterSpacing: "-0.02em" }}
                                    >
                                        You don&apos;t have to<br />
                                        carry this{" "}
                                        <em className="italic" style={{ color: "var(--sage-dark)" }}>alone</em>.
                                    </h1>

                                    <p
                                        className="sm:text-base leading-relaxed mb-6 font-light"
                                        style={{ color: "var(--text-muted)", maxWidth: "420px" }}
                                    >
                                        Whatever you&apos;re carrying, anxiety, grief, burnout, a relationship at a
                                        breaking point. Mentel connects you with a licensed therapist who genuinely
                                        listens. Evidence-based care, delivered with warmth.
                                    </p>

                                    {/* Emotional micro-copy */}
                                    <div
                                        className="rounded-2xl px-5 py-4 mb-8 border-l-4"
                                        style={{
                                            background: "rgba(123,169,139,0.06)",
                                            borderLeftColor: "var(--sage)",
                                            borderTop: "1px solid rgba(123,169,139,0.12)",
                                            borderRight: "1px solid rgba(123,169,139,0.12)",
                                            borderBottom: "1px solid rgba(123,169,139,0.12)",
                                        }}
                                    >
                                        <p className="text-sm leading-relaxed font-light italic" style={{ color: "var(--text-muted)" }}>
                                            &ldquo;The first session is the hardest step. After that, most people tell us
                                            they wish they&apos;d started sooner.&rdquo;
                                        </p>
                                        <p className="text-xs mt-2 font-medium" style={{ color: "var(--sage-dark)" }}>
                                            — Mentel Clinical Team
                                        </p>
                                    </div>

                                    {/* Trust signals */}
                                    <div className="flex flex-col gap-3">
                                        {[
                                            { icon: Shield, text: "NDPR-compliant & fully confidential" },
                                            { icon: Star, text: "Licensed, empathetic professionals" },
                                            { icon: Clock, text: "First session response within 24 hours" },
                                        ].map(({ icon: Icon, text }) => (
                                            <div key={text} className="flex items-center gap-3">
                                                {/* ✅ FIXED: was rgba(123,169,139,0.14) flat, now solid gradient to match stats icons */}
                                                <div
                                                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                                    style={{ background: "linear-gradient(135deg, #4e7a5e, #3d8b8b)" }}
                                                >
                                                    <Icon size={16} color="white" />
                                                </div>
                                                <span className="text-sm" style={{ color: "var(--text-muted)" }}>{text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* RIGHT panel — second in DOM (shows second on mobile, right on desktop) */}
                                <div className="lg:order-2 animate-fade-up-delay w-full mt-10 lg:mt-0">
                                    {/* Therapist trust strip above the panel */}
                                    <div
                                        className="rounded-2xl px-5 py-4 mb-4 flex items-center gap-4 border"
                                        style={{
                                            background: "rgba(255,255,255,0.7)",
                                            borderColor: "var(--border)",
                                            backdropFilter: "blur(8px)",
                                        }}
                                    >
                                        <div className="flex -space-x-2 flex-shrink-0">
                                            {[
                                                { initials: "AO", bg: "linear-gradient(135deg,#7ba98b,#4e7a5e)" },
                                                { initials: "KI", bg: "linear-gradient(135deg,#3d8b8b,#2a6666)" },
                                                { initials: "FN", bg: "linear-gradient(135deg,#a8c4b0,#7ba98b)" },
                                                { initials: "EB", bg: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" },
                                            ].map(({ initials, bg }) => (
                                                <div
                                                    key={initials}
                                                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-white border-2 flex-shrink-0"
                                                    style={{ background: bg, borderColor: "white" }}
                                                    aria-hidden="true"
                                                >
                                                    {initials}
                                                </div>
                                            ))}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1 mb-0.5">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <Star key={i} size={11} fill="var(--sage)" style={{ color: "var(--sage)" }} />
                                                ))}
                                                <span className="text-xs font-medium ml-1" style={{ color: "var(--deep)" }}>4.9</span>
                                            </div>
                                            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                                                35+ licensed therapists ready to help you
                                            </p>
                                        </div>
                                    </div>
                                    <HeroPanel />
                                </div>

                            </div>
                        </div>
                    </section>

                    {/* ── Stats Strip ── */}
                    <section className="relative z-10" aria-label="Platform statistics">
                        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="h-px w-full" style={{ background: "var(--border)" }} />
                            {/* ✅ FIXED: added tinted strip background so it doesn't read as bare/nude */}
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
                                        {/* ✅ FIXED: was faint rgba(123,169,139,0.12) with colored icon; now solid gradient circle + white icon */}
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

                    {/* ── Assessment Banner ── */}
                    <section className="relative z-10 py-6 sm:py-8 px-4 sm:px-6 lg:px-8" aria-label="Free assessment">
                        <div className="max-w-6xl mx-auto">
                            <Link
                                href="/assessment"
                                className="group block rounded-2xl sm:rounded-3xl p-7 sm:p-10 relative overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-xl duration-300"
                                style={{ background: "linear-gradient(135deg, rgba(61,139,139,0.08) 0%, rgba(123,169,139,0.12) 100%)", borderColor: "rgba(123,169,139,0.35)" }}
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
                    <section className="relative z-10 py-12 sm:py-16 border-t" style={{ borderColor: "var(--border)" }} aria-labelledby="services-heading">
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
                                    How We Can Help
                                </h2>
                                <p className="text-sm sm:text-base max-w-xs sm:max-w-sm mx-auto" style={{ color: "var(--text-muted)" }}>
                                    Professional therapy services tailored to your specific needs.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {services.map(({ icon: Icon, title, desc, tags, isCTA }) => isCTA ? (
                                    <Link
                                        key={title}
                                        href="/assessment"
                                        className="sm:col-span-2 lg:col-span-3 rounded-2xl p-6 sm:p-8 border transition-all hover:-translate-y-1 hover:shadow-md duration-200 flex flex-col sm:flex-row sm:items-center gap-5 group"
                                        style={{ background: "linear-gradient(135deg, rgba(123,169,139,0.10), rgba(61,139,139,0.08))", borderColor: "rgba(123,169,139,0.35)" }}
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
                                        {/* ✅ FIXED: service card icons now solid gradient to match the rest of the page */}
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
                                                        style={{ borderColor: "rgba(123,169,139,0.3)", color: "var(--sage-dark)", background: "rgba(123,169,139,0.07)" }}
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
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

                    {/* ── EAP Corporate — visually distinct section (dark) ── */}
                    <section
                        className="relative z-10 py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
                        style={{ background: "linear-gradient(135deg, #1c3a3a 0%, #0e2222 100%)" }}
                        aria-labelledby="eap-heading"
                    >
                        <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #7ba98b 0%, transparent 50%), radial-gradient(circle at 80% 20%, #3d8b8b 0%, transparent 40%)" }} />
                        <div className="max-w-6xl mx-auto relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.12)" }} />
                                <span className="text-xs uppercase tracking-widest font-medium" style={{ color: "rgba(168,196,176,0.8)" }}>
                                    For Organisations
                                </span>
                                <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.12)" }} />
                            </div>

                            <div className="flex flex-col lg:flex-row lg:items-center gap-10">
                                <div className="flex-1">
                                    <div
                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-5 border"
                                        style={{ background: "rgba(123,169,139,0.15)", borderColor: "rgba(123,169,139,0.3)", color: "#a8c4b0" }}
                                    >
                                        <Building2 size={10} />
                                        Employee Assistance Programme
                                    </div>
                                    <h2 id="eap-heading" className="font-cormorant text-3xl sm:text-4xl font-light mb-4 text-white">
                                        Mental health support<br />
                                        <em className="italic" style={{ color: "#6fb8b8" }}>built for your team.</em>
                                    </h2>
                                    <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(200,221,210,0.8)", maxWidth: "480px" }}>
                                        Mentel EAP gives your employees confidential therapy access, a clinical-grade 8-domain assessment,
                                        and your HR team anonymised insights to build a healthier organisation.
                                    </p>
                                    <div className="flex flex-col gap-3">
                                        {[
                                            "Unlimited confidential therapy sessions per employee",
                                            "HR dashboard with anonymised wellbeing insights",
                                            "Clinical-grade 8-domain mental health assessment",
                                        ].map((point) => (
                                            <div key={point} className="flex items-start gap-3">
                                                <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" style={{ color: "#6fb8b8" }} />
                                                <span className="text-sm" style={{ color: "rgba(200,221,210,0.85)" }}>{point}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* CTA card */}
                                <div
                                    className="rounded-2xl p-7 flex-shrink-0 lg:w-72 border"
                                    style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(123,169,139,0.25)" }}
                                >
                                    <p className="text-sm font-medium text-white mb-1">Ready to support your team?</p>
                                    <p className="text-xs mb-6" style={{ color: "rgba(200,221,210,0.7)" }}>
                                        Flexible plans for teams of all sizes. No long-term lock-in.
                                    </p>
                                    <Link
                                        href="/eap"
                                        className="group flex items-center justify-center gap-2 text-sm font-medium text-white w-full py-3 rounded-full mb-3 transition-all hover:opacity-90 duration-200"
                                        style={{ background: "linear-gradient(135deg, #4e7a5e, #3d8b8b)" }}
                                    >
                                        Explore EAP Plans
                                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1 duration-200" />
                                    </Link>
                                    <p className="text-xs text-center" style={{ color: "rgba(200,221,210,0.5)" }}>
                                        Or email us at hello@trymentel.com
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── Testimonials ── */}
                    <section className="relative z-10 py-12 sm:py-16 border-t" style={{ borderColor: "var(--border)" }} aria-labelledby="testimonials-heading">
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
                    </section>

                    {/* ── FAQ ── */}
                    <section className="relative z-10 py-12 sm:py-16 border-t" style={{ borderColor: "var(--border)" }} aria-labelledby="faq-heading">
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
            </div>
        </>
    );
}