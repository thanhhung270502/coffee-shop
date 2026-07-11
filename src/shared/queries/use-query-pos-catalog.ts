"use client";

import type { POSCatalogResponse } from "@common/models/pos";
import { API_POS_CATALOG } from "@common/models/pos";
import { useQuery } from "@tanstack/react-query";

import { getRequest } from "@/libs/api-client";

export const POS_CATALOG_QUERY_KEY = ["pos", "catalog"] as const;

export function useQueryPosCatalog() {
  return useQuery({
    queryKey: POS_CATALOG_QUERY_KEY,
    queryFn: async () => {
      const data = await getRequest({ path: API_POS_CATALOG.buildUrlPath() });
      return data as POSCatalogResponse;
    },
    staleTime: 60_000,
  });
}
