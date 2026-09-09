import { EllipsisVertical, ShoppingCart } from "lucide-react";
import { getTranslations } from "next-intl/server";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getAllCategories } from "@/lib/actions/product.actions";
import { appRoutes } from "@/lib/constants";
import { AppButton } from "../app-button/app-button";
import { AppLink } from "../app-link/app-link";
import LanguageToggle from "./language-toggle";
import ModeToggle from "./mode-toggle";
import UserButton from "./user-button";

const Menu = async () => {
  const t = await getTranslations("Menu");
  const categories = await getAllCategories();

  return (
    <div className="space-x-2">
      <nav className="hidden md:flex w-fit gap-1">
        <ModeToggle />

        <LanguageToggle />

        <AppButton variant="ghost">
          <AppLink
            href={appRoutes.CART}
            className="flex-between gap-1"
          >
            <ShoppingCart />
          </AppLink>
        </AppButton>

        <UserButton />
      </nav>

      <nav className="block md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>

          <SheetContent className="flex flex-col items-center">
            <SheetHeader className="self-start">
              <SheetTitle>{t("title")}</SheetTitle>
            </SheetHeader>

            <div className="flex flex-col w-full items-start gap-2 pl-3">
              <ModeToggle>Theme</ModeToggle>

              <LanguageToggle>Language</LanguageToggle>

              <AppButton variant="ghost">
                <AppLink className="flex gap-2 text-foreground" href={appRoutes.CART}>
                  <ShoppingCart /> {t("cartTitle")}
                </AppLink>
              </AppButton>

              <UserButton>Account</UserButton>
            </div>

            <SheetHeader>
              <SheetTitle>Categories</SheetTitle>

              <SheetDescription>
                Navigate in our exclusive departmanets and find that thing that
                you don&apos;t know you but you do!
              </SheetDescription>
            </SheetHeader>

            <div className="w-full px-6">
              <ul className="flex justify-start flex-col">
                {categories.map((c) => (
                  <AppLink
                    key={c.category}
                    href={`${appRoutes.SEARCH}?category=${c.category}`}
                    className="border-b border-muted-foreground p-4"
                  >
                    {c.category}({c._count})
                  </AppLink>
                ))}
              </ul>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
