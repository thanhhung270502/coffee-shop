"use client";

import { useState } from "react";
import type { PublicDrinkObject } from "@common/models/catalog";
import type { OrderObject } from "@common/models/order";
import { toast } from "sonner";

import { Skeleton } from "@/shared/components/skeleton";
import { Typography } from "@/shared/components/typography";
import { useCreatePosOrderMutation } from "@/shared/mutations/use-create-pos-order-mutation";
import { useQueryPosCatalog } from "@/shared/queries/use-query-pos-catalog";

import { PosCartPanel } from "../components/pos-cart-panel";
import { PosCategoryNav } from "../components/pos-category-nav";
import { PosDrinkCard } from "../components/pos-drink-card";
import { PosDrinkOptionsPanel } from "../components/pos-drink-options-panel";
import { PosOrderCompleteDialog } from "../components/pos-order-complete-dialog";
import { usePosCart } from "../hooks/use-pos-cart";
import type { POSCartItem } from "../types";

export function PosSellPage() {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [optionsDrink, setOptionsDrink] = useState<PublicDrinkObject | null>(null);
  const [completedOrder, setCompletedOrder] = useState<OrderObject | null>(null);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);

  const { data, isLoading } = useQueryPosCatalog();
  const { items, addItem, removeItem, updateQuantity, clearCart, total } = usePosCart();
  const { mutate: createOrder, isPending } = useCreatePosOrderMutation();

  const filteredDrinks = selectedCategorySlug
    ? (data?.drinks ?? []).filter((d) => d.categorySlug === selectedCategorySlug)
    : (data?.drinks ?? []);

  const handleAddItem = (item: Omit<POSCartItem, "id">) => {
    addItem(item);
    setOptionsDrink(null);
  };

  const handleCharge = (paymentMethod: "CASH" | "BANK_TRANSFER", customerName: string) => {
    if (items.length === 0) return;

    createOrder(
      {
        customerName: customerName || undefined,
        paymentMethod,
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
          setCompletedOrder(res.order);
          setShowCompleteDialog(true);
        },
        onError: () => {
          toast.error("Failed to create order. Please try again.");
        },
      },
    );
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Category sidebar */}
      <PosCategoryNav
        categories={data?.categories ?? []}
        selected={selectedCategorySlug}
        onSelect={setSelectedCategorySlug}
      />

      {/* Drink grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : filteredDrinks.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <Typography variant="body-md" color="secondary">
              No drinks available
            </Typography>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filteredDrinks.map((drink) => (
              <PosDrinkCard key={drink.id} drink={drink} onSelect={setOptionsDrink} />
            ))}
          </div>
        )}
      </div>

      {/* Cart panel */}
      <PosCartPanel
        items={items}
        total={total}
        isLoading={isPending}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCharge={handleCharge}
      />

      {/* Options sheet */}
      <PosDrinkOptionsPanel
        drink={optionsDrink}
        open={optionsDrink !== null}
        onClose={() => setOptionsDrink(null)}
        onAdd={handleAddItem}
      />

      {/* Order complete dialog */}
      <PosOrderCompleteDialog
        order={completedOrder}
        open={showCompleteDialog}
        onClose={() => {
          setShowCompleteDialog(false);
          setCompletedOrder(null);
        }}
      />
    </div>
  );
}
