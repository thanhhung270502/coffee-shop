"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../utils";

import { Typography } from "./typography";

const baseDateVariants = cva(
  [
    "relative",
    "flex",
    "items-center",
    "justify-center",
    "size-10",
    "rounded-4xl",
    "p-xs",
    "font-medium",
    "text-md",
    "leading-lg",
    "transition-all",
    "duration-200",
    "cursor-pointer",
    "select-none",
  ],
  {
    variants: {
      state: {
        Default: ["bg-white", "text-primary", "border", "border-solid", "border-secondary"],
        Hover: ["bg-brand-primary", "text-brand-tertiary", "border-transparent"],
        Active: ["bg-brand-solid", "text-white", "border-transparent"],
        Range: ["bg-brand-solid", "text-white", "border-transparent"],
        Disable: [
          "bg-white",
          "text-disabled",
          "border-transparent",
          "cursor-not-allowed",
          "pointer-events-none",
        ],
        Inactive: [
          "bg-disabled-subtle",
          "text-placeholder-subtle",
          "border-transparent",
          "cursor-not-allowed",
          "pointer-events-none",
        ],
      },
    },
    defaultVariants: {
      state: "Default",
    },
  }
);

const dotVariants = cva(
  ["absolute", "size-1", "rounded-full", "top-7.5", "left-1/2", "-translate-x-1/2"],
  {
    variants: {
      state: {
        Default: "bg-brand-solid",
        Hover: "bg-brand-solid",
        Active: "bg-white",
        Range: "bg-white",
        Disable: "bg-disabled",
        Inactive: "bg-placeholder-subtle",
      },
    },
    defaultVariants: {
      state: "Default",
    },
  }
);

export interface BaseDateProps extends VariantProps<typeof baseDateVariants> {
  date: string | number;
  dot?: boolean;
  state?: "Default" | "Hover" | "Active" | "Range" | "Disable" | "Inactive";
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  disabled?: boolean;
  className?: string;
}

export const BaseDate = ({
  date,
  dot = false,
  state = "Default",
  onClick,
  onMouseEnter,
  onMouseLeave,
  disabled = false,
  className,
}: BaseDateProps) => {
  const isDisabled = disabled || state === "Disable" || state === "Inactive";

  const handleClick = () => {
    if (!isDisabled && onClick) {
      onClick();
    }
  };

  return (
    <div
      className={cn(baseDateVariants({ state }), className)}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-disabled={isDisabled}
      aria-label={`Date ${date}`}
      aria-hidden="true"
    >
      <Typography variant="body-lg" weight="medium" className="relative z-10 text-inherit">
        {date}
      </Typography>

      {dot && <div className={dotVariants({ state })} aria-hidden="true" />}
    </div>
  );
};

BaseDate.displayName = "BaseDate";
