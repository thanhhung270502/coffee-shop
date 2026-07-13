"use client";

import { useQueryStates } from "nuqs";

import { SearchParams } from "@/shared/enums";

import type { StaffStatusFilter } from "../constants";
import { STAFF_SEARCH_PARAMS } from "../utils/search-params.util";

export const useAdminStaffRequest = () => {
  const [{ q: search, status }, setRequest] = useQueryStates(STAFF_SEARCH_PARAMS);

  const onSearchChange = (value: string) => {
    setRequest({ [SearchParams.Query]: value });
  };

  const onStatusChange = (value: StaffStatusFilter) => {
    setRequest({ [SearchParams.Status]: value });
  };

  const isFiltering = search.length > 0 || status.length > 0;

  return {
    search,
    status,
    onSearchChange,
    onStatusChange,
    setRequest,
    isFiltering,
  };
};

export type UseAdminStaffRequestReturn = ReturnType<typeof useAdminStaffRequest>;
