"use client";

import { useMemo, useState } from "react";
import { EProductType } from "@common/models/category";
import type { DrinkObject } from "@common/models/product";
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
  useCreateDrinkMutation,
  useUpdateDrinkMutation,
  useUpdateDrinkStatusMutation,
} from "@/shared/mutations/use-admin-drink-mutations";
import {
  useCreateToppingMutation,
  useDeleteToppingMutation,
  useUpdateToppingMutation,
} from "@/shared/mutations/use-admin-topping-mutations";
import { useQueryAdminCategories } from "@/shared/queries/use-query-admin-categories";
import { useQueryAdminDrinks } from "@/shared/queries/use-query-admin-drinks";
import { useQueryAdminToppings } from "@/shared/queries/use-query-admin-toppings";
import { formatCurrency } from "@/shared/utils/currency.util";

type DrinkFormState = {
  name: string;
  categoryId: string;
  description: string;
  image: string;
  variants: { name: string; price: string }[];
  toppingIds: string[];
};

const defaultVariants = [
  { name: "S", price: "25000" },
  { name: "M", price: "30000" },
  { name: "L", price: "35000" },
];

export function AdminDrinksPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<DrinkObject | null>(null);
  const [form, setForm] = useState<DrinkFormState>({
    name: "",
    categoryId: "",
    description: "",
    image: "",
    variants: defaultVariants,
    toppingIds: [],
  });
  const [toppingForm, setToppingForm] = useState({ name: "", price: "" });

  const { data: categories } = useQueryAdminCategories(EProductType.DRINK);
  const { data: toppings } = useQueryAdminToppings();
  const { data, isLoading } = useQueryAdminDrinks();
  const createMutation = useCreateDrinkMutation();
  const updateMutation = useUpdateDrinkMutation();
  const statusMutation = useUpdateDrinkStatusMutation();
  const createToppingMutation = useCreateToppingMutation();
  const updateToppingMutation = useUpdateToppingMutation();
  const deleteToppingMutation = useDeleteToppingMutation();

  const columns = useMemo<ColumnDef<DrinkObject>[]>(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "categoryName", header: "Category" },
      {
        id: "price",
        header: "From",
        cell: ({ row }) => {
          const min = Math.min(...row.original.variants.map((v) => v.price));
          return formatCurrency(min);
        },
      },
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
              onClick={() =>
                statusMutation.mutate({
                  id: row.original.id,
                  data: { isActive: !row.original.isActive },
                })
              }
            >
              {row.original.isActive ? "Disable" : "Enable"}
            </Button>
          </div>
        ),
      },
    ],
    [statusMutation]
  );

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: "",
      categoryId: categories?.categories[0]?.id ?? "",
      description: "",
      image: "",
      variants: defaultVariants,
      toppingIds: [],
    });
    setFormOpen(true);
  };

  const openEdit = (drink: DrinkObject) => {
    setEditing(drink);
    setForm({
      name: drink.name,
      categoryId: drink.categoryId,
      description: drink.description ?? "",
      image: drink.image ?? "",
      variants: drink.variants.map((v) => ({ name: v.name, price: String(v.price) })),
      toppingIds: drink.toppings.map((t) => t.id),
    });
    setFormOpen(true);
  };

  const handleSubmit = async () => {
    const payload = {
      name: form.name,
      categoryId: form.categoryId,
      description: form.description || undefined,
      image: form.image || undefined,
      variants: form.variants.map((v) => ({ name: v.name, price: Number(v.price) })),
      toppingIds: form.toppingIds,
    };
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setFormOpen(false);
  };

  const handleAddTopping = async () => {
    if (!toppingForm.name || !toppingForm.price) return;
    await createToppingMutation.mutateAsync({
      name: toppingForm.name,
      price: Number(toppingForm.price),
    });
    setToppingForm({ name: "", price: "" });
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <AdminPageHeader
        title="Drinks"
        description="Manage drink menu, sizes, and toppings"
        action={
          <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogTrigger
              render={
                <Button variant="primary" size="sm" startIcon={Add} onClick={openCreate}>
                  Add Drink
                </Button>
              }
            />
            <DialogContent className="w-full! max-w-lg">
              <div className="flex max-h-[80vh] flex-col gap-4 overflow-y-auto p-6">
                <DialogTitle>{editing ? "Edit Drink" : "Add Drink"}</DialogTitle>
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
                <Input
                  label="Image (URL)"
                  value={form.image}
                  onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                />
                <div>
                  <Typography variant="body-sm" weight="semibold" className="mb-2">
                    Size & Price
                  </Typography>
                  {form.variants.map((v, i) => (
                    <div key={i} className="mb-2 flex gap-2">
                      <Input
                        placeholder="Size"
                        value={v.name}
                        onChange={(e) => {
                          const variants = [...form.variants];
                          variants[i] = { ...variants[i], name: e.target.value };
                          setForm((p) => ({ ...p, variants }));
                        }}
                      />
                      <Input
                        placeholder="Price"
                        type="number"
                        value={v.price}
                        onChange={(e) => {
                          const variants = [...form.variants];
                          variants[i] = { ...variants[i], price: e.target.value };
                          setForm((p) => ({ ...p, variants }));
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <Typography variant="body-sm" weight="semibold" className="mb-2">
                    Toppings
                  </Typography>
                  <div className="flex flex-wrap gap-2">
                    {toppings?.toppings.map((t) => (
                      <label key={t.id} className="flex items-center gap-1 text-sm">
                        <input
                          type="checkbox"
                          checked={form.toppingIds.includes(t.id)}
                          onChange={(e) => {
                            setForm((p) => ({
                              ...p,
                              toppingIds: e.target.checked
                                ? [...p.toppingIds, t.id]
                                : p.toppingIds.filter((id) => id !== t.id),
                            }));
                          }}
                        />
                        {t.name} (+{formatCurrency(t.price)})
                      </label>
                    ))}
                  </div>
                </div>
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

      <div className="border-primary mb-6 rounded-xl border bg-white p-4">
        <Typography variant="heading-sm" weight="semibold" className="mb-3">
          Manage Toppings
        </Typography>
        <div className="mb-3 flex gap-2">
          <Input
            placeholder="Topping name"
            value={toppingForm.name}
            onChange={(e) => setToppingForm((p) => ({ ...p, name: e.target.value }))}
          />
          <Input
            placeholder="Price"
            type="number"
            value={toppingForm.price}
            onChange={(e) => setToppingForm((p) => ({ ...p, price: e.target.value }))}
          />
          <Button variant="primary" size="sm" onClick={handleAddTopping}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {toppings?.toppings.map((t) => (
            <Badge key={t.id} variant={t.isActive ? "success" : "default"}>
              {t.name} — {formatCurrency(t.price)}
              <button
                type="button"
                className="ml--2 text-xs underline"
                onClick={() =>
                  updateToppingMutation.mutate({ id: t.id, data: { isActive: !t.isActive } })
                }
              >
                {t.isActive ? "Disable" : "Enable"}
              </button>
              <button
                type="button"
                className="text-error-primary ml-1 text-xs underline"
                onClick={() => deleteToppingMutation.mutate(t.id)}
              >
                Delete
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="border-primary rounded-xl border bg-white p-4">
        <Table
          data={data?.drinks ?? []}
          columns={columns}
          isLoading={isLoading}
          emptyState={
            <Typography variant="body-sm" color="secondary">
              No drinks yet
            </Typography>
          }
        />
      </div>
    </div>
  );
}
