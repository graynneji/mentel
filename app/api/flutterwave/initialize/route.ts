// // app/api/flutterwave/initialize/route.ts
// //
// // Mints a tx_ref and returns the AUTHORITATIVE amount for a plan. The
// // client-side FlutterwaveCheckout component never decides the charge
// // amount — it only sends a plan key and gets back what to actually charge.
// // This mirrors the Paystack initialize route's trust boundary.

// import { NextResponse } from "next/server";
// import { withRateLimit } from "@/lib/withRateLimit";
// import {
//   ADHD_PLANS,
//   ADHD_PLAN_CURRENCY,
//   resolveAdhdPlan,
// } from "@/lib/payments/adhd-plans";
// import { db } from "@/lib/db";

// function s(v: unknown) {
//   return String(v ?? "").trim();
// }

// export async function POST_HANDLER(req: Request) {
//   try {
//     const body = await req.json();
//     const planKey = s(body.planKey);
//     const leadId = s(body.leadId);
//     const customer = body.customer ?? {};
//     const name = s(customer.name);
//     const email = s(customer.email);
//     const phone = s(customer.phone);

//     // console.log(
//     //   `[adhd-initialize] planKey=${planKey} leadId=${leadId || "(empty)"} email=${email}`,
//     // );

//     const errors: Record<string, string> = {};
//     if (!name || name.length < 2) errors.name = "Please enter your full name.";
//     if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
//       errors.email = "Please enter a valid email address.";
//     if (!ADHD_PLANS[planKey]) errors.plan = "Invalid plan selected.";
//     if (Object.keys(errors).length > 0) {
//       return NextResponse.json(
//         { success: false, error: Object.values(errors)[0], errors },
//         { status: 400 },
//       );
//     }

//     const plan = resolveAdhdPlan(planKey);
//     const txRef = `MENTEL-ADHD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

//     // Attach this tx_ref to the lead row created back at the email-capture
//     // step (see app/api/adhd/lead/route.ts), so the webhook, the
//     // redirect-verify call, and the PDF route can all resolve the same
//     // record by tx_ref alone, regardless of whether the visitor's
//     // sessionStorage survived the payment redirect.
//     //
//     // Previous version: this only tried `leadId`, and silently swallowed
//     // any failure (leadId missing, update throwing, anything), so it could
//     // fail with zero trace, checkout would proceed normally and nobody
//     // would know the row never got its tx_ref. Fixed with a real fallback:
//     // if the leadId path doesn't work for any reason, fall back to finding
//     // the most recent un-paid lead for this email and attaching there
//     // instead, and log loudly (not just console.error into the void) if
//     // even that comes up empty, so this is actually diagnosable from
//     // server logs instead of a silent no-op.
//     const attachData = {
//       txRef,
//       planKey: plan.key,
//       amountCents: Math.round(plan.amountUSD * 100),
//       currency: ADHD_PLAN_CURRENCY,
//       status: "pending_payment",
//     };

//     let attached = false;

//     if (leadId) {
//       try {
//         await db.adhdAssessmentLead.update({
//           where: { id: leadId },
//           data: attachData,
//         });
//         attached = true;
//       } catch (dbError) {
//         console.error(
//           `[adhd-initialize] Update by leadId "${leadId}" failed, falling back to email lookup:`,
//           dbError,
//         );
//       }
//     }

//     if (!attached) {
//       try {
//         const fallbackLead = await db.adhdAssessmentLead.findFirst({
//           where: { email, status: "lead" },
//           orderBy: { createdAt: "desc" },
//         });
//         if (fallbackLead) {
//           await db.adhdAssessmentLead.update({
//             where: { id: fallbackLead.id },
//             data: attachData,
//           });
//           attached = true;
//         }
//       } catch (dbError) {
//         console.error(
//           `[adhd-initialize] Fallback update by email "${email}" also failed:`,
//           dbError,
//         );
//       }
//     }

//     if (!attached) {
//       // This should now be rare (both paths have to fail), but if it
//       // happens, it needs to be loud and searchable in logs, not a single
//       // buried console.error, this is the exact class of bug that produced
//       // "status stayed lead, tx_ref null" with no trace of why.
//       console.error(
//         `[adhd-initialize] COULD NOT ATTACH tx_ref=${txRef} to any lead for email=${email}, leadId=${leadId || "(none provided)"}. This payment will verify against Flutterwave fine, but won't show up correctly in the admin log or trigger the report email until manually reconciled by tx_ref.`,
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       txRef,
//       amountUSD: plan.amountUSD,
//       currency: ADHD_PLAN_CURRENCY,
//       planLabel: plan.label,
//     });
//   } catch (error) {
//     console.error("Flutterwave initialize error:", error);
//     return NextResponse.json(
//       { success: false, error: "Server error. Please try again." },
//       { status: 500 },
//     );
//   }
// }

