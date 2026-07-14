"use client";

import { Receipt21, Refresh2, ShoppingCart } from "iconsax-reactjs";

import { Button } from "@/shared/components";

import { usePosShell } from "../hooks/use-pos-shell";

type PosSellActionBarProps = {
  onReset: () => void;
  onOpenTransactions: () => void;
};

export function PosSellActionBar({ onReset, onOpenTransactions }: PosSellActionBarProps) {
  const { setActiveTab } = usePosShell();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="primary"
        size="sm"
        startIcon={ShoppingCart}
        onClick={() => setActiveTab("queue")}
      >
        View Orders
      </Button>
      <Button variant="gradient" size="sm" startIcon={Refresh2} onClick={onReset}>
        Reset
      </Button>
      <Button
        variant="secondary-color"
        size="sm"
        startIcon={Receipt21}
        onClick={onOpenTransactions}
      >
        Transaction
      </Button>
    </div>
  );
}
