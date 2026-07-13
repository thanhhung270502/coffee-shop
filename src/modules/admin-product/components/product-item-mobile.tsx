"use client";

import type { PackagedProductObject } from "@common/models/product";
import { Edit2 } from "iconsax-reactjs";

import { Button } from "@/shared/components/button";
import { Typography } from "@/shared/components/typography";

import type { UseProductFormReturn } from "../hooks/use-product-form";

import { ProductStock } from "./product-stock";

type ProductItemMobileProps = {
  product: PackagedProductObject;
  openEdit: UseProductFormReturn["openEdit"];
  onAdjustStock: (product: PackagedProductObject) => void;
};

export const ProductItemMobile = ({
  product,
  openEdit,
  onAdjustStock,
}: ProductItemMobileProps) => {
  const skuSummary = product.skus.map((s) => `${s.label}: ${s.stock}`).join(", ");

  return (
    <div className="gap-md p-lg flex flex-col rounded-xl border border-gray-200 bg-white">
      <div className="flex items-start justify-between">
        <div className="gap-xs flex flex-col">
          <Typography variant="body-sm" className="font-medium">
            {product.name}
          </Typography>
          <Typography variant="body-xs" color="secondary">
            {product.categoryName}
          </Typography>
        </div>
        <ProductStock product={product} />
      </div>
      {skuSummary && (
        <Typography variant="body-xs" color="secondary">
          {skuSummary}
        </Typography>
      )}
      <div className="flex justify-end gap-2">
        <Button
          variant="tertiary-gray"
          size="xs"
          startIcon={Edit2}
          onClick={() => openEdit(product)}
        >
          Edit
        </Button>
        {product.skus[0] && (
          <Button variant="secondary-gray" size="xs" onClick={() => onAdjustStock(product)}>
            Adjust Stock
          </Button>
        )}
      </div>
    </div>
  );
};
