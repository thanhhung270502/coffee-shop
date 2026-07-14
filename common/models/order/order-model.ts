import { PageableResponse, PaginationQueryParams } from "../api-base";

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

export enum EPaymentMethod {
  CASH = "CASH",
  BANK_TRANSFER = "BANK_TRANSFER",
  COD = "COD",
  VNPAY = "VNPAY",
  MOMO = "MOMO",
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
  paymentMethod: EPaymentMethod | null;
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
  taxAmount: number;
  taxRate: number;
  total: number;
  items: OrderItemObject[];
  createdAt: string;
  updatedAt: string;
};

export type ListOrdersResponse = PageableResponse<OrderObject>;

export interface ListOrdersPayload extends PaginationQueryParams {
  search?: string;
  types?: EOrderType[];
  statuses?: EOrderStatus[];
  channels?: EOrderChannel[];
  fromDate?: string;
  toDate?: string;
}

export type GetOrderResponse = {
  order: OrderObject;
};

export type UpdateOrderStatusRequest = {
  status: EOrderStatus;
};

export type UpdateOrderStatusResponse = {
  order: OrderObject;
};

export type DrinkOrderItemOptions = {
  sugar?: string;
  ice?: string;
};

export type DrinkOrderItemInput = {
  productId: string;
  variantId: string;
  toppingIds?: string[];
  quantity: number;
  note?: string;
  options?: DrinkOrderItemOptions;
};

export type ProductOrderItemInput = {
  productId: string;
  skuId: string;
  quantity: number;
};

export type CreateDrinkOrderRequest = {
  customerName: string;
  customerPhone: string;
  fulfillment: EFulfillmentType;
  deliveryAddress?: string;
  note?: string;
  paymentMethod: EPaymentMethod;
  items: DrinkOrderItemInput[];
};

export type CreateProductOrderRequest = {
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  note?: string;
  paymentMethod: EPaymentMethod;
  items: ProductOrderItemInput[];
};

export type CreateDrinkOrderResponse = {
  order: OrderObject;
};

export type CreateProductOrderResponse = {
  order: OrderObject;
};

export type GetPublicOrderResponse = {
  order: OrderObject;
};

export type ListCustomerOrdersResponse = {
  orders: OrderObject[];
};
