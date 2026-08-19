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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/i18n/routing";
import { signOutUser } from "@/lib/actions/user.actions";
import { appRoutes, userRoles } from "@/lib/constants";
import { getLanguage } from "@/lib/utils";
import { Locale } from "@/types";

export const UserButton: FC<PropsWithChildren> = async ({ children }) => {
  const session = await auth();
  const locale = await getLocale();
  const { currentLanguage } = getLanguage(locale as Locale);

  if (!session) {
    return (
      <Button>
        <Link className="flex-between gap-1" href={appRoutes.SIGN_IN}>
          <UserIcon /> {currentLanguage.Menu.userButton.signIn}
        </Link>
      </Button>
    );
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <DropdownMenu>
      <div className="flex items-center gap-2 font-medium">
        <DropdownMenuTrigger
          render={
            <Button
              id="user-button"
              className="relative w-8 h-8 rounded-full ml-2 flex-center cursor-pointer"
            >
              {firstInitial}
            </Button>
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
            <Link
              href={appRoutes.USER_PROFILE}
              className="w-full flex-start gap-2"
            >
              <UserRoundPen />
              {currentLanguage.Menu.userButton.userProfile}
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link
              href={appRoutes.USER_ORDERS}
              className="w-full flex-start gap-2"
            >
              <ShoppingBag />
              {currentLanguage.Menu.userButton.orderHistory}
            </Link>
          </DropdownMenuItem>

          {session.user.role === userRoles.ADMIN && (
            <DropdownMenuItem>
              <Link
                href={appRoutes.ADMIN_OVERVIEW}
                className="w-full flex-start gap-2"
              >
                <Shield />
                {currentLanguage.Menu.userButton.admin}
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem className="p-0  mb-1">
            <form action={signOutUser} className="w-full">
              <Button className="w-full py-4 px-2.5 h-4" type="submit">
                <LogOut />
                {currentLanguage.Menu.userButton.signOut}
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
