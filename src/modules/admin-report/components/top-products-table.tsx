"use client";

import { useMemo } from "react";
import type { TopProductReportItem } from "@common/models/report";
import type { ColumnDef } from "@tanstack/react-table";

import { Table } from "@/shared/components/table";
import { Typography } from "@/shared/components/typography";
import { formatCurrency } from "@/shared/utils/currency.util";

type TopProductsTableProps = {
  products: TopProductReportItem[];
  isLoading: boolean;
};

export const TopProductsTable = ({ products, isLoading }: TopProductsTableProps) => {
  const columns = useMemo<ColumnDef<TopProductReportItem>[]>(
    () => [
      {
        id: "rank",
        header: "#",
        cell: ({ row }) => (
          <Typography variant="body-sm" color="secondary">
            {row.index + 1}
          </Typography>
        ),
      },
      {
        accessorKey: "productName",
        header: "Product",
      },
      {
        accessorKey: "quantitySold",
        header: "Sold",
        meta: { align: "right" },
        cell: ({ row }) => (
          <Typography variant="body-sm" className="text-right">
            {row.original.quantitySold}
          </Typography>
        ),
      },
      {
        accessorKey: "revenue",
        header: "Revenue",
        meta: { align: "right" },
        cell: ({ row }) => (
          <Typography variant="body-sm" className="text-right">
            {formatCurrency(row.original.revenue)}
          </Typography>
        ),
      },
    ],
    [],
  );

  return (
    <div className="p-4xl rounded-xl border border-primary bg-white">
      <Typography variant="heading-sm" weight="semibold" className="mb-4xl">
        Top Products
      </Typography>
      <Table
        data={products}
        columns={columns}
        isLoading={isLoading}
        emptyState={
          <Typography variant="body-sm" color="secondary">
            No data for this period
          </Typography>
        }
      />
    </div>
  );
};
