"use client";

import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

import { Textarea, TextareaProps } from "../textarea";

export interface RHFTextareaProps<TFieldValues extends FieldValues = FieldValues> extends Omit<
  TextareaProps,
  "name" | "error" | "value" | "onChange" | "onBlur"
> {
  /**
   * Name of the form field. Must match a field in your form schema.
   * @example "description" | "contact.notes" | "items.0.comment"
   */
  name: Path<TFieldValues>;

  /**
   * React Hook Form control object obtained from useForm()
   */
  control: Control<TFieldValues>;

  /**
   * Whether to display validation errors below the textarea
   * @default true
   */
  showError?: boolean;
}

/**
 * React Hook Form Textarea Component
 *
 * A wrapper around the base Textarea component that integrates with React Hook Form.
 * Provides automatic validation error display and type safety.
 *
 * @example
 * // Basic textarea
 * <RHFTextarea
 *   name="description"
 *   control={control}
 *   label="Description"
 *   placeholder="Enter a description"
 * />
 *
 * @example
 * // With custom rows and validation
 * <RHFTextarea
 *   name="notes"
 *   control={control}
 *   label="Notes"
 *   rows={5}
 *   showError={false}
 * />
 */
export const RHFTextarea = <TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  showError = true,
  ...props
}: RHFTextareaProps<TFieldValues>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Textarea
          {...props}
          name={field.name}
          value={field.value ?? ""}
          ref={field.ref}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={showError && fieldState.error ? fieldState.error.message : undefined}
        />
      )}
    />
  );
};

RHFTextarea.displayName = "RHFTextarea";
