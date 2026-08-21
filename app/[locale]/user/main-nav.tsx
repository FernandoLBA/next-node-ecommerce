"use client";

import Link from "next/link";
import React from "react";

import { useSettings } from "@/components/providers";
import { userNavLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { usePathname } from "@/i18n/routing";

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

export default MainNav;
