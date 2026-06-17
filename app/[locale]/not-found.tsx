"use client";

import { useTranslations } from "next-intl";

import AppImage from "@/components/ui/app-image";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";
import { APP_NAME, appRoutes } from "@/lib/constants";

const NotFoundPage = () => {
  const router = useRouter();
  const t = useTranslations("NotFoundPage");

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
        <h1 className="text-3xl font-bold mb-4">{t("NotFound")}</h1>
        <p className="text-destructive">{t("Could not find requested page")}</p>
        <Button
          variant="default"
          className="mt-4 ml-2"
          onClick={() => router.push(appRoutes.HOME)}
        >
          {t("Back Home")}
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
