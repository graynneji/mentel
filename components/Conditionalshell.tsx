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

    if (isAdmin) {
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