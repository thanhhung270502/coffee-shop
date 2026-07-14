"use client";

import { useCallback } from "react";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import type { POSCartItem } from "../types";

import type { PosCheckoutState } from "./use-pos-checkout";

export type PosHeldOrder = {
  id: string;
  label: string;
  createdAt: string;
  items: POSCartItem[];
  customerName: string;
  checkout: PosCheckoutState;
};

const POS_HELD_ORDERS_KEY = "pos-held-orders";

const heldOrdersAtom = atomWithStorage<PosHeldOrder[]>(POS_HELD_ORDERS_KEY, []);

export function usePosHeldOrders() {
  const [heldOrders, setHeldOrders] = useAtom(heldOrdersAtom);

  const holdOrder = useCallback(
    (order: Omit<PosHeldOrder, "id" | "createdAt" | "label"> & { label?: string }) => {
      const entry: PosHeldOrder = {
        id: crypto.randomUUID(),
        label: order.label ?? `Held #${heldOrders.length + 1}`,
        createdAt: new Date().toISOString(),
        items: order.items,
        customerName: order.customerName,
        checkout: order.checkout,
      };
      setHeldOrders((prev) => [...prev, entry]);
      return entry;
    },
    [heldOrders.length, setHeldOrders],
  );

  const removeHeldOrder = useCallback(
    (id: string) => {
      setHeldOrders((prev) => prev.filter((order) => order.id !== id));
    },
    [setHeldOrders],
  );

  const clearHeldOrders = useCallback(() => {
    setHeldOrders([]);
  }, [setHeldOrders]);

  return {
    heldOrders,
    holdOrder,
    removeHeldOrder,
    clearHeldOrders,
  };
}

export type UsePosHeldOrdersReturn = ReturnType<typeof usePosHeldOrders>;
