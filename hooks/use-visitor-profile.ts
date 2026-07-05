"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getProfile,
  updateProfile,
  registerVisitIfNewSession,
  type VisitorProfile,
} from "@/lib/personalization/profile";

/**
 * Client-only hook exposing the visitor's personalization profile.
 * `hydrated` flips to true after the first client render so callers can
 * avoid a server/client mismatch flash (cookies aren't available during SSR).
 */
export function useVisitorProfile() {
  const [profile, setProfileState] = useState<VisitorProfile | null>(() => {
    if (typeof window === "undefined") return null;

    const isNewSession = !sessionStorage.getItem("mentel_session_counted");
    if (isNewSession) sessionStorage.setItem("mentel_session_counted", "1");

    return registerVisitIfNewSession(isNewSession);
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const handle = window.requestAnimationFrame(() => {
      setHydrated(true);
    });

    return () => window.cancelAnimationFrame(handle);
  }, []);

  const patch = useCallback((p: Partial<VisitorProfile>) => {
    setProfileState(updateProfile(p));
  }, []);

  const refresh = useCallback(() => {
    setProfileState(getProfile());
  }, []);

  return { profile, hydrated, patch, refresh };
}
