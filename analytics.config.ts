// prisma/analytics.config.ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/analytics.schema.prisma",
  migrations: {
    path: "prisma/analytics-migrations", // Separate folder!
  },
  datasource: {
    url: env("ANALYTICS_DATABASE_URL"),
  },
});
