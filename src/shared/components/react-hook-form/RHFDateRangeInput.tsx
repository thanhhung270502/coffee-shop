"use client";

import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

import { toDate } from "../../utils";
import type { DateRangeInputProps } from "../date-range-input";
import { DateRangeInput } from "../date-range-input";

export interface RHFDateRangeInputProps<
  TFieldValues extends FieldValues = FieldValues,
> extends Omit<
  DateRangeInputProps,
  | "startDate"
  | "endDate"
  | "onStartDateChange"
  | "onEndDateChange"
  | "onRangeChange"
  | "startError"
  | "endError"
> {
  startName: Path<TFieldValues>;
  endName: Path<TFieldValues>;
  control: Control<TFieldValues>;
  showError?: boolean;
  onValueChange?: (startDate: Date | null, endDate: Date | null) => void;
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

export const RHFDateRangeInput = <TFieldValues extends FieldValues = FieldValues>({
  startName,
  endName,
  control,
  showError = true,
  onValueChange,
  ...dateRangeInputProps
}: RHFDateRangeInputProps<TFieldValues>) => {
  return (
    <Controller
      name={startName}
      control={control}
      render={({ field: startField, fieldState: startFieldState }) => (
        <Controller
          name={endName}
          control={control}
          render={({ field: endField, fieldState: endFieldState }) => (
            <DateRangeInput
              {...dateRangeInputProps}
              startDate={parseToDate(startField.value)}
              endDate={parseToDate(endField.value)}
              onRangeChange={(start, end) => {
                startField.onChange(start);
                endField.onChange(end);
                onValueChange?.(start, end);
              }}
              startError={
                showError && startFieldState.error ? startFieldState.error.message : undefined
              }
              endError={showError && endFieldState.error ? endFieldState.error.message : undefined}
            />
          )}
        />
      )}
    />
  );
};

RHFDateRangeInput.displayName = "RHFDateRangeInput";
