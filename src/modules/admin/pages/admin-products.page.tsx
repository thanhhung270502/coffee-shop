"use client";

import { useMemo } from "react";
import type { PackagedProductObject } from "@common/models/product";
import type { ColumnDef } from "@tanstack/react-table";
import { Add, Edit2 } from "iconsax-reactjs";

import { AdminPageHeader } from "@/modules/admin/components/admin-page-header";
import { ProductForm } from "@/modules/admin/components/product-form";
import { useProductForm } from "@/modules/admin/hooks/use-product-form";
import { Badge } from "@/shared/components/badge";
import { Button } from "@/shared/components/button";
import { Dialog, DialogContent, DialogTrigger } from "@/shared/components/dialog";
import { Table } from "@/shared/components/table";
import { Typography } from "@/shared/components/typography";
import { useUpdateProductStockMutation } from "@/shared/mutations/use-admin-product-mutations";
import { useQueryAdminProducts } from "@/shared/queries/use-query-admin-products";

export function AdminProductsPage() {
  const { data, isLoading } = useQueryAdminProducts();
  const stockMutation = useUpdateProductStockMutation();
  const {
    open,
    setOpen,
    openCreate,
    openEdit,
    editing,
    methods,
    onSubmit,
    isSubmitting,
    categoryOptions,
  } = useProductForm();

  const columns = useMemo<ColumnDef<PackagedProductObject>[]>(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "categoryName", header: "Category" },
      {
        accessorKey: "totalStock",
        header: "Stock",
        cell: ({ row }) => (
          <Badge variant={row.original.totalStock < 5 ? "warning" : "success"}>
            {row.original.totalStock}
          </Badge>
        ),
      },
      {
        id: "skus",
        header: "SKUs",
        cell: ({ row }) => row.original.skus.map((s) => `${s.label}: ${s.stock}`).join(", "),
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
            {row.original.skus[0] && (
              <Button
                variant="secondary-gray"
                size="sm"
                onClick={() => {
                  const newStock = prompt("Enter new stock:", String(row.original.skus[0].stock));
                  if (newStock !== null) {
                    stockMutation.mutate({
                      id: row.original.id,
                      data: { skuId: row.original.skus[0].id, stock: Number(newStock) },
                    });
                  }
                }}
              >
                Adjust Stock
              </Button>
            )}
          </div>
        ),
      },
    ],
    [openEdit, stockMutation]
  );

  return (
    <div>
      <AdminPageHeader
        title="Packaged Products"
        description="Manage packaged products and inventory"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
              render={
                <Button variant="primary" size="sm" startIcon={Add} onClick={openCreate}>
                  Add Product
                </Button>
              }
            />
            <DialogContent className="w-full! max-w-lg">
              <div className="p-6">
                <ProductForm
                  methods={methods}
                  onSubmit={onSubmit}
                  isSubmitting={isSubmitting}
                  editing={editing}
                  categoryOptions={categoryOptions}
                />
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="border-primary rounded-xl border bg-white p-4">
        <Table
          data={data?.products ?? []}
          columns={columns}
          isLoading={isLoading}
          emptyState={
            <Typography variant="body-sm" color="secondary">
              No products yet
            </Typography>
          }
        />
      </div>
    </div>
  );
}
