"use client";

import type { GetPublicOrderResponse } from "@common/models/order";
import { API_PUBLIC_ORDER } from "@common/models/order";
import { useQuery } from "@tanstack/react-query";

import { getRequest } from "@/libs/api-client";

export const PUBLIC_ORDER_QUERY_KEY = ["orders", "public"] as const;

export function useQueryPublicOrder(id: string, phone: string) {
  return useQuery({
    queryKey: [...PUBLIC_ORDER_QUERY_KEY, id, phone],
    queryFn: async () => {
      const data = await getRequest({
        path: API_PUBLIC_ORDER.buildUrlPath(id),
        params: { phone },
      });
      return data as GetPublicOrderResponse;
    },
    enabled: Boolean(id && phone),
    refetchInterval: 30_000,
  });
}
