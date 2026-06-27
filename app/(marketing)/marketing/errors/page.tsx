// import { getRecentErrors } from "@/lib/analytics/stats";

// type RecentError = {
//   id: string;
//   createdAt: Date;
//   stack: string | null;
//   message: string;
//   page: string | null;
//   visitorId: string | null;
// };

// export const dynamic = "force-dynamic";

// export default async function ErrorsPage() {
//   const errors: RecentError[] = await getRecentErrors(100);

//   return (
//     <div>
//       <h1 className="mta-h1">Recent errors</h1>
//       {errors.length === 0 ? (
//         <div className="mta-empty">No errors logged. 🎉</div>
//       ) : (
//         <table className="mta-table">
//           <thead>
//             <tr>
//               <th>When</th>
//               <th>Message</th>
//               <th>Page</th>
//               <th>Visitor</th>
//             </tr>
//           </thead>
//           <tbody>
//             {errors.map((e) => (
//               <tr key={e.id}>
//                 <td style={{ whiteSpace: "nowrap" }}>{new Date(e.createdAt).toLocaleString()}</td>
//                 <td title={e.stack ?? undefined}>{e.message}</td>
//                 <td>{e.page ?? "—"}</td>
//                 <td>{e.visitorId ? `${e.visitorId.slice(0, 8)}…` : "—"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }
import { getRecentErrors } from "@/lib/analytics/stats";

type RecentError = {
  id: string;
  createdAt: Date;
  stack: string | null;
  message: string;
  page: string | null;
  visitorId: string | null;
};

export const dynamic = "force-dynamic";

export default async function ErrorsPage() {
  const errors: RecentError[] = await getRecentErrors(100);

  return (
    <div>
      <h1 className="mta-h1">Recent errors</h1>
      {errors.length === 0 ? (
        <div className="mta-empty">No errors logged. 🎉</div>
      ) : (
        <div className="mta-table-scroll">
          <table className="mta-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Message</th>
                <th>Page</th>
                <th>Visitor</th>
              </tr>
            </thead>
            <tbody>
              {errors.map((e) => (
                <tr key={e.id}>
                  <td style={{ whiteSpace: "nowrap" }}>{new Date(e.createdAt).toLocaleString()}</td>
                  <td title={e.stack ?? undefined}>{e.message}</td>
                  <td>{e.page ?? "—"}</td>
                  <td>{e.visitorId ? `${e.visitorId.slice(0, 8)}…` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
