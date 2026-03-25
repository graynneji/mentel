"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface BookingContextValue {
    showForm: boolean;
    openBooking: () => void;
    closeBooking: () => void;
}

const BookingContext = createContext<BookingContextValue>({
    showForm: false,
    openBooking: () => { },
    closeBooking: () => { },
});

export function BookingProvider({ children }: { children: ReactNode }) {
    const [showForm, setShowForm] = useState(false);

    const openBooking = useCallback(() => {
        setShowForm(true);
        // Small delay so state sets before scroll, ensuring the panel is rendered
        setTimeout(() => {
            document.getElementById("hero-panel")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 50);
    }, []);

    const closeBooking = useCallback(() => {
        setShowForm(false);
    }, []);

    return (
        <BookingContext.Provider value={{ showForm, openBooking, closeBooking }}>
            {children}
        </BookingContext.Provider>
    );
}

export function useBooking() {
    return useContext(BookingContext);
}