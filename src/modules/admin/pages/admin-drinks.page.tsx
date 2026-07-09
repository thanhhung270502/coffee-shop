"use client";

import { useMemo } from "react";
import type { DrinkObject } from "@common/models/product";
import type { ColumnDef } from "@tanstack/react-table";
import { Add, Edit2 } from "iconsax-reactjs";

import { AdminPageHeader } from "@/modules/admin/components/admin-page-header";
import { DrinkForm } from "@/modules/admin/components/drink-form";
import { ToppingForm } from "@/modules/admin/components/topping-form";
import { useDrinkForm } from "@/modules/admin/hooks/use-drink-form";
import { useToppingForm } from "@/modules/admin/hooks/use-topping-form";
import { Badge } from "@/shared/components/badge";
import { Button } from "@/shared/components/button";
import { Dialog, DialogContent, DialogTrigger } from "@/shared/components/dialog";
import { Table } from "@/shared/components/table";
import { Typography } from "@/shared/components/typography";
import { useUpdateDrinkStatusMutation } from "@/shared/mutations/use-admin-drink-mutations";
import {
  useDeleteToppingMutation,
  useUpdateToppingMutation,
} from "@/shared/mutations/use-admin-topping-mutations";
import { useQueryAdminDrinks } from "@/shared/queries/use-query-admin-drinks";
import { formatCurrency } from "@/shared/utils/currency.util";

export function AdminDrinksPage() {
  const { data, isLoading } = useQueryAdminDrinks();
  const statusMutation = useUpdateDrinkStatusMutation();
  const updateToppingMutation = useUpdateToppingMutation();
  const deleteToppingMutation = useDeleteToppingMutation();

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
    toppingItems,
    toppings,
  } = useDrinkForm();
  const {
    methods: toppingMethods,
    onSubmit: onToppingSubmit,
    isSubmitting: isToppingSubmitting,
  } = useToppingForm();

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
    [openEdit, statusMutation]
  );

  return (
    <div>
      <AdminPageHeader
        title="Drinks"
        description="Manage drink menu, sizes, and toppings"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
              render={
                <Button variant="primary" size="sm" startIcon={Add} onClick={openCreate}>
                  Add Drink
                </Button>
              }
            />
            <DialogContent className="w-full! max-w-lg">
              <div className="p-6">
                <DrinkForm
                  methods={methods}
                  onSubmit={onSubmit}
                  isSubmitting={isSubmitting}
                  editing={editing}
                  categoryOptions={categoryOptions}
                  toppingItems={toppingItems}
                  toppings={toppings}
                />
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="border-primary mb-6 rounded-xl border bg-white p-4">
        <Typography variant="heading-sm" weight="semibold" className="mb-3">
          Manage Toppings
        </Typography>
        <ToppingForm
          methods={toppingMethods}
          onSubmit={onToppingSubmit}
          isSubmitting={isToppingSubmitting}
        />
        <div className="flex flex-wrap gap-2">
          {toppings.map((t) => (
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
