"use client";

import type { GetOrderResponse } from "@common/models/order";
import { API_ADMIN_ORDER_BY_ID } from "@common/models/order";
import { useQuery } from "@tanstack/react-query";

import { getRequest } from "@/libs/api-client";

export function useQueryAdminOrderDetail(id: string) {
  return useQuery({
    queryKey: ["admin", "orders", id],
    queryFn: async () => {
      const data = await getRequest({ path: API_ADMIN_ORDER_BY_ID.buildUrlPath(id) });
      return data as GetOrderResponse;
    },
    enabled: Boolean(id),
  });
}
