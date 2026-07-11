"use client";

import { EPaymentMethod } from "@common/models/order";
import Link from "next/link";

import {
  Button,
  Card,
  CardContent,
  RHFInput,
  RHFTextarea,
  Typography,
} from "@/shared/components";
import { FormProvider } from "@/shared/providers";
import { useQueryShopSettings } from "@/shared/queries";
import { formatCurrency } from "@/shared/utils/currency.util";

import { useProductCheckout } from "../hooks/use-product-checkout";

export function CustomerProductCheckoutPage() {
  const { methods, onSubmit, isSubmitting, items } = useProductCheckout();
  const { data: settingsData } = useQueryShopSettings();

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shippingFee = settingsData?.settings.baseShipping ?? 0;
  const total = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="space-y-4 text-center">
        <Typography variant="heading-md">Checkout</Typography>
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
      <Typography variant="heading-md">Product Checkout</Typography>

      <FormProvider formMethods={methods} onSubmit={onSubmit} className="space-y-6">
        <Card>
          <CardContent className="space-y-4">
            <RHFInput name="customerName" control={methods.control} label="Name" required />
            <RHFInput name="customerPhone" control={methods.control} label="Phone" required />
            <RHFInput
              name="shippingAddress"
              control={methods.control}
              label="Shipping Address"
              required
            />
            <RHFTextarea name="note" control={methods.control} label="Order Note" rows={3} />

            <div className="space-y-2">
              <Typography variant="heading-sm">Payment Method</Typography>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={
                    methods.watch("paymentMethod") === EPaymentMethod.COD
                      ? "primary"
                      : "secondary-gray"
                  }
                  size="sm"
                  onClick={() => methods.setValue("paymentMethod", EPaymentMethod.COD)}
                >
                  Cash on Delivery
                </Button>
                <Button
                  type="button"
                  variant={
                    methods.watch("paymentMethod") === EPaymentMethod.BANK_TRANSFER
                      ? "primary"
                      : "secondary-gray"
                  }
                  size="sm"
                  onClick={() =>
                    methods.setValue("paymentMethod", EPaymentMethod.BANK_TRANSFER)
                  }
                >
                  Bank Transfer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

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
            <Button type="submit" variant="primary" className="w-full" loading={isSubmitting}>
              Place Order
            </Button>
          </CardContent>
        </Card>
      </FormProvider>
    </div>
  );
}
