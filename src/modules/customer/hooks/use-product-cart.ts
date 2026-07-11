"use client";

import { useCallback, useMemo } from "react";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import type { ProductCartItem } from "../types";

const PRODUCT_CART_STORAGE_KEY = "product-cart";

export const productCartAtom = atomWithStorage<ProductCartItem[]>(PRODUCT_CART_STORAGE_KEY, []);

export function useProductCart() {
  const [items, setItems] = useAtom(productCartAtom);

  const addItem = useCallback(
    (item: Omit<ProductCartItem, "id">) => {
      setItems((prev) => {
        const existing = prev.find(
          (cartItem) => cartItem.productId === item.productId && cartItem.skuId === item.skuId,
        );

        if (existing) {
          return prev.map((cartItem) =>
            cartItem.id === existing.id
              ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
              : cartItem,
          );
        }

        return [...prev, { ...item, id: crypto.randomUUID() }];
      });
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
      if (quantity < 1) return;
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
      );
    },
    [setItems],
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, [setItems]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items],
  );

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

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
