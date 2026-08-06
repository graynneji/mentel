// // components/adhd/ReportPreviewMock.tsx
// //
// // A styled mockup of the report, not a real render of the PDF. First
// // "page" is fully visible (the cover), the rest are faded/blurred behind
// // it with section labels, creating the curiosity-gap effect from the brief
// // without needing to actually render the PDF client-side.

// const sections = [
//     "Executive Summary",
//     "Clinical Interpretation",
//     "Domain Analysis",
//     "Charts & Visual Summary",
//     "Recommendations",
//     "Lifestyle Strategies",
//     "Questions for Your Clinician",
//     "Next Steps",
// ];

// export default function ReportPreviewMock({ name }: { name: string }) {
//     return (
//         <div className="relative max-w-[420px] mx-auto" style={{ perspective: "1200px" }}>
//             {/* Stacked blurred pages behind */}
//             {[3, 2, 1].map((offset) => (
//                 <div
//                     key={offset}
//                     className="absolute inset-0 rounded-2xl bg-white border border-[#e4e9e5]"
//                     style={{
//                         transform: `translate(${offset * 7}px, ${offset * 10}px) rotate(${offset * 0.8}deg)`,
//                         filter: "blur(1.5px)",
//                         opacity: 0.5 - offset * 0.1,
//                         zIndex: 10 - offset,
//                     }}
//                 />
//             ))}

//             {/* Foreground: realistic cover */}
//             <div
//                 className="relative rounded-2xl overflow-hidden shadow-[0_24px_70px_rgba(14,92,61,0.22)] border border-[#0E5C3D]/20"
//                 style={{ zIndex: 20, aspectRatio: "0.72", background: "linear-gradient(155deg, #0E5C3D 0%, #164a37 100%)" }}
//             >
//                 <div className="h-full w-full flex flex-col justify-between p-7 text-white">
//                     <div>
//                         <p className="font-['Cormorant_Garamond',Georgia,serif] text-[19px] font-semibold">Mentel</p>
//                         <p className="text-[8px] tracking-[0.15em] opacity-70 mt-0.5">MENTAL WELLNESS TECHNOLOGY</p>
//                     </div>
//                     <div>
//                         <p className="text-[8.5px] tracking-[0.15em] opacity-80 uppercase mb-2">Educational ADHD Screening Report</p>
//                         <p className="font-['Cormorant_Garamond',Georgia,serif] text-[24px] font-light leading-[1.2]">
//                             Prepared for {name || "you"}
//                         </p>
//                     </div>
//                     <div className="h-px bg-white/25" />
//                 </div>

//                 {/* Blur veil with section list, teasing contents */}
//                 <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px] flex flex-col justify-end p-6" style={{ opacity: 0 }} />
//             </div>

//             {/* Section list beneath, half-legible to create curiosity */}
//             <div className="relative mt-6 rounded-2xl border border-[#e4e9e5] bg-white p-5" style={{ zIndex: 20 }}>
//                 <p className="text-[10.5px] font-semibold tracking-[0.06em] uppercase text-[#4a6a56] mb-3">Inside your report</p>
//                 <div className="grid grid-cols-2 gap-x-4 gap-y-2">
//                     {sections.map((s) => (
//                         <div key={s} className="flex items-center gap-1.5">
//                             <span className="w-1 h-1 rounded-full bg-[#2d7a5a] flex-shrink-0" />
//                             <span className="text-[11.5px] text-[#5a6b5e] font-light leading-tight">{s}</span>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }


// components/adhd/ReportPreviewMock.tsx
//
// A styled mockup of the report, not a real render of the PDF (the actual
// PDF is generated server-side by lib/adhd/pdf-report.tsx). This exists
// purely to make the paywall feel like it's gating a real, substantial
// document rather than an abstract promise.
//
// Previous version: the "pages behind the cover" were empty white
// rectangles with no content, so at a glance it just read as a plain
// colored box with a name on it, not a stack of report pages. Fixed by
// giving the background pages actual mock content, a header bar, paragraph
// lines, a small bar chart, so they visibly read as *pages of something*
// even blurred and partially hidden.

