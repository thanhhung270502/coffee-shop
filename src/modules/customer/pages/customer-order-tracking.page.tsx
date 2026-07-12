"use client";

import { useEffect, useState } from "react";
import { EFulfillmentType, EPaymentMethod, EPaymentStatus } from "@common/models/order";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Badge, Button, Card, CardContent, Skeleton, Typography } from "@/shared/components";
import { useInitiateMoMoPaymentMutation } from "@/shared/mutations";
import { useQueryPublicOrder } from "@/shared/queries";
import { formatCurrency } from "@/shared/utils/currency.util";

import { OrderStatusTimeline } from "../components/order-status-timeline";

type CustomerOrderTrackingPageProps = {
  orderId: string;
};

const FULFILLMENT_LABELS: Record<EFulfillmentType, string> = {
  [EFulfillmentType.DELIVERY]: "Delivery",
  [EFulfillmentType.PICKUP]: "Pickup",
};

const PAYMENT_LABELS: Record<EPaymentMethod, string> = {
  [EPaymentMethod.COD]: "Cash on Delivery",
  [EPaymentMethod.BANK_TRANSFER]: "Bank Transfer",
  [EPaymentMethod.CASH]: "Cash",
  [EPaymentMethod.VNPAY]: "VNPay",
  [EPaymentMethod.MOMO]: "MoMo",
};

function useLastUpdated(dataUpdatedAt: number) {
  const [secondsAgo, setSecondsAgo] = useState(0);

  useEffect(() => {
    const update = () => {
      setSecondsAgo(Math.floor((Date.now() - dataUpdatedAt) / 1000));
    };
    update();
    const interval = setInterval(update, 5000);
    return () => clearInterval(interval);
  }, [dataUpdatedAt]);

  if (secondsAgo < 10) return "just now";
  if (secondsAgo < 60) return `${secondsAgo}s ago`;
  return `${Math.floor(secondsAgo / 60)}m ago`;
}

export function CustomerOrderTrackingPage({ orderId }: CustomerOrderTrackingPageProps) {
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") ?? "";
  const initiateMoMoPayment = useInitiateMoMoPaymentMutation();

  const handleMoMoPay = async () => {
    try {
      const result = await initiateMoMoPayment.mutateAsync(orderId);
      window.location.assign(result.payUrl);
    } catch {
      toast.error("Failed to initiate MoMo payment. Please try again.");
    }
  };

  const { data, isLoading, error, dataUpdatedAt } = useQueryPublicOrder(orderId, phone);
  const lastUpdated = useLastUpdated(dataUpdatedAt);

  if (!phone) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 text-center">
        <Typography variant="heading-md">Order Tracking</Typography>
        <Typography variant="body-md" color="secondary">
          Phone number is required to view this order.
        </Typography>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    );
  }

  if (error || !data?.order) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 text-center">
        <Typography variant="heading-md">Order Not Found</Typography>
        <Typography variant="body-md" color="secondary">
          Order not found. Please check your order ID and phone number.
        </Typography>
      </div>
    );
  }

  const { order } = data;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Typography variant="heading-md">Order {order.orderNumber}</Typography>
          <Typography variant="body-sm" color="secondary">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </Typography>
        </div>
        <div className="text-right">
          <Badge variant="default" className="text-xs">
            Live
          </Badge>
          <Typography variant="body-xs" color="secondary" className="mt-1">
            Updated {lastUpdated}
          </Typography>
        </div>
      </div>

      <Card>
        <CardContent>
          <OrderStatusTimeline status={order.status} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3">
          <Typography variant="heading-sm">Order Info</Typography>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {order.fulfillment ? (
              <>
                <Typography variant="body-sm" color="secondary">
                  Fulfillment
                </Typography>
                <Typography variant="body-sm">{FULFILLMENT_LABELS[order.fulfillment]}</Typography>
              </>
            ) : null}
            <Typography variant="body-sm" color="secondary">
              Payment
            </Typography>
            <Typography variant="body-sm">
              {order.paymentMethod ? PAYMENT_LABELS[order.paymentMethod] : "—"}
            </Typography>
            {order.deliveryAddress ? (
              <>
                <Typography variant="body-sm" color="secondary">
                  Delivery Address
                </Typography>
                <Typography variant="body-sm">{order.deliveryAddress}</Typography>
              </>
            ) : null}
            {order.shippingAddress ? (
              <>
                <Typography variant="body-sm" color="secondary">
                  Shipping Address
                </Typography>
                <Typography variant="body-sm">{order.shippingAddress}</Typography>
              </>
            ) : null}
            {order.note ? (
              <>
                <Typography variant="body-sm" color="secondary">
                  Note
                </Typography>
                <Typography variant="body-sm">{order.note}</Typography>
              </>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <Typography variant="heading-sm">Order Details</Typography>
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between gap-4 border-b border-zinc-100 pb-3">
              <div>
                <Typography variant="body-md">
                  {item.quantity}× {item.productName}
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
              <Typography variant="body-md" className="shrink-0">
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

      {order.paymentMethod === EPaymentMethod.MOMO &&
      order.paymentStatus === EPaymentStatus.PENDING ? (
        <Card>
          <CardContent className="space-y-3">
            <Typography variant="heading-sm">Complete Your Payment</Typography>
            <Typography variant="body-sm" color="secondary">
              Your order is awaiting MoMo payment. Click below to pay now.
            </Typography>
            <Button
              variant="primary"
              className="w-full"
              loading={initiateMoMoPayment.isPending}
              onClick={handleMoMoPay}
            >
              Pay with MoMo
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
