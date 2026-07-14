"use client";

import { Trash } from "iconsax-reactjs";

import { Button, Sheet, SheetContent, SheetHeader, SheetTitle, Typography } from "@/shared/components";
import { formatCurrency } from "@/shared/utils/currency.util";

import type { PosHeldOrder } from "../hooks/use-pos-held-orders";

type PosHeldOrdersSheetProps = {
  open: boolean;
  onClose: () => void;
  heldOrders: PosHeldOrder[];
  onResume: (order: PosHeldOrder) => void;
  onRemove: (id: string) => void;
};

export function PosHeldOrdersSheet({
  open,
  onClose,
  heldOrders,
  onResume,
  onRemove,
}: PosHeldOrdersSheetProps) {
  return (
    <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <SheetContent side="right" className="w-full max-w-md">
        <SheetHeader>
          <SheetTitle>Held Transactions</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-3">
          {heldOrders.length === 0 ? (
            <Typography variant="body-sm" color="secondary">
              No held orders. Use Hold to save the current cart.
            </Typography>
          ) : (
            heldOrders.map((order) => {
              const total = order.items.reduce(
                (sum, item) => sum + item.unitPrice * item.quantity,
                0,
              );
              return (
                <div
                  key={order.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-neutral-200 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <Typography variant="body-sm" className="font-semibold">
                      {order.label}
                    </Typography>
                    <Typography variant="body-xs" color="secondary">
                      {order.items.length} items · {formatCurrency(total)}
                    </Typography>
                    <Typography variant="body-xs" color="secondary">
                      {new Date(order.createdAt).toLocaleString("en-US", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </Typography>
                  </div>
                  <div className="flex shrink-0 flex-col gap-1">
                    <Button variant="primary" size="sm" onClick={() => onResume(order)}>
                      Resume
                    </Button>
                    <Button
                      variant="tertiary-gray"
                      size="sm"
                      startIcon={Trash}
                      onClick={() => onRemove(order.id)}
                      aria-label="Delete held order"
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
