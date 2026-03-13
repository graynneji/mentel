// import BgBlobs from "@/components/BgBlobs";
// import BookingForm from "@/components/BookingForm";
// import Link from "next/link";
// import { Shield, Clock, Star, Leaf } from "lucide-react";

// const trustItems = [
//   { icon: Shield, text: "HIPAA-compliant & fully confidential" },
//   { icon: Star, text: "Licensed, empathetic professionals" },
//   { icon: Clock, text: "First session response within 24 hours" },
// ];

// export default function HomePage() {
//   return (
//     <div className="relative">
//       <BgBlobs />

//       {/* Hero Section */}
//       <section className="relative z-10 pt-24 pb-16">
//         <div className="max-w-6xl mx-auto px-6">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

//             {/* Left: Hero copy */}
//             <div className="animate-fade-up pt-6">
//               {/* Badge */}
//               <div
//                 className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-8 border"
//                 style={{
//                   background: "rgba(123,169,139,0.12)",
//                   borderColor: "rgba(123,169,139,0.3)",
//                   color: "var(--sage-dark)",
//                 }}
//               >
//                 <span
//                   className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
//                   style={{ background: "var(--sage)" }}
//                 />
//                 Certified Therapists &bull; Confidential &bull; Online
//               </div>

//               <h1
//                 className="font-cormorant text-5xl md:text-6xl font-light leading-tight mb-6"
//                 style={{ color: "var(--deep)", letterSpacing: "-0.02em" }}
//               >
//                 A space to{" "}
//                 <em className="italic" style={{ color: "var(--sage-dark)" }}>heal</em>,<br />
//                 grow, and find<br />
//                 <em className="italic" style={{ color: "var(--teal)" }}>clarity</em>.
//               </h1>

//               <p
//                 className="text-base leading-relaxed mb-10 max-w-md font-light"
//                 style={{ color: "var(--text-muted)" }}
//               >
//                 Mentel connects you with licensed therapists who genuinely listen.
//                 Our evidence-based approach blends compassion with proven methods — helping
//                 you navigate life&apos;s challenges with confidence and care.
//               </p>

//               <div className="flex flex-col gap-4">
//                 {trustItems.map(({ icon: Icon, text }) => (
//                   <div key={text} className="flex items-center gap-3">
//                     <div
//                       className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
//                       style={{ background: "rgba(123,169,139,0.14)" }}
//                     >
//                       <Icon size={15} style={{ color: "var(--sage-dark)" }} />
//                     </div>
//                     <span className="text-sm" style={{ color: "var(--text-muted)" }}>{text}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Right: Booking Form */}
//             <div id="book" className="animate-fade-up-delay">
//               <div
//                 className="rounded-3xl p-8 md:p-10 relative overflow-hidden"
//                 style={{
//                   background: "rgba(255,255,255,0.88)",
//                   backdropFilter: "blur(20px)",
//                   border: "1px solid rgba(200,221,210,0.6)",
//                   boxShadow: "0 4px 6px rgba(0,0,0,0.02), 0 20px 60px rgba(61,139,139,0.08)",
//                 }}
//               >
//                 {/* Top accent line */}
//                 <div
//                   className="absolute top-0 left-0 right-0 h-0.5 rounded-t-3xl"
//                   style={{ background: "linear-gradient(90deg, var(--sage), var(--teal), var(--sage-light))" }}
//                 />
//                 <div className="flex items-center gap-2 mb-1">
//                   <Leaf size={16} style={{ color: "var(--sage)" }} />
//                   <h2 className="font-cormorant text-2xl font-semibold" style={{ color: "var(--deep)" }}>
//                     Book Your Consultation
//                   </h2>
//                 </div>
//                 <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>
//                   Complete the form below to get started today.
//                 </p>
//                 <BookingForm />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Services preview */}
//       <section className="relative z-10 py-20 border-t border-border">
//         <div className="max-w-6xl mx-auto px-6 text-center mb-12">
//           <h2 className="font-cormorant text-4xl font-light mb-3" style={{ color: "var(--deep)" }}>
//             How We Can Help
//           </h2>
//           <p className="text-sm max-w-md mx-auto" style={{ color: "var(--text-muted)" }}>
//             Explore our range of professional therapy services tailored to your needs.
//           </p>
//         </div>
//         <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
//           {[
//             { title: "Individual Therapy", desc: "One-on-one sessions focused on your personal growth and mental wellbeing." },
//             { title: "Couples & Marriage", desc: "Rebuild connection and communication in a safe, guided environment." },
//             { title: "Trauma & Recovery", desc: "Evidence-based approaches to help you heal from past experiences." },
//           ].map((s) => (
//             <div
//               key={s.title}
//               className="rounded-2xl p-6 border transition-all hover:-translate-y-1 hover:shadow-md duration-200"
//               style={{ background: "white", borderColor: "var(--border)" }}
//             >
//               <div
//                 className="w-8 h-1 rounded-full mb-4"
//                 style={{ background: "linear-gradient(90deg, var(--sage), var(--teal))" }}
//               />
//               <h3 className="font-cormorant text-xl font-semibold mb-2" style={{ color: "var(--deep)" }}>
//                 {s.title}
//               </h3>
//               <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{s.desc}</p>
//             </div>
//           ))}
//         </div>
//         <div className="text-center mt-10">
//           <Link
//             href="/services"
//             className="inline-flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-full border transition-all hover:shadow-sm duration-200"
//             style={{ borderColor: "var(--border)", color: "var(--sage-dark)" }}
//           >
//             View All Services
//           </Link>
//         </div>
//       </section>
//     </div>
//   );
// }

