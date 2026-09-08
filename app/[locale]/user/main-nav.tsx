"use client";

import React from "react";

import { useSettings } from "@/components/providers";
import { AppLink } from "@/components/shared/app-link/app-link";
import { usePathname } from "@/i18n/routing";
import { userNavLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";

const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  const { locale } = useSettings();

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {userNavLinks(locale).map((link) => (
        <AppLink
          key={link.href}
          href={link.href}
          className="hover:text-accent-foreground"
          isSelected={pathname.includes(link.href)}
        >
          {link.title}
        </AppLink>
      ))}
    </nav>
  );
};

export default MainNav;
