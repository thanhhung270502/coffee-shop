"use client";

import { useCallback, useEffect, useState } from "react";
import ReactDatePicker, { type ReactDatePickerCustomHeaderProps } from "react-datepicker";
import { ArrowLeft2, ArrowRight2 } from "iconsax-reactjs";

import { cn } from "../utils";
import {
  isDateAfter,
  isDateBefore,
  isDateBetweenDates,
  isSameDate,
  isToday,
  toDate,
} from "../utils";

import { BaseDate } from "./base-date";
import { Button } from "./button";
import { Typography } from "./typography";

// ============================================================================
// Constants
// ============================================================================

const YEAR_RANGE_SIZE = 12;

const CSS_CLASSES = {
  base: "langco",
  monthPicker: "langco--month-picker",
  yearPicker: "langco--year-picker",
} as const;

// ============================================================================
// Types
// ============================================================================

type PickerView = "day" | "month" | "year";
type DateState = "Default" | "Hover" | "Active" | "Range" | "Disable" | "Inactive";

type SingleModeProps = {
  mode: "single";
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  startDate?: never;
  endDate?: never;
  onRangeChange?: never;
  singleClickRange?: never;
};

type RangeModeProps = {
  mode: "range";
  startDate?: Date | null;
  endDate?: Date | null;
  onRangeChange?: (start: Date | null, end: Date | null) => void;
  value?: never;
  onChange?: never;
  singleClickRange?: boolean;
};

type CommonDatePickerProps = {
  minDate?: Date | null;
  maxDate?: Date | null;
  disabledDates?: Date[];
  highlightedDates?: Date[];
  disabled?: boolean;
  className?: string;
  locale?: string;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  autoNavigateToDate?: boolean;
  /** Explicitly specify which date to navigate to (overrides autoNavigateToDate logic) */
  navigateToDate?: Date | null;
};

export type DatePickerProps = (SingleModeProps | RangeModeProps) & CommonDatePickerProps;

// ============================================================================
// Helper Functions
// ============================================================================

const getYearRange = (currentYear: number): number[] => {
  const startYear = Math.floor(currentYear / YEAR_RANGE_SIZE) * YEAR_RANGE_SIZE + 1;
  return Array.from({ length: YEAR_RANGE_SIZE }, (_, i) => startYear + i);
};

const isDateDisabled = (
  date: Date,
  minDate?: Date | null,
  maxDate?: Date | null,
  disabledDates?: Date[]
): boolean => {
  if (minDate && isDateBefore(date, minDate)) return true;
  if (maxDate && isDateAfter(date, maxDate)) return true;
  if (disabledDates?.some((d) => isSameDate(d, date))) return true;
  return false;
};

const getAriaLabel = (pickerView: PickerView, direction: "prev" | "next"): string => {
  const labels = {
    day: direction === "prev" ? "Previous month" : "Next month",
    month: direction === "prev" ? "Previous year" : "Next year",
    year: direction === "prev" ? "Previous years" : "Next years",
  };
  return labels[pickerView];
};

// ============================================================================
// Component
// ============================================================================

