"use client";

import { API_SHOP_SETTINGS } from "@common/models/catalog";
import type { GetShopSettingsResponse } from "@common/models/settings";
import { useQuery } from "@tanstack/react-query";

import { getRequest } from "@/libs/api-client";

export const SHOP_SETTINGS_QUERY_KEY = ["shop", "settings"] as const;

export function useQueryShopSettings() {
  return useQuery({
    queryKey: SHOP_SETTINGS_QUERY_KEY,
    queryFn: async () => {
      const data = await getRequest({
        path: API_SHOP_SETTINGS.buildUrlPath(),
      });
      return data as GetShopSettingsResponse;
    },
  });
}
