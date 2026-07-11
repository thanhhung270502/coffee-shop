"use client";

import type { ListPublicDrinksResponse } from "@common/models/catalog";
import { API_CATALOG_DRINKS } from "@common/models/catalog";
import { useQuery } from "@tanstack/react-query";

import { getRequest } from "@/libs/api-client";

export const CATALOG_DRINKS_QUERY_KEY = ["catalog", "drinks"] as const;

export function useQueryCatalogDrinks(categorySlug?: string) {
  return useQuery({
    queryKey: [...CATALOG_DRINKS_QUERY_KEY, categorySlug ?? "all"],
    queryFn: async () => {
      const data = await getRequest({
        path: API_CATALOG_DRINKS.buildUrlPath(),
        params: categorySlug ? { categorySlug } : undefined,
      });
      return data as ListPublicDrinksResponse;
    },
  });
}
