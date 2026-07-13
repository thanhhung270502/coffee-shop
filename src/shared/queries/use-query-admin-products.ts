"use client";

import type {
  ListPackagedProductsPayload,
  ListPackagedProductsResponse,
} from "@common/models/product";
import { API_ADMIN_PRODUCTS } from "@common/models/product";
import { useQuery } from "@tanstack/react-query";

import { postRequest } from "@/libs/api-client";
import { ADMIN_PRODUCTS_KEYS } from "@/shared/constants/query-keys.constant";

export function useQueryAdminProducts({ input }: { input: ListPackagedProductsPayload }) {
  return useQuery({
    queryKey: ADMIN_PRODUCTS_KEYS.list(input),
    queryFn: async () => {
      const data = await postRequest<ListPackagedProductsPayload>({
        path: API_ADMIN_PRODUCTS.buildUrlPath(),
        data: input,
      });
      return data as ListPackagedProductsResponse;
    },
  });
}
