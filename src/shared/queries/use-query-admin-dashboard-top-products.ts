"use client";

import type { DashboardTopProductsResponse } from "@common/models/dashboard";
import { API_ADMIN_DASHBOARD_TOP_PRODUCTS } from "@common/models/dashboard";
import { useQuery } from "@tanstack/react-query";

import { getRequest } from "@/libs/api-client";

export const ADMIN_DASHBOARD_TOP_PRODUCTS_QUERY_KEY = ["admin", "dashboard", "top-products"] as const;

export function useQueryAdminDashboardTopProducts() {
  return useQuery({
    queryKey: ADMIN_DASHBOARD_TOP_PRODUCTS_QUERY_KEY,
    queryFn: async () => {
      const data = await getRequest({ path: API_ADMIN_DASHBOARD_TOP_PRODUCTS.buildUrlPath() });
      return data as DashboardTopProductsResponse;
    },
  });
}
