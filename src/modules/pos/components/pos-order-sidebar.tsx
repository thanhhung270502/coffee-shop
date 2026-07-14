"use client";

import { useState } from "react";
import { Add, Trash } from "iconsax-reactjs";
import { toast } from "sonner";

import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Input,
  Separator,
  Typography,
} from "@/shared/components";
import { formatCurrency } from "@/shared/utils/currency.util";

import type { PosPaymentUiOption } from "../constants";
import type { UsePosCheckoutReturn } from "../hooks/use-pos-checkout";
import type { POSCartItem } from "../types";

import { PosOrderAdjustments } from "./pos-order-adjustments";
import { PosOrderLineItems } from "./pos-order-line-items";
import { PosPaymentMethodPicker } from "./pos-payment-method-picker";

type PosOrderSidebarProps = {
  items: POSCartItem[];
  subtotal: number;
  draftId: string;
  customerName: string;
  onCustomerNameChange: (name: string) => void;
  isLoading?: boolean;
  checkout: UsePosCheckoutReturn;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onHold: () => void;
  onVoid: () => void;
  onPayment: (
    paymentUi: PosPaymentUiOption,
    customerName: string,
  ) => void;
};

export function PosOrderSidebar({
  items,
  subtotal,
  draftId,
  customerName,
  onCustomerNameChange,
  isLoading,
  checkout,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onHold,
  onVoid,
  onPayment,
}: PosOrderSidebarProps) {
  const [paymentUi, setPaymentUi] = useState<PosPaymentUiOption>("CASH");
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);

  const handleClearCart = () => {
    if (items.length === 0) return;
    if (!confirm("Clear all items from this order?")) return;
    onClearCart();
  };

  const handleVoid = () => {
    if (items.length === 0) {
      toast.info("Nothing to void");
      return;
    }
    if (!confirm("Void this draft order? All items will be removed.")) return;
    onVoid();
    onCustomerNameChange("");
  };

  const handlePayment = () => {
    if (items.length === 0) return;
    onPayment(paymentUi, customerName.trim());
  };

  return (
    <>
      <aside className="flex w-full shrink-0 flex-col border-l border-neutral-200 bg-white md:w-80 lg:w-[360px] xl:w-[400px]">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
          <div>
            <Typography variant="heading-sm">Order List</Typography>
            <Typography variant="body-xs" color="secondary">
              Id: #{draftId}
            </Typography>
          </div>
          <Button
            variant="tertiary-gray"
            size="sm"
            startIcon={Trash}
            onClick={handleClearCart}
            disabled={items.length === 0}
            aria-label="Clear order"
            className="text-error-primary"
          />
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          <div className="flex gap-2">
            <Input
              label="Customer"
              placeholder="Walk-in customer"
              value={customerName}
              onChange={(e) => onCustomerNameChange(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="secondary-color"
              size="sm"
              startIcon={Add}
              onClick={() => setShowAddUserDialog(true)}
              className="mt-6 shrink-0"
            >
              Add User
            </Button>
          </div>

          <PosOrderLineItems
            items={items}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
            onClearAll={handleClearCart}
          />

          <PosOrderAdjustments
            taxRate={checkout.taxRate}
            onTaxRateChange={checkout.setTaxRate}
            shippingFee={checkout.shippingFee}
            onShippingFeeChange={checkout.setShippingFee}
            discountMode={checkout.discountMode}
            onDiscountModeChange={checkout.setDiscountMode}
            discountValue={checkout.discountValue}
            onDiscountValueChange={checkout.setDiscountValue}
            taxAmount={checkout.taxAmount}
            discountAmount={checkout.discountAmount}
            subtotal={subtotal}
          />

          <PosPaymentMethodPicker value={paymentUi} onChange={setPaymentUi} />
        </div>

        <div className="space-y-3 border-t border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <Typography variant="body-sm" color="secondary">
              Subtotal
            </Typography>
            <Typography variant="body-sm">{formatCurrency(subtotal)}</Typography>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            disabled={items.length === 0}
          >
            Grand Total: {formatCurrency(checkout.grandTotal)}
          </Button>

          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="gradient"
              size="sm"
              onClick={onHold}
              disabled={items.length === 0}
            >
              Hold
            </Button>
            <Button
              variant="destructive-secondary"
              size="sm"
              onClick={handleVoid}
              disabled={items.length === 0}
            >
              Void
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handlePayment}
              disabled={items.length === 0 || isLoading}
              loading={isLoading}
            >
              Payment
            </Button>
          </div>
        </div>
      </aside>

      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent className="max-w-sm">
          <DialogTitle>Add Customer</DialogTitle>
          <Separator className="my-3" />
          <Typography variant="body-sm" color="secondary">
            Customer search will be available in a future update. Enter the customer name in the
            field above for now.
          </Typography>
          <Button variant="primary" size="md" className="mt-4 w-full" onClick={() => setShowAddUserDialog(false)}>
            Got it
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
