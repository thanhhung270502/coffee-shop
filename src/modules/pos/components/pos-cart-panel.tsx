"use client";

import { useState } from "react";
import { Add, Minus, Trash } from "iconsax-reactjs";

import { Badge } from "@/shared/components/badge";
import { Button } from "@/shared/components/button";
import { Input } from "@/shared/components/input";
import { Separator } from "@/shared/components/separator";
import { Typography } from "@/shared/components/typography";
import { formatCurrency } from "@/shared/utils/currency.util";

import type { POSCartItem } from "../types";

type PaymentMethod = "CASH" | "BANK_TRANSFER";

type PosCartPanelProps = {
  items: POSCartItem[];
  total: number;
  isLoading?: boolean;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onCharge: (paymentMethod: PaymentMethod, customerName: string) => void;
};

export function PosCartPanel({
  items,
  total,
  isLoading,
  onUpdateQuantity,
  onRemoveItem,
  onCharge,
}: PosCartPanelProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [customerName, setCustomerName] = useState("");

  const handleCharge = () => {
    if (items.length === 0) return;
    onCharge(paymentMethod, customerName.trim());
  };

  return (
    <div className="flex w-72 shrink-0 flex-col border-l border-zinc-200 bg-white xl:w-80">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
        <Typography variant="heading-sm">Order</Typography>
        {items.length > 0 && (
          <Badge>
            {items.reduce((sum, i) => sum + i.quantity, 0)} items
          </Badge>
        )}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-3">
        {items.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center gap-2">
            <Typography variant="body-sm" color="secondary">
              No items yet
            </Typography>
            <Typography variant="body-xs" color="secondary">
              Tap a drink to add it
            </Typography>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="rounded-lg border border-zinc-100 bg-zinc-50 p-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <Typography variant="body-sm" className="truncate font-semibold">
                      {item.productName}
                    </Typography>
                    <Typography variant="body-xs" color="secondary">
                      {item.variantName}
                      {item.toppingNames.length > 0 && ` + ${item.toppingNames.join(", ")}`}
                    </Typography>
                    {(item.sugar !== "100%" || item.ice !== "Full") && (
                      <Typography variant="body-xs" color="secondary">
                        {item.sugar} sugar · {item.ice} ice
                      </Typography>
                    )}
                    {item.note && (
                      <Typography variant="body-xs" color="secondary" className="italic">
                        {item.note}
                      </Typography>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="mt-0.5 rounded p-0.5 text-zinc-400 hover:bg-red-50 hover:text-red-500"
                    aria-label="Remove item"
                  >
                    <Trash size={14} />
                  </button>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <Typography variant="body-sm" className="font-semibold">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </Typography>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="flex h-6 w-6 items-center justify-center rounded border border-zinc-200 hover:bg-zinc-100"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-5 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="flex h-6 w-6 items-center justify-center rounded border border-zinc-200 hover:bg-zinc-100"
                      aria-label="Increase quantity"
                    >
                      <Add size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-200 p-4 space-y-3">
        <Input
          label="Customer name (optional)"
          placeholder="Walk-in customer"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />

        <div className="space-y-1.5">
          <Typography variant="body-xs" color="secondary">
            Payment method
          </Typography>
          <div className="grid grid-cols-2 gap-2">
            {(["CASH", "BANK_TRANSFER"] as const).map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={`rounded-lg border py-2 text-sm font-medium transition-colors ${
                  paymentMethod === method
                    ? "border-amber-600 bg-amber-600 text-white"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-amber-300"
                }`}
              >
                {method === "CASH" ? "Cash" : "Transfer"}
              </button>
            ))}
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <Typography variant="body-md" className="font-semibold">
            Total
          </Typography>
          <Typography variant="heading-sm" className="text-amber-600">
            {formatCurrency(total)}
          </Typography>
        </div>

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleCharge}
          disabled={items.length === 0 || isLoading}
          loading={isLoading}
        >
          Charge {total > 0 ? formatCurrency(total) : ""}
        </Button>
      </div>
    </div>
  );
}
