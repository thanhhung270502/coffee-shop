"use client";

import { useEffect, useMemo } from "react";
import type { ListPackagedProductsPayload } from "@common/models/product";

import { useTablePagination } from "@/shared/hooks";
import { useQueryAdminProducts } from "@/shared/queries/use-query-admin-products";

import { useAdminProductsRequest } from "./use-admin-products-request";

export const useAdminProducts = () => {
  const request = useAdminProductsRequest();
  const { search, categoryId } = request;
  const { pagination, setPagination } = useTablePagination();

  const payload = useMemo<ListPackagedProductsPayload>(
    () => ({
      limit: pagination.pageSize,
      offset: pagination.pageIndex * pagination.pageSize,
      search: search.trim() || undefined,
      categoryId: categoryId || undefined,
    }),
    [search, categoryId, pagination.pageIndex, pagination.pageSize],
  );

  const { data, isLoading, isFetching } = useQueryAdminProducts({ input: payload });

  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [search, categoryId, setPagination]);

  return {
    products: data?.data ?? [],
    totalItems: data?.total_record ?? 0,
    isLoading,
    isFetching,
    pagination,
    setPagination,
    ...request,
  };
};

export type UseAdminProductsReturn = ReturnType<typeof useAdminProducts>;
