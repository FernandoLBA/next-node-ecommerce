import AppImage from "@/components/ui/app-image";
import { Link } from "@/i18n/routing";
import { getAppSettings } from "@/lib/actions/app-setting.actions";
import { appRoutes } from "@/lib/constants";
import Menu from "./menu";
import Search from "./search";

const Header = async () => {
  const settings = await getAppSettings();

  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <Link href={appRoutes.HOME} className="flex-start">
            <AppImage
              src={`${appRoutes.IMAGES}/logo.svg`}
              alt={`${settings.appName} logo`}
              height={30}
              width={30}
              preload
            />

            <span className="hidden lg:block font-bold text-2xl ml-3">
              {settings.appName}
            </span>
          </Link>
        </div>

        <div className="hidden md:block">
          <Search />
        </div>

        <Menu />
      </div>
    </header>
  );
};

export default Header;
