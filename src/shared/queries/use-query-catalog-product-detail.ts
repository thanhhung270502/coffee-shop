"use client";

import type { GetPublicProductResponse } from "@common/models/catalog";
import { API_CATALOG_PRODUCT_DETAIL } from "@common/models/catalog";
import { useQuery } from "@tanstack/react-query";

import { getRequest } from "@/libs/api-client";

export const CATALOG_PRODUCT_DETAIL_QUERY_KEY = ["catalog", "product"] as const;

export function useQueryCatalogProductDetail(slug: string) {
  return useQuery({
    queryKey: [...CATALOG_PRODUCT_DETAIL_QUERY_KEY, slug],
    queryFn: async () => {
      const data = await getRequest({
        path: API_CATALOG_PRODUCT_DETAIL.buildUrlPath(slug),
      });
      return data as GetPublicProductResponse;
    },
    enabled: Boolean(slug),
  });
}
