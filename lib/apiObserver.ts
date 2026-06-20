// import { logger } from "./logger";

//  export function withApiLogging(handler: (req: Request) => Promise<Response>) {
//   return async (req: Request) => {
//     const start = Date.now();

//     try {
//       const res = await handler(req);
//       const duration = Date.now() - start;

//       const status = res.status;

//       logger.api({
//         route: req.url,
//         method: req.method,
//         duration,
//         status,
//       });

//       // slow request detection
//       if (duration > 500) {
//         logger.warn("SLOW_API", {
//           route: req.url,
//           duration,
//         });
//       }

//       return res;
//     } catch (err: unknown) {
//       logger.error("API_ERROR", {
//         route: req.url,
//         message: (err as Error).message,
//       });

//       throw err;
//     }
//   };
// }

import { logger, createRequestContext } from "./logger";

const SLOW_REQUEST_MS = 1000;

export function withApiLogging(
  handler: (
    req: Request,
    ctx: {
      requestId: string;
      traceId: string;
    },
  ) => Promise<Response>,
) {
  return async (req: Request) => {
    const ctx = createRequestContext();

    const start = performance.now();

    const route = new URL(req.url).pathname;

    logger.info("API_REQUEST_STARTED", {
      ...ctx,
      route,
      method: req.method,
    });

    try {
      const response = await handler(req, ctx);

      const duration = Math.round(performance.now() - start);

      logger.info("API_REQUEST_COMPLETED", {
        ...ctx,
        route,
        method: req.method,
        status: response.status,
        duration,
      });

      if (duration > SLOW_REQUEST_MS) {
        logger.warn("SLOW_REQUEST", {
          ...ctx,
          route,
          duration,
          meta: {
            threshold: SLOW_REQUEST_MS,
          },
        });
      }

      return response;
    } catch (error) {
      const duration = Math.round(performance.now() - start);

      logger.error("API_REQUEST_FAILED", error, {
        ...ctx,
        route,
        method: req.method,
        duration,
      });

      throw error;
    }
  };
}
