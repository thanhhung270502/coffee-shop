"use client";

import { OrderObject } from "@common/models/order";
import { PaginationState } from "@tanstack/react-table";

import { Pagination } from "@/shared/components/pagination";
import { SkeletonListMobile } from "@/shared/components/skeleton-list-mobile";
import { Typography } from "@/shared/components/typography";

import { OrderItemMobile } from "./order-item-mobile";

type OrdersMobileProps = {
  orders: OrderObject[];
  totalItems: number;
  isLoading: boolean;
  isFetching: boolean;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
};

export const OrdersMobile = ({
  orders,
  totalItems,
  isLoading,
  isFetching,
  pagination,
  setPagination,
}: OrdersMobileProps) => {
  const onChangePage = (page: number) => {
    setPagination({ ...pagination, pageIndex: page });
  };

  const onChangePageSize = (size: number) => {
    setPagination({ ...pagination, pageSize: size, pageIndex: 0 });
  };

  if (isLoading || isFetching) {
    return <SkeletonListMobile />;
  }

  if (orders.length === 0) {
    return (
      <div className="py-8xl flex flex-col items-center justify-center text-center">
        <Typography variant="body-sm" className="mb-xs" color="quaternary">
          No orders found
        </Typography>
        <Typography variant="body-xs" color="disabled">
          Try adjusting your search or filters
        </Typography>
      </div>
    );
  }

  return (
    <div className="gap-xl flex flex-col">
      <div className="gap-xl flex flex-col">
        {orders.map((order) => (
          <OrderItemMobile key={order.id} order={order} />
        ))}
      </div>
      {totalItems > 0 && (
        <Pagination
          pageIndex={pagination.pageIndex}
          pageSize={pagination.pageSize}
          totalItems={totalItems}
          onChangePage={onChangePage}
          onChangePageSize={onChangePageSize}
        />
      )}
    </div>
  );
};
