"use client";

import { useCallback, useMemo } from "react";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { toast } from "sonner";

import type { DrinkCartItem } from "../types";

const DRINK_CART_STORAGE_KEY = "drink-cart";

export const drinkCartAtom = atomWithStorage<DrinkCartItem[]>(DRINK_CART_STORAGE_KEY, []);

export function useDrinkCart() {
  const [items, setItems] = useAtom(drinkCartAtom);

  const addItem = useCallback(
    (item: Omit<DrinkCartItem, "id">) => {
      setItems((prev) => [
        ...prev,
        {
          ...item,
          id: crypto.randomUUID(),
        },
      ]);
      toast.success(`${item.productName} added to cart`);
    },
    [setItems]
  );

  const removeItem = useCallback(
    (id: string) => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    },
    [setItems]
  );

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity < 1) return;
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));
    },
    [setItems]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, [setItems]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items]
  );

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    itemCount,
  };
}
