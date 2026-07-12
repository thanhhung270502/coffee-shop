"use client";

import { useMemo, useState } from "react";
import type { EOrderChannel, EOrderType, OrderObject } from "@common/models/order";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { AdminPageHeader } from "@/modules/admin/components/admin-page-header";
import { Badge } from "@/shared/components/badge";
import { Table } from "@/shared/components/table";
import { Typography } from "@/shared/components/typography";
import { useQueryAdminOrders } from "@/shared/queries/use-query-admin-orders";
import { cn } from "@/shared/utils";
import { formatCurrency } from "@/shared/utils/currency.util";

import { FILTER_TABS, STATUS_LABELS } from "../../admin-order/constants";

export function AdminOrdersPage() {
  const [activeTab, setActiveTab] = useState(0);
  const tabFilters = FILTER_TABS[activeTab].filters;
  const payload = useMemo(
    () => ({
      limit: 50,
      offset: 0,
      types: "type" in tabFilters ? [tabFilters.type as EOrderType] : undefined,
      channels: "channel" in tabFilters ? [tabFilters.channel as EOrderChannel] : undefined,
    }),
    [tabFilters],
  );
  const { data, isLoading } = useQueryAdminOrders(payload);

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
      { accessorKey: "customerPhone", header: "Phone" },
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
        cell: ({ row }) => (
          <Badge variant="default">{STATUS_LABELS[row.original.status] ?? row.original.status}</Badge>
        ),
      },
    ],
    [],
  );

  return (
    <div>
      <AdminPageHeader title="Orders" description="Manage and process orders" />

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTER_TABS.map((tab, index) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => setActiveTab(index)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              activeTab === index
                ? "bg-brand-primary text-brand-tertiary"
                : "bg-white text-secondary hover:bg-secondary-hover",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-primary bg-white p-4">
        <Table
          data={data?.data ?? []}
          columns={columns}
          isLoading={isLoading}
          emptyState={<Typography variant="body-sm" color="secondary">No orders yet</Typography>}
        />
      </div>
    </div>
  );
}
