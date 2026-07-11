"use client";

import { useEffect } from "react";

// Hardcoded, absolute — deliberately NOT a relative path. If someone
// copies the rendered HTML/JS wholesale and hosts it on another domain,
// this still points back at the real site, so the request still fires
// from wherever the copy is running.
const INTEGRITY_ENDPOINT = "https://www.trymentel.com/api/integrity-check";

export default function IntegrityBeacon() {
    useEffect(() => {
        if (typeof window === "undefined") return;

        // Once per browser session is plenty — this only needs to catch
        // "is this domain legitimate," not track every page view.
        const key = "mentel_integrity_pinged";
        if (sessionStorage.getItem(key)) return;
        sessionStorage.setItem(key, "1");

        fetch(INTEGRITY_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                host: window.location.hostname,
                url: window.location.href,
            }),
            // Don't let this ever block or slow down the real page.
            keepalive: true,
        }).catch(() => {
            /* silent — this must never surface an error to a real visitor */
        });
    }, []);

    return null;
}
