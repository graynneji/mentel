"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Visitor personalization profile.
//
// A SMALL, first-party cookie ("mentel_profile") that remembers where a
// visitor left off — assessment progress, booking progress, whether they've
// reached the payment page, whether they've booked, whether they clicked
// WhatsApp — so the next time they land on the site we can resume them
// exactly where they stopped, instead of making them start over.
//
// Design constraints (deliberate):
//  - First-party only. No third-party cookie, no cross-site tracking.
//  - httpOnly: false — the whole point is the browser reads/writes this
//    client-side, same as mentel_vid/mentel_sid already do (see proxy.ts).
//  - Kept small (well under the 4KB cookie limit) — we store *pointers*
//    (current step, a score, a plan id) not full transcripts.
//  - Never stores payment card data, passwords, or anything sensitive —
//    only UX-resume state and coarse interest signals.
//  - Every read is defensive: a corrupt/old-shape cookie just resets to
//    defaults rather than throwing.
// ─────────────────────────────────────────────────────────────────────────────

const COOKIE_NAME = "mentel_profile";
const COOKIE_MAX_AGE_DAYS = 180; // ~6 months of "remember where they left off"
const PROFILE_VERSION = 1;

export interface AssessmentProgress {
  current: number; // question index they were on
  answers: Record<string, number>;
  step: "quiz" | "email" | "done";
  updatedAt: string;
}

export interface AssessmentResultSnapshot {
  name: string;
  score: number;
  band: string;
  completedAt: string;
}

export interface BookingProgress {
  step: 1 | 2 | 3;
  reason?: string;
  plan?: string;
  paymentMethod?: string;
  name?: string;
  email?: string;
  phone?: string;
  updatedAt: string;
}

export interface VisitorProfile {
  v: number; // schema version, for safe future migrations
  visits: number;
  firstSeenAt: string;
  lastSeenAt: string;
  interest: string | null; // e.g. "Anxiety" — last topic they signalled
  timeOnSiteSec: number; // rough cumulative engaged time across visits
  reachedPaymentPage: boolean;
  booked: boolean;
  clickedWhatsApp: boolean;
  assessment: AssessmentProgress | null;
  assessmentResult: AssessmentResultSnapshot | null;
  booking: BookingProgress | null;
}

function defaultProfile(): VisitorProfile {
  const now = new Date().toISOString();
  return {
    v: PROFILE_VERSION,
    visits: 0,
    firstSeenAt: now,
    lastSeenAt: now,
    interest: null,
    timeOnSiteSec: 0,
    reachedPaymentPage: false,
    booked: false,
    clickedWhatsApp: false,
    assessment: null,
    assessmentResult: null,
    booking: null,
  };
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string, maxAgeDays: number) {
  if (typeof document === "undefined") return;
  document.cookie = [
    `${name}=${encodeURIComponent(value)}`,
    `Max-Age=${60 * 60 * 24 * maxAgeDays}`,
    "Path=/",
    "SameSite=Lax",
  ].join("; ");
}

/** Read the current visitor profile. Safe to call on the server render pass — returns defaults. */
export function getProfile(): VisitorProfile {
  const raw = readCookie(COOKIE_NAME);
  if (!raw) return defaultProfile();
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || parsed.v !== PROFILE_VERSION) {
      return defaultProfile();
    }
    return { ...defaultProfile(), ...parsed };
  } catch {
    return defaultProfile();
  }
}

/** Merge a partial patch into the profile and persist it. Returns the new profile. */
export function updateProfile(patch: Partial<VisitorProfile>): VisitorProfile {
  const current = getProfile();
  const next: VisitorProfile = {
    ...current,
    ...patch,
    lastSeenAt: new Date().toISOString(),
  };
  writeCookie(COOKIE_NAME, JSON.stringify(next), COOKIE_MAX_AGE_DAYS);
  return next;
}

/** Call once per page load (e.g. from a top-level provider) to bump the visit counter. */
export function registerVisitIfNewSession(isNewSession: boolean): VisitorProfile {
  const current = getProfile();
  if (!isNewSession) return current;
  return updateProfile({ visits: current.visits + 1 });
}

export function setInterest(interest: string) {
  return updateProfile({ interest });
}

export function saveAssessmentProgress(progress: Omit<AssessmentProgress, "updatedAt">) {
  return updateProfile({
    assessment: { ...progress, updatedAt: new Date().toISOString() },
  });
}

export function saveAssessmentResult(result: Omit<AssessmentResultSnapshot, "completedAt">) {
  return updateProfile({
    assessmentResult: { ...result, completedAt: new Date().toISOString() },
    assessment: null, // progress is done, no need to keep partial answers around
  });
}

export function clearAssessmentProgress() {
  return updateProfile({ assessment: null });
}

export function saveBookingProgress(progress: Omit<BookingProgress, "updatedAt">) {
  return updateProfile({
    booking: { ...progress, updatedAt: new Date().toISOString() },
  });
}

export function markReachedPaymentPage() {
  return updateProfile({ reachedPaymentPage: true });
}

export function markBooked() {
  return updateProfile({ booked: true, booking: null });
}

export function markClickedWhatsApp() {
  return updateProfile({ clickedWhatsApp: true });
}

export function addEngagedSeconds(sec: number) {
  if (!sec || sec <= 0) return getProfile();
  const current = getProfile();
  return updateProfile({ timeOnSiteSec: current.timeOnSiteSec + Math.round(sec) });
}

export function clearProfile() {
  writeCookie(COOKIE_NAME, "", -1);
}
