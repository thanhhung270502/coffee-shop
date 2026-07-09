"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { cva } from "class-variance-authority";
import { Calendar, InfoCircle } from "iconsax-reactjs";

import { useSmaller } from "../hooks";
import { clampNumber, cn, padNumber } from "../utils";
import { createDateFromSegments, isDateAfter, isDateBefore, isSameDate } from "../utils";

import { Button } from "./button";
import { DatePicker } from "./date-picker";
import { CloseIcon } from "./external-icons";
import { helperTextVariants, inputVariants, labelVariants } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import { Typography } from "./typography";

export type DateInputProps = {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  variant?: "default" | "destructive";
  size?: "sm" | "md";
  fullWidth?: boolean;
  className?: string;
  containerClassName?: string;
  minDate?: Date | null;
  maxDate?: Date | null;
  disabledDates?: Date[];
  dateFormat?: "dd/MM/yyyy" | "MM/dd/yyyy";
  showCalendar?: boolean;
  showInfoIcon?: boolean;
  isClearable?: boolean;
  helperTextClassName?: string;
};

type SegmentKey = "day" | "month" | "year";

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

export const DateInput = ({
  value = null,
  onChange,
  label,
  helperText,
  error,
  required = false,
  disabled = false,
  variant = "default",
  size = "md",
  fullWidth = false,
  className,
  containerClassName,
  minDate = null,
  maxDate = null,
  disabledDates = [],
  dateFormat = "MM/dd/yyyy",
  showCalendar = true,
  showInfoIcon = false,
  isClearable = false,
  helperTextClassName,
}: DateInputProps) => {
  const autoId = useId();
  const inputId = autoId;

  const [day, setDay] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const isMobile = useSmaller("sm");

  const dayRef = useRef<HTMLInputElement | null>(null);
  const monthRef = useRef<HTMLInputElement | null>(null);
  const yearRef = useRef<HTMLInputElement | null>(null);

  const hasError = !!error;
  const effectiveVariant = hasError ? "destructive" : variant;

  const segments = useMemo(() => {
    return dateFormat === "MM/dd/yyyy"
      ? (["month", "day", "year"] as SegmentKey[])
      : (["day", "month", "year"] as SegmentKey[]);
  }, [dateFormat]);

  const handleGetNextSegmentKey = (segment: SegmentKey) => {
    const currentIndex = segments.findIndex((s) => s === segment);
    // Wrap to first segment when reaching the end
    const nextIndex = (currentIndex + 1) % segments.length;
    return segments[nextIndex];
  };

  const handleGetPreviousSegmentKey = (segment: SegmentKey) => {
    const currentIndex = segments.findIndex((s) => s === segment);
    // Wrap to last segment when going before the first (handles negative indices)
    const previousIndex = (currentIndex - 1 + segments.length) % segments.length;
    return segments[previousIndex];
  };

  const focusSegment = (key: SegmentKey) => {
    const map: Record<SegmentKey, React.RefObject<HTMLInputElement | null>> = {
      day: dayRef,
      month: monthRef,
      year: yearRef,
    };
    map[key].current?.focus();
    map[key].current?.select();
  };

  const setFromDate = (date: Date | null) => {
    if (!date) {
      setDay("");
      setMonth("");
      setYear("");
      return;
    }
    setDay(padNumber(date.getDate().toString(), 2));
    setMonth(padNumber((date.getMonth() + 1).toString(), 2));
    setYear(padNumber(date.getFullYear().toString(), 4));
  };

  useEffect(() => {
    setFromDate(value);
  }, [value]);

  const handleSegmentChange = (segment: SegmentKey, next: string) => {
    if (disabled) return;
    const digitsOnly = next.replace(/\D/g, "");
    let normalized = digitsOnly;
    if (segment === "day" || segment === "month") {
      normalized = normalized.slice(0, 2);
    } else {
      normalized = normalized.slice(0, 4);
    }

    if (segment === "day" && normalized.length === 2) {
      const clamped = clampNumber(parseInt(normalized, 10), 1, 31);
      normalized = padNumber(clamped.toString(), 2);
    } else if (segment === "month" && normalized.length === 2) {
      const clamped = clampNumber(parseInt(normalized, 10), 1, 12);
      normalized = padNumber(clamped.toString(), 2);
    }

    if (segment === "day") setDay(normalized);
    if (segment === "month") setMonth(normalized);
    if (segment === "year") setYear(normalized);

    // Auto-advance
    if (segment !== "year" && normalized.length === 2) {
      const nextKey = handleGetNextSegmentKey(segment);
      if (nextKey) {
        focusSegment(nextKey);
      }
    }

    // Try composing date when complete
    const nextDay = segment === "day" ? normalized : day;
    const nextMonth = segment === "month" ? normalized : month;
    const nextYear = segment === "year" ? normalized : year;
    const composed = createDateFromSegments(nextDay, nextMonth, nextYear);
    const allEmpty = nextDay.length === 0 && nextMonth.length === 0 && nextYear.length === 0;

    if (composed) {
      const outOfRange =
        (minDate && isDateBefore(composed, minDate)) ||
        (maxDate && isDateAfter(composed, maxDate)) ||
        disabledDates.some((d) => isSameDate(d, composed));

      if (outOfRange) {
        onChange?.(null);
      } else {
        onChange?.(composed);
      }
    } else if (allEmpty) {
      onChange?.(null);
    }
  };

  const handleKeyDown = (segment: SegmentKey, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowLeft") {
      const prevKey = handleGetPreviousSegmentKey(segment);
      if (prevKey) {
        e.preventDefault();
        focusSegment(prevKey);
      }
    }
    if (e.key === "ArrowRight" || e.key === "/") {
      const nextKey = handleGetNextSegmentKey(segment);
      if (nextKey) {
        e.preventDefault();
        focusSegment(nextKey);
      }
    }
    if (e.key === "Backspace") {
      const value = segment === "day" ? day : segment === "month" ? month : year;
      if (value.length === 0) {
        const prevKey = handleGetPreviousSegmentKey(segment);
        if (prevKey) {
          e.preventDefault();
          focusSegment(prevKey);
        }
      }
    }
  };

  const handleClear = () => {
    if (disabled) return;
    onChange?.(null);
    setDay("");
    setMonth("");
    setYear("");
  };

  const renderSegment = (segment: SegmentKey, ref: React.RefObject<HTMLInputElement | null>) => {
    const value = segment === "day" ? day : segment === "month" ? month : year;
    const maxLen = segment === "year" ? 4 : 2;
    const placeholder = segment === "year" ? "YYYY" : segment === "day" ? "DD" : "MM";
    const widthClass =
      segment === "year"
        ? size === "sm"
          ? "w-[4.9ch]"
          : "w-[5ch]"
        : size === "sm"
          ? "w-[2.9ch]"
          : "w-[3ch]";

    return (
      <input
        ref={ref}
        inputMode="numeric"
        maxLength={maxLen}
        className={cn(
          inputVariants({ size, disabled }),
          widthClass,
          "border-none bg-transparent p-0 text-center focus:ring-0 focus-visible:ring-0"
        )}
        value={value}
        onChange={(e) => handleSegmentChange(segment, e.target.value)}
        onKeyDown={(e) => handleKeyDown(segment, e)}
        onFocus={(e) => e.currentTarget.select()}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={placeholder}
      />
    );
  };

  const calendarContent = (
    <div className="p-4xl border-primary rounded-3xl border bg-white shadow-lg">
      <DatePicker
        mode="single"
        value={value}
        onChange={(date) => {
          const d = date ?? null;
          setFromDate(d);
          onChange?.(d);
          setIsCalendarOpen(false);
        }}
        minDate={minDate}
        maxDate={maxDate}
        disabledDates={disabledDates}
        autoNavigateToDate
        className={className}
      />
    </div>
  );

  return (
    <div
      className={cn("gap-sm flex flex-col", fullWidth ? "w-full" : "w-auto", containerClassName)}
    >
      {label && (
        <div className="gap-xxs flex flex-row items-center">
          <label htmlFor={inputId} className={labelVariants()}>
            {label}
          </label>
          {required && (
            <Typography variant="body-md" weight="medium" className="text-brand-tertiary">
              *
            </Typography>
          )}
          {showInfoIcon && (
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
            size,
          }),
          fullWidth ? "w-full" : "w-auto",
          "gap-md"
        )}
      >
        {showCalendar &&
          (isMobile ? (
            <Sheet open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="tertiary-gray"
                  size={size === "sm" ? "xs" : "sm"}
                  iconOnly
                  startIcon={Calendar}
                  onClick={() => setIsCalendarOpen((prev) => !prev)}
                  disabled={disabled}
                  className="p-0! hover:bg-transparent"
                />
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className={cn("max-h-[80vh]overflow-y-auto rounded-t-2xl bg-white")}
                showCloseButton
              >
                <SheetHeader>
                  <SheetTitle className="sr-only">Select Date</SheetTitle>
                  <SheetDescription className="sr-only">Select a date</SheetDescription>
                </SheetHeader>
                {calendarContent}
              </SheetContent>
            </Sheet>
          ) : (
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger
                render={
                  <Button
                    variant="tertiary-gray"
                    size={size === "sm" ? "xs" : "sm"}
                    iconOnly
                    startIcon={Calendar}
                    onClick={() => setIsCalendarOpen((prev) => !prev)}
                    disabled={disabled}
                    className="px-0! py-0! hover:bg-transparent"
                  />
                }
              />
              <PopoverContent
                sideOffset={8}
                align="start"
                popupClassName={cn(
                  "rounded-2xl bg-white shadow-2xl flex flex-col overflow-hidden w-fit"
                )}
              >
                {calendarContent}
              </PopoverContent>
            </Popover>
          ))}
        <div className="flex flex-1 items-center">
          {segments.map((segment, idx) => (
            <React.Fragment key={segment}>
              {renderSegment(
                segment,
                segment === "day" ? dayRef : segment === "month" ? monthRef : yearRef
              )}
              {idx < segments.length - 1 && (
                <Typography
                  variant="body-md"
                  weight="medium"
                  className={cn("text-tertiary", disabled ? "text-placeholder-subtle" : "")}
                >
                  /
                </Typography>
              )}
            </React.Fragment>
          ))}
        </div>
        {isClearable && value && !disabled && (
          <Button
            type="button"
            variant="tertiary-gray"
            className="ml-xs cursor-pointer p-0! hover:bg-transparent"
            aria-label="Clear date"
            tabIndex={0}
            onClick={handleClear}
            iconOnly
            startIcon={<CloseIcon size="1rem" className="text-quaternary hover:text-secondary" />}
          />
        )}
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

DateInput.displayName = "DateInput";
