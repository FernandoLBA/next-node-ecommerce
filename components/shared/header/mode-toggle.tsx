"use client";

import { MoonIcon, SunIcon, SunMoon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { FC, PropsWithChildren, useEffect, useState } from "react";

import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

const THEMES = [
  { value: "system", label: "System", icon: SunMoon },
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
] as const;

type Theme = (typeof THEMES)[number]["value"];

const THEME_ICONS: Record<Theme, React.ElementType> = {
  light: SunIcon,
  dark: MoonIcon,
  system: SunMoon,
};

const ModeToggle: FC<PropsWithChildren> = ({ children }) => {
  const t = useTranslations("Menu");
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  //#region(mismatch issue)
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!mounted) return null;
  //#endregion

  const currentTheme = (theme as Theme) ?? "system";
  const ActiveIcon = THEME_ICONS[currentTheme];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" className="cursor-pointer" />}>
        <ActiveIcon aria-hidden />
        {children}
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("themes.title")}</DropdownMenuLabel>

          <DropdownMenuSeparator />

          {THEMES.map(({ value }) => (
            <DropdownMenuCheckboxItem
              key={value}
              checked={currentTheme === value}
              onCheckedChange={() => setTheme(value)}
            >
              {t(`themes.${value}`)}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ModeToggle;
