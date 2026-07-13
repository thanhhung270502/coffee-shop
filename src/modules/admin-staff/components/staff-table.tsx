"use client";

import { useMemo } from "react";
import type { StaffObject } from "@common/models/staff";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Edit2 } from "iconsax-reactjs";

import { Button } from "@/shared/components/button";
import { Table } from "@/shared/components/table";
import { Typography } from "@/shared/components/typography";
import { useResetStaffPasswordMutation } from "@/shared/mutations/use-admin-staff-mutations";

import type { UseStaffFormReturn } from "../hooks/use-staff-form";

import { StaffStatus } from "./staff-status";

type StaffTableProps = {
  staff: StaffObject[];
  totalItems: number;
  isLoading: boolean;
  isFetching: boolean;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  openEdit: UseStaffFormReturn["openEdit"];
};

export const StaffTable = ({
  staff,
  totalItems,
  isLoading,
  isFetching,
  pagination,
  setPagination,
  openEdit,
}: StaffTableProps) => {
  const resetPasswordMutation = useResetStaffPasswordMutation();

  const columns = useMemo<ColumnDef<StaffObject>[]>(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "phone", header: "Phone" },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => <StaffStatus staff={row.original} />,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              variant="tertiary-gray"
              size="sm"
              startIcon={Edit2}
              onClick={() => openEdit(row.original)}
            >
              Edit
            </Button>
            <Button
              variant="secondary-gray"
              size="sm"
              onClick={() => {
                const password = prompt("New password (min 8 characters):");
                if (password) {
                  resetPasswordMutation.mutate({ id: row.original.id, data: { password } });
                }
              }}
            >
              Reset Password
            </Button>
          </div>
        ),
      },
    ],
    [resetPasswordMutation, openEdit],
  );

  return (
    <Table
      data={staff}
      columns={columns}
      isLoading={isLoading}
      isFetching={isFetching}
      pagination={pagination}
      setPagination={setPagination}
      rowCount={totalItems}
      manualPagination={true}
      emptyState={
        <Typography variant="body-sm" color="secondary">
          No staff yet
        </Typography>
      }
    />
  );
};
