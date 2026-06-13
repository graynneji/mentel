// app/error.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Leaf, RefreshCw, ArrowLeft, AlertCircle } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div
            className="min-h-screen flex items-center justify-center px-6"
            style={{ background: "linear-gradient(180deg, #FBFAF6 0%, #F2F7F3 55%, #ECF4EF 100%)" }}
        >
            <div className="w-full max-w-md text-center">
                {/* Brand mark */}
                <div className="inline-flex items-center gap-2 mb-10">
                    <Leaf size={18} style={{ color: "var(--sage)" }} />
                    <span className="font-cormorant text-lg font-semibold" style={{ color: "var(--deep)" }}>
                        Mindful Space
                    </span>
                </div>

                {/* Icon */}
                <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-7"
                    style={{ background: "rgba(123,169,139,0.10)" }}
                >
                    <AlertCircle size={26} style={{ color: "var(--sage-dark)" }} />
                </div>

                <h1
                    className="font-cormorant text-2xl sm:text-3xl font-semibold mb-3"
                    style={{ color: "var(--deep)" }}
                >
                    Something went wrong
                </h1>

                <p className="text-sm leading-relaxed mb-9 max-w-xs mx-auto" style={{ color: "var(--text-muted)" }}>
                    We hit an unexpected snag on our end. Nothing&apos;s wrong with you,
                    just try again or head back home.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                        onClick={() => reset()}
                        className="inline-flex items-center justify-center gap-2 text-white font-medium rounded-full transition-all hover:-translate-y-0.5 hover:shadow-xl duration-200 w-full sm:w-auto cursor-pointer"
                        style={{
                            background: "linear-gradient(135deg, var(--sage-dark), var(--teal))",
                            padding: "14px 28px",
                            fontSize: 14,
                            boxShadow: "0 4px 20px rgba(61,139,139,0.25)",
                            border: "none",
                        }}
                    >
                        <RefreshCw size={15} />
                        Try again
                    </button>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 font-medium rounded-full border transition-all hover:-translate-y-0.5 duration-200 w-full sm:w-auto"
                        style={{
                            padding: "13px 28px",
                            fontSize: 14,
                            color: "var(--sage-dark)",
                            borderColor: "rgba(123,169,139,0.28)",
                            background: "white",
                        }}
                    >
                        <ArrowLeft size={14} />
                        Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}