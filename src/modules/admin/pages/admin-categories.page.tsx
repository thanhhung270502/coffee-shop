"use client";

import { useCallback, useMemo, useState } from "react";
import type { CategoryObject, EProductType } from "@common/models/category";
import type { ColumnDef } from "@tanstack/react-table";
import { Add, Edit2, Trash } from "iconsax-reactjs";

import { AdminPageHeader } from "@/modules/admin/components/admin-page-header";
import { CategoryForm } from "@/modules/admin/components/category-form";
import { useCategoryForm } from "@/modules/admin/hooks/use-category-form";
import { Badge } from "@/shared/components/badge";
import { Button } from "@/shared/components/button";
import { Dialog, DialogContent, DialogTrigger } from "@/shared/components/dialog";
import { Table } from "@/shared/components/table";
import { Typography } from "@/shared/components/typography";
import { useDeleteCategoryMutation } from "@/shared/mutations/use-admin-category-mutations";
import { useQueryAdminCategories } from "@/shared/queries/use-query-admin-categories";
import { cn } from "@/shared/utils";

const TABS: { label: string; type: EProductType }[] = [
  { label: "Drinks", type: "DRINK" as EProductType },
  { label: "Products", type: "PACKAGED" as EProductType },
];

export function AdminCategoriesPage() {
  const [activeTab, setActiveTab] = useState<EProductType>("DRINK" as EProductType);

  const { data, isLoading } = useQueryAdminCategories(activeTab);
  const deleteMutation = useDeleteCategoryMutation();
  const {
    open,
    setOpen,
    openCreate,
    openEdit,
    editing,
    methods,
    onSubmit,
    isSubmitting,
  } = useCategoryForm(activeTab);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Delete this category?")) return;
      await deleteMutation.mutateAsync(id);
    },
    [deleteMutation]
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
    [openEdit, deleteMutation, handleDelete]
  );

  return (
    <div>
      <AdminPageHeader
        title="Categories"
        description="Manage drink and packaged product categories"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
              render={
                <Button variant="primary" size="sm" startIcon={Add} onClick={openCreate}>
                  Add Category
                </Button>
              }
            />
            <DialogContent className="w-full! max-w-md">
              <div className="p-6">
                <CategoryForm
                  methods={methods}
                  onSubmit={onSubmit}
                  isSubmitting={isSubmitting}
                  editing={editing}
                />
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
                : "text-secondary hover:bg-secondary-hover bg-white"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="border-primary rounded-xl border bg-white p-4">
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