import BgBlobs from "@/components/BgBlobs";
import BookingForm from "@/components/BookingForm";
import Link from "next/link";
import { Shield, Clock, Star, Leaf, ArrowRight, Brain, Heart, Anchor } from "lucide-react";

const trustItems = [
  { icon: Shield, text: "HIPAA-compliant & fully confidential" },
  { icon: Star, text: "Licensed, empathetic professionals" },
  { icon: Clock, text: "First session response within 24 hours" },
];

const services = [
  {
    icon: Brain,
    title: "Individual Therapy",
    desc: "One-on-one sessions focused on your personal growth and mental wellbeing.",
  },
  {
    icon: Heart,
    title: "Couples & Marriage",
    desc: "Rebuild connection and communication in a safe, guided environment.",
  },
  {
    icon: Anchor,
    title: "Trauma & Recovery",
    desc: "Evidence-based approaches to help you heal from past experiences.",
  },
];

const stats = [
  { stat: "500+", label: "Sessions completed" },
  { stat: "98%", label: "Client satisfaction rate" },
  { stat: "24hrs", label: "Average first response" },
];

export default function HomePage() {
  return (
    <div className="relative overflow-x-hidden">
      <BgBlobs />

      {/* ── Hero ── */}
      <section className="relative z-10 pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Mobile: form first, copy below. Desktop: copy left, form right */}
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
                  <Leaf size={15} style={{ color: "var(--sage)" }} />
                  <h2 className="font-cormorant text-xl sm:text-2xl font-semibold" style={{ color: "var(--deep)" }}>
                    Book Your Consultation
                  </h2>
                </div>
                <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
                  Complete the form below to get started today.
                </p>
                <BookingForm />
              </div>
            </div>

            {/* Copy — below form on mobile */}
            <div className="lg:order-1 animate-fade-up pt-10 lg:pt-4 w-full">
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
                A space to{" "}
                <em className="italic" style={{ color: "var(--sage-dark)" }}>heal</em>,<br />
                grow, and find<br />
                <em className="italic" style={{ color: "var(--teal)" }}>clarity</em>.
              </h1>

              <p
                className="text-sm sm:text-base leading-relaxed mb-8 font-light"
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
                      <Icon size={14} style={{ color: "var(--sage-dark)" }} />
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
            <div
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{ background: "linear-gradient(90deg, var(--sage), var(--teal), var(--sage-light))" }}
            />
            <div className="grid grid-cols-3 gap-3 sm:gap-6 text-center">
              {stats.map(({ stat, label }) => (
                <div key={label}>
                  <p
                    className="font-cormorant text-2xl sm:text-4xl lg:text-5xl font-semibold mb-1"
                    style={{ color: "var(--deep)" }}
                  >
                    {stat}
                  </p>
                  <p
                    className="text-xs uppercase tracking-wide leading-snug"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
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
            <p className="text-sm max-w-xs sm:max-w-sm mx-auto" style={{ color: "var(--text-muted)" }}>
              Professional therapy services tailored to your specific needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {services.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl p-5 sm:p-6 border transition-all hover:-translate-y-1 hover:shadow-md duration-200"
                style={{ background: "white", borderColor: "var(--border)" }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center mb-4"
                  style={{ background: "rgba(123,169,139,0.12)" }}
                >
                  <Icon size={16} style={{ color: "var(--sage-dark)" }} />
                </div>
                <h3 className="font-cormorant text-xl font-semibold mb-2" style={{ color: "var(--deep)" }}>
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{desc}</p>
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

      {/* ── Bottom CTA ── */}
      <section className="relative z-10 py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-xl mx-auto text-center">
          <div
            className="w-10 h-1 rounded-full mx-auto mb-6"
            style={{ background: "linear-gradient(90deg, var(--sage), var(--teal))" }}
          />
          <h2 className="font-cormorant text-3xl sm:text-4xl font-light mb-4" style={{ color: "var(--deep)" }}>
            Ready to take the<br />
            <em className="italic" style={{ color: "var(--sage-dark)" }}>first step</em>?
          </h2>
          <p className="text-sm mb-8 max-w-xs mx-auto" style={{ color: "var(--text-muted)" }}>
            Your first consultation is the hardest part. We make it easy, safe, and judgment-free.
          </p>
          <Link
            href="#book"
            className="inline-flex items-center gap-2 text-sm font-medium text-white px-7 py-3.5 rounded-full transition-all hover:-translate-y-0.5 hover:shadow-lg duration-200"
            style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
          >
            Book a Free Consultation
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

    </div>
  );
}