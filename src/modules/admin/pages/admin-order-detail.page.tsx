"use client";

import type { EOrderStatus } from "@common/models/order";
import { EOrderStatus as OrderStatusEnum } from "@common/models/order";
import { ArrowLeft } from "iconsax-reactjs";
import Link from "next/link";

import { AdminPageHeader } from "@/modules/admin/components/admin-page-header";
import { Badge } from "@/shared/components/badge";
import { Button } from "@/shared/components/button";
import { Typography } from "@/shared/components/typography";
import { useUpdateOrderStatusMutation } from "@/shared/mutations/use-admin-order-mutations";
import { useQueryAdminOrderDetail } from "@/shared/queries/use-query-admin-order-detail";
import { formatCurrency } from "@/shared/utils/currency.util";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  READY: "Ready",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const NEXT_STATUSES: Record<string, EOrderStatus[]> = {
  PENDING: [OrderStatusEnum.CONFIRMED, OrderStatusEnum.PREPARING, OrderStatusEnum.CANCELLED],
  CONFIRMED: [OrderStatusEnum.PREPARING, OrderStatusEnum.CANCELLED],
  PREPARING: [OrderStatusEnum.READY, OrderStatusEnum.CANCELLED],
  READY: [OrderStatusEnum.COMPLETED, OrderStatusEnum.CANCELLED],
};

type AdminOrderDetailPageProps = {
  orderId: string;
};

export function AdminOrderDetailPage({ orderId }: AdminOrderDetailPageProps) {
  const { data, isLoading } = useQueryAdminOrderDetail(orderId);
  const updateMutation = useUpdateOrderStatusMutation();
  const order = data?.order;

  if (isLoading) {
    return <Typography variant="body-md">Loading...</Typography>;
  }

  if (!order) {
    return <Typography variant="body-md">Order not found</Typography>;
  }

  const nextStatuses = NEXT_STATUSES[order.status] ?? [];

  return (
    <div>
      <Link href="/admin/orders" className="mb-4 inline-flex items-center gap-1 text-sm text-brand-tertiary">
        <ArrowLeft size={16} />
        Back to orders
      </Link>

      <AdminPageHeader
        title={`Order ${order.orderNumber}`}
        description={`${order.customerName ?? "Guest"} — ${order.customerPhone ?? ""}`}
        action={
          <div className="flex gap-2">
            {nextStatuses.map((status) => (
              <Button
                key={status}
                variant={status === "CANCELLED" ? "destructive-secondary" : "primary"}
                size="sm"
                onClick={() => updateMutation.mutate({ id: order.id, data: { status } })}
                disabled={updateMutation.isPending}
              >
                {STATUS_LABELS[status]}
              </Button>
            ))}
          </div>
        }
      />

      <div className="mb-4 flex gap-2">
        <Badge variant="default">{STATUS_LABELS[order.status]}</Badge>
        <Badge variant="default">{order.type === "DRINK_ORDER" ? "Drink" : "Product"}</Badge>
        <Badge variant="default">{order.channel}</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-primary bg-white p-4">
          <Typography variant="heading-sm" weight="semibold" className="mb-3">
            Order Items
          </Typography>
          {order.items.map((item) => (
            <div key={item.id} className="mb-3 border-b border-primary pb-3 last:border-0">
              <Typography variant="body-md" weight="medium">
                {item.productName} x{item.quantity}
              </Typography>
              <Typography variant="body-sm" color="secondary">
                {formatCurrency(item.unitPrice)} / item
              </Typography>
              {item.toppings.length > 0 && (
                <Typography variant="body-xs" color="tertiary">
                  Topping: {item.toppings.map((t) => t.name).join(", ")}
                </Typography>
              )}
              {item.note && (
                <Typography variant="body-xs" color="tertiary">
                  Note: {item.note}
                </Typography>
              )}
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-primary bg-white p-4">
          <Typography variant="heading-sm" weight="semibold" className="mb-3">
            Delivery Info
          </Typography>
          <Typography variant="body-sm">Fulfillment: {order.fulfillment ?? "—"}</Typography>
          <Typography variant="body-sm">Address: {order.deliveryAddress ?? order.shippingAddress ?? "—"}</Typography>
          <Typography variant="body-sm">Note: {order.note ?? "—"}</Typography>
          <div className="mt-4 border-t border-primary pt-4">
            <Typography variant="body-sm">Subtotal: {formatCurrency(order.subtotal)}</Typography>
            <Typography variant="body-sm">Shipping: {formatCurrency(order.shippingFee)}</Typography>
            <Typography variant="body-md" weight="semibold" className="mt-2">
              Total: {formatCurrency(order.total)}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
