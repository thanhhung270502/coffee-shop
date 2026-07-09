"use client";

import { Children, cloneElement, isValidElement } from "react";
import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../utils";

const toggleGroupVariants = cva(["inline-flex items-center", "focus-visible:outline-none"], {
  variants: {
    variant: {
      "bottom-line": "gap-0",
      solid: "rounded-4xl bg-tertiary p-xxs",
    },
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
  },
  defaultVariants: {
    variant: "bottom-line",
    orientation: "horizontal",
  },
});

const toggleItemVariants = cva(
  [
    "inline-flex items-center justify-center whitespace-nowrap",
    "transition-all duration-200 ease-in-out",
    "focus-visible:outline-none focus-visible:z-10",
    "disabled:pointer-events-none disabled:opacity-50",
    "cursor-pointer select-none",
  ],
  {
    variants: {
      variant: {
        "bottom-line": [
          "relative bg-transparent text-tertiary body-md font-medium text-primary",
          "border-b-2 border-secondary",
          "px-xl py-lg",
          "hover:border-brand hover:text-brand-tertiary",
          "data-[pressed]:text-brand-tertiary data-[pressed]:border-brand",
          "disabled:text-placeholder-subtle disabled:border-secondary",
          "disabled:hover:text-placeholder-subtle disabled:hover:border-secondary",
        ],
        solid: [
          "bg-transparent text-tertiary body-md font-medium",
          "px-2xl py-md",
          "hover:bg-secondary hover:rounded-4xl hover:shadow-md",
          "focus-visible:ring-2 focus-visible:ring-brand",
          "data-[pressed]:bg-white data-[pressed]:text-primary data-[pressed]:rounded-4xl data-[pressed]:shadow-sm",
          "disabled:text-placeholder-subtle disabled:bg-transparent",
          "disabled:hover:text-placeholder-subtle disabled:hover:bg-transparent",
        ],
      },
    },
    defaultVariants: {
      variant: "bottom-line",
    },
  }
);

export interface ToggleGroupProps
  extends BaseToggleGroup.Props, VariantProps<typeof toggleGroupVariants> {
  /**
   * The visual variant of the toggle group
   * @default "bottom-line"
   */
  variant?: "bottom-line" | "solid";

  /**
   * The orientation of the toggle group
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";

  /**
   * The toggle items
   */
  children: React.ReactNode;
}

export interface ToggleGroupItemProps
  extends
    Omit<BaseToggle.Props, "className">,
    Pick<VariantProps<typeof toggleItemVariants>, "variant"> {
  /**
   * Additional CSS class name
   */
  className?: string;

  /**
   * The value that represents this toggle in the group
   */
  value: string;

  /**
   * The content of the toggle item
   */
  children: React.ReactNode;
}

const ToggleGroupRoot = ({
  className,
  variant,
  orientation,
  children,
  ...props
}: ToggleGroupProps) => (
  <BaseToggleGroup
    className={cn(toggleGroupVariants({ variant, orientation }), className)}
    orientation={orientation}
    {...props}
  >
    {Children.map(children, (child) => {
      if (isValidElement(child) && child.type === ToggleGroupItem) {
        return cloneElement(child as React.ReactElement<ToggleGroupItemProps>, {
          variant,
        });
      }
      return child;
    })}
  </BaseToggleGroup>
);

const ToggleGroupItem = ({
  className,
  variant,
  value,
  children,
  ...props
}: ToggleGroupItemProps) => (
  <BaseToggle className={cn(toggleItemVariants({ variant }), className)} value={value} {...props}>
    {children}
  </BaseToggle>
);

ToggleGroupRoot.displayName = "ToggleGroup";
ToggleGroupItem.displayName = "ToggleGroupItem";

export { toggleGroupVariants, toggleItemVariants };
export { ToggleGroupRoot as ToggleGroup, ToggleGroupItem };
