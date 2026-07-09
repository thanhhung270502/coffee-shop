"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { InfoCircle } from "iconsax-reactjs";

import { cn } from "../utils";

// Textarea wrapper variants
const textareaWrapperVariants = cva(
  ["relative w-full rounded-2xl border border-solid", "shadow-xs transition-colors"],
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
          "focus-within:border-error focus-within:ring-1 focus-within:ring-error-300",
          "hover:border-error-subtle focus-within:hover:border-error focus-within:hover:ring-1 focus-within:hover:ring-error-300",
        ],
      },
      disabled: {
        true: [
          "bg-disabled-subtle border-disabled-subtle cursor-not-allowed",
          "hover:border-disabled-subtle",
        ],
        false: "",
      },
    },
    compoundVariants: [
      {
        disabled: true,
        variant: ["default", "destructive"],
        class: [
          "bg-disabled-subtle border-disabled-subtle cursor-not-allowed",
          "hover:border-disabled-subtle",
        ],
      },
    ],
    defaultVariants: {
      variant: "default",
      disabled: false,
    },
  }
);

// Textarea element variants
const textareaVariants = cva(
  [
    "w-full bg-transparent border-0 outline-none resize-none",
    "body-md",
    "px-2xl py-xl",
    "min-h-[7.5rem]",
  ],
  {
    variants: {
      variant: {
        default: ["placeholder:text-quaternary", "text-primary"],
        destructive: ["placeholder:text-quaternary", "text-error-primary"],
      },
      disabled: {
        true: ["placeholder:text-placeholder-subtle text-placeholder-subtle cursor-not-allowed"],
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      disabled: false,
    },
  }
);

// Label variants
const labelVariants = cva(["body-md font-medium text-secondary"]);

// Helper text variants
const helperTextVariants = cva(["body-md"], {
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

export interface TextareaProps
  extends
    Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    Omit<VariantProps<typeof textareaVariants>, "disabled"> {
  /**
   * The variant of the textarea
   * @default "default"
   */
  variant?: "default" | "destructive";

  /**
   * Label text for the textarea
   */
  label?: string;

  /**
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
   * Helper text below the textarea
   */
  helperText?: string;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Whether the textarea should take full width
   * @default true
   */
  fullWidth?: boolean;

  /**
   * Ref for the textarea element (React 19 style)
   */
  ref?: React.Ref<HTMLTextAreaElement>;

  /**
   * Class name for the wrapper element
   */
  wrapperClassName?: string;

  /**
   * Style for the wrapper element
   */
  wrapperStyle?: React.CSSProperties;
}

const Textarea = ({
  className,
  variant = "default",
  label,
  required = false,
  showHelp = false,
  helperText,
  error,
  disabled = false,
  fullWidth = true,
  ref,
  id,
  wrapperClassName,
  wrapperStyle,
  ...props
}: TextareaProps) => {
  const hasError = !!error;
  const effectiveVariant = hasError ? "destructive" : variant;
  const generatedId = React.useId();
  const textareaId = id || generatedId;

  return (
    <div className={cn("gap-sm flex flex-col", fullWidth ? "w-full" : "w-auto")}>
      {/* Label */}
      {label && (
        <div className="gap-xxs flex flex-row items-center">
          <label htmlFor={textareaId} className={labelVariants()}>
            {label}
          </label>
          {required && <span className="body-md text-brand-tertiary font-medium">*</span>}
          {showHelp && (
            <div className="ml-xs text-disabled">
              <InfoCircle size="1rem" className="text-disabled" />
            </div>
          )}
        </div>
      )}

      {/* Textarea wrapper */}
      <div
        className={cn(
          textareaWrapperVariants({
            variant: effectiveVariant,
            disabled,
          }),
          fullWidth ? "w-full" : "w-auto",
          wrapperClassName
        )}
        style={wrapperStyle}
      >
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            textareaVariants({
              variant: effectiveVariant,
              disabled,
            }),
            className
          )}
          disabled={disabled}
          {...props}
        />
      </div>

      {/* Helper text or error */}
      {(helperText || error) && (
        <div className={cn(helperTextVariants({ variant: hasError ? "error" : "default" }))}>
          {error || helperText}
        </div>
      )}
    </div>
  );
};

Textarea.displayName = "Textarea";

export { Textarea };
