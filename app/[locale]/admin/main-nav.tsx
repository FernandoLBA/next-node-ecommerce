"use client";

import React from "react";

import { AppLink } from "@/components/shared/app-link/app-link";
import { usePathname } from "@/i18n/routing";
import { adminNavLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useSettings } from "../../../components/providers/settings-provider";

type AdminMainNavProps = React.HTMLAttributes<HTMLElement>;

const AdminMainNav = ({ className, ...props }: AdminMainNavProps) => {
  const pathname = usePathname();
  const { locale } = useSettings();
  const navTranslatedNavLinks = adminNavLinks(locale);

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {navTranslatedNavLinks.map((link) => (
        <AppLink
          key={link.href}
          href={link.href}
          isSelected={pathname.includes(link.href)}
          className={cn("hover:text-accent-foreground!")}
        >
          {link.title}
        </AppLink>
      ))}
    </nav>
  );
};

export default AdminMainNav;
