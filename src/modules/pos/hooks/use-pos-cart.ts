"use client";

import { useCallback, useMemo } from "react";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { toast } from "sonner";

import type { POSCartItem } from "../types";

const POS_CART_STORAGE_KEY = "pos-cart";

export const posCartAtom = atomWithStorage<POSCartItem[]>(POS_CART_STORAGE_KEY, []);

export function usePosCart() {
  const [items, setItems] = useAtom(posCartAtom);

  const addItem = useCallback(
    (item: Omit<POSCartItem, "id">) => {
      setItems((prev) => [
        ...prev,
        {
          ...item,
          id: crypto.randomUUID(),
        },
      ]);
      toast.success(`${item.productName} added`);
    },
    [setItems],
  );

  const removeItem = useCallback(
    (id: string) => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    },
    [setItems],
  );

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity < 1) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        return;
      }
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));
    },
    [setItems],
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, [setItems]);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items],
  );

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    itemCount,
  };
}
