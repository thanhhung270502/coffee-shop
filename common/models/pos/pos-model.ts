import type { PublicCategoryObject } from "../catalog/catalog-model";
import type { PublicDrinkObject } from "../catalog/catalog-model";
import type { OrderObject } from "../order/order-model";

/** POS Catalog */
export type POSCatalogResponse = {
  categories: PublicCategoryObject[];
  drinks: PublicDrinkObject[];
};

/** POS Order Creation */
export type POSOrderItemInput = {
  productId: string;
  variantId: string;
  toppingIds?: string[];
  quantity: number;
  note?: string;
  options?: { sugar?: string; ice?: string };
};

export type CreatePosOrderRequest = {
  customerName?: string;
  note?: string;
  paymentMethod: "CASH" | "BANK_TRANSFER";
  paymentReference?: string;
  shippingFee?: number;
  discount?: number;
  taxRate?: number;
  items: POSOrderItemInput[];
};

export type CreatePosOrderResponse = {
  order: OrderObject;
};

/** POS Queue */
export type ListPosQueueResponse = {
  orders: OrderObject[];
};

/** POS Update Order Status */
export type UpdatePosOrderStatusRequest = {
  status: string;
};

export type UpdatePosOrderStatusResponse = {
  order: OrderObject;
};

/** POS Receipt */
export type GetPosReceiptResponse = {
  order: OrderObject;
};
