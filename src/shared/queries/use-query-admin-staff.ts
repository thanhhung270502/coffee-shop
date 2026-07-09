"use client";

import type { ListStaffResponse } from "@common/models/staff";
import { API_ADMIN_STAFF } from "@common/models/staff";
import { useQuery } from "@tanstack/react-query";

import { getRequest } from "@/libs/api-client";

export const ADMIN_STAFF_QUERY_KEY = ["admin", "staff"] as const;

export function useQueryAdminStaff() {
  return useQuery({
    queryKey: ADMIN_STAFF_QUERY_KEY,
    queryFn: async () => {
      const data = await getRequest({ path: API_ADMIN_STAFF.buildUrlPath() });
      return data as ListStaffResponse;
    },
  });
}
