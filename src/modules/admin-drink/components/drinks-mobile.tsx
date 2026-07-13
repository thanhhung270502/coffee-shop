"use client";

import { useCallback } from "react";
import type { DrinkObject } from "@common/models/product";
import type { PaginationState } from "@tanstack/react-table";

import { Pagination } from "@/shared/components/pagination";
import { SkeletonListMobile } from "@/shared/components/skeleton-list-mobile";
import { Typography } from "@/shared/components/typography";
import { useUpdateDrinkStatusMutation } from "@/shared/mutations/use-admin-drink-mutations";

import type { UseDrinkFormReturn } from "../hooks/use-drink-form";

import { DrinkItemMobile } from "./drink-item-mobile";

type DrinksMobileProps = {
  drinks: DrinkObject[];
  totalItems: number;
  isLoading: boolean;
  isFetching: boolean;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  openEdit: UseDrinkFormReturn["openEdit"];
};

export const DrinksMobile = ({
  drinks,
  totalItems,
  isLoading,
  isFetching,
  pagination,
  setPagination,
  openEdit,
}: DrinksMobileProps) => {
  const statusMutation = useUpdateDrinkStatusMutation();

  const handleToggleStatus = useCallback(
    (drink: DrinkObject) => {
      statusMutation.mutate({
        id: drink.id,
        data: { isActive: !drink.isActive },
      });
    },
    [statusMutation],
  );

  const onChangePage = (page: number) => {
    setPagination({ ...pagination, pageIndex: page });
  };

  const onChangePageSize = (size: number) => {
    setPagination({ ...pagination, pageSize: size, pageIndex: 0 });
  };

  if (isLoading || isFetching) {
    return <SkeletonListMobile />;
  }

  if (drinks.length === 0) {
    return (
      <div className="py-8xl flex flex-col items-center justify-center text-center">
        <Typography variant="body-sm" className="mb-xs" color="quaternary">
          No drinks found
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
        {drinks.map((drink) => (
          <DrinkItemMobile
            key={drink.id}
            drink={drink}
            openEdit={openEdit}
            onToggleStatus={handleToggleStatus}
            isTogglingStatus={statusMutation.isPending}
          />
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
