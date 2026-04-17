import { logger } from "./logger";

export function withApiLogging(handler: (req: Request) => Promise<Response>) {
  return async (req: Request) => {
    const start = Date.now();

    try {
      const res = await handler(req);
      const duration = Date.now() - start;

      const status = res.status;

      logger.api({
        route: req.url,
        method: req.method,
        duration,
        status,
      });

      // slow request detection
      if (duration > 500) {
        logger.warn("SLOW_API", {
          route: req.url,
          duration,
        });
      }

      return res;
    } catch (err: unknown) {
      logger.error("API_ERROR", {
        route: req.url,
        message: (err as Error).message,
      });

      throw err;
    }
  };
}
