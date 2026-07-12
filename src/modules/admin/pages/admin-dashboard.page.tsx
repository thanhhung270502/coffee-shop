"use client";

import { useMemo } from "react";
import type { OrderObject } from "@common/models/order";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AdminPageHeader } from "@/modules/admin/components/admin-page-header";
import { Badge } from "@/shared/components/badge";
import { Card } from "@/shared/components/card";
import { Skeleton } from "@/shared/components/skeleton";
import { Table } from "@/shared/components/table";
import { Typography } from "@/shared/components/typography";
import { useQueryAdminDashboard } from "@/shared/queries/use-query-admin-dashboard";
import { useQueryAdminReportTopProducts } from "@/shared/queries/use-query-admin-report-top-products";
import { useQueryAdminRevenue } from "@/shared/queries/use-query-admin-revenue";
import { formatCurrency } from "@/shared/utils/currency.util";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  READY: "Ready",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

function getLast7DaysRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 6);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

export function AdminDashboardPage() {
  const { data, isLoading } = useQueryAdminDashboard();
  const { from, to } = getLast7DaysRange();
  const { data: revenueData, isLoading: revenueLoading } = useQueryAdminRevenue({ from, to, groupBy: "day" });
  const { data: topProductsData, isLoading: topProductsLoading } = useQueryAdminReportTopProducts({ limit: 5 });

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
          {isLoading ? (
            <Skeleton className="mt-1 h-8 w-32" />
          ) : (
            <Typography variant="heading-md" weight="semibold" className="mt-1">
              {formatCurrency(data?.revenueToday ?? 0)}
            </Typography>
          )}
        </Card>
        <Card className="p-4">
          <Typography variant="body-sm" color="secondary">
            Orders Today
          </Typography>
          {isLoading ? (
            <Skeleton className="mt-1 h-8 w-16" />
          ) : (
            <Typography variant="heading-md" weight="semibold" className="mt-1">
              {data?.ordersToday ?? 0}
            </Typography>
          )}
        </Card>
        <Card className="p-4">
          <Typography variant="body-sm" color="secondary">
            Pending Orders
          </Typography>
          {isLoading ? (
            <Skeleton className="mt-1 h-8 w-16" />
          ) : (
            <Typography variant="heading-md" weight="semibold" className="mt-1">
              {data?.pendingOrders ?? 0}
            </Typography>
          )}
        </Card>
      </div>

      <div className="mb-6 rounded-xl border border-primary bg-white p-4">
        <Typography variant="heading-sm" weight="semibold" className="mb-4">
          Revenue — Last 7 Days
        </Typography>
        {revenueLoading ? (
          <Skeleton className="h-48 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData?.series ?? []} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => typeof value === "number" ? formatCurrency(value) : value} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#revenueGradient)"
                name="Revenue"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-primary bg-white p-4">
          <Typography variant="heading-sm" weight="semibold" className="mb-4">
            Top 5 Products
          </Typography>
          {topProductsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {(topProductsData?.products ?? []).length === 0 ? (
                <Typography variant="body-sm" color="secondary">
                  No data yet
                </Typography>
              ) : (
                topProductsData?.products.map((product, i) => (
                  <div key={product.productId} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Typography variant="body-xs" color="secondary" className="w-5 text-right">
                        {i + 1}.
                      </Typography>
                      <Typography variant="body-sm">{product.productName}</Typography>
                    </div>
                    <Typography variant="body-sm" color="secondary">
                      {product.quantitySold} sold
                    </Typography>
                  </div>
                ))
              )}
            </div>
          )}
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
    </div>
  );
}
