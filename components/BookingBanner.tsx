// import Link from "next/link";
// import { CalendarCheck, ArrowRight, BadgeCheck } from "lucide-react";

// export function BookingBanner() {
//     return (
//         <Link
//             href="/book"
//             className="group mb-10 block rounded-2xl p-5 sm:p-7 no-underline transition-all hover:-translate-y-0.5"
//             style={{
//                 background: "linear-gradient(135deg, rgba(123,169,139,0.1) 0%, rgba(90,140,160,0.08) 100%)",
//                 border: "1px solid rgba(123,169,139,0.25)",
//             }}
//         >
//             <div className="flex flex-col items-center text-center gap-3 sm:flex-row sm:items-start sm:text-left sm:gap-4">
//                 <div
//                     className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
//                     style={{ background: "var(--sage)" }}
//                 >
//                     <CalendarCheck size={22} color="white" />
//                 </div>

//                 <div className="flex-1 min-w-0">
//                     <p
//                         className="text-[10px] font-semibold uppercase tracking-widest mb-1.5"
//                         style={{ color: "var(--sage-dark)" }}
//                     >
//                         Book a session
//                     </p>
//                     <h3
//                         className="font-cormorant text-lg sm:text-2xl font-semibold mb-1.5 leading-snug"
//                         style={{ color: "var(--deep)" }}
//                     >
//                         Ready to talk to someone who can help?
//                     </h3>
//                     <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
//                         Book a session with a licensed Mentel professional and get support that fits
//                         what you're going through, at a time that works for you.
//                     </p>

//                     <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:flex-wrap">
//                         <span
//                             className="inline-flex items-center gap-2 text-sm font-medium text-white px-5 py-2.5 rounded-full transition-transform group-hover:translate-x-0.5"
//                             style={{ background: "var(--deep)" }}
//                         >
//                             Book a session
//                             <ArrowRight size={15} />
//                         </span>
//                         <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
//                             <BadgeCheck size={13} />
//                             Licensed professionals
//                         </span>
//                     </div>
//                 </div>
//             </div>
//         </Link>
//     );
// }


// import Link from "next/link";
// import { CalendarCheck, ArrowRight, BadgeCheck } from "lucide-react";

// export function BookingBanner() {
//     return (
//         <Link
//             href="/book"
//             className="group mb-10 block rounded-2xl p-5 sm:p-7 no-underline transition-all hover:-translate-y-0.5 hover:shadow-lg"
//             style={{ background: "var(--deep)" }}
//         >
//             <div className="flex flex-col items-center text-center gap-3 sm:flex-row sm:items-start sm:text-left sm:gap-4">
//                 <div
//                     className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
//                     style={{ background: "var(--sage)" }}
//                 >
//                     <CalendarCheck size={22} color="white" />
//                 </div>

//                 <div className="flex-1 min-w-0">
//                     <p
//                         className="text-[10px] font-semibold uppercase tracking-widest mb-1.5"
//                         style={{ color: "var(--sage)" }}
//                     >
//                         Book a session
//                     </p>
//                     <h3 className="font-cormorant text-lg sm:text-2xl font-semibold mb-1.5 leading-snug text-white">
//                         Ready to talk to someone who can help?
//                     </h3>
//                     <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.75)" }}>
//                         Book a session with a licensed Mentel professional and get support that fits
//                         what you're going through, at a time that works for you.
//                     </p>

//                     <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:flex-wrap">
//                         <span
//                             className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full transition-transform group-hover:translate-x-0.5"
//                             style={{ background: "white", color: "var(--deep)" }}
//                         >
//                             Book a session
//                             <ArrowRight size={15} />
//                         </span>
//                         <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
//                             <BadgeCheck size={13} />
//                             Licensed professionals
//                         </span>
//                     </div>
//                 </div>
//             </div>
//         </Link>
//     );
// }

import Link from "next/link";
import { CalendarCheck, ArrowRight, BadgeCheck } from "lucide-react";

export function BookingBanner() {
    return (
        <div
            className="mb-10 rounded-2xl p-5 sm:p-7"
            style={{ background: "var(--deep)" }}
        >
            <div className="flex flex-col items-center text-center gap-3 sm:flex-row sm:items-start sm:text-left sm:gap-4">
                <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--sage)" }}
                >
                    <CalendarCheck size={22} color="white" />
                </div>

                <div className="flex-1 min-w-0">
                    <p
                        className="text-[10px] font-semibold uppercase tracking-widest mb-1.5"
                        style={{ color: "var(--sage)" }}
                    >
                        Book a session
                    </p>
                    <h3 className="font-cormorant text-lg sm:text-2xl font-semibold mb-1.5 leading-snug text-white">
                        Ready to talk to someone who can help?
                    </h3>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.75)" }}>
                        Book a session with a licensed Mentel professional and get support that fits
                        what you're going through, at a time that works for you.
                    </p>

                    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:flex-wrap">
                        <Link
                            href="/book"
                            className="group inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full no-underline transition-transform hover:-translate-y-0.5"
                            style={{ background: "white", color: "var(--deep)" }}
                        >
                            Book a session
                            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                        </Link>
                        <Link
                            href="/adhd-assessment"
                            className="inline-flex items-center text-sm font-medium px-5 py-2.5 rounded-full no-underline transition-colors hover:bg-white/10"
                            style={{ color: "white", border: "1px solid rgba(255,255,255,0.35)" }}
                        >
                            Take the free assessment
                        </Link>
                        <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
                            <BadgeCheck size={13} />
                            Licensed professionals
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}