"use client";

import { useMemo } from "react";
import { OrderObject } from "@common/models/order";
import { ColumnDef, PaginationState } from "@tanstack/react-table";

import { Table } from "@/shared/components/table";
import { formatCurrency } from "@/shared/utils";

import { OrderNumber, OrderStatus } from ".";

type OrdersTableProps = {
  orders: OrderObject[];
  totalItems: number;
  isLoading: boolean;
  isFetching: boolean;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
};

export const OrdersTable = ({
  orders,
  totalItems,
  isLoading,
  isFetching,
  pagination,
  setPagination,
}: OrdersTableProps) => {
  const columns = useMemo<ColumnDef<OrderObject>[]>(
    () => [
      {
        accessorKey: "orderNumber",
        header: "Order #",
        cell: ({ row }) => <OrderNumber order={row.original} />,
      },
      {
        accessorKey: "customerName",
        header: "Customer",
        cell: ({ row }) => row.original.customerName,
      },
      {
        accessorKey: "customerPhone",
        header: "Phone",
        cell: ({ row }) => row.original.customerPhone,
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (row.original.type === "DRINK_ORDER" ? "Drink" : "Product"),
      },
      {
        accessorKey: "channel",
        header: "Channel",
        cell: ({ row }) => row.original.channel,
      },
      {
        accessorKey: "total",
        header: "Total",
        cell: ({ row }) => formatCurrency(row.original.total),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <OrderStatus order={row.original} />,
      },
    ],
    []
  );
  return (
    <Table
      data={orders}
      columns={columns}
      isLoading={isLoading}
      isFetching={isFetching}
      pagination={pagination}
      setPagination={setPagination}
      rowCount={totalItems}
      manualPagination={true}
    />
  );
};
