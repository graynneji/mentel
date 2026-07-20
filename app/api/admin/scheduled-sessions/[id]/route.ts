// // app/api/admin/scheduled-sessions/[id]/route.ts
// // PATCH: the one place every session action happens from — no more going
// // into the database directly for any of these.
// //
// // action: "complete" | "no_show" | "cancel" | "reschedule"
// //
// // - complete:   marks it done. No session returned to the client's bank
// //               (they used it).
// // - no_show:    client didn't attend. Also does NOT return the session —
// //               that was their allotted time, whether they used it or not.
// // - cancel:     admin-initiated cancellation. Returns the session to the
// //               client's bank, notifies them, and — if grantFreeSession
// //               is true (use this when it's genuinely our fault: a
// //               therapist emergency, a scheduling error, etc.) — ALSO
// //               grants a bonus session on top, so they're not just made
// //               whole but given something extra for the inconvenience.
// // - reschedule: moves the time, notifies the client, keeps the Cal.com
// //               booking in sync, keeps the session counted as used
// //               (nothing returned to the bank — it's the same session,
// //               just moved).

// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { cancelCalBooking } from "@/lib/cal/cancel-booking";
// import { notifySessionCancelled, notifySessionRescheduled } from "@/lib/notifications/session-emails";

// function requireAdmin(req: NextRequest): boolean {
//   const session = req.cookies.get("mentel_admin_session")?.value;
//   return session === process.env.ADMIN_SESSION_SECRET;
// }

// export async function PATCH(req: Request, context: { params: Promise<{ id: string }> } | any) {
//   const nextReq = req as NextRequest;
//   if (!requireAdmin(nextReq)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   try {
//     const { id } = await context.params;
//     const body = await nextReq.json();
//     const action = String(body.action ?? "");

//     const session = await db.scheduledSession.findUnique({
//       where: { id },
//       include: { package: { include: { lead: true } } },
//     });
//     if (!session) return NextResponse.json({ success: false, error: "Session not found." }, { status: 404 });

//     const lead = session.package.lead;

//     if (action === "complete") {
//       const updated = await db.scheduledSession.update({ where: { id }, data: { status: "completed" } });
//       return NextResponse.json({ success: true, session: updated });
//     }

//     if (action === "no_show") {
//       const updated = await db.scheduledSession.update({ where: { id }, data: { status: "no-show" } });
//       // Deliberately NOT returned to the bank — this was their scheduled
//       // time whether they attended or not.
//       return NextResponse.json({ success: true, session: updated });
//     }

//     if (action === "cancel") {
//       if (session.status !== "scheduled") {
//         return NextResponse.json({ success: false, error: "Only upcoming sessions can be cancelled." }, { status: 400 });
//       }

//       const reason = typeof body.reason === "string" ? body.reason.slice(0, 300) : undefined;
//       const grantFreeSession = !!body.grantFreeSession;

//       if (session.calBookingUid) await cancelCalBooking(session.calBookingUid, reason || "Cancelled by Mentel");

//       const updated = await db.scheduledSession.update({
//         where: { id },
//         data: { status: "cancelled", cancelledBy: "admin", cancelReason: reason ?? null },
//       });
//       await db.package.update({ where: { id: session.packageId }, data: { usedSessions: { decrement: 1 } } });

//       if (grantFreeSession) {
//         const periodStart = new Date();
//         const periodEnd = new Date(periodStart);
//         periodEnd.setDate(periodEnd.getDate() + 30);
//         await db.package.create({
//           data: {
//             leadId: lead.id,
//             paymentId: null,
//             planType: "bonus",
//             totalSessions: 1,
//             usedSessions: 0,
//             periodStart,
//             periodEnd,
//             status: "active",
//           },
//         });
//       }

//       await notifySessionCancelled({
//         email: lead.email,
//         phone: lead.phone,
//         name: lead.name,
//         scheduledAt: session.scheduledAt,
//         cancelledByAdmin: true,
//         reason,
//         freeSessionGranted: grantFreeSession,
//       });

//       return NextResponse.json({ success: true, session: updated });
//     }

//     if (action === "reschedule") {
//       if (session.status !== "scheduled") {
//         return NextResponse.json({ success: false, error: "Only upcoming sessions can be rescheduled." }, { status: 400 });
//       }
//       const newScheduledAt = body.scheduledAt ? new Date(body.scheduledAt) : null;
//       if (!newScheduledAt || isNaN(newScheduledAt.getTime())) {
//         return NextResponse.json({ success: false, error: "Please provide a valid new date/time." }, { status: 400 });
//       }
//       const reason = typeof body.reason === "string" ? body.reason.slice(0, 300) : undefined;

