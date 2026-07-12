"use client";

import type { TopProductsReportResponse } from "@common/models/report";
import { API_ADMIN_REPORT_TOP_PRODUCTS } from "@common/models/report";
import { useQuery } from "@tanstack/react-query";

import { getRequest } from "@/libs/api-client";

export const ADMIN_REPORT_TOP_PRODUCTS_QUERY_KEY = ["admin", "reports", "top-products"] as const;

export function useQueryAdminReportTopProducts(params?: {
  from?: string;
  to?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: [...ADMIN_REPORT_TOP_PRODUCTS_QUERY_KEY, params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.from) searchParams.set("from", params.from);
      if (params?.to) searchParams.set("to", params.to);
      if (params?.limit) searchParams.set("limit", String(params.limit));
      const query = searchParams.toString();
      const path = query
        ? `${API_ADMIN_REPORT_TOP_PRODUCTS.buildUrlPath()}?${query}`
        : API_ADMIN_REPORT_TOP_PRODUCTS.buildUrlPath();
      const data = await getRequest({ path });
      return data as TopProductsReportResponse;
    },
  });
}
