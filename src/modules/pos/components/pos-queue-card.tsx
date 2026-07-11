"use client";

import type { OrderObject } from "@common/models/order";
import { EOrderChannel, EOrderStatus } from "@common/models/order";

import { Badge } from "@/shared/components/badge";
import { Button } from "@/shared/components/button";
import { Typography } from "@/shared/components/typography";
import { formatCurrency } from "@/shared/utils/currency.util";

type PosQueueCardProps = {
  order: OrderObject;
  onUpdateStatus: (id: string, status: EOrderStatus) => void;
  isUpdating?: boolean;
};

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "default" | "warning" | "success" | "danger" }
> = {
  [EOrderStatus.PENDING]: { label: "Pending", variant: "warning" },
  [EOrderStatus.PREPARING]: { label: "Preparing", variant: "default" },
  [EOrderStatus.READY]: { label: "Ready", variant: "success" },
};

function getAge(createdAt: string): string {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "Just now";
  if (mins === 1) return "1 min ago";
  return `${mins} mins ago`;
}

export function PosQueueCard({ order, onUpdateStatus, isUpdating }: PosQueueCardProps) {
  const statusConfig = STATUS_CONFIG[order.status] ?? { label: order.status, variant: "default" as const };
  const isOnline = order.channel === EOrderChannel.ONLINE;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Typography variant="heading-sm">{order.orderNumber}</Typography>
          {isOnline && (
            <Badge variant="default" className="bg-blue-100 text-blue-700">
              Online
            </Badge>
          )}
          <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
        </div>
        <Typography variant="body-xs" color="secondary">
          {getAge(order.createdAt)}
        </Typography>
      </div>

      {/* Customer */}
      {(order.customerName || order.customerPhone) && (
        <div className="mb-2">
          <Typography variant="body-sm" color="secondary">
            {[order.customerName, order.customerPhone].filter(Boolean).join(" · ")}
          </Typography>
          {order.fulfillment && (
            <Typography variant="body-xs" color="secondary">
              {order.fulfillment === "DELIVERY" ? `Delivery → ${order.deliveryAddress ?? ""}` : "Pickup"}
            </Typography>
          )}
        </div>
      )}

      {/* Items */}
      <div className="mb-3 space-y-1">
        {order.items.map((item) => (
          <div key={item.id} className="text-sm">
            <span className="font-medium">×{item.quantity} </span>
            <span>{item.productName}</span>
            {item.variantName && (
              <span className="text-zinc-500"> ({item.variantName})</span>
            )}
            {item.toppings.length > 0 && (
              <span className="text-zinc-500">
                {" "}
                + {item.toppings.map((t) => t.name).join(", ")}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Note */}
      {order.note && (
        <Typography variant="body-xs" color="secondary" className="mb-3 italic">
          Note: {order.note}
        </Typography>
      )}

      {/* Total + Action */}
      <div className="flex items-center justify-between gap-2">
        <Typography variant="body-sm" className="font-semibold">
          {formatCurrency(order.total)}
        </Typography>
        <div className="flex gap-2">
          {order.status === EOrderStatus.PENDING && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onUpdateStatus(order.id, EOrderStatus.PREPARING)}
              disabled={isUpdating}
            >
              Start
            </Button>
          )}
          {order.status === EOrderStatus.PREPARING && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onUpdateStatus(order.id, EOrderStatus.READY)}
              disabled={isUpdating}
            >
              Done
            </Button>
          )}
          {order.status === EOrderStatus.READY && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onUpdateStatus(order.id, EOrderStatus.COMPLETED)}
              disabled={isUpdating}
            >
              Complete
            </Button>
          )}
          {order.status !== EOrderStatus.COMPLETED && (
            <Button
              variant="secondary-gray"
              size="sm"
              onClick={() => onUpdateStatus(order.id, EOrderStatus.CANCELLED)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
