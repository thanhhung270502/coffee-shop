"use client";

import { useCallback, useMemo, useState } from "react";

export type DiscountMode = "flat" | "percent";

export type PosCheckoutState = {
  taxRate: number;
  shippingFee: number;
  discountMode: DiscountMode;
  discountValue: number;
};

export function usePosCheckout(subtotal: number) {
  const [taxRate, setTaxRate] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [discountMode, setDiscountMode] = useState<DiscountMode>("flat");
  const [discountValue, setDiscountValue] = useState(0);

  const taxAmount = useMemo(
    () => Math.round(subtotal * (taxRate / 100)),
    [subtotal, taxRate],
  );

  const discountAmount = useMemo(() => {
    if (discountValue <= 0) return 0;
    if (discountMode === "percent") {
      return Math.min(Math.round(subtotal * (discountValue / 100)), subtotal);
    }
    return Math.min(discountValue, subtotal);
  }, [discountMode, discountValue, subtotal]);

  const grandTotal = useMemo(
    () => Math.max(0, subtotal + taxAmount + shippingFee - discountAmount),
    [subtotal, taxAmount, shippingFee, discountAmount],
  );

  const reset = useCallback(() => {
    setTaxRate(0);
    setShippingFee(0);
    setDiscountMode("flat");
    setDiscountValue(0);
  }, []);

  const restore = useCallback((state: PosCheckoutState) => {
    setTaxRate(state.taxRate);
    setShippingFee(state.shippingFee);
    setDiscountMode(state.discountMode);
    setDiscountValue(state.discountValue);
  }, []);

  const snapshot = useMemo(
    (): PosCheckoutState => ({
      taxRate,
      shippingFee,
      discountMode,
      discountValue,
    }),
    [taxRate, shippingFee, discountMode, discountValue],
  );

  return {
    taxRate,
    setTaxRate,
    shippingFee,
    setShippingFee,
    discountMode,
    setDiscountMode,
    discountValue,
    setDiscountValue,
    taxAmount,
    discountAmount,
    grandTotal,
    reset,
    restore,
    snapshot,
  };
}

export type UsePosCheckoutReturn = ReturnType<typeof usePosCheckout>;
