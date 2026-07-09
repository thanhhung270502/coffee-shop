"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import type { Icon } from "iconsax-reactjs";
import { InfoCircle } from "iconsax-reactjs";

import { cn } from "../utils";

import { CloseIcon } from ".";

export const formatNumberWithCommas = (value: string): string => {
  if (!value) return "";
  const cleanValue = value.replace(/,/g, "");
  const parts = cleanValue.split(".");
  const integerPart = parts[0];
  if (!integerPart) return "";
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (parts.length > 1) {
    return `${formattedInteger}.${parts[1]}`;
  }
  return formattedInteger;
};

export const unformatNumber = (value: string): string => {
  return value.replace(/,/g, "");
};

export const isValidNumberInput = (value: string): boolean => {
  if (!value) return true;
  return /^-?\d*\.?\d*$/.test(value);
};

const renderIcon = (IconComponent: Icon) => {
  return <IconComponent size="1.25rem" />;
};

const inputWrapperVariants = cva(
  [
    "relative flex items-center gap-md w-full rounded-4xl border border-solid",
    "shadow-xs transition-colors",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-white border-primary",
          "focus-within:border-brand focus-within:ring-1 focus-within:ring-brand-purple-500",
          "hover:border-primary focus-within:hover:border-brand focus-within:hover:ring-1 focus-within:hover:ring-brand-purple-500",
        ],
        destructive: [
          "bg-white border-error-subtle",
          "focus-within:border-error focus-within:ring-1 focus-within:ring-error-500",
          "hover:border-error-subtle focus-within:hover:border-error focus-within:hover:ring-1 focus-within:hover:ring-error-500",
        ],
      },
      disabled: {
        true: ["bg-neutral-50 border-neutral-200 cursor-not-allowed", "hover:border-neutral-200"],
        false: "",
      },
      hasLeadingText: {
        true: [
          "flex flex-row justify-start p-0 !gap-0",
          "focus-within:border-primary focus-within:ring-0",
          "hover:border-primary",
        ],
        false: "",
      },
      hasTrailingText: {
        true: ["!py-0 !pr-0 !gap-0"],
        false: "",
      },
      size: {
        sm: "px-2xl py-lg",
        md: "px-2xl py-xl",
      },
    },
    compoundVariants: [
      {
        disabled: true,
        variant: ["default", "destructive"],
        class: ["bg-neutral-50 border-neutral-200 cursor-not-allowed", "hover:border-neutral-200"],
      },
      {
        hasLeadingText: true,
        variant: "destructive",
        class:
          "focus-within:hover:ring-0 border-error hover:border-error focus-within:hover:border-error",
      },
      {
        hasLeadingText: true,
        variant: "default",
        class:
          "focus-within:hover:ring-0 border-primary hover:border-primary focus-within:hover:border-primary",
      },
      {
        hasLeadingText: true,
        size: ["sm", "md"],
        class: "!p-0",
      },
    ],
    defaultVariants: {
      variant: "default",
      disabled: false,
      hasLeadingText: false,
      size: "md",
    },
  }
);

