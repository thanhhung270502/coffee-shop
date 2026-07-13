"use client";

import { PageHeader } from "@/shared/components/page-header";
import { useSmaller } from "@/shared/hooks";

import { ProductFormDialog, ProductsMobile, ProductsTable, ProductsToolbar } from "../components";
import { useAdminProducts } from "../hooks/use-admin-products";
import { useProductForm } from "../hooks/use-product-form";

export const AdminProductsPage = () => {
  const isMobile = useSmaller("sm");
  const hook = useAdminProducts();
  const formHook = useProductForm();

  const List = isMobile ? ProductsMobile : ProductsTable;

  return (
    <div className="gap-4xl flex flex-col">
      <PageHeader
        title="Packaged Products"
        description="Manage packaged products and inventory"
        action={<ProductFormDialog {...formHook} />}
      />
      <div className="p-3xl md:p-4xl gap-4xl flex flex-col rounded-xl bg-white">
        <ProductsToolbar
          search={hook.search}
          categoryId={hook.categoryId}
          onSearchChange={hook.onSearchChange}
          onCategoryChange={hook.onCategoryChange}
          setRequest={hook.setRequest}
          isFiltering={hook.isFiltering}
        />
        <List
          products={hook.products}
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
