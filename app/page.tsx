

// import BgBlobs from "@/components/BgBlobs";
// import BookingForm from "@/components/BookingForm";
// import Link from "next/link";
// import { Shield, Clock, Star, Leaf, ArrowRight, Brain, Heart, Anchor } from "lucide-react";

// const trustItems = [
//   { icon: Shield, text: "HIPAA-compliant & fully confidential" },
//   { icon: Star, text: "Licensed, empathetic professionals" },
//   { icon: Clock, text: "First session response within 24 hours" },
// ];

// const services = [
//   {
//     icon: Brain,
//     title: "Individual Therapy",
//     desc: "One-on-one sessions focused on your personal growth and mental wellbeing.",
//   },
//   {
//     icon: Heart,
//     title: "Couples & Marriage",
//     desc: "Rebuild connection and communication in a safe, guided environment.",
//   },
//   {
//     icon: Anchor,
//     title: "Trauma & Recovery",
//     desc: "Evidence-based approaches to help you heal from past experiences.",
//   },
// ];

// const stats = [
//   { stat: "500+", label: "Sessions completed" },
//   { stat: "98%", label: "Client satisfaction rate" },
//   { stat: "24hrs", label: "Average first response" },
// ];

// export default function HomePage() {
//   return (
//     <div className="relative overflow-x-hidden">
//       <BgBlobs />

//       {/* ── Hero ── */}
//       <section className="relative z-10 pt-20 sm:pt-24 pb-12 sm:pb-16">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

//           {/* Mobile: form first, copy below. Desktop: copy left, form right */}
//           <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-14 lg:items-start">

//             {/* Booking Form — top on mobile */}
//             <div id="book" className="lg:order-2 animate-fade-up-delay w-full">
//               <div
//                 className="rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 relative overflow-hidden w-full"
//                 style={{
//                   background: "rgba(255,255,255,0.92)",
//                   backdropFilter: "blur(20px)",
//                   border: "1px solid rgba(200,221,210,0.6)",
//                   boxShadow: "0 4px 6px rgba(0,0,0,0.02), 0 20px 60px rgba(61,139,139,0.08)",
//                 }}
//               >
//                 <div
//                   className="absolute top-0 left-0 right-0 h-0.5"
//                   style={{ background: "linear-gradient(90deg, var(--sage), var(--teal), var(--sage-light))" }}
//                 />
//                 <div className="flex items-center gap-2 mb-1">
//                   <Leaf size={20} style={{ color: "var(--sage)" }} />
//                   <h2 className="font-cormorant text-xl sm:text-2xl font-semibold" style={{ color: "var(--deep)" }}>
//                     Book Your Session
//                   </h2>
//                 </div>
//                 <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
//                   Complete the form below to get started today.
//                 </p>
//                 <BookingForm />
//               </div>
//             </div>

//             {/* Copy — below form on mobile */}
//             <div className="lg:order-1 animate-fade-up pt-10 lg:pt-4 w-full">
//               <div
//                 className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-5 border"
//                 style={{
//                   background: "rgba(123,169,139,0.12)",
//                   borderColor: "rgba(123,169,139,0.3)",
//                   color: "var(--sage-dark)",
//                 }}
//               >
//                 <span
//                   className="w-1.5 h-1.5 rounded-full animate-pulse-dot flex-shrink-0"
//                   style={{ background: "var(--sage)" }}
//                 />
//                 <span>Certified &bull; Confidential &bull; Online</span>
//               </div>

//               <h1
//                 className="font-cormorant text-4xl sm:text-5xl lg:text-6xl font-light leading-tight mb-5"
//                 style={{ color: "var(--deep)", letterSpacing: "-0.02em" }}
//               >
//                 A space to{" "}
//                 <em className="italic" style={{ color: "var(--sage-dark)" }}>heal</em>,<br />
//                 grow, and find<br />
//                 <em className="italic" style={{ color: "var(--teal)" }}>clarity</em>.
//               </h1>

//               <p
//                 className=" sm:text-base leading-relaxed mb-8 font-light"
//                 style={{ color: "var(--text-muted)", maxWidth: "420px" }}
//               >
//                 Mentel connects you with licensed therapists who genuinely listen.
//                 Our evidence-based approach blends compassion with proven methods — helping
//                 you navigate life&apos;s challenges with confidence and care.
//               </p>

