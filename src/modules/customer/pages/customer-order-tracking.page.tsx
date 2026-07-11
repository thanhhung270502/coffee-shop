"use client";

import { useSearchParams } from "next/navigation";

import { Card, CardContent, Skeleton, Typography } from "@/shared/components";
import { useQueryPublicOrder } from "@/shared/queries";
import { formatCurrency } from "@/shared/utils/currency.util";

import { OrderStatusTimeline } from "../components/order-status-timeline";

type CustomerOrderTrackingPageProps = {
  orderId: string;
};

export function CustomerOrderTrackingPage({ orderId }: CustomerOrderTrackingPageProps) {
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") ?? "";

  const { data, isLoading, error } = useQueryPublicOrder(orderId, phone);

  if (!phone) {
    return (
      <Typography variant="body-md" color="secondary">
        Phone number is required to view this order.
      </Typography>
    );
  }

  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-lg" />;
  }

  if (error || !data?.order) {
    return (
      <Typography variant="body-md" color="secondary">
        Order not found. Please check your order ID and phone number.
      </Typography>
    );
  }

  const { order } = data;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Typography variant="heading-md">Order {order.orderNumber}</Typography>
        <Typography variant="body-sm" color="secondary">
          Placed on {new Date(order.createdAt).toLocaleString()}
        </Typography>
      </div>

      <Card>
        <CardContent>
          <OrderStatusTimeline status={order.status} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <Typography variant="heading-sm">Order Details</Typography>
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between gap-4 border-b border-zinc-100 pb-3">
              <div>
                <Typography variant="body-md">
                  {item.quantity}x {item.productName}
                </Typography>
                {item.variantName ? (
                  <Typography variant="body-sm" color="secondary">
                    Size: {item.variantName}
                  </Typography>
                ) : null}
                {item.skuLabel ? (
                  <Typography variant="body-sm" color="secondary">
                    SKU: {item.skuLabel}
                  </Typography>
                ) : null}
                {item.toppings.length > 0 ? (
                  <Typography variant="body-sm" color="secondary">
                    Toppings: {item.toppings.map((t) => t.name).join(", ")}
                  </Typography>
                ) : null}
              </div>
              <Typography variant="body-md">
                {formatCurrency(item.unitPrice * item.quantity)}
              </Typography>
            </div>
          ))}

          <div className="space-y-1 pt-2">
            <div className="flex justify-between">
              <Typography variant="body-sm" color="secondary">
                Subtotal
              </Typography>
              <Typography variant="body-sm">{formatCurrency(order.subtotal)}</Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="body-sm" color="secondary">
                Shipping
              </Typography>
              <Typography variant="body-sm">{formatCurrency(order.shippingFee)}</Typography>
            </div>
            <div className="flex justify-between border-t border-zinc-200 pt-2">
              <Typography variant="heading-sm">Total</Typography>
              <Typography variant="heading-sm">{formatCurrency(order.total)}</Typography>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
