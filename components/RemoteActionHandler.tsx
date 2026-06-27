"use client";

import { useEffect, useState } from "react";
import { getVisitorId } from "@/lib/analytics/client";
import type { QueuedActionDTO } from "@/lib/analytics/types";

const POLL_INTERVAL_MS = 20_000;

/**
 * Built-in handling for SHOW_MODAL, SHOW_NOTIFICATION, REDIRECT, REFRESH_PAGE,
 * LOG_OUT. For app-specific actions (OPEN_CHAT, SHOW_DISCOUNT, REQUEST_FEEDBACK,
 * TRACK_CUSTOM) this dispatches a `mentel:remote-action` CustomEvent — listen
 * for it anywhere in your app:
 *
 *   useEffect(() => {
 *     const handler = (e: CustomEvent<QueuedActionDTO>) => {
 *       if (e.detail.type === "OPEN_CHAT") openSupportWidget();
 *     };
 *     window.addEventListener("mentel:remote-action", handler as EventListener);
 *     return () => window.removeEventListener("mentel:remote-action", handler as EventListener);
 *   }, []);
 */
export function RemoteActionHandler() {
  const [modal, setModal] = useState<{ title: string; message: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      const visitorId = getVisitorId();
      if (!visitorId) return;

      try {
        const res = await fetch(`/api/analytics/commands?visitorId=${visitorId}`);
        const data: { ok: boolean; actions: QueuedActionDTO[] } = await res.json();
        if (cancelled || !data.ok) return;

        for (const action of data.actions) {
          await execute(action);
          fetch("/api/analytics/commands", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: action.id }),
          }).catch(() => {});
        }
      } catch {
        // network hiccup — just try again next interval
      }
    }

    function execute(action: QueuedActionDTO) {
      const payload = action.payload ?? {};
      switch (action.type) {
        case "SHOW_MODAL":
          setModal({ title: String(payload.title ?? ""), message: String(payload.message ?? "") });
          break;
        case "SHOW_NOTIFICATION":
          setToast(String(payload.message ?? ""));
          setTimeout(() => setToast(null), 6000);
          break;
        case "REDIRECT":
          if (typeof payload.url === "string") window.location.href = payload.url;
          break;
        case "REFRESH_PAGE":
          window.location.reload();
          break;
        case "LOG_OUT":
          window.dispatchEvent(new CustomEvent("mentel:remote-action", { detail: action }));
          break;
        default:
          window.dispatchEvent(new CustomEvent("mentel:remote-action", { detail: action }));
      }
    }

    poll();
    const id = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <>
      {modal && (
        <div role="dialog" aria-modal="true" style={overlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ margin: "0 0 8px", fontSize: 18 }}>{modal.title}</h2>
            <p style={{ margin: "0 0 16px", color: "#555" }}>{modal.message}</p>
            <button onClick={() => setModal(null)} style={buttonStyle}>
              Close
            </button>
          </div>
        </div>
      )}
      {toast && <div style={toastStyle}>{toast}</div>}
    </>
  );
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};
const modalStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 12,
  padding: 24,
  maxWidth: 360,
  boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
};
const buttonStyle: React.CSSProperties = {
  background: "#1a1a1a",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "8px 16px",
  cursor: "pointer",
};
const toastStyle: React.CSSProperties = {
  position: "fixed",
  bottom: 24,
  right: 24,
  background: "#1a1a1a",
  color: "#fff",
  padding: "12px 16px",
  borderRadius: 8,
  zIndex: 9999,
  maxWidth: 320,
};
