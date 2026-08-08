import {
  getRequestConfig,
  type GetRequestConfigParams,
} from "next-intl/server";

import { routing } from "./routing";

/**
 * Configures the internationalization (i18n) for each request in the application.
 */
export default getRequestConfig(
  async ({
    requestLocale,
  }: {
    requestLocale: GetRequestConfigParams["requestLocale"];
  }) => {
    //* Await the locale requested by the middleware or navigation params
    let locale = await requestLocale;

    //* If the locale is not defined or not supported, fallback to the default locale
    if (
      !locale ||
      !routing.locales.includes(locale as (typeof routing.locales)[number])
    ) {
      locale = routing.defaultLocale;
    }

    return {
      locale,
      //* Dynamically load the translation messages from the dictionaries directory
      messages: (await import(`../messages/${locale}.json`)).default,
    };
  },
);
