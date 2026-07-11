"use client";

import { useState } from "react";
import type { PublicDrinkObject } from "@common/models/catalog";

import { Button } from "@/shared/components/button";
import { Checkbox } from "@/shared/components/checkbox";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/shared/components/sheet";
import { Textarea } from "@/shared/components/textarea";
import { Typography } from "@/shared/components/typography";
import { formatCurrency } from "@/shared/utils/currency.util";

import type { POSCartItem } from "../types";

const SUGAR_OPTIONS = ["100%", "70%", "50%", "0%"];
const ICE_OPTIONS = ["Full", "Less", "None"];

type PosDrinkOptionsPanelProps = {
  drink: PublicDrinkObject | null;
  open: boolean;
  onClose: () => void;
  onAdd: (item: Omit<POSCartItem, "id">) => void;
};

function OptionButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "border-amber-600 bg-amber-600 text-white"
          : "border-zinc-200 bg-white text-zinc-700 hover:border-amber-300"
      }`}
    >
      {children}
    </button>
  );
}

export function PosDrinkOptionsPanel({ drink, open, onClose, onAdd }: PosDrinkOptionsPanelProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [selectedToppingIds, setSelectedToppingIds] = useState<string[]>([]);
  const [sugar, setSugar] = useState("100%");
  const [ice, setIce] = useState("Full");
  const [note, setNote] = useState("");
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = drink?.variants.find((v) => v.id === selectedVariantId);
  const toppingTotal =
    drink?.toppings
      .filter((t) => selectedToppingIds.includes(t.id))
      .reduce((sum, t) => sum + t.price, 0) ?? 0;
  const unitPrice = (selectedVariant?.price ?? 0) + toppingTotal;
  const totalPrice = unitPrice * quantity;

  const resetState = () => {
    setSelectedVariantId("");
    setSelectedToppingIds([]);
    setSugar("100%");
    setIce("Full");
    setNote("");
    setQuantity(1);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
      resetState();
    }
  };

  const handleAdd = () => {
    if (!drink || !selectedVariantId) return;
    const variant = drink.variants.find((v) => v.id === selectedVariantId);
    if (!variant) return;

    const selectedToppings = drink.toppings.filter((t) => selectedToppingIds.includes(t.id));
    onAdd({
      productId: drink.id,
      productName: drink.name,
      variantId: selectedVariantId,
      variantName: variant.name,
      toppingIds: selectedToppingIds,
      toppingNames: selectedToppings.map((t) => t.name),
      sugar,
      ice,
      note,
      unitPrice,
      quantity,
    });
    handleOpenChange(false);
  };

  const toggleTopping = (toppingId: string) => {
    setSelectedToppingIds((prev) =>
      prev.includes(toppingId) ? prev.filter((id) => id !== toppingId) : [...prev, toppingId],
    );
  };

  // Auto-select first variant when panel opens
  if (open && drink && !selectedVariantId && drink.variants.length > 0) {
    setSelectedVariantId(drink.variants[0].id);
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="flex w-full max-w-sm flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-zinc-200 px-4 py-3">
          <SheetTitle>{drink?.name ?? ""}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-5 overflow-y-auto p-4">
          {/* Size */}
          {drink && drink.variants.length > 0 && (
            <div className="space-y-2">
              <Typography variant="body-sm" className="font-semibold">
                Size
              </Typography>
              <div className="flex flex-wrap gap-2">
                {drink.variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      selectedVariantId === variant.id
                        ? "border-amber-600 bg-amber-600 text-white"
                        : "border-zinc-200 bg-white text-zinc-700 hover:border-amber-300"
                    }`}
                  >
                    {variant.name} — {formatCurrency(variant.price)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Toppings */}
          {drink && drink.toppings.length > 0 && (
            <div className="space-y-2">
              <Typography variant="body-sm" className="font-semibold">
                Toppings
              </Typography>
              <div className="space-y-2">
                {drink.toppings.map((topping) => (
                  <div key={topping.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`topping-${topping.id}`}
                        checked={selectedToppingIds.includes(topping.id)}
                        onCheckedChange={() => toggleTopping(topping.id)}
                      />
                      <label
                        htmlFor={`topping-${topping.id}`}
                        className="cursor-pointer text-sm text-zinc-700"
                      >
                        {topping.name}
                      </label>
                    </div>
                    <Typography variant="body-xs" color="secondary">
                      +{formatCurrency(topping.price)}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sugar */}
          <div className="space-y-2">
            <Typography variant="body-sm" className="font-semibold">
              Sugar
            </Typography>
            <div className="flex flex-wrap gap-2">
              {SUGAR_OPTIONS.map((opt) => (
                <OptionButton key={opt} active={sugar === opt} onClick={() => setSugar(opt)}>
                  {opt}
                </OptionButton>
              ))}
            </div>
          </div>

          {/* Ice */}
          <div className="space-y-2">
            <Typography variant="body-sm" className="font-semibold">
              Ice
            </Typography>
            <div className="flex flex-wrap gap-2">
              {ICE_OPTIONS.map((opt) => (
                <OptionButton key={opt} active={ice === opt} onClick={() => setIce(opt)}>
                  {opt}
                </OptionButton>
              ))}
            </div>
          </div>

          {/* Note */}
          <Textarea
            label="Note"
            placeholder="Special requests..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="min-h-0"
          />
        </div>

        <SheetFooter className="border-t border-zinc-200 p-4">
          {/* Quantity */}
          <div className="mb-3 flex items-center justify-between">
            <Typography variant="body-sm" className="font-semibold">
              Quantity
            </Typography>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-lg font-bold hover:bg-zinc-100"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <Typography variant="body-md" className="w-6 text-center font-semibold">
                {quantity}
              </Typography>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-lg font-bold hover:bg-zinc-100"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleAdd}
            disabled={!selectedVariantId}
          >
            Add — {formatCurrency(totalPrice)}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