//               <div className="flex flex-col gap-3">
//                 {trustItems.map(({ icon: Icon, text }) => (
//                   <div key={text} className="flex items-center gap-3">
//                     <div
//                       className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
//                       style={{ background: "rgba(123,169,139,0.14)" }}
//                     >
//                       <Icon size={16} style={{ color: "var(--sage-dark)" }} />
//                     </div>
//                     <span className="text-sm" style={{ color: "var(--text-muted)" }}>{text}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//           </div>
//         </div>
//       </section>

//       {/* ── Stats Strip ── */}
//       <section className="relative z-10 py-10 sm:py-14">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div
//             className="rounded-2xl sm:rounded-3xl p-6 sm:p-10 relative overflow-hidden border"
//             style={{ background: "white", borderColor: "var(--border)" }}
//           >
//             <div
//               className="absolute top-0 left-0 right-0 h-0.5"
//               style={{ background: "linear-gradient(90deg, var(--sage), var(--teal), var(--sage-light))" }}
//             />
//             <div className="grid grid-cols-3 gap-3 sm:gap-6 text-center">
//               {stats.map(({ stat, label }) => (
//                 <div key={label}>
//                   <p
//                     className="font-cormorant text-2xl sm:text-4xl lg:text-5xl font-semibold mb-1"
//                     style={{ color: "var(--deep)" }}
//                   >
//                     {stat}
//                   </p>
//                   <p
//                     className="text-xs uppercase tracking-wide leading-snug"
//                     style={{ color: "var(--text-muted)" }}
//                   >
//                     {label}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ── Services Preview ── */}
//       <section className="relative z-10 py-12 sm:py-16 border-t" style={{ borderColor: "var(--border)" }}>
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

//           <div className="text-center mb-8 sm:mb-12">
//             <div
//               className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4 border"
//               style={{ background: "rgba(123,169,139,0.10)", borderColor: "rgba(123,169,139,0.25)", color: "var(--sage-dark)" }}
//             >
//               <Leaf size={11} />
//               What We Offer
//             </div>
//             <h2 className="font-cormorant text-3xl sm:text-4xl font-light mb-3" style={{ color: "var(--deep)" }}>
//               How We Can Help
//             </h2>
//             <p className="text-sm sm:text-base max-w-xs sm:max-w-sm mx-auto" style={{ color: "var(--text-muted)" }}>
//               Professional therapy services tailored to your specific needs.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
//             {services.map(({ icon: Icon, title, desc }) => (
//               <div
//                 key={title}
//                 className="rounded-2xl p-5 sm:p-6 border transition-all hover:-translate-y-1 hover:shadow-md duration-200"
//                 style={{ background: "white", borderColor: "var(--border)" }}
//               >
//                 <div
//                   className="w-9 h-9 rounded-full flex items-center justify-center mb-4"
//                   style={{ background: "rgba(123,169,139,0.12)" }}
//                 >
//                   <Icon size={18} style={{ color: "var(--sage-dark)" }} />
//                 </div>
//                 <h3 className="font-cormorant text-xl font-semibold mb-2" style={{ color: "var(--deep)" }}>
//                   {title}
//                 </h3>
//                 <p className="text-sm sm:text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>{desc}</p>
//               </div>
//             ))}
//           </div>

//           <div className="text-center mt-8">
//             <Link
//               href="/services"
//               className="inline-flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-full border transition-all hover:shadow-sm hover:-translate-y-0.5 duration-200"
//               style={{ borderColor: "var(--border)", color: "var(--sage-dark)" }}
//             >
//               View All Services
//               <ArrowRight size={14} />
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* ── Bottom CTA ── */}
//       <section className="relative z-10 py-14 sm:py-20 px-4 sm:px-6">
//         <div className="max-w-xl mx-auto text-center">
//           <div
//             className="w-10 h-1 rounded-full mx-auto mb-6"
//             style={{ background: "linear-gradient(90deg, var(--sage), var(--teal))" }}
//           />
//           <h2 className="font-cormorant text-3xl sm:text-4xl font-light mb-4" style={{ color: "var(--deep)" }}>
//             Ready to take the<br />
//             <em className="italic" style={{ color: "var(--sage-dark)" }}>first step</em>?
//           </h2>
//           <p className="text-sm sm:text-base mb-8 max-w-xs mx-auto" style={{ color: "var(--text-muted)" }}>
//             Your first consultation is the hardest part. We make it easy, safe, and judgment-free.
//           </p>
//           <Link
//             href="#book"
//             className="inline-flex items-center gap-2 text-sm font-medium text-white px-7 py-3.5 rounded-full transition-all hover:-translate-y-0.5 hover:shadow-lg duration-200"
//             style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
//           >
//             Book Your Session
//             <ArrowRight size={15} />
//           </Link>
//         </div>
//       </section>

