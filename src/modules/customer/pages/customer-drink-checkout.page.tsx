"use client";

import { EFulfillmentType, EPaymentMethod } from "@common/models/order";
import Link from "next/link";

import { Button, Card, CardContent, RHFInput, RHFTextarea, Typography } from "@/shared/components";
import { FormProvider } from "@/shared/providers";
import { useQueryShopSettings } from "@/shared/queries";
import { formatCurrency } from "@/shared/utils/currency.util";

import { FulfillmentSelector } from "../components/fulfillment-selector";
import { useDrinkCheckout } from "../hooks/use-drink-checkout";

export function CustomerDrinkCheckoutPage() {
  const { methods, onSubmit, isSubmitting, items } = useDrinkCheckout();
  const { data: settingsData } = useQueryShopSettings();

  const fulfillment = methods.watch("fulfillment");
  const paymentMethod = methods.watch("paymentMethod");
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shippingFee =
    fulfillment === EFulfillmentType.DELIVERY ? (settingsData?.settings.baseShipping ?? 0) : 0;
  const total = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="space-y-4 text-center">
        <Typography variant="heading-md">Checkout</Typography>
        <Typography variant="body-md" color="secondary">
          Your drink cart is empty.
        </Typography>
        <Link href="/order">
          <Button variant="primary">Browse Drinks</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Typography variant="heading-md">Drink Checkout</Typography>

      <Card>
        <CardContent className="space-y-3">
          <Typography variant="heading-sm">Order Summary</Typography>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4">
                <div>
                  <Typography variant="body-sm">
                    {item.quantity}× {item.productName} ({item.variantName})
                  </Typography>
                  {item.toppingNames.length > 0 ? (
                    <Typography variant="body-xs" color="secondary">
                      + {item.toppingNames.join(", ")}
                    </Typography>
                  ) : null}
                  <Typography variant="body-xs" color="secondary">
                    Sugar {item.sugar} · Ice {item.ice}
                  </Typography>
                </div>
                <Typography variant="body-sm" className="shrink-0">
                  {formatCurrency(item.unitPrice * item.quantity)}
                </Typography>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <FormProvider formMethods={methods} onSubmit={onSubmit} className="space-y-6">
        <Card>
          <CardContent className="space-y-4">
            <RHFInput name="customerName" control={methods.control} label="Name" required />
            <RHFInput name="customerPhone" control={methods.control} label="Phone" required />

            <FulfillmentSelector
              value={fulfillment}
              onChange={(value) => methods.setValue("fulfillment", value)}
            />

            {fulfillment === EFulfillmentType.DELIVERY ? (
              <RHFInput
                name="deliveryAddress"
                control={methods.control}
                label="Delivery Address"
                required
              />
            ) : null}

            <RHFTextarea name="note" control={methods.control} label="Order Note" rows={2} />

            <div className="space-y-2">
              <Typography variant="heading-sm">Payment Method</Typography>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={paymentMethod === EPaymentMethod.COD ? "primary" : "secondary-gray"}
                  size="sm"
                  onClick={() => methods.setValue("paymentMethod", EPaymentMethod.COD)}
                >
                  Cash on Delivery
                </Button>
                <Button
                  type="button"
                  variant={
                    paymentMethod === EPaymentMethod.BANK_TRANSFER ? "primary" : "secondary-gray"
                  }
                  size="sm"
                  onClick={() => methods.setValue("paymentMethod", EPaymentMethod.BANK_TRANSFER)}
                >
                  Bank Transfer
                </Button>
              </div>
            </div>

            {paymentMethod === EPaymentMethod.BANK_TRANSFER ? (
              <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-4">
                <Typography variant="heading-sm">Bank Transfer Details</Typography>
                <Typography variant="body-sm" color="secondary">
                  After placing your order, please transfer the exact total to the shop&apos;s bank
                  account. Contact us via phone for account details.
                </Typography>
                {settingsData?.settings.phone ? (
                  <Typography variant="body-sm">
                    <span className="font-medium">Shop phone:</span> {settingsData.settings.phone}
                  </Typography>
                ) : null}
                <Typography variant="body-xs" color="secondary">
                  Use your order number as the transfer reference. Your order will be confirmed
                  after payment verification.
                </Typography>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <Typography variant="body-md">Subtotal</Typography>
              <Typography variant="body-md">{formatCurrency(subtotal)}</Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="body-md">
                {fulfillment === EFulfillmentType.DELIVERY ? "Delivery fee" : "Pickup"}
              </Typography>
              <Typography variant="body-md">
                {fulfillment === EFulfillmentType.DELIVERY ? formatCurrency(shippingFee) : "Free"}
              </Typography>
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
