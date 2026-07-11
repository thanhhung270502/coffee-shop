"use client";

import { useState } from "react";
import { Provider } from "jotai";
import { Toaster } from "sonner";

import { PosHeader } from "../components/pos-header";
import { PosOnlineOrdersPage } from "../pages/pos-online-orders.page";
import { PosQueuePage } from "../pages/pos-queue.page";
import { PosSellPage } from "../pages/pos-sell.page";

type PosTab = "sell" | "queue" | "online";

export function PosShellLayout() {
  const [activeTab, setActiveTab] = useState<PosTab>("sell");

  return (
    <Provider>
      <div className="flex h-screen flex-col overflow-hidden bg-zinc-50">
        <PosHeader
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as PosTab)}
        />
        <main className="flex flex-1 overflow-hidden">
          {activeTab === "sell" && <PosSellPage />}
          {activeTab === "queue" && <PosQueuePage />}
          {activeTab === "online" && <PosOnlineOrdersPage />}
        </main>
      </div>
      <Toaster position="top-center" richColors closeButton />
    </Provider>
  );
}