//     </div>
//   );
// }
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
// import BgBlobs from "@/components/BgBlobs";
// import BookingForm from "@/components/BookingForm";
// import Link from "next/link";
// import {
//   Shield, Clock, Star, Leaf, ArrowRight,
//   Brain, Heart, Anchor, ClipboardCheck,
//   Flame, Sun, Users, Sparkles,
// } from "lucide-react";

// const trustItems = [
//   { icon: Shield, text: "HIPAA-compliant & fully confidential" },
//   { icon: Star, text: "Licensed, empathetic professionals" },
//   { icon: Clock, text: "First session response within 24 hours" },
// ];

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
//   { stat: "500+", label: "Sessions completed" },
//   { stat: "98%", label: "Client satisfaction rate" },
//   { stat: "24hrs", label: "Average first response" },
// ];

// export default function HomePage() {
//   return (
//     <div className="relative overflow-x-hidden">
//       <BgBlobs />

//       {/* ── Hero ── */}
//       <section className="relative z-10 pt-20 sm:pt-24 pb-12 sm:pb-16">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

//           <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-14 lg:items-start">

//             {/* Booking Form — top on mobile */}
//             <div id="book" className="lg:order-2 animate-fade-up-delay w-full">
//               <div
//                 className="rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 relative overflow-hidden w-full"
//                 style={{
//                   background: "rgba(255,255,255,0.92)",
//                   backdropFilter: "blur(20px)",
//                   border: "1px solid rgba(200,221,210,0.6)",
//                   boxShadow: "0 4px 6px rgba(0,0,0,0.02), 0 20px 60px rgba(61,139,139,0.08)",
//                 }}
//               >
//                 <div
//                   className="absolute top-0 left-0 right-0 h-0.5"
//                   style={{ background: "linear-gradient(90deg, var(--sage), var(--teal), var(--sage-light))" }}
//                 />
//                 <div className="flex items-center gap-2 mb-1">
//                   <Leaf size={20} style={{ color: "var(--sage)" }} />
//                   <h2 className="font-cormorant text-xl sm:text-2xl font-semibold" style={{ color: "var(--deep)" }}>
//                     Book Your Session
//                   </h2>
//                 </div>
//                 <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
//                   Complete the form below to get started today.
//                 </p>
//                 <BookingForm />
//               </div>

//               {/* Assessment nudge — sits under the form on desktop */}
//               <Link
//                 href="/assessment"
//                 className="group mt-4 flex items-center gap-3 px-5 py-3.5 rounded-2xl border transition-all hover:-translate-y-0.5 hover:shadow-sm duration-200 w-full"
//                 style={{
//                   background: "rgba(123,169,139,0.07)",
//                   borderColor: "rgba(123,169,139,0.3)",
//                 }}
//               >
//                 <div
//                   className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
//                   style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
//                 >
//                   <ClipboardCheck size={15} color="white" />
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-xs font-medium" style={{ color: "var(--deep)" }}>
//                     Not sure where to start?
//                   </p>
//                   <p className="text-xs" style={{ color: "var(--text-muted)" }}>
//                     Take our free 2-min mental health check
//                   </p>
//                 </div>
//                 <ArrowRight
//                   size={14}
//                   style={{ color: "var(--sage-dark)" }}
//                   className="transition-transform group-hover:translate-x-1 duration-200"
//                 />
//               </Link>
//             </div>

//             {/* Copy — below form on mobile */}
//             <div className="lg:order-1 animate-fade-up pt-10 lg:pt-4 w-full">
//               <div
//                 className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-5 border"
//                 style={{
//                   background: "rgba(123,169,139,0.12)",
//                   borderColor: "rgba(123,169,139,0.3)",
//                   color: "var(--sage-dark)",
//                 }}
//               >
//                 <span
//                   className="w-1.5 h-1.5 rounded-full animate-pulse-dot flex-shrink-0"
//                   style={{ background: "var(--sage)" }}
//                 />
//                 <span>Certified &bull; Confidential &bull; Online</span>
//               </div>

