"use client";

import type { ListDrinksPayload, ListDrinksResponse } from "@common/models/product";
import { API_ADMIN_DRINKS } from "@common/models/product";
import { useQuery } from "@tanstack/react-query";

import { postRequest } from "@/libs/api-client";
import { ADMIN_DRINKS_KEYS } from "@/shared/constants/query-keys.constant";

export function useQueryAdminDrinks({ input }: { input: ListDrinksPayload }) {
  return useQuery({
    queryKey: ADMIN_DRINKS_KEYS.list(input),
    queryFn: async () => {
      const data = await postRequest<ListDrinksPayload>({
        path: API_ADMIN_DRINKS.buildUrlPath(),
        data: input,
      });
      return data as ListDrinksResponse;
    },
  });
}
