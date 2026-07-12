import type { OrderStatus, PaymentStatus } from "@/generated/prisma";
import { prisma } from "@/libs/prisma";

export async function findOrderForPayment(id: string) {
  return prisma.order.findUnique({
    where: { id },
    select: {
      id: true,
      orderNumber: true,
      total: true,
      paymentStatus: true,
      paymentMethod: true,
      status: true,
    },
  });
}

export async function updateOrderPayment(
  id: string,
  data: {
    paymentStatus: PaymentStatus;
    paymentReference?: string;
    status?: OrderStatus;
  },
) {
  return prisma.order.update({
    where: { id },
    data: {
      paymentStatus: data.paymentStatus,
      ...(data.paymentReference !== undefined ? { paymentReference: data.paymentReference } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
    },
  });
}
