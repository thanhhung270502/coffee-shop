"use client";

import { useCallback, useMemo } from "react";
import type { CategoryObject } from "@common/models/category";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Edit2, Trash } from "iconsax-reactjs";

import { Button } from "@/shared/components/button";
import { Table } from "@/shared/components/table";
import { Typography } from "@/shared/components/typography";
import { useDeleteCategoryMutation } from "@/shared/mutations/use-admin-category-mutations";

import type { UseCategoryFormReturn } from "../hooks/use-category-form";

import { CategoryStatus } from "./category-status";

type CategoriesTableProps = {
  categories: CategoryObject[];
  totalItems: number;
  isLoading: boolean;
  isFetching: boolean;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  openEdit: UseCategoryFormReturn["openEdit"];
};

export const CategoriesTable = ({
  categories,
  totalItems,
  isLoading,
  isFetching,
  pagination,
  setPagination,
  openEdit,
}: CategoriesTableProps) => {
  const deleteMutation = useDeleteCategoryMutation();

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Delete this category?")) return;
      await deleteMutation.mutateAsync(id);
    },
    [deleteMutation],
  );

  const columns = useMemo<ColumnDef<CategoryObject>[]>(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "slug", header: "Slug" },
      { accessorKey: "sortOrder", header: "Sort Order" },
      { accessorKey: "productCount", header: "Products" },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => <CategoryStatus category={row.original} />,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              variant="tertiary-gray"
              size="sm"
              startIcon={Edit2}
              onClick={() => openEdit(row.original)}
            >
              Edit
            </Button>
            <Button
              variant="destructive-tertiary"
              size="sm"
              startIcon={Trash}
              onClick={() => handleDelete(row.original.id)}
              disabled={deleteMutation.isPending}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [openEdit, deleteMutation.isPending, handleDelete],
  );

  return (
    <Table
      data={categories}
      columns={columns}
      isLoading={isLoading}
      isFetching={isFetching}
      pagination={pagination}
      setPagination={setPagination}
      rowCount={totalItems}
      manualPagination={true}
      emptyState={
        <Typography variant="body-sm" color="secondary">
          No categories yet
        </Typography>
      }
    />
  );
};
