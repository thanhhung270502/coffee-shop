"use client";

import { useMemo, useState } from "react";
import type { PublicProductObject } from "@common/models/catalog";
import { Box } from "iconsax-reactjs";

import {
  Badge,
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Typography,
} from "@/shared/components";
import { formatCurrency } from "@/shared/utils/currency.util";

import { useProductCart } from "../hooks/use-product-cart";

type ProductDetailSheetProps = {
  product: PublicProductObject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProductDetailSheet({ product, open, onOpenChange }: ProductDetailSheetProps) {
  const { addItem } = useProductCart();
  const [skuId, setSkuId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const selectedSku = product?.skus.find((s) => s.id === skuId) ?? product?.skus[0];
  const effectiveSkuId = selectedSku?.id ?? "";

  const unitPrice = selectedSku?.price ?? 0;
  const canAdd = Boolean(selectedSku && selectedSku.stock >= quantity);

  const totalPrice = useMemo(() => unitPrice * quantity, [unitPrice, quantity]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen && product) {
      const firstInStock = product.skus.find((s) => s.stock > 0) ?? product.skus[0];
      setSkuId(firstInStock?.id ?? "");
      setQuantity(1);
    }
    onOpenChange(nextOpen);
  };

  const handleAddToCart = () => {
    if (!product || !selectedSku || !canAdd) return;

    addItem({
      productId: product.id,
      productName: product.name,
      skuId: effectiveSkuId,
      skuLabel: selectedSku.label,
      unitPrice: selectedSku.price,
      quantity,
    });

    onOpenChange(false);
  };

  if (!product) return null;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto" showCloseButton>
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image} alt={product.name} className="h-40 w-full object-cover" />
        ) : (
          <div className="flex h-24 items-center justify-center bg-zinc-100 text-zinc-300">
            <Box size={36} variant="Bold" />
          </div>
        )}
        <SheetHeader>
          <SheetTitle>{product.name}</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-6">
          {product.description ? (
            <Typography variant="body-sm" color="secondary">
              {product.description}
            </Typography>
          ) : null}

          <div className="space-y-2">
            <Typography variant="heading-sm">Select size</Typography>
            <div className="flex flex-wrap gap-2">
              {product.skus.map((sku) => (
                <Button
                  key={sku.id}
                  type="button"
                  variant={effectiveSkuId === sku.id ? "primary" : "secondary-gray"}
                  size="sm"
                  disabled={sku.stock === 0}
                  onClick={() => setSkuId(sku.id)}
                >
                  {sku.label} - {formatCurrency(sku.price)}
                  {sku.stock === 0 ? " (Out of Stock)" : ""}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Typography variant="heading-sm">Quantity</Typography>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="secondary-gray"
                size="sm"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                -
              </Button>
              <Typography variant="body-md">{quantity}</Typography>
              <Button
                type="button"
                variant="secondary-gray"
                size="sm"
                onClick={() => setQuantity((q) => q + 1)}
                disabled={!selectedSku || quantity >= selectedSku.stock}
              >
                +
              </Button>
              {selectedSku ? (
                <Typography variant="body-sm" color="secondary">
                  {selectedSku.stock} in stock
                </Typography>
              ) : null}
            </div>
          </div>

          {!product.inStock ? <Badge variant="warning">Out of Stock</Badge> : null}

          <div className="flex items-center justify-between border-t border-zinc-200 pt-4">
            <Typography variant="heading-sm">{formatCurrency(totalPrice)}</Typography>
            <Button type="button" variant="primary" onClick={handleAddToCart} disabled={!canAdd}>
              Add to Cart
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
