"use client";

import { CardPos, Money, Scan } from "iconsax-reactjs";

import { Typography } from "@/shared/components";
import { cn } from "@/shared/utils/cn.util";

import { POS_PAYMENT_OPTIONS, type PosPaymentUiOption } from "../constants";

const PAYMENT_ICONS = {
  CASH: Money,
  CARD: CardPos,
  SCAN: Scan,
} as const;

type PosPaymentMethodPickerProps = {
  value: PosPaymentUiOption;
  onChange: (value: PosPaymentUiOption) => void;
};

export function PosPaymentMethodPicker({ value, onChange }: PosPaymentMethodPickerProps) {
  return (
    <div className="space-y-1.5">
      <Typography variant="body-xs" color="secondary">
        Payment Method
      </Typography>
      <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Payment method">
        {POS_PAYMENT_OPTIONS.map((option) => {
          const Icon = PAYMENT_ICONS[option.id];
          const isActive = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => onChange(option.id)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl border p-2 transition-colors",
                isActive
                  ? "border-brand-main bg-brand-primary-subtle ring-1 ring-brand-main"
                  : "border-neutral-200 bg-white hover:border-neutral-300",
              )}
            >
              <Icon size={20} className={isActive ? "text-brand-main" : "text-neutral-500"} />
              <Typography variant="body-xs" className="font-medium">
                {option.label}
              </Typography>
            </button>
          );
        })}
      </div>
    </div>
  );
}
