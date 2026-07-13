"use client";

import { useCallback } from "react";
import type { PackagedProductObject } from "@common/models/product";
import type { PaginationState } from "@tanstack/react-table";

import { Pagination } from "@/shared/components/pagination";
import { SkeletonListMobile } from "@/shared/components/skeleton-list-mobile";
import { Typography } from "@/shared/components/typography";
import { useUpdateProductStockMutation } from "@/shared/mutations/use-admin-product-mutations";

import type { UseProductFormReturn } from "../hooks/use-product-form";

import { ProductItemMobile } from "./product-item-mobile";

type ProductsMobileProps = {
  products: PackagedProductObject[];
  totalItems: number;
  isLoading: boolean;
  isFetching: boolean;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  openEdit: UseProductFormReturn["openEdit"];
};

export const ProductsMobile = ({
  products,
  totalItems,
  isLoading,
  isFetching,
  pagination,
  setPagination,
  openEdit,
}: ProductsMobileProps) => {
  const stockMutation = useUpdateProductStockMutation();

  const handleAdjustStock = useCallback(
    (product: PackagedProductObject) => {
      const firstSku = product.skus[0];
      if (!firstSku) return;
      const newStock = prompt("Enter new stock:", String(firstSku.stock));
      if (newStock !== null) {
        stockMutation.mutate({
          id: product.id,
          data: { skuId: firstSku.id, stock: Number(newStock) },
        });
      }
    },
    [stockMutation],
  );

  const onChangePage = (page: number) => {
    setPagination({ ...pagination, pageIndex: page });
  };

  const onChangePageSize = (size: number) => {
    setPagination({ ...pagination, pageSize: size, pageIndex: 0 });
  };

  if (isLoading || isFetching) {
    return <SkeletonListMobile />;
  }

  if (products.length === 0) {
    return (
      <div className="py-8xl flex flex-col items-center justify-center text-center">
        <Typography variant="body-sm" className="mb-xs" color="quaternary">
          No products found
        </Typography>
        <Typography variant="body-xs" color="disabled">
          Try adjusting your search or filters
        </Typography>
      </div>
    );
  }

  return (
    <div className="gap-xl flex flex-col">
      <div className="gap-xl flex flex-col">
        {products.map((product) => (
          <ProductItemMobile
            key={product.id}
            product={product}
            openEdit={openEdit}
            onAdjustStock={handleAdjustStock}
          />
        ))}
      </div>
      {totalItems > 0 && (
        <Pagination
          pageIndex={pagination.pageIndex}
          pageSize={pagination.pageSize}
          totalItems={totalItems}
          onChangePage={onChangePage}
          onChangePageSize={onChangePageSize}
        />
      )}
    </div>
  );
};
