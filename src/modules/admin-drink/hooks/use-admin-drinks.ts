"use client";

import { useEffect, useMemo } from "react";
import type { ListDrinksPayload } from "@common/models/product";

import { useTablePagination } from "@/shared/hooks";
import { useQueryAdminDrinks } from "@/shared/queries/use-query-admin-drinks";

import { useAdminDrinksRequest } from "./use-admin-drinks-request";

export const useAdminDrinks = () => {
  const request = useAdminDrinksRequest();
  const { search, categoryId } = request;
  const { pagination, setPagination } = useTablePagination();

  const payload = useMemo<ListDrinksPayload>(
    () => ({
      limit: pagination.pageSize,
      offset: pagination.pageIndex * pagination.pageSize,
      search: search.trim() || undefined,
      categoryId: categoryId || undefined,
    }),
    [search, categoryId, pagination.pageIndex, pagination.pageSize],
  );

  const { data, isLoading, isFetching } = useQueryAdminDrinks({ input: payload });

  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [search, categoryId, setPagination]);

  return {
    drinks: data?.data ?? [],
    totalItems: data?.total_record ?? 0,
    isLoading,
    isFetching,
    pagination,
    setPagination,
    ...request,
  };
};

export type UseAdminDrinksReturn = ReturnType<typeof useAdminDrinks>;
