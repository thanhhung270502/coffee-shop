"use client";

import { createContext, type RefObject, useContext, useEffect, useRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../utils";

import { Radio, type RadioProps } from "./radio";

// Radio Group Context
interface RadioGroupContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  size?: "sm" | "md";
}

const RadioGroupContext = createContext<RadioGroupContextValue>({});

// Radio Group Item Component
interface RadioGroupItemProps extends Omit<RadioProps, "checked" | "onCheckedChange" | "name"> {
  value: string;
}

const RadioGroupItem = ({
  value,
  label,
  disabled,
  size,
  className,
  ...props
}: RadioGroupItemProps) => {
  const context = useContext(RadioGroupContext);
  const isChecked = context.value === value;
  const isDisabled = disabled || context.disabled;

  const handleCheckedChange = (checked: boolean) => {
    if (checked && context.onValueChange) {
      context.onValueChange(value);
    }
  };

  return (
    <Radio
      {...props}
      name={context.name}
      checked={isChecked}
      disabled={isDisabled}
      size={size || context.size}
      label={label}
      onCheckedChange={handleCheckedChange}
      className={className}
    />
  );
};

// Radio Group Container Variants
const radioGroupVariants = cva(["flex items-center gap-4"], {
  variants: {
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col items-start",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

// Radio Group Props
export interface RadioGroupProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof radioGroupVariants> {
  /**
   * The value of the selected radio button
   */
  value?: string;

  /**
   * Callback fired when the selected value changes
   */
  onValueChange?: (value: string) => void;

  /**
   * The name attribute for the radio group
   */
  name?: string;

  /**
   * Whether all radio buttons in the group are disabled
   */
  disabled?: boolean;

  /**
   * The size of all radio buttons in the group
   */
  size?: "sm" | "md";

  /**
   * The orientation of the radio group
   */
  orientation?: "horizontal" | "vertical";

  /**
   * Ref for the container element
   */
  ref?: React.Ref<HTMLDivElement>;
}

export const RadioGroup = ({
  className,
  value,
  onValueChange,
  name,
  disabled = false,
  size = "md",
  orientation = "horizontal",
  children,
  ref,
  ...props
}: RadioGroupProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref && containerRef.current) {
      if (typeof ref === "function") {
        ref(containerRef.current);
      } else if (ref) {
        (ref as RefObject<HTMLDivElement>).current = containerRef.current;
      }
    }
  }, [ref]);

  const contextValue: RadioGroupContextValue = {
    value,
    onValueChange,
    name,
    disabled,
    size,
  };

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        className={cn(radioGroupVariants({ orientation }), className)}
        role="radiogroup"
        {...props}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

RadioGroup.displayName = "RadioGroup";
RadioGroupItem.displayName = "RadioGroupItem";

// Export the components
export { RadioGroupItem };
export { radioGroupVariants };
export type { RadioGroupProps as RadioGroupVariantProps };
