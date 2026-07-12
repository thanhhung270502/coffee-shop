"use client";

import type { ListOrdersPayload, ListOrdersResponse } from "@common/models/order";
import { API_ADMIN_ORDERS } from "@common/models/order";
import { useQuery } from "@tanstack/react-query";

import { postRequest } from "@/libs/api-client";

import { ADMIN_ORDERS_KEYS } from "../constants";
import { QueryProps } from "../types/query-client";

export const ADMIN_ORDERS_QUERY_KEY = ["admin", "orders"] as const;

type UseQueryAdminOrdersProps = QueryProps<ListOrdersResponse, ListOrdersPayload>;
export function useQueryAdminOrders(props: UseQueryAdminOrdersProps) {
  const { input } = props;
  return useQuery({
    queryKey: ADMIN_ORDERS_KEYS.list(input),
    queryFn: async () => {
      return await postRequest<ListOrdersPayload>({
        path: API_ADMIN_ORDERS.buildUrlPath(),
        data: input,
      });
    },
  });
}
