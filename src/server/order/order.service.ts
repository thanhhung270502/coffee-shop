import type { OrderObject } from "@common/models/order";
import {
  EFulfillmentType,
  EOrderChannel,
  EOrderStatus,
  EOrderType,
  EPaymentStatus,
} from "@common/models/order";

import type { OrderChannel, OrderStatus, OrderType } from "@/generated/prisma";
import { AppError } from "@/libs/errors";

import {
  deductStockForOrder,
  findAllOrders,
  findOrderById,
  getRecentOrders,
  getTodayStats,
  getTopProducts,
  updateOrderStatus,
} from "./order.repository";
import type { UpdateOrderStatusInput } from "./order.schema";

type OrderWithItems = Awaited<ReturnType<typeof findAllOrders>>[number];

function toOrderObject(order: OrderWithItems): OrderObject {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    type: order.type as EOrderType,
    channel: order.channel as EOrderChannel,
    status: order.status as EOrderStatus,
    paymentStatus: order.paymentStatus as EPaymentStatus,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    fulfillment: order.fulfillment as EFulfillmentType | null,
    deliveryAddress: order.deliveryAddress,
    shippingAddress: order.shippingAddress,
    note: order.note,
    subtotal: order.subtotal,
    shippingFee: order.shippingFee,
    discount: order.discount,
    total: order.total,
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      variantId: item.variantId,
      variantName: null,
      skuId: item.skuId,
      skuLabel: null,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      note: item.note,
      toppings: item.toppings.map((t) => ({
        id: t.id,
        toppingId: t.toppingId,
        name: t.name,
        price: t.price,
      })),
    })),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "PREPARING", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY", "CANCELLED"],
  READY: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export async function listOrders(filters?: {
  type?: OrderType;
  status?: OrderStatus;
  channel?: OrderChannel;
  from?: string;
  to?: string;
}): Promise<OrderObject[]> {
  const orders = await findAllOrders({
    type: filters?.type,
    status: filters?.status,
    channel: filters?.channel,
    from: filters?.from ? new Date(filters.from) : undefined,
    to: filters?.to ? new Date(filters.to) : undefined,
  });
  return orders.map(toOrderObject);
}

export async function getOrderById(id: string): Promise<OrderObject> {
  const order = await findOrderById(id);
  if (!order) {
    throw new AppError("Order not found", 404);
  }
  return toOrderObject(order);
}

export async function updateOrderStatusService(
  id: string,
  input: UpdateOrderStatusInput,
): Promise<OrderObject> {
  const order = await findOrderById(id);
  if (!order) {
    throw new AppError("Order not found", 404);
  }

  const allowed = VALID_TRANSITIONS[order.status];
  if (!allowed.includes(input.status)) {
    throw new AppError(`Cannot transition from ${order.status} to ${input.status}`, 400);
  }

  if (
    order.type === "PRODUCT_ORDER" &&
    input.status === "CONFIRMED" &&
    order.status === "PENDING"
  ) {
    await deductStockForOrder(id);
  }

  const updated = await updateOrderStatus(id, input.status);
  return toOrderObject(updated);
}

export async function getDashboardStats() {
  const stats = await getTodayStats();
  const recentOrders = await getRecentOrders(5);
  return {
    ...stats,
    recentOrders: recentOrders.map(toOrderObject),
  };
}

export async function getDashboardTopProducts() {
  return getTopProducts(5);
}
