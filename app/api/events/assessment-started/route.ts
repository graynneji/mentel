import { logger } from "@/lib/logger";
import { EVENTS } from "@/utilz";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

  const userAgent = req.headers.get("user-agent");

  logger.business(EVENTS.ASSESSMENT_STARTED, {
    meta: {
      ip,
      userAgent,
      source: "assessment_page",
    },
  });

  return Response.json({ ok: true });
}
