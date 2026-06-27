// import { getRecentVisitors } from "@/lib/analytics/stats";

// export const dynamic = "force-dynamic";

// export default async function VisitorsPage() {
//   const visitors = await getRecentVisitors(100);

//   return (
//     <div>
//       <h1 className="mta-h1">Visitors</h1>
//       {visitors.length === 0 ? (
//         <div className="mta-empty">No visitors yet.</div>
//       ) : (
//         <table className="mta-table">
//           <thead>
//             <tr>
//               <th>Visitor</th>
//               <th>User</th>
//               <th>Last seen</th>
//               <th>First touch source</th>
//               <th>Last session device</th>
//             </tr>
//           </thead>
//           <tbody>
//             {visitors.map((v: typeof visitors[number]) => (
//               <tr key={v.id}>
//                 <td title={v.id}>{v.id.slice(0, 8)}…</td>
//                 <td>{v.userId ? <span className="mta-pill">logged in</span> : "—"}</td>
//                 <td>{new Date(v.lastSeenAt).toLocaleString()}</td>
//                 <td>{v.firstUtmSource ?? v.firstReferrer ?? "direct"}</td>
//                 <td>{v.sessions[0]?.device ?? "—"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

import { getRecentVisitors } from "@/lib/analytics/stats";

export const dynamic = "force-dynamic";

export default async function VisitorsPage() {
  const visitors = await getRecentVisitors(100);

  return (
    <div>
      <h1 className="mta-h1">Visitors</h1>
      {visitors.length === 0 ? (
        <div className="mta-empty">No visitors yet.</div>
      ) : (
        <div className="mta-table-scroll">
          <table className="mta-table">
            <thead>
              <tr>
                <th>Visitor</th>
                <th>User</th>
                <th>Last seen</th>
                <th>First touch source</th>
                <th>Last session device</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map((v: (typeof visitors)[number]) => (
                <tr key={v.id}>
                  <td title={v.id}>{v.id.slice(0, 8)}…</td>
                  <td>{v.userId ? <span className="mta-pill">logged in</span> : "—"}</td>
                  <td>{new Date(v.lastSeenAt).toLocaleString()}</td>
                  <td>{v.firstUtmSource ?? v.firstReferrer ?? "direct"}</td>
                  <td>{v.sessions[0]?.device ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
