// type Level = "info" | "warn" | "error";

// type LogEvent = {
//   event: string;
//   level?: Level;
//   route?: string;
//   method?: string;
//   duration?: number;
//   status?: number;
//   meta?: Record<string, never>;
// };

// function write(log: LogEvent) {
//   const payload = {
//     time: new Date().toISOString(),
//     ...log,
//   };

//   // Vercel captures this automatically
//   console.log(JSON.stringify(payload));
// }

// export const logger = {
//   info: (event: string, meta?: never) => write({ event, level: "info", meta }),

//   warn: (event: string, meta?: never) => write({ event, level: "warn", meta }),

//   error: (event: string, meta?: never) =>
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

type Level = "info" | "warn" | "error";

type LogEvent = {
  event: string;
  level?: Level;
  route?: string;
  method?: string;
  duration?: number;
  status?: number;
  meta?: Record<string, unknown>;
};

function write(log: LogEvent) {
  const payload = {
    time: new Date().toISOString(),
    ...log,
  };

  // Vercel captures this automatically
  console.log(JSON.stringify(payload));
}

export const logger = {
  info: (event: string, meta?: Record<string, unknown>) =>
    write({ event, level: "info", meta }),

  warn: (event: string, meta?: Record<string, unknown>) =>
    write({ event, level: "warn", meta }),

  error: (event: string, meta?: Record<string, unknown>) =>
    write({ event, level: "error", meta }),

  api: (data: {
    route: string;
    method: string;
    duration: number;
    status: number;
  }) =>
    write({
      event: "API_REQUEST",
      level: "info",
      ...data,
    }),
};
