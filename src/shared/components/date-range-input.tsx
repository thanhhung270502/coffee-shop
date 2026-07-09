"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { cva } from "class-variance-authority";
import { Calendar } from "iconsax-reactjs";

import { useSmaller } from "../hooks/use-breakpoint";
import {
  addDays,
  clampNumber,
  cn,
  createDateFromSegments,
  isDateAfter,
  isDateBefore,
  isSameDate,
  padNumber,
  subtractDays,
} from "../utils";

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

export type DateRangeInputProps = {
  startDate?: Date | null;
  endDate?: Date | null;
  onStartDateChange?: (date: Date | null) => void;
  onEndDateChange?: (date: Date | null) => void;
  onRangeChange?: (startDate: Date | null, endDate: Date | null) => void;
  label?: string;
  helperText?: string;
  startError?: string;
  endError?: string;
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
  isClearable?: boolean;
  helperTextClassName?: string;
  separatorText?: string;
};

type SegmentKey = "day" | "month" | "year";
type InputType = "start" | "end";

const inputWrapperVariants = cva(
  [
    "relative flex items-center gap-md rounded-4xl border border-solid",
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
      size: {
        sm: "px-2xl py-lg",
        md: "px-2xl py-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      disabled: false,
      size: "md",
    },
  }
);

