import BookCallContent from "@/components/BookCallContent";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

function LoadingScreen() {
    return (
        <div className="relative min-h-screen">
            <section className="relative z-10 pt-32 pb-20 px-4 sm:px-6">
                <div className="max-w-md mx-auto text-center animate-fade-up">
                    <div
                        className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, var(--sage), var(--teal))" }}
                    >
                        <Loader2 size={28} color="white" className="animate-spin" />
                    </div>
                    <h2 className="font-cormorant text-3xl font-light mb-3" style={{ color: "var(--deep)" }}>
                        Loading your calendar
                    </h2>
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                        Setting up your booking session…
                    </p>
                </div>
            </section>
        </div>
    );
}

export default function BookCallPage() {
    return (
        <Suspense fallback={<LoadingScreen />}>
            <BookCallContent />
        </Suspense>
    );
}