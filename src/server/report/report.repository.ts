import { prisma } from "@/libs/prisma";

import type { GroupBy, RevenuePoint, TopProductItem } from "./report.types";

function buildDateRange(from?: string, to?: string) {
  const where: { gte?: Date; lte?: Date } = {};
  if (from) where.gte = new Date(from);
  if (to) {
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);
    where.lte = toDate;
  }
  return Object.keys(where).length > 0 ? where : undefined;
}

export async function getRevenueSeries(
  from?: string,
  to?: string,
  groupBy: GroupBy = "day",
): Promise<RevenuePoint[]> {
  const createdAtFilter = buildDateRange(from, to);

  const orders = await prisma.order.findMany({
    where: {
      status: { not: "CANCELLED" },
      ...(createdAtFilter ? { createdAt: createdAtFilter } : {}),
    },
    select: { total: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const map = new Map<string, { revenue: number; orders: number }>();

  for (const order of orders) {
    const d = order.createdAt;
    let key: string;

    if (groupBy === "month") {
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    } else if (groupBy === "week") {
      const startOfWeek = new Date(d);
      startOfWeek.setDate(d.getDate() - d.getDay());
      key = startOfWeek.toISOString().slice(0, 10);
    } else {
      key = d.toISOString().slice(0, 10);
    }

    const existing = map.get(key) ?? { revenue: 0, orders: 0 };
    map.set(key, { revenue: existing.revenue + order.total, orders: existing.orders + 1 });
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, stats]) => ({ date, ...stats }));
}

export async function getTopProductsWithRevenue(
  from?: string,
  to?: string,
  limit = 10,
): Promise<TopProductItem[]> {
  const createdAtFilter = buildDateRange(from, to);

  const items = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: {
      order: {
        status: { not: "CANCELLED" },
        ...(createdAtFilter ? { createdAt: createdAtFilter } : {}),
      },
    },
    _sum: { quantity: true, unitPrice: true },
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
    revenue: (item._sum.quantity ?? 0) * (item._sum.unitPrice ?? 0),
  }));
}

export async function getExportOrdersData(from?: string, to?: string) {
  const createdAtFilter = buildDateRange(from, to);

  return prisma.order.findMany({
    where: createdAtFilter ? { createdAt: createdAtFilter } : {},
    include: {
      items: {
        include: { product: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
