import { checkApiLimit } from "@/utilz/";

export function withRateLimit(
  handler: (
    req: Request,
    context: Record<string, unknown>,
  ) => Promise<Response>,
) {
  return async function (
    req: Request,
    context: Record<string, unknown>,
  ): Promise<Response> {
    // 1. Run the rate limit check automatically
    const limitError = await checkApiLimit(req);
    if (limitError) return limitError;

    // 2. If pass, run the original handler
    return handler(req, context);
  };
}
