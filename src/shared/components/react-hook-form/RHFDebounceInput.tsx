"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  Control,
  ControllerRenderProps,
  FieldError,
  FieldValues,
  Path,
} from "react-hook-form";
import { Controller } from "react-hook-form";

import type { InputProps } from "../input";
import { Input } from "../input";

export interface RHFDebounceInputProps<TFieldValues extends FieldValues = FieldValues> extends Omit<
  InputProps,
  "name" | "error" | "value" | "onChange" | "onBlur"
> {
  /**
   * Name of the form field. Must match a field in your form schema.
   * @example "searchQuery" | "email" | "username"
   */
  name: Path<TFieldValues>;

  /**
   * React Hook Form control object obtained from useForm()
   */
  control: Control<TFieldValues>;

  /**
   * Whether to display validation errors below the input
   * @default true
   */
  showError?: boolean;

  /**
   * Debounce delay in milliseconds before updating the form value
   * @default 300
   */
  debounceDelay?: number;

  /**
   * Optional formatter function to transform input values as user types.
   * @param value - The current input value as a string
   * @returns The formatted string to display and store in form state
   */
  formatter?: (value: string) => string;
}

interface DebouncedInputInternalProps extends Omit<InputProps, "name" | "error"> {
  field: ControllerRenderProps<any, any>;
  fieldError?: FieldError;
  debounceDelay: number;
  formatter?: (value: string) => string;
  showError: boolean;
}

/**
 * Internal component that handles the debounce logic with proper hooks usage
 */
const DebouncedInputInternal = ({
  field,
  fieldError,
  debounceDelay,
  formatter,
  showError,
  type,
  ...inputProps
}: DebouncedInputInternalProps) => {
  const [localValue, setLocalValue] = useState<string>(field.value ?? "");

  // Memoize the formatting logic
  const applyFormatter = useCallback(
    (value: string): string => {
      if (!formatter) return value;
      return formatter(value);
    },
    [formatter]
  );

  // Debounce effect - update form value after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      let processedValue: string | number | null = localValue;

      // Handle number inputs
      if (type === "number") {
        const numValue = Number(localValue);
        processedValue = Number.isNaN(numValue) ? null : numValue;
      }
      // Handle text formatting
      else if (formatter) {
        processedValue = applyFormatter(localValue);
      }

      field.onChange(processedValue);
    }, debounceDelay);

    return () => {
      clearTimeout(timer);
    };
  }, [localValue, field, type, applyFormatter, debounceDelay, formatter]);

  // Sync local value with external form changes
  useEffect(() => {
    setLocalValue(field.value ?? "");
  }, [field.value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Apply formatter on blur if configured
    if (formatter && type !== "number") {
      const formatted = applyFormatter(e.target.value);
      if (formatted !== e.target.value) {
        setLocalValue(formatted);
      }
    }
    field.onBlur();
  };

  return (
    <Input
      {...inputProps}
      type={type}
      name={field.name}
      value={localValue}
      ref={field.ref}
      onChange={handleChange}
      onBlur={handleBlur}
      error={showError && fieldError ? fieldError.message : undefined}
    />
  );
};

/**
 * React Hook Form Debounced Input Component
 *
 * A wrapper around the base Input component that integrates with React Hook Form
 * and debounces the value updates. Perfect for search inputs and other scenarios
 * where you want to delay form updates until the user stops typing.
 *
 * @example
 * // Basic search input with debounce
 * <RHFDebounceInput
 *   name="searchQuery"
 *   control={control}
 *   placeholder="Search..."
 *   debounceDelay={300}
 * />
 */
export const RHFDebounceInput = <TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  showError = true,
  debounceDelay = 300,
  formatter,
  type,
  ...inputProps
}: RHFDebounceInputProps<TFieldValues>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <DebouncedInputInternal
          field={field}
          fieldError={fieldState.error}
          debounceDelay={debounceDelay}
          formatter={formatter}
          showError={showError}
          type={type}
          {...inputProps}
        />
      )}
    />
  );
};

RHFDebounceInput.displayName = "RHFDebounceInput";
