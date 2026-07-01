"use client";

import { usePathname, useRouter } from "next/navigation";

import "@/assets/styles/globals.css";
import AppImage from "@/components/ui/app-image";
import { Button } from "@/components/ui/button";
import { APP_NAME, appRoutes } from "@/lib/constants";
import englishMessages from "@/messages/en.json";
import spanishMessages from "@/messages/es.json";

const locales: Record<string, typeof englishMessages> = {
  en: englishMessages,
  es: spanishMessages,
};

const DEFAULT_LOCALE = "es";

const NotFound = () => {
  const router = useRouter();
  const pathname = usePathname();

  const detectedLocale = pathname?.split("/")[1];
  const locale = locales[detectedLocale] || locales[DEFAULT_LOCALE];

  return (
    <div className="flex-center flex-col h-screen">
      <AppImage
        src="/images/logo.svg"
        alt={`${APP_NAME} logo`}
        preload
        height={48}
        width={48}
      />
      <div className="flex-center flex-col p-6 w-1/3 rounded-lg shadow-md shadow-accent text-center">
        <h1 className="text-3xl font-bold mb-4">{locale.notFoundPage.title}</h1>
        <p className="text-destructive">{locale.notFoundPage.description}</p>

        <Button
          variant="default"
          className="mt-4 ml-2"
          onClick={() => router.push(`/${detectedLocale}${appRoutes.HOME}`)}
        >
          {locale.notFoundPage.goHomeLink} x
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
