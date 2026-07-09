"use client";

import type { DashboardStatsResponse } from "@common/models/dashboard";
import { API_ADMIN_DASHBOARD_STATS } from "@common/models/dashboard";
import { useQuery } from "@tanstack/react-query";

import { getRequest } from "@/libs/api-client";

export const ADMIN_DASHBOARD_QUERY_KEY = ["admin", "dashboard"] as const;

export function useQueryAdminDashboard() {
  return useQuery({
    queryKey: ADMIN_DASHBOARD_QUERY_KEY,
    queryFn: async () => {
      const data = await getRequest({ path: API_ADMIN_DASHBOARD_STATS.buildUrlPath() });
      return data as DashboardStatsResponse;
    },
  });
}
