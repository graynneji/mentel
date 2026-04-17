import { withApiLogging } from "@/lib/apiObserver";

export const GET = withApiLogging(async () => {
  await new Promise((r) => setTimeout(r, 300));

  return Response.json({ ok: true });
});
