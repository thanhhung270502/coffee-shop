"use client";

import type { ComponentRef, Ref } from "react";
import React, { createContext, useContext } from "react";
import { RemoveScroll } from "react-remove-scroll";
import type {
  ActionMeta,
  ClassNamesConfig,
  ClearIndicatorProps,
  DropdownIndicatorProps,
  GroupBase,
  MultiValue,
  OnChangeValue,
  OptionProps,
  OptionsOrGroups,
  Props as ReactSelectProps,
  SingleValue,
  SingleValueProps,
} from "react-select";
import ReactSelect, { components as ReactSelectComponents } from "react-select";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowDown2, InfoCircle } from "iconsax-reactjs";

import { cn } from "@/shared/utils";

import { CloseIcon } from "./external-icons";
import { helperTextVariants, labelVariants } from "./input";

export type SelectValue = string | number;
export interface SelectOption {
  label: string;
  value: SelectValue;
  isDisabled?: boolean;
}

const SELECT_MIN_WIDTH = "min-w-[12.5rem]";

// Type definitions for custom components
type MenuProps<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
> = React.ComponentProps<typeof ReactSelectComponents.Menu<Option, IsMulti, Group>>;
type MenuListProps<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
> = React.ComponentProps<typeof ReactSelectComponents.MenuList<Option, IsMulti, Group>>;

// Context to pass scrollableContainerRef to custom components
const ScrollableContainerContext = createContext<
  React.RefObject<HTMLDivElement | null> | undefined
>(undefined);

// Custom react-select components
export const DropdownIndicator = (
  props: DropdownIndicatorProps<SelectOption, boolean, GroupBase<SelectOption>>
) => {
  return (
    <ReactSelectComponents.DropdownIndicator {...props}>
      <ArrowDown2
        size="1rem"
        className="text-tertiary transition-transform duration-150"
        variant="Bold"
      />
    </ReactSelectComponents.DropdownIndicator>
  );
};

export const IndicatorSeparator = () => {
  return null;
};

export const ClearIndicator = (
  props: ClearIndicatorProps<SelectOption, boolean, GroupBase<SelectOption>>
) => {
  return (
    <ReactSelectComponents.ClearIndicator {...props}>
      <CloseIcon size="1rem" className="text-secondary cursor-pointer" />
    </ReactSelectComponents.ClearIndicator>
  );
};

export const MenuSelect = (props: MenuProps<SelectOption, boolean, GroupBase<SelectOption>>) => {
  return <ReactSelectComponents.Menu {...props}>{props.children}</ReactSelectComponents.Menu>;
};

export const MenuListSelect = (
  props: MenuListProps<SelectOption, boolean, GroupBase<SelectOption>>
) => {
  const menuListRef = React.useRef<HTMLDivElement>(null);
  const scrollableContainerRef = useContext(ScrollableContainerContext);

  // Combine menuListRef with scrollableContainerRef for shards
  const shards = scrollableContainerRef ? [menuListRef, scrollableContainerRef] : [menuListRef];

  // For special case: Share options across multiple Select components
  // Handle scroll to bottom detection for infinite loading
  const handleScroll = React.useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.currentTarget;
      const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 10;

      if (isAtBottom && props.selectProps.onMenuScrollToBottom) {
        props.selectProps.onMenuScrollToBottom(event.nativeEvent as WheelEvent);
      }
    },
    [props.selectProps]
  );

  return (
    <RemoveScroll shards={shards}>
      <ReactSelectComponents.MenuList
        {...props}
        innerRef={menuListRef}
        innerProps={{
          ...props.innerProps,
          onScroll: handleScroll,
        }}
      >
        {props.children}
      </ReactSelectComponents.MenuList>
    </RemoveScroll>
  );
};

export const controlVariants = cva(
  [
    "relative flex items-center w-full rounded-4xl border border-solid",
    "transition-colors cursor-pointer",
  ],
  {
    variants: {
      variant: {
        default: "border-primary bg-white shadow-xs",
        destructive: "border-error bg-white shadow-xs",
        ghost: "border-transparent bg-transparent shadow-none w-12", // Used only in react-select as the leading component for the input
        text: "border-transparent bg-transparent shadow-none", // Text variant: no border, no shadow
      },
      size: {
        sm: "min-h-9 px-2xl py-lg",
        md: "min-h-12 px-2xl py-xl",
      },
      disabled: {
        true: "bg-disabled-subtle border-disabled-subtle cursor-not-allowed hover:border-disabled-subtle",
        false: "",
      },
      focused: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        focused: true,
        class: "border-brand ring-1 ring-brand-purple-500",
      },
      {
        variant: "destructive",
        focused: true,
        class: "border-error ring-1 ring-error-500",
      },
      {
        variant: "ghost",
        focused: true,
        class: "",
      },
      {
        variant: "text",
        focused: true,
        class: "",
      },
      {
        variant: "default",
        focused: false,
        disabled: false,
        class: "hover:border-secondary",
      },
      {
        variant: "destructive",
        focused: false,
        disabled: false,
        class: "hover:border-error",
      },
      {
        variant: "ghost",
        focused: false,
        disabled: false,
        class: "",
      },
      {
        variant: "text",
        focused: false,
        disabled: false,
        class: "",
      },
      {
        variant: "ghost",
        size: "sm",
        class: "!min-h-5 !px-0 !py-0",
      },
      {
        variant: "ghost",
        size: "md",
        class: "!px-0 !py-0",
      },
      {
        variant: "text",
        size: "sm",
        class: "px-md py-sm",
      },
      {
        variant: "text",
        size: "md",
        class: "px-lg py-md",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
      disabled: false,
      focused: false,
    },
  }
);

