"use client";

import React from "react";
import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";

import { Toggle, type ToggleProps } from "../toggle";

export interface RHFToggleProps<TFieldValues extends FieldValues = FieldValues> extends Omit<
  ToggleProps,
  "name" | "checked" | "defaultChecked" | "onCheckedChange" | "onChange"
> {
  /**
   * Name of the form field
   */
  name: Path<TFieldValues>;

  /**
   * React Hook Form control object
   */
  control: Control<TFieldValues>;

  /**
   * Custom onCheckedChange handler (optional)
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * Native onChange handler (optional)
   */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export const RHFToggle = <TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  onCheckedChange,
  onChange,
  ...toggleProps
}: RHFToggleProps<TFieldValues>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Toggle
          {...toggleProps}
          checked={field.value}
          onCheckedChange={(checked) => {
            field.onChange(checked);
            onCheckedChange?.(checked);
          }}
          onChange={(event) => {
            field.onChange(event.target.checked);
            onChange?.(event);
          }}
        />
      )}
    />
  );
};

RHFToggle.displayName = "RHFToggle";
