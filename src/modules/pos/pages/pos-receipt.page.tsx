"use client";

import { Printer } from "iconsax-reactjs";

import { Button } from "@/shared/components/button";
import { Separator } from "@/shared/components/separator";
import { Skeleton } from "@/shared/components/skeleton";
import { Typography } from "@/shared/components/typography";
import { useQueryPosReceipt } from "@/shared/queries/use-query-pos-receipt";
import { formatCurrency } from "@/shared/utils/currency.util";

type PosReceiptPageProps = {
  orderId: string;
};

export function PosReceiptPage({ orderId }: PosReceiptPageProps) {
  const { data, isLoading, isError } = useQueryPosReceipt(orderId);
  const order = data?.order;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-sm space-y-3 p-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Typography variant="body-md" color="secondary">
          Order not found
        </Typography>
      </div>
    );
  }

  const printedAt = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="min-h-screen bg-zinc-100 py-8 print:bg-white print:py-0">
      <div className="mx-auto max-w-xs rounded-xl bg-white p-6 shadow-md print:max-w-none print:rounded-none print:shadow-none">
        {/* Print button — hidden in print */}
        <div className="mb-4 flex justify-end print:hidden">
          <Button
            variant="primary"
            size="sm"
            startIcon={Printer}
            onClick={() => window.print()}
          >
            Print
          </Button>
        </div>

        {/* Shop name */}
        <div className="mb-4 text-center">
          <Typography variant="heading-md" className="font-bold">
            Coffee Shop
          </Typography>
          <Typography variant="body-xs" color="secondary">
            {printedAt}
          </Typography>
        </div>

        <Separator className="my-3" />

        {/* Order info */}
        <div className="mb-3 space-y-1">
          <div className="flex justify-between">
            <Typography variant="body-sm">Order</Typography>
            <Typography variant="body-sm" className="font-bold">
              {order.orderNumber}
            </Typography>
          </div>
          {order.customerName && (
            <div className="flex justify-between">
              <Typography variant="body-sm">Customer</Typography>
              <Typography variant="body-sm">{order.customerName}</Typography>
            </div>
          )}
          <div className="flex justify-between">
            <Typography variant="body-sm">Channel</Typography>
            <Typography variant="body-sm">{order.channel}</Typography>
          </div>
        </div>

        <Separator className="my-3" />

        {/* Items */}
        <div className="mb-3 space-y-2">
          {order.items.map((item) => (
            <div key={item.id}>
              <div className="flex justify-between">
                <Typography variant="body-sm">
                  ×{item.quantity} {item.productName}
                  {item.variantName ? ` (${item.variantName})` : ""}
                </Typography>
                <Typography variant="body-sm">
                  {formatCurrency(item.unitPrice * item.quantity)}
                </Typography>
              </div>
              {item.toppings.length > 0 && (
                <Typography variant="body-xs" color="secondary" className="ml-3">
                  + {item.toppings.map((t) => t.name).join(", ")}
                </Typography>
              )}
              {item.note && (
                <Typography variant="body-xs" color="secondary" className="ml-3 italic">
                  {item.note}
                </Typography>
              )}
            </div>
          ))}
        </div>

        <Separator className="my-3" />

        <div className="space-y-1">
          <div className="flex justify-between">
            <Typography variant="body-sm" color="secondary">
              Subtotal
            </Typography>
            <Typography variant="body-sm">{formatCurrency(order.subtotal)}</Typography>
          </div>
          {order.taxAmount > 0 ? (
            <div className="flex justify-between">
              <Typography variant="body-sm" color="secondary">
                Tax ({order.taxRate}%)
              </Typography>
              <Typography variant="body-sm">{formatCurrency(order.taxAmount)}</Typography>
            </div>
          ) : null}
          {order.shippingFee > 0 ? (
            <div className="flex justify-between">
              <Typography variant="body-sm" color="secondary">
                Shipping
              </Typography>
              <Typography variant="body-sm">{formatCurrency(order.shippingFee)}</Typography>
            </div>
          ) : null}
          {order.discount > 0 ? (
            <div className="flex justify-between">
              <Typography variant="body-sm" color="secondary">
                Discount
              </Typography>
              <Typography variant="body-sm">-{formatCurrency(order.discount)}</Typography>
            </div>
          ) : null}
        </div>

        <Separator className="my-3" />

        {/* Total */}
        <div className="flex justify-between">
          <Typography variant="body-md" className="font-bold">
            Total
          </Typography>
          <Typography variant="body-md" className="font-bold">
            {formatCurrency(order.total)}
          </Typography>
        </div>

        {order.paymentMethod && (
          <div className="mt-1 flex justify-between">
            <Typography variant="body-xs" color="secondary">
              Payment
            </Typography>
            <Typography variant="body-xs" color="secondary">
              {order.paymentMethod === "CASH" ? "Cash" : "Bank Transfer"}
            </Typography>
          </div>
        )}

        <Separator className="my-4" />

        <Typography variant="body-xs" color="secondary" className="text-center">
          Thank you for your order!
        </Typography>
      </div>
    </div>
  );
}
