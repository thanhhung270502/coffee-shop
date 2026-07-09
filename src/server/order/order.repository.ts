import type { OrderChannel, OrderStatus, OrderType } from "@/generated/prisma";
import { prisma } from "@/libs/prisma";

const orderInclude = {
  items: {
    include: {
      product: true,
      toppings: true,
    },
  },
} as const;

export async function findAllOrders(filters?: {
  type?: OrderType;
  status?: OrderStatus;
  channel?: OrderChannel;
  from?: Date;
  to?: Date;
}) {
  return prisma.order.findMany({
    where: {
      ...(filters?.type ? { type: filters.type } : {}),
      ...(filters?.status ? { status: filters.status } : {}),
      ...(filters?.channel ? { channel: filters.channel } : {}),
      ...(filters?.from || filters?.to
        ? {
            createdAt: {
              ...(filters.from ? { gte: filters.from } : {}),
              ...(filters.to ? { lte: filters.to } : {}),
            },
          }
        : {}),
    },
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function findOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: orderInclude,
  });
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  return prisma.order.update({
    where: { id },
    data: { status },
    include: orderInclude,
  });
}

export async function deductStockForOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) return;

  for (const item of order.items) {
    if (item.skuId) {
      await prisma.productSku.update({
        where: { id: item.skuId },
        data: { stock: { decrement: item.quantity } },
      });
    }
  }
}

export async function getTodayStats() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [revenue, orderCount, pendingCount] = await Promise.all([
    prisma.order.aggregate({
      where: {
        createdAt: { gte: startOfDay },
        status: { not: "CANCELLED" },
      },
      _sum: { total: true },
    }),
    prisma.order.count({
      where: { createdAt: { gte: startOfDay }, status: { not: "CANCELLED" } },
    }),
    prisma.order.count({
      where: { status: { in: ["PENDING", "CONFIRMED", "PREPARING"] } },
    }),
  ]);

  return {
    revenueToday: revenue._sum.total ?? 0,
    ordersToday: orderCount,
    pendingOrders: pendingCount,
  };
}

export async function getTopProducts(limit = 5) {
  const items = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: limit,
  });

  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true },
  });

  return items.map((item) => ({
    productId: item.productId,
    productName: products.find((p) => p.id === item.productId)?.name ?? "Unknown",
    quantitySold: item._sum.quantity ?? 0,
  }));
}

export async function getRecentOrders(limit = 5) {
  return prisma.order.findMany({
    where: {},
    include: orderInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
