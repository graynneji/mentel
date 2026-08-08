

// // components/adhd/ReportPreviewMock.tsx
// //
// // A styled mockup of the report, not a real render of the PDF (the actual
// // PDF is generated server-side by lib/adhd/pdf-report.tsx). This exists
// // purely to make the paywall feel like it's gating a real, substantial
// // document rather than an abstract promise.
// //
// // Previous version: the "pages behind the cover" were empty white
// // rectangles with no content, so at a glance it just read as a plain
// // colored box with a name on it, not a stack of report pages. Fixed by
// // giving the background pages actual mock content, a header bar, paragraph
// // lines, a small bar chart, so they visibly read as *pages of something*
// // even blurred and partially hidden.

// function MockPageContent() {
//     return (
//         <div className="w-full h-full p-4 flex flex-col gap-2.5">
//             <div className="w-[55%] h-2 rounded-full bg-[#0E5C3D]/25" />
//             <div className="w-[85%] h-1.5 rounded-full bg-[#d8e3dc] mt-1" />
//             <div className="w-[70%] h-1.5 rounded-full bg-[#d8e3dc]" />
//             <div className="w-[78%] h-1.5 rounded-full bg-[#d8e3dc]" />
//             {/* mini bar chart, echoes the real domain-breakdown page */}
//             <div className="flex items-end gap-1.5 mt-2 h-10">
//                 {[0.9, 0.5, 0.7, 0.35, 0.6].map((h, i) => (
//                     <div key={i} className="flex-1 rounded-sm bg-[#0E5C3D]/30" style={{ height: `${h * 100}%` }} />
//                 ))}
//             </div>
//             <div className="w-[60%] h-1.5 rounded-full bg-[#d8e3dc] mt-2" />
//             <div className="w-[90%] h-1.5 rounded-full bg-[#d8e3dc]" />
//         </div>
//     );
// }

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
//             {/* Stacked pages behind the cover, now with actual mock content
//                 (not blank rectangles) so they read as real report pages
//                 peeking out, blurred just enough to be illegible, sharp
//                 enough to look like substance rather than decoration. */}
//             {[3, 2, 1].map((offset) => (
//                 <div
//                     key={offset}
//                     className="absolute inset-0 rounded-2xl bg-[#fdfcfa] border border-[#e4e9e5] overflow-hidden"
//                     style={{
//                         transform: `translate(${offset * 8}px, ${offset * 11}px) rotate(${offset * 1.1}deg)`,
//                         filter: "blur(1.25px)",
//                         opacity: 0.55 - offset * 0.1,
//                         zIndex: 10 - offset,
//                     }}
//                 >
//                     <MockPageContent />
//                 </div>
//             ))}

//             {/* Foreground: cover page, matches the real PDF's actual cover
//                 design (see lib/adhd/pdf-report.tsx) so this preview isn't
//                 just decorative, it's a preview of the exact cover they'll get. */}
//             <div
//                 className="relative rounded-2xl overflow-hidden shadow-[0_24px_70px_rgba(14,92,61,0.25)] border border-[#0E5C3D]/20"
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
//                     <div className="flex items-center justify-between">
//                         <div className="h-px flex-1 bg-white/25" />
//                         <span className="text-[7.5px] tracking-[0.1em] opacity-60 ml-3">18+ PAGES</span>
//                     </div>
//                 </div>
//             </div>

//             {/* Section list beneath, half-legible to create curiosity */}
//             <div className="relative mt-6 rounded-2xl border border-[#e4e9e5] bg-white p-5" style={{ zIndex: 20 }}>
//                 <p className="text-[10.5px] font-semibold tracking-[0.06em] uppercase text-[#4a6a56] mb-3">Inside your report</p>
//                 <div className="grid grid-cols-2 gap-x-4 gap-y-2">
//                     {sections.map((s) => (
//                         <div key={s} className="flex items-center gap-1.5">
//                             <span className="w-1 h-1 rounded-full bg-[#2d7a5a] flex-shrink-0" />
//                             <span className="text-[12px] text-[#3a4a3e] leading-tight">{s}</span>
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
// v3: the foreground page now mirrors the PDF's actual "Domain Analysis"
// page (traffic-light bars + severity table, see page 8 of
// lib/adhd/pdf-report.tsx), using the person's real domain scores, rather
// than a title-card cover. A cover page is mostly a color field and a
// name, on its own it still reads as "a colored rectangle", it doesn't
// demonstrate there's substantial content behind it. Showing an actual
// data page does.

