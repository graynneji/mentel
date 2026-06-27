// import { computeFunnel } from "@/lib/analytics/funnel";

// export const dynamic = "force-dynamic";

// export default async function FunnelsPage() {
//   const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
//   const steps = await computeFunnel(since);
//   const max = Math.max(1, ...steps.map((s) => s.visitors));

//   return (
//     <div>
//       <h1 className="mta-h1">Funnel — last 30 days</h1>
//       <p style={{ color: "#6b7280", fontSize: 13, marginTop: -16, marginBottom: 24 }}>
//         Visitors who fired each event at least once. Fire <code>ASSESSMENT_PAGE_VIEWED</code>,{" "}
//         <code>ASSESSMENT_CLICKED</code>, <code>ASSESSMENT_STARTED</code>, <code>ASSESSMENT_COMPLETED</code>,{" "}
//         <code>BOOKING_CLICKED</code>, <code>PAYMENT_COMPLETED</code>, and <code>APPOINTMENT_ATTENDED</code> from
//         your app via <code>analytics.track(...)</code> to populate this.
//       </p>

//       <table className="mta-table">
//         <thead>
//           <tr>
//             <th>Step</th>
//             <th>Visitors</th>
//             <th>% of start</th>
//             <th>Drop-off</th>
//             <th></th>
//           </tr>
//         </thead>
//         <tbody>
//           {steps.map((s) => (
//             <tr key={s.event}>
//               <td>{s.label}</td>
//               <td>{s.visitors}</td>
//               <td>{s.conversionFromStart}%</td>
//               <td>{s.dropOffFromPrevious === null ? "—" : `−${s.dropOffFromPrevious}%`}</td>
//               <td style={{ width: 160 }}>
//                 <div className="mta-bar-track">
//                   <div className="mta-bar-fill" style={{ width: `${(s.visitors / max) * 100}%` }} />
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

import { computeFunnel } from "@/lib/analytics/funnel";

export const dynamic = "force-dynamic";

export default async function FunnelsPage() {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const steps = await computeFunnel(since);
  const max = Math.max(1, ...steps.map((s) => s.visitors));

  return (
    <div>
      <h1 className="mta-h1">Funnel — last 30 days</h1>
      <p style={{ color: "#6b7280", fontSize: 13, marginTop: -16, marginBottom: 24 }}>
        Visitors who fired each event at least once. Fire <code>ASSESSMENT_PAGE_VIEWED</code>,{" "}
        <code>ASSESSMENT_CLICKED</code>, <code>ASSESSMENT_STARTED</code>, <code>ASSESSMENT_COMPLETED</code>,{" "}
        <code>BOOKING_CLICKED</code>, <code>PAYMENT_COMPLETED</code>, and <code>APPOINTMENT_ATTENDED</code> from
        your app via <code>analytics.track(...)</code> to populate this.
      </p>

      <div className="mta-table-scroll">
        <table className="mta-table">
          <thead>
            <tr>
              <th>Step</th>
              <th>Visitors</th>
              <th>% of start</th>
              <th>Drop-off</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {steps.map((s) => (
              <tr key={s.event}>
                <td>{s.label}</td>
                <td>{s.visitors}</td>
                <td>{s.conversionFromStart}%</td>
                <td>{s.dropOffFromPrevious === null ? "—" : `−${s.dropOffFromPrevious}%`}</td>
                <td style={{ width: 160 }}>
                  <div className="mta-bar-track">
                    <div className="mta-bar-fill" style={{ width: `${(s.visitors / max) * 100}%` }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
