"use client";

import { useQueryStates } from "nuqs";

import { SearchParams } from "@/shared/enums";

import { DRINKS_SEARCH_PARAMS } from "../utils/search-params.util";

export const useAdminDrinksRequest = () => {
  const [{ q: search, categoryId }, setRequest] = useQueryStates(DRINKS_SEARCH_PARAMS);

  const onSearchChange = (value: string) => {
    setRequest({ [SearchParams.Query]: value });
  };

  const onCategoryChange = (value: string) => {
    setRequest({ [SearchParams.CategoryId]: value });
  };

  const isFiltering = search.length > 0 || categoryId.length > 0;

  return {
    search,
    categoryId,
    onSearchChange,
    onCategoryChange,
    setRequest,
    isFiltering,
  };
};

export type UseAdminDrinksRequestReturn = ReturnType<typeof useAdminDrinksRequest>;
