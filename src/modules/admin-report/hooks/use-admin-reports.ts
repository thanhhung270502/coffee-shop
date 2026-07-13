"use client";

import { useMemo } from "react";

import { useQueryAdminReportTopProducts } from "@/shared/queries/use-query-admin-report-top-products";
import { useQueryAdminRevenue } from "@/shared/queries/use-query-admin-revenue";

import { TOP_PRODUCTS_LIMIT } from "../constants";

import type { UseAdminReportsRequestReturn } from "./use-admin-reports-request";

export const useAdminReports = (request: UseAdminReportsRequestReturn) => {
  const { fromIso, toIso, groupBy } = request;

  const queryParams = useMemo(
    () => ({ from: fromIso, to: toIso, groupBy }),
    [fromIso, toIso, groupBy],
  );

  const { data: revenueData, isLoading: revenueLoading } = useQueryAdminRevenue(queryParams);
  const { data: topProductsData, isLoading: topProductsLoading } = useQueryAdminReportTopProducts({
    from: fromIso,
    to: toIso,
    limit: TOP_PRODUCTS_LIMIT,
  });

  const totalRevenue = useMemo(
    () => revenueData?.series.reduce((sum, p) => sum + p.revenue, 0) ?? 0,
    [revenueData?.series],
  );

  const totalOrders = useMemo(
    () => revenueData?.series.reduce((sum, p) => sum + p.orders, 0) ?? 0,
    [revenueData?.series],
  );

  return {
    fromIso,
    toIso,
    groupBy,
    revenueSeries: revenueData?.series ?? [],
    topProducts: topProductsData?.products ?? [],
    totalRevenue,
    totalOrders,
    revenueLoading,
    topProductsLoading,
  };
};
export type UseAdminReportsReturn = ReturnType<typeof useAdminReports>;
