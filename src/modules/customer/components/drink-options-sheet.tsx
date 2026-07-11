"use client";

import { useMemo, useState } from "react";
import type { PublicDrinkObject } from "@common/models/catalog";

import {
  Button,
  Checkbox,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Textarea,
  Typography,
} from "@/shared/components";
import { formatCurrency } from "@/shared/utils/currency.util";

import { useDrinkCart } from "../hooks/use-drink-cart";

const SUGAR_OPTIONS = ["100%", "70%", "50%", "0%"];
const ICE_OPTIONS = ["Normal", "Less", "No ice"];

type DrinkOptionsSheetProps = {
  drink: PublicDrinkObject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DrinkOptionsSheet({ drink, open, onOpenChange }: DrinkOptionsSheetProps) {
  const { addItem } = useDrinkCart();
  const [variantId, setVariantId] = useState("");
  const [toppingIds, setToppingIds] = useState<string[]>([]);
  const [sugar, setSugar] = useState("100%");
  const [ice, setIce] = useState("Normal");
  const [note, setNote] = useState("");

  const selectedVariant = drink?.variants.find((v) => v.id === variantId) ?? drink?.variants[0];
  const effectiveVariantId = selectedVariant?.id ?? "";

  const unitPrice = useMemo(() => {
    if (!drink || !selectedVariant) return 0;
    const toppingTotal = drink.toppings
      .filter((t) => toppingIds.includes(t.id))
      .reduce((sum, t) => sum + t.price, 0);
    return selectedVariant.price + toppingTotal;
  }, [drink, selectedVariant, toppingIds]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen && drink) {
      setVariantId(drink.variants[0]?.id ?? "");
      setToppingIds([]);
      setSugar("100%");
      setIce("Normal");
      setNote("");
    }
    onOpenChange(nextOpen);
  };

  const handleAddToCart = () => {
    if (!drink || !selectedVariant) return;

    const selectedToppings = drink.toppings.filter((t) => toppingIds.includes(t.id));

    addItem({
      productId: drink.id,
      productName: drink.name,
      variantId: effectiveVariantId,
      variantName: selectedVariant.name,
      toppingIds: selectedToppings.map((t) => t.id),
      toppingNames: selectedToppings.map((t) => t.name),
      sugar,
      ice,
      note,
      unitPrice,
      quantity: 1,
    });

    onOpenChange(false);
  };

  if (!drink) return null;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{drink.name}</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-6">
          {drink.description ? (
            <Typography variant="body-sm" color="secondary">
              {drink.description}
            </Typography>
          ) : null}

          <div className="space-y-2">
            <Typography variant="heading-sm">Size</Typography>
            <div className="flex flex-wrap gap-2">
              {drink.variants.map((variant) => (
                <Button
                  key={variant.id}
                  type="button"
                  variant={effectiveVariantId === variant.id ? "primary" : "secondary-gray"}
                  size="sm"
                  onClick={() => setVariantId(variant.id)}
                >
                  {variant.name} - {formatCurrency(variant.price)}
                </Button>
              ))}
            </div>
          </div>

          {drink.toppings.length > 0 ? (
            <div className="space-y-2">
              <Typography variant="heading-sm">Toppings</Typography>
              <div className="space-y-2">
                {drink.toppings.map((topping) => (
                  <label key={topping.id} className="flex items-center gap-2">
                    <Checkbox
                      checked={toppingIds.includes(topping.id)}
                      onCheckedChange={(checked) => {
                        setToppingIds((prev) =>
                          checked
                            ? [...prev, topping.id]
                            : prev.filter((id) => id !== topping.id),
                        );
                      }}
                    />
                    <Typography variant="body-sm">
                      {topping.name} (+{formatCurrency(topping.price)})
                    </Typography>
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          <div className="space-y-2">
            <Typography variant="heading-sm">Sugar</Typography>
            <div className="flex flex-wrap gap-2">
              {SUGAR_OPTIONS.map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant={sugar === option ? "primary" : "secondary-gray"}
                  size="sm"
                  onClick={() => setSugar(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Typography variant="heading-sm">Ice</Typography>
            <div className="flex flex-wrap gap-2">
              {ICE_OPTIONS.map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant={ice === option ? "primary" : "secondary-gray"}
                  size="sm"
                  onClick={() => setIce(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Typography variant="heading-sm">Note</Typography>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Special instructions..."
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between border-t border-zinc-200 pt-4">
            <Typography variant="heading-sm">{formatCurrency(unitPrice)}</Typography>
            <Button type="button" variant="primary" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
