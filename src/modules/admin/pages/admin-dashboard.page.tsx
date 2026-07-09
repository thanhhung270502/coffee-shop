"use client";

import { useMemo } from "react";
import type { OrderObject } from "@common/models/order";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { AdminPageHeader } from "@/modules/admin/components/admin-page-header";
import { Badge } from "@/shared/components/badge";
import { Card } from "@/shared/components/card";
import { Table } from "@/shared/components/table";
import { Typography } from "@/shared/components/typography";
import { useQueryAdminDashboard } from "@/shared/queries/use-query-admin-dashboard";
import { formatCurrency } from "@/shared/utils/currency.util";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  READY: "Ready",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export function AdminDashboardPage() {
  const { data, isLoading } = useQueryAdminDashboard();

  const columns = useMemo<ColumnDef<OrderObject>[]>(
    () => [
      {
        accessorKey: "orderNumber",
        header: "Order #",
        cell: ({ row }) => (
          <Link href={`/admin/orders/${row.original.id}`} className="text-brand-tertiary hover:underline">
            {row.original.orderNumber}
          </Link>
        ),
      },
      { accessorKey: "customerName", header: "Customer" },
      {
        accessorKey: "total",
        header: "Total",
        cell: ({ row }) => formatCurrency(row.original.total),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant="default">{STATUS_LABELS[row.original.status] ?? row.original.status}</Badge>
        ),
      },
    ],
    [],
  );

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Today's shop activity overview"
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <Typography variant="body-sm" color="secondary">
            Revenue Today
          </Typography>
          <Typography variant="heading-md" weight="semibold" className="mt-1">
            {isLoading ? "..." : formatCurrency(data?.revenueToday ?? 0)}
          </Typography>
        </Card>
        <Card className="p-4">
          <Typography variant="body-sm" color="secondary">
            Orders Today
          </Typography>
          <Typography variant="heading-md" weight="semibold" className="mt-1">
            {isLoading ? "..." : (data?.ordersToday ?? 0)}
          </Typography>
        </Card>
        <Card className="p-4">
          <Typography variant="body-sm" color="secondary">
            Pending Orders
          </Typography>
          <Typography variant="heading-md" weight="semibold" className="mt-1">
            {isLoading ? "..." : (data?.pendingOrders ?? 0)}
          </Typography>
        </Card>
      </div>

      <div className="rounded-xl border border-primary bg-white p-4">
        <Typography variant="heading-sm" weight="semibold" className="mb-4">
          Recent Orders
        </Typography>
        <Table
          data={data?.recentOrders ?? []}
          columns={columns}
          isLoading={isLoading}
          emptyState={
            <Typography variant="body-sm" color="secondary">
              No orders yet
            </Typography>
          }
        />
      </div>
    </div>
  );
}
