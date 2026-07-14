"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";

import { POS_CATALOG_QUERY_KEY } from "@/shared/queries/use-query-pos-catalog";
import { POS_QUEUE_QUERY_KEY } from "@/shared/queries/use-query-pos-queue";

import type { PosTab } from "../constants";

type PosShellContextValue = {
  activeTab: PosTab;
  setActiveTab: (tab: PosTab) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  refreshData: () => void;
  lastOrderId: string | null;
  setLastOrderId: (id: string | null) => void;
  sessionDraftId: string;
};

const PosShellContext = createContext<PosShellContextValue | null>(null);

function createSessionDraftId(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

type PosShellProviderProps = {
  children: ReactNode;
};

export function PosShellProvider({ children }: PosShellProviderProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<PosTab>("sell");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const [sessionDraftId] = useState(createSessionDraftId);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      void document.documentElement.requestFullscreen().then(() => setIsFullscreen(true));
      return;
    }
    void document.exitFullscreen().then(() => setIsFullscreen(false));
  }, []);

  const refreshData = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: POS_CATALOG_QUERY_KEY });
    void queryClient.invalidateQueries({ queryKey: POS_QUEUE_QUERY_KEY });
  }, [queryClient]);

  const value = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      isFullscreen,
      toggleFullscreen,
      refreshData,
      lastOrderId,
      setLastOrderId,
      sessionDraftId,
    }),
    [
      activeTab,
      isFullscreen,
      toggleFullscreen,
      refreshData,
      lastOrderId,
      sessionDraftId,
    ],
  );

  return <PosShellContext.Provider value={value}>{children}</PosShellContext.Provider>;
}

export function usePosShell(): PosShellContextValue {
  const context = useContext(PosShellContext);
  if (!context) {
    throw new Error("usePosShell must be used within PosShellProvider");
  }
  return context;
}
