// import Link from "next/link";

// const NAV = [
//   { href: "/marketing/", label: "Overview" },
//   { href: "/marketing/visitors", label: "Visitors" },
//   { href: "/marketing/funnels", label: "Funnels" },
//   { href: "/marketing/errors", label: "Errors" },
//   { href: "/marketing/performance", label: "Performance" },
// ];

// export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="mta-shell">
//       <aside className="mta-sidebar">
//         <div className="mta-brand">Mentel · Analytics</div>
//         <nav>
//           {NAV.map((item) => (
//             <Link key={item.href} href={item.href} className="mta-nav-link">
//               {item.label}
//             </Link>
//           ))}
//         </nav>
//       </aside>
//       <main className="mta-content">{children}</main>

//       <style>{`
//         .mta-shell {
//           display: grid;
//           grid-template-columns: 220px 1fr;
//           min-height: 100vh;
//           font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif;
//           color: #1a1d23;
//           background: #f7f8fa;
//         }
//         .mta-sidebar {
//           background: #14161a;
//           color: #e8e9eb;
//           padding: 24px 16px;
//         }
//         .mta-brand {
//           font-size: 13px;
//           font-weight: 600;
//           letter-spacing: 0.02em;
//           color: #8b8f99;
//           text-transform: uppercase;
//           margin-bottom: 20px;
//           padding: 0 8px;
//         }
//         .mta-nav-link {
//           display: block;
//           padding: 9px 10px;
//           border-radius: 6px;
//           color: #d6d8dc;
//           text-decoration: none;
//           font-size: 14px;
//           margin-bottom: 2px;
//         }
//         .mta-nav-link:hover {
//           background: #232529;
//           color: #fff;
//         }
//         .mta-content {
//           padding: 32px 40px;
//           max-width: 1100px;
//         }
//         .mta-h1 {
//           font-size: 22px;
//           font-weight: 600;
//           margin: 0 0 24px;
//         }
//         .mta-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
//           gap: 14px;
//           margin-bottom: 32px;
//         }
//         .mta-card {
//           background: #fff;
//           border: 1px solid #e6e8eb;
//           border-radius: 10px;
//           padding: 16px 18px;
//         }
//         .mta-card-label {
//           font-size: 12px;
//           color: #6b7280;
//           margin-bottom: 6px;
//         }
//         .mta-card-value {
//           font-size: 26px;
//           font-weight: 600;
//           font-variant-numeric: tabular-nums;
//         }
//         .mta-section {
//           margin-bottom: 36px;
//         }
//         .mta-section-title {
//           font-size: 14px;
//           font-weight: 600;
//           margin-bottom: 12px;
//           color: #374151;
//         }
//         table.mta-table {
//           width: 100%;
//           border-collapse: collapse;
//           background: #fff;
//           border: 1px solid #e6e8eb;
//           border-radius: 10px;
//           overflow: hidden;
//           font-size: 13px;
//         }
//         table.mta-table th {
//           text-align: left;
//           padding: 10px 14px;
//           background: #fafbfc;
//           color: #6b7280;
//           font-weight: 500;
//           border-bottom: 1px solid #e6e8eb;
//         }
//         table.mta-table td {
//           padding: 10px 14px;
//           border-bottom: 1px solid #f1f2f4;
//           font-variant-numeric: tabular-nums;
//         }
//         table.mta-table tr:last-child td {
//           border-bottom: none;
//         }
//         .mta-pill {
//           display: inline-block;
//           padding: 2px 8px;
//           border-radius: 999px;
//           font-size: 11px;
//           background: #eef2ff;
//           color: #4338ca;
//         }
//         .mta-bar-track {
//           background: #eef0f2;
//           border-radius: 4px;
//           height: 8px;
//           width: 100%;
//           overflow: hidden;
//         }
//         .mta-bar-fill {
//           background: #4338ca;
//           height: 100%;
//         }
//         .mta-empty {
//           color: #9ca3af;
//           font-size: 13px;
//           padding: 24px;
//           text-align: center;
//         }
//       `}</style>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { useState } from "react";

