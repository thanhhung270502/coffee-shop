"use client";

import { useState } from "react";
import { API_ADMIN_EXPORT_ORDERS } from "@common/models/report";

type UseExportOrdersProps = {
  from: string;
  to: string;
};

export const useExportOrders = ({ from, to }: UseExportOrdersProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      const url = `${API_ADMIN_EXPORT_ORDERS.buildUrlPath()}?${params.toString()}`;
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) throw new Error("Export failed");
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `orders-${from}-to-${to}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch {
      // Silent fail — toast added in 4.3
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    handleExport,
  };
};
export type UseExportOrdersReturn = ReturnType<typeof useExportOrders>;
