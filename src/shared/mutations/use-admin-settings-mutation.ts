"use client";

import type {
  UpdateShopSettingsRequest,
  UpdateShopSettingsResponse,
} from "@common/models/settings";
import { API_ADMIN_SETTINGS_UPDATE } from "@common/models/settings";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { patchRequest } from "@/libs/api-client";
import { ADMIN_SETTINGS_QUERY_KEY } from "@/shared/queries/use-query-admin-settings";

export function useUpdateSettingsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateShopSettingsRequest) =>
      (await patchRequest<UpdateShopSettingsRequest>({
        path: API_ADMIN_SETTINGS_UPDATE.buildUrlPath(),
        data,
      })) as UpdateShopSettingsResponse,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADMIN_SETTINGS_QUERY_KEY }),
  });
}
