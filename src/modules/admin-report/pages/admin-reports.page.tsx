"use client";

import { PageHeader } from "@/shared/components/page-header";

import {
  ReportsSummaryCards,
  ReportsToolbar,
  RevenueChart,
  TopProductsTable,
} from "../components";
import { useAdminReports } from "../hooks/use-admin-reports";
import { useAdminReportsRequest } from "../hooks/use-admin-reports-request";
import { useExportOrders } from "../hooks/use-export-orders";

export const AdminReportsPage = () => {
  const request = useAdminReportsRequest();
  const data = useAdminReports(request);
  const exportHook = useExportOrders({ from: data.fromIso, to: data.toIso });

  return (
    <div className="gap-4xl flex flex-col">
      <PageHeader
        title="Reports"
        description="Revenue analytics and order exports"
      />
      <div className="p-3xl md:p-4xl gap-4xl flex flex-col rounded-xl bg-white">
        <ReportsToolbar {...request} {...exportHook} />
        <ReportsSummaryCards
          totalRevenue={data.totalRevenue}
          totalOrders={data.totalOrders}
          isLoading={data.revenueLoading}
        />
        <RevenueChart series={data.revenueSeries} isLoading={data.revenueLoading} />
        <TopProductsTable products={data.topProducts} isLoading={data.topProductsLoading} />
      </div>
    </div>
  );
};
