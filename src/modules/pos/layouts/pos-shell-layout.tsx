"use client";

import { Provider } from "jotai";
import { Toaster } from "sonner";

import { PosHeader } from "../components/pos-header";
import { PosShellProvider, usePosShell } from "../hooks/use-pos-shell";
import { PosOnlineOrdersPage } from "../pages/pos-online-orders.page";
import { PosQueuePage } from "../pages/pos-queue.page";
import { PosSellPage } from "../pages/pos-sell.page";

function PosShellContent() {
  const { activeTab } = usePosShell();

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-neutral-50">
      <PosHeader />
      <main className="flex min-h-0 flex-1 overflow-hidden">
        {activeTab === "sell" && <PosSellPage />}
        {activeTab === "queue" && <PosQueuePage />}
        {activeTab === "online" && <PosOnlineOrdersPage />}
      </main>
    </div>
  );
}

export function PosShellLayout() {
  return (
    <Provider>
      <PosShellProvider>
        <PosShellContent />
      </PosShellProvider>
      <Toaster position="top-center" richColors closeButton />
    </Provider>
  );
}
