"use client";

import Link from "next/link";
import React from "react";

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
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname.includes(link.href) ? "" : "text-muted-foreground",
          )}
        >
          {link.title}
        </Link>
      ))}
    </nav>
  );
};

export default AdminMainNav;
