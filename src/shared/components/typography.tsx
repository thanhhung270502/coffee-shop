"use client";

import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../utils";

const typographyVariants = cva("", {
  variants: {
    variant: {
      "heading-xl": "heading-xl",
      "heading-lg": "heading-lg",
      "heading-md": "heading-md",
      "heading-sm": "heading-sm",
      "body-lg": "body-lg",
      "body-md": "body-md",
      "body-sm": "body-sm",
      "body-xs": "body-xs",
    },
    color: {
      primary: "text-primary",
      secondary: "text-secondary",
      tertiary: "text-tertiary",
      quaternary: "text-quaternary",
      white: "text-white",
      disabled: "text-disabled",
      placeholder: "text-placeholder",
      "placeholder-subtle": "text-placeholder-subtle",
      "brand-primary": "text-brand-primary",
      "brand-secondary": "text-brand-secondary",
      "brand-tertiary": "text-brand-tertiary",
      "brand-quaternary": "text-brand-quaternary",
      "error-primary": "text-error-primary",
      "warning-primary": "text-warning-primary",
      "success-primary": "text-success-primary",
      "blue-primary": "text-blue-primary",
      "blue-secondary": "text-blue-secondary",
      "teal-primary": "text-teal-primary",
      "teal-secondary": "text-teal-secondary",
      "secondary-hover": "text-secondary-hover",
      "tertiary-hover": "text-tertiary-hover",
    },
    weight: {
      regular: "font-regular",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    variant: "body-md",
    color: "primary",
  },
});

export type TypographyElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";

const defaultElements: Record<
  NonNullable<VariantProps<typeof typographyVariants>["variant"]>,
  TypographyElement
> = {
  "heading-xl": "h1",
  "heading-lg": "h2",
  "heading-md": "h3",
  "heading-sm": "h4",
  "body-lg": "p",
  "body-md": "p",
  "body-sm": "p",
  "body-xs": "p",
} as const;

export interface TypographyProps
  extends Omit<HTMLAttributes<HTMLElement>, "color">, VariantProps<typeof typographyVariants> {
  as?: TypographyElement;
  truncate?: boolean;
}

export const Typography = ({
  variant = "body-md",
  color = "primary",
  weight,
  as,
  truncate = false,
  className,
  ...props
}: TypographyProps) => {
  const Component = as || (variant && defaultElements[variant]) || "p";

  return (
    <Component
      className={cn(
        typographyVariants({ variant, color, weight }),
        truncate && "truncate",
        className
      )}
      {...props}
    />
  );
};