import { AssessmentResult } from "@/lib/adhd/scoring";
import { bandCopy } from "@/lib/adhd/scoring";

function MockTextPage() {
    return (
        <div className="w-full h-full p-4 flex flex-col gap-2.5">
            <div className="w-[55%] h-2 rounded-full bg-[#0E5C3D]/25" />
            <div className="w-[85%] h-1.5 rounded-full bg-[#d8e3dc] mt-1" />
            <div className="w-[70%] h-1.5 rounded-full bg-[#d8e3dc]" />
            <div className="w-[78%] h-1.5 rounded-full bg-[#d8e3dc]" />
            <div className="w-[60%] h-1.5 rounded-full bg-[#d8e3dc] mt-2" />
            <div className="w-[90%] h-1.5 rounded-full bg-[#d8e3dc]" />
            <div className="w-[65%] h-1.5 rounded-full bg-[#d8e3dc]" />
        </div>
    );
}

const sections = [
    "Score Dashboard",
    "Your Profile",
    "Clinical Interpretation",
    "Domain Analysis",
    "Executive Function Chart",
    "Action Plan",
    "Questions for Your Clinician",
    "Next Steps",
];

export default function ReportPreviewMock({ name, result }: { name: string; result: AssessmentResult }) {
    // Only the first 5 domains fit comfortably in the mockup's card height,
    // that's fine, the point is to look like a real page, not to duplicate
    // the full breakdown that's already shown elsewhere on this page.
    const previewDomains = result.domainResults.slice(0, 5);

    return (
        <div className="relative max-w-[420px] mx-auto" style={{ perspective: "1200px" }}>
            {/* Stacked pages behind, blurred, hinting at more content past
                the one page shown sharp in front. */}
            {[3, 2, 1].map((offset) => (
                <div
                    key={offset}
                    className="absolute inset-0 rounded-2xl bg-[#fdfcfa] border border-[#e4e9e5] overflow-hidden"
                    style={{
                        transform: `translate(${offset * 8}px, ${offset * 11}px) rotate(${offset * 1.1}deg)`,
                        filter: "blur(1.25px)",
                        opacity: 0.5 - offset * 0.1,
                        zIndex: 10 - offset,
                    }}
                >
                    <MockTextPage />
                </div>
            ))}

            {/* Foreground: a real page from the report, not the cover. This
                mirrors lib/adhd/pdf-report.tsx's "Domain Analysis" page
                (page 8), using this person's actual domain scores, so it
                reads as "here's a real page of your real report" rather
                than generic decoration. */}
            <div
                className="relative rounded-2xl overflow-hidden shadow-[0_24px_70px_rgba(28,40,36,0.18)] border border-[#e4e9e5] bg-white"
                style={{ zIndex: 20, aspectRatio: "0.72" }}
            >
                <div className="h-full w-full p-6 flex flex-col"
                    style={{
                        filter: "blur(1.5px)",
                        transform: "scale(1.015)",
                    }}>
                    <p className="text-[7.5px] font-semibold tracking-[0.14em] uppercase text-[#0E5C3D] mb-1">Domain Analysis</p>
                    <p className="font-['Cormorant_Garamond',Georgia,serif] text-[17px] font-light text-[#1c2820] mb-4">
                        Symptom domain overview
                    </p>

                    <div className="flex flex-col gap-3 flex-1">
                        {previewDomains.map((d) => {
                            const c = bandCopy[d.band];
                            return (
                                <div key={d.domain}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[8px] text-[#1c2820]">{d.label}</span>
                                        <span className="text-[7.5px] font-semibold" style={{ color: c.color }}>{d.percent}%</span>
                                    </div>
                                    <div className="h-[4px] rounded-full bg-[#eef2ee] overflow-hidden">
                                        <div className="h-full rounded-full" style={{ width: `${d.percent}%`, background: c.fill }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#e4e9e5] flex items-center justify-between">
                        <span className="text-[7px] text-[#6a7a6e]">Prepared for {name || "you"}</span>
                        <span className="text-[7px] text-[#6a7a6e]">Page 8 of 15</span>
                    </div>
                </div>
            </div>

            {/* Section list beneath */}
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
