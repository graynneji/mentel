// // components/AdhdTestBanner.tsx
// //
// // A card promoting the ADHD self-assessment, meant to sit inside article
// // pages (see app/articles/[slug]/page.tsx, where it replaces the old "In
// // this article" table-of-contents block). Uses this site's own CSS
// // variables (--sage, --teal, --deep, --border, --text-muted) rather than
// // the ADHD flow's own palette constants, since this renders inside the
// // general articles template, not the ADHD flow itself, keeping it visually
// // consistent with the page it's actually embedded in.

// import Link from "next/link";
// import { Brain, ArrowRight } from "lucide-react";

// export function AdhdTestBanner() {
//     return (
//         <Link
//             href="/adhd"
//             className="group mb-10 flex items-center gap-4 rounded-xl p-5 border no-underline transition-colors hover:bg-[rgba(123,169,139,0.06)]"
//             style={{ borderColor: "var(--border)", background: "white" }}
//         >
//             <div
//                 className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
//                 style={{ background: "rgba(123,169,139,0.12)" }}
//             >
//                 <Brain size={20} style={{ color: "var(--sage-dark)" }} />
//             </div>
//             <div className="flex-1 min-w-0">
//                 <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--deep)" }}>
//                     Wondering if this sounds like you?
//                 </p>
//                 <p className="text-xs" style={{ color: "var(--text-muted)" }}>
//                     Take Mentel's free ADHD self-assessment, results in about 4 minutes
//                 </p>
//             </div>
//             <ArrowRight
//                 size={18}
//                 className="flex-shrink-0 transition-transform group-hover:translate-x-0.5"
//                 style={{ color: "var(--sage-dark)" }}
//             />
//         </Link>
//     );
// }

// components/AdhdTestBanner.tsx
//
// A card promoting the ADHD self-assessment, meant to sit inside article
// pages (see app/articles/[slug]/page.tsx, where it replaces the old "In
// this article" table-of-contents block). This renders across many
// articles, not just ADHD-specific ones, so the copy is written to hook on
// its own rather than assume the reader just finished reading about ADHD.
// Uses this site's own CSS variables (--sage, --teal, --deep, --border,
// --text-muted) rather than the ADHD flow's own palette constants, since
// this renders inside the general articles template, keeping it visually
// consistent with the page it's embedded in.
//
// Mobile note: the icon + heading used to sit side-by-side (flex-row) at
// every screen size, which looked clustered on narrow phones — a 48px
// icon squeezed against a two-line heading with only 16px of gap and 24px
// of card padding left barely any breathing room. Below `sm:` it now
// stacks icon-above-text instead, centered, with more generous spacing,
// and only switches to the side-by-side layout once there's actually
// enough width for it.

import Link from "next/link";
import { Brain, ArrowRight, Clock } from "lucide-react";

export function AdhdTestBanner() {
    return (
        <Link
            href="/adhd-assessment"
            className="group mb-10 block rounded-2xl p-5 sm:p-7 no-underline transition-all hover:-translate-y-0.5"
            style={{
                background: "linear-gradient(135deg, rgba(123,169,139,0.1) 0%, rgba(90,140,160,0.08) 100%)",
                border: "1px solid rgba(123,169,139,0.25)",
            }}
        >
            <div className="flex flex-col items-center text-center gap-3 sm:flex-row sm:items-start sm:text-left sm:gap-4">
                <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--sage)" }}
                >
                    <Brain size={22} color="white" />
                </div>

                <div className="flex-1 min-w-0">
                    <p
                        className="text-[10px] font-semibold uppercase tracking-widest mb-1.5"
                        style={{ color: "var(--sage-dark)" }}
                    >
                        Free self-assessment
                    </p>
                    <h3
                        className="font-cormorant text-lg sm:text-2xl font-semibold mb-1.5 leading-snug"
                        style={{ color: "var(--deep)" }}
                    >
                        Constantly distracted, restless, or forgetting things that matter?
                    </h3>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
                        Take Mentel's ADHD self-assessment and get a clear, personalised picture of your
                        attention, memory, and focus patterns, not just a guess.
                    </p>

                    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:flex-wrap">
                        <span
                            className="inline-flex items-center gap-2 text-sm font-medium text-white px-5 py-2.5 rounded-full transition-transform group-hover:translate-x-0.5"
                            style={{ background: "var(--deep)" }}
                        >
                            Take the free assessment
                            <ArrowRight size={15} />
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                            <Clock size={13} />
                            About 4 minutes, no signup required
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}