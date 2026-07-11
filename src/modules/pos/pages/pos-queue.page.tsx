"use client";

import { useState } from "react";
import type { EOrderStatus, OrderObject } from "@common/models/order";
import { EOrderChannel } from "@common/models/order";
import { toast } from "sonner";

import { Badge } from "@/shared/components/badge";
import { Skeleton } from "@/shared/components/skeleton";
import { Typography } from "@/shared/components/typography";
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
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center gap-2 border-b border-zinc-200 bg-white px-4 py-2">
        {TABS.map((tab) => {
          const count =
            tab.id === "all"
              ? allOrders.length
              : filterOrders(allOrders, tab.id).length;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-amber-600 text-white"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              {tab.label}
              {count > 0 && (
                <Badge className={activeTab === tab.id ? "bg-white/20 text-white" : ""}>
                  {count}
                </Badge>
              )}
            </button>
          );
        })}
        <div className="ml-auto">
          <Typography variant="body-xs" color="secondary">
            Auto-refreshing every 12s
          </Typography>
        </div>
      </div>

      {/* Queue */}
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
