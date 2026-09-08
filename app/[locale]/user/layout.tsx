import { AppLink } from "@/components/shared/app-link/app-link";
import Menu from "@/components/shared/header/menu";
import AppImage from "@/components/ui/app-image";
import { getAppSettings } from "@/lib/actions/app-setting.actions";
import { appRoutes } from "@/lib/constants";
import MainNav from "./main-nav";

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getAppSettings();
  return (
    <>
      <div className="flex flex-col">
        <div className="border-b container mx-auto">
          <div className="flex-center h-16 px-4">
            <AppLink href={appRoutes.HOME} className="w-22">
              <AppImage
                src={`${appRoutes.IMAGES}/logo.svg`}
                height={30}
                width={30}
                alt={settings.appName}
              />
            </AppLink>

            <MainNav className="mx-6" />

            <div className="ml-auto flex-center space-x-4">
              <Menu />
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4 p-8 pt-6 container mx-auto">
          {children}
        </div>
      </div>
    </>
  );
}
