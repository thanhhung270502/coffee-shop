"use client";

import type { ListDrinksResponse } from "@common/models/product";
import { API_ADMIN_DRINKS } from "@common/models/product";
import { useQuery } from "@tanstack/react-query";

import { getRequest } from "@/libs/api-client";

export const ADMIN_DRINKS_QUERY_KEY = ["admin", "drinks"] as const;

export function useQueryAdminDrinks(filters?: { categoryId?: string; search?: string }) {
  return useQuery({
    queryKey: [...ADMIN_DRINKS_QUERY_KEY, filters ?? {}],
    queryFn: async () => {
      const data = await getRequest({
        path: API_ADMIN_DRINKS.buildUrlPath(),
        params: filters,
      });
      return data as ListDrinksResponse;
    },
  });
}
