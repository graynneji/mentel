// type Level = "info" | "warn" | "error";

// type LogEvent = {
//   event: string;
//   level?: Level;
//   route?: string;
//   method?: string;
//   duration?: number;
//   status?: number;
//   meta?: Record<string, unknown>;
// };

// function write(log: LogEvent) {
//   const payload = {
//     time: new Date().toISOString(),
//     ...log,
//   };

//   // Vercel captures this automatically
//   console.log(JSON.stringify(payload));
// }

// const logger = {
//   info: (event: string, meta?: Record<string, unknown>) =>
//     write({ event, level: "info", meta }),

//   warn: (event: string, meta?: Record<string, unknown>) =>
//     write({ event, level: "warn", meta }),

//   error: (event: string, meta?: Record<string, unknown>) =>
//     write({ event, level: "error", meta }),

//   api: (data: {
//     route: string;
//     method: string;
//     duration: number;
//     status: number;
//   }) =>
//     write({
//       event: "API_REQUEST",
//       level: "info",
//       ...data,
//     }),
// };

import { randomUUID } from "crypto";

export type LogLevel =
  | "debug"
  | "info"
  | "warn"
  | "error"
  | "audit"
  | "security"
  | "business";

export interface LogContext {
  requestId?: string;
  traceId?: string;
  userId?: string;

  route?: string;
  method?: string;

  status?: number;
  duration?: number;

  meta?: Record<string, unknown>;
}

export interface LogPayload extends LogContext {
  event: string;
  level: LogLevel;

  error?: {
    name?: string;
    message?: string;
    stack?: string;
  };
}

const ENV = process.env.NODE_ENV ?? "development";
const SERVICE = "mentel-api";

function sanitize(data: unknown): unknown {
  if (!data || typeof data !== "object") {
    return data;
  }

  const forbidden = [
    "password",
    "token",
    "accessToken",
    "refreshToken",
    "authorization",
    "cookie",
    "email",
    "assessmentAnswers",
    "therapyNotes",
  ];

  return Object.fromEntries(
    Object.entries(data as Record<string, unknown>).map(([key, value]) => [
      key,
      forbidden.includes(key)
        ? "[REDACTED]"
        : typeof value === "object"
          ? sanitize(value)
          : value,
    ]),
  );
}

function write(payload: LogPayload) {
  const log = {
    timestamp: new Date().toISOString(),

    environment: ENV,
    service: SERVICE,

    ...payload,

    meta: sanitize(payload.meta),
  };

  if (ENV === "development") {
    switch (payload.level) {
      case "error":
        console.error(JSON.stringify(log));
        break;

      case "warn":
      case "security":
        console.warn(JSON.stringify(log));
        break;

      default:
        console.log(JSON.stringify(log));
    }
  } else {
  }
}

export const logger = {
  debug(event: string, ctx?: Partial<LogPayload>) {
    write({
      event,
      level: "debug",
      ...ctx,
    });
  },

  info(event: string, ctx?: Partial<LogPayload>) {
    write({
      event,
      level: "info",
      ...ctx,
    });
  },

  warn(event: string, ctx?: Partial<LogPayload>) {
    write({
      event,
      level: "warn",
      ...ctx,
    });
  },

  audit(event: string, ctx?: Partial<LogPayload>) {
    write({
      event,
      level: "audit",
      ...ctx,
    });
  },

  security(event: string, ctx?: Partial<LogPayload>) {
    write({
      event,
      level: "security",
      ...ctx,
    });
  },

  business(event: string, ctx?: Partial<LogPayload>) {
    write({
      event,
      level: "business",
      ...ctx,
    });
  },

  error(event: string, error?: unknown, ctx?: Partial<LogPayload>) {
    write({
      event,
      level: "error",
      ...ctx,

      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : {
              message: String(error),
            },
    });
  },
};

export function createRequestContext() {
  return {
    requestId: randomUUID(),
    traceId: randomUUID(),
  };
}
