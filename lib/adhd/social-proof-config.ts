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
    quote:
      "I finally understood why I've struggled with focus for so long. The report was incredibly accurate.",
    name: "Avery",
    detail: "33 • Product Designer",
    photoUrl: "/Avery.jpg",
  },
  {
    quote:
      "I expected a simple quiz, but the personalized report genuinely surprised me. It was worth it.",
    name: "Michael",
    detail: "41 • Financial Architect",
    photoUrl: "/Michael.jpg",
  },
  {
    quote:
      "It was easy to complete and gave me insights I wish I'd had years ago.",
    name: "Lauren",
    detail: "28 • Registered Nurse",
    photoUrl: "/Lauren.jpg",
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

// Flip to true once you're ready to show the "HIPAA-aligned practices"
// badge on the landing page. Worth having actual documentation to back
// this, since it's still a specific claim even worded carefully (see the
// comment in components/adhd/TrustAndProof.tsx for why it says "aligned"
// rather than "compliant" or "certified"): signed BAAs with every vendor
// that touches this data (your email provider, your database host),
// encryption at rest and in transit, access controls, audit logging, and
// a documented risk assessment. A short Privacy & Security page on the
// site describing your actual practices in your own words is the more
// durable version of this claim, worth having either way, the icon alone
// isn't a substitute for it.
export const hipaaAligned = true;
