// app/not-found.tsx
import Link from "next/link";
import { Leaf, ArrowLeft, Search, Compass } from "lucide-react";

export default function NotFound() {
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
                    <Compass size={26} style={{ color: "var(--sage-dark)" }} />
                </div>

                {/* 404 */}
                <p
                    className="font-cormorant font-light mb-3"
                    style={{ fontSize: "clamp(64px, 18vw, 96px)", lineHeight: 1, color: "var(--deep)", letterSpacing: "-0.03em" }}
                >
                    404
                </p>

                <h1
                    className="font-cormorant text-2xl sm:text-3xl font-semibold mb-3"
                    style={{ color: "var(--deep)" }}
                >
                    This page took a different path
                </h1>

                <p className="text-sm leading-relaxed mb-9 max-w-xs mx-auto" style={{ color: "var(--text-muted)" }}>
                    The page you&apos;re looking for doesn&apos;t exist or may have moved.
                    Let&apos;s get you back on track.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 text-white font-medium rounded-full transition-all hover:-translate-y-0.5 hover:shadow-xl duration-200 w-full sm:w-auto"
                        style={{
                            background: "linear-gradient(135deg, var(--sage-dark), var(--teal))",
                            padding: "14px 28px",
                            fontSize: 14,
                            boxShadow: "0 4px 20px rgba(61,139,139,0.25)",
                        }}
                    >
                        <ArrowLeft size={15} />
                        Back to home
                    </Link>
                    <Link
                        href="/articles"
                        className="inline-flex items-center justify-center gap-2 font-medium rounded-full border transition-all hover:-translate-y-0.5 duration-200 w-full sm:w-auto"
                        style={{
                            padding: "13px 28px",
                            fontSize: 14,
                            color: "var(--sage-dark)",
                            borderColor: "rgba(123,169,139,0.28)",
                            background: "white",
                        }}
                    >
                        <Search size={14} />
                        Browse articles
                    </Link>
                </div>
            </div>
        </div>
    );
}