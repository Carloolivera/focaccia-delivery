import { PrismaClient } from "@/lib/generated/prisma";

// Prisma 7 siempre requiere un adapter.
// Usamos el adapter correcto según el entorno:
//   - SQLite (dev local): @prisma/adapter-better-sqlite3
//   - PostgreSQL/Neon (producción en Vercel): @prisma/adapter-neon

let prismaInstance: PrismaClient | undefined;

function createPrismaClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL || "";

  if (dbUrl.startsWith("file:") || dbUrl === "") {
    // Desarrollo local: SQLite con adapter nativo
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Database = require("better-sqlite3");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaBetterSQLite3 } = require("@prisma/adapter-better-sqlite3");
    const dbPath = dbUrl.replace("file:", "") || "./dev.db";
    const database = new Database(dbPath);
    const adapter = new PrismaBetterSQLite3(database);
    return new PrismaClient({ adapter, log: ["error"] });
  } else {
    // Producción: Neon PostgreSQL via WebSocket (Vercel Node.js runtime)
    // Nota: Vercel Node.js 18+ tiene WebSocket nativo, no necesitamos 'ws'
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Pool } = require("@neondatabase/serverless");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaNeon } = require("@prisma/adapter-neon");
    const pool = new Pool({ connectionString: dbUrl });
    const adapter = new PrismaNeon(pool);
    return new PrismaClient({ adapter, log: ["error"] });
  }
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
