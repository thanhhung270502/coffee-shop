"use client";

import { useQueryStates } from "nuqs";

import { SearchParams } from "@/shared/enums";

import { PRODUCTS_SEARCH_PARAMS } from "../utils/search-params.util";

export const useAdminProductsRequest = () => {
  const [{ q: search, categoryId }, setRequest] = useQueryStates(PRODUCTS_SEARCH_PARAMS);

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

export type UseAdminProductsRequestReturn = ReturnType<typeof useAdminProductsRequest>;
