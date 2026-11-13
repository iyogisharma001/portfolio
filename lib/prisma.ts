import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/** True when a database connection string is configured. */
export const hasDatabase = Boolean(process.env.DATABASE_URL);

/**
 * A single PrismaClient per process. In development the instance is cached on
 * `globalThis` so hot reloads don't exhaust the connection pool.
 */
export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