export const DateRangeInput = ({
  startDate = null,
  endDate = null,
  onStartDateChange,
  onEndDateChange,
  onRangeChange,
  label,
  helperText,
  startError,
  endError,
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
  isClearable = false,
  helperTextClassName,
  separatorText = "to",
}: DateRangeInputProps) => {
  const autoId = useId();
  const inputId = autoId;

  const [startDay, setStartDay] = useState<string>("");
  const [startMonth, setStartMonth] = useState<string>("");
  const [startYear, setStartYear] = useState<string>("");
  const [endDay, setEndDay] = useState<string>("");
  const [endMonth, setEndMonth] = useState<string>("");
  const [endYear, setEndYear] = useState<string>("");

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [activeInput, setActiveInput] = useState<InputType>("start");
  const isMobile = useSmaller("sm");

  const [calendarStartDate, setCalendarStartDate] = useState<Date | null>(null);
  const [calendarEndDate, setCalendarEndDate] = useState<Date | null>(null);
  const [selectStartOnly, setSelectStartOnly] = useState(false);
  const [selectEndOnly, setSelectEndOnly] = useState(false);
  const originalStartDateRef = useRef<Date | null>(null);
  const originalEndDateRef = useRef<Date | null>(null);

  const startDayRef = useRef<HTMLInputElement | null>(null);
  const startMonthRef = useRef<HTMLInputElement | null>(null);
  const startYearRef = useRef<HTMLInputElement | null>(null);
  const endDayRef = useRef<HTMLInputElement | null>(null);
  const endMonthRef = useRef<HTMLInputElement | null>(null);
  const endYearRef = useRef<HTMLInputElement | null>(null);

  const hasStartError = !!startError;
  const hasEndError = !!endError;
  const hasError = hasStartError || hasEndError;
  const effectiveVariant = hasError ? "destructive" : variant;

  const segments = useMemo(() => {
    return dateFormat === "MM/dd/yyyy"
      ? (["month", "day", "year"] as SegmentKey[])
      : (["day", "month", "year"] as SegmentKey[]);
  }, [dateFormat]);

  const getSegmentRefs = (inputType: InputType) => ({
    day: inputType === "start" ? startDayRef : endDayRef,
    month: inputType === "start" ? startMonthRef : endMonthRef,
    year: inputType === "start" ? startYearRef : endYearRef,
  });

  const handleGetNextSegmentKey = (segment: SegmentKey) => {
    const currentIndex = segments.findIndex((s) => s === segment);
    const nextIndex = (currentIndex + 1) % segments.length;
    return segments[nextIndex];
  };

  const handleGetPreviousSegmentKey = (segment: SegmentKey) => {
    const currentIndex = segments.findIndex((s) => s === segment);
    const previousIndex = (currentIndex - 1 + segments.length) % segments.length;
    return segments[previousIndex];
  };

  const focusSegment = (inputType: InputType, key: SegmentKey) => {
    const refs = getSegmentRefs(inputType);
    refs[key].current?.focus();
    refs[key].current?.select();
  };

  const focusFirstSegmentOfEndInput = () => {
    const firstSegment = segments[0];
    if (firstSegment) {
      focusSegment("end", firstSegment);
    }
  };

  const setFromDate = (inputType: InputType, date: Date | null) => {
    if (inputType === "start") {
      if (!date) {
        setStartDay("");
        setStartMonth("");
        setStartYear("");
        return;
      }
      setStartDay(padNumber(date.getDate().toString(), 2));
      setStartMonth(padNumber((date.getMonth() + 1).toString(), 2));
      setStartYear(padNumber(date.getFullYear().toString(), 4));
    } else {
      if (!date) {
        setEndDay("");
        setEndMonth("");
        setEndYear("");
        return;
      }
      setEndDay(padNumber(date.getDate().toString(), 2));
      setEndMonth(padNumber((date.getMonth() + 1).toString(), 2));
      setEndYear(padNumber(date.getFullYear().toString(), 4));
    }
  };

  useEffect(() => {
    setFromDate("start", startDate);
  }, [startDate]);

  useEffect(() => {
    setFromDate("end", endDate);
  }, [endDate]);

  const handleSegmentChange = (inputType: InputType, segment: SegmentKey, next: string) => {
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

    if (inputType === "start") {
      if (segment === "day") setStartDay(normalized);
      if (segment === "month") setStartMonth(normalized);
      if (segment === "year") setStartYear(normalized);
    } else {
      if (segment === "day") setEndDay(normalized);
      if (segment === "month") setEndMonth(normalized);
      if (segment === "year") setEndYear(normalized);
    }

    // Auto-advance to next segment
    if (segment !== "year" && normalized.length === 2) {
      const nextKey = handleGetNextSegmentKey(segment);
      if (nextKey) {
        focusSegment(inputType, nextKey);
      }
    }

    // Auto-advance to end input when start year is complete
    if (inputType === "start" && segment === "year" && normalized.length === 4) {
      setTimeout(() => focusFirstSegmentOfEndInput(), 0);
    }

    // Compose date from segments
    const day =
      inputType === "start"
        ? segment === "day"
          ? normalized
          : startDay
        : segment === "day"
          ? normalized
          : endDay;
    const month =
      inputType === "start"
        ? segment === "month"
          ? normalized
          : startMonth
        : segment === "month"
          ? normalized
          : endMonth;
    const year =
      inputType === "start"
        ? segment === "year"
          ? normalized
          : startYear
        : segment === "year"
          ? normalized
          : endYear;
    const composed = createDateFromSegments(day, month, year);
    const allEmpty = day.length === 0 && month.length === 0 && year.length === 0;

    if (composed) {
      const isDisabled = disabledDates.some((d) => isSameDate(d, composed));
      if (
        isDisabled ||
        (minDate && isDateBefore(composed, minDate)) ||
        (maxDate && isDateAfter(composed, maxDate))
      ) {
        if (inputType === "start") {
          onStartDateChange?.(null);
          onRangeChange?.(null, endDate);
        } else {
          onEndDateChange?.(null);
          onRangeChange?.(startDate, null);
        }
        return;
      }

      // Auto-correct invalid ranges
      if (inputType === "start") {
        if (endDate && isDateAfter(composed, endDate)) {
          const newEndDate = addDays(composed, 1);
          setFromDate("end", newEndDate);
          onStartDateChange?.(composed);
          onEndDateChange?.(newEndDate);
          onRangeChange?.(composed, newEndDate);
        } else {
          onStartDateChange?.(composed);
          onRangeChange?.(composed, endDate);
        }
      } else {
        if (startDate && isDateBefore(composed, startDate)) {
          const newStartDate = subtractDays(composed, 1);
          setFromDate("start", newStartDate);
          onStartDateChange?.(newStartDate);
          onEndDateChange?.(composed);
          onRangeChange?.(newStartDate, composed);
        } else {
          onEndDateChange?.(composed);
          onRangeChange?.(startDate, composed);
        }
      }
    } else if (allEmpty) {
      if (inputType === "start") {
        onStartDateChange?.(null);
        onRangeChange?.(null, endDate);
      } else {
        onEndDateChange?.(null);
        onRangeChange?.(startDate, null);
      }
    }
  };

  const handleKeyDown = (
    inputType: InputType,
    segment: SegmentKey,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const day = inputType === "start" ? startDay : endDay;
    const month = inputType === "start" ? startMonth : endMonth;
    const year = inputType === "start" ? startYear : endYear;

    if (e.key === "ArrowLeft") {
      const prevKey = handleGetPreviousSegmentKey(segment);
      const isFirstSegment = segments.indexOf(segment) === 0;

      if (isFirstSegment && inputType === "end") {
        e.preventDefault();
        focusSegment("start", segments[segments.length - 1] as SegmentKey);
      } else if (prevKey) {
        e.preventDefault();
        focusSegment(inputType, prevKey);
      }
    }
    if (e.key === "ArrowRight" || e.key === "/") {
      const nextKey = handleGetNextSegmentKey(segment);
      const isLastSegment = segments.indexOf(segment) === segments.length - 1;

      if (isLastSegment && inputType === "start") {
        e.preventDefault();
        focusSegment("end", segments[0] as SegmentKey);
      } else if (nextKey) {
        e.preventDefault();
        focusSegment(inputType, nextKey);
      }
    }
    if (e.key === "Backspace") {
      const value = segment === "day" ? day : segment === "month" ? month : year;
      if (value.length === 0) {
        const prevKey = handleGetPreviousSegmentKey(segment);
        const isFirstSegment = segments.indexOf(segment) === 0;

        if (isFirstSegment && inputType === "end") {
          e.preventDefault();
          focusSegment("start", segments[segments.length - 1] as SegmentKey);
        } else if (prevKey) {
          e.preventDefault();
          focusSegment(inputType, prevKey);
        }
      }
    }
  };

  const handleClear = (inputType: InputType) => {
    if (disabled) return;
    if (inputType === "start") {
      onStartDateChange?.(null);
      onRangeChange?.(null, endDate);
      setStartDay("");
      setStartMonth("");
      setStartYear("");
    } else {
      onEndDateChange?.(null);
      onRangeChange?.(startDate, null);
      setEndDay("");
      setEndMonth("");
      setEndYear("");
    }
  };

  const handleCalendarRangeChange = (start: Date | null, end: Date | null) => {
    let finalStart = start;
    let finalEnd = end;

    // Handle "select start only" mode: keep original end, then switch to "select end only"
    if (selectStartOnly && originalEndDateRef.current && start && !end) {
      const originalEnd = originalEndDateRef.current;
      const clickedDate = start;

      if (isDateBefore(clickedDate, originalEnd) || isSameDate(clickedDate, originalEnd)) {
        finalStart = clickedDate;
        finalEnd = originalEnd;
      } else {
        finalStart = clickedDate;
        finalEnd = addDays(clickedDate, 1);
      }

      setCalendarStartDate(finalStart);
      setCalendarEndDate(finalEnd);
      setFromDate("start", finalStart);
      setFromDate("end", finalEnd);
      onStartDateChange?.(finalStart);
      onEndDateChange?.(finalEnd);
      onRangeChange?.(finalStart, finalEnd);

      // Switch to "select end only" mode
      setSelectStartOnly(false);
      setSelectEndOnly(true);
      originalStartDateRef.current = finalStart;
      originalEndDateRef.current = null;
      return;
    }

    // Handle "select end only" mode: keep original start
    if (selectEndOnly && originalStartDateRef.current && start && !end) {
      const originalStart = originalStartDateRef.current;
      const clickedDate = start;

      if (isDateAfter(clickedDate, originalStart) || isSameDate(clickedDate, originalStart)) {
        finalStart = originalStart;
        finalEnd = clickedDate;
      } else {
        finalStart = subtractDays(clickedDate, 1);
        finalEnd = clickedDate;
      }
    }

    setCalendarStartDate(finalStart);
    setCalendarEndDate(finalEnd);
    setFromDate("start", finalStart);
    setFromDate("end", finalEnd);
    onStartDateChange?.(finalStart);
    onEndDateChange?.(finalEnd);
    onRangeChange?.(finalStart, finalEnd);

    // Close calendar when both dates are selected
    if (finalStart && finalEnd) {
      setIsCalendarOpen(false);
      setSelectStartOnly(false);
      setSelectEndOnly(false);
      originalStartDateRef.current = null;
      originalEndDateRef.current = null;
      setTimeout(() => focusFirstSegmentOfEndInput(), 0);
    }
  };

  const handleCalendarOpen = (inputType: InputType) => {
    setActiveInput(inputType);
    setCalendarStartDate(startDate);
    setCalendarEndDate(endDate);

    if (inputType === "start") {
      if (endDate) {
        setSelectStartOnly(true);
        setSelectEndOnly(false);
        originalEndDateRef.current = endDate;
        originalStartDateRef.current = null;
      } else {
        setSelectStartOnly(false);
        setSelectEndOnly(false);
        originalStartDateRef.current = null;
        originalEndDateRef.current = null;
      }
    } else {
      if (startDate) {
        setSelectEndOnly(true);
        setSelectStartOnly(false);
        originalStartDateRef.current = startDate;
        originalEndDateRef.current = null;
      } else {
        setSelectStartOnly(false);
        setSelectEndOnly(false);
        originalStartDateRef.current = null;
        originalEndDateRef.current = null;
      }
    }

    setIsCalendarOpen(true);
  };

  const renderSegment = (
    inputType: InputType,
    segment: SegmentKey,
    ref: React.RefObject<HTMLInputElement | null>
  ) => {
    const day = inputType === "start" ? startDay : endDay;
    const month = inputType === "start" ? startMonth : endMonth;
    const year = inputType === "start" ? startYear : endYear;

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
        onChange={(e) => handleSegmentChange(inputType, segment, e.target.value)}
        onKeyDown={(e) => handleKeyDown(inputType, segment, e)}
        onFocus={(e) => {
          e.currentTarget.select();
          setActiveInput(inputType);
        }}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={`${inputType === "start" ? "Start" : "End"} ${placeholder}`}
      />
    );
  };

  const renderDateInput = (inputType: InputType) => {
    const refs = getSegmentRefs(inputType);
    const dateValue = inputType === "start" ? startDate : endDate;
    const hasInputError = inputType === "start" ? hasStartError : hasEndError;
    const inputVariant = hasInputError ? "destructive" : effectiveVariant;

    const isSelectingStart =
      isCalendarOpen && (selectStartOnly || (!calendarStartDate && !selectEndOnly));
    const isSelectingEnd =
      isCalendarOpen &&
      (selectEndOnly || (calendarStartDate && !calendarEndDate && !selectStartOnly));
    const isActiveSelection =
      (inputType === "start" && isSelectingStart) || (inputType === "end" && isSelectingEnd);

    return (
      <div
        className={cn(
          inputWrapperVariants({
            variant: inputVariant,
            disabled,
            size,
          }),
          fullWidth ? "w-full flex-1" : "w-auto",
          "gap-md",
          isActiveSelection && "border-brand ring-brand-purple-500 ring-2"
        )}
      >
        {showCalendar && (
          <Button
            type="button"
            variant="tertiary-gray"
            size={size === "sm" ? "xs" : "sm"}
            iconOnly
            startIcon={Calendar}
            onClick={() => handleCalendarOpen(inputType)}
            disabled={disabled}
            className="p-0! hover:bg-transparent"
            data-calendar-trigger="true"
          />
        )}
        <div className="flex flex-1 items-center">
          {segments.map((segment, idx) => (
            <React.Fragment key={`${inputType}-${segment}`}>
              {renderSegment(inputType, segment, refs[segment])}
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
        {isClearable && dateValue && !disabled && (
          <Button
            type="button"
            variant="tertiary-gray"
            className="ml-xs cursor-pointer p-0! hover:bg-transparent"
            aria-label={`Clear ${inputType} date`}
            tabIndex={0}
            onClick={() => handleClear(inputType)}
            iconOnly
            startIcon={<CloseIcon size="1rem" className="text-quaternary hover:text-secondary" />}
          />
        )}
      </div>
    );
  };

  const getNavigateToDate = () => {
    if (selectEndOnly && calendarEndDate) return calendarEndDate;
    if (selectStartOnly && calendarStartDate) return calendarStartDate;
    return undefined;
  };

  const calendarContent = (
    <div className="p-4xl border-primary rounded-3xl border bg-white shadow-lg">
      <DatePicker
        mode="range"
        startDate={calendarStartDate}
        endDate={calendarEndDate}
        onRangeChange={handleCalendarRangeChange}
        minDate={minDate}
        maxDate={maxDate}
        disabledDates={disabledDates}
        autoNavigateToDate
        navigateToDate={getNavigateToDate()}
        className={className}
      />
    </div>
  );

  const inputsRow = (
    <div className={cn("gap-xl flex items-center", fullWidth && "w-full")}>
      {renderDateInput("start")}
      <Typography variant="body-md" className="text-secondary shrink-0">
        {separatorText}
      </Typography>
      {renderDateInput("end")}
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
        </div>
      )}

      {isMobile ? (
        <>
          {inputsRow}
          <Sheet open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <SheetTrigger asChild>
              <button type="button" className="sr-only" aria-hidden="true" tabIndex={-1}>
                Open calendar
              </button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className={cn("max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white")}
              showCloseButton
            >
              <SheetHeader>
                <SheetTitle className="sr-only">Select Date Range</SheetTitle>
                <SheetDescription className="sr-only">Select a start and end date</SheetDescription>
              </SheetHeader>
              {calendarContent}
            </SheetContent>
          </Sheet>
        </>
      ) : (
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger
            render={
              <button
                type="button"
                className="clip-[rect(0,0,0,0)] absolute m-0 h-0 w-0 overflow-hidden border-0 p-0"
                aria-hidden="true"
                tabIndex={-1}
              />
            }
          />
          {inputsRow}
          <PopoverContent
            sideOffset={8}
            side="bottom"
            align={activeInput === "start" ? "start" : "end"}
            popupClassName="rounded-2xl bg-white shadow-2xl flex flex-col overflow-hidden w-fit"
          >
            {calendarContent}
          </PopoverContent>
        </Popover>
      )}

      {(helperText || startError || endError) && (
        <div
          className={cn(
            helperTextVariants({ variant: hasError ? "error" : "default" }),
            helperTextClassName
          )}
        >
          {startError || endError || helperText}
        </div>
      )}
    </div>
  );
};

DateRangeInput.displayName = "DateRangeInput";
