// // // lib/db.ts
// // import "dotenv/config";
// // import { PrismaClient } from "../generated/prisma/client";
// // import { PrismaPg } from "@prisma/adapter-pg";

// // const globalForPrisma = globalThis as unknown as {
// //   prisma: PrismaClient | undefined;
// // };

// // function createClient(): PrismaClient {
// //   const adapter = new PrismaPg({
// //     connectionString: process.env.DATABASE_URL!,
// //   });
// //   return new PrismaClient({ adapter });
// // }

// // export const db = globalForPrisma.prisma ?? createClient();

// // // ← remove the if, always cache it
// // globalForPrisma.prisma = db;

// // lib/db.ts
// import "dotenv/config";
// import { PrismaClient } from "../generated/prisma/client";
// import { PrismaPg } from "@prisma/adapter-pg";

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined;
// };

// function createClient(): PrismaClient {
//   const adapter = new PrismaPg({
//     connectionString: process.env.DATABASE_URL!,
//   });
//   return new PrismaClient({ adapter });
// }

// // In development, do NOT cache the client on globalThis when using PrismaPg.
// // The PrismaPg adapter holds a pg connection pool that becomes stale across
// // hot-reloads / server restarts without a full .next cache clear, causing
// // "Tenant or user not found" (DriverAdapterError). Always create a fresh
// // client in dev so each restart gets a live pool.
// export const db =
//   process.env.NODE_ENV === "production"
//     ? (globalForPrisma.prisma ?? createClient())
//     : createClient();

// if (process.env.NODE_ENV === "production") {
//   globalForPrisma.prisma = db;
// }

// lib/db.ts
import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaPool: Pool | undefined;
};

function createClient(): PrismaClient {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    max: 1, // was silently ignored before — now actually enforced
    ssl: { rejectUnauthorized: false }, // Supabase requires TLS; not reliably inferred from the URL alone
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
  });

  // Without this, a dropped idle connection throws an unhandled 'error'
  // event on the pool instead of surfacing cleanly through a query.
  pool.on("error", (err) => {
    console.error("[pg pool] idle client error:", err.message);
  });

  const adapter = new PrismaPg(pool as never);
  globalForPrisma.prismaPool = pool;
  return new PrismaClient({ adapter });
}

// Always cache, but close the previous pool first so hot reloads
// don't leak connections.
if (globalForPrisma.prisma && globalForPrisma.prismaPool) {
  globalForPrisma.prismaPool.end().catch(() => {});
}

export const db = createClient();
globalForPrisma.prisma = db;
