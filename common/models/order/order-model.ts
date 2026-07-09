export enum EOrderType {
  DRINK_ORDER = "DRINK_ORDER",
  PRODUCT_ORDER = "PRODUCT_ORDER",
}

export enum EOrderChannel {
  ONLINE = "ONLINE",
  POS = "POS",
}

export enum EOrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PREPARING = "PREPARING",
  READY = "READY",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum EPaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  REFUNDED = "REFUNDED",
}

export enum EFulfillmentType {
  DELIVERY = "DELIVERY",
  PICKUP = "PICKUP",
}

export type OrderItemToppingObject = {
  id: string;
  toppingId: string;
  name: string;
  price: number;
};

export type OrderItemObject = {
  id: string;
  productId: string;
  productName: string;
  variantId: string | null;
  variantName: string | null;
  skuId: string | null;
  skuLabel: string | null;
  quantity: number;
  unitPrice: number;
  note: string | null;
  toppings: OrderItemToppingObject[];
};

export type OrderObject = {
  id: string;
  orderNumber: string;
  type: EOrderType;
  channel: EOrderChannel;
  status: EOrderStatus;
  paymentStatus: EPaymentStatus;
  customerName: string | null;
  customerPhone: string | null;
  fulfillment: EFulfillmentType | null;
  deliveryAddress: string | null;
  shippingAddress: string | null;
  note: string | null;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  items: OrderItemObject[];
  createdAt: string;
  updatedAt: string;
};

export type ListOrdersResponse = {
  orders: OrderObject[];
};

export type GetOrderResponse = {
  order: OrderObject;
};

export type UpdateOrderStatusRequest = {
  status: EOrderStatus;
};

export type UpdateOrderStatusResponse = {
  order: OrderObject;
};
