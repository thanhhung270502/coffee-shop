"use client";

import type { GetShopSettingsResponse } from "@common/models/settings";
import { API_ADMIN_SETTINGS } from "@common/models/settings";
import { useQuery } from "@tanstack/react-query";

import { getRequest } from "@/libs/api-client";

export const ADMIN_SETTINGS_QUERY_KEY = ["admin", "settings"] as const;

export function useQueryAdminSettings() {
  return useQuery({
    queryKey: ADMIN_SETTINGS_QUERY_KEY,
    queryFn: async () => {
      const data = await getRequest({ path: API_ADMIN_SETTINGS.buildUrlPath() });
      return data as GetShopSettingsResponse;
    },
  });
}
