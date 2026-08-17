
// "use client";

// import { usePathname } from "next/navigation";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import { BookingProvider } from "@/app/context/BookingContext";
// import GlobalObserver from "./GlobalObserver";
// import { AnalyticsProvider } from "./AnalyticsProvider";
// import ResumeBanner from "./personalization/ResumeBanner";

// export default function ConditionalShell({
//     children,
// }: {
//     children: React.ReactNode;
// }) {
//     const pathname = usePathname();
//     const isAdmin = pathname.startsWith("/admin");
//     const isHr = pathname.startsWith("/hr");
//     const isEAP = pathname.startsWith("/eap/");
//     const isassessment = pathname.startsWith("/assessment");
//     const isLogin = pathname.startsWith("/login");
//     const isResult = pathname.startsWith("/result");
//     const isBookCall = pathname.startsWith("/book-call");
//     const isBurnoutCalculator = pathname.startsWith("/burnout-calculator");
//     const isMarketing = pathname.startsWith("/marketing");

//     if (isAdmin || isHr || isEAP || isassessment || isLogin || isResult || isBookCall || isBurnoutCalculator || isMarketing) {
//         return <>{children}</>;
//     }

//     return (
//         <>
//             <AnalyticsProvider>
//                 <BookingProvider>
//                     <Navbar />
//                     {/* <ResumeBanner /> */}
//                     <GlobalObserver />
//                     <main className="flex-1">{children}</main>
//                     <Footer />
//                 </BookingProvider>
//             </AnalyticsProvider>
//         </>
//     );
// }
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookingProvider } from "@/app/context/BookingContext";
import GlobalObserver from "./GlobalObserver";
import { AnalyticsProvider } from "./AnalyticsProvider";
// import ResumeBanner from "./personalization/ResumeBanner";

export default function ConditionalShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith("/admin");
    const isHr = pathname.startsWith("/hr");
    const isEAP = pathname.startsWith("/eap/");
    const isassessment = pathname.startsWith("/assessment");
    const isLogin = pathname.startsWith("/login");
    const isResult = pathname.startsWith("/result");
    const isBookCall = pathname.startsWith("/book-call");
    const isBurnoutCalculator = pathname.startsWith("/burnout-calculator");
    const isMarketing = pathname.startsWith("/marketing");
    const isVolunteerVerification = pathname.startsWith("/volunteer/verification");
    const isADHD = pathname.startsWith("/adhd-assessment");

    if (isAdmin || isHr || isEAP || isassessment || isLogin || isResult || isBookCall || isBurnoutCalculator || isMarketing || isVolunteerVerification || isADHD) {
        return <>{children}</>;
    }

    return (
        <>
            {/* <AnalyticsProvider> */}
            <BookingProvider>
                <Navbar />
                {/* <ResumeBanner /> */}
                <GlobalObserver />
                <main className="flex-1">{children}</main>
                <Footer />
            </BookingProvider>
            {/* </AnalyticsProvider> */}
        </>
    );
}