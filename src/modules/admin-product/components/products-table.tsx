"use client";

import { useMemo } from "react";
import type { PackagedProductObject } from "@common/models/product";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Edit2 } from "iconsax-reactjs";

import { Button } from "@/shared/components/button";
import { Table } from "@/shared/components/table";
import { Typography } from "@/shared/components/typography";
import { useUpdateProductStockMutation } from "@/shared/mutations/use-admin-product-mutations";

import type { UseProductFormReturn } from "../hooks/use-product-form";

import { ProductStock } from "./product-stock";

type ProductsTableProps = {
  products: PackagedProductObject[];
  totalItems: number;
  isLoading: boolean;
  isFetching: boolean;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  openEdit: UseProductFormReturn["openEdit"];
};

export const ProductsTable = ({
  products,
  totalItems,
  isLoading,
  isFetching,
  pagination,
  setPagination,
  openEdit,
}: ProductsTableProps) => {
  const stockMutation = useUpdateProductStockMutation();

  const columns = useMemo<ColumnDef<PackagedProductObject>[]>(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "categoryName", header: "Category" },
      {
        accessorKey: "totalStock",
        header: "Stock",
        cell: ({ row }) => <ProductStock product={row.original} />,
      },
      {
        id: "skus",
        header: "SKUs",
        cell: ({ row }) => row.original.skus.map((s) => `${s.label}: ${s.stock}`).join(", "),
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
            {row.original.skus[0] && (
              <Button
                variant="secondary-gray"
                size="sm"
                onClick={() => {
                  const newStock = prompt("Enter new stock:", String(row.original.skus[0].stock));
                  if (newStock !== null) {
                    stockMutation.mutate({
                      id: row.original.id,
                      data: { skuId: row.original.skus[0].id, stock: Number(newStock) },
                    });
                  }
                }}
              >
                Adjust Stock
              </Button>
            )}
          </div>
        ),
      },
    ],
    [openEdit, stockMutation],
  );

  return (
    <Table
      data={products}
      columns={columns}
      isLoading={isLoading}
      isFetching={isFetching}
      pagination={pagination}
      setPagination={setPagination}
      rowCount={totalItems}
      manualPagination={true}
      emptyState={
        <Typography variant="body-sm" color="secondary">
          No products found
        </Typography>
      }
    />
  );
};
