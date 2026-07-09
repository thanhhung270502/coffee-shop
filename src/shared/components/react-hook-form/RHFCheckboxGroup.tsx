"use client";

import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";

import { cn } from "../../utils";
import { Checkbox, type CheckboxProps } from "../checkbox";
import { Typography } from "../typography";

type CheckboxItem = {
  label: string;
  value: string;
};

export interface RHFCheckboxGroupProps<TFieldValues extends FieldValues = FieldValues> extends Omit<
  CheckboxProps,
  "name" | "checked" | "onCheckedChange" | "onChange"
> {
  /**
   * Name of the form field (should be an array field)
   */
  name: Path<TFieldValues>;

  /**
   * React Hook Form control object
   */
  control: Control<TFieldValues>;

  /**
   * Array of checkbox items to render (multi mode)
   */
  items: CheckboxItem[];

  /**
   * Layout: 1 or 2 columns (only for items mode)
   */
  columns?: 1 | 2;

  /**
   * Custom onCheckedChange handler (optional)
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * Custom className for the wrapper (only for items mode)
   */
  wrapperClassName?: string;

  /**
   * Custom className for the item (only for items mode)
   */
  itemClassName?: string;

  /**
   * Label for the checkbox group
   */
  label?: string;
}

/**
 * RHFCheckboxGroup - React Hook Form Checkbox for array fields
 *
 * Use this component when you have multiple checkboxes that control a single array field.
 * Each checkbox represents one value in the array.
 * @example
 * // Multi mode: Render multiple checkboxes from items array
 * <RHFCheckboxGroup
 *   name="demographics.gender"
 *   control={control}
 *   items={[
 *     { label: "Male", value: "male" },
 *     { label: "Female", value: "female" },
 *   ]}
 *   columns={2}
 *   label="Gender"
 * />
 */
export const RHFCheckboxGroup = <TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  items,
  columns = 2,
  onCheckedChange,
  wrapperClassName,
  itemClassName,
  label,
  ...checkboxProps
}: RHFCheckboxGroupProps<TFieldValues>) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={cn("gap-sm flex flex-col")}>
      {label && (
        <Typography variant="body-md" weight="medium" color="primary">
          {label}
        </Typography>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selectedValues: string[] = Array.isArray(field.value) ? field.value : [];

          const handleChange = (itemValue: string, checked: boolean) => {
            const newValues = checked
              ? [...selectedValues, itemValue]
              : selectedValues.filter((v) => v !== itemValue);

            field.onChange(newValues);
            onCheckedChange?.(checked);
          };

          const isChecked = (itemValue: string) => selectedValues.includes(itemValue);

          return (
            <div
              className={cn(
                "gap-sm grid",
                columns === 1 ? "grid-cols-1" : "grid-cols-2",
                wrapperClassName
              )}
            >
              {items.map((item) => (
                <div
                  key={item.value}
                  className={cn(
                    "bg-primary border-secondary hover:bg-secondary gap-lg flex cursor-pointer items-center rounded-sm border px-2.5 py-2 transition-colors",
                    itemClassName
                  )}
                >
                  <Checkbox
                    {...checkboxProps}
                    checked={isChecked(item.value)}
                    onCheckedChange={(checked) => handleChange(item.value, checked)}
                    label={item.label}
                    size="sm"
                  />
                </div>
              ))}
            </div>
          );
        }}
      />
    </div>
  );
};

RHFCheckboxGroup.displayName = "RHFCheckboxGroup";
