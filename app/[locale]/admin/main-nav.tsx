"use client";

import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { AppButton } from "@/components/shared/app-button/app-button";
import { AppLink } from "@/components/shared/app-link/app-link";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "@/i18n/routing";
import { adminNavLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";

type AdminMainNavProps = React.HTMLAttributes<HTMLElement>;

const AdminMainNav = ({ className, ...props }: AdminMainNavProps) => {
  const pathname = usePathname();
  const t = useTranslations("AdminPages.nav");

  const isSelected = (href: string) => {
    return pathname.includes(href);
  };

  return (
    <nav
      className={cn("flex-center text-sm space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {adminNavLinks.map((link) => (
        <AppLink
          key={link.href}
          href={link.href}
          className={`hidden sm:block nav-links ${isSelected(link.href) && "nav-link-selected"}`}
        >
          {t(link.key)}
        </AppLink>
      ))}

      <div className="block md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <AppButton variant="outline" className="cursor-pointer">
                <Menu aria-hidden />
              </AppButton>
            }
          />

          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>{t("menuLabel")}</DropdownMenuLabel>

              <DropdownMenuSeparator />

              {adminNavLinks.map((link) => (
                <DropdownMenuCheckboxItem
                  key={link.href}
                  checked={isSelected(link.href)}
                >
                  <AppLink href={link.href}>{t(link.key)}</AppLink>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default AdminMainNav;
