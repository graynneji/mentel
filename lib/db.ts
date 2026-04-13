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

// export const db = globalForPrisma.prisma ?? createClient();

// // ← remove the if, always cache it
// globalForPrisma.prisma = db;

// lib/db.ts
import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient(): PrismaClient {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  return new PrismaClient({ adapter });
}

// In development, do NOT cache the client on globalThis when using PrismaPg.
// The PrismaPg adapter holds a pg connection pool that becomes stale across
// hot-reloads / server restarts without a full .next cache clear, causing
// "Tenant or user not found" (DriverAdapterError). Always create a fresh
// client in dev so each restart gets a live pool.
export const db =
  process.env.NODE_ENV === "production"
    ? (globalForPrisma.prisma ?? createClient())
    : createClient();

if (process.env.NODE_ENV === "production") {
  globalForPrisma.prisma = db;
}
