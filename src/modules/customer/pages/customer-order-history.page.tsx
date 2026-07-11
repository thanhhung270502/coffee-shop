"use client";

import Link from "next/link";

import { Badge, Button, Card, CardContent, Skeleton, Typography } from "@/shared/components";
import { useQueryCustomerOrders, useQueryMe } from "@/shared/queries";
import { formatCurrency } from "@/shared/utils/currency.util";

export function CustomerOrderHistoryPage() {
  const { data: meData, isLoading: meLoading } = useQueryMe();
  const { data, isLoading } = useQueryCustomerOrders(Boolean(meData?.user));

  if (meLoading) {
    return <Skeleton className="h-32 w-full rounded-lg" />;
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
        <Skeleton className="h-32 w-full rounded-lg" />
      ) : data?.orders.length === 0 ? (
        <Typography variant="body-md" color="secondary">
          No orders yet.
        </Typography>
      ) : (
        <div className="space-y-4">
          {data?.orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <Typography variant="heading-sm">{order.orderNumber}</Typography>
                  <Badge>{order.status}</Badge>
                </div>
                <Typography variant="body-sm" color="secondary">
                  {new Date(order.createdAt).toLocaleString()} · {order.items.length} item(s)
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
