"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import { cache } from "react";

import prisma from "@/db/db";
import { AppSetting } from "@/types";

/**
 * Persistent cache between requests and different users
 */
export const getCachedAppSettings = unstable_cache(async () => {
  const appSettings = await prisma.appSetting.findMany();

  if (!appSettings) throw new Error("Failed to retreive app settings");

  return appSettings.reduce(
    (acc: Record<string, string>, curr: AppSetting) => {
      acc[curr.key] = String(curr.value ?? "");
      return acc;
    },
    {} as Record<string, string>,
  ) as AppSetting[keyof AppSetting];
});

/**
 * It memoize by HTTP request using React cache()
 */
export const getAppSettings = cache(async () => {
  return await getCachedAppSettings();
});

/**
 * Updates the app settings
 *
 * @param key
 * @param value
 * @param description
 */
export async function updateAppSetting(
  key: string,
  value: string,
  description?: string,
) {
  await prisma.appSetting.upsert({
    where: { key },
    update: { value, description },
    create: { key, value, description },
  });

  //? Invalidates istantly all cache in the whole app
  revalidateTag("app-settings", "");
}
