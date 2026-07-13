"use client";

import type { ListStaffPayload, ListStaffResponse } from "@common/models/staff";
import { API_ADMIN_STAFF } from "@common/models/staff";
import { useQuery } from "@tanstack/react-query";

import { postRequest } from "@/libs/api-client";
import { ADMIN_STAFF_KEYS } from "@/shared/constants/query-keys.constant";
import type { QueryProps } from "@/shared/types/query-client";

type UseQueryAdminStaffProps = QueryProps<ListStaffResponse, ListStaffPayload>;

export function useQueryAdminStaff({ input }: UseQueryAdminStaffProps) {
  return useQuery({
    queryKey: ADMIN_STAFF_KEYS.list(input),
    queryFn: async () => {
      const result = await postRequest<ListStaffPayload>({
        path: API_ADMIN_STAFF.buildUrlPath(),
        data: input,
      });
      return result as ListStaffResponse;
    },
  });
}
