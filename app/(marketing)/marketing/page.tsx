// import { getOverviewStats, getTopPages, getTopReferrers, getBounceRate } from "@/lib/analytics/stats";

// export const dynamic = "force-dynamic"; // always fresh — this is a live dashboard

// export default async function OverviewPage() {
//   const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
//   const [overview, topPages, topReferrers, bounceRate] = await Promise.all([
//     getOverviewStats(since),
//     getTopPages(since),
//     getTopReferrers(since),
//     getBounceRate(since),
//   ]);

//   return (
//     <div>
//       <h1 className="mta-h1">Overview — last 24h</h1>

//       <div className="mta-grid">
//         <Card label="Visitors" value={overview.visitorsToday} />
//         <Card label="Sessions" value={overview.sessionsToday} />
//         <Card label="Returning visitors" value={overview.returningVisitors} />
//         <Card label="Avg. session" value={formatDuration(overview.avgSessionSec)} />
//         <Card label="Bounce rate" value={`${bounceRate}%`} />
//         <Card label="Events tracked" value={overview.totalEvents} />
//       </div>

//       <div className="mta-section">
//         <div className="mta-section-title">Top pages</div>
//         {topPages.length === 0 ? (
//           <div className="mta-empty">No page views yet.</div>
//         ) : (
//           <table className="mta-table">
//             <thead>
//               <tr>
//                 <th>Path</th>
//                 <th>Views</th>
//               </tr>
//             </thead>
//             <tbody>
//               {topPages.map((p: { path: string; views: number }) => (
//                 <tr key={p.path}>
//                   <td>{p.path}</td>
//                   <td>{p.views}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       <div className="mta-section">
//         <div className="mta-section-title">Top referrers</div>
//         {topReferrers.length === 0 ? (
//           <div className="mta-empty">No referrer data yet.</div>
//         ) : (
//           <table className="mta-table">
//             <thead>
//               <tr>
//                 <th>Referrer</th>
//                 <th>Sessions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {topReferrers.map((r: { referrer: string; count: number }) => (
//                 <tr key={r.referrer}>
//                   <td>{r.referrer}</td>
//                   <td>{r.count}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }

// function Card({ label, value }: { label: string; value: string | number }) {
//   return (
//     <div className="mta-card">
//       <div className="mta-card-label">{label}</div>
//       <div className="mta-card-value">{value}</div>
//     </div>
//   );
// }

// function formatDuration(sec: number) {
//   const m = Math.floor(sec / 60);
//   const s = sec % 60;
//   return `${m}m ${s}s`;
// }
import { getOverviewStats, getTopPages, getTopReferrers, getBounceRate } from "@/lib/analytics/stats";

export const dynamic = "force-dynamic"; // always fresh — this is a live dashboard

export default async function OverviewPage() {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [overview, topPages, topReferrers, bounceRate] = await Promise.all([
    getOverviewStats(since),
    getTopPages(since),
    getTopReferrers(since),
    getBounceRate(since),
  ]);

  return (
    <div>
      <h1 className="mta-h1">Overview — last 24h</h1>

      <div className="mta-grid">
        <Card label="Visitors" value={overview.visitorsToday} />
        <Card label="Sessions" value={overview.sessionsToday} />
        <Card label="Returning visitors" value={overview.returningVisitors} />
        <Card label="Avg. session" value={formatDuration(overview.avgSessionSec)} />
        <Card label="Bounce rate" value={`${bounceRate}%`} />
        <Card label="Events tracked" value={overview.totalEvents} />
      </div>

      <div className="mta-section">
        <div className="mta-section-title">Top pages</div>
        {topPages.length === 0 ? (
          <div className="mta-empty">No page views yet.</div>
        ) : (
          <div className="mta-table-scroll">
            <table className="mta-table">
              <thead>
                <tr>
                  <th>Path</th>
                  <th>Views</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((p: { path: string; views: number }) => (
                  <tr key={p.path}>
                    <td>{p.path}</td>
                    <td>{p.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mta-section">
        <div className="mta-section-title">Top referrers</div>
        {topReferrers.length === 0 ? (
          <div className="mta-empty">No referrer data yet.</div>
        ) : (
          <div className="mta-table-scroll">
            <table className="mta-table">
              <thead>
                <tr>
                  <th>Referrer</th>
                  <th>Sessions</th>
                </tr>
              </thead>
              <tbody>
                {topReferrers.map((r: { referrer: string; count: number }) => (
                  <tr key={r.referrer}>
                    <td>{r.referrer}</td>
                    <td>{r.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="mta-card">
      <div className="mta-card-label">{label}</div>
      <div className="mta-card-value">{value}</div>
    </div>
  );
}

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}
