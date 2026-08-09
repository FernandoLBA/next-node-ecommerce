import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Link } from "@/i18n/routing";
import { getAllCategories } from "@/lib/actions/product.actions";
import { MenuIcon } from "lucide-react";

const CategoryDrawer = async () => {
  const categories = await getAllCategories();

  return (
    <Drawer swipeDirection="left">
      <DrawerTrigger
        render={
          <Button variant="outline">
            <MenuIcon />
          </Button>
        }
      />

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Select a category</DrawerTitle>
        </DrawerHeader>
        <div className="px-2 mt-4 space-y-1">
          {categories.map((c) => (
            <Button
              className="w-full justify-start"
              key={c.category}
              variant="ghost"
            >
              <Link href={`/search?category=${c.category}`}>
                {c.category} ({c._count})
              </Link>
            </Button>
          ))}
        </div>
        <DrawerFooter>
          <DrawerClose render={<Button>Cancel</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CategoryDrawer;
