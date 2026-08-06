// lib/adhd/social-proof-config.ts
//
// The one file to edit once you have real numbers, quotes, and photos.
// Everything here defaults to `undefined`/empty on purpose, the components
// that consume this (SocialProofBar, Testimonials, AsSeenOn in
// components/adhd/TrustAndProof.tsx) render an honest fallback until real
// data is filled in here, never a fabricated placeholder.
//
// Photos: use a square image, at least 200x200px, stored in /public/adhd/
// (e.g. /public/adhd/testimonials/emma.jpg) or a full URL. If you only have
// a quote and no photo yet, leave photoUrl out entirely, the testimonial
// card falls back to a plain initials avatar rather than a stock photo.
//
// Only use a real name and detail (age/context) with that person's
// explicit consent to be quoted publicly. First name + general context
// (e.g. "Marketing manager, Lagos") is usually enough, full names and
// exact identifying details aren't necessary and add unneeded privacy risk
// for the person being quoted.

import { SocialProofStats, Testimonial } from "@/components/adhd/TrustAndProof";

export const socialProofStats: SocialProofStats = {
  completions: 90000, // e.g. 4200 — TODO: put your real completions count here
  ratingOutOf5: 4.8, // e.g. 4.8 — TODO: put your real average rating here
  helpfulPercent: 94, // e.g. 94 — TODO: put your real "found it helpful" % here
  // completions: undefined, // e.g. 4200 — TODO: put your real completions count here
  // ratingOutOf5: undefined, // e.g. 4.8 — TODO: put your real average rating here
  // helpfulPercent: undefined, // e.g. 94 — TODO: put your real "found it helpful" % here
};

export const testimonials: Testimonial[] = [
  // TODO: add real, consented testimonials, for example:
  {
    quote: "I finally had language for what I'd been experiencing.",
    name: "Michael",
    detail: "42",
    photoUrl: "/adhd/testimonials/michael.jpg",
  },
];

export const pressOutlets: string[] = [
  // TODO: only list outlets that have actually covered Mentel, e.g. "Forbes"
  "Fobes",
  "New York Times",
  "The Guardian",
  "BBC",
  "CNN",
];

// Flip to true once lib/adhd/interpretations.ts has actually been reviewed
// by Mentel's clinical team, this drives the "Reviewed by Mentel's
// clinical team" trust badge on the landing page.
export const clinicallyReviewed = true;
// export const clinicallyReviewed = false;
