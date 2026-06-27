import { withApiLogging } from "@/lib/apiObserver";
import { withRateLimit } from "@/lib/withRateLimit";
import { checkApiLimit } from "@/utilz";

type ApiContext = Record<string, unknown>;

// export const GET = withApiLogging(async () => {
//   await new Promise((r) => setTimeout(r, 300));

//   return Response.json({ ok: true });
// });

const handlers = {
  GET: async (req: Request, ctx: ApiContext) => {
    return Response.json({ ok: true, method: "GET", ctx });
  },
  POST: async (req: Request, ctx: ApiContext) => {
    return Response.json({ ok: true, method: "POST", ctx });
  },
  PUT: async (req: Request, ctx: ApiContext) => {
    return Response.json({ ok: true, method: "PUT", ctx });
  },
  DELETE: async (req: Request, ctx: ApiContext) => {
    return Response.json({ ok: true, method: "DELETE", ctx });
  },
};

export const GET = withApiLogging(withRateLimit(handlers.GET));
export const POST = withApiLogging(withRateLimit(handlers.POST));
export const PUT = withApiLogging(withRateLimit(handlers.PUT));
export const DELETE = withApiLogging(withRateLimit(handlers.DELETE));
