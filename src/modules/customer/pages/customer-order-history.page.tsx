"use client";

import { EOrderStatus } from "@common/models/order";
import Link from "next/link";

import { Badge, Button, Card, CardContent, Skeleton, Typography } from "@/shared/components";
import { useQueryCustomerOrders, useQueryMe } from "@/shared/queries";
import { formatCurrency } from "@/shared/utils/currency.util";

const STATUS_LABELS: Record<EOrderStatus, string> = {
  [EOrderStatus.PENDING]: "Pending",
  [EOrderStatus.CONFIRMED]: "Confirmed",
  [EOrderStatus.PREPARING]: "Preparing",
  [EOrderStatus.READY]: "Ready for Pickup",
  [EOrderStatus.COMPLETED]: "Completed",
  [EOrderStatus.CANCELLED]: "Cancelled",
};

function getStatusVariant(status: EOrderStatus): "default" | "success" | "warning" | "danger" {
  switch (status) {
    case EOrderStatus.PENDING:
      return "warning";
    case EOrderStatus.CONFIRMED:
    case EOrderStatus.PREPARING:
      return "default";
    case EOrderStatus.READY:
    case EOrderStatus.COMPLETED:
      return "success";
    case EOrderStatus.CANCELLED:
      return "danger";
    default:
      return "default";
  }
}

export function CustomerOrderHistoryPage() {
  const { data: meData, isLoading: meLoading } = useQueryMe();
  const { data, isLoading } = useQueryCustomerOrders(Boolean(meData?.user));

  if (meLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-8 w-36 rounded-lg" />
        <Skeleton className="h-28 w-full rounded-lg" />
        <Skeleton className="h-28 w-full rounded-lg" />
      </div>
    );
  }

  if (!meData?.user) {
    return (
      <div className="mx-auto max-w-md space-y-4 text-center">
        <Typography variant="heading-md">Order History</Typography>
        <Typography variant="body-md" color="secondary">
          Sign in to view your order history.
        </Typography>
        <Link href="/auth">
          <Button variant="primary">Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Typography variant="heading-md">Order History</Typography>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-28 w-full rounded-lg" />
          <Skeleton className="h-28 w-full rounded-lg" />
          <Skeleton className="h-28 w-full rounded-lg" />
        </div>
      ) : data?.orders.length === 0 ? (
        <div className="space-y-2 text-center">
          <Typography variant="body-md" color="secondary">
            No orders yet.
          </Typography>
          <Link href="/order">
            <Button variant="secondary-gray" size="sm">
              Start ordering
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {data?.orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <Typography variant="heading-sm">{order.orderNumber}</Typography>
                  <Badge variant={getStatusVariant(order.status)}>
                    {STATUS_LABELS[order.status]}
                  </Badge>
                </div>
                <Typography variant="body-sm" color="secondary">
                  {new Date(order.createdAt).toLocaleString()} · {order.items.length} item
                  {order.items.length !== 1 ? "s" : ""}
                </Typography>
                <div className="flex items-center justify-between">
                  <Typography variant="body-md">{formatCurrency(order.total)}</Typography>
                  <Link
                    href={`/orders/${order.id}?phone=${encodeURIComponent(order.customerPhone ?? "")}`}
                  >
                    <Button variant="link-gray" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
