"use client";

import type { OrderObject } from "@common/models/order";
import { TickCircle } from "iconsax-reactjs";
import { useRouter } from "next/navigation";

import { Button } from "@/shared/components/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/dialog";
import { Typography } from "@/shared/components/typography";
import { formatCurrency } from "@/shared/utils/currency.util";

type PosOrderCompleteDialogProps = {
  order: OrderObject | null;
  open: boolean;
  onClose: () => void;
};

export function PosOrderCompleteDialog({ order, open, onClose }: PosOrderCompleteDialogProps) {
  const router = useRouter();

  const handlePrint = () => {
    if (!order) return;
    router.push(`/pos/receipt/${order.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="max-w-sm text-center">
        <DialogTitle className="sr-only">Order Complete</DialogTitle>
        <div className="flex flex-col items-center gap-4 py-2">
          <TickCircle size={56} className="text-green-500" variant="Bold" />
          <div className="space-y-1">
            <Typography variant="heading-md">Order placed!</Typography>
            {order && (
              <Typography variant="body-lg" className="font-bold text-amber-600">
                {order.orderNumber}
              </Typography>
            )}
            {order && (
              <Typography variant="body-sm" color="secondary">
                Total: {formatCurrency(order.total)}
              </Typography>
            )}
          </div>

          <div className="flex w-full flex-col gap-2">
            <Button variant="secondary-gray" size="md" className="w-full" onClick={handlePrint}>
              Print Receipt
            </Button>
            <Button variant="primary" size="md" className="w-full" onClick={onClose}>
              New Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
