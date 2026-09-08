import {
  LogOut,
  Shield,
  ShoppingBag,
  UserIcon,
  UserRoundPen,
} from "lucide-react";
import { getLocale } from "next-intl/server";
import { FC, PropsWithChildren } from "react";

import { auth } from "@/auth";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutUser } from "@/lib/actions/user.actions";
import { appRoutes, userRoles } from "@/lib/constants";
import { cn, getLanguage } from "@/lib/utils";
import { Locale } from "@/types";
import { AppButton } from "../app-button/app-button";
import { AppLink } from "../app-link/app-link";

export const UserButton: FC<PropsWithChildren> = async ({ children }) => {
  const session = await auth();
  const locale = await getLocale();
  const { currentLanguage } = getLanguage(locale as Locale);
  const commonLinkClasses = "w-full flex-start gap-2";

  if (!session) {
    return (
      <AppLink
        className={cn(buttonVariants(), "flex-between gap-1")}
        href={appRoutes.SIGN_IN}
      >
        <UserIcon /> {currentLanguage.Menu.userButton.signIn}
      </AppLink>
    );
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <DropdownMenu>
      <div className="flex items-center gap-2 font-medium">
        <DropdownMenuTrigger
          render={
            <AppButton
              id="user-button"
              className="relative w-8 h-8 rounded-full ml-2 flex-center cursor-pointer"
            >
              {firstInitial}
            </AppButton>
          }
        />

        <label htmlFor="user-button" className="cursor-pointer">
          {children}
        </label>
      </div>

      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuGroup className="flex flex-col gap-2">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <div className="text-sm font-bold leading-none">
                {session.user?.name}
              </div>

              <div className="text-sm text-muted-foreground leading-none">
                {session.user?.email}
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuItem>
            <AppLink
              href={appRoutes.USER_PROFILE}
              className={commonLinkClasses}
            >
              <UserRoundPen />
              {currentLanguage.Menu.userButton.userProfile}
            </AppLink>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <AppLink href={appRoutes.USER_ORDERS} className={commonLinkClasses}>
              <ShoppingBag />
              {currentLanguage.Menu.userButton.orderHistory}
            </AppLink>
          </DropdownMenuItem>

          {session.user.role === userRoles.ADMIN && (
            <DropdownMenuItem>
              <AppLink
                href={appRoutes.ADMIN_OVERVIEW}
                className={commonLinkClasses}
              >
                <Shield />
                {currentLanguage.Menu.userButton.admin}
              </AppLink>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem className="p-0  mb-1">
            <form action={signOutUser} className="w-full">
              <AppButton className="w-full py-4 px-2.5 h-4" type="submit">
                <LogOut />
                {currentLanguage.Menu.userButton.signOut}
              </AppButton>
            </form>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
