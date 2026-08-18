import { clsx, type ClassValue } from "clsx";
import qs from "query-string";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";
import { $ZodIssue } from "zod/v4/core";

import englishMessages from "@/messages/en.json";
import spanishMessages from "@/messages/es.json";
import {
  CartItem,
  Locale,
  SearchFilters,
  SortingProductsOptions,
} from "@/types";
import {
  appRoutes,
  DEFAULT_CURRENCY,
  SHIPPING_FREE_AMOUNT,
  SHIPPING_PRICE,
  TAX_PERCENTAGE,
} from "./constants";

/**
 * Join tailwind classes with clsx library
 *
 * @param inputs
 * @returns
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a Prisma object into a plain JS object to be used in the frontend
 *
 * @param value
 * @returns
 */
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

/**
 * Formats a number to have 2 decimal places, if there are not decimals it adds .00 at the end
 *
 * @param number
 * @returns
 */
export function formatNumberWithDecimal(number: number): string {
  const [int, decimal] = number.toString().split(".");

  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

/**
 * Formats Zod and Prisma errors into a user friendly message
 *
 * @param error
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any): string {
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

/**
 * Round number to 2 decimal places, if the value is a string it converts it to a number and then rounds it
 *
 * @param value
 * @returns
 */
export function round2(value: number | string) {
  if (typeof value === "number") {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === "string") {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error("Value must be a number or a string");
  }
}

/**
 * Calculate cart prices
 *
 * @param items
 * @returns
 */
export const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
      items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0),
    ),
    shippingPrice = round2(
      itemsPrice > SHIPPING_FREE_AMOUNT ? 0 : SHIPPING_PRICE,
    ),
    taxPrice = round2(itemsPrice * TAX_PERCENTAGE),
    totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

/**
 * Get the value of a CSS Global Variable
 *
 * @param variableName
 * @returns
 */
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
  currency: DEFAULT_CURRENCY,
  style: "currency",
  minimumFractionDigits: 2,
});

/**
 * Format cureency using the above formatter
 *
 * @param amount
 * @returns
 */
export function formatCurrency(amount: number | string | null) {
  if (typeof amount === "number") {
    return CURRENCY_FORMATTER.format(amount);
  } else if (typeof amount === "string") {
    return CURRENCY_FORMATTER.format(Number(amount));
  } else {
    return "NaN";
  }
}

//* Format Number
const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");

/**
 * Return a formatted number like: 24
 *
 * @param number
 * @returns
 */
export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}

/**
 * Shorten UUID like "...76fgBg"
 *
 * @param uuid
 * @returns
 */
export function formatId(uuid: string) {
  return `..${uuid.substring(uuid.length - 6)}`;
}

/**
 * Formats a Date object into various string representations (full date-time, date-only, and time-only)
 *
 * @param dateString
 * @returns
 */
export const formatDateTime = (dateString: Date, locale: Locale = "es") => {
  const languageDate = {
    en: "en-US",
    es: "es-ES",
  };

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
    languageDate[locale],
    dateTimeOptions,
  );

  //* Format the date-only string using 'en-US' locale
  const formattedDate: string = new Date(dateString).toLocaleDateString(
    languageDate[locale],
    dateOptions,
  );

  //* Format the time-only string using 'en-US' locale
  const formattedTime: string = new Date(dateString).toLocaleTimeString(
    languageDate[locale],
    timeOptions,
  );

  //* Return an object containing the formatted versions
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

/**
 * Form the pagination links
 *
 * @param param0
 * @returns
 */
export function formUrlQuery({
  params,
  key,
  value,
}: {
  params: string;
  key: string;
  value: string | null;
}) {
  //? qs.parse() is used to parse the query string into an object, allowing for easy manipulation of query parameters. The parsed object can then be modified to add, update, or remove specific query parameters before converting it back into a query string for use in URLs.
  const query = qs.parse(params);

  query[key] = value;

  //? Removes the locale prefix (e.g., '/en' or '/es') from the current pathname to ensure that the generated URL is locale-agnostic. This is important for maintaining consistent routing behavior across different locales, especially when generating pagination links or other dynamic URLs.
  const basePathname = window.location.pathname.replace(/^\/(en|es)/, "");

  //? qs.stringifyUrl() is used to convert the modified query object back into a query string format, which can be appended to a URL. The skipNull option ensures that any query parameters with null values are omitted from the final query string, preventing unnecessary or empty parameters in the URL.
  return qs.stringifyUrl(
    {
      url: basePathname, //? Use the current pathname without locale prefix as the base URL for the query string
      query, //? The modified query object containing the updated query parameters
    },
    {
      skipNull: true, //? Skip null values in the query string to avoid unnecessary parameters
    },
  );
}

/**
 * Converts a search params object into a search url like: ...?query=shorts&category=men&price=10-20
 *
 * @param params
 * @returns
 */
export function convertSearchParamsToSearchUrl(params: Record<string, string>) {
  return `${appRoutes.SEARCH}?${new URLSearchParams(params)}`;
}

/**
 * Creates the search url with search params
 *
 * @param param0
 * @returns
 */
export function getFilterUrl({
  c, //? category
  s, //? sort
  p, //? price
  r, //? rating
  pg, //? page
  ...prevFilters
}: SearchFilters & {
  c?: string;
  s?: SortingProductsOptions;
  p?: string;
  r?: string;
  pg?: string;
}) {
  const params: SearchFilters = { ...prevFilters };

  if (c) params.category = c;
  if (s) params.sort = s;
  if (p) params.price = p;
  if (r) params.rating = r;
  if (pg) params.page = pg;

  return convertSearchParamsToSearchUrl(params);
}

export const getLanguage = (locale: Locale) => {
  const locales: Record<string, typeof englishMessages> = {
    es: spanishMessages,
    en: englishMessages,
  };

  return {
    currentLanguage: locales[locale],
  };
};
