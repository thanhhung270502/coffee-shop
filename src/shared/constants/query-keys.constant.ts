import { ListCategoriesPayload } from "@common/models/category";
import { ListOrdersPayload } from "@common/models/order";

export const QUERY_KEYS = {
  // Admin
  ADMIN_ORDERS: "admin-orders",
  ADMIN_CATEGORIES: "admin-categories",
};

export const ADMIN_ORDERS_KEYS = {
  all: () => [QUERY_KEYS.ADMIN_ORDERS] as const,
  lists: () => [...ADMIN_ORDERS_KEYS.all(), "list"] as const,
  list: (params: ListOrdersPayload) => [...ADMIN_ORDERS_KEYS.lists(), params] as const,
} as const;

export const ADMIN_CATEGORIES_KEYS = {
  all: () => [QUERY_KEYS.ADMIN_CATEGORIES] as const,
  lists: () => [...ADMIN_CATEGORIES_KEYS.all(), "list"] as const,
  list: (params: ListCategoriesPayload) => [...ADMIN_CATEGORIES_KEYS.lists(), params] as const,
} as const;
