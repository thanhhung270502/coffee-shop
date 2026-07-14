"use client";

import { Input, Select, Toggle, Typography } from "@/shared/components";
import { formatCurrency } from "@/shared/utils/currency.util";

import { POS_TAX_PRESETS } from "../constants";
import type { DiscountMode } from "../hooks/use-pos-checkout";

type PosOrderAdjustmentsProps = {
  taxRate: number;
  onTaxRateChange: (rate: number) => void;
  shippingFee: number;
  onShippingFeeChange: (fee: number) => void;
  discountMode: DiscountMode;
  onDiscountModeChange: (mode: DiscountMode) => void;
  discountValue: number;
  onDiscountValueChange: (value: number) => void;
  taxAmount: number;
  discountAmount: number;
  subtotal: number;
};

export function PosOrderAdjustments({
  taxRate,
  onTaxRateChange,
  shippingFee,
  onShippingFeeChange,
  discountMode,
  onDiscountModeChange,
  discountValue,
  onDiscountValueChange,
  taxAmount,
  discountAmount,
  subtotal,
}: PosOrderAdjustmentsProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Typography variant="body-xs" color="secondary">
          Order Tax
        </Typography>
        <Select
          value={POS_TAX_PRESETS.find((p) => p.value === String(taxRate)) ?? POS_TAX_PRESETS[0]}
          onChange={(option) => {
            if (option && "value" in option) {
              onTaxRateChange(Number(option.value));
            }
          }}
          options={POS_TAX_PRESETS.map((preset) => ({
            value: preset.value,
            label: preset.label,
          }))}
          placeholder="Select tax rate"
          isSearchable={false}
        />
        {taxAmount > 0 ? (
          <Typography variant="body-xs" color="secondary">
            Tax: {formatCurrency(taxAmount)}
          </Typography>
        ) : null}
      </div>

      <Input
        label="Shipping"
        type="number"
        min={0}
        value={shippingFee === 0 ? "" : String(shippingFee)}
        onChange={(e) => onShippingFeeChange(Math.max(0, Number(e.target.value) || 0))}
        placeholder="0"
      />

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Typography variant="body-xs" color="secondary">
            Discount
          </Typography>
          <div className="flex items-center gap-2">
            <Typography variant="body-xs" color="secondary">
              {discountMode === "percent" ? "Percent" : "Flat"}
            </Typography>
            <Toggle
              checked={discountMode === "percent"}
              onCheckedChange={(checked) =>
                onDiscountModeChange(checked ? "percent" : "flat")
              }
              aria-label="Toggle discount mode"
            />
          </div>
        </div>
        <Input
          type="number"
          min={0}
          max={discountMode === "percent" ? 100 : subtotal}
          value={discountValue === 0 ? "" : String(discountValue)}
          onChange={(e) => onDiscountValueChange(Math.max(0, Number(e.target.value) || 0))}
          placeholder={discountMode === "percent" ? "0%" : "0"}
        />
        {discountAmount > 0 ? (
          <Typography variant="body-xs" color="secondary">
            Discount: -{formatCurrency(discountAmount)}
          </Typography>
        ) : null}
      </div>
    </div>
  );
}
