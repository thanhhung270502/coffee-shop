import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { isValidElement } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import type { Icon, IconProps } from "iconsax-reactjs";

import { cn } from "@/shared/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "font-medium transition-all duration-200 cursor-pointer",
    "active:outline-none focus-visible:outline-none focus-visible:focus-ring-shadow-xs",
    "disabled:pointer-events-none disabled:cursor-not-allowed",
    "select-none whitespace-nowrap",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-brand-main text-white border border-brand-main",
          "hover:bg-brand-solid-hover hover:border-brand-solid-hover",
          "active:bg-brand-main active:border-brand-main",
          "disabled:bg-disabled disabled:text-placeholder-subtle disabled:border-secondary disabled:shadow-xs",
        ],
        gradient: [
          "bg-gradient-to-b from-[#aca8ff] from-[2.573%] to-[#5055ff] text-white border-0",
          "hover:from-[#706cc3] hover:from-[2.573%] hover:to-[#282dd7]",
          "active:from-[#aca8ff] active:from-[2.573%] active:to-[#5055ff]",
          "disabled:bg-disabled disabled:text-placeholder-subtle disabled:border-secondary disabled:shadow-xs",
        ],
        "secondary-gray": [
          "bg-white text-secondary border border-primary",
          "hover:bg-primary-hover hover:text-neutral-800 hover:border-primary",
          "active:bg-white active:text-secondary active:border-primary",
          "disabled:bg-disabled disabled:text-placeholder-subtle disabled:border-secondary disabled:shadow-xs",
        ],
        "secondary-color": [
          "bg-transparent text-brand-tertiary border border-brand-main",
          "hover:bg-brand-primary hover:text-brand-purple-800 hover:border-brand-main",
          "active:bg-transparent active:text-brand-tertiary active:border-brand-main",
          "disabled:bg-disabled disabled:text-placeholder-subtle disabled:border-secondary disabled:shadow-xs",
        ],
        "tertiary-gray": [
          "bg-transparent text-tertiary border-0",
          "hover:bg-secondary-hover hover:text-secondary",
          "active:bg-transparent active:text-tertiary",
          "disabled:bg-transparent disabled:text-placeholder-subtle",
        ],
        "tertiary-color": [
          "bg-transparent text-brand-tertiary border-0",
          "hover:bg-brand-primary hover:text-brand-section",
          "active:bg-transparent active:text-brand-tertiary",
          "disabled:bg-transparent disabled:text-placeholder-subtle",
        ],
        link: [
          "bg-transparent text-brand-tertiary border-0 !p-0 h-auto !rounded",
          "hover:text-brand-purple-800 hover:underline focus-visible:underline",
          "active:text-brand-tertiary",
          "disabled:text-placeholder-subtle disabled:no-underline",
        ],
        "link-gray": [
          "bg-transparent text-tertiary border-0 !p-0 h-auto !rounded",
          "hover:text-tertiary hover:underline focus-visible:underline",
          "active:text-tertiary",
          "disabled:text-placeholder-subtle disabled:no-underline",
        ],
        "destructive-primary": [
          "bg-error-solid text-white border border-error-solid",
          "hover:bg-fg-error-secondary hover:border-error",
          "active:bg-error-solid active:border-error",
          "disabled:bg-disabled disabled:text-placeholder-subtle disabled:border-secondary disabled:shadow-xs",
        ],
        "destructive-secondary": [
          "bg-white text-error-primary border border-error-subtle",
          "hover:bg-error-50 hover:text-error-primary hover:border-error-subtle",
          "active:bg-white active:border-error",
          "disabled:bg-disabled disabled:text-placeholder-subtle disabled:border-secondary disabled:shadow-xs",
        ],
        "destructive-tertiary": [
          "bg-transparent text-error-primary border-0",
          "hover:bg-error-50 hover:text-error-800",
          "active:bg-transparent active:text-error-primary",
          "disabled:bg-transparent disabled:text-placeholder-subtle",
        ],
        "destructive-link": [
          "bg-transparent text-error-primary border-0 !p-0 h-auto !rounded",
          "hover:text-error-800 hover:underline",
          "active:text-error-primary",
          "disabled:text-placeholder-subtle disabled:no-underline",
        ],
      },
      size: {
        xs: ["px-lg py-sm body-md rounded-4xl", "gap-xs"],
        sm: ["px-xl py-md body-md rounded-4xl", "gap-xs"],
        md: ["px-[0.875rem] py-lg body-md rounded-4xl", "gap-sm"],
        lg: ["px-2xl py-lg text-lg rounded-4xl", "gap-sm"],
        xl: ["px-[1.125rem] py-xl text-lg rounded-4xl", "gap-sm"],
      },
      iconOnly: {
        true: "p-0",
        false: "",
      },
    },
    compoundVariants: [
      // Icon-only size adjustments
      {
        iconOnly: true,
        size: "xs",
        class: "py-sm px-sm",
      },
      {
        iconOnly: true,
        size: "sm",
        class: "py-md !px-md",
      },
      {
        iconOnly: true,
        size: "md",
        class: "py-lg px-lg",
      },
      {
        iconOnly: true,
        size: "lg",
        class: "py-xl px-xl",
      },
      {
        iconOnly: true,
        size: "xl",
        class: "py-[0.875rem] px-[0.875rem]",
      },
      // Link variant size adjustments (no height/padding constraints)
      {
        variant: "link",
        size: "xs",
        class: "body-sm gap-sm",
      },
      {
        variant: "link",
        size: "sm",
        class: "body-sm gap-sm",
      },
      {
        variant: "link",
        size: "md",
        class: "body-md gap-sm",
      },
      {
        variant: "link",
        size: "lg",
        class: "text-base gap-sm",
      },
      {
        variant: "link",
        size: "xl",
        class: "text-base gap-sm",
      },
      // Link gray variant size adjustments
      {
        variant: "link-gray",
        size: "xs",
        class: "body-sm gap-sm",
      },
      {
        variant: "link-gray",
        size: "sm",
        class: "body-sm gap-sm",
      },
      {
        variant: "link-gray",
        size: "md",
        class: "body-sm gap-sm",
      },
      {
        variant: "link-gray",
        size: "lg",
        class: "text-base gap-sm",
      },
      {
        variant: "link-gray",
        size: "xl",
        class: "text-base gap-sm",
      },
      // Destructive link variant size adjustments
      {
        variant: "destructive-link",
        size: "xs",
        class: "body-sm gap-sm",
      },
      {
        variant: "destructive-link",
        size: "sm",
        class: "body-sm gap-sm",
      },
      {
        variant: "destructive-link",
        size: "md",
        class: "body-sm gap-sm",
      },
      {
        variant: "destructive-link",
        size: "lg",
        class: "text-base gap-sm",
      },
      {
        variant: "destructive-link",
        size: "xl",
        class: "text-base gap-sm",
      },
      // Destructive variants focus ring override
      {
        variant: [
          "destructive-primary",
          "destructive-secondary",
          "destructive-tertiary",
          "destructive-link",
        ],
        class: "focus-visible:focus-ring-error-shadow-xs",
      },
      // Destructive tertiary focus background override
      {
        variant: "destructive-tertiary",
        class: "active:bg-white",
      },
      {
        variant: ["link", "link-gray", "destructive-link"],
        class: "rounded",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
      iconOnly: false,
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /**
   * If true, only renders the icon without text
   */
  iconOnly?: boolean;
  /**
   * Icon to display at the start (left) of the button
   */
  startIcon?: Icon | ReactNode;
  /**
   * Icon to display at the end (right) of the button
   */
  endIcon?: Icon | ReactNode;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Loading icon/spinner
   */
  loadingIcon?: Icon;
  /**
   * Icon variant
   */
  iconVariant?: IconProps["variant"];
}

const getIconSize = (size: "xs" | "sm" | "md" | "lg" | "xl", iconOnly: boolean) => {
  if (!iconOnly) {
    return "1.04rem";
  }

  switch (size) {
    case "xs":
    case "sm":
    case "md":
    case "lg":
    case "xl":
    default:
      return "1.25rem";
  }
};

const renderIcon = (
  IconComponent: Icon | ReactNode,
  size: "xs" | "sm" | "md" | "lg" | "xl",
  variantIcon: IconProps["variant"],
  iconOnly: boolean
) => {
  const iconSize = getIconSize(size, iconOnly);
  if (isValidElement(IconComponent)) {
    return IconComponent;
  }

  const Icon = IconComponent as Icon;
  return <Icon size={iconSize} variant={variantIcon} color="currentColor" />;
};

const LoadingSpinner = ({ size = "sm" }: { size?: "xs" | "sm" | "md" | "lg" | "xl" }) => {
  const sizeClasses = {
    xs: "size-5",
    sm: "size-5",
    md: "size-5",
    lg: "size-5",
    xl: "size-5",
  };

  return (
    <svg
      className={cn("animate-spin", sizeClasses[size])}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

export const Button = ({
  className,
  variant,
  size,
  iconOnly = false,
  startIcon,
  endIcon,
  loading = false,
  loadingIcon,
  children,
  disabled,
  ref,
  iconVariant = "Linear",
  ...props
}: ButtonProps & { ref?: Ref<HTMLButtonElement> }) => {
  const isDisabled = disabled || loading;
  const buttonSize = size || "md";
  const hasText = !iconOnly && children;
  const iconOnlyIcon = iconOnly ? startIcon || endIcon : null;
  const showLoadingIcon =
    loading &&
    (loadingIcon ? (
      renderIcon(loadingIcon, buttonSize, iconVariant, iconOnly)
    ) : (
      <LoadingSpinner size={buttonSize} />
    ));

  return (
    <button
      className={cn(buttonVariants({ variant, size, iconOnly }), className)}
      ref={ref}
      disabled={isDisabled}
      {...props}
    >
      {showLoadingIcon}

      {!loading &&
        !iconOnly &&
        startIcon &&
        renderIcon(startIcon, buttonSize, iconVariant, iconOnly)}

      {hasText && children}

      {!loading && !iconOnly && endIcon && renderIcon(endIcon, buttonSize, iconVariant, iconOnly)}

      {!loading &&
        iconOnly &&
        iconOnlyIcon &&
        renderIcon(iconOnlyIcon, buttonSize, iconVariant, iconOnly)}
    </button>
  );
};

Button.displayName = "Button";

export { buttonVariants };
export type { ButtonProps as ButtonVariantProps };
