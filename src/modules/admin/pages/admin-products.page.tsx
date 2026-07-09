"use client";

import { useMemo, useState } from "react";
import { EProductType } from "@common/models/category";
import type { PackagedProductObject } from "@common/models/product";
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
  useCreateProductMutation,
  useUpdateProductMutation,
  useUpdateProductStockMutation,
} from "@/shared/mutations/use-admin-product-mutations";
import { useQueryAdminCategories } from "@/shared/queries/use-query-admin-categories";
import { useQueryAdminProducts } from "@/shared/queries/use-query-admin-products";

type ProductFormState = {
  name: string;
  categoryId: string;
  description: string;
  image: string;
  skus: { label: string; sku: string; price: string; stock: string }[];
};

export function AdminProductsPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PackagedProductObject | null>(null);
  const [form, setForm] = useState<ProductFormState>({
    name: "",
    categoryId: "",
    description: "",
    image: "",
    skus: [{ label: "250g", sku: "", price: "150000", stock: "10" }],
  });

  const { data: categories } = useQueryAdminCategories(EProductType.PACKAGED);
  const { data, isLoading } = useQueryAdminProducts();
  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();
  const stockMutation = useUpdateProductStockMutation();

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
    [stockMutation]
  );

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: "",
      categoryId: categories?.categories[0]?.id ?? "",
      description: "",
      image: "",
      skus: [{ label: "250g", sku: "", price: "150000", stock: "10" }],
    });
    setFormOpen(true);
  };

  const openEdit = (product: PackagedProductObject) => {
    setEditing(product);
    setForm({
      name: product.name,
      categoryId: product.categoryId,
      description: product.description ?? "",
      image: product.image ?? "",
      skus: product.skus.map((s) => ({
        label: s.label,
        sku: s.sku ?? "",
        price: String(s.price),
        stock: String(s.stock),
      })),
    });
    setFormOpen(true);
  };

  const handleSubmit = async () => {
    const payload = {
      name: form.name,
      categoryId: form.categoryId,
      description: form.description || undefined,
      image: form.image || undefined,
      skus: form.skus.map((s) => ({
        label: s.label,
        sku: s.sku || undefined,
        price: Number(s.price),
        stock: Number(s.stock),
      })),
    };
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setFormOpen(false);
  };

  return (
    <div>
      <AdminPageHeader
        title="Packaged Products"
        description="Manage packaged products and inventory"
        action={
          <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogTrigger
              render={
                <Button variant="primary" size="sm" startIcon={Add} onClick={openCreate}>
                  Add Product
                </Button>
              }
            />
            <DialogContent className="w-full! max-w-lg">
              <div className="flex max-h-[80vh] flex-col gap-4 overflow-y-auto p-6">
                <DialogTitle>{editing ? "Edit Product" : "Add Product"}</DialogTitle>
                <Input
                  label="Name"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                />
                <div>
                  <Typography variant="body-sm" className="mb-1">
                    Category
                  </Typography>
                  <select
                    className="border-primary w-full rounded-lg border px-3 py-2 text-sm"
                    value={form.categoryId}
                    onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
                  >
                    {categories?.categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Description"
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                />
                {form.skus.map((s, i) => (
                  <div key={i} className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Label (250g)"
                      value={s.label}
                      onChange={(e) => {
                        const skus = [...form.skus];
                        skus[i] = { ...skus[i], label: e.target.value };
                        setForm((p) => ({ ...p, skus }));
                      }}
                    />
                    <Input
                      placeholder="SKU code"
                      value={s.sku}
                      onChange={(e) => {
                        const skus = [...form.skus];
                        skus[i] = { ...skus[i], sku: e.target.value };
                        setForm((p) => ({ ...p, skus }));
                      }}
                    />
                    <Input
                      placeholder="Price"
                      type="number"
                      value={s.price}
                      onChange={(e) => {
                        const skus = [...form.skus];
                        skus[i] = { ...skus[i], price: e.target.value };
                        setForm((p) => ({ ...p, skus }));
                      }}
                    />
                    <Input
                      placeholder="Stock"
                      type="number"
                      value={s.stock}
                      onChange={(e) => {
                        const skus = [...form.skus];
                        skus[i] = { ...skus[i], stock: e.target.value };
                        setForm((p) => ({ ...p, skus }));
                      }}
                    />
                  </div>
                ))}
                <div className="flex justify-end gap-2">
                  <DialogClose
                    render={
                      <Button variant="secondary-gray" size="sm">
                        Cancel
                      </Button>
                    }
                  />
                  <Button variant="primary" size="sm" onClick={handleSubmit} disabled={!form.name}>
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