export const addOnTextVariants = cva(
  [
    "box-border content-stretch flex flex-row items-center justify-start min-h-full max-w-15",
    "relative shrink-0",
  ],
  {
    variants: {
      variant: {
        default: "text-tertiary",
        destructive: "text-tertiary",
      },
      size: {
        sm: "px-lg py-lg body-sm",
        md: "px-[0.875rem] py-xl body-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

const textInputAreaVariants = cva(
  [
    "basis-0 bg-white grow min-h-px min-w-px relative",
    "self-stretch shrink-0 rounded-r-4xl border-l focus-within:border-l-0",
  ],
  {
    variants: {
      variant: {
        default: [
          "border-primary",
          "focus-within:border-primary focus-within:ring-2 focus-within:ring-brand-purple-500",
        ],
        destructive: [
          "border-error-subtle",
          "focus-within:border-error focus-within:ring-2 focus-within:ring-error-500",
        ],
      },
      size: {
        sm: "px-2xl py-lg",
        md: "px-2xl py-xl",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

export const inputVariants = cva(["w-full bg-transparent border-0 outline-none"], {
  variants: {
    size: {
      sm: ["body-sm"],
      md: ["body-md"],
    },
    variant: {
      default: ["placeholder:text-quaternary", "text-primary"],
      destructive: ["placeholder:text-quaternary", "text-error-primary"],
    },
    disabled: {
      true: ["placeholder:text-placeholder-subtle text-placeholder-subtle cursor-not-allowed"],
      false: "",
    },
    hasLeadingElement: {
      true: "",
      false: "",
    },
    hasTrailingElement: {
      true: "",
      false: "",
    },
    hasLeadingText: {
      true: ["h-full"],
      false: "",
    },
  },
  compoundVariants: [
    {
      size: "sm",
      hasLeadingElement: true,
      hasLeadingText: false,
      class: "pl-0",
    },
    {
      size: "md",
      hasLeadingElement: true,
      hasLeadingText: false,
      class: "pl-0",
    },
    {
      size: "sm",
      hasTrailingElement: true,
      class: "pr-0",
    },
    {
      size: "md",
      hasTrailingElement: true,
      class: "pr-0",
    },
    {
      size: "sm",
      hasLeadingText: true,
      class: "",
    },
    {
      size: "md",
      hasLeadingText: true,
      class: "",
    },
  ],
  defaultVariants: {
    size: "md",
    variant: "default",
    disabled: false,
    hasLeadingElement: false,
    hasTrailingElement: false,
    hasLeadingText: false,
  },
});

export const elementVariants = cva(["flex items-center justify-center"], {
  variants: {
    position: {
      leading: "relative shrink-0",
      trailing: "relative shrink-0",
    },
    size: {
      sm: "size-5", // 20px
      md: "size-5", // 20px
    },
    variant: {
      default: "text-tertiary",
      destructive: "text-error-primary",
    },
    disabled: {
      true: "text-neutral-300",
      false: "",
    },
  },
  defaultVariants: {
    position: "leading",
    size: "md",
    variant: "default",
    disabled: false,
  },
});

export const labelVariants = cva(["body-sm font-medium text-secondary"]);

export const helperTextVariants = cva(["body-sm"], {
  variants: {
    variant: {
      default: "text-tertiary",
      error: "text-error-primary",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    Omit<VariantProps<typeof inputVariants>, "disabled"> {
  /**
   * The variant of the input
   * @default "default"
   */
  variant?: "default" | "destructive";

  /**
   * Label text for the input
   */
  label?: string;

  /**
   * ID for the input element. If not provided, will be auto-generated.
   */
  id?: string;

  /**
   *
   * Whether the field is required
   * @default false
   */
  required?: boolean;

  /**
   * Whether to show help icon next to label
   * @default false
   */
  showHelp?: boolean;

  /**
   * Helper text below the input
   */
  helperText?: string;

  /**
   * Leading icon component
   */
  leadingIcon?: Icon;

  /**
   * Trailing icon component
   */
  trailingIcon?: Icon;

  /**
   * Leading text or element
   */
  leadingText?: React.ReactNode;

  /**
   * Trailing text or element
   */
  trailingText?: React.ReactNode;

  /**
   * Leading dropdown component
   */
  leadingDropdown?: React.ReactNode;

  /**
   * Trailing dropdown component
   */
  trailingDropdown?: React.ReactNode;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Whether the input should take full width
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Class name for the container
   */
  containerClassName?: string;

  /**
   * Whether the input should be clearable
   * @default false
   */
  isClearable?: boolean;

  /**
   * Ref for the input element (React 19 style)
   */
  ref?: React.Ref<HTMLInputElement>;

  /**
   * Custom className for the leading element
   */
  leadingClassName?: string;

  /**
   * Custom className for the wrapper element
   */
  wrapperClassName?: string;

  /**
   * Custom className for the helper text / error message
   */
  helperTextClassName?: string;

  /**
   * Whether to format numbers with thousands separators (commas)
   * When enabled, displays numbers like "10,000.50" while maintaining the raw value
   * @default false
   */
  formatNumber?: boolean;
}

const Input = ({
  className,
  containerClassName,
  size = "md",
  variant = "default",
  label,
  id,
  required = false,
  showHelp = false,
  helperText,
  leadingIcon,
  trailingIcon,
  leadingText,
  trailingText,
  leadingDropdown,
  trailingDropdown,
  error,
  disabled = false,
  fullWidth = false,
  ref,
  isClearable = false,
  leadingClassName,
  wrapperClassName,
  helperTextClassName,
  formatNumber = false,
  ...props
}: InputProps) => {
  const autoId = useId();
  const inputId = id || autoId;
  const inputRef = useRef<HTMLInputElement>(null);

  const [displayValue, setDisplayValue] = useState<string>(() => {
    if (formatNumber && props.value !== undefined) {
      return formatNumberWithCommas(String(props.value));
    }
    return "";
  });

  useEffect(() => {
    if (formatNumber && props.value !== undefined) {
      const formattedValue = formatNumberWithCommas(String(props.value));
      setDisplayValue(formattedValue);
    }
  }, [formatNumber, props.value]);

  const hasError = !!error;
  const effectiveVariant = hasError ? "destructive" : variant;

  const hasLeadingElement = !!(leadingIcon || leadingText || leadingDropdown);
  const hasTrailingElement = !!(trailingIcon || trailingText || trailingDropdown);

  const handleClear = () => {
    if (!inputRef.current) return;
    const nativeInputSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    )?.set;

    if (!nativeInputSetter) return;
    nativeInputSetter.call(inputRef.current, "");
    const event = new Event("input", { bubbles: true });
    inputRef.current.dispatchEvent(event);
    inputRef.current.focus();
  };

  const setInputRef = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  const { onChange } = props;

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = unformatNumber(e.target.value);

    if (!isValidNumberInput(rawValue)) {
      return;
    }

    setDisplayValue(formatNumberWithCommas(rawValue));

    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: rawValue,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange?.(syntheticEvent);
  };

  const getInputValue = () => {
    if (!formatNumber) {
      return props.value;
    }
    return displayValue;
  };

  const getInputProps = () => {
    if (formatNumber) {
      return {
        ...props,
        type: "text" as const,
        inputMode: "decimal" as const,
        value: getInputValue(),
        onChange: handleNumberChange,
      };
    }
    return props;
  };

  return (
    <div
      className={cn("gap-sm flex flex-col", fullWidth ? "w-full" : "w-auto", containerClassName)}
    >
      {label && (
        <div className="gap-xxs flex flex-row items-center">
          <label htmlFor={inputId} className={labelVariants()}>
            {label}
          </label>
          {required && <span className="body-sm text-brand-tertiary font-medium">*</span>}
          {showHelp && (
            <div className="ml-xs text-quaternary">
              <InfoCircle size="1rem" className="text-quaternary" />
            </div>
          )}
        </div>
      )}

      <div
        className={cn(
          inputWrapperVariants({
            variant: effectiveVariant,
            disabled,
            hasLeadingText: !!leadingText || !!leadingDropdown,
            hasTrailingText: !!trailingText || !!trailingDropdown,
            size,
          }),
          fullWidth ? "w-full" : "w-auto",
          wrapperClassName
        )}
      >
        {leadingText && (
          <div
            className={cn(addOnTextVariants({ variant: effectiveVariant, size }), leadingClassName)}
          >
            {leadingText}
          </div>
        )}

        {leadingIcon && (
          <div
            className={cn(
              elementVariants({
                position: "leading",
                size,
                variant: effectiveVariant,
                disabled,
              }),
              leadingClassName
            )}
          >
            {renderIcon(leadingIcon)}
          </div>
        )}

        {leadingDropdown && (
          <div
            className={cn(
              addOnTextVariants({
                size,
                variant: effectiveVariant,
              }),
              leadingClassName
            )}
          >
            {leadingDropdown}
          </div>
        )}

        {/* Input */}
        {leadingText ? (
          <div className={cn(textInputAreaVariants({ size, variant: effectiveVariant }))}>
            <input
              id={inputId}
              ref={setInputRef}
              className={cn(
                inputVariants({
                  size,
                  variant: effectiveVariant,
                  disabled,
                  hasLeadingElement: false,
                  hasTrailingElement,
                  hasLeadingText: true,
                }),
                className
              )}
              disabled={disabled}
              {...getInputProps()}
            />
          </div>
        ) : (
          <input
            id={inputId}
            ref={setInputRef}
            className={cn(
              inputVariants({
                size,
                variant: effectiveVariant,
                disabled,
                hasLeadingElement,
                hasTrailingElement,
                hasLeadingText: false,
              }),
              className
            )}
            disabled={disabled}
            {...getInputProps()}
          />
        )}

        {/* Trailing Elements */}
        {trailingIcon && (
          <div
            className={cn(
              elementVariants({
                position: "trailing",
                size,
                variant: effectiveVariant,
                disabled,
              })
            )}
          >
            {renderIcon(trailingIcon)}
          </div>
        )}

        {trailingText && (
          <div
            className={cn(addOnTextVariants({ variant: effectiveVariant, size }), leadingClassName)}
          >
            {trailingText}
          </div>
        )}

        {trailingDropdown && (
          <div
            className={cn(
              addOnTextVariants({
                size,
                variant: effectiveVariant,
              }),
              leadingClassName
            )}
          >
            {trailingDropdown}
          </div>
        )}

        {isClearable && !!inputRef.current?.value && (
          <div
            className="ml-xs cursor-pointer"
            role="button"
            aria-label="Clear input"
            aria-hidden="true"
            onClick={handleClear}
          >
            <CloseIcon size="1rem" className="text-quaternary hover:text-secondary" />
          </div>
        )}
      </div>

      {/* Helper text or error */}
      {(helperText || error) && (
        <div
          className={cn(
            helperTextVariants({ variant: hasError ? "error" : "default" }),
            helperTextClassName
          )}
        >
          {error || helperText}
        </div>
      )}
    </div>
  );
};

Input.displayName = "Input";

export { Input };
