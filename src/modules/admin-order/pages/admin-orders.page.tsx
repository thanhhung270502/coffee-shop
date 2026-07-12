"use client";

import { PageHeader } from "@/shared/components/page-header";
import { useSmaller } from "@/shared/hooks";

import { OrdersMobile, OrdersTable } from "../components";
import { OrdersToolbar } from "../components/orders-toolbar";
import { useAdminOrders } from "../hooks/use-admin-orders";

export const AdminOrdersPage = () => {
  const isMobile = useSmaller("sm");
  const { orders, totalItems, isLoading, isFetching, pagination, setPagination } = useAdminOrders();

  const OrdersComponent = isMobile ? OrdersMobile : OrdersTable;

  return (
    <div className="gap-4xl flex flex-col">
      <PageHeader title="Order List" description="Manage and process orders" />
      <div className="p-3xl md:p-4xl gap-4xl flex flex-col rounded-xl bg-white">
        <OrdersToolbar />
        <OrdersComponent
          orders={orders}
          totalItems={totalItems}
          isLoading={isLoading}
          isFetching={isFetching}
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
    </div>
  );
};
