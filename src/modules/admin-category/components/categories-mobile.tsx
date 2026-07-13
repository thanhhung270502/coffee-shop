"use client";

import { useCallback } from "react";
import type { CategoryObject } from "@common/models/category";
import type { PaginationState } from "@tanstack/react-table";

import { Pagination } from "@/shared/components/pagination";
import { SkeletonListMobile } from "@/shared/components/skeleton-list-mobile";
import { Typography } from "@/shared/components/typography";
import { useDeleteCategoryMutation } from "@/shared/mutations/use-admin-category-mutations";

import type { UseCategoryFormReturn } from "../hooks/use-category-form";

import { CategoryItemMobile } from "./category-item-mobile";

type CategoriesMobileProps = {
  categories: CategoryObject[];
  totalItems: number;
  isLoading: boolean;
  isFetching: boolean;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  openEdit: UseCategoryFormReturn["openEdit"];
};

export const CategoriesMobile = ({
  categories,
  totalItems,
  isLoading,
  isFetching,
  pagination,
  setPagination,
  openEdit,
}: CategoriesMobileProps) => {
  const deleteMutation = useDeleteCategoryMutation();

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Delete this category?")) return;
      await deleteMutation.mutateAsync(id);
    },
    [deleteMutation],
  );

  const onChangePage = (page: number) => {
    setPagination({ ...pagination, pageIndex: page });
  };

  const onChangePageSize = (size: number) => {
    setPagination({ ...pagination, pageSize: size, pageIndex: 0 });
  };

  if (isLoading || isFetching) {
    return <SkeletonListMobile />;
  }

  if (categories.length === 0) {
    return (
      <div className="py-8xl flex flex-col items-center justify-center text-center">
        <Typography variant="body-sm" className="mb-xs" color="quaternary">
          No categories found
        </Typography>
        <Typography variant="body-xs" color="disabled">
          Try adjusting your search or filters
        </Typography>
      </div>
    );
  }

  return (
    <div className="gap-xl flex flex-col">
      <div className="gap-xl flex flex-col">
        {categories.map((category) => (
          <CategoryItemMobile
            key={category.id}
            category={category}
            openEdit={openEdit}
            onDelete={handleDelete}
            isDeleting={deleteMutation.isPending}
          />
        ))}
      </div>
      {totalItems > 0 && (
        <Pagination
          pageIndex={pagination.pageIndex}
          pageSize={pagination.pageSize}
          totalItems={totalItems}
          onChangePage={onChangePage}
          onChangePageSize={onChangePageSize}
        />
      )}
    </div>
  );
};