//               <h1
//                 className="font-cormorant text-4xl sm:text-5xl lg:text-6xl font-light leading-tight mb-5"
//                 style={{ color: "var(--deep)", letterSpacing: "-0.02em" }}
//               >
//                 A space to{" "}
//                 <em className="italic" style={{ color: "var(--sage-dark)" }}>heal</em>,<br />
//                 grow, and find<br />
//                 <em className="italic" style={{ color: "var(--teal)" }}>clarity</em>.
//               </h1>

//               <p
//                 className="sm:text-base leading-relaxed mb-8 font-[400]"
//                 style={{ color: "var(--text-muted)", maxWidth: "420px" }}
//               >
//                 Mentel connects you with licensed therapists who genuinely listen.
//                 Our evidence-based approach blends compassion with proven methods — helping
//                 you navigate life&apos;s challenges with confidence and care.
//               </p>

//               <div className="flex flex-col gap-3">
//                 {trustItems.map(({ icon: Icon, text }) => (
//                   <div key={text} className="flex items-center gap-3">
//                     <div
//                       className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
//                       style={{ background: "rgba(123,169,139,0.14)" }}
//                     >
//                       <Icon size={16} style={{ color: "var(--sage-dark)" }} />
//                     </div>
//                     <span className="text-sm" style={{ color: "var(--text-muted)" }}>{text}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//           </div>
//         </div>
//       </section>

//       {/* ── Stats Strip ── */}
//       <section className="relative z-10 py-10 sm:py-14">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div
//             className="rounded-2xl sm:rounded-3xl p-6 sm:p-10 relative overflow-hidden border"
//             style={{ background: "white", borderColor: "var(--border)" }}
//           >
//             <div
//               className="absolute top-0 left-0 right-0 h-0.5"
//               style={{ background: "linear-gradient(90deg, var(--sage), var(--teal), var(--sage-light))" }}
//             />
//             <div className="grid grid-cols-3 gap-3 sm:gap-6 text-center">
//               {stats.map(({ stat, label }) => (
//                 <div key={label}>
//                   <p
//                     className="font-cormorant text-2xl sm:text-4xl lg:text-5xl font-semibold mb-1"
//                     style={{ color: "var(--deep)" }}
//                   >
//                     {stat}
//                   </p>
//                   <p
//                     className="text-xs uppercase tracking-wide leading-snug"
//                     style={{ color: "var(--text-muted)" }}
//                   >
//                     {label}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ── Assessment Banner ── */}
//       <section className="relative z-10 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-6xl mx-auto">
//           <Link
//             href="/assessment"
//             className="group block rounded-2xl sm:rounded-3xl p-7 sm:p-10 relative overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-xl duration-300"
//             style={{
//               background: "linear-gradient(135deg, rgba(61,139,139,0.08) 0%, rgba(123,169,139,0.12) 100%)",
//               borderColor: "rgba(123,169,139,0.35)",
//             }}
//           >
//             {/* Top accent line */}
//             <div
//               className="absolute top-0 left-0 right-0 h-0.5"
//               style={{ background: "linear-gradient(90deg, var(--sage), var(--teal), var(--sage-light))" }}
//             />
//             {/* Decorative glow */}
//             <div
//               className="absolute right-0 top-0 bottom-0 w-48 sm:w-72 pointer-events-none opacity-10"
//               style={{ background: "radial-gradient(ellipse at right center, var(--teal) 0%, transparent 70%)" }}
//             />

//             <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-10">

//               {/* Icon */}
//               <div
//                 className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
//                 style={{
//                   background: "linear-gradient(135deg, var(--sage-dark), var(--teal))",
//                   width: "52px",
//                   height: "52px",
//                 }}
//               >
//                 <Sparkles size={24} color="white" />
//               </div>

//               {/* Copy */}
//               <div className="flex-1">
//                 <div
//                   className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-widest mb-2 border"
//                   style={{
//                     background: "rgba(123,169,139,0.14)",
//                     borderColor: "rgba(123,169,139,0.3)",
//                     color: "var(--sage-dark)",
//                   }}
//                 >
//                   <Leaf size={10} />
//                   Free · 2 Minutes · Confidential
//                 </div>
//                 <h2
//                   className="font-cormorant text-2xl sm:text-3xl font-light mb-1"
//                   style={{ color: "var(--deep)" }}
//                 >
//                   Not sure where to start?{" "}
//                   <em className="italic" style={{ color: "var(--sage-dark)" }}>
//                     Take the free assessment.
//                   </em>
//                 </h2>
//                 <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)", maxWidth: "520px" }}>
//                   Answer 8 simple questions and get a personalised mental health snapshot — matched to the right support for you.
//                 </p>
//               </div>

