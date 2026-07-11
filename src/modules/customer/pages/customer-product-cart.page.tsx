"use client";

import Link from "next/link";

import { Button, Card, CardContent, Typography } from "@/shared/components";
import { useQueryShopSettings } from "@/shared/queries";
import { formatCurrency } from "@/shared/utils/currency.util";

import { useProductCart } from "../hooks/use-product-cart";

export function CustomerProductCartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useProductCart();
  const { data: settingsData } = useQueryShopSettings();
  const shippingFee = settingsData?.settings.baseShipping ?? 0;
  const total = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="space-y-4 text-center">
        <Typography variant="heading-md">Product Cart</Typography>
        <Typography variant="body-md" color="secondary">
          Your product cart is empty.
        </Typography>
        <Link href="/shop">
          <Button variant="primary">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Typography variant="heading-md">Product Cart</Typography>

      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Typography variant="heading-sm">{item.productName}</Typography>
                  <Typography variant="body-sm" color="secondary">
                    {item.skuLabel}
                  </Typography>
                </div>
                <Typography variant="body-md">{formatCurrency(item.unitPrice)}</Typography>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary-gray"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </Button>
                  <Typography variant="body-md">{item.quantity}</Typography>
                  <Button
                    type="button"
                    variant="secondary-gray"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="link-gray"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <Typography variant="body-md">Subtotal</Typography>
            <Typography variant="body-md">{formatCurrency(subtotal)}</Typography>
          </div>
          <div className="flex justify-between">
            <Typography variant="body-md">Shipping</Typography>
            <Typography variant="body-md">{formatCurrency(shippingFee)}</Typography>
          </div>
          <div className="flex justify-between border-t border-zinc-200 pt-2">
            <Typography variant="heading-sm">Total</Typography>
            <Typography variant="heading-sm">{formatCurrency(total)}</Typography>
          </div>
          <Link href="/checkout/products" className="block pt-2">
            <Button variant="primary" className="w-full">
              Checkout
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
