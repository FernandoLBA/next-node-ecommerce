import { EllipsisVertical, ShoppingCart } from "lucide-react";
import Link from "next/link";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../../ui/button";
import ModeToggle from "./mode-toggle";
import UserButton from "./user-button";

const Menu = () => {
  return (
    <div className="space-x-2">
      <nav className="hidden md:flex w-fit gap-1">
        <ModeToggle />

        <Button variant="ghost">
          <Link href="/cart" className="flex-between gap-1">
            <ShoppingCart /> Cart
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
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-6">
              <ModeToggle />

              <Button variant="ghost">
                <Link href="/cart">
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
