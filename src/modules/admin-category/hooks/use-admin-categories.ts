"use client";

import { useEffect, useMemo } from "react";
import type { ListCategoriesPayload } from "@common/models/category";

import { useTablePagination } from "@/shared/hooks";
import { useQueryAdminCategories } from "@/shared/queries/use-query-admin-categories";

import { useAdminCategoriesRequest } from "./use-admin-categories-request";

export const useAdminCategories = () => {
  const request = useAdminCategoriesRequest();
  const { search, type } = request;
  const { pagination, setPagination } = useTablePagination();

  const payload = useMemo<ListCategoriesPayload>(
    () => ({
      limit: pagination.pageSize,
      offset: pagination.pageIndex * pagination.pageSize,
      search: search.trim() || undefined,
      type,
    }),
    [search, type, pagination.pageIndex, pagination.pageSize],
  );

  const { data, isLoading, isFetching } = useQueryAdminCategories({ input: payload });

  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [search, type, setPagination]);

  return {
    categories: data?.data ?? [],
    totalItems: data?.total_record ?? 0,
    isLoading,
    isFetching,
    pagination,
    setPagination,
    ...request,
  };
};

export type UseAdminCategoriesReturn = ReturnType<typeof useAdminCategories>;
