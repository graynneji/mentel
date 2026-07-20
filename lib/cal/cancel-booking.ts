// // lib/cal/cancel-booking.ts
// // Small helper so admin cancel/reschedule actions keep the therapist's
// // actual Cal.com calendar in sync — reused from client-portal's own
// // version of this same logic.

// const CAL_API_KEY = process.env.CAL_API_KEY!;
// const CAL_API_VERSION_BOOKINGS = "2024-08-13";

// export async function cancelCalBooking(uid: string, reason: string): Promise<void> {
//   try {
//     await fetch(`https://api.cal.com/v2/bookings/${uid}/cancel`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${CAL_API_KEY}`,
//         "cal-api-version": CAL_API_VERSION_BOOKINGS,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ cancellationReason: reason }),
//     });
//   } catch (err) {
//     console.error("[cancelCalBooking] failed to cancel Cal.com booking", uid, err);
//   }
// }
