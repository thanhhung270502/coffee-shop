"use client";

import type { EProductType, ListCategoriesResponse } from "@common/models/category";
import { API_ADMIN_CATEGORIES } from "@common/models/category";
import { useQuery } from "@tanstack/react-query";

import { getRequest } from "@/libs/api-client";

export const ADMIN_CATEGORIES_QUERY_KEY = ["admin", "categories"] as const;

export function useQueryAdminCategories(type?: EProductType) {
  return useQuery({
    queryKey: [...ADMIN_CATEGORIES_QUERY_KEY, type ?? "all"],
    queryFn: async () => {
      const data = await getRequest({
        path: API_ADMIN_CATEGORIES.buildUrlPath(),
        params: type ? { type } : undefined,
      });
      return data as ListCategoriesResponse;
    },
  });
}
