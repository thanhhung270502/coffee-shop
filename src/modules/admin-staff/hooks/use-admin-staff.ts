"use client";

import { useEffect, useMemo } from "react";
import type { ListStaffPayload } from "@common/models/staff";

import { useTablePagination } from "@/shared/hooks";
import { useQueryAdminStaff } from "@/shared/queries/use-query-admin-staff";

import type { StaffStatusFilter } from "../constants";

import { useAdminStaffRequest } from "./use-admin-staff-request";

function statusToIsActive(status: StaffStatusFilter): boolean | undefined {
  if (status === "active") return true;
  if (status === "inactive") return false;
  return undefined;
}

export const useAdminStaff = () => {
  const request = useAdminStaffRequest();
  const { search, status } = request;
  const { pagination, setPagination } = useTablePagination();

  const payload = useMemo<ListStaffPayload>(
    () => ({
      limit: pagination.pageSize,
      offset: pagination.pageIndex * pagination.pageSize,
      search: search.trim() || undefined,
      isActive: statusToIsActive(status),
    }),
    [search, status, pagination.pageIndex, pagination.pageSize],
  );

  const { data, isLoading, isFetching } = useQueryAdminStaff({ input: payload });

  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [search, status, setPagination]);

  return {
    staff: data?.data ?? [],
    totalItems: data?.total_record ?? 0,
    isLoading,
    isFetching,
    pagination,
    setPagination,
    ...request,
  };
};

export type UseAdminStaffReturn = ReturnType<typeof useAdminStaff>;
