"use client";

import { useCallback, useMemo, useState } from "react";
import type { CategoryObject, EProductType } from "@common/models/category";
import type { ColumnDef } from "@tanstack/react-table";
import { Add, Edit2, Trash } from "iconsax-reactjs";

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
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "@/shared/mutations/use-admin-category-mutations";
import { useQueryAdminCategories } from "@/shared/queries/use-query-admin-categories";
import { cn } from "@/shared/utils";

const TABS: { label: string; type: EProductType }[] = [
  { label: "Drinks", type: "DRINK" as EProductType },
  { label: "Products", type: "PACKAGED" as EProductType },
];

type CategoryFormState = {
  name: string;
  sortOrder: string;
};

const emptyForm: CategoryFormState = { name: "", sortOrder: "0" };

export function AdminCategoriesPage() {
  const [activeTab, setActiveTab] = useState<EProductType>("DRINK" as EProductType);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryObject | null>(null);
  const [form, setForm] = useState<CategoryFormState>(emptyForm);

  const { data, isLoading } = useQueryAdminCategories(activeTab);
  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();
  const deleteMutation = useDeleteCategoryMutation();

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Delete this category?")) return;
      await deleteMutation.mutateAsync(id);
    },
    [deleteMutation],
  );

  const columns = useMemo<ColumnDef<CategoryObject>[]>(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "slug", header: "Slug" },
      { accessorKey: "sortOrder", header: "Sort Order" },
      {
        accessorKey: "productCount",
        header: "Products",
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={row.original.isActive ? "success" : "default"}>
            {row.original.isActive ? "Active" : "Hidden"}
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
              variant="destructive-tertiary"
              size="sm"
              startIcon={Trash}
              onClick={() => handleDelete(row.original.id)}
              disabled={deleteMutation.isPending}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [deleteMutation, handleDelete],
  );

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (category: CategoryObject) => {
    setEditing(category);
    setForm({ name: category.name, sortOrder: String(category.sortOrder) });
    setFormOpen(true);
  };

  const handleSubmit = async () => {
    const sortOrder = Number(form.sortOrder) || 0;
    if (editing) {
      await updateMutation.mutateAsync({
        id: editing.id,
        data: { name: form.name, sortOrder },
      });
    } else {
      await createMutation.mutateAsync({
        name: form.name,
        type: activeTab,
        sortOrder,
      });
    }
    setFormOpen(false);
    setForm(emptyForm);
    setEditing(null);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <AdminPageHeader
        title="Categories"
        description="Manage drink and packaged product categories"
        action={
          <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogTrigger
              render={
                <Button variant="primary" size="sm" startIcon={Add} onClick={openCreate}>
                  Add Category
                </Button>
              }
            />
            <DialogContent className="!w-full max-w-md">
              <div className="flex flex-col gap-4 p-6">
                <DialogTitle>{editing ? "Edit Category" : "Add Category"}</DialogTitle>
                <Input
                  label="Category Name"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  label="Sort Order"
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: e.target.value }))}
                />
                <div className="flex justify-end gap-2">
                  <DialogClose
                    render={
                      <Button variant="secondary-gray" size="sm">
                        Cancel
                      </Button>
                    }
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSubmit}
                    disabled={!form.name || isSubmitting}
                  >
                    {editing ? "Update" : "Create"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="mb-4 flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.type}
            type="button"
            onClick={() => setActiveTab(tab.type)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.type
                ? "bg-brand-primary text-brand-tertiary"
                : "bg-white text-secondary hover:bg-secondary-hover",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-primary bg-white p-4">
        <Table
          data={data?.categories ?? []}
          columns={columns}
          isLoading={isLoading}
          emptyState={
            <Typography variant="body-sm" color="secondary">
              No categories yet
            </Typography>
          }
        />
      </div>
    </div>
  );
}
