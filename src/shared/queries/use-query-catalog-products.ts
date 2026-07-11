"use client";

import type { ListPublicProductsResponse } from "@common/models/catalog";
import { API_CATALOG_PRODUCTS } from "@common/models/catalog";
import { useQuery } from "@tanstack/react-query";

import { getRequest } from "@/libs/api-client";

export const CATALOG_PRODUCTS_QUERY_KEY = ["catalog", "products"] as const;

export function useQueryCatalogProducts(categorySlug?: string) {
  return useQuery({
    queryKey: [...CATALOG_PRODUCTS_QUERY_KEY, categorySlug ?? "all"],
    queryFn: async () => {
      const data = await getRequest({
        path: API_CATALOG_PRODUCTS.buildUrlPath(),
        params: categorySlug ? { categorySlug } : undefined,
      });
      return data as ListPublicProductsResponse;
    },
  });
}
