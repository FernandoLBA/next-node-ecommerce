"use client";

import { getAppSettings } from "@/lib/actions/app-setting.actions";
import { formatError } from "@/lib/utils";
import type { Currency, Locale } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";

//? This type must be updated while the table will be updated
type AppSettings = {
  appName: string;
  appDescription: string;
  defaultCurrency: Currency;
  defaultLanguage: Locale;
  shippingFreeAmount: number;
  shippingPrice: number;
  taxPercentage: number;
};

export type SettingContextType = {
  settings: AppSettings;
  isLoading: boolean;
  locale: Locale;
};

const SettingContext = createContext<SettingContextType | null>(null);

/**
 * App settings provider
 *
 * @param param0
 * @returns
 */
export function AppSettingsProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  const [settings, setSettings] = useState<AppSettings>({} as AppSettings);
  const [isLoading, setIsloading] = useState(true);

  useEffect(() => {
    async function getSettings() {
      try {
        const appSettings = await getAppSettings();

        setSettings(appSettings as unknown as AppSettings);
      } catch (error) {
        throw new Error(formatError(error));
      } finally {
        setIsloading(false);
      }
    }

    getSettings();
  }, []);

  return (
    <SettingContext.Provider value={{ settings, isLoading, locale }}>
      {children}
    </SettingContext.Provider>
  );
}

/**
 * App settings context custom hook
 *
 * @returns
 */
export const useSettings = () => {
  const context = useContext(SettingContext);

  if (!context) {
    throw new Error("useSettings must be use within SettingsProvider");
  }

  return context;
};
