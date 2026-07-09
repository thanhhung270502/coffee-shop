import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);
dayjs.extend(isBetween);

export const getTimestamp = (date?: Date | string | number, isSeconds: boolean = false) => {
  return isSeconds ? dayjs(date).unix() : dayjs(date).valueOf();
};

export function isBeforeToday(date: Date): boolean {
  return dayjs(date).isBefore(dayjs(), "day");
}

export function isDateBefore(date1: Date, date2: Date): boolean {
  return dayjs(date1).isBefore(dayjs(date2), "day");
}

export function isAfterToday(date: Date): boolean {
  return dayjs(date).isAfter(dayjs(), "day");
}

export function isDateAfter(date1: Date, date2: Date): boolean {
  return dayjs(date1).isAfter(dayjs(date2), "day");
}

export function isToday(date: Date): boolean {
  return dayjs(date).isSame(dayjs(), "day");
}

export function isSameDate(date1: Date, date2: Date): boolean {
  return dayjs(date1).isSame(date2, "day");
}

export const isSameOrRelativeTo = (
  baseDate?: Date,
  compareDate?: Date,
  direction: "after" | "before" = "after"
): boolean => {
  const base = dayjs(baseDate);
  const target = dayjs(compareDate);
  if (direction === "after") {
    return base.isSame(target) || base.isAfter(target);
  }

  return base.isSame(target) || base.isBefore(target);
};

export function isMorning(date: Date): boolean {
  const time = dayjs(date);
  return time.isBefore(dayjs(date).hour(12).minute(0).second(0));
}

export function isAfternoon(date: Date): boolean {
  const time = dayjs(date);
  const noonTime = dayjs(date).hour(12).minute(0).second(0);
  const eveningTime = dayjs(date).hour(17).minute(0).second(0);

  // Check if time is between noon (inclusive) and evening (inclusive)
  return (
    time.isAfter(noonTime.subtract(1, "second")) && time.isBefore(eveningTime.add(1, "second"))
  );
}

export function isEvening(date: Date): boolean {
  const time = dayjs(date);
  return time.isAfter(dayjs(date).hour(17).minute(0).second(0));
}

export function getMMMMDDFormattedDate(time: Date) {
  return dayjs(time).format("MMMM DD");
}

export function getddddMMMDDFormattedDate(time: Date) {
  return dayjs(time).format("dddd, MMM. DD");
}

/**
 * Extracts the date part from a string or Date object.
 * Eg: "2023-10-01T12:00:00Z" => "2023-10-01"
 * @param date
 */
export const getDateString = (date: string | Date) => {
  if (typeof date === "string") {
    return date.split("T")[0];
  }

  return date.toISOString().split("T")[0];
};
// Eg: Friday, December 19 at 4:30 pm
export function getFullFormattedDate(time?: Date) {
  if (!time) return "";
  return dayjs(time).format("dddd, MMMM D [at] h:mm A");
}

export function guessTimezoneOffset(): string {
  return (dayjs().utcOffset() / 60).toString();
}

export function guessTimezone(): string {
  return dayjs.tz.guess();
}

export function endOfDate(date?: Date, timezone?: string) {
  const tz = timezone || dayjs.tz.guess();
  return dayjs(date).tz(tz).endOf("day").toDate();
}

export function startOfDate(date?: Date, timezone?: string) {
  const tz = timezone || dayjs.tz.guess();
  return dayjs(date).tz(tz).startOf("day").toDate();
}

export function startOfWeek(date?: Date) {
  return dayjs(date).startOf("week").toDate();
}

export function endOfWeek(date?: Date) {
  return dayjs(date).endOf("week").toDate();
}

export function startOfMonth(date: Date) {
  return dayjs(date).startOf("month").toDate();
}

export function endOfMonthWithOffset(date: Date, offsetMonths: number = 0) {
  return dayjs(date).add(offsetMonths, "month").endOf("month").toDate();
}

export function getDayOfMonth(date: Date) {
  return dayjs(date).utc().get("date");
}

export function toISOString(date?: Date | null) {
  return dayjs(date || undefined).toISOString();
}

export function toDate(date?: Date | string, format?: string) {
  return dayjs(date, format).toDate();
}

export function toMMDDYYYY(date?: Date | string) {
  return dayjs(date).format("MM/DD/YYYY");
}

export function toYYYYMMDD(date?: Date | string) {
  return dayjs(date).format("YYYY-MM-DD");
}

export function subtractMinutes(date: Date, minutes: number) {
  return dayjs(date).subtract(minutes, "minute").toDate();
}

export function subtractHours(date: Date, hours: number) {
  return dayjs(date).subtract(hours, "hour").toDate();
}

export function subtractDays(date: Date, days: number) {
  return dayjs(date).subtract(days, "day").toDate();
}

