"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookingProvider } from "@/app/context/BookingContext";

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

    if (isAdmin || isHr || isEAP || isassessment) {
        return <>{children}</>;
    }

    return (
        <>
            <BookingProvider>
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
            </BookingProvider>
        </>
    );
}