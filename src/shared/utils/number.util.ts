export const parseNumber = (value: string | number | undefined, digits: number = 10) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = parseInt(value, digits);
    return isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
};

export const clampNumber = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export const padNumber = (value: string, digits: number) => value.padStart(digits, "0");
