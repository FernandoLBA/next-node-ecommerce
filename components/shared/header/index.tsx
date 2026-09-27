import AppImage from "@/components/ui/app-image";
import { getAppSettings } from "@/lib/actions/app-setting.actions";
import { appRoutes } from "@/lib/constants";
import { AppLink } from "../app-link/app-link";
import Menu from "./menu";
import Search from "./search";

const Header = async () => {
  const settings = await getAppSettings();

  const firstPartBrand = settings.appName.slice(1, 4);
  const lastPartBrand = settings.appName.slice(4);

  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between gap-4">
        <AppLink href={appRoutes.HOME} className="flex-start gap-2">
          <AppImage
            src={`${appRoutes.IMAGES}/logo.svg`}
            alt={`${settings.appName} logo`}
            height={40}
            width={40}
            preload
          />

          <span className="hidden lg:block font-bold lowercase text-2xl dark:text-primary">
            {firstPartBrand}
            <span className="capitalize">{lastPartBrand}</span>
          </span>
        </AppLink>

        <div className="hidden md:block">
          <Search />
        </div>

        <Menu />
      </div>
    </header>
  );
};

export default Header;
