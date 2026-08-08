// app/adhd/layout.tsx
//
// Scoped to just the /adhd routes rather than editing the app-wide root
// layout, since this is the only part of the site using fixed
// bottom-of-screen bars that need to account for iOS Safari's address
// bar / bottom toolbar.
//
// Why this is needed: iOS Safari's bottom toolbar can overlap fixed
// `bottom: 0` elements, especially while scrolling toward the top, where
// Safari's chrome expands back into view. The standard fix is padding the
// element with `env(safe-area-inset-bottom)`, but that CSS environment
// variable only has a non-zero value if the page's viewport meta tag
// includes `viewport-fit=cover`. Without this layout, `env(...)` silently
// evaluates to 0 and the padding fix in app/adhd/result/page.tsx's sticky
// bars would do nothing.

import type { Viewport } from "next";

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
};

export default function AdhdLayout({ children }: { children: React.ReactNode }) {
    return children;
}
