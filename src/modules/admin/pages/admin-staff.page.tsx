"use client";

import { useMemo } from "react";
import type { StaffObject } from "@common/models/staff";
import type { ColumnDef } from "@tanstack/react-table";
import { Add, Edit2 } from "iconsax-reactjs";

import { AdminPageHeader } from "@/modules/admin/components/admin-page-header";
import { StaffForm } from "@/modules/admin/components/staff-form";
import { useStaffForm } from "@/modules/admin/hooks/use-staff-form";
import { Badge } from "@/shared/components/badge";
import { Button } from "@/shared/components/button";
import { Dialog, DialogContent, DialogTrigger } from "@/shared/components/dialog";
import { Table } from "@/shared/components/table";
import { Typography } from "@/shared/components/typography";
import { useResetStaffPasswordMutation } from "@/shared/mutations/use-admin-staff-mutations";
import { useQueryAdminStaff } from "@/shared/queries/use-query-admin-staff";

export function AdminStaffPage() {
  const { data, isLoading } = useQueryAdminStaff();
  const resetPasswordMutation = useResetStaffPasswordMutation();
  const {
    open,
    setOpen,
    openCreate,
    openEdit,
    editing,
    isEditing,
    methods,
    onSubmit,
    isSubmitting,
  } = useStaffForm();

  const columns = useMemo<ColumnDef<StaffObject>[]>(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "phone", header: "Phone" },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={row.original.isActive ? "success" : "default"}>
            {row.original.isActive ? "Active" : "Inactive"}
          </Badge>
        ),
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
    [resetPasswordMutation, openEdit]
  );

  return (
    <div>
      <AdminPageHeader
        title="Staff"
        description="Manage POS staff accounts"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
              render={
                <Button variant="primary" size="sm" startIcon={Add} onClick={openCreate}>
                  Add Staff
                </Button>
              }
            />
            <DialogContent className="w-full! max-w-md">
              <div className="p-6">
                <StaffForm
                  methods={methods}
                  onSubmit={onSubmit}
                  isSubmitting={isSubmitting}
                  editing={editing}
                  isEditing={isEditing}
                />
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="border-primary rounded-xl border bg-white p-4">
        <Table
          data={data?.staff ?? []}
          columns={columns}
          isLoading={isLoading}
          emptyState={
            <Typography variant="body-sm" color="secondary">
              No staff yet
            </Typography>
          }
        />
      </div>
    </div>
  );
}
