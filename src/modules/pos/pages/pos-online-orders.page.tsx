"use client";

import type { EOrderStatus } from "@common/models/order";
import { EOrderChannel } from "@common/models/order";
import { toast } from "sonner";

import { Skeleton } from "@/shared/components/skeleton";
import { Typography } from "@/shared/components/typography";
import { usePosOrderStatusMutation } from "@/shared/mutations/use-pos-order-status-mutation";
import { useQueryPosQueue } from "@/shared/queries/use-query-pos-queue";

import { PosQueueCard } from "../components/pos-queue-card";

export function PosOnlineOrdersPage() {
  const { data, isLoading } = useQueryPosQueue();
  const { mutate: updateStatus, isPending } = usePosOrderStatusMutation();

  const onlineOrders = (data?.orders ?? []).filter(
    (o) => o.channel === EOrderChannel.ONLINE,
  );

  const handleUpdateStatus = (id: string, status: EOrderStatus) => {
    updateStatus(
      { id, data: { status } },
      {
        onError: () => toast.error("Failed to update order status"),
      },
    );
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3">
        <Typography variant="heading-sm">Online Orders</Typography>
        <Typography variant="body-xs" color="secondary">
          Auto-refreshing every 12s
        </Typography>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : onlineOrders.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2">
            <Typography variant="body-lg" color="secondary">
              No online orders
            </Typography>
            <Typography variant="body-sm" color="secondary">
              Online orders from customers will appear here
            </Typography>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {onlineOrders.map((order) => (
              <PosQueueCard
                key={order.id}
                order={order}
                onUpdateStatus={handleUpdateStatus}
                isUpdating={isPending}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
