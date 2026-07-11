"use client";

import type { PublicProductObject } from "@common/models/catalog";

import { Badge, Card, CardContent, Typography } from "@/shared/components";
import { formatCurrency } from "@/shared/utils/currency.util";

type ProductCardProps = {
  product: PublicProductObject;
  onSelect: (product: PublicProductObject) => void;
};

export function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <button type="button" onClick={() => onSelect(product)} className="text-left">
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        <div className="aspect-[4/3] bg-zinc-100">
          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-400">No image</div>
          )}
        </div>
        <CardContent className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <Typography variant="heading-sm">{product.name}</Typography>
            {!product.inStock ? <Badge variant="warning">Out of Stock</Badge> : null}
          </div>
          <Typography variant="body-sm" color="secondary">
            From {formatCurrency(product.minPrice)}
          </Typography>
        </CardContent>
      </Card>
    </button>
  );
}
