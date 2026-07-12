"use client";

import { useState } from "react";
import { API_ADMIN_EXPORT_ORDERS } from "@common/models/report";
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
import { Button } from "@/shared/components/button";
import { Card } from "@/shared/components/card";
import { Skeleton } from "@/shared/components/skeleton";
import { Typography } from "@/shared/components/typography";
import { useQueryAdminReportTopProducts } from "@/shared/queries/use-query-admin-report-top-products";
import { useQueryAdminRevenue } from "@/shared/queries/use-query-admin-revenue";
import { formatCurrency } from "@/shared/utils/currency.util";

type GroupBy = "day" | "week" | "month";

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getDefaultRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 29);
  return { from: toIsoDate(from), to: toIsoDate(to) };
}

const GROUP_BY_OPTIONS: { label: string; value: GroupBy }[] = [
  { label: "Daily", value: "day" },
  { label: "Weekly", value: "week" },
  { label: "Monthly", value: "month" },
];

export function AdminReportsPage() {
  const defaultRange = getDefaultRange();
  const [from, setFrom] = useState(defaultRange.from);
  const [to, setTo] = useState(defaultRange.to);
  const [groupBy, setGroupBy] = useState<GroupBy>("day");
  const [isExporting, setIsExporting] = useState(false);

  const { data: revenueData, isLoading: revenueLoading } = useQueryAdminRevenue({ from, to, groupBy });
  const { data: topProductsData, isLoading: topProductsLoading } = useQueryAdminReportTopProducts({ from, to, limit: 10 });

  const totalRevenue = revenueData?.series.reduce((sum, p) => sum + p.revenue, 0) ?? 0;
  const totalOrders = revenueData?.series.reduce((sum, p) => sum + p.orders, 0) ?? 0;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      const url = `${API_ADMIN_EXPORT_ORDERS.buildUrlPath()}?${params.toString()}`;
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) throw new Error("Export failed");
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `orders-${from}-to-${to}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch {
      // Silent fail — toast added in 4.3
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Reports"
        description="Revenue analytics and order exports"
      />

      <div className="mb-6 flex flex-wrap items-end gap-4">
        <div className="space-y-1">
          <Typography variant="body-sm" color="secondary">
            From
          </Typography>
          <input
            type="date"
            value={from}
            max={to}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded-lg border border-primary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="space-y-1">
          <Typography variant="body-sm" color="secondary">
            To
          </Typography>
          <input
            type="date"
            value={to}
            min={from}
            onChange={(e) => setTo(e.target.value)}
            className="rounded-lg border border-primary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-2">
          {GROUP_BY_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              type="button"
              variant={groupBy === opt.value ? "primary" : "secondary-gray"}
              size="sm"
              onClick={() => setGroupBy(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
        <Button
          type="button"
          variant="secondary-color"
          size="sm"
          onClick={handleExport}
          loading={isExporting}
        >
          Export CSV
        </Button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Card className="p-4">
          <Typography variant="body-sm" color="secondary">
            Total Revenue
          </Typography>
          {revenueLoading ? (
            <Skeleton className="mt-1 h-8 w-32" />
          ) : (
            <Typography variant="heading-md" weight="semibold" className="mt-1">
              {formatCurrency(totalRevenue)}
            </Typography>
          )}
        </Card>
        <Card className="p-4">
          <Typography variant="body-sm" color="secondary">
            Total Orders
          </Typography>
          {revenueLoading ? (
            <Skeleton className="mt-1 h-8 w-16" />
          ) : (
            <Typography variant="heading-md" weight="semibold" className="mt-1">
              {totalOrders}
            </Typography>
          )}
        </Card>
      </div>

      <div className="mb-6 rounded-xl border border-primary bg-white p-4">
        <Typography variant="heading-sm" weight="semibold" className="mb-4">
          Revenue Chart
        </Typography>
        {revenueLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (revenueData?.series ?? []).length === 0 ? (
          <Typography variant="body-sm" color="secondary">
            No data for this period
          </Typography>
        ) : (
          <ResponsiveContainer width="100%" height={256}>
            <AreaChart
              data={revenueData?.series ?? []}
              margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueGradientReport" x1="0" y1="0" x2="0" y2="1">
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
                fill="url(#revenueGradientReport)"
                name="Revenue"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="rounded-xl border border-primary bg-white p-4">
        <Typography variant="heading-sm" weight="semibold" className="mb-4">
          Top Products
        </Typography>
        {topProductsLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : (topProductsData?.products ?? []).length === 0 ? (
          <Typography variant="body-sm" color="secondary">
            No data for this period
          </Typography>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-primary text-left">
                  <th className="pb-2 pr-4 font-medium text-gray-500">#</th>
                  <th className="pb-2 pr-4 font-medium text-gray-500">Product</th>
                  <th className="pb-2 pr-4 text-right font-medium text-gray-500">Sold</th>
                  <th className="pb-2 text-right font-medium text-gray-500">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProductsData?.products.map((product, i) => (
                  <tr key={product.productId} className="border-b border-primary last:border-0">
                    <td className="py-2 pr-4 text-gray-400">{i + 1}</td>
                    <td className="py-2 pr-4">{product.productName}</td>
                    <td className="py-2 pr-4 text-right">{product.quantitySold}</td>
                    <td className="py-2 text-right">{formatCurrency(product.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
