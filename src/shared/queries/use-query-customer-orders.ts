"use client";

import type { ListCustomerOrdersResponse } from "@common/models/order";
import { API_CUSTOMER_ORDERS } from "@common/models/order";
import { useQuery } from "@tanstack/react-query";

import { getRequest } from "@/libs/api-client";

export const CUSTOMER_ORDERS_QUERY_KEY = ["orders", "mine"] as const;

export function useQueryCustomerOrders(enabled = true) {
  return useQuery({
    queryKey: CUSTOMER_ORDERS_QUERY_KEY,
    queryFn: async () => {
      const data = await getRequest({
        path: API_CUSTOMER_ORDERS.buildUrlPath(),
      });
      return data as ListCustomerOrdersResponse;
    },
    enabled,
  });
}
