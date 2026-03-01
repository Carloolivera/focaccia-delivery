"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface CreateOrderInput {
  type: "DELIVERY" | "PICKUP";
  customerName: string;
  customerPhone: string;
  address?: string;
  addressNote?: string;
  notes?: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
}

export async function createOrder(input: CreateOrderInput) {
  const total = input.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Obtener el último número de pedido
  const lastOrder = await prisma.order.findFirst({
    orderBy: { orderNumber: "desc" },
    select: { orderNumber: true },
  });
  const nextNumber = (lastOrder?.orderNumber || 0) + 1;

  const order = await prisma.order.create({
    data: {
      orderNumber: nextNumber,
      type: input.type,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      address: input.address,
      addressNote: input.addressNote,
      notes: input.notes,
      total,
      items: {
        create: input.items.map((item) => ({
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
