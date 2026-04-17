// "use client";

// import { useEffect, useRef } from "react";
// import { usePathname } from "next/navigation";
// import { logger } from "@/lib/logger";

// export default function GlobalObserver() {
//     const pathname = usePathname();
//     const start = useRef<number>(Date.now());

//     // PAGE TRACKING
//     useEffect(() => {
//         start.current = Date.now();

//         logger.info("PAGE_VIEW");

//         return () => {
//             const duration = Date.now() - start.current;

//             logger.info("PAGE_DURATION");
//         };
//     }, [pathname]);

//     // GLOBAL ERROR TRACKING
//     useEffect(() => {
//         const onError = (e: ErrorEvent) => {
//             logger.error("CLIENT_ERROR");
//         };

//         const onRejection = (e: PromiseRejectionEvent) => {
//             logger.error("PROMISE_REJECTION");
//         };

//         window.addEventListener("error", onError);
//         window.addEventListener("unhandledrejection", onRejection);

//         return () => {
//             window.removeEventListener("error", onError);
//             window.removeEventListener("unhandledrejection", onRejection);
//         };
//     }, []);

//     return null;
// }

"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { logger } from "@/lib/logger";

export default function GlobalObserver() {
    const pathname = usePathname();
    const start = useRef<number>(Date.now());

    // PAGE TRACKING
    useEffect(() => {
        start.current = Date.now();

        logger.info("PAGE_VIEW", { route: pathname });

        return () => {
            const duration = Date.now() - start.current;

            logger.info("PAGE_DURATION", {
                route: pathname,
                duration,
            });
        };
    }, [pathname]);

    // GLOBAL ERROR TRACKING
    useEffect(() => {
        const onError = (e: ErrorEvent) => {
            logger.error("CLIENT_ERROR", {
                message: e.message,
                file: e.filename,
                line: e.lineno,
            });
        };

        const onRejection = (e: PromiseRejectionEvent) => {
            logger.error("PROMISE_REJECTION", {
                reason: String(e.reason),
            });
        };

        window.addEventListener("error", onError);
        window.addEventListener("unhandledrejection", onRejection);

        return () => {
            window.removeEventListener("error", onError);
            window.removeEventListener("unhandledrejection", onRejection);
        };
    }, []);

    return null;
}