"use client";

import { useState } from "react";
import type { PublicDrinkObject } from "@common/models/catalog";
import type { OrderObject } from "@common/models/order";
import { toast } from "sonner";

import { useCreatePosOrderMutation } from "@/shared/mutations/use-create-pos-order-mutation";
import { useQueryPosCatalog } from "@/shared/queries/use-query-pos-catalog";

import { PosDrinkOptionsPanel } from "../components/pos-drink-options-panel";
import { PosHeldOrdersSheet } from "../components/pos-held-orders-sheet";
import { PosOrderCompleteDialog } from "../components/pos-order-complete-dialog";
import { PosOrderSidebar } from "../components/pos-order-sidebar";
import { PosSellWorkspace } from "../components/pos-sell-workspace";
import type { PosPaymentUiOption } from "../constants";
import { usePosCart } from "../hooks/use-pos-cart";
import { usePosCheckout } from "../hooks/use-pos-checkout";
import type { PosHeldOrder } from "../hooks/use-pos-held-orders";
import { usePosHeldOrders } from "../hooks/use-pos-held-orders";
import { usePosShell } from "../hooks/use-pos-shell";
import type { POSCartItem } from "../types";

function mapPaymentUiToApi(paymentUi: PosPaymentUiOption): {
  paymentMethod: "CASH" | "BANK_TRANSFER";
  paymentReference?: string;
} {
  if (paymentUi === "CASH") {
    return { paymentMethod: "CASH" };
  }
  if (paymentUi === "SCAN") {
    return { paymentMethod: "BANK_TRANSFER", paymentReference: "QR_SCAN" };
  }
  return { paymentMethod: "BANK_TRANSFER" };
}

export function PosSellPage() {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [optionsDrink, setOptionsDrink] = useState<PublicDrinkObject | null>(null);
  const [completedOrder, setCompletedOrder] = useState<OrderObject | null>(null);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showHeldOrders, setShowHeldOrders] = useState(false);
  const [customerNameDraft, setCustomerNameDraft] = useState("");

  const { sessionDraftId, setLastOrderId } = usePosShell();
  const { data, isLoading } = useQueryPosCatalog();
  const { items, addItem, removeItem, updateQuantity, clearCart, total, setItems } = usePosCart();
  const checkout = usePosCheckout(total);
  const { heldOrders, holdOrder, removeHeldOrder } = usePosHeldOrders();
  const { mutate: createOrder, isPending } = useCreatePosOrderMutation();

  const handleAddItem = (item: Omit<POSCartItem, "id">) => {
    addItem(item);
    setOptionsDrink(null);
  };

  const handleReset = () => {
    if (items.length === 0 && checkout.taxRate === 0 && checkout.shippingFee === 0) {
      return;
    }
    if (!confirm("Reset the current order and checkout fields?")) return;
    clearCart();
    checkout.reset();
    setCustomerNameDraft("");
    toast.success("Order reset");
  };

  const handleHold = (customerName: string) => {
    if (items.length === 0) return;
    holdOrder({
      items: [...items],
      customerName,
      checkout: checkout.snapshot,
    });
    clearCart();
    checkout.reset();
    setCustomerNameDraft("");
    toast.success("Order held");
  };

  const handleVoid = () => {
    clearCart();
    checkout.reset();
    setCustomerNameDraft("");
    toast.success("Draft order voided");
  };

  const handleResumeHeldOrder = (order: PosHeldOrder) => {
    if (items.length > 0 && !confirm("Replace the current cart with this held order?")) {
      return;
    }
    setItems(order.items);
    checkout.restore(order.checkout);
    setCustomerNameDraft(order.customerName);
    removeHeldOrder(order.id);
    setShowHeldOrders(false);
    toast.success("Held order resumed");
  };

  const handlePayment = (paymentUi: PosPaymentUiOption, customerName: string) => {
    if (items.length === 0) return;

    const { paymentMethod, paymentReference } = mapPaymentUiToApi(paymentUi);

    createOrder(
      {
        customerName: customerName || undefined,
        paymentMethod,
        paymentReference,
        shippingFee: checkout.shippingFee,
        discount: checkout.discountAmount,
        taxRate: checkout.taxRate,
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          toppingIds: item.toppingIds.length > 0 ? item.toppingIds : undefined,
          quantity: item.quantity,
          note: item.note || undefined,
          options: {
            sugar: item.sugar,
            ice: item.ice,
          },
        })),
      },
      {
        onSuccess: (res) => {
          clearCart();
          checkout.reset();
          setCustomerNameDraft("");
          setCompletedOrder(res.order);
          setLastOrderId(res.order.id);
          setShowCompleteDialog(true);
        },
        onError: () => {
          toast.error("Failed to create order. Please try again.");
        },
      },
    );
  };

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <PosSellWorkspace
        categories={data?.categories ?? []}
        drinks={data?.drinks ?? []}
        isLoading={isLoading}
        selectedCategorySlug={selectedCategorySlug}
        onSelectCategory={setSelectedCategorySlug}
        onSelectDrink={setOptionsDrink}
        onReset={handleReset}
        onOpenTransactions={() => setShowHeldOrders(true)}
      />

      <PosOrderSidebar
        items={items}
        subtotal={total}
        draftId={sessionDraftId}
        customerName={customerNameDraft}
        onCustomerNameChange={setCustomerNameDraft}
        isLoading={isPending}
        checkout={checkout}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onClearCart={() => {
          clearCart();
          checkout.reset();
        }}
        onHold={() => handleHold(customerNameDraft)}
        onVoid={handleVoid}
        onPayment={handlePayment}
      />

      <PosDrinkOptionsPanel
        drink={optionsDrink}
        open={optionsDrink !== null}
        onClose={() => setOptionsDrink(null)}
        onAdd={handleAddItem}
      />

      <PosOrderCompleteDialog
        order={completedOrder}
        open={showCompleteDialog}
        onClose={() => {
          setShowCompleteDialog(false);
          setCompletedOrder(null);
        }}
      />

      <PosHeldOrdersSheet
        open={showHeldOrders}
        onClose={() => setShowHeldOrders(false)}
        heldOrders={heldOrders}
        onResume={handleResumeHeldOrder}
        onRemove={removeHeldOrder}
      />
    </div>
  );
}
