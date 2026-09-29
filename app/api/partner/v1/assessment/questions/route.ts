// app/api/partner/v1/assessment/questions/route.ts
//
// GET: the actual clinical question bank, for partners who want to render
// their OWN native assessment UI instead of using Mentel's hosted flow (see
// docs/partner-api/README.md — "Two ways to run the assessment"). Answer
// each question with the `value` of the option the beneficiary picked, then
// POST { answers: { [questionId]: value } } to
// /beneficiaries/{externalRef}/assessments.
//
// Reuses lib/eap-questions.ts — the same bank the internal app/eap/assessment
// page renders — so a partner building their own UI and Mentel's own UI can
// never drift out of sync with the scoring engine in lib/eap-scoring.ts.

import { NextResponse } from "next/server";
import { withPartnerAuth } from "@/lib/partner/with-auth";
import { ALL_QUESTIONS, DOMAIN_LABELS } from "@/lib/eap-questions";

export const GET = withPartnerAuth(async () => {
  return NextResponse.json({
    success: true,
    domains: DOMAIN_LABELS,
    questions: ALL_QUESTIONS.map((q) => ({
      id: q.id,
      domain: q.domain,
      text: q.text,
      subtext: q.subtext ?? null,
      options: q.options.map((o) => ({ value: o.value, label: o.label })),
      conditional: q.conditional ?? null,
      conditionalMin: q.conditionalMin ?? null,
    })),
  });
});
