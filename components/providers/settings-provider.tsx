"use client";

import { createContext, useContext } from "react";

export type SettingsMap = Record<string, string>;

const SettingContext = createContext<SettingsMap>({});

/**
 * App settings provider
 *
 * @param param0
 * @returns
 */
export function SettingsProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: SettingsMap;
}) {
  return (
    <SettingContext.Provider value={value}>{children}</SettingContext.Provider>
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
