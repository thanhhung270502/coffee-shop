"use client";

import { PageHeader } from "@/shared/components/page-header";
import { useSmaller } from "@/shared/hooks";

import { CategoriesMobile, CategoriesTable, CategoriesToolbar, CategoryFormDialog } from "../components";
import { useAdminCategories } from "../hooks/use-admin-categories";
import { useCategoryForm } from "../hooks/use-category-form";

export const AdminCategoriesPage = () => {
  const isMobile = useSmaller("sm");
  const hook = useAdminCategories();
  const formHook = useCategoryForm(hook.type);

  const List = isMobile ? CategoriesMobile : CategoriesTable;

  return (
    <div className="gap-4xl flex flex-col">
      <PageHeader
        title="Categories"
        description="Manage drink and packaged product categories"
        action={<CategoryFormDialog {...formHook} />}
      />
      <div className="p-3xl md:p-4xl gap-4xl flex flex-col rounded-xl bg-white">
        <CategoriesToolbar
          search={hook.search}
          type={hook.type}
          onSearchChange={hook.onSearchChange}
          onTypeChange={hook.onTypeChange}
          setRequest={hook.setRequest}
          isFiltering={hook.isFiltering}
        />
        <List
          categories={hook.categories}
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
