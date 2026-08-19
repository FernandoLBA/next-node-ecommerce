"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { adminNavLinks } from "@/lib/constants";
import { cn, getLocaleFromPathname } from "@/lib/utils";

type AdminMainNavProps = React.HTMLAttributes<HTMLElement>;

const AdminMainNav = ({ className, ...props }: AdminMainNavProps) => {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
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
