"use client";

import type { ListPublicCategoriesResponse } from "@common/models/catalog";
import { API_CATALOG_CATEGORIES } from "@common/models/catalog";
import type { EProductType } from "@common/models/category";
import { useQuery } from "@tanstack/react-query";

import { getRequest } from "@/libs/api-client";

export const CATALOG_CATEGORIES_QUERY_KEY = ["catalog", "categories"] as const;

export function useQueryCatalogCategories(type?: EProductType) {
  return useQuery({
    queryKey: [...CATALOG_CATEGORIES_QUERY_KEY, type ?? "all"],
    queryFn: async () => {
      const data = await getRequest({
        path: API_CATALOG_CATEGORIES.buildUrlPath(),
        params: type ? { type } : undefined,
      });
      return data as ListPublicCategoriesResponse;
    },
  });
}
