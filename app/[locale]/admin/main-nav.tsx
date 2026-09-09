"use client";

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
import { Menu } from "lucide-react";
import { useSettings } from "../../../components/providers/settings-provider";

type AdminMainNavProps = React.HTMLAttributes<HTMLElement>;

const AdminMainNav = ({ className, ...props }: AdminMainNavProps) => {
  const pathname = usePathname();
  const { locale } = useSettings();
  const navTranslatedNavLinks = adminNavLinks(locale);

  const isSelected = (href: string) => {
    return pathname.includes(href);
  };

  return (
    <nav
      className={cn("flex-center text-sm space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {navTranslatedNavLinks.map((link) => (
        <AppLink
          key={link.href}
          href={link.href}
          className={`hidden sm:block nav-links ${isSelected(link.href) && "nav-link-selected"}`}
        >
          {link.title}
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
              <DropdownMenuLabel>Admin menu</DropdownMenuLabel>

              <DropdownMenuSeparator />

              {navTranslatedNavLinks.map((link) => (
                <DropdownMenuCheckboxItem
                  key={link.href}
                  checked={isSelected(link.href)}
                >
                  <AppLink href={link.href}>{link.title}</AppLink>
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