//               {/* CTA pill */}
//               <div
//                 className="inline-flex items-center gap-2 text-sm font-medium text-white px-6 py-3 rounded-full flex-shrink-0 transition-all duration-200"
//                 style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
//               >
//                 Start Free Check
//                 <ArrowRight
//                   size={15}
//                   className="transition-transform group-hover:translate-x-1 duration-200"
//                 />
//               </div>

//             </div>
//           </Link>
//         </div>
//       </section>

//       {/* ── Services Preview ── */}
//       <section className="relative z-10 py-12 sm:py-16 border-t" style={{ borderColor: "var(--border)" }}>
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

//           <div className="text-center mb-8 sm:mb-12">
//             <div
//               className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4 border"
//               style={{
//                 background: "rgba(123,169,139,0.10)",
//                 borderColor: "rgba(123,169,139,0.25)",
//                 color: "var(--sage-dark)",
//               }}
//             >
//               <Leaf size={11} />
//               What We Offer
//             </div>
//             <h2 className="font-cormorant text-3xl sm:text-4xl font-light mb-3" style={{ color: "var(--deep)" }}>
//               How We Can Help
//             </h2>
//             <p className="text-sm sm:text-base max-w-xs sm:max-w-sm mx-auto" style={{ color: "var(--text-muted)" }}>
//               Professional therapy services tailored to your specific needs.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//             {services.map(({ icon: Icon, title, desc, tags, isCTA }) =>
//               isCTA ? (
//                 // Full-width Free Assessment CTA card
//                 <Link
//                   key={title}
//                   href="/assessment"
//                   className="sm:col-span-2 lg:col-span-3 rounded-2xl p-6 sm:p-8 border transition-all hover:-translate-y-1 hover:shadow-md duration-200 flex flex-col sm:flex-row sm:items-center gap-5 group"
//                   style={{
//                     background: "linear-gradient(135deg, rgba(123,169,139,0.10), rgba(61,139,139,0.08))",
//                     borderColor: "rgba(123,169,139,0.35)",
//                   }}
//                 >
//                   <div
//                     className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
//                     style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
//                   >
//                     <Icon size={20} color="white" />
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="font-cormorant text-xl font-semibold mb-1" style={{ color: "var(--deep)" }}>
//                       {title}
//                     </h3>
//                     <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{desc}</p>
//                   </div>
//                   <div
//                     className="inline-flex items-center gap-2 text-sm font-medium text-white px-5 py-2.5 rounded-full flex-shrink-0 transition-all duration-200"
//                     style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
//                   >
//                     Start Free
//                     <ArrowRight
//                       size={14}
//                       className="transition-transform group-hover:translate-x-1 duration-200"
//                     />
//                   </div>
//                 </Link>
//               ) : (
//                 // Regular service card
//                 <div
//                   key={title}
//                   className="rounded-2xl p-5 sm:p-6 border transition-all hover:-translate-y-1 hover:shadow-md duration-200"
//                   style={{ background: "white", borderColor: "var(--border)" }}
//                 >
//                   <div
//                     className="w-9 h-9 rounded-full flex items-center justify-center mb-4"
//                     style={{ background: "rgba(123,169,139,0.12)" }}
//                   >
//                     <Icon size={18} style={{ color: "var(--sage-dark)" }} />
//                   </div>
//                   <h3 className="font-cormorant text-xl font-semibold mb-2" style={{ color: "var(--deep)" }}>
//                     {title}
//                   </h3>
//                   <p className="text-sm sm:text-base leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
//                     {desc}
//                   </p>
//                   {tags && tags.length > 0 && (
//                     <div className="flex flex-wrap gap-1.5">
//                       {tags.map((tag) => (
//                         <span
//                           key={tag}
//                           className="text-xs px-2 py-0.5 rounded-full border"
//                           style={{
//                             borderColor: "rgba(123,169,139,0.3)",
//                             color: "var(--sage-dark)",
//                             background: "rgba(123,169,139,0.07)",
//                           }}
//                         >
//                           {tag}
//                         </span>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )
//             )}
//           </div>

