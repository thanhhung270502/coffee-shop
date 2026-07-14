"use client";

import { EOrderChannel } from "@common/models/order";
import {
  ArrowRotateLeft,
  Maximize1,
  Maximize4,
  Printer,
} from "iconsax-reactjs";
import { useRouter } from "next/navigation";

import { Badge, Button, Typography } from "@/shared/components";
import { useQueryPosQueue } from "@/shared/queries/use-query-pos-queue";
import { cn } from "@/shared/utils/cn.util";

import { POS_TABS, type PosTab } from "../constants";
import { usePosShell } from "../hooks/use-pos-shell";

export function PosHeaderToolbar() {
  const router = useRouter();
  const { activeTab, setActiveTab, isFullscreen, toggleFullscreen, refreshData, lastOrderId } =
    usePosShell();
  const { data: queueData } = useQueryPosQueue();

  const allOrders = queueData?.orders ?? [];
  const queueCount = allOrders.length;
  const onlineCount = allOrders.filter((o) => o.channel === EOrderChannel.ONLINE).length;

  const getTabCount = (tabId: PosTab): number => {
    if (tabId === "queue") return queueCount;
    if (tabId === "online") return onlineCount;
    return 0;
  };

  const handlePrint = () => {
    if (lastOrderId) {
      router.push(`/pos/receipt/${lastOrderId}`);
    }
  };

  return (
    <div className="flex shrink-0 items-center gap-2 border-b border-neutral-200 bg-white px-4 py-2">
      <nav className="flex flex-wrap items-center gap-2" aria-label="POS sections">
        {POS_TABS.map((tab) => {
          const count = getTabCount(tab.id);
          const isActive = activeTab === tab.id;
          return (
            <Button
              key={tab.id}
              variant={isActive ? "primary" : "secondary-gray"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className={cn("gap-1.5", !isActive && "text-secondary")}
            >
              {tab.label}
              {count > 0 ? (
                <Badge className={cn(isActive ? "bg-white/20 text-white" : "")}>{count}</Badge>
              ) : null}
            </Button>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="tertiary-gray"
          size="sm"
          startIcon={isFullscreen ? Maximize1 : Maximize4}
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        />
        <Button
          variant="tertiary-gray"
          size="sm"
          startIcon={ArrowRotateLeft}
          onClick={refreshData}
          aria-label="Refresh data"
        />
        <Button
          variant="tertiary-gray"
          size="sm"
          startIcon={Printer}
          onClick={handlePrint}
          disabled={!lastOrderId}
          aria-label="Print last receipt"
        />
        <Typography variant="body-xs" color="secondary" className="hidden pl-2 md:block">
          Auto-refresh queue 12s
        </Typography>
      </div>
    </div>
  );
}
