"use client";

import type { ListPackagedProductsResponse } from "@common/models/product";
import { API_ADMIN_PRODUCTS } from "@common/models/product";
import { useQuery } from "@tanstack/react-query";

import { getRequest } from "@/libs/api-client";

export const ADMIN_PRODUCTS_QUERY_KEY = ["admin", "products"] as const;

export function useQueryAdminProducts(filters?: { categoryId?: string; search?: string }) {
  return useQuery({
    queryKey: [...ADMIN_PRODUCTS_QUERY_KEY, filters ?? {}],
    queryFn: async () => {
      const data = await getRequest({
        path: API_ADMIN_PRODUCTS.buildUrlPath(),
        params: filters,
      });
      return data as ListPackagedProductsResponse;
    },
  });
}
