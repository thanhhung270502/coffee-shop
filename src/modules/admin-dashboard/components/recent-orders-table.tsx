"use client";

import { useMemo } from "react";
import { EOrderStatus, type OrderObject } from "@common/models/order";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { Badge } from "@/shared/components/badge";
import { Button } from "@/shared/components/button";
import { Table } from "@/shared/components/table";
import { Typography } from "@/shared/components/typography";
import { ClientRoutes } from "@/shared/constants";
import { formatCurrency } from "@/shared/utils/currency.util";
import { getDetailRoute } from "@/shared/utils/routes.util";

import { STATUS_LABELS } from "../constants";

type RecentOrdersTableProps = {
  orders: OrderObject[];
  isLoading: boolean;
};

function getStatusVariant(status: EOrderStatus) {
  if (status === EOrderStatus.PENDING) return "default";
  if (status === EOrderStatus.CONFIRMED) return "success";
  if (status === EOrderStatus.PREPARING) return "warning";
  if (status === EOrderStatus.READY) return "success";
  if (status === EOrderStatus.COMPLETED) return "success";
  if (status === EOrderStatus.CANCELLED) return "danger";
  return "default";
}

export const RecentOrdersTable = ({ orders, isLoading }: RecentOrdersTableProps) => {
  const columns = useMemo<ColumnDef<OrderObject>[]>(
    () => [
      {
        accessorKey: "orderNumber",
        header: "Order #",
        cell: ({ row }) => (
          <Link
            href={getDetailRoute(ClientRoutes.AdminOrderDetail, row.original.id)}
            className="text-brand-tertiary hover:underline"
          >
            <Button variant="link">{row.original.orderNumber}</Button>
          </Link>
        ),
      },
      {
        accessorKey: "customerName",
        header: "Customer",
      },
      {
        accessorKey: "total",
        header: "Total",
        cell: ({ row }) => formatCurrency(row.original.total),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={getStatusVariant(row.original.status)}>
            {STATUS_LABELS[row.original.status] ?? row.original.status}
          </Badge>
        ),
      },
    ],
    [],
  );

  return (
    <div className="p-4xl rounded-xl border border-primary bg-white">
      <Typography variant="heading-sm" weight="semibold" className="mb-4xl">
        Recent Orders
      </Typography>
      <Table
        data={orders}
        columns={columns}
        isLoading={isLoading}
        emptyState={
          <Typography variant="body-sm" color="secondary">
            No orders yet
          </Typography>
        }
      />
    </div>
  );
};
