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

import { findProductById } from "../product/product.repository";
import { findOrCreateSettings } from "../settings/settings.repository";

import {
  createOrder,
  deductStockForOrder,
  findAllOrders,
  findOrderById,
  findOrderByIdAndPhone,
  findOrdersByUserId,
  getNextOrderNumber,
  getRecentOrders,
  getTodayStats,
  getTopProducts,
  updateOrderStatus,
} from "./order.repository";
import type {
  CreateDrinkOrderInput,
  CreateProductOrderInput,
  UpdateOrderStatusInput,
} from "./order.schema";

type OrderWithItems = Awaited<ReturnType<typeof findAllOrders>>[number];

function getItemOptions(options: unknown): Record<string, string> | null {
  if (!options || typeof options !== "object") return null;
  return options as Record<string, string>;
}

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
    items: order.items.map((item) => {
      const options = getItemOptions(item.options);
      return {
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        variantId: item.variantId,
        variantName: options?.variantName ?? null,
        skuId: item.skuId,
        skuLabel: options?.skuLabel ?? null,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        note: item.note,
        toppings: item.toppings.map((t) => ({
          id: t.id,
          toppingId: t.toppingId,
          name: t.name,
          price: t.price,
        })),
      };
    }),
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

export async function createDrinkOrderService(
  input: CreateDrinkOrderInput,
  userId?: string,
): Promise<OrderObject> {
  const settings = await findOrCreateSettings();
  const orderItems: {
    productId: string;
    variantId: string;
    quantity: number;
    unitPrice: number;
    note?: string;
    options?: Record<string, string>;
    toppings?: { toppingId: string; name: string; price: number }[];
  }[] = [];

  let subtotal = 0;

  for (const item of input.items) {
    const product = await findProductById(item.productId);
    if (!product || product.type !== "DRINK" || !product.isActive) {
      throw new AppError("Drink not found", 404);
    }

    const variant = product.variants.find((v) => v.id === item.variantId);
    if (!variant) {
      throw new AppError("Variant not found", 400);
    }

    const toppingIds = item.toppingIds ?? [];
    const selectedToppings = product.toppings
      .filter((pt) => toppingIds.includes(pt.topping.id) && pt.topping.isActive)
      .map((pt) => ({
        toppingId: pt.topping.id,
        name: pt.topping.name,
        price: pt.topping.price,
      }));

    if (selectedToppings.length !== toppingIds.length) {
      throw new AppError("Invalid topping selection", 400);
    }

    const toppingTotal = selectedToppings.reduce((sum, t) => sum + t.price, 0);
    const unitPrice = variant.price + toppingTotal;
    subtotal += unitPrice * item.quantity;

    orderItems.push({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      unitPrice,
      note: item.note,
      options: {
        ...(item.options?.sugar ? { sugar: item.options.sugar } : {}),
        ...(item.options?.ice ? { ice: item.options.ice } : {}),
        variantName: variant.name,
      },
      toppings: selectedToppings,
    });
  }

  const shippingFee = input.fulfillment === "DELIVERY" ? settings.baseShipping : 0;
  const total = subtotal + shippingFee;
  const orderNumber = await getNextOrderNumber();

  const order = await createOrder({
    orderNumber,
    type: "DRINK_ORDER",
    channel: "ONLINE",
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    userId,
    fulfillment: input.fulfillment,
    deliveryAddress: input.fulfillment === "DELIVERY" ? input.deliveryAddress : undefined,
    note: input.note,
    paymentMethod: input.paymentMethod,
    subtotal,
    shippingFee,
    total,
    items: orderItems,
  });

  return toOrderObject(order);
}

export async function createProductOrderService(
  input: CreateProductOrderInput,
  userId?: string,
): Promise<OrderObject> {
  const settings = await findOrCreateSettings();
  const orderItems: {
    productId: string;
    skuId: string;
    quantity: number;
    unitPrice: number;
    options?: Record<string, string>;
  }[] = [];

  let subtotal = 0;

  for (const item of input.items) {
    const product = await findProductById(item.productId);
    if (!product || product.type !== "PACKAGED" || !product.isActive) {
      throw new AppError("Product not found", 404);
    }

    const sku = product.skus.find((s) => s.id === item.skuId);
    if (!sku) {
      throw new AppError("SKU not found", 400);
    }

    if (sku.stock < item.quantity) {
      throw new AppError(`Insufficient stock for ${product.name} (${sku.label})`, 400);
    }

    subtotal += sku.price * item.quantity;

    orderItems.push({
      productId: item.productId,
      skuId: item.skuId,
      quantity: item.quantity,
      unitPrice: sku.price,
      options: { skuLabel: sku.label },
    });
  }

  const shippingFee = settings.baseShipping;
  const total = subtotal + shippingFee;
  const orderNumber = await getNextOrderNumber();

  const order = await createOrder({
    orderNumber,
    type: "PRODUCT_ORDER",
    channel: "ONLINE",
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    userId,
    shippingAddress: input.shippingAddress,
    note: input.note,
    paymentMethod: input.paymentMethod,
    subtotal,
    shippingFee,
    total,
    items: orderItems,
  });

  return toOrderObject(order);
}

export async function getPublicOrderService(id: string, phone: string): Promise<OrderObject> {
  const order = await findOrderByIdAndPhone(id, phone);
  if (!order) {
    throw new AppError("Order not found", 404);
  }
  return toOrderObject(order);
}

export async function listCustomerOrdersService(userId: string): Promise<OrderObject[]> {
  const orders = await findOrdersByUserId(userId);
  return orders.map(toOrderObject);
}
