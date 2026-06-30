// import { PrismaClient } from "@/generated/analytics/client";
// import { PrismaPg } from "@prisma/adapter-pg";
// import { Pool } from "pg";

// const globalForAnalytics = globalThis as unknown as {
//   analyticsPrisma: PrismaClient | undefined;
// };

// function createAnalyticsClient(): PrismaClient {
//   const pool = new Pool({
//     connectionString: process.env.ANALYTICS_DATABASE_URL,
//   });
//   const adapter = new PrismaPg(pool);
//   return new PrismaClient({ adapter });
// }

// export const analyticsDb =
//   process.env.NODE_ENV === "production"
//     ? (globalForAnalytics.analyticsPrisma ?? createAnalyticsClient())
//     : createAnalyticsClient();

// if (process.env.NODE_ENV === "production") {
//   globalForAnalytics.analyticsPrisma = analyticsDb;
// }

import { PrismaClient } from "@/generated/analytics/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForAnalytics = globalThis as unknown as {
  analyticsPrisma: PrismaClient | undefined;
};

function createAnalyticsClient(): PrismaClient {
  // Avoid passing a Pool instance directly to PrismaPg to prevent
  // duplicate @types/pg type conflicts. Pass a config object instead.
  // Typed config to avoid using `any`.
  const config: ConstructorParameters<typeof PrismaPg>[0] = {
    connectionString: process.env.ANALYTICS_DATABASE_URL,
  };
  const adapter = new PrismaPg(config);
  return new PrismaClient({ adapter });
}

export const analyticsDb =
  process.env.NODE_ENV === "production"
    ? (globalForAnalytics.analyticsPrisma ?? createAnalyticsClient())
    : createAnalyticsClient();

if (process.env.NODE_ENV === "production") {
  globalForAnalytics.analyticsPrisma = analyticsDb;
}

if (process.env.NODE_ENV !== "production") {
  globalForAnalytics.analyticsPrisma = analyticsDb;
}
