"use client";

import type { PublicProductObject } from "@common/models/catalog";
import { Box } from "iconsax-reactjs";
import Link from "next/link";

import { Badge, Button, Card, CardContent, Typography } from "@/shared/components";
import { formatCurrency } from "@/shared/utils/currency.util";

type HomeProductCardProps = {
  product: PublicProductObject;
  showDealBadge?: boolean;
};

export const HomeProductCard = ({ product, showDealBadge = true }: HomeProductCardProps) => {
  return (
    <Card className="flex h-full w-[240px] shrink-0 snap-start flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md md:w-auto">
      <div className="relative aspect-4/3 overflow-hidden bg-zinc-100">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-300">
            <Box size={32} variant="Bold" />
          </div>
        )}
        {showDealBadge ? (
          <Badge className="absolute top-2 left-2" variant="warning">
            Deal
          </Badge>
        ) : null}
        {!product.inStock ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <Badge variant="warning">Out of Stock</Badge>
          </div>
        ) : null}
      </div>
      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        <Typography variant="heading-sm" className="line-clamp-1">
          {product.name}
        </Typography>
        {product.description ? (
          <Typography variant="body-xs" color="secondary" className="line-clamp-2">
            {product.description}
          </Typography>
        ) : null}
        <Typography variant="body-sm" className="text-brand-main font-medium">
          From {formatCurrency(product.minPrice)}
        </Typography>
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <Link href="/shop">
            <Button variant="link" size="sm">
              View details
            </Button>
          </Link>
          <Link href="/shop">
            <Button variant="primary" size="sm" disabled={!product.inStock}>
              Add to cart
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
