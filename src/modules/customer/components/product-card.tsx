"use client";

import type { PublicProductObject } from "@common/models/catalog";
import { Box } from "iconsax-reactjs";

import { Badge, Card, CardContent, Typography } from "@/shared/components";
import { formatCurrency } from "@/shared/utils/currency.util";

type ProductCardProps = {
  product: PublicProductObject;
  onSelect: (product: PublicProductObject) => void;
};

export function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <button type="button" onClick={() => onSelect(product)} className="w-full text-left">
      <Card className="h-full overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md">
        <div className="relative aspect-4/3 overflow-hidden bg-zinc-100">
          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-zinc-300">
              <Box size={32} variant="Bold" />
            </div>
          )}
          {!product.inStock ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60">
              <Badge variant="warning">Out of Stock</Badge>
            </div>
          ) : null}
        </div>
        <CardContent className="space-y-1">
          <Typography variant="heading-sm" className="line-clamp-1">
            {product.name}
          </Typography>
          {product.description ? (
            <Typography variant="body-xs" color="secondary" className="line-clamp-1">
              {product.description}
            </Typography>
          ) : null}
          <Typography variant="body-sm" color="secondary">
            From {formatCurrency(product.minPrice)}
          </Typography>
        </CardContent>
      </Card>
    </button>
  );
}
