import { EllipsisVertical, ShoppingCart } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "@/i18n/routing";
import { appRoutes } from "@/lib/constants";
import { getTranslations } from "next-intl/server";
import { Button } from "../../ui/button";
import LanguageToggle from "./language-toggle";
import ModeToggle from "./mode-toggle";
import UserButton from "./user-button";

const Menu = async () => {
  const t = await getTranslations("Menu");

  return (
    <div className="space-x-2">
      <nav className="hidden md:flex w-fit gap-1">
        <ModeToggle />
        <LanguageToggle />

        <Button variant="ghost">
          <Link href={appRoutes.CART} className="flex-between gap-1">
            <ShoppingCart /> {t("cartTitle")}
          </Link>
        </Button>

        <UserButton />
      </nav>

      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>

          <SheetContent className="flex flex-col items-center">
            <SheetHeader className="self-start">
              <SheetTitle>{t("title")}</SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-6">
              <ModeToggle />
              <LanguageToggle />

              <Button variant="ghost">
                <Link href={appRoutes.CART}>
                  <ShoppingCart />
                </Link>
              </Button>

              <UserButton />
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
