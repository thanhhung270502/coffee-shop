"use client";

import { useState } from "react";
import type { EOrderStatus, OrderObject } from "@common/models/order";
import { EOrderChannel } from "@common/models/order";
import { toast } from "sonner";

import { Badge, Skeleton, Typography } from "@/shared/components";
import { Button } from "@/shared/components/button";
import { usePosOrderStatusMutation } from "@/shared/mutations/use-pos-order-status-mutation";
import { useQueryPosQueue } from "@/shared/queries/use-query-pos-queue";

import { PosQueueCard } from "../components/pos-queue-card";

type QueueTab = "all" | "pos" | "online";

const TABS: { id: QueueTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pos", label: "Counter" },
  { id: "online", label: "Online" },
];

function filterOrders(orders: OrderObject[], tab: QueueTab): OrderObject[] {
  if (tab === "pos") return orders.filter((o) => o.channel === EOrderChannel.POS);
  if (tab === "online") return orders.filter((o) => o.channel === EOrderChannel.ONLINE);
  return orders;
}

export function PosQueuePage() {
  const [activeTab, setActiveTab] = useState<QueueTab>("all");
  const { data, isLoading } = useQueryPosQueue();
  const { mutate: updateStatus, isPending } = usePosOrderStatusMutation();

  const allOrders = data?.orders ?? [];
  const displayed = filterOrders(allOrders, activeTab);

  const handleUpdateStatus = (id: string, status: EOrderStatus) => {
    updateStatus(
      { id, data: { status } },
      {
        onError: () => toast.error("Failed to update order status"),
      },
    );
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 bg-white px-4 py-3">
        <Typography variant="heading-sm" className="mr-2">
          Kitchen Queue
        </Typography>
        {TABS.map((tab) => {
          const count =
            tab.id === "all"
              ? allOrders.length
              : filterOrders(allOrders, tab.id).length;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "primary" : "secondary-gray"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="gap-1.5"
            >
              {tab.label}
              {count > 0 ? (
                <Badge className={activeTab === tab.id ? "bg-white/20 text-white" : ""}>
                  {count}
                </Badge>
              ) : null}
            </Button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2">
            <Typography variant="body-lg" color="secondary">
              No orders in queue
            </Typography>
            <Typography variant="body-sm" color="secondary">
              New orders will appear here automatically
            </Typography>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayed.map((order) => (
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
