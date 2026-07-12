import { ListOrdersPayload } from "@common/models/order";

export const QUERY_KEYS = {
  // Admin
  ADMIN_ORDERS: "admin-orders",
};

export const ADMIN_ORDERS_KEYS = {
  all: () => [QUERY_KEYS.ADMIN_ORDERS] as const,
  lists: () => [...ADMIN_ORDERS_KEYS.all(), "list"] as const,
  list: (params: ListOrdersPayload) => [...ADMIN_ORDERS_KEYS.lists(), params] as const,
} as const;
