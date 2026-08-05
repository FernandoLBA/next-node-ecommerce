"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { appRoutes } from "@/lib/constants";
import { cn } from "@/lib/utils";

const links = [
  {
    title: "Overview",
    href: appRoutes.ADMIN_OVERVIEW,
  },
  {
    title: "Products",
    href: appRoutes.ADMIN_PRODUCTS,
  },
  {
    title: "Orders",
    href: appRoutes.ADMIN_ORDERS,
  },
  {
    title: "Users",
    href: appRoutes.ADMIN_USERS,
  },
];

const AdminMainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {links.map((link) => (
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
