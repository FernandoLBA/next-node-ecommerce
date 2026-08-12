"use client";

import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { FC, PropsWithChildren } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "@/i18n/routing";
import { LANGUAGES } from "@/lib/constants";

const LanguageToggle: FC<PropsWithChildren> = ({ children }) => {
  const t = useTranslations("Menu");
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const switchLocale = (newLocale: string) => {
    router.push(pathname, { locale: newLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button className="cursor-pointer" variant="ghost" />}
      >
        <Globe aria-hidden />
        {children}
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("languages.title")}</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {LANGUAGES.map((value) => (
            <DropdownMenuCheckboxItem
              key={value}
              checked={locale === value}
              onCheckedChange={() => switchLocale(value)}
            >
              {t(`languages.${value}`)}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageToggle;