// export const POST = withRateLimit(POST_HANDLER);

// app/api/flutterwave/initialize/route.ts
//
// Mints a tx_ref and returns the AUTHORITATIVE amount for a plan. The
// client-side FlutterwaveCheckout component never decides the charge
// amount — it only sends a plan key and gets back what to actually charge.
// This mirrors the Paystack initialize route's trust boundary.

import { NextResponse } from "next/server";
import { withRateLimit } from "@/lib/withRateLimit";
import {
  ADHD_PLANS,
  ADHD_PLAN_CURRENCY,
  resolveAdhdPlan,
} from "@/lib/payments/adhd-plans";
import { db } from "@/lib/db";

function s(v: unknown) {
  return String(v ?? "").trim();
}

export async function POST_HANDLER(req: Request) {
  try {
    const body = await req.json();
    const planKey = s(body.planKey);
    const leadId = s(body.leadId);
    const customer = body.customer ?? {};
    const name = s(customer.name);
    const email = s(customer.email);
    const phone = s(customer.phone);

    console.log(
      `[adhd-initialize] planKey=${planKey} leadId=${leadId || "(empty)"} email=${email}`,
    );

    const errors: Record<string, string> = {};
    if (!name || name.length < 2) errors.name = "Please enter your full name.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Please enter a valid email address.";
    if (!ADHD_PLANS[planKey]) errors.plan = "Invalid plan selected.";
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { success: false, error: Object.values(errors)[0], errors },
        { status: 400 },
      );
    }

    const plan = resolveAdhdPlan(planKey);
    const txRef = `MENTEL-ADHD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

    // Attach this tx_ref to the lead row created back at the email-capture
    // step (see app/api/adhd/lead/route.ts), so the webhook, the
    // redirect-verify call, and the PDF route can all resolve the same
    // record by tx_ref alone, regardless of whether the visitor's
    // sessionStorage survived the payment redirect.
    //
    // Previous version: this only tried `leadId`, and silently swallowed
    // any failure (leadId missing, update throwing, anything), so it could
    // fail with zero trace, checkout would proceed normally and nobody
    // would know the row never got its tx_ref. Fixed with a real fallback:
    // if the leadId path doesn't work for any reason, fall back to finding
    // the most recent un-paid lead for this email and attaching there
    // instead, and log loudly (not just console.error into the void) if
    // even that comes up empty, so this is actually diagnosable from
    // server logs instead of a silent no-op.
    const attachData = {
      txRef,
      planKey: plan.key,
      amountCents: Math.round(plan.amountUSD * 100),
      currency: ADHD_PLAN_CURRENCY,
      status: "pending_payment",
    };

    let attached = false;

    if (leadId) {
      try {
        await db.adhdAssessmentLead.update({
          where: { id: leadId },
          data: attachData,
        });
        attached = true;
      } catch (dbError) {
        console.error(
          `[adhd-initialize] Update by leadId "${leadId}" failed, falling back to email lookup:`,
          dbError,
        );
      }
    }

    if (!attached) {
      try {
        const fallbackLead = await db.adhdAssessmentLead.findFirst({
          where: { email, status: "lead" },
          orderBy: { createdAt: "desc" },
        });
        if (fallbackLead) {
          await db.adhdAssessmentLead.update({
            where: { id: fallbackLead.id },
            data: attachData,
          });
          attached = true;
        }
      } catch (dbError) {
        console.error(
          `[adhd-initialize] Fallback update by email "${email}" also failed:`,
          dbError,
        );
      }
    }

    if (!attached) {
      // This should now be rare (both paths have to fail), but if it
      // happens, it needs to be loud and searchable in logs, not a single
      // buried console.error, this is the exact class of bug that produced
      // "status stayed lead, tx_ref null" with no trace of why.
      console.error(
        `[adhd-initialize] COULD NOT ATTACH tx_ref=${txRef} to any lead for email=${email}, leadId=${leadId || "(none provided)"}. This payment will verify against Flutterwave fine, but won't show up correctly in the admin log or trigger the report email until manually reconciled by tx_ref.`,
      );
    }

    return NextResponse.json({
      success: true,
      txRef,
      amountUSD: plan.amountUSD,
      currency: ADHD_PLAN_CURRENCY,
      planLabel: plan.label,
    });
  } catch (error) {
    console.error("Flutterwave initialize error:", error);
    return NextResponse.json(
      { success: false, error: "Server error. Please try again." },
      { status: 500 },
    );
  }
}

export const POST = withRateLimit(POST_HANDLER);
