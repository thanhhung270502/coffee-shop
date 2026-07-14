"use client";

import { Add, Minus, ShoppingCart, Trash } from "iconsax-reactjs";

import { Badge, Button, Typography } from "@/shared/components";
import { formatCurrency } from "@/shared/utils/currency.util";

import type { POSCartItem } from "../types";

type PosOrderLineItemsProps = {
  items: POSCartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
};

export function PosOrderLineItems({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearAll,
}: PosOrderLineItemsProps) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Typography variant="body-sm" className="font-semibold">
            Products Added
          </Typography>
          {itemCount > 0 ? <Badge>{itemCount}</Badge> : null}
        </div>
        {items.length > 0 ? (
          <Button variant="link" size="sm" onClick={onClearAll} className="text-error-primary">
            Clear all
          </Button>
        ) : null}
      </div>

      <div className="max-h-56 overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 py-8">
            <ShoppingCart size={32} className="text-neutral-400" />
            <Typography variant="body-sm" color="secondary">
              No Products Selected
            </Typography>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="rounded-lg border border-neutral-100 bg-neutral-50 p-2">
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
                    {item.note ? (
                      <Typography variant="body-xs" color="secondary" className="italic">
                        {item.note}
                      </Typography>
                    ) : null}
                  </div>
                  <Button
                    variant="tertiary-gray"
                    size="sm"
                    startIcon={Trash}
                    onClick={() => onRemoveItem(item.id)}
                    aria-label="Remove item"
                    className="!p-1 text-neutral-400 hover:text-error-primary"
                  />
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <Typography variant="body-sm" className="font-semibold">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </Typography>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="secondary-gray"
                      size="sm"
                      startIcon={Minus}
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                      className="!h-7 !w-7 !p-0"
                    />
                    <span className="w-5 text-center text-sm font-medium">{item.quantity}</span>
                    <Button
                      variant="secondary-gray"
                      size="sm"
                      startIcon={Add}
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                      className="!h-7 !w-7 !p-0"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