export const valueContainerVariants = cva(
  ["flex flex-wrap items-center flex-1 overflow-hidden px-0"],
  {
    variants: {
      size: {
        sm: "gap-sm",
        md: "gap-sm",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export const selectInputVariants = cva(
  ["bg-transparent border-0 outline-none", "text-primary placeholder:text-placeholder"],
  {
    variants: {
      disabled: {
        true: "text-disabled cursor-not-allowed",
        false: "",
      },
      size: {
        sm: "body-md",
        md: "body-lg",
      },
    },
    defaultVariants: {
      disabled: false,
    },
  }
);

export const placeholderVariants = cva(["text-placeholder"], {
  variants: {
    disabled: {
      true: "text-disabled",
      false: "",
    },
    size: {
      sm: ["body-md"],
      md: ["body-lg"],
    },
  },
  defaultVariants: {
    disabled: false,
  },
});

export const singleValueVariants = cva(["text-primary"], {
  variants: {
    disabled: {
      true: "text-disabled",
      false: "",
    },
    size: {
      sm: ["body-md"],
      md: ["body-lg"],
    },
    variant: {
      default: "",
      destructive: "",
      ghost: "text-center",
      text: "",
    },
  },
  defaultVariants: {
    disabled: false,
    variant: "default",
  },
});

export const multiValueVariants = cva(
  ["flex items-center gap-xs bg-primary border border-secondary rounded-4xl px-md py-xxs"],
  {
    variants: {
      size: {
        sm: "text-sm",
        md: "body-sm",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export const multiValueLabelVariants = cva(["text-secondary font-medium"], {
  variants: {
    size: {
      sm: "text-sm",
      md: "body-sm",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const multiValueRemoveVariants = cva([
  "text-secondary font-medium hover:text-primary rounded-full cursor-pointer",
]);

export const indicatorsContainerVariants = cva(["flex items-center shrink-0"], {
  variants: {
    size: {
      sm: "gap-xxs",
      md: "gap-md",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const dropdownIndicatorVariants = cva(
  ["flex items-center justify-center transition-transform duration-150", "text-tertiary"],
  {
    variants: {
      disabled: {
        true: "text-disabled",
        false: "",
      },
      menuOpen: {
        true: "rotate-180",
        false: "",
      },
    },
    defaultVariants: {
      disabled: false,
      menuOpen: false,
    },
  }
);

export const clearIndicatorVariants = cva(
  ["flex items-center justify-center text-tertiary hover:text-secondary"],
  {
    variants: {
      disabled: {
        true: "text-disabled",
        false: "",
      },
    },
    defaultVariants: {
      disabled: false,
    },
  }
);

export const menuVariants = cva([
  "absolute w-full bg-white rounded-xl border border-primary",
  "shadow-lg overflow-hidden mt-sm",
  "scrollbar-thin",
  "pointer-events-auto",
]);

export const menuListVariants = cva(
  ["max-h-48 overflow-y-auto py-sm pointer-events-auto touch-action-auto"],
  {
    variants: {
      variant: {
        default: "",
        destructive: "",
        ghost: "scrollbar-hide",
        text: "",
      },
    },
  }
);

export const optionVariants = cva(
  ["flex items-center cursor-pointer transition-colors rounded-sm", "font-medium body-md"],
  {
    variants: {
      size: {
        sm: "px-lg py-md",
        md: "px-lg py-lg",
      },
      state: {
        default: "bg-transparent text-primary",
        focused: "bg-secondary text-brand-tertiary",
        selected: "bg-secondary text-brand-tertiary",
        disabled: "bg-transparent text-disabled cursor-not-allowed",
      },
    },
    defaultVariants: {
      size: "md",
      state: "default",
    },
  }
);

export const messageVariants = cva(["text-tertiary px-lg body-md"], {
  variants: {
    size: {
      sm: "py-md",
      md: "py-lg",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

/**
 * Override react-select's inline px styles so everything scales with root font-size.
 * Even in `unstyled` mode, react-select injects inline padding/margin in px on some elements.
 */
export const selectRemStyles = {
  control: (base: Record<string, unknown>) => ({ ...base, minHeight: undefined }),
  valueContainer: (base: Record<string, unknown>) => ({ ...base, padding: undefined }),
  input: (base: Record<string, unknown>) => ({ ...base, margin: undefined, padding: undefined }),
  dropdownIndicator: (base: Record<string, unknown>) => ({ ...base, padding: undefined }),
  clearIndicator: (base: Record<string, unknown>) => ({ ...base, padding: undefined }),
  indicatorsContainer: (base: Record<string, unknown>) => ({ ...base, padding: undefined }),
  option: (base: Record<string, unknown>) => ({ ...base, padding: undefined }),
  menuList: (base: Record<string, unknown>) => ({
    ...base,
    padding: undefined,
    maxHeight: undefined,
  }),
};

export const selectWrapperVariants = cva(["w-full"], {
  variants: {
    variant: {
      default: "",
      destructive: "",
      ghost: "",
      text: "",
    },
    disabled: {
      true: "",
      false: "",
    },
    fullWidth: {
      true: "w-full",
      false: "w-auto",
    },
  },
  defaultVariants: {
    variant: "default",
    disabled: false,
    fullWidth: false,
  },
});

export interface SelectProps
  extends
    Omit<ReactSelectProps<SelectOption, boolean>, "onChange" | "value" | "defaultValue">,
    VariantProps<typeof selectWrapperVariants> {
  /**
   * The variant of the select
   * @default "default"
   */
  variant?: "default" | "destructive" | "ghost" | "text";

  /**
   * The size of the select
   * @default "md"
   */
  size?: "sm" | "md";

  /**
   * Label text for the select
   */
  label?: string;

  /**
   * ID for the select element. If not provided, will be auto-generated.
   */
  id?: string;

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
   * Helper text below the select
   */
  helperText?: string;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Selected value(s)
   */
  value?: SelectOption | SelectOption[] | null;

  /**
   * Default value(s)
   */
  defaultValue?: SelectOption | SelectOption[] | null;

  /**
   * Callback when value changes
   */
  onChange?: (
    newValue: SingleValue<SelectOption> | MultiValue<SelectOption>,
    actionMeta: ActionMeta<SelectOption>
  ) => void;

  /**
   * Whether the select is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the select should take full width
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Custom className for the wrapper
   */
  className?: string;

  /**
   * Whether to capture menu scroll events
   * @default true
   */
  captureMenuScroll?: boolean;

  /**
   * Whether the menu should scroll into view when opened
   * @default true
   */
  menuShouldScrollIntoView?: boolean;

  /**
   * Portal target for the menu
   * @default document.body
   */
  menuPortalTarget?: HTMLElement | null;

  /**
   * Menu positioning strategy
   * @default "absolute"
   */
  menuPosition?: "absolute" | "fixed";

  /**
   * Ref for the select element (React 19 style)
   */
  ref?: Ref<ComponentRef<typeof ReactSelect<SelectOption, boolean, GroupBase<SelectOption>>>>;

  /**
   * Ref to a scrollable container that should remain scrollable when the menu is open
   * Useful when the select is inside a modal/sheet that needs to scroll
   */
  scrollableContainerRef?: React.RefObject<HTMLDivElement | null>;

  /**
   * Custom class name for the single value container
   */
  singleValueClassName?: string;

  /**
   * Custom class name for the control
   */
  controlClassName?: string;

  /**
   * Custom className for the helper text / error message
   */
  helperTextClassName?: string;

  /**
   * Custom class name for the value container
   */
  valueContainerClassName?: string;
}

const Select = ({
  className,
  size = "md",
  variant = "default",
  label,
  id,
  required = false,
  showHelp = false,
  helperText,
  error,
  disabled = false,
  fullWidth = false,
  value,
  defaultValue,
  onChange,
  options = [],
  placeholder = "Select...",
  isMulti = false,
  isClearable = false,
  isSearchable = true,
  captureMenuScroll = true,
  menuShouldScrollIntoView = true,
  menuPortalTarget = typeof document !== "undefined" ? document.body : null,
  menuPosition = "fixed",
  scrollableContainerRef,
  singleValueClassName,
  controlClassName,
  helperTextClassName,
  valueContainerClassName,
  ref,
  ...props
}: SelectProps) => {
  const autoId = React.useId();
  const selectId = id || autoId;

  const hasError = !!error;
  const effectiveVariant = hasError ? "destructive" : variant;

  const getCustomClassNames = (): ClassNamesConfig<SelectOption, boolean> => {
    return {
      control: (state) =>
        cn(
          controlVariants({
            variant: effectiveVariant,
            size,
            disabled,
            focused: state?.isFocused || false,
          }),
          controlClassName
        ),
      valueContainer: () => cn(valueContainerVariants({ size }), valueContainerClassName),
      input: () => cn(selectInputVariants({ disabled, size })),
      placeholder: () => cn(placeholderVariants({ disabled, size })),
      singleValue: () => cn(singleValueVariants({ disabled, variant, size }), singleValueClassName),
      multiValue: () => cn(multiValueVariants({ size })),
      multiValueLabel: () => cn(multiValueLabelVariants({ size })),
      menuPortal: () => cn("!z-dropdown scrollbar-thin pointer-events-auto"),
      multiValueRemove: () => cn(multiValueRemoveVariants()),
      indicatorsContainer: () => cn(indicatorsContainerVariants({ size })),
      dropdownIndicator: (state: any) =>
        cn(
          dropdownIndicatorVariants({
            disabled,
            menuOpen: state?.selectProps?.menuIsOpen || false,
          })
        ),
      clearIndicator: () => cn(clearIndicatorVariants({ disabled })),
      menu: () => cn(menuVariants()),
      menuList: () => cn(menuListVariants({ variant })),
      option: (state) => {
        let optionState: "default" | "focused" | "selected" | "disabled" = "default";

        if (state?.isDisabled) {
          optionState = "disabled";
        } else if (state?.isSelected) {
          optionState = "selected";
        } else if (state?.isFocused) {
          optionState = "focused";
        }

        return cn(optionVariants({ size, state: optionState }));
      },
      noOptionsMessage: () => cn(messageVariants({ size })),
      loadingMessage: () => cn(messageVariants({ size })),
    };
  };

  return (
    <div className={cn("gap-sm flex flex-col", fullWidth ? "w-full" : "w-auto")}>
      {label && (
        <div className="gap-xxs flex flex-row items-center">
          <label htmlFor={selectId} className={labelVariants()}>
            {label}
          </label>
          {required && <span className="body-md text-brand-tertiary font-medium">*</span>}
          {showHelp && (
            <div className="ml-xs text-quaternary">
              <InfoCircle size="1rem" className="text-quaternary" />
            </div>
          )}
        </div>
      )}

      <div
        className={cn(
          selectWrapperVariants({ variant: effectiveVariant, disabled, fullWidth }),
          SELECT_MIN_WIDTH,
          className
        )}
      >
        <ScrollableContainerContext.Provider value={scrollableContainerRef}>
          <ReactSelect
            ref={ref}
            inputId={selectId}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            options={options}
            placeholder={placeholder}
            isMulti={isMulti}
            isClearable={isClearable}
            isSearchable={isSearchable}
            isDisabled={disabled}
            captureMenuScroll={captureMenuScroll}
            menuShouldScrollIntoView={menuShouldScrollIntoView}
            menuPortalTarget={menuPortalTarget}
            menuPosition={menuPosition}
            classNamePrefix="react-select"
            unstyled
            styles={selectRemStyles}
            classNames={getCustomClassNames()}
            components={{
              DropdownIndicator,
              IndicatorSeparator,
              ClearIndicator,
              Menu: MenuSelect,
              MenuList: MenuListSelect,
            }}
            {...props}
          />
        </ScrollableContainerContext.Provider>
      </div>

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

Select.displayName = "Select";

// Helpers
export const isGroupOption = (
  option: SelectOption | GroupBase<SelectOption>
): option is GroupBase<SelectOption> => {
  return "options" in option;
};

export const getOptionValue = (
  options: OptionsOrGroups<SelectOption, GroupBase<SelectOption>>,
  value: SelectValue
): SelectOption | GroupBase<SelectOption> | undefined => {
  return options.find((option) => {
    if (isGroupOption(option)) {
      return option.options.find((option) => option.value === value);
    }
    return option.value === value;
  });
};

export const getOptionsValue = (
  options: OptionsOrGroups<SelectOption, GroupBase<SelectOption>>,
  value: SelectValue | SelectValue[]
): SelectOption | SelectOption[] | undefined => {
  return Array.isArray(value)
    ? value.map((item: SelectValue) => getOptionValue(options || [], item) as SelectOption)
    : (getOptionValue(options || [], value) as SelectOption);
};

export const onSelectChange =
  (onChange: (value: SelectValue | SelectValue[]) => void) =>
  (value: SingleValue<SelectOption> | MultiValue<SelectOption>) => {
    if (Array.isArray(value)) {
      onChange(value.map((item) => item?.value as SelectValue));
    } else {
      onChange((value as SingleValue<SelectOption>)?.value as SelectValue);
    }
  };

export {
  GroupBase,
  MultiValue,
  OnChangeValue,
  OptionProps,
  ReactSelectComponents,
  Select,
  SingleValue,
  SingleValueProps,
};
