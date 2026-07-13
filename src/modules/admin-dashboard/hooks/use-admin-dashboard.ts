"use client";

import { useMemo } from "react";

import { useQueryAdminDashboard } from "@/shared/queries/use-query-admin-dashboard";
import { useQueryAdminDashboardTopProducts } from "@/shared/queries/use-query-admin-dashboard-top-products";
import { useQueryAdminRevenue } from "@/shared/queries/use-query-admin-revenue";

import { getLast7DaysRange } from "../constants";

export const useAdminDashboard = () => {
  const { from, to } = getLast7DaysRange();

  const { data: stats, isLoading: statsLoading } = useQueryAdminDashboard();
  const { data: revenueData, isLoading: revenueLoading } = useQueryAdminRevenue({
    from,
    to,
    groupBy: "day",
  });
  const { data: topProductsData, isLoading: topProductsLoading } =
    useQueryAdminDashboardTopProducts();

  const revenueSeries = useMemo(() => revenueData?.series ?? [], [revenueData?.series]);
  const topProducts = useMemo(() => topProductsData?.products ?? [], [topProductsData?.products]);
  const recentOrders = useMemo(() => stats?.recentOrders ?? [], [stats?.recentOrders]);

  return {
    revenueToday: stats?.revenueToday ?? 0,
    ordersToday: stats?.ordersToday ?? 0,
    pendingOrders: stats?.pendingOrders ?? 0,
    statsLoading,
    revenueSeries,
    revenueLoading,
    topProducts,
    topProductsLoading,
    recentOrders,
  };
};
export type UseAdminDashboardReturn = ReturnType<typeof useAdminDashboard>;
