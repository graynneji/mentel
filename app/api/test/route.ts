import { withApiLogging } from "@/lib/apiObserver";

// export const GET = withApiLogging(async () => {
//   await new Promise((r) => setTimeout(r, 300));

//   return Response.json({ ok: true });
// });

const handlers = {
  GET: async (req: Request, ctx: { requestId: string; traceId: string }) => {
    return Response.json({ ok: true, method: "GET", ctx });
  },
  POST: async (req: Request, ctx: { requestId: string; traceId: string }) => {
    return Response.json({ ok: true, method: "POST", ctx });
  },
  PUT: async (req: Request, ctx: { requestId: string; traceId: string }) => {
    return Response.json({ ok: true, method: "PUT", ctx });
  },
  DELETE: async (req: Request, ctx: { requestId: string; traceId: string }) => {
    return Response.json({ ok: true, method: "DELETE", ctx });
  },
};

export const GET = withApiLogging(handlers.GET);
export const POST = withApiLogging(handlers.POST);
export const PUT = withApiLogging(handlers.PUT);
export const DELETE = withApiLogging(handlers.DELETE);
