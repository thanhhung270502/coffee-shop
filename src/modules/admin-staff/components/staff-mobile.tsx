"use client";

import type { StaffObject } from "@common/models/staff";
import type { PaginationState } from "@tanstack/react-table";

import { Pagination } from "@/shared/components/pagination";
import { SkeletonListMobile } from "@/shared/components/skeleton-list-mobile";
import { Typography } from "@/shared/components/typography";

import type { UseStaffFormReturn } from "../hooks/use-staff-form";

import { StaffItemMobile } from "./staff-item-mobile";

type StaffMobileProps = {
  staff: StaffObject[];
  totalItems: number;
  isLoading: boolean;
  isFetching: boolean;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  openEdit: UseStaffFormReturn["openEdit"];
};

export const StaffMobile = ({
  staff,
  totalItems,
  isLoading,
  isFetching,
  pagination,
  setPagination,
  openEdit,
}: StaffMobileProps) => {
  const onChangePage = (page: number) => {
    setPagination({ ...pagination, pageIndex: page });
  };

  const onChangePageSize = (size: number) => {
    setPagination({ ...pagination, pageSize: size, pageIndex: 0 });
  };

  if (isLoading || isFetching) {
    return <SkeletonListMobile />;
  }

  if (staff.length === 0) {
    return (
      <div className="py-8xl flex flex-col items-center justify-center text-center">
        <Typography variant="body-sm" className="mb-xs" color="quaternary">
          No staff found
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
        {staff.map((member) => (
          <StaffItemMobile key={member.id} staff={member} openEdit={openEdit} />
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
