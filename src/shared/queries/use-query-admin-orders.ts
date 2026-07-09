"use client";

import type { ListOrdersResponse } from "@common/models/order";
import { API_ADMIN_ORDERS } from "@common/models/order";
import { useQuery } from "@tanstack/react-query";

import { getRequest } from "@/libs/api-client";

export const ADMIN_ORDERS_QUERY_KEY = ["admin", "orders"] as const;

export function useQueryAdminOrders(filters?: Record<string, string | undefined>) {
  return useQuery({
    queryKey: [...ADMIN_ORDERS_QUERY_KEY, filters ?? {}],
    queryFn: async () => {
      const data = await getRequest({
        path: API_ADMIN_ORDERS.buildUrlPath(),
        params: filters,
      });
      return data as ListOrdersResponse;
    },
  });
}
