"use client";

import type { PackagedProductObject } from "@common/models/product";

import { Badge } from "@/shared/components/badge";

type ProductStockProps = {
  product: PackagedProductObject;
};

export const ProductStock = ({ product }: ProductStockProps) => (
  <Badge variant={product.totalStock < 5 ? "warning" : "success"}>
    {product.totalStock}
  </Badge>
);
