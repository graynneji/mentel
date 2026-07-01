// "use client";

// // components/cmhc/accordion.tsx — minimal single-open accordion, no dependencies.

// import { useState } from "react";
// import { ChevronDown } from "lucide-react";

// export function Accordion({ items }: { items: { id: string; trigger: React.ReactNode; content: React.ReactNode }[] }) {
//     const [openId, setOpenId] = useState<string | null>(null);

//     return (
//         <div className="max-w-3xl mx-auto divide-y divide-[--color-dark]/10">
//             {items.map((item) => {
//                 const isOpen = openId === item.id;
//                 return (
//                     <div key={item.id}>
//                         <button
//                             onClick={() => setOpenId(isOpen ? null : item.id)}
//                             className="w-full flex items-center justify-between gap-4 py-4 text-left"
//                             aria-expanded={isOpen}
//                         >
//                             <span className="text-[--color-dark] font-medium">{item.trigger}</span>
//                             <ChevronDown
//                                 className={`h-4 w-4 shrink-0 text-[--color-dark]/50 transition-transform ${isOpen ? "rotate-180" : ""}`}
//                             />
//                         </button>
//                         {isOpen && <div className="pb-5 -mt-1">{item.content}</div>}
//                     </div>
//                 );
//             })}
//         </div>
//     );
// }