"use client";

import { useMemo } from "react";
import type { DrinkObject } from "@common/models/product";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Edit2 } from "iconsax-reactjs";

import { Button } from "@/shared/components/button";
import { Table } from "@/shared/components/table";
import { Typography } from "@/shared/components/typography";
import { useUpdateDrinkStatusMutation } from "@/shared/mutations/use-admin-drink-mutations";
import { formatCurrency } from "@/shared/utils/currency.util";

import type { UseDrinkFormReturn } from "../hooks/use-drink-form";

import { DrinkStatus } from "./drink-status";

type DrinksTableProps = {
  drinks: DrinkObject[];
  totalItems: number;
  isLoading: boolean;
  isFetching: boolean;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  openEdit: UseDrinkFormReturn["openEdit"];
};

export const DrinksTable = ({
  drinks,
  totalItems,
  isLoading,
  isFetching,
  pagination,
  setPagination,
  openEdit,
}: DrinksTableProps) => {
  const statusMutation = useUpdateDrinkStatusMutation();

  const columns = useMemo<ColumnDef<DrinkObject>[]>(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "categoryName", header: "Category" },
      {
        id: "price",
        header: "From",
        cell: ({ row }) => {
          const min = Math.min(...row.original.variants.map((v) => v.price));
          return formatCurrency(min);
        },
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => <DrinkStatus drink={row.original} />,
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
              variant="secondary-gray"
              size="sm"
              onClick={() =>
                statusMutation.mutate({
                  id: row.original.id,
                  data: { isActive: !row.original.isActive },
                })
              }
              disabled={statusMutation.isPending}
            >
              {row.original.isActive ? "Disable" : "Enable"}
            </Button>
          </div>
        ),
      },
    ],
    [openEdit, statusMutation],
  );

  return (
    <Table
      data={drinks}
      columns={columns}
      isLoading={isLoading}
      isFetching={isFetching}
      pagination={pagination}
      setPagination={setPagination}
      rowCount={totalItems}
      manualPagination={true}
      emptyState={
        <Typography variant="body-sm" color="secondary">
          No drinks found
        </Typography>
      }
    />
  );
};
