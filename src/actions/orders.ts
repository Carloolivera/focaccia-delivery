"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

const CreateOrderSchema = z.object({
  type: z.enum(["DELIVERY", "PICKUP"]),
  customerName: z.string().min(2).max(100),
  customerPhone: z.string().regex(/^\d{7,15}$/, "Teléfono inválido"),
  address: z.string().max(500).optional(),
  addressNote: z.string().max(300).optional(),
  notes: z.string().max(500).optional(),
  items: z
    .array(
      z.object({
        productId: z.string().cuid(),
        quantity: z.number().int().min(1).max(100),
        price: z.number().positive(),
      })
    )
    .min(1),
});

export async function createOrder(input: z.infer<typeof CreateOrderSchema>) {
  const parsed = CreateOrderSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const data = parsed.data;
  const total = data.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order = await prisma.order.create({
    data: {
      type: data.type,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      address: data.address,
      addressNote: data.addressNote,
      notes: data.notes,
      total,
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/pedidos");

  return order;
}

export async function updateOrderStatus(
  orderId: string,
  status: "RECEIVED" | "PREPARING" | "ON_THE_WAY" | "DELIVERED" | "CANCELLED"
) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/pedidos");

  return order;
}

export async function getOrders(date?: Date) {
  const startOfDay = date ? new Date(date) : new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setHours(23, 59, 59, 999);

  return prisma.order.findMany({
    where: {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true },
      },
    },
  });
}
