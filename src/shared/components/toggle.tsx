"use client";

import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../utils";

const TOGGLE_INPUT_MIN_WIDTH_SM = "min-w-[2rem]";
const TOGGLE_INPUT_MIN_WIDTH_MD = "min-w-[2.5rem]";

const toggleVariants = cva(
  [
    "relative w-fit inline-flex items-center cursor-pointer select-none",
    "transition-all duration-200 ease-in-out",
    "focus-visible:outline-none",
    "disabled:cursor-not-allowed disabled:pointer-events-none",
  ],
  {
    variants: {
      size: {
        sm: "gap-2",
        md: "gap-3",
      },
      state: {
        default: "",
        active: "",
      },
      disabled: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        disabled: true,
        class: "opacity-50",
      },
    ],
    defaultVariants: {
      size: "md",
      state: "default",
      disabled: false,
    },
  }
);

const toggleInputVariants = cva(
  [
    "relative appearance-none transition-all duration-200 ease-in-out",
    "rounded-3xl cursor-pointer",
    // Thumb pseudo-element
    "after:absolute after:transition-all after:duration-200 after:ease-in-out",
    "after:bg-white after:rounded-3xl",
    "after:content-['']",
    "focus:outline-none",
  ],
  {
    variants: {
      size: {
        sm: [
          "w-8 h-5 p-[2px]",
          TOGGLE_INPUT_MIN_WIDTH_SM,
          "after:w-4 after:h-4",
          "after:translate-x-0",
        ],
        md: [
          "w-10 h-6 p-[2px]",
          TOGGLE_INPUT_MIN_WIDTH_MD,
          "after:w-5 after:h-5",
          "after:translate-x-0",
        ],
      },
      state: {
        default: ["bg-tertiary"],
        active: ["bg-brand-solid", "hover:bg-brand-solid-hover"],
      },
      disabled: {
        true: ["bg-fg-disabled", "after:bg-tertiary", "cursor-not-allowed", "after-shadow-md"],
        false: ["after:shadow-sm"],
      },
      focused: {
        true: "focus-ring-shadow-xs",
        false: "",
      },
    },
    compoundVariants: [
      // Active state thumb positioning
      // Small: 32px track - 4px padding = 28px available, thumb 16px = 12px movement
      {
        size: "sm",
        state: "active",
        class: "after:translate-x-3",
      },
      // Medium: 40px track - 4px padding = 36px available, thumb 20px = 16px movement
      {
        size: "md",
        state: "active",
        class: "after:translate-x-4",
      },
      // Disabled states
      {
        disabled: true,
        state: "default",
        class: ["bg-fg-disabled", "hover:bg-fg-disabled"],
      },
      {
        disabled: true,
        state: "active",
        class: ["bg-fg-disabled", "hover:bg-fg-disabled"],
      },
      {
        disabled: true,
        size: "sm",
        state: "active",
        class: "after:translate-x-3",
      },
      {
        disabled: true,
        size: "md",
        state: "active",
        class: "after:translate-x-4",
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

export interface ToggleProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "onChange">,
    Omit<VariantProps<typeof toggleVariants>, "state" | "disabled"> {
  /**
   * The size of the toggle
   * @default "md"
   */
  size?: "sm" | "md";

  /**
   * Whether the toggle is checked/active
   */
  checked?: boolean;

  /**
   * Default checked state (uncontrolled)
   */
  defaultChecked?: boolean;

  /**
   * Label text for the toggle
   */
  label?: string;

  /**
   * Callback fired when the toggle state changes
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

export const Toggle = ({
  className,
  size = "md",
  checked: controlledChecked,
  defaultChecked = false,
  label,
  disabled = false,
  onCheckedChange,
  onChange,
  ref,
  ...props
}: ToggleProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const [focused, setFocused] = useState(false);

  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;
  const state = checked ? "active" : "default";

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

    // Update internal state if uncontrolled
    if (!isControlled) {
      setInternalChecked(newChecked);
    }

    // Call external handlers
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
    <label className={cn(toggleVariants({ size, state, disabled }), className)}>
      {/* Toggle Input with thumb as pseudo-element */}
      <input
        ref={inputRef}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn(toggleInputVariants({ size, state, disabled, focused }))}
        {...props}
      />

      {/* Label */}
      {label && <span className={cn(labelVariants({ disabled }))}>{label}</span>}
    </label>
  );
};

Toggle.displayName = "Toggle";

export { toggleVariants };
export type { ToggleProps as ToggleVariantProps };