export const DatePicker = (props: DatePickerProps) => {
  const {
    mode,
    minDate = null,
    maxDate = null,
    disabledDates = [],
    highlightedDates = [],
    disabled = false,
    className,
    locale,
    firstDayOfWeek = 0,
    autoNavigateToDate = false,
    navigateToDate,
  } = props;

  // ---------------------------------------------------------------------------
  // Derived Values
  // ---------------------------------------------------------------------------

  const selectedDate = mode === "single" ? props.value : null;
  const startDate = mode === "range" ? props.startDate : null;
  const endDate = mode === "range" ? props.endDate : null;

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    // Initialize to selected date's month if available, otherwise today
    const initialDate = mode === "single" ? selectedDate : (startDate ?? endDate);
    return initialDate ?? toDate();
  });
  const [pickerView, setPickerView] = useState<PickerView>("day");

  // ---------------------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!autoNavigateToDate) return;

    // Use explicit navigateToDate if provided, otherwise use default logic
    if (navigateToDate) {
      setCurrentMonth(navigateToDate);
      return;
    }

    const targetMonth = mode === "single" ? selectedDate : (startDate ?? endDate);
    if (targetMonth) {
      setCurrentMonth(targetMonth);
    }
  }, [autoNavigateToDate, endDate, mode, navigateToDate, selectedDate, startDate]);

  // ---------------------------------------------------------------------------
  // Callbacks
  // ---------------------------------------------------------------------------

  const calculateDateState = useCallback(
    (date: Date): DateState => {
      if (isDateDisabled(date, minDate, maxDate, disabledDates)) {
        return "Disable";
      }

      if (mode === "single") {
        if (selectedDate && isSameDate(date, selectedDate)) return "Active";
        if (hoverDate && isSameDate(date, hoverDate)) return "Hover";
        return "Default";
      }

      if (mode === "range") {
        const isStartOrEnd =
          (startDate && isSameDate(date, startDate)) || (endDate && isSameDate(date, endDate));
        if (isStartOrEnd) return "Active";

        if (startDate && endDate && isDateBetweenDates(date, startDate, endDate)) {
          return "Range";
        }

        if (startDate && !endDate && hoverDate) {
          if (isDateBetweenDates(date, startDate, hoverDate)) return "Range";
          if (isSameDate(date, hoverDate)) return "Hover";
        }
      }

      return "Default";
    },
    [mode, selectedDate, startDate, endDate, hoverDate, minDate, maxDate, disabledDates]
  );

  const handleSingleDateChange = useCallback(
    (date: Date | null) => {
      if (disabled || mode !== "single") return;
      props.onChange?.(date);
    },
    [mode, disabled, props]
  );

  const handleRangeDateChange = useCallback(
    (dates: [Date | null, Date | null]) => {
      if (disabled || mode !== "range") return;

      const [start, end] = dates;
      if (props.singleClickRange && start && !end) {
        props.onRangeChange?.(start, null);
      } else {
        props.onRangeChange?.(start, end);
      }
    },
    [mode, disabled, props]
  );

  const handleMonthSelect = useCallback((date: Date | null) => {
    if (date) {
      setCurrentMonth(date);
      setPickerView("day");
    }
  }, []);

  const handleYearSelect = useCallback((date: Date | null) => {
    if (date) {
      setCurrentMonth(date);
      setPickerView("month");
    }
  }, []);

  const navigateYears = useCallback(
    (direction: "prev" | "next") => {
      const newDate = new Date(currentMonth);
      const yearDelta = direction === "prev" ? -YEAR_RANGE_SIZE : YEAR_RANGE_SIZE;
      newDate.setFullYear(newDate.getFullYear() + yearDelta);
      setCurrentMonth(newDate);
    },
    [currentMonth]
  );

  // ---------------------------------------------------------------------------
  // Render Helpers
  // ---------------------------------------------------------------------------

  const renderDayContents = useCallback(
    (dayOfMonth: number, date: Date | undefined) => {
      if (!date) return null;

      const state = calculateDateState(date);
      const hasDot = isToday(date) || highlightedDates.some((d) => isSameDate(d, date));

      return (
        <BaseDate
          date={dayOfMonth}
          state={state}
          dot={hasDot}
          onMouseEnter={() => setHoverDate(date)}
          onMouseLeave={() => setHoverDate(null)}
        />
      );
    },
    [calculateDateState, highlightedDates]
  );

  const renderHeaderTitle = useCallback(
    (date: Date) => {
      const month = date.toLocaleDateString(locale ?? "en-US", { month: "long" });
      const year = date.getFullYear();

      const buttonClass = "cursor-pointer hover:text-primary-600 transition-colors";

      if (pickerView === "day") {
        return (
          <>
            <button type="button" onClick={() => setPickerView("month")} className={buttonClass}>
              {month}
            </button>{" "}
            <button type="button" onClick={() => setPickerView("year")} className={buttonClass}>
              {year}
            </button>
          </>
        );
      }

      if (pickerView === "month") {
        return (
          <button type="button" onClick={() => setPickerView("year")} className={buttonClass}>
            {currentMonth.getFullYear()}
          </button>
        );
      }

      const yearRange = getYearRange(currentMonth.getFullYear());
      return `${yearRange[0]} - ${yearRange[YEAR_RANGE_SIZE - 1]}`;
    },
    [locale, pickerView, currentMonth]
  );

  const CustomHeader = useCallback(
    ({
      date,
      decreaseMonth,
      increaseMonth,
      prevMonthButtonDisabled,
      nextMonthButtonDisabled,
    }: ReactDatePickerCustomHeaderProps) => {
      const handlePrevClick = () => {
        if (pickerView === "day") decreaseMonth();
        else if (pickerView === "year") navigateYears("prev");
      };

      const handleNextClick = () => {
        if (pickerView === "day") increaseMonth();
        else if (pickerView === "year") navigateYears("next");
      };

      const isPrevDisabled = pickerView === "day" && prevMonthButtonDisabled;
      const isNextDisabled = pickerView === "day" && nextMonthButtonDisabled;
      const showNavButtons = pickerView !== "month";

      return (
        <div className="gap-2xl flex items-center">
          {showNavButtons ? (
            <Button
              variant="tertiary-color"
              iconOnly
              startIcon={ArrowLeft2}
              size="md"
              onClick={handlePrevClick}
              disabled={isPrevDisabled}
              aria-label={getAriaLabel(pickerView, "prev")}
              className="p-md rounded-4xl"
            />
          ) : (
            <div className="w-10" />
          )}

          <Typography
            variant="body-lg"
            weight="semibold"
            color="primary"
            className="flex-1 text-center"
          >
            {renderHeaderTitle(date)}
          </Typography>

          {showNavButtons ? (
            <Button
              variant="tertiary-color"
              iconOnly
              startIcon={ArrowRight2}
              size="md"
              onClick={handleNextClick}
              disabled={isNextDisabled}
              aria-label={getAriaLabel(pickerView, "next")}
              className="p-md rounded-4xl"
            />
          ) : (
            <div className="w-10" />
          )}
        </div>
      );
    },
    [pickerView, navigateYears, renderHeaderTitle]
  );

  // ---------------------------------------------------------------------------
  // Common Props
  // ---------------------------------------------------------------------------

  const commonDatePickerProps = {
    inline: true,
    minDate: minDate ?? undefined,
    maxDate: maxDate ?? undefined,
    disabled,
    ...(locale && { locale }),
    renderCustomHeader: CustomHeader,
    showPopperArrow: false,
  } as const;

  const datePickerChangeProps =
    mode === "range"
      ? {
          startDate: startDate ?? undefined,
          endDate: endDate ?? undefined,
          selectsRange: true as const,
          onChange: handleRangeDateChange,
        }
      : {
          onChange: handleSingleDateChange,
        };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (pickerView === "month") {
    return (
      <div className={cn(CSS_CLASSES.base, CSS_CLASSES.monthPicker, className)}>
        <ReactDatePicker
          selected={null}
          openToDate={currentMonth}
          onChange={handleMonthSelect}
          showMonthYearPicker
          {...commonDatePickerProps}
        />
      </div>
    );
  }

  if (pickerView === "year") {
    return (
      <div className={cn(CSS_CLASSES.base, CSS_CLASSES.yearPicker, className)}>
        <ReactDatePicker
          selected={null}
          openToDate={currentMonth}
          onChange={handleYearSelect}
          showYearPicker
          yearItemNumber={YEAR_RANGE_SIZE}
          {...commonDatePickerProps}
        />
      </div>
    );
  }

  return (
    <div className={cn(CSS_CLASSES.base, className)}>
      <ReactDatePicker
        // Don't pass `selected` - we handle selection styling via renderDayContents
        // This allows openToDate to work properly for month/year navigation
        selected={null}
        excludeDates={disabledDates}
        calendarStartDay={firstDayOfWeek}
        renderDayContents={renderDayContents}
        onMonthChange={setCurrentMonth}
        openToDate={currentMonth}
        {...commonDatePickerProps}
        {...datePickerChangeProps}
      />
    </div>
  );
};

DatePicker.displayName = "DatePicker";
