import { PrismaClient } from "@/lib/generated/prisma";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL || "";

  // Adapter de Neon (PostgreSQL via HTTPS/WebSocket)
  const pool = new Pool({ connectionString: dbUrl });
  // @ts-expect-error types mismatch
  const adapter = new PrismaNeon(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