export function subtractMonths(date: Date, months: number) {
  return dayjs(date).subtract(months, "month").toDate();
}

export function subtractYears(date: Date, years: number) {
  return dayjs(date).subtract(years, "year").toDate();
}

export const createDateFromSegments = (day: string, month: string, year: string): Date | null => {
  if (day.length !== 2 || month.length !== 2 || year.length !== 4) return null;

  const d = parseInt(day, 10);
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);

  if (Number.isNaN(d) || Number.isNaN(m) || Number.isNaN(y)) return null;
  if (m < 1 || m > 12) return null;
  if (d < 1 || d > 31) return null;

  const parsed = dayjs(`${y}-${month}-${day}`, "YYYY-MM-DD", true);
  if (!parsed.isValid()) return null;

  const date = parsed.toDate();
  if (date.getFullYear() !== y || date.getMonth() + 1 !== m || date.getDate() !== d) {
    return null;
  }

  return date;
};

export function addMinutes(date: Date, minutes: number) {
  return dayjs(date).add(minutes, "minute").toDate();
}

export function addHours(date: Date, hours: number) {
  return dayjs(date).add(hours, "hour").toDate();
}

export function addDays(date: Date, days: number) {
  return dayjs(date).add(days, "day").toDate();
}

export function addWeeks(date: Date, weeks: number) {
  return dayjs(date).add(weeks, "week").toDate();
}

export function addMonths(date: Date, months: number) {
  return dayjs(date).add(months, "month").toDate();
}

export function getDiffInMinutes(date1?: Date, date2?: Date) {
  return dayjs(date1).diff(dayjs(date2), "minutes");
}

export function formatRelativeTime(date?: Date | string, addSuffix: boolean = true) {
  if (!date) return "";
  return dayjs(date).fromNow(addSuffix);
}

export function getDiffYears(date1?: Date, date2?: Date) {
  return Math.ceil(dayjs(date1).diff(dayjs(date2), "year", true));
}

export function formatDate(date?: Date | string, format: string = "MM/DD/YYYY") {
  return dayjs(date).format(format);
}

export function getOrdinal(day: number): string {
  // Use a fixed date in January, as only the day is relevant
  return dayjs(`2020-01-${String(day).padStart(2, "0")}`).format("Do");
}

export function getYearFromDate(date?: Date | string) {
  return dayjs(date).year();
}

export const getOffset = (ianaTimezone?: string) => {
  const timezone = ianaTimezone || dayjs.tz.guess();
  dayjs.tz.setDefault(timezone);
  const offset = dayjs().utcOffset() / 60;
  const sign = offset >= 0 ? "+" : "-";
  return `${sign}${Math.abs(offset)}`;
};

export const getTimezoneName = (ianaTimezone?: string) => {
  const zone = ianaTimezone || dayjs.tz.guess();
  return dayjs().tz(zone).format("z");
};

export function setTimeFromDate(targetDate: Date | string, sourceDate: Date): Date {
  const target = dayjs(targetDate);
  const source = dayjs(sourceDate);

  return target
    .hour(source.hour())
    .minute(source.minute())
    .second(source.second())
    .millisecond(source.millisecond())
    .toDate();
}

export function isDifferentMonth(date1: Date, date2: Date): boolean {
  return !dayjs(date1).isSame(dayjs(date2), "month");
}

/**
 * Sets the time of a date from a time string in HH:mm:ss format
 * @param date - Base date
 * @param timeStr - Time string in HH:mm:ss format (e.g., "14:30:00")
 * @returns New Date with combined date and time
 * @example
 * setDateWithTime(new Date('2024-01-15'), '14:30:00') // 2024-01-15 14:30:00
 */
export function setDateWithTime(date: Date | string, timeStr: string): Date {
  const [hours, minutes, seconds] = timeStr.split(":").map(Number);
  return dayjs(date)
    .hour(hours ?? 0)
    .minute(minutes ?? 0)
    .second(seconds ?? 0)
    .millisecond(0)
    .toDate();
}

/**
 * Checks if a date falls within a date range (inclusive)
 * @param date - Date to check
 * @param startDate - Range start date
 * @param endDate - Range end date
 * @param d - Date range type (inclusive, exclusive, etc.)
 * @returns True if date is within range (inclusive on both ends)
 * @example
 * isDateBetweenDates(
 *   new Date('2024-01-15'),
 *   new Date('2024-01-10'),
 *   new Date('2024-01-20')
 * ) // Returns true
 */
export function isDateBetweenDates(
  date: Date | string,
  startDate: Date | string,
  endDate: Date | string,
  d: "()" | "[]" | "[)" | "(]" = "[]"
): boolean {
  const checkDate = dayjs(date);
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  return checkDate.isBetween(start, end, null, d); // '[]' makes it inclusive on both ends
}