function MockPageContent() {
    return (
        <div className="w-full h-full p-4 flex flex-col gap-2.5">
            <div className="w-[55%] h-2 rounded-full bg-[#0E5C3D]/25" />
            <div className="w-[85%] h-1.5 rounded-full bg-[#d8e3dc] mt-1" />
            <div className="w-[70%] h-1.5 rounded-full bg-[#d8e3dc]" />
            <div className="w-[78%] h-1.5 rounded-full bg-[#d8e3dc]" />
            {/* mini bar chart, echoes the real domain-breakdown page */}
            <div className="flex items-end gap-1.5 mt-2 h-10">
                {[0.9, 0.5, 0.7, 0.35, 0.6].map((h, i) => (
                    <div key={i} className="flex-1 rounded-sm bg-[#0E5C3D]/30" style={{ height: `${h * 100}%` }} />
                ))}
            </div>
            <div className="w-[60%] h-1.5 rounded-full bg-[#d8e3dc] mt-2" />
            <div className="w-[90%] h-1.5 rounded-full bg-[#d8e3dc]" />
        </div>
    );
}

const sections = [
    "Executive Summary",
    "Clinical Interpretation",
    "Domain Analysis",
    "Charts & Visual Summary",
    "Recommendations",
    "Lifestyle Strategies",
    "Questions for Your Clinician",
    "Next Steps",
];

export default function ReportPreviewMock({ name }: { name: string }) {
    return (
        <div className="relative max-w-[420px] mx-auto" style={{ perspective: "1200px" }}>
            {/* Stacked pages behind the cover, now with actual mock content
                (not blank rectangles) so they read as real report pages
                peeking out, blurred just enough to be illegible, sharp
                enough to look like substance rather than decoration. */}
            {[3, 2, 1].map((offset) => (
                <div
                    key={offset}
                    className="absolute inset-0 rounded-2xl bg-[#fdfcfa] border border-[#e4e9e5] overflow-hidden"
                    style={{
                        transform: `translate(${offset * 8}px, ${offset * 11}px) rotate(${offset * 1.1}deg)`,
                        filter: "blur(1.25px)",
                        opacity: 0.55 - offset * 0.1,
                        zIndex: 10 - offset,
                    }}
                >
                    <MockPageContent />
                </div>
            ))}

            {/* Foreground: cover page, matches the real PDF's actual cover
                design (see lib/adhd/pdf-report.tsx) so this preview isn't
                just decorative, it's a preview of the exact cover they'll get. */}
            <div
                className="relative rounded-2xl overflow-hidden shadow-[0_24px_70px_rgba(14,92,61,0.25)] border border-[#0E5C3D]/20"
                style={{ zIndex: 20, aspectRatio: "0.72", background: "linear-gradient(155deg, #0E5C3D 0%, #164a37 100%)" }}
            >
                <div className="h-full w-full flex flex-col justify-between p-7 text-white">
                    <div>
                        <p className="font-['Cormorant_Garamond',Georgia,serif] text-[19px] font-semibold">Mentel</p>
                        <p className="text-[8px] tracking-[0.15em] opacity-70 mt-0.5">MENTAL WELLNESS TECHNOLOGY</p>
                    </div>
                    <div>
                        <p className="text-[8.5px] tracking-[0.15em] opacity-80 uppercase mb-2">Educational ADHD Screening Report</p>
                        <p className="font-['Cormorant_Garamond',Georgia,serif] text-[24px] font-light leading-[1.2]">
                            Prepared for {name || "you"}
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="h-px flex-1 bg-white/25" />
                        <span className="text-[7.5px] tracking-[0.1em] opacity-60 ml-3">18+ PAGES</span>
                    </div>
                </div>
            </div>

            {/* Section list beneath, half-legible to create curiosity */}
            <div className="relative mt-6 rounded-2xl border border-[#e4e9e5] bg-white p-5" style={{ zIndex: 20 }}>
                <p className="text-[10.5px] font-semibold tracking-[0.06em] uppercase text-[#4a6a56] mb-3">Inside your report</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {sections.map((s) => (
                        <div key={s} className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-[#2d7a5a] flex-shrink-0" />
                            <span className="text-[12px] text-[#3a4a3e] leading-tight">{s}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
