"use client";

import { useTranslations } from "next-intl";
import React from "react";

import { AppLink } from "@/components/shared/app-link/app-link";
import { usePathname } from "@/i18n/routing";
import { userNavLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";

const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  const t = useTranslations("UserNav");

  const isSelected = (href: string) => {
    return pathname.includes(href);
  };

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {userNavLinks.map((link) => (
        <AppLink
          key={link.href}
          href={link.href}
          className={cn(
            `nav-links ${isSelected(link.href) && "nav-link-selected"}`,
          )}
        >
          {t(link.key)}
        </AppLink>
      ))}
    </nav>
  );
};

export default MainNav;
