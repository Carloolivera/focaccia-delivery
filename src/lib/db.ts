import { PrismaClient } from "@/lib/generated/prisma";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL || "";

  // Detectar si estamos en SQLite (dev local) o PostgreSQL (producción)
  if (dbUrl.startsWith("file:") || dbUrl === "") {
    // Desarrollo local con SQLite
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
    const adapter = new PrismaBetterSqlite3({
      url: dbUrl || "file:./dev.db",
    });
    return new PrismaClient({ adapter });
  } else {
    // Producción con Neon PostgreSQL
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaNeon } = require("@prisma/adapter-neon");
    const adapter = new PrismaNeon({ connectionString: dbUrl });
    return new PrismaClient({ adapter });
  }
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
