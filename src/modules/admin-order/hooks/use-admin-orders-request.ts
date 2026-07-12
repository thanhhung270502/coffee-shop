"use client";

import { useQueryStates } from "nuqs";

import { SearchParams } from "@/shared/enums";

import { ORDERS_SEARCH_PARAMS } from "../utils/search-params.util";

export const DEFAULT_ORDERS_PARAMS = {
  [SearchParams.Query]: null,
  [SearchParams.Type]: [],
  [SearchParams.Status]: [],
  [SearchParams.Channel]: null,
  [SearchParams.From]: null,
  [SearchParams.To]: null,
} as const;

export const useAdminOrdersRequest = () => {
  const [{ q: search, type, status, channel, from, to }, setAdminOrdersRequest] =
    useQueryStates(ORDERS_SEARCH_PARAMS);

  const onSearchChange = (value: string) => {
    setAdminOrdersRequest({ [SearchParams.Query]: value });
  };

  const isFiltering = type.length > 0 || status.length > 0 || channel || from || to;

  return {
    search,
    type,
    status,
    channel,
    from,
    to,
    onSearchChange,
    setAdminOrdersRequest,
    isFiltering,
  };
};
export type UseAdminOrdersRequestReturn = ReturnType<typeof useAdminOrdersRequest>;
