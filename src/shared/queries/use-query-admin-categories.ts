"use client";

import type { ListCategoriesPayload, ListCategoriesResponse } from "@common/models/category";
import { API_ADMIN_CATEGORIES } from "@common/models/category";
import { useQuery } from "@tanstack/react-query";

import { postRequest } from "@/libs/api-client";

import { ADMIN_CATEGORIES_KEYS } from "../constants";
import type { QueryProps } from "../types/query-client";

type UseQueryAdminCategoriesProps = QueryProps<ListCategoriesResponse, ListCategoriesPayload>;

export function useQueryAdminCategories({ input }: UseQueryAdminCategoriesProps) {
  return useQuery({
    queryKey: ADMIN_CATEGORIES_KEYS.list(input),
    queryFn: async () => {
      const result = await postRequest<ListCategoriesPayload>({
        path: API_ADMIN_CATEGORIES.buildUrlPath(),
        data: input,
      });
      return result as ListCategoriesResponse;
    },
  });
}
