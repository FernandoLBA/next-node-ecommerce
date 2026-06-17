import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";
import { $ZodIssue } from "zod/v4/core";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//* Converts a Prisma object into a plain JS object to be used in the frontend
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

//* Formats a number to have 2 decimal places, if there are not decimals it adds .00 at the end
export function formatNumberWithDecimal(number: number): string {
  const [int, decimal] = number.toString().split(".");

  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

//* Formats Zod and Prisma errors into a user friendly message
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function formatError(error: any): Promise<string> {
  if (error instanceof ZodError) {
    //* Handle zod error
    const parsedErrorMessage: $ZodIssue[] = error.issues;
    const fieldErrors = parsedErrorMessage.map((zodError) => zodError.message);

    return fieldErrors.join(". ");
  } else if (
    error.name === "PrismaClientKnownRequestError" &&
    error.code === "P2002"
  ) {
    //* Handle prisma error for email
    const field = error.meta?.target ? error.meta.target[0] : "Field";

    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else {
    //* Handle other errors
    return typeof error.message === "string"
      ? error.message
      : JSON.stringify(error.message);
  }
}

//* Round number to 2 decimal places, if the value is a string it converts it to a number and then rounds it
export function round2(value: number | string) {
  if (typeof value === "number") {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === "string") {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error("Value must be a number or a string");
  }
}

//* Get the value of a CSS Global Variable
export function getCssVariableValue(variableName: string): string {
  //* Guard to prevent execution on the server (SSR), where browser-only APIs like 'getComputedStyle' are unavailable
  if (typeof window === "undefined") return "";

  const cssValue = getComputedStyle(document.documentElement).getPropertyValue(
    variableName.trim(),
  );

  if (!cssValue) return getCssVariableValue("--foreground");

  return cssValue.trim();
}

//* Currency formatter for USD, it formats the number to have a dollar sign and 2 decimal places, for example 10 becomes $10.00
export const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
  minimumFractionDigits: 2,
});

//* Format cureency using the above formatter
export function formatCurrency(amount: number | string | null) {
  if (typeof amount === "number") {
    return CURRENCY_FORMATTER.format(amount);
  } else if (typeof amount === "string") {
    return CURRENCY_FORMATTER.format(Number(amount));
  } else {
    return "NaN";
  }
}

//* Shorten UUID
export function formatId(uuid: string) {
  return `..${uuid.substring(uuid.length - 6)}`;
}

//* Formats a Date object into various string representations (full date-time, date-only, and time-only)
export const formatDateTime = (dateString: Date) => {

  //* Options for combined date and time formatting (e.g., 'Oct 31, 2023, 12:30 PM')
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: "short", //? Abbreviated month name (e.g., 'Oct')
    year: "numeric", //? Numeric year (e.g., '2023')
    day: "numeric", //? Numeric day of the month (e.g., '31')
    hour: "numeric", //? Numeric hour (e.g., '12')
    minute: "numeric", //? Numeric minute (e.g., '30')
    hour12: true, //? Use 12-hour clock (true) or 24-hour clock (false)
  };

  //* Options for date-only formatting (e.g., 'Sun, Oct 31, 2023')
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", //? Abbreviated weekday name (e.g., 'Sun')
    month: "short", //? Abbreviated month name (e.g., 'Oct'),
    year: "numeric", //? Numeric year (e.g., '2023')
    day: "numeric", //? Numeric day of the month (e.g., '31')
  };

  //* Options for time-only formatting (e.g., '12:30 PM')
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", //? Numeric hour (e.g., '12'),
    minute: "numeric", //? Numeric minute (e.g., '30'),
    hour12: true, //? Use 12-hour clock (true) or 24-hour clock (false)
  };

  //* Format the full date-time string using 'en-US' locale
  const formattedDateTime: string = new Date(dateString).toLocaleDateString(
    "en-US",
    dateTimeOptions,
  );

  //* Format the date-only string using 'en-US' locale
  const formattedDate: string = new Date(dateString).toLocaleDateString(
    "en-US",
    dateOptions,
  );

  //* Format the time-only string using 'en-US' locale
  const formattedTime: string = new Date(dateString).toLocaleTimeString(
    "en-US",
    timeOptions,
  );

  //* Return an object containing the formatted versions
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};
