"use client";

import type { ListToppingsResponse } from "@common/models/topping";
import { API_ADMIN_TOPPINGS } from "@common/models/topping";
import { useQuery } from "@tanstack/react-query";

import { getRequest } from "@/libs/api-client";

export const ADMIN_TOPPINGS_QUERY_KEY = ["admin", "toppings"] as const;

export function useQueryAdminToppings() {
  return useQuery({
    queryKey: ADMIN_TOPPINGS_QUERY_KEY,
    queryFn: async () => {
      const data = await getRequest({ path: API_ADMIN_TOPPINGS.buildUrlPath() });
      return data as ListToppingsResponse;
    },
  });
}
