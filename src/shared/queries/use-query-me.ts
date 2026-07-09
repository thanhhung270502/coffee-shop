"use client";

import { useQuery } from "@tanstack/react-query";

import { API_ME } from "@common/models/auth";
import type { MeResponse } from "@common/models/auth";
import { getRequest } from "@/libs/api-client";

export const ME_QUERY_KEY = ["auth", "me"] as const;

export function useQueryMe() {
  return useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: async () => {
      const data = await getRequest({ path: API_ME.buildUrlPath() });
      return data as MeResponse;
    },
    retry: false,
  });
}
