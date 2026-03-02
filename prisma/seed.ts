import "dotenv/config";
import { PrismaClient } from "../src/lib/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🍕 Seeding Focaccia Delivery...");

  // Limpiar datos existentes
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.settings.deleteMany();
  await prisma.adminUser.deleteMany();

  // Configuración del negocio
  await prisma.settings.create({
    data: {
      id: "main",
      businessName: "Pizzería Focaccia",
      address: "Bolivia 55, Chascomús, Buenos Aires",
      phone1: "2241693947",
      phone2: "2241673445",
      instagram: "focacciapizzeria_ch",
      deliveryNote: "Envíos a domicilio en zona céntrica de Chascomús",
      estimatedTime: "40-50 min",
      isOpen: true,
    },
  });

  // Categorías
  const empanadas = await prisma.category.create({
    data: { name: "Empanadas", slug: "empanadas", order: 1 },
  });

  const pizzas = await prisma.category.create({
    data: { name: "Pizzas", slug: "pizzas", order: 2 },
  });

  const tartas = await prisma.category.create({
    data: { name: "Tartas", slug: "tartas", order: 3 },
  });

  // Empanadas
  const empanadaItems = [
    { name: "Criolla", price: 1500 },
    { name: "Capresse", price: 1500 },
    { name: "Carne", price: 1500 },
    { name: "Jamón y Queso", price: 1500 },
    { name: "Pollo", price: 1500 },
    { name: "Jamón y Roquefort", price: 1700 },
    { name: "Humita", price: 1500 },
    { name: "Panceta y Queso", price: 1700 },
    { name: "Verdura", price: 1500 },
    { name: "Panceta y Ciruela", price: 1700 },
  ];

  for (const item of empanadaItems) {
    await prisma.product.create({
      data: {
        name: item.name,
        price: item.price,
        categoryId: empanadas.id,
        description: `Empanada de ${item.name.toLowerCase()}`,
      },
    });
  }

  // Pizzas
  const pizzaItems = [
    { name: "Muzzarella", price: 7000, desc: "Salsa, muzzarella y orégano" },
    { name: "Italiana", price: 8500, desc: "Muzzarella, tomate en rodajas y orégano" },
    { name: "Especial", price: 9000, desc: "Muzzarella, jamón, morrones y aceitunas" },
    { name: "Provolone", price: 9000, desc: "Salsa y provolone fundido" },
    { name: "Napolitana", price: 8500, desc: "Salsa, muzzarella, tomate y ajo" },
    { name: "Ajillo", price: 8000, desc: "Muzzarella, ajo y aceite de oliva" },
    { name: "Calabresa", price: 9000, desc: "Muzzarella y calabresa en rodajas" },
    { name: "Verdura", price: 8500, desc: "Muzzarella con verduras de estación" },
    { name: "Roquefort", price: 9500, desc: "Muzzarella y roquefort" },
    { name: "Panceta", price: 9500, desc: "Muzzarella y panceta crocante" },
    { name: "4 Quesos", price: 9500, desc: "Muzzarella, provolone, roquefort y parmesano" },
    { name: "Ranchera", price: 9000, desc: "Muzzarella, carne, cebolla y morrones" },
    { name: "Fugazzeta", price: 8000, desc: "Muzzarella, cebolla y aceitunas" },
    { name: "Focaccia", price: 8500, desc: "La especialidad de la casa" },
    { name: "Anchoas", price: 9500, desc: "Muzzarella y anchoas" },
  ];

  for (const item of pizzaItems) {
    await prisma.product.create({
      data: {
        name: item.name,
        price: item.price,
        categoryId: pizzas.id,
        description: item.desc,
      },
    });
  }

  // Tartas
  const tartaItems = [
    { name: "Verdura", price: 6500, desc: "Relleno de espinaca y cebolla" },
    { name: "Capresse", price: 7000, desc: "Tomate, muzzarella y albahaca" },
    { name: "Jamón y Queso", price: 7000, desc: "Jamón cocido y muzzarella" },
    { name: "Jamón, Queso y Huevo", price: 7500, desc: "Jamón cocido, muzzarella y huevo" },
    { name: "Completa", price: 8000, desc: "Jamón, queso, huevo, tomate y cebolla" },
  ];

  for (const item of tartaItems) {
    await prisma.product.create({
      data: {
        name: item.name,
        price: item.price,
        categoryId: tartas.id,
        description: item.desc,
      },
    });
  }

  // Admin user (demo)
  const hashedPassword = bcrypt.hashSync("focaccia2026", 10);
  await prisma.adminUser.create({
    data: {
      email: "admin@focaccia.com",
      password: hashedPassword,
      name: "Focaccia Admin",
    },
  });

  console.log("✅ Seed completado:");
  console.log("   📦 3 categorías");
  console.log("   🍕 30 productos (10 empanadas, 15 pizzas, 5 tartas)");
  console.log("   ⚙️  Configuración del negocio");
  console.log("   👤 Admin: admin@focaccia.com / focaccia2026");

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
