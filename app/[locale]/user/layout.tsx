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
    <div className="flex h-screen flex-col">
      <div className="border-b">
        <div className="wrapper flex-between h-16 gap-4">
          <div className="flex-start gap-6">
            <AppLink href={appRoutes.HOME} className="flex-start">
              <AppImage
                src={`${appRoutes.IMAGES}/logo.svg`}
                height={32}
                width={32}
                alt={settings.appName}
              />
            </AppLink>

            <MainNav />
          </div>

          <div className="flex-center gap-4">
            <Menu />
          </div>
        </div>
      </div>

      <main className="wrapper flex-1 space-y-4 py-6">{children}</main>
    </div>
  );
}
