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

export async function findOrderByIdAndPhone(id: string, phone: string) {
  return prisma.order.findFirst({
    where: { id, customerPhone: phone },
    include: orderInclude,
  });
}

export async function findOrdersByUserId(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function getNextOrderNumber() {
  const count = await prisma.order.count();
  return `#${String(count + 1).padStart(3, "0")}`;
}

type CreateOrderItemData = {
  productId: string;
  variantId?: string;
  skuId?: string;
  quantity: number;
  unitPrice: number;
  note?: string;
  options?: Record<string, string>;
  toppings?: { toppingId: string; name: string; price: number }[];
};

export async function createOrder(data: {
  orderNumber: string;
  type: OrderType;
  channel: OrderChannel;
  customerName?: string;
  customerPhone?: string;
  userId?: string;
  createdById?: string;
  fulfillment?: "DELIVERY" | "PICKUP";
  deliveryAddress?: string;
  shippingAddress?: string;
  note?: string;
  paymentMethod: "COD" | "BANK_TRANSFER" | "CASH" | "MOMO";
  paymentStatus?: "PENDING" | "PAID";
  subtotal: number;
  shippingFee: number;
  total: number;
  items: CreateOrderItemData[];
}) {
  return prisma.order.create({
    data: {
      orderNumber: data.orderNumber,
      type: data.type,
      channel: data.channel,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      userId: data.userId,
      createdById: data.createdById,
      fulfillment: data.fulfillment,
      deliveryAddress: data.deliveryAddress,
      shippingAddress: data.shippingAddress,
      note: data.note,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentStatus,
      subtotal: data.subtotal,
      shippingFee: data.shippingFee,
      total: data.total,
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          skuId: item.skuId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          note: item.note,
          options: item.options,
          toppings: item.toppings?.length
            ? {
                create: item.toppings.map((t) => ({
                  toppingId: t.toppingId,
                  name: t.name,
                  price: t.price,
                })),
              }
            : undefined,
        })),
      },
    },
    include: orderInclude,
  });
}

export async function findPosQueue() {
  return prisma.order.findMany({
    where: {
      type: "DRINK_ORDER",
      status: { in: ["PENDING", "PREPARING", "READY"] },
    },
    include: orderInclude,
    orderBy: { createdAt: "asc" },
  });
}

export async function getTodayPosRevenue() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const result = await prisma.order.aggregate({
    where: {
      channel: "POS",
      type: "DRINK_ORDER",
      status: { not: "CANCELLED" },
      createdAt: { gte: startOfDay },
    },
    _sum: { total: true },
    _count: true,
  });

  return {
    revenue: result._sum.total ?? 0,
    count: result._count,
  };
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
