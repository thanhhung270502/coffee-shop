"use client";

import React from "react";
import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";

import { Radio, type RadioProps } from "../radio";

export interface RHFRadioProps<TFieldValues extends FieldValues = FieldValues> extends Omit<
  RadioProps,
  "name" | "checked" | "onCheckedChange" | "onChange"
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
   * Value for this radio option
   */
  value: string | number;

  /**
   * Custom onCheckedChange handler (optional)
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * Native onChange handler (optional)
   */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export const RHFRadio = <TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  value,
  onCheckedChange,
  onChange,
  ...radioProps
}: RHFRadioProps<TFieldValues>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Radio
          {...radioProps}
          value={value}
          checked={field.value === value}
          onCheckedChange={(checked) => {
            if (checked) {
              field.onChange(value);
            }
            onCheckedChange?.(checked);
          }}
          onChange={(event) => {
            if (event.target.checked) {
              field.onChange(value);
            }
            onChange?.(event);
          }}
        />
      )}
    />
  );
};

RHFRadio.displayName = "RHFRadio";
