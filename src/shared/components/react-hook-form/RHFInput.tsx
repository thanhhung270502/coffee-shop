"use client";

import { useCallback } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

import type { InputProps } from "../input";
import { Input, unformatNumber } from "../input";

export interface RHFInputProps<TFieldValues extends FieldValues = FieldValues> extends Omit<
  InputProps,
  "name" | "error" | "value" | "onChange" | "onBlur"
> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  showError?: boolean;
  formatter?: (value: string) => string;
  onValueChange?: (value: string | number | null) => void;
  formatNumber?: boolean;
}

export const RHFInput = <TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  showError = true,
  formatter,
  type,
  onValueChange,
  formatNumber = false,
  ...inputProps
}: RHFInputProps<TFieldValues>) => {
  const applyFormatter = useCallback(
    (value: string): string => {
      if (!formatter) return value;
      return formatter(value);
    },
    [formatter]
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          let value: string | number | null = e.target.value;

          if (formatNumber) {
            const cleanValue = unformatNumber(e.target.value);
            const numValue = parseFloat(cleanValue);
            value = Number.isNaN(numValue) ? null : numValue;
          } else if (type === "number") {
            const numValue = e.target.valueAsNumber;
            value = Number.isNaN(numValue) ? null : numValue;
          }
          // Handle text formatting
          else if (formatter) {
            value = applyFormatter(value);
          }

          field.onChange(value);
          onValueChange?.(value);
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
          // Apply formatter on blur if configured
          if (formatter && type !== "number") {
            const formatted = applyFormatter(e.target.value);
            if (formatted !== e.target.value) {
              field.onChange(formatted);
              onValueChange?.(formatted);
            }
          }
          field.onBlur();
        };

        return (
          <Input
            {...inputProps}
            type={type}
            formatNumber={formatNumber}
            name={field.name}
            value={field.value ?? ""}
            ref={field.ref}
            onChange={handleChange}
            onBlur={handleBlur}
            error={showError && fieldState.error ? fieldState.error.message : undefined}
          />
        );
      }}
    />
  );
};

RHFInput.displayName = "RHFInput";
