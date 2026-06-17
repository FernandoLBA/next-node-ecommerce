import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

import { DEFAULT_LANGUAGE, LANGUAGES } from "@/lib/constants";

/**
 * Configures the shared routing logic for the application.
 * Defines the supported locales and the default locale used when no match is found.
 */
export const routing = defineRouting({
  locales: LANGUAGES,
  defaultLocale: DEFAULT_LANGUAGE,
});

/**
 * Localized navigation utilities.
 * These should be used throughout the app instead of 'next/link' or 'next/navigation'
 * to ensure that the current locale is automatically prefixed to the URL.
 */
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