//           <div className="text-center mt-8">
//             <Link
//               href="/services"
//               className="inline-flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-full border transition-all hover:shadow-sm hover:-translate-y-0.5 duration-200"
//               style={{ borderColor: "var(--border)", color: "var(--sage-dark)" }}
//             >
//               View All Services
//               <ArrowRight size={14} />
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* ── Bottom CTA ── */}
//       <section className="relative z-10 py-14 sm:py-20 px-4 sm:px-6">
//         <div className="max-w-xl mx-auto text-center">
//           <div
//             className="w-10 h-1 rounded-full mx-auto mb-6"
//             style={{ background: "linear-gradient(90deg, var(--sage), var(--teal))" }}
//           />
//           <h2 className="font-cormorant text-3xl sm:text-4xl font-light mb-4" style={{ color: "var(--deep)" }}>
//             Ready to take the<br />
//             <em className="italic" style={{ color: "var(--sage-dark)" }}>first step</em>?
//           </h2>
//           <p className="text-sm sm:text-base mb-8 max-w-xs mx-auto" style={{ color: "var(--text-muted)" }}>
//             Your first consultation is the hardest part. We make it easy, safe, and judgment-free.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-3 justify-center">
//             <Link
//               href="#book"
//               className="inline-flex items-center justify-center gap-2 text-sm font-medium text-white px-7 py-3.5 rounded-full transition-all hover:-translate-y-0.5 hover:shadow-lg duration-200"
//               style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
//             >
//               Book Your Session
//               <ArrowRight size={15} />
//             </Link>
//             <Link
//               href="/assessment"
//               className="inline-flex items-center justify-center gap-2 text-sm font-medium px-7 py-3.5 rounded-full border transition-all hover:-translate-y-0.5 hover:shadow-sm duration-200"
//               style={{ borderColor: "rgba(123,169,139,0.4)", color: "var(--sage-dark)", background: "rgba(123,169,139,0.07)" }}
//             >
//               <ClipboardCheck size={15} />
//               Free Assessment
//             </Link>
//           </div>
//         </div>
//       </section>

//     </div>
//   );
// }

///////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
import BgBlobs from "@/components/BgBlobs";
import BookingForm from "@/components/BookingForm";
import Link from "next/link";
import {
  Shield, Clock, Star, Leaf, ArrowRight,
  Brain, Heart, Anchor, ClipboardCheck,
  Flame, Sun, Users, Sparkles, Quote, ChevronDown,
} from "lucide-react";

const trustItems = [
  { icon: Shield, text: "HIPAA-compliant & fully confidential" },
  { icon: Star, text: "Licensed, empathetic professionals" },
  { icon: Clock, text: "First session response within 24 hours" },
];

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
  { stat: "500+", label: "Sessions completed" },
  { stat: "98%", label: "Client satisfaction rate" },
  { stat: "24hrs", label: "Average first response" },
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
    q: "How does the ₦10,000 single session work?",
    a: "You book and pay online, then your matched therapist contacts you within 24 hours to schedule your 50-minute session via secure video call. It's a one-time charge with no commitment required.",
  },
  {
    q: "Are your therapists licensed and qualified?",
    a: "Every therapist on Mentel holds a recognised professional licence and has been individually vetted by our clinical team. You can see their qualifications and specialisations before your session.",
  },
  {
    q: "Is everything I share kept confidential?",
    a: "Absolutely. Your sessions are protected by professional confidentiality and our platform is fully HIPAA-compliant. We never share your information with third parties.",
  },
  {
    q: "What if I'm not happy with my therapist?",
    a: "We offer a free rematch if you don't feel the fit is right after your first session. Getting the right match matters more to us than a quick booking.",
  },
];