const NAV = [
  { href: "/marketing/", label: "Overview" },
  { href: "/marketing/visitors", label: "Visitors" },
  { href: "/marketing/funnels", label: "Funnels" },
  { href: "/marketing/errors", label: "Errors" },
  { href: "/marketing/performance", label: "Performance" },
];

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mta-shell">
      {/* Mobile top bar — hidden on desktop via CSS */}
      <header className="mta-topbar">
        <button
          type="button"
          className="mta-burger"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "✕" : "☰"}
        </button>
        <span className="mta-brand-mobile">Mentel · Analytics</span>
      </header>

      {/* Backdrop — only interactive/visible when drawer is open, mobile only */}
      {open && <div className="mta-backdrop" onClick={() => setOpen(false)} />}

      <aside className={`mta-sidebar ${open ? "mta-sidebar-open" : ""}`}>
        <div className="mta-brand">Mentel · Analytics</div>
        <nav>
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="mta-nav-link" onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="mta-content">{children}</main>

      <style>{`
        * { box-sizing: border-box; }

        .mta-shell {
        
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif;
          color: #1a1d23;
          background: #f7f8fa;
        }

        .mta-topbar { display: none; }
        .mta-backdrop { display: none; }

        .mta-sidebar {
          background: #14161a;
          color: #e8e9eb;
          padding: 24px 16px;
        }
        .mta-brand {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: #8b8f99;
          text-transform: uppercase;
          margin-bottom: 20px;
          padding: 0 8px;
        }
        .mta-nav-link {
          display: block;
          padding: 11px 10px;
          border-radius: 6px;
          color: #d6d8dc;
          text-decoration: none;
          font-size: 14px;
          margin-bottom: 2px;
        }
        .mta-nav-link:hover,
        .mta-nav-link:active {
          background: #232529;
          color: #fff;
        }

        .mta-content {
          padding: 32px 40px;
          max-width: 1100px;
          width: 100%;
          min-width: 0; /* prevents grid blowout from wide tables */
        }

        .mta-h1 {
          font-size: 22px;
          font-weight: 600;
          margin: 0 0 24px;
        }

        .mta-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 14px;
          margin-bottom: 32px;
        }
        .mta-card {
          background: #fff;
          border: 1px solid #e6e8eb;
          border-radius: 10px;
          padding: 16px 18px;
          min-width: 0;
        }
        .mta-card-label {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 6px;
        }
        .mta-card-value {
          font-size: 26px;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
        }

        .mta-section { margin-bottom: 36px; }
        .mta-section-title {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #374151;
        }

        /* Wrap every <table> in this so it scrolls instead of overflowing the page */
        .mta-table-scroll {
          width: 100%;
          overflow-x: auto;
          border-radius: 10px;
          -webkit-overflow-scrolling: touch;
        }

        table.mta-table {
          width: 100%;
          min-width: 480px; /* keeps columns legible instead of crushing on mobile */
          border-collapse: collapse;
          background: #fff;
          border: 1px solid #e6e8eb;
          border-radius: 10px;
          overflow: hidden;
          font-size: 13px;
        }
        table.mta-table th {
          text-align: left;
          padding: 10px 14px;
          background: #fafbfc;
          color: #6b7280;
          font-weight: 500;
          border-bottom: 1px solid #e6e8eb;
          white-space: nowrap;
        }
        table.mta-table td {
          padding: 10px 14px;
          border-bottom: 1px solid #f1f2f4;
          font-variant-numeric: tabular-nums;
        }
        table.mta-table tr:last-child td { border-bottom: none; }

        .mta-pill {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 999px;
          font-size: 11px;
          background: #eef2ff;
          color: #4338ca;
          white-space: nowrap;
        }
        .mta-bar-track {
          background: #eef0f2;
          border-radius: 4px;
          height: 8px;
          width: 100%;
          overflow: hidden;
        }
        .mta-bar-fill { background: #4338ca; height: 100%; }
        .mta-empty {
          color: #9ca3af;
          font-size: 13px;
          padding: 24px;
          text-align: center;
        }

        /* ───────────────────────── Mobile breakpoint ───────────────────────── */
        @media (max-width: 768px) {
          .mta-shell { grid-template-columns: 1fr; }

          .mta-topbar {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            background: #14161a;
            color: #fff;
            position: sticky;
            top: 0;
            z-index: 50;
          }
          .mta-burger {
            background: none;
            border: none;
            color: #fff;
            font-size: 20px;
            line-height: 1;
            padding: 4px 6px;
            cursor: pointer;
          }
          .mta-brand-mobile {
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 0.02em;
          }

          .mta-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.45);
            z-index: 55;
          }

          .mta-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            width: 240px;
            max-width: 80vw;
            z-index: 60;
            transform: translateX(-100%);
            transition: transform 0.22s ease;
            overflow-y: auto;
          }
          .mta-sidebar-open { transform: translateX(0); }

          .mta-content {
            padding: 16px;
            max-width: 100%;
          }
          .mta-h1 { font-size: 19px; margin-bottom: 16px; }
          .mta-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-bottom: 24px;
          }
          .mta-card { padding: 12px 14px; }
          .mta-card-value { font-size: 21px; }
          .mta-section { margin-bottom: 24px; }
        }

        @media (max-width: 420px) {
          .mta-grid { grid-template-columns: 1fr 1fr; gap: 8px; }
          .mta-card { padding: 10px 12px; }
          .mta-card-label { font-size: 11px; }
          .mta-card-value { font-size: 19px; }
          table.mta-table { font-size: 12px; min-width: 420px; }
        }
      `}</style>
    </div>
  );
}
