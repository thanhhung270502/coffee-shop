"use client";

import type { GetPublicDrinkResponse } from "@common/models/catalog";
import { API_CATALOG_DRINK_DETAIL } from "@common/models/catalog";
import { useQuery } from "@tanstack/react-query";

import { getRequest } from "@/libs/api-client";

export const CATALOG_DRINK_DETAIL_QUERY_KEY = ["catalog", "drink"] as const;

export function useQueryCatalogDrinkDetail(slug: string) {
  return useQuery({
    queryKey: [...CATALOG_DRINK_DETAIL_QUERY_KEY, slug],
    queryFn: async () => {
      const data = await getRequest({
        path: API_CATALOG_DRINK_DETAIL.buildUrlPath(slug),
      });
      return data as GetPublicDrinkResponse;
    },
    enabled: Boolean(slug),
  });
}
