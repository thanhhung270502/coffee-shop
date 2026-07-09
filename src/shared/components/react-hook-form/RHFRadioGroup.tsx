"use client";

import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";

import { cn } from "../../utils";
import { Radio, type RadioProps } from "../radio";
import { Typography } from "../typography";

type RadioItem = {
  label: string;
  description?: string;
  value: string;
};

export interface RHFRadioGroupProps<TFieldValues extends FieldValues = FieldValues> extends Omit<
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
   * Array of radio items to render
   */
  items: RadioItem[];

  /**
   * Layout: 1 or 2 columns
   */
  columns?: 1 | 2;

  /**
   * Custom onCheckedChange handler (optional)
   */
  onCheckedChange?: (value: string) => void;

  /**
   * Custom className for the grid wrapper
   */
  wrapperClassName?: string;

  /**
   * Custom className for the outer container
   */
  className?: string;

  /**
   * Custom className for each radio item container
   */
  itemClassName?: string;

  /**
   * Label for the radio group
   */
  label?: string;

  /**
   * The size of the radio button
   * @default "sm"
   */
  size?: "sm" | "md";
}

/**
 * RHFRadioGroup - React Hook Form Radio Group for single selection
 *
 * Use this component when you need a radio group that controls a single string field.
 * Only one option can be selected at a time.
 *
 * @example
 * <RHFRadioGroup
 *   name="services_filter.current_customer"
 *   control={control}
 *   items={[
 *     { label: "Customers", value: "client" },
 *     { label: "Leads", value: "lead" },
 *     { label: "All", value: "all" },
 *   ]}
 *   columns={2}
 *   className="gap-lg"
 *   itemClassName="custom-item-class"
 * />
 */
export const RHFRadioGroup = <TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  items,
  columns = 2,
  onCheckedChange,
  wrapperClassName,
  className,
  itemClassName,
  label,
  size = "sm",
  required,
  ...radioProps
}: RHFRadioGroupProps<TFieldValues>) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={cn("gap-md flex flex-col", className)}>
      {label && (
        <Typography variant="body-md" weight="medium" color="primary">
          {label}
          {required && (
            <Typography variant="body-md" as="span" color="brand-tertiary">
              {" *"}
            </Typography>
          )}
        </Typography>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const handleChange = (itemValue: string) => {
            field.onChange(itemValue);
            onCheckedChange?.(itemValue);
          };

          const isChecked = (itemValue: string) => field.value === itemValue;

          return (
            <div
              className={cn(
                "gap-sm grid",
                columns === 1 ? "grid-cols-1" : "grid-cols-2",
                wrapperClassName
              )}
            >
              {items.map((item) => (
                <div key={item.value} className={cn(itemClassName)}>
                  <Radio
                    {...radioProps}
                    checked={isChecked(item.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleChange(item.value);
                      }
                    }}
                    label={item.label}
                    description={item.description}
                    size={size}
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

RHFRadioGroup.displayName = "RHFRadioGroup";
