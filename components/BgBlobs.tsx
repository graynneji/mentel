import Image from "next/image";

export default function BgBlobs() {
    return (
        <>
            <div
                className="fixed inset-0 z-0 pointer-events-none"
                style={{
                    background: `
            radial-gradient(ellipse 80% 60% at 10% 20%, rgba(123,169,139,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 90% 80%, rgba(61,139,139,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 50% 50%, rgba(168,196,176,0.06) 0%, transparent 70%)
          `,
                }}
            />
            <div
                className="fixed z-0 pointer-events-none rounded-full animate-drift-1"
                style={{
                    width: 500, height: 500,
                    background: "var(--sage)",
                    filter: "blur(80px)",
                    opacity: 0.12,
                    top: -100, left: -150,
                }}
            />
            <div
                className="fixed z-0 pointer-events-none rounded-full animate-drift-2"
                style={{
                    width: 400, height: 400,
                    background: "var(--teal)",
                    filter: "blur(80px)",
                    opacity: 0.10,
                    bottom: -80, right: -120,
                }}
            />
            <div
                className="fixed z-0 pointer-events-none rounded-full animate-drift-3"
                style={{
                    width: 300, height: 300,
                    background: "var(--sage-light)",
                    filter: "blur(80px)",
                    opacity: 0.10,
                    top: "40%", left: "60%",
                }}
            />
        </>
    );
}
