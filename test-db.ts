import { PrismaClient } from "@/lib/generated/prisma";
import fs from "fs";

async function main() {
  const dbUrl = "postgresql://neondb_owner:npg_sPq9gt0bORep@ep-wild-truth-aiftzmfy-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require";
  process.env.DATABASE_URL = dbUrl;
  const prisma = new PrismaClient();
  
  console.log("Conectando a Neon nativamente...");
  const settings = await prisma.settings.findFirst();
  console.log("Settings logrados:", settings?.businessName);
}

main().catch((err) => {
  const errMsg = `Message:\n${err.message}\n\nName: ${err.name}\nCode: ${err.code}\nStack:\n${err.stack}`;
  fs.writeFileSync("error-detail.txt", errMsg, "utf-8");
  console.error("Falló la conexión:", err.message);
  process.exit(1);
});

main().catch((err) => {
  const errMsg = `Message:\n${err.message}\n\nName: ${err.name}\nCode: ${err.code}\nStack:\n${err.stack}`;
  fs.writeFileSync("error-detail.txt", errMsg, "utf-8");
  console.error("Falló la conexión:", err.message);
  process.exit(1);
});
