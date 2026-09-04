import { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

import "@/assets/styles/globals.css";
import { AppSettingsProvider } from "@/components/providers";
import ThemeProvider from "@/components/providers/theme-provider";
import { getAppSettings } from "@/lib/actions/app-setting.actions";
import { PUBLIC_APP_SERVER_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Locale } from "@/types";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAppSettings();

  const appName = settings.appName;
  const appDescription = settings.appDescription;
  const serverURL = PUBLIC_APP_SERVER_URL;

  return {
    title: {
      template: `%s | ${appName}`,
      default: appName,
    },
    description: appDescription,
    metadataBase: new URL(serverURL),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      suppressHydrationWarning //? silences hydration mismatch warnings.
      className={cn("h-full antialiased", inter.className)}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark" //? This provider saves a "theme" value in localStorage.
          disableTransitionOnChange
        >
          <AppSettingsProvider locale={locale as Locale}>
            {children}

            <Toaster position="bottom-right" />
          </AppSettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
