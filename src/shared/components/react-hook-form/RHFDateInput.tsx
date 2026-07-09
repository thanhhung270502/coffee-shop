"use client";

import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

import { toDate } from "../../utils";
import type { DateInputProps } from "../date-input";
import { DateInput } from "../date-input";

export interface RHFDateInputProps<TFieldValues extends FieldValues = FieldValues> extends Omit<
  DateInputProps,
  "name" | "error" | "value" | "onChange"
> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  showError?: boolean;
  onValueChange?: (value: Date | null) => void;
}

const parseToDate = (value: unknown): Date | null => {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = toDate(value);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
};

export const RHFDateInput = <TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  showError = true,
  onValueChange,
  ...dateInputProps
}: RHFDateInputProps<TFieldValues>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <DateInput
          {...dateInputProps}
          value={parseToDate(field.value)}
          onChange={(date) => {
            field.onChange(date);
            onValueChange?.(date);
          }}
          error={showError && fieldState.error ? fieldState.error.message : undefined}
        />
      )}
    />
  );
};

RHFDateInput.displayName = "RHFDateInput";
