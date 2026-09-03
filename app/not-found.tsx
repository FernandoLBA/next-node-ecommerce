"use client";

import { useRouter } from "next/navigation";

import "@/assets/styles/globals.css";
import { useSettings } from "@/components/providers/settings-provider";
import AppImage from "@/components/ui/app-image";
import { Button } from "@/components/ui/button";
import { appRoutes } from "@/lib/constants";
import englishMessages from "@/messages/en.json";
import spanishMessages from "@/messages/es.json";

const locales: Record<string, typeof englishMessages> = {
  en: englishMessages,
  es: spanishMessages,
};

const NotFound = () => {
  const router = useRouter();
  const { locale, settings } = useSettings();

  const language = locales[locale] || spanishMessages;

  return (
    <div className="flex-center flex-col h-screen">
      <AppImage
        src="/images/logo.svg"
        alt={`${settings.appName} logo`}
        preload
        height={48}
        width={48}
      />
      <div className="flex-center flex-col p-6 w-1/3 rounded-lg shadow-md shadow-accent text-center">
        <h1 className="text-3xl font-bold mb-4">
          {language.notFoundPage.title}
        </h1>
        <p className="text-destructive">{language.notFoundPage.description}</p>

        <Button
          variant="default"
          className="mt-4 ml-2"
          onClick={() => router.push(`/${locale}${appRoutes.HOME}`)}
        >
          {language.notFoundPage.goHomeLink}
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
