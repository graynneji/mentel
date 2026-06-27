"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { initAnalytics, trackRouteChange } from "@/lib/analytics/client";
import { RemoteActionHandler } from "./RemoteActionHandler";

/**
 * Mount this once in app/layout.tsx, inside <body>:
 *
 *   <AnalyticsProvider userId={user?.id ?? null}>
 *     {children}
 *   </AnalyticsProvider>
 *
 * Pass your Supabase auth user id (or null if logged out) so events can be
 * tied to a real user once someone signs in.
 */
export function AnalyticsProvider({
  userId = null,
  children,
}: {
  userId?: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hasMounted = useRef(false);

  useEffect(() => {
    initAnalytics(userId);
  }, [userId]);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return; // initAnalytics already fired the first PAGE_VIEW
    }
    trackRouteChange();
  }, [pathname]);

  return (
    <>
      {children}
      <RemoteActionHandler />
    </>
  );
}
