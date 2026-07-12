"use client";

import type { RevenueSeriesResponse } from "@common/models/report";
import { API_ADMIN_REVENUE } from "@common/models/report";
import { useQuery } from "@tanstack/react-query";

import { getRequest } from "@/libs/api-client";

export const ADMIN_REVENUE_QUERY_KEY = ["admin", "reports", "revenue"] as const;

export function useQueryAdminRevenue(params?: {
  from?: string;
  to?: string;
  groupBy?: "day" | "week" | "month";
}) {
  return useQuery({
    queryKey: [...ADMIN_REVENUE_QUERY_KEY, params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.from) searchParams.set("from", params.from);
      if (params?.to) searchParams.set("to", params.to);
      if (params?.groupBy) searchParams.set("groupBy", params.groupBy);
      const query = searchParams.toString();
      const path = query
        ? `${API_ADMIN_REVENUE.buildUrlPath()}?${query}`
        : API_ADMIN_REVENUE.buildUrlPath();
      const data = await getRequest({ path });
      return data as RevenueSeriesResponse;
    },
  });
}
