"use client";

import type { DashboardTopProductsResponse } from "@common/models/dashboard";

import { Skeleton } from "@/shared/components/skeleton";
import { Typography } from "@/shared/components/typography";

import { TOP_PRODUCTS_LIMIT } from "../constants";

type TopProductItem = DashboardTopProductsResponse["products"][number];

type TopProductsListProps = {
  products: TopProductItem[];
  isLoading: boolean;
};

export const TopProductsList = ({ products, isLoading }: TopProductsListProps) => {
  return (
    <div className="p-4xl rounded-xl border border-primary bg-white">
      <Typography variant="heading-sm" weight="semibold" className="mb-4xl">
        Top {TOP_PRODUCTS_LIMIT} Products
      </Typography>
      {isLoading ? (
        <div className="gap-3xl flex flex-col">
          {Array.from({ length: TOP_PRODUCTS_LIMIT }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <Typography variant="body-sm" color="secondary">
          No data yet
        </Typography>
      ) : (
        <div className="gap-2xl flex flex-col">
          {products.map((product, i) => (
            <div key={product.productId} className="flex items-center justify-between gap-2xl">
              <div className="gap-md flex items-center">
                <Typography variant="body-xs" color="secondary" className="w-5 text-right">
                  {i + 1}.
                </Typography>
                <Typography variant="body-sm">{product.productName}</Typography>
              </div>
              <Typography variant="body-sm" color="secondary">
                {product.quantitySold} sold
              </Typography>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
