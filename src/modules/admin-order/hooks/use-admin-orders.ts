"use client";

import { useEffect, useMemo, useState } from "react";
import type { EOrderChannel, EOrderType, ListOrdersPayload } from "@common/models/order";

import { useTablePagination } from "@/shared/hooks";
import { useQueryAdminOrders } from "@/shared/queries";

import { FILTER_TABS } from "../constants";

import { useAdminOrdersRequest } from "./use-admin-orders-request";

export const useAdminOrders = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabFilters = FILTER_TABS[activeTab].filters;
  const { search, type, status, channel, from, to } = useAdminOrdersRequest();
  const { pagination, setPagination } = useTablePagination();

  const payload = useMemo<ListOrdersPayload>(() => {
    const types: EOrderType[] =
      type.length > 0 ? type : "type" in tabFilters ? [tabFilters.type as EOrderType] : [];
    const channels: EOrderChannel[] = channel
      ? [channel as EOrderChannel]
      : "channel" in tabFilters
        ? [tabFilters.channel as EOrderChannel]
        : [];

    return {
      limit: pagination.pageSize,
      offset: pagination.pageIndex * pagination.pageSize,
      search: search.trim() || undefined,
      types: types.length > 0 ? types : undefined,
      statuses: status.length > 0 ? status : undefined,
      channels: channels.length > 0 ? channels : undefined,
      fromDate: from?.toISOString(),
      toDate: to?.toISOString(),
    };
  }, [
    search,
    type,
    status,
    channel,
    from,
    to,
    tabFilters,
    pagination.pageIndex,
    pagination.pageSize,
  ]);

  const { data, isLoading, isFetching } = useQueryAdminOrders({
    input: payload,
  });

  useEffect(() => {
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  }, [search, type, status, channel, from, to, activeTab, setPagination]);

  return {
    orders: data?.data ?? [],
    totalItems: data?.total_record ?? 0,
    isLoading,
    isFetching,
    pagination,
    setPagination,
    activeTab,
    setActiveTab,
  };
};
