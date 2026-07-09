"use client";

import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { InfoCircle } from "iconsax-reactjs";

import { cn } from "../utils";

import { Tooltip, TooltipContent, TooltipTrigger, Typography } from ".";

const radioVariants = cva(
  [
    "relative inline-flex items-center justify-center",
    "border border-solid transition-all duration-200",
    "cursor-pointer select-none",
    "focus-visible:outline-none",
    "after:absolute after:left-1/2 after:top-1/2 after:w-[40%] after:h-[40%]",
    "after:bg-white after:rounded-full",
    "after:scale-0 after:opacity-0 after:pointer-events-none",
    "after:transition-all after:duration-[180ms] after:ease-[cubic-bezier(0.4,0,0.2,1)]",
    "after:transform after:-translate-x-1/2 after:-translate-y-1/2",
    "after:content-['']",
  ],
  {
    variants: {
      size: {
        sm: ["w-4 h-4 rounded-full"],
        md: ["w-5 h-5 rounded-full"],
      },
      state: {
        default: ["bg-white border-primary", "hover:border-secondary"],
        checked: ["bg-brand-solid border-brand-alt", "after:scale-100 after:opacity-100"],
      },
      disabled: {
        true: ["cursor-not-allowed pointer-events-none", "after:bg-placeholder-subtle"],
        false: "",
      },
      focused: {
        true: ["focus-ring-shadow-xs"],
        false: "",
      },
    },
    compoundVariants: [
      // Disabled states
      {
        disabled: true,
        state: "default",
        class: [
          "bg-secondary border-disabled-subtle",
          "hover:bg-secondary hover:border-disabled-subtle",
        ],
      },
      {
        disabled: true,
        state: "checked",
        class: [
          "bg-secondary border-disabled-subtle",
          "hover:bg-secondary hover:border-disabled-subtle",
        ],
      },
    ],
    defaultVariants: {
      size: "md",
      state: "default",
      disabled: false,
      focused: false,
    },
  }
);

// Hidden input variants
const inputVariants = cva(
  ["absolute opacity-0 w-full h-full cursor-pointer", "focus:outline-none"],
  {
    variants: {
      disabled: {
        true: "cursor-not-allowed pointer-events-none",
        false: "",
      },
    },
  }
);

// Label variants
const labelVariants = cva(
  [
    "body-md font-medium text-secondary cursor-pointer select-none",
    "transition-colors duration-200",
  ],
  {
    variants: {
      disabled: {
        true: "text-placeholder-subtle cursor-not-allowed",
        false: "",
      },
    },
    defaultVariants: {
      disabled: false,
    },
  }
);

export interface RadioProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "onChange">,
    Omit<VariantProps<typeof radioVariants>, "state" | "disabled" | "focused"> {
  /**
   * The size of the radio button
   * @default "md"
   */
  size?: "sm" | "md";

  /**
   * Whether the radio button is checked
   */
  checked?: boolean;

  /**
   * Label text for the radio button
   */
  label?: string;

  /**
   * Tooltip content for the radio button
   */
  description?: string;

  /**
   * Callback fired when the radio button state changes
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * Native onChange event handler
   */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;

  /**
   * Ref for the input element (React 19 style)
   */
  ref?: React.Ref<HTMLInputElement>;
}

export const Radio = ({
  className,
  size = "md",
  checked = false,
  label,
  description,
  disabled = false,
  onCheckedChange,
  onChange,
  ref,
  ...props
}: RadioProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  const state = checked ? "checked" : "default";

  useEffect(() => {
    if (ref && inputRef.current) {
      if (typeof ref === "function") {
        ref(inputRef.current);
      } else if (ref) {
        (ref as RefObject<HTMLInputElement>).current = inputRef.current;
      }
    }
  }, [ref]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const newChecked = event.target.checked;
    onCheckedChange?.(newChecked);
    onChange?.(event);
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    props.onFocus?.(event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    props.onBlur?.(event);
  };

  return (
    <label className="inline-flex items-center gap-2">
      <div className={cn(radioVariants({ size, state, disabled, focused }), className)}>
        <input
          ref={inputRef}
          type="radio"
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(inputVariants({ disabled }))}
          {...props}
        />
      </div>

      {/* Label */}
      {label && <span className={cn(labelVariants({ disabled }))}>{label}</span>}

      {/* Description */}
      {description && (
        <Tooltip>
          <TooltipTrigger>
            <InfoCircle size={20} />
          </TooltipTrigger>
          <TooltipContent variant="light" side="top" align="center" sideOffset={8}>
            <Typography variant="body-sm">{description}</Typography>
          </TooltipContent>
        </Tooltip>
      )}
    </label>
  );
};

Radio.displayName = "Radio";

export { radioVariants };
export type { RadioProps as RadioVariantProps };
