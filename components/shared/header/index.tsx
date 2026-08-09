import AppImage from "@/components/ui/app-image";
import { Link } from "@/i18n/routing";
import { APP_NAME, appRoutes } from "@/lib/constants";
import Menu from "./menu";
import CategoryDrawer from "./category-drawer";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <CategoryDrawer />

          <Link href={appRoutes.HOME} className="flex-start ml-4">
            <AppImage
              src="/images/logo.svg"
              alt={`${APP_NAME} logo`}
              height={30}
              width={30}
              preload
            />

            <span className="hidden lg:block font-bold text-2xl ml-3">
              {APP_NAME}
            </span>
          </Link>
        </div>

        <Menu />
      </div>
    </header>
  );
};

export default Header;
