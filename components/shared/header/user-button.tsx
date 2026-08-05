import { UserIcon } from "lucide-react";

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
import { appRoutes } from "@/lib/constants";

async function UserButton() {
  const session = await auth();

  if (!session) {
    return (
      <Button>
        <Link className="flex-between gap-1" href={appRoutes.SIGN_IN}>
          <UserIcon /> Sign In
        </Link>
      </Button>
    );
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="relative w-8 h-8 rounded-full ml-2 flex-center bg-gray-200"
          >
            {firstInitial}
          </Button>
        }
      />

      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuGroup>
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
            <Link href={appRoutes.USER_PROFILE} className="w-full">
              User Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link href={appRoutes.USER_ORDERS} className="w-full">
              Order History
            </Link>
          </DropdownMenuItem>

          {session.user.role === "admin" && (
            <DropdownMenuItem>
              <Link href={appRoutes.ADMIN_OVERVIEW} className="w-full">
                Admin
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem className="p-0 mb-1">
            <form action={signOutUser} className="w-full">
              <Button
                className="w-full py-4 px-2 h-4 justify-start"
                variant="ghost"
                type="submit"
              >
                Sign Out
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserButton;
