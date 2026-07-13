"use client";

import { PageHeader } from "@/shared/components/page-header";
import { RevenueChart } from "@/shared/components/revenue-chart";

import {
  DashboardSummaryCards,
  RecentOrdersTable,
  TopProductsList,
} from "../components";
import { useAdminDashboard } from "../hooks/use-admin-dashboard";

export const AdminDashboardPage = () => {
  const data = useAdminDashboard();

  return (
    <div className="gap-4xl flex flex-col">
      <PageHeader
        title="Dashboard"
        description="Today's shop activity overview"
      />
      <div className="p-3xl md:p-4xl gap-4xl flex flex-col rounded-xl bg-white">
        <DashboardSummaryCards
          revenueToday={data.revenueToday}
          ordersToday={data.ordersToday}
          pendingOrders={data.pendingOrders}
          isLoading={data.statsLoading}
        />
        <RevenueChart
          title="Revenue — Last 7 Days"
          series={data.revenueSeries}
          isLoading={data.revenueLoading}
        />
        <div className="gap-4xl grid lg:grid-cols-2">
          <TopProductsList products={data.topProducts} isLoading={data.topProductsLoading} />
          <RecentOrdersTable orders={data.recentOrders} isLoading={data.statsLoading} />
        </div>
      </div>
    </div>
  );
};
