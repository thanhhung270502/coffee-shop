import { ListCategoriesPayload } from "@common/models/category";
import { ListOrdersPayload } from "@common/models/order";
import { ListDrinksPayload, ListPackagedProductsPayload } from "@common/models/product";

export const QUERY_KEYS = {
  // Admin
  ADMIN_ORDERS: "admin-orders",
  ADMIN_CATEGORIES: "admin-categories",
  ADMIN_DRINKS: "admin-drinks",
  ADMIN_PRODUCTS: "admin-products",
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

export const ADMIN_DRINKS_KEYS = {
  all: () => [QUERY_KEYS.ADMIN_DRINKS] as const,
  lists: () => [...ADMIN_DRINKS_KEYS.all(), "list"] as const,
  list: (params: ListDrinksPayload) => [...ADMIN_DRINKS_KEYS.lists(), params] as const,
} as const;

export const ADMIN_PRODUCTS_KEYS = {
  all: () => [QUERY_KEYS.ADMIN_PRODUCTS] as const,
  lists: () => [...ADMIN_PRODUCTS_KEYS.all(), "list"] as const,
  list: (params: ListPackagedProductsPayload) =>
    [...ADMIN_PRODUCTS_KEYS.lists(), params] as const,
} as const;
