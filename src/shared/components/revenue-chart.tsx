"use client";

import { useId } from "react";
import type { RevenuePoint } from "@common/models/report";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Skeleton } from "@/shared/components/skeleton";
import { Typography } from "@/shared/components/typography";
import { formatCurrency } from "@/shared/utils/currency.util";

type RevenueChartProps = {
  title: string;
  series: RevenuePoint[];
  isLoading: boolean;
  gradientId?: string;
};

export const RevenueChart = ({ title, series, isLoading, gradientId }: RevenueChartProps) => {
  const defaultGradientId = useId();
  const resolvedGradientId = gradientId ?? defaultGradientId;

  return (
    <div className="p-4xl rounded-xl border border-primary bg-white">
      <Typography variant="heading-sm" weight="semibold" className="mb-4xl">
        {title}
      </Typography>
      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : series.length === 0 ? (
        <Typography variant="body-sm" color="secondary">
          No data for this period
        </Typography>
      ) : (
        <ResponsiveContainer width="100%" height={256}>
          <AreaChart data={series} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={resolvedGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis
              tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) =>
                typeof value === "number" ? formatCurrency(value) : value
              }
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#6366f1"
              strokeWidth={2}
              fill={`url(#${resolvedGradientId})`}
              name="Revenue"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
