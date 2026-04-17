"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookingProvider } from "@/app/context/BookingContext";
import GlobalObserver from "./GlobalObserver";

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

    if (isAdmin || isHr || isEAP || isassessment || isLogin) {
        return <>{children}</>;
    }

    return (
        <>
            <BookingProvider>
                <Navbar />
                <GlobalObserver />
                <main className="flex-1">{children}</main>
                <Footer />
            </BookingProvider>
        </>
    );
}