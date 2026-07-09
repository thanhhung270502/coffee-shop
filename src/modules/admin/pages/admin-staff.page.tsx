"use client";

import { useMemo, useState } from "react";
import type { StaffObject } from "@common/models/staff";
import type { ColumnDef } from "@tanstack/react-table";
import { Add, Edit2 } from "iconsax-reactjs";

import { AdminPageHeader } from "@/modules/admin/components/admin-page-header";
import { Badge } from "@/shared/components/badge";
import { Button } from "@/shared/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/dialog";
import { Input } from "@/shared/components/input";
import { Table } from "@/shared/components/table";
import { Typography } from "@/shared/components/typography";
import {
  useCreateStaffMutation,
  useResetStaffPasswordMutation,
  useUpdateStaffMutation,
} from "@/shared/mutations/use-admin-staff-mutations";
import { useQueryAdminStaff } from "@/shared/queries/use-query-admin-staff";

type StaffFormState = {
  email: string;
  password: string;
  name: string;
  phone: string;
};

const emptyForm: StaffFormState = { email: "", password: "", name: "", phone: "" };

export function AdminStaffPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<StaffObject | null>(null);
  const [form, setForm] = useState<StaffFormState>(emptyForm);

  const { data, isLoading } = useQueryAdminStaff();
  const createMutation = useCreateStaffMutation();
  const updateMutation = useUpdateStaffMutation();
  const resetPasswordMutation = useResetStaffPasswordMutation();

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
    [resetPasswordMutation]
  );

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (staff: StaffObject) => {
    setEditing(staff);
    setForm({ email: staff.email, password: "", name: staff.name ?? "", phone: staff.phone ?? "" });
    setFormOpen(true);
  };

  const handleSubmit = async () => {
    if (editing) {
      await updateMutation.mutateAsync({
        id: editing.id,
        data: { name: form.name, phone: form.phone || null },
      });
    } else {
      await createMutation.mutateAsync({
        email: form.email,
        password: form.password,
        name: form.name || undefined,
        phone: form.phone || undefined,
      });
    }
    setFormOpen(false);
  };

  return (
    <div>
      <AdminPageHeader
        title="Staff"
        description="Manage POS staff accounts"
        action={
          <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogTrigger
              render={
                <Button variant="primary" size="sm" startIcon={Add} onClick={openCreate}>
                  Add Staff
                </Button>
              }
            />
            <DialogContent className="w-full! max-w-md">
              <div className="flex flex-col gap-4 p-6">
                <DialogTitle>{editing ? "Edit Staff" : "Add Staff"}</DialogTitle>
                {!editing && (
                  <>
                    <Input
                      label="Email"
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    />
                    <Input
                      label="Password"
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                    />
                  </>
                )}
                <Input
                  label="Name"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                />
                <Input
                  label="Phone"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                />
                <div className="flex justify-end gap-2">
                  <DialogClose
                    render={
                      <Button variant="secondary-gray" size="sm">
                        Cancel
                      </Button>
                    }
                  />
                  <Button variant="primary" size="sm" onClick={handleSubmit}>
                    {editing ? "Update" : "Create"}
                  </Button>
                </div>
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
