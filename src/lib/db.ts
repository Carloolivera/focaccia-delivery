// Usando imports estáticos para correcta inclusión en el bundle de Next.js 16/Turbopack
// Prisma 7 requiere adapter explícito para todos los entornos
import { PrismaClient } from "@/lib/generated/prisma";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

// Configuración para entornos serverless (Vercel)
neonConfig.fetchConnectionCache = true;

function createPrismaClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL || "";

  if (!dbUrl || dbUrl.startsWith("file:")) {
    // Desarrollo local: SQLite via better-sqlite3 (módulo nativo Node.js)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Database = require("better-sqlite3");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaBetterSQLite3 } = require("@prisma/adapter-better-sqlite3");
    const dbPath = dbUrl ? dbUrl.replace("file:", "") : "./dev.db";
    const database = new Database(dbPath);
    const adapter = new PrismaBetterSQLite3(database);
    return new PrismaClient({ adapter, log: ["error"] });
  }

  // Producción: Neon PostgreSQL via WebSocket Pool
  // PrismaNeon acepta PoolConfig con connectionString directamente
  const adapter = new PrismaNeon({ connectionString: dbUrl });
  return new PrismaClient({ adapter, log: ["error"] });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