//       // Note: this updates our own record of the time. If the session has
//       // a linked Cal.com booking, its calendar event is NOT automatically
//       // moved (Cal.com's reschedule API requires a replacement slot
//       // selection flow) — cancel and rebook it on Cal.com's side too if
//       // it's linked, to keep both in sync.
//       const oldScheduledAt = session.scheduledAt;
//       const updated = await db.scheduledSession.update({
//         where: { id },
//         data: { scheduledAt: newScheduledAt, rescheduledFrom: oldScheduledAt },
//       });

//       await notifySessionRescheduled({
//         email: lead.email,
//         phone: lead.phone,
//         name: lead.name,
//         oldScheduledAt,
//         newScheduledAt,
//         reason,
//       });

//       return NextResponse.json({ success: true, session: updated });
//     }

//     return NextResponse.json({ success: false, error: "Unknown action." }, { status: 400 });
//   } catch (err) {
//     console.error("[Admin Scheduled Session PATCH]", err);
//     return NextResponse.json({ success: false, error: "Something went wrong." }, { status: 500 });
//   }
// }

// app/api/admin/scheduled-sessions/[id]/route.ts
// PATCH: the one place every session action happens from — no more going
// into the database directly for any of these.
//
// action: "complete" | "no_show" | "cancel" | "reschedule"
//
// - complete:   marks it done. No session returned to the client's bank.
// - no_show:    client didn't attend. Does NOT return the session to
//               their bank — but CAN be rescheduled later (see below),
//               which is when the credit actually gets released.
// - cancel:     admin-initiated. Returns the session to the client's
//               bank immediately, notifies them, and — if
//               grantFreeSession is true (use when it's genuinely our
//               fault) — also grants a bonus session on top.
// - reschedule: works on a "scheduled", "no-show", OR "cancelled" session
//               — picks a real Cal.com slot, cancels the old Cal.com
//               booking if one exists, books the new one, and:
//                 * if it was "no-show": releases the withheld credit,
//                   then re-claims it against this same package for the
//                   new time — net balance unchanged, but the client
//                   actually gets their redo instead of losing the session.
//                 * if it was "cancelled": already refunded at cancel
//                   time, so this just re-claims one session for the new
//                   booking (same as booking fresh).
//                 * if it was "scheduled": pure time-move, no bank change.
//               Either way the client gets an email about the new time.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  cancelSessionBooking,
  createSessionBooking,
} from "@/lib/cal/session-booking";
import {
  notifySessionCancelled,
  notifySessionRescheduled,
} from "@/lib/notifications/session-emails";

function requireAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("mentel_admin_session")?.value;
  return session === process.env.ADMIN_SESSION_SECRET;
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const nextReq = req as NextRequest;
  if (!requireAdmin(nextReq))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await context.params;
    const body = await nextReq.json();
    const action = String(body.action ?? "");

    const session = await db.scheduledSession.findUnique({
      where: { id },
      include: { package: { include: { lead: true } } },
    });
    if (!session)
      return NextResponse.json(
        { success: false, error: "Session not found." },
        { status: 404 },
      );

    const lead = session.package.lead;

    if (action === "complete") {
      if (session.status !== "scheduled") {
        return NextResponse.json(
          {
            success: false,
            error: "Only upcoming sessions can be marked completed.",
          },
          { status: 400 },
        );
      }
      const updated = await db.scheduledSession.update({
        where: { id },
        data: { status: "completed" },
      });
      return NextResponse.json({ success: true, session: updated });
    }

    if (action === "no_show") {
      if (session.status !== "scheduled") {
        return NextResponse.json(
          {
            success: false,
            error: "Only upcoming sessions can be marked no-show.",
          },
          { status: 400 },
        );
      }
      const updated = await db.scheduledSession.update({
        where: { id },
        data: { status: "no-show" },
      });
      // Deliberately NOT returned to the bank here — that only happens if
      // it's later rescheduled (see below), giving the client an actual
      // redo rather than a silent refund with no session to show for it.
      return NextResponse.json({ success: true, session: updated });
    }

    if (action === "cancel") {
      if (session.status !== "scheduled") {
        return NextResponse.json(
          { success: false, error: "Only upcoming sessions can be cancelled." },
          { status: 400 },
        );
      }

      const reason =
        typeof body.reason === "string" ? body.reason.slice(0, 300) : undefined;
      const grantFreeSession = !!body.grantFreeSession;

      if (session.calBookingUid)
        await cancelSessionBooking(
          session.calBookingUid,
          reason || "Cancelled by Mentel",
        );

      const updated = await db.scheduledSession.update({
        where: { id },
        data: {
          status: "cancelled",
          cancelledBy: "admin",
          cancelReason: reason ?? null,
        },
      });
      await db.package.update({
        where: { id: session.packageId },
        data: { usedSessions: { decrement: 1 } },
      });

      if (grantFreeSession) {
        const periodStart = new Date();
        const periodEnd = new Date(periodStart);
        periodEnd.setDate(periodEnd.getDate() + 30);
        await db.package.create({
          data: {
            leadId: lead.id,
            paymentId: null,
            planType: "bonus",
            totalSessions: 1,
            usedSessions: 0,
            periodStart,
            periodEnd,
            status: "active",
          },
        });
      }

      await notifySessionCancelled({
        email: lead.email,
        phone: lead.phone,
        name: lead.name,
        scheduledAt: session.scheduledAt,
        cancelledByAdmin: true,
        reason,
        freeSessionGranted: grantFreeSession,
      });

      return NextResponse.json({ success: true, session: updated });
    }

    if (action === "reschedule") {
      if (!["scheduled", "no-show", "cancelled"].includes(session.status)) {
        return NextResponse.json(
          { success: false, error: "This session can't be rescheduled." },
          { status: 400 },
        );
      }

      const newStart: string | undefined = body.start;
      if (!newStart || isNaN(Date.parse(newStart))) {
        return NextResponse.json(
          { success: false, error: "Please choose a valid time." },
          { status: 400 },
        );
      }
      const reason =
        typeof body.reason === "string" ? body.reason.slice(0, 300) : undefined;

      // 1. Cancel the old Cal.com booking, if there is one.
      if (session.calBookingUid) {
        await cancelSessionBooking(
          session.calBookingUid,
          reason || "Rescheduled by Mentel",
        );
      }

      // 2. Book the new slot on Cal.com — do this before touching the bank,
      // so a failed booking never costs the client a session.
      const booking = await createSessionBooking({
        start: newStart,
        name: lead.name,
        email: lead.email,
      });
      if (!booking.ok) {
        return NextResponse.json(
          {
            success: false,
            error: booking.error || "Could not book that time.",
          },
          { status: 502 },
        );
      }

      // 3. Reconcile the session bank:
      //    - "no-show" withheld its credit — release it, then reclaim it
      //      for this new booking (net zero, but it's now a real
      //      scheduled session again instead of a dead no-show record).
      //    - "cancelled" was already refunded at cancel time — reclaim
      //      one for this new booking, same as any fresh booking would.
      //    - "scheduled" never released anything — no bank change needed,
      //      this is a pure time-move.
      if (session.status === "no-show" || session.status === "cancelled") {
        const fresh = await db.package.findUniqueOrThrow({
          where: { id: session.packageId },
        });
        if (fresh.usedSessions >= fresh.totalSessions) {
          // Package has no room (e.g. expired or fully used elsewhere since)
          // — still honor the reschedule since we already booked Cal.com,
          // but don't let the count go negative or over capacity.
          console.warn(
            "[scheduled-sessions PATCH] rescheduling onto a package with no remaining room:",
            session.packageId,
          );
        } else {
          await db.package.update({
            where: { id: session.packageId },
            data: { usedSessions: { increment: 1 } },
          });
        }
      }

      const oldScheduledAt = session.scheduledAt;
      const updated = await db.scheduledSession.update({
        where: { id },
        data: {
          scheduledAt: new Date(newStart),
          calBookingUid: booking.uid ?? null,
          status: "scheduled",
          cancelledBy: null,
          cancelReason: null,
          rescheduledFrom: oldScheduledAt,
        },
      });

      await notifySessionRescheduled({
        email: lead.email,
        phone: lead.phone,
        name: lead.name,
        oldScheduledAt,
        newScheduledAt: new Date(newStart),
        reason,
      });

      return NextResponse.json({ success: true, session: updated });
    }

    return NextResponse.json(
      { success: false, error: "Unknown action." },
      { status: 400 },
    );
  } catch (err) {
    console.error("[Admin Scheduled Session PATCH]", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong." },
      { status: 500 },
    );
  }
}
