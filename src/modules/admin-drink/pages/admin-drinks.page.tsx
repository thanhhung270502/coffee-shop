"use client";

import { Typography } from "@/shared";
import { PageHeader } from "@/shared/components/page-header";
import { useSmaller } from "@/shared/hooks";

import {
  DrinkFormDialog,
  DrinksMobile,
  DrinksTable,
  DrinksToolbar,
  ToppingsSection,
} from "../components";
import { useAdminDrinks } from "../hooks/use-admin-drinks";
import { useDrinkForm } from "../hooks/use-drink-form";

export const AdminDrinksPage = () => {
  const isMobile = useSmaller("sm");
  const hook = useAdminDrinks();
  const formHook = useDrinkForm();

  const List = isMobile ? DrinksMobile : DrinksTable;

  return (
    <div className="gap-4xl flex flex-col">
      <PageHeader
        title="Drinks"
        description="Manage drink menu, sizes, and toppings"
        action={<DrinkFormDialog {...formHook} />}
      />
      <ToppingsSection />
      <div className="p-3xl md:p-4xl gap-4xl flex flex-col rounded-xl bg-white">
        <Typography variant="heading-sm" weight="semibold">
          Manage Drinks
        </Typography>
        <DrinksToolbar
          search={hook.search}
          categoryId={hook.categoryId}
          onSearchChange={hook.onSearchChange}
          onCategoryChange={hook.onCategoryChange}
          setRequest={hook.setRequest}
          isFiltering={hook.isFiltering}
        />
        <List
          drinks={hook.drinks}
          totalItems={hook.totalItems}
          isLoading={hook.isLoading}
          isFetching={hook.isFetching}
          pagination={hook.pagination}
          setPagination={hook.setPagination}
          openEdit={formHook.openEdit}
        />
      </div>
    </div>
  );
};
