"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, X } from "lucide-react";
import { useVisitorProfile } from "@/hooks/use-visitor-profile";

/**
 * Shows a small, dismissible banner to returning visitors pointing them
 * straight back to whatever they left unfinished — a result, a half-done
 * assessment, or a booking that stalled at the payment step. Renders
 * nothing for first-time visitors or once everything is complete.
 *
 * Priority order (most specific/valuable first):
 *   1. Has an assessment result → show the result
 *   2. Reached payment page but hasn't booked → resume booking
 *   3. Mid-assessment, hasn't finished → resume assessment
 */
export default function ResumeBanner() {
  const { profile, hydrated } = useVisitorProfile();
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);

  const cta = useMemo(() => {
    if (!profile) return null;
    if (profile.assessmentResult) {
      return {
        href: "/assessment/result",
        title: `Welcome back${profile.assessmentResult.name ? `, ${profile.assessmentResult.name.split(" ")[0]}` : ""}`,
        body: "Your wellness results are ready to view.",
        label: "See your results",
      };
    }
    if (profile.reachedPaymentPage && !profile.booked) {
      return {
        href: "/",
        title: "Pick up where you left off",
        body: "You were almost done booking your session.",
        label: "Continue booking",
      };
    }
    if (profile.assessment && profile.assessment.step !== "done") {
      return {
        href: "/assessment",
        title: "Continue your assessment",
        body: `You were on question ${profile.assessment.current + 1} — it only takes a minute to finish.`,
        label: "Continue assessment",
      };
    }
    return null;
  }, [profile]);

  // Don't show on the pages the banner would just be pointing back to —
  // those pages already handle their own in-place resume.
  const suppressedOn = ["/assessment", "/book-call", "/verify"];
  const isSuppressed = suppressedOn.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (!hydrated || !cta || dismissed || isSuppressed) return null;

  return (
    <div
      className="w-full px-4 py-3 flex items-center justify-center gap-3 flex-wrap text-center"
      style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
    >
      <span className="text-white text-sm font-medium">{cta.title} — {cta.body}</span>
      <Link
        href={cta.href}
        className="inline-flex items-center gap-1 text-sm font-semibold bg-white rounded-full px-4 py-1.5 hover:opacity-90 transition-opacity"
        style={{ color: "var(--sage-dark)" }}
      >
        {cta.label}
        <ArrowRight size={14} strokeWidth={2.5} />
      </Link>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => setDismissed(true)}
        className="text-white/80 hover:text-white transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
}
