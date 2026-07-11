"use client";

import type { Control } from "react-hook-form";
import { EFulfillmentType } from "@common/models/order";

import { Button, Typography } from "@/shared/components";

import type { DrinkCheckoutFormData } from "../hooks/use-drink-checkout";

type FulfillmentSelectorProps = {
  value: EFulfillmentType;
  onChange: (value: EFulfillmentType) => void;
};

export function FulfillmentSelector({ value, onChange }: FulfillmentSelectorProps) {
  return (
    <div className="space-y-2">
      <Typography variant="heading-sm">Fulfillment</Typography>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={value === EFulfillmentType.PICKUP ? "primary" : "secondary-gray"}
          onClick={() => onChange(EFulfillmentType.PICKUP)}
        >
          Pickup
        </Button>
        <Button
          type="button"
          variant={value === EFulfillmentType.DELIVERY ? "primary" : "secondary-gray"}
          onClick={() => onChange(EFulfillmentType.DELIVERY)}
        >
          Delivery
        </Button>
      </div>
    </div>
  );
}

export type DrinkCheckoutFulfillmentFieldProps = {
  control: Control<DrinkCheckoutFormData>;
  value: EFulfillmentType;
  onChange: (value: EFulfillmentType) => void;
};