export default function HomePage() {
  return (
    <div className="relative overflow-x-hidden">
      <BgBlobs />

      {/* ── Hero ── */}
      <section className="relative z-10 pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-14 lg:items-start">

            {/* Booking Form — top on mobile */}
            <div id="book" className="lg:order-2 animate-fade-up-delay w-full">
              <div
                className="rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 relative overflow-hidden w-full"
                style={{
                  background: "rgba(255,255,255,0.92)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(200,221,210,0.6)",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.02), 0 20px 60px rgba(61,139,139,0.08)",
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ background: "linear-gradient(90deg, var(--sage), var(--teal), var(--sage-light))" }}
                />
                <div className="flex items-center gap-2 mb-1">
                  <Leaf size={20} style={{ color: "var(--sage)" }} />
                  <h2 className="font-cormorant text-xl sm:text-2xl font-semibold" style={{ color: "var(--deep)" }}>
                    Book Your Session
                  </h2>
                </div>
                <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
                  Complete the form below to get started today.
                </p>
                <BookingForm />
              </div>

              {/* Assessment nudge */}
              <Link
                href="/assessment"
                className="group mt-4 flex items-center gap-3 px-5 py-3.5 rounded-2xl border transition-all hover:-translate-y-0.5 hover:shadow-sm duration-200 w-full"
                style={{ background: "rgba(123,169,139,0.07)", borderColor: "rgba(123,169,139,0.3)" }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                >
                  <ClipboardCheck size={15} color="white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium" style={{ color: "var(--deep)" }}>Not sure where to start?</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Take our free 2-min mental health check</p>
                </div>
                <ArrowRight size={14} style={{ color: "var(--sage-dark)" }} className="transition-transform group-hover:translate-x-1 duration-200" />
              </Link>
            </div>

            {/* Copy — below form on mobile */}
            <div className="lg:order-1 animate-fade-up pt-10 lg:pt-4 w-full">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-5 border"
                style={{ background: "rgba(123,169,139,0.12)", borderColor: "rgba(123,169,139,0.3)", color: "var(--sage-dark)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot flex-shrink-0" style={{ background: "var(--sage)" }} />
                <span>Certified &bull; Confidential &bull; Online</span>
              </div>

              <h1
                className="font-cormorant text-4xl sm:text-5xl lg:text-6xl font-light leading-tight mb-5"
                style={{ color: "var(--deep)", letterSpacing: "-0.02em" }}
              >
                A space to{" "}
                <em className="italic" style={{ color: "var(--sage-dark)" }}>heal</em>,<br />
                grow, and find<br />
                <em className="italic" style={{ color: "var(--teal)" }}>clarity</em>.
              </h1>

              <p
                className="sm:text-base leading-relaxed mb-8 font-[400]"
                style={{ color: "var(--text-muted)", maxWidth: "420px" }}
              >
                Mentel connects you with licensed therapists who genuinely listen.
                Our evidence-based approach blends compassion with proven methods — helping
                you navigate life&apos;s challenges with confidence and care.
              </p>

              <div className="flex flex-col gap-3">
                {trustItems.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(123,169,139,0.14)" }}
                    >
                      <Icon size={16} style={{ color: "var(--sage-dark)" }} />
                    </div>
                    <span className="text-sm" style={{ color: "var(--text-muted)" }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="relative z-10 py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-2xl sm:rounded-3xl p-6 sm:p-10 relative overflow-hidden border"
            style={{ background: "white", borderColor: "var(--border)" }}
          >
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg, var(--sage), var(--teal), var(--sage-light))" }} />
            <div className="grid grid-cols-3 gap-3 sm:gap-6 text-center">
              {stats.map(({ stat, label }) => (
                <div key={label}>
                  <p className="font-cormorant text-2xl sm:text-4xl lg:text-5xl font-semibold mb-1" style={{ color: "var(--deep)" }}>
                    {stat}
                  </p>
                  <p className="text-xs uppercase tracking-wide leading-snug" style={{ color: "var(--text-muted)" }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Assessment Banner ── */}
      <section className="relative z-10 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
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
                className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
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
                  Answer 8 simple questions and get a personalised mental health snapshot — matched to the right support for you.
                </p>
              </div>
              <div
                className="inline-flex items-center gap-2 text-sm font-medium text-white px-6 py-3 rounded-full flex-shrink-0 transition-all duration-200"
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
      <section className="relative z-10 py-12 sm:py-16 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4 border"
              style={{ background: "rgba(123,169,139,0.10)", borderColor: "rgba(123,169,139,0.25)", color: "var(--sage-dark)" }}
            >
              <Leaf size={11} />
              What We Offer
            </div>
            <h2 className="font-cormorant text-3xl sm:text-4xl font-light mb-3" style={{ color: "var(--deep)" }}>
              How We Can Help
            </h2>
            <p className="text-sm sm:text-base max-w-xs sm:max-w-sm mx-auto" style={{ color: "var(--text-muted)" }}>
              Professional therapy services tailored to your specific needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {services.map(({ icon: Icon, title, desc, tags, isCTA }) =>
              isCTA ? (
                <Link
                  key={title}
                  href="/assessment"
                  className="sm:col-span-2 lg:col-span-3 rounded-2xl p-6 sm:p-8 border transition-all hover:-translate-y-1 hover:shadow-md duration-200 flex flex-col sm:flex-row sm:items-center gap-5 group"
                  style={{ background: "linear-gradient(135deg, rgba(123,169,139,0.10), rgba(61,139,139,0.08))", borderColor: "rgba(123,169,139,0.35)" }}
                >
                  <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}>
                    <Icon size={20} color="white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-cormorant text-xl font-semibold mb-1" style={{ color: "var(--deep)" }}>{title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{desc}</p>
                  </div>
                  <div className="inline-flex items-center gap-2 text-sm font-medium text-white px-5 py-2.5 rounded-full flex-shrink-0" style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}>
                    Start Free
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1 duration-200" />
                  </div>
                </Link>
              ) : (
                <div
                  key={title}
                  className="rounded-2xl p-5 sm:p-6 border transition-all hover:-translate-y-1 hover:shadow-md duration-200"
                  style={{ background: "white", borderColor: "var(--border)" }}
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(123,169,139,0.12)" }}>
                    <Icon size={18} style={{ color: "var(--sage-dark)" }} />
                  </div>
                  <h3 className="font-cormorant text-xl font-semibold mb-2" style={{ color: "var(--deep)" }}>{title}</h3>
                  <p className="text-sm sm:text-base leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>{desc}</p>
                  {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: "rgba(123,169,139,0.3)", color: "var(--sage-dark)", background: "rgba(123,169,139,0.07)" }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
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

      {/* ── Testimonials ── */}
      <section className="relative z-10 py-12 sm:py-16 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4 border"
              style={{ background: "rgba(123,169,139,0.10)", borderColor: "rgba(123,169,139,0.25)", color: "var(--sage-dark)" }}
            >
              <Star size={11} />
              Client Stories
            </div>
            <h2 className="font-cormorant text-3xl sm:text-4xl font-light mb-3" style={{ color: "var(--deep)" }}>
              Real people, real{" "}
              <em className="italic" style={{ color: "var(--sage-dark)" }}>progress</em>
            </h2>
            <p className="text-sm sm:text-base max-w-xs sm:max-w-sm mx-auto" style={{ color: "var(--text-muted)" }}>
              Hear from clients who took the first step.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl p-6 border" style={{ background: "white", borderColor: "var(--border)" }}>
                <div className="mb-3">
                  <Quote size={20} style={{ color: "var(--sage-light)" }} />
                </div>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={12} fill="var(--sage)" style={{ color: "var(--sage)" }} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-5 font-light" style={{ color: "var(--text)" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-2 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
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
      <section className="relative z-10 py-12 sm:py-16 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4 border"
              style={{ background: "rgba(123,169,139,0.10)", borderColor: "rgba(123,169,139,0.25)", color: "var(--sage-dark)" }}
            >
              <Leaf size={11} />
              Common Questions
            </div>
            <h2 className="font-cormorant text-3xl sm:text-4xl font-light" style={{ color: "var(--deep)" }}>
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
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none select-none" style={{ color: "var(--deep)" }}>
                  <span className="text-sm font-medium pr-4">{faq.q}</span>
                  <ChevronDown size={16} className="flex-shrink-0 transition-transform duration-200 group-open:rotate-180" style={{ color: "var(--sage-dark)" }} />
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
      <section className="relative z-10 py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: "linear-gradient(90deg, var(--sage), var(--teal))" }} />
          <h2 className="font-cormorant text-3xl sm:text-4xl font-light mb-4" style={{ color: "var(--deep)" }}>
            Ready to take the<br />
            <em className="italic" style={{ color: "var(--sage-dark)" }}>first step</em>?
          </h2>
          <p className="text-sm sm:text-base mb-3 max-w-xs mx-auto" style={{ color: "var(--text-muted)" }}>
            Your first consultation is the hardest part. We make it easy, safe, and judgment-free.
          </p>
          <p className="text-xs mb-8 font-medium" style={{ color: "var(--sage-dark)" }}>
            🔥 Single session currently ₦10,000 — limited time offer
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="#book"
              className="inline-flex items-center justify-center gap-2 text-sm font-medium text-white px-7 py-3.5 rounded-full transition-all hover:-translate-y-0.5 hover:shadow-lg duration-200"
              style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
            >
              Book Your Session
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center gap-2 text-sm font-medium px-7 py-3.5 rounded-full border transition-all hover:-translate-y-0.5 hover:shadow-sm duration-200"
              style={{ borderColor: "rgba(123,169,139,0.4)", color: "var(--sage-dark)", background: "rgba(123,169,139,0.07)" }}
            >
              <ClipboardCheck size={15} />
              Free Assessment
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}