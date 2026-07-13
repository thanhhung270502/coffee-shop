"use client";

import { EProductType } from "@common/models/category";
import { useQueryStates } from "nuqs";

import { SearchParams } from "@/shared/enums";

import { CATEGORIES_SEARCH_PARAMS } from "../utils/search-params.util";

export const useAdminCategoriesRequest = () => {
  const [{ q: search, type }, setRequest] = useQueryStates(CATEGORIES_SEARCH_PARAMS);

  const onSearchChange = (value: string) => {
    setRequest({ [SearchParams.Query]: value });
  };

  const onTypeChange = (value: EProductType) => {
    setRequest({ [SearchParams.Type]: value });
  };

  const isFiltering = search.length > 0;

  return {
    search,
    type,
    onSearchChange,
    onTypeChange,
    setRequest,
    isFiltering,
  };
};

export type UseAdminCategoriesRequestReturn = ReturnType<typeof useAdminCategoriesRequest>;
