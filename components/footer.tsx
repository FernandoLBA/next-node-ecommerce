"use client";

import { useTranslations } from "next-intl";

import { APP_NAME } from "@/lib/constants";

const Footer = () => {
  const t = useTranslations("Footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-secondary text-primary">
      <div className="p-5 flex-center">
        {currentYear} {APP_NAME}. {t("rights")}
      </div>
    </footer>
  );
};

export default Footer;
