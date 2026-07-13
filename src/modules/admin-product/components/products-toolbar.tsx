"use client";

import { useMemo } from "react";
import { EProductType } from "@common/models/category";
import { SearchNormal1 } from "iconsax-reactjs";

import { DebouncedInput } from "@/shared";
import { Select } from "@/shared/components/select";
import { useQueryAdminCategories } from "@/shared/queries/use-query-admin-categories";

import { ALL_CATEGORIES_VALUE } from "../constants";
import type { UseAdminProductsRequestReturn } from "../hooks/use-admin-products-request";

type ProductsToolbarProps = UseAdminProductsRequestReturn;

export const ProductsToolbar = ({
  search,
  categoryId,
  onSearchChange,
  onCategoryChange,
}: ProductsToolbarProps) => {
  const { data: categoriesData } = useQueryAdminCategories({
    input: { type: EProductType.PACKAGED, limit: 100, offset: 0 },
  });

  const categoryOptions = useMemo(
    () => [
      { label: "All categories", value: ALL_CATEGORIES_VALUE },
      ...(categoriesData?.data ?? []).map((c) => ({ label: c.name, value: c.id })),
    ],
    [categoriesData?.data],
  );

  const selectedCategory =
    categoryOptions.find((o) => o.value === categoryId) ?? categoryOptions[0];

  return (
    <div className="gap-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <Select
        value={selectedCategory}
        onChange={(option) => {
          if (option && "value" in option) {
            onCategoryChange(String(option.value));
          }
        }}
        options={categoryOptions}
        placeholder="All categories"
        size="sm"
        className="min-w-50"
        isSearchable={false}
      />
      <DebouncedInput
        value={search}
        onChange={onSearchChange}
        leadingIcon={SearchNormal1}
        placeholder="Search products"
        isClearable
        size="sm"
      />
    </div>
  );
};
