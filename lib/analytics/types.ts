// Shared types between the browser SDK, the API route, and the dashboard.

export interface IncomingEventPayload {
  event: string; // e.g. "ASSESSMENT_STARTED", "CLICK", "PAGE_VIEW"
  page?: string;
  path?: string;
  properties?: Record<string, unknown>;
  browser?: Record<string, unknown>;
  device?: Record<string, unknown>;
  performance?: Record<string, unknown>;
  // client-generated timestamp (ms epoch) — server timestamp is authoritative for storage,
  // this is kept for ordering events that arrive out of order over slow connections.
  clientTimestamp?: number;
}

export type QueuedActionType =
  | "SHOW_MODAL"
  | "REDIRECT"
  | "OPEN_CHAT"
  | "SHOW_DISCOUNT"
  | "REQUEST_FEEDBACK"
  | "SHOW_NOTIFICATION"
  | "REFRESH_PAGE"
  | "LOG_OUT"
  | "TRACK_CUSTOM";

export interface QueuedActionDTO {
  id: string;
  type: QueuedActionType;
  payload: Record<string, unknown> | null;
}

export const FUNNEL_STEPS = [
  { event: "ASSESSMENT_PAGE_VIEWED", label: "Visited assessment page" },
  { event: "ASSESSMENT_CLICKED", label: "Clicked start" },
  { event: "ASSESSMENT_STARTED", label: "Started assessment" },
  { event: "ASSESSMENT_COMPLETED", label: "Completed assessment" },
  { event: "BOOKING_CLICKED", label: "Booked a session" },
  { event: "PAYMENT_COMPLETED", label: "Paid" },
  { event: "APPOINTMENT_ATTENDED", label: "Attended" },
] as const;
