"use server";

import { prisma } from "@/lib/db";

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      products: {
        where: { available: true },
        orderBy: { name: "asc" },
      },
    },
  });
}

export async function getSettings() {
  return prisma.settings.findUnique({
    where: { id: "main" },
  });
}

export async function toggleOpen(isOpen: boolean) {
  return prisma.settings.update({
    where: { id: "main" },
    data: { isOpen },
  });
}
