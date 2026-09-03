"use client";

import { useTranslations } from "next-intl";

import { useSettings } from "./providers";

const Footer = () => {
  const { settings } = useSettings();
  const t = useTranslations("Footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-secondary text-primary">
      <div className="p-5 flex-center">
        &copy; {currentYear} {settings.appName} {t("rights")}
      </div>
    </footer>
  );
};

export default Footer;
